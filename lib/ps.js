
const ChildProcess = require("child_process");

const identity = (x) => x;

const tokenize = (line) => line.split(" ").filter(identity);

const parse = (line) => {
  const tokens = tokenize(line);
  return {
    pid: tokens[0],
    tty: tokens[1],
    time: tokens[2],
    command: tokens[3],
    arguments: (tokens.splice(0, 4), tokens)
  };
};

module.exports = (predicate, callback) =>
  ChildProcess.exec("ps -e", (error, stdout) =>
    callback(error, stdout.split("\n").filter(predicate).map(parse)));
