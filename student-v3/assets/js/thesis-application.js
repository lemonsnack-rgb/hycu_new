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

    // processPhase가 'application'인 단계 유형 필터링
    const applicationStages = window.mockStepTypes.filter(
        stage => stage.processPhase === 'application'
    );

    // 현재 학생의 신청 내역
    const studentApplications = window.mockThesisApplications.filter(
        app => app.studentId === currentStudent.id
    );

    // 각 단계별로 신청 정보와 일정 정보를 매핑
    const stageData = applicationStages.map(stage => {
        const application = studentApplications.find(app => app.stageTypeId === stage.id);
        const schedule = window.mockApplicationSchedules.find(sch => sch.stageTypeId === stage.id);

        return {
            stage,
            application,
            schedule
        };
    });

    let html = `
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사단계</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 200px;">신청기간</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">신청상태</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">관리</th>
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
    const { stage, application, schedule } = data;

    // 신청 기간
    let periodText = '-';
    if (schedule) {
        periodText = `${schedule.startDate} ~ ${schedule.endDate}`;
    }

    // 신청 상태
    let statusHtml = '<span class="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">미신청</span>';
    let actionButton = `<button onclick="openApplicationModal('${stage.id}')"
                                class="text-[#6A0028] hover:text-[#6A0028] text-xs font-medium px-3 py-1 border border-[#F8BBD9] rounded hover:bg-[#FCE4EC]">
                            신청
                        </button>`;

    if (application) {
        if (application.status === 'submitted') {
            statusHtml = '<span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">신청완료</span>';
        } else if (application.status === 'approved') {
            statusHtml = '<span class="px-2 py-1 rounded text-xs bg-green-100 text-green-800">승인</span>';
        } else if (application.status === 'rejected') {
            statusHtml = '<span class="px-2 py-1 rounded text-xs bg-red-100 text-red-800">반려</span>';
        }

        actionButton = `<button onclick="viewApplicationDetail('${application.id}')"
                                class="text-[#6A0028] hover:text-[#6A0028] text-xs font-medium px-3 py-1 border border-[#F8BBD9] rounded hover:bg-[#FCE4EC]">
                            상세
                        </button>`;
    }

    return `
        <tr class="hover:bg-blue-50">
            <td class="py-3 px-4 text-sm text-gray-600 text-center">${index + 1}</td>
            <td class="py-3 px-4 text-sm font-medium text-gray-800">${stage.name}</td>
            <td class="py-3 px-4 text-sm text-gray-600 text-center">${periodText}</td>
            <td class="py-3 px-4 text-center">${statusHtml}</td>
            <td class="py-3 px-4 text-center">${actionButton}</td>
        </tr>
    `;
}

/**
 * 신청 모달 열기
 */
function openApplicationModal(stageTypeId) {
    const stage = window.mockStepTypes.find(s => s.id === stageTypeId);
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
                            <input type="text" id="thesis-title" required
                                   placeholder="논문 제목을 입력하세요"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 논문 제목 (외국어) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                논문 제목 (외국어) <span class="text-red-600">*</span>
                            </label>
                            <input type="text" id="thesis-title-en" required
                                   placeholder="Thesis Title in English"
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

    const title = document.getElementById('thesis-title').value.trim();
    const titleEn = document.getElementById('thesis-title-en').value.trim();

    if (!title || !titleEn) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }

    if (confirm('논문을 신청하시겠습니까?')) {
        // 새로운 신청 ID 생성
        const newId = 'APP' + String(window.mockThesisApplications.length + 1).padStart(3, '0');

        const newApplication = {
            id: newId,
            studentId: currentStudent.id,
            studentName: currentStudent.name,
            stageTypeId: stageTypeId,
            thesisTitle: title,
            thesisTitleEn: titleEn,
            applicationDate: new Date().toISOString().split('T')[0],
            status: 'submitted',
            reviewComment: null,
            approvedDate: null,
            createdDate: new Date().toISOString().split('T')[0]
        };

        window.mockThesisApplications.push(newApplication);

        console.log('논문 신청 완료:', newApplication);
        alert('논문 신청이 완료되었습니다.');

        closeApplicationModal();
        renderApplicationListScreen();
    }
}

/**
 * 신청 상세 보기
 */
function viewApplicationDetail(applicationId) {
    const application = window.mockThesisApplications.find(app => app.id === applicationId);
    if (!application) return;

    const stage = window.mockStepTypes.find(s => s.id === application.stageTypeId);

    let statusText = '미신청';
    let statusClass = 'bg-gray-100 text-gray-600';
    if (application.status === 'submitted') {
        statusText = '신청완료';
        statusClass = 'bg-blue-100 text-blue-800';
    } else if (application.status === 'approved') {
        statusText = '승인';
        statusClass = 'bg-green-100 text-green-800';
    } else if (application.status === 'rejected') {
        statusText = '반려';
        statusClass = 'bg-red-100 text-red-800';
    }

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
                        <p class="text-base text-gray-900">${application.applicationDate}</p>
                    </div>

                    <div class="border-b pb-4">
                        <label class="block text-sm font-medium text-gray-500 mb-1">신청 상태</label>
                        <span class="px-3 py-1 rounded text-sm ${statusClass}">${statusText}</span>
                    </div>

                    ${application.reviewComment ? `
                        <div class="border-b pb-4">
                            <label class="block text-sm font-medium text-gray-500 mb-1">검토 의견</label>
                            <p class="text-base text-gray-900">${application.reviewComment}</p>
                        </div>
                    ` : ''}

                    ${application.approvedDate ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-500 mb-1">승인일</label>
                            <p class="text-base text-gray-900">${application.approvedDate}</p>
                        </div>
                    ` : ''}
                </div>

                <!-- 모달 푸터 -->
                <div class="flex justify-end items-center gap-3 p-6 border-t bg-gray-50">
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
window.closeDetailModal = closeDetailModal;

console.log('✅ thesis-application.js 로드 완료');
