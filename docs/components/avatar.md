# 아바타 (Avatar)

## 개요
사용자 프로필 이미지 또는 이니셜을 표시하는 원형 컴포넌트입니다.

---

## 기본 아바타

### 이니셜 아바타
```html
<span class="avatar">박</span>
```

**스타일:**
- 배경: `var(--color-primary)` (#6A0028)
- 텍스트: 흰색
- 크기: 40x40px (기본)
- 폰트 크기: 16px
- 폰트 굵기: 600

---

## 크기 옵션

### Small (32px)
```html
<span class="avatar avatar-sm">김</span>
```

### Medium (40px) - 기본
```html
<span class="avatar">이</span>
```

### Large (48px)
```html
<span class="avatar avatar-lg">박</span>
```

### Extra Large (64px)
```html
<span class="avatar avatar-xl">최</span>
```

---

## 스타일 변형

### Outline 스타일
```html
<span class="avatar avatar-outline">홍</span>
```

**스타일:**
- 배경: 흰색
- 텍스트: `var(--color-primary)`
- 테두리: 2px solid `var(--color-primary)`

---

## 아바타 그룹

여러 사용자를 표시할 때 사용합니다.

```html
<div class="avatar-group">
    <span class="avatar">김</span>
    <span class="avatar">이</span>
    <span class="avatar">박</span>
    <span class="avatar avatar-outline">+2</span>
</div>
```

**특징:**
- 각 아바타는 `-8px` margin-left로 겹쳐짐
- 첫 번째 아바타는 margin-left: 0
- 흰색 테두리(2px)로 구분

---

## CSS 클래스

### 기본 구조
```css
.avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    font-size: 16px;
    font-weight: 600;
}
```

### 크기 클래스
```css
.avatar-sm { width: 32px; height: 32px; font-size: 14px; }
.avatar-lg { width: 48px; height: 48px; font-size: 18px; }
.avatar-xl { width: 64px; height: 64px; font-size: 24px; }
```

### Outline 스타일
```css
.avatar-outline {
    background: white;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
}
```

### 그룹 스타일
```css
.avatar-group {
    display: flex;
}

.avatar-group .avatar {
    margin-left: -8px;
    border: 2px solid white;
}

.avatar-group .avatar:first-child {
    margin-left: 0;
}
```

---

## 사용 사례

### 유틸리티 헤더
```html
<div class="layout-v3-utility-right">
    <div class="layout-v3-user-info">
        <span class="layout-v3-user-role">교수</span>
        <span class="layout-v3-user-divider">•</span>
        <span class="layout-v3-user-name">김교수</span>
        <span class="avatar avatar-sm">김</span>
    </div>
</div>
```

### 댓글 작성자 표시
```html
<div class="comment-author">
    <span class="avatar avatar-sm">박</span>
    <span class="author-name">박교수님</span>
</div>
```

### 참여자 목록
```html
<div class="participant-list">
    <span class="avatar-group">
        <span class="avatar avatar-sm">김</span>
        <span class="avatar avatar-sm">이</span>
        <span class="avatar avatar-sm">박</span>
        <span class="avatar avatar-sm avatar-outline">+5</span>
    </span>
    <span class="participant-count">8명 참여</span>
</div>
```

---

## 주의사항

### ✅ DO
- 한 글자 이니셜 사용 (성 또는 이름 첫 글자)
- 동일한 크기의 아바타를 그룹화
- 그룹에서 추가 인원은 "+N" 형식으로 표시

### ❌ DON'T
- 두 글자 이상 넣지 않기 (가독성 저하)
- 서로 다른 크기를 그룹에 혼합하지 않기
- 배경색을 임의로 변경하지 않기 (Primary 색상 유지)

---

## 접근성

- 의미 있는 대체 텍스트 제공 (이미지 사용 시)
- 충분한 색상 대비 유지 (WCAG AA 준수)
- 포커스 인디케이터 제공 (클릭 가능한 경우)

---

## 관련 문서
- [디자인 시스템](../design-system-v3.md)
- [Buttons 가이드](./buttons.md)
- [Layout 가이드](../layout-guide.md)
