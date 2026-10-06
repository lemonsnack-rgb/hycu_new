/**
 * 재심사 · 제출취소 목업 시나리오 (학생 화면 전용)
 * 2026-10-06 — docs/재심사_제출취소_영향도분석_20261006.md 0장 기준
 *
 * - 단계별 심사신청(thesis-application.js)과 단계별 심사자료제출(thesis-submission.js)이
 *   같은 시나리오 상태를 공유함 (페이지 내 메모리, 새로고침 시 초기화)
 * - 차수(attemptNumber): 불합격 시에만 증가 (다음 학기 심사신청부터 재진행)
 * - 재심(retryNo): 조건부합격 시 같은 차수 안에서 증가 (당해 학기, 심사신청 불필요)
 * - 롤백: 이 파일 삭제 + student-dashboard.html의 script 태그 제거
 */
(function () {
    const ADVISOR = '김교수';
    const TITLE = 'AI 기반 추천 시스템의 개인화 성능 개선 연구';

    // 기본단계 정의
    const STAGE_DEFS = [
        { id: 'plan', name: '논문작성계획서', subStageName: '계획서 제출', order: 1 },
        { id: 'prelim', name: '예비심사', subStageName: '예비심사 논문 제출', order: 2 },
        { id: 'final', name: '본심사', subStageName: '본심사 논문 제출', order: 3 }
    ];

    // 신청/철회 기간 (Mock)
    const PERIOD_OPEN = {
        semester: '2026-2학기',
        application: { start: '2026-09-01', end: '2026-10-31' },
        withdrawal: { start: '2026-09-01', end: '2026-10-20' }
    };
    const PERIOD_NEXT = {
        semester: '2027-1학기',
        application: { start: '2027-03-02', end: '2027-03-31' },
        withdrawal: { start: '2027-03-02', end: '2027-03-20' }
    };

    const SCENARIOS = [
        { key: 'retry-open', label: '① 재신청 가능', desc: '예비심사 1차 불합격 → 신청기간이 열려 2차 신청 가능' },
        { key: 'retry-wait', label: '② 다음 학기 대기', desc: '예비심사 1차 불합격 → 신청기간이 아니어서 다음 학기 신청 대기' },
        { key: 'not-started', label: '③ 심사 미진행', desc: '예비심사 2차 신청·제출 완료, 평가한 심사위원 없음 → 철회·제출취소 가능' },
        { key: 'in-progress', label: '④ 심사 진행 중', desc: '예비심사 2차 신청·제출 완료, 심사위원 1명 평가 완료 → 철회·제출취소 불가' },
        { key: 'conditional', label: '⑤ 조건부 재심', desc: '본심사 1차 조건부합격 → 신청 없이 같은 학기에 재심 자료 제출' }
    ];

    let seq = 1;

    function fileInfo(name, sizeMb) {
        return { name: name, size: Math.round(sizeMb * 1024 * 1024) };
    }

    function submitted(fileName, submittedAt, otherFileName) {
        const main = fileInfo(fileName, 2.4);
        const other = otherFileName ? fileInfo(otherFileName, 0.8) : null;
        return {
            title: TITLE,
            thesisFile: main.name,
            thesisFileSize: main.size,
            otherFile: other ? other.name : null,
            otherFileSize: other ? other.size : 0,
            submittedAt: submittedAt
        };
    }

    // 제출(심사) 기록 1건 — 기존 thesis-submission.js 필드명과 호환
    function record(stageId, opts) {
        const def = STAGE_DEFS.find(s => s.id === stageId);
        return Object.assign({
            id: seq++,
            stage: stageId,
            stageName: def.name,
            basicStageName: def.name,
            subStageName: def.subStageName,
            attemptNumber: 1,
            retryNo: 0,
            semester: '2026-1학기',
            advisorName: ADVISOR,
            submissionPeriod: { start: '2026-04-01', end: '2026-04-30' },
            status: 'not_submitted',      // not_submitted | submitted | resubmit(조건부 재심 제출 대기)
            reviewResult: null,           // pass | fail | conditional | null
            submittedData: null,
            reviewComments: '',
            decidedAt: null,
            evaluatedCount: 0,            // 평가를 저장한 심사위원 수 (0이면 심사 미진행)
            totalReviewers: 3,
            evaluationFormRegistered: true
        }, opts);
    }

    function application(stageId, attemptNumber, appliedAt, semester) {
        return { id: 'APP-' + stageId + '-' + attemptNumber, stageId, attemptNumber, status: 'submitted', appliedAt, semester };
    }

    // 논문작성계획서 1차 합격 (모든 시나리오 공통)
    function planPassed() {
        return record('plan', {
            semester: '2025-2학기',
            submissionPeriod: { start: '2025-10-01', end: '2025-10-31' },
            status: 'submitted',
            reviewResult: 'pass',
            submittedData: submitted('plan_v1.pdf', '2025-10-15 14:30'),
            reviewComments: '연구 주제와 범위가 명확하며 계획서 구성이 체계적임. 예비심사 진행을 승인함.',
            decidedAt: '2025-11-20',
            evaluatedCount: 3
        });
    }

    // 예비심사 1차 불합격 (2026-1학기)
    function prelimFailed() {
        return record('prelim', {
            semester: '2026-1학기',
            status: 'submitted',
            reviewResult: 'fail',
            submittedData: submitted('prelim_v1.pdf', '2026-04-20 10:12', 'prelim_v1_appendix.pdf'),
            reviewComments: '연구 방법론이 연구 문제를 검증하기에 부족하고, 실험 데이터의 신뢰성 근거가 제시되지 않음. 데이터 수집 설계를 전면 보완한 후 다음 학기에 재심사를 받기 바람.',
            decidedAt: '2026-06-12',
            evaluatedCount: 3
        });
    }

    function buildScenario(key) {
        seq = 1;
        const stages = STAGE_DEFS.map(def => ({
            ...def,
            semester: PERIOD_OPEN.semester,
            applicationPeriod: { ...PERIOD_OPEN.application },
            withdrawalPeriod: { ...PERIOD_OPEN.withdrawal },
            applicationOpen: true,
            applications: []
        }));
        const stage = id => stages.find(s => s.id === id);
        const submissions = [];

        // 공통: 계획서 1차 합격
        stage('plan').applications.push(application('plan', 1, '2025-09-05', '2025-2학기'));
        submissions.push(planPassed());

        if (key === 'retry-open' || key === 'retry-wait') {
            stage('prelim').applications.push(application('prelim', 1, '2026-03-05', '2026-1학기'));
            submissions.push(prelimFailed());
            if (key === 'retry-wait') {
                const s = stage('prelim');
                s.semester = PERIOD_NEXT.semester;
                s.applicationPeriod = { ...PERIOD_NEXT.application };
                s.withdrawalPeriod = { ...PERIOD_NEXT.withdrawal };
                s.applicationOpen = false;
            }
        } else if (key === 'not-started' || key === 'in-progress') {
            stage('prelim').applications.push(application('prelim', 1, '2026-03-05', '2026-1학기'));
            stage('prelim').applications.push(application('prelim', 2, '2026-09-03', '2026-2학기'));
            submissions.push(prelimFailed());
            submissions.push(record('prelim', {
                attemptNumber: 2,
                semester: '2026-2학기',
                submissionPeriod: { start: '2026-09-15', end: '2026-10-15' },
                status: 'submitted',
                submittedData: submitted('prelim_v2.pdf', '2026-09-28 16:40', 'prelim_v2_appendix.pdf'),
                evaluatedCount: key === 'in-progress' ? 1 : 0
            }));
        } else if (key === 'conditional') {
            stage('prelim').applications.push(application('prelim', 1, '2026-03-05', '2026-1학기'));
            submissions.push(record('prelim', {
                semester: '2026-1학기',
                status: 'submitted',
                reviewResult: 'pass',
                submittedData: submitted('prelim_v1.pdf', '2026-04-20 10:12'),
                reviewComments: '연구 설계가 타당하며 본심사 진행을 승인함.',
                decidedAt: '2026-06-12',
                evaluatedCount: 3
            }));
            stage('final').applications.push(application('final', 1, '2026-09-03', '2026-2학기'));
            const first = record('final', {
                semester: '2026-2학기',
                submissionPeriod: { start: '2026-09-15', end: '2026-10-15' },
                status: 'submitted',
                reviewResult: 'conditional',
                submittedData: submitted('final_v1.pdf', '2026-09-20 11:05', 'final_v1_data.pdf'),
                reviewComments: '결론의 일반화 근거가 부족함. 5장 분석 결과를 보완하여 재심 자료를 제출할 것. (재심 위원: 정교수)',
                decidedAt: '2026-10-01',
                evaluatedCount: 3
            });
            submissions.push(first);
            submissions.push(record('final', {
                semester: '2026-2학기',
                retryNo: 1,
                submissionPeriod: { start: '2026-10-02', end: '2026-10-31' },
                status: 'resubmit',
                originalSubmission: { ...first.submittedData, reviewResult: 'conditional', reviewComments: first.reviewComments },
                resubmission: { required: true, retryNo: 1, status: 'pending', reviewerType: 'single', reviewerName: '정교수' },
                totalReviewers: 1
            }));
        }

        return { key, stages, submissions };
    }

    let state = null;

    function nowText() {
        const d = new Date();
        const p = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    }

    const ReviewScenario = {
        SCENARIOS,

        load(key) {
            state = buildScenario(key);
            return state;
        },

        getState() {
            if (!state) this.load(SCENARIOS[0].key);
            return state;
        },

        getStages() {
            return this.getState().stages;
        },

        getStage(stageId) {
            return this.getStages().find(s => s.id === stageId);
        },

        // 단계의 전체 기록 (차수 → 재심 순)
        getRecords(stageId) {
            return this.getState().submissions
                .filter(r => r.stage === stageId)
                .sort((a, b) => a.attemptNumber - b.attemptNumber || a.retryNo - b.retryNo);
        },

        getLatest(stageId) {
            const records = this.getRecords(stageId);
            return records[records.length - 1] || null;
        },

        getRecordById(id) {
            return this.getState().submissions.find(r => r.id === id) || null;
        },

        attemptLabel(rec) {
            if (!rec) return '-';
            return `${rec.attemptNumber}차` + (rec.retryNo ? ` 재심${rec.retryNo}` : '');
        },

        resultText(result) {
            return { pass: '합격', fail: '불합격', conditional: '조건부합격' }[result] || '-';
        },

        resultColor(result) {
            return { pass: 'text-green-700', fail: 'text-red-700', conditional: 'text-yellow-700' }[result] || 'text-gray-600';
        },

        // 현재 차수의 신청 (철회되지 않은 마지막 신청)
        getCurrentApplication(stageId) {
            const apps = this.getStage(stageId).applications.filter(a => a.status === 'submitted');
            return apps[apps.length - 1] || null;
        },

        isStagePassed(stageId) {
            const latest = this.getLatest(stageId);
            return !!(latest && latest.reviewResult === 'pass');
        },

        /**
         * 심사신청 화면용 단계 상태
         * code: passed | conditional | reviewing | applied | retry | locked | none
         */
        getStageStatus(stageId) {
            const stage = this.getStage(stageId);
            const latest = this.getLatest(stageId);
            const app = this.getCurrentApplication(stageId);

            if (latest && latest.reviewResult === 'pass') {
                return { code: 'passed', label: '합격', attempt: latest.attemptNumber };
            }

            if (app && !(latest && latest.attemptNumber === app.attemptNumber && latest.reviewResult === 'fail')) {
                const attemptRecords = this.getRecords(stageId).filter(r => r.attemptNumber === app.attemptNumber);
                if (attemptRecords.some(r => r.reviewResult === 'conditional')) {
                    return { code: 'conditional', label: '조건부합격(재심)', attempt: app.attemptNumber };
                }
                const evaluated = attemptRecords.some(r => r.evaluatedCount > 0);
                return evaluated
                    ? { code: 'reviewing', label: '심사중', attempt: app.attemptNumber }
                    : { code: 'applied', label: '신청완료', attempt: app.attemptNumber };
            }

            if (latest && latest.reviewResult === 'fail') {
                return { code: 'retry', label: '재심사 대상', attempt: latest.attemptNumber + 1, failedAttempt: latest.attemptNumber };
            }

            const prev = this.getStages().find(s => s.order === stage.order - 1);
            if (prev && !this.isStagePassed(prev.id)) {
                return { code: 'locked', label: '선행단계 미완료', attempt: null };
            }

            return { code: 'none', label: '미신청', attempt: 1 };
        },

        // 심사신청 (신규 또는 N차 재신청) → 해당 차수 제출 기록 생성
        apply(stageId, title) {
            const stage = this.getStage(stageId);
            const status = this.getStageStatus(stageId);
            const attemptNumber = status.attempt || 1;
            stage.applications.push(application(stageId, attemptNumber, nowText().slice(0, 10), stage.semester));
            const rec = record(stageId, {
                id: Math.max(0, ...this.getState().submissions.map(r => r.id)) + 1,
                attemptNumber,
                semester: stage.semester,
                submissionPeriod: { start: '2026-09-15', end: '2026-10-31' }
            });
            if (title) rec.pendingTitle = title;
            this.getState().submissions.push(rec);
            return attemptNumber;
        },

        // 철회 가능 여부: 결과 확정 전 + 평가한 심사위원 0명
        checkWithdraw(stageId) {
            const app = this.getCurrentApplication(stageId);
            if (!app) return { ok: false, reason: '철회할 신청 내역이 없습니다.' };
            const attemptRecords = this.getRecords(stageId).filter(r => r.attemptNumber === app.attemptNumber);
            if (attemptRecords.some(r => r.reviewResult)) {
                return { ok: false, reason: '심사 결과가 확정된 단계는 철회할 수 없습니다.' };
            }
            if (attemptRecords.some(r => r.evaluatedCount > 0)) {
                return { ok: false, reason: '심사가 진행중이므로 철회할 수 없습니다.' };
            }
            return { ok: true };
        },

        // 철회: 신청을 '철회' 상태로 기록, 결과 미확정 제출 기록 삭제 (결과 확정 기록은 보존)
        withdraw(stageId) {
            const app = this.getCurrentApplication(stageId);
            if (!app) return;
            app.status = 'withdrawn';
            app.withdrawnAt = nowText();
            const s = this.getState();
            s.submissions = s.submissions.filter(r =>
                !(r.stage === stageId && r.attemptNumber === app.attemptNumber && !r.reviewResult)
            );
        },

        // 제출취소 가능 여부: 제출완료 + 결과 미확정 + 평가한 심사위원 0명 (기간 조건은 정책 미정으로 제외)
        checkCancelSubmission(rec) {
            if (!rec || rec.status !== 'submitted') return { ok: false, reason: '제출한 자료가 없습니다.' };
            if (rec.reviewResult) return { ok: false, reason: '심사 결과가 확정되어 제출을 취소할 수 없습니다.' };
            if (rec.evaluatedCount > 0) return { ok: false, reason: '심사가 진행 중이어서 제출을 취소할 수 없습니다.' };
            return { ok: true };
        },

        cancelSubmission(id) {
            const rec = this.getRecordById(id);
            if (!this.checkCancelSubmission(rec).ok) return false;
            rec.status = rec.retryNo > 0 ? 'resubmit' : 'not_submitted';
            if (rec.resubmission) rec.resubmission.status = 'pending';
            rec.submittedData = null;
            return true;
        },

        /**
         * 목업 전용 시나리오 선택 바
         * @param {string} rerenderFn - 선택 변경 후 호출할 전역 함수명
         */
        renderBar(rerenderFn) {
            const current = this.getState().key;
            const info = SCENARIOS.find(s => s.key === current);
            return `
                <div class="mb-4 flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-amber-400 bg-amber-50">
                    <span class="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500 text-white">목업 시연</span>
                    <label class="text-sm font-medium text-gray-700">시나리오</label>
                    <select class="review-scenario-select px-2 border border-gray-300 rounded text-sm bg-white"
                            onchange="ReviewScenario.load(this.value); ${rerenderFn}();"
                            style="height: 32px;">
                        ${SCENARIOS.map(s => `<option value="${s.key}" ${s.key === current ? 'selected' : ''}>${s.label}</option>`).join('')}
                    </select>
                    <button type="button"
                            onclick="ReviewScenario.load('${current}'); ${rerenderFn}();"
                            class="review-scenario-reset px-2 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50" style="height: 32px;">초기화</button>
                    <span class="text-xs text-gray-600">${info ? info.desc : ''}</span>
                </div>
            `;
        }
    };

    window.ReviewScenario = ReviewScenario;
    console.log('✅ review-scenario-data.js 로드 완료');
})();
