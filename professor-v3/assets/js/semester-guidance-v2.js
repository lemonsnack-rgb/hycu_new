// ===================================
// 학기별 논문지도 계획 관리 V2 (댓글 방식 실적 입력)
// ===================================

let currentStudentIdV2 = null; // 현재 선택된 학생 ID (V2)
let currentSemesterView = { year: 2025, semester: 1 };
let availableSemesters = []; // 조회 가능한 학기 목록

// ==================== 커스텀 확인 대화상자 ====================
function showCustomConfirm(title, message, confirmText = '확인', cancelText = '취소', type = 'danger') {
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

// ==================== 승인된 계획 수정 시도 시 경고 ====================
function alertApprovedPlanEdit() {
    alert('계획 승인 이후에는 계획 수정이 불가능합니다.');
}

// ==================== 학기별 상세 화면 (모달 팝업) ====================
function showSemesterGuidanceDetail(studentId) {
    console.log('🔵 showSemesterGuidanceDetail 호출:', studentId);

    // 이미 모달이 열려있으면 무시
    const existingModal = document.getElementById('semester-guidance-modal');
    if (existingModal) {
        console.warn('학기별 지도 계획 모달이 이미 열려 있습니다.');
        return;
    }

    currentStudentIdV2 = studentId;
    console.log('📝 currentStudentIdV2 설정:', currentStudentIdV2);

    const student = DataService.getStudentDetail(studentId);
    console.log('👤 학생 정보:', student);

    if (!student) {
        console.error('❌ 학생 정보를 찾을 수 없습니다:', studentId);
        showToast('학생 정보를 찾을 수 없습니다.', 'error');
        return;
    }

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

    // 모달 생성 및 표시
    const modal = createSemesterGuidanceModal(student, allPlans);
    document.body.appendChild(modal);

    // 백드롭 클릭으로 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSemesterGuidanceModal();
        }
    });

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeSemesterGuidanceModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ==================== 모달 생성 ====================
function createSemesterGuidanceModal(student, allPlans) {
    const modal = document.createElement('div');
    modal.id = 'semester-guidance-modal';
    modal.className = 'feedback-detail-screen'; // 기존 모달과 동일한 스타일 사용
    modal.style.zIndex = '500';

    const currentPlan = allPlans.find(p =>
        p.year === currentSemesterView.year && p.semester === currentSemesterView.semester
    );

    // 학기 계획 데이터 가져오기
    const semesterPlan = DataService.getSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester
    );
    const totalWeeks = semesterPlan?.totalWeeks || 0;

    // 계획이 없으면 생성 폼 표시
    if (totalWeeks === 0) {
        modal.innerHTML = renderPlanCreationForm(student);
    } else {
        modal.innerHTML = renderSemesterDetailContent(student, allPlans, currentPlan, totalWeeks);
    }

    return modal;
}

// ==================== 모달 닫기 ====================
function closeSemesterGuidanceModal() {
    const modal = document.getElementById('semester-guidance-modal');
    if (modal) {
        modal.remove();
    }

    // 전역 변수 정리
    currentStudentIdV2 = null;
}

// ==================== 계획 생성 폼 렌더링 ====================
function renderPlanCreationForm(student) {
    const advisors = DataService.getStudentAdvisors(currentStudentIdV2);

    return `
        <div class="feedback-detail-content" style="max-width: 1400px;">
            <!-- 헤더 -->
            <div class="px-6 py-3 border-b bg-white">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-800">학기별 지도 계획</h3>
                    <button onclick="closeSemesterGuidanceModal()"
                            class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 학생 정보 -->
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

            <!-- 학기 선택 및 주차 설정 -->
            <div class="px-6 py-4 bg-white border-b">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">학기 선택 및 주차 설정</h4>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학년도:</label>
                        <select id="select-year-creation" onchange="changeSemesterViewInModal()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${Array.from(new Set(availableSemesters.map(s => s.year)))
                                .map(y => `<option value="${y}" ${y === currentSemesterView.year ? 'selected' : ''}>${y}학년도</option>`)
                                .join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학기:</label>
                        <select id="select-semester-creation" onchange="changeSemesterViewInModal()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${availableSemesters
                                .filter(s => s.year === currentSemesterView.year)
                                .map(s => `<option value="${s.semester}" ${s.semester === currentSemesterView.semester ? 'selected' : ''}>${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
                                .join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2 ml-auto">
                        <label class="text-sm text-gray-700 font-medium">주차 수:</label>
                        <select id="week-count-select"
                                class="border border-gray-300 rounded px-4 py-2 text-sm bg-white">
                            ${Array.from({length: 20}, (_, i) => i + 1).map(week =>
                                `<option value="${week}" ${week === 15 ? 'selected' : ''}>${week}주</option>`
                            ).join('')}
                        </select>
                        <button onclick="executeCreatePlan()"
                                class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium">
                            계획 생성
                        </button>
                    </div>
                </div>
            </div>

            <!-- 안내 메시지 -->
            <div class="p-8">
                <div class="max-w-2xl mx-auto text-center">
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-8">
                        <p class="text-lg text-gray-600 mb-2">📋 등록된 학기별 지도계획이 없습니다</p>
                        <p class="text-sm text-gray-500">위에서 주차 수를 선택하고 '계획 생성' 버튼을 클릭하세요</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== 계획 생성 실행 ====================
function executeCreatePlan() {
    const weekCountSelect = document.getElementById('week-count-select');
    const weekCount = parseInt(weekCountSelect.value);

    if (!weekCount || weekCount < 1 || weekCount > 20) {
        showToast('주차 수는 1~20 사이로 선택해주세요.', 'warning');
        return;
    }

    // DataService를 통해 계획 생성
    DataService.resetSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester,
        weekCount
    );

    showToast(`지도 계획이 ${weekCount}주로 생성되었습니다.`, 'success');

    // 모달 내용을 테이블로 전환
    setTimeout(() => {
        refreshModalContent();
    }, 300);
}

// ==================== 모달 내용 새로고침 ====================
function refreshModalContent() {
    const modal = document.getElementById('semester-guidance-modal');
    if (!modal) return;

    const student = DataService.getStudentDetail(currentStudentIdV2);
    if (!student) return;

    const allPlans = DataService.getAllSemesterPlans(currentStudentIdV2);

    // 사용 가능한 학기 목록 재생성 (중요: 학기 전환 시마다 업데이트)
    availableSemesters = generateAvailableSemesters(allPlans);

    const currentPlan = allPlans.find(p =>
        p.year === currentSemesterView.year && p.semester === currentSemesterView.semester
    );

    const semesterPlan = DataService.getSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester
    );
    const totalWeeks = semesterPlan?.totalWeeks || 0;

    // 계획이 없으면 생성 폼, 있으면 테이블
    if (totalWeeks === 0) {
        modal.innerHTML = renderPlanCreationForm(student);
    } else {
        modal.innerHTML = renderSemesterDetailContent(student, allPlans, currentPlan, totalWeeks);
    }

    // textarea 자동 확장 재적용
    setTimeout(() => {
        expandAllTextareas();
    }, 100);
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

// ==================== 모달 콘텐츠 렌더링 (테이블 뷰) ====================
function renderSemesterDetailContent(student, allPlans, currentPlan, totalWeeks) {
    const advisors = DataService.getStudentAdvisors(currentStudentIdV2);
    const currentProf = DataService.getCurrentProfessor();

    // totalWeeks가 설정되어 있으면 주차 생성
    const weeks = currentPlan ? currentPlan.weeks : generateEmptyWeeks(totalWeeks);

    // 승인 상태 확인
    const isApproved = currentPlan?.approved === true;
    const approvalInfo = isApproved ? `
        <div class="flex items-center gap-2 text-sm">
            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                ✓ 승인됨
            </span>
            <span class="text-gray-600">
                ${currentPlan.approvedBy || '-'} | ${currentPlan.approvedDate ? new Date(currentPlan.approvedDate).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
            </span>
        </div>
    ` : '';

    return `
        <div class="feedback-detail-content" style="max-width: 1400px;">
            <!-- 헤더 -->
            <div class="px-6 py-3 border-b bg-white">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-800">학기별 지도 계획</h3>
                    <button onclick="closeSemesterGuidanceModal()"
                            class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 학생 정보 -->
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

            <!-- 학기 선택 및 버튼 -->
            <div class="px-6 py-3 bg-white border-b">
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학년도:</label>
                        <select id="select-year" onchange="changeSemesterViewInModal()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${Array.from(new Set(availableSemesters.map(s => s.year)))
                                .map(y => `<option value="${y}" ${y === currentSemesterView.year ? 'selected' : ''}>${y}학년도</option>`)
                                .join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학기:</label>
                        <select id="select-semester" onchange="changeSemesterViewInModal()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${availableSemesters
                                .filter(s => s.year === currentSemesterView.year)
                                .map(s => `<option value="${s.semester}" ${s.semester === currentSemesterView.semester ? 'selected' : ''}>${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
                                .join('')}
                        </select>
                    </div>
                    ${approvalInfo}
                    <div class="flex items-center gap-3 ml-auto">
                        ${isApproved ? `
                            <!-- 승인된 상태: 승인 취소만 가능 -->
                            <button onclick="cancelSemesterApproval()"
                                    class="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded text-sm font-medium">
                                승인 취소
                            </button>
                        ` : `
                            <!-- 미승인 상태: 저장, 승인, 초기화 가능 -->
                            <button onclick="saveAllWeekPlans()"
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium">
                                전체 저장
                            </button>
                            <button onclick="approveSemesterPlan()"
                                    class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-medium">
                                계획 승인
                            </button>
                            <button onclick="event.stopPropagation(); resetTotalWeeksInModal();"
                                    class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium">
                                계획 초기화
                            </button>
                        `}
                    </div>
                </div>
            </div>

            <!-- 주차별 테이블 (스크롤 가능) -->
            <div class="p-6" style="max-height: calc(100vh - 280px); overflow-y: auto;">
                ${renderWeeklyCards(weeks, advisors, currentProf, currentPlan, isApproved)}
            </div>
        </div>
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

// 모달 내 학기 선택 변경
function changeSemesterViewInModal() {
    // 생성 폼과 테이블 뷰에서 모두 동작하도록 select 요소 찾기
    const yearSelect = document.getElementById('select-year') || document.getElementById('select-year-creation');
    const semesterSelect = document.getElementById('select-semester') || document.getElementById('select-semester-creation');

    if (!yearSelect || !semesterSelect) {
        console.error('학년도/학기 select 요소를 찾을 수 없습니다');
        return;
    }

    const year = parseInt(yearSelect.value);
    const previousYear = currentSemesterView.year;

    // 학년도가 변경된 경우, 해당 학년도의 학기 옵션으로 업데이트
    if (year !== previousYear) {
        const semesterOptions = availableSemesters
            .filter(s => s.year === year)
            .map(s => `<option value="${s.semester}">${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
            .join('');

        semesterSelect.innerHTML = semesterOptions;

        // 기본적으로 1학기 선택
        semesterSelect.value = '1';

        console.log(`학년도 변경: ${previousYear} → ${year}, 학기 옵션 업데이트`);
    }

    const semester = parseInt(semesterSelect.value);

    if (!year || !semester) {
        console.error('유효하지 않은 학년도 또는 학기:', { year, semester });
        return;
    }

    currentSemesterView = { year, semester };

    console.log('학기 전환:', currentSemesterView);

    // 모달 내용 새로고침
    refreshModalContent();
}

// ==================== 주차 추가 ====================
function addNewWeek() {
    console.log('📝 주차 추가 시작');

    // 현재 계획 조회
    const allPlans = DataService.getAllSemesterPlans(currentStudentIdV2);
    const currentPlan = allPlans.find(p =>
        p.year === currentSemesterView.year && p.semester === currentSemesterView.semester
    );

    if (!currentPlan) {
        showToast('계획을 찾을 수 없습니다.', 'error');
        return;
    }

    // 주차 추가 전에 현재 화면의 입력 내용을 먼저 저장
    if (currentPlan.weeks && currentPlan.weeks.length > 0) {
        currentPlan.weeks.forEach(week => {
            const contentTextarea = document.getElementById(`plan-content-${week.week}`);
            if (contentTextarea) {
                week.plannedContent = contentTextarea.value.trim();
            }
        });

        // DataService에 저장
        DataService.saveSemesterPlan(
            currentStudentIdV2,
            currentSemesterView.year,
            currentSemesterView.semester,
            currentPlan
        );
    }

    // 다음 주차 번호 계산
    const nextWeekNumber = (currentPlan.weeks?.length || 0) + 1;

    // 새로운 주차 추가
    const newWeek = {
        week: nextWeekNumber,
        plannedDate: null,
        plannedContent: '',
        plannedMethod: 'meeting',
        executions: []
    };

    // weeks 배열이 없으면 생성
    if (!currentPlan.weeks) {
        currentPlan.weeks = [];
    }

    currentPlan.weeks.push(newWeek);

    // totalWeeks도 업데이트
    currentPlan.totalWeeks = nextWeekNumber;

    console.log(`✅ ${nextWeekNumber}주차 추가 완료`);
    showToast(`${nextWeekNumber}주차가 추가되었습니다.`, 'success');

    // 화면 새로고침
    refreshModalContent();
}

// ==================== 주차 삭제 ====================
async function deleteWeek(weekNumber) {
    console.log(`🗑️ 주차 삭제 시작: ${weekNumber}주`);

    const allPlans = DataService.getAllSemesterPlans(currentStudentIdV2);
    const currentPlan = allPlans.find(p =>
        p.year === currentSemesterView.year && p.semester === currentSemesterView.semester
    );

    if (!currentPlan) {
        showToast('계획을 찾을 수 없습니다.', 'error');
        return;
    }

    const weekToDelete = currentPlan.weeks?.find(w => w.week === weekNumber);
    if (!weekToDelete) {
        showToast('해당 주차를 찾을 수 없습니다.', 'error');
        return;
    }

    // 계획 내용 존재 여부 확인 (실적 개수가 아닌 계획 내용)
    const hasPlanContent = weekToDelete.plannedContent && weekToDelete.plannedContent.trim();

    let message = `${weekNumber}주차를 삭제하시겠습니까?`;
    if (hasPlanContent) {
        message += '\n\n입력된 계획 내용이 함께 삭제됩니다.';
    }
    message += '\n\n이 작업은 되돌릴 수 없습니다.';

    const confirmed = await showCustomConfirm(
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

    // 주차 삭제
    currentPlan.weeks = currentPlan.weeks.filter(w => w.week !== weekNumber);

    // 주차 번호 재정렬
    currentPlan.weeks.forEach((week, index) => {
        week.week = index + 1;
    });

    // totalWeeks 업데이트
    currentPlan.totalWeeks = currentPlan.weeks.length;

    // DataService에 저장
    DataService.saveSemesterPlan(
        currentStudentIdV2,
        currentSemesterView.year,
        currentSemesterView.semester,
        currentPlan
    );

    console.log(`✅ ${weekNumber}주차 삭제 완료`);
    showToast(`${weekNumber}주차가 삭제되었습니다.`, 'success');

    refreshModalContent();
}

// 모달 내 계획 초기화
async function resetTotalWeeksInModal() {
    console.log('🔄 resetTotalWeeksInModal 호출됨');
    console.log('  - currentStudentIdV2:', currentStudentIdV2);
    console.log('  - currentSemesterView:', currentSemesterView);

    // getAllSemesterPlans로 현재 계획 조회 (저장되지 않은 데이터도 포함)
    const allPlans = DataService.getAllSemesterPlans(currentStudentIdV2);
    const currentPlan = allPlans.find(p =>
        p.year === currentSemesterView.year && p.semester === currentSemesterView.semester
    );

    console.log('  - currentPlan:', currentPlan);

    // 주차 수 계산 (weeks 배열 길이 사용)
    const weekCount = currentPlan?.weeks?.length || 0;
    console.log('  - 주차 수:', weekCount);

    // 계획과 실적 건수 계산
    let totalItems = 0;
    if (currentPlan?.weeks) {
        currentPlan.weeks.forEach(week => {
            // 계획이 있으면 +1
            if (week.plannedContent && week.plannedContent.trim()) {
                totalItems++;
            }
            // 실적이 있으면 각각 +1
            if (week.executions && week.executions.length > 0) {
                totalItems += week.executions.length;
            }
        });
    }

    console.log('  - 총 계획/실적 건수:', totalItems);

    // 커스텀 확인 대화상자 표시
    const confirmed = await showCustomConfirm(
        '⚠️ 계획 초기화 확인',
        `현재 ${weekCount}주차 구조와 입력된 모든 계획 및 실적(총 ${totalItems}건)이 삭제됩니다.\n\n이 작업은 되돌릴 수 없습니다.\n정말 초기화하시겠습니까?`,
        '초기화',
        '취소',
        'danger'
    );

    console.log('  - 사용자 확인 결과:', confirmed);

    if (!confirmed) {
        console.log('❌ 사용자가 초기화 취소');
        return;
    }

    executeResetPlan();
}

// 실제 초기화 실행 함수 분리
function executeResetPlan() {

    console.log('✅ 사용자가 초기화 확인');

    // 초기화 후 생성 폼 표시
    const modal = document.getElementById('semester-guidance-modal');
    if (!modal) {
        console.error('❌ 모달을 찾을 수 없습니다');
        return;
    }

    const student = DataService.getStudentDetail(currentStudentIdV2);
    if (!student) {
        console.error('❌ 학생 정보를 찾을 수 없습니다');
        return;
    }

    console.log('✅ 데이터 삭제 시작');

    // 데이터 삭제
    try {
        DataService.resetSemesterPlan(
            currentStudentIdV2,
            currentSemesterView.year,
            currentSemesterView.semester,
            0 // 0으로 설정하여 계획 완전 삭제
        );
        console.log('✅ 데이터 삭제 완료');
    } catch (error) {
        console.error('❌ 데이터 삭제 실패:', error);
        showToast('계획 초기화에 실패했습니다.', 'error');
        return;
    }

    // 생성 폼으로 전환
    console.log('✅ 생성 폼으로 전환');
    modal.innerHTML = renderPlanCreationForm(student);

    showToast('계획이 초기화되었습니다. 새로운 주차 수를 선택하세요.', 'success');
}

// ==================== 주차별 테이블 렌더링 ====================
function renderWeeklyCards(weeks, advisors, currentProf, existingPlan, isApproved = false) {
    return `
        <div class="space-y-4">
            ${isApproved ? `
                <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p class="text-sm text-yellow-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        승인된 계획입니다. 수정하려면 먼저 승인을 취소해주세요.
                    </p>
                </div>
            ` : ''}

            <!-- Desktop Table View -->
            <div class="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700" style="width: 80px;">주차</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700">계획내용</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700">실행내용</th>
                                <th class="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700" style="width: 100px;">교수명</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${weeks.map(week => renderWeekCard(week, advisors, currentProf, existingPlan, currentStudentIdV2, isApproved)).join('')}
                        </tbody>
                    </table>
                </div>

                ${!isApproved ? `
                    <!-- 주차 추가 버튼 (미승인 상태에만 표시) -->
                    <div class="px-4 py-3 bg-gray-50 border-t border-gray-300">
                        <button onclick="addNewWeek()"
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2">
                            <i class="fas fa-plus"></i> 주차 추가
                        </button>
                    </div>
                ` : ''}
            </div>

            <!-- Mobile Card View -->
            <div class="block md:hidden space-y-4">
                ${weeks.map(week => renderWeekCardMobile(week, advisors, currentProf, existingPlan, currentStudentIdV2, isApproved)).join('')}

                ${!isApproved ? `
                    <!-- 주차 추가 버튼 (모바일, 미승인 상태에만 표시) -->
                    <div class="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                        <button onclick="addNewWeek()"
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2">
                            <i class="fas fa-plus"></i> 주차 추가
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 개별 주차 테이블 행 렌더링 (교수용 - 수정 가능)
function renderWeekCard(week, advisors, currentProf, plan, studentId, isApproved = false) {
    const hasExecutions = week.executions && week.executions.length > 0;

    // rowspan 계산: 실적 수 + 입력 행 1개
    const rowCount = hasExecutions ? week.executions.length + 1 : 1;

    // 첫 번째 행 (주차와 계획내용은 rowspan 적용)
    let firstRow = `
        <tr>
            <td class="border border-gray-300 px-2 py-2 text-center font-semibold" rowspan="${rowCount}">
                <div class="flex flex-col items-center gap-2">
                    <span>${week.week}주</span>
                    ${!isApproved ? `
                        <button onclick="event.stopPropagation(); deleteWeek(${week.week})"
                                class="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                title="주차 삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
            <td class="border border-gray-300 px-2 py-2" rowspan="${rowCount}">
                <textarea id="plan-content-${week.week}"
                          placeholder="계획 내용 입력"
                          ${isApproved ? 'readonly onclick="alertApprovedPlanEdit()"' : ''}
                          class="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none focus:outline-none auto-expand-textarea ${isApproved ? 'bg-gray-50 cursor-not-allowed' : ''}"
                          style="min-height: 40px; overflow-y: hidden;">${week.plannedContent || ''}</textarea>
            </td>`;

    if (hasExecutions) {
        // 첫 번째 실적을 첫 행에 포함
        const firstExec = week.executions[0];
        const isMyExecution = firstExec.professorId === currentProf.id;
        firstRow += `
            <td class="border border-gray-300 px-2 py-2">
                <div class="flex flex-col gap-2">
                    <textarea id="exec-text-${firstExec.executionId}" readonly
                              class="w-full border border-gray-300 bg-gray-50 rounded text-sm px-2 py-1 resize-none focus:outline-none auto-expand-textarea cursor-not-allowed"
                              style="min-height: 40px; overflow-y: hidden;">${firstExec.executionContent || ''}</textarea>
                    ${isMyExecution ? `
                        <div id="exec-buttons-${firstExec.executionId}" class="flex gap-2 self-end">
                            <button onclick="editExecutionV2('${firstExec.executionId}', ${week.week})"
                                    class="text-xs text-blue-600 hover:underline">수정</button>
                            <button onclick="deleteExecutionV2('${studentId}', ${currentSemesterView.year}, ${currentSemesterView.semester}, ${week.week}, '${firstExec.executionId}')"
                                    class="text-xs text-red-600 hover:underline">삭제</button>
                        </div>
                    ` : ''}
                </div>
            </td>
            <td class="border border-gray-300 px-2 py-2 text-center text-sm">
                ${firstExec.professorName || '-'}
            </td>
        `;
    } else {
        // 실적이 없는 경우: 입력 폼을 첫 행에 바로 표시
        firstRow += `
            <td class="border border-gray-300 px-2 py-2">
                <div class="flex gap-2 items-center">
                    <textarea id="exec-content-${week.week}"
                              placeholder="${isApproved ? '실행 내용 입력' : '계획 승인 후 입력 가능'}"
                              ${!isApproved ? 'disabled' : ''}
                              class="flex-1 border border-gray-300 rounded px-2 py-1 text-sm resize-none auto-expand-textarea ${!isApproved ? 'bg-gray-100 cursor-not-allowed' : ''}"
                              style="min-height: 40px; overflow-y: hidden;"></textarea>
                    <button onclick="addExecutionV2(${week.week})"
                            ${!isApproved ? 'disabled' : ''}
                            class="text-xs px-3 py-1 ${!isApproved ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded whitespace-nowrap">+ 추가</button>
                </div>
            </td>
            <td class="border border-gray-300 px-2 py-2 text-center text-sm">-</td>
        `;
    }
    firstRow += `</tr>`;

    // 추가 실적 행들 (2번째~마지막-1 실적까지)
    let additionalRows = '';
    if (hasExecutions && week.executions.length > 1) {
        additionalRows = week.executions.slice(1).map((exec, index) => {
            const isMyExecution = exec.professorId === currentProf.id;
            return `
                <tr>
                    <td class="border border-gray-300 px-2 py-2">
                        <div class="flex flex-col gap-2">
                            <textarea id="exec-text-${exec.executionId}" readonly
                                      class="w-full border border-gray-300 bg-gray-50 rounded text-sm px-2 py-1 resize-none focus:outline-none auto-expand-textarea cursor-not-allowed"
                                      style="min-height: 40px; overflow-y: hidden;">${exec.executionContent || ''}</textarea>
                            ${isMyExecution ? `
                                <div id="exec-buttons-${exec.executionId}" class="flex gap-2 self-end">
                                    <button onclick="editExecutionV2('${exec.executionId}', ${week.week})"
                                            class="text-xs text-blue-600 hover:underline">수정</button>
                                    <button onclick="deleteExecutionV2('${studentId}', ${currentSemesterView.year}, ${currentSemesterView.semester}, ${week.week}, '${exec.executionId}')"
                                            class="text-xs text-red-600 hover:underline">삭제</button>
                                </div>
                            ` : ''}
                        </div>
                    </td>
                    <td class="border border-gray-300 px-2 py-2 text-center text-sm">
                        ${exec.professorName || '-'}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // 마지막 입력 폼 행 (실적이 있을 때만)
    let inputFormRow = '';
    if (hasExecutions) {
        inputFormRow = `
            <tr>
                <td class="border border-gray-300 px-2 py-2">
                    <div class="flex gap-2 items-center">
                        <textarea id="exec-content-${week.week}"
                                  placeholder="${isApproved ? '실행 내용 입력' : '계획 승인 후 입력 가능'}"
                                  ${!isApproved ? 'disabled' : ''}
                                  class="flex-1 border border-gray-300 rounded px-2 py-1 text-sm resize-none auto-expand-textarea ${!isApproved ? 'bg-gray-100 cursor-not-allowed' : ''}"
                                  style="min-height: 40px; overflow-y: hidden;"></textarea>
                        <button onclick="addExecutionV2(${week.week})"
                                ${!isApproved ? 'disabled' : ''}
                                class="text-xs px-3 py-1 ${!isApproved ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded whitespace-nowrap">+ 추가</button>
                    </div>
                </td>
                <td class="border border-gray-300 px-2 py-2 text-center text-sm">-</td>
            </tr>
        `;
    }

    return firstRow + additionalRows + inputFormRow;
}

// 모바일 카드 뷰 렌더링 (교수용)
function renderWeekCardMobile(week, advisors, currentProf, plan, studentId, isApproved = false) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const hasPlan = week.plannedContent && week.plannedContent.trim() !== '';

    return `
        <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 주차 헤더 -->
            <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <span class="text-base font-semibold text-gray-800">${week.week}주차</span>
                ${!isApproved ? `
                    <button onclick="deleteWeek(${week.week})"
                            class="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                            title="주차 삭제">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                ` : ''}
            </div>

            <!-- 계획 내용 -->
            <div class="p-4 border-b border-gray-200">
                <span class="text-sm font-semibold text-gray-700">계획 내용:</span>
                ${hasPlan || isApproved ? `
                    <textarea id="plan-content-${week.week}"
                              placeholder="계획 내용 입력"
                              ${isApproved ? 'readonly onclick="alertApprovedPlanEdit()"' : ''}
                              class="w-full border border-gray-300 rounded px-2 py-2 text-sm resize-none mt-2 ${isApproved ? 'bg-gray-50 cursor-not-allowed' : ''}"
                              style="min-height: 60px;">${week.plannedContent || ''}</textarea>
                ` : `
                    <textarea id="plan-content-${week.week}"
                              placeholder="계획 내용 입력"
                              class="w-full border border-gray-300 rounded px-2 py-2 text-sm resize-none mt-2"
                              style="min-height: 60px;">${week.plannedContent || ''}</textarea>
                `}
            </div>

            <!-- 실적 목록 -->
            <div class="p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">
                    실적 (${week.executions.length}건)
                </h4>

                <!-- 기존 실적 목록 -->
                ${hasExecutions ? `
                    <div class="space-y-3 mb-4">
                        ${week.executions.map(exec => renderExecutionCommentMobile(exec, currentProf, week.week, studentId)).join('')}
                    </div>
                ` : `
                    <p class="text-sm text-gray-500 mb-4">실적 없음</p>
                `}

                <!-- 실적 추가 폼 -->
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span class="text-xs font-semibold text-gray-700 block mb-2">실적 추가</span>
                    <textarea id="exec-content-${week.week}"
                              placeholder="${isApproved ? '실행 내용 입력' : '계획 승인 후 입력 가능'}"
                              ${!isApproved ? 'disabled' : ''}
                              class="w-full border border-gray-300 rounded px-2 py-2 text-sm resize-none mb-2 ${!isApproved ? 'bg-gray-100 cursor-not-allowed' : ''}"
                              style="min-height: 60px;"></textarea>
                    <button onclick="addExecutionV2(${week.week})"
                            ${!isApproved ? 'disabled' : ''}
                            class="w-full px-3 py-2 ${!isApproved ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm rounded">
                        + 추가
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 모바일용 실적 렌더링
function renderExecutionCommentMobile(execution, currentProf, weekNumber, studentId) {
    const isMyExecution = execution.professorId === currentProf.id;

    return `
        <div class="execution-comment ${isMyExecution ? 'bg-[#FCE4EC] border-[#F8BBD9]' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3">
            <div class="flex justify-between items-start mb-2">
                <div class="text-sm font-semibold ${isMyExecution ? 'text-[#6A0028]' : 'text-gray-800'}">
                    ${execution.professorName} ${isMyExecution ? '(나)' : ''}
                </div>
                ${isMyExecution ? `
                    <button onclick="deleteExecutionV2('${studentId}', ${currentSemesterView.year}, ${currentSemesterView.semester}, ${weekNumber}, '${execution.executionId}')"
                            class="text-xs text-red-600 hover:text-red-800">
                        삭제
                    </button>
                ` : ''}
            </div>
            <p class="text-sm text-gray-800">${execution.executionContent}</p>
        </div>
    `;
}

// (renderExecutionInputForm 및 renderWeekPlanInputForm 함수 제거 - 더 이상 사용하지 않음)

// ==================== 실적 추가 (인라인) ====================
function addExecutionV2(weekNumber) {
    const content = document.getElementById(`exec-content-${weekNumber}`).value.trim();

    if (!content) {
        showToast('실행 내용을 입력해주세요.', 'warning');
        return;
    }

    const currentProf = DataService.getCurrentProfessor();
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

    const executionData = {
        professorId: currentProf.id,
        professorName: currentProf.name,
        executionDate: today,
        executionContent: content,
        comment: '', // 교수 의견 필드 제거
        method: 'zoom' // 기본값
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

        // 모달 내용 새로고침
        setTimeout(() => {
            refreshModalContent();
        }, 300);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 실적 수정
function editExecutionV2(executionId, weekNumber) {
    const textarea = document.getElementById(`exec-text-${executionId}`);
    const buttonsDiv = document.getElementById(`exec-buttons-${executionId}`);

    if (!textarea || !buttonsDiv) {
        showToast('실적을 찾을 수 없습니다.', 'error');
        return;
    }

    // 현재 편집 모드인지 확인
    const isEditing = !textarea.readOnly;

    if (isEditing) {
        // 저장 모드 - 수정 내용 저장
        const newContent = textarea.value.trim();

        if (!newContent) {
            showToast('실행 내용을 입력해주세요.', 'warning');
            return;
        }

        try {
            DataService.updateExecution(
                currentStudentIdV2,
                currentSemesterView.year,
                currentSemesterView.semester,
                weekNumber,
                executionId,
                newContent
            );

            showToast('실적이 수정되었습니다.', 'success');

            // 읽기 모드로 전환
            textarea.readOnly = true;
            textarea.classList.remove('bg-white');
            textarea.classList.add('bg-gray-50', 'cursor-not-allowed');

            // 버튼을 수정/삭제로 복원
            buttonsDiv.innerHTML = `
                <button onclick="editExecutionV2('${executionId}', ${weekNumber})"
                        class="text-xs text-blue-600 hover:underline">수정</button>
                <button onclick="deleteExecutionV2('${currentStudentIdV2}', ${currentSemesterView.year}, ${currentSemesterView.semester}, ${weekNumber}, '${executionId}')"
                        class="text-xs text-red-600 hover:underline">삭제</button>
            `;

            // 모달 내용 새로고침
            setTimeout(() => {
                refreshModalContent();
            }, 300);

        } catch (error) {
            showToast(error.message, 'error');
        }
    } else {
        // 편집 모드로 전환
        textarea.readOnly = false;
        textarea.classList.remove('bg-gray-50', 'cursor-not-allowed');
        textarea.classList.add('bg-white');
        textarea.focus();

        // 버튼을 저장/취소로 변경
        buttonsDiv.innerHTML = `
            <button onclick="editExecutionV2('${executionId}', ${weekNumber})"
                    class="text-xs text-green-600 hover:underline font-semibold">저장</button>
            <button onclick="cancelEditExecutionV2('${executionId}')"
                    class="text-xs text-gray-600 hover:underline">취소</button>
        `;

        // 원본 데이터 백업
        textarea.dataset.original = textarea.value;
    }
}

// 실적 수정 취소
function cancelEditExecutionV2(executionId) {
    const textarea = document.getElementById(`exec-text-${executionId}`);
    const buttonsDiv = document.getElementById(`exec-buttons-${executionId}`);

    if (!textarea || !buttonsDiv) return;

    // 원본 데이터 복원
    textarea.value = textarea.dataset.original || '';

    // 읽기 모드로 전환
    textarea.readOnly = true;
    textarea.classList.remove('bg-white');
    textarea.classList.add('bg-gray-50', 'cursor-not-allowed');

    // 모달 내용 새로고침
    refreshModalContent();
}

// 실적 삭제
function deleteExecutionV2(studentId, year, semester, week, executionId) {
    if (!confirm(`${week}주차 실적을 삭제하시겠습니까?`)) return;

    try {
        DataService.deleteExecution(studentId, year, semester, week, executionId);
        showToast(`${week}주차 실적이 삭제되었습니다.`, 'success');

        // 모달 내용 새로고침
        setTimeout(() => {
            refreshModalContent();
        }, 300);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== 주차별 계획 저장 (인라인) ====================
function saveWeekPlan(weekNumber) {
    const content = document.getElementById(`plan-content-${weekNumber}`).value.trim();

    if (!content) {
        showToast('계획 내용을 입력해주세요.', 'warning');
        return;
    }

    const planData = {
        plannedTopic: '', // 주제 필드 제거
        plannedContent: content,
        plannedMethod: 'zoom', // 기본값
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

        // 모달 내용 새로고침
        setTimeout(() => {
            refreshModalContent();
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
        const contentEl = document.getElementById(`plan-content-${week}`);

        if (!contentEl) continue;

        const content = contentEl.value.trim();

        // 빈 주차는 건너뜀
        if (!content) {
            emptyCount++;
            continue;
        }

        const planData = {
            plannedTopic: '', // 주제 필드 제거
            plannedContent: content,
            plannedMethod: 'zoom', // 기본값
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

    // 모달 내용 새로고침
    setTimeout(() => {
        refreshModalContent();
    }, 500);
}

// ==================== 주차 설정/초기화 (더 이상 사용하지 않음 - 모달 내부에서 처리) ====================
// 이전 버전의 resetTotalWeeks와 executeResetWeeks 함수는 모달 팝업 방식으로 인해 사용하지 않습니다.
// 대신 resetTotalWeeksInModal과 executeCreatePlan 함수를 사용합니다.

// ==================== 학기 계획 승인 ====================
async function approveSemesterPlan() {
    // 커스텀 확인 대화상자 표시
    const confirmed = await showCustomConfirm(
        '계획 승인 확인',
        '이 학기의 지도 계획을 승인하시겠습니까?',
        '승인',
        '취소',
        'primary'
    );

    if (!confirmed) {
        return;
    }

    executeApprovePlan();
}

// 실제 승인 실행 함수
function executeApprovePlan() {
    try {
        const currentProf = DataService.getCurrentProfessor();
        const allPlans = DataService.getAllSemesterPlans(currentStudentIdV2);
        const currentPlan = allPlans.find(p =>
            p.year === currentSemesterView.year && p.semester === currentSemesterView.semester
        );

        if (!currentPlan) {
            showToast('계획을 찾을 수 없습니다.', 'error');
            return;
        }

        // 승인 전에 모든 주차의 계획 내용 저장
        if (currentPlan.weeks && currentPlan.weeks.length > 0) {
            currentPlan.weeks.forEach(week => {
                const contentTextarea = document.getElementById(`plan-content-${week.week}`);
                if (contentTextarea) {
                    week.plannedContent = contentTextarea.value.trim();
                }
            });

            console.log('승인 전 계획 내용 저장 완료');
        }

        // 승인 상태 업데이트
        currentPlan.approved = true;
        currentPlan.approvedBy = currentProf.name;
        currentPlan.approvedDate = new Date().toISOString();

        // DataService에 저장
        DataService.saveSemesterPlan(
            currentStudentIdV2,
            currentSemesterView.year,
            currentSemesterView.semester,
            currentPlan
        );

        console.log('승인 처리:', {
            studentId: currentStudentIdV2,
            year: currentSemesterView.year,
            semester: currentSemesterView.semester,
            approved: currentPlan.approved,
            approvedBy: currentPlan.approvedBy,
            approvedDate: currentPlan.approvedDate
        });

        showToast('학기 계획이 승인되었습니다.', 'success');

        // 모달 내용 새로고침
        setTimeout(() => {
            refreshModalContent();
        }, 500);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 승인 취소 함수
async function cancelSemesterApproval() {
    // 커스텀 확인 대화상자 표시
    const confirmed = await showCustomConfirm(
        '⚠️ 승인 취소 확인',
        '계획 승인을 취소하시겠습니까?\n\n승인을 취소하면 계획을 수정할 수 있습니다.',
        '승인 취소',
        '닫기',
        'danger'
    );

    if (!confirmed) {
        return;
    }

    executeCancelApproval();
}

// 실제 승인 취소 실행 함수
function executeCancelApproval() {
    try {
        const allPlans = DataService.getAllSemesterPlans(currentStudentIdV2);
        const currentPlan = allPlans.find(p =>
            p.year === currentSemesterView.year && p.semester === currentSemesterView.semester
        );

        if (!currentPlan) {
            showToast('계획을 찾을 수 없습니다.', 'error');
            return;
        }

        // 승인 상태 제거
        currentPlan.approved = false;
        currentPlan.approvedBy = null;
        currentPlan.approvedDate = null;

        // DataService에 저장
        DataService.saveSemesterPlan(
            currentStudentIdV2,
            currentSemesterView.year,
            currentSemesterView.semester,
            currentPlan
        );

        console.log('승인 취소 처리:', {
            studentId: currentStudentIdV2,
            year: currentSemesterView.year,
            semester: currentSemesterView.semester
        });

        showToast('계획 승인이 취소되었습니다.', 'success');

        // 모달 내용 새로고침
        setTimeout(() => {
            refreshModalContent();
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

// 초기화 실행
initAutoExpandTextareas();

// Export
window.showSemesterGuidanceDetail = showSemesterGuidanceDetail;
window.closeSemesterGuidanceModal = closeSemesterGuidanceModal;
window.changeSemesterViewInModal = changeSemesterViewInModal;
window.addNewWeek = addNewWeek;
window.deleteWeek = deleteWeek;
window.resetTotalWeeksInModal = resetTotalWeeksInModal;
window.executeCreatePlan = executeCreatePlan;
window.refreshModalContent = refreshModalContent;
window.addExecutionV2 = addExecutionV2;
window.editExecutionV2 = editExecutionV2;
window.cancelEditExecutionV2 = cancelEditExecutionV2;
window.deleteExecutionV2 = deleteExecutionV2;
window.saveWeekPlan = saveWeekPlan;
window.saveAllWeekPlans = saveAllWeekPlans;
window.approveSemesterPlan = approveSemesterPlan;
window.cancelSemesterApproval = cancelSemesterApproval;
window.alertApprovedPlanEdit = alertApprovedPlanEdit;
window.autoExpandTextarea = autoExpandTextarea;
window.expandAllTextareas = expandAllTextareas;

console.log('✅ 학기별 논문지도 계획 V2 모듈 로드 완료 (모달 팝업 방식)');
