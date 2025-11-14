// ========== 전역 데이터 저장소 ==========
const appData = {
    schedules: [
        { id: 1, name: '2025-1학기 연구계획서 제출 기간', target: '전체', startDate: '2025-03-01', endDate: '2025-03-15', description: '1학기 연구계획서 제출 마감' },
        { id: 2, name: '2025-1학기 중간논문 제출 기간', target: '교육공학-석사', startDate: '2025-05-01', endDate: '2025-05-31', description: '중간논문 제출 및 심사' }
    ],
    requirements: [
        { id: 1, major: '교육공학', degree: '석사', minCredits: 24, thesisRequired: true, journalPapers: 1, conferencePapers: 0 },
        { id: 2, major: '경영학', degree: '박사', minCredits: 36, thesisRequired: true, journalPapers: 2, conferencePapers: 1 }
    ],
    stages: [
        {
            id: 1,
            name: '2025-1학기 교육공학 석사 표준 계획',
            major: '교육공학',
            degree: '석사',
            version: 'v1.0',
            stageCount: 3,
            evaluationCount: 3,
            studentCount: 0,
            steps: [
                {
                    id: 1,
                    name: '연구계획서',
                    order: 1,
                    hasEvaluation: true,
                    evaluationCriteriaId: 2,
                    evaluationCriteriaName: '교육공학 특화 평가표'
                },
                {
                    id: 2,
                    name: '중간논문',
                    order: 2,
                    hasEvaluation: true,
                    evaluationCriteriaId: 1,
                    evaluationCriteriaName: '일반 연구계획서 평가표'
                },
                {
                    id: 3,
                    name: '최종논문',
                    order: 3,
                    hasEvaluation: true,
                    evaluationCriteriaId: 3,
                    evaluationCriteriaName: '최종논문 평가표 (상세형)'
                }
            ]
        },
        {
            id: 2,
            name: '2025-1학기 경영학 박사 표준 계획',
            major: '경영학',
            degree: '박사',
            version: 'v1.0',
            stageCount: 5,
            evaluationCount: 3,
            studentCount: 0,
            steps: [
                {
                    id: 1,
                    name: '연구계획서',
                    order: 1,
                    hasEvaluation: true,
                    evaluationCriteriaId: 1,
                    evaluationCriteriaName: '일반 연구계획서 평가표'
                },
                {
                    id: 2,
                    name: 'IRB 승인',
                    order: 2,
                    hasEvaluation: false,
                    evaluationCriteriaId: null,
                    evaluationCriteriaName: null
                },
                {
                    id: 3,
                    name: '중간논문',
                    order: 3,
                    hasEvaluation: true,
                    evaluationCriteriaId: 1,
                    evaluationCriteriaName: '일반 연구계획서 평가표'
                },
                {
                    id: 4,
                    name: '예비심사',
                    order: 4,
                    hasEvaluation: false,
                    evaluationCriteriaId: null,
                    evaluationCriteriaName: null
                },
                {
                    id: 5,
                    name: '최종논문',
                    order: 5,
                    hasEvaluation: true,
                    evaluationCriteriaId: 3,
                    evaluationCriteriaName: '최종논문 평가표 (상세형)'
                }
            ]
        },
        {
            id: 3,
            name: '2024-2학기 심리학 석사 계획',
            major: '심리학',
            degree: '석사',
            version: 'v1.0',
            stageCount: 2,
            evaluationCount: 2,
            studentCount: 3,
            steps: [
                {
                    id: 1,
                    name: '연구계획서',
                    order: 1,
                    hasEvaluation: true,
                    evaluationCriteriaId: 1,
                    evaluationCriteriaName: '석사 논문 평가 기준'
                },
                {
                    id: 2,
                    name: '최종논문',
                    order: 2,
                    hasEvaluation: true,
                    evaluationCriteriaId: 1,
                    evaluationCriteriaName: '석사 논문 평가 기준'
                }
            ]
        }
    ],
    types: [
        { id: 1, name: '연구계획서 제출', presentation: false, document: true },
        { id: 2, name: '중간논문 심사', presentation: true, document: true },
        { id: 3, name: 'IRB 승인', presentation: false, document: true },
        { id: 4, name: '예비 심사', presentation: true, document: true },
        { id: 5, name: '최종논문 제출', presentation: true, document: true }
    ],
    evaluationCriteria: [
        {
            id: 1,
            name: '석사 논문 평가 기준',
            type: '석사',
            evaluationType: 'score',
            items: [
                { name: '연구 주제의 적절성', score: 25 },
                { name: '연구 방법론', score: 25 },
                { name: '결과 분석', score: 25 },
                { name: '논문 작성 완성도', score: 25 }
            ],
            totalScore: 100,
            passCriteria: {
                type: 'average',  // 'average' 또는 'total'
                passScore: 70,    // 통과 점수
                hasFailThreshold: true,  // 과락 기준 있음
                failThreshold: 60  // 과락 기준 점수 (항목별)
            }
        },
        {
            id: 2,
            name: '박사 논문 평가 기준',
            type: '박사',
            evaluationType: 'score',
            items: [
                { name: '연구의 독창성', score: 25 },
                { name: '연구 방법론', score: 20 },
                { name: '학문적 기여도', score: 25 },
                { name: '논문 작성 완성도', score: 20 },
                { name: '발표 능력', score: 10 }
            ],
            totalScore: 100,
            passCriteria: {
                type: 'total',    // 총점 기준
                passScore: 75,    // 통과 점수
                hasFailThreshold: false,  // 과락 기준 없음
                failThreshold: null
            }
        },
        {
            id: 3,
            name: 'IRB 승인 심사',
            type: '박사',
            evaluationType: 'passfail',
            items: ['연구 윤리 준수', '개인정보 보호 계획', '연구 참여자 동의서', '위험성 평가'],
            totalScore: null,
            passCriteria: null  // pass/fail 방식은 통과기준 없음
        }
    ],
    
    // 기관계 시스템에서 가져온 논문 제출 요건 목록
    availableRequirements: [
        {
            id: 'req-001',
            name: '최소 학점 이수',
            category: '학점',
            description: '석사 24학점, 박사 36학점 이수',
            details: '전공 필수 및 선택 과목 포함'
        },
        {
            id: 'req-002',
            name: '학술지 논문 게재 (KCI 등재)',
            category: '연구실적',
            description: 'KCI 등재 학술지에 논문 1편 이상 게재',
            details: '제1저자 또는 교신저자로 게재'
        },
        {
            id: 'req-003',
            name: '학술지 논문 게재 (SCOPUS/SCI)',
            category: '연구실적',
            description: 'SCOPUS 또는 SCI(E) 등재 학술지에 논문 1편 이상 게재',
            details: '제1저자 또는 교신저자로 게재'
        },
        {
            id: 'req-004',
            name: '학술대회 발표',
            category: '연구실적',
            description: '국내외 학술대회에서 논문 발표',
            details: '구두 발표 또는 포스터 발표 인정'
        },
        {
            id: 'req-005',
            name: '외국어 시험 통과',
            category: '어학',
            description: 'TOEIC 700점 이상 또는 이에 준하는 성적',
            details: 'TOEFL, TEPS, OPIC 등 인정'
        },
        {
            id: 'req-006',
            name: '종합시험 합격',
            category: '시험',
            description: '전공 종합시험 합격',
            details: '필기시험 또는 구술시험'
        },
        {
            id: 'req-007',
            name: '연구윤리교육 이수',
            category: '교육',
            description: '연구윤리 온라인 교육 이수',
            details: '매 학기 1회 이상 이수'
        },
        {
            id: 'req-008',
            name: 'IRB 승인',
            category: '연구윤리',
            description: '인간 대상 연구 시 IRB 승인 필수',
            details: '연구 시작 전 승인 완료 필요'
        }
    ],
    submissions: {
        researchProposal: [
            { 
                id: 1, 
                studentName: '김철수', 
                studentId: '2024001', 
                major: '교육공학', 
                degree: '석사', 
                advisor: '홍길동', 
                submitDate: '2025-03-10',
                thesisTitle: '인공지능 활용 교육 플랫폼의 효과성 연구',
                researchPurpose: '인공지능 기술을 활용한 맞춤형 학습 플랫폼이 학습자의 학업 성취도와 학습 동기에 미치는 영향을 실증적으로 분석하고자 함',
                researchMethod: '실험 연구 (실험집단 30명, 통제집단 30명), 사전-사후 검사 설계',
                expectedResults: '인공지능 활용 그룹이 전통적 학습 그룹 대비 학업 성취도 15% 향상 예상',
                status: '승인대기', 
                fileUrl: '#',
                fileName: '2024001_김철수_연구계획서.pdf'
            },
            { 
                id: 2, 
                studentName: '이영희', 
                studentId: '2024002', 
                major: '경영학', 
                degree: '박사', 
                advisor: '박교수', 
                submitDate: '2025-03-12',
                thesisTitle: 'ESG 경영이 기업 가치에 미치는 영향: 한국 코스피 상장 기업을 중심으로',
                researchPurpose: '기업의 ESG 경영 활동이 재무적 성과 및 기업 가치에 미치는 영향을 실증 분석',
                researchMethod: '패널 데이터 분석 (2018-2023년, 200개 기업), 회귀분석 및 매개효과 분석',
                expectedResults: 'ESG 점수와 기업 가치 간 정(+)의 상관관계 검증 예상',
                status: '승인완료', 
                fileUrl: '#',
                fileName: '2024002_이영희_연구계획서.pdf',
                approvalDate: '2025-03-15',
                reviewComment: '연구 주제와 방법론이 명확하여 승인합니다. IRB 승인 절차를 진행해주세요.'
            }
        ],
        thesisPlan: [
            {
                id: 1,
                studentName: '박민수',
                studentId: '2023005',
                major: '교육공학',
                degree: '석사',
                advisor: '홍길동',
                phone: '010-1234-5678',
                email: 'minsu.park@example.com',
                semesterCount: '2',
                studentStatus: '재학',
                year: '2025',
                semester: '1',
                graduate: '일반대학원',
                submitDate: '2025-04-05',
                evalDate: '2025-04-12',
                thesisTitle: '메타버스 기반 협력학습이 문제해결력에 미치는 영향',
                chapter1: '연구의 필요성 및 목적',
                chapter2: '이론적 배경 (메타버스 교육, 협력학습, 문제해결력)',
                chapter3: '연구 방법 (혼합 연구 설계)',
                chapter4: '연구 결과 예상',
                chapter5: '결론 및 제언',
                schedule: '1학기: 1-2장 작성, 여름방학: 3장 작성 및 데이터 수집, 2학기: 4-5장 작성',
                status: '검토중',
                result: '승인',
                fileUrl: '#',
                fileName: '2023005_박민수_논문작성계획서.pdf'
            }
        ],
        midThesis: [
            {
                id: 1,
                studentName: '최지연',
                studentId: '2023010',
                major: '경영학',
                degree: '석사',
                advisor: '박교수',
                phone: '010-2345-6789',
                email: 'jiyeon.choi@example.com',
                semesterCount: '3',
                studentStatus: '재학',
                year: '2025',
                semester: '1',
                graduate: '일반대학원',
                submitDate: '2025-05-15',
                evalDate: '2025-05-22',
                thesisTitle: '소셜미디어 마케팅이 브랜드 충성도에 미치는 영향',
                totalPages: 85,
                copyKiller: 8,
                gptKiller: 12,
                copyKillerDetail: '전체 유사도 8%, 인용 처리 적절',
                gptKillerDetail: 'AI 생성 의심 구간 12%, 추가 검토 필요',
                status: '심사중',
                result: '대기',
                fileUrl: '#',
                fileName: '2023010_최지연_중간논문.pdf',
                reviewers: [
                    { name: '박교수', role: '주심', status: '완료', score: 88, comment: '연구 설계가 잘 되어 있습니다.' },
                    { name: '김교수', role: '부심', status: '완료', score: 85, comment: '이론적 배경이 충실합니다.' },
                    { name: '이교수', role: '부심', status: '대기' }
                ]
            }
        ],
        finalThesis: [
            {
                id: 1,
                studentName: '정태훈',
                studentId: '2022008',
                major: '교육공학',
                degree: '박사',
                advisor: '홍길동',
                phone: '010-3456-7890',
                email: 'taehoon.jung@example.com',
                semesterCount: '4',
                studentStatus: '재학',
                year: '2025',
                semester: '1',
                graduate: '일반대학원',
                submitDate: '2025-06-10',
                evalDate: '2025-06-20',
                thesisTitle: '학습분석학을 활용한 적응형 학습 시스템 설계 및 효과성 검증',
                totalPages: 248,
                copyKiller: 5,
                gptKiller: 0,
                copyKillerDetail: '전체 유사도 5%, 모든 인용 적절',
                gptKillerDetail: 'AI 생성 의심 구간 없음',
                status: '심사완료',
                result: '승인',
                finalScore: 92,
                defenseDate: '2025-06-20',
                fileUrl: '#',
                fileName: '2022008_정태훈_최종논문.pdf',
                reviewers: [
                    { name: '홍길동', role: '주심', status: '완료', score: 94, comment: '학문적 기여도가 높은 우수한 연구입니다.' },
                    { name: '최교수', role: '부심', status: '완료', score: 91, comment: '연구 방법론이 탁월합니다.' },
                    { name: '강교수', role: '부심', status: '완료', score: 90, comment: '실용적 시사점이 명확합니다.' }
                ]
            }
        ],
        journalSubmission: [
            { 
                id: 1, 
                studentName: '김민지', 
                studentId: '2023012', 
                major: '경영학', 
                degree: '박사', 
                journalName: 'Journal of Business Research',
                paperTitle: 'The Impact of Corporate Social Responsibility on Consumer Trust in the Digital Age',
                publishDate: '2025-03',
                publishYear: '2025',
                volume: '168',
                pages: '45-58',
                doi: '10.1016/j.jbusres.2024.114523',
                isFirstAuthor: true,
                coAuthors: 'Park, J., Lee, S.',
                kci: true,
                scopus: true,
                sci: false,
                impactFactor: 3.78,
                abstractKor: '디지털 시대에 기업의 사회적 책임 활동이 소비자 신뢰에 미치는 영향을 실증 분석한 연구...',
                abstractEng: 'This study empirically analyzes the impact of corporate social responsibility on consumer trust in the digital age...',
                keywords: '기업의 사회적 책임, 소비자 신뢰, 디지털 마케팅',
                status: '심사중',
                proofUrl: '#',
                paperUrl: '#'
            }
        ]
    },
    // ========== 논문지도 진행 현황 (PDF 피드백 조회) ==========
    guidanceProgress: [
        {
            id: 1,
            studentId: '2024001',
            studentName: '김철수',
            major: '교육공학',
            degree: '석사',
            advisor: '홍길동',
            documentTitle: '최종본 재검토 요청',
            fileName: '논문_최종본_김철수_v3.pdf',
            fileUrl: '/files/feedback/doc-kim-final-v3.pdf',
            submitDate: '2025-11-25',
            stage: '최종본',
            copyKiller: 7,
            gptKiller: 1,
            feedbackStatus: '답변 대기중',
            feedbackCount: 3,
            lastFeedbackDate: '2025-11-26'
        },
        {
            id: 2,
            studentId: '2024001',
            studentName: '김철수',
            major: '교육공학',
            degree: '석사',
            advisor: '홍길동',
            documentTitle: '최종본 2차 검토 요청',
            fileName: '논문_최종본_김철수_v2.pdf',
            fileUrl: '/files/feedback/doc-kim-final-v2.pdf',
            submitDate: '2025-11-20',
            stage: '최종본',
            copyKiller: 8,
            gptKiller: 1,
            feedbackStatus: '피드백 완료',
            feedbackCount: 2,
            lastFeedbackDate: '2025-11-21'
        },
        {
            id: 3,
            studentId: '2024002',
            studentName: '이영희',
            major: '경영학',
            degree: '박사',
            advisor: '최교수',
            documentTitle: '4장 결과 및 논의 검토 요청',
            fileName: '4장_결과논의_이영희.pdf',
            fileUrl: '/files/feedback/doc-lee-chap4.pdf',
            submitDate: '2025-11-18',
            stage: '중간논문',
            copyKiller: 15,
            gptKiller: 3,
            feedbackStatus: '피드백 완료',
            feedbackCount: 1,
            lastFeedbackDate: '2025-11-19'
        },
        {
            id: 4,
            studentId: '2024003',
            studentName: '홍길동',
            major: '컴퓨터공학',
            degree: '석사',
            advisor: '박교수',
            documentTitle: '연구계획서 초안 검토',
            fileName: '연구계획서_홍길동_v1.pdf',
            fileUrl: '/files/feedback/doc-hong-proposal.pdf',
            submitDate: '2025-11-22',
            stage: '연구계획서',
            copyKiller: 5,
            gptKiller: 2,
            feedbackStatus: '답변 대기중',
            feedbackCount: 0,
            lastFeedbackDate: null
        },
        {
            id: 5,
            studentId: '2024002',
            studentName: '이영희',
            major: '경영학',
            degree: '박사',
            advisor: '최교수',
            documentTitle: '3장 연구방법 검토 요청',
            fileName: '3장_연구방법_이영희.pdf',
            fileUrl: '/files/feedback/doc-lee-chap3.pdf',
            submitDate: '2025-11-15',
            stage: '중간논문',
            copyKiller: 12,
            gptKiller: 2,
            feedbackStatus: '피드백 완료',
            feedbackCount: 2,
            lastFeedbackDate: '2025-11-16'
        }
    ],
    
    // ========== 주차별 논문지도 현황 ==========
    weeklyGuidanceStudents: [
        {
            id: 1,
            studentId: '2024001',
            studentName: '김철수',
            major: '교육공학',
            degree: '석사',
            advisors: ['홍길동', '박교수'],
            guidanceCount: 5,
            lastGuidanceDate: '2025-03-15'
        },
        {
            id: 2,
            studentId: '2024002',
            studentName: '이영희',
            major: '경영학',
            degree: '박사',
            advisors: ['최교수'],
            guidanceCount: 3,
            lastGuidanceDate: '2025-03-10'
        },
        {
            id: 3,
            studentId: '2024003',
            studentName: '홍길동',
            major: '컴퓨터공학',
            degree: '석사',
            advisors: ['박교수', '김교수'],
            guidanceCount: 0,
            lastGuidanceDate: null
        }
    ],
    
    guidanceRecords: [
        // 김철수 (2024001) 지도 내역
        {
            id: 1,
            studentId: '2024001',
            week: 1,
            date: '2025-03-01',
            advisor: '홍길동',
            topic: '연구방법론 개요',
            content: '질적연구와 양적연구의 차이점 설명, 연구 주제에 적합한 방법론 논의',
            method: '대면',
            professorComment: '연구 방향 잘 설정됨. 다음 주까지 선행연구 5편 이상 검토 필요'
        },
        {
            id: 2,
            studentId: '2024001',
            week: 2,
            date: '2025-03-08',
            advisor: '박교수',
            topic: '문헌검토 방법',
            content: '선행연구 검색 방법, 데이터베이스 활용법, 문헌 정리 방법 안내',
            method: '비대면',
            professorComment: '검색 키워드 재설정 필요. 국외 문헌도 포함하여 검토'
        },
        {
            id: 3,
            studentId: '2024001',
            week: 3,
            date: '2025-03-15',
            advisor: '홍길동',
            topic: '연구설계 검토',
            content: '연구 대상, 표본 크기, 자료 수집 방법 등 연구설계 전반 검토',
            method: '대면',
            professorComment: '연구설계 적절함. IRB 신청 준비 시작'
        },
        {
            id: 4,
            studentId: '2024001',
            week: 4,
            date: '2025-03-22',
            advisor: '박교수',
            topic: 'IRB 신청서 작성',
            content: 'IRB 신청서 작성 요령, 연구 윤리 관련 주의사항 안내',
            method: '이메일',
            professorComment: 'IRB 신청서 초안 검토 완료. 일부 수정 후 제출'
        },
        {
            id: 5,
            studentId: '2024001',
            week: 5,
            date: '2025-03-29',
            advisor: '홍길동',
            topic: '연구계획서 최종 검토',
            content: '연구계획서 전체 내용 최종 점검, 형식 및 내용 보완',
            method: '대면',
            professorComment: '연구계획서 승인 가능 수준. 다음 주 제출'
        },
        
        // 이영희 (2024002) 지도 내역
        {
            id: 6,
            studentId: '2024002',
            week: 1,
            date: '2025-03-05',
            advisor: '최교수',
            topic: '박사논문 주제 선정',
            content: '관심 연구 주제 논의, 선행연구 동향 파악, 연구 가능성 검토',
            method: '대면',
            professorComment: '주제 범위 좁히기 필요. 구체적인 연구문제 도출'
        },
        {
            id: 7,
            studentId: '2024002',
            week: 2,
            date: '2025-03-12',
            advisor: '최교수',
            topic: '이론적 배경 구성',
            content: '주요 이론 검토, 개념적 틀 구성, 변인 간 관계 설정',
            method: '비대면',
            professorComment: '이론적 기반 탄탄함. 변인 측정 도구 선정 시작'
        },
        {
            id: 8,
            studentId: '2024002',
            week: 4,
            date: '2025-03-26',
            advisor: '최교수',
            topic: '연구 도구 개발',
            content: '설문지 초안 작성, 타당도 및 신뢰도 확보 방안 논의',
            method: '대면',
            professorComment: '설문 문항 일부 수정 필요. 예비조사 준비'
        }
    ],
    
    // ========== 평가 기준 관리 (독립적 평가표) ==========
    evaluationCriteria: [
        {
            id: 1,
            name: '석사 논문계획서 평가표',
            type: 'thesis_plan',
            description: '범용 연구계획서 평가 기준 (모든 학과 적용 가능)',
            itemCount: 5,
            totalScore: 100,
            passingScore: 70,
            passingCriteria: {
                type: 'complex',
                description: '평균 70점 이상, 최저 60점 이상',
                rules: [
                    {
                        type: 'minimum',
                        value: 60,
                        description: '각 항목 최소 60점 이상 (과락)'
                    },
                    {
                        type: 'average',
                        value: 70,
                        description: '전체 평균 70점 이상'
                    },
                    {
                        type: 'total',
                        value: 70,
                        maxValue: 100,
                        description: '총점 70점 이상 (100점 만점)'
                    }
                ]
            },
            createdDate: '2025-01-10',
            items: [
                {
                    id: 1,
                    name: '연구주제 적절성',
                    score: 20,
                    description: '연구 주제의 명확성 및 타당성'
                },
                {
                    id: 2,
                    name: '연구방법 타당성',
                    score: 30,
                    description: '연구 방법론의 적절성 및 실현가능성'
                },
                {
                    id: 3,
                    name: '선행연구 검토',
                    score: 20,
                    description: '관련 문헌 검토의 충실성'
                },
                {
                    id: 4,
                    name: '연구계획 실현성',
                    score: 15,
                    description: '연구 수행의 현실적 가능성'
                },
                {
                    id: 5,
                    name: '형식 및 체계',
                    score: 15,
                    description: '연구계획서의 형식적 완성도'
                }
            ]
        },
        {
            id: 2,
            name: '박사 논문계획서 평가표',
            type: 'thesis_plan',
            description: '박사 과정 연구계획서 평가 기준',
            itemCount: 6,
            totalScore: 100,
            passingScore: 75,
            passingCriteria: {
                type: 'complex',
                description: '평균 75점 이상, 최저 65점 이상',
                rules: [
                    {
                        type: 'minimum',
                        value: 65,
                        description: '각 항목 최소 65점 이상 (과락)'
                    },
                    {
                        type: 'average',
                        value: 75,
                        description: '전체 평균 75점 이상'
                    },
                    {
                        type: 'total',
                        value: 75,
                        maxValue: 100,
                        description: '총점 75점 이상 (100점 만점)'
                    }
                ]
            },
            createdDate: '2025-01-15',
            items: [
                {
                    id: 1,
                    name: '연구주제 적절성',
                    score: 15,
                    description: '연구 주제의 명확성 및 독창성'
                },
                {
                    id: 2,
                    name: '이론적 기반',
                    score: 25,
                    description: '이론적 배경의 탄탄함'
                },
                {
                    id: 3,
                    name: '연구방법 타당성',
                    score: 20,
                    description: '연구 방법론의 적절성'
                },
                {
                    id: 4,
                    name: '학문적 기여도',
                    score: 20,
                    description: '학문 발전에 대한 기여 가능성'
                },
                {
                    id: 5,
                    name: '선행연구 검토',
                    score: 10,
                    description: '관련 문헌 검토의 충실성'
                },
                {
                    id: 6,
                    name: '형식 및 체계',
                    score: 10,
                    description: '논문의 형식적 완성도'
                }
            ]
        },
        {
            id: 3,
            name: '석사 중간발표 평가표',
            type: 'mid_presentation',
            description: '석사 과정 중간발표 평가 기준',
            itemCount: 5,
            totalScore: 100,
            passingScore: 70,
            passingCriteria: {
                type: 'complex',
                description: '평균 70점 이상, 최저 60점 이상',
                rules: [
                    {
                        type: 'minimum',
                        value: 60,
                        description: '각 항목 최소 60점 이상 (과락)'
                    },
                    {
                        type: 'average',
                        value: 70,
                        description: '전체 평균 70점 이상'
                    },
                    {
                        type: 'total',
                        value: 70,
                        maxValue: 100,
                        description: '총점 70점 이상 (100점 만점)'
                    }
                ]
            },
            createdDate: '2025-01-20',
            items: [
                {
                    id: 1,
                    name: '연구 진행 상황',
                    score: 25,
                    description: '연구 진행 정도 및 계획 대비 달성도'
                },
                {
                    id: 2,
                    name: '발표 내용',
                    score: 25,
                    description: '발표 내용의 명확성 및 논리성'
                },
                {
                    id: 3,
                    name: '자료 분석',
                    score: 20,
                    description: '수집 자료의 분석 적절성'
                },
                {
                    id: 4,
                    name: '발표 태도',
                    score: 15,
                    description: '발표 자세 및 질의응답 능력'
                },
                {
                    id: 5,
                    name: '향후 계획',
                    score: 15,
                    description: '향후 연구 계획의 실현 가능성'
                }
            ]
        },
        {
            id: 4,
            name: '박사 중간발표 평가표',
            type: 'mid_presentation',
            description: '박사 과정 중간발표 평가 기준',
            itemCount: 6,
            totalScore: 100,
            passingScore: 75,
            passingCriteria: '총점 75점 이상',
            createdDate: '2025-01-20',
            items: [
                {
                    id: 1,
                    name: '연구 진행 상황',
                    score: 20,
                    description: '연구 진행 정도 및 계획 대비 달성도'
                },
                {
                    id: 2,
                    name: '발표 내용',
                    score: 20,
                    description: '발표 내용의 명확성 및 논리성'
                },
                {
                    id: 3,
                    name: '자료 분석',
                    score: 20,
                    description: '수집 자료의 분석 적절성'
                },
                {
                    id: 4,
                    name: '학문적 기여도',
                    score: 20,
                    description: '연구의 학문적 기여 가능성'
                },
                {
                    id: 5,
                    name: '발표 태도',
                    score: 10,
                    description: '발표 자세 및 질의응답 능력'
                },
                {
                    id: 6,
                    name: '향후 계획',
                    score: 10,
                    description: '향후 연구 계획의 실현 가능성'
                }
            ]
        },
        {
            id: 5,
            name: '석사 최종심사 평가표',
            type: 'final_thesis',
            description: '석사 과정 최종논문 심사 평가 기준',
            itemCount: 8,
            totalScore: 100,
            passingScore: 80,
            passingCriteria: '총점 80점 이상',
            createdDate: '2025-01-20',
            items: [
                {
                    id: 1,
                    name: '연구문제 명확성',
                    score: 15,
                    description: '연구문제의 명확한 제시'
                },
                {
                    id: 2,
                    name: '이론적 배경',
                    score: 15,
                    description: '이론적 기반의 충실성'
                },
                {
                    id: 3,
                    name: '연구방법 적절성',
                    score: 15,
                    description: '연구 방법의 타당성'
                },
                {
                    id: 4,
                    name: '자료 분석',
                    score: 15,
                    description: '자료 분석의 정확성'
                },
                {
                    id: 5,
                    name: '연구 결과',
                    score: 15,
                    description: '연구 결과의 명확한 제시'
                },
                {
                    id: 6,
                    name: '논의 및 해석',
                    score: 10,
                    description: '결과에 대한 논의의 깊이'
                },
                {
                    id: 7,
                    name: '형식 및 체계',
                    score: 10,
                    description: '논문의 형식적 완성도'
                },
                {
                    id: 8,
                    name: '연구 윤리',
                    score: 5,
                    description: '연구 윤리 준수'
                }
            ]
        },
        {
            id: 6,
            name: '박사 최종심사 평가표',
            type: 'final_thesis',
            description: '박사 과정 최종논문 심사 평가 기준',
            itemCount: 10,
            totalScore: 100,
            passingScore: 85,
            passingCriteria: '총점 85점 이상',
            createdDate: '2025-01-20',
            items: [
                {
                    id: 1,
                    name: '연구문제 명확성',
                    score: 10,
                    description: '연구문제의 명확한 제시'
                },
                {
                    id: 2,
                    name: '이론적 배경',
                    score: 10,
                    description: '이론적 기반의 충실성'
                },
                {
                    id: 3,
                    name: '연구방법 적절성',
                    score: 10,
                    description: '연구 방법의 타당성'
                },
                {
                    id: 4,
                    name: '자료 수집',
                    score: 10,
                    description: '자료 수집의 적절성'
                },
                {
                    id: 5,
                    name: '자료 분석',
                    score: 10,
                    description: '자료 분석의 정확성'
                },
                {
                    id: 6,
                    name: '연구 결과',
                    score: 10,
                    description: '연구 결과의 명확한 제시'
                },
                {
                    id: 7,
                    name: '논의 및 해석',
                    score: 10,
                    description: '결과에 대한 논의의 깊이'
                },
                {
                    id: 8,
                    name: '연구의 의의',
                    score: 15,
                    description: '학문적/실무적 기여도'
                },
                {
                    id: 9,
                    name: '형식 및 체계',
                    score: 10,
                    description: '논문의 형식적 완성도'
                },
                {
                    id: 10,
                    name: '연구 윤리',
                    score: 5,
                    description: '연구 윤리 준수'
                }
            ]
        },
        {
            id: 7,
            name: '학술지 게재 평가표 (기본)',
            type: 'journal',
            description: '학술지 논문 게재 심사 기본 평가표',
            itemCount: 5,
            totalScore: 100,
            passingScore: 70,
            passingCriteria: '총점 70점 이상',
            createdDate: '2025-01-20',
            items: [
                {
                    id: 1,
                    name: '연구 주제',
                    score: 20,
                    description: '연구 주제의 참신성과 중요성'
                },
                {
                    id: 2,
                    name: '연구 방법',
                    score: 25,
                    description: '연구 방법의 타당성'
                },
                {
                    id: 3,
                    name: '연구 결과',
                    score: 25,
                    description: '연구 결과의 신뢰성'
                },
                {
                    id: 4,
                    name: '학술적 기여',
                    score: 20,
                    description: '학문 분야에 대한 기여도'
                },
                {
                    id: 5,
                    name: '논문 완성도',
                    score: 10,
                    description: '논문의 전체적 완성도'
                }
            ]
        },
        {
            id: 8,
            name: '학술지 게재 평가표 (고급)',
            type: 'journal',
            description: '학술지 논문 게재 심사 고급 평가표 (상위 등급 학술지용)',
            itemCount: 7,
            totalScore: 100,
            passingScore: 80,
            passingCriteria: '총점 80점 이상',
            createdDate: '2025-01-20',
            items: [
                {
                    id: 1,
                    name: '연구 주제',
                    score: 15,
                    description: '연구 주제의 참신성과 중요성'
                },
                {
                    id: 2,
                    name: '문헌 검토',
                    score: 15,
                    description: '선행 연구 검토의 충실성'
                },
                {
                    id: 3,
                    name: '연구 방법',
                    score: 20,
                    description: '연구 방법의 타당성과 엄밀성'
                },
                {
                    id: 4,
                    name: '연구 결과',
                    score: 15,
                    description: '연구 결과의 신뢰성'
                },
                {
                    id: 5,
                    name: '논의',
                    score: 15,
                    description: '결과 해석의 깊이'
                },
                {
                    id: 6,
                    name: '학술적 기여',
                    score: 15,
                    description: '학문 분야에 대한 기여도'
                },
                {
                    id: 7,
                    name: '논문 완성도',
                    score: 5,
                    description: '논문의 전체적 완성도'
                }
            ]
        },
        {
            id: 9,
            name: '연구윤리심의 평가표 (Pass/Fail)',
            type: 'passfail',
            description: 'IRB 연구윤리심의 통과/불통과 평가 (인간대상연구 또는 동물실험)',
            itemCount: 6,
            totalScore: null,
            passingScore: null,
            passingCriteria: '모든 항목 Pass',
            createdDate: '2025-01-20',
            items: [
                {
                    id: 1,
                    name: '연구 목적 및 필요성',
                    score: null,
                    evaluationType: 'passfail',
                    description: '연구의 학술적 가치와 사회적 필요성이 명확히 제시되었는가'
                },
                {
                    id: 2,
                    name: '연구 대상자 보호',
                    score: null,
                    evaluationType: 'passfail',
                    description: '연구 대상자의 권리와 안전을 충분히 보호하는 계획이 수립되었는가'
                },
                {
                    id: 3,
                    name: '동의서 및 설명서',
                    score: null,
                    evaluationType: 'passfail',
                    description: '연구 참여 동의서와 설명서가 적절하게 작성되었는가'
                },
                {
                    id: 4,
                    name: '개인정보 보호',
                    score: null,
                    evaluationType: 'passfail',
                    description: '개인정보 수집, 저장, 파기 절차가 관련 법규에 부합하는가'
                },
                {
                    id: 5,
                    name: '위험/이득 평가',
                    score: null,
                    evaluationType: 'passfail',
                    description: '연구로 인한 위험과 이득이 적절히 평가되었는가'
                },
                {
                    id: 6,
                    name: '연구윤리 준수',
                    score: null,
                    evaluationType: 'passfail',
                    description: '연구진실성 및 연구윤리 관련 규정을 준수하는가'
                }
            ]
        },
        {
            id: 10,
            name: '학술대회 포스터발표 평가표 (등급형)',
            type: 'grade',
            description: '5단계 등급 평가 (A/B/C/D/F) - 학술대회 포스터 발표 평가용',
            itemCount: 6,
            totalScore: null,
            passingScore: null,
            passingCriteria: 'C 이상',
            createdDate: '2025-01-20',
            items: [
                {
                    id: 1,
                    name: '포스터 구성',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['A', 'B', 'C', 'D', 'F'],
                    description: '포스터의 전체적인 구성과 시각적 표현 (제목, 서론, 방법, 결과, 결론 구분)'
                },
                {
                    id: 2,
                    name: '연구 내용 명확성',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['A', 'B', 'C', 'D', 'F'],
                    description: '연구 목적, 방법, 결과가 명확하게 제시되었는가'
                },
                {
                    id: 3,
                    name: '연구 방법 적절성',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['A', 'B', 'C', 'D', 'F'],
                    description: '연구 방법론의 타당성과 실행 가능성'
                },
                {
                    id: 4,
                    name: '결과 제시',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['A', 'B', 'C', 'D', 'F'],
                    description: '연구 결과가 그래프, 표 등을 활용하여 명확히 제시되었는가'
                },
                {
                    id: 5,
                    name: '학술적 기여도',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['A', 'B', 'C', 'D', 'F'],
                    description: '연구의 독창성과 학문 분야에 대한 기여 가능성'
                },
                {
                    id: 6,
                    name: '발표 및 질의응답',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['A', 'B', 'C', 'D', 'F'],
                    description: '포스터 설명 능력과 질문에 대한 응답의 적절성'
                }
            ]
        },
        {
            id: 11,
            name: '자격시험 (Pass/Fail)',
            type: 'passfail',
            description: '박사과정 자격시험 통과/불통과 평가',
            itemCount: 3,
            totalScore: null,
            passingScore: null,
            passingCriteria: '모든 과목 Pass',
            createdDate: '2025-01-21',
            items: [
                {
                    id: 1,
                    name: '전공필수 과목',
                    score: null,
                    evaluationType: 'passfail',
                    description: '전공 핵심 영역에 대한 이해도 평가 (Pass/Fail)'
                },
                {
                    id: 2,
                    name: '연구방법론',
                    score: null,
                    evaluationType: 'passfail',
                    description: '연구 설계 및 분석 방법에 대한 이해 평가 (Pass/Fail)'
                },
                {
                    id: 3,
                    name: '외국어',
                    score: null,
                    evaluationType: 'passfail',
                    description: '학술 논문 독해 및 작성 능력 평가 (Pass/Fail)'
                }
            ]
        },
        {
            id: 12,
            name: '연구진행상황 점검표 (등급형)',
            type: 'grade',
            description: '3단계 등급 평가 (우수/보통/미흡) - 정기 연구진행상황 점검용',
            itemCount: 4,
            totalScore: null,
            passingScore: null,
            passingCriteria: '보통 이상',
            createdDate: '2025-01-21',
            items: [
                {
                    id: 1,
                    name: '연구 진척도',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['우수', '보통', '미흡'],
                    description: '계획 대비 연구 진행 정도'
                },
                {
                    id: 2,
                    name: '문헌 조사',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['우수', '보통', '미흡'],
                    description: '선행 연구 검토 및 이론적 배경 정리 상태'
                },
                {
                    id: 3,
                    name: '자료 수집',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['우수', '보통', '미흡'],
                    description: '연구 자료 수집 및 분석 진행 상황'
                },
                {
                    id: 4,
                    name: '지도교수 면담',
                    score: null,
                    evaluationType: 'grade',
                    gradeOptions: ['우수', '보통', '미흡'],
                    description: '지도교수와의 정기적 상담 및 피드백 반영'
                }
            ]
        }
    ],

    // ========== 논문 제목 변경 신청 관리 ==========
    titleChangeRequests: [
        {
            id: 1,
            studentId: '2024001',
            studentName: '김철수',
            major: '교육공학',
            degree: '석사',
            graduate: '일반대학원',
            currentTitle: '인공지능 기반 맞춤형 학습 시스템 연구',
            newTitle: 'AI-driven Personalized Learning System Research',
            language: '영어',
            reason: '국제 학술지 투고를 위해 영어 제목으로 변경이 필요합니다.',
            requestDate: '2025-11-10',
            status: '대기',
            approvedDate: null,
            approvedBy: null
        },
        {
            id: 2,
            studentId: '2024002',
            studentName: '이영희',
            major: '경영학',
            degree: '박사',
            graduate: '일반대학원',
            currentTitle: '디지털 전환 시대의 기업 혁신 전략',
            newTitle: '디지털 트랜스포메이션 시대의 기업 혁신 전략 연구',
            language: '한글',
            reason: '논문 내용을 보다 정확하게 반영하기 위해 제목 수정이 필요합니다.',
            requestDate: '2025-11-08',
            status: '승인',
            approvedDate: '2025-11-09',
            approvedBy: '관리자'
        },
        {
            id: 3,
            studentId: '2024003',
            studentName: '박민수',
            major: '컴퓨터공학',
            degree: '석사',
            graduate: '일반대학원',
            currentTitle: 'Deep Learning을 활용한 이미지 분류',
            newTitle: '딥러닝 기반 이미지 분류 시스템 설계 및 구현',
            language: '한글',
            reason: '심사위원 의견을 반영하여 논문 제목을 보다 구체적으로 수정합니다.',
            requestDate: '2025-11-05',
            status: '대기',
            approvedDate: null,
            approvedBy: null
        }
    ],

    // ========== 주차별 지도 관리 데이터 (교수용과 동일한 구조) ==========
    weeklyGuidance: {
        guidancePairs: [
            {
                id: 1,
                professor: {
                    id: 'prof001',
                    name: '김교수',
                    department: '컴퓨터공학과'
                },
                student: {
                    id: 'S001',
                    name: '김철수',
                    studentId: '2024001',
                    major: '컴퓨터공학',
                    degree: '석사',
                    advisors: [
                        { id: 'prof001', name: '김교수', role: 'primary', department: '컴퓨터공학과' }
                    ]
                },
                semester: '2024-2학기',
                status: 'active',
                totalWeeks: 16,
                completedWeeks: 8,
                lastUpdateDate: '2024-11-10'
            },
            {
                id: 2,
                professor: {
                    id: 'prof002',
                    name: '이교수',
                    department: '경영학과'
                },
                student: {
                    id: 'S002',
                    name: '박영희',
                    studentId: '2024002',
                    major: '경영학',
                    degree: '박사',
                    advisors: [
                        { id: 'prof002', name: '이교수', role: 'primary', department: '경영학과' }
                    ]
                },
                semester: '2024-2학기',
                status: 'active',
                totalWeeks: 16,
                completedWeeks: 12,
                lastUpdateDate: '2024-11-08'
            },
            {
                id: 3,
                professor: {
                    id: 'prof001',
                    name: '김교수',
                    department: '컴퓨터공학과'
                },
                student: {
                    id: 'S003',
                    name: '홍길동',
                    studentId: '2024003',
                    major: '컴퓨터공학',
                    degree: '석사',
                    advisors: [
                        { id: 'prof001', name: '김교수', role: 'primary', department: '컴퓨터공학과' }
                    ]
                },
                semester: '2024-2학기',
                status: 'active',
                totalWeeks: 16,
                completedWeeks: 5,
                lastUpdateDate: '2024-11-05'
            }
        ],
        // 교수용/학생용과 동일한 구조로 변경
        weeklyPlans: {
            1: { // guidancePair id
                plans: [
                    {
                        id: 1,
                        week: 1,
                        plannedDate: '2024-09-01',
                        plannedTopic: '연구 주제 선정',
                        plannedContent: '관심 분야 논의 및 주제 탐색',
                        plannedMethod: 'meeting',
                        advisor: { id: 'prof001', name: '김교수' },
                        executionDate: '2024-09-07',
                        actualMethod: 'meeting',
                        executionContent: '5편의 선행 연구 검토 완료. 다음 주까지 연구 문제 정의 예정',
                        professorComment: '진행 양호. 선행 연구 검토가 충실함',
                        status: 'completed',
                        isPublic: true
                    },
                    {
                        id: 2,
                        week: 2,
                        plannedDate: '2024-09-08',
                        plannedTopic: '연구 문제 정의',
                        plannedContent: '연구 문제 및 가설 설정',
                        plannedMethod: 'meeting',
                        advisor: { id: 'prof001', name: '김교수' },
                        executionDate: '2024-09-14',
                        actualMethod: 'meeting',
                        executionContent: '연구 문제 초안 작성 완료. 선행 연구 분석 진행 중',
                        professorComment: '가설 설정에 추가 논의 필요. 다음 주 보완',
                        status: 'completed',
                        isPublic: true
                    },
                    {
                        id: 3,
                        week: 3,
                        plannedDate: '2024-09-15',
                        plannedTopic: '선행 연구 분석',
                        plannedContent: '주요 선행 연구 심층 분석 및 연구 격차 파악',
                        plannedMethod: 'online',
                        advisor: { id: 'prof001', name: '김교수' },
                        executionDate: null,
                        actualMethod: null,
                        executionContent: null,
                        professorComment: null,
                        status: 'planned',
                        isPublic: true
                    }
                ]
            },
            2: {
                plans: [
                    {
                        id: 4,
                        week: 1,
                        plannedDate: '2024-09-01',
                        plannedTopic: '논문 주제 확정',
                        plannedContent: '경영 전략 분야 주제 선정 및 연구 범위 설정',
                        plannedMethod: 'meeting',
                        advisor: { id: 'prof002', name: '이교수' },
                        executionDate: '2024-09-06',
                        actualMethod: 'meeting',
                        executionContent: '주제 확정 완료. 연구 설계 단계 진입',
                        professorComment: '우수. 주제 선정이 명확하고 적절함',
                        status: 'completed',
                        isPublic: true
                    }
                ]
            },
            3: {
                plans: [
                    {
                        id: 5,
                        week: 1,
                        plannedDate: '2024-09-01',
                        plannedTopic: '기초 개념 학습',
                        plannedContent: '머신러닝 기초 이론 학습 및 실습',
                        plannedMethod: 'meeting',
                        advisor: { id: 'prof001', name: '김교수' },
                        executionDate: null,
                        actualMethod: null,
                        executionContent: null,
                        professorComment: null,
                        status: 'planned',
                        isPublic: true
                    }
                ]
            }
        }
    },

    // 관리자 목록
    administrators: [
        { id: 1, employeeId: 'A2024001', name: '관리자1', department: '교학처', role: 'admin', status: 'active', createdAt: '2024-01-15' },
        { id: 2, employeeId: 'A2024002', name: '관리자2', department: '대학원', role: 'admin', status: 'active', createdAt: '2024-02-01' },
        { id: 3, employeeId: 'A2024003', name: '관리자3', department: 'IT지원팀', role: 'admin', status: 'active', createdAt: '2024-03-10' }
    ],

    // 화면(메뉴) 목록
    screenList: [
        { id: 'dashboard', name: '대시보드', category: '기본' },
        { id: 'researchProposal', name: '연구계획서 제출', category: '제출 현황 관리' },
        { id: 'thesisReview', name: '학위논문 심사 관리', category: '제출 현황 관리' },
        { id: 'journalReview', name: '학술지 심사 관리', category: '제출 현황 관리' },
        { id: 'titleChangeRequests', name: '논문 제목 변경 신청', category: '제출 현황 관리' },
        { id: 'weeklyGuidance', name: '주차별 논문지도 현황', category: '진행 모니터링' },
        { id: 'guidanceProgress', name: '온라인 피드백 현황', category: '진행 모니터링' },
        { id: 'scheduleManagement', name: '논문지도 일정 관리', category: '프로세스 설정' },
        { id: 'requirementManagement', name: '논문 제출 요건 관리', category: '프로세스 설정' },
        { id: 'stageManagement', name: '논문지도 워크플로우 관리', category: '프로세스 설정' },
        { id: 'typeManagement', name: '지도 단계 유형 관리', category: '프로세스 설정' },
        { id: 'evaluationCriteria', name: '평가 기준 관리', category: '프로세스 설정' },
        { id: 'permissionManagement', name: '권한 관리', category: '시스템 설정' }
    ],

    // 관리자별 권한 (관리자 ID와 화면 ID 매핑)
    permissions: [
        // 관리자1 - 모든 권한
        { adminId: 1, screenId: 'dashboard', hasAccess: true },
        { adminId: 1, screenId: 'researchProposal', hasAccess: true },
        { adminId: 1, screenId: 'thesisReview', hasAccess: true },
        { adminId: 1, screenId: 'journalReview', hasAccess: true },
        { adminId: 1, screenId: 'titleChangeRequests', hasAccess: true },
        { adminId: 1, screenId: 'weeklyGuidance', hasAccess: true },
        { adminId: 1, screenId: 'guidanceProgress', hasAccess: true },
        { adminId: 1, screenId: 'scheduleManagement', hasAccess: true },
        { adminId: 1, screenId: 'requirementManagement', hasAccess: true },
        { adminId: 1, screenId: 'stageManagement', hasAccess: true },
        { adminId: 1, screenId: 'typeManagement', hasAccess: true },
        { adminId: 1, screenId: 'evaluationCriteria', hasAccess: true },
        { adminId: 1, screenId: 'permissionManagement', hasAccess: true },

        // 관리자2 - 제출 현황 및 모니터링만
        { adminId: 2, screenId: 'dashboard', hasAccess: true },
        { adminId: 2, screenId: 'researchProposal', hasAccess: true },
        { adminId: 2, screenId: 'thesisReview', hasAccess: true },
        { adminId: 2, screenId: 'journalReview', hasAccess: true },
        { adminId: 2, screenId: 'titleChangeRequests', hasAccess: true },
        { adminId: 2, screenId: 'weeklyGuidance', hasAccess: true },
        { adminId: 2, screenId: 'guidanceProgress', hasAccess: true },
        { adminId: 2, screenId: 'scheduleManagement', hasAccess: false },
        { adminId: 2, screenId: 'requirementManagement', hasAccess: false },
        { adminId: 2, screenId: 'stageManagement', hasAccess: false },
        { adminId: 2, screenId: 'typeManagement', hasAccess: false },
        { adminId: 2, screenId: 'evaluationCriteria', hasAccess: false },
        { adminId: 2, screenId: 'permissionManagement', hasAccess: false },

        // 관리자3 - 대시보드와 모니터링만
        { adminId: 3, screenId: 'dashboard', hasAccess: true },
        { adminId: 3, screenId: 'researchProposal', hasAccess: false },
        { adminId: 3, screenId: 'thesisReview', hasAccess: false },
        { adminId: 3, screenId: 'journalReview', hasAccess: false },
        { adminId: 3, screenId: 'titleChangeRequests', hasAccess: false },
        { adminId: 3, screenId: 'weeklyGuidance', hasAccess: true },
        { adminId: 3, screenId: 'guidanceProgress', hasAccess: true },
        { adminId: 3, screenId: 'scheduleManagement', hasAccess: false },
        { adminId: 3, screenId: 'requirementManagement', hasAccess: false },
        { adminId: 3, screenId: 'stageManagement', hasAccess: false },
        { adminId: 3, screenId: 'typeManagement', hasAccess: false },
        { adminId: 3, screenId: 'evaluationCriteria', hasAccess: false },
        { adminId: 3, screenId: 'permissionManagement', hasAccess: false }
    ],

    // 관리자 검색용 더미 데이터 (교번/이름으로 검색 시 나타날 후보)
    employeeDirectory: [
        { employeeId: 'A2024001', name: '관리자1', department: '교학처', isAdmin: true },
        { employeeId: 'A2024002', name: '관리자2', department: '대학원', isAdmin: true },
        { employeeId: 'A2024003', name: '관리자3', department: 'IT지원팀', isAdmin: true },
        { employeeId: 'A2024004', name: '김직원', department: '교무처', isAdmin: false },
        { employeeId: 'A2024005', name: '이직원', department: '학생처', isAdmin: false },
        { employeeId: 'A2024006', name: '박직원', department: '대학원', isAdmin: false },
        { employeeId: 'P2024001', name: '김교수', department: '교육공학과', isAdmin: false },
        { employeeId: 'P2024002', name: '이교수', department: '경영학과', isAdmin: false }
    ],

    // 대리로그인용 시스템 사용자 목록
    systemUsers: [
        // 교수 목록
        {
            id: 'P2024001',
            type: '교수',
            employeeId: 'P2024001',
            name: '홍길동',
            graduate: '일반대학원',
            department: '교육공학과',
            email: 'hong@hycu.ac.kr',
            loginUrl: '../professor/index.html'
        },
        {
            id: 'P2024002',
            type: '교수',
            employeeId: 'P2024002',
            name: '박교수',
            graduate: '일반대학원',
            department: '경영학과',
            email: 'park@hycu.ac.kr',
            loginUrl: '../professor/index.html'
        },
        {
            id: 'P2024003',
            type: '교수',
            employeeId: 'P2024003',
            name: '김교수',
            graduate: '일반대학원',
            department: '컴퓨터공학과',
            email: 'kim@hycu.ac.kr',
            loginUrl: '../professor/index.html'
        },
        {
            id: 'P2024004',
            type: '교수',
            employeeId: 'P2024004',
            name: '최교수',
            graduate: '일반대학원',
            department: '교육학과',
            email: 'choi@hycu.ac.kr',
            loginUrl: '../professor/index.html'
        },
        {
            id: 'P2024005',
            type: '교수',
            employeeId: 'P2024005',
            name: '이교수',
            graduate: '특수대학원',
            department: '상담심리학과',
            email: 'lee@hycu.ac.kr',
            loginUrl: '../professor/index.html'
        },

        // 학생 목록
        {
            id: 'S2024001',
            type: '학생',
            studentId: '2024001',
            name: '김철수',
            graduate: '일반대학원',
            major: '교육공학',
            degree: '석사',
            email: 'kimcs@student.hycu.ac.kr',
            loginUrl: '../student/index.html'
        },
        {
            id: 'S2024002',
            type: '학생',
            studentId: '2024002',
            name: '이영희',
            graduate: '일반대학원',
            major: '경영학',
            degree: '박사',
            email: 'leeyh@student.hycu.ac.kr',
            loginUrl: '../student/index.html'
        },
        {
            id: 'S2024003',
            type: '학생',
            studentId: '2024003',
            name: '홍길동',
            graduate: '일반대학원',
            major: '컴퓨터공학',
            degree: '석사',
            email: 'honggd@student.hycu.ac.kr',
            loginUrl: '../student/index.html'
        },
        {
            id: 'S2023005',
            type: '학생',
            studentId: '2023005',
            name: '박민수',
            graduate: '일반대학원',
            major: '교육공학',
            degree: '석사',
            email: 'parkms@student.hycu.ac.kr',
            loginUrl: '../student/index.html'
        },
        {
            id: 'S2023010',
            type: '학생',
            studentId: '2023010',
            name: '최지연',
            graduate: '일반대학원',
            major: '경영학',
            degree: '석사',
            email: 'choijy@student.hycu.ac.kr',
            loginUrl: '../student/index.html'
        },
        {
            id: 'S2022008',
            type: '학생',
            studentId: '2022008',
            name: '정태훈',
            graduate: '일반대학원',
            major: '교육공학',
            degree: '박사',
            email: 'jungth@student.hycu.ac.kr',
            loginUrl: '../student/index.html'
        },
        {
            id: 'S2023012',
            type: '학생',
            studentId: '2023012',
            name: '김민지',
            graduate: '일반대학원',
            major: '컴퓨터공학',
            degree: '석사',
            email: 'kimmj@student.hycu.ac.kr',
            loginUrl: '../student/index.html'
        },
        {
            id: 'S2023015',
            type: '학생',
            studentId: '2023015',
            name: '이상민',
            graduate: '특수대학원',
            major: '상담심리학',
            degree: '석사',
            email: 'leesm@student.hycu.ac.kr',
            loginUrl: '../student/index.html'
        }
    ]
};

