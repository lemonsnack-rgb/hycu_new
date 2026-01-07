/**
 * 학술지 논문 제출 화면
 * Version: 20260107001
 */

// 화면 초기화
document.addEventListener('DOMContentLoaded', function() {
    initJournalSubmission();
});

// 학술지 논문 제출 화면 초기화
function initJournalSubmission() {
    const content = document.getElementById('journal-submission-content');
    if (!content) return;

    content.innerHTML = renderJournalSubmissionScreen();

    // 제출 이력 로드
    loadJournalSubmissionHistory();
}

// 학술지 논문 제출 화면 렌더링
function renderJournalSubmissionScreen() {
    return `
        <!-- 제출 폼 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">학술지 논문 제출</h3>

            <div class="space-y-4">
                <!-- 논문 제목 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">논문 제목 *</label>
                    <input type="text" id="journal-title"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                           placeholder="논문 제목을 입력하세요">
                </div>

                <!-- 학술지 정보 -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">학술지명 *</label>
                        <input type="text" id="journal-name"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                               placeholder="학술지명을 입력하세요">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">게재 연월 *</label>
                        <input type="month" id="journal-date"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]">
                    </div>
                </div>

                <!-- 학술지 등급 및 ISSN -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">학술지 등급</label>
                        <select id="journal-grade"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]">
                            <option value="">선택</option>
                            <option value="KCI">KCI 등재지</option>
                            <option value="KCI후보">KCI 등재후보지</option>
                            <option value="SCI">SCI</option>
                            <option value="SSCI">SSCI</option>
                            <option value="SCIE">SCIE</option>
                            <option value="SCOPUS">SCOPUS</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">ISSN</label>
                        <input type="text" id="journal-issn"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                               placeholder="ISSN 번호를 입력하세요">
                    </div>
                </div>

                <!-- 저자 정보 -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">제1저자 *</label>
                        <input type="text" id="journal-first-author"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                               placeholder="제1저자명">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">교신저자</label>
                        <input type="text" id="journal-corresponding-author"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                               placeholder="교신저자명">
                    </div>
                </div>

                <!-- 공동저자 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">공동저자</label>
                    <input type="text" id="journal-co-authors"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                           placeholder="공동저자명 (쉼표로 구분)">
                </div>

                <!-- 파일 업로드 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">논문 파일 *</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input type="file" id="journal-file" class="hidden" accept=".pdf,.doc,.docx" onchange="handleJournalFileSelect(event)">
                        <button onclick="document.getElementById('journal-file').click()"
                                class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            파일 선택
                        </button>
                        <p class="text-xs text-gray-500 mt-2">PDF, DOC, DOCX 파일만 업로드 가능합니다 (최대 10MB)</p>
                        <div id="journal-file-info" class="mt-3 text-sm text-gray-600"></div>
                    </div>
                </div>

                <!-- 게재증명서 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">게재증명서</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input type="file" id="journal-proof" class="hidden" accept=".pdf,.jpg,.jpeg,.png" onchange="handleJournalProofSelect(event)">
                        <button onclick="document.getElementById('journal-proof').click()"
                                class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            파일 선택
                        </button>
                        <p class="text-xs text-gray-500 mt-2">PDF, JPG, PNG 파일 업로드 가능 (선택사항)</p>
                        <div id="journal-proof-info" class="mt-3 text-sm text-gray-600"></div>
                    </div>
                </div>

                <!-- 제출 코멘트 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">제출 코멘트</label>
                    <textarea id="journal-comment" rows="4"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0028] focus:border-[#6A0028]"
                              placeholder="교수님께 전달할 내용을 입력하세요 (선택사항)"></textarea>
                </div>

                <!-- 제출 버튼 -->
                <div class="flex justify-end gap-3">
                    <button onclick="resetJournalForm()"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        초기화
                    </button>
                    <button onclick="submitJournal()"
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
                    <span class="table-count" id="journal-submission-count">(총 0건)</span>
                </div>
            </div>
            <div class="table-scroll">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 60px;">순번</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제출일시</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">논문 제목</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학술지명</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게재연월</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">등급</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">작업</th>
                        </tr>
                    </thead>
                    <tbody id="journal-submission-history" class="bg-white divide-y divide-gray-200">
                        <!-- JavaScript로 동적 생성 -->
                    </tbody>
                </table>
                <div id="no-journal-submissions" class="text-center py-8 text-gray-500" style="display: none;">
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

// 논문 파일 선택 처리
function handleJournalFileSelect(event) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById('journal-file-info');

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

// 게재증명서 파일 선택 처리
function handleJournalProofSelect(event) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById('journal-proof-info');

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
function resetJournalForm() {
    document.getElementById('journal-title').value = '';
    document.getElementById('journal-name').value = '';
    document.getElementById('journal-date').value = '';
    document.getElementById('journal-grade').value = '';
    document.getElementById('journal-issn').value = '';
    document.getElementById('journal-first-author').value = '';
    document.getElementById('journal-corresponding-author').value = '';
    document.getElementById('journal-co-authors').value = '';
    document.getElementById('journal-file').value = '';
    document.getElementById('journal-proof').value = '';
    document.getElementById('journal-comment').value = '';
    document.getElementById('journal-file-info').innerHTML = '';
    document.getElementById('journal-proof-info').innerHTML = '';
}

// 학술지 논문 제출
function submitJournal() {
    const title = document.getElementById('journal-title').value.trim();
    const journalName = document.getElementById('journal-name').value.trim();
    const journalDate = document.getElementById('journal-date').value;
    const firstAuthor = document.getElementById('journal-first-author').value.trim();
    const file = document.getElementById('journal-file').files[0];

    if (!title) {
        alert('논문 제목을 입력해주세요.');
        return;
    }

    if (!journalName) {
        alert('학술지명을 입력해주세요.');
        return;
    }

    if (!journalDate) {
        alert('게재 연월을 선택해주세요.');
        return;
    }

    if (!firstAuthor) {
        alert('제1저자를 입력해주세요.');
        return;
    }

    if (!file) {
        alert('논문 파일을 선택해주세요.');
        return;
    }

    if (confirm('학술지 논문을 제출하시겠습니까?')) {
        // 실제로는 서버로 전송
        console.log('학술지 논문 제출:', {
            title,
            journalName,
            journalDate,
            firstAuthor,
            file
        });

        alert('학술지 논문이 제출되었습니다.');
        resetJournalForm();
        loadJournalSubmissionHistory();
    }
}

// 제출 이력 로드
function loadJournalSubmissionHistory() {
    const tbody = document.getElementById('journal-submission-history');
    const noSubmissions = document.getElementById('no-journal-submissions');
    const countSpan = document.getElementById('journal-submission-count');

    // Mock 데이터
    const submissions = [
        {
            id: 1,
            date: '2024-12-01 16:20',
            title: '딥러닝 기반 음성 인식 시스템 개발',
            journal: '한국음향학회지',
            publishDate: '2024-11',
            grade: 'KCI',
            status: 'approved'
        }
    ];

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
        'approved': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">승인</span>',
        'rejected': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">반려</span>'
    };

    tbody.innerHTML = submissions.map((submission, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-3 text-center text-sm text-gray-900">${index + 1}</td>
            <td class="px-6 py-3 text-sm text-gray-900">${submission.date}</td>
            <td class="px-6 py-3 text-sm text-gray-900">${submission.title}</td>
            <td class="px-6 py-3 text-sm text-gray-900">${submission.journal}</td>
            <td class="px-6 py-3 text-sm text-gray-900">${submission.publishDate}</td>
            <td class="px-6 py-3 text-center text-sm text-gray-900">${submission.grade}</td>
            <td class="px-6 py-3 text-center">${statusMap[submission.status]}</td>
            <td class="px-6 py-3 text-center">
                <button onclick="viewJournalSubmission(${submission.id})"
                        class="text-sm text-[#6A0028] hover:text-[#8A0034] font-medium">
                    상세보기
                </button>
            </td>
        </tr>
    `).join('');
}

// 제출 상세보기
function viewJournalSubmission(id) {
    alert(`학술지 논문 제출 ID ${id} 상세보기 (구현 예정)`);
}

// 전역 함수 등록
window.handleJournalFileSelect = handleJournalFileSelect;
window.handleJournalProofSelect = handleJournalProofSelect;
window.resetJournalForm = resetJournalForm;
window.submitJournal = submitJournal;
window.viewJournalSubmission = viewJournalSubmission;
