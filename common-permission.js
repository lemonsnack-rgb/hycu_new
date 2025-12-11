// 권한 검증 유틸리티
// File: common-permission.js

/**
 * 권한 관리 클래스
 * 사용자의 역할과 권한을 관리하고 검증하는 기능 제공
 */
class PermissionManager {
    constructor() {
        this.currentUser = null;
        this.userPermissions = [];
    }

    /**
     * 현재 사용자 설정
     * @param {Object} user - 사용자 객체 (id, username, name, roleId, email, etc.)
     */
    setCurrentUser(user) {
        this.currentUser = user;
        this.loadUserPermissions();
    }

    /**
     * 현재 사용자 가져오기
     * @returns {Object|null} 현재 사용자 객체
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * 사용자 권한 로드
     * 사용자의 역할에 매핑된 권한 ID 목록을 가져옴
     */
    loadUserPermissions() {
        if (!this.currentUser) {
            this.userPermissions = [];
            return;
        }

        const role = mockRoles.find(r => r.id === this.currentUser.roleId);
        if (!role) {
            this.userPermissions = [];
            return;
        }

        const rolePermission = mockRolePermissions.find(rp => rp.roleId === role.id);
        if (!rolePermission) {
            this.userPermissions = [];
            return;
        }

        this.userPermissions = rolePermission.permissionIds;
    }

    /**
     * 권한 체크 (단일 권한 코드)
     * @param {string} permissionCode - 권한 코드 (예: 'menu.dashboard')
     * @returns {boolean} 권한 보유 여부
     */
    hasPermission(permissionCode) {
        if (!this.currentUser) return false;

        const permission = mockPermissions.find(p => p.code === permissionCode);
        if (!permission) return false;

        return this.userPermissions.includes(permission.id);
    }

    /**
     * 여러 권한 중 하나라도 있는지 체크 (OR 조건)
     * @param {Array<string>} permissionCodes - 권한 코드 배열
     * @returns {boolean} 권한 보유 여부
     */
    hasAnyPermission(permissionCodes) {
        if (!Array.isArray(permissionCodes)) return false;
        return permissionCodes.some(code => this.hasPermission(code));
    }

    /**
     * 모든 권한이 있는지 체크 (AND 조건)
     * @param {Array<string>} permissionCodes - 권한 코드 배열
     * @returns {boolean} 권한 보유 여부
     */
    hasAllPermissions(permissionCodes) {
        if (!Array.isArray(permissionCodes)) return false;
        return permissionCodes.every(code => this.hasPermission(code));
    }

    /**
     * 역할 체크
     * @param {string} roleCode - 역할 코드 (예: 'admin', 'professor', 'student')
     * @returns {boolean} 역할 일치 여부
     */
    hasRole(roleCode) {
        if (!this.currentUser) return false;
        const role = mockRoles.find(r => r.id === this.currentUser.roleId);
        return role && role.code === roleCode;
    }

    /**
     * 사용자의 모든 권한 가져오기
     * @returns {Array} 권한 객체 배열
     */
    getUserPermissions() {
        return this.userPermissions.map(permId => {
            return mockPermissions.find(p => p.id === permId);
        }).filter(p => p !== undefined);
    }

    /**
     * 사용자의 역할 가져오기
     * @returns {Object|null} 역할 객체
     */
    getUserRole() {
        if (!this.currentUser) return null;
        return mockRoles.find(r => r.id === this.currentUser.roleId);
    }

    /**
     * 카테고리별 권한 체크
     * @param {string} category - 카테고리 (menu, feature, data, admin)
     * @returns {Array} 해당 카테고리의 권한 목록
     */
    getPermissionsByCategory(category) {
        return this.getUserPermissions().filter(p => p.category === category);
    }

    /**
     * 권한 없음 메시지 표시
     * @param {string} message - 커스텀 메시지 (선택)
     */
    showNoPermissionMessage(message = '이 기능에 접근할 권한이 없습니다.') {
        if (typeof showToast === 'function') {
            showToast(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * 권한 체크 후 함수 실행 (헬퍼 메소드)
     * @param {string} permissionCode - 권한 코드
     * @param {Function} callback - 실행할 함수
     * @param {string} errorMessage - 권한 없을 때 메시지
     * @returns {boolean} 실행 성공 여부
     */
    executeWithPermission(permissionCode, callback, errorMessage = null) {
        if (this.hasPermission(permissionCode)) {
            if (typeof callback === 'function') {
                callback();
            }
            return true;
        } else {
            this.showNoPermissionMessage(errorMessage);
            return false;
        }
    }

    /**
     * 디버그: 현재 사용자 정보 출력
     */
    debug() {
        console.group('🔐 Permission Manager Debug');
        console.log('Current User:', this.currentUser);
        console.log('User Role:', this.getUserRole());
        console.log('User Permissions:', this.getUserPermissions());
        console.log('Permission IDs:', this.userPermissions);
        console.groupEnd();
    }
}

// 전역 인스턴스 생성
const permissionManager = new PermissionManager();

// 전역으로 노출 (window 객체에 할당)
if (typeof window !== 'undefined') {
    window.permissionManager = permissionManager;
    window.PermissionManager = PermissionManager;
}

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PermissionManager, permissionManager };
}
