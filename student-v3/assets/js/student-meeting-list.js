/**
 * 학생용 실시간 지도 예약 - 목록 화면
 * Version: 20260108001
 */

const StudentMeetingList = {
    currentView: 'available', // 'available' 또는 'my-applications'

    /**
     * 목록 화면 렌더링
     */
    render() {
        return `
            <!-- 검색 영역 -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-4 bg-gray-50">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도방식</label>
                            <select id="student-meeting-filter-method" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="online">온라인</option>
                                <option value="offline">오프라인</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">상태</label>
                            <select id="student-meeting-filter-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="pending">대기</option>
                                <option value="approved,confirmed">확정</option>
                                <option value="completed">완료</option>
                                <option value="rejected">거절</option>
                                <option value="cancelled">취소</option>
                            </select>
                        </div>
                        <div class="flex items-center justify-end">
                            <button onclick="StudentMeetingList.applyFilters()" class="px-3 bg-[#6A0028] text-white rounded hover:bg-[#4A001C] text-xs font-medium" style="height: 34px;">
                                <i class="fas fa-search mr-1"></i>조회
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 테이블 영역 -->
            <div class="bg-white rounded-lg shadow-md">
                <div class="table-container">
                    <!-- 테이블 헤더 -->
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">실시간지도예약목록</h3>
                            <span class="table-count" id="student-meeting-count">(총 0건)</span>
                        </div>
                        <div class="table-header-right">
                            <button onclick="StudentMeetingModals.openAvailableSlotsModal()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
                                <i class="fas fa-plus"></i>지도 신청
                            </button>
                        </div>
                    </div>

                    <!-- 테이블 -->
                    <div class="table-scroll">
                        <table class="min-w-full">
                            <thead id="student-meeting-table-head">
                                <!-- JavaScript로 동적 렌더링 -->
                            </thead>
                            <tbody id="student-meeting-table-body">
                                <!-- JavaScript로 동적 렌더링 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 초기화
     */
    init() {
        const contentArea = document.getElementById('realtime-reservation-screen');
        if (!contentArea) {
            console.error('realtime-reservation-screen 요소를 찾을 수 없습니다.');
            return;
        }

        contentArea.innerHTML = this.render();
        this.applyFilters();
    },

    /**
     * 필터 적용 및 테이블 렌더링
     */
    applyFilters() {
        const filters = {
            meetingType: document.getElementById('student-meeting-filter-method')?.value || '',
            status: []
        };

        // 상태 필터 처리
        const statusFilter = document.getElementById('student-meeting-filter-status')?.value || '';
        if (statusFilter) {
            filters.status = statusFilter.split(',');
        }

        // 데이터 가져오기 및 필터링
        let applications = StudentMeetingDataService.getMyApplications();

        if (filters.meetingType) {
            applications = applications.filter(app => app.meetingType === filters.meetingType);
        }

        if (filters.status.length > 0) {
            applications = applications.filter(app => filters.status.includes(app.status));
        }

        this.renderTable(applications);
    },

    /**
     * 테이블 렌더링
     */
    renderTable(applications) {
        const thead = document.getElementById('student-meeting-table-head');
        const tbody = document.getElementById('student-meeting-table-body');
        const countSpan = document.getElementById('student-meeting-count');

        if (!thead || !tbody) return;

        // 헤더 렌더링 (교수용과 동일한 구조)
        thead.innerHTML = `
            <tr>
                <th>순번</th>
                <th>미팅일시</th>
                <th>지도방식</th>
                <th>참여인원</th>
                <th>상태</th>
            </tr>
        `;

        countSpan.textContent = `(총 ${applications.length}건)`;

        if (applications.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-gray-500 py-8">
                        검색 결과가 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        // 테이블 행 렌더링
        tbody.innerHTML = applications.map((app, index) => {
            const dateTimeText = MeetingUtils.formatDateTime(app.selectedDate || app.date, app.selectedTime || app.startTime);
            const methodText = MeetingTypeUtils.getMeetingMethodText(app.meetingType);
            const statusText = MeetingStatusUtils.getStatusText(app.status);

            // 참여인원 표시: 교수용과 동일한 로직
            let participantText = '';
            if (app.participants && app.participants.length > 0) {
                // 가나다순 정렬
                const sortedParticipants = [...app.participants].sort((a, b) =>
                    a.name.localeCompare(b.name, 'ko-KR')
                );

                const firstName = sortedParticipants[0].name;
                const remainingCount = sortedParticipants.length - 1;

                if (remainingCount > 0) {
                    participantText = `${firstName} 외 ${remainingCount}명`;
                } else {
                    participantText = firstName;
                }
            } else {
                // 1:1 미팅인 경우
                participantText = app.studentName || '-';
            }

            return `
                <tr onclick="StudentMeetingModals.openDetailModal('${app.id}')" style="cursor: pointer;">
                    <td>${index + 1}</td>
                    <td>${dateTimeText}</td>
                    <td>${methodText}</td>
                    <td>${participantText}</td>
                    <td>${statusText}</td>
                </tr>
            `;
        }).join('');
    },


    /**
     * 새로고침
     */
    refresh() {
        this.applyFilters();
    }
};

// 전역 export
window.StudentMeetingList = StudentMeetingList;

console.log('student-meeting-list.js loaded');
