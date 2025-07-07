const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Disable SWC minification in favor of Terser
  swcMinify: false,
  
  // Configure images
  images: {
    domains: [],
  },
  
  // Simple webpack configuration
  webpack: (config, { isServer }) => {
    // Add fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
        cluster: false,
      };
    }
    
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Enable experimental features
  experimental: {
    // Enable CSS optimizations
    optimizeCss: true,
    // Enable package imports optimization
    optimizePackageImports: ['@nextui-org/react'],
  },
  
  // Transpile @nextui-org/react
  transpilePackages: ['@nextui-org/react'],
  
  // Compiler options
  compiler: {
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
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

// Filter out deprecated NextUI warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('@nextui-org/')) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

module.exports = nextConfig;