// Mock 데이터 - 프로토타입용 (업데이트됨 - 희망지도교수, 부지도교수 무제한)

// 학과 목록
const mockDepartments = [
    '컴퓨터공학과',
    '경영학과',
    '교육학과',
    '심리학과',
    '사회복지학과'
];

// 교수 데이터 (10명)
const mockProfessors = [
    { id: 'PROF001', employeeNumber: 'P2020001', name: '김교수', department: '컴퓨터공학과', isTenured: true, email: 'kim@hycu.ac.kr', phone: '010-1111-1111' },
    { id: 'PROF002', employeeNumber: 'P2020002', name: '이교수', department: '컴퓨터공학과', isTenured: true, email: 'lee@hycu.ac.kr', phone: '010-1111-1112' },
    { id: 'PROF003', employeeNumber: 'P2021001', name: '박교수', department: '경영학과', isTenured: true, email: 'park@hycu.ac.kr', phone: '010-1111-1113' },
    { id: 'PROF004', employeeNumber: 'P2021002', name: '최교수', department: '경영학과', isTenured: false, email: 'choi@hycu.ac.kr', phone: '010-1111-1114' },
    { id: 'PROF005', employeeNumber: 'P2022001', name: '정교수', department: '교육학과', isTenured: true, email: 'jung@hycu.ac.kr', phone: '010-1111-1115' },
    { id: 'PROF006', employeeNumber: 'P2022002', name: '강교수', department: '교육학과', isTenured: false, email: 'kang@hycu.ac.kr', phone: '010-1111-1116' },
    { id: 'PROF007', employeeNumber: 'P2023001', name: '조교수', department: '심리학과', isTenured: true, email: 'jo@hycu.ac.kr', phone: '010-1111-1117' },
    { id: 'PROF008', employeeNumber: 'P2023002', name: '윤교수', department: '심리학과', isTenured: false, email: 'yoon@hycu.ac.kr', phone: '010-1111-1118' },
    { id: 'PROF009', employeeNumber: 'P2024001', name: '장교수', department: '사회복지학과', isTenured: true, email: 'jang@hycu.ac.kr', phone: '010-1111-1119' },
    { id: 'PROF010', employeeNumber: 'P2024002', name: '임교수', department: '사회복지학과', isTenured: false, email: 'lim@hycu.ac.kr', phone: '010-1111-1120' }
];

// 학생 데이터 (20명) - academicYear(학년도), semesterCount(학기차) 추가
const mockStudents = [
    { id: 'STU001', studentNumber: '2024001', name: '김학생', department: '컴퓨터공학과', degreeType: '석사', grade: '석사1차', academicYear: '2025', semesterCount: 4, status: 'active', email: 'stu001@hycu.ac.kr', phone: '010-2222-0001', admissionDate: '2024-03-01' },
    { id: 'STU002', studentNumber: '2024002', name: '이학생', department: '컴퓨터공학과', degreeType: '석사', grade: '석사1차', academicYear: '2025', semesterCount: 4, status: 'active', email: 'stu002@hycu.ac.kr', phone: '010-2222-0002', admissionDate: '2024-03-01' },
    { id: 'STU003', studentNumber: '2024003', name: '박학생', department: '경영학과', degreeType: '석사', grade: '석사1차', academicYear: '2025', semesterCount: 4, status: 'active', email: 'stu003@hycu.ac.kr', phone: '010-2222-0003', admissionDate: '2024-03-01' },
    { id: 'STU004', studentNumber: '2024004', name: '최학생', department: '경영학과', degreeType: '석사', grade: '석사2차', academicYear: '2024', semesterCount: 5, status: 'active', email: 'stu004@hycu.ac.kr', phone: '010-2222-0004', admissionDate: '2023-09-01' },
    { id: 'STU005', studentNumber: '2024005', name: '정학생', department: '교육학과', degreeType: '석사', grade: '석사1차', academicYear: '2025', semesterCount: 4, status: 'active', email: 'stu005@hycu.ac.kr', phone: '010-2222-0005', admissionDate: '2024-03-01' },
    { id: 'STU006', studentNumber: '2024006', name: '강학생', department: '교육학과', degreeType: '석사', grade: '석사2차', academicYear: '2024', semesterCount: 5, status: 'active', email: 'stu006@hycu.ac.kr', phone: '010-2222-0006', admissionDate: '2023-09-01' },
    { id: 'STU007', studentNumber: '2024007', name: '조학생', department: '심리학과', degreeType: '석사', grade: '석사1차', academicYear: '2025', semesterCount: 4, status: 'active', email: 'stu007@hycu.ac.kr', phone: '010-2222-0007', admissionDate: '2024-03-01' },
    { id: 'STU008', studentNumber: '2024008', name: '윤학생', department: '심리학과', degreeType: '석사', grade: '석사2차', academicYear: '2024', semesterCount: 5, status: 'active', email: 'stu008@hycu.ac.kr', phone: '010-2222-0008', admissionDate: '2023-09-01' },
    { id: 'STU009', studentNumber: '2024009', name: '장학생', department: '사회복지학과', degreeType: '석사', grade: '석사1차', academicYear: '2025', semesterCount: 4, status: 'active', email: 'stu009@hycu.ac.kr', phone: '010-2222-0009', admissionDate: '2024-03-01' },
    { id: 'STU010', studentNumber: '2024010', name: '임학생', department: '사회복지학과', degreeType: '석사', grade: '석사2차', academicYear: '2024', semesterCount: 5, status: 'active', email: 'stu010@hycu.ac.kr', phone: '010-2222-0010', admissionDate: '2023-09-01' },
    { id: 'STU011', studentNumber: '2023001', name: '한학생', department: '컴퓨터공학과', degreeType: '박사', grade: '박사1차', academicYear: '2025', semesterCount: 6, status: 'active', email: 'stu011@hycu.ac.kr', phone: '010-2222-0011', admissionDate: '2023-03-01' },
    { id: 'STU012', studentNumber: '2023002', name: '서학생', department: '컴퓨터공학과', degreeType: '박사', grade: '박사1차', academicYear: '2025', semesterCount: 6, status: 'active', email: 'stu012@hycu.ac.kr', phone: '010-2222-0012', admissionDate: '2023-03-01' },
    { id: 'STU013', studentNumber: '2023003', name: '오학생', department: '경영학과', degreeType: '박사', grade: '박사1차', academicYear: '2025', semesterCount: 6, status: 'active', email: 'stu013@hycu.ac.kr', phone: '010-2222-0013', admissionDate: '2023-03-01' },
    { id: 'STU014', studentNumber: '2023004', name: '양학생', department: '경영학과', degreeType: '박사', grade: '박사2차', academicYear: '2023', semesterCount: 7, status: 'active', email: 'stu014@hycu.ac.kr', phone: '010-2222-0014', admissionDate: '2022-09-01' },
    { id: 'STU015', studentNumber: '2023005', name: '권학생', department: '교육학과', degreeType: '박사', grade: '박사1차', academicYear: '2025', semesterCount: 6, status: 'active', email: 'stu015@hycu.ac.kr', phone: '010-2222-0015', admissionDate: '2023-03-01' },
    { id: 'STU016', studentNumber: '2023006', name: '송학생', department: '교육학과', degreeType: '박사', grade: '박사2차', academicYear: '2023', semesterCount: 7, status: 'active', email: 'stu016@hycu.ac.kr', phone: '010-2222-0016', admissionDate: '2022-09-01' },
    { id: 'STU017', studentNumber: '2023007', name: '백학생', department: '심리학과', degreeType: '박사', grade: '박사1차', academicYear: '2025', semesterCount: 6, status: 'active', email: 'stu017@hycu.ac.kr', phone: '010-2222-0017', admissionDate: '2023-03-01' },
    { id: 'STU018', studentNumber: '2023008', name: '남학생', department: '심리학과', degreeType: '박사', grade: '박사2차', academicYear: '2023', semesterCount: 7, status: 'active', email: 'stu018@hycu.ac.kr', phone: '010-2222-0018', admissionDate: '2022-09-01' },
    { id: 'STU019', studentNumber: '2023009', name: '문학생', department: '사회복지학과', degreeType: '박사', grade: '박사1차', academicYear: '2025', semesterCount: 6, status: 'active', email: 'stu019@hycu.ac.kr', phone: '010-2222-0019', admissionDate: '2023-03-01' },
    { id: 'STU020', studentNumber: '2023010', name: '유학생', department: '사회복지학과', degreeType: '박사', grade: '박사2차', academicYear: '2023', semesterCount: 7, status: 'active', email: 'stu020@hycu.ac.kr', phone: '010-2222-0020', admissionDate: '2022-09-01' }
];

// 연구계획서 데이터 (19명) - degreeType, necessity, desiredAdvisor 추가
// STU001(김학생)은 연구계획서 미제출 상태로 설정
const mockResearchProposals = [
    // 석사과정 (9명)
    { id: 'RP002', studentId: 'STU002', studentNumber: '2024002', studentName: '이학생', department: '컴퓨터공학과', degreeType: '석사', title: '블록체인 기반 데이터 무결성 보장 방안', purpose: '분산 환경에서의 데이터 보안 강화', necessity: '중앙화된 시스템의 보안 문제 해결', method: '블록체인 기술 적용 및 검증', submittedDate: '2025-03-11', status: 'pending', desiredAdvisor: null },
    { id: 'RP003', studentId: 'STU003', studentNumber: '2024003', studentName: '박학생', department: '경영학과', degreeType: '석사', title: '디지털 전환 시대의 기업 경쟁력 분석', purpose: '기업의 디지털 전환 성공 요인 도출', necessity: '디지털 전환이 기업 경쟁력에 미치는 영향 연구', method: '사례 연구 및 통계 분석', submittedDate: '2025-03-12', status: 'pending', desiredAdvisor: null },
    { id: 'RP004', studentId: 'STU004', studentNumber: '2024004', studentName: '최학생', department: '경영학과', degreeType: '석사', title: 'ESG 경영이 기업 가치에 미치는 영향', purpose: 'ESG 경영의 재무적 성과 분석', necessity: 'ESG 경영의 중요성이 대두되고 있음', method: '재무제표 분석 및 회귀분석', submittedDate: '2025-03-13', status: 'assigned', desiredAdvisor: null },
    { id: 'RP005', studentId: 'STU005', studentNumber: '2024005', studentName: '정학생', department: '교육학과', degreeType: '석사', title: '온라인 교육의 효과성 연구', purpose: '온라인 교육의 학습 효과 분석', necessity: '코로나19 이후 온라인 교육 확대', method: '실험 연구 및 설문 조사', submittedDate: '2025-03-14', status: 'pending', desiredAdvisor: null },
    { id: 'RP006', studentId: 'STU006', studentNumber: '2024006', studentName: '강학생', department: '교육학과', degreeType: '석사', title: '메타버스를 활용한 교육 프로그램 개발', purpose: '몰입형 교육 환경 구축', necessity: '새로운 교육 매체로서의 메타버스', method: '메타버스 플랫폼 개발 및 효과 검증', submittedDate: '2025-03-15', status: 'assigned', desiredAdvisor: null },
    { id: 'RP007', studentId: 'STU007', studentNumber: '2024007', studentName: '조학생', department: '심리학과', degreeType: '석사', title: 'SNS 사용이 청소년 심리에 미치는 영향', purpose: 'SNS 사용 패턴과 심리적 건강의 관계 분석', necessity: '청소년의 SNS 사용 증가', method: '설문 조사 및 통계 분석', submittedDate: '2025-03-16', status: 'pending', desiredAdvisor: null },
    { id: 'RP008', studentId: 'STU008', studentNumber: '2024008', studentName: '윤학생', department: '심리학과', degreeType: '석사', title: '직장인의 스트레스와 대처 방안 연구', purpose: '직장 내 스트레스 관리 방법 제시', necessity: '직장인의 정신 건강 문제 증가', method: '인터뷰 및 질적 연구', submittedDate: '2025-03-17', status: 'assigned', desiredAdvisor: null },
    { id: 'RP009', studentId: 'STU009', studentNumber: '2024009', studentName: '장학생', department: '사회복지학과', degreeType: '석사', title: '노인 복지 정책의 효과성 분석', purpose: '노인 복지 제도의 개선 방안 제시', necessity: '고령화 사회의 노인 복지 필요성', method: '정책 분석 및 사례 연구', submittedDate: '2025-03-18', status: 'pending', desiredAdvisor: null },
    { id: 'RP010', studentId: 'STU010', studentNumber: '2024010', studentName: '임학생', department: '사회복지학과', degreeType: '석사', title: '장애인 고용 촉진 방안 연구', purpose: '장애인 고용 정책의 실효성 제고', necessity: '장애인 고용률이 낮은 현실', method: '통계 분석 및 인터뷰', submittedDate: '2025-03-19', status: 'assigned', desiredAdvisor: null },

    // 박사과정 (10명) - desiredAdvisor 포함
    { id: 'RP011', studentId: 'STU011', studentNumber: '2023001', studentName: '한학생', department: '컴퓨터공학과', degreeType: '박사', title: '양자 컴퓨팅 알고리즘 최적화', purpose: '양자 알고리즘의 효율성 향상', necessity: '양자 컴퓨팅의 발전 가능성', method: '양자 시뮬레이터를 활용한 실험', submittedDate: '2025-03-20', status: 'pending', desiredAdvisor: { id: 'PROF001', name: '김교수' } },
    { id: 'RP012', studentId: 'STU012', studentNumber: '2023002', studentName: '서학생', department: '컴퓨터공학과', degreeType: '박사', title: '엣지 컴퓨팅 환경에서의 데이터 처리', purpose: '실시간 데이터 처리 성능 개선', necessity: 'IoT 환경에서의 데이터 처리 필요성', method: '엣지 디바이스를 활용한 실험', submittedDate: '2025-03-21', status: 'assigned', desiredAdvisor: { id: 'PROF002', name: '이교수' } },
    { id: 'RP013', studentId: 'STU013', studentNumber: '2023003', studentName: '오학생', department: '경영학과', degreeType: '박사', title: '스타트업 성공 요인 분석', purpose: '스타트업의 생존율 향상 방안 제시', necessity: '스타트업 생태계 활성화', method: '다중 회귀 분석', submittedDate: '2025-03-22', status: 'pending', desiredAdvisor: { id: 'PROF003', name: '박교수' } },
    { id: 'RP014', studentId: 'STU014', studentNumber: '2023004', studentName: '양학생', department: '경영학과', degreeType: '박사', title: '소셜 미디어 마케팅 전략 연구', purpose: '소셜 미디어를 통한 고객 참여 증대', necessity: '소셜 미디어의 영향력 확대', method: '사례 연구 및 실험', submittedDate: '2025-03-23', status: 'assigned', desiredAdvisor: { id: 'PROF004', name: '최교수' } },
    { id: 'RP015', studentId: 'STU015', studentNumber: '2023005', studentName: '권학생', department: '교육학과', degreeType: '박사', title: '평생 교육 프로그램 효과성 평가', purpose: '성인 학습자의 교육 효과 극대화', necessity: '평생 교육의 중요성 증가', method: '종단 연구', submittedDate: '2025-03-24', status: 'pending', desiredAdvisor: { id: 'PROF005', name: '정교수' } },
    { id: 'RP016', studentId: 'STU016', studentNumber: '2023006', studentName: '송학생', department: '교육학과', degreeType: '박사', title: '창의성 교육 프로그램 개발', purpose: '학습자의 창의력 향상', necessity: '창의적 인재 양성의 필요성', method: '프로그램 개발 및 효과 검증', submittedDate: '2025-03-25', status: 'assigned', desiredAdvisor: { id: 'PROF006', name: '강교수' } },
    { id: 'RP017', studentId: 'STU017', studentNumber: '2023007', studentName: '백학생', department: '심리학과', degreeType: '박사', title: '외상 후 스트레스 장애 치료 방법 연구', purpose: 'PTSD 환자의 치료 효과 향상', necessity: 'PTSD 치료의 어려움', method: '임상 실험 및 질적 분석', submittedDate: '2025-03-26', status: 'pending', desiredAdvisor: { id: 'PROF007', name: '조교수' } },
    { id: 'RP018', studentId: 'STU018', studentNumber: '2023008', studentName: '남학생', department: '심리학과', degreeType: '박사', title: '긍정 심리학 기반 행복 증진 프로그램', purpose: '개인의 행복감 향상', necessity: '긍정 심리학의 발전', method: '프로그램 개발 및 효과 검증', submittedDate: '2025-03-27', status: 'assigned', desiredAdvisor: { id: 'PROF008', name: '윤교수' } },
    { id: 'RP019', studentId: 'STU019', studentNumber: '2023009', studentName: '문학생', department: '사회복지학과', degreeType: '박사', title: '아동 복지 제도의 개선 방안', purpose: '아동 학대 예방 및 보호 강화', necessity: '아동 복지 사각지대 존재', method: '정책 분석 및 사례 연구', submittedDate: '2025-03-28', status: 'pending', desiredAdvisor: { id: 'PROF009', name: '장교수' } },
    { id: 'RP020', studentId: 'STU020', studentNumber: '2023010', studentName: '유학생', department: '사회복지학과', degreeType: '박사', title: '다문화 가정 지원 정책 연구', purpose: '다문화 가정의 사회 통합 촉진', necessity: '다문화 사회로의 전환', method: '설문 조사 및 정책 분석', submittedDate: '2025-03-29', status: 'assigned', desiredAdvisor: { id: 'PROF010', name: '임교수' } }
];

// 지도교수 배정 데이터 - coAdvisors 무제한으로 변경
const mockAdvisorAssignments = mockResearchProposals.map((rp, index) => {
    if (rp.status === 'assigned') {
        const professorIndex = index % mockProfessors.length;
        const professor = mockProfessors[professorIndex];

        // 부지도교수는 랜덤하게 0~3명 배정
        const coAdvisorCount = Math.floor(Math.random() * 4);
        const coAdvisors = [];
        for (let i = 0; i < coAdvisorCount; i++) {
            const coAdvisorIndex = (professorIndex + i + 1) % mockProfessors.length;
            const coAdvisor = mockProfessors[coAdvisorIndex];
            if (coAdvisor.id !== professor.id) {
                coAdvisors.push({
                    id: coAdvisor.id,
                    name: coAdvisor.name,
                    department: coAdvisor.department,
                    isTenured: coAdvisor.isTenured
                });
            }
        }

        return {
            studentId: rp.studentId,
            studentNumber: rp.studentNumber,
            studentName: rp.studentName,
            proposalId: rp.id,
            mainAdvisor: {
                id: professor.id,
                name: professor.name,
                department: professor.department,
                isTenured: professor.isTenured
            },
            coAdvisors: coAdvisors,
            assignedDate: rp.submittedDate,
            status: 'assigned'
        };
    } else {
        return {
            studentId: rp.studentId,
            studentNumber: rp.studentNumber,
            studentName: rp.studentName,
            proposalId: rp.id,
            mainAdvisor: null,
            coAdvisors: [],
            assignedDate: null,
            status: 'pending'
        };
    }
});

// 논문 지도 단계 템플릿 데이터
const mockThesisStages = [
    {
        id: 'TS001',
        name: '석사 표준 과정',
        degreeType: 'master',
        stageCount: 5,
        createdDate: '2025-01-01',
        stages: [
            { order: 1, name: '연구계획서 작성', type: 'submission', evaluationRequired: false },
            { order: 2, name: '선행연구 검토', type: 'submission', evaluationRequired: false },
            { order: 3, name: '연구 수행', type: 'submission', evaluationRequired: false },
            { order: 4, name: '논문 작성', type: 'submission', evaluationRequired: false },
            { order: 5, name: '최종 심사', type: 'review', evaluationRequired: true }
        ]
    },
    {
        id: 'TS002',
        name: '박사 표준 과정',
        degreeType: 'phd',
        stageCount: 7,
        createdDate: '2025-01-01',
        stages: [
            { order: 1, name: '연구계획서 작성', type: 'submission', evaluationRequired: false },
            { order: 2, name: '선행연구 검토', type: 'submission', evaluationRequired: false },
            { order: 3, name: '연구 제안서 심사', type: 'review', evaluationRequired: true },
            { order: 4, name: '연구 수행', type: 'submission', evaluationRequired: false },
            { order: 5, name: '예비 논문 심사', type: 'review', evaluationRequired: true },
            { order: 6, name: '논문 작성', type: 'submission', evaluationRequired: false },
            { order: 7, name: '최종 심사', type: 'review', evaluationRequired: true }
        ]
    }
];

// 학생별 논문 지도 단계 배정 데이터
const mockStudentStageAssignments = mockStudents.map((student, index) => {
    const isMaster = student.degreeType === '석사';
    const stageTemplate = isMaster ? mockThesisStages[0] : mockThesisStages[1];
    const currentStageOrder = (index % stageTemplate.stageCount) + 1;
    const currentStage = stageTemplate.stages.find(s => s.order === currentStageOrder);

    return {
        studentId: student.id,
        studentNumber: student.studentNumber,
        studentName: student.name,
        department: student.department,
        degreeType: student.degreeType,
        grade: student.grade,
        thesisStageId: stageTemplate.id,
        thesisStageName: stageTemplate.name,
        currentStageOrder: currentStageOrder,
        currentStageName: currentStage.name,
        currentStageType: currentStage.type,
        canProceed: index % 2 === 0,
        lastUpdated: '2025-03-01'
    };
});
