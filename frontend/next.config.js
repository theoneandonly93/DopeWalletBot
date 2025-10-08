/**
 * Next.js custom config to avoid bundling certain Supabase server-only packages
 * into the client bundle which can cause dynamic require warnings.
 */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = config.resolve.fallback || {};
      // These Supabase packages use dynamic requires which trigger warnings in the client build.
      // Mark them as not available in the client bundle so the server-side code can still import them.
      config.resolve.fallback['@supabase/functions-js'] = false;
      config.resolve.fallback['@supabase/storage-js'] = false;
    }
    return config;
  },
};

module.exports = nextConfig;
