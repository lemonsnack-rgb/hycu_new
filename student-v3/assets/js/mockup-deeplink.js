/**
 * 목업 딥링크 (학생) — 2026-10-07
 * 기능정의서에서 특정 화면·시나리오를 바로 열기 위한 목업 전용 기능
 *
 * 사용 예:
 *   student-dashboard.html?screen=thesis-application&scenario=retry-open
 *   student-dashboard.html?screen=thesis-submission&scenario=retry-open&history=prelim
 *   student-dashboard.html?screen=thesis-submission&scenario=conditional&form=final
 *
 * - screen   : showScreen 화면 키 (dashboard, thesis-application, thesis-submission, exam-schedule …)
 * - scenario : 시연 시나리오 키 (retry-open, retry-wait, not-started, in-progress, conditional)
 * - history  : 학위논문제출에서 해당 기본단계의 제출 기록 팝업 열기 (plan, prelim, final)
 * - form     : 학위논문제출에서 해당 기본단계의 최신 제출 폼 열기 (plan, prelim, final)
 * 롤백: 이 파일 삭제 + student-dashboard.html의 script 태그 제거
 */
(function () {
    function apply() {
        const params = new URLSearchParams(location.search);
        const screen = params.get('screen');
        const scenario = params.get('scenario');
        const history = params.get('history');
        const form = params.get('form');

        if (scenario && window.ReviewScenario && ReviewScenario.SCENARIOS.some(s => s.key === scenario)) {
            ReviewScenario.load(scenario);
        }
        if (screen && typeof window.showScreen === 'function') {
            window.showScreen(screen);
        }
        setTimeout(function () {
            if (history && typeof window.showStageHistoryModal === 'function') {
                window.showStageHistoryModal(history);
            }
            if (form && window.ReviewScenario && typeof window.submitThesis === 'function') {
                const latest = ReviewScenario.getLatest(form);
                if (latest) window.submitThesis(latest.id);
            }
        }, 300);
    }

    window.addEventListener('load', function () {
        setTimeout(apply, 300);
    });
})();
