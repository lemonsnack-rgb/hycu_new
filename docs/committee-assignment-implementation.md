# 심사위원 배정 기능 구현 완료 (P1-5)

## 구현 일자
2025-12-08

## 구현 개요
관리자가 논문 심사 대상 학생에게 심사위원장과 심사위원을 배정하는 기능을 구현하였습니다.

## 주요 변경 사항

### 1. Mock 데이터 추가

#### mockData.js에 추가된 데이터 구조

**1.1 심사 대상 학생 (mockReviewTargets)**
- 총 10명의 심사 대상 학생
- 연구계획서 심사 대상: 5명 (status: 'pending')
- 최종논문 심사 대상: 5명 (3명 배정 완료, 2명 배정 대기)

```javascript
const mockReviewTargets = [
    {
        id: 'RT001',
        studentId: 'STU002',
        studentNumber: '2024002',
        studentName: '이학생',
        department: '컴퓨터공학과',
        degreeType: '석사',
        reviewType: 'proposal', // 'proposal', 'progress', 'final'
        title: '블록체인 기반 데이터 무결성 보장 방안',
        submittedDate: '2025-03-11',
        advisorId: 'PROF001',
        advisorName: '김교수',
        status: 'pending' // 'pending', 'assigned'
    },
    // ... 9개 더
];
```

**1.2 심사위원 배정 데이터 (mockCommitteeAssignments)**
- 3건의 배정 완료 데이터 (석사 최종논문)
- 심사위원장 1명 + 심사위원 2명 구조

```javascript
const mockCommitteeAssignments = [
    {
        id: 'CA001',
        reviewTargetId: 'RT006',
        studentId: 'STU004',
        studentName: '최학생',
        department: '경영학과',
        degreeType: '석사',
        reviewType: 'final',
        chairId: 'PROF003',
        chairName: '박교수',
        members: [
            { professorId: 'PROF003', professorName: '박교수', role: 'chair', department: '경영학과' },
            { professorId: 'PROF004', professorName: '이교수', role: 'member', department: '경영학과' },
            { professorId: 'PROF002', professorName: '이교수', role: 'member', department: '컴퓨터공학과' }
        ],
        assignedDate: '2025-02-20',
        status: 'completed'
    },
    // ... 2건 더
];
```

### 2. 메뉴 구조 추가

#### admin-dashboard.html (Lines 205-221)
논문 심사 메뉴에 "심사위원 배정" 서브메뉴를 최상단에 추가:

```html
<div id="thesis-review-submenu" class="pl-6 mt-1 space-y-1">
    <a href="#" data-view="committeeAssignment" class="sidebar-sublink ...">
        <span class="ml-4">심사위원 배정</span>
    </a>
    <a href="#" data-view="evaluationCriteria" class="sidebar-sublink ...">
        <span class="ml-4">심사 기준 등록</span>
    </a>
    <!-- ... 기타 메뉴 ... -->
</div>
```

#### admin_main.js (Line 27)
viewTitles 객체에 'committeeAssignment' 추가:

```javascript
const viewTitles = {
    // ... 기존 항목들 ...
    committeeAssignment: '심사위원 배정',
    // ... 기존 항목들 ...
};
```

#### admin_views.js (Lines 2373-2401)
committeeAssignment 뷰 함수 추가:

```javascript
committeeAssignment: () => {
    // Mock 데이터 체크
    if (typeof mockReviewTargets === 'undefined' || typeof mockCommitteeAssignments === 'undefined') {
        return `<div class="bg-white rounded-lg shadow-md p-8">
            <div class="text-center text-red-500">
                <p class="text-lg">Mock 데이터가 로드되지 않았습니다.</p>
            </div>
        </div>`;
    }

    // JavaScript 파일 동적 로드
    if (!document.querySelector('script[src="assets/js/admin-committee-assignment.js"]')) {
        const script = document.createElement('script');
        script.src = 'assets/js/admin-committee-assignment.js';
        script.onload = () => {
            if (typeof renderCommitteeAssignmentContent === 'function') {
                renderCommitteeAssignmentContent();
            }
        };
        document.body.appendChild(script);
    }

    return `<div id="committee-assignment-content"></div>`;
}
```

### 3. 핵심 기능 구현

#### 파일: admin/assets/js/admin-committee-assignment.js

**3.1 메인 렌더링 함수**

```javascript
function renderCommitteeAssignmentContent() {
    const data = window.filteredCommitteeData || mockReviewTargets;
    const pendingReviews = data.filter(item => item.status === 'pending');

    // 심사 대기 중인 학생 목록 테이블 렌더링
    // 검색 필터: 심사 유형, 학과/전공, 학위과정, 학번, 이름
    // 테이블 컬럼: 학번, 학과, 성명, 학위과정, 심사 유형, 논문 제목, 지도교수, 제출일, 관리
}
```

**3.2 검색 기능**

```javascript
function searchCommitteeAssignment() {
    const reviewType = document.getElementById('committee-search-review-type').value;
    const department = document.getElementById('committee-search-department').value;
    const degree = document.getElementById('committee-search-degree').value;
    const studentNumber = document.getElementById('committee-search-student-number').value.trim();
    const name = document.getElementById('committee-search-name').value.trim();

    let filtered = mockReviewTargets.filter(item => {
        if (reviewType && item.reviewType !== reviewType) return false;
        if (department && item.department !== department) return false;
        if (degree && item.degreeType !== degree) return false;
        if (studentNumber && !item.studentNumber.includes(studentNumber)) return false;
        if (name && !item.studentName.includes(name)) return false;
        return true;
    });

    window.filteredCommitteeData = filtered;
    renderCommitteeAssignmentContent();
}
```

**3.3 심사위원 배정 모달**

```javascript
function openCommitteeAssignmentModal(reviewTargetId) {
    const reviewTarget = mockReviewTargets.find(rt => rt.id === reviewTargetId);

    window.selectedReviewTarget = reviewTarget;
    window.selectedChair = null;
    window.selectedMembers = [];

    // 모달 HTML 생성
    // - 학생 정보 표시 (학번, 성명, 학과, 학위과정, 심사 유형, 논문 제목, 지도교수)
    // - 심사위원장 선택 영역 (검색 버튼)
    // - 심사위원 선택 영역 (검색 버튼)
    // - 안내 메시지 (석사 3명 이상, 박사 5명 이상)
}
```

**3.4 교수 검색 모달 (심사위원장 / 심사위원)**

```javascript
function openProfessorSearchModal(mode) {
    window.searchMode = mode; // 'chair' or 'members'
    const title = mode === 'chair' ? '심사위원장 검색' : '심사위원 검색';

    // 모달 생성
    // - 검색 필터: 학과, 이름, 전임교원 체크박스
    // - 교수 목록 테이블
    // - 선택 방식:
    //   - 심사위원장: 라디오 버튼 (1명만 선택)
    //   - 심사위원: 체크박스 (N명 선택)
}

function searchProfessors() {
    const department = document.getElementById('prof-search-department').value;
    const name = document.getElementById('prof-search-name').value.trim();
    const tenuredOnly = document.getElementById('prof-search-tenured').checked;

    let filtered = mockProfessors.filter(prof => {
        if (department && prof.department !== department) return false;
        if (name && !prof.name.includes(name)) return false;
        if (tenuredOnly && !prof.isTenured) return false;
        return true;
    });

    document.getElementById('professor-list-container').innerHTML = renderProfessorList(filtered);
}
```

**3.5 심사위원장 선택**

```javascript
function selectChair(professorId) {
    const professor = mockProfessors.find(p => p.id === professorId);
    window.selectedChair = professor;

    // 심사위원장이 심사위원 목록에 있으면 제거 (중복 방지)
    window.selectedMembers = window.selectedMembers.filter(m => m.id !== professorId);

    updateSelectedChairDisplay();
    updateSelectedMembersDisplay();
    closeProfessorSearchModal();
}
```

**3.6 심사위원 선택**

```javascript
function toggleMember(professorId) {
    const professor = mockProfessors.find(p => p.id === professorId);

    // 심사위원장과 동일한 교수는 선택 불가
    if (window.selectedChair && window.selectedChair.id === professorId) {
        showNotification('심사위원장은 심사위원으로 중복 선택할 수 없습니다.', 'warning');
        return;
    }

    const index = window.selectedMembers.findIndex(m => m.id === professorId);
    if (index > -1) {
        window.selectedMembers.splice(index, 1);
    } else {
        window.selectedMembers.push(professor);
    }
}
```

**3.7 배정 완료**

```javascript
function confirmCommitteeAssignment() {
    const reviewTarget = window.selectedReviewTarget;
    const chair = window.selectedChair;
    const members = window.selectedMembers;

    // 유효성 검사
    if (!chair) {
        showNotification('심사위원장을 선택해주세요.', 'warning');
        return;
    }

    const minMembers = reviewTarget.degreeType === '석사' ? 2 : 4;
    if (members.length < minMembers) {
        showNotification(`${reviewTarget.degreeType} 과정은 심사위원을 ${minMembers}명 이상 선택해야 합니다.`, 'warning');
        return;
    }

    // 배정 데이터 생성
    const assignment = {
        id: `CA${String(mockCommitteeAssignments.length + 1).padStart(3, '0')}`,
        reviewTargetId: reviewTarget.id,
        studentId: reviewTarget.studentId,
        chairId: chair.id,
        chairName: chair.name,
        members: [
            { professorId: chair.id, professorName: chair.name, role: 'chair', department: chair.department },
            ...members.map(m => ({
                professorId: m.id,
                professorName: m.name,
                role: 'member',
                department: m.department
            }))
        ],
        assignedDate: new Date().toISOString().split('T')[0],
        status: 'completed'
    };

    mockCommitteeAssignments.push(assignment);

    // 심사 대상 상태 업데이트
    const targetIndex = mockReviewTargets.findIndex(rt => rt.id === reviewTarget.id);
    if (targetIndex > -1) {
        mockReviewTargets[targetIndex].status = 'assigned';
    }

    closeCommitteeAssignmentModal();
    renderCommitteeAssignmentContent();

    showNotification(
        `${reviewTarget.studentName} 학생의 심사위원 배정이 완료되었습니다. (심사위원장: ${chair.name}, 심사위원: ${members.length}명)`,
        'success'
    );
}
```

### 4. UI/UX 특징

**4.1 검색 필터**
- 심사 유형: 연구계획서, 1차 보고서, 최종논문
- 학과/전공: 5개 학과 선택
- 학위과정: 석사/박사
- 학번, 이름: 텍스트 검색

**4.2 심사 대상 학생 목록**
- 배정 대기 중인 학생만 표시 (status: 'pending')
- 학생 정보 아이콘 클릭 → 학생 상세 정보 모달
- 배정 버튼 → 심사위원 배정 모달

**4.3 심사위원 배정 모달**
- 학생 정보 표시 (회색 배경 박스)
  - 학번, 성명, 학과, 학위과정
  - 심사 유형, 논문 제목, 지도교수
- 심사위원장 선택 영역
  - 선택된 교수 정보 표시 (이름, 학과, 교번, 전임 여부)
  - 제거 버튼 (X)
- 심사위원 선택 영역
  - 선택된 교수 목록 (번호, 이름, 학과, 전임 여부)
  - 개별 제거 버튼
- 안내 메시지
  - 석사: 심사위원장 1명 + 심사위원 2명 이상 (총 3명 이상)
  - 박사: 심사위원장 1명 + 심사위원 4명 이상 (총 5명 이상)

**4.4 교수 검색 모달**
- 검색 필터: 학과, 이름, 전임교원만 체크박스
- 교수 목록 테이블
  - 선택, 교번, 성명, 학과, 전임 여부, 이메일, 전화번호
- 선택 방식
  - 심사위원장: 라디오 버튼 (1명만 선택, 선택 즉시 모달 닫힘)
  - 심사위원: 체크박스 (N명 선택, "선택 완료" 버튼 클릭)
- 선택된 행 하이라이트 (배경색: bg-blue-50)

**4.5 버튼 색상**
- 심사위원장 검색 버튼: 파란색 (btn-action-primary)
- 심사위원 검색 버튼: 초록색 (btn-action-success)
- 배정 완료 버튼: 파란색 (btn-primary)

### 5. 데이터 검증

**5.1 심사위원장 선택 시**
- 심사위원 목록에서 자동 제거 (중복 방지)

**5.2 심사위원 선택 시**
- 심사위원장과 동일한 교수 선택 불가 (경고 메시지)

**5.3 배정 완료 시**
- 심사위원장 미선택 시 경고
- 심사위원 최소 인원 미달 시 경고
  - 석사: 2명 이상
  - 박사: 4명 이상

### 6. 전역 변수

```javascript
window.filteredCommitteeData = null; // 검색 필터링된 데이터
window.selectedReviewTarget = null; // 현재 선택된 심사 대상
window.selectedChair = null; // 선택된 심사위원장
window.selectedMembers = []; // 선택된 심사위원 목록
window.searchMode = null; // 'chair' or 'members'
```

### 7. 구현된 함수 목록

#### 메인 함수
1. `renderCommitteeAssignmentContent()`: 심사위원 배정 화면 렌더링
2. `getReviewTypeLabel(reviewType)`: 심사 유형 레이블 변환

#### 검색 기능
3. `searchCommitteeAssignment()`: 심사 대상 검색
4. `resetCommitteeSearch()`: 검색 조건 초기화

#### 모달 관리
5. `openCommitteeAssignmentModal(reviewTargetId)`: 심사위원 배정 모달 열기
6. `closeCommitteeAssignmentModal()`: 심사위원 배정 모달 닫기
7. `openProfessorSearchModal(mode)`: 교수 검색 모달 열기
8. `closeProfessorSearchModal()`: 교수 검색 모달 닫기

#### 교수 검색
9. `renderProfessorList(professors)`: 교수 목록 렌더링
10. `searchProfessors()`: 교수 검색

#### 심사위원장 선택
11. `selectChair(professorId)`: 심사위원장 선택
12. `updateSelectedChairDisplay()`: 선택된 심사위원장 표시 업데이트
13. `removeChair()`: 심사위원장 선택 취소

#### 심사위원 선택
14. `toggleMember(professorId)`: 심사위원 선택/해제
15. `confirmProfessorSelection()`: 심사위원 선택 완료
16. `updateSelectedMembersDisplay()`: 선택된 심사위원 목록 표시 업데이트
17. `removeMember(professorId)`: 심사위원 선택 취소

#### 배정 처리
18. `confirmCommitteeAssignment()`: 심사위원 배정 확인 및 처리

## 파일 목록

### 신규 생성
1. `admin/assets/js/admin-committee-assignment.js` (약 650라인)
2. `admin/admin-committee-assignment.html` (독립 화면용, 현재는 미사용)
3. `docs/committee-assignment-implementation.md` (본 문서)

### 수정된 파일
1. `admin/assets/js/mockData.js` (Lines 186-265)
   - mockReviewTargets 추가 (10건)
   - mockCommitteeAssignments 추가 (3건)

2. `admin/admin-dashboard.html` (Lines 205-221)
   - 논문 심사 메뉴에 "심사위원 배정" 서브메뉴 추가

3. `admin/admin_main.js` (Line 27)
   - viewTitles에 'committeeAssignment' 추가

4. `admin/admin_views.js` (Lines 2373-2401)
   - committeeAssignment 뷰 함수 추가

## 테스트 시나리오

### 1. 기본 동작 테스트
1. admin-dashboard.html 열기
2. 논문 심사 > 심사위원 배정 메뉴 클릭
3. 심사 대기 중인 학생 목록 확인 (7명)
4. 검색 기능 테스트 (심사 유형, 학과, 학위과정)

### 2. 심사위원 배정 테스트
1. 이학생 (연구계획서) 배정 버튼 클릭
2. 학생 정보 확인
3. "심사위원장 검색" 버튼 클릭
4. 김교수 (컴퓨터공학과) 선택 → 자동 닫힘
5. 선택된 심사위원장 확인

### 3. 심사위원 선택 테스트
1. "심사위원 검색" 버튼 클릭
2. 이교수, 정교수 선택 (체크박스)
3. "선택 완료" 버튼 클릭
4. 선택된 심사위원 2명 확인

### 4. 중복 방지 테스트
1. 심사위원 검색 모달에서 김교수 (심사위원장) 선택 시도
2. 경고 메시지 확인: "심사위원장은 심사위원으로 중복 선택할 수 없습니다."

### 5. 유효성 검사 테스트
1. 심사위원장 미선택 상태에서 "배정 완료" 클릭
2. 경고 메시지: "심사위원장을 선택해주세요."
3. 심사위원 1명만 선택 후 "배정 완료" 클릭
4. 경고 메시지: "석사 과정은 심사위원을 2명 이상 선택해야 합니다."

### 6. 배정 완료 테스트
1. 심사위원장 1명 + 심사위원 2명 선택
2. "배정 완료" 버튼 클릭
3. 성공 메시지 확인
4. 심사 대상 목록에서 해당 학생 사라짐 확인 (status: 'assigned')

## 기술적 특징

### 1. 동적 JavaScript 로딩
- admin_views.js에서 필요 시 admin-committee-assignment.js 동적 로드
- 중복 로딩 방지 (script 태그 존재 여부 체크)

### 2. 이중 모달 구조
- 배정 모달 (z-index: default)
- 교수 검색 모달 (z-index: 1001) - 배정 모달 위에 표시

### 3. 상태 관리
- 전역 변수를 통한 선택 상태 관리
- 모달 닫을 때 상태 초기화

### 4. 실시간 UI 업데이트
- 심사위원장 선택 시 심사위원 목록에서 제거
- 선택 상태 실시간 표시 업데이트

### 5. 데이터 무결성
- 심사위원장과 심사위원 중복 방지
- 최소 인원 검증 (학위과정별)
- 배정 후 상태 자동 업데이트

## 완료 확인

- [x] Mock 데이터 추가 (심사 대상 학생 10명, 배정 데이터 3건)
- [x] 메뉴 구조 추가 (admin-dashboard.html)
- [x] 뷰 타이틀 추가 (admin_main.js)
- [x] committeeAssignment 뷰 함수 추가 (admin_views.js)
- [x] admin-committee-assignment.js 작성 (약 650라인)
- [x] 심사 대상 학생 목록 및 검색 기능
- [x] 심사위원 배정 모달
- [x] 심사위원장 검색 모달 (라디오 버튼 방식)
- [x] 심사위원 검색 모달 (체크박스 방식)
- [x] 심사위원장/심사위원 중복 방지 로직
- [x] 학위과정별 최소 인원 검증
- [x] 배정 완료 처리

## 다음 단계 (향후 개선)

1. **백엔드 연동**: Mock 데이터를 실제 API 호출로 대체
2. **배정 이력 조회**: 배정 완료된 심사위원 목록 조회 화면
3. **배정 수정/취소**: 배정 후 수정 또는 취소 기능
4. **알림 기능**: 배정 완료 시 교수에게 알림
5. **권한 체크**: 심사위원 배정 권한 검증
6. **자동 추천**: 학과/전공 기반 심사위원 자동 추천
7. **일괄 배정**: 여러 학생에게 동일한 심사위원 일괄 배정

## 소요 시간

- Mock 데이터 작성: 30분
- 메뉴 구조 추가: 15분
- admin-committee-assignment.js 작성: 3시간
- 테스트 및 디버깅: 1시간
- 문서 작성: 30분

**총 소요 시간**: 약 5시간

## 관련 문서

- [implementation-priority.md](./implementation-priority.md): P1-5 항목
- [menu-structure-changes.md](./menu-structure-changes.md): 심사위원 배정 메뉴 구조
- [stage-management-v2-implementation.md](./stage-management-v2-implementation.md): 단계 관리 V2 (유사한 구조)
