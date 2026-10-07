/**
 * 목업 딥링크 (교수) — 2026-10-07
 * 기능정의서에서 특정 화면을 바로 열기 위한 목업 전용 기능
 *
 * 사용 예:
 *   professor-dashboard-proposal.html?screen=review
 *   professor-dashboard-proposal.html?screen=review&detail=RA_TEST_CHAIR&view=chair
 *   professor-dashboard-proposal.html?screen=exam-schedule&year=all
 *
 * - screen : showScreen 화면 키 (dashboard, review, exam-schedule …)
 * - detail : 학위논문심사 상세를 열 심사 ID, view: chair(위원장) | member(위원)
 * - year=all : 심사일정현황 학년도·학기 필터를 '전체'로 (2026 시연 데이터 표시)
 * 롤백: 이 파일 삭제 + professor-dashboard-proposal.html의 script 태그 제거
 */
(function () {
    function apply() {
        const params = new URLSearchParams(location.search);
        const screen = params.get('screen');
        const detail = params.get('detail');
        const view = params.get('view') === 'member' ? 'member' : 'chair';
        const year = params.get('year');

        if (screen && typeof window.showScreen === 'function') {
            window.showScreen(screen);
        }
        setTimeout(function () {
            if (screen === 'exam-schedule' && year === 'all' && typeof window.filterExamScheduleList === 'function') {
                ['exam-filter-year', 'exam-filter-semester'].forEach(function (id) {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                window.filterExamScheduleList();
            }
            if (detail && typeof window.openReviewDetail === 'function') {
                window.openReviewDetail(detail, view);
            }
        }, 500);
    }

    window.addEventListener('load', function () {
        setTimeout(apply, 300);
    });
})();
