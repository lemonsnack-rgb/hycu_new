# 카테고리 관리 방안

## 개요
심사 단계 등록 시 사용할 카테고리를 관리자가 직접 추가/수정/삭제할 수 있는 기능

## 1. 카테고리 관리 위치

### 방안 A: 별도 메뉴 (권장)
```
관리자 메뉴:
├─ 논문 심사
│  ├─ 심사 단계 등록        (기존)
│  └─ 카테고리 관리         (신규) ← 여기서 카테고리 추가/수정/삭제
```

**장점**:
- 카테고리를 여러 워크플로우에서 재사용 가능
- 중앙 집중식 관리로 일관성 유지
- 카테고리 변경 시 모든 워크플로우에 일괄 적용

**단점**:
- 메뉴가 하나 더 생김

### 방안 B: 워크플로우 등록 화면 내부
```
심사 단계 등록 화면:
├─ 워크플로우 기본 정보
├─ [+ 단계 추가] 버튼
├─ 단계 카드들
└─ [카테고리 관리] 버튼 ← 모달로 카테고리 추가/수정/삭제
```

**장점**:
- 별도 메뉴 없이 한 화면에서 처리
- 컨텍스트 전환 불필요

**단점**:
- 화면이 복잡해질 수 있음
- 여러 관리자가 동시에 카테고리 수정 시 충돌 가능

## 2. 권장 방안: 방안 A (별도 메뉴)

### 2.1 카테고리 관리 화면

```
┌────────────────────────────────────────────────────────────┐
│ 심사 단계 카테고리 관리              [+ 카테고리 추가]    │
├────────────────────────────────────────────────────────────┤
│ 등록된 카테고리를 관리합니다.                              │
│ 카테고리는 심사 단계 등록 시 분류 용도로 사용됩니다.      │
├────────────────────────────────────────────────────────────┤
│ 번호 │ 카테고리명       │ 색상      │ 사용 횟수 │ 관리  │
├──────┼──────────────────┼───────────┼───────────┼───────┤
│  1   │ 연구계획서 제출   │ ████ 파랑 │ 3개 워크플로우 │ 수정 │
│      │                  │           │           │ 삭제 │
├──────┼──────────────────┼───────────┼───────────┼───────┤
│  2   │ 예비심사         │ ████ 초록 │ 5개 워크플로우 │ 수정 │
│      │                  │           │           │ 삭제 │
├──────┼──────────────────┼───────────┼───────────┼───────┤
│  3   │ 본심사           │ ████ 주황 │ 4개 워크플로우 │ 수정 │
│      │                  │           │           │ 삭제 │
├──────┼──────────────────┼───────────┼───────────┼───────┤
│  4   │ 최종심사         │ ████ 빨강 │ 2개 워크플로우 │ 수정 │
│      │                  │           │           │ 삭제 │
├──────┼──────────────────┼───────────┼───────────┼───────┤
│  5   │ 기타             │ ████ 회색 │ 0개 워크플로우 │ 수정 │
│      │                  │           │           │ 삭제 │
└────────────────────────────────────────────────────────────┘
```

### 2.2 카테고리 추가/수정 모달

```
┌──────────────────────────────────────────┐
│ 카테고리 추가                             │
├──────────────────────────────────────────┤
│                                          │
│ 카테고리명 *                              │
│ [__________________]                     │
│                                          │
│ 색상 선택 *                               │
│ ┌──────────────────────────────────┐    │
│ │ ○ 파랑 (#3B82F6)  ○ 초록 (#10B981) │    │
│ │ ○ 주황 (#F59E0B)  ○ 빨강 (#EF4444) │    │
│ │ ○ 회색 (#6B7280)  ○ 보라 (#8B5CF6) │    │
│ │ ● 사용자 지정: [#______]         │    │
│ └──────────────────────────────────┘    │
│                                          │
│ 미리보기:                                 │
│ ┌──────────────────────────────────┐    │
│ │ [████ 예비심사]                   │    │
│ └──────────────────────────────────┘    │
│                                          │
├──────────────────────────────────────────┤
│              [취소]  [추가]               │
└──────────────────────────────────────────┘
```

### 2.3 카테고리 삭제 시 확인

```
┌──────────────────────────────────────────┐
│ 카테고리 삭제 확인                         │
├──────────────────────────────────────────┤
│                                          │
│ "예비심사" 카테고리를 삭제하시겠습니까?    │
│                                          │
│ ⚠️ 주의사항:                              │
│ • 현재 5개 워크플로우에서 사용 중입니다.   │
│ • 삭제 시 해당 단계들의 카테고리가        │
│   "미분류"로 변경됩니다.                  │
│ • 이 작업은 되돌릴 수 없습니다.           │
│                                          │
├──────────────────────────────────────────┤
│              [취소]  [삭제]               │
└──────────────────────────────────────────┘
```

## 3. 데이터 구조

```javascript
// admin/assets/js/mockData.js

const mockStageCategories = [
  {
    id: 'CAT_001',
    name: '연구계획서 제출',
    color: '#3B82F6',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: 'CAT_002',
    name: '예비심사',
    color: '#10B981',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  // ... 더 많은 카테고리
]
```

## 4. 구현 파일

### 4.1 메뉴 추가

**파일**: `admin/admin-dashboard.html`

```html
<!-- 논문 심사 섹션 -->
<div class="menu-item" data-view="typeManagement">
    심사 단계 등록
</div>
<div class="menu-item" data-view="categoryManagement">
    카테고리 관리
</div>
```

### 4.2 화면 함수

**파일**: `admin/admin_views.js`

```javascript
// 카테고리 관리 화면
categoryManagement: () => {
    const categories = mockStageCategories;

    return `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">
                            심사 단계 카테고리 관리
                        </h3>
                        <p class="text-sm text-gray-600 mt-1">
                            등록된 카테고리를 관리합니다. 카테고리는 심사 단계 등록 시 분류 용도로 사용됩니다.
                        </p>
                    </div>
                    <button onclick="openCategoryModal()"
                            class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                        + 카테고리 추가
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">카테고리명</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">색상</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">사용 횟수</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">관리</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${categories.map((cat, idx) => {
                            // 이 카테고리를 사용하는 단계 개수 계산
                            const usageCount = mockThesisStages
                                .flatMap(wf => wf.stages || [])
                                .filter(stage => stage.categoryId === cat.id)
                                .length;

                            return `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                        ${cat.name}
                                    </td>
                                    <td class="py-3 px-4">
                                        <div class="flex items-center gap-2">
                                            <div class="w-12 h-6 rounded"
                                                 style="background-color: ${cat.color}"></div>
                                            <span class="text-xs text-gray-500">${cat.color}</span>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">
                                        ${usageCount > 0
                                            ? `${usageCount}개 워크플로우`
                                            : '사용 안 함'}
                                    </td>
                                    <td class="py-3 px-4">
                                        <div class="flex gap-2">
                                            <button onclick="openCategoryModal('${cat.id}')"
                                                    class="text-blue-600 hover:underline text-sm">
                                                수정
                                            </button>
                                            <button onclick="deleteCategory('${cat.id}')"
                                                    class="text-red-600 hover:underline text-sm"
                                                    ${usageCount > 0 ? 'title="사용 중인 카테고리입니다"' : ''}>
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
```

### 4.3 카테고리 관리 함수

**파일**: `admin/admin_main.js`

```javascript
// 카테고리 추가/수정 모달
function openCategoryModal(categoryId = null) {
    const isEdit = categoryId !== null;
    const category = isEdit
        ? mockStageCategories.find(c => c.id === categoryId)
        : null;

    const predefinedColors = [
        { name: '파랑', value: '#3B82F6' },
        { name: '초록', value: '#10B981' },
        { name: '주황', value: '#F59E0B' },
        { name: '빨강', value: '#EF4444' },
        { name: '회색', value: '#6B7280' },
        { name: '보라', value: '#8B5CF6' }
    ];

    showModal({
        title: isEdit ? '카테고리 수정' : '카테고리 추가',
        content: `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        카테고리명 *
                    </label>
                    <input type="text"
                           id="category-name"
                           value="${category?.name || ''}"
                           placeholder="예: 예비심사"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        색상 선택 *
                    </label>
                    <div class="grid grid-cols-2 gap-2 mb-2">
                        ${predefinedColors.map(color => `
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio"
                                       name="category-color"
                                       value="${color.value}"
                                       ${category?.color === color.value ? 'checked' : ''}
                                       onchange="updateCategoryPreview()">
                                <div class="w-8 h-8 rounded"
                                     style="background-color: ${color.value}"></div>
                                <span class="text-sm">${color.name}</span>
                            </label>
                        `).join('')}
                    </div>

                    <label class="flex items-center gap-2 mt-3">
                        <input type="radio"
                               name="category-color"
                               value="custom"
                               ${!predefinedColors.find(c => c.value === category?.color) ? 'checked' : ''}
                               onchange="updateCategoryPreview()">
                        <span class="text-sm">사용자 지정:</span>
                        <input type="color"
                               id="custom-color"
                               value="${category?.color || '#3B82F6'}"
                               class="w-16 h-8 border border-gray-300 rounded"
                               onchange="document.querySelector('[value=custom]').checked = true; updateCategoryPreview()">
                    </label>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        미리보기
                    </label>
                    <div id="category-preview"
                         class="inline-block px-3 py-1 rounded text-sm font-medium text-white"
                         style="background-color: ${category?.color || '#3B82F6'}">
                        ${category?.name || '카테고리명'}
                    </div>
                </div>
            </div>
        `,
        onConfirm: () => {
            const name = document.getElementById('category-name').value.trim();
            const colorRadio = document.querySelector('[name=category-color]:checked');
            const color = colorRadio.value === 'custom'
                ? document.getElementById('custom-color').value
                : colorRadio.value;

            // 유효성 검사
            if (!name) {
                alert('카테고리명을 입력하세요.');
                return false;
            }

            // 중복 검사
            const duplicate = mockStageCategories.find(c =>
                c.name === name && c.id !== categoryId
            );
            if (duplicate) {
                alert('이미 존재하는 카테고리명입니다.');
                return false;
            }

            // 저장
            if (isEdit) {
                const index = mockStageCategories.findIndex(c => c.id === categoryId);
                mockStageCategories[index] = {
                    ...mockStageCategories[index],
                    name,
                    color,
                    updatedAt: new Date().toISOString().split('T')[0]
                };
            } else {
                mockStageCategories.push({
                    id: `CAT_${Date.now()}`,
                    name,
                    color,
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0]
                });
            }

            showNotification(
                `카테고리가 ${isEdit ? '수정' : '추가'}되었습니다.`,
                'success'
            );

            // 화면 갱신
            switchView('categoryManagement');

            return true;
        }
    });
}

// 미리보기 업데이트
function updateCategoryPreview() {
    const name = document.getElementById('category-name').value.trim() || '카테고리명';
    const colorRadio = document.querySelector('[name=category-color]:checked');
    const color = colorRadio?.value === 'custom'
        ? document.getElementById('custom-color').value
        : colorRadio?.value || '#3B82F6';

    const preview = document.getElementById('category-preview');
    preview.textContent = name;
    preview.style.backgroundColor = color;
}

// 카테고리 삭제
function deleteCategory(categoryId) {
    const category = mockStageCategories.find(c => c.id === categoryId);

    // 사용 횟수 계산
    const usageCount = mockThesisStages
        .flatMap(wf => wf.stages || [])
        .filter(stage => stage.categoryId === categoryId)
        .length;

    let confirmMessage = `"${category.name}" 카테고리를 삭제하시겠습니까?`;

    if (usageCount > 0) {
        confirmMessage += `\n\n주의: 현재 ${usageCount}개 워크플로우에서 사용 중입니다.\n삭제 시 해당 단계들의 카테고리가 "미분류"로 변경됩니다.\n이 작업은 되돌릴 수 없습니다.`;
    }

    if (!confirm(confirmMessage)) {
        return;
    }

    // 카테고리 삭제
    const index = mockStageCategories.findIndex(c => c.id === categoryId);
    mockStageCategories.splice(index, 1);

    // 사용 중인 단계들의 카테고리를 null로 변경
    if (usageCount > 0) {
        mockThesisStages.forEach(workflow => {
            if (workflow.stages) {
                workflow.stages.forEach(stage => {
                    if (stage.categoryId === categoryId) {
                        stage.categoryId = null;
                    }
                });
            }
        });
    }

    showNotification('카테고리가 삭제되었습니다.', 'success');

    // 화면 갱신
    switchView('categoryManagement');
}
```

## 5. 워크플로우 등록 화면에서의 사용

단계 추가 시 카테고리 드롭다운에 자동 반영:

```javascript
// 카테고리 선택
<select class="stage-category w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
    <option value="">미분류</option>
    ${mockStageCategories.map(cat => `
        <option value="${cat.id}"
                ${stage?.categoryId === cat.id ? 'selected' : ''}
                style="color: ${cat.color}">
            ${cat.name}
        </option>
    `).join('')}
</select>
```

## 6. 초기 데이터 (기본 카테고리)

시스템 최초 설치 시 기본으로 제공되는 카테고리:

```javascript
const mockStageCategories = [
  { id: 'CAT_001', name: '연구계획서 제출', color: '#3B82F6', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'CAT_002', name: '예비심사', color: '#10B981', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'CAT_003', name: '본심사', color: '#F59E0B', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'CAT_004', name: '최종심사', color: '#EF4444', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'CAT_005', name: '기타', color: '#6B7280', createdAt: '2025-01-01', updatedAt: '2025-01-01' }
]
```

## 7. 구현 우선순위

### Phase 1: 필수 기능 (MVP)
- [x] 카테고리 목록 조회
- [x] 카테고리 추가
- [x] 카테고리 수정
- [x] 카테고리 삭제 (사용 여부 확인)

### Phase 2: 개선 기능
- [ ] 카테고리 순서 변경 (드래그 앤 드롭)
- [ ] 카테고리 일괄 가져오기/내보내기 (JSON)
- [ ] 카테고리 사용 통계 (대시보드)

## 구현 일자
2025-12-10

## 작성자
Claude Sonnet 4.5
