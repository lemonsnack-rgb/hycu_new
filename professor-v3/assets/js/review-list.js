// Phase 5: 심사 관리 - 심사 목록

// ==================== 심사 목록 렌더링 ====================
function renderReviewList() {
    const assignments = ReviewService.getMyReviewAssignments();
    
    const listContainer = document.getElementById('review-list');
    const countEl = document.getElementById('review-count');
    
    if (!listContainer) return;
    
    // 카운트 업데이트
    if (countEl) {
        countEl.textContent = `총 ${assignments.length}건`;
    }
    
    if (assignments.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">배정된 심사가 없습니다</h3>
                <p class="text-gray-500">심사가 배정되면 이곳에 표시됩니다.</p>
            </div>
        `;
        return;
    }
    
    // 필터링
    const filters = getCurrentFilters();
    const filteredAssignments = filterAssignments(assignments, filters);
    
    // 필터링된 카운트 업데이트
    if (countEl && filteredAssignments.length !== assignments.length) {
        countEl.textContent = `${filteredAssignments.length}건 (전체 ${assignments.length}건)`;
    }
    
    if (filteredAssignments.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
                <p class="text-gray-500">다른 조건으로 검색해보세요.</p>
            </div>
        `;
        return;
    }
    
    // ID 49-50: 테이블 컬럼 변경 + 체크박스 추가
    const html = `
        <!-- 테이블 컨테이너 -->
        <div class="table-container">
            <!-- 테이블 헤더: 타이틀(건수) + 액션버튼 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">심사 대상 논문 목록</h3>
                    <span class="table-count">(총 ${assignments.length}건)</span>
                </div>
                <div class="table-header-right">
                    <button onclick="sendNotificationToSelectedReviews()"
                            class="btn btn-primary btn-sm">
                        <span class="icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </span>
                        선택한 학생에게 알림 발송
                    </button>
                </div>
            </div>
            <div class="table-scroll">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th style="width: 50px;">
                                <input type="checkbox" id="select-all-reviews"
                                       onchange="toggleSelectAllReviews(this.checked)"
                                       class="rounded border-gray-300">
                            </th>
                            <th style="width: 60px;">순번</th>
                            <th style="width: 80px;">학년도</th>
                            <th style="width: 60px;">학기</th>
                            <th style="width: 100px;">대학구분</th>
                            <th style="width: 100px;">계열/대학원</th>
                            <th style="width: 120px;">학부(과)전공</th>
                            <th style="width: 150px;">학과/전공</th>
                            <th style="width: 80px;">학위과정</th>
                            <th style="width: 80px;">학적상태</th>
                            <th style="width: 90px;">학번</th>
                            <th style="width: 80px;">성명</th>
                            <th style="width: 100px;">지도교수명</th>
                            <th style="width: 100px;">심사단계</th>
                            <th style="width: 100px;">심사결과</th>
                            <th style="width: 100px;">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredAssignments.map((assignment, index) => `
                            <tr>
                                <td onclick="event.stopPropagation()">
                                    <input type="checkbox" class="review-checkbox rounded border-gray-300"
                                           value="${assignment.id}"
                                           data-name="${assignment.studentName}"
                                           data-student-id="${assignment.studentNumber}">
                                </td>
                                <td>${index + 1}</td>
                                <td>${assignment.year || '2025'}</td>
                                <td>${assignment.semester || '1'}</td>
                                <td>${assignment.graduate || '일반대학원'}</td>
                                <td>${assignment.college || '일반대학원'}</td>
                                <td>${assignment.undergraduate || '-'}</td>
                                <td>${assignment.major || '-'}</td>
                                <td>${assignment.degree || '석사'}</td>
                                <td>${assignment.academicStatus || '재학'}</td>
                                <td>${assignment.studentNumber}</td>
                                <td>${assignment.studentName}</td>
                                <td>${assignment.advisorName || '-'}</td>
                                <td>${assignment.reviewType || '예비심사'}</td>
                                <td>
                                    ${getProgressStatusText(assignment.evaluationProgress)}
                                </td>
                                <td onclick="event.stopPropagation()">
                                    <div class="flex gap-2 justify-center">
                                        <button onclick="openReviewDetail('${assignment.id}', 'member')"
                                                class="text-[#6A0028] hover:text-[#6A0028] text-xs font-medium px-2 py-1 border border-[#F8BBD9] rounded hover:bg-[#FCE4EC]">
                                            심사
                                        </button>
                                        ${assignment.myRole === 'chair' ? `
                                            <button onclick="openReviewDetail('${assignment.id}', 'chair')"
                                                    class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded hover:bg-green-50">
                                                승인
                                            </button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    listContainer.innerHTML = html;
}

// ==================== 심사유형 필터 전역 변수 ====================
let currentReviewTypeFilter = 'all';

// 심사유형 필터 토글
function toggleReviewType(type) {
    currentReviewTypeFilter = type;

    // 버튼 활성화 상태 변경
    document.querySelectorAll('[id^="review-type-"]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`review-type-${type}`).classList.add('active');

    // 목록 재렌더링
    renderReviewList();
}

window.toggleReviewType = toggleReviewType;

// ==================== 필터링 (논문지도현황과 동일한 8개 필드 + 심사유형) ====================
function getCurrentFilters() {
    return {
        reviewType: currentReviewTypeFilter,
        graduate: document.getElementById('filter-graduate')?.value || '',
        major: document.getElementById('filter-major')?.value || '',
        degree: document.getElementById('filter-degree')?.value || '',
        year: document.getElementById('filter-year')?.value || '',
        semesterCount: document.getElementById('filter-semester-count')?.value || '',
        studentId: document.getElementById('filter-student-id')?.value || '',
        name: document.getElementById('filter-name')?.value || '',
        thesis: document.getElementById('filter-thesis')?.value || ''
    };
}

function filterAssignments(assignments, filters) {
    return assignments.filter(assignment => {
        // 심사유형 필터
        if (filters.reviewType && filters.reviewType !== 'all') {
            const reviewType = assignment.reviewType || '예비심사';
            if (filters.reviewType === 'preliminary' && reviewType !== '예비심사') {
                return false;
            }
            if (filters.reviewType === 'main' && reviewType !== '본심사') {
                return false;
            }
        }

        // 대학원 필터
        if (filters.graduate && assignment.graduate !== filters.graduate) {
            return false;
        }

        // 학과 필터
        if (filters.major && assignment.major !== filters.major) {
            return false;
        }

        // 학위과정 필터
        if (filters.degree && assignment.degree !== filters.degree) {
            return false;
        }

        // 학년도 필터
        if (filters.year && (assignment.year || '2025') !== filters.year) {
            return false;
        }

        // 학기차 필터
        if (filters.semesterCount && String(assignment.semesterCount) !== filters.semesterCount) {
            return false;
        }

        // 학번 검색
        if (filters.studentId) {
            if (!assignment.studentNumber.includes(filters.studentId)) {
                return false;
            }
        }

        // 성명 검색
        if (filters.name) {
            if (!assignment.studentName.toLowerCase().includes(filters.name.toLowerCase())) {
                return false;
            }
        }

        // 논문명 검색
        if (filters.thesis) {
            if (!assignment.thesisTitle.toLowerCase().includes(filters.thesis.toLowerCase())) {
                return false;
            }
        }

        return true;
    });
}

function searchReviews() {
    renderReviewList();
}

function resetReviewSearch() {
    document.getElementById('filter-graduate').value = '';
    document.getElementById('filter-major').value = '';
    document.getElementById('filter-degree').value = '';
    document.getElementById('filter-year').value = '';
    document.getElementById('filter-semester-count').value = '';
    document.getElementById('filter-student-id').value = '';
    document.getElementById('filter-name').value = '';
    document.getElementById('filter-thesis').value = '';
    renderReviewList();
}

// ==================== 유틸리티 함수 ====================
function getTypeBadgeClass(type) {
    const typeMap = {
        '연구계획서': 'bg-[#FCE4EC] text-[#6A0028]',
        '중간논문': 'bg-yellow-100 text-yellow-800',
        '최종논문': 'bg-purple-100 text-purple-800'
    };
    return typeMap[type] || 'bg-gray-100 text-gray-800';
}

function getRoleBadgeClass(role) {
    return role === 'chair' 
        ? 'bg-amber-100 text-amber-800' 
        : 'bg-cyan-100 text-cyan-800';
}

function getStatusBadgeClass(status) {
    const statusMap = {
        '진행중': 'bg-yellow-100 text-yellow-800',
        '심사완료': 'bg-[#FCE4EC] text-[#6A0028]',
        '승인': 'bg-green-100 text-green-800',
        '보류': 'bg-orange-100 text-orange-800',
        '반려': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
}

function getStatusIcon(status) {
    const iconMap = {
        '진행중': '🟡',
        '심사완료': '🔵',
        '승인': '🟢',
        '보류': '🟠',
        '반려': '🔴'
    };
    return iconMap[status] || '⚪';
}

function getDueDateColorClass(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-semibold';
    if (diffDays <= 3) return 'text-red-600 font-semibold';
    if (diffDays <= 7) return 'text-orange-600';
    return 'text-gray-600';
}

function getDueDateBadge(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '<span class="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">마감</span>';
    if (diffDays === 0) return '<span class="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">오늘</span>';
    if (diffDays <= 3) return `<span class="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">D-${diffDays}</span>`;
    return '';
}

function getProgressPercentage(progressText) {
    const [completed, total] = progressText.split('/').map(Number);
    return (completed / total) * 100;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ==================== 심사 상세 열기 ====================
function openReviewDetail(assignmentId, viewType) {
    // 목록 화면 숨기기
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }

    // 상세 화면 생성
    const detailScreen = document.createElement('div');
    detailScreen.id = 'review-detail-screen';
    detailScreen.className = 'review-detail-screen';
    detailScreen.dataset.assignmentId = assignmentId;
    detailScreen.dataset.viewType = viewType || 'member';

    // 동적 타이틀 생성
    const modalTitle = viewType === 'chair' ? '[학위 논문 심사 승인]' : '[학위 논문 심사]';

    detailScreen.innerHTML = `
        <div class="review-detail-content-wrapper">
            <!-- 헤더 -->
            <div class="review-detail-header">
                <h3 class="modal-title">${modalTitle}</h3>
                <button onclick="closeReviewDetailScreen()" class="modal-close-btn" aria-label="닫기">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- 상세 내용 -->
            <div id="review-detail-content" class="review-detail-body"></div>
        </div>
    `;

    document.body.appendChild(detailScreen);

    // 상세 정보 렌더링
    setTimeout(() => {
        console.log('🔍 openReviewDetail - assignmentId:', assignmentId, 'viewType:', viewType);
        console.log('🔍 renderReviewDetail function:', typeof window.renderReviewDetail);
        console.log('🔍 review-detail-screen exists:', !!document.getElementById('review-detail-screen'));
        console.log('🔍 review-detail-content exists:', !!document.getElementById('review-detail-content'));

        const contentContainer = document.getElementById('review-detail-content');
        console.log('🔍 Content container:', contentContainer);

        if (typeof window.renderReviewDetail === 'function') {
            console.log('✅ Calling renderReviewDetail...');
            window.renderReviewDetail(assignmentId, viewType);
            console.log('✅ renderReviewDetail called');
        } else {
            console.error('❌ renderReviewDetail is not a function!');
            // Fallback: 직접 호출 시도
            if (typeof renderReviewDetail === 'function') {
                console.log('⚠️ Using direct renderReviewDetail call');
                renderReviewDetail(assignmentId, viewType);
            } else {
                alert('심사 상세 렌더링 함수를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            }
        }
    }, 50);
}

function closeReviewDetailScreen() {
    const detailScreen = document.getElementById('review-detail-screen');
    if (detailScreen) {
        detailScreen.remove();
    }

    // 목록 화면 다시 표시
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }

    // 목록 재렌더링 (변경사항 반영)
    if (typeof renderReviewList === 'function') {
        renderReviewList();
    }
}

// Legacy 모달 함수 (호환성 유지)
function closeReviewDetail() {
    closeReviewDetailScreen();
}

// ==================== 초기화 ====================
function initReviewList() {
    // 초기 렌더링
    renderReviewList();
}

// Export
window.initReviewList = initReviewList;
window.searchReviews = searchReviews;
window.resetReviewSearch = resetReviewSearch;
window.openReviewDetail = openReviewDetail;
window.closeReviewDetail = closeReviewDetail;
window.closeReviewDetailScreen = closeReviewDetailScreen;

// ID 50: 평가 진행도 색상 클래스
function getProgressColorClass(progress) {
    if (progress === '3/3' || progress === '완료') return 'text-green-600';
    if (progress.startsWith('0/')) return 'text-gray-500';
    return 'text-[#6A0028]';
}

// ID 49-50: 심사진행상태 배지 클래스
function getProgressBadgeClass(progress) {
    if (progress === '완료' || progress === '3/3' || progress === '심사완료' || progress === '승인완료') {
        return 'bg-green-100 text-green-700';
    }
    if (progress === '진행중' || progress === '진행 중' || (progress && progress.includes('/'))) {
        return 'bg-[#FCE4EC] text-[#6A0028]';
    }
    if (progress === '대기' || progress === '0/3') {
        return 'bg-gray-100 text-gray-700';
    }
    return 'bg-gray-100 text-gray-700';
}

// 심사진행상태 텍스트 변환 (숫자 제거)
function getProgressStatusText(progress) {
    // "1/3", "2/3", "3/3" 등의 형태를 "진행 중", "심사완료", "승인완료"로 변환
    if (!progress) return '대기';

    if (progress === '3/3' || progress === '완료') {
        return '심사완료';
    }

    if (progress.includes('/')) {
        const [completed, total] = progress.split('/').map(Number);
        if (completed === 0) return '대기';
        if (completed === total) return '심사완료';
        return '진행 중';
    }

    // 이미 텍스트인 경우 그대로 반환
    if (progress === '진행중' || progress === '진행 중') return '진행 중';
    if (progress === '심사완료') return '심사완료';
    if (progress === '승인완료') return '승인완료';
    if (progress === '대기') return '대기';

    return progress;
}

// 심사유형 배지 클래스
function getReviewTypeBadgeClass(reviewType) {
    if (reviewType === '예비심사') {
        return 'bg-blue-100 text-blue-700';
    }
    if (reviewType === '본심사') {
        return 'bg-purple-100 text-purple-700';
    }
    return 'bg-gray-100 text-gray-700';
}

window.getProgressColorClass = getProgressColorClass;
window.getProgressBadgeClass = getProgressBadgeClass;
window.getProgressStatusText = getProgressStatusText;
window.getReviewTypeBadgeClass = getReviewTypeBadgeClass;

// ==================== 체크박스 관련 기능 ====================
function toggleSelectAllReviews(checked) {
    const checkboxes = document.querySelectorAll('.review-checkbox');
    checkboxes.forEach(cb => cb.checked = checked);
}

function sendNotificationToSelectedReviews() {
    const checkboxes = document.querySelectorAll('.review-checkbox:checked');

    if (checkboxes.length === 0) {
        showToast('학생을 선택해주세요', 'warning');
        return;
    }

    const selectedStudents = Array.from(checkboxes).map(cb => ({
        id: cb.dataset.studentId,
        name: cb.dataset.name
    }));

    const modalContent = `
        <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-gray-700 mb-2">선택된 학생 (${selectedStudents.length}명)</p>
                <div class="flex flex-wrap gap-2">
                    ${selectedStudents.map(s => `
                        <span class="inline-block bg-[#FCE4EC] text-[#6A0028] px-2 py-1 rounded text-xs">
                            ${s.name}
                        </span>
                    `).join('')}
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">발송 방법 *</label>
                <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="review-notif-type" value="kakao" checked class="rounded-full">
                        <span class="text-sm text-gray-700">카카오톡</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="review-notif-type" value="sms" class="rounded-full">
                        <span class="text-sm text-gray-700">SMS</span>
                    </label>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">알림 제목 *</label>
                <input type="text" id="review-notif-title" placeholder="예: 논문 심사 결과 확인 요청"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">알림 내용 *</label>
                <textarea id="review-notif-message" rows="4" placeholder="학생들에게 전달할 메시지를 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
        </div>
    `;

    createModal('알림 발송', modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '발송',
            className: 'btn-primary',
            onclick: 'confirmSendReviewNotification(' + JSON.stringify(selectedStudents) + ')'
        }
    ]);
}

function confirmSendReviewNotification(students) {
    const title = document.getElementById('review-notif-title')?.value.trim();
    const message = document.getElementById('review-notif-message')?.value.trim();
    const notifType = document.querySelector('input[name="review-notif-type"]:checked')?.value;

    if (!title) {
        showToast('알림 제목을 입력해주세요', 'warning');
        return;
    }

    if (!message) {
        showToast('알림 내용을 입력해주세요', 'warning');
        return;
    }

    const notifTypeText = notifType === 'kakao' ? '카카오톡' : 'SMS';
    console.log('심사 알림 발송:', { students, title, message, type: notifType });
    showToast(`${students.length}명의 학생에게 ${notifTypeText} 알림이 발송되었습니다`, 'success');

    // 체크박스 초기화
    const checkboxes = document.querySelectorAll('.review-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    const selectAll = document.getElementById('select-all-reviews');
    if (selectAll) selectAll.checked = false;
}

window.toggleSelectAllReviews = toggleSelectAllReviews;
window.sendNotificationToSelectedReviews = sendNotificationToSelectedReviews;
window.confirmSendReviewNotification = confirmSendReviewNotification;
