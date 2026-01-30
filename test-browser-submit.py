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

    print('=== 브라우저 제출 후 화면 렌더링 테스트 ===\n')

    # 1. 심사 화면 열기
    print('[1] 심사 화면 열기')
    driver.execute_script('showScreen("review");')
    time.sleep(1)
    driver.execute_script('openReviewDetail("RA_TEST_CHAIR", "chair");')
    time.sleep(2)
    print('  완료')

    # 2. 초기 화면 상태 확인
    print('\n[2] 초기 모달 컨텐츠 확인')
    initial_content = driver.execute_script('''
        var modal = document.getElementById('review-detail-screen');
        var container = modal ? modal.querySelector('#review-detail-content') : null;
        return {
            modalExists: !!modal,
            containerExists: !!container,
            contentLength: container ? container.innerHTML.length : 0
        };
    ''')
    print(f'  Modal exists: {initial_content["modalExists"]}')
    print(f'  Container exists: {initial_content["containerExists"]}')
    print(f'  Content length: {initial_content["contentLength"]} chars')

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
    print('  완료')

    # 4. 제출
    print('\n[4] 최종 결정 제출')
    driver.execute_script('submitChairDecision();')
    print('  제출 완료, 1초 대기...')
    time.sleep(1)

    # 5. 제출 직후 상태 확인 (setTimeout 전)
    print('\n[5] 제출 직후 상태 확인')
    after_submit = driver.execute_script('''
        var modal = document.getElementById('review-detail-screen');
        var container = modal ? modal.querySelector('#review-detail-content') : null;
        return {
            modalExists: !!modal,
            modalDisplay: modal ? window.getComputedStyle(modal).display : 'none',
            containerExists: !!container,
            contentLength: container ? container.innerHTML.length : 0
        };
    ''')
    print(f'  Modal exists: {after_submit["modalExists"]}')
    print(f'  Modal display: {after_submit["modalDisplay"]}')
    print(f'  Container exists: {after_submit["containerExists"]}')
    print(f'  Content length: {after_submit["contentLength"]} chars')

    # 6. 재렌더링 대기 (setTimeout 1초)
    print('\n[6] 재렌더링 대기 (1초)')
    time.sleep(1.5)

    # 7. 재렌더링 후 상태 확인
    print('\n[7] 재렌더링 후 상태 확인')
    after_rerender = driver.execute_script('''
        var modal = document.getElementById('review-detail-screen');
        var container = modal ? modal.querySelector('#review-detail-content') : null;
        return {
            modalExists: !!modal,
            modalDisplay: modal ? window.getComputedStyle(modal).display : 'none',
            containerExists: !!container,
            contentLength: container ? container.innerHTML.length : 0,
            hasButtons: !!document.getElementById('btn-pass')
        };
    ''')
    print(f'  Modal exists: {after_rerender["modalExists"]}')
    print(f'  Modal display: {after_rerender["modalDisplay"]}')
    print(f'  Container exists: {after_rerender["containerExists"]}')
    print(f'  Content length: {after_rerender["contentLength"]} chars')
    print(f'  Has buttons: {after_rerender["hasButtons"]}')

    # 8. REVIEW_RESULTS 확인
    print('\n[8] REVIEW_RESULTS 저장 확인')
    result_data = driver.execute_script('''
        var result = REVIEW_RESULTS.find(r => r.assignmentId === 'RA_TEST_CHAIR');
        return {
            chairDecision: result ? result.chairDecision : null,
            resubmission: result ? result.resubmission : null
        };
    ''')
    print(f'  chairDecision: {result_data["chairDecision"]}')
    print(f'  resubmission exists: {result_data["resubmission"] is not None}')

    # 9. 검증
    print('\n[9] 검증')
    if after_rerender['contentLength'] > 1000:
        print('  ✅ PASS: 재렌더링 후 컨텐츠가 정상 표시됨')
    else:
        print(f'  ❌ FAIL: 재렌더링 후 컨텐츠가 비어있음 ({after_rerender["contentLength"]} chars)')

    if result_data['chairDecision'] == '조건부합격':
        print('  ✅ PASS: REVIEW_RESULTS에 결정 저장됨')
    else:
        print('  ❌ FAIL: REVIEW_RESULTS에 저장 안됨')

    print('\n브라우저를 10초간 유지합니다 (직접 확인 가능)...')
    time.sleep(10)

except Exception as e:
    print(f'\n오류 발생: {e}')
    import traceback
    traceback.print_exc()
    time.sleep(5)
finally:
    driver.quit()
