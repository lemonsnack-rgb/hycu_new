# 테이블 디자인 현황 분석

## 전체 테이블이 있는 화면 목록

### 1. 지도교수 배정 (advisor-assignment)
**파일**: `professor-dashboard-proposal.html` (582-609줄)
**현황**:
- ❌ 테이블 타이틀 없음 (<!-- 학생 목록 테이블 --> 주석만 있음)
- ❌ 검색 영역과 테이블 구분 불명확
- ✅ 테이블 스크롤: `overflow-x-auto` 사용
- ❌ 테이블 컨테이너: `p-6` padding으로 여백 있음 (영역에 꽉 차지 않음)
- 스타일: Tailwind 클래스 (`min-w-full divide-y divide-gray-200`)

### 2. 주차별 논문지도 현황 (guidance)
**파일**: `assets/js/guidance.js` (94-133줄)
**현황**:
- ✅ 테이블 타이틀: "학기별 지도 목록 (총 N건)"
- ✅ 검색 영역과 테이블 구분: `bg-white rounded-lg shadow-md` 내부에 구분
- ✅ 테이블 스크롤: `table-scroll` 클래스
- ✅ 테이블 컨테이너: `table-container` 클래스
- ✅ 테이블 헤더: `table-header` + `table-header-left/right`
- ✅ 액션 버튼: "선택 학생에게 알림 발송"
- 스타일: `min-w-full` 클래스

### 3. 논문 지도 현황 (feedback)
**파일**: `assets/js/feedback-list.js` (22-59줄)
**현황**:
- ✅ 테이블 타이틀: "논문 지도 현황 (총 N건)"
- ✅ 검색 영역과 테이블 구분: 명확히 분리됨
- ✅ 테이블 스크롤: `table-scroll` 클래스
- ✅ 테이블 컨테이너: `table-container` 클래스
- ✅ 테이블 헤더: `table-header` + `table-header-left/right`
- ✅ 액션 버튼: "선택한 학생에게 알림 발송"
- 스타일: `min-w-full` 클래스

### 4. 학위 논문 심사 (review)
**파일**: `assets/js/review-list.js` (50-92줄)
**현황**:
- ✅ 테이블 타이틀: "심사 대상 논문 목록 (총 N건)"
- ✅ 검색 영역과 테이블 구분: 명확히 분리됨
- ✅ 테이블 스크롤: `table-scroll` 클래스
- ✅ 테이블 컨테이너: `table-container` 클래스
- ✅ 테이블 헤더: `table-header` + `table-header-left/right`
- ✅ 액션 버튼: "선택한 학생에게 알림 발송"
- 스타일: `min-w-full` 클래스

### 5. 학술지 논문 심사 (journal-review)
**파일**: `assets/js/journal-review.js` (12-150줄)
**현황**:
- ✅ 테이블 타이틀: "학술지 심사 목록 (총 N건)"
- ⚠️ **검색 영역과 테이블 구분 스타일 다름**:
  - 검색 영역이 `bg-white rounded-lg shadow-md` 안에 `p-6 border-b`로 들어가 있음
  - 다른 화면들은 검색 영역이 별도 컨테이너로 분리됨
- ✅ 테이블 스크롤: `table-scroll` 클래스
- ✅ 테이블 컨테이너: `table-container` 클래스
- ✅ 테이블 헤더: `table-header` + `table-header-left/right`
- ✅ 액션 버튼: "선택 학생에게 알림 발송"
- 스타일: `min-w-full` 클래스

### 6. 심사 일정 관리 (exam-schedule)
**파일**: `assets/js/exam-schedule-professor-readonly.js` (115-136줄)
**현황**:
- ❌ 테이블 타이틀 없음 (<!-- 테이블 --> 주석만 있음)
- ⚠️ 검색 영역과 테이블 구분: 검색이 `p-6 border-b bg-gray-50` 영역에 있고, 테이블은 바로 아래
- ✅ 테이블 스크롤: `table-scroll` 클래스
- ❌ 테이블 컨테이너: 없음 (바로 `table-scroll` 시작)
- ❌ 테이블 헤더: 없음
- 스타일: `min-w-full` 클래스

### 7. 자료실 (board)
**파일**: `assets/js/board.js` (71-82줄)
**현황**:
- ❌ 테이블 타이틀 없음
- ✅ 검색 영역과 테이블 구분: 글쓰기 버튼이 `p-6 border-b` 영역
- ✅ 테이블 스크롤: `table-scroll` 클래스
- ✅ 테이블 컨테이너: `table-container` 클래스
- ❌ 테이블 헤더: 없음 (table-header 구조 없음)
- 스타일: `min-w-full` 클래스

### 8. 공지사항 (notice)
**파일**: `common-utils.js` (474-555줄)
**현황**:
- ❌ 테이블 타이틀 없음
- ❌ **검색 기능 제거 예정** (기능 미구현)
- ✅ 테이블 스크롤: `overflow-x-auto` 사용
- ❌ 테이블 컨테이너: 없음 (바로 `overflow-x-auto` 시작)
- ❌ 테이블 헤더: 없음 (table-header 구조 없음)
- 스타일: Tailwind 클래스 (`min-w-full divide-y divide-gray-200 table-fixed`)

### 9. 랩미팅 관리 (meeting)
**파일**: `assets/js/meeting-v2-part2.js`
**현황**:
- ⚠️ 테이블 형식이 아닌 **카드 레이아웃**
- 예정된 미팅, 완료된 미팅 등을 카드로 표시
- 테이블 통일 대상 아님

## 문제점 요약

### 1. 테이블 타이틀 누락
❌ **타이틀 없음**:
- 지도교수 배정
- 심사 일정 관리
- 자료실
- 공지사항

✅ **타이틀 있음**:
- 주차별 논문지도 현황: "학기별 지도 목록 (총 N건)"
- 논문 지도 현황: "논문 지도 현황 (총 N건)"
- 학위 논문 심사: "심사 대상 논문 목록 (총 N건)"
- 학술지 논문 심사: "학술지 심사 목록 (총 N건)"

### 2. 검색 영역과 테이블 구분

✅ **명확히 분리**:
- 주차별 논문지도 현황
- 논문 지도 현황
- 학위 논문 심사
- 학술지 논문 심사

⚠️ **부분 분리**:
- 심사 일정 관리: 검색 영역이 `bg-gray-50`로 구분되지만, 테이블과 같은 컨테이너 내부

❌ **구분 불명확**:
- 지도교수 배정: 검색과 테이블이 모두 같은 레벨에 있음

**참고**:
- 공지사항: 검색 기능 제거 예정 (기능 미구현)

### 3. 테이블 표시 방식

**영역에 꽉 차지 않는 경우**:
- ❌ 지도교수 배정: `p-6` padding으로 여백 있음

**영역에 꽉 차는 경우**:
- ✅ 주차별 논문지도 현황
- ✅ 논문 지도 현황
- ✅ 학위 논문 심사
- ✅ 학술지 논문 심사
- ✅ 심사 일정 관리
- ✅ 자료실

### 4. 테이블 컨테이너 구조

**표준 구조 사용** (table-container + table-header):
- ✅ 주차별 논문지도 현황
- ✅ 논문 지도 현황
- ✅ 학위 논문 심사
- ✅ 학술지 논문 심사
- ✅ 자료실 (table-container만 있음, table-header 없음)

**구조 미흡**:
- ❌ 지도교수 배정: Tailwind 클래스만 사용
- ❌ 심사 일정 관리: table-container 없음
- ❌ 공지사항: table-container, table-header 없음

## 표준 테이블 디자인 (참고: 학위 논문 심사)

```html
<div class="table-container">
    <!-- 테이블 헤더: 타이틀(건수) + 액션버튼 -->
    <div class="table-header">
        <div class="table-header-left">
            <h3 class="table-title">[화면명] 목록</h3>
            <span class="table-count">(총 N건)</span>
        </div>
        <div class="table-header-right">
            <button class="btn btn-primary btn-sm">
                액션 버튼 (있는 경우)
            </button>
        </div>
    </div>
    <div class="table-scroll">
        <table class="min-w-full">
            <thead>
                <tr>
                    <th>컬럼1</th>
                    <th>컬럼2</th>
                    ...
                </tr>
            </thead>
            <tbody>
                <!-- 데이터 -->
            </tbody>
        </table>
    </div>
</div>
```

## 수정 필요 사항

### 우선순위 1: 테이블 타이틀 추가
1. 지도교수 배정 → "지도교수 배정 목록"
2. 심사 일정 관리 → "심사 일정 목록"
3. 자료실 → "자료실 목록"
4. 공지사항 → "공지사항 목록"

### 우선순위 2: 테이블 구조 통일
1. 지도교수 배정: table-container + table-header 구조로 변경
2. 심사 일정 관리: table-container + table-header 구조로 변경
3. 자료실: table-header 추가
4. 공지사항: table-container + table-header 구조로 변경, 검색 영역 제거

### 우선순위 3: 검색 영역과 테이블 구분 명확화
1. **학술지 논문 심사**: 검색 영역을 별도 컨테이너로 분리 (현재는 테이블과 같은 컨테이너에 `p-6 border-b`로 들어가 있음)
2. 모든 화면에서 검색 영역은 별도 `bg-white rounded-lg shadow-md` 컨테이너
3. 테이블은 그 아래 별도 컨테이너로 분리

### 우선순위 4: 여백 통일
1. 지도교수 배정: `p-6` 제거하여 테이블이 영역에 꽉 차도록 수정
