// Phase 5: 심사 관리 - Mock Data

// ==================== 현재 사용자 ====================
// 테스트용 현재 로그인 사용자: P003 (김교수)
if (!window.CURRENT_USER) {
    window.CURRENT_USER = {
        id: 'P003',
        name: '김교수',
        department: '인공지능학과',
        email: 'kim@university.ac.kr'
    };
}

// ==================== 평가표 템플릿 (관리자가 등록) ====================
const EVALUATION_TEMPLATES = {
    'TMPL_PROPOSAL': {
        id: 'TMPL_PROPOSAL',
        name: '연구계획서 평가표',
        submissionType: '연구계획서',
        evaluationType: 'score',  // score, passfail, grade
        categories: [
            {
                id: 'CAT001',
                name: '연구 주제의 적절성',
                weight: 20,
                maxScore: 10,
                description: '연구 주제가 학문적으로 가치 있고 현실적으로 수행 가능한가',
                criteria: [
                    '연구의 필요성과 중요성',
                    '연구 범위의 적절성',
                    '선행 연구와의 차별성'
                ]
            },
            {
                id: 'CAT002',
                name: '연구 방법의 타당성',
                weight: 25,
                maxScore: 10,
                description: '연구 방법이 연구 목적에 적합하고 실현 가능한가',
                criteria: [
                    '연구 설계의 논리성',
                    '데이터 수집 방법의 적절성',
                    '분석 방법의 타당성'
                ]
            },
            {
                id: 'CAT003',
                name: '선행연구 검토의 충실성',
                weight: 20,
                maxScore: 10,
                description: '관련 선행연구를 충분히 검토하였는가',
                criteria: [
                    '선행연구 조사의 범위와 깊이',
                    '선행연구 분석의 적절성',
                    '연구 gap 도출의 명확성'
                ]
            },
            {
                id: 'CAT004',
                name: '연구 계획의 구체성',
                weight: 20,
                maxScore: 10,
                description: '연구 수행 계획이 구체적이고 실현 가능한가',
                criteria: [
                    '연구 일정의 구체성',
                    '자원 확보 계획의 현실성',
                    '예상 결과의 명확성'
                ]
            },
            {
                id: 'CAT005',
                name: '형식 및 표현의 적절성',
                weight: 15,
                maxScore: 10,
                description: '문서 형식과 표현이 학술 논문으로 적절한가',
                criteria: [
                    '문서 구성의 체계성',
                    '문장 표현의 명확성',
                    '참고문헌 작성의 정확성'
                ]
            }
        ],
        passingScore: 70,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01'
    },
    'TMPL_MIDTERM': {
        id: 'TMPL_MIDTERM',
        name: '중간논문 평가표',
        submissionType: '중간논문',
        evaluationType: 'score',
        categories: [
            {
                id: 'CAT101',
                name: '연구 진행의 충실성',
                weight: 30,
                maxScore: 10,
                description: '연구가 계획대로 충실히 진행되었는가'
            },
            {
                id: 'CAT102',
                name: '연구 방법의 적절성',
                weight: 25,
                maxScore: 10,
                description: '연구 방법이 적절하게 적용되었는가'
            },
            {
                id: 'CAT103',
                name: '결과 분석의 타당성',
                weight: 25,
                maxScore: 10,
                description: '연구 결과가 타당하게 분석되었는가'
            },
            {
                id: 'CAT104',
                name: '논문 작성의 완성도',
                weight: 20,
                maxScore: 10,
                description: '논문이 체계적으로 작성되었는가'
            }
        ],
        passingScore: 75,
        createdAt: '2025-01-01'
    },
    'TMPL_FINAL': {
        id: 'TMPL_FINAL',
        name: '최종논문 평가표',
        submissionType: '최종논문',
        evaluationType: 'score',
        categories: [
            {
                id: 'CAT201',
                name: '연구의 독창성',
                weight: 25,
                maxScore: 10,
                description: '연구가 독창적이고 새로운 기여를 하는가'
            },
            {
                id: 'CAT202',
                name: '연구 방법의 타당성',
                weight: 20,
                maxScore: 10,
                description: '연구 방법이 타당하고 엄밀한가'
            },
            {
                id: 'CAT203',
                name: '결과 및 고찰의 적절성',
                weight: 25,
                maxScore: 10,
                description: '결과가 적절하게 제시되고 고찰되었는가'
            },
            {
                id: 'CAT204',
                name: '논문의 완성도',
                weight: 20,
                maxScore: 10,
                description: '논문이 완성도 있게 작성되었는가'
            },
            {
                id: 'CAT205',
                name: '학술적 기여도',
                weight: 10,
                maxScore: 10,
                description: '학술적으로 의미 있는 기여를 하는가'
            }
        ],
        passingScore: 80,
        createdAt: '2025-01-01'
    },
    'TMPL_IRB': {
        id: 'TMPL_IRB',
        name: 'IRB 승인 심사',
        submissionType: '연구계획서',
        evaluationType: 'passfail',
        items: [
            {
                id: 'IRB001',
                name: '연구 윤리 준수',
                required: true,
                description: '연구가 연구윤리 규정을 준수하는가'
            },
            {
                id: 'IRB002',
                name: '개인정보 보호 계획',
                required: true,
                description: '개인정보가 적절히 보호되는가'
            },
            {
                id: 'IRB003',
                name: '연구 참여자 동의서',
                required: true,
                description: '참여자 동의서가 적절히 작성되었는가'
            },
            {
                id: 'IRB004',
                name: '위험성 평가',
                required: true,
                description: '연구의 위험성이 적절히 평가되었는가'
            }
        ],
        passingCriteria: 'all',  // all: 모든 항목 Pass, majority: 과반수
        createdAt: '2025-01-01'
    }
};

// ==================== 심사 배정 ====================
const REVIEW_ASSIGNMENTS = [
    {
        id: 'RA001',
        studentId: 'S001',
        studentName: '김철수',
        studentNumber: '2024001',
        graduateSchool: '일반대학원',
        major: '컴퓨터공학과',
        degree: '석사',
        semester: '2',
        semesterOrder: '1',
        studentStatus: '재학',

        submissionId: 'SUB001',
        submissionType: '연구계획서',
        submissionDate: '2024-11-01',
        
        advisorId: 'P001',
        advisorName: '박교수',
        
        thesisTitle: '딥러닝 기반 자연어 처리 모델의 성능 개선 연구',
        thesisFile: 'thesis_kimcs_proposal.pdf',
        
        committee: [
            {
                id: 'C001',
                professorId: 'P002',
                professorName: '이교수',
                role: 'chair',
                department: '컴퓨터공학과',
                assignedDate: '2025-11-05'
            },
            {
                id: 'C002',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-11-05'
            },
            {
                id: 'C003',
                professorId: 'P004',
                professorName: '정교수',
                role: 'member',
                department: '소프트웨어학과',
                assignedDate: '2025-11-05'
            }
        ],
        
        templateId: 'TMPL_PROPOSAL',
        dueDate: '2025-11-20',
        status: '진행중',
        
        createdAt: '2025-11-05 09:00:00'
    },
    {
        id: 'RA002',
        studentId: 'S002',
        studentName: '이영희',
        studentNumber: '2023005',
        graduateSchool: '일반대학원',
        major: '데이터사이언스학과',
        degree: '석사',
        semester: '1',
        semesterOrder: '3',
        studentStatus: '재학',

        submissionId: 'SUB002',
        submissionType: '중간논문',
        copyKiller: 8,
        gptKiller: 12,
        submissionDate: '2024-11-03',
        
        advisorId: 'P005',
        advisorName: '최교수',
        
        thesisTitle: '블록체인 기반 분산 데이터베이스 시스템 설계',
        thesisFile: 'thesis_leeyh_midterm.pdf',
        
        committee: [
            {
                id: 'C004',
                professorId: 'P003',
                professorName: '김교수',
                role: 'chair',
                department: '인공지능학과',
                assignedDate: '2025-11-06'
            },
            {
                id: 'C005',
                professorId: 'P002',
                professorName: '이교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-11-06'
            },
            {
                id: 'C006',
                professorId: 'P006',
                professorName: '한교수',
                role: 'member',
                department: '데이터사이언스학과',
                assignedDate: '2025-11-06'
            }
        ],
        
        templateId: 'TMPL_MIDTERM',
        dueDate: '2025-11-25',
        status: '심사완료',
        
        createdAt: '2025-11-06 10:00:00'
    },
    {
        id: 'RA003',
        studentId: 'S003',
        studentName: '박민수',
        studentNumber: '2022010',
        graduateSchool: '일반대학원',
        major: '컴퓨터공학과',
        degree: '박사',
        semester: '2',
        semesterOrder: '4',
        studentStatus: '수료',

        submissionId: 'SUB003',
        submissionType: '최종논문',
        copyKiller: 5,
        gptKiller: 8,
        submissionDate: '2024-10-28',
        
        advisorId: 'P001',
        advisorName: '박교수',
        
        thesisTitle: 'AI 기반 이미지 분류 시스템의 정확도 향상 연구',
        thesisFile: 'thesis_parkms_final.pdf',
        
        committee: [
            {
                id: 'C007',
                professorId: 'P002',
                professorName: '이교수',
                role: 'chair',
                department: '컴퓨터공학과',
                assignedDate: '2025-10-30'
            },
            {
                id: 'C008',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-10-30'
            },
            {
                id: 'C009',
                professorId: 'P007',
                professorName: '윤교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-10-30'
            },
            {
                id: 'C010',
                professorId: 'P008',
                professorName: '강교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-10-30'
            }
        ],
        
        templateId: 'TMPL_FINAL',
        dueDate: '2025-11-15',
        status: '승인',
        
        createdAt: '2025-10-30 14:00:00'
    },
    {
        id: 'RA004',
        studentId: 'S004',
        studentName: '최서연',
        studentNumber: '2024010',
        graduateSchool: '디자인대학원',
        major: '인공지능학과',
        degree: '석사',
        semester: '1',
        semesterOrder: '2',
        studentStatus: '휴학',
        
        submissionId: 'SUB004',
        submissionType: '연구계획서',
        submissionDate: '2024-11-08',
        
        advisorId: 'P007',
        advisorName: '윤교수',
        
        thesisTitle: '강화학습을 이용한 자율주행 차량 경로 최적화',
        thesisFile: 'thesis_choisy_proposal.pdf',
        
        committee: [
            {
                id: 'C011',
                professorId: 'P003',
                professorName: '김교수',
                role: 'chair',
                department: '인공지능학과',
                assignedDate: '2025-11-09'
            },
            {
                id: 'C012',
                professorId: 'P002',
                professorName: '이교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-11-09'
            },
            {
                id: 'C013',
                professorId: 'P004',
                professorName: '정교수',
                role: 'member',
                department: '소프트웨어학과',
                assignedDate: '2025-11-09'
            }
        ],
        
        templateId: 'TMPL_PROPOSAL',
        dueDate: '2025-11-22',
        status: '진행중',
        
        createdAt: '2025-11-09 11:00:00'
    },
    {
        id: 'RA005',
        studentId: 'S005',
        studentName: '정우진',
        studentNumber: '2023015',
        major: '소프트웨어학과',
        degree: '박사',
        
        submissionId: 'SUB005',
        submissionType: '중간논문',
        copyKiller: 12,
        gptKiller: 10,
        submissionDate: '2025-10-25',
        
        advisorId: 'P004',
        advisorName: '정교수',
        
        thesisTitle: '마이크로서비스 아키텍처 기반 클라우드 네이티브 애플리케이션 설계',
        thesisFile: 'thesis_jeongwj_midterm.pdf',
        
        committee: [
            {
                id: 'C014',
                professorId: 'P002',
                professorName: '이교수',
                role: 'chair',
                department: '컴퓨터공학과',
                assignedDate: '2025-10-27'
            },
            {
                id: 'C015',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-10-27'
            },
            {
                id: 'C016',
                professorId: 'P004',
                professorName: '정교수',
                role: 'member',
                department: '소프트웨어학과',
                assignedDate: '2025-10-27'
            }
        ],
        
        templateId: 'TMPL_MIDTERM',
        dueDate: '2025-11-18',
        status: '진행중',
        
        createdAt: '2025-10-27 09:30:00'
    },
    {
        id: 'RA006',
        studentId: 'S006',
        studentName: '강민지',
        studentNumber: '2022008',
        major: '데이터사이언스학과',
        degree: '박사',
        
        submissionId: 'SUB006',
        submissionType: '최종논문',
        copyKiller: 7,
        gptKiller: 9,
        submissionDate: '2025-10-20',
        
        advisorId: 'P006',
        advisorName: '한교수',
        
        thesisTitle: '빅데이터 분석을 통한 소비자 행동 예측 모델 개발',
        thesisFile: 'thesis_kangmj_final.pdf',
        
        committee: [
            {
                id: 'C017',
                professorId: 'P003',
                professorName: '김교수',
                role: 'chair',
                department: '인공지능학과',
                assignedDate: '2025-10-22'
            },
            {
                id: 'C018',
                professorId: 'P002',
                professorName: '이교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-10-22'
            },
            {
                id: 'C019',
                professorId: 'P006',
                professorName: '한교수',
                role: 'member',
                department: '데이터사이언스학과',
                assignedDate: '2025-10-22'
            },
            {
                id: 'C020',
                professorId: 'P007',
                professorName: '윤교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-10-22'
            }
        ],
        
        templateId: 'TMPL_FINAL',
        dueDate: '2025-11-12',
        status: '심사완료',
        
        createdAt: '2025-10-22 15:20:00'
    },
    {
        id: 'RA007',
        studentId: 'S007',
        studentName: '송지훈',
        studentNumber: '2024020',
        major: '컴퓨터공학과',
        degree: '석사',
        
        submissionId: 'SUB007',
        submissionType: '연구계획서',
        submissionDate: '2025-11-10',
        
        advisorId: 'P002',
        advisorName: '이교수',
        
        thesisTitle: '사물인터넷 환경에서의 경량화 보안 프로토콜 설계',
        thesisFile: 'thesis_songjh_proposal.pdf',
        
        committee: [
            {
                id: 'C021',
                professorId: 'P002',
                professorName: '이교수',
                role: 'chair',
                department: '컴퓨터공학과',
                assignedDate: '2025-11-11'
            },
            {
                id: 'C022',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-11-11'
            },
            {
                id: 'C023',
                professorId: 'P008',
                professorName: '강교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-11-11'
            }
        ],
        
        templateId: 'TMPL_PROPOSAL',
        dueDate: '2025-11-28',
        status: '진행중',
        
        createdAt: '2025-11-11 10:15:00'
    },
    {
        id: 'RA008',
        studentId: 'S008',
        studentName: '한예슬',
        studentNumber: '2023025',
        major: '인공지능학과',
        degree: '박사',
        
        submissionId: 'SUB008',
        submissionType: '중간논문',
        copyKiller: 15,
        gptKiller: 18,
        submissionDate: '2025-10-18',
        
        advisorId: 'P003',
        advisorName: '김교수',
        
        thesisTitle: '생성적 적대 신경망을 활용한 의료 영상 데이터 증강',
        thesisFile: 'thesis_hanys_midterm.pdf',
        
        committee: [
            {
                id: 'C024',
                professorId: 'P003',
                professorName: '김교수',
                role: 'chair',
                department: '인공지능학과',
                assignedDate: '2025-10-20'
            },
            {
                id: 'C025',
                professorId: 'P002',
                professorName: '이교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-10-20'
            },
            {
                id: 'C026',
                professorId: 'P007',
                professorName: '윤교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-10-20'
            }
        ],
        
        templateId: 'TMPL_MIDTERM',
        dueDate: '2025-11-10',
        status: '보류',
        
        createdAt: '2025-10-20 14:45:00'
    },
    {
        id: 'RA009',
        studentId: 'S009',
        studentName: '윤성호',
        studentNumber: '2022018',
        major: '소프트웨어학과',
        degree: '박사',
        
        submissionId: 'SUB009',
        submissionType: '최종논문',
        copyKiller: 22,
        gptKiller: 25,
        submissionDate: '2025-10-15',
        
        advisorId: 'P004',
        advisorName: '정교수',
        
        thesisTitle: '함수형 프로그래밍 패러다임을 적용한 대규모 시스템 개발',
        thesisFile: 'thesis_yoonsh_final.pdf',
        
        committee: [
            {
                id: 'C027',
                professorId: 'P004',
                professorName: '정교수',
                role: 'chair',
                department: '소프트웨어학과',
                assignedDate: '2025-10-17'
            },
            {
                id: 'C028',
                professorId: 'P002',
                professorName: '이교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-10-17'
            },
            {
                id: 'C029',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-10-17'
            },
            {
                id: 'C030',
                professorId: 'P006',
                professorName: '한교수',
                role: 'member',
                department: '데이터사이언스학과',
                assignedDate: '2025-10-17'
            }
        ],
        
        templateId: 'TMPL_FINAL',
        dueDate: '2025-11-08',
        status: '반려',
        
        createdAt: '2025-10-17 11:30:00'
    },
    {
        id: 'RA010',
        studentId: 'S010',
        studentName: '임하은',
        studentNumber: '2024030',
        major: '데이터사이언스학과',
        degree: '석사',
        
        submissionId: 'SUB010',
        submissionType: '연구계획서',
        submissionDate: '2025-11-05',
        
        advisorId: 'P006',
        advisorName: '한교수',
        
        thesisTitle: '시계열 데이터 분석을 통한 주식 가격 예측 모델 연구',
        thesisFile: 'thesis_limhe_proposal.pdf',
        
        committee: [
            {
                id: 'C031',
                professorId: 'P006',
                professorName: '한교수',
                role: 'chair',
                department: '데이터사이언스학과',
                assignedDate: '2025-11-07'
            },
            {
                id: 'C032',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-11-07'
            },
            {
                id: 'C033',
                professorId: 'P007',
                professorName: '윤교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-11-07'
            }
        ],
        
        templateId: 'TMPL_PROPOSAL',
        dueDate: '2025-11-19',
        status: '진행중',
        
        createdAt: '2025-11-07 09:45:00'
    }
];

// ==================== 심사 평가 ====================
const REVIEW_EVALUATIONS = [
    // RA002 (이영희 - 중간논문) - 완료된 평가들
    {
        id: 'EVAL001',
        assignmentId: 'RA002',
        committeeId: 'C004',
        professorId: 'P003',
        professorName: '김교수',
        role: 'chair',
        
        scores: [
            {
                categoryId: 'CAT101',
                categoryName: '연구 진행의 충실성',
                score: 9,
                maxScore: 10,
                weight: 30,
                comment: '연구가 계획대로 충실히 진행됨'
            },
            {
                categoryId: 'CAT102',
                categoryName: '연구 방법의 적절성',
                score: 8,
                maxScore: 10,
                weight: 25,
                comment: '연구 방법이 적절하게 적용됨'
            },
            {
                categoryId: 'CAT103',
                categoryName: '결과 분석의 타당성',
                score: 8,
                maxScore: 10,
                weight: 25,
                comment: '분석 결과가 타당함'
            },
            {
                categoryId: 'CAT104',
                categoryName: '논문 작성의 완성도',
                score: 9,
                maxScore: 10,
                weight: 20,
                comment: '논문 작성이 우수함'
            }
        ],
        
        totalScore: 85,
        
        overallComment: {
            strengths: '연구 진행이 매우 충실하며, 결과 도출이 우수함',
            improvements: '결과 분석 부분을 좀 더 심화할 필요 있음',
            conclusion: '전반적으로 우수한 연구. 최종 논문으로 발전 가능성 높음'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-15 14:30:00',
        createdAt: '2025-11-10 10:00:00'
    },
    {
        id: 'EVAL002',
        assignmentId: 'RA002',
        committeeId: 'C005',
        professorId: 'P002',
        professorName: '이교수',
        role: 'member',
        
        scores: [
            {
                categoryId: 'CAT101',
                score: 8,
                weight: 30,
                comment: '연구 진행 상태 양호'
            },
            {
                categoryId: 'CAT102',
                score: 9,
                weight: 25,
                comment: '방법론이 우수함'
            },
            {
                categoryId: 'CAT103',
                score: 7,
                weight: 25,
                comment: '분석 심화 필요'
            },
            {
                categoryId: 'CAT104',
                score: 8,
                weight: 20,
                comment: '작성 수준 양호'
            }
        ],
        
        totalScore: 80,
        
        overallComment: {
            strengths: '연구 방법론이 탄탄함',
            improvements: '결과 분석을 더 깊이 있게 진행 필요',
            conclusion: '합격 수준. 지적사항 보완 필요'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-16 16:20:00'
    },
    {
        id: 'EVAL003',
        assignmentId: 'RA002',
        committeeId: 'C006',
        professorId: 'P006',
        professorName: '한교수',
        role: 'member',
        
        scores: [
            {
                categoryId: 'CAT101',
                score: 9,
                weight: 30
            },
            {
                categoryId: 'CAT102',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT103',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT104',
                score: 9,
                weight: 20
            }
        ],
        
        totalScore: 85,
        
        overallComment: {
            strengths: '전반적으로 우수한 연구',
            improvements: '일부 표현 개선 필요',
            conclusion: '합격 수준'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-14 18:45:00'
    },
    
    // RA003 (박민수 - 최종논문) - 완료된 평가들
    {
        id: 'EVAL004',
        assignmentId: 'RA003',
        committeeId: 'C007',
        professorId: 'P002',
        professorName: '이교수',
        role: 'chair',
        
        scores: [
            {
                categoryId: 'CAT201',
                score: 8,
                weight: 25,
                comment: '독창성 우수'
            },
            {
                categoryId: 'CAT202',
                score: 9,
                weight: 20,
                comment: '방법론 탁월'
            },
            {
                categoryId: 'CAT203',
                score: 8,
                weight: 25,
                comment: '결과 해석 적절'
            },
            {
                categoryId: 'CAT204',
                score: 9,
                weight: 20,
                comment: '완성도 높음'
            },
            {
                categoryId: 'CAT205',
                score: 8,
                weight: 10,
                comment: '학술적 기여 있음'
            }
        ],
        
        totalScore: 84,
        
        overallComment: {
            strengths: '연구의 독창성과 완성도가 뛰어남',
            improvements: '일부 참고문헌 보완 필요',
            conclusion: '우수한 최종논문. 학위 수여 권장'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-03 10:00:00'
    },
    {
        id: 'EVAL005',
        assignmentId: 'RA003',
        committeeId: 'C008',
        professorId: 'P003',
        professorName: '김교수',
        role: 'member',
        
        scores: [
            {
                categoryId: 'CAT201',
                score: 9,
                weight: 25
            },
            {
                categoryId: 'CAT202',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT203',
                score: 9,
                weight: 25
            },
            {
                categoryId: 'CAT204',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT205',
                score: 9,
                weight: 10
            }
        ],
        
        totalScore: 86,
        
        overallComment: {
            strengths: '매우 우수한 연구 성과',
            improvements: '없음',
            conclusion: '학위 수여 적극 권장'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-04 14:20:00'
    },
    {
        id: 'EVAL006',
        assignmentId: 'RA003',
        committeeId: 'C009',
        professorId: 'P007',
        professorName: '윤교수',
        role: 'member',
        
        scores: [
            {
                categoryId: 'CAT201',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT202',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT203',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT204',
                score: 9,
                weight: 20
            },
            {
                categoryId: 'CAT205',
                score: 8,
                weight: 10
            }
        ],
        
        totalScore: 82,
        
        overallComment: {
            strengths: '논문 완성도가 매우 높음',
            improvements: '실험 결과 추가 검증 필요',
            conclusion: '합격 권장'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-05 11:30:00'
    },
    {
        id: 'EVAL007',
        assignmentId: 'RA003',
        committeeId: 'C010',
        professorId: 'P008',
        professorName: '강교수',
        role: 'member',
        
        scores: [
            {
                categoryId: 'CAT201',
                score: 9,
                weight: 25
            },
            {
                categoryId: 'CAT202',
                score: 9,
                weight: 20
            },
            {
                categoryId: 'CAT203',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT204',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT205',
                score: 9,
                weight: 10
            }
        ],
        
        totalScore: 86,
        
        overallComment: {
            strengths: '연구 독창성과 기여도 높음',
            improvements: '없음',
            conclusion: '우수한 논문. 합격'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-06 16:45:00'
    },
    
    // RA006 (강민지 - 최종논문) - 심사완료
    {
        id: 'EVAL008',
        assignmentId: 'RA006',
        committeeId: 'C017',
        professorId: 'P003',
        professorName: '김교수',
        role: 'chair',
        
        scores: [
            {
                categoryId: 'CAT201',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT202',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT203',
                score: 9,
                weight: 25
            },
            {
                categoryId: 'CAT204',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT205',
                score: 8,
                weight: 10
            }
        ],
        
        totalScore: 82,
        
        overallComment: {
            strengths: '데이터 분석 방법론이 우수함',
            improvements: '결론 부분 보강 필요',
            conclusion: '합격 권장'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-01 14:00:00'
    },
    {
        id: 'EVAL009',
        assignmentId: 'RA006',
        committeeId: 'C018',
        professorId: 'P002',
        professorName: '이교수',
        role: 'member',
        
        scores: [
            {
                categoryId: 'CAT201',
                score: 9,
                weight: 25
            },
            {
                categoryId: 'CAT202',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT203',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT204',
                score: 9,
                weight: 20
            },
            {
                categoryId: 'CAT205',
                score: 8,
                weight: 10
            }
        ],
        
        totalScore: 84,
        
        overallComment: {
            strengths: '실용적 가치가 높은 연구',
            improvements: '이론적 배경 보완',
            conclusion: '합격'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-02 10:30:00'
    },
    {
        id: 'EVAL010',
        assignmentId: 'RA006',
        committeeId: 'C019',
        professorId: 'P006',
        professorName: '한교수',
        role: 'member',
        
        scores: [
            {
                categoryId: 'CAT201',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT202',
                score: 9,
                weight: 20
            },
            {
                categoryId: 'CAT203',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT204',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT205',
                score: 9,
                weight: 10
            }
        ],
        
        totalScore: 83,
        
        overallComment: {
            strengths: '데이터 분석이 탁월함',
            improvements: '없음',
            conclusion: '합격'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-02 15:20:00'
    },
    {
        id: 'EVAL011',
        assignmentId: 'RA006',
        committeeId: 'C020',
        professorId: 'P007',
        professorName: '윤교수',
        role: 'member',
        
        scores: [
            {
                categoryId: 'CAT201',
                score: 8,
                weight: 25
            },
            {
                categoryId: 'CAT202',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT203',
                score: 9,
                weight: 25
            },
            {
                categoryId: 'CAT204',
                score: 8,
                weight: 20
            },
            {
                categoryId: 'CAT205',
                score: 8,
                weight: 10
            }
        ],
        
        totalScore: 82,
        
        overallComment: {
            strengths: '우수한 연구',
            improvements: '없음',
            conclusion: '합격'
        },
        
        status: '제출완료',
        submittedAt: '2025-11-03 09:15:00'
    }
];

// ==================== 심사 결과 ====================
const REVIEW_RESULTS = [
    {
        id: 'RESULT001',
        assignmentId: 'RA002',
        
        evaluations: ['EVAL001', 'EVAL002', 'EVAL003'],
        
        averageScore: 83.3,
        
        systemDecision: '합격',
        systemDecisionReason: '평균 점수 83.3점으로 합격 기준 75점 이상',
        
        chairDecision: '승인',
        chairComment: '모든 심사위원의 평가가 우수함. 지적사항 보완 후 최종 논문 진행 승인',
        chairDecidedAt: '2025-11-17 16:00:00',
        chairDecidedBy: 'P003',
        
        finalDecision: '합격',
        
        notifiedAt: '2025-11-17 16:05:00',
        
        createdAt: '2025-11-17 15:00:00'
    }
];

// ==================== Service ====================
class ReviewService {
    // 현재 로그인한 교수 정보 (CURRENT_USER 사용)
    static getCurrentProfessorId() {
        return window.CURRENT_USER ? window.CURRENT_USER.id : 'P002';
    }
    
    // 내게 배정된 심사 목록 조회
    static getMyReviewAssignments() {
        const currentProfId = this.getCurrentProfessorId();
        
        return REVIEW_ASSIGNMENTS.filter(assignment => {
            return assignment.committee.some(member => member.professorId === currentProfId);
        }).map(assignment => {
            // 내 역할 찾기
            const myRole = assignment.committee.find(m => m.professorId === currentProfId);
            
            // 심사 진행 상황
            const evaluations = REVIEW_EVALUATIONS.filter(e => e.assignmentId === assignment.id);
            const totalMembers = assignment.committee.length;
            const completedCount = evaluations.filter(e => e.status === '제출완료').length;
            
            return {
                ...assignment,
                myRole: myRole.role,
                myCommitteeId: myRole.id,
                evaluationProgress: `${completedCount}/${totalMembers}`,
                isCompleted: completedCount === totalMembers
            };
        });
    }
    
    // 심사 상세 정보 조회
    static getReviewDetail(assignmentId) {
        const assignment = REVIEW_ASSIGNMENTS.find(a => a.id === assignmentId);
        if (!assignment) return null;
        
        const currentProfId = this.getCurrentProfessorId();
        const myRole = assignment.committee.find(m => m.professorId === currentProfId);
        
        // 평가표 템플릿
        const template = EVALUATION_TEMPLATES[assignment.templateId];
        
        // 내 평가
        const myEvaluation = REVIEW_EVALUATIONS.find(e => 
            e.assignmentId === assignmentId && e.professorId === currentProfId
        );
        
        // 모든 평가 (위원장만)
        const allEvaluations = myRole.role === 'chair' 
            ? REVIEW_EVALUATIONS.filter(e => e.assignmentId === assignmentId)
            : [];
        
        // 심사 결과
        const result = REVIEW_RESULTS.find(r => r.assignmentId === assignmentId);
        
        return {
            assignment,
            myRole: myRole.role,
            myCommitteeId: myRole.id,
            template,
            myEvaluation,
            allEvaluations,
            result
        };
    }
    
    // 평가 저장
    static saveEvaluation(assignmentId, committeeId, data) {
        const existingIndex = REVIEW_EVALUATIONS.findIndex(e => 
            e.assignmentId === assignmentId && e.committeeId === committeeId
        );
        
        if (existingIndex >= 0) {
            REVIEW_EVALUATIONS[existingIndex] = {
                ...REVIEW_EVALUATIONS[existingIndex],
                ...data,
                updatedAt: new Date().toISOString()
            };
        } else {
            REVIEW_EVALUATIONS.push({
                id: `EVAL${Date.now()}`,
                assignmentId,
                committeeId,
                ...data,
                createdAt: new Date().toISOString()
            });
        }
        
        return true;
    }
    
    // 평가 제출
    static submitEvaluation(assignmentId, committeeId) {
        const evaluation = REVIEW_EVALUATIONS.find(e => 
            e.assignmentId === assignmentId && e.committeeId === committeeId
        );
        
        if (evaluation) {
            evaluation.status = '제출완료';
            evaluation.submittedAt = new Date().toISOString();
            return true;
        }
        
        return false;
    }
    
    // 심사위원장 최종 결정
    static submitChairDecision(assignmentId, decision, comment) {
        const existingResult = REVIEW_RESULTS.find(r => r.assignmentId === assignmentId);
        
        const resultData = {
            chairDecision: decision,
            chairComment: comment,
            chairDecidedAt: new Date().toISOString(),
            chairDecidedBy: this.getCurrentProfessorId(),
            finalDecision: decision === '승인' ? existingResult.systemDecision : decision,
            notifiedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (existingResult) {
            Object.assign(existingResult, resultData);
        } else {
            REVIEW_RESULTS.push({
                id: `RESULT${Date.now()}`,
                assignmentId,
                ...resultData,
                createdAt: new Date().toISOString()
            });
        }
        
        // 심사 상태 업데이트
        const assignment = REVIEW_ASSIGNMENTS.find(a => a.id === assignmentId);
        if (assignment) {
            assignment.status = decision === '승인' ? '승인' : (decision === '보류' ? '보류' : '반려');
        }
        
        return true;
    }
}

// Export
window.ReviewService = ReviewService;
window.EVALUATION_TEMPLATES = EVALUATION_TEMPLATES;
window.REVIEW_ASSIGNMENTS = REVIEW_ASSIGNMENTS;
window.REVIEW_EVALUATIONS = REVIEW_EVALUATIONS;
window.REVIEW_RESULTS = REVIEW_RESULTS;
