var triggerGoogleAnalytics = function () {
  if (window.ga) {
    ga('send', 'pageview', window.location.origin + window.location.hash);
  }
};

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

var checkForAdmin = function () {
  if (! Permissions.isAdmin(Meteor.user())) {
    this.render("home");
    this.stop();
  }
};

Router.before(checkForAdmin, {
  only: ["admin", "editAssignment"]
});

var timerInterval;

var tick = function () {
  if (Session.get("timer") <= 0) {
    clearInterval(timerInterval);
  } else {
    Session.set("timer", Session.get("timer") - 1);
  }
};

var startTimer = function (initialTime) {
  Session.set("timer", initialTime);
  timerInterval = setInterval(tick, 1000);
};

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
      return Assignments.findOne({weekNum: this.params.weekNum, assignmentType: this.params.assignmentType});
    },
    waitOn: function () {
      Meteor.subscribe("questions");
    },
    load: function () {
      Session.set("timer", undefined);

      var amplifyKey = Meteor.userId() + "/" +
        this.params.weekNum + "/" + this.params.assignmentType;

      Meteor.call("openedAssignment",
        this.params.weekNum, this.params.assignmentType);

      var totalTime = 30;

      if (! amplify.store(amplifyKey)) {
        amplify.store(amplifyKey, new Date());
        startTimer(totalTime);
      } else {
        var startTime = amplify.store(amplifyKey);
        var timeLeft = totalTime - (moment().unix() - moment(startTime).unix());

        startTimer(Math.max(timeLeft, 0));
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
    path: 'admin/weeks/:weekNum/:assignmentType',
    template: 'editAssignment',
    data: function() {
      return Assignments.findOne({weekNum: this.params.weekNum, assignmentType: this.params.assignmentType});
    },
    waitOn: function () {
      Meteor.subscribe("questions");
    }
  });
});