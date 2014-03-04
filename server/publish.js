Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
    {fields: {'completed': 1, 'emails': 1, 'level': 1, 'isSuperUser': 1}});
});

Meteor.publish("allUsersData", function() {
  return Meteor.users.find({},
    {fields: {'completed': 1, 'emails': 1, 'level': 1}});
});

Meteor.publish("assignments", function () {
  return Assignments.find({});
});

Meteor.publish("questions", function () {
  return Questions.find({});
});

Meteor.publish("userGroups", function () {
  if (this.userId) {
    var currentUser = Meteor.users.find(this.userId);

    if (Permissions.isAdmin(currentUser)) {
      // admin can see all user groups
      return UserGroups.find({});
    } else {
      // owners can see their groups
      return UserGroups.find({owner: this.userId});
    }
  }
});

Meteor.publish("users", function () {
  return Meteor.users.find({});
});