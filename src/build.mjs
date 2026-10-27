// Builds index.html (English) and uk/index.html (Ukrainian) from one template.
// Run from the repo root: node src/build.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { strings } from "./strings.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const seed = JSON.parse(readFileSync(join(root, "demo/miniapp/seed.json"), "utf8"));
const site = "https://yourkeey.github.io/";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ext = (href) => (/^https?:/.test(href) ? ' rel="noopener"' : "");

// The admin as plain HTML: what a visitor sees before (or without) demo/crm.js.
function staticOrders(t) {
  const label = t.lang === "uk" ? { n: "Замовлення", c: "Покупець", s: "Статус", sum: "Сума" } : { n: "Order", c: "Customer", s: "Status", sum: "Total" };
  const rows = seed.orders
    .map((o) => `<tr><td class="num">№${o.id}</td><td>${esc(o.customer.fullname)}</td><td>${esc(o.status)}</td><td class="num">${o.total} ₴</td></tr>`)
    .join("");
  return `<table class="crm-static"><thead><tr><th scope="col">${label.n}</th><th scope="col">${label.c}</th><th scope="col">${label.s}</th><th scope="col">${label.sum}</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function page(t) {
  const r = t.lang === "en" ? "" : "../";
  const self = t.lang === "en" ? site : `${site}uk/`;
  const work = t.work
    .map((w, i) => `
        <li class="work-item${i === 0 ? " work-item--lead" : ""}">
          ${w.live ? `<figure class="work-item__shot work-item__live" data-live data-kind="product">
            <div class="live-frame" data-view="desktop"><iframe src="${w.live.src}" title="${esc(w.live.title)}" loading="lazy" referrerpolicy="no-referrer"></iframe></div>
            <figcaption><div class="seg" role="group" aria-label="${esc(w.live.views)}"><button type="button" data-view="desktop" aria-pressed="true">${esc(w.live.desktop)}</button><button type="button" data-view="phone" aria-pressed="false">${esc(w.live.phone)}</button></div><button class="btn btn--text" type="button" data-live-open>${esc(w.live.expand)}</button><span>${esc(w.live.note)}</span></figcaption>
            <dialog class="live-dialog" aria-label="${esc(w.live.title)}"><div class="live-dialog__bar"><a class="link" href="${w.live.src}" rel="noopener">${esc(w.link.label)}</a><button class="btn btn--text" type="button" data-live-close>${esc(w.live.close)}</button></div><iframe title="${esc(w.live.title)}" data-src="${w.live.src}" referrerpolicy="no-referrer"></iframe></dialog>
          </figure>` : ""}
          ${w.image ? `<figure class="work-item__shot" data-slot="work-${i}" data-kind="product"><img src="${r}${w.image.src}" width="${w.image.width}" height="${w.image.height}" alt="${esc(w.image.alt)}" loading="lazy" decoding="async"></figure>` : ""}
          <div class="work-item__text">
            <h3>${esc(w.name)}</h3>
            <p>${esc(w.line)}</p>
            <dl class="facts">${w.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
            <a class="link" href="${w.link.href}"${ext(w.link.href)}>${esc(w.link.label)}</a>
          </div>
        </li>`)
    .join("");
  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(t.title)}</title>
  <meta name="description" content="${esc(t.description)}">
  <link rel="canonical" href="${self}">
  <link rel="alternate" hreflang="en" href="${site}">
  <link rel="alternate" hreflang="uk" href="${site}uk/">
  <link rel="alternate" hreflang="x-default" href="${site}">
  <meta property="og:title" content="${esc(t.title)}">
  <meta property="og:description" content="${esc(t.description)}">
  <meta property="og:url" content="${self}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${site}assets/projects/zimin-home.webp">
  <meta name="theme-color" content="#f4efe5">
  <link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="${r}assets/css/site.css">
  <script>document.documentElement.classList.add('js');</script>
  <script type="module" src="${r}assets/js/site.js"></script>
</head>
<body>
  <a class="skip" href="#main">${esc(t.skip)}</a>
  <header class="nav">
    <div class="container nav__inner">
      <a class="wordmark" href="${r || "./"}" aria-label="${esc(t.home)}">Yurii Fomenko</a>
      <nav aria-label="${esc(t.navLabel)}">
        <ul class="nav__links">
          <li><a href="#work">${esc(t.navWork)}</a></li>
          <li><a href="#admin">${esc(t.navDemo)}</a></li>
          <li><a href="${r ? "../" : "uk/"}" hreflang="${t.other.lang}" lang="${t.other.lang}">${esc(t.other.label)}</a></li>
        </ul>
      </nav>
      <a class="btn btn--quiet" href="https://t.me/yourkeey" rel="noopener">${esc(t.navAction)}</a>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <div class="container hero__grid">
        <div class="hero__text">
          <h1><span class="hero__figure num">${t.heroFigure}</span> <span class="hero__words">${esc(t.heroHead)}</span></h1>
          <p class="lead">${esc(t.heroLead)}</p>
          <div class="actions">
            <a class="btn btn--primary" href="https://t.me/yourkeey" rel="noopener">${esc(t.heroPrimary)}</a>
            <a class="btn btn--outline" href="#admin">${esc(t.heroSecondary)}</a>
          </div>
        </div>
        <figure class="hero__app">
          <div class="app-frame" data-kind="product">
            <iframe src="${r}demo/miniapp/" title="${esc(t.appTitle)}" loading="eager"></iframe>
          </div>
          <figcaption>${esc(t.appCaption)}</figcaption>
        </figure>
      </div>
    </section>

    <section class="admin" id="admin">
      <div class="container">
        <div class="head">
          <h2>${esc(t.adminHead)}</h2>
          <p class="lead">${esc(t.adminLead)}</p>
        </div>
        <div class="crm" data-crm data-seed="${r}demo/miniapp/seed.json">
          ${staticOrders(t)}
        </div>
        <div class="admin__foot">
          <p>${esc(t.adminNote)}</p>
          <button class="btn btn--text" type="button" data-reset>${esc(t.reset)}</button>
        </div>
      </div>
    </section>

    <section class="work" id="work">
      <div class="container">
        <h2>${esc(t.workHead)}</h2>
        <ol class="work-list">${work}
        </ol>
      </div>
    </section>

    <section class="checks" id="checks">
      <div class="container">
        <div class="head head--split">
          <h2>${esc(t.checksHead)}</h2>
          <p class="lead">${esc(t.checksLead)} <a class="link" href="${r}verification.html">${esc(t.checksLink)}</a></p>
        </div>
        <dl class="figures">${t.figures.map(([n, l]) => `<div><dt>${esc(l)}</dt><dd class="num">${n}</dd></div>`).join("")}</dl>
        <ul class="rows">${t.checks.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join("")}</ul>
      </div>
    </section>

    <section class="services" id="services">
      <div class="container">
        <h2>${esc(t.servicesHead)}</h2>
        <ul class="services__grid">${t.services.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join("")}</ul>
        <p class="services__note">${esc(t.servicesNote)}</p>
      </div>
    </section>

    <section class="contact" id="contact">
      <div class="container contact__grid">
        <div>
          <h2>${esc(t.contactHead)}</h2>
          <p class="lead">${esc(t.contactLead)}</p>
        </div>
        <dl class="contacts">${t.contacts.map(([k, v, href]) => `<div><dt>${esc(k)}</dt><dd><a href="${/^(https?:|mailto:)/.test(href) ? href : r + href}"${ext(href)}>${esc(v)}</a></dd></div>`).join("")}</dl>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <p class="footer__mast">Yurii Fomenko</p>
      <ul class="footer__links">
        <li><a href="#work">${esc(t.navWork)}</a></li>
        <li><a href="#admin">${esc(t.navDemo)}</a></li>
        <li><a href="${r}cv.html">CV</a></li>
        <li><a href="https://github.com/yourkeey" rel="noopener">GitHub</a></li>
        <li><a href="${r ? "../" : "uk/"}" hreflang="${t.other.lang}" lang="${t.other.lang}">${esc(t.other.label)}</a></li>
      </ul>
      <p class="footer__legal">${esc(t.legal)}</p>
    </div>
  </footer>

  <div class="toast" role="status" hidden data-toast="${esc(t.toast("{id}"))}" data-toast-link="${esc(t.toastLink)}"></div>
</body>
</html>
`;
}

writeFileSync(join(root, "index.html"), page(strings.en));
mkdirSync(join(root, "uk"), { recursive: true });
writeFileSync(join(root, "uk/index.html"), page(strings.uk));
console.log("built index.html and uk/index.html");
