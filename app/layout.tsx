import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Video, Github, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { CustomToastProvider } from "@/components/providers/toast-provider";

// 폰트 최적화 설정
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // 폰트 로딩 중 fallback 폰트 사용
  preload: true,
  variable: '--font-inter'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Shot Form AI - AI 기반 쇼트폼 비디오 생성",
  description: "AI가 30초 만에 프로급 쇼트폼 비디오를 자동 생성합니다. 스크립트부터 음성, 편집까지 모든 것을 AI가 처리합니다.",
  keywords: "AI 비디오, 쇼트폼, 비디오 생성, 자동 편집, TypeCast, AI 스크립트",
  authors: [{ name: "제이앤유통" }],
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Shot Form AI - AI 기반 쇼트폼 비디오 생성",
    description: "AI가 30초 만에 프로급 쇼트폼 비디오를 자동 생성합니다.",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/logo-400x400.png",
        width: 400,
        height: 400,
        alt: "Shot Form AI 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shot Form AI - AI 기반 쇼트폼 비디오 생성",
    description: "AI가 30초 만에 프로급 쇼트폼 비디오를 자동 생성합니다.",
    images: ["/logo-400x400.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <AuthProvider>
          <CustomToastProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                {children}
              </main>
              <footer className="border-t py-12 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-bold text-xl">
                        <Image 
                          src="/logo-small.png" 
                          alt="Shot Form AI 로고" 
                          width={32} 
                          height={32}
                          className="rounded-lg"
                        />
                        <span className="text-primary">Shot Form AI</span>
                      </div>
                      <p className="text-sm text-slate-700">
                        AI 기술로 30초 만에 프로급 쇼트폼 비디오를 생성하세요. 
                        스크립트부터 편집까지 모든 것을 자동화합니다.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3 text-slate-900">서비스</h3>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li>
                          <Link href="/script-generator" className="hover:text-primary transition-colors">
                            스크립트 생성
                          </Link>
                        </li>
                        <li>
                          <Link href="/create" className="hover:text-primary transition-colors">
                            비디오 생성
                          </Link>
                        </li>
                        <li>
                          <Link href="/my-videos" className="hover:text-primary transition-colors">
                            내 비디오
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard" className="hover:text-primary transition-colors">
                            대시보드
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3 text-slate-900">고객지원</h3>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>01083087385</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>tlswkehd@gmail.com</span>
                        </li>
                        <li>
                          <Link href="/privacy" className="hover:text-primary transition-colors">
                            개인정보처리방침
                          </Link>
                        </li>
                        <li>
                          <Link href="/terms" className="hover:text-primary transition-colors">
                            이용약관
                          </Link>
                        </li>
                        <li>
                          <Link href="/refund" className="hover:text-primary transition-colors">
                            환불정책
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3 text-slate-900">소셜</h3>
                      <div className="flex space-x-3 mb-4">
                        <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-primary transition-colors">
                          <Github className="h-5 w-5" />
                          <span className="sr-only">Github</span>
                        </Link>
                        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-primary transition-colors">
                          <Twitter className="h-5 w-5" />
                          <span className="sr-only">Twitter</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* 사업자 정보 섹션 - 토스페이먼츠 심사 대응 */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="bg-slate-100 p-6 rounded-lg">
                      <h3 className="font-medium mb-4 text-slate-900">사업자 정보</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-700">
                        <div>
                          <span className="font-medium">상호명:</span> 제이앤유통
                        </div>
                        <div>
                          <span className="font-medium">대표자명:</span> 신예준
                        </div>
                        <div>
                          <span className="font-medium">사업자등록번호:</span> 609-41-95762
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">사업장 주소:</span> 경상남도 창원시 의창구 사화로 80번길 20, 201호(팔용동)
                        </div>
                        <div>
                          <span className="font-medium">통신판매업 신고번호:</span> 제2023-경남창원-0123호
                        </div>
                        <div>
                          <span className="font-medium">개인정보보호책임자:</span> 신예준 (tlswkehd@gmail.com)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-700">
                    <p>&copy; {new Date().getFullYear()} 제이앤유통 (Shot Form AI). 모든 권리 보유.</p>
                    <p className="mt-2">고객센터 운영시간: 평일 09:00~18:00 (토·일요일, 공휴일 휴무)</p>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </CustomToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 
