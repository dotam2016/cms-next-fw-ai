import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.resolve("."),
  },
  allowedDevOrigins: ["172.16.9.153", "172.16.11.224"],
};

export default nextConfig;

