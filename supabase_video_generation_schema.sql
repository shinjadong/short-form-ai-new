-- Shot Form AI 비디오 생성 시스템 데이터베이스 스키마
-- 작성일: 2025년 01월 27일

-- ===== 1. 비디오 프로젝트 테이블 =====
-- 사용자가 생성하는 각 비디오 프로젝트 정보

CREATE TABLE IF NOT EXISTS video_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- 프로젝트 설정
    mode VARCHAR(20) CHECK (mode IN ('automatic', 'advanced', 'custom')) NOT NULL DEFAULT 'automatic',
    workflow VARCHAR(30) CHECK (workflow IN ('optimized', 'backend_integrated', 'hybrid', 'legacy')) NOT NULL DEFAULT 'hybrid',
    
    -- 입력 데이터 (JSON 형태로 저장)
    input_data JSONB NOT NULL DEFAULT '{}',
    settings JSONB NOT NULL DEFAULT '{}',
    
    -- 생성된 콘텐츠
    generated_script TEXT,
    generated_keywords TEXT[], -- PostgreSQL 배열 타입
    audio_file_url TEXT,
    subtitle_content TEXT,
    
    -- 소재 정보 (JSON 형태로 저장)
    materials JSONB DEFAULT '{}',
    
    -- 최종 결과
    final_video_url TEXT,
    thumbnail_url TEXT,
    video_duration INTEGER, -- 초 단위
    file_size BIGINT,       -- 바이트 단위
    
    -- 상태 및 메타데이터
    status VARCHAR(20) CHECK (status IN ('draft', 'processing', 'completed', 'failed')) NOT NULL DEFAULT 'draft',
    task_id TEXT,
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ,
    error_message TEXT,
    
    -- 품질 메트릭 (JSON)
    quality_metrics JSONB DEFAULT '{}',
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_video_projects_user_id ON video_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_video_projects_status ON video_projects(status);
CREATE INDEX IF NOT EXISTS idx_video_projects_created_at ON video_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_projects_task_id ON video_projects(task_id);

-- ===== 2. 사용자 사용량 추적 테이블 =====
-- 사용자별 비디오 생성 사용량 및 구독 정보

CREATE TABLE IF NOT EXISTS user_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- 사용량 추적
    videos_generated_today INTEGER DEFAULT 0 NOT NULL,
    videos_generated_month INTEGER DEFAULT 0 NOT NULL,
    videos_generated_total INTEGER DEFAULT 0 NOT NULL,
    
    -- 구독 정보
    subscription_plan VARCHAR(20) CHECK (subscription_plan IN ('free', 'pro', 'premium')) NOT NULL DEFAULT 'free',
    subscription_start TIMESTAMPTZ,
    subscription_end TIMESTAMPTZ,
    
    -- 제한 및 할당량
    daily_limit INTEGER DEFAULT 3 NOT NULL,
    monthly_limit INTEGER DEFAULT 10 NOT NULL,
    
    -- 사용 통계 (JSON)
    usage_stats JSONB DEFAULT '{}',
    
    -- 마지막 사용량 리셋 날짜
    last_daily_reset DATE DEFAULT CURRENT_DATE,
    last_monthly_reset DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE),
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_subscription_plan ON user_usage(subscription_plan);

-- ===== 3. 태스크 상태 추적 테이블 =====
-- 백엔드 처리 태스크의 실시간 상태 추적

CREATE TABLE IF NOT EXISTS task_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id TEXT NOT NULL UNIQUE,
    video_project_id UUID REFERENCES video_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- 태스크 상태
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'completed', 'failed')) NOT NULL DEFAULT 'pending',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_step TEXT,
    estimated_time_remaining INTEGER, -- 초 단위
    
    -- 결과 정보
    result JSONB DEFAULT '{}',
    error_details TEXT,
    
    -- 백엔드 정보
    backend_endpoint TEXT,
    processing_node TEXT,
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_task_status_task_id ON task_status(task_id);
CREATE INDEX IF NOT EXISTS idx_task_status_user_id ON task_status(user_id);
CREATE INDEX IF NOT EXISTS idx_task_status_status ON task_status(status);
CREATE INDEX IF NOT EXISTS idx_task_status_created_at ON task_status(created_at DESC);

-- ===== 4. 비디오 템플릿 테이블 =====
-- 사용자가 저장한 설정 템플릿

CREATE TABLE IF NOT EXISTS video_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- 템플릿 설정 (JSON)
    template_settings JSONB NOT NULL DEFAULT '{}',
    
    -- 템플릿 메타데이터
    category VARCHAR(50), -- 'comedy', 'education', 'news' 등
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_video_templates_user_id ON video_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_video_templates_category ON video_templates(category);
CREATE INDEX IF NOT EXISTS idx_video_templates_is_public ON video_templates(is_public);

-- ===== 5. 사용자 피드백 및 평가 테이블 =====
-- 생성된 비디오에 대한 사용자 피드백

CREATE TABLE IF NOT EXISTS video_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    video_project_id UUID REFERENCES video_projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- 평가 점수
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    script_quality INTEGER CHECK (script_quality >= 1 AND script_quality <= 5),
    voice_quality INTEGER CHECK (voice_quality >= 1 AND voice_quality <= 5),
    visual_sync INTEGER CHECK (visual_sync >= 1 AND visual_sync <= 5),
    
    -- 텍스트 피드백
    comments TEXT,
    suggested_improvements TEXT,
    
    -- 사용 의도 및 결과
    intended_use VARCHAR(100), -- 'youtube_shorts', 'instagram_reels', 'tiktok' 등
    actual_performance JSONB DEFAULT '{}', -- 실제 업로드 후 성과 데이터
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_video_feedback_video_project_id ON video_feedback(video_project_id);
CREATE INDEX IF NOT EXISTS idx_video_feedback_user_id ON video_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_video_feedback_overall_rating ON video_feedback(overall_rating);

-- ===== 6. 시스템 사용량 통계 테이블 =====
-- 전체 시스템의 사용량 및 성능 통계

CREATE TABLE IF NOT EXISTS system_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    
    -- 일일 사용량 통계
    total_videos_generated INTEGER DEFAULT 0,
    total_users_active INTEGER DEFAULT 0,
    total_processing_time INTEGER DEFAULT 0, -- 초 단위
    
    -- 워크플로우별 통계
    workflow_stats JSONB DEFAULT '{}',
    
    -- 성능 메트릭
    average_processing_time DECIMAL(10,2),
    success_rate DECIMAL(5,2),
    error_rate DECIMAL(5,2),
    
    -- 리소스 사용량
    cpu_usage_avg DECIMAL(5,2),
    memory_usage_avg DECIMAL(5,2),
    storage_used BIGINT, -- 바이트 단위
    
    -- 비용 정보
    api_costs JSONB DEFAULT '{}', -- 각 API별 비용
    total_cost DECIMAL(10,2),
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 인덱스 생성
CREATE UNIQUE INDEX IF NOT EXISTS idx_system_stats_date ON system_stats(date);
CREATE INDEX IF NOT EXISTS idx_system_stats_created_at ON system_stats(created_at DESC);

-- ===== 7. 트리거 함수들 =====

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_video_projects_updated_at BEFORE UPDATE ON video_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_usage_updated_at BEFORE UPDATE ON user_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_status_updated_at BEFORE UPDATE ON task_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_templates_updated_at BEFORE UPDATE ON video_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_feedback_updated_at BEFORE UPDATE ON video_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== 8. 사용량 리셋 함수 =====

-- 일일 사용량 리셋 함수
CREATE OR REPLACE FUNCTION reset_daily_usage()
RETURNS void AS $$
BEGIN
    UPDATE user_usage 
    SET videos_generated_today = 0,
        last_daily_reset = CURRENT_DATE
    WHERE last_daily_reset < CURRENT_DATE;
END;
$$ language 'plpgsql';

-- 월간 사용량 리셋 함수
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
    UPDATE user_usage 
    SET videos_generated_month = 0,
        last_monthly_reset = DATE_TRUNC('month', CURRENT_DATE)
    WHERE last_monthly_reset < DATE_TRUNC('month', CURRENT_DATE);
END;
$$ language 'plpgsql';

-- ===== 9. RLS (Row Level Security) 정책 =====

-- video_projects 테이블 RLS 활성화
ALTER TABLE video_projects ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로젝트만 볼 수 있음
CREATE POLICY "Users can view their own video projects" ON video_projects
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 프로젝트만 삽입할 수 있음
CREATE POLICY "Users can insert their own video projects" ON video_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 프로젝트만 업데이트할 수 있음
CREATE POLICY "Users can update their own video projects" ON video_projects
    FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 프로젝트만 삭제할 수 있음 (소프트 삭제)
CREATE POLICY "Users can delete their own video projects" ON video_projects
    FOR UPDATE USING (auth.uid() = user_id);

-- user_usage 테이블 RLS 활성화
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage" ON user_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON user_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- task_status 테이블 RLS 활성화
ALTER TABLE task_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks" ON task_status
    FOR SELECT USING (auth.uid() = user_id);

-- video_templates 테이블 RLS 활성화
ALTER TABLE video_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates" ON video_templates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public templates" ON video_templates
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own templates" ON video_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON video_templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" ON video_templates
    FOR DELETE USING (auth.uid() = user_id);

-- video_feedback 테이블 RLS 활성화
ALTER TABLE video_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback" ON video_feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" ON video_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" ON video_feedback
    FOR UPDATE USING (auth.uid() = user_id);

-- ===== 10. 초기 데이터 삽입 =====

-- 기본 사용자 사용량 레코드 생성 함수
CREATE OR REPLACE FUNCTION create_user_usage_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_usage (user_id, subscription_plan, daily_limit, monthly_limit)
    VALUES (NEW.id, 'free', 3, 10);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 새 사용자 가입 시 자동으로 사용량 레코드 생성
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_usage_on_signup();

-- ===== 11. 유용한 뷰 생성 =====

-- 사용자별 프로젝트 요약 뷰
CREATE OR REPLACE VIEW user_project_summary AS
SELECT 
    u.user_id,
    COUNT(*) as total_projects,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_projects,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_projects,
    AVG(video_duration) as avg_video_duration,
    MAX(created_at) as last_project_date
FROM video_projects vp
JOIN user_usage u ON vp.user_id = u.user_id
WHERE deleted_at IS NULL
GROUP BY u.user_id;

-- 일일 시스템 사용량 뷰
CREATE OR REPLACE VIEW daily_usage_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_videos,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_videos,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_videos,
    AVG(CASE WHEN processing_completed_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (processing_completed_at - processing_started_at)) END) as avg_processing_time
FROM video_projects
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ===== 스키마 완료 =====

-- 스키마 버전 정보
INSERT INTO system_stats (date, total_videos_generated) 
VALUES (CURRENT_DATE, 0) 
ON CONFLICT (date) DO NOTHING;

COMMENT ON TABLE video_projects IS 'Shot Form AI 비디오 생성 프로젝트 정보';
COMMENT ON TABLE user_usage IS '사용자별 사용량 및 구독 정보';
COMMENT ON TABLE task_status IS '백엔드 처리 태스크 상태 추적';
COMMENT ON TABLE video_templates IS '사용자 정의 비디오 템플릿';
COMMENT ON TABLE video_feedback IS '비디오 품질 피드백 및 평가';
COMMENT ON TABLE system_stats IS '시스템 전체 사용량 및 성능 통계'; 