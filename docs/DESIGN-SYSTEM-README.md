# 한양사이버대학교 논문지도시스템 - 디자인 시스템 v3 문서

## 개요
Crimson(크림슨) 컬러를 기반으로 한 통합 디자인 시스템 가이드입니다.
교수, 학생, 관리자 화면 모두 동일한 디자인 원칙과 컴포넌트를 사용합니다.

---

## 📚 문서 구조

### 1. [디자인 시스템](./design-system-v3.md)
전체 디자인 시스템의 핵심 개념과 원칙

**포함 내용:**
- 디자인 원칙 (일관성, 명확성, 효율성, 접근성)
- 색상 시스템 (Primary, Status, Grayscale)
- 타이포그래피 (폰트, 크기, Weight)
- 레이아웃 구조
- 간격 체계
- Border Radius & Shadow
- 반응형 Breakpoints

---

### 2. [레이아웃 가이드](./layout-guide.md)
페이지 레이아웃과 구조에 대한 상세 가이드

**포함 내용:**
- HTML 기본 구조
- 사이드바 (Sidebar)
- 유틸리티 헤더 (Utility Header)
- 페이지 헤더 (Page Header)
- 콘텐츠 영역 (Content Area)
- 탭 레이아웃
- 반응형 동작
- 아이콘 사용법

---

### 3. 컴포넌트 가이드

#### [Buttons](./components/buttons.md)
- Primary, Outline, Secondary, Text 버튼
- 버튼 크기 (Small, Medium, Large)
- 아이콘 버튼
- 버튼 상태 (Disabled)
- 버튼 그룹

#### [Tables](./components/tables.md)
- 기본 테이블 구조
- 테이블 헤더
- 컬럼 타입 (번호, 텍스트, 상태, 날짜, 액션)
- 상태 뱃지
- 페이지네이션
- 정렬 가능한 테이블
- 체크박스 선택

#### [Forms](./components/forms.md)
- Text Input, Select, Textarea
- Checkbox, Radio, Switch
- 검색 박스
- 폼 레이아웃 (세로/가로)
- 검색/필터 폼
- 유효성 검사
- 파일 업로드

#### [Modals](./components/modals.md)
- 기본 모달 구조
- 모달 크기
- 모달 유형 (Confirm, Form, Alert, Detail View)
- 모달 내 테이블
- 모달 내 탭

#### [Badges](./components/badges.md)
- 상태 뱃지 (Status Badge)
- 카운트 뱃지 (Count Badge)
- D-Day 뱃지
- 태그 뱃지
- 알림 뱃지

---

### 4. [마이그레이션 가이드](./migration-guide.md)
기존 화면을 Design System v3로 변환하는 가이드

**포함 내용:**
- 단계별 마이그레이션 (CSS, HTML, 컴포넌트, 색상, 아이콘)
- Before/After 비교
- 실전 예제
- 체크리스트
- 주의사항

---

## 🚀 빠른 시작

### 1. CSS 파일 추가
```html
<!-- Pretendard 폰트 -->
<link rel="stylesheet" as="style" crossorigin
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />

<!-- Design System v3 CSS (순서 중요!) -->
<link rel="stylesheet" href="assets/css/design-system-v3.css">
<link rel="stylesheet" href="assets/css/layout-v3.css">
<link rel="stylesheet" href="assets/css/components-v3.css">
<link rel="stylesheet" href="assets/css/table-standard.css">
```

### 2. HTML 기본 구조
```html
<div class="layout-container">
    <!-- 사이드바 -->
    <aside class="sidebar">...</aside>

    <!-- 메인 콘텐츠 -->
    <div class="main-content">
        <header class="utility-header">...</header>
        <div class="page-header">...</div>
        <main class="content-area">...</main>
    </div>
</div>
```

### 3. Lucide Icons 추가
```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>
    lucide.createIcons();
</script>
```

---

## 📖 자주 사용하는 예제

### 버튼
```html
<button class="btn btn-primary">등록</button>
<button class="btn btn-outline">취소</button>
<button class="btn btn-sm btn-primary">작은 버튼</button>
```

### 테이블
```html
<div class="table-container">
    <div class="table-header">
        <div class="table-header-left">
            <h3 class="table-title">목록</h3>
            <span class="table-count">(총 10건)</span>
        </div>
    </div>
    <div class="table-scroll">
        <table>...</table>
    </div>
</div>
```

### 폼
```html
<div class="form-group">
    <label class="form-label">이름 *</label>
    <input type="text" class="form-control" required>
</div>
```

### 모달
```html
<div id="modal" class="modal-overlay" onclick="closeModal('modal')">
    <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>제목</h3>
            <button onclick="closeModal('modal')" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">내용</div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal')">취소</button>
            <button class="btn btn-primary">확인</button>
        </div>
    </div>
</div>
```

### 상태 뱃지
```html
<span class="status-badge status-success">승인</span>
<span class="status-badge status-warning">대기</span>
<span class="status-badge status-danger">반려</span>
```

---

## 작성 완료
모든 디자인 가이드라인 문서가 작성되었습니다!
