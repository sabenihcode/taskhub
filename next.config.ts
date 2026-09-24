import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Enable static export
  output: "export",
  
  images: {
    unoptimized: true, // Required untuk static export
  },
  
  // Disable image optimization, ESLint, etc for static build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
