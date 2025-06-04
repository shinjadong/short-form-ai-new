'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
          <p className="text-gray-600">최종 업데이트: 2024년 12월 25일</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제1조 (개인정보의 처리목적)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>제이앤유통(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ol className="list-decimal list-inside space-y-3">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적</li>
              <li>서비스 제공: AI 기반 영상 생성 서비스 제공, 콘텐츠 제공, 맞춤형 서비스 제공, 본인인증</li>
              <li>대금결제: 유료 서비스 이용 시 대금 결제 및 정산</li>
              <li>고객 상담: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
              <li>마케팅 및 광고: 이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제2조 (개인정보의 처리 및 보유기간)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
              <li>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>회원 가입 및 관리: 서비스 이용계약 해지일로부터 5년</li>
                  <li>대금결제: 대금결제 및 재화 등의 공급에 관한 기록 5년</li>
                  <li>소비자 불만 또는 분쟁처리: 소비자의 불만 또는 분쟁처리에 관한 기록 3년</li>
                  <li>웹사이트 방문기록: 3개월</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제3조 (처리하는 개인정보의 항목)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
            <ol className="list-decimal list-inside space-y-3">
              <li>회원가입 및 서비스 이용
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>필수항목: 이메일 주소, 비밀번호, 이름</li>
                  <li>선택항목: 전화번호, 생년월일</li>
                  <li>자동생성정보: IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량 이용기록</li>
                </ul>
              </li>
              <li>결제 관련
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>신용카드 결제: 카드번호, 유효기간, 비밀번호 앞 2자리</li>
                  <li>계좌이체: 은행명, 계좌번호</li>
                  <li>휴대폰 결제: 휴대폰번호, 통신사, 결제승인번호</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제4조 (개인정보의 제3자 제공)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</li>
              <li>회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>결제 서비스: 토스페이먼츠 (결제 처리 목적, 거래 완료 시까지 보유)</li>
                  <li>AI 음성 합성: TypeCast (음성 생성 목적, 서비스 완료 즉시 삭제)</li>
                  <li>클라우드 서비스: Amazon Web Services (서비스 제공 목적, 계약 해지 시까지 보유)</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제5조 (개인정보처리의 위탁)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</li>
              <li>위탁업체 및 위탁업무 내용:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>Amazon Web Services Korea LLC: 클라우드 컴퓨팅 서비스 제공</li>
                  <li>Supabase Inc.: 데이터베이스 및 인증 서비스 제공</li>
                  <li>토스페이먼츠: 결제 처리 및 정산 서비스</li>
                </ul>
              </li>
              <li>회사는 위탁계약 체결시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제6조 (정보주체의 권리·의무 및 행사방법)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>개인정보 처리현황 통지요구</li>
                  <li>개인정보 열람요구</li>
                  <li>오류 등이 있을 경우 정정·삭제요구</li>
                  <li>처리정지요구</li>
                </ul>
              </li>
              <li>제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</li>
              <li>정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제7조 (개인정보의 파기)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</li>
              <li>개인정보 파기의 절차 및 방법은 다음과 같습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>파기절차: 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
                  <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제8조 (개인정보의 안전성 확보조치)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
            <ol className="list-decimal list-inside space-y-3">
              <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
              <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제9조 (개인정보 보호책임자)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</li>
              <li>개인정보 보호책임자
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>성명: 신예준</li>
                  <li>직책: 대표이사</li>
                  <li>연락처: tlswkehd@gmail.com, 01083087385</li>
                </ul>
              </li>
              <li>정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제10조 (권익침해 구제방법)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>정보주체는 아래의 기관에 대해 개인정보 침해에 대한 신고나 상담을 하실 수 있습니다:</p>
            <ol className="list-decimal list-inside space-y-3">
              <li>개인정보 침해신고센터 (privacy.go.kr / 전화: 국번없이 182)</li>
              <li>대검찰청 사이버범죄수사단 (www.spo.go.kr / 전화: 02-3480-3573)</li>
              <li>경찰청 사이버테러대응센터 (www.netan.go.kr / 전화: 국번없이 182)</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제11조 (개인정보 처리방침 변경)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</li>
              <li>이 개인정보처리방침은 2024년 12월 25일부터 적용됩니다.</li>
            </ol>
          </CardContent>
        </Card>

        <div className="text-center pt-8 border-t">
          <p className="text-gray-600 mb-2">제이앤유통</p>
          <p className="text-gray-600 mb-2">사업자등록번호: 609-41-95762</p>
          <p className="text-gray-600 mb-2">대표: 신예준</p>
          <p className="text-gray-600 mb-2">주소: 경상남도 창원시 의창구 사화로 80번길 20, 201호(팔용동)</p>
          <p className="text-gray-600">개인정보보호 담당: tlswkehd@gmail.com</p>
        </div>
      </div>
    </div>
  )
} 