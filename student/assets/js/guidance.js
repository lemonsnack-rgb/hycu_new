// ===================================
// 학생용 주차별 논문 지도 현황 화면
// 교수용 화면의 학생별 상세 화면과 동일한 UI
// 학생 정보 영역은 제거
// 교수 코멘트 영역은 읽기 전용
// ===================================

// 주차별 논문 지도 현황 초기화
function initGuidance() {
    console.log('학생용 주차별 논문 지도 현황 초기화');
    renderGuidanceDetail();
}

// 주차별 지도 계획 상세 화면 렌더링
function renderGuidanceDetail() {
    const student = DataService.getStudent();
    const plans = DataService.getWeeklyGuidancePlans();
    const sortedPlans = plans.sort((a, b) => a.week - b.week);

    const contentArea = document.getElementById('guidance-screen');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">주차별 논문 지도 현황</h2>
        </div>

        <!-- 주차별 지도 내역 -->
        <div>
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-bold text-gray-800">주차별 지도 내역</h4>
                <div class="flex items-center gap-3">
                    <button onclick="openAddPlanModal()"
                            class="bg-[#009DE8] text-white px-4 py-2 rounded text-sm hover:bg-[#0087c9] flex items-center gap-2">
                        <i class="fas fa-calendar-alt"></i>
                        계획 추가
                    </button>
                </div>
            </div>

            ${sortedPlans.length > 0 ? `
                <div class="space-y-4">
                    ${sortedPlans.map(plan => {
                        const isProfessorPlan = plan.createdBy === 'professor';
                        const canEdit = !plan.executionDate && !isProfessorPlan; // 실적이 입력되지 않고 학생이 작성한 경우만 수정 가능
                        return `
                            <div class="border ${isProfessorPlan ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'} rounded-lg p-4 hover:shadow-md transition-shadow">
                                <!-- 헤더 -->
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                            ${plan.week}주차
                                        </span>
                                        <span class="ml-2 text-sm text-gray-600">${formatDate(plan.plannedDate)}</span>
                                        ${plan.executionDate ? `
                                            <span class="ml-2 text-sm text-green-600 font-medium">
                                                → ${formatDate(plan.executionDate)} 실행
                                            </span>
                                        ` : ''}
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-xs px-2 py-1 rounded ${
                                            plan.actualMethod === 'meeting' ? 'bg-green-100 text-green-700' :
                                            plan.actualMethod === 'zoom' ? 'bg-purple-100 text-purple-700' :
                                            plan.actualMethod === 'email' ? 'bg-yellow-100 text-yellow-700' :
                                            plan.plannedMethod === 'meeting' ? 'bg-gray-100 text-gray-600' :
                                            'bg-gray-100 text-gray-600'
                                        }">
                                            ${getMethodText(plan.actualMethod || plan.plannedMethod)}
                                        </span>
                                        ${canEdit ? `
                                            <button onclick="openEditPlanModal(${plan.id})"
                                                    class="text-blue-600 hover:underline text-xs font-medium">
                                                수정
                                            </button>
                                            <button onclick="deletePlan(${plan.id})"
                                                    class="text-red-600 hover:underline text-xs font-medium">
                                                삭제
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>

                                <!-- 본문 -->
                                <div class="space-y-2">
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">담당교수:</span>
                                        <span class="text-sm ${isProfessorPlan ? 'text-blue-600 font-semibold' : 'text-gray-800'} ml-2">
                                            ${plan.advisor.name}
                                        </span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">지도주제:</span>
                                        <span class="text-sm text-gray-800 ml-2">${plan.plannedTopic}</span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">계획내용:</span>
                                        <p class="text-sm text-gray-700 mt-1">${plan.plannedContent}</p>
                                    </div>

                                    ${plan.executionContent ? `
                                        <div class="bg-green-50 border-l-4 border-green-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-green-800">실행내용:</span>
                                            <p class="text-sm text-green-900 mt-1">${plan.executionContent}</p>
                                        </div>
                                    ` : ''}

                                    ${plan.professorComment ? `
                                        <div class="bg-amber-50 border-l-4 border-amber-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-amber-800">교수 의견:</span>
                                            <p class="text-sm text-amber-900 mt-1">${plan.professorComment}</p>
                                        </div>
                                    ` : ''}

                                    <div class="flex justify-between items-center pt-2">
                                        ${getStatusBadge(plan.status)}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p class="mt-4 text-sm text-gray-600">등록된 지도 계획이 없습니다</p>
                    <button onclick="openAddPlanModal()"
                            class="mt-4 bg-[#009DE8] text-white px-4 py-2 rounded text-sm hover:bg-[#0087c9]">
                        첫 지도 계획 추가하기
                    </button>
                </div>
            `}
        </div>
    `;
}

// 상태 배지
function getStatusBadge(status) {
    const badges = {
        'planned': '<span class="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">계획중</span>',
        'in_progress': '<span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">진행중</span>',
        'completed': '<span class="text-xs px-2 py-1 rounded bg-green-100 text-green-700">완료</span>'
    };
    return badges[status] || badges['planned'];
}

// 지도 방식 텍스트
function getMethodText(method) {
    const methods = {
        'meeting': '대면',
        'online': '온라인',
        'zoom': 'Zoom',
        'email': '이메일',
        'phone': '전화'
    };
    return methods[method] || method;
}

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 계획 추가 모달
function openAddPlanModal() {
    const student = DataService.getStudent();
    if (!student || !student.advisors) return;

    const plans = DataService.getWeeklyGuidancePlans();
    const nextWeek = plans.length > 0
        ? Math.max(...plans.map(p => p.week)) + 1
        : 1;

    const modalContent = `
        <form id="add-plan-form" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">주차 *</label>
                    <input type="number" name="week" value="${nextWeek}" min="1"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">계획일 *</label>
                    <input type="date" name="plannedDate"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">담당교수 선택 *</label>
                <div class="space-y-2 bg-gray-50 p-3 rounded-lg">
                    ${student.advisors.map(advisor => `
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" name="advisors" value="${advisor.id}"
                                   ${advisor.role === 'primary' ? 'checked' : ''}
                                   class="rounded border-gray-300 mr-2">
                            <span class="text-sm ${advisor.role === 'primary' ? 'font-semibold text-blue-600' : 'text-gray-700'}">
                                ${advisor.name} (${advisor.role === 'primary' ? '주지도교수' : '부지도교수'})
                            </span>
                        </label>
                    `).join('')}
                </div>
                <p class="text-xs text-gray-500 mt-1">※ 복수 선택 가능</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 주제 *</label>
                <input type="text" name="plannedTopic" placeholder="예: 연구방법론 개요"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">계획 내용 *</label>
                <textarea name="plannedContent" rows="4" placeholder="지도받을 내용을 상세히 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                <select name="plannedMethod" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="">선택하세요</option>
                    <option value="meeting">대면</option>
                    <option value="online">온라인</option>
                    <option value="zoom">Zoom</option>
                    <option value="email">이메일</option>
                    <option value="phone">전화</option>
                </select>
            </div>

            <div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-xs text-blue-800">
                    💡 계획을 저장하면 담당 교수님께 알림이 전송됩니다.
                </p>
            </div>
        </form>
    `;

    createModal('주차별 논문지도 계획 추가', modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '저장',
            className: 'btn-primary',
            onclick: 'savePlan()'
        }
    ]);
}

// 계획 수정 모달
function openEditPlanModal(planId) {
    const plan = DataService.getWeeklyGuidancePlan(planId);
    if (!plan) return;

    const student = DataService.getStudent();
    if (!student || !student.advisors) return;

    const modalContent = `
        <form id="edit-plan-form" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">주차 *</label>
                    <input type="number" name="week" value="${plan.week}" min="1"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">계획일 *</label>
                    <input type="date" name="plannedDate" value="${plan.plannedDate}"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">담당교수 선택 *</label>
                <div class="space-y-2 bg-gray-50 p-3 rounded-lg">
                    ${student.advisors.map(advisor => `
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" name="advisors" value="${advisor.id}"
                                   ${advisor.id === plan.advisor.id ? 'checked' : ''}
                                   class="rounded border-gray-300 mr-2">
                            <span class="text-sm ${advisor.role === 'primary' ? 'font-semibold text-blue-600' : 'text-gray-700'}">
                                ${advisor.name} (${advisor.role === 'primary' ? '주지도교수' : '부지도교수'})
                            </span>
                        </label>
                    `).join('')}
                </div>
                <p class="text-xs text-gray-500 mt-1">※ 복수 선택 가능</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 주제 *</label>
                <input type="text" name="plannedTopic" value="${plan.plannedTopic}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">계획 내용 *</label>
                <textarea name="plannedContent" rows="4"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>${plan.plannedContent}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                <select name="plannedMethod" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="meeting" ${plan.plannedMethod === 'meeting' ? 'selected' : ''}>대면</option>
                    <option value="online" ${plan.plannedMethod === 'online' ? 'selected' : ''}>온라인</option>
                    <option value="zoom" ${plan.plannedMethod === 'zoom' ? 'selected' : ''}>Zoom</option>
                    <option value="email" ${plan.plannedMethod === 'email' ? 'selected' : ''}>이메일</option>
                    <option value="phone" ${plan.plannedMethod === 'phone' ? 'selected' : ''}>전화</option>
                </select>
            </div>
        </form>
    `;

    createModal('지도 계획 수정', modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '저장',
            className: 'btn-primary',
            onclick: `updatePlan(${planId})`
        }
    ]);
}

// 계획 저장
function savePlan() {
    const form = document.getElementById('add-plan-form');
    const formData = new FormData(form);

    const advisorIds = Array.from(form.querySelectorAll('input[name="advisors"]:checked'))
        .map(cb => cb.value);

    if (!formData.get('week') || !formData.get('plannedDate') ||
        !formData.get('plannedTopic') || !formData.get('plannedContent') ||
        !formData.get('plannedMethod')) {
        showToast('필수 항목을 모두 입력해주세요', 'warning');
        return;
    }

    if (advisorIds.length === 0) {
        showToast('담당교수를 최소 1명 이상 선택해주세요', 'warning');
        return;
    }

    const planData = {
        week: parseInt(formData.get('week')),
        plannedDate: formData.get('plannedDate'),
        plannedTopic: formData.get('plannedTopic'),
        plannedContent: formData.get('plannedContent'),
        plannedMethod: formData.get('plannedMethod'),
        advisorId: advisorIds[0], // 첫 번째 선택된 교수를 담당교수로 설정
        createdBy: 'student' // 학생이 작성한 계획임을 표시
    };

    DataService.addWeeklyGuidancePlan(planData);
    showToast('지도 계획이 저장되었습니다', 'success');

    setTimeout(() => {
        renderGuidanceDetail();
    }, 100);
}

// 계획 수정
function updatePlan(planId) {
    const form = document.getElementById('edit-plan-form');
    const formData = new FormData(form);

    const advisorIds = Array.from(form.querySelectorAll('input[name="advisors"]:checked'))
        .map(cb => cb.value);

    if (!formData.get('week') || !formData.get('plannedDate') ||
        !formData.get('plannedTopic') || !formData.get('plannedContent') ||
        !formData.get('plannedMethod')) {
        showToast('필수 항목을 모두 입력해주세요', 'warning');
        return;
    }

    if (advisorIds.length === 0) {
        showToast('담당교수를 최소 1명 이상 선택해주세요', 'warning');
        return;
    }

    const planData = {
        week: parseInt(formData.get('week')),
        plannedDate: formData.get('plannedDate'),
        plannedTopic: formData.get('plannedTopic'),
        plannedContent: formData.get('plannedContent'),
        plannedMethod: formData.get('plannedMethod'),
        advisorId: advisorIds[0] // 첫 번째 선택된 교수를 담당교수로 설정
    };

    DataService.updateWeeklyGuidancePlan(planId, planData);
    showToast('지도 계획이 수정되었습니다', 'success');

    setTimeout(() => {
        renderGuidanceDetail();
    }, 100);
}

// 계획 삭제
function deletePlan(planId) {
    if (!confirm('이 지도 계획을 삭제하시겠습니까?')) {
        return;
    }

    const success = DataService.deleteWeeklyGuidancePlan(planId);
    if (success) {
        showToast('지도 계획이 삭제되었습니다', 'success');
        renderGuidanceDetail();
    } else {
        showToast('삭제할 수 없는 계획입니다', 'error');
    }
}

// 전역으로 export
window.initGuidance = initGuidance;
window.renderGuidanceDetail = renderGuidanceDetail;
window.openAddPlanModal = openAddPlanModal;
window.openEditPlanModal = openEditPlanModal;
window.savePlan = savePlan;
window.updatePlan = updatePlan;
window.deletePlan = deletePlan;
