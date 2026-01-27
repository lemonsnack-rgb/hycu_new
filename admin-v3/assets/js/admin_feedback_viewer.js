// Phase 4: 온라인피드백 관리 - PDF 뷰어

// PDF.js 워커 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js';

// ==================== PDF 뷰어 열기 ====================
function openFeedbackViewer(feedbackId) {
    const request = FeedbackDataService.getFeedbackRequestById(feedbackId);
    if (!request) {
        alert('제출물을 찾을 수 없습니다.');
        return;
    }
    
    const feedbackData = FeedbackDataService.getFeedbackData(feedbackId);
    
    // 모달 생성
    const modal = createFeedbackModal(request, feedbackData);
    
    // 백드롭 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFeedbackModal();
        }
    });
    
    document.body.appendChild(modal);

    // 메모 버튼 표시 로직
    setTimeout(() => {
        const memo = request.memo || '';
        const memoBtn = document.getElementById('student-memo-btn');
        if (memoBtn) {
            if (memo && memo.trim() !== '') {
                memoBtn.style.display = 'inline-block';
                memoBtn.style.visibility = 'visible';
                memoBtn.style.opacity = '1';
                memoBtn.setAttribute('data-memo', memo);
            } else {
                memoBtn.style.display = 'none';
            }
        }
    }, 50);

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeFeedbackModal();
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
        
// injected: submission history sidebar (left)
(function ensureSubmissionSidebar(){
  if (document.getElementById('submission-history')) return;
  const wrap = document.querySelector('.viewer-wrap') || document.body;
  const container = document.createElement('div');
  container.id = 'submission-history';
  container.className = 'submission-history';
  container.innerHTML = `
    <div class="sh-header">제출이력</div>
    <ul class="sh-list">
      <li data-ver="v3" class="active"><strong>v3</strong> <span class="sh-meta">최신 · 2025-11-19</span></li>
      <li data-ver="v2"><strong>v2</strong> <span class="sh-meta">2025-11-14</span></li>
      <li data-ver="v1"><strong>v1</strong> <span class="sh-meta">2025-11-07</span></li>
    </ul>`;
  // Insert to left of main viewer container if possible
  const main = document.getElementById('pdf-viewer-root') || document.querySelector('.pdf-viewer-root') || document.body;
  main.parentNode.insertBefore(container, main);
  container.addEventListener('click', (e)=>{
    const li = e.target.closest('li[data-ver]');
    if (!li) return;
    container.querySelectorAll('li').forEach(n=>n.classList.remove('active'));
    li.classList.add('active');
    const ver = li.getAttribute('data-ver');
    switchPdfVersion(ver);
  });
  // current version badge text
  window._currentVersionLabel = function(ver){
    try{
      container.querySelectorAll('li').forEach(n=>n.classList.remove('active'));
      container.querySelector('li[data-ver="'+ver+'"]').classList.add('active');
    }catch(_){}
  }
})();

        initPDFViewer(feedbackId, request.fileUrl, feedbackData);
        // placeholder fix for inline tools if any
        const ph = document.querySelector('#inline-feedback textarea, .inline-comment-input');
        if (ph) ph.setAttribute('placeholder','첨삭 내용을 입력하세요.');
        renderGeneralThread(feedbackId);
        refreshInlineTabMarker();
    }, 100);
}

// ==================== 모달 생성 ====================
function createFeedbackModal(request, feedbackData) {
    const modal = document.createElement('div');
    modal.className = 'feedback-modal';
    modal.id = 'feedback-modal';
    
    const conflictWarning = feedbackData && feedbackData.lastModifiedBy && 
                           feedbackData.lastModifiedBy !== CURRENT_USER.id
        ? renderConflictWarning(feedbackData)
        : '';
    
    modal.innerHTML = `
        <div class="feedback-modal-content">
            <!-- 헤더 -->
            <div class="flex items-center justify-between p-4 border-b bg-white">
                <div class="flex items-center gap-4">
                    <!-- ID 39: 논문명 표시 -->
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-500">${request.thesisTitle || '논문명'}</span>
                        <h3 class="text-lg font-bold text-gray-800">
                            ${request.studentName} - ${request.file}
                        </h3>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        v${feedbackData ? feedbackData.version : 1}
                    </span>
                    <!-- ID 47: CopyKiller/GPT Killer 결과보고서 링크 -->
                    <div class="text-sm text-gray-600">
                        <span class="font-semibold ${getPlagiarismColorClass(request.copykillerScore, request.gptkillerScore)}">
                            CopyKiller: ${request.copykillerScore} <span class="text-gray-400 mx-1">/</span> GPT Killer: ${request.gptkillerScore} <a href="#" onclick="downloadPlagiarismReport('combined', '${request.id}'); event.preventDefault();" class="ml-2 text-[#6A0028] hover:underline text-xs">결과보고서(통합)</a>
                        </a>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <!-- 피드백 완료 버튼 추가 -->
                    <button onclick="completeFeedback()" 
                            class="text-sm bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-[#8A0034] flex items-center gap-2 font-semibold transition-colors">
                        <i class="fas fa-check-double"></i>
                        <span>피드백 완료</span>
                    </button>
                    <button onclick="closeFeedbackModal()" class="text-gray-500 hover:text-gray-700 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
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
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="text-sm font-bold text-gray-700">피드백</h4>
                            <button id="student-memo-btn"
                                    onclick="toggleStudentMemo()"
                                    style="display: none;"
                                    class="text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                                메모
                            </button>
                        </div>
                        <!-- 개선된 탭 UI -->
                        <div class="tabs" role="tablist" id="feedback-tabs-container">
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
    
    return modal;
}

// ==================== 충돌 경고 렌더링 (정책 변경: 동시수정 허용, 편집중 정보 미제공) ====================
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

// ==================== 모달 닫기 ====================
function closeFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.remove();
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

// ==================== 피드백 완료 ====================
function completeFeedback() {
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
        closeFeedbackModal();

        // 목록 새로고침
        if (window.renderFeedbackList) {
            window.renderFeedbackList();
        }
    } else {
        alert('피드백 완료 처리 중 오류가 발생했습니다.');
    }
}

// ==================== 자주 쓰는 코멘트 팝오버 추가 ====================
function createQuickMarkPopover() {
    const popover = document.createElement('div');
    popover.id = 'quickmark-popover';
    popover.className = 'fixed hidden bg-white border rounded-lg shadow-xl z-[150]';
    popover.style.width = '320px';
    
    popover.innerHTML = `
        <div class="p-3 border-b">
            <h4 class="font-bold text-sm text-gray-800">자주 쓰는 코멘트 관리</h4>
        </div>
        <div id="quickmark-list" class="max-h-48 overflow-y-auto p-2">
            <!-- 동적 렌더링 -->
        </div>
        <div class="p-3 bg-gray-50 border-t space-y-2">
            <div id="add-from-textarea-section" class="hidden">
                <input type="text" id="quickmark-title-from-text" 
                       placeholder="코멘트 제목 입력" 
                       class="w-full p-2 border rounded-md text-xs mb-2">
                <button id="add-quickmark-from-text-btn" 
                        class="w-full bg-yellow-100 text-red-900 px-3 py-1.5 rounded-md hover:bg-yellow-200 text-xs font-semibold">
                    이 내용 저장
                </button>
            </div>
            <div>
                <p class="text-xs font-semibold text-gray-700 mb-2">새 코멘트 직접 추가</p>
                <input type="text" id="quickmark-new-title" 
                       placeholder="코멘트 제목" 
                       class="w-full p-2 border rounded-md text-xs mb-2">
                <textarea id="quickmark-new-content" 
                          placeholder="코멘트 내용" 
                          class="w-full p-2 border rounded-md text-xs mb-2" rows="3"></textarea>
                <button id="add-quickmark-btn" 
                        class="w-full bg-red-900 text-white px-3 py-1.5 rounded-md hover:bg-red-800 text-xs font-semibold">
                    새 코멘트 추가
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popover);
    
    // 이벤트 리스너
    document.getElementById('add-quickmark-btn').addEventListener('click', addNewQuickMark);
    document.getElementById('add-quickmark-from-text-btn').addEventListener('click', saveQuickMarkFromText);
}

// Export
window.openFeedbackViewer = openFeedbackViewer;
window.closeFeedbackModal = closeFeedbackModal;
window.completeFeedback = completeFeedback;
window.createQuickMarkPopover = createQuickMarkPopover;

// ==================== ID 40: 탭 전환 함수 ====================
function switchFeedbackTab(tab) {
    const generalTab = document.getElementById('general-feedback-tab');
    const inlineTab = document.getElementById('inline-feedback-tab');
    const generalBtn = document.getElementById('tab-general');
    const inlineBtn = document.getElementById('tab-inline');
    
    if (tab === 'general') {
        generalTab.style.display = 'block';
        inlineTab.style.display = 'none';
        generalBtn.classList.add('active');
        generalBtn.setAttribute('aria-selected', 'true');
        inlineBtn.classList.remove('active');
        inlineBtn.setAttribute('aria-selected', 'false');
    } else {
        generalTab.style.display = 'none';
        inlineTab.style.display = 'block';
        generalBtn.classList.remove('active');
        generalBtn.setAttribute('aria-selected', 'false');
        inlineBtn.classList.add('active');
        inlineBtn.setAttribute('aria-selected', 'true');
    }
}

// ==================== ID 47: 표절 검사 결과보고서 다운로드 ====================
function downloadPlagiarismReport(type, requestId) {
    // 제출물 데이터 조회
    const request = FeedbackDataService.getFeedbackRequest(requestId);
    if (!request) {
        alert('제출물을 찾을 수 없습니다.');
        return;
    }

    let reportUrl;
    if (type === 'combined') {
        // 통합 리포트는 CopyKiller URL 사용
        reportUrl = request.copyKillerReportUrl || `https://copykiller.hanyang.ac.kr/report/${requestId}`;
    } else if (type === 'copykiller') {
        reportUrl = request.copyKillerReportUrl || `https://copykiller.hanyang.ac.kr/report/${requestId}`;
    } else if (type === 'gptkiller') {
        reportUrl = request.gptKillerReportUrl || `https://gptkiller.hanyang.ac.kr/report/${requestId}`;
    }

    // 새 창으로 외부 리포트 열기
    window.open(reportUrl, '_blank', 'width=1200,height=800,noopener,noreferrer');
}

// 전역 함수 등록
window.switchFeedbackTab = switchFeedbackTab;
window.downloadPlagiarismReport = downloadPlagiarismReport;


// === injected helpers ===
window._generalComments = window._generalComments || {};

function renderGeneralThread(feedbackId){
  const listEl = document.getElementById('general-feedback-thread');
  const inputSection = document.getElementById('general-feedback-input-section');
  
  if (!listEl) return;
  
  window._generalComments = window._generalComments || {};
  const items = window._generalComments[feedbackId] || [];
  
  // 등록된 평가가 없으면 입력창 표시
  if (items.length === 0) {
    listEl.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">등록된 전체 평가가 없습니다.</p>';
    if (inputSection) inputSection.style.display = 'block';
    return;
  }
  
  // 등록된 평가가 있으면 입력창 숨김
  if (inputSection) inputSection.style.display = 'none';
  
  // 첫 번째는 메인 평가, 나머지는 댓글
  const mainFeedback = items[0];
  const replies = items.slice(1);
  
  const isOwner = mainFeedback.authorId === (CURRENT_USER ? CURRENT_USER.id : 'prof1');
  const att = (mainFeedback.attach && mainFeedback.attach.length) ? 
              mainFeedback.attach.map(a=>'<a class="text-[#6A0028] underline mr-2" href="#">'+a.name+'</a>').join('') : '';
  
  listEl.innerHTML = `
    <!-- 메인 평가 -->
    <div class="general-main-feedback">
      <div id="general-main-display">
        <div class="p-3 border-2 border-[#F8BBD9] rounded-lg bg-[#FCE4EC]">
          <div class="mb-2 text-gray-800 whitespace-pre-wrap">${escapeHtml(mainFeedback.text)}</div>
          ${att ? '<div class="text-xs text-gray-600 mb-2">'+att+'</div>' : ''}
          <div class="flex items-center justify-between">
            <div class="text-[11px] text-gray-500">${new Date(mainFeedback.ts).toLocaleString()}</div>
            ${isOwner ? `
              <button onclick="editGeneralMain()" 
                      class="text-xs text-[#6A0028] hover:text-[#6A0028] flex items-center gap-1">
                <i class="fas fa-edit"></i>
                <span>수정</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
      <div id="general-main-edit" style="display: none;">
        <textarea id="general-main-textarea" 
                  class="w-full p-2 border rounded-md text-sm resize-none" 
                  rows="4">${mainFeedback.text}</textarea>
        <div class="flex gap-2 mt-2 flex-wrap">
          <button class="quickmark-btn text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1" data-target="general-main-textarea">
            <i class="fas fa-star"></i>
            <span>자주쓰는 코멘트</span>
          </button>
          <button onclick="uploadEditAttachmentGeneral()" class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1">
            <i class="fas fa-paperclip"></i>
            <span>첨부</span>
          </button>
        </div>
        <div class="flex gap-2 mt-2">
          <button onclick="saveGeneralMainEdit('${feedbackId}')" 
                  class="text-xs bg-[#6A0028] text-white px-3 py-1.5 rounded-md hover:bg-[#8A0034] flex items-center gap-1">
            <i class="fas fa-save"></i>
            <span>저장</span>
          </button>
          <button onclick="cancelGeneralMainEdit()" 
                  class="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 flex items-center gap-1">
            <i class="fas fa-times"></i>
            <span>취소</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 댓글 영역 -->
    <div class="general-replies mt-3 ml-4 pl-4 border-l-2 border-gray-300">
      <h6 class="text-xs font-semibold text-gray-600 mb-2">💬 댓글 (${replies.length})</h6>
      
      <!-- 등록된 댓글 표시 -->
      ${replies.length > 0 ? `
        <div class="space-y-2 mb-3">
          ${replies.map((reply, idx) => {
            const replyOwner = reply.authorId === (CURRENT_USER ? CURRENT_USER.id : 'prof1');
            const replyAtt = (reply.attach && reply.attach.length) ? 
                            reply.attach.map(a=>'<a class="text-[#6A0028] underline mr-2" href="#">'+a.name+'</a>').join('') : '';
            return `
              <div class="general-reply-bubble p-2 border rounded-lg bg-gray-50" data-reply-index="${idx+1}">
                <div id="general-reply-display-${idx+1}">
                  <div class="text-sm text-gray-800 mb-1 whitespace-pre-wrap">${escapeHtml(reply.text)}</div>
                  ${replyAtt ? '<div class="text-xs text-gray-600 mb-1">'+replyAtt+'</div>' : ''}
                  <div class="flex items-center justify-between">
                    <div class="text-[11px] text-gray-400">${new Date(reply.ts).toLocaleString()}</div>
                    ${replyOwner ? `
                      <button onclick="editGeneralReply(${idx+1})" 
                              class="text-xs text-[#6A0028] hover:text-[#6A0028] flex items-center gap-1">
                        <i class="fas fa-edit"></i>
                        <span>수정</span>
                      </button>
                    ` : ''}
                  </div>
                </div>
                <div id="general-reply-edit-${idx+1}" style="display: none;">
                  <textarea id="general-reply-textarea-${idx+1}" 
                            class="w-full p-2 border rounded-md text-xs resize-none" 
                            rows="2">${reply.text}</textarea>
                  <div class="flex gap-2 mt-2">
                    <button onclick="saveGeneralReplyEdit('${feedbackId}', ${idx+1})" 
                            class="text-xs bg-[#6A0028] text-white px-3 py-1 rounded-md hover:bg-[#8A0034] flex items-center gap-1">
                      <i class="fas fa-save"></i>
                      <span>저장</span>
                    </button>
                    <button onclick="cancelGeneralReplyEdit(${idx+1})" 
                            class="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 flex items-center gap-1">
                      <i class="fas fa-times"></i>
                      <span>취소</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
      
      <!-- ✅ 댓글 입력창 (신규 추가) -->
      <div class="general-reply-input">
        <textarea id="general-reply-textarea" 
                  class="w-full p-2 border rounded-md text-xs resize-none" 
                  rows="2"
                  placeholder="댓글을 입력하세요..."></textarea>
        <div class="flex gap-2 mt-2">
          <button onclick="addGeneralReply('${feedbackId}')" 
                  class="text-xs bg-[#6A0028] text-white px-3 py-1.5 rounded-md hover:bg-[#8A0034] flex items-center gap-1">
            <i class="fas fa-paper-plane"></i>
            <span>댓글 등록</span>
          </button>
          <button class="quickmark-btn text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1" data-target="general-reply-textarea">
            <i class="fas fa-star"></i>
            <span>자주쓰는</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function addGeneralFeedback(feedbackId){
  const ta = document.getElementById('general-feedback-input');
  if (!ta) return;
  const v = ta.value.trim();
  if (!v) { alert('내용을 입력하세요.'); return; }
  
  window._generalComments = window._generalComments || {};
  window._generalComments[feedbackId] = window._generalComments[feedbackId] || [];
  
  // authorId 추가
  window._generalComments[feedbackId].push({
    text: v, 
    ts: Date.now(), 
    attach: (window._pendingAttach||[]),
    authorId: CURRENT_USER ? CURRENT_USER.id : 'prof1'
  });
  
  window._pendingAttach = [];
  ta.value='';
  renderGeneralThread(feedbackId);
}

// ✅ 전체 평가 댓글 등록 (신규)
function addGeneralReply(feedbackId){
  const ta = document.getElementById('general-reply-textarea');
  if (!ta) return;
  const v = ta.value.trim();
  if (!v) { alert('댓글을 입력하세요.'); return; }
  
  window._generalComments = window._generalComments || {};
  window._generalComments[feedbackId] = window._generalComments[feedbackId] || [];
  
  // 댓글 추가
  window._generalComments[feedbackId].push({
    text: v,
    ts: Date.now(),
    attach: [],
    authorId: CURRENT_USER ? CURRENT_USER.id : 'prof1'
  });
  
  ta.value = '';
  renderGeneralThread(feedbackId);
  showToast('댓글이 등록되었습니다.', 'success');
}

// 전역 함수 등록
window.addGeneralReply = addGeneralReply;

// 전체 평가 메인 수정
function editGeneralMain(){
  document.getElementById('general-main-display').style.display = 'none';
  document.getElementById('general-main-edit').style.display = 'block';
  document.getElementById('general-main-textarea').focus();
}

function saveGeneralMainEdit(feedbackId){
  const ta = document.getElementById('general-main-textarea');
  const v = ta.value.trim();
  if (!v) { alert('내용을 입력하세요.'); return; }
  
  if (window._generalComments[feedbackId] && window._generalComments[feedbackId][0]) {
    window._generalComments[feedbackId][0].text = v;
    window._generalComments[feedbackId][0].ts = Date.now();
  }
  
  renderGeneralThread(feedbackId);
  showToast('전체 평가가 수정되었습니다.', 'success');
}

function cancelGeneralMainEdit(){
  document.getElementById('general-main-display').style.display = 'block';
  document.getElementById('general-main-edit').style.display = 'none';
  // 입력창은 숨긴 상태 유지
}

// 전체 평가 댓글 수정
function editGeneralReply(index){
  document.getElementById(`general-reply-display-${index}`).style.display = 'none';
  document.getElementById(`general-reply-edit-${index}`).style.display = 'block';
  document.getElementById(`general-reply-textarea-${index}`).focus();
}

function saveGeneralReplyEdit(feedbackId, index){
  const ta = document.getElementById(`general-reply-textarea-${index}`);
  const v = ta.value.trim();
  if (!v) { alert('내용을 입력하세요.'); return; }
  
  if (window._generalComments[feedbackId] && window._generalComments[feedbackId][index]) {
    window._generalComments[feedbackId][index].text = v;
    window._generalComments[feedbackId][index].ts = Date.now();
  }
  
  renderGeneralThread(feedbackId);
  showToast('댓글이 수정되었습니다.', 'success');
}

function cancelGeneralReplyEdit(index){
  document.getElementById(`general-reply-display-${index}`).style.display = 'block';
  document.getElementById(`general-reply-edit-${index}`).style.display = 'none';
}

// 전역 함수 등록
window.editGeneralMain = editGeneralMain;
window.saveGeneralMainEdit = saveGeneralMainEdit;
window.cancelGeneralMainEdit = cancelGeneralMainEdit;
window.editGeneralReply = editGeneralReply;
window.saveGeneralReplyEdit = saveGeneralReplyEdit;
window.cancelGeneralReplyEdit = cancelGeneralReplyEdit;
window.uploadEditAttachmentGeneral = function(){
  // 구현 예정
  showToast('첨부 기능 준비 중', 'info');
};

function uploadAttachmentForGeneral(){
  let inp = document.getElementById('general-attach-input');
  if (!inp){
    inp = document.createElement('input');
    inp.type='file'; inp.id='general-attach-input'; inp.multiple=true; inp.accept='.png,.jpg,.jpeg,.pdf';
    inp.style.display='none';
    document.body.appendChild(inp);
    inp.addEventListener('change', ()=>{
      const files = Array.from(inp.files||[]).map(f=>({name:f.name, size:f.size}));
      window._pendingAttach = files;
      alert(files.length+'개 파일 선택됨');
    });
  }
  inp.click();
}

function refreshInlineTabMarker(){
  const container = document.getElementById('inline-feedback');
  // 코멘트 카드만 카운트 (마커 카드 제외)
  const commentCards = container ? container.querySelectorAll('.comment-card').length : 0;
  const badge = document.getElementById('tab-inline-badge');
  if (!badge) return;
  if (commentCards > 0) {
    badge.textContent = commentCards;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}
// helper
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

// version switch
window._pdfVersions = { v3: null, v2: null, v1: null };
function switchPdfVersion(ver){
  // PDF 뷰어가 열려있지 않으면 실행하지 않음
  if (!document.getElementById('feedback-modal')) {
    console.warn('PDF 뷰어가 닫혀있습니다. 버전 전환을 중단합니다.');
    return;
  }

  if (window._currentVersionLabel) window._currentVersionLabel(ver);
  document.querySelectorAll('.ver-pill').forEach(b=> b.classList.toggle('active', b.dataset.ver===ver));
  // Reuse same fileUrl for demo; 실제 구현 시 버전별 파일 경로를 바인딩
  if (window._currentFeedbackCtx){
    initPDFViewer(window._currentFeedbackCtx.id, window._currentFeedbackCtx.fileUrl, window._currentFeedbackCtx.data);
  }
}

// ==================== 학생 메모 토글 ====================
function toggleStudentMemo() {
    const existingPanel = document.getElementById('student-memo-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    const memoBtn = document.getElementById('student-memo-btn');
    const memo = memoBtn ? memoBtn.getAttribute('data-memo') : '';

    if (!memo || memo.trim() === '') {
        alert('메모가 없습니다.');
        return;
    }

    const panel = document.createElement('div');
    panel.id = 'student-memo-panel';
    panel.className = 'bg-yellow-50 border border-yellow-200 rounded p-3 mx-4 mt-3 mb-3';
    panel.innerHTML = `
        <div class="flex items-start gap-2">
            <i class="fas fa-sticky-note text-yellow-500 mt-0.5"></i>
            <div class="flex-1">
                <div class="font-semibold text-gray-800 mb-1 text-xs">학생 메모</div>
                <div class="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">${escapeHtml(memo)}</div>
            </div>
            <button onclick="toggleStudentMemo()"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    title="닫기">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    const tabsContainer = document.getElementById('feedback-tabs-container');
    if (tabsContainer && tabsContainer.parentElement) {
        tabsContainer.parentElement.insertAdjacentElement('afterend', panel);
    }
}
window.toggleStudentMemo = toggleStudentMemo;

// injected: autosave on input
(function attachAutosave(){
  let t; const save = ()=>{ console.log('[autosave] saved'); };
  document.addEventListener('input', (e)=>{
    const el = e.target;
    if (!el) return;
    if (el.matches('#inline-feedback textarea, .inline-comment-input, #general-feedback-input')){
      clearTimeout(t); t = setTimeout(save, 400);
    }
  });
})();
