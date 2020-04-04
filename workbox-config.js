// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  globDirectory: path.join(__dirname, 'dist'),
  globPatterns: ['**/*.{js,png,ico,svg,html,json,css}'],
  swDest: path.join(__dirname, 'dist', 'sw.js'),
  modifyUrlPrefix: {
    '/': '',
  },
};
