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
            // 위원장이면서 자신의 위원 평가가 완료되지 않은 경우
            if (!isSubmitted) {
                html += `<div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <p class="text-yellow-800 font-semibold">⚠️ 위원장 승인 전에 먼저 위원 역할로 평가를 완료해주세요.</p>
                    <button onclick="openReviewDetail('${assignmentId}', 'member')"
                            class="mt-3 bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#8A0034]">
                        위원 평가 화면으로 이동
                    </button>
                </div>`;
            } else {
                // 위원 평가 완료 후 위원장 화면
                html += renderChairApprovalScreen(detail, allSubmitted);
            }
        }
    } else {
        // 위원 화면: 평가표 입력만
        if (!isSubmitted) {
            html += renderEvaluationForm(detail.template, myEval, false);
        } else {
            html += renderSubmittedEvaluation(detail.template, myEval, false);
        }
    }

    container.innerHTML = html;

    // 이벤트 바인딩
    bindEvaluationEvents(detail, isSubmitted, isChairView, allSubmitted);
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
                        <div class="info-label">학과</div>
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
                    <a href="${assignment.thesisFile}" class="text-[#6A0028] hover:underline flex-1">${assignment.thesisFile}</a>
                    <button onclick="downloadThesis('${assignment.thesisFile}')"
                            class="bg-[#6A0028] text-white px-3 py-1 rounded text-sm hover:bg-[#8A0034]">
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

            <!-- 평가 기준 안내 -->
            <div class="bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4 mb-6">
                <h4 class="font-bold text-[#4A001C] mb-3 flex items-center">
                    <i class="fas fa-info-circle mr-2"></i>
                    평가 기준 안내
                </h4>
                <div class="space-y-2 text-sm text-[#4A001C]">
                    <p class="flex items-center">
                        <span class="w-2 h-2 bg-[#6A0028] rounded-full mr-2"></span>
                        <span>${passCriteria.description || '평가 기준이 설정되지 않았습니다.'}</span>
                    </p>
                    <p class="flex items-center">
                        <span class="w-2 h-2 bg-[#6A0028] rounded-full mr-2"></span>
                        <span>총점 ${totalScore}점 만점</span>
                    </p>
                </div>
            </div>

            <div id="evaluation-categories" class="space-y-4">
                ${(template.items || template.categories || []).map((item, index) => {
                    const savedScore = savedData.scores.find(s => s.categoryId === item.id || s.itemId === item.id);
                    const currentScore = savedScore?.score || 0;
                    const currentComment = savedScore?.comment || '';
                    const maxScore = item.score || item.maxScore || 0;

                    return `
                        <div style="margin-bottom: 1.5rem; padding: 1rem; background: white; border: 2px solid #d1d5db; border-radius: 0.5rem;"
                             data-category-id="${item.id}">

                            <div style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-bottom: 1rem;">
                                <div style="flex: 1 1 0%;">
                                    <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem;">
                                        ${index + 1}. ${item.name}
                                    </h4>
                                    ${item.description ? `<p style="font-size: 0.875rem; color: #4b5563;">${item.description}</p>` : ''}
                                </div>
                                <div style="text-align: right; margin-left: 1rem; flex-shrink: 0;">
                                    <span style="font-size: 1.5rem; font-weight: 700; color: #6A0028;">${maxScore}</span>
                                    <span style="font-size: 0.875rem; color: #4b5563;">점</span>
                                </div>
                            </div>

                            <div>
                                <label class="text-sm font-medium text-gray-700 block mb-1">점수 입력:</label>
                                <input type="number"
                                       class="score-input w-full border border-gray-300 rounded-lg p-2"
                                       min="0"
                                       max="${maxScore}"
                                       step="0.5"
                                       value="${currentScore}"
                                       placeholder="0 ~ ${maxScore}점"
                                       data-category-id="${item.id}"
                                       data-max="${maxScore}">

                                <label class="text-sm font-medium text-gray-700 block mt-3 mb-1">평가 의견:</label>
                                <textarea class="score-comment w-full border border-gray-300 rounded-lg p-2 text-sm"
                                          rows="2"
                                          placeholder="해당 항목에 대한 의견을 작성해주세요"
                                          data-category-id="${item.id}">${currentComment}</textarea>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- 총점 -->
            <div class="mt-6 bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <h4 class="text-lg font-bold text-gray-800">총점</h4>
                    <div id="total-score" class="text-3xl font-bold text-gray-400">0 / ${totalScore}점</div>
                </div>
            </div>

            <!-- 종합 의견 -->
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
                <button id="submit-evaluation-btn" class="flex-1 bg-[#6A0028] text-white px-6 py-3 rounded-lg hover:bg-[#8A0034] font-medium">
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

            <!-- 평가 기준 안내 -->
            <div class="bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4 mb-6">
                <h4 class="font-bold text-[#4A001C] mb-3 flex items-center">
                    <i class="fas fa-info-circle mr-2"></i>
                    평가 기준 안내
                </h4>
                <p class="text-sm text-[#4A001C]">
                    <strong>안내:</strong> 각 항목에 대해 Pass 또는 Fail을 선택해주세요.
                    ${passCriteria.description || '통과 기준이 설정되지 않았습니다.'}
                </p>
            </div>

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
            <div class="mt-6 flex gap-3">
                <button id="save-draft-btn" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium">
                    임시저장
                </button>
                <button id="submit-evaluation-btn" class="flex-1 bg-[#6A0028] text-white px-6 py-3 rounded-lg hover:bg-[#8A0034] font-medium">
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

            <!-- 평가 기준 안내 -->
            <div class="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mb-6">
                <h4 class="font-bold text-purple-900 mb-3 flex items-center">
                    <i class="fas fa-info-circle mr-2"></i>
                    평가 기준 안내
                </h4>
                <div class="space-y-2 text-sm text-purple-900">
                    <p class="flex items-center">
                        <span class="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                        <span>각 항목을 A, B, C, D, F 등급으로 평가합니다.</span>
                    </p>
                    <p class="flex items-center">
                        <span class="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                        <span>${passCriteria.description || '통과 기준이 설정되지 않았습니다.'}</span>
                    </p>
                </div>
            </div>

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
            <div class="mt-6 flex gap-3">
                <button id="save-draft-btn" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium">
                    임시저장
                </button>
                <button id="submit-evaluation-btn" class="flex-1 bg-[#6A0028] text-white px-6 py-3 rounded-lg hover:bg-[#8A0034] font-medium">
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
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    제출 완료 (${formatDateTime(evaluation.submittedAt)})
                </span>
            </div>

            <div class="bg-[#FCE4EC] border border-[#F8BBD9] rounded-lg p-4 mb-6">
                <p class="text-sm text-[#6A0028]">
                    <strong>안내:</strong> 각 항목별로 점수를 입력해주세요.
                    입력하신 점수가 합산되어 총점이 계산됩니다.
                </p>
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
                                       class="score-input w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
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
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    제출 완료 (${formatDateTime(evaluation.submittedAt)})
                </span>
            </div>

            <div class="bg-[#FCE4EC] border border-[#F8BBD9] rounded-lg p-4 mb-6">
                <p class="text-sm text-[#6A0028]">
                    <strong>안내:</strong> 각 항목별로 점수를 입력해주세요.
                    입력하신 점수가 합산되어 총점이 계산됩니다.
                </p>
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
                                       class="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
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
                input.addEventListener('input', calculateTotalScore);
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
    let maxTotal = 0;

    document.querySelectorAll('.evaluation-item').forEach(item => {
        const input = item.querySelector('.score-input');
        const score = parseFloat(input.value) || 0;
        const max = parseFloat(input.dataset.max) || 0;

        total += score;
        maxTotal += max;
    });

    const totalEl = document.getElementById('total-score');
    if (totalEl) {
        totalEl.textContent = `${total.toFixed(1)} / ${maxTotal}점`;

        // 색상 업데이트
        if (total > 0) {
            totalEl.className = 'text-3xl font-bold text-[#6A0028]';
        } else {
            totalEl.className = 'text-3xl font-bold text-gray-400';
        }
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

    let html = `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">📊 심사위원 평가 현황</h3>
    `;

    // 모든 위원의 평가 요약
    if (allSubmitted) {
        html += `<div class="space-y-4 mb-6">`;

        detail.allEvaluations.forEach((evaluation, index) => {
            const committee = detail.assignment.committee.find(c => c.id === evaluation.committeeId);
            const totalScore = evaluation.scores ? evaluation.scores.reduce((sum, s) => sum + s.weightedScore, 0) : 0;

            html += `
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <p class="font-semibold text-gray-800">${committee.professorName}</p>
                            <p class="text-sm text-gray-600">${committee.department} / ${committee.role === 'chair' ? '심사위원장' : '심사위원'}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-[#6A0028]">${totalScore.toFixed(1)}점</p>
                            <p class="text-xs text-gray-500">총점</p>
                        </div>
                    </div>
                    ${evaluation.overallComment ? `
                        <div class="mt-3 p-3 bg-white rounded border border-gray-200">
                            <p class="text-xs font-semibold text-gray-600 mb-1">종합 의견:</p>
                            <p class="text-sm text-gray-700">${evaluation.overallComment}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `</div>`;

        // 평균 점수 계산
        const avgScore = detail.allEvaluations.reduce((sum, e) => {
            const totalScore = e.scores ? e.scores.reduce((s, sc) => s + sc.weightedScore, 0) : 0;
            return sum + totalScore;
        }, 0) / detail.allEvaluations.length;

        html += `
            <div class="bg-[#FCE4EC] border-2 border-[#F8BBD9] rounded-lg p-4 mb-6">
                <div class="flex justify-between items-center">
                    <p class="font-bold text-[#4A001C]">전체 평균 점수</p>
                    <p class="text-2xl font-bold text-[#6A0028]">${avgScore.toFixed(1)}점</p>
                </div>
            </div>
        `;

        // 최종 승인 영역
        if (!isApproved) {
            html += `
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-6">
                    <h4 class="font-bold text-gray-800 mb-4">최종 심사 결정</h4>

                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">결정 선택 *</label>
                        <div class="flex gap-3">
                            <button onclick="selectDecision('승인')" id="btn-approve"
                                    class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">✓ 승인</span>
                            </button>
                            <button onclick="selectDecision('보류')" id="btn-hold"
                                    class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">⊙ 보류</span>
                            </button>
                            <button onclick="selectDecision('반려')" id="btn-reject"
                                    class="flex-1 py-3 rounded-lg border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors">
                                <span class="text-lg font-semibold text-gray-700">✗ 반려</span>
                            </button>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">최종 의견</label>
                        <textarea id="chair-final-comment" rows="4"
                                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                  placeholder="최종 심사 의견을 입력하세요"></textarea>
                    </div>

                    <button onclick="submitChairDecision()"
                            class="w-full bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-3 rounded-lg font-semibold">
                        최종 결정 제출
                    </button>
                </div>
            `;
        } else {
            html += `
                <div class="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                    <h4 class="font-bold text-green-800 mb-3">✓ 최종 심사 완료</h4>
                    <div class="space-y-2 text-sm">
                        <p><span class="font-semibold">결정:</span>
                            <span class="inline-block px-3 py-1 rounded-full ${
                                result.finalDecision === '승인' ? 'bg-green-100 text-green-800' :
                                result.finalDecision === '보류' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            } font-semibold">${result.finalDecision}</span>
                        </p>
                        ${result.chairComment ? `
                            <p class="mt-2"><span class="font-semibold">의견:</span> ${result.chairComment}</p>
                        ` : ''}
                        <p class="text-xs text-gray-600 mt-2">결정일: ${formatDateFull(result.decisionDate)}</p>
                    </div>
                </div>
            `;
        }

    } else {
        html += `
            <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p class="text-yellow-800">모든 심사위원의 평가가 완료되면 최종 승인을 진행할 수 있습니다.</p>
                <p class="text-sm text-yellow-700 mt-2">
                    현재 진행률: ${detail.allEvaluations.length} / ${detail.assignment.committee.length}
                </p>
            </div>
        `;
    }

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

    showToast('최종 심사 결정이 제출되었습니다', 'success');

    // 화면 새로고침
    setTimeout(() => {
        renderReviewDetail(currentAssignmentId, 'chair');
    }, 1000);
}

window.selectDecision = selectDecision;
window.submitChairDecision = submitChairDecision;

console.log('✅ review-detail.js 로드 완료 - 버전 2025-01-19-002');
console.log('   renderEvaluationForm:', typeof renderEvaluationForm);
