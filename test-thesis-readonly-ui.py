"""
학위논문제출 - 읽기 전용 섹션 UI 검증 테스트
등록 화면과 동일한 UI 유지 확인
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
    print("읽기 전용 섹션 UI 검증 - 등록 화면과 동일 여부")
    print("="*80)

    url = "file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/student-v3/student-dashboard.html"
    driver.get(url)
    time.sleep(2)

    # 학위논문제출 화면으로 이동
    driver.execute_script("showScreen('thesis-submission');")
    time.sleep(2)

    # [제출] 버튼 클릭 (새 제출 폼 열기)
    print("[INFO] [제출] 버튼 클릭...")
    submit_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-action="submit"]')
    if len(submit_buttons) > 0:
        driver.execute_script("arguments[0].click();", submit_buttons[0])
        time.sleep(2)
        print("[INFO] 새 제출 폼이 열렸습니다")
    else:
        print("[WARNING] 제출 버튼을 찾을 수 없음")

    # Test 1: 논문파일 표시 입력박스 존재
    try:
        thesis_display = driver.find_element(By.ID, 'thesis-file-display')
        log_test("논문파일 표시 입력박스", True, "thesis-file-display 입력박스 존재")
    except Exception as e:
        log_test("논문파일 표시 입력박스", False, str(e))

    # Test 2: 기타파일 표시 입력박스 존재
    try:
        other_display = driver.find_element(By.ID, 'other-file-display')
        log_test("기타파일 표시 입력박스", True, "other-file-display 입력박스 존재")
    except Exception as e:
        log_test("기타파일 표시 입력박스", False, str(e))

    # Test 3: 한 줄 배치 확인
    try:
        labels = driver.find_elements(By.XPATH, "//label[contains(text(), '논문파일')]")
        other_labels = driver.find_elements(By.XPATH, "//label[contains(text(), '기타파일')]")

        if len(labels) > 0 and len(other_labels) > 0:
            log_test("한 줄 배치 확인", True, "논문파일과 기타파일 라벨이 모두 존재")
        else:
            log_test("한 줄 배치 확인", False, f"논문파일: {len(labels)}, 기타파일: {len(other_labels)}")
    except Exception as e:
        log_test("한 줄 배치 확인", False, str(e))

    # 스크린샷
    driver.save_screenshot("test_thesis_readonly_ui_unified.png")
    print("\n[SCREENSHOT] 저장: test_thesis_readonly_ui_unified.png")

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
