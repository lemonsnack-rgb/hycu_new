// ==================== Mock 데이터 ====================

const StudentData = {
    // 학생 정보
    student: {
        id: '2023012345',
        name: '홍길동',
        program: '석사과정',
        year: 2,
        major: '경영학과',
        advisor: '김교수',
        email: 'hong@hycu.ac.kr',
        enrollmentDate: '2023-03-01'
    },
    
    // 졸업 요건 체크리스트
    graduationRequirements: [
        {
            id: 1,
            name: '학점 이수',
            type: 'credits',
            required: 36,
            current: 30,
            completed: false,
            status: '진행중',
            details: '30/36 학점 (83% 완료)',
            icon: '🔄'
        },
        {
            id: 2,
            name: '연구계획서 심사',
            type: 'review',
            completed: true,
            status: '완료',
            score: 85,
            approvalDate: '2025-09-28',
            details: '승인 (85점)',
            icon: '✓'
        },
        {
            id: 3,
            name: '중간논문 심사',
            type: 'review',
            completed: false,
            status: '심사중',
            progress: 66,
            details: '심사 진행중 (66%)',
            icon: '🔄'
        },
        {
            id: 4,
            name: '최종논문 심사',
            type: 'review',
            completed: false,
            status: '미진행',
            details: '미진행',
            icon: '☐'
        },
        {
            id: 5,
            name: '학술활동',
            type: 'activity',
            required: 2,
            current: 1,
            completed: false,
            status: '진행중',
            details: '1/2 완료',
            icon: '🔄'
        },
        {
            id: 6,
            name: '논문 투고',
            type: 'publication',
            completed: false,
            status: '미완료',
            details: '미완료',
            icon: '☐'
        }
    ],
    
    // 알림
    notifications: [
        {
            id: 1,
            title: '중간논문 심사 진행중',
            message: '심사위원 2/3 완료. 박교수님 심사 대기중입니다.',
            createdAt: '2025-11-03T09:00:00',
            read: false,
            type: 'review'
        },
        {
            id: 2,
            title: '논문제목 변경 승인',
            message: '11/15 신청한 논문제목 변경이 승인되었습니다.',
            createdAt: '2025-11-02T14:30:00',
            read: false,
            type: 'title'
        },
        {
            id: 3,
            title: '미팅 일정 알림',
            message: '11/07 10:00 연구방법론 논의 미팅이 예정되어 있습니다.',
            createdAt: '2025-11-01T16:00:00',
            read: false,
            type: 'meeting'
        }
    ],
    
    // 미팅 일정
    meetings: [
        {
            id: 1,
            title: '연구방법론 논의',
            date: '2025-11-07T10:00:00',
            endDate: '2025-11-07T11:00:00',
            advisor: '김교수',
            location: 'Zoom',
            zoomLink: 'https://zoom.us/j/123456789',
            status: '승인됨',
            agenda: '• 연구방법론 선택 논의\n• 설문지 설계 검토\n• 데이터 수집 계획 수립',
            notes: '설문지 초안을 준비해 가겠습니다',
            attachments: ['survey_draft_v1.pdf'],
            applicationDate: '2025-11-01',
            approvalDate: '2025-11-02'
        },
        {
            id: 2,
            title: '중간발표 준비',
            date: '2025-11-10T14:00:00',
            endDate: '2025-11-10T15:30:00',
            advisor: '김교수',
            location: 'Zoom',
            zoomLink: 'https://zoom.us/j/987654321',
            status: '승인됨',
            agenda: '• 발표 자료 검토\n• 발표 연습\n• 질의응답 준비',
            applicationDate: '2025-11-02',
            approvalDate: '2025-11-03'
        },
        {
            id: 3,
            title: '데이터 분석 논의',
            date: '2025-11-15T16:00:00',
            endDate: '2025-11-15T17:00:00',
            advisor: '김교수',
            location: 'Zoom',
            zoomLink: 'https://zoom.us/j/456789123',
            status: '대기중',
            agenda: '• 데이터 분석 방법 논의\n• 통계 결과 해석',
            applicationDate: '2025-11-03'
        }
    ],
    
    // 피드백 문서
    feedbacks: [
        {
            id: 1,
            title: '논문 초안',
            stage: '최종논문 준비',
            version: 'v3',
            isLatest: true,
            uploadDate: '2025-11-01T14:30:00',
            file: 'thesis_draft_v3.pdf',
            fileSize: '2.5 MB',
            pageCount: 45,
            feedbackCount: 5,
            unreadCount: 2,
            status: '피드백 완료',
            description: '3장 연구방법 추가 및 전체 구조 수정',
            comments: [
                {
                    id: 1,
                    page: 3,
                    author: '김교수',
                    authorRole: 'professor',
                    content: '연구 방법론 부분에서 표본 크기 산정 근거를 더 명확히 제시해주세요.',
                    createdAt: '2025-11-02T09:30:00',
                    read: false,
                    replies: [
                        {
                            id: 11,
                            author: '홍길동',
                            authorRole: 'student',
                            content: '네, 교수님. G*Power로 표본 크기를 재계산하여 추가하겠습니다.',
                            createdAt: '2025-11-02T14:20:00'
                        }
                    ]
                },
                {
                    id: 2,
                    page: 12,
                    author: '김교수',
                    authorRole: 'professor',
                    content: '이론적 배경이 잘 정리되었습니다. 선행연구 간 비교 분석이 명확합니다.',
                    createdAt: '2025-11-02T10:15:00',
                    read: true
                }
            ],
            versions: [
                { version: 'v3', date: '2025-11-01T14:30:00', description: '3장 추가 및 전체 수정' },
                { version: 'v2', date: '2025-10-25T16:20:00', description: '2장 이론적 배경 보강' },
                { version: 'v1', date: '2025-10-15T10:00:00', description: '초안 작성' }
            ]
        },
        {
            id: 2,
            title: '2장: 이론적 배경',
            stage: '최종논문 준비',
            version: 'v2',
            isLatest: true,
            uploadDate: '2025-10-28T16:20:00',
            file: 'chapter2_v2.pdf',
            fileSize: '1.2 MB',
            pageCount: 18,
            feedbackCount: 3,
            unreadCount: 0,
            status: '검토중',
            description: '선행연구 추가 및 이론 체계 재구성',
            comments: [],
            versions: [
                { version: 'v2', date: '2025-10-28T16:20:00' },
                { version: 'v1', date: '2025-10-20T11:00:00' }
            ]
        },
        {
            id: 3,
            title: '연구계획서',
            stage: '연구계획서 심사',
            version: 'v1',
            isLatest: true,
            uploadDate: '2025-09-10T09:30:00',
            file: 'proposal_v1.pdf',
            fileSize: '1.8 MB',
            pageCount: 25,
            feedbackCount: 8,
            unreadCount: 0,
            status: '피드백 완료',
            comments: [],
            versions: [
                { version: 'v1', date: '2025-09-10T09:30:00' }
            ]
        }
    ],
    
    // 심사 현황
    reviews: [
        {
            id: 1,
            type: '중간논문 심사',
            applicationDate: '2025-10-28',
            status: '심사 진행중',
            statusDetail: '심사위원 2/3 완료',
            progress: 66,
            expectedDate: '2025-11-15',
            result: null,
            score: null,
            file: 'midterm_thesis.pdf',
            plagiarismRate: 8,
            plagiarismStatus: '통과',
            reviewers: [
                {
                    name: '김교수',
                    role: '주심',
                    status: '완료',
                    score: 88,
                    reviewDate: '2025-11-02',
                    comment: '연구 설계가 잘 되어 있습니다. 데이터 분석 부분을 더 보강하세요.',
                    revisionRequests: [
                        '3장의 데이터 분석 방법을 더 구체적으로 기술',
                        '통계 분석 결과에 대한 해석을 추가',
                        '그래프와 표의 일관성 확인'
                    ]
                },
                {
                    name: '이교수',
                    role: '부심',
                    status: '완료',
                    score: 85,
                    reviewDate: '2025-11-03',
                    comment: '이론적 배경이 충실합니다. 결과 해석을 더 깊이 있게 다루면 좋겠습니다.',
                    revisionRequests: [
                        '4장 결과 부분의 논의를 더 깊이있게 작성',
                        '선행연구와의 비교 분석 추가',
                        '연구의 한계점 보완'
                    ]
                },
                {
                    name: '박교수',
                    role: '부심',
                    status: '대기중',
                    score: null,
                    reviewDate: null,
                    comment: null
                }
            ]
        },
        {
            id: 2,
            type: '연구계획서 심사',
            applicationDate: '2025-09-15',
            status: '심사 완료',
            statusDetail: null,
            progress: 100,
            result: '합격',
            score: 85,
            file: 'research_proposal.pdf',
            plagiarismRate: 12,
            plagiarismStatus: '통과',
            reviewers: [
                {
                    name: '김교수',
                    role: '주심',
                    status: '완료',
                    score: 90,
                    reviewDate: '2025-09-20',
                    comment: '연구 주제가 명확하고 연구 방법이 적절합니다.'
                },
                {
                    name: '이교수',
                    role: '부심',
                    status: '완료',
                    score: 80,
                    reviewDate: '2025-09-22',
                    comment: '선행연구 검토가 잘 되어있습니다.'
                }
            ]
        }
    ],
    
    // 논문제목 변경 이력
    titleChanges: [
        {
            id: 1,
            applicationDate: '2025-10-10T14:30:00',
            approvalDate: '2025-10-15T09:20:00',
            status: '승인',
            oldTitle: {
                korean: '고객 이탈 예측을 위한 머신러닝 모델 개발',
                english: 'Development of Machine Learning Model for Customer Churn Prediction'
            },
            newTitle: {
                korean: '인공지능 기반 고객 이탈 예측 모델 개발에 관한 연구',
                english: 'Development of AI-based Customer Churn Prediction Model'
            },
            reason: '연구 범위를 명확히 하고, 학술적 표현을 강화하기 위해 제목을 수정합니다.',
            professorComment: '변경된 제목이 연구 내용을 더 잘 반영합니다. 승인합니다.',
            attachments: []
        },
        {
            id: 2,
            applicationDate: '2025-09-05T10:00:00',
            approvalDate: '2025-09-08T16:30:00',
            status: '승인',
            oldTitle: {
                korean: '고객 이탈 예측 모델 연구',
                english: 'Study on Customer Churn Prediction Model'
            },
            newTitle: {
                korean: '고객 이탈 예측을 위한 머신러닝 모델 개발',
                english: 'Development of Machine Learning Model for Customer Churn Prediction'
            },
            reason: '연구 방법을 제목에 명확히 반영하기 위함',
            professorComment: '연구 방법이 제목에 잘 반영되었습니다.',
            attachments: []
        }
    ],
    
    // 현재 논문 제목
    currentTitle: {
        korean: '인공지능 기반 고객 이탈 예측 모델 개발에 관한 연구',
        english: 'Development of AI-based Customer Churn Prediction Model',
        registrationDate: '2025-09-01',
        lastModifiedDate: '2025-10-15'
    },

    // 자료실 게시글
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
            views: 28,
            files: [
                { id: 'F001', name: '논문작성가이드.docx', size: 856000, url: '#' },
                { id: 'F002', name: '참고논문.pdf', size: 3400000, url: '#' }
            ],
            comments: [
                {
                    id: 'C001',
                    authorId: 'S001',
                    authorName: '홍길동',
                    authorRole: 'student',
                    content: '감사합니다! 많은 도움이 되었습니다.',
                    createdAt: '2025-11-06T14:20:00',
                    files: []
                }
            ],
            viewerType: 'specific',
            viewers: ['S001']
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
            views: 15,
            files: [
                { id: 'F003', name: '미팅자료.pdf', size: 1200000, url: '#' }
            ],
            comments: [],
            viewerType: 'specific',
            viewers: ['S001']
        },
        {
            id: 3,
            title: '중간 보고서 진행 상황',
            content: '<p>중간 보고서 작성을 완료하였습니다.</p><p>검토 부탁드립니다.</p>',
            authorId: 'S001',
            authorName: '홍길동',
            authorRole: 'student',
            createdAt: '2025-11-07T16:45:00',
            updatedAt: '2025-11-07T16:45:00',
            views: 3,
            files: [
                { id: 'F004', name: '중간보고서_홍길동.docx', size: 2100000, url: '#' }
            ],
            comments: [
                {
                    id: 'C002',
                    authorId: 'P001',
                    authorName: '김교수',
                    authorRole: 'professor',
                    content: '전체적으로 잘 작성하셨습니다. 3장 연구방법론 부분을 좀 더 보완해주세요.',
                    createdAt: '2025-11-08T10:30:00',
                    files: [
                        { id: 'CF001', name: '참고자료.pdf', size: 1500000, url: '#' }
                    ]
                }
            ],
            viewerType: 'specific',
            viewers: ['P001']
        }
    ]
};

// 데이터 접근 함수
const DataService = {
    getStudent: () => StudentData.student,
    
    getGraduationRequirements: () => StudentData.graduationRequirements,
    
    calculateProgress: () => {
        const reqs = StudentData.graduationRequirements;
        const completed = reqs.filter(r => r.completed).length;
        return Math.round((completed / reqs.length) * 100);
    },
    
    getNotifications: () => StudentData.notifications,
    
    getMeetings: () => StudentData.meetings,
    
    getUpcomingMeetings: () => {
        const now = new Date();
        return StudentData.meetings
            .filter(m => m.status === '승인됨' && new Date(m.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
    },
    
    getFeedbacks: () => StudentData.feedbacks,
    
    getLatestFeedbacks: (count = 3) => {
        return StudentData.feedbacks
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
            .slice(0, count);
    },
    
    getReviews: () => StudentData.reviews,
    
    getTitleChanges: () => StudentData.titleChanges,
    
    getCurrentTitle: () => StudentData.currentTitle,

    // 자료실 관련 메서드
    getResourceBoards: () => StudentData.resourceBoards || [],

    getResourceBoard: (id) => {
        const boards = StudentData.resourceBoards || [];
        return boards.find(b => b.id === id);
    },

    incrementResourceBoardViews: (id) => {
        const board = DataService.getResourceBoard(id);
        if (board) {
            board.views = (board.views || 0) + 1;
        }
    },

    addResourceBoardComment: (postId, commentData) => {
        const board = DataService.getResourceBoard(postId);
        if (board) {
            const newComment = {
                id: `C${Date.now()}`,
                ...commentData,
                createdAt: new Date().toISOString()
            };
            board.comments = board.comments || [];
            board.comments.push(newComment);
        }
    },

    deleteResourceBoardComment: (postId, commentId) => {
        const board = DataService.getResourceBoard(postId);
        if (board && board.comments) {
            board.comments = board.comments.filter(c => c.id !== commentId);
        }
    },

    createResourceBoard: (postData) => {
        if (!StudentData.resourceBoards) {
            StudentData.resourceBoards = [];
        }
        const newPost = {
            id: StudentData.resourceBoards.length + 1,
            ...postData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            comments: []
        };
        StudentData.resourceBoards.push(newPost);
    },

    updateResourceBoard: (id, postData) => {
        const board = DataService.getResourceBoard(id);
        if (board) {
            Object.assign(board, postData);
            board.updatedAt = new Date().toISOString();
        }
    },

    deleteResourceBoard: (id) => {
        if (StudentData.resourceBoards) {
            StudentData.resourceBoards = StudentData.resourceBoards.filter(b => b.id !== id);
        }
    }
};
