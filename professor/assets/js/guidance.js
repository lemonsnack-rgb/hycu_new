// ===================================
// 지도학생관리 화면 (카드 레이아웃)
// 관리자 화면 UI/UX 통일
// ===================================

let currentView = 'list';  // 'list' or 'detail'
let currentStudentId = null;
let showOnlyMyGuidance = false;

// 지도학생관리 초기화
function initGuidance() {
    console.log('지도학생관리 초기화 (카드 레이아웃 버전)');
    showStudentList();
}

// 학생 목록 화면
function showStudentList() {
    currentView = 'list';
    currentStudentId = null;
    
    const students = DataService.getMyStudents();
    const currentProf = DataService.getCurrentProfessor();
    
    const contentArea = document.getElementById('guidance-content-area');
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-gray-800">내 지도학생 목록</h3>
                    <div class="flex items-center gap-3">
                        <button onclick="sendNotificationToSelected()"
                                class="bg-[#6A0028] hover:bg-[#5A0020] text-white px-4 py-2 rounded text-sm font-medium">
                            선택 학생에게 알림 발송
                        </button>
                        <div class="text-sm text-gray-600">
                            총 <span class="font-semibold text-blue-600">${students.length}명</span>
                        </div>
                    </div>
                </div>

                <!-- 검색 영역 -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select id="filter-degree" class="border border-gray-300 rounded px-3 py-2 text-sm">
                            <option value="">학위과정 전체</option>
                            <option value="석사">석사</option>
                            <option value="박사">박사</option>
                        </select>
                        <select id="filter-stage" class="border border-gray-300 rounded px-3 py-2 text-sm">
                            <option value="">단계 전체</option>
                            <option value="research_proposal">연구계획서</option>
                            <option value="thesis_plan">논문작성계획서</option>
                            <option value="mid_thesis">중간논문</option>
                            <option value="final_thesis">최종논문</option>
                        </select>
                        <input type="text"
                               id="filter-keyword"
                               placeholder="학번/성명 검색"
                               class="border border-gray-300 rounded px-3 py-2 text-sm">
                        <div class="flex gap-2">
                            <button onclick="searchStudents()"
                                    class="flex-1 bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#5A0020]">
                                검색
                            </button>
                            <button onclick="resetStudentSearch()"
                                    class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                                초기화
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">
                                <input type="checkbox" id="select-all-students"
                                       onchange="toggleSelectAllStudents(this.checked)"
                                       class="rounded border-gray-300">
                            </th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학생명</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">과정</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">내 지도횟수</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">전체 지도횟수</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">최근지도일</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${students.map((student, idx) => {
                            const myRole = student.advisors.find(a => a.id === currentProf.id)?.role;
                            const myStats = student.guidanceStats[currentProf.id] || { count: 0, lastDate: '-' };

                            return `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-center">
                                        <input type="checkbox" class="student-checkbox rounded border-gray-300"
                                               value="${student.studentId}" data-name="${student.name}">
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${student.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${student.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${getDegreeText(student.degree)}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${getStageText(student.stage)}</td>
                                    <td class="py-3 px-4">
                                        <div class="flex flex-col gap-1">
                                            ${student.advisors.map(advisor => `
                                                <span class="text-xs ${
                                                    advisor.id === currentProf.id
                                                        ? 'font-semibold text-blue-600'
                                                        : 'text-gray-500'
                                                }">
                                                    ${advisor.name} ${advisor.role === 'primary' ? '(주)' : '(부)'}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <span class="font-semibold text-blue-600">${myStats.count}회</span>
                                    </td>
                                    <td class="py-3 px-4 text-center text-gray-600">${student.totalGuidanceCount}회</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${myStats.lastDate || '-'}</td>
                                    <td class="py-3 px-4 text-center">
                                        <button onclick="showStudentDetail('${student.studentId}')"
                                                class="text-blue-600 hover:underline text-sm font-medium">
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 학생 상세 화면
function showStudentDetail(studentId) {
    currentView = 'detail';
    currentStudentId = studentId;
    showOnlyMyGuidance = false;
    
    renderStudentDetail();
}

// 상세 화면 렌더링 (카드 레이아웃 - 관리자 스타일)
function renderStudentDetail() {
    const student = DataService.getStudentDetail(currentStudentId);
    if (!student) return;
    
    const currentProf = DataService.getCurrentProfessor();
    const myRole = student.advisors.find(a => a.id === currentProf.id)?.role;
    const myStats = student.guidanceStats[currentProf.id] || { count: 0, lastDate: '-' };
    
    const plans = DataService.getWeeklyGuidancePlans(currentStudentId, showOnlyMyGuidance);
    const sortedPlans = plans.sort((a, b) => a.week - b.week);
    
    const contentArea = document.getElementById('guidance-content-area');
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <!-- 뒤로가기 버튼 -->
        <div class="mb-4">
            <button onclick="showStudentList()" 
                    class="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="text-sm font-medium">목록으로 돌아가기</span>
            </button>
        </div>
        
        <!-- 학생 정보 카드 (Phase 2 스타일 - 상세) -->
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 class="font-bold text-gray-800 mb-4">학생 정보</h4>
            <div class="grid grid-cols-2 gap-4">
                <div class="info-row">
                    <div class="info-label">학생명</div>
                    <div class="info-value">${student.name} (${student.studentId})</div>
                </div>
                <div class="info-row">
                    <div class="info-label">전공 / 학위</div>
                    <div class="info-value">${student.major} / ${getDegreeText(student.degree)}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">현재 단계</div>
                    <div class="info-value">${getStageText(student.stage)}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">지도교수</div>
                    <div class="info-value">
                        ${student.advisors.map(advisor => `
                            <div class="${advisor.id === currentProf.id ? 'font-semibold text-blue-600' : 'text-gray-600'}">
                                ${advisor.name} ${advisor.role === 'primary' ? '(주지도교수)' : '(부지도교수)'}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">지도 현황</div>
                    <div class="info-value">
                        <span class="font-semibold text-blue-600">내 지도: ${myStats.count}회</span>
                        <span class="text-gray-600 ml-3">전체: ${student.totalGuidanceCount}회</span>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">최근 지도일</div>
                    <div class="info-value">${myStats.lastDate || '-'}</div>
                </div>
            </div>
        </div>
        
        <!-- 주차별 지도 내역 (카드 형태 - 관리자 스타일) -->
        <div>
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-bold text-gray-800">주차별 지도 내역</h4>
                <div class="flex items-center gap-3">
                    <button onclick="openAddPlanModal()"
                            class="bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#5A0020]">
                        + 주차 추가
                    </button>
                </div>
            </div>
            
            ${sortedPlans.length > 0 ? `
                <div class="space-y-4">
                    ${sortedPlans.map(plan => {
                        const isMyPlan = plan.advisor.id === currentProf.id;
                        return `
                            <div class="border ${isMyPlan ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'} rounded-lg p-4 hover:shadow-md transition-shadow">
                                <!-- 헤더 -->
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                            ${plan.week}주차
                                        </span>
                                        <span class="ml-2 text-sm text-gray-600">${formatDate(plan.plannedDate)}</span>
                                        ${plan.executionDate ? `
                                            <span class="ml-2 text-sm text-green-600 font-medium">
                                                → ${formatDate(plan.executionDate)} 실행
                                            </span>
                                        ` : ''}
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-xs px-2 py-1 rounded ${
                                            plan.actualMethod === 'meeting' ? 'bg-green-100 text-green-700' :
                                            plan.actualMethod === 'zoom' ? 'bg-purple-100 text-purple-700' :
                                            plan.actualMethod === 'email' ? 'bg-yellow-100 text-yellow-700' :
                                            plan.plannedMethod === 'meeting' ? 'bg-gray-100 text-gray-600' :
                                            'bg-gray-100 text-gray-600'
                                        }">
                                            ${getMethodText(plan.actualMethod || plan.plannedMethod)}
                                        </span>
                                        ${isMyPlan && (plan.status === 'planned' || plan.status === 'in_progress') ? `
                                            <button onclick="openExecutionModal(${plan.id})" 
                                                    class="text-green-600 hover:underline text-xs font-medium">
                                                실적입력
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <!-- 본문 -->
                                <div class="space-y-2">
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">담당교수:</span>
                                        <span class="text-sm ${isMyPlan ? 'text-blue-600 font-semibold' : 'text-gray-800'} ml-2">
                                            ${plan.advisor.name}
                                        </span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">지도주제:</span>
                                        <span class="text-sm text-gray-800 ml-2">${plan.plannedTopic}</span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">계획내용:</span>
                                        <p class="text-sm text-gray-700 mt-1">${plan.plannedContent}</p>
                                    </div>
                                    
                                    ${plan.executionContent ? `
                                        <div class="bg-green-50 border-l-4 border-green-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-green-800">실행내용:</span>
                                            <p class="text-sm text-green-900 mt-1">${plan.executionContent}</p>
                                        </div>
                                    ` : ''}
                                    
                                    ${plan.professorComment ? `
                                        <div class="bg-amber-50 border-l-4 border-amber-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-amber-800">교수 의견:</span>
                                            <p class="text-sm text-amber-900 mt-1">${plan.professorComment}</p>
                                        </div>
                                    ` : ''}
                                    
                                    <div class="flex justify-between items-center pt-2">
                                        ${getStatusBadge(plan.status)}
                                        ${plan.isPublic !== undefined ? `
                                            <span class="text-xs ${plan.isPublic ? 'text-green-600' : 'text-gray-500'}">
                                                ${plan.isPublic ? '학생 공개' : '비공개'}
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p class="mt-4 text-sm text-gray-600">등록된 지도 계획이 없습니다</p>
                    <button onclick="openAddPlanModal()" 
                            class="mt-4 bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#5A0020]">
                        첫 지도 계획 추가하기
                    </button>
                </div>
            `}
        </div>
    `;
}

// 내 지도만 보기 토글
function toggleMyGuidanceFilter(checked) {
    showOnlyMyGuidance = checked;
    renderStudentDetail();
}

// 상태 배지
function getStatusBadge(status) {
    const badges = {
        'planned': '<span class="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">계획중</span>',
        'in_progress': '<span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">진행중</span>',
        'completed': '<span class="text-xs px-2 py-1 rounded bg-green-100 text-green-700">완료</span>'
    };
    return badges[status] || badges['planned'];
}

// 계획 추가 모달
function openAddPlanModal() {
    const student = DataService.getStudentDetail(currentStudentId);
    if (!student) return;

    const currentProf = DataService.getCurrentProfessor();
    const plans = DataService.getWeeklyGuidancePlans(currentStudentId, false);
    const nextWeek = plans.length > 0
        ? Math.max(...plans.map(p => p.week)) + 1
        : 1;

    const modalContent = `
        <form id="add-plan-form" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">주차 *</label>
                    <input type="number" name="week" value="${nextWeek}" min="1"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">계획일 *</label>
                    <input type="date" name="plannedDate"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">담당교수 선택 *</label>
                <div class="space-y-2 bg-gray-50 p-3 rounded-lg">
                    ${student.advisors.map(advisor => `
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" name="advisors" value="${advisor.id}"
                                   ${advisor.id === currentProf.id ? 'checked' : ''}
                                   class="rounded border-gray-300 mr-2">
                            <span class="text-sm ${advisor.id === currentProf.id ? 'font-semibold text-blue-600' : 'text-gray-700'}">
                                ${advisor.name} (${advisor.role === 'primary' ? '주지도교수' : '부지도교수'})
                            </span>
                        </label>
                    `).join('')}
                </div>
                <p class="text-xs text-gray-500 mt-1">※ 복수 선택 가능</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 주제 *</label>
                <input type="text" name="plannedTopic" placeholder="예: 연구방법론 개요"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">계획 내용 *</label>
                <textarea name="plannedContent" rows="4" placeholder="지도할 내용을 상세히 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                <select name="plannedMethod" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="">선택하세요</option>
                    <option value="meeting">대면</option>
                    <option value="online">온라인</option>
                    <option value="zoom">Zoom</option>
                    <option value="email">이메일</option>
                    <option value="phone">전화</option>
                </select>
            </div>

            <div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-xs text-blue-800">
                    💡 계획을 저장한 후, 실제 지도를 진행하면 '실적입력' 버튼을 클릭하여 실행 내용을 기록하세요.
                </p>
            </div>
        </form>
    `;

    createModal('주차별 지도 계획 추가', modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '저장',
            className: 'btn-primary',
            onclick: 'savePlan()'
        }
    ]);
}

// 계획 저장
function savePlan() {
    const form = document.getElementById('add-plan-form');
    const formData = new FormData(form);
    
    if (!formData.get('week') || !formData.get('plannedDate') || 
        !formData.get('plannedTopic') || !formData.get('plannedContent') || 
        !formData.get('plannedMethod')) {
        showToast('필수 항목을 모두 입력해주세요', 'warning');
        return;
    }
    
    const planData = {
        week: parseInt(formData.get('week')),
        plannedDate: formData.get('plannedDate'),
        plannedTopic: formData.get('plannedTopic'),
        plannedContent: formData.get('plannedContent'),
        plannedMethod: formData.get('plannedMethod'),
        isPublic: true
    };
    
    DataService.addWeeklyGuidancePlan(currentStudentId, planData);
    showToast('지도 계획이 저장되었습니다', 'success');
    
    // 모달은 자동으로 닫힘
    setTimeout(() => {
        renderStudentDetail();
    }, 100);
}

// 실적 입력 모달
function openExecutionModal(planId) {
    const plan = findPlanById(planId);
    if (!plan) return;
    
    // 오늘 날짜를 YYYY-MM-DD 형식으로
    const today = new Date().toISOString().split('T')[0];
    
    const modalContent = `
        <form id="execution-form" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-800 mb-2">${plan.week}주차 계획</h4>
                <div class="space-y-1 text-sm">
                    <p><span class="font-medium text-gray-600">계획일:</span> ${formatDate(plan.plannedDate)}</p>
                    <p><span class="font-medium text-gray-600">주제:</span> ${plan.plannedTopic}</p>
                    <p><span class="font-medium text-gray-600">계획 내용:</span> ${plan.plannedContent}</p>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">실제 실행일 *</label>
                <input type="date" name="executionDate" value="${today}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">실제 지도 방식 *</label>
                <select name="actualMethod" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="meeting" ${plan.plannedMethod === 'meeting' ? 'selected' : ''}>대면</option>
                    <option value="online" ${plan.plannedMethod === 'online' ? 'selected' : ''}>온라인</option>
                    <option value="zoom" ${plan.plannedMethod === 'zoom' ? 'selected' : ''}>Zoom</option>
                    <option value="email" ${plan.plannedMethod === 'email' ? 'selected' : ''}>이메일</option>
                    <option value="phone" ${plan.plannedMethod === 'phone' ? 'selected' : ''}>전화</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">실제 지도 내용 *</label>
                <textarea name="executionContent" rows="4" placeholder="실제로 진행한 지도 내용을 상세히 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">교수 코멘트</label>
                <textarea name="professorComment" rows="3" placeholder="학생에게 전달할 피드백을 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">다음 예정일</label>
                <input type="date" name="nextPlanDate"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            
            <div class="flex items-center">
                <input type="checkbox" name="isPublic" id="is-public" checked class="mr-2">
                <label for="is-public" class="text-sm text-gray-700">학생에게 공개</label>
            </div>
        </form>
    `;
    
    createModal('실적 입력', modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '저장',
            className: 'btn-primary',
            onclick: `saveExecution(${planId})`
        }
    ]);
}

// 실적 저장
function saveExecution(planId) {
    const form = document.getElementById('execution-form');
    const formData = new FormData(form);
    
    if (!formData.get('executionDate') || !formData.get('actualMethod') || 
        !formData.get('executionContent')) {
        showToast('필수 항목을 모두 입력해주세요', 'warning');
        return;
    }
    
    const executionData = {
        executionDate: formData.get('executionDate'),
        actualMethod: formData.get('actualMethod'),
        executionContent: formData.get('executionContent'),
        professorComment: formData.get('professorComment'),
        nextPlanDate: formData.get('nextPlanDate') || null,
        isPublic: formData.get('isPublic') === 'on'
    };
    
    DataService.updateGuidanceExecution(planId, executionData);
    showToast('실적이 저장되었습니다', 'success');
    
    // 모달은 자동으로 닫힘
    setTimeout(() => {
        renderStudentDetail();
    }, 100);
}

// Helper 함수들
function findPlanById(planId) {
    const plans = DataService.getWeeklyGuidancePlans(currentStudentId, false);
    return plans.find(p => p.id === planId);
}

function searchStudents() {
    showToast('검색 기능은 실제 구현 시 추가됩니다', 'info');
}

function resetStudentSearch() {
    document.getElementById('filter-degree').value = '';
    document.getElementById('filter-stage').value = '';
    document.getElementById('filter-keyword').value = '';
    showStudentList();
}

// 체크박스 전체 선택/해제
function toggleSelectAllStudents(checked) {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(cb => cb.checked = checked);
}

// 선택된 학생에게 알림 발송
function sendNotificationToSelected() {
    const checkboxes = document.querySelectorAll('.student-checkbox:checked');

    if (checkboxes.length === 0) {
        showToast('학생을 선택해주세요', 'warning');
        return;
    }

    const selectedStudents = Array.from(checkboxes).map(cb => ({
        id: cb.value,
        name: cb.dataset.name
    }));

    const modalContent = `
        <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-gray-700 mb-2">선택된 학생 (${selectedStudents.length}명)</p>
                <div class="flex flex-wrap gap-2">
                    ${selectedStudents.map(s => `
                        <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            ${s.name}
                        </span>
                    `).join('')}
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">알림 제목 *</label>
                <input type="text" id="notif-title" placeholder="예: 주차별 지도계획 확인 요청"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">알림 내용 *</label>
                <textarea id="notif-message" rows="4" placeholder="학생들에게 전달할 메시지를 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
        </div>
    `;

    createModal('알림 발송', modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '발송',
            className: 'btn-primary',
            onclick: 'confirmSendNotification(' + JSON.stringify(selectedStudents) + ')'
        }
    ]);
}

// 알림 발송 확인
function confirmSendNotification(students) {
    const title = document.getElementById('notif-title')?.value.trim();
    const message = document.getElementById('notif-message')?.value.trim();

    if (!title) {
        showToast('알림 제목을 입력해주세요', 'warning');
        return;
    }

    if (!message) {
        showToast('알림 내용을 입력해주세요', 'warning');
        return;
    }

    // 실제로는 서버에 알림 전송 요청
    console.log('알림 발송:', { students, title, message });
    showToast(`${students.length}명의 학생에게 알림이 발송되었습니다`, 'success');

    // 체크박스 초기화
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    document.getElementById('select-all-students').checked = false;
}

// 전역으로 export
window.initGuidance = initGuidance;
window.showStudentList = showStudentList;
window.showStudentDetail = showStudentDetail;
window.toggleMyGuidanceFilter = toggleMyGuidanceFilter;
window.openAddPlanModal = openAddPlanModal;
window.savePlan = savePlan;
window.openExecutionModal = openExecutionModal;
window.saveExecution = saveExecution;
window.searchStudents = searchStudents;
window.resetStudentSearch = resetStudentSearch;
window.toggleSelectAllStudents = toggleSelectAllStudents;
window.sendNotificationToSelected = sendNotificationToSelected;
window.confirmSendNotification = confirmSendNotification;
