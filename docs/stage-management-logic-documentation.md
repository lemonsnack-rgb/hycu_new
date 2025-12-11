# 심사 단계 관리 메뉴 구현 동작 로직 문서

## 1. 개요

**메뉴 경로**: 관리자 > 논문 심사 > 심사 단계 등록

**목적**: 학위별 논문 심사 워크플로우를 구성하고 관리하는 기능

**핵심 개념**: "단계 유형(레고 블록)" → "워크플로우 조립(레고 작품)" 메타포

## 2. 현재 구현된 시스템 아키텍처

### 2.1 데이터 계층 구조

```
mockStepTypes (단계 유형 - 템플릿)
    ↓ 참조
mockThesisStages (워크플로우 - 조립된 결과물)
    └─ stages[] (워크플로우 내 단계 배열)
        └─ stepTypeId로 mockStepTypes 참조
```

#### mockStepTypes (단계 유형 템플릿)
**위치**: [admin/assets/js/mockData.js](admin/assets/js/mockData.js:271-342)

**역할**: 재사용 가능한 단계 유형 정의 (레고 블록)

**구조**:
```javascript
{
  id: 'ST001',
  name: '연구계획서 제출',
  type: 'submission',  // 'submission' | 'review'
  requiresDocument: true,
  requiresPresentation: false,
  evaluationTemplateId: null,  // 평가표 ID (심사 단계만)
  description: '연구 주제 및 연구 방법을 문서로 제출하는 단계',
  createdDate: '2025-01-01'
}
```

**종류**:
- `ST001`: 연구계획서 제출 (제출)
- `ST002`: 예비심사 (심사)
- `ST003`: 본심사 (심사)
- `ST004`: 선행연구 검토 (제출)
- `ST005`: 연구 수행 (제출)
- `ST006`: 논문 작성 (제출)
- `ST007`: 연구제안서 심사 (심사)

#### mockThesisStages (워크플로우)
**위치**: [admin/assets/js/mockData.js](admin/assets/js/mockData.js)

**역할**: 실제 사용되는 워크플로우 (조립된 레고 작품)

**구조**:
```javascript
{
  id: 'WF001',
  name: '논문작성1',
  degreeType: 'master',  // 'master' | 'doctoral'
  stageCount: 6,
  stages: [
    {
      id: 'STAGE001',
      order: 1,
      name: '연구계획서 제출',  // 워크플로우 내에서의 이름 (커스터마이징 가능)
      stepTypeId: 'ST001',  // 참조하는 단계 유형
      type: 'submission',
      evaluationRequired: false,
      evaluationTemplateId: null
    },
    // ... 더 많은 단계
  ],
  createdDate: '2025-01-01'
}
```

## 3. 화면별 동작 로직

### 3.1 워크플로우 목록 화면 (typeManagement)

**파일**: [admin/admin_views.js](admin/admin_views.js:2626-2710)

**진입점**:
- 메뉴 클릭: "논문 심사 > 심사 단계 등록"
- `data-view="typeManagement"` 트리거

**렌더링 로직**:

```javascript
typeManagement: () => {
    const data = mockThesisStages;  // 워크플로우 데이터 로드

    // 각 워크플로우에 대해:
    data.map((item, idx) => {
        // 1. 학위 표시 변환
        const degreeLabel = item.degreeType === 'master' ? '석사' : '박사';

        // 2. 심사 단계 개수 계산
        const evaluationCount = item.stages.filter(s => s.evaluationRequired).length;

        // 3. 단계 구성 시각화
        item.stages.map((stage, stepIdx) => {
            // stepTypeId로 단계 유형 정보 조회
            const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);

            // 타입에 따른 색상 지정
            const bgColor = stage.type === 'submission'
                ? 'bg-gray-100 text-gray-700'      // 제출 단계
                : (stage.evaluationRequired
                    ? 'bg-green-100 text-green-700'  // 심사 단계
                    : 'bg-blue-100 text-blue-700');  // 기타

            // 화살표로 단계 연결
            return `${stage.order}. ${stage.name} ${stepIdx < length - 1 ? '→' : ''}`;
        })
    })
}
```

**주요 기능**:
1. **워크플로우 목록 조회**: mockThesisStages 전체 표시
2. **+ 워크플로우 추가**: `switchView('workflowCreateUnified')` 호출
3. **수정**: `switchView('workflowCreateUnified', workflowId)` 호출
4. **삭제**: `deleteWorkflow(workflowId)` 호출

**표시 정보**:
- 번호
- 워크플로우명
- 학위 (석사/박사 배지)
- 단계 수 (전체/심사 개수)
- 단계 구성 (화살표로 연결된 배지)
- 관리 (수정/삭제 버튼)

### 3.2 워크플로우 등록/수정 화면 (workflowCreateUnified)

**파일**: [admin/admin_views.js](admin/admin_views.js:2752-2875)

**진입점**:
- 목록에서 "+ 워크플로우 추가" 클릭
- 목록에서 "수정" 버튼 클릭 (workflowId 전달)

#### 3.2.1 초기화 로직

```javascript
workflowCreateUnified: (id = null) => {
    // 1. 편집 모드 판단
    const isEdit = id !== null;

    // 2. 편집 모드면 기존 데이터 로드
    const item = isEdit ? mockThesisStages.find(s => s.id === id) : null;

    // 3. 전역 변수 초기화 (중요!)
    window.composedStages = isEdit
        ? JSON.parse(JSON.stringify(item.stages))  // 깊은 복사
        : [];
    window.currentWorkflowId = id;

    // 4. 저장 핸들러 설정
    const handleSave = () => {
        // 유효성 검사
        const name = document.getElementById('workflow-name').value;
        const degree = document.getElementById('workflow-degree').value;

        if (!name.trim()) {
            alert('워크플로우 이름을 입력해주세요.');
            return;
        }

        if (window.composedStages.length === 0) {
            alert('최소 1개 이상의 단계를 추가해주세요.');
            return;
        }

        // 저장 함수 호출
        saveUnifiedWorkflow();
    };

    // 5. 렌더링 후 이벤트 바인딩
    setTimeout(() => {
        const saveBtn = document.getElementById('unified-save-btn');
        if (saveBtn) {
            saveBtn.onclick = handleSave;
        }
    }, 0);
}
```

#### 3.2.2 UI 구조 (2단 레이아웃)

```
┌─────────────────────────────────────────────────────┐
│ Header: 워크플로우 등록/수정                           │
├─────────────────────────────────────────────────────┤
│ 기본 정보:                                            │
│ - 워크플로우 이름 [입력창]                             │
│ - 학위 과정 [석사/박사 선택]                           │
├─────────────┬───────────────────────────────────────┤
│ 왼쪽 패널    │ 오른쪽 패널                            │
│ (1/3 너비)  │ (2/3 너비)                            │
│             │                                       │
│ [단계 유형]  │ [구성된 단계 (N개)]                   │
│ + 새 단계   │                                       │
│ 유형 추가   │ [단계가 없으면]                        │
│             │   ┌─────────────────┐                │
│ ┌─────────┐ │   │  +  아이콘       │                │
│ │연구계획서│ │   │왼쪽에서 단계를    │                │
│ │제출      │ │   │선택하여 추가하세요│                │
│ │[제출]    │ │   └─────────────────┘                │
│ └─────────┘ │                                       │
│ (클릭 가능) │ [단계가 있으면]                        │
│             │ ┌─────────────────────────────────┐  │
│ ┌─────────┐ │ │1. 연구계획서 제출               │  │
│ │예비심사  │ │ │   [심사 없음]                   │  │
│ │[심사]    │ │ │   [수정] [삭제] [↑] [↓]        │  │
│ └─────────┘ │ └─────────────────────────────────┘  │
│             │ ┌─────────────────────────────────┐  │
│ ┌─────────┐ │ │2. 예비심사                      │  │
│ │본심사    │ │ │   [평가표: 예비심사 평가표]     │  │
│ │[심사]    │ │ │   [수정] [삭제] [↑] [↓]        │  │
│ └─────────┘ │ └─────────────────────────────────┘  │
│             │                                       │
│ ...         │ ...                                   │
├─────────────┴───────────────────────────────────────┤
│ Footer: [취소] [저장 (N개 단계)]                      │
└─────────────────────────────────────────────────────┘
```

#### 3.2.3 왼쪽 패널: 단계 유형 목록

**데이터 소스**: `mockStepTypes`

**렌더링 로직**:
```javascript
mockStepTypes.map(st => {
    // 1. 타입 레이블 변환
    const typeLabel = st.type === 'submission' ? '제출' : '심사';

    // 2. 타입별 색상
    const typeBgColor = st.type === 'submission'
        ? 'bg-blue-100 text-blue-800'      // 제출: 파란색
        : 'bg-purple-100 text-purple-800'; // 심사: 보라색

    // 3. 클릭 이벤트: 단계 추가 모달 열기
    return `
        <div onclick="openAddStageModal('${st.id}')">
            ${st.name}
            <span class="${typeBgColor}">${typeLabel}</span>
        </div>
    `;
})
```

**상호작용**:
1. **단계 유형 클릭**: `openAddStageModal(stepTypeId)` 호출
2. **+ 새 단계 유형 추가**: `openStepTypeModal()` 호출 (향후 구현)

#### 3.2.4 오른쪽 패널: 구성된 단계

**데이터 소스**: `window.composedStages` (전역 변수)

**렌더링 함수**: `renderComposedStagesUnified()`

**동적 업데이트**:
```javascript
// 단계가 추가/삭제/수정될 때마다 호출
function refreshComposedStages() {
    const container = document.getElementById('composed-stages-list-unified');
    container.innerHTML = renderComposedStagesUnified();

    // 저장 버튼 상태 업데이트
    const saveBtn = document.getElementById('unified-save-btn');
    if (window.composedStages.length === 0) {
        saveBtn.disabled = true;
        saveBtn.className = 'bg-gray-300 text-gray-500 cursor-not-allowed';
    } else {
        saveBtn.disabled = false;
        saveBtn.className = 'bg-[#009DE8] text-white hover:bg-opacity-90';
    }
    saveBtn.textContent = `저장 (${window.composedStages.length}개 단계)`;
}
```

**단계 카드 구조**:
```javascript
// 각 단계는 다음 정보를 표시:
{
    순서: "1. 연구계획서 제출",
    상태: "[심사 없음]" | "[평가표: 예비심사 평가표]",
    액션: [수정] [삭제] [↑] [↓]
}
```

### 3.3 단계 추가 모달 로직

**트리거**: 왼쪽 패널에서 단계 유형 클릭

**함수**: `openAddStageModal(stepTypeId)`

**동작 흐름**:

```javascript
function openAddStageModal(stepTypeId) {
    // 1. 선택한 단계 유형 정보 조회
    const stepType = mockStepTypes.find(st => st.id === stepTypeId);

    // 2. 모달 창 생성
    showModal({
        title: '단계 추가',
        content: `
            <div>
                <label>단계 이름</label>
                <input id="stage-name"
                       value="${stepType.name}"
                       placeholder="워크플로우 내에서 사용할 이름">

                ${stepType.type === 'review' ? `
                    <label>평가 필요 여부</label>
                    <input type="checkbox" id="evaluation-required">

                    <label>평가표 선택</label>
                    <select id="evaluation-template">
                        <option value="">평가 없음</option>
                        ${mockEvaluationTemplates.map(tpl =>
                            `<option value="${tpl.id}">${tpl.name}</option>`
                        ).join('')}
                    </select>
                ` : ''}
            </div>
        `,
        onConfirm: () => {
            // 3. 입력값 수집
            const stageName = document.getElementById('stage-name').value.trim();
            const evaluationRequired = stepType.type === 'review'
                ? document.getElementById('evaluation-required').checked
                : false;
            const evaluationTemplateId = evaluationRequired
                ? document.getElementById('evaluation-template').value
                : null;

            // 4. 유효성 검사
            if (!stageName) {
                alert('단계 이름을 입력하세요.');
                return false;
            }

            // 5. window.composedStages에 추가
            const newStage = {
                id: `STAGE_${Date.now()}`,  // 임시 ID
                order: window.composedStages.length + 1,
                name: stageName,
                stepTypeId: stepTypeId,
                type: stepType.type,
                evaluationRequired: evaluationRequired,
                evaluationTemplateId: evaluationTemplateId
            };

            window.composedStages.push(newStage);

            // 6. UI 갱신
            refreshComposedStages();

            return true;  // 모달 닫기
        }
    });
}
```

### 3.4 단계 관리 액션

#### 3.4.1 단계 순서 변경

**위로 이동**:
```javascript
function moveStageUpUnified(index) {
    if (index === 0) return;  // 첫 번째 요소는 위로 이동 불가

    // 배열 요소 교환
    const temp = window.composedStages[index];
    window.composedStages[index] = window.composedStages[index - 1];
    window.composedStages[index - 1] = temp;

    // order 재정렬
    window.composedStages.forEach((stage, idx) => {
        stage.order = idx + 1;
    });

    // UI 갱신
    refreshComposedStages();
}
```

**아래로 이동**:
```javascript
function moveStageDownUnified(index) {
    if (index === window.composedStages.length - 1) return;  // 마지막 요소는 아래로 이동 불가

    // 배열 요소 교환
    const temp = window.composedStages[index];
    window.composedStages[index] = window.composedStages[index + 1];
    window.composedStages[index + 1] = temp;

    // order 재정렬
    window.composedStages.forEach((stage, idx) => {
        stage.order = idx + 1;
    });

    // UI 갱신
    refreshComposedStages();
}
```

#### 3.4.2 단계 삭제

```javascript
function deleteStageUnified(index) {
    if (!confirm('이 단계를 삭제하시겠습니까?')) return;

    // 배열에서 제거
    window.composedStages.splice(index, 1);

    // order 재정렬
    window.composedStages.forEach((stage, idx) => {
        stage.order = idx + 1;
    });

    // UI 갱신
    refreshComposedStages();
}
```

#### 3.4.3 단계 수정

```javascript
function editStageUnified(index) {
    const stage = window.composedStages[index];
    const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);

    // 수정 모달 열기 (추가 모달과 유사하지만 기존 값 표시)
    showModal({
        title: '단계 수정',
        content: `
            <input id="stage-name" value="${stage.name}">
            ${stepType.type === 'review' ? `
                <input type="checkbox" id="evaluation-required"
                       ${stage.evaluationRequired ? 'checked' : ''}>
                <select id="evaluation-template">
                    <option value="">평가 없음</option>
                    ${mockEvaluationTemplates.map(tpl =>
                        `<option value="${tpl.id}"
                                ${stage.evaluationTemplateId === tpl.id ? 'selected' : ''}>
                            ${tpl.name}
                        </option>`
                    ).join('')}
                </select>
            ` : ''}
        `,
        onConfirm: () => {
            // 입력값으로 기존 단계 업데이트
            stage.name = document.getElementById('stage-name').value.trim();
            if (stepType.type === 'review') {
                stage.evaluationRequired = document.getElementById('evaluation-required').checked;
                stage.evaluationTemplateId = stage.evaluationRequired
                    ? document.getElementById('evaluation-template').value
                    : null;
            }

            // UI 갱신
            refreshComposedStages();
            return true;
        }
    });
}
```

### 3.5 워크플로우 저장 로직

**함수**: `saveUnifiedWorkflow()`

**동작 흐름**:

```javascript
function saveUnifiedWorkflow() {
    // 1. 기본 정보 수집
    const name = document.getElementById('workflow-name').value.trim();
    const degreeType = document.getElementById('workflow-degree').value;
    const isEdit = window.currentWorkflowId !== null;

    // 2. 워크플로우 객체 생성
    const workflow = {
        id: isEdit ? window.currentWorkflowId : `WF_${Date.now()}`,
        name: name,
        degreeType: degreeType,
        stageCount: window.composedStages.length,
        stages: window.composedStages.map((stage, index) => ({
            ...stage,
            order: index + 1  // 최종 순서 확정
        })),
        createdDate: isEdit
            ? mockThesisStages.find(w => w.id === window.currentWorkflowId).createdDate
            : new Date().toISOString().split('T')[0]
    };

    // 3. Mock 데이터 업데이트
    if (isEdit) {
        // 수정: 기존 항목 교체
        const index = mockThesisStages.findIndex(w => w.id === window.currentWorkflowId);
        mockThesisStages[index] = workflow;
    } else {
        // 추가: 배열에 추가
        mockThesisStages.push(workflow);
    }

    // 4. 성공 메시지
    showNotification(
        isEdit ? '워크플로우가 수정되었습니다.' : '워크플로우가 등록되었습니다.',
        'success'
    );

    // 5. 목록 화면으로 이동
    switchView('typeManagement');

    // 6. 전역 변수 정리
    window.composedStages = [];
    window.currentWorkflowId = null;
}
```

### 3.6 워크플로우 삭제 로직

**함수**: `deleteWorkflow(workflowId)`

```javascript
function deleteWorkflow(workflowId) {
    // 1. 삭제 확인
    const workflow = mockThesisStages.find(w => w.id === workflowId);
    if (!confirm(`"${workflow.name}" 워크플로우를 삭제하시겠습니까?`)) {
        return;
    }

    // 2. Mock 데이터에서 제거
    const index = mockThesisStages.findIndex(w => w.id === workflowId);
    mockThesisStages.splice(index, 1);

    // 3. 성공 메시지
    showNotification('워크플로우가 삭제되었습니다.', 'success');

    // 4. 화면 갱신
    switchView('typeManagement');
}
```

## 4. 데이터 흐름도

```
사용자 액션                     함수 호출                    데이터 변경

[메뉴 클릭]
    ↓
typeManagement 렌더링
    ↓
mockThesisStages 조회 ───────→ 화면 표시

[+ 워크플로우 추가]
    ↓
workflowCreateUnified(null)
    ↓
window.composedStages = [] ────→ 빈 배열 초기화
    ↓
mockStepTypes 조회 ────────────→ 왼쪽 패널 표시

[단계 유형 클릭]
    ↓
openAddStageModal(stepTypeId)
    ↓
[모달에서 입력]
    ↓
window.composedStages.push() ──→ 단계 추가
    ↓
refreshComposedStages() ───────→ 오른쪽 패널 갱신

[↑ / ↓ 버튼]
    ↓
moveStageUp/Down(index)
    ↓
window.composedStages 재정렬 ──→ order 업데이트
    ↓
refreshComposedStages() ───────→ 화면 갱신

[삭제 버튼]
    ↓
deleteStageUnified(index)
    ↓
window.composedStages.splice() → 배열에서 제거
    ↓
refreshComposedStages() ───────→ 화면 갱신

[저장 버튼]
    ↓
saveUnifiedWorkflow()
    ↓
mockThesisStages 업데이트 ─────→ 영구 저장 (Mock)
    ↓
switchView('typeManagement') ──→ 목록으로 복귀
```

## 5. 상태 관리

### 5.1 전역 변수

```javascript
// 현재 편집 중인 워크플로우의 단계 목록
window.composedStages = [
    {
        id: 'STAGE_001',
        order: 1,
        name: '연구계획서 제출',
        stepTypeId: 'ST001',
        type: 'submission',
        evaluationRequired: false,
        evaluationTemplateId: null
    },
    // ...
]

// 현재 편집 중인 워크플로우 ID (수정 모드일 때만)
window.currentWorkflowId = 'WF001' | null
```

### 5.2 상태 변경 트리거

1. **초기화**: `workflowCreateUnified()` 호출 시
2. **단계 추가**: `openAddStageModal()` 모달 확인 시
3. **단계 수정**: `editStageUnified()` 모달 확인 시
4. **단계 삭제**: `deleteStageUnified()` 호출 시
5. **순서 변경**: `moveStageUp/Down()` 호출 시
6. **저장/취소**: 전역 변수 초기화

## 6. UI 업데이트 메커니즘

### 6.1 반응형 UI 패턴

```javascript
// 상태 변경 → UI 갱신 패턴
function anyStateChange() {
    // 1. window.composedStages 수정
    window.composedStages = /* ... */;

    // 2. UI 갱신 함수 호출
    refreshComposedStages();
}

function refreshComposedStages() {
    // 1. 컨테이너 선택
    const container = document.getElementById('composed-stages-list-unified');

    // 2. 새로운 HTML로 교체
    container.innerHTML = renderComposedStagesUnified();

    // 3. 저장 버튼 상태 업데이트
    updateSaveButton();
}

function updateSaveButton() {
    const saveBtn = document.getElementById('unified-save-btn');
    const count = window.composedStages.length;

    saveBtn.disabled = count === 0;
    saveBtn.textContent = `저장 (${count}개 단계)`;
    saveBtn.className = count === 0
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-[#009DE8] text-white hover:bg-opacity-90';
}
```

### 6.2 렌더링 함수

```javascript
function renderComposedStagesUnified() {
    if (window.composedStages.length === 0) {
        return `
            <div class="empty-state">
                <svg>...</svg>
                <p>왼쪽에서 단계를 선택하여 추가하세요</p>
            </div>
        `;
    }

    return window.composedStages.map((stage, index) => {
        // 단계 유형 정보 조회
        const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);

        // 평가 상태 텍스트
        const evaluationText = stage.evaluationRequired
            ? `평가표: ${mockEvaluationTemplates.find(t => t.id === stage.evaluationTemplateId)?.name || '없음'}`
            : '심사 없음';

        return `
            <div class="stage-card">
                <div class="stage-header">
                    <span class="stage-order">${stage.order}.</span>
                    <span class="stage-name">${stage.name}</span>
                </div>
                <div class="stage-meta">
                    <span class="stage-type">${stepType.name}</span>
                    <span class="evaluation-status">[${evaluationText}]</span>
                </div>
                <div class="stage-actions">
                    <button onclick="editStageUnified(${index})">수정</button>
                    <button onclick="deleteStageUnified(${index})">삭제</button>
                    <button onclick="moveStageUpUnified(${index})"
                            ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button onclick="moveStageDownUnified(${index})"
                            ${index === window.composedStages.length - 1 ? 'disabled' : ''}>↓</button>
                </div>
            </div>
        `;
    }).join('');
}
```

## 7. 유효성 검사 로직

### 7.1 워크플로우 레벨 검사

```javascript
function validateWorkflow() {
    const errors = [];

    // 1. 이름 필수
    const name = document.getElementById('workflow-name').value.trim();
    if (!name) {
        errors.push('워크플로우 이름을 입력하세요.');
    }

    // 2. 최소 1개 단계 필수
    if (window.composedStages.length === 0) {
        errors.push('최소 1개 이상의 단계를 추가하세요.');
    }

    // 3. 에러가 있으면 표시하고 중단
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }

    return true;
}
```

### 7.2 단계 레벨 검사

```javascript
function validateStage(stageData) {
    const errors = [];

    // 1. 단계 이름 필수
    if (!stageData.name || !stageData.name.trim()) {
        errors.push('단계 이름을 입력하세요.');
    }

    // 2. 심사 단계인 경우 평가표 선택 검증
    if (stageData.evaluationRequired && !stageData.evaluationTemplateId) {
        errors.push('평가 필요 시 평가표를 선택해야 합니다.');
    }

    // 3. 에러가 있으면 표시하고 중단
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }

    return true;
}
```

## 8. 이벤트 흐름 시퀀스

### 8.1 워크플로우 등록 전체 시퀀스

```
1. 사용자가 "논문 심사 > 심사 단계 등록" 메뉴 클릭
   ↓
2. typeManagement() 렌더링 → 워크플로우 목록 표시
   ↓
3. 사용자가 "+ 워크플로우 추가" 버튼 클릭
   ↓
4. switchView('workflowCreateUnified') 호출
   ↓
5. workflowCreateUnified(null) 실행
   - window.composedStages = [] 초기화
   - 2단 레이아웃 렌더링
   - 왼쪽: mockStepTypes 목록 표시
   - 오른쪽: 빈 상태 표시
   ↓
6. 사용자가 왼쪽 패널에서 "연구계획서 제출" 클릭
   ↓
7. openAddStageModal('ST001') 호출
   ↓
8. 모달 창 표시
   - 단계 이름: "연구계획서 제출" (기본값)
   - 평가 옵션: 없음 (제출 단계이므로)
   ↓
9. 사용자가 "확인" 클릭
   ↓
10. window.composedStages.push({ ... }) 실행
    ↓
11. refreshComposedStages() 호출
    - 오른쪽 패널 갱신
    - "1. 연구계획서 제출" 카드 표시
    - 저장 버튼 활성화: "저장 (1개 단계)"
    ↓
12. 사용자가 "예비심사" 클릭
    ↓
13. openAddStageModal('ST002') 호출
    ↓
14. 모달 창 표시
    - 단계 이름: "예비심사"
    - 평가 필요 여부: 체크박스
    - 평가표 선택: 드롭다운
    ↓
15. 사용자가 평가 필요 체크, "예비심사 평가표" 선택, "확인" 클릭
    ↓
16. window.composedStages.push({ ... }) 실행
    ↓
17. refreshComposedStages() 호출
    - "2. 예비심사 [평가표: 예비심사 평가표]" 카드 추가
    - 저장 버튼: "저장 (2개 단계)"
    ↓
18. 사용자가 워크플로우 이름 입력: "석사 표준 과정"
    ↓
19. 사용자가 "저장 (2개 단계)" 버튼 클릭
    ↓
20. handleSave() 호출
    - validateWorkflow() 실행 → 통과
    - saveUnifiedWorkflow() 호출
      ↓
21. mockThesisStages.push({ ... }) 실행
    ↓
22. showNotification('워크플로우가 등록되었습니다.', 'success')
    ↓
23. switchView('typeManagement') 호출
    ↓
24. typeManagement() 재렌더링 → 새 워크플로우 목록에 포함
    ↓
25. window.composedStages = [] 정리
    window.currentWorkflowId = null 정리
```

## 9. 핵심 함수 호출 그래프

```
typeManagement()
    └─ switchView('workflowCreateUnified')
        └─ workflowCreateUnified(id)
            ├─ renderComposedStagesUnified()
            ├─ openAddStageModal(stepTypeId)
            │   └─ refreshComposedStages()
            │       └─ renderComposedStagesUnified()
            ├─ editStageUnified(index)
            │   └─ refreshComposedStages()
            ├─ deleteStageUnified(index)
            │   └─ refreshComposedStages()
            ├─ moveStageUpUnified(index)
            │   └─ refreshComposedStages()
            ├─ moveStageDownUnified(index)
            │   └─ refreshComposedStages()
            └─ saveUnifiedWorkflow()
                └─ switchView('typeManagement')
```

## 10. 개선 예정 사항 (계획된 변경)

### 10.1 현재 시스템의 복잡도

**문제점**:
1. "단계 유형(템플릿)" 개념이 사용자에게 혼란 야기
2. 왼쪽 패널 → 모달 → 오른쪽 패널 (3단계 상호작용)
3. `mockStepTypes`와 `stages.stepTypeId` 참조 관계 복잡

### 10.2 단순화 계획

**참조**: [stage-management-simplified-implementation.md](docs/stage-management-simplified-implementation.md)

**주요 변경**:
1. `mockStepTypes` 제거 → `mockStageCategories`로 단순화
2. 2단 레이아웃 제거 → 단일 패널 + "단계 추가" 버튼
3. 모든 설정을 단계 레벨에서 직접 입력
4. 카테고리는 순수한 분류자 역할 (이름/색상만)

**목표**:
- 사용자가 직관적
- 클릭 수 감소
- 설정 투명성 향상

## 11. 관련 파일 목록

### 11.1 핵심 파일

1. **[admin/admin_views.js](admin/admin_views.js)**
   - `typeManagement()`: Lines 2626-2710
   - `workflowCreateUnified()`: Lines 2752-2875

2. **[admin/assets/js/mockData.js](admin/assets/js/mockData.js)**
   - `mockStepTypes`: Lines 271-342
   - `mockThesisStages`: 워크플로우 데이터
   - `mockEvaluationTemplates`: 평가표 템플릿

3. **[admin/admin_main.js](admin/admin_main.js)**
   - `switchView()`: 화면 전환
   - `saveUnifiedWorkflow()`: 저장 로직
   - 단계 관리 함수들

### 11.2 관련 문서

1. **[stage-management-simplified-implementation.md](docs/stage-management-simplified-implementation.md)**
   - 단순화 구현 계획

2. **[stage-management-v2-implementation.md](docs/stage-management-v2-implementation.md)**
   - 이전 버전 구현 문서

## 12. 테스트 시나리오

### 12.1 기본 기능 테스트

**워크플로우 등록**:
- [ ] 메뉴 접근: "논문 심사 > 심사 단계 등록"
- [ ] "+ 워크플로우 추가" 버튼 클릭
- [ ] 워크플로우 이름 입력
- [ ] 학위 구분 선택 (석사/박사)
- [ ] 왼쪽에서 단계 유형 클릭 → 모달 열림
- [ ] 단계 이름 입력, 평가 설정
- [ ] 여러 단계 추가
- [ ] 순서 변경 (↑/↓)
- [ ] 단계 수정
- [ ] 단계 삭제
- [ ] "저장 (N개 단계)" 버튼 클릭
- [ ] 목록에서 새 워크플로우 확인

**워크플로우 수정**:
- [ ] 목록에서 "수정" 버튼 클릭
- [ ] 기존 데이터 로드 확인
- [ ] 단계 추가/수정/삭제
- [ ] 저장 후 변경사항 확인

**워크플로우 삭제**:
- [ ] 목록에서 "삭제" 버튼 클릭
- [ ] 확인 대화상자 표시
- [ ] 삭제 후 목록에서 제거 확인

### 12.2 유효성 검사 테스트

- [ ] 워크플로우 이름 없이 저장 시도 → 경고 표시
- [ ] 단계 없이 저장 시도 → 경고 표시
- [ ] 단계 이름 없이 추가 시도 → 경고 표시
- [ ] 평가 필요 체크, 평가표 미선택 → 경고 표시

### 12.3 UI 상태 테스트

- [ ] 단계 0개: 저장 버튼 비활성화
- [ ] 단계 추가: 저장 버튼 활성화, 카운트 업데이트
- [ ] 첫 단계: ↑ 버튼 비활성화
- [ ] 마지막 단계: ↓ 버튼 비활성화
- [ ] 단계 삭제 후: order 재정렬 확인

## 13. 구현 완료 일자

**최초 구현**: 2025-01-15
**문서 작성**: 2025-12-10
**작성자**: Claude Sonnet 4.5
