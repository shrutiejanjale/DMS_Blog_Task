/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.180',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
    // Add this to handle special characters in filenames
    unoptimized: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;