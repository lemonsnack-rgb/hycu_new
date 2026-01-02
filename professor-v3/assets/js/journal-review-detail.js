/**
 * 학술지 대체심사 상세보기 - 위원/위원장 화면 분리
 * 관리자 화면(admin_thesis_review.js) 참고하여 구현
 */

console.log('🔄 journal-review-detail.js 로드 시작...');

// 평가 항목별 설명
function getItemDescription(itemName) {
    const descriptions = {
        '연구 주제의 독창성': '연구 주제의 새로움과 독창성 평가',
        '연구 방법의 적절성': '연구 방법론의 적절성과 타당성',
        '연구 결과의 타당성': '연구 결과의 신뢰성과 타당성',
        '논문 구성의 체계성': '논문의 논리적 구성과 체계성',
        '학문적 기여도': '해당 분야에 대한 학문적 기여'
    };
    return descriptions[itemName] || '';
}

// 평균 점수 계산
function calculateAverageScore(reviewers) {
    const validScores = reviewers.filter(r => r.score !== null && r.score !== undefined);
    if (validScores.length === 0) return 0;

    const sum = validScores.reduce((acc, r) => acc + r.score, 0);
    return (sum / validScores.length).toFixed(1);
}

/**
 * 학술지 심사 상세 화면
 * @param {number} journalId - 학술지 ID
 * @param {string} viewType - 'member' 또는 'chair'
 */
function viewJournalReviewDetail(journalId, viewType) {
    console.log('viewJournalReviewDetail called with journalId:', journalId, 'viewType:', viewType);

    // getJournalReviews가 정의되어 있는지 확인
    if (typeof getJournalReviews !== 'function') {
        console.error('getJournalReviews is not defined');
        alert('데이터를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
        return;
    }

    const allJournals = getJournalReviews();
    const journal = allJournals.find(j => j.id === journalId);

    if (!journal) {
        alert('학술지 정보를 찾을 수 없습니다. (ID: ' + journalId + ')');
        return;
    }

    const roleText = viewType === 'chair' ? '위원장' : '위원';

    // 논문 정보 섹션 (학생 정보 + 논문 정보 + 첨부파일 + 심사위원회)
    let content = `
        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow-md">
                <!-- 학생 정보 -->
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
                            <span class="text-gray-900 font-medium">${journal.major}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                            <span class="text-gray-900 font-medium">${journal.major}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                            <span class="text-gray-900 font-medium">${journal.degree}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                            <span class="text-gray-900 font-medium">재학</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학번:</span>
                            <span class="text-gray-900 font-medium">${journal.studentId}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">성명:</span>
                            <span class="text-gray-900 font-medium">${journal.studentName}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                            <span class="text-gray-900 font-medium">${journal.advisor || '-'}</span>
                        </div>
                    </div>
                </div>

                <!-- 논문 정보 -->
                <div class="px-6 py-4 bg-white">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">논문 정보</h4>
                    <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                        <div class="col-span-3 flex gap-2 items-center">
                            <span class="text-gray-600 min-w-[80px]">논문 제목:</span>
                            <span class="text-gray-900 font-medium flex-1">${journal.paperTitle}</span>
                            <button onclick="window.open('${journal.pdfUrl || '#'}', '_blank')"
                                    class="bg-[#6A0028] text-white px-3 py-1 rounded text-sm hover:bg-[#8A0034] whitespace-nowrap">
                                논문 다운로드
                            </button>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">제출일:</span>
                            <span class="text-gray-900 font-medium">${journal.submissionDate}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">심사 희망일:</span>
                            <span class="text-gray-900 font-medium">-</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">심사 단계:</span>
                            <span class="text-gray-900 font-medium">학술지 대체심사</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 위원/위원장 화면 분리
    if (viewType === 'member') {
        // 위원 화면: 평가표 입력
        content += `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">평가표</h3>

                <!-- 데스크톱 테이블 -->
                <div class="evaluation-table-desktop hidden md:block">
                    <div class="table-scroll">
                        <table class="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="border border-gray-300 px-2 py-1.5 text-center text-sm" style="width: 60px;">순번</th>
                                    <th class="border border-gray-300 px-2 py-1.5 text-center text-sm" style="min-width: 150px;">평가 항목</th>
                                    <th class="border border-gray-300 px-2 py-1.5 text-center text-sm" style="min-width: 200px;">평가 기준</th>
                                    <th class="border border-gray-300 px-2 py-1.5 text-center text-sm" style="width: 80px;">배점</th>
                                    <th class="border border-gray-300 px-2 py-1.5 text-center text-sm" style="width: 100px;">점수</th>
                                    <th class="border border-gray-300 px-2 py-1.5 text-center text-sm" style="min-width: 250px;">평가 의견</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${journal.rubric.items.map((item, index) => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="border border-gray-300 px-2 py-1.5 text-center text-gray-700 text-sm">${index + 1}</td>
                                        <td class="border border-gray-300 px-2 py-1.5 font-medium text-gray-900 text-sm">${item.name}</td>
                                        <td class="border border-gray-300 px-2 py-1.5 text-xs text-gray-600">${getItemDescription(item.name)}</td>
                                        <td class="border border-gray-300 px-2 py-1.5 text-center">
                                            <span class="font-bold text-[#6A0028] text-sm">${item.maxScore}</span>
                                        </td>
                                        <td class="border border-gray-300 px-2 py-1">
                                            <input type="number"
                                                   class="score-input w-full border border-gray-300 rounded px-1.5 py-0.5 text-right text-sm"
                                                   min="0"
                                                   max="${item.maxScore}"
                                                   step="0.5"
                                                   value="0"
                                                   placeholder="0"
                                                   data-item-id="${item.id}"
                                                   data-max="${item.maxScore}">
                                        </td>
                                        <td class="border border-gray-300 px-2 py-1">
                                            <textarea class="score-comment w-full border border-gray-300 rounded px-1.5 py-1 text-xs resize-y min-h-[32px]"
                                                      rows="1"
                                                      placeholder="의견 작성"
                                                      data-item-id="${item.id}"></textarea>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr class="bg-gray-50">
                                    <td colspan="3" class="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-800 text-sm">총점</td>
                                    <td class="border border-gray-300 px-2 py-1.5 text-center">
                                        <span class="font-bold text-[#6A0028] text-sm">100</span>
                                    </td>
                                    <td class="border border-gray-300 px-2 py-1.5 text-center">
                                        <span id="journal-total-score" class="font-bold text-gray-400 text-sm">0</span>
                                    </td>
                                    <td class="border border-gray-300 px-2 py-1.5"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <!-- 모바일 카드 -->
                <div class="evaluation-cards-mobile md:hidden space-y-4">
                    ${journal.rubric.items.map((item, index) => `
                        <div class="border-2 border-gray-300 rounded-lg p-4 bg-white" data-item-id="${item.id}">
                            <div class="mb-3 pb-3 border-b border-gray-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold text-gray-900 text-base">
                                        ${index + 1}. ${item.name}
                                    </h4>
                                    <span class="ml-2 px-2 py-1 bg-[#FCE4EC] text-[#6A0028] rounded text-sm font-bold whitespace-nowrap">
                                        배점: ${item.maxScore}점
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600 leading-relaxed">${getItemDescription(item.name)}</p>
                            </div>

                            <div class="space-y-3">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1">점수 입력:</label>
                                    <input type="number"
                                           class="score-input w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-right text-lg"
                                           style="min-height: 44px;"
                                           min="0"
                                           max="${item.maxScore}"
                                           step="0.5"
                                           value="0"
                                           placeholder="0 ~ ${item.maxScore}점"
                                           data-item-id="${item.id}"
                                           data-max="${item.maxScore}">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1">평가 의견:</label>
                                    <textarea class="score-comment w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm"
                                              style="min-height: 80px;"
                                              rows="3"
                                              placeholder="해당 항목에 대한 의견을 작성해주세요"
                                              data-item-id="${item.id}"></textarea>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- 종합 의견 -->
                <div class="mt-6">
                    <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                    <textarea id="journal-evaluation-comment" class="w-full border border-gray-300 rounded-lg p-3 text-sm"
                              rows="4"
                              placeholder="평가에 대한 종합 의견을 작성해주세요"></textarea>
                </div>

                <!-- 버튼 -->
                <div class="mt-6 flex justify-end gap-3">
                    <button id="save-draft-btn" class="btn btn-secondary" onclick="saveJournalDraft(${journalId})">
                        임시저장
                    </button>
                    <button id="submit-evaluation-btn" class="btn btn-primary" onclick="submitJournalEvaluation(${journalId})">
                        최종 제출
                    </button>
                </div>
            </div>
        `;
    } else {
        // 위원장 화면: 승인/보류/반려
        content += `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">심사위원 평가 현황</h3>
        `;

        // 평가표 테이블
        if (journal.rubric && journal.rubric.items) {
            const allSubmitted = journal.reviewers && journal.reviewers.every(r => r.score !== null && r.score !== undefined);

            content += `
                <div class="table-scroll mb-6">
                    <table class="min-w-full border-collapse">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300" style="text-align: center; width: 60px;">
                                    No.
                                </th>
                                <th class="border border-gray-300" style="text-align: left;">
                                    평가 항목
                                </th>
                                <th class="border border-gray-300" style="text-align: center; width: 80px;">
                                    배점
                                </th>
            `;

            // 테이블 헤더: 심사위원 이름
            if (journal.reviewers) {
                journal.reviewers.forEach(reviewer => {
                    const isChair = reviewer.role === '주심';
                    const badgeClass = isChair ? 'bg-[#FCE4EC] text-[#6A0028]' : 'bg-gray-100 text-gray-600';
                    const roleText = isChair ? '위원장' : '위원';

                    content += `
                                <th class="border border-gray-300">
                                    <div class="flex items-center justify-center gap-2">
                                        <span>${reviewer.professorName}</span>
                                        <span class="px-2 py-1 rounded-full ${badgeClass}" style="font-size: 12px;">${roleText}</span>
                                    </div>
                                </th>
                    `;
                });
            }

            content += `
                            </tr>
                        </thead>
                        <tbody>
            `;

            // 테이블 본문: 각 평가 항목별 점수
            journal.rubric.items.forEach((item, index) => {
                content += `
                            <tr class="hover:bg-gray-50">
                                <td class="border border-gray-300 text-gray-700">
                                    ${index + 1}
                                </td>
                                <td class="border border-gray-300" style="text-align: left;">
                                    ${item.name}
                                </td>
                                <td class="border border-gray-300 text-gray-700">
                                    ${item.maxScore}
                                </td>
                `;

                // 각 심사위원별 점수
                if (journal.reviewers) {
                    journal.reviewers.forEach(reviewer => {
                        if (reviewer.score !== null && reviewer.score !== undefined && reviewer.itemScores) {
                            const itemScore = reviewer.itemScores[item.id] || 0;
                            content += `
                                <td class="border border-gray-300 font-medium text-gray-900">
                                    ${itemScore.toFixed(1)}
                                </td>
                            `;
                        } else {
                            content += `
                                <td class="border border-gray-300 text-gray-500">
                                    대기
                                </td>
                            `;
                        }
                    });
                }

                content += `
                            </tr>
                `;
            });

            // 총점 행
            content += `
                            <tr class="bg-gray-100 font-semibold">
                                <td class="border border-gray-300 text-gray-900" colspan="3" style="text-align: left;">
                                    총점
                                </td>
            `;

            if (journal.reviewers) {
                journal.reviewers.forEach(reviewer => {
                    if (reviewer.score !== null && reviewer.score !== undefined) {
                        content += `
                                <td class="border border-gray-300">
                                    <div class="font-bold text-[#6A0028]">${reviewer.score.toFixed(1)}</div>
                                </td>
                        `;
                    } else {
                        content += `
                                <td class="border border-gray-300 text-gray-500">
                                    대기
                                </td>
                        `;
                    }
                });
            }

            content += `
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;

            // 종합 의견 영역
            content += `
                <div class="space-y-3 mb-6">
                    <h4 class="text-md font-semibold text-gray-800">종합 의견</h4>
            `;

            if (journal.reviewers) {
                journal.reviewers.forEach(reviewer => {
                    const roleText = reviewer.role === '주심' ? '위원장' : '위원';

                    if (reviewer.comment) {
                        content += `
                            <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                                <p class="text-sm font-semibold text-gray-700 mb-2">
                                    ${reviewer.professorName} (${roleText})
                                </p>
                                <p class="text-sm text-gray-700">${reviewer.comment}</p>
                            </div>
                        `;
                    } else if (reviewer.score === null || reviewer.score === undefined) {
                        content += `
                            <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                                <p class="text-sm font-semibold text-gray-700 mb-2">
                                    ${reviewer.professorName} (${roleText})
                                </p>
                                <p class="text-sm text-gray-500">평가 대기 중입니다.</p>
                            </div>
                        `;
                    }
                });
            }

            content += `</div>`;

            // 평균 점수 및 시스템 판정
            if (allSubmitted) {
                const avgScore = calculateAverageScore(journal.reviewers);
                const passedCount = journal.reviewers.filter(r => r.score >= 60).length;
                const allPassed = passedCount === journal.reviewers.length;
                const systemDecision = allPassed ? '통과' : '불통과';

                content += `
                    <div class="bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4 mb-6">
                        <div class="flex justify-between items-center mb-3">
                            <p class="font-bold text-[#4A001C]">전체 평균 점수</p>
                            <p class="text-2xl font-bold text-[#6A0028]">${avgScore}점</p>
                        </div>
                        <div class="flex justify-between items-center pt-3 border-t border-[#F8BBD9]">
                            <p class="font-bold text-[#4A001C]">시스템 판정 결과</p>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-600">(${passedCount}/${journal.reviewers.length}명 통과)</span>
                                <span class="inline-block px-4 py-2 rounded-lg font-bold ${
                                    systemDecision === '통과'
                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                        : 'bg-red-100 text-red-700 border border-red-300'
                                }">
                                    ${systemDecision === '통과' ? '✓ 통과' : '✗ 불통과'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                const submittedCount = journal.reviewers ? journal.reviewers.filter(r => r.score !== null && r.score !== undefined).length : 0;
                const totalCount = journal.reviewers ? journal.reviewers.length : 0;

                content += `
                    <div class="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
                        <div class="flex justify-between items-center mb-3">
                            <p class="font-bold text-gray-700">전체 평균 점수</p>
                            <p class="text-2xl font-bold text-gray-500">-</p>
                        </div>
                        <div class="flex justify-between items-center pt-3 border-t border-gray-300">
                            <p class="font-bold text-gray-700">시스템 판정 결과</p>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-600">(${submittedCount}/${totalCount}명 평가 완료)</span>
                                <span class="inline-block px-4 py-2 rounded-lg font-bold bg-gray-100 text-gray-500 border border-gray-300">
                                    평가 대기
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            content += `
                <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <p class="text-yellow-800">심사위원회 정보가 없습니다.</p>
                </div>
            `;
        }

        // 최종 승인 영역 - 항상 표시 (평가 미완료 시 또는 제출 후 비활성화)
        const allSubmitted = journal.reviewers && journal.reviewers.every(r => r.score !== null && r.score !== undefined);
        const chairSubmitted = journal.chairDecision && journal.chairDecision.decision;
        const isDisabled = !allSubmitted || chairSubmitted;
        const disabledAttr = isDisabled ? 'disabled' : '';

        // 제출된 결정이 있으면 해당 값 사용
        const chairDecision = chairSubmitted ? journal.chairDecision.decision : '';
        const chairComment = chairSubmitted ? journal.chairDecision.comment || '' : '';

        // 결정 버튼 스타일 - 제출 후에도 선택된 항목이 명확히 보이도록 색상 강조
        const approveSelected = chairDecision === 'approve' ? 'border-2 border-green-600 bg-green-100' : 'border border-gray-300 bg-white';
        const holdSelected = chairDecision === 'hold' ? 'border-2 border-yellow-600 bg-yellow-100' : 'border border-gray-300 bg-white';
        const rejectSelected = chairDecision === 'reject' ? 'border-2 border-red-600 bg-red-100' : 'border border-gray-300 bg-white';

        // 선택된 버튼의 텍스트 색상
        const approveTextColor = chairDecision === 'approve' ? 'text-green-700' : 'text-gray-700';
        const holdTextColor = chairDecision === 'hold' ? 'text-yellow-700' : 'text-gray-700';
        const rejectTextColor = chairDecision === 'reject' ? 'text-red-700' : 'text-gray-700';

        // 비활성화 시 opacity는 제출 버튼에만 적용
        const buttonDisabledClass = chairSubmitted ? 'cursor-not-allowed' : isDisabled ? 'opacity-50 cursor-not-allowed' : '';
        const submitBtnDisabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

        content += `
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-6">
                    <h4 class="font-bold text-gray-800 mb-4">최종 심사 결정</h4>

                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">결정 선택 *</label>
                        <div class="flex gap-3">
                            <button id="decision-approve"
                                    onclick="selectJournalDecision('approve')" ${disabledAttr}
                                    class="flex-1 py-2 rounded ${approveSelected} ${!chairSubmitted ? 'hover:border-green-500 hover:bg-green-50' : ''} transition-colors ${buttonDisabledClass}">
                                <span class="text-sm font-medium ${approveTextColor}">✓ 승인</span>
                            </button>
                            <button id="decision-hold"
                                    onclick="selectJournalDecision('hold')" ${disabledAttr}
                                    class="flex-1 py-2 rounded ${holdSelected} ${!chairSubmitted ? 'hover:border-yellow-500 hover:bg-yellow-50' : ''} transition-colors ${buttonDisabledClass}">
                                <span class="text-sm font-medium ${holdTextColor}">⊙ 보류</span>
                            </button>
                            <button id="decision-reject"
                                    onclick="selectJournalDecision('reject')" ${disabledAttr}
                                    class="flex-1 py-2 rounded ${rejectSelected} ${!chairSubmitted ? 'hover:border-red-500 hover:bg-red-50' : ''} transition-colors ${buttonDisabledClass}">
                                <span class="text-sm font-medium ${rejectTextColor}">✗ 반려</span>
                            </button>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">최종 의견</label>
                        <textarea id="journal-chair-comment" rows="4" ${disabledAttr}
                                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm ${chairSubmitted ? 'bg-white text-gray-900' : isDisabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}"
                                  placeholder="${!allSubmitted ? '모든 심사위원의 평가가 완료되면 입력할 수 있습니다' : chairSubmitted ? '' : '최종 심사 의견을 입력하세요'}">${chairComment}</textarea>
                    </div>

                    <div class="flex justify-end">
                        <button onclick="submitJournalChairDecision(${journalId})" ${disabledAttr}
                                class="btn btn-primary ${submitBtnDisabledClass}">
                            최종 결정 제출
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    content += `</div>`;

    // 모달 대신 페이지 전환 방식으로 변경
    const container = document.getElementById('journal-review-content');
    if (container) {
        // 뒤로가기 버튼 추가
        const backButton = `
            <div class="mb-6">
                <button onclick="initJournalReview()" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
            </div>
        `;

        container.innerHTML = backButton + content;

        // 위원 화면인 경우 점수 입력 이벤트 바인딩
        if (viewType === 'member') {
            console.log('🎯 Binding score input events...');
            const scoreInputs = document.querySelectorAll('.score-input');
            console.log('🎯 Found score inputs:', scoreInputs.length);

            scoreInputs.forEach((input, index) => {
                console.log(`🎯 Binding events for input ${index}:`, input.dataset.max);

                input.addEventListener('input', function() {
                    console.log('🎯 Input event fired, value:', this.value, 'max:', this.dataset.max);
                    validateJournalScoreInput(this, parseFloat(this.dataset.max));
                    updateJournalTotalScore();
                });

                input.addEventListener('change', function() {
                    console.log('🎯 Change event fired, value:', this.value, 'max:', this.dataset.max);
                    validateJournalScoreInput(this, parseFloat(this.dataset.max));
                    updateJournalTotalScore();
                });
            });

            // 초기 총점 계산
            console.log('🎯 Calculating initial total score...');
            updateJournalTotalScore();

            // 평가 항목별 평가 의견 textarea 자동 확장
            const scoreComments = document.querySelectorAll('.score-comment');
            scoreComments.forEach(textarea => {
                const autoResize = function() {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                };
                textarea.addEventListener('input', autoResize);
                // 초기 높이 설정
                autoResize.call(textarea);
            });

            // 종합 의견 textarea 자동 확장
            const evaluationComment = document.getElementById('journal-evaluation-comment');
            if (evaluationComment) {
                const autoResize = function() {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                };
                evaluationComment.addEventListener('input', autoResize);
                // 초기 높이 설정
                autoResize.call(evaluationComment);
            }
        }

        // 페이지 맨 위로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error('journal-review-content container not found');
        alert('화면을 표시할 수 없습니다. 페이지를 새로고침해주세요.');
    }
}

// 총점 자동 계산
// ==================== 점수 유효성 검사 ====================
function validateJournalScoreInput(input, maxScore) {
    console.log('🔍 validateJournalScoreInput called:', input.value, 'max:', maxScore);
    const value = input.value.trim();

    // 빈 값은 허용 (0으로 처리)
    if (value === '') {
        console.log('🔍 Empty value, skipping validation');
        return;
    }

    // 숫자가 아닌 경우
    if (isNaN(value)) {
        console.log('🔍 Not a number! Showing alert');
        alert('숫자만 입력 가능합니다.');
        input.value = '0';
        return;
    }

    const numValue = parseFloat(value);

    // 음수 입력
    if (numValue < 0) {
        console.log('🔍 Negative number! Showing alert');
        alert('0 이상의 점수를 입력해주세요.');
        input.value = '0';
        return;
    }

    // 배점 초과
    if (numValue > maxScore) {
        console.log('🔍 Exceeds max score! Showing alert');
        alert(`배점(${maxScore}점)을 초과할 수 없습니다.`);
        input.value = maxScore.toString();
        return;
    }

    console.log('🔍 Validation passed');
}

function updateJournalTotalScore() {
    let total = 0;
    const inputs = document.querySelectorAll('.score-input');

    inputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });

    const totalScoreEl = document.getElementById('journal-total-score');
    if (totalScoreEl) {
        totalScoreEl.textContent = total.toFixed(1);
        // 점수 색상 업데이트
        if (total > 0) {
            totalScoreEl.classList.remove('text-gray-400');
            totalScoreEl.classList.add('text-[#6A0028]');
        } else {
            totalScoreEl.classList.remove('text-[#6A0028]');
            totalScoreEl.classList.add('text-gray-400');
        }
    }
}

// 평가 제출 (위원)
function submitJournalEvaluation(journalId) {
    const journal = getJournalReviews().find(j => j.id === journalId);
    if (!journal) return;

    const scores = {};
    const itemComments = {};
    let hasEmptyScore = false;

    journal.rubric.items.forEach(item => {
        const input = document.querySelector(`.score-input[data-item-id="${item.id}"]`);
        const commentTextarea = document.querySelector(`.score-comment[data-item-id="${item.id}"]`);
        const value = parseFloat(input.value);

        if (isNaN(value) || value < 0) {
            hasEmptyScore = true;
        } else {
            scores[item.id] = value;
        }

        if (commentTextarea) {
            itemComments[item.id] = commentTextarea.value.trim();
        }
    });

    if (hasEmptyScore) {
        alert('모든 평가 항목의 점수를 입력해주세요.');
        return;
    }

    const comment = document.getElementById('journal-evaluation-comment').value.trim();
    if (!comment) {
        alert('종합 의견을 작성해주세요.');
        return;
    }

    // 평가 저장
    if (typeof updateJournalEvaluation === 'function') {
        updateJournalEvaluation(journalId, scores, comment, itemComments);

        // 모달 닫기
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }

        if (typeof showToast === 'function') {
            showToast('평가가 제출되었습니다', 'success');
        } else {
            alert('평가가 제출되었습니다.');
        }

        // 목록 새로고침
        if (typeof renderJournalReviewList === 'function') {
            renderJournalReviewList();
        }
    }
}

// 임시 저장 (위원)
function saveJournalDraft(journalId) {
    if (typeof showToast === 'function') {
        showToast('임시 저장되었습니다', 'success');
    } else {
        alert('임시 저장되었습니다.');
    }
}

// 최종 결정 선택 (위원장)
let journalSelectedDecision = null;

function selectJournalDecision(decision) {
    journalSelectedDecision = decision;

    // 모든 버튼 초기화
    ['approve', 'hold', 'reject'].forEach(d => {
        const btn = document.getElementById(`decision-${d}`);
        if (btn) {
            btn.className = 'flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors';
        }
    });

    // 선택된 버튼 강조
    const selectedBtn = document.getElementById(`decision-${decision}`);
    if (selectedBtn) {
        const colorMap = {
            'approve': 'border-green-500 bg-green-50',
            'hold': 'border-yellow-500 bg-yellow-50',
            'reject': 'border-red-500 bg-red-50'
        };
        selectedBtn.className = `flex-1 py-3 rounded-lg border-2 ${colorMap[decision]} transition-colors`;
    }
}

// 최종 결정 제출 (위원장)
function submitJournalChairDecision(journalId) {
    if (!journalSelectedDecision) {
        alert('결정을 선택해주세요.');
        return;
    }

    const comment = document.getElementById('journal-chair-comment').value.trim();

    const decisionText = {
        'approve': '승인',
        'hold': '보류',
        'reject': '반려'
    };

    // 제출 확인 (수정 불가 경고 포함)
    const confirmMsg = `최종 심사 결정을 제출하시겠습니까?\n\n결정 내용: ${decisionText[journalSelectedDecision]}\n\n※ 제출 후에는 수정이 불가능합니다.`;
    if (!confirm(confirmMsg)) {
        return;
    }

    // 데이터 저장
    const journal = getJournalReviews().find(j => j.id === journalId);
    if (journal) {
        journal.chairDecision = {
            decision: journalSelectedDecision,  // 영어 값으로 저장 (approve/hold/reject)
            comment: comment
        };
        journal.status = '심사완료';

        console.log('✅ 위원장 최종 결정 저장:', {
            journalId,
            decision: journalSelectedDecision,
            comment
        });
    }

    // 모달 닫기
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.remove();
    }

    if (typeof showToast === 'function') {
        showToast(`최종 결정(${decisionText[journalSelectedDecision]})이 제출되었습니다`, 'success');
    } else {
        alert(`최종 결정(${decisionText[journalSelectedDecision]})이 제출되었습니다.`);
    }

    // 목록 새로고침
    if (typeof renderJournalReviewList === 'function') {
        renderJournalReviewList();
    }
}

// 전역으로 노출
try {
    window.viewJournalReviewDetail = viewJournalReviewDetail;
    window.updateJournalTotalScore = updateJournalTotalScore;
    window.submitJournalEvaluation = submitJournalEvaluation;
    window.saveJournalDraft = saveJournalDraft;
    window.selectJournalDecision = selectJournalDecision;
    window.submitJournalChairDecision = submitJournalChairDecision;

    console.log('✅ 학술지 상세보기 (위원/위원장 분리) 로드 완료');
    console.log('   - viewJournalReviewDetail:', typeof window.viewJournalReviewDetail);
    console.log('   - updateJournalTotalScore:', typeof window.updateJournalTotalScore);
    console.log('   - submitJournalEvaluation:', typeof window.submitJournalEvaluation);
} catch (error) {
    console.error('❌ journal-review-detail.js 로드 중 에러:', error);
}
