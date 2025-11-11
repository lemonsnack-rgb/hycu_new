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
        extraBtn.className = `modal-extra-btn px-4 py-2 rounded-md text-sm font-medium ${options.extraButtonClass || 'bg-blue-600 hover:bg-blue-700 text-white'}`;
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
                        <button class="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">다운로드</button>
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
                        ${item.reviewers.map(reviewer => `
                            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                                <div>
                                    <p class="font-medium">${reviewer.name}</p>
                                    <p class="text-sm text-gray-600">${reviewer.role}</p>
                                </div>
                                <div class="text-right">
                                    ${type === 'finalThesis' && reviewer.score ? `
                                        <p class="font-bold text-lg text-[#6A0028]">${reviewer.score}점</p>
                                        <p class="text-sm text-gray-600">${reviewer.comment}</p>
                                    ` : `
                                        <span class="status-badge ${reviewer.status === '검토중' ? 'status-reviewing' : 'status-pending'}">${reviewer.status}</span>
                                    `}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
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
                                <span class="text-2xl font-bold text-[#6A0028]">${item.finalScore}점</span>
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
                        <button class="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">다운로드</button>
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
                        <button class="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">다운로드</button>
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
                            className: 'bg-green-600 hover:bg-green-700 text-white',
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

// ========== 주차별 논문지도 상세보기 ==========
function viewWeeklyGuidanceDetail(studentId) {
    const student = appData.weeklyGuidanceStudents.find(s => s.studentId === studentId);
    if (!student) return;
    
    const records = appData.guidanceRecords
        .filter(r => r.studentId === studentId)
        .sort((a, b) => a.week - b.week);  // 주차 순 정렬
    
    const content = `
        <div class="space-y-6">
            <!-- 학생 기본 정보 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-gray-800 mb-4">학생 정보</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div class="info-row">
                        <div class="info-label">학생명</div>
                        <div class="info-value">${student.studentName} (${student.studentId})</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">전공 / 학위</div>
                        <div class="info-value">${student.major} / ${student.degree}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">지도교수</div>
                        <div class="info-value">${student.advisors.join(', ')}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">총 지도 횟수</div>
                        <div class="info-value font-semibold text-blue-600">${student.guidanceCount}회</div>
                    </div>
                </div>
            </div>
            
            <!-- 지도 활동 내역 -->
            <div>
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-gray-800">주차별 지도 내역</h4>
                    <button onclick="addGuidanceRecord('${studentId}')" 
                            class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        + 지도 추가
                    </button>
                </div>
                
                ${records.length > 0 ? `
                    <div class="space-y-4">
                        ${records.map(record => `
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                            ${record.week}주차
                                        </span>
                                        <span class="ml-2 text-sm text-gray-600">${record.date}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-xs px-2 py-1 rounded ${
                                            record.method === '대면' ? 'bg-green-100 text-green-700' :
                                            record.method === '비대면' ? 'bg-purple-100 text-purple-700' :
                                            'bg-gray-100 text-gray-700'
                                        }">
                                            ${record.method}
                                        </span>
                                        <button onclick="editGuidanceRecord(${record.id})" 
                                                class="text-blue-600 hover:underline text-xs">
                                            수정
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">지도교수:</span>
                                        <span class="text-sm text-gray-800 ml-2">${record.advisor}</span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">지도주제:</span>
                                        <span class="text-sm text-gray-800 ml-2">${record.topic}</span>
                                    </div>
                                    <div>
                                        <span class="text-xs font-semibold text-gray-500">지도내용:</span>
                                        <p class="text-sm text-gray-700 mt-1">${record.content}</p>
                                    </div>
                                    ${record.professorComment ? `
                                        <div class="bg-amber-50 border-l-4 border-amber-400 p-3 mt-2">
                                            <span class="text-xs font-semibold text-amber-800">교수 의견:</span>
                                            <p class="text-sm text-amber-900 mt-1">${record.professorComment}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p class="mt-4 text-sm text-gray-600">등록된 지도 계획이 없습니다</p>
                        <button onclick="addGuidanceRecord('${studentId}')" 
                                class="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                            첫 지도 계획 추가하기
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
    
    openModal(
        `주차별 논문지도 - ${student.studentName}`,
        content,
        '닫기',
        closeModal,
        true
    );
}

// 지도 계획 추가
function addGuidanceRecord(studentId) {
    const student = appData.weeklyGuidanceStudents.find(s => s.studentId === studentId);
    if (!student) return;
    
    const nextWeek = appData.guidanceRecords
        .filter(r => r.studentId === studentId)
        .reduce((max, r) => Math.max(max, r.week), 0) + 1;
    
    const content = `
        <form id="guidance-form" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">주차 *</label>
                    <input type="number" name="week" value="${nextWeek}" min="1"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">지도 날짜 *</label>
                    <input type="date" name="date"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도교수 *</label>
                <select name="advisor" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="">선택하세요</option>
                    ${student.advisors.map(advisor => `<option value="${advisor}">${advisor}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 주제 *</label>
                <input type="text" name="topic" placeholder="예: 연구방법론 개요"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 내용 *</label>
                <textarea name="content" rows="4" placeholder="지도한 내용을 상세히 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                <select name="method" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="">선택하세요</option>
                    <option value="대면">대면</option>
                    <option value="비대면">비대면</option>
                    <option value="이메일">이메일</option>
                    <option value="전화">전화</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">교수 의견 (선택)</label>
                <textarea name="professorComment" rows="3" placeholder="지도 후 교수 의견을 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
        </form>
    `;
    
    openModal(
        '지도 계획 추가',
        content,
        '저장',
        () => {
            const form = document.getElementById('guidance-form');
            const formData = new FormData(form);
            
            // 필수 항목 확인
            if (!formData.get('week') || !formData.get('date') || !formData.get('advisor') || 
                !formData.get('topic') || !formData.get('content') || !formData.get('method')) {
                showAlert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            const newRecord = {
                id: appData.guidanceRecords.length + 1,
                studentId: studentId,
                week: parseInt(formData.get('week')),
                date: formData.get('date'),
                advisor: formData.get('advisor'),
                topic: formData.get('topic'),
                content: formData.get('content'),
                method: formData.get('method'),
                professorComment: formData.get('professorComment') || ''
            };
            
            appData.guidanceRecords.push(newRecord);
            
            // 학생의 지도 횟수 업데이트
            student.guidanceCount = appData.guidanceRecords.filter(r => r.studentId === studentId).length;
            student.lastGuidanceDate = newRecord.date;
            
            closeModal();
            showAlert('지도 계획이 추가되었습니다.');
            
            // 상세 화면 다시 열기
            viewWeeklyGuidanceDetail(studentId);
        },
        true
    );
}

// 지도 계획 수정
function editGuidanceRecord(recordId) {
    const record = appData.guidanceRecords.find(r => r.id === recordId);
    if (!record) return;
    
    const student = appData.weeklyGuidanceStudents.find(s => s.studentId === record.studentId);
    if (!student) return;
    
    const content = `
        <form id="guidance-form" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">주차 *</label>
                    <input type="number" name="week" value="${record.week}" min="1"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">지도 날짜 *</label>
                    <input type="date" name="date" value="${record.date}"
                           class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도교수 *</label>
                <select name="advisor" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    ${student.advisors.map(advisor => 
                        `<option value="${advisor}" ${advisor === record.advisor ? 'selected' : ''}>${advisor}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 주제 *</label>
                <input type="text" name="topic" value="${record.topic}"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 내용 *</label>
                <textarea name="content" rows="4" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>${record.content}</textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">지도 방식 *</label>
                <select name="method" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                    <option value="대면" ${record.method === '대면' ? 'selected' : ''}>대면</option>
                    <option value="비대면" ${record.method === '비대면' ? 'selected' : ''}>비대면</option>
                    <option value="이메일" ${record.method === '이메일' ? 'selected' : ''}>이메일</option>
                    <option value="전화" ${record.method === '전화' ? 'selected' : ''}>전화</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">교수 의견 (선택)</label>
                <textarea name="professorComment" rows="3" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">${record.professorComment || ''}</textarea>
            </div>
        </form>
    `;
    
    openModal(
        '지도 계획 수정',
        content,
        '저장',
        () => {
            const form = document.getElementById('guidance-form');
            const formData = new FormData(form);
            
            record.week = parseInt(formData.get('week'));
            record.date = formData.get('date');
            record.advisor = formData.get('advisor');
            record.topic = formData.get('topic');
            record.content = formData.get('content');
            record.method = formData.get('method');
            record.professorComment = formData.get('professorComment') || '';
            
            // 최근 지도일 업데이트
            const studentRecords = appData.guidanceRecords
                .filter(r => r.studentId === record.studentId)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            student.lastGuidanceDate = studentRecords[0]?.date || null;
            
            closeModal();
            showAlert('지도 계획이 수정되었습니다.');
            
            // 상세 화면 다시 열기
            viewWeeklyGuidanceDetail(record.studentId);
        },
        true
    );
}

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
    const modeClass = readOnly ? 'bg-blue-600' : 'bg-[#6A0028]';
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
                    <span class="font-bold text-lg text-[#6A0028]">${item.impactFactor}</span>
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
                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">다운로드</button>
                    </div>
                    <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span class="flex-1">논문 원문</span>
                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">다운로드</button>
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
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028] focus:border-transparent">
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
                               class="h-4 w-4 text-[#6A0028] rounded border-gray-300 focus:ring-[#6A0028]">
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
                                       class="target-checkbox h-4 w-4 text-[#6A0028] rounded border-gray-300 focus:ring-[#6A0028]" 
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
                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028] focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">종료일 <span class="text-red-600">*</span></label>
                    <input type="date" id="schedule-end" value="${item.endDate || ''}" 
                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028] focus:border-transparent">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea id="schedule-desc" rows="3" 
                          placeholder="일정에 대한 추가 설명을 입력하세요"
                          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028] focus:border-transparent">${item.description || ''}</textarea>
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
                    <select id="req-major" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]" ${isEdit ? 'disabled' : ''}>
                        <option value="">선택하세요</option>
                        <option value="교육공학" ${item.major === '교육공학' ? 'selected' : ''}>교육공학</option>
                        <option value="경영학" ${item.major === '경영학' ? 'selected' : ''}>경영학</option>
                        <option value="컴퓨터공학" ${item.major === '컴퓨터공학' ? 'selected' : ''}>컴퓨터공학</option>
                        <option value="심리학" ${item.major === '심리학' ? 'selected' : ''}>심리학</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">학위과정 <span class="text-red-600">*</span></label>
                    <select id="req-degree" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]" ${isEdit ? 'disabled' : ''}>
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
                            <button onclick="loadRequirementsFromSystem()" class="text-[#6A0028] hover:underline text-sm">
                                기관계 시스템에서 불러오기 →
                            </button>
                        </div>
                    ` : availableRequirements.map(req => {
                        const isChecked = selectedReqs.includes(req.id);
                        return `
                            <label class="flex items-start p-4 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer">
                                <input type="checkbox" 
                                       class="requirement-checkbox mt-1 h-4 w-4 text-[#6A0028] rounded border-gray-300" 
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
                        선택된 요건: <span id="selected-count" class="font-medium text-[#6A0028]">${selectedReqs.length}</span>개
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
                    <select id="stage-major" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
                        <option value="">선택하세요</option>
                        <option value="교육공학" ${item.major === '교육공학' ? 'selected' : ''}>교육공학</option>
                        <option value="경영학" ${item.major === '경영학' ? 'selected' : ''}>경영학</option>
                        <option value="컴퓨터공학" ${item.major === '컴퓨터공학' ? 'selected' : ''}>컴퓨터공학</option>
                        <option value="심리학" ${item.major === '심리학' ? 'selected' : ''}>심리학</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">학위과정 <span class="text-red-600">*</span></label>
                    <select id="stage-degree" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
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
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">버전</label>
                <input type="text" id="stage-version" value="${item.version || 'v1.0'}" 
                       placeholder="예: v1.0"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
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
            const version = document.getElementById('stage-version').value.trim();
            
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
                appData.stages[index].version = version;
                
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
                    version: version,
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
    openStageModal(id);
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
    
    const content = `
        <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-medium text-gray-500">워크플로우명</label>
                        <p class="text-sm font-bold text-gray-800 mt-1">${workflow.name}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">버전</label>
                        <p class="text-sm text-gray-800 mt-1">${workflow.version}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">학과</label>
                        <p class="text-sm text-gray-800 mt-1">${workflow.major}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">학위과정</label>
                        <p class="text-sm text-gray-800 mt-1">${workflow.degree}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-gray-800">단계 구성 (총 ${workflow.stageCount}단계)</h4>
                    <button onclick="addWorkflowStep(${id})" 
                            class="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                        + 단계 추가
                    </button>
                </div>
                <div class="space-y-2">
                    ${workflow.steps.map((step, idx) => `
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
                                        ${step.hasEvaluation ? `
                                            <p class="text-xs text-gray-600 mt-1">
                                                <i class="fas fa-check-circle text-green-600 mr-1"></i>
                                                평가표: ${step.evaluationCriteriaName}
                                            </p>
                                        ` : ''}
                                    </div>
                                </div>
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
                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">학위과정 <span class="text-red-600">*</span></label>
                    <select id="eval-type" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
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
                               class="h-4 w-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]">
                        <span class="ml-2 text-sm text-gray-700">배점 방식 (점수)</span>
                    </label>
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="eval-method" value="passfail" 
                               ${item.evaluationType === 'passfail' ? 'checked' : ''}
                               onchange="toggleEvaluationMethod()"
                               class="h-4 w-4 text-[#6A0028] border-gray-300 focus:ring-[#6A0028]">
                        <span class="ml-2 text-sm text-gray-700">Pass/Fail 방식</span>
                    </label>
                </div>
            </div>
            
            <div id="score-section" ${item.evaluationType === 'passfail' ? 'style="display:none"' : ''}>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">총점 <span class="text-red-600">*</span></label>
                    <input type="number" id="eval-total-score" value="${item.totalScore || 100}" 
                           placeholder="100"
                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
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
                        class="w-full border-2 border-dashed border-gray-300 rounded-md py-2 text-sm text-gray-600 hover:border-[#6A0028] hover:text-[#6A0028] transition-colors">
                    + 평가 항목 추가
                </button>
                
                <div id="score-summary" class="mt-3 text-sm text-gray-600" ${item.evaluationType === 'passfail' ? 'style="display:none"' : ''}>
                    총 배점: <span id="current-total" class="font-bold text-[#6A0028]">0</span>점 / 
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
                       class="item-name w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]" 
                       placeholder="평가 항목명 (예: 연구 주제의 적절성)"
                       value="${item.name || item}"
                       onchange="updateScoreTotal()">
            </div>
            ${showScore ? `
            <div class="w-24">
                <input type="number" 
                       class="item-score w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]" 
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

function openTypeModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? appData.types.find(t => t.id === id) : {};
    
    const content = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">유형명 <span class="text-red-600">*</span></label>
                <input type="text" id="type-name" value="${item.name || ''}" 
                       placeholder="예: 중간논문 심사"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div class="flex">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="text-sm text-blue-700">
                        <p class="font-medium">활성화 설정</p>
                        <p class="mt-1">이 유형을 활성화하면 해당 기능이 학생/교수 화면에 표시됩니다.</p>
                    </div>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">요구 사항</label>
                
                <div class="space-y-2">
                    <label class="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" id="type-presentation" 
                               ${item.presentation ? 'checked' : ''}
                               class="h-4 w-4 text-[#6A0028] rounded border-gray-300">
                        <div class="ml-3">
                            <p class="font-medium text-gray-900">발표 필요</p>
                            <p class="text-xs text-gray-600">학생이 발표를 해야 하는 단계입니다</p>
                        </div>
                    </label>
                    
                    <label class="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" id="type-document" 
                               ${item.document ? 'checked' : ''}
                               class="h-4 w-4 text-[#6A0028] rounded border-gray-300">
                        <div class="ml-3">
                            <p class="font-medium text-gray-900">문서 제출 필요</p>
                            <p class="text-xs text-gray-600">학생이 문서를 제출해야 하는 단계입니다</p>
                        </div>
                    </label>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">설명 (선택)</label>
                <textarea id="type-description" rows="3" 
                          placeholder="이 유형에 대한 설명을 입력하세요"
                          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">${item.description || ''}</textarea>
            </div>
        </div>
    `;
    
    openModal(isEdit ? '유형 수정' : '유형 추가', content, '저장', () => {
        const name = document.getElementById('type-name').value.trim();
        
        if (!name) {
            showAlert('유형명을 입력해주세요.');
            return;
        }
        
        const newItem = {
            id: isEdit ? id : appData.types.length + 1,
            name: name,
            presentation: document.getElementById('type-presentation').checked,
            document: document.getElementById('type-document').checked,
            description: document.getElementById('type-description').value.trim()
        };
        
        if (isEdit) {
            const index = appData.types.findIndex(t => t.id === id);
            appData.types[index] = newItem;
        } else {
            appData.types.push(newItem);
        }
        
        closeModal();
        showAlert(`유형이 ${isEdit ? '수정' : '추가'}되었습니다.`);
        switchView('typeManagement');
    });
}

function editType(id) {
    openTypeModal(id);
}

function deleteType(id) {
    showConfirm('이 유형을 삭제하시겠습니까?\n\n주의: 이미 사용 중인 워크플로우에 영향을 줄 수 있습니다.', () => {
        appData.types = appData.types.filter(t => t.id !== id);
        showAlert('유형이 삭제되었습니다.');
        switchView('typeManagement');
    });
}

// ========== 평가 기준 관리 함수 ==========

function viewEvaluationDetail(id) {
    const criteria = appData.evaluationCriteria.find(c => c.id === id);
    if (!criteria) {
        showAlert('평가표를 찾을 수 없습니다.');
        return;
    }
    
    const content = `
        <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-medium text-gray-500">평가표명</label>
                        <p class="text-sm font-bold text-gray-800 mt-1">${criteria.name}</p>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">생성일</label>
                        <p class="text-sm text-gray-800 mt-1">${criteria.createdDate}</p>
                    </div>
                    <div class="col-span-2">
                        <label class="text-xs font-medium text-gray-500">설명</label>
                        <p class="text-sm text-gray-800 mt-1">${criteria.description}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-gray-800">평가 항목 (총 ${criteria.itemCount}개)</h4>
                    <button onclick="addEvaluationItem(${id})" 
                            class="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
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
                                        <p class="text-xs text-gray-600 mt-1">${item.description}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="text-lg font-bold text-[#6A0028]">${item.score}점</span>
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
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-gray-700">총점</span>
                        <span class="text-2xl font-bold text-[#6A0028]">${criteria.totalScore}점</span>
                    </div>
                </div>
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
            itemCount: 0,
            totalScore: 0,
            createdDate: new Date().toISOString().split('T')[0],
            items: []
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
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    설명
                </label>
                <textarea id="item-description" 
                          placeholder="이 평가 항목에 대한 설명"
                          rows="3"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
        </div>
    `;
    
    openModal('평가 항목 추가', content, '추가', () => {
        const name = document.getElementById('item-name')?.value.trim();
        const score = parseInt(document.getElementById('item-score')?.value);
        const description = document.getElementById('item-description')?.value.trim();
        
        if (!name) {
            showAlert('평가 항목명을 입력하세요.');
            return;
        }
        
        if (!score || score <= 0) {
            showAlert('배점을 입력하세요.');
            return;
        }
        
        const criteria = appData.evaluationCriteria.find(c => c.id === criteriaId);
        if (!criteria) {
            showAlert('평가표를 찾을 수 없습니다.');
            return;
        }
        
        const newItem = {
            id: Date.now(),
            name: name,
            score: score,
            description: description || ''
        };
        
        criteria.items.push(newItem);
        criteria.itemCount = criteria.items.length;
        criteria.totalScore = criteria.items.reduce((sum, item) => sum + item.score, 0);
        
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
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    배점 <span class="text-red-600">*</span>
                </label>
                <input type="number" id="item-score" 
                       value="${item.score}"
                       min="0"
                       max="100"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    설명
                </label>
                <textarea id="item-description" 
                          rows="3"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm">${item.description}</textarea>
            </div>
        </div>
    `;
    
    openModal('평가 항목 수정', content, '저장', () => {
        const name = document.getElementById('item-name')?.value.trim();
        const score = parseInt(document.getElementById('item-score')?.value);
        const description = document.getElementById('item-description')?.value.trim();
        
        if (!name || !score || score <= 0) {
            showAlert('모든 필수 항목을 입력하세요.');
            return;
        }
        
        item.name = name;
        item.score = score;
        item.description = description;
        
        criteria.totalScore = criteria.items.reduce((sum, item) => sum + item.score, 0);
        
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
        criteria.totalScore = criteria.items.reduce((sum, item) => sum + item.score, 0);
        
        showAlert('평가 항목이 삭제되었습니다.');
        viewEvaluationDetail(criteriaId);
    });
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

// Export PDF viewer functions
window.viewPdfFeedback = viewPdfFeedback;
window.closePdfViewer = closePdfViewer;
