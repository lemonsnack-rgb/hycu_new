# 워크플로우 통합 화면 구현 방안 (수정안)

## 작성 일자
2025-12-09

## 요구사항

### 1. 워크플로우 등록과 단계 구성 통합
- 현재 2단계 (워크플로우 등록 → 단계 구성)를 **1개 화면**으로 병합
- **단계 없이는 저장 불가** (최소 1개 이상 단계 필수)

### 2. 단계 유형 관리 접근성
- 단계 유형 등록 기능이 존재하지만 메뉴에서 찾기 어려움
- 워크플로우 구성 화면에서 **즉시 접근** 가능해야 함

### 3. 평가표 매핑
- 심사 단계인 경우 **평가표 선택** 필수
- 워크플로우 구성 시 각 단계별로 평가표 연결

---

## 📋 현재 구조 분석

### 현재 문제점

1. **2단계 프로세스의 불편함**
   ```
   워크플로우 등록 → [저장] → 단계 구성 → [저장]
   ```
   - 중간에 저장이 필요해 사용자 혼란
   - 빈 워크플로우 생성 가능 (데이터 정합성 문제)

2. **단계 유형 관리 메뉴 위치**
   - 현재: "논문심사 > 심사 단계 등록"
   - 사용자가 워크플로우 구성 중 새 단계 추가하려면 메뉴 이동 필요

3. **평가표 매핑 누락**
   - 현재는 단계 유형에 평가표가 고정
   - 같은 단계라도 워크플로우마다 다른 평가표 사용 불가

---

## 🎯 제안 수정 방안

### A. 통합 화면 구조 (1개 페이지)

```
┌────────────────────────────────────────────────────────────────┐
│ ← 뒤로가기          워크플로우 등록                              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [상단] 워크플로우 기본 정보                                      │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ 워크플로우명: [논문작성1          ]  학위: ○석사 ○박사 ○공통 │  │
│ │ 설명: [2025년 1학기 논문 작성 과정                      ]  │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ [중단] 단계 구성 (2단 레이아웃)                                  │
│ ┌──────────────┬──────────────────────────────────────────┐  │
│ │ 단계 유형 목록│ 구성된 단계                                │  │
│ │              │                                           │  │
│ │ [+ 새 단계   │  1. 연구계획서 제출                        │  │
│ │    유형 추가]│     평가표: 없음            [↑][↓][편집][X]│  │
│ │              │                                           │  │
│ │ 🔍 검색      │  2. 본심사                                │  │
│ │ [제출]       │     평가표: 학위논문 심사 평가표             │  │
│ │ □ 연구계획서 │                            [↑][↓][편집][X]│  │
│ │ □ 1차 보고서 │                                           │  │
│ │              │  + 좌측에서 단계를 클릭하여 추가            │  │
│ │ [심사]       │                                           │  │
│ │ □ 예비심사   │                                           │  │
│ │ □ 본심사     │                                           │  │
│ └──────────────┴──────────────────────────────────────────┘  │
│                                                                 │
│ [하단] 버튼                                                     │
│ [저장 (3개 단계)]  [취소]                                       │
│                                                                 │
│ ⚠️ 최소 1개 이상의 단계를 구성해야 저장할 수 있습니다.            │
└────────────────────────────────────────────────────────────────┘
```

---

## 📐 상세 설계

### 1. 통합 화면 레이아웃

#### 구성 요소

**[상단] 워크플로우 기본 정보**
- 워크플로우명 (필수)
- 학위 유형 (필수): 석사/박사/공통
- 설명 (선택)

**[중단 좌측] 단계 유형 목록**
- 검색 필터
- 제출 유형 목록
- 심사 유형 목록
- **[+ 새 단계 유형 추가]** 버튼 (⭐ 신규)
  - 클릭 시 모달로 단계 유형 등록
  - 등록 후 즉시 목록에 추가

**[중단 우측] 구성된 단계**
- 추가된 단계 목록
- 각 단계별:
  - 단계명
  - 평가표 선택 (심사 단계만) (⭐ 신규)
  - 순서 변경 (↑↓)
  - 편집 버튼 (⭐ 신규)
  - 삭제 버튼

**[하단] 저장 버튼**
- 단계 개수 표시
- 최소 1개 이상 단계가 있어야 활성화

---

### 2. 단계 추가 시 평가표 선택 플로우

#### Case 1: 제출 유형 단계 추가
```
좌측에서 "연구계획서 제출" 클릭
    ↓
우측에 즉시 추가
    - 평가표: 없음 (제출 단계는 평가 불필요)
```

#### Case 2: 심사 유형 단계 추가
```
좌측에서 "본심사" 클릭
    ↓
모달 열림: "평가표 선택 (필수)"
    ┌─────────────────────────────┐
    │ 평가표 선택                  │
    │                             │
    │ ○ 학위 논문 심사 평가표       │
    │ ○ 예비 심사 평가표           │
    │ ○ 연구제안서 심사 평가표      │
    │                             │
    │ [추가]  [취소]               │
    └─────────────────────────────┘
    ↓
[추가] 클릭
    ↓
우측에 단계 추가
    - 단계명: 본심사
    - 평가표: 학위 논문 심사 평가표
```

---

### 3. 단계 편집 기능

구성된 단계의 [편집] 버튼 클릭 시:

#### 제출 단계 편집
```
모달 열림:
┌─────────────────────────────┐
│ 단계 편집                    │
│                             │
│ 단계명: [연구계획서 제출]     │
│                             │
│ ℹ️ 제출 단계는 평가표가       │
│    필요하지 않습니다.         │
│                             │
│ [저장]  [취소]               │
└─────────────────────────────┘
```

#### 심사 단계 편집
```
모달 열림:
┌─────────────────────────────┐
│ 단계 편집                    │
│                             │
│ 단계명: [본심사]             │
│                             │
│ 평가표 선택 *                │
│ ○ 학위 논문 심사 평가표 ✓    │
│ ○ 예비 심사 평가표           │
│ ○ 연구제안서 심사 평가표      │
│                             │
│ [저장]  [취소]               │
└─────────────────────────────┘
```

---

### 4. 새 단계 유형 추가 버튼

좌측 단계 목록 상단에 버튼 추가:

```
┌──────────────────────────┐
│ 단계 유형 목록            │
│                          │
│ [+ 새 단계 유형 추가]     │ ← 이 버튼 클릭
│                          │
│ 🔍 검색                  │
│ ...                      │
└──────────────────────────┘
```

클릭 시 모달 열림:
```
┌─────────────────────────────────────────┐
│ 새 단계 유형 추가                        │
│                                         │
│ 단계명 *                                │
│ [                    ]                  │
│                                         │
│ 유형 *                                  │
│ ○ 제출    ○ 심사                        │
│                                         │
│ [심사 선택 시만 표시]                    │
│ 기본 평가표 (선택)                       │
│ [선택하세요         ▼]                  │
│                                         │
│ 요구사항                                │
│ ☑ 문서 제출 필요                        │
│ ☑ 발표 필요                             │
│                                         │
│ 설명 (선택)                             │
│ [                                   ]   │
│                                         │
│ [저장]  [취소]                          │
└─────────────────────────────────────────┘
```

저장 후:
- mockStepTypes에 추가
- 좌측 목록에 즉시 표시
- 방금 추가한 단계 강조 (3초간 하이라이트)

---

## 🔧 구현 파일 수정

### 1. admin_views.js - 통합 페이지 생성

```javascript
// ========== 워크플로우 등록/단계 구성 통합 페이지 ==========
workflowCreateUnified: (id = null) => {
    const isEdit = id !== null;
    const item = isEdit ? mockThesisStages.find(s => s.id === id) : {};

    // 전역 변수 초기화
    window.currentWorkflow = isEdit ? item : { stages: [] };
    window.composedStages = isEdit && item.stages ? JSON.parse(JSON.stringify(item.stages)) : [];

    return `
        <div class="h-full flex flex-col">
            <!-- 헤더 -->
            <div class="bg-white border-b px-6 py-4 shadow-sm">
                <div class="flex items-center">
                    <button onclick="switchView('stageManagement')"
                            class="text-gray-600 hover:text-gray-800 mr-4">
                        ← 뒤로가기
                    </button>
                    <h2 class="text-2xl font-bold text-gray-800">
                        ${isEdit ? '워크플로우 수정' : '워크플로우 등록'}
                    </h2>
                </div>
            </div>

            <!-- 상단: 기본 정보 -->
            <div class="bg-white px-6 py-4 border-b">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-12 gap-4">
                        <!-- 워크플로우명 -->
                        <div class="col-span-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                워크플로우명 <span class="text-red-600">*</span>
                            </label>
                            <input type="text" id="workflow-name"
                                   value="${item.name || ''}"
                                   placeholder="예: 논문작성1, 석사 표준 과정"
                                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        </div>

                        <!-- 학위 유형 -->
                        <div class="col-span-3">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학위 유형 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="degree-type" value="master"
                                           ${!item.degreeType || item.degreeType === 'master' ? 'checked' : ''}>
                                    <span class="ml-2 text-sm">석사</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="degree-type" value="phd"
                                           ${item.degreeType === 'phd' ? 'checked' : ''}>
                                    <span class="ml-2 text-sm">박사</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="degree-type" value="common"
                                           ${item.degreeType === 'common' ? 'checked' : ''}>
                                    <span class="ml-2 text-sm">공통</span>
                                </label>
                            </div>
                        </div>

                        <!-- 설명 -->
                        <div class="col-span-3">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                설명 (선택)
                            </label>
                            <input type="text" id="workflow-description"
                                   value="${item.description || ''}"
                                   placeholder="설명 입력"
                                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        </div>
                    </div>
                </div>
            </div>

            <!-- 중단: 단계 구성 (2단 레이아웃) -->
            <div class="flex-1 flex overflow-hidden">
                <!-- 좌측: 단계 유형 목록 -->
                <div class="w-1/3 bg-gray-50 border-r overflow-y-auto">
                    <div class="p-4">
                        <h3 class="font-bold text-gray-800 mb-3">단계 유형 목록</h3>

                        <!-- 새 단계 유형 추가 버튼 -->
                        <button onclick="openStepTypeModal()"
                                class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm mb-4">
                            + 새 단계 유형 추가
                        </button>

                        <!-- 검색 -->
                        <input type="text" id="step-type-search"
                               placeholder="단계 검색..."
                               onkeyup="filterStepTypes()"
                               class="w-full border rounded-md px-3 py-2 text-sm mb-4">

                        <!-- 단계 목록 (제출/심사) -->
                        ${renderStepTypeList()}
                    </div>
                </div>

                <!-- 우측: 구성된 단계 -->
                <div class="flex-1 overflow-y-auto">
                    <div class="p-6">
                        <h3 class="font-bold text-gray-800 mb-4">
                            구성된 단계
                            <span class="text-sm font-normal text-gray-500" id="stage-count">
                                (${window.composedStages.length}개)
                            </span>
                        </h3>

                        <div id="composed-stages-list" class="space-y-3">
                            ${renderComposedStagesUnified()}
                        </div>

                        ${window.composedStages.length === 0 ? `
                            <div class="text-center py-16 text-gray-400">
                                <p class="text-lg font-medium mb-1">단계를 추가하세요</p>
                                <p class="text-sm">좌측에서 단계 유형을 클릭하면 추가됩니다</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- 하단: 저장 버튼 -->
            <div class="bg-white border-t px-6 py-4 flex items-center justify-between">
                <div>
                    ${window.composedStages.length === 0 ? `
                        <p class="text-sm text-red-600">
                            ⚠️ 최소 1개 이상의 단계를 구성해야 저장할 수 있습니다.
                        </p>
                    ` : `
                        <p class="text-sm text-gray-600">
                            ✓ ${window.composedStages.length}개 단계가 구성되었습니다.
                        </p>
                    `}
                </div>
                <div class="flex gap-3">
                    <button onclick="saveUnifiedWorkflow('${id || ''}')"
                            ${window.composedStages.length === 0 ? 'disabled' : ''}
                            class="bg-[#009DE8] text-white px-6 py-2 rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                        저장 ${window.composedStages.length > 0 ? `(${window.composedStages.length}개 단계)` : ''}
                    </button>
                    <button onclick="switchView('stageManagement')"
                            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400">
                        취소
                    </button>
                </div>
            </div>
        </div>
    `;
}
```

---

### 2. admin_modals.js - 새 함수 추가

```javascript
/**
 * 심사 단계 추가 시 평가표 선택 모달
 */
function addStageWithEvaluationTemplate(stepTypeId) {
    const stepType = mockStepTypes.find(st => st.id === stepTypeId);
    if (!stepType) return;

    // 제출 단계는 바로 추가
    if (stepType.type === 'submission') {
        window.composedStages.push({
            stepTypeId: stepType.id,
            name: stepType.name,
            type: stepType.type,
            evaluationRequired: false,
            evaluationTemplateId: null
        });
        refreshComposedStages();
        return;
    }

    // 심사 단계는 평가표 선택 모달
    const content = `
        <div class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p class="text-sm text-blue-700">
                    <strong>${stepType.name}</strong>는 심사 단계입니다.
                    평가표를 선택해주세요.
                </p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    평가표 선택 <span class="text-red-600">*</span>
                </label>
                <div class="space-y-2">
                    ${mockEvaluationTemplates.map(template => `
                        <label class="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="evaluation-template" value="${template.id}"
                                   ${stepType.evaluationTemplateId === template.id ? 'checked' : ''}
                                   class="h-4 w-4 text-[#009DE8]">
                            <span class="ml-3 text-sm font-medium">${template.name}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    openModal('평가표 선택', content, '추가', () => {
        const selectedTemplate = document.querySelector('input[name="evaluation-template"]:checked');
        if (!selectedTemplate) {
            showAlert('평가표를 선택해주세요.');
            return;
        }

        window.composedStages.push({
            stepTypeId: stepType.id,
            name: stepType.name,
            type: stepType.type,
            evaluationRequired: true,
            evaluationTemplateId: selectedTemplate.value
        });

        closeModal();
        refreshComposedStages();
    });
}

/**
 * 단계 편집 모달
 */
function editStageInComposition(index) {
    const stage = window.composedStages[index];
    const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);

    if (stepType.type === 'submission') {
        showAlert('제출 단계는 편집할 내용이 없습니다.');
        return;
    }

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    단계명
                </label>
                <input type="text" value="${stage.name}" disabled
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    평가표 선택 <span class="text-red-600">*</span>
                </label>
                <div class="space-y-2">
                    ${mockEvaluationTemplates.map(template => `
                        <label class="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="evaluation-template-edit" value="${template.id}"
                                   ${stage.evaluationTemplateId === template.id ? 'checked' : ''}
                                   class="h-4 w-4 text-[#009DE8]">
                            <span class="ml-3 text-sm font-medium">${template.name}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    openModal('단계 편집', content, '저장', () => {
        const selectedTemplate = document.querySelector('input[name="evaluation-template-edit"]:checked');
        if (!selectedTemplate) {
            showAlert('평가표를 선택해주세요.');
            return;
        }

        window.composedStages[index].evaluationTemplateId = selectedTemplate.value;
        closeModal();
        refreshComposedStages();
    });
}

/**
 * 통합 워크플로우 저장
 */
function saveUnifiedWorkflow(workflowId) {
    const name = document.getElementById('workflow-name').value.trim();
    const degreeType = document.querySelector('input[name="degree-type"]:checked').value;
    const description = document.getElementById('workflow-description').value.trim();

    // 검증
    if (!name) {
        showAlert('워크플로우명을 입력해주세요.');
        return;
    }

    if (!window.composedStages || window.composedStages.length === 0) {
        showAlert('최소 1개 이상의 단계를 추가해주세요.');
        return;
    }

    // 심사 단계 평가표 검증
    const reviewStagesWithoutTemplate = window.composedStages.filter(
        s => s.evaluationRequired && !s.evaluationTemplateId
    );
    if (reviewStagesWithoutTemplate.length > 0) {
        showAlert('모든 심사 단계에 평가표가 선택되어야 합니다.');
        return;
    }

    const isEdit = workflowId !== '';

    if (isEdit) {
        const workflow = mockThesisStages.find(w => w.id === workflowId);
        workflow.name = name;
        workflow.degreeType = degreeType;
        workflow.description = description;
        workflow.stages = window.composedStages.map((stage, idx) => ({
            ...stage,
            order: idx + 1
        }));
        workflow.stageCount = workflow.stages.length;
    } else {
        const newWorkflow = {
            id: 'TS' + String(mockThesisStages.length + 1).padStart(3, '0'),
            name: name,
            degreeType: degreeType,
            description: description,
            stageCount: window.composedStages.length,
            createdDate: new Date().toISOString().split('T')[0],
            stages: window.composedStages.map((stage, idx) => ({
                ...stage,
                order: idx + 1
            }))
        };
        mockThesisStages.push(newWorkflow);
    }

    showAlert(`워크플로우 "${name}"이(가) ${window.composedStages.length}개 단계로 저장되었습니다.`);
    switchView('stageManagement');
}

/**
 * 구성된 단계 새로고침
 */
function refreshComposedStages() {
    document.getElementById('composed-stages-list').innerHTML = renderComposedStagesUnified();
    document.getElementById('stage-count').textContent = `(${window.composedStages.length}개)`;

    // 저장 버튼 상태 업데이트
    const saveBtn = document.querySelector('button[onclick^="saveUnifiedWorkflow"]');
    if (saveBtn) {
        if (window.composedStages.length > 0) {
            saveBtn.disabled = false;
            saveBtn.textContent = `저장 (${window.composedStages.length}개 단계)`;
        } else {
            saveBtn.disabled = true;
            saveBtn.textContent = '저장';
        }
    }
}

/**
 * 구성된 단계 렌더링 (평가표 포함)
 */
function renderComposedStagesUnified() {
    if (!window.composedStages || window.composedStages.length === 0) return '';

    return window.composedStages.map((stage, idx) => {
        const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
        const evalTemplate = stage.evaluationTemplateId ?
            mockEvaluationTemplates.find(t => t.id === stage.evaluationTemplateId) : null;

        return `
            <div class="flex items-center gap-3 p-4 bg-white border rounded-lg">
                <span class="font-bold text-gray-600 text-lg w-8">${idx + 1}.</span>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-medium text-gray-800">${stage.name}</span>
                        <span class="px-2 py-0.5 rounded text-xs ${
                            stage.type === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }">
                            ${stage.type === 'submission' ? '제출' : '심사'}
                        </span>
                    </div>
                    ${evalTemplate ? `
                        <p class="text-xs text-gray-600">
                            📋 평가표: ${evalTemplate.name}
                        </p>
                    ` : ''}
                </div>
                <div class="flex gap-2">
                    ${idx > 0 ? `<button onclick="moveStageInComposition(${idx}, 'up')" class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border">↑</button>` : ''}
                    ${idx < window.composedStages.length - 1 ? `<button onclick="moveStageInComposition(${idx}, 'down')" class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border">↓</button>` : ''}
                    ${stage.evaluationRequired ? `<button onclick="editStageInComposition(${idx})" class="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded border">편집</button>` : ''}
                    <button onclick="removeStageFromComposition(${idx})" class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded border">삭제</button>
                </div>
            </div>
        `;
    }).join('');
}
```

---

## 📊 변경 요약

### 변경 전 (2단계)
```
1. 워크플로우 등록 → 저장
2. 단계 구성 → 저장
```

### 변경 후 (1단계)
```
1. 워크플로우 등록 + 단계 구성 → 저장 (1번만)
```

### 추가 기능
1. ✅ **통합 화면**: 기본 정보 + 단계 구성 한 페이지
2. ✅ **단계 필수**: 최소 1개 이상 단계 없으면 저장 불가
3. ✅ **빠른 단계 유형 추가**: 좌측 상단 버튼으로 즉시 추가
4. ✅ **평가표 매핑**: 심사 단계 추가/편집 시 평가표 선택
5. ✅ **단계 편집**: 구성된 단계의 평가표 변경 가능

---

## 🎯 구현 순서

1. ✅ admin_views.js에 `workflowCreateUnified()` 추가
2. ✅ admin_modals.js에 새 함수 5개 추가
3. ✅ stageManagement 버튼 `workflowCreateUnified` 연결
4. ✅ switchView에 `workflowCreateUnified` 케이스 추가
5. ✅ 테스트

---

## ⏱️ 예상 시간

- **통합 페이지 구현**: 3시간
- **평가표 선택 모달**: 1시간
- **단계 편집 기능**: 1시간
- **테스트 및 버그 수정**: 1시간

**총 예상 시간**: 6시간

---

이 방안대로 구현하시겠습니까?
