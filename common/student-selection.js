/**
 * 학생 선택 관리 유틸리티
 * 테이블에서 체크박스를 통한 학생 선택 기능 제공
 */

const StudentSelection = {
    /**
     * 선택된 학생 데이터를 저장하는 Map
     * key: studentId, value: student object
     */
    selectedStudents: new Map(),

    /**
     * 현재 테이블의 모든 학생 데이터
     */
    allStudents: [],

    /**
     * 초기화
     * @param {Array} students - 전체 학생 목록
     */
    init(students = []) {
        this.allStudents = students;
        this.selectedStudents.clear();
        this.updateUI();
    },

    /**
     * 전체 선택/해제 토글
     */
    toggleSelectAll() {
        const selectAllCheckbox = document.getElementById('select-all-students');
        if (!selectAllCheckbox) return;

        const isChecked = selectAllCheckbox.checked;

        // 모든 학생 체크박스 상태 변경
        document.querySelectorAll('.student-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
            const studentId = checkbox.dataset.studentId;
            const studentData = JSON.parse(checkbox.dataset.studentData || '{}');

            if (isChecked) {
                this.selectedStudents.set(studentId, studentData);
            } else {
                this.selectedStudents.delete(studentId);
            }
        });

        this.updateUI();
    },

    /**
     * 개별 학생 선택/해제
     * @param {HTMLInputElement} checkbox - 체크박스 엘리먼트
     */
    toggleStudent(checkbox) {
        const studentId = checkbox.dataset.studentId;
        const studentData = JSON.parse(checkbox.dataset.studentData || '{}');

        if (checkbox.checked) {
            this.selectedStudents.set(studentId, studentData);
        } else {
            this.selectedStudents.delete(studentId);
        }

        // 전체 선택 체크박스 상태 업데이트
        this.updateSelectAllCheckbox();
        this.updateUI();
    },

    /**
     * 전체 선택 체크박스 상태 업데이트
     */
    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('select-all-students');
        if (!selectAllCheckbox) return;

        const studentCheckboxes = document.querySelectorAll('.student-checkbox');
        const checkedCount = document.querySelectorAll('.student-checkbox:checked').length;

        selectAllCheckbox.checked = studentCheckboxes.length > 0 && checkedCount === studentCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < studentCheckboxes.length;
    },

    /**
     * UI 업데이트 (선택 카운트, 버튼 활성화 등)
     */
    updateUI() {
        const count = this.selectedStudents.size;

        // 선택 카운트 업데이트
        const countElements = document.querySelectorAll('.selected-count');
        countElements.forEach(el => {
            el.textContent = count;
        });

        // 알림 발송 버튼 활성화/비활성화
        const sendButton = document.getElementById('btn-send-notification');
        if (sendButton) {
            sendButton.disabled = count === 0;
            if (count > 0) {
                sendButton.classList.remove('btn-disabled');
            } else {
                sendButton.classList.add('btn-disabled');
            }
        }

        // 선택 영역 표시/숨김
        const selectionArea = document.getElementById('selection-area');
        if (selectionArea) {
            if (count > 0) {
                selectionArea.style.display = 'flex';
            } else {
                selectionArea.style.display = 'none';
            }
        }
    },

    /**
     * 선택된 학생 목록 가져오기
     * @returns {Array} 선택된 학생 배열
     */
    getSelectedStudents() {
        return Array.from(this.selectedStudents.values());
    },

    /**
     * 선택된 학생 수 가져오기
     * @returns {number} 선택된 학생 수
     */
    getSelectedCount() {
        return this.selectedStudents.size;
    },

    /**
     * 모든 선택 해제
     */
    clearSelection() {
        this.selectedStudents.clear();

        // 모든 체크박스 해제
        const selectAllCheckbox = document.getElementById('select-all-students');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }

        document.querySelectorAll('.student-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.updateUI();
    },

    /**
     * 학생 테이블에 체크박스 컬럼 추가
     * @param {string} tableId - 테이블 ID
     * @param {Array} students - 학생 데이터 배열
     * @param {Function} getStudentId - 학생 ID 추출 함수
     */
    addCheckboxColumn(tableId, students, getStudentId = (student) => student.studentId || student.학번) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error(`테이블을 찾을 수 없습니다: ${tableId}`);
            return;
        }

        // 헤더에 전체 선택 체크박스 추가
        const thead = table.querySelector('thead tr');
        if (thead) {
            const firstTh = thead.querySelector('th');
            if (firstTh && !firstTh.querySelector('#select-all-students')) {
                const checkboxTh = document.createElement('th');
                checkboxTh.className = 'text-center';
                checkboxTh.style.width = '50px';
                checkboxTh.innerHTML = `
                    <input
                        type="checkbox"
                        id="select-all-students"
                        class="checkbox-input"
                        onchange="StudentSelection.toggleSelectAll()"
                        title="전체 선택"
                    >
                `;
                thead.insertBefore(checkboxTh, firstTh);
            }
        }

        // 각 행에 체크박스 추가
        const tbody = table.querySelector('tbody');
        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, index) => {
                if (index < students.length) {
                    const student = students[index];
                    const studentId = getStudentId(student);

                    // 이미 체크박스가 있는지 확인
                    if (!row.querySelector('.student-checkbox')) {
                        const checkboxTd = document.createElement('td');
                        checkboxTd.className = 'text-center';
                        checkboxTd.innerHTML = `
                            <input
                                type="checkbox"
                                class="student-checkbox checkbox-input"
                                data-student-id="${studentId}"
                                data-student-data='${JSON.stringify(student)}'
                                onchange="StudentSelection.toggleStudent(this)"
                            >
                        `;
                        row.insertBefore(checkboxTd, row.firstChild);
                    }
                }
            });
        }

        // 초기화
        this.init(students);
    },

    /**
     * 선택 영역 UI 생성 (선택된 학생 수 표시 및 알림 발송 버튼)
     * @returns {string} HTML 문자열
     */
    createSelectionUI() {
        return `
            <div id="selection-area" class="selection-area" style="display: none;">
                <div class="selection-info">
                    <svg class="inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="selected-count">0</span>명 선택됨
                </div>
                <div class="selection-actions">
                    <button
                        id="btn-send-notification"
                        class="btn btn-primary btn-disabled"
                        onclick="StudentSelection.openNotificationModal()"
                        disabled
                    >
                        <svg class="inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        알림 발송
                    </button>
                    <button
                        class="btn btn-secondary"
                        onclick="StudentSelection.clearSelection()"
                    >
                        선택 해제
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * 알림 모달 열기
     */
    openNotificationModal() {
        const selectedStudents = this.getSelectedStudents();
        if (selectedStudents.length === 0) {
            alert('알림을 발송할 학생을 선택해주세요.');
            return;
        }

        // NotificationModal 열기
        if (typeof NotificationModal !== 'undefined') {
            NotificationModal.open(selectedStudents);
        } else {
            console.error('NotificationModal이 로드되지 않았습니다.');
            alert('알림 모달을 불러올 수 없습니다.');
        }
    }
};

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudentSelection;
}
