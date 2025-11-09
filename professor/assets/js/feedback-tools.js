
// injected: CURRENT_USER bootstrap (safe defaults)
// 안전한 초기화: CURRENT_USER가 없거나 role이 없으면 기본값 설정
if (!window.CURRENT_USER) {
  window.CURRENT_USER = {
    id: 'prof1',
    name: '교수',
    role: 'main',
    colors: { comment: 'rgba(255, 230, 150, 0.35)', drawing: '#3366ff' }
  };
} else {
  // CURRENT_USER는 있는데 role이나 colors가 없으면 추가
  if (!window.CURRENT_USER.role) {
    window.CURRENT_USER.role = 'main';
  }
  if (!window.CURRENT_USER.colors) {
    window.CURRENT_USER.colors = { comment: 'rgba(255, 230, 150, 0.35)', drawing: '#3366ff' };
  }
  if (!window.CURRENT_USER.id) {
    window.CURRENT_USER.id = 'prof1';
  }
  if (!window.CURRENT_USER.name) {
    window.CURRENT_USER.name = '교수';
  }
}

// Phase 4: 온라인피드백 관리 - PDF 도구 및 코멘트

// 전역 변수
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let currentScale = 1.0;
let fabricCanvas = null;
let currentTool = 'select';
let annotations = {};
let currentFeedbackId = null;
let eraserRect = null;
let elements = null;  // DOM 요소 참조
let currentViewport = null;  // 현재 viewport 크기 저장 (경계 체크용)

// ==================== PDF 뷰어 초기화 ====================
function initPDFViewer(feedbackId, pdfUrl, feedbackData) {
    currentFeedbackId = feedbackId;
    annotations = feedbackData && feedbackData.annotations ? {...feedbackData.annotations} : {};
    
    elements = {
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
    
    // Fabric.js 캔버스 초기화
    fabricCanvas = new fabric.Canvas(elements.interactionCanvas, {
        isDrawingMode: false,
        perPixelTargetFind: true,
        selection: false
    });
    
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    
    // 페이지 렌더링 함수
    async function renderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
            return;
        }
        pageRendering = true;
        
        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: currentScale });
        const context = elements.canvas.getContext('2d');

        // 현재 viewport 저장 (경계 체크용)
        currentViewport = viewport;

        // 모든 레이어 크기 동기화
        elements.canvas.height = viewport.height;
        elements.canvas.width = viewport.width;
        elements.textLayer.style.width = `${viewport.width}px`;
        elements.textLayer.style.height = `${viewport.height}px`;
        elements.markerContainer.style.width = `${viewport.width}px`;
        elements.markerContainer.style.height = `${viewport.height}px`;

        fabricCanvas.setDimensions({ width: viewport.width, height: viewport.height });
        fabricCanvas.setZoom(currentScale);
        
        // PDF 렌더링
        const renderTask = page.render({
            canvasContext: context,
            viewport: viewport
        });
        
        // 텍스트 레이어
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
        
        // 주석 로드
        loadAnnotationsForPage(num);
        
        // UI 업데이트
        elements.pageNumEl.textContent = num;
        elements.zoomLevelEl.textContent = `${Math.round(currentScale * 100)}%`;
    }
    
    // 주석 로드
    function loadAnnotationsForPage(num) {
        // 기존 객체 제거 (eraserRect 제외)
        fabricCanvas.getObjects().forEach(obj => {
            if (obj !== eraserRect) {
                fabricCanvas.remove(obj);
            }
        });
        
        if (annotations[num]) {
            fabric.util.enlivenObjects(annotations[num], (objects) => {
                objects.forEach((obj) => {
                    obj.set({
                        selectable: currentTool === 'select',
                        evented: currentTool === 'select'
                    });
                    fabricCanvas.add(obj);
                });
                fabricCanvas.renderAll();
            });
        }
        
        // 마커 재생성
        redrawMarkersForPage(num);
        
        // 코멘트 패널 업데이트
        renderCommentPanel();
    }
    
    // 페이지 네비게이션
    var __el=document.getElementById('prev-page'); if(__el) __el.addEventListener('click', () => {
        if (pageNum > 1) {
            pageNum--;
            renderPage(pageNum);
        }
    });
    
    var __el=document.getElementById('next-page'); if(__el) __el.addEventListener('click', () => {
        if (pdfDoc && pageNum < pdfDoc.numPages) {
            pageNum++;
            renderPage(pageNum);
        }
    });
    
    // 확대/축소
    var __el=document.getElementById('zoom-in-btn'); if(__el) __el.addEventListener('click', () => {
        currentScale = Math.min(3.0, currentScale + 0.2);
        renderPage(pageNum);
    });
    
    var __el=document.getElementById('zoom-out-btn'); if(__el) __el.addEventListener('click', () => {
        currentScale = Math.max(0.5, currentScale - 0.2);
        renderPage(pageNum);
    });
    
    var __el=document.getElementById('fit-page-btn'); if(__el) __el.addEventListener('click', async () => {
        if (!pdfDoc) return;
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });
        currentScale = (elements.pdfRenderWrapper.clientHeight - 40) / viewport.height;
        renderPage(pageNum);
    });
    
    // 마우스 휠 스크롤로 페이지 이동 ✨ 추가
    elements.pdfRenderWrapper.addEventListener('wheel', (event) => {
        const wrapper = event.currentTarget;
        const atBottom = wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - 5;
        const atTop = wrapper.scrollTop === 0;
        
        if (event.deltaY > 0 && atBottom && pageNum < pdfDoc.numPages) {
            event.preventDefault();
            pageNum++;
            renderPage(pageNum);
        } else if (event.deltaY < 0 && atTop && pageNum > 1) {
            event.preventDefault();
            pageNum--;
            renderPage(pageNum);
        }
    }, { passive: false });
    
    // 도구 선택
    var __el=document.getElementById('select-tool'); if(__el) __el.addEventListener('click', () => setTool('select'));
    var __el=document.getElementById('highlight-tool'); if(__el) __el.addEventListener('click', () => setTool('highlight'));
    var __el=document.getElementById('drawing-tool'); if(__el) __el.addEventListener('click', () => setTool('drawing'));
    var __el=document.getElementById('comment-tool'); if(__el) __el.addEventListener('click', () => setTool('comment'));
    var __el=document.getElementById('eraser-tool'); if(__el) __el.addEventListener('click', () => setTool('eraser'));
    
    // PDF 로드
    pdfjsLib.getDocument(pdfUrl).promise.then(async pdf => {
        pdfDoc = pdf;
        elements.pageCountEl.textContent = pdfDoc.numPages;
        
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });
        currentScale = (elements.pdfRenderWrapper.clientHeight - 40) / viewport.height;
        
        renderPage(pageNum);
        setTool('select');
        
        // 전체 피드백 렌더링
        renderGeneralFeedback(feedbackData);
    }).catch(err => {
        console.error('PDF 로딩 실패:', err);
        alert('PDF를 불러올 수 없습니다.');
    });
    
    // 텍스트 선택 이벤트
    setupTextSelection(elements);
    
    // Fabric.js 이벤트
    setupFabricEvents();
}

// ==================== 도구 설정 ====================
function setTool(tool) {
    currentTool = tool;
    
    // 버튼 활성화 표시
    document.querySelectorAll('.pdf-toolbar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${tool}-tool`).classList.add('active');
    
    // 텍스트 레이어 활성화/비활성화 ✨ 추가
    const textLayer = document.getElementById('text-layer');
    if (textLayer) {
        if (tool === 'select') {
            textLayer.classList.add('active');
        } else {
            textLayer.classList.remove('active');
        }
    }
    
    // Fabric.js 모드 설정
    fabricCanvas.isDrawingMode = ['highlight', 'drawing'].includes(tool);
    fabricCanvas.selection = tool === 'select';
    
    // 모든 객체 선택/이동 가능 설정
    fabricCanvas.getObjects().forEach(obj => {
        if (obj !== eraserRect) {
            obj.set({
                selectable: tool === 'select',
                evented: tool === 'select'
            });
        }
    });
    
    // 캔버스 인터랙션
    const canvasContainer = fabricCanvas.upperCanvasEl.parentElement;
    if (['highlight', 'drawing', 'comment', 'eraser'].includes(tool)) {
        canvasContainer.classList.add('interaction-active');
    } else {
        canvasContainer.classList.remove('interaction-active');
    }
    
    // 커서 스타일
    let cursorStyle = 'default';
    if (tool === 'comment') cursorStyle = 'crosshair';
    if (tool === 'eraser') cursorStyle = 'grab';
    
    fabricCanvas.defaultCursor = cursorStyle;
    fabricCanvas.upperCanvasEl.style.cursor = cursorStyle;
    
    // 브러시 설정
    if (tool === 'highlight') {
        fabricCanvas.freeDrawingBrush.color = CURRENT_USER.colors.highlight;
        fabricCanvas.freeDrawingBrush.width = 15;
    } else if (tool === 'drawing') {
        fabricCanvas.freeDrawingBrush.color = CURRENT_USER.colors.drawing;
        fabricCanvas.freeDrawingBrush.width = 2;
    }
    
    fabricCanvas.renderAll();
}

// ==================== 텍스트 선택 설정 ====================
function setupTextSelection(elements) {
    elements.textLayer.addEventListener('mouseup', () => {
        if (currentTool !== 'select') return;
        
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;
        
        try {
            const range = selection.getRangeAt(0);
            const clientRects = range.getClientRects();
            const canvasRect = elements.canvas.getBoundingClientRect();
            
            if (clientRects.length === 0) {
                console.warn('텍스트 선택: clientRects 없음');
                return;
            }
            
            console.log('텍스트 선택 시작:', {
                clientRects: clientRects.length,
                canvasRect: { left: canvasRect.left, top: canvasRect.top },
                currentScale: currentScale
            });
            
            // 여러 줄 선택 시 각 줄을 사각형으로 변환
            const rects = [];
            for (let i = 0; i < clientRects.length; i++) {
                const r = clientRects[i];
                
                // 픽셀 좌표 → Fabric 논리 좌표 변환
                // 1. 뷰포트 기준 → 캔버스 기준
                // 2. 픽셀 → 논리 단위 (스케일 나누기)
                const left = (r.left - canvasRect.left) / currentScale;
                const top = (r.top - canvasRect.top) / currentScale;
                const width = r.width / currentScale;
                const height = r.height / currentScale;
                
                console.log(`Rect ${i}:`, { 
                    픽셀: { left: r.left - canvasRect.left, top: r.top - canvasRect.top },
                    논리: { left, top, width, height }
                });
                
                rects.push(new fabric.Rect({
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    fill: CURRENT_USER.colors.comment,
                    stroke: CURRENT_USER.colors.drawing,
                    strokeWidth: 2 / currentScale  // 스케일 반영
                }));
            }
            
            if (rects.length === 0) {
                console.warn('텍스트 선택: 사각형 생성 실패');
                return;
            }
            
            // 그룹으로 묶기
            const group = new fabric.Group(rects, {
                customType: 'comment',
                authorId: CURRENT_USER.id,
                authorName: CURRENT_USER.name,
                selectable: false,
                evented: false
            });
            
            console.log('Group 생성:', { 
                left: group.left, 
                top: group.top,
                width: group.width,
                height: group.height
            });
            
            fabricCanvas.add(group);
            fabricCanvas.renderAll();  // 즉시 렌더링
            
            // 주석 추가
            addAnnotation(group, 'comment');
            
            // 선택 해제
            selection.removeAllRanges();
            
            showToast('텍스트 영역이 선택되었습니다.', 'success');
            
        } catch (error) {
            console.error('텍스트 선택 오류:', error);
            showToast('텍스트 선택 중 오류가 발생했습니다.', 'error');
        }
    });
}

// ==================== Fabric.js 이벤트 설정 ====================
function setupFabricEvents() {
    let isDrawingRect = false;
    let tempRect = null;
    let origX, origY;
    let isErasing = false;
    
    // Path 생성 (하이라이트, 판서)
    fabricCanvas.on('path:created', (e) => {
        if (!['highlight', 'drawing'].includes(currentTool)) return;
        
        console.log(`Path 생성: ${currentTool}`, {
            pathLength: e.path.path ? e.path.path.length : 0
        });
        
        e.path.set({
            customType: currentTool,
            authorId: CURRENT_USER.id,
            authorName: CURRENT_USER.name,
            selectable: true,
            evented: true
        });
        
        fabricCanvas.renderAll();  // 즉시 렌더링
        
        addAnnotation(e.path, currentTool);
    });
    
    // 코멘트 영역 지정
    fabricCanvas.on('mouse:down', (o) => {
        if (currentTool === 'comment') {
            isDrawingRect = true;
            const pointer = fabricCanvas.getPointer(o.e);
            origX = pointer.x;
            origY = pointer.y;
            
            tempRect = new fabric.Rect({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                width: 0,
                height: 0,
                fill: CURRENT_USER.colors.comment,
                stroke: CURRENT_USER.colors.drawing,
                strokeWidth: 2,
                selectable: false
            });
            
            fabricCanvas.add(tempRect);
        } else if (currentTool === 'eraser') {
            isErasing = true;
            eraseObjectAtPointer(o.e);
        }
    });
    
    fabricCanvas.on('mouse:move', (o) => {
        if (!o || !o.e) return;
        const p = fabricCanvas.getPointer(o.e);
        if (!p) return;
        
        // 지우개 커서
        if (currentTool === 'eraser') {
            if (!eraserRect) {
                eraserRect = new fabric.Rect({
                    width: 20,
                    height: 20,
                    fill: 'rgba(0,0,0,0.2)',
                    selectable: false,
                    evented: false
                });
                fabricCanvas.add(eraserRect);
            }
            if (!eraserRect) { eraserRect = new fabric.Rect({width:20,height:20,fill:'rgba(0,0,0,0.2)',selectable:false,evented:false}); fabricCanvas.add(eraserRect); }
if (!eraserRect) { eraserRect = new fabric.Rect({width:20,height:20,fill:'rgba(0,0,0,0.2)',selectable:false,evented:false}); fabricCanvas.add(eraserRect); }
eraserRect.set({
                left: p.x - 10,
                top: p.y - 10
            });
            eraserRect.setCoords();
        } else if (eraserRect) {
            // 다른 도구 선택 시 지우개 커서 제거 ✨ 추가
            fabricCanvas.remove(eraserRect);
            eraserRect = null;
        }
        
        // 코멘트 영역 그리기
        if (isDrawingRect && currentTool === 'comment') {
            if (!tempRect) return; 
            tempRect.set({
                width: Math.abs(origX - p.x),
                height: Math.abs(origY - p.y),
                left: Math.min(origX, p.x),
                top: Math.min(origY, p.y)
            });
        }
        
        // 지우기
        if (isErasing && currentTool === 'eraser') {
            eraseObjectAtPointer(o.e);
        }
        
        fabricCanvas.renderAll();
    });
    
    fabricCanvas.on('mouse:up', () => {
        if (isDrawingRect && currentTool === 'comment') {
            isDrawingRect = false;
            
            // ID 46: 영역 지정 오류 수정
            if (!tempRect || tempRect.width < 5 || tempRect.height < 5) {
                if (tempRect) fabricCanvas.remove(tempRect);
                console.log('영역 지정: 크기 너무 작음, 취소');
                return;
            }

            // 페이지 경계 체크 (수정: viewport 크기 사용 + tolerance 추가)
            // currentViewport가 없으면 fabricCanvas 크기 사용 (fallback)
            const canvasWidth = currentViewport ? currentViewport.width : fabricCanvas.width;
            const canvasHeight = currentViewport ? currentViewport.height : fabricCanvas.height;
            const rectRight = tempRect.left + tempRect.width;
            const rectBottom = tempRect.top + tempRect.height;

            // 🔧 tolerance를 10px로 증가하여 경계 체크를 더 관대하게 (부동소수점 오차 + 확대/축소 오차 허용)
            const tolerance = 10;

            console.log('🔍 경계 체크 디버그:', {
                currentViewport: currentViewport,
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                'tempRect.left': tempRect.left,
                'tempRect.top': tempRect.top,
                rectRight: rectRight,
                rectBottom: rectBottom,
                tolerance: tolerance,
                '왼쪽체크': tempRect.left < -tolerance,
                '위체크': tempRect.top < -tolerance,
                '오른쪽체크': rectRight > canvasWidth + tolerance,
                '아래체크': rectBottom > canvasHeight + tolerance
            });

            if (tempRect.left < -tolerance || tempRect.top < -tolerance ||
                rectRight > canvasWidth + tolerance || rectBottom > canvasHeight + tolerance) {
                fabricCanvas.remove(tempRect);
                showToast('영역이 페이지 밖으로 벗어났습니다.', 'error');
                console.error('❌ 영역 지정: 페이지 경계 초과', {
                    rect: { left: tempRect.left, top: tempRect.top, right: rectRight, bottom: rectBottom },
                    canvas: { width: canvasWidth, height: canvasHeight },
                    초과량: {
                        left: tempRect.left < -tolerance ? tempRect.left + tolerance : 0,
                        top: tempRect.top < -tolerance ? tempRect.top + tolerance : 0,
                        right: rectRight > canvasWidth + tolerance ? rectRight - (canvasWidth + tolerance) : 0,
                        bottom: rectBottom > canvasHeight + tolerance ? rectBottom - (canvasHeight + tolerance) : 0
                    }
                });
                return;
            }
            
            // ✅ 수정: 영역 겹침 허용 (중복 체크 비활성화)
            // 중복 체크를 원하시면 아래 주석을 해제하세요
            /*
            // ✨ 신규: 1개 영역 = 1개 첨삭 제한 체크
            if (annotations[pageNum]) {
                const existingComments = annotations[pageNum].filter(a => a.customType === 'comment');
                const newRect = {
                    left: tempRect.left,
                    top: tempRect.top,
                    width: tempRect.width,
                    height: tempRect.height
                };
                
                for (const existing of existingComments) {
                    // 영역 겹침 체크 (중심점 기준)
                    const existingCenterX = existing.left + (existing.width / 2);
                    const existingCenterY = existing.top + (existing.height / 2);
                    const newCenterX = newRect.left + (newRect.width / 2);
                    const newCenterY = newRect.top + (newRect.height / 2);
                    
                    // 새 영역의 중심이 기존 영역 안에 있거나, 기존 영역의 중심이 새 영역 안에 있으면 겹침
                    const newInExisting = (newCenterX >= existing.left && newCenterX <= existing.left + existing.width &&
                                          newCenterY >= existing.top && newCenterY <= existing.top + existing.height);
                    const existingInNew = (existingCenterX >= newRect.left && existingCenterX <= newRect.left + newRect.width &&
                                          existingCenterY >= newRect.top && existingCenterY <= newRect.top + newRect.height);
                    
                    if (newInExisting || existingInNew) {
                        fabricCanvas.remove(tempRect);
                        showToast('이미 첨삭이 있는 영역입니다. 한 영역에는 하나의 첨삭만 가능합니다.', 'error');
                        console.log('영역 지정: 기존 첨삭과 중복');
                        return;
                    }
                }
            }
            */
            
            console.log('영역 지정 완료:', {
                left: tempRect.left,
                top: tempRect.top,
                width: tempRect.width,
                height: tempRect.height,
                page: pageNum
            });
            
            const newRect = new fabric.Rect({
                ...tempRect.toObject(),
                customType: 'comment',
                authorId: CURRENT_USER.id,
                authorName: CURRENT_USER.name,
                selectable: false,
                evented: false
            });
            
            fabricCanvas.remove(tempRect);
            fabricCanvas.add(newRect);
            fabricCanvas.renderAll();  // 즉시 렌더링
            
            addAnnotation(newRect, 'comment');
            
            tempRect = null;
            
            showToast('영역이 지정되었습니다.', 'success');
        }
        
        if (isErasing) {
            isErasing = false;
        }
    });
}

// ==================== 지우개 ====================
function eraseObjectAtPointer(e) {
    const pointer = fabricCanvas.getPointer(e);
    
    for (let i = fabricCanvas.getObjects().length - 1; i >= 0; i--) {
        const obj = fabricCanvas.getObjects()[i];
        
        if (obj && obj.customType && ['drawing', 'highlight'].includes(obj.customType) && obj.containsPoint(pointer)) {
            fabricCanvas.remove(obj);
            
            // annotations에서도 제거
            for (const pageNumKey in annotations) {
                if (annotations[pageNumKey]) {
                    annotations[pageNumKey] = annotations[pageNumKey].filter(anno => anno.id !== obj.id);
                }
            }
            
            break;
        }
    }
}

// ==================== 마커 재생성 (전역 함수) ====================
function redrawMarkersForPage(num) {
    if (!elements || !elements.markerContainer) {
        console.error('elements가 초기화되지 않았습니다');
        return;
    }
    
    elements.markerContainer.innerHTML = '';
    if (!annotations[num]) return;
    
    let commentCounter = 1;
    const sortedPageKeys = Object.keys(annotations).sort((a, b) => parseInt(a) - parseInt(b));
    
    console.log('🔍 마커 재생성 시작:', { page: num, currentScale: currentScale });
    
    for (const pageKey of sortedPageKeys) {
        const pageInt = parseInt(pageKey);
        if (annotations[pageKey]) {
            const pageComments = annotations[pageKey].filter(a => a.customType === 'comment');
            
            if (pageInt < num) {
                commentCounter += pageComments.length;
            } else if (pageInt === num) {
                pageComments.forEach(comment => {
                    // 논리 좌표 → 화면 픽셀 좌표 변환
                    let left = comment.left * currentScale;
                    let top = comment.top * currentScale;
                    
                    console.log(`  Comment ${commentCounter}:`, { 
                        id: comment.id, 
                        type: comment.type,
                        논리: { left: comment.left, top: comment.top },
                        픽셀: { left, top }
                    });
                    
                    // 마커가 캔버스 범위를 벗어나는지 확인
                    const canvasWidth = elements.canvas.width;
                    const canvasHeight = elements.canvas.height;
                    
                    // 범위 내로 제한
                    if (left < 0) {
                        console.warn('    left < 0, 보정:', left, '→ 10');
                        left = 10;
                    }
                    if (top < 0) {
                        console.warn('    top < 0, 보정:', top, '→ 10');
                        top = 10;
                    }
                    if (left > canvasWidth - 30) {
                        console.warn('    left 범위 초과, 보정:', left, '→', canvasWidth - 30);
                        left = canvasWidth - 30;
                    }
                    if (top > canvasHeight - 30) {
                        console.warn('    top 범위 초과, 보정:', top, '→', canvasHeight - 30);
                        top = canvasHeight - 30;
                    }
                    
                    const marker = document.createElement('div');
                    marker.className = 'comment-marker';
                    marker.dataset.annotationId = comment.id;
                    marker.textContent = commentCounter;
                    marker.style.left = `${left}px`;
                    marker.style.top = `${top}px`;
                    
                    console.log(`    ✅ Marker ${commentCounter} 생성:`, { left, top });
                    
                    // 작성자 색상 적용
                    if (comment.authorId) {
                        const user = FeedbackDataService.getUserById(comment.authorId);
                        if (user && user.colors) {
                            marker.style.backgroundColor = user.colors.comment.replace('0.1', '0.9');
                        }
                    }
                    
                    // 클릭 이벤트
                    marker.addEventListener('click', () => {
                        highlightComment(comment.id);
                    });
                    
                    elements.markerContainer.appendChild(marker);
                    commentCounter++;
                });
            }
        }
    }
    
    console.log('✅ 마커 재생성 완료:', { total: commentCounter - 1 });
}

// Export - 파트 1
window.initPDFViewer = initPDFViewer;
window.setTool = setTool;

// ==================== 주석 추가 ====================
function addAnnotation(obj, type) {
    try {
        const id = `anno-${Date.now()}`;
        obj.set({ id: id });
        
        if (!annotations[pageNum]) {
            annotations[pageNum] = [];
        }
        
        // 객체 데이터 저장
        const annotationData = obj.toObject(['customType', 'authorId', 'authorName', 'id']);
        
        if (type === 'comment') {
            annotationData.comments = [];
            annotationData.linkedComments = [];
            annotationData.commentAudio = null;
        }
        
        annotations[pageNum].push(annotationData);
        
        // ✅ 신규: FEEDBACK_DATA에도 저장
        const feedbackId = window._currentFeedbackCtx?.id || currentFeedbackId;
        if (feedbackId) {
            console.log(`✅ FEEDBACK_DATA에도 저장: feedbackId=${feedbackId}, page=${pageNum}`);
            FeedbackDataService.addAnnotation(feedbackId, pageNum, annotationData);
        } else {
            console.error('❌ feedbackId가 없어서 FEEDBACK_DATA에 저장 실패!');
        }
        
        console.log(`✅ Added annotation: type=${type}, id=${id}, page=${pageNum}`);
        console.log('   좌표:', { 
            left: annotationData.left, 
            top: annotationData.top, 
            type: annotationData.type 
        });
        
        // 캔버스 즉시 렌더링
        fabricCanvas.renderAll();
        
        // 마커 즉시 재생성 (setTimeout 제거)
        if (type === 'comment') {
            const markerContainer = document.getElementById('marker-container');
            if (markerContainer) {
                redrawMarkersForPage(pageNum);
                console.log('   마커 생성 완료');
            } else {
                console.error('   marker-container 없음');
            }
            
            // ✨ 신규: 자동으로 첨삭 탭으로 이동
            if (typeof switchFeedbackTab === 'function') {
                switchFeedbackTab('inline');
            }
        }
        
        // 코멘트 패널 업데이트
        renderCommentPanel();
        refreshInlineTabMarker();
        
        // ✨ 신규: 입력창 자동 포커스 (탭 전환 후)
        if (type === 'comment') {
            setTimeout(() => {
                const textarea = document.getElementById(`main-comment-${id}`);
                if (textarea) {
                    textarea.focus();
                    // 스크롤하여 해당 카드를 화면에 표시
                    const card = textarea.closest('.comment-card');
                    if (card) {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }, 150);
        }
        
        return id;
        
    } catch (error) {
        console.error('❌ addAnnotation 오류:', error);
        console.error('   스택:', error.stack);
        showToast('주석 추가 중 오류가 발생했습니다: ' + error.message, 'error');
        return null;
    }
}

// ==================== 코멘트 패널 렌더링 ====================
function renderCommentPanel() {
    const container = document.getElementById('inline-feedback');
    if (!container) return;
    
    const items = [];
    
    // 모든 페이지의 주석 수집
    for (const pageNumKey in annotations) {
        const pageAnnotations = annotations[pageNumKey];
        if (!pageAnnotations) continue;
        
        // 코멘트
        const comments = pageAnnotations.filter(a => a.customType === 'comment');
        comments.forEach(comment => {
            items.push({
                type: 'comment',
                pageNum: parseInt(pageNumKey),
                data: comment
            });
        });
        
        // 판서/하이라이트 마커
        const markers = pageAnnotations.filter(a => ['highlight', 'drawing'].includes(a.customType));
        if (markers.length > 0) {
            items.push({
                type: 'marker',
                pageNum: parseInt(pageNumKey),
                count: markers.length
            });
        }
    }
    
    // 페이지 순서로 정렬
    items.sort((a, b) => a.pageNum - b.pageNum);
    
    if (items.length === 0) {
        container.innerHTML = `
            <p class="text-xs text-center text-gray-500">
                등록된 첨삭이 없습니다.<br>
                도구를 사용해 새 첨삭을 추가하세요.
            </p>
        `;
        return;
    }
    
    // 렌더링
    container.innerHTML = items.map(item => {
        if (item.type === 'comment') {
            return renderCommentCard(item.data, item.pageNum);
        } else {
            return renderPageMarker(item.pageNum, item.count);
        }
    }).join('');
}

// ==================== 코멘트 카드 렌더링 (완전 재작성) ====================
function renderCommentCard(comment, pageNum) {
    const commentNumber = getCommentNumber(comment.id);
    const author = FeedbackDataService.getUserById(comment.authorId);
    const roleText = author ? (author.role === 'main' ? '주지도' : '공동지도') : '';

    // 첨삭 내용 (첫 번째 코멘트만)
    const mainComment = comment.comments && comment.comments.length > 0 ? comment.comments[0] : null;
    const replies = comment.comments && comment.comments.length > 1 ? comment.comments.slice(1) : [];

    // 🐛 버그 수정: isOwner는 mainComment의 authorId로 체크해야 함
    // mainComment가 없으면 comment의 authorId 사용 (fallback)
    const isOwner = mainComment ? mainComment.authorId === CURRENT_USER.id : comment.authorId === CURRENT_USER.id;
    const isProfessor = CURRENT_USER.role === 'main' || CURRENT_USER.role === 'co';

    // 디버깅용 콘솔 출력
    console.log('renderCommentCard:', {
        commentId: comment.id,
        CURRENT_USER: CURRENT_USER,
        isProfessor: isProfessor,
        isOwner: isOwner,
        'comment 구조': {
            comments배열: comment.comments,
            comments길이: comment.comments ? comment.comments.length : 0,
            첫번째comment: comment.comments && comment.comments[0] ? comment.comments[0] : 'null'
        },
        'authorId 비교': {
            mainCommentAuthorId: mainComment ? mainComment.authorId : 'null',
            commentAuthorId: comment.authorId,
            currentUserId: CURRENT_USER.id
        }
    });

    // 연결된 코멘트 표시
    let linkedCommentsHtml = '';
    if (comment.linkedComments && comment.linkedComments.length > 0) {
        const linkedItems = comment.linkedComments.map(linkedId => {
            const linkedNum = getCommentNumber(linkedId);
            const linkedPage = findCommentPage(linkedId);
            return { id: linkedId, number: linkedNum, page: linkedPage };
        }).filter(item => item.number !== null);
        
        if (linkedItems.length > 0) {
            linkedCommentsHtml = `
                <div class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                    <i class="fas fa-link text-blue-600"></i>
                    <span class="text-blue-800 font-semibold">연결된 코멘트:</span>
                    ${linkedItems.map(item => `
                        <button 
                            onclick="goToLinkedComment('${item.id}', ${item.page})" 
                            class="inline-block bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded ml-1 cursor-pointer transition-colors"
                            title="${item.page}페이지로 이동">
                            💬 ${item.number}
                        </button>
                    `).join('')}
                </div>
            `;
        }
    }
    
    // ==================== 첨삭 카드 (분리) ====================
    let commentCardHtml = `
        <div class="comment-card" data-comment-id="${comment.id}">
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-gray-700">${pageNum}페이지 💬 ${commentNumber}</span>
                    ${author ? `
                        <span class="text-xs px-2 py-0.5 rounded-full ${author.role === 'main' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">
                            ${author.name} (${roleText})
                        </span>
                    ` : ''}
                </div>
                <button onclick="goToPage(${pageNum})" class="text-xs text-blue-600 hover:text-blue-800">
                    이동 →
                </button>
            </div>
            
            <!-- 첨삭 내용 -->
            <div class="comment-main-section">
                <!-- 헤더 + 연결 버튼 + 연결된 첨삭을 한 줄로 -->
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                    <h6 class="text-xs font-semibold text-gray-600">📝 첨삭 내용</h6>
                    ${(() => {
                        console.log('연결 버튼 조건 체크:', {
                            isProfessor: isProfessor,
                            mainComment: mainComment ? '있음' : '없음',
                            'CURRENT_USER.role': CURRENT_USER.role,
                            표시여부: isProfessor  // mainComment 조건 제거!
                        });
                        
                        // ✅ 수정: mainComment 조건 제거 (교수면 항상 표시)
                        if (isProfessor) {
                            return `
                                <button onclick="event.stopPropagation(); linkComment('${comment.id}')"
                                        id="link-btn-${comment.id}"
                                        class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md hover:bg-yellow-200 border border-yellow-300 flex items-center gap-1">
                                    <i class="fas fa-link"></i>
                                    <span>연결</span>
                                </button>
                            `;
                        }
                        return '';
                    })()}
                    ${comment.linkedComments && comment.linkedComments.length > 0 ? `
                        <span class="text-xs text-blue-700">
                            → 연결된: ${comment.linkedComments.map(linkedId => {
                                const linkedNum = getCommentNumber(linkedId);
                                const linkedPage = findCommentPage(linkedId);
                                return linkedNum ? `<button 
                                    onclick="goToLinkedComment('${linkedId}', ${linkedPage})" 
                                    class="inline-block bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded ml-1 cursor-pointer"
                                    title="${linkedPage}페이지로 이동">💬${linkedNum}</button>` : '';
                            }).join('')}
                        </span>
                    ` : ''}
                </div>
                ${mainComment ? `
                    <div id="main-comment-display-${comment.id}">
                        <div class="comment-bubble ${author ? (author.role === 'main' ? 'professor-main' : author.role === 'co' ? 'professor-co' : 'student-comment') : 'student-comment'}">
                            <p>${mainComment.text}</p>
                            ${mainComment.audio ? `<audio controls class="w-full h-8 mt-2" src="${mainComment.audio}"></audio>` : ''}
                            <div class="timestamp">${mainComment.timestamp}</div>
                        </div>
                        <!-- 버튼: 수정, 삭제 -->
                        <div class="flex gap-2 mt-2 flex-wrap">
                            ${isOwner ? `
                                <button onclick="event.stopPropagation(); editMainComment('${comment.id}')"
                                        class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1">
                                    <i class="fas fa-edit"></i>
                                    <span>수정</span>
                                </button>
                                <button onclick="event.stopPropagation(); deleteMainComment('${comment.id}')"
                                        class="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 flex items-center gap-1">
                                    <i class="fas fa-trash"></i>
                                    <span>삭제</span>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div id="main-comment-edit-${comment.id}" style="display: none;">
                        <textarea id="main-comment-textarea-${comment.id}" 
                                  class="w-full p-2 border rounded-md text-xs resize-none" 
                                  rows="4">${mainComment.text}</textarea>
                        <!-- 수정 모드 보조 기능 추가 -->
                        <div class="flex gap-2 flex-wrap mt-2">
                            <button class="quickmark-btn text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1" data-target="main-comment-textarea-${comment.id}">
                                <i class="fas fa-star"></i>
                                <span>자주쓰는 코멘트</span>
                            </button>
                            <button onclick="uploadEditAttachment('${comment.id}')" class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1">
                                <i class="fas fa-paperclip"></i>
                                <span>첨부</span>
                            </button>
                            <button onclick="startEditVoiceRecording('${comment.id}')" 
                                    class="record-btn text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1">
                                <i class="fas fa-microphone"></i>
                                <i class="fas fa-stop" style="display:none;"></i>
                                <span>음성</span>
                            </button>
                        </div>
                        <div class="flex gap-2 mt-2">
                            <button onclick="saveMainCommentEdit('${comment.id}')" 
                                    class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 flex items-center gap-1">
                                <i class="fas fa-save"></i>
                                <span>저장</span>
                            </button>
                            <button onclick="cancelMainCommentEdit('${comment.id}')" 
                                    class="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 flex items-center gap-1">
                                <i class="fas fa-times"></i>
                                <span>취소</span>
                            </button>
                        </div>
                    </div>
                ` : `
                    ${isOwner ? `
                        <div class="space-y-2">
                            <textarea id="main-comment-${comment.id}" 
                                      class="w-full p-2 border rounded-md text-xs resize-none" 
                                      rows="3" 
                                      placeholder="첨삭 내용을 입력하세요."></textarea>
                            <div class="flex gap-2 flex-wrap">
                                <!-- 첫 번째 줄: 보조 기능 -->
                                <button class="quickmark-btn text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1" data-target="main-comment-${comment.id}">
                                    <i class="fas fa-star"></i>
                                    <span>자주쓰는 코멘트</span>
                                </button>
                                <button onclick="uploadAttachment('${comment.id}')" class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1">
                                    <i class="fas fa-paperclip"></i>
                                    <span>첨부</span>
                                </button>
                                <button onclick="startVoiceRecording('${comment.id}')" 
                                        class="record-btn text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1">
                                    <i class="fas fa-microphone"></i>
                                    <i class="fas fa-stop" style="display:none;"></i>
                                    <span>음성</span>
                                </button>
                            </div>
                            <div class="flex gap-2 flex-wrap mt-2">
                                <!-- 등록 버튼만 표시 (완료는 모달 헤더로 이동) -->
                                <button onclick="addMainComment('${comment.id}')" 
                                        class="text-xs bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1 font-semibold">
                                    <i class="fas fa-check"></i>
                                    <span>등록</span>
                                </button>
                            </div>
                        </div>
                    ` : `
                        <p class="text-xs text-gray-500 italic">첨삭 대기 중...</p>
                    `}
                `}
            </div>
        </div>
    `;
    
    // ==================== 댓글 영역 (완전 분리) ====================
    let repliesHtml = '';
    if (mainComment) {
        repliesHtml = `
            <div class="comment-replies-container">
                <div class="reply-connector"></div>
                <div class="comment-replies">
                    <h6 class="text-xs font-semibold text-gray-600 mb-2">💬 댓글 (${replies.length})</h6>
                    <div class="comment-thread">
                        ${replies.length > 0 ? replies.map(c => renderCommentBubble(c, comment.id)).join('') : '<p class="text-xs text-gray-400 text-center py-2">댓글이 없습니다.</p>'}
                    </div>
                    
                    <div class="mt-3 space-y-2">
                        <textarea id="reply-${comment.id}" 
                                  class="w-full p-2 border rounded-md text-xs resize-none" 
                                  rows="2" 
                                  placeholder="댓글을 입력하세요..."></textarea>
                        <div class="flex gap-2 flex-wrap">
                            <button onclick="addCommentReply('${comment.id}')" 
                                    class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 flex items-center gap-1">
                                <i class="fas fa-paper-plane"></i>
                                <span>댓글 등록</span>
                            </button>
                            <button onclick="uploadReplyAttachment('${comment.id}')" class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1">
                                <i class="fas fa-paperclip"></i>
                                <span>첨부</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // wrapper로 감싸서 반환
    return `
        <div class="comment-wrapper">
            ${commentCardHtml}
            ${repliesHtml}
        </div>
    `;
}

// ==================== 코멘트 말풍선 렌더링 ====================
function renderCommentBubble(comment, parentCommentId) {
    const author = FeedbackDataService.getUserById(comment.authorId);
    const roleClass = author ? 
        (author.role === 'main' ? 'professor-main' : 
         author.role === 'co' ? 'professor-co' : 
         'student-comment') : 'student-comment';
    
    const isOwner = comment.authorId === CURRENT_USER.id;
    const audioHtml = comment.audio ? 
        `<audio controls class="w-full h-8 mt-2" src="${comment.audio}"></audio>` : '';
    
    return `
        <div class="comment-bubble ${roleClass}" data-reply-id="${comment.id}">
            <div class="author">
                ${author ? `📝 ${author.name} ${author.role !== 'student' ? `(${author.role === 'main' ? '주지도' : '공동지도'})` : ''}` : comment.authorName}
            </div>
            <div id="reply-display-${comment.id}">
                <p>${comment.text}</p>
                ${audioHtml}
                <div class="flex items-center justify-between mt-2">
                    <div class="timestamp">${comment.timestamp}</div>
                    ${isOwner ? `
                        <div class="flex gap-2">
                            <button onclick="event.stopPropagation(); editReply('${parentCommentId}', '${comment.id}')"
                                    class="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                <i class="fas fa-edit"></i>
                                <span>수정</span>
                            </button>
                            <button onclick="event.stopPropagation(); deleteReply('${parentCommentId}', '${comment.id}')"
                                    class="text-xs text-red-600 hover:text-red-800 flex items-center gap-1">
                                <i class="fas fa-trash"></i>
                                <span>삭제</span>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div id="reply-edit-${comment.id}" style="display: none;">
                <textarea id="reply-edit-textarea-${comment.id}" 
                          class="w-full p-2 border rounded-md text-xs resize-none mt-2" 
                          rows="2">${comment.text}</textarea>
                <div class="flex gap-2 mt-2">
                    <button onclick="saveReplyEdit('${parentCommentId}', '${comment.id}')" 
                            class="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center gap-1">
                        <i class="fas fa-save"></i>
                        <span>저장</span>
                    </button>
                    <button onclick="cancelReplyEdit('${comment.id}')" 
                            class="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 flex items-center gap-1">
                        <i class="fas fa-times"></i>
                        <span>취소</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==================== 페이지 마커 렌더링 ====================
function renderPageMarker(pageNum, count) {
    return `
        <div class="page-marker-card" onclick="goToPage(${pageNum})">
            <p class="text-sm font-semibold text-blue-800">
                <i class="fas fa-paint-brush mr-2"></i>
                ${pageNum}페이지에 판서/하이라이트가 있습니다
            </p>
            <span class="text-xs text-blue-600 font-bold">이동하기 &rarr;</span>
        </div>
    `;
}

// ==================== 코멘트 번호 가져오기 ====================
function getCommentNumber(commentId) {
    let counter = 1;
    const sortedPages = Object.keys(annotations).sort((a, b) => parseInt(a) - parseInt(b));
    
    for (const pageKey of sortedPages) {
        const comments = annotations[pageKey].filter(a => a.customType === 'comment');
        for (const comment of comments) {
            if (comment.id === commentId) {
                return counter;
            }
            counter++;
        }
    }
    
    return counter;
}

// ==================== 페이지 이동 ====================
// ==================== 코멘트 페이지 찾기 ====================
function findCommentPage(commentId) {
    for (const pageKey in annotations) {
        if (annotations[pageKey]) {
            const found = annotations[pageKey].find(a => a.id === commentId);
            if (found) return parseInt(pageKey);
        }
    }
    return null;
}

// ==================== 연결된 코멘트로 이동 ====================
function goToLinkedComment(commentId, targetPage) {
    // 페이지 이동
    if (targetPage && targetPage !== pageNum) {
        goToPage(targetPage);
    }
    
    // 코멘트 하이라이트
    setTimeout(() => {
        highlightComment(commentId);
        
        // 해당 코멘트 카드로 스크롤
        const commentCard = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentCard) {
            commentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, targetPage !== pageNum ? 500 : 100);
}

function goToPage(targetPage) {
    if (!pdfDoc || targetPage < 1 || targetPage > pdfDoc.numPages) return;
    
    pageNum = targetPage;
    
    // renderPage를 직접 호출하여 일관된 렌더링
    pdfDoc.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: currentScale });
        const canvas = document.getElementById('pdf-canvas');
        const textLayer = document.getElementById('text-layer');
        const markerContainer = document.getElementById('marker-container');
        const context = canvas.getContext('2d');
        
        // 모든 레이어 크기 동기화
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        textLayer.style.width = `${viewport.width}px`;
        textLayer.style.height = `${viewport.height}px`;
        markerContainer.style.width = `${viewport.width}px`;
        markerContainer.style.height = `${viewport.height}px`;
        
        // Fabric 캔버스 설정
        fabricCanvas.setDimensions({ width: viewport.width, height: viewport.height });
        fabricCanvas.setZoom(currentScale);
        
        // 기존 객체 모두 제거 (eraserRect 제외)
        fabricCanvas.getObjects().forEach(obj => {
            if (obj !== eraserRect) {
                fabricCanvas.remove(obj);
            }
        });
        
        // PDF 렌더링
        const renderTask = page.render({
            canvasContext: context,
            viewport: viewport
        });
        
        // 텍스트 레이어
        page.getTextContent().then(textContent => {
            textLayer.innerHTML = '';
            pdfjsLib.renderTextLayer({
                textContent: textContent,
                container: textLayer,
                viewport: viewport,
                textDivs: []
            });
        });
        
        renderTask.promise.then(() => {
            // 주석 로드
            if (annotations[targetPage]) {
                fabric.util.enlivenObjects(annotations[targetPage], (objects) => {
                    objects.forEach((obj) => {
                        obj.set({
                            selectable: currentTool === 'select',
                            evented: currentTool === 'select'
                        });
                        fabricCanvas.add(obj);
                    });
                    fabricCanvas.renderAll();
                });
            } else {
                fabricCanvas.renderAll();
            }
            
            // 마커 재생성
            redrawMarkersForPage(targetPage);
            
            // 코멘트 패널 업데이트
            renderCommentPanel();
            
            // UI 업데이트
            document.getElementById('page-num').textContent = targetPage;
        });
    });
}

// ==================== 코멘트 하이라이트 ====================
function highlightComment(commentId) {
    // 모든 하이라이트 제거
    document.querySelectorAll('.comment-card.highlight, .comment-marker.highlight').forEach(el => {
        el.classList.remove('highlight');
    });
    
    // 해당 코멘트 하이라이트
    const card = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (card) {
        card.classList.add('highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    const marker = document.querySelector(`[data-annotation-id="${commentId}"]`);
    if (marker) {
        marker.classList.add('highlight');
    }
}

// ==================== 코멘트 회신 추가 ====================
function addCommentReply(commentId) {
    console.log('🔵 [addCommentReply] 시작:', commentId);
    
    const textarea = document.getElementById(`reply-${commentId}`);
    console.log('🔵 [addCommentReply] textarea:', textarea);
    
    if (!textarea) {
        console.error('❌ [addCommentReply] textarea를 찾을 수 없음!');
        alert('입력창을 찾을 수 없습니다.');
        return;
    }
    
    const text = textarea.value.trim();
    
    console.log('🔵 [addCommentReply] textarea.value (원본):', JSON.stringify(textarea.value));
    console.log('🔵 [addCommentReply] text (trim 후):', JSON.stringify(text));
    console.log('🔵 [addCommentReply] text.length:', text.length);
    
    if (!text || text.length === 0) {
        console.error('❌ [addCommentReply] text가 비어있음!');
        alert('댓글을 입력하세요.');
        return;
    }
    
    const newComment = {
        id: `cm-${Date.now()}`,
        authorId: CURRENT_USER.id,
        authorName: CURRENT_USER.name,
        authorRole: CURRENT_USER.role,
        text: text,
        audio: null,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        attachments: window._pendingReplyAttachments || []
    };
    
    console.log('🔵 [addCommentReply] newComment:', newComment);
    
    // ✅ FeedbackDataService만 사용 (중복 방지)
    FeedbackDataService.addComment(currentFeedbackId, commentId, newComment, false); // false = 댓글
    
    console.log('🔵 [addCommentReply] FeedbackDataService.addComment 호출 완료');
    
    // annotations 동기화
    const feedbackData = FeedbackDataService.getFeedbackData(currentFeedbackId);
    if (feedbackData && feedbackData.annotations) {
        annotations = feedbackData.annotations;
        console.log('🔵 [addCommentReply] annotations 동기화 완료');
    }
    
    // UI 즉시 업데이트
    textarea.value = '';
    window._pendingReplyAttachments = [];
    renderCommentPanel();
    refreshInlineTabMarker();
    
    console.log('🔵 [addCommentReply] 완료!');
    showToast('댓글이 추가되었습니다.', 'success');
}

// ==================== 음성 녹음 ====================
let mediaRecorder = null;
let audioChunks = [];
let recordingCommentId = null;
let recordingTimeout = null;

async function startVoiceRecording(commentId) {
    const button = event.target.closest('.record-btn');
    
    if (button.classList.contains('recording')) {
        // 녹음 중지
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
        return;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        recordingCommentId = commentId;
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const audioData = reader.result;
                
                // 코멘트 추가
                const newComment = {
                    id: `cm-${Date.now()}`,
                    authorId: CURRENT_USER.id,
                    authorName: CURRENT_USER.name,
                    authorRole: CURRENT_USER.role,
                    text: '(음성 메모)',
                    audio: audioData,
                    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
                    attachments: []
                };
                
                // annotations에 추가
                for (const pageKey in annotations) {
                    const annotation = annotations[pageKey].find(a => a.id === recordingCommentId);
                    if (annotation) {
                        if (!annotation.comments) {
                            annotation.comments = [];
                        }
                        annotation.comments.push(newComment);
                        break;
                    }
                }
                
                // 서비스에 저장
                FeedbackDataService.addComment(currentFeedbackId, recordingCommentId, newComment);
                
                // UI 업데이트
                renderCommentPanel();
                showToast('음성 메모가 추가되었습니다.', 'success');
            };
            
            // 버튼 상태 복구
            button.classList.remove('recording');
            clearTimeout(recordingTimeout);
            
            // 스트림 정리
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        button.classList.add('recording');
        
        // 60초 후 자동 중지
        recordingTimeout = setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        }, 60000);
        
    } catch (err) {
        console.error('음성 녹음 실패:', err);
        alert('마이크 권한이 필요합니다.');
    }
}

// ==================== 전체 피드백 렌더링 (총평) ====================
function renderGeneralFeedback(feedbackData) {
    const container = document.getElementById('general-feedback-thread');
    if (!container) return;
    
    if (!feedbackData || !feedbackData.generalFeedbackThread) {
        container.innerHTML = '<p class="text-xs text-gray-500 text-center">총평이 없습니다.</p>';
        return;
    }
    
    // 현재 교수의 총평 찾기
    const myFeedback = feedbackData.generalFeedbackThread.find(f => f.authorId === CURRENT_USER.id);
    
    // 다른 교수들의 총평
    const otherFeedbacks = feedbackData.generalFeedbackThread.filter(f => f.authorId !== CURRENT_USER.id);
    
    let html = '';
    
    // 다른 교수들의 총평 먼저 표시 (읽기 전용)
    if (otherFeedbacks.length > 0) {
        html += otherFeedbacks.map(feedback => renderCommentBubble(feedback)).join('');
    }
    
    // 내 총평 표시 (수정 가능)
    if (myFeedback) {
        html += `
            <div class="comment-bubble professor-main mb-2">
                <div class="author">
                    📝 ${myFeedback.authorName} ${myFeedback.authorRole === 'main' ? '(주지도)' : '(공동지도)'}
                </div>
                <div class="mt-2">
                    <textarea id="my-general-feedback-edit" 
                              class="w-full p-2 border rounded-md text-xs resize-none" 
                              rows="3">${myFeedback.text}</textarea>
                    <button onclick="updateGeneralFeedback()" 
                            class="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 mt-2 flex items-center gap-1">
                        <i class="fas fa-save"></i>
                        <span>수정</span>
                    </button>
                </div>
                <div class="timestamp">${myFeedback.timestamp}</div>
            </div>
        `;
    }
    
    container.innerHTML = html || '<p class="text-xs text-gray-500 text-center">총평이 없습니다.</p>';
}

// ==================== 전체 피드백 추가 (총평) ====================
function addGeneralFeedback() {
    const textarea = document.getElementById('general-feedback-input');
    const text = textarea.value.trim();
    
    if (!text) {
        alert('총평을 입력하세요.');
        return;
    }
    
    const feedbackData = FeedbackDataService.getFeedbackData(currentFeedbackId);
    if (!feedbackData.generalFeedbackThread) {
        feedbackData.generalFeedbackThread = [];
    }
    
    // 이미 내 총평이 있는지 확인
    const existingIndex = feedbackData.generalFeedbackThread.findIndex(f => f.authorId === CURRENT_USER.id);
    
    const newFeedback = {
        id: `gf-${Date.now()}`,
        authorId: CURRENT_USER.id,
        authorName: CURRENT_USER.name,
        authorRole: CURRENT_USER.role,
        text: text,
        audio: null,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        attachments: []
    };
    
    if (existingIndex >= 0) {
        // 기존 총평 수정
        feedbackData.generalFeedbackThread[existingIndex] = newFeedback;
        showToast('총평이 수정되었습니다.', 'success');
    } else {
        // 새 총평 추가
        FeedbackDataService.addGeneralFeedback(currentFeedbackId, newFeedback);
        showToast('총평이 추가되었습니다.', 'success');
    }
    
    textarea.value = '';
    renderGeneralFeedback(feedbackData);
}

// 총평 수정
function updateGeneralFeedback() {
    const textarea = document.getElementById('my-general-feedback-edit');
    const text = textarea.value.trim();
    
    if (!text) {
        alert('총평을 입력하세요.');
        return;
    }
    
    const feedbackData = FeedbackDataService.getFeedbackData(currentFeedbackId);
    const existingIndex = feedbackData.generalFeedbackThread.findIndex(f => f.authorId === CURRENT_USER.id);
    
    if (existingIndex >= 0) {
        feedbackData.generalFeedbackThread[existingIndex].text = text;
        feedbackData.generalFeedbackThread[existingIndex].timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
        showToast('총평이 수정되었습니다.', 'success');
        renderGeneralFeedback(feedbackData);
    }
}

// ==================== 토스트 알림 ====================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-[200] ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== 자주 쓰는 코멘트 관리 ====================
function showQuickMarkPopover(button) {
    const targetId = button.dataset.target;
    const popover = document.getElementById('quickmark-popover');
    if (!popover) return;
    
    popover.dataset.target = targetId;
    
    const rect = button.getBoundingClientRect();
    const popoverHeight = 500; // 예상 높이
    const popoverWidth = 320;
    
    // 화면 아래로 나가는지 확인
    let top = rect.bottom + 5;
    let left = rect.left;
    
    if (top + popoverHeight > window.innerHeight) {
        // 버튼 위에 표시
        top = rect.top - popoverHeight - 5;
    }
    
    // 화면 오른쪽으로 나가는지 확인
    if (left + popoverWidth > window.innerWidth) {
        left = window.innerWidth - popoverWidth - 10;
    }
    
    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    
    // 현재 텍스트가 있으면 "이 내용 저장" 섹션 표시
    const textarea = document.getElementById(targetId);
    const addFromTextSection = document.getElementById('add-from-textarea-section');
    if (textarea && textarea.value.trim()) {
        addFromTextSection.classList.remove('hidden');
    } else {
        addFromTextSection.classList.add('hidden');
    }
    
    popover.classList.remove('hidden');
    renderQuickMarkList();
}

function hideQuickMarkPopover() {
    const popover = document.getElementById('quickmark-popover');
    if (popover) {
        popover.classList.add('hidden');
    }
}

function renderQuickMarkList() {
    const quickMarks = FeedbackDataService.getQuickMarks();
    const listEl = document.getElementById('quickmark-list');
    if (!listEl) return;
    
    if (quickMarks.length === 0) {
        listEl.innerHTML = '<p class="text-xs text-gray-500 text-center p-4">저장된 코멘트가 없습니다</p>';
        return;
    }
    
    listEl.innerHTML = quickMarks.map(qm => `
        <div class="quickmark-item p-2 hover:bg-gray-100 rounded-md" data-id="${qm.id}">
            <div class="flex items-start gap-2">
                <div class="flex-1 cursor-pointer" onclick="insertQuickMark('${qm.content.replace(/'/g, "\\'")}')">
                    <p class="text-xs font-semibold text-gray-800">${qm.title}</p>
                    <p class="text-xs text-gray-600 truncate">${qm.content}</p>
                </div>
                <div class="flex gap-1">
                    <button class="text-blue-500 hover:text-blue-700 p-1" 
                            onclick="event.stopPropagation(); editQuickMark('${qm.id}')" title="수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-700 p-1" 
                            onclick="event.stopPropagation(); deleteQuickMark('${qm.id}')" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function editQuickMark(id) {
    const quickMarks = FeedbackDataService.getQuickMarks();
    const mark = quickMarks.find(qm => qm.id === id);
    if (!mark) return;
    
    // 편집 모드로 전환
    const item = document.querySelector(`.quickmark-item[data-id="${id}"]`);
    if (!item) return;
    
    item.innerHTML = `
        <div class="space-y-2">
            <input type="text" id="edit-qm-title-${id}" value="${mark.title}" 
                   class="w-full p-2 border rounded-md text-xs" placeholder="제목">
            <textarea id="edit-qm-content-${id}" rows="3" 
                      class="w-full p-2 border rounded-md text-xs" placeholder="내용">${mark.content}</textarea>
            <div class="flex gap-2">
                <button onclick="saveEditQuickMark('${id}')" 
                        class="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                    저장
                </button>
                <button onclick="renderQuickMarkList()" 
                        class="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">
                    취소
                </button>
            </div>
        </div>
    `;
}

function saveEditQuickMark(id) {
    const title = document.getElementById(`edit-qm-title-${id}`).value.trim();
    const content = document.getElementById(`edit-qm-content-${id}`).value.trim();
    
    if (!title || !content) {
        alert('제목과 내용을 모두 입력하세요.');
        return;
    }
    
    const quickMarks = FeedbackDataService.getQuickMarks();
    const mark = quickMarks.find(qm => qm.id === id);
    if (mark) {
        mark.title = title;
        mark.content = content;
        renderQuickMarkList();
        showToast('자주 쓰는 코멘트가 수정되었습니다.', 'success');
    }
}

function insertQuickMark(content) {
    const popover = document.getElementById('quickmark-popover');
    const targetId = popover.dataset.target;
    const textarea = document.getElementById(targetId);
    
    if (textarea) {
        textarea.value = content;
        textarea.focus();
    }
    
    hideQuickMarkPopover();
}

function deleteQuickMark(id) {
    if (!confirm('이 자주 쓰는 코멘트를 삭제하시겠습니까?')) return;
    
    const quickMarks = FeedbackDataService.getQuickMarks();
    const index = quickMarks.findIndex(qm => qm.id === id);
    if (index > -1) {
        quickMarks.splice(index, 1);
        renderQuickMarkList();
        showToast('자주 쓰는 코멘트가 삭제되었습니다.', 'success');
    }
}

function addNewQuickMark() {
    const title = document.getElementById('quickmark-new-title').value.trim();
    const content = document.getElementById('quickmark-new-content').value.trim();
    
    if (!title || !content) {
        alert('제목과 내용을 모두 입력하세요.');
        return;
    }
    
    const newMark = {
        id: `qm-${Date.now()}`,
        title: title,
        content: content
    };
    
    FeedbackDataService.addQuickMark(newMark);
    
    document.getElementById('quickmark-new-title').value = '';
    document.getElementById('quickmark-new-content').value = '';
    
    renderQuickMarkList();
    showToast('자주 쓰는 코멘트가 추가되었습니다.', 'success');
}

function saveQuickMarkFromText() {
    const title = document.getElementById('quickmark-title-from-text').value.trim();
    const popover = document.getElementById('quickmark-popover');
    const targetId = popover.dataset.target;
    const textarea = document.getElementById(targetId);
    const content = textarea ? textarea.value.trim() : '';
    
    if (!title || !content) {
        alert('제목을 입력하고, 저장할 내용이 있는지 확인해주세요.');
        return;
    }
    
    const newMark = {
        id: `qm-${Date.now()}`,
        title: title,
        content: content
    };
    
    FeedbackDataService.addQuickMark(newMark);
    
    document.getElementById('quickmark-title-from-text').value = '';
    renderQuickMarkList();
    hideQuickMarkPopover();
    showToast('자주 쓰는 코멘트가 추가되었습니다.', 'success');
}

// 자주 쓰는 코멘트 버튼 클릭 이벤트
document.addEventListener('click', (e) => {
    const quickmarkBtn = e.target.closest('.quickmark-btn');
    if (quickmarkBtn) {
        showQuickMarkPopover(quickmarkBtn);
        return;
    }
    
    // 팝오버 외부 클릭 시 닫기
    const popover = document.getElementById('quickmark-popover');
    if (popover && !popover.classList.contains('hidden') &&
        !e.target.closest('#quickmark-popover') &&
        !e.target.closest('.quickmark-btn')) {
        hideQuickMarkPopover();
    }
});

// ==================== 첨삭 수정 기능 (신규) ====================
function editMainComment(commentId) {
    const displayDiv = document.getElementById(`main-comment-display-${commentId}`);
    const editDiv = document.getElementById(`main-comment-edit-${commentId}`);
    
    if (displayDiv && editDiv) {
        displayDiv.style.display = 'none';
        editDiv.style.display = 'block';
        
        // textarea에 포커스
        const textarea = document.getElementById(`main-comment-textarea-${commentId}`);
        if (textarea) {
            textarea.focus();
        }
    }
}

function saveMainCommentEdit(commentId) {
    const textarea = document.getElementById(`main-comment-textarea-${commentId}`);
    const newText = textarea.value.trim();
    
    if (!newText) {
        alert('첨삭 내용을 입력하세요.');
        return;
    }
    
    // annotations에서 해당 코멘트 찾기
    for (const pageKey in annotations) {
        const annotation = annotations[pageKey].find(a => a.id === commentId);
        if (annotation && annotation.comments && annotation.comments.length > 0) {
            annotation.comments[0].text = newText;
            annotation.comments[0].timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
            
            // 첨부파일 처리
            if (window._pendingEditAttachments && window._pendingEditAttachments[commentId]) {
                annotation.comments[0].attachments = window._pendingEditAttachments[commentId];
                delete window._pendingEditAttachments[commentId];
            }
            
            // 음성 처리
            if (window._pendingEditAudio && window._pendingEditAudio[commentId]) {
                annotation.comments[0].audio = window._pendingEditAudio[commentId];
                delete window._pendingEditAudio[commentId];
            }
            
            break;
        }
    }
    
    // 서비스에도 업데이트
    FeedbackDataService.updateComment(currentFeedbackId, commentId, newText);
    
    // UI 업데이트
    renderCommentPanel();
    refreshInlineTabMarker();
    
    showToast('첨삭이 수정되었습니다.', 'success');
}

function cancelMainCommentEdit(commentId) {
    const displayDiv = document.getElementById(`main-comment-display-${commentId}`);
    const editDiv = document.getElementById(`main-comment-edit-${commentId}`);
    
    if (displayDiv && editDiv) {
        // 원래 내용으로 복원
        const textarea = document.getElementById(`main-comment-textarea-${commentId}`);
        for (const pageKey in annotations) {
            const annotation = annotations[pageKey].find(a => a.id === commentId);
            if (annotation && annotation.comments && annotation.comments.length > 0) {
                textarea.value = annotation.comments[0].text;
                break;
            }
        }
        
        // 임시 데이터 정리
        if (window._pendingEditAttachments && window._pendingEditAttachments[commentId]) {
            delete window._pendingEditAttachments[commentId];
        }
        if (window._pendingEditAudio && window._pendingEditAudio[commentId]) {
            delete window._pendingEditAudio[commentId];
        }
        
        displayDiv.style.display = 'block';
        editDiv.style.display = 'none';
    }
}

// ==================== 댓글 수정 기능 (신규) ====================
function editReply(parentCommentId, replyId) {
    const displayDiv = document.getElementById(`reply-display-${replyId}`);
    const editDiv = document.getElementById(`reply-edit-${replyId}`);
    
    if (displayDiv && editDiv) {
        displayDiv.style.display = 'none';
        editDiv.style.display = 'block';
        
        const textarea = document.getElementById(`reply-edit-textarea-${replyId}`);
        if (textarea) {
            textarea.focus();
        }
    }
}

function saveReplyEdit(parentCommentId, replyId) {
    const textarea = document.getElementById(`reply-edit-textarea-${replyId}`);
    const newText = textarea.value.trim();
    
    if (!newText) {
        alert('댓글 내용을 입력하세요.');
        return;
    }
    
    // annotations에서 해당 댓글 찾아서 수정
    for (const pageKey in annotations) {
        const annotation = annotations[pageKey].find(a => a.id === parentCommentId);
        if (annotation && annotation.comments) {
            const replyIndex = annotation.comments.findIndex(c => c.id === replyId);
            if (replyIndex >= 0) {
                annotation.comments[replyIndex].text = newText;
                annotation.comments[replyIndex].timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
                break;
            }
        }
    }
    
    // UI 업데이트
    renderCommentPanel();
    refreshInlineTabMarker();
    
    showToast('댓글이 수정되었습니다.', 'success');
}

function cancelReplyEdit(replyId) {
    const displayDiv = document.getElementById(`reply-display-${replyId}`);
    const editDiv = document.getElementById(`reply-edit-${replyId}`);
    
    if (displayDiv && editDiv) {
        displayDiv.style.display = 'block';
        editDiv.style.display = 'none';
    }
}

// ==================== 메인 첨삭 등록 (신규) ====================
function addMainComment(commentId) {
    console.log('🔵 [addMainComment] ============ 시작 ============');
    console.log('🔵 [addMainComment] commentId:', commentId);
    console.log('🔵 [addMainComment] currentFeedbackId:', currentFeedbackId);
    console.log('🔵 [addMainComment] typeof currentFeedbackId:', typeof currentFeedbackId);

    const textarea = document.getElementById(`main-comment-${commentId}`);
    console.log('🔵 [addMainComment] textarea:', textarea);
    console.log('🔵 [addMainComment] textarea가 보이는가?:', textarea ? (textarea.offsetParent !== null) : 'textarea 없음');

    if (!textarea) {
        console.error('❌ [addMainComment] textarea를 찾을 수 없음!');
        console.error('   찾으려고 한 ID:', `main-comment-${commentId}`);
        console.error('   페이지의 모든 textarea:', Array.from(document.querySelectorAll('textarea')).map(t => t.id));
        alert('입력창을 찾을 수 없습니다.\n\n이 오류는 다음 경우에 발생할 수 있습니다:\n• 다른 사용자가 작성한 첨삭\n• 페이지가 올바르게 로드되지 않음\n\n페이지를 새로고침하거나, 영역을 다시 지정해주세요.');
        return;
    }

    const text = textarea.value.trim();

    console.log('🔵 [addMainComment] textarea.value (원본):', JSON.stringify(textarea.value));
    console.log('🔵 [addMainComment] text (trim 후):', JSON.stringify(text));
    console.log('🔵 [addMainComment] text.length:', text.length);

    if (!text || text.length === 0) {
        console.log('❌ [addMainComment] text가 비어있음!');
        alert('첨삭 내용을 입력하세요.');
        textarea.focus();  // 입력창에 포커스
        return;
    }
    
    const newComment = {
        id: `cm-${Date.now()}`,
        authorId: CURRENT_USER.id,
        authorName: CURRENT_USER.name,
        authorRole: CURRENT_USER.role,
        text: text,
        audio: null,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        attachments: window._pendingMainAttachments || []
    };
    
    console.log('🔵 [addMainComment] newComment 생성:', JSON.stringify(newComment, null, 2));
    console.log('🔵 [addMainComment] 호출 직전 - currentFeedbackId:', currentFeedbackId);
    console.log('🔵 [addMainComment] 호출 직전 - commentId:', commentId);
    console.log('🔵 [addMainComment] 호출 직전 - isMainComment:', true);
    
    // ✅ 수정: FeedbackDataService만 사용 (중복 방지)
    // 로컬 annotations 직접 수정 제거
    console.log('🔵 [addMainComment] FeedbackDataService.addComment 호출 시작...');
    FeedbackDataService.addComment(currentFeedbackId, commentId, newComment, true); // true = 메인 첨삭
    console.log('🔵 [addMainComment] FeedbackDataService.addComment 호출 완료');
    
    // annotations 동기화
    const feedbackData = FeedbackDataService.getFeedbackData(currentFeedbackId);
    console.log('🔵 [addMainComment] feedbackData:', feedbackData);
    console.log('🔵 [addMainComment] feedbackData.annotations:', feedbackData ? feedbackData.annotations : 'null');
    
    if (feedbackData && feedbackData.annotations) {
        console.log('🔵 [addMainComment] annotations 동기화 시작');
        console.log('🔵 [addMainComment] 동기화 전 annotations:', annotations);
        
        // ✅ 수정: 병합 방식 - 로컬과 FEEDBACK_DATA 합치기
        const feedbackAnnotations = feedbackData.annotations;
        
        // FEEDBACK_DATA가 비어있으면 로컬 것 유지
        if (Object.keys(feedbackAnnotations).length === 0 && Object.keys(annotations).length > 0) {
            console.log('🔵 [addMainComment] FEEDBACK_DATA가 비어있음, 로컬 annotations 유지');
            // annotations 그대로 유지
        } else {
            // FEEDBACK_DATA에 데이터가 있으면 사용
            annotations = feedbackAnnotations;
        }
        
        console.log('🔵 [addMainComment] annotations 동기화 완료:', annotations);
        console.log('🔵 [addMainComment] Object.keys(annotations):', Object.keys(annotations));
    } else {
        console.error('❌ [addMainComment] feedbackData 또는 annotations가 없음!');
    }
    
    // UI 즉시 업데이트
    textarea.value = '';
    window._pendingMainAttachments = [];
    
    console.log('🔵 [addMainComment] UI 업데이트 시작');
    console.log('🔵 [addMainComment] renderCommentPanel 호출 전');
    renderCommentPanel();
    console.log('🔵 [addMainComment] renderCommentPanel 호출 후');
    refreshInlineTabMarker();
    
    console.log('🔵 [addMainComment] ============ 완료! ============');
    showToast('첨삭이 등록되었습니다.', 'success');
}

// ==================== 피드백 완료 (신규) ====================
function completeFeedback() {
    if (!confirm('전체 피드백을 완료하시겠습니까?\n학생에게 알림이 발송됩니다.')) {
        return;
    }
    
    // ✅ 수정: 제출물 상태를 '피드백 완료'로 변경
    const feedbackId = window._currentFeedbackCtx?.id || currentFeedbackId;
    const request = FeedbackDataService.getFeedbackRequestById(feedbackId);
    if (request) {
        request.status = '피드백 완료';
        request.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
        request.lastModifiedBy = CURRENT_USER.id;
    }
    
    // FEEDBACK_DATA도 업데이트
    const feedbackData = FeedbackDataService.getFeedbackData(feedbackId);
    if (feedbackData) {
        feedbackData.lastModified = new Date().toISOString().slice(0, 16).replace('T', ' ');
        feedbackData.lastModifiedBy = CURRENT_USER.id;
    }
    
    showToast('피드백이 완료되었습니다. 학생에게 알림이 발송됩니다.', 'success');
    
    // 모달 닫기
    setTimeout(() => {
        closeFeedbackModal();
    }, 1500);
}

// ==================== 첨삭/댓글 삭제 (신규) ====================
// 삭제 진행 중 플래그
let isDeletingComment = false;

function deleteMainComment(annotationId) {
    console.log('🔴 [deleteMainComment] ============ 시작 ============');
    console.log('🔴 [deleteMainComment] annotationId:', annotationId);

    // 중복 실행 방지
    if (isDeletingComment) {
        console.log('⚠️ [deleteMainComment] 이미 삭제 진행 중, 무시');
        return;
    }

    // 🐛 버그 수정: 커스텀 confirm은 콜백 방식이므로, 콜백으로 변경
    confirm('⚠️ 정말로 이 첨삭을 삭제하시겠습니까?\n\n삭제되는 것:\n• 첨삭 내용\n• 모든 댓글\n• PDF 영역 (사각형)\n\n이 작업은 되돌릴 수 없습니다.', () => {
        executeDeleteMainComment(annotationId);
    });
}

// 실제 삭제 로직 (분리)
function executeDeleteMainComment(annotationId) {
    console.log('🔴 [executeDeleteMainComment] 삭제 진행...');

    isDeletingComment = true;  // 플래그 설정

    // 1단계: 로컬 annotations에서 annotation 찾기
    let targetPage = null;
    let targetAnnotation = null;

    for (const page in annotations) {
        const ann = annotations[page].find(a => a.id === annotationId);
        if (ann) {
            targetPage = page;
            targetAnnotation = ann;
            break;
        }
    }

    console.log('🔴 [executeDeleteMainComment] 로컬에서 찾음 - page:', targetPage, 'annotation:', targetAnnotation);

    if (!targetAnnotation) {
        console.error('❌ [executeDeleteMainComment] annotation을 찾을 수 없음!');
        isDeletingComment = false;  // 플래그 해제
        alert('삭제할 첨삭을 찾을 수 없습니다.');
        return;
    }

    // 2단계: 메인 첨삭 ID 찾기
    let mainCommentId = null;
    if (targetAnnotation.comments && targetAnnotation.comments.length > 0) {
        mainCommentId = targetAnnotation.comments[0].id;
    }

    console.log('🔴 [executeDeleteMainComment] mainCommentId:', mainCommentId);

    // 3단계: FEEDBACK_DATA에서 삭제 (댓글이 있는 경우)
    if (mainCommentId) {
        const success = FeedbackDataService.deleteComment(currentFeedbackId, annotationId, mainCommentId);
        console.log('🔴 [executeDeleteMainComment] FeedbackDataService.deleteComment 결과:', success);
    }

    // 4단계: FEEDBACK_DATA에서 annotation 완전 삭제 (먼저 실행)
    console.log('🔴 [executeDeleteMainComment] FEEDBACK_DATA에서 annotation 삭제...');
    FeedbackDataService.deleteAnnotation(currentFeedbackId, targetPage, annotationId);

    // 5단계: 캔버스에서 영역 삭제 ⭐ 중요!
    console.log('🔴 [executeDeleteMainComment] 캔버스에서 영역 삭제 시작...');
    if (fabricCanvas) {
        const objects = fabricCanvas.getObjects();
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            if (obj.id === annotationId) {
                console.log('🔴 [executeDeleteMainComment] 캔버스 객체 찾음:', obj.id);
                fabricCanvas.remove(obj);
                console.log('🔴 [executeDeleteMainComment] 캔버스에서 제거 완료');
                break;
            }
        }
        fabricCanvas.renderAll();
    } else {
        console.error('❌ [executeDeleteMainComment] fabricCanvas가 없음!');
    }

    // 6단계: 로컬 annotations에서 삭제
    console.log('🔴 [executeDeleteMainComment] 로컬 annotations에서 삭제...');
    if (targetPage && annotations[targetPage]) {
        const index = annotations[targetPage].findIndex(a => a.id === annotationId);
        if (index !== -1) {
            annotations[targetPage].splice(index, 1);
            console.log('🔴 [executeDeleteMainComment] 로컬에서 제거 완료, index:', index);

            // 페이지에 annotation이 하나도 없으면 페이지 키 삭제
            if (annotations[targetPage].length === 0) {
                delete annotations[targetPage];
                console.log('🔴 [executeDeleteMainComment] 페이지 키 삭제:', targetPage);
            }
        }
    }

    // 7단계: UI 업데이트
    console.log('🔴 [executeDeleteMainComment] UI 업데이트...');
    renderCommentPanel();
    refreshInlineTabMarker();

    // 8단계: 마커 재생성
    if (targetPage) {
        console.log('🔴 [executeDeleteMainComment] 마커 재생성...');
        redrawMarkersForPage(parseInt(targetPage));
    }

    console.log('🔴 [executeDeleteMainComment] ============ 완료! ============');
    isDeletingComment = false;  // 플래그 해제
    showToast('첨삭과 영역이 삭제되었습니다.', 'success');
    // 🔧 hideModal() 제거: confirm 콜백에서 자동으로 닫힘
}

function deleteReply(annotationId, replyId) {
    console.log('🔴 [deleteReply] ============ 시작 ============');
    console.log('🔴 [deleteReply] annotationId:', annotationId);
    console.log('🔴 [deleteReply] replyId:', replyId);

    // 🐛 버그 수정: 커스텀 confirm은 콜백 방식이므로, 콜백으로 변경
    confirm('⚠️ 정말로 이 댓글을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.', () => {
        executeDeleteReply(annotationId, replyId);
    });
}

// 실제 댓글 삭제 로직 (분리)
function executeDeleteReply(annotationId, replyId) {
    console.log('🔴 [executeDeleteReply] 삭제 진행...');

    // 삭제 실행
    const success = FeedbackDataService.deleteComment(currentFeedbackId, annotationId, replyId);

    console.log('🔴 [executeDeleteReply] FeedbackDataService.deleteComment 결과:', success);

    if (success) {
        // 로컬 annotations 동기화
        const feedbackData = FeedbackDataService.getFeedbackData(currentFeedbackId);
        if (feedbackData && feedbackData.annotations) {
            // 병합 방식
            if (Object.keys(feedbackData.annotations).length > 0) {
                annotations = feedbackData.annotations;
                console.log('🔴 [executeDeleteReply] annotations 동기화 완료');
            }
        }

        // UI 업데이트
        renderCommentPanel();
        refreshInlineTabMarker();

        console.log('🔴 [executeDeleteReply] ============ 완료! ============');
        showToast('댓글이 삭제되었습니다.', 'success');
        // 🔧 hideModal() 제거: confirm 콜백에서 자동으로 닫힘
    } else {
        alert('댓글 삭제에 실패했습니다.');
    }
}

// ==================== 댓글 첨부파일 업로드 (신규) ====================
function uploadReplyAttachment(commentId) {
    let inp = document.getElementById(`reply-attach-input-${commentId}`);
    if (!inp) {
        inp = document.createElement('input');
        inp.type = 'file';
        inp.id = `reply-attach-input-${commentId}`;
        inp.multiple = true;
        inp.accept = '.png,.jpg,.jpeg,.pdf,.doc,.docx';
        inp.style.display = 'none';
        document.body.appendChild(inp);
        
        inp.addEventListener('change', () => {
            const files = Array.from(inp.files || []).map(f => ({
                name: f.name,
                size: f.size,
                url: URL.createObjectURL(f)
            }));
            window._pendingReplyAttachments = files;
            showToast(`${files.length}개 파일이 선택되었습니다.`, 'success');
        });
    }
    inp.click();
}

// ==================== 수정 모드 보조 기능 (신규) ====================
function uploadEditAttachment(commentId) {
    let inp = document.getElementById(`edit-attach-input-${commentId}`);
    if (!inp) {
        inp = document.createElement('input');
        inp.type = 'file';
        inp.id = `edit-attach-input-${commentId}`;
        inp.multiple = true;
        inp.accept = '.png,.jpg,.jpeg,.pdf,.doc,.docx';
        inp.style.display = 'none';
        document.body.appendChild(inp);
        
        inp.addEventListener('change', () => {
            const files = Array.from(inp.files || []).map(f => ({
                name: f.name,
                size: f.size,
                url: URL.createObjectURL(f)
            }));
            window._pendingEditAttachments = window._pendingEditAttachments || {};
            window._pendingEditAttachments[commentId] = files;
            showToast(`${files.length}개 파일이 선택되었습니다.`, 'success');
        });
    }
    inp.click();
}

let editMediaRecorder = null;
let editAudioChunks = [];
let editRecordingCommentId = null;

async function startEditVoiceRecording(commentId) {
    const button = event.target.closest('.record-btn');
    
    if (button.classList.contains('recording')) {
        // 녹음 중지
        if (editMediaRecorder) {
            editMediaRecorder.stop();
        }
        return;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        editMediaRecorder = new MediaRecorder(stream);
        editAudioChunks = [];
        editRecordingCommentId = commentId;
        
        editMediaRecorder.ondataavailable = (e) => {
            editAudioChunks.push(e.data);
        };
        
        editMediaRecorder.onstop = () => {
            const audioBlob = new Blob(editAudioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // 수정 중인 textarea에 오디오 정보 저장
            window._pendingEditAudio = window._pendingEditAudio || {};
            window._pendingEditAudio[editRecordingCommentId] = audioUrl;
            
            showToast('음성 녹음이 완료되었습니다.', 'success');
            
            button.classList.remove('recording');
            button.querySelector('.fa-stop').style.display = 'none';
            button.querySelector('.fa-microphone').style.display = 'inline';
            
            stream.getTracks().forEach(track => track.stop());
        };
        
        editMediaRecorder.start();
        button.classList.add('recording');
        button.querySelector('.fa-microphone').style.display = 'none';
        button.querySelector('.fa-stop').style.display = 'inline';
        
        showToast('녹음 중... (다시 클릭하여 중지)', 'info');
        
    } catch (error) {
        console.error('음성 녹음 오류:', error);
        showToast('마이크 접근 권한이 필요합니다.', 'error');
    }
}

// Export - 파트 2
window.addAnnotation = addAnnotation;
window.renderCommentPanel = renderCommentPanel;
window.goToPage = goToPage;
window.highlightComment = highlightComment;
window.addCommentReply = addCommentReply;
window.editReply = editReply;
window.saveReplyEdit = saveReplyEdit;
window.cancelReplyEdit = cancelReplyEdit;
window.addMainComment = addMainComment;
window.completeFeedback = completeFeedback;
window.deleteMainComment = deleteMainComment;
window.deleteReply = deleteReply;
window.uploadReplyAttachment = uploadReplyAttachment;
window.uploadEditAttachment = uploadEditAttachment;
window.startEditVoiceRecording = startEditVoiceRecording;
window.startVoiceRecording = startVoiceRecording;
window.addGeneralFeedback = addGeneralFeedback;
window.showToast = showToast;
window.showQuickMarkPopover = showQuickMarkPopover;
window.hideQuickMarkPopover = hideQuickMarkPopover;
window.insertQuickMark = insertQuickMark;
window.deleteQuickMark = deleteQuickMark;
window.addNewQuickMark = addNewQuickMark;
window.saveQuickMarkFromText = saveQuickMarkFromText;

// ==================== 저장 기능 ====================
function saveFeedbackTemp() {
    if (!currentFeedbackId) return;
    
    const feedbackData = {
        version: annotations.version || 1,
        annotations: annotations,
        generalFeedbackThread: FeedbackDataService.getFeedbackData(currentFeedbackId)?.generalFeedbackThread || []
    };
    
    FeedbackDataService.saveFeedbackData(currentFeedbackId, feedbackData);
    showToast('임시저장되었습니다.', 'success');
}

function saveFeedbackFinal() {
    if (!currentFeedbackId) return;
    
    const feedbackData = {
        version: annotations.version || 1,
        annotations: annotations,
        generalFeedbackThread: FeedbackDataService.getFeedbackData(currentFeedbackId)?.generalFeedbackThread || []
    };
    
    FeedbackDataService.saveFeedbackData(currentFeedbackId, feedbackData);
    
    // 제출물 상태 업데이트
    const request = FeedbackDataService.getFeedbackRequestById(currentFeedbackId);
    if (request) {
        request.status = '피드백 완료';
        request.feedbackDate = new Date().toISOString().slice(0, 10);
    }
    
    showToast('피드백이 저장되었습니다.', 'success');
    
    // 3초 후 모달 닫기
    setTimeout(() => {
        closeFeedbackModal();
        // 목록 새로고침
        if (typeof renderFeedbackList === 'function') {
            renderFeedbackList();
        }
    }, 1500);
}

// ==================== 첨부파일 업로드 ====================
function uploadAttachment(targetId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // 실제 구현 시 서버 업로드
        showToast(`파일 "${file.name}" 첨부 준비됨 (구현 예정)`, 'info');
    };
    input.click();
}

// ==================== 코멘트 연결 (개선) ====================
let linkingCommentId = null;

function linkComment(commentId) {
    if (!linkingCommentId) {
        // 첫 번째 코멘트 선택 - 연결 모드 시작
        linkingCommentId = commentId;
        
        // 버튼 변경: [연결] → [연결 취소]
        const linkBtn = document.getElementById(`link-btn-${commentId}`);
        if (linkBtn) {
            linkBtn.innerHTML = '<i class="fas fa-unlink"></i> <span>연결 취소</span>';
            linkBtn.classList.add('active-linking');
        }
        
        // 해당 코멘트 카드만 하이라이트 (댓글 제외)
        document.querySelectorAll('.comment-card').forEach(card => {
            card.classList.remove('linking-mode', 'linkable');
        });
        const card = document.querySelector(`.comment-card[data-comment-id="${commentId}"]`);
        if (card) {
            card.classList.add('linking-mode');
        }
        
        // 다른 카드들을 선택 가능한 상태로 표시
        document.querySelectorAll('.comment-card').forEach(otherCard => {
            if (otherCard.dataset.commentId !== commentId) {
                otherCard.classList.add('linkable');
            }
        });
        
        showToast('연결할 다른 코멘트를 선택하세요', 'info');
    } else if (linkingCommentId === commentId) {
        // 같은 버튼 클릭 - 연결 취소
        cancelLinking();
    } else {
        // 두 번째 코멘트 선택 - 연결 실행
        const firstId = linkingCommentId;
        const secondId = commentId;

        // annotations에서 두 코멘트 찾기
        let firstComment = null;
        let secondComment = null;

        for (const pageKey in annotations) {
            const found1 = annotations[pageKey].find(a => a.id === firstId);
            const found2 = annotations[pageKey].find(a => a.id === secondId);
            if (found1) firstComment = found1;
            if (found2) secondComment = found2;
        }

        if (firstComment && secondComment) {
            if (!firstComment.linkedComments) firstComment.linkedComments = [];
            if (!secondComment.linkedComments) secondComment.linkedComments = [];

            if (!firstComment.linkedComments.includes(secondId)) {
                firstComment.linkedComments.push(secondId);
            }
            if (!secondComment.linkedComments.includes(firstId)) {
                secondComment.linkedComments.push(firstId);
            }

            // 🐛 버그 수정: 연결 모드 해제를 renderCommentPanel() 전에 수행
            // renderCommentPanel()이 모든 버튼을 재생성하므로, 먼저 linkingCommentId를 null로 설정
            linkingCommentId = null;

            // UI 업데이트
            renderCommentPanel();
            refreshInlineTabMarker();

            showToast('코멘트가 연결되었습니다', 'success');
        } else {
            // 연결 실패 시에도 모드 해제
            cancelLinking();
        }
    }
}

// 연결 모드 취소
function cancelLinking() {
    if (!linkingCommentId) return;
    
    // 버튼 복원: [연결 취소] → [연결]
    const linkBtn = document.getElementById(`link-btn-${linkingCommentId}`);
    if (linkBtn) {
        linkBtn.innerHTML = '<i class="fas fa-link"></i> <span>연결</span>';
        linkBtn.classList.remove('active-linking');
    }
    
    // 카드 강조 제거
    document.querySelectorAll('.comment-card').forEach(card => {
        card.classList.remove('linking-mode', 'linkable');
    });
    
    linkingCommentId = null;
    showToast('연결이 취소되었습니다', 'info');
}

window.saveFeedbackTemp = saveFeedbackTemp;
window.saveFeedbackFinal = saveFeedbackFinal;
window.uploadAttachment = uploadAttachment;
window.linkComment = linkComment;
window.cancelLinking = cancelLinking;
window.editMainComment = editMainComment;
window.saveMainCommentEdit = saveMainCommentEdit;
window.cancelMainCommentEdit = cancelMainCommentEdit;
window.editQuickMark = editQuickMark;
window.saveEditQuickMark = saveEditQuickMark;
window.updateGeneralFeedback = updateGeneralFeedback;
window.goToLinkedComment = goToLinkedComment;
window.findCommentPage = findCommentPage;

