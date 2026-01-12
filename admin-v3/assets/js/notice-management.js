// ==================== 공지사항 관리 메인 로직 ====================

(function() {
    'use strict';

// 전역 변수
let currentFilters = {
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
    currentFilters.title = document.getElementById('filter-notice-title')?.value.trim() || '';

    console.log('📊 현재 필터:', currentFilters);

    // 데이터 조회
    let data = getAllNotices();
    console.log('📦 전체 데이터 개수:', data.length);

    // 필터 적용
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
                <td colspan="5" class="text-center py-12">
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
    document.getElementById('filter-notice-title').value = '';

    currentFilters = {
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
        <div class="review-detail-content-wrapper">
            <!-- 헤더 -->
            <div class="review-detail-header" style="padding: 12px 24px;">
                <button onclick="backToNoticeList()" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
            </div>

            <!-- 본문 -->
            <div class="review-detail-body">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <!-- 제목 -->
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">${notice.title}</h2>

                    <!-- 메타 정보 -->
                    <div class="flex gap-4 text-sm text-gray-600 pb-4 border-b mb-6">
                        <span><i class="fas fa-user mr-1"></i> ${notice.author}</span>
                        <span><i class="fas fa-calendar mr-1"></i> ${notice.createdAt}</span>
                        <span><i class="fas fa-eye mr-1"></i> 조회수 ${notice.viewCount}</span>
                    </div>

                    <!-- 본문 -->
                    <div class="prose prose-sm max-w-none">
                        <div style="line-height: 1.8; font-size: 14px; color: #333;">
                            ${notice.content}
                        </div>
                    </div>

                    <!-- 첨부파일 -->
                    ${attachmentsHTML}

                    <!-- 버튼 영역 -->
                    <div class="flex justify-end gap-2 mt-6 pt-6 border-t">
                        <button onclick="backToNoticeList()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            목록
                        </button>
                        <button onclick="showNoticeEditForm('${notice.id}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-edit mr-1"></i> 수정
                        </button>
                        <button onclick="deleteNoticeConfirm('${notice.id}')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            <i class="fas fa-trash mr-1"></i> 삭제
                        </button>
                    </div>
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
        <div class="review-detail-content-wrapper">
            <!-- 헤더 -->
            <div class="review-detail-header" style="padding: 12px 24px;">
                <button onclick="backToNoticeList()" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
            </div>

            <!-- 본문 -->
            <div class="review-detail-body">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-6">공지사항 작성</h2>

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
                            <label class="block text-sm font-medium text-gray-700 mb-3">
                                공개 대상 학과 <span class="text-red-600">*</span>
                            </label>
                            <div class="space-y-3">
                                <div class="flex items-center gap-2">
                                    <input type="radio" id="visibility-all" name="visibility" value="all" checked
                                           onclick="toggleDepartmentSelection(false)"
                                           class="text-[#6A0028] focus:ring-[#6A0028]">
                                    <label for="visibility-all" class="text-sm text-gray-700">전체 공개 (모든 학과)</label>
                                </div>
                                <div class="flex items-start gap-2">
                                    <input type="radio" id="visibility-specific" name="visibility" value="specific"
                                           onclick="toggleDepartmentSelection(true)"
                                           class="mt-0.5 text-[#6A0028] focus:ring-[#6A0028]">
                                    <div class="flex-1">
                                        <label for="visibility-specific" class="text-sm text-gray-700 block mb-2">특정 학과만 공개</label>
                                        <div id="department-checkboxes" class="pl-6 space-y-2" style="display: none;">
                                            ${DepartmentUtils.generateDepartmentCheckboxes([])}
                                        </div>
                                    </div>
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
                            <p class="text-xs text-gray-500 mt-1">※ 파일은 실제로 업로드되지 않으며, 시뮬레이션 데이터로 저장됩니다.</p>
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end gap-2 pt-6 border-t">
                            <button type="button" onclick="backToNoticeList()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                취소
                            </button>
                            <button type="submit" class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020] transition-colors">
                                <i class="fas fa-save mr-1"></i> 저장
                            </button>
                        </div>
                    </form>
                </div>
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
        <div class="review-detail-content-wrapper">
            <!-- 헤더 -->
            <div class="review-detail-header" style="padding: 12px 24px;">
                <button onclick="showNoticeDetail('${noticeId}')" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    상세보기로 돌아가기
                </button>
            </div>

            <!-- 본문 -->
            <div class="review-detail-body">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-6">공지사항 수정</h2>

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
                            <label class="block text-sm font-medium text-gray-700 mb-3">
                                공개 대상 학과 <span class="text-red-600">*</span>
                            </label>
                            <div class="space-y-3">
                                <div class="flex items-center gap-2">
                                    <input type="radio" id="visibility-all" name="visibility" value="all"
                                           ${notice.visibility === 'all' ? 'checked' : ''}
                                           onclick="toggleDepartmentSelection(false)"
                                           class="text-[#6A0028] focus:ring-[#6A0028]">
                                    <label for="visibility-all" class="text-sm text-gray-700">전체 공개 (모든 학과)</label>
                                </div>
                                <div class="flex items-start gap-2">
                                    <input type="radio" id="visibility-specific" name="visibility" value="specific"
                                           ${notice.visibility === 'specific' ? 'checked' : ''}
                                           onclick="toggleDepartmentSelection(true)"
                                           class="mt-0.5 text-[#6A0028] focus:ring-[#6A0028]">
                                    <div class="flex-1">
                                        <label for="visibility-specific" class="text-sm text-gray-700 block mb-2">특정 학과만 공개</label>
                                        <div id="department-checkboxes" class="pl-6 space-y-2" style="display: ${notice.visibility === 'specific' ? 'block' : 'none'};">
                                            ${DepartmentUtils.generateDepartmentCheckboxes(notice.targetDepartments || [])}
                                        </div>
                                    </div>
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
                            <p class="text-xs text-gray-500 mt-1">※ 파일은 실제로 업로드되지 않으며, 시뮬레이션 데이터로 저장됩니다.</p>
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
                            <button type="button" onclick="showNoticeDetail('${noticeId}')" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                취소
                            </button>
                            <button type="submit" class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020] transition-colors">
                                <i class="fas fa-save mr-1"></i> 저장
                            </button>
                        </div>
                    </form>
                </div>
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
 * 학과 선택 영역 토글
 */
function toggleDepartmentSelection(show) {
    const checkboxContainer = document.getElementById('department-checkboxes');
    if (checkboxContainer) {
        checkboxContainer.style.display = show ? 'block' : 'none';
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
        const checkboxes = document.querySelectorAll('input[name="targetDepartments"]:checked');
        if (checkboxes.length === 0) {
            alert('특정 학과 공개를 선택한 경우, 최소 1개 이상의 학과를 선택해주세요.');
            return;
        }
        targetDepartments = Array.from(checkboxes).map(cb => cb.value);
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
window.toggleDepartmentSelection = toggleDepartmentSelection;
window.saveNoticeData = saveNoticeData;
window.deleteNoticeConfirm = deleteNoticeConfirm;

console.log('✅ notice-management.js 로드 완료');
console.log('✅ window.renderNoticeList:', typeof window.renderNoticeList);
console.log('✅ window.filterNoticeList:', typeof window.filterNoticeList);
console.log('✅ window.getAllNotices:', typeof window.getAllNotices);

})(); // IIFE 종료
