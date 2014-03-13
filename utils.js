Utils = {
  assignmentCompletedByUser: function (assignment, user) {
    if (user) {
      return _.find(user.completed, function(currentAssignment) {
        return currentAssignment._id === assignment._id;
      });
    }
  },
  answerCorrectForQuestion: function (answer, question) {
    if (! answer) {
      return false;
    }

    if (! question) {
      return false;
    }
    
    if (question.questionType === 'Multiple Choice') {
      if (question.answerCorrectOption === answer.answerOption) {
        return true;
      }
    } else {
      var correctAnswer = parseFloat(question.answerCorrectNumeric);
      var userAnswer = parseFloat(answer.answerText);

      var answerDifference = Math.abs(correctAnswer - userAnswer);
      var fractionOfCorrect = Math.abs(correctAnswer)/100;

      // within a 1% margin
      if (answerDifference < fractionOfCorrect) {
        return true;
      }
    }

    return false;
  }
};