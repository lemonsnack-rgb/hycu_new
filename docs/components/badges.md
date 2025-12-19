# 뱃지 (Badges)

## 상태 뱃지 (Status Badge)

### 기본 사용
```html
<span class="status-badge status-primary">기본</span>
<span class="status-badge status-success">승인</span>
<span class="status-badge status-warning">대기</span>
<span class="status-badge status-danger">반려</span>
<span class="status-badge status-info">안내</span>
<span class="status-badge status-pending">보류</span>
<span class="status-badge status-urgent">긴급</span>
```

### 사용처별 상태 뱃지

#### 승인 프로세스
```html
<span class="status-badge status-warning">대기</span>
<span class="status-badge status-success">승인</span>
<span class="status-badge status-danger">반려</span>
```

#### 진행 상태
```html
<span class="status-badge status-pending">미시작</span>
<span class="status-badge status-warning">진행중</span>
<span class="status-badge status-success">완료</span>
```

#### 제출 상태
```html
<span class="status-badge status-pending">미제출</span>
<span class="status-badge status-warning">제출</span>
<span class="status-badge status-success">확인완료</span>
```

---

## 카운트 뱃지 (Count Badge)

### 기본 카운트
```html
<span class="count-badge">5</span>
<span class="count-badge">12</span>
<span class="count-badge">99+</span>
```

### Outline 스타일
```html
<span class="count-badge outline">5</span>
<span class="count-badge outline">12</span>
```

### 탭과 함께 사용
```html
<button class="tab active">
    전체 <span class="count-badge">12</span>
</button>
<button class="tab">
    대기중 <span class="count-badge outline">5</span>
</button>
<button class="tab">
    승인 <span class="count-badge outline">7</span>
</button>
```

---

## D-Day 뱃지

### 마감일 표시
```html
<span class="dday-badge">D-7</span>
<span class="dday-badge">D-3</span>
<span class="dday-badge">D-Day</span>
<span class="dday-badge">D+5</span>
```

### 테이블에서 사용
```html
<table>
    <thead>
        <tr>
            <th>제목</th>
            <th>마감일</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>논문 제출</td>
            <td><span class="dday-badge">D-7</span></td>
        </tr>
    </tbody>
</table>
```

### JavaScript로 동적 D-Day 계산
```javascript
function calculateDday(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diff > 0) {
        return `D-${diff}`;
    } else if (diff === 0) {
        return 'D-Day';
    } else {
        return `D+${Math.abs(diff)}`;
    }
}

// 사용 예시
const dday = calculateDday('2025-01-31');
document.getElementById('deadline').innerHTML =
    `<span class="dday-badge">${dday}</span>`;
```

---

## 태그 뱃지 (Tag Badge)

### 기본 태그
```html
<span class="tag-badge">필수</span>
<span class="tag-badge">선택</span>
<span class="tag-badge">신규</span>
```

### 커스텀 색상
```html
<span class="tag-badge" style="background: #2E7D32;">필수</span>
<span class="tag-badge" style="background: #F59E0B;">선택</span>
<span class="tag-badge" style="background: #0288D1;">신규</span>
```

---

## 알림 뱃지 (Notification Badge)

### 빨간 점
```html
<button class="utility-icon-btn">
    <i class="icon" data-lucide="bell"></i>
    <span class="badge-dot"></span>
</button>
```

### 숫자 카운트
```html
<button class="utility-icon-btn">
    <i class="icon" data-lucide="bell"></i>
    <span class="badge-count">5</span>
</button>

<button class="utility-icon-btn">
    <i class="icon" data-lucide="mail"></i>
    <span class="badge-count">12</span>
</button>
```

---

## 실전 예제

### 테이블에서 여러 뱃지 조합
```html
<table>
    <thead>
        <tr>
            <th>제목</th>
            <th>상태</th>
            <th>분류</th>
            <th>마감일</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>논문 제출</td>
            <td><span class="status-badge status-warning">진행중</span></td>
            <td><span class="tag-badge">필수</span></td>
            <td><span class="dday-badge">D-7</span></td>
        </tr>
        <tr>
            <td>피드백 작성</td>
            <td><span class="status-badge status-success">완료</span></td>
            <td><span class="tag-badge">선택</span></td>
            <td><span class="dday-badge">D+2</span></td>
        </tr>
    </tbody>
</table>
```

### 카드에서 뱃지 사용
```html
<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; gap: 8px; align-items: center;">
            <span class="tag-badge">필수</span>
            <span class="status-badge status-urgent">긴급</span>
        </div>
        <span class="dday-badge">D-3</span>
    </div>

    <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
        논문 1차 제출
    </h4>

    <p style="font-size: 14px; color: #6B7280;">
        논문 초안을 제출해주세요.
    </p>
</div>
```

### 목록에서 뱃지 조합
```html
<div style="display: flex; flex-direction: column; gap: 12px;">
    <div style="display: flex; justify-content: space-between; align-items: center;
                padding: 16px; background: white; border-radius: 4px; border: 1px solid #E5E7EB;">
        <div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <span class="tag-badge">필수</span>
                <span class="status-badge status-warning">진행중</span>
            </div>
            <h5 style="font-size: 14px; font-weight: 600;">논문 제출</h5>
        </div>
        <span class="dday-badge">D-7</span>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center;
                padding: 16px; background: white; border-radius: 4px; border: 1px solid #E5E7EB;">
        <div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <span class="tag-badge">선택</span>
                <span class="status-badge status-success">완료</span>
            </div>
            <h5 style="font-size: 14px; font-weight: 600;">피드백 확인</h5>
        </div>
        <span class="dday-badge">D+2</span>
    </div>
</div>
```

---

## 색상 가이드

### 상태별 색상
| 상태 | 색상 | 배경색 | 사용처 |
|------|------|--------|--------|
| Primary | #6A0028 | #FCE4EC | 기본, 중요 |
| Success | #2E7D32 | #E8F5E9 | 승인, 완료 |
| Warning | #F59E0B | #FEF3C7 | 대기, 진행중 |
| Danger | #EF4444 | #FEE2E2 | 반려, 마감 |
| Info | #0288D1 | #E3F2FD | 안내, 정보 |
| Pending | #616161 | #F5F5F5 | 보류, 미정 |
| Urgent | #6A0028 | #FCE4EC | 긴급, 중요 |

---

## JavaScript 헬퍼 함수

### 상태별 뱃지 생성
```javascript
function getStatusBadge(status) {
    const statusMap = {
        'pending': { label: '대기', class: 'status-warning' },
        'approved': { label: '승인', class: 'status-success' },
        'rejected': { label: '반려', class: 'status-danger' },
        'completed': { label: '완료', class: 'status-success' },
        'in_progress': { label: '진행중', class: 'status-warning' }
    };

    const badge = statusMap[status] || { label: status, class: 'status-pending' };
    return `<span class="status-badge ${badge.class}">${badge.label}</span>`;
}

// 사용 예시
document.getElementById('status').innerHTML = getStatusBadge('approved');
```

### D-Day 뱃지 생성
```javascript
function getDdayBadge(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    let ddayText;
    if (diff > 0) {
        ddayText = `D-${diff}`;
    } else if (diff === 0) {
        ddayText = 'D-Day';
    } else {
        ddayText = `D+${Math.abs(diff)}`;
    }

    return `<span class="dday-badge">${ddayText}</span>`;
}

// 사용 예시
document.getElementById('deadline').innerHTML = getDdayBadge('2025-01-31');
```

### 카운트 뱃지 생성
```javascript
function getCountBadge(count, outline = false) {
    const displayCount = count > 99 ? '99+' : count;
    const className = outline ? 'count-badge outline' : 'count-badge';
    return `<span class="${className}">${displayCount}</span>`;
}

// 사용 예시
document.getElementById('count').innerHTML = getCountBadge(5);
document.getElementById('count2').innerHTML = getCountBadge(120, true);
```

---

## 주의사항

### ✅ DO
- 테이블에서는 중앙 정렬로 배치
- 의미가 명확한 뱃지 텍스트 사용
- 색상은 일관성 있게 사용

### ❌ DON'T
- 너무 많은 뱃지를 한 곳에 배치하지 않기
- 색상의 의미를 임의로 변경하지 않기
- 뱃지 크기를 임의로 변경하지 않기

---

## 관련 문서
- [디자인 시스템](../design-system-v3.md)
- [Tables 가이드](./tables.md)
- [Cards 가이드](./cards.md)
