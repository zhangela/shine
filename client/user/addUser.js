Template.addUser.events({
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

Template.addUser.helpers({
  "userGroup": function() {
    if (Meteor.user()) {
      return UserGroups.findOne({owner: Meteor.userId()});
    }
  }
});