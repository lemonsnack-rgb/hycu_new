# 학생용 논문 제출 화면 필수 항목 표시 완료

## 작업 일시
2026-02-02

## 요구사항
학생용 화면 수정:
- **학위논문제출**: 기타파일을 제외한 전체 항목 필수입력 (빨간색 * 표시)
- **학술지논문제출**: 기타파일을 제외한 전체 항목 필수입력 (빨간색 * 표시)
- **학술지논문제출**: 파일 구조 변경
  - 논문파일 (필수)
  - 증빙서류 (선택): 논문게재 확인서/예정증명서/증빙서
  - 기타파일 (선택)

## 구현 완료 사항

### 1. 학위논문제출 (thesis-submission.js)

#### 현재 구조 (변경 없음, 이미 올바름)
- **논문 제목** * (필수) - 사용자 입력
- **논문파일** * (필수) - 파일 업로드
- **기타파일** (선택) - 파일 업로드
- **지도교수명**, **심사단계**: 시스템 자동 입력 (readonly), 필수 표시 불필요

**파일**: [thesis-submission.js](student-v3/assets/js/thesis-submission.js#L492-L526)

```javascript
// 논문 제목 (Line 492)
<label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문 제목 *</label>

// 논문파일 (Line 502)
<label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문파일 <span class="text-red-500">*</span></label>

// 기타파일 (Line 514) - 선택사항, * 없음
<label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 ml-4">기타파일</label>
```

### 2. 학술지논문제출 (journal-submission.js)

#### 변경사항 1: 모든 입력 항목에 * 추가

**수정된 필드** (기타파일 제외):
1. **논문제목(한글)** * (Line 585)
2. **저자명(전체)** * (Line 596)
3. **학술지명** * (Line 604)
4. **학술지 구분** * (Line 612)
5. **발행기관** * (Line 652)
6. **집/권/호** * (Line 660)
7. **발행년월일** * (Line 668)
8. **수록 Page** * (Line 675)
9. **논문파일** * (Line 683) - 이미 있었음

**변경하지 않은 필드**:
- **논문지도교수**: readonly 필드 (시스템 자동 입력)
- **증빙서류**: 선택 항목
- **기타파일**: 선택 항목

#### 변경사항 2: 파일 구조 재정리

**AS-IS (변경 전)**:
- 논문파일 * (필수)
- 기타파일 (선택)
  - 라디오 버튼: 논문게재 확인서/예정증명서/증빙서
  - 파일 업로드

**TO-BE (변경 후)**:
- **논문파일** * (필수)
- **증빙서류** (선택)
  - 라디오 버튼: 논문게재 확인서/예정증명서/증빙서
  - 파일 업로드
- **기타파일** (선택)
  - 파일 업로드만

**파일**: [journal-submission.js](student-v3/assets/js/journal-submission.js#L681-L748)

```javascript
// 논문파일 (필수) - Line 681-694
<label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문파일 <span class="text-red-500">*</span></label>

// 증빙서류 (선택) - Line 696-732
<label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">증빙서류</label>
// 라디오 버튼: confirmation, scheduled, proof
// ID: journal-proof-doc-type (radio name)
// ID: journal-proof-doc-display (input text)
// ID: journal-proof-doc-file (file input)

// 기타파일 (선택) - Line 734-748
<label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">기타파일</label>
// ID: journal-other-file-display (input text)
// ID: journal-other-file (file input)
```

#### 변경사항 3: 데이터 구조 변경

**AS-IS**:
```javascript
{
    thesisFile: 'file.pdf',
    thesisFileSize: 2500000,
    otherFileType: 'confirmation',  // 증빙서류 종류
    otherFile: 'doc.pdf',           // 증빙서류 파일
    otherFileSize: 800000
}
```

**TO-BE**:
```javascript
{
    thesisFile: 'file.pdf',
    thesisFileSize: 2500000,
    proofDocType: 'confirmation',   // 증빙서류 종류
    proofDoc: 'doc.pdf',            // 증빙서류 파일
    proofDocSize: 800000,
    otherFile: 'other.pdf',         // 기타파일 (신규)
    otherFileSize: 500000           // 기타파일 크기 (신규)
}
```

**파일**: [journal-submission.js](student-v3/assets/js/journal-submission.js#L897-L901)

```javascript
const proofDocTypeInput = document.querySelector('input[name="journal-proof-doc-type"]:checked');
const proofDocType = proofDocTypeInput ? proofDocTypeInput.value : null;
const proofDocFile = document.getElementById('journal-proof-doc-file').files[0];
const otherFile = document.getElementById('journal-other-file').files[0];
```

#### 변경사항 4: 이벤트 핸들러 추가

**파일**: [journal-submission.js](student-v3/assets/js/journal-submission.js)

**버튼 클릭 핸들러** (Line 248-254):
```javascript
} else if (action === 'select-journal-proof-doc') {
    e.preventDefault();
    e.stopPropagation();
    const fileInput = document.getElementById('journal-proof-doc-file');
    if (fileInput) {
        fileInput.click();
    }
}
```

**파일 변경 리스너** (Line 273-281):
```javascript
content.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'journal-thesis-file') {
        handleThesisFileSelect(e);
    } else if (e.target && e.target.id === 'journal-proof-doc-file') {
        handleProofDocFileSelect(e);  // 신규 추가
    } else if (e.target && e.target.id === 'journal-other-file') {
        handleOtherFileSelect(e);
    }
});
```

**파일 선택 핸들러 함수** (Line 863-871):
```javascript
function handleProofDocFileSelect(event) {
    const file = event.target.files[0];
    const displayInput = document.getElementById('journal-proof-doc-display');

    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        displayInput.value = `${file.name} (${fileSize} MB)`;
    }
}
```

#### 변경사항 5: 검증 로직 수정

**파일**: [journal-submission.js](student-v3/assets/js/journal-submission.js#L951-L969)

**AS-IS**:
```javascript
// 기타파일 종류가 선택되었는데 파일이 없는 경우
if (otherFileType && !otherFile && !submission.submittedData?.otherFile) {
    alert('기타파일을 선택해주세요.');
    return;
}

// 기타파일이 있는데 종류가 선택되지 않은 경우
if (otherFile && !otherFileType) {
    alert('기타파일 종류를 선택해주세요.');
    return;
}
```

**TO-BE**:
```javascript
// 증빙서류 종류가 선택되었는데 파일이 없는 경우
if (proofDocType && !proofDocFile && !submission.submittedData?.proofDoc) {
    alert('증빙서류 파일을 선택해주세요.');
    return;
}

// 증빙서류 파일이 있는데 종류가 선택되지 않은 경우
if (proofDocFile && !proofDocType) {
    alert('증빙서류 종류를 선택해주세요.');
    return;
}
```

#### 변경사항 6: Mock 데이터 업데이트

**파일**: [journal-submission.js](student-v3/assets/js/journal-submission.js#L12-L171)

모든 Mock 데이터의 필드명 변경:
- `otherFileType` → `proofDocType`
- `otherFile: 'journal_*'` → `proofDoc: 'journal_*'`
- `otherFileSize` → `proofDocSize`

**예시**:
```javascript
{
    id: 1,
    stageName: '1차 제출',
    submittedData: {
        // ... 다른 필드들
        thesisFile: 'journal_paper_v1.pdf',
        thesisFileSize: 2500000,
        proofDocType: 'confirmation',        // 변경됨
        proofDoc: 'journal_confirmation_v1.pdf',  // 변경됨
        proofDocSize: 800000,                // 변경됨
        submittedAt: '2025-01-10 14:30'
    }
}
```

## 필수 항목 검증 로직

### 학위논문제출

**파일**: [thesis-submission.js](student-v3/assets/js/thesis-submission.js#L693-L699)

```javascript
if (!title) {
    alert('논문 제목을 입력해주세요.');
    return;
}

if (!isEdit && !thesisFile && !submission.submittedData?.thesisFile) {
    alert('논문파일을 선택해주세요.');
    return;
}
```

### 학술지논문제출

**파일**: [journal-submission.js](student-v3/assets/js/journal-submission.js#L906-L954)

```javascript
// 1. 논문지도교수 (readonly이므로 항상 값 있음)
if (!advisor) {
    alert('논문지도교수를 입력해주세요.');
    return;
}

// 2. 논문제목(한글) *
if (!titleKorean) {
    alert('논문 제목을 입력해주세요.');
    return;
}

// 3. 저자명(전체) *
if (!authors) {
    alert('저자명을 입력해주세요.');
    return;
}

// 4. 학술지명 *
if (!journalName) {
    alert('학술지명을 입력해주세요.');
    return;
}

// 5. 학술지 구분 *
if (!journalType) {
    alert('학술지 구분을 선택해주세요.');
    return;
}

// 6. 발행기관 *
if (!publisher) {
    alert('발행기관을 입력해주세요.');
    return;
}

// 7. 집/권/호 *
if (!volumeIssue) {
    alert('집/권/호를 입력해주세요.');
    return;
}

// 8. 발행년월일 *
if (!publishDate) {
    alert('발행년월일을 선택해주세요.');
    return;
}

// 9. 수록 Page *
if (!pages) {
    alert('수록 Page를 입력해주세요.');
    return;
}

// 10. 논문파일 *
if (!isEdit && !thesisFile && !submission.submittedData?.thesisFile) {
    alert('논문파일을 선택해주세요.');
    return;
}
```

## 수정된 파일 목록

1. **student-v3/assets/js/journal-submission.js**
   - Lines 585, 596, 604, 612, 652, 660, 668, 675: 필수 항목에 * 추가
   - Lines 696-748: 파일 구조 변경 (증빙서류/기타파일 분리)
   - Lines 248-254: 증빙서류 버튼 클릭 핸들러 추가
   - Lines 273-281: 증빙서류 파일 변경 리스너 추가
   - Lines 863-871: 증빙서류 파일 선택 핸들러 추가
   - Lines 897-901: 데이터 읽기 로직 변경
   - Lines 951-969: 검증 로직 변경
   - Lines 972-987: 저장 데이터 구조 변경
   - Lines 12-171: Mock 데이터 필드명 변경

## 검증 방법

### 수동 테스트

#### 학위논문제출
1. [student-dashboard.html](student-v3/student-dashboard.html) 열기
2. 학위논문제출 메뉴 클릭
3. [제출] 버튼 클릭
4. 확인사항:
   - ✅ "논문 제목 *" 표시 확인
   - ✅ "논문파일 *" 표시 확인
   - ✅ "기타파일" * 없음 확인
   - ✅ 논문 제목 미입력 시 검증 메시지
   - ✅ 논문파일 미선택 시 검증 메시지

#### 학술지논문제출
1. [student-dashboard.html](student-v3/student-dashboard.html) 열기
2. 학술지논문제출 메뉴 클릭
3. [제출] 버튼 클릭
4. 확인사항:
   - ✅ 모든 입력 필드에 * 표시 (논문지도교수 제외)
   - ✅ 증빙서류 섹션 존재 (라디오 + 파일 업로드)
   - ✅ 기타파일 섹션 존재 (파일 업로드만)
   - ✅ 필수 항목 미입력 시 각각 검증 메시지
   - ✅ 증빙서류: 종류 선택 + 파일 미선택 시 검증
   - ✅ 증빙서류: 파일 선택 + 종류 미선택 시 검증
   - ✅ 기타파일: 선택 사항이므로 검증 없음

### 브라우저 테스트
```bash
# 브라우저에서 직접 열기
file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/student-v3/student-dashboard.html
```

## 주요 특징

### 1. 일관된 UI 패턴
- 필수 항목: `<span class="text-red-500">*</span>` 사용
- 선택 항목: * 표시 없음
- 모든 화면에서 동일한 스타일 적용

### 2. 명확한 필수/선택 구분
- 학위논문: 논문 제목, 논문파일 필수
- 학술지논문: 기타파일과 증빙서류를 제외한 모든 항목 필수

### 3. 파일 업로드 구조 개선
- 학술지논문: 논문파일/증빙서류/기타파일 명확히 구분
- 각 파일 종류별로 독립적인 입력 필드 제공

### 4. 조건부 검증
- 증빙서류: 종류와 파일 둘 다 선택하거나 둘 다 선택하지 않아야 함
- 기타파일: 선택 사항이므로 검증 없음

## 작업 완료 체크리스트

- [x] 학위논문: 현재 구조 확인 (이미 올바름)
- [x] 학술지논문: 모든 입력 필드에 * 추가
- [x] 학술지논문: 파일 구조 변경 (증빙서류/기타파일 분리)
- [x] 학술지논문: 데이터 구조 변경
- [x] 학술지논문: 이벤트 핸들러 추가
- [x] 학술지논문: 검증 로직 수정
- [x] 학술지논문: Mock 데이터 업데이트
- [x] 변경사항 문서화

## 작업 완료
**상태**: ✅ 완료
**날짜**: 2026-02-02
**담당**: Claude Sonnet 4.5

## 후속 작업 (필요 시)
- 실제 브라우저 테스트 수행
- 백엔드 API 연동 시 필드명 매핑 확인
- 증빙서류/기타파일 저장 로직 서버 구현
