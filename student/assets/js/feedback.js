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

    // Mock data - 실제로는 서버에서 가져옴
    const feedbackRequests = [
        {
            id: 1,
            title: '딥러닝 기반 이미지 분류 연구',
            fileName: '논문_최종본.pdf',
            stage: '최종논문',
            submitDate: '2025-11-01',
            status: '피드백 완료'
        },
        {
            id: 2,
            title: '머신러닝 활용 예측 모델 연구',
            fileName: '연구계획서.pdf',
            stage: '연구계획서',
            submitDate: '2025-10-15',
            status: '검토중'
        }
    ];

    content.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">논문 지도 현황</h2>
                <p class="text-sm text-gray-600 mt-2">논문을 제출하고 교수님의 피드백을 받으세요</p>
            </div>
            <button onclick="showFeedbackRequestModal()" class="btn-primary">
                피드백 요청
            </button>
        </div>

        <div class="card">
            <div class="card-body" style="padding: 0;">
                <table class="table-fixed" style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
                        <tr>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">논문명</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">단계</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">파일명</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">제출일</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">피드백 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${feedbackRequests.map(req => `
                            <tr style="border-bottom: 1px solid #E5E7EB; cursor: pointer; transition: background-color 0.2s;"
                                onclick="openFeedbackViewer(${req.id})"
                                onmouseover="this.style.backgroundColor='#F9FAFB'"
                                onmouseout="this.style.backgroundColor='transparent'">
                                <td class="td-truncate-long" style="padding: 0.75rem 1rem; font-weight: 500; color: #1F2937;" title="${req.title}">${req.title}</td>
                                <td style="padding: 0.75rem 1rem;">
                                    <span style="background: #DBEAFE; color: #1E40AF; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${req.stage}</span>
                                </td>
                                <td style="padding: 0.75rem 1rem; color: #6B7280; font-size: 0.875rem;">
                                    <i class="fas fa-file-pdf" style="color: #EF4444;"></i> ${req.fileName}
                                </td>
                                <td style="padding: 0.75rem 1rem; color: #6B7280; font-size: 0.875rem;">${req.submitDate}</td>
                                <td style="padding: 0.75rem 1rem;">
                                    <span style="background: ${req.status === '피드백 완료' ? '#D1FAE5' : '#FEF3C7'}; color: ${req.status === '피드백 완료' ? '#065F46' : '#92400E'}; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${req.status}</span>
                                </td>
                            </tr>
                        `).join('')}
                        ${feedbackRequests.length === 0 ? `
                            <tr>
                                <td colspan="5" style="padding: 3rem; text-align: center; color: #9CA3AF;">
                                    제출한 피드백 요청이 없습니다
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 피드백 요청 모달
function showFeedbackRequestModal() {
    console.log('showFeedbackRequestModal 호출됨 - 버전: 20260112001');
    const modal = document.createElement("div");
    modal.className = "modal-backdrop active";
    modal.id = "feedback-request-modal";

    modal.innerHTML = `
        <div class="modal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>피드백 요청</h3>
                    <button onclick="closeFeedbackRequestModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <form id="feedback-request-form" onsubmit="submitFeedbackRequest(event)">
                        <!-- 논문 제목 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                                논문 제목 <span style="color: #EF4444;">*</span>
                            </label>
                            <input type="text" id="feedback-title" required
                                   style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;"
                                   placeholder="논문 제목을 입력하세요">
                        </div>

                        <!-- 논문 진행 단계 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                                논문 진행 단계 <span style="color: #EF4444;">*</span>
                            </label>
                            <select id="feedback-stage" required
                                    style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                                <option value="">선택하세요</option>
                                <option value="연구계획서">연구계획서</option>
                                <option value="중간논문">중간논문</option>
                                <option value="최종논문">최종논문</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        <!-- 첨부파일 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                                첨부파일 <span style="color: #EF4444;">*</span>
                            </label>
                            <input type="file" id="feedback-file" required accept=".pdf"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                                PDF 파일만 업로드 가능 (최대 30MB)
                            </p>
                        </div>

                        <!-- 피드백 희망일자 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                                피드백 희망일자 <span style="color: #EF4444;">*</span>
                            </label>
                            <input type="date" id="feedback-desired-date" required
                                   style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                                피드백을 받고 싶은 희망 날짜를 선택하세요
                            </p>
                        </div>

                        <!-- 주의사항 -->
                        <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                            <p style="font-weight: 600; color: #1E40AF; margin-bottom: 0.5rem;">안내사항</p>
                            <ul style="font-size: 0.75rem; color: #1E40AF; margin-left: 1rem;">
                                <li>한 번에 하나의 파일만 업로드 가능합니다</li>
                                <li>PDF 파일만 업로드 가능하며, 최대 용량은 30MB입니다</li>
                                <li>교수님의 피드백은 영업일 기준 3-5일 소요됩니다</li>
                            </ul>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button onclick="closeFeedbackRequestModal()" class="btn btn-secondary">취소</button>
                    <button onclick="document.getElementById('feedback-request-form').requestSubmit()" class="btn btn-primary">
                        요청하기
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function submitFeedbackRequest(event) {
    event.preventDefault();

    const title = document.getElementById('feedback-title').value;
    const stage = document.getElementById('feedback-stage').value;
    const file = document.getElementById('feedback-file').files[0];
    const desiredDate = document.getElementById('feedback-desired-date').value;

    if (!file) {
        alert('파일을 선택해주세요');
        return;
    }

    if (!desiredDate) {
        alert('피드백 희망일자를 선택해주세요');
        return;
    }

    // 파일 크기 검증 (30MB = 30 * 1024 * 1024 bytes)
    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('파일 크기는 30MB를 초과할 수 없습니다');
        return;
    }

    // 파일 형식 검증
    if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다');
        return;
    }

    // 실제로는 서버로 전송
    console.log('피드백 요청:', { title, stage, file: file.name, desiredDate });

    alert('피드백 요청이 완료되었습니다');
    closeFeedbackRequestModal();
    renderFeedback();
}

function closeFeedbackRequestModal() {
    const modal = document.getElementById('feedback-request-modal');
    if (modal) {
        modal.remove();
    }
}

// PDF 뷰어 모달 열기 (교수용과 동일한 레이아웃)
function openFeedbackViewer(feedbackId) {
    // 새로운 학생용 피드백 뷰어 UI 사용 (교수용과 동일 구조)
    const modalHTML = renderStudentFeedbackViewerUI(feedbackId || 'current');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    const modal = tempDiv.firstElementChild;

    // 기존 코드는 주석 처리
    /*
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
                    <div style="background: white; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #3B82F6;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span style="width: 0.5rem; height: 0.5rem; background: #3B82F6; border-radius: 9999px;"></span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: #374151;">v3 (현재)</span>
                        </div>
                        <p style="font-size: 0.75rem; color: #6B7280;">2025-11-01</p>
                    </div>
                </div>
                
                <!-- 중앙: PDF 뷰어 (교수용과 동일) -->
                <div style="background: #F3F4F6; display: flex; flex-direction: column;">
                    
                    <!-- 툴바 (판서 도구만 제거) -->
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
                        
                        <!-- 선택 도구만 유지 (판서 도구 제거됨) -->
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <button id="select-tool" onclick="changeTool('select')" 
                                    style="padding: 0.5rem; background: #EFF6FF; border: none; border-radius: 0.25rem; cursor: pointer; color: #1E40AF;">
                                <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
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
                
                <!-- 오른쪽: 코멘트 패널 (350px, 학생용 - 탭 구조) -->
                <div style="background: white; border-left: 1px solid #E5E7EB; display: flex; flex-direction: column; overflow: hidden;">
                    <!-- 탭 헤더 -->
                    <div style="padding: 1rem; border-bottom: 1px solid #E5E7EB; background: #F9FAFB;">
                        <div style="display: flex; border-bottom: 2px solid #E5E7EB;">
                            <button id="tab-general" role="tab" aria-selected="true"
                                    onclick="switchStudentFeedbackTab('general')"
                                    style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; border-bottom: 2px solid #3B82F6; color: #3B82F6; font-weight: 600; font-size: 0.875rem; margin-bottom: -2px;">
                                전체 평가 <span id="tab-general-badge" style="display: inline-block; background: #DBEAFE; color: #1E40AF; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; margin-left: 0.25rem;">1</span>
                            </button>
                            <button id="tab-inline" role="tab" aria-selected="false"
                                    onclick="switchStudentFeedbackTab('inline')"
                                    style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; color: #6B7280; font-weight: 500; font-size: 0.875rem;">
                                첨삭 <span id="tab-inline-badge" style="display: inline-block; background: #E5E7EB; color: #6B7280; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; margin-left: 0.25rem;">1</span>
                            </button>
                        </div>
                    </div>

                    <!-- 탭 컨텐츠 -->
                    <div style="flex: 1; overflow-y: auto; padding: 1rem;" id="comment-panel-content">
                        <!-- 전체 평가 탭 -->
                        <div id="general-feedback-tab">
                            <h5 style="font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem;">💬 전체 평가</h5>

                            <!-- 교수 피드백 (읽기 전용) -->
                            <div id="general-feedback-thread" style="margin-bottom: 1rem;">
                                <div style="background: #F9FAFB; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                                    <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <div style="flex: 1;">
                                            <p style="font-size: 0.75rem; font-weight: 700; color: #1F2937;">김교수</p>
                                            <p style="font-size: 0.75rem; color: #6B7280;">2025-11-02 09:30</p>
                                        </div>
                                    </div>
                                    <p style="font-size: 0.875rem; color: #374151;">전반적으로 잘 작성되었습니다. 연구 방법론 부분에서 표본 크기 산정 근거를 더 명확히 제시해주세요.</p>
                                </div>
                            </div>

                            <!-- 학생 댓글 입력 -->
                            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #E5E7EB;">
                                <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">댓글 작성</label>
                                <textarea id="general-reply-input"
                                          style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: none;"
                                          rows="3"
                                          placeholder="교수님께 질문이나 의견을 작성하세요..."></textarea>
                                <button onclick="addGeneralReply()"
                                        style="margin-top: 0.5rem; font-size: 0.75rem; background: #3B82F6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer; width: 100%;">
                                    <i class="fas fa-comment"></i> 댓글 달기
                                </button>
                            </div>
                        </div>

                        <!-- 첨삭 탭 -->
                        <div id="inline-feedback-tab" style="display: none;">
                            <h5 style="font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem;">📍 첨삭</h5>

                            <!-- 첨삭 코멘트 목록 -->
                            <div id="inline-feedback-list">
                                <!-- 페이지별 첨삭 -->
                                <div style="background: #F9FAFB; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                                    <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <div style="flex: 1;">
                                            <p style="font-size: 0.75rem; font-weight: 700; color: #1F2937;">김교수</p>
                                            <p style="font-size: 0.75rem; color: #6B7280;">2025-11-02 09:35</p>
                                        </div>
                                        <span style="font-size: 0.75rem; background: #DBEAFE; color: #1E40AF; padding: 0.125rem 0.5rem; border-radius: 0.25rem;">p.3</span>
                                    </div>
                                    <p style="font-size: 0.875rem; color: #374151; margin-bottom: 0.5rem;">표본 크기 산정 근거를 추가해주세요.</p>

                                    <!-- 첨삭에 대한 댓글 입력 -->
                                    <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #D1D5DB;">
                                        <textarea id="inline-reply-1"
                                                  style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.75rem; resize: none;"
                                                  rows="2"
                                                  placeholder="이 첨삭에 대한 답변을 작성하세요..."></textarea>
                                        <button onclick="addInlineReply(1)"
                                                style="margin-top: 0.5rem; font-size: 0.75rem; background: #3B82F6; color: white; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer;">
                                            <i class="fas fa-reply"></i> 답변하기
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
    */
    // 주석 처리된 기존 코드 끝

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

// PDF 로드 (샘플 PDF - 교수용과 동일한 annotated PDF)
function loadPDF() {
    const url = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
    
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

// 도구 변경 (선택 도구만 있음)
function changeTool(tool) {
    currentTool = tool;
}

// 탭 전환 함수
function switchStudentFeedbackTab(tabName) {
    // 탭 버튼 스타일 업데이트
    const generalTab = document.getElementById('tab-general');
    const inlineTab = document.getElementById('tab-inline');
    const generalContent = document.getElementById('general-feedback-tab');
    const inlineContent = document.getElementById('inline-feedback-tab');

    if (tabName === 'general') {
        // 전체 평가 탭 활성화
        generalTab.style.borderBottom = '2px solid #3B82F6';
        generalTab.style.color = '#3B82F6';
        generalTab.style.fontWeight = '600';
        generalTab.setAttribute('aria-selected', 'true');

        inlineTab.style.borderBottom = 'none';
        inlineTab.style.color = '#6B7280';
        inlineTab.style.fontWeight = '500';
        inlineTab.setAttribute('aria-selected', 'false');

        generalContent.style.display = 'block';
        inlineContent.style.display = 'none';
    } else if (tabName === 'inline') {
        // 첨삭 탭 활성화
        inlineTab.style.borderBottom = '2px solid #3B82F6';
        inlineTab.style.color = '#3B82F6';
        inlineTab.style.fontWeight = '600';
        inlineTab.setAttribute('aria-selected', 'true');

        generalTab.style.borderBottom = 'none';
        generalTab.style.color = '#6B7280';
        generalTab.style.fontWeight = '500';
        generalTab.setAttribute('aria-selected', 'false');

        generalContent.style.display = 'none';
        inlineContent.style.display = 'block';
    }
}

// 전체 평가 댓글 추가
function addGeneralReply() {
    const input = document.getElementById('general-reply-input');
    if (input && input.value.trim()) {
        const comment = input.value.trim();

        // 댓글을 스레드에 추가
        const thread = document.getElementById('general-feedback-thread');
        const replyHTML = `
            <div style="background: #EFF6FF; padding: 0.75rem; border-radius: 0.5rem; border-left: 3px solid #3B82F6;">
                <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <div style="flex: 1;">
                        <p style="font-size: 0.75rem; font-weight: 700; color: #1F2937;">학생 (나)</p>
                        <p style="font-size: 0.75rem; color: #6B7280;">${new Date().toLocaleString('ko-KR')}</p>
                    </div>
                </div>
                <p style="font-size: 0.875rem; color: #374151;">${comment}</p>
            </div>
        `;
        thread.insertAdjacentHTML('beforeend', replyHTML);

        input.value = '';
        alert('댓글이 등록되었습니다');
    }
}

// 첨삭 댓글 추가
function addInlineReply(annotationId) {
    const input = document.getElementById(`inline-reply-${annotationId}`);
    if (input && input.value.trim()) {
        const comment = input.value.trim();

        // 해당 첨삭 영역에 댓글 추가 (여기서는 alert로 대체)
        alert('첨삭에 대한 답변이 등록되었습니다: ' + comment);
        input.value = '';
    }
}

// 하위 호환성을 위해 유지
function addStudentReply() {
    addGeneralReply();
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
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${sub.isLatest ? '#009DE8' : '#10B981'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem;">
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
                                                ${sub.isLatest ? '<span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #009DE8; color: white; border-radius: 0.25rem; margin-left: 0.5rem;">최신</span>' : ''}
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

// Export functions
window.showSubmissionHistory = showSubmissionHistory;
window.downloadSubmission = downloadSubmission;
window.closeHistoryModal = closeHistoryModal;

console.log('✅ 논문 제출 히스토리 기능 로드 완료');
