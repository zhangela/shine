Handlebars.registerHelper("log", function(context) {
  return console.log(context);
});

Handlebars.registerHelper("assignmentResult", function(user, assignmentName) {
      var testResult = _.find(user.completed, function(assignment) {
        return assignment.name === assignmentName;
      });

      if (testResult) {
        return testResult.result.numCorrect / testResult.result.numTotal * 100;
      } else {
        return "Not Completed.";
      }
});

$(function() {
  filepicker.setKey("Asmkb8jlTEaH7zJyX3BSez");
});

Meteor.subscribe("userData");

Meteor.subscribe("allUsersData");