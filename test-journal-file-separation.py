"""
학술지논문제출 - 파일 업로드 분리 자동화 테스트
논문파일 (필수) + 기타파일 (3개 옵션 + 선택) 구조 검증
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
    print("학술지논문제출 - 파일 업로드 분리 테스트")
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

    # Test 1: 논문파일 업로드 필드 존재 확인
    try:
        thesis_file_input = driver.find_element(By.ID, 'journal-thesis-file')
        log_test("논문파일 입력 필드 존재", True, "journal-thesis-file 필드가 존재함")
    except:
        log_test("논문파일 입력 필드 존재", False, "journal-thesis-file 필드를 찾을 수 없음")

    # Test 2: 논문파일 표시 입력박스 확인
    try:
        thesis_display = driver.find_element(By.ID, 'journal-thesis-file-display')
        log_test("논문파일 표시 입력박스", True, "journal-thesis-file-display 입력박스가 존재함")
    except:
        log_test("논문파일 표시 입력박스", False, "journal-thesis-file-display 입력박스를 찾을 수 없음")

    # Test 3: 논문파일 필수 표시 확인
    try:
        labels = driver.find_elements(By.XPATH, "//label[contains(text(), '논문파일')]")
        found_required = False
        for label in labels:
            if label.find_elements(By.CSS_SELECTOR, 'span.text-red-500'):
                found_required = True
                break

        if found_required:
            log_test("논문파일 필수 표시", True, "빨간색 * 표시 확인됨")
        else:
            log_test("논문파일 필수 표시", False, "필수 표시를 찾을 수 없음")
    except Exception as e:
        log_test("논문파일 필수 표시", False, str(e))

    # Test 4: 기타파일 라디오 버튼 개수 확인 (3개)
    try:
        other_file_radios = driver.find_elements(By.CSS_SELECTOR, 'input[name="journal-other-file-type"]')
        if len(other_file_radios) == 3:
            log_test("기타파일 옵션 개수", True, f"3개 옵션 확인됨: {len(other_file_radios)}개")
        else:
            log_test("기타파일 옵션 개수", False, f"예상: 3개, 실제: {len(other_file_radios)}개")
    except:
        log_test("기타파일 옵션 개수", False, "라디오 버튼을 찾을 수 없음")

    # Test 5: 기타파일 옵션 확인 (confirmation, scheduled, proof)
    try:
        expected_values = ['confirmation', 'scheduled', 'proof']
        actual_values = [radio.get_attribute('value') for radio in other_file_radios]

        if set(expected_values) == set(actual_values):
            log_test("기타파일 옵션 값", True, f"올바른 값: {actual_values}")
        else:
            log_test("기타파일 옵션 값", False, f"예상: {expected_values}, 실제: {actual_values}")
    except Exception as e:
        log_test("기타파일 옵션 값", False, str(e))

    # Test 6: 기타파일 업로드 필드 존재 확인
    try:
        other_file_input = driver.find_element(By.ID, 'journal-other-file')
        log_test("기타파일 입력 필드 존재", True, "journal-other-file 필드가 존재함")
    except:
        log_test("기타파일 입력 필드 존재", False, "journal-other-file 필드를 찾을 수 없음")

    # Test 7: 기타파일 표시 입력박스 확인
    try:
        other_display = driver.find_element(By.ID, 'journal-other-file-display')
        log_test("기타파일 표시 입력박스", True, "journal-other-file-display 입력박스가 존재함")
    except:
        log_test("기타파일 표시 입력박스", False, "journal-other-file-display 입력박스를 찾을 수 없음")

    # Test 8: 논문별쇄본 옵션이 없는지 확인 (제거되어야 함)
    try:
        offprint_radios = driver.find_elements(By.XPATH, "//input[@type='radio' and @value='offprint']")
        if len(offprint_radios) == 0:
            log_test("논문별쇄본 옵션 제거됨", True, "논문별쇄본 옵션이 없음 (수정 완료)")
        else:
            log_test("논문별쇄본 옵션 제거됨", False, f"아직 논문별쇄본 옵션 {len(offprint_radios)}개 존재")
    except Exception as e:
        log_test("논문별쇄본 옵션 제거됨", False, str(e))

    # Test 9: 찾아보기 버튼 개수 확인 (2개)
    try:
        browse_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), '찾아보기')]")
        if len(browse_buttons) == 2:
            log_test("찾아보기 버튼 개수", True, f"2개 버튼 확인됨: {len(browse_buttons)}개")
        else:
            log_test("찾아보기 버튼 개수", False, f"예상: 2개, 실제: {len(browse_buttons)}개")
    except:
        log_test("찾아보기 버튼 개수", False, "찾아보기 버튼을 찾을 수 없음")

    # 스크린샷 저장
    driver.save_screenshot("test_journal_file_separation.png")
    print("\n[SCREENSHOT] 스크린샷 저장: test_journal_file_separation.png")

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
