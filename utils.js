Utils = {
  assignmentCompletedByUser: function (assignment, user) {
    if (user) {
      return _.find(user.completed, function(currentAssignment) {
        return currentAssignment._id === assignment._id;
      });
    }
  }
};