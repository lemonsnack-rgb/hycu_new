"""
교수 화면 - 재심사 목업 테스트 (2026-10-06 작성, 10-07 번호 체계 변경 반영)
기준: docs/재심사_제출취소_영향도분석_20261006.md 0장 · 0-5
- 조건부합격 제출 시 다음 번호의 새 심사 행 생성, '재심' 표기 없음

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


def review_rows(d, name):
    table = d.find_element(By.ID, "review-list")
    return [r.text for r in table.find_elements(By.CSS_SELECTOR, "tbody tr") if name in r.text]


def test_01_list_shows_attempts_and_results(driver):
    """같은 학생의 1차(불합격) · 2차(진행) 행, 차수 컬럼"""
    open_review_list(driver)
    headers = [th.text for th in driver.find_elements(By.CSS_SELECTOR, "#review-list thead th")]
    assert "차수" in headers
    rows = review_rows(driver, "홍길동")
    assert len(rows) == 2, rows
    assert any("1차" in r and "불합격" in r for r in rows)
    assert any("2차" in r and "불합격" not in r for r in rows)


def test_02_previous_attempt_history(driver):
    """2차 상세에 이전 차수 이력(1차 불합격 · 위원장 총평), '재심' 표기 없음"""
    open_review_list(driver)
    open_chair(driver, "RA_RETRY_002")
    # 페이지에 같은 id가 두 개 있어 상세 화면(review-detail-screen) 안으로 한정
    text = driver.find_element(By.CSS_SELECTOR, "#review-detail-screen #review-detail-content").text
    assert "이전 차수 이력" in text and "현재 2차 심사" in text and "위원장 총평" in text


def test_03_fail_decision_notice_and_confirm(driver):
    """불합격 선택 시 안내 표시 → 확인 후 결과 불합격"""
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
    assert decision == "불합격"
    # 불합격은 새 행을 만들지 않음 (학생 재신청 후 배정)
    assert not driver.execute_script("return REVIEW_ASSIGNMENTS.some(a => a.previousAssignmentId === 'RA_TEST_CHAIR')")


def test_04_conditional_creates_new_review_row(driver):
    """조건부합격: 평가표 선택 가능 → 제출 시 다음 번호의 새 심사 행 생성"""
    open_review_list(driver)
    open_chair(driver, "RA_TEST_CHAIR")
    driver.execute_script("selectDecision('조건부합격')")
    template_select = Select(driver.find_element(By.ID, "resubmission-template-id"))
    assert len(template_select.options) > 1, "평가표 목록이 비어 있음"
    template_select.select_by_index(1)
    driver.find_element(By.CSS_SELECTOR, "input[name='resubmission-reviewer-type'][value='committee']").click()
    driver.find_element(By.ID, "chair-final-comment").send_keys("5장 분석 보완 후 다시 제출")
    driver.execute_script("submitChairDecision()")
    time.sleep(1.5)

    new_row = driver.execute_script(
        "const a = REVIEW_ASSIGNMENTS.find(x => x.previousAssignmentId === 'RA_TEST_CHAIR');"
        "return a ? {id: a.id, no: a.attemptNo, status: a.status, n: a.committee.length} : null")
    assert new_row and new_row["no"] == 2 and new_row["status"] == "대기" and new_row["n"] == 3, new_row

    driver.execute_script("closeReviewDetailScreen && closeReviewDetailScreen()")
    open_review_list(driver)
    rows = review_rows(driver, "재심테스트")
    assert len(rows) == 2, rows
    assert any("1차" in r and "조건부합격" in r for r in rows)
    assert any("2차" in r for r in rows)
    assert all("재심1" not in r and "재심 " not in r for r in rows)


def test_05_exam_schedule_columns_aligned(driver):
    """심사일정: 차수 컬럼, 헤더·셀 개수 일치, 학위과정 정상, 홍길동 1차·2차"""
    driver.execute_script("showScreen('exam-schedule')")
    time.sleep(0.8)
    # 학년도·학기 기본값이 2025·1학기라 2026학년도 시연 데이터를 보려면 '전체' 선택
    driver.execute_script("document.getElementById('exam-filter-year').value=''; document.getElementById('exam-filter-semester').value=''; filterExamScheduleList();")
    time.sleep(0.4)
    content = driver.find_element(By.ID, "exam-schedule-content")
    headers = [th.text for th in content.find_elements(By.CSS_SELECTOR, "thead th")]
    assert "차수" in headers and "세부단계" in headers
    rows = content.find_elements(By.CSS_SELECTOR, "tbody tr")
    texts = []
    for row in rows:
        cells = row.find_elements(By.TAG_NAME, "td")
        assert len(cells) == len(headers), (len(cells), len(headers))
        texts.append(row.text)
    hong = [t for t in texts if "홍길동" in t]
    assert any("1차" in t for t in hong) and any("2차" in t for t in hong), hong
    assert all("석박통합" not in t for t in hong)


def test_06_dashboard_rereview_count(driver):
    driver.execute_script("showScreen('dashboard')")
    time.sleep(0.5)
    assert "재심사 1명" in driver.find_element(By.ID, "student-summary-cards").text


def test_07_no_console_errors(driver):
    open_review_list(driver)
    open_chair(driver, "RA_RETRY_002")
    logs = driver.get_log("browser")
    targets = ("review-data.js", "review-list.js", "review-detail.js",
               "exam-schedule-professor-readonly.js", "professor-dashboard.js", "exam-schedule-data.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors
