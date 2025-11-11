// Phase 5: 심사 관리 - 심사 상세 (관리자 페이지 스타일 통일)

let currentAssignmentId = null;
let currentEvaluationData = null;

// ==================== 심사 상세 렌더링 ====================
function renderReviewDetail(assignmentId, viewType) {
    currentAssignmentId = assignmentId;
    const detail = ReviewService.getReviewDetail(assignmentId);

    if (!detail) {
        showToast('심사 정보를 찾을 수 없습니다', 'error');
        return;
    }

    const container = document.getElementById('review-detail-content');
    if (!container) return;

    // viewType이 지정되면 해당 역할로, 아니면 내 역할 사용
    const isChair = viewType ? (viewType === 'chair') : (detail.myRole === 'chair');
    const myEval = detail.myEvaluation;
    const isSubmitted = myEval && myEval.status === '제출완료';
    const allSubmitted = detail.allEvaluations.length === detail.assignment.committee.length &&
                         detail.allEvaluations.every(e => e.status === '제출완료');

    let html = '';

    // 논문 정보
    html += renderThesisInfo(detail.assignment);

    // 심사위원 평가 (내 평가)
    if (!isSubmitted) {
        html += renderEvaluationForm(detail.template, myEval, isChair);
    } else {
        html += renderSubmittedEvaluation(detail.template, myEval, isChair);
    }

    // 심사위원장 전용: 종합 평가
    if (isChair && allSubmitted) {
        html += renderChairSummary(detail);
    }

    container.innerHTML = html;

    // 이벤트 바인딩
    bindEvaluationEvents(detail, isSubmitted, isChair, allSubmitted);
}

// ==================== 논문 정보 (관리자 페이지 스타일) ====================
function renderThesisInfo(assignment) {
    // CopyKiller/GPT Killer 점수 (더미 데이터 - 실제로는 assignment에 포함)
    const copyKiller = assignment.copyKiller || Math.floor(Math.random() * 15) + 3;
    const gptKiller = assignment.gptKiller || Math.floor(Math.random() * 15) + 2;

    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">📄 논문 정보</h3>

            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 class="font-bold text-gray-800 mb-3">기본 정보</h4>
                <div class="space-y-3">
                    <div class="info-row">
                        <div class="info-label">대학원</div>
                        <div class="info-value">${assignment.graduateSchool || '일반대학원'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">전공/학과</div>
                        <div class="info-value">${assignment.major}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">학위과정</div>
                        <div class="info-value">${assignment.degree || '석사'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">학번</div>
                        <div class="info-value">${assignment.studentNumber}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">학생명</div>
                        <div class="info-value">${assignment.studentName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">논문제목</div>
                        <div class="info-value font-medium">${assignment.thesisTitle}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">지도교수</div>
                        <div class="info-value">${assignment.advisorName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">제출 단계</div>
                        <div class="info-value">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(assignment.submissionType)}">
                                ${assignment.submissionType}
                            </span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">제출일</div>
                        <div class="info-value">${formatDateFull(assignment.submissionDate)}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">심사 마감일</div>
                        <div class="info-value">
                            <span class="${getDueDateColorClass(assignment.dueDate)}">
                                ${formatDateFull(assignment.dueDate)} ${getDueDateBadge(assignment.dueDate)}
                            </span>
                        </div>
                    </div>
                    ${(assignment.submissionType === '중간논문' || assignment.submissionType === '최종논문') ? `
                    <div class="info-row">
                        <div class="info-label">표절/AI 검사</div>
                        <div class="info-value">CopyKiller: ${copyKiller}% / GPT Killer: ${gptKiller}%</div>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 class="font-bold text-gray-800 mb-3">첨부 파일</h4>
                <div class="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-300">
                    <a href="${assignment.thesisFile}" class="text-blue-600 hover:underline flex-1">${assignment.thesisFile}</a>
                    <button onclick="downloadThesis('${assignment.thesisFile}')"
                            class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        다운로드
                    </button>
                </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <h4 class="font-bold text-gray-800 mb-3">심사위원회</h4>
                <div class="space-y-2">
                    ${assignment.committee.map(member => {
                        const evaluation = REVIEW_EVALUATIONS.find(e => e.committeeId === member.id);
                        const status = evaluation?.status === '제출완료';
                        return `
                            <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300">
                                <div>
                                    <p class="font-medium">${member.professorName}</p>
                                    <p class="text-sm text-gray-600">${member.department} / ${member.role === 'chair' ? '심사위원장' : '심사위원'}</p>
                                </div>
                                <div>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                        ${status ? '평가 완료' : '평가 진행중'}
                                    </span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// ==================== 평가표 (심플 버전 + Pass/Fail 지원) ====================
function renderEvaluationForm(template, existingEvaluation) {
    const savedData = existingEvaluation || { scores: [], passFailResults: [] };
    
    // Pass/Fail 방식
    if (template.evaluationType === 'passfail') {
        return renderPassFailForm(template, savedData);
    }
    
    // 점수형 방식 (기존)
    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">${template.name}</h3>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p class="text-sm text-blue-800">
                    <strong>안내:</strong> 각 항목별로 0-10점 사이의 점수를 입력해주세요. 
                    가중치가 적용되어 최종 점수가 계산됩니다.
                </p>
            </div>
            
            <div id="evaluation-categories" class="space-y-4">
                ${template.categories.map((category, index) => {
                    const savedScore = savedData.scores.find(s => s.categoryId === category.id);
                    const currentScore = savedScore?.score || 0;
                    const currentComment = savedScore?.comment || '';
                    
                    return `
                        <div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4" 
                             data-category-id="${category.id}">
                            
                            <!-- Grid: 제목 영역 | 가중치 (고정 너비) -->
                            <div class="grid grid-cols-[1fr_80px] gap-4 mb-4">
                                <div>
                                    <h4 class="font-bold text-gray-800 mb-1">
                                        ${index + 1}. ${category.name}
                                    </h4>
                                    <p class="text-sm text-gray-600">${category.description}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs text-gray-500">가중치</div>
                                    <div class="text-lg font-bold text-blue-600">${category.weight}%</div>
                                </div>
                            </div>
                            
                            <!-- Grid: 점수 입력 (고정 너비) -->
                            <div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">
                                <label class="text-sm font-medium text-gray-700">점수:</label>
                                <input type="number" 
                                       class="score-input w-full" 
                                       min="0" 
                                       max="${category.maxScore}"
                                       step="0.5"
                                       value="${currentScore}"
                                       data-category-id="${category.id}"
                                       data-max="${category.maxScore}"
                                       data-weight="${category.weight}">
                                <span class="text-sm text-gray-600">/ ${category.maxScore}점</span>
                                <span></span>
                            </div>
                            
                            <!-- Grid: 가중 점수 표시 -->
                            <div class="grid grid-cols-[60px_1fr] gap-3 items-center mb-4">
                                <span></span>
                                <div class="text-sm text-gray-500">
                                    → 가중 점수: 
                                    <span class="weighted-score text-base font-bold text-blue-600">
                                        ${calculateWeightedScore(currentScore, category.maxScore, category.weight).toFixed(1)}점
                                    </span>
                                    <span class="text-xs text-gray-400">(${category.weight}% 적용)</span>
                                </div>
                            </div>
                            
                            <!-- 평가 의견 -->
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>
                                <textarea class="score-comment w-full border border-gray-300 rounded-lg p-2 text-sm" 
                                          rows="2" 
                                          placeholder="해당 항목에 대한 의견을 작성해주세요"
                                          data-category-id="${category.id}">${currentComment}</textarea>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- 총점 -->
            <div class="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-gray-800">총점</h4>
                    <div id="total-score" class="text-3xl font-bold text-blue-600">0.0점</div>
                </div>
                <div class="text-sm text-gray-600 mt-1 text-right">100점 만점 (합격 기준: ${template.passingScore}점)</div>
            </div>
            
            <!-- 종합 의견 (ID 51: 간소화) -->
            <div class="mt-6">
                <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                <textarea id="overall-comment" class="w-full border border-gray-300 rounded-lg p-3 text-sm" 
                          rows="4" 
                          placeholder="평가에 대한 종합 의견을 작성해주세요">${savedData.overallComment?.combined || savedData.overallComment?.conclusion || ''}</textarea>
            </div>
            
            <!-- 버튼 -->
            <div class="mt-6 flex gap-3">
                <button id="save-draft-btn" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium">
                    임시저장
                </button>
                <button id="submit-evaluation-btn" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                    최종 제출
                </button>
            </div>
        </div>
    `;
}

// ==================== Pass/Fail 평가표 ====================
function renderPassFailForm(template, savedData) {
    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">${template.name}</h3>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p class="text-sm text-blue-800">
                    <strong>안내:</strong> 각 항목에 대해 Pass 또는 Fail을 선택해주세요.
                    ${template.passingCriteria === 'all' ? '모든 항목이 Pass여야 합격입니다.' : '과반수가 Pass면 합격입니다.'}
                </p>
            </div>
            
            <div id="passfail-items" class="space-y-4">
                ${template.items.map((item, index) => {
                    const savedResult = savedData.passFailResults?.find(r => r.itemId === item.id);
                    const currentResult = savedResult?.result || '';
                    const currentComment = savedResult?.comment || '';
                    
                    return `
                        <div class="passfail-item bg-white border border-gray-300 rounded-lg p-4" 
                             data-item-id="${item.id}">
                            <!-- 제목 -->
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1">
                                    <h4 class="font-bold text-gray-800 mb-1">
                                        ${index + 1}. ${item.name}
                                        ${item.required ? '<span class="text-red-600 text-sm ml-1">[필수]</span>' : ''}
                                    </h4>
                                    <p class="text-sm text-gray-600">${item.description}</p>
                                </div>
                            </div>
                            
                            <!-- Pass/Fail 선택 -->
                            <div class="flex items-center gap-4 mb-3">
                                <label class="text-sm font-medium text-gray-700">판정:</label>
                                <div class="flex gap-3">
                                    <label class="flex items-center gap-2 cursor-pointer p-2 px-4 rounded-lg border-2 ${currentResult === 'pass' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'} hover:border-green-400">
                                        <input type="radio" 
                                               name="result-${item.id}" 
                                               value="pass" 
                                               class="passfail-radio"
                                               data-item-id="${item.id}"
                                               ${currentResult === 'pass' ? 'checked' : ''}>
                                        <span class="font-medium ${currentResult === 'pass' ? 'text-green-700' : 'text-gray-700'}">Pass</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer p-2 px-4 rounded-lg border-2 ${currentResult === 'fail' ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} hover:border-red-400">
                                        <input type="radio" 
                                               name="result-${item.id}" 
                                               value="fail" 
                                               class="passfail-radio"
                                               data-item-id="${item.id}"
                                               ${currentResult === 'fail' ? 'checked' : ''}>
                                        <span class="font-medium ${currentResult === 'fail' ? 'text-red-700' : 'text-gray-700'}">Fail</span>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- 평가 의견 -->
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>
                                <textarea class="passfail-comment w-full border border-gray-300 rounded-lg p-2 text-sm" 
                                          rows="2" 
                                          placeholder="해당 항목에 대한 의견을 작성해주세요"
                                          data-item-id="${item.id}">${currentComment}</textarea>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- 최종 결과 -->
            <div class="mt-6 bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-gray-800">최종 결과</h4>
                    <div id="passfail-result" class="text-2xl font-bold text-gray-400">미완료</div>
                </div>
                <div class="text-sm text-gray-600 mt-1 text-right" id="passfail-summary">
                    ${template.passingCriteria === 'all' ? '모든 항목 Pass 필요' : '과반수 Pass 필요'}
                </div>
            </div>
            
            <!-- 종합 의견 -->
            <div class="mt-6">
                <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                <textarea id="passfail-overall-comment" class="w-full border border-gray-300 rounded-lg p-3 text-sm" 
                          rows="3" 
                          placeholder="전체적인 평가 의견을 작성해주세요">${savedData.overallComment || ''}</textarea>
            </div>
            
            <!-- 버튼 -->
            <div class="mt-6 flex gap-3">
                <button id="save-draft-btn" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium">
                    임시저장
                </button>
                <button id="submit-evaluation-btn" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                    최종 제출
                </button>
            </div>
        </div>
    `;
}

// ==================== 가중 점수 계산 ====================
function calculateWeightedScore(score, maxScore, weight) {
    return (score / maxScore) * weight;
}

// ==================== 제출된 평가 표시 (읽기 모드) ====================
function renderSubmittedEvaluation(template, evaluation) {
    // Pass/Fail 방식
    if (evaluation.evaluationType === 'passfail') {
        return `
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800">${template.name}</h3>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        제출 완료 (${formatDateTime(evaluation.submittedAt)})
                    </span>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p class="text-sm text-blue-800">
                        <strong>안내:</strong> 각 항목에 대해 Pass 또는 Fail을 선택해주세요.
                        ${template.passingCriteria === 'all' ? '모든 항목이 Pass여야 합격입니다.' : '과반수가 Pass면 합격입니다.'}
                    </p>
                </div>

                <div id="passfail-items" class="space-y-4">
                    ${template.items.map((item, index) => {
                        const result = evaluation.passFailResults.find(r => r.itemId === item.id);
                        const currentResult = result?.result || '';
                        const currentComment = result?.comment || '';

                        return `
                            <div class="passfail-item bg-white border border-gray-300 rounded-lg p-4"
                                 data-item-id="${item.id}">
                                <!-- 제목 -->
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex-1">
                                        <h4 class="font-bold text-gray-800 mb-1">
                                            ${index + 1}. ${item.name}
                                            ${item.required ? '<span class="text-red-600 text-sm ml-1">[필수]</span>' : ''}
                                        </h4>
                                        <p class="text-sm text-gray-600">${item.description}</p>
                                    </div>
                                </div>

                                <!-- Pass/Fail 선택 (읽기 모드) -->
                                <div class="flex items-center gap-4 mb-3">
                                    <label class="text-sm font-medium text-gray-700">판정:</label>
                                    <div class="flex gap-3">
                                        <label class="flex items-center gap-2 p-2 px-4 rounded-lg border-2 ${currentResult === 'pass' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}">
                                            <input type="radio"
                                                   name="result-${item.id}"
                                                   value="pass"
                                                   class="passfail-radio"
                                                   data-item-id="${item.id}"
                                                   ${currentResult === 'pass' ? 'checked' : ''}
                                                   disabled>
                                            <span class="font-medium ${currentResult === 'pass' ? 'text-green-700' : 'text-gray-700'}">Pass</span>
                                        </label>
                                        <label class="flex items-center gap-2 p-2 px-4 rounded-lg border-2 ${currentResult === 'fail' ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}">
                                            <input type="radio"
                                                   name="result-${item.id}"
                                                   value="fail"
                                                   class="passfail-radio"
                                                   data-item-id="${item.id}"
                                                   ${currentResult === 'fail' ? 'checked' : ''}
                                                   disabled>
                                            <span class="font-medium ${currentResult === 'fail' ? 'text-red-700' : 'text-gray-700'}">Fail</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- 평가 의견 (읽기 모드) -->
                                <div>
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>
                                    <textarea class="passfail-comment w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50"
                                              rows="2"
                                              placeholder="해당 항목에 대한 의견을 작성해주세요"
                                              data-item-id="${item.id}"
                                              disabled>${currentComment}</textarea>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- 최종 결과 -->
                <div class="mt-6 ${evaluation.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} rounded-lg p-4 border-2">
                    <div class="flex items-center justify-between">
                        <h4 class="text-lg font-bold text-gray-800">최종 결과</h4>
                        <div class="text-2xl font-bold ${evaluation.passed ? 'text-green-600' : 'text-red-600'}">${evaluation.passed ? '합격' : '불합격'}</div>
                    </div>
                    <div class="text-sm text-gray-600 mt-1 text-right">
                        Pass: ${evaluation.passCount}, Fail: ${evaluation.totalCount - evaluation.passCount}
                    </div>
                </div>

                <!-- 종합 의견 (읽기 모드) -->
                <div class="mt-6">
                    <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                    <textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50"
                              rows="3"
                              placeholder="전체적인 평가 의견을 작성해주세요"
                              disabled>${evaluation.overallComment || ''}</textarea>
                </div>
            </div>
        `;
    }

    // 점수형 방식
    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800">${template.name}</h3>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    제출 완료 (${formatDateTime(evaluation.submittedAt)})
                </span>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p class="text-sm text-blue-800">
                    <strong>안내:</strong> 각 항목별로 0-10점 사이의 점수를 입력해주세요.
                    가중치가 적용되어 최종 점수가 계산됩니다.
                </p>
            </div>

            <div id="evaluation-categories" class="space-y-4">
                ${template.categories.map((category, index) => {
                    const score = evaluation.scores.find(s => s.categoryId === category.id);
                    const currentScore = score?.score || 0;
                    const currentComment = score?.comment || '';

                    return `
                        <div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4"
                             data-category-id="${category.id}">

                            <!-- Grid: 제목 영역 | 가중치 (고정 너비) -->
                            <div class="grid grid-cols-[1fr_80px] gap-4 mb-4">
                                <div>
                                    <h4 class="font-bold text-gray-800 mb-1">
                                        ${index + 1}. ${category.name}
                                    </h4>
                                    <p class="text-sm text-gray-600">${category.description}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs text-gray-500">가중치</div>
                                    <div class="text-lg font-bold text-blue-600">${category.weight}%</div>
                                </div>
                            </div>

                            <!-- Grid: 점수 입력 (고정 너비, 읽기 모드) -->
                            <div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">
                                <label class="text-sm font-medium text-gray-700">점수:</label>
                                <input type="number"
                                       class="score-input w-full bg-gray-50"
                                       min="0"
                                       max="${category.maxScore}"
                                       step="0.5"
                                       value="${currentScore}"
                                       data-category-id="${category.id}"
                                       data-max="${category.maxScore}"
                                       data-weight="${category.weight}"
                                       disabled>
                                <span class="text-sm text-gray-600">/ ${category.maxScore}점</span>
                                <span></span>
                            </div>

                            <!-- Grid: 가중 점수 표시 -->
                            <div class="grid grid-cols-[60px_1fr] gap-3 items-center mb-4">
                                <span></span>
                                <div class="text-sm text-gray-500">
                                    → 가중 점수:
                                    <span class="weighted-score text-base font-bold text-blue-600">
                                        ${calculateWeightedScore(currentScore, category.maxScore, category.weight).toFixed(1)}점
                                    </span>
                                    <span class="text-xs text-gray-400">(${category.weight}% 적용)</span>
                                </div>
                            </div>

                            <!-- 평가 의견 (읽기 모드) -->
                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>
                                <textarea class="score-comment w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50"
                                          rows="2"
                                          placeholder="해당 항목에 대한 의견을 작성해주세요"
                                          data-category-id="${category.id}"
                                          disabled>${currentComment}</textarea>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- 총점 -->
            <div class="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-gray-800">총점</h4>
                    <div class="text-3xl font-bold text-blue-600">${evaluation.totalScore}점</div>
                </div>
                <div class="text-sm text-gray-600 mt-1 text-right">100점 만점 (합격 기준: ${template.passingScore}점)</div>
            </div>

            <!-- 종합 의견 (읽기 모드) -->
            <div class="mt-6">
                <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                <textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50"
                          rows="4"
                          placeholder="평가에 대한 종합 의견을 작성해주세요"
                          disabled>${evaluation.overallComment?.combined || evaluation.overallComment?.conclusion || ''}</textarea>
            </div>
        </div>
    `;
}

// ==================== 심사위원장 종합 평가 ====================
function renderChairSummary(detail) {
    const evaluations = detail.allEvaluations;
    const avgScore = evaluations.reduce((sum, e) => sum + e.totalScore, 0) / evaluations.length;
    const threshold = detail.template.submissionType === '최종논문' ? 80 : 75;
    const systemDecision = avgScore >= threshold ? '합격' : '불합격';

    let html = '';

    // 각 심사위원의 평가를 입력 화면과 동일한 UI로 표시 (읽기 모드)
    evaluations.forEach((evaluation, index) => {
        html += renderCommitteeMemberEvaluation(detail.template, evaluation, index + 1);
    });

    // 종합 평가 섹션
    html += `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">심사위원장 종합 평가</h3>

            <div class="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mb-6">
                <div class="grid grid-cols-3 gap-6 text-center">
                    <div>
                        <div class="text-sm text-gray-600 mb-1">평균 점수</div>
                        <div class="text-3xl font-bold text-blue-600">${avgScore.toFixed(1)}점</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600 mb-1">합격 기준</div>
                        <div class="text-3xl font-bold text-gray-800">${threshold}점</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600 mb-1">시스템 판정</div>
                        <div class="text-2xl font-bold ${systemDecision === '합격' ? 'text-green-600' : 'text-red-600'}">
                            ${systemDecision}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
                <h4 class="font-bold text-gray-800 mb-3">최종 결정</h4>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <label class="flex items-center gap-2 cursor-pointer p-3 bg-white rounded-lg flex-1 border-2 border-gray-300 hover:border-green-400">
                            <input type="radio" name="chairDecision" value="승인" checked class="w-4 h-4">
                            <span class="font-medium">승인</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer p-3 bg-white rounded-lg flex-1 border-2 border-gray-300 hover:border-yellow-400">
                            <input type="radio" name="chairDecision" value="보류" class="w-4 h-4">
                            <span class="font-medium">보류</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer p-3 bg-white rounded-lg flex-1 border-2 border-gray-300 hover:border-red-400">
                            <input type="radio" name="chairDecision" value="반려" class="w-4 h-4">
                            <span class="font-medium">반려</span>
                        </label>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">결정 사유:</label>
                        <textarea id="chair-comment" class="w-full border border-gray-300 rounded-lg p-3 text-sm"
                                  rows="4"
                                  placeholder="최종 결정에 대한 사유를 작성해주세요"></textarea>
                    </div>
                </div>
            </div>

            <div class="flex gap-3">
                <button id="submit-chair-decision-btn" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                    최종 결정 제출
                </button>
            </div>
        </div>
    `;

    return html;
}

// ==================== 심사위원 개별 평가 표시 (위원장용) ====================
function renderCommitteeMemberEvaluation(template, evaluation, memberNumber) {
    // Pass/Fail 방식
    if (evaluation.evaluationType === 'passfail') {
        return `
            <div class="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">${evaluation.professorName} (${evaluation.role === 'chair' ? '심사위원장' : '심사위원'})</h3>
                        <p class="text-sm text-gray-600">${template.name}</p>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        제출 완료 (${formatDateTime(evaluation.submittedAt)})
                    </span>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p class="text-sm text-blue-800">
                        <strong>안내:</strong> 각 항목에 대해 Pass 또는 Fail을 선택해주세요.
                        ${template.passingCriteria === 'all' ? '모든 항목이 Pass여야 합격입니다.' : '과반수가 Pass면 합격입니다.'}
                    </p>
                </div>

                <div class="space-y-4">
                    ${template.items.map((item, index) => {
                        const result = evaluation.passFailResults.find(r => r.itemId === item.id);
                        const currentResult = result?.result || '';
                        const currentComment = result?.comment || '';

                        return `
                            <div class="passfail-item bg-white border border-gray-300 rounded-lg p-4">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex-1">
                                        <h4 class="font-bold text-gray-800 mb-1">
                                            ${index + 1}. ${item.name}
                                            ${item.required ? '<span class="text-red-600 text-sm ml-1">[필수]</span>' : ''}
                                        </h4>
                                        <p class="text-sm text-gray-600">${item.description}</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-4 mb-3">
                                    <label class="text-sm font-medium text-gray-700">판정:</label>
                                    <div class="flex gap-3">
                                        <label class="flex items-center gap-2 p-2 px-4 rounded-lg border-2 ${currentResult === 'pass' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}">
                                            <input type="radio" name="result-${memberNumber}-${item.id}" value="pass" ${currentResult === 'pass' ? 'checked' : ''} disabled>
                                            <span class="font-medium ${currentResult === 'pass' ? 'text-green-700' : 'text-gray-700'}">Pass</span>
                                        </label>
                                        <label class="flex items-center gap-2 p-2 px-4 rounded-lg border-2 ${currentResult === 'fail' ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}">
                                            <input type="radio" name="result-${memberNumber}-${item.id}" value="fail" ${currentResult === 'fail' ? 'checked' : ''} disabled>
                                            <span class="font-medium ${currentResult === 'fail' ? 'text-red-700' : 'text-gray-700'}">Fail</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>
                                    <textarea class="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" rows="2" disabled>${currentComment}</textarea>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="mt-6 ${evaluation.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} rounded-lg p-4 border-2">
                    <div class="flex items-center justify-between">
                        <h4 class="text-lg font-bold text-gray-800">최종 결과</h4>
                        <div class="text-2xl font-bold ${evaluation.passed ? 'text-green-600' : 'text-red-600'}">${evaluation.passed ? '합격' : '불합격'}</div>
                    </div>
                    <div class="text-sm text-gray-600 mt-1 text-right">
                        Pass: ${evaluation.passCount}, Fail: ${evaluation.totalCount - evaluation.passCount}
                    </div>
                </div>

                <div class="mt-6">
                    <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                    <textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50" rows="3" disabled>${evaluation.overallComment || ''}</textarea>
                </div>
            </div>
        `;
    }

    // 점수형 방식
    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-800">${evaluation.professorName} (${evaluation.role === 'chair' ? '심사위원장' : '심사위원'})</h3>
                    <p class="text-sm text-gray-600">${template.name}</p>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    제출 완료 (${formatDateTime(evaluation.submittedAt)})
                </span>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p class="text-sm text-blue-800">
                    <strong>안내:</strong> 각 항목별로 0-10점 사이의 점수를 입력해주세요.
                    가중치가 적용되어 최종 점수가 계산됩니다.
                </p>
            </div>

            <div class="space-y-4">
                ${template.categories.map((category, index) => {
                    const score = evaluation.scores.find(s => s.categoryId === category.id);
                    const currentScore = score?.score || 0;
                    const currentComment = score?.comment || '';

                    return `
                        <div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">
                            <div class="grid grid-cols-[1fr_80px] gap-4 mb-4">
                                <div>
                                    <h4 class="font-bold text-gray-800 mb-1">${index + 1}. ${category.name}</h4>
                                    <p class="text-sm text-gray-600">${category.description}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs text-gray-500">가중치</div>
                                    <div class="text-lg font-bold text-blue-600">${category.weight}%</div>
                                </div>
                            </div>

                            <div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">
                                <label class="text-sm font-medium text-gray-700">점수:</label>
                                <input type="number" class="w-full bg-gray-50" min="0" max="${category.maxScore}" step="0.5" value="${currentScore}" disabled>
                                <span class="text-sm text-gray-600">/ ${category.maxScore}점</span>
                                <span></span>
                            </div>

                            <div class="grid grid-cols-[60px_1fr] gap-3 items-center mb-4">
                                <span></span>
                                <div class="text-sm text-gray-500">
                                    → 가중 점수:
                                    <span class="text-base font-bold text-blue-600">${calculateWeightedScore(currentScore, category.maxScore, category.weight).toFixed(1)}점</span>
                                    <span class="text-xs text-gray-400">(${category.weight}% 적용)</span>
                                </div>
                            </div>

                            <div>
                                <label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>
                                <textarea class="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" rows="2" disabled>${currentComment}</textarea>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-gray-800">총점</h4>
                    <div class="text-3xl font-bold text-blue-600">${evaluation.totalScore}점</div>
                </div>
                <div class="text-sm text-gray-600 mt-1 text-right">100점 만점 (합격 기준: ${template.passingScore}점)</div>
            </div>

            <div class="mt-6">
                <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                <textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50" rows="4" disabled>${evaluation.overallComment?.combined || evaluation.overallComment?.conclusion || ''}</textarea>
            </div>
        </div>
    `;
}

// ==================== 이벤트 바인딩 ====================
function bindEvaluationEvents(detail, isSubmitted, isChair, allSubmitted) {
    if (!isSubmitted) {
        const template = detail.template;
        
        // Pass/Fail 방식
        if (template.evaluationType === 'passfail') {
            // Pass/Fail 라디오 버튼 이벤트
            document.querySelectorAll('.passfail-radio').forEach(radio => {
                radio.addEventListener('change', updatePassFailResult);
            });
            
            // 초기 결과 계산
            updatePassFailResult();
        } else {
            // 점수형 방식 (기존)
            document.querySelectorAll('.score-input').forEach(input => {
                input.addEventListener('input', updateScoreDisplay);
                input.addEventListener('change', calculateTotalScore);
            });
            
            // 초기 총점 계산
            calculateTotalScore();
        }
        
        // 임시저장 버튼
        const saveDraftBtn = document.getElementById('save-draft-btn');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => saveDraft(detail));
        }
        
        // 제출 버튼
        const submitBtn = document.getElementById('submit-evaluation-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => submitEvaluation(detail));
        }
    }
    
    if (isChair && allSubmitted) {
        // 심사위원장 최종 결정 제출
        const chairBtn = document.getElementById('submit-chair-decision-btn');
        if (chairBtn) {
            chairBtn.addEventListener('click', () => submitChairDecision(detail));
        }
    }
}

// ==================== Pass/Fail 결과 업데이트 ====================
function updatePassFailResult() {
    const items = document.querySelectorAll('.passfail-item');
    let passCount = 0;
    let failCount = 0;
    let totalCount = items.length;
    
    items.forEach(item => {
        const itemId = item.dataset.itemId;
        const selected = item.querySelector(`.passfail-radio[data-item-id="${itemId}"]:checked`);
        if (selected) {
            if (selected.value === 'pass') passCount++;
            else failCount++;
        }
    });
    
    const resultEl = document.getElementById('passfail-result');
    const summaryEl = document.getElementById('passfail-summary');
    
    if (passCount + failCount < totalCount) {
        resultEl.textContent = '미완료';
        resultEl.className = 'text-2xl font-bold text-gray-400';
        summaryEl.textContent = `${passCount + failCount}/${totalCount} 항목 평가됨`;
    } else {
        const allPass = failCount === 0;
        resultEl.textContent = allPass ? '합격' : '불합격';
        resultEl.className = `text-2xl font-bold ${allPass ? 'text-green-600' : 'text-red-600'}`;
        summaryEl.textContent = `Pass: ${passCount}, Fail: ${failCount}`;
    }
}

// ==================== 점수 표시 업데이트 ====================
function updateScoreDisplay(e) {
    const input = e.target;
    const container = input.closest('.evaluation-item');
    const weightedScoreEl = container.querySelector('.weighted-score');
    
    const score = parseFloat(input.value) || 0;
    const max = parseFloat(input.dataset.max);
    const weight = parseFloat(input.dataset.weight);
    
    const weighted = calculateWeightedScore(score, max, weight);
    weightedScoreEl.textContent = `${weighted.toFixed(1)}점`;
}

// ==================== 총점 계산 ====================
function calculateTotalScore() {
    let total = 0;
    document.querySelectorAll('.evaluation-item').forEach(item => {
        const input = item.querySelector('.score-input');
        const score = parseFloat(input.value) || 0;
        const max = parseFloat(input.dataset.max);
        const weight = parseFloat(input.dataset.weight);
        
        total += calculateWeightedScore(score, max, weight);
    });
    
    const totalEl = document.getElementById('total-score');
    if (totalEl) {
        totalEl.textContent = `${total.toFixed(1)}점`;
    }
}

// ==================== 임시저장 ====================
function saveDraft(detail) {
    const data = collectEvaluationData();
    
    if (ReviewService.saveDraft(currentAssignmentId, data)) {
        showToast('임시저장되었습니다', 'success');
    } else {
        showToast('저장 중 오류가 발생했습니다', 'error');
    }
}

// ==================== 평가 제출 ====================
function submitEvaluation(detail) {
    const data = collectEvaluationData();
    
    if (!validateEvaluationData(data, detail.template)) {
        showToast('모든 항목을 평가해주세요', 'error');
        return;
    }
    
    if (confirm('평가를 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')) {
        if (ReviewService.submitEvaluation(currentAssignmentId, data)) {
            showToast('평가가 제출되었습니다', 'success');
            renderReviewDetail(currentAssignmentId);
        } else {
            showToast('제출 중 오류가 발생했습니다', 'error');
        }
    }
}

// ==================== 평가 데이터 수집 ====================
function collectEvaluationData() {
    const template = EVALUATION_TEMPLATES[currentAssignmentId];
    
    // Pass/Fail 방식
    if (template && template.evaluationType === 'passfail') {
        const passFailResults = [];
        
        document.querySelectorAll('.passfail-item').forEach(item => {
            const itemId = item.dataset.itemId;
            const selected = item.querySelector(`.passfail-radio[data-item-id="${itemId}"]:checked`);
            const comment = item.querySelector(`.passfail-comment[data-item-id="${itemId}"]`);
            
            passFailResults.push({
                itemId: itemId,
                result: selected ? selected.value : null,
                comment: comment ? comment.value.trim() : ''
            });
        });
        
        const passCount = passFailResults.filter(r => r.result === 'pass').length;
        const totalCount = passFailResults.length;
        const passed = passCount === totalCount; // 모든 항목 Pass
        
        return {
            evaluationType: 'passfail',
            passFailResults,
            passed,
            passCount,
            totalCount,
            overallComment: document.getElementById('passfail-overall-comment')?.value.trim() || ''
        };
    }
    
    // 점수형 방식 (기존)
    const scores = [];
    
    document.querySelectorAll('.evaluation-item').forEach(item => {
        const input = item.querySelector('.score-input');
        const comment = item.querySelector('.score-comment');
        
        scores.push({
            categoryId: input.dataset.categoryId,
            score: parseFloat(input.value) || 0,
            weight: parseFloat(input.dataset.weight),
            comment: comment.value.trim()
        });
    });
    
    const total = scores.reduce((sum, s) => {
        const max = parseFloat(document.querySelector(`[data-category-id="${s.categoryId}"]`).dataset.max);
        return sum + calculateWeightedScore(s.score, max, s.weight);
    }, 0);
    
    return {
        evaluationType: 'score',
        scores,
        totalScore: parseFloat(total.toFixed(1)),
        overallComment: {
            combined: document.getElementById('overall-comment')?.value.trim() || ''
        }
    };
}

// ==================== 유효성 검사 ====================
function validateEvaluationData(data, template) {
    // Pass/Fail 방식
    if (data.evaluationType === 'passfail') {
        // 모든 항목 평가 완료 확인
        const allEvaluated = data.passFailResults.every(r => r.result !== null);
        if (!allEvaluated) {
            return false;
        }
        
        // 종합 의견 확인
        if (!data.overallComment) {
            return false;
        }
        
        return true;
    }
    
    // 점수형 방식 (기존)
    // 모든 항목 점수 입력 확인
    if (data.scores.length !== template.categories.length) {
        return false;
    }
    
    // 점수 범위 확인
    for (const score of data.scores) {
        if (score.score === 0 || score.score === null) {
            return false;
        }
    }
    
    // 종합 의견 입력 확인
    if (!data.overallComment.strengths || !data.overallComment.improvements || !data.overallComment.conclusion) {
        return false;
    }
    
    return true;
}

// ==================== 심사위원장 최종 결정 제출 ====================
function submitChairDecision(detail) {
    const decision = document.querySelector('input[name="chairDecision"]:checked')?.value;
    const comment = document.getElementById('chair-comment')?.value.trim();
    
    if (!comment) {
        showToast('결정 사유를 입력해주세요', 'error');
        return;
    }
    
    if (confirm(`최종 결정을 "${decision}"로 제출하시겠습니까?`)) {
        if (ReviewService.submitChairDecision(currentAssignmentId, decision, comment)) {
            showToast('최종 결정이 제출되었습니다', 'success');
            closeReviewDetail();
            renderReviewList();
        } else {
            showToast('제출 중 오류가 발생했습니다', 'error');
        }
    }
}

// ==================== 유틸리티 함수 ====================
function getTypeBadgeClass(type) {
    const typeMap = {
        '연구계획서': 'bg-blue-100 text-blue-800',
        '중간논문': 'bg-yellow-100 text-yellow-800',
        '최종논문': 'bg-purple-100 text-purple-800'
    };
    return typeMap[type] || 'bg-gray-100 text-gray-800';
}

function getDueDateColorClass(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-semibold';
    if (diffDays <= 3) return 'text-red-600 font-semibold';
    if (diffDays <= 7) return 'text-orange-600';
    return 'text-gray-600';
}

function getDueDateBadge(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '<span class="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">마감</span>';
    if (diffDays === 0) return '<span class="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">오늘</span>';
    if (diffDays <= 3) return `<span class="ml-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">D-${diffDays}</span>`;
    return '';
}

function formatDateFull(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR');
}

function downloadThesis(filename) {
    showToast('파일을 다운로드합니다', 'info');
    // 실제 다운로드 로직
}

function viewThesisOnline(filename) {
    showToast('온라인 뷰어를 엽니다', 'info');
    // 실제 뷰어 로직
}
