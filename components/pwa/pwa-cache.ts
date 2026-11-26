"use client";

const CACHE_PREFIX = "prava-pwa-";
const STATIC_CACHE_NAME = "prava-pwa-static-v2";

/**
 * Remove caches and offline IndexedDB data that could belong to a previous
 * authenticated session. The static asset cache is intentionally retained.
 */
export async function clearPwaUserData(): Promise<void> {
  const cacheCleanup =
    "caches" in window
      ? caches
          .keys()
          .then((cacheNames) =>
            Promise.all(
              cacheNames
                .filter(
                  (name) =>
                    name.startsWith(CACHE_PREFIX) && name !== STATIC_CACHE_NAME
                )
                .map((name) => caches.delete(name))
            )
          )
      : Promise.resolve();

  const serviceWorkerCleanup = navigator.serviceWorker?.ready
    .then((registration) => {
      registration.active?.postMessage({ type: "CLEAR_USER_CACHE" });
    })
    .catch(() => undefined);

  const offlineDbCleanup = import("@/lib/offline")
    .then(({ clearOfflineDb }) => clearOfflineDb())
    .catch(() => undefined);

  await Promise.allSettled([
    cacheCleanup,
    serviceWorkerCleanup,
    offlineDbCleanup,
  ]);
}
