// ==================== 교수용 공지사항 화면 ====================
// 관리자 화면과 동일한 목록형 UI + 학과 드롭다운 필터

// 전역 변수
let currentDepartmentFilter = null; // null이면 초기화 시 기본값 설정
let currentNoticeFilters = {
    title: ''
};
let currentNoticeId = null;
let currentNoticeMode = 'list'; // 'list' or 'detail'

/**
 * 공지사항 목록 초기화
 */
function initProfessorNotice() {
    console.log('🎯 교수용 공지사항 화면 초기화');

    // 초기 학과 필터 설정 (교수 소속 학과 기본값)
    if (currentDepartmentFilter === null) {
        currentDepartmentFilter = getProfessorDefaultDepartment();
        console.log(`📍 초기 학과 필터 설정: ${currentDepartmentFilter}`);
    }

    renderProfessorNoticeListView();
}

/**
 * 목록 화면 렌더링
 */
function renderProfessorNoticeListView() {
    const container = document.getElementById('notice-screen');

    if (!container) {
        console.error('❌ notice-screen 컨테이너를 찾을 수 없습니다.');
        return;
    }

    currentNoticeMode = 'list';

    // 전체 공지사항 데이터 가져오기
    const allNotices = getAllNotices();

    // 학과 필터링 적용
    let filteredNotices = filterNoticesByDepartment(allNotices, currentDepartmentFilter);

    // 제목 검색 필터 적용
    if (currentNoticeFilters.title) {
        filteredNotices = filteredNotices.filter(notice =>
            notice.title.toLowerCase().includes(currentNoticeFilters.title.toLowerCase())
        );
    }

    // 학과 드롭다운 생성
    const departments = getProfessorDepartments();
    const departmentOptions = departments.length > 0 ? `
        <option value="all" ${currentDepartmentFilter === 'all' ? 'selected' : ''}>전체보기</option>
        ${departments.map(dept => `
            <option value="${dept}" ${currentDepartmentFilter === dept ? 'selected' : ''}>${dept}</option>
        `).join('')}
    ` : '<option value="all">전체보기</option>';

    // HTML 생성 (list-view와 detail-view 모두 포함)
    container.innerHTML = `
        <!-- 목록 화면 -->
        <div id="professor-notice-list-view">
            <!-- 검색 필터 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                <div class="flex items-center gap-3">
                    <!-- 학과/전공 -->
                    <div class="flex items-center gap-2 flex-1">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                        <select id="filter-professor-notice-department"
                                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                style="height: 34px;">
                            ${departmentOptions}
                        </select>
                    </div>
                    <!-- 제목 -->
                    <div class="flex items-center gap-2 flex-1">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">제목</label>
                        <input type="text" id="filter-professor-notice-title"
                               placeholder="제목"
                               value="${currentNoticeFilters.title}"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                               style="height: 34px;"
                               onkeypress="if(event.key === 'Enter') filterProfessorNoticeList()">
                    </div>
                    <!-- 조회 버튼 -->
                    <button onclick="filterProfessorNoticeList()"
                            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                        <i class="fas fa-search mr-1"></i>조회
                    </button>
                </div>
            </div>

            <!-- 공지사항 테이블 -->
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">공지사항 목록</h3>
                        <span id="professor-notice-count-display" class="table-count">(총 ${filteredNotices.length}건)</span>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th style="width: 60px;">순번</th>
                                <th>제목</th>
                                <th style="width: 100px;">첨부파일</th>
                                <th style="width: 150px;">작성일</th>
                                <th style="width: 120px;">작성자</th>
                            </tr>
                        </thead>
                        <tbody id="professor-notice-table-body">
                            ${renderProfessorNoticeTableRows(filteredNotices)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 상세 화면 (초기에는 숨김) -->
        <div id="professor-notice-detail-view" style="display: none;">
            <!-- 동적으로 생성됨 -->
        </div>
    `;
}

/**
 * 테이블 행 렌더링
 */
function renderProfessorNoticeTableRows(notices) {
    if (notices.length === 0) {
        return `
            <tr>
                <td colspan="5" class="text-center py-12">
                    <div class="text-6xl mb-4">📢</div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">등록된 공지사항이 없습니다</h3>
                    <p class="text-gray-500">공지사항이 등록되면 이곳에 표시됩니다.</p>
                </td>
            </tr>
        `;
    }

    return notices.map((notice, index) => {
        const attachmentIcon = notice.hasAttachment && notice.attachments && notice.attachments.length > 0
            ? '<i class="fas fa-paperclip text-[#6A0028]"></i>'
            : '<span class="text-gray-400">-</span>';

        return `
            <tr onclick="showProfessorNoticeDetail('${notice.id}')" style="cursor: pointer;" class="hover:bg-gray-50">
                <td>${index + 1}</td>
                <td class="text-left font-medium">${notice.title}</td>
                <td>${attachmentIcon}</td>
                <td>${notice.createdAt}</td>
                <td>${notice.author}</td>
            </tr>
        `;
    }).join('');
}

/**
 * 학과 필터링
 */
function filterNoticesByDepartment(notices, department) {
    if (department === 'all') {
        return notices;
    }

    return notices.filter(notice => {
        return shouldShowContentForDepartment(notice, department);
    });
}

/**
 * 검색 필터링 (학과 + 제목)
 */
function filterProfessorNoticeList() {
    // 학과 필터 값 가져오기
    const departmentSelect = document.getElementById('filter-professor-notice-department');
    if (departmentSelect) {
        currentDepartmentFilter = departmentSelect.value;
    }

    // 제목 필터 값 가져오기
    const titleInput = document.getElementById('filter-professor-notice-title');
    if (titleInput) {
        currentNoticeFilters.title = titleInput.value.trim();
    }

    console.log(`🔍 검색 조건 - 학과: ${currentDepartmentFilter}, 제목: ${currentNoticeFilters.title}`);
    renderProfessorNoticeListView();
}

/**
 * 공지사항 상세보기 (페이지 전환)
 */
function showProfessorNoticeDetail(noticeId) {
    console.log(`📄 공지사항 상세보기: ${noticeId}`);

    const allNotices = getAllNotices();
    const notice = allNotices.find(n => n.id === noticeId);

    if (!notice) {
        alert('공지사항을 찾을 수 없습니다.');
        return;
    }

    currentNoticeId = noticeId;
    currentNoticeMode = 'detail';

    // 조회수 증가
    incrementViewCount(noticeId);

    // 첨부파일 HTML 생성
    let attachmentsHTML = '';
    if (notice.attachments && notice.attachments.length > 0) {
        attachmentsHTML = `
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">첨부파일</h4>
                <div class="space-y-2">
                    ${notice.attachments.map(file => `
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-file text-gray-600"></i>
                            <a href="${file.url}" class="text-blue-600 hover:underline">${file.name}</a>
                            <span class="text-gray-500 text-xs">(${formatFileSize(file.size)})</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 화면 전환
    document.getElementById('professor-notice-list-view').style.display = 'none';
    const detailView = document.getElementById('professor-notice-detail-view');
    detailView.style.display = 'block';

    // 상세 내용 렌더링
    detailView.innerHTML = `
        <div class="table-container">
            <!-- 헤더: 뒤로가기 버튼 -->
            <div class="table-header" style="margin-bottom: 1.5rem;">
                <div class="table-header-left">
                    <button onclick="backToProfessorNoticeList()"
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
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">${notice.title}</h2>

                    <!-- 메타 정보 -->
                    <div class="flex gap-4 text-sm text-gray-600 pb-4 border-b mb-6">
                        <span><i class="fas fa-user mr-1"></i> ${notice.author}</span>
                        <span><i class="fas fa-calendar mr-1"></i> ${notice.createdAt}</span>
                    </div>

                    <!-- 본문 -->
                    <div class="prose prose-sm max-w-none">
                        <div style="line-height: 1.8; font-size: 14px; color: #333;">
                            ${notice.content}
                        </div>
                    </div>

                    <!-- 첨부파일 -->
                    ${attachmentsHTML}
            </div>
        </div>
    `;
}

/**
 * 목록으로 돌아가기
 */
function backToProfessorNoticeList() {
    document.getElementById('professor-notice-list-view').style.display = 'block';
    document.getElementById('professor-notice-detail-view').style.display = 'none';
    currentNoticeId = null;
    currentNoticeMode = 'list';
    // 목록 재렌더링 (필터 상태 유지)
    renderProfessorNoticeListView();
}

// Export
window.initProfessorNotice = initProfessorNotice;
window.renderProfessorNoticeListView = renderProfessorNoticeListView;
window.filterProfessorNoticeList = filterProfessorNoticeList;
window.showProfessorNoticeDetail = showProfessorNoticeDetail;
window.backToProfessorNoticeList = backToProfessorNoticeList;

console.log('✅ 교수용 공지사항 모듈 로드 완료');
