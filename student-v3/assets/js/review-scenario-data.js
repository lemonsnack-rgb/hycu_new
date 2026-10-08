/**
 * 재심사 · 신청철회 목업 시나리오 (학생 화면 전용)
 * 2026-10-06 작성 / 2026-10-07 재정비 / 2026-10-08 시나리오 MECE 정리 · 재심사 1안/2안 · 신청 철회와 제출취소 분리
 *   (신청상태는 기존 '미신청/신청완료'만 — 재심사도 일반 심사와 동일하게 취급)
 *
 * - 단계별 심사신청(thesis-application.js)과 단계별 심사자료제출(thesis-submission.js)이
 *   같은 시나리오 상태를 공유함 (페이지 내 메모리, 새로고침 시 초기화)
 * - 제출 번호(attemptNumber): 기본단계 안에서 제출(심사)할 때마다 1씩 증가 — 'N차 제출'
 *   · 조건부합격: 같은 신청 안에서 보완 자료를 다음 번호로 제출 (심사신청 불필요)
 *   · 불합격 1안: 신청 유지, 다음 학기 제출기간에 다음 번호로 제출
 *   · 불합격 2안: 신청만 리셋(미신청), 다음 학기에 다시 신청 → 다음 번호로 제출 (심사 내역 보존)
 * - 신청 철회(신청 + 그 신청의 제출 삭제)와 제출취소(해당 차수 제출만 삭제, 신청 유지)는 별개
 *   → 통과·판정된 이전 차수 기록은 남기고, 진행 중인 차수만 되돌림
 * - 롤백: 이 파일 삭제 + student-dashboard.html의 script 태그 제거
 */
(function () {
    const ADVISOR = '박교수';
    const TITLE = 'AI 기반 추천 시스템의 개인화 성능 개선 연구';

    // 기본단계 정의
    const STAGE_DEFS = [
        { id: 'plan', name: '논문작성계획서', subStageName: '계획서 제출', order: 1 },
        { id: 'prelim', name: '예비심사', subStageName: '예비심사 논문 제출', order: 2 },
        { id: 'final', name: '본심사', subStageName: '본심사 논문 제출', order: 3 }
    ];

    // 신청/철회 기간 (Mock) — 현재 학기
    const PERIOD_OPEN = {
        semester: '2026-2학기',
        application: { start: '2026-09-01', end: '2026-12-31' },
        withdrawal: { start: '2026-09-01', end: '2026-12-31' }
    };
    const CURRENT_SUBMISSION_PERIOD = { start: '2026-09-15', end: '2026-12-31' };

    // 재심사(불합격 후) 처리 안 — 고객사 선택용
    const PLANS = [
        { key: '1', label: '1안 — 신청 유지', desc: '불합격 후 신청은 그대로, 다음 학기 제출기간에 다음 차수 제출' },
        { key: '2', label: '2안 — 신청 다시', desc: '불합격 후 신청만 리셋(미신청), 다음 학기에 다시 신청 후 제출 (심사 내역 보존)' }
    ];

    // 시나리오: 예비심사 심사 건의 상태 1개씩 (상태 S1·S2·S3·S6·S7·S5)
    // 공통 배경: 논문작성계획서 합격(S4), 본심사 미신청(S0)
    const SCENARIOS = [
        { key: 'applied', label: '① 신청 후 미제출', desc: '예비심사 신청, 아직 제출 안 함 → 신청 철회 가능' },
        { key: 'submitted', label: '② 제출 완료·심사 전', desc: '예비심사 제출 완료, 심사 내역 없음 → 제출취소 가능(신청 유지), 신청 철회 시 제출 내역 삭제 안내' },
        { key: 'reviewing', label: '③ 심사 내역 저장됨', desc: '예비심사 제출 완료, 심사위원 1명 평가 저장(임시저장 포함) → 심사중: 제출취소·신청 철회 불가' },
        { key: 'fail-same', label: '④ 불합격·같은 학기', desc: '이번 학기 예비심사 불합격 → 1안: 다음 학기에 제출 / 2안: 다음 학기에 신청', byPlan: true },
        { key: 'fail-next', label: '⑤ 불합격·다음 학기', desc: '지난 학기 예비심사 불합격 → 1안: 2차 제출 / 2안: 다시 신청 후 2차 제출', byPlan: true },
        { key: 'conditional', label: '⑥ 조건부합격 후 보완', desc: '본심사 1차 조건부합격 → 신청 없이 2차 보완 제출, 신청 철회 불가' }
    ];
    // 이전 딥링크 키 호환
    const KEY_ALIAS = { 'retry-open': 'fail-next', 'not-started': 'submitted', 'in-progress': 'reviewing' };

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
            attemptNumber: 1,             // 제출 번호 (N차 제출)
            applicationId: null,          // 어느 심사신청에 속한 제출인지
            semester: '2026-1학기',
            advisorName: ADVISOR,
            submissionPeriod: { start: '2026-04-01', end: '2026-04-30' },
            status: 'not_submitted',      // not_submitted | submitted
            reviewResult: null,           // pass | fail | conditional | null
            submittedData: null,
            reviewComments: '',
            decidedAt: null,
            evaluatedCount: 0,            // 평가를 저장한 심사위원 수 (임시저장 포함, 0이면 심사 내역 없음)
            totalReviewers: 3,
            evaluationFormRegistered: true
        }, opts);
    }

    function application(stageId, no, appliedAt, semester, titleEn) {
        return { id: 'APP-' + stageId + '-' + no, stageId, no, status: 'submitted', appliedAt, semester,
                 thesisTitle: TITLE, thesisTitleEn: titleEn || 'Improving Personalization Performance of AI-based Recommender Systems' };
    }

    // 논문작성계획서 합격 (모든 시나리오 공통)
    function planPassed() {
        return record('plan', {
            applicationId: 'APP-plan-1',
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

    // 예비심사 1차 제출 불합격 (semester 학기)
    function prelimFailed(semester) {
        const thisSemester = semester === PERIOD_OPEN.semester;
        return record('prelim', {
            applicationId: 'APP-prelim-1',
            semester: semester,
            submissionPeriod: thisSemester ? { ...CURRENT_SUBMISSION_PERIOD } : { start: '2026-04-01', end: '2026-04-30' },
            status: 'submitted',
            reviewResult: 'fail',
            submittedData: submitted('prelim_v1.pdf', thisSemester ? '2026-09-20 10:12' : '2026-04-20 10:12', 'prelim_v1_appendix.pdf'),
            reviewComments: '연구 방법론이 연구 문제를 검증하기에 부족하고, 실험 데이터의 신뢰성 근거가 제시되지 않음. 데이터 수집 설계를 전면 보완한 후 다음 학기에 재심사를 받기 바람.',
            decidedAt: thisSemester ? '2026-10-01' : '2026-06-12',
            evaluatedCount: 3
        });
    }

    function buildScenario(key, plan) {
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

        // 공통: 계획서 합격
        stage('plan').applications.push(application('plan', 1, '2025-09-05', '2025-2학기'));
        submissions.push(planPassed());

        if (key === 'applied' || key === 'submitted' || key === 'reviewing') {
            // 예비심사 1차 신청 (이번 학기)
            stage('prelim').applications.push(application('prelim', 1, '2026-09-03', PERIOD_OPEN.semester));
            const opts = {
                applicationId: 'APP-prelim-1',
                semester: PERIOD_OPEN.semester,
                submissionPeriod: { ...CURRENT_SUBMISSION_PERIOD }
            };
            if (key !== 'applied') {
                Object.assign(opts, {
                    status: 'submitted',
                    submittedData: submitted('prelim_v1.pdf', '2026-09-28 16:40', 'prelim_v1_appendix.pdf'),
                    evaluatedCount: key === 'reviewing' ? 1 : 0
                });
            }
            submissions.push(record('prelim', opts));
        } else if (key === 'fail-same' || key === 'fail-next') {
            const failSemester = key === 'fail-same' ? PERIOD_OPEN.semester : '2026-1학기';
            stage('prelim').applications.push(application('prelim', 1, key === 'fail-same' ? '2026-09-03' : '2026-03-05', failSemester));
            submissions.push(prelimFailed(failSemester));
            if (plan === '1') {
                // 1안: 신청 유지, 같은 신청 안에 다음 차수 제출 생성 (다음 학기 제출기간에 제출)
                submissions.push(record('prelim', {
                    applicationId: 'APP-prelim-1',
                    attemptNumber: 2,
                    semester: PERIOD_OPEN.semester,
                    submissionPeriod: { ...CURRENT_SUBMISSION_PERIOD }
                }));
            }
        } else if (key === 'conditional') {
            stage('prelim').applications.push(application('prelim', 1, '2026-03-05', '2026-1학기'));
            submissions.push(record('prelim', {
                applicationId: 'APP-prelim-1',
                semester: '2026-1학기',
                status: 'submitted',
                reviewResult: 'pass',
                submittedData: submitted('prelim_v1.pdf', '2026-04-20 10:12'),
                reviewComments: '연구 설계가 타당하며 본심사 진행을 승인함.',
                decidedAt: '2026-06-12',
                evaluatedCount: 3
            }));
            stage('final').applications.push(application('final', 1, '2026-09-03', PERIOD_OPEN.semester));
            submissions.push(record('final', {
                applicationId: 'APP-final-1',
                semester: PERIOD_OPEN.semester,
                submissionPeriod: { ...CURRENT_SUBMISSION_PERIOD },
                status: 'submitted',
                reviewResult: 'conditional',
                submittedData: submitted('final_v1.pdf', '2026-09-20 11:05', 'final_v1_data.pdf'),
                reviewComments: '결론의 일반화 근거가 부족함. 5장 분석 결과를 보완하여 다시 제출할 것.',
                decidedAt: '2026-10-01',
                evaluatedCount: 3
            }));
            // 조건부합격 → 같은 신청 안에서 다음 번호 제출 (심사신청 불필요)
            submissions.push(record('final', {
                applicationId: 'APP-final-1',
                attemptNumber: 2,
                semester: PERIOD_OPEN.semester,
                submissionPeriod: { start: '2026-10-02', end: '2026-12-31' },
                totalReviewers: 2
            }));
        }

        return { key, plan, stages, submissions };
    }

    let state = null;

    function nowText() {
        const d = new Date();
        const p = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    }

    const ReviewScenario = {
        SCENARIOS,
        PLANS,

        resolveKey(key) {
            return KEY_ALIAS[key] || key;
        },

        // key: 시나리오, plan: 재심사 안('1' | '2', 생략 시 현재 안 유지)
        load(key, plan) {
            const nextPlan = plan || (state && state.plan) || '1';
            state = buildScenario(this.resolveKey(key), nextPlan);
            return state;
        },

        getState() {
            if (!state) this.load(SCENARIOS[0].key);
            return state;
        },

        getPlan() {
            return this.getState().plan;
        },

        getStages() {
            return this.getState().stages;
        },

        getStage(stageId) {
            return this.getStages().find(s => s.id === stageId);
        },

        // 단계의 전체 제출 기록 (제출 번호 순)
        getRecords(stageId) {
            return this.getState().submissions
                .filter(r => r.stage === stageId)
                .sort((a, b) => a.attemptNumber - b.attemptNumber);
        },

        getLatest(stageId) {
            const records = this.getRecords(stageId);
            return records[records.length - 1] || null;
        },

        getRecordById(id) {
            return this.getState().submissions.find(r => r.id === id) || null;
        },

        // 현재 유효한 신청 (철회되지 않은 마지막 신청)
        getCurrentApplication(stageId) {
            const apps = this.getStage(stageId).applications.filter(a => a.status === 'submitted');
            return apps[apps.length - 1] || null;
        },

        getApplicationRecords(app) {
            return app ? this.getState().submissions.filter(r => r.applicationId === app.id) : [];
        },

        /**
         * 논문신청 화면용 신청상태 (기존 '미신청/신청완료'만 — 재심사도 일반 심사와 동일)
         * 불합격 확정 시: 1안은 신청 유지(신청완료), 2안은 신청만 리셋(미신청)
         */
        getStageStatus(stageId) {
            const latest = this.getLatest(stageId);
            if (latest && latest.reviewResult === 'fail' && this.getPlan() === '2') {
                return { code: 'none', label: '미신청' };
            }
            return this.getCurrentApplication(stageId)
                ? { code: 'applied', label: '신청완료' }
                : { code: 'none', label: '미신청' };
        },

        // 오늘이 기간 안인지 (철회기간·제출기간 판단)
        isWithinPeriod(period) {
            if (!period) return false;
            const today = nowText().slice(0, 10);
            return period.start <= today && today <= period.end;
        },

        // 같은 단계에서 불합격 처리된 학기가 현재 학기인지
        failedThisSemester(stageId) {
            const stage = this.getStage(stageId);
            return this.getRecords(stageId).some(r => r.reviewResult === 'fail' && stage && r.semester === stage.semester);
        },

        // 신청 가능 여부 (2안): 불합격 처리된 학기에는 같은 단계를 다시 신청할 수 없음 (다음 학기에 다시 신청)
        checkApply(stageId) {
            if (this.failedThisSemester(stageId)) {
                return { ok: false, reason: '불합격 처리된 단계는 다음 학기에 다시 신청할 수 있습니다.' };
            }
            return { ok: true };
        },

        // 제출 가능 여부 (1안): 불합격 처리된 학기에는 다음 차수를 제출할 수 없음 (다음 학기 제출기간에 제출)
        checkSubmit(recordId) {
            const rec = this.getRecordById(recordId);
            if (rec && rec.status !== 'submitted' && this.failedThisSemester(rec.stage)) {
                return { ok: false, reason: '불합격 처리된 단계는 다음 학기 제출기간에 제출할 수 있습니다.' };
            }
            return { ok: true };
        },

        // 심사신청 (최초 또는 재신청) → 다음 번호의 제출 기록 생성
        apply(stageId, title, titleEn) {
            const stage = this.getStage(stageId);
            const records = this.getRecords(stageId);
            const app = application(stageId, stage.applications.length + 1, nowText().slice(0, 10), stage.semester, titleEn);
            if (title) app.thesisTitle = title;
            stage.applications.push(app);
            const rec = record(stageId, {
                id: Math.max(0, ...this.getState().submissions.map(r => r.id)) + 1,
                applicationId: app.id,
                attemptNumber: records.length ? records[records.length - 1].attemptNumber + 1 : 1,
                semester: stage.semester,
                submissionPeriod: { ...CURRENT_SUBMISSION_PERIOD }
            });
            this.getState().submissions.push(rec);
            return rec.attemptNumber;
        },

        // 신청 철회 가능 여부: 같은 신청 안에 심사 내역(평가 저장 1건 이상, 임시저장 포함) 또는 결과가 있으면 불가 — 요구서 문구
        checkWithdraw(stageId) {
            const app = this.getCurrentApplication(stageId);
            const appRecords = this.getApplicationRecords(app);
            if (appRecords.some(r => r.reviewResult || r.evaluatedCount > 0)) {
                return { ok: false, reason: '심사가 진행중이므로 철회할 수 없습니다.' };
            }
            return { ok: true };
        },

        // 신청 철회 시 함께 삭제될 제출 내역이 있는지
        hasSubmission(stageId) {
            const app = this.getCurrentApplication(stageId);
            return this.getApplicationRecords(app).some(r => r.status === 'submitted');
        },

        // 제출취소 가능 여부: 해당 차수(세부단계) 제출에 심사 내역(평가 저장 1건 이상, 임시저장 포함)이 있으면 심사중으로 보고 불가
        checkCancelSubmission(recordId) {
            const rec = this.getRecordById(recordId);
            if (!rec || rec.status !== 'submitted' || rec.reviewResult || rec.evaluatedCount > 0) {
                return { ok: false, reason: '심사가 진행 중이어서 제출을 취소할 수 없습니다.' };
            }
            return { ok: true };
        },

        // 제출취소: 해당 차수 제출 내역만 삭제 → 미제출 (신청과 이전 차수 기록은 유지)
        cancelSubmission(recordId) {
            const rec = this.getRecordById(recordId);
            if (!rec) return;
            rec.status = 'not_submitted';
            rec.submittedData = null;
        },

        // 신청 철회: 신청과 해당 신청의 제출 자료 삭제 → 미신청 (이전 신청의 심사 기록은 보존)
        withdraw(stageId) {
            const app = this.getCurrentApplication(stageId);
            if (!app) return;
            const stage = this.getStage(stageId);
            stage.applications = stage.applications.filter(a => a !== app);
            const s = this.getState();
            s.submissions = s.submissions.filter(r => r.applicationId !== app.id);
        },

        /**
         * 목업 전용 시연 바 (시나리오 + 재심사 안)
         * @param {string} rerenderFn - 선택 변경 후 호출할 전역 함수명
         */
        renderBar(rerenderFn) {
            const current = this.getState().key;
            const plan = this.getPlan();
            const info = SCENARIOS.find(s => s.key === current);
            const planInfo = PLANS.find(p => p.key === plan);
            return `
                <div class="mb-4 flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-amber-400 bg-amber-50">
                    <span class="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500 text-white">목업 시연</span>
                    <label class="text-sm font-medium text-gray-700">시나리오</label>
                    <select class="review-scenario-select px-2 border border-gray-300 rounded text-sm bg-white"
                            onchange="ReviewScenario.load(this.value); ${rerenderFn}();"
                            style="height: 32px;">
                        ${SCENARIOS.map(s => `<option value="${s.key}" ${s.key === current ? 'selected' : ''}>${s.label}</option>`).join('')}
                    </select>
                    <label class="text-sm font-medium text-gray-700">재심사 안</label>
                    <select class="review-plan-select px-2 border border-gray-300 rounded text-sm bg-white"
                            onchange="ReviewScenario.load('${current}', this.value); ${rerenderFn}();"
                            style="height: 32px;">
                        ${PLANS.map(p => `<option value="${p.key}" ${p.key === plan ? 'selected' : ''}>${p.label}</option>`).join('')}
                    </select>
                    <button type="button"
                            onclick="ReviewScenario.load('${current}'); ${rerenderFn}();"
                            class="review-scenario-reset px-2 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50" style="height: 32px;">초기화</button>
                    <span class="text-xs text-gray-600">${info ? info.desc : ''}${info && info.byPlan && planInfo ? ` (${planInfo.desc})` : ''}</span>
                </div>
            `;
        }
    };

    window.ReviewScenario = ReviewScenario;
    console.log('✅ review-scenario-data.js 로드 완료');
})();
