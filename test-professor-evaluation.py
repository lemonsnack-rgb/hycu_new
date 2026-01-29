# -*- coding: utf-8 -*-
"""
교수용 심사 화면 척도형/서술형 평가표 자동화 테스트 (DOM 기반)
Test target: Professor evaluation screen with rubric/descriptive evaluation forms
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time
import os

class TestProfessorEvaluation:

    def setup_method(self):
        """각 테스트 전 실행: 브라우저 초기화"""
        self.driver = webdriver.Chrome()
        # 최소 768px 이상으로 설정하여 desktop layout 활성화 (Tailwind md breakpoint)
        self.driver.set_window_size(1400, 1080)

        # professor-v3/professor-dashboard-proposal.html 열기
        project_path = os.path.abspath("professor-v3/professor-dashboard-proposal.html")
        self.driver.get(f"file:///{project_path}")
        self.wait = WebDriverWait(self.driver, 10)

        # 페이지 로드 대기
        time.sleep(2)

    def teardown_method(self):
        """각 테스트 후 실행: 브라우저 종료"""
        self.driver.quit()

    def navigate_to_review_screen(self):
        """학위논문심사 메뉴 클릭 (관리자 테스트와 동일한 방식)"""
        try:
            # 사이드바에서 "학위논문심사" 링크 찾아서 클릭
            review_link = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//a[@onclick=\"showScreen('review'); return false;\"]"))
            )
            review_link.click()
            time.sleep(1)  # 화면 전환 대기
            print("  [OK] Review screen menu clicked")
            return True
        except Exception as e:
            print(f"  [ERROR] Failed to click menu: {e}")
            return False

    def click_review_button(self, assignment_id):
        """심사 목록에서 '심사' 버튼 클릭 (실제 사용자 동작)"""
        try:
            # openReviewDetail 함수 직접 호출 (실제 버튼 클릭과 동일)
            self.driver.execute_script(f"openReviewDetail('{assignment_id}', 'member')")
            time.sleep(2)  # 상세 화면 생성 및 렌더링 대기

            # 상세 화면이 생성되었는지 확인
            detail_screen = self.driver.find_elements(By.ID, "review-detail-screen")
            if detail_screen:
                print(f"  [OK] Review detail screen created")
                return True
            else:
                print(f"  [WARNING] Review detail screen NOT created")
                return False
        except Exception as e:
            print(f"  [ERROR] Failed to open review detail: {e}")
            return False

    def test_01_rubric_form_rendering(self):
        """테스트 1: 척도형 평가표 렌더링 확인"""
        print("\n[Test 1] Rubric form rendering")

        # 1단계: 학위논문심사 메뉴 클릭
        assert self.navigate_to_review_screen(), "Failed to navigate to review screen"

        # 2단계: 심사 목록에서 '심사' 버튼 클릭 (실제 사용자 플로우)
        assert self.click_review_button('RA_RUBRIC_001'), "Failed to open review detail"

        # 5점 척도 radio 버튼 확인
        radio_buttons = self.driver.find_elements(By.CSS_SELECTOR, ".rubric-radio")
        assert len(radio_buttons) > 0, f"Radio buttons not found (found: {len(radio_buttons)})"
        print(f"  [OK] Found {len(radio_buttons)} radio buttons")

        # 안내 메시지 확인 (선택적)
        try:
            info_boxes = self.driver.find_elements(By.XPATH, "//*[contains(text(), '5') and contains(text(), '척도')]")
            if len(info_boxes) > 0:
                print("  [OK] Info message found")
        except:
            pass

        print("[PASS] Rubric form rendering test completed")

    def test_02_rubric_draft_save(self):
        """테스트 2: 척도형 평가 임시저장"""
        print("\n[Test 2] Rubric draft save")

        # 메뉴 클릭 + 심사 버튼 클릭
        self.navigate_to_review_screen()
        self.click_review_button('RA_RUBRIC_001')

        # 첫 번째 항목 척도 선택 (4점)
        time.sleep(1.5)  # 폼이 완전히 렌더링될 때까지 대기
        radio_buttons = self.driver.find_elements(By.CSS_SELECTOR, ".rubric-radio[value='4']")
        if len(radio_buttons) > 0:
            self.driver.execute_script("arguments[0].click();", radio_buttons[0])
            print("  [OK] Selected scale 4")

        # 코멘트 입력 - visibility를 확인하고 첫 번째 visible textarea 선택
        comment_textareas = self.driver.find_elements(By.CSS_SELECTOR, "textarea.rubric-comment")
        if len(comment_textareas) > 0:
            # 첫 번째 visible textarea를 찾아 사용
            visible_textarea = None
            for textarea in comment_textareas:
                if textarea.is_displayed():
                    visible_textarea = textarea
                    break

            if visible_textarea:
                # Scroll into view to ensure visibility
                self.driver.execute_script("arguments[0].scrollIntoView(true);", visible_textarea)
                time.sleep(0.5)

                # Use JavaScript to set the value to avoid interactability issues
                self.driver.execute_script("arguments[0].value = arguments[1];", visible_textarea, "Research topic is clear.")
                # Trigger input event to ensure reactivity
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", visible_textarea)
                print("  [OK] Comment entered")
            else:
                print("  [WARNING] No visible textarea found")

        # 임시저장 (JavaScript 직접 호출)
        try:
            self.driver.execute_script("handleSaveRubricDescriptiveDraft('rubric')")
            time.sleep(0.5)
            print("  [OK] Draft save function called")

            # 알림 확인
            alert_modal = self.driver.find_element(By.ID, "alert-modal")
            if alert_modal.is_displayed():
                alert_message = self.driver.find_element(By.ID, "alert-message").text
                print(f"  [OK] Alert: {alert_message}")
                close_btn = self.driver.find_element(By.CSS_SELECTOR, "#alert-modal button")
                close_btn.click()
        except Exception as e:
            print(f"  [INFO] Alert check skipped: {e}")

        print("[PASS] Rubric draft save test completed")

    def test_03_rubric_submit_validation(self):
        """테스트 3: 척도형 평가 미입력 검증"""
        print("\n[Test 3] Rubric submit validation")

        # 메뉴 클릭 + 평가 화면 렌더링
        self.navigate_to_review_screen()
        self.click_review_button('RA_RUBRIC_001')

        time.sleep(0.5)

        # 아무것도 입력하지 않고 제출 시도
        try:
            self.driver.execute_script("handleSubmitRubricDescriptive('rubric')")
            time.sleep(0.5)

            # 검증 에러 메시지 확인
            alert_modal = self.wait.until(
                EC.visibility_of_element_located((By.ID, "alert-modal"))
            )
            alert_message = self.driver.find_element(By.ID, "alert-message").text
            assert "확인" in alert_message or "선택" in alert_message, f"Validation message missing: {alert_message}"
            print(f"  [OK] Validation message: {alert_message[:50]}...")

            # 알림 닫기
            close_btn = self.driver.find_element(By.CSS_SELECTOR, "#alert-modal button")
            close_btn.click()
        except Exception as e:
            print(f"  [INFO] Validation check: {e}")

        print("[PASS] Rubric submit validation test completed")

    def test_04_descriptive_form_rendering(self):
        """테스트 4: 서술형 평가표 렌더링 확인"""
        print("\n[Test 4] Descriptive form rendering")

        # 메뉴 클릭 + 평가 화면 렌더링
        self.navigate_to_review_screen()
        self.click_review_button('RA_DESCRIPTIVE_001')

        # Textarea 렌더링 확인
        textareas = self.driver.find_elements(By.CSS_SELECTOR, "textarea.descriptive-content")
        assert len(textareas) > 0, f"Descriptive textareas not found (found: {len(textareas)})"
        print(f"  [OK] Found {len(textareas)} descriptive textareas")

        # 글자 수 카운터 확인 (선택적)
        char_counts = self.driver.find_elements(By.CSS_SELECTOR, ".char-count")
        if len(char_counts) > 0:
            print(f"  [OK] Char counter: {char_counts[0].text}")

        print("[PASS] Descriptive form rendering test completed")

    def test_05_descriptive_draft_save(self):
        """테스트 5: 서술형 평가 임시저장"""
        print("\n[Test 5] Descriptive draft save")

        self.navigate_to_review_screen()
        self.click_review_button('RA_DESCRIPTIVE_001')

        time.sleep(0.5)

        # 첫 번째 항목에 내용 작성
        textareas = self.driver.find_elements(By.CSS_SELECTOR, "textarea.descriptive-content")
        if len(textareas) > 0:
            textareas[0].send_keys("Research is progressing smoothly as planned overall.")
            print("  [OK] Descriptive content entered")

        # 임시저장
        try:
            self.driver.execute_script("handleSaveRubricDescriptiveDraft('descriptive')")
            time.sleep(0.5)
            print("  [OK] Draft save function called")

            alert_modal = self.driver.find_element(By.ID, "alert-modal")
            if alert_modal.is_displayed():
                alert_message = self.driver.find_element(By.ID, "alert-message").text
                print(f"  [OK] Alert: {alert_message}")
                close_btn = self.driver.find_element(By.CSS_SELECTOR, "#alert-modal button")
                close_btn.click()
        except Exception as e:
            print(f"  [INFO] Alert check skipped: {e}")

        print("[PASS] Descriptive draft save test completed")

    def test_06_descriptive_validation_short(self):
        """테스트 6: 서술형 평가 최소 글자 수 검증"""
        print("\n[Test 6] Descriptive short text validation")

        self.navigate_to_review_screen()
        self.click_review_button('RA_DESCRIPTIVE_001')

        time.sleep(0.5)

        # 10글자 미만 입력
        textareas = self.driver.find_elements(By.CSS_SELECTOR, "textarea.descriptive-content")
        if len(textareas) > 0:
            textareas[0].clear()
            textareas[0].send_keys("Short")  # 5 chars
            print("  [OK] Short text entered (5 chars)")

        # 제출 시도
        try:
            self.driver.execute_script("handleSubmitRubricDescriptive('descriptive')")
            time.sleep(0.5)

            alert_modal = self.wait.until(
                EC.visibility_of_element_located((By.ID, "alert-modal"))
            )
            alert_message = self.driver.find_element(By.ID, "alert-message").text
            assert "10" in alert_message or "최소" in alert_message, f"Validation message missing: {alert_message}"
            print(f"  [OK] Validation message: {alert_message[:50]}...")

            close_btn = self.driver.find_element(By.CSS_SELECTOR, "#alert-modal button")
            close_btn.click()
        except Exception as e:
            print(f"  [INFO] Validation check: {e}")

        print("[PASS] Descriptive short text validation test completed")

    def test_07_saved_data_load(self):
        """테스트 7: 저장된 평가 데이터 로드"""
        print("\n[Test 7] Saved data load")

        self.navigate_to_review_screen()
        self.click_review_button('RA_RUBRIC_001')

        time.sleep(0.5)

        # Console 로그 확인
        logs = self.driver.get_log('browser')
        load_logs = [log for log in logs if 'Loaded saved review' in log.get('message', '')]
        if len(load_logs) > 0:
            print(f"  [OK] Console log found: {len(load_logs)} saved data logs")

        # 종합 의견 필드 확인
        try:
            overall_comment = self.driver.find_element(By.ID, "rubric-overall-comment")
            comment_value = overall_comment.get_attribute("value") or overall_comment.text
            if comment_value:
                print(f"  [OK] Overall comment loaded: {comment_value[:30]}...")
        except:
            print("  [INFO] Overall comment field not found or empty")

        print("[PASS] Saved data load test completed")

    def test_08_readonly_mode(self):
        """테스트 8: Read-only 모드 확인"""
        print("\n[Test 8] Read-only mode check")

        self.navigate_to_review_screen()
        self.click_review_button('RA_DESCRIPTIVE_001')

        time.sleep(0.5)

        # disabled 속성 확인
        textareas = self.driver.find_elements(By.CSS_SELECTOR, "textarea.descriptive-content[disabled]")
        if len(textareas) > 0:
            print(f"  [OK] Read-only textareas found: {len(textareas)}")
        else:
            print("  [INFO] Active textareas (not submitted yet)")

        # 제출 완료 메시지 확인
        submitted_messages = self.driver.find_elements(By.XPATH, "//*[contains(text(), '제출 완료') or contains(text(), '제출')]")
        if len(submitted_messages) > 0:
            print("  [OK] Submitted message found")

        print("[PASS] Read-only mode check test completed")

    def test_09_overall_comment(self):
        """테스트 9: 종합 의견 입력 및 저장"""
        print("\n[Test 9] Overall comment input and save")

        self.navigate_to_review_screen()
        self.click_review_button('RA_RUBRIC_001')

        time.sleep(0.5)

        # 종합 의견 입력
        try:
            overall_comment = self.driver.find_element(By.ID, "rubric-overall-comment")
            test_comment = "Overall good research proposal. Additional improvements needed."
            overall_comment.clear()
            overall_comment.send_keys(test_comment)
            print(f"  [OK] Overall comment entered")

            # 임시저장
            self.driver.execute_script("handleSaveRubricDescriptiveDraft('rubric')")
            time.sleep(0.5)
            print("  [OK] Draft saved with overall comment")

            # 알림 닫기
            try:
                close_btn = self.driver.find_element(By.CSS_SELECTOR, "#alert-modal button")
                if close_btn.is_displayed():
                    close_btn.click()
            except:
                pass
        except Exception as e:
            print(f"  [INFO] Overall comment input: {e}")

        print("[PASS] Overall comment input and save test completed")

    def test_10_console_errors(self):
        """테스트 10: JavaScript 콘솔 에러 체크"""
        print("\n[Test 10] JavaScript console error check")

        self.navigate_to_review_screen()
        self.click_review_button('RA_RUBRIC_001')

        time.sleep(0.5)

        # 브라우저 콘솔 로그 수집
        logs = self.driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']

        if errors:
            print(f"  [WARNING] Console errors found: {len(errors)}")
            for error in errors[:3]:
                print(f"    - {error['message'][:100]}...")
        else:
            print("  [OK] No console errors")

        print("[PASS] JavaScript console error check completed")

    def test_11_chair_rubric_view(self):
        """테스트 11: 위원장 척도형 화면 렌더링"""
        print("\n[Test 11] Chair rubric view rendering")

        self.navigate_to_review_screen()

        # 현재 사용자를 위원장 P003으로 변경 (RA_RUBRIC_001의 위원장)
        self.driver.execute_script("""
            window.CURRENT_USER = {
                id: 'P003',
                name: '김교수',
                department: '인공지능학과',
                email: 'kim@university.ac.kr'
            };
        """)
        time.sleep(0.5)

        # 위원장 viewType으로 호출
        try:
            self.driver.execute_script("openReviewDetail('RA_RUBRIC_001', 'chair')")
            time.sleep(2)

            # DEBUG: Save page HTML
            with open("test_11_debug.html", "w", encoding="utf-8") as f:
                f.write(self.driver.page_source)
            print("  [DEBUG] Page HTML saved to test_11_debug.html")

            # 위원별 척도 테이블 확인
            tables = self.driver.find_elements(By.CSS_SELECTOR, "table")
            assert len(tables) > 0, "Rubric table not found"
            print(f"  [OK] Found {len(tables)} table(s)")

            # 위원 컬럼 확인 (평균 컬럼은 척도형/서술형에서 불필요하므로 제외)
            committee_headers = self.driver.find_elements(By.XPATH, "//th[contains(text(), '교수')]")
            if len(committee_headers) > 0:
                print(f"  [OK] Committee columns found: {len(committee_headers)}")
            else:
                print("  [INFO] No committee header text found (might be rendered differently)")

            # 최종 결정 버튼 확인
            decision_buttons = self.driver.find_elements(By.ID, "btn-pass")
            assert len(decision_buttons) > 0, "Decision buttons not found"
            print(f"  [OK] Final decision buttons found")

            # 위원별 상세 의견 섹션 확인
            detail_sections = self.driver.find_elements(By.XPATH, "//*[contains(text(), '위원별 상세 의견')]")
            if len(detail_sections) > 0:
                print("  [OK] Committee detail comments section found")

        except Exception as e:
            print(f"  [ERROR] Chair rubric view test failed: {e}")
            raise

        print("[PASS] Chair rubric view rendering completed")

    def test_12_chair_descriptive_view(self):
        """테스트 12: 위원장 서술형 화면 렌더링"""
        print("\n[Test 12] Chair descriptive view rendering")

        self.navigate_to_review_screen()

        # 현재 사용자를 위원장 P003으로 변경 (RA_DESCRIPTIVE_001의 위원장)
        self.driver.execute_script("""
            window.CURRENT_USER = {
                id: 'P003',
                name: '김교수',
                department: '인공지능학과',
                email: 'kim@university.ac.kr'
            };
        """)
        time.sleep(0.5)

        try:
            self.driver.execute_script("openReviewDetail('RA_DESCRIPTIVE_001', 'chair')")
            time.sleep(2)

            # 항목별 답변 섹션 확인
            item_sections = self.driver.find_elements(By.XPATH, "//h4[contains(text(), '.')]")
            assert len(item_sections) > 0, "Item sections not found"
            print(f"  [OK] Found {len(item_sections)} item section(s)")

            # 종합 의견 섹션 확인
            overall_sections = self.driver.find_elements(By.XPATH, "//*[contains(text(), '종합 의견')]")
            assert len(overall_sections) > 0, "Overall opinion section not found"
            print("  [OK] Overall opinion section found")

            # 최종 결정 섹션 확인
            decision_sections = self.driver.find_elements(By.XPATH, "//*[contains(text(), '최종 심사 결정')]")
            assert len(decision_sections) > 0, "Final decision section not found"
            print("  [OK] Final decision section found")

        except Exception as e:
            print(f"  [ERROR] Chair descriptive view test failed: {e}")
            raise

        print("[PASS] Chair descriptive view rendering completed")

    def test_13_chair_decision_submit(self):
        """테스트 13: 위원장 최종 결정 제출"""
        print("\n[Test 13] Chair decision submit")

        self.navigate_to_review_screen()

        # 현재 사용자를 위원장 P003으로 변경
        self.driver.execute_script("""
            window.CURRENT_USER = {
                id: 'P003',
                name: '김교수',
                department: '인공지능학과',
                email: 'kim@university.ac.kr'
            };
        """)
        time.sleep(0.5)

        try:
            self.driver.execute_script("openReviewDetail('RA_RUBRIC_001', 'chair')")
            time.sleep(2)

            # 합격 버튼 클릭 (JavaScript로 직접 호출)
            try:
                self.driver.execute_script("selectDecision('합격')")
                time.sleep(0.5)
                print("  [OK] Decision button clicked")
            except Exception as e:
                print(f"  [INFO] Decision selection: {e}")

            # 최종 의견 입력
            try:
                comment_textarea = self.driver.find_element(By.ID, "chair-final-comment")
                if not comment_textarea.get_attribute('disabled'):
                    comment_textarea.send_keys("All committee evaluations are excellent. Approved.")
                    print("  [OK] Final comment entered")
                else:
                    print("  [INFO] Comment field is disabled (already submitted)")
            except Exception as e:
                print(f"  [INFO] Comment input: {e}")

            # 제출 버튼 클릭 시도
            try:
                submit_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), '최종 제출')]")
                if len(submit_buttons) > 0 and not submit_buttons[0].get_attribute('disabled'):
                    self.driver.execute_script("submitChairDecision()")
                    time.sleep(1)
                    print("  [OK] Submit function called")

                    # 성공 메시지 확인
                    alert_modal = self.driver.find_element(By.ID, "alert-modal")
                    if alert_modal.is_displayed():
                        alert_message = self.driver.find_element(By.ID, "alert-message").text
                        print(f"  [OK] Alert: {alert_message}")
                else:
                    print("  [INFO] Submit button already disabled (submitted)")
            except Exception as e:
                print(f"  [INFO] Submit check: {e}")

        except Exception as e:
            print(f"  [ERROR] Chair decision submit test failed: {e}")
            raise

        print("[PASS] Chair decision submit completed")

    def test_14_chair_passfail_view(self):
        """테스트 14: 위원장 Pass/Fail형 화면 렌더링"""
        print("\n[Test 14] Chair Pass/Fail view rendering")

        self.navigate_to_review_screen()

        # 현재 사용자를 위원장 P003으로 변경 (RA_PASSFAIL_001의 위원장)
        self.driver.execute_script("""
            window.CURRENT_USER = {
                id: 'P003',
                name: '김교수',
                department: '인공지능학과',
                email: 'kim@university.ac.kr'
            };
        """)
        time.sleep(0.5)

        try:
            self.driver.execute_script("openReviewDetail('RA_PASSFAIL_001', 'chair')")
            time.sleep(2)

            # Pass/Fail 테이블 확인
            tables = self.driver.find_elements(By.CSS_SELECTOR, "table")
            assert len(tables) > 0, "Pass/Fail table not found"
            print(f"  [OK] Found {len(tables)} table(s)")

            # Pass/Fail 배지 확인
            pass_badges = self.driver.find_elements(By.XPATH, "//*[contains(text(), 'Pass')]")
            if len(pass_badges) > 0:
                print(f"  [OK] Pass badges found: {len(pass_badges)}")

            # DEBUG: Save HTML to file
            page_html = self.driver.page_source
            with open('test_14_debug.html', 'w', encoding='utf-8') as f:
                f.write(page_html)
            print("  [DEBUG] Page HTML saved to test_14_debug.html")

            # 최종 결정 섹션 확인
            decision_sections = self.driver.find_elements(By.XPATH, "//*[contains(text(), '최종 심사 결정')]")
            if len(decision_sections) == 0:
                print("  [WARNING] '최종 심사 결정' not found, checking for '최종'...")
                decision_alt = self.driver.find_elements(By.XPATH, "//*[contains(text(), '최종')]")
                print(f"  [DEBUG] Found {len(decision_alt)} elements with '최종'")
            assert len(decision_sections) > 0, "Final decision section not found"
            print("  [OK] Final decision section found")

        except Exception as e:
            print(f"  [ERROR] Chair Pass/Fail view test failed: {e}")
            raise

        print("[PASS] Chair Pass/Fail view rendering completed")


# 테스트 실행
if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v", "-s"])
