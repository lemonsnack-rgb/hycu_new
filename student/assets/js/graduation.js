/**
 * 졸업 요건 관리 스크립트
 * 학생의 졸업 요건 충족 현황을 표시하고 관리
 */

// 샘플 데이터 (실제로는 서버에서 가져옴)
const graduationRequirementsData = {
    studentId: 'S2024001',
    studentName: '김철수',
    major: '컴퓨터공학과',
    degreeType: '석사',
    categories: [
        {
            id: 'category-1',
            name: '학점 이수',
            requirements: [
                {
                    id: 'req-1-1',
                    title: '전공 필수 학점',
                    description: '전공 필수 과목 18학점 이상 이수',
                    requiredValue: 18,
                    currentValue: 15,
                    unit: '학점',
                    status: 'in-progress',
                    deadline: '2025-08-31',
                    details: '현재 15/18 학점 이수 (83%)'
                },
                {
                    id: 'req-1-2',
                    title: '전공 선택 학점',
                    description: '전공 선택 과목 12학점 이상 이수',
                    requiredValue: 12,
                    currentValue: 12,
                    unit: '학점',
                    status: 'completed',
                    completedDate: '2024-12-20',
                    details: '요건 충족 완료'
                }
            ]
        },
        {
            id: 'category-2',
            name: '논문 진행',
            requirements: [
                {
                    id: 'req-2-1',
                    title: '연구계획서 승인',
                    description: '연구계획서 제출 및 승인 완료',
                    requiredValue: 1,
                    currentValue: 1,
                    unit: '건',
                    status: 'completed',
                    completedDate: '2024-09-15',
                    details: '2024.09.15 승인 완료'
                },
                {
                    id: 'req-2-2',
                    title: '중간 논문 제출',
                    description: '중간 논문 제출 및 심사 통과',
                    requiredValue: 1,
                    currentValue: 0,
                    unit: '건',
                    status: 'not-started',
                    deadline: '2025-06-30',
                    details: '미제출'
                }
            ]
        },
        {
            id: 'category-3',
            name: '외국어 시험',
            requirements: [
                {
                    id: 'req-3-1',
                    title: '영어 능력 인증',
                    description: 'TOEIC 700점 이상 또는 동등 수준',
                    requiredValue: 700,
                    currentValue: 0,
                    unit: '점',
                    status: 'not-started',
                    deadline: '최종논문 제출 전',
                    details: '점수 미등록'
                }
            ]
        },
        {
            id: 'category-4',
            name: '논문 지도',
            requirements: [
                {
                    id: 'req-4-1',
                    title: '논문 지도 횟수',
                    description: '학기당 최소 4회 이상 지도 받기',
                    requiredValue: 8,
                    currentValue: 6,
                    unit: '회',
                    status: 'in-progress',
                    details: '현재 6/8회 완료'
                }
            ]
        }
    ]
};

/**
 * 졸업 요건 화면 렌더링 (메인 진입점)
 */
function renderGraduation() {
    const container = document.getElementById('graduation-screen');
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-6">
            <!-- 헤더 -->
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-800">졸업 요건 충족 현황</h2>
                <button onclick="refreshGraduationRequirements()"
                        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    새로고침
                </button>
            </div>

            <!-- 전체 진행률 카드 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">전체 진행률</h3>
                <div class="relative pt-1">
                    <div class="flex mb-2 items-center justify-between">
                        <div>
                            <span class="text-xs font-semibold inline-block text-gray-600">
                                <span id="completed-count">0</span>개 완료 / <span id="total-count">0</span>개 전체
                            </span>
                        </div>
                        <div class="text-right">
                            <span id="overall-progress-percent" class="text-xs font-semibold inline-block text-green-600">
                                0%
                            </span>
                        </div>
                    </div>
                    <div class="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                        <div id="overall-progress-bar"
                             style="width: 0%; transition: width 0.5s ease-in-out;"
                             class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500">
                        </div>
                    </div>
                </div>
            </div>

            <!-- 요건 카테고리별 체크리스트 -->
            <div id="requirements-container" class="space-y-4">
                <!-- 동적으로 생성됨 -->
            </div>
        </div>
    `;

    // 데이터 렌더링
    renderRequirementsCategories();
    updateOverallProgress();
}

/**
 * 요건 카테고리 렌더링
 */
function renderRequirementsCategories() {
    const container = document.getElementById('requirements-container');
    if (!container) return;

    let html = '';

    graduationRequirementsData.categories.forEach(category => {
        html += `
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <!-- 카테고리 헤더 -->
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                    <h4 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                        </svg>
                        ${category.name}
                    </h4>
                </div>

                <!-- 요건 목록 -->
                <div class="p-6 space-y-4">
        `;

        category.requirements.forEach(req => {
            const statusInfo = getStatusInfo(req.status);
            const progressPercent = Math.min(100, (req.currentValue / req.requiredValue * 100)).toFixed(0);

            html += `
                <div class="border-2 ${statusInfo.borderClass} rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start gap-4">
                        <!-- 상태 아이콘 -->
                        <div class="flex-shrink-0 mt-1">
                            <div class="w-10 h-10 rounded-full ${statusInfo.bgClass} flex items-center justify-center">
                                ${statusInfo.icon}
                            </div>
                        </div>

                        <!-- 요건 정보 -->
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start mb-2 gap-4">
                                <h5 class="font-bold text-gray-800 text-base">${req.title}</h5>
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass} flex-shrink-0">
                                    ${statusInfo.text}
                                </span>
                            </div>

                            <p class="text-sm text-gray-600 mb-3">${req.description}</p>

                            <!-- 진행률 바 -->
                            <div class="mb-3">
                                <div class="flex justify-between text-xs text-gray-600 mb-1">
                                    <span class="font-medium">${req.currentValue} / ${req.requiredValue} ${req.unit}</span>
                                    <span class="font-semibold">${progressPercent}%</span>
                                </div>
                                <div class="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                                    <div style="width: ${progressPercent}%; transition: width 0.5s ease-in-out;"
                                         class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${statusInfo.progressClass}">
                                    </div>
                                </div>
                            </div>

                            <!-- 상세 정보 -->
                            <div class="text-sm text-gray-600 space-y-1">
                                <p class="flex items-center gap-2">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>${req.details}</span>
                                </p>
                                ${req.deadline ? `
                                <p class="flex items-center gap-2 text-orange-600">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span class="font-medium">마감: ${req.deadline}</span>
                                </p>
                                ` : ''}
                                ${req.completedDate ? `
                                <p class="flex items-center gap-2 text-green-600">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span class="font-medium">완료: ${req.completedDate}</span>
                                </p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * 상태별 스타일 정보 반환
 */
function getStatusInfo(status) {
    const statusMap = {
        'completed': {
            text: '완료',
            icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>`,
            bgClass: 'bg-green-500',
            badgeClass: 'bg-green-100 text-green-800',
            borderClass: 'border-green-300',
            progressClass: 'bg-green-500'
        },
        'in-progress': {
            text: '진행중',
            icon: `<svg class="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>`,
            bgClass: 'bg-yellow-500',
            badgeClass: 'bg-yellow-100 text-yellow-800',
            borderClass: 'border-yellow-300',
            progressClass: 'bg-yellow-500'
        },
        'not-started': {
            text: '미시작',
            icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`,
            bgClass: 'bg-gray-400',
            badgeClass: 'bg-gray-100 text-gray-800',
            borderClass: 'border-gray-300',
            progressClass: 'bg-gray-400'
        }
    };

    return statusMap[status] || statusMap['not-started'];
}

/**
 * 전체 진행률 업데이트
 */
function updateOverallProgress() {
    let totalRequirements = 0;
    let completedRequirements = 0;

    graduationRequirementsData.categories.forEach(category => {
        category.requirements.forEach(req => {
            totalRequirements++;
            if (req.status === 'completed') {
                completedRequirements++;
            }
        });
    });

    const progressPercent = totalRequirements > 0
        ? (completedRequirements / totalRequirements * 100).toFixed(0)
        : 0;

    // 진행률 바 업데이트
    const progressBar = document.getElementById('overall-progress-bar');
    if (progressBar) {
        progressBar.style.width = progressPercent + '%';
    }

    // 퍼센트 텍스트 업데이트
    const progressText = document.getElementById('overall-progress-percent');
    if (progressText) {
        progressText.textContent = progressPercent + '%';
    }

    // 완료/전체 카운트 업데이트
    const completedCount = document.getElementById('completed-count');
    if (completedCount) {
        completedCount.textContent = completedRequirements;
    }

    const totalCount = document.getElementById('total-count');
    if (totalCount) {
        totalCount.textContent = totalRequirements;
    }
}

/**
 * 졸업 요건 새로고침
 */
function refreshGraduationRequirements() {
    console.log('졸업 요건 데이터 새로고침...');

    // 로딩 표시
    const container = document.getElementById('requirements-container');
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
        renderRequirementsCategories();
        updateOverallProgress();

        // 성공 알림 (선택사항)
        console.log('✅ 졸업 요건 데이터 새로고침 완료');
    }, 1000);
}

// 전역 함수로 내보내기
window.renderGraduation = renderGraduation;
window.refreshGraduationRequirements = refreshGraduationRequirements;

console.log('✅ 졸업 요건 관리 스크립트 로드 완료');
