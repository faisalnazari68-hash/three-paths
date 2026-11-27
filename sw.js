/* Three Paths service worker: caches everything so the app works fully offline. */
const VERSION = "tp-v2-2026-11-27";
const FILES = [
 "./",
 "data/bible-kjv.json",
 "data/deep.js",
 "data/fonts/amiri-arabic.woff2",
 "data/fonts/hanken-grotesk.woff2",
 "data/fonts/instrument-serif-italic.woff2",
 "data/fonts/instrument-serif.woff2",
 "data/fonts/noto-serif-devanagari.woff2",
 "data/gita.json",
 "data/guides-bible.js",
 "data/guides-more.js",
 "data/meta.js",
 "data/quran.json",
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/maskable-512.png",
 "index.html",
 "manifest.webmanifest"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => e.request.mode === "navigate" ? caches.match("index.html") : undefined)));
});
