// 업무일정등록 관리 화면
// 수정일: 2026-02-03
// 수정 내용: "심사/제출/신청 일정" 탭 제거, "관리자 업무 일정"만 단일 페이지로 표시

// 뷰 상태 관리
let adminWorkView = 'list'; // 'list' | 'form'
let adminWorkFormMode = null; // null | 'create' | 'edit'
let currentAdminWorkScheduleId = null;

/**
 * 업무일정등록 화면 초기화
 */
function initWorkScheduleManagement() {
    console.log('✅ 업무일정등록 화면 초기화 - 관리자 업무 일정만 표시');
    renderWorkScheduleManagement();
}

/**
 * 메인 화면 렌더링 (관리자 업무 일정만 표시)
 */
function renderWorkScheduleManagement() {
    if (adminWorkView === 'list') {
        renderAdminWorkScheduleList();
    } else if (adminWorkView === 'form') {
        renderAdminWorkFormPage();
    }
}

/**
 * 관리자 업무 일정 목록 렌더링
 */
function renderAdminWorkScheduleList() {
    const container = document.getElementById('work-schedule-management-content');
    if (!container) return;

    // admin 유형의 일정만 필터링
    const schedules = window.mockWorkSchedules.filter(s => s.scheduleType === 'admin');

    const html = `
        <div class="bg-white rounded-lg shadow-md">
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
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">시작일시</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">종료일시</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">상태</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${schedules.length === 0 ? `
                                <tr>
                                    <td colspan="5" class="py-8 text-center text-gray-500">
                                        등록된 일정이 없습니다.
                                    </td>
                                </tr>
                            ` : schedules.map((schedule, index) => `
                                <tr class="hover:bg-blue-50 cursor-pointer" onclick="showAdminWorkForm('edit', '${schedule.id}')">
                                    <td class="py-3 px-4 text-sm text-gray-600 text-center">${index + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${schedule.workName || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.startDateTime}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600 text-center">${schedule.endDateTime}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600 text-center">${getScheduleStatus(schedule)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * 관리자 업무 일정 폼 화면으로 전환
 */
function showAdminWorkForm(mode, scheduleId = null) {
    adminWorkView = 'form';
    adminWorkFormMode = mode;
    currentAdminWorkScheduleId = scheduleId;
    renderWorkScheduleManagement();
}

/**
 * 목록으로 돌아가기
 */
function backToAdminWorkList() {
    adminWorkView = 'list';
    adminWorkFormMode = null;
    currentAdminWorkScheduleId = null;
    renderWorkScheduleManagement();
}

/**
 * 관리자 업무 일정 폼 페이지 렌더링
 */
function renderAdminWorkFormPage() {
    const container = document.getElementById('work-schedule-management-content');
    if (!container) return;

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
                <div class="p-6 space-y-6">
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

                        <!-- 시작일시 / 종료일시 -->
                        <div class="grid grid-cols-2 gap-4">
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

    container.innerHTML = html;
}

/**
 * 관리자 업무 일정 저장
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

    const startDateTime = document.getElementById('schedule-start').value.replace('T', ' ');
    const endDateTime = document.getElementById('schedule-end').value.replace('T', ' ');

    // 유효성 검사
    if (!workType || !startDateTime || !endDateTime) {
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
        window.mockWorkSchedules.splice(index, 1);
        console.log('일정 삭제:', scheduleId);
        alert('일정이 삭제되었습니다.');

        backToAdminWorkList();
    }
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

// 전역으로 노출
window.initWorkScheduleManagement = initWorkScheduleManagement;
window.renderWorkScheduleManagement = renderWorkScheduleManagement;
window.showAdminWorkForm = showAdminWorkForm;
window.backToAdminWorkList = backToAdminWorkList;
window.saveAdminWorkSchedule = saveAdminWorkSchedule;
window.deleteSchedule = deleteSchedule;

console.log('✅ work-schedule-management.js 로드 완료 (수정버전 - 관리자 업무 일정만 표시)');
