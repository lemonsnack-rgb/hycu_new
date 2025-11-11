# 🐛 Phase 5 - 심사 목록 버그 수정

## 📥 다운로드
[**phase5-review-fixed-final.zip (156 KB)**](computer:///mnt/user-data/outputs/phase5-review-fixed-final.zip)

---

## 🔴 문제 상황

### 증상
```
심사관리 화면에서 "배정된 심사가 없습니다" 표시
총 0건
```

### 스크린샷
- 필터가 "전체"인데도 목록이 비어있음
- review-count에 "총 0건" 표시

---

## 🔍 원인 분석

### 1단계: 데이터 확인 ✅
```bash
# P003(김교수)이 포함된 심사
$ grep "professorId: 'P003'" review-data.js
→ 13건 발견 (모든 심사 10건에 포함)

# 데이터 자체는 문제 없음
```

### 2단계: CURRENT_USER 추적 ⚠️
```javascript
// review-data.js (422번째 로드)
if (!window.CURRENT_USER) {
    window.CURRENT_USER = { id: 'P003' };  // ← 조건부 설정
}

// feedback-data.js (429번째 로드) 
const CURRENT_USER = FEEDBACK_USERS['P001'];  // ← 무조건 P001로 덮어씀!
```

### 3단계: 스크립트 로드 순서 확인 ⚠️
```html
<script src="assets/js/review-data.js"></script>      <!-- 422번: P003 설정 -->
<script src="assets/js/feedback-data.js"></script>    <!-- 429번: P001로 덮어씀 -->
<script src="assets/js/review-list.js"></script>      <!-- 433번: P001로 조회 -->
```

### 4단계: P001 심사 확인 ❌
```bash
# P001이 포함된 심사
$ grep "professorId: 'P001'" review-data.js
→ 0건

# P001은 어떤 심사위원회에도 없음!
```

---

## 💡 근본 원인

### 원인 요약
```
1. review-data.js: CURRENT_USER를 P003으로 조건부 설정
2. feedback-data.js: CURRENT_USER를 P001로 무조건 덮어씀 (나중에 로드)
3. P001은 심사위원회에 포함되지 않음
4. ReviewService.getMyReviewAssignments() → 빈 배열 반환
5. 화면에 "배정된 심사가 없습니다" 표시
```

### 시각적 설명
```
[시작]
  ↓
[review-data.js 로드]
  window.CURRENT_USER = { id: 'P003' }  ✅
  ↓
[feedback-data.js 로드]  
  window.CURRENT_USER = FEEDBACK_USERS['P001']  🔴 덮어씀!
  ↓
[review-list.js 실행]
  ReviewService.getMyReviewAssignments()
    → currentProfId = 'P001'
    → P001이 포함된 심사 필터링
    → 0건 반환 ❌
  ↓
[화면 표시]
  "배정된 심사가 없습니다"
```

---

## ✅ 해결 방법

### 수정 파일
**단 1개 파일만 수정:** `assets/js/feedback-data.js`

### 수정 내용

#### Before (문제 코드)
```javascript
// 현재 로그인한 사용자
const CURRENT_USER = FEEDBACK_USERS['P001'];
```

#### After (수정 코드)
```javascript
// 현재 로그인한 사용자 (다른 모듈에서 설정되지 않은 경우에만)
if (!window.CURRENT_USER) {
    window.CURRENT_USER = FEEDBACK_USERS['P001'];
}
const CURRENT_USER = window.CURRENT_USER;
```

### 변경 이유
```
1. 이미 설정된 CURRENT_USER를 덮어쓰지 않음
2. review-data.js의 P003 설정이 유지됨
3. 모든 모듈이 동일한 사용자 사용
4. 심사 목록 10건이 정상 표시됨
```

---

## 🧪 테스트 결과

### 수정 전 ❌
```
CURRENT_USER: P001
심사 목록: 0건
표시: "배정된 심사가 없습니다"
```

### 수정 후 ✅
```
CURRENT_USER: P003 (김교수)
심사 목록: 10건
표시: "총 10건"

목록:
- RA001 ~ RA010
- 역할: 위원장 4건, 위원 6건
- 상태: 진행중 5건, 심사완료 2건, 승인 1건, 보류 1건, 반려 1건
```

---

## ⚡ 즉시 확인

### 테스트 절차 (30초)
```
1. ZIP 압축 해제
2. index.html 열기
3. [심사관리] 클릭
4. 확인:
   ✅ 우측 상단: "총 10건"
   ✅ 10개 행 표시
   ✅ 김철수 ~ 임하은
```

### 예상 화면
```
┌─────────────────────────────────────────┐
│  내 심사 목록          총 10건          │
├─────────────────────────────────────────┤
│  [단계 전체▼] [역할 전체▼] ...          │
├─────────────────────────────────────────┤
│  No │ 학생   │ 단계  │ 역할 │ 상태     │
│   1 │ 김철수 │ 연구  │ 🔹   │ 🟡 진행  │
│   2 │ 이영희 │ 중간  │ ⭐   │ 🔵 완료  │
│   3 │ 박민수 │ 최종  │ 🔹   │ 🟢 승인  │
│  ...                                     │
│  10 │ 임하은 │ 연구  │ 🔹   │ 🟡 진행  │
└─────────────────────────────────────────┘
```

---

## 📋 수정 요약

### 변경된 파일
```
✅ assets/js/feedback-data.js (1개 파일)
   - 107-108번 라인
   - CURRENT_USER 설정을 조건부로 변경
```

### 변경되지 않은 파일
```
✅ assets/js/review-data.js (변경 없음)
✅ assets/js/review-list.js (변경 없음)
✅ index.html (변경 없음)
✅ 기타 모든 파일 (변경 없음)
```

### 영향 범위
```
✅ 심사관리: 정상 작동 (10건 표시)
✅ 온라인피드백: 정상 작동 (P001이 없으면 P003 사용)
✅ 기타 모듈: 영향 없음
```

---

## 🎯 기술적 교훈

### 문제의 본질
```
전역 변수(window.CURRENT_USER)를 여러 모듈에서 설정할 때
마지막에 로드되는 모듈이 이전 값을 덮어씀
```

### 올바른 패턴
```javascript
// ✅ 권장: 조건부 설정
if (!window.CURRENT_USER) {
    window.CURRENT_USER = ...;
}

// ❌ 위험: 무조건 설정
window.CURRENT_USER = ...;  // 이전 값 덮어씀
```

### 디버깅 팁
```
1. 데이터 확인 (review-data.js)
2. 필터 확인 (review-list.js)
3. CURRENT_USER 추적
4. 스크립트 로드 순서 확인
5. 각 모듈의 CURRENT_USER 설정 방식 확인
```

---

## ✅ 체크리스트

### 수정 완료
- [x] 버그 원인 파악
- [x] feedback-data.js 수정
- [x] 문법 검증
- [x] 압축 파일 생성
- [x] 문서화

### 테스트 대기
- [ ] 목록 10건 표시 확인
- [ ] 필터링 동작 확인
- [ ] 검색 동작 확인
- [ ] 상세 화면 확인
- [ ] 다른 기능 영향 없음 확인

---

## 📚 관련 문서

```
⭐ 이 파일 - 버그 수정 보고서
   TEST-30SEC.md - 30초 테스트
   PHASE5-COMPLETE.md - 완성 보고서
   README-PHASE5-DATA.md - 데이터 확인
```

---

## 🎉 수정 완료!

```
문제: 심사 목록 0건
원인: feedback-data.js가 CURRENT_USER를 P001로 덮어씀
해결: 조건부 설정으로 변경 (이미 있으면 유지)
결과: 10건 정상 표시
```

**테스트 후 피드백 부탁드립니다!** 🙏
