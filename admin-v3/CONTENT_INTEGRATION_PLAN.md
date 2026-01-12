# 콘텐츠 관리 시스템 통합안

## 📋 현황 분석

### 현재 구조 (AS-IS)
```
[논문 안내] 메뉴
├── 공지사항 (noticeManagement)
│   ├── 목록 화면 (관리자)
│   ├── 상세 화면 (관리자/이용자)
│   └── 등록/수정 화면 (관리자)
├── 연구윤리 (ethics) - 이용자 뷰만 (정적 페이지)
├── 논문일정 (schedule) - 이용자 뷰만 (정적 페이지)
└── 논문지도절차 (process) - 이용자 뷰만 (정적 페이지)

[시스템 설정] 메뉴
├── 연구윤리 관리 (ethicsList) - 관리자 목록
├── 논문일정 관리 (scheduleList) - 관리자 목록
└── 논문지도절차 관리 (procedureList) - 관리자 목록
```

### 문제점
1. **메뉴 분산**: 관리 기능이 "시스템 설정"에 분리되어 있음
2. **이용자 뷰 제약**: 정적 페이지로 여러 버전 관리 불가
3. **일관성 부족**: 공지사항과 다른 구조

---

## 🎯 제안 구조 (TO-BE)

### 통합 구조
```
[논문 안내] 메뉴
├── 공지사항
│   ├── 목록 화면 (관리자: 등록 버튼 O / 이용자: 등록 버튼 X)
│   ├── 상세 화면 (관리자: 수정/삭제 O / 이용자: 보기만)
│   └── 등록/수정 화면 (관리자만)
│
├── 연구윤리
│   ├── 목록 화면 (관리자: 등록 버튼 O / 이용자: 등록 버튼 X)
│   ├── 상세 화면 (관리자: 수정/삭제 O / 이용자: 보기만)
│   └── 등록/수정 화면 (관리자만)
│
├── 논문일정
│   ├── 목록 화면 (관리자: 등록 버튼 O / 이용자: 등록 버튼 X)
│   ├── 상세 화면 (관리자: 수정/삭제 O / 이용자: 보기만)
│   └── 등록/수정 화면 (관리자만)
│
└── 논문지도절차
    ├── 목록 화면 (관리자: 등록 버튼 O / 이용자: 등록 버튼 X)
    ├── 상세 화면 (관리자: 수정/삭제 O / 이용자: 보기만)
    └── 등록/수정 화면 (관리자만)

[시스템 설정] 메뉴
(연구윤리/논문일정/논문지도 관리 메뉴 삭제)
```

### 개선 효과
1. ✅ **메뉴 통합**: 모든 논문 관련 콘텐츠가 "논문 안내" 하나로 통일
2. ✅ **이용자 UX 개선**: 목록에서 선택 → 상세 보기 (공지사항과 동일)
3. ✅ **관리자 편의성**: 여러 버전 관리 가능 (2025년도, 2026년도 등)
4. ✅ **일관성**: 공지사항과 100% 동일한 UX

---

## 📊 화면 흐름도

### 관리자 화면 흐름
```
목록 화면 (ethicsList)
  ├─[클릭] 제목 → 상세 화면 (수정/삭제 버튼 O)
  │                 └─[클릭] 수정 → 수정 화면 → 저장 → 목록
  │                 └─[클릭] 삭제 → 확인 → 목록
  └─[클릭] 신규 등록 → 등록 화면 → 저장 → 목록
```

### 이용자 화면 흐름
```
목록 화면 (ethicsList)
  └─[클릭] 제목 → 상세 화면 (수정/삭제 버튼 X)
                    └─[클릭] 목록 → 목록 화면
```

---

## 🛠️ 구현 작업 목록

### 1. 권한 체크 함수 추가
**파일**: `admin-v3/assets/js/auth-utils.js` (신규)

```javascript
/**
 * 권한 체크 유틸리티
 */
const AuthUtils = {
    /**
     * 관리자 여부 확인
     * @returns {boolean}
     */
    isAdmin() {
        // TODO: 실제 권한 관리 시스템 연동
        // 현재는 임시로 모두 관리자로 설정
        return true;
    },

    /**
     * 교수 여부 확인
     * @returns {boolean}
     */
    isProfessor() {
        // TODO: 실제 권한 관리 시스템 연동
        return false;
    },

    /**
     * 학생 여부 확인
     * @returns {boolean}
     */
    isStudent() {
        // TODO: 실제 권한 관리 시스템 연동
        return false;
    }
};

window.AuthUtils = AuthUtils;
```

**작업 시간**: 30분

---

### 2. 상세 화면 구현
**파일**: `admin-v3/assets/js/content-detail.js` (신규)

```javascript
/**
 * 콘텐츠 상세 화면 관리 (공지사항 방식)
 */
const ContentDetail = {
    currentContentType: null,
    currentContentId: null,

    /**
     * 상세 화면 표시
     */
    showDetail(contentType, contentId) {
        this.currentContentType = contentType;
        this.currentContentId = contentId;

        const content = getContentById(contentType, contentId);
        if (!content) {
            alert('콘텐츠를 찾을 수 없습니다.');
            return;
        }

        // 관리자 여부 확인
        const isAdmin = AuthUtils.isAdmin();

        // 상세 화면 HTML (공지사항과 동일)
        const detailHTML = `
            <div class="review-detail-content-wrapper">
                <!-- 헤더 -->
                <div class="review-detail-header" style="padding: 12px 24px;">
                    <button onclick="ContentDetail.backToList()" class="back-to-list-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        목록으로 돌아가기
                    </button>
                </div>

                <!-- 본문 -->
                <div class="review-detail-body">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <!-- 제목 -->
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">${content.title}</h2>

                        <!-- 메타 정보 -->
                        <div class="flex gap-4 text-sm text-gray-600 pb-4 border-b mb-6">
                            <span><i class="fas fa-user mr-1"></i> ${content.author || 'admin'}</span>
                            <span><i class="fas fa-calendar mr-1"></i> ${content.createdAt || content.lastModified}</span>
                        </div>

                        <!-- 본문 -->
                        <div class="prose prose-sm max-w-none">
                            ${content.content}
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end gap-2 mt-6 pt-6 border-t">
                            <button onclick="ContentDetail.backToList()"
                                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                목록
                            </button>
                            ${isAdmin ? `
                                <button onclick="ContentDetail.editContent()"
                                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <i class="fas fa-edit mr-1"></i> 수정
                                </button>
                                <button onclick="ContentDetail.deleteContent()"
                                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    <i class="fas fa-trash mr-1"></i> 삭제
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = detailHTML;
        }
    },

    /**
     * 목록으로 돌아가기
     */
    backToList() {
        const viewMap = {
            ethics: 'ethicsList',
            schedule: 'scheduleList',
            procedure: 'procedureList'
        };
        const targetView = viewMap[this.currentContentType];

        if (targetView && typeof window.renderAdminView === 'function') {
            window.renderAdminView(targetView);
        }
    },

    /**
     * 수정 화면으로 이동
     */
    editContent() {
        if (typeof ContentManagement !== 'undefined') {
            ContentManagement.showEditForm(this.currentContentType, this.currentContentId);
        }
    },

    /**
     * 삭제
     */
    deleteContent() {
        const content = getContentById(this.currentContentType, this.currentContentId);
        if (!content) {
            alert('콘텐츠를 찾을 수 없습니다.');
            return;
        }

        if (!confirm(`"${content.title}"을(를) 삭제하시겠습니까?`)) {
            return;
        }

        const success = deleteContentItem(this.currentContentType, this.currentContentId);
        if (success) {
            alert('삭제되었습니다.');
            this.backToList();
        } else {
            alert('삭제에 실패했습니다.');
        }
    }
};

window.ContentDetail = ContentDetail;
```

**작업 시간**: 1시간

---

### 3. 목록 화면 수정
**파일**: `admin-v3/assets/js/content-list-management.js` (기존 파일 수정)

#### 3-1. 권한에 따른 버튼 표시
```javascript
loadContentList() {
    const contentList = getContentList(this.currentContentType);
    const tableBody = document.getElementById('content-table-body');
    const countDisplay = document.getElementById('content-count-display');

    if (countDisplay) {
        countDisplay.textContent = `(총 ${contentList.length}건)`;
    }

    // 관리자 여부 확인
    const isAdmin = AuthUtils.isAdmin();

    // 신규 등록 버튼 show/hide
    const createBtn = document.querySelector('.table-header-right button');
    if (createBtn) {
        createBtn.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    if (contentList.length === 0) {
        tableBody.innerHTML = `...`;
        return;
    }

    let html = '';
    contentList.forEach((content, index) => {
        const deptDisplay = this.getDepartmentDisplay(content);
        html += `
            <tr onclick="ContentDetail.showDetail('${this.currentContentType}', '${content.id}')" style="cursor: pointer;">
                <td>${index + 1}</td>
                <td class="text-left font-medium">${content.title || '-'}</td>
                <td>${deptDisplay}</td>
                <td>${content.createdAt || content.lastModified || '-'}</td>
                <td>${content.author || content.modifiedBy || '-'}</td>
                ${isAdmin ? `
                    <td onclick="event.stopPropagation();">
                        <button onclick="ContentListManagement.editContent('${content.id}')"
                                class="action-btn action-btn-edit">
                            <i class="fas fa-edit"></i> 수정
                        </button>
                        <button onclick="ContentListManagement.deleteContent('${content.id}')"
                                class="action-btn action-btn-delete">
                            <i class="fas fa-trash"></i> 삭제
                        </button>
                    </td>
                ` : '<td></td>'}
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}
```

**작업 시간**: 30분

---

### 4. 메뉴 구조 변경
**파일**: `admin-v3/index.html` (기존 파일 수정)

#### 4-1. 사이드바 메뉴 수정 (230-256행)
```html
<!-- 논문 안내 -->
<div class="mt-2">
    <div class="layout-v3-nav-item" style="cursor: default;">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>논문 안내</span>
    </div>
    <div class="pl-12 mt-1 space-y-1">
        <a href="#" onclick="showScreen('noticeManagement'); return false;" data-screen="noticeManagement"
           class="sidebar-sublink flex items-center rounded-lg transition-colors duration-200">
            <span>공지사항</span>
        </a>
        <a href="#" onclick="showScreen('ethicsList'); return false;" data-screen="ethicsList"
           class="sidebar-sublink flex items-center rounded-lg transition-colors duration-200">
            <span>연구윤리</span>
        </a>
        <a href="#" onclick="showScreen('scheduleList'); return false;" data-screen="scheduleList"
           class="sidebar-sublink flex items-center rounded-lg transition-colors duration-200">
            <span>논문일정</span>
        </a>
        <a href="#" onclick="showScreen('procedureList'); return false;" data-screen="procedureList"
           class="sidebar-sublink flex items-center rounded-lg transition-colors duration-200">
            <span>논문지도절차</span>
        </a>
    </div>
</div>
```

#### 4-2. 시스템 설정에서 메뉴 제거 (368-381행)
```html
<!-- 시스템 설정 -->
<div class="pl-12 mt-1 space-y-1">
    <a href="#" onclick="showScreen('permissionManagement'); return false;" data-screen="permissionManagement"
       class="sidebar-sublink flex items-center rounded-lg transition-colors duration-200">
        <span>권한 관리</span>
    </a>
    <a href="#" onclick="showScreen('proxyLogin'); return false;" data-screen="proxyLogin"
       class="sidebar-sublink flex items-center rounded-lg transition-colors duration-200">
        <span>대리로그인</span>
    </a>
    <!-- 삭제: 연구윤리 관리, 논문일정 관리, 논문지도절차 관리 -->
</div>
```

#### 4-3. breadcrumbMap 수정 (1126-1129행)
```javascript
'ethicsList': { menu: '논문 안내', submenu: '연구윤리' },
'scheduleList': { menu: '논문 안내', submenu: '논문일정' },
'procedureList': { menu: '논문 안내', submenu: '논문지도절차' }
```

**작업 시간**: 30분

---

### 5. 기존 이용자 뷰 정리
**파일**: `admin-v3/assets/js/admin_views.js`

#### 5-1. 불필요한 뷰 주석 처리 또는 삭제
```javascript
// ========== 연구윤리 (DEPRECATED - ethicsList로 통합) ==========
// views.ethics = () => `...`;

// ========== 논문일정 (DEPRECATED - scheduleList로 통합) ==========
// views.schedule = () => `...`;

// ========== 논문지도절차 (DEPRECATED - procedureList로 통합) ==========
// views.process = views.procedure;

// ========== 콘텐츠 관리 화면 (DEPRECATED - ContentManagement로 통합) ==========
// views.ethicsContentMgmt = () => `...`;
// views.scheduleContentMgmt = () => `...`;
// views.procedureContentMgmt = () => `...`;
```

**작업 시간**: 15분

---

### 6. index.html 스크립트 로드 순서 확인
**파일**: `admin-v3/index.html` (스크립트 섹션)

```html
<!-- 권한 체크 (신규) -->
<script src="assets/js/auth-utils.js"></script>

<!-- 콘텐츠 관리 -->
<script src="assets/js/content-data.js"></script>
<script src="assets/js/content-list-management.js"></script>
<script src="assets/js/content-management.js"></script>
<script src="assets/js/content-detail.js"></script> <!-- 신규 -->
```

**작업 시간**: 10분

---

## 📅 작업 일정

| 단계 | 작업 내용 | 예상 시간 | 담당 |
|------|----------|----------|------|
| 1 | 권한 체크 함수 추가 (auth-utils.js) | 30분 | 개발자 |
| 2 | 상세 화면 구현 (content-detail.js) | 1시간 | 개발자 |
| 3 | 목록 화면 수정 (권한 체크 추가) | 30분 | 개발자 |
| 4 | 메뉴 구조 변경 (index.html) | 30분 | 개발자 |
| 5 | 기존 뷰 정리 (admin_views.js) | 15분 | 개발자 |
| 6 | 스크립트 로드 순서 확인 | 10분 | 개발자 |
| 7 | 테스트 및 검증 | 1시간 | QA |
| **합계** | | **3시간 55분** | |

---

## 🧪 테스트 시나리오

### 관리자 테스트
1. ✅ "논문 안내 > 연구윤리" 클릭 → 목록 화면 표시
2. ✅ "신규 등록" 버튼 표시 확인
3. ✅ 목록에서 제목 클릭 → 상세 화면 표시
4. ✅ 상세 화면에 "수정", "삭제" 버튼 표시 확인
5. ✅ "수정" 클릭 → 수정 화면 → 저장 → 목록
6. ✅ "삭제" 클릭 → 확인 → 목록
7. ✅ 논문일정, 논문지도절차도 동일하게 테스트

### 이용자 테스트
1. ✅ "논문 안내 > 연구윤리" 클릭 → 목록 화면 표시
2. ✅ "신규 등록" 버튼 **숨김** 확인
3. ✅ 목록에서 제목 클릭 → 상세 화면 표시
4. ✅ 상세 화면에 "수정", "삭제" 버튼 **숨김** 확인
5. ✅ "목록" 버튼만 표시 확인
6. ✅ 논문일정, 논문지도절차도 동일하게 테스트

### 메뉴 테스트
1. ✅ "논문 안내" 메뉴에 4개 하위메뉴 표시 확인
2. ✅ "시스템 설정"에서 콘텐츠 관리 메뉴 제거 확인
3. ✅ breadcrumb 정상 표시 확인

---

## 🚨 주의사항

### 권한 관리 연동
- **현재**: `AuthUtils.isAdmin()`이 항상 `true` 반환 (임시)
- **TODO**: 실제 권한 관리 시스템 연동 필요
- **연동 시점**: 권한 관리 기능 구현 완료 후

### 데이터 마이그레이션
- 기존 데이터는 이미 공지사항 방식으로 변환 완료
- localStorage에 저장된 데이터는 자동으로 사용됨

### 하위 호환성
- 기존 `views.ethics`, `views.schedule`, `views.process` 제거
- 외부에서 직접 호출하는 코드가 있다면 수정 필요

---

## 📊 비교표

| 항목 | AS-IS (현재) | TO-BE (통합) |
|------|-------------|-------------|
| 메뉴 구조 | 논문 안내 + 시스템 설정 분리 | 논문 안내로 통합 |
| 이용자 뷰 | 정적 페이지 (1개만 표시) | 동적 목록 (여러 개 선택 가능) |
| 관리자 뷰 | 시스템 설정에 별도 메뉴 | 논문 안내에 통합 |
| 권한 관리 | 메뉴 분리로 구분 | 화면 내 버튼으로 구분 |
| 일관성 | 공지사항과 다른 구조 | 공지사항과 동일 |

---

## ✅ 승인 후 작업 절차

1. **고객사 승인 확인**
2. **개발 착수** (예상 시간: 3시간 55분)
3. **개발 완료 후 QA 테스트**
4. **고객사 확인 및 피드백**
5. **최종 배포**

---

## 📞 문의 사항

구현 전 확인이 필요한 사항:
1. 권한 관리 시스템 연동 일정
2. 이용자 접근 범위 (학생/교수 구분 필요 여부)
3. 기존 데이터 마이그레이션 필요 여부

---

**작성일**: 2025-01-12
**작성자**: 개발팀
**문서 버전**: 1.0
