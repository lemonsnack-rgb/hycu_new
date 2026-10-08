"""
교수 화면 - 재심사 목업 테스트 (2026-10-07 재정비 기준)
기준: docs/재심사_목업_재정비_계획_20261007.md
- 같은 심사 건의 1·2차는 목록 1행(최신 차수), 상세에 이전 차수 심사 화면을 그대로(읽기 전용) 표시 (2026-10-08)
- 조건부합격은 기존처럼 같은 심사 건 안에서 '재심 정보'로 처리 (새 행 없음), 불합격 안내/확인창 없음

실행: python -m pytest test-professor-review-retry.py -v -s
"""
import os
import time

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select, WebDriverWait

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


def open_review_list(d):
    d.execute_script("showScreen('review')")
    time.sleep(0.6)


def open_chair(d, assignment_id):
    d.execute_script(f"openReviewDetail('{assignment_id}', 'chair')")
    time.sleep(0.8)


def detail_text(d):
    # 페이지에 같은 id가 두 개 있어 상세 화면(review-detail-screen) 안으로 한정
    return d.find_element(By.CSS_SELECTOR, "#review-detail-screen #review-detail-content").text


def review_rows(d, name):
    return [r.text for r in d.find_elements(By.CSS_SELECTOR, "#review-list tbody tr") if name in r.text]


def test_01_list_one_row_per_case(driver):
    """심사 건 1행 (차수 컬럼 없음)"""
    open_review_list(driver)
    headers = [th.text for th in driver.find_elements(By.CSS_SELECTOR, "#review-list thead th")]
    assert "차수" not in headers
    assert len(review_rows(driver, "홍길동")) == 1


def test_02_detail_shows_previous_attempt_as_is(driver):
    """한 관리 화면: 1차 심사 내역(기존 화면 그대로) + 2차 심사"""
    open_review_list(driver)
    open_chair(driver, "RA_RETRY_002")
    text = detail_text(driver)
    assert "1차 심사" in text and "2차 심사" in text
    assert "데이터 수집 설계를 전면 보완" in text, "1차 위원장 최종 의견"
    # 현재 차수의 판정 영역은 그대로 동작 (이전 차수와 id 충돌 없음)
    ids = driver.execute_script("return [!!document.querySelector('#review-detail-screen #chair-final-comment'), !!document.querySelector('#review-detail-screen #prev1-chair-final-comment')]")
    assert ids == [True, True], ids


def test_03_fail_decision_existing_flow(driver):
    """불합격: 안내 박스·확인창 없이 기존 흐름으로 저장"""
    open_review_list(driver)
    open_chair(driver, "RA_TEST_CHAIR")
    driver.execute_script("selectDecision('불합격')")
    assert not driver.find_elements(By.ID, "fail-notice-section")
    driver.find_element(By.ID, "chair-final-comment").send_keys("연구 방법론 전면 보완 필요")
    driver.execute_script("submitChairDecision()")
    time.sleep(0.5)
    decision = driver.execute_script(
        "return REVIEW_RESULTS.find(r => r.assignmentId === 'RA_TEST_CHAIR').finalDecision")
    assert decision == "불합격"
    assert not driver.execute_script("return REVIEW_ASSIGNMENTS.some(a => a.previousAssignmentId === 'RA_TEST_CHAIR')")


def test_04_conditional_stays_in_same_case(driver):
    """조건부합격: 평가표 선택 가능 → 같은 심사 건 안에 '재심 정보' 저장 (새 행 없음)"""
    open_review_list(driver)
    open_chair(driver, "RA_TEST_CHAIR")
    driver.execute_script("selectDecision('조건부합격')")
    template_select = Select(driver.find_element(By.ID, "resubmission-template-id"))
    assert len(template_select.options) > 1
    template_select.select_by_index(1)
    driver.find_element(By.CSS_SELECTOR, "input[name='resubmission-reviewer-type'][value='committee']").click()
    driver.find_element(By.ID, "chair-final-comment").send_keys("5장 분석 보완 후 다시 제출")
    driver.execute_script("submitChairDecision()")
    time.sleep(1.5)
    resub = driver.execute_script(
        "const r = REVIEW_RESULTS.find(x => x.assignmentId === 'RA_TEST_CHAIR'); return r && r.resubmission ? r.resubmission.reviewerType : null")
    assert resub == "committee"
    assert not driver.execute_script("return REVIEW_ASSIGNMENTS.some(a => a.previousAssignmentId === 'RA_TEST_CHAIR')")
    driver.execute_script("closeReviewDetailScreen && closeReviewDetailScreen()")
    open_review_list(driver)
    assert len(review_rows(driver, "판정테스트")) == 1


def test_05_exam_schedule_no_attempt_column(driver):
    """심사일정: 차수 컬럼 없음, 헤더·셀 개수 일치, 학위 표시·필터 정상(기존 결함 수정 유지)"""
    driver.execute_script("showScreen('exam-schedule')")
    time.sleep(0.8)
    driver.execute_script("document.getElementById('exam-filter-year').value=''; document.getElementById('exam-filter-semester').value=''; filterExamScheduleList();")
    time.sleep(0.4)
    content = driver.find_element(By.ID, "exam-schedule-content")
    headers = [th.text for th in content.find_elements(By.CSS_SELECTOR, "thead th")]
    assert "차수" not in headers and "세부단계" in headers
    for row in content.find_elements(By.CSS_SELECTOR, "tbody tr"):
        assert len(row.find_elements(By.TAG_NAME, "td")) == len(headers)
    hong = [r.text for r in content.find_elements(By.CSS_SELECTOR, "tbody tr") if "홍길동" in r.text]
    assert hong and all("석박통합" not in t for t in hong)
    driver.execute_script("document.getElementById('exam-filter-college-type').value='일반대학원'; filterExamScheduleList();")
    time.sleep(0.3)
    assert any("홍길동" in r.text for r in content.find_elements(By.CSS_SELECTOR, "tbody tr"))


def test_06_dashboard_without_rereview(driver):
    driver.execute_script("showScreen('dashboard')")
    time.sleep(0.5)
    assert "재심사" not in driver.find_element(By.ID, "student-summary-cards").text


def test_07_no_console_errors(driver):
    open_review_list(driver)
    open_chair(driver, "RA_RETRY_002")
    logs = driver.get_log("browser")
    targets = ("review-data.js", "review-list.js", "review-detail.js",
               "exam-schedule-professor-readonly.js", "professor-dashboard.js", "exam-schedule-data.js", "mockup-deeplink.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors


def test_09_mouse_path_to_previous_attempt(driver):
    """경로: 학위논문심사 목록 → [승인](위원장) / [심사](위원) 실제 마우스 클릭 → 상세 위쪽 1차 심사 내역
    (모바일 메뉴 오버레이가 데스크톱 화면을 가려 클릭이 안 되던 기존 결함 수정 확인)"""
    from selenium.webdriver.common.action_chains import ActionChains
    for button, expect in (("승인", "데이터 수집 설계를 전면 보완"), ("심사", "1차 심사")):
        open_review_list(driver)
        row = [r for r in driver.find_elements(By.CSS_SELECTOR, "#review-list tbody tr") if "홍길동" in r.text][0]
        btn = row.find_element(By.XPATH, f".//button[normalize-space()='{button}']")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'})", btn)
        time.sleep(0.3)
        ActionChains(driver).move_to_element(btn).click().perform()
        time.sleep(0.8)
        text = detail_text(driver)
        assert expect in text and "2차 심사" in text, button
        assert text.find("1차 심사") < text.find("2차 심사")
    # 모바일 메뉴는 그대로 열리고 닫힘
    driver.execute_script("toggleMobileMenu()")
    assert driver.execute_script("return getComputedStyle(document.getElementById('mobile-menu-overlay')).display") == "block"
    driver.execute_script("toggleMobileMenu()")
    assert driver.execute_script("return getComputedStyle(document.getElementById('mobile-menu-overlay')).display") == "none"


def test_08_deeplink(driver):
    driver.get(URL + "?screen=review&detail=RA_TEST_CHAIR&view=chair")
    time.sleep(2)
    assert "판정테스트" in detail_text(driver)
    driver.get(URL + "?screen=exam-schedule&year=all")
    time.sleep(2)
    assert "홍길동" in driver.find_element(By.ID, "exam-schedule-content").text
