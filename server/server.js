Meteor.methods({
  "updateCompletedAssignmentsForUser": function(assignmentID, correctAnswers) {
    var assignment = Assignments.findOne(assignmentID);
    var assignmentName = assignment.name;
    var assignmentResult = {
        assignmentID: assignmentID,
        numCorrect: correctAnswers.length,
        numTotal: assignment.questions.length,
        correctAnswers: correctAnswers
      };

    Meteor.users.update(
      {_id: this.userId},
      {
        $push: {
          completed: {
            name: assignmentName,
            result: assignmentResult
          }
        }
      }
    );
  },
  "addNewUser": function(user) {
    var userID = Accounts.createUser(user);
    var currentUserGroupID = UserGroups.findOne({owner: Meteor.userId()})._id;
    UserGroups.update({_id: currentUserGroupID}, {$push: {users: userID}});
  }
});

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'completed': 1, 'emails': 1}});
});

Meteor.publish("allUsersData", function() {
    return Meteor.users.find({},
        {fields: {'completed': 1, 'emails': 1}});
});

Meteor.startup(function () {
  // code to run on server at startup
});