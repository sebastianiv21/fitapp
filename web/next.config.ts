import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.AUTH_URL || 'http://localhost:3000'}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
