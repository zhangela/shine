Template.manageUsers.events({
  "submit form": function(event) {
    event.preventDefault();
  },
  "click .createUserBtn": function(event, template) {
    var formObj = template.find("form");
    var formJson = FormUtils.serializeForm(formObj);
    Meteor.call("addNewUser", formJson, function(error, userID) {
      if (!error) {
        var currentUserGroupID = UserGroups.findOne({owner: Meteor.userId()})._id;
        UserGroups.update({_id: currentUserGroupID}, {$push: {users: userID}});
      }
    });
    formObj.reset();
  },
  "click .createGroupBtn": function() {
      UserGroups.insert({owner: Meteor.userId()});
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