from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import sys
import io

# UTF-8 출력 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

try:
    driver.get('file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/professor-v3/professor-dashboard-proposal.html')
    driver.maximize_window()
    time.sleep(2)

    print('=== 재렌더링 디버깅 테스트 ===\n')

    # 1. 초기 상태 확인
    print('[1] 초기 상태')
    initial = driver.execute_script('''
        return {
            currentUser: window.CURRENT_USER ? window.CURRENT_USER.id : null,
            currentProfessorId: window.currentProfessorId || null
        };
    ''')
    print(f'  CURRENT_USER: {initial["currentUser"]}')
    print(f'  currentProfessorId: {initial["currentProfessorId"]}')

    # 2. 심사 화면 열기
    print('\n[2] 심사 화면 열기')
    driver.execute_script('showScreen("review");')
    time.sleep(1)
    driver.execute_script('openReviewDetail("RA_TEST_CHAIR", "chair");')
    time.sleep(2)

    # 3. 열린 후 상태
    print('\n[3] 열린 후 currentProfessorId')
    after_open = driver.execute_script('return window.currentProfessorId;')
    print(f'  currentProfessorId: {after_open}')

    # 4. 조건부합격 선택 및 제출
    print('\n[4] 조건부합격 선택 및 제출')
    driver.execute_script('selectDecision("조건부합격");')
    time.sleep(1)

    driver.execute_script('''
        document.querySelector('input[name="resubmission-reviewer-type"][value="committee"]').click();
        document.getElementById("resubmission-template-id").value = "TMPL_PROPOSAL";
        document.getElementById("resubmission-deadline").value = "2025-12-31";
        document.getElementById("chair-final-comment").value = "연구 방법론 보완 후 재심 요청.";
    ''')
    time.sleep(0.5)

    # 5. 제출 직전 상태
    print('\n[5] 제출 직전 currentProfessorId')
    before_submit = driver.execute_script('return window.currentProfessorId;')
    print(f'  currentProfessorId: {before_submit}')

    # 6. 제출
    print('\n[6] 제출')
    driver.execute_script('submitChairDecision();')
    print('  제출 완료')

    # 7. 제출 직후 (setTimeout 전)
    time.sleep(0.5)
    print('\n[7] 제출 직후 currentProfessorId')
    after_submit = driver.execute_script('return window.currentProfessorId;')
    print(f'  currentProfessorId: {after_submit}')

    # 8. setTimeout 후
    time.sleep(2)
    print('\n[8] setTimeout 후 currentProfessorId')
    after_timeout = driver.execute_script('return window.currentProfessorId;')
    print(f'  currentProfessorId: {after_timeout}')

    # 9. 컨텐츠 확인
    print('\n[9] 렌더링된 컨텐츠')
    content = driver.execute_script('''
        var container = document.querySelector('#review-detail-content');
        return {
            length: container ? container.innerHTML.length : 0,
            sample: container ? container.innerHTML.substring(0, 200) : ''
        };
    ''')
    print(f'  Content length: {content["length"]} chars')
    if content["length"] < 1000:
        print(f'  Sample: {content["sample"]}')

    # 10. Console 로그 (더 상세하게)
    print('\n[10] Console 로그')
    logs = driver.get_log('browser')
    for log in logs[-30:]:
        msg = log['message']
        if any(keyword in msg for keyword in ['renderReviewDetail', 'currentProfessorId', 'getCurrentProfessorId', '🎯', '❌']):
            print(f'  [{log["level"]}] {msg[:300]}')

    # 11. detail 객체 확인
    print('\n[11] ReviewService.getReviewDetail 결과')
    detail_info = driver.execute_script('''
        var detail = ReviewService.getReviewDetail('RA_TEST_CHAIR');
        return {
            exists: !!detail,
            myRole: detail ? detail.myRole : null,
            hasAssignment: detail ? !!detail.assignment : false,
            hasTemplate: detail ? !!detail.template : false,
            allEvalsCount: detail ? detail.allEvaluations.length : 0
        };
    ''')
    print(f'  detail exists: {detail_info["exists"]}')
    print(f'  myRole: {detail_info["myRole"]}')
    print(f'  hasAssignment: {detail_info["hasAssignment"]}')
    print(f'  hasTemplate: {detail_info["hasTemplate"]}')
    print(f'  allEvalsCount: {detail_info["allEvalsCount"]}')

    print('\n브라우저 10초 유지...')
    time.sleep(10)

except Exception as e:
    print(f'\n오류 발생: {e}')
    import traceback
    traceback.print_exc()
    time.sleep(5)
finally:
    driver.quit()
