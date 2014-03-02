Template.allUsers.events({
  "click .addStarBtn": function() {
    Meteor.call("addStarForUser", this._id);
  },
  "click .delete": function (event) {
    event.preventDefault();

    if (confirm("[WARNING] This cannot be reverted. Delete this user?")) {
      Meteor.call("deleteUser", this._id);
    }
  }
});

Template.allUsers.helpers({
  "assignments": function() {
    return Assignments.find();
  },
  "allUsers": function() {
    if (Meteor.user()) {
      if (Meteor.user().isSuperAdmin) {
        return Meteor.users.find();
      }
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
  },
  "role": function() {
    if (Permissions.isAdmin(this)) {
      return "Admin";
    } else {
      return "Student";
    }
  }
});