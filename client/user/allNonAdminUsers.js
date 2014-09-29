Template.allNonAdminUsers.events({
  "click .addStarBtn": function() {
    Meteor.call("addStarForUser", this._id);
  },
  "click .removeStarBtn": function() {
    Meteor.call("removeStarForUser", this._id);
  },
  "click .delete": function (event) {
    event.preventDefault();

    if (confirm("[WARNING] This cannot be reverted. Delete this user?")) {
      Meteor.call("deleteUser", this._id);
    }
  }
});

Template.allNonAdminUsers.helpers({
  "assignments": function(level) {
    return Assignments.find({assignmentLevel: level}, {sort: {weekNum: 1, assignmentType: 1}});
  },
  "displayedAssignmentName": function() {
    return "Week " + this.weekNum + " " + this.assignmentType.toProperCase();
  },
  "userIsCorrectLevel": function(level) {
    return this.level === level;
  },
  "userIDToUser": function(userID) {
    return Meteor.users.findOne(userID);
  },
  "email": function() {
    if (this.emails) {
      return this.emails[0].address;
    }
  },
  "completed": function(assignmentId, user) {
    userCompletedAssignmentIds = _.map(user.completed, function(assignment) {
        return assignment._id;
    });
    if (_.contains(userCompletedAssignmentIds, assignmentId)) {
      var thisAssignment = _.find(user.completed, function(completedAssignment) {
        return completedAssignment._id === assignmentId;
      });
      return Math.round(100 * thisAssignment.result.numCorrect / thisAssignment.result.numTotal);
    } else {
      return "Not Completed";
    }
  }
});