"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Sparkles } from "lucide-react";
import Link from "next/link";

interface CTASectionProps {
  isAuthenticated: boolean;
}

export default function CTASection({ isAuthenticated }: CTASectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          지금 바로 시작해보세요
        </h2>
        <p className="text-xl mb-8 opacity-90">
          첫 번째 AI 비디오를 30초 만에 만들어보세요. 신용카드 필요 없습니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          {isAuthenticated ? (
            <Link href="/dashboard" className="flex-1">
              <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                <Video className="mr-2 h-5 w-5" />
                대시보드로 이동
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/signup" className="flex-1">
                <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login" className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10">
                  로그인
                </Button>
              </Link>
            </>
          )}
        </div>
        
        <div className="mt-8 text-sm opacity-75">
          <p>✨ 월 10회 무료 생성 • 신용카드 불필요 • 언제든 취소 가능</p>
        </div>
      </div>
    </section>
  );
} 