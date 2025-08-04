const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com", "logos-world.net"],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Three.js on client side only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    return config
  },
  experimental: {
    esmExternals: "loose",
  },
  async rewrites() {
    return [
      // Keep your /api/* rule if you want
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      // Catch-all for other backend endpoints (customize as needed)
      {
        source: '/backend/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ]
  }
}

module.exports = nextConfig
