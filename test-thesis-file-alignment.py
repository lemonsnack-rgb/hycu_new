"""
학위논문제출 - 파일 업로드 시작 위치 정렬 검증
재심 케이스에서 "새 논문 제출 정보" 섹션의 정렬 확인
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
    print("학위논문제출 - 파일 업로드 정렬 검증 (재심 케이스)")
    print("="*80)

    url = "file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/student-v3/student-dashboard.html"
    driver.get(url)
    time.sleep(2)

    # 학위논문제출 화면으로 이동
    driver.execute_script("showScreen('thesis-submission');")
    time.sleep(3)

    # 화면이 제대로 로드되었는지 확인
    print("[DEBUG] 현재 활성화된 화면 확인...")
    active_screen = driver.execute_script("return document.querySelector('.content-screen.active')?.id || 'none';")
    print(f"[DEBUG] Active screen: {active_screen}")

    # 본심사 행 찾기 (테이블 구조)
    print("[DEBUG] 테이블 행 검색 중...")
    rows = driver.find_elements(By.CSS_SELECTOR, '.thesis-table tbody tr')
    print(f"[DEBUG] 찾은 행 개수: {len(rows)}")

    found_row = False

    for row in rows:
        try:
            # 테이블의 각 셀에서 정보 추출
            cells = row.find_elements(By.TAG_NAME, 'td')
            if len(cells) >= 6:
                stage_name = cells[1].text  # 지도단계
                submission_type = cells[3].text  # 제출구분
                status = cells[4].text  # 제출상태
                result = cells[5].text  # 심사결과

                print(f"[DEBUG] 행 발견: {stage_name} - {submission_type} - {status} - {result}")

                # "본심사"이고 재심 관련 상태 찾기
                if '본심사' in stage_name:
                    print(f"[INFO] '{stage_name}' 행 클릭")
                    # 관리 버튼 클릭 (보기 또는 제출 버튼)
                    buttons = row.find_elements(By.TAG_NAME, 'button')
                    if len(buttons) > 0:
                        driver.execute_script("arguments[0].click();", buttons[0])
                        time.sleep(3)
                        found_row = True
                        break
        except Exception as e:
            print(f"[DEBUG] 행 처리 오류: {str(e)}")
            continue

    if not found_row:
        print("[ERROR] 본심사 행을 찾을 수 없습니다.")
        raise Exception("본심사 행 없음")

    # Test 1: "기존 제출 내역" 섹션의 label이 w-24 flex-shrink-0 사용하는지 확인
    try:
        # h3 태그 "기존 제출 내역" 찾기
        headers = driver.find_elements(By.TAG_NAME, 'h3')
        found_section = False

        for header in headers:
            if '기존 제출 내역' in header.text:
                found_section = True
                break

        if found_section:
            # 논문파일 label 찾기 (기존 제출 내역 섹션)
            labels = driver.find_elements(By.XPATH, "//label[contains(text(), '논문파일')]")

            found_w24 = False
            for label in labels:
                classes = label.get_attribute('class')
                if 'w-24' in classes and 'flex-shrink-0' in classes:
                    found_w24 = True
                    break

            if found_w24:
                log_test("기존 제출 내역 label 클래스", True, "w-24 flex-shrink-0 적용됨")
            else:
                log_test("기존 제출 내역 label 클래스", False, "w-24 flex-shrink-0 클래스를 찾을 수 없음")
        else:
            log_test("기존 제출 내역 label 클래스", False, "기존 제출 내역 섹션을 찾을 수 없음")
    except Exception as e:
        log_test("기존 제출 내역 label 클래스", False, str(e))

    # Test 2: "새 논문 제출 정보" 섹션의 label이 w-24 flex-shrink-0 사용하는지 확인
    try:
        # 입력 폼의 label 찾기 (찾아보기 버튼이 있는)
        thesis_label = None

        # 모든 "논문파일" label 찾기
        labels = driver.find_elements(By.XPATH, "//label[contains(text(), '논문파일')]")

        for label in labels:
            # 찾아보기 버튼이 근처에 있는지 확인 (입력 폼 판별)
            try:
                parent = label.find_element(By.XPATH, "./..")
                buttons = parent.find_elements(By.XPATH, ".//button[contains(text(), '찾아보기')]")

                if len(buttons) > 0:
                    thesis_label = label
                    break
            except:
                continue

        if thesis_label:
            classes = thesis_label.get_attribute('class')

            if 'w-24' in classes and 'flex-shrink-0' in classes:
                log_test("새 논문 제출 정보 label 클래스", True, "w-24 flex-shrink-0 적용됨")
            else:
                log_test("새 논문 제출 정보 label 클래스", False, f"클래스: {classes}")
        else:
            log_test("새 논문 제출 정보 label 클래스", False, "입력 폼 label을 찾을 수 없음")
    except Exception as e:
        log_test("새 논문 제출 정보 label 클래스", False, str(e))

    # Test 3: 입력박스 시작 위치 측정 (JavaScript 사용)
    # "논문파일" 입력박스들의 X 좌표만 비교 (같은 필드의 서로 다른 섹션)
    try:
        # 모든 논문파일 label을 찾고 그 다음 형제 input의 위치 측정
        positions = driver.execute_script("""
            const labels = Array.from(document.querySelectorAll('label'));
            const thesisLabels = labels.filter(lbl => lbl.textContent.includes('논문파일'));

            return thesisLabels.map((label, idx) => {
                // label 다음 형제 중 input 찾기
                let sibling = label.nextElementSibling;
                while (sibling) {
                    if (sibling.tagName === 'INPUT' && sibling.type === 'text') {
                        const rect = sibling.getBoundingClientRect();
                        return {
                            sectionIndex: idx,
                            id: sibling.id || 'unknown',
                            x: rect.left,
                            readonly: sibling.hasAttribute('readonly')
                        };
                    }
                    sibling = sibling.nextElementSibling;
                }
                return null;
            }).filter(p => p !== null);
        """)

        print(f"[DEBUG] 논문파일 입력박스 위치: {positions}")

        if len(positions) >= 2:
            # 논문파일 입력박스들의 X 좌표 비교 (±2px 오차 허용)
            x_coords = [pos['x'] for pos in positions]
            min_x = min(x_coords)
            max_x = max(x_coords)

            if max_x - min_x <= 2:
                log_test("입력박스 시작 위치 정렬", True, f"모든 논문파일 입력박스 X 좌표 동일: {min_x:.1f}px (오차: {max_x - min_x:.1f}px)")
            else:
                log_test("입력박스 시작 위치 정렬", False, f"논문파일 입력박스 X 좌표 차이: {max_x - min_x:.1f}px (범위: {min_x:.1f} ~ {max_x:.1f})")
        else:
            log_test("입력박스 시작 위치 정렬", False, f"논문파일 입력박스 개수 부족: {len(positions)}개")
    except Exception as e:
        log_test("입력박스 시작 위치 정렬", False, str(e))

    # 스크린샷
    driver.save_screenshot("test_thesis_file_alignment.png")
    print("\n[SCREENSHOT] 저장: test_thesis_file_alignment.png")

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
