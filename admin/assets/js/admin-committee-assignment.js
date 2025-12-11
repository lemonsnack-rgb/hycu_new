// 심사위원 배정 화면
// File: admin/assets/js/admin-committee-assignment.js

// 전역 변수
window.filteredCommitteeData = null; // 검색 필터링된 데이터
window.selectedReviewTarget = null; // 현재 선택된 심사 대상
window.selectedChair = null; // 선택된 심사위원장
window.selectedMembers = []; // 선택된 심사위원 목록

// =============================================================================
// 메인 렌더링 함수
// =============================================================================

function renderCommitteeAssignmentContent() {
    const data = window.filteredCommitteeData || mockReviewTargets;

    // 배정 대기 중인 학생만 표시 (status: 'pending')
    const pendingReviews = data.filter(item => item.status === 'pending');

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-bold text-gray-800">심사위원 배정</h2>
                <p class="text-sm text-gray-600 mt-1">학생의 논문 심사를 위한 심사위원을 배정합니다.</p>
            </div>

            <!-- 검색 옵션 (지도교수 배정과 동일한 디자인) -->
            <div class="p-6 border-b">
                <div class="search-container">
                    <div class="search-grid">
                        <!-- 1. 학년도 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학년도
                            </label>
                            <select id="committee-search-academic-year" class="search-select">
                                <option value="">전체</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                        </div>

                        <!-- 2. 학기차 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학기차
                            </label>
                            <input type="text" id="committee-search-semester-count" placeholder="학기차 입력"
                                   class="search-input">
                        </div>

                        <!-- 3. 학과/전공 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학과/전공
                            </label>
                            <select id="committee-search-department" class="search-select">
                                <option value="">전체</option>
                                <option value="컴퓨터공학과">컴퓨터공학과</option>
                                <option value="경영학과">경영학과</option>
                                <option value="교육학과">교육학과</option>
                                <option value="심리학과">심리학과</option>
                                <option value="사회복지학과">사회복지학과</option>
                            </select>
                        </div>

                        <!-- 4. 학위과정 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학위과정
                            </label>
                            <select id="committee-search-degree" class="search-select">
                                <option value="">전체</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                            </select>
                        </div>

                        <!-- 5. 심사 대상 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                심사 대상
                            </label>
                            <select id="committee-search-review-type" class="search-select">
                                <option value="">전체</option>
                                <option value="proposal">연구계획서</option>
                                <option value="progress">1차 보고서</option>
                                <option value="final">최종논문</option>
                            </select>
                        </div>

                        <!-- 6. 학번 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학번
                            </label>
                            <input type="text" id="committee-search-student-number" placeholder="학번 입력"
                                   class="search-input">
                        </div>

                        <!-- 7. 이름 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                이름
                            </label>
                            <input type="text" id="committee-search-name" placeholder="이름 입력"
                                   class="search-input">
                        </div>
                    </div>

                    <!-- 검색/초기화 버튼 -->
                    <div class="search-buttons">
                        <button onclick="searchCommitteeAssignment()" class="search-btn search-btn-primary">
                            <i class="fas fa-search"></i>검색
                        </button>
                        <button onclick="resetCommitteeSearch()" class="search-btn search-btn-secondary">
                            <i class="fas fa-redo"></i>초기화
                        </button>
                    </div>
                </div>
            </div>

            <!-- 학생 목록 테이블 -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학년도</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학기차</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학과</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학위과정</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">심사 대상</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">논문 제목</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지도교수</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제출일</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${pendingReviews.length === 0 ? `
                                <tr>
                                    <td colspan="11" class="px-6 py-8 text-center text-gray-500">
                                        심사위원 배정 대기 중인 학생이 없습니다.
                                    </td>
                                </tr>
                            ` : pendingReviews.map(item => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.academicYear}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.semesterCount}학기</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.studentNumber}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.department}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${item.studentName}
                                        <button onclick="showStudentInfo('${item.studentId}')"
                                                class="ml-1 text-gray-400 hover:text-primary"
                                                title="학생 상세정보">
                                            <svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                            </svg>
                                        </button>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span class="px-2 py-1 text-xs rounded ${item.degreeType === '석사' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">
                                            ${item.degreeType}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                            ${getReviewTypeLabel(item.reviewType)}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900 td-truncate-long" title="${item.title}">
                                        ${item.title}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.advisorName}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.submittedDate}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button onclick="openCommitteeAssignmentModal('${item.id}')"
                                                class="text-xs px-3 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-white">
                                            배정
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                ${pendingReviews.length === 0 ? '' : `
                    <div class="px-6 py-4 text-sm text-gray-600 border-t">
                        총 <span class="font-semibold text-primary">${pendingReviews.length}</span>건의 심사 대기 중
                    </div>
                `}
            </div>
        </div>
    `;

    document.getElementById('committee-assignment-content').innerHTML = html;
}

// =============================================================================
// 심사 유형 레이블 변환
// =============================================================================

function getReviewTypeLabel(reviewType) {
    const labels = {
        'proposal': '연구계획서',
        'progress': '1차 보고서',
        'final': '최종논문'
    };
    return labels[reviewType] || reviewType;
}

// =============================================================================
// 검색 기능
// =============================================================================

function searchCommitteeAssignment() {
    const academicYear = document.getElementById('committee-search-academic-year').value;
    const semesterCount = document.getElementById('committee-search-semester-count').value.trim();
    const department = document.getElementById('committee-search-department').value;
    const degree = document.getElementById('committee-search-degree').value;
    const reviewType = document.getElementById('committee-search-review-type').value;
    const studentNumber = document.getElementById('committee-search-student-number').value.trim();
    const name = document.getElementById('committee-search-name').value.trim();

    let filtered = mockReviewTargets.filter(item => {
        if (academicYear && item.academicYear !== academicYear) return false;
        if (semesterCount && item.semesterCount.toString() !== semesterCount) return false;
        if (department && item.department !== department) return false;
        if (degree && item.degreeType !== degree) return false;
        if (reviewType && item.reviewType !== reviewType) return false;
        if (studentNumber && !item.studentNumber.includes(studentNumber)) return false;
        if (name && !item.studentName.includes(name)) return false;
        return true;
    });

    window.filteredCommitteeData = filtered;
    renderCommitteeAssignmentContent();

    const pendingCount = filtered.filter(item => item.status === 'pending').length;
    showNotification(`검색 결과: ${pendingCount}건의 심사 대기 중 학생`, 'success');
}

function resetCommitteeSearch() {
    document.getElementById('committee-search-academic-year').value = '';
    document.getElementById('committee-search-semester-count').value = '';
    document.getElementById('committee-search-department').value = '';
    document.getElementById('committee-search-degree').value = '';
    document.getElementById('committee-search-review-type').value = '';
    document.getElementById('committee-search-student-number').value = '';
    document.getElementById('committee-search-name').value = '';

    window.filteredCommitteeData = null;
    renderCommitteeAssignmentContent();
    showNotification('검색 조건이 초기화되었습니다.', 'info');
}

// =============================================================================
// 심사위원 배정 모달
// =============================================================================

function openCommitteeAssignmentModal(reviewTargetId) {
    const reviewTarget = mockReviewTargets.find(rt => rt.id === reviewTargetId);
    if (!reviewTarget) {
        showNotification('심사 대상 정보를 찾을 수 없습니다.', 'error');
        return;
    }

    window.selectedReviewTarget = reviewTarget;
    window.selectedChair = null;
    window.selectedMembers = [];

    // 지도교수를 심사위원에 자동 추가
    const advisor = mockProfessors.find(p => p.name === reviewTarget.advisorName);
    if (advisor) {
        window.selectedMembers = [{ ...advisor }];
    }

    const minMembers = reviewTarget.degreeType === '석사' ? 2 : 4;
    const maxMembers = reviewTarget.degreeType === '석사' ? 3 : 5; // 심사위원장 포함 최대 인원
    const totalMin = reviewTarget.degreeType === '석사' ? 3 : 5;

    // 최대 심사위원 수 저장 (심사위원장 제외)
    window.maxCommitteeMembers = maxMembers - 1;

    const modalHTML = `
        <div class="admin-modal active" id="committee-assignment-modal" style="display: block;">
            <div class="admin-modal-content" style="max-width: 1200px;">
                <div class="admin-modal-header">
                    <h2>심사위원 배정</h2>
                    <button class="admin-modal-close" onclick="closeCommitteeAssignmentModal()">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <!-- 학생 정보 -->
                    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h3 class="text-sm font-semibold text-gray-700 mb-3">심사 대상 학생 정보</h3>
                        <div class="grid grid-cols-4 gap-3 text-sm">
                            <div>
                                <span class="text-gray-500">학번:</span>
                                <span class="ml-2 font-medium">${reviewTarget.studentNumber}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">성명:</span>
                                <span class="ml-2 font-medium">${reviewTarget.studentName}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">학과:</span>
                                <span class="ml-2 font-medium">${reviewTarget.department}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">학위과정:</span>
                                <span class="ml-2 font-medium">${reviewTarget.degreeType}</span>
                            </div>
                        </div>
                        <div class="mt-2 text-sm">
                            <span class="text-gray-500">논문 제목:</span>
                            <span class="ml-2 font-medium">${reviewTarget.title}</span>
                        </div>
                    </div>

                    <!-- 안내 메시지 -->
                    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div class="flex items-start">
                            <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
                            <div class="text-sm text-blue-700">
                                <p class="font-medium mb-1">심사위원 배정 안내</p>
                                <p class="text-xs">${reviewTarget.degreeType}: 심사위원장 1명 + 심사위원 ${minMembers}명 이상 (총 ${totalMin}명 이상) 필수</p>
                            </div>
                        </div>
                    </div>

                    <!-- 좌우 2분할 레이아웃 -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; height: 500px; margin-bottom: 20px;">
                        <!-- 왼쪽: 심사위원장 -->
                        <div style="border-right: 1px solid #e5e7eb; padding-right: 24px; display: flex; flex-direction: column;">
                            <h4 class="font-semibold text-gray-900 mb-3" style="font-size: 15px;">
                                심사위원장 <span class="text-red-500 text-sm">*</span>
                            </h4>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">학과</label>
                                    <select id="chair-dept-filter" onchange="filterCommitteeMembers('chair')"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                        <option value="">전체</option>
                                        ${[...new Set(mockProfessors.map(p => p.department))].map(dept =>
                                            `<option value="${dept}">${dept}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">교수명</label>
                                    <input type="text" id="chair-name-filter" placeholder="교수명 검색" onkeyup="filterCommitteeMembers('chair')"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                </div>
                            </div>

                            <!-- 컬럼 헤더 -->
                            <div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600; color: #6b7280;">
                                <div></div>
                                <div>교번</div>
                                <div>이름</div>
                                <div>학과</div>
                            </div>

                            <div style="flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;" id="chair-list">
                                ${mockProfessors.map(prof => renderCommitteeMemberItem(prof, true, 'chair')).join('')}
                            </div>
                        </div>

                        <!-- 오른쪽: 심사위원 -->
                        <div style="padding-left: 24px; display: flex; flex-direction: column;">
                            <h4 class="font-semibold text-gray-900 mb-3" style="font-size: 15px;">
                                심사위원 (복수 선택 가능) <span class="text-red-500 text-sm">*</span>
                                <span class="text-xs text-gray-500 ml-2">(${minMembers}명 이상)</span>
                            </h4>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">학과</label>
                                    <select id="member-dept-filter" onchange="filterCommitteeMembers('member')"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                        <option value="">전체</option>
                                        ${[...new Set(mockProfessors.map(p => p.department))].map(dept =>
                                            `<option value="${dept}">${dept}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">교수명</label>
                                    <input type="text" id="member-name-filter" placeholder="교수명 검색" onkeyup="filterCommitteeMembers('member')"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                </div>
                            </div>

                            <!-- 컬럼 헤더 -->
                            <div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600; color: #6b7280;">
                                <div></div>
                                <div>교번</div>
                                <div>이름</div>
                                <div>학과</div>
                            </div>

                            <div style="flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;" id="member-list">
                                ${mockProfessors.map(prof => renderCommitteeMemberItem(prof, false, 'member')).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="admin-modal-footer" style="padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px;">
                    <button onclick="closeCommitteeAssignmentModal()" class="btn-secondary">
                        취소
                    </button>
                    <button onclick="confirmCommitteeAssignment()" class="btn-primary" id="save-committee-btn">
                        <i class="fas fa-check mr-1"></i>배정 완료
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateSaveCommitteeButtonState();
}

function closeCommitteeAssignmentModal() {
    const modal = document.getElementById('committee-assignment-modal');
    if (modal) {
        modal.remove();
    }
    window.selectedReviewTarget = null;
    window.selectedChair = null;
    window.selectedMembers = [];
}

// =============================================================================
// 심사위원 항목 렌더링
// =============================================================================

function renderCommitteeMemberItem(prof, isChair, side) {
    const isSelected = isChair
        ? (window.selectedChair?.id === prof.id)
        : window.selectedMembers.some(m => m.id === prof.id);

    const dataAttrs = `data-dept="${prof.department}" data-name="${prof.name}" data-side="${side}"`;

    return `
        <div class="committee-member-item" ${dataAttrs} style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; align-items: center; padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <input type="${isChair ? 'radio' : 'checkbox'}"
                   name="${side}-committee-select"
                   value="${prof.id}"
                   ${isSelected ? 'checked' : ''}
                   onchange="handleCommitteeSelection('${prof.id}', ${isChair})"
                   style="margin: 0;">
            <div class="text-sm text-gray-900">${prof.employeeNumber || '-'}</div>
            <div class="text-sm font-medium text-gray-900">${prof.name}</div>
            <div class="text-sm text-gray-600">${prof.department}</div>
        </div>
    `;
}

// =============================================================================
// 심사위원 선택 처리
// =============================================================================

function handleCommitteeSelection(profId, isChair) {
    const prof = mockProfessors.find(p => p.id === profId);
    if (!prof) return;

    if (isChair) {
        // 심사위원장 선택
        window.selectedChair = { ...prof };
        // 심사위원장이 심사위원 목록에 있으면 제거
        window.selectedMembers = window.selectedMembers.filter(m => m.id !== profId);
        // 심사위원 목록에서 해당 체크박스 해제
        const memberCheckbox = document.querySelector(`#member-list input[value="${profId}"]`);
        if (memberCheckbox) memberCheckbox.checked = false;
    } else {
        // 심사위원 선택
        // 심사위원장으로 선택된 교수는 심사위원으로 선택 불가
        if (window.selectedChair && window.selectedChair.id === profId) {
            showNotification('심사위원장은 심사위원으로 중복 선택할 수 없습니다.', 'warning');
            const checkbox = document.querySelector(`#member-list input[value="${profId}"]`);
            if (checkbox) checkbox.checked = false;
            return;
        }

        const index = window.selectedMembers.findIndex(m => m.id === profId);
        if (index >= 0) {
            // 체크박스 해제 - 선택 취소
            window.selectedMembers.splice(index, 1);
        } else {
            // 체크박스 선택 - 추가
            // 최대 인원 초과 체크
            const maxMembers = window.maxCommitteeMembers || 4; // 기본값 4명 (석사 3명 - 위원장 1명)
            if (window.selectedMembers.length >= maxMembers) {
                showNotification('심사위원 수를 초과하였습니다.', 'warning');
                const checkbox = document.querySelector(`#member-list input[value="${profId}"]`);
                if (checkbox) checkbox.checked = false;
                return;
            }
            window.selectedMembers.push({ ...prof });
        }
    }

    updateSaveCommitteeButtonState();
}

// =============================================================================
// 심사위원 필터링
// =============================================================================

function filterCommitteeMembers(side) {
    const deptFilter = document.getElementById(`${side}-dept-filter`)?.value.toLowerCase() || '';
    const nameFilter = document.getElementById(`${side}-name-filter`)?.value.toLowerCase() || '';

    document.querySelectorAll(`.committee-member-item[data-side="${side}"]`).forEach(item => {
        const dept = item.dataset.dept.toLowerCase();
        const name = item.dataset.name.toLowerCase();

        // 체크박스가 선택되어 있는지 확인
        const checkbox = item.querySelector('input[type="checkbox"], input[type="radio"]');
        const isChecked = checkbox && checkbox.checked;

        const matchDept = !deptFilter || dept === deptFilter;
        const matchName = !nameFilter || name.includes(nameFilter);

        // 선택된 항목은 필터와 관계없이 항상 표시
        if (isChecked) {
            item.style.display = '';
        } else {
            item.style.display = (matchDept && matchName) ? '' : 'none';
        }
    });
}

// =============================================================================
// 저장 버튼 상태 업데이트
// =============================================================================

function updateSaveCommitteeButtonState() {
    const saveBtn = document.getElementById('save-committee-btn');
    if (!saveBtn) return;

    const reviewTarget = window.selectedReviewTarget;
    const chair = window.selectedChair;
    const members = window.selectedMembers;

    if (!reviewTarget) {
        saveBtn.disabled = true;
        return;
    }

    const minMembers = reviewTarget.degreeType === '석사' ? 2 : 4;
    const isValid = chair && members.length >= minMembers;

    saveBtn.disabled = !isValid;
}

// =============================================================================
// 심사위원 배정 확인
// =============================================================================

function confirmCommitteeAssignment() {
    const reviewTarget = window.selectedReviewTarget;
    const chair = window.selectedChair;
    const members = window.selectedMembers;

    // 유효성 검사
    if (!chair) {
        showNotification('심사위원장을 선택해주세요.', 'warning');
        return;
    }

    const minMembers = reviewTarget.degreeType === '석사' ? 2 : 4;
    if (members.length < minMembers) {
        showNotification(`${reviewTarget.degreeType} 과정은 심사위원을 ${minMembers}명 이상 선택해야 합니다.`, 'warning');
        return;
    }

    // 심사위원 배정 처리 (Mock)
    const assignment = {
        id: `CA${String(mockCommitteeAssignments.length + 1).padStart(3, '0')}`,
        reviewTargetId: reviewTarget.id,
        studentId: reviewTarget.studentId,
        studentName: reviewTarget.studentName,
        department: reviewTarget.department,
        degreeType: reviewTarget.degreeType,
        reviewType: reviewTarget.reviewType,
        chairId: chair.id,
        chairName: chair.name,
        members: [
            { professorId: chair.id, professorName: chair.name, role: 'chair', department: chair.department },
            ...members.map(m => ({
                professorId: m.id,
                professorName: m.name,
                role: 'member',
                department: m.department
            }))
        ],
        assignedDate: new Date().toISOString().split('T')[0],
        status: 'completed'
    };

    mockCommitteeAssignments.push(assignment);

    // 심사 대상 상태 업데이트
    const targetIndex = mockReviewTargets.findIndex(rt => rt.id === reviewTarget.id);
    if (targetIndex > -1) {
        mockReviewTargets[targetIndex].status = 'assigned';
    }

    closeCommitteeAssignmentModal();
    renderCommitteeAssignmentContent();

    showNotification(
        `${reviewTarget.studentName} 학생의 심사위원 배정이 완료되었습니다. (심사위원장: ${chair.name}, 심사위원: ${members.length}명)`,
        'success'
    );
}
