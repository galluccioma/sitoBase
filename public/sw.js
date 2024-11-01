// Cache version e nomi
const CACHE_NAME = "musesBackendPwa";
const urlsToCache = [
  "/",
  "/favicon.ico",
  "/manifest.json",
  "/ico/apple-touch-icon-57x57.png",
  "/ico/apple-touch-icon-72x72.png",
  // Aggiungi altre risorse statiche da cache qui
];

// Installazione del Service Worker e caching delle risorse
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Apertura cache e aggiunta delle risorse");
      return cache.addAll(urlsToCache);
    })
  );
});

// Attivazione del Service Worker e rimozione di vecchie cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Rimozione vecchia cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch per recuperare le risorse dalla cache o dalla rete
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Gestione delle notifiche push
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Nuova notifica!";
  const options = {
    body: data.message || "Hai una nuova notifica.",
    icon: "/ico/apple-touch-icon-180x180.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Gestione del click sulle notifiche
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
