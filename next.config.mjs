/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next.js 15 호환성을 위한 설정
  },
  images: {
    domains: ['via.placeholder.com'],
  },
  // Vercel 배포 최적화
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
};

export default nextConfig;
