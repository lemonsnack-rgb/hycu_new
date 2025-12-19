# 폼 (Forms)

## 기본 입력 필드

### Text Input
```html
<div class="form-group">
    <label class="form-label">이름</label>
    <input type="text" class="form-control" placeholder="이름을 입력하세요">
</div>
```

### Required 필드
```html
<div class="form-group">
    <label class="form-label">이름 *</label>
    <input type="text" class="form-control" placeholder="이름을 입력하세요" required>
</div>
```

### Disabled 필드
```html
<div class="form-group">
    <label class="form-label">학번</label>
    <input type="text" class="form-control" value="2024001" disabled>
</div>
```

---

## Select (드롭다운)

```html
<div class="form-group">
    <label class="form-label">상태</label>
    <select class="form-control">
        <option value="">선택하세요</option>
        <option value="pending">대기</option>
        <option value="approved">승인</option>
        <option value="rejected">반려</option>
    </select>
</div>
```

---

## Textarea

```html
<div class="form-group">
    <label class="form-label">피드백 내용</label>
    <textarea class="form-control" rows="5" placeholder="피드백 내용을 입력하세요"></textarea>
</div>
```

---

## Checkbox

### 단일 체크박스
```html
<div class="checkbox-wrapper">
    <div class="checkbox" onclick="toggleCheckbox(this)">
        <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    </div>
    <label class="checkbox-label">이용약관에 동의합니다</label>
</div>

<script>
function toggleCheckbox(el) {
    el.classList.toggle('checked');
}
</script>
```

### 여러 체크박스
```html
<div class="form-group">
    <label class="form-label">선택 항목</label>

    <div class="checkbox-wrapper">
        <div class="checkbox" onclick="toggleCheckbox(this)">
            <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <label class="checkbox-label">옵션 1</label>
    </div>

    <div class="checkbox-wrapper">
        <div class="checkbox" onclick="toggleCheckbox(this)">
            <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <label class="checkbox-label">옵션 2</label>
    </div>
</div>
```

---

## Radio Button

```html
<div class="form-group">
    <label class="form-label">성별</label>

    <div class="radio-wrapper">
        <div class="radio" onclick="selectRadio(this, 'gender')">
        </div>
        <label class="radio-label">남성</label>
    </div>

    <div class="radio-wrapper">
        <div class="radio" onclick="selectRadio(this, 'gender')">
        </div>
        <label class="radio-label">여성</label>
    </div>
</div>

<script>
function selectRadio(el, groupName) {
    // 같은 그룹의 라디오 버튼 모두 해제
    document.querySelectorAll('.radio-wrapper').forEach(wrapper => {
        const radio = wrapper.querySelector('.radio');
        if (radio !== el && wrapper.closest('.form-group') === el.closest('.form-group')) {
            radio.classList.remove('checked');
        }
    });

    // 클릭한 라디오 버튼 선택
    el.classList.add('checked');
}
</script>
```

---

## Switch

```html
<div style="display: flex; align-items: center; gap: 12px;">
    <span class="form-label" style="margin-bottom: 0;">알림 수신</span>
    <div class="switch" onclick="toggleSwitch(this)">
    </div>
</div>

<script>
function toggleSwitch(el) {
    el.classList.toggle('active');
}
</script>
```

---

## 검색 박스

```html
<div class="search-box">
    <input type="text" placeholder="검색..." onkeyup="handleSearch(event)">
    <i class="search-icon icon" data-lucide="search"></i>
</div>

<script>
function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        console.log('검색어:', query);
    }
}

// 아이콘 활성화
lucide.createIcons();
</script>
```

---

## 폼 레이아웃

### 세로 레이아웃 (기본)
```html
<form>
    <div class="form-group">
        <label class="form-label">이름 *</label>
        <input type="text" class="form-control" required>
    </div>

    <div class="form-group">
        <label class="form-label">이메일 *</label>
        <input type="email" class="form-control" required>
    </div>

    <div class="form-group">
        <label class="form-label">내용</label>
        <textarea class="form-control" rows="5"></textarea>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button type="button" class="btn btn-outline">취소</button>
        <button type="submit" class="btn btn-primary">저장</button>
    </div>
</form>
```

### 가로 레이아웃 (2열)
```html
<form>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="form-group">
            <label class="form-label">이름 *</label>
            <input type="text" class="form-control" required>
        </div>

        <div class="form-group">
            <label class="form-label">학번 *</label>
            <input type="text" class="form-control" required>
        </div>

        <div class="form-group">
            <label class="form-label">이메일</label>
            <input type="email" class="form-control">
        </div>

        <div class="form-group">
            <label class="form-label">전화번호</label>
            <input type="tel" class="form-control">
        </div>
    </div>

    <div class="form-group">
        <label class="form-label">주소</label>
        <input type="text" class="form-control">
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button type="button" class="btn btn-outline">취소</button>
        <button type="submit" class="btn btn-primary">저장</button>
    </div>
</form>
```

---

## 검색/필터 폼

```html
<div class="search-container">
    <div class="search-grid">
        <div class="search-field">
            <label class="search-label">검색어</label>
            <input type="text" class="search-input" placeholder="제목 또는 내용">
        </div>

        <div class="search-field">
            <label class="search-label">상태</label>
            <select class="search-select">
                <option value="">전체</option>
                <option value="pending">대기</option>
                <option value="approved">승인</option>
                <option value="rejected">반려</option>
            </select>
        </div>

        <div class="search-field">
            <label class="search-label">시작일</label>
            <input type="date" class="search-input">
        </div>

        <div class="search-field">
            <label class="search-label">종료일</label>
            <input type="date" class="search-input">
        </div>

        <div class="search-field">
            <label class="search-label">분류</label>
            <select class="search-select">
                <option value="">전체</option>
                <option value="1">분류1</option>
                <option value="2">분류2</option>
            </select>
        </div>
    </div>

    <div class="search-buttons">
        <button class="btn btn-secondary" onclick="resetSearch()">초기화</button>
        <button class="btn btn-primary" onclick="search()">
            <i class="icon" data-lucide="search"></i>
            검색
        </button>
    </div>
</div>

<script>
function resetSearch() {
    document.querySelectorAll('.search-input, .search-select').forEach(el => {
        el.value = '';
    });
}

function search() {
    const inputs = document.querySelectorAll('.search-input, .search-select');
    const params = {};

    inputs.forEach(input => {
        if (input.value) {
            params[input.name || input.placeholder] = input.value;
        }
    });

    console.log('검색 파라미터:', params);
    // 실제 검색 로직 구현
}

lucide.createIcons();
</script>
```

---

## 유효성 검사

### HTML5 기본 검증
```html
<form onsubmit="return validateForm(event)">
    <div class="form-group">
        <label class="form-label">이메일 *</label>
        <input type="email" class="form-control" required
               pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
    </div>

    <div class="form-group">
        <label class="form-label">전화번호 *</label>
        <input type="tel" class="form-control" required
               pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}">
    </div>

    <button type="submit" class="btn btn-primary">제출</button>
</form>
```

### JavaScript 검증
```javascript
function validateForm(event) {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const tel = document.querySelector('input[type="tel"]').value;

    // 이메일 검증
    if (!isValidEmail(email)) {
        alert('올바른 이메일 형식이 아닙니다.');
        return false;
    }

    // 전화번호 검증
    if (!isValidTel(tel)) {
        alert('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
        return false;
    }

    // 모든 검증 통과
    submitForm();
    return false;
}

function isValidEmail(email) {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return re.test(email);
}

function isValidTel(tel) {
    const re = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
    return re.test(tel);
}

function submitForm() {
    // 폼 제출 로직
    console.log('폼 제출');
}
```

---

## 파일 업로드

```html
<div class="form-group">
    <label class="form-label">파일 첨부</label>
    <input type="file" id="fileInput" style="display: none;"
           onchange="handleFileChange(event)">
    <button type="button" class="btn btn-outline" onclick="document.getElementById('fileInput').click()">
        <i class="icon" data-lucide="upload"></i>
        파일 선택
    </button>
    <span id="fileName" style="margin-left: 12px; color: #6B7280;"></span>
</div>

<script>
function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;
    }
}

lucide.createIcons();
</script>
```

---

## 실전 예제

### 피드백 작성 폼
```html
<form id="feedbackForm" onsubmit="return submitFeedback(event)">
    <div class="form-group">
        <label class="form-label">학생 선택 *</label>
        <select class="form-control" id="studentId" required>
            <option value="">학생을 선택하세요</option>
            <option value="1">홍길동 (2024001)</option>
            <option value="2">김철수 (2024002)</option>
        </select>
    </div>

    <div class="form-group">
        <label class="form-label">피드백 제목 *</label>
        <input type="text" class="form-control" id="feedbackTitle"
               placeholder="피드백 제목을 입력하세요" required>
    </div>

    <div class="form-group">
        <label class="form-label">피드백 내용 *</label>
        <textarea class="form-control" id="feedbackContent"
                  rows="10" placeholder="피드백 내용을 입력하세요" required></textarea>
    </div>

    <div class="form-group">
        <label class="form-label">파일 첨부</label>
        <input type="file" id="fileInput" style="display: none;"
               onchange="handleFileChange(event)">
        <button type="button" class="btn btn-outline"
                onclick="document.getElementById('fileInput').click()">
            <i class="icon" data-lucide="upload"></i>
            파일 선택
        </button>
        <span id="fileName" style="margin-left: 12px; color: #6B7280;"></span>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
        <button type="button" class="btn btn-outline" onclick="closeModal()">취소</button>
        <button type="submit" class="btn btn-primary">저장</button>
    </div>
</form>

<script>
function submitFeedback(event) {
    event.preventDefault();

    const data = {
        studentId: document.getElementById('studentId').value,
        title: document.getElementById('feedbackTitle').value,
        content: document.getElementById('feedbackContent').value
    };

    console.log('피드백 데이터:', data);

    // 실제 제출 로직
    // API 호출 등...

    alert('피드백이 저장되었습니다.');
    document.getElementById('feedbackForm').reset();

    return false;
}

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;
    }
}

lucide.createIcons();
</script>
```

---

## 주의사항

### ✅ DO
- 필수 항목에 * 표시
- placeholder로 입력 예시 제공
- 라벨과 입력 필드 명확하게 연결
- 적절한 input type 사용 (email, tel, date 등)

### ❌ DON'T
- 라벨 없이 placeholder만 사용하지 않기
- 너무 많은 필수 항목 지정하지 않기
- 입력 필드를 너무 좁게 만들지 않기

---

## 관련 문서
- [디자인 시스템](../design-system-v3.md)
- [Buttons 가이드](./buttons.md)
- [Modals 가이드](./modals.md)
