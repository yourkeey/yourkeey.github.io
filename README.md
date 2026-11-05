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
- Both share one state in `localStorage` (`teabet-preview-v2/v1`) and `BroadcastChannel` (`teabet-preview-v2`). This keeps the previous portfolio demo separate. Demo orders, carts and stock never leave the visitor's browser and never reach the real shop.

The GitHub Pages workflow refreshes the public catalogue, club and quotes daily at 04:17 UTC. It validates the response before saving, keeps demo orders and stock synthetic, and deploys the last committed snapshot on normal pushes. A failed refresh leaves the previous deployment untouched. The workflow also supports manual runs. Configure GitHub Pages to use **GitHub Actions** as its source and allow the workflow to write repository contents. Scheduled workflows can be delayed or disabled by GitHub for inactive repositories.

To refresh the snapshot locally and regenerate both portfolio pages:

```bash
node src/sync-catalog.mjs
node src/build.mjs
```

To rebuild the Mini App bundle itself after changing its source, from `Tea_bot/miniapp`:

```bash
node demo/make-seed.mjs && DEMO_OUT=../../portfolio/demo/miniapp npx vite build -c vite.demo.config.ts
```

Then, from the portfolio repository, run `node src/prepare-demo.mjs` to restore the separate storage namespace and the new-order sample used by the guided demo. Catalogue refreshes preserve these sample orders.

## Building the pages

`index.html` and `uk/index.html` are generated from `src/build.mjs` (copy in both languages and template). Edit it, then run `node src/build.mjs` and commit the generated pages. Styles: `assets/css/portfolio-v2.css` on top of `site.css`, `tokens.css` and `base.css`. The previous portfolio is retained under `previous-version/`, including its original demo and build source.

## Evidence and privacy

- The admin screenshot of the tea shop uses synthetic data; the demo's sample orders and customers are invented.
- [Verification notes](verification.html) give the scope and date of a local test run. They are not a public CI badge.
- The public CV page omits the phone number. Resume PDFs stay local (`resume/` is ignored).
