/**
 * 학술지 대체심사 상세보기
 */

function viewJournalReviewDetail(journalId) {
    console.log('viewJournalReviewDetail called with journalId:', journalId);

    // getJournalReviews가 정의되어 있는지 확인
    if (typeof getJournalReviews !== 'function') {
        console.error('getJournalReviews is not defined');
        alert('데이터를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
        return;
    }

    const allJournals = getJournalReviews();
    console.log('All journals:', allJournals);

    const journal = allJournals.find(j => j.id === journalId);
    console.log('Found journal:', journal);

    if (!journal) {
        alert('학술지 정보를 찾을 수 없습니다. (ID: ' + journalId + ')');
        return;
    }

    // rubric 확인
    if (!journal.rubric || !journal.rubric.items) {
        alert('평가 기준 정보가 없습니다.');
        return;
    }

    // 평가 완료 여부 확인
    if (journal.evaluation) {
        showCompletedEvaluation(journal);
        return;
    }

    // 평가 폼 표시
    showEvaluationForm(journal);
}

function showEvaluationForm(journal) {
    const content = `
        <div class="space-y-6">
            <!-- 학생 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">학생 정보</h4>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">학생명:</span>
                        <span class="font-medium">${journal.studentName} (${journal.studentId})</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">전공:</span>
                        <span class="font-medium">${journal.major} (${journal.degree})</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">논문 제목:</span>
                        <span class="font-medium">${journal.paperTitle}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">학술지명:</span>
                        <span class="font-medium">${journal.journalName}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">제출일:</span>
                        <span class="font-medium">${journal.submissionDate}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">심사기한:</span>
                        <span class="font-medium">${journal.dueDate}</span>
                    </div>
                </div>
            </div>

            <!-- 평가 기준 -->
            <div class="bg-white rounded-lg border border-gray-200 p-4">
                <h4 class="font-bold text-gray-800 mb-3">평가 기준</h4>
                <div class="space-y-3" id="evaluation-items">
                    ${journal.rubric.items.map(item => `
                        <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                            <label class="text-sm font-medium text-gray-700">
                                ${item.name} (${item.maxScore}점)
                            </label>
                            <input type="number"
                                   id="score-${item.id}"
                                   min="0"
                                   max="${item.maxScore}"
                                   class="w-20 border border-gray-300 rounded px-3 py-1 text-sm text-center"
                                   placeholder="0">
                        </div>
                    `).join('')}
                </div>

                <!-- 총점 표시 -->
                <div class="mt-4 pt-4 border-t-2 border-gray-300">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-lg">총점:</span>
                        <span class="font-bold text-2xl text-blue-600" id="total-score">0</span>
                        <span class="text-gray-600">/ 100</span>
                    </div>
                </div>
            </div>

            <!-- 종합 의견 -->
            <div class="bg-white rounded-lg border border-gray-200 p-4">
                <h4 class="font-bold text-gray-800 mb-3">종합 의견</h4>
                <textarea id="evaluation-comment"
                          rows="6"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="학술지 대체심사에 대한 종합 의견을 작성해주세요."></textarea>
            </div>

            <!-- PDF 파일 -->
            ${journal.pdfUrl ? `
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-bold text-blue-800 mb-2">첨부 파일</h4>
                    <a href="${journal.pdfUrl}" target="_blank"
                       class="text-blue-600 hover:underline flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        논문 PDF 다운로드
                    </a>
                </div>
            ` : ''}
        </div>
    `;

    if (typeof openModal === 'function') {
        openModal(
            `학술지 대체심사 - ${journal.studentName}`,
            content,
            '평가 제출',
            () => submitEvaluation(journalId),
            true
        );

        // 총점 자동 계산
        journal.rubric.items.forEach(item => {
            const input = document.getElementById(`score-${item.id}`);
            if (input) {
                input.addEventListener('input', updateTotalScore);
            }
        });
    }
}

function updateTotalScore() {
    let total = 0;
    const inputs = document.querySelectorAll('[id^="score-"]');
    inputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        total += value;
    });

    const totalScoreEl = document.getElementById('total-score');
    if (totalScoreEl) {
        totalScoreEl.textContent = total;
    }
}

function submitEvaluation(journalId) {
    const journal = getJournalReviews().find(j => j.id === journalId);
    if (!journal) return;

    const scores = {};
    let hasEmptyScore = false;

    journal.rubric.items.forEach(item => {
        const input = document.getElementById(`score-${item.id}`);
        const value = parseInt(input.value);

        if (isNaN(value) || value < 0) {
            hasEmptyScore = true;
        } else {
            scores[item.id] = value;
        }
    });

    if (hasEmptyScore) {
        alert('모든 평가 항목의 점수를 입력해주세요.');
        return;
    }

    const comment = document.getElementById('evaluation-comment').value.trim();
    if (!comment) {
        alert('종합 의견을 작성해주세요.');
        return;
    }

    // 평가 저장
    if (typeof updateJournalEvaluation === 'function') {
        updateJournalEvaluation(journalId, scores, comment);

        if (typeof closeModal === 'function') {
            closeModal();
        }

        alert('평가가 제출되었습니다.');

        // 목록 새로고침 (함수가 존재하는 경우)
        if (typeof renderJournalReviewList === 'function') {
            renderJournalReviewList();
        }
    }
}

function showCompletedEvaluation(journal) {
    const totalScore = Object.values(journal.evaluation.scores).reduce((sum, score) => sum + score, 0);

    const content = `
        <div class="space-y-6">
            <!-- 학생 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">학생 정보</h4>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">학생명:</span>
                        <span class="font-medium">${journal.studentName} (${journal.studentId})</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">전공:</span>
                        <span class="font-medium">${journal.major} (${journal.degree})</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">논문 제목:</span>
                        <span class="font-medium">${journal.paperTitle}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">학술지명:</span>
                        <span class="font-medium">${journal.journalName}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">제출일:</span>
                        <span class="font-medium">${journal.submissionDate}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">평가 완료일:</span>
                        <span class="font-medium text-green-600">${journal.evaluation.submittedAt}</span>
                    </div>
                </div>
            </div>

            <!-- 평가 결과 -->
            <div class="bg-white rounded-lg border border-gray-200 p-4">
                <h4 class="font-bold text-gray-800 mb-3">평가 결과</h4>
                <div class="space-y-3">
                    ${journal.rubric.items.map(item => {
                        const score = journal.evaluation.scores[item.id] || 0;
                        return `
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span class="text-sm font-medium text-gray-700">
                                    ${item.name}
                                </span>
                                <span class="font-bold text-blue-600">
                                    ${score}/${item.maxScore}점
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- 총점 표시 -->
                <div class="mt-4 pt-4 border-t-2 border-gray-300">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-lg">총점:</span>
                        <span class="font-bold text-3xl text-blue-600">${totalScore}</span>
                        <span class="text-gray-600">/ 100</span>
                    </div>
                </div>
            </div>

            <!-- 종합 의견 -->
            <div class="bg-green-50 rounded-lg border border-green-200 p-4">
                <h4 class="font-bold text-green-800 mb-3">종합 의견</h4>
                <p class="text-gray-700 leading-relaxed">${journal.evaluation.comment}</p>
            </div>

            <!-- PDF 파일 -->
            ${journal.pdfUrl ? `
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-bold text-blue-800 mb-2">첨부 파일</h4>
                    <a href="${journal.pdfUrl}" target="_blank"
                       class="text-blue-600 hover:underline flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        논문 PDF 다운로드
                    </a>
                </div>
            ` : ''}
        </div>
    `;

    if (typeof openModal === 'function') {
        openModal(
            `학술지 대체심사 결과 - ${journal.studentName}`,
            content,
            '닫기',
            null,
            true
        );
    }
}

// 전역으로 노출
window.viewJournalReviewDetail = viewJournalReviewDetail;
window.updateTotalScore = updateTotalScore;
window.submitEvaluation = submitEvaluation;

console.log('✅ 학술지 상세보기 로드 완료');
