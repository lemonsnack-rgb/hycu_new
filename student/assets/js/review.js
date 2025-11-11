// ==================== 학생 심사 신청 화면 (P0-2) ====================

// 심사 신청 데이터 관리
function getReviewApplications() {
    const stored = localStorage.getItem('review_applications');
    return stored ? JSON.parse(stored) : [];
}

function saveReviewApplication(application) {
    const applications = getReviewApplications();
    applications.push(application);
    localStorage.setItem('review_applications', JSON.stringify(applications));
}

// 심사 신청 가능 여부 확인
function checkReviewEligibility() {
    const reqs = DataService.getGraduationRequirements();
    const proposalReview = reqs.find(r => r.name === '연구계획서 심사');
    const midtermReview = reqs.find(r => r.name === '중간논문 심사');
    const finalReview = reqs.find(r => r.name === '최종논문 심사');

    // 중간논문 심사 가능 여부 체크
    const canApplyMidterm = proposalReview && proposalReview.completed && proposalReview.status === '완료';

    // 최종논문 심사 가능 여부 체크
    const canApplyFinal = midtermReview && midtermReview.completed && midtermReview.status === '완료';

    // 현재 신청 가능한 심사 종류 결정
    let nextReviewType = null;
    let eligibilityMessage = '';

    if (!canApplyMidterm) {
        nextReviewType = '중간논문 심사';
        eligibilityMessage = '연구계획서 심사 완료 및 교수님의 최종 승인 후 신청 가능합니다';
    } else if (!canApplyFinal) {
        nextReviewType = '최종논문 심사';
        eligibilityMessage = '중간논문 심사 완료 및 교수님의 최종 승인 후 신청 가능합니다';
    } else {
        nextReviewType = '최종논문 심사';
        eligibilityMessage = '신청 가능';
    }

    return {
        canApplyMidterm,
        canApplyFinal,
        nextReviewType,
        eligibilityMessage,
        canApply: canApplyMidterm || canApplyFinal
    };
}

// 최근 제출물에서 논문 제목 가져오기
function getRecentThesisTitles() {
    const submissions = JSON.parse(localStorage.getItem('feedback_submissions') || '[]');
    const titles = [...new Set(submissions.map(s => s.title).filter(Boolean))];
    return titles.slice(0, 5); // 최근 5개만
}

// 상태 아이콘 및 텍스트 매핑
function getStatusInfo(status) {
    const statusMap = {
        'waiting_assignment': { icon: '⏳', text: '위원 배정 대기', color: '#6B7280' },
        'in_progress': { icon: '⚡', text: '심사 진행 중', color: '#3B82F6' },
        'completed': { icon: '🔵', text: '종합평가 대기', color: '#6366F1' },
        'approved': { icon: '✅', text: '승인', color: '#10B981' },
        'on_hold': { icon: '🔄', text: '보류', color: '#F59E0B' },
        'failed': { icon: '⛔', text: '불합격', color: '#EF4444' }
    };
    return statusMap[status] || { icon: '❓', text: status, color: '#9CA3AF' };
}

// 메인 렌더링 함수
function renderReview() {
    const content = document.getElementById('review-screen');
    if (!content) return;

    const eligibility = checkReviewEligibility();
    const reqs = DataService.getGraduationRequirements();
    const applications = getReviewApplications();

    // 기존 심사 데이터와 신청 데이터 병합
    const existingReviews = DataService.getReviews() || [];

    content.innerHTML = `
        <!-- 심사 신청 가능 여부 -->
        <div class="card mb-6">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            심사 신청
                        </h3>
                        <p style="font-size: 0.875rem; color: #6B7280;">
                            다음 심사 단계: <strong>${eligibility.nextReviewType}</strong>
                        </p>
                    </div>
                    <button onclick="showReviewApplicationModal()" class="btn btn-primary" ${!eligibility.canApply ? 'disabled' : ''}>
                        심사 신청하기
                    </button>
                </div>

                <!-- 신청 조건 체크리스트 -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    ${reqs.map(req => {
                        const isCompleted = req.completed || req.status === '완료';
                        const icon = isCompleted ? '✓' : (req.status === '진행중' ? '🔄' : '☐');
                        const iconColor = isCompleted ? '#10B981' : (req.status === '진행중' ? '#F59E0B' : '#9CA3AF');
                        const textColor = isCompleted ? '#065F46' : (req.status === '진행중' ? '#92400E' : '#6B7280');

                        return `
                            <div style="display: flex; align-items: center;">
                                <span style="font-size: 1.5rem; margin-right: 0.5rem; color: ${iconColor};">${icon}</span>
                                <span style="font-size: 0.875rem; color: ${textColor};">${req.name} ${req.details ? '(' + req.details + ')' : ''}</span>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${!eligibility.canApply ? `
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 0.375rem;">
                        <p style="font-size: 0.875rem; color: #92400E;">
                            ${eligibility.eligibilityMessage}
                        </p>
                    </div>
                ` : `
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #ECFDF5; border-left: 4px solid #10B981; border-radius: 0.375rem;">
                        <p style="font-size: 0.875rem; color: #065F46;">
                            ✓ 심사 신청 가능 조건을 충족하였습니다
                        </p>
                    </div>
                `}
            </div>
        </div>

        <!-- 심사 신청 내역 -->
        <div class="card">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600; color: #1F2937;">
                    심사 신청 내역
                </h3>
            </div>
            <div class="card-body" style="padding: 0;">
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 8%;">번호</th>
                                <th style="width: 15%;">심사 종류</th>
                                <th style="width: 30%;">논문 제목</th>
                                <th style="width: 12%;">신청일</th>
                                <th style="width: 12%;">희망일</th>
                                <th style="width: 23%;">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${applications.length > 0 ? applications.map((app, index) => {
                                const statusInfo = getStatusInfo(app.status);
                                const committeeCount = app.committee ? app.committee.filter(c => c.evaluated).length : 0;
                                const totalCommittee = app.committee ? app.committee.length : 0;

                                return `
                                    <tr onclick="showReviewDetailModal('${app.id}')" style="cursor: pointer;">
                                        <td data-label="번호">${applications.length - index}</td>
                                        <td data-label="심사 종류">
                                            <span style="font-weight: 500;">${app.reviewType === 'midterm' ? '중간논문 심사' : '최종논문 심사'}</span>
                                        </td>
                                        <td data-label="논문 제목" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            ${app.thesisTitle}
                                        </td>
                                        <td data-label="신청일">${new Date(app.appliedAt).toLocaleDateString('ko-KR')}</td>
                                        <td data-label="희망일">${app.requestedDate}</td>
                                        <td data-label="상태">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <span style="font-size: 1.25rem;">${statusInfo.icon}</span>
                                                <div>
                                                    <span style="font-weight: 500; color: ${statusInfo.color};">${statusInfo.text}</span>
                                                    ${app.status === 'in_progress' && totalCommittee > 0 ? `
                                                        <br><span style="font-size: 0.75rem; color: #6B7280;">${committeeCount}/${totalCommittee} 심사 완료</span>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('') : `
                                <tr>
                                    <td colspan="6" style="text-align: center; padding: 3rem; color: #9CA3AF;">
                                        신청 내역이 없습니다
                                    </td>
                                </tr>
                            `}
                            ${existingReviews.length > 0 ? existingReviews.map((review, index) => {
                                const reviewTypeMap = {
                                    '연구계획서 심사': 'proposal',
                                    '중간논문 심사': 'midterm',
                                    '최종논문 심사': 'final'
                                };
                                const reviewType = reviewTypeMap[review.type] || review.type;

                                return `
                                    <tr onclick="showExistingReviewDetail(${review.id})" style="cursor: pointer;">
                                        <td data-label="번호">${applications.length + existingReviews.length - index}</td>
                                        <td data-label="심사 종류">
                                            <span style="font-weight: 500;">${review.type}</span>
                                        </td>
                                        <td data-label="논문 제목" style="max-width: 250px;">
                                            ${review.file ? review.file.replace('.pdf', '') : '-'}
                                        </td>
                                        <td data-label="신청일">${review.applicationDate}</td>
                                        <td data-label="희망일">${review.expectedDate || '-'}</td>
                                        <td data-label="상태">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <span style="font-size: 1.25rem;">${review.status === '심사 완료' ? '✅' : '⚡'}</span>
                                                <div>
                                                    <span style="font-weight: 500; color: ${review.status === '심사 완료' ? '#10B981' : '#3B82F6'};">${review.status}</span>
                                                    ${review.statusDetail ? `
                                                        <br><span style="font-size: 0.75rem; color: #6B7280;">${review.statusDetail}</span>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('') : ''}
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

// 심사 신청 모달
function showReviewApplicationModal() {
    const eligibility = checkReviewEligibility();

    if (!eligibility.canApply) {
        alert(eligibility.eligibilityMessage);
        return;
    }

    const recentTitles = getRecentThesisTitles();

    // 최소 신청 가능 날짜 계산 (2주 후)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 14);
    const minDateStr = minDate.toISOString().split('T')[0];

    const modalContent = `
        <div class="modal-backdrop active" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div class="modal" style="max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>📝 심사 신청</h3>
                    <button onclick="closeReviewApplicationModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 심사 종류 선택 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 0.75rem;">
                            심사 종류 <span style="color: #EF4444;">*</span>
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            ${eligibility.canApplyMidterm ? `
                                <label style="display: flex; align-items: center; padding: 0.75rem; border: 2px solid #D1D5DB; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;" onmouseenter="this.style.borderColor='#6A0028'" onmouseleave="if(!this.querySelector('input').checked) this.style.borderColor='#D1D5DB'" onclick="updateReviewTypeStyle(this)">
                                    <input type="radio" name="review-type" value="midterm" style="margin-right: 0.75rem; width: 1.25rem; height: 1.25rem; cursor: pointer;" onchange="updateReviewTypeStyle(this.parentElement)">
                                    <div>
                                        <div style="font-weight: 600; color: #1F2937;">중간논문 심사</div>
                                        <div style="font-size: 0.75rem; color: #6B7280;">연구계획서 심사 완료 후 신청 가능</div>
                                    </div>
                                </label>
                            ` : ''}
                            ${eligibility.canApplyFinal ? `
                                <label style="display: flex; align-items: center; padding: 0.75rem; border: 2px solid #D1D5DB; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;" onmouseenter="this.style.borderColor='#6A0028'" onmouseleave="if(!this.querySelector('input').checked) this.style.borderColor='#D1D5DB'" onclick="updateReviewTypeStyle(this)">
                                    <input type="radio" name="review-type" value="final" style="margin-right: 0.75rem; width: 1.25rem; height: 1.25rem; cursor: pointer;" onchange="updateReviewTypeStyle(this.parentElement)">
                                    <div>
                                        <div style="font-weight: 600; color: #1F2937;">최종논문 심사</div>
                                        <div style="font-size: 0.75rem; color: #6B7280;">중간논문 심사 완료 후 신청 가능</div>
                                    </div>
                                </label>
                            ` : ''}
                        </div>
                    </div>

                    <!-- 논문 제목 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            논문 제목 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="text" id="thesis-title" list="recent-titles"
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;"
                               placeholder="논문 제목을 입력하세요">
                        ${recentTitles.length > 0 ? `
                            <datalist id="recent-titles">
                                ${recentTitles.map(title => `<option value="${title}">`).join('')}
                            </datalist>
                        ` : ''}
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            최근 제출물의 제목이 자동으로 표시됩니다
                        </p>
                    </div>

                    <!-- 논문 파일 업로드 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            논문 파일 <span style="color: #EF4444;">*</span>
                        </label>
                        <div id="review-drop-zone"
                             style="border: 2px dashed #D1D5DB; border-radius: 0.375rem; padding: 2rem; text-align: center; cursor: pointer; background: #F9FAFB; transition: all 0.2s;"
                             onclick="document.getElementById('review-file-input').click()"
                             ondragover="handleReviewDragOver(event)"
                             ondragleave="handleReviewDragLeave(event)"
                             ondrop="handleReviewDrop(event)">
                            <svg style="width: 3rem; height: 3rem; margin: 0 auto 1rem; color: #9CA3AF;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p style="font-size: 0.875rem; color: #4B5563; margin-bottom: 0.25rem; font-weight: 500;">클릭하여 파일 선택 또는 드래그 앤 드롭</p>
                            <p style="font-size: 0.75rem; color: #9CA3AF;">PDF 파일만 업로드 가능 (최대 10MB)</p>
                        </div>
                        <input type="file" id="review-file-input" accept=".pdf" style="display: none;" onchange="handleReviewFileSelect(event)">

                        <!-- 선택된 파일 표시 -->
                        <div id="review-file-preview" style="display: none; margin-top: 1rem; padding: 1rem; background: #F9FAFB; border-radius: 0.375rem; border: 1px solid #E5E7EB;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; flex: 1;">
                                    <svg style="width: 2.5rem; height: 2.5rem; color: #EF4444; margin-right: 0.75rem;" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                                    </svg>
                                    <div style="flex: 1; min-width: 0;">
                                        <p id="review-file-name" style="font-size: 0.875rem; font-weight: 500; color: #1F2937; margin: 0; overflow: hidden; text-overflow: ellipsis;"></p>
                                        <p id="review-file-size" style="font-size: 0.75rem; color: #6B7280; margin: 0;"></p>
                                    </div>
                                </div>
                                <button onclick="removeReviewFile()" style="padding: 0.25rem; color: #9CA3AF; background: none; border: none; cursor: pointer;">
                                    <svg style="width: 1.25rem; height: 1.25rem;" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 희망 심사일 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            희망 심사일 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="date" id="requested-date" min="${minDateStr}"
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                            최소 2주 후부터 선택 가능합니다
                        </p>
                    </div>

                    <!-- 특이사항 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            특이사항 (선택)
                        </label>
                        <textarea id="review-note" rows="3"
                                  style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: vertical;"
                                  placeholder="심사 시 참고할 사항이 있으면 입력해주세요"></textarea>
                    </div>

                    <!-- 주의사항 -->
                    <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 1rem; border-radius: 0.375rem;">
                        <p style="font-weight: 600; color: #1E40AF; margin-bottom: 0.5rem; font-size: 0.875rem;">💡 안내사항</p>
                        <ul style="font-size: 0.75rem; color: #1E3A8A; margin-left: 1.25rem; margin-bottom: 0;">
                            <li>신청 후 심사위원회가 구성되며, 구성 완료 시 알림을 보내드립니다</li>
                            <li>심사일은 심사위원 일정에 따라 조정될 수 있습니다</li>
                            <li>제출한 파일은 수정이 불가하오니 신중히 제출해주세요</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeReviewApplicationModal()" class="btn btn-secondary">취소</button>
                    <button onclick="submitReviewApplication()" class="btn btn-primary">신청하기</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-container').innerHTML = modalContent;
}

// 라디오 버튼 스타일 업데이트
function updateReviewTypeStyle(label) {
    // 모든 라벨의 스타일 초기화
    const labels = document.querySelectorAll('input[name="review-type"]').forEach(radio => {
        const parentLabel = radio.parentElement;
        if (radio.checked) {
            parentLabel.style.borderColor = '#6A0028';
            parentLabel.style.background = '#FFF1F2';
        } else {
            parentLabel.style.borderColor = '#D1D5DB';
            parentLabel.style.background = 'white';
        }
    });
}

// 파일 업로드 핸들러
let selectedReviewFile = null;

function handleReviewDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = document.getElementById('review-drop-zone');
    dropZone.style.borderColor = '#3B82F6';
    dropZone.style.background = '#EFF6FF';
}

function handleReviewDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = document.getElementById('review-drop-zone');
    dropZone.style.borderColor = '#D1D5DB';
    dropZone.style.background = '#F9FAFB';
}

function handleReviewDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const dropZone = document.getElementById('review-drop-zone');
    dropZone.style.borderColor = '#D1D5DB';
    dropZone.style.background = '#F9FAFB';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleReviewFileSelection(files[0]);
    }
}

function handleReviewFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleReviewFileSelection(file);
    }
}

function handleReviewFileSelection(file) {
    // PDF 파일만 허용
    if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        return;
    }

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
    }

    // FileReader로 파일을 base64로 변환
    const reader = new FileReader();
    reader.onload = function(e) {
        selectedReviewFile = {
            name: file.name,
            size: file.size,
            base64: e.target.result
        };

        // 파일 미리보기 표시
        document.getElementById('review-file-preview').style.display = 'block';
        document.getElementById('review-file-name').textContent = file.name;
        document.getElementById('review-file-size').textContent = formatFileSize(file.size);

        // 드롭존 숨기기
        document.getElementById('review-drop-zone').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeReviewFile() {
    selectedReviewFile = null;
    document.getElementById('review-file-preview').style.display = 'none';
    document.getElementById('review-drop-zone').style.display = 'block';
    document.getElementById('review-file-input').value = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 심사 신청 제출
function submitReviewApplication() {
    // 필수 항목 검증
    const reviewType = document.querySelector('input[name="review-type"]:checked');
    const thesisTitle = document.getElementById('thesis-title').value.trim();
    const requestedDate = document.getElementById('requested-date').value;
    const note = document.getElementById('review-note').value.trim();

    if (!reviewType) {
        alert('심사 종류를 선택해주세요.');
        return;
    }

    if (!thesisTitle) {
        alert('논문 제목을 입력해주세요.');
        return;
    }

    if (!selectedReviewFile) {
        alert('논문 파일을 업로드해주세요.');
        return;
    }

    if (!requestedDate) {
        alert('희망 심사일을 선택해주세요.');
        return;
    }

    // 신청 데이터 생성
    const student = DataService.getStudentInfo();
    const application = {
        id: 'REV_' + Date.now(),
        studentId: student.id,
        studentName: student.name,
        reviewType: reviewType.value, // 'midterm' or 'final'
        thesisTitle: thesisTitle,
        file: {
            name: selectedReviewFile.name,
            base64: selectedReviewFile.base64
        },
        requestedDate: requestedDate,
        note: note,
        status: 'waiting_assignment',
        appliedAt: new Date().toISOString(),
        committee: []
    };

    // localStorage에 저장
    saveReviewApplication(application);

    // 모달 닫기
    closeReviewApplicationModal();

    // 성공 메시지
    alert('심사 신청이 완료되었습니다.\n심사위원 배정 후 알림을 보내드리겠습니다.');

    // 화면 새로고침
    renderReview();
}

// 모달 닫기
function closeReviewApplicationModal() {
    selectedReviewFile = null;
    document.getElementById('modal-container').innerHTML = '';
}

// 심사 상세 모달 (신청 내역)
function showReviewDetailModal(applicationId) {
    const applications = getReviewApplications();
    const app = applications.find(a => a.id === applicationId);

    if (!app) return;

    const statusInfo = getStatusInfo(app.status);
    const reviewTypeText = app.reviewType === 'midterm' ? '중간논문 심사' : '최종논문 심사';

    // 심사 진행률 계산
    const totalCommittee = app.committee ? app.committee.length : 0;
    const evaluatedCount = app.committee ? app.committee.filter(c => c.evaluated).length : 0;
    const progress = totalCommittee > 0 ? Math.round((evaluatedCount / totalCommittee) * 100) : 0;

    const modalContent = `
        <div class="modal-backdrop active" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div class="modal" style="max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>📋 심사 상세 정보</h3>
                    <button onclick="closeReviewDetailModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 기본 정보 -->
                    <div style="background: #F9FAFB; padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem; font-size: 1rem;">📌 기본 정보</h4>
                        <div style="display: grid; gap: 0.75rem; font-size: 0.875rem;">
                            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem;">
                                <span style="color: #6B7280;">심사 종류</span>
                                <span style="font-weight: 600; color: #1F2937;">${reviewTypeText}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem;">
                                <span style="color: #6B7280;">논문 제목</span>
                                <span style="font-weight: 500; color: #1F2937;">${app.thesisTitle}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem;">
                                <span style="color: #6B7280;">신청일</span>
                                <span style="color: #1F2937;">${new Date(app.appliedAt).toLocaleString('ko-KR')}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem;">
                                <span style="color: #6B7280;">희망 심사일</span>
                                <span style="color: #1F2937;">${app.requestedDate}</span>
                            </div>
                            ${app.note ? `
                                <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem;">
                                    <span style="color: #6B7280;">특이사항</span>
                                    <span style="color: #1F2937;">${app.note}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- 현재 상태 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem; font-size: 1rem;">📊 현재 상태</h4>
                        <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${statusInfo.icon}</div>
                            <div style="font-size: 1.25rem; font-weight: 600; color: ${statusInfo.color}; margin-bottom: 0.5rem;">
                                ${statusInfo.text}
                            </div>
                            ${totalCommittee > 0 ? `
                                <div style="margin-top: 1rem;">
                                    <div style="font-size: 2rem; font-weight: 700; color: #6A0028; margin-bottom: 0.5rem;">
                                        ${progress}%
                                    </div>
                                    <div class="progress-bar" style="width: 100%; max-width: 300px; margin: 0 auto 0.5rem;">
                                        <div class="progress-fill" style="width: ${progress}%;"></div>
                                    </div>
                                    <p style="font-size: 0.875rem; color: #6B7280;">
                                        ${evaluatedCount}/${totalCommittee} 심사위원 평가 완료
                                    </p>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- 심사위원회 -->
                    ${totalCommittee > 0 ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem; font-size: 1rem;">👥 심사위원회</h4>
                            ${app.committee.map((member, index) => `
                                <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 0.75rem; background: white;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <span style="font-size: 1.25rem;">${member.role === 'chair' ? '⭐' : '🔹'}</span>
                                            <strong style="font-size: 0.9375rem;">${member.name}</strong>
                                            <span style="font-size: 0.75rem; color: #6B7280;">(${member.role === 'chair' ? '주심' : '부심'})</span>
                                        </div>
                                        ${member.evaluated ? `
                                            <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #ECFDF5; color: #065F46; border-radius: 0.25rem; font-weight: 500;">평가 완료</span>
                                        ` : `
                                            <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #F3F4F6; color: #6B7280; border-radius: 0.25rem;">평가 대기</span>
                                        `}
                                    </div>
                                    ${member.evaluated && member.score !== undefined ? `
                                        <div style="margin-top: 0.75rem; padding: 0.75rem; background: #F9FAFB; border-radius: 0.375rem;">
                                            <div style="font-size: 0.875rem; color: #6B7280; margin-bottom: 0.25rem;">평가 점수</div>
                                            <div style="font-size: 1.5rem; font-weight: 700; color: #6A0028;">${member.score}점</div>
                                        </div>
                                    ` : ''}
                                    ${member.evaluated && member.comment ? `
                                        <div style="margin-top: 0.75rem; padding: 0.75rem; background: #FFFBEB; border-left: 3px solid #F59E0B; border-radius: 0.375rem;">
                                            <div style="font-size: 0.75rem; color: #92400E; margin-bottom: 0.25rem; font-weight: 600;">심사 의견</div>
                                            <div style="font-size: 0.875rem; color: #78350F; white-space: pre-wrap;">${member.comment}</div>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem; font-size: 1rem;">👥 심사위원회</h4>
                            <div style="padding: 2rem; text-align: center; background: #F9FAFB; border-radius: 0.5rem; color: #6B7280;">
                                심사위원 배정 대기 중입니다
                            </div>
                        </div>
                    `}

                    <!-- 종합 평가 -->
                    ${app.status === 'approved' || app.status === 'on_hold' || app.status === 'failed' ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem; font-size: 1rem;">🎯 종합 평가</h4>
                            <div style="padding: 1.5rem; background: ${
                                app.status === 'approved' ? '#ECFDF5' :
                                app.status === 'on_hold' ? '#FEF3C7' : '#FEE2E2'
                            }; border-radius: 0.5rem; text-align: center;">
                                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">
                                    ${app.status === 'approved' ? '🎉' : app.status === 'on_hold' ? '🔄' : '❌'}
                                </div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: ${
                                    app.status === 'approved' ? '#065F46' :
                                    app.status === 'on_hold' ? '#92400E' : '#991B1B'
                                }; margin-bottom: 1rem;">
                                    ${statusInfo.text}
                                </div>
                                ${app.avgScore !== undefined ? `
                                    <div style="font-size: 1.25rem; font-weight: 600; color: #6A0028; margin-bottom: 0.5rem;">
                                        평균 점수: ${app.avgScore}점
                                    </div>
                                    <div style="font-size: 0.875rem; color: #6B7280;">
                                        (합격 기준: 70점 이상)
                                    </div>
                                ` : ''}
                                ${app.finalComment ? `
                                    <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 0.375rem; text-align: left;">
                                        <div style="font-size: 0.75rem; color: #6B7280; margin-bottom: 0.5rem; font-weight: 600;">종합 의견</div>
                                        <div style="font-size: 0.875rem; color: #1F2937; white-space: pre-wrap;">${app.finalComment}</div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}

                    <!-- 제출 파일 -->
                    <div>
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem; font-size: 1rem;">📎 제출 파일</h4>
                        <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: white;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; flex: 1;">
                                    <svg style="width: 2rem; height: 2rem; color: #EF4444; margin-right: 0.75rem;" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                                    </svg>
                                    <div>
                                        <p style="font-size: 0.875rem; font-weight: 500; color: #1F2937; margin: 0;">${app.file.name}</p>
                                        <p style="font-size: 0.75rem; color: #6B7280; margin: 0;">PDF 파일</p>
                                    </div>
                                </div>
                                <button onclick="downloadReviewFile('${app.id}')" class="btn btn-sm btn-secondary">
                                    <svg style="width: 1rem; height: 1rem; display: inline-block; margin-right: 0.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    다운로드
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeReviewDetailModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-container').innerHTML = modalContent;
}

function closeReviewDetailModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// 파일 다운로드
function downloadReviewFile(applicationId) {
    const applications = getReviewApplications();
    const app = applications.find(a => a.id === applicationId);

    if (!app || !app.file) {
        alert('파일을 찾을 수 없습니다.');
        return;
    }

    // base64 데이터를 Blob으로 변환하여 다운로드
    const link = document.createElement('a');
    link.href = app.file.base64;
    link.download = app.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 기존 심사 상세 (DataService의 reviews)
function showExistingReviewDetail(reviewId) {
    const review = DataService.getReviews().find(r => r.id === reviewId);
    if (!review) return;

    const modalContent = `
        <div class="modal-backdrop active" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div class="modal" style="max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>📋 심사 상세: ${review.type}</h3>
                    <button onclick="closeReviewDetailModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 기본 정보 -->
                    <div style="background: #F9FAFB; padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">📌 기본 정보</h4>
                        <div style="display: grid; gap: 0.75rem; font-size: 0.875rem;">
                            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem;">
                                <span style="color: #6B7280;">심사 종류</span>
                                <span style="font-weight: 600; color: #1F2937;">${review.type}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem;">
                                <span style="color: #6B7280;">신청일</span>
                                <span style="color: #1F2937;">${review.applicationDate}</span>
                            </div>
                            ${review.expectedDate ? `
                                <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem;">
                                    <span style="color: #6B7280;">심사 예정일</span>
                                    <span style="color: #1F2937;">${review.expectedDate}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- 진행 상황 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">📊 심사 진행 상황</h4>
                        <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: #6A0028; margin-bottom: 0.5rem;">
                                ${review.progress}%
                            </div>
                            <div class="progress-bar" style="width: 100%; max-width: 400px; margin: 0 auto 1rem;">
                                <div class="progress-fill" style="width: ${review.progress}%;"></div>
                            </div>
                            <span class="badge ${review.status === '심사 진행중' ? 'badge-info' : 'badge-success'}">
                                ${review.status}
                            </span>
                            ${review.statusDetail ? `
                                <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.5rem;">${review.statusDetail}</p>
                            ` : ''}
                        </div>
                    </div>

                    <!-- 심사위원 현황 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">👥 심사위원 현황</h4>
                        ${review.reviewers.map((reviewer, index) => `
                            <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 0.75rem; background: white;">
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
                                    <div style="margin-top: 0.75rem; padding: 0.75rem; background: #F9FAFB; border-radius: 0.375rem;">
                                        <p style="font-size: 0.875rem; color: #4B5563; white-space: pre-wrap;">"${reviewer.comment}"</p>
                                    </div>
                                ` : ''}
                                ${reviewer.revisionRequests && reviewer.revisionRequests.length > 0 ? `
                                    <div style="margin-top: 0.75rem; padding: 0.75rem; background: #FEF3C7; border-left: 3px solid #F59E0B; border-radius: 0.375rem;">
                                        <div style="font-size: 0.75rem; color: #92400E; margin-bottom: 0.5rem; font-weight: 600;">수정 요청 사항</div>
                                        <ul style="margin-left: 1.25rem; font-size: 0.875rem; color: #78350F;">
                                            ${reviewer.revisionRequests.map(req => `<li style="margin-bottom: 0.25rem;">${req}</li>`).join('')}
                                        </ul>
                                    </div>
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
                    ${review.plagiarismRate !== undefined ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">🔍 표절검사 결과</h4>
                            <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: white;">
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
                    ` : ''}

                    <!-- 제출 서류 -->
                    ${review.file ? `
                        <div>
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">📎 제출 서류</h4>
                            <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: white;">
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <div style="display: flex; align-items: center;">
                                        <svg style="width: 2rem; height: 2rem; color: #EF4444; margin-right: 0.75rem;" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                                        </svg>
                                        <span style="font-size: 0.875rem; font-weight: 500;">${review.file}</span>
                                    </div>
                                    <button onclick="alert('데모 버전에서는 파일 다운로드가 지원되지 않습니다.')" class="btn btn-sm btn-secondary">
                                        <svg style="width: 1rem; height: 1rem; display: inline-block; margin-right: 0.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        다운로드
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button onclick="closeReviewDetailModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-container').innerHTML = modalContent;
}

// Export functions to window
window.renderReview = renderReview;
window.showReviewApplicationModal = showReviewApplicationModal;
window.closeReviewApplicationModal = closeReviewApplicationModal;
window.updateReviewTypeStyle = updateReviewTypeStyle;
window.handleReviewDragOver = handleReviewDragOver;
window.handleReviewDragLeave = handleReviewDragLeave;
window.handleReviewDrop = handleReviewDrop;
window.handleReviewFileSelect = handleReviewFileSelect;
window.removeReviewFile = removeReviewFile;
window.submitReviewApplication = submitReviewApplication;
window.showReviewDetailModal = showReviewDetailModal;
window.closeReviewDetailModal = closeReviewDetailModal;
window.downloadReviewFile = downloadReviewFile;
window.showExistingReviewDetail = showExistingReviewDetail;

console.log('✅ 학생 심사 신청 기능 (P0-2) 로드 완료');
