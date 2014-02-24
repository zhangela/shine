Meteor.methods({
  "updateCompletedAssignmentsForUser": function(assignmentID, correctAnswers) {
    var assignment = Assignments.findOne(assignmentID);
    var assignmentResult = {};
    assignmentResult[assignment.name] = {
        assignmentID: assignmentID,
        numCorrect: correctAnswers.length,
        numTotal: assignment.questions.length,
        correctAnswers: correctAnswers
      };

    Meteor.users.update(
      {_id: this.userId},
      {
        $push: {completed: assignmentResult}
      }
    );
  }
});

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'completed': 1}});
});

Meteor.startup(function () {
  // code to run on server at startup
});