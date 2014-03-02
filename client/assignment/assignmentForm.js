Template.assignmentForm.events({
  "submit form": function(event) {
    event.preventDefault();
  },
  "click .createAssignmentBtn": function(event, template) {
    var formObj = template.find("form");
    var formJson = FormUtils.serializeForm(formObj);
    if (formJson.assignmentType === "Other") {
      formJson.assignmentType = formJson.assignmentTypeCustomName.split(" ")[0].toLowerCase();
    } else {
      formJson.assignmentType = formJson.assignmentType.toLowerCase();
    }

    if (this._id) {
      formJson._id = this._id; // if we are editing an existing assignment
    }
    
    Meteor.call("saveAssignment", formJson, function (error, newAssignment) {
      if (error) {
        alert("Error with saving assignment: " + error.reason);
      } else {
        formObj.reset();
        Session.set("assignmentType", null);

        if (Router.current().route.name === "editAssignment") {
          Router.go("editAssignment", newAssignment);
        }
      }
    });
  },
  "change select[name=assignmentType]": function(event) {
    Session.set("assignmentType", event.target.value);
  }
});

Template.assignmentForm.helpers({
  "isTypeOther": function() {
    if (Session.get("assignmentType")) {
      return Session.get("assignmentType") === "Other";
    } else {
      return ! _.contains(["exercise", "homework", "challenge"],
        this.assignmentType);
    }
  },
  "assignments": function() {
    return Assignments.find();
  }
});