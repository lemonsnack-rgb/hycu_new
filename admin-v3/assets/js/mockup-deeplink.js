/**
 * 목업 딥링크 (관리자) — 2026-10-07
 * 기능정의서에서 특정 화면을 바로 열기 위한 목업 전용 기능
 *
 * 사용 예:
 *   index.html?screen=thesisApplication
 *   index.html?screen=committeeAssignment
 *   index.html?screen=scheduleManagement&year=all
 *   index.html?screen=thesisReview&detail=RA_RETRY_002
 *
 * - screen : showScreen 화면 키 (dashboard, thesisApplication, committeeAssignment, scheduleManagement, thesisReview …)
 * - year=all : 심사일정현황 학년도·학기 필터를 '전체'로 (2026 시연 데이터 표시)
 * - detail : 학위논문심사 상세를 열 심사 ID
 * 롤백: 이 파일 삭제 + index.html의 script 태그 제거
 */
(function () {
    function apply() {
        const params = new URLSearchParams(location.search);
        const screen = params.get('screen');
        const detail = params.get('detail');
        const year = params.get('year');

        if (screen && typeof window.showScreen === 'function') {
            window.showScreen(screen);
        }
        setTimeout(function () {
            if (screen === 'scheduleManagement' && year === 'all' && typeof window.filterExamSchedule === 'function') {
                ['filter-year', 'filter-semester'].forEach(function (id) {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                window.filterExamSchedule();
            }
            if (detail && typeof window.openAdminReviewDetail === 'function') {
                window.openAdminReviewDetail(detail);
            }
        }, 800);
    }

    // 관리자 화면은 load 시 대시보드를 먼저 그리므로 그 뒤에 적용
    window.addEventListener('load', function () {
        setTimeout(apply, 600);
    });
})();
