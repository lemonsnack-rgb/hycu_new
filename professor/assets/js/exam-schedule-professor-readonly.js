// ==================== 교수 심사 일정 조회 (읽기 전용 - 대시보드 통합) ====================

// 전역 변수
let currentExamFilters = {
    semester: '2025-1',
    department: '',
    stage: '',
    scheduleStatus: '',
    searchType: 'studentName',
    searchKeyword: ''
};

let currentExamAssignmentId = null;
const currentProfessorId = 'PROF003'; // 실제로는 세션에서 가져옴

/**
 * 심사 일정 화면 초기 렌더링
 */
function renderExamScheduleScreen() {
    console.log('🔍 renderExamScheduleScreen 호출됨');
    const container = document.getElementById('exam-schedule-content');
    if (!container) {
        console.error('❌ exam-schedule-content 컨테이너를 찾을 수 없습니다');
        return;
    }
    console.log('✅ exam-schedule-content 컨테이너 찾음');

    container.innerHTML = `
        <!-- 목록 화면 -->
        <div id="exam-schedule-list-view">
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800">심사 일정 관리</h3>
                    <p class="text-sm text-gray-600 mt-1">배정된 심사 일정을 조회합니다 (읽기 전용)</p>
                </div>

                <!-- 검색 메뉴 -->
                <div class="p-6 border-b bg-gray-50">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <!-- 학년도/학기 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">학년도/학기</label>
                            <select id="exam-filter-semester" class="w-full px-3 py-2 border border-gray-300 rounded-md" onchange="filterExamScheduleList()">
                                <option value="">전체</option>
                                <option value="2025-1" selected>2025학년도 1학기</option>
                                <option value="2025-2">2025학년도 2학기</option>
                                <option value="2024-2">2024학년도 2학기</option>
                            </select>
                        </div>

                        <!-- 학과 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">학과</label>
                            <select id="exam-filter-department" class="w-full px-3 py-2 border border-gray-300 rounded-md" onchange="filterExamScheduleList()">
                                <option value="">전체</option>
                                <option value="경영학과">경영학과</option>
                                <option value="컴퓨터공학과">컴퓨터공학과</option>
                                <option value="교육학과">교육학과</option>
                            </select>
                        </div>

                        <!-- 심사 단계 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">심사 단계</label>
                            <select id="exam-filter-stage" class="w-full px-3 py-2 border border-gray-300 rounded-md" onchange="filterExamScheduleList()">
                                <option value="">전체</option>
                            </select>
                        </div>

                        <!-- 일정 상태 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">일정 상태</label>
                            <select id="exam-filter-schedule-status" class="w-full px-3 py-2 border border-gray-300 rounded-md" onchange="filterExamScheduleList()">
                                <option value="">전체</option>
                                <option value="scheduled">등록 완료</option>
                                <option value="unscheduled">미등록</option>
                            </select>
                        </div>

                        <!-- 검색어 -->
                        <div class="md:col-span-2 lg:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">검색어</label>
                            <div class="flex gap-2">
                                <select id="exam-filter-search-type" class="px-3 py-2 border border-gray-300 rounded-md" style="flex: 0 0 120px;">
                                    <option value="studentName">학생명</option>
                                    <option value="studentNumber">학번</option>
                                </select>
                                <input type="text"
                                       id="exam-filter-search-keyword"
                                       class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                       placeholder="검색어를 입력하세요"
                                       onkeypress="if(event.key==='Enter') filterExamScheduleList()">
                            </div>
                        </div>

                        <!-- 검색 버튼 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                            <button onclick="filterExamScheduleList()" class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                <i class="fas fa-search mr-1"></i> 검색
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 테이블 -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">학번</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">학생명</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">학과</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">학위</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">심사 단계</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">심사위원장</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">심사 일정</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">진행 방식</th>
                                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">상태</th>
                            </tr>
                        </thead>
                        <tbody id="exam-schedule-table-body" class="bg-white divide-y divide-gray-200">
                            <!-- JavaScript로 동적 렌더링 -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 상세 화면 (초기 숨김) -->
        <div id="exam-schedule-detail-view" style="display: none;">
            <!-- JavaScript로 동적 렌더링 -->
        </div>
    `;

    // 심사 단계 필터 옵션 로드
    loadExamStageFilterOptions();

    // 테이블 데이터 렌더링
    filterExamScheduleList();
}

/**
 * 심사 단계 필터 옵션 동적 로드
 */
function loadExamStageFilterOptions() {
    const stageSelect = document.getElementById('exam-filter-stage');
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
function filterExamScheduleList() {
    currentExamFilters.semester = document.getElementById('exam-filter-semester')?.value || '';
    currentExamFilters.department = document.getElementById('exam-filter-department')?.value || '';
    currentExamFilters.stage = document.getElementById('exam-filter-stage')?.value || '';
    currentExamFilters.scheduleStatus = document.getElementById('exam-filter-schedule-status')?.value || '';
    currentExamFilters.searchType = document.getElementById('exam-filter-search-type')?.value || 'studentName';
    currentExamFilters.searchKeyword = document.getElementById('exam-filter-search-keyword')?.value.trim() || '';

    // 내가 심사위원으로 배정된 건만 조회
    let data = getExamScheduleListData().filter(item => {
        const assignment = mockCommitteeAssignments.find(a => a.id === item.assignmentId);
        if (!assignment) return false;
        return assignment.members.some(m => m.professorId === currentProfessorId);
    });

    // 필터 적용
    if (currentExamFilters.department) {
        data = data.filter(item => item.department === currentExamFilters.department);
    }

    if (currentExamFilters.stage) {
        data = data.filter(item => item.stageName === currentExamFilters.stage);
    }

    if (currentExamFilters.scheduleStatus) {
        data = data.filter(item => item.scheduleStatus === currentExamFilters.scheduleStatus);
    }

    if (currentExamFilters.searchKeyword) {
        data = data.filter(item => {
            const keyword = currentExamFilters.searchKeyword.toLowerCase();
            if (currentExamFilters.searchType === 'studentName') {
                return item.studentName.toLowerCase().includes(keyword);
            } else if (currentExamFilters.searchType === 'studentNumber') {
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
            ? '<span class="text-blue-600">온라인</span>'
            : item.method === 'offline'
            ? '<span class="text-green-600">오프라인</span>'
            : '<span class="text-gray-400">-</span>';

        const statusBadge = item.hasSchedule
            ? '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">등록 완료</span>'
            : '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">미등록</span>';

        return `
            <tr class="hover:bg-gray-50 cursor-pointer transition-colors"
                onclick="showExamScheduleDetailReadonly('${item.assignmentId}')">
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
function showExamScheduleDetailReadonly(assignmentId) {
    currentExamAssignmentId = assignmentId;

    document.getElementById('exam-schedule-list-view').style.display = 'none';
    document.getElementById('exam-schedule-detail-view').style.display = 'block';

    renderExamScheduleDetailReadonly(assignmentId);
}

/**
 * 목록으로 돌아가기
 */
function backToExamScheduleListReadonly() {
    currentExamAssignmentId = null;

    document.getElementById('exam-schedule-detail-view').style.display = 'none';
    document.getElementById('exam-schedule-list-view').style.display = 'block';

    filterExamScheduleList();
}

/**
 * 상세 화면 렌더링 (읽기 전용)
 */
function renderExamScheduleDetailReadonly(assignmentId) {
    const assignment = mockCommitteeAssignments.find(a => a.id === assignmentId);
    if (!assignment) {
        alert('배정 정보를 찾을 수 없습니다.');
        backToExamScheduleListReadonly();
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
                        <button onclick="backToExamScheduleListReadonly()" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
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
                    ? 'bg-blue-100 text-blue-800'
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
                    <button onclick="backToExamScheduleListReadonly()" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
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
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                        }">
                            ${schedule.method === 'online' ? '온라인 (Zoom)' : '오프라인'}
                        </span>
                    </div>

                    ${schedule.method === 'online' && schedule.onlineInfo ? `
                        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                                        <a href="${schedule.onlineInfo.meetingUrl}" target="_blank" class="text-blue-600 hover:underline">
                                            ${schedule.onlineInfo.meetingUrl}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-gray-600">호스트 URL:</span>
                                    <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm break-all">
                                        <a href="${schedule.onlineInfo.hostUrl}" target="_blank" class="text-blue-600 hover:underline">
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
    window.renderExamScheduleScreen = renderExamScheduleScreen;
    window.filterExamScheduleList = filterExamScheduleList;
    window.showExamScheduleDetailReadonly = showExamScheduleDetailReadonly;
    window.backToExamScheduleListReadonly = backToExamScheduleListReadonly;
}

console.log('✅ exam-schedule-professor-readonly.js 로드 완료');
