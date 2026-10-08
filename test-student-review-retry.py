"""
학생 화면 - 재심사 · 신청철회 · 제출취소 목업 테스트 (2026-10-08 기준)
- 신청상태는 기존 '미신청 / 신청완료'만 (재심사도 일반 심사와 동일)
- 목록은 심사 건(기본단계) 1행, 1·2차 제출은 하나의 관리(상세·제출) 화면에 'N차 제출' 블록으로 표시 (목록 제출구분과 같은 표기)
- 관리 컬럼은 상세(페이지) 이동 1개, 철회·제출취소는 상세 화면에서 해당 기간에만
- 신청 철회 = 제출취소 (어느 메뉴에서 해도 신청과 제출이 함께 철회), 불가 문구는 요구서 문구

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
WITHDRAW_DONE = "논문 신청 내역이 초기화되었습니다."


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


def stage_row(d, container_id, stage_name):
    found = rows(d, container_id, stage_name)
    assert len(found) == 1, f"{stage_name}: 심사 건 1행이어야 함 ({len(found)}행)"
    return found[0]


def action_cell_count(row):
    return len(row.find_elements(By.CSS_SELECTOR, "td:last-child a, td:last-child button"))


def open_application_detail(d, stage_name):
    stage_row(d, "thesis-application-content", stage_name).find_element(By.PARTIAL_LINK_TEXT, "관리").click()
    time.sleep(0.3)
    return d.find_element(By.ID, "detail-modal")


def headings(page):
    return [h.text for h in page.find_elements(By.TAG_NAME, "h3") if h.text.endswith("차 제출")]


def open_submission_row(d, stage_name, button):
    stage_row(d, "thesis-submission-content", stage_name).find_element(By.XPATH, f".//button[normalize-space()='{button}']").click()
    time.sleep(0.3)
    return d.find_element(By.ID, "thesis-submission-content")


def test_01_fail_then_reapply(driver):
    """① 불합격 단계: 신청상태 '미신청'(재심사 구분 없음) → [관리]로 다시 신청 → 학위논문제출 같은 행이 2차 제출로"""
    choose_scenario(driver, "thesis-application", "retry-open")
    content = driver.find_element(By.ID, "thesis-application-content")
    statuses = [r.find_elements(By.TAG_NAME, "td")[4].text for r in content.find_elements(By.CSS_SELECTOR, "tbody tr")]
    assert set(statuses) <= {"미신청", "신청완료"}, statuses
    assert "재심사" not in content.find_element(By.TAG_NAME, "table").text

    row = stage_row(driver, "thesis-application-content", "예비심사")
    assert "미신청" in row.text
    row.find_element(By.PARTIAL_LINK_TEXT, "관리").click()
    time.sleep(0.3)
    modal = driver.find_element(By.ID, "application-modal")
    driver.find_element(By.ID, "app-thesis-title").send_keys("AI 기반 추천 시스템 연구(보완)")
    driver.find_element(By.ID, "app-thesis-title-en").send_keys("Improved Recommender")
    modal.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    accept_dialog(driver)
    assert accept_dialog(driver) == "논문 신청이 완료되었습니다."
    assert "신청완료" in stage_row(driver, "thesis-application-content", "예비심사").text
    for r_ in driver.find_elements(By.CSS_SELECTOR, "#thesis-application-content tbody tr"):
        assert action_cell_count(r_) == 1

    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차 제출" in row.text and "미제출" in row.text
    page = open_submission_row(driver, "예비심사", "제출")
    assert headings(page) == ["1차 제출", "2차 제출"] and "불합격" in page.text


def test_02_one_management_screen(driver):
    """② 2차 제출 상세: 같은 화면에 1차 제출 내역(불합격·총평 보기)과 2차 제출 정보"""
    choose_scenario(driver, "thesis-submission", "not-started")
    for r_ in driver.find_elements(By.CSS_SELECTOR, "#thesis-submission-content tbody tr"):
        assert action_cell_count(r_) == 1 and "제출취소" not in r_.text
    # 목록 제출구분('2차 제출')과 상세 제목이 같은 표기
    assert "2차 제출" in stage_row(driver, "thesis-submission-content", "예비심사").text
    page = open_submission_row(driver, "예비심사", "보기")
    assert headings(page) == ["1차 제출", "2차 제출"] and "불합격" in page.text
    page.find_element(By.CSS_SELECTOR, "[data-action=show-review-comments]").click()
    time.sleep(0.3)
    assert "데이터 수집 설계를 전면 보완" in driver.find_element(By.TAG_NAME, "body").text
    driver.find_elements(By.CSS_SELECTOR, "[data-action=close-modal]")[-1].click()
    time.sleep(0.3)


def test_03_withdraw_in_application_detail_also_withdraws_submission(driver):
    """② 논문신청 상세 [논문 신청 철회] → 신청·제출 함께 철회"""
    choose_scenario(driver, "thesis-application", "not-started")
    open_application_detail(driver, "예비심사").find_element(By.XPATH, ".//button[normalize-space()='논문 신청 철회']").click()
    assert accept_dialog(driver) == WITHDRAW_CONFIRM
    assert accept_dialog(driver) == WITHDRAW_DONE
    assert "미신청" in stage_row(driver, "thesis-application-content", "예비심사").text
    open_screen(driver, "thesis-submission")
    assert "1차 제출" in stage_row(driver, "thesis-submission-content", "예비심사").text, "2차 제출도 철회됨"


def test_04_cancel_submission_also_withdraws_application(driver):
    """② 학위논문제출 상세 [제출취소] → 신청도 함께 철회 (한 번에)"""
    choose_scenario(driver, "thesis-submission", "not-started")
    page = open_submission_row(driver, "예비심사", "보기")
    page.find_element(By.CSS_SELECTOR, "[data-action=cancel-submission]").click()
    assert accept_dialog(driver) == WITHDRAW_CONFIRM
    assert accept_dialog(driver) == WITHDRAW_DONE
    assert "1차 제출" in stage_row(driver, "thesis-submission-content", "예비심사").text
    open_screen(driver, "thesis-application")
    assert "미신청" in stage_row(driver, "thesis-application-content", "예비심사").text, "신청도 철회됨"


def test_05_in_progress_blocked_in_both_menus(driver):
    """③ 심사 진행 중: 논문신청·학위논문제출 어느 쪽에서도 요구서 문구로 불가"""
    choose_scenario(driver, "thesis-application", "in-progress")
    open_application_detail(driver, "예비심사").find_element(By.XPATH, ".//button[normalize-space()='논문 신청 철회']").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    driver.execute_script("closeDetailModal()")
    open_screen(driver, "thesis-submission")
    page = open_submission_row(driver, "예비심사", "보기")
    page.find_element(By.CSS_SELECTOR, "[data-action=cancel-submission]").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED


def test_06_passed_stage_withdraw_blocked(driver):
    choose_scenario(driver, "thesis-application", "retry-open")
    open_application_detail(driver, "논문작성계획서").find_element(By.XPATH, ".//button[normalize-space()='논문 신청 철회']").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    driver.execute_script("closeDetailModal()")


def test_07_conditional_followup_in_same_screen(driver):
    """④ 조건부합격: 본심사 1행이 2차 제출, 제출 화면에 1차 제출 내역(조건부합격)"""
    choose_scenario(driver, "thesis-submission", "conditional")
    row = stage_row(driver, "thesis-submission-content", "본심사")
    assert "2차 제출" in row.text and "미제출" in row.text
    page = open_submission_row(driver, "본심사", "제출")
    assert headings(page) == ["1차 제출", "2차 제출"] and "조건부합격" in page.text


def test_07b_same_semester_reapply_blocked(driver):
    """불합격 처리된 학기에는 같은 단계 다시 신청 불가 (다음 학기에 신청) — ① 시나리오의 불합격 학기를 현재 학기로 바꿔 확인"""
    choose_scenario(driver, "thesis-application", "retry-open")
    driver.execute_script(
        "const s = ReviewScenario.getStage('prelim'); ReviewScenario.getLatest('prelim').semester = s.semester;")
    stage_row(driver, "thesis-application-content", "예비심사").find_element(By.PARTIAL_LINK_TEXT, "관리").click()
    assert accept_dialog(driver) == "불합격 처리된 단계는 다음 학기에 다시 신청할 수 있습니다."
    assert not driver.find_elements(By.ID, "application-modal")
    # 다른 학기(기본 ① 시나리오)는 신청 모달이 열림
    choose_scenario(driver, "thesis-application", "retry-open")
    stage_row(driver, "thesis-application-content", "예비심사").find_element(By.PARTIAL_LINK_TEXT, "관리").click()
    time.sleep(0.3)
    assert driver.find_elements(By.ID, "application-modal")
    driver.execute_script("closeApplicationModal()")


def test_08_removed_items(driver):
    open_screen(driver, "thesis-application")
    options = [o.text for o in driver.find_elements(By.CSS_SELECTOR, "#thesis-application-content .review-scenario-select option")]
    assert len(options) == 4, options
    open_screen(driver, "exam-schedule")
    time.sleep(0.3)
    assert "차수" not in [th.text for th in driver.find_elements(By.CSS_SELECTOR, "#student-exam-schedule-content thead th")]
    open_screen(driver, "dashboard")
    assert "재심사" not in driver.find_element(By.ID, "vertical-journey").text


def test_09_no_console_errors(driver):
    logs = driver.get_log("browser")
    targets = ("review-scenario-data.js", "thesis-application.js", "thesis-submission.js",
               "student-exam-schedule.js", "dashboard.js", "mockup-deeplink.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors


def test_10_deeplink(driver):
    driver.get(URL + "?screen=thesis-submission&scenario=not-started&view=prelim")
    time.sleep(1.5)
    text = driver.find_element(By.ID, "thesis-submission-content").text
    assert "1차 제출" in text and "2차 제출" in text and "기존 제출 내역" not in text and "제출취소" in text
    driver.get(URL + "?screen=thesis-application&scenario=not-started&detail=prelim")
    time.sleep(1.5)
    assert "논문 신청 철회" in driver.find_element(By.ID, "detail-modal").text
