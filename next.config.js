/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://jobmarket-backend-production.up.railway.app/api/:path*',
      },
      {
        source: '/health',
        destination: 'https://jobmarket-backend-production.up.railway.app/health',
      },
    ]
  },
}

module.exports = nextConfig