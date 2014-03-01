Template.users.helpers({
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
  },
  "completedAssignmentNames": function(completed) {
    var completedAssignmentNames = [];
    _.each(completed, function(assignment) {
      completedAssignmentNames.push("Week " + assignment.weekNum + " " + assignment.assignmentType.toProperCase());
    });
    return completedAssignmentNames.join(", ");
  }
});