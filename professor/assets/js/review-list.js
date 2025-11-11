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
    
    const html = `
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문제목</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">내 역할</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">평가진행</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${filteredAssignments.map((assignment, index) => `
                        <tr class="hover:bg-gray-50">
                            <td class="py-3 px-4 text-sm text-gray-600">${index + 1}</td>
                            <td class="py-3 px-4">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(assignment.submissionType)}">
                                    ${assignment.submissionType}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-sm text-gray-600">${assignment.studentNumber}</td>
                            <td class="py-3 px-4 text-sm font-medium text-gray-800">${assignment.studentName}</td>
                            <td class="py-3 px-4 text-sm text-gray-600" style="max-width: 350px;">
                                <div class="truncate" title="${assignment.thesisTitle}">
                                    ${assignment.thesisTitle}
                                </div>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(assignment.myRole)}">
                                    ${assignment.myRole === 'chair' ? '위원장' : '위원'}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span class="text-sm font-semibold ${getProgressColorClass(assignment.evaluationProgress)}">${assignment.evaluationProgress}</span>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <button onclick="openReviewDetail('${assignment.id}')" 
                                        class="text-blue-600 hover:underline text-sm font-medium">
                                    상세보기
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    listContainer.innerHTML = html;
}

// ==================== 필터링 ====================
function getCurrentFilters() {
    return {
        submissionType: document.getElementById('filter-type')?.value || '',
        role: document.getElementById('filter-role')?.value || '',
        status: document.getElementById('filter-status')?.value || '',
        search: document.getElementById('filter-keyword')?.value || ''
    };
}

function filterAssignments(assignments, filters) {
    return assignments.filter(assignment => {
        // 단계 필터
        if (filters.submissionType && assignment.submissionType !== filters.submissionType) {
            return false;
        }
        
        // 역할 필터
        if (filters.role) {
            if (filters.role === 'chair' && assignment.myRole !== 'chair') return false;
            if (filters.role === 'member' && assignment.myRole !== 'member') return false;
        }
        
        // 상태 필터
        if (filters.status && assignment.status !== filters.status) {
            return false;
        }
        
        // 검색
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchStudent = assignment.studentName.toLowerCase().includes(searchLower);
            const matchNumber = assignment.studentNumber.includes(searchLower);
            const matchTitle = assignment.thesisTitle.toLowerCase().includes(searchLower);
            
            if (!matchStudent && !matchNumber && !matchTitle) {
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
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-role').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-keyword').value = '';
    renderReviewList();
}

// ==================== 유틸리티 함수 ====================
function getTypeBadgeClass(type) {
    const typeMap = {
        '연구계획서': 'bg-blue-100 text-blue-800',
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
        '심사완료': 'bg-blue-100 text-blue-800',
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
function openReviewDetail(assignmentId) {
    const modal = document.getElementById('review-detail-modal');
    if (!modal) {
        console.error('심사 상세 모달을 찾을 수 없습니다');
        return;
    }
    
    // 모달 데이터 설정
    modal.dataset.assignmentId = assignmentId;
    
    // 상세 정보 렌더링
    renderReviewDetail(assignmentId);
    
    // 모달 열기
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeReviewDetail() {
    const modal = document.getElementById('review-detail-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
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

// ID 50: 평가 진행도 색상 클래스
function getProgressColorClass(progress) {
    if (progress === '3/3' || progress === '완료') return 'text-green-600';
    if (progress.startsWith('0/')) return 'text-gray-500';
    return 'text-blue-600';
}

window.getProgressColorClass = getProgressColorClass;
