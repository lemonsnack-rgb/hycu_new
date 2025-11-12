// ===================================
// 논문지도시스템 교수용 프로토타입 Mock 데이터
// ===================================

const MOCK_DATA = {
    // 교수 정보
    professor: {
        id: 'P001',
        name: '김교수',
        email: 'kim@university.ac.kr',
        department: '경영학과',
        roles: ['advisor', 'reviewer', 'chair'], // advisor: 지도교수, reviewer: 심사위원, chair: 심사위원장
        phone: '02-1234-5678'
    },

    // 알림 데이터
    notifications: [
        {
            id: 1,
            type: 'plan_submitted',
            priority: 'high',
            icon: '📋',
            message: '김철수 학생이 주차별 계획을 제출했습니다',
            timestamp: '2025-11-03 14:30',
            isRead: false,
            actionUrl: 'guidance',
            daysElapsed: 0
        },
        {
            id: 2,
            type: 'meeting_request',
            priority: 'high',
            icon: '📅',
            message: '이영희 학생이 11월 5일 14:00 미팅을 신청했습니다',
            timestamp: '2025-11-03 10:15',
            isRead: false,
            actionUrl: 'meeting',
            daysElapsed: 0
        },
        {
            id: 3,
            type: 'document_submitted',
            priority: 'urgent',
            icon: '📄',
            message: '박민수 학생이 중간논문을 제출했습니다 (표절 검사 통과)',
            timestamp: '2025-11-01 16:20',
            isRead: false,
            actionUrl: 'feedback',
            daysElapsed: 2
        },
        {
            id: 4,
            type: 'review_assigned',
            priority: 'urgent',
            icon: '📝',
            message: '정수진 학생의 최종논문 심사가 배정되었습니다',
            timestamp: '2025-10-31 09:00',
            isRead: false,
            actionUrl: 'review',
            daysElapsed: 3
        },
        {
            id: 5,
            type: 'review_deadline',
            priority: 'urgent',
            icon: '⏰',
            message: '최민지 학생 논문 심사 마감이 3일 남았습니다',
            timestamp: '2025-10-30 08:00',
            isRead: true,
            actionUrl: 'review',
            daysElapsed: 4
        }
    ],

    // 지도학생 목록
    students: [
        {
            id: 'S001',
            name: '김철수',
            studentId: '2023001',
            department: '경영학과',
            degree: 'master',
            stage: 'final',
            email: 'kim@student.ac.kr',
            phone: '010-1234-5678',
            admissionYear: 2023,
            advisor: 'P001', // 하위 호환성을 위해 유지
            advisors: ['P001'] // n:m 관계 지원
        },
        {
            id: 'S002',
            name: '이영희',
            studentId: '2023002',
            department: '경영학과',
            degree: 'master',
            stage: 'mid',
            email: 'lee@student.ac.kr',
            phone: '010-2345-6789',
            admissionYear: 2023,
            advisor: 'P001',
            advisors: ['P001']
        },
        {
            id: 'S003',
            name: '박민수',
            studentId: '2023003',
            department: '경영학과',
            degree: 'master',
            stage: 'mid',
            email: 'park@student.ac.kr',
            phone: '010-3456-7890',
            admissionYear: 2023,
            advisor: 'P001',
            advisors: ['P001']
        },
        {
            id: 'S004',
            name: '정수진',
            studentId: '2022001',
            department: '경영학과',
            degree: 'doctor',
            stage: 'final',
            email: 'jung@student.ac.kr',
            phone: '010-4567-8901',
            admissionYear: 2022,
            advisor: 'P001',
            advisors: ['P001']
        },
        {
            id: 'S005',
            name: '최민지',
            studentId: '2022002',
            department: '경영학과',
            degree: 'master',
            stage: 'plan',
            email: 'choi@student.ac.kr',
            phone: '010-5678-9012',
            admissionYear: 2022,
            advisor: 'P001'
        }
    ],

    // 주차별 계획 데이터
    weeklyPlans: {
        'S001': [ // 김철수
            {
                week: 1,
                topic: '연구 주제 확정',
                content: 'AI를 활용한 소비자 행동 예측 모델 연구 주제 최종 확정',
                method: 'online',
                expectedDate: '2025-03-10',
                professorComment: '주제가 적절합니다. 선행연구 조사를 충실히 해주세요.',
                status: 'completed',
                executionCount: 2
            },
            {
                week: 2,
                topic: '문헌 조사',
                content: '소비자 행동 관련 선행 연구 조사 및 정리',
                method: 'meeting',
                expectedDate: '2025-03-17',
                professorComment: '주요 저널 논문 위주로 조사하세요.',
                status: 'in_progress',
                executionCount: 1
            },
            {
                week: 3,
                topic: '연구 방법론 설계',
                content: '데이터 수집 방법 및 분석 방법 설계',
                method: 'online',
                expectedDate: '2025-03-24',
                professorComment: '',
                status: 'pending',
                executionCount: 0
            },
            {
                week: 4,
                topic: '데이터 수집 계획',
                content: '실험 설계 및 데이터 수집 일정 수립',
                method: 'meeting',
                expectedDate: '2025-03-31',
                professorComment: '',
                status: 'pending',
                executionCount: 0
            }
        ],
        'S002': [ // 이영희
            {
                week: 1,
                topic: '주제 선정',
                content: '블록체인 기반 공급망 관리 시스템',
                method: 'meeting',
                expectedDate: '2025-03-08',
                professorComment: '좋은 주제입니다.',
                status: 'completed',
                executionCount: 1
            },
            {
                week: 2,
                topic: '이론적 배경 연구',
                content: '블록체인 기술 및 공급망 관리 이론 조사',
                method: 'online',
                expectedDate: '2025-03-15',
                professorComment: '최신 논문 위주로 조사하세요.',
                status: 'in_progress',
                executionCount: 1
            }
        ]
    },

    // 논문지도 이력 데이터
    guidanceHistory: {
        'S001': [
            {
                id: 'H001',
                week: 1,
                executionDate: '2025-03-05',
                actualMethod: 'meeting',
                content: '연구 주제에 대해 30분간 토론. AI 모델 선정 방향에 대해 논의. XGBoost와 Random Forest 비교 필요.',
                attachments: [],
                nextPlanDate: '2025-03-12',
                isPublic: true,
                createdAt: '2025-03-05 15:30'
            },
            {
                id: 'H002',
                week: 1,
                executionDate: '2025-03-12',
                actualMethod: 'online',
                content: '이메일로 연구 계획서 초안 검토. 연구 범위를 좀 더 명확히 할 것을 권고.',
                attachments: ['연구계획서_초안_검토.pdf'],
                nextPlanDate: '2025-03-17',
                isPublic: true,
                createdAt: '2025-03-12 10:20'
            },
            {
                id: 'H003',
                week: 2,
                executionDate: '2025-03-17',
                actualMethod: 'zoom',
                content: 'Zoom 미팅으로 문헌 조사 결과 논의. 주요 선행연구 10편 선정 완료.',
                attachments: [],
                nextPlanDate: '2025-03-24',
                isPublic: true,
                createdAt: '2025-03-17 14:00'
            }
        ]
    },

    // 미팅 신청 데이터
    meetingRequests: [
        {
            id: 'MR001',
            studentId: 'S002',
            studentName: '이영희',
            requestedDateTime: '2025-11-05 14:00',
            meetingType: 'zoom',
            duration: 60,
            topic: '중간논문 진행 상황 점검',
            message: '블록체인 부분의 기술적 구현에 대해 질문드리고 싶습니다.',
            status: 'pending',
            requestedAt: '2025-11-03 10:15'
        },
        {
            id: 'MR002',
            studentId: 'S003',
            studentName: '박민수',
            requestedDateTime: '2025-11-06 10:00',
            meetingType: 'offline',
            duration: 45,
            topic: '연구 방법론 상담',
            message: '실험 설계에 대해 조언을 구하고 싶습니다.',
            status: 'pending',
            requestedAt: '2025-11-02 16:30'
        }
    ],

    // 확정 미팅 일정
    scheduledMeetings: [
        {
            id: 'SM001',
            studentId: 'S001',
            studentName: '김철수',
            dateTime: '2025-11-04 15:00',
            meetingType: 'zoom',
            duration: 60,
            topic: '최종논문 피드백',
            zoomLink: 'https://zoom.us/j/1234567890',
            status: 'scheduled'
        }
    ],

    // 지난 미팅 (Zoom 녹화본)
    pastMeetings: [
        {
            id: 'PM001',
            studentId: 'S001',
            studentName: '김철수',
            dateTime: '2025-10-28 14:00',
            topic: '연구 진행 상황 점검',
            duration: 55,
            recordingStatus: 'available',
            recordingUrl: 'https://zoom.us/rec/share/mock-recording-1',
            viewCount: 2
        },
        {
            id: 'PM002',
            studentId: 'S002',
            studentName: '이영희',
            dateTime: '2025-10-25 10:00',
            topic: '문헌 조사 결과 논의',
            duration: 45,
            recordingStatus: 'available',
            recordingUrl: 'https://zoom.us/rec/share/mock-recording-2',
            viewCount: 1
        },
        {
            id: 'PM003',
            studentId: 'S003',
            studentName: '박민수',
            dateTime: '2025-10-20 16:00',
            topic: '중간 발표 준비',
            duration: 60,
            recordingStatus: 'processing',
            recordingUrl: null,
            viewCount: 0
        }
    ],

    // 제출물 목록 (온라인 피드백)
    submissions: [
        {
            id: 'SUB001',
            studentId: 'S001',
            studentName: '김철수',
            title: '최종논문_김철수.pdf',
            stage: 'final',
            submittedAt: '2025-11-02 15:30',
            status: 'pending', // pending, in_progress, completed
            fileSize: 8912345,
            version: 1,
            plagiarismCheck: {
                status: 'completed',
                copyKillerScore: 8,
                gptKillerScore: 12,
                reportUrl: '/mock/plagiarism-report-001.pdf',
                checkedAt: '2025-11-02 15:42'
            }
        },
        {
            id: 'SUB002',
            studentId: 'S002',
            studentName: '이영희',
            title: '중간논문_이영희_v2.pdf',
            stage: 'mid',
            submittedAt: '2025-10-30 10:20',
            status: 'in_progress',
            fileSize: 6234567,
            version: 2,
            plagiarismCheck: {
                status: 'completed',
                copyKillerScore: 12,
                gptKillerScore: 15,
                reportUrl: '/mock/plagiarism-report-002.pdf',
                checkedAt: '2025-10-30 10:35'
            }
        },
        {
            id: 'SUB003',
            studentId: 'S003',
            studentName: '박민수',
            title: '중간논문_박민수.pdf',
            stage: 'mid',
            submittedAt: '2025-11-01 16:20',
            status: 'pending',
            fileSize: 7456789,
            version: 1,
            plagiarismCheck: {
                status: 'completed',
                copyKillerScore: 6,
                gptKillerScore: 10,
                reportUrl: '/mock/plagiarism-report-003.pdf',
                checkedAt: '2025-11-01 16:32'
            }
        },
        {
            id: 'SUB004',
            studentId: 'S005',
            studentName: '최민지',
            title: '연구계획서_최민지.pdf',
            stage: 'plan',
            submittedAt: '2025-10-25 14:00',
            status: 'completed',
            fileSize: 3456789,
            version: 1,
            plagiarismCheck: {
                status: 'completed',
                copyKillerScore: 5,
                gptKillerScore: 8,
                reportUrl: '/mock/plagiarism-report-004.pdf',
                checkedAt: '2025-10-25 14:15'
            }
        }
    ],

    // 피드백 데이터
    feedbacks: {
        'SUB001': {
            overall: '전반적으로 연구 방법론과 결과 분석이 우수합니다. 다만 결론 부분에서 연구의 한계점을 좀 더 명확히 서술할 필요가 있습니다.',
            comments: [
                {
                    id: 'C001',
                    page: 2,
                    position: { x: 100, y: 200 },
                    title: '연구 배경 보완',
                    content: '선행 연구와의 차별점을 좀 더 명확히 기술해주세요.',
                    author: '김교수',
                    createdAt: '2025-11-02 16:00',
                    attachments: [],
                    replies: []
                },
                {
                    id: 'C002',
                    page: 5,
                    position: { x: 150, y: 300 },
                    title: '데이터 출처 명시',
                    content: '사용한 데이터셋의 출처를 참고문헌에 추가해주세요.',
                    author: '김교수',
                    createdAt: '2025-11-02 16:15',
                    attachments: [],
                    replies: [
                        {
                            id: 'R001',
                            content: '네, 수정하겠습니다. 감사합니다!',
                            author: '김철수',
                            createdAt: '2025-11-03 09:20'
                        }
                    ]
                }
            ],
            result: null, // 'pass', 'revision', 'fail'
            resultComment: '',
            submittedAt: null
        }
    },

    // 심사 목록
    reviews: [
        {
            id: 'REV001',
            studentId: 'S004',
            studentName: '정수진',
            studentNumber: '2022001',
            department: '경영학과',
            degree: 'doctor',
            thesisTitle: 'AI 기반 경영 의사결정 시스템 연구',
            thesisType: 'final',
            submittedAt: '2025-10-30 14:00',
            deadline: '2025-11-15',
            myRole: 'reviewer', // reviewer, chair
            myStatus: 'pending', // pending, in_progress, completed
            overallStatus: 'in_progress', // pending, in_progress, completed
            plagiarismCheck: {
                copyKillerScore: 7,
                gptKillerScore: 11,
                reportUrl: '/mock/plagiarism-report-rev001.pdf',
                checkedAt: '2025-10-30 14:20'
            },
            advisorId: 'P002',
            advisorName: '박교수'
        },
        {
            id: 'REV002',
            studentId: 'S005',
            studentName: '최민지',
            studentNumber: '2022002',
            department: '경영학과',
            degree: 'master',
            thesisTitle: '소셜미디어 마케팅 효과 분석',
            thesisType: 'mid',
            submittedAt: '2025-10-28 10:00',
            deadline: '2025-11-10',
            myRole: 'chair',
            myStatus: 'pending',
            overallStatus: 'in_progress',
            plagiarismCheck: {
                copyKillerScore: 9,
                gptKillerScore: 13,
                reportUrl: '/mock/plagiarism-report-rev002.pdf',
                checkedAt: '2025-10-28 10:15'
            },
            advisorId: 'P003',
            advisorName: '이교수'
        }
    ],

    // 심사 평가 기준 (학과별)
    evaluationCriteria: {
        'business_master_mid': [
            { id: 1, name: '연구 주제의 창의성', maxScore: 100, weight: 0.2 },
            { id: 2, name: '연구 방법론의 적절성', maxScore: 100, weight: 0.25 },
            { id: 3, name: '문헌 고찰의 충실성', maxScore: 100, weight: 0.2 },
            { id: 4, name: '연구 결과의 타당성', maxScore: 100, weight: 0.25 },
            { id: 5, name: '논문 작성의 완성도', maxScore: 100, weight: 0.1 }
        ],
        'business_master_final': [
            { id: 1, name: '연구 주제의 창의성 및 기여도', maxScore: 100, weight: 0.2 },
            { id: 2, name: '연구 방법론의 적절성 및 엄밀성', maxScore: 100, weight: 0.25 },
            { id: 3, name: '문헌 고찰의 충실성', maxScore: 100, weight: 0.15 },
            { id: 4, name: '연구 결과의 타당성 및 신뢰성', maxScore: 100, weight: 0.25 },
            { id: 5, name: '논문 작성의 완성도', maxScore: 100, weight: 0.15 }
        ],
        'business_doctor_final': [
            { id: 1, name: '연구 주제의 독창성 및 학술적 기여도', maxScore: 100, weight: 0.25 },
            { id: 2, name: '연구 방법론의 적절성 및 엄밀성', maxScore: 100, weight: 0.25 },
            { id: 3, name: '이론적 배경 및 문헌 고찰', maxScore: 100, weight: 0.15 },
            { id: 4, name: '연구 결과의 타당성 및 신뢰성', maxScore: 100, weight: 0.25 },
            { id: 5, name: '논문 작성의 완성도 및 표현력', maxScore: 100, weight: 0.1 }
        ]
    },

    // 심사 결과 데이터
    reviewResults: {
        'REV002': {
            reviewers: [
                {
                    professorId: 'P003',
                    professorName: '이교수',
                    role: 'reviewer',
                    status: 'completed',
                    scores: [
                        { criteriaId: 1, score: 90 },
                        { criteriaId: 2, score: 85 },
                        { criteriaId: 3, score: 88 },
                        { criteriaId: 4, score: 82 },
                        { criteriaId: 5, score: 86 }
                    ],
                    totalScore: 431,
                    maxScore: 500,
                    percentage: 86.2,
                    comment: '전반적으로 연구 설계가 우수하나, 데이터 수집 방법론 부분에서 보완이 필요합니다.',
                    reportFile: 'review_report_lee.pdf',
                    submittedAt: '2025-11-02 15:00'
                },
                {
                    professorId: 'P004',
                    professorName: '최교수',
                    role: 'reviewer',
                    status: 'completed',
                    scores: [
                        { criteriaId: 1, score: 88 },
                        { criteriaId: 2, score: 90 },
                        { criteriaId: 3, score: 85 },
                        { criteriaId: 4, score: 87 },
                        { criteriaId: 5, score: 84 }
                    ],
                    totalScore: 434,
                    maxScore: 500,
                    percentage: 86.8,
                    comment: '소셜미디어 마케팅 분석 방법이 체계적이며, 실무적 시사점이 명확합니다.',
                    reportFile: 'review_report_choi.pdf',
                    submittedAt: '2025-11-03 10:30'
                },
                {
                    professorId: 'P001',
                    professorName: '김교수',
                    role: 'chair',
                    status: 'pending',
                    scores: null,
                    totalScore: null,
                    maxScore: null,
                    percentage: null,
                    comment: null,
                    reportFile: null,
                    submittedAt: null
                }
            ],
            finalDecision: null, // 'pass', 'revision', 'fail'
            chairComment: null,
            decidedAt: null
        }
    },

    // 대시보드 통계
    dashboardStats: {
        totalStudents: 12,
        activeStudents: 8,
        pendingTasks: 5,
        stageDistribution: {
            plan: 2,
            mid: 5,
            final: 5
        }
    },

    // 퀵마크 (자주 쓰는 피드백 문구)
    quickMarks: [
        '연구 주제가 명확하고 적절합니다.',
        '문헌 조사를 좀 더 충실히 해주세요.',
        '연구 방법론에 대한 설명이 부족합니다.',
        '데이터 분석 결과를 표나 그림으로 정리해주세요.',
        '참고문헌 형식을 통일해주세요.',
        '결론 부분에 연구의 한계점을 추가해주세요.',
        '문장이 너무 길어 읽기 어렵습니다. 간결하게 수정해주세요.',
        '오타를 수정해주세요.',
        '이 부분은 잘 작성되었습니다.',
        '앞의 내용과 중복되는 부분입니다.'
    ],

    // 자료실 게시판 데이터
    resourceBoards: [
        {
            id: 1,
            title: '논문 작성 가이드라인',
            content: '<p>논문 작성시 다음 사항을 참고하시기 바랍니다.</p><ul><li>서론에서 연구 배경과 목적을 명확히 기술</li><li>선행연구 검토를 충실히 수행</li><li>연구 방법론을 구체적으로 설명</li></ul>',
            authorId: 'P001',
            authorName: '김교수',
            authorRole: 'professor',
            createdAt: '2025-11-05T10:30:00',
            updatedAt: '2025-11-05T10:30:00',
            files: [
                { id: 'F001', name: '논문작성가이드.docx', size: 856000, url: '#' },
                { id: 'F002', name: '참고논문.pdf', size: 3400000, url: '#' }
            ],
            viewerType: 'masters', // 'all', 'masters', 'phd', 'specific'
            viewers: [], // Array of student IDs (only used when viewerType is 'specific')
            views: 28,
            comments: [
                {
                    id: 'C001',
                    authorId: 'S001',
                    authorName: '김철수',
                    authorRole: 'student',
                    content: '감사합니다! 많은 도움이 되었습니다.',
                    createdAt: '2025-11-06T14:20:00'
                }
            ]
        },
        {
            id: 2,
            title: '이번 주 미팅 일정 안내',
            content: '<p>11월 8일 (금) 오후 2시에 줌 미팅을 진행합니다.</p><p>각자 진행상황을 5분 내외로 발표 준비 부탁드립니다.</p>',
            authorId: 'P001',
            authorName: '김교수',
            authorRole: 'professor',
            createdAt: '2025-11-03T09:15:00',
            updatedAt: '2025-11-03T09:15:00',
            files: [
                { id: 'F003', name: '미팅자료.pdf', size: 1200000, url: '#' }
            ],
            viewerType: 'all',
            viewers: [],
            views: 15,
            comments: []
        },
        {
            id: 3,
            title: '중간 보고서 진행 상황',
            content: '<p>중간 보고서 작성을 완료하였습니다.</p><p>검토 부탁드립니다.</p>',
            authorId: 'S001',
            authorName: '김철수',
            authorRole: 'student',
            createdAt: '2025-11-07T16:45:00',
            updatedAt: '2025-11-07T16:45:00',
            files: [
                { id: 'F004', name: '중간보고서_김철수.docx', size: 2100000, url: '#' }
            ],
            viewerType: 'specific',
            viewers: ['P001'],
            views: 3,
            comments: [
                {
                    id: 'C002',
                    authorId: 'P001',
                    authorName: '김교수',
                    authorRole: 'professor',
                    content: '전체적으로 잘 작성하셨습니다. 3장 연구방법론 부분을 좀 더 보완해주세요.',
                    createdAt: '2025-11-08T10:30:00'
                }
            ]
        }
    ]
};

// 로컬 스토리지 시뮬레이션 (페이지 새로고침 전까지 유지)
let localData = JSON.parse(JSON.stringify(MOCK_DATA)); // Deep copy

// 데이터 접근 함수들
const DataService = {
    // 교수 정보
    getProfessor() {
        return localData.professor;
    },

    // 알림
    getNotifications() {
        return localData.notifications;
    },

    markNotificationAsRead(notificationId) {
        const notification = localData.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
        }
        return notification;
    },

    getUnreadNotificationCount() {
        return localData.notifications.filter(n => !n.isRead).length;
    },

    // 지도학생
    getStudents() {
        return localData.students;
    },

    getStudent(studentId) {
        return localData.students.find(s => s.id === studentId);
    },

    // 주차별 계획
    getWeeklyPlans(studentId) {
        return localData.weeklyPlans[studentId] || [];
    },

    updateWeeklyPlan(studentId, week, field, value) {
        const plans = localData.weeklyPlans[studentId];
        if (plans) {
            const plan = plans.find(p => p.week === week);
            if (plan) {
                plan[field] = value;
            }
        }
    },

    confirmWeeklyPlans(studentId) {
        const plans = localData.weeklyPlans[studentId];
        if (plans) {
            // 실제로는 confirmed 상태 추가 등의 처리
            console.log('Plans confirmed for student:', studentId);
        }
    },

    // 논문지도 이력
    getGuidanceHistory(studentId) {
        return localData.guidanceHistory[studentId] || [];
    },

    addGuidanceHistory(studentId, historyData) {
        if (!localData.guidanceHistory[studentId]) {
            localData.guidanceHistory[studentId] = [];
        }
        const newHistory = {
            id: 'H' + Date.now(),
            ...historyData,
            createdAt: new Date().toISOString()
        };
        localData.guidanceHistory[studentId].push(newHistory);
        
        // 실행 횟수 업데이트
        const plans = localData.weeklyPlans[studentId];
        if (plans) {
            const plan = plans.find(p => p.week === historyData.week);
            if (plan) {
                plan.executionCount = (plan.executionCount || 0) + 1;
                if (plan.executionCount === 1) {
                    plan.status = 'in_progress';
                }
            }
        }
        
        return newHistory;
    },

    // 미팅
    getMeetingRequests() {
        return localData.meetingRequests;
    },

    getScheduledMeetings() {
        return localData.scheduledMeetings;
    },

    getPastMeetings() {
        return localData.pastMeetings;
    },

    acceptMeetingRequest(requestId) {
        const request = localData.meetingRequests.find(r => r.id === requestId);
        if (request) {
            request.status = 'accepted';
            
            // 확정 미팅으로 추가
            const newMeeting = {
                id: 'SM' + Date.now(),
                studentId: request.studentId,
                studentName: request.studentName,
                dateTime: request.requestedDateTime,
                meetingType: request.meetingType,
                duration: request.duration,
                topic: request.topic,
                zoomLink: request.meetingType === 'zoom' ? 'https://zoom.us/j/' + Math.random().toString().slice(2, 12) : null,
                status: 'scheduled'
            };
            localData.scheduledMeetings.push(newMeeting);
            
            return newMeeting;
        }
        return null;
    },

    rejectMeetingRequest(requestId, reason) {
        const request = localData.meetingRequests.find(r => r.id === requestId);
        if (request) {
            request.status = 'rejected';
            request.rejectionReason = reason;
        }
        return request;
    },

    // 제출물
    getSubmissions() {
        return localData.submissions;
    },

    getSubmission(submissionId) {
        return localData.submissions.find(s => s.id === submissionId);
    },

    // 피드백
    getFeedback(submissionId) {
        return localData.feedbacks[submissionId];
    },

    saveFeedback(submissionId, feedbackData) {
        localData.feedbacks[submissionId] = feedbackData;
    },

    addComment(submissionId, commentData) {
        if (!localData.feedbacks[submissionId]) {
            localData.feedbacks[submissionId] = {
                overall: '',
                comments: [],
                result: null,
                resultComment: '',
                submittedAt: null
            };
        }
        
        const newComment = {
            id: 'C' + Date.now(),
            ...commentData,
            author: localData.professor.name,
            createdAt: new Date().toISOString(),
            replies: []
        };
        
        localData.feedbacks[submissionId].comments.push(newComment);
        return newComment;
    },

    submitFeedbackResult(submissionId, result, resultComment) {
        if (localData.feedbacks[submissionId]) {
            localData.feedbacks[submissionId].result = result;
            localData.feedbacks[submissionId].resultComment = resultComment;
            localData.feedbacks[submissionId].submittedAt = new Date().toISOString();
            
            // 제출물 상태 업데이트
            const submission = localData.submissions.find(s => s.id === submissionId);
            if (submission) {
                submission.status = 'completed';
            }
        }
    },

    // 심사
    getReviews() {
        return localData.reviews;
    },

    getReview(reviewId) {
        return localData.reviews.find(r => r.id === reviewId);
    },

    getEvaluationCriteria(degree, type) {
        const key = `business_${degree}_${type}`;
        return localData.evaluationCriteria[key] || [];
    },

    getReviewResults(reviewId) {
        return localData.reviewResults[reviewId];
    },

    saveReviewEvaluation(reviewId, scores, comment, reportFile) {
        if (!localData.reviewResults[reviewId]) {
            localData.reviewResults[reviewId] = {
                reviewers: [],
                finalDecision: null,
                chairComment: null,
                decidedAt: null
            };
        }
        
        const professorId = localData.professor.id;
        let reviewer = localData.reviewResults[reviewId].reviewers.find(r => r.professorId === professorId);
        
        if (!reviewer) {
            reviewer = {
                professorId: professorId,
                professorName: localData.professor.name,
                role: 'reviewer',
                status: 'pending'
            };
            localData.reviewResults[reviewId].reviewers.push(reviewer);
        }
        
        reviewer.scores = scores;
        reviewer.totalScore = scores.reduce((sum, s) => sum + s.score, 0);
        reviewer.comment = comment;
        reviewer.reportFile = reportFile;
        reviewer.status = 'completed';
        reviewer.submittedAt = new Date().toISOString();
        
        // 심사 목록에서 상태 업데이트
        const review = localData.reviews.find(r => r.id === reviewId);
        if (review) {
            review.myStatus = 'completed';
        }
    },

    submitFinalDecision(reviewId, decision, chairComment) {
        if (localData.reviewResults[reviewId]) {
            localData.reviewResults[reviewId].finalDecision = decision;
            localData.reviewResults[reviewId].chairComment = chairComment;
            localData.reviewResults[reviewId].decidedAt = new Date().toISOString();
            
            // 심사 목록에서 상태 업데이트
            const review = localData.reviews.find(r => r.id === reviewId);
            if (review) {
                review.overallStatus = 'completed';
            }
        }
    },

    // 대시보드
    getDashboardStats() {
        return localData.dashboardStats;
    },

    // 퀵마크
    getQuickMarks() {
        return localData.quickMarks;
    },

    // 자료실 게시판
    getResourceBoards(userRole, userId) {
        // 권한에 따라 필터링
        return localData.resourceBoards.filter(post => {
            // 작성자 본인이면 항상 볼 수 있음
            if (post.authorId === userId) return true;

            // 교수인 경우: 자신의 학생들이 작성한 글도 볼 수 있음
            if (userRole === 'professor') {
                const student = localData.students.find(s => s.id === post.authorId);
                if (student) {
                    // n:m 관계 지원: advisors 배열 확인
                    const studentAdvisors = student.advisors || [student.advisor];
                    if (studentAdvisors.includes(userId)) return true;
                }

                // 자신이 작성한 글의 열람권한 확인
                if (post.authorRole === 'professor' && post.authorId === userId) return true;
            }

            // 학생인 경우: 지도교수가 작성한 글 중 자신이 볼 수 있는 것만
            if (userRole === 'student') {
                const student = localData.students.find(s => s.id === userId);
                if (!student) return false;

                const studentAdvisors = student.advisors || [student.advisor];

                // 지도교수가 작성한 글인지 확인
                if (post.authorRole === 'professor' && studentAdvisors.includes(post.authorId)) {
                    // 열람 권한 체크
                    if (post.viewerType === 'all') return true;
                    if (post.viewerType === 'masters' && student.degree === 'master') return true;
                    if (post.viewerType === 'phd' && student.degree === 'phd') return true;
                    if (post.viewerType === 'specific' && post.viewers.includes(userId)) return true;
                }

                // 같은 지도교수를 공유하는 다른 학생이 작성한 글도 볼 수 있음
                const postAuthorStudent = localData.students.find(s => s.id === post.authorId);
                if (postAuthorStudent) {
                    const postAuthorAdvisors = postAuthorStudent.advisors || [postAuthorStudent.advisor];
                    // 공통 지도교수가 있는지 확인
                    const hasCommonAdvisor = postAuthorAdvisors.some(advisor => studentAdvisors.includes(advisor));
                    if (hasCommonAdvisor) {
                        // 해당 학생 글의 열람 권한 확인 (교수들에게 공개)
                        const postViewers = post.viewers || [];
                        if (postAuthorAdvisors.some(advisor => postViewers.includes(advisor))) {
                            return true;
                        }
                    }
                }
            }

            return false;
        });
    },

    getResourceBoard(postId) {
        return localData.resourceBoards.find(p => p.id === postId);
    },

    createResourceBoard(postData) {
        const newPost = {
            id: localData.resourceBoards.length + 1,
            ...postData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            comments: []
        };
        localData.resourceBoards.unshift(newPost);
        return newPost;
    },

    updateResourceBoard(postId, postData) {
        const post = localData.resourceBoards.find(p => p.id === postId);
        if (post) {
            Object.assign(post, postData, {
                updatedAt: new Date().toISOString()
            });
        }
        return post;
    },

    deleteResourceBoard(postId) {
        const index = localData.resourceBoards.findIndex(p => p.id === postId);
        if (index !== -1) {
            localData.resourceBoards.splice(index, 1);
            return true;
        }
        return false;
    },

    addResourceBoardComment(postId, commentData) {
        const post = localData.resourceBoards.find(p => p.id === postId);
        if (post) {
            const newComment = {
                id: `C${Date.now()}`,
                ...commentData,
                createdAt: new Date().toISOString()
            };
            post.comments.push(newComment);
            return newComment;
        }
        return null;
    },

    deleteResourceBoardComment(postId, commentId) {
        const post = localData.resourceBoards.find(p => p.id === postId);
        if (post) {
            const index = post.comments.findIndex(c => c.id === commentId);
            if (index !== -1) {
                post.comments.splice(index, 1);
                return true;
            }
        }
        return false;
    },

    incrementResourceBoardViews(postId) {
        const post = localData.resourceBoards.find(p => p.id === postId);
        if (post) {
            post.views++;
        }
    }
};

// 전역으로 export
window.MOCK_DATA = MOCK_DATA;
window.DataService = DataService;

// ========== 학술지 심사 데이터 ==========
const journalReviews = [
    {
        id: 1,
        journalName: '한국교육공학회지',
        paperTitle: '인공지능 기반 맞춤형 학습 시스템의 효과성 연구',
        studentName: '김연구',
        studentId: '2023001',
        major: '교육공학과',
        degree: '박사',
        advisor: '홍길동',
        submissionDate: '2025-10-15',
        dueDate: '2025-11-30',
        status: '심사중',
        progress: 50,
        pdfUrl: '/uploads/papers/ai-learning-system.pdf',
        myRole: 'chair', // 'chair' 또는 'member'
        reviewers: [
            {
                professorId: 'PROF001',
                professorName: '김교수',
                department: '교육공학과',
                role: '주심',
                status: '완료',
                score: 85,
                comment: '연구 주제가 독창적이며 방법론이 탄탄합니다.'
            },
            {
                professorId: 'PROF002',
                professorName: '이교수',
                department: '컴퓨터공학과',
                role: '부심',
                status: '진행중',
                score: null,
                comment: null
            },
            {
                professorId: 'PROF003',
                professorName: '박교수',
                department: '교육학과',
                role: '부심',
                status: '완료',
                score: 82,
                comment: '실증적 분석이 우수하나 일반화에 주의가 필요합니다.'
            }
        ],
        rubric: {
            items: [
                { id: 1, name: '연구 주제의 독창성', maxScore: 20 },
                { id: 2, name: '연구 방법의 적절성', maxScore: 20 },
                { id: 3, name: '연구 결과의 타당성', maxScore: 20 },
                { id: 4, name: '논문 구성의 체계성', maxScore: 20 },
                { id: 5, name: '학문적 기여도', maxScore: 20 }
            ]
        },
        evaluation: null
    },
    {
        id: 2,
        journalName: '교육정보미디어연구',
        paperTitle: '메타버스 환경에서의 협력학습 효과 분석',
        studentName: '이논문',
        studentId: '2023002',
        major: '교육공학과',
        degree: '석사',
        advisor: '최교수',
        submissionDate: '2025-09-20',
        dueDate: '2025-11-15',
        status: '심사완료',
        progress: 100,
        decision: '수정후게재',
        pdfUrl: '/uploads/papers/metaverse-learning.pdf',
        myRole: 'member',
        reviewers: [
            {
                professorId: 'PROF004',
                professorName: '정교수',
                department: '교육공학과',
                role: '주심',
                status: '완료',
                score: 88,
                comment: '메타버스 환경에서의 협력학습을 잘 분석한 연구입니다.'
            },
            {
                professorId: 'PROF005',
                professorName: '강교수',
                department: '교육학과',
                role: '부심',
                status: '완료',
                score: 90,
                comment: '교육적 시사점이 명확하게 제시되어 있습니다.'
            }
        ],
        rubric: {
            items: [
                { id: 1, name: '연구 주제의 독창성', maxScore: 20 },
                { id: 2, name: '연구 방법의 적절성', maxScore: 20 },
                { id: 3, name: '연구 결과의 타당성', maxScore: 20 },
                { id: 4, name: '논문 구성의 체계성', maxScore: 20 },
                { id: 5, name: '학문적 기여도', maxScore: 20 }
            ]
        },
        evaluation: {
            scores: { 1: 18, 2: 17, 3: 18, 4: 19, 5: 17 },
            comment: '메타버스 환경에서의 협력학습 효과를 실증적으로 분석한 의미 있는 연구입니다. 다만 표본 크기가 다소 제한적이어서 일반화에 주의가 필요합니다.',
            submittedAt: '2025-10-05'
        }
    },
    {
        id: 3,
        journalName: 'Computers & Education',
        paperTitle: 'Adaptive Learning Systems Using Machine Learning Algorithms',
        studentName: '박연구',
        studentId: '2022005',
        major: '컴퓨터공학과',
        degree: '박사',
        advisor: '송교수',
        submissionDate: '2025-10-01',
        dueDate: '2025-12-15',
        status: '심사대기',
        progress: 0,
        pdfUrl: '/uploads/papers/adaptive-learning-ml.pdf',
        myRole: 'member',
        reviewers: [
            {
                professorId: 'PROF006',
                professorName: '윤교수',
                department: '컴퓨터공학과',
                role: '주심',
                status: '대기',
                score: null,
                comment: null
            },
            {
                professorId: 'PROF007',
                professorName: '서교수',
                department: '인공지능학과',
                role: '부심',
                status: '대기',
                score: null,
                comment: null
            }
        ],
        rubric: {
            items: [
                { id: 1, name: '연구 주제의 독창성', maxScore: 20 },
                { id: 2, name: '연구 방법의 적절성', maxScore: 20 },
                { id: 3, name: '연구 결과의 타당성', maxScore: 20 },
                { id: 4, name: '논문 구성의 체계성', maxScore: 20 },
                { id: 5, name: '학문적 기여도', maxScore: 20 }
            ]
        },
        evaluation: null
    }
];

function getJournalReviews() {
    return journalReviews;
}

function updateJournalEvaluation(journalId, scores, comment) {
    const journal = journalReviews.find(j => j.id === journalId);
    if (journal) {
        journal.evaluation = {
            scores: scores,
            comment: comment,
            submittedAt: new Date().toISOString().split('T')[0]
        };
        journal.status = '심사완료';
        journal.progress = 100;
        return true;
    }
    return false;
}

window.getJournalReviews = getJournalReviews;
window.updateJournalEvaluation = updateJournalEvaluation;

console.log('✅ 학술지 심사 데이터 로드 완료');
