'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">환불 정책</h1>
          <p className="text-gray-600">최종 업데이트: 2024년 12월 25일</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>환불 정책 개요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>제이앤유통(이하 "회사")은 고객 만족을 최우선으로 하며, 공정하고 투명한 환불 정책을 운영하고 있습니다. 본 정책은 Shot Form AI 서비스의 유료 플랜 결제에 대한 환불 조건과 절차를 안내합니다.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제1조 (환불 가능 조건)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-lg mb-3">1. 서비스 이용 전 환불 (100% 환불)</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>결제 후 서비스를 전혀 이용하지 않은 경우</li>
              <li>결제일로부터 7일 이내 신청</li>
              <li>영상 생성 기능을 1회도 사용하지 않은 경우</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">2. 부분 이용 후 환불 (부분 환불)</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>결제일로부터 7일 이내 신청</li>
              <li>월 이용한도의 30% 미만 사용한 경우</li>
              <li>환불금액 = 결제금액 - (사용한 영상 생성 횟수 × 건당 단가)</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">3. 서비스 장애로 인한 환불 (100% 환불)</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>회사의 기술적 문제로 서비스 이용이 불가능한 경우</li>
              <li>24시간 이상 연속으로 서비스가 중단된 경우</li>
              <li>약속된 서비스 품질이 현저히 미달하는 경우</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제2조 (환불 불가 조건)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-3">
              <li>결제일로부터 7일이 경과한 경우</li>
              <li>월 이용한도의 30% 이상 사용한 경우</li>
              <li>고객의 귀책사유로 인한 서비스 이용 불가한 경우</li>
              <li>디지털 콘텐츠(생성된 영상 파일)를 다운로드한 경우</li>
              <li>무료 체험 기간 중 서비스를 이용한 경우</li>
              <li>약관 위반으로 인한 서비스 이용 제한 시</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제3조 (환불 신청 절차)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li><strong>환불 신청서 작성</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>고객센터 이메일로 환불 신청서 발송</li>
                  <li>신청자 정보, 결제 정보, 환불 사유 명시</li>
                  <li>필요시 첨부서류 제출</li>
                </ul>
              </li>
              <li><strong>환불 검토</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>신청일로부터 영업일 기준 3일 이내 검토</li>
                  <li>서비스 이용 내역 확인</li>
                  <li>환불 조건 충족 여부 판단</li>
                </ul>
              </li>
              <li><strong>환불 처리</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>승인 시 영업일 기준 5~7일 이내 환불 처리</li>
                  <li>결제수단에 따라 환불 방법 결정</li>
                  <li>환불 완료 시 이메일 안내</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제4조 (환불 방법 및 소요시간)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">신용카드 결제</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>카드사 승인취소</li>
                  <li>영업일 기준 3~5일</li>
                  <li>다음 카드대금 청구 시 차감</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">계좌이체</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>고객 계좌로 직접 입금</li>
                  <li>영업일 기준 3~5일</li>
                  <li>환불 수수료 없음</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">간편결제</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>해당 간편결제 계좌로 환불</li>
                  <li>영업일 기준 1~3일</li>
                  <li>결제사 정책에 따름</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">휴대폰 결제</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>통신료에서 차감</li>
                  <li>영업일 기준 3~7일</li>
                  <li>통신사별 차이 있음</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제5조 (부분 환불 계산 방법)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">환불 금액 계산식</h3>
              <div className="space-y-2">
                <p><strong>프로 플랜 (월 29,000원, 50개 영상)</strong></p>
                <p className="text-sm">환불금액 = 29,000원 - (사용한 영상 수 × 580원)</p>
                
                <p className="mt-4"><strong>프리미엄 플랜 (월 59,000원, 무제한)</strong></p>
                <p className="text-sm">30개 이하 사용 시: 29,000원 환불</p>
                <p className="text-sm">30개 초과 사용 시: 환불 불가</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">예시</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>프로 플랜에서 10개 영상 생성 후 환불 신청: 29,000원 - (10 × 580원) = 23,200원 환불</li>
                <li>프로 플랜에서 20개 영상 생성 후 환불 신청: 29,000원 - (20 × 580원) = 17,400원 환불</li>
                <li>프로 플랜에서 15개 초과 사용 시 (30% 초과): 환불 불가</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제6조 (환불 수수료)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-3">
              <li><strong>회사 귀책사유 환불:</strong> 환불 수수료 없음</li>
              <li><strong>고객 사정에 의한 환불:</strong> 결제수단별 취소 수수료 고객 부담</li>
              <li><strong>신용카드:</strong> 수수료 없음 (카드사 정책에 따름)</li>
              <li><strong>계좌이체:</strong> 환불 수수료 없음</li>
              <li><strong>기타 결제수단:</strong> 해당 결제업체 정책에 따름</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제7조 (환불 신청 양식)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>환불 신청 시 다음 정보를 포함하여 주세요:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>신청자 이름 및 연락처</li>
              <li>회원 가입 이메일 주소</li>
              <li>결제일자 및 결제금액</li>
              <li>주문번호 (있는 경우)</li>
              <li>환불 사유</li>
              <li>환불 받을 계좌 정보 (계좌이체 환불 시)</li>
            </ul>
          </CardContent>
        </Card>

        {/* 고객센터 연락처 */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              환불 문의 및 신청
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">이메일 문의</h3>
                <p className="text-sm text-gray-600 mb-3">가장 빠른 응답을 받으실 수 있습니다</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:refund@shotformai.com">
                    refund@shotformai.com
                  </a>
                </Button>
              </div>
              
              <div className="text-center">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">전화 문의</h3>
                <p className="text-sm text-gray-600 mb-3">평일 09:00 - 18:00</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:02-1234-5678">
                    02-1234-5678
                  </a>
                </Button>
              </div>
              
              <div className="text-center">
                <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">채팅 상담</h3>
                <p className="text-sm text-gray-600 mb-3">실시간 상담 (평일 09:00 - 18:00)</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/support">
                    채팅 시작하기
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제8조 (분쟁 조정)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>환불 관련 분쟁이 발생한 경우, 우선 회사의 고객센터를 통해 협의 해결을 시도합니다.</li>
              <li>협의가 이루어지지 않을 경우, 다음 기관에 분쟁 조정을 신청할 수 있습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>소비자분쟁조정위원회 (www.ccn.go.kr)</li>
                  <li>공정거래위원회 (www.ftc.go.kr)</li>
                  <li>개인정보보호위원회 (www.pipc.go.kr)</li>
                </ul>
              </li>
              <li>최종적으로는 관할 법원을 통한 법적 절차를 진행할 수 있습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <div className="text-center pt-8 border-t">
          <p className="text-gray-600 mb-2">제이앤유통</p>
          <p className="text-gray-600 mb-2">사업자등록번호: 609-41-95762</p>
          <p className="text-gray-600 mb-2">대표: 신예준</p>
          <p className="text-gray-600 mb-2">주소: 경상남도 창원시 의창구 사화로 80번길 20, 201호(팔용동)</p>
          <p className="text-gray-600">환불 담당: refund@shotformai.com</p>
        </div>
      </div>
    </div>
  )
} 