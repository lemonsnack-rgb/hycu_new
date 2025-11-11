/**
 * 학술지 대체심사 목록 관리
 */

function initJournalReview() {
    renderJournalReviewList();
}

function renderJournalReviewList() {
    const journals = getJournalReviews();

    const contentHtml = `
        <!-- 검색 영역 -->
        <div class="search-container">
            <div class="search-grid">
                <select class="search-select" id="journalStatusFilter">
                    <option value="">전체 상태</option>
                    <option value="심사대기">심사대기</option>
                    <option value="심사중">심사중</option>
                    <option value="심사완료">심사완료</option>
                </select>
                <input type="text"
                       class="search-input"
                       id="journalSearchInput"
                       placeholder="학생명, 논문 제목 검색...">
            </div>
            <div class="search-buttons">
                <button class="search-btn search-btn-primary" onclick="searchJournalReviews()">
                    <i class="fas fa-search"></i> 검색
                </button>
                <button class="search-btn search-btn-secondary" onclick="resetJournalSearch()">
                    <i class="fas fa-redo"></i> 초기화
                </button>
            </div>
        </div>

        <!-- 통계 카드 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-yellow-800">심사대기</p>
                        <p class="text-2xl font-bold text-yellow-900">${journals.filter(j => j.status === '심사대기').length}</p>
                    </div>
                    <i class="fas fa-clock text-3xl text-yellow-400"></i>
                </div>
            </div>
            <div class="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-blue-800">심사중</p>
                        <p class="text-2xl font-bold text-blue-900">${journals.filter(j => j.status === '심사중').length}</p>
                    </div>
                    <i class="fas fa-file-alt text-3xl text-blue-400"></i>
                </div>
            </div>
            <div class="bg-green-50 border-l-4 border-green-400 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-green-800">심사완료</p>
                        <p class="text-2xl font-bold text-green-900">${journals.filter(j => j.status === '심사완료').length}</p>
                    </div>
                    <i class="fas fa-check-circle text-3xl text-green-400"></i>
                </div>
            </div>
        </div>

        <!-- 학술지 목록 -->
        <div class="bg-white rounded-lg shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학생정보</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">논문정보</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기한</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">진행상태</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200" id="journalReviewTableBody">
                        ${renderJournalReviewRows(journals)}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const container = document.getElementById('journal-review-content');
    if (container) {
        container.innerHTML = contentHtml;
    }
}

function renderJournalReviewRows(journals) {
    if (journals.length === 0) {
        return `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-3"></i>
                    <p>심사할 학술지 논문이 없습니다.</p>
                </td>
            </tr>
        `;
    }

    return journals.map(journal => {
        const statusClass = {
            '심사대기': 'status-pending',
            '심사중': 'status-reviewing',
            '심사완료': 'status-complete'
        }[journal.status] || 'status-pending';

        const daysLeft = Math.ceil((new Date(journal.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        const isUrgent = daysLeft <= 7 && journal.status !== '심사완료';

        return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                    <div>
                        <p class="font-medium text-gray-900">${journal.studentName}</p>
                        <p class="text-sm text-gray-600">${journal.studentId}</p>
                        <p class="text-xs text-gray-500">${journal.major} (${journal.degree})</p>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="max-w-xs">
                        <p class="font-medium text-gray-900 line-clamp-2">${journal.paperTitle}</p>
                        <p class="text-sm text-gray-600 mt-1">${journal.journalName}</p>
                        <p class="text-xs text-gray-500 mt-1">제출일: ${journal.submissionDate}</p>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div>
                        <p class="text-sm font-medium text-gray-900">${journal.dueDate}</p>
                        ${journal.status !== '심사완료' ? `
                            <p class="text-xs ${isUrgent ? 'text-red-600 font-medium' : 'text-gray-600'} mt-1">
                                ${isUrgent ? '⚠️ ' : ''}${daysLeft}일 남음
                            </p>
                        ` : ''}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="status-badge ${statusClass}">${journal.status}</span>
                    <div class="mt-2">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full transition-all" style="width: ${journal.progress}%"></div>
                        </div>
                        <p class="text-xs text-gray-600 mt-1">${journal.progress}%</p>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        ${journal.status === '심사완료' ? `
                            <button onclick="viewJournalReviewDetail(${journal.id})"
                                    class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                <i class="fas fa-eye"></i> 보기
                            </button>
                        ` : `
                            <button onclick="viewJournalReviewDetail(${journal.id})"
                                    class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                <i class="fas fa-edit"></i> 심사하기
                            </button>
                        `}
                        <button onclick="downloadJournalPdf(${journal.id})"
                                class="px-3 py-1 text-sm bg-[#6A0028] text-white rounded hover:bg-[#550020] transition-colors">
                            <i class="fas fa-download"></i> 논문
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function searchJournalReviews() {
    const status = document.getElementById('journalStatusFilter').value;
    const searchText = document.getElementById('journalSearchInput').value.toLowerCase();

    let journals = getJournalReviews();

    if (status) {
        journals = journals.filter(j => j.status === status);
    }

    if (searchText) {
        journals = journals.filter(j =>
            j.studentName.toLowerCase().includes(searchText) ||
            j.paperTitle.toLowerCase().includes(searchText) ||
            j.journalName.toLowerCase().includes(searchText)
        );
    }

    document.getElementById('journalReviewTableBody').innerHTML = renderJournalReviewRows(journals);
}

function resetJournalSearch() {
    document.getElementById('journalStatusFilter').value = '';
    document.getElementById('journalSearchInput').value = '';
    renderJournalReviewList();
}

function downloadJournalPdf(journalId) {
    const journal = getJournalReviews().find(j => j.id === journalId);
    if (journal) {
        alert(`논문 다운로드: ${journal.paperTitle}\n파일: ${journal.pdfUrl}`);
    }
}

// 전역 export
window.initJournalReview = initJournalReview;
window.searchJournalReviews = searchJournalReviews;
window.resetJournalSearch = resetJournalSearch;
window.downloadJournalPdf = downloadJournalPdf;

console.log('✅ 학술지 심사 목록 모듈 로드 완료');
