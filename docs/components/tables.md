# 테이블 (Tables)

## 기본 테이블 구조

```html
<div class="table-container">
    <!-- 테이블 헤더 (제목 + 버튼) -->
    <div class="table-header">
        <div class="table-header-left">
            <h3 class="table-title">학생 목록</h3>
            <span class="table-count">(총 15건)</span>
        </div>
        <div class="table-header-right">
            <button class="btn btn-primary btn-sm">
                <i class="icon" data-lucide="plus"></i>
                등록
            </button>
        </div>
    </div>

    <!-- 테이블 스크롤 영역 -->
    <div class="table-scroll">
        <table>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>학생명</th>
                    <th>학번</th>
                    <th>상태</th>
                    <th>최종수정일</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>홍길동</td>
                    <td>2024001</td>
                    <td><span class="status-badge status-success">승인</span></td>
                    <td>2025-01-15</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-outline btn-sm">조회</button>
                            <button class="btn btn-outline btn-sm">수정</button>
                        </div>
                    </td>
                </tr>
                <!-- 더 많은 행... -->
            </tbody>
        </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination-wrapper">
        <div class="pagination">
            <button class="page-btn" disabled>
                <i class="icon" data-lucide="chevron-left"></i>
            </button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn">
                <i class="icon" data-lucide="chevron-right"></i>
            </button>
        </div>
    </div>
</div>
```

---

## 테이블 헤더

### 기본 (제목만)
```html
<div class="table-header">
    <div class="table-header-left">
        <h3 class="table-title">목록</h3>
        <span class="table-count">(총 10건)</span>
    </div>
</div>
```

### 제목 + 버튼
```html
<div class="table-header">
    <div class="table-header-left">
        <h3 class="table-title">목록</h3>
        <span class="table-count">(총 10건)</span>
    </div>
    <div class="table-header-right">
        <button class="btn btn-outline btn-sm">엑셀 다운로드</button>
        <button class="btn btn-primary btn-sm">+ 등록</button>
    </div>
</div>
```

### 제목 + 검색 + 버튼
```html
<div class="table-header">
    <div class="table-header-left">
        <h3 class="table-title">목록</h3>
        <span class="table-count">(총 10건)</span>
    </div>
    <div class="table-header-right">
        <div class="search-box">
            <input type="text" placeholder="검색...">
            <i class="search-icon icon" data-lucide="search"></i>
        </div>
        <button class="btn btn-primary btn-sm">+ 등록</button>
    </div>
</div>
```

---

## 테이블 컬럼 타입

### 1. 번호 (좌측 정렬)
```html
<th>번호</th>
<td>1</td>
```

### 2. 텍스트 (중앙 정렬)
```html
<th>학생명</th>
<td>홍길동</td>
```

### 3. 긴 텍스트 (말줄임)
```html
<th>제목</th>
<td class="cell-truncate">매우 긴 제목이 들어갈 경우 말줄임 처리...</td>
```

### 4. 상태 뱃지
```html
<th>상태</th>
<td>
    <span class="status-badge status-success">승인</span>
</td>
```

### 5. D-Day 뱃지
```html
<th>마감일</th>
<td>
    <span class="dday-badge">D-7</span>
</td>
```

### 6. 날짜/시간
```html
<th>작성일</th>
<td>2025-01-15</td>
```

### 7. 액션 버튼
```html
<th>관리</th>
<td>
    <div class="action-buttons">
        <button class="btn btn-outline btn-sm">
            <i class="icon" data-lucide="eye"></i>
        </button>
        <button class="btn btn-outline btn-sm">
            <i class="icon" data-lucide="edit"></i>
        </button>
        <button class="btn btn-outline btn-sm">
            <i class="icon" data-lucide="trash-2"></i>
        </button>
    </div>
</td>
```

---

## 상태 뱃지

### 종류
```html
<!-- 승인/완료 -->
<span class="status-badge status-success">승인</span>
<span class="status-badge status-success">완료</span>

<!-- 대기/진행중 -->
<span class="status-badge status-warning">대기</span>
<span class="status-badge status-warning">진행중</span>

<!-- 반려/마감 -->
<span class="status-badge status-danger">반려</span>
<span class="status-badge status-danger">마감</span>

<!-- 알림 -->
<span class="status-badge status-info">안내</span>

<!-- 기본 -->
<span class="status-badge status-pending">보류</span>

<!-- 중요 -->
<span class="status-badge status-urgent">긴급</span>
```

---

## 빈 상태 (Empty State)

```html
<div class="table-container">
    <div class="table-header">
        <div class="table-header-left">
            <h3 class="table-title">목록</h3>
            <span class="table-count">(총 0건)</span>
        </div>
    </div>

    <div class="table-scroll">
        <table>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4" style="text-align: center; padding: 60px 20px; color: #9CA3AF;">
                        등록된 항목이 없습니다.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

---

## 페이지네이션

### 기본 페이지네이션
```html
<div class="pagination-wrapper">
    <div class="pagination">
        <button class="page-btn" onclick="goPage(1)" disabled>
            <i class="icon" data-lucide="chevron-left"></i>
        </button>

        <button class="page-btn active">1</button>
        <button class="page-btn" onclick="goPage(2)">2</button>
        <button class="page-btn" onclick="goPage(3)">3</button>
        <button class="page-btn">...</button>
        <button class="page-btn" onclick="goPage(10)">10</button>

        <button class="page-btn" onclick="goPage(2)">
            <i class="icon" data-lucide="chevron-right"></i>
        </button>
    </div>
</div>
```

### JavaScript
```javascript
let currentPage = 1;
const totalPages = 10;

function goPage(page) {
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderTable();
    renderPagination();
}

function renderPagination() {
    const pagination = document.querySelector('.pagination');
    let html = `
        <button class="page-btn" onclick="goPage(${currentPage - 1})"
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="icon" data-lucide="chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}"
                    onclick="goPage(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="page-btn" onclick="goPage(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="icon" data-lucide="chevron-right"></i>
        </button>
    `;

    pagination.innerHTML = html;
    lucide.createIcons();
}
```

---

## 클릭 가능한 행

### HTML
```html
<tbody>
    <tr onclick="goToDetail(1)" style="cursor: pointer;">
        <td>1</td>
        <td>제목</td>
        <td>작성자</td>
        <td>2025-01-15</td>
    </tr>
</tbody>
```

### JavaScript
```javascript
function goToDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}
```

---

## 정렬 가능한 테이블

### HTML
```html
<thead>
    <tr>
        <th onclick="sortTable('no')">
            번호
            <i class="icon" data-lucide="arrow-up-down"></i>
        </th>
        <th onclick="sortTable('name')">
            이름
            <i class="icon" data-lucide="arrow-up-down"></i>
        </th>
        <th onclick="sortTable('date')">
            작성일
            <i class="icon" data-lucide="arrow-up-down"></i>
        </th>
    </tr>
</thead>
```

### JavaScript
```javascript
let sortColumn = null;
let sortDirection = 'asc';

function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    // 데이터 정렬 로직
    data.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[column] > b[column] ? 1 : -1;
        } else {
            return a[column] < b[column] ? 1 : -1;
        }
    });

    renderTable();
}
```

---

## 체크박스 선택

### HTML
```html
<thead>
    <tr>
        <th style="width: 50px;">
            <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
        </th>
        <th>번호</th>
        <th>제목</th>
        <th>작성자</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>
            <input type="checkbox" class="row-checkbox" value="1">
        </td>
        <td>1</td>
        <td>제목</td>
        <td>작성자</td>
    </tr>
</tbody>
```

### JavaScript
```javascript
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox');

    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
}

function getSelectedIds() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}
```

---

## 실전 예제

### 학생 목록 테이블
```html
<div class="table-container">
    <div class="table-header">
        <div class="table-header-left">
            <h3 class="table-title">지도 학생 목록</h3>
            <span class="table-count">(총 12명)</span>
        </div>
        <div class="table-header-right">
            <button class="btn btn-outline btn-sm" onclick="downloadExcel()">
                <i class="icon" data-lucide="download"></i>
                엑셀 다운로드
            </button>
        </div>
    </div>

    <div class="table-scroll">
        <table>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>학생명</th>
                    <th>학번</th>
                    <th>논문 제목</th>
                    <th>진행 상태</th>
                    <th>마감일</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>홍길동</td>
                    <td>2024001</td>
                    <td class="cell-truncate">인공지능 기반 데이터 분석 시스템 개발</td>
                    <td><span class="status-badge status-warning">진행중</span></td>
                    <td><span class="dday-badge">D-7</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-outline btn-sm" onclick="viewDetail(1)">
                                <i class="icon" data-lucide="eye"></i>
                            </button>
                            <button class="btn btn-outline btn-sm" onclick="writeFeedback(1)">
                                <i class="icon" data-lucide="edit"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="pagination-wrapper">
        <div class="pagination">
            <button class="page-btn" disabled>
                <i class="icon" data-lucide="chevron-left"></i>
            </button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">
                <i class="icon" data-lucide="chevron-right"></i>
            </button>
        </div>
    </div>
</div>
```

---

## 주의사항

### ✅ DO
- 테이블 제목과 총 개수 항상 표시
- 중요한 컬럼은 왼쪽에 배치
- 액션 버튼은 오른쪽 끝에 배치
- 긴 텍스트는 `cell-truncate` 클래스 사용

### ❌ DON'T
- 테이블에 너무 많은 컬럼 배치 (최대 7~8개 권장)
- 모든 컬럼을 좌측 정렬 하지 않기
- 페이지네이션 없이 긴 목록 표시

---

## 관련 문서
- [디자인 시스템](../design-system-v3.md)
- [Buttons 가이드](./buttons.md)
- [Badges 가이드](./badges.md)
