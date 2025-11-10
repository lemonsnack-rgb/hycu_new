/**
 * 논문 워크플로우 관리 스크립트
 * 학생의 논문 작성 단계별 진행 상황을 표시
 * 특징: 병렬 진행 가능한 워크플로우 (순차적이 아님)
 */

// 샘플 워크플로우 데이터
const workflowData = {
    studentId: 'S2024001',
    major: '컴퓨터공학과',
    degreeType: '석사',
    startDate: '2024-03-01',
    expectedGraduationDate: '2026-02-28',
    stages: [
        {
            id: 'stage-1',
            name: '연구주제 선정',
            description: '연구 주제를 선정하고 지도교수와 논의',
            startDate: '2024-03-01',
            endDate: '2024-04-30',
            status: 'completed',
            completedDate: '2024-04-15',
            progress: 100,
            tasks: [
                { name: '문헌 조사', status: 'completed', completedDate: '2024-03-20' },
                { name: '주제 선정', status: 'completed', completedDate: '2024-04-10' },
                { name: '지도교수 승인', status: 'completed', completedDate: '2024-04-15' }
            ],
            documents: ['주제선정서.pdf']
        },
        {
            id: 'stage-2',
            name: '연구계획서 작성',
            description: '연구계획서를 작성하고 제출',
            startDate: '2024-05-01',
            endDate: '2024-07-31',
            status: 'completed',
            completedDate: '2024-07-20',
            progress: 100,
            tasks: [
                { name: '연구배경 작성', status: 'completed', completedDate: '2024-05-30' },
                { name: '연구방법론 작성', status: 'completed', completedDate: '2024-06-20' },
                { name: '계획서 제출', status: 'completed', completedDate: '2024-07-15' },
                { name: '심사 통과', status: 'completed', completedDate: '2024-07-20' }
            ],
            documents: ['연구계획서_v3.pdf', '심사결과.pdf']
        },
        {
            id: 'stage-3',
            name: '문헌 연구',
            description: '관련 문헌 조사 및 분석',
            startDate: '2024-05-01',  // 2단계와 병렬 진행
            endDate: '2024-10-31',
            status: 'in-progress',
            progress: 70,
            tasks: [
                { name: '국내 문헌 조사', status: 'completed', completedDate: '2024-06-30' },
                { name: '해외 문헌 조사', status: 'completed', completedDate: '2024-08-31' },
                { name: '문헌 분석 리포트', status: 'in-progress', progress: 60 },
                { name: '참고문헌 정리', status: 'pending' }
            ],
            documents: ['문헌조사_중간보고.pdf']
        },
        {
            id: 'stage-4',
            name: '연구 수행',
            description: '실험 및 데이터 수집',
            startDate: '2024-08-01',
            endDate: '2025-03-31',
            status: 'in-progress',
            progress: 45,
            tasks: [
                { name: '실험 설계', status: 'completed', completedDate: '2024-08-31' },
                { name: '데이터 수집', status: 'in-progress', progress: 60 },
                { name: '데이터 분석', status: 'in-progress', progress: 30 },
                { name: '결과 정리', status: 'pending' }
            ],
            documents: ['실험계획서.pdf', '중간데이터.xlsx']
        },
        {
            id: 'stage-5',
            name: '중간논문 작성',
            description: '중간논문을 작성하고 제출',
            startDate: '2025-01-01',
            endDate: '2025-04-30',
            status: 'pending',
            progress: 0,
            tasks: [
                { name: '초안 작성', status: 'pending' },
                { name: '지도교수 피드백', status: 'pending' },
                { name: '논문 수정', status: 'pending' },
                { name: '중간논문 제출', status: 'pending' }
            ],
            documents: []
        },
        {
            id: 'stage-6',
            name: '최종논문 작성',
            description: '최종논문을 완성하고 제출',
            startDate: '2025-05-01',
            endDate: '2025-11-30',
            status: 'pending',
            progress: 0,
            tasks: [
                { name: '최종 데이터 분석', status: 'pending' },
                { name: '결론 작성', status: 'pending' },
                { name: '논문 완성', status: 'pending' },
                { name: '표절 검사', status: 'pending' },
                { name: '최종 제출', status: 'pending' }
            ],
            documents: []
        },
        {
            id: 'stage-7',
            name: '최종 심사',
            description: '최종 논문 심사 및 구두 발표',
            startDate: '2025-12-01',
            endDate: '2026-01-31',
            status: 'pending',
            progress: 0,
            tasks: [
                { name: '심사위원 선정', status: 'pending' },
                { name: '심사 신청', status: 'pending' },
                { name: '구두 발표', status: 'pending' },
                { name: '심사 통과', status: 'pending' }
            ],
            documents: []
        }
    ]
};

let currentView = 'checklist'; // 'checklist' or 'timeline'

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
                <div class="flex gap-2">
                    <button onclick="toggleWorkflowView()"
                            class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12M8 12h12m-12 5h12M3 7h.01M3 12h.01M3 17h.01"></path>
                        </svg>
                        <span id="view-toggle-text">타임라인 보기</span>
                    </button>
                    <button onclick="refreshWorkflow()"
                            class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        새로고침
                    </button>
                </div>
            </div>

            <!-- 전체 진행 상황 카드 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h6 class="text-sm text-gray-600 mb-2">전체 단계</h6>
                    <h3 class="text-3xl font-bold text-gray-800" id="total-stages">0</h3>
                </div>
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

            <!-- 체크리스트 뷰 (기본) -->
            <div id="workflow-checklist-view">
                <div id="workflow-stages-container" class="space-y-4">
                    <!-- 동적으로 생성됨 -->
                </div>
            </div>

            <!-- 타임라인 뷰 -->
            <div id="workflow-timeline-view" style="display: none;">
                <div class="bg-white rounded-lg shadow p-6">
                    <div id="timeline-container" style="min-height: 400px;">
                        <!-- 타임라인 차트 -->
                    </div>
                </div>
            </div>
        </div>
    `;

    // 데이터 렌더링
    renderWorkflowChecklist();
    updateWorkflowStats();
}

/**
 * 체크리스트 뷰 렌더링
 */
function renderWorkflowChecklist() {
    const container = document.getElementById('workflow-stages-container');
    if (!container) return;

    let html = '';

    workflowData.stages.forEach((stage, index) => {
        const statusInfo = getStageStatusInfo(stage.status);
        const isActive = stage.status === 'in-progress';
        const isCompleted = stage.status === 'completed';

        // 기간 정보
        const period = `${stage.startDate} ~ ${stage.endDate}`;
        const daysRemaining = calculateDaysRemaining(stage.endDate);

        html += `
            <div class="bg-white rounded-lg shadow-md overflow-hidden ${isActive ? 'ring-2 ring-yellow-400' : ''} ${isCompleted ? 'opacity-75' : ''}">
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
                            <div class="flex justify-between items-start mb-3 gap-4">
                                <div>
                                    <h5 class="text-lg font-bold text-gray-800 mb-1">${stage.name}</h5>
                                    <p class="text-sm text-gray-600">${stage.description}</p>
                                </div>
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass} flex-shrink-0">
                                    ${statusInfo.text}
                                </span>
                            </div>

                            <!-- 기간 정보 -->
                            <div class="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600">
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span>${period}</span>
                                </div>
                                ${isActive && daysRemaining !== null ?
                                    `<span class="px-2 py-1 rounded ${daysRemaining < 30 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'} font-semibold">
                                        D-${daysRemaining}
                                    </span>`
                                    : ''
                                }
                                ${isCompleted ?
                                    `<div class="flex items-center gap-1 text-green-600 font-medium">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        ${stage.completedDate} 완료
                                    </div>`
                                    : ''
                                }
                            </div>

                            <!-- 진행률 -->
                            <div class="mb-4">
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-gray-700 font-medium">진행률</span>
                                    <span class="font-bold ${statusInfo.textClass}">${stage.progress}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div class="${statusInfo.progressClass} h-full rounded-full transition-all duration-500"
                                         style="width: ${stage.progress}%"></div>
                                </div>
                            </div>

                            <!-- 세부 작업 목록 -->
                            <div class="mb-4">
                                <h6 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                    </svg>
                                    세부 작업 (${stage.tasks.length})
                                </h6>
                                <div class="space-y-2 pl-4">
                                    ${renderTasksList(stage.tasks)}
                                </div>
                            </div>

                            <!-- 문서 목록 -->
                            ${stage.documents.length > 0 ? `
                                <div class="border-t border-gray-200 pt-4">
                                    <h6 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        관련 문서 (${stage.documents.length})
                                    </h6>
                                    <div class="space-y-2 pl-4">
                                        ${stage.documents.map(doc => `
                                            <div class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                <span>${doc}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * 세부 작업 목록 렌더링
 */
function renderTasksList(tasks) {
    return tasks.map(task => {
        const taskStatusInfo = getTaskStatusInfo(task);
        return `
            <div class="flex items-center gap-2 text-sm ${task.status === 'completed' ? 'text-gray-500' : 'text-gray-700'}">
                <div class="flex-shrink-0">
                    ${taskStatusInfo.icon}
                </div>
                <span class="${task.status === 'completed' ? 'line-through' : ''}">
                    ${task.name}
                </span>
                ${task.completedDate ?
                    `<span class="text-xs text-green-600 ml-2">(${task.completedDate})</span>`
                    : ''
                }
                ${task.progress && task.status === 'in-progress' ?
                    `<span class="text-xs text-yellow-600 ml-2 font-medium">(${task.progress}%)</span>`
                    : ''
                }
            </div>
        `;
    }).join('');
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
            progressClass: 'bg-green-500',
            textClass: 'text-green-600'
        },
        'in-progress': {
            text: '진행중',
            badgeClass: 'bg-yellow-100 text-yellow-800',
            bgClass: 'bg-yellow-500',
            progressClass: 'bg-yellow-500',
            textClass: 'text-yellow-600'
        },
        'pending': {
            text: '예정',
            badgeClass: 'bg-gray-100 text-gray-800',
            bgClass: 'bg-gray-400',
            progressClass: 'bg-gray-400',
            textClass: 'text-gray-600'
        }
    };
    return statusMap[status] || statusMap['pending'];
}

/**
 * 작업 상태 정보 반환
 */
function getTaskStatusInfo(task) {
    if (task.status === 'completed') {
        return {
            icon: `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`
        };
    } else if (task.status === 'in-progress') {
        return {
            icon: `<svg class="w-5 h-5 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>`
        };
    } else {
        return {
            icon: `<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`
        };
    }
}

/**
 * 남은 일수 계산
 */
function calculateDaysRemaining(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

/**
 * 워크플로우 통계 업데이트
 */
function updateWorkflowStats() {
    const stats = {
        total: workflowData.stages.length,
        completed: workflowData.stages.filter(s => s.status === 'completed').length,
        inProgress: workflowData.stages.filter(s => s.status === 'in-progress').length,
        pending: workflowData.stages.filter(s => s.status === 'pending').length
    };

    document.getElementById('total-stages').textContent = stats.total;
    document.getElementById('completed-stages').textContent = stats.completed;
    document.getElementById('inprogress-stages').textContent = stats.inProgress;
    document.getElementById('pending-stages').textContent = stats.pending;
}

/**
 * 뷰 전환 (체크리스트 <-> 타임라인)
 */
function toggleWorkflowView() {
    if (currentView === 'checklist') {
        document.getElementById('workflow-checklist-view').style.display = 'none';
        document.getElementById('workflow-timeline-view').style.display = 'block';
        document.getElementById('view-toggle-text').textContent = '목록 보기';
        currentView = 'timeline';
        renderTimelineView();
    } else {
        document.getElementById('workflow-checklist-view').style.display = 'block';
        document.getElementById('workflow-timeline-view').style.display = 'none';
        document.getElementById('view-toggle-text').textContent = '타임라인 보기';
        currentView = 'checklist';
    }
}

/**
 * 타임라인 뷰 렌더링
 */
function renderTimelineView() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    let html = '<div class="space-y-6 relative">';

    // 타임라인 연결선
    html += '<div class="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-300"></div>';

    workflowData.stages.forEach((stage, index) => {
        const statusInfo = getStageStatusInfo(stage.status);
        html += `
            <div class="relative flex gap-6">
                <!-- 타임라인 마커 -->
                <div class="relative z-10 flex-shrink-0">
                    <div class="w-14 h-14 rounded-full ${statusInfo.bgClass} flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        ${stage.status === 'completed' ? `
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ` : (index + 1)}
                    </div>
                </div>

                <!-- 타임라인 콘텐츠 -->
                <div class="flex-1 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h6 class="text-lg font-bold text-gray-800">${stage.name}</h6>
                            <p class="text-sm text-gray-600 mt-1">${stage.description}</p>
                        </div>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass}">
                            ${statusInfo.text}
                        </span>
                    </div>

                    <div class="text-sm text-gray-600 mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        ${stage.startDate} ~ ${stage.endDate}
                    </div>

                    <div class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span class="text-xs font-semibold inline-block text-gray-600">
                                    진행률
                                </span>
                            </div>
                            <div class="text-right">
                                <span class="text-xs font-semibold inline-block ${statusInfo.textClass}">
                                    ${stage.progress}%
                                </span>
                            </div>
                        </div>
                        <div class="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                            <div style="width: ${stage.progress}%; transition: width 0.5s ease-in-out;"
                                 class="${statusInfo.progressClass} shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
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
        renderWorkflowChecklist();
        updateWorkflowStats();
        console.log('✅ 워크플로우 데이터 새로고침 완료');
    }, 1000);
}

// 전역 함수로 내보내기
window.renderWorkflow = renderWorkflow;
window.toggleWorkflowView = toggleWorkflowView;
window.refreshWorkflow = refreshWorkflow;

console.log('✅ 논문 워크플로우 관리 스크립트 로드 완료');
