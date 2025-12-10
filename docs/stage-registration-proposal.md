# 세부 단계 등록 화면 구현 방안

## 작성 일자
2025-12-09

## 목적
IA 문서의 "심사 단계 등록 (워크플로우 조립)" 기능을 기존 구현 내역을 활용하여 구현

---

## 📋 현재 구현 상태 분석

### 1. 기존 구현 내역

#### **A. 논문 지도 단계 템플릿 (mockThesisStages)**
**위치**: `admin/assets/js/mockData.js` (Lines 128-160)

**구조**:
```javascript
mockThesisStages = [
    {
        id: 'TS001',
        name: '석사 표준 과정',
        degreeType: 'master',
        stageCount: 5,
        stages: [
            { order: 1, name: '연구계획서 작성', type: 'submission', evaluationRequired: false },
            { order: 2, name: '선행연구 검토', type: 'submission', evaluationRequired: false },
            { order: 3, name: '연구 수행', type: 'submission', evaluationRequired: false },
            { order: 4, name: '논문 작성', type: 'submission', evaluationRequired: false },
            { order: 5, name: '최종 심사', type: 'review', evaluationRequired: true }
        ]
    },
    // 박사 표준 과정 (7단계)
]
```

**특징**:
- 학위별 (석사/박사) 표준 과정 템플릿
- 각 단계의 순서, 이름, 유형(제출/심사), 평가 필요 여부 정의
- **현재 2개 템플릿만 존재** (석사, 박사)

---

#### **B. 학생 단계 관리 기능**
**위치**: `admin_main.js` (Lines 3606-4427)

**기능**:
- 학생별 단계 배정 (일괄 단계 부여)
- 학생별 단계 변경 (개별 단계 변경)
- 다음/이전 단계 이관
- 논문 심사 단계(템플릿) 필수 선택 방식

**화면 위치**: "논문지도 > 지도 학생 관리 > 단계 관리 탭"

**주요 함수**:
- `renderStageManagementContent()`: 단계 관리 화면 렌더링
- `bulkAssignStage()`: 일괄 단계 부여
- `bulkMoveToNextStage()`: 다음 단계 이관
- `bulkMoveToPrevStage()`: 이전 단계 이관

---

#### **C. 워크플로우 관리 화면 (기존 구현)**
**위치**: `admin_views.js` (Lines 1546-1632)

**메뉴명**: "논문지도 단계 관리" (admin_main.js Line 25)
**사이드바**: "논문심사 > 심사 단계 등록" (admin-dashboard.html Line 213)

**화면 구성**:
- 워크플로우 목록 테이블 (번호, 워크플로우명, 학과, 학위, 버전, 단계 수, 평가 단계, 단계 구성, 관리)
- "+ 워크플로우 추가" 버튼
- 상세보기/수정/복사/삭제 버튼

**Mock 데이터**: `appData.stages` (admin_data.js)

**문제점**:
- 화면 구현은 되어 있으나 **실제 워크플로우 등록/수정 모달이 없음**
- 단계 구성을 편집하는 UI가 없음
- `mockThesisStages`와 `appData.stages`의 연동이 없음

---

### 2. IA 문서 요구사항

**IA 문서** (행 30-31):
- 비고: "워크플로우 관리 (워크플로우를 조립하는 단계). 탭 형태로 신규 심사단계 (본심사, 예비심사 등 세부 구성 요소)를 등록하는 기능 제공"

**의미**:
- 기존 템플릿(석사 표준, 박사 표준)을 복사하거나
- 새로운 템플릿을 만들고
- 각 단계를 추가/수정/삭제/순서 변경할 수 있는 기능

---

## 🎯 구현 방안

### 방안: 기존 화면 활용 + 모달 추가 방식

#### 1. 기존 화면 유지
- `admin_views.js`의 `stageManagement()` 화면 그대로 사용
- 메뉴명: "심사 단계 등록" (사이드바에 이미 등록됨)

#### 2. Mock 데이터 통합
- `mockThesisStages` (mockData.js)를 워크플로우 관리의 데이터 소스로 사용
- `appData.stages` 제거하고 `mockThesisStages`로 통일

#### 3. 구현 기능

##### **A. 워크플로우 추가 모달**
**기능**:
- 워크플로우명 입력
- 학위 구분 선택 (석사/박사)
- 기존 템플릿 복사 또는 빈 템플릿 선택

**버튼**:
- [빈 템플릿으로 시작]
- [석사 표준 과정 복사]
- [박사 표준 과정 복사]

---

##### **B. 단계 구성 편집 모달**
**화면 구성**:
```
┌─────────────────────────────────────────────┐
│ 워크플로우 편집: 석사 표준 과정              │
├─────────────────────────────────────────────┤
│                                              │
│ [+ 단계 추가]                                │
│                                              │
│ ┌─────────────────────────────────────┐     │
│ │ 1. 연구계획서 작성                   │ ↑   │
│ │    유형: 제출   평가: 불필요         │ ↓   │
│ │    [수정] [삭제]                     │     │
│ └─────────────────────────────────────┘     │
│                                              │
│ ┌─────────────────────────────────────┐     │
│ │ 2. 선행연구 검토                     │ ↑   │
│ │    유형: 제출   평가: 불필요         │ ↓   │
│ │    [수정] [삭제]                     │     │
│ └─────────────────────────────────────┘     │
│                                              │
│ ┌─────────────────────────────────────┐     │
│ │ 3. 최종 심사                         │ ↑   │
│ │    유형: 심사   평가: 필수           │ ↓   │
│ │    [수정] [삭제]                     │     │
│ └─────────────────────────────────────┘     │
│                                              │
│              [저장] [취소]                   │
└─────────────────────────────────────────────┘
```

**기능**:
1. **단계 추가**: 순서 자동 부여, 이름/유형/평가 필요 여부 입력
2. **단계 수정**: 이름, 유형, 평가 필요 여부 변경
3. **단계 삭제**: 해당 단계 제거, 순서 자동 재정렬
4. **순서 변경**: ↑↓ 버튼으로 순서 이동

---

##### **C. 단계 추가/수정 서브 모달**
**입력 필드**:
- 단계명: 텍스트 입력
- 유형: 라디오 버튼 (제출 / 심사)
- 평가 필요: 체크박스

**예시**:
```
단계명: [연구계획서 작성____________]

유형: ( ) 제출  ( ) 심사

평가 필요: [ ] 평가표 적용

[추가] [취소]
```

---

### 4. 구현 파일 및 함수 목록

#### **파일 수정**:
1. `admin/admin_views.js` (Lines 1546-1632)
   - `stageManagement()` 함수 수정
   - `mockThesisStages` 사용으로 변경

2. `admin/admin_main.js` (신규 함수 추가)
   - `openStageModal()`: 워크플로우 추가 모달
   - `openStageEditModal(stageId)`: 단계 구성 편집 모달
   - `addStageStep()`: 단계 추가 서브 모달
   - `editStageStep(stageId, stepOrder)`: 단계 수정 서브 모달
   - `deleteStageStep(stageId, stepOrder)`: 단계 삭제
   - `moveStageStepUp(stageId, stepOrder)`: 단계 순서 올리기
   - `moveStageStepDown(stageId, stepOrder)`: 단계 순서 내리기
   - `saveStageTemplate()`: 워크플로우 저장
   - `copyStage(stageId)`: 워크플로우 복사
   - `deleteStage(stageId)`: 워크플로우 삭제

3. `admin/assets/js/mockData.js`
   - `mockThesisStages` 데이터 확장 (필요 시)

---

## 📐 상세 구현 사양

### 1. 워크플로우 목록 테이블

**컬럼**:
| 컬럼 | 설명 |
|------|------|
| 번호 | 순번 |
| 워크플로우명 | 템플릿 이름 (예: 석사 표준 과정) |
| 학위 구분 | 석사/박사 |
| 단계 수 | 전체 단계 개수 |
| 평가 단계 | evaluationRequired: true인 단계 개수 |
| 단계 구성 | 각 단계를 배지로 표시 (초록색: 평가 단계, 회색: 제출 단계) |
| 관리 | [편집] [복사] [삭제] 버튼 |

**기존과의 차이**:
- "학과" 컬럼 제거 (IA 문서에서 학과별 구분 없음)
- "버전" 컬럼 제거 (단순화)
- "상세보기" 제거, "편집" 버튼으로 통합

---

### 2. 워크플로우 추가 모달

**HTML 구조**:
```html
<div class="admin-modal active" id="stage-add-modal">
    <div class="admin-modal-content" style="max-width: 600px;">
        <div class="admin-modal-header">
            <h2>워크플로우 추가</h2>
            <button class="admin-modal-close" onclick="closeStageModal()">&times;</button>
        </div>
        <div class="admin-modal-body">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">워크플로우명</label>
                <input type="text" id="stage-name" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="예: 석사 특별 과정">
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">학위 구분</label>
                <div class="flex gap-4">
                    <label class="flex items-center">
                        <input type="radio" name="degree-type" value="master" checked>
                        <span class="ml-2">석사</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="degree-type" value="phd">
                        <span class="ml-2">박사</span>
                    </label>
                </div>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">템플릿 선택</label>
                <div class="space-y-2">
                    <button onclick="createEmptyStage()" class="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                        <i class="fas fa-file-alt mr-2"></i>빈 템플릿으로 시작
                    </button>
                    <button onclick="copyExistingStage('TS001')" class="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                        <i class="fas fa-copy mr-2"></i>석사 표준 과정 복사
                    </button>
                    <button onclick="copyExistingStage('TS002')" class="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                        <i class="fas fa-copy mr-2"></i>박사 표준 과정 복사
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

### 3. 단계 구성 편집 모달

**HTML 구조**:
```html
<div class="admin-modal active" id="stage-edit-modal">
    <div class="admin-modal-content" style="max-width: 800px;">
        <div class="admin-modal-header">
            <h2>단계 구성 편집: <span id="edit-stage-name">석사 표준 과정</span></h2>
            <button class="admin-modal-close" onclick="closeStageEditModal()">&times;</button>
        </div>
        <div class="admin-modal-body">
            <div class="mb-4">
                <button onclick="addStageStep()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                    <i class="fas fa-plus mr-2"></i>단계 추가
                </button>
            </div>

            <div id="stage-steps-list" class="space-y-2">
                <!-- 단계 목록이 여기에 동적으로 생성 -->
            </div>

            <div class="mt-6 flex justify-end gap-2">
                <button onclick="closeStageEditModal()" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    취소
                </button>
                <button onclick="saveStageTemplate()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                    저장
                </button>
            </div>
        </div>
    </div>
</div>
```

**단계 아이템 구조** (동적 생성):
```html
<div class="p-4 border border-gray-200 rounded-md bg-white" data-step-order="1">
    <div class="flex items-center justify-between">
        <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
                <span class="text-lg font-bold text-gray-800">1.</span>
                <span class="text-lg font-semibold text-gray-800">연구계획서 작성</span>
                <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">제출</span>
                <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">평가 불필요</span>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <button onclick="moveStageStepUp('TS001', 1)" class="p-2 text-gray-500 hover:text-primary" title="위로">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button onclick="moveStageStepDown('TS001', 1)" class="p-2 text-gray-500 hover:text-primary" title="아래로">
                <i class="fas fa-arrow-down"></i>
            </button>
            <button onclick="editStageStep('TS001', 1)" class="px-3 py-1 text-sm text-blue-600 hover:underline">
                수정
            </button>
            <button onclick="deleteStageStep('TS001', 1)" class="px-3 py-1 text-sm text-red-600 hover:underline">
                삭제
            </button>
        </div>
    </div>
</div>
```

---

### 4. 단계 추가/수정 서브 모달

**HTML 구조**:
```html
<div class="admin-modal active" id="step-form-modal">
    <div class="admin-modal-content" style="max-width: 500px;">
        <div class="admin-modal-header">
            <h2 id="step-form-title">단계 추가</h2>
            <button class="admin-modal-close" onclick="closeStepFormModal()">&times;</button>
        </div>
        <div class="admin-modal-body">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">단계명 *</label>
                <input type="text" id="step-name" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="예: 연구계획서 작성">
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">유형 *</label>
                <div class="flex gap-4">
                    <label class="flex items-center">
                        <input type="radio" name="step-type" value="submission" checked>
                        <span class="ml-2">제출</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="step-type" value="review">
                        <span class="ml-2">심사</span>
                    </label>
                </div>
            </div>

            <div class="mb-4">
                <label class="flex items-center">
                    <input type="checkbox" id="step-evaluation" class="mr-2">
                    <span class="text-sm font-medium text-gray-700">평가표 적용</span>
                </label>
                <p class="text-xs text-gray-500 mt-1">
                    체크 시 해당 단계에서 평가표를 사용한 심사가 진행됩니다.
                </p>
            </div>

            <div class="flex justify-end gap-2">
                <button onclick="closeStepFormModal()" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    취소
                </button>
                <button onclick="saveStepForm()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                    저장
                </button>
            </div>
        </div>
    </div>
</div>
```

---

## 🔧 주요 함수 구현

### 1. openStageModal()
```javascript
function openStageModal() {
    const modalHTML = `
        <div class="admin-modal active" id="stage-add-modal">
            <!-- 워크플로우 추가 모달 HTML -->
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
```

### 2. openStageEditModal(stageId)
```javascript
function openStageEditModal(stageId) {
    const stage = mockThesisStages.find(s => s.id === stageId);
    if (!stage) return;

    window.editingStageId = stageId;

    const modalHTML = `
        <div class="admin-modal active" id="stage-edit-modal">
            <!-- 단계 구성 편집 모달 HTML -->
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 단계 목록 렌더링
    renderStageStepsList(stageId);
}
```

### 3. renderStageStepsList(stageId)
```javascript
function renderStageStepsList(stageId) {
    const stage = mockThesisStages.find(s => s.id === stageId);
    const container = document.getElementById('stage-steps-list');

    container.innerHTML = stage.stages.map((step, index) => `
        <div class="p-4 border border-gray-200 rounded-md bg-white" data-step-order="${step.order}">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-lg font-bold text-gray-800">${step.order}.</span>
                        <span class="text-lg font-semibold text-gray-800">${step.name}</span>
                        <span class="px-2 py-1 text-xs rounded ${step.type === 'review' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}">
                            ${step.type === 'review' ? '심사' : '제출'}
                        </span>
                        <span class="px-2 py-1 text-xs rounded ${step.evaluationRequired ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}">
                            ${step.evaluationRequired ? '평가 필수' : '평가 불필요'}
                        </span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="moveStageStepUp('${stageId}', ${step.order})"
                            class="p-2 text-gray-500 hover:text-primary"
                            title="위로"
                            ${index === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button onclick="moveStageStepDown('${stageId}', ${step.order})"
                            class="p-2 text-gray-500 hover:text-primary"
                            title="아래로"
                            ${index === stage.stages.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button onclick="editStageStep('${stageId}', ${step.order})"
                            class="px-3 py-1 text-sm text-blue-600 hover:underline">
                        수정
                    </button>
                    <button onclick="deleteStageStep('${stageId}', ${step.order})"
                            class="px-3 py-1 text-sm text-red-600 hover:underline">
                        삭제
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}
```

### 4. moveStageStepUp(stageId, stepOrder) / moveStageStepDown(stageId, stepOrder)
```javascript
function moveStageStepUp(stageId, stepOrder) {
    const stage = mockThesisStages.find(s => s.id === stageId);
    const index = stage.stages.findIndex(s => s.order === stepOrder);

    if (index <= 0) return; // 첫 번째 단계는 위로 이동 불가

    // 배열 요소 교체
    [stage.stages[index - 1], stage.stages[index]] = [stage.stages[index], stage.stages[index - 1]];

    // order 재정렬
    stage.stages.forEach((step, idx) => {
        step.order = idx + 1;
    });

    renderStageStepsList(stageId);
}

function moveStageStepDown(stageId, stepOrder) {
    const stage = mockThesisStages.find(s => s.id === stageId);
    const index = stage.stages.findIndex(s => s.order === stepOrder);

    if (index >= stage.stages.length - 1) return; // 마지막 단계는 아래로 이동 불가

    // 배열 요소 교체
    [stage.stages[index], stage.stages[index + 1]] = [stage.stages[index + 1], stage.stages[index]];

    // order 재정렬
    stage.stages.forEach((step, idx) => {
        step.order = idx + 1;
    });

    renderStageStepsList(stageId);
}
```

### 5. deleteStageStep(stageId, stepOrder)
```javascript
function deleteStageStep(stageId, stepOrder) {
    const stage = mockThesisStages.find(s => s.id === stageId);

    if (!confirm(`${stepOrder}단계를 삭제하시겠습니까?`)) return;

    // 단계 삭제
    stage.stages = stage.stages.filter(s => s.order !== stepOrder);

    // order 재정렬
    stage.stages.forEach((step, idx) => {
        step.order = idx + 1;
    });

    // stageCount 업데이트
    stage.stageCount = stage.stages.length;

    renderStageStepsList(stageId);
    showNotification('단계가 삭제되었습니다.', 'success');
}
```

### 6. saveStageTemplate()
```javascript
function saveStageTemplate() {
    const stageId = window.editingStageId;
    const stage = mockThesisStages.find(s => s.id === stageId);

    showNotification('워크플로우가 저장되었습니다.', 'success');
    closeStageEditModal();

    // 목록 화면 재렌더링
    loadView('stageManagement');
}
```

---

## 📊 예상 소요 시간

| 작업 | 예상 시간 |
|------|----------|
| admin_views.js 수정 (mockThesisStages 연동) | 0.5일 |
| 워크플로우 추가 모달 구현 | 0.5일 |
| 단계 구성 편집 모달 구현 | 1일 |
| 단계 추가/수정/삭제 기능 | 0.5일 |
| 단계 순서 변경 기능 | 0.5일 |
| 워크플로우 복사/삭제 기능 | 0.5일 |
| 테스트 및 버그 수정 | 0.5일 |
| **총계** | **4일** |

---

## ✅ 구현 체크리스트

### Phase 1: 데이터 통합 (0.5일)
- [ ] `admin_views.js`의 `stageManagement()` 함수 수정
- [ ] `appData.stages` 제거, `mockThesisStages` 사용
- [ ] 테이블 컬럼 구조 변경 (학과/버전 제거)

### Phase 2: 워크플로우 추가 (0.5일)
- [ ] `openStageModal()` 함수 구현
- [ ] 워크플로우 추가 모달 HTML 작성
- [ ] 빈 템플릿/복사 기능 구현
- [ ] `createEmptyStage()` 함수
- [ ] `copyExistingStage(sourceId)` 함수

### Phase 3: 단계 편집 모달 (1일)
- [ ] `openStageEditModal(stageId)` 함수 구현
- [ ] 단계 구성 편집 모달 HTML 작성
- [ ] `renderStageStepsList(stageId)` 함수
- [ ] 동적 단계 아이템 렌더링

### Phase 4: 단계 관리 기능 (1.5일)
- [ ] 단계 추가/수정 서브 모달 HTML
- [ ] `addStageStep()` 함수
- [ ] `editStageStep(stageId, stepOrder)` 함수
- [ ] `deleteStageStep(stageId, stepOrder)` 함수
- [ ] `moveStageStepUp(stageId, stepOrder)` 함수
- [ ] `moveStageStepDown(stageId, stepOrder)` 함수
- [ ] `saveStepForm()` 함수

### Phase 5: 워크플로우 관리 (0.5일)
- [ ] `saveStageTemplate()` 함수
- [ ] `copyStage(stageId)` 함수
- [ ] `deleteStage(stageId)` 함수
- [ ] 삭제 확인 모달

### Phase 6: 테스트 및 마무리 (0.5일)
- [ ] 전체 기능 테스트
- [ ] 버그 수정
- [ ] UI/UX 최종 점검
- [ ] 문서 업데이트

---

## 🎨 UI/UX 개선사항

### 1. 일관성 유지
- 기존 심사위원 배정 화면과 동일한 모달 스타일 사용
- 검색 필터와 동일한 버튼 디자인
- 알림 시스템 재사용

### 2. 직관적 조작
- 드래그 앤 드롭 대신 ↑↓ 버튼 사용 (구현 단순화)
- 단계 추가는 항상 맨 아래에 추가
- 순서 변경은 ↑↓ 버튼으로만 가능

### 3. 명확한 피드백
- 단계 추가/수정/삭제 시 즉시 알림
- 저장 전 확인 모달
- 삭제 시 재확인

---

## 🔄 기존 기능과의 연동

### 1. 학생 단계 관리와의 연동
- `mockThesisStages`가 변경되면 학생 단계 관리 화면에 즉시 반영
- 논문 심사 단계 드롭다운에 신규 템플릿 자동 표시

### 2. 심사위원 배정과의 연동
- 새로운 단계 템플릿에 따라 심사 대상 학생 필터링
- 심사 유형 (proposal/progress/final)과 단계명 매칭

---

## 📝 참고사항

### IA 문서와의 차이점
- IA 문서: "탭 형태로 신규 심사단계 등록"
- 구현 방안: 모달 기반 편집 (탭 대신 목록 + 편집 모달)
- 이유: 기존 UI 패턴과의 일관성, 구현 단순화

### 확인 필요 사항
1. **"심사 단계 등록"과 "논문 지도 단계 설정"의 차이**
   - 현재는 동일한 개념으로 간주하고 통합 구현
   - 고객 확인 필요

2. **학과별 워크플로우 필요 여부**
   - 현재는 학위별 (석사/박사)만 구분
   - 학과별 커스터마이징 필요 시 추가 개발

---

## 변경 이력
- 2025-12-09: 초안 작성 (기존 구현 분석 및 구현 방안 도출)
