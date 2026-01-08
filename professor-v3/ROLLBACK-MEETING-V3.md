# 미팅 관리 V3 롤백 가이드

## 📋 목적
교수용 실시간 지도 예약 화면 V3 구현 중 문제 발생 시 V2로 안전하게 복원하기 위한 가이드

## 🔄 백업 대상 파일

### JavaScript 파일 (3개)
```
professor-v3/assets/js/
├── meeting-v2.js              → meeting-v2.js.backup
├── meeting-data-v2.js         → meeting-data-v2.js.backup
└── meeting-v2-part2.js        → meeting-v2-part2.js.backup
```

### HTML 파일 (1개)
```
professor-v3/
└── professor-dashboard-proposal.html  → professor-dashboard-proposal.html.backup
```

### CSS 파일 (1개)
```
professor-v3/assets/css/
└── meeting-v2.css             → meeting-v2.css.backup
```

## 📦 백업 생성 명령어

```bash
# JavaScript 백업
cp professor-v3/assets/js/meeting-v2.js professor-v3/assets/js/meeting-v2.js.backup
cp professor-v3/assets/js/meeting-data-v2.js professor-v3/assets/js/meeting-data-v2.js.backup
cp professor-v3/assets/js/meeting-v2-part2.js professor-v3/assets/js/meeting-v2-part2.js.backup

# HTML 백업
cp professor-v3/professor-dashboard-proposal.html professor-v3/professor-dashboard-proposal.html.backup

# CSS 백업
cp professor-v3/assets/css/meeting-v2.css professor-v3/assets/css/meeting-v2.css.backup
```

## 🎯 HTML 통합 지점

**파일**: `professor-v3/professor-dashboard-proposal.html`

**현재 V2 스크립트 로드 위치**:
```html
<!-- Line 1270 -->
<script src="assets/js/meeting-data-v2.js"></script>

<!-- Line 1283 -->
<script src="assets/js/meeting-v2.js?v=20251218020"></script>
```

**V3 구현 시 변경**:
```html
<!-- 기존 V2 스크립트 제거 또는 주석처리 -->
<!-- <script src="assets/js/meeting-data-v2.js"></script> -->
<!-- <script src="assets/js/meeting-v2.js?v=20251218020"></script> -->

<!-- V3 스크립트 추가 -->
<script src="assets/js/meeting-v3-data.js"></script>
<script src="assets/js/meeting-v3-utils.js"></script>
<script src="assets/js/meeting-v3-filters.js"></script>
<script src="assets/js/meeting-v3-modals.js"></script>
<script src="assets/js/meeting-v3-list.js"></script>
<script src="assets/js/meeting-v3-detail.js"></script>
<script src="assets/js/meeting-v3-main.js"></script>
```

**컨테이너 DIV ID**: `meeting-content-area`

## 📋 V2 기능 체크리스트

### 탭 구조 (meeting-v2.js)
- [ ] 예정된 미팅 탭 (confirmed)
- [ ] 신청 목록 탭 (waiting)
- [ ] 일정 설정 탭 (schedule)
- [ ] 완료된 미팅 탭 (completed)

### 핵심 함수 (meeting-v2.js)
- [ ] `initMeetingV2()` - 초기화
- [ ] `renderMeetingMainV2()` - 메인 렌더링
- [ ] `changeMeetingTab(tab)` - 탭 전환
- [ ] `renderWaitingTab()` - 신청 목록 (카드형)
- [ ] `renderConfirmedTab()` - 확정 미팅 (카드형)
- [ ] `renderScheduleTab()` - 일정 설정 (캘린더)
- [ ] `renderCompletedTab()` - 완료 미팅
- [ ] `approveMeeting(id)` - 미팅 승인
- [ ] `rejectMeeting(id)` - 미팅 거절
- [ ] `completeMeeting(id)` - 미팅 완료
- [ ] `addAvailableSlot()` - 가능시간 추가
- [ ] `createGroupMeeting()` - 그룹 미팅 생성

### 데이터 구조 (meeting-data-v2.js)
- [ ] `mockAvailableSlots` - 가능시간 슬롯
- [ ] `mockMeetingRequests` - 미팅 신청
- [ ] `mockGroupMeetings` - 그룹 미팅
- [ ] `DataService.getMeetingStats()` - 통계
- [ ] `DataService.getAvailableSlots()` - 가능시간 조회
- [ ] `DataService.getMeetingRequests()` - 신청 조회
- [ ] `DataService.approveMeeting()` - 승인 처리
- [ ] `DataService.rejectMeeting()` - 거절 처리
- [ ] `DataService.completeMeeting()` - 완료 처리

### 외부 라이브러리 의존성
- [ ] FullCalendar (일정 설정 탭)
- [ ] Zoom API 연동 (미팅 링크 생성)
- [ ] Video.js (녹화 재생)

## 🔧 롤백 절차

### 1단계: V3 파일 제거
```bash
rm professor-v3/assets/js/meeting-v3-*.js
```

### 2단계: V2 파일 복원
```bash
# JavaScript 복원
cp professor-v3/assets/js/meeting-v2.js.backup professor-v3/assets/js/meeting-v2.js
cp professor-v3/assets/js/meeting-data-v2.js.backup professor-v3/assets/js/meeting-data-v2.js
cp professor-v3/assets/js/meeting-v2-part2.js.backup professor-v3/assets/js/meeting-v2-part2.js

# HTML 복원
cp professor-v3/professor-dashboard-proposal.html.backup professor-v3/professor-dashboard-proposal.html

# CSS 복원
cp professor-v3/assets/css/meeting-v2.css.backup professor-v3/assets/css/meeting-v2.css
```

### 3단계: 브라우저 캐시 클리어
```
Ctrl + Shift + R (Hard Reload)
또는 개발자도구 → Network 탭 → "Disable cache" 체크
```

### 4단계: 기능 테스트

#### 기본 동작 확인
- [ ] 대시보드에서 "실시간 지도 예약" 메뉴 클릭
- [ ] 4개 탭 정상 표시 (예정된 미팅, 신청 목록, 일정 설정, 완료된 미팅)
- [ ] 각 탭 전환 시 정상 렌더링

#### 신청 목록 탭 테스트
- [ ] 신청 카드 목록 표시
- [ ] 승인 버튼 클릭 시 모달 표시
- [ ] 승인 완료 시 "예정된 미팅"으로 이동
- [ ] 거절 버튼 클릭 시 모달 표시
- [ ] 거절 완료 시 목록에서 제거

#### 예정된 미팅 탭 테스트
- [ ] 확정 미팅 카드 목록 표시
- [ ] Zoom 링크 표시
- [ ] "완료 처리" 버튼 클릭 시 완료 탭으로 이동

#### 일정 설정 탭 테스트
- [ ] FullCalendar 정상 렌더링
- [ ] 가능시간 추가 모달 동작
- [ ] 특정 날짜/반복 일정 추가 가능
- [ ] 그룹 미팅 생성 모달 동작
- [ ] 학생 선택 후 미팅 생성 가능

#### 완료된 미팅 탭 테스트
- [ ] 완료 미팅 카드 목록 표시
- [ ] 녹화 파일 재생 (Video.js)
- [ ] 평가 입력 가능

## ⚠️ 롤백 실패 시 대응

### 증상 1: "meeting-content-area를 찾을 수 없습니다" 에러
**원인**: HTML 파일의 컨테이너 ID 불일치
**해결**:
```bash
cp professor-v3/professor-dashboard-proposal.html.backup professor-v3/professor-dashboard-proposal.html
```

### 증상 2: 탭 클릭 시 아무 반응 없음
**원인**: JavaScript 파일 로드 순서 문제
**해결**: HTML에서 스크립트 로드 순서 확인
```html
<!-- 반드시 이 순서로 로드 -->
<script src="assets/js/meeting-data-v2.js"></script>
<script src="assets/js/meeting-v2.js"></script>
<script src="assets/js/meeting-v2-part2.js"></script>
```

### 증상 3: FullCalendar 표시 안 됨
**원인**: FullCalendar CDN 누락
**해결**: HTML head에 CDN 확인
```html
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>
```

### 증상 4: CSS 스타일 깨짐
**원인**: meeting-v2.css 누락
**해결**:
```bash
cp professor-v3/assets/css/meeting-v2.css.backup professor-v3/assets/css/meeting-v2.css
```

## 📞 긴급 연락

롤백 후에도 문제가 지속되면:
1. 백업 파일 무결성 확인
2. Git 커밋 히스토리에서 이전 버전 확인
3. 브라우저 개발자도구 Console 에러 메시지 확인

## 📝 V3 구현 시 주의사항

1. **절대 백업 파일 삭제 금지**: V3가 완전히 검증될 때까지 .backup 파일 유지
2. **점진적 구현**: 한 번에 모든 기능 교체하지 말고 단계별 테스트
3. **기능 동등성 검증**: V2의 모든 기능이 V3에서 동일하게 작동하는지 확인
4. **데이터 호환성**: V2 데이터 구조를 V3에서도 읽을 수 있도록 마이그레이션 로직 작성

## ✅ V3 검증 완료 후

V3가 완전히 검증되면:
```bash
# 백업 파일 삭제 (선택적)
rm professor-v3/assets/js/*.backup
rm professor-v3/*.backup
rm professor-v3/assets/css/*.backup

# Git 커밋
git add .
git commit -m "feat: 교수용 실시간 지도 예약 V3 구현 완료"
```

---

**작성일**: 2026-01-08
**대상 버전**: meeting-v2 → meeting-v3
**롤백 테스트 완료**: ⬜ 미완료 / ☑️ 완료
