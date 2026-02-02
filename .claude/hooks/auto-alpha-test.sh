#!/bin/bash
# ================================================================
# Auto Alpha Test Hook
# ================================================================
# PostToolUse Hook: 파일 수정 시 자동으로 알파테스트 시작
#
# 동작:
# 1. Edit/Write 도구로 JS/Python 파일 수정 감지
# 2. 관련 테스트 파일 존재 여부 확인
# 3. 테스트 파일이 있으면 alpha-tester subagent 자동 호출
# 4. alpha-tester가 3회까지 자동 수정-재테스트

# 입력 데이터 읽기
INPUT=$(cat)

# 도구 이름 추출
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Edit 또는 Write 도구가 아니면 종료
if [[ ! "$TOOL_NAME" =~ ^(Edit|Write)$ ]]; then
  exit 0
fi

# 파일 경로 추출
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 파일 경로가 없으면 종료
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# JavaScript 또는 Python 파일이 아니면 종료
if [[ ! "$FILE_PATH" =~ \.(js|py)$ ]]; then
  exit 0
fi

# 테스트 파일 자체는 제외
if [[ "$FILE_PATH" =~ ^test- ]] || [[ "$FILE_PATH" =~ /test- ]]; then
  exit 0
fi

# 문서 파일 제외
if [[ "$FILE_PATH" =~ \.(md|txt|csv|xlsx)$ ]]; then
  exit 0
fi

# 관련 테스트 파일 패턴 결정
TEST_PATTERN=""
TEST_AREA=""

if [[ "$FILE_PATH" =~ professor-v3 ]]; then
  TEST_PATTERN="test-professor-*.py"
  TEST_AREA="professor"
elif [[ "$FILE_PATH" =~ admin-v3 ]]; then
  TEST_PATTERN="test-admin-*.py"
  TEST_AREA="admin"
elif [[ "$FILE_PATH" =~ student-v3 ]]; then
  TEST_PATTERN="test-student-*.py"
  TEST_AREA="student"
else
  # 다른 영역은 알파테스트 하지 않음
  exit 0
fi

# 프로젝트 루트로 이동
cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || cd "$(dirname "$0")/../../.." || exit 0

# 관련 테스트 파일 찾기
TEST_FILES=$(ls $TEST_PATTERN 2>/dev/null | head -5)

if [ -z "$TEST_FILES" ]; then
  # 테스트 파일이 없으면 알림만 하고 종료
  echo "{
    \"systemMessage\": \"ℹ️ 파일 수정 완료: $FILE_PATH\n\n관련 테스트 파일이 없어 알파테스트를 건너뜁니다.\n테스트 파일을 추가하려면 $TEST_PATTERN 형식으로 생성해주세요.\"
  }"
  exit 0
fi

# 테스트 파일 개수
TEST_COUNT=$(echo "$TEST_FILES" | wc -l)

# alpha-tester subagent 호출 메시지 생성
echo "{
  \"systemMessage\": \"🤖 파일 수정 감지: $FILE_PATH\n\n자동 알파테스트를 시작합니다...\n테스트 대상: $TEST_AREA 영역 (${TEST_COUNT}개 파일)\n\n[진행 중] 테스트 실행 → 디버그 → 자동 수정 (최대 3회)\n최종 결과만 보고됩니다. 잠시만 기다려주세요.\",
  \"continueWith\": {
    \"tool\": \"Task\",
    \"parameters\": {
      \"subagent_type\": \"alpha-tester\",
      \"description\": \"Auto alpha test\",
      \"prompt\": \"A file was modified: $FILE_PATH\n\nRun alpha testing for the $TEST_AREA area:\n- Find and run the most relevant test file from: $TEST_FILES\n- If tests fail, automatically debug and fix (up to 3 attempts)\n- Use Headless=False for UI tests (browser must be visible)\n- Report final results only (do not report intermediate steps)\n\nImportant:\n- Run pytest with: python -m pytest [file] -v --tb=long -s\n- Maximum 3 fix attempts\n- Each fix should be minimal and targeted\n- Keep detailed logs of all attempts\"
    }
  }
}"

exit 0
