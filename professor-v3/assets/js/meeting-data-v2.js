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
        type: 'individual', // 1:1 미팅
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

        // 취소 정보
        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        
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
        type: 'individual',
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

        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        
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
        type: 'individual',
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

        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        
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
        type: 'individual',
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

        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        
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

// 그룹 미팅 (교수가 직접 학생들을 지정)
const GROUP_MEETINGS = [
    {
        id: 'GM001',
        type: 'group',
        professorId: 'P001',
        date: '2025-11-28',
        startTime: '10:00',
        duration: 90,
        participants: [
            {
                studentId: 'S001',
                studentName: '김철수',
                studentNumber: '2024001'
            },
            {
                studentId: 'S002',
                studentName: '이영희',
                studentNumber: '2024002'
            }
        ],
        participantCount: 2,
        topic: '연구방법론 집단 지도',
        status: 'confirmed',
        createdBy: 'professor',
        createdAt: '2025-11-15T14:30:00',
        zoomMeetingId: '987654321',
        zoomJoinUrl: 'https://zoom.us/j/987654321?pwd=xyz789',
        zoomPassword: 'xyz789',
        zoomStartUrl: 'https://zoom.us/s/987654321?zak=abc123',

        // 취소 정보
        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null
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
    
    // 미팅 신청 관리
    DataService.getMeetingRequestsV2 = function(status) {
        return status 
            ? MEETING_REQUESTS_V2.filter(r => r.status === status)
            : MEETING_REQUESTS_V2;
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

    // 새로운 통합 통계 (1:1 + 그룹)
    DataService.getMeetingStats = function() {
        const individual = MEETING_REQUESTS_V2;
        const groups = GROUP_MEETINGS;

        return {
            waiting: individual.filter(m => m.status === 'pending').length,
            confirmed: individual.filter(m => m.status === 'approved').length +
                      groups.filter(m => m.status === 'confirmed').length,
            completed: individual.filter(m => m.status === 'completed').length +
                      groups.filter(m => m.status === 'completed').length,
            cancelled: individual.filter(m => m.status === 'cancelled').length +
                      groups.filter(m => m.status === 'cancelled').length
        };
    };

    // 대기 중인 신청 (승인 대기)
    DataService.getPendingRequests = function() {
        return MEETING_REQUESTS_V2.filter(r => r.status === 'pending');
    };

    // 확정된 미팅 (1:1 + 그룹 모두)
    DataService.getConfirmedMeetings = function() {
        const individual = MEETING_REQUESTS_V2.filter(m => m.status === 'approved');
        const groups = GROUP_MEETINGS.filter(m => m.status === 'confirmed');
        return [...individual, ...groups].sort((a, b) =>
            new Date(a.selectedDate || a.date) - new Date(b.selectedDate || b.date)
        );
    };

    // 완료된 미팅
    DataService.getCompletedMeetings = function() {
        const individual = MEETING_REQUESTS_V2.filter(m => m.status === 'completed');
        const groups = GROUP_MEETINGS.filter(m => m.status === 'completed');
        return [...individual, ...groups].sort((a, b) =>
            new Date(b.completedDate || b.date) - new Date(a.completedDate || a.date)
        );
    };

    // 취소된 미팅
    DataService.getCancelledMeetings = function() {
        const individual = MEETING_REQUESTS_V2.filter(m => m.status === 'cancelled');
        const groups = GROUP_MEETINGS.filter(m => m.status === 'cancelled');
        return [...individual, ...groups].sort((a, b) =>
            new Date(b.cancelledAt) - new Date(a.cancelledAt)
        );
    };

    // 미팅 ID로 찾기 (1:1 + 그룹 모두)
    DataService.getMeetingById = function(meetingId) {
        let meeting = MEETING_REQUESTS_V2.find(m => m.id === meetingId);
        if (!meeting) {
            meeting = GROUP_MEETINGS.find(m => m.id === meetingId);
        }
        return meeting;
    };

    // 신청 ID로 찾기
    DataService.getRequestById = function(requestId) {
        return MEETING_REQUESTS_V2.find(r => r.id === requestId);
    };

    // 학생 정보 가져오기 (mock)
    DataService.getStudentById = function(studentId) {
        const students = {
            'S001': { id: 'S001', name: '김철수', studentNumber: '2024001', thesisTopic: 'AI 윤리 연구' },
            'S002': { id: 'S002', name: '이영희', studentNumber: '2024002', thesisTopic: '블록체인 보안' },
            'S003': { id: 'S003', name: '박민수', studentNumber: '2024003', thesisTopic: '메타버스 플랫폼' }
        };
        return students[studentId];
    };

    // 전체 학생 목록 (mock)
    DataService.getAllStudents = function() {
        return [
            { id: 'S001', name: '김철수', studentNumber: '2024001', major: '컴퓨터공학', semester: '1학기', thesisTopic: 'AI 윤리 연구' },
            { id: 'S002', name: '이영희', studentNumber: '2024002', major: '소프트웨어공학', semester: '2학기', thesisTopic: '블록체인 보안' },
            { id: 'S003', name: '박민수', studentNumber: '2024003', major: '컴퓨터공학', semester: '1학기', thesisTopic: '메타버스 플랫폼' },
            { id: 'S004', name: '최수진', studentNumber: '2024004', major: '정보보안학', semester: '3학기', thesisTopic: '네트워크 보안' },
            { id: 'S005', name: '정민호', studentNumber: '2024005', major: '데이터사이언스', semester: '1학기', thesisTopic: '빅데이터 분석' }
        ];
    };

    // 그룹 미팅 추가
    DataService.addGroupMeeting = function(data) {
        const students = data.participantIds.map(id => {
            const student = this.getStudentById(id);
            return {
                studentId: id,
                studentName: student.name,
                studentNumber: student.studentNumber
            };
        });

        const newMeeting = {
            id: 'GM' + Date.now(),
            type: 'group',
            professorId: 'P001',
            date: data.date,
            startTime: data.startTime,
            duration: data.duration,
            participants: students,
            participantCount: students.length,
            topic: data.topic,
            status: 'confirmed',
            createdBy: 'professor',
            createdAt: new Date().toISOString(),
            zoomMeetingId: data.zoomMeetingId,
            zoomJoinUrl: data.zoomJoinUrl,
            zoomPassword: data.zoomPassword,
            zoomStartUrl: data.zoomStartUrl,
            cancelledAt: null,
            cancelledBy: null,
            cancelReason: null
        };

        GROUP_MEETINGS.push(newMeeting);
        console.log('✅ 그룹 미팅 생성:', newMeeting);
        return newMeeting;
    };

    // 승인 시 Zoom 정보 저장 (기존 함수 수정)
    DataService.approveRequest = function(requestId, zoomInfo) {
        const request = MEETING_REQUESTS_V2.find(r => r.id === requestId);
        if (request && request.status === 'pending') {
            request.status = 'approved';
            request.approvedDate = new Date().toISOString().split('T')[0];
            request.zoomMeetingId = zoomInfo.zoomMeetingId;
            request.zoomJoinUrl = zoomInfo.zoomJoinUrl;
            request.zoomPassword = zoomInfo.zoomPassword;
            request.zoomStartUrl = zoomInfo.zoomStartUrl;
            console.log('✅ 미팅 승인 완료:', request);
            return request;
        }
        return null;
    };

    // 미팅 취소
    DataService.cancelMeeting = function(meetingId, reason) {
        let meeting = MEETING_REQUESTS_V2.find(m => m.id === meetingId);
        if (!meeting) {
            meeting = GROUP_MEETINGS.find(m => m.id === meetingId);
        }

        if (meeting) {
            meeting.status = 'cancelled';
            meeting.cancelledAt = new Date().toISOString();
            meeting.cancelledBy = 'professor';
            meeting.cancelReason = reason;
            console.log('✅ 미팅 취소:', meeting);
            return meeting;
        }
        return null;
    };
    
    // 미팅 승인 (Zoom API 시뮬레이션)
    DataService.approveMeetingV2 = function(id, comment) {
        const meeting = MEETING_REQUESTS_V2.find(r => r.id === id);
        if (meeting && meeting.status === 'pending') {
            meeting.status = 'approved';
            meeting.approvedDate = new Date().toISOString().split('T')[0];
            meeting.professorComment = comment;
            
            // Zoom 미팅이면 Zoom API 호출 (시뮬레이션)
            if (meeting.meetingType === 'online') {
                const zoomInfo = simulateZoomAPI(meeting);
                Object.assign(meeting, zoomInfo);
            }
            
            return meeting;
        }
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
window.GROUP_MEETINGS = GROUP_MEETINGS;
