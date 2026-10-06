"""
학생 화면 - 재심사 · 제출취소 목업 테스트 (2026-10-06)
기준: docs/재심사_제출취소_영향도분석_20261006.md 0장 (시연 시나리오 ①~⑤)

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
    rows = d.find_elements(By.CSS_SELECTOR, f"#{container_id} tbody tr")
    for row in rows:
        if stage_name in row.text:
            return row
    raise AssertionError(f"{stage_name} 행을 찾을 수 없음")


def test_01_retry_open_apply_second_attempt(driver):
    """① 불합격 단계: [2차 신청] → 신청완료(2차)"""
    choose_scenario(driver, "thesis-application", "retry-open")
    rows = driver.find_elements(By.CSS_SELECTOR, "#thesis-application-content tbody tr")
    assert len(rows) == 3, "논문작성계획서/예비심사/본심사 3행"

    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "재심사 대상" in row.text and "1차 불합격" in row.text
    row.find_element(By.PARTIAL_LINK_TEXT, "2차 신청").click()
    time.sleep(0.3)
    modal = driver.find_element(By.ID, "application-modal")
    assert "2차 재심사를 신청합니다" in modal.text
    driver.find_element(By.ID, "thesis-title").send_keys("AI 기반 추천 시스템 연구(보완)")
    driver.find_element(By.ID, "thesis-title-en").send_keys("Improved Recommender")
    modal.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    accept_dialog(driver)                      # 신청 확인
    assert "2차" in accept_dialog(driver)      # 완료 알림

    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "신청완료" in row.text and "2차" in row.text

    # 자료제출 화면: 2차 미제출 행 + [제출]
    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차" in row.text and "미제출" in row.text and "제출" in row.text


def test_02_history_modal(driver):
    """단계명 클릭 → 차수별 기록 (1차 불합격 총평 포함)"""
    choose_scenario(driver, "thesis-submission", "retry-open")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    row.find_element(By.CSS_SELECTOR, "[data-action=show-history]").click()
    time.sleep(0.3)
    modal = driver.find_element(By.ID, "stage-history-modal")
    assert "예비심사 차수별 기록" in modal.text
    assert "1차" in modal.text and "불합격" in modal.text and "심사위원장 총평" in modal.text
    modal.find_element(By.CSS_SELECTOR, "[data-action=close-history]").click()


def test_03_retry_wait_next_semester(driver):
    """② 신청기간 아님 → 다음 학기 신청 안내, 신청 버튼 없음"""
    choose_scenario(driver, "thesis-application", "retry-wait")
    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "재심사 대상" in row.text and "다음 학기(2027-1학기) 신청" in row.text
    assert not row.find_elements(By.PARTIAL_LINK_TEXT, "차 신청")


def test_04_not_started_withdraw(driver):
    """③ 심사 미진행: [철회] → 초기화 안내 → 재심사 대상으로 복귀"""
    choose_scenario(driver, "thesis-application", "not-started")
    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "신청완료" in row.text
    row.find_element(By.PARTIAL_LINK_TEXT, "철회").click()
    assert accept_dialog(driver) == WITHDRAW_CONFIRM
    accept_dialog(driver)
    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "재심사 대상" in row.text


def test_05_not_started_cancel_submission(driver):
    """③ 심사 미진행: [제출취소] → 미제출"""
    choose_scenario(driver, "thesis-submission", "not-started")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차" in row.text and "제출완료" in row.text
    row.find_element(By.CSS_SELECTOR, "[data-action=cancel-submission]").click()
    assert "취소하시겠습니까" in accept_dialog(driver)
    accept_dialog(driver)
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "미제출" in row.text


def test_06_in_progress_blocked(driver):
    """④ 심사 진행 중: 철회 불가 팝업, 제출취소 비활성"""
    choose_scenario(driver, "thesis-application", "in-progress")
    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "심사중" in row.text
    row.find_element(By.PARTIAL_LINK_TEXT, "철회").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    assert "심사중" in stage_row(driver, "thesis-application-content", "예비심사").text

    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert not row.find_elements(By.CSS_SELECTOR, "[data-action=cancel-submission]")
    disabled = row.find_element(By.XPATH, ".//button[normalize-space()='제출취소']")
    assert disabled.get_attribute("disabled") is not None


def test_07_conditional_retry_submit(driver):
    """⑤ 조건부합격: 신청 없이 [재심 제출], 표기 1차 재심1"""
    choose_scenario(driver, "thesis-application", "conditional")
    row = stage_row(driver, "thesis-application-content", "본심사")
    assert "조건부합격(재심)" in row.text
    assert not row.find_elements(By.PARTIAL_LINK_TEXT, "신청")

    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "본심사")
    assert "1차 재심1" in row.text and "재심 제출 대기" in row.text
    row.find_element(By.XPATH, ".//button[normalize-space()='재심 제출']").click()
    time.sleep(0.3)
    content = driver.find_element(By.ID, "thesis-submission-content").text
    assert "기존 제출 내역" in content and "조건부합격" in content and "1차 재심1" in content


def test_08_no_console_errors(driver):
    """콘솔 오류(SEVERE) 중 이번 수정 파일 관련 오류 없음"""
    logs = driver.get_log("browser")
    targets = ("review-scenario-data.js", "thesis-application.js", "thesis-submission.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors
