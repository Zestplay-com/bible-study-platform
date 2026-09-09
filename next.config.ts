import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? "/bible-study-platform" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // GitHub Pages needs a static export. Vercel should use normal Next.js
  // routing so dynamic Bible routes do not become 404s.
  ...(isGitHubPages ? { output: "export" as const } : {}),
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
