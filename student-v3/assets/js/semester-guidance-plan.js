/**
 * 학생용 학기별 지도 계획
 * Version: 20260107003
 *
 * 기능:
 * - 본인의 학기별 지도 계획 조회
 * - 계획 생성/초기화 (학생도 가능)
 * - 교수 실적 조회 (읽기 전용)
 * - 실적 입력 불가 (교수 전용 기능 제외)
 *
 * 변경사항 (v003):
 * - 계획 생성 후 시스템 alert 제거
 * - 주차 바로가기 버튼 클릭 시 강조 효과 추가
 *
 * 변경사항 (v002):
 * - UI를 교수/관리자용과 완전히 동일하게 수정
 * - 학생 정보 카드: 관리자와 동일한 레이아웃 적용
 * - 학기 정보 섹션: 주차 바로가기 버튼 추가
 * - 주차 카드: 계획 섹션(노란색 배경) 추가
 * - 실적 카드: 댓글 형태로 변경
 */

let studentCurrentYear = 2025;
let studentCurrentSemester = 1;

// 학기별 계획 데이터 저장소 (임시)
const studentSemesterPlansStorage = {};

// DataService 확장 - 학생용 학기별 계획 관리
if (typeof DataService === 'undefined') {
    window.DataService = {};
}

// 학기별 계획 조회
DataService.getStudentSemesterPlan = function(year, semester) {
    const student = window.currentStudent || { id: 'S2024001' };
    const key = `${student.id}_${year}_${semester}`;
    return studentSemesterPlansStorage[key] || null;
};

// 학기별 계획 초기화/생성
DataService.resetStudentSemesterPlan = function(year, semester, totalWeeks) {
    const student = window.currentStudent || { id: 'S2024001' };
    const key = `${student.id}_${year}_${semester}`;
    studentSemesterPlansStorage[key] = {
        studentId: student.id,
        year,
        semester,
        totalWeeks,
        plans: []
    };
    return studentSemesterPlansStorage[key];
};

// ========== 모달 유틸리티 함수 ==========

function openStudentModal(title, content, confirmText = '저장', onConfirm = null, showFooter = true) {
    console.log('🔵 openStudentModal 호출됨', { title, confirmText });

    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalConfirm = document.getElementById('modal-confirm');
    const modal = document.getElementById('universal-modal');
    const backdrop = document.getElementById('modal-backdrop');

    if (!modalTitle || !modalContent || !modalConfirm || !modal || !backdrop) {
        console.error('모달 요소를 찾을 수 없습니다');
        return;
    }

    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    modalConfirm.textContent = confirmText;

    const footer = document.getElementById('modal-footer');
    if (footer) {
        if (!showFooter) {
            footer.classList.add('hidden');
        } else {
            footer.classList.remove('hidden');
        }
    }

    // 모달 표시
    modal.classList.remove('hidden');
    backdrop.classList.remove('hidden');

    // 취소 버튼에 직접 이벤트 리스너 연결
    const cancelBtn = document.getElementById('modal-cancel');
    const closeBtn = document.getElementById('modal-close');

    // 기존 이벤트 리스너 제거 후 재등록
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newCloseBtn = closeBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

    newCancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔴 취소 버튼 클릭됨');
        closeStudentModal();
    });

    newCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔴 X 버튼 클릭됨');
        closeStudentModal();
    });

    // backdrop 클릭 시 모달 닫기
    backdrop.onclick = (e) => {
        if (e.target === backdrop) {
            console.log('🔴 backdrop 클릭됨');
            closeStudentModal();
        }
    };

    // 확인 버튼에 이벤트 연결
    if (onConfirm) {
        const confirmBtn = document.getElementById('modal-confirm');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🟢 확인 버튼 클릭됨');
            onConfirm();
        });
    }

    console.log('✅ openStudentModal 완료');
}

function closeStudentModal() {
    console.log('closeStudentModal 호출됨');
    const modal = document.getElementById('universal-modal');
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
        modal.classList.add('hidden');
        console.log('✅ 모달 hidden 클래스 추가');
    }

    if (backdrop) {
        backdrop.classList.add('hidden');
        console.log('✅ backdrop hidden 클래스 추가');
    }
}

// ========== 학기별 지도 계획 함수 ==========

// 학생용 학기별 지도 계획 초기화
function initStudentSemesterGuidancePlan() {
    console.log('학생용 학기별 지도 계획 초기화');
    showStudentSemesterPlanDetail();
}

// 상세 화면 (본인 정보만 표시, 목록 화면 없음)
function showStudentSemesterPlanDetail() {
    const student = window.currentStudent || {
        id: 'S2024001',
        name: '홍길동',
        major: '컴퓨터공학과',
        degree: 'master',
        advisorName: '김교수'
    };

    // 학기별 계획 데이터 가져오기
    const semesterPlan = DataService.getStudentSemesterPlan(studentCurrentYear, studentCurrentSemester);
    const totalWeeks = semesterPlan?.totalWeeks || 0;
    const plans = semesterPlan?.plans || [];

    // 주차 구조 생성
    const weeks = generateStudentWeeks(plans, totalWeeks);

    const contentArea = document.getElementById('semester-guidance-plan-content');
    if (!contentArea) {
        console.error('semester-guidance-plan-content 요소를 찾을 수 없습니다');
        return;
    }

    contentArea.innerHTML = `
        <!-- 학생 정보 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
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
                        <span class="text-gray-900 font-medium">${student.major || '-'}</span>
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
                        <span class="text-gray-900 font-medium">재학</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학번:</span>
                        <span class="text-gray-900 font-medium">${student.id}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                        <span class="text-gray-900 font-medium">${student.name}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                        <span class="text-gray-900 font-medium">${student.advisorName || '-'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 학기 정보 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="px-6 py-4 bg-gray-50">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">학기 정보</h4>
                <div class="flex items-center gap-6 text-sm">
                    <div class="flex items-center gap-2">
                        <label class="text-gray-600 min-w-[60px]">학년도:</label>
                        <select id="student-select-year" onchange="changeStudentSemesterView()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            <option value="2025" ${studentCurrentYear === 2025 ? 'selected' : ''}>2025학년도</option>
                            <option value="2024" ${studentCurrentYear === 2024 ? 'selected' : ''}>2024학년도</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-gray-600 min-w-[60px]">학기:</label>
                        <select id="student-select-semester" onchange="changeStudentSemesterView()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            <option value="1" ${studentCurrentSemester === 1 ? 'selected' : ''}>1학기</option>
                            <option value="2" ${studentCurrentSemester === 2 ? 'selected' : ''}>2학기</option>
                        </select>
                    </div>
                    ${totalWeeks > 0 ? `
                    <div class="flex items-center gap-2">
                        <span class="text-gray-600">총 주차:</span>
                        <span class="text-gray-900 font-medium">${totalWeeks}주</span>
                    </div>
                    ` : `
                    <div class="flex items-center gap-2">
                        <span class="text-orange-600 text-sm">⚠ 아직 지도 계획이 생성되지 않았습니다.</span>
                    </div>
                    `}
                    <div class="ml-auto">
                        <button onclick="resetStudentTotalWeeks()"
                                class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            ${totalWeeks > 0 ? '계획 초기화' : '계획 생성'}
                        </button>
                    </div>
                </div>

                ${totalWeeks > 0 ? `
                <!-- 주차 바로가기 버튼 -->
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="flex items-center gap-2 mb-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-xs text-gray-500">주차를 클릭하면 해당 주차 카드로 이동합니다</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${Array.from({ length: totalWeeks }, (_, i) => i + 1).map(weekNum => `
                            <button onclick="scrollToWeek(${weekNum})"
                                    class="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:border-[#6A0028] hover:bg-[#FCE4EC] hover:text-[#6A0028] transition-colors">
                                ${weekNum}주
                            </button>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- 주차별 지도 계획 및 실적 -->
        ${totalWeeks > 0 ? renderStudentWeeklyCards(weeks) : ''}
    `;
}

// 주차 구조 생성 (교수용과 동일)
function generateStudentWeeks(plans, totalWeeks = 15) {
    const weeks = [];
    for (let i = 1; i <= totalWeeks; i++) {
        const weekPlans = plans.filter(p => p.week === i);

        const weekObj = {
            week: i,
            plannedDate: weekPlans[0]?.plannedDate || null,
            plannedTopic: weekPlans[0]?.plannedTopic || '',
            plannedContent: weekPlans[0]?.plannedContent || '',
            plannedMethod: weekPlans[0]?.plannedMethod || 'meeting',
            executions: []
        };

        weekPlans.forEach(plan => {
            if (plan.executionDate) {
                weekObj.executions.push({
                    id: plan.id,
                    professorId: plan.professorId || plan.advisor?.id,
                    professorName: plan.professorName || plan.advisor?.name,
                    executionDate: plan.executionDate,
                    method: plan.method || plan.actualMethod || plan.plannedMethod,
                    executionContent: plan.executionContent || '',
                    comment: plan.comment || plan.professorComment || ''
                });
            }
        });

        weeks.push(weekObj);
    }
    return weeks;
}

// 주차별 카드 렌더링
function renderStudentWeeklyCards(weeks) {
    return `
        <div class="space-y-4">
            <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-800">주차별 지도 계획 및 실적</h3>
            </div>

            ${weeks.map(week => renderStudentWeekCard(week)).join('')}
        </div>
    `;
}

// 개별 주차 카드 (학생용 - 실적 입력 불가, 읽기 전용)
function renderStudentWeekCard(week) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const hasPlan = week.plannedTopic && week.plannedTopic.trim() !== '';

    return `
        <div id="week-card-${week.week}" class="week-card-v2 bg-white border border-gray-200 rounded-lg">
                ${hasPlan ? `
                    <!-- 계획 표시 (읽기 전용) -->
                    <div class="p-4 bg-yellow-50 border-b border-yellow-200">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">${week.week}주차 계획</h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">지도 주제 *</label>
                                <input type="text" value="${week.plannedTopic}"
                                       placeholder="예: 연구방법론 개요" readonly
                                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100">
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">계획 내용 *</label>
                                <textarea rows="3" readonly
                                          placeholder="이번 주차에 지도할 내용을 상세히 입력하세요"
                                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100">${week.plannedContent}</textarea>
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">예정 지도 방식 *</label>
                                <select disabled class="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100">
                                    <option value="meeting" ${week.plannedMethod === 'meeting' ? 'selected' : ''}>대면</option>
                                    <option value="online" ${week.plannedMethod === 'online' ? 'selected' : ''}>온라인</option>
                                    <option value="zoom" ${week.plannedMethod === 'zoom' ? 'selected' : ''}>Zoom</option>
                                    <option value="email" ${week.plannedMethod === 'email' ? 'selected' : ''}>이메일</option>
                                    <option value="phone" ${week.plannedMethod === 'phone' ? 'selected' : ''}>전화</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ` : `
                    <!-- 계획 미입력 상태 -->
                    <div class="p-4 bg-yellow-50 border-b border-yellow-200">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">${week.week}주차 계획</h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">지도 주제 *</label>
                                <input type="text"
                                       placeholder="예: 연구방법론 개요" readonly
                                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100">
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">계획 내용 *</label>
                                <textarea rows="3" readonly
                                          placeholder="이번 주차에 지도할 내용을 상세히 입력하세요"
                                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100"></textarea>
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">예정 지도 방식 *</label>
                                <select disabled class="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100">
                                    <option value="meeting">대면</option>
                                    <option value="online">온라인</option>
                                    <option value="zoom" selected>Zoom</option>
                                    <option value="email">이메일</option>
                                    <option value="phone">전화</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `}

                <!-- 실적 목록 (댓글 형태, 읽기 전용) -->
                <div class="p-4">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">
                        실적 및 교수의견 (${week.executions.length}건)
                    </h4>

                    <!-- 기존 실적 목록 -->
                    ${week.executions.length > 0 ? `
                        <div class="space-y-3">
                            ${week.executions.map(exec => renderStudentExecutionComment(exec)).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-6 text-gray-400">
                            <p class="text-sm">등록된 지도 실적이 없습니다</p>
                        </div>
                    `}
                </div>
        </div>
    `;
}

// 실적 렌더링 (학생용 - 읽기 전용)
function renderStudentExecutionComment(execution) {
    return `
        <div id="execution-${execution.id}" class="execution-item bg-gray-50 border-gray-200 border rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-semibold text-gray-800">
                    ${execution.professorName}
                </span>
                <span class="text-xs text-gray-500">${execution.executionDate}</span>
            </div>

            <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2 text-gray-600">
                    <span class="font-medium">지도방식:</span>
                    <span>${getMethodText(execution.method)}</span>
                </div>
                <div>
                    <div class="font-medium text-gray-600 mb-1">실행 내용:</div>
                    <div class="text-gray-800 whitespace-pre-wrap">${execution.executionContent}</div>
                </div>
                <div>
                    <div class="font-medium text-gray-600 mb-1">교수 의견:</div>
                    <div class="text-gray-800 whitespace-pre-wrap">${execution.comment}</div>
                </div>
            </div>
        </div>
    `;
}

// 학기 변경
function changeStudentSemesterView() {
    const year = document.getElementById('student-select-year')?.value;
    const semester = document.getElementById('student-select-semester')?.value;

    if (year) studentCurrentYear = parseInt(year);
    if (semester) studentCurrentSemester = parseInt(semester);

    console.log(`학기 변경: ${studentCurrentYear}학년도 ${studentCurrentSemester}학기`);

    showStudentSemesterPlanDetail();
}

// 계획 생성/초기화
function resetStudentTotalWeeks() {
    const semesterPlan = DataService.getStudentSemesterPlan(studentCurrentYear, studentCurrentSemester);
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
                <label class="block text-sm font-medium text-gray-700 mb-2">총 주차 수</label>
                <select name="newTotalWeeks" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]">
                    ${weekOptions}
                </select>
                <p class="mt-2 text-xs text-gray-500">
                    학기별 지도 계획의 총 주차 수를 선택하세요 (1~15주)
                </p>
            </div>

            ${hasPlans ? `
            <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p class="text-xs text-yellow-800">
                    💡 초기화하면 해당 학기의 계획과 실적이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
            </div>
            ` : ''}
        </form>
    `;

    openStudentModal(modalTitle, modalContent, hasPlans ? '초기화 실행' : '생성', () => executeStudentResetWeeks());
}

// 계획 초기화/생성 실행
function executeStudentResetWeeks() {
    console.log('🟡 executeStudentResetWeeks 시작');

    const form = document.getElementById('reset-weeks-form');
    const formData = new FormData(form);
    const newTotalWeeks = parseInt(formData.get('newTotalWeeks'));

    if (!newTotalWeeks || newTotalWeeks < 1 || newTotalWeeks > 15) {
        alert('올바른 주차 수를 선택해주세요 (1~15주)');
        return;
    }

    const semesterPlan = DataService.getStudentSemesterPlan(studentCurrentYear, studentCurrentSemester);
    const currentWeeks = semesterPlan?.totalWeeks || 0;
    const plans = semesterPlan?.plans || [];
    const hasPlans = currentWeeks > 0;

    // 최종 확인
    if (hasPlans && plans.length > 0) {
        const confirmed = confirm(`⚠️ 계획 초기화 확인\n\n현재 입력된 모든 계획 및 실적 ${plans.length}건이 삭제됩니다.\n새로운 ${newTotalWeeks}주 구조로 초기화됩니다.\n\n이 작업은 되돌릴 수 없습니다.\n정말 초기화하시겠습니까?`);
        if (!confirmed) {
            return;
        }
    }

    // DataService를 통해 초기화
    DataService.resetStudentSemesterPlan(studentCurrentYear, studentCurrentSemester, newTotalWeeks);

    // 모달 닫고 화면 갱신
    closeStudentModal();

    setTimeout(() => {
        showStudentSemesterPlanDetail();
    }, 100);
}

// 주차 바로가기 스크롤
function scrollToWeek(weekNumber) {
    const weekCard = document.getElementById(`week-card-${weekNumber}`);
    if (weekCard) {
        weekCard.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // 스크롤 후 카드 강조 효과
        weekCard.style.transition = 'box-shadow 0.3s ease';
        weekCard.style.boxShadow = '0 0 0 3px rgba(106, 0, 40, 0.2)';

        setTimeout(() => {
            weekCard.style.boxShadow = '';
        }, 2000);
    }
}

// 유틸리티 함수
function getDegreeText(degree) {
    const degreeMap = {
        'master': '석사',
        'doctor': '박사',
        'integrated': '석박통합'
    };
    return degreeMap[degree] || degree;
}

function getMethodText(method) {
    const methodMap = {
        'meeting': '대면',
        'online': '온라인',
        'zoom': 'Zoom',
        'email': '이메일',
        'phone': '전화'
    };
    return methodMap[method] || method;
}

// 전역으로 export
window.initStudentSemesterGuidancePlan = initStudentSemesterGuidancePlan;
window.showStudentSemesterPlanDetail = showStudentSemesterPlanDetail;
window.changeStudentSemesterView = changeStudentSemesterView;
window.resetStudentTotalWeeks = resetStudentTotalWeeks;
window.executeStudentResetWeeks = executeStudentResetWeeks;
window.scrollToWeek = scrollToWeek;

console.log('✅ 학생용 학기별 지도 계획 모듈 로드 완료');
