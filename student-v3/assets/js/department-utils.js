// ==================== 학과 관련 유틸리티 함수 (학생용) ====================
// 학생의 소속 학과 정보를 가져오는 함수

/**
 * 학생의 소속 학과 가져오기
 * @returns {string} 학과명
 */
function getStudentDepartment() {
    // window.currentStudent에서 학과 정보 가져오기
    if (typeof window.currentStudent !== 'undefined') {
        const department = window.currentStudent.major || window.currentStudent.department;
        if (department && department !== '-') {
            return department;
        }
    }

    // 기본값 (테스트용)
    console.warn('⚠️ window.currentStudent가 정의되지 않았습니다. 기본값 사용');
    return '컴퓨터공학과';
}

/**
 * 콘텐츠 항목이 학생에게 표시되어야 하는지 확인
 * @param {Object} item - 콘텐츠 항목 (visibility, targetDepartments 필드 포함)
 * @param {string} studentDepartment - 학생 소속 학과
 * @returns {boolean} 표시 여부
 */
function shouldShowContentForStudent(item, studentDepartment) {
    // visibility가 'all'인 경우
    if (item.visibility === 'all') {
        return true;
    }

    // visibility가 'specific'인 경우 targetDepartments 확인
    if (item.visibility === 'specific') {
        if (!item.targetDepartments || item.targetDepartments.length === 0) {
            return false;
        }

        // targetDepartments에 'all'이 포함되어 있으면 모든 학과에 표시
        if (item.targetDepartments.includes('all')) {
            return true;
        }

        // 학생 소속 학과가 targetDepartments에 포함되어 있는지 확인
        return item.targetDepartments.includes(studentDepartment);
    }

    // 레거시: department 필드 확인
    if (item.department) {
        if (item.department === 'all') {
            return true;
        }
        return item.department === studentDepartment;
    }

    // 기본적으로는 표시
    return true;
}

// Export
window.getStudentDepartment = getStudentDepartment;
window.shouldShowContentForStudent = shouldShowContentForStudent;

console.log('✅ 학생용 학과 유틸리티 모듈 로드 완료');
