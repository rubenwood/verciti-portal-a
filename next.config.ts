import type { NextConfig } from "next";

// set tubropack to false
const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@ffmpeg-installer/ffmpeg", "fluent-ffmpeg"],
};

export default nextConfig;
