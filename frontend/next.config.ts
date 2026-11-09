import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  async rewrites() {
    return [{ source: '/api/:path*', destination: (process.env.API_URL || 'http://127.0.0.1:5000') + '/api/:path*' }];
  },
};
export default nextConfig;
