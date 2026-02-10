// 관리자용 논문 지도 활동 - 상세 화면 (읽기 전용)
// professor-v3/feedback-detail-screen.js를 복사하여 읽기 전용으로 변환

// ==================== 상세 화면 열기 (페이지 전환) ====================
function _viewPdfFeedbackDetail(feedbackId, isReadOnly = true) {
    const request = FeedbackDataService.getFeedbackRequestById(feedbackId);
    if (!request) {
        alert('제출물을 찾을 수 없습니다.');
        console.error('[_viewPdfFeedbackDetail] 제출물을 찾을 수 없음:', feedbackId);
        return;
    }

    const feedbackData = FeedbackDataService.getFeedbackData(feedbackId);
    console.log('[_viewPdfFeedbackDetail] 요청:', request);
    console.log('[_viewPdfFeedbackDetail] 피드백 데이터:', feedbackData);

    // 상세 화면 생성 및 표시 (모달 방식)
    const detailScreen = createFeedbackDetailScreenReadOnly(request, feedbackData);
    document.body.appendChild(detailScreen);

    // 백드롭 클릭으로 닫기
    detailScreen.addEventListener('click', (e) => {
        if (e.target === detailScreen) {
            closeFeedbackDetailScreenReadOnly();
        }
    });

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeFeedbackDetailScreenReadOnly();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // 메모 버튼 표시 로직 - 항상 표시
    setTimeout(() => {
        const memo = request.memo || '';
        const memoBtn = document.getElementById('student-memo-btn');
        console.log('[관리자 메모 버튼] 찾기 시도:', memoBtn);
        if (memoBtn) {
            console.log('[관리자 메모 버튼] 버튼 찾음, 메모 설정');
            memoBtn.setAttribute('data-memo', memo);
            console.log('[관리자 메모 버튼] 메모 데이터 설정 완료:', memo ? '있음' : '없음');
        } else {
            console.error('[관리자 메모 버튼] 버튼을 찾을 수 없습니다!');
        }
    }, 50);

    // PDF 로드
    setTimeout(() => {
        window._currentFeedbackCtx = {id: feedbackId, fileUrl: request.fileUrl, data: feedbackData};

        // 제출 이력 사이드바 생성
        ensureSubmissionSidebarReadOnly();

        initPDFViewerReadOnly(feedbackId, request.fileUrl, feedbackData);

        renderGeneralThreadReadOnly(feedbackId);
        refreshInlineTabMarkerReadOnly();
    }, 100);
}

// ==================== 상세 화면 생성 (읽기 전용) ====================
function createFeedbackDetailScreenReadOnly(request, feedbackData) {
    const screen = document.createElement('div');
    screen.className = 'feedback-detail-screen';
    screen.id = 'feedback-detail-screen';

    screen.innerHTML = `
        <div class="feedback-detail-content">
            <!-- 헤더: 논문 정보 + 표절률 + 읽기전용 배지 + 닫기 버튼 -->
            <div class="px-6 py-3 border-b bg-white">
                <div class="flex items-center justify-between">
                    <!-- 좌측: 논문 정보 -->
                    <div class="text-sm text-gray-700 flex-1 mr-4">
                        <span class="font-semibold">논문명:</span>
                        <span title="${request.thesisTitle || request.documentTitle}">${request.thesisTitle && request.thesisTitle.length > 30 ? request.thesisTitle.substring(0, 30) + '...' : request.thesisTitle || request.documentTitle || '논문명'}</span>
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">지도단계:</span> <span class="text-[#6A0028]">${request.stage || '연구계획서'}</span>
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">학번:</span> ${request.studentNumber || request.studentId || '-'}
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">학부(과)전공:</span> ${request.graduate || '-'} / ${request.major || '-'}
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">성명:</span> ${request.studentName || '-'}
                    </div>

                    <!-- 우측: 표절률 + 읽기 전용 배지 + 닫기 버튼 -->
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <span class="text-xs font-semibold ${getPlagiarismColorClassReadOnly(request.copykillerScore, request.gptkillerScore)}">
                            CopyKiller: ${request.copykillerScore} <span class="text-gray-400 mx-1">/</span> GPT Killer: ${request.gptkillerScore}
                            <a href="#" onclick="downloadPlagiarismReportReadOnly('combined', '${request.id}'); event.preventDefault();" class="ml-2 text-[#6A0028] hover:underline">결과보고서(통합)</a>
                        </span>
                        <span class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium flex items-center gap-1">
                            <i class="fas fa-eye"></i>
                            읽기 전용
                        </span>
                        <button onclick="closeFeedbackDetailScreenReadOnly()"
                                class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 3단 레이아웃 -->
            <div class="feedback-layout">
                <!-- 왼쪽: 제출 이력 -->
                <div class="history-panel">
                    <h4 class="text-sm font-bold text-gray-700 mb-3">제출 이력</h4>
                    <div class="space-y-2">
                        <div class="bg-white p-3 rounded border-l-4 border-[#6A0028]">
                            <!-- 파일명만 표시 (레이블 제거) -->
                            <p class="text-xs text-gray-600 break-words mb-2" title="${request.fileName ? request.fileName.replace(/\.pdf$/i, '') : '파일명 없음'}">
                                ${(() => {
                                    const fileName = request.fileName ? request.fileName.replace(/\.pdf$/i, '') : '파일명 없음';
                                    return fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName;
                                })()}
                            </p>

                            <!-- 제출일시: yyyy-mm-dd hh:mm 형식으로 한 행 표시 -->
                            <p class="text-xs text-gray-600">
                                <span class="font-semibold">제출일시:</span> ${(() => {
                                    const dateStr = request.submitDate || request.uploadDate || '';
                                    if (!dateStr) return '-';
                                    // "yyyy-mm-dd hh:mm:ss" 또는 "yyyy-mm-dd" 형식을 "yyyy-mm-dd hh:mm"로 변환
                                    const parts = dateStr.split(' ');
                                    if (parts.length >= 2) {
                                        const time = parts[1].substring(0, 5); // hh:mm만 추출
                                        return `${parts[0]} ${time}`;
                                    }
                                    return parts[0]; // 날짜만 있는 경우
                                })()}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 중앙: PDF 뷰어 (도구 제거) -->
                <div class="pdf-panel">
                    <!-- 툴바 (읽기 전용 - 네비게이션과 줌만) -->
                    <div class="pdf-toolbar">
                        <!-- 페이지 네비게이션 -->
                        <div class="flex items-center gap-2">
                            <button id="prev-page" class="pdf-toolbar-btn" title="이전 페이지">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            <span class="text-sm text-gray-700">
                                <span id="page-num">1</span> / <span id="page-count">0</span>
                            </span>
                            <button id="next-page" class="pdf-toolbar-btn" title="다음 페이지">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>

                        <div class="w-px h-6 bg-gray-300"></div>

                        <!-- 확대/축소만 유지 (편집 도구 제거) -->
                        <div class="flex items-center gap-2">
                            <button id="zoom-out-btn" class="pdf-toolbar-btn" title="축소">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <span id="zoom-level" class="text-xs font-semibold text-gray-700 w-12 text-center">100%</span>
                            <button id="zoom-in-btn" class="pdf-toolbar-btn" title="확대">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button id="fit-page-btn" class="pdf-toolbar-btn text-xs px-2" title="페이지 맞춤">
                                맞춤
                            </button>
                        </div>
                    </div>

                    <!-- PDF 렌더링 영역 -->
                    <div id="pdf-render-wrapper">
                        <div id="pdf-render-area">
                            <canvas id="pdf-canvas"></canvas>
                            <div id="text-layer"></div>
                            <canvas id="interaction-canvas"></canvas>
                            <div id="marker-container"></div>
                        </div>
                    </div>
                </div>

                <!-- 오른쪽: 피드백 패널 (읽기 전용) -->
                <div class="comment-panel">
                    <div class="p-4 border-b bg-gray-50">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="text-sm font-bold text-gray-700">피드백 조회</h4>
                            <button id="student-memo-btn"
                                    onclick="toggleStudentMemoReadOnly()"
                                    class="text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                                메모
                            </button>
                        </div>
                        <!-- 탭 UI -->
                        <div class="tabs" role="tablist" id="feedback-tabs-container">
                            <button id="tab-general" role="tab" aria-selected="true"
                                    class="tab active" onclick="switchFeedbackTabReadOnly('general')">
                                전체 평가
                            </button>
                            <button id="tab-inline" role="tab" aria-selected="false"
                                    class="tab" onclick="switchFeedbackTabReadOnly('inline')">
                                첨삭 기록 <span id="tab-inline-badge" class="tab-badge hidden">0</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto p-4" id="comment-panel-content">
                        <!-- 전체 평가 탭 (읽기 전용) -->
                        <div id="general-feedback-tab">
                            <div id="general-feedback-thread" class="space-y-2 mb-3">
                                <!-- 동적 렌더링 -->
                            </div>
                        </div>

                        <!-- 첨삭 탭 (읽기 전용) -->
                        <div id="inline-feedback-tab" style="display: none;">
                            <div id="inline-feedback" class="space-y-2">
                                <!-- 동적 렌더링 -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return screen;
}

// ==================== 제출 이력 사이드바 생성 (읽기 전용) ====================
function ensureSubmissionSidebarReadOnly() {
    if (document.getElementById('submission-history')) return;

    const container = document.createElement('div');
    container.id = 'submission-history';
    container.className = 'submission-history';
    container.innerHTML = `
        <div class="sh-header">제출이력</div>
        <ul class="sh-list">
            <li data-ver="v3" class="active"><strong>v3</strong> <span class="sh-meta">최신 · 2025-11-19</span></li>
            <li data-ver="v2"><strong>v2</strong> <span class="sh-meta">2025-11-14</span></li>
            <li data-ver="v1"><strong>v1</strong> <span class="sh-meta">2025-11-07</span></li>
        </ul>
    `;

    // Insert directly into body for fixed positioning to work correctly
    document.body.appendChild(container);

    container.addEventListener('click', (e) => {
        const li = e.target.closest('li[data-ver]');
        if (!li) return;
        container.querySelectorAll('li').forEach(n => n.classList.remove('active'));
        li.classList.add('active');
        const ver = li.getAttribute('data-ver');
        switchPdfVersionReadOnly(ver);
    });

    // current version badge text
    window._currentVersionLabel = function(ver) {
        try {
            container.querySelectorAll('li').forEach(n => n.classList.remove('active'));
            container.querySelector('li[data-ver="'+ver+'"]').classList.add('active');
        } catch(_) {}
    };
}

// ==================== 상세 화면 닫기 (모달 닫기) ====================
function closeFeedbackDetailScreenReadOnly() {
    const screen = document.getElementById('feedback-detail-screen');
    if (screen) {
        screen.remove();
    }

    // PDF 뷰어 관련 정리 (cleanup)
    // 1. 버전 목록(submission-history) 제거
    const submissionHistory = document.getElementById('submission-history');
    if (submissionHistory) {
        submissionHistory.remove();
    }

    // 2. 전역 변수 정리
    if (window._currentVersionLabel) {
        window._currentVersionLabel = null;
    }
    if (window._currentFeedbackCtx) {
        window._currentFeedbackCtx = null;
    }
}

// ==================== 표절률 색상 ====================
function getPlagiarismColorClassReadOnly(copyScore, gptScore) {
    const copyNum = parseInt(copyScore);
    const gptNum = parseInt(gptScore);

    if (copyNum >= 15 || gptNum >= 10) {
        return 'text-red-600';
    } else if (copyNum >= 10 || gptNum >= 7) {
        return 'text-yellow-600';
    }
    return 'text-gray-700';
}

// ==================== 표절 검사 결과보고서 다운로드 ====================
function downloadPlagiarismReportReadOnly(type, requestId) {
    const request = FeedbackDataService.getFeedbackRequestById(requestId);
    if (!request) {
        alert('제출물을 찾을 수 없습니다.');
        return;
    }

    let reportUrl;
    if (type === 'combined') {
        reportUrl = request.copyKillerReportUrl || `https://copykiller.hanyang.ac.kr/report/${requestId}`;
    } else if (type === 'copykiller') {
        reportUrl = request.copyKillerReportUrl || `https://copykiller.hanyang.ac.kr/report/${requestId}`;
    } else if (type === 'gptkiller') {
        reportUrl = request.gptKillerReportUrl || `https://gptkiller.hanyang.ac.kr/report/${requestId}`;
    }

    // 새 창으로 외부 리포트 열기
    window.open(reportUrl, '_blank', 'width=1200,height=800,noopener,noreferrer');
}

// ==================== 탭 전환 (읽기 전용) ====================
function switchFeedbackTabReadOnly(tab) {
    const generalTab = document.getElementById('general-feedback-tab');
    const inlineTab = document.getElementById('inline-feedback-tab');
    const generalBtn = document.getElementById('tab-general');
    const inlineBtn = document.getElementById('tab-inline');

    if (tab === 'general') {
        generalTab.style.display = 'block';
        inlineTab.style.display = 'none';
        generalBtn.classList.add('active');
        generalBtn.setAttribute('aria-selected', 'true');
        inlineBtn.classList.remove('active');
        inlineBtn.setAttribute('aria-selected', 'false');
    } else {
        generalTab.style.display = 'none';
        inlineTab.style.display = 'block';
        generalBtn.classList.remove('active');
        generalBtn.setAttribute('aria-selected', 'false');
        inlineBtn.classList.add('active');
        inlineBtn.setAttribute('aria-selected', 'true');
    }
}

// ==================== 전역 변수 초기화 ====================
window._generalComments = window._generalComments || {};

// ==================== PDF 뷰어 초기화 (읽기 전용) ====================
function initPDFViewerReadOnly(feedbackId, fileUrl, feedbackData) {
    console.log('[READ-ONLY] PDF Viewer 초기화:', feedbackId, fileUrl);

    // PDF.js 워커 설정
    if (typeof pdfjsLib === 'undefined') {
        console.error('PDF.js가 로드되지 않았습니다.');
        alert('PDF 뷰어를 로드할 수 없습니다. 페이지를 새로고침해주세요.');
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js';

    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    let currentScale = 1.0;
    let fabricCanvas = null;
    const annotations = feedbackData && feedbackData.annotations ? {...feedbackData.annotations} : {};

    const elements = {
        canvas: document.getElementById('pdf-canvas'),
        textLayer: document.getElementById('text-layer'),
        interactionCanvas: document.getElementById('interaction-canvas'),
        markerContainer: document.getElementById('marker-container'),
        pdfRenderWrapper: document.getElementById('pdf-render-wrapper'),
        pdfRenderArea: document.getElementById('pdf-render-area'),
        pageNumEl: document.getElementById('page-num'),
        pageCountEl: document.getElementById('page-count'),
        zoomLevelEl: document.getElementById('zoom-level')
    };

    // DOM 요소 확인
    if (!elements.canvas || !elements.interactionCanvas || !elements.pdfRenderWrapper) {
        console.warn('PDF 뷰어 DOM 요소가 없습니다.');
        return;
    }

    // Fabric.js 캔버스 초기화 (읽기 전용)
    if (typeof fabric !== 'undefined') {
        fabricCanvas = new fabric.Canvas(elements.interactionCanvas, {
            isDrawingMode: false,
            perPixelTargetFind: true,
            selection: false
        });
    } else {
        console.warn('Fabric.js가 로드되지 않았습니다. Annotation 표시가 제한됩니다.');
    }

    // 페이지 렌더링 함수
    async function renderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
            return;
        }
        pageRendering = true;

        try {
            const page = await pdfDoc.getPage(num);
            const viewport = page.getViewport({ scale: currentScale });
            const context = elements.canvas.getContext('2d');

            // 캔버스 크기 설정
            elements.canvas.height = viewport.height;
            elements.canvas.width = viewport.width;
            elements.textLayer.style.width = `${viewport.width}px`;
            elements.textLayer.style.height = `${viewport.height}px`;
            elements.markerContainer.style.width = `${viewport.width}px`;
            elements.markerContainer.style.height = `${viewport.height}px`;

            if (fabricCanvas) {
                fabricCanvas.setDimensions({ width: viewport.width, height: viewport.height });
                fabricCanvas.setZoom(currentScale);
            }

            // PDF 렌더링
            const renderTask = page.render({
                canvasContext: context,
                viewport: viewport
            });

            // 텍스트 레이어 렌더링
            const textContent = await page.getTextContent();
            elements.textLayer.innerHTML = '';
            pdfjsLib.renderTextLayer({
                textContent: textContent,
                container: elements.textLayer,
                viewport: viewport,
                textDivs: []
            });

            await renderTask.promise;
            pageRendering = false;

            // 스크롤 위치 초기화
            elements.pdfRenderWrapper.scrollTop = 0;

            // 대기 중인 페이지가 있으면 렌더링
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }

            // 주석 로드 (읽기 전용)
            loadAnnotationsForPage(num);

            // UI 업데이트
            elements.pageNumEl.textContent = num;
            elements.zoomLevelEl.textContent = `${Math.round(currentScale * 100)}%`;
        } catch (error) {
            console.error('페이지 렌더링 오류:', error);
            pageRendering = false;
        }
    }

    // 주석 로드 (읽기 전용)
    function loadAnnotationsForPage(num) {
        if (!fabricCanvas) return;

        // 기존 객체 제거
        fabricCanvas.clear();

        if (annotations[num]) {
            try {
                fabric.util.enlivenObjects(annotations[num], (objects) => {
                    objects.forEach((obj) => {
                        obj.set({
                            selectable: false,  // 읽기 전용: 선택 불가
                            evented: false      // 읽기 전용: 이벤트 불가
                        });
                        fabricCanvas.add(obj);
                    });
                    fabricCanvas.renderAll();
                });
            } catch (error) {
                console.warn('Annotation 로드 오류:', error);
            }
        }

        // 마커 표시
        redrawMarkersForPageReadOnly(num);

        // 첨삭 패널 업데이트
        renderInlineFeedbackReadOnly(num);
    }

    // 마커 표시 (읽기 전용)
    function redrawMarkersForPageReadOnly(num) {
        elements.markerContainer.innerHTML = '';

        if (!annotations[num]) return;

        let commentIndex = 1;
        annotations[num].forEach((annot) => {
            if (annot.customType === 'comment' && annot.comments && annot.comments.length > 0) {
                const marker = document.createElement('div');
                marker.className = 'comment-marker';
                marker.style.left = `${annot.left + annot.width}px`;
                marker.style.top = `${annot.top}px`;
                marker.textContent = commentIndex;
                marker.title = '첨삭 보기';

                // userType에 따른 마커 색상 지정
                if (annot.userType === 'student') {
                    marker.style.backgroundColor = '#3B82F6';  // 파란색
                } else if (annot.userType === 'professor') {
                    marker.style.backgroundColor = '#DC2626';  // 빨간색
                }

                marker.onclick = () => {
                    // 첨삭 탭으로 전환
                    switchFeedbackTabReadOnly('inline');
                    // 해당 첨삭으로 스크롤
                    const commentCard = document.querySelector(`[data-comment-id="${annot.id}"]`);
                    if (commentCard) {
                        commentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        commentCard.classList.add('highlight');
                        setTimeout(() => commentCard.classList.remove('highlight'), 2000);
                    }
                };
                elements.markerContainer.appendChild(marker);
                commentIndex++;
            }
        });
    }

    // 첨삭 패널 렌더링 (읽기 전용)
    function renderInlineFeedbackReadOnly(num) {
        const container = document.getElementById('inline-feedback');
        if (!container) return;

        container.innerHTML = '';

        // 전체 첨삭이 없는지 확인
        const hasAnyAnnotations = Object.keys(annotations).some(pageKey => {
            return annotations[pageKey] && annotations[pageKey].some(a => a.customType === 'comment' && a.comments && a.comments.length > 0);
        });

        if (!hasAnyAnnotations) {
            container.innerHTML = '<div class="text-sm text-gray-500 text-center py-4">첨삭 기록이 없습니다.</div>';
            refreshInlineTabMarkerReadOnly();
            return;
        }

        if (!annotations[num] || annotations[num].length === 0) {
            container.innerHTML = '<p class="text-xs text-gray-400 text-center py-4">이 페이지에 첨삭이 없습니다.</p>';
            refreshInlineTabMarkerReadOnly();
            return;
        }

        let commentIndex = 1;
        annotations[num].forEach((annot) => {
            if (annot.customType === 'comment' && annot.comments && annot.comments.length > 0) {
                const card = document.createElement('div');
                card.className = 'comment-card bg-white border border-gray-200 rounded-lg p-3 mb-3';
                card.setAttribute('data-comment-id', annot.id);

                const mainComment = annot.comments[0];
                const replies = annot.comments.slice(1);

                // userType에 따른 테두리 색상 및 라벨
                const userTypeLabel = annot.userType === 'student' ? ' (학생)' : '';
                const borderColor = annot.userType === 'student' ? '#3B82F6' : '#DC2626';

                card.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-gray-700">첨삭 #${commentIndex}</span>
                        <span class="text-xs text-gray-500">페이지 ${num}</span>
                    </div>
                    <div class="mb-2 border-l-4 pl-2" style="border-color: ${borderColor};">
                        <div class="text-sm text-gray-800 whitespace-pre-wrap">${escapeHtmlReadOnly(mainComment.text)}</div>
                        <div class="text-xs text-gray-500 mt-1">${mainComment.authorName}${userTypeLabel} · ${mainComment.timestamp || ''}</div>
                    </div>
                    ${replies.length > 0 ? `
                        <div class="ml-4 pl-4 border-l-2 border-gray-300 mt-2 space-y-2">
                            ${replies.map(reply => `
                                <div class="text-sm text-gray-700">
                                    <div class="whitespace-pre-wrap">${escapeHtmlReadOnly(reply.text)}</div>
                                    <div class="text-xs text-gray-500 mt-1">${reply.authorName} · ${reply.timestamp || ''}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                `;

                container.appendChild(card);
                commentIndex++;
            }
        });

        refreshInlineTabMarkerReadOnly();
    }

    // 페이지 네비게이션 이벤트
    const prevBtn = document.getElementById('prev-page');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (pageNum > 1) {
                pageNum--;
                renderPage(pageNum);
            }
        });
    }

    const nextBtn = document.getElementById('next-page');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (pdfDoc && pageNum < pdfDoc.numPages) {
                pageNum++;
                renderPage(pageNum);
            }
        });
    }

    // 확대/축소 이벤트
    const zoomInBtn = document.getElementById('zoom-in-btn');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            currentScale = Math.min(3.0, currentScale + 0.2);
            renderPage(pageNum);
        });
    }

    const zoomOutBtn = document.getElementById('zoom-out-btn');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            currentScale = Math.max(0.5, currentScale - 0.2);
            renderPage(pageNum);
        });
    }

    const fitPageBtn = document.getElementById('fit-page-btn');
    if (fitPageBtn) {
        fitPageBtn.addEventListener('click', async () => {
            if (!pdfDoc) return;
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.0 });
            currentScale = (elements.pdfRenderWrapper.clientHeight - 40) / viewport.height;
            renderPage(pageNum);
        });
    }

    // PDF 로드
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    loadingTask.promise.then((pdf) => {
        pdfDoc = pdf;
        elements.pageCountEl.textContent = pdf.numPages;
        renderPage(pageNum);
        console.log('[READ-ONLY] PDF 로드 완료:', pdf.numPages, '페이지');
    }).catch((error) => {
        console.error('PDF 로드 오류:', error);
        alert('PDF 파일을 로드할 수 없습니다.');
    });
}

// ==================== 전체 평가 스레드 렌더링 (읽기 전용) ====================
function renderGeneralThreadReadOnly(feedbackId) {
    const listEl = document.getElementById('general-feedback-thread');
    if (!listEl) return;

    // FeedbackDataService에서 피드백 데이터 가져오기
    const feedbackData = FeedbackDataService.getFeedbackData(feedbackId);
    const items = feedbackData && feedbackData.generalFeedbackThread ? feedbackData.generalFeedbackThread : [];

    console.log('[renderGeneralThreadReadOnly] feedbackId:', feedbackId, 'items:', items);

    // 등록된 평가가 없으면 안내 메시지
    if (items.length === 0) {
        listEl.innerHTML = '<p class="text-xs text-gray-400 text-center py-4">등록된 전체 평가가 없습니다.</p>';
        return;
    }

    // 메인 평가와 댓글 렌더링 (수정/삭제 버튼 제거)
    const mainFeedback = items[0];
    const replies = items.slice(1);

    const att = (mainFeedback.attachments && mainFeedback.attachments.length) ?
                mainFeedback.attachments.map(a=>'<a class="text-[#6A0028] underline mr-2" href="#">'+a.name+'</a>').join('') : '';

    listEl.innerHTML = `
        <!-- 메인 평가 (읽기 전용) -->
        <div class="general-main-feedback">
            <div id="general-main-display">
                <div class="p-3 border-2 border-[#F8BBD9] rounded-lg bg-[#FCE4EC]">
                    <div class="mb-2 text-gray-800 whitespace-pre-wrap">${escapeHtmlReadOnly(mainFeedback.text)}</div>
                    ${att ? '<div class="text-xs text-gray-600 mb-2">'+att+'</div>' : ''}
                    <div class="flex items-center justify-between">
                        <div class="text-[11px] text-gray-500">${mainFeedback.timestamp || ''}</div>
                    </div>
                </div>
            </div>
        </div>

        ${replies.length > 0 ? `
            <!-- 댓글 영역 (읽기 전용) -->
            <div class="general-replies mt-3 ml-4 pl-4 border-l-2 border-gray-300">
                <h6 class="text-xs font-semibold text-gray-600 mb-2">💬 댓글 (${replies.length})</h6>
                <div class="space-y-2">
                    ${replies.map(reply => {
                        const replyAtt = (reply.attachments && reply.attachments.length) ?
                                        reply.attachments.map(a=>'<a class="text-[#6A0028] underline mr-2" href="#">'+a.name+'</a>').join('') : '';
                        return `
                            <div class="general-reply-bubble p-2 border rounded-lg bg-gray-50">
                                <div class="text-sm text-gray-800 mb-1 whitespace-pre-wrap">${escapeHtmlReadOnly(reply.text)}</div>
                                ${replyAtt ? '<div class="text-xs text-gray-600 mb-1">'+replyAtt+'</div>' : ''}
                                <div class="text-[11px] text-gray-400">${reply.timestamp || ''}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        ` : ''}
    `;
}

// ==================== 첨삭 탭 마커 갱신 (읽기 전용) ====================
function refreshInlineTabMarkerReadOnly() {
    const container = document.getElementById('inline-feedback');
    const commentCards = container ? container.querySelectorAll('.comment-card').length : 0;
    const badge = document.getElementById('tab-inline-badge');
    if (!badge) return;
    if (commentCards > 0) {
        badge.textContent = commentCards;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// ==================== PDF 버전 전환 (읽기 전용) ====================
function switchPdfVersionReadOnly(ver) {
    if (!document.getElementById('feedback-detail-screen')) {
        console.warn('PDF 뷰어가 닫혀있습니다. 버전 전환을 중단합니다.');
        return;
    }

    if (window._currentVersionLabel) window._currentVersionLabel(ver);

    if (window._currentFeedbackCtx) {
        initPDFViewerReadOnly(window._currentFeedbackCtx.id, window._currentFeedbackCtx.fileUrl, window._currentFeedbackCtx.data);
    }
}

// ==================== 학생 메모 토글 (읽기 전용) ====================
function toggleStudentMemoReadOnly() {
    const existingPanel = document.getElementById('student-memo-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    const memoBtn = document.getElementById('student-memo-btn');
    const memo = memoBtn ? memoBtn.getAttribute('data-memo') : '';

    if (!memo || memo.trim() === '') {
        alert('메모가 없습니다.');
        return;
    }

    const panel = document.createElement('div');
    panel.id = 'student-memo-panel';
    panel.className = 'bg-yellow-50 border border-yellow-200 rounded p-3 mx-4 mt-3 mb-3';
    panel.innerHTML = `
        <div class="flex items-start gap-2">
            <i class="fas fa-sticky-note text-yellow-500 mt-0.5"></i>
            <div class="flex-1">
                <div class="font-semibold text-gray-800 mb-1 text-xs">학생 메모</div>
                <div class="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">${escapeHtmlReadOnly(memo)}</div>
            </div>
            <button onclick="toggleStudentMemoReadOnly()"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    title="닫기">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    const tabsContainer = document.getElementById('feedback-tabs-container');
    if (tabsContainer && tabsContainer.parentElement) {
        tabsContainer.parentElement.insertAdjacentElement('afterend', panel);
    }
}

// ==================== 유틸리티 ====================
function escapeHtmlReadOnly(s) {
    return (s||'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

// Export
// viewPdfFeedback는 admin_modals.js에서 등록 (guidanceProgress 데이터 사용)
window.closeFeedbackDetailScreenReadOnly = closeFeedbackDetailScreenReadOnly;
window.switchFeedbackTabReadOnly = switchFeedbackTabReadOnly;
window.downloadPlagiarismReportReadOnly = downloadPlagiarismReportReadOnly;
window.toggleStudentMemoReadOnly = toggleStudentMemoReadOnly;
