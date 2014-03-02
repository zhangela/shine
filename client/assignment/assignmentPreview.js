Template.assignmentPreview.events({
  "click .deleteBtn": function() {
    Meteor.call("deleteQuestion", this.valueOf());
  }
});

Template.assignmentPreview.helpers({
  "questionObjFromID": function() {
    return Questions.findOne({_id: this.valueOf()});
  }
});