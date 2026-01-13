// ==================== 논문 제출 요건 관리 ====================

const RequirementManagement = {
    /**
     * 요건 정의 (고정)
     */
    REQUIREMENT_COLUMNS: {
        "석사": [
            { key: "학점수료여부", label: "학점수료" },
            { key: "석사논문연구1_이수여부", label: "석사논문1" },
            { key: "연구윤리_이수여부", label: "연구윤리" },
            { key: "연구방법론_이수여부", label: "연구방법론" },
            { key: "외국어시험_합격여부", label: "외국어시험" },
            { key: "종합시험_합격여부", label: "종합시험" },
            { key: "학술지계재요건_충족여부", label: "학술지계재" }
        ],
        "박사": [
            { key: "학점수료여부", label: "학점수료" },
            { key: "박사논문연구1_이수여부", label: "박사논문1" },
            { key: "박사논문연구2_이수여부", label: "박사논문2" },
            { key: "연구윤리_이수여부", label: "연구윤리" },
            { key: "연구방법론_이수여부", label: "연구방법론" },
            { key: "외국어시험_합격여부", label: "외국어시험" },
            { key: "종합시험_합격여부", label: "종합시험" },
            { key: "학술지계재요건_충족여부", label: "학술지계재" }
        ],
        "통합과정": [
            { key: "학점수료여부", label: "학점수료" },
            { key: "석사논문연구1_이수여부", label: "석사논문1" },
            { key: "박사논문연구1_이수여부", label: "박사논문1" },
            { key: "박사논문연구2_이수여부", label: "박사논문2" },
            { key: "연구윤리_이수여부", label: "연구윤리" },
            { key: "연구방법론_이수여부", label: "연구방법론" },
            { key: "외국어시험_합격여부", label: "외국어시험" },
            { key: "종합시험_합격여부", label: "종합시험" },
            { key: "학술지계재요건_충족여부", label: "학술지계재" }
        ]
    },

    /**
     * localStorage 키
     */
    STORAGE_KEY: "thesis_requirements",

    /**
     * 초기화
     */
    init() {
        console.log("🎯 RequirementManagement.init() 시작");
        this.loadRequirements();
        console.log("📦 loadRequirements 완료");
        this.renderTable();
        console.log("✅ renderTable 완료");
    },

    /**
     * 모든 요건 데이터 로드
     */
    loadRequirements() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            // 초기 데이터 생성
            this.initializeDefaultData();
        }
    },

    /**
     * 초기 데이터 생성 (학과별 석사/박사 요건)
     */
    initializeDefaultData() {
        const departments = DepartmentUtils.getAllDepartments();
        const initialData = [];

        departments.forEach(dept => {
            // 석사 데이터
            initialData.push({
                id: `req_${this.generateId()}_master`,
                department: dept,
                degreeProgram: "석사",
                requirements: this.createEmptyRequirements("석사"),
                lastModified: this.getCurrentDateTime(),
                modifiedBy: "시스템"
            });

            // 박사 데이터
            initialData.push({
                id: `req_${this.generateId()}_doctor`,
                department: dept,
                degreeProgram: "박사",
                requirements: this.createEmptyRequirements("박사"),
                lastModified: this.getCurrentDateTime(),
                modifiedBy: "시스템"
            });
        });

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    },

    /**
     * 빈 요건 객체 생성
     */
    createEmptyRequirements(degreeProgram) {
        const requirements = {};
        this.REQUIREMENT_COLUMNS[degreeProgram].forEach(req => {
            requirements[req.key] = false;
        });
        return requirements;
    },

    /**
     * 모든 요건 데이터 가져오기
     */
    getAllRequirements() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    /**
     * ID로 요건 데이터 찾기
     */
    getRequirementById(id) {
        const allData = this.getAllRequirements();
        return allData.find(item => item.id === id);
    },

    /**
     * 테이블 렌더링
     */
    renderTable() {
        console.log("🔄 renderTable() 시작");
        const allData = this.getAllRequirements();
        console.log(`📊 전체 데이터 개수: ${allData.length}`);

        const tableHead = document.querySelector('#requirement-table thead');
        const tableBody = document.querySelector('#requirement-table tbody');

        console.log("🔍 tableHead:", tableHead);
        console.log("🔍 tableBody:", tableBody);

        if (!tableHead || !tableBody) {
            console.error('❌ 테이블 요소를 찾을 수 없습니다');
            console.error('tableHead:', tableHead);
            console.error('tableBody:', tableBody);
            return;
        }

        // 헤더 렌더링
        console.log("📝 헤더 렌더링 시작");
        this.renderTableHeader(tableHead);

        // 바디 렌더링
        console.log("📝 바디 렌더링 시작");
        this.renderTableBody(tableBody, allData);

        // 건수 표시
        const countDisplay = document.getElementById('requirement-count-display');
        if (countDisplay) {
            countDisplay.textContent = `(총 ${allData.length}건)`;
            console.log(`✅ 건수 표시 업데이트: ${allData.length}건`);
        }
    },

    /**
     * 테이블 헤더 렌더링
     */
    renderTableHeader(tableHead) {
        // 모든 요건의 합집합 (석사 + 박사)
        const allRequirements = this.getAllUniqueRequirements();

        let headerHTML = `
            <tr>
                <th style="width: 150px;">학과/전공명</th>
                <th style="width: 100px;">학위과정</th>
        `;

        allRequirements.forEach(req => {
            headerHTML += `<th style="width: 90px;">${req.label}</th>`;
        });

        headerHTML += `
                <th style="width: 80px;">관리</th>
            </tr>
        `;

        tableHead.innerHTML = headerHTML;
    },

    /**
     * 테이블 바디 렌더링
     */
    renderTableBody(tableBody, allData) {
        if (allData.length === 0) {
            const allRequirements = this.getAllUniqueRequirements();
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${3 + allRequirements.length}" class="text-center py-12">
                        <p class="text-gray-600">등록된 요건이 없습니다</p>
                        <button onclick="RequirementManagement.initializeDefaultData(); RequirementManagement.renderTable();"
                                class="mt-4 px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020]">
                            초기 데이터 생성
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        const allRequirements = this.getAllUniqueRequirements();
        let bodyHTML = '';

        allData.forEach(item => {
            const reqs = this.REQUIREMENT_COLUMNS[item.degreeProgram];
            bodyHTML += `
                <tr id="row-${item.id}">
                    <td>${item.department}</td>
                    <td>${item.degreeProgram}</td>
            `;

            // 각 요건 체크박스 (기본 disabled)
            allRequirements.forEach(reqDef => {
                const reqValue = item.requirements[reqDef.key];
                const isApplicable = reqs.some(r => r.key === reqDef.key);

                if (!isApplicable) {
                    // 해당 학위과정에 적용되지 않는 요건
                    bodyHTML += `<td class="text-center text-gray-300">-</td>`;
                } else {
                    bodyHTML += `
                        <td class="text-center">
                            <input type="checkbox"
                                   data-id="${item.id}"
                                   data-req="${reqDef.key}"
                                   ${reqValue ? 'checked' : ''}
                                   disabled
                                   class="requirement-checkbox w-4 h-4 text-[#6A0028] focus:ring-[#6A0028] cursor-not-allowed">
                        </td>
                    `;
                }
            });

            bodyHTML += `
                    <td class="text-center">
                        <button onclick="RequirementManagement.toggleEditMode('${item.id}')"
                                id="btn-${item.id}"
                                class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                            수정
                        </button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = bodyHTML;
    },

    /**
     * 모든 요건의 합집합 반환 (석사 + 박사)
     */
    getAllUniqueRequirements() {
        const master = this.REQUIREMENT_COLUMNS["석사"];
        const doctor = this.REQUIREMENT_COLUMNS["박사"];

        const allKeys = new Set();
        const result = [];

        [...master, ...doctor].forEach(req => {
            if (!allKeys.has(req.key)) {
                allKeys.add(req.key);
                result.push(req);
            }
        });

        return result;
    },

    /**
     * 수정 모드 토글 (수정 ↔ 저장)
     */
    toggleEditMode(id) {
        const row = document.getElementById(`row-${id}`);
        const btn = document.getElementById(`btn-${id}`);

        if (!row || !btn) return;

        const checkboxes = row.querySelectorAll('input[type="checkbox"][data-id="' + id + '"]');
        const isCurrentlyDisabled = checkboxes[0]?.disabled;

        if (isCurrentlyDisabled) {
            // 수정 모드로 전환
            checkboxes.forEach(cb => {
                cb.disabled = false;
                cb.classList.remove('cursor-not-allowed');
                cb.classList.add('cursor-pointer');
            });

            btn.textContent = '저장';
            btn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
            btn.classList.add('bg-[#6A0028]', 'hover:bg-[#550020]');
            btn.onclick = () => this.saveRow(id);
        } else {
            // 읽기 모드로 복귀 (저장하지 않음)
            checkboxes.forEach(cb => {
                cb.disabled = true;
                cb.classList.remove('cursor-pointer');
                cb.classList.add('cursor-not-allowed');
            });

            btn.textContent = '수정';
            btn.classList.remove('bg-[#6A0028]', 'hover:bg-[#550020]');
            btn.classList.add('bg-gray-600', 'hover:bg-gray-700');
            btn.onclick = () => this.toggleEditMode(id);
        }
    },

    /**
     * 행 저장
     */
    saveRow(id) {
        const row = document.getElementById(`row-${id}`);
        if (!row) {
            alert('데이터를 찾을 수 없습니다.');
            return;
        }

        // 체크박스 값 수집 및 저장
        const checkboxes = row.querySelectorAll('input[type="checkbox"][data-id="' + id + '"]');
        const allData = this.getAllRequirements();
        const item = allData.find(r => r.id === id);

        if (!item) {
            alert('데이터를 찾을 수 없습니다.');
            return;
        }

        // 체크박스 값 업데이트
        checkboxes.forEach(cb => {
            const reqKey = cb.getAttribute('data-req');
            if (reqKey) {
                item.requirements[reqKey] = cb.checked;
            }
        });

        // 수정 정보 업데이트
        item.lastModified = this.getCurrentDateTime();
        item.modifiedBy = "관리자";

        // localStorage 저장
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));

        alert('저장되었습니다.');

        // 테이블 다시 렌더링 (읽기 모드로 복귀)
        this.renderTable();
    },

    /**
     * 요건 행 추가 (학과 + 학위과정 조합)
     */
    addRequirementRow(departmentName, degreeProgram) {
        if (!departmentName || departmentName.trim() === '') {
            alert('학과/전공을 선택해주세요.');
            return;
        }

        if (!degreeProgram) {
            alert('학위과정을 선택해주세요.');
            return;
        }

        const allData = this.getAllRequirements();

        // 중복 체크: (학과 + 학위과정) 조합이 이미 있는지 확인
        const exists = allData.some(item =>
            item.department === departmentName &&
            item.degreeProgram === degreeProgram
        );

        if (exists) {
            alert(`${departmentName} ${degreeProgram} 과정은 이미 등록되어 있습니다.`);
            return;
        }

        // 새 요건 행 추가
        const suffix = degreeProgram === "석사" ? "master" :
                      degreeProgram === "박사" ? "doctor" : "integrated";

        allData.push({
            id: `req_${this.generateId()}_${suffix}`,
            department: departmentName,
            degreeProgram: degreeProgram,
            requirements: this.createEmptyRequirements(degreeProgram),
            lastModified: this.getCurrentDateTime(),
            modifiedBy: "관리자"
        });

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));

        alert(`${departmentName} ${degreeProgram} 과정이 추가되었습니다.`);
        this.renderTable();
    },

    /**
     * 학과/전공 추가 모달 표시
     */
    showAddDepartmentModal() {
        const modal = document.getElementById('add-department-modal');
        const select = document.getElementById('select-department');

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');

            // 드롭다운에 학과 목록 로드
            if (select) {
                const departments = DepartmentUtils.getAllDepartments();
                let options = '<option value="">선택하세요</option>';
                departments.forEach(dept => {
                    options += `<option value="${dept}">${dept}</option>`;
                });
                select.innerHTML = options;
            }

            // 첫 번째 라디오 버튼 체크
            const masterRadio = document.getElementById('degree-master');
            if (masterRadio) {
                masterRadio.checked = true;
            }
        }
    },

    /**
     * 학과/전공 추가 모달 닫기
     */
    closeAddDepartmentModal() {
        const modal = document.getElementById('add-department-modal');
        const form = document.getElementById('add-department-form');

        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        if (form) {
            form.reset();
        }
    },

    /**
     * 학과/전공 추가 제출
     */
    submitAddDepartment(event) {
        event.preventDefault();

        const select = document.getElementById('select-department');
        const departmentName = select?.value;

        const degreeRadio = document.querySelector('input[name="degreeProgram"]:checked');
        const degreeProgram = degreeRadio?.value;

        if (departmentName && degreeProgram) {
            this.addRequirementRow(departmentName, degreeProgram);
            this.closeAddDepartmentModal();
        }
    },

    /**
     * 고유 ID 생성
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    /**
     * 현재 날짜/시간 반환
     */
    getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};

// 전역 export
window.RequirementManagement = RequirementManagement;

console.log('✅ requirement-management.js 로드 완료');
