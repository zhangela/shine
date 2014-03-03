Template.assignmentResults.helpers({
  "assignments": function() {
    return Assignments.find({}, {sort: {weekNum: 1}});
  }
});

Template.assignmentResults.events({
  "click .delete": function (event) {
    event.preventDefault();

    if (confirm("Delete this assignment?")) {
      Meteor.call("deleteAssignment", this._id);
    }
  }
});