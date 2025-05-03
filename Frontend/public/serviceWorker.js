// Service Worker for caching and offline support
const CACHE_NAME = 'locallink-cache-v1';

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/assets/images/logo.svg',
  '/assets/css/critical.css',
  '/offline.html',
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or fetch from network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For HTML requests, use network-first strategy
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version of the page
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If fetch fails, serve from cache or fall back to offline page
          return caches.match(event.request)
            .then((response) => {
              return response || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // For image and CSS assets, use cache-first strategy
  if (
    event.request.headers.get('accept')?.includes('image') ||
    event.request.url.endsWith('.css') ||
    event.request.url.endsWith('.js') ||
    event.request.url.includes('/assets/')
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request).then((netResponse) => {
          // Cache the new asset
          const responseClone = netResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return netResponse;
        }).catch(() => {
          // For images, return a placeholder if available
          if (event.request.headers.get('accept')?.includes('image')) {
            return caches.match('/assets/images/image-placeholder.svg');
          }
          return new Response('/* Resource not available offline */', { 
            status: 503,
            headers: {'Content-Type': 'text/css'} 
          });
        });
      })
    );
    return;
  }

  // For API calls, use network-first with fallback to cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for offline functionality
          return caches.match(event.request);
        })
    );
    return;
  }

  // Default strategy for other requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).catch(() => {
          // Return offline.html only for document navigations
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Background Sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'form-submit') {
    event.waitUntil(syncForms());
  }
});

// Process pending form submissions
const syncForms = async () => {
  try {
    // Get all pending submissions from IndexedDB or other storage
    const pendingSubmissions = await getPendingSubmissions();
    
    // Process each submission
    const promises = pendingSubmissions.map(async (submission) => {
      try {
        // Attempt to send the form data
        const response = await fetch(submission.url, {
          method: submission.method,
          headers: submission.headers,
          body: submission.body,
          credentials: 'same-origin'
        });
        
        if (response.ok) {
          // Remove from pending if successful
          await removePendingSubmission(submission.id);
          // Notify the user if possible
          showSubmissionSuccessNotification(submission.type);
        }
      } catch (error) {
        console.error('Background sync error:', error);
      }
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error processing background sync:', error);
  }
};

// Helper function placeholder for pending submissions
const getPendingSubmissions = async () => {
  // In a real implementation, this would retrieve data from IndexedDB
  // For demo purposes, return an empty array
  return [];
};

// Helper function placeholder to remove pending submission
const removePendingSubmission = async (id) => {
  // In a real implementation, this would remove the item from IndexedDB
  console.log(`Submission ${id} completed successfully`);
};

// Helper function to show notification
const showSubmissionSuccessNotification = (type) => {
  if ('Notification' in self && self.registration.showNotification) {
    self.registration.showNotification('Form Submitted', {
      body: `Your ${type} form was successfully submitted!`,
      icon: '/icons/apple-icon-180.png',
      badge: '/icons/badge-icon.png'
    });
  }
};

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/apple-icon-180.png',
    badge: '/icons/badge-icon.png',
    data: {
      url: data.url || '/',
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click - open appropriate page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
}); 