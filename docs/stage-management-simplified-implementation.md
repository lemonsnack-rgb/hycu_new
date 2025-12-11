# 심사 단계 등록 시스템 단순화 구현 계획

## 개요
기존의 "단계 유형 템플릿 → 선택 → 조립" 방식을 제거하고, **직접 입력 + 카테고리 분류** 방식으로 단순화

## 설계 원칙
1. **사용자가 직관적**: 복잡한 템플릿 개념 제거
2. **클릭 적게하는 방향**: 단일 화면에서 모든 설정 완료
3. **카테고리는 단순 분류자**: 설정을 상속하지 않음
4. **모든 설정은 단계 레벨**: 각 단계에서 개별 설정

## 주요 변경사항

### 1. 데이터 구조 변경

#### 기존: mockStepTypes (단계 유형 템플릿)
```javascript
// admin/assets/js/mockData.js Lines 271-342
const mockStepTypes = [
  {
    id: 'TYPE_001',
    name: '연구계획서 제출',
    description: '...',
    requiresDocument: true,
    requiresPresentation: false,
    isReviewStage: false  // 복잡한 템플릿 설정
  }
]
```

#### 신규: mockStageCategories (단순 카테고리)
```javascript
// 카테고리는 이름과 색상만 - 설정 없음
// 관리자가 직접 추가/수정/삭제 가능
const mockStageCategories = [
  { id: 'CAT_001', name: '연구계획서 제출', color: '#3B82F6' },
  { id: 'CAT_002', name: '예비심사', color: '#10B981' },
  { id: 'CAT_003', name: '본심사', color: '#F59E0B' },
  { id: 'CAT_004', name: '최종심사', color: '#EF4444' },
  { id: 'CAT_005', name: '기타', color: '#6B7280' }
]
```

#### 신규: 단계 데이터 구조 (모든 설정 포함)
```javascript
const stage = {
  id: 'STAGE_001',
  workflowId: 'WF_001',  // 소속 워크플로우
  order: 1,  // 순서

  // 기본 정보
  name: '1차 예비심사',  // 사용자 직접 입력
  categoryId: 'CAT_002',  // 카테고리 선택 (예비심사)
  description: '...',

  // 제출 요구사항 (단계별 설정)
  requiresDocument: true,
  requiresPresentation: true,

  // 제출 기간 (항상 표시)
  submissionStartDate: '2025-03-01',
  submissionEndDate: '2025-03-15',

  // 심사 기간 (평가표가 있을 때만 활성화)
  reviewStartDate: '2025-04-01',  // evaluationTemplateId 있을 때만 입력 가능
  reviewEndDate: '2025-04-15',

  // 평가표 설정
  evaluationTemplateId: 'EVAL001'  // null이면 "평가 없음"
}
```

### 2. UI 구조 변경

#### 기존 구조 (두 패널 레이아웃)
```
[왼쪽 패널: 단계 유형 목록]  |  [오른쪽 패널: 조립된 단계들]
- 연구계획서 제출            |  1. [선택된 단계 1]
- 예비심사                   |  2. [선택된 단계 2]
- 본심사                     |  + 단계 추가
```

#### 신규 구조 (단일 패널)
```
[심사 단계 구성]
워크플로우 이름: [____________]
학위 구분: [석사 ▼]

+ 단계 추가 버튼

[단계 카드 1]
  카테고리: [예비심사 ▼]
  단계 이름: [1차 예비심사]
  □ 문서 제출 필요  □ 발표 필요
  제출기간: [2025-03-01] ~ [2025-03-15]
  평가표: [예비심사 평가표 ▼] (또는 "평가 없음")
  심사기간: [2025-04-01] ~ [2025-04-15]  ← 평가표 선택 시에만 활성화
  [삭제] [↑] [↓]

[단계 카드 2]
  카테고리: [예비심사 ▼]
  단계 이름: [2차 예비심사]
  ...

[저장] [취소]
```

### 3. 파일별 수정 내용

#### admin/assets/js/mockData.js

**삭제 대상:**
- Lines 271-342: `mockStepTypes` 전체 제거

**추가 대상:**
```javascript
// 단순 카테고리 (템플릿 아님)
const mockStageCategories = [
  { id: 'CAT_001', name: '연구계획서 제출', color: '#3B82F6', icon: '📄' },
  { id: 'CAT_002', name: '예비심사', color: '#10B981', icon: '📝' },
  { id: 'CAT_003', name: '본심사', color: '#F59E0B', icon: '✅' },
  { id: 'CAT_004', name: '최종심사', color: '#EF4444', icon: '🎓' },
  { id: 'CAT_005', name: '기타', color: '#6B7280', icon: '📋' }
]

// mockThesisStages 구조 업데이트
const mockThesisStages = [
  {
    id: 'STAGE_001',
    workflowId: 'WF_001',
    order: 1,
    name: '연구계획서 제출',
    categoryId: 'CAT_001',
    description: '연구계획서 작성 및 제출',
    requiresDocument: true,
    requiresPresentation: false,
    submissionStartDate: '2025-03-01',
    submissionEndDate: '2025-03-15',
    reviewStartDate: null,
    reviewEndDate: null,
    evaluationTemplateId: null
  },
  {
    id: 'STAGE_002',
    workflowId: 'WF_001',
    order: 2,
    name: '1차 예비심사',
    categoryId: 'CAT_002',
    description: '첫 번째 예비심사',
    requiresDocument: true,
    requiresPresentation: true,
    submissionStartDate: '2025-04-01',
    submissionEndDate: '2025-04-15',
    reviewStartDate: '2025-05-01',
    reviewEndDate: '2025-05-15',
    evaluationTemplateId: 'EVAL001'
  },
  // ... 추가 단계들
]
```

#### admin/admin_views.js

**Lines 2626-2710: typeManagement 뷰 (심사 단계 목록)**
- 변경사항 없음 (워크플로우 목록 조회 화면 유지)
- 테이블 컬럼: 워크플로우명, 학위구분, 단계 수, 단계 구성, 관리 (상세보기)

**Lines 2751+: workflowCreateUnified 뷰 (완전 재작성)**
```javascript
function workflowCreateUnified(isEditMode = false, workflowId = null) {
  let workflow = null
  let stages = []

  if (isEditMode && workflowId) {
    workflow = mockThesisWorkflows.find(w => w.id === workflowId)
    stages = mockThesisStages
      .filter(s => s.workflowId === workflowId)
      .sort((a, b) => a.order - b.order)
  }

  return `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold mb-6">
        ${isEditMode ? '심사 단계 수정' : '심사 단계 등록'}
      </h2>

      <!-- 워크플로우 기본 정보 -->
      <div class="mb-8 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            워크플로우 이름
          </label>
          <input type="text" id="workflowName"
            value="${workflow?.name || ''}"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="예: 석사 표준 과정">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            학위 구분
          </label>
          <select id="degreeType" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="석사" ${workflow?.degreeType === '석사' ? 'selected' : ''}>석사</option>
            <option value="박사" ${workflow?.degreeType === '박사' ? 'selected' : ''}>박사</option>
            <option value="석박사통합" ${workflow?.degreeType === '석박사통합' ? 'selected' : ''}>석박사통합</option>
          </select>
        </div>
      </div>

      <!-- 단계 추가 버튼 -->
      <div class="mb-6">
        <button onclick="addStageCard()"
          class="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2">
          <span class="text-xl">+</span>
          <span>단계 추가</span>
        </button>
      </div>

      <!-- 단계 카드 컨테이너 -->
      <div id="stageCardsContainer" class="space-y-4">
        ${stages.length === 0 ? `
          <div class="text-center py-12 text-gray-500">
            <p>추가된 단계가 없습니다.</p>
            <p class="text-sm mt-2">위의 "단계 추가" 버튼을 클릭하여 시작하세요.</p>
          </div>
        ` : stages.map((stage, index) => renderStageCard(stage, index)).join('')}
      </div>

      <!-- 하단 버튼 -->
      <div class="mt-8 flex gap-3 justify-end">
        <button onclick="showView('typeManagement')"
          class="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          취소
        </button>
        <button onclick="saveWorkflow(${isEditMode}, '${workflowId}')"
          class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          ${isEditMode ? '수정 완료' : '등록'}
        </button>
      </div>
    </div>
  `
}

// 단계 카드 렌더링
function renderStageCard(stage = null, index = 0) {
  const tempId = stage?.id || `TEMP_${Date.now()}_${index}`
  const hasEvaluation = stage?.evaluationTemplateId !== null

  return `
    <div class="border border-gray-300 rounded-lg p-6 bg-gray-50" data-stage-id="${tempId}">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-lg font-semibold text-gray-700">단계 ${index + 1}</span>
        </div>
        <div class="flex gap-2">
          <button onclick="moveStageUp('${tempId}')"
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white"
            ${index === 0 ? 'disabled class="opacity-50 cursor-not-allowed"' : ''}>
            ↑
          </button>
          <button onclick="moveStageDown('${tempId}')"
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white">
            ↓
          </button>
          <button onclick="removeStageCard('${tempId}')"
            class="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50">
            삭제
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <!-- 카테고리 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select class="stage-category w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
            ${mockStageCategories.map(cat => `
              <option value="${cat.id}" ${stage?.categoryId === cat.id ? 'selected' : ''}>
                ${cat.icon} ${cat.name}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- 단계 이름 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            단계 이름
          </label>
          <input type="text" class="stage-name w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            value="${stage?.name || ''}"
            placeholder="예: 1차 예비심사">
        </div>

        <!-- 제출 요구사항 -->
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="stage-requires-document"
              ${stage?.requiresDocument ? 'checked' : ''}>
            <span class="text-sm text-gray-700">문서 제출 필요</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" class="stage-requires-presentation"
              ${stage?.requiresPresentation ? 'checked' : ''}>
            <span class="text-sm text-gray-700">발표 필요</span>
          </label>
        </div>

        <!-- 제출 기간 (항상 표시) -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              제출 시작일
            </label>
            <input type="date" class="stage-submission-start w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              value="${stage?.submissionStartDate || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              제출 마감일
            </label>
            <input type="date" class="stage-submission-end w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              value="${stage?.submissionEndDate || ''}">
          </div>
        </div>

        <!-- 평가표 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            평가표
          </label>
          <select class="stage-evaluation-template w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            onchange="toggleReviewPeriod('${tempId}')">
            <option value="">평가 없음</option>
            ${mockEvaluationTemplates.map(tpl => `
              <option value="${tpl.id}" ${stage?.evaluationTemplateId === tpl.id ? 'selected' : ''}>
                ${tpl.name}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- 심사 기간 (평가표 선택 시에만 활성화) -->
        <div class="review-period-section grid grid-cols-2 gap-4 ${!hasEvaluation ? 'opacity-50' : ''}">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              심사 시작일
            </label>
            <input type="date" class="stage-review-start w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              value="${stage?.reviewStartDate || ''}"
              ${!hasEvaluation ? 'disabled' : ''}>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              심사 마감일
            </label>
            <input type="date" class="stage-review-end w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              value="${stage?.reviewEndDate || ''}"
              ${!hasEvaluation ? 'disabled' : ''}>
          </div>
        </div>

        <!-- 설명 (선택사항) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            설명 (선택사항)
          </label>
          <textarea class="stage-description w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            rows="2"
            placeholder="이 단계에 대한 추가 설명...">${stage?.description || ''}</textarea>
        </div>
      </div>
    </div>
  `
}
```

#### admin/admin_main.js

**새로운 함수 추가:**
```javascript
// 단계 카드 추가
function addStageCard() {
  const container = document.getElementById('stageCardsContainer')
  const emptyMessage = container.querySelector('.text-center')
  if (emptyMessage) emptyMessage.remove()

  const currentCards = container.querySelectorAll('[data-stage-id]')
  const newIndex = currentCards.length

  const newCard = document.createElement('div')
  newCard.innerHTML = renderStageCard(null, newIndex)
  container.appendChild(newCard.firstElementChild)
}

// 단계 카드 제거
function removeStageCard(stageId) {
  const card = document.querySelector(`[data-stage-id="${stageId}"]`)
  if (confirm('이 단계를 삭제하시겠습니까?')) {
    card.remove()
    renumberStageCards()
  }
}

// 단계 순서 변경
function moveStageUp(stageId) {
  const card = document.querySelector(`[data-stage-id="${stageId}"]`)
  const prev = card.previousElementSibling
  if (prev) {
    card.parentNode.insertBefore(card, prev)
    renumberStageCards()
  }
}

function moveStageDown(stageId) {
  const card = document.querySelector(`[data-stage-id="${stageId}"]`)
  const next = card.nextElementSibling
  if (next) {
    card.parentNode.insertBefore(next, card)
    renumberStageCards()
  }
}

// 단계 번호 재정렬
function renumberStageCards() {
  const cards = document.querySelectorAll('[data-stage-id]')
  cards.forEach((card, index) => {
    const label = card.querySelector('.text-lg.font-semibold')
    label.textContent = `단계 ${index + 1}`
  })
}

// 평가표 선택 시 심사 기간 활성화/비활성화
function toggleReviewPeriod(stageId) {
  const card = document.querySelector(`[data-stage-id="${stageId}"]`)
  const evaluationSelect = card.querySelector('.stage-evaluation-template')
  const reviewSection = card.querySelector('.review-period-section')
  const reviewInputs = reviewSection.querySelectorAll('input')

  if (evaluationSelect.value) {
    reviewSection.classList.remove('opacity-50')
    reviewInputs.forEach(input => input.disabled = false)
  } else {
    reviewSection.classList.add('opacity-50')
    reviewInputs.forEach(input => {
      input.disabled = true
      input.value = ''
    })
  }
}

// 워크플로우 저장
function saveWorkflow(isEditMode, workflowId) {
  // 기본 정보 수집
  const name = document.getElementById('workflowName').value.trim()
  const degreeType = document.getElementById('degreeType').value

  if (!name) {
    alert('워크플로우 이름을 입력하세요.')
    return
  }

  // 단계 데이터 수집
  const stageCards = document.querySelectorAll('[data-stage-id]')
  if (stageCards.length === 0) {
    alert('최소 1개 이상의 단계를 추가하세요.')
    return
  }

  const stages = []
  let isValid = true

  stageCards.forEach((card, index) => {
    const stageName = card.querySelector('.stage-name').value.trim()
    const categoryId = card.querySelector('.stage-category').value
    const requiresDocument = card.querySelector('.stage-requires-document').checked
    const requiresPresentation = card.querySelector('.stage-requires-presentation').checked
    const submissionStart = card.querySelector('.stage-submission-start').value
    const submissionEnd = card.querySelector('.stage-submission-end').value
    const evaluationTemplateId = card.querySelector('.stage-evaluation-template').value || null
    const reviewStart = card.querySelector('.stage-review-start').value
    const reviewEnd = card.querySelector('.stage-review-end').value
    const description = card.querySelector('.stage-description').value.trim()

    // 유효성 검사
    if (!stageName) {
      alert(`단계 ${index + 1}의 이름을 입력하세요.`)
      isValid = false
      return
    }

    if (!submissionStart || !submissionEnd) {
      alert(`단계 ${index + 1}의 제출 기간을 입력하세요.`)
      isValid = false
      return
    }

    if (evaluationTemplateId && (!reviewStart || !reviewEnd)) {
      alert(`단계 ${index + 1}의 심사 기간을 입력하세요. (평가표가 선택되었습니다)`)
      isValid = false
      return
    }

    stages.push({
      order: index + 1,
      name: stageName,
      categoryId,
      requiresDocument,
      requiresPresentation,
      submissionStartDate: submissionStart,
      submissionEndDate: submissionEnd,
      evaluationTemplateId,
      reviewStartDate: evaluationTemplateId ? reviewStart : null,
      reviewEndDate: evaluationTemplateId ? reviewEnd : null,
      description
    })
  })

  if (!isValid) return

  // 저장 로직 (실제로는 API 호출)
  console.log('Saving workflow:', { name, degreeType, stages })
  alert(`워크플로우가 ${isEditMode ? '수정' : '등록'}되었습니다.`)
  showView('typeManagement')
}
```

## 구현 순서

1. **mockData.js 수정**:
   - mockStepTypes 제거
   - mockStageCategories 추가
   - mockThesisStages 구조 업데이트

2. **admin_views.js 수정**:
   - workflowCreateUnified 함수 재작성
   - renderStageCard 함수 추가

3. **admin_main.js 수정**:
   - 단계 카드 관리 함수들 추가
   - saveWorkflow 함수 구현

4. **테스트**:
   - 단계 추가/삭제/순서변경
   - 평가표 선택 시 심사 기간 활성화
   - 유효성 검사
   - 저장 기능

## 예상 사용 시나리오

### 시나리오 1: 석사 표준 과정 생성
1. "심사 단계 등록" 메뉴 클릭
2. 워크플로우 이름: "석사 표준 과정"
3. 학위 구분: "석사"
4. "+ 단계 추가" 클릭
   - 카테고리: "연구계획서 제출"
   - 이름: "연구계획서 제출"
   - 문서 제출: ✓
   - 제출기간: 2025-03-01 ~ 2025-03-15
   - 평가표: "평가 없음"
5. "+ 단계 추가" 클릭
   - 카테고리: "예비심사"
   - 이름: "1차 예비심사"
   - 문서 제출: ✓, 발표: ✓
   - 제출기간: 2025-04-01 ~ 2025-04-15
   - 평가표: "예비심사 평가표" (심사기간 자동 활성화)
   - 심사기간: 2025-05-01 ~ 2025-05-15
6. "+ 단계 추가" 클릭 (같은 "예비심사" 카테고리 반복 등록)
   - 카테고리: "예비심사" (1차와 동일한 카테고리 선택)
   - 이름: "2차 예비심사" (개별 이름 지정)
   - 문서 제출: ✓, 발표: ✓
   - 제출기간: 2025-06-01 ~ 2025-06-15
   - 평가표: "예비심사 평가표"
   - 심사기간: 2025-07-01 ~ 2025-07-15
7. "등록" 버튼 클릭

### 시나리오 2: 평가 없는 단계 추가
- 평가표를 "평가 없음"으로 선택
- 심사기간 필드가 비활성화되고 회색으로 표시됨
- 제출기간만 입력

## 개선 효과

1. **클릭 수 감소**:
   - 기존: 왼쪽 패널에서 선택 → 오른쪽 패널에 추가 → 상세 설정
   - 개선: 단계 추가 → 모든 설정 한 번에 입력

2. **직관성 향상**:
   - 기존: "단계 유형"과 "단계"의 차이 혼란
   - 개선: 단계 = 실제 단계, 카테고리 = 분류 (명확함)

3. **유연성 증가**:
   - 같은 카테고리를 반복 등록 가능 (예: 예비심사 카테고리를 2번 추가)
   - 각 단계마다 개별 이름 설정 (1차 예비심사, 2차 예비심사)
   - 각 단계마다 다른 설정 가능 (다른 평가표, 다른 기간 등)

4. **설정 투명성**:
   - 모든 설정이 단계 카드에 명시적으로 표시
   - 템플릿 상속으로 인한 혼란 제거

## 구현 완료 후 확인사항

- [ ] 카테고리는 단순 분류자 역할만 수행 (설정 상속 없음)
- [ ] 각 단계에서 모든 설정을 개별적으로 입력 가능
- [ ] 제출기간은 항상 표시
- [ ] 심사기간은 평가표 선택 시에만 활성화
- [ ] 같은 카테고리를 반복 등록 가능 (동일 카테고리 여러 번 추가)
- [ ] 각 단계에 개별 이름 지정 가능
- [ ] 단계 순서 변경 가능
- [ ] 단계 삭제 가능
- [ ] 유효성 검사 작동

## 구현 일자
2025-12-10

## 구현자
Claude Sonnet 4.5
