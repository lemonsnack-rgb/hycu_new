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
    time.sleep(2)

    print('=== 재심 정보 REVIEW_RESULTS 저장 테스트 ===\n')

    # 1. 심사 화면 열기
    print('[1] 심사 화면 열기')
    driver.execute_script('showScreen("review");')
    time.sleep(1)
    driver.execute_script('openReviewDetail("RA_TEST_CHAIR", "chair");')
    time.sleep(2)
    print('  완료')

    # 2. 조건부합격 선택 및 재심 정보 입력
    print('\n[2] 조건부합격 선택 및 재심 정보 입력')
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

    # 3. 제출 전 REVIEW_RESULTS 상태 확인
    print('\n[3] 제출 전 REVIEW_RESULTS 상태 확인')
    before = driver.execute_script('''
        var result = REVIEW_RESULTS.find(r => r.assignmentId === 'RA_TEST_CHAIR');
        return {
            chairDecision: result ? result.chairDecision : null,
            resubmission: result ? result.resubmission : null
        };
    ''')
    print(f'  chairDecision: {before["chairDecision"]}')
    print(f'  resubmission: {before["resubmission"]}')

    # 4. 제출
    print('\n[4] 최종 결정 제출')
    driver.execute_script('submitChairDecision();')
    time.sleep(2)
    print('  완료')

    # 5. 제출 후 REVIEW_RESULTS 확인
    print('\n[5] 제출 후 REVIEW_RESULTS 확인')
    after = driver.execute_script('''
        var result = REVIEW_RESULTS.find(r => r.assignmentId === 'RA_TEST_CHAIR');
        return {
            chairDecision: result ? result.chairDecision : null,
            chairComment: result ? result.chairComment : null,
            chairDecidedAt: result ? result.chairDecidedAt : null,
            chairDecidedBy: result ? result.chairDecidedBy : null,
            resubmission: result ? result.resubmission : null,
            finalDecision: result ? result.finalDecision : null
        };
    ''')

    print(f'  chairDecision: {after["chairDecision"]}')
    print(f'  chairComment: {after["chairComment"]}')
    print(f'  chairDecidedAt: {after["chairDecidedAt"]}')
    print(f'  chairDecidedBy: {after["chairDecidedBy"]}')
    print(f'  finalDecision: {after["finalDecision"]}')

    # 6. 검증
    print('\n[6] 검증')
    if after['chairDecision'] == '조건부합격' and after['resubmission'] is not None:
        print('  ✅ PASS: REVIEW_RESULTS에 재심 정보가 정상 저장됨!')

        resub = after['resubmission']
        print(f'\n재심 정보 상세:')
        print(f'  required: {resub.get("required")}')
        print(f'  reviewerType: {resub.get("reviewerType")}')
        print(f'  reviewerId: {resub.get("reviewerId")}')
        print(f'  evaluationTemplateId: {resub.get("evaluationTemplateId")}')
        print(f'  deadline: {resub.get("deadline")}')
        print(f'  attemptNumber: {resub.get("attemptNumber")}')
        print(f'  status: {resub.get("status")}')
        print(f'  createdAt: {resub.get("createdAt")}')
    else:
        print('  ❌ FAIL: REVIEW_RESULTS에 재심 정보가 저장되지 않음!')
        raise Exception('재심 정보 저장 실패')

    print('\n' + '=' * 80)
    print('모든 테스트 통과!')
    print('=' * 80)
    time.sleep(3)

except Exception as e:
    print(f'\n오류 발생: {e}')
    import traceback
    traceback.print_exc()
    time.sleep(3)
finally:
    driver.quit()
