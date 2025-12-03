// ===================================
// Mock 데이터 서비스 V4
// ===================================

const DataService = {
    // ===================================
    // 학생 데이터
    // ===================================
    students: [
        // 석사
        {
            studentId: 'S001',
            name: '김철수',
            degree: 'master',
            semester: 4,
            stage: 'proposal',
            statusText: '진행중',
            statusColor: 'yellow',
            weekProgress: '5/16',
            feedbackPending: 1,
            submissionStatus: '계획서 제출 완료 (11.20)'
        },
        {
            studentId: 'S002',
            name: '이영희',
            degree: 'master',
            semester: 6,
            stage: 'final',
            statusText: '보완요청',
            statusColor: 'red',
            weekProgress: '12/16',
            feedbackPending: 0,
            submissionStatus: '본심사 통과 (11.25)'
        },
        {
            studentId: 'S003',
            name: '박민수',
            degree: 'master',
            semester: 5,
            stage: 'complete',
            statusText: '완료',
            statusColor: 'green',
            weekProgress: '16/16',
            feedbackPending: 0,
            submissionStatus: '최종 제출 완료 (11.28)'
        },

        // 박사
        {
            studentId: 'S004',
            name: '최지민',
            degree: 'doctor',
            semester: 8,
            stage: 'preliminary',
            statusText: '진행중',
            statusColor: 'yellow',
            weekProgress: '8/16',
            feedbackPending: 2,
            submissionStatus: '예심 신청 완료 (11.18)'
        },
        {
            studentId: 'S005',
            name: '정수진',
            degree: 'doctor',
            semester: 10,
            stage: 'final',
            statusText: '보완요망',
            statusColor: 'red',
            weekProgress: '14/16',
            feedbackPending: 1,
            submissionStatus: '본심사 대기 (11.22)'
        },
        {
            studentId: 'S006',
            name: '강동현',
            degree: 'doctor',
            semester: 12,
            stage: 'complete',
            statusText: '완료',
            statusColor: 'green',
            weekProgress: '16/16',
            feedbackPending: 0,
            submissionStatus: '학위 취득 (11.30)'
        },

        // 통합
        {
            studentId: 'S007',
            name: '윤서연',
            degree: 'integrated',
            semester: 7,
            stage: 'proposal',
            statusText: '진행중',
            statusColor: 'yellow',
            weekProgress: '6/16',
            feedbackPending: 0,
            submissionStatus: '계획서 작성중'
        },
        {
            studentId: 'S008',
            name: '임태희',
            degree: 'integrated',
            semester: 9,
            stage: 'final',
            statusText: '보완요망',
            statusColor: 'red',
            weekProgress: '13/16',
            feedbackPending: 3,
            submissionStatus: '본심사 준비중'
        },
        {
            studentId: 'S009',
            name: '한지우',
            degree: 'integrated',
            semester: 11,
            stage: 'complete',
            statusText: '완료',
            statusColor: 'green',
            weekProgress: '16/16',
            feedbackPending: 0,
            submissionStatus: '최종 제출 완료 (11.27)'
        },
        {
            studentId: 'S010',
            name: '송민호',
            degree: 'integrated',
            semester: 5,
            stage: 'complete',
            statusText: '완료',
            statusColor: 'green',
            weekProgress: '16/16',
            feedbackPending: 0,
            submissionStatus: '최종 제출 완료 (11.26)'
        },
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
    // 심사 관리 데이터
    // ===================================
    getReviewsByStage(stage) {
        const reviewsData = {
            proposal: {
                pending: [
                    {
                        id: 'R001',
                        studentName: '김철수',
                        degree: 'master',
                        semester: 4,
                        submitDate: '2025.11.15',
                        hopeDate: '2025.11.30'
                    },
                    {
                        id: 'R002',
                        studentName: '윤서연',
                        degree: 'integrated',
                        semester: 7,
                        submitDate: '2025.11.18',
                        hopeDate: '2025.12.05'
                    }
                ],
                completed: [
                    {
                        id: 'R003',
                        studentName: '박민수',
                        degree: 'master',
                        semester: 4,
                        reviewDate: '2025.11.22',
                        result: '통과'
                    }
                ]
            },
            preliminary: {
                pending: [],
                completed: [
                    {
                        id: 'R004',
                        studentName: '최지민',
                        degree: 'doctor',
                        semester: 8,
                        reviewDate: '2025.11.20',
                        result: '통과'
                    }
                ]
            },
            final: {
                pending: [
                    {
                        id: 'R005',
                        studentName: '이영희',
                        degree: 'master',
                        semester: 6,
                        submitDate: '2025.11.20',
                        hopeDate: '2025.12.10'
                    }
                ],
                completed: [
                    {
                        id: 'R006',
                        studentName: '정수진',
                        degree: 'doctor',
                        semester: 10,
                        reviewDate: '2025.11.25',
                        result: '보완요망'
                    },
                    {
                        id: 'R007',
                        studentName: '임태희',
                        degree: 'integrated',
                        semester: 9,
                        reviewDate: '2025.11.23',
                        result: '보완요망'
                    }
                ]
            }
        };

        return reviewsData[stage] || { pending: [], completed: [] };
    },

    // ===================================
    // 미답변 피드백
    // ===================================
    getPendingFeedbacks() {
        return {
            count: 3,
            daysElapsed: 2
        };
    },

    // ===================================
    // 피드백 통계
    // ===================================
    getFeedbackStats() {
        return {
            weeklyProvided: 8,
            averageResponseTime: 1.5
        };
    },

    // ===================================
    // 학사 일정 (대학원 전체)
    // ===================================
    getUniversitySchedule() {
        return [
            {
                title: '예비심사 결과 입력 마감',
                dDay: 3,
                dateRange: '11.25 ~ 11.29',
                urgent: true
            },
            {
                title: '본심사 기간',
                dateRange: '11.25 ~ 12.05',
                ongoing: true
            },
            {
                title: '최종 논문 제출 마감',
                dDay: 15,
                dateRange: '12.10',
                urgent: false
            }
        ];
    },

    // ===================================
    // 승인 대기 미팅
    // ===================================
    getPendingMeetingsCount() {
        return 2;
    },

    // ===================================
    // 예정된 미팅
    // ===================================
    getUpcomingMeetings() {
        return [
            {
                id: 'M001',
                type: 'online',
                dateLabel: '오늘',
                time: '14:00',
                studentName: '김철수',
                degree: 'master',
                semester: 4,
                topic: '논문 진행 점검',
                location: 'Zoom 링크'
            },
            {
                id: 'M002',
                type: 'offline',
                dateLabel: '내일',
                time: '10:00',
                studentName: '이영희',
                degree: 'doctor',
                semester: 8,
                topic: '본심사 보완사항 논의',
                location: '연구실 (R동 501호)'
            }
        ];
    },

    // ===================================
    // 유틸리티 함수
    // ===================================
    getDegreeLabel(degree) {
        const labels = {
            'master': '석사',
            'doctor': '박사',
            'integrated': '통합'
        };
        return labels[degree] || degree;
    },

    getStageLabel(stage) {
        const labels = {
            'proposal': '논문작성계획서',
            'preliminary': '예비심사',
            'final': '본심사',
            'complete': '최종제출'
        };
        return labels[stage] || stage;
    }
};
