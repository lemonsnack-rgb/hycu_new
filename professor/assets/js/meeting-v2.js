// Phase 3 재설계: 랩미팅관리 화면 (개선판)

let currentMeetingTab = 'confirmed'; // 확정됨이 첫번째 탭

function initMeetingV2() {
    console.log('미팅관리 V2 초기화');
    renderMeetingMainV2();
}

function renderMeetingMainV2() {
    const content = document.getElementById('meeting-content-area');
    if (!content) return;

    const stats = DataService.getMeetingStats();

    content.innerHTML = `
        <div class="meeting-tabs mb-6">
            <button onclick="changeMeetingTab('confirmed')" class="tab-btn ${currentMeetingTab==='confirmed'?'active':''}">
                예정된 미팅 (${stats.confirmed})
            </button>
            <button onclick="changeMeetingTab('waiting')" class="tab-btn ${currentMeetingTab==='waiting'?'active':''}">
                신청 목록 (${stats.waiting})
            </button>
            <button onclick="changeMeetingTab('schedule')" class="tab-btn ${currentMeetingTab==='schedule'?'active':''}">
                일정 설정
            </button>
            <button onclick="changeMeetingTab('completed')" class="tab-btn ${currentMeetingTab==='completed'?'active':''}">
                완료된 미팅 (${stats.completed})
            </button>
        </div>

        <div id="meeting-tab-content"></div>
    `;

    renderMeetingTabContent();
}

function changeMeetingTab(tab) {
    currentMeetingTab = tab;
    renderMeetingMainV2();
}

function renderMeetingTabContent() {
    const tabContent = document.getElementById('meeting-tab-content');
    if (!tabContent) return;

    switch(currentMeetingTab) {
        case 'waiting':
            renderWaitingTab();
            break;
        case 'confirmed':
            renderConfirmedTab();
            break;
        case 'completed':
            renderCompletedTab();
            break;
        case 'schedule':
            renderScheduleTab();
            break;
    }
}

// ==================== 시간 설정 탭 ====================
function renderScheduleTab() {
    const slots = DataService.getAvailableSlots();
    const tabContent = document.getElementById('meeting-tab-content');

    tabContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- 좌측: 캘린더 조회 -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold mb-4">캘린더</h3>
                <div id="calendar-container"></div>
            </div>

            <!-- 우측: 등록한 일정 목록 및 액션 버튼 -->
            <div class="space-y-6">
                <!-- 액션 버튼 2개 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-bold mb-4">미팅 생성</h3>

                    <div class="space-y-3">
                        <!-- 1:1 미팅 시간 설정 -->
                        <button onclick="openSetAvailableTimeModal()"
                                class="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-left transition-colors"
                                style="display: flex; align-items: center; justify-content: space-between; border: none; cursor: pointer;">
                            <div>
                                <div class="font-bold text-lg mb-1">미팅 가능 시간 설정</div>
                                <div class="text-sm text-blue-100">학생들이 예약 신청할 수 있습니다</div>
                            </div>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>

                        <!-- 그룹 미팅 생성 -->
                        <button onclick="openCreateGroupMeetingModal()"
                                class="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-left transition-colors"
                                style="display: flex; align-items: center; justify-content: space-between; border: none; cursor: pointer;">
                            <div>
                                <div class="font-bold text-lg mb-1">👥 그룹 미팅 생성</div>
                                <div class="text-sm text-green-100">여러 학생을 직접 지정합니다</div>
                            </div>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>

                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <p class="text-sm text-blue-800">
                            <strong>💡 안내</strong><br>
                            • 1:1 미팅: 학생이 신청하면 승인 후 자동으로 Zoom 생성<br>
                            • 그룹 미팅: 생성 즉시 Zoom 생성 및 학생에게 알림
                        </p>
                    </div>
                </div>

                <!-- 설정된 일정 목록 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-bold mb-4">설정된 미팅 가능 시간</h3>
                    ${slots.length > 0 ? `
                        <div class="space-y-3">
                            ${slots.map(slot => renderSlotCard(slot)).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-12 text-gray-400">
                            <p>설정된 시간이 없습니다</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;

    // 캘린더 초기화
    setTimeout(() => initCalendar(), 100);
}

function renderSlotCard(slot) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const typeText = {
        'online': '온라인',
        'offline': '대면',
        'both': '온라인'  // 기존 데이터 호환성을 위해 'both'는 '온라인'으로 처리
    }[slot.meetingType];
    
    const isOneTime = slot.type === 'oneTime';
    const dateLabel = isOneTime
        ? `${slot.date}`
        : `${days[slot.dayOfWeek]}요일`;

    return `
        <div class="slot-card">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="${isOneTime ? 'badge-green' : 'badge-blue'}">${dateLabel}</span>
                        <span class="font-semibold text-lg">${slot.time}</span>
                        <span class="text-sm text-gray-600">(${slot.duration}분)</span>
                        <span class="badge-purple">${typeText}</span>
                    </div>
                    <div class="text-sm text-gray-600">
                        ${isOneTime
                            ? `<span>1회만 (${slot.date})</span>`
                            : `<span>${slot.startDate} ~ ${slot.endDate}</span>
                               <span class="ml-3">매주 반복</span>`
                        }
                    </div>
                </div>
                <button onclick="deleteSlot('${slot.id}')" class="text-red-600 hover:text-red-800 ml-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function openAddSlotModal(type) {
    const today = new Date().toISOString().split('T')[0];
    const threeMonthsLater = new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0];
    
    const isOneTime = type === 'oneTime';
    const title = isOneTime ? '특정 날짜 일정 추가' : '반복 일정 추가';
    
    const content = `
        <form id="add-slot-form" class="space-y-4">
            <input type="hidden" name="type" value="${type}">
            
            ${isOneTime ? `
                <!-- 특정 날짜 선택 -->
                <div>
                    <label class="block text-sm font-medium mb-1">날짜 *</label>
                    <input type="date" name="date" min="${today}" class="input" required>
                </div>
            ` : `
                <!-- 요일 선택 (반복) -->
                <div>
                    <label class="block text-sm font-medium mb-1">요일 *</label>
                    <select name="dayOfWeek" class="input" required>
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
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">시작일 *</label>
                        <input type="date" name="startDate" value="${today}" class="input" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">종료일 *</label>
                        <input type="date" name="endDate" value="${threeMonthsLater}" class="input" required>
                    </div>
                </div>
            `}
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">시작 시간 *</label>
                    <input type="time" name="time" class="input" required>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">소요시간(분) *</label>
                    <select name="duration" class="input" required>
                        <option value="30">30분</option>
                        <option value="60" selected>60분</option>
                        <option value="90">90분</option>
                        <option value="120">120분</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">미팅 유형 *</label>
                <select name="meetingType" class="input" required>
                    <option value="online">온라인</option>
                    <option value="offline">대면</option>
                </select>
            </div>
            
            <div class="bg-yellow-50 p-3 rounded">
                <p class="text-xs text-yellow-800">
                    ${isOneTime 
                        ? '💡 선택한 날짜에 1회만 미팅이 가능합니다.' 
                        : '💡 예: 월요일 14:00, 60분 → 매주 월요일 14:00~15:00에 학생이 신청 가능'
                    }
                </p>
            </div>
        </form>
    `;
    
    createModal(title, content, [
        {text: '취소', className: 'btn-secondary', onclick: 'return;'},
        {text: '추가', className: 'btn-primary', onclick: 'saveSlot()'}
    ]);
}

function saveSlot() {
    const form = document.getElementById('add-slot-form');
    const fd = new FormData(form);
    
    const type = fd.get('type');
    const isOneTime = type === 'oneTime';
    
    // 공통 필드 검증
    if (!fd.get('time') || !fd.get('duration') || !fd.get('meetingType')) {
        showToast('필수 항목을 모두 입력하세요', 'warning');
        return;
    }
    
    // type별 검증
    if (isOneTime) {
        if (!fd.get('date')) {
            showToast('날짜를 선택하세요', 'warning');
            return;
        }
    } else {
        if (!fd.get('dayOfWeek') || !fd.get('startDate') || !fd.get('endDate')) {
            showToast('필수 항목을 모두 입력하세요', 'warning');
            return;
        }
    }
    
    const slotData = {
        type: type,
        dayOfWeek: isOneTime ? null : parseInt(fd.get('dayOfWeek')),
        date: isOneTime ? fd.get('date') : null,
        time: fd.get('time'),
        duration: parseInt(fd.get('duration')),
        meetingType: fd.get('meetingType'),
        startDate: isOneTime ? fd.get('date') : fd.get('startDate'),
        endDate: isOneTime ? fd.get('date') : fd.get('endDate')
    };
    
    DataService.addAvailableSlot(slotData);
    showToast('일정이 추가되었습니다', 'success');
    setTimeout(() => renderMeetingMainV2(), 100);
}

function deleteSlot(slotId) {
    if (confirm('이 시간을 삭제하시겠습니까?')) {
        DataService.deleteAvailableSlot(slotId);
        showToast('삭제되었습니다', 'success');
        renderMeetingMainV2();
    }
}

// FullCalendar 초기화
function initCalendar() {
    const calendarEl = document.getElementById('calendar-container');
    if (!calendarEl) return;
    
    const slots = DataService.getAvailableSlots();
    const events = [];
    
    // 일정을 FullCalendar 이벤트로 변환
    slots.forEach(slot => {
        if (slot.type === 'oneTime') {
            // 특정 날짜 1회
            events.push({
                id: slot.id,
                title: `${slot.time} (${slot.duration}분)`,
                start: `${slot.date}T${slot.time}`,
                backgroundColor: slot.meetingType === 'online' ? '#3B82F6' : 
                                slot.meetingType === 'offline' ? '#10B981' : '#8B5CF6',
                borderColor: slot.meetingType === 'online' ? '#2563EB' : 
                            slot.meetingType === 'offline' ? '#059669' : '#7C3AED'
            });
        } else {
            // 반복 일정 - 앞으로 3개월치 생성
            const startDate = new Date(slot.startDate);
            const endDate = new Date(slot.endDate);
            const today = new Date();
            
            for (let d = new Date(Math.max(today, startDate)); d <= endDate; d.setDate(d.getDate() + 1)) {
                if (d.getDay() === slot.dayOfWeek) {
                    const dateStr = d.toISOString().split('T')[0];
                    events.push({
                        id: `${slot.id}-${dateStr}`,
                        title: `${slot.time} (${slot.duration}분) 🔁`,
                        start: `${dateStr}T${slot.time}`,
                        backgroundColor: slot.meetingType === 'online' ? '#3B82F6' : 
                                        slot.meetingType === 'offline' ? '#10B981' : '#8B5CF6',
                        borderColor: slot.meetingType === 'online' ? '#2563EB' : 
                                    slot.meetingType === 'offline' ? '#059669' : '#7C3AED',
                        slotId: slot.id
                    });
                }
            }
        }
    });
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        height: 'auto',
        events: events,
        dateClick: function(info) {
            // 날짜 클릭 시 특정 날짜 일정 추가
            const clickedDate = info.dateStr;
            openAddSlotModalWithDate(clickedDate);
        },
        eventClick: function(info) {
            // 이벤트 클릭 시 상세 정보 표시
            const slotId = info.event.id.split('-')[0];
            const slot = AVAILABLE_SLOTS.find(s => s.id === slotId);
            if (slot) {
                const typeMap = {
                    'online': '온라인',
                    'offline': '대면',
                    'both': '온라인'  // 기존 데이터 호환성
                };
                alert(`${info.event.title}\n유형: ${typeMap[slot.meetingType] || '온라인'}`);
            }
        },
        buttonText: {
            today: '오늘'
        },
        dayMaxEvents: 3,
        moreLinkText: function(num) {
            return '+' + num + '개';
        }
    });
    
    calendar.render();
}

// 날짜 클릭 시 해당 날짜로 모달 열기
function openAddSlotModalWithDate(date) {
    const content = `
        <form id="add-slot-form" class="space-y-4">
            <input type="hidden" name="type" value="oneTime">
            
            <div>
                <label class="block text-sm font-medium mb-1">날짜 *</label>
                <input type="date" name="date" value="${date}" class="input" required readonly>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">시작 시간 *</label>
                    <input type="time" name="time" class="input" required>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">소요시간(분) *</label>
                    <select name="duration" class="input" required>
                        <option value="30">30분</option>
                        <option value="60" selected>60분</option>
                        <option value="90">90분</option>
                        <option value="120">120분</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">미팅 유형 *</label>
                <select name="meetingType" class="input" required>
                    <option value="online">온라인</option>
                    <option value="offline">대면</option>
                </select>
            </div>
            
            <div class="bg-green-50 p-3 rounded">
                <p class="text-xs text-green-800">
                    💡 ${date}에 1회만 미팅이 가능합니다.
                </p>
            </div>
        </form>
    `;
    
    createModal(`일정 추가 - ${date}`, content, [
        {text: '취소', className: 'btn-secondary', onclick: 'return;'},
        {text: '추가', className: 'btn-primary', onclick: 'saveSlot()'}
    ]);
}

// ==================== 신청 목록 탭 ====================
function renderRequestsTab() {
    const requests = DataService.getMeetingRequestsV2('pending');
    const tabContent = document.getElementById('meeting-tab-content');
    
    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold mb-4">승인 대기 중인 신청</h3>
            
            ${requests.length > 0 ? `
                <div class="space-y-4">
                    ${requests.map(req => renderRequestCard(req)).join('')}
                </div>
            ` : `
                <div class="text-center py-12 text-gray-500">
                    <p>승인 대기 중인 신청이 없습니다</p>
                </div>
            `}
        </div>
    `;
}

function renderRequestCard(req) {
    const slot = AVAILABLE_SLOTS.find(s => s.id === req.slotId);
    const typeText = req.meetingType === 'online' ? '온라인' : '대면';
    
    return `
        <div class="request-card">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-semibold text-lg">${req.studentName}</span>
                        <span class="text-sm text-gray-500">(${req.studentNumber})</span>
                        <span class="badge-purple">${typeText}</span>
                    </div>
                    <p class="text-sm text-gray-600">신청일: ${req.requestDate}</p>
                </div>
                <span class="badge-yellow">승인 대기</span>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg mb-3">
                <h4 class="font-semibold text-blue-900 mb-3">${req.topic}</h4>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="text-blue-700">희망일: <span class="font-medium">${req.selectedDate}</span></div>
                    <div class="text-blue-700">시간: <span class="font-medium">${req.selectedTime} (${req.duration}분)</span></div>
                </div>
            </div>

            ${slot ? `
                <div class="text-xs text-gray-500 mb-3">
                    안내 문구가 삽입되는 위치입니다
                </div>
            ` : ''}
            
            <div class="flex gap-2 justify-end">
                <button onclick="approveRequestV2('${req.id}')" class="btn-primary px-6 py-2">
                    승인
                </button>
                <button onclick="rejectRequestV2('${req.id}')" class="btn-danger px-6 py-2">
                    거절
                </button>
            </div>
        </div>
    `;
}

function approveRequestV2(reqId) {
    const req = DataService.getMeetingDetailV2(reqId);
    if (!req) return;
    
    const content = `
        <form id="approve-req-form" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded">
                <p><span class="font-medium">학생:</span> ${req.studentName}</p>
                <p><span class="font-medium">주제:</span> ${req.topic}</p>
                <p><span class="font-medium">일시:</span> ${req.selectedDate} ${req.selectedTime} (${req.duration}분)</p>
                <p><span class="font-medium">유형:</span> ${req.meetingType === 'online' ? '온라인' : '대면'}</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">코멘트</label>
                <textarea name="comment" rows="3" class="input" placeholder="학생에게 전달할 메시지 (선택)"></textarea>
            </div>
            
            ${req.meetingType === 'online' ? `
                <div class="bg-purple-50 p-3 rounded">
                    <p class="text-sm text-purple-800">
                        온라인 미팅입니다. 승인 시 자동으로 Zoom 미팅이 생성되며, 링크가 학생에게 전달됩니다.
                    </p>
                </div>
            ` : ''}
        </form>
    `;
    
    createModal('미팅 승인', content, [
        {text: '취소', className: 'btn-secondary', onclick: 'return;'},
        {text: '승인', className: 'btn-primary', onclick: `confirmApproveV2('${reqId}')`}
    ]);
}

function confirmApproveV2(reqId) {
    const form = document.getElementById('approve-req-form');
    const comment = new FormData(form).get('comment');
    
    DataService.approveMeetingV2(reqId, comment || null);
    showToast('미팅이 승인되었습니다', 'success');
    setTimeout(() => renderMeetingMainV2(), 100);
}

function rejectRequestV2(reqId) {
    const req = DataService.getMeetingDetailV2(reqId);
    
    const content = `
        <form id="reject-req-form" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded">
                <p><span class="font-medium">학생:</span> ${req.studentName}</p>
                <p><span class="font-medium">주제:</span> ${req.topic}</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">거절 사유 *</label>
                <textarea name="reason" rows="4" class="input" required placeholder="학생에게 전달될 거절 사유를 입력하세요"></textarea>
            </div>
        </form>
    `;
    
    createModal('미팅 거절', content, [
        {text: '취소', className: 'btn-secondary', onclick: 'return;'},
        {text: '거절', className: 'btn-danger', onclick: `confirmRejectV2('${reqId}')`}
    ]);
}

function confirmRejectV2(reqId) {
    const form = document.getElementById('reject-req-form');
    const reason = new FormData(form).get('reason');
    
    if (!reason) {
        showToast('거절 사유를 입력하세요', 'warning');
        return;
    }
    
    DataService.rejectMeetingV2(reqId, reason);
    showToast('미팅이 거절되었습니다', 'success');
    setTimeout(() => renderMeetingMainV2(), 100);
}

// ==================== 신청 대기 탭 ====================
function renderWaitingTab() {
    const requests = DataService.getPendingRequests();
    const tabContent = document.getElementById('meeting-tab-content');

    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <h3 class="text-lg font-bold">신청 대기 중인 1:1 미팅 (${requests.length}건)</h3>
                <p class="text-sm text-gray-600 mt-1">학생의 예약 신청을 승인하면 자동으로 Zoom 링크가 생성됩니다</p>
            </div>

            ${requests.length > 0 ? `
                <div class="divide-y">
                    ${requests.map(req => `
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="badge-yellow">대기 중</span>
                                    <div class="text-xl font-bold mt-2">
                                        ${req.selectedDate} (${getDayOfWeek(req.selectedDate)}) ${req.selectedTime}
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                <div class="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <div class="text-sm text-gray-600">학생</div>
                                        <div class="font-semibold">${req.studentName} (${req.studentNumber})</div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-gray-600">신청 일시</div>
                                        <div class="font-semibold">${formatDateTime(req.requestDate)}</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-600 mb-1">미팅 주제</div>
                                    <div class="font-semibold">${req.topic}</div>
                                </div>
                                <div class="mt-3">
                                    <div class="text-sm text-gray-600 mb-1">신청 내용</div>
                                    <div class="text-sm">${req.description}</div>
                                </div>
                            </div>

                            <div class="flex gap-3">
                                <button onclick="approveRequest('${req.id}')"
                                        class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold" style="border: none; cursor: pointer;">
                                    승인 (자동 Zoom 생성)
                                </button>
                                <button onclick="rejectRequest('${req.id}')"
                                        class="px-6 py-3 border-2 border-gray-300 hover:border-red-500 hover:text-red-500 rounded-lg font-semibold" style="background: none; cursor: pointer;">
                                    거절
                                </button>
                            </div>

                            <div class="mt-3 text-sm text-gray-500">
                                ℹ️ 승인하면 시스템이 자동으로 Zoom 링크를 생성하고 학생에게 발송합니다
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="p-12 text-center text-gray-400">
                    <p>신청 대기 중인 미팅이 없습니다</p>
                </div>
            `}
        </div>
    `;
}

// ==================== 확정됨 탭 (1:1 + 그룹 통합) ====================
function renderConfirmedTab() {
    const meetings = DataService.getConfirmedMeetings();
    const tabContent = document.getElementById('meeting-tab-content');

    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <h3 class="text-lg font-bold">확정된 미팅 (${meetings.length}건)</h3>
                <p class="text-sm text-gray-600 mt-1">Zoom 링크가 생성된 미팅입니다</p>
            </div>

            ${meetings.length > 0 ? `
                <div class="divide-y">
                    ${meetings.map(meeting => {
                        const isGroup = meeting.type === 'group';
                        return `
                            <div class="p-6">
                                <div class="flex gap-2 mb-2">
                                    ${isGroup ?
                                        '<span class="badge-green">그룹</span>' :
                                        '<span class="badge-blue">1:1</span>'
                                    }
                                    <span class="badge-green">확정</span>
                                </div>

                                <div class="text-xl font-bold mb-2">
                                    ${meeting.date || meeting.selectedDate} (${getDayOfWeek(meeting.date || meeting.selectedDate)}) ${meeting.startTime || meeting.selectedTime}
                                </div>

                                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                    ${isGroup ? `
                                        <div class="text-sm text-gray-600 mb-2">참여 학생 (${meeting.participantCount}명)</div>
                                        <div class="space-y-1">
                                            ${meeting.participants.map(p => `
                                                <div>• ${p.studentName} (${p.studentNumber})</div>
                                            `).join('')}
                                        </div>
                                        ${meeting.topic ? `
                                            <div class="mt-3 pt-3 border-t">
                                                <div class="text-sm text-gray-600">주제</div>
                                                <div class="font-semibold">${meeting.topic}</div>
                                            </div>
                                        ` : ''}
                                    ` : `
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <div class="text-sm text-gray-600">학생</div>
                                                <div class="font-semibold">${meeting.studentName}</div>
                                            </div>
                                            <div>
                                                <div class="text-sm text-gray-600">승인일</div>
                                                <div class="font-semibold">${formatDate(meeting.approvedDate)}</div>
                                            </div>
                                        </div>
                                    `}
                                </div>

                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <div class="flex justify-between mb-2">
                                        <div class="text-sm font-semibold text-blue-800">Zoom 링크</div>
                                        <button onclick="copyToClipboard('${meeting.zoomJoinUrl}')"
                                                class="text-xs bg-blue-500 text-white px-3 py-1 rounded" style="border: none; cursor: pointer;">
                                            복사
                                        </button>
                                    </div>
                                    <div class="text-sm text-blue-800 break-all">${meeting.zoomJoinUrl}</div>
                                    ${meeting.zoomPassword ? `
                                        <div class="mt-2 text-xs text-blue-700">
                                            비밀번호: <span class="font-bold">${meeting.zoomPassword}</span>
                                        </div>
                                    ` : ''}
                                </div>

                                <div class="flex gap-3">
                                    <button onclick="openZoomMeeting('${meeting.zoomStartUrl}')"
                                            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold" style="border: none; cursor: pointer;">
                                        Zoom 시작하기
                                    </button>
                                    <button onclick="cancelMeeting('${meeting.id}')"
                                            class="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg font-semibold" style="background: none; cursor: pointer;">
                                        취소
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div class="p-12 text-center text-gray-400">
                    <p>확정된 미팅이 없습니다</p>
                </div>
            `}
        </div>
    `;
}

// ==================== 취소됨 탭 ====================
function renderCancelledTab() {
    const meetings = DataService.getCancelledMeetings();
    const tabContent = document.getElementById('meeting-tab-content');

    tabContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <h3 class="text-lg font-bold">취소된 미팅 (${meetings.length}건)</h3>
            </div>

            ${meetings.length > 0 ? `
                <div class="divide-y">
                    ${meetings.map(meeting => {
                        const isGroup = meeting.type === 'group';
                        return `
                            <div class="p-6">
                                <div class="flex gap-2 mb-2">
                                    ${isGroup ? '<span class="badge-green">그룹</span>' : '<span class="badge-blue">1:1</span>'}
                                    <span class="badge-red">취소됨</span>
                                </div>

                                <div class="text-xl font-bold mb-2">
                                    ${meeting.date || meeting.selectedDate} (${getDayOfWeek(meeting.date || meeting.selectedDate)}) ${meeting.startTime || meeting.selectedTime}
                                </div>

                                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                    ${isGroup ? `
                                        <div class="text-sm text-gray-600 mb-2">참여 학생 (${meeting.participantCount}명)</div>
                                        <div class="space-y-1">
                                            ${meeting.participants.map(p => `<div>• ${p.studentName}</div>`).join('')}
                                        </div>
                                    ` : `
                                        <div>
                                            <div class="text-sm text-gray-600">학생</div>
                                            <div class="font-semibold">${meeting.studentName}</div>
                                        </div>
                                    `}
                                </div>

                                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div class="text-sm font-semibold text-red-800 mb-1">취소 사유</div>
                                    <div class="text-sm text-red-700">${meeting.cancelReason || '(사유 없음)'}</div>
                                    <div class="text-xs text-red-600 mt-2">취소일: ${formatDateTime(meeting.cancelledAt)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div class="p-12 text-center text-gray-400">
                    <p>취소된 미팅이 없습니다</p>
                </div>
            `}
        </div>
    `;
}

// Helper
function getDayName(dayOfWeek) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayOfWeek] + '요일';
}

console.log('meeting-v2.js 로드 완료 (개선판)');

// Export
window.initMeetingV2 = initMeetingV2;
window.changeMeetingTab = changeMeetingTab;
window.renderWaitingTab = renderWaitingTab;
window.renderConfirmedTab = renderConfirmedTab;
window.renderCancelledTab = renderCancelledTab;
window.initCalendar = initCalendar;
window.openAddSlotModal = openAddSlotModal;
window.openAddSlotModalWithDate = openAddSlotModalWithDate;
window.saveSlot = saveSlot;
window.deleteSlot = deleteSlot;
window.approveRequestV2 = approveRequestV2;
window.confirmApproveV2 = confirmApproveV2;
window.rejectRequestV2 = rejectRequestV2;
window.confirmRejectV2 = confirmRejectV2;
