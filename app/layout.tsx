import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Video, Github, Twitter } from "lucide-react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { CustomToastProvider } from "@/components/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shot Form AI - AI 기반 쇼트폼 비디오 생성",
  description: "AI가 30초 만에 프로급 쇼트폼 비디오를 자동 생성합니다. 스크립트부터 음성, 편집까지 모든 것을 AI가 처리합니다.",
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
                        <Video className="h-5 w-5 text-primary" />
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
                      <h3 className="font-medium mb-3 text-slate-900">회사</h3>
                      <ul className="space-y-2 text-sm text-slate-700">
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
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3 text-slate-900">소셜</h3>
                      <div className="flex space-x-3">
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
                  <div className="mt-10 pt-6 border-t border-slate-200 text-center text-sm text-slate-700">
                    <p>&copy; {new Date().getFullYear()} Shot Form AI. 모든 권리 보유.</p>
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