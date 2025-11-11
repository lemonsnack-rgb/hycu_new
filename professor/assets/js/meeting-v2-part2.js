// Phase 3 재설계: 랩미팅관리 Part 2 (예정/완료 탭)

// ==================== 예정된 미팅 탭 ====================
function renderApprovedTab() {
    const approved = DataService.getMeetingRequestsV2('approved');
    const tabContent = document.getElementById('meeting-tab-content');
    
    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold mb-4">예정된 미팅</h3>
            
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
    
    return `
        <div class="approved-card">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-semibold text-lg">
                            ${createStudentNameWithInfo(req.studentName, req.studentNumber, {
                                phone: req.phone || '',
                                email: req.email || ''
                            })}
                        </span>
                        <span class="text-sm text-gray-500">(${req.studentNumber})</span>
                        <span class="badge-purple">${typeText}</span>
                    </div>
                    <p class="text-sm text-gray-600">승인일: ${req.approvedDate}</p>
                </div>
                <span class="badge-blue">승인됨</span>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg mb-3">
                <h4 class="font-semibold text-green-900 mb-2">${req.topic}</h4>
                <div class="grid grid-cols-2 gap-2 text-sm text-green-800">
                    <div>📅 일시: <span class="font-medium">${req.selectedDate}</span></div>
                    <div>⏰ 시간: <span class="font-medium">${req.selectedTime} (${req.duration}분)</span></div>
                </div>
            </div>
            
            ${isOnline && req.zoomJoinUrl ? `
                <div class="bg-purple-50 p-4 rounded-lg mb-3 border-l-4 border-purple-400">
                    <p class="text-xs font-semibold text-purple-800 mb-2">🎥 Zoom 미팅 정보</p>
                    <div class="space-y-2 text-sm">
                        <div>
                            <span class="text-purple-700">미팅 ID:</span>
                            <span class="text-purple-900 font-mono ml-2">${req.zoomMeetingId}</span>
                        </div>
                        <div>
                            <span class="text-purple-700">참가 링크:</span>
                            <a href="${req.zoomJoinUrl}" target="_blank" class="text-blue-600 hover:underline ml-2 break-all">
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
                            <a href="${req.zoomStartUrl}" target="_blank" class="text-blue-600 hover:underline ml-2 break-all">
                                미팅 시작하기
                            </a>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="flex gap-2">
                ${isOnline ? `
                    <button onclick="openZoomWindow('${req.zoomStartUrl}')" class="btn-primary flex-1">
                        🎥 Zoom 시작
                    </button>
                    <button onclick="completeMeetingV2('${req.id}')" class="btn-secondary flex-1">
                        완료 처리
                    </button>
                ` : `
                    <button onclick="completeMeetingV2('${req.id}')" class="btn-primary flex-1">
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
                <p><span class="font-medium">학생:</span> ${createStudentNameWithInfo(req.studentName, req.studentNumber, {
                    phone: req.phone || '',
                    email: req.email || ''
                })}</p>
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
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold mb-4">완료된 미팅</h3>
            
            ${completed.length > 0 ? `
                <div class="space-y-4">
                    ${completed.map(req => renderCompletedCard(req)).join('')}
                </div>
            ` : `
                <div class="text-center py-12 text-gray-500">
                    <p>완료된 미팅이 없습니다</p>
                </div>
            `}
        </div>
    `;
}

function renderCompletedCard(req) {
    const typeText = req.meetingType === 'online' ? '온라인' : '대면';
    const hasRecording = req.recordingUrl;
    
    return `
        <div class="completed-card">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-semibold text-lg">
                            ${createStudentNameWithInfo(req.studentName, req.studentNumber, {
                                phone: req.phone || '',
                                email: req.email || ''
                            })}
                        </span>
                        <span class="text-sm text-gray-500">(${req.studentNumber})</span>
                        <span class="badge-purple">${typeText}</span>
                        ${hasRecording ? '<span class="badge-red">📹 녹화본</span>' : ''}
                    </div>
                    <p class="text-sm text-gray-600">완료일: ${req.completedDate}</p>
                </div>
                <span class="badge-green">완료</span>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg mb-3">
                <h4 class="font-semibold text-gray-900 mb-2">${req.topic}</h4>
                <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>📅 일시: ${req.selectedDate}</div>
                    <div>⏰ 시간: ${req.selectedTime} (실제 ${req.actualDuration}분)</div>
                </div>
            </div>
            
            ${hasRecording ? `
                <div class="recording-section">
                    <div class="recording-header">
                        <div>
                            <p class="text-sm font-semibold text-red-900">📹 Zoom 클라우드 녹화본</p>
                            <p class="text-xs text-red-700">
                                ${req.recordingDuration}분 · ${req.recordingSize}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="playRecording('${req.id}')" class="btn-play">
                                ▶ 재생
                            </button>
                            <a href="${req.recordingUrl}" target="_blank" class="btn-download">
                                ⬇ 다운로드
                            </a>
                        </div>
                    </div>
                    
                    <div id="player-${req.id}" class="recording-player hidden">
                        <div class="aspect-video bg-black rounded-lg overflow-hidden">
                            <video 
                                id="video-player-${req.id}"
                                class="video-js vjs-default-skin vjs-big-play-centered"
                                controls
                                preload="auto"
                                style="width: 100%; height: 100%;">
                                <source src="${req.recordingUrl}" type="video/mp4">
                                <p class="vjs-no-js">
                                    비디오를 재생하려면 JavaScript를 활성화하세요.
                                </p>
                            </video>
                        </div>
                        <div class="mt-3 flex justify-between items-center">
                            <div class="text-sm text-gray-600">
                                <span class="font-medium">${req.recordingDuration}분</span>
                                <span class="mx-2">·</span>
                                <span>${req.recordingSize}</span>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="togglePlaybackSpeed('${req.id}')" class="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                                    배속 <span id="speed-${req.id}">1.0x</span>
                                </button>
                                <button onclick="hideRecording('${req.id}')" class="text-sm text-gray-600 hover:text-gray-800">
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ` : req.meetingType === 'online' ? `
                <div class="bg-gray-100 p-3 rounded text-center">
                    <p class="text-sm text-gray-600">
                        📹 녹화본이 없습니다
                    </p>
                </div>
            ` : ''}
        </div>
    `;
}

function playRecording(reqId) {
    const playerDiv = document.getElementById(`player-${reqId}`);
    if (!playerDiv) return;
    
    playerDiv.classList.remove('hidden');
    
    // Video.js 플레이어 초기화
    const videoElement = document.getElementById(`video-player-${reqId}`);
    if (videoElement && !videoElement.player) {
        const player = videojs(`video-player-${reqId}`, {
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
        
        videoElement.player = player;
        
        // 재생 속도 변경 이벤트
        player.on('ratechange', function() {
            const speedLabel = document.getElementById(`speed-${reqId}`);
            if (speedLabel) {
                speedLabel.textContent = player.playbackRate() + 'x';
            }
        });
    }
}

function hideRecording(reqId) {
    const playerDiv = document.getElementById(`player-${reqId}`);
    if (!playerDiv) return;
    
    // Video.js 플레이어 일시정지
    const videoElement = document.getElementById(`video-player-${reqId}`);
    if (videoElement && videoElement.player) {
        videoElement.player.pause();
    }
    
    playerDiv.classList.add('hidden');
}

function togglePlaybackSpeed(reqId) {
    const videoElement = document.getElementById(`video-player-${reqId}`);
    if (!videoElement || !videoElement.player) return;
    
    const player = videoElement.player;
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentSpeed = player.playbackRate();
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    player.playbackRate(speeds[nextIndex]);
}

// Export
window.renderApprovedTab = renderApprovedTab;
window.renderCompletedTab = renderCompletedTab;
window.openZoomWindow = openZoomWindow;
window.completeMeetingV2 = completeMeetingV2;
window.confirmCompleteV2 = confirmCompleteV2;
window.playRecording = playRecording;
window.hideRecording = hideRecording;
window.togglePlaybackSpeed = togglePlaybackSpeed;
