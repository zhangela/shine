Template.superAdmin.helpers({
  "tabNameIsUsers": function() {
    return Session.get("superAdminTabName") === "users";
  },
  "tabNameIsAdmins": function() {
    return Session.get("superAdminTabName") === "admins";
  },
  "tabNameIsAssignments": function() {
    return Session.get("superAdminTabName") === "assignments";
  },
  "usersToShow": function(level) {
    var usersToShow = {};
    usersToShow.level = level;
    if (Meteor.user() && Meteor.user().isSuperAdmin) {
      usersToShow.users = Meteor.users.find({isAdmin: {$not: true}, isSuperAdmin: {$not: true}, level: level }, {sort: {level: 1}});
    }
    return usersToShow;
  }
});

Template.superAdmin.events({
  "click .setTabNameToUsers": function() {
    Session.set("superAdminTabName", "users");
  },
  "click .setTabNameToAssignments": function() {
    Session.set("superAdminTabName", "assignments");
  },
  "click .setTabNameToAdmins": function() {
    Session.set("superAdminTabName", "admins");
  }
});

Session.setDefault("superAdminTabName", "assignments");