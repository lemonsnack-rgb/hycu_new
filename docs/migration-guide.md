# 마이그레이션 가이드

기존 화면(professor, student, admin)을 Design System v3로 변환하는 가이드입니다.

---

## 단계별 마이그레이션

### 1단계: CSS 파일 교체

#### 기존 CSS 제거
```html
<!-- 삭제할 CSS -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link rel="stylesheet" href="assets/css/old-style.css">
```

#### 새 CSS 추가
```html
<!-- Pretendard 폰트 -->
<link rel="stylesheet" as="style" crossorigin
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />

<!-- Design System v3 CSS -->
<link rel="stylesheet" href="assets/css/design-system-v3.css">
<link rel="stylesheet" href="assets/css/layout-v3.css">
<link rel="stylesheet" href="assets/css/components-v3.css">
<link rel="stylesheet" href="assets/css/table-standard.css">
```

---

### 2단계: HTML 구조 변경

#### Before (Tailwind 기반)
```html
<body class="bg-gray-50">
    <div class="flex">
        <aside class="w-64 bg-white shadow-lg">
            <!-- 사이드바 -->
        </aside>

        <main class="flex-1">
            <header class="bg-white shadow p-4">
                <h1 class="text-2xl font-bold">제목</h1>
            </header>

            <div class="p-6">
                <!-- 콘텐츠 -->
            </div>
        </main>
    </div>
</body>
```

#### After (Design System v3)
```html
<body>
    <div class="layout-container">
        <!-- 사이드바 -->
        <aside class="sidebar">...</aside>

        <!-- 메인 콘텐츠 -->
        <div class="main-content">
            <!-- 유틸리티 헤더 -->
            <header class="utility-header">...</header>

            <!-- 페이지 헤더 -->
            <div class="page-header">
                <div class="page-header-left">
                    <h1 class="page-title">제목</h1>
                </div>
            </div>

            <!-- 콘텐츠 영역 -->
            <main class="content-area">
                <!-- 콘텐츠 -->
            </main>
        </div>
    </div>
</body>
```

---

### 3단계: 컴포넌트 변환

#### 버튼 변환

**Before:**
```html
<button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
    등록
</button>

<button class="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50">
    취소
</button>
```

**After:**
```html
<button class="btn btn-primary">등록</button>
<button class="btn btn-outline">취소</button>
```

---

#### 테이블 변환

**Before:**
```html
<div class="bg-white rounded shadow p-6">
    <h3 class="text-lg font-bold mb-4">목록</h3>

    <table class="min-w-full">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3">번호</th>
                <th class="px-6 py-3">제목</th>
            </tr>
        </thead>
        <tbody>
            <tr class="border-b hover:bg-gray-50">
                <td class="px-6 py-4">1</td>
                <td class="px-6 py-4">제목</td>
            </tr>
        </tbody>
    </table>
</div>
```

**After:**
```html
<div class="table-container">
    <div class="table-header">
        <div class="table-header-left">
            <h3 class="table-title">목록</h3>
            <span class="table-count">(총 10건)</span>
        </div>
    </div>

    <div class="table-scroll">
        <table>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>제목</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

---

#### 폼 변환

**Before:**
```html
<div class="mb-4">
    <label class="block text-sm font-medium mb-2">이름</label>
    <input type="text" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2">
</div>
```

**After:**
```html
<div class="form-group">
    <label class="form-label">이름</label>
    <input type="text" class="form-control">
</div>
```

---

#### 상태 뱃지 변환

**Before:**
```html
<span class="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">승인</span>
<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">대기</span>
<span class="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">반려</span>
```

**After:**
```html
<span class="status-badge status-success">승인</span>
<span class="status-badge status-warning">대기</span>
<span class="status-badge status-danger">반려</span>
```

---

#### 모달 변환

**Before:**
```html
<div id="modal" class="fixed inset-0 bg-black bg-opacity-50 hidden" onclick="closeModal()">
    <div class="bg-white rounded-lg p-6 max-w-md mx-auto mt-20" onclick="event.stopPropagation()">
        <h3 class="text-xl font-bold mb-4">제목</h3>
        <div class="mb-4">
            <p>내용</p>
        </div>
        <div class="flex justify-end gap-2">
            <button class="px-4 py-2 border rounded" onclick="closeModal()">취소</button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded">확인</button>
        </div>
    </div>
</div>
```

**After:**
```html
<div id="modal" class="modal-overlay" onclick="closeModal('modal')">
    <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>제목</h3>
            <button onclick="closeModal('modal')" class="modal-close">&times;</button>
        </div>

        <div class="modal-body">
            <p>내용</p>
        </div>

        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal')">취소</button>
            <button class="btn btn-primary">확인</button>
        </div>
    </div>
</div>
```

---

### 4단계: 색상 변경

#### Tailwind 색상 → Design System v3 색상 매핑

| Tailwind | Design System v3 | 용도 |
|----------|------------------|------|
| `bg-blue-600` | `btn-primary` | Primary 버튼 |
| `text-blue-600` | `color: var(--color-primary)` | Primary 텍스트 |
| `bg-green-100` | `status-badge status-success` | 승인 상태 |
| `bg-yellow-100` | `status-badge status-warning` | 대기 상태 |
| `bg-red-100` | `status-badge status-danger` | 반려 상태 |
| `bg-gray-50` | `background: var(--color-gray-4)` | 배경 |
| `border-gray-300` | `border: 1px solid var(--color-border)` | 테두리 |

---

### 5단계: 아이콘 교체

#### Before (Font Awesome 또는 인라인 SVG)
```html
<i class="fas fa-plus"></i>
<svg>...</svg>
```

#### After (Lucide Icons)
```html
<i class="icon" data-lucide="plus"></i>

<!-- JavaScript -->
<script src="https://unpkg.com/lucide@latest"></script>
<script>
    lucide.createIcons();
</script>
```

**자주 사용하는 아이콘 매핑:**
| 용도 | Lucide 아이콘 이름 |
|------|-------------------|
| 추가 | `plus` |
| 검색 | `search` |
| 편집 | `edit` |
| 삭제 | `trash-2` |
| 조회 | `eye` |
| 다운로드 | `download` |
| 업로드 | `upload` |
| 설정 | `settings` |
| 알림 | `bell` |
| 사용자 | `user` |

---

## 실전 예제: 학생 목록 화면 마이그레이션

### Before (Tailwind)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>학생 목록</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="flex">
        <aside class="w-64 bg-white shadow-lg h-screen">
            <!-- 사이드바 -->
        </aside>

        <main class="flex-1">
            <header class="bg-white shadow p-4">
                <h1 class="text-2xl font-bold">학생 목록</h1>
            </header>

            <div class="p-6">
                <div class="bg-white rounded shadow p-6">
                    <div class="flex justify-between mb-4">
                        <h3 class="text-lg font-bold">목록 (총 10명)</h3>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded">
                            등록
                        </button>
                    </div>

                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3">번호</th>
                                <th class="px-6 py-3">학생명</th>
                                <th class="px-6 py-3">학번</th>
                                <th class="px-6 py-3">상태</th>
                                <th class="px-6 py-3">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b hover:bg-gray-50">
                                <td class="px-6 py-4">1</td>
                                <td class="px-6 py-4">홍길동</td>
                                <td class="px-6 py-4">2024001</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                        승인
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <button class="text-blue-600">조회</button>
                                    <button class="text-red-600">삭제</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
```

### After (Design System v3)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>학생 목록</title>

    <!-- Pretendard 폰트 -->
    <link rel="stylesheet" as="style" crossorigin
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />

    <!-- Design System v3 CSS -->
    <link rel="stylesheet" href="assets/css/design-system-v3.css">
    <link rel="stylesheet" href="assets/css/layout-v3.css">
    <link rel="stylesheet" href="assets/css/components-v3.css">
    <link rel="stylesheet" href="assets/css/table-standard.css">
</head>
<body>
    <div class="layout-container">
        <!-- 사이드바 -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo-area">
                    <div class="sidebar-logo">HYCU</div>
                    <span class="sidebar-title">논문지도시스템</span>
                </div>
                <button class="sidebar-toggle" onclick="toggleSidebar()">
                    <i class="icon" data-lucide="chevron-left"></i>
                </button>
            </div>

            <nav class="sidebar-nav">
                <!-- 메뉴 구조 -->
            </nav>

            <div class="sidebar-footer">
                <div class="sidebar-logout">
                    <i class="icon" data-lucide="log-out"></i>
                    <span>로그아웃</span>
                </div>
            </div>
        </aside>

        <!-- 메인 콘텐츠 -->
        <div class="main-content">
            <!-- 유틸리티 헤더 -->
            <header class="utility-header">
                <div class="utility-left">
                    <button class="sidebar-open-btn" onclick="toggleSidebar()">
                        <i class="icon" data-lucide="menu"></i>
                    </button>
                    <nav class="breadcrumb">
                        <a href="#">홈</a>
                        <span class="breadcrumb-separator">›</span>
                        <span class="breadcrumb-current">학생 목록</span>
                    </nav>
                </div>
                <div class="utility-right">
                    <button class="utility-icon-btn">
                        <i class="icon" data-lucide="bell"></i>
                    </button>
                    <div class="utility-user">
                        <span class="user-role">관리자</span>
                        <span class="user-divider">│</span>
                        <span class="user-name">김관리자</span>
                    </div>
                </div>
            </header>

            <!-- 페이지 헤더 -->
            <div class="page-header">
                <div class="page-header-left">
                    <h1 class="page-title">학생 목록</h1>
                    <p class="page-help-text">전체 학생을 조회하고 관리합니다</p>
                </div>
            </div>

            <!-- 콘텐츠 영역 -->
            <main class="content-area">
                <div class="table-container">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">학생 목록</h3>
                            <span class="table-count">(총 10명)</span>
                        </div>
                        <div class="table-header-right">
                            <button class="btn btn-primary btn-sm">
                                <i class="icon" data-lucide="plus"></i>
                                등록
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
                                    <th>상태</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>홍길동</td>
                                    <td>2024001</td>
                                    <td>
                                        <span class="status-badge status-success">승인</span>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn btn-outline btn-sm">
                                                <i class="icon" data-lucide="eye"></i>
                                            </button>
                                            <button class="btn btn-outline btn-sm">
                                                <i class="icon" data-lucide="trash-2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();

        function toggleSidebar() {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    </script>
</body>
</html>
```

---

## 체크리스트

마이그레이션 완료 전 확인사항:

### CSS
- [ ] Tailwind CSS 제거
- [ ] Design System v3 CSS 추가 (4개 파일)
- [ ] Pretendard 폰트 추가

### HTML 구조
- [ ] `layout-container` → `sidebar` + `main-content` 구조로 변경
- [ ] `utility-header` 추가
- [ ] `page-header` 추가
- [ ] `content-area` 추가

### 컴포넌트
- [ ] 버튼 클래스 변경 (`btn btn-primary` 등)
- [ ] 테이블 구조 변경 (`table-container` 등)
- [ ] 폼 컨트롤 변경 (`form-group`, `form-control` 등)
- [ ] 상태 뱃지 변경 (`status-badge` 등)
- [ ] 모달 구조 변경 (`modal-overlay` 등)

### 아이콘
- [ ] Font Awesome → Lucide Icons 변경
- [ ] `lucide.createIcons()` 호출 추가

### JavaScript
- [ ] 사이드바 토글 함수 추가
- [ ] 모달 열기/닫기 함수 추가

### 반응형
- [ ] 모바일에서 사이드바 동작 확인
- [ ] 태블릿에서 레이아웃 확인
- [ ] 데스크톱에서 정상 동작 확인

---

## 주의사항

### ✅ DO
- 한 화면씩 차근차근 마이그레이션
- 기존 화면을 백업한 후 작업
- 각 단계별로 테스트

### ❌ DON'T
- 모든 화면을 한 번에 변경하지 않기
- CSS 파일 순서를 바꾸지 않기
- Tailwind와 Design System v3 CSS를 혼용하지 않기

---

## 도움이 필요한 경우

1. [디자인 시스템 문서](./design-system-v3.md) 참조
2. [레이아웃 가이드](./layout-guide.md) 참조
3. [컴포넌트 가이드](./components/) 참조
4. professor-v3 폴더의 예제 코드 참조
