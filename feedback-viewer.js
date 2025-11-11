// Phase 4: 온라인피드백 관리 - PDF 뷰어
// Task 1-1: 용어 변경, 버튼 배치, 완료 로직, 중복 방지 적용

// PDF.js 워커 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js';

// 전역 상태 관리
let feedbackModalState = {
    currentFeedbackId: null,
    isSubmitting: false, // 중복 등록 방지
    completedAnnotations: new Set() // 완료된 첨삭 ID 추적
};

// ==================== PDF 뷰어 열기 ====================
function openFeedbackViewer(feedbackId) {
    const request = FeedbackDataService.getFeedbackRequestById(feedbackId);
    if (!request) {
        alert('제출물을 찾을 수 없습니다.');
        return;
    }
    
    const feedbackData = FeedbackDataService.getFeedbackData(feedbackId);
    
    // 상태 초기화
    feedbackModalState.currentFeedbackId = feedbackId;
    feedbackModalState.isSubmitting = false;
    feedbackModalState.completedAnnotations.clear();
    
    // 기존 완료된 첨삭 로드
    if (feedbackData && feedbackData.annotations) {
        Object.values(feedbackData.annotations).flat().forEach(annotation => {
            if (annotation.status === 'completed') {
                feedbackModalState.completedAnnotations.add(annotation.id);
            }
        });
    }
    
    // 모달 생성
    const modal = createFeedbackModal(request, feedbackData);
    
    // 백드롭 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFeedbackModal();
        }
    });
    
    document.body.appendChild(modal);
    
    // ESC 키로 닫기 (중복 등록 방지)
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
        initPDFViewer(feedbackId, request.fileUrl, feedbackData);
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
                    <!-- Task 1-1: 논문명 표시 영역 개선 -->
                    <div class="flex flex-col">
                        <h3 class="text-lg font-bold text-gray-800 thesis-title">
                            ${request.thesisTitle || '논문 제목 없음'}
                        </h3>
                        <p class="text-xs text-gray-600 mt-1">
                            <span class="font-semibold">${request.studentName}</span> 
                            <span class="text-gray-400 mx-1">|</span>
                            <span class="file-name">${request.file}</span>
                        </p>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        v${feedbackData ? feedbackData.version : '1'}
                    </span>
                    <!-- Task 1-1: CopyKiller/GPT Killer 결과보고서 링크 -->
                    <div class="text-sm text-gray-600">
                        <span class="font-semibold ${getPlagiarismColorClass(request.copykillerScore, request.gptkillerScore)}">
                            CopyKiller: ${request.copykillerScore}
                        </span>
                        <a href="#" onclick="downloadPlagiarismReport('copykiller', '${request.id}'); event.preventDefault();" 
                           class="ml-1 text-blue-600 hover:underline text-xs">
                            결과보고서
                        </a>
                        <span class="text-gray-400 mx-1">/</span>
                        <span class="font-semibold ${getPlagiarismColorClass(request.copykillerScore, request.gptkillerScore)}">
                            GPT Killer: ${request.gptkillerScore}
                        </span>
                        <a href="#" onclick="downloadPlagiarismReport('gptkiller', '${request.id}'); event.preventDefault();" 
                           class="ml-1 text-blue-600 hover:underline text-xs">
                            결과보고서
                        </a>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="saveFeedbackTemp()" class="text-xs bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-1">
                        <i class="fas fa-save"></i>
                        <span>임시저장</span>
                    </button>
                    <button onclick="saveFeedbackFinal()" class="text-xs bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1">
                        <i class="fas fa-check"></i>
                        <span>저장</span>
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
                        <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
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
                
                <!-- 오른쪽: 코멘트 패널 - Task 1-1: 용어 변경 및 버튼 2줄 배치 -->
                <div class="comment-panel">
                    <div class="p-4 border-b bg-gray-50">
                        <h4 class="text-sm font-bold text-gray-700">피드백</h4>
                        <!-- Task 1-1: 전체 평가 / 첨삭 탭 -->
                        <div class="flex gap-2 mt-2">
                            <button onclick="switchFeedbackTab('general')" 
                                    id="tab-general" 
                                    class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white font-semibold">
                                전체 평가
                            </button>
                            <button onclick="switchFeedbackTab('inline')" 
                                    id="tab-inline" 
                                    class="text-xs px-3 py-1.5 rounded bg-gray-200 text-gray-700">
                                첨삭
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-4" id="comment-panel-content">
                        <!-- Task 1-1: 전체 평가 탭 -->
                        <div id="general-feedback-tab">
                            <h5 class="text-xs font-bold text-gray-700 mb-2">💬 전체 평가</h5>
                            <div id="general-feedback-thread" class="space-y-2 mb-3">
                                <!-- 동적 렌더링: 교수 평가 + 학생 댓글 스레드 -->
                            </div>
                            <div class="relative">
                                <textarea id="general-feedback-input" 
                                          class="w-full p-2 border rounded-md text-sm resize-none"
                                          rows="3"
                                          placeholder="전체 평가를 입력하세요..."></textarea>
                                <!-- Task 1-1: 버튼 2줄 배치 -->
                                <div class="mt-2 space-y-2">
                                    <!-- 첫 번째 줄: 보조 기능 -->
                                    <div class="flex gap-2 flex-wrap">
                                        <button class="quickmark-btn text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1 border border-gray-300" 
                                                data-target="general-feedback-input">
                                            <i class="fas fa-bolt"></i>
                                            <span>빠른 첨삭</span>
                                        </button>
                                        <button onclick="uploadAttachment('general')" 
                                                class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1 border border-gray-300">
                                            <i class="fas fa-paperclip"></i>
                                            <span>첨부</span>
                                        </button>
                                        <button onclick="recordVoiceComment('general')" 
                                                class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1 border border-gray-300">
                                            <i class="fas fa-microphone"></i>
                                            <span>음성</span>
                                        </button>
                                        <button onclick="linkToAnnotation('general')" 
                                                class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1 border border-gray-300">
                                            <i class="fas fa-link"></i>
                                            <span>연결</span>
                                        </button>
                                    </div>
                                    <!-- 두 번째 줄: 주요 액션 -->
                                    <div class="flex gap-2">
                                        <button onclick="addGeneralFeedback()" 
                                                id="register-general-btn"
                                                class="flex-1 text-xs bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-1 font-semibold">
                                            <i class="fas fa-paper-plane"></i>
                                            <span>등록</span>
                                        </button>
                                        <button onclick="markGeneralAsComplete()" 
                                                id="complete-general-btn"
                                                class="flex-1 text-xs bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-1 font-semibold">
                                            <i class="fas fa-check-circle"></i>
                                            <span>완료</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Task 1-1: 첨삭 탭 -->
                        <div id="inline-feedback-tab" style="display: none;">
                            <h5 class="text-xs font-bold text-gray-700 mb-2">📍 첨삭</h5>
                            <div id="inline-feedback" class="space-y-3">
                                <!-- 동적 렌더링: 각 첨삭 카드는 아래 구조를 따름
                                <div class="annotation-card">
                                    <div class="教授-comment">원본 첨삭</div>
                                    <div class="reply-thread">댓글 스레드</div>
                                    <div class="reply-input">댓글 입력란 + 2줄 버튼</div>
                                </div>
                                -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// ==================== 충돌 경고 렌더링 ====================
function renderConflictWarning(feedbackData) {
    const lastUser = FeedbackDataService.getUserById(feedbackData.lastModifiedBy);
    if (!lastUser || feedbackData.lastModifiedBy === CURRENT_USER.id) return '';
    
    return `
        <div class="conflict-warning mx-4 mt-4">
            <div class="flex items-start gap-3">
                <span class="conflict-warning-icon">⚠️</span>
                <div class="flex-1">
                    <p class="text-sm font-bold text-gray-800 mb-1">다른 교수님이 수정했습니다</p>
                    <p class="text-xs text-gray-700">
                        ${lastUser.name} 교수님이 ${feedbackData.lastModified}에 수정했습니다. (버전 v${feedbackData.version})
                    </p>
                </div>
            </div>
        </div>
    `;
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
        generalBtn.className = 'text-xs px-3 py-1.5 rounded bg-blue-600 text-white font-semibold';
        inlineBtn.className = 'text-xs px-3 py-1.5 rounded bg-gray-200 text-gray-700';
    } else {
        generalTab.style.display = 'none';
        inlineTab.style.display = 'block';
        generalBtn.className = 'text-xs px-3 py-1.5 rounded bg-gray-200 text-gray-700';
        inlineBtn.className = 'text-xs px-3 py-1.5 rounded bg-blue-600 text-white font-semibold';
    }
}

// ==================== Task 1-1: 전체 평가 등록 (중복 방지) ====================
function addGeneralFeedback() {
    // 중복 등록 방지
    if (feedbackModalState.isSubmitting) {
        console.log('이미 제출 중입니다...');
        return;
    }
    
    const textarea = document.getElementById('general-feedback-input');
    const registerBtn = document.getElementById('register-general-btn');
    const text = textarea.value.trim();
    
    if (!text) {
        alert('전체 평가 내용을 입력해주세요.');
        return;
    }
    
    // 제출 중 상태로 변경
    feedbackModalState.isSubmitting = true;
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>등록 중...</span>';
    
    try {
        // Mock: 데이터 저장
        const feedback = {
            id: 'gf-' + Date.now(),
            type: 'general',
            author: CURRENT_USER.name,
            authorId: CURRENT_USER.id,
            text: text,
            timestamp: new Date().toISOString(),
            status: 'in_progress' // 새 첨삭 추가 시 진행중으로
        };
        
        console.log('전체 평가 등록:', feedback);
        
        // 화면에 추가 (실제로는 renderGeneralFeedback 함수 호출)
        const thread = document.getElementById('general-feedback-thread');
        const feedbackCard = document.createElement('div');
        feedbackCard.className = 'bg-blue-50 p-3 rounded-md border-l-4 border-blue-500';
        feedbackCard.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-bold text-gray-700">${feedback.author} (교수)</span>
                <span class="text-xs text-gray-500">${new Date().toLocaleDateString()}</span>
            </div>
            <p class="text-sm text-gray-800 whitespace-pre-wrap">${feedback.text}</p>
        `;
        thread.appendChild(feedbackCard);
        
        // 입력란 초기화
        textarea.value = '';
        
        // 성공 알림
        setTimeout(() => {
            alert('전체 평가가 등록되었습니다.');
        }, 300);
        
    } catch (error) {
        console.error('전체 평가 등록 오류:', error);
        alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        // 제출 상태 해제
        feedbackModalState.isSubmitting = false;
        registerBtn.disabled = false;
        registerBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>등록</span>';
    }
}

// ==================== Task 1-1: 전체 평가 완료 처리 ====================
function markGeneralAsComplete() {
    const feedbackId = feedbackModalState.currentFeedbackId;
    
    if (confirm('전체 평가를 완료 처리하시겠습니까?\n완료 후에도 새로운 첨삭을 추가할 수 있습니다.')) {
        // Mock: 상태 업데이트
        console.log(`피드백 ${feedbackId} 완료 처리`);
        
        // 완료 표시 UI 업데이트 (실제로는 FeedbackDataService 사용)
        const thread = document.getElementById('general-feedback-thread');
        const completeBadge = document.createElement('div');
        completeBadge.className = 'bg-green-100 border border-green-400 text-green-800 px-3 py-2 rounded-md text-xs font-semibold mt-2';
        completeBadge.innerHTML = '<i class="fas fa-check-circle"></i> 피드백이 완료되었습니다.';
        thread.appendChild(completeBadge);
        
        alert('전체 평가가 완료 처리되었습니다.\n새로운 첨삭을 추가하면 자동으로 진행중 상태로 변경됩니다.');
    }
}

// ==================== Task 1-1: 첨삭 완료 토글 ====================
function toggleAnnotationComplete(annotationId) {
    const isCompleted = feedbackModalState.completedAnnotations.has(annotationId);
    
    if (isCompleted) {
        // 완료 취소
        feedbackModalState.completedAnnotations.delete(annotationId);
        console.log(`첨삭 ${annotationId} 완료 취소`);
    } else {
        // 완료 처리
        feedbackModalState.completedAnnotations.add(annotationId);
        console.log(`첨삭 ${annotationId} 완료 처리`);
    }
    
    // UI 업데이트 (실제로는 해당 카드의 버튼 상태 변경)
    updateAnnotationCompleteUI(annotationId, !isCompleted);
}

// ==================== Task 1-1: 첨삭 완료 UI 업데이트 ====================
function updateAnnotationCompleteUI(annotationId, isCompleted) {
    const card = document.querySelector(`[data-annotation-id="${annotationId}"]`);
    if (!card) return;
    
    const completeBtn = card.querySelector('.complete-annotation-btn');
    if (!completeBtn) return;
    
    if (isCompleted) {
        completeBtn.className = 'complete-annotation-btn text-xs bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md flex items-center gap-1';
        completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>완료됨</span>';
        card.classList.add('opacity-75', 'border-green-300');
    } else {
        completeBtn.className = 'complete-annotation-btn text-xs bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 flex items-center gap-1';
        completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>완료</span>';
        card.classList.remove('opacity-75', 'border-green-300');
    }
}

// ==================== Task 1-1: 보조 기능 함수들 (Mock) ====================
function recordVoiceComment(target) {
    alert('음성 녹음 기능 (구현 예정)\n프로토타입: Mock 기능');
    console.log(`음성 녹음: ${target}`);
}

function linkToAnnotation(target) {
    alert('첨삭 연결 기능 (구현 예정)\n프로토타입: Mock 기능');
    console.log(`첨삭 연결: ${target}`);
}

function uploadAttachment(target) {
    alert('파일 첨부 기능 (구현 예정)\n프로토타입: Mock 기능');
    console.log(`파일 첨부: ${target}`);
}

// ==================== ID 47: 표절 검사 결과보고서 다운로드 ====================
function downloadPlagiarismReport(type, requestId) {
    const reportUrl = type === 'copykiller' 
        ? `/api/reports/copykiller/${requestId}.pdf`
        : `/api/reports/gptkiller/${requestId}.pdf`;
    
    // 실제 구현 시 다운로드 처리
    alert(`${type === 'copykiller' ? 'CopyKiller' : 'GPT Killer'} 결과보고서 다운로드\n(실제 구현 시 파일 다운로드)`);
    console.log(`다운로드 URL: ${reportUrl}`);
}

// ==================== 전역 함수 등록 ====================
window.switchFeedbackTab = switchFeedbackTab;
window.downloadPlagiarismReport = downloadPlagiarismReport;
window.addGeneralFeedback = addGeneralFeedback;
window.markGeneralAsComplete = markGeneralAsComplete;
window.toggleAnnotationComplete = toggleAnnotationComplete;
window.recordVoiceComment = recordVoiceComment;
window.linkToAnnotation = linkToAnnotation;
window.uploadAttachment = uploadAttachment;
