# Phase 4 - v2 추가 수정 사항

## ✅ 완료된 수정 (9개)

| 번호 | 항목 | 상태 | 파일 |
|------|------|------|------|
| ✅ 공통 | 버튼 레이블 추가 | 완료 | feedback-viewer.js, feedback-tools.js |
| ✅ 1 | 총평 교수당 1개 제한 | 완료 | feedback-tools.js |
| ✅ 2 | 자주쓰는 코멘트 개선 | 완료 | feedback-tools.js |
| ✅ 3 | 코멘트 연결 기능 | 완료 | feedback-tools.js |
| ✅ 4 | 첨부파일 기능 | 완료 | feedback-tools.js |
| ✅ 6 | 저장 버튼 | 완료 | feedback-viewer.js, feedback-tools.js |
| ✅ 9 | 표절률 표시 개선 | 완료 | feedback-list.js |
| ✅ 10 | 외곽선 색상 조절 | 완료 | feedback.css |
| ✅ 11 | 색상 코드 10개 확장 | 완료 | feedback-data.js |
| ✅ 12 | 학생 댓글 UI | 완료 | feedback-tools.js |

---

## 📋 상세 수정 내역

### **✅ 공통: 버튼 레이블 추가**

**변경 전:**
```html
<button>
    <i class="fas fa-paperclip"></i>
</button>
```

**변경 후:**
```html
<button class="flex items-center gap-1">
    <i class="fas fa-paperclip"></i>
    <span>첨부</span>
</button>
```

**적용 위치:**
- 총평 입력 영역: 등록, 자주 쓰는 코멘트, 첨부
- 코멘트 카드: 등록, 음성, 자주쓰는 코멘트, 첨부, 연결

---

### **✅ 1. 총평 교수당 1개로 제한**

**변경 사항:**
- 기존: 스레드 형식 (여러 개 추가 가능)
- 변경: 교수당 1개만 작성/수정 가능

**동작:**
```
1. 다른 교수들의 총평 표시 (읽기 전용)
2. 내 총평 표시 (수정 가능)
   - 기존 총평 있으면 수정 모드
   - 없으면 새로 작성
```

**UI:**
```
┌─────────────────────────────────┐
│ 📝 박교수 (주지도)              │
│ [수정 가능한 textarea]          │
│ [수정] 버튼                     │
│ 2025-11-20 09:35                │
└─────────────────────────────────┘
```

---

### **✅ 2. 자주 쓰는 코멘트 개선**

**2-1. 팝오버 위치 자동 조정**
```javascript
// 화면 아래로 나가는지 확인
if (top + popoverHeight > window.innerHeight) {
    // 버튼 위에 표시
    top = rect.top - popoverHeight - 5;
}

// 화면 오른쪽으로 나가는지 확인
if (left + popoverWidth > window.innerWidth) {
    left = window.innerWidth - popoverWidth - 10;
}
```

**2-2. 수정/삭제 UI 추가**
```
┌────────────────────────────┐
│ 참고문헌 형식 통일    [✏️][🗑️]│
│ 참고문헌 형식을...          │
└────────────────────────────┘
```

**기능:**
- ✅ [✏️] 클릭 → 편집 모드
- ✅ [🗑️] 클릭 → 삭제 (확인 후)
- ✅ 편집 모드에서 [저장]/[취소]

**2-3. 버튼 텍스트 변경**
```
"회신" → "등록"
```

---

### **✅ 3. 코멘트 연결 기능**

**동작 방식:**
```
1. 첫 번째 코멘트에서 [연결] 버튼 클릭
   → 카드 파란색 하이라이트

2. 두 번째 코멘트에서 [연결] 버튼 클릭
   → 두 코멘트 연결 완료

3. 같은 코멘트 다시 클릭 → 취소
```

**UI:**
```
코멘트 카드에 [연결] 버튼 추가
연결 모드일 때 파란색 테두리 + 그림자
```

**데이터 구조:**
```javascript
{
    id: 'anno-001',
    linkedComments: ['anno-005', 'anno-012']
}
```

---

### **✅ 4. 첨부파일 기능**

**동작:**
```javascript
function uploadAttachment(targetId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = (e) => {
        const file = e.target.files[0];
        // 서버 업로드 (구현 예정)
    };
    input.click();
}
```

**상태:** 파일 탐색기 호출 ✅ (업로드 구현은 Phase 5)

---

### **✅ 6. 저장 버튼**

**위치:** 모달 헤더 우측

**버튼:**
```
[임시저장] [저장] [X]
```

**동작:**
- **임시저장**: 주석 + 코멘트 저장, 상태 변경 없음
- **저장**: 주석 + 코멘트 저장, 상태 "피드백 완료"로 변경 → 1.5초 후 모달 닫기

---

### **✅ 9. 표절률 표시 개선**

**변경 전:**
```
📋 12% / 🤖 5%
```

**변경 후:**
```
카피킬러: 12% [📄]
GPT킬러: 5%   [📄]
```

- [📄] 클릭 → 리포트 보기 (구현 예정 alert 표시)

---

### **✅ 10. 외곽선 색상 조절**

**CSS 추가:**
```css
/* 전체 캔버스 투명도 */
.canvas-container canvas {
    opacity: 0.7;
}

/* 코멘트 영역 투명도 */
.fabric-rect[data-type="comment"] {
    opacity: 0.3 !important;
}
```

**효과:** 본문 내용이 더 잘 보임

---

### **✅ 11. 색상 코드 10개 확장**

**추가된 사용자:**
```
P001: 박교수 (주지도) - 노란색/빨간색
P002: 이철수 (공동) - 주황색/파란색
P003: 김영희 (공동) - 초록색
P004: 정민수 (공동) - 보라색
P005: 최수진 (공동) - 분홍색
P006: 강대성 (공동) - 하늘색
P007: 윤서영 (공동) - 황금색
P008: 한지원 (공동) - 밝은 빨강
P009: 오준호 (공동) - 인디고
P010: 임현정 (공동) - 청록색
```

**그룹 지도 대응:** 최대 10명의 교수가 서로 다른 색상으로 표시 가능

---

### **✅ 12. 학생 댓글 UI**

**말풍선 스타일:**
```css
/* 교수 (주지도) */
.professor-main {
    background-color: #F5F1E9;
    border-left: 3px solid #6A0028;
    align-self: flex-end;
}

/* 교수 (공동지도) */
.professor-co {
    background-color: #E0F2FE;
    border-left: 3px solid #0369A1;
    align-self: flex-end;
}

/* 학생 */
.student-comment {
    background-color: #F3F4F6;
    border-left: 3px solid #6B7280;
    align-self: flex-start;  ← 왼쪽 정렬
}
```

**예시 데이터:** feedback-data.js에 학생 댓글 샘플 포함

---

## ⚠️ 알려진 이슈 (복잡한 오류)

### **5. 본문 마커 오류**
**증상:**
- 마커가 페이지 이동 후에만 표시됨
- 영역 지정 시 원인 미상 오류 메시지

**원인 추정:**
- `redrawMarkersForPage()` 호출 타이밍 문제
- Fabric.js 객체 직렬화/역직렬화 오류

**해결 방안:** (추가 디버깅 필요)
```javascript
// addAnnotation 직후 강제 재렌더링
function addAnnotation(obj, type) {
    // ... 기존 코드 ...
    
    if (type === 'comment') {
        setTimeout(() => {
            redrawMarkersForPage(pageNum);
        }, 100);
    }
}
```

---

### **7. 동시 편집 명시적 경고**
**요구사항:**
- A 교수 편집 중 → B 교수 접속 시 명시적 메시지

**현재 상태:**
- 버전 정보만 표시 (⚠️ 경고 배너)

**개선 방안:**
```javascript
// 실시간 확인 (WebSocket 필요)
function checkActiveEditors() {
    // API 호출: GET /api/feedback/{id}/active-editors
    const activeEditors = [...];
    
    if (activeEditors.length > 0 && !activeEditors.includes(CURRENT_USER.id)) {
        showModal(`
            🚨 다른 교수님이 편집 중입니다
            
            ${activeEditors.map(e => e.name).join(', ')}님이
            현재 이 문서를 편집하고 있습니다.
            
            동시 편집 시 내용이 덮어쓰여질 수 있습니다.
        `);
    }
}
```

---

### **8. 텍스트 선택 마커 위치**
**증상:**
- 텍스트 드래그 시 마커가 페이지 외곽에 표시

**원인:**
- `left/top` 계산 오류
- `currentScale` 미반영

**해결 방안:**
```javascript
// redrawMarkersForPage 수정
const left = (comment.left) * currentScale;
const top = (comment.top) * currentScale;

// Group 객체일 경우
if (comment.type === 'group' && comment.objects) {
    const bounds = getGroupBounds(comment);
    left = bounds.left * currentScale;
    top = bounds.top * currentScale;
}
```

---

### **13. 판서 출력 오류**
**증상:**
- 다른 페이지 이동 후 판서 페이지로 돌아오면 안 보임
- 스크롤로 이동하면 보이나, 다른 페이지에서도 표시됨

**원인:**
- `loadAnnotationsForPage()` 호출 시 Fabric 객체 제거/추가 로직 오류
- `fabricCanvas.clear()` 누락

**해결 방안:**
```javascript
function loadAnnotationsForPage(num) {
    // 기존 객체 모두 제거 (eraserRect 제외)
    fabricCanvas.getObjects().forEach(obj => {
        if (obj !== eraserRect) {
            fabricCanvas.remove(obj);
        }
    });
    
    // 주석 로드
    if (annotations[num]) {
        fabric.util.enlivenObjects(annotations[num], (objects) => {
            objects.forEach((obj) => {
                fabricCanvas.add(obj);
            });
            fabricCanvas.renderAll();
        });
    }
    
    redrawMarkersForPage(num);
    renderCommentPanel();
}
```

---

## 📊 수정 요약

| 구분 | 개수 |
|------|------|
| ✅ 완료 | 9개 |
| ⚠️ 복잡 (추가 작업 필요) | 4개 |
| **총계** | **13개** |

---

## 🧪 테스트 체크리스트

### **완료된 기능**
- [ ] 버튼 레이블 표시 확인
- [ ] 총평 1개만 작성/수정 가능
- [ ] 자주 쓰는 코멘트 팝오버 위치 자동 조정
- [ ] 자주 쓰는 코멘트 수정/삭제
- [ ] 코멘트 연결 기능
- [ ] 첨부파일 탐색기 호출
- [ ] 임시저장/저장 버튼
- [ ] 표절률 명시적 표시 + 리포트 링크
- [ ] 외곽선 투명도 조절
- [ ] 10명 교수 색상 구분
- [ ] 학생 댓글 말풍선 스타일

### **알려진 이슈 (추가 작업 필요)**
- [ ] 본문 마커 즉시 표시
- [ ] 동시 편집 실시간 경고
- [ ] 텍스트 선택 마커 위치 정확도
- [ ] 판서 페이지 이동 시 올바른 표시

---

## 📁 수정된 파일

```
✅ feedback-viewer.js      (버튼 레이블, 저장 버튼)
✅ feedback-tools.js       (총평, 자주쓰는 코멘트, 연결, 첨부, 저장)
✅ feedback-list.js        (표절률 표시)
✅ feedback-data.js        (색상 10개, 학생 댓글)
✅ feedback.css            (연결 모드, 외곽선 투명도)
```

---

## 💡 다음 단계

**우선 순위 1 (긴급):**
- 본문 마커 즉시 표시 오류 수정
- 판서 페이지 이동 오류 수정

**우선 순위 2 (중요):**
- 동시 편집 실시간 경고 (WebSocket)
- 텍스트 선택 마커 위치 정확도

**Phase 5 준비:**
- 심사관리 기능
- 학위논문 제출 현황

---

**v2 수정 완료!** 🎉
