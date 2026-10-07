"""
관리자 화면 - 재심사 목업 테스트 (2026-10-06 작성, 10-07 추가 범위 반영)
기준: docs/재심사_제출취소_영향도분석_20261006.md 0장 · 0-5 (V6 ~ V9)

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


def rows_of(el, name):
    return [r for r in el.find_elements(By.CSS_SELECTOR, "tbody tr") if name in r.text]


def test_01_application_list(driver):
    """V6: 논문신청 관리 - 신청구분(최초/재신청), 홍길동 재심사 대상·재신청, 철회"""
    open_screen(driver, "thesisApplication")
    table = driver.find_element(By.ID, "thesis-application-list")
    headers = headers_of(table)
    assert "신청구분" in headers and "차수" not in headers
    hong = [r.text for r in rows_of(table, "홍길동")]
    assert any("최초" in t and "재심사 대상" in t for t in hong), hong
    assert any("재신청" in t and "신청완료" in t for t in hong), hong
    assert "철회" in table.text
    # 김철수의 지도교수가 '홍길동'으로 나와 학생 홍길동과 혼동되지 않음
    assert all("홍길동" not in r.text for r in rows_of(table, "김철수"))

    options = [o.text for o in driver.find_elements(By.CSS_SELECTOR, "#filter-application-status option")]
    assert "철회" in options and "재심사 대상" in options


def test_02_review_list(driver):
    """학위논문 심사 조회 - 차수 컬럼, 1차 불합격"""
    open_screen(driver, "thesisReview")
    table = driver.find_element(By.ID, "admin-thesis-review-list")
    assert "차수" in headers_of(table)
    hong = [r.text for r in rows_of(table, "홍길동")]
    assert any("1차" in t and "불합격" in t for t in hong) and any("2차" in t for t in hong), hong


def test_03_committee_assignment(driver):
    """V7: 심사위원 배정 - 차수 컬럼, 홍길동 1차·2차, 철회 건 배정 불가(버튼 비활성)"""
    open_screen(driver, "committeeAssignment", 1.0)
    content = driver.find_element(By.ID, "committee-assignment-content")
    headers = headers_of(content)
    assert "차수" in headers
    hong = [r.text for r in rows_of(content, "홍길동")]
    assert any("1차" in t for t in hong) and any("2차" in t for t in hong), hong

    lee = [r.text for r in rows_of(content, "이영희") if "배정 불가" in r.text]
    assert lee and "박사" in lee[0], lee
    blocked = [r for r in rows_of(content, "배정 불가")]
    assert blocked, "배정 불가 행 없음"
    btn = blocked[0].find_element(By.XPATH, ".//button[normalize-space()='배정']")
    assert btn.get_attribute("disabled") is not None
    for row in content.find_elements(By.CSS_SELECTOR, "tbody tr"):
        assert len(row.find_elements(By.TAG_NAME, "td")) == len(headers)


def test_04_exam_schedule(driver):
    """V8: 심사일정 - 차수 컬럼, 홍길동 1차 등록 완료 · 2차 미등록"""
    open_screen(driver, "scheduleManagement", 1.0)
    # 학년도·학기 기본값이 2025·1학기라 2026학년도 시연 데이터를 보려면 '전체' 선택
    driver.execute_script("document.getElementById('filter-year').value=''; document.getElementById('filter-semester').value=''; filterExamSchedule();")
    time.sleep(0.4)
    content = driver.find_element(By.ID, "schedule-management-content")
    headers = headers_of(content)
    assert "차수" in headers
    hong = [r for r in rows_of(content, "홍길동")]
    texts = [r.text for r in hong]
    assert any("1차" in t and "등록 완료" in t for t in texts), texts
    assert any("2차" in t and "미등록" in t for t in texts), texts
    for row in hong:
        assert len(row.find_elements(By.TAG_NAME, "td")) == len(headers)


def test_05_dashboard_attempt(driver):
    """V9: 대시보드 - 심사위원 등록 대기 · 심사일정 확정 대기 표에 차수, 홍길동 2차 일정 대기"""
    open_screen(driver, "dashboard", 1.0)
    committee = driver.find_element(By.ID, "admin-dash-committee-pending")
    schedule = driver.find_element(By.ID, "admin-dash-schedule-pending")
    assert "차수" in committee.text or "대기 건이 없습니다" in committee.text
    assert "차수" in schedule.text
    assert any("2차" in r.text for r in rows_of(schedule, "홍길동"))


def test_06_no_console_errors(driver):
    logs = driver.get_log("browser")
    targets = ("admin-thesis-application.js", "admin_thesis_review.js", "admin_data.js", "review-data.js",
               "admin_main.js", "exam-schedule.js", "exam-schedule-data.js", "mockData.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors


def test_07_deeplink(driver):
    """목업 딥링크: 심사위원등록 · 심사일정(전체) 화면 바로 열기"""
    driver.get(URL + "?screen=committeeAssignment")
    time.sleep(2.5)
    assert "배정 불가" in driver.find_element(By.ID, "committee-assignment-content").text
    driver.get(URL + "?screen=scheduleManagement&year=all")
    time.sleep(2.5)
    assert "홍길동" in driver.find_element(By.ID, "schedule-management-content").text
