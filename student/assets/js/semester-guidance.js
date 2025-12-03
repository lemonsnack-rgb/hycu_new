// ===================================
// 학생용 학기별 논문지도 현황 (읽기 전용)
// 교수용 semester-guidance-v2.js 기반
// ===================================

let currentSemesterView = { year: 2025, semester: 1 };
let availableSemesters = []; // 조회 가능한 학기 목록

// ==================== 학기별 상세 화면 (통합) ====================
function initSemesterGuidance() {

    const student = DataService.getStudent();
    if (!student) return;

    // 학생의 모든 학기 계획 조회
    const allPlans = DataService.getAllSemesterPlans();

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

    const contentArea = document.getElementById('guidance-screen');
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

    const advisors = [];
    const currentProf = {};

    // 계획이 없으면 빈 15주차 생성
    const weeks = currentPlan ? currentPlan.weeks : generateEmptyWeeks(15);

    return `
        
        
                <!-- 헤더 -->
        <div class="flex items-center mb-8">
            <div class="flex items-center gap-4">
                <button class="mobile-menu-toggle lg:hidden" onclick="toggleMobileMenu()"
                        style="padding: 0.5rem; background: none; border: none; cursor: pointer;">
                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">학기별 논문 지도 현황</h2>
            </div>
        </div>

<!-- 학기 선택 카드 -->
        <div class="bg-blue-50 rounded-lg p-6 mb-6">
            <div class="flex items-center gap-4 mb-4">
                <div>
                    <label class="block text-xs text-gray-600 mb-1">학년도</label>
                    <select id="select-year" onchange="changeSemesterViewStudent()"
                            class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                        ${Array.from(new Set(availableSemesters.map(s => s.year)))
                            .map(y => `<option value="${y}" ${y === currentSemesterView.year ? 'selected' : ''}>${y}학년도</option>`)
                            .join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-xs text-gray-600 mb-1">학기</label>
                    <select id="select-semester" onchange="changeSemesterViewStudent()"
                            class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                        ${availableSemesters
                            .filter(s => s.year === currentSemesterView.year)
                            .map(s => `<option value="${s.semester}" ${s.semester === currentSemesterView.semester ? 'selected' : ''}>${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
                            .join('')}
                    </select>
                </div>
            </div>
        </div>

        <!-- 주차별 지도 계획 및 실적 (항상 15주차 표시) -->
        ${renderWeeklyCards(weeks, currentPlan)}
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
function changeSemesterViewStudent() {
    const year = parseInt(document.getElementById('select-year').value);
    const semester = parseInt(document.getElementById('select-semester').value);

    currentSemesterView = { year, semester };

    // 화면 새로고침
    initSemesterGuidance();
}

// ==================== 주차별 카드 렌더링 (계획 유무 무관) ====================
function renderWeeklyCards(weeks, existingPlan) {
    return `
        <div class="space-y-4">
            <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-800">주차별 지도 계획 및 실적</h3>
            </div>

            ${weeks.map(week => renderWeekCard(week, existingPlan)).join('')}
        </div>
    `;
}

// 개별 주차 카드 (댓글 방식)
function renderWeekCard(week, plan) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const hasPlan = week.plannedTopic && week.plannedTopic.trim() !== '';

    return `
        <div class="week-card-v2 bg-white border border-gray-200 rounded-lg">
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
                        <div class="text-xs text-gray-500">
                            계획일: ${formatDate(week.plannedDate)}
                        </div>
                    </div>
                ` : `
                    <!-- 계획 입력 폼 -->
                    <div class="p-4 bg-gray-50 border-b border-gray-200">
                        <div class="mb-2">
                            <span class="text-base font-semibold text-gray-800">${week.week}주차</span>
                        </div>
                        <div class="text-sm text-gray-500 italic">
                            교수님께서 아직 계획을 작성하지 않으셨습니다.
                        </div>
                    </div>
                `}

                <!-- 실적 목록 (댓글 형태) -->
                <div class="p-4">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">
                        실적 및 교수의견 (${week.executions.length}건)
                    </h4>

                    <!-- 기존 실적 목록 -->
                    ${week.executions.length > 0 ? `
                        <div class="space-y-3 mb-4">
                            ${week.executions.map(exec => renderExecutionComment(exec)).join('')}
                        </div>
                    ` : ''}
                </div>
        </div>
    `;
}

// 실적 댓글 렌더링
function renderExecutionComment(execution) {
    return `
        <div class="execution-comment bg-gray-50 border-gray-200 border rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <div class="text-sm font-semibold text-gray-800">
                        ${execution.professorName}
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <span>${formatDateWithTime(execution.executionDate)}</span>
                        <span>•</span>
                        <span class="px-2 py-0.5 rounded ${getMethodBadgeClass(execution.method)}">
                            ${getMethodText(execution.method)}
                        </span>
                    </div>
                </div>
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
        'online': 'bg-blue-100 text-blue-700',
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
window.initGuidance = initSemesterGuidance;
window.initSemesterGuidance = initSemesterGuidance;
window.changeSemesterViewStudent = changeSemesterViewStudent;

console.log('✅ 학생용 학기별 논문 지도 현황 모듈 로드 완료 (읽기 전용)');
