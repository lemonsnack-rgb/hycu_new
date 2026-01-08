# 학생용 논문 지도 현황 업데이트 완료 보고

## 📅 작업 일시
**2026-01-08**

---

## ✅ 완료된 작업

### 1. 표절률 정보 제거 (학생 권한 제한)

**파일**: `student-v3/assets/js/guidance-status-detail.js`

**변경 내용**:
- 논문 정보 영역에서 CopyKiller 및 GPT Killer 표절률 표시 제거
- "결과보고서(통합)" 링크 제거
- 주석 추가: "🔒 학생은 표절률 정보를 볼 수 없음 (교수/관리자만)"

**변경 라인**: 102-110

**이유**: 표절률 정보는 교수 및 관리자만 확인할 수 있는 민감한 정보로, 학생에게는 노출되지 않아야 함.

---

### 2. 댓글 입력 기능 수정

#### 2.1 데이터 매핑 로직 추가

**파일**: `student-v3/assets/js/guidance-status-detail.js`

**변경 내용** (라인 75-85):
```javascript
// Mock 데이터의 generalFeedbackThread를 window._generalComments로 매핑
if (feedbackData && feedbackData.generalFeedbackThread) {
    window._generalComments = window._generalComments || {};
    window._generalComments[requestId] = feedbackData.generalFeedbackThread.map(item => ({
        ...item,
        text: item.text,
        ts: item.ts || new Date(item.timestamp).getTime(),
        attach: item.attachments || []
    }));
    console.log('✅ 전체 평가 데이터 매핑 완료:', window._generalComments[requestId]);
}
```

**중요성**:
- 교수용에서 복사한 `guidance-status-viewer.js`는 `window._generalComments` 형식을 기대함
- Mock 데이터는 `generalFeedbackThread` 배열로 제공됨
- 이 매핑이 없으면 댓글이 렌더링되지 않고 입력창도 표시되지 않음

#### 2.2 댓글 입력 스타일 추가

**파일**: `student-v3/assets/css/guidance-status.css`

**추가 내용** (라인 773-794):
```css
/* 댓글 입력창 스타일 */
.general-reply-input {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
}

.general-reply-input textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    resize: vertical;
    min-height: 60px;
}

.general-reply-input textarea:focus {
    outline: none;
    border-color: #6A0028;
    box-shadow: 0 0 0 3px rgba(106, 0, 40, 0.1);
}
```

**결과**:
- ✅ 학생이 전체 평가에 댓글 작성 가능
- ✅ 학생이 첨삭에 댓글 작성 가능
- ✅ 본인 댓글 수정 가능
- ✅ 여러 개의 댓글 입력 가능

---

### 3. 논문 지도 요청 버튼 및 모달 추가

**파일**: `student-v3/assets/js/guidance-status-list.js`

#### 3.1 버튼 추가 (라인 34-42)

**위치**: 목록 화면 헤더 오른쪽 상단

```html
<button onclick="showStudentGuidanceRequestModal()"
        class="btn-primary"
        style="background: #6A0028; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
    <i class="fas fa-plus"></i>
    <span>논문 지도 요청</span>
</button>
```

#### 3.2 모달 구현 (라인 251-372)

**기능**:
1. `showStudentGuidanceRequestModal()` - 모달 표시
2. `submitStudentGuidanceRequest(event)` - 요청 제출 처리
3. `closeStudentGuidanceRequestModal()` - 모달 닫기

**입력 필드**:
- 논문 제목 (필수)
- 논문 진행 단계 (필수) - 드롭다운:
  - 연구계획서
  - 중간논문
  - 최종논문
  - 기타
- 첨부파일 (필수) - PDF만 허용, 최대 30MB

**유효성 검증**:
- 파일 선택 필수
- 파일 크기 제한: 30MB
- 파일 형식 제한: PDF만 허용

**안내사항**:
- 한 번에 하나의 파일만 업로드 가능
- PDF 파일만 업로드 가능하며, 최대 용량은 30MB
- 교수님의 피드백은 영업일 기준 3-5일 소요

**참고**: 기존 `hycu_new/student/student-dashboard.html` 및 `feedback.js`의 구현을 참고하여 동일한 구조로 구현

---

## 🔍 구현 방식

### 기존 시스템 참고

**참고 파일**:
- `hycu_new/student/student-dashboard.html` (라인 45)
- `hycu_new/student/assets/js/feedback.js` (라인 96-202)

**구현 전략**:
1. 기존 학생용 시스템의 "피드백 요청" 기능 분석
2. 동일한 UI/UX 패턴 및 데이터 구조 사용
3. Student-v3 디자인 시스템에 맞게 스타일 조정

---

## 📊 변경 사항 요약

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 표절률 표시 | ✅ 표시됨 (CopyKiller, GPT Killer) | ❌ 제거됨 (학생은 볼 수 없음) |
| 댓글 입력창 | ❌ 표시 안됨 (데이터 매핑 누락) | ✅ 표시됨 (매핑 로직 추가) |
| 댓글 작성 | ❌ 불가능 | ✅ 가능 (여러 개 작성 가능) |
| 논문 지도 요청 버튼 | ❌ 없음 | ✅ 추가됨 (목록 헤더 우측) |
| 요청 모달 | ❌ 없음 | ✅ 구현됨 (제목, 단계, 파일 업로드) |

---

## 🎯 권한 체계

### 학생 가능 (✅)
- 제출물 목록 조회
- 검색 필터 사용
- PDF 뷰어 (읽기 전용)
- 교수의 전체 평가 읽기
- 교수의 첨삭/판서 읽기
- **전체 평가 댓글 작성/수정** (본인 것만)
- **첨삭 댓글 작성/수정** (본인 것만)
- **논문 지도 요청** (새로운 피드백 요청)

### 학생 불가능 (🔒)
- ~~표절률 정보 조회~~ (교수/관리자만)
- 전체 평가 등록/수정
- 첨삭 영역 생성
- 판서 (Drawing) 생성
- 하이라이트 생성
- 주석 삭제
- 피드백 완료 처리

---

## 🧪 테스트 가이드

### 1. 표절률 제거 확인
1. 논문 지도 현황 목록에서 항목 클릭
2. 상세 화면 상단 헤더 확인
3. ✅ 표절률 정보가 표시되지 않아야 함
4. ✅ "결과보고서(통합)" 링크가 없어야 함

### 2. 댓글 기능 테스트
1. 상세 화면 > "전체 평가" 탭 선택
2. ✅ 교수의 메인 평가 표시 확인
3. ✅ 하단에 댓글 입력창 표시 확인
4. 댓글 작성 후 "댓글 등록" 클릭
5. ✅ 댓글이 목록에 추가되는지 확인
6. "첨삭" 탭에서도 동일하게 테스트

### 3. 논문 지도 요청 테스트
1. 논문 지도 현황 목록 화면 접속
2. ✅ 우측 상단에 "논문 지도 요청" 버튼 표시 확인
3. 버튼 클릭 → 모달 표시 확인
4. 필수 필드 입력:
   - 논문 제목: "테스트 논문"
   - 논문 진행 단계: "연구계획서"
   - 첨부파일: 30MB 이하 PDF
5. "요청하기" 클릭
6. ✅ "논문 지도 요청이 완료되었습니다" 알림 확인

### 4. 유효성 검증 테스트
1. 파일 없이 제출 시도 → "파일을 선택해주세요" 알림
2. 30MB 초과 파일 업로드 → "파일 크기는 30MB를 초과할 수 없습니다" 알림
3. PDF 이외 파일 업로드 → "PDF 파일만 업로드 가능합니다" 알림

---

## 📁 수정된 파일 목록

### JavaScript 파일
1. **student-v3/assets/js/guidance-status-detail.js**
   - 표절률 정보 제거 (라인 102-110)
   - 데이터 매핑 로직 추가 (라인 75-85)

2. **student-v3/assets/js/guidance-status-list.js**
   - 논문 지도 요청 버튼 추가 (라인 34-42)
   - 요청 모달 함수 구현 (라인 251-372)

### CSS 파일
3. **student-v3/assets/css/guidance-status.css**
   - 댓글 입력창 스타일 추가 (라인 773-794)

---

## 🔧 기술 세부사항

### 데이터 흐름

```
Mock Data Service (generalFeedbackThread)
           ↓
Data Mapping (guidance-status-detail.js)
           ↓
window._generalComments[requestId]
           ↓
Viewer Rendering (guidance-status-viewer.js)
           ↓
Comment Input Area Displayed
```

### 모달 구현 패턴

```javascript
// 1. 모달 생성 (DOM 요소로 동적 생성)
const modal = document.createElement("div");
modal.className = "modal-backdrop active";
modal.id = "student-guidance-request-modal";

// 2. 모달 HTML 구성 (innerHTML)
modal.innerHTML = `...`;

// 3. body에 추가
document.body.appendChild(modal);

// 4. 제출 핸들러 연결
form.onsubmit = submitStudentGuidanceRequest(event);

// 5. 닫기 시 DOM에서 제거
modal.remove();
```

---

## ⚠️ 알려진 제한사항

### 1. Mock 데이터 사용
- 현재는 클라이언트 사이드 Mock 데이터 사용
- 실제 백엔드 API 연동 필요
- 파일 업로드는 console.log로만 처리됨

### 2. ID Prefix 불일치 (기존 이슈)
- `guidance-status-tools.js`와 `guidance-status-viewer.js`는 여전히 교수용 ID 사용
- `student-` prefix 통일 작업 필요 (이전 보고서 참조)

---

## 📝 다음 단계 (권장)

### 우선순위 1: 백엔드 연동
1. 논문 지도 요청 API 연동
   - POST /api/student/guidance-requests
   - 파일 업로드 처리 (multipart/form-data)
   - 응답 처리 및 에러 핸들링

2. 댓글 저장 API 연동
   - POST /api/student/guidance/comments
   - PUT /api/student/guidance/comments/{id}

### 우선순위 2: ID Prefix 통일
- `guidance-status-tools.js` 수정
- `guidance-status-viewer.js` 수정
- 함수명 학생용 prefix 추가

### 우선순위 3: 사용자 경험 개선
- 파일 업로드 진행률 표시
- 업로드 중 로딩 스피너
- 성공/실패 토스트 알림
- 파일 미리보기 기능

---

## 🎓 구현 교훈

### 성공 요인
1. **기존 시스템 참조**: 원본 학생용 코드를 분석하여 동일한 UX 패턴 유지
2. **데이터 매핑 전략**: 교수용 viewer 재사용하면서 데이터 형식 변환 처리
3. **권한 분리**: UI 레벨에서 학생 권한 명확히 제한

### 개선 필요
1. **네임스페이스 전략**: 처음부터 student- prefix 통일 필요
2. **공통 모듈화**: 데이터 서비스, 유틸리티 함수 공통 모듈로 분리
3. **TypeScript 도입**: 인터페이스 정의로 데이터 형식 불일치 방지

---

## 📞 참고 문서

- [구현 완료 보고서](guidance-status-completion-summary.md)
- [테스트 가이드](guidance-status-test-guide.md)
- [구현 계획서](guidance-status-implementation-plan.md)

---

**작성일**: 2026-01-08
**작성자**: Claude Sonnet 4.5
**버전**: v1.1
**상태**: ✅ 업데이트 완료 (댓글 기능 + 논문 지도 요청 버튼 추가)
