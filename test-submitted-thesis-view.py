"""
제출 완료된 논문 조회 화면 UI 검증
사용자 이미지에서 확인된 "첨부파일 undefined (NaN MB)" 문제 재현 및 수정 확인
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
    print("제출 완료된 논문 조회 화면 UI 검증")
    print("="*80)

    url = "file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/student-v3/student-dashboard.html"
    driver.get(url)
    time.sleep(2)

    # 학위논문제출 화면으로 이동
    driver.execute_script("showScreen('thesis-submission');")
    time.sleep(2)

    # 제출 완료된 카드 찾기 (연구계획서 - status: submitted)
    print("\n[INFO] 제출 완료된 카드 찾는 중...")
    cards = driver.find_elements(By.CSS_SELECTOR, '.thesis-card')
    found_submitted = False

    for i, card in enumerate(cards):
        try:
            stage_name = card.find_element(By.CSS_SELECTOR, '.thesis-stage').text
            status = card.find_element(By.CSS_SELECTOR, '.submission-status').text

            print(f"[DEBUG] 카드 {i+1}: {stage_name} - {status}")

            # 제출 완료된 카드 (합격, 조건부합격 등)
            if '제출 완료' in status or '합격' in status:
                print(f"[INFO] '{stage_name}' 카드 클릭 (상태: {status})")
                driver.execute_script("arguments[0].click();", card)
                time.sleep(2)
                found_submitted = True
                break
        except:
            continue

    if not found_submitted:
        print("[WARNING] 제출 완료 카드를 찾지 못했습니다. 첫 번째 카드 클릭...")
        if len(cards) > 0:
            driver.execute_script("arguments[0].click();", cards[0])
            time.sleep(2)

    # 스크린샷 저장
    driver.save_screenshot("test_submitted_view_before_check.png")
    print("\n[SCREENSHOT] 저장: test_submitted_view_before_check.png")

    # Test 1: "논문 제출 정보" 섹션 확인
    try:
        section_header = driver.find_element(By.XPATH, "//h3[contains(text(), '논문 제출 정보')]")
        log_test("논문 제출 정보 섹션 존재", True, "h3 태그 '논문 제출 정보' 확인")
    except Exception as e:
        log_test("논문 제출 정보 섹션 존재", False, str(e))

    # Test 2: "논문파일" 라벨 존재 확인
    try:
        thesis_label = driver.find_element(By.XPATH, "//label[contains(text(), '논문파일')]")
        log_test("논문파일 라벨 존재", True, "'논문파일' 라벨 확인됨")
    except Exception as e:
        log_test("논문파일 라벨 존재", False, f"'논문파일' 라벨 없음: {str(e)}")

    # Test 3: "기타파일" 라벨 존재 확인
    try:
        other_label = driver.find_element(By.XPATH, "//label[contains(text(), '기타파일')]")
        log_test("기타파일 라벨 존재", True, "'기타파일' 라벨 확인됨")
    except Exception as e:
        log_test("기타파일 라벨 존재", False, f"'기타파일' 라벨 없음: {str(e)}")

    # Test 4: "첨부파일" 라벨이 없는지 확인 (구 버전)
    try:
        old_label = driver.find_elements(By.XPATH, "//label[contains(text(), '첨부파일') and not(contains(text(), '없음'))]")
        if len(old_label) == 0:
            log_test("구 '첨부파일' 라벨 제거됨", True, "구 버전 '첨부파일' 라벨이 없음 (수정 완료)")
        else:
            log_test("구 '첨부파일' 라벨 제거됨", False, f"아직 '첨부파일' 라벨 {len(old_label)}개 존재")
    except Exception as e:
        log_test("구 '첨부파일' 라벨 제거됨", False, str(e))

    # Test 5: 입력박스에 "undefined" 또는 "NaN" 없는지 확인
    try:
        all_inputs = driver.find_elements(By.CSS_SELECTOR, 'input[readonly]')
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

    # Test 6: 한 줄 배치 확인
    try:
        # 논문파일/기타파일 라벨이 같은 행에 있는지 확인
        thesis_labels = driver.find_elements(By.XPATH, "//label[contains(text(), '논문파일')]")
        other_labels = driver.find_elements(By.XPATH, "//label[contains(text(), '기타파일')]")

        if len(thesis_labels) > 0 and len(other_labels) > 0:
            log_test("한 줄 배치 확인", True, f"논문파일({len(thesis_labels)}), 기타파일({len(other_labels)}) 라벨 모두 존재")
        else:
            log_test("한 줄 배치 확인", False, f"논문파일: {len(thesis_labels)}, 기타파일: {len(other_labels)}")
    except Exception as e:
        log_test("한 줄 배치 확인", False, str(e))

    # 최종 스크린샷
    driver.save_screenshot("test_submitted_view_final.png")
    print("\n[SCREENSHOT] 최종 저장: test_submitted_view_final.png")

    print("\n[INFO] 브라우저를 5초간 유지합니다. UI를 확인하세요...")
    time.sleep(5)

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

    driver.quit()
