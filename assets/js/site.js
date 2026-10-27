// Page wiring: mounts the admin demo and announces orders placed in the hero Mini App.
import { mountCrm } from "../../demo/crm.js";

const crm = document.querySelector("[data-crm]");
if (crm) mountCrm(crm).catch(() => { /* the static table stays */ });

const toast = document.querySelector(".toast");
const KEY = "teabet-demo/v1";
const newest = () => {
  try {
    const state = JSON.parse(localStorage.getItem(KEY) || "null");
    return Math.max(0, ...(state?.orders || []).filter((o) => o.source === "Mini App").map((o) => o.id));
  } catch {
    return 0;
  }
};
let seen = newest();
let timer;
function announce() {
  const id = newest();
  if (!toast || id <= seen) return;
  seen = id;
  toast.innerHTML = `<span>${toast.dataset.toast.replace("{id}", id)}</span><a href="#admin">${toast.dataset.toastLink}</a>`;
  toast.hidden = false;
  toast.classList.remove("is-hiding");
  clearTimeout(timer);
  timer = setTimeout(() => {
    toast.classList.add("is-hiding");
    setTimeout(() => (toast.hidden = true), 420);
  }, 6000);
}
toast?.addEventListener("click", (e) => {
  if (!e.target.closest("a")) return;
  const row = document.querySelector(`.order-row[data-id="${seen}"] button`);
  setTimeout(() => row?.click(), 300);
});
if ("BroadcastChannel" in window) new BroadcastChannel("teabet-demo").addEventListener("message", announce);
window.addEventListener("storage", (e) => e.key === KEY && announce());

// Live client sites: the desktop view renders the page at 960px (past its desktop breakpoint) and scales it to fit.
for (const live of document.querySelectorAll("[data-live]")) {
  const frame = live.querySelector(".live-frame");
  const fit = () => {
    const width = frame.clientWidth;
    const virtual = Math.max(960, width);
    frame.style.setProperty("--live-w", `${virtual}px`);
    frame.style.setProperty("--live-scale", String(width / virtual));
  };
  new ResizeObserver(fit).observe(frame);
  const show = (view) => {
    for (const b of live.querySelectorAll("button[data-view]")) b.setAttribute("aria-pressed", String(b.dataset.view === view));
    frame.dataset.view = view;
    fit();
  };
  live.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-view]");
    if (!button || frame.dataset.view === button.dataset.view) return;
    if (still.matches) return show(button.dataset.view);
    frame.classList.add("is-switching");
    setTimeout(() => {
      show(button.dataset.view);
      requestAnimationFrame(() => frame.classList.remove("is-switching"));
    }, 180);
  });
  // Full screen: the same site unscaled in a dialog, loaded on first open.
  const dialog = live.querySelector("dialog");
  const big = dialog.querySelector("iframe");
  live.querySelector("[data-live-open]").addEventListener("click", () => {
    if (!big.src) big.src = big.dataset.src;
    const y = scrollY;
    dialog.showModal();
    dialog.addEventListener("close", () => scrollTo({ top: y, behavior: "instant" }), { once: true });
  });
  dialog.querySelector("[data-live-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => e.target === dialog && dialog.close());
  // On a phone the scaled desktop is too small to read: open the phone view.
  if (matchMedia("(max-width: 40rem)").matches) show("phone");
}

// In-page links glide to their section quickly instead of jumping.
const still = matchMedia("(prefers-reduced-motion: reduce)");
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if (!target) return;
  e.preventDefault();
  history.pushState(null, "", link.hash);
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const from = scrollY;
  const to = Math.min(target.getBoundingClientRect().top + from - offset, document.documentElement.scrollHeight - innerHeight);
  const focus = () => {
    if (!target.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  if (still.matches) {
    scrollTo({ top: to, behavior: "instant" });
    return focus();
  }
  const duration = Math.min(650, 320 + Math.abs(to - from) / 12);
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    scrollTo({ top: from + (to - from) * (1 - (1 - t) ** 3), behavior: "instant" });
    if (t < 1) requestAnimationFrame(step);
    else focus();
  };
  requestAnimationFrame(step);
});
