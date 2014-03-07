Template.question.greeting = function () {
  return "Welcome to shine.";
};

Template.question.helpers({
  "isMultipleChoice": function(question) {
    return question.questionType === 'Multiple Choice';
  },
  "savedAnswerText": function() {
    return SavedAnswers.findOne({
      userId: Meteor.userId(),
      questionID: this._id
    }).answerText;
  },
  "savedAnswerOption": function(option) {
    var savedAnswer = SavedAnswers.findOne({
      userId: Meteor.userId(),
      questionID: this._id
    });

    return savedAnswer &&
      (savedAnswer.answerOption === "answerOption" + option);
  }
});