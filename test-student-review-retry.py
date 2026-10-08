"""
학생 화면 - 재심사 · 신청철회 목업 테스트 (2026-10-08 기준)
- 시나리오는 예비심사 심사 건의 상태 1개씩 (MECE): ① 신청 후 미제출 ② 제출 완료·심사 전 ③ 심사 내역 저장됨
  ④ 불합격·같은 학기 ⑤ 불합격·다음 학기 ⑥ 조건부합격 후 보완 / 재심사 안: 1안(신청 유지) · 2안(신청 다시)
- 신청 철회(신청 + 제출 삭제)와 제출취소(해당 차수 제출만 삭제, 신청 유지)는 별개
  심사 내역(평가 저장, 임시저장 포함)이 있으면 심사중으로 보고 둘 다 불가
- 신청상태는 기존 '미신청 / 신청완료'만, 목록은 심사 건 1행, 상세·제출 화면은 '1차 제출', '2차 제출' 순서

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
WITHDRAW_CONFIRM_SUBMITTED = "제출한 심사자료가 있습니다. 신청을 철회하면 제출 내역도 함께 삭제됩니다. 그래도 철회하시겠습니까?"
WITHDRAW_BLOCKED = "심사가 진행중이므로 철회할 수 없습니다."
WITHDRAW_DONE = "논문 신청 내역이 초기화되었습니다."
CANCEL_CONFIRM = "제출한 심사자료를 취소하시겠습니까?\n제출한 파일이 삭제되며, 제출기간 내에 다시 제출할 수 있습니다."
CANCEL_BLOCKED = "심사가 진행 중이어서 제출을 취소할 수 없습니다."
CANCEL_DONE = "제출이 취소되었습니다."
EDIT_BLOCKED = "심사가 진행 중이어서 제출 내용을 수정할 수 없습니다."
APPLY_BLOCKED = "불합격 처리된 단계는 다음 학기에 다시 신청할 수 있습니다."
SUBMIT_BLOCKED = "불합격 처리된 단계는 다음 학기 제출기간에 제출할 수 있습니다."


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


def choose(d, screen, key, plan="1"):
    """현재 화면의 시연 바에서 재심사 안·시나리오 선택 후 [초기화]"""
    open_screen(d, screen)
    bar = f"#{screen}-content"
    Select(d.find_element(By.CSS_SELECTOR, f"{bar} .review-plan-select")).select_by_value(plan)
    time.sleep(0.3)
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


def click_manage(d, stage_name):
    stage_row(d, "thesis-application-content", stage_name).find_element(By.PARTIAL_LINK_TEXT, "관리").click()
    time.sleep(0.3)


def withdraw_button(d, stage_name):
    click_manage(d, stage_name)
    return d.find_element(By.ID, "detail-modal").find_element(By.XPATH, ".//button[normalize-space()='논문 신청 철회']")


def headings(page):
    return [h.text for h in page.find_elements(By.TAG_NAME, "h3") if h.text.endswith("차 제출")]


def open_submission_row(d, stage_name, button):
    stage_row(d, "thesis-submission-content", stage_name).find_element(By.XPATH, f".//button[normalize-space()='{button}']").click()
    time.sleep(0.3)
    return d.find_element(By.ID, "thesis-submission-content")


def status_of(d, stage_name):
    return stage_row(d, "thesis-application-content", stage_name).find_elements(By.TAG_NAME, "td")[4].text


def test_01_bar_and_list_rules(driver):
    """시연 바: 시나리오 6개(상태별 1개) + 재심사 안 2개 / 신청상태 2종 / 관리 컬럼 1개"""
    open_screen(driver, "thesis-application")
    options = [o.text for o in driver.find_elements(By.CSS_SELECTOR, "#thesis-application-content .review-scenario-select option")]
    assert options == ["① 신청 후 미제출", "② 제출 완료·심사 전", "③ 심사 내역 저장됨",
                       "④ 불합격·같은 학기", "⑤ 불합격·다음 학기", "⑥ 조건부합격 후 보완"], options
    plans = [o.text for o in driver.find_elements(By.CSS_SELECTOR, "#thesis-application-content .review-plan-select option")]
    assert len(plans) == 2 and plans[0].startswith("1안") and plans[1].startswith("2안")
    for key in ("applied", "submitted", "reviewing", "fail-same", "fail-next", "conditional"):
        for plan in ("1", "2"):
            choose(driver, "thesis-application", key, plan)
            for r in driver.find_elements(By.CSS_SELECTOR, "#thesis-application-content tbody tr"):
                assert r.find_elements(By.TAG_NAME, "td")[4].text in ("미신청", "신청완료")
                assert action_cell_count(r) == 1
    open_screen(driver, "thesis-submission")
    for r in driver.find_elements(By.CSS_SELECTOR, "#thesis-submission-content tbody tr"):
        assert action_cell_count(r) == 1


def test_02_applied_withdraw_default_message(driver):
    """① 신청 후 미제출: 철회 → 요구서 문구 → 미신청, 학위논문제출 행 삭제"""
    choose(driver, "thesis-application", "applied")
    withdraw_button(driver, "예비심사").click()
    assert accept_dialog(driver) == WITHDRAW_CONFIRM
    assert accept_dialog(driver) == WITHDRAW_DONE
    assert status_of(driver, "예비심사") == "미신청"
    open_screen(driver, "thesis-submission")
    assert not rows(driver, "thesis-submission-content", "예비심사")


def test_03a_submitted_cancel_submission_keeps_application(driver):
    """② 제출 완료·심사 전: 상세 [제출취소] → 해당 차수 제출만 삭제(미제출), 신청은 신청완료 유지"""
    choose(driver, "thesis-submission", "submitted")
    page = open_submission_row(driver, "예비심사", "보기")
    assert headings(page) == ["1차 제출"]
    page.find_element(By.CSS_SELECTOR, "[data-action=cancel-submission]").click()
    assert accept_dialog(driver).replace(chr(13), "") == CANCEL_CONFIRM
    assert accept_dialog(driver) == CANCEL_DONE
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "1차 제출" in row.text and "미제출" in row.text
    open_screen(driver, "thesis-application")
    assert status_of(driver, "예비심사") == "신청완료"


def test_03b_submitted_withdraw_message(driver):
    """② 제출 완료·심사 전: 신청 철회 → 제출 내역 삭제 안내 → 신청·제출 함께 삭제"""
    choose(driver, "thesis-application", "submitted")
    withdraw_button(driver, "예비심사").click()
    assert accept_dialog(driver) == WITHDRAW_CONFIRM_SUBMITTED
    assert accept_dialog(driver) == WITHDRAW_DONE
    assert status_of(driver, "예비심사") == "미신청"
    open_screen(driver, "thesis-submission")
    assert not rows(driver, "thesis-submission-content", "예비심사")


def test_04_reviewing_withdraw_and_cancel_blocked(driver):
    """③ 심사 내역 저장됨(임시저장 포함): 심사중 — 신청 철회·제출취소 모두 불가"""
    choose(driver, "thesis-application", "reviewing")
    withdraw_button(driver, "예비심사").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    driver.execute_script("closeDetailModal()")
    open_screen(driver, "thesis-submission")
    page = open_submission_row(driver, "예비심사", "보기")
    page.find_element(By.CSS_SELECTOR, "[data-action=cancel-submission]").click()
    assert accept_dialog(driver) == CANCEL_BLOCKED
    # 심사중에는 논문 파일 수정 불가
    page.find_element(By.CSS_SELECTOR, "[data-action=edit-thesis]").click()
    assert accept_dialog(driver) == EDIT_BLOCKED
    assert not driver.find_elements(By.ID, "thesis-main-file")


def test_04b_edit_allowed_before_review_hidden_after_result(driver):
    """[수정]: 심사 전(②)에는 수정 화면 열림 / 결과 확정(합격) 후에는 [수정]·[제출취소] 없음"""
    choose(driver, "thesis-submission", "submitted")
    page = open_submission_row(driver, "예비심사", "보기")
    page.find_element(By.CSS_SELECTOR, "[data-action=edit-thesis]").click()
    time.sleep(0.3)
    assert driver.find_elements(By.ID, "thesis-main-file")
    driver.execute_script("backToThesisList()")
    time.sleep(0.3)
    page = open_submission_row(driver, "논문작성계획서", "보기")
    assert not page.find_elements(By.CSS_SELECTOR, "[data-action=edit-thesis]")
    assert not page.find_elements(By.CSS_SELECTOR, "[data-action=cancel-submission]")


def test_05_passed_stage_withdraw_blocked(driver):
    """합격 단계(논문작성계획서): 철회 불가"""
    choose(driver, "thesis-application", "applied")
    withdraw_button(driver, "논문작성계획서").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    driver.execute_script("closeDetailModal()")


def test_06_fail_same_semester_plan1(driver):
    """④ 1안: 신청완료 유지, 2차 제출 행 [제출] → 같은 학기 차단, 철회 불가"""
    choose(driver, "thesis-application", "fail-same", "1")
    assert status_of(driver, "예비심사") == "신청완료"
    withdraw_button(driver, "예비심사").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    driver.execute_script("closeDetailModal()")
    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차 제출" in row.text and "미제출" in row.text
    row.find_element(By.XPATH, ".//button[normalize-space()='제출']").click()
    assert accept_dialog(driver) == SUBMIT_BLOCKED


def test_07_fail_same_semester_plan2(driver):
    """④ 2안: 미신청, [관리] → 같은 학기 신청 차단"""
    choose(driver, "thesis-application", "fail-same", "2")
    assert status_of(driver, "예비심사") == "미신청"
    click_manage(driver, "예비심사")
    assert accept_dialog(driver) == APPLY_BLOCKED
    assert not driver.find_elements(By.ID, "application-modal")


def test_08_fail_next_semester_plan1(driver):
    """⑤ 1안: 신청완료, 같은 행 2차 [제출] → 1차 제출(불합격·총평) + 2차 제출 폼"""
    choose(driver, "thesis-application", "fail-next", "1")
    assert status_of(driver, "예비심사") == "신청완료"
    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차 제출" in row.text and "미제출" in row.text
    page = open_submission_row(driver, "예비심사", "제출")
    assert headings(page) == ["1차 제출", "2차 제출"] and "불합격" in page.text
    page.find_element(By.CSS_SELECTOR, "[data-action=show-review-comments]").click()
    time.sleep(0.3)
    assert "데이터 수집 설계를 전면 보완" in driver.find_element(By.TAG_NAME, "body").text
    driver.find_elements(By.CSS_SELECTOR, "[data-action=close-modal]")[-1].click()
    time.sleep(0.3)


def test_08b_plan1_second_attempt_cancel_keeps_first(driver):
    """⑤ 1안: 2차 제출 후 제출취소 → 2차만 미제출, 1차 불합격 기록·신청 유지 (특정 차수만 되돌림)"""
    choose(driver, "thesis-submission", "fail-next", "1")
    driver.execute_script(
        "const r = ReviewScenario.getLatest('prelim'); r.status = 'submitted';"
        "r.submittedData = {title: 't', thesisFile: 'prelim_v2.pdf', thesisFileSize: 1000, otherFile: null, otherFileSize: 0, submittedAt: '2026-10-08 10:00'};"
        "renderThesisScreen();")
    time.sleep(0.3)
    page = open_submission_row(driver, "예비심사", "보기")
    assert headings(page) == ["1차 제출", "2차 제출"]
    page.find_element(By.CSS_SELECTOR, "[data-action=cancel-submission]").click()
    accept_dialog(driver)
    assert accept_dialog(driver) == CANCEL_DONE
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차 제출" in row.text and "미제출" in row.text
    assert driver.execute_script("return ReviewScenario.getRecords('prelim')[0].reviewResult") == "fail"
    open_screen(driver, "thesis-application")
    assert status_of(driver, "예비심사") == "신청완료"


def test_09_fail_next_semester_plan2(driver):
    """⑤ 2안: 미신청 → [관리]로 다시 신청 → 같은 행이 2차 제출"""
    choose(driver, "thesis-application", "fail-next", "2")
    assert status_of(driver, "예비심사") == "미신청"
    click_manage(driver, "예비심사")
    modal = driver.find_element(By.ID, "application-modal")
    driver.find_element(By.ID, "app-thesis-title").send_keys("AI 기반 추천 시스템 연구(보완)")
    driver.find_element(By.ID, "app-thesis-title-en").send_keys("Improved Recommender")
    modal.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    accept_dialog(driver)
    assert accept_dialog(driver) == "논문 신청이 완료되었습니다."
    assert status_of(driver, "예비심사") == "신청완료"
    open_screen(driver, "thesis-submission")
    row = stage_row(driver, "thesis-submission-content", "예비심사")
    assert "2차 제출" in row.text and "미제출" in row.text
    page = open_submission_row(driver, "예비심사", "제출")
    assert headings(page) == ["1차 제출", "2차 제출"] and "불합격" in page.text


def test_10_conditional(driver):
    """⑥ 조건부합격: 신청 없이 2차 제출 폼, 철회 불가"""
    choose(driver, "thesis-submission", "conditional")
    row = stage_row(driver, "thesis-submission-content", "본심사")
    assert "2차 제출" in row.text and "미제출" in row.text
    page = open_submission_row(driver, "본심사", "제출")
    assert headings(page) == ["1차 제출", "2차 제출"] and "조건부합격" in page.text
    open_screen(driver, "thesis-application")
    withdraw_button(driver, "본심사").click()
    assert accept_dialog(driver) == WITHDRAW_BLOCKED
    driver.execute_script("closeDetailModal()")


def test_11_removed_items(driver):
    open_screen(driver, "exam-schedule")
    time.sleep(0.3)
    assert "차수" not in [th.text for th in driver.find_elements(By.CSS_SELECTOR, "#student-exam-schedule-content thead th")]
    open_screen(driver, "dashboard")
    assert "재심사" not in driver.find_element(By.ID, "vertical-journey").text


def test_12_no_console_errors(driver):
    logs = driver.get_log("browser")
    targets = ("review-scenario-data.js", "thesis-application.js", "thesis-submission.js",
               "student-exam-schedule.js", "dashboard.js", "mockup-deeplink.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors


def test_13_deeplink(driver):
    driver.get(URL + "?screen=thesis-application&scenario=fail-next&plan=2")
    time.sleep(1.5)
    assert status_of(driver, "예비심사") == "미신청"
    driver.get(URL + "?screen=thesis-submission&scenario=submitted&view=prelim")
    time.sleep(1.5)
    text = driver.find_element(By.ID, "thesis-submission-content").text
    assert "1차 제출" in text and "제출취소" in text and "수정" in text
    # 결과 확정·심사중 차수는 딥링크로도 수정 화면이 열리지 않음
    driver.get(URL + "?screen=thesis-submission&scenario=reviewing&form=prelim")
    time.sleep(1.5)
    assert accept_dialog(driver) == EDIT_BLOCKED
    driver.get(URL + "?screen=thesis-application&scenario=submitted&detail=prelim")
    time.sleep(1.5)
    assert "논문 신청 철회" in driver.find_element(By.ID, "detail-modal").text
    # 이전 키 호환
    driver.get(URL + "?screen=thesis-application&scenario=retry-open")
    time.sleep(1.5)
    assert driver.execute_script("return ReviewScenario.getState().key") == "fail-next"
