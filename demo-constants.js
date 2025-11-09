// ==================== 시연용 프로토타입 통합 상수 ====================
// 이 파일은 교수/학생/관리자 화면 간 데이터 일관성을 위한 상수 정의

// 🎯 시연용 메인 학생 정보 (교수/학생 화면 공통)
const DEMO_STUDENT = {
    id: '2024001',
    name: '김철수',
    program: '박사',
    major: '컴퓨터공학',
    advisor: '김교수',
    email: 'kim@hycu.ac.kr',
    enrollmentDate: '2024-03-01',
    year: 1
};

// 🎯 시연용 교수 정보
const DEMO_PROFESSOR = {
    id: 'P001',
    name: '김교수',
    department: '컴퓨터공학과',
    email: 'prof.kim@hycu.ac.kr'
};

// Export to window for global access (프로토타입이므로 전역 사용)
window.DEMO_STUDENT = DEMO_STUDENT;
window.DEMO_PROFESSOR = DEMO_PROFESSOR;
