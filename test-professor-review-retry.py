"""
교수 화면 - 재심사 목업 테스트 (2026-10-06)
기준: docs/재심사_제출취소_영향도분석_20261006.md 0장 (PR-1 ~ PR-5)

실행: python -m pytest test-professor-review-retry.py -v -s
"""
import os
import time

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

ROOT = os.path.dirname(os.path.abspath(__file__))
URL = "file:///" + os.path.join(ROOT, "professor-v3", "professor-dashboard-proposal.html").replace(os.sep, "/")


@pytest.fixture
def driver():
    opts = Options()
    opts.add_argument("--start-maximized")
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    d = webdriver.Chrome(options=opts)  # Headless=False (CLAUDE.md 규칙)
    d.get(URL)
    WebDriverWait(d, 10).until(lambda x: x.execute_script("return !!window.ReviewAttempt"))
    yield d
    d.quit()


def accept_dialog(d, timeout=5):
    WebDriverWait(d, timeout).until(EC.alert_is_present())
    alert = d.switch_to.alert
    text = alert.text
    alert.accept()
    time.sleep(0.2)
    return text


def open_review_list(d):
    d.execute_script("showScreen('review')")
    time.sleep(0.6)


def open_chair(d, assignment_id):
    d.execute_script(f"openReviewDetail('{assignment_id}', 'chair')")
    time.sleep(0.8)


def test_01_list_shows_attempts_and_results(driver):
    """PR-1/2: 같은 학생의 1차(불합격) · 2차(진행) 행, 차수 컬럼"""
    open_review_list(driver)
    table = driver.find_element(By.ID, "review-list")
    headers = [th.text for th in table.find_elements(By.CSS_SELECTOR, "thead th")]
    assert "차수" in headers

    rows = [r.text for r in table.find_elements(By.CSS_SELECTOR, "tbody tr") if "홍길동" in r.text]
    assert len(rows) == 2, rows
    assert any("1차" in r and "불합격" in r for r in rows)
    assert any("2차" in r and "불합격" not in r for r in rows)


def test_02_previous_attempt_history(driver):
    """PR-5: 2차 상세에 이전 차수 이력(1차 불합격 · 위원장 총평)"""
    open_review_list(driver)
    open_chair(driver, "RA_RETRY_002")
    # 페이지에 같은 id가 두 개 있어 상세 화면(review-detail-screen) 안으로 한정
    text = driver.find_element(By.CSS_SELECTOR, "#review-detail-screen #review-detail-content").text
    assert "이전 차수 이력" in text and "1차" in text and "불합격" in text and "위원장 총평" in text


def test_03_fail_decision_notice_and_confirm(driver):
    """PR-3: 불합격 선택 시 안내 표시 → 확인 후 결과 불합격"""
    open_review_list(driver)
    open_chair(driver, "RA_TEST_CHAIR")
    driver.execute_script("selectDecision('불합격')")
    notice = driver.find_element(By.ID, "fail-notice-section")
    assert notice.is_displayed() and "다음 학기에 심사 신청부터" in notice.text

    driver.find_element(By.ID, "chair-final-comment").send_keys("연구 방법론 전면 보완 필요")
    driver.execute_script("submitChairDecision()")
    confirm_text = accept_dialog(driver)
    assert "2차" in confirm_text and "1차 이력으로 보존" in confirm_text
    time.sleep(0.5)
    decision = driver.execute_script(
        "return REVIEW_RESULTS.find(r => r.assignmentId === 'RA_TEST_CHAIR').finalDecision")
    status = driver.execute_script(
        "return REVIEW_ASSIGNMENTS.find(a => a.id === 'RA_TEST_CHAIR').status")
    assert decision == "불합격" and status == "불합격"


def test_04_conditional_submit_with_template(driver):
    """PR-4: 조건부합격 - 평가표 목록 표시 및 제출, 재심1 회차"""
    open_review_list(driver)
    open_chair(driver, "RA_TEST_CHAIR")
    driver.execute_script("selectDecision('조건부합격')")
    template_select = Select(driver.find_element(By.ID, "resubmission-template-id"))
    assert len(template_select.options) > 1, "평가표 목록이 비어 있음"
    template_select.select_by_index(1)
    driver.find_element(By.CSS_SELECTOR, "input[name='resubmission-reviewer-type'][value='committee']").click()
    driver.find_element(By.ID, "chair-final-comment").send_keys("5장 분석 보완 후 재심")
    driver.execute_script("submitChairDecision()")
    time.sleep(0.5)
    retry_no = driver.execute_script(
        "return REVIEW_RESULTS.find(r => r.assignmentId === 'RA_TEST_CHAIR').resubmission.retryNo")
    assert retry_no == 1


def test_05_no_console_errors(driver):
    open_review_list(driver)
    open_chair(driver, "RA_RETRY_002")
    logs = driver.get_log("browser")
    targets = ("review-data.js", "review-list.js", "review-detail.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors
