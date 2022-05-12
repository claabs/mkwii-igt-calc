import html from '@web/rollup-plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import { copy } from '@web/rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import { generateSW } from 'rollup-plugin-workbox';
import summary from 'rollup-plugin-summary';

import workboxConfig from './workbox-config.js';

export default {
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: 'index.html',
      serviceWorkerPath: workboxConfig.swDest,
    }),
    // Resolve bare module specifiers to relative paths
    resolve(),
    // Minify HTML template literals
    minifyHTML(),
    // Minify JS
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    generateSW(workboxConfig),
    copy({
      patterns: ['assets/icon-*'],
    }),
    // Print bundle summary
    summary(),
  ],
  output: {
    dir: 'dist',
    entryFileNames: '[name]-[hash].js',
  },
  preserveEntrySignatures: 'strict',
};
