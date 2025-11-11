/**
 * 논문 워크플로우 관리 스크립트
 * 학생의 논문 작성 단계별 진행 상황을 표시
 */

// 샘플 워크플로우 데이터
const workflowData = {
    studentId: 'S2024001',
    major: '컴퓨터공학과',
    degreeType: '석사',
    stages: [
        {
            id: 'stage-1',
            name: '연구주제 선정',
            description: '연구 주제를 선정하고 지도교수와 논의',
            status: 'completed'
        },
        {
            id: 'stage-2',
            name: '연구계획서 작성',
            description: '연구계획서를 작성하고 제출',
            status: 'completed'
        },
        {
            id: 'stage-3',
            name: '문헌 연구',
            description: '관련 문헌 조사 및 분석',
            status: 'in-progress'
        },
        {
            id: 'stage-4',
            name: '연구 수행',
            description: '실험 및 데이터 수집',
            status: 'in-progress'
        },
        {
            id: 'stage-5',
            name: '중간논문 작성',
            description: '중간논문을 작성하고 제출',
            status: 'not-started'
        },
        {
            id: 'stage-6',
            name: '최종논문 작성',
            description: '최종논문을 완성하고 제출',
            status: 'not-started'
        },
        {
            id: 'stage-7',
            name: '최종 심사',
            description: '최종 논문 심사 및 구두 발표',
            status: 'not-started'
        }
    ]
};

/**
 * 워크플로우 화면 렌더링 (메인 진입점)
 */
function renderWorkflow() {
    const container = document.getElementById('workflow-screen');
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-6">
            <!-- 헤더 -->
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-800">논문 작성 진행 단계</h2>
                <button onclick="refreshWorkflow()"
                        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    새로고침
                </button>
            </div>

            <!-- 전체 진행 상황 카드 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h6 class="text-sm text-gray-600 mb-2">완료</h6>
                    <h3 class="text-3xl font-bold text-green-600" id="completed-stages">0</h3>
                </div>
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h6 class="text-sm text-gray-600 mb-2">진행중</h6>
                    <h3 class="text-3xl font-bold text-yellow-600" id="inprogress-stages">0</h3>
                </div>
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h6 class="text-sm text-gray-600 mb-2">예정</h6>
                    <h3 class="text-3xl font-bold text-gray-600" id="pending-stages">0</h3>
                </div>
            </div>

            <!-- 단계 목록 -->
            <div id="workflow-stages-container" class="space-y-4">
                <!-- 동적으로 생성됨 -->
            </div>
        </div>
    `;

    // 데이터 렌더링
    renderWorkflowStages();
    updateWorkflowStats();
}

/**
 * 워크플로우 단계 렌더링
 */
function renderWorkflowStages() {
    const container = document.getElementById('workflow-stages-container');
    if (!container) return;

    let html = '';

    workflowData.stages.forEach((stage, index) => {
        const statusInfo = getStageStatusInfo(stage.status);
        const isActive = stage.status === 'in-progress';
        const isCompleted = stage.status === 'completed';

        html += `
            <div class="bg-white rounded-lg shadow-md overflow-hidden ${isActive ? 'ring-2 ring-yellow-400' : ''} ${isCompleted ? 'bg-green-50' : ''}">
                <div class="p-6">
                    <div class="flex items-start gap-4">
                        <!-- 단계 번호 -->
                        <div class="flex-shrink-0">
                            <div class="w-14 h-14 rounded-full ${statusInfo.bgClass} flex items-center justify-center text-white text-xl font-bold">
                                ${isCompleted ? `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                </svg>` : (index + 1)}
                            </div>
                        </div>

                        <!-- 단계 정보 -->
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start mb-2 gap-4">
                                <div class="flex-1">
                                    <h5 class="text-lg font-bold mb-1 ${statusInfo.textClass}">${stage.name}</h5>
                                    <p class="text-sm text-gray-600">${stage.description}</p>
                                </div>
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass} flex-shrink-0">
                                    ${statusInfo.text}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * 단계 상태 정보 반환
 */
function getStageStatusInfo(status) {
    const statusMap = {
        'completed': {
            text: '완료',
            badgeClass: 'bg-green-100 text-green-800',
            bgClass: 'bg-green-500',
            textClass: 'text-green-700'
        },
        'in-progress': {
            text: '진행중',
            badgeClass: 'bg-yellow-100 text-yellow-800',
            bgClass: 'bg-yellow-500',
            textClass: 'text-yellow-700'
        },
        'not-started': {
            text: '예정',
            badgeClass: 'bg-gray-100 text-gray-800',
            bgClass: 'bg-gray-400',
            textClass: 'text-gray-700'
        }
    };
    return statusMap[status] || statusMap['not-started'];
}

/**
 * 워크플로우 통계 업데이트
 */
function updateWorkflowStats() {
    const stats = {
        completed: workflowData.stages.filter(s => s.status === 'completed').length,
        inProgress: workflowData.stages.filter(s => s.status === 'in-progress').length,
        pending: workflowData.stages.filter(s => s.status === 'not-started').length
    };

    document.getElementById('completed-stages').textContent = stats.completed;
    document.getElementById('inprogress-stages').textContent = stats.inProgress;
    document.getElementById('pending-stages').textContent = stats.pending;
}

/**
 * 워크플로우 새로고침
 */
function refreshWorkflow() {
    console.log('워크플로우 데이터 새로고침...');

    // 로딩 표시
    const container = document.getElementById('workflow-stages-container');
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
        renderWorkflowStages();
        updateWorkflowStats();
        console.log('✅ 워크플로우 데이터 새로고침 완료');
    }, 1000);
}

// 전역 함수로 내보내기
window.renderWorkflow = renderWorkflow;
window.refreshWorkflow = refreshWorkflow;

console.log('✅ 논문 워크플로우 관리 스크립트 로드 완료');
