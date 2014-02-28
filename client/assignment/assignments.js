Template.assignments.helpers({
  "assignments": function() {
    console.log(Assignments.find());
    return Assignments.find();
  }
});