import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ HAPUS: output: "export",
  
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
