Template.assignmentPreview.events({
  "click .deleteBtn": function(event) {
    event.preventDefault();

    if (confirm("Delete this question?")) {
      Meteor.call("deleteQuestion", this.valueOf());
    }
  }
});

Template.assignmentPreview.helpers({
  "questionObjFromID": function() {
    return Questions.findOne({_id: this.valueOf()});
  }
});

