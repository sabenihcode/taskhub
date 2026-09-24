import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['firebase', 'firebase-admin'],
  
  // ✅ Add empty turbopack config to silence warning
  turbopack: {},
  
  // ❌ Remove webpack config (tidak diperlukan untuk Cloudflare Workers)
  // Turbopack akan handle bundling secara otomatis
};

export default nextConfig;
