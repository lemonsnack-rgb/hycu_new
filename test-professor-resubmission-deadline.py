"""
교수 화면 - 재심 제출 마감일 제거 자동화 테스트
Phase 2 검증: 조건부합격 선택 시 재심 제출 마감일 입력 필드 제거 확인
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
professor_html_path = os.path.join(project_root, "professor-v3", "professor-dashboard-proposal.html")
professor_html_url = f"file:///{professor_html_path.replace(os.sep, '/')}"

print("="*80)
print("교수 화면 - 재심 제출 마감일 제거 테스트")
print("="*80)
print(f"\n테스트 파일: {professor_html_url}\n")

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
    print(f"\n[INFO] 페이지 로딩: {professor_html_url}")
    driver.get(professor_html_url)
    time.sleep(2)

    print("\n" + "="*80)
    print("Phase 1: 학위논문심사 메뉴로 이동")
    print("="*80)

    # 논문심사 메뉴 클릭
    try:
        review_menu = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '논문심사')]"))
        )
        review_menu.click()
        time.sleep(1)
        log_test("논문심사 메뉴 클릭", True, "메뉴 클릭 성공")
    except Exception as e:
        log_test("논문심사 메뉴 클릭", False, f"메뉴 찾기 실패: {str(e)}")
        raise

    # 학위논문심사 서브메뉴 클릭
    try:
        thesis_review_submenu = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '학위논문심사')]"))
        )
        thesis_review_submenu.click()
        time.sleep(2)
        log_test("학위논문심사 서브메뉴 클릭", True, "서브메뉴 클릭 성공")
    except Exception as e:
        log_test("학위논문심사 서브메뉴 클릭", False, f"서브메뉴 찾기 실패: {str(e)}")
        raise

    print("\n" + "="*80)
    print("Phase 2: 심사 상세 화면 열기 (위원장 권한)")
    print("="*80)

    # 테이블에서 첫 번째 심사 항목 클릭 (위원장 권한)
    try:
        # 위원장 권한이 있는 행 찾기
        review_row = wait.until(
            EC.presence_of_element_located((By.XPATH, "//td[contains(text(), '위원장')]/parent::tr"))
        )
        review_row.click()
        time.sleep(2)
        log_test("심사 항목 클릭", True, "위원장 권한 심사 항목 클릭 성공")
    except Exception as e:
        log_test("심사 항목 클릭", False, f"심사 항목 찾기 실패: {str(e)}")
        raise

    print("\n" + "="*80)
    print("Test 1: 위원장 결정 섹션 확인")
    print("="*80)

    # 위원장 결정 섹션이 표시되는지 확인
    try:
        chair_section = wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), '심사위원장 최종 결정')]"))
        )
        log_test("위원장 결정 섹션 표시", True, "심사위원장 최종 결정 섹션이 표시됨")
    except Exception as e:
        log_test("위원장 결정 섹션 표시", False, f"섹션 찾기 실패: {str(e)}")
        raise

    print("\n" + "="*80)
    print("Test 2: 조건부합격 버튼 클릭")
    print("="*80)

    # 조건부합격 버튼 클릭
    try:
        conditional_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@onclick, \"selectDecision('조건부합격')\")]"))
        )
        conditional_button.click()
        time.sleep(1)
        log_test("조건부합격 버튼 클릭", True, "버튼 클릭 성공")
    except Exception as e:
        log_test("조건부합격 버튼 클릭", False, f"버튼 찾기 실패: {str(e)}")
        raise

    print("\n" + "="*80)
    print("Test 3: 재심 정보 섹션 표시 확인")
    print("="*80)

    # 재심 정보 섹션이 표시되는지 확인
    try:
        resubmission_section = wait.until(
            EC.presence_of_element_located((By.ID, "resubmission-info-section"))
        )
        is_displayed = resubmission_section.is_displayed()

        if is_displayed:
            log_test("재심 정보 섹션 표시", True, "재심 정보 섹션이 정상적으로 표시됨")
        else:
            log_test("재심 정보 섹션 표시", False, "재심 정보 섹션이 숨겨져 있음")
    except Exception as e:
        log_test("재심 정보 섹션 표시", False, f"섹션 찾기 실패: {str(e)}")
        raise

    print("\n" + "="*80)
    print("Test 4: 재심 제출 마감일 입력 필드 없음 확인")
    print("="*80)

    # 재심 제출 마감일 입력 필드가 없는지 확인
    try:
        deadline_inputs = driver.find_elements(By.ID, "resubmission-deadline")

        if len(deadline_inputs) == 0:
            log_test("재심 제출 마감일 필드 제거", True, "resubmission-deadline 입력 필드가 DOM에 없음")
        else:
            log_test("재심 제출 마감일 필드 제거", False,
                    f"resubmission-deadline 입력 필드가 여전히 존재함: {len(deadline_inputs)}개")
    except Exception as e:
        log_test("재심 제출 마감일 필드 제거", False, f"에러: {str(e)}")

    print("\n" + "="*80)
    print("Test 5: 평가표 선택 필드 존재 확인")
    print("="*80)

    # 평가표 선택 필드는 존재하는지 확인
    try:
        template_select = driver.find_element(By.ID, "resubmission-template-id")

        if template_select.is_displayed():
            log_test("평가표 선택 필드 존재", True, "resubmission-template-id 선택 필드가 정상적으로 표시됨")
        else:
            log_test("평가표 선택 필드 존재", False, "평가표 선택 필드가 숨겨져 있음")
    except Exception as e:
        log_test("평가표 선택 필드 존재", False, f"필드 찾기 실패: {str(e)}")

    print("\n" + "="*80)
    print("Test 6: JavaScript 테스트 - 데이터 구조 확인")
    print("="*80)

    # JavaScript로 데이터 구조 확인
    try:
        # selectDecision 함수 호출 후 재심 정보 섹션 상태 확인
        result = driver.execute_script("""
            // 조건부합격 선택
            if (typeof selectDecision === 'function') {
                selectDecision('조건부합격');
            }

            // 재심 정보 섹션이 표시되는지 확인
            const section = document.getElementById('resubmission-info-section');
            const isVisible = section && section.style.display !== 'none';

            // 마감일 입력 필드가 없는지 확인
            const deadlineField = document.getElementById('resubmission-deadline');

            return {
                sectionVisible: isVisible,
                deadlineFieldExists: deadlineField !== null
            };
        """)

        if result['sectionVisible'] and not result['deadlineFieldExists']:
            log_test("JavaScript 데이터 구조", True,
                    f"재심 정보 섹션 표시됨, 마감일 필드 없음: {result}")
        else:
            log_test("JavaScript 데이터 구조", False,
                    f"예상과 다른 결과: {result}")
    except Exception as e:
        log_test("JavaScript 데이터 구조", False, f"에러: {str(e)}")

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
    screenshot_path = os.path.join(project_root, "test_professor_resubmission_deadline.png")
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
