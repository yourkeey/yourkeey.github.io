# Yurii Fomenko — Web Developer

Telegram bots, Mini Apps, CRMs and online stores for small businesses. Open to remote roles and contract work.

- [Portfolio (English)](https://yourkeey.github.io/) · [Українською](https://yourkeey.github.io/uk/)
- [English CV](cv.html)
- [Contact](https://t.me/yourkeey)

## Project experience

**TEA BET (n1kotea) — Telegram shop, CRM and Mini App.** Paid project for a tea shop owner. A React/TypeScript Mini App storefront opened from the bot was published in October 2026, with server-side Telegram initData verification and transactional checkout. Python, aiogram 3, FastAPI, SQLAdmin, SQLite, React, TypeScript and Vite; catalogue, cart, orders, stock, notifications and delivery-status tracking for manually entered waybill numbers.

**Zimin Apiary — honey storefront.** Live store based on the owner's Instagram shop, accepting customer orders. Astro, TypeScript and CSS, with a Cloudflare order endpoint that validates the cart and sends order details to Telegram.

AI coding agents are central to my implementation workflow.

## The live demo on the home page

- **Mini App** (`demo/miniapp/`): the production n1kotea Mini App, built from the private Tea_bot repository with its API swapped for an in-browser one (`miniapp/demo/` and `vite.demo.config.ts` there). The catalogue, club articles and quotes are a snapshot of the shop's public Mini App API; product photos load from the shop's server.
- **Admin** (`demo/crm.js`): the manager's side, rebuilt in the browser from the production admin's statuses and steps. Nova Poshta tracking is simulated.
- Both share one state in `localStorage` (`teabet-demo/v1`) and `BroadcastChannel` (`teabet-demo`). Demo orders, carts and stock never leave the visitor's browser and never reach the real shop.

Refresh the catalogue snapshot and the bundle, from `Tea_bot/miniapp`:

```bash
node demo/make-seed.mjs && DEMO_OUT=../../portfolio/demo/miniapp npx vite build -c vite.demo.config.ts
```

## Building the pages

`index.html` and `uk/index.html` are generated from `src/strings.mjs` (all copy, both languages) and `src/build.mjs` (the template). Edit those, then run `node src/build.mjs` and commit the generated pages. Styles: `assets/css/site.css` on top of `tokens.css` and `base.css`.

## Evidence and privacy

- The admin screenshot of the tea shop uses synthetic data; the demo's sample orders and customers are invented.
- [Verification notes](verification.html) give the scope and date of a local test run. They are not a public CI badge.
- The public CV page omits the phone number. Resume PDFs stay local (`resume/` is ignored).
