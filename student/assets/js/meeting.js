// 미팅관리 - 버튼 탭 + 완료된 미팅 + Video.js

// ID 61: 예정된 미팅이 첫번째 탭
let currentMeetingTab = 'approved';

function renderMeeting() {
    const content = document.getElementById('meeting-screen');
    if (!content) return;
    
    content.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">실시간 지도 예약</h2>
        </div>

        <!-- 버튼 탭 (ID 61: 순서 변경 - 예정된 미팅 → 신청 가능한 일정 → 완료된 미팅) -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
            <button onclick="changeMeetingTab('approved')" 
                    class="meeting-tab-btn ${currentMeetingTab==='approved'?'active':''}">
                예정된 미팅 (1)
            </button>
            <button onclick="changeMeetingTab('available')" 
                    class="meeting-tab-btn ${currentMeetingTab==='available'?'active':''}">
                신청 가능한 일정 (3)
            </button>
            <button onclick="changeMeetingTab('completed')" 
                    class="meeting-tab-btn ${currentMeetingTab==='completed'?'active':''}">
                📼 완료된 미팅 (2)
            </button>
        </div>
        
        <div id="meeting-tab-content"></div>
    `;
    
    renderMeetingTabContent();
}

function changeMeetingTab(tab) {
    currentMeetingTab = tab;
    renderMeeting();
}

function renderMeetingTabContent() {
    const tabContent = document.getElementById('meeting-tab-content');
    if (!tabContent) return;
    
    if (currentMeetingTab === 'available') {
        renderAvailableTab();
    } else if (currentMeetingTab === 'approved') {
        renderApprovedTab();
    } else {
        renderCompletedTab();
    }
}

// 신청 가능한 일정 탭
function renderAvailableTab() {
    const tabContent = document.getElementById('meeting-tab-content');
    tabContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600;">신청 가능한 일정</h3>
            </div>
            <div class="card-body">
                <div style="display: grid; gap: 1rem;">
                    <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: white;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="background: #D1FAE5; color: #065F46; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                                2025-11-07 (목)
                            </span>
                            <span style="font-weight: 600; font-size: 1.125rem;">10:00 ~ 11:00</span>
                            <span style="color: #6B7280; font-size: 0.875rem;">(60분)</span>
                        </div>
                        <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.75rem;">
                            <p>김교수 • Zoom 온라인</p>
                        </div>
                        <button onclick="alert('미팅 신청')" style="width: 100%; background: #009DE8; color: white; padding: 0.5rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600;">
                            이 시간에 신청하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 예정된 미팅 탭
function renderApprovedTab() {
    const tabContent = document.getElementById('meeting-tab-content');

    // Mock data
    const approvedMeetings = [
        {
            id: 1,
            professorName: '김교수',
            topic: '연구방법론 논의',
            approvedDate: '2025-11-02',
            selectedDate: '2025-11-07',
            selectedTime: '10:00',
            duration: 60,
            meetingType: 'online',
            zoomMeetingId: '123 456 789',
            zoomPassword: 'abc123',
            zoomJoinUrl: 'https://zoom.us/j/123456789'
        }
    ];

    tabContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600;">예정된 미팅</h3>
            </div>
            <div class="card-body">
                ${approvedMeetings.map(meeting => renderStudentApprovedCard(meeting)).join('')}
            </div>
        </div>
    `;
}

function renderStudentApprovedCard(meeting) {
    const isOnline = meeting.meetingType === 'online';
    const typeText = isOnline ? '온라인' : '대면';

    // 시작-종료 시간 계산
    const startTime = meeting.selectedTime;
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = Math.floor((hours * 60 + minutes + meeting.duration) / 60);
    const endMinutes = (hours * 60 + minutes + meeting.duration) % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

    return `
        <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: white; margin-bottom: 1rem;">
            <div style="display: flex; justify-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <i class="fas fa-chalkboard-teacher" style="color: #3B82F6; font-size: 1.25rem;"></i>
                        <h4 style="font-weight: 600; font-size: 1.125rem;">${meeting.professorName}</h4>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; color: #6B7280; font-size: 0.875rem;">
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <i class="fas fa-${isOnline ? 'video' : 'handshake'}" style="color: ${isOnline ? '#8B5CF6' : '#6B7280'};"></i>
                            <span>${typeText}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <i class="fas fa-calendar-check" style="color: #10B981;"></i>
                            <span>승인일: ${meeting.approvedDate}</span>
                        </div>
                    </div>
                </div>
                <span style="background: #DBEAFE; color: #1E40AF; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                    승인됨
                </span>
            </div>

            <div style="background: #F0FDF4; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                <h5 style="font-weight: 600; color: #065F46; margin-bottom: 0.5rem;">${meeting.topic}</h5>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.875rem; color: #047857;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="far fa-calendar"></i>
                        <span>일시: <span style="font-weight: 500;">${meeting.selectedDate}</span></span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="far fa-clock"></i>
                        <span>시간: <span style="font-weight: 500;">${startTime} - ${endTime}</span></span>
                    </div>
                </div>
            </div>

            ${isOnline ? `
                <div style="background: #F5F3FF; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <i class="fas fa-video" style="color: #7C3AED;"></i>
                        <p style="font-size: 0.75rem; font-weight: 600; color: #5B21B6;">Zoom 미팅 정보</p>
                    </div>
                    <div style="font-size: 0.875rem; color: #6B21A8;">
                        <p>미팅 ID: <span style="font-family: monospace;">${meeting.zoomMeetingId}</span></p>
                        <p>비밀번호: <span style="font-family: monospace;">${meeting.zoomPassword}</span></p>
                    </div>
                </div>
                <button onclick="window.open('${meeting.zoomJoinUrl}')"
                        style="width: 100%; background: #009DE8; color: white; padding: 0.625rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <i class="fas fa-video"></i>
                    Zoom 참여하기
                </button>
            ` : `
                <div style="background: #F3F4F6; padding: 1rem; border-radius: 0.5rem; text-align: center; color: #6B7280; font-size: 0.875rem;">
                    대면 미팅입니다
                </div>
            `}
        </div>
    `;
}

// 완료된 미팅 탭 (Video.js 포함)
function renderCompletedTab() {
    const tabContent = document.getElementById('meeting-tab-content');

    // Mock completed meetings data
    const completedMeetings = [
        {
            id: 1,
            completedDate: '2025-10-21',
            professorName: '김교수',
            topic: '논문 주제 선정',
            meetingType: 'online',
            selectedDate: '2025-10-21',
            selectedTime: '14:00',
            actualDuration: 55,
            recordingUrl: 'https://zoom.us/rec/play/example1',
            recordingDuration: 55,
            recordingSize: '245MB'
        },
        {
            id: 2,
            completedDate: '2025-10-15',
            professorName: '김교수',
            topic: '선행연구 검토',
            meetingType: 'offline',
            selectedDate: '2025-10-15',
            selectedTime: '10:00',
            actualDuration: 90
        }
    ];

    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <h3 class="text-lg font-bold">완료된 미팅 (${completedMeetings.length}건)</h3>
                <p class="text-sm text-gray-600 mt-1">완료된 미팅 이력을 조회합니다</p>
            </div>

            ${completedMeetings.length > 0 ? `
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-20">번호</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-32">완료일</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-24">교수명</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">주제</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-24">유형</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-32">일시</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-24">실제시간</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${completedMeetings.map((meeting, index) => renderCompletedRow(meeting, index + 1)).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="text-center py-12 text-gray-500">
                    <p>완료된 미팅이 없습니다</p>
                </div>
            `}
        </div>
    `;
}

function renderCompletedRow(meeting, index) {
    const typeText = meeting.meetingType === 'online' ? '온라인' : '대면';

    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${index}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${meeting.completedDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${meeting.professorName}</td>
            <td class="px-6 py-4 text-sm text-blue-600 hover:text-blue-800 td-truncate-long cursor-pointer"
                title="${meeting.topic}"
                onclick="viewStudentMeetingDetail(${meeting.id})">
                ${meeting.topic}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 text-xs rounded ${meeting.meetingType === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                    ${typeText}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${meeting.selectedDate} ${meeting.selectedTime}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${meeting.actualDuration}분</td>
        </tr>
    `;
}

// 녹화본 재생 모달 (학생용)
function openStudentRecordingModal(meetingId) {
    // Mock data에서 찾기
    const meetings = [
        {
            id: 1,
            completedDate: '2025-10-21',
            professorName: '김교수',
            topic: '논문 주제 선정',
            meetingType: 'online',
            selectedDate: '2025-10-21',
            selectedTime: '14:00',
            actualDuration: 55,
            recordingUrl: 'https://zoom.us/rec/play/example1',
            recordingDuration: 55,
            recordingSize: '245MB'
        },
        {
            id: 2,
            completedDate: '2025-10-15',
            professorName: '김교수',
            topic: '선행연구 검토',
            meetingType: 'offline',
            selectedDate: '2025-10-15',
            selectedTime: '10:00',
            actualDuration: 90
        }
    ];

    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting || !meeting.recordingUrl) return;

    const modalHtml = `
        <div id="recording-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeStudentRecordingModal(event)">
            <div class="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                <div class="p-6 border-b flex justify-between items-center">
                    <h3 class="text-lg font-bold">녹화본 재생</h3>
                    <button onclick="closeStudentRecordingModal()" class="text-gray-500 hover:text-gray-800">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="p-6">
                    <div class="mb-4">
                        <p class="text-sm text-gray-600 mb-1">교수: ${meeting.professorName}</p>
                        <p class="text-sm text-gray-600 mb-1">주제: ${meeting.topic}</p>
                        <p class="text-sm text-gray-600">일시: ${meeting.selectedDate} ${meeting.selectedTime}</p>
                    </div>

                    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p class="text-sm font-semibold text-red-900">Zoom 클라우드 녹화본</p>
                        <p class="text-xs text-red-700">${meeting.recordingDuration}분 · ${meeting.recordingSize}</p>
                    </div>

                    <div class="aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                            id="student-video-player"
                            class="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            preload="auto"
                            style="width: 100%; height: 100%;">
                            <source src="${meeting.recordingUrl}" type="video/mp4">
                            <p class="vjs-no-js">비디오를 재생하려면 JavaScript를 활성화하세요.</p>
                        </video>
                    </div>

                    <div class="mt-4 flex justify-between items-center">
                        <a href="${meeting.recordingUrl}" target="_blank" download class="text-sm text-blue-600 hover:text-blue-800">
                            다운로드
                        </a>
                        <button onclick="closeStudentRecordingModal()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Video.js 초기화
    setTimeout(() => {
        const player = videojs('student-video-player', {
            controls: true,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2]
        });
        window.currentStudentVideoPlayer = player;
    }, 100);
}

function closeStudentRecordingModal(event) {
    if (event && event.target.id !== 'recording-modal') return;

    if (window.currentStudentVideoPlayer) {
        window.currentStudentVideoPlayer.dispose();
        window.currentStudentVideoPlayer = null;
    }

    const modal = document.getElementById('recording-modal');
    if (modal) {
        modal.remove();
    }
}

// 완료된 미팅 상세보기 모달 (학생용)
function viewStudentMeetingDetail(meetingId) {
    const meetings = [
        {
            id: 1,
            completedDate: '2025-10-21',
            professorName: '김교수',
            topic: '논문 주제 선정',
            meetingType: 'online',
            selectedDate: '2025-10-21',
            selectedTime: '14:00',
            actualDuration: 55,
            recordingUrl: 'https://zoom.us/rec/play/example1',
            recordingDuration: 55,
            recordingSize: '245MB'
        },
        {
            id: 2,
            completedDate: '2025-10-15',
            professorName: '김교수',
            topic: '선행연구 검토',
            meetingType: 'offline',
            selectedDate: '2025-10-15',
            selectedTime: '10:00',
            actualDuration: 90
        }
    ];

    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    // 현재 미팅 ID 저장
    window.currentMeetingDetailId = meetingId;

    // 상세 페이지 렌더링
    renderStudentMeetingDetailPage(meeting);
}

function renderStudentMeetingDetailPage(meeting) {
    const typeText = meeting.meetingType === 'online' ? '온라인' : '대면';
    const hasRecording = meeting.recordingUrl;
    const tabContent = document.getElementById('meeting-tab-content');

    tabContent.innerHTML = `
        <div class="card">
            <!-- 헤더: 뒤로가기 버튼 -->
            <div class="card-header" style="display: flex; align-items: center; gap: 1rem;">
                <button onclick="backToStudentCompletedList()" style="background: none; border: none; cursor: pointer; color: #666; font-size: 1.25rem;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h3 style="font-size: 1.125rem; font-weight: 600; margin: 0;">완료된 미팅 상세정보</h3>
            </div>

            <!-- 본문 -->
            <div class="card-body">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">교수명</p>
                        <p style="font-weight: 500; font-size: 1.125rem;">${meeting.professorName}</p>
                    </div>
                    <div>
                        <p style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">완료일</p>
                        <p style="font-weight: 500; font-size: 1.125rem;">${meeting.completedDate}</p>
                    </div>
                    <div>
                        <p style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">유형</p>
                        <p style="font-weight: 500;">
                            <span style="background: ${meeting.meetingType === 'online' ? '#EDE9FE' : '#F3F4F6'}; color: ${meeting.meetingType === 'online' ? '#5B21B6' : '#374151'}; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem;">
                                ${typeText}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">실제 소요시간</p>
                        <p style="font-weight: 500; font-size: 1.125rem;">${meeting.actualDuration}분</p>
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <p style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.5rem;">주제</p>
                    <p style="font-weight: 500; font-size: 1.125rem;">${meeting.topic}</p>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <p style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.5rem;">예정 일시</p>
                    <p style="font-weight: 500; font-size: 1.125rem;">${meeting.selectedDate} ${meeting.selectedTime}</p>
                </div>

                ${hasRecording ? `
                    <div style="margin-bottom: 1.5rem;">
                        <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                            <p style="font-weight: 600; color: #7F1D1D; font-size: 0.875rem; margin-bottom: 0.25rem;">Zoom 클라우드 녹화본</p>
                            <p style="color: #991B1B; font-size: 0.75rem;">${meeting.recordingDuration}분 · ${meeting.recordingSize}</p>
                        </div>

                        <div style="aspect-ratio: 16/9; background: black; border-radius: 0.5rem; overflow: hidden; margin-bottom: 1rem;">
                            <video
                                id="student-detail-video-player"
                                class="video-js vjs-default-skin vjs-big-play-centered"
                                controls
                                preload="auto"
                                style="width: 100%; height: 100%;">
                                <source src="${meeting.recordingUrl}" type="video/mp4">
                                <p class="vjs-no-js">비디오를 재생하려면 JavaScript를 활성화하세요.</p>
                            </video>
                        </div>

                        <div>
                            <a href="${meeting.recordingUrl}" target="_blank" download style="display: inline-block; padding: 0.5rem 1rem; background: #2563EB; color: white; border-radius: 0.375rem; text-decoration: none; font-size: 0.875rem;">
                                <i class="fas fa-download" style="margin-right: 0.5rem;"></i>다운로드
                            </a>
                        </div>
                    </div>
                ` : meeting.meetingType === 'online' ? `
                    <div style="background: #F3F4F6; padding: 1rem; border-radius: 0.5rem; text-align: center; margin-bottom: 1.5rem;">
                        <p style="color: #6B7280; font-size: 0.875rem;">녹화본이 없습니다</p>
                    </div>
                ` : ''}

                <div style="display: flex; justify-content: flex-end; border-top: 1px solid #E5E7EB; padding-top: 1.5rem;">
                    <button onclick="backToStudentCompletedList()" style="padding: 0.5rem 1.5rem; background: #E5E7EB; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
                        목록으로
                    </button>
                </div>
            </div>
        </div>
    `;

    // Video.js 초기화 (녹화본이 있는 경우)
    if (hasRecording) {
        setTimeout(() => {
            const player = videojs('student-detail-video-player', {
                controls: true,
                autoplay: false,
                preload: 'auto',
                fluid: true,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2]
            });
            window.currentStudentDetailVideoPlayer = player;
        }, 100);
    }
}

// 목록으로 돌아가기
function backToStudentCompletedList() {
    // Video.js 플레이어 정리
    if (window.currentStudentDetailVideoPlayer) {
        window.currentStudentDetailVideoPlayer.dispose();
        window.currentStudentDetailVideoPlayer = null;
    }

    // 완료된 미팅 목록 다시 렌더링
    renderCompletedTab();
}

// Video.js 재생 함수
function playRecording(recId) {
    const playerDiv = document.getElementById(`player-${recId}`);
    if (!playerDiv) return;
    
    playerDiv.style.display = 'block';
    
    const videoElement = document.getElementById(`video-player-${recId}`);
    if (videoElement && !videoElement.player) {
        if (typeof videojs !== 'undefined') {
            videoElement.player = videojs(`video-player-${recId}`, {
                controls: true,
                autoplay: false,
                preload: 'auto',
                fluid: true,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2]
            });
        }
    }
}

function hideRecording(recId) {
    const playerDiv = document.getElementById(`player-${recId}`);
    if (playerDiv) {
        const videoElement = document.getElementById(`video-player-${recId}`);
        if (videoElement && videoElement.player) {
            videoElement.player.pause();
        }
        playerDiv.style.display = 'none';
    }
}
