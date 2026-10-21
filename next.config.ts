import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/timebound-treasures-web",
  assetPrefix: "/timebound-treasures-web/",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ebayimg.com", pathname: "/**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
