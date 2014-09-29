Permissions = {
  isAdmin: function (user) {
    return user &&
      (user.emails && user.emails[0].address === "shineboard@mit.edu") ||
      user.isAdmin;
  }
};