import { createDefaultConfig } from '@open-wc/building-rollup';
import cpy from 'rollup-plugin-cpy';
import filesize from 'rollup-plugin-filesize';

const config = createDefaultConfig({
  input: './index.html',
});

export default // add plugin to the first config
{
  ...config,
  output: {
    ...config.output,
    sourcemap: false,
  },
  plugins: [
    ...config.plugins,
    cpy({
      // copy over all images files
      files: ['favicon.ico', 'manifest.json'],
      dest: 'dist',
    }),
    filesize(),
  ],
};
