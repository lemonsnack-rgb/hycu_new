// ==================== 교수 심사 일정 조회 (읽기 전용) ====================
// 관리자 화면과 동일한 UI, 편집 기능 제외

// 전역 변수
let currentFilters = {
    semester: '2025-1',
    department: '',
    stage: '',
    scheduleStatus: '',
    searchType: 'studentName',
    searchKeyword: ''
};

let currentAssignmentId = null;
const currentProfessorId = 'PROF003'; // 실제로는 세션에서 가져옴

/**
 * 목록 화면 렌더링
 */
function renderExamScheduleList() {
    // 심사 단계 필터 옵션 로드
    loadStageFilterOptions();

    // 테이블 데이터 렌더링
    filterExamSchedule();
}

/**
 * 심사 단계 필터 옵션 동적 로드
 */
function loadStageFilterOptions() {
    const stageSelect = document.getElementById('filter-stage');
    if (!stageSelect) return;

    const stageNames = getReviewStageNames();

    stageSelect.innerHTML = '<option value="">전체</option>';

    stageNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        stageSelect.appendChild(option);
    });
}

/**
 * 필터링 및 테이블 렌더링
 */
function filterExamSchedule() {
    currentFilters.semester = document.getElementById('filter-semester')?.value || '';
    currentFilters.department = document.getElementById('filter-department')?.value || '';
    currentFilters.stage = document.getElementById('filter-stage')?.value || '';
    currentFilters.scheduleStatus = document.getElementById('filter-schedule-status')?.value || '';
    currentFilters.searchType = document.getElementById('filter-search-type')?.value || 'studentName';
    currentFilters.searchKeyword = document.getElementById('filter-search-keyword')?.value.trim() || '';

    // 내가 심사위원으로 배정된 건만 조회
    let data = getExamScheduleListData().filter(item => {
        const assignment = mockCommitteeAssignments.find(a => a.id === item.assignmentId);
        if (!assignment) return false;
        return assignment.members.some(m => m.professorId === currentProfessorId);
    });

    // 필터 적용
    if (currentFilters.department) {
        data = data.filter(item => item.department === currentFilters.department);
    }

    if (currentFilters.stage) {
        data = data.filter(item => item.stageName === currentFilters.stage);
    }

    if (currentFilters.scheduleStatus) {
        data = data.filter(item => item.scheduleStatus === currentFilters.scheduleStatus);
    }

    if (currentFilters.searchKeyword) {
        data = data.filter(item => {
            const keyword = currentFilters.searchKeyword.toLowerCase();
            if (currentFilters.searchType === 'studentName') {
                return item.studentName.toLowerCase().includes(keyword);
            } else if (currentFilters.searchType === 'studentNumber') {
                return item.studentNumber.includes(keyword);
            }
            return true;
        });
    }

    renderExamScheduleTable(data);
}

/**
 * 테이블 렌더링
 */
function renderExamScheduleTable(data) {
    const tbody = document.getElementById('exam-schedule-table-body');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                    배정된 심사 일정이 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map((item, index) => {
        const scheduleText = item.hasSchedule
            ? `${item.examDate} ${item.examTime}`
            : '<span class="text-gray-400">미등록</span>';

        const methodText = item.method === 'online'
            ? '<span class="text-[#6A0028]">온라인</span>'
            : item.method === 'offline'
            ? '<span class="text-green-600">오프라인</span>'
            : '<span class="text-gray-400">-</span>';

        const statusBadge = item.hasSchedule
            ? '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">등록 완료</span>'
            : '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">미등록</span>';

        return `
            <tr class="hover:bg-gray-50 cursor-pointer transition-colors"
                onclick="showExamScheduleDetail('${item.assignmentId}')">
                <td class="px-6 py-4 text-sm text-gray-900">${index + 1}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${item.studentNumber}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">${item.studentName}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${item.department}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${item.degreeType === 'master' ? '석사' : '박사'}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${item.stageName}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${item.chairName}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${scheduleText}</td>
                <td class="px-6 py-4 text-sm">${methodText}</td>
                <td class="px-6 py-4 text-center">${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

/**
 * 상세 화면 표시 (읽기 전용)
 */
function showExamScheduleDetail(assignmentId) {
    currentAssignmentId = assignmentId;

    document.getElementById('exam-schedule-list-view').style.display = 'none';
    document.getElementById('exam-schedule-detail-view').style.display = 'block';

    renderExamScheduleDetail(assignmentId);
}

/**
 * 목록으로 돌아가기
 */
function backToExamScheduleList() {
    currentAssignmentId = null;

    document.getElementById('exam-schedule-detail-view').style.display = 'none';
    document.getElementById('exam-schedule-list-view').style.display = 'block';

    filterExamSchedule();
}

/**
 * 상세 화면 렌더링 (읽기 전용)
 */
function renderExamScheduleDetail(assignmentId) {
    const assignment = mockCommitteeAssignments.find(a => a.id === assignmentId);
    if (!assignment) {
        alert('배정 정보를 찾을 수 없습니다.');
        backToExamScheduleList();
        return;
    }

    const schedule = getScheduleByAssignmentId(assignmentId);
    const thesisTitle = getThesisTitleByReviewTargetId(assignment.reviewTargetId);

    if (!schedule) {
        // 일정 미등록
        document.getElementById('exam-schedule-detail-view').innerHTML = `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">심사 일정 조회</h3>
                            <p class="text-sm text-gray-600 mt-1">${assignment.studentName} (${assignment.studentNumber}) - ${assignment.stageName}</p>
                        </div>
                        <button onclick="backToExamScheduleList()" class="btn btn-secondary">
                            <i class="fas fa-list mr-1"></i> 목록으로
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div class="text-center py-12 text-gray-500">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p class="text-lg font-medium">심사 일정이 아직 등록되지 않았습니다.</p>
                        <p class="text-sm mt-2">관리자가 일정을 등록하면 확인할 수 있습니다.</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const detailView = document.getElementById('exam-schedule-detail-view');

    // 심사위원 목록 HTML 생성
    const membersHTML = assignment.members.map(m => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
                <span class="font-medium text-gray-900">${m.professorName}</span>
                <span class="text-sm text-gray-600 ml-2">${m.department}</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full ${
                m.role === 'chair'
                    ? 'bg-[#FCE4EC] text-[#6A0028]'
                    : 'bg-gray-100 text-gray-600'
            }">
                ${m.role === 'chair' ? '위원장' : '위원'}
            </span>
        </div>
    `).join('');

    detailView.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- Header -->
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">심사 일정 조회</h3>
                        <p class="text-sm text-gray-600 mt-1">${assignment.studentName} (${assignment.studentNumber}) - ${assignment.stageName}</p>
                    </div>
                    <button onclick="backToExamScheduleList()" class="btn btn-secondary">
                        <i class="fas fa-list mr-1"></i> 목록으로
                    </button>
                </div>
            </div>

            <!-- Content (읽기 전용) -->
            <div class="p-6">
                <!-- 학생 정보 -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-bold text-gray-800 mb-3">학생 정보</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">학번:</span>
                            <span class="ml-2 font-medium">${assignment.studentNumber}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">학생명:</span>
                            <span class="ml-2 font-medium">${assignment.studentName}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">학과:</span>
                            <span class="ml-2 font-medium">${assignment.department}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">학위:</span>
                            <span class="ml-2 font-medium">${assignment.degreeType === 'master' ? '석사' : '박사'}</span>
                        </div>
                        <div class="col-span-2">
                            <span class="text-gray-600">논문 제목:</span>
                            <span class="ml-2 font-medium">${thesisTitle}</span>
                        </div>
                    </div>
                </div>

                <!-- 심사위원 정보 -->
                <div class="mb-6">
                    <h4 class="font-bold text-gray-800 mb-3">심사위원 정보</h4>
                    <div class="space-y-2">
                        ${membersHTML}
                    </div>
                </div>

                <!-- 일정 정보 -->
                <div class="mb-6">
                    <h4 class="font-bold text-gray-800 mb-3">일정 정보</h4>
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">심사 날짜</label>
                            <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                                ${schedule.examDate}
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">심사 시간</label>
                            <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                                ${schedule.examTime}
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">소요 시간</label>
                            <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                                ${schedule.duration}분
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 진행 방식 -->
                <div class="mb-6">
                    <h4 class="font-bold text-gray-800 mb-3">진행 방식</h4>
                    <div class="mb-4">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                            schedule.method === 'online'
                                ? 'bg-[#FCE4EC] text-[#6A0028]'
                                : 'bg-green-100 text-green-800'
                        }">
                            ${schedule.method === 'online' ? '온라인 (Zoom)' : '오프라인'}
                        </span>
                    </div>

                    ${schedule.method === 'online' && schedule.onlineInfo ? `
                        <div class="p-4 bg-[#FCE4EC] border border-[#F8BBD9] rounded-lg">
                            <h5 class="font-medium text-gray-800 mb-3">Zoom 미팅 정보</h5>
                            <div class="space-y-2 text-sm">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <span class="text-gray-600">미팅 ID:</span>
                                        <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                                            ${schedule.onlineInfo.meetingId}
                                        </div>
                                    </div>
                                    <div>
                                        <span class="text-gray-600">비밀번호:</span>
                                        <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                                            ${schedule.onlineInfo.password}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-gray-600">참가 URL:</span>
                                    <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm break-all">
                                        <a href="${schedule.onlineInfo.meetingUrl}" target="_blank" class="text-[#6A0028] hover:underline">
                                            ${schedule.onlineInfo.meetingUrl}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-gray-600">호스트 URL:</span>
                                    <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm break-all">
                                        <a href="${schedule.onlineInfo.hostUrl}" target="_blank" class="text-[#6A0028] hover:underline">
                                            ${schedule.onlineInfo.hostUrl}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    ${schedule.method === 'offline' && schedule.offlineInfo ? `
                        <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h5 class="font-medium text-gray-800 mb-3">오프라인 심사</h5>
                            <div class="text-sm">
                                <span class="text-gray-600">장소:</span>
                                <span class="ml-2 font-medium">${schedule.offlineInfo.location}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// window 객체에 노출
if (typeof window !== 'undefined') {
    window.renderExamScheduleList = renderExamScheduleList;
    window.filterExamSchedule = filterExamSchedule;
    window.showExamScheduleDetail = showExamScheduleDetail;
    window.backToExamScheduleList = backToExamScheduleList;
}

console.log('✅ exam-schedule-professor.js 로드 완료');
