---
name: alpha-test
description: 자동 알파테스트 실행. 코드 수정 후 테스트-디버그-수정을 자동 반복 (최대 3회)
---

# Alpha Test Skill

## 목적
코드 수정 완료 후 자동으로 알파테스트를 실행하여, AI가 의도한 대로 동작하는지 검증하고, 문제 발견 시 자동으로 수정합니다.

## 사용 시점

### 자동 사용 (권장)
- 사용자가 "수정하고 테스트까지 해줘"라고 요청
- 사용자가 "알파테스트까지 완료해줘"라고 요청
- 코드 수정 완료 후 Hook에 의해 자동 트리거

### 수동 사용
사용자가 명시적으로 다음과 같이 요청:
- "알파테스트 실행해줘"
- "자동으로 테스트하고 고쳐줘"
- "테스트 돌리고 문제 있으면 자동으로 수정해줘"

## 실행 절차

### Phase 1: 준비
1. 최근 수정된 파일 확인
2. 관련 테스트 파일 식별
   - `professor-v3/**/*.js` → `test-professor-*.py`
   - `admin-v3/**/*.js` → `test-admin-*.py`
   - `student-v3/**/*.js` → `test-student-*.py`
3. 테스트 파일 존재 확인

### Phase 2: Alpha-Tester 호출
alpha-tester subagent를 호출하여 자동 테스트-수정 사이클 실행:

```
Use the alpha-tester subagent to:
1. Run [identified test file]
2. If tests fail, debug and fix automatically (up to 3 attempts)
3. Report final results
```

### Phase 3: 결과 수신 및 보고
alpha-tester로부터 최종 결과를 받아 사용자에게 보고

## 보고 형식

### 성공 시
```
✅ 알파테스트 완료

수정 파일: professor-v3/assets/js/board.js
테스트 파일: test-professor-board.py
시도 횟수: 2회

수정 내역:
  • 1차: getCurrentUser() 메서드 호출 제거
    이유: DataService에 해당 메서드가 존재하지 않음

  • 2차: 전역 변수 currentUser 사용으로 변경
    이유: 파일 상단에 정의된 전역 currentUser 활용

테스트 결과: 전체 통과 ✓

다음 단계:
  - 코드 커밋 가능
  - 추가 수정 필요 없음
```

### 실패 시
```
⚠️ 알파테스트 실패 (3회 시도)

수정 파일: professor-v3/assets/js/board.js
테스트 파일: test-professor-board.py

남은 문제:
  • currentUser가 undefined 상태로 초기화됨
  • renderBoardWriteForm() 호출 시점에 currentUser가 설정되지 않음

에러 내용:
  TypeError: Cannot read property 'role' of undefined
  at renderBoardWriteForm (board.js:448)

시도한 수정:
  1차: getCurrentUser() 호출 제거
  2차: null 체크 추가
  3차: getProfessor() 직접 호출

근본 원인 추정:
  - initBoard() 함수가 제대로 호출되지 않거나
  - 호출 타이밍이 너무 빠름 (DOM 로드 전)
  - HTML에서 초기화 코드 누락 가능성

다음 조치 필요:
  1. professor-v3/index.html에서 initBoard() 호출 시점 확인
  2. DOMContentLoaded 이벤트 리스너 추가 검토
  3. 전역 currentUser 초기화 로직 전체 재검토

수동 개입이 필요합니다.
사용자님이 직접 HTML 파일을 확인해주시겠어요?
```

### 테스트 파일 없을 시
```
ℹ️ 알파테스트 스킵

이유: 수정된 파일에 대응하는 테스트 파일이 없습니다.

수정 파일: CLAUDE.md
테스트 파일: 없음

참고: 다음 파일은 테스트가 자동으로 실행됩니다:
  - professor-v3/assets/js/*.js → test-professor-*.py
  - admin-v3/assets/js/*.js → test-admin-*.py
  - student-v3/assets/js/*.js → test-student-*.py
```

## 사용 예시

### 예시 1: 버그 수정 후 자동 테스트
```
사용자: "교수 자료실 board.js에서 getCurrentUser 에러 수정하고 테스트까지 해줘"

Claude:
  [코드 분석 → 계획 수립 → 승인]
  [코드 수정 완료]
  [alpha-test skill 자동 실행]

  === alpha-tester 동작 ===
  1. test-professor-board.py 실행
  2. 1차 실패 → 수정 → 재테스트
  3. 성공 ✓

  ✅ 알파테스트 완료
  getCurrentUser() 호출을 제거하고 전역 currentUser 사용으로 변경했습니다.
  모든 테스트가 통과했습니다.

  커밋하시겠습니까?
```

### 예시 2: 명시적 호출
```
사용자: "알파테스트 실행해줘"

Claude:
  [최근 수정 파일 확인: board.js]
  [관련 테스트: test-professor-board.py]
  [alpha-test skill 실행]

  ✅ 알파테스트 완료
  모든 테스트 통과
```

### 예시 3: 3회 실패 케이스
```
사용자: "admin_modals.js 수정하고 알파테스트까지 해줘"

Claude:
  [코드 수정]
  [alpha-test skill 실행]

  === alpha-tester 동작 ===
  1차: 테스트 실패 → 모달 ID 수정 → 실패
  2차: 이벤트 리스너 추가 → 실패
  3차: 초기화 순서 변경 → 실패

  ⚠️ 알파테스트 3회 시도 후 실패

  근본 원인: HTML에서 모달 컨테이너가 누락된 것으로 추정
  다음 조치: admin-v3/index.html에 모달 컨테이너 추가 필요

  HTML 파일을 확인하고 수정할까요?
```

## 통합 워크플로우

### 일반적인 버그 수정 플로우
```
1. 사용자 요청: "○○ 버그 수정해줘"
   ↓
2. Claude 분석 및 계획 수립
   ↓
3. 사용자 승인
   ↓
4. 코드 수정 완료
   ↓
5. alpha-test skill 자동 실행
   ↓
6. alpha-tester가 3회까지 자동 수정
   ↓
7. 최종 결과 보고
   ↓
8. 성공 시: 커밋 제안
   실패 시: 추가 조치 제안
```

### Hook과 연동 시 (자동 모드)
```
1. 파일 수정 (Edit/Write)
   ↓
2. PostToolUse Hook 트리거
   ↓
3. Hook이 alpha-test skill 자동 호출
   ↓
4. alpha-tester 실행
   ↓
5. 백그라운드에서 자동 처리
   ↓
6. 최종 결과만 사용자에게 표시
```

## 주의사항

### 제한 사항
- 최대 3회 시도 후 중단
- 테스트 파일이 없으면 스킵
- UI 테스트는 Headless=False (브라우저 열림)

### 권장 사항
- 코드 수정 후 항상 이 skill 사용
- 실패 시 보고된 근본 원인을 확인
- 3회 실패 시 수동으로 개입

### 성능 고려
- 테스트 실행 시간: 평균 30초~2분
- 수정-재테스트 포함: 최대 5분
- Selenium 브라우저 실행으로 인한 리소스 사용

## 성공 조건

다음 중 하나가 되면 작업 완료:
1. ✅ 모든 테스트 통과 → 커밋 가능
2. ⚠️ 3회 실패 → 수동 개입 필요 보고
3. ℹ️ 테스트 없음 → 스킵

## 문제 해결

### Q: "테스트 파일을 찾을 수 없습니다"
A: 테스트 파일 명명 규칙 확인:
   - `test-professor-*.py`
   - `test-admin-*.py`
   - `test-student-*.py`

### Q: "pytest를 실행할 수 없습니다"
A: Python 환경 확인:
   ```bash
   python -m pytest --version
   pip install pytest selenium
   ```

### Q: "브라우저가 열리지 않습니다"
A: WebDriver 확인:
   - Chrome 설치 확인
   - ChromeDriver 설치 확인

### Q: "3회 실패 후 어떻게 하나요?"
A: 보고된 내용을 바탕으로:
   1. 근본 원인 확인
   2. 추가 조사 필요 영역 점검
   3. 수동으로 수정 후 다시 alpha-test 실행

## 관련 도구

- **alpha-tester subagent**: 실제 테스트-수정 로직 수행
- **PostToolUse Hook**: 자동 트리거
- **pytest**: Python 테스트 프레임워크
- **Selenium**: 브라우저 자동화
