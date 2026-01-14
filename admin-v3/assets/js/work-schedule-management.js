// 업무일정등록 관리 화면

// 현재 활성 탭 ('processPhase' | 'admin')
let currentScheduleTab = 'processPhase';

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
        renderProcessPhaseScheduleList();
    } else {
        renderAdminWorkScheduleList();
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
                    <button onclick="openProcessPhaseModal()"
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
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600" style="width: 150px;">지도단계명</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600" style="width: 150px;">심사유형</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">일정구분</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학년도</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학기</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">시작일시</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">종료일시</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">상태</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">관리</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${schedules.length === 0 ? `
                            <tr>
                                <td colspan="10" class="py-8 text-center text-gray-500">
                                    등록된 일정이 없습니다.
                                </td>
                            </tr>
                        ` : schedules.map((schedule, index) => `
                            <tr class="hover:bg-blue-50">
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${index + 1}</td>
                                <td class="py-3 px-4 text-sm text-gray-800">${schedule.stageName || '-'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${schedule.examTypeName || '-'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${getProcessPhaseText(schedule.processPhase)}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.year}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.semester}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.startDateTime}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.endDateTime}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${getScheduleStatus(schedule)}</td>
                                <td class="py-3 px-4 text-center">
                                    <div class="flex gap-2 justify-center">
                                        <button onclick="openProcessPhaseModal('${schedule.id}')"
                                                class="text-[#6A0028] hover:underline text-xs font-medium">
                                            수정
                                        </button>
                                        <button onclick="deleteSchedule('${schedule.id}')"
                                                class="text-red-600 hover:underline text-xs font-medium">
                                            삭제
                                        </button>
                                    </div>
                                </td>
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
                    <button onclick="openAdminWorkModal()"
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
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">관리</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${schedules.length === 0 ? `
                            <tr>
                                <td colspan="8" class="py-8 text-center text-gray-500">
                                    등록된 일정이 없습니다.
                                </td>
                            </tr>
                        ` : schedules.map((schedule, index) => `
                            <tr class="hover:bg-blue-50">
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${index + 1}</td>
                                <td class="py-3 px-4 text-sm text-gray-800">${schedule.workName || '-'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.year}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.semester}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.startDateTime}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.endDateTime}</td>
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${getScheduleStatus(schedule)}</td>
                                <td class="py-3 px-4 text-center">
                                    <div class="flex gap-2 justify-center">
                                        <button onclick="openAdminWorkModal('${schedule.id}')"
                                                class="text-[#6A0028] hover:underline text-xs font-medium">
                                            수정
                                        </button>
                                        <button onclick="deleteSchedule('${schedule.id}')"
                                                class="text-red-600 hover:underline text-xs font-medium">
                                            삭제
                                        </button>
                                    </div>
                                </td>
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
                            <select id="schedule-exam-type" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ${isEdit ? 'disabled' : ''}>
                                <option value="">선택하세요</option>
                                <option value="논문 작성 계획서" ${schedule && schedule.examTypeName === '논문 작성 계획서' ? 'selected' : ''}>논문 작성 계획서</option>
                                <option value="중간논문" ${schedule && schedule.examTypeName === '중간논문' ? 'selected' : ''}>중간논문</option>
                                <option value="최종논문" ${schedule && schedule.examTypeName === '최종논문' ? 'selected' : ''}>최종논문</option>
                            </select>
                        </div>

                        <!-- 일정구분 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                일정구분 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-process-phase" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ${isEdit ? 'disabled' : ''}>
                                <option value="">선택하세요</option>
                                <option value="application" ${schedule && schedule.processPhase === 'application' ? 'selected' : ''}>신청</option>
                                <option value="submission" ${schedule && schedule.processPhase === 'submission' ? 'selected' : ''}>제출</option>
                                <option value="review" ${schedule && schedule.processPhase === 'review' ? 'selected' : ''}>심사</option>
                            </select>
                        </div>

                        <!-- 학년도 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                학년도 <span class="text-red-600">*</span>
                            </label>
                            <input type="text" id="schedule-year" required
                                   placeholder="예: 2025"
                                   value="${schedule ? schedule.year : '2025'}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                            <input type="text" id="schedule-year" required
                                   placeholder="예: 2025"
                                   value="${schedule ? schedule.year : '2025'}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
 * Tab 1: 심사/제출/신청 일정 저장
 */
function saveProcessPhaseSchedule(event, scheduleId) {
    event.preventDefault();

    const examTypeName = document.getElementById('schedule-exam-type').value;
    const processPhase = document.getElementById('schedule-process-phase').value;
    const year = document.getElementById('schedule-year').value.trim();
    const semester = document.getElementById('schedule-semester').value;
    const startDateTime = document.getElementById('schedule-start').value.replace('T', ' ');
    const endDateTime = document.getElementById('schedule-end').value.replace('T', ' ');

    // 유효성 검사
    if (!examTypeName || !processPhase || !year || !semester || !startDateTime || !endDateTime) {
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

    // 지도단계명 생성 (심사유형 + 일정구분)
    const phaseTextMap = {
        'application': '신청',
        'submission': '제출',
        'review': '심사'
    };
    const stageName = `${examTypeName} ${phaseTextMap[processPhase]}`;

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

    closeScheduleModal();
    renderProcessPhaseScheduleList();
}

/**
 * Tab 2: 관리자 업무 일정 저장
 */
function saveAdminWorkSchedule(event, scheduleId) {
    event.preventDefault();

    const workTypeSelect = document.getElementById('schedule-work-type');
    const selectedOption = workTypeSelect.options[workTypeSelect.selectedIndex];
    const workType = workTypeSelect.value;
    const workName = selectedOption.dataset.workName;
    const year = document.getElementById('schedule-year').value.trim();
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

    closeScheduleModal();
    renderAdminWorkScheduleList();
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
        window.mockWorkSchedules.splice(index, 1);
        console.log('일정 삭제:', scheduleId);
        alert('일정이 삭제되었습니다.');
        renderCurrentTab();
    }
}

// 전역으로 노출
window.initWorkScheduleManagement = initWorkScheduleManagement;
window.renderWorkScheduleManagement = renderWorkScheduleManagement;
window.switchScheduleTab = switchScheduleTab;
window.openProcessPhaseModal = openProcessPhaseModal;
window.openAdminWorkModal = openAdminWorkModal;
window.closeScheduleModal = closeScheduleModal;
window.saveProcessPhaseSchedule = saveProcessPhaseSchedule;
window.saveAdminWorkSchedule = saveAdminWorkSchedule;
window.deleteSchedule = deleteSchedule;

console.log('✅ work-schedule-management.js 로드 완료');
