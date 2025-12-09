// ========== 모달 유틸리티 함수 ==========

function showAlert(message) {
    document.getElementById('alert-message').textContent = message;
    document.getElementById('alert-modal').classList.remove('hidden');
    document.getElementById('modal-backdrop').classList.remove('hidden');
}

function showConfirm(message, onConfirm) {
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-modal').classList.remove('hidden');
    document.getElementById('modal-backdrop').classList.remove('hidden');
    
    document.getElementById('confirm-ok').onclick = () => {
        closeConfirm();
        onConfirm();
    };
}

function closeConfirm() {
    document.getElementById('confirm-modal').classList.add('hidden');
    document.getElementById('modal-backdrop').classList.add('hidden');
}

function closeAlert() {
    document.getElementById('alert-modal').classList.add('hidden');
    document.getElementById('modal-backdrop').classList.add('hidden');
}

function openModal(title, content, confirmText = '저장', onConfirm = null, showFooter = true, options = {}) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('modal-confirm').textContent = confirmText;
    
    const footer = document.getElementById('modal-footer');
    if (!showFooter) {
        footer.classList.add('hidden');
    } else {
        footer.classList.remove('hidden');
    }
    
    // 기존 추가 버튼 제거
    const existingExtraBtns = document.querySelectorAll('.modal-extra-btn');
    existingExtraBtns.forEach(btn => btn.remove());
    
    // 복수 버튼 지원
    if (options.showExtraButtons && options.extraButtons) {
        const cancelBtn = document.getElementById('modal-cancel');
        options.extraButtons.forEach(btnConfig => {
            const extraBtn = document.createElement('button');
            extraBtn.className = `modal-extra-btn px-4 py-2 rounded-md text-sm font-medium ${btnConfig.className}`;
            extraBtn.textContent = btnConfig.text;
            extraBtn.onclick = btnConfig.onClick;
            cancelBtn.parentNode.insertBefore(extraBtn, cancelBtn);
        });
    }
    // 단일 버튼 지원 (하위 호환성)
    else if (options.showExtraButton) {
        const extraBtn = document.createElement('button');
        extraBtn.className = `modal-extra-btn px-4 py-2 rounded-md text-sm font-medium ${options.extraButtonClass || 'bg-[#009DE8] hover:bg-[#0087c9] text-white'}`;
        extraBtn.textContent = options.extraButtonText || '추가 작업';
        extraBtn.onclick = options.onExtraButtonClick;
        
        const cancelBtn = document.getElementById('modal-cancel');
        cancelBtn.parentNode.insertBefore(extraBtn, cancelBtn);
    }
    
    document.getElementById('universal-modal').classList.remove('hidden');
    document.getElementById('modal-backdrop').classList.remove('hidden');
    
    if (onConfirm) {
        document.getElementById('modal-confirm').onclick = onConfirm;
    }
}

function closeModal() {
    document.getElementById('universal-modal').classList.add('hidden');
    document.getElementById('modal-backdrop').classList.add('hidden');
}

// ========== 상세보기 모달 함수들 ==========

function viewSubmissionDetail(id, type) {
    const item = appData.submissions[type].find(s => s.id === id);
    if (!item) return;
    
    let content = '';
    
    if (type === 'researchProposal') {
        content = `
            <div class="space-y-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-4">기본 정보</h4>
                    <div class="space-y-3">
                        <div class="info-row">
                            <div class="info-label">학생명</div>
                            <div class="info-value">${item.studentName} (${item.studentId})</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">전공 / 학위과정</div>
                            <div class="info-value">${item.major} / ${item.degree}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">지도교수</div>
                            <div class="info-value">${item.advisor}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">제출일</div>
                            <div class="info-value">${item.submitDate}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">상태</div>
                            <div class="info-value">
                                <span class="status-badge ${item.status === '승인완료' ? 'status-completed' : 'status-pending'}">${item.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-4">연구 계획 상세</h4>
                    <div class="space-y-3">
                        <div class="info-row">
                            <div class="info-label">논문 제목</div>
                            <div class="info-value font-medium">${item.thesisTitle}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">연구 목적</div>
                            <div class="info-value">${item.researchPurpose}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">연구 방법</div>
                            <div class="info-value">${item.researchMethod}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">기대 효과</div>
                            <div class="info-value">${item.expectedResults}</div>
                        </div>
                    </div>
                </div>
                
                ${item.status === '승인완료' ? `
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-bold text-green-800 mb-3">승인 정보</h4>
                    <div class="space-y-2">
                        <div class="info-row">
                            <div class="info-label">승인일</div>
                            <div class="info-value">${item.approvalDate}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">검토 의견</div>
                            <div class="info-value">${item.reviewComment}</div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-bold text-blue-800 mb-3">첨부 파일</h4>
                    <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <a href="${item.fileUrl}" class="text-blue-600 hover:underline">${item.fileName}</a>
                        <button class="ml-auto bg-[#009DE8] text-white px-3 py-1 rounded text-sm hover:bg-[#0087c9]">다운로드</button>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'midThesis' || type === 'finalThesis') {
        content = `
            <div class="space-y-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-4">기본 정보</h4>
                    <div class="space-y-3">
                        <div class="info-row">
                            <div class="info-label">학생명</div>
                            <div class="info-value">${item.studentName} (${item.studentId})</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">논문 제목</div>
                            <div class="info-value font-medium">${item.thesisTitle}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">제출일</div>
                            <div class="info-value">${item.submitDate}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">총 페이지</div>
                            <div class="info-value">${item.totalPages}쪽</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-bold text-yellow-800 mb-4">🔍 표절/AI 검사 결과</h4>
                    <div class="bg-white rounded-lg p-4 text-center">
                        <div class="text-2xl font-bold text-gray-800">
                            <span class="${item.copyKiller <= 10 ? 'text-green-600' : item.copyKiller <= 20 ? 'text-yellow-600' : 'text-red-600'}">CopyKiller ${item.copyKiller}%</span>
                            <span class="text-gray-400 mx-3">/</span>
                            <span class="${item.gptKiller <= 10 ? 'text-green-600' : item.gptKiller <= 20 ? 'text-yellow-600' : 'text-red-600'}">GPT Killer ${item.gptKiller}%</span>
                        </div>
                    </div>
                    <div class="mt-4">
                        <button onclick="window.open('${item.plagiarismReportUrl || '#'}', '_blank')" 
                                class="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            📄 검사 결과 보고서 다운로드
                        </button>
                    </div>
                </div>
                
                <div class="bg-purple-50 rounded-lg p-4">
                    <h4 class="font-bold text-purple-800 mb-4">심사위원 정보</h4>
                    <div class="space-y-2">
                        ${item.reviewers.map((reviewer, index) => `
                            <div class="p-3 bg-white rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="font-medium">${reviewer.name}</p>
                                        <p class="text-sm text-gray-600">${reviewer.role}</p>
                                    </div>
                                    <div class="text-right">
                                        ${type === 'finalThesis' && reviewer.score !== undefined && reviewer.score !== null ? `
                                            <p class="font-bold text-lg text-[#009DE8]">${reviewer.score}점</p>
                                            ${reviewer.comment ? `<p class="text-sm text-gray-600 line-clamp-1">${reviewer.comment}</p>` : ''}
                                        ` : `
                                            <span class="status-badge ${reviewer.status === '완료' ? 'status-complete' : reviewer.status === '검토중' ? 'status-reviewing' : 'status-pending'}">${reviewer.status}</span>
                                        `}
                                    </div>
                                </div>
                                ${type === 'finalThesis' && reviewer.score !== undefined && reviewer.score !== null ? `
                                    <button onclick="viewIndividualEvaluation(${item.id}, ${index}, '${type}')"
                                            class="mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1">
                                        상세 보기 →
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${type === 'finalThesis' ? (() => {
                    // 평가표 정보 가져오기 (실제로는 item.evaluationCriteriaId로 찾아야 함)
                    const evaluationCriteria = appData.evaluationCriteria ? appData.evaluationCriteria[0] : null;
                    const criteria = evaluationCriteria?.passingCriteria || {};

                    // 점수 계산
                    const result = calculateScoresAndCriteria(item.reviewers, criteria);

                    // 심사위원장 판정 (실제로는 item에서 가져와야 함)
                    const chairDecision = item.chairDecision || 'pending'; // 'pass' | 'fail' | 'pending'
                    const chairDecisionDate = item.chairDecisionDate || null;
                    const chairNote = item.chairNote || '';

                    return `
                        <!-- 심사위원장 최종 판정 -->
                        <div class="bg-gradient-to-r ${chairDecision === 'pass' ? 'from-green-50 to-green-100 border-green-300' : chairDecision === 'fail' ? 'from-red-50 to-red-100 border-red-300' : 'from-yellow-50 to-yellow-100 border-yellow-300'} border-2 rounded-lg p-5 mb-6">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h4 class="font-bold text-lg mb-2 ${chairDecision === 'pass' ? 'text-green-900' : chairDecision === 'fail' ? 'text-red-900' : 'text-yellow-900'}">
                                        심사위원장 최종 판정
                                    </h4>
                                    <span class="text-3xl font-bold ${chairDecision === 'pass' ? 'text-green-700' : chairDecision === 'fail' ? 'text-red-700' : 'text-yellow-700'}">
                                        ${chairDecision === 'pass' ? '✅ 통과' : chairDecision === 'fail' ? '❌ 불통과' : '⏳ 판정 대기'}
                                    </span>
                                </div>
                            </div>
                            ${chairDecisionDate ? `
                                <div class="mt-3 text-sm ${chairDecision === 'pass' ? 'text-green-800' : chairDecision === 'fail' ? 'text-red-800' : 'text-yellow-800'}">
                                    <p><strong>판정일:</strong> ${chairDecisionDate}</p>
                                    ${chairNote ? `<p class="mt-2"><strong>의견:</strong> ${chairNote}</p>` : ''}
                                </div>
                            ` : ''}
                        </div>

                        ${result.hasScores ? `
                            <!-- 점수 계산 결과 (참고용) -->
                            <div class="bg-blue-50 border-2 border-blue-300 rounded-lg p-5 mb-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h4 class="font-bold text-blue-900 text-lg">점수 계산 결과 (참고용)</h4>
                                    <span class="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                        * 최종 판정은 심사위원장이 결정
                                    </span>
                                </div>
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="bg-white rounded-lg p-4 border ${result.meets.meetsMinimum ? 'border-green-300' : 'border-red-300'}">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-sm text-gray-600">최저 점수</span>
                                            <span class="text-2xl">${result.meets.meetsMinimum ? '✓' : '✗'}</span>
                                        </div>
                                        <div class="text-3xl font-bold ${result.meets.meetsMinimum ? 'text-green-700' : 'text-red-700'}">
                                            ${result.scores.minScore}점
                                        </div>
                                        <div class="text-xs text-gray-500 mt-2">
                                            기준: ${result.criteria.minRule?.value || 'N/A'}점 이상
                                        </div>
                                    </div>

                                    <div class="bg-white rounded-lg p-4 border ${result.meets.meetsAverage ? 'border-green-300' : 'border-red-300'}">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-sm text-gray-600">평균 점수</span>
                                            <span class="text-2xl">${result.meets.meetsAverage ? '✓' : '✗'}</span>
                                        </div>
                                        <div class="text-3xl font-bold ${result.meets.meetsAverage ? 'text-green-700' : 'text-red-700'}">
                                            ${result.scores.avgScore.toFixed(1)}점
                                        </div>
                                        <div class="text-xs text-gray-500 mt-2">
                                            기준: ${result.criteria.avgRule?.value || 'N/A'}점 이상
                                        </div>
                                    </div>

                                    <div class="bg-white rounded-lg p-4 border ${result.meets.meetsTotal ? 'border-green-300' : 'border-red-300'}">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-sm text-gray-600">총점</span>
                                            <span class="text-2xl">${result.meets.meetsTotal ? '✓' : '✗'}</span>
                                        </div>
                                        <div class="text-3xl font-bold ${result.meets.meetsTotal ? 'text-green-700' : 'text-red-700'}">
                                            ${result.scores.totalScore}점
                                        </div>
                                        <div class="text-xs text-gray-500 mt-2">
                                            기준: ${result.criteria.totalRule?.value || 'N/A'}점 이상
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    `;
                })() : ''}

                ${type === 'finalThesis' && item.result ? `
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-bold text-green-800 mb-4">최종 심사 결과</h4>
                    <div class="space-y-3">
                        <div class="info-row">
                            <div class="info-label">최종 결과</div>
                            <div class="info-value">
                                <span class="status-badge status-completed">${item.result}</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">최종 점수</div>
                            <div class="info-value">
                                <span class="text-2xl font-bold text-[#009DE8]">${item.finalScore}점</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">심사 완료일</div>
                            <div class="info-value">${item.defenseDate}</div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-bold text-blue-800 mb-3">첨부 파일</h4>
                    <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <a href="${item.fileUrl}" class="text-blue-600 hover:underline">${item.fileName}</a>
                        <button class="ml-auto bg-[#009DE8] text-white px-3 py-1 rounded text-sm hover:bg-[#0087c9]">다운로드</button>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'thesisPlan') {
        content = `
            <div class="space-y-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-4">기본 정보</h4>
                    <div class="space-y-3">
                        <div class="info-row">
                            <div class="info-label">학생명</div>
                            <div class="info-value">${item.studentName} (${item.studentId})</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">논문 제목</div>
                            <div class="info-value font-medium">${item.thesisTitle}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">제출일</div>
                            <div class="info-value">${item.submitDate}</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-4">논문 구성 계획</h4>
                    <div class="space-y-2">
                        <div class="info-row">
                            <div class="info-label">1장</div>
                            <div class="info-value">${item.chapter1}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">2장</div>
                            <div class="info-value">${item.chapter2}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">3장</div>
                            <div class="info-value">${item.chapter3}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">4장</div>
                            <div class="info-value">${item.chapter4}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">5장</div>
                            <div class="info-value">${item.chapter5}</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-bold text-blue-800 mb-3">작성 일정</h4>
                    <p class="text-gray-700">${item.schedule}</p>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-bold text-blue-800 mb-3">첨부 파일</h4>
                    <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <a href="${item.fileUrl}" class="text-blue-600 hover:underline">${item.fileName}</a>
                        <button class="ml-auto bg-[#009DE8] text-white px-3 py-1 rounded text-sm hover:bg-[#0087c9]">다운로드</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 버튼 설정 (연구계획서일 때)
    if (type === 'researchProposal') {
        if (item.status === '승인대기') {
            // 승인대기: [승인], [반려] 버튼
            openModal(
                '연구계획서 상세 정보',
                content,
                '닫기',
                closeModal,
                true,
                {
                    showExtraButtons: true,
                    extraButtons: [
                        {
                            text: '승인',
                            className: 'bg-[#009DE8] hover:bg-[#0087c9] text-white',
                            onClick: () => {
                                showConfirm(
                                    '이 연구계획서를 승인하시겠습니까?',
                                    () => { approveResearchProposal(id); }
                                );
                            }
                        },
                        {
                            text: '반려',
                            className: 'bg-red-600 hover:bg-red-700 text-white',
                            onClick: () => { showRejectModal(id); }
                        }
                    ]
                }
            );
        } else if (item.status === '승인완료') {
            // 승인완료: [승인 취소] 버튼
            openModal(
                '연구계획서 상세 정보',
                content,
                '닫기',
                closeModal,
                true,
                {
                    showExtraButton: true,
                    extraButtonText: '승인 취소',
                    extraButtonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
                    onExtraButtonClick: () => {
                        showConfirm(
                            '승인을 취소하시겠습니까?',
                            () => { cancelApprovalResearchProposal(id); }
                        );
                    }
                }
            );
        } else {
            // 반려 상태: 버튼 없음
            openModal('연구계획서 상세 정보', content, '닫기', closeModal, true);
        }
    } else {
        // 다른 타입
        openModal(
            type === 'thesisPlan' ? '논문작성계획서 상세 정보' :
            type === 'midThesis' ? '중간논문 상세 정보' :
            '최종논문 상세 정보',
            content,
            '닫기',
            closeModal,
            true
        );
    }
}

// ========== 연구계획서 반려 모달 ==========
function showRejectModal(id) {
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">반려 사유</label>
                <textarea id="reject-reason" rows="5" 
                          class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="반려 사유를 입력하세요..."></textarea>
            </div>
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                <p class="text-sm text-red-700">
                    ⚠️ 반려된 연구계획서는 학생이 수정하여 재제출할 수 있습니다.
                </p>
            </div>
        </div>
    `;
    
    openModal(
        '연구계획서 반려',
        content,
        '반려',
        () => {
            const reason = document.getElementById('reject-reason').value.trim();
            if (!reason) {
                showAlert('반려 사유를 입력해주세요.');
                return;
            }
            showConfirm(
                '이 연구계획서를 반려하시겠습니까?',
                () => {
                    rejectResearchProposal(id, reason);
                }
            );
        },
        true
    );
}


// ========== 주차별 논문지도 상세보기 (구버전 제거됨) ==========
// weeklyGuidance.guidancePairs를 사용하는 새 버전은 라인 3084에 정의됨


// ========== PDF 피드백 관련 함수 (뷰어는 별도 구현) ==========

// Task 1-5 ID 25: PDF 뷰어 (관리자는 읽기 전용)
function viewPdfFeedback(id, readOnly = false) {
    const item = appData.guidanceProgress.find(doc => doc.id === id);
    if (!item) {
        showAlert('문서를 찾을 수 없습니다.');
        return;
    }

    // ID 25: 관리자는 읽기 전용으로 교수용 PDF 뷰어 호출
    const mode = readOnly ? '읽기 전용 (관리자)' : '편집 가능 (교수)';
    const modeClass = readOnly ? 'bg-[#009DE8]' : 'bg-[#009DE8]';
    const readOnlyBadge = readOnly ? '<span class="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">읽기 전용</span>' : '';

    // 피드백 상태값 변환
    let statusText = item.feedbackStatus || '대기';
    if (statusText === '답변 대기중') statusText = '대기';
    if (statusText === '피드백 완료') statusText = '완료';

    const statusClass =
        statusText === '대기' ? 'bg-yellow-100 text-yellow-700' :
        statusText === '진행 중' ? 'bg-blue-100 text-blue-700' :
        'bg-green-100 text-green-700';

    // 교수용 PDF 뷰어를 읽기 전용 모드로 표시
    const pdfViewerHtml = `
        <div id="pdf-viewer-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]"
             onclick="if(event.target.id==='pdf-viewer-modal') closePdfViewer()">
            <div class="bg-white rounded-lg shadow-xl w-full h-full mx-4 my-4 flex flex-col"
                 onclick="event.stopPropagation()">

                <!-- 헤더 -->
                <div class="${modeClass} text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-bold flex items-center">
                            PDF 뷰어 - ${item.documentTitle}
                            ${readOnlyBadge}
                        </h3>
                        <div class="text-sm text-white text-opacity-90 mt-1">
                            ${item.fileName} | 학생: ${item.studentName} (${item.studentId})
                        </div>
                    </div>
                    <button onclick="closePdfViewer()"
                            class="text-white hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>

                ${readOnly ? `
                <!-- 읽기 전용 안내 -->
                <div class="px-6 py-3 bg-blue-50 border-b border-blue-200">
                    <div class="flex items-center text-sm text-blue-800">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="font-medium">관리자 모드:</span>
                        <span class="ml-1">교수의 첨삭 내역만 조회할 수 있습니다. 편집 및 댓글 기능은 비활성화됩니다.</span>
                    </div>
                </div>
                ` : ''}

                <!-- PDF 뷰어 영역 -->
                <div class="flex-1 overflow-hidden p-4 bg-gray-100">
                    <div class="h-full bg-white rounded shadow-lg flex items-center justify-center">
                        <div class="text-center">
                            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-gray-600 text-lg mb-2">PDF 뷰어 영역</p>
                            <p class="text-sm text-gray-500">파일: ${item.fileName}</p>
                            <p class="text-xs text-gray-400 mt-4">
                                ${readOnly ? '교수의 첨삭 내역이 표시됩니다 (읽기 전용)' : '첨삭 및 피드백 작성이 가능합니다'}
                            </p>
                            <div class="mt-6 inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                실제 PDF 렌더링은 별도 라이브러리로 구현 예정
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 푸터 -->
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        <span class="font-medium">상태:</span>
                        <span class="ml-2 px-2 py-1 rounded text-xs font-medium ${statusClass}">
                            ${statusText}
                        </span>
                    </div>
                    <button onclick="closePdfViewer()"
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', pdfViewerHtml);
}

function closePdfViewer() {
    const modal = document.getElementById('pdf-viewer-modal');
    if (modal) modal.remove();
}

function writeFeedback(id) {
    const item = appData.guidanceProgress.find(doc => doc.id === id);
    if (!item) {
        showAlert('문서를 찾을 수 없습니다.');
        return;
    }
    
    showAlert(`피드백 작성: ${item.fileName}\n\n※ PDF 뷰어에서 피드백 작성 기능이 제공됩니다.`);
}

function viewJournalDetail(id) {
    const item = appData.submissions.journalSubmission.find(j => j.id === id);
    if (!item) return;
    
    const content = `
        <div class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-4">기본 정보</h4>
                <div class="space-y-3">
                    <div class="info-row">
                        <div class="info-label">학생명</div>
                        <div class="info-value">${item.studentName} (${item.studentId})</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">전공 / 학위과정</div>
                        <div class="info-value">${item.major} / ${item.degree}</div>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-4">논문 정보</h4>
                <div class="space-y-3">
                    <div class="info-row">
                        <div class="info-label">논문 제목 (영문)</div>
                        <div class="info-value font-medium">${item.paperTitle}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">학술지명</div>
                        <div class="info-value font-medium">${item.journalName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">게재 연월</div>
                        <div class="info-value">${item.publishDate} (${item.publishYear}년 ${item.volume}권)</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">페이지</div>
                        <div class="info-value">${item.pages}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">DOI</div>
                        <div class="info-value">
                            <a href="https://doi.org/${item.doi}" target="_blank" class="text-blue-600 hover:underline">${item.doi}</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-4">저자 정보</h4>
                <div class="space-y-3">
                    <div class="info-row">
                        <div class="info-label">제1저자 여부</div>
                        <div class="info-value">
                            <span class="status-badge ${item.isFirstAuthor ? 'status-completed' : 'status-rejected'}">${item.isFirstAuthor ? '예' : '아니오'}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">공동저자</div>
                        <div class="info-value">${item.coAuthors}</div>
                    </div>
                </div>
            </div>
            
            <div class="bg-yellow-50 rounded-lg p-4">
                <h4 class="font-bold text-yellow-800 mb-4">학술지 등급</h4>
                <div class="flex flex-wrap gap-2">
                    ${item.kci ? '<span class="status-badge bg-blue-100 text-blue-700">KCI 등재</span>' : ''}
                    ${item.scopus ? '<span class="status-badge bg-green-100 text-green-700">SCOPUS</span>' : ''}
                    ${item.sci ? '<span class="status-badge bg-red-100 text-red-700">SCI(E)</span>' : ''}
                </div>
                ${item.impactFactor ? `
                <div class="mt-3">
                    <span class="text-sm text-gray-600">Impact Factor: </span>
                    <span class="font-bold text-lg text-[#009DE8]">${item.impactFactor}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">국문 초록</h4>
                <p class="text-gray-700 text-sm leading-relaxed">${item.abstractKor}</p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">영문 초록</h4>
                <p class="text-gray-700 text-sm leading-relaxed">${item.abstractEng}</p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">키워드</h4>
                <p class="text-gray-700">${item.keywords}</p>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-bold text-blue-800 mb-3">첨부 파일</h4>
                <div class="space-y-2">
                    <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span class="flex-1">게재 증명서</span>
                        <button class="bg-[#009DE8] text-white px-3 py-1 rounded text-sm hover:bg-[#0087c9]">다운로드</button>
                    </div>
                    <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span class="flex-1">논문 원문</span>
                        <button class="bg-[#009DE8] text-white px-3 py-1 rounded text-sm hover:bg-[#0087c9]">다운로드</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    openModal('학술지 심사 신청 상세 정보', content, '닫기', closeModal, true);
}

// ========== 수정사항 1: 일정 관리 - 다중 학과 선택 ==========

function openScheduleModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? appData.schedules.find(s => s.id === id) : {};
    
    // 학과 목록 (실제로는 API에서 가져와야 함)
    const departments = [
        { id: 'edu-master', name: '교육공학', degree: '석사' },
        { id: 'edu-phd', name: '교육공학', degree: '박사' },
        { id: 'business-master', name: '경영학', degree: '석사' },
        { id: 'business-phd', name: '경영학', degree: '박사' },
        { id: 'cs-master', name: '컴퓨터공학', degree: '석사' },
        { id: 'cs-phd', name: '컴퓨터공학', degree: '박사' },
        { id: 'psychology-master', name: '심리학', degree: '석사' },
        { id: 'psychology-phd', name: '심리학', degree: '박사' }
    ];
    
    // 기존 선택된 대상 파싱
    const selectedTargets = item.targets || (item.target === '전체' ? [] : item.target ? [item.target] : []);
    
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">일정명 <span class="text-red-600">*</span></label>
                <input type="text" id="schedule-name" value="${item.name || ''}" 
                       placeholder="예: 2025-1학기 연구계획서 제출 기간" 
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    적용 대상 <span class="text-red-600">*</span>
                    <span class="text-xs font-normal text-gray-500">(다중 선택 가능)</span>
                </label>
                
                <div class="mb-3 bg-blue-50 p-3 rounded-md">
                    <label class="flex items-center cursor-pointer">
                        <input type="checkbox" id="target-all" onchange="toggleAllTargets(this)" 
                               ${selectedTargets.length === 0 ? 'checked' : ''}
                               class="h-4 w-4 text-[#009DE8] rounded border-gray-300 focus:ring-[#009DE8]">
                        <span class="ml-2 font-medium text-gray-900">✓ 전체 학과 적용</span>
                    </label>
                </div>
                
                <div id="target-list" class="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
                    ${departments.map(dept => {
                        const deptId = `${dept.name}-${dept.degree}`;
                        const isChecked = selectedTargets.includes(deptId);
                        return `
                            <label class="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer">
                                <input type="checkbox" 
                                       class="target-checkbox h-4 w-4 text-[#009DE8] rounded border-gray-300 focus:ring-[#009DE8]" 
                                       value="${deptId}"
                                       ${isChecked ? 'checked' : ''}
                                       onchange="updateTargetAll()">
                                <span class="ml-3 text-sm text-gray-700">${dept.name} <span class="text-gray-500">(${dept.degree})</span></span>
                            </label>
                        `;
                    }).join('')}
                </div>
                <p class="mt-2 text-xs text-gray-500">
                    <svg class="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                    전체 학과를 선택하면 개별 선택이 해제됩니다
                </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">시작일 <span class="text-red-600">*</span></label>
                    <input type="date" id="schedule-start" value="${item.startDate || ''}" 
                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">종료일 <span class="text-red-600">*</span></label>
                    <input type="date" id="schedule-end" value="${item.endDate || ''}" 
                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea id="schedule-desc" rows="3" 
                          placeholder="일정에 대한 추가 설명을 입력하세요"
                          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">${item.description || ''}</textarea>
            </div>
        </div>
    `;
    
    openModal(isEdit ? '일정 수정' : '일정 추가', content, '저장', () => {
        // 유효성 검사
        const name = document.getElementById('schedule-name').value.trim();
        const startDate = document.getElementById('schedule-start').value;
        const endDate = document.getElementById('schedule-end').value;
        
        if (!name || !startDate || !endDate) {
            showAlert('필수 항목을 모두 입력해주세요.');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            showAlert('종료일은 시작일보다 이후여야 합니다.');
            return;
        }
        
        const isAllTargets = document.getElementById('target-all').checked;
        const selectedCheckboxes = Array.from(document.querySelectorAll('.target-checkbox:checked'));
        const targets = isAllTargets ? [] : selectedCheckboxes.map(cb => cb.value);
        
        if (!isAllTargets && targets.length === 0) {
            showAlert('적용 대상을 최소 1개 이상 선택해주세요.');
            return;
        }
        
        const newItem = {
            id: isEdit ? id : appData.schedules.length + 1,
            name: name,
            target: isAllTargets ? '전체' : targets.join(', '),
            targets: targets,
            startDate: startDate,
            endDate: endDate,
            description: document.getElementById('schedule-desc').value.trim()
        };
        
        if (isEdit) {
            const index = appData.schedules.findIndex(s => s.id === id);
            appData.schedules[index] = newItem;
        } else {
            appData.schedules.push(newItem);
        }
        
        closeModal();
        showAlert(`일정이 ${isEdit ? '수정' : '추가'}되었습니다.`);
        switchView('scheduleManagement');
    });
}

// 전체 선택 토글
function toggleAllTargets(checkbox) {
    const targetCheckboxes = document.querySelectorAll('.target-checkbox');
    if (checkbox.checked) {
        targetCheckboxes.forEach(cb => {
            cb.checked = false;
            cb.disabled = true;
        });
    } else {
        targetCheckboxes.forEach(cb => {
            cb.disabled = false;
        });
    }
}

// 개별 선택 시 전체 선택 해제
function updateTargetAll() {
    const allCheckbox = document.getElementById('target-all');
    const anyChecked = document.querySelectorAll('.target-checkbox:checked').length > 0;
    if (anyChecked) {
        allCheckbox.checked = false;
    }
}

function editSchedule(id) {
    openScheduleModal(id);
}

function deleteSchedule(id) {
    showConfirm('이 일정을 삭제하시겠습니까?', () => {
        appData.schedules = appData.schedules.filter(s => s.id !== id);
        showAlert('일정이 삭제되었습니다.');
        switchView('scheduleManagement');
    });
}

// ========== 수정사항 2: 논문 제출 요건 관리 - 기관계 시스템 연동 ==========

function openRequirementModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? appData.requirements.find(r => r.id === id) : {};
    
    // 기관계 시스템에서 가져온 요건 목록 (실제로는 API)
    const availableRequirements = appData.availableRequirements || [];
    
    const selectedReqs = item.selectedRequirements || [];
    
    const content = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">전공 <span class="text-red-600">*</span></label>
                    <select id="req-major" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]" ${isEdit ? 'disabled' : ''}>
                        <option value="">선택하세요</option>
                        <option value="교육공학" ${item.major === '교육공학' ? 'selected' : ''}>교육공학</option>
                        <option value="경영학" ${item.major === '경영학' ? 'selected' : ''}>경영학</option>
                        <option value="컴퓨터공학" ${item.major === '컴퓨터공학' ? 'selected' : ''}>컴퓨터공학</option>
                        <option value="심리학" ${item.major === '심리학' ? 'selected' : ''}>심리학</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">학위과정 <span class="text-red-600">*</span></label>
                    <select id="req-degree" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]" ${isEdit ? 'disabled' : ''}>
                        <option value="">선택하세요</option>
                        <option value="석사" ${item.degree === '석사' ? 'selected' : ''}>석사</option>
                        <option value="박사" ${item.degree === '박사' ? 'selected' : ''}>박사</option>
                    </select>
                </div>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div class="flex">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="text-sm text-blue-700">
                        <p class="font-medium">기관계 시스템 연동 방식</p>
                        <p class="mt-1">아래에서 필요한 요건을 선택하여 조합하세요. 선택된 요건은 해당 전공/학위에 적용됩니다.</p>
                    </div>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    논문 제출 요건 선택 <span class="text-red-600">*</span>
                    <span class="text-xs font-normal text-gray-500">(다중 선택)</span>
                </label>
                
                <div class="border border-gray-200 rounded-md max-h-96 overflow-y-auto" id="requirements-list">
                    ${availableRequirements.length === 0 ? `
                        <div class="p-6 text-center text-gray-500">
                            <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p class="mb-2">등록된 요건이 없습니다</p>
                            <button onclick="loadRequirementsFromSystem()" class="text-[#009DE8] hover:underline text-sm">
                                기관계 시스템에서 불러오기 →
                            </button>
                        </div>
                    ` : availableRequirements.map(req => {
                        const isChecked = selectedReqs.includes(req.id);
                        return `
                            <label class="flex items-start p-4 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer">
                                <input type="checkbox" 
                                       class="requirement-checkbox mt-1 h-4 w-4 text-[#009DE8] rounded border-gray-300" 
                                       value="${req.id}"
                                       ${isChecked ? 'checked' : ''}>
                                <div class="ml-3 flex-1">
                                    <div class="flex items-center justify-between">
                                        <p class="text-sm font-medium text-gray-900">${req.name}</p>
                                        <span class="text-xs text-gray-500">[${req.category}]</span>
                                    </div>
                                    <p class="text-xs text-gray-600 mt-1">${req.description}</p>
                                    ${req.details ? `
                                        <div class="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                            ${req.details}
                                        </div>
                                    ` : ''}
                                </div>
                            </label>
                        `;
                    }).join('')}
                </div>
                
                <div class="mt-2 flex items-center justify-between">
                    <p class="text-xs text-gray-500">
                        선택된 요건: <span id="selected-count" class="font-medium text-[#009DE8]">${selectedReqs.length}</span>개
                    </p>
                    <button onclick="loadRequirementsFromSystem()" 
                            class="text-xs text-blue-600 hover:underline flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        기관계 시스템에서 다시 불러오기
                    </button>
                </div>
            </div>
            
            <div id="selected-requirements-summary" class="bg-gray-50 rounded-md p-4">
                <p class="text-sm font-medium text-gray-700 mb-2">선택된 요건 요약</p>
                <div id="summary-content" class="text-sm text-gray-600">
                    ${selectedReqs.length === 0 ? '선택된 요건이 없습니다.' : '요건을 선택하면 여기에 요약이 표시됩니다.'}
                </div>
            </div>
        </div>
        
        <script>
            // 체크박스 변경 시 카운트 업데이트
            document.querySelectorAll('.requirement-checkbox').forEach(cb => {
                cb.addEventListener('change', () => {
                    const count = document.querySelectorAll('.requirement-checkbox:checked').length;
                    document.getElementById('selected-count').textContent = count;
                });
            });
        </script>
    `;
    
    openModal(isEdit ? '논문 제출 요건 수정' : '논문 제출 요건 추가', content, '저장', () => {
        const major = document.getElementById('req-major').value;
        const degree = document.getElementById('req-degree').value;
        
        if (!major || !degree) {
            showAlert('전공과 학위과정을 선택해주세요.');
            return;
        }
        
        const selectedCheckboxes = Array.from(document.querySelectorAll('.requirement-checkbox:checked'));
        if (selectedCheckboxes.length === 0) {
            showAlert('최소 1개 이상의 요건을 선택해주세요.');
            return;
        }
        
        const selectedReqIds = selectedCheckboxes.map(cb => cb.value);
        const selectedReqObjects = availableRequirements.filter(r => selectedReqIds.includes(r.id));
        
        // 요건 통합 계산
        const requirements = calculateRequirements(selectedReqObjects);
        
        const newItem = {
            id: isEdit ? id : appData.requirements.length + 1,
            major: major,
            degree: degree,
            selectedRequirements: selectedReqIds,
            ...requirements
        };
        
        if (isEdit) {
            const index = appData.requirements.findIndex(r => r.id === id);
            appData.requirements[index] = newItem;
        } else {
            appData.requirements.push(newItem);
        }
        
        closeModal();
        showAlert(`논문 제출 요건이 ${isEdit ? '수정' : '추가'}되었습니다.`);
        switchView('requirementManagement');
    });
}

// 기관계 시스템에서 요건 불러오기 (시뮬레이션)
function loadRequirementsFromSystem() {
    showAlert('기관계 시스템에서 요건을 불러오는 중...\n\n실제 시스템에서는 API를 통해 실시간으로 데이터를 가져옵니다.');
    
    // 실제로는 API 호출
    // fetch('/api/institutional/requirements').then(...)
}

// 선택된 요건들을 통합하여 최종 요건 계산
function calculateRequirements(selectedReqs) {
    // 실제 로직 구현 필요
    return {
        minCredits: 24,
        thesisRequired: true,
        journalPapers: 1,
        conferencePapers: 0
    };
}

function editRequirement(id) {
    openRequirementModal(id);
}

function deleteRequirement(id) {
    showConfirm('이 요건을 삭제하시겠습니까?', () => {
        appData.requirements = appData.requirements.filter(r => r.id !== id);
        showAlert('요건이 삭제되었습니다.');
        switchView('requirementManagement');
    });
}

// ========== 수정사항 3: 논문지도 단계 관리 - 지도단계유형에서 불러와 조합 + n번 반복 ==========

function openStageModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? appData.stages.find(s => s.id === id) : { 
        steps: [],
        stageCount: 0,
        evaluationCount: 0
    };
    
    const content = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">전공 <span class="text-red-600">*</span></label>
                    <select id="stage-major" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                        <option value="">선택하세요</option>
                        <option value="교육공학" ${item.major === '교육공학' ? 'selected' : ''}>교육공학</option>
                        <option value="경영학" ${item.major === '경영학' ? 'selected' : ''}>경영학</option>
                        <option value="컴퓨터공학" ${item.major === '컴퓨터공학' ? 'selected' : ''}>컴퓨터공학</option>
                        <option value="심리학" ${item.major === '심리학' ? 'selected' : ''}>심리학</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">학위과정 <span class="text-red-600">*</span></label>
                    <select id="stage-degree" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                        <option value="">선택하세요</option>
                        <option value="석사" ${item.degree === '석사' ? 'selected' : ''}>석사</option>
                        <option value="박사" ${item.degree === '박사' ? 'selected' : ''}>박사</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">워크플로우명 <span class="text-red-600">*</span></label>
                <input type="text" id="stage-name" value="${item.name || ''}"
                       placeholder="예: 2025-1학기 교육공학 석사 표준 계획"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
            </div>

            <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div class="flex">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="text-sm text-blue-700">
                        <p class="font-medium">워크플로우 저장 후 상세보기에서 단계 추가/수정</p>
                        <p class="mt-1">워크플로우를 먼저 생성한 후, [상세보기]에서 각 단계를 추가하고 평가표를 연결할 수 있습니다.</p>
                    </div>
                </div>
            </div>
            
            ${isEdit && item.steps.length > 0 ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">현재 구성 (${item.stageCount}단계)</label>
                    <div class="border border-gray-200 rounded-md p-3 bg-gray-50">
                        <div class="flex items-center gap-1 flex-wrap">
                            ${item.steps.map((step, idx) => `
                                <span class="px-2 py-1 rounded text-xs ${
                                    step.hasEvaluation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }">
                                    ${step.name}
                                </span>
                                ${idx < item.steps.length - 1 ? '<span class="text-gray-400">→</span>' : ''}
                            `).join('')}
                        </div>
                        <p class="text-xs text-gray-500 mt-2">
                            <i class="fas fa-info-circle mr-1"></i>
                            저장 후 [상세보기]에서 단계를 수정할 수 있습니다.
                        </p>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    openModal(
        isEdit ? '워크플로우 수정' : '워크플로우 추가', 
        content, 
        '저장', 
        () => {
            const major = document.getElementById('stage-major').value;
            const degree = document.getElementById('stage-degree').value;
            const name = document.getElementById('stage-name').value.trim();

            if (!major || !degree || !name) {
                showAlert('필수 항목을 모두 입력해주세요.');
                return;
            }

            if (isEdit) {
                // 수정: 기존 steps 유지
                const index = appData.stages.findIndex(s => s.id === id);
                appData.stages[index].name = name;
                appData.stages[index].major = major;
                appData.stages[index].degree = degree;
                
                closeModal();
                showAlert('워크플로우가 수정되었습니다.');
                switchView('stageManagement');
            } else {
                // 추가: 빈 steps로 생성
                const newItem = {
                    id: Date.now(),
                    name: name,
                    major: major,
                    degree: degree,
                    stageCount: 0,
                    evaluationCount: 0,
                    steps: []
                };
                
                appData.stages.push(newItem);
                
                closeModal();
                showAlert('워크플로우가 생성되었습니다. 이제 [상세보기]에서 단계를 추가하세요.');
                switchView('stageManagement');
            }
        }
    );
}


function editStage(id) {
    const workflow = appData.stages.find(s => s.id === id);
    if (!workflow) {
        showAlert('워크플로우를 찾을 수 없습니다.');
        return;
    }

    const studentCount = workflow.studentCount || 0;
    if (studentCount > 0) {
        showAlert(`이 워크플로우는 ${studentCount}명의 학생에게 적용되어 있어 수정할 수 없습니다.`);
        return;
    }

    // 단계 조립 화면으로 이동
    editWorkflowStages(id);
}

function deleteStage(id) {
    showConfirm('이 워크플로우를 삭제하시겠습니까?', () => {
        appData.stages = appData.stages.filter(s => s.id !== id);
        showAlert('워크플로우가 삭제되었습니다.');
        switchView('stageManagement');
    });
}

// 워크플로우 상세보기 (평가표 연결 확인)
function viewStageDetail(id) {
    const workflow = appData.stages.find(s => s.id === id);
    if (!workflow) {
        showAlert('워크플로우를 찾을 수 없습니다.');
        return;
    }

    const studentCount = workflow.studentCount || 0;
    const canEdit = studentCount === 0;

    const content = `
        <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-medium text-gray-500">워크플로우명</label>
                        <p class="text-sm font-bold text-gray-800 mt-1">${workflow.name}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">학과</label>
                        <p class="text-sm text-gray-800 mt-1">${workflow.major}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">학위과정</label>
                        <p class="text-sm text-gray-800 mt-1">${workflow.degree}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">적용 학생 수</label>
                        <p class="text-sm text-gray-800 mt-1">
                            <span class="${studentCount > 0 ? 'text-red-600 font-bold' : 'text-green-600'}">${studentCount}명</span>
                        </p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">수정 가능 여부</label>
                        <p class="text-sm mt-1">
                            ${canEdit ?
                                '<span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">수정 가능</span>' :
                                '<span class="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">수정 불가</span>'
                            }
                        </p>
                    </div>
                </div>
                ${!canEdit ? `
                    <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p class="text-xs text-yellow-800">
                            <i class="fas fa-exclamation-triangle mr-1"></i>
                            이 워크플로우는 ${studentCount}명의 학생에게 적용되어 있어 수정할 수 없습니다.
                        </p>
                    </div>
                ` : ''}
            </div>

            <div>
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-gray-800">단계 구성 (총 ${workflow.stageCount}단계)</h4>
                    <div class="flex gap-2">
                        ${canEdit ? `
                            <button onclick="editWorkflowStages(${id})"
                                    class="text-sm bg-[#009DE8] text-white px-3 py-1 rounded hover:bg-[#0087c9]">
                                <i class="fas fa-edit mr-1"></i> 단계 조립
                            </button>
                            <button onclick="addWorkflowStep(${id})"
                                    class="text-sm bg-[#009DE8] text-white px-3 py-1 rounded hover:bg-[#0087c9]">
                                + 단계 추가
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="space-y-2">
                    ${workflow.steps.length === 0 ? `
                        <div class="text-center py-8 text-gray-500">
                            <p class="text-sm">등록된 단계가 없습니다.</p>
                            ${canEdit ? `
                                <p class="text-xs mt-2">상단의 "단계 조립" 또는 "단계 추가" 버튼을 눌러 단계를 구성하세요.</p>
                            ` : ''}
                        </div>
                    ` : workflow.steps.map((step, idx) => `
                        <div class="bg-white border ${step.hasEvaluation ? 'border-green-300' : 'border-gray-200'} rounded-lg p-4">
                            <div class="flex justify-between items-start">
                                <div class="flex items-center gap-3 flex-1">
                                    <span class="text-lg font-bold text-gray-400">${step.order}</span>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <p class="text-sm font-bold text-gray-800">${step.name}</p>
                                            ${step.hasEvaluation ?
                                                '<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">평가함</span>' :
                                                '<span class="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">평가안함</span>'
                                            }
                                        </div>
                                        ${step.startDate || step.endDate ? `
                                            <p class="text-xs text-gray-600 mt-1">
                                                <i class="fas fa-calendar text-blue-600 mr-1"></i>
                                                일정: ${step.startDate || '-'} ~ ${step.endDate || '-'}
                                            </p>
                                        ` : ''}
                                        ${step.hasEvaluation ? `
                                            <p class="text-xs text-gray-600 mt-1">
                                                <i class="fas fa-check-circle text-green-600 mr-1"></i>
                                                평가표: ${step.evaluationCriteriaName}
                                            </p>
                                        ` : ''}
                                    </div>
                                </div>
                                ${canEdit ? `
                                    <div class="flex gap-2">
                                        <button onclick="editWorkflowStep(${id}, ${step.id})"
                                                class="text-xs text-blue-600 hover:underline">
                                            수정
                                        </button>
                                        <button onclick="deleteWorkflowStep(${id}, ${step.id})"
                                                class="text-xs text-red-600 hover:underline">
                                            삭제
                                        </button>
                                        ${idx > 0 ? `
                                            <button onclick="moveStepUp(${id}, ${step.id})"
                                                    class="text-xs text-gray-600 hover:underline">
                                                ↑
                                            </button>
                                        ` : ''}
                                        ${idx < workflow.steps.length - 1 ? `
                                            <button onclick="moveStepDown(${id}, ${step.id})"
                                                    class="text-xs text-gray-600 hover:underline">
                                                ↓
                                            </button>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    openModal(`${workflow.name} - 상세`, content, '닫기', closeModal, true);
}

// 워크플로우 단계 추가
function addWorkflowStep(workflowId) {
    const workflow = appData.stages.find(s => s.id === workflowId);
    if (!workflow) return;
    
    const availableCriteria = appData.evaluationCriteria;
    
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    단계명 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="step-name" 
                       placeholder="예: 연구계획서"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    평가 여부 <span class="text-red-600">*</span>
                </label>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="has-evaluation" value="false" checked
                               class="mr-2" onchange="toggleStepEvaluationSelect()">
                        <span class="text-sm">평가하지 않음</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="has-evaluation" value="true"
                               class="mr-2" onchange="toggleStepEvaluationSelect()">
                        <span class="text-sm">평가함</span>
                    </label>
                </div>
            </div>
            <div id="step-evaluation-select-container" style="display: none;">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    평가표 선택 <span class="text-red-600">*</span>
                </label>
                <select id="step-criteria" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="">선택</option>
                    ${availableCriteria.map(c => `
                        <option value="${c.id}">${c.name} (${c.itemCount}개 항목, ${c.totalScore}점)</option>
                    `).join('')}
                </select>
                <p class="mt-2 text-xs text-gray-500">
                    <i class="fas fa-info-circle mr-1"></i>
                    모든 평가표를 선택할 수 있습니다.
                </p>
            </div>
        </div>
    `;
    
    openModal('단계 추가', content, '추가', () => {
        const stepName = document.getElementById('step-name')?.value.trim();
        const hasEvaluation = document.querySelector('input[name="has-evaluation"]:checked')?.value === 'true';
        const criteriaId = hasEvaluation ? parseInt(document.getElementById('step-criteria')?.value) : null;
        
        if (!stepName) {
            showAlert('단계명을 입력하세요.');
            return;
        }
        
        if (hasEvaluation && !criteriaId) {
            showAlert('평가표를 선택하세요.');
            return;
        }
        
        const criteria = hasEvaluation ? appData.evaluationCriteria.find(c => c.id === criteriaId) : null;
        
        const newStep = {
            id: Date.now(),
            name: stepName,
            order: workflow.steps.length + 1,
            hasEvaluation: hasEvaluation,
            evaluationCriteriaId: criteriaId,
            evaluationCriteriaName: criteria ? criteria.name : null
        };
        
        workflow.steps.push(newStep);
        workflow.stageCount = workflow.steps.length;
        workflow.evaluationCount = workflow.steps.filter(s => s.hasEvaluation).length;
        
        closeModal();
        showAlert('단계가 추가되었습니다.');
        viewStageDetail(workflowId);
    });
}

// 워크플로우 단계 수정
function editWorkflowStep(workflowId, stepId) {
    const workflow = appData.stages.find(s => s.id === workflowId);
    if (!workflow) return;
    
    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) return;
    
    const availableCriteria = appData.evaluationCriteria;
    
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    단계명 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="step-name" value="${step.name}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    평가 여부 <span class="text-red-600">*</span>
                </label>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="has-evaluation" value="false" ${!step.hasEvaluation ? 'checked' : ''}
                               class="mr-2" onchange="toggleStepEvaluationSelect()">
                        <span class="text-sm">평가하지 않음</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="has-evaluation" value="true" ${step.hasEvaluation ? 'checked' : ''}
                               class="mr-2" onchange="toggleStepEvaluationSelect()">
                        <span class="text-sm">평가함</span>
                    </label>
                </div>
            </div>
            <div id="step-evaluation-select-container" style="display: ${step.hasEvaluation ? 'block' : 'none'};">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    평가표 선택 <span class="text-red-600">*</span>
                </label>
                <select id="step-criteria" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="">선택</option>
                    ${availableCriteria.map(c => `
                        <option value="${c.id}" ${step.evaluationCriteriaId === c.id ? 'selected' : ''}>
                            ${c.name} (${c.itemCount}개 항목, ${c.totalScore}점)
                        </option>
                    `).join('')}
                </select>
            </div>
        </div>
    `;
    
    openModal('단계 수정', content, '저장', () => {
        const stepName = document.getElementById('step-name')?.value.trim();
        const hasEvaluation = document.querySelector('input[name="has-evaluation"]:checked')?.value === 'true';
        const criteriaId = hasEvaluation ? parseInt(document.getElementById('step-criteria')?.value) : null;
        
        if (!stepName) {
            showAlert('단계명을 입력하세요.');
            return;
        }
        
        if (hasEvaluation && !criteriaId) {
            showAlert('평가표를 선택하세요.');
            return;
        }
        
        const criteria = hasEvaluation ? appData.evaluationCriteria.find(c => c.id === criteriaId) : null;
        
        step.name = stepName;
        step.hasEvaluation = hasEvaluation;
        step.evaluationCriteriaId = criteriaId;
        step.evaluationCriteriaName = criteria ? criteria.name : null;
        
        workflow.evaluationCount = workflow.steps.filter(s => s.hasEvaluation).length;
        
        closeModal();
        showAlert('단계가 수정되었습니다.');
        viewStageDetail(workflowId);
    });
}

// 워크플로우 단계 삭제
function deleteWorkflowStep(workflowId, stepId) {
    showConfirm('이 단계를 삭제하시겠습니까?', () => {
        const workflow = appData.stages.find(s => s.id === workflowId);
        if (!workflow) return;
        
        workflow.steps = workflow.steps.filter(s => s.id !== stepId);
        
        // 순서 재조정
        workflow.steps.forEach((step, idx) => {
            step.order = idx + 1;
        });
        
        workflow.stageCount = workflow.steps.length;
        workflow.evaluationCount = workflow.steps.filter(s => s.hasEvaluation).length;
        
        showAlert('단계가 삭제되었습니다.');
        viewStageDetail(workflowId);
    });
}

// 워크플로우 복사
function copyStage(id) {
    const workflow = appData.stages.find(s => s.id === id);
    if (!workflow) {
        showAlert('워크플로우를 찾을 수 없습니다.');
        return;
    }
    
    const content = `
        <div class="space-y-4">
            <div class="bg-gray-50 rounded p-3 mb-4">
                <p class="text-sm text-gray-700">
                    <strong>${workflow.name}</strong>을(를) 복사합니다.
                </p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    새 워크플로우명 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="copy-workflow-name" 
                       value="${workflow.name} (복사본)"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    학과/전공
                </label>
                <input type="text" id="copy-workflow-major" 
                       value="${workflow.major}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    학위과정
                </label>
                <select id="copy-workflow-degree" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="석사" ${workflow.degree === '석사' ? 'selected' : ''}>석사</option>
                    <option value="박사" ${workflow.degree === '박사' ? 'selected' : ''}>박사</option>
                </select>
            </div>
        </div>
    `;
    
    openModal('워크플로우 복사', content, '복사', () => {
        const name = document.getElementById('copy-workflow-name')?.value.trim();
        const major = document.getElementById('copy-workflow-major')?.value.trim();
        const degree = document.getElementById('copy-workflow-degree')?.value;
        
        if (!name) {
            showAlert('워크플로우명을 입력하세요.');
            return;
        }
        
        const newWorkflow = {
            ...workflow,
            id: Date.now(),
            name: name,
            major: major,
            degree: degree,
            steps: workflow.steps.map(step => ({
                ...step,
                id: Date.now() + Math.random()
            }))
        };
        
        appData.stages.push(newWorkflow);

        closeModal();
        showAlert('워크플로우가 복사되었습니다.');
        switchView('stageManagement');
    });
}

// 워크플로우 단계 조립 (지도 단계 유형에서 선택)
function editWorkflowStages(workflowId) {
    const workflow = appData.stages.find(s => s.id === workflowId);
    if (!workflow) {
        showAlert('워크플로우를 찾을 수 없습니다.');
        return;
    }

    // Store current workflow ID globally for helper functions
    window._currentWorkflowId = workflowId;

    const availableTypes = appData.types || [];
    const availableCriteria = appData.evaluationCriteria || [];

    // Initialize temporary stages array if not exists
    window._tempWorkflowStages = workflow.steps.length > 0 ? JSON.parse(JSON.stringify(workflow.steps)) : [];

    const renderStageAssembly = () => {
        return `
            <div class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded p-3">
                    <p class="text-sm text-blue-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        지도 단계 유형을 선택하여 워크플로우를 구성합니다. 각 단계에 이름을 부여하고 평가가 필요한 단계에는 평가표를 매핑하세요.
                    </p>
                </div>

                <div>
                    <h5 class="font-bold text-gray-800 mb-2">단계 유형 선택</h5>
                    <select id="stage-type-select" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                        <option value="">단계 유형을 선택하세요</option>
                        ${availableTypes.map(t => `
                            <option value="${t.id}">
                                ${t.name} ${t.document ? '[문서]' : ''} ${t.presentation ? '[발표]' : ''}
                            </option>
                        `).join('')}
                    </select>
                    <button onclick="addStageFromType()" class="mt-2 text-sm bg-[#009DE8] text-white px-3 py-1 rounded hover:bg-[#0087c9]">
                        + 단계 추가
                    </button>
                </div>

                <div>
                    <h5 class="font-bold text-gray-800 mb-2">구성된 단계 (${window._tempWorkflowStages.length}개)</h5>
                    <div id="stage-assembly-list" class="space-y-2">
                        ${window._tempWorkflowStages.length === 0 ? `
                            <p class="text-sm text-gray-500 text-center py-4">단계를 추가해주세요</p>
                        ` : window._tempWorkflowStages.map((stage, idx) => `
                            <div class="bg-white border border-gray-200 rounded p-3">
                                <div class="flex items-start gap-3">
                                    <span class="text-sm font-bold text-gray-400">${idx + 1}.</span>
                                    <div class="flex-1 space-y-2">
                                        <input type="text"
                                               id="stage-name-${idx}"
                                               value="${stage.name}"
                                               placeholder="단계명 입력"
                                               class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                               onchange="updateTempStageName(${idx}, this.value)">
                                        <div class="grid grid-cols-2 gap-2">
                                            <div>
                                                <label class="text-xs text-gray-600">시작일</label>
                                                <input type="date"
                                                       id="stage-start-${idx}"
                                                       value="${stage.startDate || ''}"
                                                       class="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                                       onchange="updateTempStageDate(${idx}, 'start', this.value)">
                                            </div>
                                            <div>
                                                <label class="text-xs text-gray-600">종료일</label>
                                                <input type="date"
                                                       id="stage-end-${idx}"
                                                       value="${stage.endDate || ''}"
                                                       class="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                                       onchange="updateTempStageDate(${idx}, 'end', this.value)">
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <label class="text-sm font-medium">평가표:</label>
                                            <select id="stage-criteria-${idx}"
                                                    onchange="updateTempStageCriteria(${idx}, this.value)"
                                                    class="text-xs border border-gray-300 rounded px-2 py-1">
                                                <option value="">평가 없음</option>
                                                ${availableCriteria.map(c => `
                                                    <option value="${c.id}" ${stage.evaluationCriteriaId === c.id ? 'selected' : ''}>
                                                        ${c.name}
                                                    </option>
                                                `).join('')}
                                            </select>
                                        </div>
                                        ${stage.stageTypeId ? `
                                            <p class="text-xs text-gray-500">
                                                유형: ${availableTypes.find(t => t.id === stage.stageTypeId)?.name || ''}
                                            </p>
                                        ` : ''}
                                    </div>
                                    <div class="flex gap-1">
                                        ${idx > 0 ? `
                                            <button onclick="moveTempStageUp(${idx})" class="text-xs text-gray-600 hover:underline">↑</button>
                                        ` : ''}
                                        ${idx < window._tempWorkflowStages.length - 1 ? `
                                            <button onclick="moveTempStageDown(${idx})" class="text-xs text-gray-600 hover:underline">↓</button>
                                        ` : ''}
                                        <button onclick="removeTempStage(${idx})" class="text-xs text-red-600 hover:underline">삭제</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    };

    const content = renderStageAssembly();

    openModal('워크플로우 단계 조립', content, '저장', () => {
        // Validate all stages have names
        for (let i = 0; i < window._tempWorkflowStages.length; i++) {
            const name = document.getElementById(`stage-name-${i}`)?.value.trim();
            if (!name) {
                showAlert(`${i + 1}번 단계의 이름을 입력하세요.`);
                return;
            }
            window._tempWorkflowStages[i].name = name;

            // Validate evaluation criteria if needed
            if (window._tempWorkflowStages[i].hasEvaluation) {
                const criteriaId = parseInt(document.getElementById(`stage-criteria-${i}`)?.value);
                if (!criteriaId) {
                    showAlert(`${i + 1}번 단계의 평가표를 선택하세요.`);
                    return;
                }
            }
        }

        // Update workflow with new stages
        workflow.steps = window._tempWorkflowStages.map((stage, idx) => ({
            ...stage,
            order: idx + 1
        }));
        workflow.stageCount = workflow.steps.length;
        workflow.evaluationCount = workflow.steps.filter(s => s.hasEvaluation).length;

        closeModal();
        showAlert('워크플로우 단계가 저장되었습니다.');
        viewStageDetail(workflowId);
    }, true);
}

// Helper functions for stage assembly
function addStageFromType() {
    const select = document.getElementById('stage-type-select');
    const typeId = parseInt(select?.value);

    if (!typeId) {
        showAlert('단계 유형을 선택하세요.');
        return;
    }

    const stageType = appData.types.find(t => t.id === typeId);
    if (!stageType) return;

    const newStage = {
        id: Date.now() + Math.random(),
        name: stageType.name,
        stageTypeId: typeId,
        hasEvaluation: false,
        evaluationCriteriaId: null,
        evaluationCriteriaName: null
    };

    window._tempWorkflowStages.push(newStage);

    // Re-render the list
    const listContainer = document.getElementById('stage-assembly-list');
    if (listContainer) {
        const workflow = appData.stages.find(s => s.id);
        listContainer.outerHTML = document.createElement('div').innerHTML = editWorkflowStages.toString();
        // Trigger re-render by calling parent function - but this won't work in modal context
        // Instead, let's use a simpler approach: close and reopen
    }

    // Refresh modal content
    showAlert('단계가 추가되었습니다. 이름을 수정하고 필요시 평가표를 선택하세요.');
    // Close and reopen modal with updated content
    const currentWorkflowId = window._currentWorkflowId;
    closeModal();
    setTimeout(() => editWorkflowStages(currentWorkflowId), 100);
}

function updateTempStageName(idx, value) {
    if (window._tempWorkflowStages[idx]) {
        window._tempWorkflowStages[idx].name = value;
    }
}

function updateTempStageDate(idx, type, value) {
    if (window._tempWorkflowStages[idx]) {
        if (type === 'start') {
            window._tempWorkflowStages[idx].startDate = value;
        } else if (type === 'end') {
            window._tempWorkflowStages[idx].endDate = value;
        }
    }
}

function updateTempStageCriteria(idx, criteriaId) {
    const id = parseInt(criteriaId);
    if (window._tempWorkflowStages[idx]) {
        const criteria = appData.evaluationCriteria.find(c => c.id === id);
        window._tempWorkflowStages[idx].evaluationCriteriaId = id || null;
        window._tempWorkflowStages[idx].evaluationCriteriaName = criteria ? criteria.name : null;
        // 평가표가 선택되면 hasEvaluation true, "평가 없음"(빈 값)이면 false
        window._tempWorkflowStages[idx].hasEvaluation = !!id;
    }
}

function removeTempStage(idx) {
    window._tempWorkflowStages.splice(idx, 1);

    // Refresh modal
    const currentWorkflowId = window._currentWorkflowId;
    closeModal();
    setTimeout(() => editWorkflowStages(currentWorkflowId), 100);
}

function moveTempStageUp(idx) {
    if (idx > 0 && window._tempWorkflowStages[idx]) {
        const temp = window._tempWorkflowStages[idx];
        window._tempWorkflowStages[idx] = window._tempWorkflowStages[idx - 1];
        window._tempWorkflowStages[idx - 1] = temp;

        // Refresh modal
        const currentWorkflowId = window._currentWorkflowId;
        closeModal();
        setTimeout(() => editWorkflowStages(currentWorkflowId), 100);
    }
}

function moveTempStageDown(idx) {
    if (idx < window._tempWorkflowStages.length - 1 && window._tempWorkflowStages[idx]) {
        const temp = window._tempWorkflowStages[idx];
        window._tempWorkflowStages[idx] = window._tempWorkflowStages[idx + 1];
        window._tempWorkflowStages[idx + 1] = temp;

        // Refresh modal
        const currentWorkflowId = window._currentWorkflowId;
        closeModal();
        setTimeout(() => editWorkflowStages(currentWorkflowId), 100);
    }
}

// 평가표 선택 토글
function toggleStepEvaluationSelect() {
    const hasEvaluation = document.querySelector('input[name="has-evaluation"]:checked')?.value === 'true';
    const container = document.getElementById('step-evaluation-select-container');
    if (container) {
        container.style.display = hasEvaluation ? 'block' : 'none';
    }
}

// 워크플로우 단계 순서 위로 이동
function moveStepUp(workflowId, stepId) {
    const workflow = appData.stages.find(s => s.id === workflowId);
    if (!workflow) return;
    
    const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
    if (stepIndex <= 0) return; // 이미 첫 번째
    
    // 배열에서 위치 교환
    const temp = workflow.steps[stepIndex];
    workflow.steps[stepIndex] = workflow.steps[stepIndex - 1];
    workflow.steps[stepIndex - 1] = temp;
    
    // order 재조정
    workflow.steps.forEach((step, idx) => {
        step.order = idx + 1;
    });
    
    viewStageDetail(workflowId);
}

// 워크플로우 단계 순서 아래로 이동
function moveStepDown(workflowId, stepId) {
    const workflow = appData.stages.find(s => s.id === workflowId);
    if (!workflow) return;
    
    const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
    if (stepIndex < 0 || stepIndex >= workflow.steps.length - 1) return; // 이미 마지막
    
    // 배열에서 위치 교환
    const temp = workflow.steps[stepIndex];
    workflow.steps[stepIndex] = workflow.steps[stepIndex + 1];
    workflow.steps[stepIndex + 1] = temp;
    
    // order 재조정
    workflow.steps.forEach((step, idx) => {
        step.order = idx + 1;
    });
    
    viewStageDetail(workflowId);
}

// ========== 수정사항 4: 평가 기준 관리 - 배점표 + Pass/Fail ==========

function openEvaluationModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? appData.evaluationCriteria.find(e => e.id === id) : { 
        items: [],
        evaluationType: 'score' // 'score' 또는 'passfail'
    };
    
    const content = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">기준명 <span class="text-red-600">*</span></label>
                    <input type="text" id="eval-name" value="${item.name || ''}" 
                           placeholder="예: 석사 논문 평가 기준"
                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">학위과정 <span class="text-red-600">*</span></label>
                    <select id="eval-type" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                        <option value="">선택하세요</option>
                        <option value="석사" ${item.type === '석사' ? 'selected' : ''}>석사</option>
                        <option value="박사" ${item.type === '박사' ? 'selected' : ''}>박사</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">평가 방식 <span class="text-red-600">*</span></label>
                <div class="flex gap-4">
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="eval-method" value="score" 
                               ${item.evaluationType !== 'passfail' ? 'checked' : ''}
                               onchange="toggleEvaluationMethod()"
                               class="h-4 w-4 text-[#009DE8] border-gray-300 focus:ring-[#009DE8]">
                        <span class="ml-2 text-sm text-gray-700">배점 방식 (점수)</span>
                    </label>
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="eval-method" value="passfail" 
                               ${item.evaluationType === 'passfail' ? 'checked' : ''}
                               onchange="toggleEvaluationMethod()"
                               class="h-4 w-4 text-[#009DE8] border-gray-300 focus:ring-[#009DE8]">
                        <span class="ml-2 text-sm text-gray-700">Pass/Fail 방식</span>
                    </label>
                </div>
            </div>
            
            <div id="score-section" ${item.evaluationType === 'passfail' ? 'style="display:none"' : ''}>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">총점 <span class="text-red-600">*</span></label>
                    <input type="number" id="eval-total-score" value="${item.totalScore || 100}" 
                           placeholder="100"
                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">평가 항목 <span class="text-red-600">*</span></label>
                
                <div id="evaluation-items" class="space-y-2 mb-3">
                    ${item.items && item.items.length > 0 ? 
                        item.items.map((itm, idx) => renderEvaluationItem(itm, idx, item.evaluationType !== 'passfail')).join('') :
                        renderEvaluationItem({ name: '', score: 0 }, 0, item.evaluationType !== 'passfail')
                    }
                </div>
                
                <button type="button" onclick="addEvaluationItem()" 
                        class="w-full border-2 border-dashed border-gray-300 rounded-md py-2 text-sm text-gray-600 hover:border-[#009DE8] hover:text-[#009DE8] transition-colors">
                    + 평가 항목 추가
                </button>
                
                <div id="score-summary" class="mt-3 text-sm text-gray-600" ${item.evaluationType === 'passfail' ? 'style="display:none"' : ''}>
                    총 배점: <span id="current-total" class="font-bold text-[#009DE8]">0</span>점 / 
                    <span id="target-total">${item.totalScore || 100}</span>점
                </div>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div class="flex">
                    <svg class="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="text-sm text-yellow-700">
                        <p class="font-medium">배점 방식 선택 시:</p>
                        <p class="mt-1">모든 항목의 배점 합계가 총점과 일치해야 저장됩니다.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    openModal(isEdit ? '평가 기준 수정' : '평가 기준 추가', content, '저장', () => {
        const name = document.getElementById('eval-name').value.trim();
        const type = document.getElementById('eval-type').value;
        
        if (!name || !type) {
            showAlert('필수 항목을 모두 입력해주세요.');
            return;
        }
        
        const evaluationType = document.querySelector('input[name="eval-method"]:checked').value;
        const items = getEvaluationItems();
        
        if (items.length === 0) {
            showAlert('최소 1개 이상의 평가 항목을 추가해주세요.');
            return;
        }
        
        // 배점 방식일 경우 검증
        if (evaluationType === 'score') {
            const totalScore = parseInt(document.getElementById('eval-total-score').value) || 100;
            const currentTotal = items.reduce((sum, item) => sum + (parseInt(item.score) || 0), 0);
            
            if (currentTotal !== totalScore) {
                showAlert(`배점 합계(${currentTotal}점)가 총점(${totalScore}점)과 일치하지 않습니다.`);
                return;
            }
        }
        
        const newItem = {
            id: isEdit ? id : appData.evaluationCriteria.length + 1,
            name: name,
            type: type,
            evaluationType: evaluationType,
            totalScore: evaluationType === 'score' ? parseInt(document.getElementById('eval-total-score').value) : null,
            items: items
        };
        
        if (isEdit) {
            const index = appData.evaluationCriteria.findIndex(e => e.id === id);
            appData.evaluationCriteria[index] = newItem;
        } else {
            appData.evaluationCriteria.push(newItem);
        }
        
        closeModal();
        showAlert(`평가 기준이 ${isEdit ? '수정' : '추가'}되었습니다.`);
        switchView('evaluationCriteria');
    });
    
    // 배점 합계 업데이트
    setTimeout(updateScoreTotal, 100);
}

function renderEvaluationItem(item, index, showScore = true) {
    return `
        <div class="evaluation-item flex gap-2 items-start bg-gray-50 p-3 rounded-md" data-index="${index}">
            <div class="flex-1">
                <input type="text" 
                       class="item-name w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]" 
                       placeholder="평가 항목명 (예: 연구 주제의 적절성)"
                       value="${item.name || item}"
                       onchange="updateScoreTotal()">
            </div>
            ${showScore ? `
            <div class="w-24">
                <input type="number" 
                       class="item-score w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]" 
                       placeholder="배점"
                       value="${item.score || 0}"
                       min="0"
                       onchange="updateScoreTotal()">
            </div>
            ` : ''}
            <button type="button" onclick="removeEvaluationItem(${index})" 
                    class="text-red-600 hover:text-red-800 p-2 mt-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
}

function toggleEvaluationMethod() {
    const method = document.querySelector('input[name="eval-method"]:checked').value;
    const scoreSection = document.getElementById('score-section');
    const scoreSummary = document.getElementById('score-summary');
    const showScore = method === 'score';
    
    scoreSection.style.display = showScore ? 'block' : 'none';
    scoreSummary.style.display = showScore ? 'block' : 'none';
    
    // 기존 항목들의 배점 입력 필드 토글
    const items = document.querySelectorAll('.evaluation-item');
    items.forEach((item, index) => {
        const itemData = {
            name: item.querySelector('.item-name').value,
            score: showScore ? item.querySelector('.item-score')?.value || 0 : 0
        };
        item.outerHTML = renderEvaluationItem(itemData, index, showScore);
    });
    
    updateScoreTotal();
}

function addEvaluationItem() {
    const container = document.getElementById('evaluation-items');
    const currentCount = container.querySelectorAll('.evaluation-item').length;
    const method = document.querySelector('input[name="eval-method"]:checked').value;
    const showScore = method === 'score';
    
    const newItemHTML = renderEvaluationItem({ name: '', score: 0 }, currentCount, showScore);
    container.insertAdjacentHTML('beforeend', newItemHTML);
    
    updateScoreTotal();
}

function removeEvaluationItem(index) {
    const container = document.getElementById('evaluation-items');
    const items = container.querySelectorAll('.evaluation-item');
    
    if (items.length <= 1) {
        showAlert('최소 1개 이상의 평가 항목이 필요합니다.');
        return;
    }
    
    if (items[index]) {
        items[index].remove();
        reorderEvaluationItems();
        updateScoreTotal();
    }
}

function reorderEvaluationItems() {
    const container = document.getElementById('evaluation-items');
    const items = container.querySelectorAll('.evaluation-item');
    items.forEach((item, index) => {
        item.dataset.index = index;
    });
}

function getEvaluationItems() {
    const container = document.getElementById('evaluation-items');
    const items = container.querySelectorAll('.evaluation-item');
    const method = document.querySelector('input[name="eval-method"]:checked').value;
    const result = [];
    
    items.forEach(item => {
        const name = item.querySelector('.item-name').value.trim();
        if (name) {
            if (method === 'score') {
                const score = parseInt(item.querySelector('.item-score')?.value) || 0;
                result.push({ name, score });
            } else {
                result.push(name);
            }
        }
    });
    
    return result;
}

function updateScoreTotal() {
    const method = document.querySelector('input[name="eval-method"]:checked')?.value;
    if (method !== 'score') return;
    
    const items = document.querySelectorAll('.item-score');
    let total = 0;
    items.forEach(input => {
        total += parseInt(input.value) || 0;
    });
    
    const currentTotalSpan = document.getElementById('current-total');
    const targetTotal = parseInt(document.getElementById('eval-total-score')?.value) || 100;
    
    if (currentTotalSpan) {
        currentTotalSpan.textContent = total;
        currentTotalSpan.className = total === targetTotal ? 
            'font-bold text-green-600' : 
            'font-bold text-red-600';
    }
    
    const targetTotalSpan = document.getElementById('target-total');
    if (targetTotalSpan) {
        targetTotalSpan.textContent = targetTotal;
    }
}

function editEvaluation(id) {
    openEvaluationModal(id);
}

function deleteEvaluation(id) {
    showConfirm('이 평가 기준을 삭제하시겠습니까?', () => {
        appData.evaluationCriteria = appData.evaluationCriteria.filter(e => e.id !== id);
        showAlert('평가 기준이 삭제되었습니다.');
        switchView('evaluationCriteria');
    });
}

// ========== 지도단계 유형관리 CRUD ==========

function openStepTypeModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? mockStepTypes.find(t => t.id === id) : {};

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">단계명 <span class="text-red-600">*</span></label>
                <input type="text" id="steptype-name" value="${item.name || ''}"
                       placeholder="예: 본심사, 예비심사, 연구계획서 제출"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">유형 <span class="text-red-600">*</span></label>
                <div class="space-y-2">
                    <label class="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100">
                        <input type="radio" name="steptype-type" id="steptype-submission" value="submission"
                               ${!item.type || item.type === 'submission' ? 'checked' : ''}
                               class="h-4 w-4 text-[#009DE8] border-gray-300">
                        <div class="ml-3">
                            <p class="font-medium text-gray-900">제출</p>
                            <p class="text-xs text-gray-600">학생이 문서를 제출하는 단계 (심사 없음)</p>
                        </div>
                    </label>

                    <label class="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100">
                        <input type="radio" name="steptype-type" id="steptype-review" value="review"
                               ${item.type === 'review' ? 'checked' : ''}
                               class="h-4 w-4 text-[#009DE8] border-gray-300"
                               onchange="toggleEvaluationTemplate()">
                        <div class="ml-3">
                            <p class="font-medium text-gray-900">심사</p>
                            <p class="text-xs text-gray-600">심사위원이 평가하는 단계 (평가표 필요)</p>
                        </div>
                    </label>
                </div>
            </div>

            <div id="evaluation-template-section" style="display: ${item.type === 'review' ? 'block' : 'none'};">
                <label class="block text-sm font-medium text-gray-700 mb-1">평가표 선택</label>
                <select id="steptype-evaluation" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                    <option value="">선택 안 함</option>
                    ${mockEvaluationTemplates.map(template => `
                        <option value="${template.id}" ${item.evaluationTemplateId === template.id ? 'selected' : ''}>
                            ${template.name}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">요구 사항</label>
                <div class="space-y-2">
                    <label class="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" id="steptype-document"
                               ${item.requiresDocument ? 'checked' : ''}
                               class="h-4 w-4 text-[#009DE8] rounded border-gray-300">
                        <div class="ml-3">
                            <p class="font-medium text-gray-900">문서 제출 필요</p>
                            <p class="text-xs text-gray-600">학생이 문서를 제출해야 하는 단계입니다</p>
                        </div>
                    </label>

                    <label class="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" id="steptype-presentation"
                               ${item.requiresPresentation ? 'checked' : ''}
                               class="h-4 w-4 text-[#009DE8] rounded border-gray-300">
                        <div class="ml-3">
                            <p class="font-medium text-gray-900">발표 필요</p>
                            <p class="text-xs text-gray-600">학생이 발표를 해야 하는 단계입니다</p>
                        </div>
                    </label>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">설명 (선택)</label>
                <textarea id="steptype-description" rows="3"
                          placeholder="이 단계에 대한 설명을 입력하세요"
                          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">${item.description || ''}</textarea>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div class="flex">
                    <svg class="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="text-sm text-yellow-700">
                        <p class="font-medium">재사용 가능한 블록</p>
                        <p class="mt-1">이 단계 유형은 여러 워크플로우에서 재사용할 수 있습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal(isEdit ? '단계 유형 수정' : '단계 유형 추가', content, '저장', () => {
        const name = document.getElementById('steptype-name').value.trim();
        const type = document.querySelector('input[name="steptype-type"]:checked').value;

        if (!name) {
            showAlert('단계명을 입력해주세요.');
            return;
        }

        const newItem = {
            id: isEdit ? id : 'ST' + String(mockStepTypes.length + 1).padStart(3, '0'),
            name: name,
            type: type,
            requiresDocument: document.getElementById('steptype-document').checked,
            requiresPresentation: document.getElementById('steptype-presentation').checked,
            evaluationTemplateId: type === 'review' ? document.getElementById('steptype-evaluation').value || null : null,
            description: document.getElementById('steptype-description').value.trim(),
            createdDate: isEdit ? item.createdDate : new Date().toISOString().split('T')[0]
        };

        if (isEdit) {
            const index = mockStepTypes.findIndex(t => t.id === id);
            mockStepTypes[index] = newItem;
        } else {
            mockStepTypes.push(newItem);
        }

        closeModal();
        showAlert(`단계 유형이 ${isEdit ? '수정' : '추가'}되었습니다.`);
        switchView('typeManagement');
    });

    // Add radio button change listener after modal opens
    setTimeout(() => {
        document.getElementById('steptype-submission').addEventListener('change', toggleEvaluationTemplate);
        document.getElementById('steptype-review').addEventListener('change', toggleEvaluationTemplate);
    }, 100);
}

function toggleEvaluationTemplate() {
    const reviewSelected = document.getElementById('steptype-review').checked;
    const section = document.getElementById('evaluation-template-section');
    section.style.display = reviewSelected ? 'block' : 'none';
}

function editStepType(id) {
    openStepTypeModal(id);
}

function deleteStepType(id) {
    showConfirm('이 단계 유형을 삭제하시겠습니까?\n\n주의: 이미 사용 중인 워크플로우에 영향을 줄 수 있습니다.', () => {
        const index = mockStepTypes.findIndex(t => t.id === id);
        if (index !== -1) {
            mockStepTypes.splice(index, 1);
            showAlert('단계 유형이 삭제되었습니다.');
            switchView('typeManagement');
        }
    });
}

// ========== 워크플로우 조립 관리 CRUD (구버전 - 주석 처리) ==========
// 페이지 전환 방식으로 변경되어 더 이상 사용하지 않음
// 새 함수들은 파일 하단 참조

/*
let workflowStages = []; // Temporary storage for stages being composed

function openWorkflowModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? mockThesisStages.find(s => s.id === id) : { stages: [] };

    // Initialize temporary stages
    workflowStages = isEdit ? JSON.parse(JSON.stringify(item.stages)) : [];

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">워크플로우명 <span class="text-red-600">*</span></label>
                <input type="text" id="workflow-name" value="${item.name || ''}"
                       placeholder="예: 석사 표준 과정"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">학위 유형 <span class="text-red-600">*</span></label>
                <div class="flex gap-4">
                    <label class="flex items-center">
                        <input type="radio" name="workflow-degree" value="master"
                               ${!item.degreeType || item.degreeType === 'master' ? 'checked' : ''}
                               class="h-4 w-4 text-[#009DE8] border-gray-300">
                        <span class="ml-2 text-sm text-gray-700">석사</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="workflow-degree" value="phd"
                               ${item.degreeType === 'phd' ? 'checked' : ''}
                               class="h-4 w-4 text-[#009DE8] border-gray-300">
                        <span class="ml-2 text-sm text-gray-700">박사</span>
                    </label>
                </div>
            </div>

            <div class="border-t pt-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="block text-sm font-medium text-gray-700">단계 구성 <span class="text-red-600">*</span></label>
                    <button type="button" onclick="addWorkflowStage()"
                            class="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-xs">
                        + 단계 추가
                    </button>
                </div>

                <div id="workflow-stages-list" class="space-y-2 max-h-96 overflow-y-auto">
                    ${renderWorkflowStages()}
                </div>

                ${workflowStages.length === 0 ? `
                    <div class="text-center py-8 text-gray-400">
                        <i class="fas fa-cube text-3xl mb-2"></i>
                        <p class="text-sm">단계를 추가하여 워크플로우를 구성하세요</p>
                    </div>
                ` : ''}
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div class="flex">
                    <svg class="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="text-sm text-yellow-700">
                        <p class="font-medium">레고 블록 조립</p>
                        <p class="mt-1">단계 유형(레고 블록)을 선택하여 워크플로우를 구성합니다. 같은 단계를 여러 번 사용할 수 있습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal(isEdit ? '워크플로우 수정' : '워크플로우 추가', content, '저장', () => {
        const name = document.getElementById('workflow-name').value.trim();
        const degreeType = document.querySelector('input[name="workflow-degree"]:checked').value;

        if (!name) {
            showAlert('워크플로우명을 입력해주세요.');
            return;
        }

        if (workflowStages.length === 0) {
            showAlert('최소 1개 이상의 단계를 추가해주세요.');
            return;
        }

        const newItem = {
            id: isEdit ? id : 'TS' + String(mockThesisStages.length + 1).padStart(3, '0'),
            name: name,
            degreeType: degreeType,
            stageCount: workflowStages.length,
            createdDate: isEdit ? item.createdDate : new Date().toISOString().split('T')[0],
            stages: workflowStages.map((stage, idx) => ({
                ...stage,
                order: idx + 1
            }))
        };

        if (isEdit) {
            const index = mockThesisStages.findIndex(s => s.id === id);
            mockThesisStages[index] = newItem;
        } else {
            mockThesisStages.push(newItem);
        }

        closeModal();
        showAlert(`워크플로우가 ${isEdit ? '수정' : '추가'}되었습니다.`);
        switchView('stageManagement');
    });
}

function renderWorkflowStages() {
    if (workflowStages.length === 0) return '';

    return workflowStages.map((stage, idx) => {
        const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
        const typeLabel = stepType ? (stepType.type === 'submission' ? '제출' : '심사') : '';
        const typeBgColor = stepType ? (stepType.type === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800') : 'bg-gray-100';

        return `
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                <span class="font-semibold text-gray-600 w-8">${idx + 1}.</span>
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-800">${stage.name}</span>
                        <span class="px-2 py-0.5 rounded text-xs font-medium ${typeBgColor}">${typeLabel}</span>
                        ${stage.evaluationRequired ? '<span class="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">심사</span>' : ''}
                    </div>
                    ${stepType && stepType.description ? `<p class="text-xs text-gray-500 mt-1">${stepType.description}</p>` : ''}
                </div>
                <div class="flex gap-1">
                    ${idx > 0 ? `<button type="button" onclick="moveStageUp(${idx})" class="text-blue-600 hover:underline text-xs px-2">↑</button>` : ''}
                    ${idx < workflowStages.length - 1 ? `<button type="button" onclick="moveStageDown(${idx})" class="text-blue-600 hover:underline text-xs px-2">↓</button>` : ''}
                    <button type="button" onclick="removeWorkflowStage(${idx})" class="text-red-600 hover:underline text-xs px-2">삭제</button>
                </div>
            </div>
        `;
    }).join('');
}

function addWorkflowStage() {
    const stageOptions = mockStepTypes.map(st => {
        const typeLabel = st.type === 'submission' ? '[제출]' : '[심사]';
        return `<option value="${st.id}">${typeLabel} ${st.name}</option>`;
    }).join('');

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">단계 유형 선택 <span class="text-red-600">*</span></label>
                <select id="stage-type-select" onchange="updateStagePreview()" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                    <option value="">선택하세요</option>
                    ${stageOptions}
                </select>
            </div>

            <div id="stage-preview" class="hidden bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700 mb-2">단계 미리보기</p>
                <div id="stage-preview-content"></div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p class="text-xs text-gray-600">
                    <i class="fas fa-lightbulb mr-1 text-yellow-500"></i>
                    같은 단계 유형을 여러 번 추가할 수 있습니다. (예: 예비심사 2회)
                </p>
            </div>
        </div>
    `;

    openModal('단계 추가', content, '추가', () => {
        const stepTypeId = document.getElementById('stage-type-select').value;

        if (!stepTypeId) {
            showAlert('단계 유형을 선택해주세요.');
            return;
        }

        const stepType = mockStepTypes.find(st => st.id === stepTypeId);
        if (!stepType) {
            showAlert('유효하지 않은 단계 유형입니다.');
            return;
        }

        workflowStages.push({
            stepTypeId: stepType.id,
            name: stepType.name,
            type: stepType.type,
            evaluationRequired: stepType.type === 'review'
        });

        closeModal();

        // Refresh the stages list
        document.getElementById('workflow-stages-list').innerHTML = renderWorkflowStages();
    });

    // Add the updateStagePreview function to window scope
    window.updateStagePreview = function() {
        const stepTypeId = document.getElementById('stage-type-select').value;
        const preview = document.getElementById('stage-preview');
        const previewContent = document.getElementById('stage-preview-content');

        if (!stepTypeId) {
            preview.classList.add('hidden');
            return;
        }

        const stepType = mockStepTypes.find(st => st.id === stepTypeId);
        if (!stepType) return;

        const typeLabel = stepType.type === 'submission' ? '제출' : '심사';
        const typeBgColor = stepType.type === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

        previewContent.innerHTML = `
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-800">${stepType.name}</span>
                    <span class="px-2 py-0.5 rounded text-xs font-medium ${typeBgColor}">${typeLabel}</span>
                </div>
                ${stepType.description ? `<p class="text-xs text-gray-600">${stepType.description}</p>` : ''}
                <div class="flex gap-3 text-xs">
                    ${stepType.requiresDocument ? '<span class="text-green-600">✓ 문서 제출</span>' : '<span class="text-gray-400">✗ 문서 제출</span>'}
                    ${stepType.requiresPresentation ? '<span class="text-green-600">✓ 발표</span>' : '<span class="text-gray-400">✗ 발표</span>'}
                    ${stepType.evaluationTemplateId ? '<span class="text-orange-600">✓ 평가표</span>' : ''}
                </div>
            </div>
        `;
        preview.classList.remove('hidden');
    };
}

function removeWorkflowStage(index) {
    workflowStages.splice(index, 1);
    document.getElementById('workflow-stages-list').innerHTML = renderWorkflowStages();
}

function moveStageUp(index) {
    if (index === 0) return;
    [workflowStages[index - 1], workflowStages[index]] = [workflowStages[index], workflowStages[index - 1]];
    document.getElementById('workflow-stages-list').innerHTML = renderWorkflowStages();
}

function moveStageDown(index) {
    if (index === workflowStages.length - 1) return;
    [workflowStages[index], workflowStages[index + 1]] = [workflowStages[index + 1], workflowStages[index]];
    document.getElementById('workflow-stages-list').innerHTML = renderWorkflowStages();
}

function viewWorkflowDetail(id) {
    const workflow = mockThesisStages.find(s => s.id === id);
    if (!workflow) {
        showAlert('워크플로우를 찾을 수 없습니다.');
        return;
    }

    const degreeLabel = workflow.degreeType === 'master' ? '석사' : '박사';
    const evaluationCount = workflow.stages.filter(s => s.evaluationRequired).length;

    const content = `
        <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-xs text-gray-500">워크플로우명</p>
                        <p class="font-medium text-gray-800">${workflow.name}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">학위 유형</p>
                        <p class="font-medium text-gray-800">${degreeLabel}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">총 단계 수</p>
                        <p class="font-medium text-blue-600">${workflow.stageCount}단계</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">심사 단계</p>
                        <p class="font-medium text-green-600">${evaluationCount}개</p>
                    </div>
                </div>
            </div>

            <div>
                <p class="text-sm font-medium text-gray-700 mb-3">단계 구성</p>
                <div class="space-y-2">
                    ${workflow.stages.map(stage => {
                        const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
                        const typeLabel = stepType ? (stepType.type === 'submission' ? '제출' : '심사') : '';
                        const typeBgColor = stepType ? (stepType.type === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800') : 'bg-gray-100';

                        return `
                            <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <span class="font-semibold text-gray-600 w-6">${stage.order}.</span>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="font-medium text-gray-800">${stage.name}</span>
                                        <span class="px-2 py-0.5 rounded text-xs font-medium ${typeBgColor}">${typeLabel}</span>
                                        ${stage.evaluationRequired ? '<span class="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">심사 필요</span>' : ''}
                                    </div>
                                    ${stepType && stepType.description ? `<p class="text-xs text-gray-500">${stepType.description}</p>` : ''}
                                    ${stepType ? `
                                        <div class="flex gap-3 mt-2 text-xs">
                                            ${stepType.requiresDocument ? '<span class="text-green-600">✓ 문서 제출</span>' : ''}
                                            ${stepType.requiresPresentation ? '<span class="text-green-600">✓ 발표</span>' : ''}
                                            ${stepType.evaluationTemplateId ? `<span class="text-orange-600">✓ ${mockEvaluationTemplates.find(t => t.id === stepType.evaluationTemplateId)?.name || '평가표'}</span>` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    openModal('워크플로우 상세보기', content, '닫기', () => closeModal());
}

function editWorkflow(id) {
    openWorkflowModal(id);
}
*/

// deleteWorkflow는 페이지 전환 방식에서도 그대로 사용
function deleteWorkflow(id) {
    showConfirm('이 워크플로우를 삭제하시겠습니까?', () => {
        const index = mockThesisStages.findIndex(s => s.id === id);
        if (index !== -1) {
            mockThesisStages.splice(index, 1);
            showAlert('워크플로우가 삭제되었습니다.');
            switchView('stageManagement');
        }
    });
}

// ========== 평가 기준 관리 함수 ==========

function viewEvaluationDetail(id) {
    const criteria = appData.evaluationCriteria.find(c => c.id === id);
    if (!criteria) {
        showAlert('평가표를 찾을 수 없습니다.');
        return;
    }

    const evalType = criteria.evaluationType || 'score';
    const evalTypeLabel = evalType === 'score' ? '점수형' : evalType === 'grade' ? '등급형' : 'Pass/Fail형';
    const evalTypeColor = evalType === 'score' ? 'bg-blue-100 text-blue-800' :
                          evalType === 'grade' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800';

    const content = `
        <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-medium text-gray-500">평가표명</label>
                        <p class="text-sm font-bold text-gray-800 mt-1">${criteria.name}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">평가표 유형</label>
                        <p class="mt-1">
                            <span class="px-2 py-1 text-xs rounded-full ${evalTypeColor}">${evalTypeLabel}</span>
                        </p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">생성일</label>
                        <p class="text-sm text-gray-800 mt-1">${criteria.createdDate}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">평가 항목 수</label>
                        <p class="text-sm text-gray-800 mt-1">${criteria.itemCount}개</p>
                    </div>
                    <div class="col-span-2">
                        <label class="text-xs font-medium text-gray-500">설명</label>
                        <p class="text-sm text-gray-800 mt-1">${criteria.description}</p>
                    </div>
                </div>
            </div>

            <!-- 통과 기준 -->
            <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <h4 class="font-bold text-yellow-900 mb-3">통과 기준</h4>
                ${evalType === 'score' ? `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">통과 점수</label>
                            <input type="number"
                                   id="pass-score-input"
                                   value="${criteria.passCriteria?.passScore || 70}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                   placeholder="예: 70">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">통과 기준 설명</label>
                            <input type="text"
                                   id="pass-description-input"
                                   value="${criteria.passCriteria?.description || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                   placeholder="예: 총점 70점 이상 합격">
                        </div>
                    </div>
                ` : evalType === 'grade' ? `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">최소 합격 등급</label>
                            <select id="min-grade-input"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option value="A" ${criteria.passCriteria?.minGrade === 'A' ? 'selected' : ''}>A (최우수)</option>
                                <option value="B" ${criteria.passCriteria?.minGrade === 'B' ? 'selected' : ''}>B (우수)</option>
                                <option value="C" ${criteria.passCriteria?.minGrade === 'C' ? 'selected' : ''}>C (보통)</option>
                                <option value="D" ${criteria.passCriteria?.minGrade === 'D' ? 'selected' : ''}>D (미흡)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">통과 기준 설명</label>
                            <input type="text"
                                   id="pass-description-input"
                                   value="${criteria.passCriteria?.description || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                   placeholder="예: C등급 이상 합격">
                        </div>
                    </div>
                ` : `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">통과 요구사항</label>
                        <div class="flex items-center gap-2">
                            <input type="checkbox"
                                   id="pass-required-input"
                                   ${criteria.passCriteria?.passRequired !== false ? 'checked' : ''}
                                   class="rounded border-gray-300">
                            <label for="pass-required-input" class="text-sm text-gray-700">모든 항목 Pass 필요</label>
                        </div>
                        <input type="text"
                               id="pass-description-input"
                               value="${criteria.passCriteria?.description || ''}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                               placeholder="예: 모든 항목에서 Pass를 받아야 합격">
                    </div>
                `}
                <div class="mt-3">
                    <button onclick="savePassCriteria(${id})"
                            class="text-sm bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                        통과 기준 저장
                    </button>
                </div>
            </div>

            <div>
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-gray-800">평가 항목 (총 ${criteria.itemCount}개)</h4>
                    <button onclick="addEvaluationItem(${id})"
                            class="text-sm bg-[#009DE8] text-white px-3 py-1 rounded hover:bg-[#0087c9]">
                        + 항목 추가
                    </button>
                </div>
                <div class="space-y-2">
                    ${criteria.items.map((item, idx) => `
                        <div class="bg-white border border-gray-200 rounded-lg p-3">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex items-start gap-3 flex-1">
                                    <span class="text-sm font-bold text-gray-400">${idx + 1}.</span>
                                    <div class="flex-1">
                                        <p class="text-sm font-bold text-gray-800">${item.name}</p>
                                        ${evalType === 'score' ?
                                            `<p class="text-xs text-gray-600 mt-1">${item.description || ''}</p>` :
                                          evalType === 'grade' ?
                                            `<div class="mt-2 bg-purple-50 border border-purple-200 rounded p-2">
                                                <p class="text-xs text-purple-900 font-medium mb-1">등급 기준:</p>
                                                <p class="text-xs text-gray-700 whitespace-pre-line">${item.description || ''}</p>
                                            </div>` :
                                            `<div class="mt-2 bg-gray-50 border border-gray-300 rounded p-2">
                                                <p class="text-xs text-gray-900 font-medium mb-1">판단 기준:</p>
                                                <p class="text-xs text-gray-700">${item.description || ''}</p>
                                            </div>`
                                        }
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    ${evalType === 'score' ?
                                        `<span class="text-lg font-bold text-[#009DE8]">${item.score || 0}점</span>` :
                                      evalType === 'grade' ?
                                        `<span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">A/B/C/D/F</span>` :
                                        `<span class="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">Pass/Fail</span>`
                                    }
                                    <div class="flex gap-1">
                                        <button onclick="editEvaluationItem(${id}, ${item.id})"
                                                class="text-xs text-blue-600 hover:underline">
                                            수정
                                        </button>
                                        <button onclick="deleteEvaluationItem(${id}, ${item.id})"
                                                class="text-xs text-red-600 hover:underline">
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${evalType === 'score' && criteria.totalScore !== null && criteria.totalScore !== undefined ? `
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-gray-700">총점</span>
                            <span class="text-2xl font-bold text-[#009DE8]">${criteria.totalScore}점</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    openModal(`${criteria.name} - 상세`, content, '닫기', closeModal, true);
}

function addEvaluationCriteria() {
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    평가표명 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="criteria-name"
                       placeholder="예: 일반 연구계획서 평가표"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    평가표 유형 <span class="text-red-600">*</span>
                </label>
                <select id="criteria-evaluation-type"
                        class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="score">점수형 - 점수로 평가 (예: 100점 만점)</option>
                    <option value="grade">등급형 - 등급으로 평가 (예: A, B, C, D, F)</option>
                    <option value="passfail">Pass/Fail형 - 합격/불합격으로 평가</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                    선택한 유형에 따라 평가 항목의 입력 방식이 달라집니다.
                </p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    설명 <span class="text-red-600">*</span>
                </label>
                <textarea id="criteria-description"
                          placeholder="이 평가표의 용도와 특징을 설명해주세요"
                          rows="3"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded p-3">
                <p class="text-sm text-blue-800">
                    <i class="fas fa-info-circle mr-2"></i>
                    평가표 생성 후 평가 항목을 추가할 수 있습니다.
                </p>
            </div>
        </div>
    `;

    openModal('새 평가표 추가', content, '저장', () => {
        const name = document.getElementById('criteria-name')?.value.trim();
        const description = document.getElementById('criteria-description')?.value.trim();
        const evaluationType = document.getElementById('criteria-evaluation-type')?.value;

        if (!name) {
            showAlert('평가표명을 입력하세요.');
            return;
        }

        if (!description) {
            showAlert('설명을 입력하세요.');
            return;
        }

        const newCriteria = {
            id: Date.now(),
            name: name,
            description: description,
            evaluationType: evaluationType,
            itemCount: 0,
            totalScore: evaluationType === 'score' ? 0 : null,
            createdDate: new Date().toISOString().split('T')[0],
            items: [],
            passCriteria: evaluationType === 'passfail' ? { type: 'simple', passRequired: true } :
                         evaluationType === 'grade' ? { type: 'grade', minGrade: 'C' } :
                         { type: 'score', passScore: 70 }
        };

        appData.evaluationCriteria.push(newCriteria);

        closeModal();
        showAlert('평가표가 추가되었습니다. 이제 평가 항목을 추가하세요.');
        switchView('evaluationCriteria');
    });
}

function copyEvaluationCriteria(id) {
    const criteria = appData.evaluationCriteria.find(c => c.id === id);
    if (!criteria) {
        showAlert('평가표를 찾을 수 없습니다.');
        return;
    }
    
    const content = `
        <div class="space-y-4">
            <div class="bg-gray-50 rounded p-3 mb-4">
                <p class="text-sm text-gray-700">
                    <strong>${criteria.name}</strong>을(를) 복사합니다.
                </p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    새 평가표명 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="copy-criteria-name" 
                       value="${criteria.name} (복사본)"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    설명
                </label>
                <textarea id="copy-criteria-description" 
                          rows="3"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm">${criteria.description}</textarea>
            </div>
        </div>
    `;
    
    openModal('평가표 복사', content, '복사', () => {
        const name = document.getElementById('copy-criteria-name')?.value.trim();
        const description = document.getElementById('copy-criteria-description')?.value.trim();
        
        if (!name) {
            showAlert('평가표명을 입력하세요.');
            return;
        }
        
        const newCriteria = {
            ...criteria,
            id: Date.now(),
            name: name,
            description: description,
            createdDate: new Date().toISOString().split('T')[0],
            items: criteria.items.map(item => ({...item, id: Date.now() + Math.random()}))
        };
        
        appData.evaluationCriteria.push(newCriteria);
        
        closeModal();
        showAlert('평가표가 복사되었습니다.');
        switchView('evaluationCriteria');
    });
}

function deleteEvaluationCriteria(id) {
    showConfirm('이 평가표를 삭제하시겠습니까?\n\n주의: 이미 사용 중인 프로세스에 영향을 줄 수 있습니다.', () => {
        appData.evaluationCriteria = appData.evaluationCriteria.filter(c => c.id !== id);
        showAlert('평가표가 삭제되었습니다.');
        switchView('evaluationCriteria');
    });
}

function addEvaluationItem(criteriaId) {
    const criteria = appData.evaluationCriteria.find(c => c.id === criteriaId);
    if (!criteria) {
        showAlert('평가표를 찾을 수 없습니다.');
        return;
    }

    const evalType = criteria.evaluationType || 'score';

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    평가 항목명 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="item-name"
                       placeholder="예: 연구주제 적절성"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            ${evalType === 'score' ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        배점 <span class="text-red-600">*</span>
                    </label>
                    <input type="number" id="item-score"
                           placeholder="20"
                           min="0"
                           max="100"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                </div>
            ` : ''}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    ${evalType === 'grade' ? '등급 기준 설명' : evalType === 'passfail' ? '판단 기준 설명' : '설명'}
                    ${evalType !== 'score' ? '<span class="text-red-600">*</span>' : ''}
                </label>
                <textarea id="item-description"
                          placeholder="${evalType === 'grade' ?
                              'A: 매우 우수함\nB: 우수함\nC: 보통\nD: 미흡함\nF: 불합격' :
                            evalType === 'passfail' ?
                              'Pass/Fail을 판단하는 구체적인 기준을 작성해주세요.\n예: 연구 윤리 지침을 모두 준수하고 필수 서류가 완비된 경우 Pass' :
                              '이 평가 항목에 대한 설명'}"
                          rows="${evalType === 'grade' ? '5' : '3'}"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
            ${evalType === 'grade' ? `
                <div class="bg-purple-50 border border-purple-200 rounded p-3">
                    <p class="text-sm font-bold text-purple-900 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>등급형 평가 안내
                    </p>
                    <ul class="text-xs text-purple-800 space-y-1 ml-5 list-disc">
                        <li>교수가 평가 시 A, B, C, D, F 중 하나를 선택합니다.</li>
                        <li>각 등급의 의미를 명확하게 설명해주세요.</li>
                        <li>예시처럼 한 줄에 하나씩 작성하면 읽기 쉽습니다.</li>
                    </ul>
                </div>
            ` : evalType === 'passfail' ? `
                <div class="bg-gray-50 border border-gray-300 rounded p-3">
                    <p class="text-sm font-bold text-gray-900 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>Pass/Fail형 평가 안내
                    </p>
                    <ul class="text-xs text-gray-700 space-y-1 ml-5 list-disc">
                        <li>교수가 평가 시 Pass(합격) 또는 Fail(불합격)을 선택합니다.</li>
                        <li>Pass로 판단하는 명확한 기준을 작성해주세요.</li>
                        <li>정성적 평가 또는 체크리스트 방식으로 활용됩니다.</li>
                    </ul>
                </div>
            ` : ''}
        </div>
    `;

    openModal('평가 항목 추가', content, '추가', () => {
        const name = document.getElementById('item-name')?.value.trim();
        const description = document.getElementById('item-description')?.value.trim();

        if (!name) {
            showAlert('평가 항목명을 입력하세요.');
            return;
        }

        // 등급형과 Pass/Fail형은 설명이 필수
        if ((evalType === 'grade' || evalType === 'passfail') && !description) {
            showAlert(evalType === 'grade' ? '등급 기준 설명을 입력하세요.' : '판단 기준 설명을 입력하세요.');
            return;
        }

        const newItem = {
            id: Date.now(),
            name: name,
            description: description || ''
        };

        // Only add score for score-type evaluations
        if (evalType === 'score') {
            const score = parseInt(document.getElementById('item-score')?.value);
            if (!score || score <= 0) {
                showAlert('배점을 입력하세요.');
                return;
            }
            newItem.score = score;
        }

        criteria.items.push(newItem);
        criteria.itemCount = criteria.items.length;

        // Only calculate totalScore for score-type evaluations
        if (evalType === 'score') {
            criteria.totalScore = criteria.items.reduce((sum, item) => sum + (item.score || 0), 0);
        }

        closeModal();
        showAlert('평가 항목이 추가되었습니다.');
        viewEvaluationDetail(criteriaId);
    });
}

function editEvaluationItem(criteriaId, itemId) {
    const criteria = appData.evaluationCriteria.find(c => c.id === criteriaId);
    if (!criteria) return;

    const item = criteria.items.find(i => i.id === itemId);
    if (!item) return;

    const evalType = criteria.evaluationType || 'score';

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    평가 항목명 <span class="text-red-600">*</span>
                </label>
                <input type="text" id="item-name"
                       value="${item.name}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            ${evalType === 'score' ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        배점 <span class="text-red-600">*</span>
                    </label>
                    <input type="number" id="item-score"
                           value="${item.score || 0}"
                           min="0"
                           max="100"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                </div>
            ` : ''}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    ${evalType === 'grade' ? '등급 기준 설명' : evalType === 'passfail' ? '판단 기준 설명' : '설명'}
                    ${evalType !== 'score' ? '<span class="text-red-600">*</span>' : ''}
                </label>
                <textarea id="item-description"
                          rows="${evalType === 'grade' ? '5' : '3'}"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm">${item.description || ''}</textarea>
            </div>
            ${evalType === 'grade' ? `
                <div class="bg-purple-50 border border-purple-200 rounded p-3">
                    <p class="text-sm font-bold text-purple-900 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>등급형 평가 안내
                    </p>
                    <ul class="text-xs text-purple-800 space-y-1 ml-5 list-disc">
                        <li>교수가 평가 시 A, B, C, D, F 중 하나를 선택합니다.</li>
                        <li>각 등급의 의미를 명확하게 설명해주세요.</li>
                        <li>예시처럼 한 줄에 하나씩 작성하면 읽기 쉽습니다.</li>
                    </ul>
                </div>
            ` : evalType === 'passfail' ? `
                <div class="bg-gray-50 border border-gray-300 rounded p-3">
                    <p class="text-sm font-bold text-gray-900 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>Pass/Fail형 평가 안내
                    </p>
                    <ul class="text-xs text-gray-700 space-y-1 ml-5 list-disc">
                        <li>교수가 평가 시 Pass(합격) 또는 Fail(불합격)을 선택합니다.</li>
                        <li>Pass로 판단하는 명확한 기준을 작성해주세요.</li>
                        <li>정성적 평가 또는 체크리스트 방식으로 활용됩니다.</li>
                    </ul>
                </div>
            ` : ''}
        </div>
    `;

    openModal('평가 항목 수정', content, '저장', () => {
        const name = document.getElementById('item-name')?.value.trim();
        const description = document.getElementById('item-description')?.value.trim();

        if (!name) {
            showAlert('평가 항목명을 입력하세요.');
            return;
        }

        // 등급형과 Pass/Fail형은 설명이 필수
        if ((evalType === 'grade' || evalType === 'passfail') && !description) {
            showAlert(evalType === 'grade' ? '등급 기준 설명을 입력하세요.' : '판단 기준 설명을 입력하세요.');
            return;
        }

        item.name = name;
        item.description = description;

        // Only update score for score-type evaluations
        if (evalType === 'score') {
            const score = parseInt(document.getElementById('item-score')?.value);
            if (!score || score <= 0) {
                showAlert('배점을 입력하세요.');
                return;
            }
            item.score = score;
            criteria.totalScore = criteria.items.reduce((sum, item) => sum + (item.score || 0), 0);
        }

        closeModal();
        showAlert('평가 항목이 수정되었습니다.');
        viewEvaluationDetail(criteriaId);
    });
}

function deleteEvaluationItem(criteriaId, itemId) {
    showConfirm('이 평가 항목을 삭제하시겠습니까?', () => {
        const criteria = appData.evaluationCriteria.find(c => c.id === criteriaId);
        if (!criteria) return;

        criteria.items = criteria.items.filter(i => i.id !== itemId);
        criteria.itemCount = criteria.items.length;

        // Only calculate totalScore for score-type evaluations
        if (criteria.evaluationType === 'score') {
            criteria.totalScore = criteria.items.reduce((sum, item) => sum + (item.score || 0), 0);
        }

        showAlert('평가 항목이 삭제되었습니다.');
        viewEvaluationDetail(criteriaId);
    });
}

function savePassCriteria(criteriaId) {
    const criteria = appData.evaluationCriteria.find(c => c.id === criteriaId);
    if (!criteria) {
        showAlert('평가표를 찾을 수 없습니다.');
        return;
    }

    const evalType = criteria.evaluationType || 'score';

    if (evalType === 'score') {
        const passScore = parseInt(document.getElementById('pass-score-input')?.value);
        const description = document.getElementById('pass-description-input')?.value.trim();

        if (!passScore || passScore < 0) {
            showAlert('통과 점수를 입력하세요.');
            return;
        }

        criteria.passCriteria = {
            type: 'score',
            passScore: passScore,
            description: description
        };
    } else if (evalType === 'grade') {
        const minGrade = document.getElementById('min-grade-input')?.value;
        const description = document.getElementById('pass-description-input')?.value.trim();

        criteria.passCriteria = {
            type: 'grade',
            minGrade: minGrade,
            description: description
        };
    } else {
        const passRequired = document.getElementById('pass-required-input')?.checked;
        const description = document.getElementById('pass-description-input')?.value.trim();

        criteria.passCriteria = {
            type: 'simple',
            passRequired: passRequired,
            description: description
        };
    }

    showAlert('통과 기준이 저장되었습니다.');
    viewEvaluationDetail(criteriaId);
}

// 평가표 선택 토글 (기존 평가 기준 관리용)
function toggleEvaluationSelect() {
    const hasEvaluation = document.querySelector('input[name="has-evaluation"]:checked')?.value === 'true';
    const container = document.getElementById('evaluation-select-container');
    if (container) {
        container.style.display = hasEvaluation ? 'block' : 'none';
    }
}


// ========== 심사위원별 평가 조회 (관리자용) ==========
function viewCommitteeEvaluations(submissionId) {
    // 해당 제출물의 심사 배정 및 평가 정보 가져오기
    const assignment = getReviewAssignmentBySubmissionId(submissionId);
    
    if (!assignment) {
        showAlert('심사 배정 정보를 찾을 수 없습니다.');
        return;
    }
    
    // 모달 타이틀
    const title = `심사 상세 조회 - ` + assignment.studentName + ` (` + assignment.thesisTitle + `)`;
    
    // 논문 정보 섹션
    let content = `
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-bold text-gray-800 mb-3">논문 정보</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
                <div><span class="text-gray-600">대학원:</span> <span class="font-medium">` + (assignment.graduate || '일반대학원') + `</span></div>
                <div><span class="text-gray-600">전공/학과:</span> <span class="font-medium">` + assignment.major + `</span></div>
                <div><span class="text-gray-600">학위과정:</span> <span class="font-medium">` + assignment.degree + `</span></div>
                <div><span class="text-gray-600">학번:</span> <span class="font-medium">` + assignment.studentId + `</span></div>
                <div><span class="text-gray-600">학생명:</span> <span class="font-medium">` + assignment.studentName + `</span></div>
                <div><span class="text-gray-600">지도교수:</span> <span class="font-medium">` + assignment.advisor + `</span></div>
            </div>
            <div class="mt-3">
                <div><span class="text-gray-600">논문제목:</span> <span class="font-medium">` + (assignment.thesisTitle || '미정') + `</span></div>
            </div>
        </div>
    `;
    
    // 심사위원회 정보
    if (assignment.committee && assignment.committee.length > 0) {
        content += `
            <div class="mb-6">
                <h4 class="font-bold text-gray-800 mb-3">심사위원회</h4>
                <div class="space-y-2">
        `;
        
        assignment.committee.forEach(member => {
            const evaluation = getEvaluationByCommitteeMemberId(member.id);
            const statusBadge = evaluation && evaluation.status === '제출완료' 
                ? '<span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">평가 완료</span>'
                : '<span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">평가 대기</span>';
            
            const evalButton = (evaluation && evaluation.status === '제출완료') 
                ? `<button onclick="viewSingleEvaluation('` + member.id + `')" class="ml-2 text-blue-600 hover:text-blue-800 text-sm">평가 보기</button>`
                : '';
            
            content += `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div>
                        <div class="font-medium">` + member.professorName + `</div>
                        <div class="text-sm text-gray-600">` + member.department + ` / ` + (member.role === 'chair' ? '심사위원장' : '심사위원') + `</div>
                    </div>
                    <div class="text-right">
                        ` + statusBadge + `
                        ` + evalButton + `
                    </div>
                </div>
            `;
        });
        
        content += `
                </div>
            </div>
        `;
    }
    
    // 평가 결과 요약 (모든 심사위원이 평가를 완료한 경우)
    const allEvaluations = assignment.committee
        .map(member => getEvaluationByCommitteeMemberId(member.id))
        .filter(eval => eval && eval.status === '제출완료');
    
    if (allEvaluations.length > 0 && allEvaluations.length === assignment.committee.length) {
        const avgScore = allEvaluations.reduce((sum, e) => sum + (e.totalScore || 0), 0) / allEvaluations.length;
        const threshold = 75; // 합격 기준 점수
        const passed = avgScore >= threshold;
        
        content += `
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="font-bold text-gray-800 mb-3">평가 결과 요약</h4>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div class="text-sm text-gray-600">평균 점수</div>
                        <div class="text-2xl font-bold text-blue-600">` + avgScore.toFixed(1) + `점</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600">합격 기준</div>
                        <div class="text-2xl font-bold text-gray-800">` + threshold + `점</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600">판정</div>
                        <div class="text-2xl font-bold ` + (passed ? 'text-green-600' : 'text-red-600') + `">
                            ` + (passed ? '합격' : '불합격') + `
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    openModal(title, content, '닫기', () => closeModal(), true);
}

// 심사 배정 정보 가져오기 (제출물 ID로)
function getReviewAssignmentBySubmissionId(submissionId) {
    // admin_data.js의 데이터에서 찾기
    // 여기서는 더미 데이터 반환 (실제로는 appData에서 찾아야 함)
    return {
        id: submissionId,
        studentId: '2024001',
        studentName: '김철수',
        studentNumber: '2024001',
        major: '컴퓨터공학과',
        degree: '석사',
        graduate: '일반대학원',
        advisor: '박교수',
        thesisTitle: '딥러닝 기반 자연어 처리 모델의 성능 개선 연구',
        committee: [
            {
                id: 'C001',
                professorName: '이교수',
                department: '컴퓨터공학과',
                role: 'chair'
            },
            {
                id: 'C002',
                professorName: '김교수',
                department: '인공지능학과',
                role: 'member'
            },
            {
                id: 'C003',
                professorName: '정교수',
                department: '소프트웨어학과',
                role: 'member'
            }
        ]
    };
}

// 심사위원의 평가 정보 가져오기
function getEvaluationByCommitteeMemberId(committeeMemberId) {
    // 더미 데이터 반환 (실제로는 appData에서 찾아야 함)
    if (committeeMemberId === 'C001' || committeeMemberId === 'C002') {
        return {
            id: 'EVAL_' + committeeMemberId,
            committeeId: committeeMemberId,
            status: '제출완료',
            totalScore: 85.5,
            submittedAt: '2025-11-15 14:30:00'
        };
    }
    return null;
}

// 개별 심사위원의 평가 상세 보기
function viewSingleEvaluation(committeeMemberId) {
    const evaluation = getEvaluationByCommitteeMemberId(committeeMemberId);
    if (!evaluation) {
        showAlert('평가 정보를 찾을 수 없습니다.');
        return;
    }

    // 여기서는 간단한 알림만 표시 (실제로는 상세 평가 모달을 표시)
    showAlert('개별 평가 상세 화면은 구현 예정입니다.');
}

/**
 * 점수 계산 및 통과 기준 확인
 * @param {Array} evaluations - 심사위원 평가 배열
 * @param {Object} criteria - 통과 기준 (passingCriteria)
 * @returns {Object} - 계산 결과
 */
function calculateScoresAndCriteria(evaluations, criteria) {
    if (!evaluations || evaluations.length === 0) {
        return {
            hasScores: false,
            reason: '평가 없음'
        };
    }

    // 점수가 있는 평가만 필터링
    const scoredEvaluations = evaluations.filter(e => e.score !== undefined && e.score !== null);
    if (scoredEvaluations.length === 0) {
        return {
            hasScores: false,
            reason: '평가 점수 없음'
        };
    }

    const scores = scoredEvaluations.map(e => e.score);
    const minScore = Math.min(...scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const totalScore = scores.reduce((a, b) => a + b, 0);

    const rules = criteria?.rules || [];
    const minRule = rules.find(r => r.type === 'minimum');
    const avgRule = rules.find(r => r.type === 'average');
    const totalRule = rules.find(r => r.type === 'total');

    const meetsMinimum = !minRule || minScore >= minRule.value;
    const meetsAverage = !avgRule || avgScore >= avgRule.value;
    const meetsTotal = !totalRule || totalScore >= totalRule.value;

    return {
        hasScores: true,
        scores: { minScore, avgScore, totalScore },
        meets: { meetsMinimum, meetsAverage, meetsTotal },
        criteria: { minRule, avgRule, totalRule }
    };
}

/**
 * 개별 심사위원 평가 상세 보기
 * @param {number} submissionId - 제출물 ID
 * @param {number} reviewerIndex - 심사위원 인덱스
 * @param {string} type - 제출물 타입
 */
function viewIndividualEvaluation(submissionId, reviewerIndex, type) {
    // 제출물 찾기
    const submissions = appData.submissions[type];
    const submission = submissions.find(s => s.id === submissionId);

    if (!submission || !submission.reviewers || !submission.reviewers[reviewerIndex]) {
        alert('평가 정보를 찾을 수 없습니다.');
        return;
    }

    const reviewer = submission.reviewers[reviewerIndex];

    // 역할 표시 (주심/부심)
    const roleDisplay = reviewer.role === '주심'
        ? '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">위원장</span>'
        : '<span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded font-medium">위원</span>';

    const content = `
        <div class="space-y-6">
            <!-- 평가자 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">평가자 정보</h4>
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">성명:</span>
                        <span class="font-medium">${reviewer.name}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">역할:</span>
                        ${roleDisplay}
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">평가 상태:</span>
                        <span class="status-badge ${reviewer.status === '완료' ? 'status-complete' : reviewer.status === '검토중' ? 'status-reviewing' : 'status-pending'}">
                            ${reviewer.status}
                        </span>
                    </div>
                </div>
            </div>

            ${reviewer.score !== undefined && reviewer.score !== null ? `
                <!-- 평가 점수 -->
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center border-2 border-blue-200">
                    <p class="text-sm text-gray-600 mb-2">평가 점수</p>
                    <div class="text-6xl font-bold text-blue-600 mb-2">${reviewer.score}<span class="text-3xl">점</span></div>
                    <div class="flex items-center justify-center gap-2 mt-3">
                        <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden max-w-xs">
                            <div class="h-full bg-[#009DE8] rounded-full" style="width: ${reviewer.score}%"></div>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="bg-yellow-50 rounded-lg p-6 text-center border-2 border-yellow-200">
                    <p class="text-yellow-800 font-medium">아직 평가가 완료되지 않았습니다.</p>
                </div>
            `}

            ${reviewer.comment ? `
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-3">평가 의견</h4>
                    <p class="text-sm text-gray-700 leading-relaxed">${reviewer.comment}</p>
                </div>
            ` : ''}
        </div>
    `;

    openModal('심사위원 평가 상세', content, '닫기', closeModal, true);
}

// ========== 주차별 지도 관리 ==========

/**
 * 주차별 지도 상세 보기 (교수용 화면과 동일한 스타일)
 */
function viewWeeklyGuidanceDetail(pairId) {
    console.log('viewWeeklyGuidanceDetail called with pairId:', pairId);
    console.log('appData:', appData);
    console.log('guidancePairs:', appData.weeklyGuidance?.guidancePairs);

    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === pairId);
    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];

    console.log('Found pair:', pair);
    console.log('Found plansData:', plansData);

    if (!pair || !plansData) {
        alert('데이터를 찾을 수 없습니다.');
        return;
    }

    const sortedPlans = plansData.weeks.sort((a, b) => a.week - b.week);

    const content = `
        <div class="space-y-6">
            <!-- 학생 정보 카드 (교수용 스타일) -->
            <div class="bg-gray-50 rounded-lg p-6">
                <h4 class="font-bold text-gray-800 mb-4">학생 정보</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div class="info-row">
                        <div class="text-xs font-semibold text-gray-500">학생명</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.student.name} (${pair.student.studentId})</div>
                    </div>
                    <div class="info-row">
                        <div class="text-xs font-semibold text-gray-500">전공 / 학위</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.student.major} / ${getAdminDegreeText(pair.student.degree)}</div>
                    </div>
                    <div class="info-row">
                        <div class="text-xs font-semibold text-gray-500">지도교수</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.professor.name} (${pair.professor.department})</div>
                    </div>
                    <div class="info-row">
                        <div class="text-xs font-semibold text-gray-500">학기</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.semester}</div>
                    </div>
                    <div class="info-row">
                        <div class="text-xs font-semibold text-gray-500">지도 현황</div>
                        <div class="text-sm text-gray-800 mt-1">
                            <span class="font-semibold text-blue-600">완료: ${pair.completedWeeks}주차</span>
                            <span class="text-gray-600 ml-3">전체: ${pair.totalWeeks}주차</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="text-xs font-semibold text-gray-500">최근 업데이트</div>
                        <div class="text-sm text-gray-800 mt-1">${pair.lastUpdateDate || '-'}</div>
                    </div>
                </div>
            </div>

            <!-- 주차별 지도 내역 (교수용 카드 스타일) -->
            <div>
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-gray-800">주차별 지도 내역</h4>
                    <button onclick="addNewWeeklyPlan(${pairId})"
                            class="bg-[#009DE8] hover:bg-[#0087c9] text-white px-4 py-2 rounded text-sm font-medium">
                        + 계획 추가
                    </button>
                </div>

                ${sortedPlans.length > 0 ? `
                    <div class="space-y-4">
                        ${sortedPlans.map(weekPlan => `
                            <div class="border border-gray-200 bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                                <!-- 헤더 -->
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                            ${weekPlan.week}주차
                                        </span>
                                        ${weekPlan.professorPlan.createdAt ? `
                                            <span class="ml-2 text-sm text-gray-600">${formatAdminDate(weekPlan.professorPlan.createdAt)}</span>
                                        ` : ''}
                                        ${weekPlan.studentReport && weekPlan.studentReport.submittedAt ? `
                                            <span class="ml-2 text-sm text-green-600 font-medium">
                                                → ${formatAdminDate(weekPlan.studentReport.submittedAt)} 제출
                                            </span>
                                        ` : ''}
                                    </div>
                                    <div class="flex gap-2">
                                        ${weekPlan.studentReport ? `
                                            <span class="text-xs px-2 py-1 rounded bg-green-100 text-green-700">완료</span>
                                        ` : `
                                            <span class="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">진행중</span>
                                        `}
                                        <button onclick="editWeeklyPlan(${pairId}, ${weekPlan.week})"
                                                class="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
                                            수정
                                        </button>
                                    </div>
                                </div>

                                <!-- 본문 -->
                                <div class="space-y-2">
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">담당교수:</span>
                                        <span class="text-sm text-blue-600 font-semibold ml-2">${pair.professor.name}</span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">지도주제:</span>
                                        <span class="text-sm text-gray-800 ml-2">${weekPlan.professorPlan.goal}</span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">계획내용:</span>
                                        <p class="text-sm text-gray-700 mt-1">${weekPlan.professorPlan.content}</p>
                                    </div>
                                    ${weekPlan.professorPlan.materials && weekPlan.professorPlan.materials.length > 0 ? `
                                        <div>
                                            <span class="text-xs font-semibold text-gray-500">자료:</span>
                                            <p class="text-sm text-gray-700 mt-1">${weekPlan.professorPlan.materials.join(', ')}</p>
                                        </div>
                                    ` : ''}

                                    ${weekPlan.studentReport ? `
                                        <div class="bg-green-50 border-l-4 border-green-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-green-800">학생 실적:</span>
                                            <div class="text-sm text-green-900 mt-1 space-y-1">
                                                <p><strong>달성:</strong> ${weekPlan.studentReport.achievement}</p>
                                                <p><strong>다음 계획:</strong> ${weekPlan.studentReport.nextPlan}</p>
                                                ${weekPlan.studentReport.difficulties ? `
                                                    <p><strong>어려움:</strong> ${weekPlan.studentReport.difficulties}</p>
                                                ` : ''}
                                            </div>
                                        </div>
                                    ` : `
                                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-yellow-800">학생 실적 미제출</span>
                                        </div>
                                    `}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p class="mt-4 text-sm text-gray-600">등록된 지도 계획이 없습니다</p>
                    </div>
                `}
            </div>
        </div>
    `;

    openModal('주차별 지도 상세', content, '닫기', closeModal, true);
}

/**
 * 관리자용 헬퍼 함수
 */
function getAdminDegreeText(degree) {
    const degrees = {
        '석사': '석사',
        '박사': '박사',
        'master': '석사',
        'phd': '박사'
    };
    return degrees[degree] || degree;
}

function formatAdminDate(dateStr) {
    if (!dateStr) return '-';
    return dateStr;
}

/**
 * 주차 아코디언 토글
 */
function toggleWeekAccordion(weekId) {
    const content = document.getElementById(`${weekId}-content`);
    const icon = document.getElementById(`${weekId}-icon`);

    if (!content || !icon) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

/**
 * 관리자 메모 저장
 */
function saveWeekAdminNote(pairId, week) {
    const note = document.getElementById(`adminNote-${pairId}-${week}`).value;

    // 실제로는 서버에 저장해야 함
    const plans = appData.weeklyGuidance.weeklyPlans[pairId];
    if (plans) {
        const weekPlan = plans.weeks.find(w => w.week === week);
        if (weekPlan) {
            weekPlan.adminNote = note;
            alert('메모가 저장되었습니다.');
        }
    }
}

/**
 * 지도 쌍 필터링
 */
function filterGuidancePairs() {
    const semester = document.getElementById('semesterFilter').value;
    const status = document.getElementById('statusFilter').value;
    const professorSearch = document.getElementById('professorSearch').value.toLowerCase();
    const studentSearch = document.getElementById('studentSearch').value.toLowerCase();

    let pairs = appData.weeklyGuidance.guidancePairs;

    // 필터링
    if (semester) {
        pairs = pairs.filter(p => p.semester === semester);
    }
    if (status) {
        pairs = pairs.filter(p => p.status === status);
    }
    if (professorSearch) {
        pairs = pairs.filter(p => p.professor.name.toLowerCase().includes(professorSearch));
    }
    if (studentSearch) {
        pairs = pairs.filter(p => p.student.name.toLowerCase().includes(studentSearch));
    }

    // 테이블 업데이트
    renderGuidancePairsTable(pairs);
}

/**
 * 필터 초기화
 */
function resetGuidancePairsFilter() {
    document.getElementById('semesterFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('professorSearch').value = '';
    document.getElementById('studentSearch').value = '';

    renderGuidancePairsTable(appData.weeklyGuidance.guidancePairs);
}

/**
 * 지도 쌍 테이블 렌더링
 */
function renderGuidancePairsTable(pairs) {
    const tbody = document.getElementById('guidancePairsTableBody');
    if (!tbody) return;

    tbody.innerHTML = pairs.map(pair => `
        <tr class="border-t hover:bg-gray-50">
            <td class="py-3 px-4">
                <div>
                    <p class="font-medium">${pair.professor.name}</p>
                    <p class="text-xs text-gray-500">${pair.professor.department}</p>
                </div>
            </td>
            <td class="py-3 px-4">
                <div>
                    <p class="font-medium">${pair.student.name}</p>
                    <p class="text-xs text-gray-500">${pair.student.major}</p>
                </div>
            </td>
            <td class="py-3 px-4">${pair.student.studentId}</td>
            <td class="py-3 px-4">${pair.semester}</td>
            <td class="py-3 px-4">
                <div class="flex items-center">
                    <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-[#009DE8] h-2 rounded-full"
                             style="width: ${(pair.completedWeeks/pair.totalWeeks*100)}%"></div>
                    </div>
                    <span class="text-sm">${pair.completedWeeks}/${pair.totalWeeks}주차</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">최종 업데이트: ${pair.lastUpdateDate}</p>
            </td>
            <td class="py-3 px-4 text-center">
                <button onclick="viewWeeklyGuidanceDetail(${pair.id})"
                        class="px-3 py-1 bg-[#009DE8] text-white rounded hover:bg-[#0087c9] text-sm">
                    상세보기
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== 학술지 심사 관리 ====================

function getAdminJournalStatusClass(status) {
    const classes = {
        '심사대기': 'bg-yellow-100 text-yellow-800',
        '심사중': 'bg-blue-100 text-blue-800',
        '심사완료': 'bg-green-100 text-green-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

function viewAdminJournalDetail(journalId) {
    // professor의 viewJournalReviewDetail 함수 재사용
    if (typeof viewJournalReviewDetail === 'function') {
        viewJournalReviewDetail(journalId);
    } else {
        alert('학술지 상세보기 기능을 로드할 수 없습니다.');
    }
}

function searchJournalReview() {
    const year = document.getElementById('journal-search-year')?.value || '';
    const semester = document.getElementById('journal-search-semester')?.value || '';
    const status = document.getElementById('journal-search-status')?.value || '';
    const keyword = document.getElementById('journal-search-keyword')?.value.toLowerCase() || '';

    let journals = typeof getJournalReviews === 'function' ? getJournalReviews() : [];

    // 필터링
    if (year) {
        journals = journals.filter(j => (j.year || '2025') === year);
    }
    if (semester) {
        journals = journals.filter(j => (j.semester || '1') === semester);
    }
    if (status) {
        journals = journals.filter(j => j.status === status);
    }
    if (keyword) {
        journals = journals.filter(j =>
            j.studentId.toLowerCase().includes(keyword) ||
            j.studentName.toLowerCase().includes(keyword) ||
            j.paperTitle.toLowerCase().includes(keyword) ||
            j.journalName.toLowerCase().includes(keyword)
        );
    }

    // 테이블 업데이트
    const listContainer = document.getElementById('admin-journal-review-list');
    if (listContainer) {
        listContainer.innerHTML = renderAdminJournalRows(journals);
    }
}

function resetJournalSearch() {
    document.getElementById('journal-search-year').value = '';
    document.getElementById('journal-search-semester').value = '';
    document.getElementById('journal-search-status').value = '';
    document.getElementById('journal-search-keyword').value = '';

    const journals = typeof getJournalReviews === 'function' ? getJournalReviews() : [];
    const listContainer = document.getElementById('admin-journal-review-list');
    if (listContainer) {
        listContainer.innerHTML = renderAdminJournalRows(journals);
    }
}

function renderAdminJournalRows(journals) {
    if (journals.length === 0) {
        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">학술지 심사 내역이 없습니다</h3>
            </div>
        `;
    }

    return `
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
                ${journals.map((journal, idx) => {
                    const statusClass = getAdminJournalStatusClass(journal.status);
                    return `
                        <tr class="hover:bg-gray-50">
                            <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
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
                                <button onclick="viewAdminJournalDetail(${journal.id})"
                                        class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded hover:bg-blue-50">
                                    조회
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// ==================== 연구계획서 관리 ====================

function openResearchProposalRegisterModal() {
    const content = `
        <div class="space-y-6">
            <!-- 학생 검색 -->
            <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-bold mb-3">학생 정보 검색</h4>
                <div class="flex gap-2">
                    <select id="rpSearchType" class="px-3 py-2 border rounded w-32">
                        <option value="studentId">학번</option>
                        <option value="name">성명</option>
                    </select>
                    <input type="text" id="rpSearchKeyword"
                           placeholder="검색어 입력"
                           class="flex-1 px-3 py-2 border rounded"
                           onkeypress="if(event.key==='Enter') searchStudentForRP()">
                    <button onclick="searchStudentForRP()"
                            class="px-4 py-2 bg-[#009DE8] text-white rounded hover:bg-[#0087c9]">
                        검색
                    </button>
                </div>
                <div id="rpStudentSearchResults" class="mt-3"></div>
            </div>

            <!-- 학생 정보 (자동 입력) -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold mb-3">학생 정보</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">학번</label>
                        <input type="text" id="rpStudentId" readonly
                               class="w-full px-3 py-2 border rounded bg-gray-100">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">성명</label>
                        <input type="text" id="rpStudentName" readonly
                               class="w-full px-3 py-2 border rounded bg-gray-100">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">학과/전공</label>
                        <input type="text" id="rpMajor" readonly
                               class="w-full px-3 py-2 border rounded bg-gray-100">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">학위과정</label>
                        <input type="text" id="rpDegree" readonly
                               class="w-full px-3 py-2 border rounded bg-gray-100">
                    </div>
                </div>
            </div>

            <!-- 연구계획서 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold mb-3">연구계획서 정보</h4>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">학년도 *</label>
                            <select id="rpYear" required class="w-full px-3 py-2 border rounded">
                                <option value="">선택</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">학기 *</label>
                            <select id="rpSemester" required class="w-full px-3 py-2 border rounded">
                                <option value="">선택</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">연구계획서 제목 *</label>
                        <input type="text" id="rpTitle" required
                               placeholder="연구계획서 제목 입력"
                               class="w-full px-3 py-2 border rounded">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">연구 개요</label>
                        <textarea id="rpSummary" rows="4"
                                  placeholder="연구 개요 입력"
                                  class="w-full px-3 py-2 border rounded"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">연구계획서 파일</label>
                        <input type="file" id="rpFile" accept=".pdf,.docx"
                               class="w-full px-3 py-2 border rounded">
                        <p class="text-xs text-gray-500 mt-1">PDF 또는 Word 파일 (최대 50MB)</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal('연구계획서 등록', content, '등록', submitResearchProposal, true);
}

function searchStudentForRP() {
    const searchType = document.getElementById('rpSearchType').value;
    const keyword = document.getElementById('rpSearchKeyword').value.trim();

    if (!keyword) {
        alert('검색어를 입력하세요.');
        return;
    }

    // mock 데이터에서 학생 검색 (실제로는 API 호출)
    const students = appData.submissions.researchProposal;
    const results = students.filter(s => {
        if (searchType === 'studentId') {
            return s.studentId.includes(keyword);
        } else {
            return s.studentName.includes(keyword);
        }
    });

    const resultsContainer = document.getElementById('rpStudentSearchResults');
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-sm text-gray-500">검색 결과가 없습니다.</p>';
        return;
    }

    resultsContainer.innerHTML = `
        <div class="border rounded max-h-48 overflow-y-auto">
            ${results.map(s => `
                <div class="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                     onclick="selectStudentForRP('${s.studentId}', '${s.studentName}', '${s.major}', '${s.degree}')">
                    <p class="text-sm font-medium">${s.studentName} (${s.studentId})</p>
                    <p class="text-xs text-gray-600">${s.major} - ${s.degree}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function selectStudentForRP(studentId, studentName, major, degree) {
    document.getElementById('rpStudentId').value = studentId;
    document.getElementById('rpStudentName').value = studentName;
    document.getElementById('rpMajor').value = major;
    document.getElementById('rpDegree').value = degree;
    document.getElementById('rpStudentSearchResults').innerHTML = '<p class="text-sm text-green-600">✓ 학생이 선택되었습니다.</p>';
}

function submitResearchProposal() {
    const studentId = document.getElementById('rpStudentId').value;
    const year = document.getElementById('rpYear').value;
    const semester = document.getElementById('rpSemester').value;
    const title = document.getElementById('rpTitle').value;

    if (!studentId) {
        alert('학생을 검색하여 선택해주세요.');
        return;
    }

    if (!year || !semester || !title) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    alert('연구계획서가 등록되었습니다.');
    closeModal();
    loadView('researchProposal');
}

function viewResearchProposalDetail(id) {
    console.log('viewResearchProposalDetail called with id:', id);
    console.log('appData.submissions.researchProposal:', appData.submissions.researchProposal);

    const proposal = appData.submissions.researchProposal.find(p => p.id === id);
    console.log('Found proposal:', proposal);

    if (!proposal) {
        alert('연구계획서 정보를 찾을 수 없습니다.');
        return;
    }

    const content = `
        <div class="space-y-6">
            <!-- 학생 정보 (수정 불가 - readonly 유지) -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">학생 정보</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학번</label>
                        <input type="text" value="${proposal.studentId}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">성명</label>
                        <input type="text" value="${proposal.studentName}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학과/전공</label>
                        <input type="text" value="${proposal.major}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학위과정</label>
                        <input type="text" value="${proposal.degree}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                </div>
            </div>

            <!-- 연구계획서 정보 (수정 가능) -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">연구계획서 정보</h4>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">학년도 *</label>
                            <select id="editRpYear" required class="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-700">
                                <option value="">선택</option>
                                <option value="2025" ${(proposal.year || '2025') === '2025' ? 'selected' : ''}>2025</option>
                                <option value="2024" ${proposal.year === '2024' ? 'selected' : ''}>2024</option>
                                <option value="2023" ${proposal.year === '2023' ? 'selected' : ''}>2023</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">학기 *</label>
                            <select id="editRpSemester" required class="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-700">
                                <option value="">선택</option>
                                <option value="1" ${(proposal.semester || '1') === '1' ? 'selected' : ''}>1학기</option>
                                <option value="2" ${proposal.semester === '2' ? 'selected' : ''}>2학기</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">연구계획서 제목 *</label>
                        <input type="text" id="editRpTitle" value="${proposal.thesisTitle || ''}" required
                               placeholder="연구계획서 제목 입력"
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">연구 개요</label>
                        <textarea id="editRpSummary" rows="4"
                                  placeholder="연구 개요 입력"
                                  class="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-700">${proposal.summary || ''}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">등록일</label>
                        <input type="text" value="${proposal.submitDate || '-'}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">연구계획서 파일</label>
                        <div class="space-y-2">
                            ${proposal.fileUrl ? `
                                <div class="flex items-center gap-2">
                                    <a href="${proposal.fileUrl}" target="_blank"
                                       class="inline-flex items-center px-4 py-2 bg-[#009DE8] text-white rounded hover:bg-[#0087c9] text-sm">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        기존 파일 다운로드
                                    </a>
                                </div>
                            ` : ''}
                            <input type="file" id="editRpFile" accept=".pdf,.docx"
                                   class="w-full px-3 py-2 border border-gray-300 rounded bg-white">
                            <p class="text-xs text-gray-500">새 파일 업로드 시 기존 파일이 대체됩니다 (PDF 또는 Word, 최대 50MB)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal('연구계획서 상세보기 / 수정', content, '수정 저장', () => updateResearchProposal(id), true);
}

function updateResearchProposal(id) {
    const proposal = appData.submissions.researchProposal.find(p => p.id === id);
    if (!proposal) {
        alert('연구계획서 정보를 찾을 수 없습니다.');
        return;
    }

    const year = document.getElementById('editRpYear').value;
    const semester = document.getElementById('editRpSemester').value;
    const title = document.getElementById('editRpTitle').value.trim();
    const summary = document.getElementById('editRpSummary').value.trim();
    const fileInput = document.getElementById('editRpFile');

    if (!year || !semester || !title) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    // 데이터 업데이트
    proposal.year = year;
    proposal.semester = semester;
    proposal.thesisTitle = title;
    proposal.summary = summary;

    // 파일 업로드 시뮬레이션 (실제로는 서버로 전송)
    if (fileInput.files && fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        proposal.fileUrl = `/uploads/research-proposals/${fileName}`;
    }

    alert('연구계획서가 수정되었습니다.');
    closeModal();
    loadView('researchProposal');
}

// ==================== 평가기준 통과기준 관리 ====================

function editPassCriteria(criteriaId) {
    const criteria = appData.evaluationCriteria.find(c => c.id === criteriaId);
    if (!criteria) return;

    if (criteria.evaluationType === 'passfail') {
        alert('합격/불합격 방식은 통과기준을 설정할 수 없습니다.');
        return;
    }

    const currentCriteria = criteria.passCriteria || {
        type: 'average',
        passScore: 70,
        hasFailThreshold: false,
        failThreshold: 60
    };

    const content = `
        <div class="space-y-6">
            <!-- 평가표 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold mb-2">평가표: ${criteria.name}</h4>
                <p class="text-sm text-gray-600">총 ${criteria.items.length}개 항목, ${criteria.totalScore}점 만점</p>
            </div>

            <!-- 통과기준 유형 -->
            <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-bold mb-3">통과기준 유형</h4>
                <div class="space-y-2">
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="criteriaType" value="average"
                               ${currentCriteria.type === 'average' ? 'checked' : ''}
                               class="mr-2">
                        <div>
                            <span class="font-medium">평균 점수 기준</span>
                            <p class="text-xs text-gray-600">모든 평가 항목의 평균 점수가 기준을 충족해야 합니다</p>
                        </div>
                    </label>
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="criteriaType" value="total"
                               ${currentCriteria.type === 'total' ? 'checked' : ''}
                               class="mr-2">
                        <div>
                            <span class="font-medium">총점 기준</span>
                            <p class="text-xs text-gray-600">모든 평가 항목의 합계 점수가 기준을 충족해야 합니다</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- 통과 점수 -->
            <div>
                <label class="block text-sm font-medium mb-2">통과 점수 *</label>
                <input type="number" id="passScore" min="0" max="${criteria.totalScore}"
                       value="${currentCriteria.passScore}"
                       class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="통과 기준 점수">
                <p class="text-xs text-gray-500 mt-1">
                    평균 기준: 각 항목 평균이 이 점수 이상이어야 합니다<br>
                    총점 기준: 전체 합계가 이 점수 이상이어야 합니다
                </p>
            </div>

            <!-- 과락 기준 -->
            <div>
                <label class="flex items-center cursor-pointer mb-3">
                    <input type="checkbox" id="hasFailThreshold"
                           ${currentCriteria.hasFailThreshold ? 'checked' : ''}
                           onchange="toggleFailThreshold(this.checked)"
                           class="mr-2">
                    <span class="font-medium">과락 기준 사용</span>
                </label>

                <div id="failThresholdSection" style="display: ${currentCriteria.hasFailThreshold ? 'block' : 'none'}">
                    <label class="block text-sm font-medium mb-2">과락 기준 점수</label>
                    <input type="number" id="failThreshold" min="0" max="${criteria.totalScore}"
                           value="${currentCriteria.failThreshold || 60}"
                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="과락 기준 점수">
                    <p class="text-xs text-red-600 mt-1">
                        <i class="fas fa-exclamation-triangle"></i>
                        개별 항목이 이 점수 미만이면 전체 평균/총점과 관계없이 불합격 처리됩니다
                    </p>
                </div>
            </div>

            <!-- 예시 -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 class="font-bold text-yellow-900 mb-2">설정 예시</h5>
                <div class="text-sm text-yellow-900 space-y-1">
                    <p>• 평균 70점, 과락 60점: 모든 항목 평균 70점 이상, 각 항목 60점 이상</p>
                    <p>• 총점 75점, 과락 없음: 전체 합계 75점 이상이면 합격</p>
                </div>
            </div>
        </div>
    `;

    openModal('통과기준 설정 - ' + criteria.name, content, '저장', () => savePassCriteria(criteriaId), true);
}

function toggleFailThreshold(checked) {
    const section = document.getElementById('failThresholdSection');
    if (section) {
        section.style.display = checked ? 'block' : 'none';
    }
}

function savePassCriteria(criteriaId) {
    const criteria = appData.evaluationCriteria.find(c => c.id === criteriaId);
    if (!criteria) return;

    const type = document.querySelector('input[name="criteriaType"]:checked').value;
    const passScore = parseInt(document.getElementById('passScore').value);
    const hasFailThreshold = document.getElementById('hasFailThreshold').checked;
    const failThreshold = hasFailThreshold ? parseInt(document.getElementById('failThreshold').value) : null;

    if (!passScore || passScore <= 0) {
        alert('통과 점수를 입력해주세요.');
        return;
    }

    if (hasFailThreshold && (!failThreshold || failThreshold <= 0)) {
        alert('과락 기준 점수를 입력해주세요.');
        return;
    }

    if (hasFailThreshold && failThreshold >= passScore) {
        alert('과락 기준은 통과 점수보다 낮아야 합니다.');
        return;
    }

    // 데이터 저장
    criteria.passCriteria = {
        type: type,
        passScore: passScore,
        hasFailThreshold: hasFailThreshold,
        failThreshold: failThreshold
    };

    alert('통과기준이 저장되었습니다.');
    closeModal();
    loadView('evaluationCriteria');
}

// ==================== 논문 제목 등록 현황 ====================

function viewTitleChangeDetail(id) {
    const request = appData.titleChangeRequests.find(r => r.id === id);
    if (!request) {
        alert('정보를 찾을 수 없습니다.');
        return;
    }

    const content = `
        <div class="space-y-6">
            <!-- 학생 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">학생 정보</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학번</label>
                        <input type="text" value="${request.studentId}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">성명</label>
                        <input type="text" value="${request.studentName}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학과/전공</label>
                        <input type="text" value="${request.major}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">학위과정</label>
                        <input type="text" value="${request.degree}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                </div>
            </div>

            <!-- 논문 제목 정보 -->
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 class="font-bold text-blue-900 mb-3">논문 제목</h4>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">논문 제목 (국문)</label>
                        <input type="text" value="${request.titleKo || request.currentTitle || '-'}" readonly
                               class="w-full px-3 py-2 border border-blue-300 rounded bg-blue-100 text-gray-900 font-medium">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">논문 제목 (영문)</label>
                        <input type="text" value="${request.titleEn || request.newTitle || '-'}" readonly
                               class="w-full px-3 py-2 border border-blue-300 rounded bg-blue-100 text-gray-900 font-medium">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">등록일</label>
                        <input type="text" value="${request.registeredDate || request.requestDate || '-'}" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal(
        '논문 제목 상세',
        content,
        '닫기',
        closeModal,
        true
    );
}

function approveTitleChange(id) {
    const request = appData.titleChangeRequests.find(r => r.id === id);
    if (!request) {
        alert('신청 정보를 찾을 수 없습니다.');
        return;
    }

    if (request.status === '승인') {
        alert('이미 승인된 신청입니다.');
        return;
    }

    if (confirm(`${request.studentName}(${request.studentId}) 학생의 논문 제목 변경 신청을 승인하시겠습니까?`)) {
        request.status = '승인';
        request.approvedDate = new Date().toISOString().split('T')[0];
        request.approvedBy = '관리자';

        alert('논문 제목 변경이 승인되었습니다.');
        closeModal();
        loadView('titleChangeRequests');
    }
}

function searchTitleChangeRequests() {
    // 검색 기능 구현 (선택사항)
    alert('검색 기능은 추후 구현 예정입니다.');
}

function resetTitleChangeSearch() {
    document.getElementById('title-search-year').value = '';
    document.getElementById('title-search-semester').value = '';
    document.getElementById('title-search-student-id').value = '';
    document.getElementById('title-search-student-name').value = '';
    document.getElementById('title-search-status').value = '';
    loadView('titleChangeRequests');
}

/**
 * 주차별 지도 계획 수정
 */
function editWeeklyPlan(pairId, week) {
    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === pairId);
    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];

    if (!pair || !plansData) {
        alert('데이터를 찾을 수 없습니다.');
        return;
    }

    const weekPlan = plansData.weeks.find(w => w.week === week);
    if (!weekPlan) {
        alert('해당 주차 계획을 찾을 수 없습니다.');
        return;
    }

    const materials = weekPlan.professorPlan.materials ? weekPlan.professorPlan.materials.join(', ') : '';

    const content = `
        <div class="space-y-6">
            <!-- 학생 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">학생 정보</h4>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <span class="text-xs font-semibold text-gray-500">학생명:</span>
                        <span class="text-sm text-gray-800 ml-2">${pair.student.name} (${pair.student.studentId})</span>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-500">담당교수:</span>
                        <span class="text-sm text-gray-800 ml-2">${pair.professor.name}</span>
                    </div>
                </div>
            </div>

            <!-- 지도 계획 수정 폼 -->
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">주차</label>
                    <input type="number" id="edit-week" value="${weekPlan.week}" readonly
                           class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">지도주제 *</label>
                    <input type="text" id="edit-goal" value="${weekPlan.professorPlan.goal}"
                           class="w-full border border-gray-300 rounded px-3 py-2">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">계획내용 *</label>
                    <textarea id="edit-content" rows="4"
                              class="w-full border border-gray-300 rounded px-3 py-2">${weekPlan.professorPlan.content}</textarea>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">자료 (콤마로 구분)</label>
                    <input type="text" id="edit-materials" value="${materials}"
                           class="w-full border border-gray-300 rounded px-3 py-2"
                           placeholder="예: 교재 3장, 논문 링크">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">등록일</label>
                    <input type="date" id="edit-created-at" value="${weekPlan.professorPlan.createdAt}"
                           class="w-full border border-gray-300 rounded px-3 py-2">
                </div>
            </div>

            ${weekPlan.studentReport ? `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 class="font-bold text-green-800 mb-3">학생 실적 (수정 불가)</h4>
                    <div class="space-y-2 text-sm text-green-900">
                        <p><strong>달성:</strong> ${weekPlan.studentReport.achievement}</p>
                        <p><strong>다음 계획:</strong> ${weekPlan.studentReport.nextPlan}</p>
                        ${weekPlan.studentReport.difficulties ? `
                            <p><strong>어려움:</strong> ${weekPlan.studentReport.difficulties}</p>
                        ` : ''}
                        <p><strong>제출일:</strong> ${weekPlan.studentReport.submittedAt}</p>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    openModal(
        `${week}주차 지도 계획 수정`,
        content,
        '저장',
        () => saveWeeklyPlan(pairId, week),
        true
    );
}

/**
 * 주차별 지도 계획 저장
 */
function saveWeeklyPlan(pairId, week) {
    const goal = document.getElementById('edit-goal').value.trim();
    const content = document.getElementById('edit-content').value.trim();
    const materialsStr = document.getElementById('edit-materials').value.trim();
    const createdAt = document.getElementById('edit-created-at').value;

    if (!goal) {
        alert('지도주제를 입력해주세요.');
        return;
    }

    if (!content) {
        alert('계획내용을 입력해주세요.');
        return;
    }

    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];
    const weekPlan = plansData.weeks.find(w => w.week === week);

    if (!weekPlan) {
        alert('데이터를 찾을 수 없습니다.');
        return;
    }

    // 업데이트
    weekPlan.professorPlan.goal = goal;
    weekPlan.professorPlan.content = content;
    weekPlan.professorPlan.materials = materialsStr ? materialsStr.split(',').map(m => m.trim()) : [];
    weekPlan.professorPlan.createdAt = createdAt;

    showNotification('지도 계획이 수정되었습니다.', 'success');
    closeModal();

    // 상세 화면 다시 표시
    viewWeeklyGuidanceDetail(pairId);
}

/**
 * 새로운 주차 추가
 */
function addNewWeeklyPlan(pairId) {
    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === pairId);
    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];

    if (!pair || !plansData) {
        alert('데이터를 찾을 수 없습니다.');
        return;
    }

    // 다음 주차 번호 계산
    const maxWeek = plansData.weeks.length > 0
        ? Math.max(...plansData.weeks.map(w => w.week))
        : 0;
    const nextWeek = maxWeek + 1;

    const today = new Date().toISOString().split('T')[0];

    const content = `
        <div class="space-y-6">
            <!-- 학생 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-3">학생 정보</h4>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <span class="text-xs font-semibold text-gray-500">학생명:</span>
                        <span class="text-sm text-gray-800 ml-2">${pair.student.name} (${pair.student.studentId})</span>
                    </div>
                    <div>
                        <span class="text-xs font-semibold text-gray-500">담당교수:</span>
                        <span class="text-sm text-gray-800 ml-2">${pair.professor.name}</span>
                    </div>
                </div>
            </div>

            <!-- 지도 계획 입력 폼 -->
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">주차</label>
                    <input type="number" id="new-week" value="${nextWeek}"
                           class="w-full border border-gray-300 rounded px-3 py-2">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">지도주제 *</label>
                    <input type="text" id="new-goal" placeholder="예: 연구방법론 검토"
                           class="w-full border border-gray-300 rounded px-3 py-2">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">계획내용 *</label>
                    <textarea id="new-content" rows="4" placeholder="지도 계획 내용을 입력하세요"
                              class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">자료 (콤마로 구분)</label>
                    <input type="text" id="new-materials" placeholder="예: 교재 3장, 논문 링크"
                           class="w-full border border-gray-300 rounded px-3 py-2">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">등록일</label>
                    <input type="date" id="new-created-at" value="${today}"
                           class="w-full border border-gray-300 rounded px-3 py-2">
                </div>
            </div>
        </div>
    `;

    openModal(
        '계획 추가',
        content,
        '추가',
        () => createNewWeeklyPlan(pairId),
        true
    );
}

/**
 * 새로운 주차 계획 생성
 */
function createNewWeeklyPlan(pairId) {
    const week = parseInt(document.getElementById('new-week').value);
    const goal = document.getElementById('new-goal').value.trim();
    const content = document.getElementById('new-content').value.trim();
    const materialsStr = document.getElementById('new-materials').value.trim();
    const createdAt = document.getElementById('new-created-at').value;

    if (!week || week < 1) {
        alert('올바른 주차를 입력해주세요.');
        return;
    }

    if (!goal) {
        alert('지도주제를 입력해주세요.');
        return;
    }

    if (!content) {
        alert('계획내용을 입력해주세요.');
        return;
    }

    const plansData = appData.weeklyGuidance.weeklyPlans[pairId];
    const pair = appData.weeklyGuidance.guidancePairs.find(p => p.id === pairId);

    // 중복 주차 확인
    const existingWeek = plansData.weeks.find(w => w.week === week);
    if (existingWeek) {
        alert(`${week}주차는 이미 존재합니다.`);
        return;
    }

    // 새 계획 추가
    const newWeekPlan = {
        week: week,
        professorPlan: {
            goal: goal,
            content: content,
            materials: materialsStr ? materialsStr.split(',').map(m => m.trim()) : [],
            createdAt: createdAt
        },
        studentReport: null
    };

    plansData.weeks.push(newWeekPlan);

    // 전체 주차 수 업데이트
    pair.totalWeeks = plansData.weeks.length;

    showNotification('새 계획이 추가되었습니다.', 'success');
    closeModal();

    // 상세 화면 다시 표시
    viewWeeklyGuidanceDetail(pairId);
}

// Export functions
window.viewPdfFeedback = viewPdfFeedback;
window.closePdfViewer = closePdfViewer;
window.viewIndividualEvaluation = viewIndividualEvaluation;
window.viewWeeklyGuidanceDetail = viewWeeklyGuidanceDetail;
window.toggleWeekAccordion = toggleWeekAccordion;
window.saveWeekAdminNote = saveWeekAdminNote;
window.filterGuidancePairs = filterGuidancePairs;
window.resetGuidancePairsFilter = resetGuidancePairsFilter;
window.getAdminJournalStatusClass = getAdminJournalStatusClass;
window.viewAdminJournalDetail = viewAdminJournalDetail;
window.searchJournalReview = searchJournalReview;
window.resetJournalSearch = resetJournalSearch;
window.renderAdminJournalRows = renderAdminJournalRows;
window.openResearchProposalRegisterModal = openResearchProposalRegisterModal;
window.searchStudentForRP = searchStudentForRP;
window.selectStudentForRP = selectStudentForRP;
window.submitResearchProposal = submitResearchProposal;
window.viewResearchProposalDetail = viewResearchProposalDetail;
window.updateResearchProposal = updateResearchProposal;
window.editPassCriteria = editPassCriteria;
window.toggleFailThreshold = toggleFailThreshold;
window.savePassCriteria = savePassCriteria;
window.viewTitleChangeDetail = viewTitleChangeDetail;
window.approveTitleChange = approveTitleChange;
window.searchTitleChangeRequests = searchTitleChangeRequests;
window.resetTitleChangeSearch = resetTitleChangeSearch;
window.editWeeklyPlan = editWeeklyPlan;
window.saveWeeklyPlan = saveWeeklyPlan;
window.addNewWeeklyPlan = addNewWeeklyPlan;
window.createNewWeeklyPlan = createNewWeeklyPlan;

// 워크플로우 관리 함수들
window.editStage = editStage;
window.deleteStage = deleteStage;
window.viewStageDetail = viewStageDetail;
window.addWorkflowStep = addWorkflowStep;
window.editWorkflowStages = editWorkflowStages;
window.addStageFromType = addStageFromType;
window.updateTempStageName = updateTempStageName;
window.updateTempStageDate = updateTempStageDate;
window.updateTempStageCriteria = updateTempStageCriteria;
window.removeTempStage = removeTempStage;
window.moveTempStageUp = moveTempStageUp;
window.moveTempStageDown = moveTempStageDown;

// ========== 평가표 미리보기 ==========
function previewEvaluationForm(criteriaId) {
    const criteria = appData.evaluationCriteria.find(c => c.id === criteriaId);
    if (!criteria) {
        showAlert('평가표를 찾을 수 없습니다.');
        return;
    }

    const evalType = criteria.evaluationType || 'score';
    let content = '';

    if (evalType === 'score') {
        // 점수형 미리보기
        content = `
            <div class="space-y-4">
                <div class="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <h4 class="font-bold text-blue-900 mb-3 flex items-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        평가 기준 안내
                    </h4>
                    <div class="space-y-2 text-sm text-blue-900">
                        <p class="flex items-center">
                            <span class="w-2 h-2 bg-[#009DE8] rounded-full mr-2"></span>
                            <span>${criteria.passCriteria?.description || '통과 기준 설정 필요'}</span>
                        </p>
                        <p class="flex items-center">
                            <span class="w-2 h-2 bg-[#009DE8] rounded-full mr-2"></span>
                            <span>총점 ${criteria.totalScore || 0}점 만점</span>
                        </p>
                    </div>
                </div>

                <div class="space-y-4">
                    ${criteria.items.map((item, idx) => `
                        <div class="evaluation-item bg-white border-2 border-gray-300 rounded-lg p-4">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <h4 class="font-bold text-gray-800 mb-1">
                                        ${idx + 1}. ${item.name}
                                    </h4>
                                    ${item.description ? `<p class="text-sm text-gray-600">${item.description}</p>` : ''}
                                </div>
                                <div class="text-right ml-4 flex-shrink-0">
                                    <span class="text-2xl font-bold text-[#009DE8]">${item.score || 0}</span>
                                    <span class="text-sm text-gray-600">점</span>
                                </div>
                            </div>

                            <div>
                                <label class="text-sm font-medium text-gray-700 block mb-1">점수 입력:</label>
                                <input type="number"
                                       class="w-full border border-gray-300 rounded-lg p-2"
                                       min="0"
                                       max="${item.score || 0}"
                                       step="0.5"
                                       placeholder="0 ~ ${item.score || 0}점"
                                       disabled>

                                <label class="text-sm font-medium text-gray-700 block mt-3 mb-1">평가 의견:</label>
                                <textarea class="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                          rows="2"
                                          placeholder="해당 항목에 대한 의견을 작성해주세요"
                                          disabled></textarea>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <h4 class="text-lg font-bold text-gray-800">총점</h4>
                        <div class="text-3xl font-bold text-gray-400">0 / ${criteria.totalScore || 0}점</div>
                    </div>
                </div>
            </div>
        `;
    } else if (evalType === 'grade') {
        // 등급형 미리보기
        content = `
            <div class="space-y-4">
                <div class="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
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
                            <span>${criteria.passCriteria?.description || '통과 기준 설정 필요'}</span>
                        </p>
                    </div>
                </div>

                <div class="space-y-4">
                    ${criteria.items.map((item, idx) => `
                        <div class="bg-white border-2 border-gray-300 rounded-lg p-4">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <h4 class="font-bold text-gray-800 mb-1">
                                        ${idx + 1}. ${item.name}
                                    </h4>
                                    ${item.description ? `
                                        <div class="mt-2 bg-purple-50 border border-purple-200 rounded p-3">
                                            <p class="text-xs text-purple-900 font-medium mb-1">등급 기준:</p>
                                            <p class="text-xs text-gray-700 whitespace-pre-line">${item.description}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="space-y-3">
                                <label class="text-sm font-medium text-gray-700">등급 선택:</label>
                                <div class="flex gap-2">
                                    ${['A', 'B', 'C', 'D', 'F'].map(grade => `
                                        <label class="flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 border-gray-300 bg-white hover:border-purple-400 flex-1">
                                            <input type="radio" name="grade-preview-${idx}" value="${grade}" class="hidden" disabled>
                                            <span class="font-bold text-gray-700">${grade}</span>
                                        </label>
                                    `).join('')}
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 block mt-3">평가 의견:</label>
                                    <textarea class="w-full border border-gray-300 rounded-lg p-2 text-sm mt-1"
                                              rows="2"
                                              placeholder="해당 항목에 대한 의견을 작성해주세요"
                                              disabled></textarea>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <h4 class="text-lg font-bold text-purple-900">최종 평가</h4>
                        <div class="text-2xl font-bold text-gray-400">미완료</div>
                    </div>
                    <p class="text-sm text-purple-800 mt-1 text-right">
                        ${criteria.passCriteria?.description || '통과 기준 설정 필요'}
                    </p>
                </div>
            </div>
        `;
    } else {
        // Pass/Fail형 미리보기
        content = `
            <div class="space-y-4">
                <div class="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <h4 class="font-bold text-blue-900 mb-3 flex items-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        평가 기준 안내
                    </h4>
                    <p class="text-sm text-blue-900">
                        <strong>안내:</strong> 각 항목에 대해 Pass 또는 Fail을 선택해주세요.
                        ${criteria.passCriteria?.description || '통과 기준 설정 필요'}
                    </p>
                </div>

                <div class="space-y-4">
                    ${criteria.items.map((item, idx) => `
                        <div class="bg-white border-2 border-gray-300 rounded-lg p-4">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <h4 class="font-bold text-gray-800 mb-1">
                                        ${idx + 1}. ${item.name}
                                    </h4>
                                    ${item.description ? `
                                        <div class="mt-2 bg-gray-50 border border-gray-300 rounded p-3">
                                            <p class="text-xs text-gray-900 font-medium mb-1">판단 기준:</p>
                                            <p class="text-xs text-gray-700">${item.description}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center gap-4">
                                    <label class="text-sm font-medium text-gray-700">판정:</label>
                                    <div class="flex gap-3">
                                        <label class="flex items-center gap-2 cursor-pointer p-2 px-4 rounded-lg border-2 border-gray-300 bg-white hover:border-green-400">
                                            <input type="radio" name="pf-preview-${idx}" value="pass" disabled>
                                            <span class="font-medium text-gray-700">Pass</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer p-2 px-4 rounded-lg border-2 border-gray-300 bg-white hover:border-red-400">
                                            <input type="radio" name="pf-preview-${idx}" value="fail" disabled>
                                            <span class="font-medium text-gray-700">Fail</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 block">평가 의견:</label>
                                    <textarea class="w-full border border-gray-300 rounded-lg p-2 text-sm mt-1"
                                              rows="2"
                                              placeholder="해당 항목에 대한 의견을 작성해주세요"
                                              disabled></textarea>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <h4 class="text-lg font-bold text-gray-800">최종 결과</h4>
                        <div class="text-2xl font-bold text-gray-400">미완료</div>
                    </div>
                    <p class="text-sm text-gray-600 mt-1 text-right">
                        ${criteria.passCriteria?.description || '통과 기준 설정 필요'}
                    </p>
                </div>
            </div>
        `;
    }

    const evalTypeLabel = evalType === 'score' ? '점수형' : evalType === 'grade' ? '등급형' : 'Pass/Fail형';
    const fullContent = `
        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-bold text-gray-800">${criteria.name}</h3>
                <span class="px-3 py-1 text-sm rounded-full ${
                    evalType === 'score' ? 'bg-blue-100 text-blue-800' :
                    evalType === 'grade' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }">
                    ${evalTypeLabel}
                </span>
            </div>
            <p class="text-sm text-gray-600">${criteria.description || ''}</p>
        </div>
        <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
            <p class="text-sm text-yellow-900">
                <i class="fas fa-eye mr-2"></i>
                <strong>미리보기 모드:</strong> 이 화면은 교수가 평가를 진행할 때 보게 되는 화면입니다. 입력은 비활성화되어 있습니다.
            </p>
        </div>
        ${content}
    `;

    openModal('평가표 미리보기', fullContent, '닫기', closeModal, true);
}

window.previewEvaluationForm = previewEvaluationForm;

// ========== 워크플로우 페이지 전환 방식 함수들 ==========

/**
 * 워크플로우 저장 후 단계 구성 페이지로 이동
 */
function saveWorkflowAndCompose(workflowId) {
    const name = document.getElementById('workflow-name').value.trim();
    const degreeType = document.querySelector('input[name="degree-type"]:checked').value;
    const description = document.getElementById('workflow-description').value.trim();

    if (!name) {
        showAlert('워크플로우명을 입력해주세요.');
        return;
    }

    const isEdit = workflowId !== '';

    if (isEdit) {
        // 수정
        const workflow = mockThesisStages.find(w => w.id === workflowId);
        if (workflow) {
            workflow.name = name;
            workflow.degreeType = degreeType;
            workflow.description = description;
        }
    } else {
        // 신규 생성
        const newWorkflow = {
            id: 'TS' + String(mockThesisStages.length + 1).padStart(3, '0'),
            name: name,
            degreeType: degreeType,
            description: description || '',
            stageCount: 0,
            createdDate: new Date().toISOString().split('T')[0],
            stages: []
        };
        mockThesisStages.push(newWorkflow);
        workflowId = newWorkflow.id;
    }

    showAlert('워크플로우가 저장되었습니다. 단계를 구성하세요.');
    switchView('workflowStageCompose', workflowId);
}

/**
 * 워크플로우 단계 구성 저장
 */
function saveWorkflowStages(workflowId) {
    const workflow = mockThesisStages.find(w => w.id === workflowId);
    if (!workflow) {
        showAlert('워크플로우를 찾을 수 없습니다.');
        return;
    }

    // composedStages 검증
    if (!window.composedStages || window.composedStages.length === 0) {
        showConfirm('단계가 구성되지 않았습니다. 빈 워크플로우로 저장하시겠습니까?', () => {
            workflow.stages = [];
            workflow.stageCount = 0;
            showAlert('워크플로우가 저장되었습니다.');
            switchView('stageManagement');
        });
        return;
    }

    workflow.stages = window.composedStages.map((stage, idx) => ({
        ...stage,
        order: idx + 1
    }));
    workflow.stageCount = workflow.stages.length;

    showAlert(`워크플로우 "${workflow.name}"이(가) ${workflow.stageCount}개 단계로 저장되었습니다.`);
    switchView('stageManagement');
}

/**
 * 좌측 단계 유형 목록에서 단계 추가
 */
function addStageToComposition(stepTypeId) {
    const stepType = mockStepTypes.find(st => st.id === stepTypeId);
    if (!stepType) {
        showAlert('단계 유형을 찾을 수 없습니다.');
        return;
    }

    // composedStages 초기화 확인
    if (!window.composedStages) {
        window.composedStages = [];
    }

    window.composedStages.push({
        stepTypeId: stepType.id,
        name: stepType.name,
        type: stepType.type,
        evaluationRequired: stepType.type === 'review'
    });

    // 리렌더링
    document.getElementById('composed-stages-list').innerHTML = renderComposedStages();

    // 개수 업데이트
    const stageCount = document.getElementById('stage-count');
    if (stageCount) {
        stageCount.textContent = `(${window.composedStages.length}개)`;
    }
}

/**
 * 구성된 단계 제거
 */
function removeStageFromComposition(index) {
    if (!window.composedStages) return;

    window.composedStages.splice(index, 1);
    document.getElementById('composed-stages-list').innerHTML = renderComposedStages();

    // 개수 업데이트
    const stageCount = document.getElementById('stage-count');
    if (stageCount) {
        stageCount.textContent = `(${window.composedStages.length}개)`;
    }

    // 빈 상태 메시지 표시
    if (window.composedStages.length === 0) {
        document.querySelector('.p-6').innerHTML = `
            <h3 class="font-bold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                구성된 단계
                <span class="ml-2 text-sm font-normal text-gray-500" id="stage-count">(0개)</span>
            </h3>

            <div id="composed-stages-list" class="space-y-3"></div>

            <div class="text-center py-16 text-gray-400">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <p class="text-lg font-medium mb-1">단계를 추가하세요</p>
                <p class="text-sm">좌측에서 단계 유형을 클릭하면 여기에 추가됩니다</p>
            </div>
        `;
    }
}

/**
 * 단계 순서 변경
 */
function moveStageInComposition(index, direction) {
    if (!window.composedStages) return;

    if (direction === 'up' && index > 0) {
        [window.composedStages[index - 1], window.composedStages[index]] =
        [window.composedStages[index], window.composedStages[index - 1]];
    } else if (direction === 'down' && index < window.composedStages.length - 1) {
        [window.composedStages[index], window.composedStages[index + 1]] =
        [window.composedStages[index + 1], window.composedStages[index]];
    }

    document.getElementById('composed-stages-list').innerHTML = renderComposedStages();
}

/**
 * 구성된 단계 렌더링
 */
function renderComposedStages() {
    if (!window.composedStages || window.composedStages.length === 0) {
        return '';
    }

    return window.composedStages.map((stage, idx) => {
        const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
        const typeLabel = stepType?.type === 'submission' ? '제출' : '심사';
        const typeBg = stepType?.type === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

        return `
            <div class="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <span class="font-bold text-gray-600 text-lg w-8">${idx + 1}.</span>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-medium text-gray-800">${stage.name}</span>
                        <span class="px-2 py-0.5 rounded text-xs font-medium ${typeBg}">${typeLabel}</span>
                        ${stage.evaluationRequired ? '<span class="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">심사</span>' : ''}
                    </div>
                    ${stepType?.description ? `<p class="text-xs text-gray-500">${stepType.description}</p>` : ''}
                </div>
                <div class="flex gap-2">
                    ${idx > 0 ? `
                        <button onclick="moveStageInComposition(${idx}, 'up')"
                                class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-300 transition-colors">
                            ↑
                        </button>
                    ` : ''}
                    ${idx < window.composedStages.length - 1 ? `
                        <button onclick="moveStageInComposition(${idx}, 'down')"
                                class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-300 transition-colors">
                            ↓
                        </button>
                    ` : ''}
                    <button onclick="removeStageFromComposition(${idx})"
                            class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors">
                        삭제
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 좌측 단계 유형 검색 필터
 */
function filterStepTypes() {
    const searchTerm = document.getElementById('step-type-search').value.toLowerCase();
    const items = document.querySelectorAll('.step-type-item');

    items.forEach(item => {
        const stepName = item.getAttribute('data-step-name') || '';
        if (stepName.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 전역으로 노출
window.saveWorkflowAndCompose = saveWorkflowAndCompose;
window.saveWorkflowStages = saveWorkflowStages;
window.addStageToComposition = addStageToComposition;
window.removeStageFromComposition = removeStageFromComposition;
window.moveStageInComposition = moveStageInComposition;
window.renderComposedStages = renderComposedStages;
window.filterStepTypes = filterStepTypes;

// ====================================================================
// 워크플로우 통합 화면 함수들
// ====================================================================

// 단계 추가 모달 (커스텀 이름 + 평가표 매핑)
function openAddStageModal(stepTypeId) {
    const stepType = mockStepTypes.find(st => st.id === stepTypeId);
    if (!stepType) return;

    const isReview = stepType.type === 'review';
    const defaultEvalTemplateId = stepType.evaluationTemplateId;

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">단계 이름 *</label>
                <input type="text"
                       id="stage-custom-name"
                       value="${stepType.name}"
                       placeholder="예: 1차 본심사, 최종 예비심사"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <p class="text-xs text-gray-500 mt-1">단계 유형: ${stepType.name}</p>
            </div>

            ${isReview ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">평가표 선택 *</label>
                    <div class="space-y-2">
                        ${mockEvaluationTemplates.map(template => `
                            <label class="flex items-start p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="radio"
                                       name="evaluation-template"
                                       value="${template.id}"
                                       ${template.id === defaultEvalTemplateId ? 'checked' : ''}
                                       class="mt-1 mr-3">
                                <div>
                                    <div class="font-medium text-gray-800">${template.name}</div>
                                    <div class="text-xs text-gray-500">항목 ${template.items.length}개</div>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="text-sm text-blue-800">
                        <strong>단계 유형</strong>은 재사용 가능한 템플릿이고, <strong>단계 이름</strong>은 워크플로우에서 사용할 실제 이름입니다.
                        동일한 단계 유형을 여러 번 사용할 수 있습니다.
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal('단계 추가', content, '추가', () => {
        const customName = document.getElementById('stage-custom-name').value.trim();

        if (!customName) {
            alert('단계 이름을 입력해주세요.');
            return false;
        }

        let evaluationTemplateId = null;
        if (isReview) {
            const selectedRadio = document.querySelector('input[name="evaluation-template"]:checked');
            if (!selectedRadio) {
                alert('평가표를 선택해주세요.');
                return false;
            }
            evaluationTemplateId = selectedRadio.value;
        }

        // Add to composed stages
        window.composedStages.push({
            stepTypeId: stepType.id,
            name: customName,
            order: window.composedStages.length + 1,
            type: stepType.type,
            evaluationRequired: isReview,
            evaluationTemplateId: evaluationTemplateId
        });

        refreshComposedStagesUnified();
        return true;
    });
}

// 단계 편집 모달 (이름 + 평가표 수정)
function editStageUnified(index) {
    const stage = window.composedStages[index];
    const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
    if (!stepType) return;

    const isReview = stepType.type === 'review';

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">단계 이름 *</label>
                <input type="text"
                       id="stage-custom-name"
                       value="${stage.name}"
                       placeholder="예: 1차 본심사, 최종 예비심사"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <p class="text-xs text-gray-500 mt-1">단계 유형: ${stepType.name}</p>
            </div>

            ${isReview ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">평가표 선택 *</label>
                    <div class="space-y-2">
                        ${mockEvaluationTemplates.map(template => `
                            <label class="flex items-start p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="radio"
                                       name="evaluation-template"
                                       value="${template.id}"
                                       ${template.id === stage.evaluationTemplateId ? 'checked' : ''}
                                       class="mt-1 mr-3">
                                <div>
                                    <div class="font-medium text-gray-800">${template.name}</div>
                                    <div class="text-xs text-gray-500">항목 ${template.items.length}개</div>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    openModal('단계 편집', content, '저장', () => {
        const customName = document.getElementById('stage-custom-name').value.trim();

        if (!customName) {
            alert('단계 이름을 입력해주세요.');
            return false;
        }

        let evaluationTemplateId = stage.evaluationTemplateId;
        if (isReview) {
            const selectedRadio = document.querySelector('input[name="evaluation-template"]:checked');
            if (!selectedRadio) {
                alert('평가표를 선택해주세요.');
                return false;
            }
            evaluationTemplateId = selectedRadio.value;
        }

        // Update stage
        window.composedStages[index].name = customName;
        window.composedStages[index].evaluationTemplateId = evaluationTemplateId;

        refreshComposedStagesUnified();
        return true;
    });
}

// 단계 삭제
function removeStageUnified(index) {
    if (confirm('이 단계를 삭제하시겠습니까?')) {
        window.composedStages.splice(index, 1);
        // Reorder
        window.composedStages.forEach((stage, idx) => {
            stage.order = idx + 1;
        });
        refreshComposedStagesUnified();
    }
}

// 단계 이동 (위/아래)
function moveStageUnified(index, direction) {
    if (direction === 'up' && index > 0) {
        [window.composedStages[index - 1], window.composedStages[index]] =
        [window.composedStages[index], window.composedStages[index - 1]];
    } else if (direction === 'down' && index < window.composedStages.length - 1) {
        [window.composedStages[index], window.composedStages[index + 1]] =
        [window.composedStages[index + 1], window.composedStages[index]];
    }

    // Reorder
    window.composedStages.forEach((stage, idx) => {
        stage.order = idx + 1;
    });

    refreshComposedStagesUnified();
}

// 구성된 단계 렌더링
function renderComposedStagesUnified() {
    if (!window.composedStages || window.composedStages.length === 0) {
        return '';
    }

    return `
        <div class="space-y-3">
            ${window.composedStages.map((stage, index) => {
                const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
                const evalTemplate = stage.evaluationTemplateId
                    ? mockEvaluationTemplates.find(t => t.id === stage.evaluationTemplateId)
                    : null;

                return `
                    <div class="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm mr-3">
                                        ${index + 1}
                                    </span>
                                    <h5 class="font-bold text-gray-800 text-lg">${stage.name}</h5>
                                </div>
                                <div class="ml-11 space-y-1">
                                    <p class="text-sm text-gray-600">유형: ${stepType.name}</p>
                                    ${evalTemplate ? `
                                        <p class="text-sm text-orange-600">📋 평가표: ${evalTemplate.name}</p>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="flex space-x-2 ml-4">
                                <button onclick="moveStageUnified(${index}, 'up')"
                                        ${index === 0 ? 'disabled' : ''}
                                        class="p-1 text-gray-600 hover:text-blue-600 disabled:text-gray-300"
                                        title="위로 이동">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                    </svg>
                                </button>
                                <button onclick="moveStageUnified(${index}, 'down')"
                                        ${index === window.composedStages.length - 1 ? 'disabled' : ''}
                                        class="p-1 text-gray-600 hover:text-blue-600 disabled:text-gray-300"
                                        title="아래로 이동">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <button onclick="editStageUnified(${index})"
                                        class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                        title="편집">
                                    편집
                                </button>
                                <button onclick="removeStageUnified(${index})"
                                        class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                                        title="삭제">
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 구성된 단계 목록 새로고침
function refreshComposedStagesUnified() {
    const container = document.getElementById('composed-stages-list-unified');
    if (container) {
        container.innerHTML = renderComposedStagesUnified();
    }

    // Update save button state
    const saveBtn = document.getElementById('unified-save-btn');
    if (saveBtn) {
        const hasStages = window.composedStages && window.composedStages.length > 0;
        saveBtn.disabled = !hasStages;
        saveBtn.className = `px-4 py-2 rounded-md ${!hasStages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#009DE8] text-white hover:bg-opacity-90'}`;
        saveBtn.textContent = `저장 (${window.composedStages.length}개 단계)`;
    }

    // Update header count
    const header = document.querySelector('.flex-1.p-6 h4');
    if (header) {
        header.textContent = `구성된 단계 (${window.composedStages.length}개)`;
    }
}

// 워크플로우 저장
function saveUnifiedWorkflow() {
    const name = document.getElementById('workflow-name').value.trim();
    const degree = document.getElementById('workflow-degree').value;

    if (!name) {
        alert('워크플로우 이름을 입력해주세요.');
        return;
    }

    if (!window.composedStages || window.composedStages.length === 0) {
        alert('최소 1개 이상의 단계를 추가해주세요.');
        return;
    }

    // Validate review stages have evaluation templates
    const reviewStagesWithoutTemplate = window.composedStages.filter(stage => {
        const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
        return stepType.type === 'review' && !stage.evaluationTemplateId;
    });

    if (reviewStagesWithoutTemplate.length > 0) {
        alert('모든 심사 단계에 평가표를 지정해주세요.');
        return;
    }

    const isEdit = window.currentWorkflowId !== null;

    if (isEdit) {
        // Update existing workflow
        const workflow = mockThesisStages.find(s => s.id === window.currentWorkflowId);
        if (workflow) {
            workflow.name = name;
            workflow.degree = degree;
            workflow.stages = JSON.parse(JSON.stringify(window.composedStages));
            showToast('워크플로우가 수정되었습니다.', 'success');
        }
    } else {
        // Create new workflow
        const newId = 'WF' + String(mockThesisStages.length + 1).padStart(3, '0');
        mockThesisStages.push({
            id: newId,
            name: name,
            degree: degree,
            stages: JSON.parse(JSON.stringify(window.composedStages))
        });
        showToast('워크플로우가 등록되었습니다.', 'success');
    }

    // Clear global variables
    window.composedStages = null;
    window.currentWorkflowId = null;

    // Navigate back to list
    switchView('stageManagement');
}

// 전역으로 노출
window.openAddStageModal = openAddStageModal;
window.editStageUnified = editStageUnified;
window.removeStageUnified = removeStageUnified;
window.moveStageUnified = moveStageUnified;
window.renderComposedStagesUnified = renderComposedStagesUnified;
window.refreshComposedStagesUnified = refreshComposedStagesUnified;
window.saveUnifiedWorkflow = saveUnifiedWorkflow;

// ====================================================================
// 권한 관리 함수들
// ====================================================================

// 역할 권한 보기
function viewRolePermissions(roleId) {
    window.selectedRoleForMapping = roleId;
    switchView('rolePermissionMapping');
}

// 역할-권한 매핑 화면 로드
function loadRolePermissions(roleId) {
    window.selectedRoleForMapping = roleId;

    const rolePermission = mockRolePermissions.find(rp => rp.roleId === roleId);
    const selectedPermissions = rolePermission ? rolePermission.permissionIds : [];

    const categories = {
        menu: '메뉴 접근 권한',
        feature: '기능 실행 권한',
        data: '데이터 레벨 권한',
        admin: '관리자 전용 권한'
    };

    const container = document.getElementById('permission-checkboxes');
    if (!container) return;

    container.innerHTML = Object.entries(categories).map(([categoryKey, categoryName]) => `
        <div class="border border-gray-200 rounded-lg p-4">
            <h5 class="font-bold text-gray-800 mb-3 flex items-center">
                <span class="w-2 h-2 rounded-full bg-[#009DE8] mr-2"></span>
                ${categoryName}
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${mockPermissions
                    .filter(p => p.category === categoryKey)
                    .map(perm => `
                        <label class="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox"
                                   value="${perm.id}"
                                   ${selectedPermissions.includes(perm.id) ? 'checked' : ''}
                                   class="mt-1 mr-3 rounded border-gray-300 text-[#009DE8] focus:ring-[#009DE8]">
                            <div class="flex-1">
                                <div class="font-medium text-sm text-gray-800">${perm.name}</div>
                                <div class="text-xs text-gray-500">${perm.description}</div>
                            </div>
                        </label>
                    `).join('')}
            </div>
        </div>
    `).join('');
}

// 역할-권한 저장
function saveRolePermissions() {
    const roleId = document.getElementById('role-select').value;
    const checkboxes = document.querySelectorAll('#permission-checkboxes input[type="checkbox"]:checked');
    const permissionIds = Array.from(checkboxes).map(cb => cb.value);

    // mockRolePermissions 업데이트
    const index = mockRolePermissions.findIndex(rp => rp.roleId === roleId);
    if (index >= 0) {
        mockRolePermissions[index].permissionIds = permissionIds;
    } else {
        mockRolePermissions.push({ roleId, permissionIds });
    }

    showToast('권한이 저장되었습니다.', 'success');

    // 역할 관리 화면으로 돌아가기
    setTimeout(() => {
        switchView('roleManagement');
    }, 500);
}

// 역할 추가 모달
function openRoleModal(roleId = null) {
    const isEdit = roleId !== null;
    const role = isEdit ? mockRoles.find(r => r.id === roleId) : null;

    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">역할명 *</label>
                <input type="text"
                       id="role-name"
                       value="${role ? role.name : ''}"
                       placeholder="예: 행정직원, 교직원"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009DE8]">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">역할 코드 *</label>
                <input type="text"
                       id="role-code"
                       value="${role ? role.code : ''}"
                       placeholder="예: staff, instructor"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009DE8]">
                <p class="text-xs text-gray-500 mt-1">영문 소문자, 숫자, 언더스코어만 사용</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea id="role-description"
                          rows="3"
                          placeholder="역할에 대한 설명을 입력하세요"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009DE8]">${role ? role.description : ''}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">권한 레벨 *</label>
                <select id="role-level"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009DE8]">
                    <option value="1" ${role && role.level === 1 ? 'selected' : ''}>1 - 최상위 (관리자)</option>
                    <option value="2" ${role && role.level === 2 ? 'selected' : ''}>2 - 상위 (교수, 직원)</option>
                    <option value="3" ${role && role.level === 3 ? 'selected' : ''}>3 - 일반 (학생)</option>
                    <option value="4" ${role && role.level === 4 ? 'selected' : ''}>4 - 제한적</option>
                </select>
            </div>
        </div>
    `;

    openModal(isEdit ? '역할 수정' : '역할 추가', content, '저장', () => {
        const name = document.getElementById('role-name').value.trim();
        const code = document.getElementById('role-code').value.trim();
        const description = document.getElementById('role-description').value.trim();
        const level = parseInt(document.getElementById('role-level').value);

        if (!name || !code) {
            alert('역할명과 코드를 입력해주세요.');
            return false;
        }

        // 코드 검증
        if (!/^[a-z0-9_]+$/.test(code)) {
            alert('역할 코드는 영문 소문자, 숫자, 언더스코어만 사용할 수 있습니다.');
            return false;
        }

        // 중복 체크
        const existingRole = mockRoles.find(r => r.code === code && r.id !== roleId);
        if (existingRole) {
            alert('이미 사용 중인 역할 코드입니다.');
            return false;
        }

        if (isEdit) {
            // 수정
            const roleIndex = mockRoles.findIndex(r => r.id === roleId);
            if (roleIndex >= 0) {
                mockRoles[roleIndex] = {
                    ...mockRoles[roleIndex],
                    name,
                    code,
                    description,
                    level
                };
                showToast('역할이 수정되었습니다.', 'success');
            }
        } else {
            // 신규 생성
            const newId = 'ROLE_CUSTOM_' + Date.now();
            mockRoles.push({
                id: newId,
                name,
                code,
                description,
                level,
                isSystem: false
            });
            showToast('역할이 추가되었습니다.', 'success');
        }

        // 화면 새로고침
        switchView('roleManagement');
        return true;
    });
}

// 역할 수정
function editRole(roleId) {
    openRoleModal(roleId);
}

// 역할 삭제
function deleteRole(roleId) {
    const role = mockRoles.find(r => r.id === roleId);
    if (!role) return;

    if (role.isSystem) {
        alert('시스템 역할은 삭제할 수 없습니다.');
        return;
    }

    if (!confirm(`"${role.name}" 역할을 삭제하시겠습니까?\n\n이 역할을 사용하는 사용자가 있다면 문제가 발생할 수 있습니다.`)) {
        return;
    }

    // 역할 삭제
    const roleIndex = mockRoles.findIndex(r => r.id === roleId);
    if (roleIndex >= 0) {
        mockRoles.splice(roleIndex, 1);
    }

    // 역할-권한 매핑 삭제
    const mappingIndex = mockRolePermissions.findIndex(rp => rp.roleId === roleId);
    if (mappingIndex >= 0) {
        mockRolePermissions.splice(mappingIndex, 1);
    }

    showToast('역할이 삭제되었습니다.', 'success');
    switchView('roleManagement');
}

// 전역으로 노출
window.viewRolePermissions = viewRolePermissions;
window.loadRolePermissions = loadRolePermissions;
window.saveRolePermissions = saveRolePermissions;
window.openRoleModal = openRoleModal;
window.editRole = editRole;
window.deleteRole = deleteRole;

// =============================================================================
// ERP 연동 기반 권한 관리 함수
// =============================================================================

/**
 * 권한 관리 탭 전환
 * @param {string} tabName - department, position, roleGroup, individual
 */
function switchPermissionTab(tabName) {
    window.currentPermissionTab = tabName;

    // 탭에 따라 첫 번째 대상 자동 선택
    let firstTargetId = null;
    if (tabName === 'department') {
        firstTargetId = mockDepartments[0]?.id;
    } else if (tabName === 'position') {
        firstTargetId = mockPositions[0]?.id;
    } else if (tabName === 'roleGroup') {
        firstTargetId = mockRoleGroups[0]?.id;
    } else if (tabName === 'individual') {
        firstTargetId = mockUsers[0]?.id;
    }

    window.currentPermissionTargetId = firstTargetId;
    switchView('permissionManagement');
}

/**
 * 권한 대상 선택
 * @param {string} tabName - 탭 이름
 * @param {string} targetId - 대상 ID
 */
function selectPermissionTarget(tabName, targetId) {
    window.currentPermissionTab = tabName;
    window.currentPermissionTargetId = targetId;
    switchView('permissionManagement');
}

/**
 * 권한 매트릭스 초기화
 */
function resetPermissionMatrix() {
    if (confirm('권한 설정을 초기화하시겠습니까?')) {
        // 모든 체크박스 해제
        const checkboxes = document.querySelectorAll('[data-menu][data-crud]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        showAlert('권한 설정이 초기화되었습니다.');
    }
}

/**
 * 권한 매트릭스 저장
 */
function savePermissionMatrix() {
    const currentTab = window.currentPermissionTab || 'department';
    const currentTargetId = window.currentPermissionTargetId;

    if (!currentTargetId) {
        showAlert('대상을 선택해주세요.');
        return;
    }

    // 체크박스에서 권한 수집
    const checkboxes = document.querySelectorAll('[data-menu][data-crud]');
    const permissionsMap = {};

    checkboxes.forEach(checkbox => {
        const menuId = checkbox.getAttribute('data-menu');
        const crudType = checkbox.getAttribute('data-crud');
        const isChecked = checkbox.checked;

        if (!permissionsMap[menuId]) {
            permissionsMap[menuId] = {
                menuId: menuId,
                canRead: false,
                canCreate: false,
                canUpdate: false,
                canDelete: false
            };
        }

        if (crudType === 'R') permissionsMap[menuId].canRead = isChecked;
        else if (crudType === 'C') permissionsMap[menuId].canCreate = isChecked;
        else if (crudType === 'U') permissionsMap[menuId].canUpdate = isChecked;
        else if (crudType === 'D') permissionsMap[menuId].canDelete = isChecked;
    });

    const permissions = Object.values(permissionsMap);

    // 데이터 저장 (mock data 업데이트)
    if (currentTab === 'department') {
        const index = mockDepartmentPermissions.findIndex(dp => dp.departmentId === currentTargetId);
        if (index >= 0) {
            mockDepartmentPermissions[index].permissions = permissions;
        } else {
            mockDepartmentPermissions.push({
                departmentId: currentTargetId,
                permissions: permissions
            });
        }
    } else if (currentTab === 'position') {
        const index = mockPositionPermissions.findIndex(pp => pp.positionId === currentTargetId);
        if (index >= 0) {
            mockPositionPermissions[index].permissions = permissions;
        } else {
            mockPositionPermissions.push({
                positionId: currentTargetId,
                permissions: permissions
            });
        }
    } else if (currentTab === 'roleGroup') {
        const index = mockRoleGroupPermissions.findIndex(rp => rp.roleGroupId === currentTargetId);
        if (index >= 0) {
            mockRoleGroupPermissions[index].permissions = permissions;
        } else {
            mockRoleGroupPermissions.push({
                roleGroupId: currentTargetId,
                permissions: permissions
            });
        }
    } else if (currentTab === 'individual') {
        const index = mockIndividualPermissions.findIndex(ip => ip.userId === currentTargetId);
        if (index >= 0) {
            mockIndividualPermissions[index].permissions = permissions;
        } else {
            mockIndividualPermissions.push({
                userId: currentTargetId,
                permissions: permissions
            });
        }
    }

    showAlert('권한 설정이 저장되었습니다.');
    console.log('권한 저장 완료:', { currentTab, currentTargetId, permissions });
}

/**
 * 사용자 권한 시뮬레이터 모달 열기
 */
function openUserSimulatorModal() {
    const searchValue = document.getElementById('user-simulator-search').value;

    if (!searchValue) {
        showAlert('사용자 이름 또는 사번을 입력하세요.');
        return;
    }

    // 사용자 검색 (간단 구현 - 이름 또는 username 매칭)
    const user = mockUsers.find(u =>
        u.name.includes(searchValue) || u.username.includes(searchValue)
    );

    if (!user) {
        showAlert('사용자를 찾을 수 없습니다.');
        return;
    }

    // 사용자 매핑 정보 가져오기
    const userMapping = mockUserMapping.find(um => um.userId === user.username);
    if (!userMapping) {
        showAlert('사용자 매핑 정보가 없습니다.');
        return;
    }

    // 부서, 신분, 역할그룹 정보 가져오기
    const department = mockDepartments.find(d => d.id === userMapping.departmentId);
    const position = mockPositions.find(p => p.id === userMapping.positionId);
    const roleGroups = userMapping.roleGroupIds.map(rgId =>
        mockRoleGroups.find(rg => rg.id === rgId)
    ).filter(rg => rg);

    // 사용자 상태 가져오기
    const userStatus = mockUserStatus.find(us => us.userId === user.username);

    // 권한 합집합 계산
    const unionPermissions = calculateUnionPermissions(user.username);

    // 권한 출처별 메뉴 수 계산
    const deptPerms = mockDepartmentPermissions.find(dp => dp.departmentId === userMapping.departmentId);
    const posPerms = mockPositionPermissions.find(pp => pp.positionId === userMapping.positionId);
    const roleGroupPerms = userMapping.roleGroupIds.flatMap(rgId =>
        mockRoleGroupPermissions.find(rp => rp.roleGroupId === rgId)?.permissions || []
    );
    const indvPerms = mockIndividualPermissions.find(ip => ip.userId === user.username);

    const deptMenuCount = deptPerms ? deptPerms.permissions.length : 0;
    const posMenuCount = posPerms ? posPerms.permissions.length : 0;
    const roleGroupMenuCount = roleGroupPerms.length;
    const indvMenuCount = indvPerms ? indvPerms.permissions.length : 0;

    // 모달 컨텐츠 생성
    const modalContent = `
        <div>
            <!-- 사용자 정보 -->
            <div class="bg-blue-50 rounded-lg p-4 mb-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-600">이름</span>
                        <div class="font-medium mt-1">${user.name}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">사번/학번</span>
                        <div class="font-medium mt-1">${user.username}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">소속 부서</span>
                        <div class="font-medium mt-1">${department ? `${department.name} (${department.code})` : '-'}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">신분</span>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="font-medium">${position ? position.name : '-'}</span>
                            ${userStatus ? `
                                <span class="text-xs px-2 py-0.5 rounded-full ${
                                    userStatus.status === 'active' ? 'bg-green-100 text-green-800' :
                                    userStatus.status === 'leave' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }">${userStatus.statusName}</span>
                            ` : ''}
                        </div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">역할 그룹</span>
                        <div class="font-medium mt-1">${roleGroups.length > 0 ? roleGroups.map(rg => rg.name).join(', ') : '-'}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">쓰기 권한</span>
                        <div class="font-medium mt-1">
                            ${userStatus && userStatus.canWrite ?
                                '<span class="text-green-600">허용</span>' :
                                '<span class="text-red-600">제한 (휴직/휴학)</span>'}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 권한 출처 -->
            <div class="mb-6">
                <h4 class="font-semibold mb-3">권한 출처</h4>
                <div class="space-y-2">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span class="font-medium">부서별 권한</span>
                        </div>
                        <span class="text-sm text-gray-600">${department ? department.name : '-'} (${deptMenuCount}개 메뉴)</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span class="font-medium">신분별 권한</span>
                        </div>
                        <span class="text-sm text-gray-600">${position ? position.name : '-'} (${posMenuCount}개 메뉴)</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span class="font-medium">역할별 권한</span>
                        </div>
                        <span class="text-sm text-gray-600">${roleGroups.map(rg => rg.name).join(', ') || '-'} (${roleGroupMenuCount}개 메뉴)</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span class="font-medium">개인별 권한</span>
                        </div>
                        <span class="text-sm text-gray-600">특별 권한 (${indvMenuCount}개 메뉴)</span>
                    </div>
                </div>
            </div>

            <!-- 최종 권한 결과 -->
            <div>
                <h4 class="font-semibold mb-3">최종 권한 결과 (합집합)</h4>
                <div class="border rounded-lg max-h-96 overflow-y-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 sticky top-0">
                            <tr>
                                <th class="text-left p-3 border-b">메뉴명</th>
                                <th class="text-center p-3 border-b w-16">조회</th>
                                <th class="text-center p-3 border-b w-16">등록</th>
                                <th class="text-center p-3 border-b w-16">수정</th>
                                <th class="text-center p-3 border-b w-16">삭제</th>
                                <th class="text-left p-3 border-b">출처</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${unionPermissions.map(perm => {
                                const menu = mockMenus.find(m => m.id === perm.menuId);
                                const checkIcon = '<svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
                                const xIcon = '<svg class="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';

                                return `
                                <tr class="border-b">
                                    <td class="p-3">${menu ? menu.name : perm.menuId}</td>
                                    <td class="text-center">${perm.canRead ? checkIcon : xIcon}</td>
                                    <td class="text-center">${perm.canCreate && (!userStatus || userStatus.canWrite) ? checkIcon : xIcon}</td>
                                    <td class="text-center">${perm.canUpdate && (!userStatus || userStatus.canWrite) ? checkIcon : xIcon}</td>
                                    <td class="text-center">${perm.canDelete && (!userStatus || userStatus.canWrite) ? checkIcon : xIcon}</td>
                                    <td class="p-3 text-xs text-gray-600">${perm.sources.join(', ')}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    openModal('사용자 권한 시뮬레이션', modalContent, '', null, false);
}

/**
 * 사용자 권한 합집합 계산
 * @param {string} userId - 사용자 ID
 * @returns {Array} 합집합 권한 목록
 */
function calculateUnionPermissions(userId) {
    const userMapping = mockUserMapping.find(um => um.userId === userId);
    if (!userMapping) return [];

    const permissionsMap = {};

    // 1. 부서별 권한
    const deptPerms = mockDepartmentPermissions.find(dp => dp.departmentId === userMapping.departmentId);
    if (deptPerms) {
        deptPerms.permissions.forEach(perm => {
            if (!permissionsMap[perm.menuId]) {
                permissionsMap[perm.menuId] = {
                    menuId: perm.menuId,
                    canRead: false,
                    canCreate: false,
                    canUpdate: false,
                    canDelete: false,
                    sources: []
                };
            }
            permissionsMap[perm.menuId].canRead = permissionsMap[perm.menuId].canRead || perm.canRead;
            permissionsMap[perm.menuId].canCreate = permissionsMap[perm.menuId].canCreate || perm.canCreate;
            permissionsMap[perm.menuId].canUpdate = permissionsMap[perm.menuId].canUpdate || perm.canUpdate;
            permissionsMap[perm.menuId].canDelete = permissionsMap[perm.menuId].canDelete || perm.canDelete;
            permissionsMap[perm.menuId].sources.push('부서');
        });
    }

    // 2. 신분별 권한
    const posPerms = mockPositionPermissions.find(pp => pp.positionId === userMapping.positionId);
    if (posPerms) {
        posPerms.permissions.forEach(perm => {
            if (!permissionsMap[perm.menuId]) {
                permissionsMap[perm.menuId] = {
                    menuId: perm.menuId,
                    canRead: false,
                    canCreate: false,
                    canUpdate: false,
                    canDelete: false,
                    sources: []
                };
            }
            permissionsMap[perm.menuId].canRead = permissionsMap[perm.menuId].canRead || perm.canRead;
            permissionsMap[perm.menuId].canCreate = permissionsMap[perm.menuId].canCreate || perm.canCreate;
            permissionsMap[perm.menuId].canUpdate = permissionsMap[perm.menuId].canUpdate || perm.canUpdate;
            permissionsMap[perm.menuId].canDelete = permissionsMap[perm.menuId].canDelete || perm.canDelete;
            permissionsMap[perm.menuId].sources.push('신분');
        });
    }

    // 3. 역할그룹별 권한
    userMapping.roleGroupIds.forEach(rgId => {
        const roleGroupPerms = mockRoleGroupPermissions.find(rp => rp.roleGroupId === rgId);
        if (roleGroupPerms) {
            const roleGroup = mockRoleGroups.find(rg => rg.id === rgId);
            roleGroupPerms.permissions.forEach(perm => {
                if (!permissionsMap[perm.menuId]) {
                    permissionsMap[perm.menuId] = {
                        menuId: perm.menuId,
                        canRead: false,
                        canCreate: false,
                        canUpdate: false,
                        canDelete: false,
                        sources: []
                    };
                }
                permissionsMap[perm.menuId].canRead = permissionsMap[perm.menuId].canRead || perm.canRead;
                permissionsMap[perm.menuId].canCreate = permissionsMap[perm.menuId].canCreate || perm.canCreate;
                permissionsMap[perm.menuId].canUpdate = permissionsMap[perm.menuId].canUpdate || perm.canUpdate;
                permissionsMap[perm.menuId].canDelete = permissionsMap[perm.menuId].canDelete || perm.canDelete;
                permissionsMap[perm.menuId].sources.push(`역할(${roleGroup ? roleGroup.name : rgId})`);
            });
        }
    });

    // 4. 개인별 권한
    const indvPerms = mockIndividualPermissions.find(ip => ip.userId === userId);
    if (indvPerms) {
        indvPerms.permissions.forEach(perm => {
            if (!permissionsMap[perm.menuId]) {
                permissionsMap[perm.menuId] = {
                    menuId: perm.menuId,
                    canRead: false,
                    canCreate: false,
                    canUpdate: false,
                    canDelete: false,
                    sources: []
                };
            }
            permissionsMap[perm.menuId].canRead = permissionsMap[perm.menuId].canRead || perm.canRead;
            permissionsMap[perm.menuId].canCreate = permissionsMap[perm.menuId].canCreate || perm.canCreate;
            permissionsMap[perm.menuId].canUpdate = permissionsMap[perm.menuId].canUpdate || perm.canUpdate;
            permissionsMap[perm.menuId].canDelete = permissionsMap[perm.menuId].canDelete || perm.canDelete;
            permissionsMap[perm.menuId].sources.push('개인');
        });
    }

    return Object.values(permissionsMap);
}

// 전역으로 노출
window.switchPermissionTab = switchPermissionTab;
window.selectPermissionTarget = selectPermissionTarget;
window.resetPermissionMatrix = resetPermissionMatrix;
window.savePermissionMatrix = savePermissionMatrix;
window.openUserSimulatorModal = openUserSimulatorModal;
window.calculateUnionPermissions = calculateUnionPermissions;
