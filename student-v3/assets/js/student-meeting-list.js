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
            <div class="table-container">
                <!-- 테이블 헤더 -->
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">내 신청 내역</h3>
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
        this.showMyApplications();
    },

    /**
     * 지도가능 시간 목록 표시
     */
    showAvailableSlots() {
        this.currentView = 'available';

        const thead = document.getElementById('student-meeting-table-head');
        const tbody = document.getElementById('student-meeting-table-body');
        const countSpan = document.getElementById('student-meeting-count');
        const titleEl = document.querySelector('.table-title');

        if (!thead || !tbody) return;

        // 타이틀 변경
        if (titleEl) {
            titleEl.textContent = '지도가능 시간';
        }

        // 헤더 렌더링
        thead.innerHTML = `
            <tr>
                <th style="width: 60px;">순번</th>
                <th style="width: 200px;">미팅일시</th>
                <th style="width: 120px;">지도교수명</th>
                <th style="width: 100px;">지도방식</th>
                <th style="width: 100px;">신청</th>
            </tr>
        `;

        // 데이터 가져오기
        const slots = StudentMeetingDataService.getAvailableSlots();
        countSpan.textContent = `(총 ${slots.length}건)`;

        if (slots.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-gray-500 py-8">
                        신청 가능한 지도 시간이 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        // 테이블 행 렌더링
        tbody.innerHTML = slots.map((slot, index) => {
            const dateTimeText = MeetingUtils.formatDateTime(slot.date, slot.time);
            const methodText = MeetingTypeUtils.getMeetingMethodText(slot.meetingType);

            return `
                <tr class="hover:bg-gray-50">
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">${dateTimeText}</td>
                    <td class="text-center">${slot.professorName || '-'}</td>
                    <td class="text-center">${methodText}</td>
                    <td class="text-center">
                        <button onclick="StudentMeetingModals.openApplyModal('${slot.id}')"
                                class="px-4 py-2 bg-[#6A0028] text-white rounded hover:bg-[#8A0034] text-sm">
                            신청
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * 내 신청 내역 표시
     */
    showMyApplications() {
        const thead = document.getElementById('student-meeting-table-head');
        const tbody = document.getElementById('student-meeting-table-body');
        const countSpan = document.getElementById('student-meeting-count');

        if (!thead || !tbody) return;

        // 헤더 렌더링
        thead.innerHTML = `
            <tr>
                <th style="width: 60px;">순번</th>
                <th style="width: 200px;">미팅일시</th>
                <th style="width: 120px;">지도교수명</th>
                <th style="width: 100px;">지도방식</th>
                <th style="width: 100px;">상태</th>
            </tr>
        `;

        // 데이터 가져오기
        const applications = StudentMeetingDataService.getMyApplications();
        countSpan.textContent = `(총 ${applications.length}건)`;

        if (applications.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-gray-500 py-8">
                        신청 내역이 없습니다.
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

            return `
                <tr class="hover:bg-gray-50 cursor-pointer" onclick="StudentMeetingModals.openDetailModal('${app.id}')">
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">${dateTimeText}</td>
                    <td class="text-center">${app.advisorName || '-'}</td>
                    <td class="text-center">${methodText}</td>
                    <td class="text-center">
                        <span class="font-medium">${statusText}</span>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * 새로고침
     */
    refresh() {
        this.showMyApplications();
    }
};

// 전역 export
window.StudentMeetingList = StudentMeetingList;

console.log('student-meeting-list.js loaded');
