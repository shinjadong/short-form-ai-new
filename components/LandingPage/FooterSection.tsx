import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="py-12 bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* 회사 정보 */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">Shot Form AI</h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              AI 기술로 누구나 쉽게 전문가 수준의 쇼트폼 비디오를 만들 수 있는 플랫폼입니다. 
              스크립트 생성부터 음성 합성, 영상 편집까지 모든 과정을 자동화했습니다.
            </p>
            <div className="space-y-1 text-sm">
              <p><strong>제이앤유통</strong></p>
              <p>사업자등록번호: 609-41-95762</p>
              <p>대표: 신예준</p>
              <p>주소: 경상남도 창원시 의창구 사화로 80번길 20, 201호(팔용동)</p>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="hover:text-white transition-colors">
                  AI 영상 제작
                </Link>
              </li>
              <li>
                <Link href="/script-generator" className="hover:text-white transition-colors">
                  스크립트 생성
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  요금제
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  대시보드
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div>
            <h4 className="text-white font-semibold mb-4">고객 지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:tlswkehd@gmail.com" className="hover:text-white transition-colors">
                  tlswkehd@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:01083087385" className="hover:text-white transition-colors">
                  01083087385
                </a>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  환불 문의
                </Link>
              </li>
              <li>
                <span className="text-gray-400">평일 09:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 정책 링크 */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <Link href="/terms" className="hover:text-white transition-colors">
                이용약관
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                개인정보처리방침
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/refund" className="hover:text-white transition-colors">
                환불정책
              </Link>
            </div>

            {/* 저작권 */}
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} 제이앤유통. 모든 권리 보유.
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
            <p className="mb-2">
              통신판매업신고번호: 제2024-경남창원-0123호 | 
              개인정보보호책임자: 신예준 (tlswkehd@gmail.com)
            </p>
            <p>
              결제대행서비스: 토스페이먼츠 | 
              호스팅서비스: Amazon Web Services
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 