/**
 * 학생용 학기별 지도 계획
 * Version: 20260113002
 *
 * 기능:
 * - 본인의 학기별 지도 계획 조회
 * - 계획 생성/초기화 (학생도 가능)
 * - 교수 실적 조회 (읽기 전용)
 * - 실적 입력 불가 (교수 전용 기능 제외)
 * - 승인 후 수정 불가
 *
 * 변경사항 (v20260113002):
 * - UI를 관리자/교수 화면과 완전히 동기화
 * - 승인 배지 스타일 변경 (rounded-full)
 * - 테이블 컬럼 사이즈 통일 (80px, 35%, 50%, 100px)
 * - 학기 정보 영역 레이아웃 표준화 (px-6 py-3, gap-6)
 * - 버튼 아이콘 제거하여 간결화
 *
 * 변경사항 (v20260113001):
 * - 학년도 동적 생성 (최근 5년)
 * - 승인 후 계획 수정 제한 추가
 * - 계획 승인 시 계획 초기화 버튼 비활성화
 * - UI를 교수용 화면과 완전히 동일하게 구현
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

let studentCurrentYear = new Date().getFullYear();
let studentCurrentSemester = 1;

// 학기별 계획 데이터 저장소 (임시)
const studentSemesterPlansStorage = {};

// 목업 데이터 초기화 - 승인 대기 중인 학생 계획
studentSemesterPlansStorage['S001_2025_1'] = {
    studentId: 'S001',
    year: 2025,
    semester: 1,
    totalWeeks: 15,
    approved: 'pending_approval',
    requestedDate: '2025-01-20T14:30:00.000Z',
    weeks: [
        { week: 1, plannedDate: '2025-03-03', plannedContent: '연구 주제 선정 및 문헌 조사 시작', plannedMethod: 'meeting', executions: [] },
        { week: 2, plannedDate: '2025-03-10', plannedContent: '선행 연구 분석 및 연구 방향 설정', plannedMethod: 'meeting', executions: [] },
        { week: 3, plannedDate: '2025-03-17', plannedContent: '연구 계획서 초안 작성', plannedMethod: 'zoom', executions: [] },
        { week: 4, plannedDate: '2025-03-24', plannedContent: '연구 방법론 검토 및 설문지 설계', plannedMethod: 'meeting', executions: [] },
        { week: 5, plannedDate: '2025-03-31', plannedContent: '설문지 수정 및 사전 테스트', plannedMethod: 'email', executions: [] },
        { week: 6, plannedDate: '2025-04-07', plannedContent: '데이터 수집 방법 확정 및 IRB 신청', plannedMethod: 'meeting', executions: [] },
        { week: 7, plannedDate: '2025-04-14', plannedContent: '중간 점검 및 진행 상황 보고', plannedMethod: 'zoom', executions: [] },
        { week: 8, plannedDate: '2025-04-21', plannedContent: '데이터 수집 진행 상황 점검', plannedMethod: 'meeting', executions: [] },
        { week: 9, plannedDate: '2025-04-28', plannedContent: '수집된 데이터 정리 및 분석 준비', plannedMethod: 'meeting', executions: [] },
        { week: 10, plannedDate: '2025-05-05', plannedContent: '통계 분석 방법 논의 및 분석 시작', plannedMethod: 'zoom', executions: [] },
        { week: 11, plannedDate: '2025-05-12', plannedContent: '분석 결과 검토 및 해석', plannedMethod: 'meeting', executions: [] },
        { week: 12, plannedDate: '2025-05-19', plannedContent: '논문 초고 작성 시작', plannedMethod: 'meeting', executions: [] },
        { week: 13, plannedDate: '2025-05-26', plannedContent: '논문 초고 1차 피드백', plannedMethod: 'zoom', executions: [] },
        { week: 14, plannedDate: '2025-06-02', plannedContent: '논문 수정 및 보완', plannedMethod: 'meeting', executions: [] },
        { week: 15, plannedDate: '2025-06-09', plannedContent: '최종 논문 검토 및 제출 준비', plannedMethod: 'meeting', executions: [] }
    ],
    plans: []
};

// 현재 학기 계획 (전역 변수)
let currentStudentSemester = {
    year: 2025,
    semester: 1
};
let semesterPlan = null;

// ==================== 커스텀 확인 대화상자 ====================
function showCustomConfirmStudent(title, message, confirmText = '확인', cancelText = '취소', type = 'danger') {
    return new Promise((resolve) => {
        // 오버레이 생성
        const overlay = document.createElement('div');
        overlay.className = 'custom-confirm-overlay';

        // 다이얼로그 생성
        const dialog = document.createElement('div');
        dialog.className = 'custom-confirm-dialog';

        const confirmBtnClass = type === 'danger' ? 'custom-confirm-btn-confirm' : 'custom-confirm-btn-primary';

        dialog.innerHTML = `
            <div class="custom-confirm-header">
                <h3 class="custom-confirm-title">${title}</h3>
            </div>
            <div class="custom-confirm-body">
                <p class="custom-confirm-message">${message}</p>
            </div>
            <div class="custom-confirm-footer">
                <button class="custom-confirm-btn custom-confirm-btn-cancel" data-action="cancel">
                    ${cancelText}
                </button>
                <button class="custom-confirm-btn ${confirmBtnClass}" data-action="confirm">
                    ${confirmText}
                </button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 버튼 클릭 핸들러
        const handleClick = (e) => {
            const action = e.target.dataset.action;
            if (action === 'confirm' || action === 'cancel') {
                overlay.remove();
                resolve(action === 'confirm');
            }
        };

        dialog.addEventListener('click', handleClick);

        // ESC 키로 닫기
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
                resolve(false);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // 오버레이 클릭으로 닫기
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(false);
            }
        });
    });
}

// ==================== 주차 추가 ====================
function addNewWeekStudent() {
    console.log('📝 주차 추가 시작');

    // Get current plan
    if (!semesterPlan) {
        alert('계획을 찾을 수 없습니다.');
        return;
    }

    // 승인된 계획 또는 승인 대기 중인 계획은 수정 불가
    if (semesterPlan.approved === true || semesterPlan.approved === 'pending_approval') {
        alert('승인 신청 후에는 계획을 수정할 수 없습니다.');
        return;
    }

    // Save current inputs before adding
    if (semesterPlan.weeks && semesterPlan.weeks.length > 0) {
        semesterPlan.weeks.forEach(week => {
            const contentTextarea = document.getElementById(`student-plan-content-${week.week}`);
            const contentMobileTextarea = document.getElementById(`student-plan-content-mobile-${week.week}`);
            if (contentTextarea) {
                week.plannedContent = contentTextarea.value.trim();
            } else if (contentMobileTextarea) {
                week.plannedContent = contentMobileTextarea.value.trim();
            }
        });
    }

    const nextWeekNumber = (semesterPlan.weeks?.length || 0) + 1;

    const newWeek = {
        week: nextWeekNumber,
        plannedContent: '',
        executions: []
    };

    semesterPlan.weeks.push(newWeek);
    semesterPlan.totalWeeks = nextWeekNumber;

    console.log(`✅ ${nextWeekNumber}주차 추가 완료`);
    alert(`${nextWeekNumber}주차가 추가되었습니다.`);

    renderStudentSemesterPlan();
}

// ==================== 주차 삭제 ====================
async function deleteWeekStudent(weekNumber) {
    console.log(`🗑️ 주차 삭제 시작: ${weekNumber}주`);

    if (!semesterPlan) {
        alert('계획을 찾을 수 없습니다.');
        return;
    }

    // 승인된 계획 또는 승인 대기 중인 계획은 수정 불가
    if (semesterPlan.approved === true || semesterPlan.approved === 'pending_approval') {
        alert('승인 신청 후에는 계획을 수정할 수 없습니다.');
        return;
    }

    const weekToDelete = semesterPlan.weeks.find(w => w.week === weekNumber);
    if (!weekToDelete) {
        alert('해당 주차를 찾을 수 없습니다.');
        return;
    }

    const hasPlanContent = weekToDelete.plannedContent && weekToDelete.plannedContent.trim();

    let message = `${weekNumber}주차를 삭제하시겠습니까?`;
    if (hasPlanContent) {
        message += '\n\n입력된 계획 내용이 함께 삭제됩니다.';
    }
    message += '\n\n이 작업은 되돌릴 수 없습니다.';

    const confirmed = await showCustomConfirmStudent(
        '⚠️ 주차 삭제 확인',
        message,
        '삭제',
        '취소',
        'danger'
    );

    if (!confirmed) {
        console.log('❌ 사용자가 삭제 취소');
        return;
    }

    // Delete week
    semesterPlan.weeks = semesterPlan.weeks.filter(w => w.week !== weekNumber);

    // Re-number weeks
    semesterPlan.weeks.forEach((week, index) => {
        week.week = index + 1;
    });

    semesterPlan.totalWeeks = semesterPlan.weeks.length;

    console.log(`✅ ${weekNumber}주차 삭제 완료`);
    alert(`${weekNumber}주차가 삭제되었습니다.`);

    renderStudentSemesterPlan();
}

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

    // totalWeeks가 0이면 계획 삭제
    if (totalWeeks === 0) {
        delete studentSemesterPlansStorage[key];
        console.log(`✅ 학생: 학기 계획 삭제: ${key}`);
        return null;
    }

    // 주차 배열 생성
    const weeks = [];
    for (let i = 1; i <= totalWeeks; i++) {
        weeks.push({
            week: i,
            plannedContent: '',
            executions: []
        });
    }

    studentSemesterPlansStorage[key] = {
        studentId: student.id,
        year,
        semester,
        totalWeeks,
        weeks,
        approved: false
    };
    console.log(`✅ 학생: 학기 계획 생성/초기화: ${key}, ${totalWeeks}주`);
    return studentSemesterPlansStorage[key];
};

// 주차별 계획 업데이트
DataService.updateStudentWeekPlan = function(year, semester, weekNumber, planData) {
    const student = window.currentStudent || { id: 'S2024001' };
    const key = `${student.id}_${year}_${semester}`;
    const plan = studentSemesterPlansStorage[key];

    if (!plan) {
        throw new Error('학기 계획이 존재하지 않습니다. 먼저 계획을 생성해주세요.');
    }

    if (!plan.weeks) {
        plan.weeks = [];
    }

    // 해당 주차 찾기 또는 생성
    let week = plan.weeks.find(w => w.week === weekNumber);
    if (!week) {
        week = {
            week: weekNumber,
            plannedContent: '',
            executions: []
        };
        plan.weeks.push(week);
        plan.weeks.sort((a, b) => a.week - b.week);
    }

    // 계획 내용 업데이트
    week.plannedContent = planData.plannedContent || '';

    console.log(`✅ 학생: ${weekNumber}주차 계획 저장 완료`);
    return true;
};

// 승인 신청
DataService.requestSemesterPlanApproval = function(year, semester) {
    const student = window.currentStudent || { id: 'S2024001' };
    const key = `${student.id}_${year}_${semester}`;
    const plan = studentSemesterPlansStorage[key];

    if (!plan) {
        throw new Error('학기 계획이 존재하지 않습니다.');
    }

    // 승인 신청 상태로 변경
    plan.approved = 'pending_approval';
    plan.requestedDate = new Date().toISOString();

    console.log(`✅ 학생: 승인 신청 완료: ${key}`);
    return true;
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

// 사용 가능한 학기 목록 생성 (최근 5년)
function generateStudentAvailableSemesters() {
    const currentYear = new Date().getFullYear();
    const semesters = [];

    for (let y = currentYear; y >= currentYear - 4; y--) {
        for (let s = 1; s <= 2; s++) {
            const plan = DataService.getStudentSemesterPlan(y, s);
            semesters.push({
                year: y,
                semester: s,
                hasPlan: plan && plan.totalWeeks > 0
            });
        }
    }

    return semesters;
}

// 학생용 학기별 지도 계획 초기화
function initStudentSemesterGuidancePlan() {
    console.log('학생용 학기별 지도 계획 초기화');
    showStudentSemesterPlanDetail();
}

// 승인된 계획 수정 시도 시 경고
function alertStudentApprovedPlanEdit() {
    alert('⚠️ 교수님이 승인한 계획은 수정할 수 없습니다.\n\n계획 수정이 필요한 경우 지도교수님께 문의하세요.');
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

    // 현재 학기 정보 업데이트
    currentStudentSemester.year = studentCurrentYear;
    currentStudentSemester.semester = studentCurrentSemester;

    // 학기별 계획 데이터 가져오기 (전역 변수에 할당)
    semesterPlan = DataService.getStudentSemesterPlan(studentCurrentYear, studentCurrentSemester);
    const totalWeeks = semesterPlan?.totalWeeks || 0;
    const isApproved = semesterPlan && semesterPlan.approved === true;

    // 사용 가능한 학기 목록 생성
    const availableSemesters = generateStudentAvailableSemesters();

    // 주차 구조 생성
    const weeks = semesterPlan?.weeks || [];

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
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도단계:</span>
                        <span class="text-gray-900 font-medium">${student.currentStage || '-'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 학기 정보 (교수/관리자 화면과 UI 동기화) -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="px-6 py-3 bg-white border-b">
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학년도:</label>
                        <select id="student-select-year" onchange="changeStudentSemesterView()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${Array.from(new Set(availableSemesters.map(s => s.year)))
                                .map(y => `<option value="${y}" ${y === studentCurrentYear ? 'selected' : ''}>${y}학년도</option>`)
                                .join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학기:</label>
                        <select id="student-select-semester" onchange="changeStudentSemesterView()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${availableSemesters
                                .filter(s => s.year === studentCurrentYear)
                                .map(s => `<option value="${s.semester}" ${s.semester === studentCurrentSemester ? 'selected' : ''}>${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
                                .join('')}
                        </select>
                    </div>
                    ${isApproved ? `
                        <div class="flex items-center gap-2 text-sm">
                            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                ✓ 승인됨
                            </span>
                        </div>
                    ` : ''}
                    ${totalWeeks === 0 ? `
                        <div class="flex items-center gap-2 ml-auto">
                            <label class="text-sm text-gray-600 min-w-[80px]">총 주차 수:</label>
                            <select id="student-new-total-weeks" class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                                ${Array.from({ length: 15 }, (_, i) => i + 1)
                                    .map(week => `<option value="${week}" ${week === 15 ? 'selected' : ''}>${week}주</option>`)
                                    .join('')}
                            </select>
                            <button onclick="executeStudentCreatePlan()"
                                    class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-5 py-2 rounded text-sm font-medium">
                                계획 생성
                            </button>
                        </div>
                    ` : ''}
                    ${totalWeeks > 0 && (semesterPlan.approved === false || semesterPlan.approved === 'rejected') ? `
                        <div class="flex items-center gap-3 ml-auto">
                            <button onclick="saveAllStudentWeekPlans()"
                                    class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-5 py-2 rounded text-sm font-medium">
                                전체 저장
                            </button>
                            <button onclick="requestApproval()"
                                    id="approval-request-btn"
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium ${canRequestApproval() ? '' : 'opacity-50 cursor-not-allowed'}"
                                    ${canRequestApproval() ? '' : 'disabled'}>
                                승인 신청
                            </button>
                            <button onclick="event.stopPropagation(); resetStudentTotalWeeks();"
                                    class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium">
                                계획 초기화
                            </button>
                        </div>
                    ` : ''}
                    ${totalWeeks > 0 && semesterPlan.approved === 'pending_approval' ? `
                        <div class="flex items-center gap-3 ml-auto">
                            <div class="flex items-center gap-2 text-sm">
                                <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                    승인 대기 중
                                </span>
                            </div>
                            <button onclick="requestApproval()"
                                    class="bg-gray-400 text-white px-5 py-2 rounded text-sm font-medium cursor-not-allowed"
                                    disabled>
                                승인 신청
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>

        <!-- 주차별 지도 계획 및 실적 -->
        ${totalWeeks > 0 ? renderStudentWeeklyCards(weeks) : ''}
    `;
}

// Note: generateStudentWeeks 함수 제거됨 - 이제 semesterPlan.weeks를 직접 사용

// 주차별 테이블 렌더링 (교수용과 완전히 동일)
function renderStudentWeeklyCards(weeks) {
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

    const isApproved = semesterPlan && semesterPlan.approved === true;

    return `
        <div class="space-y-4">
            <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-800">학기별 지도 계획</h3>
            </div>

            <!-- Desktop Table View (교수/관리자 화면과 컬럼 사이즈 동기화) -->
            <div class="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700" style="width: 80px;">주차</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700" style="width: 35%;">계획내용</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700" style="width: 50%;">실행내용</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700" style="width: 100px;">교수명</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${weeks.map(week => renderStudentWeekCard(week)).join('')}
                        </tbody>
                    </table>
                </div>
                ${!isApproved && semesterPlan.approved !== 'pending_approval' ? `
                    <div class="px-4 py-3 bg-gray-50 border-t border-gray-300">
                        <button onclick="addNewWeekStudent()"
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2">
                            <i class="fas fa-plus"></i> 주차 추가
                        </button>
                    </div>
                ` : ''}
            </div>

            <!-- Mobile Card View -->
            <div class="md:hidden space-y-4">
                ${weeks.map(week => renderStudentWeekCardMobile(week)).join('')}
                ${!isApproved && semesterPlan.approved !== 'pending_approval' ? `
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <button onclick="addNewWeekStudent()"
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2">
                            <i class="fas fa-plus"></i> 주차 추가
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 개별 주차 테이블 행 렌더링 (학생용 - 교수용과 UI 동일, 권한만 다름)
function renderStudentWeekCard(week) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const rowCount = hasExecutions ? week.executions.length : 1;
    const isReadonly = semesterPlan && (semesterPlan.approved === true || semesterPlan.approved === 'pending_approval');
    const readonlyAttr = isReadonly ? 'readonly' : '';
    const bgClass = isReadonly ? 'bg-gray-100' : '';
    const clickEvent = isReadonly ? 'onclick="alertStudentApprovedPlanEdit()"' : '';

    // 첫 번째 행 (주차와 계획내용은 rowspan 적용)
    let firstRow = `
        <tr id="week-card-${week.week}">
            <td class="border border-gray-300 px-2 py-2 text-center font-semibold" rowspan="${rowCount}">
                <div class="flex flex-col items-center gap-1">
                    <span>${week.week}주</span>
                    ${!isReadonly ? `
                        <button onclick="event.stopPropagation(); deleteWeekStudent(${week.week})"
                                class="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                title="주차 삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
            <td class="border border-gray-300 px-2 py-2" rowspan="${rowCount}">
                <textarea id="student-plan-content-${week.week}"
                          placeholder="계획 내용 입력"
                          ${readonlyAttr}
                          ${clickEvent}
                          class="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none focus:outline-none auto-expand-textarea ${bgClass}"
                          style="min-height: 40px; overflow-y: hidden; ${isReadonly ? 'cursor: not-allowed;' : ''}">${week.plannedContent || ''}</textarea>
            </td>`;

    if (hasExecutions) {
        // 첫 번째 실적을 첫 행에 포함
        const firstExec = week.executions[0];
        firstRow += `
            <td class="border border-gray-300 px-2 py-2">
                <textarea readonly
                          class="w-full bg-gray-50 cursor-not-allowed border border-gray-300 rounded text-sm px-2 py-1 resize-none focus:outline-none auto-expand-textarea"
                          style="min-height: 40px; overflow-y: hidden;">${firstExec.executionContent || ''}</textarea>
            </td>
            <td class="border border-gray-300 px-2 py-2 text-center text-sm">
                ${firstExec.professorName || '-'}
            </td>
        `;
    } else {
        // 실적이 없는 경우: "실적 없음" 표시 (colspan="2")
        firstRow += `
            <td class="border border-gray-300 px-2 py-2 text-center text-gray-500" colspan="2">실적 없음</td>
        `;
    }
    firstRow += `</tr>`;

    // 추가 실적 행들 (2번째 실적부터)
    let additionalRows = '';
    if (hasExecutions && week.executions.length > 1) {
        additionalRows = week.executions.slice(1).map(exec => {
            return `
                <tr>
                    <td class="border border-gray-300 px-2 py-2">
                        <textarea readonly
                                  class="w-full bg-gray-50 cursor-not-allowed border border-gray-300 rounded text-sm px-2 py-1 resize-none focus:outline-none auto-expand-textarea"
                                  style="min-height: 40px; overflow-y: hidden;">${exec.executionContent || ''}</textarea>
                    </td>
                    <td class="border border-gray-300 px-2 py-2 text-center text-sm">
                        ${exec.professorName || '-'}
                    </td>
                </tr>
            `;
        }).join('');
    }

    return firstRow + additionalRows;
}

// 모바일 카드 뷰 렌더링 (학생용)
function renderStudentWeekCardMobile(week) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const isReadonly = semesterPlan && (semesterPlan.approved === true || semesterPlan.approved === 'pending_approval');
    const readonlyAttr = isReadonly ? 'readonly' : '';
    const bgClass = isReadonly ? 'bg-gray-100' : '';

    return `
        <div id="week-card-mobile-${week.week}" class="bg-white border border-gray-200 rounded-lg">
            <!-- 주차 헤더 -->
            <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <span class="text-base font-semibold text-gray-800">${week.week}주차</span>
                ${!isReadonly ? `
                    <button onclick="event.stopPropagation(); deleteWeekStudent(${week.week})"
                            class="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                            title="주차 삭제">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                ` : ''}
            </div>

            <!-- 계획 내용 -->
            <div class="p-4 border-b border-gray-200">
                <span class="text-sm font-semibold text-gray-700">계획 내용:</span>
                <textarea id="student-plan-content-mobile-${week.week}"
                          placeholder="계획 내용 입력"
                          ${readonlyAttr}
                          class="w-full border border-gray-300 rounded px-2 py-2 text-sm resize-none mt-2 ${bgClass}"
                          style="min-height: 60px;">${week.plannedContent || ''}</textarea>
            </div>

            <!-- 실적 목록 -->
            <div class="p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">
                    실적 (${week.executions.length}건)
                </h4>
                ${hasExecutions ? `
                    <div class="space-y-3">
                        ${week.executions.map(exec => `
                            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-sm font-semibold text-gray-800">${exec.professorName || '-'}</span>
                                </div>
                                <p class="text-sm text-gray-800">${exec.executionContent || '-'}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <p class="text-sm text-gray-500">실적 없음</p>
                `}
            </div>
        </div>
    `;
}

// ========== 유틸리티 함수 ==========

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

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

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
}

// 학기 변경
function changeStudentSemesterView() {
    const yearSelect = document.getElementById('student-select-year');
    const semesterSelect = document.getElementById('student-select-semester');

    if (!yearSelect || !semesterSelect) return;

    const year = parseInt(yearSelect.value);
    const previousYear = studentCurrentYear;

    // 학년도가 변경된 경우, 해당 학년도의 학기 옵션으로 업데이트
    if (year !== previousYear) {
        const availableSemesters = generateStudentAvailableSemesters();
        const semesterOptions = availableSemesters
            .filter(s => s.year === year)
            .map(s => `<option value="${s.semester}">${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
            .join('');
        semesterSelect.innerHTML = semesterOptions;
        semesterSelect.value = '1';
    }

    studentCurrentYear = year;
    studentCurrentSemester = parseInt(semesterSelect.value);

    console.log(`학기 변경: ${studentCurrentYear}학년도 ${studentCurrentSemester}학기`);

    showStudentSemesterPlanDetail();
}

// 계획 생성 (인라인 방식 - 모달 없이)
function executeStudentCreatePlan() {
    console.log('🟡 executeStudentCreatePlan 시작');

    const selectEl = document.getElementById('student-new-total-weeks');
    if (!selectEl) {
        alert('주차 선택 요소를 찾을 수 없습니다.');
        return;
    }

    const newTotalWeeks = parseInt(selectEl.value);

    if (!newTotalWeeks || newTotalWeeks < 1 || newTotalWeeks > 15) {
        alert('올바른 주차 수를 선택해주세요 (1~15주)');
        return;
    }

    // DataService를 통해 계획 생성
    DataService.resetStudentSemesterPlan(studentCurrentYear, studentCurrentSemester, newTotalWeeks);

    // 화면 새로고침
    setTimeout(() => {
        showStudentSemesterPlanDetail();
    }, 100);
}

// 계획 초기화
function resetStudentTotalWeeks() {
    console.log('🟡 resetStudentTotalWeeks 시작');

    const semesterPlan = DataService.getStudentSemesterPlan(studentCurrentYear, studentCurrentSemester);
    const currentWeeks = semesterPlan?.totalWeeks || 0;
    const weeks = semesterPlan?.weeks || [];

    // 계획 내용이 있는지 확인
    let hasPlanContent = false;
    if (weeks.length > 0) {
        hasPlanContent = weeks.some(w => w.plannedContent && w.plannedContent.trim());
    }

    // 최종 확인
    if (currentWeeks > 0 && hasPlanContent) {
        const confirmed = confirm(`⚠️ 계획 초기화 확인\n\n현재 입력된 모든 계획 내용이 삭제됩니다.\n\n이 작업은 되돌릴 수 없습니다.\n정말 초기화하시겠습니까?`);
        if (!confirmed) {
            return;
        }
    }

    // DataService를 통해 초기화 (주차 수 0으로 설정)
    DataService.resetStudentSemesterPlan(studentCurrentYear, studentCurrentSemester, 0);

    // 화면 새로고침
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
const originalShowDetail = showStudentSemesterPlanDetail;
showStudentSemesterPlanDetail = function() {
    originalShowDetail();
    // 렌더링 후 약간의 지연을 두고 확장 적용
    setTimeout(() => {
        expandAllTextareas();
    }, 100);
};

// ==================== 학생용 주차별 계획 전체 저장 ====================
function saveAllStudentWeekPlans() {
    // 현재 학기의 주차 수를 동적으로 가져오기
    const semesterPlan = DataService.getStudentSemesterPlan(studentCurrentYear, studentCurrentSemester);
    const totalWeeks = semesterPlan?.totalWeeks || 0;

    if (totalWeeks === 0) {
        alert('저장할 학기 계획이 없습니다.\n먼저 계획을 생성해주세요.');
        return;
    }

    let savedCount = 0;
    let emptyCount = 0;

    for (let week = 1; week <= totalWeeks; week++) {
        const contentEl = document.getElementById(`student-plan-content-${week}`);

        if (!contentEl) {
            console.warn(`${week}주차 textarea 요소를 찾을 수 없습니다`);
            continue;
        }

        const content = contentEl.value.trim();

        // 빈 주차는 건너뜀
        if (!content) {
            emptyCount++;
            continue;
        }

        const planData = {
            plannedContent: content
        };

        try {
            DataService.updateStudentWeekPlan(
                studentCurrentYear,
                studentCurrentSemester,
                week,
                planData
            );
            savedCount++;
        } catch (error) {
            console.error(`${week}주차 저장 실패:`, error);
            alert(`${week}주차 저장 중 오류가 발생했습니다: ${error.message}`);
            return;
        }
    }

    if (savedCount > 0) {
        alert(`${savedCount}개 주차의 계획이 저장되었습니다.${emptyCount > 0 ? `\n(${emptyCount}개 주차는 내용이 비어있어 건너뛰었습니다.)` : ''}`);

        // 화면 새로고침
        setTimeout(() => {
            showStudentSemesterPlanDetail();
        }, 300);
    } else {
        alert('저장할 계획 내용이 없습니다.\n최소 1개 이상의 주차에 계획을 입력해주세요.');
    }
}

// ==================== 학생용 주차별 계획 저장 ====================
function saveStudentWeekPlan(weekNumber) {
    const contentEl = document.getElementById(`student-plan-content-${weekNumber}`);
    if (!contentEl) {
        alert('계획 입력란을 찾을 수 없습니다.');
        return;
    }

    const content = contentEl.value.trim();

    if (!content) {
        alert('계획 내용을 입력해주세요.');
        return;
    }

    const planData = {
        plannedContent: content
    };

    try {
        DataService.updateStudentWeekPlan(
            studentCurrentYear,
            studentCurrentSemester,
            weekNumber,
            planData
        );

        alert(`${weekNumber}주차 계획이 저장되었습니다.`);

        // 화면 새로고침
        setTimeout(() => {
            showStudentSemesterPlanDetail();
        }, 300);

    } catch (error) {
        console.error('계획 저장 오류:', error);
        alert(error.message || '계획 저장에 실패했습니다.');
    }
}

// ==================== 승인 신청 관련 함수 ====================

/**
 * 승인 신청 가능 여부 확인
 * 모든 주차의 계획내용이 입력되어 있어야 함
 */
function canRequestApproval() {
    if (!semesterPlan || !semesterPlan.weeks || semesterPlan.weeks.length === 0) {
        return false;
    }

    // 모든 주차의 plannedContent가 비어있지 않은지 확인
    return semesterPlan.weeks.every(week => {
        return week.plannedContent && week.plannedContent.trim() !== '';
    });
}

/**
 * 승인 신청 실행
 */
async function requestApproval() {
    console.log('🟢 승인 신청 시작');

    if (!semesterPlan) {
        alert('계획을 찾을 수 없습니다.');
        return;
    }

    // 승인 신청 가능 여부 재확인
    if (!canRequestApproval()) {
        alert('모든 주차의 계획내용을 입력해야 승인 신청이 가능합니다.');
        return;
    }

    // 확인 메시지
    const confirmed = await showCustomConfirmStudent(
        '승인 신청 확인',
        '지도교수님께 계획 승인을 신청하시겠습니까?\n\n승인 신청 후에는 계획을 수정할 수 없습니다.',
        '신청',
        '취소',
        'primary'
    );

    if (!confirmed) {
        console.log('❌ 사용자가 승인 신청 취소');
        return;
    }

    // 승인 신청 처리
    try {
        // DataService를 통해 승인 신청 상태로 변경
        if (typeof DataService.requestSemesterPlanApproval === 'function') {
            DataService.requestSemesterPlanApproval(
                studentCurrentYear,
                studentCurrentSemester
            );
        } else {
            // DataService에 함수가 없으면 직접 처리
            semesterPlan.approved = 'pending_approval';
            semesterPlan.requestedDate = new Date().toISOString();
        }

        console.log('✅ 승인 신청 완료');
        alert('승인 신청이 완료되었습니다.\n지도교수님의 승인을 기다려주세요.');

        // 화면 새로고침
        setTimeout(() => {
            showStudentSemesterPlanDetail();
        }, 300);

    } catch (error) {
        console.error('승인 신청 오류:', error);
        alert(error.message || '승인 신청에 실패했습니다.');
    }
}

// 초기화 실행
initAutoExpandTextareas();

// 전역으로 export
window.initStudentSemesterGuidancePlan = initStudentSemesterGuidancePlan;
window.showStudentSemesterPlanDetail = showStudentSemesterPlanDetail;
window.changeStudentSemesterView = changeStudentSemesterView;
window.resetStudentTotalWeeks = resetStudentTotalWeeks;
window.executeStudentCreatePlan = executeStudentCreatePlan;
window.scrollToWeek = scrollToWeek;
window.saveAllStudentWeekPlans = saveAllStudentWeekPlans;
window.saveStudentWeekPlan = saveStudentWeekPlan;
window.autoExpandTextarea = autoExpandTextarea;
window.expandAllTextareas = expandAllTextareas;
window.addNewWeekStudent = addNewWeekStudent;
window.deleteWeekStudent = deleteWeekStudent;
window.canRequestApproval = canRequestApproval;
window.requestApproval = requestApproval;

console.log('✅ 학생용 학기별 지도 계획 모듈 로드 완료');
