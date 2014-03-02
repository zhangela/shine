Meteor.methods({
  // assignments
  createAssignment: function (assignment) {
    // XXX add permissions
    // XXX add validation

    Assignments.insert(assignment);
  },

  // user groups
  createUserGroup: function () {
    UserGroups.insert({
      owner: this.userId
    });
  },

  // questions
  createQuestion: function (question) {
    // XXX add validation
    // XXX add permissions

    var questionID = Questions.insert(question);
    var assignmentID = question.questionAssignment;

    Assignments.update({
      _id: assignmentID
    }, {
      $push: {questions: questionID}
    });
  },

  deleteQuestion: function(questionID) {
    console.log(questionID);
    var question = Questions.findOne({_id: questionID});
    Assignments.update({_id: question.questionAssignment}, {$pull: {questions: questionID}});
    Questions.remove({_id: questionID});
  }
});