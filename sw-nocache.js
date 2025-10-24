// Service Worker "no-cache" para PDFs y videos
const NC_EXT = ['.pdf', '.mp4', '.webm', '.ogg'];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);

    // Solo mismo origen
    if (self.location && url.origin !== self.location.origin) return;

    const lower = url.pathname.toLowerCase();
    const target = NC_EXT.some(ext => lower.endsWith(ext));
    if (!target) return;

    // Forzar miss de caché
    url.searchParams.set('v', Date.now().toString());

    const req = new Request(url.toString(), {
      method: event.request.method,
      headers: event.request.headers,
      mode: event.request.mode,
      credentials: event.request.credentials,
      redirect: event.request.redirect,
      referrer: event.request.referrer,
      referrerPolicy: event.request.referrerPolicy,
      cache: 'no-store',
      integrity: event.request.integrity,
      keepalive: event.request.keepalive,
    });

    event.respondWith(fetch(req));
  } catch {
    // Si algo falla, dejamos pasar la request original
  }
});
