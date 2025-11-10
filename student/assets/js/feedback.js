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
                    <button onclick="alert('문서 업로드')" class="btn-primary">
                        + 피드백 요청
                    </button>
                </div>
            </div>
            
            <div class="card-body" style="padding: 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
                        <tr>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">단계</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">문서명</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">제출일</th>
                            <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151;">피드백상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onclick="openFeedbackViewer()" style="border-bottom: 1px solid #E5E7EB; cursor: pointer; transition: background 0.2s;" 
                            onmouseover="this.style.background='#F9FAFB'" 
                            onmouseout="this.style.background='white'">
                            <td style="padding: 0.75rem 1rem;">
                                <span style="background: #DBEAFE; color: #1E40AF; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">최종논문</span>
                            </td>
                            <td style="padding: 0.75rem 1rem; font-weight: 500; color: #1F2937;">논문_초안.pdf</td>
                            <td style="padding: 0.75rem 1rem; color: #6B7280; font-size: 0.875rem;">2025-11-01</td>
                            <td style="padding: 0.75rem 1rem;">
                                <span style="background: #D1FAE5; color: #065F46; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">피드백 완료</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
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
                        <h4 style="font-size: 0.875rem; font-weight: 700; color: #374151;">피드백</h4>
                    </div>
                    
                    <div style="flex: 1; overflow-y: auto; padding: 1rem;">
                        
                        <!-- 총평 -->
                        <div style="margin-bottom: 1.5rem;">
                            <h5 style="font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem;">💬 총평</h5>
                            
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
                                <textarea id="student-reply-input" 
                                          style="width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: none;"
                                          rows="2"
                                          placeholder="교수님께 질문이나 의견을 작성하세요..."></textarea>
                                <button onclick="addStudentReply()" 
                                        style="margin-top: 0.5rem; font-size: 0.75rem; background: #3B82F6; color: white; padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer;">
                                    댓글 달기
                                </button>
                            </div>
                        </div>
                        
                        <div style="border-top: 1px solid #E5E7EB; padding-top: 1rem;">
                            <h5 style="font-size: 0.75rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem;">📝 페이지 코멘트</h5>
                            
                            <!-- 페이지별 코멘트 -->
                            <div style="background: #F9FAFB; padding: 0.75rem; border-radius: 0.5rem;">
                                <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.75rem; font-weight: 700; color: #1F2937;">김교수</p>
                                        <p style="font-size: 0.75rem; color: #6B7280;">2025-11-02 09:35</p>
                                    </div>
                                    <span style="font-size: 0.75rem; background: #DBEAFE; color: #1E40AF; padding: 0.125rem 0.5rem; border-radius: 0.25rem;">p.3</span>
                                </div>
                                <p style="font-size: 0.875rem; color: #374151;">표본 크기 산정 근거를 추가해주세요.</p>
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

// 학생 댓글 추가
function addStudentReply() {
    const input = document.getElementById('student-reply-input');
    if (input && input.value.trim()) {
        alert('댓글이 등록되었습니다: ' + input.value);
        input.value = '';
    }
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

// Export functions
window.showSubmissionHistory = showSubmissionHistory;
window.downloadSubmission = downloadSubmission;
window.closeHistoryModal = closeHistoryModal;
window.showStudentMessage = showStudentMessage;
window.openFeedbackViewer = openFeedbackViewer;
window.closeFeedbackViewer = closeFeedbackViewer;
window.addStudentReply = addStudentReply;
window.changeTool = changeTool;

console.log('✅ 논문 제출 히스토리 및 피드백 뷰어 기능 로드 완료');
