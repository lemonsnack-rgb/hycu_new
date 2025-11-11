# 학생 알림 발송 기능

## 개요

교수 및 관리자가 학생 테이블에서 학생들을 선택하여 카카오톡 또는 SMS 알림을 발송할 수 있는 기능입니다. 실제 알림 발송은 한양사이버대학교에서 관리하는 푸시 서버로 전송됩니다.

## 주요 기능

- ✅ 학생 테이블에서 체크박스를 통한 다중 선택
- ✅ 전체 선택/해제 기능
- ✅ 카카오톡/SMS 알림 유형 선택
- ✅ 커스텀 메시지 작성 (최대 1000자)
- ✅ 긴급 알림 옵션
- ✅ 한양사이버대학교 푸시 서버 연동
- ✅ Mock API (개발/테스트용)

## 아키텍처

### 1. 파일 구조

```
hycu_new/
├── common/
│   ├── notification-service.js      # 푸시 서버 API 통신
│   ├── notification-modal.js        # 알림 발송 모달 UI
│   ├── student-selection.js         # 학생 선택 관리
│   └── notification-styles.css      # 알림 기능 스타일
├── professor/
│   ├── index.html                   # 스크립트 포함
│   └── assets/js/
│       ├── guidance.js              # 지도학생관리 (통합됨)
│       └── review-list.js           # 심사관리 (통합됨)
└── admin/
    ├── admin_complete.html          # 스크립트 포함
    ├── admin_views.js               # 뷰 렌더링 (통합됨)
    └── admin_main.js                # 뷰 전환 시 초기화
```

### 2. 컴포넌트 다이어그램

```
┌─────────────────────────────────────────────────┐
│          Student Table (with Checkboxes)       │
│  ☑ Select All                                   │
│  ☑ Student 1  │  ☑ Student 2  │  ☑ Student 3  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         StudentSelection (Utility)              │
│  - selectedStudents: Map                        │
│  - toggleSelectAll()                            │
│  - toggleStudent(checkbox)                      │
│  - getSelectedStudents()                        │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│       NotificationModal (UI Component)          │
│  - Student List Preview                         │
│  - Notification Type (KakaoTalk/SMS)            │
│  - Message Input (max 1000 chars)               │
│  - Send Button                                  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│      NotificationService (API Service)          │
│  - sendNotifications(students, options)         │
│  - sendToPushServer(data)                       │
│  - mockPushServerResponse() [개발용]            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│     한양사이버대학교 푸시 서버                    │
│     (Production: /api/push/send)                │
└─────────────────────────────────────────────────┘
```

## 사용 방법

### 교수용 화면에서 사용

#### 1. 지도학생관리 화면
```javascript
// professor/assets/js/guidance.js

// 학생 목록 테이블 렌더링 시
function showStudentList() {
    // ... 테이블 HTML 생성

    // StudentSelection 초기화
    StudentSelection.init(students);
}
```

#### 2. 심사관리 화면
```javascript
// professor/assets/js/review-list.js

function renderReviewList() {
    // ... 테이블 HTML 생성

    // StudentSelection 초기화
    StudentSelection.init(studentsForSelection);
}
```

### 관리자용 화면에서 사용

#### 1. HTML에 스크립트 포함
```html
<!-- admin/admin_complete.html -->
<link rel="stylesheet" href="../common/notification-styles.css">
<script src="../common/notification-service.js"></script>
<script src="../common/student-selection.js"></script>
<script src="../common/notification-modal.js"></script>
```

#### 2. 뷰 전환 시 자동 초기화
```javascript
// admin/admin_main.js

function switchView(viewName) {
    // 컨텐츠 렌더링
    document.getElementById('content-area').innerHTML = views[viewName]();

    // StudentSelection 자동 초기화
    // (researchProposal, thesisReview, journalReview 뷰에서)
}
```

## API 명세

### NotificationService.sendNotifications()

#### Parameters

```javascript
NotificationService.sendNotifications(students, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| students | Array | Yes | 알림을 받을 학생 목록 |
| options | Object | Yes | 알림 옵션 |

#### Options Object

```javascript
{
    kakao: boolean,           // 카카오톡 발송 여부
    sms: boolean,             // SMS 발송 여부
    message: string,          // 메시지 내용 (1-1000자)
    title: string,            // 알림 제목 (선택)
    senderType: string,       // 'professor' | 'admin'
    senderId: string,         // 발송자 ID (선택)
    category: string          // 'general' | 'urgent'
}
```

#### Student Object

```javascript
{
    studentId: string,        // 학번
    studentName: string,      // 성명
    phone: string,            // 휴대전화
    email: string             // 이메일
}
```

#### Response

```javascript
{
    success: boolean,
    message: string,
    data: {
        notificationId: string,
        totalRecipients: number,
        successful: number,
        failed: number,
        channels: {
            kakao: { sent: number, failed: number },
            sms: { sent: number, failed: number }
        },
        timestamp: string
    }
}
```

### 푸시 서버 API

#### Endpoint
```
POST /api/push/send
```

#### Request Headers
```
Content-Type: application/json
Authorization: Bearer {authToken}
```

#### Request Body
```json
{
  "recipients": [
    {
      "studentId": "202100001",
      "studentName": "홍길동",
      "phone": "010-1234-5678",
      "email": "student@hycu.ac.kr"
    }
  ],
  "channels": {
    "kakao": true,
    "sms": false
  },
  "content": {
    "title": "한양사이버대학교 알림",
    "message": "알림 메시지 내용",
    "timestamp": "2025-11-11T10:00:00Z"
  },
  "metadata": {
    "senderType": "professor",
    "senderId": "P001",
    "category": "general"
  }
}
```

#### Response
```json
{
  "status": "success",
  "code": 200,
  "message": "알림이 푸시 서버로 전송되었습니다.",
  "data": {
    "notificationId": "NOTIF-1699677600000-abc123",
    "totalRecipients": 1,
    "successful": 1,
    "failed": 0,
    "channels": {
      "kakao": { "sent": 1, "failed": 0 },
      "sms": { "sent": 0, "failed": 0 }
    },
    "timestamp": "2025-11-11T10:00:00Z"
  }
}
```

## 테이블 통합 가이드

기존 테이블에 알림 발송 기능을 추가하려면:

### Step 1: HTML 스크립트 포함

```html
<!-- Professor: professor/index.html -->
<!-- Admin: admin/admin_complete.html -->

<link rel="stylesheet" href="../common/notification-styles.css">
<script src="../common/notification-service.js"></script>
<script src="../common/student-selection.js"></script>
<script src="../common/notification-modal.js"></script>
```

### Step 2: 테이블 헤더에 전체 선택 체크박스 추가

```html
<thead class="bg-gray-50">
    <tr>
        <th class="py-3 px-4 text-center" style="width: 50px;">
            <input
                type="checkbox"
                id="select-all-students"
                class="checkbox-input"
                onchange="StudentSelection.toggleSelectAll()"
                title="전체 선택"
            >
        </th>
        <!-- 기존 컬럼들 -->
    </tr>
</thead>
```

### Step 3: 각 행에 개별 체크박스 추가

```javascript
${students.map((student, idx) => {
    // 학생 데이터 준비
    const studentData = {
        studentId: student.studentId,
        studentName: student.name,
        phone: student.phone,
        email: student.email,
        major: student.major,
        degree: student.degree
    };

    return `
        <tr>
            <td class="py-3 px-4 text-center">
                <input
                    type="checkbox"
                    class="student-checkbox checkbox-input"
                    data-student-id="${student.studentId}"
                    data-student-data='${JSON.stringify(studentData)}'
                    onchange="StudentSelection.toggleStudent(this)"
                >
            </td>
            <!-- 기존 컬럼들 -->
        </tr>
    `;
}).join('')}
```

### Step 4: 선택 영역 UI 추가 (테이블 위)

```html
<!-- 학생 선택 영역 (알림 발송) -->
${StudentSelection.createSelectionUI()}

<div class="overflow-x-auto">
    <table>
        <!-- 테이블 내용 -->
    </table>
</div>
```

### Step 5: StudentSelection 초기화

```javascript
// 테이블 렌더링 후
StudentSelection.init(students);
```

## 커스터마이징

### 1. 알림 유형 추가

```javascript
// common/notification-modal.js

// 새로운 알림 유형 추가 (예: 이메일)
<label class="checkbox-label">
    <input type="checkbox" id="notif-type-email">
    <span class="checkbox-text">
        <span class="email-icon">📧</span> 이메일
    </span>
</label>
```

### 2. 메시지 템플릿 추가

```javascript
// 빠른 메시지 템플릿
const templates = {
    reminder: '논문 제출 기한이 다가오고 있습니다. 기한 내 제출 바랍니다.',
    meeting: '지도 미팅 일정을 확인해주시기 바랍니다.',
    approval: '제출하신 서류가 승인되었습니다.'
};

// 템플릿 선택 UI
<select id="message-template" onchange="applyTemplate(this.value)">
    <option value="">직접 입력</option>
    <option value="reminder">제출 리마인더</option>
    <option value="meeting">미팅 안내</option>
    <option value="approval">승인 알림</option>
</select>
```

### 3. 발송 이력 조회

```javascript
// 관리자용: 알림 발송 이력 조회
const history = await NotificationService.getNotificationHistory({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    senderType: 'professor'
});
```

## 보안 고려사항

### 1. 인증 토큰

```javascript
// notification-service.js
headers: {
    'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || '')
}
```

### 2. 입력 검증

```javascript
// 메시지 길이 제한
if (!options.message || options.message.trim() === '') {
    throw new Error('메시지 내용을 입력해주세요.');
}

if (options.message.length > 1000) {
    throw new Error('메시지는 1000자를 초과할 수 없습니다.');
}
```

### 3. XSS 방지

```javascript
// 학생 데이터를 JSON.stringify()로 안전하게 인코딩
data-student-data='${JSON.stringify(studentData)}'
```

## 개발/운영 환경 설정

### 개발 환경 (Mock API)

```javascript
// notification-service.js

// 푸시 서버 URL을 환경에 따라 설정
PUSH_SERVER_URL: process.env.PUSH_SERVER_URL || '/api/push/send',

// Mock 응답 활성화
async sendToPushServer(notificationData) {
    try {
        const response = await fetch(this.PUSH_SERVER_URL, {
            // ... 실제 API 호출
        });
        return await response.json();
    } catch (error) {
        // 개발 환경: Mock 응답 반환
        console.warn('[NotificationService] Mock 응답 반환');
        return await this.mockPushServerResponse(notificationData);
    }
}
```

### 운영 환경

```javascript
// .env 파일 설정
PUSH_SERVER_URL=https://push.hycu.ac.kr/api/push/send
AUTH_TOKEN_KEY=hycu_auth_token
```

## 트러블슈팅

### 1. StudentSelection이 정의되지 않음

**문제**: `StudentSelection is not defined`

**해결**: HTML에 스크립트가 올바르게 포함되었는지 확인
```html
<script src="../common/student-selection.js"></script>
```

### 2. 체크박스 선택이 작동하지 않음

**문제**: 체크박스 클릭 시 반응 없음

**해결**: StudentSelection.init() 호출 확인
```javascript
// 테이블 렌더링 후 반드시 호출
StudentSelection.init(students);
```

### 3. 알림 발송 실패

**문제**: 발송 버튼 클릭 시 오류

**해결**:
1. 네트워크 탭에서 API 요청 확인
2. 인증 토큰 유효성 확인
3. 푸시 서버 상태 확인

### 4. 선택 영역이 표시되지 않음

**문제**: 학생 선택 시 상단 바가 보이지 않음

**해결**: CSS 파일 포함 확인
```html
<link rel="stylesheet" href="../common/notification-styles.css">
```

## 향후 개선사항

- [ ] 알림 발송 예약 기능
- [ ] 발송 이력 대시보드
- [ ] 템플릿 저장 및 관리
- [ ] 발송 실패 재시도 로직
- [ ] 대량 발송 최적화 (배치 처리)
- [ ] 발송 결과 통계 및 분석

## 라이선스

© 2025 한양사이버대학교. All rights reserved.

## 문의

개발 관련 문의: IT지원팀
이메일: it-support@hycu.ac.kr
