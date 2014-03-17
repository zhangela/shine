Template.editUser.helpers({
  "assignments": function() {
    if (this) {
      return Assignments.find({assignmentLevel: this.level, isPublished: true}, {sort: {weekNum: 1, assignmentLevel: 1, assignmentType: 1}});
    }
  },
  "linkparams": function(options) {
    return options.hash;
  }
});
