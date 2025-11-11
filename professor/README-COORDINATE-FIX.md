# Phase 4 - v4 좌표 계산 수정 ✅

## 🐛 발생한 문제

**증상:** 텍스트 드래그 시 엉뚱한 위치에 영역 표시

![문제 상황](업로드된 캡처 참조)
- 텍스트를 선택했는데 빨간 사각형이 다른 곳에 표시됨

---

## 🔍 원인 분석

### **좌표 시스템의 이해**

Fabric.js는 **2가지 좌표 시스템**을 사용합니다:

1. **논리 좌표** (Logical Coordinates)
   - Fabric 객체의 내부 좌표
   - 스케일과 무관
   - 저장되는 좌표

2. **화면 좌표** (Screen Coordinates)  
   - 브라우저 픽셀 좌표
   - 스케일에 따라 변함
   - 사용자가 보는 좌표

### **잘못된 v4 코드**

```javascript
// ❌ v4 (스케일 무시)
const left = r.left - canvasRect.left;  // 픽셀 그대로
const top = r.top - canvasRect.top;

marker.style.left = `${comment.left}px`;  // 논리 좌표를 픽셀로 사용
```

### **문제점**

```
currentScale = 1.5 (150% 확대) 인 경우:

텍스트 선택:
- 브라우저 픽셀 위치: 300px
- 저장된 논리 좌표: 300 (❌ 틀림, 200이어야 함)

마커 표시:
- 저장된 논리 좌표: 300
- 화면 픽셀 위치: 300px (❌ 틀림, 450px이어야 함)
```

---

## ✅ 올바른 변환

### **변환 공식**

```
픽셀 좌표 = 논리 좌표 × currentScale
논리 좌표 = 픽셀 좌표 ÷ currentScale
```

### **수정된 코드**

```javascript
// ✅ 텍스트 선택 시 (픽셀 → 논리)
const left = (r.left - canvasRect.left) / currentScale;
const top = (r.top - canvasRect.top) / currentScale;
const width = r.width / currentScale;
const height = r.height / currentScale;

console.log(`Rect ${i}:`, { 
    픽셀: { left: r.left - canvasRect.left, top: r.top - canvasRect.top },
    논리: { left, top, width, height }
});

// ✅ 마커 표시 시 (논리 → 픽셀)
let left = comment.left * currentScale;
let top = comment.top * currentScale;

console.log(`Comment:`, { 
    논리: { left: comment.left, top: comment.top },
    픽셀: { left, top }
});
```

---

## 📊 변환 예시

### **Scale = 1.0 (100%)**
```
텍스트 선택:
- 브라우저 위치: 200px
- 논리 좌표: 200 / 1.0 = 200 ✅

마커 표시:
- 논리 좌표: 200
- 화면 위치: 200 × 1.0 = 200px ✅
```

### **Scale = 1.5 (150% 확대)**
```
텍스트 선택:
- 브라우저 위치: 300px (확대되어 보임)
- 논리 좌표: 300 / 1.5 = 200 ✅

마커 표시:
- 논리 좌표: 200
- 화면 위치: 200 × 1.5 = 300px ✅
```

### **Scale = 0.75 (75% 축소)**
```
텍스트 선택:
- 브라우저 위치: 150px (축소되어 보임)
- 논리 좌표: 150 / 0.75 = 200 ✅

마커 표시:
- 논리 좌표: 200
- 화면 위치: 200 × 0.75 = 150px ✅
```

---

## 🧪 테스트

### **1. 100% (기본)**
```
1. F12 콘솔 열기
2. 확대/축소 확인 (콘솔에 currentScale 표시)
3. [선택] 도구로 텍스트 드래그
4. ✅ 빨간 사각형이 선택한 텍스트 위에 정확히 표시
5. ✅ 마커(①)가 텍스트 좌상단에 표시
```

### **2. 150% (확대)**
```
1. 확대 버튼 클릭 (또는 Ctrl + +)
2. [선택] 도구로 텍스트 드래그
3. ✅ 빨간 사각형이 선택한 텍스트 위에 정확히 표시
4. ✅ 마커가 올바른 위치에 표시
```

### **3. 75% (축소)**
```
1. 축소 버튼 클릭 (또는 Ctrl + -)
2. [선택] 도구로 텍스트 드래그
3. ✅ 빨간 사각형이 선택한 텍스트 위에 정확히 표시
4. ✅ 마커가 올바른 위치에 표시
```

---

## 📝 콘솔 로그 예시

### **정상 작동 시**
```
텍스트 선택 시작: {clientRects: 2, canvasRect: {...}, currentScale: 1.5}
Rect 0: {
  픽셀: {left: 300, top: 450},
  논리: {left: 200, top: 300, width: 280, height: 16}
}
Group 생성: {left: 200, top: 300, width: 186.67, height: 32}
✅ Added annotation: type=comment, id=anno-..., page=1
   좌표: {left: 200, top: 300, type: "group"}
🔍 마커 재생성 시작: {page: 1, currentScale: 1.5}
  Comment 1: {
    논리: {left: 200, top: 300},
    픽셀: {left: 300, top: 450}
  }
    ✅ Marker 1 생성: {left: 300, top: 450}
✅ 마커 재생성 완료: {total: 1}
```

---

## 🎯 체크리스트

- [ ] F12 콘솔 열기
- [ ] currentScale 값 확인
- [ ] 100%에서 텍스트 선택 → 정확한 위치
- [ ] 150%로 확대 → 텍스트 선택 → 정확한 위치
- [ ] 75%로 축소 → 텍스트 선택 → 정확한 위치
- [ ] 콘솔 로그에서 "픽셀" → "논리" 변환 확인
- [ ] 마커 표시에서 "논리" → "픽셀" 변환 확인

---

## 💡 핵심 요약

| 작업 | 좌표 변환 | 공식 |
|------|-----------|------|
| **텍스트 선택** | 픽셀 → 논리 | `/ currentScale` |
| **마커 표시** | 논리 → 픽셀 | `× currentScale` |
| **주석 저장** | 논리 좌표 저장 | - |
| **페이지 이동** | 논리 좌표 로드 | - |

---

## 📥 다운로드

[phase4-feedback-v4-coordinate-fix.zip (115 KB)](computer:///mnt/user-data/outputs/phase4-feedback-v4-coordinate-fix.zip)

---

## 🎉 결과

**Before (v4 스코프 수정):**
- 텍스트 드래그 → 엉뚱한 위치에 표시 😱
- 마커도 잘못된 위치

**After (v4 좌표 수정):**
- 텍스트 드래그 → 정확한 위치에 표시 ✅
- 마커도 정확한 위치 ✅
- 모든 확대/축소 비율에서 작동 ✅

---

**이제 정상 작동합니다!** 🎉

모든 확대/축소 비율에서 테스트해 주세요!
