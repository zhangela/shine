Permissions = {
  isAdmin: function (user) {
    return user && (user.emails[0].address === "shineboard@mit.edu" ||
      user.isAdmin);
  }
};