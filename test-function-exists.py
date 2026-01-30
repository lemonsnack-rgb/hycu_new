from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import sys
import io

# UTF-8 출력 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

try:
    driver.get('file:///g:/내 드라이브/00_프로젝트/01_한양사이버대/hycu_new/professor-v3/professor-dashboard-proposal.html')
    time.sleep(3)

    print('=== 함수 존재 여부 테스트 ===\n')

    # 1. 함수 존재 여부
    functions = driver.execute_script('''
        return {
            renderReviewDetail: typeof window.renderReviewDetail,
            submitChairDecision: typeof window.submitChairDecision,
            openReviewDetail: typeof window.openReviewDetail,
            ReviewService: typeof window.ReviewService,
            getCurrentProfessorId: window.ReviewService ? typeof window.ReviewService.getCurrentProfessorId : 'N/A'
        };
    ''')

    print('[1] 함수 존재 여부')
    for name, type_str in functions.items():
        status = '✅' if type_str == 'function' or type_str == 'object' else '❌'
        print(f'  {status} {name}: {type_str}')

    # 2. getCurrentProfessorId 호출
    if functions['ReviewService'] == 'object':
        print('\n[2] ReviewService.getCurrentProfessorId() 결과')
        prof_id = driver.execute_script('return ReviewService.getCurrentProfessorId();')
        print(f'  결과: {prof_id}')

    # 3. CURRENT_USER
    print('\n[3] CURRENT_USER')
    current_user = driver.execute_script('return window.CURRENT_USER;')
    print(f'  {current_user}')

    # 4. renderReviewDetail 직접 호출
    print('\n[4] renderReviewDetail 직접 호출')
    driver.execute_script('renderReviewDetail("RA_TEST_CHAIR", "chair", false);')
    time.sleep(2)

    # 5. 호출 후 currentProfessorId
    print('\n[5] 호출 후 currentProfessorId')
    after_call = driver.execute_script('return window.currentProfessorId;')
    print(f'  currentProfessorId: {after_call}')

    # 6. 컨텐츠 렌더링 확인
    print('\n[6] 컨텐츠 렌더링')
    content_check = driver.execute_script('''
        var container = document.querySelector('#review-detail-content');
        return {
            exists: !!container,
            length: container ? container.innerHTML.length : 0
        };
    ''')
    print(f'  Container exists: {content_check["exists"]}')
    print(f'  Content length: {content_check["length"]} chars')

    print('\n브라우저 5초 유지...')
    time.sleep(5)

except Exception as e:
    print(f'\n오류 발생: {e}')
    import traceback
    traceback.print_exc()
    time.sleep(3)
finally:
    driver.quit()
