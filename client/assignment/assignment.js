Template.assignment.rendered = function () {
  var assignment = this.data;
  var template = this;

  if (assignment.timed) {
    Deps.autorun(function () {
      if (Session.get("timer") <= 0) {
        $(template.find("button")).click();
      }
    });
  }
};

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

    var assignmentID = $(template.find(".assignmentID")).text();

    Meteor.call(
      "updateCompletedAssignmentsForUser",
      assignmentID,
      answerArray,
      function(error, result) {
    });
  }
});

Template.assignment.helpers({
  "questionObjFromID": function() {
    return Questions.findOne({_id: this.valueOf()});
  },
  "completedByCurrentUser": function() {
    if (Meteor.user()) {
      var completedAssignments = _.map(Meteor.user().completed, function(test) {
        return test._id;
      });
      return _.contains(completedAssignments, this._id);
    }
  },
  "currentAssignmentScore": function(assignmentName) {
    if (Meteor.user()) {
      var testResult = _.find(Meteor.user().completed, function(test) {
        return test.name === assignmentName;
      });
      return testResult.result.numCorrect / testResult.result.numTotal * 100;
    }
  },
  "timer": function () {
    return Timer.getTimer();
  }
});