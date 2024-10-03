// Import Workbox packages
import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

// Precache files based on the manifest generated by Workbox
precacheAndRoute(self.__WB_MANIFEST);

// Cache pages using CacheFirst strategy
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200], 
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, 
    }),
  ],
});

// Warm the cache with specific pages
warmStrategyCache({
  urls: ['/index.html', '/'], 
  strategy: pageCache, 
});

// Register a route to cache navigation requests
registerRoute(
  ({ request }) => request.mode === 'navigate', 
  pageCache
);

// Cache JS and CSS files using StaleWhileRevalidate strategy
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'asset-cache', 
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], 
      }),
    ],
  })
);

// Cache image files using CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image', 
  new CacheFirst({
    cacheName: 'image-cache', 
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], 
      }),
      new ExpirationPlugin({
        maxEntries: 50, 
        maxAgeSeconds: 30 * 24 * 60 * 60, 
      }),
    ],
  })
);

// Implement offline fallback for pages
offlineFallback({
  pageFallback: '/offline.html', 
  
});
