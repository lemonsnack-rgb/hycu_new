// Phase 5: 심사 관리 - Mock Data

// ==================== 현재 사용자 ====================
// 테스트용 현재 로그인 사용자: P002 (이교수) - 위원장 권한으로 재심 결정 테스트
if (!window.CURRENT_USER) {
    window.CURRENT_USER = {
        id: 'P002',
        name: '이교수',
        department: '컴퓨터공학과',
        email: 'lee@university.ac.kr'
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
    },
    'TMPL_RUBRIC': {
        id: 'TMPL_RUBRIC',
        name: '척도형 평가표',
        submissionType: '연구계획서',
        evaluationType: 'rubric',
        items: [
            {
                id: 'RUB001',
                name: '연구 주제의 명확성',
                description: '연구 주제가 명확하게 정의되고 연구 범위가 적절한가'
            },
            {
                id: 'RUB002',
                name: '연구 방법론의 적절성',
                description: '연구 목적에 부합하는 연구 방법론이 선택되었는가'
            },
            {
                id: 'RUB003',
                name: '선행연구 검토의 충실성',
                description: '관련 선행연구를 충분히 검토하고 연구 gap을 파악하였는가'
            },
            {
                id: 'RUB004',
                name: '연구 계획의 실현가능성',
                description: '제시된 연구 계획이 실제로 수행 가능한가'
            }
        ],
        scaleLabels: ['매우 아니다', '아니다', '보통', '그렇다', '매우 그렇다'],
        autoCalculate: false,
        requiresChairDecision: true,
        createdAt: '2025-01-27'
    },
    'TMPL_DESCRIPTIVE': {
        id: 'TMPL_DESCRIPTIVE',
        name: '서술형 평가표',
        submissionType: '중간논문',
        evaluationType: 'descriptive',
        items: [
            {
                id: 'DESC001',
                name: '연구 진행 상황',
                description: '연구가 계획대로 진행되고 있는지 평가'
            },
            {
                id: 'DESC002',
                name: '연구 결과의 타당성',
                description: '도출된 연구 결과가 타당하고 신뢰할 수 있는지 평가'
            },
            {
                id: 'DESC003',
                name: '논문 작성 수준',
                description: '논문의 구성과 표현이 학술적 기준에 부합하는지 평가'
            }
        ],
        autoCalculate: false,
        requiresChairDecision: true,
        createdAt: '2025-01-27'
    },
    'TMPL_PASSFAIL': {
        id: 'TMPL_PASSFAIL',
        name: 'IRB 심사 평가표',
        type: '공통',
        description: 'IRB 연구윤리심사 평가표 (Pass/Fail 방식)',
        evaluationType: 'passfail',
        items: [
            {
                id: 'IRB001',
                name: '연구윤리 준수',
                description: '연구 계획이 연구윤리 규정을 준수하는가?',
                weight: 0
            },
            {
                id: 'IRB002',
                name: '피험자 보호',
                description: '연구 참여자의 안전과 권리가 적절히 보호되는가?',
                weight: 0
            },
            {
                id: 'IRB003',
                name: '위험/이익 평가',
                description: '연구의 위험과 이익이 적절히 평가되었는가?',
                weight: 0
            }
        ],
        passCriteria: {
            type: 'all_pass',
            description: '모든 항목이 Pass여야 최종 승인',
            requiresChairDecision: true
        }
    }
};

// ==================== 심사 배정 ====================
const REVIEW_ASSIGNMENTS = [
    {
        id: 'RA001',
        studentId: 'S001',
        studentName: '김철수',
        studentNumber: '2024001',
        major: '컴퓨터공학과',
        degree: '석사',
        
        submissionId: 'SUB001',
        submissionType: '연구계획서',
        submissionDate: '2025-11-01',
        
        advisorId: 'P001',
        advisorName: '박교수',
        
        thesisTitle: '딥러닝 기반 자연어 처리 모델의 성능 개선 연구',
        thesisFile: 'thesis_kimcs_proposal.pdf',
        otherFile: 'thesis_kimcs_proposal_appendix.pdf',
        
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
        major: '데이터사이언스학과',
        degree: '석사',
        
        submissionId: 'SUB002',
        submissionType: '중간논문',
        copyKiller: 8,
        gptKiller: 12,
        submissionDate: '2025-11-03',
        
        advisorId: 'P005',
        advisorName: '최교수',
        
        thesisTitle: '블록체인 기반 분산 데이터베이스 시스템 설계',
        thesisFile: 'thesis_leeyh_midterm.pdf',
        otherFile: 'thesis_leeyh_midterm_supplement.pdf',
        
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
        major: '컴퓨터공학과',
        degree: '박사',
        
        submissionId: 'SUB003',
        submissionType: '최종논문',
        copyKiller: 5,
        gptKiller: 8,
        submissionDate: '2025-10-28',
        
        advisorId: 'P001',
        advisorName: '박교수',
        
        thesisTitle: 'AI 기반 이미지 분류 시스템의 정확도 향상 연구',
        thesisFile: 'thesis_parkms_final.pdf',
        otherFile: 'thesis_parkms_final_references.pdf',
        
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
        major: '인공지능학과',
        degree: '석사',
        
        submissionId: 'SUB004',
        submissionType: '연구계획서',
        submissionDate: '2025-11-08',
        
        advisorId: 'P007',
        advisorName: '윤교수',
        
        thesisTitle: '강화학습을 이용한 자율주행 차량 경로 최적화',
        thesisFile: 'thesis_choisy_proposal.pdf',
        otherFile: 'thesis_choisy_proposal_data.pdf',
        
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
        otherFile: 'thesis_jeongwj_midterm_charts.pdf',
        
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
    },
    // ==================== 척도형 평가표 사용 심사 ====================
    {
        id: 'RA_RUBRIC_001',
        studentId: 'S011',
        studentName: '이서연',
        studentNumber: '2024005',
        major: '컴퓨터공학과',
        degree: '석사',

        submissionId: 'SUB_RUBRIC_001',
        submissionType: '연구계획서',
        submissionDate: '2025-11-10',

        advisorId: 'P001',
        advisorName: '박교수',

        thesisTitle: '딥러닝 기반 음성 합성 시스템 연구',
        thesisFile: {
            name: '이서연_연구계획서_v3.pdf',
            size: 2845000,
            uploadedAt: '2025-11-10 14:30:00'
        },

        copyKillerScore: 92,
        gptKillerScore: 88,

        committee: [
            {
                id: 'C017',
                professorId: 'P002',
                professorName: '이교수',
                role: 'chair',
                department: '전자공학과',
                assignedDate: '2025-11-10'
            },
            {
                id: 'C018',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-11-10'
            },
            {
                id: 'C019',
                professorId: 'P003',
                professorName: '최교수',
                role: 'member',
                department: '컴퓨터공학과',
                assignedDate: '2025-11-10'
            }
        ],

        templateId: 'TMPL_RUBRIC',  // 척도형 평가표 사용
        dueDate: '2025-11-20',
        status: '진행중',

        createdAt: '2025-11-10 10:00:00'
    },
    // ==================== 서술형 평가표 사용 심사 ====================
    {
        id: 'RA_DESCRIPTIVE_001',
        studentId: 'S012',
        studentName: '강민준',
        studentNumber: '2024006',
        major: '경영학과',
        degree: '박사',

        submissionId: 'SUB_DESCRIPTIVE_001',
        submissionType: '중간논문',
        submissionDate: '2025-11-12',

        advisorId: 'P004',
        advisorName: '김교수',

        thesisTitle: '디지털 전환 시대의 조직 혁신 전략 연구',
        thesisFile: {
            name: '강민준_중간논문_v2.pdf',
            size: 3120000,
            uploadedAt: '2025-11-12 16:45:00'
        },

        copyKillerScore: 95,
        gptKillerScore: 91,

        committee: [
            {
                id: 'C020',
                professorId: 'P002',
                professorName: '이교수',
                role: 'chair',
                department: '전자공학과',
                assignedDate: '2025-11-12'
            },
            {
                id: 'C021',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-11-12'
            },
            {
                id: 'C022',
                professorId: 'P005',
                professorName: '정교수',
                role: 'member',
                department: '경영학과',
                assignedDate: '2025-11-12'
            }
        ],

        templateId: 'TMPL_DESCRIPTIVE',  // 서술형 평가표 사용
        dueDate: '2025-11-25',
        status: '진행중',

        createdAt: '2025-11-12 11:00:00'
    },

    // ==================== Pass/Fail형 평가표 사용 심사 ====================
    {
        id: 'RA_PASSFAIL_001',
        studentId: 'S013',
        studentName: '박지훈',
        studentNumber: '2024007',
        major: '생명과학과',
        degree: '석사',

        submissionId: 'SUB_PASSFAIL_001',
        submissionType: '연구계획서',
        submissionDate: '2025-11-14',

        advisorId: 'P007',
        advisorName: '최교수',

        thesisTitle: 'CRISPR 기반 유전자 편집 기술의 윤리적 고찰',
        thesisFile: {
            name: '박지훈_연구계획서_IRB.pdf',
            size: 1850000,
            uploadedAt: '2025-11-14 13:20:00'
        },

        copyKillerScore: 97,
        gptKillerScore: 94,

        committee: [
            {
                id: 'C023',
                professorId: 'P002',
                professorName: '이교수',
                role: 'chair',
                department: '전자공학과',
                assignedDate: '2025-11-14'
            },
            {
                id: 'C024',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-11-14'
            },
            {
                id: 'C025',
                professorId: 'P008',
                professorName: '윤교수',
                role: 'member',
                department: '생명과학과',
                assignedDate: '2025-11-14'
            }
        ],

        templateId: 'TMPL_PASSFAIL',  // Pass/Fail형 평가표 사용
        dueDate: '2025-11-28',
        status: '진행중',

        createdAt: '2025-11-14 09:30:00'
    },
    {
        id: 'RA_TEST_CHAIR',
        studentId: 'S_TEST',
        studentName: '재심테스트',
        studentNumber: '2024999',
        major: '컴퓨터공학과',
        degree: '석사',

        submissionId: 'SUB_TEST',
        submissionType: '본심사',
        copyKiller: 95,
        gptKiller: 93,
        submissionDate: '2025-11-20',

        advisorId: 'P001',
        advisorName: '박교수',

        thesisTitle: '빅데이터 분석을 통한 소비자 행동 예측 모델 개발 (테스트:위원장재심결정대기)',
        thesisFile: {
            name: '재심테스트_본심사_v1.pdf',
            size: 3850000,
            uploadedAt: '2025-11-20 15:30:00'
        },

        committee: [
            {
                id: 'C_TEST_001',
                professorId: 'P002',
                professorName: '이교수',
                role: 'chair',
                department: '컴퓨터공학과',
                assignedDate: '2025-11-21'
            },
            {
                id: 'C_TEST_002',
                professorId: 'P003',
                professorName: '김교수',
                role: 'member',
                department: '인공지능학과',
                assignedDate: '2025-11-21'
            },
            {
                id: 'C_TEST_003',
                professorId: 'P004',
                professorName: '정교수',
                role: 'member',
                department: '소프트웨어학과',
                assignedDate: '2025-11-21'
            }
        ],

        templateId: 'TMPL_FINAL',
        dueDate: '2025-12-05',
        status: '진행중',

        createdAt: '2025-11-21 10:00:00'
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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_001',
                name: '심사의견서_김교수.hwp',
                size: 1536000,
                type: 'hwp'
            },
            {
                id: 'FILE_EVAL_002',
                name: '세부평가표.pdf',
                size: 820000,
                type: 'pdf'
            }
        ],

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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_003',
                name: '심사의견서_이교수.hwp',
                size: 1280000,
                type: 'hwp'
            }
        ],

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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_004',
                name: '심사평가표_한교수.pdf',
                size: 950000,
                type: 'pdf'
            },
            {
                id: 'FILE_EVAL_005',
                name: '보완사항_한교수.docx',
                size: 450000,
                type: 'docx'
            }
        ],

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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_006',
                name: '최종심사의견_이교수.pdf',
                size: 1850000,
                type: 'pdf'
            },
            {
                id: 'FILE_EVAL_007',
                name: '참고문헌_보완목록.xlsx',
                size: 125000,
                type: 'xlsx'
            }
        ],

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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_008',
                name: '심사의견_김교수.hwp',
                size: 1450000,
                type: 'hwp'
            }
        ],

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

        // 심사위원 평가 첨부 파일 (파일 없음)

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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_009',
                name: '최종평가서_강교수.hwp',
                size: 1920000,
                type: 'hwp'
            },
            {
                id: 'FILE_EVAL_010',
                name: '연구기여도분석.pdf',
                size: 780000,
                type: 'pdf'
            }
        ],

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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_011',
                name: '심사의견서_김교수_RA006.hwp',
                size: 1650000,
                type: 'hwp'
            }
        ],

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

        // 심사위원 평가 첨부 파일 (없음 - 파일 업로드 안함)

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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_012',
                name: '분석평가_한교수.pdf',
                size: 2100000,
                type: 'pdf'
            },
            {
                id: 'FILE_EVAL_013',
                name: '데이터분석_검토의견.docx',
                size: 580000,
                type: 'docx'
            }
        ],

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

        // 심사위원 평가 첨부 파일
        files: [
            {
                id: 'FILE_EVAL_014',
                name: '최종평가의견_윤교수.hwp',
                size: 1350000,
                type: 'hwp'
            }
        ],

        status: '제출완료',
        submittedAt: '2025-11-03 09:15:00'
    },
    // RA_TEST_CHAIR (재심테스트 - 본심사) - 위원 평가 완료, 위원장 대기
    {
        id: 'EVAL_TEST_001',
        assignmentId: 'RA_TEST_CHAIR',
        committeeId: 'C_TEST_002',
        professorId: 'P003',
        professorName: '김교수',
        role: 'member',

        scores: [
            {
                categoryId: 'CAT201',
                categoryName: '연구의 창의성',
                score: 8,
                maxScore: 10,
                weight: 25,
                comment: '연구 주제가 창의적이고 독창적임'
            },
            {
                categoryId: 'CAT202',
                categoryName: '연구 방법의 타당성',
                score: 7,
                maxScore: 10,
                weight: 25,
                comment: '연구 방법은 타당하나 일부 보완 필요'
            },
            {
                categoryId: 'CAT203',
                categoryName: '결과 해석의 적절성',
                score: 8,
                maxScore: 10,
                weight: 25,
                comment: '결과 해석이 적절함'
            },
            {
                categoryId: 'CAT204',
                categoryName: '논문의 완성도',
                score: 8,
                maxScore: 10,
                weight: 25,
                comment: '논문 완성도가 우수함'
            }
        ],

        totalScore: 77.5,
        overallComment: '전반적으로 우수한 연구임. 연구 방법론 일부 보완 권장.',

        status: '제출완료',
        submittedAt: '2025-11-25 14:30:00'
    },
    {
        id: 'EVAL_TEST_002',
        assignmentId: 'RA_TEST_CHAIR',
        committeeId: 'C_TEST_003',
        professorId: 'P004',
        professorName: '정교수',
        role: 'member',

        scores: [
            {
                categoryId: 'CAT201',
                categoryName: '연구의 창의성',
                score: 8,
                maxScore: 10,
                weight: 25,
                comment: '독창적인 접근 방법'
            },
            {
                categoryId: 'CAT202',
                categoryName: '연구 방법의 타당성',
                score: 8,
                maxScore: 10,
                weight: 25,
                comment: '연구 방법이 적절함'
            },
            {
                categoryId: 'CAT203',
                categoryName: '결과 해석의 적절성',
                score: 7,
                maxScore: 10,
                weight: 25,
                comment: '결과 해석은 양호하나 심화 분석 필요'
            },
            {
                categoryId: 'CAT204',
                categoryName: '논문의 완성도',
                score: 9,
                maxScore: 10,
                weight: 25,
                comment: '논문 완성도가 매우 우수함'
            }
        ],

        totalScore: 80.0,
        overallComment: '우수한 논문임. 결과 해석 부분 보완 시 탁월한 연구가 될 것으로 기대.',

        status: '제출완료',
        submittedAt: '2025-11-26 10:15:00'
    }
];

// ==================== 저장된 심사 평가 결과 (척도형/서술형) ====================
const SAVED_REVIEWS = {
    // 척도형 평가 결과 예시 (교수 P002가 작성, 초안 저장 상태)
    'RA_RUBRIC_001_P002': {
        assignmentId: 'RA_RUBRIC_001',
        professorId: 'P002',
        status: 'draft',  // 'draft' or 'submitted'
        rubricResults: [
            { itemId: 'RUB001', scale: 4, comment: '연구 주제가 명확하고 구체적으로 정의되었습니다.' },
            { itemId: 'RUB002', scale: 3, comment: '연구 방법론은 적절하나 보완이 필요합니다.' },
            { itemId: 'RUB003', scale: 5, comment: '선행연구 검토가 매우 충실하게 이루어졌습니다.' },
            { itemId: 'RUB004', scale: 4, comment: '연구 계획이 실현 가능하며 타임라인이 적절합니다.' }
        ],
        overallComment: '전반적으로 양호한 연구계획서입니다. 방법론 부분을 보완하면 우수한 연구가 될 것으로 기대됩니다.',
        attachedFiles: [],
        lastSavedAt: '2025-11-15T14:30:00'
    },

    // 서술형 평가 결과 예시 (교수 P005가 작성, 제출 완료 상태)
    'RA_DESCRIPTIVE_001_P005': {
        assignmentId: 'RA_DESCRIPTIVE_001',
        professorId: 'P005',
        status: 'submitted',
        descriptiveResults: [
            {
                itemId: 'DESC001',
                content: '연구가 전반적으로 계획에 따라 순조롭게 진행되고 있습니다. 데이터 수집과 분석이 체계적으로 이루어지고 있으며, 예상했던 연구 일정을 잘 준수하고 있습니다. 다만, 일부 인터뷰 대상자 확보에 어려움이 있었던 것으로 보이나, 대체 방안을 마련하여 해결한 것으로 판단됩니다.'
            },
            {
                itemId: 'DESC002',
                content: '도출된 연구 결과는 이론적 배경과 잘 부합하며, 분석 방법이 적절하게 적용되었습니다. 정량적 데이터와 정성적 데이터를 균형있게 활용하여 연구 문제에 대한 타당한 답을 제시하고 있습니다. 통계 분석의 신뢰도와 타당도가 확보되었으며, 질적 분석도 체계적으로 수행되었습니다.'
            },
            {
                itemId: 'DESC003',
                content: '논문의 구성이 논리적이며, 각 장의 연결이 자연스럽습니다. 학술적 글쓰기 기준에 부합하며, 선행연구와의 비교 논의가 충실합니다. 다만, 일부 표와 그림의 설명을 보완하면 더욱 완성도가 높아질 것으로 판단됩니다. 참고문헌의 형식도 통일성 있게 잘 작성되었습니다.'
            }
        ],
        overallComment: '연구가 매우 체계적으로 진행되었으며, 중간논문으로서 충분한 수준에 도달하였습니다. 최종 논문 작성 시 피드백 내용을 반영하면 우수한 연구 성과를 낼 수 있을 것으로 기대됩니다.',
        attachedFiles: [
            { name: '평가의견서_강민준.pdf', size: 245000, uploadedAt: '2025-11-18T16:20:00' }
        ],
        submittedAt: '2025-11-18T16:22:00'
    },

    // 척도형 평가 결과 예시 (교수 P001 위원장이 작성, 제출 완료)
    'RA_RUBRIC_001_P001': {
        assignmentId: 'RA_RUBRIC_001',
        professorId: 'P001',
        status: 'submitted',
        rubricResults: [
            { itemId: 'RUB001', scale: 5, comment: '연구 주제가 매우 명확하고 학술적 가치가 높습니다.' },
            { itemId: 'RUB002', scale: 4, comment: '연구 방법론이 적절하며 실험 설계가 탄탄합니다.' },
            { itemId: 'RUB003', scale: 5, comment: '최신 연구 동향을 잘 파악하고 있으며 연구 gap이 명확합니다.' },
            { itemId: 'RUB004', scale: 4, comment: '연구 계획이 구체적이며 실현 가능성이 높습니다.' }
        ],
        overallComment: '우수한 연구계획서입니다. 제시된 계획대로 연구를 진행하면 의미있는 학술적 기여를 할 수 있을 것으로 판단됩니다.',
        attachedFiles: [],
        finalDecision: 'pass',  // 위원장 최종 판정: 'pass', 'conditional', 'fail'
        submittedAt: '2025-11-16T10:15:00'
    },

    // 척도형 평가 결과 예시 (교수 P003가 작성, 제출 완료)
    'RA_RUBRIC_001_P003': {
        assignmentId: 'RA_RUBRIC_001',
        professorId: 'P003',
        status: 'submitted',
        rubricResults: [
            { itemId: 'RUB001', scale: 4, comment: '연구 주제가 명확하게 정의되었습니다.' },
            { itemId: 'RUB002', scale: 4, comment: '연구 방법론이 타당합니다.' },
            { itemId: 'RUB003', scale: 4, comment: '선행연구 검토가 충실합니다.' },
            { itemId: 'RUB004', scale: 5, comment: '연구 계획이 매우 구체적이고 실현 가능합니다.' }
        ],
        overallComment: '연구계획서가 전반적으로 잘 작성되었습니다. 계획대로 연구를 수행하시기 바랍니다.',
        attachedFiles: [],
        submittedAt: '2025-11-17T11:00:00'
    },

    // Pass/Fail형 평가 결과 예시 (교수 P008이 작성, 제출 완료 상태)
    'RA_PASSFAIL_001_P008': {
        assignmentId: 'RA_PASSFAIL_001',
        professorId: 'P008',
        status: 'submitted',
        passfailResults: [
            { itemId: 'IRB001', decision: 'pass', comment: '연구 윤리 규정을 충실히 준수하고 있습니다.' },
            { itemId: 'IRB002', decision: 'pass', comment: 'IRB 승인 절차가 적절하게 진행되었습니다.' },
            { itemId: 'IRB003', decision: 'pass', comment: '개인정보 보호 방안이 명확히 수립되어 있습니다.' }
        ],
        overallComment: 'IRB 심사 기준을 모두 충족하고 있으며, 연구 수행에 문제가 없습니다.',
        attachedFiles: [],
        submittedAt: '2025-11-16T09:45:00'
    },

    // Pass/Fail형 평가 결과 예시 (교수 P007 위원장이 작성, 제출 완료)
    'RA_PASSFAIL_001_P007': {
        assignmentId: 'RA_PASSFAIL_001',
        professorId: 'P007',
        status: 'submitted',
        passfailResults: [
            { itemId: 'IRB001', decision: 'pass', comment: '윤리적 고려사항이 충분히 검토되었습니다.' },
            { itemId: 'IRB002', decision: 'pass', comment: 'IRB 심사가 완료되었으며 승인되었습니다.' },
            { itemId: 'IRB003', decision: 'pass', comment: '피험자 보호 조치가 적절합니다.' }
        ],
        overallComment: '연구 윤리 및 IRB 기준을 모두 충족하였습니다. 연구 진행을 승인합니다.',
        attachedFiles: [],
        submittedAt: '2025-11-17T14:20:00'
    },

    // Pass/Fail형 평가 결과 예시 (교수 P008이 작성, 제출 완료)
    'RA_PASSFAIL_001_P008': {
        assignmentId: 'RA_PASSFAIL_001',
        professorId: 'P008',
        status: 'submitted',
        passfailResults: [
            { itemId: 'IRB001', decision: 'pass', comment: '의학적 윤리 기준을 준수하고 있습니다.' },
            { itemId: 'IRB002', decision: 'pass', comment: 'IRB 승인이 적절히 이루어졌습니다.' },
            { itemId: 'IRB003', decision: 'pass', comment: '환자 안전 및 개인정보 보호가 충분합니다.' }
        ],
        overallComment: '의료윤리 관점에서 문제가 없으며 연구 수행이 가능합니다.',
        attachedFiles: [],
        submittedAt: '2025-11-17T16:30:00'
    },

    // 서술형 평가 결과 예시 (교수 P003이 작성, 초안 저장 상태)
    'RA_DESCRIPTIVE_001_P003': {
        assignmentId: 'RA_DESCRIPTIVE_001',
        professorId: 'P003',
        status: 'draft',
        descriptiveResults: [
            {
                itemId: 'DESC001',
                content: '연구가 체계적으로 진행되고 있으며, 일정 관리가 우수합니다.'
            },
            {
                itemId: 'DESC002',
                content: '연구 결과의 타당성이 확보되었으며, 분석 방법이 적절합니다.'
            },
            {
                itemId: 'DESC003',
                content: '논문 작성이 학술적 기준에 부합하며, 구성이 논리적입니다.'
            }
        ],
        overallComment: '중간논문으로서 적절한 수준에 도달하였습니다.',
        attachedFiles: [],
        lastSavedAt: '2025-11-18T10:00:00'
    },

    // Pass/Fail형 평가 결과 예시 (교수 P003이 작성, 초안 저장 상태)
    'RA_PASSFAIL_001_P003': {
        assignmentId: 'RA_PASSFAIL_001',
        professorId: 'P003',
        status: 'submitted',
        passfailResults: [
            { itemId: 'IRB001', decision: 'pass', comment: '연구 윤리 기준을 준수하고 있습니다.' },
            { itemId: 'IRB002', decision: 'pass', comment: 'IRB 승인이 적절히 진행되었습니다.' },
            { itemId: 'IRB003', decision: 'pass', comment: '개인정보 보호 방안이 충분합니다.' }
        ],
        overallComment: 'IRB 기준을 충족하고 있습니다.',
        attachedFiles: [],
        submittedAt: '2025-11-17T14:30:00'
    }
};

// ==================== 심사 결과 ====================
const REVIEW_RESULTS = [
    {
        id: 'RESULT001',
        assignmentId: 'RA002',
        
        evaluations: ['EVAL001', 'EVAL002', 'EVAL003'],
        
        averageScore: 83.3,
        
        systemDecision: '합격',
        systemDecisionReason: '평균 점수 83.3점으로 합격 기준 75점 이상',

        chairDecision: '합격',
        chairComment: '모든 심사위원의 평가가 우수함. 지적사항 보완 후 최종 논문 진행 권장',
        chairDecidedAt: '2025-11-17 16:00:00',
        chairDecidedBy: 'P003',

        // 위원장 최종 결정 첨부 파일
        chairDecisionFiles: [
            {
                id: 'FILE_CHAIR_001',
                fileName: '최종심사의견서.hwp',
                fileSize: 2560000,
                fileType: 'hwp',
                uploadedAt: '2025-11-17T16:00:00',
                uploadedBy: 'P003',
                fileUrl: '/uploads/review/RA002/최종심사의견서.hwp'
            },
            {
                id: 'FILE_CHAIR_002',
                fileName: '심사결과종합.pdf',
                fileSize: 1024000,
                fileType: 'pdf',
                uploadedAt: '2025-11-17T16:00:00',
                uploadedBy: 'P003',
                fileUrl: '/uploads/review/RA002/심사결과종합.pdf'
            }
        ],

        finalDecision: '합격',
        
        notifiedAt: '2025-11-17 16:05:00',

        createdAt: '2025-11-17 15:00:00'
    },
    {
        id: 'RESULT002',
        assignmentId: 'RA003',

        evaluations: ['EVAL004', 'EVAL005', 'EVAL006'],

        averageScore: 75.5,

        systemDecision: '합격',
        systemDecisionReason: '평균 점수 75.5점으로 합격 기준 75점 이상',

        chairDecision: '조건부합격',
        chairComment: '연구 방법론 보완 필요. 지적 사항 수정 후 재심사 요청',
        chairDecidedAt: '2025-11-18 14:00:00',
        chairDecidedBy: 'P003',

        // 위원장 최종 결정 첨부 파일
        chairDecisionFiles: [],

        // 재심 정보 (조건부합격일 때만 존재)
        resubmission: {
            required: true,
            reviewerType: 'single',           // 'committee' or 'single'
            reviewerId: 'P004',               // single일 경우 선택된 심사위원 ID
            reviewerName: '이교수',           // single일 경우 심사위원 이름
            evaluationTemplateId: 'TMPL_MID', // 선택된 평가표 ID
            deadline: '2025-12-31 23:59',     // 재심 제출 마감일
            attemptNumber: 1,                  // 재심 차수 (1차 재심)
            status: 'pending',                // pending, submitted, completed
            createdAt: '2025-11-18 14:00:00'
        },

        finalDecision: '조건부합격',

        notifiedAt: '2025-11-18 14:05:00',

        createdAt: '2025-11-18 13:00:00'
    },
    {
        id: 'RESULT_TEST_CHAIR',
        assignmentId: 'RA_TEST_CHAIR',

        evaluations: ['EVAL_TEST_001', 'EVAL_TEST_002'],

        averageScore: 78.0,

        systemDecision: '합격',
        systemDecisionReason: '평균 점수 78.0점으로 합격 기준 75점 이상',

        // 위원장이 아직 결정하지 않음 (테스트용)
        chairDecision: null,
        chairComment: null,
        chairDecidedAt: null,
        chairDecidedBy: null,

        chairDecisionFiles: [],

        // 재심 정보는 위원장이 조건부합격 선택 시 추가됨
        resubmission: null,

        finalDecision: null,

        notifiedAt: null,

        createdAt: '2025-11-21 16:00:00'
    }
];

// ==================== Service ====================
class ReviewService {
    // 현재 로그인한 교수 정보 (CURRENT_USER 또는 전역 currentProfessorId 사용)
    static getCurrentProfessorId() {
        // 전역 currentProfessorId가 설정되어 있으면 사용
        if (typeof window.currentProfessorId !== 'undefined' && window.currentProfessorId) {
            return window.currentProfessorId;
        }
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

    // 모든 심사 목록 조회 (관리자용)
    static getAllReviewAssignments() {
        return REVIEW_ASSIGNMENTS.map(assignment => {
            // 심사 진행 상황
            const evaluations = REVIEW_EVALUATIONS.filter(e => e.assignmentId === assignment.id);
            const totalMembers = assignment.committee.length;
            const completedCount = evaluations.filter(e => e.status === '제출완료').length;

            return {
                ...assignment,
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
        const allEvaluations = myRole && myRole.role === 'chair'
            ? REVIEW_EVALUATIONS.filter(e => e.assignmentId === assignmentId)
            : [];

        // 심사 결과
        const result = REVIEW_RESULTS.find(r => r.assignmentId === assignmentId);

        return {
            assignment,
            myRole: myRole ? myRole.role : null,
            myCommitteeId: myRole ? myRole.id : null,
            template,
            myEvaluation,
            allEvaluations,
            result
        };
    }

    // 관리자용 심사 상세 조회 (위원장 권한으로 모든 데이터 조회)
    static getReviewDetailForAdmin(assignmentId) {
        const assignment = REVIEW_ASSIGNMENTS.find(a => a.id === assignmentId);
        if (!assignment) return null;

        // 평가표 템플릿
        const template = EVALUATION_TEMPLATES[assignment.templateId];

        // 모든 평가 조회 (관리자는 모든 평가를 볼 수 있음)
        const allEvaluations = REVIEW_EVALUATIONS.filter(e => e.assignmentId === assignmentId);

        // 심사 결과
        const result = REVIEW_RESULTS.find(r => r.assignmentId === assignmentId);

        return {
            assignment,
            myRole: 'chair', // 관리자는 위원장 권한으로 모든 것을 볼 수 있음
            myCommitteeId: null, // 관리자는 심사위원이 아님
            template,
            myEvaluation: null, // 관리자는 평가하지 않음
            allEvaluations, // 모든 평가 표시
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
window.SAVED_REVIEWS = SAVED_REVIEWS;
