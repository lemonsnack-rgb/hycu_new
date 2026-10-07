"""
관리자 화면 - 재심사 목업 테스트 (2026-10-07 재정비 기준)
기준: docs/재심사_목업_재정비_계획_20261007.md
- 관리 화면은 재신청·재심사 건을 따로 구분하지 않음 (신청구분·철회/재심사 대상·배정 불가·차수 없음)
- 철회 건은 목록에 없음(요구서: 철회 시 배정 내역 삭제)

실행: python -m pytest test-admin-review-retry.py -v -s
"""
import os
import time

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

ROOT = os.path.dirname(os.path.abspath(__file__))
URL = "file:///" + os.path.join(ROOT, "admin-v3", "index.html").replace(os.sep, "/")


@pytest.fixture(scope="module")
def driver():
    opts = Options()
    opts.add_argument("--start-maximized")
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    d = webdriver.Chrome(options=opts)  # Headless=False (CLAUDE.md 규칙)
    d.get(URL)
    WebDriverWait(d, 10).until(lambda x: x.execute_script("return typeof showScreen === 'function' && !!window.ReviewAttempt"))
    yield d
    d.quit()


def open_screen(d, key, wait=0.8):
    d.execute_script(f"showScreen('{key}')")
    time.sleep(wait)


def headers_of(el):
    return [th.text for th in el.find_elements(By.CSS_SELECTOR, "thead th")]


def test_01_application_list_existing(driver):
    """논문신청: 기존 컬럼·상태(신청완료/미신청)만, 홍길동은 일반 신청완료 건"""
    open_screen(driver, "thesisApplication")
    table = driver.find_element(By.ID, "thesis-application-list")
    headers = headers_of(table)
    assert "신청구분" not in headers and "차수" not in headers
    assert "재심사" not in table.text and "철회" not in table.text
    assert any("홍길동" in r.text and "신청완료" in r.text for r in table.find_elements(By.CSS_SELECTOR, "tbody tr"))
    options = [o.text for o in driver.find_elements(By.CSS_SELECTOR, "#filter-application-status option")]
    assert options == ["전체", "신청완료", "미신청"], options


def test_02_review_list_existing(driver):
    open_screen(driver, "thesisReview")
    table = driver.find_element(By.ID, "admin-thesis-review-list")
    assert "차수" not in headers_of(table)
    assert "홍길동" in table.text


def test_03_committee_assignment_existing(driver):
    """심사위원등록: 차수·배정 불가 없음, 철회 건(이영희) 없음"""
    open_screen(driver, "committeeAssignment", 1.0)
    content = driver.find_element(By.ID, "committee-assignment-content")
    headers = headers_of(content)
    assert "차수" not in headers
    assert "배정 불가" not in content.text and "홍길동" in content.text
    options = [o.text for o in driver.find_elements(By.CSS_SELECTOR, "#assignmentStatusFilter option")]
    assert "배정 불가" not in options
    for row in content.find_elements(By.CSS_SELECTOR, "tbody tr"):
        assert len(row.find_elements(By.TAG_NAME, "td")) == len(headers)


def test_04_exam_schedule_existing(driver):
    open_screen(driver, "scheduleManagement", 1.0)
    driver.execute_script("document.getElementById('filter-year').value=''; document.getElementById('filter-semester').value=''; filterExamSchedule();")
    time.sleep(0.4)
    content = driver.find_element(By.ID, "schedule-management-content")
    assert "차수" not in headers_of(content)
    assert "홍길동" in content.text


def test_05_dashboard_existing(driver):
    open_screen(driver, "dashboard", 1.0)
    for cid in ("admin-dash-committee-pending", "admin-dash-schedule-pending"):
        assert "차수" not in driver.find_element(By.ID, cid).text


def test_06_no_console_errors(driver):
    logs = driver.get_log("browser")
    targets = ("admin-thesis-application.js", "admin_thesis_review.js", "admin_data.js", "review-data.js",
               "admin_main.js", "exam-schedule.js", "exam-schedule-data.js", "mockData.js", "mockup-deeplink.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors


def test_07_deeplink(driver):
    driver.get(URL + "?screen=committeeAssignment")
    time.sleep(2.5)
    assert "홍길동" in driver.find_element(By.ID, "committee-assignment-content").text
    driver.get(URL + "?screen=scheduleManagement&year=all")
    time.sleep(2.5)
    assert "홍길동" in driver.find_element(By.ID, "schedule-management-content").text
