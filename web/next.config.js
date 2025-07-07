const path = require('path');
const webpack = require('webpack');

// Filter out deprecated NextUI warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('@nextui-org/')) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Disable SWC in favor of Babel
process.env.NEXT_DISABLE_SWC = 'true';

// Import custom webpack config
const customWebpackConfig = require('./webpack.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Strict Mode to avoid potential issues with NextUI
  reactStrictMode: false,
  
  // Disable SWC minification in favor of Terser
  swcMinify: false,
  
  // Configure images
  images: {
    domains: [],
  },
  
  // Use custom webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Merge custom webpack config
    config = {
      ...config,
      resolve: {
        ...config.resolve,
        ...customWebpackConfig.resolve,
        alias: {
          ...config.resolve.alias,
          ...customWebpackConfig.resolve.alias,
          // Ensure tailwindcss/plugin is resolved correctly
          'tailwindcss/plugin': path.resolve(__dirname, 'node_modules/tailwindcss/plugin.js'),
        },
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          ...customWebpackConfig.module.rules,
        ],
      },
    };

    // Add additional fallbacks for client-side only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
        cluster: false,
      };
    }

    // Add a plugin to handle the tailwindcss/plugin resolution
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /tailwindcss\/plugin/,
        path.resolve(__dirname, 'node_modules/tailwindcss/plugin.js')
      )
    );

    return config;
  },
  
  // Disable experimental features that might cause issues
  experimental: {
    // Disable CSS optimizations
    optimizeCss: false,
    // Disable package imports optimization
    optimizePackageImports: [],
    // Disable server actions
    serverActions: false,
    // Disable other experimental features
    esmExternals: false,
    externalDir: false,
    outputFileTracingRoot: undefined,
  },
  
  // Transpile @nextui-org/react
  transpilePackages: ['@nextui-org/react'],
  
  // Compiler options
  compiler: {
    // Disable styled-components support
    styledComponents: false,
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Linting and type checking
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Output standalone for better compatibility with Vercel
  output: 'standalone',
  
  // Enable CSS modules
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  
  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;