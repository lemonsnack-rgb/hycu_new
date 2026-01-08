// ==================== 미팅 관리 V3 메인 진입점 ====================

const MeetingMain = {
    currentScreen: 'list',
    currentMeetingId: null,

    init() {
        console.log('Meeting V3 initializing');

        const container = document.getElementById('meeting-content-area');
        if (!container) {
            console.error('meeting-content-area container not found');
            return;
        }

        if (!this.checkDependencies()) {
            console.error('Required modules not loaded');
            container.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <h3 class="text-lg font-semibold text-red-900 mb-2">초기화 실패</h3>
                    <p class="text-sm text-red-700">필수 모듈이 로드되지 않았습니다.</p>
                </div>
            `;
            return;
        }

        this.showList();
        console.log('Meeting V3 initialized');
    },

    checkDependencies() {
        const required = [
            'DataServiceV3',
            'MeetingUtils',
            'MeetingStatusUtils',
            'MeetingTypeUtils',
            'ZoomUtils',
            'MeetingList',
            'MeetingDetail',
            'AvailableSlotModal',
            'DirectMeetingModal',
            'ManageSlotsModal',
            'ApproveMeetingModal',
            'RejectMeetingModal',
            'CompleteMeetingModal'
        ];

        const missing = required.filter(name => typeof window[name] === 'undefined');

        if (missing.length > 0) {
            console.error('Missing modules:', missing);
            return false;
        }

        return true;
    },

    showList() {
        this.currentScreen = 'list';
        this.currentMeetingId = null;

        const container = document.getElementById('meeting-content-area');
        if (!container) return;

        try {
            container.innerHTML = MeetingList.render();

            // 초기 데이터 로드
            MeetingList.applyFilters();

            // 목록 뷰 표시, 상세 뷰 숨김
            const listView = document.getElementById('meeting-list-view');
            const detailView = document.getElementById('meeting-detail-view');
            if (listView) listView.style.display = 'block';
            if (detailView) detailView.style.display = 'none';

            console.log('List view displayed');
        } catch (error) {
            console.error('Failed to render list:', error);
            this.showError('목록을 표시할 수 없습니다.');
        }
    },

    showDetail(meetingId) {
        this.currentScreen = 'detail';
        this.currentMeetingId = meetingId;

        try {
            MeetingDetail.show(meetingId);

            // 목록 뷰 숨김, 상세 뷰 표시
            const listView = document.getElementById('meeting-list-view');
            const detailView = document.getElementById('meeting-detail-view');
            if (listView) listView.style.display = 'none';
            if (detailView) detailView.style.display = 'block';

            console.log('Detail view displayed:', meetingId);
        } catch (error) {
            console.error('Failed to render detail:', error);
            this.showError('상세 정보를 표시할 수 없습니다.');
        }
    },

    showError(message) {
        const container = document.getElementById('meeting-content-area');
        if (!container) return;

        container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <h3 class="text-lg font-semibold text-red-900 mb-2">오류 발생</h3>
                <p class="text-sm text-red-700">${message}</p>
                <button onclick="MeetingMain.showList()"
                        class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    목록으로 돌아가기
                </button>
            </div>
        `;
    },

    refresh() {
        if (this.currentScreen === 'list') {
            if (typeof MeetingList !== 'undefined' && typeof MeetingList.refresh === 'function') {
                MeetingList.refresh();
            } else {
                this.showList();
            }
        } else if (this.currentScreen === 'detail' && this.currentMeetingId) {
            this.showDetail(this.currentMeetingId);
        }
    }
};

function initMeetingV2() {
    console.log('initMeetingV2() called - redirecting to V3');
    MeetingMain.init();
}

function initMeetingV3() {
    MeetingMain.init();
}

// 전역 export
window.MeetingMain = MeetingMain;
window.initMeetingV2 = initMeetingV2;
window.initMeetingV3 = initMeetingV3;

console.log('meeting-v3-main.js loaded');
