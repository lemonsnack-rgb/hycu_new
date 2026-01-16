// 업무일정등록 관리 화면

// 현재 활성 탭 ('processPhase' | 'admin')
let currentScheduleTab = 'processPhase';

// 뷰 상태 관리
let processPhaseView = 'list'; // 'list' | 'form'
let adminWorkView = 'list'; // 'list' | 'form'
let processPhaseFormMode = null; // null | 'create' | 'edit'
let adminWorkFormMode = null; // null | 'create' | 'edit'
let currentProcessPhaseScheduleId = null;
let currentAdminWorkScheduleId = null;

/**
 * 업무일정등록 화면 초기화
 */
function initWorkScheduleManagement() {
    console.log('✅ 업무일정등록 화면 초기화');
    currentScheduleTab = 'processPhase';
    renderWorkScheduleManagement();
}

/**
 * 메인 화면 렌더링
 */
function renderWorkScheduleManagement() {
    const container = document.getElementById('work-schedule-management-content');
    if (!container) return;

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 탭 헤더 -->
            <div class="border-b">
                <div class="flex">
                    <button id="tab-processPhase"
                            onclick="switchScheduleTab('processPhase')"
                            class="px-6 py-3 text-sm font-semibold ${currentScheduleTab === 'processPhase' ? 'text-[#6A0028] border-b-2 border-[#6A0028]' : 'text-gray-500 hover:text-gray-700'}">
                        심사/제출/신청 일정
                    </button>
                    <button id="tab-admin"
                            onclick="switchScheduleTab('admin')"
                            class="px-6 py-3 text-sm font-semibold ${currentScheduleTab === 'admin' ? 'text-[#6A0028] border-b-2 border-[#6A0028]' : 'text-gray-500 hover:text-gray-700'}">
                        관리자 업무 일정
                    </button>
                </div>
            </div>

            <!-- 탭 컨텐츠 -->
            <div id="schedule-tab-content"></div>
        </div>
    `;

    container.innerHTML = html;
    renderCurrentTab();
}

/**
 * 탭 전환
 */
function switchScheduleTab(tabName) {
    currentScheduleTab = tabName;

    // 탭 버튼 활성화 상태 업데이트
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.className = btn.id === `tab-${tabName}`
            ? 'px-6 py-3 text-sm font-semibold text-[#6A0028] border-b-2 border-[#6A0028]'
            : 'px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700';
    });

    renderCurrentTab();
}

/**
 * 현재 탭 렌더링
 */
function renderCurrentTab() {
    if (currentScheduleTab === 'processPhase') {
        renderProcessPhaseTab();
    } else {
        renderAdminWorkTab();
    }
}

/**
 * Tab 1: 심사/제출/신청 일정 탭 렌더링
 */
function renderProcessPhaseTab() {
    if (processPhaseView === 'list') {
        renderProcessPhaseScheduleList();
    } else if (processPhaseView === 'form') {
        renderProcessPhaseFormPage();
    }
}

/**
 * Tab 2: 관리자 업무 일정 탭 렌더링
 */
function renderAdminWorkTab() {
    if (adminWorkView === 'list') {
        renderAdminWorkScheduleList();
    } else if (adminWorkView === 'form') {
        renderAdminWorkFormPage();
    }
}

/**
 * Tab 1: 심사/제출/신청 일정 목록 렌더링
 */
function renderProcessPhaseScheduleList() {
    const tabContent = document.getElementById('schedule-tab-content');
    if (!tabContent) return;

    // processPhase 유형의 일정만 필터링
    const schedules = window.mockWorkSchedules.filter(s => s.scheduleType === 'processPhase');

    const html = `
        <div class="table-container">
            <!-- 테이블 헤더 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">심사/제출/신청 일정</h3>
                    <span class="table-count">(총 ${schedules.length}건)</span>
                </div>
                <div class="table-header-right">
                    <button onclick="showProcessPhaseForm('create')"
                            class="px-4 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                        일정 등록
                    </button>
                </div>
            </div>

            <!-- 테이블 -->
            <div class="table-scroll">
                <table class="min-w-full table-fixed">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">순번</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600" style="width: 150px;">심사유형</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">일정구분</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">기간유형</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학년도</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학기</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">시작일시</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">종료일시</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">상태</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${schedules.length === 0 ? `
                            <tr>
                                <td colspan="9" class="py-8 text-center text-gray-500">
                                    등록된 일정이 없습니다.
                                </td>
                            </tr>
                        ` : schedules.map((schedule, index) => `
                            <tr class="hover:bg-blue-50 cursor-pointer" onclick="showProcessPhaseForm('edit', '${schedule.id}')">
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${index + 1}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${schedule.examTypeName || '-'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${getProcessPhaseText(schedule.processPhase)}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${getActionTypeText(schedule.actionType)}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.year}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.semester}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.startDateTime}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.endDateTime}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${getScheduleStatus(schedule)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    tabContent.innerHTML = html;
}

/**
 * Tab 2: 관리자 업무 일정 목록 렌더링
 */
function renderAdminWorkScheduleList() {
    const tabContent = document.getElementById('schedule-tab-content');
    if (!tabContent) return;

    // admin 유형의 일정만 필터링
    const schedules = window.mockWorkSchedules.filter(s => s.scheduleType === 'admin');

    const html = `
        <div class="table-container">
            <!-- 테이블 헤더 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">관리자 업무 일정</h3>
                    <span class="table-count">(총 ${schedules.length}건)</span>
                </div>
                <div class="table-header-right">
                    <button onclick="showAdminWorkForm('create')"
                            class="px-4 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                        일정 등록
                    </button>
                </div>
            </div>

            <!-- 테이블 -->
            <div class="table-scroll">
                <table class="min-w-full table-fixed">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">순번</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">업무명</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학년도</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학기</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">시작일시</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">종료일시</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">상태</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${schedules.length === 0 ? `
                            <tr>
                                <td colspan="7" class="py-8 text-center text-gray-500">
                                    등록된 일정이 없습니다.
                                </td>
                            </tr>
                        ` : schedules.map((schedule, index) => `
                            <tr class="hover:bg-blue-50 cursor-pointer" onclick="showAdminWorkForm('edit', '${schedule.id}')">
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${index + 1}</td>
                                <td class="py-3 px-4 text-sm text-gray-800">${schedule.workName || '-'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.year}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.semester}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.startDateTime}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.endDateTime}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${getScheduleStatus(schedule)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    tabContent.innerHTML = html;
}

/**
 * processPhase 텍스트 변환
 */
function getProcessPhaseText(phase) {
    const phaseMap = {
        'application': '신청',
        'submission': '제출',
        'review': '심사'
    };
    return phaseMap[phase] || '-';
}

/**
 * actionType 텍스트 변환 (기간유형)
 */
function getActionTypeText(actionType) {
    const actionMap = {
        'register': '등록',
        'withdraw': '철회'
    };
    return actionMap[actionType] || '-';
}

/**
 * Tab 1: 심사/제출/신청 일정 폼 화면으로 전환
 */
function showProcessPhaseForm(mode, scheduleId = null) {
    processPhaseView = 'form';
    processPhaseFormMode = mode;
    currentProcessPhaseScheduleId = scheduleId;
    renderProcessPhaseTab();
}

/**
 * Tab 1: 목록으로 돌아가기
 */
function backToProcessPhaseList() {
    processPhaseView = 'list';
    processPhaseFormMode = null;
    currentProcessPhaseScheduleId = null;
    renderProcessPhaseTab();
}

/**
 * Tab 1: 심사/제출/신청 일정 폼 페이지 렌더링
 */
function renderProcessPhaseFormPage() {
    const tabContent = document.getElementById('schedule-tab-content');
    if (!tabContent) return;

    const isEdit = processPhaseFormMode === 'edit';
    const schedule = isEdit ? window.mockWorkSchedules.find(s => s.id === currentProcessPhaseScheduleId) : null;

    const html = `
        <!-- 목록으로 돌아가기 버튼 -->
        <div class="p-4">
            <button onclick="backToProcessPhaseList()"
                    class="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                목록으로 돌아가기
            </button>
        </div>

        <!-- 폼 페이지 -->
        <div class="p-6">
            <div class="bg-white rounded-lg shadow-md">
                <!-- 페이지 바디 -->
                <div class="p-6 space-y-4">
                    <form id="schedule-form" onsubmit="saveProcessPhaseSchedule(event, ${isEdit ? `'${currentProcessPhaseScheduleId}'` : 'null'})">
                        <!-- 심사유형 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                심사유형 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="논문 작성 계획서" required
                                           ${schedule && schedule.examTypeName === '논문 작성 계획서' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>논문 작성 계획서</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="중간논문" required
                                           ${schedule && schedule.examTypeName === '중간논문' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>중간논문</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="최종논문" required
                                           ${schedule && schedule.examTypeName === '최종논문' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>최종논문</span>
                                </label>
                            </div>
                        </div>

                        <!-- 일정구분 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                일정구분 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="application" required
                                           ${schedule && schedule.processPhase === 'application' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>신청</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="submission" required
                                           ${schedule && schedule.processPhase === 'submission' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>제출</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="review" required
                                           ${schedule && schedule.processPhase === 'review' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>심사</span>
                                </label>
                            </div>
                        </div>

                        <!-- 기간유형 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                기간유형 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-action-type" value="register" required
                                           ${schedule && schedule.actionType === 'register' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>등록</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-action-type" value="withdraw" required
                                           ${schedule && schedule.actionType === 'withdraw' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>철회</span>
                                </label>
                            </div>
                        </div>

                        <!-- 학년도 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학년도 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-year" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="2025" ${!schedule || schedule.year === '2025' ? 'selected' : ''}>2025</option>
                                <option value="2024" ${schedule && schedule.year === '2024' ? 'selected' : ''}>2024</option>
                                <option value="2023" ${schedule && schedule.year === '2023' ? 'selected' : ''}>2023</option>
                                <option value="2022" ${schedule && schedule.year === '2022' ? 'selected' : ''}>2022</option>
                            </select>
                        </div>

                        <!-- 학기 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학기 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-semester" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1" ${schedule && schedule.semester === '1' ? 'selected' : ''}>1학기</option>
                                <option value="2" ${schedule && schedule.semester === '2' ? 'selected' : ''}>2학기</option>
                            </select>
                        </div>

                        <!-- 시작일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                시작일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-start" required
                                   value="${schedule ? schedule.startDateTime.replace(' ', 'T') : ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 종료일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                종료일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-end" required
                                   value="${schedule ? schedule.endDateTime.replace(' ', 'T') : ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </form>
                </div>

                <!-- 페이지 푸터 -->
                <div class="flex ${isEdit ? 'justify-between' : 'justify-end'} items-center gap-3 p-6 border-t bg-gray-50">
                    ${isEdit ? `
                        <button type="button" onclick="deleteSchedule('${currentProcessPhaseScheduleId}')"
                                class="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm">
                            삭제
                        </button>
                    ` : ''}
                    <div class="flex gap-3">
                        <button type="button" onclick="backToProcessPhaseList()"
                                class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                            취소
                        </button>
                        <button type="submit" form="schedule-form"
                                class="px-6 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                            ${isEdit ? '수정' : '등록'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    tabContent.innerHTML = html;
}

/**
 * 일정 상태 계산 (예정/진행중/종료)
 */
function getScheduleStatus(schedule) {
    const now = new Date();
    const start = new Date(schedule.startDateTime.replace(' ', 'T'));
    const end = new Date(schedule.endDateTime.replace(' ', 'T'));

    if (now < start) {
        return '예정';
    } else if (now >= start && now <= end) {
        return '진행중';
    } else {
        return '종료';
    }
}

/**
 * Tab 2: 관리자 업무 일정 폼 화면으로 전환
 */
function showAdminWorkForm(mode, scheduleId = null) {
    adminWorkView = 'form';
    adminWorkFormMode = mode;
    currentAdminWorkScheduleId = scheduleId;
    renderAdminWorkTab();
}

/**
 * Tab 2: 목록으로 돌아가기
 */
function backToAdminWorkList() {
    adminWorkView = 'list';
    adminWorkFormMode = null;
    currentAdminWorkScheduleId = null;
    renderAdminWorkTab();
}

/**
 * Tab 2: 관리자 업무 일정 폼 페이지 렌더링
 */
function renderAdminWorkFormPage() {
    const tabContent = document.getElementById('schedule-tab-content');
    if (!tabContent) return;

    const isEdit = adminWorkFormMode === 'edit';
    const schedule = isEdit ? window.mockWorkSchedules.find(s => s.id === currentAdminWorkScheduleId) : null;

    const html = `
        <!-- 목록으로 돌아가기 버튼 -->
        <div class="p-4">
            <button onclick="backToAdminWorkList()"
                    class="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                목록으로 돌아가기
            </button>
        </div>

        <!-- 폼 페이지 -->
        <div class="p-6">
            <div class="bg-white rounded-lg shadow-md">
                <!-- 페이지 바디 -->
                <div class="p-6 space-y-4">
                    <form id="schedule-form" onsubmit="saveAdminWorkSchedule(event, ${isEdit ? `'${currentAdminWorkScheduleId}'` : 'null'})">
                        <!-- 업무 유형 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                업무 유형 <span class="text-red-600">*</span>
                            </label>
                            ${isEdit ? `
                                <input type="text" value="${schedule.workName}" readonly
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                <input type="hidden" id="schedule-work-type" value="${schedule.workType}">
                            ` : `
                                <select id="schedule-work-type" required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">선택하세요</option>
                                    ${window.mockAdminWorkTypes.map(wt => `
                                        <option value="${wt.code}" data-work-name="${wt.name}">
                                            ${wt.name}
                                        </option>
                                    `).join('')}
                                </select>
                            `}
                        </div>

                        <!-- 학년도 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학년도 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-year" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="2025" ${!schedule || schedule.year === '2025' ? 'selected' : ''}>2025</option>
                                <option value="2024" ${schedule && schedule.year === '2024' ? 'selected' : ''}>2024</option>
                                <option value="2023" ${schedule && schedule.year === '2023' ? 'selected' : ''}>2023</option>
                                <option value="2022" ${schedule && schedule.year === '2022' ? 'selected' : ''}>2022</option>
                            </select>
                        </div>

                        <!-- 학기 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학기 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-semester" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1" ${schedule && schedule.semester === '1' ? 'selected' : ''}>1학기</option>
                                <option value="2" ${schedule && schedule.semester === '2' ? 'selected' : ''}>2학기</option>
                            </select>
                        </div>

                        <!-- 시작일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                시작일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-start" required
                                   value="${schedule ? schedule.startDateTime.replace(' ', 'T') : ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 종료일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                종료일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-end" required
                                   value="${schedule ? schedule.endDateTime.replace(' ', 'T') : ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </form>
                </div>

                <!-- 페이지 푸터 -->
                <div class="flex ${isEdit ? 'justify-between' : 'justify-end'} items-center gap-3 p-6 border-t bg-gray-50">
                    ${isEdit ? `
                        <button type="button" onclick="deleteSchedule('${currentAdminWorkScheduleId}')"
                                class="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm">
                            삭제
                        </button>
                    ` : ''}
                    <div class="flex gap-3">
                        <button type="button" onclick="backToAdminWorkList()"
                                class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                            취소
                        </button>
                        <button type="submit" form="schedule-form"
                                class="px-6 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                            ${isEdit ? '수정' : '등록'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    tabContent.innerHTML = html;
}

/**
 * Tab 1: 심사/제출/신청 일정 모달 열기
 */
function openProcessPhaseModal(scheduleId = null) {
    const isEdit = !!scheduleId;
    const schedule = isEdit ? window.mockWorkSchedules.find(s => s.id === scheduleId) : null;

    const modalHtml = `
        <div id="schedule-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeScheduleModal(event)">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <!-- 모달 헤더 -->
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-bold text-gray-900">${isEdit ? '심사/제출/신청 일정 수정' : '심사/제출/신청 일정 등록'}</h3>
                    <button onclick="closeScheduleModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- 모달 바디 -->
                <div class="overflow-y-auto p-6 space-y-4" style="max-height: calc(90vh - 180px);">
                    <form id="schedule-form" onsubmit="saveProcessPhaseSchedule(event, ${isEdit ? `'${scheduleId}'` : 'null'})">
                        <!-- 심사유형 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                심사유형 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="논문 작성 계획서" required
                                           ${schedule && schedule.examTypeName === '논문 작성 계획서' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>논문 작성 계획서</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="중간논문" required
                                           ${schedule && schedule.examTypeName === '중간논문' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>중간논문</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="최종논문" required
                                           ${schedule && schedule.examTypeName === '최종논문' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>최종논문</span>
                                </label>
                            </div>
                        </div>

                        <!-- 일정구분 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                일정구분 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="application" required
                                           ${schedule && schedule.processPhase === 'application' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>신청</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="submission" required
                                           ${schedule && schedule.processPhase === 'submission' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>제출</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="review" required
                                           ${schedule && schedule.processPhase === 'review' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>심사</span>
                                </label>
                            </div>
                        </div>

                        <!-- 기간유형 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                기간유형 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-action-type" value="register" required
                                           ${schedule && schedule.actionType === 'register' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>등록</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-action-type" value="withdraw" required
                                           ${schedule && schedule.actionType === 'withdraw' ? 'checked' : ''}
                                           ${isEdit ? 'disabled' : ''}
                                           class="mr-2">
                                    <span>철회</span>
                                </label>
                            </div>
                        </div>

                        <!-- 학년도 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학년도 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-year" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="2025" ${!schedule || schedule.year === '2025' ? 'selected' : ''}>2025</option>
                                <option value="2024" ${schedule && schedule.year === '2024' ? 'selected' : ''}>2024</option>
                                <option value="2023" ${schedule && schedule.year === '2023' ? 'selected' : ''}>2023</option>
                                <option value="2022" ${schedule && schedule.year === '2022' ? 'selected' : ''}>2022</option>
                            </select>
                        </div>

                        <!-- 학기 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학기 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-semester" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1" ${schedule && schedule.semester === '1' ? 'selected' : ''}>1학기</option>
                                <option value="2" ${schedule && schedule.semester === '2' ? 'selected' : ''}>2학기</option>
                            </select>
                        </div>

                        <!-- 시작일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                시작일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-start" required
                                   value="${schedule ? schedule.startDateTime.replace(' ', 'T') : ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 종료일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                종료일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-end" required
                                   value="${schedule ? schedule.endDateTime.replace(' ', 'T') : ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </form>
                </div>

                <!-- 모달 푸터 -->
                <div class="flex justify-end items-center gap-3 p-6 border-t bg-gray-50">
                    <button type="button" onclick="closeScheduleModal()"
                            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                        취소
                    </button>
                    <button type="submit" form="schedule-form"
                            class="px-6 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                        ${isEdit ? '수정' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * Tab 2: 관리자 업무 일정 모달 열기
 */
function openAdminWorkModal(scheduleId = null) {
    const isEdit = !!scheduleId;
    const schedule = isEdit ? window.mockWorkSchedules.find(s => s.id === scheduleId) : null;

    const modalHtml = `
        <div id="schedule-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeScheduleModal(event)">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <!-- 모달 헤더 -->
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-bold text-gray-900">${isEdit ? '관리자 업무 일정 수정' : '관리자 업무 일정 등록'}</h3>
                    <button onclick="closeScheduleModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- 모달 바디 -->
                <div class="overflow-y-auto p-6 space-y-4" style="max-height: calc(90vh - 180px);">
                    <form id="schedule-form" onsubmit="saveAdminWorkSchedule(event, ${isEdit ? `'${scheduleId}'` : 'null'})">
                        <!-- 업무 유형 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                업무 유형 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-work-type" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ${isEdit ? 'disabled' : ''}>
                                <option value="">선택하세요</option>
                                ${window.mockAdminWorkTypes.map(wt => `
                                    <option value="${wt.code}"
                                            data-work-name="${wt.name}"
                                            ${schedule && schedule.workType === wt.code ? 'selected' : ''}>
                                        ${wt.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- 학년도 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학년도 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-year" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="2025" ${!schedule || schedule.year === '2025' ? 'selected' : ''}>2025</option>
                                <option value="2024" ${schedule && schedule.year === '2024' ? 'selected' : ''}>2024</option>
                                <option value="2023" ${schedule && schedule.year === '2023' ? 'selected' : ''}>2023</option>
                                <option value="2022" ${schedule && schedule.year === '2022' ? 'selected' : ''}>2022</option>
                            </select>
                        </div>

                        <!-- 학기 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학기 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-semester" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1" ${schedule && schedule.semester === '1' ? 'selected' : ''}>1학기</option>
                                <option value="2" ${schedule && schedule.semester === '2' ? 'selected' : ''}>2학기</option>
                            </select>
                        </div>

                        <!-- 시작일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                시작일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-start" required
                                   value="${schedule ? schedule.startDateTime.replace(' ', 'T') : ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 종료일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                종료일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-end" required
                                   value="${schedule ? schedule.endDateTime.replace(' ', 'T') : ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </form>
                </div>

                <!-- 모달 푸터 -->
                <div class="flex justify-end items-center gap-3 p-6 border-t bg-gray-50">
                    <button type="button" onclick="closeScheduleModal()"
                            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                        취소
                    </button>
                    <button type="submit" form="schedule-form"
                            class="px-6 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                        ${isEdit ? '수정' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * 모달 닫기
 */
function closeScheduleModal(event) {
    if (event && event.target.id !== 'schedule-modal') {
        return;
    }

    const modal = document.getElementById('schedule-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Tab 1: 심사/제출/신청 일정 상세 모달 열기 (조회 + 수정 + 삭제)
 */
function openProcessPhaseDetailModal(scheduleId) {
    const schedule = window.mockWorkSchedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    const modalHtml = `
        <div id="schedule-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeScheduleModal(event)">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <!-- 모달 헤더 -->
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-bold text-gray-900">심사/제출/신청 일정 상세</h3>
                    <button onclick="closeScheduleModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- 모달 바디 -->
                <div class="overflow-y-auto p-6 space-y-4" style="max-height: calc(90vh - 180px);">
                    <form id="schedule-form" onsubmit="saveProcessPhaseSchedule(event, '${scheduleId}')">
                        <!-- 심사유형 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                심사유형 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="논문 작성 계획서" required
                                           ${schedule.examTypeName === '논문 작성 계획서' ? 'checked' : ''} disabled
                                           class="mr-2">
                                    <span>논문 작성 계획서</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="중간논문" required
                                           ${schedule.examTypeName === '중간논문' ? 'checked' : ''} disabled
                                           class="mr-2">
                                    <span>중간논문</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-exam-type" value="최종논문" required
                                           ${schedule.examTypeName === '최종논문' ? 'checked' : ''} disabled
                                           class="mr-2">
                                    <span>최종논문</span>
                                </label>
                            </div>
                        </div>

                        <!-- 일정구분 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                일정구분 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="application" required
                                           ${schedule.processPhase === 'application' ? 'checked' : ''} disabled
                                           class="mr-2">
                                    <span>신청</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="submission" required
                                           ${schedule.processPhase === 'submission' ? 'checked' : ''} disabled
                                           class="mr-2">
                                    <span>제출</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-process-phase" value="review" required
                                           ${schedule.processPhase === 'review' ? 'checked' : ''} disabled
                                           class="mr-2">
                                    <span>심사</span>
                                </label>
                            </div>
                        </div>

                        <!-- 기간유형 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                기간유형 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-action-type" value="register" required
                                           ${schedule.actionType === 'register' ? 'checked' : ''} disabled
                                           class="mr-2">
                                    <span>등록</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="schedule-action-type" value="withdraw" required
                                           ${schedule.actionType === 'withdraw' ? 'checked' : ''} disabled
                                           class="mr-2">
                                    <span>철회</span>
                                </label>
                            </div>
                        </div>

                        <!-- 학년도 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학년도 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-year" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="2025" ${schedule.year === '2025' ? 'selected' : ''}>2025</option>
                                <option value="2024" ${schedule.year === '2024' ? 'selected' : ''}>2024</option>
                                <option value="2023" ${schedule.year === '2023' ? 'selected' : ''}>2023</option>
                                <option value="2022" ${schedule.year === '2022' ? 'selected' : ''}>2022</option>
                            </select>
                        </div>

                        <!-- 학기 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학기 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-semester" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1" ${schedule.semester === '1' ? 'selected' : ''}>1학기</option>
                                <option value="2" ${schedule.semester === '2' ? 'selected' : ''}>2학기</option>
                            </select>
                        </div>

                        <!-- 시작일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                시작일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-start" required
                                   value="${schedule.startDateTime.replace(' ', 'T')}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 종료일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                종료일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-end" required
                                   value="${schedule.endDateTime.replace(' ', 'T')}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </form>
                </div>

                <!-- 모달 푸터 -->
                <div class="flex justify-between items-center gap-3 p-6 border-t bg-gray-50">
                    <button type="button" onclick="deleteSchedule('${scheduleId}')"
                            class="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm">
                        삭제
                    </button>
                    <div class="flex gap-3">
                        <button type="button" onclick="closeScheduleModal()"
                                class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                            취소
                        </button>
                        <button type="submit" form="schedule-form"
                                class="px-6 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * Tab 1: 심사/제출/신청 일정 저장
 */
function saveProcessPhaseSchedule(event, scheduleId) {
    event.preventDefault();

    const examTypeName = document.querySelector('input[name="schedule-exam-type"]:checked')?.value;
    const processPhase = document.querySelector('input[name="schedule-process-phase"]:checked')?.value;
    const actionType = document.querySelector('input[name="schedule-action-type"]:checked')?.value;
    const year = document.getElementById('schedule-year').value;
    const semester = document.getElementById('schedule-semester').value;
    const startDateTime = document.getElementById('schedule-start').value.replace('T', ' ');
    const endDateTime = document.getElementById('schedule-end').value.replace('T', ' ');

    // 유효성 검사
    if (!examTypeName || !processPhase || !actionType || !year || !semester || !startDateTime || !endDateTime) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }

    // 날짜 유효성 검사
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (start >= end) {
        alert('종료일시는 시작일시보다 이후여야 합니다.');
        return;
    }

    // 지도단계명 생성 (심사유형 + 일정구분 + 기간유형)
    const phaseTextMap = {
        'application': '신청',
        'submission': '제출',
        'review': '심사'
    };
    const actionTextMap = {
        'register': '',
        'withdraw': '철회'
    };
    const stageName = `${examTypeName} ${phaseTextMap[processPhase]}${actionTextMap[actionType] ? ' ' + actionTextMap[actionType] : ''}`;

    if (scheduleId) {
        // 수정
        const schedule = window.mockWorkSchedules.find(s => s.id === scheduleId);
        if (schedule) {
            schedule.year = year;
            schedule.semester = semester;
            schedule.startDateTime = startDateTime;
            schedule.endDateTime = endDateTime;

            console.log('일정 수정:', schedule);
            alert('일정이 수정되었습니다.');
        }
    } else {
        // 신규 등록
        const newId = 'WS' + String(window.mockWorkSchedules.length + 1).padStart(3, '0');
        const newSchedule = {
            id: newId,
            scheduleType: 'processPhase',
            stageTypeId: null,  // 지도단계 유형과 연결하지 않음
            stageName: stageName,
            processPhase: processPhase,
            actionType: actionType,
            examTypeName: examTypeName,
            year: year,
            semester: semester,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            description: null,
            createdDate: new Date().toISOString().split('T')[0],
            createdBy: 'admin'
        };

        window.mockWorkSchedules.push(newSchedule);
        console.log('일정 등록:', newSchedule);
        alert('일정이 등록되었습니다.');
    }

    backToProcessPhaseList();
}

/**
 * Tab 2: 관리자 업무 일정 상세 모달 열기 (조회 + 수정 + 삭제)
 */
function openAdminWorkDetailModal(scheduleId) {
    const schedule = window.mockWorkSchedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    const modalHtml = `
        <div id="schedule-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeScheduleModal(event)">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <!-- 모달 헤더 -->
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-bold text-gray-900">관리자 업무 일정 상세</h3>
                    <button onclick="closeScheduleModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- 모달 바디 -->
                <div class="overflow-y-auto p-6 space-y-4" style="max-height: calc(90vh - 180px);">
                    <form id="schedule-form" onsubmit="saveAdminWorkSchedule(event, '${scheduleId}')">
                        <!-- 업무유형 (읽기전용) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                업무유형 <span class="text-red-600">*</span>
                            </label>
                            <input type="text" value="${schedule.workName}" readonly
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                            <input type="hidden" id="schedule-work-type" value="${schedule.workType}">
                        </div>

                        <!-- 학년도 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학년도 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-year" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="2025" ${schedule.year === '2025' ? 'selected' : ''}>2025</option>
                                <option value="2024" ${schedule.year === '2024' ? 'selected' : ''}>2024</option>
                                <option value="2023" ${schedule.year === '2023' ? 'selected' : ''}>2023</option>
                                <option value="2022" ${schedule.year === '2022' ? 'selected' : ''}>2022</option>
                            </select>
                        </div>

                        <!-- 학기 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학기 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-semester" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1" ${schedule.semester === '1' ? 'selected' : ''}>1학기</option>
                                <option value="2" ${schedule.semester === '2' ? 'selected' : ''}>2학기</option>
                            </select>
                        </div>

                        <!-- 시작일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                시작일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-start" required
                                   value="${schedule.startDateTime.replace(' ', 'T')}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 종료일시 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                종료일시 <span class="text-red-600">*</span>
                            </label>
                            <input type="datetime-local" id="schedule-end" required
                                   value="${schedule.endDateTime.replace(' ', 'T')}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </form>
                </div>

                <!-- 모달 푸터 -->
                <div class="flex justify-between items-center gap-3 p-6 border-t bg-gray-50">
                    <button type="button" onclick="deleteSchedule('${scheduleId}')"
                            class="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm">
                        삭제
                    </button>
                    <div class="flex gap-3">
                        <button type="button" onclick="closeScheduleModal()"
                                class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                            취소
                        </button>
                        <button type="submit" form="schedule-form"
                                class="px-6 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * Tab 2: 관리자 업무 일정 저장
 */
function saveAdminWorkSchedule(event, scheduleId) {
    event.preventDefault();

    const workTypeInput = document.getElementById('schedule-work-type');
    const workType = workTypeInput.value;

    // scheduleId가 있으면 수정 모드이므로 기존 schedule에서 workName 가져오기
    let workName = '';
    if (scheduleId) {
        const existingSchedule = window.mockWorkSchedules.find(s => s.id === scheduleId);
        workName = existingSchedule ? existingSchedule.workName : '';
    } else {
        // 신규 등록 모드일 때는 select에서 가져오기
        const workTypeSelect = document.getElementById('schedule-work-type');
        const selectedOption = workTypeSelect.options[workTypeSelect.selectedIndex];
        workName = selectedOption.dataset.workName;
    }

    const year = document.getElementById('schedule-year').value;
    const semester = document.getElementById('schedule-semester').value;
    const startDateTime = document.getElementById('schedule-start').value.replace('T', ' ');
    const endDateTime = document.getElementById('schedule-end').value.replace('T', ' ');

    // 유효성 검사
    if (!workType || !year || !semester || !startDateTime || !endDateTime) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }

    // 날짜 유효성 검사
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (start >= end) {
        alert('종료일시는 시작일시보다 이후여야 합니다.');
        return;
    }

    if (scheduleId) {
        // 수정
        const schedule = window.mockWorkSchedules.find(s => s.id === scheduleId);
        if (schedule) {
            schedule.year = year;
            schedule.semester = semester;
            schedule.startDateTime = startDateTime;
            schedule.endDateTime = endDateTime;

            console.log('일정 수정:', schedule);
            alert('일정이 수정되었습니다.');
        }
    } else {
        // 신규 등록
        const newId = 'WS' + String(window.mockWorkSchedules.length + 1).padStart(3, '0');
        const newSchedule = {
            id: newId,
            scheduleType: 'admin',
            workType: workType,
            workName: workName,
            year: year,
            semester: semester,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            description: null,
            createdDate: new Date().toISOString().split('T')[0],
            createdBy: 'admin'
        };

        window.mockWorkSchedules.push(newSchedule);
        console.log('일정 등록:', newSchedule);
        alert('일정이 등록되었습니다.');
    }

    backToAdminWorkList();
}

/**
 * 일정 삭제
 */
function deleteSchedule(scheduleId) {
    if (!confirm('이 일정을 삭제하시겠습니까?')) {
        return;
    }

    const index = window.mockWorkSchedules.findIndex(s => s.id === scheduleId);
    if (index > -1) {
        const schedule = window.mockWorkSchedules[index];
        window.mockWorkSchedules.splice(index, 1);
        console.log('일정 삭제:', scheduleId);
        alert('일정이 삭제되었습니다.');

        // 목록으로 돌아가기
        if (schedule.scheduleType === 'processPhase') {
            backToProcessPhaseList();
        } else {
            backToAdminWorkList();
        }
    }
}

// 전역으로 노출
window.initWorkScheduleManagement = initWorkScheduleManagement;
window.renderWorkScheduleManagement = renderWorkScheduleManagement;
window.switchScheduleTab = switchScheduleTab;
window.showProcessPhaseForm = showProcessPhaseForm;
window.backToProcessPhaseList = backToProcessPhaseList;
window.showAdminWorkForm = showAdminWorkForm;
window.backToAdminWorkList = backToAdminWorkList;
window.saveProcessPhaseSchedule = saveProcessPhaseSchedule;
window.saveAdminWorkSchedule = saveAdminWorkSchedule;
window.deleteSchedule = deleteSchedule;

console.log('✅ work-schedule-management.js 로드 완료');
