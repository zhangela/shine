Router.configure({
  layoutTemplate: 'layout'
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
    }
  });

  this.route('addQuestion', {
    path: 'admin/weeks/:weekNum/:assignmentType/questions',
    template: 'addQuestion',
    data: function() {
      return Assignments.findOne({weekNum: this.params.weekNum, assignmentType: this.params.assignmentType});
    }
  });

  this.route('addAssignment', {
    path: 'admin/assignments',
    template: 'addAssignment',
    before: function () {
      if (!Meteor.user()) {
        this.render('login');
        this.stop();
      }
    }
  });

  this.route('admin/users/manage', {
    path: 'admin/users/manage',
    template: 'manageUsers'
  });
});