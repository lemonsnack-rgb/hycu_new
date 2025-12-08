// 학생용 지도교수 배정 조회 및 연구계획서 제출 기능

// 연구계획서 제출 폼 표시
function showProposalForm() {
    document.getElementById('student-no-proposal').style.display = 'none';
    document.getElementById('student-proposal-form').style.display = 'block';
}

// 연구계획서 제출 폼 취소
function cancelProposalForm() {
    document.getElementById('student-proposal-form').style.display = 'none';
    document.getElementById('student-no-proposal').style.display = 'block';
    document.getElementById('research-proposal-form').reset();
}

// 연구계획서 제출 처리
function submitResearchProposal(event) {
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

    // 화면 새로고침
    initStudentAdvisorAssignment();
}

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

    // 연구계획서 제출 여부 확인
    const myProposal = mockResearchProposals.find(p => p.studentId === currentStudentId);
    const myAssignment = typeof mockAdvisorAssignments !== 'undefined'
        ? mockAdvisorAssignments.find(a => a.studentId === currentStudentId)
        : null;

    const proposalFormDiv = document.getElementById('student-proposal-form');
    const proposalInfoDiv = document.getElementById('student-proposal-info');
    const advisorSectionDiv = document.getElementById('student-advisor-section');
    const noProposalDiv = document.getElementById('student-no-proposal');

    // 모든 섹션 초기화
    proposalFormDiv.style.display = 'none';
    proposalInfoDiv.style.display = 'none';
    advisorSectionDiv.style.display = 'none';
    noProposalDiv.style.display = 'none';

    if (!myProposal) {
        // 연구계획서 미제출 시 안내 메시지 표시
        noProposalDiv.style.display = 'block';
        return;
    }

    // 연구계획서 제출 완료 시 정보 표시
    proposalInfoDiv.style.display = 'block';
    document.getElementById('proposal-details').innerHTML = `
        <div class="bg-gray-50 p-4 rounded-lg">
            <div class="mb-3">
                <span class="font-medium text-gray-700">논문 제목:</span>
                <p class="text-gray-900 mt-1">${myProposal.title}</p>
            </div>
            <div class="mb-3">
                <span class="font-medium text-gray-700">연구 목적:</span>
                <p class="text-gray-600 mt-1">${myProposal.purpose}</p>
            </div>
            <div class="mb-3">
                <span class="font-medium text-gray-700">연구의 필요성:</span>
                <p class="text-gray-600 mt-1">${myProposal.necessity}</p>
            </div>
            <div class="mb-3">
                <span class="font-medium text-gray-700">연구 방법:</span>
                <p class="text-gray-600 mt-1">${myProposal.method}</p>
            </div>
            <div class="text-xs text-gray-500 mt-4 pt-3 border-t">
                제출일: ${myProposal.submittedDate}
            </div>
        </div>
    `;

    // 지도교수 배정 여부 확인
    if (!myAssignment || (!myAssignment.mainAdvisor && (!myAssignment.coAdvisors || myAssignment.coAdvisors.length === 0))) {
        // 배정 대기 중 메시지
        advisorSectionDiv.style.display = 'block';
        document.getElementById('student-advisor-content').innerHTML = `
            <div class="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <svg class="w-12 h-12 mx-auto text-yellow-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h4 class="text-lg font-semibold text-gray-800 mb-2">지도교수 배정 대기 중</h4>
                <p class="text-gray-600">관리자가 곧 지도교수를 배정할 예정입니다.</p>
            </div>
        `;
        return;
    }

    // 지도교수 배정 완료 시 정보 표시
    advisorSectionDiv.style.display = 'block';
    const contentDiv = document.getElementById('student-advisor-content');

    let cardsHTML = '';

    // 주지도교수 카드 (파란색)
    if (myAssignment.mainAdvisor) {
        const prof = mockProfessors.find(p => p.id === myAssignment.mainAdvisor.id);
        if (prof) {
            cardsHTML += `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${prof.name} 교수</h3>
                            <span class="text-sm text-blue-600 font-medium">주지도교수</span>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            ${prof.department}
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            ${prof.email}
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            ${prof.phone}
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                        배정일: ${myAssignment.assignedDate}
                    </div>
                </div>
            `;
        }
    }

    // 부지도교수 카드 (보라색)
    if (myAssignment.coAdvisors && myAssignment.coAdvisors.length > 0) {
        myAssignment.coAdvisors.forEach(coAdvisor => {
            const prof = mockProfessors.find(p => p.id === coAdvisor.id);
            if (prof) {
                cardsHTML += `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800">${prof.name} 교수</h3>
                                <span class="text-sm text-purple-600 font-medium">부지도교수</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                ${prof.department}
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                ${prof.email}
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                ${prof.phone}
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                            배정일: ${myAssignment.assignedDate}
                        </div>
                    </div>
                `;
            }
        });
    }

    contentDiv.innerHTML = cardsHTML;
}

// 폼 제출 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('research-proposal-form');
    if (form) {
        form.addEventListener('submit', submitResearchProposal);
    }
});
