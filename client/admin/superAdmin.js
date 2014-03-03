Template.superAdmin.helpers({
  "usersToShow": function(level) {
    var usersToShow = {};
    usersToShow.level = level;
    if (Meteor.user().isSuperAdmin) {
      usersToShow.users = Meteor.users.find({isAdmin: {$not: true}, isSuperAdmin: {$not: true}, level: level }, {sort: {level: 1}});
    }
    return usersToShow;
  }
});