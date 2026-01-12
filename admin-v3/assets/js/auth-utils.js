// ==================== 권한 체크 유틸리티 ====================
// 사용자 권한 확인 및 관리

/**
 * 권한 체크 유틸리티
 */
const AuthUtils = {
    /**
     * 관리자 여부 확인
     * @returns {boolean}
     */
    isAdmin() {
        // TODO: 실제 권한 관리 시스템 연동
        // 현재는 임시로 모두 관리자로 설정
        //
        // 실제 구현 시 아래와 같이 변경:
        // const user = window.currentUser || {};
        // return user.role === 'admin';

        return true;
    },

    /**
     * 교수 여부 확인
     * @returns {boolean}
     */
    isProfessor() {
        // TODO: 실제 권한 관리 시스템 연동
        // const user = window.currentUser || {};
        // return user.role === 'professor';

        return false;
    },

    /**
     * 학생 여부 확인
     * @returns {boolean}
     */
    isStudent() {
        // TODO: 실제 권한 관리 시스템 연동
        // const user = window.currentUser || {};
        // return user.role === 'student';

        return false;
    },

    /**
     * 이용자 여부 확인 (교수 또는 학생)
     * @returns {boolean}
     */
    isUser() {
        return this.isProfessor() || this.isStudent();
    },

    /**
     * 현재 사용자 정보 가져오기
     * @returns {object}
     */
    getCurrentUser() {
        // TODO: 실제 사용자 정보 반환
        return {
            id: 'admin',
            name: '관리자',
            role: 'admin',
            department: null
        };
    }
};

// 전역 export
window.AuthUtils = AuthUtils;

console.log('auth-utils.js loaded');
