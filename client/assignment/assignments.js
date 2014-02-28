Template.assignments.helpers({
  "assignments": function() {
    return Assignments.find({}, {sort: {weekNum: 1}});
  }
});