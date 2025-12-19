# 레이아웃 시스템 가이드

## HTML 기본 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>페이지 제목</title>

    <!-- Pretendard 폰트 -->
    <link rel="stylesheet" as="style" crossorigin
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />

    <!-- CSS 파일 (순서 중요!) -->
    <link rel="stylesheet" href="assets/css/design-system-v3.css">
    <link rel="stylesheet" href="assets/css/layout-v3.css">
    <link rel="stylesheet" href="assets/css/components-v3.css">
    <link rel="stylesheet" href="assets/css/table-standard.css">
</head>
<body>
    <!-- 레이아웃 컨테이너 -->
    <div class="layout-container">
        <!-- 사이드바 -->
        <aside class="sidebar">...</aside>

        <!-- 메인 콘텐츠 -->
        <div class="main-content">
            <!-- 유틸리티 헤더 -->
            <header class="utility-header">...</header>

            <!-- 페이지 헤더 -->
            <div class="page-header">...</div>

            <!-- 콘텐츠 영역 -->
            <main class="content-area">...</main>
        </div>
    </div>

    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
```

---

## 1. 사이드바 (Sidebar)

### 구조
```html
<aside class="sidebar">
    <!-- 헤더: 로고 + 토글 버튼 -->
    <div class="sidebar-header">
        <div class="sidebar-logo-area">
            <div class="sidebar-logo">HYCU</div>
            <span class="sidebar-title">논문지도시스템</span>
        </div>
        <button class="sidebar-toggle" onclick="toggleSidebar()">
            <i class="icon" data-lucide="chevron-left"></i>
        </button>
    </div>

    <!-- 네비게이션 -->
    <nav class="sidebar-nav">
        <!-- 섹션 1 -->
        <div class="nav-section">
            <div class="nav-section-title">
                <i class="icon" data-lucide="home"></i>
                <span>대시보드</span>
            </div>
        </div>

        <!-- 섹션 2: 서브메뉴 있음 -->
        <div class="nav-section">
            <div class="nav-section-title">
                <i class="icon" data-lucide="file-text"></i>
                <span>논문 관리</span>
            </div>
            <div class="nav-submenu">
                <a href="#" class="nav-submenu-item">학위논문심사</a>
                <a href="#" class="nav-submenu-item active">피드백 관리</a>
                <a href="#" class="nav-submenu-item">미팅 관리</a>
            </div>
        </div>

        <!-- 단일 메뉴 -->
        <div class="nav-section">
            <a href="#" class="nav-item">
                <i class="icon" data-lucide="bell"></i>
                <span>알림</span>
            </a>
        </div>
    </nav>

    <!-- 하단: 로그아웃 -->
    <div class="sidebar-footer">
        <div class="sidebar-logout" onclick="logout()">
            <i class="icon" data-lucide="log-out"></i>
            <span>로그아웃</span>
        </div>
    </div>
</aside>
```

### JavaScript
```javascript
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}
```

---

## 2. 유틸리티 헤더 (Utility Header)

### 구조
```html
<header class="utility-header">
    <!-- 왼쪽: 햄버거 메뉴 + 브레드크럼 -->
    <div class="utility-left">
        <button class="sidebar-open-btn" onclick="toggleSidebar()">
            <i class="icon" data-lucide="menu"></i>
        </button>

        <nav class="breadcrumb">
            <a href="#">홈</a>
            <span class="breadcrumb-separator">›</span>
            <a href="#">논문 관리</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">피드백 관리</span>
        </nav>
    </div>

    <!-- 오른쪽: 알림 + 사용자 정보 -->
    <div class="utility-right">
        <!-- 알림 버튼 -->
        <button class="utility-icon-btn" onclick="openNotifications()">
            <i class="icon" data-lucide="bell"></i>
            <span class="badge-dot"></span>
        </button>

        <!-- 사용자 정보 -->
        <div class="utility-user">
            <span class="user-role">교수</span>
            <span class="user-divider">│</span>
            <span class="user-name">김교수</span>
        </div>
    </div>
</header>
```

### 알림 뱃지 종류
```html
<!-- 빨간 점 (읽지 않은 알림) -->
<span class="badge-dot"></span>

<!-- 숫자 뱃지 (알림 개수) -->
<span class="badge-count">5</span>
```

---

## 3. 페이지 헤더 (Page Header)

### 기본 구조
```html
<div class="page-header">
    <div class="page-header-left">
        <h1 class="page-title">피드백 관리</h1>
        <p class="page-help-text">학생들의 피드백을 관리하고 피드백을 작성합니다</p>
    </div>
</div>
```

### 우측 액션 버튼 추가
```html
<div class="page-header">
    <div class="page-header-left">
        <h1 class="page-title">피드백 관리</h1>
        <p class="page-help-text">학생들의 피드백을 관리하고 피드백을 작성합니다</p>
    </div>

    <div class="page-header-right">
        <button class="btn btn-primary" onclick="openFeedbackModal()">
            <i class="icon" data-lucide="plus"></i>
            피드백 작성
        </button>
    </div>
</div>
```

---

## 4. 콘텐츠 영역 (Content Area)

### 기본 구조
```html
<main class="content-area">
    <!-- 여기에 실제 콘텐츠 배치 -->

    <!-- 예시: 카드 -->
    <div class="card">
        <div class="card-header">제목</div>
        <div class="card-body">내용</div>
    </div>

    <!-- 예시: 테이블 -->
    <div class="table-container">
        <div class="table-header">
            <div class="table-header-left">
                <h3 class="table-title">목록</h3>
                <span class="table-count">(총 10건)</span>
            </div>
            <div class="table-header-right">
                <button class="btn btn-primary btn-sm">+ 등록</button>
            </div>
        </div>
        <div class="table-scroll">
            <table>...</table>
        </div>
    </div>
</main>
```

---

## 5. 탭 레이아웃

### 탭 사용 예시
```html
<main class="content-area">
    <!-- 탭 메뉴 -->
    <div class="tabs">
        <button class="tab active" onclick="switchTab('all')">
            전체 <span class="count-badge">12</span>
        </button>
        <button class="tab" onclick="switchTab('pending')">
            대기중 <span class="count-badge outline">5</span>
        </button>
        <button class="tab" onclick="switchTab('approved')">
            승인 <span class="count-badge outline">7</span>
        </button>
    </div>

    <!-- 탭 내용 -->
    <div class="tab-content active" id="tab-all">
        <!-- 전체 목록 -->
    </div>

    <div class="tab-content" id="tab-pending">
        <!-- 대기중 목록 -->
    </div>

    <div class="tab-content" id="tab-approved">
        <!-- 승인 목록 -->
    </div>
</main>
```

### JavaScript
```javascript
function switchTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // 선택한 탭 활성화
    event.target.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
}
```

---

## 6. 반응형 동작

### Desktop (≥1260px)
- 사이드바 항상 표시
- 브레드크럼 표시
- 페이지 헤더 1줄 배치

### Tablet (768px ~ 1259px)
- 사이드바 토글 가능
- 브레드크럼 표시
- 페이지 헤더 여백 감소

### Mobile (<768px)
- 사이드바 기본 숨김
- 햄버거 메뉴 항상 표시
- 브레드크럼 숨김
- 페이지 헤더 세로 배치
- 콘텐츠 padding 16px

### JavaScript로 반응형 대응
```javascript
// 모바일에서 사이드바 오버레이
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (window.innerWidth < 768) {
        sidebar.classList.add('mobile');
        // 오버레이 추가
        if (!overlay) {
            const div = document.createElement('div');
            div.className = 'sidebar-overlay';
            div.onclick = toggleSidebar;
            document.body.appendChild(div);
        }
    } else {
        sidebar.classList.remove('mobile');
        if (overlay) overlay.remove();
    }
});
```

---

## 7. 사이드바 오버레이 (모바일)

### HTML 추가
```html
<!-- 사이드바 오버레이 (모바일용) -->
<div class="sidebar-overlay" onclick="toggleSidebar()"></div>
```

### JavaScript
```javascript
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const mainContent = document.querySelector('.main-content');

    if (window.innerWidth < 768) {
        // 모바일: 오버레이 토글
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    } else {
        // 데스크톱: 접기/펼치기
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}
```

---

## 8. 아이콘 사용법

### Lucide Icons 사용
```html
<!-- HTML에 아이콘 배치 -->
<i class="icon" data-lucide="home"></i>
<i class="icon" data-lucide="file-text"></i>
<i class="icon" data-lucide="bell"></i>
<i class="icon" data-lucide="user"></i>

<!-- JavaScript로 아이콘 활성화 -->
<script>
    lucide.createIcons();
</script>
```

### 자주 사용하는 아이콘
| 용도 | 아이콘 이름 |
|------|------------|
| 홈 | `home` |
| 문서 | `file-text` |
| 알림 | `bell` |
| 사용자 | `user` |
| 설정 | `settings` |
| 검색 | `search` |
| 추가 | `plus` |
| 편집 | `edit` |
| 삭제 | `trash-2` |
| 로그아웃 | `log-out` |
| 메뉴 | `menu` |
| 화살표(오른쪽) | `chevron-right` |
| 화살표(왼쪽) | `chevron-left` |

---

## 관련 문서
- [디자인 시스템](./design-system-v3.md)
- [컴포넌트 가이드](./components/)
- [마이그레이션 가이드](./migration-guide.md)
