/**
 * 학생용 실시간 지도 예약 - 데이터 서비스
 * Version: 20260108001
 */

const StudentMeetingDataService = {
    /**
     * 현재 로그인한 학생 정보 (임시)
     */
    getCurrentStudent() {
        // 실제로는 세션/토큰에서 가져옴
        return {
            studentNumber: '2023001',
            studentName: '홍길동',
            department: '컴퓨터공학',
            degreeType: '석사',
            enrollmentStatus: '재학',
            academicYear: '2025',
            semester: '1',
            collegeType: '일반대학원',
            division: '일반대학원',
            undergradMajor: '컴퓨터공학부',
            advisorName: '김교수'
        };
    },

    /**
     * 지도가능 시간 목록 가져오기 (학생용)
     * - 미래 날짜만
     * - 예약 가능한 슬롯만 (이미 신청된 것 제외)
     */
    getAvailableSlots() {
        if (typeof AVAILABLE_SLOTS_V3 === 'undefined') {
            console.warn('AVAILABLE_SLOTS_V3가 로드되지 않았습니다.');
            return [];
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 미래 날짜 필터링
        const futureSlots = AVAILABLE_SLOTS_V3.filter(slot => {
            const slotDate = new Date(slot.date);
            slotDate.setHours(0, 0, 0, 0);
            return slotDate >= today;
        });

        // 이미 신청된 슬롯 ID 찾기
        const bookedSlotIds = new Set();
        if (typeof MEETING_REQUESTS_V3 !== 'undefined') {
            MEETING_REQUESTS_V3.forEach(meeting => {
                if (meeting.slotId && meeting.status !== 'cancelled' && meeting.status !== 'rejected') {
                    bookedSlotIds.add(meeting.slotId);
                }
            });
        }

        // 예약 가능한 슬롯만 반환
        const availableSlots = futureSlots.filter(slot => !bookedSlotIds.has(slot.id));

        // 날짜/시간 오름차순 정렬
        availableSlots.sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            return a.time.localeCompare(b.time);
        });

        return availableSlots;
    },

    /**
     * 내 신청 내역 가져오기
     */
    getMyApplications() {
        if (typeof MEETING_REQUESTS_V3 === 'undefined') {
            console.warn('MEETING_REQUESTS_V3가 로드되지 않았습니다.');
            return [];
        }

        const currentStudent = this.getCurrentStudent();

        // 본인의 신청만 필터링
        const myApplications = MEETING_REQUESTS_V3.filter(meeting =>
            meeting.studentNumber === currentStudent.studentNumber
        );

        // 최신순 정렬 (날짜 역순)
        myApplications.sort((a, b) => {
            const dateA = a.selectedDate || a.date;
            const dateB = b.selectedDate || b.date;
            return dateB.localeCompare(dateA);
        });

        return myApplications;
    },

    /**
     * 신청하기
     */
    applyForSlot(slotId, memo = '') {
        if (typeof DataServiceV3 === 'undefined' || typeof AVAILABLE_SLOTS_V3 === 'undefined') {
            console.error('DataServiceV3 또는 AVAILABLE_SLOTS_V3가 로드되지 않았습니다.');
            return null;
        }

        const slot = AVAILABLE_SLOTS_V3.find(s => s.id === slotId);
        if (!slot) {
            console.error('해당 슬롯을 찾을 수 없습니다.');
            return null;
        }

        const currentStudent = this.getCurrentStudent();

        // 신청 데이터 생성
        const applicationData = {
            slotId: slotId,
            studentNumber: currentStudent.studentNumber,
            studentName: currentStudent.studentName,
            department: currentStudent.department,
            degreeType: currentStudent.degreeType,
            enrollmentStatus: currentStudent.enrollmentStatus,
            academicYear: currentStudent.academicYear,
            semester: currentStudent.semester,
            collegeType: currentStudent.collegeType,
            division: currentStudent.division,
            undergradMajor: currentStudent.undergradMajor,
            advisorName: currentStudent.advisorName,
            selectedDate: slot.date,
            selectedTime: slot.time,
            duration: slot.duration,
            meetingType: slot.meetingType,
            topic: memo || '지도 예약 신청',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // MEETING_REQUESTS_V3에 추가
        const meetingId = 'MTG' + Date.now();
        const newMeeting = {
            id: meetingId,
            type: 'individual',
            ...applicationData
        };

        MEETING_REQUESTS_V3.push(newMeeting);

        return newMeeting;
    },

    /**
     * 신청 취소
     */
    cancelApplication(meetingId) {
        if (typeof DataServiceV3 === 'undefined') {
            console.error('DataServiceV3가 로드되지 않았습니다.');
            return false;
        }

        return DataServiceV3.cancelMeeting(meetingId, '학생이 취소함');
    },

    /**
     * 신청 상세 조회
     */
    getApplicationDetail(meetingId) {
        if (typeof MEETING_REQUESTS_V3 === 'undefined') {
            return null;
        }

        return MEETING_REQUESTS_V3.find(m => m.id === meetingId);
    }
};

// 전역 export
window.StudentMeetingDataService = StudentMeetingDataService;

console.log('student-meeting-data.js loaded');
