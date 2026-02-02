"""
학술지논문제출 - 파일 선택 인터랙션 테스트
파일 업로드 기능 동작 확인
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import os

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
    print("학술지논문제출 - 파일 선택 인터랙션 테스트")
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

    # Test 1: 논문파일 찾아보기 버튼 클릭 가능
    try:
        thesis_browse_btn = driver.find_element(By.CSS_SELECTOR, 'button[data-action="select-journal-thesis-file"]')
        thesis_browse_btn.click()
        time.sleep(1)

        # 파일 input이 활성화되었는지 확인 (실제로는 파일 다이얼로그가 열림)
        thesis_file_input = driver.find_element(By.ID, 'journal-thesis-file')
        log_test("논문파일 찾아보기 버튼 클릭", True, "버튼 클릭 가능")
    except Exception as e:
        log_test("논문파일 찾아보기 버튼 클릭", False, str(e))

    # Test 2: 기타파일 찾아보기 버튼 클릭 가능
    try:
        other_browse_btn = driver.find_element(By.CSS_SELECTOR, 'button[data-action="select-journal-other-file"]')
        other_browse_btn.click()
        time.sleep(1)

        other_file_input = driver.find_element(By.ID, 'journal-other-file')
        log_test("기타파일 찾아보기 버튼 클릭", True, "버튼 클릭 가능")
    except Exception as e:
        log_test("기타파일 찾아보기 버튼 클릭", False, str(e))

    # Test 3: 논문파일 표시 입력박스가 readonly인지 확인
    try:
        thesis_display = driver.find_element(By.ID, 'journal-thesis-file-display')
        is_readonly = thesis_display.get_attribute('readonly')

        if is_readonly:
            log_test("논문파일 표시 입력박스 readonly", True, "readonly 속성 확인됨")
        else:
            log_test("논문파일 표시 입력박스 readonly", False, "readonly 속성 없음")
    except Exception as e:
        log_test("논문파일 표시 입력박스 readonly", False, str(e))

    # Test 4: 기타파일 표시 입력박스가 readonly인지 확인
    try:
        other_display = driver.find_element(By.ID, 'journal-other-file-display')
        is_readonly = other_display.get_attribute('readonly')

        if is_readonly:
            log_test("기타파일 표시 입력박스 readonly", True, "readonly 속성 확인됨")
        else:
            log_test("기타파일 표시 입력박스 readonly", False, "readonly 속성 없음")
    except Exception as e:
        log_test("기타파일 표시 입력박스 readonly", False, str(e))

    # Test 5: 기타파일 라디오 버튼 선택 가능
    try:
        confirmation_radio = driver.find_element(By.CSS_SELECTOR, 'input[name="journal-other-file-type"][value="confirmation"]')
        confirmation_radio.click()
        time.sleep(0.5)

        if confirmation_radio.is_selected():
            log_test("기타파일 라디오 버튼 선택", True, "confirmation 선택됨")
        else:
            log_test("기타파일 라디오 버튼 선택", False, "라디오 버튼 선택 실패")
    except Exception as e:
        log_test("기타파일 라디오 버튼 선택", False, str(e))

    # Test 6: placeholder 텍스트 확인
    try:
        thesis_display = driver.find_element(By.ID, 'journal-thesis-file-display')
        thesis_placeholder = thesis_display.get_attribute('placeholder')

        other_display = driver.find_element(By.ID, 'journal-other-file-display')
        other_placeholder = other_display.get_attribute('placeholder')

        if thesis_placeholder and other_placeholder:
            log_test("Placeholder 텍스트", True, f"논문파일: '{thesis_placeholder}', 기타파일: '{other_placeholder}'")
        else:
            log_test("Placeholder 텍스트", False, "Placeholder 없음")
    except Exception as e:
        log_test("Placeholder 텍스트", False, str(e))

    # 스크린샷 저장
    driver.save_screenshot("test_journal_file_interaction.png")
    print("\n[SCREENSHOT] 스크린샷 저장: test_journal_file_interaction.png")

except Exception as e:
    print(f"\n[ERROR] 테스트 실행 중 에러: {str(e)}")
    import traceback
    traceback.print_exc()

finally:
    # 결과 요약
    print("\n" + "="*80)
    print("테스트 결과 요약")
    print("="*80)
    print(f"\n총 테스트: {test_results['passed'] + test_results['failed']}")
    print(f"[PASS] 통과: {test_results['passed']}")
    print(f"[FAIL] 실패: {test_results['failed']}")

    if test_results['failed'] > 0:
        print("\n실패한 테스트:")
        for test in test_results['tests']:
            if not test['passed']:
                print(f"  - {test['name']}: {test['message']}")

    time.sleep(5)
    driver.quit()

    exit(0 if test_results['failed'] == 0 else 1)
