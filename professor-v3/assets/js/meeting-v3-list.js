// ==================== 미팅 관리 V3 목록 화면 ====================

/**
 * 미팅 목록 관리
 */
const MeetingList = {
    currentPage: 1,
    itemsPerPage: 20,
    allMeetings: [],

    /**
     * 목록 화면 렌더링
     */
    render() {
        return `
            <!-- 목록 화면 -->
            <div id="meeting-list-view">
                <!-- 검색 영역 -->
                <div class="bg-white rounded-lg shadow-md mb-6">
                    <div class="p-4 bg-gray-50">
                        <div class="grid grid-cols-2 gap-4">
                            <!-- 1행 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도방식</label>
                                <select id="meeting-filter-method" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="online">온라인</option>
                                    <option value="offline">오프라인</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">미팅유형</label>
                                <select id="meeting-filter-type" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="individual">1:1 미팅</option>
                                    <option value="group">그룹미팅</option>
                                </select>
                            </div>

                            <!-- 2행 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">상태</label>
                                <select id="meeting-filter-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="pending">대기</option>
                                    <option value="approved,confirmed">확정</option>
                                    <option value="completed">완료</option>
                                    <option value="cancelled">취소</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">참여학생</label>
                                <input type="text" id="meeting-filter-student" placeholder="학번 또는 성명"
                                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                       onkeypress="if(event.key==='Enter') MeetingList.applyFilters()">
                            </div>

                            <!-- 3행 버튼 -->
                            <div class="col-span-2 flex items-center justify-end gap-2">
                                <button onclick="MeetingList.resetFilters()" class="px-3 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs font-medium" style="height: 34px;">
                                    초기화
                                </button>
                                <button onclick="MeetingList.applyFilters()" class="px-3 bg-[#6A0028] text-white rounded hover:bg-[#4A001C] text-xs font-medium" style="height: 34px;">
                                    <i class="fas fa-search mr-1"></i>조회
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 테이블 영역 -->
                <div class="bg-white rounded-lg shadow-md">
                    <div class="table-container">
                        <div class="table-header">
                            <div class="table-header-left">
                                <h3 class="table-title">미팅 목록</h3>
                                <span class="table-count" id="meeting-count">(총 0건)</span>
                            </div>
                            <div class="table-header-right">
                                <button onclick="DirectMeetingModal.open()" class="btn-primary text-xs">
                                    <i class="fas fa-plus mr-1"></i>직접 등록
                                </button>
                                <button onclick="AvailableSlotModal.open()" class="btn-secondary text-xs">
                                    <i class="fas fa-clock mr-1"></i>지도가능 시간등록
                                </button>
                                <button onclick="ManageSlotsModal.open()" class="btn-secondary text-xs">
                                    <i class="fas fa-list mr-1"></i>지도가능 시간관리
                                </button>
                            </div>
                        </div>
                        <div class="table-scroll">
                            <table class="min-w-full">
                                <thead>
                                    <tr>
                                        <th>순번</th>
                                        <th>미팅일시</th>
                                        <th>지도방식</th>
                                        <th>참여인원</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody id="meeting-table-body">
                                    <!-- JavaScript로 동적 렌더링 -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 상세 화면 (초기 숨김) -->
            <div id="meeting-detail-view" style="display: none;">
                <!-- JavaScript로 동적 렌더링 -->
            </div>

            <!-- 모달들 -->
            ${AvailableSlotModal.render()}
            ${DirectMeetingModal.render()}
            ${ManageSlotsModal.render()}
        `;
    },

    /**
     * 필터 적용 및 테이블 렌더링
     */
    applyFilters() {
        const filters = {
            meetingType: document.getElementById('meeting-filter-method').value,
            meetingTypeFilter: document.getElementById('meeting-filter-type').value,
            studentSearch: document.getElementById('meeting-filter-student').value,
            status: []
        };

        // 상태 필터 처리
        const statusFilter = document.getElementById('meeting-filter-status').value;
        if (statusFilter) {
            filters.status = statusFilter.split(',');
        }

        // 데이터 가져오기
        this.allMeetings = DataServiceV3.getAllMeetings(filters);

        // 테이블 렌더링
        this.renderTable();
    },

    /**
     * 필터 초기화
     */
    resetFilters() {
        document.getElementById('meeting-filter-method').value = '';
        document.getElementById('meeting-filter-type').value = '';
        document.getElementById('meeting-filter-status').value = '';
        document.getElementById('meeting-filter-student').value = '';

        this.applyFilters();
    },

    /**
     * 테이블 렌더링
     */
    renderTable() {
        const tbody = document.getElementById('meeting-table-body');
        const countSpan = document.getElementById('meeting-count');

        if (!tbody) return;

        countSpan.textContent = `(총 ${this.allMeetings.length}건)`;

        if (this.allMeetings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-gray-500 py-8">
                        검색 결과가 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.allMeetings.map((meeting, index) => {
            const statusText = MeetingStatusUtils.getStatusText(meeting.status);
            const meetingMethodText = MeetingTypeUtils.getMeetingMethodText(meeting.meetingType);
            const dateTimeText = MeetingUtils.formatDateTime(meeting.selectedDate || meeting.date, meeting.selectedTime || meeting.startTime);

            // 참여인원 계산
            const participantCount = meeting.participants?.length || 1;
            const participantText = participantCount === 1
                ? '1명'
                : `<span style="color: #6A0028; font-weight: 600;">👥 ${participantCount}명</span>`;

            return `
                <tr onclick="MeetingList.showDetail('${meeting.id}')" style="cursor: pointer;">
                    <td>${index + 1}</td>
                    <td>${dateTimeText}</td>
                    <td>${meetingMethodText}</td>
                    <td>${participantText}</td>
                    <td>${statusText}</td>
                </tr>
            `;
        }).join('');
    },

    /**
     * 상세 화면으로 이동
     */
    showDetail(meetingId) {
        if (typeof MeetingMain !== 'undefined' && typeof MeetingMain.showDetail === 'function') {
            MeetingMain.showDetail(meetingId);
        }
    },

    /**
     * 목록 새로고침
     */
    refresh() {
        this.applyFilters();
    }
};

// 전역 export
window.MeetingList = MeetingList;

console.log('meeting-v3-list.js loaded');
