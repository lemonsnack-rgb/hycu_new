# 학기별 논문지도 계획 V2 사용 가이드

## 📌 V2 주요 특징

### 1. 댓글 방식 실적 입력
- 기존 모달 팝업 방식 → **SNS 댓글 스타일 인라인 입력**
- 각 주차별로 N개 실적을 즉시 입력 가능
- 교수별로 자신의 실적만 수정/삭제 가능

### 2. 학기 선택 드롭다운
- 최근 5년간 학년도/학기 조회 가능
- 드롭다운에 계획 존재 여부 표시 (✓ 표시)
- 과거 학기 실적 조회 및 추가 입력 가능

### 3. 통합 화면
- 등록과 조회를 하나의 화면으로 통합
- 계획이 없으면 "15주차 계획 등록" 버튼 표시
- 계획이 있으면 주차별 카드 + 실적 입력 폼 표시

---

## 🎯 V1 vs V2 비교

| 항목 | V1 (semester-guidance.js) | V2 (semester-guidance-v2.js) |
|------|---------------------------|------------------------------|
| **실적 입력 방식** | 모달 팝업 → 저장 → 닫기 | 인라인 폼 → 즉시 추가 (댓글 방식) |
| **화면 구성** | 등록/조회 분리 | 단일 통합 화면 |
| **학기 선택** | ❌ 없음 (현재 학기만) | ✅ 드롭다운 (최근 5년) |
| **과거 학기 조회** | ❌ 불가능 | ✅ 가능 |
| **실적 추가 UX** | 클릭 → 모달 → 입력 → 저장 → 닫기 (5단계) | 펼치기 → 입력 → 추가 (3단계) |
| **다중 실적 입력** | 모달 반복 오픈 필요 | 연속 입력 가능 |
| **교수 아바타** | ❌ 없음 | ✅ 원형 아바타 + 이름 첫 글자 |

---

## 📂 파일 구조

```
professor/
├── assets/
│   ├── css/
│   │   ├── semester-guidance.css        # V1 스타일
│   │   └── semester-guidance-v2.css     # V2 스타일 (댓글 스타일)
│   └── js/
│       ├── semester-guidance.js         # V1 모듈
│       └── semester-guidance-v2.js      # V2 모듈 (통합 화면)
└── professor-dashboard-proposal.html    # 통합 HTML
```

---

## 🚀 사용 방법

### 1. V2 화면 진입
```javascript
// guidance.js에서 호출
showSemesterGuidanceDetail(studentId);
```

### 2. 학기별 계획 등록 (15주차 일괄)
1. "15주차 계획 등록" 버튼 클릭
2. 학기 시작일 선택
3. "다음 단계로" 클릭 → V1의 15주차 입력 폼으로 이동
4. 15주차 계획 일괄 입력 후 저장

### 3. 실적 입력 (댓글 방식)
1. 원하는 주차 카드 클릭 (펼치기)
2. 하단 입력 폼에서 즉시 입력
   - 실행일 선택
   - 지도 방식 선택 (대면/Zoom/온라인/이메일/전화)
   - 실행 내용 입력
   - 교수 의견 입력
3. "실적 추가" 버튼 클릭 → 즉시 추가됨

### 4. 과거 학기 조회
1. 학년도 드롭다운 선택 (2021~2025)
2. 학기 드롭다운 선택 (1학기/2학기)
3. 자동으로 해당 학기 데이터 로드

### 5. 실적 수정/삭제
- 자신이 작성한 실적만 "수정/삭제" 버튼 표시 (파란색 배경)
- 다른 교수 실적은 조회만 가능 (회색 배경)

---

## 🎨 UI/UX 개선 사항

### 1. 댓글 스타일 실적 카드
```
┌─────────────────────────────────────────────┐
│ 👤 김교수 (나)                      수정 | 삭제 │
│ 03월 05일 • Zoom                              │
│                                               │
│ 실행 내용:                                    │
│ 연구방법론 기초 개념 설명 및 질의응답          │
│                                               │
│ 교수 의견:                                    │
│ 학생이 개념을 잘 이해하고 있음                 │
└─────────────────────────────────────────────┘
```

### 2. 인라인 입력 폼
```
┌─────────────────────────────────────────────┐
│ 👤 [실행일 ▼] [지도방식 ▼]                   │
│                                               │
│    [실행 내용 입력...]                        │
│                                               │
│    [교수 의견 입력...]                        │
│                                               │
│                          [➕ 실적 추가]       │
└─────────────────────────────────────────────┘
```

### 3. 주차 카드 아코디언
- 실적이 있는 주차: 기본 펼침 상태 (open)
- 실적이 없는 주차: 기본 접힘 상태
- "전체 펼치기 / 전체 접기" 버튼 제공

### 4. 학기 선택 드롭다운
```
[2025학년도 ▼]  [1학기 ✓ ▼]
```
- ✓ 표시: 해당 학기 계획이 이미 존재함
- ✓ 없음: 계획 미등록 학기

---

## 🔧 주요 함수

### 화면 렌더링
```javascript
showSemesterGuidanceDetail(studentId)       // 메인 진입점
renderSemesterDetailScreen(student, plans)  // 통합 화면 렌더링
renderWeeklyPlanCards(plan, advisors, prof) // 주차 카드 목록
renderWeekCard(week, advisors, prof, plan)  // 개별 주차 카드
renderExecutionComment(execution, prof)     // 실적 댓글 카드
renderExecutionInputForm(weekNumber, prof)  // 실적 입력 폼
```

### 실적 관리
```javascript
addExecutionV2(weekNumber)                  // 실적 추가 (인라인)
deleteExecutionV2(studentId, year, semester, week, executionId)  // 실적 삭제
```

### 학기 선택
```javascript
changeSemesterView()                        // 드롭다운 변경 핸들러
generateAvailableSemesters(existingPlans)   // 5년간 학기 목록 생성
```

### 아코디언 제어
```javascript
toggleWeekCardV2(weekNumber)                // 개별 주차 토글
toggleAllWeeksV2(open)                      // 전체 펼치기/접기
```

---

## 💾 데이터 구조

### 학기 계획 (Semester Plan)
```javascript
{
  id: 'SEM_2025_1_S001',
  studentId: 'S001',
  year: 2025,
  semester: 1,
  semesterStartDate: '2025-03-03',
  semesterEndDate: '2025-06-13',
  weeks: [
    {
      week: 1,
      plannedDate: '2025-03-03',
      advisorIds: ['P001', 'P002'],
      plannedTopic: '연구방법론 개요',
      plannedContent: '연구방법론의 기본 개념과 연구 설계 방법 학습',
      plannedMethod: 'zoom',
      executions: [...]  // 실적 배열
    }
  ]
}
```

### 실적 (Execution)
```javascript
{
  executionId: 'EXEC_001',
  professorId: 'P001',
  professorName: '김교수',
  executionDate: '2025-03-05',
  executionContent: '연구방법론 기초 개념 설명',
  comment: '학생이 개념을 잘 이해하고 있음',
  method: 'zoom',
  createdAt: '2025-03-05T15:00:00'
}
```

---

## ✅ V2 완성 체크리스트

- [x] 댓글 방식 실적 입력 UI
- [x] 인라인 입력 폼 (모달 제거)
- [x] 학년도/학기 드롭다운 (5년)
- [x] 계획 존재 여부 표시 (✓)
- [x] 과거 학기 조회 기능
- [x] 등록/조회 통합 화면
- [x] 교수 아바타 (원형 뱃지)
- [x] 실적 개수 뱃지
- [x] 주차 카드 아코디언
- [x] 전체 펼치기/접기
- [x] 자신의 실적만 수정/삭제
- [x] 반응형 디자인 (모바일)
- [x] 호버 애니메이션
- [x] CSS 모듈 분리

---

## 🔮 향후 개선 가능 사항

1. **실적 수정 기능**
   - 현재: 삭제 후 재입력
   - 개선: 인라인 수정 모드 제공

2. **실적 필터링**
   - 특정 교수 실적만 보기
   - 특정 지도 방식만 보기

3. **통계 대시보드**
   - 주차별 실적 입력률
   - 교수별 실적 개수

4. **알림/리마인더**
   - 미입력 주차 알림
   - 학기 종료 임박 알림

---

## 📞 기술 지원

V2 관련 문의사항:
- 파일: `semester-guidance-v2.js`
- CSS: `semester-guidance-v2.css`
- 데이터: `mock-data.js` (DataService)

---

**업데이트:** 2025-12-02
**버전:** V2.0.0
**작성자:** Claude Code Assistant
