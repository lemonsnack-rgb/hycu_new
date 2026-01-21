/**
 * 학생용 실시간 지도 예약 - 모달
 * Version: 20260108001
 */

const StudentMeetingModals = {
    /**
     * 지도가능 시간 목록 모달 열기
     */
    openAvailableSlotsModal() {
        // 기존 모달 제거
        const existingModal = document.getElementById('available-slots-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'available-slots-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

        // 데이터 가져오기
        const slots = StudentMeetingDataService.getAvailableSlots();

        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <!-- 헤더 -->
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-900">지도가능 시간</h3>
                    <button onclick="StudentMeetingModals.closeAvailableSlotsModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- 본문 -->
                <div class="px-6 py-4">
                    ${slots.length === 0 ? `
                        <div class="text-center text-gray-500 py-8">
                            신청 가능한 지도 시간이 없습니다.
                        </div>
                    ` : `
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th style="width: 60px;" class="px-3 py-2 border-b text-center text-xs font-medium text-gray-700">순번</th>
                                    <th style="width: 200px;" class="px-3 py-2 border-b text-center text-xs font-medium text-gray-700">미팅일시</th>
                                    <th style="width: 120px;" class="px-3 py-2 border-b text-center text-xs font-medium text-gray-700">지도교수명</th>
                                    <th style="width: 100px;" class="px-3 py-2 border-b text-center text-xs font-medium text-gray-700">지도방식</th>
                                    <th style="width: 100px;" class="px-3 py-2 border-b text-center text-xs font-medium text-gray-700">신청</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${slots.map((slot, index) => {
                                    const dateTimeText = MeetingUtils.formatDateTime(slot.date, slot.time);
                                    const methodText = MeetingTypeUtils.getMeetingMethodText(slot.meetingType);

                                    return `
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-3 py-3 border-b text-center text-sm">${index + 1}</td>
                                            <td class="px-3 py-3 border-b text-center text-sm">${dateTimeText}</td>
                                            <td class="px-3 py-3 border-b text-center text-sm">${slot.professorName || '-'}</td>
                                            <td class="px-3 py-3 border-b text-center text-sm">${methodText}</td>
                                            <td class="px-3 py-3 border-b text-center">
                                                <button onclick="StudentMeetingModals.openApplyModal('${slot.id}')"
                                                        class="px-4 py-2 bg-[#6A0028] text-white rounded hover:bg-[#8A0034] text-sm">
                                                    신청
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    `}
                </div>

                <!-- 푸터 -->
                <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button onclick="StudentMeetingModals.closeAvailableSlotsModal()"
                            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
                        닫기
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    /**
     * 지도가능 시간 목록 모달 닫기
     */
    closeAvailableSlotsModal() {
        const modal = document.getElementById('available-slots-modal');
        if (modal) {
            modal.remove();
        }
    },

    /**
     * 신청 모달 열기
     */
    openApplyModal(slotId) {
        // 슬롯 정보 가져오기
        const slot = AVAILABLE_SLOTS_V3.find(s => s.id === slotId);
        if (!slot) {
            alert('슬롯 정보를 찾을 수 없습니다.');
            return;
        }

        // 기존 모달 제거
        const existingModal = document.getElementById('student-apply-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'student-apply-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

        const dateText = MeetingUtils.formatDate(slot.date);
        const methodText = MeetingTypeUtils.getMeetingMethodText(slot.meetingType);
        const durationText = MeetingUtils.formatDuration(slot.duration);

        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
                <!-- 헤더 -->
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-900">지도 예약 신청</h3>
                    <button onclick="StudentMeetingModals.closeApplyModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- 본문 -->
                <div class="px-6 py-4 space-y-4">
                    <!-- 선택된 시간 정보 -->
                    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-2">선택하신 지도 시간</h4>
                        <div class="text-sm text-gray-700 space-y-1">
                            <p><strong>날짜:</strong> ${dateText}</p>
                            <p><strong>시간:</strong> ${slot.time}</p>
                            <p><strong>지도방식:</strong> ${methodText}</p>
                            <p><strong>소요시간:</strong> ${durationText}</p>
                            <p><strong>지도교수:</strong> ${slot.professorName || '-'}</p>
                        </div>
                    </div>

                    <!-- 신청 메모 입력 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            신청 메모 (선택사항)
                        </label>
                        <textarea id="apply-memo"
                                  rows="4"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028] focus:border-[#6A0028] text-sm"
                                  placeholder="지도받고 싶은 내용이나 논의하고 싶은 주제를 간단히 작성해주세요."></textarea>
                    </div>
                </div>

                <!-- 푸터 -->
                <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                    <button onclick="StudentMeetingModals.closeApplyModal()"
                            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
                        취소
                    </button>
                    <button onclick="StudentMeetingModals.submitApplication('${slotId}')"
                            class="px-4 py-2 bg-[#6A0028] text-white rounded hover:bg-[#8A0034] text-sm">
                        신청하기
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    /**
     * 신청 모달 닫기
     */
    closeApplyModal() {
        const modal = document.getElementById('student-apply-modal');
        if (modal) {
            modal.remove();
        }
    },

    /**
     * 신청 제출
     */
    submitApplication(slotId) {
        // 메모 입력값 가져오기
        const memo = document.getElementById('apply-memo')?.value?.trim() || '';

        // 신청 처리
        const result = StudentMeetingDataService.applyForSlot(slotId, memo);

        if (result) {
            alert('지도 예약 신청이 완료되었습니다.');
            this.closeApplyModal();
            this.closeAvailableSlotsModal();
            StudentMeetingList.refresh();
        } else {
            alert('신청 처리 중 오류가 발생했습니다.');
        }
    },

    /**
     * 상세 모달 열기
     */
    openDetailModal(meetingId) {
        const meeting = StudentMeetingDataService.getApplicationDetail(meetingId);
        if (!meeting) {
            alert('신청 정보를 찾을 수 없습니다.');
            return;
        }

        // 기존 모달 제거
        const existingModal = document.getElementById('student-detail-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'student-detail-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

        const dateText = MeetingUtils.formatDate(meeting.selectedDate || meeting.date);
        const methodText = MeetingTypeUtils.getMeetingMethodText(meeting.meetingType);
        const durationText = MeetingUtils.formatDuration(meeting.duration);
        const statusText = MeetingStatusUtils.getStatusText(meeting.status);
        const statusBadge = MeetingStatusUtils.getStatusBadge(meeting.status);

        // 액션 버튼 (대기중만 취소 가능)
        const actionButtons = meeting.status === 'pending' ? `
            <button onclick="StudentMeetingModals.cancelApplication('${meetingId}')"
                    class="px-4 py-2 border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white text-sm">
                신청 취소
            </button>
        ` : '';

        // Zoom 정보 (확정되고 온라인인 경우)
        const zoomInfo = (meeting.status === 'approved' || meeting.status === 'confirmed') &&
                         meeting.meetingType === 'online' &&
                         meeting.zoomMeetingId ? `
            <div class="border-t border-gray-200 pt-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Zoom 미팅 정보</h4>
                ${ZoomUtils.renderZoomInfoCard(meeting, false)}
            </div>
        ` : '';

        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <!-- 헤더 -->
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-900">지도 예약 상세</h3>
                    <button onclick="StudentMeetingModals.closeDetailModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- 본문 -->
                <div class="px-6 py-4 space-y-6">
                    <!-- 상태 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">상태</label>
                        <div>${statusBadge}</div>
                    </div>

                    <!-- 지도 예약 정보 -->
                    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-3">지도 예약 정보</h4>
                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span class="text-gray-600">날짜:</span>
                                <span class="text-gray-900 font-medium ml-2">${dateText}</span>
                            </div>
                            <div>
                                <span class="text-gray-600">시간:</span>
                                <span class="text-gray-900 font-medium ml-2">${meeting.selectedTime || meeting.startTime}</span>
                            </div>
                            <div>
                                <span class="text-gray-600">지도방식:</span>
                                <span class="text-gray-900 font-medium ml-2">${methodText}</span>
                            </div>
                            <div>
                                <span class="text-gray-600">소요시간:</span>
                                <span class="text-gray-900 font-medium ml-2">${durationText}</span>
                            </div>
                            <div class="col-span-2">
                                <span class="text-gray-600">지도교수:</span>
                                <span class="text-gray-900 font-medium ml-2">${meeting.advisorName || '-'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 신청 메모 -->
                    ${meeting.topic && meeting.topic !== '지도 예약 신청' ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">신청 메모</label>
                            <div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900">
                                ${meeting.topic}
                            </div>
                        </div>
                    ` : ''}

                    <!-- 거절 사유 (거절된 경우) -->
                    ${meeting.status === 'rejected' && meeting.rejectionReason ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">거절 사유</label>
                            <div class="px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-900">
                                ${meeting.rejectionReason}
                            </div>
                        </div>
                    ` : ''}

                    <!-- 완료 정보 (완료된 경우) -->
                    ${meeting.status === 'completed' ? `
                        <div class="border-t border-gray-200 pt-6">
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">완료 정보</h4>

                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">완료 날짜</label>
                                    <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p class="text-gray-900">${meeting.completedDate ? MeetingUtils.formatDate(meeting.completedDate) : '-'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Zoom 비밀번호</label>
                                    <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p class="text-gray-900 font-mono">${meeting.meetingType === 'online' ? (meeting.videoPassword || '-') : '-'}</p>
                                    </div>
                                </div>
                            </div>

                            ${meeting.meetingType === 'online' && meeting.videoPassword ? `
                                <div class="flex gap-3">
                                    <button onclick="window.open('${meeting.recordingPlayUrl || '#'}', '_blank')"
                                            class="flex-1 px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034] flex items-center justify-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        재생
                                    </button>
                                    <button onclick="window.open('${meeting.recordingDownloadUrl || '#'}', '_blank')"
                                            class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                        </svg>
                                        다운로드
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}

                    <!-- Zoom 정보 -->
                    ${zoomInfo}
                </div>

                <!-- 푸터 -->
                <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                    ${actionButtons}
                    <button onclick="StudentMeetingModals.closeDetailModal()"
                            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
                        닫기
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    /**
     * 상세 모달 닫기
     */
    closeDetailModal() {
        const modal = document.getElementById('student-detail-modal');
        if (modal) {
            modal.remove();
        }
    },

    /**
     * 신청 취소
     */
    cancelApplication(meetingId) {
        if (!confirm('지도 예약 신청을 취소하시겠습니까?')) {
            return;
        }

        const result = StudentMeetingDataService.cancelApplication(meetingId);

        if (result) {
            alert('신청이 취소되었습니다.');
            this.closeDetailModal();
            StudentMeetingList.refresh();
        } else {
            alert('취소 처리 중 오류가 발생했습니다.');
        }
    }
};

// 전역 export
window.StudentMeetingModals = StudentMeetingModals;

console.log('student-meeting-modals.js loaded');
