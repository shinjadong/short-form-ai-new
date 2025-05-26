# Fast-Gen Components

이 폴더는 기존의 거대한 `step-by-step-workflow.tsx` 컴포넌트를 재사용 가능한 작은 컴포넌트들로 분리한 결과입니다.

## 📁 폴더 구조

```
components/fast-gen/
├── types.ts                              # 타입 정의
├── index.ts                              # 모든 컴포넌트 export
├── refactored-step-by-step-workflow.tsx  # 메인 워크플로우 컴포넌트
├── progress-header.tsx                   # 진행률 표시 헤더
├── step-navigation.tsx                   # 단계 네비게이션
├── step-content.tsx                      # 단계별 콘텐츠 렌더링
├── navigation-buttons.tsx                # 이전/다음 버튼
├── error-alert.tsx                       # 에러 메시지 표시
├── script-generation-step.tsx            # 1단계: 스크립트 생성
├── video-settings-step.tsx               # 2단계: 비디오 설정
├── audio-settings-step.tsx               # 3단계: 오디오 설정
├── subtitle-settings-step.tsx            # 4단계: 자막 설정
├── video-generation-step.tsx             # 5단계: 비디오 생성
├── typecast-voice-settings.tsx           # TypeCast AI 음성 설정
└── README.md                             # 이 파일
```

## 🚀 사용법

### 기본 사용법

```tsx
import { RefactoredStepByStepWorkflow } from '@/components/fast-gen'

export default function MyPage() {
  return <RefactoredStepByStepWorkflow />
}
```

### 개별 컴포넌트 사용법

```tsx
import { 
  ProgressHeader, 
  StepNavigation, 
  ScriptGenerationStep 
} from '@/components/fast-gen'

export default function CustomWorkflow() {
  return (
    <div>
      <ProgressHeader completedSteps={[1, 2]} totalSteps={5} />
      <StepNavigation 
        steps={steps} 
        currentStep={1} 
        completedSteps={[]} 
        onStepClick={handleStepClick} 
      />
      <ScriptGenerationStep 
        stepData={stepData}
        onStepDataChange={handleStepDataChange}
        isGenerating={false}
        onGenerateScript={handleGenerateScript}
      />
    </div>
  )
}
```

## 🧩 컴포넌트 설명

### 1. **RefactoredStepByStepWorkflow**
- 메인 워크플로우 컴포넌트
- 모든 하위 컴포넌트를 조합하여 완전한 기능 제공
- 기존 `step-by-step-workflow.tsx`와 동일한 기능

### 2. **ProgressHeader**
- 전체 진행률을 시각적으로 표시
- 완료된 단계 수와 전체 단계 수를 표시

### 3. **StepNavigation**
- 단계별 네비게이션 버튼들
- 현재 단계, 완료된 단계, 대기 중인 단계를 구분하여 표시

### 4. **StepContent**
- 현재 단계에 맞는 콘텐츠를 렌더링
- 각 단계별 컴포넌트를 조건부로 렌더링

### 5. **단계별 컴포넌트들**
- **ScriptGenerationStep**: AI 스크립트 생성
- **VideoSettingsStep**: 비디오 소스 및 설정
- **AudioSettingsStep**: 음성 및 배경음악 설정
- **SubtitleSettingsStep**: 자막 스타일 설정
- **VideoGenerationStep**: 최종 비디오 생성

### 6. **TypecastVoiceSettings**
- TypeCast AI 음성 생성 전용 컴포넌트
- 액터 선택, 음성 미리보기 기능

## 🔧 타입 정의

모든 타입은 `types.ts`에 정의되어 있습니다:

- `StepData`: 전체 워크플로우 데이터
- `Step`: 단계 정보
- `TypecastActor`: TypeCast 액터 정보
- `StepStatus`: 단계 상태 ('completed' | 'current' | 'pending')

## ✨ 장점

1. **재사용성**: 각 컴포넌트를 독립적으로 사용 가능
2. **유지보수성**: 작은 단위로 분리되어 수정이 용이
3. **테스트 용이성**: 개별 컴포넌트 단위로 테스트 가능
4. **가독성**: 각 컴포넌트의 역할이 명확
5. **확장성**: 새로운 단계나 기능 추가가 쉬움

## 🔄 마이그레이션

기존 코드에서 새로운 컴포넌트로 마이그레이션:

```tsx
// 기존
import StepByStepWorkflow from '@/components/shotformai/step-by-step-workflow'

// 새로운 방식
import { RefactoredStepByStepWorkflow } from '@/components/fast-gen'
```

## 🎯 향후 개선 사항

1. **상태 관리 최적화**: Zustand나 Context API 도입
2. **성능 최적화**: React.memo, useMemo 적용
3. **애니메이션 추가**: Framer Motion으로 단계 전환 효과
4. **접근성 개선**: ARIA 속성 추가
5. **국제화**: i18n 지원 추가 