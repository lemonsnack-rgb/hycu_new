// ==================== 교수용 콘텐츠 화면 (연구윤리, 논문일정, 논문지도절차) ====================
// 관리자 화면과 동일한 목록형 UI + 학과 드롭다운 필터

// 전역 변수
const professorContentState = {
    ethics: { departmentFilter: null, titleFilter: '', currentMode: 'list', currentId: null },
    schedule: { departmentFilter: null, titleFilter: '', currentMode: 'list', currentId: null },
    process: { departmentFilter: null, titleFilter: '', currentMode: 'list', currentId: null }
};

// 콘텐츠 타입별 제목 매핑
const contentTypeLabels = {
    ethics: '연구윤리',
    schedule: '논문일정',
    process: '논문지도절차'
};

// 콘텐츠 타입별 컨테이너 ID 매핑
const contentContainerIds = {
    ethics: 'ethics-screen',
    schedule: 'schedule-screen',
    process: 'process-screen'
};

/**
 * 연구윤리 화면 초기화
 */
function initProfessorEthics() {
    console.log('🎯 교수용 연구윤리 화면 초기화');

    // 초기 학과 필터 설정
    if (professorContentState.ethics.departmentFilter === null) {
        professorContentState.ethics.departmentFilter = getProfessorDefaultDepartment();
        console.log(`📍 연구윤리 초기 학과 필터 설정: ${professorContentState.ethics.departmentFilter}`);
    }

    renderProfessorContentListView('ethics');
}

/**
 * 논문일정 화면 초기화
 */
function initProfessorSchedule() {
    console.log('🎯 교수용 논문일정 화면 초기화');

    // 초기 학과 필터 설정
    if (professorContentState.schedule.departmentFilter === null) {
        professorContentState.schedule.departmentFilter = getProfessorDefaultDepartment();
        console.log(`📍 논문일정 초기 학과 필터 설정: ${professorContentState.schedule.departmentFilter}`);
    }

    renderProfessorContentListView('schedule');
}

/**
 * 논문지도절차 화면 초기화
 */
function initProfessorProcedure() {
    console.log('🎯 교수용 논문지도절차 화면 초기화');

    // 초기 학과 필터 설정
    if (professorContentState.process.departmentFilter === null) {
        professorContentState.process.departmentFilter = getProfessorDefaultDepartment();
        console.log(`📍 논문지도절차 초기 학과 필터 설정: ${professorContentState.process.departmentFilter}`);
    }

    renderProfessorContentListView('process');
}

/**
 * 목록 화면 렌더링
 */
function renderProfessorContentListView(contentType) {
    const containerId = contentContainerIds[contentType];
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`❌ ${containerId} 컨테이너를 찾을 수 없습니다.`);
        return;
    }

    const state = professorContentState[contentType];
    state.currentMode = 'list';

    // 콘텐츠 데이터 가져오기
    const allContents = getContentList(contentType);

    // 학과 필터링 적용
    let filteredContents = filterContentsByDepartment(allContents, state.departmentFilter);

    // 제목 검색 필터 적용
    if (state.titleFilter) {
        filteredContents = filteredContents.filter(content =>
            content.title.toLowerCase().includes(state.titleFilter.toLowerCase())
        );
    }

    // 학과 드롭다운 생성
    const departments = getProfessorDepartments();
    const departmentOptions = departments.length > 0 ? `
        <option value="all" ${state.departmentFilter === 'all' ? 'selected' : ''}>전체보기</option>
        ${departments.map(dept => `
            <option value="${dept}" ${state.departmentFilter === dept ? 'selected' : ''}>${dept}</option>
        `).join('')}
    ` : '<option value="all">전체보기</option>';

    // HTML 생성 (list-view와 detail-view 모두 포함)
    container.innerHTML = `
        <!-- 목록 화면 -->
        <div id="professor-${contentType}-list-view">
            <!-- 검색 필터 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                <div class="flex items-center gap-3">
                    <!-- 학과/전공 -->
                    <div class="flex items-center gap-2 flex-1">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                        <select id="filter-professor-${contentType}-department"
                                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                style="height: 34px;">
                            ${departmentOptions}
                        </select>
                    </div>
                    <!-- 제목 -->
                    <div class="flex items-center gap-2 flex-1">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">제목</label>
                        <input type="text" id="filter-professor-${contentType}-title"
                               placeholder="제목"
                               value="${state.titleFilter}"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                               style="height: 34px;"
                               onkeypress="if(event.key === 'Enter') filterProfessorContentList('${contentType}')">
                    </div>
                    <!-- 조회 버튼 -->
                    <button onclick="filterProfessorContentList('${contentType}')"
                            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                        <i class="fas fa-search mr-1"></i>조회
                    </button>
                </div>
            </div>

            <!-- 콘텐츠 테이블 -->
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">${contentTypeLabels[contentType]} 목록</h3>
                        <span id="professor-${contentType}-count-display" class="table-count">(총 ${filteredContents.length}건)</span>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th style="width: 60px;">순번</th>
                                <th>제목</th>
                                <th style="width: 150px;">대상학과</th>
                                <th style="width: 150px;">작성일</th>
                                <th style="width: 120px;">작성자</th>
                            </tr>
                        </thead>
                        <tbody id="professor-${contentType}-table-body">
                            ${renderProfessorContentTableRows(contentType, filteredContents)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 상세 화면 (초기에는 숨김) -->
        <div id="professor-${contentType}-detail-view" style="display: none;">
            <!-- 동적으로 생성됨 -->
        </div>
    `;
}

/**
 * 테이블 행 렌더링
 */
function renderProfessorContentTableRows(contentType, contents) {
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
        const deptDisplay = getDepartmentDisplay(content);

        return `
            <tr onclick="showProfessorContentDetail('${contentType}', '${content.id}')" style="cursor: pointer;" class="hover:bg-gray-50">
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
function getDepartmentDisplay(content) {
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
function filterContentsByDepartment(contents, department) {
    if (department === 'all') {
        return contents;
    }

    return contents.filter(content => {
        return shouldShowContentForDepartment(content, department);
    });
}

/**
 * 검색 필터링 (학과 + 제목)
 */
function filterProfessorContentList(contentType) {
    const state = professorContentState[contentType];

    // 학과 필터 값 가져오기
    const departmentSelect = document.getElementById(`filter-professor-${contentType}-department`);
    if (departmentSelect) {
        state.departmentFilter = departmentSelect.value;
    }

    // 제목 필터 값 가져오기
    const titleInput = document.getElementById(`filter-professor-${contentType}-title`);
    if (titleInput) {
        state.titleFilter = titleInput.value.trim();
    }

    console.log(`🔍 검색 조건 (${contentType}) - 학과: ${state.departmentFilter}, 제목: ${state.titleFilter}`);
    renderProfessorContentListView(contentType);
}

/**
 * 콘텐츠 상세보기 (페이지 전환)
 */
function showProfessorContentDetail(contentType, contentId) {
    console.log(`📄 콘텐츠 상세보기 (${contentType}): ${contentId}`);

    const content = getContentById(contentType, contentId);

    if (!content) {
        alert('콘텐츠를 찾을 수 없습니다.');
        return;
    }

    const state = professorContentState[contentType];
    state.currentId = contentId;
    state.currentMode = 'detail';

    // 화면 전환
    document.getElementById(`professor-${contentType}-list-view`).style.display = 'none';
    const detailView = document.getElementById(`professor-${contentType}-detail-view`);
    detailView.style.display = 'block';

    // 대상학과 표시
    const deptDisplay = getDepartmentDisplay(content);

    // 상세 내용 렌더링
    detailView.innerHTML = `
        <div class="table-container">
            <!-- 헤더: 뒤로가기 버튼 -->
            <div class="table-header" style="margin-bottom: 1.5rem;">
                <div class="table-header-left">
                    <button onclick="backToProfessorContentList('${contentType}')"
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
function backToProfessorContentList(contentType) {
    document.getElementById(`professor-${contentType}-list-view`).style.display = 'block';
    document.getElementById(`professor-${contentType}-detail-view`).style.display = 'none';

    const state = professorContentState[contentType];
    state.currentId = null;
    state.currentMode = 'list';

    // 목록 재렌더링 (필터 상태 유지)
    renderProfessorContentListView(contentType);
}

// Export
window.initProfessorEthics = initProfessorEthics;
window.initProfessorSchedule = initProfessorSchedule;
window.initProfessorProcedure = initProfessorProcedure;
window.renderProfessorContentListView = renderProfessorContentListView;
window.filterProfessorContentList = filterProfessorContentList;
window.showProfessorContentDetail = showProfessorContentDetail;
window.backToProfessorContentList = backToProfessorContentList;

// 교수용 콘텐츠 모듈 로드 완료
