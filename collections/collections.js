Assignments = new Meteor.Collection("assignments");
Questions = new Meteor.Collection("questions");

UserGroups = new Meteor.Collection("usergroups");

if (Meteor.isServer) {
  Meteor.publish("assignments", function () {
    return Assignments.find({});
  });

  Meteor.publish("questions", function () {
    return Questions.find({});
  });

  Meteor.publish("userGroups", function () {
    if (this.userId && Meteor.user().isAdmin) {
      // admin can see all user groups
      return UserGroups.find({});
    } else if (this.userId) {
      // owners can see their groups
      return UserGroups.find({owner: this.userId});
    }
  });
}