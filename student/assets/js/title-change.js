// ==================== 논문 제목 관리 ====================

function renderTitleChange() {
    const currentTitle = DataService.getCurrentTitle();
    const content = document.getElementById('title-change-screen');
    if (!content) return;

    content.innerHTML = `
        <!-- 논문 제목 관리 -->
        <div class="card">
            <div class="card-header">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1F2937;">논문 제목 관리</h2>
                    <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">논문 제목을 입력하고 수정할 수 있습니다.</p>
                </div>
            </div>
            <div class="card-body">
                <form id="title-form" onsubmit="saveTitleChange(event)" style="max-width: 800px;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="font-weight: 600; color: #374151; font-size: 0.875rem; display: block; margin-bottom: 0.5rem;">
                            논문 제목 (국문) <span style="color: #DC2626;">*</span>
                        </label>
                        <input type="text"
                               id="title-korean"
                               value="${currentTitle.korean || ''}"
                               placeholder="국문 논문 제목을 입력하세요"
                               required
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem;">
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            예: 인공지능 기반 추천 시스템의 효율성 향상에 관한 연구
                        </p>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="font-weight: 600; color: #374151; font-size: 0.875rem; display: block; margin-bottom: 0.5rem;">
                            논문 제목 (영문) <span style="color: #DC2626;">*</span>
                        </label>
                        <input type="text"
                               id="title-english"
                               value="${currentTitle.english || ''}"
                               placeholder="영문 논문 제목을 입력하세요"
                               required
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem;">
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            예: A Study on Improving the Efficiency of AI-based Recommendation Systems
                        </p>
                    </div>

                    ${currentTitle.registrationDate ? `
                        <div style="background: #F3F4F6; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                            <div style="display: flex; gap: 2rem; font-size: 0.875rem; color: #6B7280;">
                                <p><strong style="color: #374151;">등록일:</strong> ${currentTitle.registrationDate}</p>
                                ${currentTitle.lastModifiedDate ? `<p><strong style="color: #374151;">최종 수정일:</strong> ${currentTitle.lastModifiedDate}</p>` : ''}
                            </div>
                        </div>
                    ` : ''}

                    <div style="background: #EFF6FF; border: 1px solid #DBEAFE; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: start;">
                            <svg style="width: 1.25rem; height: 1.25rem; color: #3B82F6; flex-shrink: 0; margin-right: 0.75rem; margin-top: 0.125rem;"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div style="font-size: 0.875rem; color: #1E40AF;">
                                <p style="font-weight: 600;">안내사항이 삽입될 예정입니다.</p>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: center; gap: 1rem;">
                        <button type="submit" class="btn btn-primary" style="min-width: 120px;">
                            저장
                        </button>
                        <button type="button" onclick="cancelTitleForm()" class="btn btn-secondary" style="min-width: 120px;">
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function saveTitleChange(event) {
    event.preventDefault();

    const korean = document.getElementById('title-korean').value.trim();
    const english = document.getElementById('title-english').value.trim();

    if (!korean || !english) {
        alert('국문 제목과 영문 제목을 모두 입력해주세요.');
        return;
    }

    // 데이터 저장
    DataService.updateTitle({
        korean: korean,
        english: english,
        lastModifiedDate: new Date().toISOString().split('T')[0]
    });

    showCustomAlert('논문 제목이 저장되었습니다.', 'success');

    // 화면 새로고침
    renderTitleChange();
}

function cancelTitleForm() {
    const currentTitle = DataService.getCurrentTitle();
    document.getElementById('title-korean').value = currentTitle.korean || '';
    document.getElementById('title-english').value = currentTitle.english || '';
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('title-change-screen')) {
        renderTitleChange();
    }
});

console.log('✅ title-change.js 로드 완료');
