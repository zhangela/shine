Handlebars.registerHelper("log", function(context) {
  return console.log(context);
});

Meteor.subscribe("userData");
