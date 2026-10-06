"""
관리자 화면 - 재심사 목업 테스트 (2026-10-06)
기준: docs/재심사_제출취소_영향도분석_20261006.md 0장 (AD-1, AD-2)

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


def test_01_application_list_attempt_and_status(driver):
    """AD-1: 논문신청 관리 - 차수 컬럼, 철회 / 재심사 대상 상태, 필터 옵션"""
    driver.execute_script("showScreen('thesisApplication')")
    time.sleep(0.8)
    table = driver.find_element(By.ID, "thesis-application-list")
    headers = [th.text for th in table.find_elements(By.CSS_SELECTOR, "thead th")]
    assert "차수" in headers
    text = table.text
    assert "재심사 대상" in text and "철회" in text and "2차" in text

    options = [o.text for o in driver.find_elements(By.CSS_SELECTOR, "#filter-application-status option")]
    assert "철회" in options and "재심사 대상" in options


def test_02_review_list_attempt_and_result(driver):
    """AD-2: 학위논문 심사 조회 - 차수 컬럼, 1차 불합격 결과"""
    driver.execute_script("showScreen('thesisReview')")
    time.sleep(0.8)
    table = driver.find_element(By.ID, "admin-thesis-review-list")
    headers = [th.text for th in table.find_elements(By.CSS_SELECTOR, "thead th")]
    assert "차수" in headers
    rows = [r.text for r in table.find_elements(By.CSS_SELECTOR, "tbody tr") if "홍길동" in r.text]
    assert any("1차" in r and "불합격" in r for r in rows), rows
    assert any("2차" in r for r in rows), rows


def test_03_no_console_errors(driver):
    logs = driver.get_log("browser")
    targets = ("admin-thesis-application.js", "admin_thesis_review.js", "admin_data.js", "review-data.js")
    errors = [l["message"] for l in logs if l["level"] == "SEVERE" and any(t in l["message"] for t in targets)]
    assert not errors, errors
