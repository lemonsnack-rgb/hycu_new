// ==================== 교수 심사 일정 조회 (읽기 전용 - 대시보드 통합) ====================

// 전역 변수
let currentExamFilters = {
    year: '2025',
    semester: '1',
    collegeType: '',
    graduate: '',
    undergraduate: '',
    major: '',
    degree: '',
    status: '',
    studentNumber: '',
    studentName: '',
    advisor: '',
    stage: '',
    scheduleStatus: ''
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
            <!-- 검색 영역 -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-4 bg-gray-50">
                    <div class="grid grid-cols-4 gap-4">
                        <!-- 1행 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
                            <select id="exam-filter-year" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="2025" selected>2025</option>
                                <option value="2024">2024</option>
                            </select>
                            <select id="exam-filter-semester" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="1" selected>1학기</option>
                                <option value="2">2학기</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                            <select id="exam-filter-college-type" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="일반대학원">일반대학원</option>
                                <option value="특수대학원">특수대학원</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                            <select id="exam-filter-graduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="일반대학원">일반대학원</option>
                                <option value="교육대학원">교육대학원</option>
                                <option value="산업정보대학원">산업정보대학원</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                            <select id="exam-filter-undergraduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="공과대학">공과대학</option>
                                <option value="사범대학">사범대학</option>
                                <option value="인문대학">인문대학</option>
                                <option value="사회과학대학">사회과학대학</option>
                            </select>
                        </div>

                        <!-- 2행 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                            <select id="exam-filter-major" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="경영학과">경영학과</option>
                                <option value="컴퓨터공학과">컴퓨터공학과</option>
                                <option value="교육학과">교육학과</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                            <select id="exam-filter-degree" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                                <option value="석박통합">석박통합</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                            <select id="exam-filter-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="재학">재학</option>
                                <option value="휴학">휴학</option>
                                <option value="수료">수료</option>
                                <option value="졸업">졸업</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                            <input type="text" id="exam-filter-student-number" placeholder="학번"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                   onkeypress="if(event.key==='Enter') filterExamScheduleList()">
                        </div>

                        <!-- 3행 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                            <input type="text" id="exam-filter-student-name" placeholder="성명"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                   onkeypress="if(event.key==='Enter') filterExamScheduleList()">
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                            <input type="text" id="exam-filter-advisor" placeholder="지도교수명"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                   onkeypress="if(event.key==='Enter') filterExamScheduleList()">
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">심사단계</label>
                            <select id="exam-filter-stage" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">등록상태</label>
                            <select id="exam-filter-schedule-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="scheduled">등록 완료</option>
                                <option value="unscheduled">미등록</option>
                            </select>
                        </div>

                        <!-- 4행 - 조회 버튼 -->
                        <div class="col-span-4 flex items-center justify-end">
                            <button onclick="filterExamScheduleList()" class="px-3 bg-[#6A0028] text-white rounded hover:bg-[#4A001C] text-xs font-medium" style="height: 34px;">
                                <i class="fas fa-search mr-1"></i>조회
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 테이블 영역 -->
            <div class="bg-white rounded-lg shadow-md">
                <div class="table-container">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">심사 일정 목록</h3>
                            <span class="table-count" id="exam-schedule-count">(총 0건)</span>
                        </div>
                    </div>
                    <div class="table-scroll">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th>순번</th>
                                    <th>학년도</th>
                                    <th>학기</th>
                                    <th>대학구분</th>
                                    <th>계열/대학원</th>
                                    <th>학부(과)전공</th>
                                    <th>학과/전공</th>
                                    <th>학위과정</th>
                                    <th>학적상태</th>
                                    <th>학번</th>
                                    <th>성명</th>
                                    <th>지도교수명</th>
                                    <th>심사단계</th>
                                    <th>등록상태</th>
                                    <th>심사일정</th>
                                    <th>진행방식</th>
                                </tr>
                            </thead>
                            <tbody id="exam-schedule-table-body">
                                <!-- JavaScript로 동적 렌더링 -->
                            </tbody>
                        </table>
                    </div>
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
// 검색 필터 초기화
function resetExamScheduleFilters() {
    document.getElementById('exam-filter-year').value = '2025';
    document.getElementById('exam-filter-semester').value = '1';
    document.getElementById('exam-filter-college-type').value = '';
    document.getElementById('exam-filter-graduate').value = '';
    document.getElementById('exam-filter-undergraduate').value = '';
    document.getElementById('exam-filter-major').value = '';
    document.getElementById('exam-filter-degree').value = '';
    document.getElementById('exam-filter-status').value = '';
    document.getElementById('exam-filter-student-number').value = '';
    document.getElementById('exam-filter-student-name').value = '';
    document.getElementById('exam-filter-advisor').value = '';
    document.getElementById('exam-filter-stage').value = '';
    document.getElementById('exam-filter-schedule-status').value = '';

    filterExamScheduleList();
}

function filterExamScheduleList() {
    currentExamFilters.year = document.getElementById('exam-filter-year')?.value || '';
    currentExamFilters.semester = document.getElementById('exam-filter-semester')?.value || '';
    currentExamFilters.collegeType = document.getElementById('exam-filter-college-type')?.value || '';
    currentExamFilters.graduate = document.getElementById('exam-filter-graduate')?.value || '';
    currentExamFilters.undergraduate = document.getElementById('exam-filter-undergraduate')?.value || '';
    currentExamFilters.major = document.getElementById('exam-filter-major')?.value || '';
    currentExamFilters.degree = document.getElementById('exam-filter-degree')?.value || '';
    currentExamFilters.status = document.getElementById('exam-filter-status')?.value || '';
    currentExamFilters.studentNumber = document.getElementById('exam-filter-student-number')?.value.trim() || '';
    currentExamFilters.studentName = document.getElementById('exam-filter-student-name')?.value.trim() || '';
    currentExamFilters.advisor = document.getElementById('exam-filter-advisor')?.value.trim() || '';
    currentExamFilters.stage = document.getElementById('exam-filter-stage')?.value || '';
    currentExamFilters.scheduleStatus = document.getElementById('exam-filter-schedule-status')?.value || '';

    // 내가 심사위원으로 배정된 건만 조회
    let data = getExamScheduleListData().filter(item => {
        const assignment = mockCommitteeAssignments.find(a => a.id === item.assignmentId);
        if (!assignment) return false;
        return assignment.members.some(m => m.professorId === currentProfessorId);
    });

    // 필터 적용
    if (currentExamFilters.year) {
        data = data.filter(item => item.year === currentExamFilters.year);
    }

    if (currentExamFilters.semester) {
        data = data.filter(item => item.semester === currentExamFilters.semester);
    }

    if (currentExamFilters.collegeType) {
        data = data.filter(item => item.collegeType === currentExamFilters.collegeType);
    }

    if (currentExamFilters.graduate) {
        data = data.filter(item => item.graduate === currentExamFilters.graduate);
    }

    if (currentExamFilters.undergraduate) {
        data = data.filter(item => item.undergraduate === currentExamFilters.undergraduate);
    }

    if (currentExamFilters.major) {
        data = data.filter(item => item.department === currentExamFilters.major);
    }

    if (currentExamFilters.degree) {
        const degreeMap = {
            '석사': 'master',
            '박사': 'doctor',
            '석박통합': 'combined'
        };
        const degreeValue = degreeMap[currentExamFilters.degree];
        if (degreeValue) {
            data = data.filter(item => item.degreeType === degreeValue);
        }
    }

    if (currentExamFilters.status) {
        data = data.filter(item => item.status === currentExamFilters.status);
    }

    if (currentExamFilters.studentNumber) {
        data = data.filter(item => item.studentNumber.includes(currentExamFilters.studentNumber));
    }

    if (currentExamFilters.studentName) {
        data = data.filter(item => item.studentName.includes(currentExamFilters.studentName));
    }

    if (currentExamFilters.advisor) {
        data = data.filter(item => {
            const advisorName = item.advisorName || '';
            return advisorName.includes(currentExamFilters.advisor);
        });
    }

    if (currentExamFilters.stage) {
        data = data.filter(item => item.stageName === currentExamFilters.stage);
    }

    if (currentExamFilters.scheduleStatus) {
        data = data.filter(item => item.scheduleStatus === currentExamFilters.scheduleStatus);
    }

    renderExamScheduleTable(data);
}

/**
 * 테이블 렌더링
 */
function renderExamScheduleTable(data) {
    const tbody = document.getElementById('exam-schedule-table-body');
    if (!tbody) return;

    // 총 건수 업데이트
    const countElement = document.getElementById('exam-schedule-count');
    if (countElement) {
        countElement.textContent = `(총 ${data.length}건)`;
    }

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="16" style="text-align: center; padding: 24px 12px;">
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

        const statusText = item.hasSchedule ? '등록 완료' : '미등록';

        return `
            <tr class="cursor-pointer" onclick="showExamScheduleDetailReadonly('${item.assignmentId}')">
                <td>${index + 1}</td>
                <td>${item.year || '2025'}</td>
                <td>${item.semester || '1'}</td>
                <td>${item.collegeType || '일반대학원'}</td>
                <td>${item.graduate || '일반대학원'}</td>
                <td>${item.undergraduate || '-'}</td>
                <td>${item.department}</td>
                <td>${item.degreeType === 'master' ? '석사' : item.degreeType === 'doctor' ? '박사' : '석박통합'}</td>
                <td>${item.status || '재학'}</td>
                <td>${item.studentNumber}</td>
                <td>${item.studentName}</td>
                <td>${item.advisorName || '-'}</td>
                <td>${item.stageName}</td>
                <td>${statusText}</td>
                <td>${scheduleText}</td>
                <td>${methodText}</td>
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
                <div class="px-6 py-3 border-b">
                    <button onclick="backToExamScheduleListReadonly()" class="back-to-list-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        목록으로 돌아가기
                    </button>
                </div>

                <!-- 학생 정보 -->
                <div class="px-6 py-4 border-b bg-gray-50">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
                    <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                            <span class="text-gray-900 font-medium">일반대학원</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                            <span class="text-gray-900 font-medium">일반대학원</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                            <span class="text-gray-900 font-medium">${assignment.department}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                            <span class="text-gray-900 font-medium">${assignment.department}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                            <span class="text-gray-900 font-medium">${assignment.degreeType === 'master' ? '석사' : '박사'}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                            <span class="text-gray-900 font-medium">재학</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학번:</span>
                            <span class="text-gray-900 font-medium">${assignment.studentNumber}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">성명:</span>
                            <span class="text-gray-900 font-medium">${assignment.studentName}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                            <span class="text-gray-900 font-medium">-</span>
                        </div>
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

    // 심사위원 목록 HTML 생성 (5열 그리드)
    const membersHTML = `
        <div class="grid grid-cols-5 gap-3">
            ${assignment.members.map(m => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-2">
                        <span class="text-xs px-2 py-1 rounded-full ${
                            m.role === 'chair'
                                ? 'bg-[#FCE4EC] text-[#6A0028]'
                                : 'bg-gray-100 text-gray-600'
                        }">
                            ${m.role === 'chair' ? '위원장' : '위원'}
                        </span>
                        <span class="font-medium text-gray-900 text-sm">${m.professorName}</span>
                    </div>
                    <span class="text-sm text-gray-600">${m.department}</span>
                </div>
            `).join('')}
        </div>
    `;

    detailView.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- Header -->
            <div class="px-6 py-3 border-b">
                <button onclick="backToExamScheduleListReadonly()" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
            </div>
            <div class="px-6 py-4 border-b bg-gray-50">
                <p class="text-sm text-gray-600">${assignment.studentName} (${assignment.studentNumber}) - ${assignment.stageName}</p>
            </div>

            <!-- 학생 정보 -->
            <div class="px-6 py-4 border-b bg-gray-50">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
                <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                        <span class="text-gray-900 font-medium">일반대학원</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                        <span class="text-gray-900 font-medium">일반대학원</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                        <span class="text-gray-900 font-medium">${assignment.department}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                        <span class="text-gray-900 font-medium">${assignment.department}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                        <span class="text-gray-900 font-medium">${assignment.degreeType === 'master' ? '석사' : '박사'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                        <span class="text-gray-900 font-medium">재학</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학번:</span>
                        <span class="text-gray-900 font-medium">${assignment.studentNumber}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                        <span class="text-gray-900 font-medium">${assignment.studentName}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                        <span class="text-gray-900 font-medium">-</span>
                    </div>
                </div>
            </div>

            <!-- 논문 정보 -->
            <div class="px-6 py-4 border-b bg-white">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">논문 정보</h4>
                <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    <div class="col-span-3 flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">논문 제목:</span>
                        <span class="text-gray-900 font-medium">${thesisTitle}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">제출일:</span>
                        <span class="text-gray-900 font-medium">-</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">심사 마감일:</span>
                        <span class="text-gray-900 font-medium">-</span>
                    </div>
                </div>
            </div>

            <!-- Content (읽기 전용) -->
            <div class="p-6">

                <!-- 심사위원 정보 -->
                <div class="mb-6">
                    <h4 class="font-bold text-gray-800 mb-3">심사위원 정보</h4>
                    ${membersHTML}
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
                        <div class="p-4 bg-[#FAF6F1] border border-[#E8E0D8] rounded-lg">
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
                                <div class="grid grid-cols-2 gap-4">
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
    window.resetExamScheduleFilters = resetExamScheduleFilters;
    window.filterExamScheduleList = filterExamScheduleList;
    window.showExamScheduleDetailReadonly = showExamScheduleDetailReadonly;
    window.backToExamScheduleListReadonly = backToExamScheduleListReadonly;
}

console.log('✅ exam-schedule-professor-readonly.js 로드 완료');
