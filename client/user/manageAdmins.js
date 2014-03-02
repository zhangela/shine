Template.manageAdmins.events({
  "submit form": function (event, template) {
    event.preventDefault();

    var data = FormUtils.serializeForm(template.find("form"));
    Meteor.call("addAdmin", data, function (error, result) {});
    template.find("form").reset();
  },
  
  "click .removeAdmin": function () {
    Meteor.call("removeAdmin", this._id);
  }
});

Template.manageAdmins.helpers({
  admins: function () {
    return Meteor.users.find({isAdmin: true});
  },
  email: function () {
    return this.emails[0].address;
  }
});