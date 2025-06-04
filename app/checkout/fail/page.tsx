'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

function FailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const errorCode = searchParams.get('code') || 'UNKNOWN_ERROR'
  const errorMessage = searchParams.get('message') || '알 수 없는 오류가 발생했습니다.'
  const orderId = searchParams.get('orderId') || ''

  // 에러 코드에 따른 사용자 친화적 메시지
  const getErrorDetails = (code: string) => {
    const errorDetails: Record<string, { title: string; description: string; action: string }> = {
      'PAY_PROCESS_CANCELED': {
        title: '결제가 취소되었습니다',
        description: '결제 진행 중 취소하셨습니다. 필요하시면 다시 시도해 주세요.',
        action: '다시 결제하기'
      },
      'PAY_PROCESS_ABORTED': {
        title: '결제가 실패했습니다',
        description: '결제 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        action: '다시 시도하기'
      },
      'REJECT_CARD_COMPANY': {
        title: '카드사에서 결제를 거절했습니다',
        description: '카드 정보를 확인하시고 다시 시도해 주세요. 문제가 계속되면 카드사에 문의해 주세요.',
        action: '다른 카드로 시도'
      },
      'EXCEED_MAX_AMOUNT': {
        title: '결제 한도를 초과했습니다',
        description: '카드 결제 한도를 초과했습니다. 다른 결제 수단을 이용해 주세요.',
        action: '다른 결제수단 사용'
      },
      'INVALID_CARD_NUMBER': {
        title: '유효하지 않은 카드 번호입니다',
        description: '카드 번호를 다시 확인해 주세요.',
        action: '카드 정보 확인'
      },
      'INVALID_CARD_EXPIRATION': {
        title: '만료된 카드입니다',
        description: '카드 유효기간을 확인해 주세요.',
        action: '다른 카드 사용'
      },
      'NOT_SUPPORTED_CARD': {
        title: '지원하지 않는 카드입니다',
        description: '해당 카드는 결제가 불가능합니다. 다른 카드를 이용해 주세요.',
        action: '다른 카드 사용'
      },
      'DUPLICATED_ORDER_ID': {
        title: '중복된 주문입니다',
        description: '이미 처리된 주문입니다. 새로운 주문을 생성해 주세요.',
        action: '새로 주문하기'
      },
      'PAYMENT_CONFIRM_ERROR': {
        title: '결제 승인에 실패했습니다',
        description: '결제 승인 과정에서 오류가 발생했습니다. 고객센터로 문의해 주세요.',
        action: '고객센터 문의'
      },
      'INVALID_REQUEST': {
        title: '잘못된 요청입니다',
        description: '요청 정보가 올바르지 않습니다. 처음부터 다시 시도해 주세요.',
        action: '처음부터 다시'
      },
      'UNAUTHORIZED_KEY': {
        title: '인증에 실패했습니다',
        description: '시스템 오류가 발생했습니다. 고객센터로 문의해 주세요.',
        action: '고객센터 문의'
      },
      'UNKNOWN_ERROR': {
        title: '일시적인 오류가 발생했습니다',
        description: '죄송합니다. 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        action: '다시 시도하기'
      }
    }

    return errorDetails[code] || errorDetails['UNKNOWN_ERROR']
  }

  const errorDetails = getErrorDetails(errorCode)

  const handleRetry = () => {
    // 이전 페이지로 돌아가기 또는 결제 페이지로 이동
    router.back()
  }

  const handleSupport = () => {
    window.location.href = 'mailto:support@shotform.ai?subject=결제 오류 문의&body=오류 코드: ' + errorCode + '%0D%0A오류 메시지: ' + errorMessage + '%0D%0A주문번호: ' + orderId
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {errorDetails.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 text-center">
              {errorDetails.description}
            </p>

            {/* 오류 상세 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">오류 코드</span>
                <span className="text-sm font-mono text-gray-700">{errorCode}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500">오류 메시지</span>
                <span className="text-sm text-gray-700 text-right ml-4">{errorMessage}</span>
              </div>
              {orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">주문번호</span>
                  <span className="text-sm font-mono text-gray-700">{orderId}</span>
                </div>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              {errorCode === 'PAYMENT_CONFIRM_ERROR' || errorCode === 'UNAUTHORIZED_KEY' ? (
                <Button 
                  onClick={handleSupport}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  고객센터 문의하기
                </Button>
              ) : (
                <Button 
                  onClick={handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {errorDetails.action}
                </Button>
              )}
              
              <Button 
                onClick={() => router.push('/pricing')}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                요금제 다시 선택
              </Button>

              <Link href="/" className="block">
                <Button 
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-900"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>

            {/* 도움말 */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                계속해서 문제가 발생하시나요?
              </p>
              <button
                onClick={handleSupport}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
              >
                support@shotform.ai로 문의하기
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 추가 정보 */}
        <div className="mt-8 text-center">
          <h3 className="text-sm font-medium text-gray-900 mb-2">자주 묻는 질문</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Q. 카드 결제가 계속 실패해요.</strong><br />
              A. 카드사에서 해외 결제를 차단했을 수 있습니다. 카드사에 문의해 주세요.
            </p>
            <p>
              <strong>Q. 다른 결제 수단을 사용할 수 있나요?</strong><br />
              A. 현재 신용/체크카드, 계좌이체, 가상계좌 결제를 지원합니다.
            </p>
            <p>
              <strong>Q. 결제 후 서비스를 바로 이용할 수 있나요?</strong><br />
              A. 네, 결제 완료 즉시 서비스를 이용하실 수 있습니다.
            </p>
          </div>
        </div>

        {/* 판매자 정보 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>판매자: 제이앤유통 (대표: 신예준) | 사업자등록번호: 609-41-95762</p>
          <p className="mt-1">서비스 문의: support@shotform.ai | 환불 정책: 이용약관 참조</p>
        </div>
      </div>
    </div>
  )
}

export default function FailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">로딩 중...</div>}>
      <FailContent />
    </Suspense>
  )
}
