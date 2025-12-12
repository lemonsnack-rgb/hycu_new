// Mock 데이터 - 프로토타입용 (업데이트됨 - 희망지도교수, 부지도교수 무제한)

// 학과 목록 (간단한 문자열 배열)
const mockDepartmentNames = [
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
    { id: 'RP002', studentId: 'STU002', studentNumber: '2024002', studentName: '이학생', department: '컴퓨터공학과', degreeType: '석사', title: '블록체인 기반 데이터 무결성 보장 방안', purpose: '분산 환경에서의 데이터 보안 강화', necessity: '중앙화된 시스템의 보안 문제 해결', method: '블록체인 기술 적용 및 검증', submittedDate: '2025-03-11', status: 'pending', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP002.pdf' },
    { id: 'RP003', studentId: 'STU003', studentNumber: '2024003', studentName: '박학생', department: '경영학과', degreeType: '석사', title: '디지털 전환 시대의 기업 경쟁력 분석', purpose: '기업의 디지털 전환 성공 요인 도출', necessity: '디지털 전환이 기업 경쟁력에 미치는 영향 연구', method: '사례 연구 및 통계 분석', submittedDate: '2025-03-12', status: 'pending', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP003.pdf' },
    { id: 'RP004', studentId: 'STU004', studentNumber: '2024004', studentName: '최학생', department: '경영학과', degreeType: '석사', title: 'ESG 경영이 기업 가치에 미치는 영향', purpose: 'ESG 경영의 재무적 성과 분석', necessity: 'ESG 경영의 중요성이 대두되고 있음', method: '재무제표 분석 및 회귀분석', submittedDate: '2025-03-13', status: 'assigned', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP004.pdf' },
    { id: 'RP005', studentId: 'STU005', studentNumber: '2024005', studentName: '정학생', department: '교육학과', degreeType: '석사', title: '온라인 교육의 효과성 연구', purpose: '온라인 교육의 학습 효과 분석', necessity: '코로나19 이후 온라인 교육 확대', method: '실험 연구 및 설문 조사', submittedDate: '2025-03-14', status: 'pending', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP005.pdf' },
    { id: 'RP006', studentId: 'STU006', studentNumber: '2024006', studentName: '강학생', department: '교육학과', degreeType: '석사', title: '메타버스를 활용한 교육 프로그램 개발', purpose: '몰입형 교육 환경 구축', necessity: '새로운 교육 매체로서의 메타버스', method: '메타버스 플랫폼 개발 및 효과 검증', submittedDate: '2025-03-15', status: 'assigned', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP006.pdf' },
    { id: 'RP007', studentId: 'STU007', studentNumber: '2024007', studentName: '조학생', department: '심리학과', degreeType: '석사', title: 'SNS 사용이 청소년 심리에 미치는 영향', purpose: 'SNS 사용 패턴과 심리적 건강의 관계 분석', necessity: '청소년의 SNS 사용 증가', method: '설문 조사 및 통계 분석', submittedDate: '2025-03-16', status: 'pending', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP007.pdf' },
    { id: 'RP008', studentId: 'STU008', studentNumber: '2024008', studentName: '윤학생', department: '심리학과', degreeType: '석사', title: '직장인의 스트레스와 대처 방안 연구', purpose: '직장 내 스트레스 관리 방법 제시', necessity: '직장인의 정신 건강 문제 증가', method: '인터뷰 및 질적 연구', submittedDate: '2025-03-17', status: 'assigned', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP008.pdf' },
    { id: 'RP009', studentId: 'STU009', studentNumber: '2024009', studentName: '장학생', department: '사회복지학과', degreeType: '석사', title: '노인 복지 정책의 효과성 분석', purpose: '노인 복지 제도의 개선 방안 제시', necessity: '고령화 사회의 노인 복지 필요성', method: '정책 분석 및 사례 연구', submittedDate: '2025-03-18', status: 'pending', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP009.pdf' },
    { id: 'RP010', studentId: 'STU010', studentNumber: '2024010', studentName: '임학생', department: '사회복지학과', degreeType: '석사', title: '장애인 고용 촉진 방안 연구', purpose: '장애인 고용 정책의 실효성 제고', necessity: '장애인 고용률이 낮은 현실', method: '통계 분석 및 인터뷰', submittedDate: '2025-03-19', status: 'assigned', desiredAdvisor: null, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP010.pdf' },

    // 박사과정 (10명) - desiredAdvisor 포함
    { id: 'RP011', studentId: 'STU011', studentNumber: '2023001', studentName: '한학생', department: '컴퓨터공학과', degreeType: '박사', title: '양자 컴퓨팅 알고리즘 최적화', purpose: '양자 알고리즘의 효율성 향상', necessity: '양자 컴퓨팅의 발전 가능성', method: '양자 시뮬레이터를 활용한 실험', submittedDate: '2025-03-20', status: 'pending', desiredAdvisor: { id: 'PROF001', name: '김교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP011.pdf' },
    { id: 'RP012', studentId: 'STU012', studentNumber: '2023002', studentName: '서학생', department: '컴퓨터공학과', degreeType: '박사', title: '엣지 컴퓨팅 환경에서의 데이터 처리', purpose: '실시간 데이터 처리 성능 개선', necessity: 'IoT 환경에서의 데이터 처리 필요성', method: '엣지 디바이스를 활용한 실험', submittedDate: '2025-03-21', status: 'assigned', desiredAdvisor: { id: 'PROF002', name: '이교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP012.pdf' },
    { id: 'RP013', studentId: 'STU013', studentNumber: '2023003', studentName: '오학생', department: '경영학과', degreeType: '박사', title: '스타트업 성공 요인 분석', purpose: '스타트업의 생존율 향상 방안 제시', necessity: '스타트업 생태계 활성화', method: '다중 회귀 분석', submittedDate: '2025-03-22', status: 'pending', desiredAdvisor: { id: 'PROF003', name: '박교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP013.pdf' },
    { id: 'RP014', studentId: 'STU014', studentNumber: '2023004', studentName: '양학생', department: '경영학과', degreeType: '박사', title: '소셜 미디어 마케팅 전략 연구', purpose: '소셜 미디어를 통한 고객 참여 증대', necessity: '소셜 미디어의 영향력 확대', method: '사례 연구 및 실험', submittedDate: '2025-03-23', status: 'assigned', desiredAdvisor: { id: 'PROF004', name: '최교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP014.pdf' },
    { id: 'RP015', studentId: 'STU015', studentNumber: '2023005', studentName: '권학생', department: '교육학과', degreeType: '박사', title: '평생 교육 프로그램 효과성 평가', purpose: '성인 학습자의 교육 효과 극대화', necessity: '평생 교육의 중요성 증가', method: '종단 연구', submittedDate: '2025-03-24', status: 'pending', desiredAdvisor: { id: 'PROF005', name: '정교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP015.pdf' },
    { id: 'RP016', studentId: 'STU016', studentNumber: '2023006', studentName: '송학생', department: '교육학과', degreeType: '박사', title: '창의성 교육 프로그램 개발', purpose: '학습자의 창의력 향상', necessity: '창의적 인재 양성의 필요성', method: '프로그램 개발 및 효과 검증', submittedDate: '2025-03-25', status: 'assigned', desiredAdvisor: { id: 'PROF006', name: '강교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP016.pdf' },
    { id: 'RP017', studentId: 'STU017', studentNumber: '2023007', studentName: '백학생', department: '심리학과', degreeType: '박사', title: '외상 후 스트레스 장애 치료 방법 연구', purpose: 'PTSD 환자의 치료 효과 향상', necessity: 'PTSD 치료의 어려움', method: '임상 실험 및 질적 분석', submittedDate: '2025-03-26', status: 'pending', desiredAdvisor: { id: 'PROF007', name: '조교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP017.pdf' },
    { id: 'RP018', studentId: 'STU018', studentNumber: '2023008', studentName: '남학생', department: '심리학과', degreeType: '박사', title: '긍정 심리학 기반 행복 증진 프로그램', purpose: '개인의 행복감 향상', necessity: '긍정 심리학의 발전', method: '프로그램 개발 및 효과 검증', submittedDate: '2025-03-27', status: 'assigned', desiredAdvisor: { id: 'PROF008', name: '윤교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP018.pdf' },
    { id: 'RP019', studentId: 'STU019', studentNumber: '2023009', studentName: '문학생', department: '사회복지학과', degreeType: '박사', title: '아동 복지 제도의 개선 방안', purpose: '아동 학대 예방 및 보호 강화', necessity: '아동 복지 사각지대 존재', method: '정책 분석 및 사례 연구', submittedDate: '2025-03-28', status: 'pending', desiredAdvisor: { id: 'PROF009', name: '장교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP019.pdf' },
    { id: 'RP020', studentId: 'STU020', studentNumber: '2023010', studentName: '유학생', department: '사회복지학과', degreeType: '박사', title: '다문화 가정 지원 정책 연구', purpose: '다문화 가정의 사회 통합 촉진', necessity: '다문화 사회로의 전환', method: '설문 조사 및 정책 분석', submittedDate: '2025-03-29', status: 'assigned', desiredAdvisor: { id: 'PROF010', name: '임교수' }, formUrl: 'https://school-system.hycu.ac.kr/research-proposal/RP020.pdf' }
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

// 논문 지도 단계 템플릿 데이터 (워크플로우)
const mockThesisStages = [
    {
        id: 'TS001',
        name: '석사 표준 과정',
        degreeType: 'master',
        stageCount: 5,
        createdDate: '2025-01-01',
        stages: [
            {
                id: 'STAGE_TS001_001',
                order: 1,
                stepTypeId: 'ST001', // 구버전 호환용
                categoryId: 'CAT_001', // 신규 필드
                name: '연구계획서 제출',
                type: 'submission',
                evaluationRequired: false,
                requiresDocument: true,
                requiresPresentation: false,
                submissionStartDate: '2025-03-01',
                submissionEndDate: '2025-03-31',
                evaluationTemplateId: '',
                reviewStartDate: '',
                reviewEndDate: '',
                description: '연구 주제 및 방법을 문서로 제출'
            },
            {
                id: 'STAGE_TS001_002',
                order: 2,
                stepTypeId: 'ST004',
                categoryId: 'CAT_005',
                name: '선행연구 검토',
                type: 'submission',
                evaluationRequired: false,
                requiresDocument: true,
                requiresPresentation: false,
                submissionStartDate: '2025-04-01',
                submissionEndDate: '2025-04-30',
                evaluationTemplateId: '',
                reviewStartDate: '',
                reviewEndDate: '',
                description: '관련 선행연구 검토 및 요약'
            },
            {
                id: 'STAGE_TS001_003',
                order: 3,
                stepTypeId: 'ST005',
                categoryId: 'CAT_005',
                name: '연구 수행',
                type: 'submission',
                evaluationRequired: false,
                requiresDocument: true,
                requiresPresentation: false,
                submissionStartDate: '2025-05-01',
                submissionEndDate: '2025-08-31',
                evaluationTemplateId: '',
                reviewStartDate: '',
                reviewEndDate: '',
                description: '실제 연구 수행 및 데이터 수집'
            },
            {
                id: 'STAGE_TS001_004',
                order: 4,
                stepTypeId: 'ST006',
                categoryId: 'CAT_005',
                name: '논문 작성',
                type: 'submission',
                evaluationRequired: false,
                requiresDocument: true,
                requiresPresentation: false,
                submissionStartDate: '2025-09-01',
                submissionEndDate: '2025-10-31',
                evaluationTemplateId: '',
                reviewStartDate: '',
                reviewEndDate: '',
                description: '연구 결과를 논문으로 작성'
            },
            {
                id: 'STAGE_TS001_005',
                order: 5,
                stepTypeId: 'ST003',
                categoryId: 'CAT_003',
                name: '본심사',
                type: 'review',
                evaluationRequired: true,
                requiresDocument: true,
                requiresPresentation: true,
                submissionStartDate: '2025-11-01',
                submissionEndDate: '2025-11-15',
                evaluationTemplateId: 'EVAL002',
                reviewStartDate: '2025-11-20',
                reviewEndDate: '2025-12-05',
                description: '최종 논문 본심사'
            }
        ]
    },
    {
        id: 'TS002',
        name: '박사 표준 과정',
        degreeType: 'phd',
        stageCount: 7,
        createdDate: '2025-01-01',
        stages: [
            {
                id: 'STAGE_TS002_001',
                order: 1,
                stepTypeId: 'ST001',
                categoryId: 'CAT_001',
                name: '연구계획서 제출',
                type: 'submission',
                evaluationRequired: false,
                requiresDocument: true,
                requiresPresentation: false,
                submissionStartDate: '2025-03-01',
                submissionEndDate: '2025-03-31',
                evaluationTemplateId: '',
                reviewStartDate: '',
                reviewEndDate: '',
                description: '연구 주제 및 방법을 문서로 제출'
            },
            {
                id: 'STAGE_TS002_002',
                order: 2,
                stepTypeId: 'ST004',
                categoryId: 'CAT_005',
                name: '선행연구 검토',
                type: 'submission',
                evaluationRequired: false,
                requiresDocument: true,
                requiresPresentation: false,
                submissionStartDate: '2025-04-01',
                submissionEndDate: '2025-04-30',
                evaluationTemplateId: '',
                reviewStartDate: '',
                reviewEndDate: '',
                description: '관련 선행연구 검토 및 요약'
            },
            {
                id: 'STAGE_TS002_003',
                order: 3,
                stepTypeId: 'ST007',
                categoryId: 'CAT_002',
                name: '연구제안서 심사',
                type: 'review',
                evaluationRequired: true,
                requiresDocument: true,
                requiresPresentation: true,
                submissionStartDate: '2025-05-01',
                submissionEndDate: '2025-05-15',
                evaluationTemplateId: 'EVAL003',
                reviewStartDate: '2025-05-20',
                reviewEndDate: '2025-06-05',
                description: '박사과정 연구제안서 심사'
            },
            {
                id: 'STAGE_TS002_004',
                order: 4,
                stepTypeId: 'ST005',
                categoryId: 'CAT_005',
                name: '연구 수행',
                type: 'submission',
                evaluationRequired: false,
                requiresDocument: true,
                requiresPresentation: false,
                submissionStartDate: '2025-06-10',
                submissionEndDate: '2025-09-30',
                evaluationTemplateId: '',
                reviewStartDate: '',
                reviewEndDate: '',
                description: '실제 연구 수행 및 데이터 수집'
            },
            {
                id: 'STAGE_TS002_005',
                order: 5,
                stepTypeId: 'ST002',
                categoryId: 'CAT_002',
                name: '예비심사',
                type: 'review',
                evaluationRequired: true,
                requiresDocument: true,
                requiresPresentation: true,
                submissionStartDate: '2025-10-01',
                submissionEndDate: '2025-10-15',
                evaluationTemplateId: 'EVAL001',
                reviewStartDate: '2025-10-20',
                reviewEndDate: '2025-11-05',
                description: '논문 초안 예비심사'
            },
            {
                id: 'STAGE_TS002_006',
                order: 6,
                stepTypeId: 'ST006',
                categoryId: 'CAT_005',
                name: '논문 작성',
                type: 'submission',
                evaluationRequired: false,
                requiresDocument: true,
                requiresPresentation: false,
                submissionStartDate: '2025-11-10',
                submissionEndDate: '2025-12-20',
                evaluationTemplateId: '',
                reviewStartDate: '',
                reviewEndDate: '',
                description: '연구 결과를 논문으로 작성'
            },
            {
                id: 'STAGE_TS002_007',
                order: 7,
                stepTypeId: 'ST003',
                categoryId: 'CAT_003',
                name: '본심사',
                type: 'review',
                evaluationRequired: true,
                requiresDocument: true,
                requiresPresentation: true,
                submissionStartDate: '2025-12-25',
                submissionEndDate: '2026-01-10',
                evaluationTemplateId: 'EVAL002',
                reviewStartDate: '2026-01-15',
                reviewEndDate: '2026-01-30',
                description: '최종 논문 본심사'
            }
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
        lastUpdated: '2025-03-01',
        workflowAssignedDate: '2025-03-01',  // 워크플로우 최초 배정일
        workflowLastChangedDate: null,       // 마지막 변경일 (변경 없으면 null)
        isWorkflowChanged: false             // 워크플로우 변경 여부
    };
});

// 심사 단계 미배정 학생 추가 (일 배치로 가져온 신규 학생)
mockStudentStageAssignments.push(
    {
        studentId: 'STU021',
        studentNumber: '2025001',
        studentName: '신규학생1',
        department: '컴퓨터공학과',
        degreeType: '석사',
        grade: '석사1차',
        thesisStageId: null,
        thesisStageName: null,
        currentStageOrder: null,
        currentStageName: null,
        currentStageType: null,
        canProceed: false,
        lastUpdated: '2025-03-01',
        workflowAssignedDate: null,
        workflowLastChangedDate: null,
        isWorkflowChanged: false
    },
    {
        studentId: 'STU022',
        studentNumber: '2025002',
        studentName: '신규학생2',
        department: '경영학과',
        degreeType: '석사',
        grade: '석사1차',
        thesisStageId: null,
        thesisStageName: null,
        currentStageOrder: null,
        currentStageName: null,
        currentStageType: null,
        canProceed: false,
        lastUpdated: '2025-03-01',
        workflowAssignedDate: null,
        workflowLastChangedDate: null,
        isWorkflowChanged: false
    },
    {
        studentId: 'STU023',
        studentNumber: '2025003',
        studentName: '신규학생3',
        department: '사회복지학과',
        degreeType: '석사',
        grade: '석사1차',
        thesisStageId: null,
        thesisStageName: null,
        currentStageOrder: null,
        currentStageName: null,
        currentStageType: null,
        canProceed: false,
        lastUpdated: '2025-03-01',
        workflowAssignedDate: null,
        workflowLastChangedDate: null,
        isWorkflowChanged: false
    },
    {
        studentId: 'STU024',
        studentNumber: '2025004',
        studentName: '신규학생4',
        department: '교육학과',
        degreeType: '박사',
        grade: '박사1차',
        thesisStageId: null,
        thesisStageName: null,
        currentStageOrder: null,
        currentStageName: null,
        currentStageType: null,
        canProceed: false,
        lastUpdated: '2025-03-01',
        workflowAssignedDate: null,
        workflowLastChangedDate: null,
        isWorkflowChanged: false
    },
    {
        studentId: 'STU025',
        studentNumber: '2025005',
        studentName: '신규학생5',
        department: '심리학과',
        degreeType: '박사',
        grade: '박사1차',
        thesisStageId: null,
        thesisStageName: null,
        currentStageOrder: null,
        currentStageName: null,
        currentStageType: null,
        canProceed: false,
        lastUpdated: '2025-03-01',
        workflowAssignedDate: null,
        workflowLastChangedDate: null,
        isWorkflowChanged: false
    }
);

// 심사 대상 학생 데이터 (심사 신청한 학생)
// 심사 유형: 'proposal' (연구계획서), 'progress' (1차 보고서), 'final' (최종논문)
const mockReviewTargets = [
    // 연구계획서 심사 대상 (5명)
    { id: 'RT001', studentId: 'STU002', studentNumber: '2024002', studentName: '이학생', department: '컴퓨터공학과', degreeType: '석사', academicYear: '2025', semesterCount: 4, reviewType: 'proposal', title: '블록체인 기반 데이터 무결성 보장 방안', submittedDate: '2025-03-11', advisorId: 'PROF001', advisorName: '김교수', status: 'pending' },
    { id: 'RT002', studentId: 'STU003', studentNumber: '2024003', studentName: '박학생', department: '경영학과', degreeType: '석사', academicYear: '2025', semesterCount: 4, reviewType: 'proposal', title: '디지털 전환 시대의 기업 경쟁력 분석', submittedDate: '2025-03-12', advisorId: 'PROF003', advisorName: '박교수', status: 'pending' },
    { id: 'RT003', studentId: 'STU005', studentNumber: '2024005', studentName: '정학생', department: '교육학과', degreeType: '석사', academicYear: '2025', semesterCount: 4, reviewType: 'proposal', title: '온라인 교육의 효과성 연구', submittedDate: '2025-03-14', advisorId: 'PROF005', advisorName: '정교수', status: 'pending' },
    { id: 'RT004', studentId: 'STU007', studentNumber: '2024007', studentName: '조학생', department: '심리학과', degreeType: '석사', academicYear: '2025', semesterCount: 4, reviewType: 'proposal', title: 'SNS 사용이 청소년 심리에 미치는 영향', submittedDate: '2025-03-16', advisorId: 'PROF007', advisorName: '조교수', status: 'pending' },
    { id: 'RT005', studentId: 'STU009', studentNumber: '2024009', studentName: '장학생', department: '사회복지학과', degreeType: '석사', academicYear: '2025', semesterCount: 4, reviewType: 'proposal', title: '노인 복지 정책의 효과성 분석', submittedDate: '2025-03-18', advisorId: 'PROF009', advisorName: '장교수', status: 'pending' },

    // 최종논문 심사 대상 (3명) - 이미 심사위원 배정 완료
    { id: 'RT006', studentId: 'STU004', studentNumber: '2024004', studentName: '최학생', department: '경영학과', degreeType: '석사', academicYear: '2024', semesterCount: 5, reviewType: 'final', title: 'ESG 경영이 기업 가치에 미치는 영향', submittedDate: '2025-02-15', advisorId: 'PROF003', advisorName: '박교수', status: 'assigned' },
    { id: 'RT007', studentId: 'STU006', studentNumber: '2024006', studentName: '강학생', department: '교육학과', degreeType: '석사', academicYear: '2024', semesterCount: 5, reviewType: 'final', title: '메타버스를 활용한 교육 프로그램 개발', submittedDate: '2025-02-16', advisorId: 'PROF005', advisorName: '정교수', status: 'assigned' },
    { id: 'RT008', studentId: 'STU008', studentNumber: '2024008', studentName: '윤학생', department: '심리학과', degreeType: '석사', academicYear: '2024', semesterCount: 5, reviewType: 'final', title: '직장인의 스트레스와 대처 방안 연구', submittedDate: '2025-02-17', advisorId: 'PROF007', advisorName: '조교수', status: 'assigned' },

    // 박사 최종논문 심사 대상 (2명)
    { id: 'RT009', studentId: 'STU014', studentNumber: '2023004', studentName: '양학생', department: '경영학과', degreeType: '박사', academicYear: '2023', semesterCount: 7, reviewType: 'final', title: '빅데이터 분석을 통한 소비자 행동 예측 모델', submittedDate: '2025-02-20', advisorId: 'PROF004', advisorName: '이교수', status: 'pending' },
    { id: 'RT010', studentId: 'STU016', studentNumber: '2023006', studentName: '송학생', department: '교육학과', degreeType: '박사', academicYear: '2023', semesterCount: 7, reviewType: 'final', title: '인공지능 기반 개인화 학습 시스템 설계', submittedDate: '2025-02-21', advisorId: 'PROF006', advisorName: '강교수', status: 'pending' }
];

// 심사위원 배정 데이터
const mockCommitteeAssignments = [
    // RT006 (최학생 - 석사 최종논문) - 심사위원 배정 완료
    {
        id: 'CA001',
        reviewTargetId: 'RT006',
        studentId: 'STU004',
        studentNumber: '2024004',
        studentName: '최학생',
        department: '경영학과',
        degreeType: '석사',
        reviewType: 'final',

        // 논문 지도 단계 정보
        thesisStageId: 'TS001',
        stageId: 'STAGE_TS001_005',
        stageName: '본심사',
        stageOrder: 5,

        chairId: 'PROF003', // 심사위원장 (지도교수)
        chairName: '박교수',
        members: [
            { professorId: 'PROF003', professorName: '박교수', role: 'chair', department: '경영학과' },
            { professorId: 'PROF004', professorName: '이교수', role: 'member', department: '경영학과' },
            { professorId: 'PROF002', professorName: '이교수', role: 'member', department: '컴퓨터공학과' }
        ],
        assignedDate: '2025-02-20',
        status: 'completed'
    },
    // RT007 (강학생 - 석사 최종논문) - 심사위원 배정 완료
    {
        id: 'CA002',
        reviewTargetId: 'RT007',
        studentId: 'STU006',
        studentNumber: '2024006',
        studentName: '강학생',
        department: '교육학과',
        degreeType: '석사',
        reviewType: 'final',

        // 논문 지도 단계 정보
        thesisStageId: 'TS001',
        stageId: 'STAGE_TS001_005',
        stageName: '본심사',
        stageOrder: 5,

        chairId: 'PROF005',
        chairName: '정교수',
        members: [
            { professorId: 'PROF005', professorName: '정교수', role: 'chair', department: '교육학과' },
            { professorId: 'PROF006', professorName: '강교수', role: 'member', department: '교육학과' },
            { professorId: 'PROF002', professorName: '이교수', role: 'member', department: '컴퓨터공학과' }
        ],
        assignedDate: '2025-02-21',
        status: 'completed'
    },
    // RT008 (윤학생 - 박사 최종논문) - 심사위원 배정 완료
    {
        id: 'CA003',
        reviewTargetId: 'RT008',
        studentId: 'STU008',
        studentNumber: '2024008',
        studentName: '윤학생',
        department: '심리학과',
        degreeType: '박사',
        reviewType: 'final',

        // 논문 지도 단계 정보 (박사 - 예비심사)
        thesisStageId: 'TS002',
        stageId: 'STAGE_TS002_005',
        stageName: '예비심사',
        stageOrder: 5,

        chairId: 'PROF007',
        chairName: '조교수',
        members: [
            { professorId: 'PROF007', professorName: '조교수', role: 'chair', department: '심리학과' },
            { professorId: 'PROF008', professorName: '윤교수', role: 'member', department: '심리학과' },
            { professorId: 'PROF005', professorName: '정교수', role: 'member', department: '교육학과' }
        ],
        assignedDate: '2025-02-22',
        status: 'completed'
    }
];

// =============================================================================
// 단계 유형 데이터 (Step Types - 레고 블록)
// =============================================================================

// 신규: 단계 카테고리 (단순 분류자 - 설정 상속 없음)
const mockStageCategories = [
    { id: 'CAT_001', name: '연구계획서 제출' },
    { id: 'CAT_002', name: '예비심사' },
    { id: 'CAT_003', name: '본심사' },
    { id: 'CAT_004', name: '최종심사' },
    { id: 'CAT_005', name: '기타' }
];

// 구버전 호환용 (추후 제거 예정)
const mockStepTypes = [
    {
        id: 'ST001',
        name: '연구계획서 제출',
        type: 'submission', // 'submission' | 'review'
        requiresDocument: true,
        requiresPresentation: false,
        evaluationTemplateId: null,
        description: '연구 주제 및 연구 방법을 문서로 제출하는 단계',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST002',
        name: '예비심사',
        type: 'review',
        requiresDocument: true,
        requiresPresentation: true,
        evaluationTemplateId: 'EVAL001',
        description: '논문 초안에 대한 예비 심사 진행',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST003',
        name: '본심사',
        type: 'review',
        requiresDocument: true,
        requiresPresentation: true,
        evaluationTemplateId: 'EVAL002',
        description: '최종 논문에 대한 본심사 진행',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST004',
        name: '선행연구 검토',
        type: 'submission',
        requiresDocument: true,
        requiresPresentation: false,
        evaluationTemplateId: null,
        description: '관련 선행연구를 검토하고 요약 보고서 제출',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST005',
        name: '연구 수행',
        type: 'submission',
        requiresDocument: true,
        requiresPresentation: false,
        evaluationTemplateId: null,
        description: '실제 연구를 수행하고 데이터 수집',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST006',
        name: '논문 작성',
        type: 'submission',
        requiresDocument: true,
        requiresPresentation: false,
        evaluationTemplateId: null,
        description: '연구 결과를 바탕으로 논문 작성',
        createdDate: '2025-01-01'
    },
    {
        id: 'ST007',
        name: '연구제안서 심사',
        type: 'review',
        requiresDocument: true,
        requiresPresentation: true,
        evaluationTemplateId: 'EVAL003',
        description: '박사과정 연구제안서에 대한 심사',
        createdDate: '2025-01-01'
    }
];

// 평가표 템플릿 (간단한 참조용)
const mockEvaluationTemplates = [
    { id: 'EVAL001', name: '예비 심사 평가표', type: 'score' },
    { id: 'EVAL002', name: '학위 논문 심사 평가표', type: 'score' },
    { id: 'EVAL003', name: '연구제안서 심사 평가표', type: 'score' }
];

// =============================================================================
// 권한 관리 데이터
// =============================================================================

// 역할 (Role)
const mockRoles = [
    {
        id: 'ROLE_ADMIN',
        name: '관리자',
        code: 'admin',
        description: '시스템 전체 관리 권한',
        level: 1,
        isSystem: true
    },
    {
        id: 'ROLE_PROFESSOR',
        name: '교수',
        code: 'professor',
        description: '논문지도 및 심사 권한',
        level: 2,
        isSystem: true
    },
    {
        id: 'ROLE_STUDENT',
        name: '학생',
        code: 'student',
        description: '논문 제출 및 조회 권한',
        level: 3,
        isSystem: true
    }
];

// 권한 (Permission)
const mockPermissions = [
    // 메뉴 접근 권한
    { id: 'PERM_MENU_DASHBOARD', name: '대시보드 접근', code: 'menu.dashboard', category: 'menu', description: '대시보드 메뉴 접근 권한' },
    { id: 'PERM_MENU_RESEARCH_PROPOSAL', name: '연구계획서 메뉴', code: 'menu.research_proposal', category: 'menu', description: '연구계획서 관리 메뉴' },
    { id: 'PERM_MENU_THESIS_PLAN', name: '논문작성계획서 메뉴', code: 'menu.thesis_plan', category: 'menu', description: '논문작성계획서 관리 메뉴' },
    { id: 'PERM_MENU_MID_THESIS', name: '중간논문 메뉴', code: 'menu.mid_thesis', category: 'menu', description: '중간논문 관리 메뉴' },
    { id: 'PERM_MENU_FINAL_THESIS', name: '최종논문 메뉴', code: 'menu.final_thesis', category: 'menu', description: '최종논문 관리 메뉴' },
    { id: 'PERM_MENU_JOURNAL', name: '학술지 심사 메뉴', code: 'menu.journal_submission', category: 'menu', description: '학술지 심사 신청 메뉴' },
    { id: 'PERM_MENU_GUIDANCE_PROGRESS', name: '논문지도 진행 메뉴', code: 'menu.guidance_progress', category: 'menu', description: '논문지도 진행 현황 메뉴' },
    { id: 'PERM_MENU_SCHEDULE', name: '일정 관리 메뉴', code: 'menu.schedule_management', category: 'menu', description: '논문지도 일정 관리 메뉴' },
    { id: 'PERM_MENU_REQUIREMENT', name: '제출 요건 메뉴', code: 'menu.requirement_management', category: 'menu', description: '논문 제출 요건 관리 메뉴' },
    { id: 'PERM_MENU_STAGE', name: '단계 관리 메뉴', code: 'menu.stage_management', category: 'menu', description: '논문지도 단계 관리 메뉴' },
    { id: 'PERM_MENU_TYPE', name: '단계 유형 메뉴', code: 'menu.type_management', category: 'menu', description: '지도 단계 유형 관리 메뉴' },
    { id: 'PERM_MENU_COMMITTEE', name: '심사위원 배정 메뉴', code: 'menu.committee_assignment', category: 'menu', description: '심사위원 배정 메뉴' },
    { id: 'PERM_MENU_EVALUATION', name: '평가 기준 메뉴', code: 'menu.evaluation_criteria', category: 'menu', description: '평가 기준 관리 메뉴' },
    { id: 'PERM_MENU_ADVISOR', name: '지도교수 배정 메뉴', code: 'menu.advisor_assignment', category: 'menu', description: '지도교수 배정 메뉴' },

    // 기능 실행 권한 (CRUD)
    { id: 'PERM_RESEARCH_PROPOSAL_VIEW', name: '연구계획서 조회', code: 'research_proposal.view', category: 'feature', description: '연구계획서 조회 권한' },
    { id: 'PERM_RESEARCH_PROPOSAL_CREATE', name: '연구계획서 생성', code: 'research_proposal.create', category: 'feature', description: '연구계획서 생성 권한' },
    { id: 'PERM_RESEARCH_PROPOSAL_UPDATE', name: '연구계획서 수정', code: 'research_proposal.update', category: 'feature', description: '연구계획서 수정 권한' },
    { id: 'PERM_RESEARCH_PROPOSAL_DELETE', name: '연구계획서 삭제', code: 'research_proposal.delete', category: 'feature', description: '연구계획서 삭제 권한' },

    { id: 'PERM_ADVISOR_ASSIGN', name: '지도교수 배정', code: 'advisor.assign', category: 'feature', description: '지도교수 배정 권한' },
    { id: 'PERM_COMMITTEE_ASSIGN', name: '심사위원 배정', code: 'committee.assign', category: 'feature', description: '심사위원 배정 권한' },
    { id: 'PERM_STAGE_MANAGE', name: '단계 이관', code: 'stage.manage', category: 'feature', description: '학생 단계 이관 권한' },
    { id: 'PERM_EVALUATION_MANAGE', name: '평가표 관리', code: 'evaluation.manage', category: 'feature', description: '평가표 생성/수정/삭제 권한' },

    // 데이터 레벨 권한
    { id: 'PERM_DATA_VIEW_ALL', name: '모든 데이터 조회', code: 'data.view_all', category: 'data', description: '모든 학생 데이터 조회 권한' },
    { id: 'PERM_DATA_VIEW_OWN', name: '본인 데이터 조회', code: 'data.view_own', category: 'data', description: '본인 데이터만 조회 권한' },
    { id: 'PERM_DATA_VIEW_ASSIGNED', name: '담당 학생 데이터 조회', code: 'data.view_assigned', category: 'data', description: '지도학생 데이터 조회 권한' },

    // 관리자 전용 권한
    { id: 'PERM_ADMIN_ROLE_MANAGE', name: '역할 관리', code: 'admin.role.manage', category: 'admin', description: '역할 생성/수정/삭제 권한' },
    { id: 'PERM_ADMIN_PERMISSION_MANAGE', name: '권한 관리', code: 'admin.permission.manage', category: 'admin', description: '권한 부여/회수 권한' },
    { id: 'PERM_ADMIN_USER_MANAGE', name: '사용자 관리', code: 'admin.user.manage', category: 'admin', description: '사용자 생성/수정/삭제 권한' }
];

// 역할-권한 매핑
const mockRolePermissions = [
    // 관리자 - 모든 권한
    {
        roleId: 'ROLE_ADMIN',
        permissionIds: [
            // 메뉴 권한
            'PERM_MENU_DASHBOARD',
            'PERM_MENU_RESEARCH_PROPOSAL',
            'PERM_MENU_THESIS_PLAN',
            'PERM_MENU_MID_THESIS',
            'PERM_MENU_FINAL_THESIS',
            'PERM_MENU_JOURNAL',
            'PERM_MENU_GUIDANCE_PROGRESS',
            'PERM_MENU_SCHEDULE',
            'PERM_MENU_REQUIREMENT',
            'PERM_MENU_STAGE',
            'PERM_MENU_TYPE',
            'PERM_MENU_COMMITTEE',
            'PERM_MENU_EVALUATION',
            'PERM_MENU_ADVISOR',
            // 기능 권한
            'PERM_RESEARCH_PROPOSAL_VIEW',
            'PERM_RESEARCH_PROPOSAL_CREATE',
            'PERM_RESEARCH_PROPOSAL_UPDATE',
            'PERM_RESEARCH_PROPOSAL_DELETE',
            'PERM_ADVISOR_ASSIGN',
            'PERM_COMMITTEE_ASSIGN',
            'PERM_STAGE_MANAGE',
            'PERM_EVALUATION_MANAGE',
            // 데이터 권한
            'PERM_DATA_VIEW_ALL',
            // 관리자 권한
            'PERM_ADMIN_ROLE_MANAGE',
            'PERM_ADMIN_PERMISSION_MANAGE',
            'PERM_ADMIN_USER_MANAGE'
        ]
    },
    // 교수 - 지도학생 관련 권한
    {
        roleId: 'ROLE_PROFESSOR',
        permissionIds: [
            // 메뉴 권한
            'PERM_MENU_DASHBOARD',
            'PERM_MENU_RESEARCH_PROPOSAL',
            'PERM_MENU_THESIS_PLAN',
            'PERM_MENU_MID_THESIS',
            'PERM_MENU_FINAL_THESIS',
            'PERM_MENU_GUIDANCE_PROGRESS',
            // 기능 권한
            'PERM_RESEARCH_PROPOSAL_VIEW',
            'PERM_RESEARCH_PROPOSAL_UPDATE',
            // 데이터 권한
            'PERM_DATA_VIEW_ASSIGNED'
        ]
    },
    // 학생 - 본인 데이터만
    {
        roleId: 'ROLE_STUDENT',
        permissionIds: [
            // 메뉴 권한
            'PERM_MENU_DASHBOARD',
            'PERM_MENU_RESEARCH_PROPOSAL',
            'PERM_MENU_THESIS_PLAN',
            'PERM_MENU_MID_THESIS',
            'PERM_MENU_FINAL_THESIS',
            // 기능 권한
            'PERM_RESEARCH_PROPOSAL_VIEW',
            'PERM_RESEARCH_PROPOSAL_CREATE',
            'PERM_RESEARCH_PROPOSAL_UPDATE',
            // 데이터 권한
            'PERM_DATA_VIEW_OWN'
        ]
    }
];

// 사용자 (User)
const mockUsers = [
    {
        id: 'USER_ADMIN_001',
        username: 'admin',
        name: '시스템 관리자',
        roleId: 'ROLE_ADMIN',
        email: 'admin@hycu.ac.kr',
        department: null,
        employeeNumber: null,
        studentNumber: null,
        status: 'active'
    },
    {
        id: 'USER_PROF_001',
        username: 'prof001',
        name: '김교수',
        roleId: 'ROLE_PROFESSOR',
        email: 'kim@hycu.ac.kr',
        department: '컴퓨터공학과',
        employeeNumber: 'P2020001',
        studentNumber: null,
        status: 'active'
    },
    {
        id: 'USER_STU_001',
        username: 'stu001',
        name: '김학생',
        roleId: 'ROLE_STUDENT',
        email: 'stu001@hycu.ac.kr',
        department: '컴퓨터공학과',
        employeeNumber: null,
        studentNumber: '2024001',
        status: 'active'
    }
];

// =============================================================================
// ERP 연동 기반 권한 관리 데이터
// =============================================================================

// ERP 부서 정보 (ERP View에서 동기화)
const mockDepartments = [
    {
        id: 'DEPT_001',
        code: 'DEPT_001',
        name: '교무학사팀',
        type: 'admin',
        parentId: null,
        memberCount: 12,
        erpSyncDate: '2025-01-15 09:00:00'
    },
    {
        id: 'DEPT_002',
        code: 'DEPT_002',
        name: '학생지원팀',
        type: 'admin',
        parentId: null,
        memberCount: 8,
        erpSyncDate: '2025-01-15 09:00:00'
    },
    {
        id: 'DEPT_003',
        code: 'DEPT_003',
        name: '경영학과',
        type: 'academic',
        parentId: null,
        memberCount: 45,
        erpSyncDate: '2025-01-15 09:00:00'
    },
    {
        id: 'DEPT_004',
        code: 'DEPT_004',
        name: '컴퓨터공학과',
        type: 'academic',
        parentId: null,
        memberCount: 52,
        erpSyncDate: '2025-01-15 09:00:00'
    },
    {
        id: 'DEPT_005',
        code: 'DEPT_005',
        name: '입학관리팀',
        type: 'admin',
        parentId: null,
        memberCount: 6,
        erpSyncDate: '2025-01-15 09:00:00'
    }
];

// 신분 정보 (ERP 기준)
const mockPositions = [
    {
        id: 'POS_001',
        code: 'PROF_FULL',
        name: '전임교원',
        category: 'professor',
        description: '교수/부교수/조교수',
        memberCount: 45
    },
    {
        id: 'POS_002',
        code: 'PROF_PART',
        name: '비전임교원',
        category: 'professor',
        description: '겸임/초빙교수',
        memberCount: 23
    },
    {
        id: 'POS_003',
        code: 'STAFF',
        name: '직원',
        category: 'staff',
        description: '행정직원',
        memberCount: 34
    },
    {
        id: 'POS_004',
        code: 'STUDENT',
        name: '학생',
        category: 'student',
        description: '대학원생',
        memberCount: 1234
    }
];

// 역할 그룹 (쿼리 기반 동적 그룹)
const mockRoleGroups = [
    {
        id: 'ROLEGROUP_001',
        name: '논문심사위원',
        description: '논문 심사 권한을 가진 교수진',
        query: 'position=PROF_FULL AND status=active',
        memberCount: 38,
        createdBy: 'admin',
        createdDate: '2025-01-10'
    },
    {
        id: 'ROLEGROUP_002',
        name: '졸업사정담당',
        description: '졸업 사정 업무 담당자',
        query: 'department=DEPT_001 AND role=graduation_officer',
        memberCount: 3,
        createdBy: 'admin',
        createdDate: '2025-01-10'
    },
    {
        id: 'ROLEGROUP_003',
        name: '논문관리자',
        description: '논문 시스템 전체 관리자',
        query: 'department=DEPT_001 AND position=STAFF',
        memberCount: 5,
        createdBy: 'admin',
        createdDate: '2025-01-10'
    }
];

// 사용자 재직/재학 상태
const mockUserStatus = [
    {
        userId: 'admin',
        status: 'active',
        statusName: '재직',
        statusCode: 'ACTIVE',
        canWrite: true
    },
    {
        userId: 'prof001',
        status: 'active',
        statusName: '재직',
        statusCode: 'ACTIVE',
        canWrite: true
    },
    {
        userId: 'prof002',
        status: 'leave',
        statusName: '휴직',
        statusCode: 'LEAVE',
        canWrite: false,
        leaveStartDate: '2024-12-01',
        leaveEndDate: '2025-02-28'
    },
    {
        userId: 'stu001',
        status: 'active',
        statusName: '재학',
        statusCode: 'ACTIVE',
        canWrite: true
    }
];

// 메뉴 구조 (CRUD 세분화)
const mockMenus = [
    // 1depth: 논문 안내
    {
        id: 'MENU_001',
        parentId: null,
        name: '논문 안내',
        code: 'guidance_info',
        depth: 1,
        order: 1
    },
    {
        id: 'MENU_001_001',
        parentId: 'MENU_001',
        name: '공지사항',
        code: 'notice',
        depth: 2,
        order: 1
    },
    {
        id: 'MENU_001_002',
        parentId: 'MENU_001',
        name: '자료실',
        code: 'board',
        depth: 2,
        order: 2
    },
    {
        id: 'MENU_001_003',
        parentId: 'MENU_001',
        name: '연구윤리',
        code: 'ethics',
        depth: 2,
        order: 3
    },
    // 1depth: 논문 제출
    {
        id: 'MENU_002',
        parentId: null,
        name: '논문 제출',
        code: 'thesis_submission',
        depth: 1,
        order: 2
    },
    {
        id: 'MENU_002_001',
        parentId: 'MENU_002',
        name: '연구계획서 제출',
        code: 'research_proposal',
        depth: 2,
        order: 1
    },
    {
        id: 'MENU_002_002',
        parentId: 'MENU_002',
        name: '중간논문 제출',
        code: 'mid_thesis',
        depth: 2,
        order: 2
    },
    {
        id: 'MENU_002_003',
        parentId: 'MENU_002',
        name: '최종논문 제출',
        code: 'final_thesis',
        depth: 2,
        order: 3
    },
    // 1depth: 논문 지도
    {
        id: 'MENU_003',
        parentId: null,
        name: '논문 지도',
        code: 'thesis_guidance',
        depth: 1,
        order: 3
    },
    {
        id: 'MENU_003_001',
        parentId: 'MENU_003',
        name: '지도교수 배정',
        code: 'advisor_assignment',
        depth: 2,
        order: 1
    },
    {
        id: 'MENU_003_002',
        parentId: 'MENU_003',
        name: '논문 지도 현황',
        code: 'guidance_progress',
        depth: 2,
        order: 2
    },
    // 1depth: 논문 심사
    {
        id: 'MENU_004',
        parentId: null,
        name: '논문 심사',
        code: 'thesis_review',
        depth: 1,
        order: 4
    },
    {
        id: 'MENU_004_001',
        parentId: 'MENU_004',
        name: '심사위원 배정',
        code: 'committee_assignment',
        depth: 2,
        order: 1
    },
    {
        id: 'MENU_004_002',
        parentId: 'MENU_004',
        name: '학위 논문 심사',
        code: 'thesis_review_detail',
        depth: 2,
        order: 2
    },
    // 1depth: 시스템 설정
    {
        id: 'MENU_005',
        parentId: null,
        name: '시스템 설정',
        code: 'system_settings',
        depth: 1,
        order: 5
    },
    {
        id: 'MENU_005_001',
        parentId: 'MENU_005',
        name: '사용자 관리',
        code: 'user_management',
        depth: 2,
        order: 1
    },
    {
        id: 'MENU_005_002',
        parentId: 'MENU_005',
        name: '권한 관리',
        code: 'permission_management',
        depth: 2,
        order: 2
    }
];

// 부서별 권한 (Department Permissions)
const mockDepartmentPermissions = [
    {
        departmentId: 'DEPT_001',
        permissions: [
            { menuId: 'MENU_001', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_001_001', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_001_002', canRead: true, canCreate: true, canUpdate: true, canDelete: true },
            { menuId: 'MENU_002', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_002_001', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_003', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_003_001', canRead: true, canCreate: true, canUpdate: true, canDelete: true },
            { menuId: 'MENU_003_002', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_004', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_004_001', canRead: true, canCreate: true, canUpdate: true, canDelete: false }
        ]
    },
    {
        departmentId: 'DEPT_002',
        permissions: [
            { menuId: 'MENU_001', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_001_001', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_002', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_002_001', canRead: true, canCreate: false, canUpdate: false, canDelete: false }
        ]
    }
];

// 신분별 권한 (Position Permissions)
const mockPositionPermissions = [
    {
        positionId: 'POS_001',
        permissions: [
            { menuId: 'MENU_001', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_002', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_003', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_003_002', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_004', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_004_002', canRead: true, canCreate: false, canUpdate: true, canDelete: false }
        ]
    },
    {
        positionId: 'POS_003',
        permissions: [
            { menuId: 'MENU_001', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_002', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_003', canRead: true, canCreate: false, canUpdate: false, canDelete: false }
        ]
    },
    {
        positionId: 'POS_004',
        permissions: [
            { menuId: 'MENU_001', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_002', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_002_001', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_002_002', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_002_003', canRead: true, canCreate: true, canUpdate: true, canDelete: false }
        ]
    }
];

// 역할그룹별 권한 (Role Group Permissions)
const mockRoleGroupPermissions = [
    {
        roleGroupId: 'ROLEGROUP_001',
        permissions: [
            { menuId: 'MENU_004', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_004_001', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_004_002', canRead: true, canCreate: false, canUpdate: true, canDelete: false }
        ]
    },
    {
        roleGroupId: 'ROLEGROUP_002',
        permissions: [
            { menuId: 'MENU_002', canRead: true, canCreate: false, canUpdate: true, canDelete: false },
            { menuId: 'MENU_003', canRead: true, canCreate: false, canUpdate: false, canDelete: false }
        ]
    },
    {
        roleGroupId: 'ROLEGROUP_003',
        permissions: [
            { menuId: 'MENU_001', canRead: true, canCreate: true, canUpdate: true, canDelete: true },
            { menuId: 'MENU_002', canRead: true, canCreate: true, canUpdate: true, canDelete: true },
            { menuId: 'MENU_003', canRead: true, canCreate: true, canUpdate: true, canDelete: true },
            { menuId: 'MENU_004', canRead: true, canCreate: true, canUpdate: true, canDelete: false },
            { menuId: 'MENU_005', canRead: true, canCreate: false, canUpdate: false, canDelete: false },
            { menuId: 'MENU_005_002', canRead: true, canCreate: false, canUpdate: false, canDelete: false }
        ]
    }
];

// 개인별 예외 권한 (Individual Permissions)
const mockIndividualPermissions = [
    {
        userId: 'admin',
        permissions: [
            { menuId: 'MENU_005', canRead: true, canCreate: true, canUpdate: true, canDelete: true },
            { menuId: 'MENU_005_001', canRead: true, canCreate: true, canUpdate: true, canDelete: true },
            { menuId: 'MENU_005_002', canRead: true, canCreate: true, canUpdate: true, canDelete: true }
        ]
    },
    {
        userId: 'prof001',
        permissions: [
            { menuId: 'MENU_005_002', canRead: true, canCreate: false, canUpdate: false, canDelete: false }
        ]
    }
];

// 사용자-부서/신분/역할그룹 매핑 (User Mapping)
const mockUserMapping = [
    {
        userId: 'admin',
        departmentId: 'DEPT_001',
        positionId: 'POS_003',
        roleGroupIds: ['ROLEGROUP_003']
    },
    {
        userId: 'prof001',
        departmentId: 'DEPT_003',
        positionId: 'POS_001',
        roleGroupIds: ['ROLEGROUP_001', 'ROLEGROUP_003']
    },
    {
        userId: 'prof002',
        departmentId: 'DEPT_003',
        positionId: 'POS_001',
        roleGroupIds: ['ROLEGROUP_001']
    },
    {
        userId: 'stu001',
        departmentId: 'DEPT_004',
        positionId: 'POS_004',
        roleGroupIds: []
    }
];

// ========================================
// 게시판 데이터
// ========================================

// 공지사항
const mockNotices = [
    {
        id: 'NOTICE_001',
        category: 'important',
        title: '2025학년도 1학기 논문 제출 일정 안내',
        content: `<p>2025학년도 1학기 논문 제출 일정을 안내드립니다.</p>
<p><strong>주요 일정:</strong></p>
<ul>
<li>연구계획서 제출: 2025-03-01 ~ 2025-03-15</li>
<li>예비심사: 2025-04-01 ~ 2025-04-30</li>
<li>본심사: 2025-05-01 ~ 2025-05-31</li>
<li>최종 제출: 2025-06-15</li>
</ul>
<p>자세한 사항은 논문일정 메뉴를 참고해주세요.</p>`,
        authorId: 'admin',
        authorName: '관리자',
        createdAt: '2025-01-10 14:30',
        updatedAt: '2025-01-10 14:30',
        viewCount: 245,
        isPinned: true,
        attachments: []
    },
    {
        id: 'NOTICE_002',
        category: 'general',
        title: '연구윤리 교육 이수 안내',
        content: `<p>모든 대학원생은 논문 제출 전 연구윤리 교육을 이수해야 합니다.</p>
<p>교육 이수 방법은 연구윤리 메뉴를 참고해주세요.</p>`,
        authorId: 'admin',
        authorName: '관리자',
        createdAt: '2025-01-08 10:00',
        updatedAt: '2025-01-08 10:00',
        viewCount: 128,
        isPinned: false,
        attachments: []
    },
    {
        id: 'NOTICE_003',
        category: 'general',
        title: '지도교수 배정 결과 발표',
        content: `<p>2025학년도 신입생 지도교수 배정이 완료되었습니다.</p>
<p>지도교수 배정 메뉴에서 확인 가능합니다.</p>`,
        authorId: 'admin',
        authorName: '관리자',
        createdAt: '2025-01-05 09:00',
        updatedAt: '2025-01-05 09:00',
        viewCount: 89,
        isPinned: false,
        attachments: []
    }
];

// 안내문 (연구윤리, 논문일정, 논문지도절차)
const mockGuides = [
    {
        id: 'GUIDE_001',
        type: 'ethics',
        title: '연구윤리',
        content: `<div class="prose max-w-none">
<h2>연구윤리 준수사항</h2>

<h3>1. 연구윤리의 중요성</h3>
<p>학문적 진실성과 연구의 신뢰성을 위해 모든 연구자는 연구윤리를 준수해야 합니다.</p>

<h3>2. 연구 부정행위</h3>
<ul>
<li><strong>위조(Fabrication):</strong> 존재하지 않는 데이터나 연구 결과를 만들어내는 행위</li>
<li><strong>변조(Falsification):</strong> 연구 자료나 과정을 조작하여 연구 내용을 왜곡하는 행위</li>
<li><strong>표절(Plagiarism):</strong> 타인의 아이디어, 연구내용, 결과 등을 적절한 인용 없이 사용하는 행위</li>
<li><strong>중복게재:</strong> 이미 출판된 본인의 연구물을 새로운 것처럼 재출판하는 행위</li>
</ul>

<h3>3. 연구윤리 교육</h3>
<p>모든 대학원생은 논문 제출 전 연구윤리 교육을 이수해야 합니다.</p>
<ul>
<li>온라인 교육 플랫폼: <a href="https://www.cre.or.kr" target="_blank">한국연구재단 연구윤리정보센터</a></li>
<li>이수 시간: 최소 2시간</li>
<li>이수증 제출 기한: 논문 제출 1개월 전</li>
</ul>

<h3>4. 인용 및 참고문헌 작성</h3>
<p>타인의 연구를 인용할 때는 반드시 출처를 명확히 표시해야 합니다.</p>
<ul>
<li>직접 인용: 따옴표와 함께 정확한 페이지 번호 표기</li>
<li>간접 인용: 원저자의 이름과 출판 연도 표기</li>
<li>참고문헌: APA, MLA 등 학과별 규정에 따른 형식 준수</li>
</ul>

<h3>5. 문의</h3>
<p>연구윤리 관련 문의사항은 대학원 행정팀(02-1234-5678)으로 연락주시기 바랍니다.</p>
</div>`,
        lastUpdatedBy: 'admin',
        lastUpdatedByName: '관리자',
        lastUpdatedAt: '2025-01-08 15:30',
        isPublished: true,
        order: 1
    },
    {
        id: 'GUIDE_002',
        type: 'schedule',
        title: '논문일정',
        content: `<div class="prose max-w-none">
<h2>2025학년도 논문 제출 일정</h2>

<h3>📅 학기별 주요 일정</h3>

<h4>1학기 (2025년 3월 ~ 6월)</h4>
<table class="min-w-full border table-fixed">
<thead class="bg-gray-100">
<tr>
<th class="border px-4 py-2">단계</th>
<th class="border px-4 py-2">기간</th>
<th class="border px-4 py-2">비고</th>
</tr>
</thead>
<tbody>
<tr>
<td class="border px-4 py-2">연구계획서 제출</td>
<td class="border px-4 py-2">3월 1일 ~ 3월 15일</td>
<td class="border px-4 py-2">지도교수 승인 필수</td>
</tr>
<tr>
<td class="border px-4 py-2">예비심사</td>
<td class="border px-4 py-2">4월 1일 ~ 4월 30일</td>
<td class="border px-4 py-2">심사위원 3인</td>
</tr>
<tr>
<td class="border px-4 py-2">본심사</td>
<td class="border px-4 py-2">5월 1일 ~ 5월 31일</td>
<td class="border px-4 py-2">심사위원 3인(석사)/5인(박사)</td>
</tr>
<tr>
<td class="border px-4 py-2">최종 논문 제출</td>
<td class="border px-4 py-2">6월 15일</td>
<td class="border px-4 py-2">심사 통과 후</td>
</tr>
</tbody>
</table>

<h4>2학기 (2025년 9월 ~ 12월)</h4>
<table class="min-w-full border table-fixed">
<thead class="bg-gray-100">
<tr>
<th class="border px-4 py-2">단계</th>
<th class="border px-4 py-2">기간</th>
<th class="border px-4 py-2">비고</th>
</tr>
</thead>
<tbody>
<tr>
<td class="border px-4 py-2">연구계획서 제출</td>
<td class="border px-4 py-2">9월 1일 ~ 9월 15일</td>
<td class="border px-4 py-2">지도교수 승인 필수</td>
</tr>
<tr>
<td class="border px-4 py-2">예비심사</td>
<td class="border px-4 py-2">10월 1일 ~ 10월 31일</td>
<td class="border px-4 py-2">심사위원 3인</td>
</tr>
<tr>
<td class="border px-4 py-2">본심사</td>
<td class="border px-4 py-2">11월 1일 ~ 11월 30일</td>
<td class="border px-4 py-2">심사위원 3인(석사)/5인(박사)</td>
</tr>
<tr>
<td class="border px-4 py-2">최종 논문 제출</td>
<td class="border px-4 py-2">12월 15일</td>
<td class="border px-4 py-2">심사 통과 후</td>
</tr>
</tbody>
</table>

<h3>⚠️ 유의사항</h3>
<ul>
<li>각 단계별 기한 내 제출하지 않을 경우 다음 학기로 이월됩니다.</li>
<li>심사 일정은 심사위원 일정에 따라 조정될 수 있습니다.</li>
<li>최종 제출 전 표절 검사를 완료해야 합니다.</li>
<li>제출 서류는 논문지도 시스템을 통해 온라인으로 제출합니다.</li>
</ul>
</div>`,
        lastUpdatedBy: 'admin',
        lastUpdatedByName: '관리자',
        lastUpdatedAt: '2025-01-10 11:00',
        isPublished: true,
        order: 2
    },
    {
        id: 'GUIDE_003',
        type: 'procedure',
        title: '논문지도절차',
        content: `<div class="prose max-w-none">
<h2>논문지도 절차 안내</h2>

<h3>📋 전체 프로세스</h3>

<div class="bg-blue-50 p-4 rounded-lg mb-4">
<ol class="space-y-2">
<li><strong>1단계:</strong> 지도교수 배정</li>
<li><strong>2단계:</strong> 연구계획서 작성 및 제출</li>
<li><strong>3단계:</strong> 주차별 논문지도</li>
<li><strong>4단계:</strong> 예비심사</li>
<li><strong>5단계:</strong> 본심사</li>
<li><strong>6단계:</strong> 최종 논문 제출</li>
</ol>
</div>

<h3>1️⃣ 지도교수 배정</h3>
<ul>
<li><strong>신청 시기:</strong> 매 학기 개강 2주 전</li>
<li><strong>신청 방법:</strong> 논문지도 시스템 > 지도교수 배정 메뉴</li>
<li><strong>배정 기준:</strong> 전공 적합성, 지도 가능 인원, 학생 희망</li>
<li><strong>결과 발표:</strong> 개강 1주 전</li>
</ul>

<h3>2️⃣ 연구계획서 제출</h3>
<ul>
<li><strong>작성 항목:</strong> 연구 주제, 연구 목적, 연구 방법, 예상 결과</li>
<li><strong>승인 절차:</strong> 학생 작성 → 지도교수 검토 → 지도교수 승인</li>
<li><strong>제출 기한:</strong> 학기 시작 후 2주 이내</li>
</ul>

<h3>3️⃣ 주차별 논문지도</h3>
<ul>
<li><strong>지도 주기:</strong> 주 1회 이상 권장</li>
<li><strong>지도 방법:</strong> 대면/비대면 병행 가능</li>
<li><strong>기록 의무:</strong> 지도 내용은 시스템에 기록</li>
<li><strong>진도 관리:</strong> 단계별 체크리스트 활용</li>
</ul>

<h3>4️⃣ 예비심사</h3>
<ul>
<li><strong>신청 자격:</strong> 논문 진행률 70% 이상</li>
<li><strong>심사위원:</strong> 3인 (지도교수 포함)</li>
<li><strong>심사 내용:</strong> 연구 주제의 타당성, 연구 방법의 적절성</li>
<li><strong>결과:</strong> 통과/조건부통과/재심사</li>
</ul>

<h3>5️⃣ 본심사</h3>
<ul>
<li><strong>신청 자격:</strong> 예비심사 통과 후 논문 완성</li>
<li><strong>심사위원:</strong> 3인(석사) / 5인(박사)</li>
<li><strong>심사 내용:</strong> 논문 내용 전반, 연구 결과의 타당성</li>
<li><strong>심사 방법:</strong> 발표(20분) + 질의응답(30분)</li>
</ul>

<h3>6️⃣ 최종 논문 제출</h3>
<ul>
<li><strong>수정 기한:</strong> 본심사 후 2주 이내</li>
<li><strong>제출 서류:</strong>
  <ul>
  <li>최종 논문 파일 (PDF)</li>
  <li>심사위원 승인서</li>
  <li>연구윤리 이수증</li>
  <li>표절 검사 결과</li>
  </ul>
</li>
<li><strong>제출 방법:</strong> 논문지도 시스템을 통한 온라인 제출</li>
</ul>

<h3>📞 문의</h3>
<p>논문지도 절차 관련 문의는 대학원 행정팀으로 연락주시기 바랍니다.</p>
<ul>
<li>전화: 02-1234-5678</li>
<li>이메일: graduate@hycu.ac.kr</li>
</ul>
</div>`,
        lastUpdatedBy: 'admin',
        lastUpdatedByName: '관리자',
        lastUpdatedAt: '2025-01-09 16:45',
        isPublished: true,
        order: 3
    }
];

// 전역으로 노출 (window 객체에 할당)
if (typeof window !== 'undefined') {
    // 기본 데이터
    window.mockDepartmentNames = mockDepartmentNames;

    // 기존 권한 관리 데이터
    window.mockRoles = mockRoles;
    window.mockPermissions = mockPermissions;
    window.mockRolePermissions = mockRolePermissions;
    window.mockUsers = mockUsers;

    // ERP 연동 기반 권한 관리 데이터
    window.mockDepartments = mockDepartments;
    window.mockPositions = mockPositions;
    window.mockRoleGroups = mockRoleGroups;
    window.mockUserStatus = mockUserStatus;
    window.mockMenus = mockMenus;
    window.mockDepartmentPermissions = mockDepartmentPermissions;
    window.mockPositionPermissions = mockPositionPermissions;
    window.mockRoleGroupPermissions = mockRoleGroupPermissions;
    window.mockIndividualPermissions = mockIndividualPermissions;
    window.mockUserMapping = mockUserMapping;

    // 게시판 데이터
    window.mockNotices = mockNotices;
    window.mockGuides = mockGuides;

    // 디버그: 로드 확인
    console.log('✅ mockData.js 로드 완료');
    console.log('mockUsers:', window.mockUsers ? window.mockUsers.length + '명' : 'undefined');
    console.log('mockDepartments:', window.mockDepartments ? window.mockDepartments.length + '개' : 'undefined');
}
