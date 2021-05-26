/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "img/apple-192.png",
    "revision": "44cf354f354799aa907ef78bc12eb19c"
  },
  {
    "url": "img/favicon.ico",
    "revision": "6e8554292a3be6b6c3b65e1f26ba4cea"
  },
  {
    "url": "img/icon-192.png",
    "revision": "d1152d2df0085a72a150d330300406ba"
  },
  {
    "url": "img/icon-512.png",
    "revision": "0a4a1ca8376a94db7d1e1bfdb5c4fad4"
  },
  {
    "url": "index.html",
    "revision": "60da4236296f5c9688127443e568083c"
  },
  {
    "url": "manifest.json",
    "revision": "bcb8c26c1ac7d171cebd971ec02faa10"
  },
  {
    "url": "mkwii-igt-calc-app-4267e927.js"
  },
  {
    "url": "polyfills/custom-elements-es5-adapter.84b300ee818dce8b351c7cc7c100bcf7.js"
  },
  {
    "url": "polyfills/dynamic-import.b745cfc9384367cc18b42bbef2bbdcd9.js"
  },
  {
    "url": "polyfills/webcomponents.6954abecfe8b165751e6bc9b0af6c639.js"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/^https:\/\/fonts\.googleapis\.com/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"google-fonts-stylesheets", plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/fonts\.gstatic\.com/, new workbox.strategies.CacheFirst({ "cacheName":"google-fonts-webfonts", plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxAgeSeconds: 31536000, maxEntries: 30, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/ajax\.googleapis\.com/, new workbox.strategies.CacheFirst({ "cacheName":"typekit-loader", plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxAgeSeconds: 31536000, maxEntries: 30, purgeOnQuotaError: false })] }), 'GET');
