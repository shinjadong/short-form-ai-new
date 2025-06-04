'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
          <p className="text-gray-600">최종 업데이트: 2024년 12월 25일</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제1조 (목적)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>이 약관은 제이앤유통(이하 "회사")이 제공하는 Shot Form AI 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제2조 (정의)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>"서비스"란 회사가 제공하는 AI 기반 쇼트폼 비디오 생성 서비스를 의미합니다.</li>
              <li>"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
              <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
              <li>"콘텐츠"란 회사가 서비스에서 제공하는 정보, 텍스트, 소프트웨어, 음악, 음향, 사진, 그래픽, 비디오, 메시지 기타 자료를 의미합니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제3조 (약관의 효력 및 변경)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>이 약관은 회사가 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력이 발생합니다.</li>
              <li>회원이 변경된 약관에 동의하지 않는 경우, 회원은 이용계약을 해지할 수 있습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제4조 (서비스의 제공 및 변경)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 다음과 같은 업무를 수행합니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>AI 기반 스크립트 생성 서비스</li>
                  <li>음성 합성 및 나레이션 서비스</li>
                  <li>자동 비디오 편집 및 생성 서비스</li>
                  <li>기타 회사가 정하는 업무</li>
                </ul>
              </li>
              <li>회사는 서비스를 일정범위로 분할하여 각 범위별로 이용가능시간을 별도로 지정할 수 있습니다. 다만, 이러한 경우에는 그 내용을 사전에 공지합니다.</li>
              <li>회사는 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 변경할 수 있습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제5조 (서비스의 중단)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
              <li>회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상하지 않습니다.</li>
              <li>사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 회사는 제8조에 정한 방법으로 이용자에게 통지합니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제6조 (회원가입)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
              <li>회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>가입신청자가 이 약관 제7조제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                  <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </li>
              <li>회원가입계약의 성립 시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제7조 (회원 탈퇴 및 자격 상실 등)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.</li>
              <li>회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                  <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                  <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제8조 (회원에 대한 통지)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사가 회원에 대한 통지를 하는 경우, 회원이 회사와 미리 약정하여 지정한 전자우편 주소로 할 수 있습니다.</li>
              <li>회사는 불특정다수 회원에 대한 통지의 경우 1주일이상 회사 게시판에 게시함으로써 개별 통지에 갈음할 수 있습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제9조 (개인정보보호)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.</li>
              <li>회사는 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.</li>
              <li>회사는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제10조 (요금 및 결제)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>서비스 이용요금은 회사의 정책에 따라 별도로 정하여 서비스 내에 표시합니다.</li>
              <li>회원은 회사가 제공하는 결제수단을 통해 서비스 이용요금을 결제할 수 있습니다.</li>
              <li>결제가 완료된 후에는 환불정책에 따라 처리됩니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제11조 (책임제한)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
              <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
              <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제12조 (분쟁해결)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.</li>
              <li>회사와 이용자 간에 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제13조 (준거법 및 관할법원)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>이 약관과 회사와 이용자 간의 거래에 대해서는 대한민국 법을 적용하며, 회사와 이용자 간에 발생하는 분쟁에 대해서는 회사의 본점 소재지를 관할하는 법원을 관할법원으로 합니다.</p>
          </CardContent>
        </Card>

        <div className="text-center pt-8 border-t">
          <p className="text-gray-600 mb-2">제이앤유통</p>
          <p className="text-gray-600 mb-2">사업자등록번호: 609-41-95762</p>
          <p className="text-gray-600 mb-2">대표: 신예준</p>
          <p className="text-gray-600">고객센터: tlswkehd@gmail.com</p>
        </div>
      </div>
    </div>
  )
} 