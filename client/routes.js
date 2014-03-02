Router.configure({
  layoutTemplate: 'layout',
  waitOn: function () {
    return [
      Meteor.subscribe("assignments"),
      Meteor.subscribe("userGroups")
    ];

  }
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
      return Assignments.findOne({weekNum: this.params.weekNum, assignmentType: this.params.assignmentType});
    },
    waitOn: function () {
      Meteor.subscribe("questions");
    }
  });

  // ADMIN ACCESSABLE ROUTES ONLY
  
  this.route('admin', {
    path: 'admin',
    template: 'admin',
    waitOn: function() {
      return Meteor.subscribe("users");
    },
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