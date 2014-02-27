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
    path: 'assignments/:nameOrWeek/:assignmentType?',
    template: 'assignment',
    data: function() {
      if (! this.params.assignmentType) {
        return Assignments.findOne({name: this.params.nameOrWeek});
      } else {
        return Assignments.findOne({name: this.params.nameOrWeek + this.params.assignmentType});
      }
    }
  });

  this.route('admin/questions/add', {
    path: '/admin/questions/add',
    template: 'addQuestion'
  });

  this.route('admin/users/manage', {
    path: 'admin/users/manage',
    template: 'manageUsers'
  });
});