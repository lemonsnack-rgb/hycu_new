// ==================== 학생 심사 일정 조회 (읽기 전용) ====================
// 교수용 화면과 동일한 UI, 검색 옵션만 제거

// 전역 변수
let currentStudentExamAssignmentId = null;

/**
 * 심사 일정 화면 초기 렌더링
 */
function renderStudentExamScheduleScreen() {
    console.log('🔍 renderStudentExamScheduleScreen 호출됨');
    const container = document.getElementById('student-exam-schedule-content');
    if (!container) {
        console.error('❌ student-exam-schedule-content 컨테이너를 찾을 수 없습니다');
        return;
    }
    console.log('✅ student-exam-schedule-content 컨테이너 찾음');

    container.innerHTML = `
        <!-- 목록 화면 -->
        <div id="student-exam-schedule-list-view">
            <!-- 테이블 영역 (검색 옵션 제거) -->
            <div class="bg-white rounded-lg shadow-md">
                <div class="table-container">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">내 심사 일정</h3>
                            <span class="table-count" id="student-exam-schedule-count">(총 0건)</span>
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
                            <tbody id="student-exam-schedule-table-body">
                                <!-- JavaScript로 동적 렌더링 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- 상세 화면 (초기 숨김) -->
        <div id="student-exam-schedule-detail-view" style="display: none;">
            <!-- JavaScript로 동적 렌더링 -->
        </div>
    `;

    // 초기 데이터 로드
    filterStudentExamSchedule();
}

/**
 * 필터링 및 테이블 렌더링 (학생용)
 */
function filterStudentExamSchedule() {
    console.log('🔍 filterStudentExamSchedule 호출됨');

    // 학생 본인의 데이터만 필터링
    const studentId = CURRENT_STUDENT.id;
    let data = getExamScheduleListData().filter(item => {
        return item.studentId === studentId;
    });

    console.log('✅ 학생 필터링 후 데이터:', data.length, '건');

    renderStudentExamScheduleTable(data);
}

/**
 * 테이블 렌더링
 */
function renderStudentExamScheduleTable(data) {
    const tbody = document.getElementById('student-exam-schedule-table-body');
    const countElement = document.getElementById('student-exam-schedule-count');

    if (!tbody) {
        console.error('❌ student-exam-schedule-table-body를 찾을 수 없습니다');
        return;
    }

    // 총 건수 업데이트
    if (countElement) {
        countElement.textContent = `(총 ${data.length}건)`;
    }

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="16" class="px-6 py-8 text-center text-gray-500">
                    등록된 심사 일정이 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map((item, index) => {
        const degreeMap = { 'master': '석사', 'doctor': '박사', 'integrated': '석박통합' };
        const degreeText = degreeMap[item.degreeType] || item.degreeType;

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
            <tr class="hover:bg-gray-50 cursor-pointer transition-colors"
                onclick="showStudentExamScheduleDetail('${item.assignmentId}')">
                <td class="px-4 py-3 text-sm text-gray-900 text-center">${index + 1}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.year || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.semester ? item.semester + '학기' : '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.graduate || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.college || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.undergraduate || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.department}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${degreeText}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.academicStatus || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-900 text-center">${item.studentNumber}</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900 text-center">${item.studentName}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">${item.advisorName || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-900 text-center">${item.stageName}</td>
                <td class="px-4 py-3 text-sm text-gray-800 text-center">${statusText}</td>
                <td class="px-4 py-3 text-sm text-gray-900 text-center">${scheduleText}</td>
                <td class="px-4 py-3 text-sm text-center">${methodText}</td>
            </tr>
        `;
    }).join('');
}

/**
 * 상세 화면 표시 (읽기 전용)
 */
function showStudentExamScheduleDetail(assignmentId) {
    currentStudentExamAssignmentId = assignmentId;

    document.getElementById('student-exam-schedule-list-view').style.display = 'none';
    document.getElementById('student-exam-schedule-detail-view').style.display = 'block';

    renderStudentExamScheduleDetail(assignmentId);
}

/**
 * 목록으로 돌아가기
 */
function backToStudentExamScheduleList() {
    currentStudentExamAssignmentId = null;

    document.getElementById('student-exam-schedule-detail-view').style.display = 'none';
    document.getElementById('student-exam-schedule-list-view').style.display = 'block';

    filterStudentExamSchedule();
}

/**
 * 상세 화면 렌더링 (읽기 전용)
 */
function renderStudentExamScheduleDetail(assignmentId) {
    const assignment = mockCommitteeAssignments.find(a => a.id === assignmentId);
    if (!assignment) {
        alert('배정 정보를 찾을 수 없습니다.');
        backToStudentExamScheduleList();
        return;
    }

    const schedule = getScheduleByAssignmentId(assignmentId);
    const thesisTitle = getThesisTitleByReviewTargetId(assignment.reviewTargetId);

    if (!schedule) {
        // 일정 미등록
        document.getElementById('student-exam-schedule-detail-view').innerHTML = `
            <div class="bg-white rounded-lg shadow-md">
                <div class="px-6 py-3 border-b">
                    <button onclick="backToStudentExamScheduleList()" class="back-to-list-btn">
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

                <!-- 논문 정보 -->
                <div class="px-6 py-4 bg-white border-b">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">논문 정보</h4>
                    <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                        <div class="col-span-3 flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">논문 제목:</span>
                            <span class="text-gray-900 font-medium flex-1">${thesisTitle}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">제출일:</span>
                            <span class="text-gray-900 font-medium">${assignment.submissionDate || '-'}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">심사 희망일:</span>
                            <span class="text-gray-900 font-medium">${assignment.dueDate || '-'}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">심사 단계:</span>
                            <span class="text-gray-900 font-medium">${assignment.stageName}</span>
                        </div>
                    </div>
                </div>

                <!-- 심사위원 정보 -->
                <div class="px-6 py-4 bg-white border-b">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">심사위원 정보</h4>
                    <div class="grid grid-cols-5 gap-3">
                        ${assignment.members.map(m => {
                            const roleText = m.role === 'chair' ? '위원장' : '위원';
                            return `
                                <div class="p-3 bg-gray-50 rounded-lg text-center">
                                    <div class="text-sm font-medium text-gray-900">${m.professorName} (${roleText})</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="p-6">
                    <div class="text-center py-12 text-gray-500">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p class="text-lg font-medium mb-2">심사 일정이 아직 등록되지 않았습니다</p>
                        <p class="text-sm">관리자가 일정을 등록하면 여기에 표시됩니다</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 일정 등록됨 - 상세 정보 표시
    const degreeMap = { 'master': '석사', 'doctor': '박사', 'integrated': '석박통합' };
    const degreeText = degreeMap[assignment.degreeType] || assignment.degreeType;

    const membersHTML = assignment.members.map(m => {
        const roleText = m.role === 'chair' ? '위원장' : '위원';
        return `
            <div class="p-3 bg-gray-50 rounded-lg text-center">
                <div class="text-sm font-medium text-gray-900">${m.professorName} (${roleText})</div>
            </div>
        `;
    }).join('');

    document.getElementById('student-exam-schedule-detail-view').innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="px-6 py-3 border-b">
                <button onclick="backToStudentExamScheduleList()" class="back-to-list-btn">
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
                        <span class="text-gray-900 font-medium">${assignment.graduateSchool || '일반대학원'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                        <span class="text-gray-900 font-medium">${assignment.major || assignment.department}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                        <span class="text-gray-900 font-medium">${assignment.department}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                        <span class="text-gray-900 font-medium">${degreeText}</span>
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
                        <span class="text-gray-900 font-medium">${assignment.advisorName || '-'}</span>
                    </div>
                </div>
            </div>

            <!-- 논문 정보 -->
            <div class="px-6 py-4 bg-white border-b">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">논문 정보</h4>
                <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    <div class="col-span-3 flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">논문 제목:</span>
                        <span class="text-gray-900 font-medium flex-1">${thesisTitle}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">제출일:</span>
                        <span class="text-gray-900 font-medium">${assignment.submissionDate || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">심사 희망일:</span>
                        <span class="text-gray-900 font-medium">${assignment.dueDate || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">심사 단계:</span>
                        <span class="text-gray-900 font-medium">${assignment.stageName}</span>
                    </div>
                </div>
            </div>

            <!-- 심사위원 정보 -->
            <div class="px-6 py-4 bg-white border-b">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">심사위원 정보</h4>
                <div class="grid grid-cols-5 gap-3">
                    ${membersHTML}
                </div>
            </div>
        </div>

        <!-- 일정 정보 및 진행 방식 -->
        <div class="bg-white rounded-lg shadow-md p-6">
            <!-- 일정 정보 -->
            <div class="mb-6">
                <h4 class="font-bold text-gray-800 mb-3">일정 정보</h4>

                <div class="flex items-center gap-4 mb-4">
                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                        심사 날짜 <span class="text-red-600">*</span>
                    </label>
                    <input type="date"
                           id="exam-date"
                           value="${schedule.examDate}"
                           disabled
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed">

                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                        심사 시간 <span class="text-red-600">*</span>
                    </label>
                    <input type="time"
                           id="exam-time"
                           value="${schedule.examTime}"
                           disabled
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed">

                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                        소요 시간 (분) <span class="text-red-600">*</span>
                    </label>
                    <select id="exam-duration"
                            disabled
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed">
                        <option value="30" ${schedule.duration === 30 ? 'selected' : ''}>30분</option>
                        <option value="60" ${schedule.duration === 60 ? 'selected' : ''}>60분</option>
                        <option value="90" ${schedule.duration === 90 ? 'selected' : ''}>90분</option>
                        <option value="120" ${schedule.duration === 120 ? 'selected' : ''}>120분</option>
                    </select>
                </div>
            </div>

            <!-- 진행 방식 -->
            <div class="mb-6">
                <h4 class="font-bold text-gray-800 mb-3">진행 방식</h4>

                <div class="flex items-center gap-4 mb-4">
                    <label class="flex items-center cursor-not-allowed">
                        <input type="radio"
                               name="exam-method"
                               value="online"
                               ${schedule.method === 'online' ? 'checked' : ''}
                               disabled
                               class="mr-2">
                        <span class="text-sm font-medium text-gray-700">온라인 (Zoom)</span>
                    </label>

                    <label class="flex items-center cursor-not-allowed">
                        <input type="radio"
                               name="exam-method"
                               value="offline"
                               ${schedule.method === 'offline' ? 'checked' : ''}
                               disabled
                               class="mr-2">
                        <span class="text-sm font-medium text-gray-700">오프라인</span>
                    </label>
                </div>

                <!-- 온라인 정보 -->
                <div id="online-fields" class="mb-4" style="display: ${schedule.method === 'online' ? 'block' : 'none'};">
                    <div class="p-4 bg-[#FAF6F1] border border-[#E8E0D8] rounded-lg">
                        <h5 class="font-medium text-gray-800 mb-3">온라인 회의 정보</h5>

                        <!-- 회의 링크 (1행, 전체 width) -->
                        <div class="mb-3">
                            <label class="block text-xs text-gray-600 mb-1">회의 링크</label>
                            <input type="url"
                                   value="${schedule.onlineInfo?.meetingUrl || ''}"
                                   placeholder="https://zoom.us/j/..."
                                   disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>

                        <!-- 회의 ID + 비밀번호 (2행, 2열 그리드) -->
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">회의 ID</label>
                                <input type="text"
                                       value="${schedule.onlineInfo?.meetingId || ''}"
                                       placeholder="123 456 7890"
                                       disabled
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                            </div>

                            <div>
                                <label class="block text-xs text-gray-600 mb-1">비밀번호 (선택)</label>
                                <input type="text"
                                       value="${schedule.onlineInfo?.password || ''}"
                                       placeholder="비밀번호"
                                       disabled
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 오프라인 정보 -->
                <div id="offline-fields" style="display: ${schedule.method === 'offline' ? 'block' : 'none'};">
                    <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h5 class="font-medium text-gray-800 mb-3">오프라인 장소 정보</h5>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">장소</label>
                            <input type="text"
                                   value="${schedule.offlineInfo?.location || ''}"
                                   placeholder="예: 제1공학관 301호"
                                   disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 전역 함수 등록
window.renderStudentExamScheduleScreen = renderStudentExamScheduleScreen;
window.filterStudentExamSchedule = filterStudentExamSchedule;
window.showStudentExamScheduleDetail = showStudentExamScheduleDetail;
window.backToStudentExamScheduleList = backToStudentExamScheduleList;

console.log('✅ student-exam-schedule.js 로드 완료');
