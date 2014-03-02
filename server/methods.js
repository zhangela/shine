Meteor.methods({
  // assignments
  createAssignment: function (assignment) {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }

    // XXX add validation

    Assignments.insert(assignment);
  },

  // user groups
  createUserGroup: function () {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }

    UserGroups.insert({
      owner: this.userId
    });
  },

  // questions
  createQuestion: function (question) {
    // XXX add validation
    
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }

    var questionID = Questions.insert(question);
    var assignmentID = question.questionAssignment;

    Assignments.update({
      _id: assignmentID
    }, {
      $push: {questions: questionID}
    });
  },

  deleteQuestion: function(questionID) {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }

    var question = Questions.findOne({_id: questionID});
    Assignments.update({_id: question.questionAssignment}, {$pull: {questions: questionID}});
    Questions.remove({_id: questionID});
  },

  addAdmin: function (data) {
    check(data, {
      email: String,
      password: String
    });

    var email = data.email;
    var password = data.password;

    var user = Meteor.users.findOne({"emails.address": email});
    if (user) {
      Meteor.users.update({_id: user._id}, {
        $set: {
          isAdmin: true
        }
      });
    } else {
      Accounts.createUser({
        email: email,
        password: password
      });
    }
  },

  removeAdmin: function (userId) {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }

    Meteor.users.update({
      _id: userId
    }, {
      $set: {isAdmin: false}
    });
  },

  openedAssignment: function (weekNum, assignmentType) {
    var assignment = Assignments.findOne({
      weekNum: weekNum,
      assignmentType: assignmentType
    });

    // XXX make this method do something
  },

  deleteAssignment: function (assignmentId) {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }

    Assignments.remove({_id: assignmentId});
  }
});