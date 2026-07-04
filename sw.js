/* Service worker — Car Spot Finder
   Stratégie :
   - Coquille de l'app (app.html, manifest, icônes) : cache d'abord, mise à jour en arrière-plan.
   - data/spots.json : réseau d'abord (base à jour), repli cache si hors-ligne.
   - Leaflet (CDN) : cache d'abord (fige la lib pour le hors-ligne).
   - Tuiles de carte / API (OSM, Esri, Overpass, Nominatim, Open-Meteo, OSRM) : réseau seulement
     (trop volumineux à mettre en cache ; la carte nécessite du réseau). */
const VERSION = 'carspots-v1';
const SHELL = ['./app.html', './manifest.json', './icon-192.png', './icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // base de spots : réseau d'abord, repli cache
  if (url.pathname.endsWith('/data/spots.json') || url.pathname.endsWith('spots.json')) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // coquille + leaflet : cache d'abord
  const isShell = SHELL.some(s => e.request.url === new URL(s, self.registration.scope).href || e.request.url === s);
  if (isShell || url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
        if (resp.ok) { const copy = resp.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
        return resp;
      }))
    );
    return;
  }
  // tout le reste (tuiles, API) : réseau direct
});
