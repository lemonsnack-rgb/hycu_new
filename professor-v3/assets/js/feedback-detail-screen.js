// Phase 4: 온라인피드백 관리 - 상세 화면 (페이지 전환 방식)

// ==================== 상세 화면 열기 (페이지 전환) ====================
function openFeedbackDetailScreen(feedbackId) {
    const request = FeedbackDataService.getFeedbackRequestById(feedbackId);
    if (!request) {
        alert('제출물을 찾을 수 없습니다.');
        return;
    }

    const feedbackData = FeedbackDataService.getFeedbackData(feedbackId);

    // 목록 화면 숨기기
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }

    // 상세 화면 생성 및 표시
    const detailScreen = createFeedbackDetailScreen(request, feedbackData);
    document.body.appendChild(detailScreen);

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeFeedbackDetailScreen();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // 자주 쓰는 코멘트 팝오버 생성
    if (!document.getElementById('quickmark-popover')) {
        createQuickMarkPopover();
    }

    // PDF 로드
    setTimeout(() => {
        window._currentFeedbackCtx = {id: feedbackId, fileUrl: request.fileUrl, data: feedbackData};

        // 제출 이력 사이드바 생성
        ensureSubmissionSidebar();

        initPDFViewer(feedbackId, request.fileUrl, feedbackData);

        // placeholder fix
        const ph = document.querySelector('#inline-feedback textarea, .inline-comment-input');
        if (ph) ph.setAttribute('placeholder','첨삭 내용을 입력하세요.');

        renderGeneralThread(feedbackId);
        refreshInlineTabMarker();
    }, 100);
}

// ==================== 상세 화면 생성 ====================
function createFeedbackDetailScreen(request, feedbackData) {
    const screen = document.createElement('div');
    screen.className = 'feedback-detail-screen';
    screen.id = 'feedback-detail-screen';

    const conflictWarning = feedbackData && feedbackData.lastModifiedBy &&
                           feedbackData.lastModifiedBy !== CURRENT_USER.id
        ? renderConflictWarning(feedbackData)
        : '';

    screen.innerHTML = `
        <div class="feedback-detail-content">
            <!-- 헤더: 목록으로 돌아가기 -->
            <div class="px-6 py-3 border-b bg-white flex items-center justify-between">
                <button onclick="closeFeedbackDetailScreen()" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
                <button onclick="completeFeedbackDetail()"
                        class="text-sm bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-[#8A0034] flex items-center gap-2 font-semibold transition-colors">
                    <i class="fas fa-check-double"></i>
                    <span>피드백 완료</span>
                </button>
            </div>

            <!-- 논문 정보 영역 -->
            <div class="px-6 py-3 border-b bg-gray-50">
                <div class="flex items-center justify-between gap-4">
                    <span class="text-sm font-medium text-gray-900 truncate" style="max-width: 50ch;">
                        ${request.thesisTitle || '논문명'}
                    </span>
                    <div class="text-sm text-gray-600 flex-shrink-0">
                        <span class="font-semibold ${getPlagiarismColorClass(request.copykillerScore, request.gptkillerScore)}">
                            CopyKiller: ${request.copykillerScore} <span class="text-gray-400 mx-1">/</span> GPT Killer: ${request.gptkillerScore} <a href="#" onclick="downloadPlagiarismReport('combined', '${request.id}'); event.preventDefault();" class="ml-2 text-[#6A0028] hover:underline text-xs">결과보고서(통합)</a>
                        </span>
                    </div>
                </div>
            </div>

            ${conflictWarning}

            <!-- 3단 레이아웃 -->
            <div class="feedback-layout">
                <!-- 왼쪽: 제출 이력 -->
                <div class="history-panel">
                    <h4 class="text-sm font-bold text-gray-700 mb-3">제출 이력</h4>
                    <div class="space-y-2">
                        <div class="bg-white p-3 rounded border-l-4 border-[#6A0028]">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="w-2 h-2 bg-[#FCE4EC]0 rounded-full"></span>
                                <span class="text-xs font-bold text-gray-700">v${feedbackData ? feedbackData.version : 1} (현재)</span>
                            </div>
                            <p class="text-xs text-gray-600">${request.date}</p>
                            ${feedbackData && feedbackData.lastModifiedBy ? `
                                <p class="text-xs text-gray-500 mt-1">
                                    수정: ${FeedbackDataService.getUserById(feedbackData.lastModifiedBy)?.name}
                                </p>
                            ` : ''}
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

                        <!-- 도구 -->
                        <div class="flex items-center gap-1">
                            <button id="select-tool" class="pdf-toolbar-btn active" title="선택 및 텍스트 드래그">
                                <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
                                </svg>
                            </button>
                            <button id="comment-tool" class="pdf-toolbar-btn" title="첨삭 영역 추가">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM9 9a1 1 0 100-2 1 1 0 000 2zm2 0a1 1 0 100-2 1 1 0 000 2zm2 0a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button id="drawing-tool" class="pdf-toolbar-btn" title="판서">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                </svg>
                            </button>
                            <button id="highlight-tool" class="pdf-toolbar-btn" title="하이라이트">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button id="eraser-tool" class="pdf-toolbar-btn" title="지우개">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 9.656a2 2 0 000-2.828L15.172 1a2 2 0 00-2.828 0L3 12z" />
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

                <!-- 오른쪽: 코멘트 패널 (ID 40: 탭 구분, ID 43: 용어 변경) -->
                <div class="comment-panel">
                    <div class="p-4 border-b bg-gray-50">
                        <h4 class="text-sm font-bold text-gray-700 mb-3">피드백</h4>
                        <!-- 개선된 탭 UI -->
                        <div class="tabs" role="tablist">
                            <button id="tab-general" role="tab" aria-selected="true"
                                    class="tab active" onclick="switchFeedbackTab('general')">
                                전체 평가
                            </button>
                            <button id="tab-inline" role="tab" aria-selected="false"
                                    class="tab" onclick="switchFeedbackTab('inline')">
                                첨삭 <span id="tab-inline-badge" class="tab-badge hidden">0</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto p-4" id="comment-panel-content">
                        <!-- ID 43: 총평 → 전체 평가 탭 -->
                        <div id="general-feedback-tab">
                            <h5 class="text-xs font-bold text-gray-700 mb-2">💬 전체 평가</h5>
                            <div id="general-feedback-thread" class="space-y-2 mb-3">
                                <!-- 동적 렌더링 -->
                            </div>
                            <!-- 입력창은 조건부 표시 -->
                            <div id="general-feedback-input-section" class="relative">
                                <textarea id="general-feedback-input"
                                          class="w-full p-2 border rounded-md text-sm resize-none"
                                          rows="3"
                                          placeholder="전체 평가를 입력하세요..."></textarea>
                                <div class="flex gap-2 mt-2 flex-wrap">
                                    <button onclick="addGeneralFeedback()" class="text-xs bg-[#6A0028] text-white px-3 py-1.5 rounded-md hover:bg-[#8A0034] flex items-center gap-1">
                                        <i class="fas fa-paper-plane"></i>
                                        <span>등록</span>
                                    </button>
                                    <button class="quickmark-btn text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 flex items-center gap-1" data-target="general-feedback-input">
                                        <i class="fas fa-star"></i>
                                        <span>자주 쓰는 코멘트</span>
                                    </button>
                                    <button onclick="uploadAttachment('general')" class="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 flex items-center gap-1">
                                        <i class="fas fa-paperclip"></i>
                                        <span>첨부</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- ID 43: 페이지 코멘트 → 첨삭 탭 -->
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

// ==================== 제출 이력 사이드바 생성 ====================
function ensureSubmissionSidebar() {
    if (document.getElementById('submission-history')) return;

    const container = document.createElement('div');
    container.id = 'submission-history';
    container.className = 'submission-history';
    container.innerHTML = `
        <div class="sh-header">제출이력</div>
        <ul class="sh-list">
            <li data-ver="v3" class="active"><strong>v3</strong> <span class="sh-meta">최신 · 2025-11-19</span></li>
            <li data-ver="v2"><strong>v2</strong> <span class="sh-meta">2025-11-14</span></li>
            <li data-ver="v1"><strong>v1</strong> <span class="sh-meta">2025-11-07</span></li>
        </ul>
    `;

    // Insert directly into body for fixed positioning to work correctly
    document.body.appendChild(container);

    container.addEventListener('click', (e) => {
        const li = e.target.closest('li[data-ver]');
        if (!li) return;
        container.querySelectorAll('li').forEach(n => n.classList.remove('active'));
        li.classList.add('active');
        const ver = li.getAttribute('data-ver');
        switchPdfVersion(ver);
    });

    // current version badge text
    window._currentVersionLabel = function(ver) {
        try {
            container.querySelectorAll('li').forEach(n => n.classList.remove('active'));
            container.querySelector('li[data-ver="'+ver+'"]').classList.add('active');
        } catch(_) {}
    };
}

// ==================== 상세 화면 닫기 (목록으로 돌아가기) ====================
function closeFeedbackDetailScreen() {
    const screen = document.getElementById('feedback-detail-screen');
    if (screen) {
        screen.remove();
    }

    // 목록 화면 다시 표시
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }

    // PDF 뷰어 관련 정리 (cleanup)
    // 1. 버전 목록(submission-history) 제거
    const submissionHistory = document.getElementById('submission-history');
    if (submissionHistory) {
        submissionHistory.remove();
    }

    // 2. 전역 변수 정리
    if (window._currentVersionLabel) {
        window._currentVersionLabel = null;
    }
    if (window._currentFeedbackCtx) {
        window._currentFeedbackCtx = null;
    }

    // 3. QuickMark 팝오버 제거
    const quickmarkPopover = document.getElementById('quickmark-popover');
    if (quickmarkPopover) {
        quickmarkPopover.remove();
    }
}

// ==================== 피드백 완료 (상세 화면용) ====================
function completeFeedbackDetail() {
    // 현재 피드백 ID 가져오기
    const feedbackId = window._currentFeedbackCtx?.id;
    if (!feedbackId) {
        alert('피드백 정보를 찾을 수 없습니다.');
        return;
    }

    // 빈 첨삭 검사 (feedback-tools.js의 annotations 전역 변수 사용)
    const emptyComments = [];

    if (window.annotations) {
        let globalCommentIndex = 1;

        // 모든 페이지 순회
        for (const pageNum in window.annotations) {
            const pageAnnotations = window.annotations[pageNum];
            if (!pageAnnotations) continue;

            // 각 페이지의 첨삭 검사
            pageAnnotations.forEach(annot => {
                // customType이 'comment'인 첨삭 영역만 검사
                if (annot.customType === 'comment') {
                    // comments 배열이 없거나 비어있으면 빈 첨삭
                    if (!annot.comments || annot.comments.length === 0) {
                        emptyComments.push(`페이지 ${pageNum} - 첨삭 #${globalCommentIndex}`);
                    } else {
                        // comments[0].text가 비어있으면 빈 첨삭
                        const mainText = annot.comments[0]?.text || '';
                        if (!mainText.trim()) {
                            emptyComments.push(`페이지 ${pageNum} - 첨삭 #${globalCommentIndex}`);
                        }
                    }
                    globalCommentIndex++;
                }
            });
        }
    }

    // 빈 첨삭이 있으면 경고
    if (emptyComments.length > 0) {
        alert(`저장되지 않은 첨삭이 있습니다.\n\n다음 항목의 내용을 입력해주세요:\n\n${emptyComments.join('\n')}`);
        return;
    }

    // 완료 확인
    if (!confirm('피드백을 완료 처리하시겠습니까?\n완료 후에는 목록에서 "완료" 상태로 표시됩니다.')) {
        return;
    }

    // 피드백 완료 처리
    const success = FeedbackDataService.completeFeedbackRequest(feedbackId);

    if (success) {
        alert('피드백이 완료 처리되었습니다.');
        closeFeedbackDetailScreen();

        // 목록 새로고침
        if (window.renderFeedbackList) {
            window.renderFeedbackList();
        }
    } else {
        alert('피드백 완료 처리 중 오류가 발생했습니다.');
    }
}

// ==================== 충돌 경고 렌더링 ====================
function renderConflictWarning(feedbackData) {
    // 정책 변경: 동시 수정을 허용하고 편집 중 정보를 제공하지 않음
    return '';
}

// ==================== 표절률 색상 ====================
function getPlagiarismColorClass(copyScore, gptScore) {
    const copyNum = parseInt(copyScore);
    const gptNum = parseInt(gptScore);

    if (copyNum >= 15 || gptNum >= 10) {
        return 'text-red-600';
    } else if (copyNum >= 10 || gptNum >= 7) {
        return 'text-yellow-600';
    }
    return 'text-gray-700';
}

// Export
window.openFeedbackDetailScreen = openFeedbackDetailScreen;
window.closeFeedbackDetailScreen = closeFeedbackDetailScreen;
window.completeFeedbackDetail = completeFeedbackDetail;
window.ensureSubmissionSidebar = ensureSubmissionSidebar;
