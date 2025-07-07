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

// Import custom webpack config
const customWebpackConfig = require('./webpack.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
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
        path.resolve(__dirname, 'node_modules/tailwindcss/plugin')
      )
    );

    return config;
  },
  
  // Enable experimental features
  experimental: {
    // Disable CSS optimizations as they might cause issues
    optimizeCss: false,
    // Enable package imports optimization
    optimizePackageImports: ['@nextui-org/react'],
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000', 'sports-scribe.vercel.app']
    },
  },
  
  // Transpile @nextui-org/react
  transpilePackages: ['@nextui-org/react'],
  
  // Compiler options
  compiler: {
    // Enable styled-components support
    styledComponents: true,
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