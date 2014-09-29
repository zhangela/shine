Permissions = {
  isAdmin: function (user) {
    console.log(user);
    return user &&
      (user.emails && user.emails[0].address === "shineboard@mit.edu") ||
      user.isAdmin;
  }
};