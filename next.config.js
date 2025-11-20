/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  
  // Webpack configuration for Better Auth with PostgreSQL
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore pg-native module (it's an optional native binding)
      config.externals.push('pg-native');
    }
    
    // Ensure framer-motion is properly bundled
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Suppress warnings about pg-native
    config.ignoreWarnings = [
      { module: /node_modules\/pg\/lib\/native/ },
    ];
    
    return config;
  },
}

module.exports = nextConfig
