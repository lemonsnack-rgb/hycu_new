# 2단계 구조 심사 단계 등록 구현 방안

## 작성 일자
2025-12-09

## 목적
IA 문서 요구사항에 따른 2단계 구조 구현:
1. **세부 단계 유형 등록** (레고 블록 만들기)
2. **워크플로우 조립** (레고 블록 조합하기)

---

## 📋 2단계 구조 이해

### 1단계: 세부 단계 유형 등록 (Step Type Registry)
**개념**: 재사용 가능한 "단계 블록" 생성

**예시**:
```
📦 연구계획서 제출
   - 유형: 제출
   - 문서 제출: 필요
   - 발표: 불필요
   - 평가표: 없음

📦 본심사
   - 유형: 심사
   - 문서 제출: 필요 (최종 논문)
   - 발표: 필요
   - 평가표: "학위 논문 심사 평가표"

📦 예비심사
   - 유형: 심사
   - 문서 제출: 필요 (초안)
   - 발표: 필요
   - 평가표: "예비 심사 평가표"
```

---

### 2단계: 워크플로우 조립 (Workflow Composition)
**개념**: 등록된 단계 블록들을 순서대로 배열하여 워크플로우 생성

**예시**:
```
🔧 석사 표준 과정 (5단계)
   1. 연구계획서 제출 ← (1단계에서 등록한 블록)
   2. 선행연구 검토 ← (1단계에서 등록한 블록)
   3. 연구 수행 ← (1단계에서 등록한 블록)
   4. 논문 작성 ← (1단계에서 등록한 블록)
   5. 본심사 ← (1단계에서 등록한 블록)

🔧 박사 표준 과정 (7단계)
   1. 연구계획서 제출
   2. 선행연구 검토
   3. 예비심사 ← (석사에는 없는 단계)
   4. 연구 수행
   5. 논문 초안 작성
   6. 예비심사 ← (중간 검증)
   7. 본심사
```

---

## 🎯 기존 구현 상태 확인

### ✅ 이미 구현된 화면

#### **A. 지도 단계 유형 관리 (레고 블록)**
**위치**: `admin_views.js` Lines 1634-1677

**메뉴명**: "지도 단계 유형 관리"

**화면 구성**:
- 카드 그리드 레이아웃
- 각 카드: 단계명, 발표 필요, 문서 제출 필요, 설명
- [+ 유형 추가] 버튼
- [수정] [삭제] 버튼

**Mock 데이터**: `appData.types` (admin_data.js)

**문제점**:
- 평가표 연결 기능 없음
- 유형(제출/심사) 구분 없음
- 실제 등록/수정 모달 없음

---

#### **B. 논문지도 워크플로우 관리**
**위치**: `admin_views.js` Lines 1546-1632

**메뉴명**: "논문지도 단계 관리"

**화면 구성**:
- 워크플로우 목록 테이블
- 단계 구성 표시 (배지)
- [+ 워크플로우 추가] 버튼
- [상세보기] [수정] [복사] [삭제] 버튼

**Mock 데이터**: `appData.stages` (admin_data.js)

**문제점**:
- 실제 조립 모달 없음
- 단계 유형(appData.types)과 연동 안 됨

---

## 🏗️ 구현 방안

### 방안: 기존 2개 화면 개선 + 연동

---

## 📐 1단계: 세부 단계 유형 등록 화면 개선

### 메뉴 위치
- **사이드바**: "시스템설정 > 단계 유형 관리" (기존 typeManagement)
- **제목**: "심사 단계 유형 관리 (레고 블록)"

### Mock 데이터 구조 개선

#### mockStepTypes (새로운 구조)
```javascript
const mockStepTypes = [
    {
        id: 'ST001',
        name: '연구계획서 제출',
        type: 'submission', // 'submission' | 'review'
        requiresDocument: true,
        requiresPresentation: false,
        evaluationTemplateId: null, // 평가표 없음
        description: '연구 주제 및 연구 방법을 문서로 제출하는 단계',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST002',
        name: '예비심사',
        type: 'review',
        requiresDocument: true,
        requiresPresentation: true,
        evaluationTemplateId: 'EVAL001', // 평가표 연결
        description: '논문 초안에 대한 예비 심사 진행',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST003',
        name: '본심사',
        type: 'review',
        requiresDocument: true,
        requiresPresentation: true,
        evaluationTemplateId: 'EVAL002',
        description: '최종 논문에 대한 본심사 진행',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST004',
        name: '선행연구 검토',
        type: 'submission',
        requiresDocument: true,
        requiresPresentation: false,
        evaluationTemplateId: null,
        description: '관련 선행연구를 검토하고 요약 보고서 제출',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST005',
        name: '연구 수행',
        type: 'submission',
        requiresDocument: true,
        requiresPresentation: false,
        evaluationTemplateId: null,
        description: '실제 연구를 수행하고 데이터 수집',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST006',
        name: '논문 작성',
        type: 'submission',
        requiresDocument: true,
        requiresPresentation: false,
        evaluationTemplateId: null,
        description: '연구 결과를 바탕으로 논문 작성',
        createdDate: '2025-01-01'
    }
];
```

---

### 화면 개선사항

#### 1) 카드 레이아웃 개선
```html
<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-3">
        <div>
            <h4 class="font-bold text-gray-800">본심사</h4>
            <span class="mt-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">심사</span>
        </div>
        <div class="flex space-x-2">
            <button onclick="editStepType('ST003')" class="text-blue-600 hover:underline text-xs">수정</button>
            <button onclick="deleteStepType('ST003')" class="text-red-600 hover:underline text-xs">삭제</button>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center text-sm">
            <i class="fas fa-check-circle text-green-600 w-4 mr-2"></i>
            <span class="text-gray-600">문서 제출 필요</span>
        </div>
        <div class="flex items-center text-sm">
            <i class="fas fa-check-circle text-green-600 w-4 mr-2"></i>
            <span class="text-gray-600">발표 필요</span>
        </div>
        <div class="flex items-center text-sm">
            <i class="fas fa-file-alt text-blue-600 w-4 mr-2"></i>
            <span class="text-gray-600">평가표: 학위 논문 심사</span>
        </div>
    </div>

    <p class="mt-3 text-xs text-gray-500 border-t pt-2">
        최종 논문에 대한 본심사 진행
    </p>
</div>
```

---

#### 2) 단계 유형 등록/수정 모달
```html
<div class="admin-modal active" id="step-type-modal">
    <div class="admin-modal-content" style="max-width: 600px;">
        <div class="admin-modal-header">
            <h2>단계 유형 등록</h2>
            <button class="admin-modal-close" onclick="closeStepTypeModal()">&times;</button>
        </div>
        <div class="admin-modal-body">
            <!-- 단계명 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">단계명 *</label>
                <input type="text" id="step-type-name" class="w-full px-3 py-2 border border-gray-300 rounded-md"
                       placeholder="예: 본심사">
            </div>

            <!-- 유형 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">유형 *</label>
                <div class="flex gap-4">
                    <label class="flex items-center">
                        <input type="radio" name="step-type" value="submission" checked>
                        <span class="ml-2">제출 단계</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="step-type" value="review">
                        <span class="ml-2">심사 단계</span>
                    </label>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                    제출: 학생이 문서를 제출하는 단계 / 심사: 교수가 평가하는 단계
                </p>
            </div>

            <!-- 요구사항 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">요구사항</label>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="checkbox" id="requires-document" checked>
                        <span class="ml-2 text-sm">문서 제출 필요</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" id="requires-presentation">
                        <span class="ml-2 text-sm">발표 필요</span>
                    </label>
                </div>
            </div>

            <!-- 평가표 선택 -->
            <div class="mb-4" id="evaluation-section">
                <label class="block text-sm font-medium text-gray-700 mb-2">평가표 선택</label>
                <select id="evaluation-template" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">평가표 없음</option>
                    <option value="EVAL001">예비 심사 평가표</option>
                    <option value="EVAL002">학위 논문 심사 평가표</option>
                    <option value="EVAL003">학술지 논문 심사 평가표</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                    심사 단계인 경우 평가표를 선택하세요
                </p>
            </div>

            <!-- 설명 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea id="step-type-description" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="이 단계에 대한 설명을 입력하세요"></textarea>
            </div>

            <div class="flex justify-end gap-2">
                <button onclick="closeStepTypeModal()"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    취소
                </button>
                <button onclick="saveStepType()"
                        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                    저장
                </button>
            </div>
        </div>
    </div>
</div>
```

---

### 주요 함수

#### 1. openStepTypeModal(stepTypeId)
```javascript
function openStepTypeModal(stepTypeId = null) {
    const isEdit = !!stepTypeId;
    const stepType = isEdit ? mockStepTypes.find(s => s.id === stepTypeId) : null;

    const modalHTML = `
        <div class="admin-modal active" id="step-type-modal">
            <!-- 모달 HTML -->
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 수정 모드면 데이터 채우기
    if (isEdit && stepType) {
        document.getElementById('step-type-name').value = stepType.name;
        document.querySelector(`input[name="step-type"][value="${stepType.type}"]`).checked = true;
        document.getElementById('requires-document').checked = stepType.requiresDocument;
        document.getElementById('requires-presentation').checked = stepType.requiresPresentation;
        document.getElementById('evaluation-template').value = stepType.evaluationTemplateId || '';
        document.getElementById('step-type-description').value = stepType.description || '';
    }

    // 유형 변경 시 평가표 섹션 표시/숨김
    document.querySelectorAll('input[name="step-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const evalSection = document.getElementById('evaluation-section');
            evalSection.style.display = e.target.value === 'review' ? 'block' : 'none';
        });
    });
}
```

#### 2. saveStepType()
```javascript
function saveStepType() {
    const name = document.getElementById('step-type-name').value.trim();
    const type = document.querySelector('input[name="step-type"]:checked').value;
    const requiresDocument = document.getElementById('requires-document').checked;
    const requiresPresentation = document.getElementById('requires-presentation').checked;
    const evaluationTemplateId = document.getElementById('evaluation-template').value || null;
    const description = document.getElementById('step-type-description').value.trim();

    if (!name) {
        showNotification('단계명을 입력하세요.', 'warning');
        return;
    }

    // 새 단계 유형 생성
    const newStepType = {
        id: 'ST' + String(mockStepTypes.length + 1).padStart(3, '0'),
        name,
        type,
        requiresDocument,
        requiresPresentation,
        evaluationTemplateId,
        description,
        createdDate: new Date().toISOString().split('T')[0]
    };

    mockStepTypes.push(newStepType);

    showNotification('단계 유형이 등록되었습니다.', 'success');
    closeStepTypeModal();
    loadView('typeManagement');
}
```

---

## 📐 2단계: 워크플로우 조립 화면 개선

### 메뉴 위치
- **사이드바**: "논문심사 > 심사 단계 등록" (기존 stageManagement)
- **제목**: "워크플로우 관리 (단계 조립)"

### Mock 데이터 구조 개선

#### mockThesisStages (개선된 구조)
```javascript
const mockThesisStages = [
    {
        id: 'TS001',
        name: '석사 표준 과정',
        degreeType: 'master',
        stageCount: 5,
        createdDate: '2025-01-01',
        stages: [
            {
                order: 1,
                stepTypeId: 'ST001', // mockStepTypes 참조
                name: '연구계획서 제출', // 복사 (표시용)
                type: 'submission',
                evaluationRequired: false
            },
            {
                order: 2,
                stepTypeId: 'ST004',
                name: '선행연구 검토',
                type: 'submission',
                evaluationRequired: false
            },
            {
                order: 3,
                stepTypeId: 'ST005',
                name: '연구 수행',
                type: 'submission',
                evaluationRequired: false
            },
            {
                order: 4,
                stepTypeId: 'ST006',
                name: '논문 작성',
                type: 'submission',
                evaluationRequired: false
            },
            {
                order: 5,
                stepTypeId: 'ST003',
                name: '본심사',
                type: 'review',
                evaluationRequired: true
            }
        ]
    },
    {
        id: 'TS002',
        name: '박사 표준 과정',
        degreeType: 'phd',
        stageCount: 7,
        createdDate: '2025-01-01',
        stages: [
            { order: 1, stepTypeId: 'ST001', name: '연구계획서 제출', type: 'submission', evaluationRequired: false },
            { order: 2, stepTypeId: 'ST004', name: '선행연구 검토', type: 'submission', evaluationRequired: false },
            { order: 3, stepTypeId: 'ST002', name: '예비심사', type: 'review', evaluationRequired: true },
            { order: 4, stepTypeId: 'ST005', name: '연구 수행', type: 'submission', evaluationRequired: false },
            { order: 5, stepTypeId: 'ST002', name: '예비심사', type: 'review', evaluationRequired: true },
            { order: 6, stepTypeId: 'ST006', name: '논문 작성', type: 'submission', evaluationRequired: false },
            { order: 7, stepTypeId: 'ST003', name: '본심사', type: 'review', evaluationRequired: true }
        ]
    }
];
```

**핵심 변경점**:
- `stepTypeId` 추가: 1단계에서 등록한 단계 유형 참조
- 같은 단계 유형(예: 예비심사)을 여러 번 사용 가능

---

### 워크플로우 편집 모달 개선

#### 단계 선택 방식 (드롭다운)
```html
<div class="admin-modal active" id="workflow-edit-modal">
    <div class="admin-modal-content" style="max-width: 900px;">
        <div class="admin-modal-header">
            <h2>워크플로우 편집: <span id="workflow-name">석사 표준 과정</span></h2>
            <button class="admin-modal-close" onclick="closeWorkflowEditModal()">&times;</button>
        </div>
        <div class="admin-modal-body">
            <!-- 단계 추가 버튼 -->
            <div class="mb-4">
                <button onclick="addStageToWorkflow()"
                        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                    <i class="fas fa-plus mr-2"></i>단계 추가
                </button>
            </div>

            <!-- 단계 목록 -->
            <div id="workflow-stages-list" class="space-y-2">
                <!-- 동적 생성 -->
            </div>

            <div class="mt-6 flex justify-end gap-2">
                <button onclick="closeWorkflowEditModal()"
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    취소
                </button>
                <button onclick="saveWorkflow()"
                        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                    저장
                </button>
            </div>
        </div>
    </div>
</div>
```

---

#### 단계 아이템 (드롭다운 선택)
```html
<div class="p-4 border border-gray-200 rounded-md bg-white" data-stage-order="1">
    <div class="flex items-center gap-4">
        <!-- 순서 -->
        <div class="flex flex-col gap-1">
            <button onclick="moveStageUp('TS001', 1)"
                    class="p-1 text-gray-500 hover:text-primary"
                    title="위로">
                <i class="fas fa-arrow-up"></i>
            </button>
            <span class="text-lg font-bold text-gray-800 text-center">1</span>
            <button onclick="moveStageDown('TS001', 1)"
                    class="p-1 text-gray-500 hover:text-primary"
                    title="아래로">
                <i class="fas fa-arrow-down"></i>
            </button>
        </div>

        <!-- 단계 선택 드롭다운 -->
        <div class="flex-1">
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    onchange="changeStageType('TS001', 1, this.value)">
                <option value="">== 단계 선택 ==</option>
                <optgroup label="제출 단계">
                    <option value="ST001">연구계획서 제출</option>
                    <option value="ST004">선행연구 검토</option>
                    <option value="ST005">연구 수행</option>
                    <option value="ST006">논문 작성</option>
                </optgroup>
                <optgroup label="심사 단계">
                    <option value="ST002">예비심사</option>
                    <option value="ST003" selected>본심사</option>
                </optgroup>
            </select>
        </div>

        <!-- 단계 정보 표시 -->
        <div class="flex items-center gap-2">
            <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">심사</span>
            <span class="px-2 py-1 text-xs rounded bg-green-100 text-green-800">평가 필수</span>
            <span class="text-xs text-gray-500" title="학위 논문 심사 평가표">
                <i class="fas fa-file-alt"></i>
            </span>
        </div>

        <!-- 삭제 버튼 -->
        <button onclick="deleteStageFromWorkflow('TS001', 1)"
                class="px-3 py-1 text-sm text-red-600 hover:underline">
            삭제
        </button>
    </div>

    <!-- 단계 설명 (접힌 상태로) -->
    <div class="mt-2 text-xs text-gray-500 border-t pt-2" style="display: none;">
        최종 논문에 대한 본심사 진행
    </div>
</div>
```

---

### 주요 함수

#### 1. addStageToWorkflow()
```javascript
function addStageToWorkflow() {
    const workflowId = window.editingWorkflowId;
    const workflow = mockThesisStages.find(w => w.id === workflowId);

    // 새 단계 추가 (빈 상태)
    const newOrder = workflow.stages.length + 1;
    workflow.stages.push({
        order: newOrder,
        stepTypeId: null,
        name: '',
        type: null,
        evaluationRequired: false
    });

    renderWorkflowStagesList(workflowId);
}
```

#### 2. changeStageType(workflowId, stageOrder, stepTypeId)
```javascript
function changeStageType(workflowId, stageOrder, stepTypeId) {
    const workflow = mockThesisStages.find(w => w.id === workflowId);
    const stage = workflow.stages.find(s => s.order === stageOrder);

    if (!stepTypeId) {
        stage.stepTypeId = null;
        stage.name = '';
        stage.type = null;
        stage.evaluationRequired = false;
        return;
    }

    // stepTypeId로 mockStepTypes에서 정보 가져오기
    const stepType = mockStepTypes.find(st => st.id === stepTypeId);
    if (!stepType) return;

    // 단계 정보 업데이트
    stage.stepTypeId = stepType.id;
    stage.name = stepType.name;
    stage.type = stepType.type;
    stage.evaluationRequired = !!stepType.evaluationTemplateId;

    // 화면 재렌더링
    renderWorkflowStagesList(workflowId);
}
```

#### 3. deleteStageFromWorkflow(workflowId, stageOrder)
```javascript
function deleteStageFromWorkflow(workflowId, stageOrder) {
    if (!confirm('이 단계를 삭제하시겠습니까?')) return;

    const workflow = mockThesisStages.find(w => w.id === workflowId);

    // 단계 삭제
    workflow.stages = workflow.stages.filter(s => s.order !== stageOrder);

    // 순서 재정렬
    workflow.stages.forEach((stage, index) => {
        stage.order = index + 1;
    });

    // stageCount 업데이트
    workflow.stageCount = workflow.stages.length;

    renderWorkflowStagesList(workflowId);
    showNotification('단계가 삭제되었습니다.', 'success');
}
```

---

## 📊 데이터 흐름

```
[1단계: 단계 유형 등록]
mockStepTypes
  ├─ ST001: 연구계획서 제출
  ├─ ST002: 예비심사
  ├─ ST003: 본심사
  ├─ ST004: 선행연구 검토
  ├─ ST005: 연구 수행
  └─ ST006: 논문 작성

          ⬇ 참조

[2단계: 워크플로우 조립]
mockThesisStages
  ├─ TS001: 석사 표준 과정
  │    ├─ 1단계: ST001 (연구계획서 제출)
  │    ├─ 2단계: ST004 (선행연구 검토)
  │    ├─ 3단계: ST005 (연구 수행)
  │    ├─ 4단계: ST006 (논문 작성)
  │    └─ 5단계: ST003 (본심사)
  │
  └─ TS002: 박사 표준 과정
       ├─ 1단계: ST001 (연구계획서 제출)
       ├─ 2단계: ST004 (선행연구 검토)
       ├─ 3단계: ST002 (예비심사) ← 석사에는 없음
       ├─ 4단계: ST005 (연구 수행)
       ├─ 5단계: ST002 (예비심사) ← 같은 유형 재사용
       ├─ 6단계: ST006 (논문 작성)
       └─ 7단계: ST003 (본심사)

          ⬇ 사용

[학생 단계 관리]
mockStudentStageAssignments
  - studentId: STU001
  - thesisStageId: TS001 (석사 표준 과정)
  - currentStageOrder: 3 (현재 3단계: 연구 수행)
```

---

## 🔧 구현 작업 목록

### Phase 1: 1단계 - 단계 유형 등록 (1.5일)

#### A. Mock 데이터 생성 (0.5일)
- [ ] `mockStepTypes` 배열 생성 (6개 기본 유형)
- [ ] `mockEvaluationTemplates` 확인 (평가표 목록)

#### B. 화면 개선 (0.5일)
- [ ] `admin_views.js` > `typeManagement()` 수정
  - [ ] 카드 레이아웃에 유형 배지 추가
  - [ ] 평가표 정보 표시
- [ ] 카드 그리드 CSS 조정

#### C. 모달 구현 (0.5일)
- [ ] `openStepTypeModal(stepTypeId)` 함수
- [ ] `saveStepType()` 함수
- [ ] `deleteStepType(stepTypeId)` 함수
- [ ] 유형 변경 시 평가표 섹션 표시/숨김 로직

---

### Phase 2: 2단계 - 워크플로우 조립 (2일)

#### A. Mock 데이터 구조 변경 (0.5일)
- [ ] `mockThesisStages` 구조 변경
  - [ ] `stepTypeId` 필드 추가
  - [ ] 기존 데이터 마이그레이션

#### B. 워크플로우 목록 화면 (0.5일)
- [ ] `admin_views.js` > `stageManagement()` 수정
  - [ ] `mockThesisStages` 사용으로 변경
  - [ ] 테이블 구조 유지

#### C. 워크플로우 편집 모달 (1일)
- [ ] `openWorkflowEditModal(workflowId)` 함수
- [ ] `renderWorkflowStagesList(workflowId)` 함수
- [ ] 단계 아이템 HTML 생성 (드롭다운)
- [ ] `addStageToWorkflow()` 함수
- [ ] `changeStageType(workflowId, stageOrder, stepTypeId)` 함수
- [ ] `deleteStageFromWorkflow(workflowId, stageOrder)` 함수
- [ ] `moveStageUp/Down()` 함수
- [ ] `saveWorkflow()` 함수

---

### Phase 3: 연동 및 테스트 (0.5일)

#### A. 학생 단계 관리와 연동 확인
- [ ] `mockStudentStageAssignments`에서 `thesisStageId` 참조 확인
- [ ] 논문 심사 단계 드롭다운에 신규 워크플로우 표시

#### B. 전체 테스트
- [ ] 단계 유형 등록/수정/삭제
- [ ] 워크플로우 조립/수정
- [ ] 동일 단계 유형 재사용 테스트
- [ ] UI/UX 최종 점검

---

## ⏱️ 예상 소요 시간: **4일**

| Phase | 작업 | 시간 |
|-------|------|------|
| 1 | 1단계: 단계 유형 등록 | 1.5일 |
| 2 | 2단계: 워크플로우 조립 | 2일 |
| 3 | 연동 및 테스트 | 0.5일 |
| **총계** | | **4일** |

---

## 🎨 UI/UX 개선사항

### 1. 명확한 구분
- 1단계 화면: "단계 유형 관리 (레고 블록)"
- 2단계 화면: "워크플로우 관리 (단계 조립)"
- 메뉴 위치 분리 (시스템설정 / 논문심사)

### 2. 직관적인 조립
- 드롭다운으로 등록된 단계 유형 선택
- 선택 시 자동으로 정보 표시 (유형, 평가 필요 여부)
- 같은 단계 유형을 여러 번 사용 가능

### 3. 일관된 디자인
- 기존 심사위원 배정 모달 스타일 재사용
- 카드 그리드는 기존 typeManagement 스타일 유지
- 알림 시스템 공통 사용

---

## 🔍 장점

### 1. 재사용성
- 한 번 등록한 단계 유형(예: 예비심사)을 여러 워크플로우에서 재사용
- 단계 유형 수정 시 모든 워크플로우에 자동 반영

### 2. 유연성
- 학과별, 학위별 맞춤 워크플로우 생성 가능
- 동일 단계 유형을 다른 순서/위치에 배치 가능

### 3. 유지보수성
- 단계 유형과 워크플로우 분리로 관리 용이
- 평가표 변경 시 단계 유형만 수정하면 됨

---

## 📝 참고사항

### IA 문서와의 일치도
- ✅ "세부 단계 등록" (본심사, 예비심사 등) → 단계 유형 관리
- ✅ "워크플로우 조립" → 워크플로우 관리
- ✅ "탭 형태" → 드롭다운 방식으로 변경 (UI 일관성)

### 기존 데이터 마이그레이션
- `mockThesisStages`의 기존 2개 템플릿 유지
- `stepTypeId` 필드만 추가
- 하위 호환성 보장

---

## 변경 이력
- 2025-12-09: 초안 작성 (2단계 구조 구현 방안)
