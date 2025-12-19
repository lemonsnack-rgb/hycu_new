# 한양사이버대학교 논문지도시스템 - Design System v3

## 개요
Crimson(크림슨) 컬러를 기반으로 한 통합 디자인 시스템입니다. 교수, 학생, 관리자 화면 모두 동일한 디자인 원칙을 따릅니다.

---

## 디자인 원칙

### 1. 일관성 (Consistency)
- 모든 화면에서 동일한 색상, 타이포그래피, 간격 체계 사용
- 동일한 기능은 동일한 UI 패턴으로 구현

### 2. 명확성 (Clarity)
- 중요한 정보는 Crimson 컬러로 강조
- 계층 구조를 명확하게 표현 (Primary > Secondary > Tertiary)

### 3. 효율성 (Efficiency)
- 자주 사용하는 기능은 2클릭 이내 접근
- 불필요한 UI 요소 제거

### 4. 접근성 (Accessibility)
- WCAG 2.1 AA 준수
- 모바일/태블릿 대응 (반응형 디자인)

---

## 색상 시스템 (Color System)

### Primary Color - Crimson
```css
--color-primary: #6A0028;         /* 메인 브랜드 컬러 */
--color-primary-dark: #4A001C;    /* Hover/Active */
--color-primary-light: #8A0034;   /* Hover 밝은 버전 */
--color-primary-tint: #FCE4EC;    /* 배경/뱃지 */
```

**사용처:**
- 주요 버튼 (등록, 저장, 확인)
- 선택된 메뉴/탭
- 중요한 뱃지/라벨
- 테이블 헤더 하단 강조선

### Status Colors
```css
--color-success: #2E7D32;      /* 승인, 완료 */
--color-success-bg: #E8F5E9;

--color-warning: #F59E0B;      /* 대기, 진행중 */
--color-warning-bg: #FEF3C7;

--color-danger: #EF4444;       /* 반려, 마감임박 */
--color-danger-bg: #FEE2E2;

--color-info: #0288D1;         /* 알림, 안내 */
--color-info-bg: #E3F2FD;
```

### Grayscale
```css
--color-gray-0: #1A1A1A;  /* 제목, 주요 텍스트 */
--color-gray-1: #6B7280;  /* 일반 텍스트, 라벨 */
--color-gray-2: #9CA3AF;  /* 보조 텍스트, placeholder */
--color-gray-3: #E5E7EB;  /* 테두리, 구분선 */
--color-gray-4: #F8FAFC;  /* 배경, 테이블 헤더 */
```

---

## 타이포그래피 (Typography)

### 폰트
```css
--font-family: 'Pretendard Variable', 'Pretendard',
               -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Weight
```css
--font-weight-regular: 400;    /* 본문 */
--font-weight-medium: 500;     /* 강조 텍스트 */
--font-weight-semibold: 600;   /* 버튼, 라벨 */
--font-weight-bold: 700;       /* 제목, 헤더 */
```

### 텍스트 크기
| 용도 | 크기 | Weight | 예시 |
|------|------|--------|------|
| 페이지 제목 | 24px | 700 | "학위논문심사 관리" |
| 카드 제목 | 18px | 700 | "심사 현황" |
| 섹션 제목 | 16px | 700 | "최근 제출 목록" |
| 버튼/라벨 | 15px | 600 | "등록", "취소" |
| 본문 | 14px | 400 | 일반 텍스트 |
| 보조 텍스트 | 13px | 400 | 날짜, 시간 |
| 뱃지/작은 라벨 | 12px | 600 | "D-7", "승인" |

---

## 레이아웃 (Layout)

### 구조
```
┌─────────────────────────────────────────┐
│ Sidebar (240px)                         │
│ ┌─────────────────────────────────────┐ │
│ │ Utility Header (48px)               │ │
│ ├─────────────────────────────────────┤ │
│ │ Page Header (72px)                  │ │
│ ├─────────────────────────────────────┤ │
│ │ Content Area                        │ │
│ │ (padding: 24px)                     │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 주요 치수
```css
--sidebar-width: 240px;
--utility-header-height: 48px;
--page-header-height: 72px;
--content-padding: 24px;
```

### 간격 체계 (Spacing)
| 크기 | 값 | 사용처 |
|------|-----|--------|
| XS | 4px | 아이콘 간격 |
| S | 8px | 버튼 내 아이콘-텍스트 |
| M | 12px | 버튼 사이 간격 |
| L | 16px | 카드 내부 패딩 |
| XL | 24px | 섹션 간 간격 |
| XXL | 32px | 큰 섹션 간격 |

---

## Border Radius
```css
--border-radius-sm: 4px;     /* 버튼, 입력창 */
--border-radius-md: 6px;     /* 카드 */
--border-radius-lg: 8px;     /* 모달, 큰 카드 */
--border-radius-full: 9999px; /* 뱃지, 원형 버튼 */
```

---

## Shadow
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);    /* 카드 */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);    /* 드롭다운 */
--shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);  /* 모달 */
```

---

## Transitions
```css
--transition-fast: 0.15s ease;    /* 버튼 hover */
--transition-normal: 0.2s ease;   /* 일반 애니메이션 */
--transition-slow: 0.3s ease;     /* 사이드바 토글 */
```

---

## 반응형 Breakpoints
```css
--breakpoint-desktop: 1260px;  /* 데스크톱 */
--breakpoint-tablet: 768px;    /* 태블릿 */
--breakpoint-mobile: 480px;    /* 모바일 */
```

### 반응형 동작
- **Desktop (≥1260px)**: 사이드바 항상 표시
- **Tablet (768px~1259px)**: 사이드바 토글 가능
- **Mobile (<768px)**: 사이드바 기본 숨김, 햄버거 메뉴

---

## 파일 구조

### CSS 파일
```
professor-v3/assets/css/
├── design-system-v3.css       # 디자인 토큰 + 레이아웃
├── layout-v3.css              # 레이아웃 구조
├── components-v3.css          # 모든 컴포넌트
├── table-standard.css         # 테이블 표준
└── [기능별].css              # 각 화면별 추가 스타일
```

### 적용 순서 (HTML head)
```html
<link rel="stylesheet" href="assets/css/design-system-v3.css">
<link rel="stylesheet" href="assets/css/layout-v3.css">
<link rel="stylesheet" href="assets/css/components-v3.css">
<link rel="stylesheet" href="assets/css/table-standard.css">
```

---

## 빠른 참조

### 자주 사용하는 클래스

#### 버튼
```html
<button class="btn btn-primary">등록</button>
<button class="btn btn-outline">취소</button>
<button class="btn btn-secondary">목록</button>
<button class="btn btn-sm btn-primary">작은 버튼</button>
```

#### 상태 뱃지
```html
<span class="status-badge status-success">승인</span>
<span class="status-badge status-warning">대기</span>
<span class="status-badge status-danger">반려</span>
```

#### 카드
```html
<div class="card">
  <div class="card-header">제목</div>
  <div class="card-body">내용</div>
</div>
```

---

## 관련 문서
- [레이아웃 가이드](./layout-guide.md)
- [컴포넌트 가이드](./components/)
- [마이그레이션 가이드](./migration-guide.md)
