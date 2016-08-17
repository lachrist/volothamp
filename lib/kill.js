
const ChildProcess = require("child_process");

module.exports = (pids, callback) =>
  loop(0, Array.isArray(pids) ? pids : [pids], callback);

var loop = (index, pids, callback) =>
  (index === pids.length) ? callback() : ChildProcess.exec("kill "+pids[index], (error) =>
    error ? callback(error) : loop(index + 1, pids, callback));
