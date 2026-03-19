/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // When using ngrok (or any reverse proxy) in dev, Next may warn about cross-origin
  // requests for /_next/* assets. Allow our dev origins explicitly.
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    // ngrok dev subdomain used in this repo
    "trifacial-trailless-nikki.ngrok-free.dev",
  ],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = nextConfig;
