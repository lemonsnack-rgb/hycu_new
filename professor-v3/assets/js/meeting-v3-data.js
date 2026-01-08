// ==================== 미팅 관리 V3 데이터 모델 ====================
// V2에서 확장된 데이터 구조 - 13개 검색 필터 지원

/**
 * 학생 정보 확장 구조
 * - V3에서는 13개 검색 필터를 지원하기 위해 학생 정보가 확장됨
 */

// 교수가 설정한 가능 일정 (변경 없음)
const AVAILABLE_SLOTS_V3 = [
    {
        id: 'SLOT001',
        professorId: 'P001',
        professorName: '김교수',
        type: 'oneTime',
        dayOfWeek: null,
        date: '2026-01-10',
        time: '14:00',
        duration: 60,
        meetingType: 'online',
        startDate: '2026-01-10',
        endDate: '2026-01-10',
        status: 'active'
    },
    {
        id: 'SLOT002',
        professorId: 'P001',
        professorName: '김교수',
        type: 'oneTime',
        dayOfWeek: null,
        date: '2026-01-13',
        time: '10:00',
        duration: 60,
        meetingType: 'offline',
        startDate: '2026-01-13',
        endDate: '2026-01-13',
        status: 'active'
    },
    {
        id: 'SLOT003',
        professorId: 'P001',
        professorName: '김교수',
        type: 'oneTime',
        dayOfWeek: null,
        date: '2026-01-15',
        time: '15:00',
        duration: 90,
        meetingType: 'online',
        startDate: '2026-01-15',
        endDate: '2026-01-15',
        status: 'active'
    },
    {
        id: 'SLOT004',
        professorId: 'P002',
        professorName: '박교수',
        type: 'oneTime',
        dayOfWeek: null,
        date: '2026-01-17',
        time: '16:00',
        duration: 60,
        meetingType: 'online',
        startDate: '2026-01-17',
        endDate: '2026-01-17',
        status: 'active'
    },
    {
        id: 'SLOT005',
        professorId: 'P002',
        professorName: '박교수',
        type: 'oneTime',
        dayOfWeek: null,
        date: '2026-01-20',
        time: '11:00',
        duration: 60,
        meetingType: 'offline',
        startDate: '2026-01-20',
        endDate: '2026-01-20',
        status: 'active'
    }
];

// 학생 기본 정보 (13개 검색 필터용)
const STUDENTS_V3 = [
    {
        id: 'S001',
        studentNumber: '2024001',
        name: '김철수',

        // 13개 검색 필터 필드
        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '-',
        department: '컴퓨터공학',
        degreeType: '석사',
        enrollmentStatus: '재학',
        advisorName: '박교수',

        // 추가 정보
        thesisTopic: 'AI 윤리 연구',
        email: 'kim@example.com',
        phone: '010-1234-5678'
    },
    {
        id: 'S002',
        studentNumber: '2024002',
        name: '이영희',

        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '-',
        department: '소프트웨어공학',
        degreeType: '석사',
        enrollmentStatus: '재학',
        advisorName: '박교수',

        thesisTopic: '블록체인 보안',
        email: 'lee@example.com',
        phone: '010-2345-6789'
    },
    {
        id: 'S003',
        studentNumber: '2024003',
        name: '박민수',

        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '-',
        department: '컴퓨터공학',
        degreeType: '박사',
        enrollmentStatus: '재학',
        advisorName: '박교수',

        thesisTopic: '메타버스 플랫폼',
        email: 'park@example.com',
        phone: '010-3456-7890'
    },
    {
        id: 'S004',
        studentNumber: '2024004',
        name: '최수진',

        academicYear: '2024',
        semester: '2',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '-',
        department: '정보보안학',
        degreeType: '석사',
        enrollmentStatus: '휴학',
        advisorName: '박교수',

        thesisTopic: '네트워크 보안',
        email: 'choi@example.com',
        phone: '010-4567-8901'
    },
    {
        id: 'S005',
        studentNumber: '2024005',
        name: '정민호',

        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '-',
        department: '데이터사이언스',
        degreeType: '석사',
        enrollmentStatus: '재학',
        advisorName: '박교수',

        thesisTopic: '빅데이터 분석',
        email: 'jung@example.com',
        phone: '010-5678-9012'
    }
];

/**
 * 미팅 요청 데이터 - V3 확장 버전
 * - V2의 모든 필드 유지
 * - 학생 정보 13개 필드 추가 (검색 필터용)
 */
const MEETING_REQUESTS_V3 = [
    // 학생 2023001 (홍길동)의 신청 내역
    {
        id: 'REQ001',
        type: 'individual',
        slotId: 'SLOT001',
        studentId: 'S999',
        studentNumber: '2023001',
        studentName: '홍길동',
        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '컴퓨터공학부',
        department: '컴퓨터공학',
        degreeType: '석사',
        enrollmentStatus: '재학',
        advisorName: '김교수',

        requestDate: '2026-01-07',
        selectedDate: '2026-01-10',
        selectedTime: '14:00',
        duration: 60,
        meetingType: 'online',
        topic: '논문 주제 상담',
        description: '논문 주제 선정에 대해 상담 받고 싶습니다.',
        status: 'pending',

        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        approvedDate: null,
        professorComment: null,
        zoomMeetingId: null,
        zoomJoinUrl: null,
        zoomPassword: null,
        zoomStartUrl: null,
        completedDate: null,
        actualDuration: null,
        meetingSummary: null,
        recordingId: null,
        recordingUrl: null,
        recordingDuration: null,
        recordingSize: null,
        rejectedDate: null,
        rejectionReason: null,
        createdBy: 'student',
        createdAt: '2026-01-07T10:30:00'
    },
    {
        id: 'REQ002',
        type: 'individual',
        slotId: 'SLOT003',
        studentId: 'S999',
        studentNumber: '2023001',
        studentName: '홍길동',
        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '컴퓨터공학부',
        department: '컴퓨터공학',
        degreeType: '석사',
        enrollmentStatus: '재학',
        advisorName: '김교수',

        requestDate: '2026-01-05',
        selectedDate: '2026-01-15',
        selectedTime: '15:00',
        duration: 90,
        meetingType: 'online',
        topic: '연구 방법론 논의',
        description: '연구 설계 방법에 대해 논의하고 싶습니다.',
        status: 'approved',

        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        approvedDate: '2026-01-06',
        professorComment: '연구 방향이 좋습니다.',
        zoomMeetingId: '987654321',
        zoomJoinUrl: 'https://zoom.us/j/987654321?pwd=def456',
        zoomPassword: 'def456',
        zoomStartUrl: 'https://zoom.us/s/987654321?zak=uvw456',
        completedDate: null,
        actualDuration: null,
        meetingSummary: null,
        recordingId: null,
        recordingUrl: null,
        recordingDuration: null,
        recordingSize: null,
        rejectedDate: null,
        rejectionReason: null,
        createdBy: 'student',
        createdAt: '2026-01-05T09:00:00'
    },
    {
        id: 'REQ003',
        type: 'individual',
        slotId: null,
        studentId: 'S999',
        studentNumber: '2023001',
        studentName: '홍길동',
        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '컴퓨터공학부',
        department: '컴퓨터공학',
        degreeType: '석사',
        enrollmentStatus: '재학',
        advisorName: '김교수',

        requestDate: '2026-01-03',
        selectedDate: '2026-01-08',
        selectedTime: '10:00',
        duration: 60,
        meetingType: 'online',
        topic: '문헌 검토',
        description: '문헌 검토 결과에 대해 논의하고 싶습니다.',
        status: 'completed',

        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        approvedDate: '2026-01-03',
        professorComment: '문헌 검토 결과를 함께 검토하겠습니다.',
        zoomMeetingId: '111222333',
        zoomJoinUrl: 'https://zoom.us/j/111222333?pwd=ghi789',
        zoomPassword: 'ghi789',
        zoomStartUrl: 'https://zoom.us/s/111222333?zak=rst123',
        completedDate: '2026-01-08',
        actualDuration: 65,
        meetingSummary: '문헌 검토 결과 논의 완료. 다음 단계로 연구 설계 진행 예정.',
        recordingId: 'REC001',
        recordingUrl: 'https://zoom.us/rec/111222333',
        recordingDuration: 65,
        recordingSize: 250,
        rejectedDate: null,
        rejectionReason: null,
        createdBy: 'student',
        createdAt: '2026-01-03T08:00:00'
    },
    {
        id: 'REQ004',
        type: 'individual',
        slotId: 'SLOT003',
        studentId: 'S001',

        studentNumber: '2024001',
        studentName: '김철수',
        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '-',
        department: '컴퓨터공학',
        degreeType: '석사',
        enrollmentStatus: '재학',
        advisorName: '박교수',

        requestDate: '2025-10-20',
        selectedDate: '2025-10-25',
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
        rejectionReason: null,

        createdBy: 'student',
        createdAt: '2025-10-20T11:15:00'
    },
    {
        id: 'REQ004',
        type: 'individual',
        slotId: 'SLOT001',
        studentId: 'S003',

        studentNumber: '2024003',
        studentName: '박민수',
        academicYear: '2025',
        semester: '1',
        collegeType: '일반대학원',
        division: '일반대학원',
        undergradMajor: '-',
        department: '컴퓨터공학',
        degreeType: '박사',
        enrollmentStatus: '재학',
        advisorName: '박교수',

        requestDate: '2025-10-18',
        selectedDate: '2025-10-21',
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

        recordingId: 'REC001',
        recordingUrl: 'https://zoom.us/rec/share/abc123def456',
        recordingDuration: 55,
        recordingSize: '245 MB',

        rejectedDate: null,
        rejectionReason: null,

        createdBy: 'student',
        createdAt: '2025-10-18T16:45:00'
    }
];

/**
 * 그룹 미팅 (또는 교수가 직접 생성한 1:1 미팅)
 * - V3에서는 "미팅 직접 생성" 기능
 * - 1명 선택 = 1:1 미팅
 * - 2명 이상 = 그룹 미팅
 */
const GROUP_MEETINGS_V3 = [
    {
        id: 'GM001',
        type: 'group', // group (2명 이상)
        professorId: 'P001',

        // 미팅 정보
        date: '2025-11-28',
        startTime: '10:00',
        duration: 90,
        meetingType: 'online',
        topic: '연구방법론 집단 지도',

        // 참여 학생 목록
        participants: [
            {
                studentId: 'S001',
                studentNumber: '2024001',
                studentName: '김철수',
                academicYear: '2025',
                semester: '1',
                collegeType: '일반대학원',
                division: '일반대학원',
                undergradMajor: '-',
                department: '컴퓨터공학',
                degreeType: '석사',
                enrollmentStatus: '재학',
                advisorName: '박교수'
            },
            {
                studentId: 'S002',
                studentNumber: '2024002',
                studentName: '이영희',
                academicYear: '2025',
                semester: '1',
                collegeType: '일반대학원',
                division: '일반대학원',
                undergradMajor: '-',
                department: '소프트웨어공학',
                degreeType: '석사',
                enrollmentStatus: '재학',
                advisorName: '박교수'
            }
        ],
        participantCount: 2,

        // 상태
        status: 'confirmed', // confirmed, completed, cancelled

        // Zoom 정보
        zoomMeetingId: '987654321',
        zoomJoinUrl: 'https://zoom.us/j/987654321?pwd=xyz789',
        zoomPassword: 'xyz789',
        zoomStartUrl: 'https://zoom.us/s/987654321?zak=abc123',

        // 생성 정보
        createdBy: 'professor',
        createdAt: '2025-11-15T14:30:00',

        // 취소 정보
        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,

        // 완료 정보
        completedDate: null,
        actualDuration: null,
        meetingSummary: null,

        // 녹화 정보
        recordingId: null,
        recordingUrl: null,
        recordingDuration: null,
        recordingSize: null
    },
    {
        id: 'DIR001',
        type: 'direct_individual', // direct_individual (교수가 직접 생성한 1:1)
        professorId: 'P001',

        // 미팅 정보
        date: '2025-12-05',
        startTime: '14:00',
        duration: 60,
        meetingType: 'online',
        topic: '최종 논문 검토',

        // 참여 학생 (1명)
        participants: [
            {
                studentId: 'S003',
                studentNumber: '2024003',
                studentName: '박민수',
                academicYear: '2025',
                semester: '1',
                collegeType: '일반대학원',
                division: '일반대학원',
                undergradMajor: '-',
                department: '컴퓨터공학',
                degreeType: '박사',
                enrollmentStatus: '재학',
                advisorName: '박교수'
            }
        ],
        participantCount: 1,

        status: 'confirmed',

        zoomMeetingId: '555666777',
        zoomJoinUrl: 'https://zoom.us/j/555666777?pwd=qwe123',
        zoomPassword: 'qwe123',
        zoomStartUrl: 'https://zoom.us/s/555666777?zak=rty456',

        createdBy: 'professor',
        createdAt: '2025-11-20T10:15:00',

        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,

        completedDate: null,
        actualDuration: null,
        meetingSummary: null,

        recordingId: null,
        recordingUrl: null,
        recordingDuration: null,
        recordingSize: null
    }
];

// ==================== DataService V3 ====================

const DataServiceV3 = {
    /**
     * 학생 정보 조회
     */
    getStudentById(studentId) {
        return STUDENTS_V3.find(s => s.id === studentId);
    },

    getAllStudents() {
        return STUDENTS_V3;
    },

    /**
     * 가능시간 관리
     */
    getAvailableSlots() {
        return AVAILABLE_SLOTS_V3.filter(s => s.status === 'active');
    },

    addAvailableSlot(slotData) {
        const newSlot = {
            id: 'SLOT' + String(AVAILABLE_SLOTS_V3.length + 1).padStart(3, '0'),
            professorId: 'P001',
            ...slotData,
            status: 'active'
        };
        AVAILABLE_SLOTS_V3.push(newSlot);
        console.log('✅ 가능시간 추가:', newSlot);
        return newSlot;
    },

    deleteAvailableSlot(slotId) {
        const slot = AVAILABLE_SLOTS_V3.find(s => s.id === slotId);
        if (slot) {
            slot.status = 'inactive';
            console.log('✅ 가능시간 삭제:', slotId);
            return true;
        }
        return false;
    },

    /**
     * 미팅 목록 조회 (통합)
     * - 1:1 신청 미팅 + 직접 생성 미팅 + 그룹 미팅
     */
    getAllMeetings(filters = {}) {
        // 개별 미팅 (학생 신청)
        const individualMeetings = MEETING_REQUESTS_V3.map(m => ({
            ...m,
            displayType: '1:1 (신청)',
            searchKey: m.studentName + m.studentNumber + m.department
        }));

        // 그룹 미팅 + 직접 생성 미팅
        const groupMeetings = GROUP_MEETINGS_V3.map(m => {
            // 첫 번째 참여자 정보를 대표로 사용 (목록 표시용)
            const mainParticipant = m.participants[0];

            return {
                ...m,
                // 그룹 미팅은 첫 번째 학생 정보를 대표로 표시
                studentId: mainParticipant.studentId,
                studentNumber: mainParticipant.studentNumber,
                studentName: mainParticipant.studentName,
                academicYear: mainParticipant.academicYear,
                semester: mainParticipant.semester,
                collegeType: mainParticipant.collegeType,
                division: mainParticipant.division,
                undergradMajor: mainParticipant.undergradMajor,
                department: mainParticipant.department,
                degreeType: mainParticipant.degreeType,
                enrollmentStatus: mainParticipant.enrollmentStatus,
                advisorName: mainParticipant.advisorName,

                // 날짜 필드 통일
                selectedDate: m.date,
                selectedTime: m.startTime,

                // 표시 타입
                displayType: m.type === 'group' ? `그룹 (${m.participantCount}명)` : '1:1 (직접)',
                searchKey: m.participants.map(p => p.studentName + p.studentNumber + p.department).join(' ')
            };
        });

        // 통합
        let allMeetings = [...individualMeetings, ...groupMeetings];

        // 필터 적용
        if (filters.status && filters.status.length > 0) {
            allMeetings = allMeetings.filter(m => {
                // status 배열에 포함된 것만
                return filters.status.includes(m.status);
            });
        }

        if (filters.academicYear) {
            allMeetings = allMeetings.filter(m => m.academicYear === filters.academicYear);
        }

        if (filters.semester) {
            allMeetings = allMeetings.filter(m => m.semester === filters.semester);
        }

        if (filters.collegeType) {
            allMeetings = allMeetings.filter(m => m.collegeType === filters.collegeType);
        }

        if (filters.division) {
            allMeetings = allMeetings.filter(m => m.division === filters.division);
        }

        if (filters.undergradMajor && filters.undergradMajor !== '-') {
            allMeetings = allMeetings.filter(m => m.undergradMajor === filters.undergradMajor);
        }

        if (filters.department) {
            allMeetings = allMeetings.filter(m => m.department === filters.department);
        }

        if (filters.degreeType) {
            allMeetings = allMeetings.filter(m => m.degreeType === filters.degreeType);
        }

        if (filters.enrollmentStatus) {
            allMeetings = allMeetings.filter(m => m.enrollmentStatus === filters.enrollmentStatus);
        }

        if (filters.studentNumber) {
            allMeetings = allMeetings.filter(m => m.studentNumber.includes(filters.studentNumber));
        }

        if (filters.studentName) {
            allMeetings = allMeetings.filter(m => m.studentName.includes(filters.studentName));
        }

        if (filters.advisorName) {
            allMeetings = allMeetings.filter(m => m.advisorName.includes(filters.advisorName));
        }

        if (filters.meetingType) {
            allMeetings = allMeetings.filter(m => m.meetingType === filters.meetingType);
        }

        // 날짜순 정렬 (최신순)
        allMeetings.sort((a, b) => {
            const dateA = new Date(a.selectedDate + ' ' + a.selectedTime);
            const dateB = new Date(b.selectedDate + ' ' + b.selectedTime);
            return dateB - dateA;
        });

        return allMeetings;
    },

    /**
     * 미팅 상세 조회
     */
    getMeetingById(meetingId) {
        let meeting = MEETING_REQUESTS_V3.find(m => m.id === meetingId);
        if (!meeting) {
            meeting = GROUP_MEETINGS_V3.find(m => m.id === meetingId);
        }
        return meeting;
    },

    /**
     * 미팅 통계
     */
    getMeetingStats() {
        const individual = MEETING_REQUESTS_V3;
        const groups = GROUP_MEETINGS_V3;

        return {
            pending: individual.filter(m => m.status === 'pending').length,
            confirmed: individual.filter(m => m.status === 'approved').length +
                      groups.filter(m => m.status === 'confirmed').length,
            completed: individual.filter(m => m.status === 'completed').length +
                      groups.filter(m => m.status === 'completed').length,
            cancelled: individual.filter(m => m.status === 'cancelled').length +
                      groups.filter(m => m.status === 'cancelled').length
        };
    },

    /**
     * 미팅 승인 (Zoom API 시뮬레이션)
     */
    approveMeeting(meetingId, comment) {
        const meeting = MEETING_REQUESTS_V3.find(m => m.id === meetingId);
        if (meeting && meeting.status === 'pending') {
            meeting.status = 'approved';
            meeting.approvedDate = new Date().toISOString().split('T')[0];
            meeting.professorComment = comment;

            // Zoom 미팅이면 Zoom 정보 생성
            if (meeting.meetingType === 'online') {
                const zoomInfo = this.generateZoomInfo(meeting);
                Object.assign(meeting, zoomInfo);
            }

            
            return meeting;
        }
        return null;
    },

    /**
     * 미팅 거절
     */
    rejectMeeting(meetingId, reason) {
        const meeting = MEETING_REQUESTS_V3.find(m => m.id === meetingId);
        if (meeting && meeting.status === 'pending') {
            meeting.status = 'rejected';
            meeting.rejectedDate = new Date().toISOString().split('T')[0];
            meeting.rejectionReason = reason;
            
            return meeting;
        }
        return null;
    },

    /**
     * 미팅 완료 처리
     */
    completeMeeting(meetingId, data) {
        let meeting = MEETING_REQUESTS_V3.find(m => m.id === meetingId);
        let isGroupMeeting = false;

        if (!meeting) {
            meeting = GROUP_MEETINGS_V3.find(m => m.id === meetingId);
            isGroupMeeting = true;
        }

        if (meeting && (meeting.status === 'approved' || meeting.status === 'confirmed')) {
            meeting.status = 'completed';
            meeting.completedDate = data.completedDate;
            meeting.actualDuration = data.actualDuration;
            meeting.meetingSummary = data.meetingSummary;

            // Zoom 녹화 확인
            if (meeting.meetingType === 'online' && data.checkRecording) {
                const recordingInfo = this.checkZoomRecording(meeting);
                if (recordingInfo) {
                    Object.assign(meeting, recordingInfo);
                }
            }

            
            return meeting;
        }
        return null;
    },

    /**
     * 미팅 취소
     */
    cancelMeeting(meetingId, reason) {
        let meeting = MEETING_REQUESTS_V3.find(m => m.id === meetingId);

        if (!meeting) {
            meeting = GROUP_MEETINGS_V3.find(m => m.id === meetingId);
        }

        if (meeting) {
            meeting.status = 'cancelled';
            meeting.cancelledAt = new Date().toISOString();
            meeting.cancelledBy = 'professor';
            meeting.cancelReason = reason;
            
            return meeting;
        }
        return null;
    },

    /**
     * 미팅 직접 생성 (1명 = 1:1, 2명+ = 그룹)
     */
    createDirectMeeting(data) {
        const participantIds = data.participantIds;
        const participants = participantIds.map(id => {
            const student = this.getStudentById(id);
            return {
                studentId: id,
                studentNumber: student.studentNumber,
                studentName: student.name,
                academicYear: student.academicYear,
                semester: student.semester,
                collegeType: student.collegeType,
                division: student.division,
                undergradMajor: student.undergradMajor,
                department: student.department,
                degreeType: student.degreeType,
                enrollmentStatus: student.enrollmentStatus,
                advisorName: student.advisorName
            };
        });

        const isGroup = participants.length >= 2;
        const prefix = isGroup ? 'GM' : 'DIR';

        const newMeeting = {
            id: prefix + Date.now(),
            type: isGroup ? 'group' : 'direct_individual',
            professorId: 'P001',
            date: data.date,
            startTime: data.startTime,
            duration: data.duration,
            meetingType: data.meetingType,
            topic: data.topic,
            participants: participants,
            participantCount: participants.length,
            status: 'confirmed',
            createdBy: 'professor',
            createdAt: new Date().toISOString(),
            cancelledAt: null,
            cancelledBy: null,
            cancelReason: null,
            completedDate: null,
            actualDuration: null,
            meetingSummary: null,
            recordingId: null,
            recordingUrl: null,
            recordingDuration: null,
            recordingSize: null
        };

        // Zoom 정보 생성
        if (data.meetingType === 'online') {
            const zoomInfo = this.generateZoomInfo(newMeeting);
            Object.assign(newMeeting, zoomInfo);
        }

        GROUP_MEETINGS_V3.push(newMeeting);
        console.log(`✅ ${isGroup ? '그룹' : '1:1'} 미팅 직접 생성:`, newMeeting);
        return newMeeting;
    },

    /**
     * Zoom 정보 생성 (시뮬레이션)
     */
    generateZoomInfo(meeting) {
        const meetingId = String(Math.floor(Math.random() * 1000000000));
        const password = Math.random().toString(36).substring(2, 8);

        return {
            zoomMeetingId: meetingId,
            zoomJoinUrl: `https://zoom.us/j/${meetingId}?pwd=${password}`,
            zoomPassword: password,
            zoomStartUrl: `https://zoom.us/s/${meetingId}?zak=${Math.random().toString(36).substring(2, 8)}`
        };
    },

    /**
     * Zoom 녹화 확인 (시뮬레이션)
     */
    checkZoomRecording(meeting) {
        // 50% 확률로 녹화본 있음
        if (Math.random() > 0.5) {
            return {
                recordingId: 'REC' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
                recordingUrl: `https://zoom.us/rec/share/${Math.random().toString(36).substring(2, 15)}`,
                recordingDuration: meeting.actualDuration || meeting.duration,
                recordingSize: Math.floor((meeting.actualDuration || meeting.duration) * 4.5) + ' MB'
            };
        }
        return null;
    }
};

// 전역 export
window.AVAILABLE_SLOTS_V3 = AVAILABLE_SLOTS_V3;
window.STUDENTS_V3 = STUDENTS_V3;
window.MEETING_REQUESTS_V3 = MEETING_REQUESTS_V3;
window.GROUP_MEETINGS_V3 = GROUP_MEETINGS_V3;
window.DataServiceV3 = DataServiceV3;


console.log('📊 학생:', STUDENTS_V3.length, '명');
console.log('📊 가능시간:', AVAILABLE_SLOTS_V3.length, '개');
console.log('📊 미팅 신청:', MEETING_REQUESTS_V3.length, '개');
console.log('📊 그룹/직접 미팅:', GROUP_MEETINGS_V3.length, '개');
