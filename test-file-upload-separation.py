"""
학생 화면 - 파일 업로드 분리 자동화 테스트
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

# 테스트 결과
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

# Chrome 설정
driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

try:
    # ==================== 학위논문제출 테스트 ====================
    print("\n" + "="*80)
    print("학위논문제출 - 파일 업로드 분리 테스트")
    print("="*80)

    # 페이지 로드
    thesis_url = "file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/student-v3/student-dashboard.html"
    driver.get(thesis_url)
    time.sleep(2)

    # 학위논문제출 화면으로 이동
    driver.execute_script("showScreen('thesis-submission');")
    time.sleep(2)

    # [제출] 버튼 클릭
    submit_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-action="submit"]')
    if len(submit_buttons) > 0:
        submit_buttons[0].click()
        time.sleep(2)

    # Test 1: 논문파일 업로드 필드 존재 확인
    try:
        thesis_file_input = driver.find_element(By.ID, 'thesis-main-file')
        log_test("논문파일 입력 필드 존재", True, "thesis-main-file 필드가 존재함")
    except:
        log_test("논문파일 입력 필드 존재", False, "thesis-main-file 필드를 찾을 수 없음")

    # Test 2: 기타파일 업로드 필드 존재 확인
    try:
        other_file_input = driver.find_element(By.ID, 'thesis-other-file')
        log_test("기타파일 입력 필드 존재", True, "thesis-other-file 필드가 존재함")
    except:
        log_test("기타파일 입력 필드 존재", False, "thesis-other-file 필드를 찾을 수 없음")

    # Test 3: 논문파일 표시 입력박스 확인
    try:
        thesis_file_display = driver.find_element(By.ID, 'thesis-file-display')
        log_test("논문파일 표시 입력박스", True, "thesis-file-display 입력박스가 존재함")
    except:
        log_test("논문파일 표시 입력박스", False, "thesis-file-display 입력박스를 찾을 수 없음")

    # Test 4: 기타파일 표시 입력박스 확인
    try:
        other_file_display = driver.find_element(By.ID, 'other-file-display')
        log_test("기타파일 표시 입력박스", True, "other-file-display 입력박스가 존재함")
    except:
        log_test("기타파일 표시 입력박스", False, "other-file-display 입력박스를 찾을 수 없음")

    # Test 5: 한 줄 배치 레이아웃 확인 (논문파일 + 기타파일 같은 행)
    try:
        # 한 줄에 두 라벨이 모두 있는지 확인
        labels = driver.find_elements(By.XPATH, "//label[contains(text(), '논문파일')]")
        has_thesis_label = len(labels) > 0

        labels = driver.find_elements(By.XPATH, "//label[contains(text(), '기타파일')]")
        has_other_label = len(labels) > 0

        if has_thesis_label and has_other_label:
            log_test("한 줄 배치 레이아웃", True, "논문파일과 기타파일 라벨이 모두 존재함")
        else:
            log_test("한 줄 배치 레이아웃", False, f"라벨 누락: 논문파일({has_thesis_label}), 기타파일({has_other_label})")
    except:
        log_test("한 줄 배치 레이아웃", False, "레이아웃을 확인할 수 없음")

    # Test 6: 찾아보기 버튼 확인
    try:
        browse_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), '찾아보기')]")
        if len(browse_buttons) >= 2:
            log_test("찾아보기 버튼", True, f"찾아보기 버튼 {len(browse_buttons)}개 확인됨")
        else:
            log_test("찾아보기 버튼", False, f"찾아보기 버튼 개수 부족: {len(browse_buttons)}개")
    except:
        log_test("찾아보기 버튼", False, "찾아보기 버튼을 찾을 수 없음")

    # ==================== 학술지논문제출 테스트 ====================
    print("\n" + "="*80)
    print("학술지논문제출 - 논문별쇄본 추가 테스트")
    print("="*80)

    # 학술지논문제출 화면으로 이동
    driver.execute_script("showScreen('journal-submission');")
    time.sleep(2)

    # [제출] 버튼 클릭
    submit_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-action="submit"]')
    if len(submit_buttons) > 0:
        submit_buttons[0].click()
        time.sleep(2)

    # Test 7: 논문별쇄본 라디오 버튼 존재 확인
    try:
        offprint_radio = driver.find_element(By.CSS_SELECTOR, 'input[name="journal-proof-type"][value="offprint"]')
        log_test("논문별쇄본 라디오 버튼", True, "offprint 라디오 버튼이 존재함")
    except:
        log_test("논문별쇄본 라디오 버튼", False, "offprint 라디오 버튼을 찾을 수 없음")

    # Test 8: 증빙서류 옵션 개수 확인 (4개)
    try:
        proof_radios = driver.find_elements(By.CSS_SELECTOR, 'input[name="journal-proof-type"]')
        if len(proof_radios) == 4:
            log_test("증빙서류 옵션 개수", True, f"총 4개 옵션 확인됨: {len(proof_radios)}개")
        else:
            log_test("증빙서류 옵션 개수", False, f"예상: 4개, 실제: {len(proof_radios)}개")
    except:
        log_test("증빙서류 옵션 개수", False, "라디오 버튼을 찾을 수 없음")

    # Test 9: 논문별쇄본이 첫 번째 옵션인지 확인
    try:
        first_radio = driver.find_element(By.CSS_SELECTOR, 'input[name="journal-proof-type"]:first-of-type')
        if first_radio.get_attribute('value') == 'offprint':
            log_test("논문별쇄본 위치", True, "논문별쇄본이 첫 번째 옵션임")
        else:
            log_test("논문별쇄본 위치", False, f"첫 번째 옵션: {first_radio.get_attribute('value')}")
    except:
        log_test("논문별쇄본 위치", False, "첫 번째 라디오 버튼을 찾을 수 없음")

    # 스크린샷 저장
    driver.save_screenshot("test_student_file_upload.png")
    print("\n[SCREENSHOT] 스크린샷 저장: test_student_file_upload.png")

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
