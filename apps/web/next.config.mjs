/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}` : "");

const nextConfig = {
  output: isGithubPages ? "export" : "standalone",
  basePath: isGithubPages ? basePath : "",
  trailingSlash: isGithubPages,
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  transpilePackages: [
    "@celebrai/ui",
    "@celebrai/schemas",
    "@celebrai/api-genai",
    "@celebrai/pdf-export",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react", "@celebrai/ui"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
