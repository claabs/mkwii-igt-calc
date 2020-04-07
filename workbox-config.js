// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  swDest: path.join(__dirname, 'dist', 'sw.js'),
  globDirectory: path.join(__dirname, 'dist'),
  globPatterns: ['**/*.{js,png,ico,svg,html,json,css}'],
  modifyUrlPrefix: {
    '/': '',
  },
  dontCacheBustURLsMatching: /[.-](\w{8}|\w{32})\./,
  runtimeCaching: [
    // {
    //   urlPattern: /\.(?:js|css)$/,
    //   handler: 'StaleWhileRevalidate',
    //   options: {
    //     cacheName: 'static-resources',
    //   },
    // },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        cacheableResponse: {
          statuses: [0, 200],
        },
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        },
      },
    },
    {
      urlPattern: /^https:\/\/ajax\.googleapis\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'typekit-loader',
        cacheableResponse: {
          statuses: [0, 200],
        },
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        },
      },
    },
  ],
};
