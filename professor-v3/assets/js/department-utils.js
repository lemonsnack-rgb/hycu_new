// ==================== 학과 관련 유틸리티 함수 ====================
// 교수가 지도하는 학생들의 학과 목록을 추출하는 함수

/**
 * 교수가 지도하는 학생들의 고유 학과 목록을 추출
 * @returns {Array<string>} 학과명 배열 (중복 제거됨)
 */
function getProfessorDepartments() {
    // appData가 로드되지 않았으면 빈 배열 반환
    if (typeof appData === 'undefined') {
        return [];
    }

    if (!appData?.weeklyGuidance?.guidancePairs) {
        return [];
    }

    const departments = new Set();

    appData.weeklyGuidance.guidancePairs.forEach(pair => {
        const student = pair.student;
        if (!student) return;

        // student.major 또는 student.department 사용
        const dept = student.major || student.department;
        if (dept && dept !== '-') {
            departments.add(dept);
        }
    });

    // Set을 배열로 변환하여 정렬
    return Array.from(departments).sort();
}

/**
 * 교수의 기본 소속 학과 가져오기 (첫 번째 학과)
 * @returns {string} 기본 학과명 또는 'all'
 */
function getProfessorDefaultDepartment() {
    const departments = getProfessorDepartments();
    return departments.length > 0 ? departments[0] : 'all';
}

/**
 * 학과 드롭다운 HTML 생성
 * @param {string} currentDepartment - 현재 선택된 학과 (기본값: 'all')
 * @param {string} onchangeFunction - 변경 시 호출할 함수명
 * @returns {string} 드롭다운 HTML
 */
function generateDepartmentDropdownHtml(currentDepartment = 'all', onchangeFunction = '') {
    const departments = getProfessorDepartments();

    if (departments.length === 0) {
        return ''; // 학과가 없으면 드롭다운 표시 안 함
    }

    const onchangeAttr = onchangeFunction ? `onchange="${onchangeFunction}"` : '';

    return `
        <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">학과:</label>
            <select id="department-filter" ${onchangeAttr}
                    class="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                <option value="all" ${currentDepartment === 'all' ? 'selected' : ''}>전체보기</option>
                ${departments.map(dept => `
                    <option value="${dept}" ${currentDepartment === dept ? 'selected' : ''}>${dept}</option>
                `).join('')}
            </select>
        </div>
    `;
}

/**
 * 콘텐츠 항목이 선택된 학과에 표시되어야 하는지 확인
 * @param {Object} item - 콘텐츠 항목 (visibility, targetDepartments 필드 포함)
 * @param {string} selectedDepartment - 선택된 학과 ('all' 또는 학과명)
 * @returns {boolean} 표시 여부
 */
function shouldShowContentForDepartment(item, selectedDepartment) {
    // 전체보기인 경우
    if (selectedDepartment === 'all') {
        return true;
    }

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

        // 선택된 학과가 targetDepartments에 포함되어 있는지 확인
        return item.targetDepartments.includes(selectedDepartment);
    }

    // 기본적으로는 표시
    return true;
}

// Export
window.getProfessorDepartments = getProfessorDepartments;
window.getProfessorDefaultDepartment = getProfessorDefaultDepartment;
window.generateDepartmentDropdownHtml = generateDepartmentDropdownHtml;
window.shouldShowContentForDepartment = shouldShowContentForDepartment;

// 학과 유틸리티 모듈 로드 완료
