# 학생용 심사 일정 - 진행방식 UI 동기화 계획

## 📅 작업 일시
**2026-01-08**

---

## 🎯 목표

교수용 화면의 "진행 방식" 영역 UI를 학생용 화면에 완전히 동기화

---

## 🔍 현재 상태 분석

### 교수용 화면 (professor-v3)

```javascript
<!-- 진행 방식 -->
<div class="mb-6">
    <h4 class="font-bold text-gray-800 mb-3">진행 방식</h4>

    <!-- ✅ 1. 배지 표시 -->
    <div class="mb-4">
        <span class="px-3 py-1 rounded-full text-sm font-medium ${
            schedule.method === 'online'
                ? 'bg-[#FCE4EC] text-[#6A0028]'
                : 'bg-green-100 text-green-800'
        }">
            ${schedule.method === 'online' ? '온라인 (Zoom)' : '오프라인'}
        </span>
    </div>

    <!-- ✅ 2. 온라인 정보 박스 -->
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

    <!-- ✅ 3. 오프라인 정보 박스 -->
    ${schedule.method === 'offline' && schedule.offlineInfo ? `
        <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h5 class="font-medium text-gray-800 mb-3">오프라인 심사</h5>
            <div class="text-sm">
                <span class="text-gray-600">장소:</span>
                <span class="ml-2 font-medium">${schedule.offlineInfo.location}</span>
            </div>
        </div>
    ` : ''}
</div>
```

### 학생용 화면 (student-v3) - 현재

```javascript
<!-- 진행 방식 정보 (읽기 전용) -->
<div class="px-6 py-4 bg-white">
    <h4 class="text-sm font-semibold text-gray-700 mb-3">진행 방식</h4>

    ${schedule.method === 'online' ? `
        <!-- ❌ 1. 배지 없음 -->

        <!-- ❌ 2. 온라인 정보 박스 (다른 스타일) -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-[#6A0028]">...</svg>  <!-- ❌ 아이콘 -->
                온라인 (Zoom) 회의 정보
            </h5>
            <div class="space-y-2 text-sm">
                <div class="flex items-start">
                    <span class="text-gray-600 w-28 flex-shrink-0">미팅 ID:</span>
                    <span class="font-medium break-all">${schedule.onlineInfo?.meetingId || '-'}</span>
                </div>
                <div class="flex items-start">
                    <span class="text-gray-600 w-28 flex-shrink-0">비밀번호:</span>
                    <span class="font-medium">${schedule.onlineInfo?.password || '-'}</span>
                </div>
                <div class="flex items-start">
                    <span class="text-gray-600 w-28 flex-shrink-0">참가 링크:</span>
                    <a href="${schedule.onlineInfo?.meetingUrl || '#'}"
                       target="_blank"
                       class="text-blue-600 hover:underline break-all flex-1">${schedule.onlineInfo?.meetingUrl || '-'}</a>
                </div>
                <!-- ❌ 호스트 URL 없음 -->
            </div>
        </div>
    ` : `
        <!-- ❌ 3. 오프라인 정보 박스 (다른 스타일) -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 class="font-medium text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600">...</svg>  <!-- ❌ 아이콘 -->
                오프라인 장소 정보
            </h5>
            <div class="flex items-start text-sm">
                <span class="text-gray-600 w-28 flex-shrink-0">장소:</span>
                <span class="font-medium">${schedule.offlineInfo?.location || '-'}</span>
            </div>
        </div>
    `}
</div>
```

---

## 📝 수정 사항 목록

### 1. 배지 추가 ✅
**위치**: "진행 방식" 제목 바로 아래
```javascript
<div class="mb-4">
    <span class="px-3 py-1 rounded-full text-sm font-medium ${
        schedule.method === 'online'
            ? 'bg-[#FCE4EC] text-[#6A0028]'
            : 'bg-green-100 text-green-800'
    }">
        ${schedule.method === 'online' ? '온라인 (Zoom)' : '오프라인'}
    </span>
</div>
```

### 2. SVG 아이콘 제거 ✅
**현재**: `<svg class="w-5 h-5 mr-2">...</svg>`
**수정**: 완전 제거

### 3. 색상 변경 ✅

#### 온라인 박스
**현재**: `bg-blue-50 border-blue-200` (파란색 계열)
**수정**: `bg-[#FAF6F1] border-[#E8E0D8]` (베이지 계열)

#### 오프라인 박스
**현재**: `bg-green-50 border-green-200` (초록색 계열)
**수정**: 유지 (동일)

### 4. 제목 변경 ✅

**현재**:
- 온라인: "온라인 (Zoom) 회의 정보"
- 오프라인: "오프라인 장소 정보"

**수정**:
- 온라인: "Zoom 미팅 정보"
- 오프라인: "오프라인 심사"

### 5. 레이아웃 변경 ✅

#### 온라인 정보
**현재**: Flex 레이아웃 (1열, 세로 나열)
```javascript
<div class="space-y-2 text-sm">
    <div class="flex items-start">
        <span class="text-gray-600 w-28 flex-shrink-0">미팅 ID:</span>
        <span class="font-medium">${meetingId}</span>
    </div>
    ...
</div>
```

**수정**: Grid 레이아웃 (2열)
```javascript
<div class="space-y-2 text-sm">
    <div class="grid grid-cols-2 gap-4">
        <div>
            <span class="text-gray-600">미팅 ID:</span>
            <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                ${meetingId}
            </div>
        </div>
        <div>
            <span class="text-gray-600">비밀번호:</span>
            <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                ${password}
            </div>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <span class="text-gray-600">참가 URL:</span>
            <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm break-all">
                <a href="${meetingUrl}" target="_blank" class="text-[#6A0028] hover:underline">
                    ${meetingUrl}
                </a>
            </div>
        </div>
        <div>
            <span class="text-gray-600">호스트 URL:</span>
            <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm break-all">
                <a href="${hostUrl}" target="_blank" class="text-[#6A0028] hover:underline">
                    ${hostUrl}
                </a>
            </div>
        </div>
    </div>
</div>
```

#### 오프라인 정보
**현재**: Flex 레이아웃
```javascript
<div class="flex items-start text-sm">
    <span class="text-gray-600 w-28 flex-shrink-0">장소:</span>
    <span class="font-medium">${location}</span>
</div>
```

**수정**: 동일한 스타일 유지
```javascript
<div class="text-sm">
    <span class="text-gray-600">장소:</span>
    <span class="ml-2 font-medium">${location}</span>
</div>
```

### 6. 호스트 URL 추가 ✅
**위치**: 참가 URL 옆 (Grid 2열 구조)
**필드명**: "호스트 URL"
**데이터**: `schedule.onlineInfo.hostUrl`

### 7. 링크 색상 통일 ✅
**현재**: `text-blue-600` (파란색)
**수정**: `text-[#6A0028]` (와인색, 브랜드 컬러)

### 8. 필드 박스 스타일 추가 ✅
**현재**: 텍스트만 표시
**수정**: 흰색 배경 박스 추가
```javascript
<div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
    ${value}
</div>
```

---

## 🎨 색상 팔레트

| 용도 | 색상 코드 | 설명 |
|------|-----------|------|
| **배지 - 온라인** | `bg-[#FCE4EC]` | 연분홍 배경 |
| **배지 - 온라인 텍스트** | `text-[#6A0028]` | 와인색 텍스트 |
| **배지 - 오프라인** | `bg-green-100` | 연초록 배경 |
| **배지 - 오프라인 텍스트** | `text-green-800` | 진초록 텍스트 |
| **온라인 박스 배경** | `bg-[#FAF6F1]` | 베이지 배경 |
| **온라인 박스 테두리** | `border-[#E8E0D8]` | 베이지 테두리 |
| **오프라인 박스 배경** | `bg-green-50` | 연초록 배경 |
| **오프라인 박스 테두리** | `border-green-200` | 초록 테두리 |
| **링크 색상** | `text-[#6A0028]` | 와인색 (브랜드 컬러) |
| **필드 박스 배경** | `bg-white` | 흰색 |
| **필드 박스 테두리** | `border-gray-300` | 회색 |

---

## 📂 수정 파일

**파일**: `student-v3/assets/js/student-exam-schedule.js`
**함수**: `renderStudentExamScheduleDetailView(data)`
**라인**: 421-467 (진행 방식 영역)

---

## ✅ 체크리스트

- [ ] 배지 추가 (온라인 / 오프라인)
- [ ] SVG 아이콘 제거
- [ ] 온라인 박스 색상 변경 (파란색 → 베이지)
- [ ] 제목 변경 ("Zoom 미팅 정보" / "오프라인 심사")
- [ ] Grid 2열 레이아웃 적용 (온라인)
- [ ] 필드 박스 스타일 추가 (흰색 배경)
- [ ] 호스트 URL 추가
- [ ] 링크 색상 통일 (와인색)
- [ ] 폰트 클래스 추가 (`font-mono`)
- [ ] 오프라인 레이아웃 조정

---

## 🧪 테스트 시나리오

### 온라인 일정 테스트
1. 학생 대시보드 → 심사 일정 조회
2. 온라인 일정 항목 클릭 (김철수 학생)
3. ✅ 확인사항:
   - "진행 방식" 제목 아래 배지 표시
   - 배지 색상: 연분홍 배경 + 와인색 텍스트
   - 배지 텍스트: "온라인 (Zoom)"
   - SVG 아이콘 없음
   - 박스 배경: 베이지색 (`#FAF6F1`)
   - 박스 제목: "Zoom 미팅 정보"
   - Grid 2열 레이아웃
   - 필드 박스: 흰색 배경
   - 미팅 ID / 비밀번호 (왼쪽 열)
   - 참가 URL / 호스트 URL (오른쪽 열)
   - 링크 색상: 와인색

### 오프라인 일정 테스트
1. 오프라인 일정 Mock 데이터 추가 필요
2. 오프라인 일정 항목 클릭
3. ✅ 확인사항:
   - 배지 색상: 연초록 배경 + 진초록 텍스트
   - 배지 텍스트: "오프라인"
   - SVG 아이콘 없음
   - 박스 배경: 연초록 (`green-50`)
   - 박스 제목: "오프라인 심사"
   - 장소 정보 표시

---

## 📊 Before / After 비교

### 배지
| 항목 | Before | After |
|------|--------|-------|
| 배지 표시 | ❌ 없음 | ✅ 있음 (온라인/오프라인) |
| 온라인 색상 | - | 연분홍 배경 + 와인색 텍스트 |
| 오프라인 색상 | - | 연초록 배경 + 진초록 텍스트 |

### 온라인 정보 박스
| 항목 | Before | After |
|------|--------|-------|
| 아이콘 | ✅ SVG 아이콘 | ❌ 없음 |
| 배경색 | `bg-blue-50` (파란색) | `bg-[#FAF6F1]` (베이지) |
| 테두리 | `border-blue-200` | `border-[#E8E0D8]` |
| 제목 | "온라인 (Zoom) 회의 정보" | "Zoom 미팅 정보" |
| 레이아웃 | Flex (1열) | Grid (2열) |
| 필드 박스 | ❌ 없음 | ✅ 흰색 배경 박스 |
| 호스트 URL | ❌ 없음 | ✅ 있음 |
| 링크 색상 | `text-blue-600` | `text-[#6A0028]` |

### 오프라인 정보 박스
| 항목 | Before | After |
|------|--------|-------|
| 아이콘 | ✅ SVG 아이콘 | ❌ 없음 |
| 제목 | "오프라인 장소 정보" | "오프라인 심사" |
| 레이아웃 | 동일 | 동일 |

---

**작성일**: 2026-01-08
**작성자**: Claude Sonnet 4.5
**버전**: v1.0
**상태**: ⏳ 수정 계획 수립 완료 (구현 대기 중)
