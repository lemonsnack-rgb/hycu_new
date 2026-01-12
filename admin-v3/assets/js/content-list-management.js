// ==================== 콘텐츠 목록 관리 (연구윤리, 논문일정, 지도절차) ====================
// 공지사항/자료실과 동일한 목록 방식

const ContentListManagement = {
    currentContentType: null, // 'ethics', 'schedule', 'procedure'
    currentFilters: {
        title: ''
    },

    /**
     * 콘텐츠 타입별 제목 매핑
     */
    contentTypeLabels: {
        ethics: '연구윤리',
        schedule: '논문일정',
        procedure: '논문지도절차'
    },

    /**
     * 목록 화면 초기화
     */
    init(contentType) {
        console.log(`ContentListManagement.init(${contentType})`);
        this.currentContentType = contentType;
        this.currentFilters.title = '';
        this.loadContentList();
    },

    /**
     * 검색 필터링
     */
    filterContentList() {
        // 필터 값 수집
        this.currentFilters.title = document.getElementById('filter-content-title')?.value.trim() || '';
        this.loadContentList();
    },

    /**
     * 콘텐츠 목록 렌더링
     */
    loadContentList() {
        let contentList = getContentList(this.currentContentType);

        // 제목 필터 적용
        if (this.currentFilters.title) {
            contentList = contentList.filter(item =>
                item.title.toLowerCase().includes(this.currentFilters.title.toLowerCase())
            );
        }

        const tableBody = document.getElementById('content-table-body');
        if (!tableBody) {
            console.error('content-table-body 요소를 찾을 수 없습니다');
            return;
        }

        // 건수 표시
        const countDisplay = document.getElementById('content-count-display');
        if (countDisplay) {
            countDisplay.textContent = `(총 ${contentList.length}건)`;
        }

        // 관리자 여부 확인
        const isAdmin = typeof AuthUtils !== 'undefined' ? AuthUtils.isAdmin() : true;

        // 신규 등록 버튼 show/hide
        const createBtn = document.querySelector('.table-header-right button');
        if (createBtn) {
            createBtn.style.display = isAdmin ? 'inline-flex' : 'none';
        }

        // 등록된 콘텐츠만 테이블에 표시
        if (contentList.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-12">
                        <p class="text-gray-600">등록된 게시물이 없습니다</p>
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        contentList.forEach((content, index) => {
            const deptDisplay = this.getDepartmentDisplay(content);
            html += `
                <tr onclick="ContentDetail.showDetail('${this.currentContentType}', '${content.id}')" style="cursor: pointer;" class="hover:bg-gray-50">
                    <td>${index + 1}</td>
                    <td class="text-left font-medium">${content.title || '-'}</td>
                    <td>${deptDisplay}</td>
                    <td>${content.createdAt || content.lastModified || '-'}</td>
                    <td>${content.author || content.modifiedBy || '-'}</td>
                    ${isAdmin ? `
                        <td onclick="event.stopPropagation();">
                            <button onclick="ContentListManagement.editContent('${content.id}')"
                                    class="action-btn action-btn-edit">
                                <i class="fas fa-edit"></i> 수정
                            </button>
                            <button onclick="ContentListManagement.deleteContent('${content.id}')"
                                    class="action-btn action-btn-delete">
                                <i class="fas fa-trash"></i> 삭제
                            </button>
                        </td>
                    ` : '<td></td>'}
                </tr>
            `;
        });

        tableBody.innerHTML = html;
    },

    /**
     * 학과 표시 생성 (공지사항 방식)
     */
    getDepartmentDisplay(content) {
        if (content.visibility === 'all' || content.department === 'all') {
            return '<span class="text-gray-600">전체 공개</span>';
        }

        if (content.visibility === 'specific' && content.targetDepartments) {
            // 공지사항 방식: 복수 학과
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
    },

    /**
     * 신규 등록 폼 표시
     */
    showCreateForm() {
        if (typeof ContentManagement !== 'undefined' && typeof ContentManagement.showEditForm === 'function') {
            ContentManagement.showEditForm(this.currentContentType, null);
        } else {
            console.error('ContentManagement.showEditForm 함수를 찾을 수 없습니다');
        }
    },

    /**
     * 콘텐츠 수정
     */
    editContent(contentId) {
        const content = getContentById(this.currentContentType, contentId);
        if (!content) {
            alert('콘텐츠를 찾을 수 없습니다.');
            return;
        }

        if (typeof ContentManagement !== 'undefined' && typeof ContentManagement.showEditForm === 'function') {
            ContentManagement.showEditForm(this.currentContentType, contentId);
        } else {
            console.error('ContentManagement.showEditForm 함수를 찾을 수 없습니다');
        }
    },

    /**
     * 콘텐츠 삭제
     */
    deleteContent(contentId) {
        const content = getContentById(this.currentContentType, contentId);
        if (!content) {
            alert('콘텐츠를 찾을 수 없습니다.');
            return;
        }

        if (!confirm(`"${content.title}"을(를) 삭제하시겠습니까?`)) {
            return;
        }

        const success = deleteContentItem(this.currentContentType, contentId);
        if (success) {
            alert('삭제되었습니다.');
            this.loadContentList();
        } else {
            alert('삭제에 실패했습니다.');
        }
    }
};

// 전역 export
window.ContentListManagement = ContentListManagement;

console.log('content-list-management.js loaded');
