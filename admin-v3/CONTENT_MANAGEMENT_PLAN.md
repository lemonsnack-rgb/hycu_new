# 연구윤리/논문일정/논문지도절차 콘텐츠 관리 시스템 수정 계획

## 📋 현황 분석

### 현재 구조
1. **[admin_views.js](admin-v3/assets/js/admin_views.js)** (5303-5390행)
   - `views.ethicsList()`, `views.scheduleList()`, `views.procedureList()` 정의됨
   - **문제점**: 학과 목록을 미리 나열하고 "등록 현황" 컬럼으로 등록/미등록 표시
   - 이는 기획 의도와 완전히 상반됨

2. **[content-list-management.js](admin-v3/assets/js/content-list-management.js)**
   - `ContentListManagement` 객체로 학과별 등록 현황 관리
   - **문제점**: 학과 목록을 순회하며 등록/미등록 표시하는 방식 (33-116행)

3. **[content-management.js](admin-v3/assets/js/content-management.js)**
   - `ContentManagement` 객체로 등록/수정 화면 관리
   - **문제점**: 학과명을 매개변수로 받아 표시만 하고, 선택 UI가 없음 (42행)

4. **[content-list-init.js](admin-v3/assets/js/content-list-init.js)**
   - `renderAdminView`를 래핑하여 목록 초기화 수행
   - 구조는 적절하나 content-list-management.js 수정에 따라 동작 유지 확인 필요

---

## 🎯 올바른 기획 의도

### 1. 목록 화면 (ethicsList/scheduleList/procedureList)
- **이미 등록된 콘텐츠만** 테이블로 표시
- **컬럼**: 제목, 대상학과, 최종수정일, 수정자, 관리(수정/삭제)
- **상단**: "신규 등록" 버튼 1개만
- **디자인**: 공지사항 관리(noticeManagement, 5406-5461행)와 동일한 구조/스타일

### 2. 등록/수정 화면
- **학과 선택 드롭다운**: 담당자가 직접 선택 (전체 공개/컴퓨터공학과/경영학과/...)
- **제목 입력 필드**: 사용자가 직접 입력
- **WYSIWYG 에디터**: contenteditable 유지
- **상단**: "목록으로" 버튼
- **하단**: 저장/취소 버튼

---

## 🛠️ 수정 계획

### Step 1: [admin_views.js](admin-v3/assets/js/admin_views.js) 수정 (5303-5390행)

#### 수정 전 (현재)
```javascript
views.ethicsList = () => {
    return `
    <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
            <h3 id="content-list-title" class="text-lg font-bold text-gray-800">연구윤리 관리</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-fixed">
                <thead class="bg-gray-50">
                    <tr>
                        <th>학과</th>
                        <th>등록 현황</th>
                        <th>최종 수정일</th>
                        <th>수정자</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody id="content-table-body">...
```

#### 수정 후 (목표)
```javascript
views.ethicsList = () => {
    return `
    <div class="table-container">
        <div class="table-header">
            <div class="table-header-left">
                <h3 class="table-title">연구윤리 목록</h3>
                <span class="table-count" id="content-count-display">(총 0건)</span>
            </div>
            <div class="table-header-right">
                <button onclick="ContentListManagement.showCreateForm()" class="btn-primary">
                    <i class="fas fa-plus mr-1"></i>신규 등록
                </button>
            </div>
        </div>
        <div class="table-scroll">
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th style="width: 60px;">순번</th>
                        <th>제목</th>
                        <th style="width: 150px;">대상학과</th>
                        <th style="width: 150px;">최종수정일</th>
                        <th style="width: 120px;">수정자</th>
                        <th style="width: 150px;">관리</th>
                    </tr>
                </thead>
                <tbody id="content-table-body">
                    <!-- 동적으로 생성됨 -->
                </tbody>
            </table>
        </div>
    </div>
    `;
};
```

**변경 사항**:
- ✅ 공지사항 관리와 동일한 HTML 구조/클래스 사용
- ✅ "신규 등록" 버튼만 우측 상단에 배치
- ✅ 컬럼: 순번, 제목, 대상학과, 최종수정일, 수정자, 관리
- ✅ Tailwind 임의 사용 제거 → 기존 CSS 클래스 활용

**동일한 패턴으로**:
- `views.scheduleList()` 수정 (제목: "논문일정 목록")
- `views.procedureList()` 수정 (제목: "논문지도절차 목록")

---

### Step 2: [content-list-management.js](admin-v3/assets/js/content-list-management.js) 수정

#### 기존 `loadContentList()` (33-116행) 삭제
- 학과 목록 순회 방식 제거
- 등록/미등록 표시 로직 제거

#### 신규 `loadContentList()` 구현
```javascript
loadContentList() {
    const contentList = getContentList(this.currentContentType);

    const tableBody = document.getElementById('content-table-body');
    if (!tableBody) {
        console.error('content-table-body 요소를 찾을 수 없습니다');
        return;
    }

    // 건수 표시
    const countDisplay = document.getElementById('content-count-display');
    if (countDisplay) {
        countDisplay.textContent = `(총 ${contentList.length}건)`;
    }

    // 등록된 콘텐츠만 테이블에 표시
    let html = '';
    contentList.forEach((content, index) => {
        const deptName = DepartmentUtils.getDepartmentDisplayName(content.department);
        html += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td>${content.title || '-'}</td>
                <td class="text-center">${deptName}</td>
                <td class="text-center">${content.lastModified || '-'}</td>
                <td class="text-center">${content.modifiedBy || '-'}</td>
                <td class="text-center">
                    <button onclick="ContentListManagement.editContent('${content.id}')"
                            class="action-btn action-btn-edit">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button onclick="ContentListManagement.deleteContent('${content.id}')"
                            class="action-btn action-btn-delete">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                </td>
            </tr>
        `;
    });

    if (html === '') {
        html = '<tr><td colspan="6" class="text-center py-4 text-gray-500">등록된 콘텐츠가 없습니다.</td></tr>';
    }

    tableBody.innerHTML = html;
}
```

#### 신규 `showCreateForm()` 추가
```javascript
showCreateForm() {
    if (typeof ContentManagement !== 'undefined' && typeof ContentManagement.showEditForm === 'function') {
        ContentManagement.showEditForm(this.currentContentType, null, null);
    } else {
        console.error('ContentManagement.showEditForm 함수를 찾을 수 없습니다');
    }
}
```

#### `editContent()` 수정 (139-153행)
```javascript
editContent(contentId) {
    const content = getContentById(this.currentContentType, contentId);
    if (!content) {
        alert('콘텐츠를 찾을 수 없습니다.');
        return;
    }

    if (typeof ContentManagement !== 'undefined' && typeof ContentManagement.showEditForm === 'function') {
        ContentManagement.showEditForm(this.currentContentType, content.id, content.department);
    } else {
        console.error('ContentManagement.showEditForm 함수를 찾을 수 없습니다');
    }
}
```

#### `deleteContent()` 수정 (158-177행)
```javascript
deleteContent(contentId) {
    const content = getContentById(this.currentContentType, contentId);
    if (!content) {
        alert('콘텐츠를 찾을 수 없습니다.');
        return;
    }

    const departmentName = DepartmentUtils.getDepartmentDisplayName(content.department);
    if (!confirm(`"${content.title}" (${departmentName})을(를) 삭제하시겠습니까?`)) {
        return;
    }

    const success = deleteContentItem(this.currentContentType, contentId);
    if (success) {
        alert('삭제되었습니다.');
        this.loadContentList();
    } else {
        alert('삭제에 실패했습니다.');
    }
}
```

#### `createContent()` 삭제 (120-135행)
- 학과별 등록 버튼 제거에 따라 불필요

---

### Step 3: [content-management.js](admin-v3/assets/js/content-management.js) 수정

#### `showEditForm()` 매개변수 변경 (27-98행)
```javascript
// 변경 전
showEditForm(contentType, contentId, department)

// 변경 후
showEditForm(contentType, contentId, department = null)
// department가 null이면 신규 등록 모드
```

#### 편집 화면 HTML 수정
```javascript
showEditForm(contentType, contentId, department = null) {
    this.currentContentType = contentType;
    this.currentContentId = contentId;
    this.currentDepartment = department; // 수정 모드에서만 사용

    let content = null;
    if (contentId) {
        content = getContentById(contentType, contentId);
        if (content) {
            this.currentDepartment = content.department;
        }
    }

    const isEdit = !!content;

    const editFormHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-bold text-gray-800">
                        ${this.contentTypeLabels[contentType]} ${isEdit ? '수정' : '등록'}
                    </h3>
                </div>
                <button onclick="ContentManagement.backToList()"
                        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                    <i class="fas fa-arrow-left mr-1"></i>목록으로
                </button>
            </div>
            <div class="p-6">
                <!-- 학과 선택 드롭다운 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">대상 학과</label>
                    <select id="content-department"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            ${isEdit ? 'disabled' : ''}>
                        ${DepartmentUtils.generateDepartmentOptions(true, content?.department || 'all')}
                    </select>
                    ${isEdit ? '<p class="text-xs text-gray-500 mt-1">* 수정 시 학과는 변경할 수 없습니다.</p>' : ''}
                </div>

                <!-- 제목 입력 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
                    <input type="text"
                           id="content-title"
                           value="${content?.title || ''}"
                           placeholder="제목을 입력하세요"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                </div>

                <!-- 에디터 툴바 -->
                <div class="mb-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg flex-wrap">
                    ${this.getToolbarHTML(contentType)}
                </div>

                <!-- 콘텐츠 에디터 -->
                <div id="content-editor"
                     class="border border-gray-300 rounded-lg p-4 min-h-[500px] max-h-[800px] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-primary"
                     contenteditable="true"
                     style="line-height: 1.6;">
                    ${content ? content.content : ''}
                </div>

                <!-- 최종 수정 정보 -->
                ${content ? `
                    <div class="mt-4 text-sm text-gray-500">
                        최종 수정일: ${content.lastModified} (${content.modifiedBy})
                    </div>
                ` : ''}

                <!-- 액션 버튼 -->
                <div class="mt-6 flex items-center justify-end gap-3">
                    <button onclick="ContentManagement.saveContent()"
                            class="px-6 py-2 bg-[#6A0028] text-white rounded hover:bg-[#4A001C]">
                        <i class="fas fa-save mr-1"></i>저장
                    </button>
                    <button onclick="ContentManagement.backToList()"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                        취소
                    </button>
                </div>
            </div>
        </div>
    `;

    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        contentArea.innerHTML = editFormHTML;
    } else {
        console.error('content-area 요소를 찾을 수 없습니다');
    }
}
```

#### `saveContent()` 수정 (202-243행)
```javascript
saveContent() {
    const editor = document.getElementById('content-editor');
    const titleInput = document.getElementById('content-title');
    const departmentSelect = document.getElementById('content-department');

    if (!editor || !titleInput || !departmentSelect) {
        alert('필수 입력 요소를 찾을 수 없습니다.');
        return;
    }

    const title = titleInput.value.trim();
    const department = departmentSelect.value;
    const contentHTML = editor.innerHTML.trim();

    // 유효성 검증
    if (!title) {
        alert('제목을 입력해주세요.');
        titleInput.focus();
        return;
    }

    if (!department) {
        alert('대상 학과를 선택해주세요.');
        departmentSelect.focus();
        return;
    }

    if (!contentHTML) {
        alert('콘텐츠를 입력해주세요.');
        editor.focus();
        return;
    }

    // 중복 체크 (신규 등록 시만)
    if (!this.currentContentId) {
        const duplicate = checkDuplicateContent(this.currentContentType, department);
        if (duplicate) {
            const deptName = DepartmentUtils.getDepartmentDisplayName(department);
            alert(`${deptName}에 이미 ${this.contentTypeLabels[this.currentContentType]} 콘텐츠가 등록되어 있습니다.`);
            return;
        }
    }

    // 콘텐츠 데이터 생성
    const contentData = {
        id: this.currentContentId || undefined,
        department: department,
        title: title,
        content: contentHTML,
        modifiedBy: 'admin'
    };

    // 저장
    const success = saveContentItem(this.currentContentType, contentData);

    if (success) {
        alert('저장되었습니다.');
        this.backToList();
    } else {
        alert('저장에 실패했습니다.');
    }
}
```

---

### Step 4: 기존 뷰 제거 또는 주석 처리

[admin_views.js](admin-v3/assets/js/admin_views.js)의 5205-5298행:
- `views.ethicsContentMgmt`
- `views.scheduleContentMgmt`
- `views.procedureContentMgmt`

이 3개 뷰는 더 이상 사용되지 않으므로:
- **옵션 1**: 완전히 삭제
- **옵션 2**: 주석 처리 (향후 참고용)

→ **권장**: 주석 처리 후 "DEPRECATED" 표시

---

## ✅ 수정 요약

| 파일 | 수정 내용 |
|------|----------|
| [admin_views.js](admin-v3/assets/js/admin_views.js) | • `ethicsList/scheduleList/procedureList` 뷰를 공지사항 구조로 재작성<br>• 기존 학과별 뷰 DEPRECATED 처리 |
| [content-list-management.js](admin-v3/assets/js/content-list-management.js) | • `loadContentList()`: 등록된 콘텐츠만 테이블 렌더링<br>• `showCreateForm()`: 신규 등록 버튼 핸들러<br>• `editContent()`, `deleteContent()`: ID 기반으로 변경<br>• `createContent()` 삭제 |
| [content-management.js](admin-v3/assets/js/content-management.js) | • `showEditForm()`: 학과 선택 드롭다운 + 제목 입력 추가<br>• `saveContent()`: 제목/학과 유효성 검증 추가 |
| [content-list-init.js](admin-v3/assets/js/content-list-init.js) | • 수정 불필요 (동작 유지 확인만) |

---

## 🎨 디자인 참고

**공지사항 관리 ([admin_views.js](admin-v3/assets/js/admin_views.js) 5406-5461행)**와 동일한 구조:
- `.table-container` → 전체 컨테이너
- `.table-header` → 제목 + 버튼 영역
- `.table-header-left` → 좌측 (제목 + 건수)
- `.table-header-right` → 우측 (신규 등록 버튼)
- `.table-scroll` → 테이블 스크롤 영역
- `.btn-primary` → 주요 액션 버튼
- `.action-btn`, `.action-btn-edit`, `.action-btn-delete` → 관리 버튼

---

## 📌 주의사항

1. **Tailwind 클래스 사용 금지**
   - 기존 CSS 클래스 시스템 준수
   - `components-v3.css`에 정의된 클래스만 사용

2. **학과 선택 UX**
   - 신규 등록: 드롭다운으로 자유 선택 (기본값: "전체")
   - 수정: 드롭다운 비활성화 (학과 변경 불가)

3. **중복 체크**
   - 같은 학과에 이미 콘텐츠가 있으면 등록 불가
   - 수정 시에는 중복 체크 무시

4. **데이터 함수**
   - `getContentList(type)`: 전체 목록
   - `getContentById(type, id)`: ID로 조회
   - `saveContentItem(type, data)`: 저장
   - `deleteContentItem(type, id)`: 삭제
   - `checkDuplicateContent(type, dept, excludeId)`: 중복 체크

---

## 🚀 구현 순서

1. [admin_views.js](admin-v3/assets/js/admin_views.js) 수정 (목록 화면 뷰)
2. [content-list-management.js](admin-v3/assets/js/content-list-management.js) 수정 (목록 관리 로직)
3. [content-management.js](admin-v3/assets/js/content-management.js) 수정 (등록/수정 화면)
4. 브라우저 테스트 및 검증

---

## 📝 완료 후 확인 사항

- [ ] 목록 화면에 등록된 콘텐츠만 표시되는가?
- [ ] "신규 등록" 버튼이 우측 상단에 있는가?
- [ ] 등록 화면에 학과 선택 드롭다운이 있는가?
- [ ] 등록 화면에 제목 입력 필드가 있는가?
- [ ] 수정 화면에서 학과가 비활성화되는가?
- [ ] 중복 등록 시 경고가 표시되는가?
- [ ] 삭제 시 확인 메시지가 표시되는가?
- [ ] 공지사항 관리와 동일한 디자인인가?
