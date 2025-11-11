// 미팅관리 - 버튼 탭 + 완료된 미팅 + Video.js

// ID 61: 예정된 미팅이 첫번째 탭
let currentMeetingTab = 'approved';

function renderMeeting() {
    const content = document.getElementById('meeting-screen');
    if (!content) return;
    
    content.innerHTML = `
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
                        <button onclick="alert('미팅 신청')" style="width: 100%; background: #6A0028; color: white; padding: 0.5rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600;">
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
    tabContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600;">예정된 미팅</h3>
            </div>
            <div class="card-body">
                <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: white; margin-bottom: 1rem;">
                    <div style="display: flex; justify-between; align-items: flex-start; margin-bottom: 0.75rem;">
                        <div>
                            <h4 style="font-weight: 600; font-size: 1.125rem;">연구방법론 논의</h4>
                            <p style="color: #6B7280; font-size: 0.875rem;">승인일: 2025-11-02</p>
                        </div>
                        <span style="background: #DBEAFE; color: #1E40AF; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                            승인됨
                        </span>
                    </div>
                    <div style="background: #F0FDF4; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                            <div>일시: 2025-11-07</div>
                            <div>⏰ 시간: 10:00 (60분)</div>
                        </div>
                    </div>
                    <div style="background: #F5F3FF; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                        <p style="font-size: 0.75rem; font-weight: 600; color: #5B21B6; margin-bottom: 0.5rem;">🎥 Zoom 미팅 정보</p>
                        <div style="font-size: 0.875rem;">
                            <p>미팅 ID: <span style="font-family: monospace;">123 456 789</span></p>
                            <p>비밀번호: <span style="font-family: monospace;">abc123</span></p>
                        </div>
                    </div>
                    <button onclick="window.open('https://zoom.us/j/123456789')" 
                            style="width: 100%; background: #6A0028; color: white; padding: 0.5rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600;">
                        Zoom 참여하기
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 완료된 미팅 탭 (Video.js 포함)
function renderCompletedTab() {
    const tabContent = document.getElementById('meeting-tab-content');
    tabContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600;">완료된 미팅</h3>
            </div>
            <div class="card-body">
                <div style="display: grid; gap: 1.5rem;">
                    ${renderCompletedCard1()}
                    ${renderCompletedCard2()}
                </div>
            </div>
        </div>
    `;
}

function renderCompletedCard1() {
    return `
        <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: white;">
            <div style="display: flex; justify-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                        <span style="font-weight: 600; font-size: 1.125rem;">논문 주제 선정</span>
                        <span style="background: #EDE9FE; color: #5B21B6; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                            온라인
                        </span>
                    </div>
                    <p style="color: #6B7280; font-size: 0.875rem;">완료일: 2025-10-21</p>
                </div>
                <span style="background: #D1FAE5; color: #065F46; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                    완료
                </span>
            </div>
            
            <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                <h4 style="font-weight: 600; margin-bottom: 0.5rem;">미팅 내용</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                    <div>일시: 2025-10-21</div>
                    <div>⏰ 시간: 14:00 (실제 55분)</div>
                </div>
            </div>
        </div>
    `;
}

function renderCompletedCard2() {
    return `
        <div style="padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: white;">
            <div style="display: flex; justify-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                        <span style="font-weight: 600; font-size: 1.125rem;">선행연구 검토</span>
                        <span style="background: #EDE9FE; color: #5B21B6; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                            대면
                        </span>
                    </div>
                    <p style="color: #6B7280; font-size: 0.875rem;">완료일: 2025-10-15</p>
                </div>
                <span style="background: #D1FAE5; color: #065F46; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                    완료
                </span>
            </div>
            <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                    <div>일시: 2025-10-15</div>
                    <div>⏰ 시간: 10:00 (실제 90분)</div>
                </div>
            </div>
        </div>
    `;
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
