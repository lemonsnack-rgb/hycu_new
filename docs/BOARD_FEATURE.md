# 자료실 게시판 기능

## 개요

교수와 학생 간 자료 공유를 위한 게시판 기능입니다. 교수-학생 관계 기반 접근 제어를 통해 각자의 지도교수-지도학생 간에만 게시글을 공유할 수 있습니다.

## 주요 기능

### 교수용 자료실
- ✅ Rich Text Editor(Quill)를 활용한 글쓰기
- ✅ 파일 첨부 (최대 10MB, 최대 5개)
- ✅ 열람자 지정 (전체/석사/박사/개별학생)
- ✅ 게시글 수정/삭제
- ✅ 댓글 작성/삭제
- ✅ 조회수 추적

### 학생용 자료실
- ✅ 지도교수의 게시글 열람 (권한에 따라)
- ✅ Rich Text Editor로 글쓰기
- ✅ 파일 첨부
- ✅ 댓글 작성/삭제

## 아키텍처

### 접근 제어 구조

```
교수 A ─┬─ 학생 1 (석사)
        ├─ 학생 2 (석사)
        └─ 학생 3 (박사)

학생 X ─┬─ 교수 A (주지도)
        └─ 교수 B (부지도)
```

- 교수는 자신이 지도하는 학생들에게만 게시글 공개
- 학생은 자신의 지도교수들이 작성한 게시글만 열람
- 열람 권한: 전체, 석사만, 박사만, 개별 학생 선택

### 파일 구조

```
hycu_new/
├── common/
│   ├── board-service.js         # 데이터 관리 및 접근 제어
│   └── board-styles.css         # 게시판 스타일
├── professor/
│   └── assets/js/
│       └── board-enhanced.js    # 교수/학생 공용 UI
└── docs/
    └── BOARD_FEATURE.md         # 이 문서
```

### 데이터 구조

#### Post (게시글)
```javascript
{
    id: number,
    title: string,
    content: string,           // HTML (from Quill)
    authorId: string,
    authorName: string,
    authorType: 'professor' | 'student',
    createdAt: string,        // ISO 8601
    updatedAt: string,
    viewCount: number,
    accessType: 'all' | 'master' | 'phd' | 'selected',
    allowedViewers: string[], // studentId 배열 (accessType='selected'일 때)
    attachments: number[],    // attachment ID 배열
    isDeleted: boolean
}
```

#### Comment (댓글)
```javascript
{
    id: number,
    boardId: number,
    authorId: string,
    authorName: string,
    authorType: 'professor' | 'student',
    content: string,
    createdAt: string,
    isDeleted: boolean
}
```

#### Attachment (첨부파일)
```javascript
{
    id: number,
    boardId: number,
    fileName: string,
    fileSize: number,       // bytes
    fileUrl: string,
    uploadedAt: string
}
```

## 사용 방법

### 교수 - 게시글 작성

1. **자료실 메뉴 클릭**
2. **글쓰기 버튼 클릭**
3. **제목 입력**
4. **Quill 에디터로 본문 작성**
   - 텍스트 서식 (굵게, 기울임, 밑줄)
   - 제목 레벨 (H1, H2, H3)
   - 목록 (순서있음/없음)
   - 색상 및 배경색
   - 링크 및 이미지
5. **열람 권한 선택**
   - 전체 학생
   - 석사 과정만
   - 박사 과정만
   - 개별 학생 선택 (체크박스)
6. **파일 첨부 (선택)**
7. **등록 버튼 클릭**

### 교수 - 게시글 수정

1. **게시글 클릭하여 상세보기**
2. **수정 버튼 클릭**
3. **내용 수정**
4. **수정 버튼 클릭**

### 학생 - 게시글 작성

1. **자료실 메뉴 클릭**
2. **글쓰기 버튼 클릭**
3. **제목 및 본문 작성**
4. **파일 첨부 (선택)**
5. **등록 버튼 클릭**

Note: 학생은 열람 권한 설정 없이 지도교수들만 볼 수 있음

### 댓글 작성

1. **게시글 클릭하여 상세보기**
2. **하단 댓글 입력란에 내용 입력**
3. **등록 버튼 클릭 또는 Enter 키**

## API 명세

### BoardService.getPosts()

```javascript
BoardService.getPosts(userId, userType, filters)
```

**Parameters:**
- `userId` (string): 사용자 ID
- `userType` ('professor' | 'student'): 사용자 유형
- `filters` (Object): 필터 옵션 (선택)

**Returns:** Array of Posts with attachment and comment counts

### BoardService.getPost()

```javascript
BoardService.getPost(postId, userId, userType)
```

**Parameters:**
- `postId` (number): 게시글 ID
- `userId` (string): 사용자 ID
- `userType` ('professor' | 'student'): 사용자 유형

**Returns:** Post object with attachments and comments (null if no access)

### BoardService.createPost()

```javascript
BoardService.createPost(postData)
```

**Parameters:**
```javascript
{
    title: string,
    content: string,
    authorId: string,
    authorName: string,
    authorType: string,
    accessType: string,        // professor only
    allowedViewers: string[]   // professor only
}
```

**Returns:** Created post object

### BoardService.updatePost()

```javascript
BoardService.updatePost(postId, updateData, userId)
```

**Returns:** Updated post object or null

### BoardService.deletePost()

```javascript
BoardService.deletePost(postId, userId)
```

**Returns:** boolean (success/failure)

### BoardService.createComment()

```javascript
BoardService.createComment(commentData)
```

**Parameters:**
```javascript
{
    boardId: number,
    authorId: string,
    authorName: string,
    authorType: string,
    content: string
}
```

**Returns:** Created comment object

### BoardService.deleteComment()

```javascript
BoardService.deleteComment(commentId, userId)
```

**Returns:** boolean

## 통합 가이드

### HTML에 스크립트 포함

```html
<!-- CSS -->
<link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
<link rel="stylesheet" href="../common/board-styles.css">

<!-- JS -->
<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
<script src="../common/board-service.js"></script>
<script src="assets/js/board-enhanced.js"></script>
```

### 초기화

```javascript
// 교수
const currentProf = DataService.getCurrentProfessor();
initBoardEnhanced(currentProf.id, 'professor', currentProf.name);

// 학생
const currentStudent = getStudentInfo();
initBoardEnhanced(currentStudent.id, 'student', currentStudent.name);
```

## 파일 업로드 구현

현재 파일 업로드는 Mock으로 구현되어 있습니다. 실제 구현 시:

### 1. 파일 업로드 API

```javascript
async function uploadFiles(postId, files) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('boardId', postId);

    const response = await fetch('/api/board/upload', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getAuthToken()
        },
        body: formData
    });

    return await response.json();
}
```

### 2. board-enhanced.js 수정

```javascript
// submitBoardPostEnhanced() 함수 내
if (selectedFiles.length > 0) {
    const uploadResult = await uploadFiles(result.id, selectedFiles);
    // 업로드된 파일 정보를 게시글에 연결
}
```

## 보안 고려사항

### 1. 접근 제어

- 모든 API 요청 시 사용자 인증 확인
- 게시글 조회 시 접근 권한 검증
- 수정/삭제 시 작성자 확인

### 2. XSS 방지

Quill 에디터는 기본적으로 XSS 방지 기능 제공하지만, 서버 측에서도 검증 필요:

```javascript
// 서버 측 HTML sanitization
const sanitizeHtml = require('sanitize-html');
const cleanContent = sanitizeHtml(content, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'a', 'img'],
    allowedAttributes: {
        'a': ['href'],
        'img': ['src', 'alt']
    }
});
```

### 3. 파일 업로드 보안

- 파일 타입 검증
- 파일 크기 제한
- 바이러스 스캔
- 안전한 파일명 생성

```javascript
// 허용된 파일 확장자
const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.png', '.zip'];

// 파일명 검증
function isValidFile(file) {
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return allowedExtensions.includes(ext) && file.size <= 10 * 1024 * 1024;
}
```

## 데이터베이스 스키마

### boards 테이블

```sql
CREATE TABLE boards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_type ENUM('professor', 'student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    view_count INT DEFAULT 0,
    access_type ENUM('all', 'master', 'phd', 'selected') DEFAULT 'all',
    is_deleted BOOLEAN DEFAULT FALSE,
    INDEX idx_author (author_id, author_type),
    INDEX idx_created (created_at DESC)
);
```

### board_access 테이블 (개별 학생 선택 시)

```sql
CREATE TABLE board_access (
    id INT PRIMARY KEY AUTO_INCREMENT,
    board_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    UNIQUE KEY unique_access (board_id, student_id)
);
```

### comments 테이블

```sql
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    board_id INT NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_type ENUM('professor', 'student') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    INDEX idx_board (board_id, created_at)
);
```

### attachments 테이블

```sql
CREATE TABLE attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    board_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);
```

## 향후 개선사항

- [ ] 게시글 검색 기능
- [ ] 카테고리/태그 시스템
- [ ] 좋아요/북마크 기능
- [ ] 답글 (대댓글) 기능
- [ ] 알림 기능 (새 게시글, 댓글)
- [ ] 첨부 이미지 미리보기
- [ ] 파일 드래그 앤 드롭
- [ ] 게시글 공지사항 고정
- [ ] 파일 다중 선택 개선
- [ ] 에디터 이미지 직접 붙여넣기

## 트러블슈팅

### 1. Quill 에디터가 로드되지 않음

**증상**: 에디터 영역에 textarea만 표시

**해결**:
- Quill CDN이 로드되었는지 확인
- 네트워크 탭에서 quill.min.js 로드 확인
- 콘솔에서 `typeof Quill` 확인

### 2. 게시글이 보이지 않음

**증상**: 작성한 게시글이 목록에 없음

**해결**:
- 접근 권한 설정 확인
- 교수-학생 관계 매핑 확인 (BoardService.accessControl)
- 콘솔에서 `BoardService.getPosts()` 직접 호출 테스트

### 3. 파일 업로드 실패

**증상**: 파일 선택 후 업로드되지 않음

**해결**:
- 파일 크기 확인 (10MB 이하)
- 파일 개수 확인 (5개 이하)
- 콘솔 에러 메시지 확인

### 4. 댓글이 추가되지 않음

**증상**: 댓글 입력 후 등록되지 않음

**해결**:
- 사용자 정보 확인 (currentUserId, currentUserName)
- 게시글 ID 확인
- 콘솔에서 `BoardService.comments` 확인

## 라이선스

© 2025 한양사이버대학교. All rights reserved.

## 문의

기능 문의: IT지원팀
이메일: it-support@hycu.ac.kr
