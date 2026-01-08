// ==================== 미팅 관리 V3 상세 화면 ====================

/**
 * 미팅 상세 화면 관리
 */
const MeetingDetail = {
    currentMeetingId: null,

    /**
     * 상세 화면 표시
     */
    show(meetingId) {
        this.currentMeetingId = meetingId;
        const meeting = DataServiceV3.getMeetingById(meetingId);

        if (!meeting) {
            alert('미팅 정보를 찾을 수 없습니다.');
            return;
        }

        const container = document.getElementById('meeting-content-area');
        if (!container) return;

        // 미팅 타입에 따라 다른 템플릿 사용
        let detailHtml = '';

        if (meeting.status === 'pending') {
            detailHtml = this.renderPendingDetail(meeting);
        } else if (meeting.status === 'completed') {
            detailHtml = this.renderCompletedDetail(meeting);
        } else {
            // approved, confirmed
            if (meeting.type === 'group' || meeting.type === 'direct_individual') {
                detailHtml = this.renderGroupDetail(meeting);
            } else {
                detailHtml = this.renderConfirmedDetail(meeting);
            }
        }

        container.innerHTML = detailHtml;
    },

    /**
     * 뒤로가기 (목록으로)
     */
    backToList() {
        if (typeof MeetingMain !== 'undefined' && typeof MeetingMain.showList === 'function') {
            MeetingMain.showList();
        }
    },

    /**
     * 대기 중 미팅 상세 (1:1 신청)
     */
    renderPendingDetail(meeting) {
        return `
            <div class="meeting-v3-detail">
                <div class="bg-white rounded-lg shadow-md">
                    <div class="px-6 py-3 border-b">
                        <button onclick="MeetingDetail.backToList()" class="back-to-list-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                            목록으로 돌아가기
                        </button>
                    </div>

                    <!-- 학생 정보 -->
                    ${this.renderStudentInfo(meeting)}

                    <!-- 미팅 정보 -->
                    ${this.renderMeetingInfo(meeting)}

                    <!-- 액션 버튼 -->
                    <div class="px-8 py-6 flex justify-end gap-3">
                        <button onclick="RejectMeetingModal.open('${meeting.id}')"
                                class="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm">
                            거절
                        </button>
                        <button onclick="ApproveMeetingModal.open('${meeting.id}')"
                                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                            승인
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 확정된 미팅 상세 (1:1)
     */
    renderConfirmedDetail(meeting) {
        return `
            <div class="meeting-v3-detail">
                <div class="bg-white rounded-lg shadow-md">
                    <div class="px-6 py-3 border-b">
                        <button onclick="MeetingDetail.backToList()" class="back-to-list-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                            목록으로 돌아가기
                        </button>
                    </div>
                    <!-- 학생 정보 -->
                    ${this.renderStudentInfo(meeting)}

                    <!-- 미팅 정보 -->
                    ${this.renderMeetingInfo(meeting)}

                    <!-- Zoom 정보 -->
                    ${meeting.meetingType === 'online' && meeting.zoomMeetingId ? `
                        <div class="px-8 py-6 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Zoom 미팅 정보</h3>
                            ${ZoomUtils.renderZoomInfoCard(meeting, true)}
                        </div>
                    ` : ''}

                    <!-- 액션 버튼 -->
                    <div class="px-8 py-6 flex justify-end gap-3">
                        <button onclick="CompleteMeetingModal.open('${meeting.id}')"
                                class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034] text-sm">
                            완료 처리
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 그룹/직접 생성 미팅 상세
     */
    renderGroupDetail(meeting) {
        const isGroup = meeting.participantCount >= 2;

        return `
            <div class="meeting-v3-detail">
                <div class="bg-white rounded-lg shadow-md">
                    <div class="px-6 py-3 border-b">
                        <button onclick="MeetingDetail.backToList()" class="back-to-list-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                            목록으로 돌아가기
                        </button>
                    </div>
                    <!-- 참여 학생 목록 -->
                    ${meeting.participants.map((student, index) => `
                        <div class="px-6 py-4 border-b bg-gray-50">
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보 ${meeting.participantCount > 1 ? `(${index + 1}/${meeting.participantCount})` : ''}</h4>
                            <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                                    <span class="text-gray-900 font-medium">${student.collegeType || '-'}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                                    <span class="text-gray-900 font-medium">${student.division || '-'}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                                    <span class="text-gray-900 font-medium">${student.undergradMajor || '-'}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                                    <span class="text-gray-900 font-medium">${student.department || '-'}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                                    <span class="text-gray-900 font-medium">${student.degreeType || '-'}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                                    <span class="text-gray-900 font-medium">${student.enrollmentStatus || '-'}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">학번:</span>
                                    <span class="text-gray-900 font-medium">${student.studentNumber || '-'}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">성명:</span>
                                    <span class="text-gray-900 font-medium">${student.studentName || '-'}</span>
                                </div>
                                <div class="flex gap-2">
                                    <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                                    <span class="text-gray-900 font-medium">${student.advisorName || '-'}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}

                    <!-- 미팅 정보 -->
                    ${this.renderMeetingInfo(meeting)}

                    <!-- Zoom 정보 -->
                    ${meeting.meetingType === 'online' && meeting.zoomMeetingId ? `
                        <div class="px-8 py-6 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Zoom 미팅 정보</h3>
                            ${ZoomUtils.renderZoomInfoCard(meeting, true)}
                        </div>
                    ` : ''}

                    <!-- 액션 버튼 -->
                    <div class="px-8 py-6 flex justify-end gap-3">
                        <button onclick="CompleteMeetingModal.open('${meeting.id}')"
                                class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034] text-sm">
                            완료 처리
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 완료된 미팅 상세
     */
    renderCompletedDetail(meeting) {
        const isGroup = meeting.type === 'group' || (meeting.participants && meeting.participants.length >= 2);

        return `
            <div class="meeting-v3-detail">
                <div class="bg-white rounded-lg shadow-md">
                    <div class="px-6 py-3 border-b">
                        <button onclick="MeetingDetail.backToList()" class="back-to-list-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                            목록으로 돌아가기
                        </button>
                    </div>
                    <!-- 학생 정보 또는 참여자 목록 -->
                    ${isGroup ?
                        meeting.participants.map((student, index) => `
                            <div class="px-6 py-4 border-b bg-gray-50">
                                <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보 (${index + 1}/${meeting.participantCount})</h4>
                                <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                                        <span class="text-gray-900 font-medium">${student.collegeType || '-'}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                                        <span class="text-gray-900 font-medium">${student.division || '-'}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                                        <span class="text-gray-900 font-medium">${student.undergradMajor || '-'}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                                        <span class="text-gray-900 font-medium">${student.department || '-'}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                                        <span class="text-gray-900 font-medium">${student.degreeType || '-'}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                                        <span class="text-gray-900 font-medium">${student.enrollmentStatus || '-'}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">학번:</span>
                                        <span class="text-gray-900 font-medium">${student.studentNumber || '-'}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                                        <span class="text-gray-900 font-medium">${student.studentName || '-'}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                                        <span class="text-gray-900 font-medium">${student.advisorName || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')
                    : this.renderStudentInfo(meeting)}

                    <!-- 미팅 정보 -->
                    ${this.renderMeetingInfo(meeting)}

                    <!-- 완료 정보 -->
                    <div class="px-8 py-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">완료 정보</h3>

                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">완료 날짜</label>
                                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p class="text-gray-900">${MeetingUtils.formatDate(meeting.completedDate)}</p>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">실제 소요 시간</label>
                                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p class="text-gray-900">${MeetingUtils.formatDuration(meeting.actualDuration)}</p>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">녹화 여부</label>
                                <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                    ${meeting.recordingId ? `
                                        <p class="text-green-600 font-medium">녹화됨</p>
                                    ` : `
                                        <p class="text-gray-500">녹화 없음</p>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 녹화 재생 -->
                    ${meeting.recordingUrl ? `
                        <div class="px-8 py-6 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">녹화 영상</h3>

                            <div class="bg-gray-100 rounded-lg p-4">
                                <div class="flex items-center justify-between mb-3">
                                    <div>
                                        <p class="text-sm text-gray-700">
                                            <span class="font-medium">녹화 ID:</span> ${meeting.recordingId}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            소요시간: ${MeetingUtils.formatDuration(meeting.recordingDuration)} |
                                            파일크기: ${meeting.recordingSize}
                                        </p>
                                    </div>

                                    <a href="${meeting.recordingUrl}" target="_blank"
                                       class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034] flex items-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        재생
                                    </a>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * 기본 정보 섹션
     */
    renderBasicInfo(meeting) {
        const statusBadge = MeetingStatusUtils.getStatusBadge(meeting.status);
        const meetingTypeText = MeetingTypeUtils.getMeetingTypeText(meeting);

        return `
            <div class="px-8 py-6 border-b border-gray-200 bg-gray-50">
                <div class="grid grid-cols-4 gap-4 text-sm">
                    <div>
                        <span class="text-gray-600">상태:</span>
                        <span class="ml-2">${statusBadge}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">미팅 타입:</span>
                        <span class="text-gray-900 ml-2 font-medium">${meetingTypeText}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">미팅 ID:</span>
                        <span class="text-gray-900 ml-2 font-mono">${meeting.id}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">생성일:</span>
                        <span class="text-gray-900 ml-2">${MeetingUtils.extractDate(meeting.createdAt || meeting.requestDate)}</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 학생 정보 섹션 (1:1만)
     */
    renderStudentInfo(meeting) {
        return `
            <div class="px-6 py-4 border-b bg-gray-50">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
                <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                        <span class="text-gray-900 font-medium">${meeting.collegeType || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                        <span class="text-gray-900 font-medium">${meeting.division || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                        <span class="text-gray-900 font-medium">${meeting.undergradMajor || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                        <span class="text-gray-900 font-medium">${meeting.department || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                        <span class="text-gray-900 font-medium">${meeting.degreeType || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                        <span class="text-gray-900 font-medium">${meeting.enrollmentStatus || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학번:</span>
                        <span class="text-gray-900 font-medium">${meeting.studentNumber || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                        <span class="text-gray-900 font-medium">${meeting.studentName || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                        <span class="text-gray-900 font-medium">${meeting.advisorName || '-'}</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 미팅 정보 섹션
     */
    renderMeetingInfo(meeting) {
        const meetingMethodText = MeetingTypeUtils.getMeetingMethodText(meeting.meetingType);
        const dateTimeText = MeetingUtils.formatDateTime(meeting.selectedDate || meeting.date, meeting.selectedTime || meeting.startTime);

        return `
            <div class="px-8 py-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">지도 예약 정보</h3>

                <div class="space-y-3">
                    <div class="flex items-center gap-4">
                        <span class="text-sm font-medium text-gray-700 whitespace-nowrap">일시:</span>
                        <span class="text-gray-900">${dateTimeText}</span>

                        <span class="text-sm font-medium text-gray-700 whitespace-nowrap ml-6">지도 방식:</span>
                        <span class="text-gray-900">${meetingMethodText}</span>

                        <span class="text-sm font-medium text-gray-700 whitespace-nowrap ml-6">소요 시간:</span>
                        <span class="text-gray-900">${MeetingUtils.formatDuration(meeting.duration)}</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">미팅 주제</span>
                        <div class="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p class="text-gray-900">${meeting.topic}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// 전역 export
window.MeetingDetail = MeetingDetail;

console.log('meeting-v3-detail.js loaded');
