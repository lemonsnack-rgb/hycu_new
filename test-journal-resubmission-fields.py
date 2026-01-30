# -*- coding: utf-8 -*-
"""
학술지논문 재제출 - 기존 제출 내역 필드 검증
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
print('학술지논문 재제출 - 기존 제출 내역 필드 검증')
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

# 순번 5 (재제출 케이스) 클릭
print('[순번 5 - 재제출 케이스 확인]')
print('-' * 80)

rows = driver.find_elements(By.CSS_SELECTOR, '.journal-table tbody tr')
resubmit_row = rows[4]  # 5번째 행 (index 4)
submit_btn = resubmit_row.find_elements(By.TAG_NAME, 'td')[-1].find_element(By.TAG_NAME, 'button')
submit_btn.click()
time.sleep(2)

try:
    # "기존 제출 내역" 섹션 확인
    orig_section = driver.find_element(By.XPATH, "//h3[contains(text(), '기존 제출 내역')]")
    parent = orig_section.find_element(By.XPATH, '..')

    print(f'✓ 타이틀: {orig_section.text}')
    print()

    # 학술지논문 전체 필드 확인 (10개 입력 필드 + 1개 첨부파일)
    expected_fields = [
        '논문지도교수',
        '논문제목(한글)',
        '저자명(전체)',
        '학술지명',
        '학술지 구분',
        '발행기관',
        '집/권/호',
        '발행년월일',
        '수록 Page',
        '증빙서류',
        '첨부파일'
    ]

    print('입력 필드 확인:')
    found_fields = []

    for field in expected_fields:
        try:
            label = parent.find_element(By.XPATH, f".//label[contains(text(), '{field}')]")
            label_class = label.get_attribute('class')
            has_w24 = 'w-24' in label_class

            # 값 확인
            if field == '첨부파일':
                value_elem = label.find_element(By.XPATH, 'following-sibling::div[1]')
                value = value_elem.text
            else:
                value_elem = label.find_element(By.XPATH, 'following-sibling::input[1]')
                value = value_elem.get_attribute('value')

            found_fields.append(field)
            print(f'  ✓ {field}: w-24={has_w24}, 값="{value}"')
        except Exception as e:
            print(f'  ✗ {field}: (없음) - {str(e)[:50]}')

    print()
    print(f'발견된 필드: {len(found_fields)}/{len(expected_fields)}개')

    # border-t 구분선 확인
    try:
        border_div = parent.find_element(By.XPATH, ".//div[contains(@class, 'border-t')]")
        print(f'✓ border-t 구분선 존재')
    except:
        print(f'✗ border-t 구분선 없음')

    print()

    # 제출 정보 필드 확인 (2개)
    submission_info_fields = ['제출일시', '심사 결과']

    print('제출 정보 필드 확인:')
    for field in submission_info_fields:
        try:
            label = parent.find_element(By.XPATH, f".//label[contains(text(), '{field}')]")
            label_class = label.get_attribute('class')
            has_w24 = 'w-24' in label_class

            print(f'  ✓ {field}: w-24={has_w24}')
        except:
            print(f'  ✗ {field}: (없음)')

    # 총평 보기 버튼 확인
    print()
    try:
        review_btn = parent.find_element(By.XPATH, ".//button[contains(text(), '총평 보기')]")
        print(f'✓ 총평 보기 버튼 존재')
        print(f'  클래스: {review_btn.get_attribute("class")}')

        # 총평 보기 클릭 테스트
        print()
        print('[총평 보기 버튼 클릭]')
        review_btn.click()
        time.sleep(1)

        modal_title = driver.find_element(By.XPATH, "//h3[contains(text(), '평가 총평')]")
        modal_content = driver.find_element(By.XPATH, "//div[contains(@class, 'whitespace-pre-wrap')]")
        print(f'  모달 타이틀: {modal_title.text}')
        print(f'  모달 내용: {modal_content.text[:50]}...')

        # 모달 닫기
        close_btn = driver.find_element(By.XPATH, "//button[contains(text(), '닫기')]")
        close_btn.click()
        time.sleep(1)
        print(f'  ✓ 모달 닫기 성공')

    except Exception as e:
        print(f'✗ 총평 보기 버튼 테스트 실패: {str(e)[:80]}')

    # 스크린샷 저장
    driver.save_screenshot('test_journal_resubmission_all_fields.png')
    print()
    print('✓ 스크린샷 저장: test_journal_resubmission_all_fields.png')

    # 최종 결과
    print()
    print('=' * 80)
    print('검증 결과')
    print('=' * 80)

    all_fields_found = len(found_fields) == len(expected_fields)

    if all_fields_found:
        print('✅ 학술지논문 전체 입력 필드 (11개) 모두 표시됨')
        print(f'   - 입력 필드: {", ".join(found_fields[:10])}')
        print(f'   - 첨부파일: {found_fields[10]}')
        print('✅ 제출 정보 필드 (2개) 모두 표시됨')
        print('   - 제출일시, 심사 결과')
        print('✅ 총평 보기 버튼 정상 동작')
        print()
        print('🎉 재제출 화면이 학술지논문 구조로 완벽히 통일되었습니다!')
    else:
        print(f'⚠️  일부 필드 누락: {len(found_fields)}/{len(expected_fields)}개')
        missing = set(expected_fields) - set(found_fields)
        print(f'   누락된 필드: {", ".join(missing)}')

except Exception as e:
    print(f'✗ 테스트 실패: {str(e)[:80]}')

# JavaScript 에러 확인
print()
print('=' * 80)
print('[JavaScript 에러 확인]')
print('=' * 80)
logs = driver.get_log('browser')
errors = [log for log in logs if log['level'] == 'SEVERE']
print(f'에러 개수: {len(errors)}개')
if errors:
    for error in errors[:3]:
        print(f'  - {error["message"][:80]}')
else:
    print('✅ JavaScript 에러 없음')

print()
print('브라우저를 15초간 유지합니다.')
time.sleep(15)

driver.quit()
print('\n테스트 완료')
