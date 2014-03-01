Template.addQuestion.events({
  "submit form": function(event) {
    event.preventDefault();
  },
  "click .submitBtn": function(event, template) {
    var formObj = template.find("form");
    var formJson = FormUtils.serializeForm(formObj);
    
    Meteor.call("createQuestion", function (error) {
      if (! error) {
        formObj.reset();
        Session.set("uploadedImage", null);
      } else {
        alert("Error with saving question: " + error.reason);
      }
    });
  },
  "change select[name=questionType]": function(event) {
    Session.set("questionType", event.target.value);
  },

  "click .uploadBtn": function(event, template) {
    filepicker.pick({
      mimetypes: ['image/*', 'text/plain'],
      container: 'window',
      services:['COMPUTER'],
    },
    function(imageJson){
      Session.set("uploadedImage", imageJson.url);
    },
    function(FPError){
      console.log(FPError.toString());
    }
  );
  }
});

Template.addQuestion.helpers({
  "assignments": function() {
    return Assignments.find();
  },
  "uploadedImage": function() {
    return Session.get("uploadedImage");
  },
  "isMultipleChoice": function() {
    return Session.get("questionType") === "Multiple Choice";
  }
});

Session.setDefault("questionType", "Multiple Choice");