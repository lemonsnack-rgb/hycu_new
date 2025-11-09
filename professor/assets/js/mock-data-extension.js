// ===================================
// Phase 2: 복수 지도교수 데이터 추가
// ===================================

// 현재 로그인한 교수 정보
const CURRENT_PROFESSOR = {
    id: 'P001',
    name: '김교수',
    department: '교육공학과',
    email: 'kim.prof@hycu.ac.kr'
};

// 학생 데이터 (복수 지도교수 반영)
const STUDENTS_WITH_ADVISORS = [
    {
        id: 'S001',
        studentId: '2024001',
        name: '김철수',
        major: '교육공학',
        degree: '석사',
        stage: 'research_proposal',
        advisors: [
            { id: 'P001', name: '김교수', role: 'primary', department: '교육공학과' },
            { id: 'P002', name: '홍교수', role: 'secondary', department: '교육공학과' }
        ],
        guidanceStats: {
            'P001': { count: 3, lastDate: '2025-03-15' },
            'P002': { count: 2, lastDate: '2025-03-08' }
        },
        totalGuidanceCount: 5
    },
    {
        id: 'S002',
        studentId: '2024002',
        name: '이영희',
        major: '경영학',
        degree: '박사',
        stage: 'mid_thesis',
        advisors: [
            { id: 'P001', name: '김교수', role: 'primary', department: '경영학과' }
        ],
        guidanceStats: {
            'P001': { count: 4, lastDate: '2025-03-20' }
        },
        totalGuidanceCount: 4
    },
    {
        id: 'S003',
        studentId: '2024003',
        name: '박민수',
        major: '컴퓨터공학',
        degree: '석사',
        stage: 'thesis_plan',
        advisors: [
            { id: 'P001', name: '김교수', role: 'secondary', department: '컴퓨터공학과' },
            { id: 'P003', name: '최교수', role: 'primary', department: '컴퓨터공학과' }
        ],
        guidanceStats: {
            'P001': { count: 1, lastDate: '2025-03-10' },
            'P003': { count: 3, lastDate: '2025-03-18' }
        },
        totalGuidanceCount: 4
    }
];

// 주차별 지도 계획 (계획일/실행일 구분)
const WEEKLY_GUIDANCE_PLANS = {
    'S001': [
        {
            id: 1,
            studentId: 'S001',
            week: 1,
            advisor: { id: 'P001', name: '김교수' },
            plannedDate: '2025-03-08',
            plannedTopic: '연구방법론 개요',
            plannedContent: '질적연구와 양적연구의 차이점 설명, 연구 주제에 적합한 방법론 논의',
            plannedMethod: 'meeting',
            executionDate: '2025-03-08',
            executionContent: '질적연구와 양적연구 논의 완료. 학생이 혼합연구방법 선택',
            actualMethod: 'meeting',
            professorComment: '연구 방향 잘 설정됨. 다음 주까지 선행연구 5편 이상 검토 필요',
            status: 'completed',
            isPublic: true,
            nextPlanDate: '2025-03-15'
        },
        {
            id: 2,
            studentId: 'S001',
            week: 2,
            advisor: { id: 'P002', name: '홍교수' },
            plannedDate: '2025-03-15',
            plannedTopic: '문헌검토 방법',
            plannedContent: '선행연구 검색 방법, 데이터베이스 활용법 안내',
            plannedMethod: 'online',
            executionDate: '2025-03-15',
            executionContent: 'RISS, KISS, Google Scholar 사용법 안내. 검색 키워드 설정',
            actualMethod: 'zoom',
            professorComment: '검색 키워드 재설정 필요. 국외 문헌도 포함하여 검토',
            status: 'completed',
            isPublic: true,
            nextPlanDate: '2025-03-22'
        },
        {
            id: 3,
            studentId: 'S001',
            week: 3,
            advisor: { id: 'P001', name: '김교수' },
            plannedDate: '2025-03-22',
            plannedTopic: '연구설계 검토',
            plannedContent: '연구 대상, 표본 크기, 자료 수집 방법 검토',
            plannedMethod: 'meeting',
            executionDate: '2025-03-22',
            executionContent: '연구설계 전반 논의. 표본크기 조정 제안',
            actualMethod: 'meeting',
            professorComment: '연구설계 적절함. IRB 신청 준비 시작',
            status: 'completed',
            isPublic: true,
            nextPlanDate: '2025-03-29'
        },
        {
            id: 4,
            studentId: 'S001',
            week: 4,
            advisor: { id: 'P001', name: '김교수' },
            plannedDate: '2025-03-29',
            plannedTopic: 'IRB 신청서 작성',
            plannedContent: 'IRB 신청서 작성 요령 및 연구 윤리 안내',
            plannedMethod: 'email',
            executionDate: null,
            executionContent: null,
            actualMethod: null,
            professorComment: null,
            status: 'planned',
            isPublic: true,
            nextPlanDate: null
        }
    ],
    'S002': [
        {
            id: 5,
            studentId: 'S002',
            week: 1,
            advisor: { id: 'P001', name: '김교수' },
            plannedDate: '2025-03-10',
            plannedTopic: '중간논문 개요 논의',
            plannedContent: '중간논문 구조 및 작성 방향 설정',
            plannedMethod: 'meeting',
            executionDate: '2025-03-10',
            executionContent: '3장까지 작성 완료 확인. 4장 연구방법 보완 필요',
            actualMethod: 'meeting',
            professorComment: '전반적으로 양호. 통계분석 부분 보강 필요',
            status: 'completed',
            isPublic: true,
            nextPlanDate: '2025-03-17'
        },
        {
            id: 6,
            studentId: 'S002',
            week: 2,
            advisor: { id: 'P001', name: '김교수' },
            plannedDate: '2025-03-17',
            plannedTopic: '데이터 분석 방법',
            plannedContent: 'SPSS 사용법 및 통계분석 방법 논의',
            plannedMethod: 'online',
            executionDate: '2025-03-17',
            executionContent: 'SPSS 기초 사용법 실습. 기술통계 분석',
            actualMethod: 'zoom',
            professorComment: '통계 개념 이해도 양호. 다음 주 고급분석 진행',
            status: 'completed',
            isPublic: true,
            nextPlanDate: '2025-03-24'
        },
        {
            id: 7,
            studentId: 'S002',
            week: 3,
            advisor: { id: 'P001', name: '김교수' },
            plannedDate: '2025-03-24',
            plannedTopic: '결과 해석',
            plannedContent: '분석 결과 해석 및 논문 작성 방향',
            plannedMethod: 'meeting',
            executionDate: null,
            executionContent: null,
            actualMethod: null,
            professorComment: null,
            status: 'in_progress',
            isPublic: true,
            nextPlanDate: null
        }
    ],
    'S003': [
        {
            id: 8,
            studentId: 'S003',
            week: 1,
            advisor: { id: 'P003', name: '최교수' },
            plannedDate: '2025-03-05',
            plannedTopic: '논문 주제 선정',
            plannedContent: '관심 연구 주제 논의 및 선행연구 검토',
            plannedMethod: 'meeting',
            executionDate: '2025-03-05',
            executionContent: '3개 주제 중 최종 1개 선정. 블록체인 기반 IoT 보안',
            actualMethod: 'meeting',
            professorComment: '주제 적절함. 선행연구 정리 필요',
            status: 'completed',
            isPublic: true,
            nextPlanDate: '2025-03-12'
        },
        {
            id: 9,
            studentId: 'S003',
            week: 2,
            advisor: { id: 'P001', name: '김교수' },
            plannedDate: '2025-03-12',
            plannedTopic: '연구계획서 검토',
            plannedContent: '연구계획서 초안 검토 (부지도교수 역할)',
            plannedMethod: 'online',
            executionDate: '2025-03-12',
            executionContent: '연구계획서 전반 검토. 연구문제 명확화 제안',
            actualMethod: 'email',
            professorComment: '연구범위 축소 권장. 실현가능성 고려',
            status: 'completed',
            isPublic: false,
            nextPlanDate: '2025-03-19'
        }
    ]
};

// DataService에 추가할 메서드들
if (typeof DataService !== 'undefined') {
    // 현재 교수 정보 가져오기
    DataService.getCurrentProfessor = function() {
        return CURRENT_PROFESSOR;
    };
    
    // 내 지도학생 목록 (복수 교수 반영)
    DataService.getMyStudents = function() {
        return STUDENTS_WITH_ADVISORS.filter(student =>
            student.advisors.some(advisor => advisor.id === CURRENT_PROFESSOR.id)
        );
    };
    
    // 특정 학생의 상세 정보
    DataService.getStudentDetail = function(studentId) {
        return STUDENTS_WITH_ADVISORS.find(s => s.studentId === studentId);
    };
    
    // 주차별 지도 계획 (전체 또는 내 것만)
    DataService.getWeeklyGuidancePlans = function(studentId, onlyMine = false) {
        const plans = WEEKLY_GUIDANCE_PLANS[studentId] || [];
        
        if (onlyMine) {
            return plans.filter(plan => plan.advisor.id === CURRENT_PROFESSOR.id);
        }
        return plans;
    };
    
    // 주차별 계획 추가
    DataService.addWeeklyGuidancePlan = function(studentId, planData) {
        if (!WEEKLY_GUIDANCE_PLANS[studentId]) {
            WEEKLY_GUIDANCE_PLANS[studentId] = [];
        }
        
        const newPlan = {
            id: Date.now(),
            studentId: studentId,
            advisor: {
                id: CURRENT_PROFESSOR.id,
                name: CURRENT_PROFESSOR.name
            },
            ...planData,
            status: 'planned',
            executionDate: null,
            executionContent: null,
            actualMethod: null,
            professorComment: null
        };
        
        WEEKLY_GUIDANCE_PLANS[studentId].push(newPlan);
        
        // 학생 통계 업데이트
        const student = STUDENTS_WITH_ADVISORS.find(s => s.studentId === studentId);
        if (student) {
            if (!student.guidanceStats[CURRENT_PROFESSOR.id]) {
                student.guidanceStats[CURRENT_PROFESSOR.id] = { count: 0, lastDate: null };
            }
        }
        
        return newPlan;
    };
    
    // 실적 입력 (executionDate 등 업데이트)
    DataService.updateGuidanceExecution = function(planId, executionData) {
        for (const studentId in WEEKLY_GUIDANCE_PLANS) {
            const plan = WEEKLY_GUIDANCE_PLANS[studentId].find(p => p.id === planId);
            if (plan) {
                plan.executionDate = executionData.executionDate;
                plan.executionContent = executionData.executionContent;
                plan.actualMethod = executionData.actualMethod;
                plan.professorComment = executionData.professorComment;
                plan.status = 'completed';
                plan.isPublic = executionData.isPublic;
                plan.nextPlanDate = executionData.nextPlanDate;
                
                // 학생 통계 업데이트
                const student = STUDENTS_WITH_ADVISORS.find(s => s.studentId === studentId);
                if (student && student.guidanceStats[plan.advisor.id]) {
                    student.guidanceStats[plan.advisor.id].count++;
                    student.guidanceStats[plan.advisor.id].lastDate = executionData.executionDate;
                    student.totalGuidanceCount++;
                }
                
                return plan;
            }
        }
        return null;
    };
    
    // 계획 수정
    DataService.updateGuidancePlan = function(planId, field, value) {
        for (const studentId in WEEKLY_GUIDANCE_PLANS) {
            const plan = WEEKLY_GUIDANCE_PLANS[studentId].find(p => p.id === planId);
            if (plan) {
                plan[field] = value;
                return plan;
            }
        }
        return null;
    };
}

// 전역 export
window.CURRENT_PROFESSOR = CURRENT_PROFESSOR;
window.STUDENTS_WITH_ADVISORS = STUDENTS_WITH_ADVISORS;
window.WEEKLY_GUIDANCE_PLANS = WEEKLY_GUIDANCE_PLANS;
