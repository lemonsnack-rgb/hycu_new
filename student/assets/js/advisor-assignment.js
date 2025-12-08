// 학생용 지도교수 배정 조회 및 연구계획서 제출 기능

// 학생용 지도교수 배정 조회 초기화
function initStudentAdvisorAssignment() {
    const currentStudentId = 'STU001';

    // Mock 데이터 로드 확인
    if (typeof mockStudents === 'undefined' || typeof mockResearchProposals === 'undefined' || typeof mockProfessors === 'undefined') {
        console.error('Mock 데이터가 로드되지 않았습니다.');
        document.getElementById('student-no-proposal').style.display = 'block';
        document.getElementById('student-no-proposal').innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-600 font-semibold">Mock 데이터가 로드되지 않았습니다.</p>
                <p class="text-gray-500 mt-2">페이지를 새로고침해주세요.</p>
            </div>
        `;
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
    const addButton = document.getElementById('student-add-proposal-btn');

    if (!tableBody || !noProposalDiv || !addButton) {
        console.warn('필요한 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    if (!myProposal) {
        // 연구계획서 미제출 시
        tableBody.innerHTML = '';
        noProposalDiv.style.display = 'block';
        addButton.style.display = 'inline-flex';
        return;
    }

    // 연구계획서 제출 완료 시
    noProposalDiv.style.display = 'none';
    addButton.style.display = 'none';

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

// 연구계획서 등록 폼 표시
function showStudentProposalForm() {
    const currentStudentId = 'STU001';
    const student = mockStudents.find(s => s.id === currentStudentId);

    if (!student) {
        alert('학생 정보를 찾을 수 없습니다.');
        return;
    }

    const screen = document.getElementById('advisor-assignment-screen');
    if (!screen) return;

    // 등록 폼 HTML
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
                </div>
                <h1 class="text-2xl font-bold text-gray-900">연구계획서 등록</h1>
            </div>

            <!-- 학생 정보 -->
            <div class="px-8 py-6 border-b border-gray-200 bg-gray-50">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">학생 정보</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학번:</span>
                        <span class="text-gray-900">${student.studentNumber}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">성명:</span>
                        <span class="text-gray-900">${student.name}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학과:</span>
                        <span class="text-gray-900">${student.department}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학위과정:</span>
                        <span class="text-gray-900">${student.degreeType}</span>
                    </div>
                </div>
            </div>

            <!-- 연구계획서 입력 폼 -->
            <form id="student-proposal-form" class="px-8 py-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            논문 제목 <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="proposal-title" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               placeholder="논문 제목을 입력하세요">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 목적 <span class="text-red-500">*</span>
                        </label>
                        <textarea id="proposal-purpose" required rows="6"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="연구의 목적을 입력하세요"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구의 필요성 <span class="text-red-500">*</span>
                        </label>
                        <textarea id="proposal-necessity" required rows="6"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="연구의 필요성을 입력하세요"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 문제 및 연구 방법 <span class="text-red-500">*</span>
                        </label>
                        <textarea id="proposal-method" required rows="6"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="연구 방법을 입력하세요"></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" onclick="returnToStudentProposalList()"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        취소
                    </button>
                    <button type="submit"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        제출
                    </button>
                </div>
            </form>
        </div>
    `;

    // 폼 제출 이벤트 리스너
    const form = document.getElementById('student-proposal-form');
    if (form) {
        form.addEventListener('submit', submitStudentProposal);
    }
}

// 연구계획서 제출 처리
function submitStudentProposal(event) {
    event.preventDefault();

    const currentStudentId = 'STU001';
    const student = mockStudents.find(s => s.id === currentStudentId);

    if (!student) {
        alert('학생 정보를 찾을 수 없습니다.');
        return;
    }

    const title = document.getElementById('proposal-title').value;
    const purpose = document.getElementById('proposal-purpose').value;
    const necessity = document.getElementById('proposal-necessity').value;
    const method = document.getElementById('proposal-method').value;

    // 새로운 연구계획서 데이터 생성
    const newProposal = {
        id: `RP${String(mockResearchProposals.length + 1).padStart(3, '0')}`,
        studentId: currentStudentId,
        studentNumber: student.studentNumber,
        studentName: student.name,
        department: student.department,
        degreeType: student.degreeType,
        title: title,
        purpose: purpose,
        necessity: necessity,
        method: method,
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        desiredAdvisor: null
    };

    // mockResearchProposals에 추가
    mockResearchProposals.push(newProposal);

    alert('연구계획서가 제출되었습니다.');

    // 목록으로 복귀
    returnToStudentProposalList();
}

// 연구계획서 상세 보기 (수정 가능)
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

    // 상세 뷰 + 수정 가능 폼
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
                <h1 class="text-2xl font-bold text-gray-900">연구계획서 수정</h1>
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
                        <span class="w-24 text-gray-600 font-medium">성명:</span>
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

            <!-- 연구계획서 수정 폼 -->
            <form id="student-proposal-edit-form" class="px-8 py-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">연구계획서</h2>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            논문 제목 <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="edit-proposal-title" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               value="${proposal.title}">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 목적 <span class="text-red-500">*</span>
                        </label>
                        <textarea id="edit-proposal-purpose" required rows="6"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">${proposal.purpose}</textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 필요성 <span class="text-red-500">*</span>
                        </label>
                        <textarea id="edit-proposal-necessity" required rows="6"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">${proposal.necessity}</textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 문제 및 연구 방법 <span class="text-red-500">*</span>
                        </label>
                        <textarea id="edit-proposal-method" required rows="6"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">${proposal.method}</textarea>
                    </div>

                    <div class="text-xs text-gray-500 pt-3 border-t">
                        제출일: ${proposal.submittedDate}
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" onclick="returnToStudentProposalList()"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        취소
                    </button>
                    <button type="submit"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        수정
                    </button>
                </div>
            </form>

            <!-- 지도교수 배정 현황 -->
            <div class="px-8 py-6">
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
        </div>
    `;

    // 수정 폼 제출 이벤트 리스너
    const editForm = document.getElementById('student-proposal-edit-form');
    if (editForm) {
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            updateStudentProposal(proposalId);
        });
    }
}

// 연구계획서 수정 처리
function updateStudentProposal(proposalId) {
    const proposal = mockResearchProposals.find(p => p.id === proposalId);

    if (!proposal) {
        alert('연구계획서를 찾을 수 없습니다.');
        return;
    }

    const title = document.getElementById('edit-proposal-title').value;
    const purpose = document.getElementById('edit-proposal-purpose').value;
    const necessity = document.getElementById('edit-proposal-necessity').value;
    const method = document.getElementById('edit-proposal-method').value;

    // 연구계획서 업데이트
    proposal.title = title;
    proposal.purpose = purpose;
    proposal.necessity = necessity;
    proposal.method = method;

    alert('연구계획서가 수정되었습니다.');

    // 목록으로 복귀
    returnToStudentProposalList();
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
                        <h2 class="text-xl font-semibold text-gray-800">지도교수 배정 조회</h2>
                        <p class="text-sm text-gray-600 mt-1">나의 연구계획서와 배정된 지도교수를 조회합니다.</p>
                    </div>
                    <button id="student-add-proposal-btn" onclick="showStudentProposalForm()"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            style="display: none;">
                        <i class="fas fa-plus mr-2"></i>연구계획서 등록
                    </button>
                </div>
            </div>

            <!-- 연구계획서 목록 테이블 -->
            <div class="p-6">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학년도</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학기차</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">논문 제목</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제출일</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지도교수</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부지도교수</th>
                            </tr>
                        </thead>
                        <tbody id="student-proposal-list" class="bg-white divide-y divide-gray-200">
                            <!-- JavaScript로 동적 생성 -->
                        </tbody>
                    </table>
                </div>

                <div id="student-no-proposal" class="text-center py-8 text-gray-500" style="display: none;">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>연구계획서를 제출해주세요.</p>
                </div>
            </div>
        </div>
    `;

    // 초기화 호출하여 데이터 다시 로드
    initStudentAdvisorAssignment();
}
