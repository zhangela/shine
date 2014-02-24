Template.assignment.events({
  "submit form": function(event) {
    event.preventDefault();
  },
  "click button": function(event, template) {
    var formObjs = template.findAll("form");
    var answerArray = [];
    _.each(formObjs, function(formObj) {
      var formJson = FormUtils.serializeForm(formObj);
      console.log(formJson);
      answerArray.push(formJson);
      formObj.reset();
    });

    var correctAnswers = [];
    _.each(answerArray, function(answer) {
      console.log(answer.answerOption);
      var questionObj = Questions.findOne(answer.questionID);
      console.log(questionObj.answerCorrectOption);
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
        console.log("updated");
    });
  }
});

Template.assignment.helpers({
  "questionObjFromID": function() {
    return Questions.findOne({_id: this.valueOf()});
  }
});