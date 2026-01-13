// ===================================
// 관리자용 학기별 지도 계획 (교수용 화면과 동일한 모달 구조)
// Version: 20260113004
//
// 변경사항 (v20260113004):
// - UI를 교수용 화면과 완전히 동기화
// - 버튼 스타일, 레이아웃, 테이블 컬럼 사이즈 통일
// - 계획 초기화 버튼 색상 변경 (bg-gray-600)
// - 버튼 패딩 통일 (px-5 py-2)
//
// 변경사항 (v20260113003):
// - DataService 함수 확장 추가 (getSemesterPlan, getAllSemesterPlans, saveSemesterPlan 등)
//
// 변경사항 (v20260113002):
// - 교수용 화면과 완전히 동일한 모달 팝업 구조로 변경
// - 승인 전: 계획 내용 입력 가능
// - 승인 후: 계획 내용 readonly
// - 실적: 항상 readonly (관리자는 실적 추가/수정/삭제 불가)
// - 승인 취소 기능 없음
// ===================================

let currentAdminView = 'list';  // 'list' or 'detail'
let currentAdminPairId = null;
let currentAdminStudentId = null;
let currentAdminSemesterView = { year: new Date().getFullYear(), semester: 1 };
let adminAvailableSemesters = [];

// 학기별 계획 데이터 저장소 (관리자용)
const adminSemesterPlansStorage = {};

// DataService 확장 - 학기별 계획 관리 함수 (관리자용)
if (typeof DataService === 'undefined') {
    window.DataService = {};
}

// 학기별 계획 조회
if (!DataService.getSemesterPlan) {
    DataService.getSemesterPlan = function(studentId, year, semester) {
        const key = `${studentId}_${year}_${semester}`;
        return adminSemesterPlansStorage[key] || null;
    };
}

// 학생의 모든 학기 계획 조회
if (!DataService.getAllSemesterPlans) {
    DataService.getAllSemesterPlans = function(studentId) {
        const plans = [];
        for (const key in adminSemesterPlansStorage) {
            if (key.startsWith(`${studentId}_`)) {
                plans.push(adminSemesterPlansStorage[key]);
            }
        }
        return plans;
    };
}

// 학기별 계획 저장/업데이트
if (!DataService.saveSemesterPlan) {
    DataService.saveSemesterPlan = function(studentId, year, semester, totalWeeks, weeks) {
        const key = `${studentId}_${year}_${semester}`;
        adminSemesterPlansStorage[key] = {
            studentId,
            year,
            semester,
            totalWeeks,
            weeks,
            approved: adminSemesterPlansStorage[key]?.approved || false
        };
        console.log(`✅ 관리자: 학기 계획 저장: ${key}`, adminSemesterPlansStorage[key]);
        return adminSemesterPlansStorage[key];
    };
}

// 학기별 계획 초기화/생성
if (!DataService.resetSemesterPlan) {
    DataService.resetSemesterPlan = function(studentId, year, semester, totalWeeks) {
        const key = `${studentId}_${year}_${semester}`;

        // totalWeeks가 0이면 계획 삭제
        if (totalWeeks === 0) {
            delete adminSemesterPlansStorage[key];
            console.log(`✅ 관리자: 학기 계획 삭제: ${key}`);
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

        adminSemesterPlansStorage[key] = {
            studentId,
            year,
            semester,
            totalWeeks,
            weeks,
            approved: false
        };
        console.log(`✅ 관리자: 학기 계획 생성/초기화: ${key}, ${totalWeeks}주`);
        return adminSemesterPlansStorage[key];
    };
}

// 학기별 계획 삭제
if (!DataService.deleteSemesterPlan) {
    DataService.deleteSemesterPlan = function(studentId, year, semester) {
        const key = `${studentId}_${year}_${semester}`;
        delete adminSemesterPlansStorage[key];
        console.log(`✅ 관리자: 학기 계획 삭제: ${key}`);
    };
}

// 학생 지도교수 조회
if (!DataService.getStudentAdvisors) {
    DataService.getStudentAdvisors = function(studentId) {
        const pair = appData.weeklyGuidance.guidancePairs.find(p => p.student.studentId === studentId);
        return pair?.student.advisors || [];
    };
}

// ==================== 목록 화면 ====================
function initWeeklyGuidance() {
    console.log('관리자용 주차별 지도 관리 초기화');
    showGuidancePairsList();
}

function showGuidancePairsList() {
    currentAdminView = 'list';
    currentAdminPairId = null;

    const data = appData.weeklyGuidance;
    const contentArea = document.getElementById('weekly-guidance-content');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 검색 영역 -->
            <div class="p-6 border-b">
                <div class="grid grid-cols-5 gap-3">
                    <!-- 1행: 5개 필드 -->
                    <!-- 1. 학년도/학기 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
                        <div class="flex gap-2 flex-1">
                            <select id="yearFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="2025" selected>2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <select id="semesterFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="1" selected>1학기</option>
                                <option value="2">2학기</option>
                            </select>
                        </div>
                    </div>
                    <!-- 2. 대학구분 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                        <select id="graduateFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="일반대학원">일반대학원</option>
                            <option value="특수대학원">특수대학원</option>
                        </select>
                    </div>
                    <!-- 3. 계열/대학원 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                        <select id="collegeFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="일반대학원">일반대학원</option>
                            <option value="경영대학원">경영대학원</option>
                            <option value="정보대학원">정보대학원</option>
                        </select>
                    </div>
                    <!-- 4. 학부(과)전공 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                        <input type="text" id="undergraduateFilter" placeholder="학부(과)전공"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>
                    <!-- 5. 학과/전공 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                        <input type="text" id="majorFilter" placeholder="학과/전공"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>

                    <!-- 2행: 5개 필드 -->
                    <!-- 6. 학위과정 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                        <select id="degreeFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="석사">석사</option>
                            <option value="박사">박사</option>
                            <option value="석박통합">석박통합</option>
                        </select>
                    </div>
                    <!-- 7. 학적상태 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                        <select id="statusFilter" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="재학">재학</option>
                            <option value="휴학">휴학</option>
                            <option value="졸업">졸업</option>
                            <option value="수료">수료</option>
                        </select>
                    </div>
                    <!-- 8. 학번 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                        <input type="text" id="studentIdFilter" placeholder="학번"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>
                    <!-- 9. 성명 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                        <input type="text" id="studentNameFilter" placeholder="성명"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>
                    <!-- 10. 지도교수명 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                        <input type="text" id="professorFilter" placeholder="지도교수명"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>
                </div>

                <!-- 버튼 영역 -->
                <div class="flex justify-end mt-4">
                    <button onclick="filterGuidancePairs()"
                            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                        <i class="fas fa-search mr-1"></i>조회
                    </button>
                </div>
            </div>

            <!-- 목록 (admin-v3 table-container 구조) -->
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">학기별 지도 계획 목록</h3>
                        <span class="table-count">(총 ${data.guidancePairs.length}건)</span>
                    </div>
                    <div class="table-header-right">
                        <button onclick="sendNotificationToSelectedPairs()"
                                class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-4 py-2 rounded text-sm font-medium">
                            선택 학생에게 알림 발송
                        </button>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th style="width: 50px;" class="text-center">
                                    <input type="checkbox" id="select-all-pairs"
                                           onchange="toggleSelectAllPairs(this.checked)"
                                           class="rounded border-gray-300">
                                </th>
                                <th style="width: 60px;">순번</th>
                                <th style="width: 80px;">학년도</th>
                                <th style="width: 60px;">학기</th>
                                <th style="width: 100px;">대학구분</th>
                                <th style="width: 100px;">계열/대학원</th>
                                <th style="width: 120px;">학부(과)전공</th>
                                <th style="width: 150px;">학과/전공</th>
                                <th style="width: 80px;">학위과정</th>
                                <th style="width: 80px;">학적상태</th>
                                <th style="width: 90px;">학번</th>
                                <th style="width: 80px;">성명</th>
                                <th style="width: 100px;">지도교수</th>
                                <th style="width: 100px;">부지도교수</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.guidancePairs.map((pair, index) => {
                                // 지도교수와 부지도교수 분리
                                const primaryAdvisor = pair.student.advisors?.find(a => a.role === 'primary');
                                const subAdvisor = pair.student.advisors?.find(a => a.role === 'sub');

                                return `
                                <tr onclick="showAdminGuidanceDetail('${pair.student.studentId}')">
                                    <td class="text-center" onclick="event.stopPropagation()">
                                        <input type="checkbox" class="pair-checkbox rounded border-gray-300"
                                               value="${pair.student.studentId}" data-name="${pair.student.name}">
                                    </td>
                                    <td>${index + 1}</td>
                                    <td>2025</td>
                                    <td>1학기</td>
                                    <td>일반대학원</td>
                                    <td>일반대학원</td>
                                    <td>${pair.student.major || '-'}</td>
                                    <td>${pair.student.major || '-'}</td>
                                    <td>${getAdminDegreeText(pair.student.degree)}</td>
                                    <td>재학</td>
                                    <td>${pair.student.studentId}</td>
                                    <td class="font-medium">${pair.student.name}</td>
                                    <td>${primaryAdvisor ? primaryAdvisor.name : (pair.professor?.name || '-')}</td>
                                    <td>${subAdvisor ? subAdvisor.name : '-'}</td>
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

// ==================== 관리자용 상세 화면 (모달 팝업 - 교수용과 동일 구조) ====================
function showAdminGuidanceDetail(studentId) {
    console.log('🔵 showAdminGuidanceDetail 호출:', studentId);

    // 이미 모달이 열려있으면 무시
    const existingModal = document.getElementById('admin-guidance-modal');
    if (existingModal) {
        console.warn('관리자 학기별 지도 계획 모달이 이미 열려 있습니다.');
        return;
    }

    currentAdminStudentId = studentId;
    console.log('📝 currentAdminStudentId 설정:', currentAdminStudentId);

    // appData.weeklyGuidance.guidancePairs에서 학생 정보 가져오기
    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.student.studentId === studentId);
    const student = pair ? pair.student : null;
    console.log('👤 학생 정보:', student);

    if (!student) {
        console.error('❌ 학생 정보를 찾을 수 없습니다:', studentId);
        if (typeof showToast === 'function') {
            showToast('학생 정보를 찾을 수 없습니다.', 'error');
        } else {
            alert('학생 정보를 찾을 수 없습니다.');
        }
        return;
    }

    // 학생의 모든 학기 계획 조회
    const allPlans = DataService.getAllSemesterPlans(studentId);

    // 사용 가능한 학기 목록 생성 (최근 5년)
    adminAvailableSemesters = generateAdminAvailableSemesters(allPlans);

    // 현재 선택된 학기 (기본값: 가장 최근 학기 또는 현재 학기)
    if (allPlans.length > 0) {
        const latestPlan = allPlans.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.semester - a.semester;
        })[0];
        currentAdminSemesterView = { year: latestPlan.year, semester: latestPlan.semester };
    } else {
        // 계획이 없으면 현재 학기로 설정
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentSemester = (currentMonth >= 3 && currentMonth <= 8) ? 1 : 2;
        currentAdminSemesterView = { year: currentYear, semester: currentSemester };
    }

    // 모달 생성 및 표시
    const modal = createAdminGuidanceModal(student, allPlans);
    document.body.appendChild(modal);

    // 백드롭 클릭으로 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAdminGuidanceModal();
        }
    });

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeAdminGuidanceModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ==================== 사용 가능한 학기 목록 생성 ====================
function generateAdminAvailableSemesters(allPlans) {
    const currentYear = new Date().getFullYear();
    const semesters = [];

    for (let y = currentYear; y >= currentYear - 4; y--) {
        for (let s = 1; s <= 2; s++) {
            const hasPlan = allPlans.some(p => p.year === y && p.semester === s);
            semesters.push({
                year: y,
                semester: s,
                hasPlan: hasPlan
            });
        }
    }

    return semesters;
}

// ==================== 모달 생성 ====================
function createAdminGuidanceModal(student, allPlans) {
    const modal = document.createElement('div');
    modal.id = 'admin-guidance-modal';
    modal.className = 'feedback-detail-screen'; // 기존 모달과 동일한 스타일 사용
    modal.style.zIndex = '500';

    const currentPlan = allPlans.find(p =>
        p.year === currentAdminSemesterView.year && p.semester === currentAdminSemesterView.semester
    );

    // 학기 계획 데이터 가져오기
    const semesterPlan = DataService.getSemesterPlan(
        currentAdminStudentId,
        currentAdminSemesterView.year,
        currentAdminSemesterView.semester
    );
    const totalWeeks = semesterPlan?.totalWeeks || 0;

    // 계획이 없으면 생성 폼 표시
    if (totalWeeks === 0) {
        modal.innerHTML = renderAdminPlanCreationForm(student);
    } else {
        modal.innerHTML = renderAdminSemesterDetailContent(student, allPlans, currentPlan, totalWeeks);
    }

    return modal;
}

// ==================== 모달 닫기 ====================
function closeAdminGuidanceModal() {
    const modal = document.getElementById('admin-guidance-modal');
    if (modal) {
        modal.remove();
    }

    // 전역 변수 정리
    currentAdminStudentId = null;
}

// ==================== 계획 생성 폼 렌더링 (교수용과 동일) ====================
function renderAdminPlanCreationForm(student) {
    const advisors = DataService.getStudentAdvisors(currentAdminStudentId);

    return `
        <div class="feedback-detail-content" style="max-width: 1400px;">
            <!-- 헤더 -->
            <div class="px-6 py-3 border-b bg-white">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-800">학기별 지도 계획 (관리자)</h3>
                    <button onclick="closeAdminGuidanceModal()"
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
                        <span class="text-gray-900 font-medium">${getAdminDegreeText(student.degree)}</span>
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
                        <select id="admin-select-year-creation" onchange="changeAdminSemesterViewInModal()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${Array.from(new Set(adminAvailableSemesters.map(s => s.year)))
                                .map(y => `<option value="${y}" ${y === currentAdminSemesterView.year ? 'selected' : ''}>${y}학년도</option>`)
                                .join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학기:</label>
                        <select id="admin-select-semester-creation" onchange="changeAdminSemesterViewInModal()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${adminAvailableSemesters
                                .filter(s => s.year === currentAdminSemesterView.year)
                                .map(s => `<option value="${s.semester}" ${s.semester === currentAdminSemesterView.semester ? 'selected' : ''}>${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
                                .join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2 ml-auto">
                        <label class="text-sm text-gray-700 font-medium">주차 수:</label>
                        <select id="admin-week-count-select"
                                class="border border-gray-300 rounded px-4 py-2 text-sm bg-white">
                            ${Array.from({length: 20}, (_, i) => i + 1).map(week =>
                                `<option value="${week}" ${week === 15 ? 'selected' : ''}>${week}주</option>`
                            ).join('')}
                        </select>
                        <button onclick="executeAdminCreatePlan()"
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

// ==================== 계획 생성 실행 (관리자용) ====================
function executeAdminCreatePlan() {
    const weekCountSelect = document.getElementById('admin-week-count-select');
    const totalWeeks = parseInt(weekCountSelect.value);

    if (!totalWeeks || totalWeeks < 1 || totalWeeks > 20) {
        alert('유효한 주차 수를 선택하세요 (1-20주)');
        return;
    }

    console.log(`관리자: ${totalWeeks}주 계획 생성 시작`);

    // DataService를 통해 계획 생성
    DataService.saveSemesterPlan(
        currentAdminStudentId,
        currentAdminSemesterView.year,
        currentAdminSemesterView.semester,
        totalWeeks,
        [] // 빈 weeks 배열
    );

    // 모달 새로고침
    refreshAdminModalContent();
}

// ==================== 상세 내용 렌더링 (관리자용 - 교수용과 유사하지만 실적 입력 불가) ====================
function renderAdminSemesterDetailContent(student, allPlans, currentPlan, totalWeeks) {
    const advisors = DataService.getStudentAdvisors(currentAdminStudentId);
    const isApproved = currentPlan && currentPlan.approved === true;

    // 주차 데이터 생성
    const weeks = generateAdminWeeks(currentPlan?.weeks || [], totalWeeks);

    return `
        <div class="feedback-detail-content" style="max-width: 1400px;">
            <!-- 헤더 -->
            <div class="px-6 py-3 border-b bg-white">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-800">학기별 지도 계획 (관리자)</h3>
                    <button onclick="closeAdminGuidanceModal()"
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
                        <span class="text-gray-900 font-medium">${getAdminDegreeText(student.degree)}</span>
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

            <!-- 학기 선택 및 버튼 (교수용과 완전히 동일한 레이아웃) -->
            <div class="px-6 py-3 bg-white border-b">
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학년도:</label>
                        <select id="admin-select-year" onchange="changeAdminSemesterViewInModal()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${Array.from(new Set(adminAvailableSemesters.map(s => s.year)))
                                .map(y => `<option value="${y}" ${y === currentAdminSemesterView.year ? 'selected' : ''}>${y}학년도</option>`)
                                .join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600 min-w-[60px]">학기:</label>
                        <select id="admin-select-semester" onchange="changeAdminSemesterViewInModal()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            ${adminAvailableSemesters
                                .filter(s => s.year === currentAdminSemesterView.year)
                                .map(s => `<option value="${s.semester}" ${s.semester === currentAdminSemesterView.semester ? 'selected' : ''}>${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
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
                    <div class="flex items-center gap-3 ml-auto">
                        ${!isApproved ? `
                            <!-- 미승인 상태: 저장, 초기화 가능 (관리자는 승인 권한 없음) -->
                            <button onclick="saveAllAdminWeekPlans()"
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium">
                                전체 저장
                            </button>
                            <button onclick="event.stopPropagation(); resetAdminTotalWeeksInModal();"
                                    class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium">
                                계획 초기화
                            </button>
                        ` : `
                            <!-- 승인된 상태: 초기화 버튼 비활성화 -->
                            <button onclick="alertAdminApprovedPlanEdit()"
                                    class="bg-gray-400 cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium"
                                    disabled>
                                계획 초기화
                            </button>
                        `}
                    </div>
                </div>
            </div>

            <!-- 주차별 테이블 (스크롤 가능, 교수용과 동일) -->
            <div class="p-6" style="max-height: calc(100vh - 280px); overflow-y: auto;">
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
                        ${weeks.map(week => renderAdminWeekRow(week, isApproved)).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ==================== 주차 데이터 생성 ====================
function generateAdminWeeks(plans, totalWeeks) {
    const weeks = [];
    for (let i = 1; i <= totalWeeks; i++) {
        weeks.push({
            week: i,
            plannedContent: plans[i - 1]?.plannedContent || '',
            executions: plans[i - 1]?.executions || []
        });
    }
    return weeks;
}

// ==================== 주차 행 렌더링 ====================
function renderAdminWeekRow(week, isApproved) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const rowCount = hasExecutions ? week.executions.length : 1;
    const readonlyAttr = isApproved ? 'readonly' : '';
    const bgClass = isApproved ? 'bg-gray-100' : 'bg-white';
    const clickEvent = isApproved ? 'onclick="alertAdminApprovedPlanEdit()"' : '';

    // 첫 번째 행
    let firstRow = `
        <tr id="admin-week-row-${week.week}">
            <td class="border border-gray-300 px-2 py-2 text-center font-semibold" rowspan="${rowCount}">${week.week}주</td>
            <td class="border border-gray-300 px-2 py-2" rowspan="${rowCount}">
                <textarea id="admin-plan-content-${week.week}"
                          placeholder="계획 내용 입력"
                          ${readonlyAttr}
                          ${clickEvent}
                          class="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none focus:outline-none auto-expand-textarea ${bgClass}"
                          style="min-height: 40px; overflow-y: hidden; ${isApproved ? 'cursor: not-allowed;' : ''}">${week.plannedContent || ''}</textarea>
            </td>`;

    if (hasExecutions) {
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
        firstRow += `
            <td class="border border-gray-300 px-2 py-2 text-center text-gray-500" colspan="2">실적 없음</td>
        `;
    }
    firstRow += `</tr>`;

    // 추가 실적 행들
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

// ==================== 학기 전환 ====================
function changeAdminSemesterViewInModal() {
    const yearSelect = document.getElementById('admin-select-year') || document.getElementById('admin-select-year-creation');
    const semesterSelect = document.getElementById('admin-select-semester') || document.getElementById('admin-select-semester-creation');

    if (!yearSelect || !semesterSelect) {
        console.error('학년도/학기 select 요소를 찾을 수 없습니다');
        return;
    }

    const year = parseInt(yearSelect.value);
    const previousYear = currentAdminSemesterView.year;

    // 학년도가 변경된 경우, 해당 학년도의 학기 옵션으로 업데이트
    if (year !== previousYear) {
        const semesterOptions = adminAvailableSemesters
            .filter(s => s.year === year)
            .map(s => `<option value="${s.semester}">${s.semester}학기${s.hasPlan ? ' ✓' : ''}</option>`)
            .join('');

        semesterSelect.innerHTML = semesterOptions;
        semesterSelect.value = '1';
    }

    const semester = parseInt(semesterSelect.value);

    if (!year || !semester) {
        console.error('유효하지 않은 학년도 또는 학기:', { year, semester });
        return;
    }

    currentAdminSemesterView = { year, semester };
    console.log('학기 전환:', currentAdminSemesterView);

    // 모달 내용 새로고침
    refreshAdminModalContent();
}

// ==================== 모달 내용 새로고침 ====================
function refreshAdminModalContent() {
    const modal = document.getElementById('admin-guidance-modal');
    if (!modal) return;

    // appData.weeklyGuidance.guidancePairs에서 학생 정보 가져오기
    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.student.studentId === currentAdminStudentId);
    const student = pair ? pair.student : null;
    if (!student) return;

    const allPlans = DataService.getAllSemesterPlans(currentAdminStudentId);

    // 사용 가능한 학기 목록 재생성
    adminAvailableSemesters = generateAdminAvailableSemesters(allPlans);

    const currentPlan = allPlans.find(p =>
        p.year === currentAdminSemesterView.year && p.semester === currentAdminSemesterView.semester
    );

    const semesterPlan = DataService.getSemesterPlan(
        currentAdminStudentId,
        currentAdminSemesterView.year,
        currentAdminSemesterView.semester
    );
    const totalWeeks = semesterPlan?.totalWeeks || 0;

    // 모달 내용 교체
    if (totalWeeks === 0) {
        modal.innerHTML = renderAdminPlanCreationForm(student);
    } else {
        modal.innerHTML = renderAdminSemesterDetailContent(student, allPlans, currentPlan, totalWeeks);
    }
}

// ==================== 전체 주차 저장 (관리자용) ====================
function saveAllAdminWeekPlans() {
    console.log('관리자: 전체 주차 계획 저장 시작');

    const semesterPlan = DataService.getSemesterPlan(
        currentAdminStudentId,
        currentAdminSemesterView.year,
        currentAdminSemesterView.semester
    );

    if (!semesterPlan || !semesterPlan.weeks) {
        alert('저장할 계획이 없습니다.');
        return;
    }

    // 각 주차의 계획 내용 수집
    semesterPlan.weeks.forEach(week => {
        const contentTextarea = document.getElementById(`admin-plan-content-${week.week}`);
        if (contentTextarea) {
            week.plannedContent = contentTextarea.value.trim();
        }
    });

    // DataService에 저장
    DataService.saveSemesterPlan(
        currentAdminStudentId,
        currentAdminSemesterView.year,
        currentAdminSemesterView.semester,
        semesterPlan.totalWeeks,
        semesterPlan.weeks
    );

    if (typeof showToast === 'function') {
        showToast('계획이 저장되었습니다.', 'success');
    } else {
        alert('계획이 저장되었습니다.');
    }

    console.log('관리자: 전체 주차 계획 저장 완료');
}

// ==================== 계획 초기화 (관리자용) ====================
function resetAdminTotalWeeksInModal() {
    const semesterPlan = DataService.getSemesterPlan(
        currentAdminStudentId,
        currentAdminSemesterView.year,
        currentAdminSemesterView.semester
    );

    const currentWeeks = semesterPlan?.totalWeeks || 0;

    if (!confirm(`⚠️ 계획 초기화 확인\n\n현재 ${currentWeeks}주차 계획이 모두 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.\n\n정말 초기화하시겠습니까?`)) {
        return;
    }

    // 계획 삭제
    DataService.deleteSemesterPlan(
        currentAdminStudentId,
        currentAdminSemesterView.year,
        currentAdminSemesterView.semester
    );

    if (typeof showToast === 'function') {
        showToast('계획이 초기화되었습니다.', 'success');
    } else {
        alert('계획이 초기화되었습니다.');
    }

    // 모달 새로고침
    refreshAdminModalContent();
}

// ==================== 승인된 계획 수정 시도 시 경고 ====================
function alertAdminApprovedPlanEdit() {
    alert('⚠️ 교수님이 승인한 계획은 수정할 수 없습니다.\n\n계획 수정이 필요한 경우 담당 교수님께 문의하세요.');
}

// ==================== Helper 함수들 ====================
function getDegreeText(degree) {
    const degreeMap = {
        'master': '석사',
        'doctor': '박사',
        'integrated': '석박통합'
    };
    return degreeMap[degree] || degree;
}

function getAdminDegreeText(degree) {
    const degreeMap = {
        'master': '석사',
        'doctor': '박사',
        '석사': '석사',
        '박사': '박사'
    };
    return degreeMap[degree] || degree || '석사';
}

function filterGuidancePairs() {
    if (typeof showAlert === 'function') {
        showAlert('필터 기능은 추후 구현 예정입니다.');
    } else {
        alert('필터 기능은 추후 구현 예정입니다.');
    }
}

// 체크박스 전체 선택/해제
function toggleSelectAllPairs(checked) {
    const checkboxes = document.querySelectorAll('.pair-checkbox');
    checkboxes.forEach(cb => cb.checked = checked);
}

// 선택한 학생에게 알림 발송
function sendNotificationToSelectedPairs() {
    const checkboxes = document.querySelectorAll('.pair-checkbox:checked');

    if (checkboxes.length === 0) {
        if (typeof showAlert === 'function') {
            showAlert('알림을 발송할 학생을 선택해주세요.');
        } else {
            alert('알림을 발송할 학생을 선택해주세요.');
        }
        return;
    }

    const students = Array.from(checkboxes).map(cb => ({
        studentId: cb.value,
        name: cb.getAttribute('data-name')
    }));

    const studentNames = students.map(s => s.name).join(', ');

    if (confirm(`${students.length}명의 학생에게 알림을 발송하시겠습니까?\n\n학생: ${studentNames}`)) {
        console.log('알림 발송 대상:', students);
        if (typeof showAlert === 'function') {
            showAlert(`${students.length}명의 학생에게 알림이 발송되었습니다.`);
        } else {
            alert(`${students.length}명의 학생에게 알림이 발송되었습니다.`);
        }

        // 체크박스 초기화
        checkboxes.forEach(cb => cb.checked = false);
        const selectAll = document.getElementById('select-all-pairs');
        if (selectAll) selectAll.checked = false;
    }
}

// 전역으로 export
window.initWeeklyGuidance = initWeeklyGuidance;
window.showGuidancePairsList = showGuidancePairsList;
window.showAdminGuidanceDetail = showAdminGuidanceDetail;
window.closeAdminGuidanceModal = closeAdminGuidanceModal;
window.executeAdminCreatePlan = executeAdminCreatePlan;
window.changeAdminSemesterViewInModal = changeAdminSemesterViewInModal;
window.refreshAdminModalContent = refreshAdminModalContent;
window.saveAllAdminWeekPlans = saveAllAdminWeekPlans;
window.resetAdminTotalWeeksInModal = resetAdminTotalWeeksInModal;
window.alertAdminApprovedPlanEdit = alertAdminApprovedPlanEdit;
window.filterGuidancePairs = filterGuidancePairs;
window.toggleSelectAllPairs = toggleSelectAllPairs;
window.sendNotificationToSelectedPairs = sendNotificationToSelectedPairs;

console.log('✅ 관리자용 학기별 지도 계획 모듈 로드 완료 (모달 팝업 방식)');
