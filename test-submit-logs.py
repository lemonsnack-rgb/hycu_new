from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import sys
import io

# UTF-8 출력 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

service = Service(ChromeDriverManager().install())

# Console 로그 수집 활성화
options = webdriver.ChromeOptions()
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

driver = webdriver.Chrome(service=service, options=options)

try:
    driver.get('file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/professor-v3/professor-dashboard-proposal.html')
    driver.maximize_window()
    time.sleep(2)

    print('=== 제출 로그 테스트 ===\n')

    # 심사 화면 열기
    driver.execute_script('showScreen("review"); openReviewDetail("RA_TEST_CHAIR", "chair");')
    time.sleep(2)

    # 조건부합격 선택 및 제출
    driver.execute_script('''
        selectDecision("조건부합격");
        setTimeout(() => {
            document.querySelector('input[name="resubmission-reviewer-type"][value="committee"]').click();
            document.getElementById("resubmission-template-id").value = "TMPL_PROPOSAL";
            document.getElementById("resubmission-deadline").value = "2025-12-31";
            document.getElementById("chair-final-comment").value = "재심 요청";
        }, 500);
    ''')
    time.sleep(2)

    # 제출
    print('[1] 제출 실행')
    driver.execute_script('submitChairDecision();')
    time.sleep(3)

    # Console 로그 수집
    print('\n[2] Console 로그:')
    logs = driver.get_log('browser')
    relevant_logs = [log for log in logs if any(kw in log['message'] for kw in [
        '✅', '⏰', '❌', '🔍', 'submitChairDecision', 'renderReviewDetail', 'currentProfessorId'
    ])]

    if relevant_logs:
        for log in relevant_logs[-30:]:
            level = log['level']
            msg = log['message']
            # 메시지 정리
            if 'console-api' in msg:
                msg = msg.split('console-api')[1] if 'console-api' in msg else msg
            print(f'  [{level}] {msg[:400]}')
    else:
        print('  관련 로그 없음')

    # 화면 상태
    print('\n[3] 화면 상태:')
    state = driver.execute_script('''
        return {
            contentLength: document.querySelector('#review-detail-content') ? document.querySelector('#review-detail-content').innerHTML.length : 0,
            currentProfessorId: window.currentProfessorId,
            chairDecision: REVIEW_RESULTS.find(r => r.assignmentId === 'RA_TEST_CHAIR')?.chairDecision
        };
    ''')
    print(f'  Content length: {state["contentLength"]} chars')
    print(f'  currentProfessorId: {state["currentProfessorId"]}')
    print(f'  REVIEW_RESULTS.chairDecision: {state["chairDecision"]}')

    time.sleep(5)

except Exception as e:
    print(f'\n오류: {e}')
    import traceback
    traceback.print_exc()
finally:
    driver.quit()
