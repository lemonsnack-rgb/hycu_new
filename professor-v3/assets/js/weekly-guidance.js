// ===================================
// 교수용 학기별 지도 계획 (관리자 UI 기반 + 실적 입력 기능)
// ===================================

let currentStudentId = null;
let currentYear = 2025;
let currentSemester = 1;

// 학기별 계획 데이터 저장소 (임시)
const semesterPlansStorage = {};

// 목업 데이터 초기화 - 승인 대기 중인 학생 계획
const mockPlanData = {
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

// S001 키로 저장 (mock-data.js의 학생 ID)
semesterPlansStorage['S001_2025_1'] = { ...mockPlanData, studentId: 'S001' };

// 2024001 키로도 저장 (교수 화면 테이블에서 실제 사용되는 ID)
semesterPlansStorage['2024001_2025_1'] = { ...mockPlanData, studentId: '2024001' };

// DataService 확장 - 학기별 계획 관리 함수
if (typeof DataService !== 'undefined') {
    // 학기별 계획 조회
    DataService.getSemesterPlan = function(studentId, year, semester) {
        const key = `${studentId}_${year}_${semester}`;
        console.log(`🔍 getSemesterPlan 호출: ${key}`, semesterPlansStorage[key]);
        console.log('📦 전체 저장소:', Object.keys(semesterPlansStorage));
        return semesterPlansStorage[key] || null;
    };

    // 학생의 모든 학기 계획 조회
    DataService.getAllSemesterPlans = function(studentId) {
        const plans = [];
        for (const key in semesterPlansStorage) {
            if (key.startsWith(`${studentId}_`)) {
                plans.push(semesterPlansStorage[key]);
            }
        }
        console.log(`🔍 getAllSemesterPlans 호출: ${studentId}`, plans);
        return plans;
    };

    // 학기별 계획 저장/업데이트
    DataService.saveSemesterPlan = function(studentId, year, semester, planData) {
        const key = `${studentId}_${year}_${semester}`;
        semesterPlansStorage[key] = planData;
        console.log(`✅ 학기 계획 저장: ${key}`, planData);
        return semesterPlansStorage[key];
    };

    // 학기별 계획 초기화/생성
    DataService.resetSemesterPlan = function(studentId, year, semester, totalWeeks) {
        const key = `${studentId}_${year}_${semester}`;

        // totalWeeks가 0이면 계획 삭제
        if (totalWeeks === 0) {
            delete semesterPlansStorage[key];
            console.log(`✅ 학기 계획 삭제: ${key}`);
            return null;
        }

        // 주차 배열 생성
        const weeks = [];
        for (let i = 1; i <= totalWeeks; i++) {
            weeks.push({
                week: i,
                plannedDate: null,
                plannedContent: '',
                plannedMethod: 'meeting',
                executions: []
            });
        }

        semesterPlansStorage[key] = {
            studentId,
            year,
            semester,
            totalWeeks,
            weeks,  // 새로운 구조: weeks 배열
            plans: [],  // 레거시: plans 배열 (하위 호환성)
            approved: false
        };
        console.log(`✅ 학기 계획 생성/초기화: ${key}, ${totalWeeks}주`);
        return semesterPlansStorage[key];
    };

    // 주차별 계획 업데이트
    DataService.updateWeekPlan = function(studentId, year, semester, weekNumber, planData) {
        const key = `${studentId}_${year}_${semester}`;
        const plan = semesterPlansStorage[key];

        if (!plan) {
            throw new Error('학기 계획이 존재하지 않습니다.');
        }

        const week = plan.weeks?.find(w => w.week === weekNumber);
        if (!week) {
            throw new Error('해당 주차를 찾을 수 없습니다.');
        }

        // 계획 데이터 업데이트
        Object.assign(week, planData);
        console.log(`✅ ${weekNumber}주차 계획 업데이트:`, planData);
        return true;
    };

    // 실적 추가
    DataService.addExecution = function(studentId, year, semester, weekNumber, executionData) {
        const key = `${studentId}_${year}_${semester}`;
        const plan = semesterPlansStorage[key];

        if (!plan) {
            throw new Error('학기 계획이 존재하지 않습니다.');
        }

        const week = plan.weeks?.find(w => w.week === weekNumber);
        if (!week) {
            throw new Error('해당 주차를 찾을 수 없습니다.');
        }

        // executions 배열 초기화
        if (!week.executions) {
            week.executions = [];
        }

        // 실적 ID 생성
        const execution = {
            ...executionData,
            executionId: executionData.executionId || `EXEC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        week.executions.push(execution);
        console.log(`✅ ${weekNumber}주차 실적 추가:`, execution);
        return true;
    };

    // 실적 수정
    DataService.updateExecution = function(studentId, year, semester, weekNumber, executionId, newContent) {
        const key = `${studentId}_${year}_${semester}`;
        const plan = semesterPlansStorage[key];

        if (!plan) {
            throw new Error('학기 계획이 존재하지 않습니다.');
        }

        const week = plan.weeks?.find(w => w.week === weekNumber);
        if (!week) {
            throw new Error('해당 주차를 찾을 수 없습니다.');
        }

        const execution = week.executions?.find(e => e.executionId === executionId);
        if (!execution) {
            throw new Error('해당 실적을 찾을 수 없습니다.');
        }

        execution.executionContent = newContent;
        console.log(`✅ ${weekNumber}주차 실적 수정: ${executionId}`);
        return true;
    };

    // 실적 삭제
    DataService.deleteExecution = function(studentId, year, semester, weekNumber, executionId) {
        const key = `${studentId}_${year}_${semester}`;
        const plan = semesterPlansStorage[key];

        if (!plan) {
            throw new Error('학기 계획이 존재하지 않습니다.');
        }

        const week = plan.weeks?.find(w => w.week === weekNumber);
        if (!week) {
            throw new Error('해당 주차를 찾을 수 없습니다.');
        }

        if (!week.executions) {
            throw new Error('실적이 없습니다.');
        }

        const index = week.executions.findIndex(e => e.executionId === executionId);
        if (index === -1) {
            throw new Error('해당 실적을 찾을 수 없습니다.');
        }

        week.executions.splice(index, 1);
        console.log(`✅ ${weekNumber}주차 실적 삭제: ${executionId}`);
        return true;
    };

    // 실적 추가 (레거시 - plans 배열용)
    DataService.addSemesterExecution = function(studentId, year, semester, execution) {
        const key = `${studentId}_${year}_${semester}`;
        if (!semesterPlansStorage[key]) {
            console.error('학기 계획이 존재하지 않습니다.');
            return false;
        }
        semesterPlansStorage[key].plans.push(execution);
        console.log('✅ 실적 추가 완료:', execution);
        console.log('현재 plans:', semesterPlansStorage[key].plans);
        return true;
    };

    // 실적 수정
    DataService.updateSemesterExecution = function(studentId, year, semester, executionId, executionData) {
        const key = `${studentId}_${year}_${semester}`;
        if (!semesterPlansStorage[key]) {
            console.error('학기 계획이 존재하지 않습니다.');
            return false;
        }
        const plan = semesterPlansStorage[key].plans.find(p => p.id === executionId);
        if (plan) {
            Object.assign(plan, executionData);
            console.log('✅ 실적 수정 완료:', executionId);
            return true;
        }
        return false;
    };

    // 실적 삭제
    DataService.deleteSemesterExecution = function(studentId, year, semester, executionId) {
        const key = `${studentId}_${year}_${semester}`;
        if (!semesterPlansStorage[key]) {
            console.error('학기 계획이 존재하지 않습니다.');
            return false;
        }
        const index = semesterPlansStorage[key].plans.findIndex(p => p.id === executionId);
        if (index > -1) {
            semesterPlansStorage[key].plans.splice(index, 1);
            console.log('✅ 실적 삭제 완료:', executionId);
            return true;
        }
        return false;
    };
}

// ========== 모달 유틸리티 함수 (관리자용과 동일) ==========

function openModal(title, content, confirmText = '저장', onConfirm = null, showFooter = true, options = {}) {
    console.log('🔵 openModal 호출됨', { title, confirmText });

    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('modal-confirm').textContent = confirmText;

    const footer = document.getElementById('modal-footer');
    if (!showFooter) {
        footer.classList.add('hidden');
    } else {
        footer.classList.remove('hidden');
    }

    // 기존 추가 버튼 제거
    const existingExtraBtns = document.querySelectorAll('.modal-extra-btn');
    existingExtraBtns.forEach(btn => btn.remove());

    // 복수 버튼 지원
    if (options.showExtraButtons && options.extraButtons) {
        const cancelBtn = document.getElementById('modal-cancel');
        options.extraButtons.forEach(btnConfig => {
            const extraBtn = document.createElement('button');
            extraBtn.className = `modal-extra-btn px-4 py-2 rounded-md text-sm font-medium ${btnConfig.className}`;
            extraBtn.textContent = btnConfig.text;
            extraBtn.onclick = btnConfig.onClick;
            cancelBtn.parentNode.insertBefore(extraBtn, cancelBtn);
        });
    }
    // 단일 버튼 지원 (하위 호환성)
    else if (options.showExtraButton) {
        const extraBtn = document.createElement('button');
        extraBtn.className = `modal-extra-btn px-4 py-2 rounded-md text-sm font-medium ${options.extraButtonClass || 'bg-[#009DE8] hover:bg-[#0087c9] text-white'}`;
        extraBtn.textContent = options.extraButtonText || '추가 작업';
        extraBtn.onclick = options.onExtraButtonClick;

        const cancelBtn = document.getElementById('modal-cancel');
        cancelBtn.parentNode.insertBefore(extraBtn, cancelBtn);
    }

    // 모달 표시
    const modalElement = document.getElementById('universal-modal');
    const backdropElement = document.getElementById('modal-backdrop');
    modalElement.classList.remove('hidden');
    modalElement.classList.add('flex');
    modalElement.style.cssText = ''; // 모든 inline style 제거
    backdropElement.classList.remove('hidden');
    backdropElement.style.cssText = ''; // 모든 inline style 제거

    // ✨ 취소 버튼에 직접 이벤트 리스너 연결 (onclick 속성 무시)
    const cancelBtn = document.getElementById('modal-cancel');
    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');

    // 기존 이벤트 리스너 제거 후 재등록
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newCloseBtn = closeBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

    newCancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔴 취소 버튼 클릭됨');
        window.closeModal();
    });

    newCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔴 X 버튼 클릭됨');
        window.closeModal();
    });

    // backdrop 클릭 시 모달 닫기
    backdrop.onclick = (e) => {
        if (e.target === backdrop) {
            console.log('🔴 backdrop 클릭됨');
            window.closeModal();
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

    console.log('✅ openModal 완료 - 이벤트 리스너 등록됨');
}

function closeModal() {
    console.log('🔴 closeModal 호출됨 - 강제 닫기 시작');
    const modal = document.getElementById('universal-modal');
    const backdrop = document.getElementById('modal-backdrop');

    console.log('모달 요소 상태:', {
        modal: !!modal,
        backdrop: !!backdrop,
        modalClasses: modal?.className,
        backdropClasses: backdrop?.className
    });

    if (modal) {
        // 🔥 모든 방법을 동원해서 강제로 숨김
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
        console.log('✅ 모달 강제 숨김 처리 완료');
    } else {
        console.error('❌ universal-modal 요소를 찾을 수 없음');
    }

    if (backdrop) {
        // 🔥 모든 방법을 동원해서 강제로 숨김
        backdrop.classList.add('hidden');
        backdrop.classList.remove('flex');
        backdrop.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
        console.log('✅ backdrop 강제 숨김 처리 완료');
    } else {
        console.error('❌ modal-backdrop 요소를 찾을 수 없음');
    }

    console.log('🟢 closeModal 실행 완료');
}

// 전역으로 명시적 등록
window.openModal = openModal;
window.closeModal = closeModal;

// ========== 주차별 지도 관리 함수 ==========

// 주차별 지도 관리 초기화
function initProfessorWeeklyGuidance() {
    console.log('교수용 주차별 지도 관리 초기화');
    showProfessorStudentList();
}

// 목록 화면
function showProfessorStudentList() {
    currentStudentId = null;

    const students = DataService.getMyStudents();
    const currentProf = DataService.getCurrentProfessor();
    const contentArea = document.getElementById('guidance-content-area');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <!-- 검색 영역 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="p-4 bg-gray-50">
                <div class="grid grid-cols-5 gap-4">
                    <!-- 1행 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
                        <select id="filter-year" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                        <select id="filter-semester" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="1">1학기</option>
                            <option value="2">2학기</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                        <select id="filter-college-type" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="일반대학원">일반대학원</option>
                            <option value="특수대학원">특수대학원</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                        <select id="filter-graduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="일반대학원">일반대학원</option>
                            <option value="교육대학원">교육대학원</option>
                            <option value="산업정보대학원">산업정보대학원</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                        <select id="filter-major-category" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="공과대학">공과대학</option>
                            <option value="사범대학">사범대학</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                        <select id="filter-major" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="컴퓨터공학과">컴퓨터공학과</option>
                            <option value="경영학과">경영학과</option>
                        </select>
                    </div>

                    <!-- 2행 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                        <select id="filter-degree" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="석사">석사</option>
                            <option value="박사">박사</option>
                            <option value="석박통합">석박통합</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                        <select id="filter-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="재학">재학</option>
                            <option value="휴학">휴학</option>
                            <option value="수료">수료</option>
                            <option value="졸업">졸업</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                        <input type="text" id="filter-student-id" placeholder="학번"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                        <input type="text" id="filter-name" placeholder="성명"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                        <input type="text" id="filter-advisor" placeholder="지도교수명"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>

                    <!-- 3행 -->
                    <div class="col-span-4"></div>
                    <div class="flex items-center justify-end">
                        <button onclick="searchProfessorStudents()" class="px-3 bg-[#6A0028] text-white rounded hover:bg-[#4A001C] text-xs font-medium" style="height: 34px;">
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
                        <h3 class="table-title">학기별 지도 목록</h3>
                        <span class="table-count">(총 ${students.length}건)</span>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full">
                        <thead>
                        <tr>
                            <th style="width: 60px;">순번</th>
                            <th style="width: 80px;">학년도</th>
                            <th style="width: 80px;">학기</th>
                            <th style="width: 100px;">대학구분</th>
                            <th style="width: 100px;">계열/대학원</th>
                            <th style="width: 120px;">학부(과)전공</th>
                            <th style="width: 150px;">학과/전공</th>
                            <th style="width: 80px;">학위과정</th>
                            <th style="width: 80px;">학적상태</th>
                            <th style="width: 100px;">학번</th>
                            <th style="width: 100px;">성명</th>
                            <th style="width: 100px;">지도교수</th>
                        </tr>
                    </thead>
                    <tbody id="guidance-list-body">
                        ${students.map((student, idx) => {
                            return `
                                <tr class="cursor-pointer" onclick="showProfessorStudentDetail('${student.studentId}')">
                                    <td>${idx + 1}</td>
                                    <td>2024</td>
                                    <td>${student.semester || '-'}학기</td>
                                    <td>일반대학원</td>
                                    <td>일반대학원</td>
                                    <td>-</td>
                                    <td>${student.major || '-'}</td>
                                    <td>${getDegreeText(student.degree)}</td>
                                    <td>재학</td>
                                    <td>${student.studentId}</td>
                                    <td><a href="#" onclick="event.stopPropagation(); showStudentDetailModal({stdNo:'${student.studentId}', name:'${student.name}', dept:'${student.major || "-"}', degree:'${getDegreeText(student.degree)}', stage:'${(student.basicStageName || student.currentStage || "-").replace(/'/g, "\\'")}'}); return false;" class="text-[#6A0028] hover:underline font-medium cursor-pointer">${student.name}</a></td>
                                    <td>${currentProf.name}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `;
}

// 학생 상세 화면 (관리자와 동일한 구조)
function showProfessorStudentDetail(studentId) {
    currentStudentId = studentId;

    // ✨ semester-guidance-v2.js의 함수 호출 (테이블 방식)
    if (typeof showSemesterGuidanceDetail === 'function') {
        showSemesterGuidanceDetail(studentId);
        return;
    }

    // Fallback: 기존 방식
    const student = DataService.getStudentDetail(studentId);
    if (!student) {
        showToast('학생 정보를 찾을 수 없습니다', 'error');
        return;
    }

    const currentProf = DataService.getCurrentProfessor();

    // weeklyPlans 데이터 가져오기 (totalWeeks 포함)
    const semesterPlan = DataService.getSemesterPlan(studentId, currentYear, currentSemester);
    const totalWeeks = semesterPlan?.totalWeeks || 0;
    const plans = semesterPlan?.plans || [];

    // 주차 구조 생성
    const weeks = generateProfessorWeeks(plans, totalWeeks);

    const contentArea = document.getElementById('guidance-content-area');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <!-- 뒤로가기 버튼 -->
        <div class="mb-4">
            <button onclick="showProfessorStudentList()"
                    class="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="text-sm font-medium">목록으로 돌아가기</span>
            </button>
        </div>

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
                        <span class="text-gray-900 font-medium">${student.studentId}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                        <span class="text-gray-900 font-medium">${student.name}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                        <span class="text-gray-900 font-medium">
                            ${student.advisors.map(advisor =>
                                `${advisor.name} ${advisor.role === 'primary' ? '(주)' : '(부)'}`
                            ).join(', ')}
                        </span>
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
                        <select id="prof-select-year" onchange="changeProfessorSemesterView()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            <option value="2025" selected>2025학년도</option>
                            <option value="2024">2024학년도</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-gray-600 min-w-[60px]">학기:</label>
                        <select id="prof-select-semester" onchange="changeProfessorSemesterView()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            <option value="1" selected>1학기</option>
                            <option value="2">2학기</option>
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
                        <button onclick="resetProfessorTotalWeeks()"
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
        ${totalWeeks > 0 ? renderProfessorWeeklyCards(weeks, currentProf) : ''}
    `;
}

// 주차 구조 생성 (관리자와 동일)
function generateProfessorWeeks(plans, totalWeeks = 15) {
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
                    professorId: plan.professorId || plan.advisor?.id,  // ✨ 새 형식과 구 형식 모두 지원
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

// 주차별 카드 렌더링 (관리자와 유사, 실적 입력 폼 추가)
function renderProfessorWeeklyCards(weeks, currentProf) {
    return `
        <div class="space-y-4">
            <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-800">주차별 지도 계획 및 실적</h3>
            </div>

            ${weeks.map(week => renderProfessorWeekCard(week, currentProf)).join('')}
        </div>
    `;
}

// 개별 주차 카드 (교수용 - 실적 입력 기능 포함)
function renderProfessorWeekCard(week, currentProf) {
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

                <!-- 실적 목록 (댓글 형태) -->
                <div class="p-4">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">
                        실적 및 교수의견 (${week.executions.length}건)
                    </h4>

                    <!-- 기존 실적 목록 -->
                    ${week.executions.length > 0 ? `
                        <div class="space-y-3 mb-4">
                            ${week.executions.map(exec => renderProfessorExecutionComment(exec, currentProf, week.week)).join('')}
                        </div>
                    ` : ''}

                    <!-- ✨ 실적 추가 폼 (교수만 가능) -->
                    ${renderExecutionInputForm(week.week, currentProf)}
                </div>
        </div>
    `;
}

// ✨ 실적 폼 렌더링 (본인 실적에만 수정/삭제 버튼 표시)
function renderProfessorExecutionComment(execution, currentProf, weekNumber) {
    const isMyExecution = execution.professorId === currentProf.id;

    return `
        <div id="execution-${execution.id}" class="execution-item ${isMyExecution ? 'bg-[#FCE4EC] border-[#F8BBD9]' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-semibold ${isMyExecution ? 'text-[#6A0028]' : 'text-gray-800'}">
                    ${execution.professorName} ${isMyExecution ? '(나)' : ''}
                </span>
                ${isMyExecution ? `
                    <div id="buttons-${execution.id}" class="flex gap-2">
                        <button onclick="toggleEditProfessorExecution(${weekNumber}, ${execution.id})"
                                class="text-xs text-[#6A0028] hover:text-[#8A0034] font-medium">
                            수정
                        </button>
                        <button onclick="deleteProfessorExecution(${weekNumber}, ${execution.id})"
                                class="text-xs text-red-600 hover:text-red-800 font-medium">
                            삭제
                        </button>
                    </div>
                ` : ''}
            </div>

            <div class="space-y-3">
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">실행일 *</label>
                        <input type="date" id="exec-date-${execution.id}" value="${execution.executionDate}"
                               class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-100" disabled>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">지도 방식 *</label>
                        <select id="exec-method-${execution.id}" class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-100" disabled>
                            <option value="meeting" ${execution.method === 'meeting' ? 'selected' : ''}>대면</option>
                            <option value="online" ${execution.method === 'online' ? 'selected' : ''}>온라인</option>
                            <option value="zoom" ${execution.method === 'zoom' ? 'selected' : ''}>Zoom</option>
                            <option value="email" ${execution.method === 'email' ? 'selected' : ''}>이메일</option>
                            <option value="phone" ${execution.method === 'phone' ? 'selected' : ''}>전화</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs text-gray-600 mb-1">실행 내용 *</label>
                    <textarea id="exec-content-edit-${execution.id}" rows="3"
                              class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100" disabled>${execution.executionContent}</textarea>
                </div>

                <div>
                    <label class="block text-xs text-gray-600 mb-1">교수 의견 *</label>
                    <textarea id="exec-comment-edit-${execution.id}" rows="2"
                              class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100" disabled>${execution.comment}</textarea>
                </div>
            </div>
        </div>
    `;
}

// ✨ 실적 추가 인라인 폼
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
                        <button onclick="addProfessorExecution(${weekNumber})"
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

// ✨ 실적 추가 (인라인)
function addProfessorExecution(weekNumber) {
    const executionDate = document.getElementById(`exec-date-${weekNumber}`).value;
    const method = document.getElementById(`exec-method-${weekNumber}`).value;
    const content = document.getElementById(`exec-content-${weekNumber}`).value.trim();
    const comment = document.getElementById(`exec-comment-${weekNumber}`).value.trim();

    if (!executionDate || !content || !comment) {
        showToast('모든 필수 항목을 입력해주세요.', 'warning');
        return;
    }

    const currentProf = DataService.getCurrentProfessor();

    const newExecution = {
        id: Date.now(),
        week: weekNumber,
        professorId: currentProf.id,
        professorName: currentProf.name,
        executionDate: executionDate,
        method: method,
        executionContent: content,
        comment: comment,
        createdAt: new Date().toISOString()
    };

    // semesterPlansStorage에 저장
    const success = DataService.addSemesterExecution(currentStudentId, currentYear, currentSemester, newExecution);

    if (success) {
        showToast(`${weekNumber}주차 실적이 추가되었습니다.`, 'success');

        // 입력 폼 초기화
        document.getElementById(`exec-content-${weekNumber}`).value = '';
        document.getElementById(`exec-comment-${weekNumber}`).value = '';

        // 화면 갱신 (입력 폼은 유지)
        showProfessorStudentDetail(currentStudentId);
    } else {
        showToast('실적 추가에 실패했습니다. 계획을 먼저 생성해주세요.', 'error');
    }
}

// ✨ 실적 수정 모드 토글 (인라인 편집)
function toggleEditProfessorExecution(weekNumber, executionId) {
    const dateInput = document.getElementById(`exec-date-${executionId}`);
    const methodSelect = document.getElementById(`exec-method-${executionId}`);
    const contentTextarea = document.getElementById(`exec-content-edit-${executionId}`);
    const commentTextarea = document.getElementById(`exec-comment-edit-${executionId}`);
    const buttonsDiv = document.getElementById(`buttons-${executionId}`);

    // 현재 편집 모드인지 확인
    const isEditing = !dateInput.disabled;

    if (isEditing) {
        // 저장 모드 → 저장 실행
        const executionData = {
            executionDate: dateInput.value,
            method: methodSelect.value,
            executionContent: contentTextarea.value.trim(),
            comment: commentTextarea.value.trim()
        };

        if (!executionData.executionDate || !executionData.executionContent || !executionData.comment) {
            showToast('모든 필수 항목을 입력해주세요.', 'warning');
            return;
        }

        const success = DataService.updateSemesterExecution(currentStudentId, currentYear, currentSemester, executionId, executionData);

        if (success) {
            showToast('실적이 수정되었습니다.', 'success');

            // 비활성화 모드로 전환
            dateInput.disabled = true;
            methodSelect.disabled = true;
            contentTextarea.disabled = true;
            commentTextarea.disabled = true;

            dateInput.classList.add('bg-gray-100');
            methodSelect.classList.add('bg-gray-100');
            contentTextarea.classList.add('bg-gray-100');
            commentTextarea.classList.add('bg-gray-100');

            dateInput.classList.remove('bg-white');
            methodSelect.classList.remove('bg-white');
            contentTextarea.classList.remove('bg-white');
            commentTextarea.classList.remove('bg-white');

            // 버튼 원래대로
            buttonsDiv.innerHTML = `
                <button onclick="toggleEditProfessorExecution(${weekNumber}, ${executionId})"
                        class="text-xs text-[#6A0028] hover:text-[#8A0034] font-medium">
                    수정
                </button>
                <button onclick="deleteProfessorExecution(${weekNumber}, ${executionId})"
                        class="text-xs text-red-600 hover:text-red-800 font-medium">
                    삭제
                </button>
            `;
        } else {
            showToast('실적 수정에 실패했습니다.', 'error');
        }
    } else {
        // 읽기 모드 → 편집 모드로 전환
        // 원본 데이터 백업
        dateInput.dataset.original = dateInput.value;
        methodSelect.dataset.original = methodSelect.value;
        contentTextarea.dataset.original = contentTextarea.value;
        commentTextarea.dataset.original = commentTextarea.value;

        // 활성화
        dateInput.disabled = false;
        methodSelect.disabled = false;
        contentTextarea.disabled = false;
        commentTextarea.disabled = false;

        dateInput.classList.remove('bg-gray-100');
        methodSelect.classList.remove('bg-gray-100');
        contentTextarea.classList.remove('bg-gray-100');
        commentTextarea.classList.remove('bg-gray-100');

        dateInput.classList.add('bg-white');
        methodSelect.classList.add('bg-white');
        contentTextarea.classList.add('bg-white');
        commentTextarea.classList.add('bg-white');

        // 버튼 변경: 수정 → 저장, 삭제 → 취소
        buttonsDiv.innerHTML = `
            <button onclick="toggleEditProfessorExecution(${weekNumber}, ${executionId})"
                    class="text-xs text-blue-600 hover:text-blue-800 font-medium">
                저장
            </button>
            <button onclick="cancelEditProfessorExecution(${weekNumber}, ${executionId})"
                    class="text-xs text-gray-600 hover:text-gray-800 font-medium">
                취소
            </button>
        `;

        // 포커스
        contentTextarea.focus();
    }
}

// ✨ 실적 수정 취소
function cancelEditProfessorExecution(weekNumber, executionId) {
    const dateInput = document.getElementById(`exec-date-${executionId}`);
    const methodSelect = document.getElementById(`exec-method-${executionId}`);
    const contentTextarea = document.getElementById(`exec-content-edit-${executionId}`);
    const commentTextarea = document.getElementById(`exec-comment-edit-${executionId}`);
    const buttonsDiv = document.getElementById(`buttons-${executionId}`);

    // 원본 데이터 복원
    dateInput.value = dateInput.dataset.original;
    methodSelect.value = methodSelect.dataset.original;
    contentTextarea.value = contentTextarea.dataset.original;
    commentTextarea.value = commentTextarea.dataset.original;

    // 비활성화
    dateInput.disabled = true;
    methodSelect.disabled = true;
    contentTextarea.disabled = true;
    commentTextarea.disabled = true;

    dateInput.classList.add('bg-gray-100');
    methodSelect.classList.add('bg-gray-100');
    contentTextarea.classList.add('bg-gray-100');
    commentTextarea.classList.add('bg-gray-100');

    dateInput.classList.remove('bg-white');
    methodSelect.classList.remove('bg-white');
    contentTextarea.classList.remove('bg-white');
    commentTextarea.classList.remove('bg-white');

    // 버튼 원래대로
    buttonsDiv.innerHTML = `
        <button onclick="toggleEditProfessorExecution(${weekNumber}, ${executionId})"
                class="text-xs text-[#6A0028] hover:text-[#8A0034] font-medium">
            수정
        </button>
        <button onclick="deleteProfessorExecution(${weekNumber}, ${executionId})"
                class="text-xs text-red-600 hover:text-red-800 font-medium">
            삭제
        </button>
    `;
}

// ✨ 실적 삭제
function deleteProfessorExecution(weekNumber, executionId) {
    if (!confirm(`${weekNumber}주차 실적을 삭제하시겠습니까?`)) return;

    const success = DataService.deleteSemesterExecution(currentStudentId, currentYear, currentSemester, executionId);

    if (success) {
        showToast(`${weekNumber}주차 실적이 삭제되었습니다.`, 'success');

        setTimeout(() => {
            showProfessorStudentDetail(currentStudentId);
        }, 100);
    } else {
        showToast('실적 삭제에 실패했습니다.', 'error');
    }
}

// 학기 변경 함수
function changeProfessorSemesterView() {
    const year = document.getElementById('prof-select-year')?.value;
    const semester = document.getElementById('prof-select-semester')?.value;

    if (!year || !semester) return;

    currentYear = parseInt(year);
    currentSemester = parseInt(semester);

    console.log(`학기 변경: ${currentYear}학년도 ${currentSemester}학기`);

    if (currentStudentId) {
        showProfessorStudentDetail(currentStudentId);
    }
}

// 총 주차 초기화/생성 함수 (관리자용과 동일)
function resetProfessorTotalWeeks() {
    const semesterPlan = DataService.getSemesterPlan(currentStudentId, currentYear, currentSemester);
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

    openModal(modalTitle, modalContent, hasPlans ? '초기화 실행' : '생성', () => executeProfessorResetWeeks(), true);
}

// 계획 초기화/생성 실행 (관리자용과 동일)
function executeProfessorResetWeeks() {
    console.log('🟡 executeProfessorResetWeeks 시작');

    const form = document.getElementById('reset-weeks-form');
    console.log('폼 요소:', form);

    const formData = new FormData(form);
    const newTotalWeeks = parseInt(formData.get('newTotalWeeks'));
    console.log('선택된 주차:', newTotalWeeks);

    if (!newTotalWeeks || newTotalWeeks < 1 || newTotalWeeks > 15) {
        console.log('❌ 유효성 검사 실패');
        showToast('올바른 주차 수를 선택해주세요 (1~15주)', 'warning');
        return;
    }

    const semesterPlan = DataService.getSemesterPlan(currentStudentId, currentYear, currentSemester);
    const currentWeeks = semesterPlan?.totalWeeks || 0;
    const plans = semesterPlan?.plans || [];
    const hasPlans = currentWeeks > 0;

    console.log('계획 상태:', { currentWeeks, plansCount: plans.length, hasPlans });

    // 최종 확인 (모든 데이터 삭제 경고)
    if (hasPlans && plans.length > 0) {
        const confirmed = confirm(`⚠️ 계획 초기화 확인\n\n현재 입력된 모든 계획 및 실적 ${plans.length}건이 삭제됩니다.\n새로운 ${newTotalWeeks}주 구조로 초기화됩니다.\n\n이 작업은 되돌릴 수 없습니다.\n정말 초기화하시겠습니까?`);
        console.log('사용자 확인:', confirmed);
        if (!confirmed) {
            return;
        }
    }

    // DataService를 통해 초기화
    console.log('📝 데이터 초기화 시작');
    DataService.resetSemesterPlan(currentStudentId, currentYear, currentSemester, newTotalWeeks);

    const message = hasPlans
        ? `지도 계획이 ${newTotalWeeks}주로 초기화되었습니다.\n모든 계획 및 실적이 삭제되었습니다.`
        : `지도 계획이 ${newTotalWeeks}주로 생성되었습니다.`;

    console.log('토스트 메시지 표시:', message);
    showToast(message, 'success');

    console.log('⏰ closeModal 호출 시작');
    window.closeModal();
    console.log('⏰ closeModal 호출 완료');

    setTimeout(() => {
        console.log('🔄 화면 갱신 시작');
        showProfessorStudentDetail(currentStudentId);
    }, 100);
}

// 주차 카드로 스크롤 이동
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
        }, 1500);
    }
}

// Helper 함수들
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

function searchProfessorStudents() {
    showToast('검색 기능은 실제 구현 시 추가됩니다', 'info');
}

// 전역으로 export
window.initProfessorWeeklyGuidance = initProfessorWeeklyGuidance;
window.showProfessorStudentList = showProfessorStudentList;
window.showProfessorStudentDetail = showProfessorStudentDetail;
window.addProfessorExecution = addProfessorExecution;
window.toggleEditProfessorExecution = toggleEditProfessorExecution;
window.cancelEditProfessorExecution = cancelEditProfessorExecution;
window.deleteProfessorExecution = deleteProfessorExecution;
window.changeProfessorSemesterView = changeProfessorSemesterView;
window.resetProfessorTotalWeeks = resetProfessorTotalWeeks;
window.executeProfessorResetWeeks = executeProfessorResetWeeks;
window.scrollToWeek = scrollToWeek;
window.searchProfessorStudents = searchProfessorStudents;

console.log('✅ 교수용 주차별 지도 관리 모듈 로드 완료 (관리자 UI 기반 + 실적 입력 기능)');
