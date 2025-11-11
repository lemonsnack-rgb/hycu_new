// Phase 4: 온라인피드백 관리 - 데이터

// ==================== 사용자 정보 ====================
const FEEDBACK_USERS = {
    'P001': {
        id: 'P001',
        name: '박교수',
        role: 'main',  // main(주지도) or co(공동지도)
        colors: {
            highlight: 'rgba(255, 255, 0, 0.4)',       // 노란색
            drawing: 'rgba(220, 38, 38, 0.9)',         // 빨간색
            comment: 'rgba(106, 0, 40, 0.1)'           // 베이지
        }
    },
    'P002': {
        id: 'P002',
        name: '이철수',
        role: 'co',
        colors: {
            highlight: 'rgba(255, 165, 0, 0.4)',       // 주황색
            drawing: 'rgba(37, 99, 235, 0.9)',         // 파란색
            comment: 'rgba(37, 99, 235, 0.1)'          // 연한 파랑
        }
    },
    'P003': {
        id: 'P003',
        name: '김영희',
        role: 'co',
        colors: {
            highlight: 'rgba(34, 197, 94, 0.4)',       // 초록색
            drawing: 'rgba(22, 163, 74, 0.9)',
            comment: 'rgba(34, 197, 94, 0.1)'
        }
    },
    'P004': {
        id: 'P004',
        name: '정민수',
        role: 'co',
        colors: {
            highlight: 'rgba(168, 85, 247, 0.4)',      // 보라색
            drawing: 'rgba(147, 51, 234, 0.9)',
            comment: 'rgba(168, 85, 247, 0.1)'
        }
    },
    'P005': {
        id: 'P005',
        name: '최수진',
        role: 'co',
        colors: {
            highlight: 'rgba(236, 72, 153, 0.4)',      // 분홍색
            drawing: 'rgba(219, 39, 119, 0.9)',
            comment: 'rgba(236, 72, 153, 0.1)'
        }
    },
    'P006': {
        id: 'P006',
        name: '강대성',
        role: 'co',
        colors: {
            highlight: 'rgba(14, 165, 233, 0.4)',      // 하늘색
            drawing: 'rgba(2, 132, 199, 0.9)',
            comment: 'rgba(14, 165, 233, 0.1)'
        }
    },
    'P007': {
        id: 'P007',
        name: '윤서영',
        role: 'co',
        colors: {
            highlight: 'rgba(245, 158, 11, 0.4)',      // 황금색
            drawing: 'rgba(217, 119, 6, 0.9)',
            comment: 'rgba(245, 158, 11, 0.1)'
        }
    },
    'P008': {
        id: 'P008',
        name: '한지원',
        role: 'co',
        colors: {
            highlight: 'rgba(239, 68, 68, 0.4)',       // 빨강 밝은색
            drawing: 'rgba(220, 38, 38, 0.9)',
            comment: 'rgba(239, 68, 68, 0.1)'
        }
    },
    'P009': {
        id: 'P009',
        name: '오준호',
        role: 'co',
        colors: {
            highlight: 'rgba(139, 92, 246, 0.4)',      // 인디고
            drawing: 'rgba(124, 58, 237, 0.9)',
            comment: 'rgba(139, 92, 246, 0.1)'
        }
    },
    'P010': {
        id: 'P010',
        name: '임현정',
        role: 'co',
        colors: {
            highlight: 'rgba(6, 182, 212, 0.4)',       // 청록색
            drawing: 'rgba(14, 116, 144, 0.9)',
            comment: 'rgba(6, 182, 212, 0.1)'
        }
    }
};

// 현재 로그인한 사용자 (다른 모듈에서 설정되지 않은 경우에만)
if (!window.CURRENT_USER) {
    window.CURRENT_USER = FEEDBACK_USERS['P001'];
}
const CURRENT_USER = window.CURRENT_USER;

// ==================== 제출물 목록 ====================
const FEEDBACK_REQUESTS = [
    {
        id: 'fb-001',
        documentId: 'doc-001',
        version: 1,
        studentName: '김철수',
        studentNumber: '2024001',
        program: '박사',
        major: '컴퓨터공학',
        graduate: '일반대학원',
        semester: 3,
        thesisTitle: 'AI 기반 학습자 맞춤형 교육 시스템 개발',
        file: '연구계획서_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        stage: '연구계획서',
        copykillerScore: '12%',
        gptkillerScore: '5%',
        uploadDate: '2025-11-20',
        feedbackDate: null,
        status: '피드백 대기',
        commentCount: 0,
        isCompleted: false,
        lastModified: '2025-11-20 09:00',
        lastModifiedBy: null
    },
    {
        id: 'fb-002',
        documentId: 'doc-002',
        version: 2,
        studentName: '이영희',
        studentNumber: '2024002',
        program: '석사',
        major: '경영학',
        graduate: '일반대학원',
        semester: 4,
        thesisTitle: '빅데이터 기반 고객 행동 분석 연구',
        file: '1장_서론_v2.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        previousVersions: [
            {
                version: 1,
                file: '1장_서론_v1.pdf',
                fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
                uploadDate: '2025-11-15',
                feedbackDate: '2025-11-16 10:00'
            }
        ],
        stage: '1장',
        copykillerScore: '8%',
        gptkillerScore: '3%',
        uploadDate: '2025-11-19',
        feedbackDate: '2025-11-19 15:30',
        status: '피드백 완료',
        commentCount: 5,
        isCompleted: true,
        lastModified: '2025-11-19 15:30',
        lastModifiedBy: 'P001'
    },
    {
        id: 'fb-003',
        documentId: 'doc-003',
        version: 1,
        studentName: '박민수',
        studentNumber: '2024003',
        program: '박사',
        major: '전자공학',
        graduate: '일반대학원',
        semester: 5,
        thesisTitle: '5G 네트워크 최적화 알고리즘 연구',
        file: '2장_이론적_배경_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        stage: '2장',
        copykillerScore: '25%',
        gptkillerScore: '15%',
        uploadDate: '2025-11-18',
        feedbackDate: null,
        status: '피드백 대기',
        commentCount: 0,
        isCompleted: false,
        lastModified: '2025-11-18 10:00',
        lastModifiedBy: null
    },
    {
        id: 'fb-004',
        documentId: 'doc-004',
        version: 3,
        studentName: '최수진',
        studentNumber: '2024004',
        program: '석사',
        major: '심리학',
        graduate: '일반대학원',
        semester: 3,
        thesisTitle: '청소년 스마트폰 중독과 우울증의 관계',
        file: '3장_연구방법론_v3.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        previousVersions: [
            {
                version: 1,
                file: '3장_연구방법론_v1.pdf',
                fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
                uploadDate: '2025-11-10',
                feedbackDate: '2025-11-11 14:00'
            },
            {
                version: 2,
                file: '3장_연구방법론_v2.pdf',
                fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
                uploadDate: '2025-11-14',
                feedbackDate: '2025-11-15 09:30'
            }
        ],
        stage: '3장',
        copykillerScore: '15%',
        gptkillerScore: '8%',
        uploadDate: '2025-11-17',
        feedbackDate: null,
        status: '피드백 대기',
        commentCount: 3,
        isCompleted: false,
        lastModified: '2025-11-17 14:00',
        lastModifiedBy: null
    }
];

// ==================== 피드백 데이터 ====================
const FEEDBACK_DATA = {
    'fb-001': {
        version: 1,
        lastModified: '2025-11-20 09:00',
        lastModifiedBy: null,
        
        generalFeedbackThread: [
            {
                id: 'gf-fb001-1',
                authorId: 'P001',
                authorName: '박교수',
                authorRole: 'main',
                text: '전반적인 연구 계획이 잘 작성되었습니다. 다만 몇 가지 보완이 필요한 부분이 있어 첨삭을 남겼습니다.',
                audio: null,
                timestamp: '2025-11-20 09:30',
                attachments: []
            }
        ],
        
        annotations: {
            '1': [
                {
                    type: 'path',
                    customType: 'highlight',
                    id: 'anno-fb001-h1',
                    authorId: 'P001',
                    authorName: '박교수',
                    originX: 'left',
                    originY: 'top',
                    left: 100,
                    top: 200,
                    width: 300,
                    height: 15,
                    fill: null,
                    stroke: 'rgba(255, 255, 0, 0.4)',
                    strokeWidth: 15,
                    path: [['M', 100, 207.5], ['L', 400, 207.5]]
                },
                {
                    type: 'rect',
                    customType: 'comment',
                    id: 'anno-fb001-c1',
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
                            id: 'cm-fb001-1-1',
                            authorId: 'P001',
                            authorName: '박교수',
                            authorRole: 'main',
                            text: '연구 문제가 명확하지 않습니다. 좀 더 구체적으로 작성해주세요.',
                            audio: null,
                            timestamp: '2025-11-20 09:35',
                            attachments: []
                        }
                    ],
                    linkedComments: [],
                    commentAudio: null
                }
            ],
            '2': [
                {
                    type: 'path',
                    customType: 'drawing',
                    id: 'anno-fb001-d1',
                    authorId: 'P001',
                    authorName: '박교수',
                    originX: 'left',
                    originY: 'top',
                    left: 150,
                    top: 300,
                    width: 200,
                    height: 100,
                    fill: null,
                    stroke: 'rgba(220, 38, 38, 0.9)',
                    strokeWidth: 2,
                    path: [
                        ['M', 150, 300],
                        ['L', 350, 300],
                        ['L', 350, 400],
                        ['L', 150, 400],
                        ['L', 150, 300]
                    ]
                }
            ]
        }
    },
    
    'fb-002': {
        version: 2,
        lastModified: '2025-11-19 15:30',
        lastModifiedBy: 'P001',
        
        generalFeedbackThread: [
            {
                id: 'gf-fb002-1',
                authorId: 'P001',
                authorName: '박교수',
                authorRole: 'main',
                text: '서론이 잘 작성되었습니다. 피드백 반영 확인했습니다.',
                audio: null,
                timestamp: '2025-11-19 15:30',
                attachments: []
            },
            {
                id: 'gf-fb002-2',
                authorId: 'S002',
                authorName: '이영희',
                authorRole: 'student',
                text: '감사합니다 교수님. 지적하신 부분 모두 수정했습니다.',
                audio: null,
                timestamp: '2025-11-19 16:00',
                attachments: []
            }
        ],
        
        annotations: {}
    },
    
    'fb-003': {
        version: 1,
        lastModified: '2025-11-18 10:00',
        lastModifiedBy: null,
        
        generalFeedbackThread: [],
        
        annotations: {}
    },
    
    'fb-004': {
        version: 1,
        lastModified: '2025-11-17 14:00',
        lastModifiedBy: null,
        
        generalFeedbackThread: [],
        
        annotations: {}
    }
};

// ==================== 자주 쓰는 코멘트 ====================
const QUICK_MARKS = [
    {
        id: 'qm-01',
        title: '근거 제시 필요',
        content: '주장에 대한 명확한 근거를 제시해 주세요. 관련 연구나 데이터를 인용하면 논리가 강화됩니다.'
    },
    {
        id: 'qm-02',
        title: '문단 구분',
        content: '내용의 흐름에 맞게 문단을 나누어 가독성을 높일 필요가 있습니다.'
    },
    {
        id: 'qm-03',
        title: '참고문헌 형식',
        content: '참고문헌 형식이 일관되지 않습니다. APA 형식을 참고하여 통일해 주세요.'
    },
    {
        id: 'qm-04',
        title: '표현 수정',
        content: '문장 표현이 모호합니다. 더 명확하고 간결하게 수정해 주세요.'
    },
    {
        id: 'qm-05',
        title: '추가 설명 필요',
        content: '이 부분에 대한 더 자세한 설명이 필요합니다. 독자가 이해할 수 있도록 보완해 주세요.'
    }
];

// ==================== 데이터 서비스 ====================
const FeedbackDataService = {
    // 제출물 목록
    getFeedbackRequests() {
        return [...FEEDBACK_REQUESTS];
    },
    
    getFeedbackRequestById(id) {
        return FEEDBACK_REQUESTS.find(req => req.id === id);
    },
    
    // 피드백 데이터
    getFeedbackData(feedbackId) {
        return FEEDBACK_DATA[feedbackId] ? {...FEEDBACK_DATA[feedbackId]} : null;
    },
    
    saveFeedbackData(feedbackId, data) {
        FEEDBACK_DATA[feedbackId] = {
            ...data,
            lastModified: new Date().toISOString().slice(0, 16).replace('T', ' '),
            lastModifiedBy: CURRENT_USER.id
        };
        
        // 제출물 정보도 업데이트
        const request = this.getFeedbackRequestById(feedbackId);
        if (request) {
            request.lastModified = FEEDBACK_DATA[feedbackId].lastModified;
            request.lastModifiedBy = CURRENT_USER.id;
            request.status = '피드백 완료';
        }
    },
    
    // 주석 추가
    addAnnotation(feedbackId, pageNum, annotation) {
        if (!FEEDBACK_DATA[feedbackId]) {
            FEEDBACK_DATA[feedbackId] = {
                version: 1,
                generalFeedbackThread: [],
                annotations: {}
            };
        }
        
        if (!FEEDBACK_DATA[feedbackId].annotations[pageNum]) {
            FEEDBACK_DATA[feedbackId].annotations[pageNum] = [];
        }
        
        FEEDBACK_DATA[feedbackId].annotations[pageNum].push(annotation);
        
        // 버전 업데이트
        FEEDBACK_DATA[feedbackId].version++;
        FEEDBACK_DATA[feedbackId].lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
        FEEDBACK_DATA[feedbackId].lastModifiedBy = CURRENT_USER.id;
    },
    
    // 코멘트 추가
    addComment(feedbackId, annotationId, comment, isMainComment = false) {
        console.log('🟢 [FeedbackDataService.addComment] 시작');
        console.log('🟢 feedbackId:', feedbackId);
        console.log('🟢 annotationId:', annotationId);
        console.log('🟢 comment:', comment);
        console.log('🟢 isMainComment:', isMainComment);
        
        const data = FEEDBACK_DATA[feedbackId];
        console.log('🟢 FEEDBACK_DATA[feedbackId]:', data);
        
        if (!data) {
            console.error('❌ [FeedbackDataService.addComment] data가 없음!');
            return;
        }
        
        console.log('🟢 data.annotations:', data.annotations);
        
        for (const pageNum in data.annotations) {
            console.log(`🟢 페이지 ${pageNum} 체크 중...`);
            
            const annotation = data.annotations[pageNum].find(a => a.id === annotationId);
            
            if (annotation) {
                console.log('🟢 annotation 찾음:', annotation);
                
                if (!annotation.comments) {
                    console.log('🟢 annotation.comments 초기화');
                    annotation.comments = [];
                }
                
                console.log('🟢 추가 전 comments:', annotation.comments);
                
                // ✅ 수정: 메인 첨삭은 맨 앞(unshift), 댓글은 맨 뒤(push)
                if (isMainComment) {
                    annotation.comments.unshift(comment);  // 메인 첨삭: 맨 앞
                    console.log('🟢 메인 첨삭 추가 (unshift)');
                } else {
                    annotation.comments.push(comment);     // 댓글: 맨 뒤
                    console.log('🟢 댓글 추가 (push)');
                }
                
                console.log('🟢 추가 후 comments:', annotation.comments);
                
                // 버전 업데이트
                data.version++;
                data.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
                data.lastModifiedBy = CURRENT_USER.id;
                
                console.log('🟢 [FeedbackDataService.addComment] 완료!');
                break;
            }
        }
    },
    
    // 코멘트 삭제
    deleteComment(feedbackId, annotationId, commentId) {
        console.log('🔴 [FeedbackDataService.deleteComment] 시작');
        console.log('🔴 feedbackId:', feedbackId);
        console.log('🔴 annotationId:', annotationId);
        console.log('🔴 commentId:', commentId);
        
        const data = FEEDBACK_DATA[feedbackId];
        if (!data) {
            console.error('❌ [deleteComment] data가 없음!');
            return false;
        }
        
        for (const pageNum in data.annotations) {
            const annotation = data.annotations[pageNum].find(a => a.id === annotationId);
            if (annotation && annotation.comments) {
                const index = annotation.comments.findIndex(c => c.id === commentId);
                
                if (index !== -1) {
                    console.log('🔴 삭제할 comment 찾음, index:', index);
                    annotation.comments.splice(index, 1);
                    
                    // 버전 업데이트
                    data.version++;
                    data.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
                    data.lastModifiedBy = CURRENT_USER.id;
                    
                    console.log('🔴 [deleteComment] 삭제 완료!');
                    return true;
                }
            }
        }
        
        console.error('❌ [deleteComment] comment를 찾지 못함');
        return false;
    },
    
    // annotation 완전 삭제 (영역 + 모든 comments)
    deleteAnnotation(feedbackId, pageNum, annotationId) {
        console.log('🔴 [FeedbackDataService.deleteAnnotation] 시작');
        console.log('🔴 feedbackId:', feedbackId);
        console.log('🔴 pageNum:', pageNum);
        console.log('🔴 annotationId:', annotationId);
        
        const data = FEEDBACK_DATA[feedbackId];
        if (!data) {
            console.error('❌ [deleteAnnotation] data가 없음!');
            return false;
        }
        
        if (!data.annotations[pageNum]) {
            console.error('❌ [deleteAnnotation] 해당 페이지가 없음!');
            return false;
        }
        
        const index = data.annotations[pageNum].findIndex(a => a.id === annotationId);
        
        if (index !== -1) {
            console.log('🔴 [deleteAnnotation] annotation 찾음, index:', index);
            data.annotations[pageNum].splice(index, 1);
            
            // 페이지에 annotation이 하나도 없으면 페이지 키 삭제
            if (data.annotations[pageNum].length === 0) {
                delete data.annotations[pageNum];
                console.log('🔴 [deleteAnnotation] 페이지 키 삭제:', pageNum);
            }
            
            // 버전 업데이트
            data.version++;
            data.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
            data.lastModifiedBy = CURRENT_USER.id;
            
            console.log('🔴 [deleteAnnotation] 삭제 완료!');
            return true;
        }
        
        console.error('❌ [deleteAnnotation] annotation을 찾지 못함');
        return false;
    },
    
    // 전체 피드백 추가
    addGeneralFeedback(feedbackId, feedback) {
        if (!FEEDBACK_DATA[feedbackId]) {
            FEEDBACK_DATA[feedbackId] = {
                version: 1,
                generalFeedbackThread: [],
                annotations: {}
            };
        }
        
        FEEDBACK_DATA[feedbackId].generalFeedbackThread.push(feedback);
        
        // 버전 업데이트
        FEEDBACK_DATA[feedbackId].version++;
        FEEDBACK_DATA[feedbackId].lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
        FEEDBACK_DATA[feedbackId].lastModifiedBy = CURRENT_USER.id;
    },
    
    // 자주 쓰는 코멘트
    getQuickMarks() {
        return [...QUICK_MARKS];
    },
    
    addQuickMark(mark) {
        QUICK_MARKS.push({
            id: `qm-${Date.now()}`,
            ...mark
        });
    },
    
    // 사용자 정보
    getCurrentUser() {
        return {...CURRENT_USER};
    },
    
    getUserById(userId) {
        return FEEDBACK_USERS[userId] ? {...FEEDBACK_USERS[userId]} : null;
    }
};

// Export
window.FeedbackDataService = FeedbackDataService;
window.FEEDBACK_USERS = FEEDBACK_USERS;
window.CURRENT_USER = CURRENT_USER;
