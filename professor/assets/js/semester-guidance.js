// ===================================
// 학기별 논문지도 계획 관리 (15주차 일괄)
// ===================================

let currentSemester = { year: 2025, semester: 1 };
let currentEditingPlan = null;

// ==================== 학기별 계획 요약 렌더링 ====================
function renderSemesterPlansSummary() {
    const allPlans = DataService.getAllSemesterPlans(currentStudentId);

    if (allPlans.length === 0) {
        return `
            <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p class="mt-4 text-lg font-medium text-gray-700">등록된 학기별 지도 계획이 없습니다</p>
                <p class="mt-2 text-sm text-gray-500">15주차 지도 계획을 일괄 등록하세요.</p>
            </div>
        `;
    }

    return `
        <div class="space-y-4 mb-6">
            ${allPlans.map(plan => renderSemesterPlanCard(plan)).join('')}
        </div>
    `;
}

// 학기별 계획 카드
function renderSemesterPlanCard(plan) {
    const totalWeeks = plan.weeks.length;
    const weeksWithExecutions = plan.weeks.filter(w => w.executions && w.executions.length > 0).length;
    const progressPercent = totalWeeks > 0 ? Math.round((weeksWithExecutions / totalWeeks) * 100) : 0;

    return `
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-800">${plan.year}학년도 ${plan.semester}학기</h3>
                    <p class="text-sm text-gray-600 mt-1">
                        ${formatDate(plan.semesterStartDate)} ~ ${formatDate(plan.semesterEndDate)}
                    </p>
                </div>
                <button onclick="viewSemesterPlanDetail(${plan.year}, ${plan.semester})"
                        class="text-[#6A0028] hover:text-[#6A0028] text-sm font-medium flex items-center gap-1">
                    <span>상세보기</span>
                    <i class="fas fa-chevron-right text-xs"></i>
                </button>
            </div>

            <div class="space-y-3">
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600">등록된 주차</span>
                    <span class="font-semibold text-gray-800">${totalWeeks}주차</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600">실적 입력 완료</span>
                    <span class="font-semibold text-[#6A0028]">${weeksWithExecutions}주차</span>
                </div>
                <div>
                    <div class="flex justify-between items-center text-sm mb-1">
                        <span class="text-gray-600">진행률</span>
                        <span class="font-semibold text-gray-800">${progressPercent}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-[#8A0034] h-2 rounded-full transition-all" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 버튼 텍스트
function renderSemesterPlanButtonText() {
    const plan = DataService.getSemesterGuidancePlan(currentStudentId, currentSemester.year, currentSemester.semester);
    return plan ? '학기 계획 수정' : '학기 계획 등록';
}

// ==================== 15주차 편집 화면 열기 ====================
function openSemesterPlanEditor() {
    const student = DataService.getStudentDetail(currentStudentId);
    if (!student) return;

    const plan = DataService.getSemesterGuidancePlan(currentStudentId, currentSemester.year, currentSemester.semester);
    currentEditingPlan = plan;

    const contentArea = document.getElementById('guidance-content-area');
    if (!contentArea) return;

    contentArea.innerHTML = renderSemesterPlanEditorScreen(student, plan);

    // 모든 주차 펼치기
    document.querySelectorAll('.week-accordion').forEach(acc => {
        acc.classList.add('open');
    });
}

// 15주차 편집 화면 렌더링
function renderSemesterPlanEditorScreen(student, existingPlan) {
    const advisors = DataService.getStudentAdvisors(currentStudentId);
    const isEditMode = !!existingPlan;

    // 학기 시작일 (기본값: 오늘 또는 기존 계획의 시작일)
    const semesterStartDate = existingPlan ? existingPlan.semesterStartDate : getTodayDate();

    return `
        <!-- 뒤로가기 -->
        <div class="mb-4">
            <button onclick="renderStudentDetail()"
                    class="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="text-sm font-medium">뒤로가기</span>
            </button>
        </div>

        <!-- 학기 정보 카드 -->
        <div class="bg-[#FCE4EC] rounded-lg p-6 mb-6">
            <div class="flex items-start justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${currentSemester.year}학년도 ${currentSemester.semester}학기 지도 계획</h2>
                    <p class="text-sm text-gray-600 mt-2">학생: ${student.name} (${student.studentId})</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="toggleAllWeeks(true)" class="text-sm text-[#6A0028] hover:underline">
                        전체 펼치기
                    </button>
                    <span class="text-gray-400">|</span>
                    <button onclick="toggleAllWeeks(false)" class="text-sm text-[#6A0028] hover:underline">
                        전체 접기
                    </button>
                </div>
            </div>

            ${!isEditMode ? `
                <div class="mt-4 bg-white rounded-lg p-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">학기 시작일 *</label>
                    <input type="date" id="semester-start-date" value="${semesterStartDate}"
                           class="border border-gray-300 rounded px-3 py-2 text-sm">
                    <p class="text-xs text-gray-500 mt-1">※ 학사일정 기준으로 15주차 날짜가 자동 계산됩니다.</p>
                </div>
            ` : `
                <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-gray-600">학기 시작일:</span>
                        <span class="font-semibold text-gray-800 ml-2">${formatDate(existingPlan.semesterStartDate)}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">학기 종료일:</span>
                        <span class="font-semibold text-gray-800 ml-2">${formatDate(existingPlan.semesterEndDate)}</span>
                    </div>
                </div>
            `}

            <div class="mt-4 bg-white rounded-lg p-4">
                <p class="text-sm text-gray-700"><span class="font-semibold">지도교수:</span> ${advisors.map(a => a.name).join(', ')}</p>
                <p class="text-xs text-gray-500 mt-1">※ 모든 지도교수가 각 주차별로 실적을 입력할 수 있습니다.</p>
            </div>
        </div>

        <!-- 15주차 입력 폼 -->
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">주차별 지도 계획</h3>
            <form id="semester-plan-form" class="space-y-3">
                ${renderWeeklyInputForms(existingPlan, advisors)}
            </form>

            <div class="mt-6 flex justify-end gap-3">
                <button type="button" onclick="renderStudentDetail()"
                        class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    취소
                </button>
                <button type="button" onclick="saveSemesterPlan()"
                        class="px-6 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold">
                    ${isEditMode ? '수정 완료' : '등록'}
                </button>
            </div>
        </div>
    `;
}

// 15주차 입력 폼 렌더링
function renderWeeklyInputForms(existingPlan, advisors) {
    const weeks = [];
    for (let i = 1; i <= 15; i++) {
        const existingWeek = existingPlan ? existingPlan.weeks.find(w => w.week === i) : null;
        weeks.push(renderWeekForm(i, existingWeek, advisors));
    }
    return weeks.join('');
}

// 개별 주차 폼
function renderWeekForm(weekNumber, existingData, advisors) {
    const hasData = existingData && existingData.plannedTopic;

    return `
        <div class="week-accordion border border-gray-200 rounded-lg ${hasData ? 'open' : ''}">
            <div class="week-accordion-header flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                 onclick="toggleWeekAccordion(${weekNumber})">
                <div class="flex items-center gap-3">
                    <span class="inline-block bg-[#FCE4EC] text-[#6A0028] text-sm font-semibold px-3 py-1 rounded">
                        ${weekNumber}주차
                    </span>
                    ${hasData ? `
                        <span class="text-sm text-gray-700 font-medium">${existingData.plannedTopic}</span>
                    ` : `
                        <span class="text-sm text-gray-400">미입력</span>
                    `}
                </div>
                <i class="fas fa-chevron-down transition-transform"></i>
            </div>

            <div class="week-accordion-content p-4 border-t border-gray-200">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">지도 주제 *</label>
                        <input type="text" name="week_${weekNumber}_topic"
                               value="${existingData?.plannedTopic || ''}"
                               placeholder="예: 연구방법론 개요"
                               class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">계획 내용 *</label>
                        <textarea name="week_${weekNumber}_content" rows="3"
                                  placeholder="지도할 내용을 상세히 입력하세요"
                                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm">${existingData?.plannedContent || ''}</textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                        <select name="week_${weekNumber}_method" class="border border-gray-300 rounded px-3 py-2 text-sm">
                            <option value="meeting" ${existingData?.plannedMethod === 'meeting' ? 'selected' : ''}>대면</option>
                            <option value="online" ${existingData?.plannedMethod === 'online' ? 'selected' : ''}>온라인</option>
                            <option value="zoom" ${existingData?.plannedMethod === 'zoom' ? 'selected' : ''}>Zoom</option>
                            <option value="email" ${existingData?.plannedMethod === 'email' ? 'selected' : ''}>이메일</option>
                            <option value="phone" ${existingData?.plannedMethod === 'phone' ? 'selected' : ''}>전화</option>
                        </select>
                    </div>

                    ${existingData && existingData.executions && existingData.executions.length > 0 ? `
                        <div class="mt-4 pt-4 border-t border-gray-200">
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">실적 및 교수의견</h4>
                            <div class="space-y-3">
                                ${existingData.executions.map(exec => renderExecutionItem(exec, weekNumber, advisors)).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// 실적 아이템 렌더링
function renderExecutionItem(execution, weekNumber, advisors) {
    const currentProf = DataService.getCurrentProfessor();
    const isMyExecution = execution.professorId === currentProf.id;

    return `
        <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="text-sm font-semibold text-gray-800">${execution.professorName}</span>
                    <span class="text-xs text-gray-500 ml-2">${formatDate(execution.executionDate)}</span>
                    <span class="text-xs px-2 py-0.5 rounded ml-2 ${getMethodBadgeClass(execution.method)}">
                        ${getMethodText(execution.method)}
                    </span>
                </div>
                ${isMyExecution ? `
                    <div class="flex gap-2">
                        <button onclick="openEditExecutionModal(${currentStudentId}, ${currentSemester.year}, ${currentSemester.semester}, ${weekNumber}, '${execution.executionId}')"
                                class="text-xs text-[#6A0028] hover:underline">수정</button>
                        <button onclick="deleteExecutionConfirm(${currentStudentId}, ${currentSemester.year}, ${currentSemester.semester}, ${weekNumber}, '${execution.executionId}')"
                                class="text-xs text-red-600 hover:underline">삭제</button>
                    </div>
                ` : ''}
            </div>
            <p class="text-sm text-gray-700 mb-1"><span class="font-medium">실행:</span> ${execution.executionContent}</p>
            <p class="text-sm text-gray-700"><span class="font-medium">의견:</span> ${execution.comment}</p>
        </div>
    `;
}

// ==================== 아코디언 토글 ====================
function toggleWeekAccordion(weekNumber) {
    const accordion = event.currentTarget.closest('.week-accordion');
    accordion.classList.toggle('open');
}

function toggleAllWeeks(open) {
    document.querySelectorAll('.week-accordion').forEach(acc => {
        if (open) {
            acc.classList.add('open');
        } else {
            acc.classList.remove('open');
        }
    });
}

// ==================== 저장 ====================
function saveSemesterPlan() {
    const form = document.getElementById('semester-plan-form');
    const formData = new FormData(form);

    const weeks = [];
    for (let i = 1; i <= 15; i++) {
        const topic = formData.get(`week_${i}_topic`)?.trim();
        const content = formData.get(`week_${i}_content`)?.trim();
        const method = formData.get(`week_${i}_method`);

        if (topic && content) {
            const advisors = DataService.getStudentAdvisors(currentStudentId);
            weeks.push({
                advisorIds: advisors.map(a => a.id),
                plannedTopic: topic,
                plannedContent: content,
                plannedMethod: method
            });
        }
    }

    if (weeks.length === 0) {
        showToast('최소 1개 이상의 주차를 입력해야 합니다.', 'warning');
        return;
    }

    try {
        if (currentEditingPlan) {
            // 수정
            DataService.updateSemesterGuidancePlan(currentStudentId, currentSemester.year, currentSemester.semester, weeks);
            showToast(`${currentSemester.year}학년도 ${currentSemester.semester}학기 계획이 수정되었습니다.`, 'success');
        } else {
            // 신규 생성
            const semesterStartDate = document.getElementById('semester-start-date')?.value;
            if (!semesterStartDate) {
                showToast('학기 시작일을 선택해주세요.', 'warning');
                return;
            }

            DataService.createSemesterGuidancePlan(currentStudentId, currentSemester.year, currentSemester.semester, semesterStartDate, weeks);
            showToast(`${currentSemester.year}학년도 ${currentSemester.semester}학기 계획이 등록되었습니다. (${weeks.length}주차)`, 'success');
        }

        // 상세 화면으로 돌아가기
        setTimeout(() => {
            renderStudentDetail();
        }, 500);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== 학기별 상세 보기 ====================
function viewSemesterPlanDetail(year, semester) {
    const plan = DataService.getSemesterGuidancePlan(currentStudentId, year, semester);
    if (!plan) {
        showToast('해당 학기 계획을 찾을 수 없습니다.', 'error');
        return;
    }

    currentSemester = { year, semester };

    const student = DataService.getStudentDetail(currentStudentId);
    const currentProf = DataService.getCurrentProfessor();
    const advisors = DataService.getStudentAdvisors(currentStudentId);

    const contentArea = document.getElementById('guidance-content-area');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <!-- 뒤로가기 -->
        <div class="mb-4">
            <button onclick="renderStudentDetail()"
                    class="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="text-sm font-medium">뒤로가기</span>
            </button>
        </div>

        <!-- 학기 정보 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${year}학년도 ${semester}학기 지도 계획</h2>
                    <p class="text-sm text-gray-600 mt-2">
                        ${formatDate(plan.semesterStartDate)} ~ ${formatDate(plan.semesterEndDate)}
                    </p>
                </div>
                <button onclick="openSemesterPlanEditor()"
                        class="bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#8A0034]">
                    계획 수정
                </button>
            </div>

            <div class="grid grid-cols-3 gap-4 mt-4">
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-600 mb-1">등록된 주차</p>
                    <p class="text-2xl font-bold text-gray-800">${plan.weeks.length}주차</p>
                </div>
                <div class="bg-[#FCE4EC] rounded-lg p-4">
                    <p class="text-sm text-gray-600 mb-1">실적 입력 완료</p>
                    <p class="text-2xl font-bold text-[#6A0028]">${plan.weeks.filter(w => w.executions.length > 0).length}주차</p>
                </div>
                <div class="bg-green-50 rounded-lg p-4">
                    <p class="text-sm text-gray-600 mb-1">총 실적 건수</p>
                    <p class="text-2xl font-bold text-green-600">${plan.weeks.reduce((sum, w) => sum + w.executions.length, 0)}건</p>
                </div>
            </div>
        </div>

        <!-- 주차별 상세 -->
        <div class="space-y-4">
            ${plan.weeks.map(week => renderWeekDetailCard(week, advisors, currentProf)).join('')}
        </div>
    `;
}

// 주차별 상세 카드
function renderWeekDetailCard(week, advisors, currentProf) {
    return `
        <div class="bg-white border border-gray-200 rounded-lg p-5">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <span class="inline-block bg-[#FCE4EC] text-[#6A0028] text-sm font-semibold px-3 py-1 rounded">
                        ${week.week}주차
                    </span>
                    <span class="text-sm text-gray-600 ml-2">${formatDate(week.plannedDate)}</span>
                    <span class="text-xs px-2 py-0.5 rounded ml-2 ${getMethodBadgeClass(week.plannedMethod)}">
                        ${getMethodText(week.plannedMethod)}
                    </span>
                </div>
                <button onclick="openAddExecutionModal(${currentStudentId}, ${currentSemester.year}, ${currentSemester.semester}, ${week.week})"
                        class="text-sm text-[#6A0028] hover:text-[#6A0028] font-medium flex items-center gap-1">
                    <i class="fas fa-plus-circle"></i>
                    <span>실적 추가</span>
                </button>
            </div>

            <div class="space-y-3 mb-4">
                <div>
                    <span class="text-sm font-semibold text-gray-700">지도 주제:</span>
                    <span class="text-sm text-gray-800 ml-2">${week.plannedTopic}</span>
                </div>
                <div>
                    <span class="text-sm font-semibold text-gray-700">계획 내용:</span>
                    <p class="text-sm text-gray-700 mt-1">${week.plannedContent}</p>
                </div>
            </div>

            <!-- 교수별 실적 -->
            <div class="mt-4 pt-4 border-t border-gray-200">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">실적 및 교수의견</h4>
                ${advisors.map(advisor => {
                    const professorExecutions = week.executions.filter(e => e.professorId === advisor.id);
                    const isMyArea = advisor.id === currentProf.id;

                    return `
                        <div class="mb-4 last:mb-0 ${isMyArea ? 'bg-[#FCE4EC]' : 'bg-gray-50'} rounded-lg p-4">
                            <div class="flex justify-between items-center mb-3">
                                <h5 class="text-sm font-semibold ${isMyArea ? 'text-[#6A0028]' : 'text-gray-800'}">
                                    ${advisor.name} ${advisor.role === 'primary' ? '(주지도)' : '(부지도)'}
                                </h5>
                                ${isMyArea && professorExecutions.length === 0 ? `
                                    <button onclick="openAddExecutionModal(${currentStudentId}, ${currentSemester.year}, ${currentSemester.semester}, ${week.week})"
                                            class="text-xs text-[#6A0028] hover:underline">+ 실적 추가</button>
                                ` : ''}
                            </div>

                            ${professorExecutions.length > 0 ? `
                                <div class="space-y-2">
                                    ${professorExecutions.map(exec => `
                                        <div class="bg-white rounded p-3">
                                            <div class="flex justify-between items-start mb-2">
                                                <span class="text-xs text-gray-600">${formatDate(exec.executionDate)}</span>
                                                ${isMyArea ? `
                                                    <div class="flex gap-2">
                                                        <button onclick="openEditExecutionModal(${currentStudentId}, ${currentSemester.year}, ${currentSemester.semester}, ${week.week}, '${exec.executionId}')"
                                                                class="text-xs text-[#6A0028] hover:underline">수정</button>
                                                        <button onclick="deleteExecutionConfirm(${currentStudentId}, ${currentSemester.year}, ${currentSemester.semester}, ${week.week}, '${exec.executionId}')"
                                                                class="text-xs text-red-600 hover:underline">삭제</button>
                                                    </div>
                                                ` : ''}
                                            </div>
                                            <p class="text-sm text-gray-800 mb-1"><span class="font-medium">실행:</span> ${exec.executionContent}</p>
                                            <p class="text-sm text-gray-800"><span class="font-medium">의견:</span> ${exec.comment}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <p class="text-xs text-gray-500 italic">실적이 입력되지 않았습니다.</p>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ==================== 실적 추가 모달 ====================
function openAddExecutionModal(studentId, year, semester, week) {
    const currentProf = DataService.getCurrentProfessor();
    const plan = DataService.getSemesterGuidancePlan(studentId, year, semester);
    if (!plan) return;

    const weekPlan = plan.weeks.find(w => w.week === week);
    if (!weekPlan) return;

    const todayDate = getTodayDate();

    const modalContent = `
        <form id="add-execution-form" class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 class="font-semibold text-gray-800 mb-2">${week}주차 계획</h4>
                <p class="text-sm text-gray-700"><span class="font-medium">주제:</span> ${weekPlan.plannedTopic}</p>
                <p class="text-sm text-gray-700"><span class="font-medium">내용:</span> ${weekPlan.plannedContent}</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">실행일 *</label>
                <input type="date" name="executionDate" value="${todayDate}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                <select name="method" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="meeting">대면</option>
                    <option value="online">온라인</option>
                    <option value="zoom">Zoom</option>
                    <option value="email">이메일</option>
                    <option value="phone">전화</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">실행 내용 *</label>
                <textarea name="executionContent" rows="4" placeholder="실제로 지도한 내용을 상세히 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">교수 의견 *</label>
                <textarea name="comment" rows="3" placeholder="학생의 이해도, 진행 상황 등에 대한 의견을 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required></textarea>
            </div>
        </form>
    `;

    createModal(`${week}주차 실적 추가 - ${currentProf.name}`, modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '저장',
            className: 'btn-primary',
            onclick: `submitAddExecution(${studentId}, ${year}, ${semester}, ${week})`
        }
    ]);
}

function submitAddExecution(studentId, year, semester, week) {
    const form = document.getElementById('add-execution-form');
    const formData = new FormData(form);

    const currentProf = DataService.getCurrentProfessor();

    const executionData = {
        professorId: currentProf.id,
        professorName: currentProf.name,
        executionDate: formData.get('executionDate'),
        executionContent: formData.get('executionContent'),
        comment: formData.get('comment'),
        method: formData.get('method')
    };

    try {
        DataService.addExecution(studentId, year, semester, week, executionData);
        showToast(`${week}주차 실적이 추가되었습니다.`, 'success');

        // 상세 화면 새로고침
        setTimeout(() => {
            viewSemesterPlanDetail(year, semester);
        }, 300);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 실적 수정 모달
function openEditExecutionModal(studentId, year, semester, week, executionId) {
    const plan = DataService.getSemesterGuidancePlan(studentId, year, semester);
    const weekPlan = plan.weeks.find(w => w.week === week);
    const execution = weekPlan.executions.find(e => e.executionId === executionId);

    if (!execution) {
        showToast('실적을 찾을 수 없습니다.', 'error');
        return;
    }

    const modalContent = `
        <form id="edit-execution-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">실행일 *</label>
                <input type="date" name="executionDate" value="${execution.executionDate}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                <select name="method" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="meeting" ${execution.method === 'meeting' ? 'selected' : ''}>대면</option>
                    <option value="online" ${execution.method === 'online' ? 'selected' : ''}>온라인</option>
                    <option value="zoom" ${execution.method === 'zoom' ? 'selected' : ''}>Zoom</option>
                    <option value="email" ${execution.method === 'email' ? 'selected' : ''}>이메일</option>
                    <option value="phone" ${execution.method === 'phone' ? 'selected' : ''}>전화</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">실행 내용 *</label>
                <textarea name="executionContent" rows="4"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>${execution.executionContent}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">교수 의견 *</label>
                <textarea name="comment" rows="3"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>${execution.comment}</textarea>
            </div>
        </form>
    `;

    createModal(`${week}주차 실적 수정`, modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '저장',
            className: 'btn-primary',
            onclick: `submitEditExecution(${studentId}, ${year}, ${semester}, ${week}, '${executionId}')`
        }
    ]);
}

function submitEditExecution(studentId, year, semester, week, executionId) {
    const form = document.getElementById('edit-execution-form');
    const formData = new FormData(form);

    const executionData = {
        executionDate: formData.get('executionDate'),
        executionContent: formData.get('executionContent'),
        comment: formData.get('comment'),
        method: formData.get('method')
    };

    try {
        DataService.updateExecution(studentId, year, semester, week, executionId, executionData);
        showToast(`${week}주차 실적이 수정되었습니다.`, 'success');

        setTimeout(() => {
            viewSemesterPlanDetail(year, semester);
        }, 300);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 실적 삭제
function deleteExecutionConfirm(studentId, year, semester, week, executionId) {
    if (!confirm(`${week}주차 실적을 삭제하시겠습니까?`)) return;

    try {
        DataService.deleteExecution(studentId, year, semester, week, executionId);
        showToast(`${week}주차 실적이 삭제되었습니다.`, 'success');

        setTimeout(() => {
            viewSemesterPlanDetail(year, semester);
        }, 300);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== 유틸리티 ====================
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
}

function getMethodBadgeClass(method) {
    const classes = {
        'meeting': 'bg-green-100 text-green-700',
        'zoom': 'bg-purple-100 text-purple-700',
        'online': 'bg-[#FCE4EC] text-[#6A0028]',
        'email': 'bg-yellow-100 text-yellow-700',
        'phone': 'bg-pink-100 text-pink-700'
    };
    return classes[method] || 'bg-gray-100 text-gray-700';
}

function getMethodText(method) {
    const texts = {
        'meeting': '대면',
        'zoom': 'Zoom',
        'online': '온라인',
        'email': '이메일',
        'phone': '전화'
    };
    return texts[method] || method;
}

// Export
window.renderSemesterPlansSummary = renderSemesterPlansSummary;
window.renderSemesterPlanButtonText = renderSemesterPlanButtonText;
window.openSemesterPlanEditor = openSemesterPlanEditor;
window.saveSemesterPlan = saveSemesterPlan;
window.viewSemesterPlanDetail = viewSemesterPlanDetail;
window.toggleWeekAccordion = toggleWeekAccordion;
window.toggleAllWeeks = toggleAllWeeks;
window.openAddExecutionModal = openAddExecutionModal;
window.submitAddExecution = submitAddExecution;
window.openEditExecutionModal = openEditExecutionModal;
window.submitEditExecution = submitEditExecution;
window.deleteExecutionConfirm = deleteExecutionConfirm;

console.log('✅ 학기별 논문지도 계획 모듈 로드 완료');
