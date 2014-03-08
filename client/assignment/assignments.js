Template.assignments.helpers({
  "assignments": function() {
    return Assignments.find({}, {sort: {weekNum: 1, assignmentLevel: 1, assignmentType: 1}});
  }
});

Template.assignments.events({
  "click .delete": function (event) {
    event.preventDefault();

    if (confirm("Delete this assignment?")) {
      Meteor.call("deleteAssignment", this._id);
    }
  },
  "click .btnPublish": function(event) {
    event.preventDefault();
    Meteor.call("publishAssignment", this._id);
  },
  "click .btnUnpublish": function(event) {
    event.preventDefault();
    Meteor.call("unpublishAssignment", this._id);
  }
});