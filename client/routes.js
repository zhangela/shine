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

  this.route('assignments', {
    path: 'assignments/weeks/:week/:type/questions/add',
    template: 'assignment',
    data: function() {
      return Assignments.findOne({week: this.params.week, type: this.params.type});
    }
  });

  this.route('addQuestion', {
    path: 'admin/assignments/weeks/:week/:type/questions/add',
    template: 'addQuestion',
    data: function() {
      return Assignments.findOne({week: this.params.week, type: this.params.type});
    }
  });

  this.route('addAssignment', {
    path: 'admin/assignments/add',
    template: 'addAssignment',
    before: function () {
      if (!Meteor.user()) {
        // render the login template but keep the url in the browser the same
        this.render('login');

        // stop the rest of the before hooks and the action function 
        this.stop();
      }
    }
  });

  this.route('admin/users/manage', {
    path: 'admin/users/manage',
    template: 'manageUsers'
  });
});