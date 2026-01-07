/**
 * 학위논문 제출 화면
 * Version: 20260107001
 */

// 논문 단계
const THESIS_STAGES = {
    PROPOSAL: { id: 'proposal', name: '연구계획서' },
    INTERIM: { id: 'interim', name: '중간논문' },
    FINAL: { id: 'final', name: '최종논문' }
};

// 화면 초기화
document.addEventListener('DOMContentLoaded', function() {
    initThesisSubmission();
});

// 학위논문 제출 화면 초기화
function initThesisSubmission() {
    const content = document.getElementById('thesis-submission-content');
    if (!content) return;

    content.innerHTML = renderThesisSubmissionScreen();

    // 제출 이력 로드
    loadSubmissionHistory();
}

// 학위논문 제출 화면 렌더링
function renderThesisSubmissionScreen() {
    return `
        <!-- 탭 -->
        <div class="meeting-tabs mb-6">
            <button id="tab-proposal" class="tab-btn active" onclick="changeThesisTab('proposal')">
                연구계획서
            </button>
            <button id="tab-interim" class="tab-btn" onclick="changeThesisTab('interim')">
                중간논문
            </button>
            <button id="tab-final" class="tab-btn" onclick="changeThesisTab('final')">
                최종논문
            </button>
        </div>

        <!-- 제출 폼 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4" id="form-title">연구계획서 제출</h3>

            <div class="space-y-4">
                <!-- 제목 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">논문 제목 *</label>
                    <input type="text" id="thesis-title"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                           placeholder="논문 제목을 입력하세요">
                </div>

                <!-- 파일 업로드 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">파일 업로드 *</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input type="file" id="thesis-file" class="hidden" accept=".pdf,.doc,.docx" onchange="handleFileSelect(event)">
                        <button onclick="document.getElementById('thesis-file').click()"
                                class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            파일 선택
                        </button>
                        <p class="text-xs text-gray-500 mt-2">PDF, DOC, DOCX 파일만 업로드 가능합니다 (최대 10MB)</p>
                        <div id="file-info" class="mt-3 text-sm text-gray-600"></div>
                    </div>
                </div>

                <!-- 제출 코멘트 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">제출 코멘트</label>
                    <textarea id="thesis-comment" rows="4"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                              placeholder="교수님께 전달할 내용을 입력하세요 (선택사항)"></textarea>
                </div>

                <!-- 제출 버튼 -->
                <div class="flex justify-end gap-3">
                    <button onclick="resetThesisForm()"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        초기화
                    </button>
                    <button onclick="submitThesis()"
                            class="px-6 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034]">
                        제출하기
                    </button>
                </div>
            </div>
        </div>

        <!-- 제출 이력 -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">제출 이력</h3>
                    <span class="table-count" id="submission-count">(총 0건)</span>
                </div>
            </div>
            <div class="table-scroll">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 60px;">순번</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제출일시</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">단계</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">논문 제목</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">파일명</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">작업</th>
                        </tr>
                    </thead>
                    <tbody id="submission-history" class="bg-white divide-y divide-gray-200">
                        <!-- JavaScript로 동적 생성 -->
                    </tbody>
                </table>
                <div id="no-submissions" class="text-center py-8 text-gray-500" style="display: none;">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>제출 이력이 없습니다.</p>
                </div>
            </div>
        </div>
    `;
}

// 현재 선택된 단계
let currentThesisStage = 'proposal';

// 탭 변경
function changeThesisTab(stage) {
    currentThesisStage = stage;

    // 탭 활성화 상태 변경
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`tab-${stage}`).classList.add('active');

    // 폼 제목 변경
    const stageNames = {
        'proposal': '연구계획서',
        'interim': '중간논문',
        'final': '최종논문'
    };
    document.getElementById('form-title').textContent = `${stageNames[stage]} 제출`;

    // 제출 이력 다시 로드
    loadSubmissionHistory();
}

// 파일 선택 처리
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById('file-info');

    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        fileInfo.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-green-600 font-medium">${file.name} (${fileSize} MB)</span>
            </div>
        `;
    }
}

// 폼 초기화
function resetThesisForm() {
    document.getElementById('thesis-title').value = '';
    document.getElementById('thesis-file').value = '';
    document.getElementById('thesis-comment').value = '';
    document.getElementById('file-info').innerHTML = '';
}

// 논문 제출
function submitThesis() {
    const title = document.getElementById('thesis-title').value.trim();
    const file = document.getElementById('thesis-file').files[0];
    const comment = document.getElementById('thesis-comment').value.trim();

    if (!title) {
        alert('논문 제목을 입력해주세요.');
        return;
    }

    if (!file) {
        alert('파일을 선택해주세요.');
        return;
    }

    if (confirm('논문을 제출하시겠습니까?')) {
        // 실제로는 서버로 전송
        console.log('논문 제출:', { title, file, comment, stage: currentThesisStage });

        alert('논문이 제출되었습니다.');
        resetThesisForm();
        loadSubmissionHistory();
    }
}

// 제출 이력 로드
function loadSubmissionHistory() {
    const tbody = document.getElementById('submission-history');
    const noSubmissions = document.getElementById('no-submissions');
    const countSpan = document.getElementById('submission-count');

    // Mock 데이터
    const submissions = [
        {
            id: 1,
            date: '2024-12-15 14:30',
            stage: 'proposal',
            title: 'AI 기반 추천 시스템 연구',
            filename: 'proposal_v1.pdf',
            status: 'reviewed'
        },
        {
            id: 2,
            date: '2024-11-20 10:15',
            stage: 'proposal',
            title: 'AI 기반 추천 시스템 연구',
            filename: 'proposal_draft.pdf',
            status: 'pending'
        }
    ].filter(s => s.stage === currentThesisStage);

    if (submissions.length === 0) {
        tbody.innerHTML = '';
        noSubmissions.style.display = 'block';
        countSpan.textContent = '(총 0건)';
        return;
    }

    noSubmissions.style.display = 'none';
    countSpan.textContent = `(총 ${submissions.length}건)`;

    const statusMap = {
        'pending': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">검토중</span>',
        'reviewed': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">검토완료</span>',
        'rejected': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">반려</span>'
    };

    const stageNames = {
        'proposal': '연구계획서',
        'interim': '중간논문',
        'final': '최종논문'
    };

    tbody.innerHTML = submissions.map((submission, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-3 text-center text-sm text-gray-900">${index + 1}</td>
            <td class="px-6 py-3 text-sm text-gray-900">${submission.date}</td>
            <td class="px-6 py-3 text-sm text-gray-900">${stageNames[submission.stage]}</td>
            <td class="px-6 py-3 text-sm text-gray-900">${submission.title}</td>
            <td class="px-6 py-3 text-sm text-gray-900">${submission.filename}</td>
            <td class="px-6 py-3 text-center">${statusMap[submission.status]}</td>
            <td class="px-6 py-3 text-center">
                <button onclick="viewSubmission(${submission.id})"
                        class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">
                    상세보기
                </button>
            </td>
        </tr>
    `).join('');
}

// 제출 상세보기
function viewSubmission(id) {
    alert(`제출 ID ${id} 상세보기 (구현 예정)`);
}

// 탭 스타일 추가
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .meeting-tabs {
            display: flex;
            gap: 8px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 0;
        }
        .tab-btn {
            padding: 12px 24px;
            border: none;
            background: transparent;
            color: #6b7280;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
            transition: all 0.2s;
        }
        .tab-btn:hover {
            color: #6A0028;
        }
        .tab-btn.active {
            color: #6A0028;
            border-bottom-color: #6A0028;
        }
        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .table-header-left {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .table-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
        .table-count {
            font-size: 14px;
            color: #6b7280;
        }
        .table-scroll {
            overflow-x: auto;
        }
    `;
    document.head.appendChild(style);
});

// 전역 함수 등록
window.changeThesisTab = changeThesisTab;
window.handleFileSelect = handleFileSelect;
window.resetThesisForm = resetThesisForm;
window.submitThesis = submitThesis;
window.viewSubmission = viewSubmission;
