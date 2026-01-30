from selenium import webdriver
from selenium.webdriver.common.by import By
import time

options = webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('--incognito')

driver = webdriver.Chrome(options=options)

try:
    file_path = r'g:\내 드라이브\00_프로젝트\01_한양사이버대\hycu_new\professor-v3\professor-dashboard-proposal.html'
    driver.get(f'file:///{file_path}')
    time.sleep(2)

    print('=' * 80)
    print('재심 기능 전체 테스트')
    print('=' * 80)

    # Setup
    driver.execute_script('showScreen("review");')
    time.sleep(1)
    driver.execute_script('window.currentProfessorId = "P002";')
    driver.execute_script('renderReviewDetail("RA_TEST_CHAIR", "chair", false);')
    time.sleep(2)

    # Test 1: 버튼 상태 확인
    print('\n[Test 1] 버튼 enabled 상태 확인')
    btn_disabled = driver.execute_script('return document.getElementById("btn-conditional") ? document.getElementById("btn-conditional").disabled : null;')
    if btn_disabled == False:
        print('PASS 조건부합격 버튼 enabled')
    else:
        print(f'FAIL 조건부합격 버튼 disabled (예상: enabled)')
        raise Exception('버튼이 disabled 상태입니다')

    # Test 2: 조건부합격 선택 → 재심 영역 표시
    print('\n[Test 2] 조건부합격 선택 → 재심 영역 표시')
    driver.execute_script('selectDecision("조건부합격");')
    time.sleep(1)

    display = driver.execute_script('return document.getElementById("resubmission-info-section") ? document.getElementById("resubmission-info-section").style.display : "NOT_FOUND";')
    if display == 'block':
        print('PASS 재심 정보 영역 표시됨')
    else:
        print(f'FAIL 재심 정보 영역 표시 안 됨 (display: {display})')
        raise Exception('재심 정보 영역이 표시되지 않음')

    # Test 3: 재심 심사위원 옵션 확인
    print('\n[Test 3] 재심 심사위원 옵션 확인')
    reviewer_options = driver.execute_script('''
        var select = document.getElementById("resubmission-reviewer-id");
        if (!select) return null;
        var options = [];
        for (var i = 0; i < select.options.length; i++) {
            options.push({value: select.options[i].value, text: select.options[i].text});
        }
        return options;
    ''')

    if reviewer_options and len(reviewer_options) > 1:  # 1개는 "심사위원 선택" placeholder
        print(f'PASS 심사위원 옵션 {len(reviewer_options)}개')
        for opt in reviewer_options:
            print(f'  - {opt["text"]} (value: {opt["value"]})')
    else:
        print(f'FAIL 심사위원 옵션 없음')

    # Test 4: 평가표 옵션 확인
    print('\n[Test 4] 평가표 옵션 확인')
    template_options = driver.execute_script('''
        var select = document.getElementById("resubmission-template-id");
        if (!select) return null;
        var options = [];
        for (var i = 0; i < select.options.length; i++) {
            options.push({value: select.options[i].value, text: select.options[i].text});
        }
        return options;
    ''')

    if template_options and len(template_options) > 1:
        print(f'PASS 평가표 옵션 {len(template_options)}개')
        for opt in template_options:
            print(f'  - {opt["text"]} (value: {opt["value"]})')
    else:
        print(f'FAIL 평가표 옵션 없음')

    # Test 5: 재심 정보 입력 및 제출
    print('\n[Test 5] 재심 정보 입력 및 제출')

    # 5-1: 심사위원회 전체 선택
    driver.execute_script('document.querySelector(\'input[name="resubmission-reviewer-type"][value="committee"]\').click();')
    time.sleep(0.5)
    print('PASS 심사위원회 (전체) 선택')

    # 5-2: 평가표 선택 (첫 번째 평가표)
    if template_options and len(template_options) > 1:
        template_id = template_options[1]['value']  # 0은 placeholder
        driver.execute_script(f'document.getElementById("resubmission-template-id").value = "{template_id}";')
        print(f'PASS 평가표 선택: {template_options[1]["text"]}')
    else:
        print('FAIL 평가표 선택 불가')

    # 5-3: 재심 마감일 입력
    driver.execute_script('document.getElementById("resubmission-deadline").value = "2025-12-31";')
    print('PASS 재심 마감일 입력: 2025-12-31')

    # 5-4: 최종 의견 입력
    driver.execute_script('document.getElementById("chair-final-comment").value = "연구 방법론 보완 후 재심 요청.";')
    print('PASS 최종 의견 입력')

    # 5-5: 제출 (실제로는 제출하지 않고 검증만)
    print('\n[Test 6] 제출 전 데이터 검증')
    validation = driver.execute_script('''
        var decision = selectedChairDecision;
        var comment = document.getElementById("chair-final-comment").value.trim();
        var reviewerType = document.querySelector('input[name="resubmission-reviewer-type"]:checked');
        var templateId = document.getElementById("resubmission-template-id").value;
        var deadline = document.getElementById("resubmission-deadline").value;

        return {
            decision: decision,
            comment: comment,
            reviewerType: reviewerType ? reviewerType.value : null,
            templateId: templateId,
            deadline: deadline,
            valid: decision === "조건부합격" && comment !== "" && reviewerType && templateId && deadline
        };
    ''')

    print(f'  결정: {validation["decision"]}')
    print(f'  의견: {validation["comment"][:30]}...')
    print(f'  재심 심사위원: {validation["reviewerType"]}')
    print(f'  평가표: {validation["templateId"]}')
    print(f'  마감일: {validation["deadline"]}')

    if validation['valid']:
        print('\nPASS 모든 재심 정보 유효성 검증 통과')
    else:
        print('\nFAIL 재심 정보 유효성 검증 실패')
        raise Exception('재심 정보가 유효하지 않음')

    print('\n' + '=' * 80)
    print('모든 테스트 통과!')
    print('=' * 80)

except Exception as e:
    print(f'\n오류 발생: {e}')
    import traceback
    traceback.print_exc()
finally:
    driver.quit()
