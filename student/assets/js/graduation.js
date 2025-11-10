/**
 * 논문 제출 요건 관리 스크립트
 * 학생의 논문 제출 요건 충족 현황을 표시
 */

// 샘플 데이터 (실제로는 서버에서 가져옴)
const submissionRequirementsData = {
    studentId: 'S2024001',
    studentName: '김철수',
    major: '컴퓨터공학과',
    degreeType: '석사',
    requirements: [
        {
            id: 'req-1',
            name: '전공 필수 학점',
            description: '전공 필수 과목 18학점 이상 이수',
            status: 'not-completed'
        },
        {
            id: 'req-2',
            name: '전공 선택 학점',
            description: '전공 선택 과목 12학점 이상 이수',
            status: 'completed'
        },
        {
            id: 'req-3',
            name: '연구계획서 승인',
            description: '연구계획서 제출 및 승인 완료',
            status: 'completed'
        },
        {
            id: 'req-4',
            name: '중간 논문 제출',
            description: '중간 논문 제출 및 심사 통과',
            status: 'not-completed'
        },
        {
            id: 'req-5',
            name: '영어 능력 인증',
            description: 'TOEIC 700점 이상 또는 동등 수준',
            status: 'not-completed'
        },
        {
            id: 'req-6',
            name: '논문 지도 이수',
            description: '학기당 최소 4회 이상 지도 받기',
            status: 'not-completed'
        },
        {
            id: 'req-7',
            name: '학술지 게재',
            description: '등재지 또는 등재후보지 논문 게재',
            status: 'not-completed'
        },
        {
            id: 'req-8',
            name: '표절 검사',
            description: '최종 논문 표절 검사 통과',
            status: 'not-completed'
        }
    ]
};

/**
 * 논문 제출 요건 화면 렌더링 (메인 진입점)
 */
function renderGraduation() {
    const container = document.getElementById('graduation-screen');
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-6">
            <!-- 헤더 -->
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-800">논문 제출 요건</h2>
                <button onclick="refreshSubmissionRequirements()"
                        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    새로고침
                </button>
            </div>

            <!-- 전체 진행 현황 요약 -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-1">충족 현황</h3>
                        <p class="text-sm text-gray-600">
                            <span id="completed-count" class="font-bold text-green-600">0</span>개 완료 /
                            <span id="total-count" class="font-bold">0</span>개 전체
                        </p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold text-green-600" id="completion-rate">0%</div>
                        <div class="text-xs text-gray-500">완료율</div>
                    </div>
                </div>
            </div>

            <!-- 요건 목록 -->
            <div id="requirements-list" class="bg-white rounded-lg shadow divide-y divide-gray-200">
                <!-- 동적으로 생성됨 -->
            </div>
        </div>
    `;

    // 데이터 렌더링
    renderRequirementsList();
    updateCompletionStats();
}

/**
 * 요건 목록 렌더링
 */
function renderRequirementsList() {
    const container = document.getElementById('requirements-list');
    if (!container) return;

    let html = '';

    submissionRequirementsData.requirements.forEach((req, index) => {
        const isCompleted = req.status === 'completed';
        const statusIcon = isCompleted
            ? `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>`
            : `<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>`;

        html += `
            <div class="p-6 hover:bg-gray-50 transition-colors ${isCompleted ? 'bg-green-50' : ''}">
                <div class="flex items-start gap-4">
                    <!-- 상태 아이콘 -->
                    <div class="flex-shrink-0 mt-1">
                        ${statusIcon}
                    </div>

                    <!-- 요건 정보 -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                                <h4 class="text-base font-bold text-gray-800 mb-1 ${isCompleted ? 'text-green-700' : ''}">
                                    ${index + 1}. ${req.name}
                                </h4>
                                <p class="text-sm text-gray-600">
                                    ${req.description}
                                </p>
                            </div>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                                isCompleted
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }">
                                ${isCompleted ? '완료' : '미완료'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * 완료율 통계 업데이트
 */
function updateCompletionStats() {
    const total = submissionRequirementsData.requirements.length;
    const completed = submissionRequirementsData.requirements.filter(r => r.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('completed-count').textContent = completed;
    document.getElementById('total-count').textContent = total;
    document.getElementById('completion-rate').textContent = rate + '%';
}

/**
 * 요건 새로고침
 */
function refreshSubmissionRequirements() {
    console.log('논문 제출 요건 데이터 새로고침...');

    // 로딩 표시
    const container = document.getElementById('requirements-list');
    if (!container) return;

    container.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="text-center">
                <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-600">데이터를 불러오는 중...</p>
            </div>
        </div>
    `;

    // 시뮬레이션: 1초 후 렌더링
    setTimeout(() => {
        renderRequirementsList();
        updateCompletionStats();
        console.log('✅ 논문 제출 요건 데이터 새로고침 완료');
    }, 1000);
}

// 전역 함수로 내보내기
window.renderGraduation = renderGraduation;
window.refreshSubmissionRequirements = refreshSubmissionRequirements;

console.log('✅ 논문 제출 요건 관리 스크립트 로드 완료');
