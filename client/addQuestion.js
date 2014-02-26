Template.addQuestion.events({
  "submit form": function(event) {
    event.preventDefault();
  },
  "click button": function(event, template) {
    var formObj = template.find("form");
    var formJson = FormUtils.serializeForm(formObj);
    var questionID = Questions.insert(formJson);
    var assignmentID = formJson.questionAssignment;
    Assignments.update({_id: assignmentID}, {$push: {questions: questionID}});
    formObj.reset();
  }
});

Template.addQuestion.helpers({
  "assignments": function() {
    return Assignments.find();
  }
});