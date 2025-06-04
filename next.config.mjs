/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next.js 15 호환성을 위한 설정
  },
  images: {
    domains: ['via.placeholder.com'],
  },
  // MCP 관련 폴더 제외
  webpack: (config, { dev, isServer }) => {
    // MCP 관련 폴더를 빌드에서 제외
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    
    // MCP 관련 파일들을 무시
    config.module.rules.push({
      test: /supabase-mcp/,
      use: 'ignore-loader'
    })
    
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/supabase-mcp/**', '**/node_modules/**']
      }
    }
    return config
  },
  // TypeScript 설정에서 MCP 폴더 제외
  typescript: {
    ignoreBuildErrors: false,
  },
  // 빌드 시 특정 폴더 제외
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
