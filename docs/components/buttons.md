# 버튼 (Buttons)

## 버튼 종류

### 1. Primary Button (주요 액션)
```html
<button class="btn btn-primary">등록</button>
<button class="btn btn-primary">
    <i class="icon" data-lucide="plus"></i>
    추가
</button>
```

**사용처:**
- 페이지의 주요 액션 (등록, 저장, 확인, 제출)
- 한 화면에 1~2개만 사용

---

### 2. Outline Button (보조 액션)
```html
<button class="btn btn-outline">취소</button>
<button class="btn btn-outline">
    <i class="icon" data-lucide="x"></i>
    닫기
</button>
```

**사용처:**
- 취소, 닫기, 이전 등 보조 액션
- Primary 버튼과 함께 사용

---

### 3. Secondary Button (일반 액션)
```html
<button class="btn btn-secondary">목록</button>
<button class="btn btn-secondary">다운로드</button>
```

**사용처:**
- 일반적인 액션
- 페이지 이동, 다운로드 등

---

### 4. Text Button (최소한의 액션)
```html
<button class="btn btn-text">더보기</button>
<button class="btn btn-text">
    <i class="icon" data-lucide="chevron-right"></i>
    자세히 보기
</button>
```

**사용처:**
- 강조가 필요 없는 액션
- 링크처럼 사용

---

## 버튼 크기

### Small
```html
<button class="btn btn-primary btn-sm">작은 버튼</button>
<button class="btn btn-outline btn-sm">취소</button>
```

**사용처:**
- 테이블 내 액션 버튼
- 카드 내 작은 버튼

---

### Medium (기본)
```html
<button class="btn btn-primary">중간 버튼</button>
```

**사용처:**
- 대부분의 상황에서 사용

---

### Large
```html
<button class="btn btn-primary btn-lg">큰 버튼</button>
```

**사용처:**
- 모달의 주요 액션
- 중요한 제출 버튼

---

## 아이콘 버튼

### 텍스트 + 아이콘
```html
<!-- 아이콘 왼쪽 -->
<button class="btn btn-primary">
    <i class="icon" data-lucide="plus"></i>
    추가
</button>

<!-- 아이콘 오른쪽 -->
<button class="btn btn-primary">
    다음
    <i class="icon" data-lucide="chevron-right"></i>
</button>
```

### 아이콘만
```html
<button class="btn btn-primary btn-icon-only">
    <i class="icon" data-lucide="search"></i>
</button>

<button class="btn btn-outline btn-icon-only btn-sm">
    <i class="icon" data-lucide="edit"></i>
</button>
```

**사용처:**
- 테이블 액션 버튼 (수정, 삭제)
- 공간이 제한된 곳

---

## 버튼 상태

### Disabled
```html
<button class="btn btn-primary" disabled>등록</button>
<button class="btn btn-outline" disabled>취소</button>
```

**사용법:**
```javascript
// JavaScript로 disabled 제어
document.getElementById('submitBtn').disabled = true;
document.getElementById('submitBtn').disabled = false;
```

---

## 버튼 그룹

### 좌우 배치
```html
<div style="display: flex; gap: 12px;">
    <button class="btn btn-primary">저장</button>
    <button class="btn btn-outline">취소</button>
</div>
```

### 우측 정렬
```html
<div style="display: flex; gap: 12px; justify-content: flex-end;">
    <button class="btn btn-primary">저장</button>
    <button class="btn btn-outline">취소</button>
</div>
```

### 테이블 내 버튼 그룹
```html
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
```

---

## 실전 예제

### 모달 푸터
```html
<div class="modal-footer">
    <button class="btn btn-outline" onclick="closeModal()">취소</button>
    <button class="btn btn-primary" onclick="submitForm()">저장</button>
</div>
```

### 페이지 헤더
```html
<div class="page-header">
    <div class="page-header-left">
        <h1 class="page-title">피드백 관리</h1>
    </div>
    <div class="page-header-right">
        <button class="btn btn-outline" onclick="goBack()">
            <i class="icon" data-lucide="arrow-left"></i>
            목록
        </button>
        <button class="btn btn-primary" onclick="openFeedbackModal()">
            <i class="icon" data-lucide="plus"></i>
            피드백 작성
        </button>
    </div>
</div>
```

### 검색 폼
```html
<div class="search-container">
    <div class="search-grid">
        <div class="search-field">
            <label class="search-label">검색어</label>
            <input type="text" class="search-input" placeholder="제목 또는 내용">
        </div>
        <div class="search-field">
            <label class="search-label">상태</label>
            <select class="search-select">
                <option>전체</option>
                <option>대기</option>
                <option>승인</option>
            </select>
        </div>
    </div>

    <div class="search-buttons">
        <button class="btn btn-secondary" onclick="resetSearch()">초기화</button>
        <button class="btn btn-primary" onclick="search()">
            <i class="icon" data-lucide="search"></i>
            검색
        </button>
    </div>
</div>
```

---

## 주의사항

### ✅ DO
- Primary 버튼은 한 화면에 1~2개만
- 버튼 텍스트는 명확하게 (동사 사용)
- 아이콘과 텍스트를 함께 사용하면 더 명확함

### ❌ DON'T
- Primary 버튼을 남용하지 않기
- "클릭" 같은 모호한 텍스트 사용 금지
- 너무 긴 텍스트 사용 금지 (2~4글자 권장)

---

## CSS 변수

```css
/* 버튼 색상 커스터마이징 */
.btn-custom {
    background: var(--color-info);
    color: white;
}

.btn-custom:hover {
    background: #0277BD;
}
```

---

## 관련 문서
- [디자인 시스템](../design-system-v3.md)
- [Forms 가이드](./forms.md)
- [Modals 가이드](./modals.md)
