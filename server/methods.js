Meteor.methods({
  // assignments
  saveAssignment: function (assignment) {
    if (! Meteor.user().isSuperAdmin) {
      throw new Meteor.Error(403, "Need to be super admin.");
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

  publishAssignment: function (assignmentId) {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }
    Assignments.update({_id: assignmentId}, {$set: {isPublished: true}});
  },

  unpublishAssignment: function(assignmentId) {
    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }
    Assignments.update({_id: assignmentId}, {$set: {isPublished: false}});
  },

  "saveAnswers": function (assignmentId, answerArray) {
    var self = this;

    if (! Utils.assignmentCompletedByUser(Meteor.user())) {
      _.each(answerArray, function (answer) {
        SavedAnswers.upsert({
          questionID: answer.questionID,
          userId: self.userId,
          assignmentId: assignmentId
        }, {
          $set: answer
        });
      });
    } else {
      throw new Meteor.Error("unauthorized",
        "Can't change answers for a submitted assignment.");
    }
  },

  "adminUpdateStudentAnswers": function (assignmentId, answerArray, userId) {
    var self = this;

    if (! Permissions.isAdmin(Meteor.user())) {
      throw new Meteor.Error(403, "Need to be admin.");
    }

    _.each(answerArray, function (answer) {
      SavedAnswers.upsert({
        questionID: answer.questionID,
        userId: userId
      }, {
        $set: answer
      });
    });

    Meteor.call("updateCompletedAssignmentsForUser", assignmentId, userId);
  },

  "updateCompletedAssignmentsForUser": function(assignmentID, userId) {
    console.log("method called!");
    var self = this;

    if (userId) {
      // admin can resubmit other people's stuff
      if (! Permissions.isAdmin(Meteor.user())) {
        throw new Meteor.Error(403, "Need to be admin.");
      }
    } else {
      userId = self.userId;
    }

    // Get the saved answers for this assignment
    var answerCursor = SavedAnswers.find({
      assignmentId: assignmentID,
      userId: userId
    });

    // Get the correct answers for this assignment
    var correctAnswers = [];
    answerCursor.forEach(function(answer) {
      var questionObj = Questions.findOne(answer.questionID);
      if (Utils.answerCorrectForQuestion(answer, questionObj)) {
        correctAnswers.push(answer.questionID);
      }
    });

    // Get the assignment
    var assignment = Assignments.findOne(assignmentID);
    var assignmentResult = {
      assignmentID: assignmentID,
      numCorrect: correctAnswers.length,
      numTotal: assignment.questions.length,
      correctAnswers: correctAnswers
    };

    // make sure we can't submit twice
    if(! Meteor.users.findOne({
      _id: userId,
      "completed._id": assignment._id
    })) {
      console.log("this should print");
      Meteor.users.update(
        {_id: userId},
        {
          $push: {
            completed: {
              _id: assignment._id,
              weekNum: assignment.weekNum,
              assignmentType: assignment.assignmentType,
              result: assignmentResult
            }
          },

          // add 2 stars when you first complete the assignment
          $inc: {
            stars: 2
          }
        }
      );
    } else {
      console.log("this should not print");

      // admin can resubmit other people's stuff
      if (! Permissions.isAdmin(Meteor.user())) {
        throw new Meteor.Error(403, "Need to be admin.");
      }

      Meteor.users.update({
          _id: userId,
          "completed._id": assignment._id
        }, {
          $set: {
            "completed.$": {
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

  "removeStarForUser": function(userId) {
    Meteor.users.update({_id: userId}, {$inc: {stars: -1}});
  },

  "addNewUser": function (user) {
    var userID;
    var existingUser = Meteor.users.findOne({"emails.address": user.email});
    
    if (existingUser) {
      userID = existingUser._id;
    } else {
      userID = Accounts.createUser(user);
    }

    console.log("updating: ", userID);
    Meteor.users.update({_id: userID}, {$set: {
      level: user.level,
      stars: 0
    }});

    var currentUserGroupID = UserGroups.findOne({owner: Meteor.userId()})._id;
    UserGroups.update({_id: currentUserGroupID}, {$push: {users: userID}});
  },
  "deleteUser": function(userID) {
    Meteor.users.remove({_id: userID});
  },
  "changeMentor": function (studentId, newMentorId) {
    // remove user from all previous groups
    UserGroups.update({users: studentId},
      {$pull: {users: studentId}}, {multi: true});
    UserGroups.update({owner: newMentorId}, {$push: {users: studentId}});
  }
});