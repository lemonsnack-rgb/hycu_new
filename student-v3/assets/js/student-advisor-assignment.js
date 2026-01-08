// ==================== 학생용 지도교수 배정 조회 (읽기 전용) ====================

// 현재 학생 ID (실제로는 세션에서 가져옴)
const currentStudentId = 'STU001';

/**
 * 지도교수 배정 화면 렌더링 (목록 없이 바로 상세 화면)
 */
function renderStudentAdvisorAssignmentScreen() {
    console.log('🔍 renderStudentAdvisorAssignmentScreen 호출됨');

    const container = document.getElementById('advisor-assignment-content');
    if (!container) {
        console.error('❌ advisor-assignment-content 컨테이너를 찾을 수 없습니다');
        return;
    }
    console.log('✅ advisor-assignment-content 컨테이너 찾음');

    // Mock 데이터 확인
    if (typeof mockResearchProposals === 'undefined' || typeof mockAdvisorAssignments === 'undefined') {
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-8">
                <div class="text-center text-red-500">
                    <p class="text-lg">Mock 데이터가 로드되지 않았습니다.</p>
                    <p class="text-sm mt-2">mockData.js 파일을 확인하세요.</p>
                </div>
            </div>
        `;
        return;
    }

    // 현재 학생의 연구계획서 찾기
    let proposal = mockResearchProposals.find(p => p.studentId === currentStudentId);

    // 학생 정보 찾기
    const student = mockStudents.find(s => s.id === currentStudentId);

    // 연구계획서가 없어도 빈 객체로 초기화하여 화면 표시
    if (!proposal) {
        proposal = {
            id: null,
            studentId: currentStudentId,
            studentNumber: student?.studentNumber || '-',
            studentName: student?.name || '-',
            department: student?.department || '-',
            degreeType: student?.degreeType || '-',
            title: '',
            purpose: '',
            necessity: '',
            method: '',
            desiredAdvisor: null,
            submittedAt: null
        };
    }

    // 배정 정보 찾기
    const assignment = mockAdvisorAssignments.find(a => a.studentId === currentStudentId);

    // 상세 화면 렌더링
    renderAdvisorAssignmentDetail(proposal, student, assignment, container);
}

/**
 * 지도교수 배정 상세 화면 렌더링
 */
function renderAdvisorAssignmentDetail(proposal, student, assignment, container) {
    const detailView = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 학생 정보 카드 -->
            <div class="px-8 py-6 border-b border-gray-200">
                <div class="bg-white rounded-lg shadow-md">
                    <div class="px-6 py-4 border-b bg-gray-50">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
                        <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                                <span class="text-gray-900 font-medium">일반대학원</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                                <span class="text-gray-900 font-medium">일반대학원</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                                <span class="text-gray-900 font-medium">-</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                                <span class="text-gray-900 font-medium">${student?.department || '-'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                                <span class="text-gray-900 font-medium">${proposal.degreeType}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                                <span class="text-gray-900 font-medium">${student?.status === 'active' ? '재학' : '휴학'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학번:</span>
                                <span class="text-gray-900 font-medium">${student?.studentNumber || '-'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">성명:</span>
                                <span class="text-gray-900 font-medium">${student?.name || '-'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                                <span class="text-gray-900 font-medium">
                                    ${assignment && assignment.mainAdvisor ? `${assignment.mainAdvisor.name} (주)` : '-'}${assignment && assignment.coAdvisors.length > 0 ? `, ${assignment.coAdvisors.map(c => `${c.name} (부)`).join(', ')}` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 연구계획서 정보 -->
            <div class="px-8 py-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">연구계획서 정보</h2>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연구 제목</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p class="text-gray-900 font-medium">${proposal.title || ''}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연구 목적</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[120px]">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.purpose || ''}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연구 필요성</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[120px]">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.necessity || ''}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연구 문제 및 연구 방법</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[120px]">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.method || ''}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">희망 지도교수 (참고용)</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            ${student?.degreeType === '박사'
                                ? (proposal.desiredAdvisor
                                    ? `<p class="text-gray-900">${proposal.desiredAdvisor.name} (${proposal.desiredAdvisor.department || '소속 정보 없음'})</p>`
                                    : `<p class="text-gray-500">-</p>`)
                                : `<p class="text-gray-500">(박사 과정에서만 사용할 수 있는 기능)</p>`
                            }
                        </div>
                    </div>
                </div>

                <!-- 연구계획서 양식 불러오기 버튼 -->
                <div class="mt-6 flex justify-end">
                    <button onclick="loadProposalForm('${proposal.id || ''}')"
                            class="px-6 py-3 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034] flex items-center gap-2 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        연구계획서 양식 불러오기
                    </button>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = detailView;
}

// 전역 함수 등록
window.renderStudentAdvisorAssignmentScreen = renderStudentAdvisorAssignmentScreen;

console.log('✅ student-advisor-assignment.js 로드 완료');
