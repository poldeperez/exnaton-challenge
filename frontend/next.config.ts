import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'localhost';
    const apiPort = process.env.NEXT_PUBLIC_API_PORT || '3001';
    
    return [
      {
        source: '/api/:path*',
        destination: `http://${apiBaseUrl}:${apiPort}/:path*`,
      },
    ];
  },
};

export default nextConfig;
