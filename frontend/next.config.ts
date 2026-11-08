import type { NextConfig } from 'next';
import path from 'node:path';
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  async rewrites() {
    return [{ source: '/api/:path*', destination: (process.env.API_URL || 'http://127.0.0.1:5000') + '/api/:path*' }];
  },
};
export default nextConfig;
