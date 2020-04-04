import { createDefaultConfig } from '@open-wc/building-rollup';
import copy from 'rollup-plugin-copy';
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
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: 'img/*', dest: 'dist/img' },
      ],
    }),
    filesize(),
  ],
};
