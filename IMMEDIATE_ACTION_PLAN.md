# 🚀 Shot Form AI 결제 시스템 런칭 액션 플랜

## ⚡ 즉시 실행 가능한 작업들 (오늘 완료 가능)

### 1️⃣ 환경 설정 (15분)
```bash
# 1. 환경 변수 파일 생성
cd short-form-ai-new
cp .env.example .env.local

# 2. 테스트 API 키 설정
# .env.local 파일에 다음 내용 추가:
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_zXLkKEypNArWmo50nX3lmeaxYG5R
TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R
NEXT_PUBLIC_SUCCESS_URL=http://localhost:3000/checkout/success
NEXT_PUBLIC_FAIL_URL=http://localhost:3000/checkout/fail
```

### 2️⃣ Supabase 테이블 생성 (10분)
1. **Supabase 대시보드 접속**: https://supabase.com/dashboard
2. **SQL Editor 열기**
3. **테이블 생성 스크립트 실행**: `supabase_payment_tables.sql` 내용 복사 → 실행
4. **테이블 생성 확인**: Tables 탭에서 payments, user_subscriptions 테이블 확인

### 3️⃣ 로컬 테스트 실행 (5분)
```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
# http://localhost:3000/pricing
# http://localhost:3000/checkout?plan=pro&price=29000
```

---

## 📧 토스페이먼츠 계약 진행 (오늘 발송 가능)

### 이메일 발송 준비
**수신자**: 토스페이먼츠 비즈니스 담당자  
**제목**: [제이앤유통] Shot Form AI 서비스 토스페이먼츠 계약 문의  
**첨부파일**:
- 사업 계획서: `BUSINESS_PROPOSAL_FOR_TOSS.md`
- 기술 문서: `PAYMENT_SETUP.md`
- 계약 신청서: `토스페이먼츠_계약_답변.md`

### 이메일 주소
- **일반 문의**: biz@tosspayments.com
- **파트너십 문의**: partner@tosspayments.com
- **기술 지원**: dev@tosspayments.com

---

## 🧪 결제 시스템 테스트 (30분)

### 테스트 시나리오 실행

#### 시나리오 1: 프로 플랜 결제 성공 테스트
1. **플랜 선택**
   ```
   URL: http://localhost:3000/pricing
   액션: "프로 플랜 시작" 버튼 클릭
   ```

2. **결제 정보 입력**
   ```
   이름: 홍길동
   연락처: 010-1234-5678
   카드번호: 4242424242424242
   유효기간: 12/25
   CVC: 123
   ```

3. **결제 완료 확인**
   - 성공 페이지로 리다이렉트
   - 결제 내역 표시
   - 대시보드에서 플랜 변경 확인

#### 시나리오 2: 결제 실패 테스트
```
카드번호: 4000000000000002 (결제 거절 카드)
→ 실패 페이지로 리다이렉트 확인
```

### 테스트 체크리스트
- [ ] 요금제 페이지 정상 표시
- [ ] 결제 페이지 토스페이먼츠 위젯 로드
- [ ] 약관 동의 체크박스 작동
- [ ] 테스트 카드로 결제 성공
- [ ] 결제 실패 시 적절한 오류 표시
- [ ] 성공/실패 페이지 정상 작동

---

## 📞 토스페이먼츠 연락 및 미팅 요청

### 전화 문의 (즉시 가능)
```
토스페이먼츠 고객센터: 1644-8051
문의 내용:
"안녕하세요, 제이앤유통에서 Shot Form AI 서비스를 운영 중이며, 
SaaS 구독 서비스를 위한 정기결제 시스템 도입을 검토하고 있습니다. 
담당자와 상담 일정을 잡고 싶습니다."
```

### 온라인 상담 신청
1. **토스페이먼츠 홈페이지**: https://www.tosspayments.com/
2. **상담 신청하기** 클릭
3. **회사 정보 입력**:
   - 회사명: 제이앤유통
   - 담당자: 신자동
   - 연락처: 02-1234-5678
   - 이메일: business@shotformai.com
   - 서비스 유형: SaaS/구독 서비스

---

## 🔧 운영 환경 준비작업 (이번 주 완료 목표)

### 도메인 및 SSL 설정
```bash
# Vercel에서 커스텀 도메인 설정
# 1. shotformai.com 도메인 구매 (가비아, 후이즈 등)
# 2. Vercel에 도메인 연결
# 3. SSL 인증서 자동 발급 확인
```

### 환경 변수 운영 설정
```bash
# Vercel 환경 변수 설정
# 1. Vercel 대시보드 접속
# 2. Settings > Environment Variables
# 3. 운영용 토스페이먼츠 API 키 설정 (계약 완료 후)
```

### 모니터링 설정
```bash
# Sentry 오류 모니터링 설정
npm install @sentry/nextjs
# 설정 파일 생성 및 운영 환경 모니터링 활성화
```

---

## 📊 성과 측정 및 분석 준비

### Google Analytics 설정
```bash
# 1. Google Analytics 계정 생성
# 2. GA4 추적 코드 설치
# 3. 전자상거래 추적 설정
# 4. 구독/결제 이벤트 추적 설정
```

### 고객 지원 시스템 준비
- **고객센터 이메일**: support@shotformai.com 설정
- **FAQ 페이지**: 결제 관련 자주 묻는 질문 작성
- **채팅 상담**: 인터콤, 채널톡 등 도입 검토

---

## 🎯 1주차 목표 (12월 25일 ~ 1월 1일)

### Day 1-2: 즉시 실행
- [x] 결제 시스템 구현 완료
- [ ] 토스페이먼츠 계약 신청 이메일 발송
- [ ] 로컬 환경 테스트 완료

### Day 3-4: 토스페이먼츠 응답 대기
- [ ] 토스페이먼츠 담당자 연락 대기
- [ ] 추가 서류 준비 (필요시)
- [ ] 미팅 일정 조율

### Day 5-7: 계약 진행
- [ ] 토스페이먼츠 미팅 참석
- [ ] 계약 조건 협의
- [ ] 실제 API 키 발급 신청

---

## 🚨 우선순위별 할일 목록

### 🔥 최우선 (오늘 완료)
1. **환경 변수 설정**: `.env.local` 파일 생성
2. **Supabase 테이블 생성**: 결제 관련 테이블 생성
3. **로컬 테스트**: 기본 결제 플로우 테스트
4. **토스페이먼츠 연락**: 이메일 발송 또는 전화 문의

### ⚡ 높은 우선순위 (이번 주)
1. **토스페이먼츠 미팅**: 담당자와 상담 진행
2. **계약 체결**: 정식 가맹점 계약
3. **API 키 발급**: 운영용 실제 키 발급
4. **도메인 설정**: 커스텀 도메인 및 SSL

### 📋 중간 우선순위 (다음 주)
1. **베타 테스트**: 제한된 사용자 대상 테스트
2. **모니터링 설정**: 오류 추적 및 성능 모니터링
3. **고객 지원**: FAQ 및 지원 체계 구축
4. **마케팅 준비**: 런칭 캠페인 기획

---

## 📱 즉시 연락할 곳

### 토스페이먼츠
- **전화**: 1644-8051
- **이메일**: biz@tosspayments.com
- **웹사이트**: https://www.tosspayments.com/

### 기술 지원
- **개발자 문서**: https://docs.tosspayments.com/
- **GitHub**: https://github.com/tosspayments
- **개발자 커뮤니티**: https://developers.tosspayments.com/

---

## ✅ 오늘의 체크리스트

### 필수 완료 항목
- [ ] `.env.local` 파일 설정 완료
- [ ] Supabase 테이블 생성 완료
- [ ] 로컬 테스트 최소 1회 성공
- [ ] 토스페이먼츠에 연락 (이메일 또는 전화)

### 추가 완료 항목 (시간이 있다면)
- [ ] 모든 테스트 시나리오 완료
- [ ] 계약 서류 최종 검토
- [ ] 도메인 구매 및 설정 시작
- [ ] 팀 내 결제 시스템 시연

---

**🎉 모든 준비가 완료되었습니다!**  
**이제 토스페이먼츠와 계약을 진행하여 실제 서비스를 런칭할 시간입니다!**

---

**문의**: support@shotformai.com  
**긴급**: 02-1234-5678  
**대표**: 신자동 