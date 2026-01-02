// Phase 5: 심사 관리 - 심사 상세 (관리자 페이지 스타일 통일)

let currentAssignmentId = null;
let currentEvaluationData = null;

// ==================== 심사 상세 렌더링 ====================
function renderReviewDetail(assignmentId, viewType) {
    console.log('🎯 renderReviewDetail START - assignmentId:', assignmentId, 'viewType:', viewType);

    currentAssignmentId = assignmentId;
    const detail = ReviewService.getReviewDetail(assignmentId);
    console.log('🎯 ReviewService.getReviewDetail result:', detail);

    if (!detail) {
        console.error('❌ detail is null/undefined');
        showToast('심사 정보를 찾을 수 없습니다', 'error');
        return;
    }

    const container = document.getElementById('review-detail-content');
    console.log('🎯 Container element:', container);

    if (!container) {
        console.error('❌ Container #review-detail-content not found!');
        return;
    }

    // viewType에 따라 화면 분리
    const isChairView = viewType === 'chair';
    const myEval = detail.myEvaluation;
    const isSubmitted = myEval && myEval.status === '제출완료';
    const allSubmitted = detail.allEvaluations.length === detail.assignment.committee.length &&
                         detail.allEvaluations.every(e => e.status === '제출완료');

    let html = '';

    // 논문 정보
    html += renderThesisInfo(detail.assignment);

    // 역할에 따라 화면 분리
    if (isChairView) {
        // 위원장 화면: 평가 요약 + 승인/보류/반려
        if (detail.myRole !== 'chair') {
            html += `<div class="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
                <p class="text-red-800">위원장 권한이 없습니다.</p>
            </div>`;
        } else {
            // 위원장 화면 표시
            html += renderChairApprovalScreen(detail, allSubmitted);
        }
    } else {
        // 위원 화면: 평가표 입력만
        if (!isSubmitted) {
            html += renderEvaluationForm(detail.template, myEval, false);
        } else {
            html += renderSubmittedEvaluation(detail.template, myEval, false);
        }
    }

    console.log('🎯 Setting container.innerHTML with html length:', html.length);
    container.innerHTML = html;
    console.log('🎯 Container innerHTML set successfully');

    // 이벤트 바인딩
    console.log('🎯 Binding events...');
    bindEvaluationEvents(detail, isSubmitted, isChairView, allSubmitted);
    console.log('✅ renderReviewDetail COMPLETED');
}

// ==================== 논문 정보 (관리자 페이지 스타일) ====================
function renderThesisInfo(assignment) {
    // CopyKiller/GPT Killer 점수 (더미 데이터 - 실제로는 assignment에 포함)
    const copyKiller = assignment.copyKiller || Math.floor(Math.random() * 15) + 3;
    const gptKiller = assignment.gptKiller || Math.floor(Math.random() * 15) + 2;

    return `
        <div class="bg-white rounded-lg shadow-md mb-6">
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
                        <span class="text-gray-900 font-medium">${assignment.graduateSchool || '일반대학원'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                        <span class="text-gray-900 font-medium">${assignment.major}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                        <span class="text-gray-900 font-medium">${assignment.major}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                        <span class="text-gray-900 font-medium">${assignment.degree || '석사'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                        <span class="text-gray-900 font-medium">재학</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학번:</span>
                        <span class="text-gray-900 font-medium">${assignment.studentNumber}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                        <span class="text-gray-900 font-medium">${assignment.studentName}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                        <span class="text-gray-900 font-medium">${assignment.advisorName}</span>
                    </div>
                </div>
            </div>

            <!-- 논문 정보 -->
            <div class="px-6 py-4 bg-white">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">논문 정보</h4>
                <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    <div class="col-span-3 flex gap-2 items-center">
                        <span class="text-gray-600 min-w-[80px]">논문 제목:</span>
                        <span class="text-gray-900 font-medium flex-1">${assignment.thesisTitle}</span>
                        <button onclick="downloadThesis('${assignment.thesisFile}')"
                                class="bg-[#6A0028] text-white px-3 py-1 rounded text-sm hover:bg-[#8A0034] whitespace-nowrap">
                            논문 다운로드
                        </button>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">제출일:</span>
                        <span class="text-gray-900 font-medium">${formatDateFull(assignment.submissionDate)}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">심사 희망일:</span>
                        <span class="text-gray-900 font-medium">
                            ${formatDateFull(assignment.dueDate)}
                        </span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">심사 단계:</span>
                        <span class="text-gray-900 font-medium">
                            ${assignment.submissionType}
                        </span>
                    </div>
                    ${(assignment.submissionType === '중간논문' || assignment.submissionType === '최종논문') ? `
                    <div class="col-span-3 flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">CopyKiller/GPT Killer:</span>
                        <span class="text-gray-900 font-medium">${copyKiller}% / ${gptKiller}%</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// ==================== 평가표 (심플 버전 + Pass/Fail 지원) ====================
function renderEvaluationForm(template, existingEvaluation) {
    const savedData = existingEvaluation || { scores: [], passFailResults: [], gradeResults: [] };

    // Pass/Fail 방식
    if (template.evaluationType === 'passfail') {
        return renderPassFailForm(template, savedData);
    }

    // 등급형 방식
    if (template.evaluationType === 'grade') {
        return renderGradeForm(template, savedData);
    }

    // 점수형 방식 (기존)
    const passCriteria = template.passCriteria || template.passingCriteria || {};
    const totalScore = template.totalScore || 100;

    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">${template.name}</h3>

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
                            ${(template.items || template.categories || []).map((item, index) => {
                                const savedScore = savedData.scores.find(s => s.categoryId === item.id || s.itemId === item.id);
                                const currentScore = savedScore?.score || 0;
                                const currentComment = savedScore?.comment || '';
                                const maxScore = item.score || item.maxScore || 0;

                                return `
                                    <tr class="hover:bg-gray-50">
                                        <td class="border border-gray-300 px-2 py-1.5 text-center text-gray-700 text-sm">${index + 1}</td>
                                        <td class="border border-gray-300 px-2 py-1.5 font-medium text-gray-900 text-sm">${item.name}</td>
                                        <td class="border border-gray-300 px-2 py-1.5 text-xs text-gray-600">${item.description || '-'}</td>
                                        <td class="border border-gray-300 px-2 py-1.5 text-center">
                                            <span class="font-bold text-[#6A0028] text-sm">${maxScore}</span>
                                        </td>
                                        <td class="border border-gray-300 px-2 py-1">
                                            <input type="number"
                                                   class="score-input w-full border border-gray-300 rounded px-1.5 py-0.5 text-right text-sm"
                                                   min="0"
                                                   max="${maxScore}"
                                                   step="0.5"
                                                   value="${currentScore}"
                                                   placeholder="0"
                                                   data-category-id="${item.id}"
                                                   data-max="${maxScore}">
                                        </td>
                                        <td class="border border-gray-300 px-2 py-1">
                                            <textarea class="score-comment w-full border border-gray-300 rounded px-1.5 py-1 text-xs resize-y min-h-[32px]"
                                                      rows="1"
                                                      placeholder="의견 작성"
                                                      data-category-id="${item.id}">${currentComment}</textarea>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                        <tfoot>
                            <tr class="bg-gray-50">
                                <td colspan="3" class="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-800 text-sm">총점</td>
                                <td class="border border-gray-300 px-2 py-1.5 text-center">
                                    <span class="font-bold text-[#6A0028] text-sm">${totalScore}</span>
                                </td>
                                <td class="border border-gray-300 px-2 py-1.5 text-center">
                                    <span id="total-score" class="font-bold text-gray-400 text-sm">0</span>
                                </td>
                                <td class="border border-gray-300 px-2 py-1.5"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- 모바일 카드 -->
            <div class="evaluation-cards-mobile md:hidden" id="evaluation-categories">
                ${(template.items || template.categories || []).map((item, index) => {
                    const savedScore = savedData.scores.find(s => s.categoryId === item.id || s.itemId === item.id);
                    const currentScore = savedScore?.score || 0;
                    const currentComment = savedScore?.comment || '';
                    const maxScore = item.score || item.maxScore || 0;

                    return `
                        <div class="border-2 border-gray-300 rounded-lg p-4 bg-white mb-4" data-category-id="${item.id}">
                            <div class="mb-3 pb-3 border-b border-gray-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold text-gray-900 text-base">
                                        ${index + 1}. ${item.name}
                                    </h4>
                                    <span class="ml-2 px-2 py-1 bg-[#FCE4EC] text-[#6A0028] rounded text-sm font-bold whitespace-nowrap">
                                        배점: ${maxScore}점
                                    </span>
                                </div>
                                ${item.description ? `<p class="text-sm text-gray-600 leading-relaxed">${item.description}</p>` : ''}
                            </div>

                            <div class="space-y-3">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1">점수 입력:</label>
                                    <input type="number"
                                           class="score-input w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-right text-lg"
                                           style="min-height: 44px;"
                                           min="0"
                                           max="${maxScore}"
                                           step="0.5"
                                           value="${currentScore}"
                                           placeholder="0 ~ ${maxScore}점"
                                           data-category-id="${item.id}"
                                           data-max="${maxScore}">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-1">평가 의견:</label>
                                    <textarea class="score-comment w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm"
                                              style="min-height: 80px;"
                                              rows="3"
                                              placeholder="해당 항목에 대한 의견을 작성해주세요"
                                              data-category-id="${item.id}">${currentComment}</textarea>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- 종합 의견 -->
            <div class="mt-6">
                <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                <textarea id="overall-comment" class="w-full border border-gray-300 rounded-lg p-3 text-sm"
                          rows="4"
                          placeholder="평가에 대한 종합 의견을 작성해주세요">${savedData.overallComment?.combined || savedData.overallComment?.conclusion || ''}</textarea>
            </div>

            <!-- 버튼 -->
            <div class="mt-6 flex justify-end gap-3">
                <button id="save-draft-btn" class="btn btn-secondary">
                    임시저장
                </button>
                <button id="submit-evaluation-btn" class="btn btn-primary">
                    최종 제출
                </button>
            </div>
        </div>
    `;
}

// ==================== Pass/Fail 평가표 ====================
function renderPassFailForm(template, savedData) {
    const passCriteria = template.passCriteria || {};

    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">${template.name}</h3>

            <div id="passfail-items" class="space-y-4">
                ${template.items.map((item, index) => {
                    const savedResult = savedData.passFailResults?.find(r => r.itemId === item.id);
                    const currentResult = savedResult?.result || '';
                    const currentComment = savedResult?.comment || '';

                    return `
                        <div style="margin-bottom: 1.5rem; padding: 1rem; background: white; border: 2px solid #d1d5db; border-radius: 0.5rem;"
                             data-item-id="${item.id}">
                            <div style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-bottom: 1rem;">
                                <div style="flex: 1 1 0%;">
                                    <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem;">
                                        ${index + 1}. ${item.name}
                                    </h4>
                                    ${item.description ? `
                                        <div style="margin-top: 0.5rem; background: #f9fafb; border: 1px solid #d1d5db; border-radius: 0.25rem; padding: 0.75rem;">
                                            <p style="font-size: 0.75rem; color: #111827; font-weight: 500; margin-bottom: 0.25rem;">판단 기준:</p>
                                            <p style="font-size: 0.75rem; color: #374151;">${item.description}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center gap-4">
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
                                <div>
                                    <label class="text-sm font-medium text-gray-700 block">평가 의견:</label>
                                    <textarea class="passfail-comment w-full border border-gray-300 rounded-lg p-2 text-sm mt-1"
                                              rows="2"
                                              placeholder="해당 항목에 대한 의견을 작성해주세요"
                                              data-item-id="${item.id}">${currentComment}</textarea>
                                </div>
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
                <p class="text-sm text-gray-600 mt-1 text-right" id="passfail-summary">
                    ${passCriteria.description || '통과 기준 설정 필요'}
                </p>
            </div>

            <!-- 종합 의견 -->
            <div class="mt-6">
                <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                <textarea id="passfail-overall-comment" class="w-full border border-gray-300 rounded-lg p-3 text-sm"
                          rows="4"
                          placeholder="평가에 대한 종합 의견을 작성해주세요">${savedData.overallComment || ''}</textarea>
            </div>

            <!-- 버튼 -->
            <div class="mt-6 flex justify-end gap-3">
                <button id="save-draft-btn" class="btn btn-secondary">
                    임시저장
                </button>
                <button id="submit-evaluation-btn" class="btn btn-primary">
                    최종 제출
                </button>
            </div>
        </div>
    `;
}

// ==================== 등급형 평가표 ====================
function renderGradeForm(template, savedData) {
    const passCriteria = template.passCriteria || {};

    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">${template.name}</h3>

            <div id="grade-items" class="space-y-4">
                ${template.items.map((item, index) => {
                    const savedResult = savedData.gradeResults?.find(r => r.itemId === item.id);
                    const currentGrade = savedResult?.grade || '';
                    const currentComment = savedResult?.comment || '';

                    return `
                        <div style="margin-bottom: 1.5rem; padding: 1rem; background: white; border: 2px solid #d1d5db; border-radius: 0.5rem;"
                             data-item-id="${item.id}">
                            <div style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-bottom: 1rem;">
                                <div style="flex: 1 1 0%;">
                                    <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem;">
                                        ${index + 1}. ${item.name}
                                    </h4>
                                    ${item.description ? `
                                        <div style="margin-top: 0.5rem; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 0.25rem; padding: 0.75rem;">
                                            <p style="font-size: 0.75rem; color: #581c87; font-weight: 500; margin-bottom: 0.25rem;">등급 기준:</p>
                                            <p style="font-size: 0.75rem; color: #374151; white-space: pre-line;">${item.description}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="space-y-3">
                                <label class="text-sm font-medium text-gray-700">등급 선택:</label>
                                <div class="flex gap-2">
                                    ${['A', 'B', 'C', 'D', 'F'].map(grade => `
                                        <label class="flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 ${currentGrade === grade ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white'} hover:border-purple-400 flex-1">
                                            <input type="radio"
                                                   name="grade-${item.id}"
                                                   value="${grade}"
                                                   class="grade-radio hidden"
                                                   data-item-id="${item.id}"
                                                   ${currentGrade === grade ? 'checked' : ''}>
                                            <span class="font-bold ${currentGrade === grade ? 'text-purple-700' : 'text-gray-700'}">${grade}</span>
                                        </label>
                                    `).join('')}
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 block mt-3">평가 의견:</label>
                                    <textarea class="grade-comment w-full border border-gray-300 rounded-lg p-2 text-sm mt-1"
                                              rows="2"
                                              placeholder="해당 항목에 대한 의견을 작성해주세요"
                                              data-item-id="${item.id}">${currentComment}</textarea>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- 최종 평가 -->
            <div class="mt-6 bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-purple-900">최종 평가</h4>
                    <div id="grade-result" class="text-2xl font-bold text-gray-400">미완료</div>
                </div>
                <p class="text-sm text-purple-800 mt-1 text-right" id="grade-summary">
                    ${passCriteria.description || '통과 기준 설정 필요'}
                </p>
            </div>

            <!-- 종합 의견 -->
            <div class="mt-6">
                <h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>
                <textarea id="grade-overall-comment" class="w-full border border-gray-300 rounded-lg p-3 text-sm"
                          rows="4"
                          placeholder="평가에 대한 종합 의견을 작성해주세요">${savedData.overallComment || ''}</textarea>
            </div>

            <!-- 버튼 -->
            <div class="mt-6 flex justify-end gap-3">
                <button id="save-draft-btn" class="btn btn-secondary">
                    임시저장
                </button>
                <button id="submit-evaluation-btn" class="btn btn-primary">
                    최종 제출
                </button>
            </div>
        </div>
    `;
}

// ==================== 제출된 평가 표시 (읽기 모드) ====================
function renderSubmittedEvaluation(template, evaluation) {
    // Pass/Fail 방식
    if (evaluation.evaluationType === 'passfail') {
        return `
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800">${template.name}</h3>
                    <span class="text-sm text-gray-600">
                        제출 완료 (${formatDateTime(evaluation.submittedAt)})
                    </span>
                </div>

                <div class="bg-[#FCE4EC] border border-[#F8BBD9] rounded-lg p-4 mb-6">
                    <p class="text-sm text-[#6A0028]">
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
                <span class="text-sm text-gray-600">
                    제출 완료 (${formatDateTime(evaluation.submittedAt)})
                </span>
            </div>

            <div id="evaluation-categories" class="space-y-4">
                ${template.categories.map((category, index) => {
                    const score = evaluation.scores.find(s => s.categoryId === category.id);
                    const currentScore = score?.score || 0;
                    const currentComment = score?.comment || '';

                    return `
                        <div style="margin-bottom: 1.5rem; padding: 1rem; background: white; border: 1px solid #d1d5db; border-radius: 0.5rem;"
                             data-category-id="${category.id}">

                            <div style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-bottom: 0.75rem;">
                                <div style="flex: 1 1 0%;">
                                    <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem;">
                                        ${index + 1}. ${category.name}
                                    </h4>
                                    <p style="font-size: 0.875rem; color: #4b5563;">${category.description}</p>
                                </div>
                                <div style="text-align: right; margin-left: 1rem; flex-shrink: 0;">
                                    <span style="font-size: 1.5rem; font-weight: 700; color: #6A0028;">${category.maxScore}</span>
                                    <span style="font-size: 0.875rem; color: #4b5563;">점</span>
                                </div>
                            </div>

                            <div>
                                <label class="text-sm font-medium text-gray-700 block mb-1">점수 입력:</label>
                                <input type="number"
                                       class="score-input w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-right"
                                       min="0"
                                       max="${category.maxScore}"
                                       step="0.5"
                                       value="${currentScore}"
                                       placeholder="0 ~ ${category.maxScore}점"
                                       data-category-id="${category.id}"
                                       data-max="${category.maxScore}"
                                       disabled>

                                <label class="text-sm font-medium text-gray-700 block mt-3 mb-1">평가 의견:</label>
                                <textarea class="score-input w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50"
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
            <div class="mt-6 bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-gray-800">총점</h4>
                    <div class="text-3xl font-bold text-[#6A0028]">${evaluation.totalScore}점</div>
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

// ==================== 심사위원 개별 평가 표시 (위원장용) ====================
function renderCommitteeMemberEvaluation(template, evaluation, memberNumber) {
    // Pass/Fail 방식
    if (evaluation.evaluationType === 'passfail') {
        return `
            <div class="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-[#6A0028]">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">${evaluation.professorName} (${evaluation.role === 'chair' ? '심사위원장' : '심사위원'})</h3>
                        <p class="text-sm text-gray-600">${template.name}</p>
                    </div>
                    <span class="text-sm text-gray-600">
                        제출 완료 (${formatDateTime(evaluation.submittedAt)})
                    </span>
                </div>

                <div class="bg-[#FCE4EC] border border-[#F8BBD9] rounded-lg p-4 mb-6">
                    <p class="text-sm text-[#6A0028]">
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
        <div class="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-[#6A0028]">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-800">${evaluation.professorName} (${evaluation.role === 'chair' ? '심사위원장' : '심사위원'})</h3>
                    <p class="text-sm text-gray-600">${template.name}</p>
                </div>
                <span class="text-sm text-gray-600">
                    제출 완료 (${formatDateTime(evaluation.submittedAt)})
                </span>
            </div>

            <div class="space-y-4">
                ${template.categories.map((category, index) => {
                    const score = evaluation.scores.find(s => s.categoryId === category.id);
                    const currentScore = score?.score || 0;
                    const currentComment = score?.comment || '';

                    return `
                        <div style="margin-bottom: 1.5rem; padding: 1rem; background: white; border: 1px solid #d1d5db; border-radius: 0.5rem;">
                            <div style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-bottom: 0.75rem;">
                                <div style="flex: 1 1 0%;">
                                    <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem;">
                                        ${index + 1}. ${category.name}
                                    </h4>
                                    <p style="font-size: 0.875rem; color: #4b5563;">${category.description}</p>
                                </div>
                                <div style="text-align: right; margin-left: 1rem; flex-shrink: 0;">
                                    <span style="font-size: 1.5rem; font-weight: 700; color: #6A0028;">${category.maxScore}</span>
                                    <span style="font-size: 0.875rem; color: #4b5563;">점</span>
                                </div>
                            </div>

                            <div>
                                <label class="text-sm font-medium text-gray-700 block mb-1">점수 입력:</label>
                                <input type="number"
                                       class="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-right"
                                       min="0"
                                       max="${category.maxScore}"
                                       step="0.5"
                                       value="${currentScore}"
                                       placeholder="0 ~ ${category.maxScore}점"
                                       disabled>

                                <label class="text-sm font-medium text-gray-700 block mt-3 mb-1">평가 의견:</label>
                                <textarea class="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50"
                                          rows="2"
                                          placeholder="해당 항목에 대한 의견을 작성해주세요"
                                          disabled>${currentComment}</textarea>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="mt-6 bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-gray-800">총점</h4>
                    <div class="text-3xl font-bold text-[#6A0028]">${evaluation.totalScore}점</div>
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
        } else if (template.evaluationType === 'grade') {
            // 등급형 방식
            document.querySelectorAll('.grade-radio').forEach(radio => {
                radio.addEventListener('change', updateGradeResult);
            });

            // 초기 결과 계산
            updateGradeResult();
        } else {
            // 점수형 방식 (기존)
            document.querySelectorAll('.score-input').forEach(input => {
                input.addEventListener('input', function() {
                    validateScoreInput(this, parseFloat(this.dataset.max));
                    calculateTotalScore();
                });
                input.addEventListener('change', function() {
                    validateScoreInput(this, parseFloat(this.dataset.max));
                    calculateTotalScore();
                });
            });

            // 초기 총점 계산
            calculateTotalScore();
        }

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
        const overallComment = document.getElementById('overall-comment');
        if (overallComment) {
            const autoResize = function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            };
            overallComment.addEventListener('input', autoResize);
            // 초기 높이 설정
            autoResize.call(overallComment);
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

// ==================== 등급형 결과 업데이트 ====================
function updateGradeResult() {
    const items = document.querySelectorAll('.grade-item');
    let gradedCount = 0;
    const totalCount = items.length;
    const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    items.forEach(item => {
        const itemId = item.dataset.itemId;
        const selected = item.querySelector(`.grade-radio[data-item-id="${itemId}"]:checked`);
        if (selected) {
            gradedCount++;
            grades[selected.value]++;
        }
    });

    const resultEl = document.getElementById('grade-result');
    const summaryEl = document.getElementById('grade-summary');

    if (gradedCount < totalCount) {
        resultEl.textContent = '미완료';
        resultEl.className = 'text-2xl font-bold text-gray-400';
        summaryEl.textContent = `${gradedCount}/${totalCount} 항목 평가됨`;
    } else {
        // 평균 등급 계산 (A=4, B=3, C=2, D=1, F=0)
        const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };
        let totalPoints = 0;
        Object.keys(grades).forEach(grade => {
            totalPoints += grades[grade] * gradePoints[grade];
        });
        const avgPoint = totalPoints / totalCount;

        // 평균 점수를 등급으로 변환
        let avgGrade = 'F';
        if (avgPoint >= 3.5) avgGrade = 'A';
        else if (avgPoint >= 2.5) avgGrade = 'B';
        else if (avgPoint >= 1.5) avgGrade = 'C';
        else if (avgPoint >= 0.5) avgGrade = 'D';

        resultEl.textContent = avgGrade;
        resultEl.className = `text-2xl font-bold ${avgGrade === 'A' || avgGrade === 'B' ? 'text-purple-600' : avgGrade === 'C' ? 'text-[#6A0028]' : 'text-red-600'}`;
        summaryEl.textContent = `A:${grades.A} B:${grades.B} C:${grades.C} D:${grades.D} F:${grades.F}`;
    }
}

// ==================== 총점 계산 ====================
function calculateTotalScore() {
    let total = 0;

    // 테이블 레이아웃의 score-input 또는 카드 레이아웃의 evaluation-item에서 점수 가져오기
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach(input => {
        const score = parseFloat(input.value) || 0;
        total += score;
    });

    const totalEl = document.getElementById('total-score');
    if (totalEl) {
        totalEl.textContent = total.toFixed(1);

        // 색상 업데이트
        if (total > 0) {
            totalEl.classList.remove('text-gray-400');
            totalEl.classList.add('text-[#6A0028]');
        } else {
            totalEl.classList.remove('text-[#6A0028]');
            totalEl.classList.add('text-gray-400');
        }
    }
}

// ==================== 점수 유효성 검사 ====================
function validateScoreInput(input, maxScore) {
    const value = input.value.trim();

    // 빈 값은 허용 (0으로 처리)
    if (value === '') {
        return;
    }

    // 숫자가 아닌 경우
    if (isNaN(value)) {
        alert('숫자만 입력 가능합니다.');
        input.value = '0';
        return;
    }

    const numValue = parseFloat(value);

    // 음수 입력
    if (numValue < 0) {
        alert('0 이상의 점수를 입력해주세요.');
        input.value = '0';
        return;
    }

    // 배점 초과
    if (numValue > maxScore) {
        alert(`배점(${maxScore}점)을 초과할 수 없습니다.`);
        input.value = maxScore.toString();
        return;
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

    // 등급형 방식
    if (template && template.evaluationType === 'grade') {
        const gradeResults = [];

        document.querySelectorAll('.grade-item').forEach(item => {
            const itemId = item.dataset.itemId;
            const selected = item.querySelector(`.grade-radio[data-item-id="${itemId}"]:checked`);
            const comment = item.querySelector(`.grade-comment[data-item-id="${itemId}"]`);

            gradeResults.push({
                itemId: itemId,
                grade: selected ? selected.value : null,
                comment: comment ? comment.value.trim() : ''
            });
        });

        // 평균 등급 계산
        const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };
        const grades = gradeResults.filter(r => r.grade !== null);
        const totalPoints = grades.reduce((sum, r) => sum + gradePoints[r.grade], 0);
        const avgPoint = grades.length > 0 ? totalPoints / grades.length : 0;

        let avgGrade = 'F';
        if (avgPoint >= 3.5) avgGrade = 'A';
        else if (avgPoint >= 2.5) avgGrade = 'B';
        else if (avgPoint >= 1.5) avgGrade = 'C';
        else if (avgPoint >= 0.5) avgGrade = 'D';

        return {
            evaluationType: 'grade',
            gradeResults,
            averageGrade: avgGrade,
            overallComment: document.getElementById('grade-overall-comment')?.value.trim() || ''
        };
    }

    // 점수형 방식
    const scores = [];
    let total = 0;

    document.querySelectorAll('.evaluation-item').forEach(item => {
        const input = item.querySelector('.score-input');
        const comment = item.querySelector('.score-comment');

        const itemId = input.dataset.categoryId;
        const score = parseFloat(input.value) || 0;
        const maxScore = parseFloat(input.dataset.max) || 0;

        scores.push({
            categoryId: itemId,
            itemId: itemId,
            score: score,
            maxScore: maxScore,
            comment: comment.value.trim()
        });

        total += score;
    });

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
            showToast('모든 항목을 평가해주세요', 'error');
            return false;
        }

        // 종합 의견 확인
        if (!data.overallComment) {
            showToast('종합 의견을 입력해주세요', 'error');
            return false;
        }

        return true;
    }

    // 등급형 방식
    if (data.evaluationType === 'grade') {
        // 모든 항목 평가 완료 확인
        const allEvaluated = data.gradeResults.every(r => r.grade !== null);
        if (!allEvaluated) {
            showToast('모든 항목에 등급을 선택해주세요', 'error');
            return false;
        }

        // 종합 의견 확인
        if (!data.overallComment) {
            showToast('종합 의견을 입력해주세요', 'error');
            return false;
        }

        return true;
    }

    // 점수형 방식
    const itemCount = template.items?.length || template.categories?.length || 0;

    // 모든 항목 점수 입력 확인
    if (data.scores.length !== itemCount) {
        showToast('모든 항목을 평가해주세요', 'error');
        return false;
    }

    // 점수 범위 확인
    for (const score of data.scores) {
        if (score.score === 0 || score.score === null) {
            showToast('모든 항목에 점수를 입력해주세요', 'error');
            return false;
        }
    }

    // 종합 의견 입력 확인
    const overallComment = data.overallComment?.combined || data.overallComment?.conclusion || '';
    if (!overallComment) {
        showToast('종합 의견을 입력해주세요', 'error');
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
        '연구계획서': 'bg-[#FCE4EC] text-[#6A0028]',
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

// ==================== 위원장 승인 화면 ====================
function renderChairApprovalScreen(detail, allSubmitted) {
    const result = detail.result;
    const isApproved = result && result.finalDecision;
    const template = detail.template;

    let html = `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">심사위원 평가 현황</h3>
    `;

    // 테이블 형식으로 심사위원 평가 현황 표시
    const categories = template.items || template.categories || [];

    html += `
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
    detail.assignment.committee.forEach(committee => {
        const isChair = committee.role === 'chair';
        const badgeClass = isChair ? 'bg-[#FCE4EC] text-[#6A0028]' : 'bg-gray-100 text-gray-600';
        const roleText = isChair ? '위원장' : '위원';

        html += `
                        <th class="border border-gray-300">
                            <div class="flex items-center justify-center gap-2">
                                <span>${committee.professorName}</span>
                                <span class="px-2 py-1 rounded-full ${badgeClass}" style="font-size: 12px;">${roleText}</span>
                            </div>
                        </th>
        `;
    });

    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    // 테이블 본문: 각 평가 항목별 점수
    categories.forEach((category, index) => {
        const categoryName = category.name || category.title || '';
        const maxScore = category.maxScore || category.weight || 0;

        html += `
                    <tr class="hover:bg-gray-50">
                        <td class="border border-gray-300 text-gray-700">
                            ${index + 1}
                        </td>
                        <td class="border border-gray-300" style="text-align: left;">
                            ${categoryName}
                        </td>
                        <td class="border border-gray-300 text-gray-700">
                            ${maxScore}
                        </td>
        `;

        // 각 심사위원별 점수
        detail.assignment.committee.forEach(committee => {
            const evaluation = detail.allEvaluations.find(e => e.committeeId === committee.id);

            if (evaluation) {
                // 평가 완료: 해당 항목 점수 찾기
                const scoreItem = evaluation.scores?.find(s =>
                    s.categoryId === category.id || s.itemId === category.id
                );
                const score = scoreItem?.score || scoreItem?.weightedScore || 0;

                html += `
                        <td class="border border-gray-300 font-medium text-gray-900">
                            ${score.toFixed(1)}
                        </td>
                `;
            } else {
                // 평가 대기
                html += `
                        <td class="border border-gray-300 text-gray-500">
                            대기
                        </td>
                `;
            }
        });

        html += `
                    </tr>
        `;
    });

    // 총점 행
    html += `
                    <tr class="bg-gray-100 font-semibold">
                        <td class="border border-gray-300 text-gray-900" colspan="3" style="text-align: left;">
                            총점
                        </td>
    `;

    const PASS_THRESHOLD = 60;
    detail.assignment.committee.forEach(committee => {
        const evaluation = detail.allEvaluations.find(e => e.committeeId === committee.id);

        if (evaluation) {
            const totalScore = evaluation.scores ? evaluation.scores.reduce((sum, s) => sum + (s.weightedScore || s.score || 0), 0) : 0;

            html += `
                        <td class="border border-gray-300">
                            <div class="font-bold text-[#6A0028]">${totalScore.toFixed(1)}</div>
                        </td>
            `;
        } else {
            html += `
                        <td class="border border-gray-300 text-gray-500">
                            대기
                        </td>
            `;
        }
    });

    html += `
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    // 종합 의견 영역
    html += `
        <div class="space-y-3 mb-6">
            <h4 class="text-md font-semibold text-gray-800">종합 의견</h4>
    `;

    detail.assignment.committee.forEach(committee => {
        const evaluation = detail.allEvaluations.find(e => e.committeeId === committee.id);
        const roleText = committee.role === 'chair' ? '위원장' : '위원';

        if (evaluation && evaluation.overallComment) {
            html += `
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <p class="text-sm font-semibold text-gray-700 mb-2">
                        ${committee.professorName} (${roleText})
                    </p>
                    <p class="text-sm text-gray-700">${evaluation.overallComment}</p>
                </div>
            `;
        } else if (!evaluation) {
            html += `
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <p class="text-sm font-semibold text-gray-700 mb-2">
                        ${committee.professorName} (${roleText})
                    </p>
                    <p class="text-sm text-gray-500">평가 대기 중입니다.</p>
                </div>
            `;
        }
    });

    html += `</div>`;

    // 평균 점수 및 시스템 판정 - 항상 표시
    if (allSubmitted) {
        // 모든 평가 완료: 실제 평균 및 판정 계산
        const avgScore = detail.allEvaluations.reduce((sum, e) => {
            const totalScore = e.scores ? e.scores.reduce((s, sc) => s + (sc.weightedScore || sc.score || 0), 0) : 0;
            return sum + totalScore;
        }, 0) / detail.allEvaluations.length;

        const passedCount = detail.allEvaluations.filter(e => {
            const totalScore = e.scores ? e.scores.reduce((s, sc) => s + (sc.weightedScore || sc.score || 0), 0) : 0;
            return totalScore >= PASS_THRESHOLD;
        }).length;

        const allPassed = passedCount === detail.allEvaluations.length;
        const systemDecision = allPassed ? '통과' : '불통과';

        html += `
            <div class="bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4 mb-6">
                <div class="flex justify-between items-center mb-3">
                    <p class="font-bold text-[#4A001C]">전체 평균 점수</p>
                    <p class="text-2xl font-bold text-[#6A0028]">${avgScore.toFixed(1)}점</p>
                </div>
                <div class="flex justify-between items-center pt-3 border-t border-[#F8BBD9]">
                    <p class="font-bold text-[#4A001C]">시스템 판정 결과</p>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-600">(${passedCount}/${detail.allEvaluations.length}명 통과)</span>
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
        // 평가 대기 중: 안내 메시지
        html += `
            <div class="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
                <div class="flex justify-between items-center mb-3">
                    <p class="font-bold text-gray-700">전체 평균 점수</p>
                    <p class="text-2xl font-bold text-gray-500">-</p>
                </div>
                <div class="flex justify-between items-center pt-3 border-t border-gray-300">
                    <p class="font-bold text-gray-700">시스템 판정 결과</p>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-600">(${detail.allEvaluations.length}/${detail.assignment.committee.length}명 평가 완료)</span>
                        <span class="inline-block px-4 py-2 rounded-lg font-bold bg-gray-100 text-gray-500 border border-gray-300">
                            평가 대기
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    // 최종 승인 영역 - 항상 표시 (평가 미완료 시 또는 제출 후 비활성화)
    const chairSubmitted = isApproved;
    const isDisabled = !allSubmitted || chairSubmitted;
    const disabledAttr = isDisabled ? 'disabled' : '';

    // 제출된 결정이 있으면 해당 값 사용
    const chairDecision = chairSubmitted ? result.finalDecision || '승인' : '';
    const chairComment = chairSubmitted ? result.chairComment || '' : '';

    // 결정 버튼 스타일 - 제출 후에도 선택된 항목이 명확히 보이도록 색상 강조
    const approveSelected = chairDecision === '승인' ? 'border-2 border-green-600 bg-green-100' : 'border border-gray-300 bg-white';
    const holdSelected = chairDecision === '보류' ? 'border-2 border-yellow-600 bg-yellow-100' : 'border border-gray-300 bg-white';
    const rejectSelected = chairDecision === '반려' ? 'border-2 border-red-600 bg-red-100' : 'border border-gray-300 bg-white';

    // 선택된 버튼의 텍스트 색상
    const approveTextColor = chairDecision === '승인' ? 'text-green-700' : 'text-gray-700';
    const holdTextColor = chairDecision === '보류' ? 'text-yellow-700' : 'text-gray-700';
    const rejectTextColor = chairDecision === '반려' ? 'text-red-700' : 'text-gray-700';

    // 비활성화 시 opacity는 제출 버튼에만 적용
    const buttonDisabledClass = chairSubmitted ? 'cursor-not-allowed' : isDisabled ? 'opacity-50 cursor-not-allowed' : '';
    const submitBtnDisabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    html += `
        <div class="bg-gray-50 border border-gray-300 rounded-lg p-6">
            <h4 class="font-bold text-gray-800 mb-4">최종 심사 결정</h4>

            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">결정 선택 *</label>
                <div class="flex gap-3">
                    <button onclick="selectDecision('승인')" id="btn-approve" ${disabledAttr}
                            class="flex-1 py-2 rounded ${approveSelected} ${!chairSubmitted ? 'hover:border-green-500 hover:bg-green-50' : ''} transition-colors ${buttonDisabledClass}">
                        <span class="text-sm font-medium ${approveTextColor}">✓ 승인</span>
                    </button>
                    <button onclick="selectDecision('보류')" id="btn-hold" ${disabledAttr}
                            class="flex-1 py-2 rounded ${holdSelected} ${!chairSubmitted ? 'hover:border-yellow-500 hover:bg-yellow-50' : ''} transition-colors ${buttonDisabledClass}">
                        <span class="text-sm font-medium ${holdTextColor}">⊙ 보류</span>
                    </button>
                    <button onclick="selectDecision('반려')" id="btn-reject" ${disabledAttr}
                            class="flex-1 py-2 rounded ${rejectSelected} ${!chairSubmitted ? 'hover:border-red-500 hover:bg-red-50' : ''} transition-colors ${buttonDisabledClass}">
                        <span class="text-sm font-medium ${rejectTextColor}">✗ 반려</span>
                    </button>
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">최종 의견</label>
                <textarea id="chair-final-comment" rows="4" ${disabledAttr}
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm ${chairSubmitted ? 'bg-white text-gray-900' : isDisabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}"
                          placeholder="${!allSubmitted ? '모든 심사위원의 평가가 완료되면 입력할 수 있습니다' : chairSubmitted ? '' : '최종 심사 의견을 입력하세요'}">${chairComment}</textarea>
            </div>

            <div class="flex justify-end">
                <button onclick="submitChairDecision()" ${disabledAttr}
                        class="btn btn-primary ${submitBtnDisabledClass}">
                    최종 결정 제출
                </button>
            </div>
        </div>
    `;

    html += `</div>`;

    return html;
}

let selectedDecision = null;

function selectDecision(decision) {
    selectedDecision = decision;

    // 버튼 스타일 업데이트
    document.querySelectorAll('#btn-approve, #btn-hold, #btn-reject').forEach(btn => {
        btn.classList.remove('border-green-500', 'bg-green-50', 'border-yellow-500', 'bg-yellow-50', 'border-red-500', 'bg-red-50');
        btn.classList.add('border-gray-300');
    });

    if (decision === '승인') {
        const btn = document.getElementById('btn-approve');
        btn.classList.remove('border-gray-300');
        btn.classList.add('border-green-500', 'bg-green-50');
    } else if (decision === '보류') {
        const btn = document.getElementById('btn-hold');
        btn.classList.remove('border-gray-300');
        btn.classList.add('border-yellow-500', 'bg-yellow-50');
    } else if (decision === '반려') {
        const btn = document.getElementById('btn-reject');
        btn.classList.remove('border-gray-300');
        btn.classList.add('border-red-500', 'bg-red-50');
    }
}

function submitChairDecision() {
    if (!selectedDecision) {
        showToast('결정을 선택해주세요', 'warning');
        return;
    }

    const comment = document.getElementById('chair-final-comment').value.trim();

    if (!comment) {
        showToast('최종 의견을 입력해주세요', 'warning');
        return;
    }

    // 제출 확인 (수정 불가 경고 포함)
    const confirmMsg = `최종 심사 결정을 제출하시겠습니까?\n\n결정 내용: ${selectedDecision}\n\n※ 제출 후에는 수정이 불가능합니다.`;
    if (!confirm(confirmMsg)) {
        return;
    }

    // 데이터 저장
    const assignment = ReviewService.getAssignmentById(currentAssignmentId);
    if (assignment) {
        assignment.chairDecision = selectedDecision;
        assignment.chairComment = comment;
        assignment.finalDecision = selectedDecision;
        assignment.status = '심사완료';
        assignment.chairDecidedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
        assignment.chairDecidedBy = 'P003'; // 현재 위원장 ID

        console.log('✅ 위원장 최종 결정 저장:', {
            assignmentId: currentAssignmentId,
            decision: selectedDecision,
            comment
        });
    }

    // 서버에 최종 결정 저장 (실제로는 API 호출)
    const result = {
        assignmentId: currentAssignmentId,
        finalDecision: selectedDecision,
        chairComment: comment,
        decisionDate: new Date().toISOString().split('T')[0]
    };

    // REVIEW_RESULTS에 저장 (Mock)
    const existingIndex = REVIEW_RESULTS.findIndex(r => r.assignmentId === currentAssignmentId);
    if (existingIndex >= 0) {
        REVIEW_RESULTS[existingIndex] = result;
    } else {
        REVIEW_RESULTS.push(result);
    }

    showToast(`최종 결정(${selectedDecision})이 제출되었습니다`, 'success');

    // 화면 새로고침
    setTimeout(() => {
        renderReviewDetail(currentAssignmentId, 'chair');
    }, 1000);
}

window.renderReviewDetail = renderReviewDetail;
window.selectDecision = selectDecision;
window.submitChairDecision = submitChairDecision;

console.log('✅ review-detail.js 로드 완료 - 버전 2025-01-19-002');
console.log('   renderEvaluationForm:', typeof renderEvaluationForm);
console.log('   renderReviewDetail:', typeof renderReviewDetail);
