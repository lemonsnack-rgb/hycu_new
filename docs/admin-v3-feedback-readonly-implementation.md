# 관리자 논문 지도 활동 상세 화면 - 읽기 전용 구현

## 개요
교수용 온라인 피드백 시스템(professor-v3)의 PDF 뷰어를 관리자용으로 복사하여 읽기 전용 버전으로 변환

## 구현 일자
2026-01-05

## 파일 목록

### 복사된 파일
1. **professor-v3/assets/js/feedback-data.js** → **admin-v3/assets/js/admin_feedback_data.js**
   - 피드백 데이터 서비스 및 Mock 데이터
   - 제출물 목록, 피드백 데이터, 자주 쓰는 코멘트 관리

2. **professor-v3/assets/js/feedback-detail-screen.js** → **admin-v3/assets/js/admin_feedback_detail.js** ✅ **읽기 전용 변환 완료**
   - PDF 상세 화면 (읽기 전용으로 변환)
   - 함수명 변경: `ReadOnly` 접미사 추가
   - 주요 변경 사항:
     - ✅ "피드백 완료" 버튼 제거
     - ✅ PDF 편집 도구 제거 (comment-tool, drawing-tool, highlight-tool, eraser-tool)
     - ✅ 전체 평가 및 첨삭 입력 영역 제거
     - ✅ "읽기 전용 모드" 배지 추가
     - ✅ 학생 정보 카드 추가 (학생명, 학번, 과정, 전공, 제출일)

3. **professor-v3/assets/css/feedback.css** → **admin-v3/assets/css/admin_feedback.css**
   - PDF 뷰어 및 피드백 패널 스타일
   - 3단 레이아웃 (제출 이력 | PDF 뷰어 | 피드백 패널)

### 수정된 파일
4. **admin-v3/index.html**
   - CSS 링크 추가 (라인 47-48):
     ```html
     <!-- Admin Feedback CSS (읽기 전용 PDF 뷰어) -->
     <link rel="stylesheet" href="assets/css/admin_feedback.css">
     ```
   - JavaScript 링크 추가 (라인 1071-1073):
     ```html
     <!-- Admin Feedback Scripts (읽기 전용 PDF 뷰어) -->
     <script src="assets/js/admin_feedback_data.js"></script>
     <script src="assets/js/admin_feedback_detail.js"></script>
     ```

5. **admin-v3/assets/js/admin_views.js** (라인 1330-1384)
   - 논문 지도 활동 테이블에서 행 클릭 시 상세 화면 열기
   - `onclick="viewPdfFeedback(${item.id}, true)"` 추가

## 주요 변환 사항

### 1. 함수명 변경 (읽기 전용 접미사 추가)
| 교수용 함수명 | 관리자용 함수명 (ReadOnly) |
|-------------|---------------------------|
| `openFeedbackDetailScreen()` | `viewPdfFeedback()` |
| `closeFeedbackDetailScreen()` | `closeFeedbackDetailScreenReadOnly()` |
| `createFeedbackDetailScreen()` | `createFeedbackDetailScreenReadOnly()` |
| `ensureSubmissionSidebar()` | `ensureSubmissionSidebarReadOnly()` |
| `initPDFViewer()` | `initPDFViewerReadOnly()` |
| `renderGeneralThread()` | `renderGeneralThreadReadOnly()` |
| `switchFeedbackTab()` | `switchFeedbackTabReadOnly()` |
| `getPlagiarismColorClass()` | `getPlagiarismColorClassReadOnly()` |
| `downloadPlagiarismReport()` | `downloadPlagiarismReportReadOnly()` |
| `refreshInlineTabMarker()` | `refreshInlineTabMarkerReadOnly()` |
| `switchPdfVersion()` | `switchPdfVersionReadOnly()` |
| `escapeHtml()` | `escapeHtmlReadOnly()` |

### 2. UI 변경 사항

#### 헤더 영역 (라인 56-70)
```html
<!-- BEFORE (교수용) -->
<button onclick="completeFeedbackDetail()">피드백 완료</button>

<!-- AFTER (관리자용) -->
<span class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium flex items-center gap-1">
    <i class="fas fa-eye"></i>
    읽기 전용 모드
</span>
```

#### 학생 정보 영역 추가 (라인 72-92)
```html
<div class="px-6 py-4 border-b bg-gray-50">
    <div class="grid grid-cols-2 gap-4">
        <div>
            <h3 class="text-base font-bold text-gray-900 mb-2">${request.thesisTitle}</h3>
            <div class="text-sm text-gray-600 space-y-1">
                <p><span class="font-medium">학생:</span> ${request.studentName} (${request.studentNumber})</p>
                <p><span class="font-medium">과정:</span> ${request.program} · ${request.major}</p>
                <p><span class="font-medium">제출일:</span> ${request.uploadDate}</p>
            </div>
        </div>
        <div class="flex items-center justify-end">
            <div class="text-sm text-gray-600">
                <span>CopyKiller: ${request.copykillerScore} / GPT Killer: ${request.gptkillerScore}</span>
                <a href="#" onclick="downloadPlagiarismReportReadOnly('combined', '${request.id}')">결과보고서(통합)</a>
            </div>
        </div>
    </div>
</div>
```

#### PDF 툴바 변경 (라인 118-155)
```html
<!-- BEFORE (교수용) - 편집 도구 포함 -->
<button id="comment-tool">첨삭 영역 추가</button>
<button id="drawing-tool">판서</button>
<button id="highlight-tool">하이라이트</button>
<button id="eraser-tool">지우개</button>

<!-- AFTER (관리자용) - 네비게이션과 줌만 -->
<!-- 편집 도구 완전 제거, 페이지 네비게이션과 확대/축소만 유지 -->
```

#### 피드백 패널 변경 (라인 169-202)
```html
<!-- BEFORE (교수용) -->
<h4>피드백</h4>
<textarea placeholder="전체 평가를 입력하세요..."></textarea>
<button onclick="addGeneralFeedback()">등록</button>

<!-- AFTER (관리자용) -->
<h4>피드백 조회</h4>
<!-- 입력 영역 완전 제거, 조회만 가능 -->
```

### 3. 삭제된 기능
1. ✅ 피드백 완료 버튼 및 `completeFeedbackDetail()` 함수
2. ✅ PDF 편집 도구 (첨삭, 판서, 하이라이트, 지우개)
3. ✅ 전체 평가 입력 textarea 및 등록 버튼
4. ✅ 댓글 입력 textarea 및 등록 버튼
5. ✅ 자주 쓰는 코멘트 팝오버 (`createQuickMarkPopover()`)
6. ✅ 첨부 파일 업로드 버튼
7. ✅ 피드백 수정/삭제 버튼

### 4. 유지된 기능
1. ✅ PDF 페이지 네비게이션 (이전/다음 페이지)
2. ✅ PDF 확대/축소 및 맞춤
3. ✅ 제출 이력 사이드바 (버전 전환)
4. ✅ 전체 평가 조회 (읽기 전용)
5. ✅ 첨삭 조회 (읽기 전용)
6. ✅ 표절률 결과보고서 다운로드
7. ✅ 탭 전환 (전체 평가 ↔ 첨삭)
8. ✅ ESC 키로 닫기

### 5. UI 일치성 확인 (2026-01-05 업데이트)

#### 전체 평가 표시 형식
**교수용 (feedback-viewer.js:558-576)**:
```html
<div class="general-main-feedback">
  <div id="general-main-display">
    <div class="p-3 border-2 border-[#F8BBD9] rounded-lg bg-[#FCE4EC]">
      <div class="mb-2 text-gray-800 whitespace-pre-wrap">${escapeHtml(mainFeedback.text)}</div>
      ${att ? '<div class="text-xs text-gray-600 mb-2">'+att+'</div>' : ''}
      <div class="flex items-center justify-between">
        <div class="text-[11px] text-gray-500">${new Date(mainFeedback.ts).toLocaleString()}</div>
        ${isOwner ? '<button>수정</button>' : ''}
      </div>
    </div>
  </div>
</div>
```

**관리자용 (admin_feedback_detail.js:651-661)** - ✅ **일치 확인 완료**:
```html
<div class="general-main-feedback">
  <div id="general-main-display">
    <div class="p-3 border-2 border-[#F8BBD9] rounded-lg bg-[#FCE4EC]">
      <div class="mb-2 text-gray-800 whitespace-pre-wrap">${escapeHtmlReadOnly(mainFeedback.text)}</div>
      ${att ? '<div class="text-xs text-gray-600 mb-2">'+att+'</div>' : ''}
      <div class="flex items-center justify-between">
        <div class="text-[11px] text-gray-500">${mainFeedback.timestamp || ''}</div>
      </div>
    </div>
  </div>
</div>
```

**차이점**:
- ✅ HTML 구조: 동일
- ✅ CSS 클래스: 동일
- ✅ 핑크 배경색 (`bg-[#FCE4EC]`): 동일 (교수용과 동일한 디자인)
- ✅ 핑크 테두리 (`border-[#F8BBD9]`): 동일
- ✅ Timestamp 레이아웃 (`flex items-center justify-between`): 동일
- ⚠️ 수정 버튼: 읽기 전용이므로 제거됨 (의도된 차이)

#### 입력 영역
- ✅ 교수용: `<textarea>` 입력창 있음 (편집 가능)
- ✅ 관리자용: 입력창 완전 제거 (읽기 전용)
- ✅ 확인 결과: admin_feedback_detail.js에 `textarea` 또는 `<input` 요소 없음

## 네비게이션 흐름

### 관리자 → 상세 화면
1. 관리자가 "논문 지도 활동" 메뉴 클릭
2. admin_views.js의 `showGuidanceProgress()` 실행
3. 테이블에 학생 목록 표시 (라인 1330-1384)
4. 테이블 행 클릭: `onclick="viewPdfFeedback(${item.id}, true)"`
5. admin_feedback_detail.js의 `viewPdfFeedback()` 실행
6. 읽기 전용 PDF 뷰어 화면 표시

### 상세 화면 → 목록
1. "목록으로 돌아가기" 버튼 클릭
2. `closeFeedbackDetailScreenReadOnly()` 실행
3. 상세 화면 제거, 목록 화면 다시 표시

## 데이터 구조

### FeedbackDataService (admin_feedback_data.js)
```javascript
const FEEDBACK_REQUESTS = [
    {
        id: 'fb-001',
        studentName: '김철수',
        studentNumber: '2024001',
        program: '박사',
        major: '컴퓨터공학',
        graduate: '일반대학원',
        thesisTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        copykillerScore: '12%',
        gptkillerScore: '5%',
        uploadDate: '2025-11-20',
        status: '피드백 대기'
    }
];
```

## TODO: 향후 작업

### 1. PDF 뷰어 완전 구현 (현재 플레이스홀더)
- `initPDFViewerReadOnly()` 함수에 PDF.js 통합
- 실제 PDF 렌더링 및 annotation 표시 (읽기 전용)
- 페이지 네비게이션 및 줌 기능 연결

### 2. Mock 데이터 통합
- admin_feedback_data.js의 Mock 데이터를 admin_data.js와 통합
- 학생 정보를 기존 Mock 데이터와 매핑

### 3. 실제 API 연동
- 제출물 목록 API
- PDF 파일 URL API
- 피드백 데이터 조회 API
- 표절률 결과보고서 API

### 4. 테스트
- [ ] 목록 → 상세 화면 네비게이션 테스트
- [ ] 읽기 전용 모드 확인 (입력/편집 불가)
- [ ] PDF 뷰어 표시 확인
- [ ] 피드백 조회 확인
- [ ] 표절률 결과보고서 다운로드 테스트
- [ ] ESC 키로 닫기 테스트
- [ ] 반응형 레이아웃 테스트

## 참고 문서
- [professor-v3 온라인 피드백 시스템](../professor-v3/assets/js/feedback-detail-screen.js)
- [admin-v3 표준 검색 레이아웃](./admin-v3-search-layout-standard.md)
- [지도교수 배정 읽기 전용 구현](./advisor-assignment-readonly-implementation.md)

## 구현자
Claude Sonnet 4.5
