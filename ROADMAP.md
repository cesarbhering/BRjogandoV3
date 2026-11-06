# Roadmap

This is the work planned for BR Jogando. Items are grouped by theme and roughly ordered by priority inside each group. Estimates are rough, in hours.

## 1. Testing and quality

| Item | Estimate |
|---|---|
| Merge the mock data mode (`npm run dev:mock`), so the app runs without a PandaScore token | 3h |
| Merge the component tests (Vitest) and end-to-end tests (Playwright) that run on mock data | 4h |
| Add a GitHub Actions workflow that runs the build and the tests on every push | 3h |
| Add unit tests for the Netlify functions, with the external APIs mocked | 4h |
| Add ESLint and Prettier, and fix the warnings they report | 3h |

## 2. Core features

| Item | Estimate |
|---|---|
| Turn the Brazilian team and player filter back on, and make it configurable | 3h |
| Build the per-game pages at `/esports/[esport]`, which are only a stub today | 8h |
| Add pagination or "load more" for past matches, which are capped at five | 3h |
| Show tournament brackets and standings for the leagues Brazilian teams play in | 8h |
| Let users favorite teams and filter the home page by them, saved in the browser | 5h |
| Show the match schedule in the visitor's own time zone instead of a fixed GMT-3 offset | 3h |

## 3. Live match experience

| Item | Estimate |
|---|---|
| Add a real-time chat room for each match, so fans can talk while they watch | 12h |
| Add basic chat moderation: rate limits, a word filter and a way to report messages | 6h |
| Build a bot that posts the most relevant plays of each game into the match chat, such as kills, rounds, objectives and map wins | 16h |
| Read live match events from the data provider and decide which ones are worth posting | 8h |
| Let users mute the bot or choose which kinds of plays it posts | 3h |

## 4. Content pages

| Item | Estimate |
|---|---|
| Write the About, FAQ, Contact, Terms of Use and Privacy Policy pages, which are placeholders today | 5h |
| Point the social media icons in the footer to the real profiles | 1h |

## 5. Internationalization

| Item | Estimate |
|---|---|
| Add Spanish as a third language, for the rest of Latin America | 3h |
| Translate the SEO and Open Graph tags on every page, not only the home page | 2h |

## 6. Performance and reliability

| Item | Estimate |
|---|---|
| Cache PandaScore responses in the functions to cut API calls and speed up the page | 4h |
| Cache Liquipedia results, so the browser-based search runs once per team instead of on every modal | 4h |
| Handle API errors and empty states in the UI, instead of showing endless loaders | 3h |
| Automate the update of the Brazilian team and player ID lists | 4h |

## 7. Maintenance

| Item | Estimate |
|---|---|
| Upgrade Nuxt, Vuetify, `@nuxtjs/i18n` and other dependencies, and remove the unused ones | 4h |
| Remove the Pinia path alias workaround in `nuxt.config.js` once the upgrade makes it unnecessary | 1h |
| Fix the score alignment in the medium match card when a score is one digit | 1h |
| Improve SEO with per-page titles, descriptions and Open Graph tags | 3h |
| Review accessibility: alt text, color contrast and keyboard navigation | 3h |

**Total:** about 130 hours of planned work.
