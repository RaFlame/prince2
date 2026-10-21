import type { NextConfig } from "next"
import path from "path"

const projectRoot = path.join(__dirname)

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Pin root so a stray lockfile in the home directory is not picked
    root: projectRoot,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/debug-*.log",
          "**/.cursor/**",
        ],
      }
    }
    return config
  },
}

export default nextConfig
