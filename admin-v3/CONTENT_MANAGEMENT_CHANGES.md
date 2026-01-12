# 콘텐츠 관리 시스템 수정 완료

## ✅ 수정 완료 사항

### 1. [admin_views.js](admin-v3/assets/js/admin_views.js) (5303-5411행)
**변경**: 학과별 등록 현황 테이블 → 공지사항과 동일한 목록 테이블

#### 수정 전
```javascript
<table>
  <th>학과</th>
  <th>등록 현황</th>
  <th>최종 수정일</th>
  <th>수정자</th>
  <th>관리</th>
</table>
```

#### 수정 후
```javascript
<div class="table-container">
  <div class="table-header">
    <h3>연구윤리 목록</h3>
    <button>신규 등록</button>
  </div>
  <table>
    <th>순번</th>
    <th>제목</th>
    <th>대상학과</th>
    <th>작성일</th>
    <th>작성자</th>
    <th>관리</th>
  </table>
</div>
```

---

### 2. [content-list-management.js](admin-v3/assets/js/content-list-management.js) (전체 재작성)
**변경**: 학과별 목록 순회 → 등록된 콘텐츠만 렌더링

#### 주요 변경
- ❌ 삭제: `createContent(department)` - 학과별 등록 버튼
- ✅ 추가: `showCreateForm()` - 신규 등록 버튼 (상단)
- ✅ 변경: `loadContentList()` - 등록된 항목만 표시
- ✅ 변경: `getDepartmentDisplay()` - visibility/targetDepartments 지원
- ✅ 변경: `editContent(contentId)` - ID 기반 수정
- ✅ 변경: `deleteContent(contentId)` - ID 기반 삭제

#### 데이터 흐름
```
getContentList(type)
  → contentList 배열
  → forEach로 테이블 렌더링
```

---

### 3. [content-management.js](admin-v3/assets/js/content-management.js) (전체 재작성)
**변경**: 학과 표시만 → 공지사항과 동일한 등록/수정 폼

#### 주요 변경
- ✅ 추가: 제목 입력 필드
- ✅ 추가: 학과 선택 UI (라디오 버튼 + 체크박스)
  - 전체 공개 / 특정 학과만 공개
- ✅ 변경: `showEditForm(contentType, contentId)` - department 매개변수 제거
- ✅ 변경: `saveContent()` - visibility/targetDepartments 저장
- ✅ 추가: `toggleDepartmentSelection()` - 학과 체크박스 토글

#### 폼 구조 (공지사항과 동일)
```html
<form>
  <!-- 제목 -->
  <input type="text" id="content-title">

  <!-- 학과 선택 -->
  <input type="radio" name="visibility" value="all">
  <input type="radio" name="visibility" value="specific">
  <div id="department-checkboxes">
    체크박스들...
  </div>

  <!-- 에디터 -->
  <div contenteditable="true">...</div>
</form>
```

---

### 4. [content-data.js](admin-v3/assets/js/content-data.js) (데이터 구조 변경)
**변경**: 학과별 단일 콘텐츠 → 공지사항 방식 목록

#### 데이터 구조 변경
```javascript
// 변경 전 (학과별 1개 제약)
{
  id: 'ethics_all',
  department: 'all',
  title: '연구윤리',
  content: '...',
  lastModified: '2025-01-06',
  modifiedBy: 'admin'
}

// 변경 후 (공지사항 방식)
{
  id: 'ethics_001',
  title: '연구윤리',
  author: 'admin',
  visibility: 'all',
  targetDepartments: ['all'],
  createdAt: '2025-01-06',
  content: '...'
}
```

#### 함수 변경
- ✅ 변경: `saveContentItem()` - createdAt 추가, ID 생성 방식 변경
- ✅ 변경: `checkDuplicateContent()` - 항상 false 반환 (중복 허용)

---

## 🎯 테스트 체크리스트

### 목록 화면 테스트
- [ ] "연구윤리 목록" 화면에 등록된 콘텐츠만 표시되는가?
- [ ] 우측 상단에 "신규 등록" 버튼이 있는가?
- [ ] 총 건수가 올바르게 표시되는가?
- [ ] 대상학과가 "전체 공개" 또는 학과명으로 표시되는가?
- [ ] 수정/삭제 버튼이 각 행에 있는가?

### 신규 등록 테스트
- [ ] "신규 등록" 버튼 클릭 시 등록 폼이 표시되는가?
- [ ] 제목 입력 필드가 있는가?
- [ ] "전체 공개" 라디오 버튼이 기본 선택되어 있는가?
- [ ] "특정 학과만 공개" 선택 시 체크박스가 표시되는가?
- [ ] WYSIWYG 에디터가 작동하는가?
- [ ] 저장 버튼 클릭 시 목록에 추가되는가?

### 수정 테스트
- [ ] 목록에서 "수정" 버튼 클릭 시 수정 폼이 표시되는가?
- [ ] 기존 제목이 입력 필드에 표시되는가?
- [ ] 기존 학과 선택이 유지되는가?
- [ ] 기존 콘텐츠가 에디터에 표시되는가?
- [ ] 저장 버튼 클릭 시 변경 사항이 반영되는가?

### 삭제 테스트
- [ ] 목록에서 "삭제" 버튼 클릭 시 확인 메시지가 표시되는가?
- [ ] 확인 후 목록에서 제거되는가?

### 학과 선택 테스트
- [ ] "전체 공개" 선택 시 저장 후 목록에 "전체 공개"로 표시되는가?
- [ ] "특정 학과" 1개 선택 시 학과명이 표시되는가?
- [ ] "특정 학과" 여러 개 선택 시 "학과명 외 N개"로 표시되는가?
- [ ] 학과 미선택 시 경고 메시지가 표시되는가?

### 다중 등록 테스트
- [ ] 같은 학과에 여러 콘텐츠를 등록할 수 있는가?
- [ ] "2025 연구윤리", "2026 연구윤리" 등 여러 버전 등록이 가능한가?

---

## 🔄 데이터 마이그레이션

기존 localStorage 데이터가 있는 경우:
1. `migrateOldDataToArray()` 함수가 자동으로 실행됨
2. 기존 단일 객체 → 배열 형태로 변환
3. `department: 'all'` → `visibility: 'all', targetDepartments: ['all']` 변환 필요 (수동)

---

## 📝 참고 사항

- **공지사항과 100% 동일한 방식**: notice-management.js 참고
- **레거시 지원**: `department` 필드가 있는 구 데이터도 표시 가능
- **중복 허용**: 같은 학과에 여러 콘텐츠 등록 가능
- **ID 생성**: `${type}_${timestamp}_${random}` 형식

---

## 🐛 알려진 이슈

없음 (2025-01-12 기준)

---

## 📞 문의

구현 관련 문의 사항은 개발자에게 연락 바랍니다.
