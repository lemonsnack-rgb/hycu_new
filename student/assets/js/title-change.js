// ==================== 논문제목 변경 ====================

function renderTitleChange() {
    const currentTitle = DataService.getCurrentTitle();
    const titleChanges = DataService.getTitleChanges();
    const content = document.getElementById('title-change-screen');
    if (!content) return;
    
    content.innerHTML = `
        <!-- 현재 논문 제목 -->
        <div class="card mb-6">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600; color: #1F2937;">
                    📝 현재 논문 제목
                </h3>
                <button onclick="showTitleChangeModal()" class="btn btn-primary">
                    제목 변경 신청하기
                </button>
            </div>
            <div class="card-body">
                <div style="margin-bottom: 1rem;">
                    <label style="font-weight: 600; color: #6B7280; font-size: 0.875rem; display: block; margin-bottom: 0.5rem;">
                        국문 제목
                    </label>
                    <p style="font-size: 1.125rem; color: #1F2937; line-height: 1.6;">
                        ${currentTitle.korean}
                    </p>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="font-weight: 600; color: #6B7280; font-size: 0.875rem; display: block; margin-bottom: 0.5rem;">
                        영문 제목
                    </label>
                    <p style="font-size: 1.125rem; color: #1F2937; line-height: 1.6;">
                        ${currentTitle.english}
                    </p>
                </div>
                <div style="display: flex; gap: 2rem; font-size: 0.875rem; color: #6B7280;">
                    <p>등록일: ${currentTitle.registrationDate}</p>
                    <p>최종 변경일: ${currentTitle.lastModifiedDate}</p>
                </div>
            </div>
        </div>
        
        <!-- 변경 신청 이력 -->
        <div class="card">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600; color: #1F2937;">
                    변경 신청 이력
                </h3>
            </div>
            <div class="card-body">
                ${titleChanges.map((change, index) => `
                    <div style="padding: 1.5rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 1rem; cursor: pointer;"
                         onclick="showTitleChangeDetail(${change.id})">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="font-weight: 600; color: #1F2937;">
                                신청 #${titleChanges.length - index}
                            </h4>
                            <span class="badge ${change.status === '승인' ? 'badge-success' : change.status === '반려' ? 'badge-danger' : 'badge-warning'}">
                                ${change.status}
                            </span>
                        </div>
                        
                        <div style="font-size: 0.875rem; color: #6B7280; margin-bottom: 1rem;">
                            <p>신청일: ${formatDateTime2(change.applicationDate)}</p>
                            ${change.approvalDate ? `<p>처리일: ${formatDateTime2(change.approvalDate)}</p>` : ''}
                        </div>
                        
                        <!-- 변경 전후 -->
                        <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                            <p style="font-size: 0.875rem; font-weight: 600; color: #6B7280; margin-bottom: 0.5rem;">
                                변경 전 ▶ 변경 후
                            </p>
                            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center;">
                                <div>
                                    <p style="font-size: 0.875rem; color: #6B7280; margin-bottom: 0.25rem;">이전</p>
                                    <p style="font-size: 0.875rem; color: #4B5563; font-weight: 500;">
                                        ${change.oldTitle.korean}
                                    </p>
                                </div>
                                <div style="font-size: 1.5rem; color: #6A0028;">→</div>
                                <div>
                                    <p style="font-size: 0.875rem; color: #6B7280; margin-bottom: 0.25rem;">변경</p>
                                    <p style="font-size: 0.875rem; color: #1F2937; font-weight: 600;">
                                        ${change.newTitle.korean}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <button onclick="event.stopPropagation(); showTitleChangeDetail(${change.id})" 
                                class="btn btn-sm btn-secondary" style="margin-top: 0.5rem;">
                            상세보기
                        </button>
                    </div>
                `).join('')}
                
                ${titleChanges.length === 0 ? `
                    <div style="text-align: center; padding: 3rem; color: #9CA3AF;">
                        변경 신청 이력이 없습니다
                    </div>
                ` : ''}
            </div>
        </div>
        
        <!-- 안내사항 -->
        <div class="card" style="background: #EFF6FF; border: 1px solid #BFDBFE;">
            <div class="card-body">
                <h4 style="font-weight: 600; color: #1E40AF; margin-bottom: 0.75rem;">
                    📌 제목 변경 안내
                </h4>
                <ul style="font-size: 0.875rem; color: #1E40AF; padding-left: 1.25rem;">
                    <li style="margin-bottom: 0.5rem;">논문 제목은 연구 진행 중 변경 가능합니다.</li>
                    <li style="margin-bottom: 0.5rem;">변경 신청 후 지도교수의 승인이 필요합니다.</li>
                    <li style="margin-bottom: 0.5rem;">심사 단계별로 제목 변경이 제한될 수 있습니다.</li>
                    <li>최종 심사 이후에는 제목 변경이 불가합니다.</li>
                </ul>
            </div>
        </div>
    `;
}

function showTitleChangeModal() {
    const currentTitle = DataService.getCurrentTitle();

    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>논문제목 변경 신청</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <form id="title-change-form" onsubmit="handleTitleChange(event)">
                        <!-- 현재 제목 -->
                        <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">📝 현재 제목</h4>
                            <div style="margin-bottom: 0.75rem;">
                                <p style="font-size: 0.875rem; color: #6B7280; margin-bottom: 0.25rem;">국문:</p>
                                <p style="font-size: 0.875rem; color: #4B5563;">${currentTitle.korean}</p>
                            </div>
                            <div>
                                <p style="font-size: 0.875rem; color: #6B7280; margin-bottom: 0.25rem;">영문:</p>
                                <p style="font-size: 0.875rem; color: #4B5563;">${currentTitle.english}</p>
                            </div>
                        </div>

                        <!-- 변경할 논문명 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                                변경할 논문명 <span style="color: #EF4444;">*</span>
                            </label>
                            <input type="text" id="new-title" required
                                   style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;"
                                   placeholder="변경할 논문 제목을 입력하세요">
                            <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">권장: 50자 이내</p>
                        </div>

                        <!-- 논문명의 언어 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                                논문명의 언어 <span style="color: #EF4444;">*</span>
                            </label>
                            <select id="title-language" required
                                    style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                                <option value="">선택하세요</option>
                                <option value="한국어">한국어</option>
                                <option value="영어">영어</option>
                                <option value="한국어/영어">한국어/영어</option>
                            </select>
                        </div>

                        <!-- 변경 사유 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                                변경 사유 <span style="color: #EF4444;">*</span>
                            </label>
                            <textarea id="change-reason" required
                                      style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; min-height: 120px; resize: vertical;"
                                      placeholder="제목 변경이 필요한 구체적인 사유를 작성해주세요"></textarea>
                            <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">상세히 작성할수록 승인 가능성이 높아집니다</p>
                        </div>

                        <!-- 주의사항 -->
                        <div style="background: #FEF3C7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #F59E0B;">
                            <p style="font-size: 0.875rem; color: #92400E; font-weight: 600; margin-bottom: 0.5rem;">주의사항</p>
                            <ul style="font-size: 0.75rem; color: #92400E; padding-left: 1.25rem; margin: 0;">
                                <li>제목 변경은 지도교수 및 관리자 승인 후 확정됩니다</li>
                                <li>심사 진행 중인 경우 변경이 제한될 수 있습니다</li>
                                <li>최종 심사 이후에는 제목 변경이 불가합니다</li>
                            </ul>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-secondary">취소</button>
                    <button onclick="document.getElementById('title-change-form').requestSubmit()" class="btn btn-primary">
                        신청하기
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-container').innerHTML = modalContent;
}

function handleTitleChange(event) {
    event.preventDefault();

    const newTitle = document.getElementById('new-title').value;
    const language = document.getElementById('title-language').value;
    const reason = document.getElementById('change-reason').value;

    if (!newTitle || !language || !reason) {
        alert('모든 필수 항목을 입력해주세요');
        return;
    }

    // 실제로는 서버로 전송
    console.log('제목 변경 신청:', { newTitle, language, reason });

    alert('제목 변경 신청이 완료되었습니다.\n관리자의 승인을 기다려주세요.');
    closeModal();
    renderTitleChange();
}

function showTitleChangeDetail(changeId) {
    const change = DataService.getTitleChanges().find(c => c.id === changeId);
    if (!change) return;
    
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>제목 변경 신청 상세</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 기본 정보 -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #E5E7EB;">
                        <div>
                            <p style="font-size: 0.875rem; color: #6B7280;">신청 번호: #${change.id}</p>
                            <p style="font-size: 0.875rem; color: #6B7280;">신청일: ${formatDateTime2(change.applicationDate)}</p>
                            ${change.approvalDate ? `<p style="font-size: 0.875rem; color: #6B7280;">처리일: ${formatDateTime2(change.approvalDate)}</p>` : ''}
                        </div>
                        <span class="badge ${change.status === '승인' ? 'badge-success' : change.status === '반려' ? 'badge-danger' : 'badge-warning'}">
                            ${change.status}
                        </span>
                    </div>
                    
                    <!-- 제목 변경 내역 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">📝 제목 변경 내역</h4>
                        
                        <div style="background: #FEF2F2; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <p style="font-size: 0.875rem; font-weight: 600; color: #991B1B; margin-bottom: 0.5rem;">
                                변경 전
                            </p>
                            <p style="font-size: 0.875rem; color: #4B5563; margin-bottom: 0.5rem;">
                                국문: ${change.oldTitle.korean}
                            </p>
                            <p style="font-size: 0.875rem; color: #4B5563;">
                                영문: ${change.oldTitle.english}
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 1rem 0;">
                            <span style="font-size: 2rem; color: #6A0028;">↓</span>
                        </div>
                        
                        <div style="background: #ECFDF5; padding: 1rem; border-radius: 0.5rem;">
                            <p style="font-size: 0.875rem; font-weight: 600; color: #065F46; margin-bottom: 0.5rem;">
                                변경 후
                            </p>
                            <p style="font-size: 0.875rem; color: #1F2937; font-weight: 600; margin-bottom: 0.5rem;">
                                국문: ${change.newTitle.korean}
                            </p>
                            <p style="font-size: 0.875rem; color: #1F2937; font-weight: 600;">
                                영문: ${change.newTitle.english}
                            </p>
                        </div>
                    </div>
                    
                    <!-- 변경 사유 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">변경 사유</h4>
                        <div style="padding: 1rem; background: #F9FAFB; border-radius: 0.5rem; white-space: pre-line;">
                            ${change.reason}
                        </div>
                    </div>
                    
                    <!-- 교수 의견 -->
                    ${change.professorComment ? `
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">💬 지도교수 의견</h4>
                            <div style="padding: 1rem; background: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 0.5rem;">
                                <p style="font-size: 0.875rem; color: #1E40AF; white-space: pre-line;">
                                    ${change.professorComment}
                                </p>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- 첨부 파일 -->
                    ${change.attachments && change.attachments.length > 0 ? `
                        <div>
                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">📎 첨부 파일</h4>
                            ${change.attachments.map(file => `
                                <div style="padding: 0.75rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                                    <i class="fas fa-file"></i> ${file}
                                    <button onclick="downloadFile('${file}')" class="btn btn-sm btn-secondary" style="float: right;">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

function formatDateTime2(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function downloadFile(filename) {
    alert(`${filename} 다운로드 (데모)`);
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}
