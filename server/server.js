Meteor.methods({
  "updateCompletedAssignmentsForUser": function(assignmentID, answerArray) {
    var correctAnswers = [];
    _.each(answerArray, function(answer) {
      var questionObj = Questions.findOne(answer.questionID);
      if (questionObj.questionType === 'Multiple Choice') {
        if (questionObj.answerCorrectOption === answer.answerOption) {
          correctAnswers.push(answer.questionID);
        }
      } else {
        if (parseFloat(questionObj.answerCorrectNumeric) === parseFloat(answer.answerText)) {
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
    if(! Meteor.users.findOne({"completed._id": assignment._id})) {
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
  }
});

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'completed': 1, 'emails': 1, 'level': 1}});
});

Meteor.publish("allUsersData", function() {
    return Meteor.users.find({},
        {fields: {'completed': 1, 'emails': 1, 'level': 1}});
});

Meteor.startup(function () {
  // code to run on server at startup
});