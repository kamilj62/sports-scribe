const path = require('path');

module.exports = {
  resolve: {
    alias: {
      // Ensure tailwindcss/plugin is resolved correctly
      'tailwindcss/plugin': path.resolve(__dirname, 'node_modules/tailwindcss/plugin'),
      // Ensure NextUI theme is resolved correctly
      '@nextui-org/theme': path.resolve(__dirname, 'node_modules/@nextui-org/theme/dist/index.js'),
    },
    fallback: {
      fs: false,
      path: false,
      os: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      dgram: false,
      cluster: false,
    },
    modules: [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
};
