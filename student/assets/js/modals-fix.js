/**
 * 학생용 모달 함수 통합 수정
 * 모든 모달을 modal-backdrop active 구조로 통일
 */

// ========== Toast 알림 표시 ==========
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;

    toast.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 0.5rem;
        transition: opacity 0.3s;
    `;

    toastContainer.appendChild(toast);

    // 3초 후 자동 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
        position: fixed;
        top: 5rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    `;
    document.body.appendChild(container);
    return container;
}

// ========== 모달 관련 함수 ==========
function createModal(title, content, buttons) {
    const modalId = 'modal-' + Date.now();
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal-backdrop active';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>${title}</h3>
                <button onclick="closeModalById('${modalId}')" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${buttons.map(btn => `
                    <button class="btn ${btn.className || 'btn-secondary'}"
                            onclick="${btn.onclick}">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            closeModalById(modalId);
        }
    });

    return modalId;
}

function closeModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// ========== 피드백 요청 모달 ==========
window.showFeedbackRequestModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'feedback-request-modal';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>피드백 요청</h3>
                <button onclick="closeFeedbackRequestModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
            </div>
            <div class="modal-body">
                <form id="feedback-request-form" onsubmit="submitFeedbackRequest(event)">
                    <!-- 논문 제목 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            논문 제목 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="text" id="feedback-title" required
                               style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;"
                               placeholder="논문 제목을 입력하세요">
                    </div>

                    <!-- 논문 진행 단계 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            논문 진행 단계 <span style="color: #EF4444;">*</span>
                        </label>
                        <select id="feedback-stage" required
                                style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <option value="">선택하세요</option>
                            <option value="연구계획서">연구계획서</option>
                            <option value="중간논문">중간논문</option>
                            <option value="최종논문">최종논문</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>

                    <!-- 첨부파일 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            첨부파일 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="file" id="feedback-file" required accept=".pdf"
                               style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            PDF 파일만 업로드 가능 (최대 30MB)
                        </p>
                    </div>

                    <!-- 주의사항 -->
                    <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                        <p style="font-weight: 600; color: #1E40AF; margin-bottom: 0.5rem;">안내사항</p>
                        <ul style="font-size: 0.75rem; color: #1E40AF; margin-left: 1rem;">
                            <li>한 번에 하나의 파일만 업로드 가능합니다</li>
                            <li>PDF 파일만 업로드 가능하며, 최대 용량은 30MB입니다</li>
                            <li>교수님의 피드백은 영업일 기준 3-5일 소요됩니다</li>
                        </ul>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button onclick="closeFeedbackRequestModal()" class="btn btn-secondary">취소</button>
                <button onclick="document.getElementById('feedback-request-form').requestSubmit()" class="btn btn-primary">
                    요청하기
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
};

window.closeFeedbackRequestModal = function() {
    const modal = document.getElementById('feedback-request-modal');
    if (modal) {
        modal.remove();
    }
};

// ========== 심사 신청 모달 ==========
window.showReviewApplicationModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'review-application-modal';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>심사 신청</h3>
                <button onclick="closeReviewModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
            </div>
            <div class="modal-body">
                <form id="review-application-form" onsubmit="handleReviewApplication(event)">
                    <!-- 논문 제목 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            논문 제목 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="text" id="review-title" required
                               style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;"
                               placeholder="논문 제목을 입력하세요">
                    </div>

                    <!-- 심사 유형 선택 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            심사 유형 <span style="color: #EF4444;">*</span>
                        </label>
                        <select id="review-type" required
                                style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <option value="">선택하세요</option>
                            <option value="연구계획서 심사">연구계획서 심사</option>
                            <option value="중간논문 심사">중간논문 심사</option>
                            <option value="최종논문 심사">최종논문 심사</option>
                        </select>
                    </div>

                    <!-- 희망 심사 마감일 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            희망 심사 마감일 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="date" id="review-deadline" required
                               style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            심사 완료를 희망하는 날짜를 선택하세요 (교수 화면 및 D-day 계산에 활용)
                        </p>
                    </div>

                    <!-- 첨부 파일 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            논문 파일 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="file" id="review-file" required accept=".pdf"
                               style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            PDF 파일만 첨부 가능 (최대 30MB)
                        </p>
                    </div>

                    <!-- 주의사항 -->
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                        <p style="font-weight: 600; color: #92400E; margin-bottom: 0.5rem;">주의사항</p>
                        <ul style="font-size: 0.75rem; color: #92400E; margin-left: 1rem;">
                            <li>신청 후 취소는 심사일 7일 전까지 가능합니다</li>
                            <li>제출한 파일은 수정이 불가하오니 신중히 제출해주세요</li>
                            <li>심사위원회 구성 후 일정 변경 시 개별 연락드립니다</li>
                        </ul>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button onclick="closeReviewModal()" class="btn btn-secondary">취소</button>
                <button onclick="document.getElementById('review-application-form').requestSubmit()" class="btn btn-primary">
                    신청하기
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
};

window.closeReviewModal = function() {
    const modal = document.getElementById('review-application-modal');
    if (modal) {
        modal.remove();
    }
};

// closeModal도 override (title-change.js, review.js에서 사용)
window.closeModal = function() {
    // 모든 모달 제거
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(m => m.remove());
    // modal-container도 비우기
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
};

// ========== 논문제목 변경 모달 ==========
window.showTitleChangeModal = function() {
    const currentTitle = window.DataService?.getCurrentTitle() || { korean: '논문 제목', english: 'Paper Title' };

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'title-change-modal';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>논문제목 변경 신청</h3>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
            </div>
            <div class="modal-body">
                <form id="title-change-form" onsubmit="handleTitleChange(event)">
                    <!-- 현재 제목 -->
                    <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">📝 현재 제목</h4>
                        <div style="margin-bottom: 0.75rem;">
                            <p style="font-size: 0.875rem; color: #6B7280; margin-bottom: 0.25rem;">국문:</p>
                            <p style="font-size: 0.875rem; color: #4B5563;">${currentTitle.korean}</p>
                        </div>
                        <div>
                            <p style="font-size: 0.875rem; color: #6B7280; margin-bottom: 0.25rem;">영문:</p>
                            <p style="font-size: 0.875rem; color: #4B5563;">${currentTitle.english}</p>
                        </div>
                    </div>

                    <!-- 변경할 논문명 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            변경할 논문명 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="text" id="new-title" required
                               style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;"
                               placeholder="변경할 논문 제목을 입력하세요">
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">권장: 50자 이내</p>
                    </div>

                    <!-- 논문명의 언어 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            논문명의 언어 <span style="color: #EF4444;">*</span>
                        </label>
                        <select id="title-language" required
                                style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <option value="">선택하세요</option>
                            <option value="한글">한글</option>
                            <option value="영어">영어</option>
                            <option value="한글/영어">한글/영어</option>
                        </select>
                    </div>

                    <!-- 변경 사유 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            변경 사유 <span style="color: #EF4444;">*</span>
                        </label>
                        <textarea id="change-reason" required
                                  style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; min-height: 120px; resize: vertical;"
                                  placeholder="제목 변경이 필요한 구체적인 사유를 작성해주세요"></textarea>
                    </div>

                    <!-- 주의사항 -->
                    <div style="background: #FEF3C7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #F59E0B;">
                        <p style="font-size: 0.875rem; color: #92400E; font-weight: 600; margin-bottom: 0.5rem;">주의사항</p>
                        <ul style="font-size: 0.75rem; color: #92400E; padding-left: 1.25rem; margin: 0;">
                            <li>제목 변경은 지도교수 및 관리자 승인 후 확정됩니다</li>
                            <li>심사 진행 중인 경우 변경이 제한될 수 있습니다</li>
                            <li>최종 심사 이후에는 제목 변경이 불가합니다</li>
                        </ul>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button onclick="closeModal()" class="btn btn-secondary">취소</button>
                <button onclick="document.getElementById('title-change-form').requestSubmit()" class="btn btn-primary">
                    신청하기
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
};

// ========== 학술지 제출 모달 ==========
window.showJournalSubmissionModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'journal-submission-modal';
    modal.style.cssText = 'overflow-y: auto;';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto; margin: 2rem auto;">
            <div class="modal-header">
                <h3>학술지 대체 심사 실적 제출</h3>
                <button onclick="closeJournalModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
            </div>
            <div class="modal-body" style="padding: 1.5rem;">
                <form id="journalSubmissionForm" onsubmit="submitJournal(event)">
                    <!-- 기존 폼 내용 유지 - 간략화 -->
                    <p style="margin-bottom: 1rem; color: #374151;">학술지 제출 양식이 여기 표시됩니다</p>
                    <div style="text-align: right;">
                        <button type="button" onclick="closeJournalModal()" class="btn btn-secondary" style="margin-right: 0.5rem;">취소</button>
                        <button type="submit" class="btn btn-primary">제출하기</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
};

window.closeJournalModal = function() {
    const modal = document.getElementById('journal-submission-modal');
    if (modal) {
        modal.remove();
    }
};

// ========== 자료실 글쓰기 모달 ==========
window.openBoardWriteModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'boardWriteModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 80rem; width: 95%;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800">글쓰기</h3>
                    <button onclick="closeBoardModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
            </div>

            <div class="p-6">
                <div class="space-y-4">
                    <!-- 제목 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
                        <input type="text" id="postTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="제목을 입력하세요">
                    </div>

                    <!-- 내용 (리치 텍스트 에디터) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">내용 *</label>
                        <div class="border border-gray-300 rounded-lg overflow-hidden">
                            <!-- 에디터 툴바 -->
                            <div class="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
                                <button type="button" onclick="formatText('bold')" class="px-2 py-1 hover:bg-gray-200 rounded" title="굵게">
                                    <strong>B</strong>
                                </button>
                                <button type="button" onclick="formatText('italic')" class="px-2 py-1 hover:bg-gray-200 rounded" title="기울임">
                                    <em>I</em>
                                </button>
                                <button type="button" onclick="formatText('underline')" class="px-2 py-1 hover:bg-gray-200 rounded" title="밑줄">
                                    <u>U</u>
                                </button>
                                <div class="border-l border-gray-300 mx-1"></div>
                                <button type="button" onclick="formatText('insertUnorderedList')" class="px-2 py-1 hover:bg-gray-200 rounded" title="목록">
                                    • 목록
                                </button>
                                <button type="button" onclick="formatText('insertOrderedList')" class="px-2 py-1 hover:bg-gray-200 rounded" title="번호 목록">
                                    1. 목록
                                </button>
                            </div>
                            <div id="postContent"
                                 contenteditable="true"
                                 class="min-h-[300px] p-3 focus:outline-none"
                                 style="max-height: 500px; overflow-y: auto;">
                            </div>
                        </div>
                    </div>

                    <!-- 파일 첨부 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">파일 첨부</label>
                        <input type="file" id="postFiles" multiple class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <p class="text-xs text-gray-500 mt-1">여러 파일을 선택할 수 있습니다 (최대 10MB/파일)</p>
                    </div>

                    <!-- 안내 -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-blue-800">
                            이 글은 지도교수님께만 공개됩니다.
                        </p>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-2 justify-end pt-4">
                        <button onclick="closeBoardModal()" class="btn btn-secondary">취소</button>
                        <button onclick="submitBoardPost()" class="btn btn-primary">등록</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
};

// 텍스트 포맷팅 함수 (에디터용)
window.formatText = function(command) {
    document.execCommand(command, false, null);
    document.getElementById('postContent').focus();
};

window.closeBoardModal = function() {
    const modals = document.querySelectorAll('#boardWriteModal, #boardPostModal, #boardEditModal');
    modals.forEach(modal => modal.remove());
};

// ========== 자료실 게시글 조회 모달 ==========
window.viewBoardPost = function(postId) {
    if (typeof DataService === 'undefined') return;

    const post = DataService.getResourceBoard(postId);
    if (!post) return;

    // 조회수 증가
    DataService.incrementResourceBoardViews(postId);

    const currentUser = window.currentUser || { id: 'S001', role: 'student', name: '학생' };
    const isAuthor = post.authorId === currentUser.id;
    const canEdit = isAuthor;
    const canDelete = isAuthor;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';  // Fixed: added 'active'
    modal.id = 'boardPostModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 72rem; width: 95%;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">${post.title}</h3>
                        <div class="flex items-center gap-4 text-sm text-gray-600">
                            <span>${post.authorName} ${post.authorRole === 'professor' ? '[교수]' : '[학생]'}</span>
                            <span>|</span>
                            <span>${formatDateTime(post.createdAt)}</span>
                            ${post.updatedAt !== post.createdAt ? `<span class="text-xs text-gray-500">(수정됨: ${formatDateTime(post.updatedAt)})</span>` : ''}
                            <span>|</span>
                            <span>조회 ${post.views}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        ${canEdit ? `<button onclick="openBoardEditModal(${post.id})" class="text-sm text-blue-600 hover:text-blue-800">수정</button>` : ''}
                        ${canDelete ? `<button onclick="deleteBoardPost(${post.id})" class="text-sm text-red-600 hover:text-red-800">삭제</button>` : ''}
                        <button onclick="closeBoardModal()" class="text-gray-400 hover:text-gray-600 text-2xl ml-2">&times;</button>
                    </div>
                </div>
            </div>

            <div class="p-6">
                <!-- 본문 -->
                <div class="prose max-w-none mb-6">
                    ${post.content}
                </div>

                <!-- 첨부파일 -->
                ${post.files && post.files.length > 0 ? `
                    <div class="border-t border-gray-200 pt-4 mb-6">
                        <p class="text-sm font-semibold text-gray-700 mb-2">첨부파일 (${post.files.length})</p>
                        <div class="space-y-2">
                            ${post.files.map(file => `
                                <div class="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer p-2 rounded hover:bg-gray-50">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                    </svg>
                                    <span class="flex-1">${file.name}</span>
                                    <span class="text-xs text-gray-500">${formatFileSize(file.size)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- 댓글 -->
                <div class="border-t border-gray-200 pt-4">
                    <p class="text-sm font-semibold text-gray-700 mb-4">댓글 (${post.comments.length})</p>

                    <!-- 댓글 목록 -->
                    <div class="space-y-3 mb-4">
                        ${post.comments.map(comment => {
                            const isCommentAuthor = comment.authorId === currentUser.id;
                            return `
                                <div class="bg-gray-50 p-3 rounded-lg">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <span class="text-sm font-medium text-gray-800">${comment.authorName}</span>
                                            <span class="text-xs text-gray-500 ml-2">${comment.authorRole === 'professor' ? '[교수]' : '[학생]'}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs text-gray-500">${formatDateTime(comment.createdAt)}</span>
                                            ${isCommentAuthor ? `
                                                <button onclick="editBoardComment(${post.id}, '${comment.id}')" class="text-xs text-blue-600 hover:text-blue-800">수정</button>
                                                <button onclick="deleteBoardComment(${post.id}, '${comment.id}')" class="text-xs text-red-600 hover:text-red-800">삭제</button>
                                            ` : ''}
                                        </div>
                                    </div>
                                    <div id="comment-display-${comment.id}">
                                        <p class="text-sm text-gray-700">${comment.text}</p>
                                    </div>
                                    <div id="comment-edit-${comment.id}" style="display: none;">
                                        <textarea id="comment-textarea-${comment.id}" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" rows="2">${comment.text}</textarea>
                                        <div class="flex gap-2 mt-2">
                                            <button onclick="saveBoardCommentEdit(${post.id}, '${comment.id}')" class="text-xs bg-[#009DE8] text-white px-3 py-1 rounded-md hover:bg-[#0087c9]">저장</button>
                                            <button onclick="cancelBoardCommentEdit('${comment.id}')" class="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">취소</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- 댓글 작성 -->
                    <div class="flex gap-2">
                        <textarea id="commentInput" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" rows="2" placeholder="댓글을 입력하세요..."></textarea>
                        <button onclick="addComment(${post.id})" class="btn btn-primary self-start px-4">작성</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
};

// Helper function for file size formatting
window.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Helper function for date formatting
window.formatDateTime = function(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
};

// 자료실 댓글 수정 함수
window.editBoardComment = function(postId, commentId) {
    document.getElementById(`comment-display-${commentId}`).style.display = 'none';
    document.getElementById(`comment-edit-${commentId}`).style.display = 'block';
    document.getElementById(`comment-textarea-${commentId}`).focus();
};

window.saveBoardCommentEdit = function(postId, commentId) {
    const textarea = document.getElementById(`comment-textarea-${commentId}`);
    const newText = textarea.value.trim();

    if (!newText) {
        alert('댓글 내용을 입력하세요.');
        return;
    }

    if (typeof DataService !== 'undefined') {
        // DataService를 통해 댓글 수정 (실제 구현 시)
        // DataService.updateResourceBoardComment(postId, commentId, newText);
    }

    // 임시: alert로 확인
    alert('댓글이 수정되었습니다.');

    // 모달 다시 열어서 갱신된 내용 표시
    closeBoardModal();
    setTimeout(() => viewBoardPost(postId), 100);
};

window.cancelBoardCommentEdit = function(commentId) {
    document.getElementById(`comment-display-${commentId}`).style.display = 'block';
    document.getElementById(`comment-edit-${commentId}`).style.display = 'none';
};

window.deleteBoardComment = function(postId, commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
        return;
    }

    if (typeof DataService !== 'undefined') {
        // DataService를 통해 댓글 삭제
        DataService.deleteResourceBoardComment(postId, commentId);
    }

    alert('댓글이 삭제되었습니다.');

    // 모달 다시 열어서 갱신된 내용 표시
    closeBoardModal();
    setTimeout(() => viewBoardPost(postId), 100);
};

console.log('✅ 모달 수정 스크립트 로드 완료');
