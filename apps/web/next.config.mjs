/** @type {import('next').NextConfig} */
const nextConfig = {
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
