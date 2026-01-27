/**
 * 학생용 논문 지도 현황 - 데이터 서비스
 * Version: 20260107001
 */

// ==================== 학생 정보 ====================
const CURRENT_STUDENT = {
    id: 'S2024001',
    name: '김철수',
    studentNumber: '2024001',
    role: 'student',
    major: '컴퓨터공학',
    program: '박사',
    advisorName: '박교수'
};

// ==================== 교수 정보 ====================
const GUIDANCE_STATUS_PROFESSORS = {
    'P001': {
        id: 'P001',
        name: '박교수',
        role: 'main',
        colors: {
            highlight: 'rgba(255, 255, 0, 0.4)',
            drawing: 'rgba(220, 38, 38, 0.9)',
            comment: 'rgba(106, 0, 40, 0.1)'
        }
    }
};

// ==================== 제출물 목록 (학생 본인 것만) ====================
const STUDENT_GUIDANCE_SUBMISSIONS = [
    {
        id: 'gs-001',
        documentId: 'doc-001',
        version: 1,
        year: '2025',
        semester: '1',
        studentName: '김철수',
        studentNumber: '2024001',
        program: '박사',
        major: '컴퓨터공학',
        graduate: '일반대학원',
        college: '공학계열',
        undergraduate: '컴퓨터공학',
        status: 'active',
        thesisTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
        file: '연구계획서_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        guidanceStage: '연구계획서',
        copykillerScore: '12%',
        gptkillerScore: '5%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/gs-001',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/gs-001',
        professorName: '박교수',
        uploadDate: '2025-01-05 14:30',
        desiredDate: '2025-01-10',
        feedbackDate: '2025-01-06 10:20',
        commentCount: 3,
        isCompleted: false,
        lastModified: '2025-01-06 10:20',
        lastModifiedBy: 'P001',
        date: '2025-01-05 14:30',
        memo: '3장 연구방법론 부분에 대한 피드백을 특히 부탁드립니다.\n통계 분석 방법이 적절한지 확인 부탁드립니다.\n참고문헌은 다음 버전에 추가 예정입니다.'
    },
    // doc-001의 v2, v3 (테스트용)
    {
        id: 'gs-001-v2',
        documentId: 'doc-001',
        version: 2,
        year: '2025',
        semester: '1',
        studentName: '김철수',
        studentNumber: '2024001',
        program: '박사',
        major: '컴퓨터공학',
        graduate: '일반대학원',
        college: '공학계열',
        undergraduate: '컴퓨터공학',
        status: 'active',
        thesisTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
        file: '연구계획서_v2.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        guidanceStage: '연구계획서',
        copykillerScore: '10%',
        gptkillerScore: '4%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/gs-001-v2',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/gs-001-v2',
        professorName: '박교수',
        uploadDate: '2025-01-07 16:00',
        desiredDate: '2025-01-12',
        feedbackDate: null,
        commentCount: 0,
        isCompleted: false,
        lastModified: '2025-01-07 16:00',
        lastModifiedBy: null,
        date: '2025-01-07 16:00'
    },
    {
        id: 'gs-001-v3',
        documentId: 'doc-001',
        version: 3,
        year: '2025',
        semester: '1',
        studentName: '김철수',
        studentNumber: '2024001',
        program: '박사',
        major: '컴퓨터공학',
        graduate: '일반대학원',
        college: '공학계열',
        undergraduate: '컴퓨터공학',
        status: 'active',
        thesisTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
        file: '연구계획서_v3.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        guidanceStage: '연구계획서',
        copykillerScore: '8%',
        gptkillerScore: '3%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/gs-001-v3',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/gs-001-v3',
        professorName: '박교수',
        uploadDate: '2025-01-09 10:30',
        desiredDate: '2025-01-14',
        feedbackDate: null,
        commentCount: 0,
        isCompleted: false,
        lastModified: '2025-01-09 10:30',
        lastModifiedBy: null,
        date: '2025-01-09 10:30'
    },
    {
        id: 'gs-002',
        documentId: 'doc-002',
        version: 2,
        year: '2025',
        semester: '1',
        studentName: '김철수',
        studentNumber: '2024001',
        program: '박사',
        major: '컴퓨터공학',
        graduate: '일반대학원',
        college: '공학계열',
        undergraduate: '컴퓨터공학',
        status: 'active',
        thesisTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
        file: '1장_서론_v2.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        previousVersions: [
            {
                version: 1,
                file: '1장_서론_v1.pdf',
                fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
                uploadDate: '2024-12-20',
                feedbackDate: '2024-12-21 15:00'
            }
        ],
        guidanceStage: '1장',
        copykillerScore: '8%',
        gptkillerScore: '3%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/gs-002',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/gs-002',
        professorName: '박교수',
        uploadDate: '2025-01-03 09:15',
        desiredDate: '2025-01-08',
        feedbackDate: '2025-01-04 16:45',
        commentCount: 5,
        isCompleted: true,
        lastModified: '2025-01-04 16:45',
        lastModifiedBy: 'P001',
        date: '2025-01-03 09:15'
    },
    {
        id: 'gs-003',
        documentId: 'doc-003',
        version: 1,
        year: '2024',
        semester: '2',
        studentName: '김철수',
        studentNumber: '2024001',
        program: '박사',
        major: '컴퓨터공학',
        graduate: '일반대학원',
        college: '공학계열',
        undergraduate: '컴퓨터공학',
        status: 'active',
        thesisTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
        file: '2장_이론적배경_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        guidanceStage: '2장',
        copykillerScore: '15%',
        gptkillerScore: '7%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/gs-003',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/gs-003',
        professorName: '박교수',
        uploadDate: '2024-12-15 11:20',
        desiredDate: '2024-12-20',
        feedbackDate: null,
        commentCount: 0,
        isCompleted: false,
        lastModified: '2024-12-15 11:20',
        lastModifiedBy: null,
        date: '2024-12-15 11:20'
    }
];

// ==================== 피드백 데이터 ====================
const STUDENT_GUIDANCE_FEEDBACK_DATA = {
    'gs-001': {
        version: 1,
        lastModified: '2025-01-06 10:20',
        lastModifiedBy: 'P001',

        generalFeedbackThread: [
            {
                id: 'gf-gs001-1',
                authorId: 'P001',
                authorName: '박교수',
                authorRole: 'main',
                text: '연구 계획서가 전반적으로 잘 작성되었습니다.\n\n다만 연구 문제와 연구 목적 부분에서 좀 더 명확한 표현이 필요합니다. 첨삭 부분을 참고하여 수정해주세요.',
                audio: null,
                timestamp: '2025-01-06 10:20',
                attachments: [],
                ts: new Date('2025-01-06 10:20').getTime()
            },
            {
                id: 'gf-gs001-2',
                authorId: 'S2024001',
                authorName: '김철수',
                authorRole: 'student',
                text: '감사합니다 교수님. 지적하신 부분 수정하여 다시 제출하겠습니다.',
                audio: null,
                timestamp: '2025-01-06 11:30',
                attachments: [],
                ts: new Date('2025-01-06 11:30').getTime()
            }
        ],

        annotations: {
            '1': [
                {
                    type: 'group',
                    customType: 'comment',
                    id: 'anno-gs001-c1',
                    authorId: 'P001',
                    authorName: '박교수',
                    left: 100,
                    top: 250,
                    width: 200,
                    height: 50,
                    fill: 'rgba(106, 0, 40, 0.1)',
                    stroke: 'rgba(106, 0, 40, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-gs001-1-1',
                            authorId: 'P001',
                            authorName: '박교수',
                            authorRole: 'main',
                            text: '연구 문제가 구체적이지 않습니다.\n\n예를 들어, "AI 기반 맞춤형 학습 시스템이 학습자의 학업 성취도에 미치는 영향"과 같이 명확하게 표현해주세요.',
                            audio: null,
                            timestamp: '2025-01-06 10:25',
                            attachments: []
                        },
                        {
                            id: 'cm-gs001-1-2',
                            authorId: 'S2024001',
                            authorName: '김철수',
                            authorRole: 'student',
                            text: '알겠습니다. 말씀하신 대로 수정하겠습니다.',
                            audio: null,
                            timestamp: '2025-01-06 11:35',
                            attachments: []
                        }
                    ]
                },
                {
                    type: 'path',
                    customType: 'drawing',
                    id: 'anno-gs001-d1',
                    authorId: 'P001',
                    authorName: '박교수',
                    originX: 'left',
                    originY: 'top',
                    left: 150,
                    top: 350,
                    width: 250,
                    height: 80,
                    fill: null,
                    stroke: 'rgba(220, 38, 38, 0.9)',
                    strokeWidth: 2,
                    path: [
                        ['M', 150, 350],
                        ['L', 400, 350],
                        ['L', 400, 430],
                        ['L', 150, 430],
                        ['L', 150, 350]
                    ]
                }
            ],
            '2': [
                {
                    type: 'group',
                    customType: 'comment',
                    id: 'anno-gs001-c2',
                    authorId: 'P001',
                    authorName: '박교수',
                    left: 80,
                    top: 200,
                    width: 180,
                    height: 40,
                    fill: 'rgba(106, 0, 40, 0.1)',
                    stroke: 'rgba(106, 0, 40, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-gs001-2-1',
                            authorId: 'P001',
                            authorName: '박교수',
                            authorRole: 'main',
                            text: '선행연구 부분을 좀 더 보강해주세요.\n최근 3년 이내의 연구를 5편 이상 인용해주시기 바랍니다.',
                            audio: null,
                            timestamp: '2025-01-06 10:30',
                            attachments: []
                        }
                    ]
                }
            ]
        }
    },

    'gs-002': {
        version: 2,
        lastModified: '2025-01-04 16:45',
        lastModifiedBy: 'P001',

        generalFeedbackThread: [
            {
                id: 'gf-gs002-1',
                authorId: 'P001',
                authorName: '박교수',
                authorRole: 'main',
                text: '1장 서론 잘 작성했습니다.\n이전 피드백을 잘 반영한 것 같습니다. 이제 2장 작성으로 넘어가시면 됩니다.',
                audio: null,
                timestamp: '2025-01-04 16:45',
                attachments: [],
                ts: new Date('2025-01-04 16:45').getTime()
            },
            {
                id: 'gf-gs002-2',
                authorId: 'S2024001',
                authorName: '김철수',
                authorRole: 'student',
                text: '감사합니다 교수님!',
                audio: null,
                timestamp: '2025-01-04 17:00',
                attachments: [],
                ts: new Date('2025-01-04 17:00').getTime()
            }
        ],

        annotations: {}
    },

    'gs-003': {
        version: 1,
        lastModified: '2024-12-15 11:20',
        lastModifiedBy: null,

        generalFeedbackThread: [],

        annotations: {}
    }
};

// ==================== 데이터 서비스 ====================
const StudentGuidanceDataService = {
    // 현재 학생 정보
    getCurrentStudent() {
        return {...CURRENT_STUDENT};
    },

    // 제출물 목록 (학생 본인 것만)
    getStudentGuidanceRequests() {
        return [...STUDENT_GUIDANCE_SUBMISSIONS];
    },

    getStudentGuidanceRequestById(id) {
        return STUDENT_GUIDANCE_SUBMISSIONS.find(req => req.id === id);
    },

    // 제출 이력 조회 (동일 documentId의 모든 버전)
    getSubmissionHistory(documentId) {
        return STUDENT_GUIDANCE_SUBMISSIONS
            .filter(req => req.documentId === documentId)
            .sort((a, b) => b.version - a.version); // 최신순 (내림차순)
    },

    // requestId로 documentId 조회
    getDocumentIdByRequestId(requestId) {
        const request = this.getStudentGuidanceRequestById(requestId);
        return request ? request.documentId : null;
    },

    // 피드백 데이터
    getStudentGuidanceFeedbackData(requestId) {
        return STUDENT_GUIDANCE_FEEDBACK_DATA[requestId] ?
            {...STUDENT_GUIDANCE_FEEDBACK_DATA[requestId]} : null;
    },

    // 댓글 추가 (학생은 댓글만 가능)
    addStudentComment(requestId, annotationId, comment) {
        const data = STUDENT_GUIDANCE_FEEDBACK_DATA[requestId];
        if (!data) return false;

        // 페이지별 주석에서 해당 annotation 찾기
        for (const pageNum in data.annotations) {
            const annotation = data.annotations[pageNum].find(a => a.id === annotationId);
            if (annotation) {
                if (!annotation.comments) {
                    annotation.comments = [];
                }
                annotation.comments.push(comment);

                // 버전 업데이트
                data.version++;
                data.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
                data.lastModifiedBy = CURRENT_STUDENT.id;

                return true;
            }
        }
        return false;
    },

    // 전체 평가 댓글 추가
    addStudentGeneralComment(requestId, comment) {
        const data = STUDENT_GUIDANCE_FEEDBACK_DATA[requestId];
        if (!data) return false;

        if (!data.generalFeedbackThread) {
            data.generalFeedbackThread = [];
        }

        data.generalFeedbackThread.push(comment);

        // 버전 업데이트
        data.version++;
        data.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
        data.lastModifiedBy = CURRENT_STUDENT.id;

        return true;
    },

    // 댓글 수정 (본인 것만)
    updateStudentComment(requestId, annotationId, commentId, newText) {
        const data = STUDENT_GUIDANCE_FEEDBACK_DATA[requestId];
        if (!data) return false;

        // 주석 댓글 수정
        for (const pageNum in data.annotations) {
            const annotation = data.annotations[pageNum].find(a => a.id === annotationId);
            if (annotation && annotation.comments) {
                const comment = annotation.comments.find(c => c.id === commentId);
                if (comment && comment.authorId === CURRENT_STUDENT.id) {
                    comment.text = newText;
                    comment.timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

                    data.version++;
                    data.lastModified = comment.timestamp;
                    data.lastModifiedBy = CURRENT_STUDENT.id;

                    return true;
                }
            }
        }

        return false;
    },

    // 전체 평가 댓글 수정 (본인 것만)
    updateStudentGeneralComment(requestId, commentId, newText) {
        const data = STUDENT_GUIDANCE_FEEDBACK_DATA[requestId];
        if (!data) return false;

        const comment = data.generalFeedbackThread.find(c => c.id === commentId);
        if (comment && comment.authorId === CURRENT_STUDENT.id) {
            comment.text = newText;
            comment.timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
            comment.ts = Date.now();

            data.version++;
            data.lastModified = comment.timestamp;
            data.lastModifiedBy = CURRENT_STUDENT.id;

            return true;
        }

        return false;
    },

    // 교수 정보 가져오기
    getProfessorById(profId) {
        return GUIDANCE_STATUS_PROFESSORS[profId] ?
            {...GUIDANCE_STATUS_PROFESSORS[profId]} : null;
    }
};

// Export
window.StudentGuidanceDataService = StudentGuidanceDataService;
window.CURRENT_STUDENT = CURRENT_STUDENT;
window.GUIDANCE_STATUS_PROFESSORS = GUIDANCE_STATUS_PROFESSORS;

// Alias for compatibility with viewer
window.FeedbackDataService = {
    getFeedbackRequestById(id) {
        return StudentGuidanceDataService.getStudentGuidanceRequestById(id);
    },
    getFeedbackData(id) {
        return StudentGuidanceDataService.getStudentGuidanceFeedbackData(id);
    },
    getUserById(userId) {
        return StudentGuidanceDataService.getProfessorById(userId) || CURRENT_STUDENT;
    },
    addAnnotation(feedbackId, pageNum, annotationData) {
        // 학생은 주석 추가 불가 (뷰어용)
        return false;
    },
    addComment(feedbackId, commentId, comment, isMain) {
        // 학생은 댓글만 가능
        return StudentGuidanceDataService.addStudentComment(feedbackId, commentId, comment);
    }
};

console.log('✅ 학생용 논문 지도 현황 데이터 서비스 로드 완료');
