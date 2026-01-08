// ===================================
// 학기별 논문지도 계획 관리 V2 (댓글 방식 실적 입력)
// ===================================

let currentStudentIdV2 = null; // 현재 선택된 학생 ID (V2)
let currentSemesterView = { year: 2025, semester: 1 };
let availableSemesters = []; // 조회 가능한 학기 목록

// ==================== 학기별 상세 화면 (통합) ====================
function showSemesterGuidanceDetail(studentId) {
    currentStudentIdV2 = studentId;

    const student = DataService.getStudentDetail(studentId);
    if (!student) return;

    // 학생의 모든 학기 계획 조회
    const allPlans = DataService.getAllSemesterPlans(studentId);

    // 사용 가능한 학기 목록 생성 (최근 5년)
    availableSemesters = generateAvailableSemesters(allPlans);

    // 현재 선택된 학기 (기본값: 가장 최근 학기 또는 현재 학기)
    if (allPlans.length > 0) {
        const latestPlan = allPlans.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.semester - a.semester;
        })[0];
        currentSemesterView = { year: latestPlan.year, semester: latestPlan.semester };
    } else {
        // 계획이 없으면 현재 학기로 설정
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentSemester = (currentMonth >= 3 && currentMonth <= 8) ? 1 : 2;
        currentSemesterView = { year: currentYear, semester: currentSemester };
    }

    const contentArea = document.getElementById('guidance-content-area');
    if (!contentArea) return;

    contentArea.innerHTML = renderSemesterDetailScreen(student, allPlans);
}

// 사용 가능한 학기 목록 생성 (최근 5년)
function generateAvailableSemesters(existingPlans) {
    const currentYear = new Date().getFullYear();
    const semesters = [];

    for (let y = currentYear; y >= currentYear - 4; y--) {
        for (let s = 1; s <= 2; s++) {
            const hasPlan = existingPlans.some(p => p.year === y && p.semester === s);
            semesters.push({
                year: y,
                semester: s,
                hasPlan: hasPlan,
                label: `${y}학년도 ${s}학기${hasPlan ? ' ✓' : ''}`
            });
        }
    }

    return semesters;
}

// ==================== 통합 화면 렌더링 ====================
function renderSemesterDetailScreen(student, allPlans) {
    const currentPlan = allPlans.find(p =>
        p.year === currentSemesterView.year && p.semester === currentSemesterView.semester
    );

    const advisors = DataService.getStudentAdvisors(currentStudentIdV2);
    const currentProf = DataService.getCurrentProfessor();

    // 학기 계획 데이터 가져오기
    const semesterPlan = DataService.getSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester
    );
    const totalWeeks = semesterPlan?.totalWeeks || 0;

    // totalWeeks가 설정되어 있으면 주차 생성, 없으면 빈 배열
    const weeks = totalWeeks > 0
        ? (currentPlan ? currentPlan.weeks : generateEmptyWeeks(totalWeeks))
        : [];

    return `
        <!-- 뒤로가기 -->
        <div class="mb-4">
            <button onclick="showStudentList()" class="back-to-list-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                목록으로 돌아가기
            </button>
        </div>

        <!-- 학생 정보 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="px-6 py-4 border-b bg-gray-50">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
                <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                        <span class="text-gray-900 font-medium">${student.universityType || '일반대학원'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                        <span class="text-gray-900 font-medium">${student.college || '공학계열'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                        <span class="text-gray-900 font-medium">${student.undergraduate || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                        <span class="text-gray-900 font-medium">${student.major}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                        <span class="text-gray-900 font-medium">${getDegreeText(student.degree)}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                        <span class="text-gray-900 font-medium">${student.status || '재학'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학번:</span>
                        <span class="text-gray-900 font-medium">${student.studentId}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                        <span class="text-gray-900 font-medium">${student.name}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                        <span class="text-gray-900 font-medium">${advisors.map(a => a.name).join(', ')}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 학기 선택 카드 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600 min-w-[60px]">학년도:</label>
                    <select id="select-year" onchange="changeSemesterView()"
                            class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                        ${Array.from(new Set(availableSemesters.map(s => s.year)))
                            .map(y => `<option value="${y}" ${y === currentSemesterView.year ? 'selected' : ''}>${y}학년도</option>`)
                            .join('')}
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600 min-w-[60px]">학기:</label>
                    <select id="select-semester" onchange="changeSemesterView()"
                            class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                        ${availableSemesters
                            .filter(s => s.year === currentSemesterView.year)
                            .map(s => `<option value="${s.semester}" ${s.semester === currentSemesterView.semester ? 'selected' : ''}>${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
                            .join('')}
                    </select>
                </div>
                <div class="flex items-center gap-3 ml-auto">
                    <button onclick="resetTotalWeeks()"
                            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium">
                        ${totalWeeks > 0 ? '계획 초기화' : '계획 생성'}
                    </button>
                    <button onclick="saveAllWeekPlans()"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium">
                        전체 저장
                    </button>
                    <button onclick="approveSemesterPlan()"
                            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-medium">
                        계획 승인
                    </button>
                </div>
            </div>
        </div>

        <!-- 주차별 지도 계획 및 실적 -->
        ${renderWeeklyCards(weeks, advisors, currentProf, currentPlan)}
    `;
}

// 빈 15주차 구조 생성
function generateEmptyWeeks(count) {
    const weeks = [];
    for (let i = 1; i <= count; i++) {
        weeks.push({
            week: i,
            plannedDate: null,  // 학사시스템에서 조회
            plannedTopic: '',
            plannedContent: '',
            plannedMethod: 'meeting',
            executions: []
        });
    }
    return weeks;
}

// 학기 선택 변경
function changeSemesterView() {
    const year = parseInt(document.getElementById('select-year').value);
    const semester = parseInt(document.getElementById('select-semester').value);

    currentSemesterView = { year, semester };

    // 화면 새로고침
    showSemesterGuidanceDetail(currentStudentIdV2);
}

// ==================== 주차별 테이블 렌더링 (계획 유무 무관) ====================
function renderWeeklyCards(weeks, advisors, currentProf, existingPlan) {
    // 주차가 없으면 안내 메시지 표시
    if (weeks.length === 0) {
        return `
            <div class="space-y-4">
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-gray-800">주차별 지도 계획 및 실적</h3>
                </div>
                <div class="bg-white rounded-lg shadow-md p-8">
                    <div class="text-center text-gray-500">
                        <p class="text-lg mb-2">📅 이 학기의 지도 계획이 아직 생성되지 않았습니다.</p>
                        <p class="text-sm">상단의 "계획 생성" 버튼을 클릭하여 계획을 생성하세요.</p>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="space-y-4">
            <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-800">주차별 지도 계획 및 실적</h3>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700" rowspan="2" style="width: 60px;">주차</th>
                                <th class="border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700" colspan="3">계획</th>
                                <th class="border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700" colspan="5">실적</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700" rowspan="2" style="width: 60px;">작업</th>
                            </tr>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600" style="width: 200px;">주제</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600">계획 내용</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600" style="width: 80px;">예정 지도 방식</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600">실행 내용</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600" style="width: 80px;">교수명</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600">교수의견</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600" style="width: 90px;">실행일</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600" style="width: 80px;">지도 방식</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${weeks.map(week => renderWeekCard(week, advisors, currentProf, existingPlan, currentStudentIdV2)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Card View -->
            <div class="block md:hidden space-y-4">
                ${weeks.map(week => renderWeekCardMobile(week, advisors, currentProf, existingPlan, currentStudentIdV2)).join('')}
            </div>
        </div>
    `;
}

// 개별 주차 테이블 행 렌더링 (교수용 - 수정 가능)
function renderWeekCard(week, advisors, currentProf, plan, studentId) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const hasPlan = week.plannedTopic && week.plannedTopic.trim() !== '';

    // 실적이 있으면 실적 수 + 1 (입력 폼), 없으면 2 (빈 실적 행 + 입력 폼)
    const rowCount = hasExecutions ? week.executions.length + 1 : 2;

    // 첫 번째 행 (계획 정보는 rowspan 적용)
    // 계획은 항상 textarea/input으로 수정 가능하도록 표시
    let firstRow = `
        <tr>
            <td class="border border-gray-300 px-2 py-2 text-center font-semibold" rowspan="${rowCount}">${week.week}주</td>
            <td class="border border-gray-300 px-2 py-2" rowspan="${rowCount}">
                <input type="text" id="plan-topic-${week.week}"
                       value="${week.plannedTopic || ''}"
                       placeholder="주제 입력"
                       class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
            </td>
            <td class="border border-gray-300 px-2 py-2" rowspan="${rowCount}">
                <textarea id="plan-content-${week.week}"
                          placeholder="계획 내용 입력"
                          class="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none focus:outline-none auto-expand-textarea"
                          style="min-height: 40px; overflow-y: hidden;">${week.plannedContent || ''}</textarea>
            </td>
            <td class="border border-gray-300 px-2 py-2 text-center" rowspan="${rowCount}">
                <select id="plan-method-${week.week}" class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
                    <option value="meeting" ${week.plannedMethod === 'meeting' ? 'selected' : ''}>대면</option>
                    <option value="online" ${week.plannedMethod === 'online' ? 'selected' : ''}>온라인</option>
                    <option value="zoom" ${week.plannedMethod === 'zoom' || !week.plannedMethod ? 'selected' : ''}>Zoom</option>
                    <option value="email" ${week.plannedMethod === 'email' ? 'selected' : ''}>이메일</option>
                    <option value="phone" ${week.plannedMethod === 'phone' ? 'selected' : ''}>전화</option>
                </select>
            </td>`;

    if (hasExecutions) {
        // 첫 번째 실적을 첫 행에 포함
        const firstExec = week.executions[0];
        const isMyExecution = firstExec.professorId === currentProf.id;
        firstRow += `
            <td class="border border-gray-300 px-2 py-2">
                <textarea readonly
                          class="w-full border-0 bg-transparent text-sm px-1 py-1 resize-none focus:outline-none auto-expand-textarea"
                          style="min-height: 40px; overflow-y: hidden;">${firstExec.executionContent || ''}</textarea>
            </td>
            <td class="border border-gray-300 px-2 py-2 text-center text-sm">
                ${firstExec.professorName || '-'}
            </td>
            <td class="border border-gray-300 px-2 py-2">
                <textarea readonly
                          class="w-full border-0 bg-transparent text-sm px-1 py-1 resize-none focus:outline-none auto-expand-textarea"
                          style="min-height: 40px; overflow-y: hidden;">${firstExec.comment || ''}</textarea>
            </td>
            <td class="border border-gray-300 px-2 py-2 text-center text-xs">${formatDate(firstExec.executionDate)}</td>
            <td class="border border-gray-300 px-2 py-2 text-center text-xs">${getMethodText(firstExec.method)}</td>
            <td class="border border-gray-300 px-2 py-2 text-center">
                ${isMyExecution ? `
                    <button onclick="deleteExecutionV2('${studentId}', ${currentSemesterView.year}, ${currentSemesterView.semester}, ${week.week}, '${firstExec.executionId}')"
                            class="text-xs text-red-600 hover:underline">삭제</button>
                ` : '-'}
            </td>
        `;
    } else {
        // 실적이 없는 경우: 빈 실적 셀 6개 추가 (작업 컬럼 제외)
        firstRow += `
            <td class="border border-gray-300 px-2 py-2"></td>
            <td class="border border-gray-300 px-2 py-2"></td>
            <td class="border border-gray-300 px-2 py-2"></td>
            <td class="border border-gray-300 px-2 py-2"></td>
            <td class="border border-gray-300 px-2 py-2"></td>
            <td class="border border-gray-300 px-2 py-2"></td>
        `;
    }
    firstRow += `</tr>`;

    // 추가 실적 행들 (2번째 실적부터)
    let additionalRows = '';
    if (hasExecutions && week.executions.length > 1) {
        additionalRows = week.executions.slice(1).map(exec => {
            const isMyExecution = exec.professorId === currentProf.id;
            return `
                <tr>
                    <td class="border border-gray-300 px-2 py-2">
                        <textarea readonly
                                  class="w-full border-0 bg-transparent text-sm px-1 py-1 resize-none focus:outline-none auto-expand-textarea"
                                  style="min-height: 40px; overflow-y: hidden;">${exec.executionContent || ''}</textarea>
                    </td>
                    <td class="border border-gray-300 px-2 py-2 text-center text-sm">
                        ${exec.professorName || '-'}
                    </td>
                    <td class="border border-gray-300 px-2 py-2">
                        <textarea readonly
                                  class="w-full border-0 bg-transparent text-sm px-1 py-1 resize-none focus:outline-none auto-expand-textarea"
                                  style="min-height: 40px; overflow-y: hidden;">${exec.comment || ''}</textarea>
                    </td>
                    <td class="border border-gray-300 px-2 py-2 text-center text-xs">${formatDate(exec.executionDate)}</td>
                    <td class="border border-gray-300 px-2 py-2 text-center text-xs">${getMethodText(exec.method)}</td>
                    <td class="border border-gray-300 px-2 py-2 text-center">
                        ${isMyExecution ? `
                            <button onclick="deleteExecutionV2('${studentId}', ${currentSemesterView.year}, ${currentSemesterView.semester}, ${week.week}, '${exec.executionId}')"
                                    class="text-xs text-red-600 hover:underline">삭제</button>
                        ` : '-'}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // 실적 추가 입력 폼 행
    const today = getTodayDate();
    const inputFormRow = `
        <tr class="bg-gray-50">
            <td class="border border-gray-300 px-2 py-2">
                <textarea id="exec-content-${week.week}"
                          placeholder="실행 내용 입력"
                          class="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none auto-expand-textarea"
                          style="min-height: 40px; overflow-y: hidden;"></textarea>
            </td>
            <td class="border border-gray-300 px-2 py-2 text-center text-xs"></td>
            <td class="border border-gray-300 px-2 py-2">
                <textarea id="exec-comment-${week.week}"
                          placeholder="교수 의견 입력"
                          class="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none auto-expand-textarea"
                          style="min-height: 40px; overflow-y: hidden;"></textarea>
            </td>
            <td class="border border-gray-300 px-2 py-2">
                <input type="date" id="exec-date-${week.week}" value="${today}"
                       class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none">
            </td>
            <td class="border border-gray-300 px-2 py-2">
                <select id="exec-method-${week.week}" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none">
                    <option value="meeting">대면</option>
                    <option value="online">온라인</option>
                    <option value="zoom">Zoom</option>
                    <option value="email">이메일</option>
                    <option value="phone">전화</option>
                </select>
            </td>
            <td class="border border-gray-300 px-2 py-2 text-center">
                <button onclick="addExecutionV2(${week.week})"
                        class="text-xs text-blue-600 hover:underline">+ 추가</button>
            </td>
        </tr>
    `;

    return firstRow + additionalRows + inputFormRow;
}

// 모바일 카드 뷰 렌더링 (교수용)
function renderWeekCardMobile(week, advisors, currentProf, plan, studentId) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const hasPlan = week.plannedTopic && week.plannedTopic.trim() !== '';

    return `
        <div class="bg-white border border-gray-200 rounded-lg">
            ${hasPlan ? `
                <!-- 계획 표시 영역 -->
                <div class="p-4 bg-gray-50 border-b border-gray-200">
                    <div class="mb-3">
                        <span class="text-base font-semibold text-gray-800">${week.week}주차</span>
                        <span class="text-gray-400 mx-2">-</span>
                        <span class="text-base font-medium text-gray-800">${week.plannedTopic}</span>
                        <span class="text-xs px-2 py-1 rounded ${getMethodBadgeClass(week.plannedMethod)} ml-2">
                            ${getMethodText(week.plannedMethod)}
                        </span>
                    </div>
                    <div class="mb-2">
                        <span class="text-sm font-semibold text-gray-700">계획 내용:</span>
                        <p class="text-sm text-gray-700 mt-1">${week.plannedContent}</p>
                    </div>
                </div>
            ` : `
                <!-- 계획 입력 폼 -->
                ${renderWeekPlanInputForm(week.week)}
            `}

            <!-- 실적 목록 -->
            <div class="p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">
                    실적 및 교수의견 (${week.executions.length}건)
                </h4>

                <!-- 기존 실적 목록 -->
                ${week.executions.length > 0 ? `
                    <div class="space-y-3 mb-4">
                        ${week.executions.map(exec => renderExecutionComment(exec, currentProf, week.week, studentId)).join('')}
                    </div>
                ` : ''}

                <!-- 실적 추가 폼 -->
                ${renderExecutionInputForm(week.week, currentProf)}
            </div>
        </div>
    `;
}

// 실적 댓글 렌더링
function renderExecutionComment(execution, currentProf, weekNumber, studentId) {
    const isMyExecution = execution.professorId === currentProf.id;

    return `
        <div class="execution-comment ${isMyExecution ? 'bg-[#FCE4EC] border-[#F8BBD9]' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <div class="text-sm font-semibold ${isMyExecution ? 'text-[#6A0028]' : 'text-gray-800'}">
                        ${execution.professorName} ${isMyExecution ? '(나)' : ''}
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <span>${formatDateWithTime(execution.executionDate)}</span>
                        <span>•</span>
                        <span class="px-2 py-0.5 rounded ${getMethodBadgeClass(execution.method)}">
                            ${getMethodText(execution.method)}
                        </span>
                    </div>
                </div>
                ${isMyExecution ? `
                    <div class="flex gap-2">
                        <button onclick="editExecutionInlineV2('${studentId}', ${currentSemesterView.year}, ${currentSemesterView.semester}, ${weekNumber}, '${execution.executionId}')"
                                class="text-xs text-[#6A0028] hover:text-[#6A0028]">
                            수정
                        </button>
                        <button onclick="deleteExecutionV2('${studentId}', ${currentSemesterView.year}, ${currentSemesterView.semester}, ${weekNumber}, '${execution.executionId}')"
                                class="text-xs text-red-600 hover:text-red-800">
                            삭제
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="space-y-2 mt-3">
                <div>
                    <span class="text-xs font-semibold text-gray-600">실행 내용:</span>
                    <p class="text-sm text-gray-800 mt-1">${execution.executionContent}</p>
                </div>
                <div>
                    <span class="text-xs font-semibold text-gray-600">교수 의견:</span>
                    <p class="text-sm text-gray-800 mt-1">${execution.comment}</p>
                </div>
            </div>
        </div>
    `;
}

// 실적 추가 인라인 폼
function renderExecutionInputForm(weekNumber, currentProf) {
    const today = getTodayDate();

    return `
        <div class="execution-input-form bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="mb-2">
                <span class="text-sm font-semibold text-gray-700">${currentProf.name} 교수 - 실적 추가</span>
            </div>
            <div class="space-y-3">
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <label class="block text-xs text-gray-600 mb-1">실행일 *</label>
                            <input type="date" id="exec-date-${weekNumber}" value="${today}"
                                   class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                        </div>
                        <div class="flex-1">
                            <label class="block text-xs text-gray-600 mb-1">지도 방식 *</label>
                            <select id="exec-method-${weekNumber}" class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                                <option value="meeting">대면</option>
                                <option value="online">온라인</option>
                                <option value="zoom">Zoom</option>
                                <option value="email">이메일</option>
                                <option value="phone">전화</option>
                            </select>
                        </div>
                        <button onclick="addExecutionV2(${weekNumber})"
                                class="bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#8A0034] font-semibold flex items-center gap-1 whitespace-nowrap">
                            <i class="fas fa-plus-circle"></i>
                            실적 추가
                        </button>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">실행 내용 *</label>
                        <textarea id="exec-content-${weekNumber}" rows="2"
                                  placeholder="실제로 지도한 내용을 입력하세요"
                                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">교수 의견 *</label>
                        <textarea id="exec-comment-${weekNumber}" rows="2"
                                  placeholder="학생의 이해도, 진행 상황 등에 대한 의견을 입력하세요"
                                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
                    </div>
                </div>
        </div>
    `;
}

// 주차별 계획 입력 폼 (인라인)
function renderWeekPlanInputForm(weekNumber) {
    return `
        <div class="p-4 bg-yellow-50 border-b border-yellow-200">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">${weekNumber}주차 계획</h4>
            <div class="space-y-3">
                <div>
                    <label class="block text-xs text-gray-600 mb-1">지도 주제 *</label>
                    <input type="text" id="plan-topic-${weekNumber}"
                           placeholder="예: 연구방법론 개요"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-xs text-gray-600 mb-1">계획 내용 *</label>
                    <textarea id="plan-content-${weekNumber}" rows="3"
                              placeholder="이번 주차에 지도할 내용을 상세히 입력하세요"
                              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
                </div>
                <div class="flex justify-between items-end gap-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[100px]">예정 지도 방식:</label>
                        <select id="plan-method-${weekNumber}"
                                class="border border-gray-300 rounded px-3 py-2 text-sm">
                            <option value="meeting">대면</option>
                            <option value="online">온라인</option>
                            <option value="zoom" selected>Zoom</option>
                            <option value="email">이메일</option>
                            <option value="phone">전화</option>
                        </select>
                    </div>
                    <button onclick="saveWeekPlan(${weekNumber})"
                            class="bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#8A0034] font-semibold flex items-center gap-1">
                        <i class="fas fa-save"></i>
                        계획 저장
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==================== 실적 추가 (인라인) ====================
function addExecutionV2(weekNumber) {
    const executionDate = document.getElementById(`exec-date-${weekNumber}`).value;
    const method = document.getElementById(`exec-method-${weekNumber}`).value;
    const content = document.getElementById(`exec-content-${weekNumber}`).value.trim();
    const comment = document.getElementById(`exec-comment-${weekNumber}`).value.trim();

    if (!executionDate || !content || !comment) {
        showToast('모든 필수 항목을 입력해주세요.', 'warning');
        return;
    }

    const currentProf = DataService.getCurrentProfessor();

    const executionData = {
        professorId: currentProf.id,
        professorName: currentProf.name,
        executionDate,
        executionContent: content,
        comment: comment,
        method: method
    };

    try {
        DataService.addExecution(
            currentStudentIdV2,
            currentSemesterView.year,
            currentSemesterView.semester,
            weekNumber,
            executionData
        );

        showToast(`${weekNumber}주차 실적이 추가되었습니다.`, 'success');

        // 화면 새로고침
        setTimeout(() => {
            showSemesterGuidanceDetail(currentStudentIdV2);
        }, 300);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 실적 삭제
function deleteExecutionV2(studentId, year, semester, week, executionId) {
    if (!confirm(`${week}주차 실적을 삭제하시겠습니까?`)) return;

    try {
        DataService.deleteExecution(studentId, year, semester, week, executionId);
        showToast(`${week}주차 실적이 삭제되었습니다.`, 'success');

        setTimeout(() => {
            showSemesterGuidanceDetail(studentId);
        }, 300);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== 주차별 계획 저장 (인라인) ====================
function saveWeekPlan(weekNumber) {
    const topic = document.getElementById(`plan-topic-${weekNumber}`).value.trim();
    const content = document.getElementById(`plan-content-${weekNumber}`).value.trim();
    const method = document.getElementById(`plan-method-${weekNumber}`).value;

    if (!topic || !content) {
        showToast('지도 주제와 계획 내용을 모두 입력해주세요.', 'warning');
        return;
    }

    const planData = {
        plannedTopic: topic,
        plannedContent: content,
        plannedMethod: method,
        plannedDate: null  // 학사시스템에서 자동 설정
    };

    try {
        DataService.updateWeekPlan(
            currentStudentIdV2,
            currentSemesterView.year,
            currentSemesterView.semester,
            weekNumber,
            planData
        );

        showToast(`${weekNumber}주차 계획이 저장되었습니다.`, 'success');

        // 화면 새로고침
        setTimeout(() => {
            showSemesterGuidanceDetail(currentStudentIdV2);
        }, 300);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== 전체 계획 일괄 저장 ====================
function saveAllWeekPlans() {
    // 현재 학기의 주차 수를 동적으로 가져오기
    const semesterPlan = DataService.getSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester
    );
    const totalWeeks = semesterPlan?.totalWeeks || 15;
    let savedCount = 0;
    let emptyCount = 0;

    for (let week = 1; week <= totalWeeks; week++) {
        const topicEl = document.getElementById(`plan-topic-${week}`);
        const contentEl = document.getElementById(`plan-content-${week}`);
        const methodEl = document.getElementById(`plan-method-${week}`);

        if (!topicEl || !contentEl || !methodEl) continue;

        const topic = topicEl.value.trim();
        const content = contentEl.value.trim();
        const method = methodEl.value;

        // 빈 주차는 건너뜀
        if (!topic && !content) {
            emptyCount++;
            continue;
        }

        // 주제나 내용 중 하나만 있으면 경고
        if (!topic || !content) {
            showToast(`${week}주차: 지도 주제와 계획 내용을 모두 입력해주세요.`, 'warning');
            return;
        }

        const planData = {
            plannedTopic: topic,
            plannedContent: content,
            plannedMethod: method,
            plannedDate: null
        };

        try {
            DataService.updateWeekPlan(
                currentStudentIdV2,
                currentSemesterView.year,
                currentSemesterView.semester,
                week,
                planData
            );
            savedCount++;
        } catch (error) {
            showToast(`${week}주차 저장 실패: ${error.message}`, 'error');
            return;
        }
    }

    if (savedCount === 0) {
        showToast('저장할 계획이 없습니다.', 'warning');
        return;
    }

    showToast(`총 ${savedCount}개 주차 계획이 저장되었습니다.`, 'success');

    // 화면 새로고침
    setTimeout(() => {
        showSemesterGuidanceDetail(currentStudentIdV2);
    }, 500);
}

// ==================== 주차 설정/초기화 ====================
function resetTotalWeeks() {
    const semesterPlan = DataService.getSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester
    );
    const currentWeeks = semesterPlan?.totalWeeks || 0;
    const hasPlans = currentWeeks > 0;

    // 주차 선택 옵션 생성 (1~15)
    const weekOptions = Array.from({ length: 15 }, (_, i) => i + 1)
        .map(week => `<option value="${week}" ${week === currentWeeks || (!hasPlans && week === 15) ? 'selected' : ''}>${week}주</option>`)
        .join('');

    const modalTitle = hasPlans ? '계획 초기화' : '계획 생성';

    const modalContent = `
        <form id="reset-weeks-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">${hasPlans ? '새로운 총 주차 선택' : '총 주차 선택'} *</label>
                <select name="newTotalWeeks" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    ${weekOptions}
                </select>
                ${hasPlans ? `<p class="text-xs text-gray-500 mt-1">현재: ${currentWeeks}주</p>` : ''}
            </div>

            ${hasPlans ? `
            <div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-xs text-blue-800">
                    💡 초기화하면 해당 학기의 계획과 실적이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
            </div>
            ` : ''}
        </form>
    `;

    window.openModal(modalTitle, modalContent, hasPlans ? '초기화 실행' : '생성', () => executeResetWeeks(), true);
}

// 주차 설정/초기화 실행
function executeResetWeeks() {
    const form = document.getElementById('reset-weeks-form');
    const formData = new FormData(form);
    const newTotalWeeks = parseInt(formData.get('newTotalWeeks'));

    if (!newTotalWeeks || newTotalWeeks < 1 || newTotalWeeks > 15) {
        showToast('올바른 주차 수를 선택해주세요 (1~15주)', 'warning');
        window.closeModal();
        return;
    }

    const semesterPlan = DataService.getSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester
    );
    const currentWeeks = semesterPlan?.totalWeeks || 0;
    const plans = semesterPlan?.plans || [];
    const hasPlans = currentWeeks > 0;

    // 최종 확인
    if (hasPlans && plans.length > 0) {
        const confirmed = confirm(`⚠️ 계획 초기화 확인\n\n현재 입력된 모든 계획 및 실적 ${plans.length}건이 삭제됩니다.\n새로운 ${newTotalWeeks}주 구조로 초기화됩니다.\n\n이 작업은 되돌릴 수 없습니다.\n정말 초기화하시겠습니까?`);
        if (!confirmed) {
            window.closeModal();
            return;
        }
    }

    // DataService를 통해 초기화
    DataService.resetSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester,
        newTotalWeeks
    );

    // 모달 강제 닫기
    const modal = document.getElementById('universal-modal');
    const backdrop = document.getElementById('modal-backdrop');
    if (modal) modal.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');

    const message = hasPlans
        ? `지도 계획이 ${newTotalWeeks}주로 초기화되었습니다.`
        : `지도 계획이 ${newTotalWeeks}주로 생성되었습니다.`;

    showToast(message, 'success');

    // 화면 새로고침
    setTimeout(() => {
        showSemesterGuidanceDetail(currentStudentIdV2);
    }, 500);
}

// ==================== 학기 계획 승인 ====================
function approveSemesterPlan() {
    if (!confirm('이 학기의 지도 계획을 승인하시겠습니까?')) {
        return;
    }

    try {
        // DataService에 승인 처리 추가 필요
        // 현재는 간단히 상태 업데이트만 수행
        const approvalData = {
            approved: true,
            approvedBy: currentProf.name,
            approvedDate: new Date().toISOString()
        };

        // 실제 구현시 DataService.approveSemesterPlan() 호출
        console.log('승인 처리:', {
            studentId: currentStudentIdV2,
            year: currentSemesterView.year,
            semester: currentSemesterView.semester,
            ...approvalData
        });

        showToast('학기 계획이 승인되었습니다.', 'success');

        // 화면 새로고침
        setTimeout(() => {
            showSemesterGuidanceDetail(currentStudentIdV2);
        }, 500);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== 유틸리티 ====================
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
}

function formatDateWithTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}월 ${day}일`;
}

function getDegreeText(degree) {
    const map = { 'master': '석사', 'doctor': '박사' };
    return map[degree] || degree;
}

function getStageText(stage) {
    const map = {
        'plan': '연구계획서',
        'mid': '중간논문',
        'final': '최종논문'
    };
    return map[stage] || stage;
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

// ========== Auto-expanding Textarea 기능 ==========

/**
 * 텍스트 영역 자동 확장 기능
 * 내용이 많아지면 textarea가 세로로 자동 확장됨
 */
function initAutoExpandTextareas() {
    // 이벤트 위임 방식으로 동적으로 추가된 textarea도 처리
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('auto-expand-textarea')) {
            autoExpandTextarea(e.target);
        }
    });

    // 페이지 로드 시 기존 textarea 모두 확장
    document.addEventListener('DOMContentLoaded', function() {
        expandAllTextareas();
    });
}

/**
 * 개별 textarea 자동 확장
 */
function autoExpandTextarea(textarea) {
    // 높이를 auto로 초기화하여 scrollHeight를 정확히 측정
    textarea.style.height = 'auto';

    // 내용에 맞게 높이 조정 (최소 높이 40px)
    const newHeight = Math.max(40, textarea.scrollHeight);
    textarea.style.height = newHeight + 'px';
}

/**
 * 모든 auto-expand-textarea 확장
 */
function expandAllTextareas() {
    const textareas = document.querySelectorAll('.auto-expand-textarea');
    textareas.forEach(textarea => {
        autoExpandTextarea(textarea);
    });
}

// 학기 계획 상세 화면 렌더링 후 textarea 확장 적용
const originalShowSemesterDetail = showSemesterGuidanceDetail;
showSemesterGuidanceDetail = function(studentId) {
    originalShowSemesterDetail(studentId);
    // 렌더링 후 약간의 지연을 두고 확장 적용
    setTimeout(() => {
        expandAllTextareas();
    }, 100);
};

// 초기화 실행
initAutoExpandTextareas();

// Export
window.showSemesterGuidanceDetail = showSemesterGuidanceDetail;
window.changeSemesterView = changeSemesterView;
window.addExecutionV2 = addExecutionV2;
window.deleteExecutionV2 = deleteExecutionV2;
window.saveWeekPlan = saveWeekPlan;
window.saveAllWeekPlans = saveAllWeekPlans;
window.approveSemesterPlan = approveSemesterPlan;
window.resetTotalWeeks = resetTotalWeeks;
window.executeResetWeeks = executeResetWeeks;
window.autoExpandTextarea = autoExpandTextarea;
window.expandAllTextareas = expandAllTextareas;

console.log('✅ 학기별 논문지도 계획 V2 모듈 로드 완료 (댓글 방식)');
