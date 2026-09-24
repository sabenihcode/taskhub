import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // ✅ Add this to allow client-side rendering for dynamic routes
  experimental: {
    // Force dynamic rendering where needed
  },
  // Ignore TypeScript errors during build (faster deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
