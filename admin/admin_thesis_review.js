/**
 * 관리자 화면 - 학위논문 심사 위원/위원장 평가 화면
 * 교수 화면의 review-detail.js와 동일한 구조로 구현
 */

/**
 * 심사 상세 - 위원/위원장 평가 화면 (교수 화면과 동일한 구조)
 * @param {string} submissionId - 제출물 ID
 * @param {string} viewType - 'member' 또는 'chair'
 * @param {string} submissionType - 'plan', 'mid', 'final'
 */
function viewThesisReviewDetail(submissionId, viewType, submissionType) {
    const typeMap = {
        'plan': 'thesisPlan',
        'mid': 'midThesis',
        'final': 'finalThesis'
    };

    const dataType = typeMap[submissionType];
    const submissions = appData.submissions[dataType];
    const submission = submissions.find(s => s.id === submissionId);

    if (!submission) {
        alert('심사 정보를 찾을 수 없습니다.');
        return;
    }

    const roleText = viewType === 'chair' ? '위원장' : '위원';
    const typeText = submissionType === 'final' ? '최종논문' :
                     submissionType === 'mid' ? '중간논문' : '논문작성계획서';

    // 논문 정보 섹션 (교수 화면과 동일)
    let content = `
        <div class="space-y-6">
            <!-- 논문 정보 -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">📄 논문 정보</h3>

                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 class="font-bold text-gray-800 mb-3">기본 정보</h4>
                    <div class="space-y-3">
                        <div class="info-row">
                            <div class="info-label">학생명</div>
                            <div class="info-value">${submission.studentName} (${submission.studentId})</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">전공 / 학위과정</div>
                            <div class="info-value">${submission.major} / ${submission.degree}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">지도교수</div>
                            <div class="info-value">${submission.advisor}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">제출일</div>
                            <div class="info-value">${submission.submitDate}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">논문제목</div>
                            <div class="info-value font-medium">${submission.thesisTitle || '미정'}</div>
                        </div>
                    </div>
                </div>

                ${submission.reviewers ? `
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-300">
                        <h4 class="font-bold text-gray-800 mb-3">심사위원회</h4>
                        <div class="space-y-2">
                            ${submission.reviewers.map(reviewer => `
                                <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300">
                                    <div>
                                        <p class="font-medium">${reviewer.name}</p>
                                        <p class="text-sm text-gray-600">${reviewer.department || '-'} / ${reviewer.role === '주심' ? '심사위원장' : '심사위원'}</p>
                                    </div>
                                    <div>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reviewer.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                            ${reviewer.status || '평가 진행중'}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
    `;

    // 위원/위원장 화면 분리 (교수 화면과 동일)
    if (viewType === 'member') {
        // 위원 화면: 평가표 입력
        content += `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">평가표</h3>

                <div class="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                    <h4 class="font-bold text-blue-900 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        평가 기준 안내
                    </h4>
                    <div class="space-y-2 text-sm text-blue-900">
                        <p class="flex items-center">
                            <span class="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                            <span>각 항목 최소 <strong class="font-bold">60점 이상</strong> (과락)</span>
                        </p>
                        <p class="flex items-center">
                            <span class="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                            <span>전체 평균 <strong class="font-bold">70점 이상</strong></span>
                        </p>
                        <p class="flex items-center">
                            <span class="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                            <span>총점 <strong class="font-bold">70점 이상</strong> (100점 만점)</span>
                        </p>
                    </div>
                </div>

                <div class="space-y-4" id="evaluation-categories">
                    <!-- 평가 항목 1 -->
                    <div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">
                        <div class="grid grid-cols-[1fr_80px] gap-4 mb-4">
                            <div>
                                <h4 class="font-bold text-gray-800 mb-1">1. 연구 주제의 독창성</h4>
                                <p class="text-sm text-gray-600">연구 주제의 새로움과 독창성 평가</p>
                            </div>
                            <div class="text-right">
                                <div class="text-xs text-gray-500">가중치</div>
                                <div class="text-lg font-bold text-blue-600">20%</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">
                            <label class="text-sm font-medium text-gray-700">점수:</label>
                            <input type="number" class="score-input w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                   min="0" max="20" step="0.5" value="0">
                            <span class="text-sm text-gray-600">/ 20점</span>
                            <span></span>
                        </div>
                        <div class="grid grid-cols-[60px_1fr] gap-3 items-center">
                            <span></span>
                            <div class="text-sm text-gray-500">
                                → 가중 점수: <span class="weighted-score text-base font-bold text-blue-600">0.0점</span>
                            </div>
                        </div>
                    </div>

                    <!-- 평가 항목 2 -->
                    <div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">
                        <div class="grid grid-cols-[1fr_80px] gap-4 mb-4">
                            <div>
                                <h4 class="font-bold text-gray-800 mb-1">2. 연구 방법의 적절성</h4>
                                <p class="text-sm text-gray-600">연구 방법론의 적절성과 타당성</p>
                            </div>
                            <div class="text-right">
                                <div class="text-xs text-gray-500">가중치</div>
                                <div class="text-lg font-bold text-blue-600">20%</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">
                            <label class="text-sm font-medium text-gray-700">점수:</label>
                            <input type="number" class="score-input w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                   min="0" max="20" step="0.5" value="0">
                            <span class="text-sm text-gray-600">/ 20점</span>
                            <span></span>
                        </div>
                        <div class="grid grid-cols-[60px_1fr] gap-3 items-center">
                            <span></span>
                            <div class="text-sm text-gray-500">
                                → 가중 점수: <span class="weighted-score text-base font-bold text-blue-600">0.0점</span>
                            </div>
                        </div>
                    </div>

                    <!-- 평가 항목 3 -->
                    <div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">
                        <div class="grid grid-cols-[1fr_80px] gap-4 mb-4">
                            <div>
                                <h4 class="font-bold text-gray-800 mb-1">3. 연구 결과의 타당성</h4>
                                <p class="text-sm text-gray-600">연구 결과의 신뢰성과 타당성</p>
                            </div>
                            <div class="text-right">
                                <div class="text-xs text-gray-500">가중치</div>
                                <div class="text-lg font-bold text-blue-600">20%</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">
                            <label class="text-sm font-medium text-gray-700">점수:</label>
                            <input type="number" class="score-input w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                   min="0" max="20" step="0.5" value="0">
                            <span class="text-sm text-gray-600">/ 20점</span>
                            <span></span>
                        </div>
                        <div class="grid grid-cols-[60px_1fr] gap-3 items-center">
                            <span></span>
                            <div class="text-sm text-gray-500">
                                → 가중 점수: <span class="weighted-score text-base font-bold text-blue-600">0.0점</span>
                            </div>
                        </div>
                    </div>

                    <!-- 평가 항목 4 -->
                    <div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">
                        <div class="grid grid-cols-[1fr_80px] gap-4 mb-4">
                            <div>
                                <h4 class="font-bold text-gray-800 mb-1">4. 논문 구성의 체계성</h4>
                                <p class="text-sm text-gray-600">논문의 논리적 구성과 체계성</p>
                            </div>
                            <div class="text-right">
                                <div class="text-xs text-gray-500">가중치</div>
                                <div class="text-lg font-bold text-blue-600">20%</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">
                            <label class="text-sm font-medium text-gray-700">점수:</label>
                            <input type="number" class="score-input w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                   min="0" max="20" step="0.5" value="0">
                            <span class="text-sm text-gray-600">/ 20점</span>
                            <span></span>
                        </div>
                        <div class="grid grid-cols-[60px_1fr] gap-3 items-center">
                            <span></span>
                            <div class="text-sm text-gray-500">
                                → 가중 점수: <span class="weighted-score text-base font-bold text-blue-600">0.0점</span>
                            </div>
                        </div>
                    </div>

                    <!-- 평가 항목 5 -->
                    <div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">
                        <div class="grid grid-cols-[1fr_80px] gap-4 mb-4">
                            <div>
                                <h4 class="font-bold text-gray-800 mb-1">5. 학문적 기여도</h4>
                                <p class="text-sm text-gray-600">해당 분야에 대한 학문적 기여</p>
                            </div>
                            <div class="text-right">
                                <div class="text-xs text-gray-500">가중치</div>
                                <div class="text-lg font-bold text-blue-600">20%</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">
                            <label class="text-sm font-medium text-gray-700">점수:</label>
                            <input type="number" class="score-input w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                   min="0" max="20" step="0.5" value="0">
                            <span class="text-sm text-gray-600">/ 20점</span>
                            <span></span>
                        </div>
                        <div class="grid grid-cols-[60px_1fr] gap-3 items-center">
                            <span></span>
                            <div class="text-sm text-gray-500">
                                → 가중 점수: <span class="weighted-score text-base font-bold text-blue-600">0.0점</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 총점 표시 -->
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 my-6 border-2 border-blue-300">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-bold text-gray-800">총점</span>
                        <span class="text-3xl font-bold text-blue-600" id="total-score">0.0점</span>
                    </div>
                </div>

                <!-- 종합 의견 -->
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">종합 의견 *</label>
                    <textarea class="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows="5"
                              placeholder="평가에 대한 종합 의견을 입력하세요"></textarea>
                </div>

                <!-- 제출 버튼 -->
                <div class="flex gap-3">
                    <button class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                        임시 저장
                    </button>
                    <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
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
                ${submission.reviewers && submission.reviewers.length > 0 ? `
                    <div class="space-y-4 mb-6">
                        ${submission.reviewers.map(reviewer => `
                            <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <p class="font-semibold text-gray-800">${reviewer.name}</p>
                                        <p class="text-sm text-gray-600">${reviewer.department || '-'} / ${reviewer.role === '주심' ? '심사위원장' : '심사위원'}</p>
                                    </div>
                                    <div class="text-right">
                                        ${reviewer.score !== undefined && reviewer.score !== null ? `
                                            <p class="text-lg font-bold text-blue-600">${reviewer.score}점</p>
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
                    <div class="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                        <div class="flex justify-between items-center">
                            <p class="font-bold text-blue-900">전체 평균 점수</p>
                            <p class="text-2xl font-bold text-blue-600">
                                ${submission.reviewers.reduce((sum, r) => sum + (r.score || 0), 0) / submission.reviewers.length || 0}점
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
                            <button class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">✓ 승인</span>
                            </button>
                            <button class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">⊙ 보류</span>
                            </button>
                            <button class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">✗ 반려</span>
                            </button>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">최종 의견</label>
                        <textarea class="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows="4"
                                  placeholder="최종 심사 의견을 입력하세요"></textarea>
                    </div>

                    <button class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        최종 결정 제출
                    </button>
                </div>
            </div>
        `;
    }

    content += `</div>`;

    openModal(`${roleText} 평가 - ${typeText}`, content, '닫기', closeModal, true, { size: 'large' });
}

// Export
window.viewThesisReviewDetail = viewThesisReviewDetail;

console.log('✅ 관리자 심사 평가 화면 로드 완료');
