var triggerGoogleAnalytics = function () {
  if (window.ga) {
    ga('send', 'pageview', window.location.origin + window.location.hash);
  }
};

Tracker.autorun(function () {
  Meteor.userId();
  Meteor.subscribe("assignments");
  Meteor.subscribe("userGroups");
  Meteor.subscribe("userData");
  Meteor.subscribe("allUsersData");
});

// iron router sucks
var oldGo = Router.go;
Router.go = function () {
  var oldLocation = window.location.pathname;
  oldGo.apply(Router, arguments);

  // iron router didn't work
  if (window.location.pathname === oldLocation) {
    window.location = arguments[0];
  }
};

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  onBeforeAction: triggerGoogleAnalytics
});

var checkForAdmin = function () {
  if (! Permissions.isAdmin(Meteor.user())) {
    this.render("home");
    this.stop();
  }
};

var mustBeLoggedIn = function () {
  if (! Meteor.user()) {
    this.render("home");
    this.stop();
  }
};

Router.onBeforeAction(checkForAdmin, {
  only: ["admin", "superadmin", "editAssignment"]
});

Router.onBeforeAction(mustBeLoggedIn);

Router.map(function () {
  /**
   * The route's name is "home"
   * The route's template is also "home"
   * The default action will render the home template
   */
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: null
  });

  var initTimer = function () {
    Timer.resetTimer();

    var data = this.data();

    if (data && data.timerLength) {
      var amplifyKey = Meteor.userId() + "/" +
        data._id;
      var totalTime = parseInt(data.timerLength, 10);

      Timer.startTimer(amplifyKey, totalTime);
    }
  };

  this.route('assignment', {
    path: '/weeks/:weekNum/:assignmentType',
    template: 'assignment',
    data: function() {
      if (Meteor.user()) {
        return Assignments.findOne({
          weekNum: this.params.weekNum,
          assignmentType: this.params.assignmentType,
          assignmentLevel: Meteor.user().level
        });
      }
    },
    waitOn: function () {
      return [
        Meteor.subscribe("questions"),
        Meteor.subscribe("savedAnswers")
      ];
    },
    onRun: initTimer,
    onRerun: initTimer
  });

  // ADMIN ACCESSABLE ROUTES ONLY
  
  this.route('admin', {
    path: 'admin',
    template: 'admin'
  });

  this.route('editAssignment', {
    path: 'admin/weeks/:weekNum/:assignmentType/:assignmentLevel',
    template: 'editAssignment',
    data: function() {
      var assignment = Assignments.findOne({
        weekNum: this.params.weekNum,
        assignmentType: this.params.assignmentType,
        assignmentLevel: this.params.assignmentLevel
      });

      return assignment;
    },
    waitOn: function () {
      Meteor.subscribe("questions");
    }
  });

  this.route('editUser', {
    path: 'admin/users/:_id',
    template: 'editUser',
    data: function() {
      var user = Meteor.users.findOne({
        _id: this.params._id
      });
      return user;
    }
  });

  this.route('editStudentAssignment', {
    path: 'admin/users/:userId/:assignmentId',
    template: 'editStudentAssignment',
    data: function() {
      Session.set("idOfAdminPretendingToBeUser", this.params.userId);

      var assignment = Assignments.findOne({_id: this.params.assignmentId});
      if (assignment) {
        var savedAnswers = SavedAnswers.find({
          questionID: {$in: assignment.questions},
          userId: this.params.userId
          }, {sort: {_id: 1}});
        return {
          userId: this.params.userId,
          assignment: assignment,
          savedAnswers: savedAnswers
        };
      }
    },
    waitOn: function() {
      return [
        Meteor.subscribe("questions"),
        Meteor.subscribe("savedAnswersForAllUsers")
      ];
    },
    onStop: function () {
      Session.set("idOfAdminPretendingToBeUser", undefined);
    }
  });

  //SUPER ADMIN ACCESS ONLY

  this.route('superAdmin', {
    path: 'admin/super',
    template: 'superAdmin',
    onBeforeAction: function () {
      if (!Meteor.user() || !Meteor.user().isSuperAdmin) {
        // stop the rest of the before hooks and the action function 
        this.stop();
      }
    },
  });
});