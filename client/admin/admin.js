Template.admin.helpers({
  "tabNameIsUsers": function() {
    return Session.get("adminTabName") === "users";
  },
  "usersInUserGroup": function() {
    if (Meteor.userId()) {
      var userGroup = UserGroups.findOne({owner: Meteor.userId()});
      if (userGroup) {
        return userGroup.users;
      }
    }
  },
  "userEmailFromID": function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (user) {
      return user.emails[0].address;
    }
  },
  "usersToShow": function(level) {
    var usersToShow = {};
    usersToShow.level = level;
    if (Meteor.user()) {
      usersToShow.users = UserGroups.findOne({owner: Meteor.userId()}).users;
    }
    return usersToShow;
  },
  "newAssignment": function () {
    // empty assignment for new assignment form
    return {};
  }
});

Template.admin.events({
  "click .setTabNameToUsers": function() {
    Session.set("adminTabName", "users");
  },
  "click .setTabNameToAssignments": function() {
    Session.set("adminTabName", "assignments");
  }
});

Session.setDefault("adminTabName", "assignments");
