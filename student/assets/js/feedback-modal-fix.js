// 피드백 요청 모달 (수정된 버전)
function showFeedbackRequestModal() {
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
}

function closeFeedbackRequestModal() {
    const modal = document.getElementById('feedback-request-modal');
    if (modal) {
        modal.remove();
    }
}

window.showFeedbackRequestModal = showFeedbackRequestModal;
window.closeFeedbackRequestModal = closeFeedbackRequestModal;
