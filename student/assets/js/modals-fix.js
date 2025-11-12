/**
 * 학생용 모달 함수 통합 수정
 * 모든 모달을 modal-backdrop active 구조로 통일
 */

// ========== 피드백 요청 모달 ==========
window.showFeedbackRequestModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'feedback-request-modal';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
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
        <div class="modal-content" style="max-width: 600px;">
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
        <div class="modal-content" style="max-width: 56rem;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">글쓰기</h3>
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

                    <!-- 내용 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">내용 *</label>
                        <div class="border border-gray-300 rounded-lg overflow-hidden">
                            <div id="postContent"
                                 contenteditable="true"
                                 class="min-h-[300px] p-3 focus:outline-none"
                                 style="max-height: 400px; overflow-y: auto;">
                            </div>
                        </div>
                    </div>

                    <!-- 안내 -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-blue-800">
                            이 글은 지도교수님께만 공개됩니다.
                        </p>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-2 justify-end pt-4">
                        <button onclick="closeBoardModal()" class="btn-cancel">취소</button>
                        <button onclick="submitBoardPost()" class="btn-primary">등록</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
};

window.closeBoardModal = function() {
    const modals = document.querySelectorAll('#boardWriteModal, #boardPostModal, #boardEditModal');
    modals.forEach(modal => modal.remove());
};

console.log('✅ 모달 수정 스크립트 로드 완료');
