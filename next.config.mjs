/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.abacus.ai",
      },
    ],
  },
};

export default nextConfig;
