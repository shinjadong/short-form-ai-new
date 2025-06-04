-- ============================================
-- Shot Form AI 결제 시스템 테이블 생성 스크립트
-- 실행 순서: Supabase SQL Editor에서 순서대로 실행
-- ============================================

-- 1. payments 테이블 생성 (결제 내역)
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_key TEXT NOT NULL UNIQUE, -- 토스페이먼츠 paymentKey
  order_id TEXT NOT NULL UNIQUE,    -- 주문번호
  amount INTEGER NOT NULL,          -- 결제금액 (원)
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, CANCELLED
  payment_method TEXT,              -- 결제수단 (카드, 계좌이체 등)
  card_info JSONB,                  -- 카드 정보 (마지막 4자리, 카드사 등)
  approved_at TIMESTAMP,            -- 승인일시
  plan_type TEXT NOT NULL,          -- 'pro', 'premium'
  plan_name TEXT NOT NULL,          -- '프로 플랜', '프리미엄 플랜'
  metadata JSONB,                   -- 추가 메타데이터
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. user_subscriptions 테이블 생성 (사용자 구독 정보)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER DEFAULT 3,
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  auto_renewal BOOLEAN DEFAULT false,
  last_payment_id UUID REFERENCES payments(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. payment_logs 테이블 생성 (결제 로그)
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'PAYMENT_ATTEMPT', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'REFUND'
  status TEXT NOT NULL,
  message TEXT,
  raw_data JSONB, -- 토스페이먼츠 응답 원본
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. refunds 테이블 생성 (환불 내역)
CREATE TABLE IF NOT EXISTS refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  refund_amount INTEGER NOT NULL,
  refund_reason TEXT,
  usage_count_at_refund INTEGER DEFAULT 0,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================

-- payments 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_key ON payments(payment_key);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- user_subscriptions 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier ON user_subscriptions(subscription_tier);

-- payment_logs 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_payment_logs_payment_id ON payment_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_user_id ON payment_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON payment_logs(created_at DESC);

-- refunds 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_user_id ON refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- ============================================
-- RLS (Row Level Security) 정책 설정
-- ============================================

-- payments 테이블 RLS 활성화
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 결제 내역만 조회 가능
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- user_subscriptions 테이블 RLS 활성화
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 구독 정보만 조회 가능
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 구독 정보를 업데이트 가능
CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- payment_logs 테이블 RLS 활성화
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 결제 로그만 조회 가능
CREATE POLICY "Users can view own payment logs" ON payment_logs
  FOR SELECT USING (auth.uid() = user_id);

-- refunds 테이블 RLS 활성화
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 환불 내역만 조회 가능
CREATE POLICY "Users can view own refunds" ON refunds
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 트리거 함수 생성 (자동 업데이트)
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- payments 테이블 updated_at 트리거
CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- user_subscriptions 테이블 updated_at 트리거
CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 초기 데이터 삽입 (기존 사용자 구독 정보)
-- ============================================

-- 기존 사용자들에 대한 기본 구독 정보 생성
INSERT INTO user_subscriptions (user_id, subscription_tier, usage_count, usage_limit)
SELECT 
  id as user_id,
  COALESCE(raw_user_meta_data->>'subscription_tier', 'free')::TEXT as subscription_tier,
  COALESCE((raw_user_meta_data->>'usage_count')::INTEGER, 0) as usage_count,
  CASE 
    WHEN COALESCE(raw_user_meta_data->>'subscription_tier', 'free') = 'pro' THEN 50
    WHEN COALESCE(raw_user_meta_data->>'subscription_tier', 'free') = 'premium' THEN 999999
    ELSE 3
  END as usage_limit
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM user_subscriptions WHERE user_subscriptions.user_id = auth.users.id
);

-- ============================================
-- 유용한 뷰 생성
-- ============================================

-- 사용자별 구독 현황 뷰
CREATE OR REPLACE VIEW user_subscription_status AS
SELECT 
  u.id as user_id,
  u.email,
  s.subscription_tier,
  s.usage_count,
  s.usage_limit,
  s.subscription_start_date,
  s.subscription_end_date,
  s.auto_renewal,
  CASE 
    WHEN s.usage_count >= s.usage_limit THEN true 
    ELSE false 
  END as usage_limit_reached,
  ROUND((s.usage_count::DECIMAL / s.usage_limit::DECIMAL) * 100, 2) as usage_percentage
FROM auth.users u
LEFT JOIN user_subscriptions s ON u.id = s.user_id;

-- 월별 결제 통계 뷰
CREATE OR REPLACE VIEW monthly_payment_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as payment_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount,
  plan_type,
  status
FROM payments
GROUP BY DATE_TRUNC('month', created_at), plan_type, status
ORDER BY month DESC;

-- ============================================
-- 실행 완료 메시지
-- ============================================

-- 완료 확인 쿼리
SELECT 
  'payments' as table_name, COUNT(*) as row_count 
FROM payments
UNION ALL
SELECT 
  'user_subscriptions' as table_name, COUNT(*) as row_count 
FROM user_subscriptions
UNION ALL
SELECT 
  'payment_logs' as table_name, COUNT(*) as row_count 
FROM payment_logs
UNION ALL
SELECT 
  'refunds' as table_name, COUNT(*) as row_count 
FROM refunds; 