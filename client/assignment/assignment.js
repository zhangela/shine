Template.assignment.rendered = function () {
  var assignment = this.data;
  var template = this;

  Deps.autorun(function () {
    if (assignment && Session.get("timer") <= 0 && assignment.timerLength) {
      $(template.find("button")).click();
    }
  });
};

var saveForm = function (event, template) {
  var formObjs = template.findAll("form");
  var answerArray = [];
  _.each(formObjs, function(formObj) {
    var formJson = FormUtils.serializeForm(formObj);
    answerArray.push(formJson);
  });

  var assignmentID = $(template.find(".assignmentID")).text();

  Meteor.call(
    "saveAnswers",
    assignmentID,
    answerArray,
    function(error, result) {
      if (error) {
        alert("Error saving answers: " + error.reason);
      }
  });
};

Template.assignment.events({
  "submit form": function(event) {
    event.preventDefault();
  },
  "click button.submit": function(event, template) {
    saveForm(event, template);

    var formObjs = template.findAll("form");
    var answerArray = [];
    _.each(formObjs, function(formObj) {
      var formJson = FormUtils.serializeForm(formObj);
      answerArray.push(formJson);
    });

    var assignmentID = $(template.find(".assignmentID")).text();

    Meteor.call(
      "updateCompletedAssignmentsForUser",
      assignmentID,
      function(error, result) {
        if (error) {
          alert("Error submitting answers: " + error.reason);
        }
    });
  },
  "keyup input": saveForm,
  "change input": saveForm
});

Template.assignment.helpers({
  "questionObjFromID": function() {
    return Questions.findOne({_id: this.valueOf()});
  },
  "completedByCurrentUser": function() {
    return Utils.assignmentCompletedByUser(this, Meteor.user());
  },
  "currentAssignmentScore": function() {
    var self = this;

    if (Meteor.user()) {
      var testResult = _.find(Meteor.user().completed, function(assignment) {
        return assignment._id === self._id;
      });

      score = testResult.result.numCorrect / testResult.result.numTotal * 100;
      
      return Math.round(score);
    }
  },
  "timer": function () {
    return Timer.getTimer();
  }
});