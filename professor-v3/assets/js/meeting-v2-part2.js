// Phase 3 재설계: 랩미팅관리 Part 2 (예정/완료 탭)

// ==================== 예정된 미팅 탭 ====================
function renderApprovedTab() {
    const approved = DataService.getMeetingRequestsV2('approved');
    const tabContent = document.getElementById('meeting-tab-content');
    
    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6">
            ${approved.length > 0 ? `
                <div class="space-y-4">
                    ${approved.map(req => renderApprovedCard(req)).join('')}
                </div>
            ` : `
                <div class="text-center py-12 text-gray-500">
                    <p>예정된 미팅이 없습니다</p>
                </div>
            `}
        </div>
    `;
}

function renderApprovedCard(req) {
    const typeText = req.meetingType === 'online' ? '온라인' : '대면';
    const isOnline = req.meetingType === 'online';

    // 시작-종료 시간 계산
    const startTime = req.selectedTime;
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = Math.floor((hours * 60 + minutes + req.duration) / 60);
    const endMinutes = (hours * 60 + minutes + req.duration) % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

    return `
        <div class="approved-card">
            <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-user-graduate text-[#6A0028]" style="font-size: 1.25rem;"></i>
                        <span class="font-semibold text-lg">${req.studentName}</span>
                        <span class="text-sm text-gray-500">(${req.studentNumber})</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-gray-600">
                        <div class="flex items-center gap-1">
                            <i class="fas fa-${isOnline ? 'video' : 'handshake'}" style="color: ${isOnline ? '#8B5CF6' : '#6B7280'};"></i>
                            <span>${typeText}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <i class="fas fa-calendar-check" style="color: #10B981;"></i>
                            <span>승인일: ${req.approvedDate}</span>
                        </div>
                    </div>
                </div>
                <span class="badge-blue">승인됨</span>
            </div>

            <div class="bg-green-50 p-4 rounded-lg mb-3">
                <h4 class="font-semibold text-green-900 mb-3">${req.topic}</h4>
                <div class="grid grid-cols-2 gap-3 text-sm text-green-800">
                    <div class="flex items-center gap-2">
                        <i class="far fa-calendar" style="color: #059669;"></i>
                        <span>일시: <span class="font-medium">${req.selectedDate}</span></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="far fa-clock" style="color: #059669;"></i>
                        <span>시간: <span class="font-medium">${startTime} - ${endTime}</span></span>
                    </div>
                </div>
            </div>

            ${isOnline && req.zoomJoinUrl ? `
                <div class="bg-purple-50 p-4 rounded-lg mb-3 border-l-4 border-purple-400">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-video" style="color: #7C3AED;"></i>
                        <p class="text-xs font-semibold text-purple-800">Zoom 미팅 정보</p>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div>
                            <span class="text-purple-700">미팅 ID:</span>
                            <span class="text-purple-900 font-mono ml-2">${req.zoomMeetingId}</span>
                        </div>
                        <div>
                            <span class="text-purple-700">참가 링크:</span>
                            <a href="${req.zoomJoinUrl}" target="_blank" class="text-[#6A0028] hover:underline ml-2 break-all">
                                ${req.zoomJoinUrl}
                            </a>
                        </div>
                        ${req.zoomPassword ? `
                            <div>
                                <span class="text-purple-700">비밀번호:</span>
                                <span class="text-purple-900 font-mono ml-2">${req.zoomPassword}</span>
                            </div>
                        ` : ''}
                        <div class="pt-2 border-t border-purple-200">
                            <span class="text-purple-700">교수 시작 링크:</span>
                            <a href="${req.zoomStartUrl}" target="_blank" class="text-[#6A0028] hover:underline ml-2 break-all">
                                미팅 시작하기
                            </a>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="flex gap-2">
                ${isOnline ? `
                    <button onclick="openZoomWindow('${req.zoomStartUrl}')" class="btn-primary flex-1 flex items-center justify-center gap-2">
                        <i class="fas fa-video"></i>
                        Zoom 시작
                    </button>
                    <button onclick="completeMeetingV2('${req.id}')" class="btn-secondary flex-1 flex items-center justify-center gap-2">
                        <i class="fas fa-check-circle"></i>
                        완료 처리
                    </button>
                ` : `
                    <button onclick="completeMeetingV2('${req.id}')" class="btn-primary flex-1 flex items-center justify-center gap-2">
                        <i class="fas fa-check-circle"></i>
                        완료 처리
                    </button>
                `}
            </div>
        </div>
    `;
}

function openZoomWindow(startUrl) {
    window.open(startUrl, '_blank', 'width=1200,height=800');
}

function completeMeetingV2(reqId) {
    const req = DataService.getMeetingDetailV2(reqId);
    if (!req) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // ID 37: 미팅 요약 폼, 줌 녹화본 확인 체크박스 삭제
    const content = `
        <form id="complete-meeting-form" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded">
                <p><span class="font-medium">학생:</span> ${req.studentName}</p>
                <p><span class="font-medium">주제:</span> ${req.topic}</p>
                <p><span class="font-medium">예정:</span> ${req.selectedDate} ${req.selectedTime} (${req.duration}분)</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">완료일 *</label>
                    <input type="date" name="completedDate" value="${today}" class="input" required>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">실제 소요시간(분) *</label>
                    <input type="number" name="actualDuration" value="${req.duration}" min="1" class="input" required>
                </div>
            </div>
        </form>
    `;
    
    createModal('미팅 완료 처리', content, [
        {text: '취소', className: 'btn-secondary', onclick: 'return;'},
        {text: '완료', className: 'btn-primary', onclick: `confirmCompleteV2('${reqId}')`}
    ]);
}

function confirmCompleteV2(reqId) {
    const form = document.getElementById('complete-meeting-form');
    const fd = new FormData(form);
    
    if (!fd.get('completedDate') || !fd.get('actualDuration')) {
        showToast('필수 항목을 입력하세요', 'warning');
        return;
    }
    
    const data = {
        completedDate: fd.get('completedDate'),
        actualDuration: parseInt(fd.get('actualDuration'))
    };
    
    DataService.completeMeetingV2(reqId, data);
    showToast('미팅이 완료 처리되었습니다', 'success');
    setTimeout(() => renderMeetingMainV2(), 100);
}

// ==================== 완료된 미팅 탭 ====================
function renderCompletedTab() {
    const completed = DataService.getMeetingRequestsV2('completed');
    const tabContent = document.getElementById('meeting-tab-content');

    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            ${completed.length > 0 ? `
                <div class="table-container">
                    <div class="table-scroll">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th style="width: 60px;">번호</th>
                                    <th style="width: 100px;">완료일</th>
                                    <th style="width: 80px;">학생명</th>
                                    <th style="width: 100px;">학번</th>
                                    <th style="min-width: 200px;">주제</th>
                                    <th style="width: 80px;">유형</th>
                                    <th style="width: 120px;">일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${completed.map((req, index) => renderCompletedRow(req, index + 1)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : `
                <div class="text-center py-12 text-gray-500">
                    <p>완료된 미팅이 없습니다</p>
                </div>
            `}
        </div>
    `;
}

function renderCompletedRow(req, index) {
    const typeText = req.meetingType === 'online' ? '온라인' : '대면';

    return `
        <tr>
            <td>${index}</td>
            <td>${req.completedDate}</td>
            <td>${req.studentName}</td>
            <td>${req.studentNumber}</td>
            <td class="cursor-pointer" style="color: #6A0028;"
                title="${req.topic}"
                onclick="viewCompletedMeetingDetail('${req.id}')">
                <div class="cell-truncate">${req.topic}</div>
            </td>
            <td>
                <span class="px-2 py-1 text-xs rounded ${req.meetingType === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                    ${typeText}
                </span>
            </td>
            <td>${req.selectedDate} ${req.selectedTime}</td>
        </tr>
    `;
}

// 녹화본 재생 모달
function openRecordingModal(reqId) {
    const meetings = DataService.getMeetingRequestsV2('completed');
    const req = meetings.find(m => m.id === reqId);
    if (!req || !req.recordingUrl) return;

    const modalHtml = `
        <div id="recording-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeRecordingModal(event)">
            <div class="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                <div class="p-6 border-b flex justify-between items-center">
                    <h3 class="text-lg font-bold">녹화본 재생</h3>
                    <button onclick="closeRecordingModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="p-6">
                    <div class="mb-4">
                        <p class="text-sm text-gray-600 mb-1">학생: ${req.studentName} (${req.studentNumber})</p>
                        <p class="text-sm text-gray-600 mb-1">주제: ${req.topic}</p>
                        <p class="text-sm text-gray-600">일시: ${req.selectedDate} ${req.selectedTime}</p>
                    </div>

                    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p class="text-sm font-semibold text-red-900">Zoom 클라우드 녹화본</p>
                        <p class="text-xs text-red-700">${req.recordingDuration}분 · ${req.recordingSize}</p>
                    </div>

                    <div class="aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                            id="modal-video-player"
                            class="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            preload="auto"
                            style="width: 100%; height: 100%;">
                            <source src="${req.recordingUrl}" type="video/mp4">
                            <p class="vjs-no-js">비디오를 재생하려면 JavaScript를 활성화하세요.</p>
                        </video>
                    </div>

                    <div class="mt-4 flex justify-between items-center">
                        <a href="${req.recordingUrl}" target="_blank" download class="text-sm text-[#6A0028] hover:text-[#6A0028]">
                            다운로드
                        </a>
                        <button onclick="closeRecordingModal()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">
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
        const player = videojs('modal-video-player', {
            controls: true,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
            controlBar: {
                children: [
                    'playToggle',
                    'volumePanel',
                    'currentTimeDisplay',
                    'timeDivider',
                    'durationDisplay',
                    'progressControl',
                    'playbackRateMenuButton',
                    'fullscreenToggle'
                ]
            }
        });
        window.currentVideoPlayer = player;
    }, 100);
}

function closeRecordingModal(event) {
    if (event && event.target.id !== 'recording-modal') return;

    // Video.js 플레이어 정리
    if (window.currentVideoPlayer) {
        window.currentVideoPlayer.dispose();
        window.currentVideoPlayer = null;
    }

    const modal = document.getElementById('recording-modal');
    if (modal) {
        modal.remove();
    }
}

// 완료된 미팅 상세보기 (페이지 전환)
function viewCompletedMeetingDetail(reqId) {
    const meetings = DataService.getMeetingRequestsV2('completed');
    const req = meetings.find(m => m.id === reqId);
    if (!req) return;

    // 현재 미팅 ID 저장
    window.currentMeetingDetailId = reqId;

    // 상세 페이지 렌더링
    renderCompletedMeetingDetailPage(req);
}

function renderCompletedMeetingDetailPage(req) {
    const typeText = req.meetingType === 'online' ? '온라인' : '대면';
    const hasRecording = req.recordingUrl;
    const tabContent = document.getElementById('meeting-tab-content');

    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더: 뒤로가기 버튼 -->
            <div class="p-6 border-b flex items-center gap-4">
                <button onclick="backToCompletedList()" class="text-gray-600 hover:text-gray-800">
                    <i class="fas fa-arrow-left text-xl"></i>
                </button>
                <h3 class="text-lg font-bold">완료된 미팅 상세정보</h3>
            </div>

            <!-- 본문 -->
            <div class="p-6">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">학생명</p>
                        <p class="font-medium text-lg">${req.studentName}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-1">학번</p>
                        <p class="font-medium text-lg">${req.studentNumber}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-1">완료일</p>
                        <p class="font-medium text-lg">${req.completedDate}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-1">유형</p>
                        <p class="font-medium">
                            <span class="px-3 py-1 text-sm rounded ${req.meetingType === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                                ${typeText}
                            </span>
                        </p>
                    </div>
                </div>

                <div class="mb-6">
                    <p class="text-sm text-gray-600 mb-2">주제</p>
                    <p class="font-medium text-lg">${req.topic}</p>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">예정 일시</p>
                        <p class="font-medium text-lg">${req.selectedDate} ${req.selectedTime}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-1">실제 소요시간</p>
                        <p class="font-medium text-lg">${req.actualDuration}분</p>
                    </div>
                </div>

                ${hasRecording ? `
                    <div class="mb-6">
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p class="text-sm font-semibold text-red-900 mb-1">Zoom 클라우드 녹화본</p>
                            <p class="text-xs text-red-700">${req.recordingDuration}분 · ${req.recordingSize}</p>
                        </div>

                        <div class="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                            <video
                                id="detail-video-player"
                                class="video-js vjs-default-skin vjs-big-play-centered"
                                controls
                                preload="auto"
                                style="width: 100%; height: 100%;">
                                <source src="${req.recordingUrl}" type="video/mp4">
                                <p class="vjs-no-js">비디오를 재생하려면 JavaScript를 활성화하세요.</p>
                            </video>
                        </div>

                        <div class="flex justify-start">
                            <a href="${req.recordingUrl}" target="_blank" download class="px-4 py-2 bg-[#8A0034] hover:bg-[#4A001C] text-white rounded text-sm">
                                <i class="fas fa-download mr-2"></i>다운로드
                            </a>
                        </div>
                    </div>
                ` : req.meetingType === 'online' ? `
                    <div class="bg-gray-100 p-4 rounded text-center mb-6">
                        <p class="text-sm text-gray-600">녹화본이 없습니다</p>
                    </div>
                ` : ''}

                <div class="flex justify-end border-t pt-6">
                    <button onclick="backToCompletedList()" class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium">
                        목록으로
                    </button>
                </div>
            </div>
        </div>
    `;

    // Video.js 초기화 (녹화본이 있는 경우)
    if (hasRecording) {
        setTimeout(() => {
            const player = videojs('detail-video-player', {
                controls: true,
                autoplay: false,
                preload: 'auto',
                fluid: true,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                controlBar: {
                    children: [
                        'playToggle',
                        'volumePanel',
                        'currentTimeDisplay',
                        'timeDivider',
                        'durationDisplay',
                        'progressControl',
                        'playbackRateMenuButton',
                        'fullscreenToggle'
                    ]
                }
            });
            window.currentDetailVideoPlayer = player;
        }, 100);
    }
}

// 목록으로 돌아가기
function backToCompletedList() {
    // Video.js 플레이어 정리
    if (window.currentDetailVideoPlayer) {
        window.currentDetailVideoPlayer.dispose();
        window.currentDetailVideoPlayer = null;
    }

    // 완료된 미팅 목록 다시 렌더링
    renderCompletedTab();
}

// ==================== 모달 함수들 ====================

// === 헬퍼 함수들 ===
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

function generateTimeOptions() {
    const times = [];
    for (let hour = 9; hour <= 21; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const h = String(hour).padStart(2, '0');
            const m = String(min).padStart(2, '0');
            times.push(`<option value="${h}:${m}">${h}:${m}</option>`);
        }
    }
    return times.join('');
}

// === 미팅 가능 시간 설정 모달 ===
function openSetAvailableTimeModal() {
    const today = getTodayDate();
    const threeMonthsLater = new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0];

    const html = `
        <div id="modal-set-time" class="modal-overlay" onclick="closeModal('modal-set-time')">
            <div class="modal-content" style="max-width: 600px;" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>미팅 가능 시간 설정</h3>
                    <button onclick="closeModal('modal-set-time')" class="modal-close">&times;</button>
                </div>

                <div class="modal-body">
                    <form id="form-set-time" onsubmit="submitSetAvailableTime(event)">
                        <div style="margin-bottom: 1rem;">
                            <label class="block text-sm font-semibold mb-2">일정 유형 *</label>
                            <div style="display: flex; gap: 1.5rem; align-items: center;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; white-space: nowrap;">
                                    <input type="radio" name="schedule-type" value="oneTime" checked onchange="toggleScheduleType()" />
                                    <span>특정 날짜 (1회)</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; white-space: nowrap;">
                                    <input type="radio" name="schedule-type" value="repeat" onchange="toggleScheduleType()" />
                                    <span>반복 일정</span>
                                </label>
                            </div>
                        </div>

                        <!-- 특정 날짜 선택 -->
                        <div id="oneTime-fields" style="margin-bottom: 1rem;">
                            <label class="block text-sm font-semibold mb-2">날짜 선택 *</label>
                            <input type="date" id="input-date" class="form-input w-full" min="${today}" />
                        </div>

                        <!-- 반복 일정 필드 -->
                        <div id="repeat-fields" style="display: none;">
                            <div style="margin-bottom: 1rem;">
                                <label class="block text-sm font-semibold mb-2">요일 선택 *</label>
                                <select id="input-dayOfWeek" class="form-input w-full">
                                    <option value="">선택하세요</option>
                                    <option value="1">월요일</option>
                                    <option value="2">화요일</option>
                                    <option value="3">수요일</option>
                                    <option value="4">목요일</option>
                                    <option value="5">금요일</option>
                                    <option value="6">토요일</option>
                                    <option value="0">일요일</option>
                                </select>
                            </div>

                            <div class="grid grid-cols-2 gap-4" style="margin-bottom: 1rem;">
                                <div>
                                    <label class="block text-sm font-semibold mb-2">시작일 *</label>
                                    <input type="date" id="input-startDate" class="form-input w-full" value="${today}" min="${today}" />
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold mb-2">종료일 *</label>
                                    <input type="date" id="input-endDate" class="form-input w-full" value="${threeMonthsLater}" min="${today}" />
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-semibold mb-2">시작 시간 *</label>
                                <select id="input-time" class="form-input w-full" required>
                                    <option value="">선택하세요</option>
                                    ${generateTimeOptions()}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold mb-2">소요 시간 *</label>
                                <div style="display: flex; gap: 1rem; align-items: center; height: 42px;">
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; white-space: nowrap;">
                                        <input type="radio" name="duration" value="30" />
                                        <span>30분</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; white-space: nowrap;">
                                        <input type="radio" name="duration" value="60" checked />
                                        <span>60분</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; white-space: nowrap;">
                                        <input type="radio" name="duration" value="90" />
                                        <span>90분</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <label class="block text-sm font-semibold mb-2">미팅 유형 *</label>
                            <select id="input-meetingType" class="form-input w-full" required>
                                <option value="online">온라인</option>
                                <option value="offline">대면</option>
                            </select>
                        </div>

                        <div class="bg-[#FAF6F1] border border-[#F8BBD9] rounded-lg p-4 mb-4">
                            <p class="text-sm text-[#6A0028]">
                                <strong>안내</strong><br>
                                설정한 시간은 학생들이 예약 신청할 수 있는 시간으로 등록됩니다.
                            </p>
                        </div>

                        <div class="flex gap-3">
                            <button type="button" onclick="closeModal('modal-set-time')"
                                    class="flex-1 px-6 py-3 border rounded-lg" style="background: white; cursor: pointer;">취소</button>
                            <button type="submit" class="flex-1 px-6 py-3 bg-[#6A0028] text-white rounded-lg" style="border: none; cursor: pointer;">설정 완료</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // 모달 표시를 위해 show 클래스 추가
    setTimeout(() => {
        const modal = document.getElementById('modal-set-time');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
}

function toggleScheduleType() {
    const scheduleType = document.querySelector('input[name="schedule-type"]:checked').value;
    const oneTimeFields = document.getElementById('oneTime-fields');
    const repeatFields = document.getElementById('repeat-fields');
    const inputDate = document.getElementById('input-date');
    const inputDayOfWeek = document.getElementById('input-dayOfWeek');
    const inputStartDate = document.getElementById('input-startDate');
    const inputEndDate = document.getElementById('input-endDate');

    if (scheduleType === 'oneTime') {
        oneTimeFields.style.display = 'block';
        repeatFields.style.display = 'none';
        inputDate.required = true;
        inputDayOfWeek.required = false;
        inputStartDate.required = false;
        inputEndDate.required = false;
    } else {
        oneTimeFields.style.display = 'none';
        repeatFields.style.display = 'block';
        inputDate.required = false;
        inputDayOfWeek.required = true;
        inputStartDate.required = true;
        inputEndDate.required = true;
    }
}

function submitSetAvailableTime(event) {
    event.preventDefault();

    const scheduleType = document.querySelector('input[name="schedule-type"]:checked').value;
    const time = document.getElementById('input-time').value;
    const duration = document.querySelector('input[name="duration"]:checked').value;
    const meetingType = document.getElementById('input-meetingType').value;

    let slotData;

    if (scheduleType === 'oneTime') {
        const date = document.getElementById('input-date').value;
        if (!date) {
            showNotification('날짜를 선택하세요', 'warning');
            return;
        }
        slotData = {
            type: 'oneTime',
            date: date,
            time: time,
            duration: parseInt(duration),
            meetingType: meetingType,
            startDate: date,
            endDate: date
        };
    } else {
        const dayOfWeek = document.getElementById('input-dayOfWeek').value;
        const startDate = document.getElementById('input-startDate').value;
        const endDate = document.getElementById('input-endDate').value;

        if (!dayOfWeek || !startDate || !endDate) {
            showNotification('필수 항목을 모두 입력하세요', 'warning');
            return;
        }

        slotData = {
            type: 'repeat',
            dayOfWeek: parseInt(dayOfWeek),
            time: time,
            duration: parseInt(duration),
            meetingType: meetingType,
            startDate: startDate,
            endDate: endDate
        };
    }

    console.log('시간 설정:', slotData);

    // DataService에 저장
    DataService.addAvailableSlot(slotData);

    closeModal('modal-set-time');
    showNotification('미팅 가능 시간이 설정되었습니다', 'success');
    renderMeetingMainV2();
}

// === 그룹 미팅 생성 모달 ===
function openCreateGroupMeetingModal() {
    // 학생 목록 가져오기
    const students = DataService.getAllStudents();

    const html = `
        <div id="modal-group" class="modal-overlay" onclick="closeModal('modal-group')">
            <div class="modal-content" style="max-width: 600px;" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>그룹 미팅 생성</h3>
                    <button onclick="closeModal('modal-group')" class="modal-close">&times;</button>
                </div>

                <div class="modal-body">
                    <form id="form-group" onsubmit="submitCreateGroupMeeting(event)">
                        <div style="margin-bottom: 1rem;">
                            <label class="block text-sm font-semibold mb-2">날짜 *</label>
                            <input type="date" id="group-date" class="form-input w-full" required min="${getTodayDate()}" />
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-semibold mb-2">시간 *</label>
                                <select id="group-time" class="form-input w-full" required>
                                    <option value="">선택</option>
                                    ${generateTimeOptions()}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold mb-2">소요 시간 *</label>
                                <div style="display: flex; gap: 1rem; align-items: center; height: 42px;">
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; white-space: nowrap;">
                                        <input type="radio" name="group-duration" value="30" />
                                        <span>30분</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; white-space: nowrap;">
                                        <input type="radio" name="group-duration" value="60" />
                                        <span>60분</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; white-space: nowrap;">
                                        <input type="radio" name="group-duration" value="90" checked />
                                        <span>90분</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <label class="block text-sm font-semibold mb-2">참여 학생 선택 (최소 2명) *</label>
                            <input type="text" id="student-search" class="form-input w-full mb-3"
                                   placeholder="학생 검색..." oninput="filterStudents(this.value)" />

                            <h4 class="text-sm font-semibold text-gray-700 mb-2">학생 선택</h4>
                            <div id="student-list" class="border rounded-lg bg-gray-50">
                                <div class="max-h-80 overflow-y-auto">
                                    <table class="text-sm" style="width: 100%; table-layout: fixed; border-collapse: collapse;">
                                        <thead class="bg-gray-50 border-b sticky top-0">
                                            <tr>
                                                <th style="width: 12%; padding: 8px 4px; text-align: center;"></th>
                                                <th style="width: 23%; padding: 8px 4px; text-align: center;">학번</th>
                                                <th style="width: 45%; padding: 8px 4px; text-align: left;">학과</th>
                                                <th style="width: 20%; padding: 8px 4px; text-align: center;">이름</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y">
                                            ${students.map(s => `
                                                <tr class="hover:bg-white cursor-pointer student-row" data-student-id="${s.id}"
                                                    data-name="${s.name}" data-number="${s.studentNumber}" data-major="${s.major || ''}" data-semester="${s.semester || ''}"
                                                    onclick="toggleStudentCheckbox(event, '${s.id}')">
                                                    <td style="width: 12%; padding: 8px 4px; text-align: center;" onclick="event.stopPropagation()">
                                                        <input type="checkbox" name="students" value="${s.id}"
                                                               onchange="updateSelectedCount()" />
                                                    </td>
                                                    <td style="width: 23%; padding: 8px 4px; text-align: center;">${s.studentNumber}</td>
                                                    <td style="width: 45%; padding: 8px 4px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${s.major || '-'}">${s.major || '-'}</td>
                                                    <td style="width: 20%; padding: 8px 4px; text-align: center; font-weight: 600;">${s.name}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="selected-count" class="mt-3 text-sm text-gray-600">
                                선택된 학생: <span class="font-bold text-[#6A0028]">0명</span>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <label class="block text-sm font-semibold mb-2">주제 (선택)</label>
                            <input type="text" id="group-topic" class="form-input w-full"
                                   placeholder="예) 연구방법론 집단 지도" />
                        </div>

                        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p class="text-sm text-green-800">
                                <strong>안내</strong><br>
                                생성 즉시 Zoom 링크가 발송됩니다
                            </p>
                        </div>

                        <div class="flex gap-3">
                            <button type="button" onclick="closeModal('modal-group')"
                                    class="flex-1 px-6 py-3 border rounded-lg" style="background: white; cursor: pointer;">취소</button>
                            <button type="submit" class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg" style="border: none; cursor: pointer;">생성 완료</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // 모달 표시를 위해 show 클래스 추가
    setTimeout(() => {
        const modal = document.getElementById('modal-group');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
}

function updateSelectedCount() {
    const count = document.querySelectorAll('input[name="students"]:checked').length;
    document.getElementById('selected-count').innerHTML =
        `선택된 학생: <span class="font-bold text-[#6A0028]">${count}명</span>`;
}

function toggleStudentCheckbox(event, studentId) {
    const checkbox = document.querySelector(`input[name="students"][value="${studentId}"]`);
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        updateSelectedCount();
    }
}

function filterStudents(searchText) {
    const rows = document.querySelectorAll('#student-list .student-row');
    const search = searchText.toLowerCase();

    rows.forEach(row => {
        const name = row.dataset.name.toLowerCase();
        const number = row.dataset.number.toLowerCase();
        const major = (row.dataset.major || '').toLowerCase();
        const semester = (row.dataset.semester || '').toLowerCase();

        const matches = name.includes(search) ||
                       number.includes(search) ||
                       major.includes(search) ||
                       semester.includes(search);

        row.style.display = matches ? '' : 'none';
    });
}

async function submitCreateGroupMeeting(event) {
    event.preventDefault();

    const date = document.getElementById('group-date').value;
    const time = document.getElementById('group-time').value;
    const duration = document.querySelector('input[name="group-duration"]:checked').value;
    const topic = document.getElementById('group-topic').value;
    const selectedStudents = Array.from(document.querySelectorAll('input[name="students"]:checked'))
        .map(cb => cb.value);

    if (selectedStudents.length < 2) {
        showNotification('최소 2명 이상 선택해주세요', 'error');
        return;
    }

    closeModal('modal-group');
    showLoading('그룹 미팅 생성 중...');

    try {
        // Zoom 생성
        const zoomInfo = await createZoomMeeting({
            topic: topic || '그룹 논문지도',
            start_time: `${date}T${time}:00`,
            duration: parseInt(duration)
        });

        // 데이터 저장
        DataService.addGroupMeeting({
            date: date,
            startTime: time,
            duration: parseInt(duration),
            topic: topic,
            participantIds: selectedStudents,
            zoomMeetingId: zoomInfo.id,
            zoomJoinUrl: zoomInfo.join_url,
            zoomPassword: zoomInfo.password,
            zoomStartUrl: zoomInfo.start_url
        });

        hideLoading();
        showNotification('그룹 미팅이 생성되었습니다', 'success');
        renderMeetingMainV2();

    } catch (error) {
        hideLoading();
        showNotification('생성 실패: ' + error.message, 'error');
        console.error('그룹 미팅 생성 실패:', error);
    }
}

// === 승인 모달 ===
function approveRequest(requestId) {
    const request = DataService.getRequestById(requestId);

    const html = `
        <div id="modal-approve" class="modal-overlay" onclick="closeModal('modal-approve')">
            <div class="modal-container" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 class="modal-title">미팅 신청 승인</h3>
                    <button onclick="closeModal('modal-approve')" class="modal-close">&times;</button>
                </div>

                <div class="modal-body">
                    <p class="mb-4">아래 미팅 신청을 승인하시겠습니까?</p>

                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <div class="mb-2"><strong>학생:</strong> ${request.studentName}</div>
                        <div class="mb-2"><strong>일시:</strong> ${request.selectedDate} ${request.selectedTime}</div>
                        <div><strong>내용:</strong> ${request.description}</div>
                    </div>

                    <div class="bg-[#FAF6F1] border border-[#F8BBD9] rounded-lg p-4 mb-4">
                        <p class="text-sm text-[#6A0028]">
                            <strong>승인하면 자동으로:</strong><br>
                            • Zoom 링크 생성<br>
                            • 학생에게 알림 발송
                        </p>
                    </div>

                    <div class="flex gap-3">
                        <button onclick="closeModal('modal-approve')"
                                class="flex-1 px-6 py-3 border rounded-lg" style="background: white; cursor: pointer;">취소</button>
                        <button onclick="confirmApprove('${requestId}')"
                                class="flex-1 px-6 py-3 bg-[#6A0028] text-white rounded-lg" style="border: none; cursor: pointer;">승인</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

async function confirmApprove(requestId) {
    closeModal('modal-approve');
    showLoading('승인 처리 중...');

    try {
        const request = DataService.getRequestById(requestId);

        // Zoom 생성
        const zoomInfo = await createZoomMeeting({
            topic: request.topic,
            start_time: `${request.selectedDate}T${request.selectedTime}:00`,
            duration: request.duration
        });

        // 승인 처리
        DataService.approveRequest(requestId, {
            zoomMeetingId: zoomInfo.id,
            zoomJoinUrl: zoomInfo.join_url,
            zoomPassword: zoomInfo.password,
            zoomStartUrl: zoomInfo.start_url
        });

        hideLoading();
        showNotification('승인되었습니다', 'success');
        renderMeetingMainV2();

    } catch (error) {
        hideLoading();
        showNotification('실패: ' + error.message, 'error');
        console.error('승인 실패:', error);
    }
}

// === 거절 모달 ===
function rejectRequest(requestId) {
    const request = DataService.getRequestById(requestId);

    const html = `
        <div id="modal-reject" class="modal-overlay" onclick="closeModal('modal-reject')">
            <div class="modal-container" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 class="modal-title">미팅 신청 거절</h3>
                    <button onclick="closeModal('modal-reject')" class="modal-close">&times;</button>
                </div>

                <div class="modal-body">
                    <p class="mb-4">이 미팅 신청을 거절하시겠습니까?</p>

                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <div class="mb-2"><strong>학생:</strong> ${request.studentName}</div>
                        <div><strong>일시:</strong> ${request.selectedDate} ${request.selectedTime}</div>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label class="block text-sm font-semibold mb-2">거절 사유 (학생에게 전달) *</label>
                        <textarea id="reject-reason" class="form-input w-full" rows="4" required
                                  placeholder="거절 사유를 입력해주세요"></textarea>
                    </div>

                    <div class="flex gap-3">
                        <button onclick="closeModal('modal-reject')"
                                class="flex-1 px-6 py-3 border rounded-lg" style="background: white; cursor: pointer;">돌아가기</button>
                        <button onclick="confirmReject('${requestId}')"
                                class="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg" style="border: none; cursor: pointer;">거절하기</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function confirmReject(requestId) {
    const reason = document.getElementById('reject-reason').value.trim();

    if (!reason) {
        showNotification('거절 사유를 입력해주세요', 'error');
        return;
    }

    closeModal('modal-reject');

    // 거절 처리
    DataService.rejectMeetingV2(requestId, reason);

    showNotification('미팅 신청이 거절되었습니다', 'success');
    renderMeetingMainV2();
}

// === 취소 모달 ===
function cancelMeeting(meetingId) {
    const html = `
        <div id="modal-cancel" class="modal-overlay" onclick="closeModal('modal-cancel')">
            <div class="modal-container" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 class="modal-title">미팅 취소</h3>
                    <button onclick="closeModal('modal-cancel')" class="modal-close">&times;</button>
                </div>

                <div class="modal-body">
                    <p class="mb-4">이 미팅을 취소하시겠습니까?</p>

                    <div style="margin-bottom: 1rem;">
                        <label class="block text-sm font-semibold mb-2">취소 사유 (학생에게 전달) *</label>
                        <textarea id="cancel-reason" class="form-input w-full" rows="4" required
                                  placeholder="취소 사유를 입력해주세요"></textarea>
                    </div>

                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p class="text-sm text-yellow-800">
                            <strong>⚠️ 취소하면:</strong><br>
                            • Zoom 링크 삭제<br>
                            • 학생에게 취소 알림 발송
                        </p>
                    </div>

                    <div class="flex gap-3">
                        <button onclick="closeModal('modal-cancel')"
                                class="flex-1 px-6 py-3 border rounded-lg" style="background: white; cursor: pointer;">돌아가기</button>
                        <button onclick="confirmCancel('${meetingId}')"
                                class="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg" style="border: none; cursor: pointer;">취소하기</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

async function confirmCancel(meetingId) {
    const reason = document.getElementById('cancel-reason').value.trim();

    if (!reason) {
        showNotification('취소 사유를 입력해주세요', 'error');
        return;
    }

    closeModal('modal-cancel');
    showLoading('취소 처리 중...');

    try {
        const meeting = DataService.getMeetingById(meetingId);

        // Zoom 삭제
        if (meeting.zoomMeetingId) {
            await deleteZoomMeeting(meeting.zoomMeetingId);
        }

        // 취소 처리
        DataService.cancelMeeting(meetingId, reason);

        hideLoading();
        showNotification('미팅이 취소되었습니다', 'success');
        renderMeetingMainV2();

    } catch (error) {
        hideLoading();
        showNotification('실패: ' + error.message, 'error');
        console.error('취소 실패:', error);
    }
}

console.log('meeting-v2-part2.js 로드 완료');

// Export
window.renderApprovedTab = renderApprovedTab;
window.renderCompletedTab = renderCompletedTab;
window.openZoomWindow = openZoomWindow;
window.completeMeetingV2 = completeMeetingV2;
window.confirmCompleteV2 = confirmCompleteV2;
window.openSetAvailableTimeModal = openSetAvailableTimeModal;
window.submitSetAvailableTime = submitSetAvailableTime;
window.toggleScheduleType = toggleScheduleType;
window.openCreateGroupMeetingModal = openCreateGroupMeetingModal;
window.submitCreateGroupMeeting = submitCreateGroupMeeting;
window.updateSelectedCount = updateSelectedCount;
window.toggleStudentCheckbox = toggleStudentCheckbox;
window.filterStudents = filterStudents;
window.approveRequest = approveRequest;
window.confirmApprove = confirmApprove;
window.rejectRequest = rejectRequest;
window.confirmReject = confirmReject;
window.cancelMeeting = cancelMeeting;
window.confirmCancel = confirmCancel;
window.closeModal = closeModal;
window.getTodayDate = getTodayDate;
window.generateTimeOptions = generateTimeOptions;
