// 논문 신청 화면 관리
// 일정 관리 구분이 '신청'인 단계에 대해 논문 신청을 처리

// 화면 상태 관리
let currentView = 'list';  // list | apply | detail
let currentApplicationId = null;
let currentStageTypeId = null;

/**
 * 논문 신청 화면 초기화
 */
function initThesisApplication() {
    console.log('논문 신청 화면 초기화');
    currentView = 'list';
    currentApplicationId = null;
    currentStageTypeId = null;
    renderApplicationScreen();
}

/**
 * 현재 상태에 따라 화면 렌더링
 */
function renderApplicationScreen() {
    if (currentView === 'list') {
        renderApplicationListScreen();
    } else if (currentView === 'apply') {
        renderApplicationFormScreen();
    } else if (currentView === 'detail') {
        renderApplicationDetailScreen();
    }
}

/**
 * 목록 화면 렌더링
 */
function renderApplicationListScreen() {
    const container = document.getElementById('thesis-application-content');
    if (!container) return;

    // 기본단계별 신청 상태 (재심사·제출취소 목업 시나리오 기준)
    const stageData = ReviewScenario.getStages().map(stage => ({
        stage,
        status: ReviewScenario.getStageStatus(stage.id)
    }));

    let html = `
        ${ReviewScenario.renderBar('renderApplicationListScreen')}
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">논문 신청</h3>
                        <span class="table-count">(총 ${stageData.length}건)</span>
                    </div>
                </div>

                <!-- 테이블 -->
                <div class="table-scroll">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문지도단계</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 200px;">신청기간</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 200px;">철회기간</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 130px;">신청상태</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${stageData.map((data, index) => renderApplicationRow(data, index)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * 목록의 각 행 렌더링
 */
function renderApplicationRow(data, index) {
    const { stage, status } = data;

    // 신청 / 철회 기간
    const periodText = `${stage.applicationPeriod.start} ~ ${stage.applicationPeriod.end}`;
    const withdrawalPeriodText = `${stage.withdrawalPeriod.start} ~ ${stage.withdrawalPeriod.end}`;

    // 신청 상태 및 관리 버튼 — 관리 컬럼은 [관리] 하나 (미신청·재심사 진행: 신청 모달 / 신청완료: 신청 상세, 철회는 상세에서)
    const statusText = status.label;
    const openFn = status.code === 'applied' ? 'viewApplicationDetail' : 'openApplicationModal';
    const actionButton = `<a href="#" onclick="${openFn}('${stage.id}'); return false;"
                           class="text-[#6A0028] hover:underline text-xs font-medium">
                            [관리]
                        </a>`;

    return `
        <tr class="hover:bg-blue-50">
            <td class="py-3 px-4 text-sm text-gray-600 text-center">${index + 1}</td>
            <td class="py-3 px-4 text-sm font-medium text-gray-800">${stage.name}</td>
            <td class="py-3 px-4 text-sm text-gray-600 text-center">${periodText}</td>
            <td class="py-3 px-4 text-sm text-gray-600 text-center">${withdrawalPeriodText}</td>
            <td class="py-3 px-4 text-sm text-gray-600 text-center">${statusText}</td>
            <td class="py-3 px-4 text-center">${actionButton}</td>
        </tr>
    `;
}

/**
 * 신청 모달 열기
 */
function openApplicationModal(stageTypeId) {
    const stage = ReviewScenario.getStage(stageTypeId);
    if (!stage) return;

    const modalHtml = `
        <!-- 모달 오버레이 -->
        <div id="application-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeApplicationModal(event)">
            <!-- 모달 컨테이너 -->
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <!-- 모달 헤더 -->
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-bold text-gray-900">논문 신청</h3>
                    <button onclick="closeApplicationModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- 모달 바디 -->
                <div class="overflow-y-auto p-6 space-y-6" style="max-height: calc(90vh - 180px);">
                    <form id="application-form" onsubmit="submitApplication(event, '${stageTypeId}')">
                        <!-- 신청 단계 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">신청 단계</label>
                            <input type="text" value="${stage.name}" readonly
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        </div>

                        <!-- 논문 제목 (한글) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                논문 제목 (한글) <span class="text-red-600">*</span>
                            </label>
                            <input type="text" id="app-thesis-title" required
                                   placeholder="논문 제목을 입력하세요"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 논문 제목 (외국어) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                논문 제목 (외국어) <span class="text-red-600">*</span>
                            </label>
                            <input type="text" id="app-thesis-title-en" required
                                   placeholder="논문 제목을 외국어로 입력하세요"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </form>
                </div>

                <!-- 모달 푸터 -->
                <div class="flex justify-end items-center gap-3 p-6 border-t bg-gray-50">
                    <button type="button" onclick="closeApplicationModal()"
                            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                        취소
                    </button>
                    <button type="submit" form="application-form"
                            class="px-6 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                        신청
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * 신청 모달 닫기
 */
function closeApplicationModal(event) {
    // 오버레이 클릭 시에만 event가 전달됨
    if (event && event.target.id !== 'application-modal') {
        return;
    }

    const modal = document.getElementById('application-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * 논문 신청 제출
 */
function submitApplication(event, stageTypeId) {
    event.preventDefault();

    const title = document.getElementById('app-thesis-title').value.trim();
    const titleEn = document.getElementById('app-thesis-title-en').value.trim();

    if (!title || !titleEn) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }

    if (confirm('논문을 신청하시겠습니까?')) {
        // 시나리오 상태에 신청 추가 (학위논문제출에 다음 번호의 제출 행 생성)
        const attemptNumber = ReviewScenario.apply(stageTypeId, title, titleEn);

        console.log('논문 신청 완료:', stageTypeId, attemptNumber + '차 제출');
        alert('논문 신청이 완료되었습니다.');

        closeApplicationModal();
        renderApplicationListScreen();
    }
}

/**
 * 신청 상세 보기
 */
function viewApplicationDetail(stageId) {
    const stage = ReviewScenario.getStage(stageId);
    const application = ReviewScenario.getCurrentApplication(stageId);
    if (!stage || !application) return;

    const statusText = ReviewScenario.getStageStatus(stageId).label;
    // 철회는 학생이 상세 화면에서, 철회기간일 때만
    const canShowWithdraw = ReviewScenario.isWithinPeriod(stage.withdrawalPeriod);

    const modalHtml = `
        <!-- 모달 오버레이 -->
        <div id="detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeDetailModal(event)">
            <!-- 모달 컨테이너 -->
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <!-- 모달 헤더 -->
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-bold text-gray-900">논문 신청 상세</h3>
                    <button onclick="closeDetailModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- 모달 바디 -->
                <div class="overflow-y-auto p-6 space-y-4" style="max-height: calc(90vh - 180px);">
                    <div class="border-b pb-4">
                        <label class="block text-sm font-medium text-gray-500 mb-1">신청 단계</label>
                        <p class="text-base text-gray-900">${stage ? stage.name : '-'}</p>
                    </div>

                    <div class="border-b pb-4">
                        <label class="block text-sm font-medium text-gray-500 mb-1">논문 제목 (한글)</label>
                        <p class="text-base text-gray-900">${application.thesisTitle}</p>
                    </div>

                    <div class="border-b pb-4">
                        <label class="block text-sm font-medium text-gray-500 mb-1">논문 제목 (외국어)</label>
                        <p class="text-base text-gray-900">${application.thesisTitleEn}</p>
                    </div>

                    <div class="border-b pb-4">
                        <label class="block text-sm font-medium text-gray-500 mb-1">신청일</label>
                        <p class="text-base text-gray-900">${application.appliedAt}</p>
                    </div>

                    <div class="border-b pb-4">
                        <label class="block text-sm font-medium text-gray-500 mb-1">신청 상태</label>
                        <p class="text-base text-gray-900">${statusText}</p>
                    </div>
                </div>

                <!-- 모달 푸터 -->
                <div class="flex justify-between items-center gap-3 p-6 border-t bg-gray-50">
                    ${canShowWithdraw ? `
                    <button type="button" onclick="cancelApplication('${stageId}')"
                            class="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm">
                        논문 신청 철회
                    </button>` : '<span></span>'}
                    <button type="button" onclick="closeDetailModal()"
                            class="px-6 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold text-sm">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * 신청 철회 (상세 모달에서) — 요구서 JXLB-2 조건·문구
 */
function cancelApplication(stageId) {
    // 심사가 진행 중(평가한 심사위원 1명 이상)이거나 결과가 확정되면 철회 불가
    const check = ReviewScenario.checkWithdraw(stageId);
    if (!check.ok) {
        alert(check.reason);
        return;
    }

    if (confirm('해당 단계에서 제출한 자료와 내역은 모두 초기화됩니다(합격여부가 결정된 단계 제외) 그래도 철회하시겠습니까?')) {
        // 신청과 해당 신청의 제출 자료 삭제
        ReviewScenario.withdraw(stageId);

        alert('논문 신청 내역이 초기화되었습니다.');

        closeDetailModal();
        renderApplicationListScreen();
    }
}

/**
 * 상세 모달 닫기
 */
function closeDetailModal(event) {
    // 오버레이 클릭 시에만 event가 전달됨
    if (event && event.target.id !== 'detail-modal') {
        return;
    }

    const modal = document.getElementById('detail-modal');
    if (modal) {
        modal.remove();
    }
}

// 전역으로 노출
window.initThesisApplication = initThesisApplication;
window.openApplicationModal = openApplicationModal;
window.closeApplicationModal = closeApplicationModal;
window.submitApplication = submitApplication;
window.viewApplicationDetail = viewApplicationDetail;
window.cancelApplication = cancelApplication;
window.closeDetailModal = closeDetailModal;

console.log('✅ thesis-application.js 로드 완료');
