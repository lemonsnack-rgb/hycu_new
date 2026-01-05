# 최종 논문 제목 등록 화면 표준 디자인 적용 계획

## 문서 목적
기존 최종 논문 제목 등록 화면을 admin-v3 표준 검색 레이아웃에 맞춰 재설계

## 작업 일자
2026-01-05

---

## 1. 현재 구현 분석

### 1.1 파일 위치
- **View 함수**: `admin-v3/assets/js/admin_views.js` (라인 2349-2456)
- **화면 ID**: `titleChangeRequests`
- **제목**: "논문 제목 등록 현황"

### 1.2 현재 검색 필드 (4개) ❌ 변경 필요
1. **학년도** - Select
2. **학기** - Select
3. **학번** - Text Input
4. **성명** - Text Input

### 1.2.1 사용자 지정 검색 필드 (11개) ✅
1. **학년도** - Select (복합 필드 1/2)
2. **학기** - Select (복합 필드 2/2)
3. **대학구분** - Select
4. **계열/대학원** - Select
5. **학부(과)전공** - Select
6. **학과/전공** - Select
7. **학위과정** - Select
8. **학적상태** - Select
9. **학번** - Text Input
10. **성명** - Text Input
11. **지도교수명** - Text Input

### 1.3 현재 레이아웃 구조
```html
<div class="search-container">
    <div class="search-grid">
        <!-- 4개 필드 -->
    </div>
    <div class="search-buttons">
        <!-- 검색/초기화 버튼 -->
    </div>
</div>
```

### 1.4 현재 테이블 컬럼 (8개) ❌ 변경 필요
1. 번호
2. 대학원
3. 학과
4. 학위과정
5. 학번
6. 이름
7. 논문 제목
8. 등록일(수정일)

### 1.4.1 사용자 지정 테이블 컬럼 (11개) ✅
1. **순번**
2. **학년도**
3. **학기**
4. **대학구분**
5. **계열/대학원**
6. **학부(과)전공**
7. **학과/전공**
8. **학위과정**
9. **학적상태**
10. **학번**
11. **성명**
12. **지도교수명**

### 1.5 문제점
❌ **표준 디자인과 다른 점:**
1. 검색 필드가 `search-container` / `search-grid` 구조 사용
2. 학년도와 학기가 별도 필드로 분리됨 (표준: 복합 필드)
3. 버튼 영역이 `search-buttons` 클래스 사용 (표준: `flex justify-end`)
4. 그리드 구조가 명확하지 않음 (표준: `grid grid-cols-X`)
5. 라벨 너비가 고정되지 않음 (표준: `width: 85px`)
6. 입력창 높이가 명시되지 않음 (표준: `height: 34px`)
7. Crimson 버튼 색상이 적용되지 않음 (표준: `bg-[#6A0028]`)

---

## 2. 표준 디자인 적용 계획

### 2.1 검색 영역 재설계

#### AS-IS (현재 - 4개 필드)
```html
<div class="search-container">
    <div class="search-grid">
        <div class="search-field">
            <label class="search-label">학년도</label>
            <select id="title-search-year" class="search-select">...</select>
        </div>
        <div class="search-field">
            <label class="search-label">학기</label>
            <select id="title-search-semester" class="search-select">...</select>
        </div>
        <div class="search-field">
            <label class="search-label">학번</label>
            <input type="text" id="title-search-student-id" class="search-input">
        </div>
        <div class="search-field">
            <label class="search-label">성명</label>
            <input type="text" id="title-search-student-name" class="search-input">
        </div>
    </div>
    <div class="search-buttons">
        <button onclick="searchTitleChangeRequests()" class="search-btn search-btn-primary">
            <i class="fas fa-search"></i>검색
        </button>
        <button onclick="resetTitleChangeSearch()" class="search-btn search-btn-secondary">
            <i class="fas fa-redo"></i>초기화
        </button>
    </div>
</div>
```

#### TO-BE (사용자 지정 - 11개 필드, 5열 그리드)
```html
<!-- 검색 옵션 카드 -->
<div class="bg-white rounded-lg shadow-md p-6 mb-4">
    <div class="grid grid-cols-5 gap-3">
        <!-- 1행: 5개 필드 -->

        <!-- 1. 학년도/학기 (복합 필드) -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                학년도/학기
            </label>
            <div class="flex gap-2 flex-1">
                <select id="title-search-year"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="">전체</option>
                    <option value="2025" selected>2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
                <select id="title-search-semester"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="">전체</option>
                    <option value="1" selected>1학기</option>
                    <option value="2">2학기</option>
                </select>
            </div>
        </div>

        <!-- 2. 대학구분 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                대학구분
            </label>
            <select id="title-search-college-type"
                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                    style="height: 34px;">
                <option value="">전체</option>
                <option value="대학원">대학원</option>
                <option value="학부">학부</option>
            </select>
        </div>

        <!-- 3. 계열/대학원 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                계열/대학원
            </label>
            <select id="title-search-college"
                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                    style="height: 34px;">
                <option value="">전체</option>
                <option value="일반대학원">일반대학원</option>
                <option value="디자인대학원">디자인대학원</option>
                <option value="부동산대학원">부동산대학원</option>
            </select>
        </div>

        <!-- 4. 학부(과)전공 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                학부(과)전공
            </label>
            <select id="title-search-faculty"
                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                    style="height: 34px;">
                <option value="">전체</option>
                <option value="공학부">공학부</option>
                <option value="인문사회학부">인문사회학부</option>
                <option value="디자인학부">디자인학부</option>
            </select>
        </div>

        <!-- 5. 학과/전공 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                학과/전공
            </label>
            <select id="title-search-major"
                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                    style="height: 34px;">
                <option value="">전체</option>
                <option value="컴퓨터공학">컴퓨터공학</option>
                <option value="전기전자공학">전기전자공학</option>
                <option value="경영학">경영학</option>
            </select>
        </div>

        <!-- 2행: 5개 필드 -->

        <!-- 6. 학위과정 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                학위과정
            </label>
            <select id="title-search-degree"
                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                    style="height: 34px;">
                <option value="">전체</option>
                <option value="석사">석사</option>
                <option value="박사">박사</option>
                <option value="석박통합">석박통합</option>
            </select>
        </div>

        <!-- 7. 학적상태 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                학적상태
            </label>
            <select id="title-search-status"
                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                    style="height: 34px;">
                <option value="">전체</option>
                <option value="재학">재학</option>
                <option value="휴학">휴학</option>
                <option value="졸업">졸업</option>
            </select>
        </div>

        <!-- 8. 학번 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                학번
            </label>
            <input type="text"
                   id="title-search-student-id"
                   placeholder="학번"
                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                   style="height: 34px;">
        </div>

        <!-- 9. 성명 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                성명
            </label>
            <input type="text"
                   id="title-search-student-name"
                   placeholder="성명"
                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                   style="height: 34px;">
        </div>

        <!-- 10. 지도교수명 -->
        <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                지도교수명
            </label>
            <input type="text"
                   id="title-search-advisor"
                   placeholder="지도교수명"
                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                   style="height: 34px;">
        </div>

        <!-- 3행: 버튼 (오른쪽 정렬) -->
        <div></div>
        <div></div>
        <div></div>
        <div></div>

        <!-- 버튼 영역 (마지막 열) -->
        <div class="flex items-center justify-end">
            <button onclick="searchTitleChangeRequests()"
                    class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                조회
            </button>
        </div>
    </div>
</div>
```

### 2.2 주요 변경 사항

#### 변경 1: 검색 영역 구조
| 항목 | AS-IS | TO-BE |
|------|-------|-------|
| 컨테이너 | `search-container` | `bg-white rounded-lg shadow-md p-6 mb-4` |
| 그리드 | `search-grid` | `grid grid-cols-4 gap-3` |
| 필드 래퍼 | `search-field` | `flex items-center gap-2` |
| 라벨 | `search-label` | `text-xs font-medium text-gray-700 whitespace-nowrap` + `width: 85px` |
| 입력창 (select) | `search-select` | `flex-1 px-2 border border-gray-300 rounded text-xs` + `height: 34px` |
| 입력창 (input) | `search-input` | `flex-1 px-2 border border-gray-300 rounded text-xs` + `height: 34px` |

#### 변경 2: 검색 필드 확장
- **AS-IS**: 4개 필드 (학년도, 학기, 학번, 성명)
- **TO-BE**: 11개 필드 (학년도/학기 복합, 대학구분, 계열/대학원, 학부(과)전공, 학과/전공, 학위과정, 학적상태, 학번, 성명, 지도교수명)

#### 변경 3: 학년도/학기 통합
- **AS-IS**: 학년도와 학기가 각각 별도 필드
- **TO-BE**: 하나의 복합 필드로 통합 (2개 select를 flex로 나란히 배치)

#### 변경 4: 그리드 컬럼 수
- **AS-IS**: 명확한 컬럼 수 없음 (flex 기반)
- **TO-BE**: `grid-cols-5` (11개 필드 → 2행 × 5열 + 버튼 행)

#### 변경 5: 버튼 영역
| 항목 | AS-IS | TO-BE |
|------|-------|-------|
| 컨테이너 | `search-buttons` | `flex justify-end mt-4` |
| 검색 버튼 | `search-btn search-btn-primary` | `bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium` |
| 초기화 버튼 | `search-btn search-btn-secondary` | **제거** (표준에서는 조회 버튼만 사용) |

#### 변경 6: 버튼 아이콘
- **AS-IS**: `<i class="fas fa-search"></i>검색`
- **TO-BE**: 아이콘 제거, 텍스트만 "조회"

### 2.3 테이블 영역 재설계

#### AS-IS (현재 - 8개 컬럼)
```html
<thead class="bg-gray-50">
    <tr>
        <th>번호</th>
        <th>대학원</th>
        <th>학과</th>
        <th>학위과정</th>
        <th>학번</th>
        <th>이름</th>
        <th>논문 제목</th>
        <th>등록일(수정일)</th>
    </tr>
</thead>
```

#### TO-BE (사용자 지정 - 12개 컬럼)
```html
<thead class="bg-gray-50">
    <tr>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학구분</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">계열/대학원</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학부(과)전공</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과/전공</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학적상태</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수명</th>
    </tr>
</thead>
```

**주요 변경:**
- 컬럼 수: 8개 → 12개
- 학년도/학기 분리: 하나의 컬럼에서 → 각각 별도 컬럼
- 추가 컬럼: 대학구분, 계열/대학원, 학부(과)전공, 학적상태, 지도교수명
- 제거 컬럼: 논문 제목, 등록일(수정일)

---

## 3. 삭제/변경되는 요소

### 3.1 삭제할 CSS 클래스
- ❌ `search-container`
- ❌ `search-grid`
- ❌ `search-field`
- ❌ `search-label`
- ❌ `search-select`
- ❌ `search-input`
- ❌ `search-buttons`
- ❌ `search-btn`
- ❌ `search-btn-primary`
- ❌ `search-btn-secondary`

### 3.2 삭제할 기능
- ❌ 초기화 버튼 (`resetTitleChangeSearch()`)
- ❌ 버튼 아이콘

### 3.3 ID 변경 사항

#### 기존 ID 유지
✅ 기존 ID 유지:
- `title-search-year`
- `title-search-semester`
- `title-search-student-id`
- `title-search-student-name`

#### 새로운 ID 추가
✅ 새로 추가되는 검색 필드 ID:
- `title-search-college-type` (대학구분)
- `title-search-college` (계열/대학원)
- `title-search-faculty` (학부(과)전공)
- `title-search-major` (학과/전공)
- `title-search-degree` (학위과정)
- `title-search-status` (학적상태)
- `title-search-advisor` (지도교수명)

---

## 4. 검색 함수 영향 분석

### 4.1 현재 검색 함수 위치
**파일**: `admin-v3/assets/js/admin_main.js`

**함수**:
- `searchTitleChangeRequests()` - 검색 실행
- `resetTitleChangeSearch()` - 초기화

### 4.2 필요한 수정
1. ⚠️ `searchTitleChangeRequests()` - **수정 필요** (새로운 검색 필드 7개 추가)
   - 추가 필터링: 대학구분, 계열/대학원, 학부(과)전공, 학과/전공, 학위과정, 학적상태, 지도교수명
2. ⚠️ `resetTitleChangeSearch()` - 초기화 버튼 제거로 사용 안 함 (함수는 유지 가능)

---

## 5. 구현 우선순위

### Phase 1: 검색 영역 재설계
1. [ ] 검색 컨테이너를 표준 카드 스타일로 변경
2. [ ] 그리드를 `grid-cols-5`로 변경 (3행 구조)
3. [ ] 학년도/학기를 복합 필드로 통합
4. [ ] 새로운 검색 필드 7개 추가 (대학구분, 계열/대학원, 학부(과)전공, 학과/전공, 학위과정, 학적상태, 지도교수명)
5. [ ] 모든 필드를 표준 스타일 적용 (라벨 85px, 입력창 34px)
6. [ ] 버튼 영역을 표준 스타일로 변경 (그리드 마지막 열에 배치)
7. [ ] 초기화 버튼 제거

### Phase 2: 테이블 영역 재설계
1. [ ] 테이블 컬럼을 12개로 확장
2. [ ] 학년도/학기를 별도 컬럼으로 분리
3. [ ] 새로운 컬럼 추가 (대학구분, 계열/대학원, 학부(과)전공, 학적상태, 지도교수명)
4. [ ] 제거: 논문 제목, 등록일(수정일) 컬럼

### Phase 3: 검색 함수 수정
1. [ ] `searchTitleChangeRequests()` 함수 수정
2. [ ] 새로운 검색 필드 7개 필터링 로직 추가
3. [ ] Mock 데이터 필드 매핑 확인

### Phase 4: 테스트
1. [ ] 검색 기능 동작 확인 (11개 필드)
2. [ ] 테이블 표시 확인 (12개 컬럼)
3. [ ] 반응형 레이아웃 확인
4. [ ] 버튼 hover 효과 확인

---

## 6. 참조 화면

### 6.1 표준 디자인 참조
- **문서**: `docs/admin-v3-search-layout-standard.md`
- **참조 화면**: 학기별 지도 계획 (`admin_weekly_guidance.js`)
- **참조 화면**: 지도교수 배정 (`admin_views.js` 라인 2770-2884)

### 6.2 학년도/학기 복합 필드 참조
- **학기별 지도 계획**: `admin_weekly_guidance.js` 라인 101-121
- **지도교수 배정**: `admin_views.js` 라인 2785-2802

---

## 7. 작업 체크리스트

- [ ] admin_views.js의 titleChangeRequests 함수 수정 (라인 2349-2456)
  - [ ] 검색 영역 HTML 구조 변경
    - [ ] 11개 검색 필드 구현 (학년도/학기 복합 포함)
    - [ ] 그리드 레이아웃 적용 (grid-cols-5, 3행)
    - [ ] 표준 버튼 스타일 적용 (마지막 열에 배치)
    - [ ] 초기화 버튼 제거
  - [ ] 테이블 HTML 구조 변경
    - [ ] 12개 컬럼으로 확장
    - [ ] 학년도/학기 별도 컬럼 분리
    - [ ] 새로운 컬럼 추가 (대학구분, 계열/대학원, 학부(과)전공, 학적상태, 지도교수명)
    - [ ] 논문 제목, 등록일 컬럼 제거
- [ ] admin_main.js의 searchTitleChangeRequests 함수 수정
  - [ ] 7개 새 검색 필드 값 수집
  - [ ] 필터링 로직 추가
  - [ ] Mock 데이터 매핑 확인
- [ ] 동작 테스트
  - [ ] 검색 기능 정상 작동 확인 (11개 필드)
  - [ ] 테이블 표시 확인 (12개 컬럼)
  - [ ] 학년도/학기 필터링 확인
  - [ ] 버튼 hover 효과 확인
- [ ] 문서 업데이트
  - [ ] admin-v3-search-layout-standard.md에 사례 추가

---

## 8. 예상 코드 변경량

| 파일 | 변경 라인 | 변경 내용 |
|------|-----------|-----------|
| `admin_views.js` | 2358-2447 | 검색 영역 HTML 재작성 (11개 필드, 약 90라인) |
| `admin_views.js` | 2410-2447 | 테이블 HTML 재작성 (12개 컬럼, 약 40라인) |
| `admin_main.js` | 검색 함수 | 새 검색 필드 7개 추가 (약 30라인) |

**총 예상 작업 시간**: 60분

---

## 9. 완료 기준

✅ **완료 조건**:
1. 검색 영역이 표준 디자인 문서와 100% 일치
2. 검색 필드가 11개로 확장 (학년도/학기 복합 포함)
3. 그리드가 `grid-cols-5` 3행 구조
4. 조회 버튼이 Crimson 색상 (`bg-[#6A0028]`)이며 그리드 마지막 열에 배치
5. 초기화 버튼 제거됨
6. 테이블 컬럼이 12개로 확장
7. 학년도/학기가 별도 컬럼으로 표시
8. 검색 기능이 11개 필드 모두 정상 작동

---

## 10. 구현자
Claude Sonnet 4.5

## 11. 참고 문서
- [표준 검색 레이아웃](./admin-v3-search-layout-standard.md)
- [지도교수 배정 구현 사례](./admin-v3-search-layout-standard.md#111-지도교수-배정-advisor-assignment)
