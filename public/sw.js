// Service Worker - 优化缓存策略
const CACHE_NAME = 'nav-web-v2';
const STATIC_ASSETS = [];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// 网络优先策略
self.addEventListener('fetch', (event) => {
    // 跳过 Supabase API 请求
    if (event.request.url.includes('supabase.co')) {
        return;
    }

    const url = new URL(event.request.url);
    const isHtmlRequest =
        event.request.mode === 'navigate' ||
        (event.request.headers.get('accept') || '').includes('text/html') ||
        event.request.destination === 'document';

    const isStaticAsset =
        /\.(?:js|css|svg|png|jpg|jpeg|webp|gif|ico|woff2?)$/i.test(url.pathname) ||
        ['script', 'style', 'image', 'font'].includes(event.request.destination);

    if (isHtmlRequest) {
        // HTML 采用网络优先，不缓存 HTML
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/index.html'))
        );
        return;
    }

    if (isStaticAsset && event.request.method === 'GET') {
        // 静态资源缓存优先
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // 其它请求网络优先，失败则回退缓存
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
