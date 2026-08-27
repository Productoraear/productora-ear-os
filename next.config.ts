import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/catering-brasas',
        destination: '/catering-de-brasas',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
