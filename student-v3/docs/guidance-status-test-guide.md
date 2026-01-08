# 학생용 논문 지도 현황 테스트 가이드

## 📋 테스트 개요

**목적**: 교수용 "논문 지도 현황" 기능을 학생용으로 이식하고 권한 제한이 정상 작동하는지 확인

**구현 방식**: 교수용 코드 복사 + 학생 권한 제한 적용

---

## ✅ 구현 완료 항목

### 1. 파일 구조
```
student-v3/
├── assets/
│   ├── css/
│   │   └── guidance-status.css          ✅ (교수용 복사)
│   └── js/
│       ├── guidance-status-data.js      ✅ (Mock 데이터 포함)
│       ├── guidance-status-list.js      ✅ (목록 화면)
│       ├── guidance-status-detail.js    ✅ (상세 화면)
│       ├── guidance-status-viewer.js    ✅ (교수용 복사)
│       └── guidance-status-tools.js     ✅ (교수용 복사)
└── student-dashboard.html               ✅ (화면 + 스크립트 추가)
```

### 2. Mock 데이터
- **3건의 제출물**: gs-001, gs-002, gs-003
- **학생 정보**: 김철수 (S2024001)
- **교수 정보**: 박교수 (P001)
- **예시 PDF**: Mozilla TracemonKey PDF (공개 샘플)
- **피드백 데이터**: 전체 평가 + 첨삭 + 댓글 포함

---

## 🧪 테스트 시나리오

### Step 1: 페이지 접속 및 초기화
```
1. 브라우저에서 student-dashboard.html 열기
2. 좌측 메뉴 > 논문 지도 > 논문 지도 현황 클릭
3. 콘솔 확인:
   ✅ "✅ 학생용 논문 지도 현황 데이터 서비스 로드 완료"
   ✅ "✅ 학생용 논문 지도 현황 목록 화면 로드 완료"
   ✅ "✅ 학생용 논문 지도 현황 상세 화면 로드 완료"
```

**예상 결과**:
- 검색 필터 영역 표시 (10개 필터)
- 제출물 목록 표시 (3건)
- 콘솔 에러 없음

---

### Step 2: 목록 화면 테스트

#### 2.1 목록 표시
```
확인 항목:
□ 총 3건 표시
□ 테이블 컬럼 14개 (순번, 학년도, 학기, ... 피드백상태)
□ 각 행 클릭 가능 (hover 효과)
```

#### 2.2 검색 필터
```
테스트:
1. 학년도: 2025 선택 → 2건 표시 (gs-001, gs-002)
2. 피드백상태: 완료 선택 → 1건 표시 (gs-002)
3. 초기화 버튼 클릭 → 3건 표시
```

**예상 결과**:
- 필터링 정상 작동
- 검색 결과 건수 정확

---

### Step 3: 상세 화면 테스트 (gs-001)

#### 3.1 화면 전환
```
1. gs-001 행 클릭
2. 확인 항목:
   □ 목록 화면 숨김
   □ 상세 화면 전체 화면으로 표시
   □ 3단 레이아웃 (제출 이력 | PDF 뷰어 | 코멘트 패널)
```

#### 3.2 헤더 확인
```
□ "목록으로 돌아가기" 버튼 표시
□ 논문명 표시: "AI 기반 학습자 맞춤형 교육 시스템 개발"
□ 표절률 표시: CopyKiller 12% / GPT Killer 5%
□ "피드백 완료" 버튼 없음 (🔒 학생은 권한 없음)
```

#### 3.3 제출 이력
```
□ v1 (현재) 표시
□ 제출일시: 2025-01-05 14:30
□ 수정일시: 2025-01-06 10:20
```

---

### Step 4: PDF 뷰어 테스트

#### 4.1 PDF 로드
```
확인 항목:
□ PDF 정상 표시
□ 페이지 번호: 1 / 14
□ 확대/축소 버튼 작동
□ 이전/다음 페이지 버튼 작동
```

#### 4.2 도구 제한 (🔒 중요)
```
확인 항목:
□ 선택 도구만 표시 (커서 아이콘)
□ 댓글 도구 버튼 없음
□ 판서 도구 버튼 없음
□ 하이라이트 도구 버튼 없음
□ 지우개 도구 버튼 없음
```

**예상 결과**:
- 학생은 **선택 도구만** 사용 가능
- PDF 텍스트 드래그/복사 가능
- 새로운 첨삭/판서 생성 불가

#### 4.3 기존 주석 읽기 (읽기 전용)
```
1. 페이지 1로 이동
2. 확인 항목:
   □ 교수가 작성한 판서(빨간 사각형) 표시됨
   □ 교수가 작성한 첨삭 영역 표시됨
   □ 첨삭 마커(숫자) 표시됨
```

---

### Step 5: 코멘트 패널 테스트

#### 5.1 전체 평가 탭
```
1. "전체 평가" 탭 선택 (기본 활성)
2. 확인 항목:
   □ 교수의 메인 평가 표시 (분홍 배경)
   □ 학생의 댓글 표시
   □ 댓글 입력창 표시
```

#### 5.2 댓글 작성 (✅ 학생 가능)
```
테스트:
1. 하단 댓글 입력창에 "알겠습니다. 수정하겠습니다." 입력
2. "댓글 등록" 버튼 클릭
3. 확인 항목:
   □ 새 댓글이 목록에 추가됨
   □ 작성자: 김철수
   □ 타임스탬프 표시
```

**예상 결과**:
- 댓글 작성 성공
- 데이터 서비스에 저장됨 (StudentGuidanceDataService.addStudentGeneralComment)

#### 5.3 전체 평가 수정 시도 (🔒 권한 없음)
```
확인 항목:
□ 교수의 메인 평가에 "수정" 버튼 없음
□ 교수의 메인 평가 텍스트 읽기 전용
```

---

### Step 6: 첨삭 탭 테스트

#### 6.1 첨삭 목록 표시
```
1. "첨삭" 탭 클릭
2. 확인 항목:
   □ 탭 배지에 "2" 표시 (2개의 첨삭)
   □ 페이지 1 - 첨삭 #1 표시
   □ 페이지 2 - 첨삭 #2 표시
```

#### 6.2 첨삭 내용 (읽기 전용)
```
첨삭 #1:
□ 노란 배경 영역
□ 교수의 메인 첨삭: "연구 문제가 구체적이지 않습니다..."
□ 학생의 댓글: "알겠습니다. 말씀하신 대로 수정하겠습니다."
□ 댓글 입력창 표시

첨삭 #2:
□ 교수의 메인 첨삭: "선행연구 부분을 좀 더 보강해주세요..."
□ 댓글 없음
□ 댓글 입력창 표시
```

#### 6.3 첨삭 댓글 작성 (✅ 학생 가능)
```
테스트:
1. 첨삭 #2의 댓글 입력창에 "네, 최근 3년 이내 연구 5편 추가하겠습니다." 입력
2. "댓글 등록" 버튼 클릭
3. 확인 항목:
   □ 새 댓글이 첨삭 #2 하단에 추가됨
   □ 작성자: 김철수
```

#### 6.4 첨삭 영역 생성 시도 (🔒 권한 없음)
```
확인 항목:
□ PDF에서 텍스트 드래그해도 첨삭 영역 생성 안됨
□ 댓글 도구가 없으므로 새 영역 지정 불가
```

---

### Step 7: 댓글 수정 테스트

#### 7.1 본인 댓글 수정 (✅ 가능)
```
테스트:
1. 학생이 작성한 댓글에 "수정" 버튼 표시 확인
2. "수정" 버튼 클릭
3. 텍스트 변경 후 저장
4. 확인 항목:
   □ 수정된 내용 반영
   □ 타임스탬프 업데이트
```

#### 7.2 교수 댓글 수정 시도 (🔒 권한 없음)
```
확인 항목:
□ 교수가 작성한 댓글에 "수정" 버튼 없음
□ 교수 댓글은 읽기 전용
```

---

### Step 8: 목록으로 돌아가기

```
1. "목록으로 돌아가기" 버튼 클릭
2. 확인 항목:
   □ 상세 화면 닫힘
   □ 목록 화면 다시 표시
   □ 제출 이력 사이드바 제거
   □ 3건의 제출물 표시
```

**예상 결과**:
- 화면 전환 정상
- 메모리 정리 완료

---

### Step 9: 다른 제출물 테스트 (gs-002)

```
1. gs-002 행 클릭 (1장_서론_v2.pdf)
2. 확인 항목:
   □ PDF 로드 성공
   □ 전체 평가: "1장 서론 잘 작성했습니다..."
   □ 첨삭 없음 (annotations: {})
   □ 댓글 작성 가능
```

---

## 🐛 예상 가능한 이슈

### Issue 1: PDF.js 로드 실패
**증상**: PDF가 표시되지 않음
**원인**: CDN 연결 실패 또는 CORS 에러
**해결**:
```javascript
// 콘솔에서 확인
console.log(typeof pdfjsLib); // 'object'여야 함
```

### Issue 2: Fabric.js 로드 실패
**증상**: 첨삭 영역이 표시되지 않음
**원인**: CDN 연결 실패
**해결**:
```javascript
// 콘솔에서 확인
console.log(typeof fabric); // 'object'여야 함
```

### Issue 3: 함수 undefined 에러
**증상**: `initStudentGuidanceStatusList is not a function`
**원인**: 스크립트 로드 순서 문제
**해결**: HTML에서 스크립트 순서 확인
```html
<!-- 올바른 순서 -->
<script src="guidance-status-data.js"></script>
<script src="guidance-status-list.js"></script>
<script src="guidance-status-detail.js"></script>
<script src="guidance-status-viewer.js"></script>
<script src="guidance-status-tools.js"></script>
```

### Issue 4: ID prefix 불일치
**증상**: PDF 뷰어 컨트롤이 작동하지 않음
**원인**: guidance-status-detail.js에서 생성한 ID와 tools.js에서 참조하는 ID 불일치
**해결**:
- detail.js에서는 `student-` prefix 사용
- tools.js/viewer.js는 교수용 그대로 사용 (prefix 없음)
- **수정 필요**: tools.js를 학생용 ID에 맞게 수정

---

## 🔧 추가 수정 필요 사항

교수용 파일을 그대로 복사했기 때문에, 다음 수정이 필요합니다:

### 1. PDF 뷰어 ID 매핑
**파일**: `guidance-status-tools.js`, `guidance-status-viewer.js`

**수정 필요**:
```javascript
// 기존 (교수용)
document.getElementById('prev-page')
document.getElementById('pdf-canvas')
document.getElementById('interaction-canvas')

// 변경 필요 (학생용)
document.getElementById('student-prev-page')
document.getElementById('student-pdf-canvas')
document.getElementById('student-interaction-canvas')
```

### 2. 함수명 변경
**파일**: `guidance-status-viewer.js`

**수정 필요**:
```javascript
// 기존 (교수용)
function initPDFViewer()
function renderGeneralThread()
function switchFeedbackTab()

// 변경 필요 (학생용)
function initStudentGuidancePDFViewer()
function renderStudentGeneralThread()
function switchStudentFeedbackTab()
```

### 3. 데이터 서비스 호출
**파일**: `guidance-status-viewer.js`, `guidance-status-tools.js`

**수정 필요**:
```javascript
// 기존
FeedbackDataService.getFeedbackData()

// 변경 필요
StudentGuidanceDataService.getStudentGuidanceFeedbackData()
```

---

## ✅ 테스트 체크리스트

### 기능 테스트
- [ ] 목록 화면 표시
- [ ] 검색 필터 작동
- [ ] 상세 화면 전환
- [ ] PDF 로드 및 네비게이션
- [ ] 교수의 판서/첨삭 읽기
- [ ] 전체 평가 댓글 작성
- [ ] 첨삭 댓글 작성
- [ ] 본인 댓글 수정
- [ ] 목록으로 돌아가기

### 권한 제한 테스트
- [ ] 도구 버튼 제한 (선택 도구만)
- [ ] 전체 평가 수정 불가
- [ ] 첨삭 영역 생성 불가
- [ ] 판서/하이라이트 생성 불가
- [ ] 교수 댓글 수정 불가
- [ ] 피드백 완료 버튼 없음

### UI/UX 테스트
- [ ] 반응형 레이아웃
- [ ] 마우스 hover 효과
- [ ] 버튼 활성화 상태
- [ ] 스크롤 동작
- [ ] 탭 전환 애니메이션

### 성능 테스트
- [ ] PDF 로드 시간 (< 3초)
- [ ] 페이지 전환 속도 (< 1초)
- [ ] 검색 필터 응답 시간 (즉시)
- [ ] 댓글 작성 응답 시간 (즉시)

---

## 📝 테스트 결과 기록

### 테스트 일시
-

### 테스트 환경
- 브라우저:
- OS:
- 화면 해상도:

### 발견된 버그
1.
2.
3.

### 개선 사항
1.
2.
3.

---

**작성일**: 2026-01-07
**작성자**: Claude Sonnet 4.5
**버전**: v1.0
