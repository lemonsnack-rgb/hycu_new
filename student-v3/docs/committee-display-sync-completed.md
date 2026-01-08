# 심사위원 정보 표시 방식 통일 완료

## 📅 작업 일시
**2026-01-08**

---

## ✅ 작업 완료

### 작업 목표
학생용 화면의 심사위원 정보 표시 방식을 **표준 포맷**으로 설정하고, 교수용 및 관리자용 화면을 학생용 화면과 동일하게 수정

### 표준 포맷 (학생용 화면 기준)
```javascript
${professorName} (${roleText})
```
- **단순 형식**: 이름 + 괄호로 역할 표시
- **중앙 정렬**: text-center
- **배경**: bg-gray-50 rounded-lg
- **그리드**: grid-cols-5 (5열)

---

## 📝 수정된 파일

### 1. ✅ 학생용 화면 (표준 - 수정 불필요)
**파일**: `student-v3/assets/js/student-exam-schedule.js` (Lines 274-287)

```javascript
<!-- 심사위원 정보 -->
<div class="px-6 py-4 bg-white border-b">
    <h4 class="text-sm font-semibold text-gray-700 mb-3">심사위원 정보</h4>
    <div class="grid grid-cols-5 gap-3">
        ${assignment.members.map(m => {
            const roleText = m.role === 'chair' ? '위원장' : '위원';
            return `
                <div class="p-3 bg-gray-50 rounded-lg text-center">
                    <div class="text-sm font-medium text-gray-900">${m.professorName} (${roleText})</div>
                </div>
            `;
        }).join('')}
    </div>
</div>
```

**상태**: ✅ 표준 포맷 (변경 없음)

---

### 2. ✅ 교수용 화면 (복잡 → 단순 형식으로 수정)
**파일**: `professor-v3/assets/js/exam-schedule-professor-readonly.js` (Lines 510-522)

#### 수정 전 (복잡한 형식)
```javascript
// 심사위원 목록 HTML 생성 (5열 그리드)
const membersHTML = `
    <div class="grid grid-cols-5 gap-3">
        ${assignment.members.map(m => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 rounded-full ${
                        m.role === 'chair'
                            ? 'bg-[#FCE4EC] text-[#6A0028]'
                            : 'bg-gray-100 text-gray-600'
                    }">
                        ${m.role === 'chair' ? '위원장' : '위원'}
                    </span>
                    <span class="font-medium text-gray-900 text-sm">${m.professorName}</span>
                </div>
                <span class="text-sm text-gray-600">${m.department}</span>
            </div>
        `).join('')}
    </div>
`;
```

**문제점**:
- ❌ 별도의 역할 배지 (rounded-full)
- ❌ 학과(department) 표시
- ❌ flex items-center justify-between 레이아웃
- ❌ 좌측 정렬

#### 수정 후 (학생용 화면과 동일)
```javascript
// 심사위원 목록 HTML 생성 (5열 그리드, 괄호로 역할 표시)
const membersHTML = `
    <div class="grid grid-cols-5 gap-3">
        ${assignment.members.map(m => {
            const roleText = m.role === 'chair' ? '위원장' : '위원';
            return `
                <div class="p-3 bg-gray-50 rounded-lg text-center">
                    <div class="text-sm font-medium text-gray-900">${m.professorName} (${roleText})</div>
                </div>
            `;
        }).join('')}
    </div>
`;
```

**개선사항**:
- ✅ 괄호로 역할 표시 (배지 제거)
- ✅ 학과 표시 제거
- ✅ 중앙 정렬 (text-center)
- ✅ 학생용 화면과 완전 동일

**상태**: ✅ 수정 완료

---

### 3. ✅ 관리자용 화면 (이미 단순 형식 사용 중)
**파일**: `admin-v3/assets/js/exam-schedule.js` (Lines 256-262)

```javascript
// 심사위원 목록 HTML 생성 (5열 그리드, 괄호로 역할 표시)
const membersHTML = assignment.members.map(m => {
    const roleText = m.role === 'chair' ? '위원장' : '위원';
    return `
        <div class="p-3 bg-gray-50 rounded-lg text-center">
            <div class="text-sm font-medium text-gray-900">${m.professorName} (${roleText})</div>
        </div>
    `;
}).join('');
```

**상태**: ✅ 이미 표준 포맷 사용 (변경 없음)

---

## 📊 변경 내용 비교표

| 항목 | 학생용 (표준) | 교수용 (수정 전) | 교수용 (수정 후) | 관리자용 |
|------|-------------|----------------|----------------|---------|
| **역할 표시** | 괄호 `(위원장)` | 별도 배지 | ✅ 괄호 `(위원장)` | 괄호 `(위원장)` |
| **학과 표시** | ❌ 없음 | ✅ 표시 | ✅ 제거 | ❌ 없음 |
| **정렬** | 중앙 | 좌측 | ✅ 중앙 | 중앙 |
| **배지 색상** | - | 핑크/회색 | ✅ 제거 | - |
| **레이아웃** | text-center | flex justify-between | ✅ text-center | text-center |

---

## 🎯 통일 전후 비교

### Before (교수용 - 복잡한 형식)
```
┌─────────────────────────────────────────────────┐
│ [위원장] 김교수              컴퓨터공학과        │
│ [위원] 이교수                컴퓨터공학과        │
│ [위원] 박교수                경영학과            │
└─────────────────────────────────────────────────┘
```
- 별도 배지 (핑크색/회색)
- 학과명 표시
- 좌측 정렬

### After (전체 화면 - 단순한 형식)
```
┌────────────┬────────────┬────────────┬────────────┬────────────┐
│ 김교수      │ 이교수      │ 박교수      │            │            │
│ (위원장)    │ (위원)      │ (위원)      │            │            │
└────────────┴────────────┴────────────┴────────────┴────────────┘
```
- 괄호로 역할 표시
- 학과명 제거
- 중앙 정렬
- 5열 그리드 (최대 5명 표시)

---

## ⚙️ 기술 상세

### 공통 스타일
```javascript
<div class="grid grid-cols-5 gap-3">
    ${assignment.members.map(m => {
        const roleText = m.role === 'chair' ? '위원장' : '위원';
        return `
            <div class="p-3 bg-gray-50 rounded-lg text-center">
                <div class="text-sm font-medium text-gray-900">
                    ${m.professorName} (${roleText})
                </div>
            </div>
        `;
    }).join('')}
</div>
```

### 주요 클래스
- **grid grid-cols-5 gap-3**: 5열 그리드 (최대 5명 심사위원)
- **p-3 bg-gray-50 rounded-lg**: 회색 배경 박스
- **text-center**: 중앙 정렬
- **text-sm font-medium text-gray-900**: 텍스트 스타일

### 역할 매핑
```javascript
const roleText = m.role === 'chair' ? '위원장' : '위원';
```

---

## 🧪 테스트 시나리오

### 1. 학생용 화면 테스트
1. [student-v3/student-dashboard.html](../student-dashboard.html) 열기
2. "심사 일정 조회" 클릭
3. 목록에서 행 클릭 → 상세 화면 진입
4. ✅ 확인사항:
   - 심사위원 정보 섹션에 5열 그리드 표시
   - 각 위원: `이름 (역할)` 형식
   - 중앙 정렬
   - 회색 배경 박스

### 2. 교수용 화면 테스트
1. [professor-v3/professor-dashboard.html](../../professor-v3/professor-dashboard.html) 열기
2. "심사 일정 조회" 클릭
3. 목록에서 행 클릭 → 상세 화면 진입
4. ✅ 확인사항:
   - 심사위원 정보가 **학생용과 동일한 형식**으로 표시됨
   - ❌ 별도 배지 없음
   - ❌ 학과명 없음
   - ✅ 중앙 정렬
   - ✅ `이름 (역할)` 형식

### 3. 관리자용 화면 테스트
1. [admin-v3/admin-dashboard.html](../../admin-v3/admin-dashboard.html) 열기
2. "심사 일정 관리" 클릭
3. 목록에서 행 클릭 → 상세 화면 진입
4. ✅ 확인사항:
   - 심사위원 정보가 **학생용과 동일한 형식**으로 표시됨
   - 이미 단순 형식 사용 중

### 4. 일관성 검증
1. 세 화면을 나란히 비교
2. ✅ 확인사항:
   - 동일한 레이아웃 (grid-cols-5)
   - 동일한 정렬 (중앙)
   - 동일한 표시 방식 (`이름 (역할)`)
   - 동일한 배경색 (회색)

---

## 📋 변경 이유

### 1. UI 일관성
- 학생/교수/관리자 화면 간의 **시각적 일관성** 확보
- 사용자 혼란 방지

### 2. 단순화
- 불필요한 정보(학과명) 제거
- 복잡한 배지 제거
- 직관적인 괄호 표기

### 3. 유지보수성
- 세 화면에서 **동일한 코드 패턴** 사용
- 향후 수정 시 일괄 변경 가능

---

## 🔄 이전 작업과의 연계

### 1. 진행방식 UI 동기화 (완료)
- 문서: [exam-schedule-ui-sync-completed.md](exam-schedule-ui-sync-completed.md)
- 작업: 학생용/교수용 "진행방식" 섹션 동기화
- 결과: ✅ 완료

### 2. Mock 데이터 추가 (완료)
- 문서: [exam-schedule-mock-data-added.md](exam-schedule-mock-data-added.md)
- 작업: 학생용 테스트 데이터 추가
- 결과: ✅ 완료

### 3. 심사위원 정보 동기화 (본 작업)
- 문서: 본 문서
- 작업: 교수용 화면을 학생용 화면과 동일하게 수정
- 결과: ✅ 완료

---

## ⚠️ 주의사항

### 1. 역방향 수정 금지
- ❌ 학생용 화면을 교수용처럼 수정 (복잡하게)
- ✅ 교수용 화면을 학생용처럼 수정 (단순하게)
- 학생용 = 표준 포맷

### 2. 학과명 제거
- 심사위원 정보에서 학과명은 더 이상 표시되지 않음
- 필요 시 "심사위원 배정" 화면에서 확인 가능

### 3. 데이터 구조는 유지
- `members` 배열의 `department` 필드는 그대로 유지
- 화면 표시만 제거 (데이터는 보존)

---

## 🎯 완료 체크리스트

- [x] 학생용 화면 표준 포맷 확인
- [x] 교수용 화면 수정
  - [x] 역할 배지 제거
  - [x] 학과명 제거
  - [x] 중앙 정렬 적용
  - [x] 괄호 표기 적용
- [x] 관리자용 화면 확인 (이미 표준 포맷)
- [x] 코드 변경 완료
- [x] 문서 작성 완료

---

## 📁 관련 파일

### 수정된 파일
1. `professor-v3/assets/js/exam-schedule-professor-readonly.js` (Lines 510-522)

### 확인한 파일 (변경 없음)
1. `student-v3/assets/js/student-exam-schedule.js` (Lines 274-287) - 표준 포맷
2. `admin-v3/assets/js/exam-schedule.js` (Lines 256-262) - 이미 표준 포맷

### 관련 문서
1. [exam-schedule-ui-sync-completed.md](exam-schedule-ui-sync-completed.md) - 진행방식 UI 동기화
2. [exam-schedule-mock-data-added.md](exam-schedule-mock-data-added.md) - Mock 데이터 추가
3. [exam-schedule-implementation-summary.md](exam-schedule-implementation-summary.md) - 전체 구현 요약

---

**작성일**: 2026-01-08
**작성자**: Claude Sonnet 4.5
**버전**: v1.0
**상태**: ✅ 심사위원 정보 표시 방식 통일 완료
