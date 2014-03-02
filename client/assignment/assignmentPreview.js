Template.assignmentPreview.helpers({
  "questionObjFromID": function() {
    return Questions.findOne({_id: this.valueOf()});
  }
});