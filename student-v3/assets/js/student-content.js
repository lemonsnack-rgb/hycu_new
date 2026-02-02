// ==================== 학생용 콘텐츠 화면 (연구윤리, 논문일정, 논문지도절차) ====================
// 교수용 화면과 동일한 목록형 UI (학과 드롭다운은 disabled 처리)

// 전역 변수
const studentContentState = {
    ethics: { departmentFilter: null, titleFilter: '', currentMode: 'list', currentId: null },
    schedule: { departmentFilter: null, titleFilter: '', currentMode: 'list', currentId: null },
    process: { departmentFilter: null, titleFilter: '', currentMode: 'list', currentId: null }
};

// 콘텐츠 타입별 제목 매핑
const studentContentTypeLabels = {
    ethics: '연구윤리',
    schedule: '논문일정',
    process: '논문지도절차'
};

// 콘텐츠 타입별 컨테이너 ID 매핑
const studentContentContainerIds = {
    ethics: 'ethics-screen',
    schedule: 'schedule-screen',
    process: 'process-screen'
};

/**
 * 연구윤리 화면 초기화
 */
function initStudentEthics() {
    console.log('🎯 학생용 연구윤리 화면 초기화');

    // 학생 소속 학과로 고정
    if (studentContentState.ethics.departmentFilter === null) {
        studentContentState.ethics.departmentFilter = getStudentDepartment();
        console.log(`📍 연구윤리 학과 필터 설정: ${studentContentState.ethics.departmentFilter}`);
    }

    renderStudentContentListView('ethics');
}

/**
 * 논문일정 화면 초기화
 */
function initStudentSchedule() {
    console.log('🎯 학생용 논문일정 화면 초기화');

    // 학생 소속 학과로 고정
    if (studentContentState.schedule.departmentFilter === null) {
        studentContentState.schedule.departmentFilter = getStudentDepartment();
        console.log(`📍 논문일정 학과 필터 설정: ${studentContentState.schedule.departmentFilter}`);
    }

    renderStudentContentListView('schedule');
}

/**
 * 논문지도절차 화면 초기화
 */
function initStudentProcedure() {
    console.log('🎯 학생용 논문지도절차 화면 초기화');

    // 학생 소속 학과로 고정
    if (studentContentState.process.departmentFilter === null) {
        studentContentState.process.departmentFilter = getStudentDepartment();
        console.log(`📍 논문지도절차 학과 필터 설정: ${studentContentState.process.departmentFilter}`);
    }

    renderStudentContentListView('process');
}

/**
 * 목록 화면 렌더링
 */
function renderStudentContentListView(contentType) {
    const containerId = studentContentContainerIds[contentType];
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`❌ ${containerId} 컨테이너를 찾을 수 없습니다.`);
        return;
    }

    const state = studentContentState[contentType];
    state.currentMode = 'list';

    // 콘텐츠 데이터 가져오기
    const allContents = getContentList(contentType);

    // 학과 필터링 적용 (학생 소속 학과)
    let filteredContents = filterStudentContentsByDepartment(allContents, state.departmentFilter);

    // 제목 검색 필터 적용
    if (state.titleFilter) {
        filteredContents = filteredContents.filter(content =>
            content.title.toLowerCase().includes(state.titleFilter.toLowerCase())
        );
    }

    // HTML 생성 (list-view와 detail-view 모두 포함)
    container.innerHTML = `
        <!-- 목록 화면 -->
        <div id="student-${contentType}-list-view">
            <!-- 검색 필터 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                <div class="flex items-center gap-3">
                    <!-- 학과/전공 (비활성화) -->
                    <div class="flex items-center gap-2 flex-1">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                        <select id="filter-student-${contentType}-department"
                                disabled
                                class="flex-1 px-2 border border-gray-300 rounded text-xs bg-gray-100 cursor-not-allowed"
                                style="height: 34px;">
                            <option value="${state.departmentFilter}" selected>${state.departmentFilter}</option>
                        </select>
                    </div>
                    <!-- 제목 -->
                    <div class="flex items-center gap-2 flex-1">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">제목</label>
                        <input type="text" id="filter-student-${contentType}-title"
                               placeholder="제목"
                               value="${state.titleFilter}"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                               style="height: 34px;"
                               onkeypress="if(event.key === 'Enter') filterStudentContentList('${contentType}')">
                    </div>
                    <!-- 조회 버튼 -->
                    <button onclick="filterStudentContentList('${contentType}')"
                            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                        <i class="fas fa-search mr-1"></i>조회
                    </button>
                </div>
            </div>

            <!-- 콘텐츠 테이블 -->
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">${studentContentTypeLabels[contentType]} 목록</h3>
                        <span id="student-${contentType}-count-display" class="table-count">(총 ${filteredContents.length}건)</span>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th style="width: 60px;">순번</th>
                                <th>제목</th>
                                <th style="width: 150px;">대상학과</th>
                                <th style="width: 150px;">최근 수정일</th>
                                <th style="width: 120px;">작성자</th>
                            </tr>
                        </thead>
                        <tbody id="student-${contentType}-table-body">
                            ${renderStudentContentTableRows(contentType, filteredContents)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 상세 화면 (초기에는 숨김) -->
        <div id="student-${contentType}-detail-view" style="display: none;">
            <!-- 동적으로 생성됨 -->
        </div>
    `;
}

/**
 * 테이블 행 렌더링
 */
function renderStudentContentTableRows(contentType, contents) {
    if (contents.length === 0) {
        return `
            <tr>
                <td colspan="5" class="text-center py-12">
                    <div class="text-6xl mb-4">📄</div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">등록된 게시물이 없습니다</h3>
                    <p class="text-gray-500">게시물이 등록되면 이곳에 표시됩니다.</p>
                </td>
            </tr>
        `;
    }

    return contents.map((content, index) => {
        const deptDisplay = getStudentDepartmentDisplay(content);

        return `
            <tr onclick="showStudentContentDetail('${contentType}', '${content.id}')" style="cursor: pointer;" class="hover:bg-gray-50">
                <td>${index + 1}</td>
                <td class="text-left font-medium">${content.title || '-'}</td>
                <td>${deptDisplay}</td>
                <td>${content.createdAt || content.lastModified || '-'}</td>
                <td>${content.author || content.modifiedBy || '-'}</td>
            </tr>
        `;
    }).join('');
}

/**
 * 학과 표시 생성
 */
function getStudentDepartmentDisplay(content) {
    if (content.visibility === 'all' || content.department === 'all') {
        return '<span class="text-gray-600">전체 공개</span>';
    }

    if (content.visibility === 'specific' && content.targetDepartments) {
        if (content.targetDepartments.length === 1) {
            return `<span class="text-gray-600">${content.targetDepartments[0]}</span>`;
        } else {
            return `<span class="text-gray-600">${content.targetDepartments[0]} 외 ${content.targetDepartments.length - 1}개</span>`;
        }
    }

    // 레거시: department 필드 (단일 학과)
    if (content.department && content.department !== 'all') {
        return `<span class="text-gray-600">${content.department}</span>`;
    }

    return '<span class="text-gray-600">전체 공개</span>';
}

/**
 * 학과 필터링
 */
function filterStudentContentsByDepartment(contents, department) {
    return contents.filter(content => {
        return shouldShowContentForStudent(content, department);
    });
}

/**
 * 검색 필터링 (제목만)
 */
function filterStudentContentList(contentType) {
    const state = studentContentState[contentType];

    // 학과 필터는 고정 (변경 불가)

    // 제목 필터 값 가져오기
    const titleInput = document.getElementById(`filter-student-${contentType}-title`);
    if (titleInput) {
        state.titleFilter = titleInput.value.trim();
    }

    console.log(`🔍 검색 조건 (${contentType}) - 학과: ${state.departmentFilter} (고정), 제목: ${state.titleFilter}`);
    renderStudentContentListView(contentType);
}

/**
 * 콘텐츠 상세보기 (페이지 전환)
 */
function showStudentContentDetail(contentType, contentId) {
    console.log(`📄 콘텐츠 상세보기 (${contentType}): ${contentId}`);

    const content = getContentById(contentType, contentId);

    if (!content) {
        alert('콘텐츠를 찾을 수 없습니다.');
        return;
    }

    const state = studentContentState[contentType];
    state.currentId = contentId;
    state.currentMode = 'detail';

    // 화면 전환
    document.getElementById(`student-${contentType}-list-view`).style.display = 'none';
    const detailView = document.getElementById(`student-${contentType}-detail-view`);
    detailView.style.display = 'block';

    // 대상학과 표시
    const deptDisplay = getStudentDepartmentDisplay(content);

    // 상세 내용 렌더링
    detailView.innerHTML = `
        <div class="table-container">
            <!-- 헤더: 뒤로가기 버튼 -->
            <div class="table-header" style="margin-bottom: 1.5rem;">
                <div class="table-header-left">
                    <button onclick="backToStudentContentList('${contentType}')"
                            style="display: flex; align-items: center; gap: 0.5rem; color: #6A0028; background: none; border: none; cursor: pointer; font-size: 0.875rem; font-weight: 500;">
                        <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>목록으로 돌아가기</span>
                    </button>
                </div>
            </div>

            <!-- 본문 카드 -->
            <div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
                    <!-- 제목 -->
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">${content.title}</h2>

                    <!-- 메타 정보 -->
                    <div class="flex gap-4 text-sm text-gray-600 pb-4 border-b mb-6">
                        <span><i class="fas fa-user mr-1"></i> ${content.author || content.modifiedBy || '-'}</span>
                        <span><i class="fas fa-calendar mr-1"></i> ${content.createdAt || content.lastModified || '-'}</span>
                        <span><i class="fas fa-building mr-1"></i> ${deptDisplay}</span>
                    </div>

                    <!-- 본문 -->
                    <div class="prose prose-sm max-w-none">
                        <div style="line-height: 1.8; font-size: 14px; color: #333;">
                            ${content.content || content.body || '<p class="text-gray-500">내용이 없습니다.</p>'}
                        </div>
                    </div>
            </div>
        </div>
    `;
}

/**
 * 목록으로 돌아가기
 */
function backToStudentContentList(contentType) {
    document.getElementById(`student-${contentType}-list-view`).style.display = 'block';
    document.getElementById(`student-${contentType}-detail-view`).style.display = 'none';

    const state = studentContentState[contentType];
    state.currentId = null;
    state.currentMode = 'list';

    // 목록 재렌더링 (필터 상태 유지)
    renderStudentContentListView(contentType);
}

// Export
window.initStudentEthics = initStudentEthics;
window.initStudentSchedule = initStudentSchedule;
window.initStudentProcedure = initStudentProcedure;
window.renderStudentContentListView = renderStudentContentListView;
window.filterStudentContentList = filterStudentContentList;
window.showStudentContentDetail = showStudentContentDetail;
window.backToStudentContentList = backToStudentContentList;

console.log('✅ 학생용 콘텐츠 모듈 로드 완료');
