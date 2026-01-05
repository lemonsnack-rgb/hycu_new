# Admin-v3 검색 옵션 레이아웃 표준

## 문서 목적
기존 화면을 admin-v3로 마이그레이션할 때 일관된 검색 옵션 레이아웃을 적용하기 위한 참조 문서입니다.

최종 적용 화면: **학기별 지도 계획** (admin-v3/assets/js/admin_weekly_guidance.js)

---

## 1. 검색 옵션 레이아웃 구조

### 1.1 전체 구조
```html
<div class="bg-white rounded-lg shadow-md p-6 mb-4">
    <div class="grid grid-cols-5 gap-3">
        <!-- 검색 필드들 -->
    </div>

    <!-- 버튼 영역 -->
    <div class="flex justify-end mt-4">
        <button onclick="filterFunction()"
                class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
            조회
        </button>
    </div>
</div>
```

### 1.2 핵심 원칙
1. **카드 스타일**: `bg-white rounded-lg shadow-md p-6 mb-4`
2. **그리드 레이아웃**: `grid grid-cols-5 gap-3` (한 행에 5개 필드)
3. **수평 배치**: 라벨과 입력창이 좌우로 나란히 배치
4. **고정 라벨 너비**: `width: 85px` (일관성 유지)
5. **Crimson 버튼**: `bg-[#6A0028]`

---

## 2. 검색 필드 패턴

### 2.1 기본 필드 구조
```html
<div class="flex items-center gap-2">
    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
        검색옵션명
    </label>
    <input type="text"
           id="fieldId"
           placeholder="입력하세요"
           class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
           style="height: 34px;">
</div>
```

**핵심 클래스:**
- **래퍼**: `flex items-center gap-2`
- **라벨**: `text-xs font-medium text-gray-700 whitespace-nowrap` + `width: 85px`
- **입력창**: `flex-1 px-2 border border-gray-300 rounded text-xs` + `height: 34px`

### 2.2 Select 필드
```html
<div class="flex items-center gap-2">
    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
        학위과정
    </label>
    <select id="degreeFilter"
            class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
            style="height: 34px;">
        <option value="">전체</option>
        <option value="석사">석사</option>
        <option value="박사">박사</option>
        <option value="석박통합">석박통합</option>
    </select>
</div>
```

### 2.3 Text Input 필드
```html
<div class="flex items-center gap-2">
    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
        학번
    </label>
    <input type="text"
           id="studentIdFilter"
           placeholder="학번"
           class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
           style="height: 34px;">
</div>
```

---

## 3. 특수 패턴

### 3.1 학년도/학기 복합 필드 (중요!)
**모든 admin 화면에서 표준으로 적용**

```html
<div class="flex items-center gap-2">
    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
        학년도/학기
    </label>
    <div class="flex gap-2 flex-1">
        <select id="yearFilter"
                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                style="height: 34px;">
            <option value="">전체</option>
            <option value="2025" selected>2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
        </select>
        <select id="semesterFilter"
                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                style="height: 34px;">
            <option value="">전체</option>
            <option value="1" selected>1학기</option>
            <option value="2">2학기</option>
        </select>
    </div>
</div>
```

**핵심 포인트:**
- 학년도와 학기를 **하나의 검색 필드**로 취급
- 내부에 2개의 select 박스를 `flex gap-2`로 나란히 배치
- 각 select는 `flex-1`로 동일한 너비 차지

---

## 4. 그리드 레이아웃 규칙

### 4.1 기본: 5열 그리드
```html
<div class="grid grid-cols-5 gap-3">
    <!-- 1행: 5개 필드 -->
    <div class="flex items-center gap-2">...</div>
    <div class="flex items-center gap-2">...</div>
    <div class="flex items-center gap-2">...</div>
    <div class="flex items-center gap-2">...</div>
    <div class="flex items-center gap-2">...</div>

    <!-- 2행: 5개 필드 -->
    <div class="flex items-center gap-2">...</div>
    <div class="flex items-center gap-2">...</div>
    <div class="flex items-center gap-2">...</div>
    <div class="flex items-center gap-2">...</div>
    <div class="flex items-center gap-2">...</div>
</div>
```

### 4.2 필드가 10개 미만인 경우
필드가 10개 미만이면 `grid-cols-4` 또는 `grid-cols-3` 사용 가능:
```html
<!-- 6~8개 필드: 4열 그리드 -->
<div class="grid grid-cols-4 gap-3">
    <!-- 필드들 -->
</div>

<!-- 3~5개 필드: 3열 그리드 -->
<div class="grid grid-cols-3 gap-3">
    <!-- 필드들 -->
</div>
```

### 4.3 필드가 많은 경우 (10개 이상)
`grid-cols-5`를 유지하고 3행 이상 사용:
```html
<div class="grid grid-cols-5 gap-3">
    <!-- 1행 -->
    ...
    <!-- 2행 -->
    ...
    <!-- 3행 -->
    ...
</div>
```

---

## 5. 버튼 영역

### 5.1 조회 버튼 (표준)
```html
<div class="flex justify-end mt-4">
    <button onclick="filterFunction()"
            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
        조회
    </button>
</div>
```

### 5.2 여러 버튼이 필요한 경우
```html
<div class="flex justify-end gap-2 mt-4">
    <button onclick="resetFilter()"
            class="bg-gray-200 text-gray-800 px-6 py-2 rounded text-sm font-medium hover:bg-gray-300">
        초기화
    </button>
    <button onclick="filterFunction()"
            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
        조회
    </button>
</div>
```

**버튼 순서:**
- 왼쪽: 취소/초기화 (회색 버튼)
- 오른쪽: 주요 액션 (Crimson 버튼)

---

## 6. 실제 적용 예시 (학기별 지도 계획)

### 6.1 완전한 코드
참조: `admin-v3/assets/js/admin_weekly_guidance.js` 라인 23-127

```html
<div class="bg-white rounded-lg shadow-md p-6 mb-4">
    <div class="grid grid-cols-5 gap-3">
        <!-- 1행: 5개 필드 -->
        <!-- 1. 학년도/학기 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
            <div class="flex gap-2 flex-1">
                <select id="yearFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="2025" selected>2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
                <select id="semesterFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="1" selected>1학기</option>
                    <option value="2">2학기</option>
                </select>
            </div>
        </div>
        <!-- 2. 대학구분 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
            <select id="graduateFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                <option value="">전체</option>
                <option value="일반대학원">일반대학원</option>
                <option value="특수대학원">특수대학원</option>
            </select>
        </div>
        <!-- 3. 계열/대학원 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
            <select id="collegeFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                <option value="">전체</option>
                <option value="일반대학원">일반대학원</option>
                <option value="경영대학원">경영대학원</option>
                <option value="정보대학원">정보대학원</option>
            </select>
        </div>
        <!-- 4. 학부(과)전공 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
            <input type="text" id="undergraduateFilter" placeholder="학부(과)전공"
                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
        </div>
        <!-- 5. 학과/전공 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
            <input type="text" id="majorFilter" placeholder="학과/전공"
                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
        </div>

        <!-- 2행: 5개 필드 -->
        <!-- 6. 학위과정 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
            <select id="degreeFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                <option value="">전체</option>
                <option value="석사">석사</option>
                <option value="박사">박사</option>
                <option value="석박통합">석박통합</option>
            </select>
        </div>
        <!-- 7. 학적상태 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
            <select id="statusFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                <option value="">전체</option>
                <option value="재학">재학</option>
                <option value="휴학">휴학</option>
                <option value="졸업">졸업</option>
                <option value="수료">수료</option>
            </select>
        </div>
        <!-- 8. 학번 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
            <input type="text" id="studentIdFilter" placeholder="학번"
                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
        </div>
        <!-- 9. 성명 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
            <input type="text" id="studentNameFilter" placeholder="성명"
                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
        </div>
        <!-- 10. 지도교수명 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
            <input type="text" id="professorFilter" placeholder="지도교수명"
                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
        </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="flex justify-end mt-4">
        <button onclick="filterGuidancePairs()"
                class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
            조회
        </button>
    </div>
</div>
```

---

## 7. 마이그레이션 체크리스트

기존 화면을 admin-v3로 마이그레이션할 때 다음 항목을 확인:

### 7.1 레이아웃 구조
- [ ] 카드 컨테이너: `bg-white rounded-lg shadow-md p-6 mb-4`
- [ ] 그리드: `grid grid-cols-5 gap-3` (또는 필드 수에 맞게 조정)
- [ ] 필드별 래퍼: `flex items-center gap-2`

### 7.2 라벨
- [ ] 클래스: `text-xs font-medium text-gray-700 whitespace-nowrap`
- [ ] 고정 너비: `style="width: 85px;"`
- [ ] 텍스트 줄바꿈 방지: `whitespace-nowrap`

### 7.3 입력 필드
- [ ] 클래스: `flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary`
- [ ] 고정 높이: `style="height: 34px;"`
- [ ] Focus 스타일: `focus:ring-primary focus:border-primary`

### 7.4 학년도/학기 필드
- [ ] 단일 필드로 구성 (라벨 1개, 입력창 2개)
- [ ] 내부 래퍼: `<div class="flex gap-2 flex-1">`
- [ ] 각 select: `flex-1`로 동일 너비

### 7.5 버튼
- [ ] 위치: `flex justify-end mt-4`
- [ ] Crimson 스타일: `bg-[#6A0028] hover:bg-[#8A0034]`
- [ ] 크기: `px-6 py-2 rounded text-sm font-medium`

### 7.6 색상 체계
- [ ] Primary 버튼: `#6A0028` (Crimson)
- [ ] Hover: `#8A0034`
- [ ] Secondary/취소 버튼: `bg-gray-200 text-gray-800`

---

## 8. 잘못된 패턴 (사용 금지)

### 8.1 ❌ 수직 라벨 배치
```html
<!-- 잘못된 예 -->
<div class="search-field">
    <label>학번</label>
    <input type="text">
</div>
```
**문제점:** 라벨이 입력창 위에 배치되어 공간 낭비, 일관성 부족

### 8.2 ❌ 학년도/학기 분리
```html
<!-- 잘못된 예 -->
<div class="flex items-center gap-2">
    <label style="width: 85px;">학년도</label>
    <select>...</select>
</div>
<div class="flex items-center gap-2">
    <label style="width: 85px;">학기</label>
    <select>...</select>
</div>
```
**문제점:** 2개 필드를 사용하여 그리드 배치 비효율, 일관성 부족

### 8.3 ❌ 가변 라벨 너비
```html
<!-- 잘못된 예 -->
<label class="min-w-[80px]">학번</label>
<label class="w-20">성명</label>
```
**문제점:** 라벨 너비가 불균일하여 정렬 어지러움

### 8.4 ❌ Inline 스타일 남용
```html
<!-- 잘못된 예 -->
<input style="width: 100%; height: 34px; border: 1px solid #ccc; ...">
```
**문제점:** Tailwind 클래스 대신 inline 스타일 사용, 유지보수 어려움

---

## 9. 추가 가이드라인

### 9.1 접근성
- 모든 input/select에는 의미 있는 `id` 부여
- label은 시각적으로만 사용 (screen reader는 placeholder 참조)
- Focus 상태 명확히 표시: `focus:ring-primary`

### 9.2 반응형 대응
현재는 데스크톱 우선이지만, 향후 태블릿/모바일 대응 시:
```css
@media (max-width: 1024px) {
    .grid-cols-5 { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
    .grid-cols-5 { grid-template-columns: repeat(2, 1fr); }
}
```

### 9.3 성능 최적화
- 검색 필드가 많은 경우 debounce 적용 권장
- 초기 로딩 시 기본값 설정으로 불필요한 API 호출 방지

---

## 10. 참고 파일

### 10.1 구현 파일
- **메인 파일**: `admin-v3/assets/js/admin_weekly_guidance.js`
- **라인**: 23-127 (검색 옵션), 120-126 (버튼)

### 10.2 참조한 패턴 소스
- **학위논문 심사**: `admin-v3/index.html` 라인 555-655
- **디자인 시스템**: `docs/design-system-v3.md`
- **레이아웃 가이드**: `docs/layout-guide.md`

### 10.3 관련 컴포넌트
- **모달 시스템**: `admin-v3/assets/js/admin_modals.js`
- **테이블 표준**: `admin-v3/assets/css/table-standard.css`

---

## 11. 버전 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-05 | 초기 문서 작성 (학기별 지도 계획 기준) |

---

## 12. 문의 및 피드백

이 문서에 대한 질문이나 개선 제안은 프로젝트 관리자에게 문의하세요.

**문서 작성 기준 화면:** 학기별 지도 계획 (Weekly Guidance)
**최종 검토일:** 2026-01-05
