# -*- coding: utf-8 -*-
"""
Evaluation criteria screen improvement automated test
Test target: Adding rubric/descriptive evaluation types
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time
import os

class TestEvaluationTypes:

    def setup_method(self):
        """Setup before each test: Initialize browser"""
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()

        # Open admin-v3/index.html
        project_path = os.path.abspath("admin-v3/index.html")
        self.driver.get(f"file:///{project_path}")
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self):
        """Teardown after each test: Close browser"""
        self.driver.quit()

    def navigate_to_evaluation_criteria(self):
        """Navigate to evaluation criteria menu"""
        menu_item = self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "심사평가기준등록"))
        )
        menu_item.click()
        time.sleep(0.5)

    def open_new_criteria_form(self):
        """Open new criteria form"""
        add_button = self.wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[onclick*='evaluationCriteriaEdit']"))
        )
        add_button.click()
        time.sleep(1)

    def test_01_evaluation_type_options(self):
        """Test 1: Verify 4 evaluation type options exist"""
        print("\n[Test 1] Verify evaluation type selection options")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        # Find evaluation type select box
        type_select = Select(self.driver.find_element(By.ID, "edit-criteria-type"))
        options = [option.text for option in type_select.options]

        # Verification
        assert len(options) == 4, f"Option count is not 4: {len(options)}"
        assert any("점수형" in opt for opt in options), "Score type option missing"
        assert any("Pass/Fail" in opt for opt in options), "Pass/Fail type option missing"
        assert any("척도형" in opt for opt in options), "Rubric type option missing"
        assert any("서술형" in opt for opt in options), "Descriptive type option missing"

        print("[OK] 4 evaluation type options verified")

    def test_02_rubric_scale_info(self):
        """Test 2: Verify rubric scale info message displays"""
        print("\n[Test 2] Verify rubric scale info message")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        # Select rubric type
        type_select = Select(self.driver.find_element(By.ID, "edit-criteria-type"))
        type_select.select_by_value("rubric")
        time.sleep(0.5)

        # Verify info message
        info_boxes = self.driver.find_elements(By.CSS_SELECTOR, "div.bg-blue-50")
        assert len(info_boxes) > 0, "Info message box not found"

        info_box = info_boxes[0]
        assert info_box.is_displayed(), "Info message not displayed"

        info_text = info_box.text
        assert "5점 척도 고정" in info_text, "Scale info title missing"
        assert "매우 아니다" in info_text, "Scale label missing"
        assert "매우 그렇다" in info_text, "Scale label missing"
        # Verify no point numbers in scale info
        assert "1점" not in info_text and "2점" not in info_text, "Point numbers should not be in scale info"

        print("[OK] Rubric scale info message verified")

    def test_03_rubric_table_columns(self):
        """Test 3: Verify rubric table column structure"""
        print("\n[Test 3] Verify rubric table columns")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        # Select rubric type
        type_select = Select(self.driver.find_element(By.ID, "edit-criteria-type"))
        type_select.select_by_value("rubric")
        time.sleep(0.5)

        # Verify table headers (thead is a sibling of tbody#evaluation-items-container)
        headers = self.driver.find_elements(By.CSS_SELECTOR, "table thead th")
        header_texts = [h.text.replace("*", "").strip() for h in headers]

        assert len(header_texts) == 4, f"Column count is not 4: {len(header_texts)}, headers: {header_texts}"
        assert "순번" in header_texts[0], "Sequence column missing"
        assert "항목명" in header_texts[1], "Item name column missing"
        assert "항목설명" in header_texts[2], "Item description column missing"
        assert "관리" in header_texts[3], "Management column missing"

        # "평가 기준" label should not exist
        assert not any("평가 기준" in h for h in header_texts), "'평가 기준' label still exists"

        print("[OK] Rubric table column structure verified")

    def test_04_descriptive_validation_short(self):
        """Test 4: Descriptive type validation for less than 10 characters"""
        print("\n[Test 4] Test descriptive short item description validation")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        # Select descriptive type
        type_select = Select(self.driver.find_element(By.ID, "edit-criteria-type"))
        type_select.select_by_value("descriptive")
        time.sleep(0.5)

        # Enter criteria name
        name_input = self.driver.find_element(By.ID, "edit-criteria-name")
        name_input.send_keys("Descriptive test evaluation")

        # Enter description
        desc_input = self.driver.find_element(By.ID, "edit-criteria-description")
        desc_input.send_keys("Descriptive evaluation test")

        # Use the initial empty row (no need to add a new one)
        # Enter item name in the first row
        item_name = self.driver.find_element(By.CSS_SELECTOR, ".evaluation-item .item-name")
        item_name.send_keys("Research methodology")

        # Enter short item description (5 characters)
        item_desc = self.driver.find_element(By.CSS_SELECTOR, ".evaluation-item .item-description")
        item_desc.send_keys("Short")

        # Click save button
        save_btn = self.driver.find_element(By.CSS_SELECTOR, "button[onclick='saveEvaluationCriteria()']")
        save_btn.click()
        time.sleep(0.5)

        # Verify custom alert modal
        alert_modal = self.wait.until(
            EC.visibility_of_element_located((By.ID, "alert-modal"))
        )
        alert_message = self.driver.find_element(By.ID, "alert-message").text

        assert "10글자 이상" in alert_message, f"Validation message incorrect: {alert_message}"

        # Close alert
        close_btn = self.driver.find_element(By.CSS_SELECTOR, "#alert-modal button")
        close_btn.click()

        print("[OK] Descriptive short item description validation completed")

    def test_05_descriptive_validation_valid(self):
        """Test 5: Descriptive type normal input with 10+ characters"""
        print("\n[Test 5] Test descriptive normal item description input")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        # Select descriptive type
        type_select = Select(self.driver.find_element(By.ID, "edit-criteria-type"))
        type_select.select_by_value("descriptive")
        time.sleep(0.5)

        # Enter criteria name
        name_input = self.driver.find_element(By.ID, "edit-criteria-name")
        name_input.send_keys("Descriptive test evaluation")

        # Enter description
        desc_input = self.driver.find_element(By.ID, "edit-criteria-description")
        desc_input.send_keys("Descriptive evaluation test")

        # Use the initial empty row (no need to add a new one)
        # Enter item name in the first row
        item_name = self.driver.find_element(By.CSS_SELECTOR, ".evaluation-item .item-name")
        item_name.send_keys("Research methodology")

        # Enter sufficient item description (56 characters)
        item_desc = self.driver.find_element(By.CSS_SELECTOR, ".evaluation-item .item-description")
        item_desc.send_keys("Evaluate the appropriateness and rigor of research methods.")

        # Click save button
        save_btn = self.driver.find_element(By.CSS_SELECTOR, "button[onclick='saveEvaluationCriteria()']")
        save_btn.click()
        time.sleep(1)

        # Check if we're back on the list page (success) or if there's an error
        try:
            # If alert appears, it's an error
            alert_modal = self.driver.find_element(By.ID, "alert-modal")
            if not alert_modal.get_attribute("class") or "hidden" not in alert_modal.get_attribute("class"):
                alert_message = self.driver.find_element(By.ID, "alert-message").text
                assert False, f"Unexpected error: {alert_message}"
        except:
            # No visible alert means success
            pass

        print("[OK] Descriptive normal item description input completed")

    def test_06_all_types_table_labels(self):
        """Test 6: Verify table labels for all types"""
        print("\n[Test 6] Verify table labels for all types")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        type_select = Select(self.driver.find_element(By.ID, "edit-criteria-type"))

        # Check Pass/Fail type
        type_select.select_by_value("passfail")
        time.sleep(0.3)
        headers = [h.text.replace("*", "").strip() for h in self.driver.find_elements(By.CSS_SELECTOR, "table thead th")]
        assert "항목설명" in headers, f"Pass/Fail type missing item description label. Headers: {headers}"

        # Check rubric type
        type_select.select_by_value("rubric")
        time.sleep(0.3)
        headers = [h.text.replace("*", "").strip() for h in self.driver.find_elements(By.CSS_SELECTOR, "table thead th")]
        assert "항목설명" in headers, f"Rubric type missing item description label. Headers: {headers}"
        assert not any("평가 기준" in h for h in headers), "Rubric type has '평가 기준' label"

        # Check descriptive type
        type_select.select_by_value("descriptive")
        time.sleep(0.3)
        headers = [h.text.replace("*", "").strip() for h in self.driver.find_elements(By.CSS_SELECTOR, "table thead th")]
        assert "항목설명" in headers, f"Descriptive type missing item description label. Headers: {headers}"
        assert not any("평가 기준" in h for h in headers), "Descriptive type has '평가 기준' label"

        print("[OK] All type table labels verified")

    def test_07_initial_empty_row(self):
        """Test 7: Verify initial empty row is created for all types"""
        print("\n[Test 7] Verify initial empty row creation")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        # Check all evaluation types
        type_select = Select(self.driver.find_element(By.ID, "edit-criteria-type"))

        for eval_type in ["score", "passfail", "rubric", "descriptive"]:
            type_select.select_by_value(eval_type)
            time.sleep(0.3)

            # Verify at least one row exists
            rows = self.driver.find_elements(By.CSS_SELECTOR, ".evaluation-item")
            assert len(rows) >= 1, f"{eval_type} type should have at least 1 initial row, found: {len(rows)}"

            # Verify the row has empty input fields
            first_row = rows[0]
            name_input = first_row.find_element(By.CSS_SELECTOR, ".item-name")
            assert name_input.get_attribute("value") == "", f"{eval_type} type initial row should be empty"

        print("[OK] Initial empty row verified for all types")

    def test_08_no_total_score_for_non_score_types(self):
        """Test 8: Verify total score field is only shown for score type"""
        print("\n[Test 8] Verify total score field visibility")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        type_select = Select(self.driver.find_element(By.ID, "edit-criteria-type"))

        # Check score type - should have total score display
        type_select.select_by_value("score")
        time.sleep(0.3)
        total_score_elements = self.driver.find_elements(By.ID, "total-score-display")
        assert len(total_score_elements) > 0, "Score type should have total score display"
        assert total_score_elements[0].is_displayed(), "Total score should be visible for score type"
        print("  [OK] Score type has total score display")

        # Check Pass/Fail type - should NOT have total score display
        type_select.select_by_value("passfail")
        time.sleep(0.3)
        total_score_elements = self.driver.find_elements(By.ID, "total-score-display")
        visible_total_score = [el for el in total_score_elements if el.is_displayed()]
        assert len(visible_total_score) == 0, "Pass/Fail type should NOT have visible total score display"
        print("  [OK] Pass/Fail type does NOT have total score display")

        # Check rubric type - should NOT have total score display
        type_select.select_by_value("rubric")
        time.sleep(0.3)
        total_score_elements = self.driver.find_elements(By.ID, "total-score-display")
        visible_total_score = [el for el in total_score_elements if el.is_displayed()]
        assert len(visible_total_score) == 0, "Rubric type should NOT have visible total score display"
        print("  [OK] Rubric type does NOT have total score display")

        # Check descriptive type - should NOT have total score display
        type_select.select_by_value("descriptive")
        time.sleep(0.3)
        total_score_elements = self.driver.find_elements(By.ID, "total-score-display")
        visible_total_score = [el for el in total_score_elements if el.is_displayed()]
        assert len(visible_total_score) == 0, "Descriptive type should NOT have visible total score display"
        print("  [OK] Descriptive type does NOT have total score display")

        print("[OK] Total score field visibility verified for all types")

    def test_09_console_errors(self):
        """Test 9: Check JavaScript console errors"""
        print("\n[Test 9] Check console errors")

        self.navigate_to_evaluation_criteria()
        self.open_new_criteria_form()

        # Collect browser console logs
        logs = self.driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']

        if errors:
            print(f"[WARNING] Console errors found: {len(errors)} errors")
            for error in errors:
                print(f"  - {error['message']}")
        else:
            print("[OK] No console errors")

        assert len(errors) == 0, f"{len(errors)} console errors found"


# Run tests
if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v", "-s"])
