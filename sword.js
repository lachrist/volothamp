
var Fs = require("fs");

var pad = (x) => (x < 10) ? ("0" + x) : x;
var hour = (min) => pad(Math.floor(min/60)) + "h" + pad(min%60);
var days = [
  "Sunday   ",
  "Monday   ",
  "Tuesday  ",
  "Wednesday",
  "Thursday ",
  "Friday   ",
  "Saturday "
];

module.exports = function (options) {
  Fs.readFile(options.quests, "utf8", (error, content) => {
    var totals = {};
    content.split("\n\n").forEach((chunk) => {
      if (chunk) {
        var date = /^Start: ([0-9]{4}-[0-9]{2}-[0-9]{2})/.exec(chunk)[1];
        totals[date] = (totals[date] || 0) + Number(/\nDuration: ([0-9]+)/.exec(chunk)[1]);
      }
    });
    var total = 0;
    Object.keys(totals).sort().forEach((date) => {
      total += totals[date];
      process.stdout.write(days[(new Date(date)).getDay()]+" "+date+": "+hour(totals[date])+"\n");
    });
    process.stdout.write(Array(28).join("=")+"\nTotal: " + hour(total)+"\n");
  });
};
