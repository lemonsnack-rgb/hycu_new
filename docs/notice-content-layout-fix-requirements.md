# 공지사항/콘텐츠 화면 레이아웃 수정 요구사항

## 1. 문제 상황

### 현재 문제점
공지사항, 연구윤리, 논문일정, 논문지도절차 4개 화면이 **페이지 전환 방식**으로 구현되어 있으나, 상세 화면(detail view)이 **모달 스타일 레이아웃**을 사용하고 있어 다른 화면들과 UI 일관성이 없음.

### 영향 범위
- **관리자 화면** (admin-v3)
- **학생 화면** (student-v3)
- **교수 화면** (professor-v3)

---

## 2. 대상 화면

| 화면명 | 메뉴 위치 | 화면 ID | 파일 |
|--------|----------|---------|------|
| **공지사항** | 논문안내 > 공지사항 | `notice` | notice-management.js (admin)<br>professor-notice.js (professor)<br>student-notice.js (student) |
| **연구윤리** | 논문안내 > 연구윤리 | `ethics` | content-management.js (admin)<br>professor-content.js (professor)<br>student-content.js (student) |
| **논문일정** | 논문안내 > 논문일정 | `schedule` | content-management.js (admin)<br>professor-content.js (professor)<br>student-content.js (student) |
| **논문지도절차** | 논문안내 > 논문지도 절차 | `process` | content-management.js (admin)<br>professor-content.js (professor)<br>student-content.js (student) |

---

## 3. 현재 구조 분석

### 3.1 화면 구성

모든 화면은 2가지 뷰로 구성:
1. **목록 뷰** (List View): `{screen}-list-view`
2. **상세/편집 뷰** (Detail View): `{screen}-detail-view`

### 3.2 현재 레이아웃 (문제 있음)

#### 목록 뷰
```html
<div id="{screen}-list-view" style="display: block;">
    <div class="table-container">
        <div class="table-header">
            <div class="table-header-left">
                <h3 class="table-title">제목</h3>
                <span class="table-count">(총 N건)</span>
            </div>
            <div class="table-header-right">
                <!-- 관리자만: 신규 등록 버튼 -->
                <button>신규 등록</button>
            </div>
        </div>
        <table>...</table>
    </div>
</div>
```

#### 상세 뷰 (현재 - 모달 스타일)
```html
<div id="{screen}-detail-view" style="display: none;">
    <div class="review-detail-content-wrapper">  <!-- ❌ 모달 스타일 -->
        <div class="review-detail-header">       <!-- ❌ 모달 헤더 -->
            <button class="back-to-list-btn">목록으로 돌아가기</button>
        </div>
        <div class="review-detail-body">          <!-- ❌ 모달 본문 -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <!-- 콘텐츠 -->
            </div>
        </div>
    </div>
</div>
```

**문제점:**
- `review-detail-content-wrapper`, `review-detail-header`, `review-detail-body` 클래스는 모달 전용 스타일
- 다른 페이지 기반 화면(논문지도활동 등)과 레이아웃 구조가 다름

---

## 4. 수정 목표

### 4.1 참고 화면
**논문지도활동** 화면의 레이아웃을 기준으로 동기화

**파일:**
- `student-v3/assets/js/guidance-status-list.js`
- `professor-v3/assets/js/professor-guidance-status.js`
- `admin-v3/assets/js/admin_guidance_status.js`

### 4.2 목표 레이아웃 구조

#### 목록 뷰 (유지)
```html
<div id="{screen}-list-view" style="display: block;">
    <div class="table-container">
        <div class="table-header">
            <div class="table-header-left">
                <h3 class="table-title">제목</h3>
                <span class="table-count">(총 N건)</span>
            </div>
            <div class="table-header-right">
                <!-- 관리자만: 신규 등록 버튼 -->
                <button>신규 등록</button>
            </div>
        </div>
        <div class="table-scroll">
            <table>...</table>
        </div>
    </div>
</div>
```

#### 상세 뷰 (수정 필요)
```html
<div id="{screen}-detail-view" style="display: none;">
    <!-- ✅ 모달 래퍼 제거 -->
    <div class="table-container">
        <!-- ✅ 상단 헤더: 뒤로가기 버튼 -->
        <div class="table-header" style="margin-bottom: 1.5rem;">
            <div class="table-header-left">
                <button onclick="backTo{Screen}List()"
                        style="display: flex; align-items: center; gap: 0.5rem; color: #6A0028; background: none; border: none; cursor: pointer; font-size: 0.875rem; font-weight: 500;">
                    <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span>목록으로 돌아가기</span>
                </button>
            </div>
        </div>

        <!-- ✅ 본문: 카드 스타일 -->
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
            <!-- 제목 -->
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1rem;">
                제목
            </h2>

            <!-- 메타 정보 -->
            <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: #6B7280; padding-bottom: 1rem; border-bottom: 1px solid #E5E7EB; margin-bottom: 1.5rem;">
                <span><i class="fas fa-user" style="margin-right: 0.25rem;"></i> 작성자</span>
                <span><i class="fas fa-calendar" style="margin-right: 0.25rem;"></i> 작성일</span>
                <span><i class="fas fa-eye" style="margin-right: 0.25rem;"></i> 조회수</span>
            </div>

            <!-- 본문 내용 -->
            <div style="line-height: 1.8; font-size: 0.875rem; color: #333;">
                내용
            </div>

            <!-- 첨부파일 (있는 경우) -->
            <div style="margin-top: 1.5rem; padding: 1rem; background: #F9FAFB; border-radius: 0.5rem;">
                <h4 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem;">첨부파일</h4>
                <div>...</div>
            </div>

            <!-- 버튼 영역 -->
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
                <button onclick="backTo{Screen}List()">목록</button>
                <!-- 관리자만: 수정/삭제 버튼 -->
                <button>수정</button>
                <button>삭제</button>
            </div>
        </div>
    </div>
</div>
```

---

## 5. 상세 수정 사항

### 5.1 공통 수정사항 (모든 화면)

#### 변경 1: 모달 래퍼 제거
**현재:**
```javascript
detailView.innerHTML = `
    <div class="review-detail-content-wrapper">
        <div class="review-detail-header">...</div>
        <div class="review-detail-body">...</div>
    </div>
`;
```

**수정 후:**
```javascript
detailView.innerHTML = `
    <div class="table-container">
        <!-- 헤더 -->
        <div class="table-header" style="margin-bottom: 1.5rem;">...</div>
        <!-- 본문 -->
        <div style="background: white; ...">...</div>
    </div>
`;
```

#### 변경 2: 뒤로가기 버튼 스타일
**현재:**
```html
<button class="back-to-list-btn">
    <svg>...</svg>
    목록으로 돌아가기
</button>
```

**수정 후:**
```html
<button onclick="backTo{Screen}List()"
        style="display: flex; align-items: center; gap: 0.5rem; color: #6A0028; background: none; border: none; cursor: pointer; font-size: 0.875rem; font-weight: 500;">
    <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
    </svg>
    <span>목록으로 돌아가기</span>
</button>
```

#### 변경 3: 본문 컨테이너
**현재:**
```html
<div class="review-detail-body">
    <div class="bg-white rounded-lg shadow-md p-6">
        <!-- 내용 -->
    </div>
</div>
```

**수정 후:**
```html
<div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
    <!-- 내용 -->
</div>
```

### 5.2 화면별 특이사항

#### 5.2.1 관리자 화면 (admin-v3)

**특징:**
- 상세 뷰에 **수정/삭제 버튼** 표시
- 신규 등록 폼도 동일한 레이아웃 적용

**버튼 영역:**
```html
<div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
    <button onclick="backToNoticeList()">목록</button>
    <button onclick="showNoticeEditForm('${notice.id}')">수정</button>
    <button onclick="deleteNoticeConfirm('${notice.id}')">삭제</button>
</div>
```

**신규 등록/편집 폼:**
- 동일한 `table-container` 구조 사용
- 폼 요소는 현재와 동일하게 유지
- 외부 래퍼만 변경

#### 5.2.2 교수 화면 (professor-v3)

**특징:**
- 읽기 전용 (수정/삭제 버튼 없음)
- 목록 버튼만 표시

**버튼 영역:**
```html
<div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
    <button onclick="backToProfessorNoticeList()">목록</button>
</div>
```

#### 5.2.3 학생 화면 (student-v3)

**특징:**
- 읽기 전용 (수정/삭제 버튼 없음)
- 목록 버튼만 표시

**버튼 영역:**
```html
<div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
    <button onclick="backToStudentNoticeList()">목록</button>
</div>
```

---

## 6. 수정 대상 파일 목록

### 6.1 관리자 (admin-v3)

| 파일 | 함수 | 라인 범위 (예상) |
|------|------|-----------------|
| `assets/js/notice-management.js` | `showNoticeDetail()` | 180-235 |
| | `showNoticeCreateForm()` | 250-350 |
| | `showNoticeEditForm()` | 350-450 |
| `assets/js/content-management.js` | `showEditForm()` | 22-150 |
| | `showDetailView()` | (확인 필요) |

### 6.2 교수 (professor-v3)

| 파일 | 함수 | 라인 범위 (예상) |
|------|------|-----------------|
| `assets/js/professor-notice.js` | `showProfessorNoticeDetail()` | (확인 필요) |
| `assets/js/professor-content.js` | `showProfessorContentDetail()` | (확인 필요) |

### 6.3 학생 (student-v3)

| 파일 | 함수 | 라인 범위 (예상) |
|------|------|-----------------|
| `assets/js/student-notice.js` | `showStudentNoticeDetail()` | 181-260 |
| `assets/js/student-content.js` | `showStudentContentDetail()` | 252-320 |

---

## 7. 수정 시 주의사항

### 7.1 기능 유지
- **표시/숨김 로직**: `style.display = 'block'/'none'` 방식 유지
- **데이터 바인딩**: 모든 데이터 표시 로직 동일하게 유지
- **이벤트 핸들러**: onclick 함수명 변경 없음
- **버튼 동작**: 목록, 수정, 삭제 버튼의 기능 동일

### 7.2 권한 차이 유지
- **관리자**: 수정/삭제 버튼 표시 + 신규 등록 버튼
- **교수**: 읽기 전용, 목록 버튼만
- **학생**: 읽기 전용, 목록 버튼만

### 7.3 CSS 클래스
- **제거할 클래스**: `review-detail-content-wrapper`, `review-detail-header`, `review-detail-body`, `back-to-list-btn`
- **유지할 클래스**: `table-container`, `table-header`, `table-header-left`, `table-header-right`, `table-title`, `table-count`, `table-scroll`

### 7.4 인라인 스타일
- 모든 스타일을 인라인으로 작성 (클래스 의존성 제거)
- 색상: `#6A0028` (브랜드 컬러), `#111827` (제목), `#6B7280` (메타 정보)
- 간격: `1rem`, `1.5rem` 기준

---

## 8. 테스트 체크리스트

### 8.1 기능 테스트
- [ ] 목록 → 상세 화면 전환
- [ ] 상세 → 목록 화면 전환 (뒤로가기 버튼)
- [ ] 관리자: 신규 등록 버튼 → 등록 폼 표시
- [ ] 관리자: 상세 화면에서 수정 버튼 → 편집 폼 표시
- [ ] 관리자: 상세 화면에서 삭제 버튼 → 삭제 확인 후 목록 복귀
- [ ] 교수/학생: 읽기 전용 확인 (수정/삭제 버튼 없음)

### 8.2 UI 테스트
- [ ] 레이아웃이 다른 페이지 화면(논문지도활동)과 일치
- [ ] 뒤로가기 버튼 위치 및 스타일 일치
- [ ] 본문 카드 스타일 일치
- [ ] 메타 정보 표시 형식 일치
- [ ] 버튼 배치 및 스타일 일치
- [ ] 모바일 반응형 정상 동작

### 8.3 화면별 테스트
- [ ] 공지사항 - 관리자
- [ ] 공지사항 - 교수
- [ ] 공지사항 - 학생
- [ ] 연구윤리 - 관리자
- [ ] 연구윤리 - 교수
- [ ] 연구윤리 - 학생
- [ ] 논문일정 - 관리자
- [ ] 논문일정 - 교수
- [ ] 논문일정 - 학생
- [ ] 논문지도절차 - 관리자
- [ ] 논문지도절차 - 교수
- [ ] 논문지도절차 - 학생

---

## 9. 구현 순서

1. **관리자 화면 (admin-v3)**
   - notice-management.js 수정
   - content-management.js 수정
   - 기능 테스트 완료

2. **학생 화면 (student-v3)**
   - student-notice.js 수정
   - student-content.js 수정
   - 기능 테스트 완료

3. **교수 화면 (professor-v3)**
   - professor-notice.js 수정
   - professor-content.js 수정
   - 기능 테스트 완료

4. **통합 테스트**
   - 모든 화면 일관성 확인
   - 권한별 차이 확인

---

## 10. 참고 자료

### 10.1 현재 CSS 클래스 (제거 대상)
```css
.review-detail-content-wrapper {
    /* 모달 전용 스타일 */
}

.review-detail-header {
    /* 모달 헤더 스타일 */
}

.review-detail-body {
    /* 모달 본문 스타일 */
}

.back-to-list-btn {
    /* 모달 뒤로가기 버튼 스타일 */
}
```

### 10.2 목표 구조 (논문지도활동 참고)
```html
<div class="table-container">
    <div class="table-header">
        <div class="table-header-left">
            <button>뒤로가기</button>
        </div>
    </div>
    <div style="인라인 스타일">
        <!-- 본문 -->
    </div>
</div>
```

---

## 11. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|----------|--------|
| 1.0 | 2026-01-20 | 초안 작성 | - |
