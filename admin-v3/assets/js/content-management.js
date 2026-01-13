// ==================== 콘텐츠 관리 (연구윤리, 논문일정, 지도절차) ====================
// 공지사항과 동일한 등록/수정 방식

const ContentManagement = {
    currentContentType: null, // 'ethics', 'schedule', 'procedure'
    currentContentId: null,

    /**
     * 콘텐츠 타입별 제목 매핑
     */
    contentTypeLabels: {
        ethics: '연구윤리',
        schedule: '논문일정',
        procedure: '논문지도절차'
    },

    /**
     * 편집 화면 표시 (공지사항 방식)
     * @param {string} contentType - 콘텐츠 타입 ('ethics', 'schedule', 'procedure')
     * @param {string|null} contentId - 수정 시 콘텐츠 ID, 신규 시 null
     */
    showEditForm(contentType, contentId = null) {
        console.log(`ContentManagement.showEditForm(${contentType}, ${contentId})`);

        this.currentContentType = contentType;
        this.currentContentId = contentId;

        // 콘텐츠 로드
        let content = null;
        if (contentId) {
            content = getContentById(contentType, contentId);
        }

        const isEdit = !!content;

        // 화면 HTML 생성 (공지사항 방식)
        const editFormHTML = `
            <div class="review-detail-content-wrapper">
                <!-- 헤더 -->
                <div class="review-detail-header" style="padding: 12px 24px;">
                    <button onclick="ContentManagement.backToList()" class="back-to-list-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        목록으로 돌아가기
                    </button>
                </div>

                <!-- 본문 -->
                <div class="review-detail-body">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <form id="content-form" onsubmit="ContentManagement.saveContent(event)">
                            <!-- 제목 -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    제목 <span class="text-red-600">*</span>
                                </label>
                                <input type="text" id="content-title" required
                                       value="${content ? content.title : ''}"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028]"
                                       placeholder="제목을 입력하세요">
                            </div>

                            <!-- 공개 대상 학과 (공지사항 방식) -->
                            <div class="mb-6">
                                <div class="flex items-center gap-4">
                                    <!-- 레이블 -->
                                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        공개 대상 학과 <span class="text-red-600">*</span>
                                    </label>

                                    <!-- 전체 공개 라디오 -->
                                    <div class="flex items-center gap-2">
                                        <input type="radio" id="visibility-all" name="visibility" value="all"
                                               ${!content || content.visibility === 'all' || content.department === 'all' ? 'checked' : ''}
                                               onclick="ContentManagement.toggleDepartmentDropdown(false)"
                                               class="text-[#6A0028] focus:ring-[#6A0028]">
                                        <label for="visibility-all" class="text-sm text-gray-700 whitespace-nowrap">
                                            전체 공개 (모든 학과)
                                        </label>
                                    </div>

                                    <!-- 특정 학과 라디오 -->
                                    <div class="flex items-center gap-2">
                                        <input type="radio" id="visibility-specific" name="visibility" value="specific"
                                               ${content && content.visibility === 'specific' ? 'checked' : ''}
                                               onclick="ContentManagement.toggleDepartmentDropdown(true)"
                                               class="text-[#6A0028] focus:ring-[#6A0028]">
                                        <label for="visibility-specific" class="text-sm text-gray-700 whitespace-nowrap">
                                            특정 학과만 공개
                                        </label>
                                    </div>

                                    <!-- 학과 선택 드롭다운 -->
                                    <div class="flex-1">
                                        <select id="department-dropdown-specific" ${content && content.visibility === 'specific' ? '' : 'disabled'}
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028] ${content && content.visibility === 'specific' ? '' : 'bg-gray-100 cursor-not-allowed'}">
                                            <option value="">학과 선택</option>
                                            ${DepartmentUtils.getAllDepartments().map(dept =>
                                                `<option value="${dept}" ${content?.targetDepartments && content.targetDepartments.includes(dept) ? 'selected' : ''}>${dept}</option>`
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
                                <div id="content-toolbar" class="p-3 bg-gray-50 border border-gray-300 rounded-t-lg flex flex-wrap gap-1">
                                    ${this.getToolbarHTML(contentType)}
                                </div>
                            </div>

                            <!-- 에디터 영역 -->
                            <div class="mb-6">
                                <div id="content-editor" contenteditable="true"
                                     class="w-full min-h-[400px] p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028] overflow-y-auto"
                                     style="line-height: 1.8; font-size: 14px;">${content ? content.content : ''}</div>
                            </div>

                            <!-- 최종 수정 정보 -->
                            ${content ? `
                                <div class="mb-6 text-sm text-gray-500">
                                    최종 수정일: ${content.lastModified || content.createdAt || '-'} (${content.modifiedBy || content.author || '-'})
                                </div>
                            ` : ''}

                            <!-- 버튼 영역 -->
                            <div class="flex justify-end gap-2 pt-6 border-t">
                                <button type="submit"
                                        class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020] transition-colors">
                                    <i class="fas fa-save mr-1"></i> 저장
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // 메인 콘텐츠 영역에 렌더링
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = editFormHTML;
        } else {
            console.error('content-area 요소를 찾을 수 없습니다');
        }
    },

    /**
     * 콘텐츠 타입별 툴바 HTML 생성
     */
    getToolbarHTML(contentType) {
        const commonButtons = `
            <button type="button" onclick="ContentManagement.formatText('bold')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="굵게">
                <i class="fas fa-bold"></i>
            </button>
            <button type="button" onclick="ContentManagement.formatText('italic')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="기울임">
                <i class="fas fa-italic"></i>
            </button>
            <button type="button" onclick="ContentManagement.formatText('underline')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="밑줄">
                <i class="fas fa-underline"></i>
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="ContentManagement.formatText('h1')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 1">H1</button>
            <button type="button" onclick="ContentManagement.formatText('h2')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 2">H2</button>
            <button type="button" onclick="ContentManagement.formatText('h3')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 3">H3</button>
            <button type="button" onclick="ContentManagement.formatText('h4')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 4">H4</button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="ContentManagement.formatText('ul')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="글머리 기호">
                <i class="fas fa-list-ul"></i>
            </button>
            <button type="button" onclick="ContentManagement.formatText('ol')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="번호 매기기">
                <i class="fas fa-list-ol"></i>
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="ContentManagement.formatText('link')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="링크">
                <i class="fas fa-link"></i>
            </button>
        `;

        // 논문일정은 표 기능 추가
        if (contentType === 'schedule') {
            return commonButtons + `
                <div class="w-px bg-gray-300 mx-1"></div>
                <button type="button" onclick="ContentManagement.insertTable()" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="표 삽입">
                    <i class="fas fa-table"></i>
                </button>
            `;
        }

        return commonButtons;
    },

    /**
     * 텍스트 포맷 적용
     */
    formatText(command) {
        const editor = document.getElementById('content-editor');
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
    },

    /**
     * 표 삽입 (논문일정용)
     */
    insertTable() {
        const editor = document.getElementById('content-editor');
        if (!editor) return;

        const rows = prompt('행 수를 입력하세요:', '3');
        const cols = prompt('열 수를 입력하세요:', '3');

        if (rows && cols) {
            let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;"><tbody>';
            for (let i = 0; i < parseInt(rows); i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < parseInt(cols); j++) {
                    tableHTML += '<td style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">&nbsp;</td>';
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</tbody></table>';

            editor.focus();
            document.execCommand('insertHTML', false, tableHTML);
        }
    },

    /**
     * 학과 드롭다운 토글
     */
    toggleDepartmentDropdown(enableSpecific) {
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
    },

    /**
     * 콘텐츠 저장 (공지사항 방식)
     */
    saveContent(event) {
        event.preventDefault();

        const title = document.getElementById('content-title')?.value.trim();
        const editor = document.getElementById('content-editor');
        const content = editor?.innerHTML.trim();

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

        // 데이터 구성 (공지사항 방식)
        const contentData = {
            title,
            content,
            author: 'admin',
            visibility,
            targetDepartments,
            createdAt: this.currentContentId ? undefined : new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
            modifiedBy: 'admin'
        };

        // 수정 모드일 경우 ID 추가
        if (this.currentContentId) {
            contentData.id = this.currentContentId;
        }

        // 저장
        const success = saveContentItem(this.currentContentType, contentData);

        if (success) {
            alert(this.currentContentId ? '수정되었습니다.' : '등록되었습니다.');
            this.backToList();
        } else {
            alert('저장에 실패했습니다.');
        }
    },

    /**
     * 목록으로 돌아가기
     */
    backToList() {
        const viewMap = {
            ethics: 'ethicsList',
            schedule: 'scheduleList',
            procedure: 'procedureList'
        };
        const targetView = viewMap[this.currentContentType];

        if (targetView && typeof window.renderAdminView === 'function') {
            window.renderAdminView(targetView);
        } else {
            console.error('renderAdminView 함수를 찾을 수 없습니다');
        }
    }
};

// 전역 export
window.ContentManagement = ContentManagement;

console.log('content-management.js loaded');
