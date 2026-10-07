// ========== 관리자 논문신청 관리 ==========
(function() {
    'use strict';

    // ========== 전역 변수 ==========
    let currentFilters = {
        year: '',
        semester: '',
        collegeType: '',
        graduate: '',
        college: '',
        undergraduate: '',
        department: '',
        degreeType: '',
        academicStatus: '',
        advisorName: '',
        stepType: '',
        applicationStatus: ''
    };

    let currentDetailId = null;

    // ========== 논문신청 목록 렌더링 ==========
    window.renderAdminThesisApplicationList = function() {
        const container = document.getElementById('thesis-application-list');
        if (!container) return;

        // 검색 필터 적용
        const filteredData = getFilteredApplicationData();

        // 테이블 HTML 생성
        const tableHtml = `
            <div class="bg-white rounded-lg shadow">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">순번</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">학년도</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">학기</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">대학구분</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">계열/대학원</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">학부(과)전공</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">학과/전공</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">학위과정</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">학적상태</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">학번</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">성명</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">지도교수명</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">지도단계</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">신청상태</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${filteredData.map((item, index) => `
                                <tr class="hover:bg-gray-50 cursor-pointer" onclick="showAdminThesisApplicationDetail(${item.id})">
                                    <td class="px-4 py-3 text-sm text-gray-900">${index + 1}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.year}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.semester}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.collegeType}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.graduate}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.undergraduate}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.department}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.degreeType}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.academicStatus}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.studentNumber}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.studentName}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.advisorName}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900">${item.stepName}</td>
                                    <td class="px-4 py-3 text-sm">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${item.applicationStatus === '신청완료' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                            ${item.applicationStatus}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = tableHtml;
    };

    // ========== 필터링된 데이터 가져오기 ==========
    function getFilteredApplicationData() {
        // 학생 데이터와 신청 데이터 조인
        const joinedData = appData.mockThesisApplications.map(app => {
            const student = appData.mockStudents.find(s => s.id === app.studentId);
            const stepType = appData.mockStepTypes.find(st => st.id === app.stepTypeId);

            if (!student || !stepType) return null;

            return {
                id: app.id,
                studentNumber: student.studentNumber,
                studentName: student.studentName,
                year: student.year,
                semester: student.semester,
                graduate: student.graduate,
                collegeType: student.graduate.includes('일반') ? '대학원' : '특수대학원',
                college: student.college,
                undergraduate: student.undergraduate,
                department: student.department,
                degreeType: student.degreeType,
                academicStatus: student.academicStatus,
                advisorName: student.advisorName,
                stepName: stepType.name,
                applicationStatus: app.status === 'submitted' ? '신청완료' : '미신청',
                applicationPeriodStart: app.applicationPeriodStart,
                applicationPeriodEnd: app.applicationPeriodEnd,
                withdrawalPeriodStart: app.withdrawalPeriodStart,
                withdrawalPeriodEnd: app.withdrawalPeriodEnd,
                submittedDate: app.submittedDate
            };
        }).filter(item => item !== null);

        // 필터 적용
        return joinedData.filter(item => {
            if (currentFilters.year && item.year !== currentFilters.year) return false;
            if (currentFilters.semester && item.semester !== currentFilters.semester) return false;
            if (currentFilters.collegeType && item.collegeType !== currentFilters.collegeType) return false;
            if (currentFilters.graduate && item.graduate !== currentFilters.graduate) return false;
            if (currentFilters.college && item.college !== currentFilters.college) return false;
            if (currentFilters.undergraduate && item.undergraduate !== currentFilters.undergraduate) return false;
            if (currentFilters.department && item.department !== currentFilters.department) return false;
            if (currentFilters.degreeType && item.degreeType !== currentFilters.degreeType) return false;
            if (currentFilters.academicStatus && item.academicStatus !== currentFilters.academicStatus) return false;
            if (currentFilters.advisorName && !item.advisorName.includes(currentFilters.advisorName)) return false;
            if (currentFilters.stepType && item.stepName !== currentFilters.stepType) return false;
            if (currentFilters.applicationStatus && item.applicationStatus !== currentFilters.applicationStatus) return false;
            return true;
        });
    }

    // ========== 검색 필터 적용 ==========
    window.applyAdminThesisApplicationFilters = function() {
        // 필터 값 수집
        currentFilters.year = document.getElementById('filter-year')?.value || '';
        currentFilters.semester = document.getElementById('filter-semester')?.value || '';
        currentFilters.collegeType = document.getElementById('filter-college-type')?.value || '';
        currentFilters.graduate = document.getElementById('filter-graduate')?.value || '';
        currentFilters.college = document.getElementById('filter-college')?.value || '';
        currentFilters.undergraduate = document.getElementById('filter-undergraduate')?.value || '';
        currentFilters.department = document.getElementById('filter-department')?.value || '';
        currentFilters.degreeType = document.getElementById('filter-degree')?.value || '';
        currentFilters.academicStatus = document.getElementById('filter-status')?.value || '';
        currentFilters.advisorName = document.getElementById('filter-advisor')?.value || '';
        currentFilters.stepType = document.getElementById('filter-step-type')?.value || '';
        currentFilters.applicationStatus = document.getElementById('filter-application-status')?.value || '';

        // 목록 다시 렌더링
        renderAdminThesisApplicationList();
    };

    // ========== 검색 필터 초기화 ==========
    window.resetAdminThesisApplicationFilters = function() {
        // 모든 필터 입력 초기화
        document.getElementById('filter-year').value = '';
        document.getElementById('filter-semester').value = '';
        document.getElementById('filter-college-type').value = '';
        document.getElementById('filter-graduate').value = '';
        document.getElementById('filter-college').value = '';
        document.getElementById('filter-undergraduate').value = '';
        document.getElementById('filter-department').value = '';
        document.getElementById('filter-degree').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-advisor').value = '';
        document.getElementById('filter-step-type').value = '';
        document.getElementById('filter-application-status').value = '';

        // 필터 객체 초기화
        currentFilters = {
            year: '',
            semester: '',
            collegeType: '',
            graduate: '',
            college: '',
            undergraduate: '',
            department: '',
            degreeType: '',
            academicStatus: '',
            advisorName: '',
            stepType: '',
            applicationStatus: ''
        };

        // 목록 다시 렌더링
        renderAdminThesisApplicationList();
    };

    // ========== 상세 화면 표시 ==========
    window.showAdminThesisApplicationDetail = function(id) {
        currentDetailId = id;

        // 데이터 찾기
        const application = appData.mockThesisApplications.find(app => app.id === id);
        if (!application) return;

        const student = appData.mockStudents.find(s => s.id === application.studentId);
        const stepType = appData.mockStepTypes.find(st => st.id === application.stepTypeId);
        if (!student || !stepType) return;

        // 상세 화면 HTML 생성 (학생 화면과 동일한 구조, 읽기전용)
        const detailHtml = `
            <div class="bg-white rounded-lg shadow p-6">
                <!-- 헤더 -->
                <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-900">논문신청 상세 정보</h2>
                    <button onclick="closeAdminThesisApplicationDetail()"
                            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                        <i class="fas fa-arrow-left mr-1"></i> 목록으로
                    </button>
                </div>

                <!-- 학생 기본 정보 -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">학생 기본 정보</h3>
                    <div class="grid grid-cols-4 gap-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">학년도</label>
                            <input type="text" value="${student.year}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">학기</label>
                            <input type="text" value="${student.semester}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">학번</label>
                            <input type="text" value="${student.studentNumber}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">성명</label>
                            <input type="text" value="${student.studentName}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-4 mt-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">대학구분</label>
                            <input type="text" value="${student.graduate.includes('일반') ? '대학원' : '특수대학원'}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">계열/대학원</label>
                            <input type="text" value="${student.graduate}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">학부(과)전공</label>
                            <input type="text" value="${student.undergraduate}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">학과/전공</label>
                            <input type="text" value="${student.department}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-4 mt-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">학위과정</label>
                            <input type="text" value="${student.degreeType}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">학적상태</label>
                            <input type="text" value="${student.academicStatus}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-xs text-gray-600 mb-1">지도교수명</label>
                            <input type="text" value="${student.advisorName}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                    </div>
                </div>

                <!-- 신청 정보 -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">신청 정보</h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">논문지도단계</label>
                            <input type="text" value="${stepType.name}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">신청기간</label>
                            <input type="text" value="${application.applicationPeriodStart} ~ ${application.applicationPeriodEnd}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">철회기간</label>
                            <input type="text" value="${application.withdrawalPeriodStart} ~ ${application.withdrawalPeriodEnd}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4 mt-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">신청상태</label>
                            <input type="text" value="${application.status === 'submitted' ? '신청완료' : '미신청'}" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                        </div>
                        ${application.submittedDate ? `
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">신청일시</label>
                                <input type="text" value="${application.submittedDate}" disabled
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed">
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // 목록 숨기고 상세 표시
        document.getElementById('thesis-application-list-view').style.display = 'none';
        const detailView = document.getElementById('thesis-application-detail-view');
        detailView.innerHTML = detailHtml;
        detailView.style.display = 'block';
    };

    // ========== 상세 화면 닫기 ==========
    window.closeAdminThesisApplicationDetail = function() {
        currentDetailId = null;
        document.getElementById('thesis-application-detail-view').style.display = 'none';
        document.getElementById('thesis-application-list-view').style.display = 'block';
    };

})();
