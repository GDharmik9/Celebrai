/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const isStandalone = process.env.DOCKER_BUILD === "true";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.GITHUB_REPOSITORY && isGithubPages
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
    : "");

const nextConfig = {
  ...(isGithubPages ? { output: "export", trailingSlash: true } : {}),
  ...(isStandalone ? { output: "standalone" } : {}),
  basePath: isGithubPages ? basePath : "",
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
};

export default nextConfig;
