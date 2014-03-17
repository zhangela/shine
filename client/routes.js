var triggerGoogleAnalytics = function () {
  if (window.ga) {
    ga('send', 'pageview', window.location.origin + window.location.hash);
  }
};

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () {
    return [
      Meteor.subscribe("assignments"),
      Meteor.subscribe("userGroups"),
      Meteor.subscribe("userData"),
      Meteor.subscribe("allUsersData")
    ];
  },
  before: triggerGoogleAnalytics
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

Router.before(checkForAdmin, {
  only: ["admin", "superadmin", "editAssignment"]
});

Router.before(mustBeLoggedIn);

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

  this.route('assignment', {
    path: '/weeks/:weekNum/:assignmentType',
    template: 'assignment',
    data: function() {
      if (Meteor.userId()) {
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
    load: function () {
      Timer.resetTimer();

      if (this.getData() && this.getData().timerLength) {
        var amplifyKey = Meteor.userId() + "/" +
          this.getData()._id;
        var totalTime = parseInt(this.getData().timerLength, 10);

        Timer.startTimer(amplifyKey, totalTime);
      }
    }
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
    unload: function () {
      Session.set("idOfAdminPretendingToBeUser", undefined);
    }
  });

  //SUPER ADMIN ACCESS ONLY

  this.route('superAdmin', {
    path: 'admin/super',
    template: 'superAdmin',
    before: function () {
      if (!Meteor.user() || !Meteor.user().isSuperAdmin) {
        // stop the rest of the before hooks and the action function 
        this.stop();
      }
    },
  });
});