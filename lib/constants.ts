/**
 * Supabase Storage 관련 상수들
 * 이미지 및 파일 URL 관리
 */

// Supabase 프로젝트 설정
export const SUPABASE_PROJECT_ID = 'scophizorpxzzvsqjame'
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`
export const STORAGE_BUCKET = 'shortformai'

// Storage 기본 URL
export const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`

/**
 * 로고 및 아이콘 URL들
 */
export const LOGO_URLS = {
  // 메인 로고
  logo: `${STORAGE_BASE_URL}/public/logo.png`,
  logoSmall: `${STORAGE_BASE_URL}/public/logo-small.png`,
  logoMedium: `${STORAGE_BASE_URL}/public/logo-medium.png`,
  logoLarge: `${STORAGE_BASE_URL}/public/logo-large.png`,
  
  // 다양한 사이즈
  logo100: `${STORAGE_BASE_URL}/public/logo-100x100.png`,
  logo200: `${STORAGE_BASE_URL}/public/logo-200x200.png`,
  logo400: `${STORAGE_BASE_URL}/public/logo-400x400.png`,
  
  // 파비콘
  favicon: `${STORAGE_BASE_URL}/public/favicon.ico`,
  favicon16: `${STORAGE_BASE_URL}/public/favicon-16x16.png`,
  favicon32: `${STORAGE_BASE_URL}/public/favicon-32x32.png`,
  favicon96: `${STORAGE_BASE_URL}/public/favicon-96x96.png`,
  
  // 모바일 아이콘
  appleTouchIcon: `${STORAGE_BASE_URL}/public/apple-touch-icon.png`,
  androidChrome192: `${STORAGE_BASE_URL}/public/android-chrome-192x192.png`,
  androidChrome512: `${STORAGE_BASE_URL}/public/android-chrome-512x512.png`,
} as const

/**
 * 헬퍼 함수: Storage 파일 URL 생성
 */
export function getStorageUrl(filePath: string): string {
  return `${STORAGE_BASE_URL}/${filePath}`
}

/**
 * 헬퍼 함수: 파비콘 메타데이터 생성
 */
export function getFaviconMetadata() {
  return {
    icon: [
      { url: LOGO_URLS.favicon16, sizes: "16x16", type: "image/png" },
      { url: LOGO_URLS.favicon32, sizes: "32x32", type: "image/png" },
      { url: LOGO_URLS.favicon96, sizes: "96x96", type: "image/png" },
    ],
    shortcut: LOGO_URLS.favicon,
    apple: LOGO_URLS.appleTouchIcon,
  }
}

/**
 * 헬퍼 함수: OpenGraph 이미지 메타데이터 생성
 */
export function getOpenGraphImages() {
  return [
    {
      url: LOGO_URLS.logo400,
      width: 400,
      height: 400,
      alt: "Shot Form AI 로고",
    },
  ]
}

/**
 * 헬퍼 함수: PWA 매니페스트 아이콘 배열 생성
 */
export function getManifestIcons() {
  return [
    {
      src: LOGO_URLS.androidChrome192,
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: LOGO_URLS.androidChrome512,
      sizes: "512x512",
      type: "image/png"
    }
  ]
} 