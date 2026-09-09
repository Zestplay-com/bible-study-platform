import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Bible Teacher uses a server API route, so the production app must
  // run on a server-capable host such as Vercel rather than static GitHub Pages.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
