// ==================== 심사 신청 (테이블형) ====================

let currentReviewTab = 'all';

function renderReview() {
    const reviews = DataService.getReviews();
    const content = document.getElementById('review-screen');
    if (!content) return;
    
    // 필터링
    let filteredReviews = [...reviews];
    if (currentReviewTab === 'progress') {
        filteredReviews = reviews.filter(r => r.status === '심사 진행중');
    } else if (currentReviewTab === 'completed') {
        filteredReviews = reviews.filter(r => r.status === '심사 완료');
    }
    
    content.innerHTML = `
        <!-- 심사 신청 가능 여부 -->
        <div class="card mb-6">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            심사 신청 가능 여부
                        </h3>
                        <p style="font-size: 0.875rem; color: #6B7280;">
                            다음 심사 단계: <strong>최종논문 심사</strong>
                        </p>
                    </div>
                    <button onclick="showReviewApplicationModal()" class="btn btn-primary" disabled>
                        심사 신청하기
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem; color: #10B981;">✓</span>
                        <span style="font-size: 0.875rem; color: #065F46;">학점 이수 완료 (36/36)</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem; color: #10B981;">✓</span>
                        <span style="font-size: 0.875rem; color: #065F46;">연구계획서 승인</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem; color: #10B981;">✓</span>
                        <span style="font-size: 0.875rem; color: #065F46;">중간논문 승인</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem; color: #F59E0B;">!</span>
                        <span style="font-size: 0.875rem; color: #92400E;">학술활동 (1/2) - 1건 부족</span>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; padding: 0.75rem; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 0.375rem;">
                    <p style="font-size: 0.875rem; color: #92400E;">
                        조건 미충족: 학술활동 1건이 더 필요합니다. 신청 가능 기간: 2025-12-01 ~ 2025-12-15
                    </p>
                </div>
            </div>
        </div>
        
        <!-- 심사 진행 현황 -->
        <div class="card">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600; color: #1F2937;">
                    심사 진행 현황
                </h3>
            </div>
            <div class="card-body" style="padding: 0;">
                <!-- 탭 -->
                <div style="display: flex; gap: 0.5rem; padding: 1rem 1rem 0 1rem; border-bottom: 2px solid #F3F4F6;">
                    <button onclick="filterReviews('all')" class="tab-button ${currentReviewTab === 'all' ? 'active' : ''}" data-tab="all">
                        전체 (${reviews.length})
                    </button>
                    <button onclick="filterReviews('progress')" class="tab-button ${currentReviewTab === 'progress' ? 'active' : ''}" data-tab="progress">
                        진행중 (${reviews.filter(r => r.status === '심사 진행중').length})
                    </button>
                    <button onclick="filterReviews('completed')" class="tab-button ${currentReviewTab === 'completed' ? 'active' : ''}" data-tab="completed">
                        완료 (${reviews.filter(r => r.status === '심사 완료').length})
                    </button>
                </div>
                
                <!-- 테이블 -->
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 25%;">심사 종류</th>
                                <th style="width: 15%;">신청일</th>
                                <th style="width: 30%;">진행 상태</th>
                                <th style="width: 15%;">진행률</th>
                                <th style="width: 15%;">결과</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredReviews.length > 0 ? filteredReviews.map(review => `
                                <tr onclick="showReviewDetail(${review.id})">
                                    <td data-label="심사 종류">
                                        <div style="display: flex; align-items: center;">
                                            <i class="fas fa-file-alt" style="color: #6A0028; margin-right: 0.5rem;"></i>
                                            <span style="font-weight: 500;">${review.type}</span>
                                        </div>
                                    </td>
                                    <td data-label="신청일">${review.applicationDate}</td>
                                    <td data-label="진행 상태">
                                        <div>
                                            <span class="badge ${review.status === '심사 진행중' ? 'badge-info' : 'badge-success'}">
                                                ${review.status}
                                            </span>
                                            ${review.statusDetail ? `<br><span style="font-size: 0.75rem; color: #6B7280;">${review.statusDetail}</span>` : ''}
                                        </div>
                                    </td>
                                    <td data-label="진행률">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <span style="font-weight: 600; color: #6A0028;">${review.progress}%</span>
                                            <div class="progress-bar">
                                                <div class="progress-fill" style="width: ${review.progress}%;"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="결과">
                                        ${review.result ? `
                                            <div>
                                                <span class="badge ${review.result === '합격' ? 'badge-success' : 'badge-danger'}">
                                                    ${review.result}
                                                </span>
                                                ${review.score ? `<br><span style="font-size: 0.875rem; font-weight: 600; color: #6A0028;">${review.score}점</span>` : ''}
                                            </div>
                                        ` : '<span style="color: #9CA3AF;">-</span>'}
                                    </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="5" style="text-align: center; padding: 3rem; color: #9CA3AF;">
                                        해당하는 심사가 없습니다
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
                
                <div style="padding: 1rem; border-top: 1px solid #F3F4F6; font-size: 0.875rem; color: #6B7280;">
                    ※ 행을 클릭하면 상세 정보를 확인할 수 있습니다
                </div>
            </div>
        </div>
    `;
}

function filterReviews(tab) {
    currentReviewTab = tab;
    renderReview();
}

function showReviewDetail(reviewId) {
    const review = DataService.getReviews().find(r => r.id === reviewId);
    if (!review) return;
    
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>심사 상세: ${review.type}</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 기본 정보 -->
                    <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">기본 정보</h4>
                        <div style="font-size: 0.875rem; color: #6B7280;">
                            <p>심사 종류: <strong>${review.type}</strong></p>
                            <p>신청일: ${review.applicationDate}</p>
                            ${review.expectedDate ? `<p>심사 예정일: ${review.expectedDate}</p>` : ''}
                        </div>
                    </div>
                    
                    <!-- 진행 상황 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">심사 진행 상황</h4>
                        <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: #6A0028; margin-bottom: 0.5rem;">
                                ${review.progress}%
                            </div>
                            <div class="progress-bar" style="width: 100%; max-width: 400px; margin: 0 auto 1rem;">
                                <div class="progress-fill" style="width: ${review.progress}%;"></div>
                            </div>
                            <span class="badge ${review.status === '심사 진행중' ? 'badge-info' : 'badge-success'}">
                                ${review.status}
                            </span>
                        </div>
                    </div>
                    
                    <!-- 심사위원 현황 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">심사위원 현황</h4>
                        ${review.reviewers.map((reviewer, index) => `
                            <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <div>
                                        <strong>${index + 1}. ${reviewer.name}</strong>
                                        <span style="font-size: 0.875rem; color: #6B7280;"> (${reviewer.role})</span>
                                    </div>
                                    <span class="badge ${reviewer.status === '완료' ? 'badge-success' : 'badge-gray'}">
                                        ${reviewer.status}
                                    </span>
                                </div>
                                ${reviewer.score ? `
                                    <p style="font-size: 0.875rem; color: #6B7280;">
                                        점수: <strong style="color: #6A0028;">${reviewer.score}점</strong>
                                    </p>
                                ` : ''}
                                ${reviewer.reviewDate ? `
                                    <p style="font-size: 0.875rem; color: #6B7280;">
                                        심사일: ${reviewer.reviewDate}
                                    </p>
                                ` : ''}
                                ${reviewer.comment ? `
                                    <p style="font-size: 0.875rem; color: #4B5563; margin-top: 0.5rem; padding: 0.5rem; background: #F9FAFB; border-radius: 0.25rem; line-clamp: 2;">
                                        "${reviewer.comment.length > 100 ? reviewer.comment.substring(0, 100) + '...' : reviewer.comment}"
                                    </p>
                                ` : ''}
                                ${reviewer.status === '완료' ? `
                                    <button onclick="showReviewerFeedback(${review.id}, ${index})" 
                                            style="margin-top: 0.5rem; padding: 0.375rem 0.75rem; background: #6A0028; color: white; border: none; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;">
                                        피드백 상세보기
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 결과 -->
                    ${review.result ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">🎉 심사 결과</h4>
                            <div style="background: ${review.result === '합격' ? '#ECFDF5' : '#FEE2E2'}; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">
                                    ${review.result === '합격' ? '🎉' : '❌'}
                                </div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: ${review.result === '합격' ? '#065F46' : '#991B1B'}; margin-bottom: 0.5rem;">
                                    ${review.result}
                                </div>
                                ${review.score ? `
                                    <div style="font-size: 1.25rem; font-weight: 600; color: #6A0028;">
                                        ${review.score}점
                                    </div>
                                    <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.5rem;">
                                        평균: ${review.score}점 (합격 기준: 70점 이상)
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- 표절검사 결과 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">표절검사 결과</h4>
                        <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <p style="font-size: 0.875rem; color: #6B7280;">유사도</p>
                                    <p style="font-size: 1.5rem; font-weight: 700; color: ${review.plagiarismRate < 15 ? '#10B981' : '#EF4444'};">
                                        ${review.plagiarismRate}%
                                    </p>
                                </div>
                                <span class="badge ${review.plagiarismStatus === '통과' ? 'badge-success' : 'badge-danger'}">
                                    ${review.plagiarismStatus}
                                </span>
                            </div>
                            <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.5rem;">
                                기준: 15% 미만 통과
                            </p>
                        </div>
                    </div>
                    
                    <!-- 제출 서류 -->
                    <div>
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">제출 서류</h4>
                        <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="font-size: 0.875rem;">
                                    <i class="fas fa-file-pdf" style="color: #EF4444;"></i> ${review.file}
                                </span>
                                <button onclick="downloadFile('${review.file}')" class="btn btn-sm btn-secondary">
                                    <i class="fas fa-download"></i> 다운로드
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="showReviewTimeline(" + review.id + ")" class="btn btn-secondary"><i class="fas fa-history"></i> 진행 타임라인</button><button onclick="closeModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

function showReviewApplicationModal() {
    alert('심사 신청 기능은 데모에서 비활성화되어 있습니다.');
}

function downloadFile(filename) {
    alert(`${filename} 다운로드 (데모)`);
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// ==================== 심사 신청 모달 ====================

function showReviewApplicationModal() {
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>심사 신청하기</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 심사 유형 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            심사 유형 <span style="color: #EF4444;">*</span>
                        </label>
                        <select id="review-type" style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <option value="">선택하세요</option>
                            <option value="연구계획서 심사">연구계획서 심사</option>
                            <option value="중간논문 심사">중간논문 심사</option>
                            <option value="최종논문 심사">최종논문 심사</option>
                        </select>
                    </div>
                    
                    <!-- 희망일자 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            희망 심사일 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="date" id="review-date" 
                               style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                    </div>
                    
                    <!-- 제출 파일 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            제출 파일 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="file" id="review-file" accept=".pdf,.docx"
                               style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            PDF 또는 DOCX 파일만 업로드 가능합니다
                        </p>
                    </div>
                    
                    <!-- 비고 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            비고
                        </label>
                        <textarea id="review-note" rows="3"
                                  style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: vertical;"
                                  placeholder="기타 전달사항이 있으시면 입력해주세요"></textarea>
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
                </div>
                <div class="modal-footer">
                    <button onclick="submitReviewApplication()" class="btn btn-primary">
                        신청하기
                    </button>
                    <button onclick="closeModal()" class="btn btn-secondary">
                        취소
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

function submitReviewApplication() {
    const type = document.getElementById('review-type').value;
    const date = document.getElementById('review-date').value;
    const file = document.getElementById('review-file').files[0];
    
    if (!type) {
        alert('심사 유형을 선택해주세요');
        return;
    }
    
    if (!date) {
        alert('희망 심사일을 선택해주세요');
        return;
    }
    
    if (!file) {
        alert('제출 파일을 선택해주세요');
        return;
    }
    
    // 실제로는 서버로 전송
    console.log('심사 신청:', { type, date, file: file.name });
    
    closeModal();
    showSuccessNotification('심사 신청이 완료되었습니다');
    
    // 페이지 새로고침
    setTimeout(() => {
        renderReview();
    }, 1000);
}

function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

console.log('✅ 심사 신청 기능 로드 완료');

// ==================== 학생 심사 개선 기능 ====================

// 심사 신청 모달 (실제 구현)
function showReviewApplicationModal() {
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>심사 신청</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 신청 불가 안내 -->
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #92400E; margin-bottom: 0.5rem;">신청 조건 미충족</h4>
                        <p style="font-size: 0.875rem; color: #92400E; margin-bottom: 0.5rem;">
                            다음 조건을 충족해야 심사를 신청할 수 있습니다:
                        </p>
                        <ul style="font-size: 0.875rem; color: #92400E; margin-left: 1.5rem;">
                            <li>학술활동 2건 (현재 1건)</li>
                            <li>신청 가능 기간: 2025-12-01 ~ 2025-12-15</li>
                        </ul>
                    </div>
                    
                    <!-- 심사 종류 선택 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            심사 종류
                        </label>
                        <select id="review-type" class="form-control" disabled>
                            <option value="">선택하세요</option>
                            <option value="proposal">연구계획서 심사</option>
                            <option value="interim">중간논문 심사</option>
                            <option value="final" selected>최종논문 심사</option>
                        </select>
                    </div>
                    
                    <!-- 희망 심사일 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            희망 심사일
                        </label>
                        <input type="date" id="review-date" class="form-control" disabled>
                    </div>
                    
                    <!-- 첨부 파일 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            논문 파일
                        </label>
                        <input type="file" id="review-file" class="form-control" accept=".pdf" disabled>
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            PDF 파일만 첨부 가능합니다.
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-secondary">취소</button>
                    <button onclick="submitReviewApplication()" class="btn btn-primary" disabled>
                        신청하기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

// 심사 신청 제출
function submitReviewApplication() {
    const type = document.getElementById('review-type').value;
    const date = document.getElementById('review-date').value;
    const file = document.getElementById('review-file').files[0];
    
    if (!type || !date || !file) {
        alert('모든 항목을 입력해주세요.');
        return;
    }
    
    // 실제로는 서버에 전송
    alert('심사 신청이 완료되었습니다.\n관리자 승인 후 심사위원이 배정됩니다.');
    closeModal();
    renderReview();
}

// 심사위원별 피드백 상세보기
function showReviewerFeedback(reviewId, reviewerIndex) {
    const review = DataService.getReviews().find(r => r.id === reviewId);
    if (!review || !review.reviewers[reviewerIndex]) return;
    
    const reviewer = review.reviewers[reviewerIndex];
    
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>심사위원 피드백 상세</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 심사위원 정보 -->
                    <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">심사위원 정보</h4>
                        <p style="font-size: 0.875rem; color: #6B7280;">
                            <strong>${reviewer.name}</strong> (${reviewer.role})
                        </p>
                        ${reviewer.reviewDate ? `
                            <p style="font-size: 0.875rem; color: #6B7280;">
                                심사일: ${reviewer.reviewDate}
                            </p>
                        ` : ''}
                    </div>
                    
                    <!-- 심사 결과 -->
                    ${reviewer.score ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">심사 점수</h4>
                            <div style="text-align: center; padding: 1.5rem; background: #F9FAFB; border-radius: 0.5rem;">
                                <div style="font-size: 3rem; font-weight: 700; color: #6A0028;">
                                    ${reviewer.score}점
                                </div>
                                <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.5rem;">
                                    ${reviewer.score >= 70 ? '합격 기준 충족' : '추가 수정 필요'}
                                </p>
                            </div>
                        </div>
                    ` : '<p style="text-align: center; padding: 2rem; color: #6B7280;">아직 심사가 진행되지 않았습니다.</p>'}
                    
                    <!-- 심사 의견 -->
                    ${reviewer.comment ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">심사 의견</h4>
                            <div style="padding: 1rem; background: #F9FAFB; border-radius: 0.5rem; border-left: 4px solid #6A0028;">
                                <p style="font-size: 0.875rem; color: #4B5563; white-space: pre-wrap;">
                                    ${reviewer.comment}
                                </p>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- 수정 요청 사항 -->
                    ${reviewer.revisionRequests && reviewer.revisionRequests.length > 0 ? `
                        <div>
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">수정 요청 사항</h4>
                            <div style="background: #FEF3C7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #F59E0B;">
                                <ul style="margin-left: 1.5rem; font-size: 0.875rem; color: #92400E;">
                                    ${reviewer.revisionRequests.map(req => `
                                        <li style="margin-bottom: 0.5rem;">${req}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

// 심사 진행 타임라인
function showReviewTimeline(reviewId) {
    const review = DataService.getReviews().find(r => r.id === reviewId);
    if (!review) return;
    
    const timeline = [
        { date: review.applicationDate, label: '심사 신청', status: 'completed' },
        { date: review.expectedDate, label: '심사위원 배정', status: review.reviewers.length > 0 ? 'completed' : 'pending' },
        { date: null, label: '심사 진행', status: review.progress > 0 ? 'in-progress' : 'pending' },
        { date: null, label: '심사 완료', status: review.status === '심사 완료' ? 'completed' : 'pending' }
    ];
    
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>심사 진행 타임라인</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <div style="padding: 1rem;">
                        ${timeline.map((item, index) => `
                            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                                <!-- 타임라인 아이콘 -->
                                <div style="display: flex; flex-direction: column; align-items: center;">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; ${
                                        item.status === 'completed' ? 'background: #10B981; color: white;' :
                                        item.status === 'in-progress' ? 'background: #3B82F6; color: white;' :
                                        'background: #E5E7EB; color: #9CA3AF;'
                                    }">
                                        ${item.status === 'completed' ? '✓' : index + 1}
                                    </div>
                                    ${index < timeline.length - 1 ? `
                                        <div style="width: 2px; height: 50px; ${
                                            item.status === 'completed' ? 'background: #10B981;' : 'background: #E5E7EB;'
                                        }"></div>
                                    ` : ''}
                                </div>
                                
                                <!-- 타임라인 내용 -->
                                <div style="flex: 1;">
                                    <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 0.25rem;">
                                        ${item.label}
                                    </h4>
                                    ${item.date ? `
                                        <p style="font-size: 0.875rem; color: #6B7280;">
                                            ${item.date}
                                        </p>
                                    ` : ''}
                                    <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; ${
                                        item.status === 'completed' ? 'background: #D1FAE5; color: #065F46;' :
                                        item.status === 'in-progress' ? 'background: #DBEAFE; color: #1E40AF;' :
                                        'background: #F3F4F6; color: #6B7280;'
                                    }">
                                        ${item.status === 'completed' ? '완료' : 
                                          item.status === 'in-progress' ? '진행중' : '대기'}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 진행률 -->
                    <div style="margin-top: 2rem; padding: 1rem; background: #F9FAFB; border-radius: 0.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem; text-align: center;">
                            전체 진행률
                        </h4>
                        <div style="text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: #6A0028; margin-bottom: 0.5rem;">
                                ${review.progress}%
                            </div>
                            <div class="progress-bar" style="width: 100%; max-width: 400px; margin: 0 auto;">
                                <div class="progress-fill" style="width: ${review.progress}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

// Export functions
window.showReviewApplicationModal = showReviewApplicationModal;
window.submitReviewApplication = submitReviewApplication;
window.showReviewerFeedback = showReviewerFeedback;
window.showReviewTimeline = showReviewTimeline;

console.log('✅ 학생 심사 개선 기능 로드 완료');
