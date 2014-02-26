Template.assignment.events({
  "submit form": function(event) {
    event.preventDefault();
  },
  "click button": function(event, template) {
    var formObjs = template.findAll("form");
    var answerArray = [];
    _.each(formObjs, function(formObj) {
      var formJson = FormUtils.serializeForm(formObj);
      answerArray.push(formJson);
      formObj.reset();
    });

    var correctAnswers = [];
    _.each(answerArray, function(answer) {
      var questionObj = Questions.findOne(answer.questionID);
      if (questionObj.answerCorrectOption === answer.answerOption) {
        correctAnswers.push(answer.questionID);
      }
    });

    var assignmentID = $(template.find(".assignmentID")).text();

    Meteor.call(
      "updateCompletedAssignmentsForUser",
      assignmentID,
      correctAnswers,
      function(error, result) {
    });
  }
});

Template.assignment.helpers({
  "questionObjFromID": function() {
    return Questions.findOne({_id: this.valueOf()});
  },
  "completedByCurrentUser": function() {
    if (Meteor.user()) {
      var completedAssignments = _.map(Meteor.user().completed, function(test) {
        return test.name;
      });
      return _.contains(completedAssignments, this.name);
    }
  },
  "currentAssignmentScore": function(assignmentName) {
    if (Meteor.user()) {
      console.log(Meteor.user().completed);

      var testResult = _.find(Meteor.user().completed, function(test) {
        return test.name === assignmentName;
      });
      return testResult.result.numCorrect / testResult.result.numTotal * 100;
    }
  }
});