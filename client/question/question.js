Template.question.greeting = function () {
  return "Welcome to shine.";
};

Template.question.helpers({
  "isMultipleChoice": function(question) {
    return question.questionType === 'Multiple Choice';
  }
});