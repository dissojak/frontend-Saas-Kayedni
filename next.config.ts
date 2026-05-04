import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com", port: "", pathname: "/**" },
    ],
  },

  compiler: {
    // Removes console.log/info/debug in production builds (keeps console.error)
    removeConsole: process.env.NODE_ENV === "production",
  },

  // devIndicators: false,
};

export default nextConfig;