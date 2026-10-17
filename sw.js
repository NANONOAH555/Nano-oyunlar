/* Nano Oyunlar: internetsiz calisma. Sayfa once internetten denenir, yoksa kayittan acilir. */
const V = 'nano-v1', THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
self.addEventListener('install', e => { e.waitUntil((async () => {
  const c = await caches.open(V);
  for (const u of ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png']) { try { await c.add(u); } catch (_) {} }
  try { await c.put(THREE, await fetch(new Request(THREE, { mode: 'no-cors' }))); } catch (_) {}
  self.skipWaiting(); })()); });
self.addEventListener('activate', e => { e.waitUntil((async () => { for (const k of await caches.keys()) if (k !== V) await caches.delete(k); await clients.claim(); })()); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return; const u = new URL(r.url), same = u.origin === location.origin;
  if (!same && u.href !== THREE) return;
  e.respondWith((async () => {
    const c = await caches.open(V);
    if (!same) { const m = await c.match(THREE); if (m) return m; const n = await fetch(r); try { c.put(THREE, n.clone()); } catch (_) {} return n; }
    try { const n = await fetch(r); if (n.ok) c.put(r, n.clone()); return n; }
    catch (_) { return (await c.match(r, { ignoreSearch: true })) || (await c.match('index.html')) || Response.error(); }
  })());
});
