/**
 * 학술지 논문 제출 화면
 * Version: 20260107006
 */

// 화면 상태
let journalCurrentView = 'list'; // list | submit | detail
let journalCurrentSubmissionId = null;

// Mock 데이터
// reviewResult: approved(승인), rejected(반려), revision_required(보완후재제출), on_hold(보류)
const journalSubmissions = [
    {
        id: 1,
        stageName: '1차 제출',
        attemptNumber: 1,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-01-01',
            end: '2025-01-31'
        },
        status: 'submitted',
        reviewResult: 'approved',
        submittedData: {
            advisor: '김철수 교수',
            titleKorean: 'AI 기반 추천 시스템에 관한 연구',
            authors: '홍길동, 김철수, 이영희',
            journalName: '한국정보과학회논문지',
            journalType: 'KCI',
            publisher: '한국정보과학회',
            volumeIssue: '10권 2호',
            publishDate: '2024-11-15',
            pages: '123-145',
            proofDocType: 'confirmation',
            fileName: 'journal_paper_v1.pdf',
            fileSize: 2500000,
            submittedAt: '2025-01-10 14:30'
        }
    },
    {
        id: 2,
        stageName: '2차 제출',
        attemptNumber: 1,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-03-01',
            end: '2025-03-31'
        },
        status: 'submitted',
        reviewResult: 'revision_required',
        submittedData: {
            advisor: '이영희 교수',
            titleKorean: '머신러닝 기반 데이터 분석 연구',
            authors: '홍길동, 이영희',
            journalName: '데이터사이언스학회지',
            journalType: 'SCIE',
            publisher: '한국데이터사이언스학회',
            volumeIssue: '15권 3호',
            publishDate: '2025-02-20',
            pages: '45-68',
            proofDocType: 'scheduled',
            fileName: 'journal_paper_2nd_v1.pdf',
            fileSize: 2800000,
            submittedAt: '2025-03-12 09:30'
        }
    },
    {
        id: 3,
        stageName: '2차 제출',
        attemptNumber: 2,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-04-01',
            end: '2025-04-30'
        },
        status: 'not_submitted',
        reviewResult: null,
        submittedData: null
    },
    {
        id: 4,
        stageName: '3차 제출',
        attemptNumber: 1,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-05-01',
            end: '2025-05-31'
        },
        status: 'submitted',
        reviewResult: 'on_hold',
        submittedData: {
            advisor: '박지성 교수',
            titleKorean: '딥러닝 기반 음성 인식 시스템 개발',
            authors: '홍길동, 박지성, 최민수',
            journalName: 'IEEE Transactions on Audio',
            journalType: 'SCI_SSCI_AHCI',
            publisher: 'IEEE',
            volumeIssue: '28권 5호',
            publishDate: '2025-04-30',
            pages: '201-225',
            proofDocType: 'proof',
            fileName: 'journal_paper_v2.pdf',
            fileSize: 3200000,
            submittedAt: '2025-05-15 10:20'
        }
    },
    {
        id: 5,
        stageName: '3차 제출',
        attemptNumber: 2,
        advisorName: '홍길동 교수',
        submissionPeriod: {
            start: '2025-06-01',
            end: '2025-06-30'
        },
        status: 'resubmit',
        reviewResult: null,
        submittedData: null,
        originalSubmission: {
            advisor: '이영희 교수',
            titleKorean: '머신러닝 기반 데이터 분석 연구',
            authors: '홍길동, 이영희',
            journalName: '데이터사이언스학회지',
            journalType: 'SCIE',
            publisher: '한국데이터사이언스학회',
            volumeIssue: '15권 3호',
            publishDate: '2025-02-20',
            pages: '45-68',
            proofDocType: 'scheduled',
            fileName: 'journal_paper_2nd_v1.pdf',
            fileSize: 2800000,
            submittedAt: '2025-03-12 09:30',
            reviewComments: '연구 방법론의 보완이 필요합니다. 통계 분석 부분을 강화해 주시기 바랍니다.'
        }
    }
];

// 학술지 논문 제출 화면 초기화
function initJournalSubmission() {
    console.log('initJournalSubmission 호출됨');
    const content = document.getElementById('journal-submission-content');
    if (!content) {
        console.error('journal-submission-content 요소를 찾을 수 없습니다');
        return;
    }

    // 항상 목록 화면으로 시작
    journalCurrentView = 'list';
    journalCurrentSubmissionId = null;

    // 이벤트 위임 설정 (한 번만)
    setupEventDelegation();

    // 화면 렌더링
    renderScreen();
}

// 이벤트 위임 설정 (한 번만 실행되도록)
let journalEventDelegationSetup = false;
function setupEventDelegation() {
    if (journalEventDelegationSetup) {
        console.log('이벤트 위임 이미 설정됨 - 건너뜀');
        return;
    }

    console.log('이벤트 위임 설정 시작');
    const content = document.getElementById('journal-submission-content');
    if (!content) {
        console.error('journal-submission-content 요소를 찾을 수 없습니다');
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
                submitJournal(parseInt(id));
            } else if (action === 'view' && id) {
                e.preventDefault();
                e.stopPropagation();
                viewJournalSubmission(parseInt(id));
            } else if (action === 'edit-journal' && id) {
                e.preventDefault();
                e.stopPropagation();
                editJournalSubmission(parseInt(id));
            } else if (action === 'back-to-list') {
                e.preventDefault();
                e.stopPropagation();
                backToList();
            } else if (action === 'save-journal') {
                e.preventDefault();
                e.stopPropagation();
                saveJournalSubmission();
            } else if (action === 'select-file') {
                e.preventDefault();
                e.stopPropagation();
                const fileInput = document.getElementById('journal-file');
                if (fileInput) {
                    fileInput.click();
                }
            } else if (action === 'show-review-comments') {
                e.preventDefault();
                e.stopPropagation();
                const comments = target.getAttribute('data-comments');
                showReviewCommentsModal(comments);
            } else {
                console.log('알 수 없는 버튼 클릭, action:', action, 'target:', target);
            }
        }
    }, true); // 캡처 단계에서 이벤트 처리

    // 파일 입력 변경 이벤트 (이벤트 위임으로 처리할 수 없으므로 직접 처리)
    content.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'journal-file') {
            handleFileSelect(e);
        }
    });

    journalEventDelegationSetup = true;
    console.log('이벤트 위임 설정 완료');
}

// 화면 렌더링
function renderScreen() {
    console.log('renderScreen 호출, journalCurrentView:', journalCurrentView, 'journalCurrentSubmissionId:', journalCurrentSubmissionId);
    const content = document.getElementById('journal-submission-content');
    if (!content) {
        console.error('journal-submission-content 요소를 찾을 수 없습니다');
        return;
    }

    if (journalCurrentView === 'list') {
        console.log('목록 화면 렌더링');
        content.innerHTML = renderJournalListScreen();
    } else if (journalCurrentView === 'submit') {
        console.log('제출 폼 화면 렌더링');
        content.innerHTML = renderJournalSubmissionForm();
    } else if (journalCurrentView === 'detail') {
        console.log('상세 화면 렌더링');
        content.innerHTML = renderJournalDetailView();
    }
    console.log('화면 렌더링 완료');
}

// 목록 화면
function renderJournalListScreen() {
    const submissions = journalSubmissions;

    return `
        <div class="bg-white rounded-lg shadow-md">
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">학술지 논문 제출</h3>
                    <span class="table-count">(총 ${submissions.length}건)</span>
                </div>
            </div>
            <div class="table-scroll">
                <table class="min-w-full journal-table">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 60px;">순번</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 150px;">심사단계</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 200px;">제출기간</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">제출구분</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px;">제출상태</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px;">심사결과</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">관리</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${submissions.map((submission, index) => renderJournalListRow(submission, index)).join('')}
                    </tbody>
                </table>
                ${submissions.length === 0 ? `
                    <div class="text-center py-8 text-gray-500">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p>등록된 제출 정보가 없습니다.</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 목록 행 렌더링
function renderJournalListRow(submission, index) {
    // 심사단계명만 표시 (attemptNumber 제거)
    const stageDisplay = submission.stageName;

    const periodDisplay = `${submission.submissionPeriod.start} ~ ${submission.submissionPeriod.end}`;

    // 제출구분 추가
    const submissionType = `${submission.attemptNumber}차 제출`;

    // 상태 텍스트 (재제출도 미제출로 표시)
    let statusText = '미제출';
    if (submission.status === 'submitted') {
        statusText = '제출완료';
    }

    let resultText = '-';
    if (submission.reviewResult === 'approved') {
        resultText = '승인';
    } else if (submission.reviewResult === 'rejected') {
        resultText = '반려';
    } else if (submission.reviewResult === 'revision_required') {
        resultText = '보완후재제출';
    } else if (submission.reviewResult === 'on_hold') {
        resultText = '보류';
    }

    // 액션 버튼 (재제출도 제출 버튼)
    let actionButton;
    if (submission.status === 'submitted') {
        actionButton = `<button data-action="view" data-id="${submission.id}" class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">보기</button>`;
    } else {  // not_submitted 또는 resubmit
        actionButton = `<button data-action="submit" data-id="${submission.id}" class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">제출</button>`;
    }

    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-3 text-center text-sm text-gray-900">${index + 1}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${stageDisplay}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900" style="white-space: nowrap;">${periodDisplay}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${submissionType}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${statusText}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${resultText}</td>
            <td class="px-6 py-3 text-center">${actionButton}</td>
        </tr>
    `;
}

// 제출 화면으로 이동
function submitJournal(id) {
    console.log('submitJournal 호출됨, id:', id);
    journalCurrentSubmissionId = id;
    journalCurrentView = 'submit';
    console.log('journalCurrentView 변경:', journalCurrentView);
    renderScreen();
}

// 상세 화면으로 이동
function viewJournalSubmission(id) {
    console.log('viewJournalSubmission 호출됨, id:', id);
    journalCurrentSubmissionId = id;
    journalCurrentView = 'detail';
    console.log('journalCurrentView 변경:', journalCurrentView);
    renderScreen();
}

// 목록으로 돌아가기
function backToList() {
    journalCurrentView = 'list';
    journalCurrentSubmissionId = null;
    renderScreen();
}

// 제출 폼 화면
function renderJournalSubmissionForm(isViewMode = false) {
    const submission = journalSubmissions.find(s => s.id === journalCurrentSubmissionId);
    if (!submission) return '';

    // 재제출 여부 확인
    const isResubmit = submission.status === 'resubmit';
    const isEdit = submission.status === 'submitted';
    const data = isEdit ? submission.submittedData : {};

    // 보기 모드일 때 disabled 속성 추가
    const disabledAttr = isViewMode ? 'disabled' : '';
    const disabledClass = isViewMode ? 'bg-gray-100 cursor-not-allowed' : '';

    let html = `
        ${!isViewMode ? `
        <div class="mb-4">
            <button data-action="back-to-list" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                목록으로
            </button>
        </div>
        ` : ''}
    `;

    // 재제출인 경우: 기존 제출 내역 표시
    if (isResubmit) {
        const orig = submission.originalSubmission;

        html += `
            <div class="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">기존 제출 내역</h3>
                <div class="space-y-3">
                    <!-- 논문지도교수 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문지도교수</label>
                        <input type="text" value="${orig.advisor}" readonly
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                    </div>
                    <!-- 논문제목(한글) -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">논문제목(한글)</label>
                        <input type="text" value="${orig.titleKorean}" readonly
                               class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50">
                    </div>
                    <!-- 첨부파일 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">첨부파일</label>
                        <div class="flex-1 flex items-center gap-3 px-3 py-1.5 border border-gray-300 bg-gray-50 rounded-md">
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span class="text-sm text-gray-900">${orig.fileName}</span>
                            <span class="text-xs text-gray-500">(${(orig.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                    </div>

                    <!-- border-t 구분선 -->
                    <div class="border-t pt-3 mt-3"></div>

                    <!-- 제출일시 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">제출일시</label>
                        <div class="text-sm text-gray-900">${orig.submittedAt}</div>
                    </div>
                    <!-- 심사 결과 -->
                    <div class="flex items-center gap-4">
                        <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0">심사 결과</label>
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-yellow-700">보완후재제출</span>
                            <button type="button" data-action="show-review-comments" data-comments="${(orig.reviewComments || '').replace(/"/g, '&quot;')}"
                                    class="text-sm text-[#6A0028] hover:text-[#8A0034] underline">
                                총평 보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 재제출 또는 신규 제출 폼
    html += `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-6">학술지 논문 제출</h3>

            <div class="space-y-4">
                <!-- 논문지도교수 -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">논문지도교수</label>
                    <input type="text" id="journal-advisor" value="${data.advisor || ''}"
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028] ${disabledClass}"
                           placeholder="논문지도교수명을 입력하세요" ${disabledAttr}>
                </div>

                <!-- 논문제목(한글) -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">논문제목(한글)</label>
                    <div class="flex-1">
                        <p class="text-xs text-red-600 mb-2">* 반드시 본인이 제1저자 또는 교신저자이며, 공저자에는 지도교수가 포함되어야 함</p>
                        <input type="text" id="journal-title-korean" value="${data.titleKorean || ''}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028] ${disabledClass}"
                               placeholder="논문 제목을 입력하세요" ${disabledAttr}>
                    </div>
                </div>

                <!-- 저자명(전체) -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">저자명(전체)</label>
                    <input type="text" id="journal-authors" value="${data.authors || ''}"
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028] ${disabledClass}"
                           placeholder="모든 저자명을 입력하세요" ${disabledAttr}>
                </div>

                <!-- 학술지명 -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">학술지명</label>
                    <input type="text" id="journal-name" value="${data.journalName || ''}"
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028] ${disabledClass}"
                           placeholder="학술지명을 입력하세요" ${disabledAttr}>
                </div>

                <!-- 학술지 구분 -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">학술지 구분</label>
                    <div class="flex-1">
                        <p class="text-xs text-red-600 mb-2">* 한국연구재단(www.kci.go.kr)에서 확인 가능</p>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="radio" name="journal-type" value="KCI" ${data.journalType === 'KCI' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">KCI 등재(후보지)</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="journal-type" value="SCI_SSCI_AHCI" ${data.journalType === 'SCI_SSCI_AHCI' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">SCI/SSCI/A&HCI</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="journal-type" value="SCIE" ${data.journalType === 'SCIE' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">SCIE</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="journal-type" value="SCOPUS" ${data.journalType === 'SCOPUS' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">SCOPUS</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="journal-type" value="DOMESTIC" ${data.journalType === 'DOMESTIC' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">기타(국내)</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="journal-type" value="INTERNATIONAL" ${data.journalType === 'INTERNATIONAL' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">기타(국외)</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 발행기관 -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">발행기관</label>
                    <input type="text" id="journal-publisher" value="${data.publisher || ''}"
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028] ${disabledClass}"
                           placeholder="발행기관을 입력하세요" ${disabledAttr}>
                </div>

                <!-- 집/권/호 -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">집/권/호</label>
                    <input type="text" id="journal-volume-issue" value="${data.volumeIssue || ''}"
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028] ${disabledClass}"
                           placeholder="예: 10권 2호" ${disabledAttr}>
                </div>

                <!-- 발행년월일 -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">발행년월일</label>
                    <input type="date" id="journal-publish-date" value="${data.publishDate || ''}"
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028] ${disabledClass}" ${disabledAttr}>
                </div>

                <!-- 수록 Page -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">수록 Page</label>
                    <input type="text" id="journal-pages" value="${data.pages || ''}"
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028] ${disabledClass}"
                           placeholder="예: 123-145" ${disabledAttr}>
                </div>

                <!-- 증빙서류 -->
                <div class="flex items-start gap-4">
                    <label class="text-sm font-medium text-gray-700 w-24 flex-shrink-0 pt-2">증빙서류<br>(심사평가)</label>
                    <div class="flex-1">
                        <p class="text-xs text-red-600 mb-2">* 승인서류는 첨부파일 또는 우편/팩스로 제출 필수</p>
                        <div class="space-y-2 mb-3">
                            <label class="flex items-center">
                                <input type="radio" name="journal-proof-type" value="confirmation" ${data.proofDocType === 'confirmation' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">논문게재 확인서</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="journal-proof-type" value="scheduled" ${data.proofDocType === 'scheduled' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">논문게재 예정증명서</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="journal-proof-type" value="proof" ${data.proofDocType === 'proof' ? 'checked' : ''}
                                       class="w-4 h-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]" ${disabledAttr}>
                                <span class="ml-2 text-sm text-gray-900">논문게재 증빙서</span>
                            </label>
                        </div>

                        <!-- 파일업로드 -->
                        <div class="flex items-center gap-3">
                            <input type="file" id="journal-file" class="hidden" accept=".pdf" ${disabledAttr}>
                            <button type="button" data-action="select-file"
                                    class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm ${isViewMode ? 'opacity-50 cursor-not-allowed' : ''}"
                                    ${isViewMode ? 'disabled' : ''}>
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                파일 선택
                            </button>
                            <span class="text-xs text-gray-500">PDF만 업로드 가능. 최대 30MB</span>
                        </div>
                        <div id="file-info" class="text-sm text-gray-600 mt-2">
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
                ${!isViewMode ? `
                <div class="flex justify-end gap-3 pt-6 border-t">
                    <button data-action="back-to-list"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        취소
                    </button>
                    <button data-action="save-journal"
                            class="px-6 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034]">
                        심사신청
                    </button>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    return html;
}

// 상세/보기 화면
function renderJournalDetailView() {
    const submission = journalSubmissions.find(s => s.id === journalCurrentSubmissionId);
    if (!submission || submission.status !== 'submitted') return '';

    return `
        <div class="mb-4 flex justify-between items-center">
            <button data-action="back-to-list" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                목록으로
            </button>
            <button data-action="edit-journal" data-id="${submission.id}"
                    class="px-4 py-2 border border-[#6A0028] text-[#6A0028] rounded-md hover:bg-[#6A0028] hover:text-white transition-colors">
                수정
            </button>
        </div>

        ${renderJournalSubmissionForm(true)}
    `;
}

// 수정 모드로 전환
function editJournalSubmission(id) {
    journalCurrentSubmissionId = id;
    journalCurrentView = 'submit';
    renderScreen();
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

// 학술지 논문 제출/수정 저장
function saveJournalSubmission() {
    const title = document.getElementById('journal-title').value.trim();
    const desiredExamDate = document.getElementById('journal-desired-exam-date').value;
    const file = document.getElementById('journal-file').files[0];

    const submission = journalSubmissions.find(s => s.id === journalCurrentSubmissionId);
    const isEdit = submission.status === 'submitted';

    if (!title) {
        alert('논문 제목을 입력해주세요.');
        return;
    }

    if (!desiredExamDate) {
        alert('희망심사일을 선택해주세요.');
        return;
    }

    if (!isEdit && !file) {
        alert('파일을 선택해주세요.');
        return;
    }

    const confirmMessage = isEdit ? '학술지 논문을 수정하시겠습니까?' : '학술지 논문을 제출하시겠습니까?';
    if (confirm(confirmMessage)) {
        // 실제로는 서버로 전송
        submission.status = 'submitted';
        submission.submittedData = {
            title: title,
            desiredExamDate: desiredExamDate,
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

        console.log('학술지 논문 저장:', submission);

        alert(isEdit ? '학술지 논문이 수정되었습니다.' : '학술지 논문이 제출되었습니다.');
        backToList();
    }
}

// 총평 보기 모달 표시
function showReviewCommentsModal(comments) {
    if (!comments || comments.trim() === '') {
        alert('평가 의견이 없습니다.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="p-6 border-b">
                <h3 class="text-xl font-semibold text-gray-800">평가 총평</h3>
            </div>
            <div class="p-6">
                <div class="whitespace-pre-wrap text-gray-700">${comments}</div>
            </div>
            <div class="p-6 border-t flex justify-end">
                <button data-action="close-modal" class="px-6 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034]">
                    닫기
                </button>
            </div>
        </div>
    `;

    // 모달 닫기 이벤트
    modal.addEventListener('click', function(e) {
        const target = e.target;
        if (target === modal || target.closest('[data-action="close-modal"]')) {
            document.body.removeChild(modal);
        }
    });

    document.body.appendChild(modal);
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
        .journal-table {
            table-layout: fixed;
            width: 100%;
        }
        .journal-table th,
        .journal-table td {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;
    document.head.appendChild(style);
})();

// 전역 함수 등록
window.initJournalSubmission = initJournalSubmission;
window.submitJournal = submitJournal;
window.viewJournalSubmission = viewJournalSubmission;
window.backToList = backToList;
window.editJournalSubmission = editJournalSubmission;
window.handleFileSelect = handleFileSelect;
window.saveJournalSubmission = saveJournalSubmission;
window.showReviewCommentsModal = showReviewCommentsModal;
