// Prava Travel Workspace Service Worker
const CACHE_PREFIX = "prava-pwa-";
const CACHE_NAME = "prava-pwa-static-v2";
const OFFLINE_FALLBACK_URL = "/offline";

const PRECACHE_ASSETS = [
  "/offline",
  "/logo.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-icon.png",
  "/icon-maskable.png",
];

// Pre-cache offline fallback and core static icon assets on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .catch((err) => {
        console.warn("[Prava SW] Pre-caching non-fatal warning:", err);
      })
  );
  self.skipWaiting();
});

// Clean up previous Prava cache versions upon activation. Only the current
// static cache is retained; navigation responses are never cached.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Allow the client to remove legacy/runtime caches when an account signs out
// or changes. The static asset cache contains no user data and is preserved.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "CLEAR_USER_CACHE") return;

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});

// Non-disruptive fetch handler tailored for Next.js App Router & SSR Auth
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Never intercept mutations (POST, PUT, DELETE, PATCH) or non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // 2. Only intercept same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // 3. Skip Server Action POSTs, Next Server Actions, and dynamic streaming RSC
  if (
    request.headers.get("next-action") ||
    url.searchParams.has("_rsc") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/")
  ) {
    return;
  }

  // 4. Skip dev webpack/HMR files
  if (
    url.pathname.includes("webpack-hmr") ||
    url.pathname.startsWith("/_next/webpack")
  ) {
    return;
  }

  // 5. HTML Page Navigations: network-only with an offline fallback.
  // Never cache authenticated HTML because CacheStorage is shared across
  // accounts in the same browser profile.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => networkResponse)
        .catch(async () => {
          const offlineFallback = await caches.match(OFFLINE_FALLBACK_URL);
          if (offlineFallback) {
            return offlineFallback;
          }
          return new Response("Offline - Prava Travel Workspace", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain" },
          });
        })
    );
    return;
  }

  // 6. Static Next.js chunks, fonts, and images: Stale-While-Revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
