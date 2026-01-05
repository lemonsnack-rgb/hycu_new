# 심사위원 배정 화면 수정계획서 (Admin-v3)

## 개요
기존 `admin/assets/js/admin-committee-assignment.js`를 admin-v3로 마이그레이션하여 표준 디자인 적용 및 검색 기능 확장

## 구현 일자
2026-01-05

---

## 1. 현재 구현 분석 (AS-IS)

### 1.1 파일 위치
- **기존 파일**: [admin/assets/js/admin-committee-assignment.js](../admin/assets/js/admin-committee-assignment.js)
- **구현 라인**: 1-625
- **상태**: 구형 디자인, 검색 필드 부족

### 1.2 현재 검색 필드 (7개)
1. 학년도
2. 학기차
3. 학과/전공
4. 학위과정
5. 심사 대상
6. 학번
7. 이름

### 1.3 현재 테이블 컬럼 (11개)
1. 학년도
2. 학기차
3. 학번
4. 학과
5. 이름
6. 학위과정
7. 심사 대상
8. 논문 제목
9. 지도교수
10. 제출일
11. 관리

### 1.4 현재 디자인 문제점
- ❌ **구형 레이아웃**: `search-container` / `search-grid` 클래스 사용 (deprecated)
- ❌ **수직 라벨**: 라벨이 입력창 위에 배치되어 공간 낭비
- ❌ **검색/초기화 버튼**: 2개 버튼 사용 (표준은 조회 버튼 1개)
- ❌ **검색 필드 부족**: 대학구분, 계열/대학원, 학부(과)전공, 학적상태, 배정상태 등 누락
- ❌ **테이블 컬럼 부족**: 대학구분, 계열/대학원, 학부(과)전공, 학적상태, 배정상태 등 누락

---

## 2. 표준 디자인 적용 계획 (TO-BE)

### 2.1 구현 위치
- **파일**: [admin-v3/assets/js/admin-committee-assignment.js](../admin-v3/assets/js/admin-committee-assignment.js) (신규 생성)
- **HTML 구조**: [admin-v3/assets/js/admin_views.js](../admin-v3/assets/js/admin_views.js)의 `committeeAssignment` 함수 수정
- **참조 문서**: [docs/admin-v3-search-layout-standard.md](./admin-v3-search-layout-standard.md)

### 2.2 신규 검색 필드 (13개)
사용자 요구사항에 따라 다음 13개 필드를 `grid-cols-5` 레이아웃으로 배치:

#### 1행 (5개)
1. **학년도/학기** (복합 필드) - `yearFilter` + `semesterFilter`
2. **대학구분** - `collegeTypeFilter` (Select: 전체, 대학원)
3. **계열/대학원** - `graduateFilter` (Select: 전체, 일반대학원, 경영대학원, 정보대학원)
4. **학부(과)전공** - `undergraduateMajorFilter` (Text Input)
5. **학과/전공** - `majorFilter` (Text Input)

#### 2행 (5개)
6. **학위과정** - `degreeFilter` (Select: 전체, 석사, 박사, 석박통합)
7. **학적상태** - `statusFilter` (Select: 전체, 재학, 휴학, 졸업, 수료)
8. **학번** - `studentIdFilter` (Text Input)
9. **성명** - `studentNameFilter` (Text Input)
10. **지도교수명** - `advisorNameFilter` (Text Input)

#### 3행 (3개 + 버튼)
11. **심사단계** - `reviewStageFilter` (Select: 전체, 연구계획서, 1차 보고서, 최종논문)
12. **배정상태** - `assignmentStatusFilter` (Select: 전체, 배정 대기, 배정 완료)
13. (빈 공간 2칸)
14. **조회 버튼** (Crimson)

### 2.3 신규 테이블 컬럼 (14개)
사용자 요구사항에 따라 다음 14개 컬럼 표시:

| 순번 | 컬럼명 | 데이터 키 | 정렬 | 너비 |
|------|--------|-----------|------|------|
| 1 | 순번 | (자동 증가) | - | 60px |
| 2 | 학년도 | `academicYear` | 가능 | 80px |
| 3 | 학기 | `semester` | 가능 | 70px |
| 4 | 대학구분 | `collegeType` | - | 90px |
| 5 | 계열/대학원 | `graduate` | - | 110px |
| 6 | 학부(과)전공 | `undergraduateMajor` | - | 120px |
| 7 | 학과/전공 | `major` | - | 120px |
| 8 | 학위과정 | `degreeType` | 가능 | 90px |
| 9 | 학적상태 | `status` | - | 80px |
| 10 | 학번 | `studentNumber` | - | 100px |
| 11 | 성명 | `studentName` | - | 90px |
| 12 | 지도교수명 | `advisorName` | - | 100px |
| 13 | 심사단계 | `reviewStage` | - | 100px |
| 14 | 배정상태 | `assignmentStatus` | - | 100px |
| 15 | 관리 | (배정 버튼) | - | 80px |

### 2.4 표준 디자인 패턴

#### 검색 영역 구조
```html
<div class="bg-white rounded-lg shadow-md p-6 mb-4">
    <div class="grid grid-cols-5 gap-3">
        <!-- 13개 검색 필드 -->
    </div>

    <!-- 조회 버튼 -->
    <div class="flex justify-end mt-4">
        <button onclick="searchCommitteeAssignment()"
                class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
            조회
        </button>
    </div>
</div>
```

#### 필드 구조 (기본)
```html
<div class="flex items-center gap-2">
    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
        필드명
    </label>
    <input type="text" id="fieldId" placeholder="입력하세요"
           class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
           style="height: 34px;">
</div>
```

#### 학년도/학기 복합 필드
```html
<div class="flex items-center gap-2">
    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
        학년도/학기
    </label>
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
```

#### 테이블 헤더
```html
<thead class="bg-gray-50">
    <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순번</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학년도</th>
        <!-- ... 나머지 컬럼 ... -->
    </tr>
</thead>
```

---

## 3. Mock 데이터 확장

### 3.1 현재 Mock 데이터 (mockReviewTargets)
**파일**: [admin/assets/js/admin-committee-assignment.js](../admin/assets/js/admin-committee-assignment.js) (라인 625+ 이후, admin-data.js 파일에 정의되어 있을 가능성)

**기존 필드**:
- `id`, `studentId`, `studentNumber`, `studentName`, `department`, `degreeType`, `academicYear`, `semesterCount`, `reviewType`, `title`, `advisorName`, `submittedDate`, `status`

### 3.2 신규 추가 필드
Mock 데이터에 다음 필드 추가 필요:

```javascript
{
    id: 'RT001',
    studentId: 'S001',
    studentNumber: '2024001234',
    studentName: '김철수',

    // 기존 필드
    academicYear: '2025',
    semesterCount: 1,
    department: '컴퓨터공학과',
    degreeType: '박사',
    reviewType: 'proposal',
    title: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
    advisorName: '홍길동',
    submittedDate: '2025-11-20',
    status: 'pending', // 'pending' (배정 대기), 'assigned' (배정 완료)

    // 신규 추가 필드
    semester: '1', // 학기 (1, 2)
    collegeType: '대학원', // 대학구분
    graduate: '일반대학원', // 계열/대학원
    undergraduateMajor: '-', // 학부(과)전공 (대학원생은 '-')
    major: '컴퓨터공학', // 학과/전공
    academicStatus: '재학', // 학적상태 (재학, 휴학, 졸업, 수료)
    reviewStage: '연구계획서', // 심사단계 (연구계획서, 1차 보고서, 최종논문)
    assignmentStatus: '배정 대기' // 배정상태 (배정 대기, 배정 완료)
}
```

### 3.3 Mock 데이터 샘플 (최소 5개)
**파일**: [admin-v3/assets/js/admin_data.js](../admin-v3/assets/js/admin_data.js) 또는 별도 파일

```javascript
const mockCommitteeAssignmentData = [
    {
        id: 'CA001',
        studentId: 'S001',
        studentNumber: '2024001234',
        studentName: '김철수',
        academicYear: '2025',
        semester: '1',
        collegeType: '대학원',
        graduate: '일반대학원',
        undergraduateMajor: '-',
        major: '컴퓨터공학',
        degreeType: '박사',
        academicStatus: '재학',
        reviewStage: '연구계획서',
        assignmentStatus: '배정 대기',
        advisorName: '홍길동',
        thesisTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
        submitDate: '2025-11-20'
    },
    {
        id: 'CA002',
        studentId: 'S002',
        studentNumber: '2024001235',
        studentName: '이영희',
        academicYear: '2025',
        semester: '1',
        collegeType: '대학원',
        graduate: '경영대학원',
        undergraduateMajor: '-',
        major: '경영학',
        degreeType: '석사',
        academicStatus: '재학',
        reviewStage: '최종논문',
        assignmentStatus: '배정 완료',
        advisorName: '김교수',
        thesisTitle: '디지털 전환 시대의 조직 혁신 전략 연구',
        submitDate: '2025-11-18'
    },
    {
        id: 'CA003',
        studentId: 'S003',
        studentNumber: '2024001236',
        studentName: '박민수',
        academicYear: '2025',
        semester: '1',
        collegeType: '대학원',
        graduate: '일반대학원',
        undergraduateMajor: '-',
        major: '교육학',
        degreeType: '석사',
        academicStatus: '재학',
        reviewStage: '1차 보고서',
        assignmentStatus: '배정 대기',
        advisorName: '이교수',
        thesisTitle: '온라인 학습 환경에서의 학습자 참여도 분석',
        submitDate: '2025-11-15'
    },
    {
        id: 'CA004',
        studentId: 'S004',
        studentNumber: '2024001237',
        studentName: '최지우',
        academicYear: '2025',
        semester: '1',
        collegeType: '대학원',
        graduate: '정보대학원',
        undergraduateMajor: '-',
        major: '정보보호학',
        degreeType: '박사',
        academicStatus: '재학',
        reviewStage: '연구계획서',
        assignmentStatus: '배정 대기',
        advisorName: '박교수',
        thesisTitle: '블록체인 기반 개인정보 보호 시스템 설계',
        submitDate: '2025-11-22'
    },
    {
        id: 'CA005',
        studentId: 'S005',
        studentNumber: '2024001238',
        studentName: '정수연',
        academicYear: '2025',
        semester: '1',
        collegeType: '대학원',
        graduate: '일반대학원',
        undergraduateMajor: '-',
        major: '심리학',
        degreeType: '석사',
        academicStatus: '재학',
        reviewStage: '최종논문',
        assignmentStatus: '배정 대기',
        advisorName: '최교수',
        thesisTitle: '청소년 스마트폰 중독과 우울증의 상관관계 연구',
        submitDate: '2025-11-10'
    }
];
```

---

## 4. 함수 수정 계획

### 4.1 메인 렌더링 함수
**함수명**: `showCommitteeAssignment()`
**위치**: [admin-v3/assets/js/admin_main.js](../admin-v3/assets/js/admin_main.js)

**수정 내용**:
1. 검색 영역: `grid grid-cols-5 gap-3` 구조로 변경
2. 13개 검색 필드 추가
3. 버튼: "조회" 1개만 표시 (초기화 버튼 제거)
4. 테이블: 14개 컬럼 표시

**함수 구조**:
```javascript
function showCommitteeAssignment() {
    const data = window.filteredCommitteeData || mockCommitteeAssignmentData;

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 검색 영역 -->
            <div class="p-6 mb-4">
                <div class="grid grid-cols-5 gap-3">
                    <!-- 13개 검색 필드 -->
                </div>
                <div class="flex justify-end mt-4">
                    <button onclick="searchCommitteeAssignment()"
                            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                        조회
                    </button>
                </div>
            </div>

            <!-- 테이블 영역 -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <!-- 15개 컬럼 헤더 (순번 포함) -->
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${data.map((item, index) => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${index + 1}</td>
                                <!-- 14개 데이터 컬럼 -->
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const contentArea = document.getElementById('committee-assignment-content');
    if (contentArea) {
        contentArea.innerHTML = html;
    }
}
```

### 4.2 검색 함수
**함수명**: `searchCommitteeAssignment()`
**위치**: [admin-v3/assets/js/admin_main.js](../admin-v3/assets/js/admin_main.js)

**수정 내용**:
1. 13개 검색 필드 값 수집
2. 필터링 로직 구현
3. 결과를 `window.filteredCommitteeData`에 저장
4. `showCommitteeAssignment()` 재렌더링
5. `showNotification()` 결과 알림

**함수 구조**:
```javascript
function searchCommitteeAssignment() {
    // 13개 필드 값 수집
    const year = document.getElementById('yearFilter')?.value || '';
    const semester = document.getElementById('semesterFilter')?.value || '';
    const collegeType = document.getElementById('collegeTypeFilter')?.value || '';
    const graduate = document.getElementById('graduateFilter')?.value || '';
    const undergraduateMajor = document.getElementById('undergraduateMajorFilter')?.value.trim() || '';
    const major = document.getElementById('majorFilter')?.value.trim() || '';
    const degree = document.getElementById('degreeFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const studentId = document.getElementById('studentIdFilter')?.value.trim() || '';
    const studentName = document.getElementById('studentNameFilter')?.value.trim() || '';
    const advisorName = document.getElementById('advisorNameFilter')?.value.trim() || '';
    const reviewStage = document.getElementById('reviewStageFilter')?.value || '';
    const assignmentStatus = document.getElementById('assignmentStatusFilter')?.value || '';

    // 필터링
    let filtered = mockCommitteeAssignmentData.filter(item => {
        if (year && item.academicYear !== year) return false;
        if (semester && item.semester !== semester) return false;
        if (collegeType && item.collegeType !== collegeType) return false;
        if (graduate && item.graduate !== graduate) return false;
        if (undergraduateMajor && !item.undergraduateMajor.includes(undergraduateMajor)) return false;
        if (major && !item.major.includes(major)) return false;
        if (degree && item.degreeType !== degree) return false;
        if (status && item.academicStatus !== status) return false;
        if (studentId && !item.studentNumber.includes(studentId)) return false;
        if (studentName && !item.studentName.includes(studentName)) return false;
        if (advisorName && !item.advisorName.includes(advisorName)) return false;
        if (reviewStage && item.reviewStage !== reviewStage) return false;
        if (assignmentStatus && item.assignmentStatus !== assignmentStatus) return false;
        return true;
    });

    window.filteredCommitteeData = filtered;
    showCommitteeAssignment();

    showNotification(`검색 결과: ${filtered.length}건`, 'success');
}
```

### 4.3 기존 함수 유지
다음 함수들은 기존 로직을 유지하되, 데이터 키명만 신규 Mock 데이터에 맞게 수정:

1. **openCommitteeAssignmentModal(id)**: 심사위원 배정 모달 열기
2. **closeCommitteeAssignmentModal()**: 모달 닫기
3. **handleCommitteeSelection(profId, isChair)**: 심사위원 선택 처리
4. **filterCommitteeMembers(side)**: 심사위원 필터링
5. **confirmCommitteeAssignment()**: 배정 완료 처리

---

## 5. HTML 구조 변경

### 5.1 admin_views.js 수정
**파일**: [admin-v3/assets/js/admin_views.js](../admin-v3/assets/js/admin_views.js)

**수정 위치**: `committeeAssignment` 함수 (라인 위치는 파일 확인 필요)

**변경 전** (없음 - 신규 생성):
```javascript
committeeAssignment: () => {
    return `
        <div id="committee-assignment-content">
            <!-- JavaScript로 동적 렌더링 -->
        </div>
    `;
}
```

**변경 후**:
```javascript
committeeAssignment: () => {
    // 초기화
    setTimeout(() => {
        if (typeof showCommitteeAssignment === 'function') {
            showCommitteeAssignment();
        }
    }, 100);

    return `
        <div id="committee-assignment-content">
            <!-- showCommitteeAssignment() 함수가 여기에 렌더링 -->
        </div>
    `;
}
```

### 5.2 index.html 스크립트 추가
**파일**: [admin-v3/index.html](../admin-v3/index.html)

**추가 위치**: `<script>` 태그 영역 (다른 JS 파일들 아래)

```html
<!-- Committee Assignment Script -->
<script src="assets/js/admin-committee-assignment.js"></script>
```

---

## 6. 구현 순서

### Phase 1: Mock 데이터 준비
1. `admin-v3/assets/js/admin_data.js`에 `mockCommitteeAssignmentData` 배열 추가
2. 5개 샘플 데이터 입력 (위 3.3 참조)
3. 데이터 구조 검증

### Phase 2: 검색 영역 표준화
1. `admin-v3/assets/js/admin_main.js`에 `showCommitteeAssignment()` 함수 작성
2. 검색 영역 HTML 생성 (`grid-cols-5`, 13개 필드)
3. 조회 버튼 추가 (Crimson 스타일)

### Phase 3: 테이블 영역 표준화
1. 테이블 헤더 생성 (14개 컬럼 + 순번)
2. 테이블 바디 생성 (Mock 데이터 렌더링)
3. 배정 버튼 추가 (기존 모달 연결)

### Phase 4: 검색 함수 구현
1. `searchCommitteeAssignment()` 함수 작성
2. 13개 필드 값 수집 로직
3. 필터링 로직 구현
4. 결과 렌더링 및 알림

### Phase 5: 기존 함수 통합
1. 기존 `openCommitteeAssignmentModal()` 함수 복사
2. Mock 데이터 키명 수정
3. 모달 내 학생 정보 표시 필드 추가 (대학구분, 계열/대학원 등)

### Phase 6: 네비게이션 연결
1. `admin_views.js`의 `committeeAssignment` 함수 수정
2. `admin-v3/index.html`에 스크립트 추가
3. 메뉴 클릭 시 화면 전환 테스트

---

## 7. 완료 기준

### 7.1 기능 요구사항
- [ ] 13개 검색 필드 모두 표시
- [ ] 14개 테이블 컬럼 모두 표시 (순번 포함)
- [ ] 조회 버튼 클릭 시 필터링 작동
- [ ] 배정 버튼 클릭 시 모달 열림
- [ ] 심사위원 배정 모달 정상 작동

### 7.2 디자인 요구사항
- [ ] 검색 영역: `grid-cols-5` 레이아웃 (3행)
- [ ] 필드 라벨: 고정 너비 `85px`
- [ ] 입력창: 고정 높이 `34px`
- [ ] 조회 버튼: Crimson 색상 (`#6A0028`)
- [ ] 테이블: 표준 헤더 스타일 (`bg-gray-50`)

### 7.3 테스트 항목
- [ ] 각 검색 필드 개별 테스트
- [ ] 복합 검색 테스트 (여러 필드 동시 사용)
- [ ] 검색 결과 0건 시 메시지 표시
- [ ] 테이블 정렬 기능 (학년도, 학기, 학위과정)
- [ ] 배정 모달 열기/닫기
- [ ] 심사위원 선택 및 배정 완료

---

## 8. 참고 문서

### 8.1 디자인 표준
- [admin-v3 검색 레이아웃 표준](./admin-v3-search-layout-standard.md)
- [학기별 지도 계획 구현](../admin-v3/assets/js/admin_weekly_guidance.js)
- [지도교수 배정 구현](../admin-v3/assets/js/admin_views.js:2770-2884)

### 8.2 기존 구현
- [admin 심사위원 배정](../admin/assets/js/admin-committee-assignment.js)

### 8.3 관련 화면
- [최종 논문 제목 등록 재설계](./admin-v3-title-registration-redesign-plan.md)
- [온라인 피드백 읽기 전용](./admin-v3-feedback-readonly-implementation.md)

---

## 9. 주의사항

### 9.1 Git 작업 규칙
- **절대 규칙**: 모든 수정-커밋-푸시는 반드시 사용자 승인 후에 실행
- 코드 수정 완료 후 변경 사항을 사용자에게 명확히 설명
- 사용자 승인이 확인된 후에만 git 명령어 실행

### 9.2 기존 기능 유지
- 심사위원 배정 모달의 좌우 2분할 레이아웃 유지
- 심사위원장 1명 + 심사위원 N명 선택 로직 유지
- 학과 필터 및 교수명 검색 기능 유지

### 9.3 데이터 일관성
- Mock 데이터의 키명을 일관되게 사용
- `reviewStage` vs `reviewType` 혼동 주의
- `assignmentStatus` vs `status` 혼동 주의

---

## 10. 예상 파일 변경

### 10.1 신규 파일
- [ ] `admin-v3/assets/js/admin-committee-assignment.js` (옵션: 기존 함수 복사 시)

### 10.2 수정 파일
- [ ] `admin-v3/assets/js/admin_main.js` (메인 함수 추가)
- [ ] `admin-v3/assets/js/admin_views.js` (`committeeAssignment` 함수 수정)
- [ ] `admin-v3/assets/js/admin_data.js` (Mock 데이터 추가)
- [ ] `admin-v3/index.html` (스크립트 링크 추가)

---

## 11. 구현자
Claude Sonnet 4.5

## 12. 문서 버전
1.0 (2026-01-05)
