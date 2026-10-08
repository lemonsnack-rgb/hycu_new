"""
학생 화면 - 재심사 · 신청철회 · 제출취소 목업 테스트 (2026-10-07 재정비 기준)
기준: docs/재심사_목업_재정비_계획_20261007.md
- 신청상태: 기존 '미신청 / 신청완료' + 요구서 '재심사 진행', 버튼은 기존 [관리] / [철회]
- 구 이력 조회: 학위논문제출 목록의 지난 제출 행 + 기존 [보기] / [총평 보기]
- 철회 불가 문구는 요구서 문구 하나
- 관리 컬럼은 상세(페이지) 이동 1개만, 철회·제출취소는 상세 화면에서 해당 기간에만 (2026-10-08)

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


def rows(d, container_id, text):
    return [r for r in d.find_elements(By.CSS_SELECTOR, f"#{container_id} tbody tr") if text in r.text]


def action_cell_count(row):
    """관리 컬럼(마지막 칸)의 버튼·링크 개수"""
    return len(row.find_elements(By.CSS_SELECTOR, "td:last-child a, td:last-child button"))


def open_application_detail(d, stage_name):
    """논문신청 목록의 [관리] → 신청 상세 모달"""
    stage_row(d, "thesis-application-content", stage_name).find_element(By.PARTIAL_LINK_TEXT, "관리").click()
    time.sleep(0.3)
    return d.find_element(By.ID, "detail-modal")


def stage_row(d, container_id, stage_name):
    found = rows(d, container_id, stage_name)
    assert found, f"{stage_name} 행을 찾을 수 없음"
    return found[-1]


def test_01_retry_status_and_reapply(driver):
    """① 불합격 단계: '재심사 진행' + 기존 [관리]로 다시 신청 → 신청완료, 학위논문제출에 2차 제출 행"""
    choose_scenario(driver, "thesis-application", "retry-open")
    content = driver.find_element(By.ID, "thesis-application-content")
    statuses = [r.find_elements(By.TAG_NAME, "td")[4].text for r in content.find_elements(By.CSS_SELECTOR, "tbody tr")]
    assert set(statuses) <= {"미신청", "신청완료", "재심사 진행"}, statuses

    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "재심사 진행" in row.text and "[관리]" in row.text
    row.find_element(By.PARTIAL_LINK_TEXT, "관리").click()
    time.sleep(0.3)
    modal = driver.find_element(By.ID, "application-modal")
    assert "재신청" not in modal.text and "불합격" not in modal.text, "기존 신청 모달 그대로"
    driver.find_element(By.ID, "app-thesis-title").send_keys("AI 기반 추천 시스템 연구(보완)")
    driver.find_element(By.ID, "app-thesis-title-en").send_keys("Improved Recommender")
    modal.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    accept_dialog(driver)
    assert accept_dialog(driver) == "논문 신청이 완료되었습니다."
    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "신청완료" in row.text and "[관리]" in row.text and "철회" not in row.text
    for r_ in driver.find_elements(By.CSS_SELECTOR, "#thesis-application-content tbody tr"):
        assert action_cell_count(r_) == 1, "관리 컬럼은 1개 동작"

    open_screen(driver, "thesis-submission")
    prelim = [r.text for r in rows(driver, "thesis-submission-content", "예비심사")]
    assert any("1차 제출" in t and "불합격" in t for t in prelim), prelim
    assert any("2차 제출" in t and "미제출" in t for t in prelim), prelim
    for r_ in driver.find_elements(By.CSS_SELECTOR, "#thesis-submission-content tbody tr"):
        assert action_cell_count(r_) == 1 and "제출취소" not in r_.text, "관리 컬럼은 1개 동작, 제출취소는 상세에서"


def test_02_old_history_via_existing_view(driver):
    """구 이력 상시 조회: 지난 제출(1차 불합격) 행 → 기존 [보기] → [총평 보기]"""
    choose_scenario(driver, "thesis-submission", "retry-open")
    first = [r for r in rows(driver, "thesis-submission-content", "예비심사") if "1차 제출" in r.text][0]
    assert "불합격" in first.text and "논문신청에서 재신청" not in first.text
    first.find_element(By.XPATH, ".//button[normalize-space()='보기']").click()
    time.sleep(0.3)
    detail = driver.find_element(By.ID, "thesis-submission-content")
    assert "불합격" in detail.text
    assert "제출취소" not in detail.text, "결과 확정·제출기간 지난 건은 제출취소 없음"
    detail.find_element(By.CSS_SELECTOR, "[data-action=show-review-comments]").click()
    time.sleep(0.3)
    assert "데이터 수집 설계를 전면 보완" in driver.find_element(By.TAG_NAME, "body").text
    assert not driver.find_elements(By.ID, "stage-history-modal"), "제출 기록 팝업은 제거됨"
    # 총평 창 닫기 (기존 모달의 [닫기])
    driver.find_elements(By.CSS_SELECTOR, "[data-action=close-modal]")[-1].click()
    time.sleep(0.3)


def test_03_withdraw_not_started(driver):
    """② 심사 미진행: [관리] → 신청 상세 → '논문 신청 철회'(철회기간) → 요구서 확인 문구 → 재심사 진행으로 복귀"""
    choose_scenario(driver, "thesis-application", "not-started")
    modal = open_application_detail(driver, "예비심사")
    modal.find_element(By.XPATH, ".//button[normalize-space()='논문 신청 철회']").click()
    assert accept_dialog(driver) == WITHDRAW_CONFIRM
    accept_dialog(driver)
    assert "재심사 진행" in stage_row(driver, "thesis-application-content", "예비심사").text


def test_04_cancel_submission_not_started(driver):
    """② 심사 미진행: [보기] 상세 → [제출취소](제출기간) → 미제출, 결과 전 심사결과는 '-'"""
    choose_scenario(driver, "thesis-submission", "not-started")
    row = [r for r in rows(driver, "thesis-submission-content", "예비심사") if "2차 제출" in r.text][0]
    assert row.find_elements(By.TAG_NAME, "td")[6].text == "-"
    row.find_element(By.XPATH, ".//button[normalize-space()='보기']").click()
    time.sleep(0.3)
    driver.find_element(By.CSS_SELECTOR, "#thesis-submission-content [data-action=cancel-submission]").click()
    assert "취소하시겠습니까" in accept_dialog(driver)
    accept_dialog(driver)
    row = [r for r in rows(driver, "thesis-submission-content", "예비심사") if "2차 제출" in r.text][0]
    assert "미제출" in row.text


def test_05_in_progress_blocked(driver):
    """③ 심사 진행 중: 철회·제출취소 모두 안내 팝업으로 불가 (비활성 버튼 없음)"""
    choose_scenario(driver, "thesis-application", "in-progress")
    open_application_detail(driver, "예비심사").find_element(By.XPATH, ".//button[normalize-space()='논문 신청 철회']").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    driver.execute_script("closeDetailModal()")

    open_screen(driver, "thesis-submission")
    row = [r for r in rows(driver, "thesis-submission-content", "예비심사") if "2차 제출" in r.text][0]
    row.find_element(By.XPATH, ".//button[normalize-space()='보기']").click()
    time.sleep(0.3)
    driver.find_element(By.CSS_SELECTOR, "#thesis-submission-content [data-action=cancel-submission]").click()
    assert "제출을 취소할 수 없습니다" in accept_dialog(driver)


def test_06_passed_stage_withdraw_uses_requirement_text(driver):
    """결과 확정 단계(논문작성계획서 합격)도 요구서 문구로 철회 불가 (D4)"""
    choose_scenario(driver, "thesis-application", "retry-open")
    open_application_detail(driver, "논문작성계획서").find_element(By.XPATH, ".//button[normalize-space()='논문 신청 철회']").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    driver.execute_script("closeDetailModal()")


def test_07_conditional_followup_submit(driver):
    """④ 조건부합격: 신청 없이 2차 제출, 제출 폼에 기존 제출 내역"""
    choose_scenario(driver, "thesis-submission", "conditional")
    row = [r for r in rows(driver, "thesis-submission-content", "본심사") if "2차 제출" in r.text][0]
    assert "미제출" in row.text and "재심" not in row.text
    row.find_element(By.XPATH, ".//button[normalize-space()='제출']").click()
    time.sleep(0.3)
    content = driver.find_element(By.ID, "thesis-submission-content").text
    assert "기존 제출 내역" in content and "조건부합격" in content


def test_08_removed_items(driver):
    """제거 항목: 다음 학기 대기 시나리오, 일정 차수 컬럼, 대시보드 재심사 배지"""
    open_screen(driver, "thesis-application")
    options = [o.text for o in driver.find_elements(By.CSS_SELECTOR, "#thesis-application-content .review-scenario-select option")]
    assert len(options) == 4 and not any("다음 학기" in o for o in options), options
    open_screen(driver, "exam-schedule")
    time.sleep(0.3)
    headers = [th.text for th in driver.find_elements(By.CSS_SELECTOR, "#student-exam-schedule-content thead th")]
    assert "차수" not in headers
    open_screen(driver, "dashboard")
    assert "재심사" not in driver.find_element(By.ID, "vertical-journey").text


def test_09_no_console_errors(driver):
    logs = driver.get_log("browser")
    targets = ("review-scenario-data.js", "thesis-application.js", "thesis-submission.js",
               "student-exam-schedule.js", "dashboard.js", "mockup-deeplink.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors


def test_10_deeplink(driver):
    """목업 딥링크: ?screen=…&scenario=…, &form=…"""
    driver.get(URL + "?screen=thesis-application&scenario=retry-open")
    time.sleep(1.5)
    assert "재심사 진행" in stage_row(driver, "thesis-application-content", "예비심사").text
    driver.get(URL + "?screen=thesis-submission&scenario=conditional&form=final")
    time.sleep(1.5)
    assert "기존 제출 내역" in driver.find_element(By.ID, "thesis-submission-content").text
