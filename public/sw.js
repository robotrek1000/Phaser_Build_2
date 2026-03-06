const CACHE_VERSION = "v1";
const STATIC_CACHE_NAME = `phaser-build-${CACHE_VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/style.css",
          "/manifest.webmanifest",
          "/favicon.png",
          "/pwa-192.png",
          "/pwa-512.png",
        ]);
      })
      .catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== STATIC_CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(networkFirst(request));
});

const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (request.mode === "navigate") {
      const appShell = await caches.match("/");
      if (appShell) {
        return appShell;
      }
    }

    throw new Error("Network and cache are unavailable");
  }
};
