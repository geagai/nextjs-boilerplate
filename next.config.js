const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  experimental: {
    // outputFileTracingRoot removed from here
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    domains: ['i.pinimg.com', 'logospng.org', 'static.vecteezy.com']
  },
};

// Monkey-patch console.warn to trace Supabase session warning on the server
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const originalWarn = console.warn;
  console.warn = function (...args) {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('getSession() or from some supabase.auth.onAuthStateChange() events could be insecure')
    ) {
      originalWarn.apply(console, args);
      console.trace('Supabase session warning stack trace (server):');
    } else {
      originalWarn.apply(console, args);
    }
  };
}

module.exports = nextConfig; 