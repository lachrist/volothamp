# Volothamp <img src="volothamp.png" align="right" alt="volo-logo" title="Volothamp"/>

Volothamp is a simple work management tool inspired by the [pomodoro technique](http://pomodorotechnique.com/).
You can instruct Volothamp to shield you from distractions inherent to working on computers for a given duration.
These chunks of work are called quests and are recorded in a file for profiling.
Volothamp should work on Linux/OSX with up-to-date node installation.
To install run: `npm install -g volothamp`.

## Shield: Launch a quest

Applications listed in [applications.txt](./applications.txt) will be closed.
Hosts listed in [hosts.txt](./hosts.txt) will be banned.
Don't try to trespass these rules coz Volothamp is overseeing and watches us all.

```
sudo volothamp --shield --duration 25  --quests path/to/quests.txt
sudo volothamp --shield -d 25 -q path/to/quests.txt
```

The `sudo` is necessary to overwrite `/etc/hosts` and close applications.
On `SIGINT` (CTRL-C) the current quest will annulated.

## Sword: Check these quests of yours

```
sudo volothamp --sword --quests path/to/quest.txt
sudo volothamp --sword -q path/to/quests.txt
```
