Meteor.methods({
  // assignments
  saveAssignment: function (assignment) {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }
    
    if (assignment._id) { // if we are editing
      Assignments.update({_id: assignment._id}, {
        $set: _.omit(assignment, ["_id"])
      });
    } else { // if we are creating a new one
      Assignments.insert(assignment);
    }

    return assignment;
  },

  // user groups
  createUserGroup: function () {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }

    UserGroups.upsert({
      owner: this.userId
    }, {
      owner: this.userId
    });
  },

  removeUserFromOwnedGroup: function (userId) {
    UserGroups.update({owner: this.userId}, {
      $pull: {
        users: userId
      }
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
      var userId = Accounts.createUser({
        email: email,
        password: password
      });

      Meteor.users.update({_id: userId}, {
        $set: {
          isAdmin: true
        }
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
  },

  "saveAnswers": function (assignmentId, answerArray) {
    var self = this;
    _.each(answerArray, function (answer) {
      SavedAnswers.upsert({
        questionID: answer.questionID,
        userId: self.userId
      }, {
        $set: answer
      });
    });
  },

  "updateCompletedAssignmentsForUser": function(assignmentID, answerArray) {
    var correctAnswers = [];
    _.each(answerArray, function(answer) {
      var questionObj = Questions.findOne(answer.questionID);
      if (questionObj.questionType === 'Multiple Choice') {
        if (questionObj.answerCorrectOption === answer.answerOption) {
          correctAnswers.push(answer.questionID);
        }
      } else {
        var correctAnswer = parseFloat(questionObj.answerCorrectNumeric);
        var userAnswer = parseFloat(answer.answerText);

        var answerDifference = Math.abs(correctAnswer - userAnswer);
        var fractionOfCorrect = Math.abs(correctAnswer)/100;

        // within a 1% margin
        if (answerDifference < fractionOfCorrect) {
          correctAnswers.push(answer.questionID);
        }
      }
    });

    var assignment = Assignments.findOne(assignmentID);
    var assignmentResult = {
      assignmentID: assignmentID,
      numCorrect: correctAnswers.length,
      numTotal: assignment.questions.length,
      correctAnswers: correctAnswers
    };

    // make sure we can't submit twice
    if(! Meteor.users.findOne({
      _id: this.userId,
      "completed._id": assignment._id
    })) {
      Meteor.users.update(
        {_id: this.userId},
        {
          $push: {
            completed: {
              _id: assignment._id,
              weekNum: assignment.weekNum,
              assignmentType: assignment.assignmentType,
              result: assignmentResult
            }
          }
        }
      );
    }
  },
  "addStarForUser": function(userId) {
    Meteor.users.update({_id: userId}, {$inc: {stars: 1}});
  },

  "addNewUser": function (user) {
    var userID;
    var existingUser = Meteor.users.findOne({"emails.address": user.email});
    
    if (existingUser) {
      userID = existingUser._id;
    } else {
      userID = Accounts.createUser(user);
    }

    Meteor.users.update({_id: userID}, {$set: {level: user.level}});

    var currentUserGroupID = UserGroups.findOne({owner: Meteor.userId()})._id;
    UserGroups.update({_id: currentUserGroupID}, {$push: {users: userID}});
  },
  "deleteUser": function(userID) {
    Meteor.users.remove({_id: userID});
  }
});