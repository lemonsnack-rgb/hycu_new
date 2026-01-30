# -*- coding: utf-8 -*-
"""
학술지논문 제출 통일 구조 검증 테스트
"""

import os
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

print('=' * 80)
print('학술지논문 제출 통일 구조 검증')
print('=' * 80)
print()

chrome_options = Options()
chrome_options.add_argument('--disable-blink-features=AutomationControlled')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)
driver.maximize_window()

file_path = os.path.abspath('student-v3/student-dashboard.html')
url = f'file:///{file_path}'
driver.get(url)
time.sleep(2)

# 학술지논문 제출 화면으로 이동
driver.execute_script("""
    if (typeof showScreen === 'function') {
        showScreen('journal-submission');
    }
""")
time.sleep(2)

test_results = []

# TEST 1: 목록 화면 - "제출구분" 컬럼 확인
print('[TEST 1] 목록 화면 - 제출구분 컬럼 확인')
print('-' * 80)

try:
    headers = driver.find_elements(By.CSS_SELECTOR, '.journal-table thead th')
    header_texts = [h.text.strip() for h in headers]

    print(f'테이블 헤더: {header_texts}')

    expected_headers = ['순번', '심사단계', '제출기간', '제출구분', '제출상태', '심사결과', '관리']
    has_submission_type = '제출구분' in header_texts
    headers_match = header_texts == expected_headers

    print(f'  ✓ "제출구분" 컬럼 존재: {has_submission_type}')
    print(f'  ✓ 헤더 순서 일치: {headers_match}')

    if headers_match:
        print('  ✅ 목록 헤더 구조 정상')
        test_results.append(('목록 헤더', True))
    else:
        print(f'  ❌ 예상: {expected_headers}')
        print(f'  ❌ 실제: {header_texts}')
        test_results.append(('목록 헤더', False))

except Exception as e:
    print(f'  ❌ 테스트 실패: {str(e)[:80]}')
    test_results.append(('목록 헤더', False))

# TEST 2: 목록 행 - "X차 제출" 표시 확인
print('\n[TEST 2] 목록 행 - 제출구분 표시 확인')
print('-' * 80)

try:
    rows = driver.find_elements(By.CSS_SELECTOR, '.journal-table tbody tr')
    print(f'총 {len(rows)}개 행 발견')

    # 첫 번째 행 확인
    if len(rows) > 0:
        first_row_cells = rows[0].find_elements(By.TAG_NAME, 'td')
        if len(first_row_cells) >= 4:
            submission_type_cell = first_row_cells[3].text.strip()
            print(f'  첫 번째 행 제출구분: "{submission_type_cell}"')

            has_차제출 = '차 제출' in submission_type_cell
            print(f'  ✓ "X차 제출" 형식: {has_차제출}')

            if has_차제출:
                print('  ✅ 제출구분 표시 정상')
                test_results.append(('목록 제출구분', True))
            else:
                print('  ❌ "X차 제출" 형식이 아님')
                test_results.append(('목록 제출구분', False))
        else:
            print(f'  ❌ 행의 셀 개수 부족: {len(first_row_cells)}개')
            test_results.append(('목록 제출구분', False))
    else:
        print('  ❌ 목록에 행이 없음')
        test_results.append(('목록 제출구분', False))

except Exception as e:
    print(f'  ❌ 테스트 실패: {str(e)[:80]}')
    test_results.append(('목록 제출구분', False))

driver.save_screenshot('test_journal_list.png')

# TEST 3: 재제출 화면 - "기존 제출 내역" 섹션 확인
print('\n[TEST 3] 재제출 화면 - 기존 제출 내역 확인')
print('-' * 80)

try:
    # 순번 5 (재제출 케이스) 클릭
    rows = driver.find_elements(By.CSS_SELECTOR, '.journal-table tbody tr')

    # 순번 5 찾기 (마지막 행)
    resubmit_row = None
    for idx, row in enumerate(rows):
        cells = row.find_elements(By.TAG_NAME, 'td')
        if len(cells) > 0 and cells[0].text.strip() == '5':
            resubmit_row = row
            break

    if resubmit_row:
        print('  재제출 케이스 (순번 5) 발견')
        submit_btn = resubmit_row.find_elements(By.TAG_NAME, 'td')[-1].find_element(By.TAG_NAME, 'button')
        submit_btn.click()
        time.sleep(2)

        # "기존 제출 내역" 섹션 확인
        try:
            orig_section = driver.find_element(By.XPATH, "//h3[contains(text(), '기존 제출 내역')]")
            print(f'  ✓ "기존 제출 내역" 섹션 존재')

            parent = orig_section.find_element(By.XPATH, '../..')

            # 필드 확인
            expected_fields = ['논문지도교수', '논문제목(한글)', '첨부파일', '제출일시', '심사 결과']
            found_fields = []

            for field in expected_fields:
                try:
                    label = parent.find_element(By.XPATH, f".//label[contains(text(), '{field}')]")
                    found_fields.append(field)
                    print(f'  ✓ {field} 필드 존재')
                except:
                    print(f'  ❌ {field} 필드 없음')

            # 총평 보기 버튼 확인
            try:
                review_btn = parent.find_element(By.XPATH, ".//button[contains(text(), '총평 보기')]")
                print(f'  ✓ 총평 보기 버튼 존재')

                # 총평 보기 클릭 테스트
                review_btn.click()
                time.sleep(1)

                # 모달 확인
                try:
                    modal = driver.find_element(By.XPATH, "//div[contains(@class, 'fixed') and contains(@class, 'inset-0')]")
                    modal_title = driver.find_element(By.XPATH, "//h3[contains(text(), '평가 총평')]")
                    print(f'  ✓ 모달 표시 성공: {modal_title.text}')

                    # 모달 닫기
                    close_btn = driver.find_element(By.XPATH, "//button[contains(text(), '닫기')]")
                    close_btn.click()
                    time.sleep(1)
                    print(f'  ✓ 모달 닫기 성공')

                except Exception as e:
                    print(f'  ❌ 모달 확인 실패: {str(e)[:80]}')

            except Exception as e:
                print(f'  ❌ 총평 보기 버튼 없음: {str(e)[:50]}')

            all_fields_found = len(found_fields) == len(expected_fields)

            if all_fields_found:
                print('  ✅ 기존 제출 내역 구조 정상')
                test_results.append(('기존 제출 내역', True))
            else:
                print(f'  ❌ 필드 부족: {len(found_fields)}/{len(expected_fields)}개')
                test_results.append(('기존 제출 내역', False))

            driver.save_screenshot('test_journal_resubmit.png')

            # 목록으로 돌아가기
            back_btn = driver.find_element(By.CSS_SELECTOR, 'button[data-action="back-to-list"]')
            back_btn.click()
            time.sleep(1)

        except Exception as e:
            print(f'  ❌ 기존 제출 내역 섹션 없음: {str(e)[:80]}')
            test_results.append(('기존 제출 내역', False))
    else:
        print('  ❌ 순번 5 (재제출 케이스) 없음')
        test_results.append(('기존 제출 내역', False))

except Exception as e:
    print(f'  ❌ 테스트 실패: {str(e)[:80]}')
    test_results.append(('기존 제출 내역', False))

# TEST 4: 신규 제출 화면 - 지도교수 중복 제거 확인
print('\n[TEST 4] 신규 제출 화면 - 지도교수 중복 제거 확인')
print('-' * 80)

try:
    # 순번 3 (미제출 상태) 클릭
    rows = driver.find_elements(By.CSS_SELECTOR, '.journal-table tbody tr')

    if len(rows) >= 3:
        submit_btn = rows[2].find_elements(By.TAG_NAME, 'td')[-1].find_element(By.TAG_NAME, 'button')
        submit_btn.click()
        time.sleep(2)

        # 읽기 전용 지도교수 섹션이 없는지 확인 (bg-gray-50 회색 박스)
        try:
            readonly_advisor = driver.find_element(By.XPATH, "//div[contains(@class, 'bg-gray-50')]//label[contains(text(), '지도교수')]")
            print('  ❌ 읽기 전용 지도교수 섹션 발견 (제거되어야 함)')
            test_results.append(('중복 제거', False))
        except:
            print('  ✓ 읽기 전용 지도교수 섹션 없음 (정상)')

            # "논문지도교수" 입력 필드만 존재하는지 확인
            try:
                advisor_input = driver.find_element(By.ID, 'journal-advisor')
                print('  ✓ 논문지도교수 입력 필드 존재')

                # 라벨 너비 확인 (w-24)
                label = driver.find_element(By.XPATH, "//label[@for='journal-advisor' or contains(text(), '논문지도교수')]")
                label_class = label.get_attribute('class')
                has_w24 = 'w-24' in label_class

                print(f'  ✓ 라벨 너비 w-24: {has_w24}')

                if has_w24:
                    print('  ✅ 지도교수 중복 제거 및 라벨 통일 완료')
                    test_results.append(('중복 제거', True))
                else:
                    print(f'  ❌ 라벨 클래스: {label_class}')
                    test_results.append(('중복 제거', False))

            except Exception as e:
                print(f'  ❌ 논문지도교수 필드 없음: {str(e)[:80]}')
                test_results.append(('중복 제거', False))

        driver.save_screenshot('test_journal_new_submission.png')

        # 목록으로 돌아가기
        back_btn = driver.find_element(By.CSS_SELECTOR, 'button[data-action="back-to-list"]')
        back_btn.click()
        time.sleep(1)

    else:
        print('  ❌ 순번 3 행 없음')
        test_results.append(('중복 제거', False))

except Exception as e:
    print(f'  ❌ 테스트 실패: {str(e)[:80]}')
    test_results.append(('중복 제거', False))

# TEST 5: JavaScript 에러 확인
print('\n[TEST 5] JavaScript 에러 확인')
print('-' * 80)

logs = driver.get_log('browser')
errors = [log for log in logs if log['level'] == 'SEVERE']
print(f'에러 개수: {len(errors)}개')

if errors:
    for error in errors[:3]:
        print(f'  - {error["message"][:100]}')
    test_results.append(('JavaScript 에러', False))
else:
    print('  ✅ JavaScript 에러 없음')
    test_results.append(('JavaScript 에러', True))

# 최종 결과
print()
print('=' * 80)
print('최종 테스트 결과')
print('=' * 80)
print()

for test_name, result in test_results:
    status = '✅ PASS' if result else '❌ FAIL'
    print(f'{status}: {test_name}')

print()

all_pass = all(result for _, result in test_results)

if all_pass:
    print('🎉 모든 테스트 통과!')
    print()
    print('검증 완료 항목:')
    print('  1. 목록 화면에 "제출구분" 컬럼 추가')
    print('  2. 제출구분 "X차 제출" 형식으로 표시')
    print('  3. 재제출 시 "기존 제출 내역" 섹션 표시')
    print('  4. 중복 지도교수 필드 제거 (입력 필드만 유지)')
    print('  5. 라벨 너비 w-24로 통일')
    print('  6. JavaScript 에러 없음')
else:
    print('⚠️ 일부 테스트 실패')
    failed_tests = [name for name, result in test_results if not result]
    print(f'실패한 테스트: {", ".join(failed_tests)}')

print()
print('브라우저를 15초간 유지합니다.')
time.sleep(15)

driver.quit()
print('\n테스트 완료')
sys.exit(0 if all_pass else 1)
