# 🧪 Shot Form AI 결제 시스템 테스트 가이드

## 📋 테스트 환경 설정

### 1. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 토스페이먼츠 테스트 API 키
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_zXLkKEypNArWmo50nX3lmeaxYG5R
TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R

# 개발환경 리다이렉트 URL
NEXT_PUBLIC_SUCCESS_URL=http://localhost:3000/checkout/success
NEXT_PUBLIC_FAIL_URL=http://localhost:3000/checkout/fail

# 사업자 정보
NEXT_PUBLIC_BUSINESS_NAME=제이앤유통
NEXT_PUBLIC_BUSINESS_NUMBER=505-16-12345
NEXT_PUBLIC_CEO_NAME=신자동
NEXT_PUBLIC_BUSINESS_ADDRESS=서울특별시 강남구 테헤란로 123, 456호

# 고객센터
NEXT_PUBLIC_SUPPORT_EMAIL=support@shotformai.com
NEXT_PUBLIC_SUPPORT_PHONE=02-1234-5678

# 기존 환경 변수들 (Supabase, OpenAI 등)
# ... 기존 설정 유지 ...
```

### 2. Supabase 테이블 생성

1. Supabase 대시보드에 로그인
2. SQL Editor 열기
3. `supabase_payment_tables.sql` 파일의 내용을 복사
4. SQL Editor에 붙여넣기
5. 실행하여 테이블 생성

## 🔍 테스트 시나리오

### 시나리오 1: 프로 플랜 결제 테스트
1. **플랜 선택**
   - `/pricing` 페이지 방문
   - "프로 플랜 시작" 버튼 클릭

2. **결제 페이지 확인**
   - 플랜 정보: 프로 플랜, ₩29,000/월
   - 부가세 포함 총액: ₩31,900
   - 결제자 정보 입력 폼
   - 약관 동의 체크박스

3. **테스트 카드 정보**
   ```
   카드번호: 4242424242424242
   유효기간: 12/25
   CVC: 123
   비밀번호 앞 2자리: 00
   ```

4. **결제 완료 확인**
   - 성공 페이지로 리다이렉트
   - 결제 내역 표시
   - 사용자 플랜 업데이트 확인

### 시나리오 2: 프리미엄 플랜 결제 테스트
1. **플랜 선택**
   - `/pricing` 페이지에서 "프리미엄 시작" 클릭

2. **결제 진행**
   - 총 결제금액: ₩64,900 (부가세 포함)
   - 동일한 테스트 카드로 결제

3. **무제한 사용량 확인**
   - 대시보드에서 사용량 표시 확인

### 시나리오 3: 결제 실패 테스트
1. **실패 카드 정보**
   ```
   카드번호: 4000000000000002 (결제 거절 카드)
   유효기간: 12/25
   CVC: 123
   ```

2. **실패 처리 확인**
   - 실패 페이지로 리다이렉트
   - 오류 메시지 표시
   - 재시도 옵션 제공

## 🛠️ 테스트용 카드 번호

### 성공 테스트 카드
- **VISA**: 4242424242424242
- **마스터카드**: 5555555555554444
- **국내카드**: 4000000000000036

### 실패 테스트 카드
- **결제 거절**: 4000000000000002
- **잔액 부족**: 4000000000009995
- **분실 카드**: 4000000000009987

### 3D Secure 테스트
- **인증 성공**: 4000000000003220
- **인증 실패**: 4000000000003188

## 📊 테스트 확인 포인트

### 1. 프론트엔드 확인사항
- [ ] 요금제 페이지 올바른 가격 표시
- [ ] 결제 페이지 토스페이먼츠 위젯 로드
- [ ] 약관 동의 없이 결제 버튼 비활성화
- [ ] 성공/실패 페이지 정상 표시
- [ ] 모바일 반응형 디자인 작동

### 2. 백엔드 확인사항
- [ ] `/api/payments/confirm` 엔드포인트 정상 작동
- [ ] 토스페이먼츠 API 호출 성공
- [ ] 데이터베이스 결제 내역 저장
- [ ] 사용자 구독 정보 업데이트
- [ ] 에러 처리 및 로깅

### 3. 데이터베이스 확인사항
- [ ] `payments` 테이블에 결제 내역 저장
- [ ] `user_subscriptions` 테이블 플랜 업데이트
- [ ] `payment_logs` 테이블에 로그 기록
- [ ] RLS 정책 올바른 작동

## 🔧 디버깅 가이드

### 1. 결제 위젯 로드 실패
```javascript
// 브라우저 개발자 도구에서 확인
console.log('TossPayments available:', typeof window.TossPayments !== 'undefined');
console.log('Client Key:', process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);
```

### 2. API 호출 실패
```bash
# 결제 승인 API 테스트
curl -X POST http://localhost:3000/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "paymentKey": "test_payment_key",
    "orderId": "test_order_123",
    "amount": 29000
  }'
```

### 3. 데이터베이스 연결 확인
```sql
-- Supabase SQL Editor에서 실행
SELECT COUNT(*) FROM payments;
SELECT COUNT(*) FROM user_subscriptions;
```

## 🚨 주의사항

### 테스트 환경에서만 사용
- 현재 설정은 토스페이먼츠 **테스트 환경**입니다
- 실제 결제가 발생하지 않습니다
- 운영 환경으로 이전 시 API 키 교체 필요

### 테스트 데이터 정리
```sql
-- 테스트 완료 후 데이터 정리 (필요시)
DELETE FROM payment_logs WHERE created_at < NOW() - INTERVAL '1 day';
DELETE FROM payments WHERE status = 'PENDING' AND created_at < NOW() - INTERVAL '1 hour';
```

## 📈 성능 테스트

### 동시 결제 요청 테스트
```bash
# Apache Bench를 사용한 부하 테스트 (선택사항)
ab -n 100 -c 10 -T 'application/json' -p payment_data.json http://localhost:3000/api/payments/confirm
```

### 응답 시간 확인
- 결제 위젯 로드: < 2초
- 결제 승인 API: < 5초
- 페이지 리다이렉트: < 1초

## ✅ 테스트 완료 체크리스트

### 기본 기능 테스트
- [ ] 프로 플랜 결제 성공
- [ ] 프리미엄 플랜 결제 성공
- [ ] 결제 실패 처리
- [ ] 사용자 플랜 업데이트
- [ ] 대시보드 사용량 표시

### 예외 상황 테스트
- [ ] 네트워크 오류 처리
- [ ] 중복 결제 방지
- [ ] 세션 만료 처리
- [ ] 불정상 접근 차단

### 보안 테스트
- [ ] 시크릿 키 노출 방지
- [ ] SQL 인젝션 방지
- [ ] CSRF 토큰 검증
- [ ] RLS 정책 작동

## 🎯 다음 단계

테스트 완료 후:
1. **토스페이먼츠 계약 진행**
2. **운영 환경 API 키 발급**
3. **도메인 설정 및 HTTPS 적용**
4. **모니터링 시스템 구축**

---

**테스트 문의**: support@shotformai.com  
**긴급상황**: 02-1234-5678 