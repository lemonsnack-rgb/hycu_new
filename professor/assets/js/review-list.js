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
    
    // ID 49-50: 테이블 컬럼 변경
    const html = `
        <!-- 학생 선택 영역 (알림 발송) -->
        ${StudentSelection.createSelectionUI()}

        <div class="overflow-x-auto">
            <table id="review-table" class="min-w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 50px;">
                            <input
                                type="checkbox"
                                id="select-all-students"
                                class="checkbox-input"
                                onchange="StudentSelection.toggleSelectAll()"
                                title="전체 선택"
                            >
                        </th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학부/대학원</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과/전공</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정구분</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학적상태</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문명</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">심사일</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">심사진행상태</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${filteredAssignments.map((assignment, index) => {
                        // 알림 발송용 학생 데이터
                        const studentData = {
                            studentId: assignment.studentNumber,
                            studentName: assignment.studentName,
                            phone: assignment.phone || '-',
                            email: assignment.email || '-',
                            major: assignment.major || '-',
                            degree: assignment.degree || '석사'
                        };

                        return `
                            <tr class="hover:bg-gray-50">
                                <td class="py-3 px-4 text-center">
                                    <input
                                        type="checkbox"
                                        class="student-checkbox checkbox-input"
                                        data-student-id="${assignment.studentNumber}"
                                        data-student-data='${JSON.stringify(studentData)}'
                                        onchange="StudentSelection.toggleStudent(this)"
                                    >
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-600">${index + 1}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${assignment.graduate || '일반대학원'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${assignment.major || '-'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${assignment.degree || '석사'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${assignment.studentNumber}</td>
                                <td class="py-3 px-4 text-sm font-medium text-gray-800">${assignment.studentName}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${assignment.academicStatus || '재학'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600" style="max-width: 350px;">
                                    <div class="truncate" title="${assignment.thesisTitle}">
                                        ${assignment.thesisTitle}
                                    </div>
                                </td>
                                <td class="py-3 px-4 text-center text-sm text-gray-600">${assignment.reviewDate || '-'}</td>
                                <td class="py-3 px-4 text-center">
                                    <span class="text-xs font-semibold px-2 py-1 rounded-full ${getProgressBadgeClass(assignment.evaluationProgress)}">
                                        ${assignment.evaluationProgress}
                                    </span>
                                </td>
                                <td class="py-3 px-4 text-center">
                                    <div class="flex gap-2 justify-center">
                                        <button onclick="openReviewDetail('${assignment.id}', 'member')"
                                                class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded ${assignment.myRole === 'member' ? 'font-bold bg-blue-50' : ''}">
                                            위원
                                        </button>
                                        <button onclick="openReviewDetail('${assignment.id}', 'chair')"
                                                class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded ${assignment.myRole === 'chair' ? 'font-bold bg-green-50' : ''}">
                                            위원장
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;

    listContainer.innerHTML = html;

    // StudentSelection 초기화
    const studentsForSelection = filteredAssignments.map(assignment => ({
        studentId: assignment.studentNumber,
        studentName: assignment.studentName,
        phone: assignment.phone || '-',
        email: assignment.email || '-',
        major: assignment.major || '-',
        degree: assignment.degree || '석사'
    }));
    StudentSelection.init(studentsForSelection);
}

// ==================== 필터링 (ID 49-50) ====================
function getCurrentFilters() {
    return {
        year: document.getElementById('filter-year')?.value || '',
        semester: document.getElementById('filter-semester')?.value || '',
        semesterCount: document.getElementById('filter-semester-count')?.value || '',
        reviewType: document.getElementById('filter-review-type')?.value || '',
        search: document.getElementById('filter-keyword')?.value || ''
    };
}

function filterAssignments(assignments, filters) {
    return assignments.filter(assignment => {
        // 학년도 필터
        if (filters.year && (assignment.year || '2025') !== filters.year) {
            return false;
        }

        // 학기 필터
        if (filters.semester && (assignment.semester || '1') !== filters.semester) {
            return false;
        }

        // 학기차 필터
        if (filters.semesterCount && String(assignment.semesterCount) !== filters.semesterCount) {
            return false;
        }

        // 심사구분 필터
        if (filters.reviewType && assignment.submissionType !== filters.reviewType) {
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
    document.getElementById('filter-year').value = '';
    document.getElementById('filter-semester').value = '';
    document.getElementById('filter-semester-count').value = '';
    document.getElementById('filter-review-type').value = '';
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
function openReviewDetail(assignmentId, viewType) {
    const modal = document.getElementById('review-detail-modal');
    if (!modal) {
        console.error('심사 상세 모달을 찾을 수 없습니다');
        return;
    }

    // 모달 데이터 설정
    modal.dataset.assignmentId = assignmentId;
    modal.dataset.viewType = viewType || 'member';

    // 상세 정보 렌더링
    renderReviewDetail(assignmentId, viewType);

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

// ID 49-50: 심사진행상태 배지 클래스
function getProgressBadgeClass(progress) {
    if (progress === '완료' || progress === '3/3' || progress === '심사완료') {
        return 'bg-green-100 text-green-700';
    }
    if (progress === '진행중' || (progress && progress.includes('/'))) {
        return 'bg-blue-100 text-blue-700';
    }
    if (progress === '대기' || progress === '0/3') {
        return 'bg-gray-100 text-gray-700';
    }
    return 'bg-gray-100 text-gray-700';
}

window.getProgressColorClass = getProgressColorClass;
window.getProgressBadgeClass = getProgressBadgeClass;
