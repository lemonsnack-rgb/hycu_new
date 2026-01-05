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

// ==================== 제출물 목록 (mockData.js와 통합) ====================
const FEEDBACK_REQUESTS = [
    // STU002 - 이학생 (컴퓨터공학과 석사)
    {
        id: 1,
        documentId: 'doc-001',
        version: 1,
        studentId: 'STU002',
        studentName: '이학생',
        studentNumber: '2024002',
        program: '석사',
        degree: '석사',
        major: '컴퓨터공학과',
        department: '컴퓨터공학과',
        graduate: '일반대학원',
        semester: 4,
        thesisTitle: '블록체인 기반 데이터 무결성 보장 방안',
        file: '연구계획서_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        stage: '연구계획서',
        copykillerScore: '12%',
        gptkillerScore: '5%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/fb-001',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/fb-001',
        uploadDate: '2025-03-11',
        feedbackDate: '2025-03-13 14:20',
        status: '피드백 완료',
        commentCount: 3,
        isCompleted: true,
        lastModified: '2025-03-13 14:20',
        lastModifiedBy: 'P001',
        advisor: '김교수',
        advisorId: 'PROF001'
    },
    // STU003 - 박학생 (경영학과 석사)
    {
        id: 2,
        documentId: 'doc-002',
        version: 2,
        studentId: 'STU003',
        studentName: '박학생',
        studentNumber: '2024003',
        program: '석사',
        degree: '석사',
        major: '경영학과',
        department: '경영학과',
        graduate: '일반대학원',
        semester: 4,
        thesisTitle: '디지털 전환 시대의 기업 경쟁력 분석',
        file: '1장_서론_v2.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        previousVersions: [
            {
                version: 1,
                file: '1장_서론_v1.pdf',
                fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
                uploadDate: '2025-04-10',
                feedbackDate: '2025-04-12 10:00'
            }
        ],
        stage: '1장',
        copykillerScore: '8%',
        gptkillerScore: '3%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/fb-002',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/fb-002',
        uploadDate: '2025-04-18',
        feedbackDate: '2025-04-19 15:30',
        status: '피드백 완료',
        commentCount: 5,
        isCompleted: true,
        lastModified: '2025-04-19 15:30',
        lastModifiedBy: 'P001',
        advisor: '박교수',
        advisorId: 'PROF003'
    },
    // STU005 - 정학생 (교육학과 석사)
    {
        id: 3,
        documentId: 'doc-003',
        version: 1,
        studentId: 'STU005',
        studentName: '정학생',
        studentNumber: '2024005',
        program: '석사',
        degree: '석사',
        major: '교육학과',
        department: '교육학과',
        graduate: '일반대학원',
        semester: 4,
        thesisTitle: '온라인 교육의 효과성 연구',
        file: '2장_이론적_배경_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        stage: '2장',
        copykillerScore: '15%',
        gptkillerScore: '7%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/fb-003',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/fb-003',
        uploadDate: '2025-05-10',
        feedbackDate: null,
        status: '피드백 대기',
        commentCount: 0,
        isCompleted: false,
        lastModified: '2025-05-10 09:30',
        lastModifiedBy: null,
        advisor: '정교수',
        advisorId: 'PROF005'
    },
    // STU007 - 조학생 (심리학과 석사)
    {
        id: 4,
        documentId: 'doc-004',
        version: 1,
        studentId: 'STU007',
        studentName: '조학생',
        studentNumber: '2024007',
        program: '석사',
        degree: '석사',
        major: '심리학과',
        department: '심리학과',
        graduate: '일반대학원',
        semester: 4,
        thesisTitle: 'SNS 사용이 청소년 심리에 미치는 영향',
        file: '연구계획서_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        stage: '연구계획서',
        copykillerScore: '18%',
        gptkillerScore: '9%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/fb-004',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/fb-004',
        uploadDate: '2025-05-15',
        feedbackDate: null,
        status: '피드백 대기',
        commentCount: 0,
        isCompleted: false,
        lastModified: '2025-05-15 11:20',
        lastModifiedBy: null,
        advisor: '조교수',
        advisorId: 'PROF007'
    },
    // STU009 - 장학생 (사회복지학과 석사)
    {
        id: 5,
        documentId: 'doc-005',
        version: 1,
        studentId: 'STU009',
        studentName: '장학생',
        studentNumber: '2024009',
        program: '석사',
        degree: '석사',
        major: '사회복지학과',
        department: '사회복지학과',
        graduate: '일반대학원',
        semester: 4,
        thesisTitle: '노인 복지 정책의 효과성 분석',
        file: '3장_연구방법론_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        stage: '3장',
        copykillerScore: '10%',
        gptkillerScore: '4%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/fb-005',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/fb-005',
        uploadDate: '2025-05-20',
        feedbackDate: '2025-05-22 16:10',
        status: '피드백 완료',
        commentCount: 4,
        isCompleted: true,
        lastModified: '2025-05-22 16:10',
        lastModifiedBy: 'P001',
        advisor: '장교수',
        advisorId: 'PROF009'
    },
    // STU011 - 한학생 (컴퓨터공학과 박사)
    {
        id: 6,
        documentId: 'doc-006',
        version: 2,
        studentId: 'STU011',
        studentName: '한학생',
        studentNumber: '2023001',
        program: '박사',
        degree: '박사',
        major: '컴퓨터공학과',
        department: '컴퓨터공학과',
        graduate: '일반대학원',
        semester: 6,
        thesisTitle: '양자 컴퓨팅 알고리즘 최적화 연구',
        file: '4장_연구결과_v2.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        previousVersions: [
            {
                version: 1,
                file: '4장_연구결과_v1.pdf',
                fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
                uploadDate: '2025-06-01',
                feedbackDate: '2025-06-03 13:50'
            }
        ],
        stage: '4장',
        copykillerScore: '6%',
        gptkillerScore: '2%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/fb-006',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/fb-006',
        uploadDate: '2025-06-10',
        feedbackDate: null,
        status: '피드백 대기',
        commentCount: 2,
        isCompleted: false,
        lastModified: '2025-06-10 14:30',
        lastModifiedBy: null,
        advisor: '김교수',
        advisorId: 'PROF001'
    },
    // STU004 - 최학생 (경영학과 석사 - 최종논문)
    {
        id: 7,
        documentId: 'doc-007',
        version: 1,
        studentId: 'STU004',
        studentName: '최학생',
        studentNumber: '2024004',
        program: '석사',
        degree: '석사',
        major: '경영학과',
        department: '경영학과',
        graduate: '일반대학원',
        semester: 5,
        thesisTitle: 'ESG 경영이 기업 가치에 미치는 영향',
        file: '최종논문_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        stage: '최종논문',
        copykillerScore: '5%',
        gptkillerScore: '2%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/fb-007',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/fb-007',
        uploadDate: '2025-11-15',
        feedbackDate: '2025-11-17 09:40',
        status: '피드백 완료',
        commentCount: 7,
        isCompleted: true,
        lastModified: '2025-11-17 09:40',
        lastModifiedBy: 'P001',
        advisor: '박교수',
        advisorId: 'PROF003'
    },
    // STU013 - 남학생 (경영학과 박사)
    {
        id: 8,
        documentId: 'doc-008',
        version: 1,
        studentId: 'STU013',
        studentName: '남학생',
        studentNumber: '2023003',
        program: '박사',
        degree: '박사',
        major: '경영학과',
        department: '경영학과',
        graduate: '일반대학원',
        semester: 6,
        thesisTitle: '글로벌 공급망 리스크 관리 전략',
        file: '예비심사논문_v1.pdf',
        fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        stage: '예비심사',
        copykillerScore: '22%',
        gptkillerScore: '12%',
        copyKillerReportUrl: 'https://copykiller.hanyang.ac.kr/report/fb-008',
        gptKillerReportUrl: 'https://gptkiller.hanyang.ac.kr/report/fb-008',
        uploadDate: '2025-06-15',
        feedbackDate: null,
        status: '피드백 대기',
        commentCount: 0,
        isCompleted: false,
        lastModified: '2025-06-15 10:00',
        lastModifiedBy: null,
        advisor: '박교수',
        advisorId: 'PROF003'
    }
];

// ==================== 피드백 데이터 (예시 데이터 포함) ====================
const FEEDBACK_DATA = {
    '1': {
        version: 1,
        lastModified: '2025-03-13 14:20',
        lastModifiedBy: 'P001',

        generalFeedbackThread: [
            {
                id: 'gf-fb001-1',
                authorId: 'PROF001',
                authorName: '김교수',
                authorRole: 'main',
                text: '블록체인 기반 데이터 무결성 보장 방안에 대한 연구계획서가 잘 작성되었습니다. 연구 주제가 명확하고, 방법론도 적절합니다. 다만 기존 연구와의 차별성을 좀 더 명확히 제시하면 좋겠습니다.',
                audio: null,
                timestamp: '2025-03-13 14:20',
                ts: Date.now() - 86400000 * 290, // 약 10개월 전
                attachments: [],
                attach: []
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
    
    '2': {
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
    
    '3': {
        version: 1,
        lastModified: '2025-05-10 09:30',
        lastModifiedBy: null,

        generalFeedbackThread: [
            {
                id: 'gf-fb003-1',
                authorId: 'PROF005',
                authorName: '정교수',
                authorRole: 'main',
                text: '이론적 배경 부분이 아직 보완이 필요합니다. 온라인 교육의 효과성에 대한 선행 연구를 더 구체적으로 제시해주세요.',
                audio: null,
                timestamp: '2025-05-11 10:15',
                attachments: []
            }
        ],

        annotations: {
            '1': [
                {
                    type: 'rect',
                    customType: 'comment',
                    id: 'anno-fb003-c1',
                    authorId: 'PROF005',
                    authorName: '정교수',
                    left: 120,
                    top: 180,
                    width: 250,
                    height: 60,
                    fill: 'rgba(106, 0, 40, 0.1)',
                    stroke: 'rgba(106, 0, 40, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-fb003-1-1',
                            authorId: 'PROF005',
                            authorName: '정교수',
                            authorRole: 'main',
                            text: '이 부분의 이론적 근거가 부족합니다. 최근 5년 이내의 연구를 3개 이상 인용해주세요.',
                            audio: null,
                            timestamp: '2025-05-11 10:20',
                            attachments: []
                        }
                    ],
                    linkedComments: [],
                    commentAudio: null
                }
            ]
        }
    },

    '4': {
        version: 1,
        lastModified: '2025-05-15 11:20',
        lastModifiedBy: null,

        generalFeedbackThread: [
            {
                id: 'gf-fb004-1',
                authorId: 'PROF007',
                authorName: '조교수',
                authorRole: 'main',
                text: 'SNS 사용과 청소년 심리에 대한 연구계획서가 잘 구성되어 있습니다. 연구 대상과 방법이 명확합니다.',
                audio: null,
                timestamp: '2025-05-16 14:30',
                attachments: []
            }
        ],

        annotations: {
            '1': [
                {
                    type: 'path',
                    customType: 'highlight',
                    id: 'anno-fb004-h1',
                    authorId: 'PROF007',
                    authorName: '조교수',
                    left: 80,
                    top: 150,
                    width: 320,
                    height: 15,
                    fill: null,
                    stroke: 'rgba(255, 255, 0, 0.4)',
                    strokeWidth: 15,
                    path: [['M', 80, 157.5], ['L', 400, 157.5]]
                },
                {
                    type: 'rect',
                    customType: 'comment',
                    id: 'anno-fb004-c1',
                    authorId: 'PROF007',
                    authorName: '조교수',
                    left: 90,
                    top: 220,
                    width: 280,
                    height: 55,
                    fill: 'rgba(106, 0, 40, 0.1)',
                    stroke: 'rgba(106, 0, 40, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-fb004-1-1',
                            authorId: 'PROF007',
                            authorName: '조교수',
                            authorRole: 'main',
                            text: '연구 가설이 명확하게 제시되어 있어 좋습니다. 다만 독립변수와 종속변수의 조작적 정의를 더 구체적으로 기술해주세요.',
                            audio: null,
                            timestamp: '2025-05-16 14:35',
                            attachments: []
                        }
                    ],
                    linkedComments: [],
                    commentAudio: null
                }
            ]
        }
    },

    '5': {
        version: 1,
        lastModified: '2025-05-22 16:10',
        lastModifiedBy: 'P001',

        generalFeedbackThread: [
            {
                id: 'gf-fb005-1',
                authorId: 'PROF009',
                authorName: '장교수',
                authorRole: 'main',
                text: '노인 복지 정책에 대한 연구방법론이 체계적으로 잘 구성되었습니다. 양적 연구와 질적 연구를 모두 활용한 점이 좋습니다.',
                audio: null,
                timestamp: '2025-05-22 16:10',
                attachments: []
            }
        ],

        annotations: {
            '1': [
                {
                    type: 'rect',
                    customType: 'comment',
                    id: 'anno-fb005-c1',
                    authorId: 'PROF009',
                    authorName: '장교수',
                    left: 110,
                    top: 200,
                    width: 240,
                    height: 50,
                    fill: 'rgba(106, 0, 40, 0.1)',
                    stroke: 'rgba(106, 0, 40, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-fb005-1-1',
                            authorId: 'PROF009',
                            authorName: '장교수',
                            authorRole: 'main',
                            text: '설문 대상자 선정 기준을 좀 더 명확히 기술해주세요.',
                            audio: null,
                            timestamp: '2025-05-22 16:15',
                            attachments: []
                        }
                    ],
                    linkedComments: [],
                    commentAudio: null
                }
            ]
        }
    },

    '6': {
        version: 2,
        lastModified: '2025-06-10 14:30',
        lastModifiedBy: null,

        generalFeedbackThread: [
            {
                id: 'gf-fb006-1',
                authorId: 'PROF001',
                authorName: '김교수',
                authorRole: 'main',
                text: '양자 컴퓨팅 알고리즘 최적화 연구 결과가 매우 우수합니다. 실험 결과 분석이 명확하고 논리적입니다.',
                audio: null,
                timestamp: '2025-06-11 09:20',
                attachments: []
            }
        ],

        annotations: {
            '1': [
                {
                    type: 'path',
                    customType: 'highlight',
                    id: 'anno-fb006-h1',
                    authorId: 'PROF001',
                    authorName: '김교수',
                    left: 100,
                    top: 170,
                    width: 350,
                    height: 15,
                    fill: null,
                    stroke: 'rgba(255, 255, 0, 0.4)',
                    strokeWidth: 15,
                    path: [['M', 100, 177.5], ['L', 450, 177.5]]
                },
                {
                    type: 'rect',
                    customType: 'comment',
                    id: 'anno-fb006-c1',
                    authorId: 'PROF001',
                    authorName: '김교수',
                    left: 105,
                    top: 240,
                    width: 260,
                    height: 55,
                    fill: 'rgba(106, 0, 40, 0.1)',
                    stroke: 'rgba(106, 0, 40, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-fb006-1-1',
                            authorId: 'PROF001',
                            authorName: '김교수',
                            authorRole: 'main',
                            text: '이 부분의 수식이 매우 명확합니다. 다만 computational complexity 분석을 추가하면 더 좋을 것 같습니다.',
                            audio: null,
                            timestamp: '2025-06-11 09:25',
                            attachments: []
                        }
                    ],
                    linkedComments: [],
                    commentAudio: null
                }
            ]
        }
    },

    '7': {
        version: 1,
        lastModified: '2025-11-17 09:40',
        lastModifiedBy: 'P001',

        generalFeedbackThread: [
            {
                id: 'gf-fb007-1',
                authorId: 'PROF003',
                authorName: '박교수',
                authorRole: 'main',
                text: 'ESG 경영이 기업 가치에 미치는 영향에 대한 최종논문이 매우 완성도 높게 작성되었습니다. 실증 분석 결과가 설득력 있습니다.',
                audio: null,
                timestamp: '2025-11-17 09:40',
                attachments: []
            }
        ],

        annotations: {
            '1': [
                {
                    type: 'rect',
                    customType: 'comment',
                    id: 'anno-fb007-c1',
                    authorId: 'PROF003',
                    authorName: '박교수',
                    left: 95,
                    top: 190,
                    width: 270,
                    height: 60,
                    fill: 'rgba(106, 0, 40, 0.1)',
                    stroke: 'rgba(106, 0, 40, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-fb007-1-1',
                            authorId: 'PROF003',
                            authorName: '박교수',
                            authorRole: 'main',
                            text: '회귀분석 결과가 잘 정리되어 있습니다. 통계적 유의성도 충분히 확보되었습니다.',
                            audio: null,
                            timestamp: '2025-11-17 09:45',
                            attachments: []
                        }
                    ],
                    linkedComments: [],
                    commentAudio: null
                }
            ]
        }
    },

    '8': {
        version: 1,
        lastModified: '2025-06-15 10:00',
        lastModifiedBy: null,

        generalFeedbackThread: [
            {
                id: 'gf-fb008-1',
                authorId: 'PROF003',
                authorName: '박교수',
                authorRole: 'main',
                text: '글로벌 공급망 리스크 관리에 대한 예비심사논문입니다. 연구 범위가 광범위하니 핵심 주제에 집중해주세요.',
                audio: null,
                timestamp: '2025-06-16 11:30',
                attachments: []
            }
        ],

        annotations: {
            '1': [
                {
                    type: 'path',
                    customType: 'highlight',
                    id: 'anno-fb008-h1',
                    authorId: 'PROF003',
                    authorName: '박교수',
                    left: 85,
                    top: 160,
                    width: 340,
                    height: 15,
                    fill: null,
                    stroke: 'rgba(255, 255, 0, 0.4)',
                    strokeWidth: 15,
                    path: [['M', 85, 167.5], ['L', 425, 167.5]]
                },
                {
                    type: 'rect',
                    customType: 'comment',
                    id: 'anno-fb008-c1',
                    authorId: 'PROF003',
                    authorName: '박교수',
                    left: 100,
                    top: 230,
                    width: 250,
                    height: 65,
                    fill: 'rgba(106, 0, 40, 0.1)',
                    stroke: 'rgba(106, 0, 40, 0.8)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false,
                    comments: [
                        {
                            id: 'cm-fb008-1-1',
                            authorId: 'PROF003',
                            authorName: '박교수',
                            authorRole: 'main',
                            text: '연구 범위를 COVID-19 이후의 공급망 변화에 집중하는 것이 좋겠습니다. 너무 광범위하면 논문의 깊이가 떨어질 수 있습니다.',
                            audio: null,
                            timestamp: '2025-06-16 11:35',
                            attachments: []
                        }
                    ],
                    linkedComments: [],
                    commentAudio: null
                }
            ]
        }
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
    },

    // 피드백 완료 처리
    completeFeedbackRequest(feedbackId) {
        const request = FEEDBACK_REQUESTS.find(req => req.id === feedbackId);
        if (request) {
            request.isCompleted = true;
            request.status = '피드백 완료';
            request.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
            request.lastModifiedBy = CURRENT_USER.id;
            return true;
        }
        return false;
    }
};

// Export
window.FeedbackDataService = FeedbackDataService;
window.FEEDBACK_USERS = FEEDBACK_USERS;
window.CURRENT_USER = CURRENT_USER;
