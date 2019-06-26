# <img src="https://cdn.discordapp.com/icons/592776919062413313/8bbb0cd2511a3a2b039777e2e0705a68.png?size=2048" align="left" width="4%"> SimplyStats <img src="https://raw.githubusercontent.com/vladfrangu/SimplyStats/master/static/hack_wump_ship.png" align="right" width="30%">

<div align="center">
  <p>
    <a href="https://circleci.com/gh/vladfrangu/SimplyStats">
      <img src="https://img.shields.io/circleci/build/github/vladfrangu/SimplyStats.svg" alt="Build status" />
    </a>
    <a href="https://lgtm.com/projects/g/vladfrangu/SimplyStats/alerts/">
      <img src="https://img.shields.io/lgtm/alerts/g/vladfrangu/SimplyStats.svg?logo=lgtm&logoWidth=18" alt="Total alerts">
    </a>
    <a href="https://lgtm.com/projects/g/vladfrangu/SimplyStats/context:javascript">
      <img src="https://img.shields.io/lgtm/grade/javascript/github/vladfrangu/SimplyStats.svg" alt="Code Grade">
    </a>
    <a href="https://dependabot.com">
      <img src="https://api.dependabot.com/badges/status?host=github&repo=vladfrangu/SimplyStats" alt="Dependabot Status">
    </a>
    <a href="https://github.com/vladfrangu/SimplyStats/releases">
      <img src="https://img.shields.io/github/downloads/vladfrangu/SimplyStats/total.svg" alt="GitHub Total Download Count">
    </a>
    <a href="https://github.com/vladfrangu/SimplyStats/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/vladfrangu/SimplyStats.svg" alt="License">
    </a>
    <a href="https://github.com/vladfrangu/SimplyStats/releases">
      <img src="https://img.shields.io/github/package-json/v/vladfrangu/SimplyStats.svg" alt="Version">
    </a>
  </p>
</div>

## About

**SimplyStats** is a Discord bot created for Discord's 0th Hackathon.
It allows you to build in-depth statistics about your server, from user growth
to messages sent per hour and much much more.

The bot is written in [TypeScript](https://www.typescriptlang.org), using [Discord.js](https://discord.js.org/#/docs/main/master/general/welcome) and [Klasa](https://klasa.js.org/#/docs/klasa/settings/Getting%20Started/GettingStarted). It is split into two main parts:

- **modules**
  - There are the main "modules" of the bot, in order to keep everything more modular
- **core**
  - This is the main bot core. It handles the registration of all modules, and the actual connection to Discords' Gateway/REST API
  - It is also split into two parts by itself:
    - bot
      - The actual bot core, which handles every incoming event.
    - web
      - The web UI for the bot (soon™️)

## How to run the bot

First thing you'll need is [node.js](https://nodejs.org) with a version greater than 12! Install it using your operating systems instructions.

Clone the repository by using [git](https://git-scm.com/)

```bash
# Use https if you don't have SSH keys setup
git clone git@github.com:vladfrangu/SimplyStats.git
```

Go into the directory for the bot and install all dependencies

```bash
# cd into the bot directory
cd SimplyStats

# Or yarn
npm i
```

Copy the `config.ts.example` file to `config.ts`, fill in all the values, then run

```bash
npm run ts:compile

# For yarn users

yarn ts:compile
```

Then, just run the bot!

```bash
node .
```

## Contributing

Contributing instructions are TBD

## Authors

Here are the amazing people who are working on this bot in order to bring you the best experience while using our bot:

- [Kelwing#0001](https://github.com/kelwing)
- [King - Vlad#0721](https://github.com/vladfrangu)
- [JakeMakesStuff#0001](https://github.com/JakeMakesStuff)
- [GG142#1420](https://github.com/GilbertGobbels)
- [codepupper#3621](https://github.com/codepupper)
