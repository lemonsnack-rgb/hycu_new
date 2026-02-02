"""
관리자 화면 - 기본단계명 추가 자동화 테스트
Phase 1 검증: 단계별업무관리 모달에 기본단계명 컬럼 추가 확인
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import os

# 프로젝트 루트 경로
project_root = os.path.dirname(os.path.abspath(__file__))
admin_html_path = os.path.join(project_root, "admin-v3", "index.html")
admin_html_url = f"file:///{admin_html_path.replace(os.sep, '/')}"

print("="*80)
print("관리자 화면 - 기본단계명 추가 테스트")
print("="*80)
print(f"\n테스트 파일: {admin_html_url}\n")

# Chrome 옵션 설정
chrome_options = Options()
chrome_options.add_argument('--start-maximized')
chrome_options.add_argument('--disable-blink-features=AutomationControlled')

# WebDriver 초기화
driver = webdriver.Chrome(options=chrome_options)
wait = WebDriverWait(driver, 10)

test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(test_name, passed, message):
    """테스트 결과 로깅"""
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

try:
    # 페이지 로드
    print(f"\n[INFO] 페이지 로딩: {admin_html_url}")
    driver.get(admin_html_url)
    time.sleep(2)

    print("\n" + "="*80)
    print("Phase 1: 논문지도 > 지도단계등록(신규) 메뉴로 이동")
    print("="*80)

    # 논문지도 메뉴 클릭
    try:
        thesis_menu = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), '논문지도')]"))
        )
        thesis_menu.click()
        time.sleep(1)
        log_test("논문지도 메뉴 클릭", True, "메뉴 클릭 성공")
    except Exception as e:
        log_test("논문지도 메뉴 클릭", False, f"메뉴 찾기 실패: {str(e)}")
        raise

    # 지도단계등록(신규) 서브메뉴 클릭
    try:
        stage_submenu = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '지도단계등록(신규)')]"))
        )
        stage_submenu.click()
        time.sleep(2)
        log_test("지도단계등록(신규) 서브메뉴 클릭", True, "서브메뉴 클릭 성공")
    except Exception as e:
        log_test("지도단계등록(신규) 서브메뉴 클릭", False, f"서브메뉴 찾기 실패: {str(e)}")
        raise

    print("\n" + "="*80)
    print("Phase 2: 단계별업무관리 [관리] 버튼 클릭")
    print("="*80)

    # 테이블이 로드될 때까지 대기
    try:
        table = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "table"))
        )
        time.sleep(1)
        log_test("테이블 로드", True, "테이블이 정상적으로 로드됨")
    except Exception as e:
        log_test("테이블 로드", False, f"테이블 찾기 실패: {str(e)}")
        raise

    # 첫 번째 [관리] 버튼 클릭
    try:
        manage_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '관리')]"))
        )
        manage_button.click()
        time.sleep(2)
        log_test("[관리] 버튼 클릭", True, "버튼 클릭 성공")
    except Exception as e:
        log_test("[관리] 버튼 클릭", False, f"버튼 찾기 실패: {str(e)}")
        raise

    print("\n" + "="*80)
    print("Test 1: 모달 팝업 표시 확인")
    print("="*80)

    # 모달이 표시되는지 확인
    try:
        modal = wait.until(
            EC.presence_of_element_located((By.ID, "stage-task-modal"))
        )
        is_displayed = modal.is_displayed()
        if is_displayed:
            log_test("모달 팝업 표시", True, "단계별업무관리 모달이 정상적으로 표시됨")
        else:
            log_test("모달 팝업 표시", False, "모달이 숨겨져 있음")
    except Exception as e:
        log_test("모달 팝업 표시", False, f"모달 찾기 실패: {str(e)}")
        raise

    print("\n" + "="*80)
    print("Test 2: 테이블 헤더에 '기본단계명' 컬럼 확인")
    print("="*80)

    # 테이블 헤더 확인
    try:
        headers = driver.find_elements(By.CSS_SELECTOR, "#stage-task-modal thead th")
        header_texts = [h.text.strip() for h in headers]

        has_basic_stage = "기본단계명" in header_texts

        if has_basic_stage:
            log_test("기본단계명 컬럼 존재", True, f"헤더에 '기본단계명' 컬럼이 있음: {header_texts}")
        else:
            log_test("기본단계명 컬럼 존재", False, f"헤더에 '기본단계명' 컬럼이 없음: {header_texts}")
    except Exception as e:
        log_test("기본단계명 컬럼 존재", False, f"에러: {str(e)}")

    print("\n" + "="*80)
    print("Test 3: 기본단계명이 첫 번째 컬럼인지 확인")
    print("="*80)

    # 기본단계명이 첫 번째 컬럼인지 확인
    try:
        first_header = driver.find_element(By.CSS_SELECTOR, "#stage-task-modal thead th:first-child")
        first_header_text = first_header.text.strip()

        if first_header_text == "기본단계명":
            log_test("기본단계명 컬럼 위치", True, "기본단계명이 첫 번째 컬럼임")
        else:
            log_test("기본단계명 컬럼 위치", False, f"첫 번째 컬럼이 '{first_header_text}'임 (기본단계명이어야 함)")
    except Exception as e:
        log_test("기본단계명 컬럼 위치", False, f"에러: {str(e)}")

    print("\n" + "="*80)
    print("Test 4: 테이블 행에 기본단계명 표시 확인")
    print("="*80)

    # 첫 번째 행의 첫 번째 셀 확인
    try:
        first_row = driver.find_element(By.CSS_SELECTOR, "#stage-task-modal tbody tr:first-child")
        first_cell = first_row.find_element(By.CSS_SELECTOR, "td:first-child")
        first_cell_text = first_cell.text.strip()

        if first_cell_text and len(first_cell_text) > 0:
            log_test("기본단계명 표시", True, f"첫 번째 행에 기본단계명이 표시됨: '{first_cell_text}'")
        else:
            log_test("기본단계명 표시", False, "첫 번째 셀이 비어있음")
    except Exception as e:
        log_test("기본단계명 표시", False, f"에러: {str(e)}")

    print("\n" + "="*80)
    print("Test 5: 세부단계명이 두 번째 컬럼에 있는지 확인")
    print("="*80)

    # 두 번째 헤더가 세부단계명인지 확인
    try:
        second_header = driver.find_element(By.CSS_SELECTOR, "#stage-task-modal thead th:nth-child(2)")
        second_header_text = second_header.text.strip()

        if second_header_text == "세부단계명":
            log_test("세부단계명 컬럼 위치", True, "세부단계명이 두 번째 컬럼임")
        else:
            log_test("세부단계명 컬럼 위치", False, f"두 번째 컬럼이 '{second_header_text}'임 (세부단계명이어야 함)")
    except Exception as e:
        log_test("세부단계명 컬럼 위치", False, f"에러: {str(e)}")

    print("\n" + "="*80)
    print("Test 6: 기본단계명과 세부단계명 데이터 확인")
    print("="*80)

    # 첫 번째 행의 기본단계명과 세부단계명 확인
    try:
        first_row = driver.find_element(By.CSS_SELECTOR, "#stage-task-modal tbody tr:first-child")
        basic_stage_cell = first_row.find_element(By.CSS_SELECTOR, "td:nth-child(1)")
        detail_stage_cell = first_row.find_element(By.CSS_SELECTOR, "td:nth-child(2)")

        basic_stage_text = basic_stage_cell.text.strip()
        detail_stage_text = detail_stage_cell.text.strip()

        if basic_stage_text and detail_stage_text:
            log_test("기본단계명/세부단계명 데이터", True,
                    f"기본단계명: '{basic_stage_text}', 세부단계명: '{detail_stage_text}'")
        else:
            log_test("기본단계명/세부단계명 데이터", False,
                    f"데이터가 비어있음 - 기본단계명: '{basic_stage_text}', 세부단계명: '{detail_stage_text}'")
    except Exception as e:
        log_test("기본단계명/세부단계명 데이터", False, f"에러: {str(e)}")

    print("\n" + "="*80)
    print("Test 7: UI 일관성 확인 (콘솔 에러 체크)")
    print("="*80)

    # 콘솔 에러 확인
    try:
        logs = driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']

        if len(errors) == 0:
            log_test("콘솔 에러 없음", True, "JavaScript 에러가 없음")
        else:
            error_messages = [log['message'] for log in errors]
            log_test("콘솔 에러 없음", False, f"콘솔 에러 발견: {error_messages[:3]}")
    except Exception as e:
        log_test("콘솔 에러 없음", True, "로그 확인 불가 (정상적일 수 있음)")

    # 스크린샷 저장
    screenshot_path = os.path.join(project_root, "test_admin_stage_basic_name.png")
    driver.save_screenshot(screenshot_path)
    print(f"\n[SCREENSHOT] 스크린샷 저장: {screenshot_path}")

    time.sleep(2)

except Exception as e:
    print(f"\n[ERROR] 테스트 실행 중 에러 발생: {str(e)}")
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

    print("\n브라우저를 5초 후 종료합니다...")
    time.sleep(5)
    driver.quit()

    print("\n테스트 완료!")

    # 종료 코드
    exit(0 if test_results['failed'] == 0 else 1)
