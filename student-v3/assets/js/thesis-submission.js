/**
 * 학위논문 제출 화면
 * Version: 20260107002
 */

// 화면 상태
let thesisCurrentView = 'list'; // list | submit | detail
let thesisCurrentSubmissionId = null;

// Mock 데이터
const thesisSubmissions = [
    {
        id: 1,
        stage: 'proposal',
        stageName: '연구계획서',
        attemptNumber: 1,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-01-01',
            end: '2025-01-31'
        },
        status: 'submitted',
        reviewResult: 'pass',
        submittedData: {
            title: 'AI 기반 추천 시스템 연구',
            desiredExamDate: '2025-01-15',
            fileName: 'proposal_v1.pdf',
            fileSize: 2500000,
            submittedAt: '2025-01-10 14:30'
        },
        evaluationFormRegistered: true
    },
    {
        id: 2,
        stage: 'interim',
        stageName: '중간논문',
        attemptNumber: 1,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-03-01',
            end: '2025-03-31'
        },
        status: 'not_submitted',
        reviewResult: null,
        submittedData: null,
        evaluationFormRegistered: true
    },
    {
        id: 3,
        stage: 'main',
        stageName: '본심사',
        attemptNumber: 1,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-05-01',
            end: '2025-05-31'
        },
        status: 'resubmit',  // 재심 제출 필요
        reviewResult: 'conditional',  // 조건부합격
        submittedData: null,  // 재심 제출 전이므로 null
        // 1차 제출 원본 데이터
        originalSubmission: {
            title: 'AI 기반 추천 시스템 연구',
            desiredExamDate: '2025-05-20',
            fileName: 'final_thesis_v1.pdf',
            fileSize: 4500000,
            submittedAt: '2025-05-10 16:45',
            reviewResult: 'conditional',
            reviewComments: '연구 방법론 보완 필요. 데이터 분석 부분을 더 상세히 작성하세요.'
        },
        // 재심 정보
        resubmission: {
            required: true,
            deadline: '2025-12-31 23:59',
            attemptNumber: 2,  // 2차 제출
            status: 'pending',  // pending: 재심 대기, submitted: 재심 제출 완료
            reviewerType: 'single',
            reviewerName: '이교수',
            evaluationTemplateName: '본심사 평가표'
        },
        evaluationFormRegistered: true
    },
    {
        id: 4,
        stage: 'main',
        stageName: '본심사',
        attemptNumber: 2,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-06-01',
            end: '2025-06-30'
        },
        status: 'not_submitted',
        reviewResult: null,
        submittedData: null,
        evaluationFormRegistered: true
    }
];

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
            } else if (action === 'select-file') {
                e.preventDefault();
                e.stopPropagation();
                const fileInput = document.getElementById('thesis-file');
                if (fileInput) {
                    fileInput.click();
                }
            } else {
                console.log('알 수 없는 버튼 클릭, action:', action, 'target:', target);
            }
        }
    }, true); // 캡처 단계에서 이벤트 처리

    // 파일 입력 변경 이벤트 (이벤트 위임으로 처리할 수 없으므로 직접 처리)
    content.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'thesis-file') {
            handleFileSelect(e);
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

// 목록 화면
function renderThesisListScreen() {
    const submissions = thesisSubmissions.filter(s => s.evaluationFormRegistered);

    return `
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
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 150px;">심사단계</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 200px;">제출기간</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px;">제출상태</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px;">심사결과</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">관리</th>
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
    const stageDisplay = submission.attemptNumber > 1
        ? `${submission.stageName} (${submission.attemptNumber}차)`
        : submission.stageName;

    const periodDisplay = `${submission.submissionPeriod.start} ~ ${submission.submissionPeriod.end}`;

    // 상태 텍스트
    let statusText = '미제출';
    if (submission.status === 'submitted') {
        statusText = '제출완료';
    } else if (submission.status === 'resubmit') {
        statusText = '재심 제출';
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

    // 액션 버튼
    let actionButton;
    if (submission.status === 'submitted') {
        actionButton = `<button data-action="view" data-id="${submission.id}" class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">보기</button>`;
    } else if (submission.status === 'resubmit') {
        actionButton = `<button data-action="submit" data-id="${submission.id}" class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">재심 제출</button>`;
    } else {
        actionButton = `<button data-action="submit" data-id="${submission.id}" class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">제출</button>`;
    }

    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-3 text-center text-sm text-gray-900">${index + 1}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${stageDisplay}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900" style="white-space: nowrap;">${periodDisplay}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${statusText}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${resultText}</td>
            <td class="px-6 py-3 text-center">${actionButton}</td>
        </tr>
    `;
}

// 제출 화면으로 이동
function submitThesis(id) {
    console.log('submitThesis 호출됨, id:', id);
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

// 제출 폼 화면
function renderThesisSubmissionForm() {
    const submission = thesisSubmissions.find(s => s.id === thesisCurrentSubmissionId);
    if (!submission) return '';

    const isResubmit = submission.status === 'resubmit' && submission.originalSubmission;
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

    // 재심 제출인 경우: 기존 제출 내역 표시 (읽기 전용)
    if (isResubmit) {
        const orig = submission.originalSubmission;
        html += `
            <div class="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">기존 제출 내역</h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">제출일시</label>
                        <div class="text-sm text-gray-900">${orig.submittedAt}</div>
                    </div>
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문 제목</label>
                        <div class="text-sm text-gray-900">${orig.title}</div>
                    </div>
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">제출 파일</label>
                        <div class="text-sm text-gray-900">${orig.fileName} (${(orig.fileSize / 1024 / 1024).toFixed(2)} MB)</div>
                    </div>
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">심사 결과</label>
                        <span class="text-sm font-medium text-yellow-700">조건부합격</span>
                    </div>
                    <div class="flex gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">심사 의견</label>
                        <div class="flex-1 text-sm text-gray-900 bg-white border border-gray-200 rounded p-3">
                            ${orig.reviewComments || '-'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 재심 제출 또는 신규 제출 폼
    html += `
        <div class="bg-white rounded-lg shadow-md p-6">
            ${isResubmit ? `
                <h3 class="text-lg font-semibold text-gray-800 mb-4">재심 논문 제출</h3>
                <div class="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
                    <div class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div class="text-sm text-yellow-800">
                            <p class="font-medium">재심 제출 안내</p>
                            <p class="mt-1">재심 심사위원: ${submission.resubmission.reviewerName || '심사위원회'}</p>
                            <p>재심 제출 마감일: ${submission.resubmission.deadline}</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="space-y-4">
                <!-- 지도교수명 출력 (읽기 전용) -->
                <div class="flex items-center gap-4 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">지도교수</label>
                    <div class="flex-1 text-sm text-gray-900 font-medium">${submission.advisorName || '홍길동 교수'}</div>
                </div>

                <!-- 심사단계 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">심사단계</label>
                    <input type="text" value="${stageDisplay}" readonly
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                </div>

                <!-- 논문제목 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">${isResubmit ? '재심 논문 제목 *' : '논문 제목 *'}</label>
                    <input type="text" id="thesis-title" value="${data.title || ''}"
                           class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                           placeholder="논문 제목을 입력하세요">
                </div>

                <!-- 파일업로드 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">${isResubmit ? '재심 논문 파일 *' : '파일 업로드 *'}</label>
                    <div class="flex-1 flex items-center gap-3">
                        <input type="file" id="thesis-file" class="hidden" accept=".pdf">
                        <button type="button" data-action="select-file"
                                class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            파일 선택
                        </button>
                        <span class="text-xs text-gray-500">PDF만 업로드 가능. 최대 30MB</span>
                        <div id="file-info" class="text-sm text-gray-600">
                            ${data.fileName ? `
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span class="text-green-600 font-medium">${data.fileName} (${(data.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- 제출 버튼 -->
                <div class="flex justify-end gap-3 pt-4">
                    <button data-action="back-to-list"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        취소
                    </button>
                    <button data-action="save-thesis"
                            class="px-6 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034]">
                        ${isResubmit ? '재심 제출하기' : isEdit ? '저장' : '제출하기'}
                    </button>
                </div>
            </div>
        </div>
    `;

    return html;
}

// 상세/보기 화면
function renderThesisDetailView() {
    const submission = thesisSubmissions.find(s => s.id === thesisCurrentSubmissionId);
    if (!submission || submission.status !== 'submitted') return '';

    const data = submission.submittedData;
    const stageDisplay = submission.attemptNumber > 1
        ? `${submission.stageName} (${submission.attemptNumber}차)`
        : submission.stageName;

    return `
        <div class="mb-4">
            <button data-action="back-to-list" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                목록으로
            </button>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800">논문 제출 정보</h3>
                <button data-action="edit-thesis" data-id="${submission.id}"
                        class="px-4 py-2 border border-[#6A0028] text-[#6A0028] rounded-md hover:bg-[#6A0028] hover:text-white transition-colors">
                    수정
                </button>
            </div>

            <div class="space-y-4">
                <!-- 지도교수명 출력 (읽기 전용) -->
                <div class="flex items-center gap-4 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">지도교수</label>
                    <div class="flex-1 text-sm text-gray-900 font-medium">${submission.advisorName || '홍길동 교수'}</div>
                </div>

                <!-- 심사단계 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">심사단계</label>
                    <div class="flex-1 px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-900">${stageDisplay}</div>
                </div>

                <!-- 논문제목 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문 제목</label>
                    <div class="flex-1 px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-900">${data.title}</div>
                </div>

                <!-- 첨부파일 -->
                <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">첨부파일</label>
                    <div class="flex-1 flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-md">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span class="text-sm text-gray-900">${data.fileName}</span>
                        <span class="text-xs text-gray-500">(${(data.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                        <button class="ml-auto text-sm text-[#6A0028] hover:text-[#8A0034]">다운로드</button>
                    </div>
                </div>

                <!-- 제출 정보 -->
                <div class="border-t pt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">제출 정보</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-xs text-gray-500">제출일시</span>
                            <div class="text-sm text-gray-900 mt-1">${data.submittedAt}</div>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500">제출상태</span>
                            <div class="text-sm text-gray-900 mt-1">제출완료</div>
                        </div>
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
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById('file-info');

    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        fileInfo.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-green-600 font-medium">${file.name} (${fileSize} MB)</span>
            </div>
        `;
    }
}

// 논문 제출/수정 저장
function saveThesisSubmission() {
    const title = document.getElementById('thesis-title').value.trim();
    const file = document.getElementById('thesis-file').files[0];

    const submission = thesisSubmissions.find(s => s.id === thesisCurrentSubmissionId);
    const isEdit = submission.status === 'submitted';
    const isResubmit = submission.status === 'resubmit';

    if (!title) {
        alert('논문 제목을 입력해주세요.');
        return;
    }

    if (!isEdit && !file) {
        alert('파일을 선택해주세요.');
        return;
    }

    const confirmMessage = isResubmit ? '재심 논문을 제출하시겠습니까?' : isEdit ? '논문을 수정하시겠습니까?' : '논문을 제출하시겠습니까?';
    if (confirm(confirmMessage)) {
        if (isResubmit) {
            // 재심 제출 처리
            submission.status = 'submitted';
            submission.submittedData = {
                title: title,
                fileName: file ? file.name : 'resubmission.pdf',
                fileSize: file ? file.size : 0,
                submittedAt: new Date().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).replace(/\. /g, '-').replace('.', '')
            };
            submission.resubmission.status = 'submitted';
            submission.reviewResult = null;  // 재심 결과 대기

            console.log('재심 논문 제출:', submission);
            alert('재심 논문이 제출되었습니다.');
        } else {
            // 일반 제출 또는 수정 처리
            submission.status = 'submitted';
            submission.submittedData = {
                title: title,
                fileName: file ? file.name : submission.submittedData.fileName,
                fileSize: file ? file.size : submission.submittedData.fileSize,
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

// 전역 함수 등록
window.submitThesis = submitThesis;
window.viewThesisSubmission = viewThesisSubmission;
window.backToThesisList = backToThesisList;
window.editThesisSubmission = editThesisSubmission;
window.handleFileSelect = handleFileSelect;
window.saveThesisSubmission = saveThesisSubmission;
