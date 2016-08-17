#!/usr/bin/env node

const Volothamp = require("./main.js");
const Minimist = require("minimist");
var Fs = require("fs");

var args = Minimist(process.argv.slice(2));

if ("sword" in args && ("quests" in args || "q" in args))
  Volothamp.sword({quests: args.quests || args.q});
else if ("shield" in args && ("quests" in args || "q" in args) && ("duration" in args || "d" in args))
  Volothamp.shield({
    quests: args.quests || args.q,
    duration: Number(args.duration || args.d),
    hosts: Fs.readFileSync(__dirname+"/hosts.txt", "utf8").split("\n"),
    applications: Fs.readFileSync(__dirname+"/applications.txt", "utf8").split("\n")
  });
else
  process.stdout.write([
    "Usage:\n",
    "  sudo volothamp --sword  --quest path/to/quest.txt\n",
    "  sudo volothamp --sword  -q      path/to/quest.txt\n",
    "  sudo volothamp --shield --quest path/to/quest.txt --duration 25 \n",
    "  sudo volothamp --shield -q      path/to/quest.txt -d         25 \n"
  ].join(""));
