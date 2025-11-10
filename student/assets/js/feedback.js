// 온라인피드백 - 교수용 PDF 뷰어 레이아웃 동일 (판서 도구만 제거)

// PDF.js 워커 설정
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
}

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0;
let currentTool = 'select';

function renderFeedback() {
    const content = document.getElementById('feedback-screen');
    if (!content) return;

    // localStorage에서 제출물 불러오기
    const localSubmissions = JSON.parse(localStorage.getItem('feedback_submissions') || '[]');

    // DataService에서 기본 제출물 가져오기
    const defaultSubmissions = DataService.getSubmissions();

    // 두 목록 합치기 (localStorage 우선)
    const submissions = [... localSubmissions, ...defaultSubmissions]
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    content.innerHTML = `
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: #1F2937;">제출한 문서</h2>
                    <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">제출한 문서를 확인하고 교수님의 피드백을 확인하세요</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="showSubmissionHistory()" class="btn btn-secondary">
                        <i class="fas fa-history"></i> 제출 히스토리
                    </button>
                    <button onclick="showSubmissionForm()" class="btn-primary">
                        + 피드백 요청
                    </button>
                </div>
            </div>

            <div class="card-body" style="padding: 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
                        <tr>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">No</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">제목</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">단계</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">제출일</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">상태</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">버전</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${submissions.length === 0 ? `
                            <tr>
                                <td colspan="6" style="padding: 3rem 1rem; text-align: center; color: #9CA3AF;">
                                    제출된 문서가 없습니다. '+ 피드백 요청' 버튼을 클릭하여 문서를 제출하세요.
                                </td>
                            </tr>
                        ` : submissions.map((sub, index) => `
                            <tr onclick="openFeedbackViewer(${sub.id})" style="border-bottom: 1px solid #E5E7EB; cursor: pointer; transition: background 0.2s;"
                                onmouseover="this.style.background='#F9FAFB'"
                                onmouseout="this.style.background='white'">
                                <td style="padding: 0.75rem 1rem; color: #6B7280;">${index + 1}</td>
                                <td style="padding: 0.75rem 1rem; font-weight: 500; color: #1F2937;">${sub.title}</td>
                                <td style="padding: 0.75rem 1rem;">
                                    ${getStageBadge(sub.stage)}
                                </td>
                                <td style="padding: 0.75rem 1rem; color: #6B7280; font-size: 0.875rem;">${formatDate(sub.uploadDate)}</td>
                                <td style="padding: 0.75rem 1rem;">
                                    ${getStatusBadge(sub.status)}
                                </td>
                                <td style="padding: 0.75rem 1rem;">
                                    <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #F3F4F6; color: #6B7280; border-radius: 0.375rem; font-weight: 600;">${sub.version}</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Helper functions
function getStageBadge(stage) {
    const stageColors = {
        '연구계획서 심사': 'background: #DBEAFE; color: #1E40AF;',
        '중간논문': 'background: #FEF3C7; color: #92400E;',
        '최종논문': 'background: #F3E8FF; color: #6B21A8;',
        '최종논문 준비': 'background: #F3E8FF; color: #6B21A8;'
    };
    const style = stageColors[stage] || 'background: #F3F4F6; color: #6B7280;';
    return `<span style="${style} padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${stage}</span>`;
}

function getStatusBadge(status) {
    const statusColors = {
        '피드백 완료': 'background: #D1FAE5; color: #065F46;',
        '검토중': 'background: #FEF3C7; color: #92400E;',
        '대기': 'background: #F3F4F6; color: #6B7280;'
    };
    const style = statusColors[status] || 'background: #F3F4F6; color: #6B7280;';
    return `<span style="${style} padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${status}</span>`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// PDF 뷰어 모달 열기 (교수용과 동일한 레이아웃, 편집 기능은 비활성화)
function openFeedbackViewer() {
    const modal = document.createElement('div');
    modal.id = 'feedback-modal';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 9999; background: rgba(0, 0, 0, 0.8);';

    modal.innerHTML = `
        <div style="background: white; width: 1400px; height: 95vh; max-width: 95vw; margin: 2.5vh auto; border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden;">

            <!-- 헤더 (교수용과 동일) -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #E5E7EB; background: white;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; color: #1F2937;">홍길동 - 논문_초안.pdf</h3>
                    <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 9999px; background: #F3F4F6; color: #6B7280;">v3</span>
                </div>
                <button onclick="closeFeedbackViewer()" style="color: #6B7280; background: none; border: none; cursor: pointer; padding: 0.5rem;">
                    <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- 3분할 레이아웃 (교수용과 동일: 250px - 1fr - 350px) -->
            <div style="display: grid; grid-template-columns: 250px 1fr 350px; flex: 1; overflow: hidden;">

                <!-- 왼쪽: 제출 이력 (교수용과 동일) -->
                <div style="background: #F9FAFB; border-right: 1px solid #E5E7EB; padding: 1rem; overflow-y: auto;">
                    <h4 style="font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem;">제출 이력</h4>
                    <div style="background: white; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #3B82F6; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span style="width: 0.5rem; height: 0.5rem; background: #3B82F6; border-radius: 9999px;"></span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: #374151;">v3 (현재)</span>
                        </div>
                        <p style="font-size: 0.75rem; color: #6B7280;">2025-11-01 15:30</p>
                    </div>
                    <div style="background: white; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #E5E7EB; margin-bottom: 0.5rem; cursor: pointer;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='white'">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span style="width: 0.5rem; height: 0.5rem; background: #9CA3AF; border-radius: 9999px;"></span>
                            <span style="font-size: 0.75rem; font-weight: 600; color: #6B7280;">v2</span>
                        </div>
                        <p style="font-size: 0.75rem; color: #9CA3AF;">2025-10-28 10:15</p>
                    </div>
                    <div style="background: white; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #E5E7EB; cursor: pointer;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='white'">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span style="width: 0.5rem; height: 0.5rem; background: #9CA3AF; border-radius: 9999px;"></span>
                            <span style="font-size: 0.75rem; font-weight: 600; color: #6B7280;">v1</span>
                        </div>
                        <p style="font-size: 0.75rem; color: #9CA3AF;">2025-10-21 14:00</p>
                    </div>
                </div>

                <!-- 중앙: PDF 뷰어 (교수용과 동일 UI, 편집 도구는 비활성화) -->
                <div style="background: #F3F4F6; display: flex; flex-direction: column;">

                    <!-- 툴바 (교수용과 동일, 편집 도구는 비활성화) -->
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: white; border-bottom: 1px solid #E5E7EB;">

                        <!-- 페이지 네비게이션 -->
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <button id="prev-page" onclick="onPrevPage()" style="padding: 0.5rem; background: none; border: none; border-radius: 0.25rem; cursor: pointer; color: #6B7280;">
                                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            <span style="font-size: 0.875rem; color: #374151;">
                                <span id="page-num">1</span> / <span id="page-count">0</span>
                            </span>
                            <button id="next-page" onclick="onNextPage()" style="padding: 0.5rem; background: none; border: none; border-radius: 0.25rem; cursor: pointer; color: #6B7280;">
                                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>

                        <div style="width: 1px; height: 1.5rem; background: #D1D5DB;"></div>

                        <!-- 도구 (교수용과 동일하나 편집 도구는 비활성화) -->
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <button id="select-tool" onclick="changeTool('select')" title="선택 및 텍스트 드래그"
                                    style="padding: 0.5rem; background: #EFF6FF; border: none; border-radius: 0.25rem; cursor: pointer; color: #1E40AF;">
                                <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
                                </svg>
                            </button>
                            <button id="comment-tool" onclick="showStudentMessage()" title="첨삭 영역 추가 (학생은 사용 불가)" disabled
                                    style="padding: 0.5rem; background: #F3F4F6; border: none; border-radius: 0.25rem; cursor: not-allowed; color: #D1D5DB;">
                                <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM9 9a1 1 0 100-2 1 1 0 000 2zm2 0a1 1 0 100-2 1 1 0 000 2zm2 0a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button id="drawing-tool" onclick="showStudentMessage()" title="판서 (학생은 사용 불가)" disabled
                                    style="padding: 0.5rem; background: #F3F4F6; border: none; border-radius: 0.25rem; cursor: not-allowed; color: #D1D5DB;">
                                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                </svg>
                            </button>
                            <button id="highlight-tool" onclick="showStudentMessage()" title="하이라이트 (학생은 사용 불가)" disabled
                                    style="padding: 0.5rem; background: #F3F4F6; border: none; border-radius: 0.25rem; cursor: not-allowed; color: #D1D5DB;">
                                <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button id="eraser-tool" onclick="showStudentMessage()" title="지우개 (학생은 사용 불가)" disabled
                                    style="padding: 0.5rem; background: #F3F4F6; border: none; border-radius: 0.25rem; cursor: not-allowed; color: #D1D5DB;">
                                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 9.656a2 2 0 000-2.828L15.172 1a2 2 0 00-2.828 0L3 12z" />
                                </svg>
                            </button>
                        </div>

                        <div style="width: 1px; height: 1.5rem; background: #D1D5DB;"></div>

                        <!-- 확대/축소 -->
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <button id="zoom-out-btn" onclick="zoomOut()" style="padding: 0.5rem; background: none; border: none; border-radius: 0.25rem; cursor: pointer; color: #6B7280;">
                                <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <span id="zoom-level" style="font-size: 0.75rem; font-weight: 600; color: #374151; width: 3rem; text-align: center;">100%</span>
                            <button id="zoom-in-btn" onclick="zoomIn()" style="padding: 0.5rem; background: none; border: none; border-radius: 0.25rem; cursor: pointer; color: #6B7280;">
                                <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button id="fit-page-btn" onclick="fitPage()" style="padding: 0.5rem 0.75rem; background: none; border: none; border-radius: 0.25rem; cursor: pointer; color: #6B7280; font-size: 0.75rem;">
                                맞춤
                            </button>
                        </div>
                    </div>

                    <!-- PDF 렌더링 영역 (교수용과 동일) -->
                    <div id="pdf-render-wrapper" style="flex: 1; overflow: auto; display: flex; justify-content: center; padding: 1rem;">
                        <div id="pdf-render-area" style="position: relative; background: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <canvas id="pdf-canvas"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- 오른쪽: 코멘트 패널 (350px, 학생용 수정) -->
                <div style="background: white; border-left: 1px solid #E5E7EB; display: flex; flex-direction: column; overflow: hidden;">
                    <div style="padding: 1rem; border-bottom: 1px solid #E5E7EB; background: #F9FAFB;">
                        <h4 style="font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem;">피드백</h4>

                        <!-- 탭 UI (교수용과 동일) -->
                        <div style="display: flex; gap: 0.25rem; border-bottom: 1px solid #E5E7EB;">
                            <button id="tab-general" onclick="switchFeedbackTab('general')"
                                    style="flex: 1; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; color: #3B82F6; border: none; border-bottom: 2px solid #3B82F6; background: white; cursor: pointer;">
                                전체 평가
                            </button>
                            <button id="tab-inline" onclick="switchFeedbackTab('inline')"
                                    style="flex: 1; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; color: #6B7280; border: none; border-bottom: 2px solid transparent; background: white; cursor: pointer;">
                                첨삭 <span id="tab-inline-badge" style="display: inline-block; background: #EF4444; color: white; font-size: 0.625rem; padding: 0.125rem 0.375rem; border-radius: 9999px; margin-left: 0.25rem;">2</span>
                            </button>
                        </div>
                    </div>

                    <div style="flex: 1; overflow-y: auto; padding: 1rem;" id="comment-panel-content">

                        <!-- 전체 평가 탭 -->
                        <div id="general-feedback-tab">
                            <h5 style="font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem;">💬 전체 평가</h5>

                            <!-- 교수 피드백 (읽기 전용) -->
                            <div style="background: #F9FAFB; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                                <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.75rem; font-weight: 700; color: #1F2937;">김교수</p>
                                        <p style="font-size: 0.75rem; color: #6B7280;">2025-11-02 09:30</p>
                                    </div>
                                </div>
                                <p style="font-size: 0.875rem; color: #374151;">전반적으로 잘 작성되었습니다. 연구 방법론 부분에서 표본 크기 산정 근거를 더 명확히 제시해주세요.</p>
                            </div>

                            <!-- 학생 댓글 입력 -->
                            <div style="margin-top: 0.75rem;">
                                <textarea id="student-general-reply-input"
                                          style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: none;"
                                          rows="2"
                                          placeholder="교수님께 질문이나 의견을 작성하세요..."></textarea>
                                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                                    <button onclick="addStudentReply('general')"
                                            style="font-size: 0.75rem; background: #3B82F6; color: white; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                                        <svg style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                        </svg>
                                        <span>등록</span>
                                    </button>
                                    <button onclick="uploadAttachment('general')"
                                            style="font-size: 0.75rem; background: #F3F4F6; color: #374151; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                                        <svg style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                        </svg>
                                        <span>첨부</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 첨삭 탭 -->
                        <div id="inline-feedback-tab" style="display: none;">
                            <h5 style="font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem;">📍 첨삭</h5>

                            <!-- 첨삭 1 -->
                            <div style="background: #F9FAFB; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem; border-left: 3px solid #3B82F6;">
                                <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.75rem; font-weight: 700; color: #1F2937;">김교수</p>
                                        <p style="font-size: 0.75rem; color: #6B7280;">2025-11-02 09:35</p>
                                    </div>
                                    <span style="font-size: 0.75rem; background: #DBEAFE; color: #1E40AF; padding: 0.125rem 0.5rem; border-radius: 0.25rem;">p.3</span>
                                </div>
                                <p style="font-size: 0.875rem; color: #374151; margin-bottom: 0.5rem;">표본 크기 산정 근거를 추가해주세요.</p>

                                <!-- 학생 댓글 입력 -->
                                <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #E5E7EB;">
                                    <textarea id="student-inline-reply-input-1"
                                              style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: none;"
                                              rows="2"
                                              placeholder="답변을 작성하세요..."></textarea>
                                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                                        <button onclick="addStudentReply('inline', 1)"
                                                style="font-size: 0.75rem; background: #3B82F6; color: white; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                                            <svg style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                            </svg>
                                            <span>등록</span>
                                        </button>
                                        <button onclick="uploadAttachment('inline', 1)"
                                                style="font-size: 0.75rem; background: #F3F4F6; color: #374151; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                                            <svg style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                            </svg>
                                            <span>첨부</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- 첨삭 2 -->
                            <div style="background: #F9FAFB; padding: 0.75rem; border-radius: 0.5rem; border-left: 3px solid #3B82F6;">
                                <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.75rem; font-weight: 700; color: #1F2937;">김교수</p>
                                        <p style="font-size: 0.75rem; color: #6B7280;">2025-11-02 10:15</p>
                                    </div>
                                    <span style="font-size: 0.75rem; background: #DBEAFE; color: #1E40AF; padding: 0.125rem 0.5rem; border-radius: 0.25rem;">p.5</span>
                                </div>
                                <p style="font-size: 0.875rem; color: #374151; margin-bottom: 0.5rem;">이 부분은 선행 연구와의 차이점을 더 명확히 기술해야 합니다.</p>

                                <!-- 학생 댓글 입력 -->
                                <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #E5E7EB;">
                                    <textarea id="student-inline-reply-input-2"
                                              style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: none;"
                                              rows="2"
                                              placeholder="답변을 작성하세요..."></textarea>
                                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                                        <button onclick="addStudentReply('inline', 2)"
                                                style="font-size: 0.75rem; background: #3B82F6; color: white; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                                            <svg style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                            </svg>
                                            <span>등록</span>
                                        </button>
                                        <button onclick="uploadAttachment('inline', 2)"
                                                style="font-size: 0.75rem; background: #F3F4F6; color: #374151; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                                            <svg style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                            </svg>
                                            <span>첨부</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // ESC 키로 닫기
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            closeFeedbackViewer();
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
    
    // PDF 로드
    setTimeout(() => loadPDF(), 100);
}

// PDF 로드 (샘플 PDF)
function loadPDF() {
    const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
    
    pdfjsLib.getDocument(url).promise.then(function(pdf) {
        pdfDoc = pdf;
        document.getElementById('page-count').textContent = pdf.numPages;
        renderPage(pageNum);
    }).catch(function(error) {
        console.error('PDF 로드 오류:', error);
        // 오류 시 기본 캔버스 표시
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 800;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 600, 800);
        ctx.fillStyle = '#333';
        ctx.font = '20px Arial';
        ctx.fillText('샘플 PDF 로드 중...', 50, 50);
    });
}

// PDF 페이지 렌더링
function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then(function(page) {
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');
        const viewport = page.getViewport({scale: scale});
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        page.render(renderContext).promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
    
    document.getElementById('page-num').textContent = num;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// 페이지 이동
function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pdfDoc && pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

// 확대/축소
function zoomIn() {
    scale += 0.25;
    document.getElementById('zoom-level').textContent = Math.round(scale * 100) + '%';
    renderPage(pageNum);
}

function zoomOut() {
    if (scale <= 0.5) return;
    scale -= 0.25;
    document.getElementById('zoom-level').textContent = Math.round(scale * 100) + '%';
    renderPage(pageNum);
}

function fitPage() {
    scale = 1.0;
    document.getElementById('zoom-level').textContent = '100%';
    renderPage(pageNum);
}

// 도구 변경 (선택 도구만 활성화)
function changeTool(tool) {
    currentTool = tool;
    // 버튼 활성화 상태 업데이트
    document.querySelectorAll('[id$="-tool"]').forEach(btn => {
        if (btn.id === `${tool}-tool`) {
            btn.style.background = '#EFF6FF';
            btn.style.color = '#1E40AF';
        } else if (!btn.disabled) {
            btn.style.background = 'none';
            btn.style.color = '#6B7280';
        }
    });
}

// 학생에게 편집 불가 메시지 표시
function showStudentMessage() {
    alert('학생은 PDF 편집 도구를 사용할 수 없습니다.\n\n오른쪽 패널의 댓글 기능만 사용 가능합니다.');
}

// 탭 전환 기능
function switchFeedbackTab(tab) {
    // 탭 버튼 스타일 업데이트
    const generalTab = document.getElementById('tab-general');
    const inlineTab = document.getElementById('tab-inline');

    if (tab === 'general') {
        generalTab.style.color = '#3B82F6';
        generalTab.style.borderBottom = '2px solid #3B82F6';
        inlineTab.style.color = '#6B7280';
        inlineTab.style.borderBottom = '2px solid transparent';

        // 탭 콘텐츠 표시/숨김
        document.getElementById('general-feedback-tab').style.display = 'block';
        document.getElementById('inline-feedback-tab').style.display = 'none';
    } else {
        inlineTab.style.color = '#3B82F6';
        inlineTab.style.borderBottom = '2px solid #3B82F6';
        generalTab.style.color = '#6B7280';
        generalTab.style.borderBottom = '2px solid transparent';

        // 탭 콘텐츠 표시/숨김
        document.getElementById('general-feedback-tab').style.display = 'none';
        document.getElementById('inline-feedback-tab').style.display = 'block';
    }
}

// 학생 댓글 추가
function addStudentReply(type, commentId) {
    let inputId;

    if (type === 'general') {
        inputId = 'student-general-reply-input';
    } else {
        inputId = `student-inline-reply-input-${commentId}`;
    }

    const input = document.getElementById(inputId);
    if (input && input.value.trim()) {
        alert('댓글이 등록되었습니다: ' + input.value);
        input.value = '';
    } else {
        alert('댓글 내용을 입력해주세요.');
    }
}

// 파일 첨부 기능
function uploadAttachment(type, commentId) {
    // 파일 선택 input 동적 생성
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png';
    fileInput.style.display = 'none';

    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 체크 (10MB 제한)
            if (file.size > 10 * 1024 * 1024) {
                alert('파일 크기는 10MB 이하여야 합니다.');
                return;
            }

            alert(`파일이 첨부되었습니다: ${file.name}\n\n실제 업로드는 댓글 등록 시 함께 처리됩니다.`);

            // 파일 정보를 댓글 입력 영역에 표시
            let inputId;
            if (type === 'general') {
                inputId = 'student-general-reply-input';
            } else {
                inputId = `student-inline-reply-input-${commentId}`;
            }

            const input = document.getElementById(inputId);
            if (input) {
                const currentValue = input.value;
                input.value = currentValue + (currentValue ? '\n\n' : '') + `📎 ${file.name}`;
            }
        }
        document.body.removeChild(fileInput);
    };

    document.body.appendChild(fileInput);
    fileInput.click();
}

// 모달 닫기
function closeFeedbackViewer() {
    const modal = document.getElementById('feedback-modal');
    if (modal) modal.remove();
    pdfDoc = null;
    pageNum = 1;
    scale = 1.0;
}

// ==================== 논문 제출 히스토리 ====================

// 제출 히스토리 모달
function showSubmissionHistory() {
    const submissions = DataService.getSubmissions();
    
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>논문 제출 히스토리</h3>
                    <button onclick="closeHistoryModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1rem;">
                        <p style="font-size: 0.875rem; color: #6B7280;">
                            총 ${submissions.length}개 버전이 제출되었습니다.
                        </p>
                    </div>
                    
                    <!-- 히스토리 타임라인 -->
                    <div style="position: relative;">
                        ${submissions.map((sub, index) => `
                            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; ${index === submissions.length - 1 ? '' : 'padding-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB;'}">
                                <!-- 타임라인 라인 -->
                                <div style="display: flex; flex-direction: column; align-items: center;">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${sub.isLatest ? '#6A0028' : '#10B981'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem;">
                                        ${sub.version}
                                    </div>
                                    ${index < submissions.length - 1 ? `
                                        <div style="width: 2px; flex: 1; background: #E5E7EB; min-height: 60px;"></div>
                                    ` : ''}
                                </div>
                                
                                <!-- 히스토리 내용 -->
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 0.5rem;">
                                        <div>
                                            <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 0.25rem;">
                                                ${sub.title}
                                                ${sub.isLatest ? '<span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #6A0028; color: white; border-radius: 0.25rem; margin-left: 0.5rem;">최신</span>' : ''}
                                            </h4>
                                            <p style="font-size: 0.875rem; color: #6B7280;">
                                                ${sub.uploadDate}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <p style="font-size: 0.875rem; color: #4B5563; margin-bottom: 0.75rem;">
                                        ${sub.description}
                                    </p>
                                    
                                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.75rem; color: #6B7280; margin-bottom: 0.75rem;">
                                        <span><i class="fas fa-file-pdf"></i> ${sub.fileSize}</span>
                                        <span><i class="fas fa-file-alt"></i> ${sub.pageCount} 페이지</span>
                                        <span><i class="fas fa-comment"></i> 피드백 ${sub.feedbackCount}건</span>
                                        ${sub.unreadCount > 0 ? `<span style="color: #EF4444;"><i class="fas fa-bell"></i> 읽지 않음 ${sub.unreadCount}건</span>` : ''}
                                    </div>
                                    
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button onclick="downloadSubmission('${sub.file}')" 
                                                class="btn btn-sm btn-secondary"
                                                style="padding: 0.375rem 0.75rem; font-size: 0.875rem;">
                                            <i class="fas fa-download"></i> 다운로드
                                        </button>
                                        ${sub.feedbackCount > 0 ? `
                                            <button onclick="viewFeedback(${sub.id}); closeHistoryModal();" 
                                                    class="btn btn-sm btn-primary"
                                                    style="padding: 0.375rem 0.75rem; font-size: 0.875rem;">
                                                <i class="fas fa-comments"></i> 피드백 보기
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeHistoryModal()" class="btn btn-primary">닫기</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

// 제출 다운로드
function downloadSubmission(filename) {
    alert(`${filename} 다운로드 (데모)`);
}

// 모달 닫기
function closeHistoryModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// ==================== 피드백 요청 제출 폼 ====================

let selectedFile = null;

function showSubmissionForm() {
    const currentStep = DataService.getCurrentWorkflowStep();

    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>📤 피드백 요청 제출</h3>
                    <button onclick="closeSubmissionForm()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 제목 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            제목 <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="text" id="submission-title"
                               placeholder="문서 제목을 입력하세요 (예: 3장 연구방법론 초안)"
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                    </div>

                    <!-- 워크플로우 단계 선택 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            워크플로우 단계 <span style="color: #EF4444;">*</span>
                        </label>
                        <select id="workflow-step" style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <option value="">단계를 선택하세요</option>
                            <option value="STEP_1" ${currentStep === 'STEP_1' ? 'selected' : ''}>STEP 1 - 연구계획서 작성</option>
                            <option value="STEP_2" ${currentStep === 'STEP_2' ? '' : 'disabled'}>STEP 2 - 연구계획서 심사</option>
                            <option value="STEP_3" ${currentStep === 'STEP_3' ? 'selected' : currentStep > 'STEP_3' ? '' : 'disabled'}>STEP 3 - 논문 작성</option>
                            <option value="STEP_4" ${currentStep === 'STEP_4' ? '' : 'disabled'}>STEP 4 - 중간논문 심사</option>
                            <option value="STEP_5" ${currentStep === 'STEP_5' ? 'selected' : ''}>STEP 5 - 최종논문 작성</option>
                        </select>
                        <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.5rem;">현재 진행 단계: ${getStepName(currentStep)}</p>
                    </div>

                    <!-- 메모 (선택사항) -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            메모 (선택사항)
                        </label>
                        <textarea id="submission-memo"
                                  placeholder="교수님께 전달할 메시지가 있다면 작성하세요"
                                  style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: vertical;"
                                  rows="3"></textarea>
                    </div>

                    <!-- 파일 업로드 -->
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            파일 업로드 <span style="color: #EF4444;">*</span>
                        </label>

                        <!-- 드래그 앤 드롭 영역 -->
                        <div id="drop-zone"
                             ondrop="handleDrop(event)"
                             ondragover="handleDragOver(event)"
                             ondragleave="handleDragLeave(event)"
                             onclick="document.getElementById('file-input').click()"
                             style="border: 2px dashed #D1D5DB; border-radius: 0.5rem; padding: 2rem; text-align: center; background: #F9FAFB; cursor: pointer; transition: all 0.2s;">
                            <svg style="width: 3rem; height: 3rem; margin: 0 auto 1rem; color: #9CA3AF;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p style="font-size: 0.875rem; color: #374151; margin-bottom: 0.5rem; font-weight: 500;">파일을 드래그하거나 클릭하여 업로드</p>
                            <p style="font-size: 0.75rem; color: #6B7280;">PDF, DOCX, HWP, JPG, PNG (최대 10MB)</p>
                        </div>

                        <!-- 숨겨진 파일 input -->
                        <input type="file" id="file-input" accept=".pdf,.docx,.hwp,.jpg,.jpeg,.png" style="display: none;" onchange="handleFileSelect(event)">

                        <!-- 선택된 파일 미리보기 -->
                        <div id="file-preview" style="display: none; margin-top: 1rem; padding: 1rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <div id="file-icon" style="width: 2.5rem; height: 2.5rem; background: #EFF6FF; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center;">
                                        <svg style="width: 1.5rem; height: 1.5rem; color: #3B82F6;" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p id="file-name" style="font-size: 0.875rem; font-weight: 500; color: #1F2937; margin: 0;"></p>
                                        <p id="file-size" style="font-size: 0.75rem; color: #6B7280; margin: 0;"></p>
                                    </div>
                                </div>
                                <button onclick="removeSelectedFile()" style="padding: 0.25rem; color: #9CA3AF; background: none; border: none; cursor: pointer;">
                                    <svg style="width: 1.25rem; height: 1.25rem;" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 알림 -->
                    <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 1rem; border-radius: 0.375rem;">
                        <p style="font-size: 0.75rem; color: #1E40AF; margin: 0;">
                            💡 제출한 문서는 교수님께 전달되며, 피드백을 받을 수 있습니다.
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeSubmissionForm()" class="btn btn-secondary">취소</button>
                    <button onclick="submitFeedbackRequest()" class="btn-primary">제출하기</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-container').innerHTML = modalContent;
}

function getStepName(step) {
    const stepNames = {
        'STEP_1': 'STEP 1 - 연구계획서 작성',
        'STEP_2': 'STEP 2 - 연구계획서 심사',
        'STEP_3': 'STEP 3 - 논문 작성',
        'STEP_4': 'STEP 4 - 중간논문 심사',
        'STEP_5': 'STEP 5 - 최종논문 작성'
    };
    return stepNames[step] || step;
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = document.getElementById('drop-zone');
    dropZone.style.borderColor = '#3B82F6';
    dropZone.style.background = '#EFF6FF';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = document.getElementById('drop-zone');
    dropZone.style.borderColor = '#D1D5DB';
    dropZone.style.background = '#F9FAFB';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const dropZone = document.getElementById('drop-zone');
    dropZone.style.borderColor = '#D1D5DB';
    dropZone.style.background = '#F9FAFB';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelection(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFileSelection(file);
    }
}

function handleFileSelection(file) {
    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
    }

    // 파일 확장자 체크
    const allowedExtensions = ['.pdf', '.docx', '.hwp', '.jpg', '.jpeg', '.png'];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isAllowed) {
        alert('허용된 파일 형식: PDF, DOCX, HWP, JPG, PNG');
        return;
    }

    // 파일 저장
    selectedFile = file;

    // 파일 미리보기 표시
    const filePreview = document.getElementById('file-preview');
    const fileNameElement = document.getElementById('file-name');
    const fileSizeElement = document.getElementById('file-size');

    filePreview.style.display = 'block';
    fileNameElement.textContent = file.name;
    fileSizeElement.textContent = formatFileSize(file.size);
}

function removeSelectedFile() {
    selectedFile = null;
    document.getElementById('file-preview').style.display = 'none';
    document.getElementById('file-input').value = '';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function submitFeedbackRequest() {
    // 필드 검증
    const title = document.getElementById('submission-title').value.trim();
    const workflowStep = document.getElementById('workflow-step').value;
    const memo = document.getElementById('submission-memo').value.trim();

    if (!title) {
        alert('제목을 입력해주세요.');
        document.getElementById('submission-title').focus();
        return;
    }

    if (!workflowStep) {
        alert('워크플로우 단계를 선택해주세요.');
        return;
    }

    if (!selectedFile) {
        alert('파일을 업로드해주세요.');
        return;
    }

    // 파일을 base64로 인코딩 (데모용 - 실제로는 서버에 업로드)
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileData = {
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            base64: e.target.result
        };

        // localStorage에 저장
        saveFeedbackSubmission({
            title,
            workflowStep,
            memo,
            file: fileData
        });

        // 모달 닫기
        closeSubmissionForm();

        // 성공 메시지
        alert('✅ 피드백 요청이 제출되었습니다!');

        // 제출 이력 화면으로 이동
        renderFeedback();
    };

    reader.readAsDataURL(selectedFile);
}

function saveFeedbackSubmission(data) {
    // 기존 제출 목록 가져오기
    const submissions = JSON.parse(localStorage.getItem('feedback_submissions') || '[]');

    // 같은 workflowStep의 최신 버전 찾기
    const sameStepSubmissions = submissions.filter(s => s.workflowStep === data.workflowStep);
    const latestVersion = sameStepSubmissions.length > 0
        ? Math.max(...sameStepSubmissions.map(s => parseInt(s.version.replace('v', ''))))
        : 0;
    const newVersion = latestVersion + 1;

    // 새로운 제출 데이터
    const newSubmission = {
        id: 'FB_' + Date.now(),
        studentId: DataService.getStudent().id,
        professorId: DataService.getStudent().advisor,
        title: data.title,
        workflowStep: data.workflowStep,
        stage: getStageFromStep(data.workflowStep),
        file: data.file,
        memo: data.memo,
        status: '대기',
        submittedAt: new Date().toISOString(),
        uploadDate: new Date().toISOString(),
        version: 'v' + newVersion,
        isLatest: true,
        fileSize: formatFileSize(data.file.size),
        pageCount: 0, // PDF 파싱 없이 0으로 설정
        feedbackCount: 0,
        unreadCount: 0,
        comments: [],
        versions: [{ version: 'v' + newVersion, date: new Date().toISOString(), description: '초안' }]
    };

    // 같은 단계의 이전 제출들은 isLatest를 false로 변경
    submissions.forEach(s => {
        if (s.workflowStep === data.workflowStep) {
            s.isLatest = false;
        }
    });

    // 새 제출 추가
    submissions.push(newSubmission);

    // localStorage에 저장
    localStorage.setItem('feedback_submissions', JSON.stringify(submissions));

    // StudentData에도 추가 (현재 세션 중에만 유효)
    if (window.StudentData && window.StudentData.feedbacks) {
        window.StudentData.feedbacks.push(newSubmission);
    }
}

function getStageFromStep(step) {
    const stageMap = {
        'STEP_1': '연구계획서 심사',
        'STEP_2': '연구계획서 심사',
        'STEP_3': '중간논문',
        'STEP_4': '중간논문',
        'STEP_5': '최종논문'
    };
    return stageMap[step] || '기타';
}

function closeSubmissionForm() {
    selectedFile = null;
    document.getElementById('modal-container').innerHTML = '';
}

// Export functions
window.showSubmissionForm = showSubmissionForm;
window.closeSubmissionForm = closeSubmissionForm;
window.handleDragOver = handleDragOver;
window.handleDragLeave = handleDragLeave;
window.handleDrop = handleDrop;
window.handleFileSelect = handleFileSelect;
window.removeSelectedFile = removeSelectedFile;
window.submitFeedbackRequest = submitFeedbackRequest;
window.showSubmissionHistory = showSubmissionHistory;
window.downloadSubmission = downloadSubmission;
window.closeHistoryModal = closeHistoryModal;
window.showStudentMessage = showStudentMessage;
window.openFeedbackViewer = openFeedbackViewer;
window.closeFeedbackViewer = closeFeedbackViewer;
window.addStudentReply = addStudentReply;
window.changeTool = changeTool;
window.switchFeedbackTab = switchFeedbackTab;
window.uploadAttachment = uploadAttachment;

console.log('✅ 논문 제출 히스토리 및 피드백 뷰어 기능 로드 완료');
