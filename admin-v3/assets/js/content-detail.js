// ==================== 콘텐츠 상세 화면 관리 ====================
// 공지사항과 동일한 상세 화면 방식

const ContentDetail = {
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
     * 상세 화면 표시 (공지사항 방식)
     * @param {string} contentType - 콘텐츠 타입
     * @param {string} contentId - 콘텐츠 ID
     */
    showDetail(contentType, contentId) {
        console.log(`ContentDetail.showDetail(${contentType}, ${contentId})`);

        this.currentContentType = contentType;
        this.currentContentId = contentId;

        const content = getContentById(contentType, contentId);
        if (!content) {
            alert('콘텐츠를 찾을 수 없습니다.');
            return;
        }

        // 관리자 여부 확인
        const isAdmin = AuthUtils.isAdmin();

        // 대상 학과 표시
        const deptDisplay = this.getDepartmentDisplay(content);

        // 상세 화면 HTML (공지사항과 동일한 구조)
        const detailHTML = `
            <div class="review-detail-content-wrapper">
                <!-- 헤더 -->
                <div class="review-detail-header" style="padding: 12px 24px;">
                    <button onclick="ContentDetail.backToList()" class="back-to-list-btn">
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
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">${content.title}</h2>

                        <!-- 메타 정보 -->
                        <div class="flex gap-4 text-sm text-gray-600 pb-4 border-b mb-6">
                            <span><i class="fas fa-user mr-1"></i> ${content.author || 'admin'}</span>
                            <span><i class="fas fa-calendar mr-1"></i> ${content.createdAt || content.lastModified || '-'}</span>
                            <span><i class="fas fa-building mr-1"></i> ${deptDisplay}</span>
                        </div>

                        <!-- 본문 -->
                        <div class="prose prose-sm max-w-none">
                            <div style="line-height: 1.8; font-size: 14px; color: #333;">
                                ${content.content}
                            </div>
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end gap-2 mt-6 pt-6 border-t">
                            <button onclick="ContentDetail.backToList()"
                                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                목록
                            </button>
                            ${isAdmin ? `
                                <button onclick="ContentDetail.editContent()"
                                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <i class="fas fa-edit mr-1"></i> 수정
                                </button>
                                <button onclick="ContentDetail.deleteContent()"
                                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    <i class="fas fa-trash mr-1"></i> 삭제
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 메인 콘텐츠 영역에 렌더링
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = detailHTML;
        } else {
            console.error('content-area 요소를 찾을 수 없습니다');
        }
    },

    /**
     * 학과 표시 생성
     */
    getDepartmentDisplay(content) {
        if (content.visibility === 'all' || content.department === 'all') {
            return '전체 공개';
        }

        if (content.visibility === 'specific' && content.targetDepartments) {
            if (content.targetDepartments.length === 1) {
                return content.targetDepartments[0];
            } else {
                return `${content.targetDepartments[0]} 외 ${content.targetDepartments.length - 1}개`;
            }
        }

        // 레거시: department 필드
        if (content.department && content.department !== 'all') {
            return content.department;
        }

        return '전체 공개';
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
    },

    /**
     * 수정 화면으로 이동
     */
    editContent() {
        if (typeof ContentManagement !== 'undefined' && typeof ContentManagement.showEditForm === 'function') {
            ContentManagement.showEditForm(this.currentContentType, this.currentContentId);
        } else {
            console.error('ContentManagement.showEditForm 함수를 찾을 수 없습니다');
        }
    },

    /**
     * 삭제
     */
    deleteContent() {
        const content = getContentById(this.currentContentType, this.currentContentId);
        if (!content) {
            alert('콘텐츠를 찾을 수 없습니다.');
            return;
        }

        if (!confirm(`"${content.title}"을(를) 삭제하시겠습니까?`)) {
            return;
        }

        const success = deleteContentItem(this.currentContentType, this.currentContentId);
        if (success) {
            alert('삭제되었습니다.');
            this.backToList();
        } else {
            alert('삭제에 실패했습니다.');
        }
    }
};

// 전역 export
window.ContentDetail = ContentDetail;

console.log('content-detail.js loaded');
