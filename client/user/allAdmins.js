Template.allAdmins.events({
  "click .delete": function (event) {
    event.preventDefault();
    if (confirm("Remove this user's admin previledge?")) {
      Meteor.call("removeAdmin", this._id);
    }
  }
});
Template.allAdmins.helpers({
  "allAdmins": function() {
    if (Meteor.user()) {
      if (Meteor.user().isSuperAdmin) {
        return Meteor.users.find({isAdmin: true});
      }
    }
  },
  "userIDToUser": function(userID) {
    return Meteor.users.findOne(userID);
  },
  "email": function() {
    if (this.emails) {
      return this.emails[0].address;
    }
  }
});