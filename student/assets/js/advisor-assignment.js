// 학생용 지도교수 배정 조회 기능 (읽기 전용)
// 학교 시스템에서 연구계획서 등록 및 지도교수 배정을 관리하므로,
// 본 시스템에서는 조회 기능만 제공

// 학생용 지도교수 배정 조회 초기화
function initStudentAdvisorAssignment() {
    const currentStudentId = 'STU001';

    // Mock 데이터 로드 확인
    if (typeof mockStudents === 'undefined' || typeof mockResearchProposals === 'undefined' || typeof mockProfessors === 'undefined') {
        console.error('Mock 데이터가 로드되지 않았습니다.');
        const noProposalDiv = document.getElementById('student-no-proposal');
        if (noProposalDiv) {
            noProposalDiv.style.display = 'block';
            noProposalDiv.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-red-600 font-semibold">Mock 데이터가 로드되지 않았습니다.</p>
                    <p class="text-gray-500 mt-2">페이지를 새로고침해주세요.</p>
                </div>
            `;
        }
        return;
    }

    renderStudentProposalTable();
}

// 학생 연구계획서 테이블 렌더링
function renderStudentProposalTable() {
    const currentStudentId = 'STU001';

    // 현재 학생의 정보 조회
    const student = mockStudents.find(s => s.id === currentStudentId);
    if (!student) {
        console.error('학생 정보를 찾을 수 없습니다.');
        return;
    }

    // 현재 학생의 연구계획서 조회
    const myProposal = mockResearchProposals.find(p => p.studentId === currentStudentId);

    const tableBody = document.getElementById('student-proposal-list');
    const noProposalDiv = document.getElementById('student-no-proposal');

    if (!tableBody || !noProposalDiv) {
        console.warn('필요한 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    if (!myProposal) {
        // 연구계획서가 학교 시스템에 등록되지 않은 경우
        tableBody.innerHTML = '';
        noProposalDiv.style.display = 'block';
        noProposalDiv.innerHTML = `
            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="text-sm text-blue-700">
                        <p class="font-semibold mb-2">학교 시스템에서 연구계획서를 등록해주세요.</p>
                        <p>연구계획서는 학교의 ERP 시스템에서 등록하며, 등록된 데이터가 자동으로 이곳에 표시됩니다.</p>
                        <p class="mt-2">지도교수 배정은 연구계획서 등록 후 학교에서 자동으로 진행됩니다.</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 연구계획서가 등록된 경우
    noProposalDiv.style.display = 'none';

    // 지도교수 배정 정보 조회
    const assignment = typeof mockAdvisorAssignments !== 'undefined'
        ? mockAdvisorAssignments.find(a => a.studentId === currentStudentId)
        : null;

    // 테이블 렌더링
    tableBody.innerHTML = `
        <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewStudentProposalDetail('${myProposal.id}')">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.academicYear}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.semesterCount}학기</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${myProposal.title}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${myProposal.submittedDate}</td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${assignment && assignment.mainAdvisor
                    ? assignment.mainAdvisor.name
                    : '<span class="text-gray-400">미배정</span>'}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${assignment && assignment.coAdvisors && assignment.coAdvisors.length > 0
                    ? assignment.coAdvisors.map(c => c.name).join(', ')
                    : '<span class="text-gray-400">미배정</span>'}
            </td>
        </tr>
    `;
}

// 학교 시스템 연구계획서 폼 불러오기
function loadProposalFormStudent(proposalId) {
    console.log('학생용 연구계획서 폼 불러오기:', proposalId);

    const proposal = mockResearchProposals.find(p => p.id === proposalId);

    if (!proposal) {
        alert('연구계획서를 찾을 수 없습니다.');
        return;
    }

    if (proposal.formUrl) {
        const formWindow = window.open(proposal.formUrl, '_blank', 'width=1024,height=768');
        if (!formWindow) {
            alert('팝업 차단이 활성화되어 있습니다. 팝업 차단을 해제해주세요.');
        }
    } else {
        alert('학교 시스템에 등록된 연구계획서 폼이 없습니다.');
    }
}

// 연구계획서 상세 보기 (읽기 전용)
function viewStudentProposalDetail(proposalId) {
    const currentStudentId = 'STU001';
    const proposal = mockResearchProposals.find(p => p.id === proposalId);

    if (!proposal) {
        alert('연구계획서를 찾을 수 없습니다.');
        return;
    }

    const student = mockStudents.find(s => s.id === proposal.studentId);
    const assignment = typeof mockAdvisorAssignments !== 'undefined'
        ? mockAdvisorAssignments.find(a => a.studentId === proposal.studentId)
        : null;

    const screen = document.getElementById('advisor-assignment-screen');
    if (!screen) return;

    // 읽기 전용 상세 뷰
    screen.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="px-8 py-6 border-b border-gray-200">
                <div class="flex items-center justify-between mb-4">
                    <button onclick="returnToStudentProposalList(); return false;"
                            class="flex items-center text-gray-600 hover:text-gray-900">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        목록으로
                    </button>
                    <span class="px-3 py-1 rounded text-sm font-medium ${proposal.degreeType === '석사' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">
                        ${proposal.degreeType}
                    </span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">연구계획서 조회</h1>
            </div>

            <!-- 학생 정보 -->
            <div class="px-8 py-6 border-b border-gray-200 bg-gray-50">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">학생 정보</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학번:</span>
                        <span class="text-gray-900">${student?.studentNumber}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">이름:</span>
                        <span class="text-gray-900">${student?.name}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학과:</span>
                        <span class="text-gray-900">${student?.department}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학위과정:</span>
                        <span class="text-gray-900">${student?.degreeType}</span>
                    </div>
                </div>
            </div>

            <!-- 연구계획서 (읽기 전용) -->
            <div class="px-8 py-6 border-b border-gray-200">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-900">연구계획서</h2>
                    <button onclick="loadProposalFormStudent('${proposal.id}')"
                            class="px-4 py-3 bg-[#009DE8] text-white rounded-lg hover:bg-[#0087c9] flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                        </svg>
                        연구계획서 출력하기
                    </button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            논문 제목
                        </label>
                        <div class="w-full px-4 py-3 border border-gray-300 rounded-b-lg bg-gray-50 text-gray-900">
                            ${proposal.title}
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 목적
                        </label>
                        <div class="w-full px-4 py-3 border border-gray-300 rounded-b-lg bg-gray-50 text-gray-900 whitespace-pre-wrap">
                            ${proposal.purpose}
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 필요성
                        </label>
                        <div class="w-full px-4 py-3 border border-gray-300 rounded-b-lg bg-gray-50 text-gray-900 whitespace-pre-wrap">
                            ${proposal.necessity}
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 문제 및 연구 방법
                        </label>
                        <div class="w-full px-4 py-3 border border-gray-300 rounded-b-lg bg-gray-50 text-gray-900 whitespace-pre-wrap">
                            ${proposal.method}
                        </div>
                    </div>

                    <div class="text-xs text-gray-500 pt-3 border-t">
                        제출일: ${proposal.submittedDate}
                    </div>
                </div>
            </div>

            <!-- 지도교수 배정 현황 -->
            <div class="px-8 py-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">지도교수 배정 현황</h2>

                ${assignment ? `
                    <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div class="flex items-center">
                            <span class="text-gray-600 font-medium" style="min-width: 100px;">지도교수:</span>
                            <span class="text-gray-900">
                                ${assignment.mainAdvisor
                                    ? `${assignment.mainAdvisor.name} (${assignment.mainAdvisor.department})`
                                    : `<span class="text-gray-500">미배정</span>`
                                }
                            </span>
                        </div>

                        <div class="flex items-center">
                            <span class="text-gray-600 font-medium" style="min-width: 100px;">부지도교수:</span>
                            <span class="text-gray-900">
                                ${assignment.coAdvisors && assignment.coAdvisors.length > 0
                                    ? assignment.coAdvisors.map(c => `${c.name} (${c.department})`).join(', ')
                                    : `<span class="text-gray-500">미배정</span>`
                                }
                            </span>
                        </div>

                        <div class="text-xs text-gray-500 pt-2 border-t">
                            배정일: ${assignment.assignedDate}
                        </div>
                    </div>
                ` : `
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <svg class="w-12 h-12 mx-auto text-yellow-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-gray-600">지도교수 배정 대기 중입니다.</p>
                    </div>
                `}
            </div>

            <!-- 안내 메시지 -->
            <div class="px-8 py-6">
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div class="text-sm text-blue-700">
                            <p>연구계획서는 학교 시스템에서 관리됩니다.</p>
                            <p class="mt-1">수정이 필요한 경우 학교 ERP 시스템을 통해 진행해주세요.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 목록으로 돌아가기 (HTML 구조 복원)
function returnToStudentProposalList() {
    const screen = document.getElementById('advisor-assignment-screen');
    if (!screen) return;

    // 원래 HTML 구조 복원
    screen.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="p-6 border-b">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-gray-800">지도교수 배정 조회</h2>
                        <p class="text-sm text-gray-600 mt-1">학교 시스템에 등록된 연구계획서와 배정된 지도교수를 조회합니다.</p>
                    </div>
                </div>
            </div>

            <!-- 연구계획서 목록 테이블 -->
            <div class="p-6">
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">학년도</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">학기차</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">논문 제목</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">제출일</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">지도교수</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">부지도교수</th>
                            </tr>
                        </thead>
                        <tbody id="student-proposal-list" class="bg-white divide-y divide-gray-200">
                            <!-- JavaScript로 동적 생성 -->
                        </tbody>
                    </table>
                </div>

                <div id="student-no-proposal" class="text-center py-8 text-gray-500" style="display: none;">
                    <!-- JavaScript로 동적 생성 -->
                </div>
            </div>
        </div>
    `;

    // 초기화 호출하여 데이터 다시 로드
    initStudentAdvisorAssignment();
}
