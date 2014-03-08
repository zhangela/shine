Template.home.helpers({
  "assignments": function() {
    if (Meteor.userId()) {
      return Assignments.find({assignmentLevel: Meteor.user().level, isPublished: true}, {sort: {weekNum: 1, assignmentLevel: 1, assignmentType: 1}});
    }
  },

  "isDiagnostic": function(assignment) {
    return assignment.weekNum === "0";
  }
});