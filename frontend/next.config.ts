import type { NextConfig } from "next";
import { loadEnvConfig } from '@next/env';
import path from 'path';

const parentDir = path.join(process.cwd(), '..');
loadEnvConfig(parentDir);

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'localhost';
    const apiPort = process.env.NEXT_PUBLIC_API_PORT || '3001';

    console.log('Rewriting /api to:', `http://${apiBaseUrl}:${apiPort}/api`);
    
    return [
      {
        source: '/api/:path*',
        destination: `http://${apiBaseUrl}:${apiPort}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
