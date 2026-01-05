# 논문지도 일정 관리 화면 재설계 계획서

## 문서 정보
- **작성일**: 2026-01-05
- **작성자**: Claude Sonnet 4.5
- **화면명**: 논문지도 일정 관리
- **목적**: 학생별 논문지도 일정 현황 조회 및 관리

---

## 1. 현재 구현 분석

### 1.1 파일 위치
- **View 함수**: `admin-v3/assets/js/admin_views.js` (라인 1387-1457)
- **함수명**: `scheduleManagement`
- **제목**: "논문지도 일정 관리"

### 1.2 현재 검색 필드 (2개) ❌ 변경 필요
1. **적용대상** - Select (전체, 교육공학-석사, 경영학-박사 등)
2. **일정명/설명 검색** - Text Input

### 1.2.1 사용자 지정 검색 필드 (13개) ✅
1. **학년도** - Select
2. **학기** - Select (학년도와 복합 필드로 구성)
3. **대학구분** - Select
4. **계열/대학원** - Select
5. **학부(과)전공** - Select
6. **학과/전공** - Select
7. **학위과정** - Select
8. **학적상태** - Select
9. **학번** - Text Input
10. **성명** - Text Input
11. **지도교수명** - Text Input
12. **심사단계** - Select
13. **등록상태** - Select

### 1.3 현재 레이아웃 구조
```html
<div class="bg-white rounded-lg shadow-md">
    <div class="p-6 border-b">
        <div class="flex justify-between items-center mb-4">
            <h3>논문지도 일정 관리</h3>  <!-- ❌ 제목 있음 -->
            <button>등록</button>  <!-- ❌ 등록 버튼 있음 -->
        </div>
        <div class="search-container">  <!-- ❌ 구식 검색 구조 -->
            ...
        </div>
    </div>
</div>
```

### 1.4 현재 테이블 컬럼 (5개) ❌ 변경 필요
1. 일정명
2. 지도 단계 유형
3. 학기
4. 제출 기간
5. 심사 기간

### 1.4.1 사용자 지정 테이블 컬럼 (14개) ✅
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
13. **심사단계**
14. **등록상태**

### 1.5 문제점
❌ **표준 디자인과 다른 점:**
1. 상단에 제목 "논문지도 일정 관리" 표시됨 (표준: 제목 없음)
2. 등록 버튼이 있음 (이 화면은 조회 전용)
3. 검색 필드가 `search-container` / `search-grid` 구조 사용
4. 검색 필드가 2개뿐 (적용대상, 일정명)
5. 학년도와 학기가 별도 필드로 분리됨 (표준: 복합 필드)
6. 버튼 영역이 `search-buttons` 클래스 사용 (표준: `flex justify-end`)
7. 그리드 구조가 명확하지 않음 (표준: `grid grid-cols-X`)
8. 라벨 너비가 고정되지 않음 (표준: `width: 85px`)
9. 입력창 높이가 명시되지 않음 (표준: `height: 34px`)
10. Crimson 버튼 색상이 적용되지 않음 (표준: `bg-[#6A0028]`)
11. 테이블 컬럼이 일정 관리용 (학생 현황이 아님)
12. 초기화 버튼 있음 (표준: 조회 버튼만)

---

## 2. 표준 디자인 적용 계획

### 2.1 검색 영역 재설계

#### AS-IS (현재 - 타이틀 + 2개 필드)
```html
<div class="p-6 border-b">
    <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-800">논문지도 일정 관리</h3>
        <button onclick="switchView('scheduleCreate')">등록</button>
    </div>

    <div class="search-container">
        <div class="search-grid">
            <select id="schedule-search-target" class="search-select">
                <option value="">적용대상 전체</option>
            </select>
            <input type="text" id="schedule-search-keyword" class="search-input">
        </div>
        <div class="search-buttons">
            <button>검색</button>
            <button>초기화</button>
        </div>
    </div>
</div>
```

#### TO-BE (사용자 지정 - 타이틀 제거 + 13개 필드, 5열 그리드)
```html
<!-- 검색 옵션 카드 -->
<div class="bg-white rounded-lg shadow-md">
    <div class="p-6 border-b">
        <div class="grid grid-cols-5 gap-3">
            <!-- 1행: 5개 필드 -->

            <!-- 1. 학년도/학기 (복합 필드) -->
            <div class="flex items-center gap-2">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                    학년도/학기
                </label>
                <div class="flex gap-2 flex-1">
                    <select id="guidance-schedule-year"
                            class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                            style="height: 34px;">
                        <option value="">전체</option>
                        <option value="2025" selected>2025</option>
                        <option value="2024">2024</option>
                    </select>
                    <select id="guidance-schedule-semester"
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
                <select id="guidance-schedule-college-type"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="">전체</option>
                    <option value="일반대학원">일반대학원</option>
                    <option value="특수대학원">특수대학원</option>
                </select>
            </div>

            <!-- 3. 계열/대학원 -->
            <div class="flex items-center gap-2">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                    계열/대학원
                </label>
                <select id="guidance-schedule-college"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="">전체</option>
                    <option value="일반대학원">일반대학원</option>
                    <option value="경영대학원">경영대학원</option>
                    <option value="정보대학원">정보대학원</option>
                </select>
            </div>

            <!-- 4. 학부(과)전공 -->
            <div class="flex items-center gap-2">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                    학부(과)전공
                </label>
                <select id="guidance-schedule-faculty"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="">전체</option>
                    <option value="공학부">공학부</option>
                    <option value="인문사회학부">인문사회학부</option>
                </select>
            </div>

            <!-- 5. 학과/전공 -->
            <div class="flex items-center gap-2">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                    학과/전공
                </label>
                <select id="guidance-schedule-major"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="">전체</option>
                    <option value="컴퓨터공학">컴퓨터공학</option>
                    <option value="경영학">경영학</option>
                </select>
            </div>

            <!-- 2행: 5개 필드 -->

            <!-- 6. 학위과정 -->
            <div class="flex items-center gap-2">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                    학위과정
                </label>
                <select id="guidance-schedule-degree"
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
                <select id="guidance-schedule-status"
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
                       id="guidance-schedule-student-id"
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
                       id="guidance-schedule-student-name"
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
                       id="guidance-schedule-professor"
                       placeholder="지도교수명"
                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                       style="height: 34px;">
            </div>

            <!-- 3행: 3개 필드 + 버튼 -->

            <!-- 11. 심사단계 -->
            <div class="flex items-center gap-2">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                    심사단계
                </label>
                <select id="guidance-schedule-stage"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="">전체</option>
                    <option value="연구계획서">연구계획서</option>
                    <option value="중간보고서">중간보고서</option>
                    <option value="최종논문">최종논문</option>
                </select>
            </div>

            <!-- 12. 등록상태 -->
            <div class="flex items-center gap-2">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                    등록상태
                </label>
                <select id="guidance-schedule-registration"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="">전체</option>
                    <option value="미등록">미등록</option>
                    <option value="등록완료">등록완료</option>
                </select>
            </div>

            <!-- 빈 공간 2개 -->
            <div></div>
            <div></div>

            <!-- 버튼 영역 (마지막 열) -->
            <div class="flex items-center justify-end">
                <button onclick="searchGuidanceSchedule()"
                        class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                    조회
                </button>
            </div>
        </div>
    </div>
</div>
```

### 2.2 주요 변경 사항

#### 변경 1: 타이틀 및 버튼 제거
| 항목 | AS-IS | TO-BE |
|------|-------|-------|
| 화면 제목 | "논문지도 일정 관리" 표시 | **제거** (사이드바에서 확인 가능) |
| 등록 버튼 | 있음 | **제거** (조회 전용 화면) |

#### 변경 2: 검색 영역 구조
| 항목 | AS-IS | TO-BE |
|------|-------|-------|
| 컨테이너 | `search-container` | `bg-white rounded-lg shadow-md` |
| 그리드 | `search-grid` | `grid grid-cols-5 gap-3` |
| 필드 래퍼 | 없음 | `flex items-center gap-2` |
| 라벨 | `search-label` (없음) | `text-xs font-medium text-gray-700 whitespace-nowrap` + `width: 85px` |
| 입력창 (select) | `search-select` | `flex-1 px-2 border border-gray-300 rounded text-xs` + `height: 34px` |
| 입력창 (input) | `search-input` | `flex-1 px-2 border border-gray-300 rounded text-xs` + `height: 34px` |

#### 변경 3: 검색 필드 확장
- **AS-IS**: 2개 필드 (적용대상, 일정명)
- **TO-BE**: 13개 필드 (학년도/학기 복합, 대학구분, 계열/대학원, 학부(과)전공, 학과/전공, 학위과정, 학적상태, 학번, 성명, 지도교수명, 심사단계, 등록상태)

#### 변경 4: 학년도/학기 통합
- **AS-IS**: 학기 필드 없음
- **TO-BE**: 하나의 복합 필드로 통합 (2개 select를 flex로 나란히 배치)

#### 변경 5: 그리드 컬럼 수
- **AS-IS**: 명확한 컬럼 수 없음 (flex 기반)
- **TO-BE**: `grid-cols-5` (13개 필드 → 3행: 5+5+3)

#### 변경 6: 버튼 영역
| 항목 | AS-IS | TO-BE |
|------|-------|-------|
| 컨테이너 | `search-buttons` | `flex justify-end` (그리드 마지막 열) |
| 검색 버튼 | `search-btn search-btn-primary` | `bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium` |
| 초기화 버튼 | `search-btn search-btn-secondary` | **제거** (표준에서는 조회 버튼만 사용) |

#### 변경 7: 버튼 아이콘
- **AS-IS**: `<i class="fas fa-search"></i> 검색`
- **TO-BE**: 아이콘 제거, 텍스트만 "조회"

### 2.3 테이블 영역 재설계

#### AS-IS (현재 - 5개 컬럼)
```html
<thead class="bg-gray-50">
    <tr>
        <th>일정명</th>
        <th>지도 단계 유형</th>
        <th>학기</th>
        <th>제출 기간</th>
        <th>심사 기간</th>
    </tr>
</thead>
```

#### TO-BE (사용자 지정 - 14개 컬럼)
```html
<div class="table-container">
    <div class="table-header">
        <div class="table-header-left">
            <h3 class="table-title">논문지도 일정 현황</h3>
            <span class="table-count">(총 ${data.length}건)</span>
        </div>
    </div>
    <div class="table-scroll">
        <table class="min-w-full divide-y divide-gray-200">
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
                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사단계</th>
                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">등록상태</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                ${data.map((item, index) => `
                    <tr class="hover:bg-gray-50">
                        <td class="py-3 px-4 text-sm text-gray-800">${index + 1}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.year || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.semester || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.collegeType || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.college || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.faculty || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.major || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.degree || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.status || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.studentId || '-'}</td>
                        <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.professor || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${item.stage || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">
                            <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.registrationStatus === '등록완료' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                ${item.registrationStatus || '미등록'}
                            </span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</div>
```

**주요 변경:**
- 컬럼 수: 5개 → 14개
- 컬럼 용도: 일정 정보 → 학생 현황
- 테이블 제목/건수 추가: "논문지도 일정 현황 (총 N건)"
- 등록상태에 Badge 스타일 적용
- table-container 구조 적용 (심사위원 배정 화면과 동일)

---

## 3. 삭제/변경되는 요소

### 3.1 삭제할 UI 요소
- ❌ 화면 제목 "논문지도 일정 관리" (h3)
- ❌ 등록 버튼
- ❌ 초기화 버튼
- ❌ 버튼 아이콘

### 3.2 삭제할 CSS 클래스
- ❌ `search-container`
- ❌ `search-grid`
- ❌ `search-select`
- ❌ `search-input`
- ❌ `search-buttons`
- ❌ `search-btn`
- ❌ `search-btn-primary`
- ❌ `search-btn-secondary`

### 3.3 ID 변경 사항

#### 기존 ID 제거
❌ 기존 ID (사용 안 함):
- `schedule-search-target`
- `schedule-search-keyword`

#### 새로운 ID 추가
✅ 새로 추가되는 검색 필드 ID:
- `guidance-schedule-year` (학년도)
- `guidance-schedule-semester` (학기)
- `guidance-schedule-college-type` (대학구분)
- `guidance-schedule-college` (계열/대학원)
- `guidance-schedule-faculty` (학부(과)전공)
- `guidance-schedule-major` (학과/전공)
- `guidance-schedule-degree` (학위과정)
- `guidance-schedule-status` (학적상태)
- `guidance-schedule-student-id` (학번)
- `guidance-schedule-student-name` (성명)
- `guidance-schedule-professor` (지도교수명)
- `guidance-schedule-stage` (심사단계)
- `guidance-schedule-registration` (등록상태)

---

## 4. 검색 함수 영향 분석

### 4.1 현재 검색 함수
**파일**: `admin-v3/assets/js/admin_main.js`

**함수**:
- `searchSchedule()` - 기존 검색 (적용대상, 일정명)
- `resetScheduleSearch()` - 초기화

### 4.2 필요한 수정
1. ⚠️ **새 함수 생성 필요**: `searchGuidanceSchedule()`
   - 13개 검색 필드 값 수집
   - 필터링 로직 구현
   - Mock 데이터와 연동
2. ❌ 초기화 함수: 제거 또는 사용 안 함

---

## 5. Mock 데이터 구조

### 5.1 기존 데이터 구조 (appData.schedules)
```javascript
{
    id: 1,
    name: "2025학년도 1학기 연구계획서",
    category: "연구계획서",
    semester: "2025-1",
    submissionStartDate: "2025-03-01",
    submissionEndDate: "2025-03-15",
    reviewStartDate: "2025-03-16",
    reviewEndDate: "2025-03-30"
}
```

### 5.2 필요한 새 데이터 구조 (appData.guidanceScheduleStatus)
```javascript
{
    id: 1,
    year: "2025",
    semester: "1",
    collegeType: "일반대학원",
    college: "일반대학원",
    faculty: "공학부",
    major: "컴퓨터공학",
    degree: "석사",
    status: "재학",
    studentId: "2024001234",
    studentName: "김철수",
    professor: "홍길동",
    stage: "연구계획서",
    registrationStatus: "등록완료"
}
```

---

## 6. 구현 우선순위

### Phase 1: 검색 영역 재설계
1. [ ] 화면 제목 및 등록 버튼 제거
2. [ ] 검색 컨테이너를 표준 카드 스타일로 변경
3. [ ] 그리드를 `grid-cols-5`로 변경 (3행 구조: 5+5+3)
4. [ ] 학년도/학기를 복합 필드로 통합
5. [ ] 새로운 검색 필드 13개 추가
6. [ ] 모든 필드를 표준 스타일 적용 (라벨 85px, 입력창 34px)
7. [ ] 버튼 영역을 표준 스타일로 변경 (그리드 마지막 열에 배치)
8. [ ] 초기화 버튼 제거

### Phase 2: 테이블 영역 재설계
1. [ ] table-container 구조 적용
2. [ ] 테이블 제목 "논문지도 일정 현황" 및 건수 추가
3. [ ] 테이블 컬럼을 14개로 확장
4. [ ] 학생 현황 데이터로 변경
5. [ ] 등록상태에 Badge 스타일 적용

### Phase 3: Mock 데이터 추가
1. [ ] appData.guidanceScheduleStatus 데이터 생성
2. [ ] 학생별 논문지도 일정 현황 샘플 데이터 (20건 이상)

### Phase 4: 검색 함수 구현
1. [ ] `searchGuidanceSchedule()` 함수 생성
2. [ ] 13개 검색 필드 필터링 로직 추가
3. [ ] Mock 데이터 필드 매핑 확인

### Phase 5: 테스트
1. [ ] 검색 기능 동작 확인 (13개 필드)
2. [ ] 테이블 표시 확인 (14개 컬럼)
3. [ ] 학년도/학기 필터링 확인
4. [ ] 등록상태 Badge 표시 확인
5. [ ] 버튼 hover 효과 확인

---

## 7. 참조 화면

### 7.1 표준 디자인 참조
- **문서**: `docs/admin-v3-search-layout-standard.md`
- **참조 화면**: 학기별 지도 계획 (`admin_weekly_guidance.js`)
- **참조 화면**: 지도교수 배정 (`admin_views.js` 라인 2885-3080)
- **참조 화면**: 심사위원 배정 (`admin_main.js` 라인 5874-6149)

### 7.2 검색 필드 레이아웃 참조
- **학기별 지도 계획**: 검색 필드 10개, grid-cols-5, 2행 구조
- **지도교수 배정**: 검색 필드 10개, grid-cols-5, 2행 구조
- **심사위원 배정**: 테이블 제목/건수 표시 참조

---

## 8. 작업 체크리스트

- [ ] admin_views.js의 scheduleManagement 함수 완전 재작성 (라인 1388-1457)
  - [ ] 검색 영역 HTML 구조 변경
    - [ ] 화면 제목 및 등록 버튼 제거
    - [ ] 13개 검색 필드 구현 (학년도/학기 복합 포함)
    - [ ] 그리드 레이아웃 적용 (grid-cols-5, 3행)
    - [ ] 표준 버튼 스타일 적용 (마지막 열에 배치)
    - [ ] 초기화 버튼 제거
  - [ ] 테이블 HTML 구조 변경
    - [ ] table-container 구조 적용
    - [ ] 테이블 제목/건수 추가
    - [ ] 14개 컬럼으로 확장 (학생 현황 데이터)
    - [ ] 등록상태 Badge 스타일 적용
- [ ] admin_data.js에 guidanceScheduleStatus Mock 데이터 추가
  - [ ] 샘플 데이터 20건 이상 생성
  - [ ] 14개 필드 모두 포함
- [ ] admin_main.js에 searchGuidanceSchedule 함수 추가
  - [ ] 13개 검색 필드 값 수집
  - [ ] 필터링 로직 추가
  - [ ] Mock 데이터 매핑 확인
- [ ] 동작 테스트
  - [ ] 검색 기능 정상 작동 확인 (13개 필드)
  - [ ] 테이블 표시 확인 (14개 컬럼)
  - [ ] 학년도/학기 필터링 확인
  - [ ] 등록상태 Badge 표시 확인
  - [ ] 버튼 hover 효과 확인

---

## 9. 예상 코드 변경량

| 파일 | 변경 라인 | 변경 내용 |
|------|-----------|-----------|
| `admin_views.js` | 1388-1457 | scheduleManagement 함수 완전 재작성 (약 150라인) |
| `admin_data.js` | 신규 추가 | guidanceScheduleStatus Mock 데이터 (약 100라인) |
| `admin_main.js` | 신규 추가 | searchGuidanceSchedule 함수 (약 50라인) |

**총 예상 작업 시간**: 90분

---

## 10. 완료 기준

✅ **완료 조건**:
1. 화면 제목 "논문지도 일정 관리" 제거됨
2. 등록 버튼 제거됨
3. 검색 영역이 표준 디자인 문서와 100% 일치
4. 검색 필드가 13개로 확장 (학년도/학기 복합 포함)
5. 그리드가 `grid-cols-5` 3행 구조 (5+5+3)
6. 조회 버튼이 Crimson 색상 (`bg-[#6A0028]`)이며 그리드 마지막 열에 배치
7. 초기화 버튼 제거됨
8. 테이블이 table-container 구조 사용
9. 테이블 제목 "논문지도 일정 현황 (총 N건)" 표시
10. 테이블 컬럼이 14개로 확장 (학생 현황 데이터)
11. 등록상태가 Badge 스타일로 표시
12. 검색 기능이 13개 필드 모두 정상 작동

---

## 11. 구현자
Claude Sonnet 4.5

## 12. 참고 문서
- [표준 검색 레이아웃](./admin-v3-search-layout-standard.md)
- [심사위원 배정 재설계](./admin-v3-committee-assignment-redesign-plan.md)
