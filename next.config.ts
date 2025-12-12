import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1mqi2pyqsa9k.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
