# 워크플로우 통합 화면 구현 방안 (최종안)

## 작성 일자
2025-12-09

## 최종 요구사항

### 1. 워크플로우 등록과 단계 구성 통합
- 1개 화면에서 모든 작업 완료
- 단계 없이는 저장 불가

### 2. 단계 유형 추가 버튼
- 좌측 목록 상단에 **[+ 새 단계 유형 추가]** 버튼
- 클릭 시 단계 유형 등록 모달
- 저장 후 즉시 목록에 표시

### 3. 단계 이름 커스터마이징 ⭐ 신규
- **단계 유형**: "본심사" (재사용 가능한 템플릿)
- **단계 이름**: "1차 본심사", "2차 본심사" (워크플로우마다 다름)
- 구성된 단계의 이름 수정 가능

### 4. 평가표 매핑
- 심사 단계 추가/편집 시 평가표 선택

---

## 📋 핵심 개념: 단계 유형 vs 단계 이름

### 단계 유형 (Step Type)
- **정의**: 재사용 가능한 단계 템플릿
- **예시**: "본심사", "예비심사", "연구계획서 제출"
- **속성**: 유형(제출/심사), 요구사항, 기본 평가표
- **관리**: 좌측 목록에서 관리, 여러 워크플로우에서 재사용

### 단계 이름 (Stage Name)
- **정의**: 워크플로우 내 실제 단계 이름
- **예시**:
  - 단계 유형: "본심사" → 단계 이름: "1차 본심사"
  - 단계 유형: "본심사" → 단계 이름: "2차 본심사"
  - 단계 유형: "예비심사" → 단계 이름: "중간 예비심사"
- **속성**: 이름, 평가표 (워크플로우마다 다를 수 있음)
- **관리**: 우측 구성 영역에서 개별 수정

---

## 📐 화면 설계

### 통합 화면 레이아웃

```
┌────────────────────────────────────────────────────────────────────┐
│ ← 뒤로가기          워크플로우 등록                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ [상단] 워크플로우 기본 정보                                          │
│ ┌──────────────────────────────────────────────────────────────┐  │
│ │ 워크플로우명: [논문작성1    ]  학위: ○석사 ○박사  설명: [...]  │  │
│ └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│ [중단] 단계 구성 (2단 레이아웃)                                      │
│ ┌──────────────────┬──────────────────────────────────────────┐  │
│ │ 단계 유형 목록    │ 구성된 단계                               │  │
│ │                  │                                           │  │
│ │ [+ 새 단계 유형  │  1. 연구계획서 제출                        │  │
│ │    추가]         │     (유형: 연구계획서 제출)                │  │
│ │                  │     [↑][↓][편집][X]                       │  │
│ │ 🔍 검색          │                                           │  │
│ │                  │  2. 1차 본심사 ⭐                         │  │
│ │ [제출]           │     (유형: 본심사)                        │  │
│ │ ☐ 연구계획서 제출│     평가표: 학위논문 심사 평가표           │  │
│ │ ☐ 1차 보고서     │     [↑][↓][편집][X]                       │  │
│ │                  │                                           │  │
│ │ [심사]           │  3. 최종 본심사 ⭐                         │  │
│ │ ☐ 예비심사       │     (유형: 본심사)                        │  │
│ │ ☐ 본심사         │     평가표: 최종논문 심사 평가표           │  │
│ │                  │     [↑][↓][편집][X]                       │  │
│ └──────────────────┴──────────────────────────────────────────┘  │
│                                                                     │
│ [하단] 버튼                                                         │
│ ⚠️ 최소 1개 이상의 단계를 구성해야 저장할 수 있습니다.                │
│ [저장 (3개 단계)]  [취소]                                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 상세 플로우

### 1. 단계 추가 플로우

#### Case 1: 제출 단계 추가
```
좌측에서 "연구계획서 제출" 클릭
    ↓
모달 열림: "단계 추가"
┌─────────────────────────────┐
│ 단계 이름 입력               │
│ [연구계획서 제출         ] │
│                             │
│ ℹ️ 기본값: 연구계획서 제출   │
│   (수정 가능)               │
│                             │
│ [추가]  [취소]               │
└─────────────────────────────┘
    ↓
우측에 추가:
  1. 연구계획서 제출
     (유형: 연구계획서 제출)
```

#### Case 2: 심사 단계 추가 (평가표 필요)
```
좌측에서 "본심사" 클릭
    ↓
모달 열림: "단계 추가"
┌─────────────────────────────┐
│ 단계 이름 입력 *             │
│ [본심사                  ] │
│                             │
│ 💡 팁: "1차 본심사", "최종  │
│    본심사" 등으로 구분할 수  │
│    있습니다.                │
│                             │
│ 평가표 선택 *               │
│ ○ 학위 논문 심사 평가표      │
│ ○ 예비 심사 평가표          │
│ ○ 연구제안서 심사 평가표     │
│                             │
│ [추가]  [취소]               │
└─────────────────────────────┘
    ↓
우측에 추가:
  1. 본심사
     (유형: 본심사)
     평가표: 학위 논문 심사 평가표
```

**같은 유형 재사용 예시:**
```
"본심사" 클릭 → 모달에서 "1차 본심사" 입력
"본심사" 클릭 → 모달에서 "2차 본심사" 입력
"본심사" 클릭 → 모달에서 "최종 본심사" 입력

결과:
  1. 1차 본심사 (유형: 본심사)
  2. 2차 본심사 (유형: 본심사)
  3. 최종 본심사 (유형: 본심사)
```

---

### 2. 단계 편집 플로우

구성된 단계의 [편집] 버튼 클릭:

```
모달 열림: "단계 편집"
┌─────────────────────────────┐
│ 단계 이름 *                  │
│ [1차 본심사              ] │
│                             │
│ 단계 유형                   │
│ 본심사 (변경 불가)          │
│                             │
│ 평가표 선택 * (심사만)       │
│ ○ 학위 논문 심사 평가표 ✓   │
│ ○ 예비 심사 평가표          │
│ ○ 연구제안서 심사 평가표     │
│                             │
│ [저장]  [취소]               │
└─────────────────────────────┘
```

---

### 3. 새 단계 유형 추가 플로우

좌측 상단 **[+ 새 단계 유형 추가]** 클릭:

```
모달 열림: 기존 openStepTypeModal() 사용
┌─────────────────────────────────────────┐
│ 새 단계 유형 추가                        │
│                                         │
│ 단계명 *                                │
│ [중간 심사                          ]   │
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
    ↓
mockStepTypes에 추가
    ↓
좌측 목록에 즉시 표시 (3초간 하이라이트)
```

---

## 💾 데이터 구조

### mockStepTypes (단계 유형 - 템플릿)
```javascript
{
    id: 'ST003',
    name: '본심사',  // ← 유형명
    type: 'review',
    requiresDocument: true,
    requiresPresentation: true,
    evaluationTemplateId: 'EVAL002',  // 기본 평가표 (참고용)
    description: '최종 논문에 대한 본심사 진행'
}
```

### mockThesisStages (워크플로우)
```javascript
{
    id: 'TS001',
    name: '석사 표준 과정',
    degreeType: 'master',
    stages: [
        {
            order: 1,
            stepTypeId: 'ST003',  // ← 단계 유형 참조
            name: '1차 본심사',   // ← 커스텀 이름 ⭐
            type: 'review',
            evaluationRequired: true,
            evaluationTemplateId: 'EVAL002'  // ← 워크플로우별 평가표 ⭐
        },
        {
            order: 2,
            stepTypeId: 'ST003',  // ← 같은 유형 재사용
            name: '최종 본심사',  // ← 다른 이름 ⭐
            type: 'review',
            evaluationRequired: true,
            evaluationTemplateId: 'EVAL003'  // ← 다른 평가표 ⭐
        }
    ]
}
```

---

## 🔧 구현 코드

### 1. admin_views.js - 통합 페이지

```javascript
workflowCreateUnified: (id = null) => {
    const isEdit = id !== null;
    const item = isEdit ? mockThesisStages.find(s => s.id === id) : {};

    window.currentWorkflow = isEdit ? item : { stages: [] };
    window.composedStages = isEdit && item.stages ?
        JSON.parse(JSON.stringify(item.stages)) : [];

    return `
        <div class="h-full flex flex-col">
            <!-- 헤더 -->
            <div class="bg-white border-b px-6 py-4">
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
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-5">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            워크플로우명 <span class="text-red-600">*</span>
                        </label>
                        <input type="text" id="workflow-name"
                               value="${item.name || ''}"
                               placeholder="예: 논문작성1, 석사 표준 과정"
                               class="w-full border rounded-md px-3 py-2 text-sm">
                    </div>
                    <div class="col-span-4">
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
                    <div class="col-span-3">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            설명 (선택)
                        </label>
                        <input type="text" id="workflow-description"
                               value="${item.description || ''}"
                               placeholder="설명 입력"
                               class="w-full border rounded-md px-3 py-2 text-sm">
                    </div>
                </div>
            </div>

            <!-- 중단: 2단 레이아웃 -->
            <div class="flex-1 flex overflow-hidden">
                <!-- 좌측: 단계 유형 목록 -->
                <div class="w-1/3 bg-gray-50 border-r overflow-y-auto">
                    <div class="p-4">
                        <h3 class="font-bold text-gray-800 mb-3">단계 유형 목록</h3>

                        <!-- ⭐ 새 단계 유형 추가 버튼 -->
                        <button onclick="openStepTypeModal()"
                                class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm mb-4 flex items-center justify-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            새 단계 유형 추가
                        </button>

                        <!-- 검색 -->
                        <input type="text" id="step-type-search"
                               placeholder="단계 검색..."
                               onkeyup="filterStepTypesUnified()"
                               class="w-full border rounded-md px-3 py-2 text-sm mb-4">

                        <!-- 제출 유형 -->
                        <div class="mb-4">
                            <p class="text-xs font-semibold text-gray-500 uppercase mb-2">제출</p>
                            <div class="space-y-2" id="submission-types">
                                ${mockStepTypes.filter(st => st.type === 'submission').map(st => `
                                    <div class="step-type-item bg-white border rounded-md p-3 hover:bg-blue-50 cursor-pointer"
                                         data-step-id="${st.id}"
                                         data-step-name="${st.name.toLowerCase()}"
                                         onclick="openAddStageModal('${st.id}')">
                                        <p class="font-medium text-sm">${st.name}</p>
                                        ${st.description ? `<p class="text-xs text-gray-500 mt-1">${st.description}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 심사 유형 -->
                        <div>
                            <p class="text-xs font-semibold text-gray-500 uppercase mb-2">심사</p>
                            <div class="space-y-2" id="review-types">
                                ${mockStepTypes.filter(st => st.type === 'review').map(st => `
                                    <div class="step-type-item bg-white border rounded-md p-3 hover:bg-purple-50 cursor-pointer"
                                         data-step-id="${st.id}"
                                         data-step-name="${st.name.toLowerCase()}"
                                         onclick="openAddStageModal('${st.id}')">
                                        <p class="font-medium text-sm">${st.name}</p>
                                        ${st.description ? `<p class="text-xs text-gray-500 mt-1">${st.description}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 우측: 구성된 단계 -->
                <div class="flex-1 overflow-y-auto">
                    <div class="p-6">
                        <h3 class="font-bold text-gray-800 mb-4">
                            구성된 단계
                            <span class="text-sm font-normal text-gray-500" id="stage-count-unified">
                                (${window.composedStages.length}개)
                            </span>
                        </h3>

                        <div id="composed-stages-list-unified" class="space-y-3">
                            ${renderComposedStagesUnified()}
                        </div>

                        ${window.composedStages.length === 0 ? `
                            <div class="text-center py-16 text-gray-400">
                                <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <p class="text-lg font-medium mb-1">단계를 추가하세요</p>
                                <p class="text-sm">좌측에서 단계 유형을 클릭하면 추가됩니다</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- 하단: 저장 버튼 -->
            <div class="bg-white border-t px-6 py-4 flex justify-between">
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
                            id="save-workflow-btn"
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

### 2. admin_modals.js - 핵심 함수

```javascript
/**
 * ⭐ 단계 추가 모달 (이름 커스터마이징 + 평가표 선택)
 */
function openAddStageModal(stepTypeId) {
    const stepType = mockStepTypes.find(st => st.id === stepTypeId);
    if (!stepType) return;

    const isReview = stepType.type === 'review';

    const content = `
        <div class="space-y-4">
            <!-- 단계 이름 입력 -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    단계 이름 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="stage-custom-name"
                       value="${stepType.name}"
                       placeholder="예: 1차 본심사, 최종 본심사"
                       class="w-full border rounded-md px-3 py-2 text-sm">
                <p class="text-xs text-gray-500 mt-1">
                    기본값: ${stepType.name} (수정 가능)
                </p>
            </div>

            <!-- 단계 유형 표시 (읽기 전용) -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    단계 유형
                </label>
                <div class="bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-600">
                    ${stepType.name} (${stepType.type === 'submission' ? '제출' : '심사'})
                </div>
            </div>

            ${isReview ? `
                <!-- 평가표 선택 (심사만) -->
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
                                <span class="ml-3 text-sm">${template.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p class="text-sm text-blue-700">
                    💡 <strong>팁:</strong> 같은 단계 유형을 여러 번 추가하고 각각 다른 이름을 지정할 수 있습니다.
                    ${isReview ? '평가표도 각각 다르게 설정할 수 있습니다.' : ''}
                </p>
            </div>
        </div>
    `;

    openModal('단계 추가', content, '추가', () => {
        const customName = document.getElementById('stage-custom-name').value.trim();

        if (!customName) {
            showAlert('단계 이름을 입력해주세요.');
            return;
        }

        let evaluationTemplateId = null;
        if (isReview) {
            const selected = document.querySelector('input[name="evaluation-template"]:checked');
            if (!selected) {
                showAlert('평가표를 선택해주세요.');
                return;
            }
            evaluationTemplateId = selected.value;
        }

        if (!window.composedStages) {
            window.composedStages = [];
        }

        window.composedStages.push({
            stepTypeId: stepType.id,
            name: customName,  // ⭐ 커스텀 이름
            type: stepType.type,
            evaluationRequired: isReview,
            evaluationTemplateId: evaluationTemplateId
        });

        closeModal();
        refreshComposedStagesUnified();
    });
}

/**
 * ⭐ 단계 편집 모달 (이름 + 평가표 수정)
 */
function editStageUnified(index) {
    const stage = window.composedStages[index];
    const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);

    const isReview = stage.type === 'review';

    const content = `
        <div class="space-y-4">
            <!-- 단계 이름 수정 -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    단계 이름 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="stage-edit-name"
                       value="${stage.name}"
                       placeholder="예: 1차 본심사, 최종 본심사"
                       class="w-full border rounded-md px-3 py-2 text-sm">
            </div>

            <!-- 단계 유형 표시 (읽기 전용) -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    단계 유형
                </label>
                <div class="bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-600">
                    ${stepType.name} (${stepType.type === 'submission' ? '제출' : '심사'})
                </div>
            </div>

            ${isReview ? `
                <!-- 평가표 수정 (심사만) -->
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
                                <span class="ml-3 text-sm">${template.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    openModal('단계 편집', content, '저장', () => {
        const editedName = document.getElementById('stage-edit-name').value.trim();

        if (!editedName) {
            showAlert('단계 이름을 입력해주세요.');
            return;
        }

        let evaluationTemplateId = stage.evaluationTemplateId;
        if (isReview) {
            const selected = document.querySelector('input[name="evaluation-template-edit"]:checked');
            if (!selected) {
                showAlert('평가표를 선택해주세요.');
                return;
            }
            evaluationTemplateId = selected.value;
        }

        window.composedStages[index].name = editedName;  // ⭐ 이름 수정
        window.composedStages[index].evaluationTemplateId = evaluationTemplateId;

        closeModal();
        refreshComposedStagesUnified();
    });
}

/**
 * ⭐ 구성된 단계 렌더링 (커스텀 이름 + 평가표 표시)
 */
function renderComposedStagesUnified() {
    if (!window.composedStages || window.composedStages.length === 0) return '';

    return window.composedStages.map((stage, idx) => {
        const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
        const evalTemplate = stage.evaluationTemplateId ?
            mockEvaluationTemplates.find(t => t.id === stage.evaluationTemplateId) : null;

        return `
            <div class="flex items-start gap-3 p-4 bg-white border rounded-lg hover:border-gray-300">
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
                    <p class="text-xs text-gray-500">유형: ${stepType.name}</p>
                    ${evalTemplate ? `
                        <p class="text-xs text-gray-600 mt-1">
                            📋 평가표: ${evalTemplate.name}
                        </p>
                    ` : ''}
                </div>
                <div class="flex gap-2">
                    ${idx > 0 ? `
                        <button onclick="moveStageInCompositionUnified(${idx}, 'up')"
                                class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border">
                            ↑
                        </button>
                    ` : ''}
                    ${idx < window.composedStages.length - 1 ? `
                        <button onclick="moveStageInCompositionUnified(${idx}, 'down')"
                                class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border">
                            ↓
                        </button>
                    ` : ''}
                    <button onclick="editStageUnified(${idx})"
                            class="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded border">
                        편집
                    </button>
                    <button onclick="removeStageFromCompositionUnified(${idx})"
                            class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded border">
                        삭제
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * ⭐ 구성된 단계 새로고침
 */
function refreshComposedStagesUnified() {
    document.getElementById('composed-stages-list-unified').innerHTML = renderComposedStagesUnified();
    document.getElementById('stage-count-unified').textContent = `(${window.composedStages.length}개)`;

    // 저장 버튼 상태 업데이트
    const saveBtn = document.getElementById('save-workflow-btn');
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
 * ⭐ 통합 워크플로우 저장
 */
function saveUnifiedWorkflow(workflowId) {
    const name = document.getElementById('workflow-name').value.trim();
    const degreeType = document.querySelector('input[name="degree-type"]:checked').value;
    const description = document.getElementById('workflow-description').value.trim();

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
        mockThesisStages.push({
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
        });
    }

    showAlert(`워크플로우 "${name}"이(가) ${window.composedStages.length}개 단계로 저장되었습니다.`);
    switchView('stageManagement');
}

// 기타 유틸 함수들
function moveStageInCompositionUnified(index, direction) {
    if (direction === 'up' && index > 0) {
        [window.composedStages[index - 1], window.composedStages[index]] =
        [window.composedStages[index], window.composedStages[index - 1]];
    } else if (direction === 'down' && index < window.composedStages.length - 1) {
        [window.composedStages[index], window.composedStages[index + 1]] =
        [window.composedStages[index + 1], window.composedStages[index]];
    }
    refreshComposedStagesUnified();
}

function removeStageFromCompositionUnified(index) {
    window.composedStages.splice(index, 1);
    refreshComposedStagesUnified();
}

function filterStepTypesUnified() {
    const searchTerm = document.getElementById('step-type-search').value.toLowerCase();
    const items = document.querySelectorAll('.step-type-item');

    items.forEach(item => {
        const stepName = item.getAttribute('data-step-name') || '';
        item.style.display = stepName.includes(searchTerm) ? '' : 'none';
    });
}

// 전역 노출
window.openAddStageModal = openAddStageModal;
window.editStageUnified = editStageUnified;
window.saveUnifiedWorkflow = saveUnifiedWorkflow;
window.refreshComposedStagesUnified = refreshComposedStagesUnified;
window.renderComposedStagesUnified = renderComposedStagesUnified;
window.moveStageInCompositionUnified = moveStageInCompositionUnified;
window.removeStageFromCompositionUnified = removeStageFromCompositionUnified;
window.filterStepTypesUnified = filterStepTypesUnified;
```

---

## 📊 최종 요약

### 핵심 변경사항

1. ✅ **통합 화면**: 1개 페이지에서 모든 작업
2. ✅ **단계 유형 추가 버튼**: 좌측 상단에 배치
3. ✅ **단계 이름 커스터마이징**: "본심사" → "1차 본심사", "최종 본심사"
4. ✅ **평가표 매핑**: 각 단계별 개별 설정
5. ✅ **단계 편집**: 이름 + 평가표 수정 가능
6. ✅ **저장 필수**: 최소 1개 단계 필요

### 사용 예시

```
워크플로우: "박사 표준 과정"

단계 구성:
1. 연구계획서 제출 (유형: 연구계획서 제출)
2. 1차 예비심사 (유형: 예비심사) - 평가표: 예비 심사 평가표
3. 중간 본심사 (유형: 본심사) - 평가표: 중간 논문 심사 평가표
4. 2차 예비심사 (유형: 예비심사) - 평가표: 예비 심사 평가표
5. 최종 본심사 (유형: 본심사) - 평가표: 학위 논문 심사 평가표
```

구현하시겠습니까?
