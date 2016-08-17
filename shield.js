
const ReadLine = require("readline");
const ChildProcess = require("child_process");
const Fs = require("fs");

const Alarm = require("./lib/alarm.js");
const Kill = require("./lib/kill.js");
const Ps = require("./lib/ps.js");

var nil = () => undefined;
var pid = (process) => process.pid;
var loopback = (host) => "::1 "+host+"\n::1 www."+host+"\n";
var spawn = (command) => ChildProcess.spawn(command, [], {detached:true, stdio:"ignore", uid:502}).unref();
var pad = (x) => x<10 ? "0"+x : x;
var now = () => {
  var date = new Date();
  return date.getFullYear() + "-"
       + pad(date.getMonth()+1) + "-"
       + pad(date.getDate()) + ", "
       + pad(date.getHours()) + ":"
       + pad(date.getMinutes());
};

module.exports = (options) => {
  var output = "Start: "+now()+"\nDuration: "+options.duration+"min\n";
  process.stdout.write(output);
  var readline = ReadLine.createInterface({input:process.stdin, output:process.stdout});
  readline.question("Target...", (target) => output += "Target: "+target+"\n");
  var hosts = {};
  hosts.path = "/etc/hosts";
  Fs.readFile(hosts.path, "utf8", (error, content) => {
    if (error)
      throw error;
    hosts.original = content;
    hosts.initial = content + "# BEGIN VOLOTHAMP #\n" + options.hosts.map(loopback).join("");
  });
  hosts.ban = () =>
    Fs.readFile(hosts.path, "utf8", (error, current) =>
      (current === hosts.initial) || Fs.writeFile(hosts.path, hosts.initial, (error) =>
        error && process.stderr.write("Cannot ban hosts on "+hosts.path+": "+error.message+"\n")));
  var checkline = (line) =>
    options.applications.some((s) =>
      line.toLowerCase().indexOf(s.toLowerCase()) !== -1);
  var cleanup = () => {
    readline.close();
    options.applications.forEach(spawn);
    Fs.writeFile(hosts.path, hosts.original, (error) =>
      error && process.stderr.write("Cannot restaure "+hosts.path+": "+error.message+"\n"));
  };
  var interval = setInterval(() => {
    hosts.ban();
    Ps(checkline, (error, processes) =>
      error
        ? process.stderr.write("Cannot list processes: "+error.message+"\n")
        : Kill(processes.map(pid), (error) =>
          error && process.stderr.write("Cannot kill some processes: "+error.message+"\n")))
  }, 10000);
  var timeout = setTimeout(() => {
    Alarm();
    clearInterval(interval);
    readline.question("Loot...", (loot) =>
      Fs.writeFile(options.quest, output + (loot ? "Loot: "+loot+"" : "") + "\n\n", {flag:"a", encoding:"utf8"}, (error) => {
        error && process.stderr.write("Cannot write quest "+options.quest+": "+error.message+"\n");
        cleanup();
      }));
  }, options.duration * 60 * 1000);
  process.on("SIGINT", () => {
    clearTimeout(timeout);
    clearInterval(interval);
    process.stdout.write("Quest failure...\n");
    cleanup();
  });
};
