# 관리자용 심사 일정 읽기 전용 화면 구현 완료

## 📅 작업 일시
**2026-01-08**

---

## ✅ 작업 완료

### 작업 목표
관리자 화면에서 심사 일정 저장 후 **읽기 전용 화면**으로 전환하여 저장된 정보를 확인할 수 있도록 개선

### 주요 개선사항
1. **일정 정보 레이아웃 변경**: 라벨-입력박스 세로 배치 → 좌우 배치
2. **저장 후 화면 전환**: 목록 복귀 → 읽기 전용 상세 화면
3. **수정 기능 추가**: 읽기 전용 화면에서 "수정" 버튼으로 다시 입력 폼 표시

---

## 📝 수정된 파일

### `admin-v3/assets/js/exam-schedule.js`

#### 1. 일정 정보 레이아웃 변경 (Lines 364-399)

**Before (세로 배치)**:
```html
<div class="grid grid-cols-3 gap-4 mb-4">
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
            심사 날짜 <span class="text-red-600">*</span>
        </label>
        <input type="date" class="w-full ...">
    </div>
    <!-- 심사 시간, 소요 시간 동일 패턴 -->
</div>
```

**After (가로 배치)**:
```html
<div class="space-y-3 mb-4">
    <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700 min-w-[120px]">
            심사 날짜 <span class="text-red-600">*</span>
        </label>
        <input type="date" class="flex-1 ...">
    </div>
    <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700 min-w-[120px]">
            심사 시간 <span class="text-red-600">*</span>
        </label>
        <input type="time" class="flex-1 ...">
    </div>
    <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700 min-w-[120px]">
            소요 시간 (분) <span class="text-red-600">*</span>
        </label>
        <select class="flex-1 ...">...</select>
    </div>
</div>
```

**변경 내용**:
- `grid grid-cols-3` → `space-y-3` (각 필드를 독립된 행으로)
- `block` label → `flex items-center` (좌우 배치)
- 라벨 너비 고정: `min-w-[120px]`
- 입력 박스: `flex-1` (나머지 공간 채우기)

---

#### 2. 읽기 전용 화면 렌더링 함수 추가 (Lines 541-774)

**함수명**: `renderExamScheduleReadonly(assignmentId)`

**기능**:
- 저장된 심사 일정 정보를 수정 불가 형태로 표시
- 학생용/교수용 화면과 동일한 디자인 적용
- "수정" 및 "삭제" 버튼 제공

**주요 섹션**:

##### 2.1 학생 정보 (Lines 590-631)
```javascript
<div class="px-6 py-4 border-b bg-gray-50">
    <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
    <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
        <div class="flex gap-2">
            <span class="text-gray-600 min-w-[80px]">학번:</span>
            <span class="text-gray-900 font-medium">${assignment.studentNumber}</span>
        </div>
        <!-- 기타 학생 정보 -->
    </div>
</div>
```

##### 2.2 일정 정보 (읽기 전용) (Lines 665-687)
```javascript
<div class="bg-white rounded-lg shadow-md mb-6">
    <div class="px-6 py-4 border-b">
        <h4 class="text-sm font-semibold text-gray-700 mb-3">일정 정보</h4>
        <div class="space-y-3">
            <div class="flex items-center gap-4">
                <span class="text-gray-600 min-w-[120px]">등록 상태:</span>
                <span class="text-gray-900 font-medium">등록 완료</span>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-gray-600 min-w-[120px]">심사 날짜:</span>
                <span class="text-gray-900 font-medium">${schedule.examDate}</span>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-gray-600 min-w-[120px]">심사 시간:</span>
                <span class="text-gray-900 font-medium">${schedule.examTime}</span>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-gray-600 min-w-[120px]">소요 시간:</span>
                <span class="text-gray-900 font-medium">${schedule.duration}분</span>
            </div>
        </div>
    </div>
</div>
```

**레이아웃 특징**:
- `space-y-3`: 각 항목 사이 간격
- `flex items-center gap-4`: 라벨-값 좌우 배치
- `min-w-[120px]`: 라벨 너비 고정 (입력 폼과 동일)
- `text-gray-600`: 라벨 색상
- `text-gray-900 font-medium`: 값 색상

##### 2.3 진행 방식 정보 (Lines 689-751)
```javascript
<div class="px-6 py-4 bg-white">
    <div class="flex items-center gap-2 mb-3">
        <h4 class="text-sm font-semibold text-gray-700">진행 방식</h4>
        <span class="px-3 py-1 rounded-full text-sm font-medium ${
            schedule.method === 'online'
                ? 'bg-[#FCE4EC] text-[#6A0028]'
                : 'bg-green-100 text-green-800'
        }">
            ${schedule.method === 'online' ? '온라인 (Zoom)' : '오프라인'}
        </span>
    </div>

    ${schedule.method === 'online' && schedule.onlineInfo ? `
        <div class="p-4 bg-[#FAF6F1] border border-[#E8E0D8] rounded-lg">
            <h5 class="font-medium text-gray-800 mb-3">Zoom 미팅 정보</h5>
            <div class="space-y-2 text-sm">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-gray-600">미팅 ID:</span>
                        <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                            ${schedule.onlineInfo.meetingId}
                        </div>
                    </div>
                    <div>
                        <span class="text-gray-600">비밀번호:</span>
                        <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                            ${schedule.onlineInfo.password}
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-gray-600">참가 URL:</span>
                        <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm break-all">
                            <a href="${schedule.onlineInfo.meetingUrl}" target="_blank" class="text-[#6A0028] hover:underline">
                                ${schedule.onlineInfo.meetingUrl}
                            </a>
                        </div>
                    </div>
                    <div>
                        <span class="text-gray-600">호스트 URL:</span>
                        <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm break-all">
                            <a href="${schedule.onlineInfo.hostUrl}" target="_blank" class="text-[#6A0028] hover:underline">
                                ${schedule.onlineInfo.hostUrl}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ` : ''}
</div>
```

**디자인 특징**:
- 제목 옆에 배지 (온라인: Wine 색상, 오프라인: 초록색)
- 온라인: Beige 배경 (`bg-[#FAF6F1]`)
- Grid 2-column 레이아웃 (미팅 ID/비밀번호, URL들)
- URL 링크: Wine 색상 (`text-[#6A0028]`)
- 학생용/교수용 화면과 완전 동일

##### 2.4 버튼 영역 (Lines 754-766)
```javascript
<div class="flex justify-end gap-2">
    <button type="button"
            onclick="editExamSchedule('${assignmentId}')"
            class="px-4 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034]">
        <i class="fas fa-edit mr-1"></i> 수정
    </button>
    <button type="button"
            onclick="deleteExamSchedule()"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
        <i class="fas fa-trash mr-1"></i> 삭제
    </button>
</div>
```

**버튼 기능**:
- **수정**: `editExamSchedule()` 호출 → 입력 폼 다시 렌더링
- **삭제**: `deleteExamSchedule()` 호출 → 기존 삭제 로직

---

#### 3. 수정 모드 전환 함수 추가 (Lines 776-782)

```javascript
/**
 * 수정 모드로 전환
 */
function editExamSchedule(assignmentId) {
    currentAssignmentId = assignmentId;
    renderExamScheduleDetail(assignmentId);
}
```

**기능**:
- 읽기 전용 화면에서 "수정" 버튼 클릭 시 호출
- `currentAssignmentId` 설정
- `renderExamScheduleDetail()` 호출하여 입력 폼 다시 표시

---

#### 4. 저장 후 로직 변경 (Lines 1047-1050)

**Before**:
```javascript
// 목록으로 돌아가기
setTimeout(() => {
    backToExamScheduleList();
}, 500);
```

**After**:
```javascript
// 읽기 전용 상세 화면으로 전환
setTimeout(() => {
    renderExamScheduleReadonly(currentAssignmentId);
}, 500);
```

**변경 내용**:
- 저장 후 목록으로 복귀하지 않음
- 대신 읽기 전용 상세 화면으로 전환
- 저장된 정보를 즉시 확인 가능

---

#### 5. 전역 함수 노출 (Lines 1099-1100)

```javascript
window.renderExamScheduleReadonly = renderExamScheduleReadonly;
window.editExamSchedule = editExamSchedule;
```

**목적**:
- HTML의 `onclick` 핸들러에서 직접 호출 가능
- 다른 스크립트에서도 접근 가능

---

## 🔄 화면 전환 흐름

### Before (이전)
```
목록 → 상세(입력 폼) → 저장 → 목록
                ↓
            (저장된 데이터 확인 불가)
```

**문제점**:
- 저장 후 바로 목록으로 복귀
- 저장된 정보를 확인하려면 목록에서 다시 클릭해야 함
- 입력 폼이 다시 표시됨 (읽기 전용 화면 없음)

### After (개선 후)
```
목록 → 상세(입력 폼) → 저장 → 읽기 전용 화면
        ↑                        ↓
        └────────── 수정 ─────────┘
                                ↓
                              목록
```

**개선사항**:
- 저장 후 읽기 전용 화면으로 전환
- 저장된 정보를 즉시 확인 가능
- "수정" 버튼으로 다시 입력 폼 진입 가능
- "목록으로 돌아가기" 버튼으로 목록 복귀

---

## 🎨 디자인 일관성

### 학생용/교수용/관리자용 화면 통일

| 섹션 | 학생용 | 교수용 | 관리자용 (읽기 전용) |
|------|-------|-------|-------------------|
| **일정 정보** | 좌우 배치 | 좌우 배치 | ✅ 좌우 배치 |
| **진행 방식 배지** | 제목 옆 | 제목 옆 | ✅ 제목 옆 |
| **온라인 배경** | Beige | Beige | ✅ Beige |
| **Grid 레이아웃** | 2-column | 2-column | ✅ 2-column |
| **URL 색상** | Wine | Wine | ✅ Wine |
| **심사위원 표시** | 이름 (역할) | 이름 (역할) | ✅ 이름 (역할) |

**결과**: 세 화면 모두 동일한 디자인 시스템 적용

---

## 📊 변경 내용 요약

### 1. 입력 폼 개선
- **라벨-입력박스 배치**: 세로 → 가로
- **라벨 너비**: 고정 (`min-w-[120px]`)
- **입력 박스**: 나머지 공간 채우기 (`flex-1`)

### 2. 읽기 전용 화면 추가
- **함수**: `renderExamScheduleReadonly()`
- **디자인**: 학생용/교수용과 동일
- **버튼**: 수정, 삭제

### 3. 저장 후 동작 변경
- **이전**: 목록 복귀
- **현재**: 읽기 전용 화면 표시

### 4. 수정 기능 추가
- **함수**: `editExamSchedule()`
- **동작**: 읽기 전용 → 입력 폼

---

## 🧪 테스트 시나리오

### 1. 신규 일정 등록
1. 관리자 대시보드 접속
2. "심사 일정 관리" 메뉴 클릭
3. 목록에서 "미등록" 상태인 학생 선택
4. 일정 정보 입력 (날짜, 시간, 소요 시간)
5. 진행 방식 선택 (온라인 or 오프라인)
6. 온라인인 경우 "링크 생성" 버튼 클릭
7. "저장" 버튼 클릭
8. ✅ **읽기 전용 화면 표시 확인**
   - 일정 정보 표시 (좌우 배치)
   - 진행 방식 배지 (제목 옆)
   - Zoom 미팅 정보 (Grid 2-column)
   - "수정" 및 "삭제" 버튼

### 2. 일정 수정
1. 읽기 전용 화면에서 "수정" 버튼 클릭
2. ✅ **입력 폼 다시 표시 확인**
   - 기존 값 유지
   - 수정 가능 상태
3. 정보 수정 (예: 시간 변경)
4. "저장" 버튼 클릭
5. ✅ **다시 읽기 전용 화면 표시 확인**
   - 수정된 정보 반영

### 3. 일정 삭제
1. 읽기 전용 화면에서 "삭제" 버튼 클릭
2. 확인 대화상자 "확인" 클릭
3. ✅ **목록 화면 복귀 확인**
4. 해당 학생 상태 "미등록"으로 변경 확인

### 4. 목록 복귀
1. 읽기 전용 화면에서 "목록으로 돌아가기" 버튼 클릭
2. ✅ **목록 화면 복귀 확인**
3. 해당 학생 상태 "등록 완료"로 표시 확인

### 5. 레이아웃 확인
1. 입력 폼 화면에서 레이아웃 확인
   - ✅ 일정 정보: 라벨-입력박스 좌우 배치
   - ✅ 라벨 너비: 120px 고정
   - ✅ 입력 박스: 나머지 공간 채우기
2. 읽기 전용 화면에서 레이아웃 확인
   - ✅ 일정 정보: 라벨-값 좌우 배치 (입력 폼과 동일)
   - ✅ 진행 방식: 제목 옆 배지
   - ✅ Zoom 정보: Grid 2-column

---

## 💡 추가 개선 가능 사항

### 1. URL 복사 버튼 추가
현재는 URL을 직접 선택해서 복사해야 함. 학생용/교수용처럼 "복사" 버튼 추가 가능.

### 2. 일정 수정 이력 추가
누가 언제 수정했는지 기록하고 표시.

### 3. 알림 기능
일정이 등록/수정/삭제되면 관련 교수 및 학생에게 알림.

### 4. 일정 충돌 경고 강화
읽기 전용 화면에서도 다른 일정과의 충돌 여부 표시.

---

## 📁 수정된 파일 요약

### 1. `admin-v3/assets/js/exam-schedule.js`
- **Lines 364-399**: 일정 정보 레이아웃 변경 (세로 → 가로)
- **Lines 541-774**: 읽기 전용 화면 렌더링 함수 추가 (약 233 라인)
- **Lines 776-782**: 수정 모드 전환 함수 추가
- **Lines 1047-1050**: 저장 후 로직 변경 (목록 복귀 → 읽기 전용 화면)
- **Lines 1099-1100**: 전역 함수 노출

**총 변경**: 약 270 라인 수정/추가

---

## ✅ 완료 체크리스트

- [x] 일정 정보 레이아웃 변경 (세로 → 가로)
- [x] 읽기 전용 화면 렌더링 함수 구현
- [x] 학생 정보 섹션 표시
- [x] 논문 정보 섹션 표시
- [x] 심사위원 정보 섹션 표시 (단순 형식)
- [x] 일정 정보 섹션 표시 (좌우 배치)
- [x] 진행 방식 섹션 표시 (배지 + 미팅 정보)
- [x] 온라인 Zoom 정보 표시 (Grid 2-column)
- [x] 오프라인 장소 정보 표시
- [x] "수정" 버튼 기능 구현
- [x] "삭제" 버튼 연결
- [x] 수정 모드 전환 함수 구현
- [x] 저장 후 읽기 전용 화면 전환
- [x] 전역 함수 노출
- [x] 문서 작성 완료

---

## 🔗 관련 문서

1. [committee-display-sync-completed.md](../../student-v3/docs/committee-display-sync-completed.md) - 심사위원 정보 표시 통일
2. [exam-schedule-ui-sync-completed.md](../../student-v3/docs/exam-schedule-ui-sync-completed.md) - 진행 방식 UI 동기화
3. [exam-schedule-mock-data-added.md](../../student-v3/docs/exam-schedule-mock-data-added.md) - Mock 데이터 추가
4. [exam-schedule-implementation-summary.md](../../student-v3/docs/exam-schedule-implementation-summary.md) - 전체 구현 요약

---

**작성일**: 2026-01-08
**작성자**: Claude Sonnet 4.5
**버전**: v1.0
**상태**: ✅ 관리자용 읽기 전용 화면 구현 완료
