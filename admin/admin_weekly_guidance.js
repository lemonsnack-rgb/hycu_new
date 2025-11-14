// ===================================
// 관리자용 주차별 논문지도 현황 (목록/상세 전환 방식)
// 교수용 화면 UI/UX 통일
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
            <div class="p-6 border-b">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">주차별 논문지도 현황</h2>
                </div>

                <!-- 필터 -->
                <div class="grid grid-cols-4 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학기</label>
                        <select id="semesterFilter" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                            <option value="">전체</option>
                            <option value="2024-2학기">2024-2학기</option>
                            <option value="2024-1학기">2024-1학기</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
                        <select id="statusFilter" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                            <option value="">전체</option>
                            <option value="active">진행중</option>
                            <option value="completed">완료</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">교수명</label>
                        <input type="text" id="professorSearch" placeholder="교수명 입력"
                               class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학생명</label>
                        <input type="text" id="studentSearch" placeholder="학생명 입력"
                               class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    </div>
                </div>

                <div class="flex gap-2">
                    <button onclick="filterGuidancePairs()"
                            class="bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#5A0020]">
                        검색
                    </button>
                    <button onclick="resetGuidancePairsFilter()"
                            class="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                        초기화
                    </button>
                </div>
            </div>

            <!-- 목록 -->
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학부/대학원</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과/전공</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정구분</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${data.guidancePairs.map((pair, index) => `
                            <tr class="hover:bg-gray-50">
                                <td class="py-3 px-4 text-sm text-gray-600">${index + 1}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">일반대학원</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${pair.student.major || '-'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${getAdminDegreeText(pair.student.degree)}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${pair.student.studentId}</td>
                                <td class="py-3 px-4 text-sm font-medium text-gray-800">${pair.student.name}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${pair.professor.name}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${pair.semester}</td>
                                <td class="py-3 px-4 text-center">
                                    <button onclick="showGuidancePairDetail(${pair.id})"
                                            class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded hover:bg-blue-50">
                                        상세보기
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 상세 화면 (교수용 화면과 동일한 구조)
function showGuidancePairDetail(pairId) {
    currentGuidanceView = 'detail';
    currentPairId = pairId;

    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === pairId);
    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];

    if (!pair || !plansData) {
        alert('데이터를 찾을 수 없습니다.');
        return;
    }

    const sortedPlans = plansData.weeks.sort((a, b) => a.week - b.week);
    const contentArea = document.getElementById('weekly-guidance-content');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="flex items-center justify-between p-6 border-b">
                <div class="flex items-center gap-4">
                    <button onclick="showGuidancePairsList()"
                            class="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        <span>목록으로</span>
                    </button>
                    <h2 class="text-2xl font-bold text-gray-800">주차별 논문지도 현황</h2>
                </div>
            </div>

            <!-- 학생 정보 -->
            <div class="p-6 border-b bg-gray-50">
                <h4 class="font-bold text-gray-800 mb-4">학생 정보</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <div class="text-xs font-semibold text-gray-500">학생명</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.student.name} (${pair.student.studentId})</div>
                    </div>
                    <div>
                        <div class="text-xs font-semibold text-gray-500">전공 / 학위</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.student.major} / ${getAdminDegreeText(pair.student.degree)}</div>
                    </div>
                    <div>
                        <div class="text-xs font-semibold text-gray-500">지도교수</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.professor.name} (${pair.professor.department})</div>
                    </div>
                    <div>
                        <div class="text-xs font-semibold text-gray-500">학기</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.semester}</div>
                    </div>
                    <div>
                        <div class="text-xs font-semibold text-gray-500">지도 현황</div>
                        <div class="text-sm text-gray-800 mt-1">
                            <span class="font-semibold text-blue-600">완료: ${pair.completedWeeks}주차</span>
                            <span class="text-gray-600 ml-3">전체: ${pair.totalWeeks}주차</span>
                        </div>
                    </div>
                    <div>
                        <div class="text-xs font-semibold text-gray-500">최근 업데이트</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.lastUpdateDate || '-'}</div>
                    </div>
                </div>
            </div>

            <!-- 주차별 지도 내역 -->
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-gray-800">주차별 지도 내역</h4>
                    <button onclick="addNewWeeklyPlan(${pairId})"
                            class="bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#5A0020]">
                        + 주차 추가
                    </button>
                </div>

                ${sortedPlans.length > 0 ? `
                    <div class="space-y-4">
                        ${sortedPlans.map(weekPlan => `
                            <div class="border border-gray-200 bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                                <!-- 헤더 -->
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                            ${weekPlan.week}주차
                                        </span>
                                        ${weekPlan.professorPlan.createdAt ? `
                                            <span class="ml-2 text-sm text-gray-600">${formatAdminDate(weekPlan.professorPlan.createdAt)}</span>
                                        ` : ''}
                                        ${weekPlan.studentReport && weekPlan.studentReport.submittedAt ? `
                                            <span class="ml-2 text-sm text-green-600 font-medium">
                                                → ${formatAdminDate(weekPlan.studentReport.submittedAt)} 제출
                                            </span>
                                        ` : ''}
                                    </div>
                                    <div class="flex gap-2">
                                        ${weekPlan.studentReport ? `
                                            <span class="text-xs px-2 py-1 rounded bg-green-100 text-green-700">완료</span>
                                        ` : `
                                            <span class="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">진행중</span>
                                        `}
                                        <button onclick="editWeeklyPlan(${pairId}, ${weekPlan.week})"
                                                class="text-blue-600 hover:underline text-xs font-medium">
                                            수정
                                        </button>
                                    </div>
                                </div>

                                <!-- 본문 -->
                                <div class="space-y-2">
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">담당교수:</span>
                                        <span class="text-sm text-blue-600 font-semibold ml-2">${pair.professor.name}</span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">지도주제:</span>
                                        <span class="text-sm text-gray-800 ml-2">${weekPlan.professorPlan.goal}</span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">계획내용:</span>
                                        <p class="text-sm text-gray-700 mt-1">${weekPlan.professorPlan.content}</p>
                                    </div>
                                    ${weekPlan.professorPlan.materials && weekPlan.professorPlan.materials.length > 0 ? `
                                        <div>
                                            <span class="text-xs font-semibold text-gray-500">자료:</span>
                                            <p class="text-sm text-gray-700 mt-1">${weekPlan.professorPlan.materials.join(', ')}</p>
                                        </div>
                                    ` : ''}

                                    ${weekPlan.studentReport ? `
                                        <div class="bg-green-50 border-l-4 border-green-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-green-800">학생 실적:</span>
                                            <div class="text-sm text-green-900 mt-1 space-y-1">
                                                <p><strong>달성:</strong> ${weekPlan.studentReport.achievement}</p>
                                                <p><strong>다음 계획:</strong> ${weekPlan.studentReport.nextPlan}</p>
                                                ${weekPlan.studentReport.difficulties ? `
                                                    <p><strong>어려움:</strong> ${weekPlan.studentReport.difficulties}</p>
                                                ` : ''}
                                            </div>
                                        </div>
                                    ` : `
                                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-yellow-800">학생 실적 미제출</span>
                                        </div>
                                    `}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p class="mt-4 text-sm text-gray-600">등록된 지도 계획이 없습니다</p>
                        <button onclick="addNewWeeklyPlan(${pairId})"
                                class="mt-4 bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#5A0020]">
                            첫 지도 계획 추가하기
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
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

function filterGuidancePairs() {
    showAlert('필터 기능은 추후 구현 예정입니다.');
}

function resetGuidancePairsFilter() {
    document.getElementById('semesterFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('professorSearch').value = '';
    document.getElementById('studentSearch').value = '';
    showAlert('검색 조건이 초기화되었습니다.');
}

// 전역으로 export
window.initWeeklyGuidance = initWeeklyGuidance;
window.showGuidancePairsList = showGuidancePairsList;
window.showGuidancePairDetail = showGuidancePairDetail;
window.filterGuidancePairs = filterGuidancePairs;
window.resetGuidancePairsFilter = resetGuidancePairsFilter;
