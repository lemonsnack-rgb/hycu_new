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
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학부/대학원</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과/전공</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학위과정</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학적상태</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문제목</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">심사단계</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">심사대상</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">심사위원장</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">진행상태</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${filteredAssignments.map((assignment, index) => {
                        const isMember = assignment.myRole === 'member';
                        const isChair = assignment.myRole === 'chair';
                        return `
                        <tr class="hover:bg-gray-50">
                            <td class="py-3 px-4 text-sm text-gray-600">${index + 1}</td>
                            <td class="py-3 px-4 text-sm text-gray-600">${assignment.graduateSchool || '-'}</td>
                            <td class="py-3 px-4 text-sm text-gray-600">${assignment.major}</td>
                            <td class="py-3 px-4 text-sm text-gray-600 text-center">${assignment.degree}</td>
                            <td class="py-3 px-4 text-sm text-gray-600">${assignment.studentNumber}</td>
                            <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                ${createStudentNameWithInfo(assignment.studentName, assignment.studentNumber, {
                                    phone: assignment.phone || '',
                                    email: assignment.email || ''
                                })}
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStudentStatusClass(assignment.studentStatus)}">
                                    ${assignment.studentStatus || '-'}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-sm text-gray-600" style="max-width: 300px;">
                                <div class="truncate" title="${assignment.thesisTitle}">
                                    ${assignment.thesisTitle}
                                </div>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(assignment.submissionType)}">
                                    ${assignment.submissionType}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-center">
                                ${isMember ? `
                                    <button onclick="openReviewModal('${assignment.id}')"
                                            class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                                        <i class="fas fa-clipboard-check mr-1"></i> 심사하기
                                    </button>
                                ` : '-'}
                            </td>
                            <td class="py-3 px-4 text-center">
                                ${isChair ? `
                                    <button onclick="openChairEvaluation('${assignment.id}')"
                                            class="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                                        <i class="fas fa-star mr-1"></i> 종합평가
                                    </button>
                                ` : '-'}
                            </td>
                            <td class="py-3 px-4 text-center">
                                ${getProgressBadge(assignment.evaluationProgress)}
                            </td>
                        </tr>
                    `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    listContainer.innerHTML = html;
}

// ==================== 필터링 ====================
function getCurrentFilters() {
    return {
        year: document.getElementById('filter-year')?.value || '',
        semester: document.getElementById('filter-semester')?.value || '',
        semesterOrder: document.getElementById('filter-semester-order')?.value || '',
        studentStatus: document.getElementById('filter-student-status')?.value || '',
        major: document.getElementById('filter-major')?.value || '',
        degree: document.getElementById('filter-degree')?.value || '',
        studentKeyword: document.getElementById('filter-student-keyword')?.value || '',
        thesisTitle: document.getElementById('filter-thesis-title')?.value || ''
    };
}

function filterAssignments(assignments, filters) {
    return assignments.filter(assignment => {
        // 학년도 필터 (submissionDate에서 추출)
        if (filters.year && assignment.submissionDate) {
            const assignmentYear = new Date(assignment.submissionDate).getFullYear().toString();
            if (assignmentYear !== filters.year) {
                return false;
            }
        }

        // 학기 필터 (데이터에 semester 필드가 있다면 사용)
        if (filters.semester && assignment.semester) {
            if (assignment.semester !== filters.semester) {
                return false;
            }
        }

        // 학기차 필터 (데이터에 semesterOrder 필드가 있다면 사용)
        if (filters.semesterOrder && assignment.semesterOrder) {
            if (assignment.semesterOrder !== filters.semesterOrder) {
                return false;
            }
        }

        // 학적상태 필터 (데이터에 studentStatus 필드가 있다면 사용)
        if (filters.studentStatus && assignment.studentStatus) {
            if (assignment.studentStatus !== filters.studentStatus) {
                return false;
            }
        }

        // 학과/전공 필터
        if (filters.major && assignment.major !== filters.major) {
            return false;
        }

        // 학위과정 필터
        if (filters.degree && assignment.degree !== filters.degree) {
            return false;
        }

        // 학번/성명 검색
        if (filters.studentKeyword) {
            const keyword = filters.studentKeyword.toLowerCase();
            const matchStudent = assignment.studentName.toLowerCase().includes(keyword);
            const matchNumber = assignment.studentNumber.includes(keyword);

            if (!matchStudent && !matchNumber) {
                return false;
            }
        }

        // 논문명 검색
        if (filters.thesisTitle) {
            const titleKeyword = filters.thesisTitle.toLowerCase();
            const matchTitle = assignment.thesisTitle.toLowerCase().includes(titleKeyword);

            if (!matchTitle) {
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
    document.getElementById('filter-year').value = '2024';
    document.getElementById('filter-semester').value = '';
    document.getElementById('filter-semester-order').value = '';
    document.getElementById('filter-student-status').value = '';
    document.getElementById('filter-major').value = '';
    document.getElementById('filter-degree').value = '';
    document.getElementById('filter-student-keyword').value = '';
    document.getElementById('filter-thesis-title').value = '';
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

    // 이미 열려있는 경우 먼저 닫기
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        // 짧은 지연 후 다시 열기 (DOM 정리를 위해)
        setTimeout(() => {
            openReviewDetailInternal(modal, assignmentId);
        }, 50);
    } else {
        openReviewDetailInternal(modal, assignmentId);
    }
}

// 내부 함수: 실제 모달 열기 로직
function openReviewDetailInternal(modal, assignmentId) {
    try {
        console.log('모달 열기 시작:', assignmentId);

        // 모달 데이터 설정
        modal.dataset.assignmentId = assignmentId;

        // 상세 정보 렌더링
        renderReviewDetail(assignmentId);

        // 모달 열기 - 강제로 display와 클래스 모두 설정
        modal.style.display = 'block';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        console.log('모달 열기 완료');
    } catch (error) {
        console.error('모달 열기 중 오류:', error);
        alert('심사 상세를 불러오는 중 오류가 발생했습니다.');
    }
}

function closeReviewDetail() {
    const modal = document.getElementById('review-detail-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = '';

        // 모달 내용 초기화 (메모리 누수 방지 및 다음 열기 준비)
        const content = document.getElementById('review-detail-content');
        if (content) {
            // 짧은 지연 후 내용 정리 (애니메이션을 위해)
            setTimeout(() => {
                content.innerHTML = '';
            }, 300);
        }
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

// ID 50: 학적상태 색상 클래스
function getStudentStatusClass(status) {
    const statusMap = {
        '재학': 'bg-green-100 text-green-800',
        '휴학': 'bg-orange-100 text-orange-800',
        '수료': 'bg-blue-100 text-blue-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
}

// ID 50: 진행상태 배지
function getProgressBadge(progress) {
    if (!progress) return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">대기 (0/0)</span>';

    const [completed, total] = progress.split('/').map(s => parseInt(s.trim()));

    if (completed === 0) {
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">대기 (${progress})</span>`;
    } else if (completed < total) {
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">진행중 (${progress})</span>`;
    } else {
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">완료 (${progress})</span>`;
    }
}

// ID 50: 심사하기 버튼 클릭 (심사위원용)
function openReviewModal(assignmentId) {
    console.log('심사 모달 열기:', assignmentId);
    // 기존 상세보기 모달 재사용
    openReviewDetail(assignmentId);
}

// ID 50: 종합평가 버튼 클릭 (심사위원장용)
function openChairEvaluation(assignmentId) {
    console.log('종합평가 모달 열기:', assignmentId);
    // TODO: 종합평가 모달 구현 (P3-T17)
    alert('종합평가 기능은 곧 구현될 예정입니다.');
}

window.getProgressColorClass = getProgressColorClass;
window.getStudentStatusClass = getStudentStatusClass;
window.getProgressBadge = getProgressBadge;
window.openReviewModal = openReviewModal;
window.openChairEvaluation = openChairEvaluation;
