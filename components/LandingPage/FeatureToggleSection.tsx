"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { Code, GitBranch, Users, Workflow, ShieldCheck } from "lucide-react";

export default function FeatureToggleSection() {
  const [activeTab, setActiveTab] = useState("code");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-20 bg-github-light dark:bg-github-gradient theme-aware-white overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-github-dots bg-center opacity-5 dark:opacity-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-github-purple/30 dark:via-github-purple/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-github-blue/30 dark:via-github-blue/50 to-transparent"></div>
      
      {/* 장식 요소 */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-github-purple/5 dark:bg-github-purple/10 blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-github-blue/5 dark:bg-github-blue/10 blur-3xl animate-float" style={{ animationDelay: '1.2s' }}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col items-center mb-12">
              <TabsList className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-1 rounded-full shadow-lg">
                <TabsTrigger 
                  value="code" 
                  className="data-[state=active]:bg-github-purple data-[state=active]:text-white rounded-full px-6 py-2 flex items-center gap-2 transition-all duration-300"
                >
                  <Code className="h-4 w-4" />
                  <span>코드</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="plan" 
                  className="data-[state=active]:bg-github-purple data-[state=active]:text-white rounded-full px-6 py-2 flex items-center gap-2 transition-all duration-300"
                >
                  <GitBranch className="h-4 w-4" />
                  <span>계획</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="collaborate" 
                  className="data-[state=active]:bg-github-purple data-[state=active]:text-white rounded-full px-6 py-2 flex items-center gap-2 transition-all duration-300"
                >
                  <Users className="h-4 w-4" />
                  <span>협업</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="automate" 
                  className="data-[state=active]:bg-github-purple data-[state=active]:text-white rounded-full px-6 py-2 flex items-center gap-2 transition-all duration-300"
                >
                  <Workflow className="h-4 w-4" />
                  <span>자동화</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="secure" 
                  className="data-[state=active]:bg-github-purple data-[state=active]:text-white rounded-full px-6 py-2 flex items-center gap-2 transition-all duration-300"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>보안</span>
                </TabsTrigger>
              </TabsList>
              <p className="theme-aware-light mt-6 text-center max-w-2xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
                {activeTab === "code" && "AI 기술로 코드를 빠르고 안전하게 작성하세요."}
                {activeTab === "plan" && "효율적인 계획으로 프로젝트를 성공적으로 관리하세요."}
                {activeTab === "collaborate" && "팀원들과 원활하게 협업하여 생산성을 높이세요."}
                {activeTab === "automate" && "반복 작업을 자동화하여 핵심 업무에 집중하세요."}
                {activeTab === "secure" && "최고 수준의 보안으로 데이터를 안전하게 보호하세요."}
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 shadow-2xl animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <TabsContent value="code" className="m-0">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-github-purple/20 to-github-blue/20 z-10"></div>
                  <Image 
                    src="/feature-code.webp" 
                    alt="코드 작성 기능" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700 z-20 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                    <h3 className="text-xl font-semibold text-white mb-2">AI 코드 작성</h3>
                    <p className="theme-aware-light">최신 AI 기술로 코드 작성 속도를 높이고 품질을 향상시킵니다.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="plan" className="m-0">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-github-blue/20 to-github-green/20 z-10"></div>
                  <Image 
                    src="/feature-plan.webp" 
                    alt="계획 기능" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700 z-20 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                    <h3 className="text-xl font-semibold text-white mb-2">효율적인 계획</h3>
                    <p className="theme-aware-light">데이터 기반 의사결정으로 프로젝트를 효율적으로 계획하고 관리합니다.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="collaborate" className="m-0">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-github-green/20 to-github-yellow/20 z-10"></div>
                  <Image 
                    src="/feature-collaborate.webp" 
                    alt="협업 기능" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700 z-20 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                    <h3 className="text-xl font-semibold text-white mb-2">원활한 협업</h3>
                    <p className="theme-aware-light">팀원들과 실시간으로 협업하여 프로젝트 진행 속도를 높입니다.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="automate" className="m-0">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-github-yellow/20 to-github-orange/20 z-10"></div>
                  <Image 
                    src="/feature-automate.webp" 
                    alt="자동화 기능" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700 z-20 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                    <h3 className="text-xl font-semibold text-white mb-2">작업 자동화</h3>
                    <p className="theme-aware-light">반복적인 작업을 자동화하여 핵심 업무에 집중할 수 있습니다.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="secure" className="m-0">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-github-orange/20 to-github-red/20 z-10"></div>
                  <Image 
                    src="/feature-secure.webp" 
                    alt="보안 기능" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700 z-20 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                    <h3 className="text-xl font-semibold text-white mb-2">강력한 보안</h3>
                    <p className="theme-aware-light">최고 수준의 보안 기술로 데이터를 안전하게 보호합니다.</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
} 