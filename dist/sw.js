// DD Coder Dojo Service Worker
// Provides offline functionality, caching, and performance optimizations

const CACHE_NAME = 'dd-coder-dojo-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately (critical resources)
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/programs.html',
  '/community.html',
  '/resources.html',
  '/contact.html',
  '/css/main.css',
  '/css/mobile-accessibility.css',
  '/css/enhancements.css',
  '/css/production-optimizations.css',
  '/js/main.js',
  '/js/critical-optimizations.js',
  '/data/programs.json',
  '/data/team.json',
  '/offline.html'
];

// Assets to cache on demand (non-critical resources)
const RUNTIME_CACHE = [
  '/css/pages/',
  '/js/pages/',
  '/data/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/',
  'https://cdnjs.cloudflare.com/'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Installing service worker and caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Claim all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    // Handle external resources (fonts, CDN)
    if (shouldCacheExternalResource(event.request.url)) {
      event.respondWith(cacheFirstStrategy(event.request));
    }
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(navigationHandler(event.request));
    return;
  }

  // Handle other requests based on resource type
  if (event.request.destination === 'image') {
    event.respondWith(imageHandler(event.request));
  } else if (event.request.destination === 'style') {
    event.respondWith(cacheFirstStrategy(event.request));
  } else if (event.request.destination === 'script') {
    event.respondWith(cacheFirstStrategy(event.request));
  } else {
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// Navigation handler - serve cached pages or offline fallback
async function navigationHandler(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache available, serve offline page
    const offlineResponse = await caches.match(OFFLINE_URL);
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Image handler with WebP support
async function imageHandler(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      // Clone and cache the response
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder image for failed image requests
    return new Response(
      createPlaceholderSVG(),
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  return networkFallback(request);
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Network Error', { status: 503 });
  }
}

// Network fallback for cache misses
async function networkFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available offline', { status: 503 });
  }
}

// Background cache update
function updateCacheInBackground(request) {
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return caches.open(CACHE_NAME);
      }
    })
    .then(cache => {
      if (cache) {
        cache.put(request, response.clone());
      }
    })
    .catch(error => {
      console.log('Background cache update failed:', error);
    });
}

// Check if external resource should be cached
function shouldCacheExternalResource(url) {
  return RUNTIME_CACHE.some(pattern => url.includes(pattern));
}

// Create placeholder SVG for failed images
function createPlaceholderSVG() {
  return `<svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="200" fill="#f0f0f0"/>
    <text x="150" y="100" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
      Image Not Available
    </text>
  </svg>`;
}

// Listen for messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls;
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
  
  if (event.tag === 'registration-form-sync') {
    event.waitUntil(syncRegistrationForm());
  }
});

// Sync contact form when back online
async function syncContactForm() {
  try {
    const store = await getStore('contact-forms');
    const forms = await getAllFromStore(store);
    
    for (const form of forms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await deleteFromStore(store, form.id);
        }
      } catch (error) {
        console.error('Failed to sync contact form:', error);
      }
    }
  } catch (error) {
    console.error('Contact form sync failed:', error);
  }
}

// Sync registration form when back online
async function syncRegistrationForm() {
  try {
    const store = await getStore('registration-forms');
    const forms = await getAllFromStore(store);
    
    for (const form of forms) {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await deleteFromStore(store, form.id);
        }
      } catch (error) {
        console.error('Failed to sync registration form:', error);
      }
    }
  } catch (error) {
    console.error('Registration form sync failed:', error);
  }
}

// IndexedDB helpers for offline form storage
function getStore(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DDCoderDojoOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      resolve(store);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteFromStore(store, id) {
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Performance monitoring
self.addEventListener('fetch', event => {
  const startTime = performance.now();
  
  event.waitUntil(
    event.respondWith(
      // Your existing fetch handling logic here
      handleRequest(event.request).then(response => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log performance metrics
        console.log(`Request ${event.request.url} took ${duration}ms`);
        
        return response;
      })
    )
  );
});

// Handle requests with appropriate strategy
async function handleRequest(request) {
  // This would contain your existing fetch event logic
  // Simplified for this example
  try {
    return await fetch(request);
  } catch (error) {
    return await caches.match(request) || new Response('Offline', { status: 503 });
  }
}
