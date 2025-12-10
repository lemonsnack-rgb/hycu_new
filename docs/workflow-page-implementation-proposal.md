# 워크플로우 페이지 전환 방식 구현 방안

## 작성 일자
2025-12-09

## 요구사항

### 1. 모달 → 페이지 전환 방식 변경
현재 워크플로우 추가/수정이 모달로 구현되어 있으나, 별도 페이지로 전환하여 작업하도록 변경

### 2. 워크플로우 자체 등록 기능
"논문작성1", "논문작성2" 등 워크플로우(껍데기)를 여러 개 등록할 수 있어야 함

---

## 📋 현재 구조 분석

### 현재 방식 (모달)
```
stageManagement (워크플로우 목록)
    ↓ [+ 워크플로우 추가] 클릭
    ↓
openWorkflowModal() 모달 열림
    - 워크플로우명 입력
    - 학위 유형 선택
    - 단계 추가 (+ 단계 추가 버튼)
    ↓ [저장] 클릭
    ↓
워크플로우 + 단계 모두 저장
```

### 문제점
1. 모달 크기 제약으로 복잡한 워크플로우 구성 어려움
2. 단계가 많을 경우 스크롤 불편
3. 워크플로우명 중심이 아닌 단계 중심 UI

---

## 🎯 제안 구현 방안

### A. 3단계 페이지 구조

```
┌─────────────────────────────────────────┐
│ 1. 워크플로우 목록 페이지               │
│    (stageManagement)                    │
│    - 기존 테이블 유지                    │
│    - [+ 워크플로우 추가] 버튼           │
└─────────────────────────────────────────┘
                ↓ 클릭
┌─────────────────────────────────────────┐
│ 2. 워크플로우 등록 페이지 (신규)        │
│    (workflowCreate)                     │
│    - 워크플로우명 입력                   │
│    - 학위 유형 선택                      │
│    - 설명 입력                          │
│    - [저장 후 단계 구성하기] 버튼        │
│    - [취소] 버튼                        │
└─────────────────────────────────────────┘
                ↓ 저장
┌─────────────────────────────────────────┐
│ 3. 워크플로우 단계 구성 페이지 (신규)   │
│    (workflowStageCompose)               │
│    - 워크플로우 정보 표시 (상단)         │
│    - 등록된 단계 목록 (좌측 사이드바)    │
│    - 현재 구성된 단계 (우측 메인)        │
│    - 드래그앤드롭으로 단계 추가          │
│    - [저장] [취소] 버튼                 │
└─────────────────────────────────────────┘
```

---

## 📐 상세 설계

### 페이지 1: 워크플로우 목록 (기존)
**파일**: `admin_views.js` - `stageManagement()`

**수정 사항**:
- 버튼 동작 변경: `openWorkflowModal()` → `switchView('workflowCreate')`
- 테이블 행 클릭 시: `editWorkflow(id)` → `switchView('workflowStageCompose', id)`

**HTML 예시**:
```html
<button onclick="switchView('workflowCreate')"
        class="bg-[#009DE8] text-white px-4 py-2 rounded-md">
    + 워크플로우 추가
</button>
```

---

### 페이지 2: 워크플로우 등록 (신규)
**파일**: `admin_views.js` - 신규 함수 `workflowCreate(id = null)`

**목적**: 워크플로우 껍데기 등록 (이름, 학위 유형, 설명)

**화면 구성**:
```
┌──────────────────────────────────────────────────────┐
│ ← 뒤로가기          워크플로우 등록                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  워크플로우명 *                                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ 논문작성1                                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  학위 유형 *                                          │
│  ○ 석사    ○ 박사    ○ 공통                         │
│                                                       │
│  설명 (선택)                                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ 2025년 1학기 논문 작성 과정                    │   │
│  │                                               │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌────────────┐  ┌────────────┐                    │
│  │ 저장 후      │  │ 취소       │                    │
│  │ 단계 구성    │  │           │                    │
│  └────────────┘  └────────────┘                    │
└──────────────────────────────────────────────────────┘
```

**저장 로직**:
```javascript
workflowCreate: (id = null) => {
    const isEdit = id !== null;
    const item = isEdit ? mockThesisStages.find(s => s.id === id) : {};

    return `
        <div class="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <!-- 헤더 -->
            <div class="flex items-center mb-6">
                <button onclick="switchView('stageManagement')"
                        class="text-gray-600 hover:text-gray-800 mr-4">
                    ← 뒤로가기
                </button>
                <h2 class="text-2xl font-bold text-gray-800">
                    ${isEdit ? '워크플로우 수정' : '워크플로우 등록'}
                </h2>
            </div>

            <!-- 폼 -->
            <form id="workflow-form" class="space-y-6">
                <!-- 워크플로우명 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        워크플로우명 <span class="text-red-600">*</span>
                    </label>
                    <input type="text" id="workflow-name"
                           value="${item.name || ''}"
                           placeholder="예: 논문작성1, 석사 표준 과정"
                           class="w-full border border-gray-300 rounded-md px-4 py-3 text-sm">
                </div>

                <!-- 학위 유형 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        학위 유형 <span class="text-red-600">*</span>
                    </label>
                    <div class="flex gap-6">
                        <label class="flex items-center">
                            <input type="radio" name="degree-type" value="master"
                                   ${!item.degreeType || item.degreeType === 'master' ? 'checked' : ''}>
                            <span class="ml-2">석사</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="degree-type" value="phd"
                                   ${item.degreeType === 'phd' ? 'checked' : ''}>
                            <span class="ml-2">박사</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="degree-type" value="common"
                                   ${item.degreeType === 'common' ? 'checked' : ''}>
                            <span class="ml-2">공통</span>
                        </label>
                    </div>
                </div>

                <!-- 설명 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        설명 (선택)
                    </label>
                    <textarea id="workflow-description" rows="4"
                              placeholder="워크플로우에 대한 설명을 입력하세요"
                              class="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                    >${item.description || ''}</textarea>
                </div>

                <!-- 버튼 -->
                <div class="flex gap-4 pt-4">
                    <button type="button" onclick="saveWorkflowAndCompose('${id || ''}')"
                            class="bg-[#009DE8] text-white px-6 py-3 rounded-md hover:bg-opacity-90">
                        ${isEdit ? '저장 후 단계 구성' : '저장 후 단계 구성하기'}
                    </button>
                    <button type="button" onclick="switchView('stageManagement')"
                            class="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400">
                        취소
                    </button>
                </div>
            </form>
        </div>
    `;
}
```

---

### 페이지 3: 워크플로우 단계 구성 (신규)
**파일**: `admin_views.js` - 신규 함수 `workflowStageCompose(workflowId)`

**목적**: 등록된 워크플로우에 단계 추가/수정/순서 변경

**화면 구성** (2단 레이아웃):
```
┌────────────────────────────────────────────────────────────┐
│ ← 목록으로     워크플로우 단계 구성                          │
│ 워크플로우: 논문작성1 (석사)                                 │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────────────────────────┐  │
│  │ 단계 유형 목록│  │ 구성된 단계                       │  │
│  │ (좌측 30%)   │  │ (우측 70%)                       │  │
│  │              │  │                                  │  │
│  │ 🔍 검색      │  │  1. 연구계획서 제출  [↑][↓][X]   │  │
│  │              │  │  2. 선행연구 검토    [↑][↓][X]   │  │
│  │ [제출]       │  │  3. 본심사          [↑][↓][X]   │  │
│  │ □ 연구계획서 │  │                                  │  │
│  │ □ 1차 보고서 │  │  + 단계 추가                      │  │
│  │ □ 최종논문   │  │                                  │  │
│  │              │  │                                  │  │
│  │ [심사]       │  │                                  │  │
│  │ □ 예비심사   │  │                                  │  │
│  │ □ 본심사     │  │                                  │  │
│  │              │  │                                  │  │
│  └──────────────┘  └──────────────────────────────────┘  │
│                                                             │
│  [저장]  [취소]                                             │
└────────────────────────────────────────────────────────────┘
```

**HTML 예시**:
```javascript
workflowStageCompose: (workflowId) => {
    const workflow = mockThesisStages.find(w => w.id === workflowId);
    if (!workflow) return '<p>워크플로우를 찾을 수 없습니다.</p>';

    const degreeLabel = workflow.degreeType === 'master' ? '석사' :
                       workflow.degreeType === 'phd' ? '박사' : '공통';

    // 임시 저장용 전역 변수 초기화
    window.currentWorkflow = workflow;
    window.composedStages = workflow.stages ? [...workflow.stages] : [];

    return `
        <div class="h-full flex flex-col">
            <!-- 헤더 -->
            <div class="bg-white border-b px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <button onclick="switchView('stageManagement')"
                                class="text-gray-600 hover:text-gray-800 mr-4">
                            ← 목록으로
                        </button>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">워크플로우 단계 구성</h2>
                            <p class="text-sm text-gray-600 mt-1">
                                워크플로우: <strong>${workflow.name}</strong>
                                <span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 ml-2">
                                    ${degreeLabel}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="saveWorkflowStages('${workflowId}')"
                                class="bg-[#009DE8] text-white px-6 py-2 rounded-md">
                            저장
                        </button>
                        <button onclick="switchView('stageManagement')"
                                class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md">
                            취소
                        </button>
                    </div>
                </div>
            </div>

            <!-- 2단 레이아웃 -->
            <div class="flex-1 flex overflow-hidden">
                <!-- 좌측: 단계 유형 목록 -->
                <div class="w-1/3 bg-gray-50 border-r p-4 overflow-y-auto">
                    <h3 class="font-bold text-gray-800 mb-3">단계 유형 목록</h3>

                    <!-- 검색 -->
                    <input type="text" id="step-type-search"
                           placeholder="단계 검색..."
                           onkeyup="filterStepTypes()"
                           class="w-full border rounded-md px-3 py-2 text-sm mb-4">

                    <!-- 제출 유형 -->
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-500 uppercase mb-2">제출</p>
                        <div class="space-y-2">
                            ${mockStepTypes.filter(st => st.type === 'submission').map(st => `
                                <div class="step-type-item bg-white border rounded-md p-3 hover:bg-blue-50 cursor-pointer"
                                     onclick="addStageToComposition('${st.id}')">
                                    <p class="font-medium text-sm text-gray-800">${st.name}</p>
                                    <p class="text-xs text-gray-500 mt-1">${st.description || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 심사 유형 -->
                    <div>
                        <p class="text-xs font-semibold text-gray-500 uppercase mb-2">심사</p>
                        <div class="space-y-2">
                            ${mockStepTypes.filter(st => st.type === 'review').map(st => `
                                <div class="step-type-item bg-white border rounded-md p-3 hover:bg-purple-50 cursor-pointer"
                                     onclick="addStageToComposition('${st.id}')">
                                    <p class="font-medium text-sm text-gray-800">${st.name}</p>
                                    <p class="text-xs text-gray-500 mt-1">${st.description || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- 우측: 구성된 단계 -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <h3 class="font-bold text-gray-800 mb-4">구성된 단계</h3>

                    <div id="composed-stages-list" class="space-y-3">
                        ${renderComposedStages()}
                    </div>

                    ${window.composedStages.length === 0 ? `
                        <div class="text-center py-12 text-gray-400">
                            <i class="fas fa-cube text-4xl mb-3"></i>
                            <p>좌측에서 단계를 클릭하여 추가하세요</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}
```

---

## 🔧 구현 파일 목록

### 1. `admin_views.js` 수정
- `stageManagement()` - 버튼 동작 변경
- **신규 추가**:
  - `workflowCreate(id)` - 워크플로우 등록 페이지
  - `workflowStageCompose(workflowId)` - 단계 구성 페이지

### 2. `admin_main.js` 수정
- `switchView()` 함수에 새 뷰 추가:
  - `case 'workflowCreate':`
  - `case 'workflowStageCompose':`

### 3. `admin_actions.js` 신규 생성 (또는 기존 파일에 추가)
```javascript
// 워크플로우 저장 후 단계 구성 페이지로 이동
function saveWorkflowAndCompose(workflowId) {
    const name = document.getElementById('workflow-name').value.trim();
    const degreeType = document.querySelector('input[name="degree-type"]:checked').value;
    const description = document.getElementById('workflow-description').value.trim();

    if (!name) {
        showAlert('워크플로우명을 입력해주세요.');
        return;
    }

    const isEdit = workflowId !== '';

    if (isEdit) {
        // 수정
        const workflow = mockThesisStages.find(w => w.id === workflowId);
        workflow.name = name;
        workflow.degreeType = degreeType;
        workflow.description = description;
    } else {
        // 신규 생성
        const newWorkflow = {
            id: 'TS' + String(mockThesisStages.length + 1).padStart(3, '0'),
            name: name,
            degreeType: degreeType,
            description: description,
            stageCount: 0,
            createdDate: new Date().toISOString().split('T')[0],
            stages: []
        };
        mockThesisStages.push(newWorkflow);
        workflowId = newWorkflow.id;
    }

    showAlert('워크플로우가 저장되었습니다. 단계를 구성하세요.');
    switchView('workflowStageCompose', workflowId);
}

// 단계 구성 저장
function saveWorkflowStages(workflowId) {
    const workflow = mockThesisStages.find(w => w.id === workflowId);
    if (!workflow) return;

    workflow.stages = window.composedStages.map((stage, idx) => ({
        ...stage,
        order: idx + 1
    }));
    workflow.stageCount = workflow.stages.length;

    showAlert('워크플로우 단계 구성이 저장되었습니다.');
    switchView('stageManagement');
}

// 단계 추가
function addStageToComposition(stepTypeId) {
    const stepType = mockStepTypes.find(st => st.id === stepTypeId);
    if (!stepType) return;

    window.composedStages.push({
        stepTypeId: stepType.id,
        name: stepType.name,
        type: stepType.type,
        evaluationRequired: stepType.type === 'review'
    });

    // 리렌더링
    document.getElementById('composed-stages-list').innerHTML = renderComposedStages();
}

// 단계 제거
function removeStageFromComposition(index) {
    window.composedStages.splice(index, 1);
    document.getElementById('composed-stages-list').innerHTML = renderComposedStages();
}

// 단계 순서 변경
function moveStageInComposition(index, direction) {
    if (direction === 'up' && index > 0) {
        [window.composedStages[index - 1], window.composedStages[index]] =
        [window.composedStages[index], window.composedStages[index - 1]];
    } else if (direction === 'down' && index < window.composedStages.length - 1) {
        [window.composedStages[index], window.composedStages[index + 1]] =
        [window.composedStages[index + 1], window.composedStages[index]];
    }
    document.getElementById('composed-stages-list').innerHTML = renderComposedStages();
}

// 구성된 단계 렌더링
function renderComposedStages() {
    if (!window.composedStages || window.composedStages.length === 0) {
        return '';
    }

    return window.composedStages.map((stage, idx) => {
        const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
        const typeLabel = stepType?.type === 'submission' ? '제출' : '심사';
        const typeBg = stepType?.type === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

        return `
            <div class="flex items-center gap-3 p-4 bg-white border rounded-lg">
                <span class="font-bold text-gray-600 text-lg w-8">${idx + 1}.</span>
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-800">${stage.name}</span>
                        <span class="px-2 py-0.5 rounded text-xs ${typeBg}">${typeLabel}</span>
                        ${stage.evaluationRequired ? '<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">심사</span>' : ''}
                    </div>
                    ${stepType?.description ? `<p class="text-xs text-gray-500 mt-1">${stepType.description}</p>` : ''}
                </div>
                <div class="flex gap-2">
                    ${idx > 0 ? `<button onclick="moveStageInComposition(${idx}, 'up')" class="text-blue-600 hover:underline text-sm px-2">↑</button>` : ''}
                    ${idx < window.composedStages.length - 1 ? `<button onclick="moveStageInComposition(${idx}, 'down')" class="text-blue-600 hover:underline text-sm px-2">↓</button>` : ''}
                    <button onclick="removeStageFromComposition(${idx})" class="text-red-600 hover:underline text-sm px-2">삭제</button>
                </div>
            </div>
        `;
    }).join('');
}
```

---

## 🎨 장점

### 1. 페이지 전환 방식의 장점
- ✅ 넓은 작업 공간 (모달 크기 제약 없음)
- ✅ 브라우저 뒤로가기 지원
- ✅ URL 기반 네비게이션 가능 (향후 라우팅 추가 시)
- ✅ 복잡한 워크플로우 구성 작업에 적합

### 2. 워크플로우 우선 등록의 장점
- ✅ "논문작성1", "논문작성2" 등 여러 워크플로우 빠르게 생성 가능
- ✅ 워크플로우 이름을 먼저 정의하고 나중에 단계 구성
- ✅ 빈 워크플로우도 저장 가능 (나중에 단계 추가)
- ✅ 워크플로우 목록에서 완성/미완성 상태 구분 가능

---

## ⚠️ 주의사항

### 1. 기존 모달 코드 유지 여부
- 현재 `openWorkflowModal()` 함수는 삭제하지 말고 주석 처리
- 향후 빠른 수정이 필요한 경우 모달 방식 재활용 가능

### 2. 전역 변수 관리
- `window.currentWorkflow`, `window.composedStages` 사용 시 페이지 전환 시 초기화 필요
- `switchView()` 함수에서 뷰 전환 시 전역 변수 클린업

### 3. 데이터 저장 시점
- 워크플로우 등록 → 즉시 저장
- 단계 구성 → [저장] 버튼 클릭 시 저장
- [취소] 버튼 클릭 시 변경사항 버림

---

## 📅 예상 구현 시간

- **페이지 2 (워크플로우 등록)**: 2시간
- **페이지 3 (단계 구성)**: 4시간
- **기존 코드 수정 및 연동**: 2시간
- **테스트 및 버그 수정**: 2시간

**총 예상 시간**: 10시간 (약 1.5일)

---

## 🚀 다음 단계

이 구현 방안에 동의하시면 즉시 구현을 시작하겠습니다.

1. ✅ 구현 방안 검토 및 승인
2. ⏭️ `workflowCreate()` 페이지 구현
3. ⏭️ `workflowStageCompose()` 페이지 구현
4. ⏭️ 기존 코드 수정 및 연동
5. ⏭️ 테스트

---

## 📌 결론

이 방식으로 구현하면:
- ✅ 모달 → 페이지 전환 방식
- ✅ 워크플로우 껍데기 등록 → 나중에 단계 구성
- ✅ "논문작성1", "논문작성2" 등 여러 개 생성 가능
- ✅ 넓은 작업 공간으로 복잡한 워크플로우 구성 용이

모든 요구사항이 충족됩니다.
