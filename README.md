# BR Jogando

**BR Jogando** is a web app that follows Brazilian teams and players in professional esports. It lists live, upcoming and recent matches for Counter-Strike, Valorant, League of Legends, Dota 2 and Rainbow Six Siege, all in one place, in English and Portuguese.

Live site: **https://brjogando.com.br**

## Who it is for

Brazilian esports fans who want to know when their teams play next, follow live scores and find where to watch, without checking a different site for every game.

## Features

- **Live, upcoming and past matches** pulled from the [PandaScore](https://pandascore.co) API.
- **Match details modal** with the score, the date and time, team rosters and links to the live streams.
- **Liquipedia links** for each team, found automatically by a serverless function.
- **Per-game icons and artwork** so you can tell at a glance which game a match belongs to.
- **English and Portuguese**, with a language switch in the header. English is the default and the choice is remembered.
- **Dark mode** and a responsive layout for phones and desktops.

## Built with

| Layer | Technology |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com) as a single-page app, with Vue 3 |
| UI | [Vuetify 3](https://vuetifyjs.com), Sass, Material Design Icons, Font Awesome |
| State | [Pinia](https://pinia.vuejs.org) |
| i18n | `@nuxtjs/i18n`, English by default with a Portuguese (pt-BR) switch in the header |
| Backend | [Netlify Functions](https://docs.netlify.com/functions/overview/) on Node.js |
| Data | PandaScore REST API |
| Scraping | `playwright-core` to search Liquipedia |
| Hosting | Netlify |

## How it works

The browser never talks to PandaScore directly. The Nuxt app calls the Netlify functions, which add the API token on the server and return only the data the page needs.

```
Browser (Nuxt SPA)
   │
   ▼
/.netlify/functions/*
   ├── fetchPandaScoreMatches   live, upcoming and past matches
   ├── fetchGameRosters         players of both teams in a match
   └── searchLiquipediaLinks    Liquipedia page for each team
   │
   ▼
PandaScore API · Liquipedia
```

## Project structure

```
components/          Vue components: header, footer, match cards and modals
composables/         Shared logic, such as dark mode and team logos
pages/               Routes: home page, per-game page and info pages
store/games.js       Pinia store that loads matches, rosters and links
netlify/functions/   Serverless functions that call the external APIs
helpers/             Lists of Brazilian team and player IDs used for filtering
plugins/             Vuetify, Iconify and Google Analytics setup
```

## Getting started

### Requirements

- Node.js 18 or newer
- A free [PandaScore](https://pandascore.co) API token
- The [Netlify CLI](https://docs.netlify.com/cli/get-started/), to run the functions locally

### Setup

```bash
git clone https://github.com/cesarbhering/BRjogandoV3.git
cd BRjogandoV3
npm install
cp .env.example .env
```

Then open `.env` and set `API_PANDASCORE_TOKEN` to your own token.

### Run locally

```bash
# Full app, including the Netlify functions (http://localhost:8888)
npm run dev:netlify

# Front end only, without the functions (http://localhost:3000)
npm run dev
```

The match data only loads through `dev:netlify`, because the front end depends on the functions.

### Build

```bash
npm run build
npm run preview
```

## Environment variables

| Name | Required | Description |
|---|---|---|
| `API_PANDASCORE_TOKEN` | Yes | PandaScore API token used by the functions |
| `DEV` | Local only | Set to `true` when running the functions with `netlify dev` |

Never commit your `.env` file. It is already listed in `.gitignore`.

## Deployment

The site deploys to Netlify from the `master` branch. Netlify builds the Nuxt app and the functions in `netlify/functions`, as set in `netlify.toml`. Set `API_PANDASCORE_TOKEN` in the Netlify site settings, with the Functions scope enabled.

## Roadmap

Planned work is listed in [ROADMAP.md](ROADMAP.md).

## License

See the [LICENSE](LICENSE) file.
