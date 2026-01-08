# 학생용 논문 지도 현황 구현 계획

## 1. 개요

교수용 화면([professor-v3/professor-dashboard-proposal.html](../../professor-v3/professor-dashboard-proposal.html))에 구현된 **"논문 지도 현황"(Feedback System)**을 학생용 화면으로 이식하되, 다음 사항을 적용:
- 기존 **모달 → 페이지 전환** 방식으로 변경
- **댓글 기능만** 학생이 사용 가능
- **판서/첨삭**은 교수만 작성, 학생은 읽기 전용
- 검색 필터와 목록은 교수용과 동일하게 구성

---

## 2. 교수용 Feedback 시스템 구조 분석

### 2.1 관련 파일
```
professor-v3/
├── professor-dashboard-proposal.html    # 메인 HTML (검색 필터 포함)
└── assets/js/
    ├── feedback-list.js                 # 목록 화면 (검색, 필터링)
    ├── feedback-detail-screen.js        # 상세 화면 (페이지 전환 방식)
    ├── feedback-viewer.js               # PDF 뷰어 + 코멘트 패널
    ├── feedback-tools.js                # PDF 도구 (판서, 첨삭, 하이라이트)
    ├── feedback-data.js                 # Mock 데이터 서비스
    └── assets/css/feedback.css          # 스타일
```

### 2.2 화면 구성
```
[목록 화면]
- 검색 필터 (11개 필드)
  - 학년도, 학기, 대학구분, 계열/대학원, 학부(과)전공, 학과/전공
  - 학위과정, 학적상태, 학번/성명, 지도교수명, 피드백상태
- 제출물 테이블 (17개 컬럼)
  - 체크박스, 순번, 학년도, 학기, 대학구분, 계열/대학원, 학부(과)전공
  - 학과/전공, 학위과정, 학적상태, 학번, 성명, 논문명, 지도교수명
  - 제출일시, 지도단계, 피드백상태

[상세 화면] (페이지 전환)
- 헤더
  - 뒤로가기 버튼
  - 피드백 완료 버튼
- 논문 정보 영역
  - 논문명, 표절률(CopyKiller/GPT Killer)
- 3단 레이아웃
  - 왼쪽: 제출 이력
  - 중앙: PDF 뷰어 + 판서/첨삭 도구
  - 오른쪽: 피드백 패널 (전체 평가 / 첨삭 탭)
```

### 2.3 기능 분류
| 기능 | 교수 | 학생 | 파일 |
|------|------|------|------|
| 목록 조회 | ✅ | ✅ | feedback-list.js |
| 검색/필터링 | ✅ | ✅ | feedback-list.js |
| PDF 뷰어 | ✅ | ✅ (읽기 전용) | feedback-viewer.js |
| 전체 평가 등록 | ✅ | ❌ | feedback-viewer.js (line 678-698) |
| 전체 평가 댓글 | ✅ | ✅ | feedback-viewer.js (line 700-724) |
| 첨삭 영역 생성 | ✅ | ❌ | feedback-tools.js (line 308-398) |
| 첨삭 댓글 | ✅ | ✅ | feedback-tools.js |
| 판서 (Drawing) | ✅ | ❌ (읽기 전용) | feedback-tools.js (line 407-426) |
| 하이라이트 | ✅ | ❌ (읽기 전용) | feedback-tools.js (line 407-426) |
| 피드백 완료 | ✅ | ❌ | feedback-detail-screen.js (line 340-405) |

---

## 3. 학생용 구현 계획

### 3.1 파일 구조
```
student-v3/
├── student-dashboard.html               # 메인 HTML (검색 필터 추가)
└── assets/js/
    ├── guidance-status-list.js          # 목록 화면 (복사)
    ├── guidance-status-detail.js        # 상세 화면 (복사 + 권한 제한)
    ├── guidance-status-viewer.js        # PDF 뷰어 (복사 + 읽기 전용)
    ├── guidance-status-tools.js         # PDF 도구 (복사 + 읽기 전용)
    └── guidance-status-data.js          # Mock 데이터 서비스 (복사)
```

### 3.2 네이밍 규칙
교수용과 학생용의 네임스페이스 충돌 방지를 위해 모든 함수명에 `Student` 접두사 추가:

**교수용 → 학생용**
```javascript
// 목록
renderFeedbackList()              → renderStudentGuidanceStatusList()
searchFeedback()                  → searchStudentGuidanceStatus()
openFeedbackDetailScreen()        → openStudentGuidanceStatusDetail()

// 상세
initPDFViewer()                   → initStudentPDFViewer()
renderGeneralThread()             → renderStudentGeneralThread()
addGeneralReply()                 → addStudentGeneralReply()
switchFeedbackTab()               → switchStudentFeedbackTab()

// 데이터
FeedbackDataService               → StudentGuidanceDataService
getFeedbackRequests()             → getStudentGuidanceRequests()
```

### 3.3 권한 제한 구현

#### 3.3.1 PDF 도구 제한
```javascript
// guidance-status-tools.js
function initStudentPDFViewer(requestId, pdfUrl, feedbackData) {
    // ... PDF 로드 코드는 동일 ...

    // 🔒 학생은 선택 도구만 활성화
    setStudentTool('select');

    // 🔒 도구 버튼 비활성화/숨김
    document.getElementById('comment-tool')?.remove();
    document.getElementById('drawing-tool')?.remove();
    document.getElementById('highlight-tool')?.remove();
    document.getElementById('eraser-tool')?.remove();
}

function setStudentTool(tool) {
    // 🔒 학생은 'select'만 허용
    if (tool !== 'select') {
        console.warn('학생은 선택 도구만 사용 가능합니다.');
        return;
    }

    currentTool = 'select';
    // ... 도구 설정 ...
}
```

#### 3.3.2 전체 평가 댓글만 허용
```javascript
// guidance-status-viewer.js - renderStudentGeneralThread()
function renderStudentGeneralThread(requestId) {
    // 교수가 작성한 전체 평가 표시 (읽기 전용)
    // 댓글 입력창 표시 (✅ 학생 작성 가능)

    listEl.innerHTML = `
        <!-- 메인 평가 (교수 작성, 읽기 전용) -->
        <div class="general-main-feedback">
            <div class="p-3 border-2 border-[#F8BBD9] rounded-lg bg-[#FCE4EC]">
                <div class="mb-2 text-gray-800 whitespace-pre-wrap">${mainFeedback.text}</div>
                <div class="text-[11px] text-gray-500">${timestamp}</div>
                <!-- 🔒 수정 버튼 제거 -->
            </div>
        </div>

        <!-- ✅ 댓글 영역 (학생 작성 가능) -->
        <div class="general-replies">
            <h6>💬 댓글 (${replies.length})</h6>
            ${replies.map(reply => `
                <div class="p-2 border rounded-lg bg-gray-50">
                    <div>${reply.text}</div>
                    <div class="text-[11px]">${reply.author} · ${timestamp}</div>
                    ${reply.authorId === currentStudentId ? `
                        <!-- ✅ 본인 댓글만 수정 가능 -->
                        <button onclick="editStudentGeneralReply(${idx})">수정</button>
                    ` : ''}
                </div>
            `).join('')}

            <!-- ✅ 댓글 입력창 -->
            <textarea id="student-reply-textarea" placeholder="댓글을 입력하세요..."></textarea>
            <button onclick="addStudentGeneralReply()">댓글 등록</button>
        </div>
    `;
}
```

#### 3.3.3 첨삭 댓글만 허용
```javascript
// guidance-status-tools.js - renderStudentInlineComments()
function renderStudentInlineComments() {
    // 교수가 작성한 첨삭 영역 표시 (읽기 전용)
    // 각 첨삭에 대한 댓글 입력창 표시 (✅ 학생 작성 가능)

    const commentCards = annotations[pageNum]
        .filter(a => a.customType === 'comment')
        .map((annot, idx) => {
            const mainComment = annot.comments[0]; // 교수가 작성한 첨삭
            const replies = annot.comments.slice(1); // 댓글들

            return `
                <div class="comment-card">
                    <!-- 첨삭 영역 (교수 작성, 읽기 전용) -->
                    <div class="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                        <div class="font-semibold">페이지 ${pageNum} - 첨삭 #${idx+1}</div>
                        <div class="mt-2">${mainComment.text}</div>
                        <div class="text-xs text-gray-500">${mainComment.author}</div>
                        <!-- 🔒 수정/삭제 버튼 제거 -->
                    </div>

                    <!-- ✅ 댓글 영역 (학생 작성 가능) -->
                    <div class="ml-4 mt-2 space-y-2">
                        ${replies.map((reply, replyIdx) => `
                            <div class="p-2 bg-gray-50 rounded">
                                <div>${reply.text}</div>
                                <div class="text-xs">${reply.author} · ${timestamp}</div>
                                ${reply.authorId === currentStudentId ? `
                                    <!-- ✅ 본인 댓글만 수정 가능 -->
                                    <button onclick="editStudentInlineReply(${idx}, ${replyIdx})">수정</button>
                                ` : ''}
                            </div>
                        `).join('')}

                        <!-- ✅ 댓글 입력창 -->
                        <textarea id="inline-reply-textarea-${idx}"
                                  placeholder="댓글을 입력하세요..."></textarea>
                        <button onclick="addStudentInlineReply(${idx})">댓글 등록</button>
                    </div>
                </div>
            `;
        }).join('');
}
```

#### 3.3.4 피드백 완료 버튼 제거
```javascript
// guidance-status-detail.js - createStudentGuidanceStatusDetailScreen()
screen.innerHTML = `
    <div class="feedback-detail-content">
        <div class="px-6 py-3 border-b bg-white flex items-center justify-between">
            <button onclick="closeStudentGuidanceStatusDetail()" class="back-to-list-btn">
                목록으로 돌아가기
            </button>
            <!-- 🔒 피드백 완료 버튼 제거 -->
        </div>
        ...
    </div>
`;
```

### 3.4 검색 필터 (HTML)

```html
<!-- student-dashboard.html -->
<div id="guidance-status-screen" class="screen-content" style="display: none;">
    <!-- 검색 필터 영역 (교수용과 동일) -->
    <div class="bg-white rounded-lg shadow-md mb-6 p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">검색 옵션</h3>

        <div class="grid grid-cols-4 gap-4 mb-4">
            <!-- Row 1 -->
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">학년도</label>
                <select id="student-guidance-filter-year" class="w-full px-2 border rounded text-xs" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">학기</label>
                <select id="student-guidance-filter-semester" class="w-full px-2 border rounded text-xs" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="1">1학기</option>
                    <option value="2">2학기</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">학위과정</label>
                <select id="student-guidance-filter-program" class="w-full px-2 border rounded text-xs" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="석사">석사</option>
                    <option value="박사">박사</option>
                    <option value="석박사통합">석박사통합</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">피드백상태</label>
                <select id="student-guidance-filter-status" class="w-full px-2 border rounded text-xs" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="대기">대기</option>
                    <option value="진행중">진행중</option>
                    <option value="완료">완료</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-4 mb-4">
            <!-- Row 2 -->
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">대학구분</label>
                <select id="student-guidance-filter-university-type" class="w-full px-2 border rounded text-xs" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="일반대학원">일반대학원</option>
                    <option value="특수대학원">특수대학원</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">계열/대학원</label>
                <select id="student-guidance-filter-college" class="w-full px-2 border rounded text-xs" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="공학계열">공학계열</option>
                    <option value="사회과학계열">사회과학계열</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">학부(과)전공</label>
                <select id="student-guidance-filter-undergraduate" class="w-full px-2 border rounded text-xs" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="컴퓨터공학">컴퓨터공학</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">학과/전공</label>
                <select id="student-guidance-filter-major" class="w-full px-2 border rounded text-xs" style="height: 34px;">
                    <option value="">전체</option>
                    <option value="컴퓨터공학전공">컴퓨터공학전공</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-4 mb-4">
            <!-- Row 3 -->
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">지도교수명</label>
                <input type="text" id="student-guidance-filter-professor"
                       placeholder="지도교수명"
                       class="w-full px-2 border rounded text-xs" style="height: 34px;">
            </div>
        </div>

        <div class="flex gap-2 justify-end">
            <button onclick="searchStudentGuidanceStatus()" class="btn btn-primary btn-sm">
                검색
            </button>
            <button onclick="resetStudentGuidanceStatusSearch()" class="btn btn-secondary btn-sm">
                초기화
            </button>
        </div>
    </div>

    <!-- 목록 영역 -->
    <div id="student-guidance-status-content"></div>
</div>
```

---

## 4. 구현 단계

### Step 1: 파일 복사 및 네이밍 변경
```bash
# 1. JS 파일 복사
cp professor-v3/assets/js/feedback-list.js \
   student-v3/assets/js/guidance-status-list.js

cp professor-v3/assets/js/feedback-detail-screen.js \
   student-v3/assets/js/guidance-status-detail.js

cp professor-v3/assets/js/feedback-viewer.js \
   student-v3/assets/js/guidance-status-viewer.js

cp professor-v3/assets/js/feedback-tools.js \
   student-v3/assets/js/guidance-status-tools.js

cp professor-v3/assets/js/feedback-data.js \
   student-v3/assets/js/guidance-status-data.js

# 2. CSS 파일 복사
cp professor-v3/assets/css/feedback.css \
   student-v3/assets/css/guidance-status.css
```

### Step 2: 전역 검색 및 치환
각 파일에서 다음 패턴을 일괄 치환:

**guidance-status-list.js**
```
feedback-filter-         → student-guidance-filter-
feedback-list-           → student-guidance-list-
renderFeedbackList       → renderStudentGuidanceStatusList
searchFeedback           → searchStudentGuidanceStatus
resetFeedbackSearch      → resetStudentGuidanceStatusSearch
openFeedbackDetailScreen → openStudentGuidanceStatusDetail
FeedbackDataService      → StudentGuidanceDataService
```

**guidance-status-detail.js**
```
feedback-detail-screen         → student-guidance-detail-screen
openFeedbackDetailScreen       → openStudentGuidanceStatusDetail
closeFeedbackDetailScreen      → closeStudentGuidanceStatusDetail
completeFeedbackDetail         → (삭제)
FeedbackDataService            → StudentGuidanceDataService
```

**guidance-status-viewer.js**
```
initPDFViewer              → initStudentPDFViewer
renderGeneralThread        → renderStudentGeneralThread
addGeneralFeedback         → (삭제 - 학생은 댓글만 가능)
addGeneralReply            → addStudentGeneralReply
switchFeedbackTab          → switchStudentFeedbackTab
FeedbackDataService        → StudentGuidanceDataService
```

**guidance-status-tools.js**
```
initPDFViewer     → initStudentPDFViewer
setTool           → setStudentTool
setupFabricEvents → setupStudentFabricEvents
```

### Step 3: 권한 제한 적용

#### guidance-status-tools.js
```javascript
// Line 42-44: 도구 초기화 시 선택 도구만 활성화
function initStudentPDFViewer(requestId, pdfUrl, feedbackData) {
    // ... PDF 로드 ...

    // 🔒 학생용: 도구 버튼 제거
    document.getElementById('comment-tool')?.remove();
    document.getElementById('drawing-tool')?.remove();
    document.getElementById('highlight-tool')?.remove();
    document.getElementById('eraser-tool')?.remove();

    setStudentTool('select'); // 선택 도구만 활성화
}

// Line 246-306: 도구 설정 함수 제한
function setStudentTool(tool) {
    // 🔒 학생은 'select'만 허용
    if (tool !== 'select') {
        console.warn('학생은 선택 도구만 사용 가능합니다.');
        return;
    }
    // ... 기존 코드 ...
}
```

#### guidance-status-viewer.js
```javascript
// Line 678-698: 전체 평가 등록 함수 삭제
// function addStudentGeneralFeedback() { ... } ← 삭제

// Line 531-676: renderStudentGeneralThread() 수정
function renderStudentGeneralThread(requestId) {
    // ... 기존 코드 ...

    // 🔒 메인 평가의 수정 버튼 제거
    listEl.innerHTML = `
        <div class="general-main-feedback">
            <div id="general-main-display">
                <div class="p-3 border-2 border-[#F8BBD9] rounded-lg bg-[#FCE4EC]">
                    <div class="mb-2">${mainFeedback.text}</div>
                    <div class="text-[11px]">${timestamp}</div>
                    <!-- 🔒 수정 버튼 제거 -->
                </div>
            </div>
            <!-- 🔒 수정 모드 제거 -->
        </div>

        <!-- ✅ 댓글 영역 유지 -->
        <div class="general-replies">
            ...
            <textarea id="student-reply-textarea"></textarea>
            <button onclick="addStudentGeneralReply()">댓글 등록</button>
        </div>
    `;
}

// Line 753-777: 댓글 수정은 본인 것만 가능
function editStudentGeneralReply(index) {
    const reply = window._generalComments[requestId][index];

    // 🔒 본인 댓글인지 확인
    if (reply.authorId !== CURRENT_STUDENT.id) {
        alert('본인이 작성한 댓글만 수정할 수 있습니다.');
        return;
    }

    // ... 기존 수정 로직 ...
}
```

#### guidance-status-detail.js
```javascript
// Line 76-80: 피드백 완료 버튼 제거
screen.innerHTML = `
    <div class="px-6 py-3 border-b bg-white flex items-center justify-between">
        <button onclick="closeStudentGuidanceStatusDetail()">목록으로 돌아가기</button>
        <!-- 🔒 피드백 완료 버튼 제거 -->
    </div>
    ...
`;

// Line 340-405: completeFeedbackDetail 함수 삭제
// 학생용에서는 완전히 제거
```

### Step 4: HTML 수정 (student-dashboard.html)

```html
<!-- 1. 메뉴 추가 -->
<button onclick="showStudentScreen('guidance-status')"
        class="menu-item" data-screen="guidance-status">
    <span>논문 지도 현황</span>
</button>

<!-- 2. 화면 영역 추가 (3.4 검색 필터 참고) -->
<div id="guidance-status-screen" class="screen-content" style="display: none;">
    ...
</div>

<!-- 3. 스크립트 추가 -->
<script src="assets/js/guidance-status-data.js?v=20260107001"></script>
<script src="assets/js/guidance-status-list.js?v=20260107001"></script>
<script src="assets/js/guidance-status-detail.js?v=20260107001"></script>
<script src="assets/js/guidance-status-viewer.js?v=20260107001"></script>
<script src="assets/js/guidance-status-tools.js?v=20260107001"></script>

<!-- 4. CSS 추가 -->
<link rel="stylesheet" href="assets/css/guidance-status.css?v=20260107001">

<!-- 5. PDF.js 라이브러리 추가 -->
<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fabric@5.3.0/dist/fabric.min.js"></script>
```

### Step 5: 데이터 서비스 수정 (guidance-status-data.js)

```javascript
// 🔒 학생 ID를 전역 변수로 설정
const CURRENT_STUDENT = {
    id: 'S2024001',
    name: '김학생',
    studentNumber: '2024123456',
    role: 'student'
};

// 🔒 학생 본인의 제출물만 필터링
class StudentGuidanceDataService {
    static getStudentGuidanceRequests() {
        const allRequests = [...]; // Mock 데이터

        // 🔒 학생 본인의 제출물만 반환
        return allRequests.filter(req =>
            req.studentNumber === CURRENT_STUDENT.studentNumber
        );
    }

    // 나머지 메서드는 교수용과 동일
}
```

---

## 5. 테스트 체크리스트

### 5.1 목록 화면
- [ ] 검색 필터 11개 필드 정상 작동
- [ ] 학생 본인의 제출물만 표시
- [ ] 테이블 정렬 및 페이징 정상 작동
- [ ] 상세 화면 전환 정상 작동

### 5.2 상세 화면
- [ ] 페이지 전환 방식 정상 작동
- [ ] 뒤로가기 버튼 정상 작동
- [ ] PDF 로드 및 페이지 네비게이션 정상 작동
- [ ] 확대/축소 기능 정상 작동

### 5.3 권한 제한
- [ ] 도구 버튼(첨삭/판서/하이라이트/지우개) 표시되지 않음
- [ ] 선택 도구만 활성화
- [ ] 전체 평가 등록 버튼 표시되지 않음
- [ ] 전체 평가 수정 버튼 표시되지 않음
- [ ] 첨삭 영역 생성 불가능
- [ ] 판서/하이라이트 생성 불가능
- [ ] 피드백 완료 버튼 표시되지 않음

### 5.4 댓글 기능
- [ ] 전체 평가 댓글 작성 가능
- [ ] 전체 평가 댓글 수정 가능 (본인 것만)
- [ ] 첨삭 댓글 작성 가능
- [ ] 첨삭 댓글 수정 가능 (본인 것만)
- [ ] 댓글 작성자 표시 정확
- [ ] 댓글 타임스탬프 정확

### 5.5 읽기 전용
- [ ] 교수가 작성한 전체 평가 읽기 가능
- [ ] 교수가 작성한 첨삭 영역 읽기 가능
- [ ] 교수가 작성한 판서 읽기 가능
- [ ] 교수가 작성한 하이라이트 읽기 가능
- [ ] PDF 텍스트 선택 및 복사 가능

---

## 6. 향후 확장 고려사항

### 6.1 실시간 알림
- 교수가 피드백 완료 시 학생에게 알림
- 새 댓글 작성 시 실시간 알림

### 6.2 첨부파일
- 댓글에 파일 첨부 기능
- 이미지/문서 미리보기

### 6.3 모바일 최적화
- 터치 인터페이스 지원
- 반응형 레이아웃

---

## 7. 참고사항

### 7.1 주요 라이브러리
- **PDF.js 2.16.105**: PDF 렌더링
- **Fabric.js 5.3.0**: 캔버스 주석 처리

### 7.2 브라우저 호환성
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### 7.3 성능 고려사항
- PDF 페이지별 lazy loading
- 주석 데이터 최적화
- 캔버스 렌더링 최적화

---

**작성일**: 2026-01-07
**버전**: v1.0
**작성자**: Claude Sonnet 4.5
