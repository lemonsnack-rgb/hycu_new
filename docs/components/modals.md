# 모달 (Modals)

## 기본 모달 구조

```html
<div id="modal-example" class="modal-overlay" onclick="closeModal('modal-example')">
    <div class="modal-content" onclick="event.stopPropagation()">
        <!-- 모달 헤더 -->
        <div class="modal-header">
            <h3>모달 제목</h3>
            <button onclick="closeModal('modal-example')" class="modal-close">
                &times;
            </button>
        </div>

        <!-- 모달 바디 -->
        <div class="modal-body">
            <p>모달 내용이 여기에 들어갑니다.</p>
        </div>

        <!-- 모달 푸터 -->
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal-example')">
                취소
            </button>
            <button class="btn btn-primary" onclick="handleSubmit()">
                확인
            </button>
        </div>
    </div>
</div>

<script>
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function handleSubmit() {
    // 제출 로직
    console.log('제출됨');
    closeModal('modal-example');
}
</script>
```

---

## 모달 크기

### 작은 모달 (max-width: 400px)
```html
<div class="modal-content" style="max-width: 400px;" onclick="event.stopPropagation()">
    <!-- 내용 -->
</div>
```

### 중간 모달 (max-width: 500px, 기본값)
```html
<div class="modal-content" onclick="event.stopPropagation()">
    <!-- 내용 -->
</div>
```

### 큰 모달 (max-width: 800px)
```html
<div class="modal-content" style="max-width: 800px;" onclick="event.stopPropagation()">
    <!-- 내용 -->
</div>
```

### 전체 화면 모달 (max-width: 90%)
```html
<div class="modal-content" style="max-width: 90%;" onclick="event.stopPropagation()">
    <!-- 내용 -->
</div>
```

---

## 모달 유형

### 1. 확인 모달 (Confirm)
```html
<div id="modal-confirm" class="modal-overlay" onclick="closeModal('modal-confirm')">
    <div class="modal-content" style="max-width: 400px;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>삭제 확인</h3>
            <button onclick="closeModal('modal-confirm')" class="modal-close">
                &times;
            </button>
        </div>

        <div class="modal-body">
            <p>정말 삭제하시겠습니까?<br>이 작업은 취소할 수 없습니다.</p>
        </div>

        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal-confirm')">
                취소
            </button>
            <button class="btn btn-primary" onclick="handleDelete()">
                삭제
            </button>
        </div>
    </div>
</div>

<script>
function handleDelete() {
    // 삭제 로직
    console.log('삭제됨');
    closeModal('modal-confirm');
}
</script>
```

### 2. 폼 모달 (Form)
```html
<div id="modal-form" class="modal-overlay" onclick="closeModal('modal-form')">
    <div class="modal-content" style="max-width: 600px;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>피드백 작성</h3>
            <button onclick="closeModal('modal-form')" class="modal-close">
                &times;
            </button>
        </div>

        <div class="modal-body">
            <form id="feedbackForm">
                <div class="form-group">
                    <label class="form-label">학생 선택 *</label>
                    <select class="form-control" required>
                        <option value="">선택하세요</option>
                        <option value="1">홍길동</option>
                        <option value="2">김철수</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">피드백 내용 *</label>
                    <textarea class="form-control" rows="5" required></textarea>
                </div>
            </form>
        </div>

        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal-form')">
                취소
            </button>
            <button class="btn btn-primary" onclick="submitFeedback()">
                저장
            </button>
        </div>
    </div>
</div>

<script>
function submitFeedback() {
    const form = document.getElementById('feedbackForm');

    if (form.checkValidity()) {
        // 저장 로직
        console.log('저장됨');
        closeModal('modal-form');
        form.reset();
    } else {
        alert('필수 항목을 입력해주세요.');
    }
}
</script>
```

### 3. 알림 모달 (Alert)
```html
<div id="modal-alert" class="modal-overlay" onclick="closeModal('modal-alert')">
    <div class="modal-content" style="max-width: 400px;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>알림</h3>
            <button onclick="closeModal('modal-alert')" class="modal-close">
                &times;
            </button>
        </div>

        <div class="modal-body">
            <div class="alert alert-success">
                <i class="icon" data-lucide="check-circle"></i>
                성공적으로 저장되었습니다.
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-primary" onclick="closeModal('modal-alert')">
                확인
            </button>
        </div>
    </div>
</div>

<script>
lucide.createIcons();
</script>
```

### 4. 상세 보기 모달 (Detail View)
```html
<div id="modal-detail" class="modal-overlay" onclick="closeModal('modal-detail')">
    <div class="modal-content" style="max-width: 800px;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>피드백 상세</h3>
            <button onclick="closeModal('modal-detail')" class="modal-close">
                &times;
            </button>
        </div>

        <div class="modal-body">
            <div style="border-bottom: 1px solid #E5E7EB; padding-bottom: 16px; margin-bottom: 16px;">
                <h4 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">
                    피드백 제목
                </h4>
                <div style="display: flex; gap: 16px; font-size: 14px; color: #6B7280;">
                    <span>작성자: 김교수</span>
                    <span>작성일: 2025-01-15</span>
                    <span class="status-badge status-success">승인</span>
                </div>
            </div>

            <div style="line-height: 1.8; color: #1A1A1A;">
                <p>피드백 내용이 여기에 표시됩니다...</p>
            </div>

            <!-- 첨부파일 -->
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
                <h5 style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">
                    첨부파일
                </h5>
                <a href="#" style="color: #6A0028; text-decoration: none;">
                    <i class="icon" data-lucide="paperclip"></i>
                    첨부파일.pdf
                </a>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal-detail')">
                닫기
            </button>
            <button class="btn btn-primary" onclick="editFeedback()">
                수정
            </button>
        </div>
    </div>
</div>

<script>
function editFeedback() {
    closeModal('modal-detail');
    openModal('modal-form');
}

lucide.createIcons();
</script>
```

---

## 모달 열기/닫기

### 버튼으로 모달 열기
```html
<button class="btn btn-primary" onclick="openModal('modal-example')">
    모달 열기
</button>
```

### ESC 키로 닫기
```javascript
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal-overlay.show');
        openModals.forEach(modal => {
            modal.classList.remove('show');
        });
    }
});
```

### 오버레이 클릭으로 닫기 (이미 구현됨)
```html
<div class="modal-overlay" onclick="closeModal('modal-example')">
    <div class="modal-content" onclick="event.stopPropagation()">
        <!-- event.stopPropagation()으로 모달 내부 클릭 시 닫히지 않음 -->
    </div>
</div>
```

---

## 모달 내 테이블

```html
<div id="modal-table" class="modal-overlay" onclick="closeModal('modal-table')">
    <div class="modal-content" style="max-width: 900px;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>학생 선택</h3>
            <button onclick="closeModal('modal-table')" class="modal-close">
                &times;
            </button>
        </div>

        <div class="modal-body" style="padding: 0;">
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>선택</th>
                            <th>학번</th>
                            <th>이름</th>
                            <th>전공</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onclick="selectStudent(1)">
                            <td><input type="radio" name="student"></td>
                            <td>2024001</td>
                            <td>홍길동</td>
                            <td>컴퓨터공학</td>
                        </tr>
                        <tr onclick="selectStudent(2)">
                            <td><input type="radio" name="student"></td>
                            <td>2024002</td>
                            <td>김철수</td>
                            <td>전자공학</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal-table')">
                취소
            </button>
            <button class="btn btn-primary" onclick="confirmSelect()">
                선택
            </button>
        </div>
    </div>
</div>

<script>
let selectedStudentId = null;

function selectStudent(id) {
    selectedStudentId = id;
}

function confirmSelect() {
    if (selectedStudentId) {
        console.log('선택된 학생 ID:', selectedStudentId);
        closeModal('modal-table');
    } else {
        alert('학생을 선택해주세요.');
    }
}
</script>
```

---

## 모달 내 탭

```html
<div id="modal-tabs" class="modal-overlay" onclick="closeModal('modal-tabs')">
    <div class="modal-content" style="max-width: 800px;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>상세 정보</h3>
            <button onclick="closeModal('modal-tabs')" class="modal-close">
                &times;
            </button>
        </div>

        <div class="modal-body" style="padding: 0;">
            <!-- 탭 메뉴 -->
            <div class="tabs" style="border-bottom: 2px solid #E5E7EB; margin: 0; padding: 0 24px;">
                <button class="tab active" onclick="switchModalTab('info')">
                    기본 정보
                </button>
                <button class="tab" onclick="switchModalTab('history')">
                    히스토리
                </button>
                <button class="tab" onclick="switchModalTab('files')">
                    첨부파일
                </button>
            </div>

            <!-- 탭 내용 -->
            <div style="padding: 24px;">
                <div id="tab-info" class="tab-content active">
                    <p>기본 정보 내용...</p>
                </div>

                <div id="tab-history" class="tab-content" style="display: none;">
                    <p>히스토리 내용...</p>
                </div>

                <div id="tab-files" class="tab-content" style="display: none;">
                    <p>첨부파일 목록...</p>
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal-tabs')">
                닫기
            </button>
        </div>
    </div>
</div>

<script>
function switchModalTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('#modal-tabs .tab').forEach(t =>
        t.classList.remove('active')
    );
    document.querySelectorAll('#modal-tabs .tab-content').forEach(c => {
        c.style.display = 'none';
        c.classList.remove('active');
    });

    // 선택한 탭 활성화
    event.target.classList.add('active');
    const content = document.getElementById('tab-' + tabName);
    content.style.display = 'block';
    content.classList.add('active');
}
</script>
```

---

## 모달 스크롤

### 모달 바디만 스크롤
```html
<div class="modal-body" style="max-height: 400px; overflow-y: auto;">
    <!-- 긴 내용 -->
</div>
```

### 전체 모달 스크롤
```html
<div class="modal-content" style="max-height: 90vh; overflow-y: auto;">
    <!-- 내용 -->
</div>
```

---

## 실전 예제

### 피드백 작성 모달
```html
<div id="modal-feedback" class="modal-overlay" onclick="closeModal('modal-feedback')">
    <div class="modal-content" style="max-width: 700px;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3>피드백 작성</h3>
            <button onclick="closeModal('modal-feedback')" class="modal-close">
                &times;
            </button>
        </div>

        <div class="modal-body">
            <form id="feedbackForm">
                <div class="form-group">
                    <label class="form-label">학생 선택 *</label>
                    <div style="display: flex; gap: 8px;">
                        <select class="form-control" id="studentSelect" required style="flex: 1;">
                            <option value="">선택하세요</option>
                            <option value="1">홍길동 (2024001)</option>
                            <option value="2">김철수 (2024002)</option>
                        </select>
                        <button type="button" class="btn btn-outline" onclick="openModal('modal-table')">
                            <i class="icon" data-lucide="search"></i>
                        </button>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">피드백 유형 *</label>
                    <select class="form-control" required>
                        <option value="">선택하세요</option>
                        <option value="general">일반 피드백</option>
                        <option value="revision">수정 요청</option>
                        <option value="approval">승인</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">제목 *</label>
                    <input type="text" class="form-control" placeholder="피드백 제목" required>
                </div>

                <div class="form-group">
                    <label class="form-label">내용 *</label>
                    <textarea class="form-control" rows="8" placeholder="피드백 내용을 입력하세요" required></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">첨부파일</label>
                    <input type="file" id="fileInput" style="display: none;" onchange="handleFileChange(event)">
                    <button type="button" class="btn btn-outline" onclick="document.getElementById('fileInput').click()">
                        <i class="icon" data-lucide="upload"></i>
                        파일 선택
                    </button>
                    <span id="fileName" style="margin-left: 12px; color: #6B7280;"></span>
                </div>
            </form>
        </div>

        <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('modal-feedback')">
                취소
            </button>
            <button class="btn btn-primary" onclick="submitFeedback()">
                저장
            </button>
        </div>
    </div>
</div>

<script>
function submitFeedback() {
    const form = document.getElementById('feedbackForm');

    if (form.checkValidity()) {
        // 저장 로직
        console.log('피드백 저장됨');
        alert('피드백이 저장되었습니다.');
        closeModal('modal-feedback');
        form.reset();
        document.getElementById('fileName').textContent = '';
    } else {
        alert('필수 항목을 입력해주세요.');
    }
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
- 모달 제목을 명확하게 작성
- ESC 키로 닫기 기능 제공
- 오버레이 클릭으로 닫기 기능 제공
- Primary 액션 버튼은 오른쪽에 배치

### ❌ DON'T
- 모달 안에 또 다른 모달 열지 않기
- 모달을 너무 크게 만들지 않기 (max-width 90% 이하)
- 닫기 버튼 없이 모달 만들지 않기

---

## 관련 문서
- [디자인 시스템](../design-system-v3.md)
- [Forms 가이드](./forms.md)
- [Buttons 가이드](./buttons.md)
