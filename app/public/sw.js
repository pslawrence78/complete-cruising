const CACHE_VERSION = "complete-cruising-shell-v1";
const SHELL_CACHE = `${CACHE_VERSION}-static`;
const FALLBACK_PAGE = "offline.html";

function scopedUrl(path) {
  return new URL(path, self.registration.scope).toString();
}

async function cacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  const indexUrl = scopedUrl(".");
  const indexResponse = await fetch(indexUrl, { cache: "reload" });
  const indexHtml = await indexResponse.clone().text();

  await cache.put(indexUrl, indexResponse);
  await cache.put(scopedUrl("index.html"), new Response(indexHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  }));

  const assetPaths = [...indexHtml.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((path) => !path.startsWith("http") && !path.startsWith("data:"));

  await cache.addAll([
    scopedUrl("manifest.webmanifest"),
    scopedUrl(FALLBACK_PAGE),
    scopedUrl("icons/complete-cruising-icon.svg"),
    scopedUrl("icons/complete-cruising-maskable.svg"),
    ...assetPaths.map((path) => new URL(path, self.registration.scope).toString()),
  ]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== SHELL_CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          const cache = await caches.open(SHELL_CACHE);
          cache.put(scopedUrl("."), response.clone());
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(SHELL_CACHE);
          return (
            (await cache.match(scopedUrl("."))) ||
            (await cache.match(scopedUrl("index.html"))) ||
            (await cache.match(scopedUrl(FALLBACK_PAGE)))
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then(async (response) => {
        if (response.ok && response.type === "basic") {
          const cache = await caches.open(SHELL_CACHE);
          cache.put(request, response.clone());
        }
        return response;
      });
    }),
  );
});
