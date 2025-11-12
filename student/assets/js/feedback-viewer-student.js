/**
 * 학생용 피드백 뷰어 - 교수용 UI 구조 완전 재현
 * 차이점: 학생은 댓글(답변)만 작성 가능, 메인 피드백/첨삭 작성 불가
 * 왼쪽: 제출 이력 | 중앙: PDF 뷰어 | 오른쪽: 피드백/댓글
 */

// 전역 변수: 학생 댓글 저장
window._studentGeneralReplies = {};
window._studentInlineReplies = {};
window._studentAttachments = [];
window._studentInlineAttachments = {};
window._currentStudentPdfVersion = 'v3';

// 학생용 피드백 뷰어 UI 재정의 (교수용과 동일한 3단 구조)
function renderStudentFeedbackViewerUI(feedbackId) {
    return `
        <div class="modal-backdrop active" id="feedback-modal" style="z-index: 100;">
            <div class="modal-content" style="max-width: 98%; width: 1600px; height: 90vh; max-height: 90vh; display: flex; flex-direction: column;">
                <!-- 헤더 -->
                <div class="modal-header" style="flex-shrink: 0; padding: 1rem; border-bottom: 1px solid #E5E7EB; background: white; display: flex; align-items: center; justify-content: space-between;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <h3 style="font-size: 1.25rem; font-weight: 700; color: #1F2937;">온라인 피드백</h3>
                            <span id="current-version-badge" style="font-size: 0.75rem; padding: 0.25rem 0.625rem; border-radius: 9999px; background: #DBEAFE; color: #1E40AF; font-weight: 600;">v3</span>
                        </div>
                        <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">논문 제목: AI 기반 학습 분석</p>
                    </div>
                    <button onclick="closeFeedbackViewer()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF; line-height: 1;">×</button>
                </div>

                <!-- 본문: 3단 레이아웃 (제출 이력 + PDF + 댓글) -->
                <div style="flex: 1; display: flex; overflow: hidden;">
                    <!-- 왼쪽: 제출 이력 -->
                    <div id="submission-history" style="width: 200px; background: #F9FAFB; border-right: 1px solid #E5E7EB; padding: 1rem; overflow-y: auto; flex-shrink: 0;">
                        <h4 style="font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem;">제출 이력</h4>
                        <ul id="submission-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                            <li data-ver="v3" class="submission-item active" onclick="switchStudentPdfVersion('v3')"
                                style="padding: 0.75rem; background: white; border-left: 3px solid #3B82F6; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;">
                                <div style="font-size: 0.75rem; font-weight: 700; color: #1F2937; margin-bottom: 0.25rem;">
                                    v3 <span style="color: #3B82F6; font-weight: 600;">(현재)</span>
                                </div>
                                <div style="font-size: 0.625rem; color: #6B7280;">2025-11-01 14:30</div>
                                <div style="font-size: 0.625rem; color: #9CA3AF; margin-top: 0.25rem;">3장 추가 및 전체 수정</div>
                            </li>
                            <li data-ver="v2" class="submission-item" onclick="switchStudentPdfVersion('v2')"
                                style="padding: 0.75rem; background: white; border-left: 3px solid #D1D5DB; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;">
                                <div style="font-size: 0.75rem; font-weight: 600; color: #1F2937; margin-bottom: 0.25rem;">v2</div>
                                <div style="font-size: 0.625rem; color: #6B7280;">2025-10-25 16:20</div>
                                <div style="font-size: 0.625rem; color: #9CA3AF; margin-top: 0.25rem;">2장 이론적 배경 보강</div>
                            </li>
                            <li data-ver="v1" class="submission-item" onclick="switchStudentPdfVersion('v1')"
                                style="padding: 0.75rem; background: white; border-left: 3px solid #D1D5DB; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;">
                                <div style="font-size: 0.75rem; font-weight: 600; color: #1F2937; margin-bottom: 0.25rem;">v1</div>
                                <div style="font-size: 0.625rem; color: #6B7280;">2025-10-15 10:00</div>
                                <div style="font-size: 0.625rem; color: #9CA3AF; margin-top: 0.25rem;">초안 작성</div>
                            </li>
                        </ul>
                    </div>

                    <!-- 중앙: PDF 뷰어 -->
                    <div style="flex: 1; display: flex; flex-direction: column; background: #F3F4F6; overflow: hidden;">
                        <!-- PDF 툴바 (학생용은 보기 전용) -->
                        <div style="padding: 0.75rem; background: #FFFFFF; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                            <!-- 페이지 네비게이션 -->
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <button id="prev-page-btn" onclick="changePage(-1)" style="padding: 0.375rem 0.75rem; background: #F3F4F6; border: none; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s;">
                                    <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <span style="font-size: 0.875rem; color: #374151; min-width: 4rem; text-align: center;">
                                    <span id="page-num">1</span> / <span id="page-count">45</span>
                                </span>
                                <button id="next-page-btn" onclick="changePage(1)" style="padding: 0.375rem 0.75rem; background: #F3F4F6; border: none; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s;">
                                    <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div style="width: 1px; height: 1.5rem; background: #D1D5DB;"></div>

                            <!-- 확대/축소 -->
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <button id="zoom-out-btn" onclick="zoomOut()" style="padding: 0.375rem 0.75rem; background: #F3F4F6; border: none; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s;">
                                    <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <span id="zoom-level" style="font-size: 0.75rem; font-weight: 600; color: #374151; width: 3rem; text-align: center;">100%</span>
                                <button id="zoom-in-btn" onclick="zoomIn()" style="padding: 0.375rem 0.75rem; background: #F3F4F6; border: none; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s;">
                                    <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <button id="fit-page-btn" onclick="fitPage()" style="font-size: 0.75rem; padding: 0.375rem 0.75rem; background: #F3F4F6; border: none; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s;">
                                    맞춤
                                </button>
                            </div>
                        </div>

                        <!-- PDF 렌더링 영역 -->
                        <div id="pdf-render-wrapper" style="flex: 1; overflow: auto; display: flex; justify-content: center; padding: 1rem; background: #F3F4F6;">
                            <div id="pdf-render-area" style="position: relative; background: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                                <canvas id="pdf-canvas"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- 오른쪽: 코멘트 패널 (교수용과 동일 구조) -->
                    <div class="comment-panel" style="width: 380px; background: white; border-left: 1px solid #E5E7EB; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;">
                        <div style="padding: 1rem; border-bottom: 1px solid #E5E7EB; background: #F9FAFB; flex-shrink: 0;">
                            <h4 style="font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem;">피드백</h4>
                            <!-- 탭 UI -->
                            <div style="display: flex; border-bottom: 2px solid #E5E7EB;">
                                <button id="tab-general" role="tab" aria-selected="true"
                                        onclick="switchStudentFeedbackTab('general')"
                                        style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; border-bottom: 2px solid #3B82F6; color: #3B82F6; font-weight: 600; font-size: 0.75rem; margin-bottom: -2px; transition: all 0.2s;">
                                    전체 평가
                                </button>
                                <button id="tab-inline" role="tab" aria-selected="false"
                                        onclick="switchStudentFeedbackTab('inline')"
                                        style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; color: #6B7280; font-weight: 500; font-size: 0.75rem; transition: all 0.2s;">
                                    첨삭 <span id="tab-inline-badge" style="display: inline-block; background: #E5E7EB; color: #6B7280; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.625rem; margin-left: 0.25rem;">1</span>
                                </button>
                            </div>
                        </div>

                        <div style="flex: 1; overflow-y: auto; padding: 1rem;" id="comment-panel-content">
                            <!-- 전체 평가 탭 -->
                            <div id="general-feedback-tab">
                                <h5 style="font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem;">💬 전체 평가</h5>
                                <div id="general-feedback-thread" style="margin-bottom: 1rem;">
                                    <!-- 교수님의 메인 피드백 (읽기 전용) -->
                                    <div class="general-main-feedback" style="margin-bottom: 0.75rem;">
                                        <div style="padding: 0.75rem; border: 2px solid #BFDBFE; border-radius: 0.5rem; background: #EFF6FF;">
                                            <div style="font-size: 0.875rem; color: #1F2937; margin-bottom: 0.5rem; white-space: pre-wrap;">전반적으로 잘 작성되었습니다. 연구 방법론 부분에서 표본 크기 산정 근거를 더 명확히 제시해주세요.</div>
                                            <div style="font-size: 0.625rem; color: #6B7280;">김교수 · 2025-11-02 09:30</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 댓글 영역 (선으로 구분) -->
                                <div class="general-replies" style="margin-left: 1rem; padding-left: 1rem; border-left: 2px solid #D1D5DB;">
                                    <h6 style="font-size: 0.75rem; font-weight: 600; color: #6B7280; margin-bottom: 0.5rem;">💬 댓글 (<span id="general-reply-count">0</span>)</h6>

                                    <!-- 등록된 댓글 표시 영역 -->
                                    <div id="general-replies-list" style="margin-bottom: 0.75rem;">
                                        <!-- 댓글이 동적으로 추가됨 -->
                                    </div>

                                    <!-- 댓글 입력창 -->
                                    <div class="general-reply-input">
                                        <textarea id="general-reply-textarea"
                                                  style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.75rem; resize: none;"
                                                  rows="2"
                                                  placeholder="댓글을 입력하세요..."></textarea>
                                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                                            <button onclick="addStudentGeneralReply()"
                                                    style="font-size: 0.75rem; background: #3B82F6; color: white; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; transition: background 0.2s;">
                                                <i class="fas fa-paper-plane"></i>
                                                <span>댓글</span>
                                            </button>
                                            <button onclick="uploadStudentGeneralAttachment()"
                                                    style="font-size: 0.75rem; background: #E5E7EB; color: #374151; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; transition: background 0.2s;">
                                                <i class="fas fa-paperclip"></i>
                                                <span>첨부</span>
                                            </button>
                                        </div>
                                        <input type="file" id="student-general-attach-input" multiple accept=".png,.jpg,.jpeg,.pdf" style="display: none;">
                                        <div id="student-general-attach-display" style="margin-top: 0.5rem; font-size: 0.625rem; color: #6B7280;"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- 첨삭 탭 -->
                            <div id="inline-feedback-tab" style="display: none;">
                                <h5 style="font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem;">📍 첨삭</h5>
                                <div id="inline-feedback-list">
                                    <!-- 첨삭 카드 (클릭 가능) -->
                                    <div class="inline-comment-card" data-page="3" data-annotation-id="1" onclick="jumpToAnnotation(3, 1)"
                                         style="background: #DBEAFE; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; border: 2px solid #93C5FD; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);">
                                        <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                                            <div style="flex: 1;">
                                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                                    <span style="font-size: 0.75rem; font-weight: 700; color: #1E40AF;">김교수</span>
                                                    <span style="font-size: 0.625rem; background: white; color: #1E40AF; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">p.3</span>
                                                </div>
                                                <p style="font-size: 0.625rem; color: #1E3A8A;">2025-11-02 09:35</p>
                                            </div>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #1E3A8A; font-weight: 500;">표본 크기 산정 근거를 추가해주세요.</p>
                                    </div>

                                    <!-- 댓글 영역 (첨삭 카드와 분리) -->
                                    <div class="inline-replies-section" style="margin-left: 1rem; padding-left: 0.75rem; border-left: 3px solid #BFDBFE; margin-bottom: 1.5rem;">
                                        <h6 style="font-size: 0.625rem; font-weight: 600; color: #6B7280; margin-bottom: 0.5rem;">💬 답변 (<span id="inline-reply-count-1">0</span>)</h6>

                                        <!-- 등록된 답변 표시 영역 -->
                                        <div id="inline-replies-list-1" style="margin-bottom: 0.75rem;">
                                            <!-- 답변이 동적으로 추가됨 -->
                                        </div>

                                        <!-- 답변 입력창 -->
                                        <textarea id="inline-reply-textarea-1"
                                                  style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.75rem; resize: none; background: white;"
                                                  rows="2"
                                                  placeholder="이 첨삭에 대한 답변을 작성하세요..."></textarea>
                                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                                            <button onclick="addStudentInlineReply(1)"
                                                    style="font-size: 0.75rem; background: #3B82F6; color: white; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; transition: background 0.2s;">
                                                <i class="fas fa-reply"></i>
                                                <span>댓글</span>
                                            </button>
                                            <button onclick="uploadStudentInlineAttachment(1)"
                                                    style="font-size: 0.75rem; background: #E5E7EB; color: #374151; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; transition: background 0.2s;">
                                                <i class="fas fa-paperclip"></i>
                                                <span>첨부</span>
                                            </button>
                                        </div>
                                        <input type="file" id="student-inline-attach-input-1" multiple accept=".png,.jpg,.jpeg,.pdf" style="display: none;">
                                        <div id="student-inline-attach-display-1" style="margin-top: 0.5rem; font-size: 0.625rem; color: #6B7280;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 버전 전환 함수
function switchStudentPdfVersion(ver) {
    console.log('버전 전환:', ver);

    // 현재 버전 업데이트
    window._currentStudentPdfVersion = ver;

    // 제출 이력 아이템 스타일 업데이트
    const items = document.querySelectorAll('.submission-item');
    items.forEach(item => {
        const itemVer = item.getAttribute('data-ver');
        if (itemVer === ver) {
            item.style.borderLeftColor = '#3B82F6';
            item.classList.add('active');
            const verText = item.querySelector('div:first-child');
            if (verText) {
                verText.innerHTML = `${ver} <span style="color: #3B82F6; font-weight: 600;">(현재)</span>`;
            }
        } else {
            item.style.borderLeftColor = '#D1D5DB';
            item.classList.remove('active');
            const verText = item.querySelector('div:first-child');
            if (verText) {
                verText.textContent = itemVer;
            }
        }
    });

    // 헤더 배지 업데이트
    const badge = document.getElementById('current-version-badge');
    if (badge) {
        badge.textContent = ver;
    }

    // PDF 재로드 (실제 구현 시 버전별 파일 경로 사용)
    console.log(`${ver} PDF 로드 시뮬레이션`);
}

// 탭 전환
function switchStudentFeedbackTab(tab) {
    const generalTab = document.getElementById('general-feedback-tab');
    const inlineTab = document.getElementById('inline-feedback-tab');
    const generalBtn = document.getElementById('tab-general');
    const inlineBtn = document.getElementById('tab-inline');

    if (tab === 'general') {
        generalTab.style.display = 'block';
        inlineTab.style.display = 'none';
        generalBtn.style.borderBottom = '2px solid #3B82F6';
        generalBtn.style.color = '#3B82F6';
        generalBtn.style.fontWeight = '600';
        generalBtn.setAttribute('aria-selected', 'true');
        inlineBtn.style.borderBottom = 'none';
        inlineBtn.style.color = '#6B7280';
        inlineBtn.style.fontWeight = '500';
        inlineBtn.setAttribute('aria-selected', 'false');
    } else {
        generalTab.style.display = 'none';
        inlineTab.style.display = 'block';
        generalBtn.style.borderBottom = 'none';
        generalBtn.style.color = '#6B7280';
        generalBtn.style.fontWeight = '500';
        generalBtn.setAttribute('aria-selected', 'false');
        inlineBtn.style.borderBottom = '2px solid #3B82F6';
        inlineBtn.style.color = '#3B82F6';
        inlineBtn.style.fontWeight = '600';
        inlineBtn.setAttribute('aria-selected', 'true');
    }
}

// 전체 평가 댓글 추가
function addStudentGeneralReply() {
    const textarea = document.getElementById('general-reply-textarea');
    const value = textarea.value.trim();
    if (!value) {
        alert('댓글을 입력하세요.');
        return;
    }

    // 댓글 저장
    window._studentGeneralReplies = window._studentGeneralReplies || {};
    window._studentGeneralReplies['current'] = window._studentGeneralReplies['current'] || [];

    window._studentGeneralReplies['current'].push({
        text: value,
        attach: window._studentAttachments || [],
        ts: Date.now()
    });

    // 렌더링
    renderStudentGeneralReplies();

    // 초기화
    textarea.value = '';
    window._studentAttachments = [];
    document.getElementById('student-general-attach-display').innerHTML = '';
}

// 전체 평가 댓글 렌더링
function renderStudentGeneralReplies() {
    const list = document.getElementById('general-replies-list');
    const count = document.getElementById('general-reply-count');
    const replies = window._studentGeneralReplies['current'] || [];

    count.textContent = replies.length;

    if (replies.length === 0) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = replies.map((reply, idx) => `
        <div class="general-reply-bubble" style="padding: 0.5rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; background: #F9FAFB; margin-bottom: 0.5rem;">
            <div style="font-size: 0.875rem; color: #374151; margin-bottom: 0.25rem; white-space: pre-wrap;">${escapeHtml(reply.text)}</div>
            ${reply.attach && reply.attach.length > 0 ? `
                <div style="font-size: 0.625rem; color: #3B82F6; margin-bottom: 0.25rem;">
                    ${reply.attach.map(a => `<a href="#" class="underline mr-2">${a.name}</a>`).join('')}
                </div>
            ` : ''}
            <div style="font-size: 0.625rem; color: #9CA3AF;">${new Date(reply.ts).toLocaleString('ko-KR')}</div>
        </div>
    `).join('');
}

// 첨삭 답변 추가
function addStudentInlineReply(annotationId) {
    const textarea = document.getElementById(`inline-reply-textarea-${annotationId}`);
    const value = textarea.value.trim();
    if (!value) {
        alert('답변을 입력하세요.');
        return;
    }

    window._studentInlineReplies[annotationId] = window._studentInlineReplies[annotationId] || [];
    window._studentInlineReplies[annotationId].push({
        text: value,
        attach: window._studentInlineAttachments[annotationId] || [],
        ts: Date.now()
    });

    renderStudentInlineReplies(annotationId);
    textarea.value = '';
    window._studentInlineAttachments[annotationId] = [];
    const displayEl = document.getElementById(`student-inline-attach-display-${annotationId}`);
    if (displayEl) displayEl.innerHTML = '';
}

// 첨삭 답변 렌더링
function renderStudentInlineReplies(annotationId) {
    const list = document.getElementById(`inline-replies-list-${annotationId}`);
    const count = document.getElementById(`inline-reply-count-${annotationId}`);
    const replies = window._studentInlineReplies[annotationId] || [];

    count.textContent = replies.length;

    if (replies.length === 0) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = replies.map(reply => `
        <div style="padding: 0.5rem; border: 1px solid #E5E7EB; border-radius: 0.375rem; background: #F9FAFB; margin-bottom: 0.5rem;">
            <div style="font-size: 0.75rem; color: #374151; margin-bottom: 0.25rem; white-space: pre-wrap;">${escapeHtml(reply.text)}</div>
            ${reply.attach && reply.attach.length > 0 ? `
                <div style="font-size: 0.625rem; color: #3B82F6; margin-bottom: 0.25rem;">
                    ${reply.attach.map(a => `<a href="#" class="underline mr-2">${a.name}</a>`).join('')}
                </div>
            ` : ''}
            <div style="font-size: 0.625rem; color: #9CA3AF;">${new Date(reply.ts).toLocaleString('ko-KR')}</div>
        </div>
    `).join('');
}

// 첨부파일 업로드 - 전체 평가
function uploadStudentGeneralAttachment() {
    const input = document.getElementById('student-general-attach-input');
    input.onchange = function() {
        window._studentAttachments = Array.from(input.files).map(f => ({ name: f.name, size: f.size }));
        document.getElementById('student-general-attach-display').innerHTML =
            window._studentAttachments.map(a => `<span style="color: #3B82F6;">${a.name}</span>`).join(', ');
    };
    input.click();
}

// 첨부파일 업로드 - 첨삭
function uploadStudentInlineAttachment(annotationId) {
    const input = document.getElementById(`student-inline-attach-input-${annotationId}`);
    input.onchange = function() {
        window._studentInlineAttachments[annotationId] = Array.from(input.files).map(f => ({ name: f.name, size: f.size }));
        document.getElementById(`student-inline-attach-display-${annotationId}`).innerHTML =
            window._studentInlineAttachments[annotationId].map(a => `<span style="color: #3B82F6;">${a.name}</span>`).join(', ');
    };
    input.click();
}

// 헬퍼 함수
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 페이지 이동 더미 함수 (실제로는 PDF.js와 연동)
function changePage(delta) { console.log('Page change:', delta); }
function zoomIn() { console.log('Zoom in'); }
function zoomOut() { console.log('Zoom out'); }
function fitPage() { console.log('Fit page'); }
function jumpToAnnotation(page, id) { console.log('Jump to:', page, id); }
function closeFeedbackViewer() {
    const modal = document.getElementById('feedback-modal');
    if (modal) modal.remove();
}

// 전역 함수 등록
window.switchStudentFeedbackTab = switchStudentFeedbackTab;
window.switchStudentPdfVersion = switchStudentPdfVersion;
window.addStudentGeneralReply = addStudentGeneralReply;
window.addStudentInlineReply = addStudentInlineReply;
window.uploadStudentGeneralAttachment = uploadStudentGeneralAttachment;
window.uploadStudentInlineAttachment = uploadStudentInlineAttachment;
window.renderStudentFeedbackViewerUI = renderStudentFeedbackViewerUI;
window.closeFeedbackViewer = closeFeedbackViewer;

console.log('✅ 학생용 피드백 뷰어 로드 완료 (교수 UI 구조 - 3단 레이아웃)');
