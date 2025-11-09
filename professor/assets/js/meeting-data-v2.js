// Phase 3 재설계: 랩미팅관리 데이터

// 교수가 설정한 가능 일정
const AVAILABLE_SLOTS = [
    {
        id: 'SLOT001',
        professorId: 'P001',
        type: 'repeat', // 'oneTime' or 'repeat'
        dayOfWeek: 1, // 월요일 (0=일, 1=월, ...) - repeat일 때만
        date: null, // 특정 날짜 (oneTime일 때만)
        time: '14:00',
        duration: 60,
        meetingType: 'online', // online, offline, both
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        status: 'active' // active, inactive
    },
    {
        id: 'SLOT002',
        professorId: 'P001',
        type: 'repeat',
        dayOfWeek: 3, // 수요일
        date: null,
        time: '10:00',
        duration: 90,
        meetingType: 'both',
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        status: 'active'
    },
    {
        id: 'SLOT003',
        professorId: 'P001',
        type: 'repeat',
        dayOfWeek: 5, // 금요일
        date: null,
        time: '15:00',
        duration: 60,
        meetingType: 'offline',
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        status: 'active'
    },
    {
        id: 'SLOT004',
        professorId: 'P001',
        type: 'oneTime', // 특정 날짜 1회만
        dayOfWeek: null,
        date: '2025-11-12', // 특정 날짜
        time: '16:00',
        duration: 60,
        meetingType: 'online',
        startDate: '2025-11-12',
        endDate: '2025-11-12',
        status: 'active'
    }
];

// 학생 미팅 신청 (교수가 지정한 날짜 중 선택)
const MEETING_REQUESTS_V2 = [
    {
        id: 'REQ001',
        slotId: 'SLOT001', // 어떤 일정을 선택했는지
        studentId: 'S001',
        studentName: '김철수',
        studentNumber: '2024001',
        requestDate: '2025-10-28',
        selectedDate: '2025-11-04', // 실제 선택한 날짜 (월요일)
        selectedTime: '14:00',
        duration: 60,
        meetingType: 'online',
        topic: '연구방법론 논의',
        description: '질적연구와 양적연구 방법론에 대해 상담 받고 싶습니다.',
        status: 'pending', // pending, approved, rejected, completed, cancelled
        
        // 승인 정보
        approvedDate: null,
        professorComment: null,
        
        // Zoom 정보 (Zoom API에서 생성)
        zoomMeetingId: null,
        zoomJoinUrl: null,
        zoomPassword: null,
        zoomStartUrl: null, // 교수용
        
        // 완료 정보
        completedDate: null,
        actualDuration: null,
        meetingSummary: null,
        
        // 녹화 정보 (Zoom Cloud Recording)
        recordingId: null,
        recordingUrl: null,
        recordingDuration: null,
        recordingSize: null,
        
        // 거절 정보
        rejectedDate: null,
        rejectionReason: null
    },
    {
        id: 'REQ002',
        slotId: 'SLOT002',
        studentId: 'S002',
        studentName: '이영희',
        studentNumber: '2024002',
        requestDate: '2025-10-25',
        selectedDate: '2025-11-06', // 수요일
        selectedTime: '10:00',
        duration: 90,
        meetingType: 'online',
        topic: '중간논문 피드백',
        description: '3장까지 작성한 중간논문에 대한 피드백을 받고 싶습니다.',
        status: 'approved',
        
        approvedDate: '2025-10-26',
        professorComment: '3장까지 잘 작성되었습니다.',
        
        // Zoom API로 생성된 정보 (시뮬레이션)
        zoomMeetingId: '123456789',
        zoomJoinUrl: 'https://zoom.us/j/123456789?pwd=abc123',
        zoomPassword: 'abc123',
        zoomStartUrl: 'https://zoom.us/s/123456789?zak=xyz789',
        
        completedDate: null,
        actualDuration: null,
        meetingSummary: null,
        
        recordingId: null,
        recordingUrl: null,
        recordingDuration: null,
        recordingSize: null,
        
        rejectedDate: null,
        rejectionReason: null
    },
    {
        id: 'REQ003',
        slotId: 'SLOT003',
        studentId: 'S001',
        studentName: '김철수',
        studentNumber: '2024001',
        requestDate: '2025-10-20',
        selectedDate: '2025-10-25', // 금요일
        selectedTime: '15:00',
        duration: 60,
        meetingType: 'offline',
        topic: '논문 주제 선정',
        description: '논문 주제 후보 3개에 대해 논의하고 싶습니다.',
        status: 'completed',
        
        approvedDate: '2025-10-21',
        professorComment: '연구실에서 대면 미팅으로 진행하겠습니다.',
        
        zoomMeetingId: null,
        zoomJoinUrl: null,
        zoomPassword: null,
        zoomStartUrl: null,
        
        completedDate: '2025-10-25',
        actualDuration: 75,
        meetingSummary: '3개 주제 중 "AI 기반 학습자 맞춤형 교육 시스템"으로 최종 결정. 다음 주까지 선행연구 10편 이상 검토 후 연구계획서 초안 작성.',
        
        recordingId: null,
        recordingUrl: null,
        recordingDuration: null,
        recordingSize: null,
        
        rejectedDate: null,
        rejectionReason: null
    },
    {
        id: 'REQ004',
        slotId: 'SLOT001',
        studentId: 'S003',
        studentName: '박민수',
        studentNumber: '2024003',
        requestDate: '2025-10-18',
        selectedDate: '2025-10-21', // 월요일
        selectedTime: '14:00',
        duration: 60,
        meetingType: 'online',
        topic: '선행연구 검토',
        description: '선행연구 10편 검토 결과를 공유하고 싶습니다.',
        status: 'completed',
        
        approvedDate: '2025-10-19',
        professorComment: '선행연구 검토 잘 하셨습니다.',
        
        zoomMeetingId: '987654321',
        zoomJoinUrl: 'https://zoom.us/j/987654321?pwd=def456',
        zoomPassword: 'def456',
        zoomStartUrl: 'https://zoom.us/s/987654321?zak=uvw123',
        
        completedDate: '2025-10-21',
        actualDuration: 55,
        meetingSummary: '선행연구 분석 결과 논의. 연구 gap 3가지 도출.',
        
        // Zoom 자동 녹화 정보
        recordingId: 'REC001',
        recordingUrl: 'https://zoom.us/rec/share/abc123def456',
        recordingDuration: 55, // 분
        recordingSize: '245 MB',
        
        rejectedDate: null,
        rejectionReason: null
    }
];

// DataService 확장
if (typeof DataService !== 'undefined') {
    // 교수 가능 일정 관리
    DataService.getAvailableSlots = function() {
        return AVAILABLE_SLOTS.filter(s => s.professorId === 'P001' && s.status === 'active');
    };
    
    DataService.addAvailableSlot = function(slotData) {
        const newSlot = {
            id: 'SLOT' + String(AVAILABLE_SLOTS.length + 1).padStart(3, '0'),
            professorId: 'P001',
            ...slotData,
            status: 'active'
        };
        AVAILABLE_SLOTS.push(newSlot);
        return newSlot;
    };
    
    DataService.deleteAvailableSlot = function(slotId) {
        const slot = AVAILABLE_SLOTS.find(s => s.id === slotId);
        if (slot) {
            slot.status = 'inactive';
            return true;
        }
        return false;
    };
    
    // 미팅 신청 관리 (🔧 Critical Fix #5: ProtoStorage 연동)
    DataService.getMeetingRequestsV2 = function(status) {
        // 기본 mock 데이터
        let allRequests = [...MEETING_REQUESTS_V2];

        // 🔧 ProtoStorage에서 학생이 신청한 미팅 가져오기
        if (window.ProtoStorage) {
            const storedRequests = window.ProtoStorage.load('meeting_requests', []);
            if (storedRequests.length > 0) {
                console.log('📂 [getMeetingRequestsV2] ProtoStorage에서', storedRequests.length, '건 로드');
                // 중복 제거: storedRequests를 우선하고, 동일 ID가 없는 mock만 추가
                const storedIds = storedRequests.map(r => r.id);
                const uniqueMockRequests = MEETING_REQUESTS_V2.filter(r => !storedIds.includes(r.id));
                allRequests = [...storedRequests, ...uniqueMockRequests];
            }
        }

        return status
            ? allRequests.filter(r => r.status === status)
            : allRequests;
    };
    
    DataService.getMeetingDetailV2 = function(id) {
        return MEETING_REQUESTS_V2.find(r => r.id === id);
    };
    
    DataService.getMeetingStatsV2 = function() {
        return {
            pending: MEETING_REQUESTS_V2.filter(r => r.status === 'pending').length,
            approved: MEETING_REQUESTS_V2.filter(r => r.status === 'approved').length,
            completed: MEETING_REQUESTS_V2.filter(r => r.status === 'completed').length,
            rejected: MEETING_REQUESTS_V2.filter(r => r.status === 'rejected').length
        };
    };
    
    // 미팅 승인 (Zoom API 시뮬레이션) (🔧 Critical Fix #5: ProtoStorage 연동)
    DataService.approveMeetingV2 = function(id, comment) {
        console.log('🔵 [approveMeetingV2] 시작:', id, comment);

        // 먼저 MEETING_REQUESTS_V2에서 찾기
        let meeting = MEETING_REQUESTS_V2.find(r => r.id === id);
        let isFromStorage = false;

        // 🔧 없으면 ProtoStorage에서 찾기
        if (!meeting && window.ProtoStorage) {
            const storedRequests = window.ProtoStorage.load('meeting_requests', []);
            meeting = storedRequests.find(r => r.id === id);
            isFromStorage = true;
            console.log('📂 [approveMeetingV2] ProtoStorage에서 찾음:', meeting);
        }

        if (meeting && meeting.status === 'pending') {
            meeting.status = 'approved';
            meeting.approvedDate = new Date().toISOString().split('T')[0];
            meeting.professorComment = comment;

            // Zoom 미팅이면 Zoom API 호출 (시뮬레이션)
            if (meeting.meetingType === 'online') {
                const zoomInfo = simulateZoomAPI(meeting);
                Object.assign(meeting, zoomInfo);
            }

            // 🔧 ProtoStorage에 저장된 것이면 업데이트
            if (isFromStorage && window.ProtoStorage) {
                const storedRequests = window.ProtoStorage.load('meeting_requests', []);
                const index = storedRequests.findIndex(r => r.id === id);
                if (index !== -1) {
                    storedRequests[index] = meeting;
                    window.ProtoStorage.save('meeting_requests', storedRequests);
                    console.log('💾 [approveMeetingV2] ProtoStorage 업데이트 완료');
                }
            }

            console.log('✅ [approveMeetingV2] 승인 완료:', meeting);
            return meeting;
        }

        console.warn('⚠️ [approveMeetingV2] 미팅을 찾을 수 없거나 이미 처리됨');
        return null;
    };
    
    // 미팅 거절
    DataService.rejectMeetingV2 = function(id, reason) {
        const meeting = MEETING_REQUESTS_V2.find(r => r.id === id);
        if (meeting && meeting.status === 'pending') {
            meeting.status = 'rejected';
            meeting.rejectedDate = new Date().toISOString().split('T')[0];
            meeting.rejectionReason = reason;
            return meeting;
        }
        return null;
    };
    
    // 미팅 완료 처리
    DataService.completeMeetingV2 = function(id, data) {
        const meeting = MEETING_REQUESTS_V2.find(r => r.id === id);
        if (meeting && meeting.status === 'approved') {
            meeting.status = 'completed';
            meeting.completedDate = data.completedDate;
            meeting.actualDuration = data.actualDuration;
            meeting.meetingSummary = data.meetingSummary;
            
            // Zoom 녹화 확인 (시뮬레이션)
            if (meeting.meetingType === 'online' && data.checkRecording) {
                const recordingInfo = simulateZoomRecording(meeting);
                if (recordingInfo) {
                    Object.assign(meeting, recordingInfo);
                }
            }
            
            return meeting;
        }
        return null;
    };
}

// Zoom API 시뮬레이션 - 미팅 생성
function simulateZoomAPI(meeting) {
    const meetingId = String(Math.floor(Math.random() * 1000000000));
    const password = Math.random().toString(36).substring(2, 8);
    
    return {
        zoomMeetingId: meetingId,
        zoomJoinUrl: `https://zoom.us/j/${meetingId}?pwd=${password}`,
        zoomPassword: password,
        zoomStartUrl: `https://zoom.us/s/${meetingId}?zak=${Math.random().toString(36).substring(2, 8)}`
    };
}

// Zoom Cloud Recording 시뮬레이션
function simulateZoomRecording(meeting) {
    // 50% 확률로 녹화본 있음
    if (Math.random() > 0.5) {
        return {
            recordingId: 'REC' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
            recordingUrl: `https://zoom.us/rec/share/${Math.random().toString(36).substring(2, 15)}`,
            recordingDuration: meeting.actualDuration || meeting.duration,
            recordingSize: Math.floor(meeting.actualDuration * 4.5) + ' MB' // 대략 4.5MB/분
        };
    }
    return null;
}

// 전역 export
window.AVAILABLE_SLOTS = AVAILABLE_SLOTS;
window.MEETING_REQUESTS_V2 = MEETING_REQUESTS_V2;
