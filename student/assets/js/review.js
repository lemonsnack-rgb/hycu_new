// ==================== 심사 신청 (테이블형) ====================

let currentReviewTab = 'all';

function renderReview() {
    const reviews = DataService.getReviews();
    const content = document.getElementById('review-screen');
    if (!content) return;

    content.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">학위 논문 제출</h2>
                <p class="text-sm text-gray-600 mt-2">심사 단계별로 논문을 제출하고 진행 상황을 확인하세요</p>
            </div>
        </div>

        <!-- 학위 논문 제출 -->
        <div class="card">
            <!-- 목록 화면 -->
            <div id="review-list-view">
                <div class="card-body" style="padding: 0;">
                    <!-- 테이블 -->
                    <table class="table-fixed" style="width: 100%; border-collapse: collapse;">
                        <thead style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
                            <tr>
                                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">심사 단계</th>
                                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">제출 기간</th>
                                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">제출 상태</th>
                                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">심사 결과</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reviews.length > 0 ? reviews.map(review => {
                                const statusBadge = getStatusBadge(review);
                                const submissionButton = getSubmissionButton(review);
                                return `
                                <tr style="border-bottom: 1px solid #E5E7EB;">
                                    <td style="padding: 0.75rem 1rem;">
                                        <div style="font-weight: 500; color: #1F2937;">${review.type}</div>
                                    </td>
                                    <td style="padding: 0.75rem 1rem;">
                                        ${review.schedule ? `
                                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                                <div style="font-size: 0.875rem;">
                                                    <div style="color: #374151;">${review.schedule.submissionStartDate} ~</div>
                                                    <div style="color: #374151;">${review.schedule.submissionEndDate}</div>
                                                </div>
                                                ${submissionButton}
                                            </div>
                                        ` : `<span style="color: #EF4444; font-size: 0.875rem; font-weight: 500;">일정 미등록</span>`}
                                    </td>
                                    <td style="padding: 0.75rem 1rem;">
                                        ${statusBadge}
                                    </td>
                                    <td style="padding: 0.75rem 1rem;">
                                        ${review.result ? `
                                            <div>
                                                <span class="badge ${review.result === '합격' ? 'badge-success' : 'badge-danger'}">
                                                    ${review.result}
                                                </span>
                                                ${review.score ? `<span style="font-size: 0.875rem; font-weight: 600; color: #009DE8; margin-left: 0.5rem;">${review.score}점</span>` : ''}
                                            </div>
                                        ` : '<span style="color: #9CA3AF;">-</span>'}
                                    </td>
                                </tr>
                            `;
                            }).join('') : `
                                <tr>
                                    <td colspan="4" style="padding: 3rem; text-align: center; color: #9CA3AF;">
                                        심사 단계가 설정되지 않았습니다
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 신청 폼 화면 (초기에는 숨김) -->
            <div id="review-form-view" style="display: none;">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1F2937;">학위 논문 제출</h2>
                        <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">논문 심사 신청서를 작성해주세요</p>
                    </div>
                    <button onclick="hideReviewApplicationForm()" class="btn-secondary">
                        ← 목록으로
                    </button>
                </div>

                <div class="card-body" style="padding: 2rem;">
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

                        <!-- 버튼 -->
                        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                            <button type="button" onclick="hideReviewApplicationForm()" class="btn-secondary">
                                취소
                            </button>
                            <button type="submit" class="btn-primary">
                                신청하기
                            </button>
                        </div>
                    </form>
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
                            <div style="font-size: 2rem; font-weight: 700; color: #009DE8; margin-bottom: 0.5rem;">
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
                                        점수: <strong style="color: #009DE8;">${reviewer.score}점</strong>
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
                                            style="margin-top: 0.5rem; padding: 0.375rem 0.75rem; background: #009DE8; color: white; border: none; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;">
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
                                    <div style="font-size: 1.25rem; font-weight: 600; color: #009DE8;">
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
// ==================== 심사 신청 모달 ====================

function downloadFile(filename) {
    alert(`${filename} 다운로드 (데모)`);
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// 심사 신청 폼 표시/숨김 (인라인 방식)
function showReviewApplicationForm() {
    document.getElementById('review-list-view').style.display = 'none';
    document.getElementById('review-form-view').style.display = 'block';
}

function hideReviewApplicationForm() {
    document.getElementById('review-form-view').style.display = 'none';
    document.getElementById('review-list-view').style.display = 'block';
    // 폼 초기화
    document.getElementById('review-application-form').reset();
}

function handleReviewApplication(event) {
    event.preventDefault();

    const title = document.getElementById('review-title').value;
    const type = document.getElementById('review-type').value;
    const deadline = document.getElementById('review-deadline').value;
    const file = document.getElementById('review-file').files[0];

    if (!file) {
        alert('파일을 선택해주세요');
        return;
    }

    // 파일 크기 검증 (30MB)
    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('파일 크기는 30MB를 초과할 수 없습니다');
        return;
    }

    // 파일 형식 검증
    if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다');
        return;
    }

    // 실제로는 서버로 전송
    console.log('심사 신청:', { title, type, deadline, file: file.name });

    alert('심사 신청이 완료되었습니다.\n관리자 승인 후 심사위원이 배정됩니다.');
    hideReviewApplicationForm();
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
                                <div style="font-size: 3rem; font-weight: 700; color: #009DE8;">
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
                            <div style="padding: 1rem; background: #F9FAFB; border-radius: 0.5rem; border-left: 4px solid #009DE8;">
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
                            <div style="font-size: 2.5rem; font-weight: 700; color: #009DE8; margin-bottom: 0.5rem;">
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

// ==================== 제출 상태 및 액션 버튼 헬퍼 함수 ====================

/**
 * 제출 상태에 따른 배지 HTML 생성 (심사 진행 정보 제거)
 */
function getStatusBadge(review) {
    if (!review.schedule) {
        return '<span class="badge badge-danger">일정 미등록</span>';
    }

    const status = review.status;

    // 상태별 배지 표시 (단순화)
    if (status === '심사 진행중' || status === '심사 중') {
        return '<span class="badge badge-info">심사 중</span>';
    } else if (status === '심사 완료') {
        return '<span class="badge badge-success">심사 완료</span>';
    } else if (status === '미제출') {
        return '<span class="badge badge-warning">미제출</span>';
    } else if (status === '제출 불가') {
        return '<span class="badge" style="background: #9CA3AF; color: white;">제출 불가</span>';
    }

    // submissionStatus 기반 상태 처리
    const submissionStatus = review.submissionStatus;

    switch (submissionStatus) {
        case 'no_schedule':
            return '<span class="badge badge-danger">일정 미등록</span>';
        case 'not_available':
            return '<span class="badge" style="background: #9CA3AF; color: white;">제출 불가</span>';
        case 'not_submitted':
            return '<span class="badge badge-warning">미제출</span>';
        case 'overdue':
            return '<span class="badge badge-danger">기한 경과</span>';
        case 'waiting':
            return '<span class="badge" style="background: #F59E0B; color: white;">심사 대기</span>';
        case 'in_review':
            return '<span class="badge badge-info">심사 중</span>';
        case 'completed':
            return '<span class="badge badge-success">심사 완료</span>';
        default:
            return '<span class="badge badge-warning">미제출</span>';
    }
}

/**
 * 제출 기간 컬럼 내 인라인 제출 버튼 생성
 * 제출 가능 시점에만 버튼 표시
 */
function getSubmissionButton(review) {
    if (!review.schedule) {
        return '';
    }

    const submissionStatus = review.submissionStatus;

    // 제출 가능 상태일 때만 버튼 표시
    if (submissionStatus === 'not_submitted') {
        return `
            <button onclick="submitReview(${review.id})"
                    class="btn-sm btn-primary"
                    style="font-size: 0.75rem; padding: 0.375rem 0.75rem; white-space: nowrap;">
                제출
            </button>
        `;
    }

    // 기한 경과했지만 제출 허용할 경우
    if (submissionStatus === 'overdue') {
        return `
            <button onclick="submitReview(${review.id})"
                    class="btn-sm btn-primary"
                    style="font-size: 0.75rem; padding: 0.375rem 0.75rem; white-space: nowrap;">
                제출
            </button>
        `;
    }

    // 제출 완료 후 심사 시작 전까지는 수정 버튼
    if (review.submissionDate && review.schedule) {
        const now = new Date();
        const reviewStart = new Date(review.schedule.reviewStartDate);

        if (now < reviewStart) {
            return `
                <button onclick="editReviewSubmission(${review.id})"
                        class="btn-sm btn-secondary"
                        style="font-size: 0.75rem; padding: 0.375rem 0.75rem; white-space: nowrap;">
                    수정
                </button>
            `;
        }
    }

    // 그 외의 경우 버튼 없음
    return '';
}

/**
 * 논문 제출 폼 표시 (페이지 전환)
 */
function submitReview(reviewId) {
    const review = DataService.getReviews().find(r => r.id === reviewId);
    if (!review) return;

    // 제출 폼 화면으로 전환
    showReviewSubmissionForm(review);
}

/**
 * 논문 제출 폼 화면 표시 (페이지 전환)
 */
function showReviewSubmissionForm(review) {
    // 목록 화면 숨기기
    document.getElementById('review-list-view').style.display = 'none';

    // 제출 폼 생성 및 표시
    const formView = document.getElementById('review-form-view');
    formView.innerHTML = `
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 style="font-size: 1.5rem; font-weight: 700; color: #1F2937;">${review.type} 제출</h2>
                <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">논문 파일을 업로드하고 제출하세요</p>
            </div>
            <button onclick="hideReviewSubmissionForm()" class="btn-secondary">
                ← 목록으로
            </button>
        </div>

        <div class="card-body" style="padding: 2rem;">
            <form id="review-submission-form" onsubmit="handleReviewSubmission(event, ${review.id})">
                <!-- 심사 단계 (읽기 전용) -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                        심사 단계
                    </label>
                    <div style="padding: 0.75rem; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 0.375rem;">
                        <span style="font-weight: 500; color: #1F2937;">${review.type}</span>
                    </div>
                </div>

                <!-- 논문 제목 -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                        논문 제목 <span style="color: #EF4444;">*</span>
                    </label>
                    <input type="text" id="submission-title" required
                           value="${review.title || ''}"
                           style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;"
                           placeholder="논문 제목을 입력하세요">
                </div>

                <!-- 논문 파일 -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                        논문 파일 <span style="color: #EF4444;">*</span>
                    </label>
                    <input type="file" id="submission-file" required accept=".pdf"
                           style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                    <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.5rem;">
                        <svg style="width: 0.875rem; height: 0.875rem; display: inline; margin-right: 0.25rem;" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        PDF 파일만 첨부 가능 (최대 30MB)
                    </p>
                </div>

                <!-- 희망 심사 신청일 -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                        희망 심사 신청일 <span style="color: #EF4444;">*</span>
                    </label>
                    <input type="date" id="submission-desired-date" required
                           style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                    <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.5rem;">
                        심사 완료를 희망하는 날짜를 선택하세요
                    </p>
                </div>

                <!-- 주의사항 -->
                <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items-start; gap: 0.5rem;">
                        <svg style="width: 1.25rem; height: 1.25rem; color: #F59E0B; flex-shrink: 0; margin-top: 0.125rem;" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        <div>
                            <p style="font-weight: 600; color: #92400E; margin-bottom: 0.5rem;">주의사항</p>
                            <ul style="font-size: 0.75rem; color: #92400E; margin-left: 1rem; line-height: 1.6;">
                                <li>제출한 파일은 심사 시작 전까지만 수정 가능합니다</li>
                                <li>PDF 파일 형식만 업로드 가능하며, 파일 크기는 30MB 이하로 제한됩니다</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 버튼 -->
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" onclick="hideReviewSubmissionForm()" class="btn-secondary">
                        취소
                    </button>
                    <button type="submit" class="btn-primary">
                        제출하기
                    </button>
                </div>
            </form>
        </div>
    `;

    formView.style.display = 'block';
}

/**
 * 제출 폼 숨기고 목록으로 복귀
 */
function hideReviewSubmissionForm() {
    document.getElementById('review-form-view').style.display = 'none';
    document.getElementById('review-list-view').style.display = 'block';
}

/**
 * 논문 제출 처리
 */
function handleReviewSubmission(event, reviewId) {
    event.preventDefault();

    // 폼 데이터 수집
    const title = document.getElementById('submission-title').value.trim();
    const file = document.getElementById('submission-file').files[0];
    const desiredDate = document.getElementById('submission-desired-date').value;

    // 파일 유효성 검사
    if (!file) {
        showAlert('논문 파일을 선택해주세요.');
        return;
    }

    // PDF 파일 형식 검사
    if (file.type !== 'application/pdf') {
        showAlert('PDF 파일만 업로드 가능합니다.');
        return;
    }

    // 파일 크기 검사 (30MB = 30 * 1024 * 1024 bytes)
    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('파일 크기는 30MB 이하로 제한됩니다.');
        return;
    }

    // 날짜 유효성 검사
    const review = DataService.getReviews().find(r => r.id === reviewId);
    if (review && review.schedule) {
        const selectedDate = new Date(desiredDate);
        const submissionEnd = new Date(review.schedule.submissionEndDate);

        if (selectedDate < submissionEnd) {
            showAlert('희망 심사 신청일은 제출 마감일 이후로 선택해주세요.');
            return;
        }
    }

    // TODO: 실제 API 호출 (파일 업로드 및 데이터 저장)
    // const formData = new FormData();
    // formData.append('reviewId', reviewId);
    // formData.append('title', title);
    // formData.append('file', file);
    // formData.append('desiredDate', desiredDate);
    // await uploadReviewSubmission(formData);

    // Mock 데이터 업데이트 (개발용)
    if (review) {
        review.title = title;
        review.file = file.name;
        review.submissionDate = new Date().toISOString().split('T')[0];
        review.status = '심사 대기';
        review.submissionStatus = 'waiting';
    }

    // 성공 메시지 및 목록으로 복귀
    showAlert(`${review.type}이(가) 성공적으로 제출되었습니다.`);
    hideReviewSubmissionForm();
    renderReview(); // 목록 갱신
}

/**
 * 제출 내용 수정
 */
function editReviewSubmission(reviewId) {
    const review = DataService.getReviews().find(r => r.id === reviewId);
    if (!review) return;

    showAlert(`${review.type} 수정 기능은 준비 중입니다.`);
    // TODO: 실제 수정 폼 구현
}

/**
 * 제출 내용 조회
 */
function viewReviewSubmission(reviewId) {
    const review = DataService.getReviews().find(r => r.id === reviewId);
    if (!review) return;

    showAlert(`${review.type} 조회 기능은 준비 중입니다.`);
    // TODO: 실제 조회 화면 구현
}

// Export functions
window.showReviewApplicationForm = showReviewApplicationForm;
window.hideReviewApplicationForm = hideReviewApplicationForm;
window.handleReviewApplication = handleReviewApplication;
window.showReviewerFeedback = showReviewerFeedback;
window.showReviewTimeline = showReviewTimeline;
window.submitReview = submitReview;
window.showReviewSubmissionForm = showReviewSubmissionForm;
window.hideReviewSubmissionForm = hideReviewSubmissionForm;
window.handleReviewSubmission = handleReviewSubmission;
window.editReviewSubmission = editReviewSubmission;
window.viewReviewSubmission = viewReviewSubmission;

console.log('✅ 학생 심사 개선 기능 로드 완료');
