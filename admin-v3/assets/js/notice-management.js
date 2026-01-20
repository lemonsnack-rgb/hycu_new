// ==================== 공지사항 관리 메인 로직 ====================

(function() {
    'use strict';

// 전역 변수
let currentFilters = {
    department: 'all',
    title: ''
};

let currentNoticeId = null; // 현재 상세 보기/수정 중인 공지사항 ID
let currentMode = 'list'; // list, detail, create, edit

/**
 * 목록 화면 렌더링
 */
function renderNoticeList() {
    console.log('📋 renderNoticeList 호출됨');
    currentMode = 'list';
    filterNoticeList();
}

/**
 * 필터링 및 테이블 렌더링
 */
function filterNoticeList() {
    console.log('🔍 filterNoticeList 호출됨');

    // 필터 값 수집
    currentFilters.department = document.getElementById('filter-notice-department')?.value || 'all';
    currentFilters.title = document.getElementById('filter-notice-title')?.value.trim() || '';

    console.log('📊 현재 필터:', currentFilters);

    // 데이터 조회
    let data = getAllNotices();
    console.log('📦 전체 데이터 개수:', data.length);

    // 학과 필터 적용
    if (currentFilters.department !== 'all') {
        data = data.filter(item => {
            if (item.visibility === 'all') return true;
            if (item.visibility === 'specific') {
                if (!item.targetDepartments || item.targetDepartments.length === 0) return false;
                if (item.targetDepartments.includes('all')) return true;
                return item.targetDepartments.includes(currentFilters.department);
            }
            return true;
        });
    }

    // 제목 필터 적용
    if (currentFilters.title) {
        data = data.filter(item =>
            item.title.toLowerCase().includes(currentFilters.title.toLowerCase())
        );
    }

    console.log('✅ 필터링 후 데이터 개수:', data.length);
    renderNoticeTable(data);
}

/**
 * 테이블 렌더링
 */
function renderNoticeTable(data) {
    console.log('📋 테이블 렌더링 시작, 데이터:', data.length, '건');

    // DOM 요소 체크
    const tbody = document.getElementById('notice-table-body');
    const countElement = document.getElementById('notice-count-display');

    console.log('🔍 notice-table-body element:', tbody);
    console.log('🔍 notice-table-body exists:', !!tbody);
    console.log('🔍 notice-count-display element:', countElement);
    console.log('🔍 notice-count-display exists:', !!countElement);

    if (!tbody) {
        console.error('❌ notice-table-body 요소를 찾을 수 없습니다');
        console.log('🔍 전체 DOM 상태:');
        console.log('  - notice-list-view:', document.getElementById('notice-list-view'));
        console.log('  - notice-detail-view:', document.getElementById('notice-detail-view'));
        console.log('  - notice-management-content:', document.getElementById('notice-management-content'));
        return;
    }

    // 총 건수 업데이트
    if (countElement) {
        countElement.textContent = `(총 ${data.length}건)`;
    }

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-12">
                    <div class="text-6xl mb-4">📋</div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">등록된 공지사항이 없습니다</h3>
                    <p class="text-gray-500">공지사항을 등록하면 이곳에 표시됩니다.</p>
                </td>
            </tr>
        `;
        return;
    }

    const html = data.map((item, index) => {
        const attachmentIcon = item.hasAttachment
            ? '<i class="fas fa-paperclip text-[#6A0028]"></i>'
            : '<span class="text-gray-400">-</span>';

        return `
            <tr onclick="showNoticeDetail('${item.id}')">
                <td>${index + 1}</td>
                <td class="text-left font-medium">${item.title}</td>
                <td>${attachmentIcon}</td>
                <td>${item.createdAt}</td>
                <td>${item.author}</td>
            </tr>
        `;
    }).join('');

    console.log('✅ 생성된 HTML 길이:', html.length);
    tbody.innerHTML = html;
    console.log('✅ tbody.innerHTML 설정 완료, children 개수:', tbody.children.length);
}

/**
 * 필터 초기화
 */
function resetNoticeFilters() {
    document.getElementById('filter-notice-department').value = 'all';
    document.getElementById('filter-notice-title').value = '';

    currentFilters = {
        department: 'all',
        title: ''
    };

    filterNoticeList();
}

/**
 * 상세 화면 표시
 */
function showNoticeDetail(noticeId) {
    console.log('📄 showNoticeDetail 호출됨, ID:', noticeId);

    currentNoticeId = noticeId;
    currentMode = 'detail';

    const notice = getNoticeById(noticeId);
    if (!notice) {
        alert('공지사항을 찾을 수 없습니다.');
        return;
    }

    // 조회수 증가
    incrementViewCount(noticeId);

    // 화면 전환
    document.getElementById('notice-list-view').style.display = 'none';
    document.getElementById('notice-detail-view').style.display = 'block';

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

    const detailView = document.getElementById('notice-detail-view');
    detailView.innerHTML = `
        <div class="table-container">
            <!-- 헤더: 뒤로가기 버튼 -->
            <div class="table-header" style="margin-bottom: 1.5rem;">
                <div class="table-header-left">
                    <button onclick="backToNoticeList()"
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
                <h2 style="font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1rem;">
                    ${notice.title}
                </h2>

                <!-- 메타 정보 -->
                <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: #6B7280; padding-bottom: 1rem; border-bottom: 1px solid #E5E7EB; margin-bottom: 1.5rem;">
                    <span><i class="fas fa-user" style="margin-right: 0.25rem;"></i> ${notice.author}</span>
                    <span><i class="fas fa-calendar" style="margin-right: 0.25rem;"></i> ${notice.createdAt}</span>
                </div>

                <!-- 본문 -->
                <div style="line-height: 1.8; font-size: 0.875rem; color: #333;">
                    ${notice.content}
                </div>

                <!-- 첨부파일 -->
                ${attachmentsHTML}

                <!-- 버튼 영역 -->
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
                    <button onclick="showNoticeEditForm('${notice.id}')"
                            style="padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; background: #3B82F6; color: white; cursor: pointer; font-size: 0.875rem; transition: background-color 0.2s;">
                        <i class="fas fa-edit" style="margin-right: 0.25rem;"></i> 수정
                    </button>
                    <button onclick="deleteNoticeConfirm('${notice.id}')"
                            style="padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; background: #EF4444; color: white; cursor: pointer; font-size: 0.875rem; transition: background-color 0.2s;">
                        <i class="fas fa-trash" style="margin-right: 0.25rem;"></i> 삭제
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 목록으로 돌아가기
 */
function backToNoticeList() {
    document.getElementById('notice-list-view').style.display = 'block';
    document.getElementById('notice-detail-view').style.display = 'none';
    currentNoticeId = null;
    currentMode = 'list';
    filterNoticeList();
}

/**
 * 신규 등록 폼 표시
 */
function showNoticeCreateForm() {
    console.log('✏️ showNoticeCreateForm 호출됨');

    currentMode = 'create';
    currentNoticeId = null;

    // 화면 전환
    document.getElementById('notice-list-view').style.display = 'none';
    document.getElementById('notice-detail-view').style.display = 'block';

    const detailView = document.getElementById('notice-detail-view');
    detailView.innerHTML = `
        <div class="table-container">
            <!-- 헤더: 뒤로가기 버튼 -->
            <div class="table-header" style="margin-bottom: 1.5rem;">
                <div class="table-header-left">
                    <button onclick="backToNoticeList()"
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
                <form id="notice-form" onsubmit="saveNoticeData(event)">
                        <!-- 제목 -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                제목 <span class="text-red-600">*</span>
                            </label>
                            <input type="text" id="notice-title" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028]"
                                   placeholder="제목을 입력하세요">
                        </div>

                        <!-- 공개 대상 학과 -->
                        <div class="mb-6">
                            <div class="flex items-center gap-4">
                                <!-- 레이블 -->
                                <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                                    공개 대상 학과 <span class="text-red-600">*</span>
                                </label>

                                <!-- 전체 공개 라디오 -->
                                <div class="flex items-center gap-2">
                                    <input type="radio" id="visibility-all" name="visibility" value="all" checked
                                           onclick="toggleDepartmentDropdown(false)"
                                           class="text-[#6A0028] focus:ring-[#6A0028]">
                                    <label for="visibility-all" class="text-sm text-gray-700 whitespace-nowrap">
                                        전체 공개 (모든 학과)
                                    </label>
                                </div>

                                <!-- 특정 학과 라디오 -->
                                <div class="flex items-center gap-2">
                                    <input type="radio" id="visibility-specific" name="visibility" value="specific"
                                           onclick="toggleDepartmentDropdown(true)"
                                           class="text-[#6A0028] focus:ring-[#6A0028]">
                                    <label for="visibility-specific" class="text-sm text-gray-700 whitespace-nowrap">
                                        특정 학과만 공개
                                    </label>
                                </div>

                                <!-- 학과 선택 드롭다운 -->
                                <div class="flex-1">
                                    <select id="department-dropdown-specific" disabled
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028] bg-gray-100 cursor-not-allowed">
                                        <option value="">학과 선택</option>
                                        ${DepartmentUtils.getAllDepartments().map(dept =>
                                            `<option value="${dept}">${dept}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- 에디터 툴바 -->
                        <div class="mb-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                내용 <span class="text-red-600">*</span>
                            </label>
                            <div id="notice-toolbar" class="p-3 bg-gray-50 border border-gray-300 rounded-t-lg flex flex-wrap gap-1">
                                <button type="button" onclick="formatNoticeText('bold')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="굵게">
                                    <i class="fas fa-bold"></i>
                                </button>
                                <button type="button" onclick="formatNoticeText('italic')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="기울임">
                                    <i class="fas fa-italic"></i>
                                </button>
                                <button type="button" onclick="formatNoticeText('underline')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="밑줄">
                                    <i class="fas fa-underline"></i>
                                </button>
                                <div class="w-px bg-gray-300 mx-1"></div>
                                <button type="button" onclick="formatNoticeText('h1')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 1">H1</button>
                                <button type="button" onclick="formatNoticeText('h2')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 2">H2</button>
                                <button type="button" onclick="formatNoticeText('h3')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 3">H3</button>
                                <button type="button" onclick="formatNoticeText('h4')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 4">H4</button>
                                <div class="w-px bg-gray-300 mx-1"></div>
                                <button type="button" onclick="formatNoticeText('ul')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="글머리 기호">
                                    <i class="fas fa-list-ul"></i>
                                </button>
                                <button type="button" onclick="formatNoticeText('ol')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="번호 매기기">
                                    <i class="fas fa-list-ol"></i>
                                </button>
                                <div class="w-px bg-gray-300 mx-1"></div>
                                <button type="button" onclick="formatNoticeText('link')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="링크">
                                    <i class="fas fa-link"></i>
                                </button>
                            </div>
                        </div>

                        <!-- 에디터 영역 -->
                        <div class="mb-6">
                            <div id="notice-editor" contenteditable="true"
                                 class="w-full min-h-[400px] p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028] overflow-y-auto"
                                 style="line-height: 1.8; font-size: 14px;">
                            </div>
                        </div>

                        <!-- 첨부파일 -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                첨부파일 (최대 5개)
                            </label>
                            <input type="file" id="notice-files" multiple accept="*/*"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028]">
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end gap-2 pt-6 border-t">
                            <button type="submit" class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020] transition-colors">
                                <i class="fas fa-save mr-1"></i> 저장
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    `;
}

/**
 * 수정 폼 표시
 */
function showNoticeEditForm(noticeId) {
    console.log('✏️ showNoticeEditForm 호출됨, ID:', noticeId);

    currentMode = 'edit';
    currentNoticeId = noticeId;

    const notice = getNoticeById(noticeId);
    if (!notice) {
        alert('공지사항을 찾을 수 없습니다.');
        return;
    }

    // 화면 전환
    document.getElementById('notice-list-view').style.display = 'none';
    document.getElementById('notice-detail-view').style.display = 'block';

    const detailView = document.getElementById('notice-detail-view');
    detailView.innerHTML = `
        <div class="table-container">
            <!-- 헤더: 뒤로가기 버튼 -->
            <div class="table-header" style="margin-bottom: 1.5rem;">
                <div class="table-header-left">
                    <button onclick="showNoticeDetail('${noticeId}')"
                            style="display: flex; align-items: center; gap: 0.5rem; color: #6A0028; background: none; border: none; cursor: pointer; font-size: 0.875rem; font-weight: 500;">
                        <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>상세보기로 돌아가기</span>
                    </button>
                </div>
            </div>

            <!-- 본문 카드 -->
            <div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
                <form id="notice-form" onsubmit="saveNoticeData(event)">
                        <!-- 제목 -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                제목 <span class="text-red-600">*</span>
                            </label>
                            <input type="text" id="notice-title" required value="${notice.title}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028]"
                                   placeholder="제목을 입력하세요">
                        </div>

                        <!-- 공개 대상 학과 -->
                        <div class="mb-6">
                            <div class="flex items-center gap-4">
                                <!-- 레이블 -->
                                <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                                    공개 대상 학과 <span class="text-red-600">*</span>
                                </label>

                                <!-- 전체 공개 라디오 -->
                                <div class="flex items-center gap-2">
                                    <input type="radio" id="visibility-all" name="visibility" value="all"
                                           ${notice.visibility === 'all' ? 'checked' : ''}
                                           onclick="toggleDepartmentDropdown(false)"
                                           class="text-[#6A0028] focus:ring-[#6A0028]">
                                    <label for="visibility-all" class="text-sm text-gray-700 whitespace-nowrap">
                                        전체 공개 (모든 학과)
                                    </label>
                                </div>

                                <!-- 특정 학과 라디오 -->
                                <div class="flex items-center gap-2">
                                    <input type="radio" id="visibility-specific" name="visibility" value="specific"
                                           ${notice.visibility === 'specific' ? 'checked' : ''}
                                           onclick="toggleDepartmentDropdown(true)"
                                           class="text-[#6A0028] focus:ring-[#6A0028]">
                                    <label for="visibility-specific" class="text-sm text-gray-700 whitespace-nowrap">
                                        특정 학과만 공개
                                    </label>
                                </div>

                                <!-- 학과 선택 드롭다운 -->
                                <div class="flex-1">
                                    <select id="department-dropdown-specific" ${notice.visibility === 'specific' ? '' : 'disabled'}
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028] ${notice.visibility === 'specific' ? '' : 'bg-gray-100 cursor-not-allowed'}">
                                        <option value="">학과 선택</option>
                                        ${DepartmentUtils.getAllDepartments().map(dept =>
                                            `<option value="${dept}" ${notice.targetDepartments && notice.targetDepartments.includes(dept) ? 'selected' : ''}>${dept}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- 에디터 툴바 -->
                        <div class="mb-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                내용 <span class="text-red-600">*</span>
                            </label>
                            <div id="notice-toolbar" class="p-3 bg-gray-50 border border-gray-300 rounded-t-lg flex flex-wrap gap-1">
                                <button type="button" onclick="formatNoticeText('bold')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="굵게">
                                    <i class="fas fa-bold"></i>
                                </button>
                                <button type="button" onclick="formatNoticeText('italic')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="기울임">
                                    <i class="fas fa-italic"></i>
                                </button>
                                <button type="button" onclick="formatNoticeText('underline')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="밑줄">
                                    <i class="fas fa-underline"></i>
                                </button>
                                <div class="w-px bg-gray-300 mx-1"></div>
                                <button type="button" onclick="formatNoticeText('h1')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 1">H1</button>
                                <button type="button" onclick="formatNoticeText('h2')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 2">H2</button>
                                <button type="button" onclick="formatNoticeText('h3')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 3">H3</button>
                                <button type="button" onclick="formatNoticeText('h4')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 4">H4</button>
                                <div class="w-px bg-gray-300 mx-1"></div>
                                <button type="button" onclick="formatNoticeText('ul')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="글머리 기호">
                                    <i class="fas fa-list-ul"></i>
                                </button>
                                <button type="button" onclick="formatNoticeText('ol')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="번호 매기기">
                                    <i class="fas fa-list-ol"></i>
                                </button>
                                <div class="w-px bg-gray-300 mx-1"></div>
                                <button type="button" onclick="formatNoticeText('link')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="링크">
                                    <i class="fas fa-link"></i>
                                </button>
                            </div>
                        </div>

                        <!-- 에디터 영역 -->
                        <div class="mb-6">
                            <div id="notice-editor" contenteditable="true"
                                 class="w-full min-h-[400px] p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028] overflow-y-auto"
                                 style="line-height: 1.8; font-size: 14px;">${notice.content}</div>
                        </div>

                        <!-- 첨부파일 -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                첨부파일 (최대 5개)
                            </label>
                            <input type="file" id="notice-files" multiple accept="*/*"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028]">
                            ${notice.attachments.length > 0 ? `
                                <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p class="text-xs font-medium text-gray-700 mb-2">기존 첨부파일:</p>
                                    ${notice.attachments.map(file => `
                                        <div class="text-xs text-gray-600">• ${file.name}</div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end gap-2 pt-6 border-t">
                            <button type="submit" class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020] transition-colors">
                                <i class="fas fa-save mr-1"></i> 저장
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    `;
}

/**
 * WYSIWYG 에디터 포맷 함수
 */
function formatNoticeText(command) {
    const editor = document.getElementById('notice-editor');
    if (!editor) return;

    editor.focus();

    if (command === 'h1' || command === 'h2' || command === 'h3' || command === 'h4') {
        document.execCommand('formatBlock', false, command);
    } else if (command === 'link') {
        const url = prompt('URL을 입력하세요:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    } else if (command === 'ul' || command === 'ol') {
        const listCommand = command === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
        document.execCommand(listCommand, false, null);
    } else {
        document.execCommand(command, false, null);
    }
}

/**
 * 학과 드롭다운 토글
 */
function toggleDepartmentDropdown(enableSpecific) {
    const dropdown = document.getElementById('department-dropdown-specific');

    if (dropdown) {
        if (enableSpecific) {
            dropdown.disabled = false;
            dropdown.classList.remove('bg-gray-100', 'cursor-not-allowed');
        } else {
            dropdown.disabled = true;
            dropdown.classList.add('bg-gray-100', 'cursor-not-allowed');
            dropdown.value = ''; // 선택 초기화
        }
    }
}

/**
 * 공지사항 저장
 */
function saveNoticeData(event) {
    event.preventDefault();

    const title = document.getElementById('notice-title')?.value.trim();
    const editor = document.getElementById('notice-editor');
    const content = editor?.innerHTML.trim();
    const filesInput = document.getElementById('notice-files');

    // 공개 대상 학과 수집
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value || 'all';
    let targetDepartments = ['all'];

    if (visibility === 'specific') {
        const dropdown = document.getElementById('department-dropdown-specific');
        const selectedValue = dropdown?.value;

        if (!selectedValue || selectedValue === '') {
            alert('특정 학과 공개를 선택한 경우, 학과를 선택해주세요.');
            return;
        }
        targetDepartments = [selectedValue];
    }

    // 유효성 검사
    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!content || content === '<br>') {
        alert('내용을 입력해주세요.');
        return;
    }

    // 첨부파일 처리 (시뮬레이션)
    const attachments = [];
    if (filesInput && filesInput.files.length > 0) {
        for (let i = 0; i < Math.min(filesInput.files.length, 5); i++) {
            const file = filesInput.files[i];
            attachments.push({
                id: `file_${Date.now()}_${i}`,
                name: file.name,
                size: file.size,
                url: '#' // 실제 업로드 URL (시뮬레이션)
            });
        }
    }

    // 데이터 구성
    const noticeData = {
        title,
        content,
        author: '관리자',
        authorId: 'admin', // 실제로는 로그인한 사용자 ID
        visibility,
        targetDepartments,
        attachments: currentMode === 'edit'
            ? (attachments.length > 0 ? attachments : getNoticeById(currentNoticeId).attachments)
            : attachments,
        hasAttachment: currentMode === 'edit'
            ? (attachments.length > 0 ? true : getNoticeById(currentNoticeId).hasAttachment)
            : attachments.length > 0
    };

    // 수정 모드일 경우 ID 추가
    if (currentMode === 'edit' && currentNoticeId) {
        noticeData.id = currentNoticeId;
    }

    // 저장
    const success = saveNotice(noticeData);

    if (success) {
        alert(currentMode === 'edit' ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.');
        backToNoticeList();
    } else {
        alert('저장에 실패했습니다.');
    }
}

/**
 * 삭제 확인
 */
function deleteNoticeConfirm(noticeId) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }

    const success = deleteNotice(noticeId);

    if (success) {
        alert('공지사항이 삭제되었습니다.');
        backToNoticeList();
    } else {
        alert('삭제에 실패했습니다.');
    }
}

// window 객체에 즉시 노출 (IIFE 내부에서)
window.renderNoticeList = renderNoticeList;
window.filterNoticeList = filterNoticeList;
window.resetNoticeFilters = resetNoticeFilters;
window.showNoticeDetail = showNoticeDetail;
window.backToNoticeList = backToNoticeList;
window.showNoticeCreateForm = showNoticeCreateForm;
window.showNoticeEditForm = showNoticeEditForm;
window.formatNoticeText = formatNoticeText;
window.toggleDepartmentDropdown = toggleDepartmentDropdown;
window.saveNoticeData = saveNoticeData;
window.deleteNoticeConfirm = deleteNoticeConfirm;

console.log('✅ notice-management.js 로드 완료');
console.log('✅ window.renderNoticeList:', typeof window.renderNoticeList);
console.log('✅ window.filterNoticeList:', typeof window.filterNoticeList);
console.log('✅ window.getAllNotices:', typeof window.getAllNotices);

})(); // IIFE 종료
