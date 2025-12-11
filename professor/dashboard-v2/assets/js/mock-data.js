// ===================================
// Mock 데이터 서비스
// ===================================

const DataService = {
    // ===================================
    // 학생 데이터 (Mock)
    // ===================================
    students: [
        // 석사
        { studentId: 'S001', name: '김철수', degree: 'master', semester: 4, stage: 'proposal', statusText: '보완요망', statusColor: 'red' },
        { studentId: 'S002', name: '이영희', degree: 'master', semester: 6, stage: 'final', statusText: '진행중', statusColor: 'yellow' },
        { studentId: 'S003', name: '박민수', degree: 'master', semester: 5, stage: 'complete', statusText: '완료', statusColor: 'green' },

        // 박사
        { studentId: 'S004', name: '최지민', degree: 'doctor', semester: 8, stage: 'preliminary', statusText: '진행중', statusColor: 'yellow' },
        { studentId: 'S005', name: '정수진', degree: 'doctor', semester: 10, stage: 'final', statusText: '보완요망', statusColor: 'red' },
        { studentId: 'S006', name: '강동현', degree: 'doctor', semester: 12, stage: 'complete', statusText: '완료', statusColor: 'green' },

        // 통합
        { studentId: 'S007', name: '윤서연', degree: 'integrated', semester: 7, stage: 'proposal', statusText: '진행중', statusColor: 'yellow' },
        { studentId: 'S008', name: '임태희', degree: 'integrated', semester: 9, stage: 'final', statusText: '보완요망', statusColor: 'red' },
        { studentId: 'S009', name: '한지우', degree: 'integrated', semester: 11, stage: 'complete', statusText: '완료', statusColor: 'green' },
        { studentId: 'S010', name: '송민호', degree: 'integrated', semester: 5, stage: 'complete', statusText: '완료', statusColor: 'green' },
    ],

    // ===================================
    // 과정별 필터링된 단계별 학생 목록
    // ===================================
    getStudentsByStage(degreeFilter) {
        let filtered = this.students;

        if (degreeFilter !== 'all') {
            filtered = filtered.filter(s => s.degree === degreeFilter);
        }

        return {
            proposal: filtered.filter(s => s.stage === 'proposal'),
            preliminary: filtered.filter(s => s.stage === 'preliminary'),
            final: filtered.filter(s => s.stage === 'final'),
            complete: filtered.filter(s => s.stage === 'complete')
        };
    },

    // ===================================
    // 전체 미심사 건수 (과정 무관)
    // ===================================
    getAllPendingReviews() {
        return {
            proposal: 2,
            preliminary: 0,
            final: 1
        };
    },

    // ===================================
    // 미답변 피드백 (과정 무관)
    // ===================================
    getPendingFeedbacks() {
        return {
            count: 1,
            daysElapsed: 3
        };
    },

    // ===================================
    // 학사 일정
    // ===================================
    getAcademicSchedule() {
        return [
            {
                title: '예비심사 결과 입력 마감',
                dDay: 3,
                urgent: true
            },
            {
                title: '본심사 기간',
                startDate: '11.25',
                endDate: '11.29',
                urgent: false
            },
            {
                title: '최종 논문 제출 마감',
                dDay: 15,
                urgent: false
            }
        ];
    },

    // ===================================
    // 승인 대기 미팅 (과정 무관)
    // ===================================
    getPendingMeetings() {
        return [
            {
                id: 'meet1',
                studentName: '김철수',
                degree: 'doctor',
                date: '11.28 14:00',
                type: 'online'
            },
            {
                id: 'meet2',
                studentName: '박지성',
                degree: 'master',
                date: '11.29 10:00',
                type: 'offline'
            }
        ];
    },

    // ===================================
    // 예정된 미팅 (과정 무관)
    // ===================================
    getUpcomingMeetings() {
        return [
            {
                type: 'online',
                dateLabel: '오늘',
                time: '14:00',
                studentName: '이영희'
            },
            {
                type: 'offline',
                dateLabel: '내일',
                time: '10:00',
                studentName: '최민기'
            }
        ];
    }
};
