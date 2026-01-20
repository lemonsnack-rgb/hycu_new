# 세션 요약: 2026-01-20

## 1. 작업 개요

이번 세션에서는 학생용 제출 화면, 관리자 업무일정 관리 화면, 그리고 학생용 학기별 지도 계획 화면의 UI 개선 작업을 진행했습니다.

---

## 2. 완료된 작업

### 2.1 학생용 제출 화면 개선

#### 파일: `student-v3/assets/js/journal-submission.js`
#### 파일: `student-v3/assets/js/thesis-submission.js`

**작업 내용:**
1. **지도교수명 출력 섹션 추가**
   - 위치: 입력 필드 최상단
   - 형태: 읽기 전용 디스플레이 (회색 배경, 테두리)
   - Mock 데이터에 `advisorName: '홍길동 교수'` 추가

2. **학위논문 제출 화면 수정**
   - 지도교수명 읽기 전용 섹션 추가
   - 희망심사일 입력 필드 삭제
   - 희망심사일 관련 검증 로직 제거
   - `saveThesisSubmission()` 함수에서 `desiredExamDate` 제거

3. **학술지 논문 제출 화면 수정**
   - 지도교수명 읽기 전용 섹션 추가
   - 기존 "논문지도교수" 입력 필드는 유지

**커밋 정보:**
- Commit: `efcd1c1`
- Message: "feat: Add advisor name display and remove desired exam date field"

**변경 파일:**
- `student-v3/assets/js/journal-submission.js`
- `student-v3/assets/js/thesis-submission.js`

---

### 2.2 관리자 업무일정 관리 화면 개선

#### 파일: `admin-v3/assets/js/work-schedule-management.js`

**작업 내용:**
1. **모달 팝업 → 페이지 전환 방식으로 변경**
   - 두 탭 모두 적용: "심사/제출/신청 일정", "관리자 업무 일정"
   - 모달 오버레이, X 닫기 버튼 제거
   - 페이지 상단에 "목록으로 돌아가기" 버튼 추가

2. **뷰 상태 관리 변수 추가**
   ```javascript
   let processPhaseView = 'list'; // 'list' | 'form'
   let adminWorkView = 'list'; // 'list' | 'form'
   let processPhaseFormMode = null; // null | 'create' | 'edit'
   let adminWorkFormMode = null; // null | 'create' | 'edit'
   let currentProcessPhaseScheduleId = null;
   let currentAdminWorkScheduleId = null;
   ```

3. **Tab 1: 심사/제출/신청 일정**
   - 목록 화면 버튼: `openProcessPhaseModal()` → `showProcessPhaseForm('create')`
   - 목록 화면 행 클릭: `openProcessPhaseDetailModal()` → `showProcessPhaseForm('edit', scheduleId)`
   - 신규 함수 추가:
     - `showProcessPhaseForm(mode, scheduleId)` - 폼 화면 전환
     - `backToProcessPhaseList()` - 목록 복귀
     - `renderProcessPhaseFormPage()` - 페이지 렌더링
     - `renderProcessPhaseTab()` - 탭 렌더링 분기
   - 페이지 헤더 타이틀 제거

4. **Tab 2: 관리자 업무 일정**
   - 목록 화면 버튼: `openAdminWorkModal()` → `showAdminWorkForm('create')`
   - 목록 화면 행 클릭: `openAdminWorkDetailModal()` → `showAdminWorkForm('edit', scheduleId)`
   - 신규 함수 추가:
     - `showAdminWorkForm(mode, scheduleId)` - 폼 화면 전환
     - `backToAdminWorkList()` - 목록 복귀
     - `renderAdminWorkFormPage()` - 페이지 렌더링
     - `renderAdminWorkTab()` - 탭 렌더링 분기
   - 페이지 헤더 타이틀 제거

5. **저장/삭제 함수 수정**
   - `saveProcessPhaseSchedule()`: `closeScheduleModal()` → `backToProcessPhaseList()`
   - `saveAdminWorkSchedule()`: `closeScheduleModal()` → `backToAdminWorkList()`
   - `deleteSchedule()`: 일정 타입에 따라 자동으로 해당 목록으로 복귀

6. **전역 함수 노출 업데이트**
   - 제거: `openProcessPhaseModal`, `openProcessPhaseDetailModal`, `openAdminWorkModal`, `openAdminWorkDetailModal`, `closeScheduleModal`
   - 추가: `showProcessPhaseForm`, `backToProcessPhaseList`, `showAdminWorkForm`, `backToAdminWorkList`

**커밋 정보:**
- Commit: `789170a`
- Message: "refactor: Convert work schedule registration from modal to page view"

**변경 파일:**
- `admin-v3/assets/js/work-schedule-management.js` (+397/-19 lines)

---

## 3. 페이지 레이아웃 변경

### 3.1 학생용 제출 화면

**변경 전:**
```
┌────────────────────────────────┐
│ [목록으로]                     │
├────────────────────────────────┤
│ 심사단계: [연구계획서]         │
│ 희망심사일: [날짜선택]         │
│ 논문 제목: [입력]             │
│ 파일: [선택]                   │
└────────────────────────────────┘
```

**변경 후:**
```
┌────────────────────────────────┐
│ [목록으로]                     │
├────────────────────────────────┤
│ ┌──────────────────────────┐  │
│ │ 지도교수: 홍길동 교수    │  │ ← NEW (읽기전용)
│ └──────────────────────────┘  │
│                                │
│ 심사단계: [연구계획서]         │
│ 논문 제목: [입력]             │
│ 파일: [선택]                   │
└────────────────────────────────┘
```

### 3.2 관리자 업무일정 등록 화면

**변경 전 (모달):**
```
┌─────────────────────────────┐
│ 반투명 배경 오버레이        │
│ ┌─────────────────────────┐ │
│ │ [X] 일정 등록           │ │
│ ├─────────────────────────┤ │
│ │ 입력 필드들             │ │
│ ├─────────────────────────┤ │
│ │      [취소] [등록]      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**변경 후 (페이지):**
```
┌─────────────────────────────┐
│ [← 목록으로 돌아가기]       │
│                             │
│ ┌─────────────────────────┐ │
│ │ 입력 필드들             │ │
│ ├─────────────────────────┤ │
│ │ [삭제]   [취소] [등록]  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 4. 데이터 구조 변경

### 4.1 학생용 제출 Mock 데이터

**파일:** `student-v3/assets/js/thesis-submission.js`, `journal-submission.js`

```javascript
// 추가된 속성
const thesisSubmissions = [
    {
        id: 1,
        advisorName: '홍길동 교수', // ← NEW
        // ... 기존 속성들
    }
];
```

### 4.2 관리자 업무일정 뷰 상태

**파일:** `admin-v3/assets/js/work-schedule-management.js`

```javascript
// Tab 1: 심사/제출/신청 일정
let processPhaseView = 'list'; // 'list' | 'form'
let processPhaseFormMode = null; // null | 'create' | 'edit'
let currentProcessPhaseScheduleId = null;

// Tab 2: 관리자 업무 일정
let adminWorkView = 'list'; // 'list' | 'form'
let adminWorkFormMode = null; // null | 'create' | 'edit'
let currentAdminWorkScheduleId = null;
```

---

## 5. 주요 함수 변경 사항

### 5.1 학위논문 제출 (`thesis-submission.js`)

**수정된 함수:**
- `renderThesisSubmissionForm()` - 지도교수명 섹션 추가, 희망심사일 필드 제거
- `renderThesisDetailView()` - 지도교수명 섹션 추가, 희망심사일 표시 제거
- `saveThesisSubmission()` - 희망심사일 관련 로직 제거

### 5.2 업무일정 관리 (`work-schedule-management.js`)

**추가된 함수:**

**Tab 1 (심사/제출/신청):**
- `renderProcessPhaseTab()` - 뷰 상태에 따라 목록/폼 렌더링
- `showProcessPhaseForm(mode, scheduleId)` - 폼 화면으로 전환
- `backToProcessPhaseList()` - 목록으로 복귀
- `renderProcessPhaseFormPage()` - 폼 페이지 렌더링

**Tab 2 (관리자 업무):**
- `renderAdminWorkTab()` - 뷰 상태에 따라 목록/폼 렌더링
- `showAdminWorkForm(mode, scheduleId)` - 폼 화면으로 전환
- `backToAdminWorkList()` - 목록으로 복귀
- `renderAdminWorkFormPage()` - 폼 페이지 렌더링

**수정된 함수:**
- `renderCurrentTab()` - 탭별 렌더링 함수 호출로 변경
- `renderProcessPhaseScheduleList()` - 버튼/행 클릭 이벤트 변경
- `renderAdminWorkScheduleList()` - 버튼/행 클릭 이벤트 변경
- `saveProcessPhaseSchedule()` - 모달 닫기 → 목록 복귀
- `saveAdminWorkSchedule()` - 모달 닫기 → 목록 복귀
- `deleteSchedule()` - 일정 타입 확인 후 자동 복귀

**제거 예정 (사용 안 함):**
- `openProcessPhaseModal()`
- `openProcessPhaseDetailModal()`
- `openAdminWorkModal()`
- `openAdminWorkDetailModal()`
- `closeScheduleModal()`

---

## 6. 입력 항목 정리

### 6.1 Tab 1: 심사/제출/신청 일정 등록

```
심사유형 * (라디오 버튼)
├─ 논문 작성 계획서
├─ 중간논문
└─ 최종논문

일정구분 * (라디오 버튼)
├─ 신청
├─ 제출
└─ 심사

기간유형 * (라디오 버튼)
├─ 등록
└─ 철회

학년도 * (드롭다운)
├─ 2025, 2024, 2023, 2022

학기 * (드롭다운)
├─ 1학기, 2학기

시작일시 * (datetime-local)
종료일시 * (datetime-local)
```

### 6.2 Tab 2: 관리자 업무 일정 등록

```
업무 유형 * (드롭다운)
├─ 선택하세요 (placeholder)
└─ mockAdminWorkTypes에서 동적 로드

학년도 * (드롭다운)
├─ 2025, 2024, 2023, 2022

학기 * (드롭다운)
├─ 1학기, 2학기

시작일시 * (datetime-local)
종료일시 * (datetime-local)
```

---

## 7. Git 커밋 히스토리

```bash
789170a (HEAD -> main, origin/main) refactor: Convert work schedule registration from modal to page view
efcd1c1 feat: Add advisor name display and remove desired exam date field
bea7a14 feat: Expand journal submission form with comprehensive fields
2ef39bf refactor: Convert stage type management modal to page view
6b78c1d feat: Improve work schedule management UI with radio buttons and modal-based editing
```

---

## 8. 기술 분석: 논문 지도 현황 PDF 뷰어 피드백 비교 기능

### 8.1 고객사 요구사항

**핵심 목적:**
- 학생·교수가 이전 피드백과 수정 결과를 쉽게 비교·확인

**제외된 기능:**
- ❌ 학생 판서 기능
- ❌ 첨삭 이관(연결) 기능
- ❌ 뷰어 내 인터랙션 확장

**제안된 대안:**
1. 지도글 기준 통합 출력 (PDF/표 형태)
2. 현재 시스템 내 권장 방안

### 8.2 현재 시스템 구조

**데이터 구조:**
```javascript
{
  id: 'gs-001',
  version: 1,
  documentId: 'doc-001',
  generalFeedbackThread: [...],  // 전체 평가 댓글
  annotations: {                  // 페이지별 첨삭
    '1': [
      {
        type: 'highlight/drawing/text',
        position: {...},
        comments: [...]
      }
    ]
  }
}
```

**버전 관리:**
- 동일 documentId로 여러 버전 관리
- 각 버전은 독립적인 PDF 파일
- 첨삭/댓글은 버전별로 독립 저장

### 8.3 기술적 평가

#### 방안 1: 통합 PDF 출력
- ⚠️ **복잡도: 높음**
- 원본 PDF + 첨삭 오버레이 + 댓글 합성
- 필요 기술: PDF.js → Canvas → PDF 재생성
- **예상 개발 기간**: 2-3주
- **리스크**: 높음 (메모리 제약, 렌더링 품질)

#### 방안 2: Excel/CSV 출력
- ✅ **복잡도: 낮음**
- 기존 데이터를 테이블 형태로 변환
- 필요 기술: SheetJS (xlsx)
- **예상 개발 기간**: 3-5일
- **리스크**: 낮음

**데이터 예시:**
```
| 페이지 | 첨삭유형 | 위치 | 교수댓글 | 학생댓글 | 작성일시 |
|--------|---------|------|---------|---------|---------|
| 1      | 하이라이트 | (100,200) | "수정 필요" | "수정완료" | 2025-01-06 |
```

**한계점:**
- ❌ 시각적 위치 정보 부족
- ❌ 첨삭 시각적 표현 불가
- ⚠️ "피드백 전/후 비교" 목적 달성 어려움

### 8.4 근본적 문제점

**버전 간 첨삭 매핑 불가:**
```
v1.pdf (5페이지)
├─ 페이지1: "서론"
├─ 페이지2: "연구 배경"
└─ 페이지3: "연구 방법"

v2.pdf (6페이지) ← 수정 후 재제출
├─ 페이지1: "서론" (수정)
├─ 페이지2: "연구 배경" (2페이지로 확장)
├─ 페이지3: "연구 배경 (계속)"
├─ 페이지4: "연구 방법"
└─ 페이지5: "연구 방법 (계속)"
```

**매핑 문제:**
- v1의 2페이지 첨삭 → v2의 몇 페이지?
- 좌표 (x:100, y:200) → v2에서 어디?
- 텍스트 추가/삭제로 레이아웃 변경 시 자동 매핑 불가능

**수동 매핑의 비현실성:**
- 수십~수백 개 첨삭의 수동 매핑 불가능
- 매핑 작업 자체가 새로운 업무 부담

### 8.5 권장 대안

#### ✅ 대안 1: 버전 히스토리 UI 개선 (최소 개발)
```
[현재: v3.pdf 보기]

┌─────────────────────┐
│ 제출 이력           │
├─────────────────────┤
│ ● v3 (현재)         │
│ ● v2 [피드백 보기] ← 클릭 시 새 창
│ ● v1 [피드백 보기]  │
└─────────────────────┘

→ 사용자가 두 창을 나란히 보며 직접 비교
```

**장점:**
- ✅ 개발 간단 (버튼 + 새 창 열기)
- ✅ 버전 간 매핑 문제 회피
- ✅ 브라우저 멀티 윈도우 활용

**예상 개발 기간**: 1일
**리스크**: 매우 낮음

#### ✅ 대안 2: 버전별 피드백 요약 리스트 (권장)
```
┌──────────────────────────────────┐
│ 피드백 히스토리                   │
├──────────────────────────────────┤
│ [v1] 2025-01-05 → 2025-01-06     │
│ ├─ 전체평가: "연구 배경 보강"    │
│ ├─ 페이지1 첨삭 3건              │
│ ├─ 페이지2 첨삭 5건              │
│ └─ [상세보기]                    │
│                                  │
│ [v2] 2025-01-07 → 대기 중        │
│ [v3] 2025-01-09 → 대기 중 (현재) │
└──────────────────────────────────┘
```

**장점:**
- ✅ 버전별 변화 추이 파악
- ✅ PDF 매핑 문제 회피
- ✅ 개발 중간 수준

**예상 개발 기간**: 3-5일
**리스크**: 낮음

#### ⚠️ 대안 3: Excel 출력 (타협안)
- 버전별 시트 분리 (Sheet1: v1, Sheet2: v2, ...)
- 오프라인 보관/참조 가능
- **한계**: 시각적 위치 매핑 불가, 비교가 아닌 나열

**예상 개발 기간**: 3-5일
**리스크**: 낮음

### 8.6 최종 권장사항

**✅ 채택 권장: 대안 1 + 대안 2 조합**
- 총 개발 기간: 4-6일
- 기술적으로 불가능한 문제 회피
- 실용적이고 사용자 친화적

**❌ 불가 판정: 버전 간 첨삭 자동 이관/매핑**
- PDF 구조 변경 시 좌표 기반 매핑 불가능
- OCR + 텍스트 매칭도 부정확
- 수동 매핑은 사용자 부담 과다

**조건부 가능: Excel 출력**
- "오프라인 보관" 명시 요구 시에만
- "비교"가 아닌 "기록 보관" 용도

### 8.7 고객사 회신 초안

```
[기술 검토 결과]

1. 버전 간 첨삭 자동 연결/이관 기능은 기술적 제약으로 구현 불가
   - PDF 구조 변경 시 좌표 기반 자동 매핑 불가능
   - 수동 매핑은 사용자 부담 과다

2. 대안 제안:

   [즉시 적용] 버전 히스토리 UI 개선
   - 이전 버전 피드백을 새 창으로 열어 나란히 비교
   - 개발: 1일

   [권장] 버전별 피드백 요약 리스트
   - 각 버전의 주요 피드백 텍스트 정리
   - 개발: 3-5일

3. 추가 검토: Excel 출력
   - 오프라인 보관 용도
   - 개발: 3-5일
   - 단, 시각적 위치 매핑 불가

피드백 전/후 비교를 위해서는
"사용자가 두 버전을 직접 확인"하는 방식이 가장 실용적입니다.
```

---

## 9. 다음 작업 시 참고사항

### 9.1 미완료 작업
- 없음 (현재까지 요청된 작업 모두 완료)

### 9.2 추가 고려사항

**학생용 제출 화면:**
- 지도교수명 데이터 소스 향후 API 연동 필요
- 현재는 Mock 데이터 사용 (`advisorName: '홍길동 교수'`)

**관리자 업무일정:**
- 기존 모달 관련 함수들은 코드에 남아있으나 사용되지 않음
- 필요시 제거 가능: `openProcessPhaseModal`, `openProcessPhaseDetailModal`, `openAdminWorkModal`, `openAdminWorkDetailModal`, `closeScheduleModal`

**PDF 뷰어 피드백 비교:**
- 고객사 회신 대기 중
- 권장 방안 채택 시 4-6일 개발 소요

### 9.3 파일 위치 요약

```
student-v3/
├── assets/js/
│   ├── thesis-submission.js        (학위논문 제출)
│   ├── journal-submission.js       (학술지 논문 제출)
│   ├── guidance-status-detail.js   (논문 지도 현황 상세)
│   └── guidance-status-data.js     (논문 지도 현황 데이터)

admin-v3/
└── assets/js/
    └── work-schedule-management.js (업무일정 관리)

docs/
└── session-2026-01-20-summary.md   (본 문서)
```

---

## 10. 세션 종료 시점 상태

- ✅ 모든 커밋 완료 및 푸시 완료
- ✅ 학생용 제출 화면 개선 완료
- ✅ 관리자 업무일정 관리 모달→페이지 전환 완료
- ✅ PDF 뷰어 피드백 비교 기술 분석 완료
- ✅ 세션 요약 문서 작성 완료
- ✅ 학생용 학기별 지도 계획 주차 추가/삭제 기능 추가 완료
- ✅ 관리자용 학기별 지도 계획 주차 추가/삭제 기능 추가 완료

**마지막 커밋:** `a55f88e` (2026-01-20)
**브랜치:** main
**원격 저장소:** 동기화 완료

---

## 7. 학생용 학기별 지도 계획 주차 추가/삭제 기능 추가 (2026-01-20 추가)

### 7.1 작업 배경

**요구사항:**
- 학생용 학기별 지도 계획 화면에 주차 추가/삭제 기능 추가
- 교수 화면과 동일한 기능 제공
- **중요:** 교수-학생-관리자의 차이는 실적 입력 가능여부, 계획승인 가능여부 차이만 있을 뿐 이외 기능은 동일해야 함
- 계획 승인 이후에는 계획 수정 불가능

### 7.2 구현 내용

#### 파일: `student-v3/assets/js/semester-guidance-plan.js`

**1. 커스텀 확인 대화상자 함수 추가 (line 50-112)**
```javascript
function showCustomConfirmStudent(title, message, confirmText = '확인', cancelText = '취소', type = 'danger')
```
- Promise 기반 확인 대화상자
- 주차 삭제 시 사용자 확인을 위해 사용
- `type` 파라미터로 버튼 스타일 변경 가능 (danger/primary)

**2. 주차 추가 함수 (line 114-158)**
```javascript
function addNewWeekStudent()
```
- 현재 계획에 새로운 주차 추가
- 승인된 계획은 수정 불가 (alert로 경고)
- 기존 주차 내용 저장 후 새 주차 추가
- 새 주차 객체 구조: `{ week: number, plannedContent: '', executions: [] }`
- `renderStudentSemesterPlan()` 호출하여 화면 갱신

**3. 주차 삭제 함수 (line 160-216)**
```javascript
async function deleteWeekStudent(weekNumber)
```
- 지정된 주차 삭제
- 승인된 계획은 수정 불가 (alert로 경고)
- 계획 내용이 있으면 경고 메시지 추가
- 커스텀 확인 대화상자로 사용자 확인
- 삭제 후 주차 번호 재정렬
- `renderStudentSemesterPlan()` 호출하여 화면 갱신

**4. UI 수정 - 데스크탑 테이블에 주차 추가 버튼 (line 615-622)**
```javascript
${!isApproved ? `
    <div class="px-4 py-3 bg-gray-50 border-t border-gray-300">
        <button onclick="addNewWeekStudent()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2">
            <i class="fas fa-plus"></i> 주차 추가
        </button>
    </div>
` : ''}
```
- 테이블 하단에 "주차 추가" 버튼 추가
- 승인되지 않은 경우에만 표시

**5. UI 수정 - 모바일에 주차 추가 버튼 (line 628-635)**
```javascript
${!isApproved ? `
    <div class="bg-white rounded-lg shadow-md p-4">
        <button onclick="addNewWeekStudent()"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2">
            <i class="fas fa-plus"></i> 주차 추가
        </button>
    </div>
` : ''}
```
- 모바일 카드 뷰 하단에 전체 너비 버튼 추가

**6. UI 수정 - 데스크탑 테이블 주차 삭제 버튼 (line 653-663)**
```javascript
<td class="border border-gray-300 px-2 py-2 text-center font-semibold" rowspan="${rowCount}">
    <div class="flex flex-col items-center gap-1">
        <span>${week.week}주</span>
        ${!isApproved ? `
            <button onclick="event.stopPropagation(); deleteWeekStudent(${week.week})"
                    class="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    title="주차 삭제">
                <i class="fas fa-trash"></i>
            </button>
        ` : ''}
    </div>
</td>
```
- 주차 번호 셀에 삭제 버튼 추가
- 승인되지 않은 경우에만 표시

**7. UI 수정 - 모바일 카드 주차 삭제 버튼 (line 727-736)**
```javascript
<div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
    <span class="text-base font-semibold text-gray-800">${week.week}주차</span>
    ${!isApproved ? `
        <button onclick="event.stopPropagation(); deleteWeekStudent(${week.week})"
                class="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                title="주차 삭제">
            <i class="fas fa-trash"></i> 삭제
        </button>
    ` : ''}
</div>
```
- 모바일 카드 헤더에 삭제 버튼 추가

**8. 전역 함수 노출 (line 1079-1080)**
```javascript
window.addNewWeekStudent = addNewWeekStudent;
window.deleteWeekStudent = deleteWeekStudent;
```
- HTML onclick 이벤트에서 함수 호출 가능하도록 전역 노출

### 7.3 기술적 특징

**승인 상태 체크:**
- `semesterPlan.approved === true`이면 모든 수정 기능 비활성화
- UI 버튼 자체가 렌더링되지 않음 (`!isApproved` 조건)
- 함수 실행 시에도 승인 상태 재확인 후 alert 표시

**데이터 무결성:**
- 주차 삭제 시 자동으로 주차 번호 재정렬
- 기존 입력 내용 보존 (추가 전 저장)
- `totalWeeks` 카운터 자동 업데이트

**사용자 경험:**
- 삭제 전 커스텀 확인 대화상자로 확인
- 입력된 내용이 있으면 추가 경고 메시지 표시
- 작업 완료 후 자동 화면 갱신

**CSS 스타일:**
- 커스텀 확인 대화상자 CSS는 `professor-v3/assets/css/components-v3.css`에 정의
- 학생 화면에서 이미 해당 CSS 파일 사용 중 (student-dashboard.html line 17)

### 7.4 변경 파일

- `student-v3/assets/js/semester-guidance-plan.js`

### 7.5 기능 비교: 교수 vs 학생

| 기능 | 교수 화면 | 학생 화면 | 차이점 |
|------|----------|----------|--------|
| 주차 추가 | ✅ | ✅ | 동일 |
| 주차 삭제 | ✅ | ✅ | 동일 |
| 계획 내용 입력 | ✅ | ✅ | 동일 |
| 실적 입력 | ✅ | ❌ | 교수만 가능 |
| 계획 승인 | ✅ | ❌ | 교수만 가능 |
| 승인 후 수정 제한 | ✅ | ✅ | 동일 |

---

## 8. 관리자용 학기별 지도 계획 주차 추가/삭제 기능 추가 (2026-01-20 추가)

### 8.1 작업 배경

**요구사항:**
- 관리자용 학기별 지도 계획 화면에 주차 추가/삭제 기능 추가
- 학생/교수 화면과 동일한 기능 제공
- **중요:** 교수-학생-관리자의 차이는 실적 입력 가능여부, 계획승인 가능여부 차이만 있을 뿐 이외 기능은 동일해야 함
- 계획 승인 이후에는 계획 수정 불가능
- 계획 승인은 교수만 가능 (관리자는 승인 불가)

### 8.2 구현 내용

#### 파일: `admin-v3/assets/js/admin_weekly_guidance.js`

**1. 커스텀 확인 대화상자 함수 추가 (line 31-88)**
```javascript
function showCustomConfirmAdmin(title, message, confirmText = '확인', cancelText = '취소', type = 'danger')
```
- Promise 기반 확인 대화상자
- 주차 삭제 시 사용자 확인을 위해 사용
- `type` 파라미터로 버튼 스타일 변경 가능 (danger/primary)
- ESC 키 및 오버레이 클릭으로 닫기 지원

**2. 주차 추가 함수 (line 1011-1056)**
```javascript
function addNewWeekAdmin()
```
- `DataService.getAllSemesterPlans(currentAdminStudentId)`로 현재 계획 조회
- 승인된 계획은 수정 불가 (alert로 경고)
- 기존 주차 내용 저장 후 새 주차 추가
- 새 주차 객체 구조: `{ week: number, plannedContent: '', executions: [] }`
- `refreshAdminModalContent()` 호출하여 모달 새로고침

**3. 주차 삭제 함수 (line 1058-1127)**
```javascript
async function deleteWeekAdmin(weekNumber)
```
- 지정된 주차 삭제
- 승인된 계획은 수정 불가 (alert로 경고)
- 계획 내용이 있으면 경고 메시지 추가
- 커스텀 확인 대화상자로 사용자 확인
- 삭제 후 주차 번호 재정렬
- DataService에 저장 후 모달 새로고침

**4. UI 수정 - 테이블 하단에 주차 추가 버튼 (line 782-789)**
```javascript
${!isApproved ? `
    <div class="px-4 py-3 bg-gray-50 border-t border-gray-300">
        <button onclick="addNewWeekAdmin()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2">
            <i class="fas fa-plus"></i> 주차 추가
        </button>
    </div>
` : ''}
```
- 테이블 하단에 "주차 추가" 버튼 추가
- 승인되지 않은 경우에만 표시

**5. UI 수정 - 주차 셀에 삭제 버튼 (line 819-830)**
```javascript
<td class="border border-gray-300 px-2 py-2 text-center font-semibold" rowspan="${rowCount}">
    <div class="flex flex-col items-center gap-1">
        <span>${week.week}주</span>
        ${!isApproved ? `
            <button onclick="event.stopPropagation(); deleteWeekAdmin(${week.week})"
                    class="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    title="주차 삭제">
                <i class="fas fa-trash"></i>
            </button>
        ` : ''}
    </div>
</td>
```
- 주차 번호 셀에 삭제 버튼 추가
- 승인되지 않은 경우에만 표시

**6. 전역 함수 노출 (line 1231-1232)**
```javascript
window.addNewWeekAdmin = addNewWeekAdmin;
window.deleteWeekAdmin = deleteWeekAdmin;
```
- HTML onclick 이벤트에서 함수 호출 가능하도록 전역 노출

### 8.3 기술적 특징

**승인 상태 체크:**
- `currentPlan.approved === true`이면 모든 수정 기능 비활성화
- UI 버튼 자체가 렌더링되지 않음 (`!isApproved` 조건)
- 함수 실행 시에도 승인 상태 재확인 후 alert 표시

**데이터 무결성:**
- 주차 삭제 시 자동으로 주차 번호 재정렬
- 기존 입력 내용 보존 (추가 전 저장)
- `totalWeeks` 카운터 자동 업데이트
- DataService에 명시적 저장

**사용자 경험:**
- 삭제 전 커스텀 확인 대화상자로 확인
- 입력된 내용이 있으면 추가 경고 메시지 표시
- 작업 완료 후 자동 모달 새로고침

**모달 팝업 구조:**
- 관리자 화면은 모달 팝업 방식 (학생은 페이지, 교수도 모달)
- `currentAdminStudentId` 변수로 현재 선택된 학생 관리
- `refreshAdminModalContent()` 함수로 모달 내용 갱신

**CSS 스타일:**
- 커스텀 확인 대화상자 CSS는 `professor-v3/assets/css/components-v3.css`에 정의
- 관리자 화면에서도 동일한 CSS 사용

### 8.4 변경 파일

- `admin-v3/assets/js/admin_weekly_guidance.js`

### 8.5 최종 기능 비교: 교수 vs 학생 vs 관리자

| 기능 | 교수 화면 | 학생 화면 | 관리자 화면 | 비고 |
|------|----------|----------|------------|------|
| **화면 형태** | 모달 팝업 | 페이지 전체 | 모달 팝업 | - |
| **주차 추가** | ✅ | ✅ | ✅ | 동일 |
| **주차 삭제** | ✅ | ✅ | ✅ | 동일 |
| **계획 내용 입력** | ✅ (승인 전) | ✅ (승인 전) | ✅ (승인 전) | 동일 |
| **실적 입력** | ✅ | ❌ | ❌ | 교수만 가능 |
| **계획 승인** | ✅ | ❌ | ❌ | 교수만 가능 |
| **승인 후 수정 제한** | ✅ | ✅ | ✅ | 동일 |

**결론:** 학생-교수-관리자 세 화면 모두 주차 관리 기능이 완전히 동일하게 구현되었습니다. 차이점은 의도된 권한 차이(실적 입력, 승인 권한)만 남아있습니다.
