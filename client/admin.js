Template.admin.helpers({
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
  }
});