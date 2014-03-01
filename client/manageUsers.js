Template.manageUsers.events({
  "submit form": function(event) {
    event.preventDefault();
  },
  "click .createUserBtn": function(event, template) {
    var formObj = template.find("form");
    var formJson = FormUtils.serializeForm(formObj);
    Meteor.call("addNewUser", formJson, function (error) {
      if (error) {
        alert("Error with adding user: " + error.reason);
      } else {
        formObj.reset();
      }
    });
  },
  "click .createGroupBtn": function() {
    Meteor.call("createUserGroup");
  }
});

Template.manageUsers.helpers({
  "assignments": function() {
    return Assignments.find();
  },
  "userGroup": function() {
    if (Meteor.user()) {
      return UserGroups.findOne({owner: Meteor.userId()});
    }
  },
  "userIDToUser": function(userID) {
    return Meteor.users.findOne(userID);
  },
  "first": function(emails) {
    if (emails) {
      return emails[0].address;
    }
  }
});