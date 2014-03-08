Handlebars.registerHelper("log", function(context) {
  return console.log(context);
});

Handlebars.registerHelper("assignmentDisplayName", function(assignment) {
  return "Week " + assignment.weekNum + " " + assignment.assignmentType.toProperCase();
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

Handlebars.registerHelper("toProperCase", function(assignmentType) {
    if (assignmentType) {
      return assignmentType.toProperCase();
    }
});

Handlebars.registerHelper("currentUserIsAdmin", function() {
    return Permissions.isAdmin(Meteor.user());
});

Handlebars.registerHelper("equals", function (a, b) {
  return a === b;
});


$(function() {
  filepicker.setKey("Asmkb8jlTEaH7zJyX3BSez");

  String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

});