// XXX this is copy pasted from assignment.js, awkward
var saveForm = function (event, template) {
  var formObjs = template.findAll("form");
  var answerArray = [];
  _.each(formObjs, function(formObj) {
    var formJson = FormUtils.serializeForm(formObj);
    answerArray.push(formJson);
  });

  var assignmentID = $(template.find(".assignmentID")).text();

  Meteor.call(
    "adminUpdateStudentAnswers",
    assignmentID,
    answerArray,
    Session.get("idOfAdminPretendingToBeUser"),
    function(error, result) {
      if (error) {
        alert("Error saving answers: " + error.reason);
      }
  });
};

Template.editStudentAssignment.helpers({
  "student": function() {
    return Meteor.users.findOne({_id: this.userId});
  },
  "questionObj": function() {
    return Questions.findOne({_id: this.questionID});
  },
  "assignmentScoreForUser": function(user) {
    var self = this;
    console.log(self, user);

    var testResult = _.find(user.completed, function(assignment) {
      return assignment._id === self.assignment._id;
    });
    
    return testResult.result.numCorrect / testResult.result.numTotal * 100;
  }
});

Template.editStudentAssignment.events({
  "keyup input": saveForm,
  "change input": saveForm
});