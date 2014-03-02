Template.users.events({
  "click .addStarBtn": function() {
    Meteor.call("addStarForUser", this._id);
  },
  "click .delete": function (event) {
    event.preventDefault();
    
    Meteor.call("removeUserFromOwnedGroup", this._id);
  }
});

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
  "email": function() {
    if (this.emails) {
      return this.emails[0].address;
    }
  },
  "completedAssignmentNames": function() {
    var completedAssignmentNames = [];
    _.each(this.completed, function(assignment) {
      if (assignment.assignmentType) {
        completedAssignmentNames.push("Week " + assignment.weekNum + " "
          + assignment.assignmentType.toProperCase());
      }
    });
    return completedAssignmentNames.join(", ");
  }
});