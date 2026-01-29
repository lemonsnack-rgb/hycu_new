# -*- coding: utf-8 -*-
"""
관리자용 지도단계목록 화면 - 본부일정관리 & 단계별업무관리 자동화 테스트
Test target: Admin stage management screens (headquarters schedule & stage task management)
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

class TestAdminStageManagement:

    def setup_method(self):
        """각 테스트 전 실행: 브라우저 초기화"""
        self.driver = webdriver.Chrome()
        self.driver.set_window_size(1400, 1080)

        # admin-v3/index.html 열기
        project_path = os.path.abspath("admin-v3/index.html")
        self.driver.get(f"file:///{project_path}")
        self.wait = WebDriverWait(self.driver, 10)

        # 페이지 로드 대기
        time.sleep(2)

    def teardown_method(self):
        """각 테스트 후 실행: 브라우저 종료"""
        self.driver.quit()

    def test_01_headquarters_schedule_button_exists(self):
        """테스트 1: 본부일정관리 버튼이 표시되는지 확인"""
        print("\n[Test 1] 본부일정관리 버튼 표시 확인")

        self.driver.execute_script("switchView('typeManagementNew')")
        time.sleep(1)

        # Find button by onclick attribute
        btn = self.driver.find_element(By.XPATH,
            "//button[contains(@onclick, 'openHeadquartersScheduleModal')]")
        assert btn is not None, "본부일정관리 버튼이 없습니다"

        btn_text = btn.text
        print(f"  [OK] 버튼 텍스트: {btn_text}")
        assert btn_text == "본부일정관리", f"버튼 텍스트가 다릅니다: {btn_text}"

        print("[PASS] 본부일정관리 버튼 표시 확인")

    def test_02_headquarters_modal_structure(self):
        """테스트 2: 본부일정관리 모달이 올바른 구조로 표시되는지 확인"""
        print("\n[Test 2] 본부일정관리 모달 구조 확인")

        self.driver.execute_script("switchView('typeManagementNew')")
        time.sleep(1)

        # Open modal
        self.driver.execute_script("openHeadquartersScheduleModal()")
        time.sleep(1)

        # Check modal exists
        modal = self.driver.find_element(By.ID, "headquarters-schedule-modal")
        assert modal is not None, "모달이 생성되지 않았습니다"
        print("  [OK] 모달 생성됨")

        # Check title
        title = modal.find_element(By.TAG_NAME, "h3")
        assert "본부일정관리" in title.text, f"모달 제목이 다릅니다: {title.text}"
        print(f"  [OK] 모달 제목: {title.text}")

        # Check table structure
        table = modal.find_element(By.TAG_NAME, "table")
        thead = table.find_element(By.TAG_NAME, "thead")
        headers = thead.find_elements(By.TAG_NAME, "th")
        assert len(headers) == 4, f"헤더 컬럼 수가 4개가 아닙니다: {len(headers)}"
        print(f"  [OK] 테이블 헤더 수: {len(headers)}")

        expected_headers = ["기본단계", "일정구분", "시작일시", "종료일시"]
        for i, expected in enumerate(expected_headers):
            assert expected in headers[i].text, f"헤더 {i+1}이 다릅니다"
        print(f"  [OK] 헤더: {', '.join(expected_headers)}")

        # Check 4 basic stages × 2 rows each = 8 rows
        tbody = table.find_element(By.TAG_NAME, "tbody")
        rows = tbody.find_elements(By.TAG_NAME, "tr")
        assert len(rows) == 8, f"테이블 행 수가 8개가 아닙니다: {len(rows)}"
        print(f"  [OK] 테이블 행 수: {len(rows)} (4개 기본단계 × 2행)")

        # Close modal for cleanup
        self.driver.execute_script("closeHeadquartersScheduleModal()")

        print("[PASS] 본부일정관리 모달 구조 확인")

    def test_03_headquarters_schedule_save(self):
        """테스트 3: 본부일정관리 데이터 입력 및 저장 확인"""
        print("\n[Test 3] 본부일정관리 데이터 저장 확인")

        self.driver.execute_script("switchView('typeManagementNew')")
        time.sleep(1)

        # Open modal
        self.driver.execute_script("openHeadquartersScheduleModal()")
        time.sleep(1)

        # Find first input (논문작성계획서 - 신청 - 시작일시)
        first_input = self.driver.find_element(By.CSS_SELECTOR,
            "input[data-stage='논문작성계획서'][data-type='application'][data-field='startDate']")

        # Set value via JavaScript
        self.driver.execute_script(
            "arguments[0].value = '2025-03-01T09:00';", first_input)
        print("  [OK] 시작일시 입력: 2025-03-01T09:00")

        # Set end date
        end_input = self.driver.find_element(By.CSS_SELECTOR,
            "input[data-stage='논문작성계획서'][data-type='application'][data-field='endDate']")
        self.driver.execute_script(
            "arguments[0].value = '2025-03-31T23:59';", end_input)
        print("  [OK] 종료일시 입력: 2025-03-31T23:59")

        # Capture alerts
        self.driver.execute_script("""
            window.alertMessages = [];
            window.alert = function(msg) {
                window.alertMessages.push(msg);
            };
        """)

        # Save
        self.driver.execute_script("saveHeadquartersSchedule()")
        time.sleep(1)

        # Check alert
        alerts = self.driver.execute_script("return window.alertMessages || []")
        if alerts:
            print(f"  [OK] 알림: {alerts[0]}")
            assert "저장" in alerts[0], f"저장 알림이 아닙니다: {alerts[0]}"

        # Check modal closed
        modals = self.driver.find_elements(By.ID, "headquarters-schedule-modal")
        assert len(modals) == 0, "모달이 닫히지 않았습니다"
        print("  [OK] 모달 자동으로 닫힘")

        # Verify data saved
        saved_data = self.driver.execute_script("return window.headquartersSchedules;")
        assert saved_data is not None, "데이터가 저장되지 않았습니다"
        assert '논문작성계획서' in saved_data, "논문작성계획서 데이터가 없습니다"
        print(f"  [OK] 데이터 저장됨: {list(saved_data.keys())}")

        print("[PASS] 본부일정관리 데이터 저장 확인")

    def test_04_stage_task_button_exists(self):
        """테스트 4: 단계별업무관리 버튼이 표시되는지 확인"""
        print("\n[Test 4] 단계별업무관리 버튼 표시 확인")

        self.driver.execute_script("switchView('typeManagementNew')")
        time.sleep(1)

        btn = self.driver.find_element(By.ID, "stage-task-management-btn")
        assert btn is not None, "단계별업무관리 버튼이 없습니다"

        btn_text = btn.text
        print(f"  [OK] 버튼 텍스트: {btn_text}")
        assert btn_text == "단계별업무관리", f"버튼 텍스트가 다릅니다: {btn_text}"

        print("[PASS] 단계별업무관리 버튼 표시 확인")

    def test_05_select_workflow_and_open_task_modal(self):
        """테스트 5: 테이블 행 선택 후 단계별업무관리 모달 열기"""
        print("\n[Test 5] 테이블 행 선택 및 모달 열기 확인")

        self.driver.execute_script("switchView('typeManagementNew')")
        time.sleep(1)

        # Get workflow with hierarchicalStages
        workflow_id = self.driver.execute_script("""
            const workflow = mockThesisStages.find(w =>
                w.hierarchicalStages &&
                w.hierarchicalStages.length > 0 &&
                w.hierarchicalStages[0].subStages &&
                w.hierarchicalStages[0].subStages.length > 0
            );
            return workflow ? workflow.id : null;
        """)

        if not workflow_id:
            print("[SKIP] 세부단계가 있는 지도단계 데이터가 없습니다")
            return

        print(f"  [OK] Workflow ID: {workflow_id}")

        # Select workflow
        self.driver.execute_script(f"selectWorkflowForTaskManagement('{workflow_id}')")
        time.sleep(0.5)

        # Check selected workflow ID stored
        selected_id = self.driver.execute_script("return window.selectedWorkflowId;")
        assert selected_id == workflow_id, "선택된 workflow ID가 다릅니다"
        print(f"  [OK] 선택된 workflow 저장됨")

        # Open modal via button
        btn = self.driver.find_element(By.ID, "stage-task-management-btn")
        btn.click()
        time.sleep(1)

        # Check modal exists
        modal = self.driver.find_element(By.ID, "stage-task-modal")
        assert modal is not None, "단계별업무관리 모달이 생성되지 않았습니다"
        print("  [OK] 모달 생성됨")

        # Close modal for cleanup
        self.driver.execute_script("closeStageTaskModal()")

        print("[PASS] 테이블 행 선택 및 모달 열기 확인")

    def test_06_stage_task_modal_structure(self):
        """테스트 6: 단계별업무관리 모달의 테이블 구조 확인"""
        print("\n[Test 6] 단계별업무관리 모달 구조 확인")

        self.driver.execute_script("switchView('typeManagementNew')")
        time.sleep(1)

        # Get workflow with sub-stages
        workflow_id = self.driver.execute_script("""
            const workflow = mockThesisStages.find(w =>
                w.hierarchicalStages &&
                w.hierarchicalStages.length > 0 &&
                w.hierarchicalStages[0].subStages &&
                w.hierarchicalStages[0].subStages.length > 0
            );
            return workflow ? workflow.id : null;
        """)

        if not workflow_id:
            print("[SKIP] 세부단계가 있는 지도단계 데이터가 없습니다")
            return

        print(f"  [OK] Workflow ID: {workflow_id}")

        # Open modal
        self.driver.execute_script(f"openStageTaskManagementModal('{workflow_id}')")
        time.sleep(1)

        modal = self.driver.find_element(By.ID, "stage-task-modal")

        # Check table headers
        table = modal.find_element(By.TAG_NAME, "table")
        headers = table.find_elements(By.CSS_SELECTOR, "thead th")
        assert len(headers) == 6, f"헤더 수가 6개가 아닙니다: {len(headers)}"
        print(f"  [OK] 테이블 헤더 수: {len(headers)}")

        expected = ["세부단계명", "승인권한", "평가표 유형", "일정구분", "시작일시", "종료일시"]
        for i, exp in enumerate(expected):
            assert exp in headers[i].text, f"헤더 {i+1}이 다릅니다"
        print(f"  [OK] 헤더: {', '.join(expected)}")

        # Check each sub-stage has 2 rows (submission + review)
        tbody = table.find_element(By.TAG_NAME, "tbody")
        rows = tbody.find_elements(By.TAG_NAME, "tr")
        assert len(rows) % 2 == 0, "세부단계 행 수가 짝수가 아닙니다"
        print(f"  [OK] 테이블 행 수: {len(rows)} (각 세부단계 × 2행)")

        # Check select dropdowns
        approval_selects = modal.find_elements(By.CSS_SELECTOR,
            "select[data-field='approvalAuthority']")
        eval_selects = modal.find_elements(By.CSS_SELECTOR,
            "select[data-field='evaluationType']")

        assert len(approval_selects) > 0, "승인권한 select가 없습니다"
        assert len(eval_selects) > 0, "평가표 유형 select가 없습니다"
        print(f"  [OK] 승인권한 select: {len(approval_selects)}개")
        print(f"  [OK] 평가표 유형 select: {len(eval_selects)}개")

        # Close modal for cleanup
        self.driver.execute_script("closeStageTaskModal()")

        print("[PASS] 단계별업무관리 모달 구조 확인")

    def test_07_stage_task_save(self):
        """테스트 7: 단계별업무관리 데이터 입력 및 저장"""
        print("\n[Test 7] 단계별업무관리 데이터 저장 확인")

        self.driver.execute_script("switchView('typeManagementNew')")
        time.sleep(1)

        # Get workflow
        workflow_id = self.driver.execute_script("""
            const workflow = mockThesisStages.find(w =>
                w.hierarchicalStages && w.hierarchicalStages.length > 0
            );
            return workflow ? workflow.id : null;
        """)

        if not workflow_id:
            print("[SKIP] 데이터 없음")
            return

        print(f"  [OK] Workflow ID: {workflow_id}")

        # Open modal
        self.driver.execute_script(f"openStageTaskManagementModal('{workflow_id}')")
        time.sleep(1)

        # Select approval authority (first option)
        approval_select = self.driver.find_element(By.CSS_SELECTOR,
            "select[data-field='approvalAuthority']")
        self.driver.execute_script("arguments[0].selectedIndex = 1;", approval_select)
        print("  [OK] 승인권한 선택")

        # Select evaluation type (first option)
        eval_select = self.driver.find_element(By.CSS_SELECTOR,
            "select[data-field='evaluationType']")
        self.driver.execute_script("arguments[0].selectedIndex = 1;", eval_select)
        print("  [OK] 평가표 유형 선택")

        # Set submission schedule
        submission_start = self.driver.find_element(By.CSS_SELECTOR,
            "input[data-schedule-type='submission'][data-field='startDate']")
        self.driver.execute_script(
            "arguments[0].value = '2025-04-01T09:00';", submission_start)

        submission_end = self.driver.find_element(By.CSS_SELECTOR,
            "input[data-schedule-type='submission'][data-field='endDate']")
        self.driver.execute_script(
            "arguments[0].value = '2025-04-30T23:59';", submission_end)
        print("  [OK] 제출 일정 입력")

        # Capture alerts
        self.driver.execute_script("""
            window.alertMessages = [];
            window.alert = function(msg) {
                window.alertMessages.push(msg);
            };
        """)

        # Save
        self.driver.execute_script(f"saveStageTaskManagement('{workflow_id}')")
        time.sleep(1)

        # Check alert
        alerts = self.driver.execute_script("return window.alertMessages || []")
        if alerts:
            print(f"  [OK] 알림: {alerts[0]}")
            assert "저장" in alerts[0], f"저장 알림이 아닙니다: {alerts[0]}"

        # Verify data saved
        saved_data = self.driver.execute_script(f"""
            const workflow = mockThesisStages.find(w => w.id === '{workflow_id}');
            return workflow ? workflow.subStageManagement : null;
        """)
        assert saved_data is not None, "데이터가 저장되지 않았습니다"
        print(f"  [OK] 데이터 저장됨")

        print("[PASS] 단계별업무관리 데이터 저장 확인")

    def test_08_date_validation(self):
        """테스트 8: 종료일시가 시작일시보다 이전이면 에러"""
        print("\n[Test 8] 날짜 검증 확인")

        self.driver.execute_script("switchView('typeManagementNew')")
        time.sleep(1)

        # Open headquarters modal
        self.driver.execute_script("openHeadquartersScheduleModal()")
        time.sleep(1)

        # Set invalid date range (end < start)
        start_input = self.driver.find_element(By.CSS_SELECTOR,
            "input[data-stage='논문작성계획서'][data-type='application'][data-field='startDate']")
        end_input = self.driver.find_element(By.CSS_SELECTOR,
            "input[data-stage='논문작성계획서'][data-type='application'][data-field='endDate']")

        self.driver.execute_script("arguments[0].value = '2025-03-31T23:59';", start_input)
        self.driver.execute_script("arguments[0].value = '2025-03-01T09:00';", end_input)
        print("  [OK] 잘못된 날짜 범위 입력 (종료 < 시작)")

        # Capture alerts
        self.driver.execute_script("""
            window.alertMessages = [];
            window.alert = function(msg) {
                window.alertMessages.push(msg);
            };
        """)

        # Try save
        self.driver.execute_script("saveHeadquartersSchedule()")
        time.sleep(0.5)

        # Check validation alert
        alerts = self.driver.execute_script("return window.alertMessages || []")
        assert len(alerts) > 0, "검증 알림이 표시되지 않았습니다"
        assert "이후" in alerts[0] or "종료" in alerts[0], f"날짜 검증 메시지가 아닙니다: {alerts[0]}"
        print(f"  [OK] 검증 알림: {alerts[0][:50]}...")

        # Close modal for cleanup
        self.driver.execute_script("closeHeadquartersScheduleModal()")

        print("[PASS] 날짜 검증 확인")
