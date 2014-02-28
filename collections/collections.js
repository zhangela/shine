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
    return UserGroups.find({});
  });
}