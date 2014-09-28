Template.question.helpers({
  "isMultipleChoice": function(question) {
    return question.questionType === 'Multiple Choice';
  },
  "savedAnswerText": function() {
    var savedAnswer = SavedAnswers.findOne({
      userId: Session.get("idOfAdminPretendingToBeUser") || Meteor.userId(),
      questionID: this._id
    });

    return savedAnswer && savedAnswer.answerText;
  },
  "savedAnswerOption": function(option) {
    var savedAnswer = SavedAnswers.findOne({
      userId: Session.get("idOfAdminPretendingToBeUser") || Meteor.userId(),
      questionID: this._id
    });

    return savedAnswer &&
      (savedAnswer.answerOption === "answerOption" + option);
  },
  checkedIfOption: function (option) {
    var savedAnswer = SavedAnswers.findOne({
      userId: Session.get("idOfAdminPretendingToBeUser") || Meteor.userId(),
      questionID: this._id
    });

    if(savedAnswer &&
      (savedAnswer.answerOption === "answerOption" + option)) {
      return {checked: "true"};
    }
  }
});