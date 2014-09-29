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
  },
  "change .mentor-select": function (event) {
    var newMentorEmail = event.target.value;

    if (newMentorEmail.indexOf("@") === -1) {
      // do nothing, this is the placeholder item
      return;
    }

    var newMentorId = Meteor.users.findOne({"emails.address": newMentorEmail})._id;

    var student = this;

    Meteor.call("changeMentor", student._id, newMentorId);

    event.target.options[0].selected="selected";
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
  "mentorOf": function (studentId) {
    var group = UserGroups.findOne({users: studentId});

    if (group) {
      return Meteor.users.findOne(group.owner);
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
  },
  "adminEmails": function () {
    var adminEmails = _.compact(_.map(UserGroups.find().fetch(), function (group) {
      var owner = Meteor.users.findOne({_id: group.owner});
      if (owner) {
        return owner.emails[0].address;
      }
    }));

    return ["change to..."].concat(adminEmails);
  },
  "isMentor": function (admin, student) {
    var group = UserGroups.findOne({users: student._id});

    return group.owner === admin._id;
  }
});