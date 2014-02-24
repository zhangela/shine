Meteor.methods({
  "updateCompletedAssignmentsForUser": function(assignmentID, correctAnswers) {
    var assignmentName = Assignments.findOne(assignmentID).name;
    var assignmentResult = {};
    assignmentResult[assignmentName] = {
        assignmentID: assignmentID,
        correctAnswers: correctAnswers
      };
      
    console.log(assignmentResult);
    Meteor.users.update(
      {_id: this.userId},
      {
        $push: {scores: assignmentResult}
      }
    );
  }
});

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'scores': 1}});
});

Meteor.startup(function () {
  // code to run on server at startup
});