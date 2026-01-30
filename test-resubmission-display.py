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
    time.sleep(2)

    print('=== 재심 정보 제출 후 화면 표시 테스트 ===\n')

    # 1. 심사 화면 열기 및 제출
    print('[1] 심사 화면 열기 및 제출')
    driver.execute_script('showScreen("review"); openReviewDetail("RA_TEST_CHAIR", "chair");')
    time.sleep(2)

    driver.execute_script('''
        selectDecision("조건부합격");
        setTimeout(() => {
            document.querySelector('input[name="resubmission-reviewer-type"][value="committee"]').click();
            document.getElementById("resubmission-template-id").value = "TMPL_PROPOSAL";
            document.getElementById("resubmission-deadline").value = "2025-12-31";
            document.getElementById("chair-final-comment").value = "연구 방법론 보완 후 재심 요청";
            submitChairDecision();
        }, 1000);
    ''')
    time.sleep(3)

    # 2. 제출 후 재심 정보 표시 확인
    print('\n[2] 제출 후 재심 정보 섹션 표시 확인')
    display_check = driver.execute_script('''
        var section = document.getElementById('resubmission-info-section');
        return {
            exists: !!section,
            display: section ? section.style.display : null,
            visible: section ? section.offsetParent !== null : false,
            hasContent: section ? section.innerHTML.includes('재심 정보') : false,
            isReadonly: section ? section.innerHTML.includes('disabled') || section.innerHTML.includes('readonly') : false,
            innerHTML: section ? section.innerHTML : ''
        };
    ''')

    print(f'  섹션 존재: {display_check["exists"]}')
    print(f'  Display 스타일: {display_check["display"]}')
    print(f'  실제 표시: {display_check["visible"]}')
    print(f'  재심 정보 포함: {display_check["hasContent"]}')
    print(f'  읽기 전용 모드: {display_check["isReadonly"]}')

    if not display_check["exists"]:
        print('\n❌ FAIL: 재심 정보 섹션이 존재하지 않음')
    elif display_check["display"] == "none":
        print(f'\n❌ FAIL: 재심 정보 섹션이 display:none 상태입니다')
    elif not display_check["visible"]:
        print(f'\n❌ FAIL: 재심 정보 섹션이 화면에 표시되지 않음')
    elif not display_check["hasContent"]:
        print(f'\n❌ FAIL: 재심 정보 컨텐츠가 없음')
    elif not display_check["isReadonly"]:
        print(f'\n❌ FAIL: 읽기 전용 모드가 아님')
    else:
        print('\n✅ PASS: 재심 정보가 제출 후 정상적으로 표시됨!')

        # 3. 재심 데이터 상세 확인
        print('\n[3] 저장된 재심 데이터 확인')
        resub_data = driver.execute_script('''
            var result = REVIEW_RESULTS.find(r => r.assignmentId === 'RA_TEST_CHAIR');
            return result ? result.resubmission : null;
        ''')

        if resub_data:
            print(f'  심사위원 타입: {resub_data.get("reviewerType")}')
            print(f'  평가표 ID: {resub_data.get("evaluationTemplateId")}')
            print(f'  마감일: {resub_data.get("deadline")}')
            print(f'  재심 차수: {resub_data.get("attemptNumber")}')
            print(f'  상태: {resub_data.get("status")}')
            print('\n✅ PASS: 재심 데이터가 REVIEW_RESULTS에 정상 저장됨')
        else:
            print('\n❌ FAIL: REVIEW_RESULTS에 재심 데이터가 없음')

        # 4. 화면에 표시된 내용 검증
        print('\n[4] 화면 표시 내용 검증')
        content_check = driver.execute_script('''
            var section = document.getElementById('resubmission-info-section');
            if (!section) return { error: 'Section not found' };

            var html = section.innerHTML;
            return {
                hasHeader: html.includes('재심 정보 (제출됨)'),
                hasReviewerType: html.includes('심사위원회 (전체)') || html.includes('심사위원회 중 1인'),
                hasTemplate: html.includes('평가표 선택'),
                hasDeadline: html.includes('재심 제출 마감일'),
                hasAttempt: html.includes('재심 차수'),
                hasStatus: html.includes('상태')
            };
        ''')

        if 'error' not in content_check:
            print(f'  헤더 "재심 정보 (제출됨)": {content_check["hasHeader"]}')
            print(f'  심사위원 타입 표시: {content_check["hasReviewerType"]}')
            print(f'  평가표 표시: {content_check["hasTemplate"]}')
            print(f'  마감일 표시: {content_check["hasDeadline"]}')
            print(f'  재심 차수 표시: {content_check["hasAttempt"]}')
            print(f'  상태 표시: {content_check["hasStatus"]}')

            all_displayed = all(content_check.values())
            if all_displayed:
                print('\n✅ PASS: 모든 재심 정보 항목이 화면에 표시됨')
            else:
                print('\n⚠️ WARNING: 일부 재심 정보 항목이 표시되지 않음')

    print('\n=== 테스트 완료 ===')
    print('브라우저를 5초간 유지합니다...')
    time.sleep(5)

except Exception as e:
    print(f'\n❌ 오류 발생: {e}')
    import traceback
    traceback.print_exc()
finally:
    driver.quit()
