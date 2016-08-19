var Fs = require("fs");

var hours = (min) => pad(Math.floor(min/60)) + "h" + pad(min%60);
var pad = (x) => (x < 10) ? ("0" + x) : x;
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
    JSON.parse("["+content+"null]").forEach(function (quest) {
      if (quest) {
        var date = new Date(quest.start);
        var key = date.getFullYear()+"-"+pad(date.getMonth()+1)+"-"+pad(date.getDate())+" "+days[date.getDay()];
        totals[key] = (totals[key] || 0) + quest.duration;
      }
    });
    var total = 0;
    Object.keys(totals).sort().forEach(function (key) {
      total += totals[key];
      process.stdout.write(key+": "+hours(totals[key])+"\n");
    });
    process.stdout.write(Array(28).join("=")+"\nTotal: "+hours(total)+"\n");
  });
};
