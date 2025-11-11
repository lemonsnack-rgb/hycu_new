# Phase 4 - v4 원인 분석 및 근본 수정

## 🔍 원인 분석 완료

### **문제 1: 텍스트 드래그 좌표 계산 오류**

**증상:**
- 텍스트 드래그-드롭 시 오류 메시지
- 다른 페이지 이동 후 돌아와야 마커 생성
- 마커가 페이지 외곽에 생성

**원인:**
```javascript
// ❌ 잘못된 코드 (v3)
left: (r.left - canvasRect.left) / currentScale
top: (r.top - canvasRect.top) / currentScale

// 문제점:
// 1. canvasRect.left/top은 브라우저 뷰포트 기준 절대 좌표
// 2. currentScale로 나누면 안됨 (이미 픽셀 단위)
// 3. Fabric Group 좌표가 부정확하게 설정됨
```

**해결:**
```javascript
// ✅ 올바른 코드 (v4)
const left = r.left - canvasRect.left;  // 스케일 적용 X
const top = r.top - canvasRect.top;

// 마커 표시 시에도 스케일 곱하지 않음
marker.style.left = `${comment.left}px`;  // 그대로 사용
marker.style.top = `${comment.top}px`;
```

---

### **문제 2: 마커 생성 타이밍**

**증상:**
- 영역 지정 후 마커가 즉시 안 보임

**원인:**
```javascript
// ❌ 잘못된 코드 (v3)
setTimeout(() => {
    redrawMarkersForPage(pageNum);
}, 50);  // 50ms 지연 - 불안정
```

**해결:**
```javascript
// ✅ 올바른 코드 (v4)
fabricCanvas.renderAll();  // 즉시 렌더링

// setTimeout 제거, 즉시 마커 생성
if (type === 'comment') {
    redrawMarkersForPage(pageNum);
}
```

---

### **문제 3: 마커 위치가 페이지 외곽**

**원인:**
```javascript
// ❌ 잘못된 코드 (v3)
left = comment.left * currentScale;  // 스케일 중복 적용

// Group 객체 좌표 계산 오류
left = comment.left + comment.objects[0].left;  // 좌표 2배
```

**해결:**
```javascript
// ✅ 올바른 코드 (v4)
// Group이든 Rect든 모두 동일하게 처리
left = comment.left;  // 스케일 곱하지 않음
top = comment.top;

// 마커를 영역의 좌상단에 배치
marker.style.left = `${left}px`;
marker.style.top = `${top}px`;
```

---

## 📊 수정 사항 상세

### **1. setupTextSelection 함수 개선** ✨

**Before (v3):**
```javascript
const r = clientRects[i];
rects.push(new fabric.Rect({
    left: (r.left - canvasRect.left) / currentScale,  // ❌
    top: (r.top - canvasRect.top) / currentScale,     // ❌
    width: r.width / currentScale,                     // ❌
    height: r.height / currentScale                    // ❌
}));
```

**After (v4):**
```javascript
const r = clientRects[i];

// 캔버스 기준 상대 좌표 (스케일 적용 X)
const left = r.left - canvasRect.left;
const top = r.top - canvasRect.top;
const width = r.width;
const height = r.height;

console.log(`Rect ${i}:`, { left, top, width, height });

rects.push(new fabric.Rect({
    left: left,
    top: top,
    width: width,
    height: height,
    fill: CURRENT_USER.colors.comment,
    stroke: CURRENT_USER.colors.drawing,
    strokeWidth: 2 / currentScale  // 스케일만 반영
}));

// Group 좌표 명시적 설정
const group = new fabric.Group(rects, { ... });
group.set({
    left: firstRect.left - canvasRect.left,
    top: firstRect.top - canvasRect.top
});

console.log('Group 좌표:', { left: group.left, top: group.top });

fabricCanvas.add(group);
fabricCanvas.renderAll();  // ✅ 즉시 렌더링

addAnnotation(group, 'comment');
```

---

### **2. addAnnotation 함수 개선** ✨

**Before (v3):**
```javascript
if (type === 'comment') {
    setTimeout(() => {  // ❌ 불안정
        redrawMarkersForPage(pageNum);
    }, 50);
}
```

**After (v4):**
```javascript
console.log(`✅ Added annotation: type=${type}, id=${id}, page=${pageNum}`);
console.log('   좌표:', { 
    left: annotationData.left, 
    top: annotationData.top 
});

// 캔버스 즉시 렌더링
fabricCanvas.renderAll();

// 마커 즉시 생성 (setTimeout 제거)
if (type === 'comment') {
    const markerContainer = document.getElementById('marker-container');
    if (markerContainer) {
        redrawMarkersForPage(pageNum);
        console.log('   마커 생성 완료');
    }
}

return id;  // ID 반환
```

---

### **3. redrawMarkersForPage 함수 개선** ✨

**Before (v3):**
```javascript
if (comment.type === 'group') {
    left = comment.left * currentScale;  // ❌ 스케일 중복
}
```

**After (v4):**
```javascript
console.log('🔍 마커 재생성 시작:', { page: num });

pageComments.forEach(comment => {
    let left, top;
    
    // Group이든 Rect든 동일하게 처리
    if (comment.type === 'group') {
        left = comment.left;  // ✅ 스케일 X
        top = comment.top;
    } else {
        left = comment.left;
        top = comment.top;
    }
    
    // 범위 검증
    if (left < 0) left = 10;
    if (top < 0) top = 10;
    if (left > canvasWidth - 30) left = canvasWidth - 30;
    if (top > canvasHeight - 30) top = canvasHeight - 30;
    
    marker.style.left = `${left}px`;
    marker.style.top = `${top}px`;
    
    console.log(`    ✅ Marker ${commentCounter} 생성:`, { left, top });
});

console.log('✅ 마커 재생성 완료:', { total: commentCounter - 1 });
```

---

### **4. 영역 지정 도구 개선** ✨

**Before (v3):**
```javascript
fabricCanvas.add(newRect);
addAnnotation(newRect, 'comment');  // renderAll 없음
```

**After (v4):**
```javascript
console.log('영역 지정 완료:', {
    left: tempRect.left,
    top: tempRect.top,
    width: tempRect.width,
    height: tempRect.height
});

fabricCanvas.add(newRect);
fabricCanvas.renderAll();  // ✅ 즉시 렌더링

addAnnotation(newRect, 'comment');

showToast('영역이 지정되었습니다.', 'success');
```

---

### **5. 판서/하이라이트 도구 개선** ✨

**Before (v3):**
```javascript
e.path.set({ ... });
addAnnotation(e.path, currentTool);
```

**After (v4):**
```javascript
console.log(`Path 생성: ${currentTool}`, {
    pathLength: e.path.path ? e.path.path.length : 0
});

e.path.set({ ... });

fabricCanvas.renderAll();  // ✅ 즉시 렌더링

addAnnotation(e.path, currentTool);
```

---

### **6. 연결된 코멘트 이동 기능 추가** ✨

**새 기능:**
```javascript
// 코멘트 페이지 찾기
function findCommentPage(commentId) {
    for (const pageKey in annotations) {
        const found = annotations[pageKey].find(a => a.id === commentId);
        if (found) return parseInt(pageKey);
    }
    return null;
}

// 연결된 코멘트로 이동
function goToLinkedComment(commentId, targetPage) {
    // 페이지 이동
    if (targetPage && targetPage !== pageNum) {
        goToPage(targetPage);
    }
    
    // 코멘트 하이라이트
    setTimeout(() => {
        highlightComment(commentId);
        
        // 스크롤
        const commentCard = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentCard) {
            commentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, targetPage !== pageNum ? 500 : 100);
}
```

**UI:**
```html
<!-- 클릭 가능한 연결 코멘트 번호 -->
<button 
    onclick="goToLinkedComment('${item.id}', ${item.page})" 
    class="inline-block bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded">
    💬 ${item.number}
</button>
```

---

## 🐛 디버깅 로그 추가

### **콘솔 로그 체계**

**텍스트 선택:**
```
텍스트 선택 시작: { clientRects: 3, canvasRect: {...}, currentScale: 1 }
Rect 0: { left: 120, top: 250, width: 300, height: 18 }
Rect 1: { left: 120, top: 268, width: 300, height: 18 }
Rect 2: { left: 120, top: 286, width: 150, height: 18 }
Group 좌표: { left: 120, top: 250 }
✅ Added annotation: type=comment, id=anno-1730000000, page=1
   좌표: { left: 120, top: 250, type: group }
   마커 생성 완료
```

**영역 지정:**
```
영역 지정 완료: { left: 200, top: 300, width: 250, height: 150 }
✅ Added annotation: type=comment, id=anno-1730000001, page=1
   좌표: { left: 200, top: 300, type: rect }
   마커 생성 완료
```

**마커 재생성:**
```
🔍 마커 재생성 시작: { page: 1, totalPages: 3 }
  Comment 1: { id: 'anno-001', type: 'rect', left: 200, top: 300 }
    Rect 좌표: { left: 200, top: 300 }
    ✅ Marker 1 생성: { left: 200, top: 300 }
  Comment 2: { id: 'anno-002', type: 'group', left: 120, top: 250 }
    Group 좌표: { left: 120, top: 250 }
    ✅ Marker 2 생성: { left: 120, top: 250 }
✅ 마커 재생성 완료: { total: 2 }
```

**에러 발생:**
```
❌ addAnnotation 오류: [에러 메시지]
   스택: [스택 트레이스]
```

---

## 🧪 테스트 가이드

### **핵심 테스트 (5분)**

**1. 텍스트 드래그 선택 (중요!)** 🔥
```
1. [선택] 도구 클릭
2. PDF 텍스트 드래그
3. F12 → Console 확인
   ✅ "텍스트 선택 시작" 로그
   ✅ "Rect 0, 1, 2..." 로그
   ✅ "Group 좌표" 로그
   ✅ "Added annotation" 로그
   ✅ "마커 생성 완료" 로그
4. ✅ 마커가 텍스트 좌상단에 즉시 표시
5. ✅ 오류 메시지 없음
```

**2. 영역 지정** 🔥
```
1. [영역지정] 도구 클릭
2. 드래그로 영역 지정
3. F12 → Console 확인
   ✅ "영역 지정 완료" 로그
   ✅ "Added annotation" 로그
4. ✅ 마커 즉시 표시
```

**3. 판서** 🔥
```
1. [판서] 도구 선택
2. 선 그리기
3. 다른 페이지로 이동
4. [1페이지로 이동] 버튼 클릭
5. ✅ 판서 정상 표시
6. F12 → Console 확인
   ✅ "Path 생성: drawing" 로그
```

**4. 연결된 코멘트 이동** 🔥
```
1. 코멘트 ① [연결] → 코멘트 ⑤ [연결]
2. ✅ 연결 완료
3. 코멘트 ① 카드에서 "💬 5" 클릭
4. ✅ 5번 코멘트가 있는 페이지로 이동
5. ✅ 5번 코멘트 하이라이트
6. ✅ 5번 코멘트 카드로 스크롤
```

---

## 📊 수정 통계

```
수정된 함수:    6개
- setupTextSelection        (근본 수정)
- addAnnotation             (즉시 렌더링)
- redrawMarkersForPage      (좌표 계산 수정)
- mouse:up 핸들러           (로그 추가)
- path:created 핸들러       (로그 추가)
- renderCommentCard         (클릭 이동)

추가된 함수:    2개
- findCommentPage           (페이지 찾기)
- goToLinkedComment         (이동 기능)

로그 추가:      10+ 곳
에러 처리:      강화
```

---

## 🎯 예상 결과

### **텍스트 드래그**
```
Before (v3):
- 드래그 → 오류 메시지 😱
- 마커 안 보임
- 다른 페이지 갔다 와야 보임
- 마커가 페이지 밖에

After (v4):
- 드래그 → 토스트 "텍스트 영역 선택됨" ✅
- 마커 즉시 표시 ✅
- 마커가 텍스트 좌상단에 정확히 ✅
- 콘솔 로그로 추적 가능 ✅
```

### **영역 지정**
```
Before (v3):
- 영역 지정 → 마커 안 보임
- 페이지 이동 후 보임

After (v4):
- 영역 지정 → 토스트 "영역 지정됨" ✅
- 마커 즉시 표시 ✅
- 콘솔 로그 ✅
```

### **판서**
```
Before (v3):
- 판서 → 페이지 이동 → 사라짐 😱

After (v4):
- 판서 → 페이지 이동 → 정상 표시 ✅
- 콘솔 로그 ✅
```

---

## 💡 문제 해결 팁

### **마커가 여전히 안 보이면**
```
1. F12 → Console 탭
2. "Added annotation" 로그 확인
3. "마커 생성 완료" 로그 확인
4. annotations[1] 입력해서 데이터 확인
5. document.getElementById('marker-container').children 확인
```

### **마커 위치가 이상하면**
```
1. Console에서 "Marker N 생성: { left: X, top: Y }" 확인
2. left/top 값이 음수거나 너무 크면 버그
3. "Group 좌표" 또는 "Rect 좌표" 로그 확인
```

### **오류 메시지가 나오면**
```
1. Console에서 "❌ addAnnotation 오류" 확인
2. 스택 트레이스 확인
3. 어떤 함수에서 에러가 났는지 확인
```

---

## 🚀 다음 단계

**v4 테스트 후:**
1. 모든 문제 해결 확인
2. 추가 버그 있으면 보고
3. Phase 5 진행 (심사관리, 제출 현황)

---

**Version:** 4.4 (v4 Debug)  
**Date:** 2025-11-03  
**Status:** 🧪 Testing

**모든 콘솔 로그를 확인하면서 테스트해 주세요!** 🔍
