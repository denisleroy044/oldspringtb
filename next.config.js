/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove the eslint config from here
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add experimental config
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
