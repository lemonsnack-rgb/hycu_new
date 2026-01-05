// ===================================
// 관리자용 학기별 지도 계획 (admin-v3 디자인 적용)
// ===================================

let currentGuidanceView = 'list';  // 'list' or 'detail'
let currentPairId = null;

// 주차별 지도 관리 초기화
function initWeeklyGuidance() {
    console.log('관리자용 주차별 지도 관리 초기화');
    showGuidancePairsList();
}

// 목록 화면
function showGuidancePairsList() {
    currentGuidanceView = 'list';
    currentPairId = null;

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
                                <tr onclick="showGuidancePairDetail(${pair.id})">
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

// 상세 화면 (학생용 UI와 동일한 구조)
function showGuidancePairDetail(pairId) {
    currentGuidanceView = 'detail';
    currentPairId = pairId;

    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === pairId);

    if (!pair) {
        alert('데이터를 찾을 수 없습니다.');
        return;
    }

    // plansData가 없으면 초기화
    if (!appData.weeklyGuidance.weeklyPlans[pairId]) {
        appData.weeklyGuidance.weeklyPlans[pairId] = { plans: [], totalWeeks: 0 };
    }

    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];

    // totalWeeks 기본값 0으로 설정 (계획이 없는 상태)
    const totalWeeks = plansData.totalWeeks || 0;

    // 주차 구조 생성
    const weeks = generateAdminWeeks(plansData.plans, totalWeeks);

    const contentArea = document.getElementById('weekly-guidance-content');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <!-- 뒤로가기 버튼 -->
        <div class="mb-4">
            <button onclick="showGuidancePairsList()"
                    class="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="text-sm font-medium">목록으로 돌아가기</span>
            </button>
        </div>

        <!-- 학생 정보 (학위논문 심사 스타일) -->
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
                        <span class="text-gray-900 font-medium">${pair.student.major || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                        <span class="text-gray-900 font-medium">${pair.student.major}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                        <span class="text-gray-900 font-medium">${getAdminDegreeText(pair.student.degree)}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                        <span class="text-gray-900 font-medium">재학</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학번:</span>
                        <span class="text-gray-900 font-medium">${pair.student.studentId}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                        <span class="text-gray-900 font-medium">${pair.student.name}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                        <span class="text-gray-900 font-medium">
                            ${pair.student.advisors.map(advisor =>
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
                        <select id="admin-select-year" onchange="changeAdminSemesterView()"
                                class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                            <option value="2025" selected>2025학년도</option>
                            <option value="2024">2024학년도</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-gray-600 min-w-[60px]">학기:</label>
                        <select id="admin-select-semester" onchange="changeAdminSemesterView()"
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
                        <button onclick="resetAdminTotalWeeks(${pairId})"
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

        <!-- 주차별 지도 계획 및 실적 (totalWeeks에 따라 가변) -->
        ${totalWeeks > 0 ? renderAdminWeeklyCards(weeks) : ''}
    `;
}

// 주차 구조 생성 (totalWeeks 기반)
function generateAdminWeeks(plans, totalWeeks = 15) {
    const weeks = [];
    for (let i = 1; i <= totalWeeks; i++) {
        // 해당 주차의 모든 계획/실적 찾기
        const weekPlans = plans.filter(p => p.week === i);

        // 기본 주차 객체
        const weekObj = {
            week: i,
            plannedDate: weekPlans[0]?.plannedDate || null,
            plannedTopic: weekPlans[0]?.plannedTopic || '',
            plannedContent: weekPlans[0]?.plannedContent || '',
            plannedMethod: weekPlans[0]?.plannedMethod || 'meeting',
            executions: []
        };

        // 실행된 계획들을 executions로 변환
        weekPlans.forEach(plan => {
            if (plan.executionDate) {
                weekObj.executions.push({
                    id: plan.id,
                    professorName: plan.advisor.name,
                    executionDate: plan.executionDate,
                    method: plan.actualMethod || plan.plannedMethod,
                    executionContent: plan.executionContent || '',
                    comment: plan.professorComment || ''
                });
            }
        });

        weeks.push(weekObj);
    }
    return weeks;
}

// 주차별 카드 렌더링 (학생용과 동일)
function renderAdminWeeklyCards(weeks) {
    return `
        <div class="space-y-4">
            <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-800">주차별 지도 계획 및 실적</h3>
            </div>

            ${weeks.map(week => renderAdminWeekCard(week)).join('')}
        </div>
    `;
}

// 개별 주차 카드 (학생용과 동일한 구조)
function renderAdminWeekCard(week) {
    const hasExecutions = week.executions && week.executions.length > 0;
    const hasPlan = week.plannedTopic && week.plannedTopic.trim() !== '';

    return `
        <div id="week-card-${week.week}" class="week-card-v2 bg-white border border-gray-200 rounded-lg">
                ${hasPlan ? `
                    <!-- 계획 입력 폼 (기존 계획 표시) -->
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
                    <!-- 계획 입력 폼 (빈 상태) -->
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
                            ${week.executions.map(exec => renderAdminExecutionComment(exec)).join('')}
                        </div>
                    ` : ''}
                </div>
        </div>
    `;
}

// 실적 댓글 렌더링 (학생용과 동일)
function renderAdminExecutionComment(execution) {
    return `
        <div class="execution-comment bg-gray-50 border-gray-200 border rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <div class="text-sm font-semibold text-gray-800">
                        ${execution.professorName}
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <span>${formatAdminDateWithTime(execution.executionDate)}</span>
                        <span>•</span>
                        <span class="px-2 py-0.5 rounded ${getAdminMethodBadgeClass(execution.method)}">
                            ${getAdminMethodText(execution.method)}
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

// 계획 추가 모달 (교수용과 완전히 동일)
function addNewWeeklyPlan() {
    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === currentPairId);
    if (!pair) return;

    const plansData = appData.weeklyGuidance.weeklyPlans[currentPairId];
    const plans = plansData ? plansData.plans : [];
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
                    ${pair.student.advisors.map(advisor => `
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" name="advisors" value="${advisor.id}"
                                   ${advisor.id === pair.professor.id ? 'checked' : ''}
                                   class="rounded border-gray-300 mr-2">
                            <span class="text-sm ${advisor.id === pair.professor.id ? 'font-semibold text-blue-600' : 'text-gray-700'}">
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
                    💡 관리자는 지도 계획을 추가/수정할 수 있으나, 교수의 실적 입력은 수정할 수 없습니다.
                </p>
            </div>
        </form>
    `;

    openModal('계획 추가', modalContent, '저장', saveNewPlan, true);
}

// 새 계획 저장
function saveNewPlan() {
    const form = document.getElementById('add-plan-form');
    const formData = new FormData(form);

    if (!formData.get('week') || !formData.get('plannedDate') ||
        !formData.get('plannedTopic') || !formData.get('plannedContent') ||
        !formData.get('plannedMethod')) {
        showAlert('필수 항목을 모두 입력해주세요');
        return;
    }

    const advisorIds = Array.from(form.querySelectorAll('input[name="advisors"]:checked'))
        .map(cb => cb.value);

    if (advisorIds.length === 0) {
        showAlert('담당교수를 최소 1명 이상 선택해주세요');
        return;
    }

    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === currentPairId);
    const selectedAdvisor = pair.student.advisors.find(a => a.id === advisorIds[0]);

    const newPlan = {
        id: Date.now(),
        week: parseInt(formData.get('week')),
        plannedDate: formData.get('plannedDate'),
        plannedTopic: formData.get('plannedTopic'),
        plannedContent: formData.get('plannedContent'),
        plannedMethod: formData.get('plannedMethod'),
        advisor: { id: selectedAdvisor.id, name: selectedAdvisor.name },
        executionDate: null,
        actualMethod: null,
        executionContent: null,
        professorComment: null,
        status: 'planned',
        isPublic: true
    };

    if (!appData.weeklyGuidance.weeklyPlans[currentPairId]) {
        appData.weeklyGuidance.weeklyPlans[currentPairId] = { plans: [] };
    }

    appData.weeklyGuidance.weeklyPlans[currentPairId].plans.push(newPlan);
    showAlert('지도 계획이 저장되었습니다');

    closeModal();
    setTimeout(() => {
        showGuidancePairDetail(currentPairId);
    }, 100);
}

// 주차 수정 모달 (교수용과 완전히 동일)
function editWeeklyPlan(planId) {
    const plansData = appData.weeklyGuidance.weeklyPlans[currentPairId];
    const plan = plansData.plans.find(p => p.id === planId);
    if (!plan) return;

    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === currentPairId);
    if (!pair) return;

    const modalContent = `
        <form id="edit-plan-form" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">주차 *</label>
                    <input type="number" name="week" value="${plan.week}" min="1"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">계획일 *</label>
                    <input type="date" name="plannedDate" value="${plan.plannedDate}"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">담당교수 선택 *</label>
                <div class="space-y-2 bg-gray-50 p-3 rounded-lg">
                    ${pair.student.advisors.map(advisor => `
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" name="advisors" value="${advisor.id}"
                                   ${advisor.id === plan.advisor.id ? 'checked' : ''}
                                   class="rounded border-gray-300 mr-2">
                            <span class="text-sm ${advisor.id === pair.professor.id ? 'font-semibold text-blue-600' : 'text-gray-700'}">
                                ${advisor.name} (${advisor.role === 'primary' ? '주지도교수' : '부지도교수'})
                            </span>
                        </label>
                    `).join('')}
                </div>
                <p class="text-xs text-gray-500 mt-1">※ 복수 선택 가능</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 주제 *</label>
                <input type="text" name="plannedTopic" value="${plan.plannedTopic}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">계획 내용 *</label>
                <textarea name="plannedContent" rows="4"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>${plan.plannedContent}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                <select name="plannedMethod" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="meeting" ${plan.plannedMethod === 'meeting' ? 'selected' : ''}>대면</option>
                    <option value="online" ${plan.plannedMethod === 'online' ? 'selected' : ''}>온라인</option>
                    <option value="zoom" ${plan.plannedMethod === 'zoom' ? 'selected' : ''}>Zoom</option>
                    <option value="email" ${plan.plannedMethod === 'email' ? 'selected' : ''}>이메일</option>
                    <option value="phone" ${plan.plannedMethod === 'phone' ? 'selected' : ''}>전화</option>
                </select>
            </div>
        </form>
    `;

    openModal('지도 계획 수정', modalContent, '저장', () => updatePlan(planId), true);
}

// 계획 수정 저장
function updatePlan(planId) {
    const form = document.getElementById('edit-plan-form');
    const formData = new FormData(form);

    if (!formData.get('week') || !formData.get('plannedDate') ||
        !formData.get('plannedTopic') || !formData.get('plannedContent') ||
        !formData.get('plannedMethod')) {
        showAlert('필수 항목을 모두 입력해주세요');
        return;
    }

    const advisorIds = Array.from(form.querySelectorAll('input[name="advisors"]:checked'))
        .map(cb => cb.value);

    if (advisorIds.length === 0) {
        showAlert('담당교수를 최소 1명 이상 선택해주세요');
        return;
    }

    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === currentPairId);
    const selectedAdvisor = pair.student.advisors.find(a => a.id === advisorIds[0]);

    const plansData = appData.weeklyGuidance.weeklyPlans[currentPairId];
    const plan = plansData.plans.find(p => p.id === planId);

    plan.week = parseInt(formData.get('week'));
    plan.plannedDate = formData.get('plannedDate');
    plan.plannedTopic = formData.get('plannedTopic');
    plan.plannedContent = formData.get('plannedContent');
    plan.plannedMethod = formData.get('plannedMethod');
    plan.advisor = { id: selectedAdvisor.id, name: selectedAdvisor.name };

    showAlert('지도 계획이 수정되었습니다');

    closeModal();
    setTimeout(() => {
        showGuidancePairDetail(currentPairId);
    }, 100);
}

// 계획 삭제
function deletePlan(planId) {
    if (!confirm('이 지도 계획을 삭제하시겠습니까?')) {
        return;
    }

    const plansData = appData.weeklyGuidance.weeklyPlans[currentPairId];
    const index = plansData.plans.findIndex(p => p.id === planId);

    if (index !== -1) {
        plansData.plans.splice(index, 1);
        showAlert('지도 계획이 삭제되었습니다');

        setTimeout(() => {
            showGuidancePairDetail(currentPairId);
        }, 100);
    }
}

// Helper 함수들
function formatAdminDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

function getAdminMethodText(method) {
    const methodMap = {
        'meeting': '대면',
        'online': '온라인',
        'zoom': 'Zoom',
        'email': '이메일',
        'phone': '전화'
    };
    return methodMap[method] || method || '대면';
}

function formatAdminDateWithTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}월 ${day}일`;
}

function getAdminMethodBadgeClass(method) {
    const classes = {
        'meeting': 'bg-green-100 text-green-700',
        'zoom': 'bg-purple-100 text-purple-700',
        'online': 'bg-blue-100 text-blue-700',
        'email': 'bg-yellow-100 text-yellow-700',
        'phone': 'bg-pink-100 text-pink-700'
    };
    return classes[method] || 'bg-gray-100 text-gray-700';
}

function getAdminStatusBadge(status) {
    const badges = {
        'planned': '<span class="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">계획중</span>',
        'in_progress': '<span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">진행중</span>',
        'completed': '<span class="text-xs px-2 py-1 rounded bg-green-100 text-green-700">완료</span>'
    };
    return badges[status] || badges['planned'];
}

function filterGuidancePairs() {
    showAlert('필터 기능은 추후 구현 예정입니다.');
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
        showAlert('알림을 발송할 학생을 선택해주세요.');
        return;
    }

    const students = Array.from(checkboxes).map(cb => ({
        studentId: cb.value,
        name: cb.getAttribute('data-name')
    }));

    const studentNames = students.map(s => s.name).join(', ');

    if (confirm(`${students.length}명의 학생에게 알림을 발송하시겠습니까?\n\n학생: ${studentNames}`)) {
        // 실제로는 서버에 알림 발송 요청
        console.log('알림 발송 대상:', students);
        showAlert(`${students.length}명의 학생에게 알림이 발송되었습니다.`);

        // 체크박스 초기화
        checkboxes.forEach(cb => cb.checked = false);
        const selectAll = document.getElementById('select-all-pairs');
        if (selectAll) selectAll.checked = false;
    }
}

// 학기 변경 함수
function changeAdminSemesterView() {
    const year = document.getElementById('admin-select-year')?.value;
    const semester = document.getElementById('admin-select-semester')?.value;

    if (!year || !semester) return;

    console.log(`학기 변경: ${year}학년도 ${semester}학기`);

    // 선택된 학기에 따라 데이터 다시 로드
    // 실제 구현 시에는 서버에서 해당 학기 데이터를 가져와서 화면을 갱신해야 함
    showAlert(`${year}학년도 ${semester}학기 데이터를 조회합니다.`);

    // 현재는 상세 화면을 다시 렌더링
    if (currentPairId) {
        showGuidancePairDetail(currentPairId);
    }
}

// 총 주차 초기화 함수
function resetAdminTotalWeeks(pairId) {
    // plansData가 없으면 초기화
    if (!appData.weeklyGuidance.weeklyPlans[pairId]) {
        appData.weeklyGuidance.weeklyPlans[pairId] = { plans: [], totalWeeks: 0 };
    }

    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];
    const currentWeeks = plansData.totalWeeks || 0;
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

    openModal(modalTitle, modalContent, hasPlans ? '초기화 실행' : '생성', () => executeResetWeeks(pairId), true);
}

// 계획 초기화/생성 실행
function executeResetWeeks(pairId) {
    const form = document.getElementById('reset-weeks-form');
    const formData = new FormData(form);
    const newTotalWeeks = parseInt(formData.get('newTotalWeeks'));

    if (!newTotalWeeks || newTotalWeeks < 1 || newTotalWeeks > 15) {
        showAlert('올바른 주차 수를 선택해주세요 (1~15주)');
        return;
    }

    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];
    const currentWeeks = plansData.totalWeeks || 0;
    const totalPlansCount = plansData.plans.length;
    const hasPlans = currentWeeks > 0;

    // 최종 확인 (모든 데이터 삭제 경고)
    if (hasPlans && totalPlansCount > 0) {
        if (!confirm(`⚠️ 계획 초기화 확인\n\n현재 입력된 모든 계획 및 실적 ${totalPlansCount}건이 삭제됩니다.\n새로운 ${newTotalWeeks}주 구조로 초기화됩니다.\n\n이 작업은 되돌릴 수 없습니다.\n정말 초기화하시겠습니까?`)) {
            return;
        }
    }

    // 모든 계획 및 실적 삭제
    plansData.plans = [];

    // totalWeeks 업데이트
    plansData.totalWeeks = newTotalWeeks;

    const message = hasPlans
        ? `지도 계획이 ${newTotalWeeks}주로 초기화되었습니다.\n모든 계획 및 실적이 삭제되었습니다.`
        : `지도 계획이 ${newTotalWeeks}주로 생성되었습니다.`;

    showAlert(message);

    closeModal();
    setTimeout(() => {
        showGuidancePairDetail(pairId);
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

        // 스크롤 후 카드 강조 효과 (선택사항)
        weekCard.style.transition = 'box-shadow 0.3s ease';
        weekCard.style.boxShadow = '0 0 0 3px rgba(106, 0, 40, 0.2)';
        setTimeout(() => {
            weekCard.style.boxShadow = '';
        }, 1500);
    }
}

// 전역으로 export
window.initWeeklyGuidance = initWeeklyGuidance;
window.showGuidancePairsList = showGuidancePairsList;
window.showGuidancePairDetail = showGuidancePairDetail;
window.addNewWeeklyPlan = addNewWeeklyPlan;
window.saveNewPlan = saveNewPlan;
window.editWeeklyPlan = editWeeklyPlan;
window.updatePlan = updatePlan;
window.deletePlan = deletePlan;
window.filterGuidancePairs = filterGuidancePairs;
window.toggleSelectAllPairs = toggleSelectAllPairs;
window.sendNotificationToSelectedPairs = sendNotificationToSelectedPairs;
window.changeAdminSemesterView = changeAdminSemesterView;
window.resetAdminTotalWeeks = resetAdminTotalWeeks;
window.executeResetWeeks = executeResetWeeks;
window.scrollToWeek = scrollToWeek;
