// Refresh only public shop data; demo customers, orders and stock remain synthetic.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const seedPath = fileURLToPath(new URL("../demo/miniapp/seed.json", import.meta.url));
const seed = JSON.parse(await readFile(seedPath, "utf8"));
const origin = process.env.SHOP_ORIGIN || "https://n1kotea.scalo.biz";

async function get(path) {
  const response = await fetch(`${origin}/shop/api${path}`, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

const [productsResult, clubResult, quotesResult] = await Promise.all([
  get("/products"), get("/club"), get("/quotes"),
]);
const { products, bot_username } = productsResult;
if (!Array.isArray(products) || products.length === 0 || typeof bot_username !== "string" ||
    !Array.isArray(clubResult.categories) || !Array.isArray(quotesResult.quotes)) {
  throw new Error("Unexpected shop API response; keeping the previous snapshot.");
}
const ids = new Set();
const catalog = products.map((p) => {
  if (!Number.isInteger(p.id) || ids.has(p.id) || typeof p.name !== "string" ||
      typeof p.category !== "string" || typeof p.description !== "string" ||
      typeof p.available !== "boolean" || !Array.isArray(p.photos) ||
      !Array.isArray(p.options) || p.options.length === 0 ||
      !p.photos.every((url) => typeof url === "string") ||
      !p.options.every((o) => typeof o.code === "string" && typeof o.label === "string" && Number.isFinite(o.price))) {
    throw new Error("Invalid product in shop API response; keeping the previous snapshot.");
  }
  ids.add(p.id);
  return { ...p, photos: p.photos.map((url) => new URL(url, origin).href), stock: p.available ? (p.id * 7919) % 13 + 2 : 0 };
});
const updated = { ...seed, origin, bot_username, catalog, club: clubResult.categories, quotes: quotesResult.quotes };
if (JSON.stringify(updated) === JSON.stringify(seed)) {
  console.log(`No changes: ${catalog.length} products.`);
} else {
  updated.captured_at = new Date().toISOString().slice(0, 10);
  await writeFile(seedPath, JSON.stringify(updated) + "\n");
  console.log(`Updated snapshot: ${catalog.length} products.`);
}
