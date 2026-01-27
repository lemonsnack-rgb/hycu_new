/**
 * 학생용 논문 지도 현황 - 상세 화면
 * Version: 20260107001
 *
 * 권한:
 * - 전체 평가: 읽기 전용, 댓글 작성/수정 가능 (본인 것만)
 * - 첨삭: 읽기 전용, 댓글 작성/수정 가능 (본인 것만)
 * - 판서/하이라이트: 읽기 전용
 * - PDF 도구: 선택 도구만 사용 가능
 */

// ==================== 상세 화면 열기 (페이지 전환) ====================
function openStudentGuidanceStatusDetail(requestId) {
    const request = StudentGuidanceDataService.getStudentGuidanceRequestById(requestId);
    if (!request) {
        alert('제출물을 찾을 수 없습니다.');
        return;
    }

    const feedbackData = StudentGuidanceDataService.getStudentGuidanceFeedbackData(requestId);

    // 상세 화면 생성 및 표시 (모달 방식)
    const detailScreen = createStudentGuidanceStatusDetailScreen(request, feedbackData);
    document.body.appendChild(detailScreen);

    // 백드롭 클릭으로 닫기
    detailScreen.addEventListener('click', (e) => {
        if (e.target === detailScreen) {
            closeStudentGuidanceStatusDetail();
        }
    });

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeStudentGuidanceStatusDetail();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // 메모 버튼 표시 로직 - 항상 표시
    setTimeout(() => {
        const memo = request.memo || '';
        const memoBtn = document.getElementById('student-memo-btn');
        if (memoBtn) {
            memoBtn.style.display = 'inline-block';
            memoBtn.style.visibility = 'visible';
            memoBtn.style.opacity = '1';
            memoBtn.setAttribute('data-memo', memo);
        }
    }, 100);

    // PDF 로드
    setTimeout(() => {
        // 교수용 viewer/tools가 사용하는 전역 변수 설정
        window._currentFeedbackCtx = {
            id: requestId,
            fileUrl: request.fileUrl,
            data: feedbackData
        };
        window.currentFeedbackId = requestId;

        // 교수용 함수들이 참조하는 데이터 서비스 연결
        if (!window.FeedbackDataService) {
            window.FeedbackDataService = {
                getFeedbackData: (id) => StudentGuidanceDataService.getStudentGuidanceFeedbackData(id),
                getFeedbackRequestById: (id) => StudentGuidanceDataService.getStudentGuidanceRequestById(id),
                addComment: (feedbackId, annotationId, comment, isMainComment) => {
                    return StudentGuidanceDataService.addStudentComment(feedbackId, annotationId, comment);
                },
                addGeneralFeedback: (feedbackId, feedback) => {
                    return StudentGuidanceDataService.addStudentGeneralComment(feedbackId, feedback);
                },
                getUserById: (userId) => StudentGuidanceDataService.getProfessorById(userId),
                getCurrentUser: () => CURRENT_STUDENT
            };
        }

        // 현재 사용자를 CURRENT_USER로도 참조 가능하게
        if (!window.CURRENT_USER) {
            window.CURRENT_USER = CURRENT_STUDENT;
        }

        // 디버그: 현재 사용자 확인
        console.log('✅ 학생용 논문 지도 현황 - 현재 사용자:', window.CURRENT_USER);

        // Mock 데이터의 generalFeedbackThread를 window._generalComments로 매핑
        if (feedbackData && feedbackData.generalFeedbackThread) {
            window._generalComments = window._generalComments || {};
            window._generalComments[requestId] = feedbackData.generalFeedbackThread.map(item => ({
                ...item,
                text: item.text,
                ts: item.ts || new Date(item.timestamp).getTime(),
                attach: item.attachments || []
            }));
            console.log('✅ 전체 평가 데이터 매핑 완료:', window._generalComments[requestId]);
        }

        // 제출 이력 사이드바 생성
        ensureStudentSubmissionSidebar(request);

        // 교수용 함수를 그대로 사용 (viewer.js와 tools.js가 교수용 그대로 복사되어 있음)
        initPDFViewer(requestId, request.fileUrl, feedbackData);

        renderGeneralThread(requestId);
        refreshInlineTabMarker();
    }, 100);
}

// ==================== 상세 화면 생성 ====================
function createStudentGuidanceStatusDetailScreen(request, feedbackData) {
    const screen = document.createElement('div');
    screen.className = 'feedback-detail-screen';
    screen.id = 'student-guidance-detail-screen';

    screen.innerHTML = `
        <div class="feedback-detail-content">
            <!-- 헤더: 논문 정보 + 닫기 버튼 -->
            <div class="px-6 py-3 border-b bg-white">
                <div class="flex items-center justify-between">
                    <!-- 좌측: 논문 정보 -->
                    <div class="text-xs text-gray-700 flex-1 mr-4">
                        <span class="font-semibold">논문명:</span>
                        <span title="${request.thesisTitle || request.documentTitle}">${request.thesisTitle && request.thesisTitle.length > 30 ? request.thesisTitle.substring(0, 30) + '...' : request.thesisTitle || request.documentTitle || '논문명'}</span>
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold text-[#6A0028]">${request.stage || '연구계획서'}</span>
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">학번:</span> ${request.studentNumber || '-'}
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">학부(과)전공:</span> ${request.graduate || '-'} / ${request.major || '-'}
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">성명:</span> ${request.studentName || '-'}
                    </div>

                    <!-- 우측: 닫기 버튼 (학생은 피드백 완료 버튼 없음) -->
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <button onclick="closeStudentGuidanceStatusDetail()"
                                class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 3단 레이아웃 -->
            <div class="feedback-layout">
                <!-- 왼쪽: 제출 이력 -->
                <div class="history-panel">
                    <h4 class="text-sm font-bold text-gray-700 mb-3">제출 이력</h4>
                    <div class="space-y-2">
                        <div class="bg-white p-3 rounded border-l-4 border-[#6A0028]">
                            <!-- 파일명만 표시 (레이블 제거) -->
                            <p class="text-xs text-gray-600 break-words mb-2" title="${request.fileName ? request.fileName.replace(/\.pdf$/i, '') : '파일명 없음'}">
                                ${(() => {
                                    const fileName = request.fileName ? request.fileName.replace(/\.pdf$/i, '') : '파일명 없음';
                                    return fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName;
                                })()}
                            </p>

                            <!-- 제출일시: yyyy-mm-dd hh:mm 형식으로 한 행 표시 -->
                            <p class="text-xs text-gray-600">
                                <span class="font-semibold">제출일시:</span> ${(() => {
                                    const dateStr = request.date || '';
                                    if (!dateStr) return '-';
                                    const parts = dateStr.split(' ');
                                    if (parts.length >= 2) {
                                        const time = parts[1].substring(0, 5);
                                        return `${parts[0]} ${time}`;
                                    }
                                    return parts[0];
                                })()}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 중앙: PDF 뷰어 -->
                <div class="pdf-panel">
                    <!-- 툴바 -->
                    <div class="pdf-toolbar">
                        <!-- 페이지 네비게이션 -->
                        <div class="flex items-center gap-2">
                            <button id="prev-page" class="pdf-toolbar-btn" title="이전 페이지">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            <span class="text-sm text-gray-700">
                                <span id="page-num">1</span> / <span id="page-count">0</span>
                            </span>
                            <button id="next-page" class="pdf-toolbar-btn" title="다음 페이지">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>

                        <div class="w-px h-6 bg-gray-300"></div>

                        <!-- 🔒 학생은 선택 도구만 표시 -->
                        <div class="flex items-center gap-1">
                            <button id="select-tool" class="pdf-toolbar-btn active" title="선택 및 텍스트 드래그">
                                <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
                                </svg>
                            </button>
                        </div>

                        <div class="w-px h-6 bg-gray-300"></div>

                        <!-- 확대/축소 -->
                        <div class="flex items-center gap-2">
                            <button id="zoom-out-btn" class="pdf-toolbar-btn" title="축소">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <span id="zoom-level" class="text-xs font-semibold text-gray-700 w-12 text-center">100%</span>
                            <button id="zoom-in-btn" class="pdf-toolbar-btn" title="확대">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button id="fit-page-btn" class="pdf-toolbar-btn text-xs px-2" title="페이지 맞춤">
                                맞춤
                            </button>
                        </div>
                    </div>

                    <!-- PDF 렌더링 영역 -->
                    <div id="pdf-render-wrapper">
                        <div id="pdf-render-area">
                            <canvas id="pdf-canvas"></canvas>
                            <div id="text-layer"></div>
                            <canvas id="interaction-canvas"></canvas>
                            <div id="marker-container"></div>
                        </div>
                    </div>
                </div>

                <!-- 오른쪽: 코멘트 패널 -->
                <div class="comment-panel">
                    <div class="p-4 border-b bg-gray-50">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="text-sm font-bold text-gray-700">피드백</h4>
                            <button id="student-memo-btn"
                                    onclick="toggleStudentMemo()"
                                    style="display: none;"
                                    class="text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                                메모
                            </button>
                        </div>
                        <!-- 탭 UI -->
                        <div class="tabs" role="tablist" id="feedback-tabs-container">
                            <button id="tab-general" role="tab" aria-selected="true"
                                    class="tab active" onclick="switchStudentFeedbackTab('general')">
                                전체 평가
                            </button>
                            <button id="tab-inline" role="tab" aria-selected="false"
                                    class="tab" onclick="switchStudentFeedbackTab('inline')">
                                첨삭 <span id="tab-inline-badge" class="tab-badge hidden">0</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto p-4" id="comment-panel-content">
                        <!-- 전체 평가 탭 -->
                        <div id="general-feedback-tab">
                            <h5 class="text-xs font-bold text-gray-700 mb-2">💬 전체 평가</h5>
                            <div id="general-feedback-thread" class="space-y-2 mb-3">
                                <!-- 동적 렌더링 -->
                            </div>
                        </div>

                        <!-- 첨삭 탭 -->
                        <div id="inline-feedback-tab" style="display: none;">
                            <h5 class="text-xs font-bold text-gray-700 mb-2">📍 첨삭</h5>
                            <div id="inline-feedback" class="space-y-2">
                                <!-- 동적 렌더링 -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return screen;
}

// ==================== 제출 이력 사이드바 생성 (동적) ====================
function ensureStudentSubmissionSidebar(request) {
    // 이미 있으면 업데이트만 수행
    let container = document.getElementById('student-submission-history');
    const isNew = !container;

    if (isNew) {
        container = document.createElement('div');
        container.id = 'student-submission-history';
        container.className = 'submission-history';
        document.body.appendChild(container);
    }

    // 현재 문서의 제출 이력 가져오기
    const currentRequestId = window._currentStudentGuidanceCtx?.id;
    if (!currentRequestId) {
        console.warn('❌ currentRequestId가 없습니다');
        return;
    }

    const documentId = StudentGuidanceDataService.getDocumentIdByRequestId(currentRequestId);
    if (!documentId) {
        console.warn('❌ documentId를 찾을 수 없습니다');
        return;
    }

    const submissionHistory = StudentGuidanceDataService.getSubmissionHistory(documentId);

    // 동적으로 HTML 생성
    const historyListHtml = submissionHistory.map((submission, index) => {
        const isLatest = index === 0;
        const isActive = submission.id === currentRequestId;
        const versionLabel = `v${submission.version}`;
        const dateLabel = submission.uploadDate || submission.date || '-';
        const metaLabel = isLatest ? `최신 · ${dateLabel}` : dateLabel;

        return `
            <li data-request-id="${submission.id}"
                data-version="${submission.version}"
                class="${isActive ? 'active' : ''}">
                <strong>${versionLabel}</strong>
                <span class="sh-meta">${metaLabel}</span>
            </li>
        `;
    }).join('');

    container.innerHTML = `
        <div class="sh-header">제출이력 (${submissionHistory.length}건)</div>
        <ul class="sh-list">
            ${historyListHtml}
        </ul>
    `;

    // 이벤트 리스너 (처음 생성 시에만 추가, 항상 최신 상태 참조)
    if (isNew) {
        container.addEventListener('click', (e) => {
            const li = e.target.closest('li[data-request-id]');
            if (!li) return;

            const targetRequestId = li.getAttribute('data-request-id');
            const currentId = window._currentStudentGuidanceCtx?.id;

            // 이미 선택된 버전이면 무시
            if (targetRequestId === currentId) return;

            // 다른 버전으로 전환
            switchToStudentSubmissionVersion(targetRequestId);
        });
    }
}

// ==================== 제출 버전 전환 ====================
function switchToStudentSubmissionVersion(targetRequestId) {
    console.log(`🔄 제출 버전 전환 시작: ${targetRequestId}`);

    // 1. 타겟 제출물 데이터 가져오기
    const targetRequest = StudentGuidanceDataService.getStudentGuidanceRequestById(targetRequestId);
    if (!targetRequest) {
        alert('제출물을 찾을 수 없습니다.');
        return;
    }

    const targetFeedbackData = StudentGuidanceDataService.getStudentGuidanceFeedbackData(targetRequestId);

    // 2. 현재 PDF 뷰어 정리
    if (window.fabricCanvas) {
        try {
            window.fabricCanvas.dispose();
        } catch (e) {
            console.warn('fabricCanvas dispose 오류:', e);
        }
        window.fabricCanvas = null;
    }
    if (window.pdfDoc) {
        try {
            window.pdfDoc.destroy();
        } catch (e) {
            console.warn('pdfDoc destroy 오류:', e);
        }
        window.pdfDoc = null;
    }

    // 3. 전역 컨텍스트 업데이트
    window._currentStudentGuidanceCtx = {
        id: targetRequestId,
        fileUrl: targetRequest.fileUrl,
        data: targetFeedbackData
    };
    window._currentFeedbackCtx = {
        id: targetRequestId,
        fileUrl: targetRequest.fileUrl,
        data: targetFeedbackData
    };

    // 4. PDF 뷰어 재초기화
    if (typeof initPDFViewer === 'function') {
        initPDFViewer(targetRequestId, targetRequest.fileUrl, targetFeedbackData);
    }

    // 5. 첨삭/총평 UI 업데이트
    if (typeof renderCommentPanel === 'function') {
        renderCommentPanel();
    }
    if (typeof renderGeneralThread === 'function') {
        renderGeneralThread(targetRequestId);
    }
    if (typeof refreshInlineTabMarker === 'function') {
        refreshInlineTabMarker();
    }

    // 6. 제출 이력 사이드바 업데이트 (active 상태 변경)
    ensureStudentSubmissionSidebar(targetRequest);

    // 7. 학생 정보 영역 업데이트
    updateStudentInfoSection(targetRequest);

    console.log(`✅ 버전 전환 완료: v${targetRequest.version}`);
    if (typeof showToast === 'function') {
        showToast(`v${targetRequest.version}으로 전환되었습니다.`, 'success');
    }
}

// ==================== 학생 정보 영역 업데이트 ====================
function updateStudentInfoSection(request) {
    const infoSection = document.querySelector('.feedback-detail-content .px-6.py-2.border-b.bg-gray-50 .text-xs.text-gray-700');
    if (!infoSection) {
        console.warn('학생 정보 영역을 찾을 수 없습니다');
        return;
    }

    infoSection.innerHTML = `
        <span class="font-semibold">논문명:</span>
        <span title="${request.thesisTitle || request.documentTitle}">${
            request.thesisTitle && request.thesisTitle.length > 30
                ? request.thesisTitle.substring(0, 30) + '...'
                : request.thesisTitle || request.documentTitle || '논문명'
        }</span>
        <span class="mx-2 text-gray-400">|</span>
        <span class="font-semibold text-[#6A0028]">${request.stage || request.guidanceStage || '연구계획서'}</span>
        <span class="mx-2 text-gray-400">|</span>
        <span class="font-semibold">학번:</span> ${request.studentNumber || '-'}
        <span class="mx-2 text-gray-400">|</span>
        <span class="font-semibold">학부(과)전공:</span> ${request.graduate || '-'} / ${request.major || '-'}
        <span class="mx-2 text-gray-400">|</span>
        <span class="font-semibold">성명:</span> ${request.studentName || '-'}
    `;
}

// ==================== 상세 화면 닫기 (모달 닫기) ====================
function closeStudentGuidanceStatusDetail() {
    const screen = document.getElementById('student-guidance-detail-screen');
    if (screen) {
        screen.remove();
    }

    // 제출 이력 사이드바 제거
    const submissionHistory = document.getElementById('student-submission-history');
    if (submissionHistory) {
        submissionHistory.remove();
    }

    // 전역 변수 정리
    if (window._currentStudentGuidanceCtx) {
        window._currentStudentGuidanceCtx = null;
    }
    if (window._currentFeedbackCtx) {
        window._currentFeedbackCtx = null;
    }
    if (window.currentFeedbackId) {
        window.currentFeedbackId = null;
    }
}

// ==================== 표절률 색상 ====================
function getStudentPlagiarismColorClass(copyScore, gptScore) {
    const copyNum = parseInt(copyScore);
    const gptNum = parseInt(gptScore);

    if (copyNum >= 15 || gptNum >= 10) {
        return 'text-red-600';
    } else if (copyNum >= 10 || gptNum >= 7) {
        return 'text-yellow-600';
    }
    return 'text-gray-700';
}

// ==================== 표절 리포트 다운로드 ====================
function downloadStudentPlagiarismReport(type, requestId) {
    const request = StudentGuidanceDataService.getStudentGuidanceRequestById(requestId);
    if (!request) {
        alert('제출물을 찾을 수 없습니다.');
        return;
    }

    let reportUrl;
    if (type === 'combined' || type === 'copykiller') {
        reportUrl = request.copyKillerReportUrl || `https://copykiller.hanyang.ac.kr/report/${requestId}`;
    } else if (type === 'gptkiller') {
        reportUrl = request.gptKillerReportUrl || `https://gptkiller.hanyang.ac.kr/report/${requestId}`;
    }

    window.open(reportUrl, '_blank', 'width=1200,height=800,noopener,noreferrer');
}

// ==================== 탭 전환 ====================
function switchStudentFeedbackTab(tab) {
    // 교수용 함수 호출 (viewer.js의 switchFeedbackTab)
    if (typeof switchFeedbackTab === 'function') {
        switchFeedbackTab(tab);
    } else {
        // Fallback: 직접 처리
        const generalTab = document.getElementById('general-feedback-tab');
        const inlineTab = document.getElementById('inline-feedback-tab');
        const generalBtn = document.getElementById('tab-general');
        const inlineBtn = document.getElementById('tab-inline');

        if (generalTab && inlineTab) {
            if (tab === 'general') {
                generalTab.style.display = 'block';
                inlineTab.style.display = 'none';
                if (generalBtn) {
                    generalBtn.classList.add('active');
                    generalBtn.setAttribute('aria-selected', 'true');
                }
                if (inlineBtn) {
                    inlineBtn.classList.remove('active');
                    inlineBtn.setAttribute('aria-selected', 'false');
                }
            } else {
                generalTab.style.display = 'none';
                inlineTab.style.display = 'block';
                if (generalBtn) {
                    generalBtn.classList.remove('active');
                    generalBtn.setAttribute('aria-selected', 'false');
                }
                if (inlineBtn) {
                    inlineBtn.classList.add('active');
                    inlineBtn.setAttribute('aria-selected', 'true');
                }
            }
        }
    }
}

// Export
window.openStudentGuidanceStatusDetail = openStudentGuidanceStatusDetail;
window.closeStudentGuidanceStatusDetail = closeStudentGuidanceStatusDetail;
window.downloadStudentPlagiarismReport = downloadStudentPlagiarismReport;
window.switchStudentFeedbackTab = switchStudentFeedbackTab;
window.ensureStudentSubmissionSidebar = ensureStudentSubmissionSidebar;
window.switchToStudentSubmissionVersion = switchToStudentSubmissionVersion;
window.updateStudentInfoSection = updateStudentInfoSection;

console.log('✅ 학생용 논문 지도 현황 상세 화면 로드 완료');
