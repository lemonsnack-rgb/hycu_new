from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import sys
import io

# UTF-8 출력 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

service = Service(ChromeDriverManager().install())
options = webdriver.ChromeOptions()
# 브라우저 창 유지
options.add_experimental_option("detach", False)

driver = webdriver.Chrome(service=service, options=options)

try:
    driver.get('file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/professor-v3/professor-dashboard-proposal.html')
    driver.maximize_window()
    time.sleep(2)

    print('=== 상세 제출 후 화면 상태 테스트 ===\n')

    # 1. 심사 화면 열기
    print('[1] 심사 화면 열기')
    driver.execute_script('showScreen("review");')
    time.sleep(1)
    driver.execute_script('openReviewDetail("RA_TEST_CHAIR", "chair");')
    time.sleep(2)

    # 2. 제출 전 버튼 상태
    print('\n[2] 제출 전 버튼 상태')
    before_buttons = driver.execute_script('''
        return {
            pass: document.getElementById('btn-pass') ? !document.getElementById('btn-pass').disabled : false,
            conditional: document.getElementById('btn-conditional') ? !document.getElementById('btn-conditional').disabled : false,
            fail: document.getElementById('btn-fail') ? !document.getElementById('btn-fail').disabled : false
        };
    ''')
    print(f'  합격 버튼 활성: {before_buttons["pass"]}')
    print(f'  조건부합격 버튼 활성: {before_buttons["conditional"]}')
    print(f'  불합격 버튼 활성: {before_buttons["fail"]}')

    # 3. 조건부합격 선택 및 재심 정보 입력
    print('\n[3] 조건부합격 선택 및 재심 정보 입력')
    driver.execute_script('selectDecision("조건부합격");')
    time.sleep(1)

    driver.execute_script('''
        document.querySelector('input[name="resubmission-reviewer-type"][value="committee"]').click();
        document.getElementById("resubmission-template-id").value = "TMPL_PROPOSAL";
        document.getElementById("resubmission-deadline").value = "2025-12-31";
        document.getElementById("chair-final-comment").value = "연구 방법론 보완 후 재심 요청.";
    ''')
    time.sleep(1)

    # 4. 제출
    print('\n[4] 최종 결정 제출')
    driver.execute_script('submitChairDecision();')
    time.sleep(2.5)  # setTimeout 1초 + 렌더링 여유

    # 5. 제출 후 버튼 상태 확인
    print('\n[5] 제출 후 버튼 상태')
    after_buttons = driver.execute_script('''
        return {
            pass: document.getElementById('btn-pass') ? !document.getElementById('btn-pass').disabled : null,
            conditional: document.getElementById('btn-conditional') ? !document.getElementById('btn-conditional').disabled : null,
            fail: document.getElementById('btn-fail') ? !document.getElementById('btn-fail').disabled : null,
            passExists: !!document.getElementById('btn-pass'),
            conditionalExists: !!document.getElementById('btn-conditional'),
            failExists: !!document.getElementById('btn-fail')
        };
    ''')
    print(f'  합격 버튼 존재: {after_buttons["passExists"]}, 활성: {after_buttons["pass"]}')
    print(f'  조건부합격 버튼 존재: {after_buttons["conditionalExists"]}, 활성: {after_buttons["conditional"]}')
    print(f'  불합격 버튼 존재: {after_buttons["failExists"]}, 활성: {after_buttons["fail"]}')

    # 6. 제출 후 화면 컨텐츠 확인
    print('\n[6] 제출 후 화면 컨텐츠')
    content_info = driver.execute_script('''
        var container = document.querySelector('#review-detail-content');
        if (!container) return { error: 'Container not found' };

        var html = container.innerHTML;
        return {
            length: html.length,
            hasDecisionButtons: html.includes('btn-pass'),
            hasResubmissionInfo: html.includes('재심 정보'),
            hasSubmittedStatus: html.includes('제출됨') || html.includes('제출 완료'),
            sample: html.substring(0, 500)
        };
    ''')

    if 'error' in content_info:
        print(f'  ERROR: {content_info["error"]}')
    else:
        print(f'  Content length: {content_info["length"]} chars')
        print(f'  Has decision buttons: {content_info["hasDecisionButtons"]}')
        print(f'  Has resubmission info: {content_info["hasResubmissionInfo"]}')
        print(f'  Has submitted status: {content_info["hasSubmittedStatus"]}')

    # 7. Console 로그 확인
    print('\n[7] Console 로그 확인')
    logs = driver.get_log('browser')
    recent_logs = [log for log in logs[-20:] if 'REVIEW_RESULTS' in log['message'] or 'renderReviewDetail' in log['message']]
    if recent_logs:
        for log in recent_logs:
            print(f'  {log["level"]}: {log["message"][:200]}')
    else:
        print('  관련 로그 없음')

    # 8. 제출 후 재심 영역 표시 여부
    print('\n[8] 제출 후 재심 정보 표시 여부')
    resubmission_display = driver.execute_script('''
        var section = document.getElementById('resubmission-info-section');
        return {
            exists: !!section,
            display: section ? section.style.display : null,
            visible: section ? section.offsetParent !== null : false
        };
    ''')
    print(f'  재심 영역 존재: {resubmission_display["exists"]}')
    print(f'  Display style: {resubmission_display["display"]}')
    print(f'  실제 표시: {resubmission_display["visible"]}')

    print('\n=== 브라우저를 15초간 유지합니다 (직접 확인 가능) ===')
    print('브라우저 창에서 화면을 직접 확인하세요.')
    time.sleep(15)

except Exception as e:
    print(f'\n오류 발생: {e}')
    import traceback
    traceback.print_exc()
    time.sleep(5)
finally:
    driver.quit()
