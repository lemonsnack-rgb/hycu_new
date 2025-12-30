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

    // 논문 정보 섹션 (관리자 화면과 동일)
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
                <div class="px-6 py-4 border-b bg-white">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">논문 정보</h4>
                    <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                        <div class="col-span-3 flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">논문 제목:</span>
                            <span class="text-gray-900 font-medium">${journal.paperTitle}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">제출일:</span>
                            <span class="text-gray-900 font-medium">${journal.submissionDate}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">심사 마감일:</span>
                            <span class="text-gray-900 font-medium">-</span>
                        </div>
                        <div class="col-span-3 flex gap-2">
                            <span class="text-gray-600 min-w-[80px]">학술지명:</span>
                            <span class="text-gray-900 font-medium">${journal.journalName}</span>
                        </div>
                    </div>
                </div>

                <div class="p-6">

                    ${journal.reviewers && journal.reviewers.length > 0 ? `
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-300">
                            <div class="space-y-2">
                                ${journal.reviewers.map(reviewer => `
                                    <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300">
                                        <div>
                                            <p class="font-medium">${reviewer.professorName}</p>
                                            <p class="text-sm text-gray-600">${reviewer.department || '-'} / ${reviewer.role === '주심' ? '심사위원장' : '심사위원'}</p>
                                        </div>
                                        <div>
                                            <span class="text-sm">
                                                ${reviewer.status || '평가 대기'}
                                            </span>
                                            ${reviewer.score !== null && reviewer.score !== undefined ? `
                                                <span class="ml-2 text-sm font-semibold text-gray-700">${reviewer.score}점</span>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
    `;

    // 위원/위원장 화면 분리
    if (viewType === 'member') {
        // 위원 화면: 평가표 입력
        content += `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">평가표</h3>

                <div class="bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4 mb-6">
                    <h4 class="font-bold text-[#4A001C] mb-3 flex items-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        평가 기준 안내
                    </h4>
                    <p class="text-sm text-[#4A001C]">
                        <strong>안내:</strong> 각 항목별로 점수를 입력해주세요. 입력하신 점수가 합산되어 총점이 계산됩니다.
                    </p>
                </div>

                <div class="space-y-4" id="evaluation-categories">
                    ${journal.rubric.items.map((item, index) => `
                        <div style="margin-bottom: 1.5rem; padding: 1rem; background: white; border: 2px solid #d1d5db; border-radius: 0.5rem;" data-item-id="${item.id}">
                            <div style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-bottom: 0.75rem;">
                                <div style="flex: 1 1 0%;">
                                    <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem;">
                                        ${index + 1}. ${item.name}
                                    </h4>
                                    <p style="font-size: 0.875rem; color: #4b5563;">${getItemDescription(item.name)}</p>
                                </div>
                                <div style="text-align: right; margin-left: 1rem; flex-shrink: 0;">
                                    <span style="font-size: 1.5rem; font-weight: 700; color: #6A0028;">${item.maxScore}</span>
                                    <span style="font-size: 0.875rem; color: #4b5563;">점</span>
                                </div>
                            </div>

                            <div>
                                <label class="text-sm font-medium text-gray-700 block mb-1">점수 입력:</label>
                                <input type="number"
                                       class="score-input w-full border border-gray-300 rounded-lg p-2"
                                       min="0"
                                       max="${item.maxScore}"
                                       step="0.5"
                                       value="0"
                                       placeholder="0 ~ ${item.maxScore}점"
                                       data-item-id="${item.id}"
                                       data-max="${item.maxScore}"
                                       onchange="updateJournalTotalScore()">

                                <label class="text-sm font-medium text-gray-700 block mt-3 mb-1">평가 의견:</label>
                                <textarea class="score-comment w-full border border-gray-300 rounded-lg p-2 text-sm"
                                          rows="2"
                                          placeholder="해당 항목에 대한 의견을 작성해주세요"
                                          data-item-id="${item.id}"></textarea>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- 총점 표시 -->
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 my-6 border-2 border-[#F8BBD9]">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-bold text-gray-800">총점</span>
                        <span class="text-3xl font-bold text-[#6A0028]" id="journal-total-score">0.0 / 100점</span>
                    </div>
                </div>

                <!-- 종합 의견 -->
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">종합 의견 *</label>
                    <textarea id="journal-evaluation-comment" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows="5"
                              placeholder="평가에 대한 종합 의견을 입력하세요"></textarea>
                </div>

                <!-- PDF 다운로드 -->
                ${journal.pdfUrl ? `
                    <div class="bg-[#FCE4EC] border border-[#F8BBD9] rounded-lg p-4 mb-6">
                        <h4 class="font-bold text-[#6A0028] mb-2">첨부 파일</h4>
                        <a href="${journal.pdfUrl}" target="_blank"
                           class="text-[#6A0028] hover:underline flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            논문 PDF 다운로드
                        </a>
                    </div>
                ` : ''}

                <!-- 제출 버튼 -->
                <div class="flex gap-3">
                    <button onclick="saveJournalDraft(${journalId})"
                            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                        임시 저장
                    </button>
                    <button onclick="submitJournalEvaluation(${journalId})"
                            class="flex-1 bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        평가 제출
                    </button>
                </div>
            </div>
        `;
    } else {
        // 위원장 화면: 승인/보류/반려
        content += `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">📊 심사위원 평가 현황</h3>

                <!-- 모든 위원 평가 요약 -->
                ${journal.reviewers && journal.reviewers.length > 0 ? `
                    <div class="space-y-4 mb-6">
                        ${journal.reviewers.map(reviewer => `
                            <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <p class="font-semibold text-gray-800">${reviewer.professorName}</p>
                                        <p class="text-sm text-gray-600">${reviewer.department || '-'} / ${reviewer.role === '주심' ? '심사위원장' : '심사위원'}</p>
                                    </div>
                                    <div class="text-right">
                                        ${reviewer.score !== undefined && reviewer.score !== null ? `
                                            <p class="text-lg font-bold text-[#6A0028]">${reviewer.score}점</p>
                                            <p class="text-xs text-gray-500">총점</p>
                                        ` : `
                                            <span class="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">평가 대기</span>
                                        `}
                                    </div>
                                </div>
                                ${reviewer.comment ? `
                                    <div class="mt-3 p-3 bg-white rounded border border-gray-200">
                                        <p class="text-xs font-semibold text-gray-600 mb-1">종합 의견:</p>
                                        <p class="text-sm text-gray-700">${reviewer.comment}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <!-- 평균 점수 -->
                    <div class="bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4 mb-6">
                        <div class="flex justify-between items-center">
                            <p class="font-bold text-[#4A001C]">전체 평균 점수</p>
                            <p class="text-2xl font-bold text-[#6A0028]">
                                ${calculateAverageScore(journal.reviewers)}점
                            </p>
                        </div>
                    </div>
                ` : `
                    <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                        <p class="text-yellow-800">심사위원회 정보가 없습니다.</p>
                    </div>
                `}

                <!-- 최종 승인 영역 -->
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-6">
                    <h4 class="font-bold text-gray-800 mb-4">최종 심사 결정</h4>

                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">결정 선택 *</label>
                        <div class="flex gap-3">
                            <button id="decision-approve"
                                    onclick="selectJournalDecision('approve')"
                                    class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">✓ 승인</span>
                            </button>
                            <button id="decision-hold"
                                    onclick="selectJournalDecision('hold')"
                                    class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">⊙ 보류</span>
                            </button>
                            <button id="decision-reject"
                                    onclick="selectJournalDecision('reject')"
                                    class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">✗ 반려</span>
                            </button>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">최종 의견</label>
                        <textarea id="journal-chair-comment"
                                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows="4"
                                  placeholder="최종 심사 의견을 입력하세요"></textarea>
                    </div>

                    <button onclick="submitJournalChairDecision(${journalId})"
                            class="w-full bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        최종 결정 제출
                    </button>
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

        container.innerHTML = backButton + `
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${roleText} 평가 - 학술지 대체심사</h2>
                <p class="text-sm text-gray-600">학생: ${journal.studentName} (${journal.studentId})</p>
            </div>
        ` + content;

        // 페이지 맨 위로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error('journal-review-content container not found');
        alert('화면을 표시할 수 없습니다. 페이지를 새로고침해주세요.');
    }
}

// 총점 자동 계산
function updateJournalTotalScore() {
    let total = 0;
    let maxTotal = 0;
    const inputs = document.querySelectorAll('.score-input');

    inputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        const max = parseFloat(input.dataset.max) || 0;
        total += value;
        maxTotal += max;
    });

    const totalScoreEl = document.getElementById('journal-total-score');
    if (totalScoreEl) {
        totalScoreEl.textContent = `${total.toFixed(1)} / ${maxTotal}점`;
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

    console.log('위원장 최종 결정:', {
        journalId,
        decision: decisionText[journalSelectedDecision],
        comment
    });

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
