/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next.js 15 호환성을 위한 설정
    optimizeCss: true,
  },
  images: {
    domains: ['via.placeholder.com'],
  },
  // CSS 최적화 비활성화 (개발 중)
  swcMinify: false,
  // Tailwind CSS 지원 강화
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
