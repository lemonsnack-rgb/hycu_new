/**
 * 학위논문 제출 화면
 * Version: 20260107002
 */

// 화면 상태
let thesisCurrentView = 'list'; // list | submit | detail
let thesisCurrentSubmissionId = null;

// 제출 데이터: 재심사·신청철회 목업 시나리오(review-scenario-data.js)의 제출 기록
// (제출 번호 'N차 제출' = 기본단계 안에서 제출할 때마다 1씩 증가)
function getThesisSubmissions() {
    return ReviewScenario.getState().submissions;
}

// 화면 초기화 (페이지 로드 시 - 제거하고 showScreen에서만 호출)
// document.addEventListener('DOMContentLoaded', function() {
//     initThesisSubmission();
// });

// 학위논문 제출 화면 초기화
function initThesisSubmission() {
    console.log('initThesisSubmission 호출됨');
    const content = document.getElementById('thesis-submission-content');
    if (!content) {
        console.error('thesis-submission-content 요소를 찾을 수 없습니다');
        return;
    }

    // 항상 목록 화면으로 시작
    thesisCurrentView = 'list';
    thesisCurrentSubmissionId = null;

    // 이벤트 위임 설정 (한 번만)
    setupThesisEventDelegation();

    // 화면 렌더링
    renderThesisScreen();
}

// 이벤트 위임 설정 (한 번만 실행되도록)
let thesisEventDelegationSetup = false;
function setupThesisEventDelegation() {
    if (thesisEventDelegationSetup) {
        console.log('이벤트 위임 이미 설정됨 - 건너뜀');
        return;
    }

    console.log('이벤트 위임 설정 시작');
    const content = document.getElementById('thesis-submission-content');
    if (!content) {
        console.error('thesis-submission-content 요소를 찾을 수 없습니다');
        return;
    }

    // 이벤트 리스너 추가 (캡처 단계에서 처리)
    content.addEventListener('click', function(e) {
        console.log('클릭 이벤트 발생, target:', e.target, 'tagName:', e.target.tagName);

        const target = e.target.closest('button');

        // 버튼 클릭 처리
        if (target) {
            const action = target.getAttribute('data-action');
            const id = target.getAttribute('data-id');

            console.log('버튼 클릭됨, action:', action, 'id:', id);

            if (action === 'submit' && id) {
                e.preventDefault();
                e.stopPropagation();
                submitThesis(parseInt(id));
            } else if (action === 'view' && id) {
                e.preventDefault();
                e.stopPropagation();
                viewThesisSubmission(parseInt(id));
            } else if (action === 'edit-thesis' && id) {
                e.preventDefault();
                e.stopPropagation();
                editThesisSubmission(parseInt(id));
            } else if (action === 'back-to-list') {
                e.preventDefault();
                e.stopPropagation();
                backToThesisList();
            } else if (action === 'save-thesis') {
                e.preventDefault();
                e.stopPropagation();
                saveThesisSubmission();
            } else if (action === 'select-thesis-file') {
                e.preventDefault();
                e.stopPropagation();
                const fileInput = document.getElementById('thesis-main-file');
                if (fileInput) {
                    fileInput.click();
                }
            } else if (action === 'select-other-file') {
                e.preventDefault();
                e.stopPropagation();
                const fileInput = document.getElementById('thesis-other-file');
                if (fileInput) {
                    fileInput.click();
                }
            } else if (action === 'show-review-comments') {
                e.preventDefault();
                e.stopPropagation();
                const comments = target.getAttribute('data-comments');
                showReviewCommentsModal(comments);
            } else if (action === 'cancel-submission' && id) {
                e.preventDefault();
                e.stopPropagation();
                cancelThesisSubmission(parseInt(id));
            } else {
                console.log('알 수 없는 버튼 클릭, action:', action, 'target:', target);
            }
        }
    }, true); // 캡처 단계에서 이벤트 처리

    // 파일 입력 변경 이벤트 (이벤트 위임으로 처리할 수 없으므로 직접 처리)
    content.addEventListener('change', function(e) {
        // 학술지 제출 화면(journal-submission.js)에 같은 이름의 함수가 있어 별도 이름 사용
        if (e.target && e.target.id === 'thesis-main-file') {
            thesisMainFileSelected(e);
        } else if (e.target && e.target.id === 'thesis-other-file') {
            thesisOtherFileSelected(e);
        }
    });

    thesisEventDelegationSetup = true;
    console.log('이벤트 위임 설정 완료');
}

// 화면 렌더링
function renderThesisScreen() {
    console.log('renderScreen 호출, thesisCurrentView:', thesisCurrentView, 'thesisCurrentSubmissionId:', thesisCurrentSubmissionId);
    const content = document.getElementById('thesis-submission-content');
    if (!content) {
        console.error('thesis-submission-content 요소를 찾을 수 없습니다');
        return;
    }

    if (thesisCurrentView === 'list') {
        console.log('목록 화면 렌더링');
        content.innerHTML = renderThesisListScreen();
    } else if (thesisCurrentView === 'submit') {
        console.log('제출 폼 화면 렌더링');
        content.innerHTML = renderThesisSubmissionForm();
    } else if (thesisCurrentView === 'detail') {
        console.log('상세 화면 렌더링');
        content.innerHTML = renderThesisDetailView();
    }
    console.log('화면 렌더링 완료');
}

/**
 * 각 단계(stage)별로 가장 최신 제출(attemptNumber가 가장 큰 것)만 반환
 * 여러 번 제출해도 한 단계당 하나의 행만 표시하기 위함
 */
function getLatestSubmissionPerStage(allSubmissions) {
    const stageMap = new Map();

    allSubmissions.forEach(submission => {
        // 평가표 미등록 제출은 제외
        if (!submission.evaluationFormRegistered) return;

        const existing = stageMap.get(submission.stage);

        // 해당 stage의 submission이 없거나,
        // 현재 submission의 제출 번호(attemptNumber)가 더 크면 업데이트
        if (!existing || submission.attemptNumber > existing.attemptNumber) {
            stageMap.set(submission.stage, submission);
        }
    });

    return Array.from(stageMap.values());
}

// 목록 화면
function renderThesisListScreen() {
    const submissions = getLatestSubmissionPerStage(getThesisSubmissions());

    return `
        ${ReviewScenario.renderBar('renderThesisScreen')}
        <div class="bg-white rounded-lg shadow-md">
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">학위논문 제출</h3>
                    <span class="table-count">(총 ${submissions.length}건)</span>
                </div>
            </div>
            <div class="table-scroll">
                <table class="min-w-full thesis-table">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 60px;">순번</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px;">기본단계</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 130px;">세부단계</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 200px;">제출기간</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">제출구분</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px;">제출상태</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px;">심사결과</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 170px;">관리</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${submissions.map((submission, index) => renderThesisListRow(submission, index)).join('')}
                    </tbody>
                </table>
                ${submissions.length === 0 ? `
                    <div class="text-center py-8 text-gray-500">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p>등록된 평가표가 없습니다.</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 목록 행 렌더링
function renderThesisListRow(submission, index) {
    // 기본단계 및 세부단계
    const stageDisplay = submission.stageName;

    const periodDisplay = `${submission.submissionPeriod.start} ~ ${submission.submissionPeriod.end}`;

    // 제출구분 (신규 추가)
    const submissionType = `${submission.attemptNumber}차 제출`;

    // 상태 텍스트 (재심도 미제출로 표시)
    let statusText = '미제출';
    if (submission.status === 'submitted') {
        statusText = '제출완료';
    }

    // 심사 결과 텍스트
    let resultText = '-';
    if (submission.reviewResult === 'pass') {
        resultText = '합격';
    } else if (submission.reviewResult === 'fail') {
        resultText = '불합격';
    } else if (submission.reviewResult === 'conditional') {
        resultText = '조건부합격';
    }

    // 액션 버튼 (재심 구분 제거)
    let actionButton;
    if (submission.status === 'submitted') {
        actionButton = `<button data-action="view" data-id="${submission.id}" class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">보기</button>`;
    } else {  // not_submitted 또는 resubmit
        actionButton = `<button data-action="submit" data-id="${submission.id}" class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">제출</button>`;
    }

    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-3 text-center text-sm text-gray-900">${index + 1}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${submission.basicStageName || stageDisplay || '-'}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${submission.subStageName || '-'}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900" style="white-space: nowrap;">${periodDisplay}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${submissionType}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${statusText}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${resultText}</td>
            <td class="px-6 py-3 text-center">${actionButton}</td>
        </tr>
    `;
}

// 제출 화면으로 이동
function submitThesis(id) {
    console.log('submitThesis 호출됨, id:', id);
    // 재심사 1안: 불합격 처리된 학기에는 다음 차수 제출 불가 (다음 학기 제출기간에 제출)
    const check = ReviewScenario.checkSubmit(id);
    if (!check.ok) {
        alert(check.reason);
        return;
    }
    thesisCurrentSubmissionId = id;
    thesisCurrentView = 'submit';
    console.log('thesisCurrentView 변경:', thesisCurrentView);
    renderThesisScreen();
}

// 상세 화면으로 이동
function viewThesisSubmission(id) {
    console.log('viewThesisSubmission 호출됨, id:', id);
    thesisCurrentSubmissionId = id;
    thesisCurrentView = 'detail';
    console.log('thesisCurrentView 변경:', thesisCurrentView);
    renderThesisScreen();
}

// 목록으로 돌아가기
function backToThesisList() {
    thesisCurrentView = 'list';
    thesisCurrentSubmissionId = null;
    renderThesisScreen();
}

/**
 * 같은 심사 건(기본단계)의 이전 차수 제출 내역 — 기존 '기존 제출 내역' 블록을 차수마다 그대로 사용, 제목은 목록 제출구분과 같은 'N차 제출' (2026-10-08)
 * 1·2차 제출은 목록에 따로 표시하지 않고 하나의 관리(상세·제출) 화면에서 모두 표시
 */
function renderPreviousSubmissionBlocks(submission) {
    return getThesisSubmissions()
        .filter(prev => prev.stage === submission.stage && prev.attemptNumber < submission.attemptNumber && prev.submittedData)
        .sort((a, b) => a.attemptNumber - b.attemptNumber)
        .map(prev => {
            const orig = { ...prev.submittedData, reviewResult: prev.reviewResult, reviewComments: prev.reviewComments };
            const resultText = { pass: '합격', fail: '불합격', conditional: '조건부합격' }[prev.reviewResult] || '-';
            const resultColor = { pass: 'text-green-700', fail: 'text-red-700', conditional: 'text-yellow-700' }[prev.reviewResult] || 'text-gray-700';
            return `
            <div class="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">${prev.attemptNumber}차 제출</h3>
                <div class="space-y-3">
                    <!-- 지도교수 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">지도교수</label>
                        <input type="text" value="${submission.advisorName}" readonly
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                    </div>
                    <!-- 기본단계 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">기본단계</label>
                        <input type="text" value="${submission.basicStageName || submission.stageName || '-'}" readonly
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                    </div>
                    <!-- 세부단계 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">세부단계</label>
                        <input type="text" value="${submission.subStageName || '-'} (${prev.attemptNumber}차)" readonly
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                    </div>
                    <!-- 논문 제목 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문 제목</label>
                        <input type="text" value="${orig.title}" readonly
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                    </div>
                    <!-- 논문파일 / 기타파일 (읽기 전용 - 등록 화면과 동일 UI) -->
                    <div class="flex items-center gap-4">
                        <!-- 논문파일 -->
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문파일</label>
                        <input type="text" readonly
                               value="${orig.thesisFile ? orig.thesisFile + ' (' + (orig.thesisFileSize / 1024 / 1024).toFixed(2) + ' MB)' : ''}"
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                               placeholder="첨부파일 없음">

                        <!-- 기타파일 -->
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 ml-4">기타파일</label>
                        <input type="text" readonly
                               value="${orig.otherFile ? orig.otherFile + ' (' + (orig.otherFileSize / 1024 / 1024).toFixed(2) + ' MB)' : ''}"
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                               placeholder="첨부파일 없음">
                    </div>

                    <!-- border-t 구분선 -->
                    <div class="border-t pt-3 mt-3"></div>

                    <!-- 제출일시 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">제출일시</label>
                        <div class="text-sm text-gray-900">${orig.submittedAt}</div>
                    </div>
                    <!-- 평가 결과 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">평가 결과</label>
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium ${resultColor}">${resultText}</span>
                            <button type="button" data-action="show-review-comments" data-comments="${(orig.reviewComments || '').replace(/"/g, '&quot;')}"
                                    class="text-sm text-[#6A0028] hover:text-[#8A0034] underline">
                                총평 보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');
}

// 제출 폼 화면
function renderThesisSubmissionForm() {
    const submission = getThesisSubmissions().find(s => s.id === thesisCurrentSubmissionId);
    if (!submission) return '';

    const isEdit = submission.status === 'submitted';
    const data = isEdit ? submission.submittedData : {};

    const stageDisplay = submission.attemptNumber > 1
        ? `${submission.stageName} (${submission.attemptNumber}차)`
        : submission.stageName;

    let html = `
        <div class="mb-4">
            <button data-action="back-to-list" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                목록으로
            </button>
        </div>
    `;

    // 같은 심사 건의 이전 차수 제출 내역 (기존 블록 그대로, 읽기 전용)
    html += renderPreviousSubmissionBlocks(submission);

    // 제출 폼
    html += `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">${submission.attemptNumber}차 제출</h3>
            <div class="space-y-4">
                <!-- 지도교수명 출력 (읽기 전용) -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">지도교수</label>
                    <input type="text" value="${submission.advisorName || '홍길동 교수'}" readonly
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                </div>

                <!-- 기본단계 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">기본단계</label>
                    <input type="text" value="${submission.basicStageName || stageDisplay || '-'}" readonly
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                </div>
                <!-- 세부단계 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">세부단계</label>
                    <input type="text" value="${submission.subStageName || '-'}" readonly
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                </div>

                <!-- 논문제목 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문 제목 <span class="text-red-500">*</span></label>
                    <input type="text" id="thesis-title" value="${data.title || ''}"
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                           placeholder="논문 제목을 입력하세요">
                </div>

                <!-- 논문파일 / 기타파일 (한 줄 배치) -->
                <div>
                    <div class="flex items-center gap-4">
                        <!-- 논문파일 -->
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문파일 <span class="text-red-500">*</span></label>
                        <input type="text" id="thesis-file-display" readonly
                               value="${data.thesisFile ? data.thesisFile + ' (' + (data.thesisFileSize / 1024 / 1024).toFixed(2) + ' MB)' : ''}"
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                               placeholder="선택된 파일 없음">
                        <input type="file" id="thesis-main-file" class="hidden" accept=".pdf">
                        <button type="button" data-action="select-thesis-file"
                                class="px-4 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap">
                            찾아보기
                        </button>

                        <!-- 기타파일 -->
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 ml-4">기타파일</label>
                        <input type="text" id="other-file-display" readonly
                               value="${data.otherFile ? data.otherFile + ' (' + (data.otherFileSize / 1024 / 1024).toFixed(2) + ' MB)' : ''}"
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                               placeholder="선택된 파일 없음">
                        <input type="file" id="thesis-other-file" class="hidden" accept=".pdf">
                        <button type="button" data-action="select-other-file"
                                class="px-4 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap">
                            찾아보기
                        </button>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">PDF만 업로드 가능. 최대 30MB</p>
                </div>

                <!-- 제출 버튼 -->
                <div class="flex justify-end gap-3 pt-4">
                    <button data-action="back-to-list"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        취소
                    </button>
                    <button data-action="save-thesis"
                            class="px-6 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034]">
                        ${isEdit ? '저장' : '제출하기'}
                    </button>
                </div>
            </div>
        </div>
    `;

    return html;
}

// 상세/보기 화면
function renderThesisDetailView() {
    const submission = getThesisSubmissions().find(s => s.id === thesisCurrentSubmissionId);
    if (!submission || submission.status !== 'submitted') return '';

    const data = submission.submittedData;
    const stageDisplay = submission.attemptNumber > 1
        ? `${submission.stageName} (${submission.attemptNumber}차)`
        : submission.stageName;

    // 제출취소: 상세 화면에서, 결과 확정 전이고 제출기간일 때만 (심사 내역이 있으면 누를 때 안내)
    const canShowCancel = !submission.reviewResult && ReviewScenario.isWithinPeriod(submission.submissionPeriod);

    // 평가 결과 텍스트 계산
    let reviewResultText = '-';
    if (submission.reviewResult === 'pass') {
        reviewResultText = '합격';
    } else if (submission.reviewResult === 'fail') {
        reviewResultText = '불합격';
    } else if (submission.reviewResult === 'conditional') {
        reviewResultText = '조건부합격';
    }

    return `
        <div class="mb-4">
            <button data-action="back-to-list" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                목록으로
            </button>
        </div>

        ${renderPreviousSubmissionBlocks(submission)}
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800">${submission.attemptNumber}차 제출</h3>
                <div class="flex gap-2">
                    ${canShowCancel ? `
                    <button data-action="cancel-submission" data-id="${submission.id}"
                            class="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors">
                        제출취소
                    </button>` : ''}
                    <button data-action="edit-thesis" data-id="${submission.id}"
                            class="px-4 py-2 border border-[#6A0028] text-[#6A0028] rounded-md hover:bg-[#6A0028] hover:text-white transition-colors">
                        수정
                    </button>
                </div>
            </div>

            <div class="space-y-4">
                <!-- 지도교수명 출력 (읽기 전용) -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">지도교수</label>
                    <input type="text" value="${submission.advisorName || '홍길동 교수'}" readonly
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                </div>

                <!-- 기본단계 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">기본단계</label>
                    <input type="text" value="${submission.basicStageName || stageDisplay || '-'}" readonly
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                </div>
                <!-- 세부단계 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">세부단계</label>
                    <input type="text" value="${submission.subStageName || '-'}" readonly
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                </div>

                <!-- 논문제목 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문 제목</label>
                    <input type="text" value="${data.title}" readonly
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                </div>

                <!-- 논문파일 / 기타파일 (읽기 전용 - 등록 화면과 동일 UI) -->
                <div class="flex items-center gap-4">
                    <!-- 논문파일 -->
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문파일</label>
                    <input type="text" readonly
                           value="${data.thesisFile ? data.thesisFile + ' (' + (data.thesisFileSize / 1024 / 1024).toFixed(2) + ' MB)' : ''}"
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                           placeholder="첨부파일 없음">

                    <!-- 기타파일 -->
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 ml-4">기타파일</label>
                    <input type="text" readonly
                           value="${data.otherFile ? data.otherFile + ' (' + (data.otherFileSize / 1024 / 1024).toFixed(2) + ' MB)' : ''}"
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
                           placeholder="첨부파일 없음">
                </div>
            </div>

            <!-- border-t 구분선 -->
            <div class="border-t pt-4 mt-6"></div>

            <!-- 하단: 제출정보 -->
            <div class="space-y-3">
                <!-- 제출일시 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">제출일시</label>
                    <div class="text-sm text-gray-900">${data.submittedAt}</div>
                </div>

                <!-- 평가 결과 + 총평 보기 버튼 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">평가 결과</label>
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-green-700">${reviewResultText}</span>
                        <button type="button" data-action="show-review-comments"
                                data-comments="${(submission.reviewComments || '').replace(/"/g, '&quot;')}"
                                class="text-sm text-[#6A0028] hover:text-[#8A0034] underline">
                            총평 보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 수정 모드로 전환
function editThesisSubmission(id) {
    thesisCurrentSubmissionId = id;
    thesisCurrentView = 'submit';
    renderThesisScreen();
}

// 파일 선택 처리
// 논문파일 선택 처리
function thesisMainFileSelected(event) {
    const file = event.target.files[0];
    const fileDisplay = document.getElementById('thesis-file-display');

    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        fileDisplay.value = `${file.name} (${fileSize} MB)`;
    }
}

// 기타파일 선택 처리
function thesisOtherFileSelected(event) {
    const file = event.target.files[0];
    const fileDisplay = document.getElementById('other-file-display');

    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        fileDisplay.value = `${file.name} (${fileSize} MB)`;
    }
}

// 논문 제출/수정 저장
function saveThesisSubmission() {
    const title = document.getElementById('thesis-title').value.trim();
    const thesisFile = document.getElementById('thesis-main-file').files[0];
    const otherFile = document.getElementById('thesis-other-file').files[0];

    const submission = getThesisSubmissions().find(s => s.id === thesisCurrentSubmissionId);
    const isEdit = submission.status === 'submitted';

    if (!title) {
        alert('논문 제목을 입력해주세요.');
        return;
    }

    if (!isEdit && !thesisFile && !submission.submittedData?.thesisFile) {
        alert('논문파일을 선택해주세요.');
        return;
    }

    const confirmMessage = isEdit ? '논문을 수정하시겠습니까?' : '논문을 제출하시겠습니까?';
    if (confirm(confirmMessage)) {
        {
            // 제출 또는 수정 처리 (조건부합격 후 보완 제출도 동일)
            submission.status = 'submitted';
            submission.submittedData = {
                title: title,
                thesisFile: thesisFile ? thesisFile.name : submission.submittedData.thesisFile,
                thesisFileSize: thesisFile ? thesisFile.size : submission.submittedData.thesisFileSize,
                otherFile: otherFile ? otherFile.name : submission.submittedData?.otherFile,
                otherFileSize: otherFile ? otherFile.size : submission.submittedData?.otherFileSize,
                submittedAt: isEdit ? submission.submittedData.submittedAt : new Date().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).replace(/\. /g, '-').replace('.', '')
            };

            console.log('논문 저장:', submission);
            alert(isEdit ? '논문이 수정되었습니다.' : '논문이 제출되었습니다.');
        }

        backToThesisList();
    }
}

// ==================== 제출취소 ====================
// 해당 차수(세부단계) 제출 내역만 삭제 → 미제출. 신청과 이전 차수(통과·판정) 기록은 유지 — 신청 철회와 별개
// 조건: 결과 확정 전 + 심사 내역(평가 저장, 임시저장 포함) 없음 / 표시: 상세 화면에서 제출기간일 때만
function cancelThesisSubmission(id) {
    const check = ReviewScenario.checkCancelSubmission(id);
    if (!check.ok) {
        alert(check.reason);
        return;
    }

    if (!confirm('제출한 심사자료를 취소하시겠습니까?\n제출한 파일이 삭제되며, 제출기간 내에 다시 제출할 수 있습니다.')) {
        return;
    }

    ReviewScenario.cancelSubmission(id);
    alert('제출이 취소되었습니다.');
    backToThesisList();
}

// 스타일 추가 (즉시 실행)
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .table-header-left {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .table-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
        .table-count {
            font-size: 14px;
            color: #6b7280;
        }
        .table-scroll {
            overflow-x: auto;
        }
        .thesis-table {
            table-layout: fixed;
            width: 100%;
        }
        .thesis-table th,
        .thesis-table td {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;
    document.head.appendChild(style);
})();

// 총평 보기 모달 표시
function showReviewCommentsModal(comments) {
    if (!comments || comments.trim() === '') {
        alert('평가 의견이 없습니다.');
        return;
    }

    // 모달 HTML 생성
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">심사위원장 최종 총평</h3>
                <button data-action="close-modal" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="border border-gray-200 rounded-md p-4 bg-gray-50">
                <p class="text-sm text-gray-900 whitespace-pre-wrap">${comments}</p>
            </div>
            <div class="mt-6 flex justify-end">
                <button data-action="close-modal" class="px-4 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034]">
                    닫기
                </button>
            </div>
        </div>
    `;

    // 모달 닫기 이벤트
    modal.addEventListener('click', function(e) {
        if (e.target.getAttribute('data-action') === 'close-modal' || e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    document.body.appendChild(modal);
}

// 전역 함수 등록
window.cancelThesisSubmission = cancelThesisSubmission;
window.submitThesis = submitThesis;
window.viewThesisSubmission = viewThesisSubmission;
window.backToThesisList = backToThesisList;
window.editThesisSubmission = editThesisSubmission;
window.saveThesisSubmission = saveThesisSubmission;
window.showReviewCommentsModal = showReviewCommentsModal;
window.renderThesisScreen = renderThesisScreen;
