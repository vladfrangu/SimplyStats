# SimplyStats <img src="https://raw.githubusercontent.com/vladfrangu/SimplyStats/master/static/hack_wump_ship.png" align="right" width="30%">

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

## Contributing

Contributing instructions are TBD

## Authors

Here are the amazing people who are working on this bot in order to bring you the best experience while using our bot:

- [Kelwing#0001](https://github.com/kelwing)
- [King - Vlad#0721](https://github.com/vladfrangu)
- [JakeMakesStuff#0001](https://github.com/JakeMakesStuff)
- [GG142#1420](https://github.com/GilbertGobbels)
- [codepupper#3621](https://github.com/codepupper)
