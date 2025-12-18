# 검색/초기화 버튼 표준 가이드

## 현재 문제점

### 1. 버튼 클래스 불일치
- `search-btn-primary/secondary` (inline 스타일)
- `btn-primary/secondary` (components-v3.css)
- 두 가지가 혼용되어 일관성 부족

### 2. 초기화 버튼 색상 불일치
- 일부 화면: 회색 (#6B7280) - 너무 어두움
- 표준: 밝은 회색 (#E5E5E5) + 어두운 텍스트 (#333333)

### 3. 버튼 배치 순서 불일치
- 지도교수 배정: 검색 > 초기화
- 논문 지도 현황: 검색 > 초기화
- 학위 논문 심사: 검색 > 초기화

## 최적안

### 1. 버튼 배치 순서: **초기화 → 검색**

**근거:**
- **시각적 흐름**: 사용자 시선은 왼쪽→오른쪽으로 이동하며, 마지막 요소(검색 버튼)에 주목
- **UI 패턴**: Secondary 액션(초기화)을 왼쪽, Primary 액션(검색)을 오른쪽 배치
- **의도 명확화**: 검색이 메인 액션임을 시각적으로 강조
- **오조작 방지**: 중요한 검색 버튼이 오른쪽에 위치하여 의도적으로 클릭하게 됨

### 2. 버튼 스타일 표준

#### HTML 구조
```html
<div class="search-buttons">
    <button onclick="reset()" class="btn btn-secondary">
        <i class="fas fa-redo"></i> 초기화
    </button>
    <button onclick="search()" class="btn btn-primary">
        <i class="fas fa-search"></i> 검색
    </button>
</div>
```

#### CSS 스타일 (components-v3.css 기반)

**검색 버튼 (btn-primary)**
- 배경: Crimson `#6A0028`
- 텍스트: White
- Hover: `#8A0034` + transform + box-shadow

**초기화 버튼 (btn-secondary)**
- 배경: 밝은 회색 `#E5E5E5`
- 텍스트: 어두운 회색 `#333333`
- Hover: `#D1D5DB`

**공통 스타일**
- Padding: `10px 24px`
- Border-radius: `6px`
- Font-size: `14px`
- Font-weight: `600`
- Icon gap: `8px`
- Transition: `all 0.2s ease`

### 3. 컨테이너 스타일

```css
.search-buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end; /* 오른쪽 정렬 */
    margin-top: 16px;
}
```

## 수정 대상 화면

1. **지도교수 배정** (advisor-assignment)
   - 현재: `search-btn-primary/secondary` 사용
   - 변경: `btn-primary/secondary` + 순서 변경

2. **논문 지도 현황** (feedback)
   - 현재: `btn-primary/secondary` 사용, 순서 이미 "검색 > 초기화"
   - 변경: 순서만 "초기화 > 검색"으로 변경

3. **학위 논문 심사** (review)
   - 현재: `btn-primary/secondary` 사용, 순서 이미 "검색 > 초기화"
   - 변경: 순서만 "초기화 > 검색"으로 변경

## 적용 후 이점

1. **일관성**: 모든 화면에서 동일한 버튼 스타일과 배치
2. **가독성**: 밝은 회색 초기화 버튼으로 시각적 구분 명확
3. **사용성**: Primary 액션(검색)이 오른쪽에 위치하여 자연스러운 흐름
4. **유지보수**: components-v3.css 표준 클래스 사용으로 관리 용이
