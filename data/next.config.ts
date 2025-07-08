import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_VTU_API_BASE_URL: process.env.NEXT_PUBLIC_VTU_API_BASE_URL,
    NEXT_PUBLIC_VTU_API_USERNAME: process.env.NEXT_PUBLIC_VTU_API_USERNAME,
    NEXT_PUBLIC_VTU_API_PASSWORD: process.env.NEXT_PUBLIC_VTU_API_PASSWORD,
  },
}