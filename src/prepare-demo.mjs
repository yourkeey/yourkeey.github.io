// Run after rebuilding the Mini App bundle from Tea_bot. Keep this demo isolated
// from the archived portfolio and start the walkthrough with an unpaid sample.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'demo/miniapp/assets');
let found = false;
for (const name of readdirSync(assets).filter((name) => name.endsWith('.js'))) {
  const path = join(assets, name);
  const before = readFileSync(path, 'utf8');
  const after = before.replaceAll('teabet-demo', 'teabet-preview-v2');
  if (after.includes('teabet-preview-v2/v1')) found = true;
  if (after !== before) writeFileSync(path, after);
}
if (!found) throw new Error('Could not find the Mini App demo storage key.');

const seedPath = join(root, 'demo/miniapp/seed.json');
const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const sample = seed.orders.find((order) => order.id === 1043 && order.sample);
if (!sample) throw new Error('Could not find the sample order for the demo walkthrough.');
sample.status = 'Нове';
sample.paid = false;
sample.ttn = '';
seed.messages = seed.messages.filter((message) =>
  !(message.to === 'customer' && message.text.includes('№1043') && message.text.includes('Оплату')));
writeFileSync(seedPath, `${JSON.stringify(seed)}\n`);
console.log('Prepared the separate demo and its sample order.');
