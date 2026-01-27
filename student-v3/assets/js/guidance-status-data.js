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
    advisorName: '박교수',
    colors: {
        comment: 'rgba(59, 130, 246, 0.1)',  // 파란색 (학생)
        drawing: '#3B82F6',  // 파란색
        highlight: 'rgba(59, 130, 246, 0.3)'
    }
};

// 즉시 window.CURRENT_USER에도 할당 (tools.js가 로드되기 전에 설정)
window.CURRENT_USER = CURRENT_STUDENT;

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
        studentReflectionCompleted: false,  // 학생 피드백 반영 완료 여부
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
        studentReflectionCompleted: false,  // 학생 피드백 반영 완료 여부
        lastModified: '2025-01-07 16:00',
        lastModifiedBy: null,
        date: '2025-01-07 16:00',
        memo: '이전 피드백 반영하여 연구문제 부분을 수정했습니다.\n확인 부탁드립니다.'
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
        date: '2025-01-09 10:30',
        memo: '최종 버전입니다. 참고문헌도 모두 추가했습니다.'
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
        date: '2025-01-03 09:15',
        memo: '서론 부분 연구 배경 보강했습니다.'
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
        date: '2024-12-15 11:20',
        memo: '선행연구 부분이 부족한 것 같아 추가 문헌을 더 찾아볼 예정입니다.'
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
                    userType: 'professor',  // 교수 주석
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
                    userType: 'professor',  // 교수 판서
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
                },
                {
                    type: 'rect',
                    customType: 'comment',
                    userType: 'student',  // 학생 주석
                    id: 'anno-gs001-c1-student',
                    authorId: 'S2024001',
                    authorName: '김철수',
                    left: 320,
                    top: 180,
                    width: 150,
                    height: 35,
                    fill: 'rgba(59, 130, 246, 0.1)',
                    stroke: 'rgba(59, 130, 246, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-gs001-1-student-1',
                            authorId: 'S2024001',
                            authorName: '김철수',
                            authorRole: 'student',
                            text: '이 부분은 교수님 피드백 반영하여 "AI 기반 맞춤형 학습 시스템이 대학생의 학업 성취도 및 학습 만족도에 미치는 영향"으로 수정했습니다.',
                            audio: null,
                            timestamp: '2025-01-07 14:20',
                            attachments: []
                        }
                    ]
                }
            ],
            '2': [
                {
                    type: 'group',
                    customType: 'comment',
                    userType: 'professor',  // 교수 주석
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
                },
                {
                    type: 'rect',
                    customType: 'comment',
                    userType: 'student',  // 학생 주석
                    id: 'anno-gs001-c2-student',
                    authorId: 'S2024001',
                    authorName: '김철수',
                    left: 100,
                    top: 450,
                    width: 200,
                    height: 40,
                    fill: 'rgba(59, 130, 246, 0.1)',
                    stroke: 'rgba(59, 130, 246, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-gs001-2-student-1',
                            authorId: 'S2024001',
                            authorName: '김철수',
                            authorRole: 'student',
                            text: '교수님 말씀대로 2022-2024년 최신 논문 7편 추가했습니다. 표로 정리하여 비교분석도 포함했습니다.',
                            audio: null,
                            timestamp: '2025-01-07 15:45',
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

    'gs-001-v2': {
        version: 2,
        lastModified: null,
        lastModifiedBy: null,

        generalFeedbackThread: [],

        annotations: {}
    },

    'gs-001-v3': {
        version: 3,
        lastModified: null,
        lastModifiedBy: null,

        generalFeedbackThread: [],

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
    },

    // 학생 피드백 반영 완료 표시
    markStudentReflectionCompleted(requestId) {
        const request = STUDENT_GUIDANCE_SUBMISSIONS.find(r => r.id === requestId);
        if (!request) return false;

        request.studentReflectionCompleted = true;
        request.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
        request.lastModifiedBy = CURRENT_STUDENT.id;

        console.log('학생 피드백 반영 완료:', requestId);
        return true;
    },

    // 학생이 주석(annotation) 추가
    addStudentAnnotation(requestId, pageNum, annotationData) {
        const data = STUDENT_GUIDANCE_FEEDBACK_DATA[requestId];
        if (!data) return false;

        if (!data.annotations) {
            data.annotations = {};
        }
        if (!data.annotations[pageNum]) {
            data.annotations[pageNum] = [];
        }

        data.annotations[pageNum].push(annotationData);
        console.log(`✅ 학생 주석 추가: requestId=${requestId}, page=${pageNum}`, annotationData);
        return true;
    },

    // 학생이 자신의 annotation 삭제
    deleteStudentAnnotation(requestId, annotationId) {
        const data = STUDENT_GUIDANCE_FEEDBACK_DATA[requestId];
        if (!data || !data.annotations) return false;

        // 모든 페이지를 순회하며 해당 annotation 찾아서 삭제
        for (const pageNum in data.annotations) {
            const pageAnnotations = data.annotations[pageNum];
            const index = pageAnnotations.findIndex(a => a.id === annotationId);

            if (index !== -1) {
                // 학생이 만든 annotation인지 확인
                if (pageAnnotations[index].userType === 'student' &&
                    pageAnnotations[index].authorId === CURRENT_STUDENT.id) {
                    pageAnnotations.splice(index, 1);
                    console.log(`✅ 학생 주석 삭제: requestId=${requestId}, annotationId=${annotationId}`);
                    return true;
                } else {
                    console.error('❌ 본인이 작성한 주석만 삭제할 수 있습니다');
                    return false;
                }
            }
        }

        console.error('❌ 주석을 찾을 수 없습니다:', annotationId);
        return false;
    },

    // 학생 제출 숨기기 (목록에서만 안 보이도록)
    hideStudentRequest(requestId) {
        const request = STUDENT_GUIDANCE_SUBMISSIONS.find(r => r.id === requestId);
        if (!request) {
            console.error('❌ 요청을 찾을 수 없습니다:', requestId);
            return false;
        }

        // hidden 플래그 추가
        request.hidden = true;
        console.log('✅ 제출 숨김 처리:', requestId);
        return true;
    },

    // 학생 첨삭 등록 완료
    completeStudentAnnotation(requestId) {
        const request = STUDENT_GUIDANCE_SUBMISSIONS.find(r => r.id === requestId);
        if (!request) {
            console.error('❌ 요청을 찾을 수 없습니다:', requestId);
            return false;
        }

        // isCompleted 플래그 설정
        request.isCompleted = true;
        console.log('✅ 첨삭 등록 완료 처리:', requestId);
        return true;
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
        // 학생의 주석 추가 처리
        return StudentGuidanceDataService.addStudentAnnotation(feedbackId, pageNum, annotationData);
    },
    addComment(feedbackId, commentId, comment, isMain) {
        // 학생은 댓글만 가능
        return StudentGuidanceDataService.addStudentComment(feedbackId, commentId, comment);
    },
    deleteComment(feedbackId, annotationId) {
        // 학생이 자신의 annotation 삭제
        return StudentGuidanceDataService.deleteStudentAnnotation(feedbackId, annotationId);
    }
};

console.log('✅ 학생용 논문 지도 현황 데이터 서비스 로드 완료');
