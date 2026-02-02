"""
학술지논문제출 - 지도교수 입력란 비활성화 테스트
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

test_results = {"passed": 0, "failed": 0, "tests": []}

def log_test(test_name, passed, message):
    status = "[PASS]" if passed else "[FAIL]"
    print(f"\n{status}: {test_name}")
    print(f"   {message}")

    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1

    test_results["tests"].append({
        "name": test_name,
        "passed": passed,
        "message": message
    })

driver = webdriver.Chrome()

try:
    print("\n" + "="*80)
    print("학술지논문제출 - 지도교수 필드 비활성화 검증")
    print("="*80)

    url = "file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/student-v3/student-dashboard.html"
    driver.get(url)
    time.sleep(2)

    # 학술지논문제출 화면으로 이동
    driver.execute_script("showScreen('journal-submission');")
    time.sleep(2)

    # [제출] 버튼 클릭
    submit_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-action="submit"]')
    if len(submit_buttons) > 0:
        driver.execute_script("arguments[0].click();", submit_buttons[0])
        time.sleep(2)

    # Test 1: 지도교수 입력란이 readonly인지 확인
    try:
        advisor_input = driver.find_element(By.ID, 'journal-advisor')
        is_readonly = advisor_input.get_attribute('readonly')

        if is_readonly:
            log_test("지도교수 입력란 readonly", True, "readonly 속성이 적용됨")
        else:
            log_test("지도교수 입력란 readonly", False, "readonly 속성이 없음")
    except Exception as e:
        log_test("지도교수 입력란 readonly", False, str(e))

    # Test 2: 지도교수 입력란에 값이 자동으로 채워졌는지 확인
    try:
        advisor_input = driver.find_element(By.ID, 'journal-advisor')
        advisor_value = advisor_input.get_attribute('value')

        if advisor_value and len(advisor_value) > 0:
            log_test("지도교수 자동 입력", True, f"지도교수: '{advisor_value}'")
        else:
            log_test("지도교수 자동 입력", False, "지도교수 값이 비어있음")
    except Exception as e:
        log_test("지도교수 자동 입력", False, str(e))

    # Test 3: 배경색이 회색(bg-gray-100)인지 확인
    try:
        advisor_input = driver.find_element(By.ID, 'journal-advisor')
        classes = advisor_input.get_attribute('class')

        if 'bg-gray-100' in classes:
            log_test("지도교수 입력란 배경색", True, "bg-gray-100 클래스 적용됨")
        else:
            log_test("지도교수 입력란 배경색", False, f"클래스: {classes}")
    except Exception as e:
        log_test("지도교수 입력란 배경색", False, str(e))

    # 스크린샷
    driver.save_screenshot("test_journal_advisor_readonly.png")
    print("\n[SCREENSHOT] 저장: test_journal_advisor_readonly.png")

except Exception as e:
    print(f"\n[ERROR] {str(e)}")
    import traceback
    traceback.print_exc()

finally:
    print("\n" + "="*80)
    print("테스트 결과")
    print("="*80)
    print(f"총 테스트: {test_results['passed'] + test_results['failed']}")
    print(f"[PASS] 통과: {test_results['passed']}")
    print(f"[FAIL] 실패: {test_results['failed']}")

    if test_results['failed'] > 0:
        print("\n실패:")
        for test in test_results['tests']:
            if not test['passed']:
                print(f"  - {test['name']}: {test['message']}")

    time.sleep(5)
    driver.quit()
