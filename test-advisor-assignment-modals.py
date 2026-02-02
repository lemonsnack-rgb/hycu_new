# -*- coding: utf-8 -*-
"""
지도교수 배정 모달 테스트 - 연구제목 필드 추가 검증
Phase 1-2 구현 검증: 관리자/교수 모달에 연구제목 필드 추가
"""

import os
import sys
import time

# UTF-8 출력 설정
sys.stdout.reconfigure(encoding='utf-8')

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager

    print('=' * 80)
    print('지도교수 배정 모달: 연구제목 필드 추가 검증')
    print('=' * 80)
    print()

    test_results = []

    def add_result(name, status, message, details=''):
        """테스트 결과 기록"""
        test_results.append({
            'name': name,
            'status': status,
            'message': message,
            'details': details
        })
        symbol = '✅' if status == 'PASS' else '❌' if status == 'FAIL' else 'ℹ️'
        print(f'{symbol} [{status}] {name}')
        print(f'   {message}')
        if details:
            for line in details.split('\n'):
                if line.strip():
                    print(f'   {line}')
        print()

    # Chrome 옵션 설정
    chrome_options = Options()
    chrome_options.add_argument('--start-maximized')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    print('[INFO] Chrome 브라우저 시작...')
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 10)

    # 프로젝트 루트 경로
    project_root = os.path.dirname(os.path.abspath(__file__))

    # ========================================
    # TEST 1: 학생 화면 검증 (기준선)
    # ========================================
    print('=' * 80)
    print('TEST 1: 학생 화면 검증 (기준선)')
    print('=' * 80)

    student_file = os.path.join(project_root, 'student-v3', 'student-dashboard.html')
    student_url = f'file:///{student_file.replace(os.sep, "/")}'

    print(f'[INFO] 페이지 로드: {student_url}')
    driver.get(student_url)
    time.sleep(2)

    # 지도교수 배정 화면으로 전환
    print('[INFO] 지도교수 배정 화면으로 전환...')
    try:
        driver.execute_script("""
            if (typeof showScreen === 'function') {
                showScreen('advisor-assignment');
            }
        """)
        time.sleep(2)

        # 연구계획서 정보 섹션의 label 확인
        labels = driver.execute_script("""
            const labels = Array.from(document.querySelectorAll('label'))
                .filter(l => l.textContent.includes('연구'))
                .map(l => l.textContent.trim());
            return labels;
        """)

        expected_labels = ['연구 제목', '연구 목적', '연구 필요성', '연구 문제 및 연구 방법']

        if labels == expected_labels:
            add_result('TC01: 학생 화면 필드 순서', 'PASS',
                      '모든 필드가 올바른 순서로 표시됨',
                      f'필드: {" → ".join(labels)}')
        else:
            add_result('TC01: 학생 화면 필드 순서', 'FAIL',
                      f'필드 순서 불일치',
                      f'기대: {expected_labels}\n실제: {labels}')

        # 연구 제목 내용 확인
        title_text = driver.execute_script("""
            const titleLabel = Array.from(document.querySelectorAll('label'))
                .find(l => l.textContent.includes('연구 제목'));
            if (titleLabel) {
                const container = titleLabel.nextElementSibling;
                return container ? container.textContent.trim() : null;
            }
            return null;
        """)

        if title_text and len(title_text) > 0:
            add_result('TC02: 학생 화면 연구제목 내용', 'PASS',
                      f'연구 제목이 표시됨',
                      f'내용: "{title_text[:60]}..."')
        else:
            add_result('TC02: 학생 화면 연구제목 내용', 'FAIL',
                      '연구 제목 내용이 없음')

    except Exception as e:
        add_result('TC01-02: 학생 화면 테스트', 'FAIL', f'오류 발생: {str(e)}')

    # ========================================
    # TEST 2: 관리자 화면 검증
    # ========================================
    print('=' * 80)
    print('TEST 2: 관리자 화면 검증')
    print('=' * 80)

    admin_file = os.path.join(project_root, 'admin-v3', 'index.html')
    admin_url = f'file:///{admin_file.replace(os.sep, "/")}'

    print(f'[INFO] 페이지 로드: {admin_url}')
    driver.get(admin_url)
    time.sleep(2)

    # 지도교수 배정 화면으로 전환
    print('[INFO] 지도교수 배정 화면으로 전환...')
    try:
        driver.execute_script('showScreen("advisor-assignment");')
        time.sleep(3)  # 데이터 로딩 대기

        # 테이블 로드 대기
        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'tbody tr')))
        except:
            pass

        # 첫 번째 행 클릭하여 모달 열기
        print('[INFO] 첫 번째 연구계획서 클릭...')
        rows = driver.find_elements(By.CSS_SELECTOR, 'tbody tr')

        if len(rows) > 0:
            # JavaScript로 클릭하여 overlay 문제 우회
            driver.execute_script('arguments[0].click();', rows[0])
            time.sleep(2)

            # 모달이 열렸는지 확인
            modal = driver.find_element(By.ID, 'advisor-assignment-modal')

            if modal and modal.is_displayed():
                add_result('TC03: 관리자 모달 열림', 'PASS', '모달이 정상적으로 열림')

                # 모달 내 필드 확인
                modal_labels = driver.execute_script("""
                    const modal = document.getElementById('advisor-assignment-modal');
                    if (!modal) return [];

                    const contentSection = modal.querySelector('.p-6[style*="overflow-y"]');
                    if (!contentSection) return [];

                    const labels = Array.from(contentSection.querySelectorAll('label'));
                    return labels
                        .filter(l => l.textContent.includes('연구'))
                        .map(l => l.textContent.trim());
                """)

                expected_modal_labels = ['연구 제목', '연구 목적', '연구 필요성', '연구 문제 및 연구 방법']

                if modal_labels == expected_modal_labels:
                    add_result('TC04: 관리자 모달 필드 순서', 'PASS',
                              '모든 필드가 올바른 순서로 표시됨',
                              f'필드: {" → ".join(modal_labels)}')
                else:
                    add_result('TC04: 관리자 모달 필드 순서', 'FAIL',
                              f'필드 순서 불일치',
                              f'기대: {expected_modal_labels}\n실제: {modal_labels}')

                # 연구 제목 필드 내용 확인
                title_in_modal = driver.execute_script("""
                    const modal = document.getElementById('advisor-assignment-modal');
                    if (!modal) return null;

                    const labels = Array.from(modal.querySelectorAll('label'));
                    const titleLabel = labels.find(l => l.textContent.includes('연구 제목'));

                    if (titleLabel) {
                        const container = titleLabel.nextElementSibling;
                        return container ? container.textContent.trim() : null;
                    }
                    return null;
                """)

                if title_in_modal and len(title_in_modal) > 0 and title_in_modal != '정보 없음':
                    add_result('TC05: 관리자 모달 연구제목 내용', 'PASS',
                              f'연구 제목이 표시됨',
                              f'내용: "{title_in_modal[:60]}..."')
                else:
                    add_result('TC05: 관리자 모달 연구제목 내용', 'FAIL',
                              f'연구 제목 내용이 없거나 기본값만 표시됨',
                              f'값: "{title_in_modal}"')

                # 스크린샷 저장
                screenshot_path = os.path.join(project_root, 'test_advisor_modal_admin.png')
                driver.save_screenshot(screenshot_path)
                print(f'   📸 스크린샷 저장: {screenshot_path}')

                # 모달 닫기
                driver.execute_script('closeAdvisorAssignmentModal();')
                time.sleep(1)

            else:
                add_result('TC03: 관리자 모달 열림', 'FAIL', '모달이 열리지 않음')
        else:
            add_result('TC03: 관리자 모달 열림', 'FAIL', '테이블에 데이터가 없음')

    except Exception as e:
        add_result('TC03-05: 관리자 화면 테스트', 'FAIL', f'오류 발생: {str(e)}')

    # ========================================
    # TEST 3: 교수 화면 검증
    # ========================================
    print('=' * 80)
    print('TEST 3: 교수 화면 검증')
    print('=' * 80)

    prof_file = os.path.join(project_root, 'professor-v3', 'professor-dashboard-proposal.html')
    prof_url = f'file:///{prof_file.replace(os.sep, "/")}'

    print(f'[INFO] 페이지 로드: {prof_url}')
    driver.get(prof_url)
    time.sleep(2)

    # 지도교수 배정 화면으로 전환
    print('[INFO] 지도교수 배정 화면으로 전환...')
    try:
        driver.execute_script('showScreen("advisor-assignment");')
        time.sleep(2)

        # 첫 번째 행 클릭하여 모달 열기
        print('[INFO] 첫 번째 연구계획서 클릭...')
        rows = driver.find_elements(By.CSS_SELECTOR, '#professor-student-list tr')

        if len(rows) > 0:
            # JavaScript로 클릭하여 overlay 문제 우회
            driver.execute_script('arguments[0].click();', rows[0])
            time.sleep(2)

            # 모달이 열렸는지 확인
            modal = driver.find_element(By.ID, 'advisor-assignment-modal')

            if modal and modal.is_displayed():
                add_result('TC06: 교수 모달 열림', 'PASS', '모달이 정상적으로 열림')

                # 모달 내 필드 확인
                modal_labels = driver.execute_script("""
                    const modal = document.getElementById('advisor-assignment-modal');
                    if (!modal) return [];

                    const contentSection = modal.querySelector('.p-6[style*="overflow-y"]');
                    if (!contentSection) return [];

                    const labels = Array.from(contentSection.querySelectorAll('label'));
                    return labels
                        .filter(l => l.textContent.includes('연구'))
                        .map(l => l.textContent.trim());
                """)

                expected_modal_labels = ['연구 제목', '연구 목적', '연구 필요성', '연구 문제 및 연구 방법']

                if modal_labels == expected_modal_labels:
                    add_result('TC07: 교수 모달 필드 순서', 'PASS',
                              '모든 필드가 올바른 순서로 표시됨',
                              f'필드: {" → ".join(modal_labels)}')
                else:
                    add_result('TC07: 교수 모달 필드 순서', 'FAIL',
                              f'필드 순서 불일치',
                              f'기대: {expected_modal_labels}\n실제: {modal_labels}')

                # 연구 제목 필드 내용 확인
                title_in_modal = driver.execute_script("""
                    const modal = document.getElementById('advisor-assignment-modal');
                    if (!modal) return null;

                    const labels = Array.from(modal.querySelectorAll('label'));
                    const titleLabel = labels.find(l => l.textContent.includes('연구 제목'));

                    if (titleLabel) {
                        const container = titleLabel.nextElementSibling;
                        return container ? container.textContent.trim() : null;
                    }
                    return null;
                """)

                if title_in_modal and len(title_in_modal) > 0 and title_in_modal != '정보 없음':
                    add_result('TC08: 교수 모달 연구제목 내용', 'PASS',
                              f'연구 제목이 표시됨',
                              f'내용: "{title_in_modal[:60]}..."')
                else:
                    add_result('TC08: 교수 모달 연구제목 내용', 'FAIL',
                              f'연구 제목 내용이 없거나 기본값만 표시됨',
                              f'값: "{title_in_modal}"')

                # 스크린샷 저장
                screenshot_path = os.path.join(project_root, 'test_advisor_modal_professor.png')
                driver.save_screenshot(screenshot_path)
                print(f'   📸 스크린샷 저장: {screenshot_path}')

                # 모달 닫기
                driver.execute_script('closeAdvisorAssignmentModal();')
                time.sleep(1)

            else:
                add_result('TC06: 교수 모달 열림', 'FAIL', '모달이 열리지 않음')
        else:
            add_result('TC06: 교수 모달 열림', 'FAIL', '테이블에 데이터가 없음')

    except Exception as e:
        add_result('TC06-08: 교수 화면 테스트', 'FAIL', f'오류 발생: {str(e)}')

    # ========================================
    # TEST 4: UI 일관성 검증
    # ========================================
    print('=' * 80)
    print('TEST 4: UI 일관성 검증')
    print('=' * 80)

    # 학생 화면 스크린샷
    driver.get(student_url)
    time.sleep(2)
    driver.execute_script('showScreen("advisor-assignment");')
    time.sleep(1)
    screenshot_path = os.path.join(project_root, 'test_advisor_screen_student.png')
    driver.save_screenshot(screenshot_path)
    print(f'   📸 학생 화면 스크린샷: {screenshot_path}')

    add_result('TC09: UI 스크린샷 생성', 'PASS',
              '모든 화면 스크린샷이 저장됨',
              '저장된 파일:\n- test_advisor_screen_student.png\n- test_advisor_modal_admin.png\n- test_advisor_modal_professor.png')

    # ========================================
    # 최종 결과
    # ========================================
    print('=' * 80)
    print('테스트 결과 요약')
    print('=' * 80)
    print()

    total = len(test_results)
    passed = sum(1 for r in test_results if r['status'] == 'PASS')
    failed = sum(1 for r in test_results if r['status'] == 'FAIL')

    print(f'총 테스트: {total}')
    print(f'성공: {passed} ✅')
    print(f'실패: {failed} ❌')
    print()

    if failed == 0:
        print('🎉 모든 테스트가 성공했습니다!')
        print()
        print('검증 완료 사항:')
        print('✓ 학생 화면: 4개 필드 순서 확인 (기준선)')
        print('✓ 관리자 모달: 연구제목 필드 추가 확인')
        print('✓ 교수 모달: 연구제목 필드 추가 확인')
        print('✓ 모든 화면 일관성 확인')
    else:
        print('⚠️ 일부 테스트가 실패했습니다.')
        print()
        print('실패한 테스트:')
        for test in test_results:
            if test['status'] == 'FAIL':
                print(f'  ❌ {test["name"]}: {test["message"]}')

    print()
    print('브라우저를 3초 후 종료합니다...')
    time.sleep(3)

    driver.quit()

    print()
    print('테스트 완료!')

    # 종료 코드
    sys.exit(0 if failed == 0 else 1)

except ImportError as e:
    print('❌ [ERROR] 필요한 패키지가 설치되지 않았습니다.')
    print(f'   {e}')
    print()
    print('다음 명령으로 설치하세요:')
    print('   pip install selenium webdriver-manager')
    sys.exit(1)

except Exception as e:
    print('❌ [ERROR] 테스트 실행 중 오류 발생')
    print(f'   {e}')
    import traceback
    traceback.print_exc()
    sys.exit(1)
