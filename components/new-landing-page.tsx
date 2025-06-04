"use client";

import { useAuth } from '@/components/providers/auth-provider';
import { 
  HeroSection, 
  FeaturesSection, 
  CTASection 
} from "@/components/LandingPage";

export default function NewLandingPage() {
  const { user, loading } = useAuth();
  const isAuthenticated = !loading && !!user;

  return (
    <main className="overflow-hidden">
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturesSection />
      <CTASection isAuthenticated={isAuthenticated} />
    </main>
  );
} 