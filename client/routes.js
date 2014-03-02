Router.configure({
  layoutTemplate: 'layout',
  waitOn: function () {
    return [
      Meteor.subscribe("assignments"),
      Meteor.subscribe("userGroups"),
      Meteor.subscribe("users")
    ];
  },
  before: triggerGoogleAnalytics
});

var triggerGoogleAnalytics = function () {
  if (window.ga) {
    ga('send', 'pageview', window.location.origin + window.location.hash);
  }
};

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
  only: ["admin", "editAssignment"]
});

Router.before(mustBeLoggedIn, {
  except: ['home']
});

Router.map(function () {
  /**
   * The route's name is "home"
   * The route's template is also "home"
   * The default action will render the home template
   */
  this.route('home', {
    path: '/',
    template: 'home'
  });

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
      Meteor.subscribe("questions");
    },
    load: function () {
      Timer.resetTimer();

      if (this.getData() && this.getData().timed) {
        var amplifyKey = Meteor.userId() + "/" +
          this.params.weekNum + "/" + this.params.assignmentType;
        var totalTime = parseInt(this.getData().timerLength, 10);

        Timer.startTimer(amplifyKey, totalTime);
      }
    }
  });

  // ADMIN ACCESSABLE ROUTES ONLY
  
  this.route('admin', {
    path: 'admin',
    template: 'admin',
    before: function () {
      if (!Meteor.user()) {
        this.render('login');
        this.stop();
      }
    }
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