# 학생용 심사 일정 Mock 데이터 추가 완료

## 📅 작업 일시
**2026-01-08**

---

## ✅ 작업 완료

### 문제 상황
- 학생용 심사 일정 화면 구현 완료
- **Mock 데이터 부재로 테스트 불가**
- 목록 화면에서 "등록된 심사 일정이 없습니다" 표시됨
- 상세 화면 진입 불가

### 해결 방법
학생용(student-v3) CURRENT_STUDENT (S2024001, 김철수)를 위한 Mock 데이터 추가

---

## 📝 수정된 파일

### 1. `admin-v3/assets/js/mockData.js`

#### 1.1 mockReviewTargets 추가 (라인 494-495)

```javascript
// 학생용(student-v3) 테스트 데이터 - S2024001 (김철수 학생) - 박사 예비심사
{
    id: 'RT011',
    studentId: 'S2024001',
    studentNumber: '2024001',
    studentName: '김철수',
    department: '컴퓨터공학과',
    degreeType: '박사',
    academicYear: '2025',
    semesterCount: 6,
    reviewType: 'preliminary',
    title: 'AI 기반 실시간 데이터 처리 최적화 연구',
    submittedDate: '2025-02-23',
    advisorId: 'PROF001',
    advisorName: '김교수',
    status: 'assigned'
}
```

**용도**: 심사 대상 학생 정보 및 논문 제목

#### 1.2 mockCommitteeAssignments 추가 (라인 578-613)

```javascript
// 학생용(student-v3) 테스트 데이터 추가 - S2024001 (김철수 학생)
{
    id: 'CA004',
    reviewTargetId: 'RT011',
    studentId: 'S2024001',
    studentNumber: '2024001',
    studentName: '김철수',
    department: '컴퓨터공학과',
    degreeType: '박사',
    reviewType: 'preliminary',

    // 추가 학생 정보 (확장된 검색 필터용 - 13개 필드)
    year: '2025',
    semester: '1',
    graduate: '일반대학원',
    college: '공학계열',
    undergraduate: '컴퓨터공학과',
    academicStatus: '재학',
    advisorName: '박교수',

    // 논문 지도 단계 정보 (박사 - 예비심사)
    thesisStageId: 'TS002',
    stageId: 'STAGE_TS002_005',
    stageName: '예비심사',
    stageOrder: 5,

    chairId: 'PROF001',
    chairName: '김교수',
    members: [
        { professorId: 'PROF001', professorName: '김교수', role: 'chair', department: '컴퓨터공학과' },
        { professorId: 'PROF002', professorName: '이교수', role: 'member', department: '컴퓨터공학과' },
        { professorId: 'PROF003', professorName: '박교수', role: 'member', department: '경영학과' }
    ],
    assignedDate: '2025-02-23',
    status: 'completed'
}
```

**용도**: 심사위원 배정 정보 (16-column 테이블 렌더링에 필요한 모든 필드 포함)

---

### 2. `admin-v3/assets/js/exam-schedule-data.js`

#### 2.1 mockExamSchedules 추가 (라인 92-131)

```javascript
// 학생용(student-v3) 테스트 데이터 - S2024001 (김철수 학생) - 온라인 일정
{
    scheduleId: "SCH003",
    assignmentId: "CA004",

    studentId: "S2024001",
    studentName: "김철수",
    studentNumber: "2024001",
    department: "컴퓨터공학과",
    degreeType: "박사",

    stageId: "STAGE_TS002_005",
    stageName: "예비심사",

    thesisTitle: "AI 기반 실시간 데이터 처리 최적화 연구",

    examDate: "2025-03-25",
    examTime: "10:00",
    duration: 90,  // 분

    method: "online",

    onlineInfo: {
        platform: "zoom",
        meetingUrl: "https://zoom.us/j/9876543210",
        meetingId: "987 654 3210",
        password: "xyz789",
        hostUrl: "https://zoom.us/s/9876543210?zak=eyJh..."
    },

    offlineInfo: null,

    status: "scheduled",
    cancelReason: null,

    createdBy: "ADM001",
    createdAt: "2025-02-27T14:00:00",
    updatedBy: "ADM001",
    updatedAt: "2025-02-27T14:00:00"
}
```

**용도**: 심사 일정 정보 (온라인 Zoom 회의)

---

## 🔗 데이터 관계도

```
mockReviewTargets (RT011)
         ↓ reviewTargetId
mockCommitteeAssignments (CA004)
         ↓ assignmentId
mockExamSchedules (SCH003)
         ↓ studentId filtering
Student Exam Schedule Screen (S2024001만 표시)
```

---

## 🎯 추가된 Mock 데이터 상세

### 학생 정보
| 항목 | 값 |
|------|-----|
| **학생 ID** | S2024001 |
| **이름** | 김철수 |
| **학번** | 2024001 |
| **학과/전공** | 컴퓨터공학과 |
| **학위과정** | 박사 |
| **학적상태** | 재학 |
| **학년도** | 2025 |
| **학기** | 1학기 |
| **대학구분** | 일반대학원 |
| **계열/대학원** | 공학계열 |
| **학부(과)전공** | 컴퓨터공학과 |
| **지도교수명** | 박교수 |

### 심사 정보
| 항목 | 값 |
|------|-----|
| **심사단계** | 예비심사 |
| **논문제목** | AI 기반 실시간 데이터 처리 최적화 연구 |
| **심사위원장** | 김교수 (컴퓨터공학과) |
| **심사위원** | 이교수 (컴퓨터공학과), 박교수 (경영학과) |
| **배정일** | 2025-02-23 |

### 일정 정보
| 항목 | 값 |
|------|-----|
| **등록상태** | 등록 완료 (scheduled) |
| **심사일** | 2025-03-25 |
| **심사시간** | 10:00 |
| **소요시간** | 90분 |
| **진행방식** | 온라인 (Zoom) |

### 온라인 회의 정보
| 항목 | 값 |
|------|-----|
| **플랫폼** | Zoom |
| **미팅 URL** | https://zoom.us/j/9876543210 |
| **미팅 ID** | 987 654 3210 |
| **비밀번호** | xyz789 |

---

## 🧪 테스트 시나리오

### 1. 목록 화면 테스트
1. [student-v3/student-dashboard.html](../student-dashboard.html) 열기
2. 좌측 메뉴 > "심사 일정 조회" 클릭
3. ✅ 확인사항:
   - "내 심사 일정" 제목 표시
   - "(총 1건)" 건수 표시
   - 1개 행 렌더링 확인
   - 학번: 2024001
   - 성명: 김철수
   - 심사단계: 예비심사
   - 등록상태: 등록 완료
   - 심사일정: 2025-03-25 10:00
   - 진행방식: 온라인 (빨간색)

### 2. 상세 화면 테스트
1. 목록에서 행 클릭
2. ✅ 확인사항:

   **기본 정보 박스 (4개)**
   - 학생 정보: 학번(2024001), 성명(김철수), 학과(컴퓨터공학과), 학위과정(박사)
   - 심사 단계: 심사단계(예비심사), 진행방식(온라인)
   - 심사위원 정보: 위원장(김교수), 위원(이교수, 박교수)
   - 논문 정보: AI 기반 실시간 데이터 처리 최적화 연구

   **일정 정보 섹션**
   - 등록상태: 등록 완료
   - 심사일정: 2025-03-25
   - 심사시간: 10:00
   - 소요시간: 90분
   - 진행방식: 온라인

   **온라인 회의 정보**
   - 플랫폼: Zoom
   - 미팅 URL (복사 버튼): https://zoom.us/j/9876543210
   - 미팅 ID (복사 버튼): 987 654 3210
   - 비밀번호 (복사 버튼): xyz789

### 3. 복사 기능 테스트
1. "복사" 버튼 클릭 (URL, 미팅 ID, 비밀번호 각각)
2. ✅ 확인사항:
   - 클립보드에 복사됨 알림
   - 실제로 붙여넣기 가능

### 4. 네비게이션 테스트
1. "목록으로 돌아가기" 버튼 클릭
2. ✅ 목록 화면 복귀 확인
3. X 버튼 클릭
4. ✅ 목록 화면 복귀 확인

---

## 📊 기존 Mock 데이터 vs 학생용 추가 데이터

| 학생 | studentId | 학번 | 이름 | 심사단계 | 일정 등록 | 진행방식 | 용도 |
|------|-----------|------|------|---------|-----------|----------|------|
| 최학생 | STU004 | 2024004 | 최학생 | 본심사 | ✅ | 온라인 | 관리자/교수용 |
| 강학생 | STU006 | 2024006 | 강학생 | 본심사 | ✅ | 오프라인 | 관리자/교수용 |
| 윤학생 | STU008 | 2024008 | 윤학생 | 예비심사 | ❌ 미등록 | - | 관리자/교수용 |
| **김철수** | **S2024001** | **2024001** | **김철수** | **예비심사** | **✅** | **온라인** | **학생용** |

---

## ⚠️ 주의사항

### 1. studentId 불일치
- **Admin/Professor 시스템**: `STU001`, `STU002`, ... (STU prefix)
- **Student 시스템**: `S2024001` (S prefix)
- 두 시스템은 **별도의 학생 ID 체계** 사용
- guidance-status-data.js의 CURRENT_STUDENT를 따름

### 2. 데이터 의존성
- mockData.js → exam-schedule-data.js → student-exam-schedule.js
- 로딩 순서가 중요함 (HTML에서 script 순서 확인)

### 3. 공유 Mock 데이터
- admin-v3/assets/js/mockData.js는 **공유 데이터**
- admin, professor, student 모두 사용
- 수정 시 모든 시스템에 영향

---

## 🔄 향후 개선 사항

### 1. studentId 통일
- STU prefix vs S prefix 불일치 해결
- 전체 시스템에서 하나의 ID 체계 사용

### 2. Mock 데이터 분리
- admin-v3/assets/js/common-mock-data.js로 분리
- 각 시스템별로 추가 데이터만 관리

### 3. 실제 API 연동
- Mock 데이터 → REST API 교체
- studentId 기반 필터링을 서버에서 수행

---

## 📁 수정된 파일 요약

1. **admin-v3/assets/js/mockData.js**
   - mockReviewTargets: RT011 추가 (학생용)
   - mockCommitteeAssignments: CA004 추가 (학생용)

2. **admin-v3/assets/js/exam-schedule-data.js**
   - mockExamSchedules: SCH003 추가 (학생용)

3. **student-v3/docs/exam-schedule-implementation-summary.md**
   - Mock 데이터 추가 내역 문서화

4. **student-v3/docs/exam-schedule-mock-data-added.md** (본 문서)
   - Mock 데이터 추가 작업 상세 기록

---

## ✅ 테스트 체크리스트

- [ ] 학생 대시보드 접속
- [ ] 심사 일정 조회 메뉴 클릭
- [ ] 목록에서 1건 표시 확인
- [ ] 학생 정보 (학번, 성명, 학과 등) 정확성 확인
- [ ] 심사 단계 "예비심사" 표시 확인
- [ ] 등록상태 "등록 완료" 표시 확인
- [ ] 심사일정 "2025-03-25 10:00" 표시 확인
- [ ] 진행방식 "온라인" (빨간색) 표시 확인
- [ ] 행 클릭 시 상세 화면 진입
- [ ] 4개 정보 박스 렌더링 확인
- [ ] 온라인 회의 정보 표시 확인
- [ ] Zoom URL 복사 버튼 동작 확인
- [ ] 미팅 ID 복사 버튼 동작 확인
- [ ] 비밀번호 복사 버튼 동작 확인
- [ ] "목록으로 돌아가기" 버튼 동작 확인
- [ ] X 버튼 동작 확인

---

**작성일**: 2026-01-08
**작성자**: Claude Sonnet 4.5
**버전**: v1.0
**상태**: ✅ Mock 데이터 추가 완료 (테스트 가능)
