var timerInterval;

var tick = function () {
  if (Session.get("timer") <= 0) {
    clearInterval(timerInterval);
  } else {
    Session.set("timer", Session.get("timer") - 1);
  }
};

Timer = {
  startTimer: function (key, totalTime) {
    clearInterval(timerInterval);

    var timeRemaining;

    if (! amplify.store(key)) {
      amplify.store(key, new Date());
      timeRemaining = totalTime;
    } else {
      var startTime = amplify.store(key);
      var timeLeft = totalTime - (moment().unix() -
        moment(startTime).unix());

      timeRemaining = Math.max(timeLeft, 0);
    }

    Session.set("timer", timeRemaining);
    timerInterval = setInterval(tick, 1000);
  },
  resetTimer: function () {
    clearInterval(timerInterval);
    Session.set("timer", undefined);
  },
  getTimer: function () {
    return Session.get("timer");
  }
};