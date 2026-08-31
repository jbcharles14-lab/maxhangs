const CACHE = "maxhangs-v4";
const FICHIERS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png",
  "./icone-maskable.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(rep => rep || fetch(e.request).then(net => {
      const copie = net.clone();
      caches.open(CACHE).then(c => c.put(e.request, copie)).catch(()=>{});
      return net;
    }).catch(() => caches.match("./index.html")))
  );
});
