import Link from "next/link";

export default function FooterSection() {
  return (
    <section className="py-10 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm theme-aware-light">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              개인정보처리방침
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              이용약관
            </Link>
            <span>•</span>
            <span>&copy; {new Date().getFullYear()} 자동AI. 모든 권리 보유.</span>
          </div>
        </div>
      </div>
    </section>
  );
} 