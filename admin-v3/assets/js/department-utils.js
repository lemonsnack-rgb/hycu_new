// ==================== 학과 관련 공통 유틸리티 ====================

/**
 * 학과 관리 유틸리티
 * - 학과 목록 관리
 * - 학과 표시명 변환
 * - 필터 옵션 생성
 */
const DepartmentUtils = {
    /**
     * localStorage 키
     */
    STORAGE_KEY: 'department_list',

    /**
     * 초기 학과 목록
     */
    getDefaultDepartments() {
        return [
            '컴퓨터공학과',
            '경영학과',
            '교육학과',
            '심리학과',
            '사회복지학과'
        ];
    },

    /**
     * 전체 학과 목록 조회
     */
    getAllDepartments() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            // 초기 데이터 저장
            const defaultDepts = this.getDefaultDepartments();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultDepts));
            return defaultDepts;
        }
    },

    /**
     * 학과 추가
     */
    addDepartment(departmentName) {
        if (!departmentName || departmentName.trim() === '') {
            console.error('학과명이 비어있습니다.');
            return false;
        }

        const depts = this.getAllDepartments();

        // 중복 체크
        if (depts.includes(departmentName)) {
            console.warn('이미 존재하는 학과입니다:', departmentName);
            return false;
        }

        // 추가
        depts.push(departmentName);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(depts));
        console.log('학과 추가 완료:', departmentName);
        return true;
    },

    /**
     * 학과 삭제
     */
    removeDepartment(departmentName) {
        const depts = this.getAllDepartments();
        const index = depts.indexOf(departmentName);

        if (index > -1) {
            depts.splice(index, 1);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(depts));
            console.log('학과 삭제 완료:', departmentName);
            return true;
        }

        console.warn('존재하지 않는 학과입니다:', departmentName);
        return false;
    },

    /**
     * 학과 표시명 변환
     */
    getDepartmentDisplayName(dept) {
        if (!dept) return '-';
        return dept === 'all' ? '전체 공개' : dept;
    },

    /**
     * 학과 필터 옵션 HTML 생성
     * @param {boolean} includeAll - '전체' 옵션 포함 여부
     * @param {string} selectedValue - 선택된 값
     */
    generateDepartmentOptions(includeAll = true, selectedValue = '') {
        const depts = this.getAllDepartments();
        let html = '';

        if (includeAll) {
            html += `<option value="all" ${selectedValue === 'all' ? 'selected' : ''}>전체</option>`;
        }

        depts.forEach(dept => {
            const selected = selectedValue === dept ? 'selected' : '';
            html += `<option value="${dept}" ${selected}>${dept}</option>`;
        });

        return html;
    },

    /**
     * 학과 체크박스 HTML 생성 (다중 선택용)
     * @param {Array} selectedDepartments - 선택된 학과 배열
     */
    generateDepartmentCheckboxes(selectedDepartments = []) {
        const depts = this.getAllDepartments();
        let html = '';

        depts.forEach(dept => {
            const checked = selectedDepartments.includes(dept) ? 'checked' : '';
            html += `
                <div class="flex items-center gap-2">
                    <input type="checkbox"
                           id="dept-${dept}"
                           name="targetDepartments"
                           value="${dept}"
                           ${checked}
                           class="rounded border-gray-300 text-primary focus:ring-primary">
                    <label for="dept-${dept}" class="text-sm text-gray-700">${dept}</label>
                </div>
            `;
        });

        return html;
    },

    /**
     * 체크박스에서 선택된 학과 목록 가져오기
     */
    getSelectedDepartments() {
        const checkboxes = document.querySelectorAll('input[name="targetDepartments"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    },

    /**
     * 학과 검증
     */
    isValidDepartment(dept) {
        if (dept === 'all') return true;
        return this.getAllDepartments().includes(dept);
    },

    /**
     * 학과별 색상 코드 (선택적)
     */
    getDepartmentColor(dept) {
        const colors = {
            '컴퓨터공학과': '#3B82F6',
            '경영학과': '#10B981',
            '교육학과': '#F59E0B',
            '심리학과': '#8B5CF6',
            '사회복지학과': '#EC4899',
            'all': '#6B7280'
        };
        return colors[dept] || colors['all'];
    },

    /**
     * 학과 배지 HTML 생성
     */
    generateDepartmentBadge(dept) {
        const displayName = this.getDepartmentDisplayName(dept);
        const color = this.getDepartmentColor(dept);

        return `
            <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  style="background-color: ${color}20; color: ${color};">
                ${displayName}
            </span>
        `;
    }
};

// 전역 export
window.DepartmentUtils = DepartmentUtils;

console.log('department-utils.js loaded');
