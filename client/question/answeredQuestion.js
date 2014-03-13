Template.answeredQuestion.helpers({
  "isMultipleChoice": function(question) {
    return question.questionType === 'Multiple Choice';
  },
  "savedAnswerText": function() {
    var savedAnswer = SavedAnswers.findOne({
      userId: Meteor.userId(),
      questionID: this._id
    });

    return savedAnswer && savedAnswer.answerText;
  },
  "savedAnswerOption": function() {
    var savedAnswer = SavedAnswers.findOne({
      userId: Meteor.userId(),
      questionID: this._id
    });

    if (savedAnswer && savedAnswer.answerOption) {
      return _.last(savedAnswer.answerOption.split(""));
    } else {
      return "No Answer";
    }
  },
  "answerCorrectOption": function () {
    return this.answerCorrectOption &&
      _.last(this.answerCorrectOption.split(""));
  },
  correct: function () {
    var savedAnswer = SavedAnswers.findOne({
      userId: Meteor.userId(),
      questionID: this._id
    });

    return Utils.answerCorrectForQuestion(savedAnswer, this);
  }
});