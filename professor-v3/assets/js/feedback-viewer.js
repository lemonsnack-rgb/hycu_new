// Phase 4: 온라인피드백 관리 - PDF 뷰어

// PDF.js 워커 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js';

// ==================== 커스텀 다이얼로그 ====================
function showCustomConfirm(message) {
    return new Promise((resolve) => {
        const backdrop = document.createElement('div');
        backdrop.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; align-items: center; justify-content: center;';

        const dialog = document.createElement('div');
        dialog.style.cssText = 'background: white; border-radius: 8px; padding: 24px; max-width: 500px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);';

        dialog.innerHTML = `
            <div style="margin-bottom: 20px; font-size: 16px; color: #1F2937; white-space: pre-wrap; line-height: 1.5;">${message}</div>
            <div style="display: flex; justify-content: flex-end; gap: 8px;">
                <button id="custom-confirm-cancel" style="background: white; color: #374151; padding: 8px 24px; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">취소</button>
                <button id="custom-confirm-ok" style="background: #6A0028; color: white; padding: 8px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">확인</button>
            </div>
        `;

        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);

        const okBtn = dialog.querySelector('#custom-confirm-ok');
        const cancelBtn = dialog.querySelector('#custom-confirm-cancel');

        const closeDialog = (result) => {
            backdrop.remove();
            resolve(result);
        };

        okBtn.addEventListener('click', () => closeDialog(true));
        cancelBtn.addEventListener('click', () => closeDialog(false));
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeDialog(false);
        });

        okBtn.focus();
    });
}

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

    // 메모 버튼 표시 로직 - 항상 표시
    setTimeout(() => {
        const memo = request.memo || '';
        const memoBtn = document.getElementById('student-memo-btn');
        console.log('[교수 메모 버튼] 찾기 시도:', memoBtn);
        if (memoBtn) {
            console.log('[교수 메모 버튼] 버튼 찾음, 표시 설정');
            memoBtn.style.display = 'inline-block';
            memoBtn.style.visibility = 'visible';
            memoBtn.style.opacity = '1';
            memoBtn.setAttribute('data-memo', memo);
            console.log('[교수 메모 버튼] 스타일 적용 완료:', memoBtn.style.display);
        } else {
            console.error('[교수 메모 버튼] 버튼을 찾을 수 없습니다!');
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
                            <div id="general-feedback-thread" class="space-y-2 mb-3">
                                <!-- 동적 렌더링 -->
                            </div>
                            <!-- 입력창은 조건부 표시 -->
                            <div id="general-feedback-input-section" class="relative">
                                <textarea id="general-feedback-input"
                                          class="w-full p-2 border rounded-md text-sm resize-none"
                                          rows="3"
                                          placeholder="전체 평가를 입력하세요..."></textarea>

                                <!-- 첨부파일 미리보기 영역 -->
                                <div id="general-attach-preview" class="mt-2 hidden">
                                    <div class="flex items-center justify-between p-2 bg-gray-50 border border-gray-300 rounded-md">
                                        <div class="flex items-center gap-2">
                                            <i class="fas fa-paperclip text-gray-500"></i>
                                            <span id="general-attach-filename" class="text-sm text-gray-700"></span>
                                            <span id="general-attach-filesize" class="text-xs text-gray-500"></span>
                                        </div>
                                        <button onclick="removeGeneralAttachment()"
                                                class="text-red-600 hover:text-red-700 text-sm">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="flex gap-2 mt-2 flex-wrap">
                                    <button onclick="addGeneralFeedback()" class="text-xs bg-[#6A0028] text-white px-3 py-1.5 rounded-md hover:bg-[#8A0034] flex items-center gap-1">
                                        <i class="fas fa-paper-plane"></i>
                                        <span>등록</span>
                                    </button>
                                    <button class="quickmark-btn text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 flex items-center gap-1" data-target="general-feedback-input">
                                        <i class="fas fa-star"></i>
                                        <span>자주 쓰는 코멘트</span>
                                    </button>
                                    <button onclick="uploadAttachmentForGeneral()" class="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 flex items-center gap-1">
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
    console.log('[createQuickMarkPopover] 팝오버 생성 시작');
    const popover = document.createElement('div');
    popover.id = 'quickmark-popover';
    popover.className = 'fixed bg-white border rounded-lg shadow-xl';
    popover.style.width = '320px';
    popover.style.display = 'none';
    popover.style.zIndex = '9999';
    
    popover.innerHTML = `
        <div class="p-3 border-b">
            <h4 class="font-bold text-sm text-gray-800">자주 쓰는 코멘트 관리</h4>
        </div>
        <div id="quickmark-list" class="max-h-64 overflow-y-auto p-2">
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
    console.log('[createQuickMarkPopover] 팝오버 DOM에 추가 완료');

    // 이벤트 리스너
    document.getElementById('add-quickmark-btn').addEventListener('click', addNewQuickMark);
    document.getElementById('add-quickmark-from-text-btn').addEventListener('click', saveQuickMarkFromText);
    console.log('[createQuickMarkPopover] 이벤트 리스너 등록 완료');
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
  console.log('[renderGeneralThread] 시작 - feedbackId:', feedbackId);

  const listEl = document.getElementById('general-feedback-thread');
  const inputSection = document.getElementById('general-feedback-input-section');

  console.log('[renderGeneralThread] listEl:', listEl, 'inputSection:', inputSection);

  if (!listEl) {
    console.error('[renderGeneralThread] listEl을 찾을 수 없습니다');
    return;
  }

  window._generalComments = window._generalComments || {};
  const items = window._generalComments[feedbackId] || [];

  console.log('[renderGeneralThread] window._generalComments:', window._generalComments);
  console.log('[renderGeneralThread] items:', items);

  const currentUserId = CURRENT_USER ? CURRENT_USER.id : 'prof1';
  console.log('[renderGeneralThread] currentUserId:', currentUserId);

  // 현재 로그인한 교수의 전체 평가 찾기
  const myFeedback = items.find(f => f.authorId === currentUserId);
  console.log('[renderGeneralThread] myFeedback:', myFeedback);

  // 내 전체 평가가 없으면 입력창 표시
  if (!myFeedback) {
    console.log('[renderGeneralThread] myFeedback이 없어서 입력창 표시');
    listEl.innerHTML = '';
    if (inputSection) inputSection.style.display = 'block';
    return;
  }

  console.log('[renderGeneralThread] myFeedback이 있어서 렌더링 시작');

  // 내 전체 평가가 있으면 입력창 숨김
  if (inputSection) inputSection.style.display = 'none';

  // 메인 평가는 내 평가만 표시
  const mainFeedback = myFeedback;
  const replies = []; // 댓글 기능은 제거 (교수 1명당 1개만 등록)
  
  const isOwner = mainFeedback.authorId === (CURRENT_USER ? CURRENT_USER.id : 'prof1');
  const att = (mainFeedback.attach && mainFeedback.attach.length > 0) ?
              `<div class="mt-2 flex items-center gap-2 p-2 bg-white border border-gray-200 rounded">
                <i class="fas fa-paperclip text-gray-500 text-xs"></i>
                <a class="text-[#6A0028] hover:underline text-sm" href="#" onclick="downloadAttachment('${mainFeedback.attach[0].name}'); return false;">
                  ${mainFeedback.attach[0].name}
                </a>
                <span class="text-xs text-gray-500">(${formatFileSize(mainFeedback.attach[0].size)})</span>
              </div>` : '';
  
  listEl.innerHTML = `
    <!-- 메인 평가 -->
    <div class="general-main-feedback">
      <div id="general-main-display">
        <div class="p-3 border-2 border-[#FFE699] rounded-lg" style="background-color: #f5f1e9;">
          <div class="mb-2 text-gray-800 whitespace-pre-wrap">${escapeHtml(mainFeedback.text)}</div>
          ${att ? '<div class="text-xs text-gray-600 mb-2">'+att+'</div>' : ''}
          <div class="flex items-center justify-between">
            <div class="text-[11px] text-gray-500">${new Date(mainFeedback.ts).toLocaleString()}</div>
            ${isOwner ? `
              <div class="flex items-center gap-2">
                <button onclick="window.editGeneralMain()"
                        class="text-xs text-[#6A0028] hover:text-[#6A0028] flex items-center gap-1">
                  <i class="fas fa-edit"></i>
                  <span>수정</span>
                </button>
                <button onclick="window.deleteGeneralMain('${feedbackId}')"
                        class="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
                  <i class="fas fa-trash-alt"></i>
                  <span>삭제</span>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      <div id="general-main-edit" style="display: none;">
        <textarea id="general-main-textarea"
                  class="w-full p-2 border rounded-md text-sm resize-none"
                  rows="4">${mainFeedback.text}</textarea>

        <!-- 기존 첨부파일 표시 -->
        ${mainFeedback.attach && mainFeedback.attach.length > 0 ? `
          <div id="edit-existing-attach-general" class="mt-2 p-2 bg-gray-50 border border-gray-300 rounded-md">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fas fa-paperclip text-gray-500"></i>
                <span class="text-sm text-gray-700">${mainFeedback.attach[0].name}</span>
                <span class="text-xs text-gray-500">(${formatFileSize(mainFeedback.attach[0].size)})</span>
              </div>
              <button onclick="removeExistingEditAttachmentGeneral()" class="text-red-600 hover:text-red-700 text-sm">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        ` : ''}

        <!-- 새 첨부파일 미리보기 -->
        <div id="general-edit-attach-preview" class="mt-2 hidden">
          <div class="flex items-center justify-between p-2 bg-gray-50 border border-gray-300 rounded-md">
            <div class="flex items-center gap-2">
              <i class="fas fa-paperclip text-gray-500"></i>
              <span id="general-edit-attach-filename" class="text-sm text-gray-700"></span>
              <span id="general-edit-attach-filesize" class="text-xs text-gray-500"></span>
            </div>
            <button onclick="removeEditAttachment()"
                    class="text-red-600 hover:text-red-700 text-sm">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

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
  `;
}

function addGeneralFeedback(feedbackId){
  // feedbackId가 전달되지 않으면 현재 컨텍스트에서 가져오기
  if (!feedbackId) {
    feedbackId = window._currentFeedbackCtx?.id;
    console.log('[addGeneralFeedback] feedbackId from context:', feedbackId, 'context:', window._currentFeedbackCtx);
  }

  if (!feedbackId) {
    console.error('[addGeneralFeedback] feedbackId가 없습니다. window._currentFeedbackCtx:', window._currentFeedbackCtx);
    alert('피드백 정보를 찾을 수 없습니다.');
    return;
  }

  const ta = document.getElementById('general-feedback-input');
  if (!ta) return;
  const v = ta.value.trim();
  if (!v) { alert('내용을 입력하세요.'); return; }

  window._generalComments = window._generalComments || {};
  window._generalComments[feedbackId] = window._generalComments[feedbackId] || [];

  const currentUserId = CURRENT_USER ? CURRENT_USER.id : 'prof1';

  // 이미 내 전체 평가가 있는지 확인
  const existingIndex = window._generalComments[feedbackId].findIndex(f => f.authorId === currentUserId);

  if (existingIndex >= 0) {
    // 기존 전체 평가 수정
    window._generalComments[feedbackId][existingIndex] = {
      text: v,
      ts: Date.now(),
      attach: (window._pendingAttach||[]),
      authorId: currentUserId
    };
  } else {
    // 새 전체 평가 추가
    window._generalComments[feedbackId].push({
      text: v,
      ts: Date.now(),
      attach: (window._pendingAttach||[]),
      authorId: currentUserId
    });
  }

  window._pendingAttach = [];
  ta.value='';

  // UI 미리보기 제거
  removeGeneralAttachment();

  renderGeneralThread(feedbackId);
}

// 전체 평가 삭제
function deleteGeneralMain(feedbackId){
  if (!feedbackId) {
    console.error('[deleteGeneralMain] feedbackId가 없습니다');
    alert('피드백 정보를 찾을 수 없습니다.');
    return;
  }

  if (!confirm('전체 평가를 삭제하시겠습니까?')) {
    console.log('[deleteGeneralMain] 사용자가 취소함');
    return;
  }

  console.log('[deleteGeneralMain] 사용자가 확인함 - 삭제 진행');
  performDelete(feedbackId);
}

// 삭제 실행 함수
function performDelete(feedbackId) {

  const currentUserId = CURRENT_USER ? CURRENT_USER.id : 'prof1';
  console.log('[deleteGeneralMain] currentUserId:', currentUserId);

  window._generalComments = window._generalComments || {};
  window._generalComments[feedbackId] = window._generalComments[feedbackId] || [];

  console.log('[deleteGeneralMain] 삭제 전 comments:', window._generalComments[feedbackId]);

  // 현재 사용자의 전체 평가 삭제
  const index = window._generalComments[feedbackId].findIndex(f => f.authorId === currentUserId);
  console.log('[deleteGeneralMain] 삭제할 index:', index);

  if (index >= 0) {
    window._generalComments[feedbackId].splice(index, 1);
    console.log('[deleteGeneralMain] 삭제 후 comments:', window._generalComments[feedbackId]);
    renderGeneralThread(feedbackId);
    if (typeof showToast === 'function') {
      showToast('전체 평가가 삭제되었습니다.', 'success');
    }
  } else {
    console.error('[deleteGeneralMain] 삭제할 항목을 찾을 수 없습니다');
  }
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
  console.log('[editGeneralMain] 호출됨');
  const displayEl = document.getElementById('general-main-display');
  const editEl = document.getElementById('general-main-edit');
  const textareaEl = document.getElementById('general-main-textarea');

  console.log('[editGeneralMain] displayEl:', displayEl);
  console.log('[editGeneralMain] editEl:', editEl);
  console.log('[editGeneralMain] textareaEl:', textareaEl);

  if (!displayEl || !editEl || !textareaEl) {
    console.error('[editGeneralMain] 필요한 요소를 찾을 수 없습니다');
    return;
  }

  displayEl.style.display = 'none';
  editEl.style.display = 'block';
  textareaEl.focus();
  console.log('[editGeneralMain] 수정 모드로 전환 완료');
}

function saveGeneralMainEdit(feedbackId){
  const ta = document.getElementById('general-main-textarea');
  const v = ta.value.trim();
  if (!v) { alert('내용을 입력하세요.'); return; }

  if (window._generalComments[feedbackId] && window._generalComments[feedbackId][0]) {
    window._generalComments[feedbackId][0].text = v;
    window._generalComments[feedbackId][0].ts = Date.now();
    // 편집 시 첨부파일이 있으면 업데이트
    if (window._editAttach && window._editAttach.length > 0) {
      window._generalComments[feedbackId][0].attach = window._editAttach;
      window._editAttach = [];
    }
  }

  renderGeneralThread(feedbackId);
  showToast('전체 평가가 수정되었습니다.', 'success');
}

function cancelGeneralMainEdit(){
  document.getElementById('general-main-display').style.display = 'block';
  document.getElementById('general-main-edit').style.display = 'none';
  // 편집 취소 시 임시 첨부파일 초기화
  window._editAttach = [];
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
  console.log('[uploadEditAttachmentGeneral] 함수 호출됨');

  let inp = document.getElementById('general-edit-attach-input');
  if (!inp){
    console.log('[uploadEditAttachmentGeneral] input 요소 생성');
    inp = document.createElement('input');
    inp.type='file';
    inp.id='general-edit-attach-input';
    inp.multiple = false;  // 1개만 선택 가능
    inp.accept='.png,.jpg,.jpeg,.pdf,.doc,.docx';
    inp.style.display='none';
    document.body.appendChild(inp);
    inp.addEventListener('change', ()=>{
      console.log('[uploadEditAttachmentGeneral] 파일 선택됨:', inp.files);
      const file = inp.files[0];
      if (!file) {
        console.log('[uploadEditAttachmentGeneral] 파일 없음');
        return;
      }

      console.log('[uploadEditAttachmentGeneral] 선택된 파일:', file.name, file.size);

      // 파일 크기 제한 (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.');
        inp.value = '';
        return;
      }

      // 편집용 첨부파일 저장
      window._editAttach = [{
        name: file.name,
        size: file.size,
        file: file
      }];

      console.log('[uploadEditAttachmentGeneral] window._editAttach 설정됨');
      console.log('[uploadEditAttachmentGeneral] showEditAttachPreview 호출');

      // 미리보기 표시
      showEditAttachPreview(file);

      inp.value = '';
    });
  }

  console.log('[uploadEditAttachmentGeneral] input.click() 호출');
  inp.click();
};

function uploadAttachmentForGeneral(){
  console.log('[uploadAttachmentForGeneral] 함수 호출됨');

  let inp = document.getElementById('general-attach-input');
  if (!inp){
    console.log('[uploadAttachmentForGeneral] input 요소 생성');
    inp = document.createElement('input');
    inp.type='file';
    inp.id='general-attach-input';
    inp.multiple = false;  // 1개만 선택
    inp.accept='.png,.jpg,.jpeg,.pdf,.doc,.docx';
    inp.style.display='none';
    document.body.appendChild(inp);
    inp.addEventListener('change', ()=>{
      console.log('[uploadAttachmentForGeneral] 파일 선택됨:', inp.files);
      const file = inp.files[0];
      if (!file) {
        console.log('[uploadAttachmentForGeneral] 파일 없음');
        return;
      }

      console.log('[uploadAttachmentForGeneral] 선택된 파일:', file.name, file.size);

      // 파일 크기 제한 (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.');
        inp.value = '';
        return;
      }

      // window._pendingAttach에 1개만 저장
      window._pendingAttach = [{
        name: file.name,
        size: file.size,
        file: file
      }];

      console.log('[uploadAttachmentForGeneral] window._pendingAttach 설정됨');

      // UI 업데이트
      console.log('[uploadAttachmentForGeneral] showGeneralAttachPreview 호출');
      showGeneralAttachPreview(file);

      // input 초기화 (같은 파일 재선택 가능하도록)
      inp.value = '';
    });
  }

  console.log('[uploadAttachmentForGeneral] input.click() 호출');
  inp.click();
}

/**
 * 전체 평가 첨부파일 미리보기 표시
 */
function showGeneralAttachPreview(file) {
    console.log('[showGeneralAttachPreview] 함수 호출됨, file=', file.name);

    const previewContainer = document.getElementById('general-attach-preview');
    const filenameEl = document.getElementById('general-attach-filename');
    const filesizeEl = document.getElementById('general-attach-filesize');

    console.log('[showGeneralAttachPreview] previewContainer=', previewContainer ? 'found' : 'NOT FOUND');
    console.log('[showGeneralAttachPreview] filenameEl=', filenameEl ? 'found' : 'NOT FOUND');
    console.log('[showGeneralAttachPreview] filesizeEl=', filesizeEl ? 'found' : 'NOT FOUND');

    if (!previewContainer || !filenameEl || !filesizeEl) {
        console.error('[showGeneralAttachPreview] ❌ 요소를 찾을 수 없음');
        return;
    }

    // 파일 정보 표시
    filenameEl.textContent = file.name;
    filesizeEl.textContent = `(${formatFileSize(file.size)})`;

    // 미리보기 영역 표시
    previewContainer.classList.remove('hidden');

    console.log('[showGeneralAttachPreview] ✅ 미리보기 표시 완료');
}

function showEditAttachPreview(file) {
    console.log('[showEditAttachPreview] 함수 호출됨, file=', file.name);

    const previewContainer = document.getElementById('general-edit-attach-preview');
    const filenameEl = document.getElementById('general-edit-attach-filename');
    const filesizeEl = document.getElementById('general-edit-attach-filesize');

    console.log('[showEditAttachPreview] previewContainer=', previewContainer ? 'found' : 'NOT FOUND');
    console.log('[showEditAttachPreview] filenameEl=', filenameEl ? 'found' : 'NOT FOUND');
    console.log('[showEditAttachPreview] filesizeEl=', filesizeEl ? 'found' : 'NOT FOUND');

    if (!previewContainer || !filenameEl || !filesizeEl) {
        console.error('[showEditAttachPreview] ❌ 요소를 찾을 수 없음');
        return;
    }

    filenameEl.textContent = file.name;
    filesizeEl.textContent = `(${formatFileSize(file.size)})`;
    previewContainer.classList.remove('hidden');

    console.log('[showEditAttachPreview] ✅ 편집 미리보기 표시 완료');
}

/**
 * 파일 크기 포맷팅
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 전체 평가 첨부파일 제거
 */
function removeGeneralAttachment() {
    window._pendingAttach = [];

    const previewContainer = document.getElementById('general-attach-preview');
    if (previewContainer) {
        previewContainer.classList.add('hidden');
    }

    // input 파일 초기화
    const inp = document.getElementById('general-attach-input');
    if (inp) {
        inp.value = '';
    }
}

function removeEditAttachment() {
    console.log('[removeEditAttachment] 호출됨');
    window._editAttach = [];
    const previewContainer = document.getElementById('general-edit-attach-preview');
    if (previewContainer) {
        previewContainer.classList.add('hidden');
    }
    const inp = document.getElementById('general-edit-attach-input');
    if (inp) {
        inp.value = '';
    }
    console.log('[removeEditAttachment] 편집 첨부파일 제거 완료');
}

function removeExistingEditAttachmentGeneral() {
    console.log('[removeExistingEditAttachmentGeneral] 호출됨');

    // 데이터에서 첨부파일 제거
    const feedbackId = window._currentFeedbackCtx?.id;
    if (feedbackId && window._generalComments && window._generalComments[feedbackId]) {
        const currentUserId = CURRENT_USER ? CURRENT_USER.id : 'prof1';
        const myFeedback = window._generalComments[feedbackId].find(f => f.authorId === currentUserId);
        if (myFeedback) {
            myFeedback.attach = [];
            console.log('[removeExistingEditAttachmentGeneral] 데이터에서 첨부파일 제거 완료');
        }
    }

    // UI에서 첨부파일 제거
    const attachEl = document.getElementById('edit-existing-attach-general');
    if (attachEl) {
        attachEl.remove();
        console.log('[removeExistingEditAttachmentGeneral] ✅ UI에서 첨부파일 제거 완료');
    }

    alert('첨부파일이 제거되었습니다.');
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
window.deleteGeneralMain = deleteGeneralMain;
window.editGeneralMain = editGeneralMain;
window.showGeneralAttachPreview = showGeneralAttachPreview;
window.showEditAttachPreview = showEditAttachPreview;
window.removeGeneralAttachment = removeGeneralAttachment;
window.removeEditAttachment = removeEditAttachment;
window.removeExistingEditAttachmentGeneral = removeExistingEditAttachmentGeneral;
window.formatFileSize = formatFileSize;
window.uploadAttachmentForGeneral = uploadAttachmentForGeneral;
window.addGeneralFeedback = addGeneralFeedback;
window.renderGeneralThread = renderGeneralThread;

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
