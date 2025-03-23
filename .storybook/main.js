import { dirname, join } from "path";
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],

  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-controls"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-viewport"),
    getAbsolutePath("@storybook/addon-designs"),
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("storybook-addon-fetch-mock"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    "@chromatic-com/storybook"
  ],

  webpackFinal: async config => {
    // Add typescript support 
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: 'ts-loader',
    }
    );
    config.resolve.extensions.push('.ts', '.tsx', '.js');
    config.plugins.push(
      new CopyPlugin({
        patterns:  [
          { from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js', to: 'webcomponentsjs/webcomponents-loader.js' },
          { from: 'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js', to: 'webcomponentsjs/custom-elements-es5-adapter.js' },
        ]
        }),
    );
    return config;
  },

  framework: {
    name: getAbsolutePath("@storybook/html-webpack5"),
    options: {}
  },

  docs: {}
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
  