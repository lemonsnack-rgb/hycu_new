/**
 * 학생 - 학술지 대체 심사 신청
 */

function initJournalSubmission() {
    renderJournalSubmissionList();
}

function renderJournalSubmissionList() {
    const container = document.getElementById('journalSubmissionContainer');
    if (!container) return;

    // Mock data - 실제로는 서버에서 가져옴
    const submissions = [
        {
            id: 1,
            paperTitle: 'AI 기반 데이터 분석 연구',
            journalName: 'Journal of AI Research',
            grade: 'SCI',
            submitDate: '2025-10-15',
            status: '승인 대기',
            editable: false
        }
    ];

    const content = `
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1F2937;">학술지 대체 심사 신청</h2>
                    <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">학술지 게재 실적으로 대체 심사를 신청하세요</p>
                </div>
                <button onclick="showJournalSubmissionModal()" class="btn-primary">
                    + 학술지 대체 심사 실적 제출
                </button>
            </div>

            <div class="card-body" style="padding: 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
                        <tr>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">논문 제목</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">학술지명</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">등급</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">제출일</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${submissions.length > 0 ? submissions.map(sub => `
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 0.75rem 1rem; font-weight: 500; color: #1F2937;">${sub.paperTitle}</td>
                                <td style="padding: 0.75rem 1rem; color: #6B7280; font-size: 0.875rem;">${sub.journalName}</td>
                                <td style="padding: 0.75rem 1rem;">
                                    <span style="background: #DBEAFE; color: #1E40AF; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${sub.grade}</span>
                                </td>
                                <td style="padding: 0.75rem 1rem; color: #6B7280; font-size: 0.875rem;">${sub.submitDate}</td>
                                <td style="padding: 0.75rem 1rem;">
                                    <span style="background: #FEF3C7; color: #92400E; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${sub.status}</span>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="5" style="padding: 3rem; text-align: center; color: #9CA3AF;">
                                    제출한 학술지 실적이 없습니다
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 안내사항 -->
        <div style="margin-top: 1.5rem; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 0.5rem; padding: 1rem;">
            <h4 style="font-weight: 600; color: #1E40AF; margin-bottom: 0.75rem;">
                📌 학술지 대체 심사 안내
            </h4>
            <ul style="font-size: 0.875rem; color: #1E40AF; padding-left: 1.25rem; margin: 0;">
                <li style="margin-bottom: 0.5rem;">SCI, SSCI, SCIE 등급 학술지 게재 시 최종 논문 심사를 대체할 수 있습니다</li>
                <li style="margin-bottom: 0.5rem;">제출 후에는 수정이 불가하오니 신중히 입력해주세요</li>
                <li style="margin-bottom: 0.5rem;">관리자 승인 후 지도교수의 최종 확인이 필요합니다</li>
                <li>자세한 사항은 지도교수 또는 관리자에게 문의하세요</li>
            </ul>
        </div>
    `;

    container.innerHTML = content;
}

// 학술지 제출 모달
function showJournalSubmissionModal() {
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>학술지 대체 심사 실적 제출</h3>
                    <button onclick="closeJournalModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <form id="journalSubmissionForm" onsubmit="submitJournal(event)" class="space-y-6">

                    <!-- 논문 정보 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-bold mb-4">논문 정보</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">논문 제목 (한글) *</label>
                                <input type="text" id="paperTitle" required
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="한글 논문 제목을 입력하세요">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">논문 제목 (영문)</label>
                                <input type="text" id="paperTitleEn"
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="영문 제목을 입력하세요">
                            </div>
                        </div>
                    </div>

                    <!-- 저자 정보 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-bold mb-4">저자 정보</h4>
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">제1저자 *</label>
                                    <input type="text" id="firstAuthor" required
                                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="성명">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">교신저자 *</label>
                                    <input type="text" id="correspondingAuthor" required
                                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="성명">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">공동저자</label>
                                <input type="text" id="coAuthors"
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="여러 명인 경우 쉼표(,)로 구분">
                            </div>
                        </div>
                    </div>

                    <!-- 학술지 정보 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-bold mb-4">학술지 정보</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">학술지명 *</label>
                                <input type="text" id="journalName" required
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="학술지 이름을 입력하세요">
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">등급 *</label>
                                    <select id="journalGrade" required
                                            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">선택</option>
                                        <option value="SCI">SCI</option>
                                        <option value="SSCI">SSCI</option>
                                        <option value="SCIE">SCIE</option>
                                        <option value="SCOPUS">SCOPUS</option>
                                        <option value="KCI">KCI</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">권 (Volume)</label>
                                    <input type="text" id="volume"
                                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="예: 25">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">호 (Issue)</label>
                                    <input type="text" id="issue"
                                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="예: 3">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 게재 정보 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-bold mb-4">게재 정보</h4>
                        <div class="space-y-4">
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">게재 연도 *</label>
                                    <input type="number" id="publishYear" required
                                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="예: 2025" min="2000" max="2030">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">시작 페이지</label>
                                    <input type="number" id="startPage"
                                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="예: 123">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">끝 페이지</label>
                                    <input type="number" id="endPage"
                                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="예: 145">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">DOI</label>
                                <input type="text" id="doi"
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="예: 10.1234/example.2025.001">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">URL</label>
                                <input type="url" id="url"
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="https://">
                            </div>
                        </div>
                    </div>

                    <!-- 초록 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-bold mb-4">초록</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">한글 초록</label>
                                <textarea id="abstractKo" rows="4"
                                          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="한글 초록을 입력하세요"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">영문 초록</label>
                                <textarea id="abstractEn" rows="4"
                                          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="영문 초록을 입력하세요"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- 키워드 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-bold mb-4">키워드</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">한글 키워드</label>
                                <input type="text" id="keywordsKo"
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="쉼표(,)로 구분하여 입력">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">영문 키워드</label>
                                <input type="text" id="keywordsEn"
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="쉼표(,)로 구분하여 입력">
                            </div>
                        </div>
                    </div>

                    <!-- 파일 첨부 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-bold mb-4">파일 첨부</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">논문 파일 (PDF) *</label>
                                <input type="file" id="paperFile" required
                                       accept=".pdf"
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <p class="text-xs text-gray-500 mt-1">PDF 파일만 업로드 가능 (최대 50MB)</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">증빙 자료 (선택)</label>
                                <input type="file" id="proofFile"
                                       accept=".pdf,.jpg,.jpeg,.png"
                                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <p class="text-xs text-gray-500 mt-1">게재 확인서 등 (PDF, 이미지 파일, 최대 10MB)</p>
                            </div>
                        </div>
                    </div>

                    <!-- 제출 버튼 -->
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="closeJournalModal()"
                                class="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            취소
                        </button>
                        <button type="submit"
                                class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            제출하기
                        </button>
                    </div>

                    <!-- 안내 -->
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 0.75rem; border-radius: 0.375rem;">
                        <p style="font-weight: 600; color: #92400E; font-size: 0.875rem; margin-bottom: 0.5rem;">주의사항</p>
                        <ul style="font-size: 0.75rem; color: #92400E; padding-left: 1rem; margin: 0;">
                            <li>제출 후에는 수정이 불가합니다</li>
                            <li>모든 정보를 정확히 입력해주세요</li>
                            <li>PDF 파일은 최대 50MB까지 업로드 가능합니다</li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;

    document.getElementById('modal-container').innerHTML = modalContent;
}

function closeJournalModal() {
    document.getElementById('modal-container').innerHTML = '';
}

function submitJournal(e) {
    e.preventDefault();

    // 폼 데이터 수집
    const formData = {
        paperTitle: document.getElementById('paperTitle').value,
        paperTitleEn: document.getElementById('paperTitleEn').value,
        firstAuthor: document.getElementById('firstAuthor').value,
        correspondingAuthor: document.getElementById('correspondingAuthor').value,
        coAuthors: document.getElementById('coAuthors').value,
        journalName: document.getElementById('journalName').value,
        journalGrade: document.getElementById('journalGrade').value,
        volume: document.getElementById('volume').value,
        issue: document.getElementById('issue').value,
        publishYear: document.getElementById('publishYear').value,
        startPage: document.getElementById('startPage').value,
        endPage: document.getElementById('endPage').value,
        doi: document.getElementById('doi').value,
        url: document.getElementById('url').value,
        abstractKo: document.getElementById('abstractKo').value,
        abstractEn: document.getElementById('abstractEn').value,
        keywordsKo: document.getElementById('keywordsKo').value,
        keywordsEn: document.getElementById('keywordsEn').value,
        paperFile: document.getElementById('paperFile').files[0],
        proofFile: document.getElementById('proofFile').files[0]
    };

    // 유효성 검사
    if (!formData.paperTitle || !formData.firstAuthor || !formData.correspondingAuthor ||
        !formData.journalName || !formData.journalGrade || !formData.publishYear) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    if (!formData.paperFile) {
        alert('논문 파일을 첨부해주세요.');
        return;
    }

    // 실제로는 서버로 전송
    console.log('학술지 대체 심사 실적 제출:', formData);

    alert('학술지 대체 심사 실적이 제출되었습니다.\n관리자의 승인을 기다려주세요.');

    closeJournalModal();
    renderJournalSubmissionList();
}

// Export functions
window.initJournalSubmission = initJournalSubmission;
window.showJournalSubmissionModal = showJournalSubmissionModal;
window.closeJournalModal = closeJournalModal;
window.submitJournal = submitJournal;

console.log('✅ 학술지 대체 심사 신청 모듈 로드 완료');
