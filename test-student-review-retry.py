"""
학생 화면 - 재심사 · 제출취소 목업 테스트 (2026-10-06 작성, 10-07 번호 체계 변경 반영)
기준: docs/재심사_제출취소_영향도분석_20261006.md 0장 · 0-5
- 제출 번호 하나로 표기 ('N차 제출'), '재심' 표기 없음
- 심사신청 화면: 번호 없이 [재신청]

실행: python -m pytest test-student-review-retry.py -v -s
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
URL = "file:///" + os.path.join(ROOT, "student-v3", "student-dashboard.html").replace(os.sep, "/")

WITHDRAW_CONFIRM = "해당 단계에서 제출한 자료와 내역은 모두 초기화됩니다(합격여부가 결정된 단계 제외) 그래도 철회하시겠습니까?"
WITHDRAW_BLOCKED = "심사가 진행중이므로 철회할 수 없습니다."


@pytest.fixture(scope="module")
def driver():
    opts = Options()
    opts.add_argument("--start-maximized")
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    d = webdriver.Chrome(options=opts)  # Headless=False (CLAUDE.md 규칙)
    d.get(URL)
    WebDriverWait(d, 10).until(lambda x: x.execute_script("return !!window.ReviewScenario"))
    yield d
    d.quit()


def accept_dialog(d, timeout=5):
    WebDriverWait(d, timeout).until(EC.alert_is_present())
    alert = d.switch_to.alert
    text = alert.text
    alert.accept()
    time.sleep(0.2)
    return text


def open_screen(d, screen):
    d.execute_script(f"showScreen('{screen}')")
    time.sleep(0.4)


def choose_scenario(d, screen, key):
    """시나리오 선택 후 [초기화]로 이전 테스트의 상태 변경을 되돌림 (현재 화면의 선택 바 사용)"""
    open_screen(d, screen)
    bar = f"#{screen}-content"
    Select(d.find_element(By.CSS_SELECTOR, f"{bar} .review-scenario-select")).select_by_value(key)
    time.sleep(0.3)
    d.find_element(By.CSS_SELECTOR, f"{bar} .review-scenario-reset").click()
    time.sleep(0.3)


def stage_row(d, container_id, stage_name):
    for row in d.find_elements(By.CSS_SELECTOR, f"#{container_id} tbody tr"):
        if stage_name in row.text:
            return row
    raise AssertionError(f"{stage_name} 행을 찾을 수 없음")


def test_01_retry_open_reapply(driver):
    """① 불합격 단계: [재신청] → 신청완료, 자료제출에 2차 제출 행
    (자료제출 제출 폼을 먼저 열어 두어도 신청 모달 입력값이 섞이지 않는지 함께 확인)"""
    choose_scenario(driver, "thesis-submission", "conditional")
    stage_row(driver, "thesis-submission-content", "본심사").find_element(By.XPATH, ".//button[normalize-space()='제출']").click()
    time.sleep(0.3)
    choose_scenario(driver, "thesis-application", "retry-open")
    # 경로 표시: '홈 > 대시보드'가 아니라 '논문 심사 > 논문신청'
    breadcrumb = driver.execute_script(
        "const el = document.querySelector('.breadcrumb, #breadcrumb, [class*=breadcrumb]'); return el ? el.innerText : ''")
    assert "논문신청" in breadcrumb, breadcrumb
    content = driver.find_element(By.ID, "thesis-application-content")
    headers = [th.text for th in content.find_elements(By.CSS_SELECTOR, "thead th")]
    assert "차수" not in headers, "심사신청 화면은 번호를 표시하지 않음"
    assert len(content.find_elements(By.CSS_SELECTOR, "tbody tr")) == 3

    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "재심사 대상" in row.text
    row.find_element(By.PARTIAL_LINK_TEXT, "재신청").click()
    time.sleep(0.3)
    modal = driver.find_element(By.ID, "application-modal")
    assert "재신청합니다" in modal.text
    driver.find_element(By.ID, "app-thesis-title").send_keys("AI 기반 추천 시스템 연구(보완)")
    driver.find_element(By.ID, "app-thesis-title-en").send_keys("Improved Recommender")
    modal.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    accept_dialog(driver)
    accept_dialog(driver)
    assert "신청완료" in stage_row(driver, "thesis-application-content", "예비심사").text

    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차 제출" in row.text and "미제출" in row.text
    # 신청 시 입력한 제목이 제출 폼 기본값으로 들어감
    row.find_element(By.XPATH, ".//button[normalize-space()='제출']").click()
    time.sleep(0.3)
    assert driver.find_element(By.CSS_SELECTOR, "#thesis-submission-content #thesis-title").get_attribute("value") == "AI 기반 추천 시스템 연구(보완)"


def test_02_submission_history(driver):
    """단계명 클릭 → 제출 기록 (1차 제출 불합격 총평 포함)"""
    choose_scenario(driver, "thesis-submission", "retry-open")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "논문신청에서 재신청" in row.text
    row.find_element(By.CSS_SELECTOR, "[data-action=show-history]").click()
    time.sleep(0.3)
    modal = driver.find_element(By.ID, "stage-history-modal")
    assert "예비심사 제출 기록" in modal.text
    assert "1차 제출" in modal.text and "불합격" in modal.text and "심사위원장 총평" in modal.text
    modal.find_element(By.CSS_SELECTOR, "[data-action=close-history]").click()


def test_03_retry_wait_next_semester(driver):
    """② 신청기간 아님 → 다음 학기 신청 안내, 재신청 버튼 없음"""
    choose_scenario(driver, "thesis-application", "retry-wait")
    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "재심사 대상" in row.text and "다음 학기(2027-1학기) 신청" in row.text
    assert not row.find_elements(By.PARTIAL_LINK_TEXT, "재신청")


def test_04_not_started_withdraw(driver):
    """③ 심사 미진행: [철회] → 초기화 안내 → 재심사 대상으로 복귀"""
    choose_scenario(driver, "thesis-application", "not-started")
    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "신청완료" in row.text
    row.find_element(By.PARTIAL_LINK_TEXT, "철회").click()
    assert accept_dialog(driver) == WITHDRAW_CONFIRM
    accept_dialog(driver)
    assert "재심사 대상" in stage_row(driver, "thesis-application-content", "예비심사").text


def test_05_not_started_cancel_submission(driver):
    """③ 심사 미진행: [제출취소] → 미제출"""
    choose_scenario(driver, "thesis-submission", "not-started")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차 제출" in row.text and "제출완료" in row.text
    row.find_element(By.CSS_SELECTOR, "[data-action=cancel-submission]").click()
    assert "취소하시겠습니까" in accept_dialog(driver)
    accept_dialog(driver)
    assert "미제출" in stage_row(driver, "thesis-submission-content", "예비심사").text


def test_06_in_progress_blocked(driver):
    """④ 심사 진행 중: 철회 불가 팝업, 제출취소 비활성"""
    choose_scenario(driver, "thesis-application", "in-progress")
    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "심사중" in row.text
    row.find_element(By.PARTIAL_LINK_TEXT, "철회").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED

    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert not row.find_elements(By.CSS_SELECTOR, "[data-action=cancel-submission]")
    disabled = row.find_element(By.XPATH, ".//button[normalize-space()='제출취소']")
    assert disabled.get_attribute("disabled") is not None


def test_07_conditional_followup_submit(driver):
    """⑤ 조건부합격: 신청 없이 2차 제출, '재심' 표기 없음"""
    choose_scenario(driver, "thesis-application", "conditional")
    row = stage_row(driver, "thesis-application-content", "본심사")
    assert "조건부합격" in row.text and "재심" not in row.text
    assert not row.find_elements(By.PARTIAL_LINK_TEXT, "신청")

    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "본심사")
    assert "2차 제출" in row.text and "미제출" in row.text and "재심" not in row.text
    row.find_element(By.XPATH, ".//button[normalize-space()='제출']").click()
    time.sleep(0.3)
    content = driver.find_element(By.ID, "thesis-submission-content").text
    assert "기존 제출 내역" in content and "조건부합격" in content and "2차 제출" in content
    assert "재심" not in content
    # 보완 제출 폼: 직전 제출 제목이 기본값
    assert driver.find_element(By.CSS_SELECTOR, "#thesis-submission-content #thesis-title").get_attribute("value")


def test_08_exam_schedule_attempt_column(driver):
    """심사일정: 차수 컬럼, 헤더와 셀 개수 일치, 로그인 학생(홍길동) 1차·2차 일정"""
    open_screen(driver, "exam-schedule")
    time.sleep(0.3)
    table = driver.find_element(By.ID, "student-exam-schedule-content")
    headers = [th.text for th in table.find_elements(By.CSS_SELECTOR, "thead th")]
    assert "차수" in headers
    for row in table.find_elements(By.CSS_SELECTOR, "tbody tr"):
        cells = row.find_elements(By.TAG_NAME, "td")
        if len(cells) > 1:
            assert len(cells) == len(headers)
    rows = [r.text for r in table.find_elements(By.CSS_SELECTOR, "tbody tr")]
    assert rows and all("홍길동" in r for r in rows), rows
    assert any("1차" in r for r in rows) and any("2차" in r for r in rows), rows


def test_09_dashboard_rereview_badge(driver):
    """대시보드: 시나리오에 따라 '재심사 대상'(①) / '재심사 진행'(③) 배지, 경로 표시"""
    choose_scenario(driver, "thesis-application", "retry-open")
    open_screen(driver, "dashboard")
    journey = driver.find_element(By.ID, "vertical-journey").text
    assert "재심사 대상" in journey and "1차 예비심사" not in journey
    choose_scenario(driver, "thesis-application", "not-started")
    open_screen(driver, "dashboard")
    assert "재심사 진행" in driver.find_element(By.ID, "vertical-journey").text


def test_10_no_console_errors(driver):
    logs = driver.get_log("browser")
    targets = ("review-scenario-data.js", "thesis-application.js", "thesis-submission.js",
               "student-exam-schedule.js", "dashboard.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors
