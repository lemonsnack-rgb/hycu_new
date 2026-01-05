# 최종 논문 제목 등록 - 상세 페이지 구현 계획

## 개요
관리자가 테이블에서 학생 정보를 클릭하면 해당 학생의 논문 제목 등록 정보를 상세하게 볼 수 있는 화면을 구현합니다.

## 구현 일자
2026-01-05

## 구현 위치

### HTML 구조
- **파일**: [admin-v3/assets/js/admin_views.js](../admin-v3/assets/js/admin_views.js)
- **라인**: 2576-2578
- **기존 코드**:
```html
<!-- 상세 화면 -->
<div id="title-change-detail-view" style="display: none;">
    <!-- JavaScript로 동적 렌더링 -->
</div>
```

### JavaScript 함수
- **파일**: [admin-v3/assets/js/admin_main.js](../admin-v3/assets/js/admin_main.js)
- **위치**: 최종 논문 제목 등록 관련 함수 섹션 (라인 5614 이후)
- **함수명**: `showTitleChangeDetail(id)`

## 화면 구성 요소

### 1. 헤더 영역
```
┌─────────────────────────────────────────────────────────────┐
│ 최종 논문 제목 등록 상세                          [X 닫기]   │
└─────────────────────────────────────────────────────────────┘
```
- 배경색: Crimson (`#6A0028`)
- 텍스트: 흰색
- 닫기 버튼: `closeTitleChangeDetail()` 함수 호출

### 2. 학생 기본 정보 카드 (회색 배경)
```
┌─────────────────────────────────────────────────────────────┐
│ 학생 정보                                                   │
│                                                               │
│ 학번: 2024001234        성명: 김철수                        │
│ 대학구분: 대학원        계열/대학원: 일반대학원             │
│ 학부(과)전공: -         학과/전공: 컴퓨터공학               │
│ 학위과정: 박사          학적상태: 재학                       │
│ 지도교수: 홍길동                                            │
└─────────────────────────────────────────────────────────────┘
```

### 3. 논문 정보 카드
```
┌─────────────────────────────────────────────────────────────┐
│ 논문 정보                                                   │
│                                                               │
│ 학년도/학기: 2025학년도 1학기                               │
│                                                               │
│ 현재 논문 제목:                                             │
│ AI 기반 학습자 맞춤형 교육 시스템 개발                      │
│                                                               │
│ 제출일: 2025-11-20                                          │
│ 상태: [피드백 대기]  (상태에 따라 색상 다름)                │
└─────────────────────────────────────────────────────────────┘
```

### 4. 변경 이력 카드 (있는 경우)
```
┌─────────────────────────────────────────────────────────────┐
│ 제목 변경 이력                                              │
│                                                               │
│ [1차] 2025-10-15                                            │
│ 이전 제목: 인공지능 기반 교육 플랫폼 연구                   │
│ 변경 사유: 연구 범위 구체화                                 │
│                                                               │
│ [2차] 2025-09-01                                            │
│ 이전 제목: AI를 활용한 교육 시스템                          │
│ 변경 사유: 주제 명확화                                      │
└─────────────────────────────────────────────────────────────┘
```

### 5. 버튼 영역
```
┌─────────────────────────────────────────────────────────────┐
│                    [목록으로 돌아가기]                       │
└─────────────────────────────────────────────────────────────┘
```
- 버튼 색상: Crimson (`#6A0028`)
- 클릭 시: `closeTitleChangeDetail()` 함수 호출

## 데이터 구조

### Mock 데이터 확장 필요 (appData.titleChangeRequests)
현재 Mock 데이터에 다음 필드 추가가 필요합니다:

```javascript
{
    id: 1,
    // 기존 필드들...
    year: '2025',
    semester: '1',
    collegeType: '대학원',
    graduate: '일반대학원',
    faculty: '-',
    major: '컴퓨터공학',
    degree: '박사',
    status: '재학',
    studentId: '2024001234',
    studentName: '김철수',
    advisorName: '홍길동',

    // 새로 추가할 필드들
    currentTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
    submitDate: '2025-11-20',
    requestStatus: '피드백 대기', // 또는 '승인', '반려'

    // 변경 이력 (배열)
    changeHistory: [
        {
            date: '2025-10-15',
            previousTitle: '인공지능 기반 교육 플랫폼 연구',
            reason: '연구 범위 구체화'
        },
        {
            date: '2025-09-01',
            previousTitle: 'AI를 활용한 교육 시스템',
            reason: '주제 명확화'
        }
    ]
}
```

## 구현 함수

### 1. showTitleChangeDetail(id)
**목적**: 테이블 행 클릭 시 상세 화면 표시

**파라미터**:
- `id`: 제목 변경 요청 ID

**로직**:
1. `appData.titleChangeRequests`에서 ID로 데이터 찾기
2. 데이터가 없으면 에러 알림 표시
3. 목록 화면 숨김 (`title-change-list-view` display: none)
4. 상세 화면 컨테이너(`title-change-detail-view`)에 HTML 렌더링
5. 상세 화면 표시 (`title-change-detail-view` display: block)

**HTML 구조**:
```javascript
const html = `
    <!-- 헤더 -->
    <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
        <h3 class="text-xl font-bold">최종 논문 제목 등록 상세</h3>
        <button onclick="closeTitleChangeDetail()"
                class="text-white hover:text-gray-200 text-2xl leading-none">
            ×
        </button>
    </div>

    <!-- 학생 정보 -->
    <div class="bg-gray-50 p-6 border-b">
        <h4 class="text-sm font-bold text-gray-800 mb-4">학생 정보</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <div class="text-xs text-gray-500 mb-1">학번</div>
                <div class="font-semibold text-gray-800">${data.studentId}</div>
            </div>
            <div>
                <div class="text-xs text-gray-500 mb-1">성명</div>
                <div class="font-semibold text-gray-800">${data.studentName}</div>
            </div>
            <!-- 나머지 필드들... -->
        </div>
    </div>

    <!-- 논문 정보 -->
    <div class="bg-white p-6 border-b">
        <h4 class="text-sm font-bold text-gray-800 mb-4">논문 정보</h4>
        <div class="space-y-3">
            <div>
                <div class="text-xs text-gray-500 mb-1">학년도/학기</div>
                <div class="text-sm text-gray-800">${data.year}학년도 ${data.semester}학기</div>
            </div>
            <div>
                <div class="text-xs text-gray-500 mb-1">현재 논문 제목</div>
                <div class="text-base font-semibold text-gray-900">${data.currentTitle}</div>
            </div>
            <div class="flex items-center gap-4">
                <div>
                    <span class="text-xs text-gray-500">제출일: </span>
                    <span class="text-sm text-gray-800">${data.submitDate}</span>
                </div>
                <div>
                    <span class="px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(data.requestStatus)}">
                        ${data.requestStatus}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- 변경 이력 -->
    ${data.changeHistory && data.changeHistory.length > 0 ? `
        <div class="bg-white p-6 border-b">
            <h4 class="text-sm font-bold text-gray-800 mb-4">제목 변경 이력</h4>
            <div class="space-y-4">
                ${data.changeHistory.map((history, index) => `
                    <div class="border-l-4 border-blue-500 pl-4 py-2">
                        <div class="text-xs text-gray-500 mb-1">[${index + 1}차] ${history.date}</div>
                        <div class="text-sm text-gray-700">
                            <span class="font-medium">이전 제목:</span> ${history.previousTitle}
                        </div>
                        <div class="text-sm text-gray-600 mt-1">
                            <span class="font-medium">변경 사유:</span> ${history.reason}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : ''}

    <!-- 버튼 영역 -->
    <div class="p-6 flex items-center justify-center">
        <button onclick="closeTitleChangeDetail()"
                class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-8 py-2 rounded text-sm font-medium">
            목록으로 돌아가기
        </button>
    </div>
`;
```

### 2. closeTitleChangeDetail()
**목적**: 상세 화면 닫고 목록으로 돌아가기

**로직**:
1. 상세 화면 숨김 (`title-change-detail-view` display: none)
2. 상세 화면 내용 초기화 (innerHTML = '')
3. 목록 화면 표시 (`title-change-list-view` display: block)

### 3. getStatusBadgeClass(status)
**목적**: 상태에 따른 배지 클래스 반환

**반환값**:
```javascript
switch(status) {
    case '승인':
        return 'bg-green-100 text-green-800';
    case '반려':
        return 'bg-red-100 text-red-800';
    case '피드백 대기':
    default:
        return 'bg-yellow-100 text-yellow-800';
}
```

## 네비게이션 흐름

```
목록 화면 (테이블)
    ↓ 행 클릭: showTitleChangeDetail(id)
상세 화면
    ↓ [목록으로 돌아가기] 또는 [X] 클릭: closeTitleChangeDetail()
목록 화면 (테이블)
```

## 디자인 가이드라인

### 색상
- **Primary (Crimson)**: `#6A0028`
- **Hover**: `#8A0034`
- **회색 배경**: `bg-gray-50`
- **텍스트**: `text-gray-800` (진함), `text-gray-600` (중간), `text-gray-500` (연함)

### 상태 배지
- **승인**: 녹색 (`bg-green-100 text-green-800`)
- **반려**: 빨강 (`bg-red-100 text-red-800`)
- **피드백 대기**: 노랑 (`bg-yellow-100 text-yellow-800`)

### 간격
- 카드 패딩: `p-6` (24px)
- 섹션 간 간격: `space-y-4` (16px)
- 그리드 간격: `gap-4` (16px)

### 레이아웃
- **반응형 그리드**: `grid-cols-2 md:grid-cols-4`
- **최대 너비**: 상세 화면은 목록과 동일한 너비 유지
- **스크롤**: 내용이 길어지면 자동 스크롤

## 구현 순서

### Phase 5-1: Mock 데이터 확장
1. `admin-v3/assets/js/admin_data.js`의 `titleChangeRequests` 배열에 새 필드 추가
2. 최소 3개의 샘플 데이터에 `currentTitle`, `submitDate`, `requestStatus`, `changeHistory` 추가

### Phase 5-2: 상세 화면 함수 구현
1. `showTitleChangeDetail(id)` 함수 구현
2. `closeTitleChangeDetail()` 함수 구현
3. `getStatusBadgeClass(status)` 헬퍼 함수 구현

### Phase 5-3: HTML 렌더링 로직 구현
1. 학생 정보 카드 HTML 생성
2. 논문 정보 카드 HTML 생성
3. 변경 이력 카드 HTML 생성 (조건부)
4. 버튼 영역 HTML 생성

### Phase 5-4: 네비게이션 연결
1. 목록 화면 ↔ 상세 화면 전환 테스트
2. ESC 키 지원 추가 (선택사항)

## 참고 문서
- [admin-v3 표준 검색 레이아웃](./admin-v3-search-layout-standard.md)
- [최종 논문 제목 등록 재설계 계획](./admin-v3-title-registration-redesign-plan.md)
- [온라인 피드백 상세 화면](../admin-v3/assets/js/admin_main.js:1019-1148)

## 구현자
Claude Sonnet 4.5
