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
    console.log(Meteor.user()); //undefined
    console.log(this.name);
    return _.contains(Meteor.user(), this.name);
  }
});