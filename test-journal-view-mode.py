"""
학술지논문제출 - 제출 완료된 데이터 조회 테스트
Mock 데이터가 올바르게 표시되는지 확인
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
    print("학술지논문제출 - 제출 완료된 데이터 조회 테스트")
    print("="*80)

    url = "file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/student-v3/student-dashboard.html"
    driver.get(url)
    time.sleep(2)

    # 학술지논문제출 화면으로 이동
    driver.execute_script("showScreen('journal-submission');")
    time.sleep(2)

    # Test 1: 제출 완료된 행 찾기 (테이블 구조)
    try:
        rows = driver.find_elements(By.CSS_SELECTOR, '.journal-table tbody tr')
        submitted_count = 0

        for row in rows:
            try:
                cells = row.find_elements(By.TAG_NAME, 'td')
                if len(cells) >= 5:
                    status = cells[4].text  # 제출상태 컬럼
                    if '제출 완료' in status:
                        submitted_count += 1
            except:
                continue

        if submitted_count > 0:
            log_test("제출 완료된 행 존재", True, f"{submitted_count}개의 제출 완료 행 확인됨")
        else:
            log_test("제출 완료된 행 존재", False, "제출 완료된 행을 찾을 수 없음")
    except Exception as e:
        log_test("제출 완료된 행 존재", False, str(e))

    # 첫 번째 제출 완료된 행의 [보기] 버튼 클릭
    try:
        for row in rows:
            cells = row.find_elements(By.TAG_NAME, 'td')
            if len(cells) >= 5:
                status = cells[4].text
                if '제출 완료' in status:
                    stage = cells[1].text
                    print(f"[INFO] 제출 완료 행 클릭: {stage}")
                    # [보기] 버튼 찾기
                    view_btn = row.find_element(By.CSS_SELECTOR, 'button[data-action="view"]')
                    driver.execute_script("arguments[0].click();", view_btn)
                    time.sleep(2)
                    break
    except Exception as e:
        print(f"[WARNING] 제출 완료된 행 클릭 실패: {str(e)}")

    # Test 2: 논문파일 정보 표시 확인
    try:
        thesis_display = driver.find_element(By.ID, 'journal-thesis-file-display')
        thesis_value = thesis_display.get_attribute('value')

        if thesis_value and len(thesis_value) > 0:
            log_test("논문파일 정보 표시", True, f"파일: '{thesis_value}'")
        else:
            log_test("논문파일 정보 표시", False, "논문파일 정보가 비어있음")
    except Exception as e:
        log_test("논문파일 정보 표시", False, str(e))

    # Test 3: 기타파일 정보 표시 확인
    try:
        other_display = driver.find_element(By.ID, 'journal-other-file-display')
        other_value = other_display.get_attribute('value')

        # 기타파일은 optional이므로 있을 수도 없을 수도 있음
        if other_value and len(other_value) > 0:
            log_test("기타파일 정보 표시", True, f"파일: '{other_value}'")
        else:
            log_test("기타파일 정보 표시", True, "기타파일 없음 (정상)")
    except Exception as e:
        log_test("기타파일 정보 표시", False, str(e))

    # Test 4: 기타파일 종류 라디오 선택 상태 확인
    try:
        selected_radio = driver.find_element(By.CSS_SELECTOR, 'input[name="journal-other-file-type"]:checked')
        if selected_radio:
            selected_value = selected_radio.get_attribute('value')
            log_test("기타파일 종류 선택 상태", True, f"선택된 종류: {selected_value}")
        else:
            log_test("기타파일 종류 선택 상태", True, "선택된 종류 없음 (기타파일 없는 경우 정상)")
    except:
        log_test("기타파일 종류 선택 상태", True, "선택된 종류 없음 (기타파일 없는 경우 정상)")

    # Test 5: View 모드에서 버튼 비활성화 확인
    try:
        thesis_browse_btn = driver.find_element(By.CSS_SELECTOR, 'button[data-action="select-journal-thesis-file"]')
        is_disabled = thesis_browse_btn.get_attribute('disabled')

        if is_disabled:
            log_test("View 모드 버튼 비활성화", True, "찾아보기 버튼 비활성화됨")
        else:
            log_test("View 모드 버튼 비활성화", False, "찾아보기 버튼이 활성화되어 있음")
    except Exception as e:
        log_test("View 모드 버튼 비활성화", False, str(e))

    # Test 6: undefined 또는 NaN 없는지 확인
    try:
        all_inputs = driver.find_elements(By.CSS_SELECTOR, 'input[type="text"]')
        has_undefined = False
        undefined_values = []

        for inp in all_inputs:
            value = inp.get_attribute('value') or ''
            if 'undefined' in value.lower() or 'nan' in value.lower():
                has_undefined = True
                undefined_values.append(value)

        if not has_undefined:
            log_test("undefined/NaN 없음", True, "모든 입력박스에 유효한 값 표시")
        else:
            log_test("undefined/NaN 없음", False, f"undefined/NaN 발견: {undefined_values}")
    except Exception as e:
        log_test("undefined/NaN 없음", False, str(e))

    # 스크린샷 저장
    driver.save_screenshot("test_journal_view_mode.png")
    print("\n[SCREENSHOT] 스크린샷 저장: test_journal_view_mode.png")

    print("\n[INFO] 브라우저를 5초간 유지합니다. UI를 확인하세요...")
    time.sleep(5)

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

    driver.quit()

    exit(0 if test_results['failed'] == 0 else 1)
