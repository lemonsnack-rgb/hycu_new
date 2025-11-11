/**
 * 학술지 대체심사 목록 관리
 */

function initJournalReview() {
    renderJournalReviewList();
}

function renderJournalReviewList() {
    const journals = getJournalReviews();

    const contentHtml = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-gray-800">학술지 대체심사 목록</h3>
                    <div class="text-sm text-gray-600">
                        <span class="font-semibold text-blue-600" id="journal-review-count">총 ${journals.length}건</span>
                    </div>
                </div>

                <!-- 검색 영역 -->
                <div class="search-container">
                    <div class="search-grid">
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                심사상태
                            </label>
                            <select id="journalStatusFilter" class="search-select">
                                <option value="">전체</option>
                                <option value="심사대기">심사대기</option>
                                <option value="심사중">심사중</option>
                                <option value="심사완료">심사완료</option>
                            </select>
                        </div>
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                키워드
                            </label>
                            <input type="text"
                                   id="journalSearchInput"
                                   placeholder="학번/성명/논문제목 검색"
                                   class="search-input"
                                   onkeypress="if(event.key==='Enter') searchJournalReviews()">
                        </div>
                    </div>
                    <div class="search-buttons">
                        <button onclick="searchJournalReviews()" class="search-btn search-btn-primary">
                            <i class="fas fa-search"></i>검색
                        </button>
                        <button onclick="resetJournalSearch()" class="search-btn search-btn-secondary">
                            <i class="fas fa-redo"></i>초기화
                        </button>
                    </div>
                </div>
            </div>

            <!-- 학술지 목록 -->
            <div id="journal-review-list">
                ${renderJournalReviewRows(journals)}
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
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">배정된 학술지 심사가 없습니다</h3>
                <p class="text-gray-500">학술지 심사가 배정되면 이곳에 표시됩니다.</p>
            </div>
        `;
    }

    return `
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학부/대학원</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과/전공</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정구분</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문제목</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학술지명</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">제출일</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">심사진행상태</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${journals.map((journal, index) => {
                        const statusClass = getJournalStatusBadgeClass(journal.status);

                        return `
                            <tr class="hover:bg-gray-50">
                                <td class="py-3 px-4 text-sm text-gray-600">${index + 1}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">일반대학원</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${journal.major || '-'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${journal.degree || '석사'}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${journal.studentId}</td>
                                <td class="py-3 px-4 text-sm font-medium text-gray-800">${journal.studentName}</td>
                                <td class="py-3 px-4 text-sm text-gray-600" style="max-width: 350px;">
                                    <div class="truncate" title="${journal.paperTitle}">
                                        ${journal.paperTitle}
                                    </div>
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-600" style="max-width: 200px;">
                                    <div class="truncate" title="${journal.journalName}">
                                        ${journal.journalName}
                                    </div>
                                </td>
                                <td class="py-3 px-4 text-center text-sm text-gray-600">${journal.submissionDate || '-'}</td>
                                <td class="py-3 px-4 text-center">
                                    <span class="text-xs font-semibold px-2 py-1 rounded-full ${statusClass}">
                                        ${journal.status}
                                    </span>
                                </td>
                                <td class="py-3 px-4 text-center">
                                    <div class="flex gap-2 justify-center">
                                        <button onclick="viewJournalReviewDetail(${journal.id})"
                                                class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded hover:bg-blue-50">
                                            ${journal.status === '심사완료' ? '조회' : '심사'}
                                        </button>
                                        <button onclick="downloadJournalPdf(${journal.id})"
                                                class="text-[#6A0028] hover:text-[#550020] text-xs font-medium px-2 py-1 border border-[#6A0028] rounded hover:bg-red-50">
                                            논문
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getJournalStatusBadgeClass(status) {
    const classes = {
        '심사대기': 'bg-yellow-100 text-yellow-800',
        '심사중': 'bg-blue-100 text-blue-800',
        '심사완료': 'bg-green-100 text-green-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
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

    const listContainer = document.getElementById('journal-review-list');
    if (listContainer) {
        listContainer.innerHTML = renderJournalReviewRows(journals);
    }

    // 카운트 업데이트
    const countEl = document.getElementById('journal-review-count');
    if (countEl) {
        countEl.textContent = `${journals.length}건 (전체 ${getJournalReviews().length}건)`;
    }
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
