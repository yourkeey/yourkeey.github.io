// Admin demo: the manager's side of the n1kotea shop, rebuilt in the browser.
// It shares one state with the Mini App in the hero (built from the private Tea_bot repo,
// miniapp/demo/api.ts): localStorage "teabet-demo/v1", announced on BroadcastChannel "teabet-demo".
// Statuses and the order of steps follow the production admin (services/orders.py).

const KEY = "teabet-demo/v1";
const NEW = "Нове", PAID = "Оплачено", SHIPPED = "Відправлено", DELIVERED = "Доставлено", CANCELLED = "Скасовано";
const ARCHIVED = [DELIVERED, CANCELLED];

const L = {
  en: {
    title: "Orders", all: "Active", archive: "Archive", order: "Order", customer: "Customer", status: "Status", total: "Total",
    statuses: { [NEW]: "New", [PAID]: "Paid", [SHIPPED]: "Shipped", [DELIVERED]: "Delivered", [CANCELLED]: "Cancelled" },
    empty: "No orders here yet. Place one in the Mini App above.", pick: "Pick an order to open it.",
    phone: "Phone", delivery: "Nova Poshta", source: "Source", comment: "Comment", items: "Items", consult: "Wants a consultation", waybill: "Waybill",
    confirm: "Confirm payment", cancel: "Cancel order", ttn: "Waybill number", ship: "Mark as shipped", track: "Check delivery status",
    ttnError: "A Nova Poshta waybill has 14 digits.", archived: "This order is archived.",
    toCustomer: "To the customer", toManager: "To the manager", inboxEmpty: "Messages appear when an order moves.",
    sample: "sample", inUkrainian: "The bot writes in Ukrainian, as in production.",
  },
  uk: {
    title: "Замовлення", all: "Активні", archive: "Архів", order: "Замовлення", customer: "Покупець", status: "Статус", total: "Сума",
    statuses: { [NEW]: "Нове", [PAID]: "Оплачено", [SHIPPED]: "Відправлено", [DELIVERED]: "Доставлено", [CANCELLED]: "Скасовано" },
    empty: "Тут поки порожньо. Оформіть замовлення в Mini App вище.", pick: "Оберіть замовлення, щоб відкрити його.",
    phone: "Телефон", delivery: "Нова пошта", source: "Джерело", comment: "Коментар", items: "Товари", consult: "Потрібна консультація", waybill: "ТТН",
    confirm: "Підтвердити оплату", cancel: "Скасувати", ttn: "Номер ТТН", ship: "Позначити відправленим", track: "Перевірити доставку",
    ttnError: "ТТН Нової пошти має 14 цифр.", archived: "Замовлення в архіві.",
    toCustomer: "Покупцеві", toManager: "Менеджерові", inboxEmpty: "Повідомлення з’являться, коли замовлення рухатиметься.",
    sample: "приклад", inUkrainian: "Бот пише українською, як і в робочому магазині.",
  },
};

const channel = "BroadcastChannel" in window ? new BroadcastChannel("teabet-demo") : null;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function read() {
  try {
    const state = JSON.parse(localStorage.getItem(KEY) || "null");
    return state?.version === 1 ? state : null;
  } catch {
    return null;
  }
}
function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* demo still works in this tab */ }
  channel?.postMessage({ type: "changed" });
}
// Same starting state as the Mini App's demo API builds from seed.json.
function fresh(seed) {
  const now = Date.now();
  return {
    version: 1,
    next_order_id: seed.next_order_id,
    stock: Object.fromEntries(seed.catalog.map((p) => [String(p.id), p.stock])),
    cart: [],
    attempts: {},
    orders: seed.orders.map(({ minutes_ago, ...o }) => ({ ...o, created_at: now - minutes_ago * 60000 })),
    messages: (seed.messages || []).map(({ minutes_ago, ...m }, i) => ({ ...m, id: i + 1, at: now - minutes_ago * 60000 })),
  };
}

export async function mountCrm(root) {
  const lang = document.documentElement.lang === "uk" ? "uk" : "en";
  const t = L[lang];
  const money = new Intl.NumberFormat(lang === "uk" ? "uk-UA" : "en-GB");
  const rel = new Intl.RelativeTimeFormat(lang === "uk" ? "uk" : "en", { numeric: "auto" });
  const ago = (at) => {
    const min = Math.round((at - Date.now()) / 60000);
    if (Math.abs(min) < 60) return rel.format(min, "minute");
    if (Math.abs(min) < 60 * 24) return rel.format(Math.round(min / 60), "hour");
    return rel.format(Math.round(min / 1440), "day");
  };
  // Message stamps: minutes for the last hour, then the calendar day in words with the clock time.
  const locale = lang === "uk" ? "uk-UA" : "en-GB";
  const when = (at) => {
    const min = Math.round((Date.now() - at) / 60000);
    if (min < 1) return lang === "uk" ? "щойно" : "just now";
    if (min < 60) return rel.format(-min, "minute");
    const day = (d) => new Date(d).setHours(0, 0, 0, 0);
    const days = Math.round((day(Date.now()) - day(at)) / 86400000);
    const clock = new Date(at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    const date = days < 2 ? rel.format(-days, "day") : new Date(at).toLocaleDateString(locale, { day: "numeric", month: "short" });
    return `${date}, ${clock}`;
  };
  let seed;
  const seedReady = fetch(root.dataset.seed).then((r) => r.json()).then((s) => (seed = s));
  let state = read() || fresh(await seedReady);
  if (!read()) write(state);
  let view = "active", ttnError = "";
  let selected = [...state.orders].filter((o) => !ARCHIVED.includes(o.status)).sort((a, b) => b.created_at - a.created_at)[0]?.id ?? null;

  root.innerHTML = `
    <div class="sheet">
      <div class="crm__bar">
        <h3 class="crm__title">${t.title}</h3>
        <div class="seg" role="group" aria-label="${t.title}">
          <button type="button" data-view="active" aria-pressed="true">${t.all}</button>
          <button type="button" data-view="archive" aria-pressed="false">${t.archive}</button>
        </div>
      </div>
      <div data-list></div>
    </div>
    <div data-entry></div>
    <section class="inbox" aria-label="Telegram">
      <p class="time">${t.inUkrainian}</p>
      <div class="inbox__cols">
        <div><h3>${t.toCustomer}</h3><ol data-inbox="customer" aria-live="polite"></ol></div>
        <div><h3>${t.toManager}</h3><ol data-inbox="manager"></ol></div>
      </div>
    </section>`;
  const list = root.querySelector("[data-list]");
  const entry = root.querySelector("[data-entry]");

  function update(change) {
    state = read() || state;
    change(state);
    write(state);
    render();
  }
  const say = (s, to, text) => {
    const at = Date.now() + Math.random();
    s.messages.push({ id: at, at: Date.now(), to, text });
  };

  function chip(status) {
    const kind = { [NEW]: "new", [PAID]: "paid", [DELIVERED]: "done", [CANCELLED]: "cancel" }[status] || "";
    return `<span class="chip ${kind ? `chip--${kind}` : ""}">${esc(t.statuses[status] || status)}</span>`;
  }

  function renderList() {
    const orders = state.orders
      .filter((o) => (view === "archive") === ARCHIVED.includes(o.status))
      .sort((a, b) => b.created_at - a.created_at);
    if (!orders.length) return (list.innerHTML = `<p class="empty">${t.empty}</p>`);
    list.innerHTML = `<table class="crm-table">
      <thead><tr><th scope="col">${t.order}</th><th scope="col">${t.customer}</th><th scope="col">${t.status}</th><th scope="col" class="num">${t.total}</th></tr></thead>
      <tbody>${orders.map((o) => `
        <tr class="order-row${o.status === NEW ? " is-new" : ""}" data-id="${o.id}" aria-selected="${o.id === selected}">
          <td><button type="button" data-open="${o.id}">№${o.id}</button><div class="time">${ago(o.created_at)}</div></td>
          <td class="cust">${esc(o.customer.fullname)}${o.sample ? ` <span class="time">(${t.sample})</span>` : ""}</td>
          <td class="stat">${chip(o.status)}</td>
          <td class="num">${money.format(o.total)} ₴</td>
        </tr>`).join("")}</tbody></table>`;
  }

  function renderEntry() {
    const o = state.orders.find((x) => x.id === selected);
    if (!o) return (entry.innerHTML = `<div class="entry"><p class="entry__hint">${t.pick}</p></div>`);
    const c = o.customer;
    let actions = "";
    if (o.status === NEW)
      actions = `<div class="row"><button class="btn btn--primary" type="button" data-act="pay">${t.confirm}</button><button class="btn" type="button" data-act="cancel">${t.cancel}</button></div>`;
    else if (o.status === PAID)
      actions = `<form class="row" data-ship novalidate>
          <div class="field" style="flex:1 1 12rem"><label for="ttn">${t.ttn}</label><input id="ttn" name="ttn" inputmode="numeric" autocomplete="off" maxlength="14" placeholder="20450000000000" aria-invalid="${Boolean(ttnError)}" aria-describedby="ttn-error"></div>
          <button class="btn btn--primary" type="submit">${t.ship}</button>
        </form><p class="error" id="ttn-error">${ttnError}</p>`;
    else if (o.status === SHIPPED)
      actions = `<div class="row"><button class="btn btn--primary" type="button" data-act="track">${t.track}</button></div>`;
    else actions = `<p class="entry__hint" style="padding:0">${t.archived}</p>`;
    entry.innerHTML = `<article class="entry" aria-labelledby="entry-title">
      <header class="entry__head"><h3 id="entry-title">${t.order} №${o.id}</h3><span class="num">${new Date(o.created_at).toLocaleString(lang === "uk" ? "uk-UA" : "en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span></header>
      <dl class="cells notebook">
        <div><dt>${t.customer}</dt><dd>${esc(c.fullname)}</dd></div>
        <div><dt>${t.status}</dt><dd>${chip(o.status)}</dd></div>
        <div><dt>${t.phone}</dt><dd class="num">${esc(c.phone)}</dd></div>
        <div><dt>${t.source}</dt><dd>${esc(o.source)}</dd></div>
        <div class="wide"><dt>${t.delivery}</dt><dd>${esc(c.delivery)}${o.ttn ? `<br><span class="num">${t.waybill} ${esc(o.ttn)}</span>` : ""}</dd></div>
        ${c.comment ? `<div class="wide"><dt>${t.comment}</dt><dd>${esc(c.comment)}</dd></div>` : ""}
        ${c.consultation ? `<div class="wide"><dt>${t.comment}</dt><dd>${t.consult}</dd></div>` : ""}
        <div class="wide"><dt>${t.items}</dt><dd><ul class="items">${o.items.map((i) => `<li><span>${esc(i.name)}, ${esc(i.label)} × ${i.quantity}</span><span class="num">${money.format(i.total)} ₴</span></li>`).join("")}</ul></dd></div>
        <div class="wide"><dt>${t.total}</dt><dd class="num">${money.format(o.total)} ₴</dd></div>
      </dl>
      <div class="entry__actions">${actions}</div>
    </article>`;
  }

  function renderInbox() {
    for (const to of ["customer", "manager"]) {
      const box = root.querySelector(`[data-inbox="${to}"]`);
      const items = state.messages.filter((m) => m.to === to).slice(-6).reverse();
      box.innerHTML = items.length
        ? items.map((m) => `<li><span class="time"><time datetime="${new Date(m.at).toISOString()}">${when(m.at)}</time></span><span>${esc(m.text)}</span></li>`).join("")
        : `<li class="inbox__empty">${t.inboxEmpty}</li>`;
    }
  }

  function render() {
    root.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
    renderList();
    renderEntry();
    renderInbox();
  }

  root.addEventListener("click", (e) => {
    const target = e.target.closest("[data-view], [data-open], .order-row, [data-act]");
    if (!target) return;
    if (target.dataset.view) {
      view = target.dataset.view;
      return render();
    }
    if (target.dataset.act) {
      const id = selected;
      const act = target.dataset.act;
      if (act === "pay")
        update((s) => {
          const o = s.orders.find((x) => x.id === id);
          o.status = PAID; o.paid = true;
          say(s, "customer", `Оплату за замовлення №${id} отримано. Готуємо посилку до відправки.`);
        });
      if (act === "cancel")
        update((s) => {
          const o = s.orders.find((x) => x.id === id);
          o.status = CANCELLED;
          for (const i of o.items) s.stock[i.product_id] = (s.stock[i.product_id] ?? 0) + i.quantity;
          say(s, "customer", `Замовлення №${id} скасовано. Якщо це помилка, напишіть нам у чат.`);
        });
      if (act === "track") {
        target.disabled = true;
        // Production polls the Nova Poshta API on a schedule; here one check delivers it.
        setTimeout(() => update((s) => {
          const o = s.orders.find((x) => x.id === id);
          o.status = DELIVERED;
          say(s, "customer", `Посилку за замовленням №${id} отримано. Дякуємо, що обрали n1kotea.`);
          say(s, "manager", `Нова пошта: ТТН ${o.ttn} доставлено, замовлення №${id} закрито.`);
        }), 700);
      }
      return;
    }
    const id = Number(target.dataset.open || target.dataset.id);
    selected = id; ttnError = "";
    render();
  });

  root.addEventListener("submit", (e) => {
    if (!e.target.matches("[data-ship]")) return;
    e.preventDefault();
    const input = e.target.elements.ttn;
    const ttn = input.value.replace(/\s/g, "");
    if (!/^\d{14}$/.test(ttn)) {
      ttnError = t.ttnError;
      renderEntry();
      root.querySelector("#ttn").value = ttn;
      return root.querySelector("#ttn").focus();
    }
    ttnError = "";
    const id = selected;
    update((s) => {
      const o = s.orders.find((x) => x.id === id);
      o.status = SHIPPED; o.ttn = ttn;
      say(s, "customer", `Замовлення №${id} відправлено Новою поштою. ТТН: ${ttn}.`);
    });
  });

  const resetButton = document.querySelector("[data-reset]");
  resetButton?.addEventListener("click", async () => {
    state = fresh(seed || (await seedReady));
    view = "active";
    selected = state.orders.find((o) => !ARCHIVED.includes(o.status))?.id ?? null;
    write(state);
    render();
    document.querySelector(".hero iframe")?.contentWindow?.location.reload();
  });

  const refresh = () => {
    const next = read();
    if (next) { state = next; render(); }
  };
  channel?.addEventListener("message", refresh);
  window.addEventListener("storage", (e) => e.key === KEY && refresh());
  render();
}
