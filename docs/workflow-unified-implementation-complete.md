# 워크플로우 통합 화면 구현 완료

## 구현 개요

사용자의 최종 요구사항을 반영하여 워크플로우 등록 및 단계 구성을 하나의 통합 화면으로 구현했습니다.

## 구현된 주요 기능

### 1. 통합 워크플로우 페이지 (`workflowCreateUnified`)

**위치**: `admin/admin_views.js` (Lines 2688-2812)

**주요 특징**:
- 워크플로우 기본 정보 입력 (이름, 학위 과정)
- 2열 레이아웃: 왼쪽 단계 유형 목록, 오른쪽 구성된 단계 목록
- [+ 새 단계 유형 추가] 버튼으로 단계 유형 빠른 등록
- 단계 없이는 저장 불가능 (최소 1개 필수)
- 신규 등록 및 수정 모드 모두 지원

### 2. 단계 추가 모달 (`openAddStageModal`)

**위치**: `admin/admin_modals.js` (Lines 5496-5582)

**주요 특징**:
- **커스텀 단계 이름 입력**: 단계 유형 이름을 기본값으로 제공하되, 사용자가 자유롭게 수정 가능
  - 예: "본심사" 단계 유형을 선택하면 "1차 본심사", "최종 본심사" 등으로 이름 변경 가능
- **평가표 매핑**: 심사 단계인 경우 평가표 선택 필수
  - 라디오 버튼으로 3개 평가표 중 선택
  - 단계 유형의 기본 평가표가 자동 선택됨
- **설명 메시지**: 단계 유형 vs 단계 이름의 차이를 안내

**데이터 구조**:
```javascript
{
    stepTypeId: 'ST003',           // 단계 유형 참조
    name: '1차 본심사',             // 커스텀 이름 ⭐
    order: 1,
    type: 'review',
    evaluationRequired: true,
    evaluationTemplateId: 'EVAL002' // 개별 평가표 매핑 ⭐
}
```

### 3. 단계 편집 모달 (`editStageUnified`)

**위치**: `admin/admin_modals.js` (Lines 5584-5652)

**주요 특징**:
- 단계 이름 수정
- 평가표 변경 (심사 단계인 경우)
- 단계 유형은 표시만 하고 변경 불가

### 4. 단계 관리 기능

**구현된 함수들**:
- `removeStageUnified()`: 단계 삭제 및 순서 재정렬
- `moveStageUnified()`: 단계 위/아래 이동
- `renderComposedStagesUnified()`: 구성된 단계 목록 렌더링
  - 각 단계의 커스텀 이름 표시
  - 단계 유형 정보 표시
  - 평가표 정보 표시 (있는 경우)
- `refreshComposedStagesUnified()`: 화면 새로고침 및 저장 버튼 상태 업데이트

### 5. 워크플로우 저장 (`saveUnifiedWorkflow`)

**위치**: `admin/admin_modals.js` (Lines 5774-5829)

**검증 로직**:
1. 워크플로우 이름 필수
2. 최소 1개 이상의 단계 필수
3. 모든 심사 단계에 평가표 지정 필수

**저장 기능**:
- 신규 등록: mockThesisStages 배열에 추가
- 수정: 기존 워크플로우 데이터 업데이트
- 저장 후 stageManagement 화면으로 이동

## 화면 네비게이션 업데이트

### 1. 워크플로우 목록 페이지 (`stageManagement`)

**변경 사항**:
- [+ 워크플로우 추가] 버튼: `switchView('workflowCreateUnified')` 호출
- [수정] 버튼: `switchView('workflowCreateUnified', workflowId)` 호출
- [단계 구성] 버튼: 제거 (통합 화면에서 한 번에 처리)

### 2. 뷰 타이틀 매핑 (`admin_main.js`)

**추가된 매핑**:
```javascript
workflowCreateUnified: '워크플로우 등록'
```

## 핵심 개념: 단계 유형 vs 단계 이름

### 단계 유형 (Step Type)
- **정의**: 재사용 가능한 템플릿
- **예시**: "본심사", "예비심사", "연구계획서 제출"
- **저장 위치**: `mockStepTypes` 배열
- **특징**:
  - 여러 워크플로우에서 공통으로 사용
  - 기본 평가표 설정 가능
  - 문서/발표 필요 여부 정의

### 단계 이름 (Stage Name)
- **정의**: 워크플로우별 실제 단계 이름
- **예시**: "1차 본심사", "2차 본심사", "최종 본심사"
- **저장 위치**: 각 워크플로우의 `stages` 배열 내 `name` 필드
- **특징**:
  - 동일한 단계 유형을 여러 번 사용 가능
  - 워크플로우별로 고유한 이름 지정
  - 단계별로 다른 평가표 지정 가능

### 예시

```javascript
// 단계 유형 (템플릿)
mockStepTypes = [
    { id: 'ST003', name: '본심사', type: 'review' }
]

// 워크플로우 A
{
    name: '석사 표준 과정',
    stages: [
        { stepTypeId: 'ST003', name: '1차 본심사', evaluationTemplateId: 'EVAL002' },
        { stepTypeId: 'ST003', name: '2차 본심사', evaluationTemplateId: 'EVAL003' }
    ]
}

// 워크플로우 B
{
    name: '박사 단축 과정',
    stages: [
        { stepTypeId: 'ST003', name: '최종 본심사', evaluationTemplateId: 'EVAL002' }
    ]
}
```

## 사용자 흐름

### 1. 새 워크플로우 등록

```
1. [논문지도 단계 관리] 메뉴 클릭
2. [+ 워크플로우 추가] 버튼 클릭
3. 워크플로우 이름 입력 (예: "석사 표준 과정")
4. 학위 과정 선택 (석사/박사)
5. 왼쪽 단계 유형 목록에서 단계 클릭
   → 모달 열림: 단계 이름 입력 + 평가표 선택
6. [추가] 버튼 클릭
   → 오른쪽 구성된 단계 목록에 추가됨
7. 필요한 모든 단계 추가 (최소 1개)
8. [저장] 버튼 클릭
   → 워크플로우 등록 완료
```

### 2. 단계 유형 빠른 추가

```
1. 워크플로우 등록 화면에서
2. 왼쪽 패널 상단의 [+ 새 단계 유형 추가] 버튼 클릭
3. 단계 유형 모달에서 정보 입력
   - 단계 이름
   - 유형 (제출/심사)
   - 평가표 선택 (심사인 경우)
   - 발표/문서 필요 여부
4. [저장] 버튼 클릭
   → 왼쪽 목록에 즉시 반영됨
5. 추가된 단계 유형으로 워크플로우 구성 계속
```

### 3. 기존 워크플로우 수정

```
1. [논문지도 단계 관리] 메뉴에서 워크플로우 목록 확인
2. 수정할 워크플로우의 [수정] 버튼 클릭
3. 워크플로우 이름/학위 수정 (필요시)
4. 구성된 단계 목록에서:
   - [편집]: 단계 이름 또는 평가표 변경
   - [삭제]: 단계 제거
   - [▲▼]: 단계 순서 변경
5. 왼쪽에서 새 단계 추가 (필요시)
6. [저장] 버튼 클릭
   → 워크플로우 수정 완료
```

## 검증 및 안내 메시지

### 필수 검증

1. **워크플로우 이름**: 비어있으면 알림
2. **단계 개수**: 0개이면 저장 버튼 비활성화
3. **평가표 매핑**: 심사 단계에 평가표 미지정 시 알림
4. **단계 이름**: 단계 추가/수정 시 이름 필수

### 안내 메시지

- 단계 추가 모달에 단계 유형 vs 단계 이름 설명 포함
- 빈 단계 목록에 "왼쪽에서 단계를 선택하여 추가하세요" 표시
- 저장 버튼에 단계 개수 표시 (예: "저장 (3개 단계)")

## 전역 함수 노출

`admin/admin_modals.js` 파일 끝부분에 다음 함수들을 전역으로 노출:

```javascript
window.openAddStageModal = openAddStageModal;
window.editStageUnified = editStageUnified;
window.removeStageUnified = removeStageUnified;
window.moveStageUnified = moveStageUnified;
window.renderComposedStagesUnified = renderComposedStagesUnified;
window.refreshComposedStagesUnified = refreshComposedStagesUnified;
window.saveUnifiedWorkflow = saveUnifiedWorkflow;
```

## 파일 변경 사항 요약

### 1. `admin/admin_views.js`
- 추가: `workflowCreateUnified()` 함수 (Lines 2688-2812)
- 수정: `stageManagement()` 버튼 액션 업데이트

### 2. `admin/admin_modals.js`
- 추가: 7개 새로운 함수 (Lines 5492-5838)
  - `openAddStageModal()`
  - `editStageUnified()`
  - `removeStageUnified()`
  - `moveStageUnified()`
  - `renderComposedStagesUnified()`
  - `refreshComposedStagesUnified()`
  - `saveUnifiedWorkflow()`

### 3. `admin/admin_main.js`
- 수정: viewTitles 객체에 `workflowCreateUnified` 추가

### 4. `admin/assets/js/mockData.js`
- 이미 구현됨: `mockStepTypes`, `mockEvaluationTemplates` 배열
- 이미 업데이트됨: `mockThesisStages`에 `stepTypeId` 참조 추가

## 기술적 특징

### 1. 전역 변수 관리
- `window.composedStages`: 현재 구성 중인 단계 목록
- `window.currentWorkflowId`: 수정 모드일 때 워크플로우 ID
- 뷰 전환 시 자동 클린업

### 2. 실시간 UI 업데이트
- 단계 추가/삭제/수정 시 즉시 목록 갱신
- 저장 버튼 상태 동적 업데이트 (비활성화/활성화)
- 단계 개수 실시간 표시

### 3. 데이터 무결성
- 단계 추가/삭제 시 order 필드 자동 재정렬
- 깊은 복사로 원본 데이터 보호
- 참조 무결성 유지 (stepTypeId → mockStepTypes)

## 사용자 요구사항 충족 체크리스트

- [x] 워크플로우 등록과 단계 구성 화면 통합
- [x] 단계 없이 저장되지 않도록 검증
- [x] 단계 유형을 등록하는 기능 (빠른 접근 버튼)
- [x] 심사 단계에 평가표 매핑 기능
- [x] 단계 유형 추가 기능
- [x] 구성된 단계의 이름 수정 기능
- [x] 단계 유형(템플릿) vs 단계 이름(인스턴스) 구분

## 완료

모든 요구사항이 구현되었으며, 사용자가 요청한 최종 수정사항이 완전히 반영되었습니다.
