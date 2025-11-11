/**
 * ================================================================
 * 자료실 게시판 (Enhanced Version)
 * ================================================================
 *
 * 기능:
 * - 교수-학생 관계 기반 접근 제어
 * - Rich Text Editor (Quill)
 * - 파일 첨부 및 미리보기
 * - 댓글 CRUD
 * - 게시글 수정/삭제
 * - 열람자 지정 (전체/석사/박사/개별학생)
 */

let currentEditor = null;
let currentUserId = null;
let currentUserType = null;
let currentUserName = null;
let editingPostId = null;
let selectedFiles = [];

/**
 * 게시판 초기화
 */
function initBoardEnhanced(userId, userType, userName) {
    console.log('게시판 초기화:', { userId, userType, userName });

    currentUserId = userId;
    currentUserType = userType;
    currentUserName = userName;

    renderBoardListEnhanced();
}

/**
 * 게시판 목록 렌더링
 */
function renderBoardListEnhanced() {
    const container = document.getElementById('boardContainer');
    if (!container) return;

    const posts = BoardService.getPosts(currentUserId, currentUserType);

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-gray-800">자료실</h3>
                    <button onclick="openBoardWriteModalEnhanced()"
                            class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        글쓰기
                    </button>
                </div>
            </div>

            <!-- 게시글 목록 -->
            <div class="overflow-x-auto">
                ${posts.length > 0 ? `
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600" style="width: 60px;">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">제목</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600" style="width: 120px;">작성자</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600" style="width: 140px;">작성일</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 60px;">첨부</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 60px;">조회</th>
                                ${currentUserType === 'professor' ? '<th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">열람권한</th>' : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${posts.map((post, idx) => `
                                <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewBoardPostEnhanced(${post.id})">
                                    <td class="py-3 px-4 text-sm text-gray-600">${posts.length - idx}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">
                                        <div class="flex items-center gap-2">
                                            <span>${post.title}</span>
                                            ${post.commentCount > 0 ? `<span class="text-blue-600 text-xs">[${post.commentCount}]</span>` : ''}
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${post.authorName}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${BoardService.formatDate(post.createdAt)}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">
                                        ${post.attachmentList.length > 0 ? `📎 ${post.attachmentList.length}` : '-'}
                                    </td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${post.viewCount}</td>
                                    ${currentUserType === 'professor' ? `
                                        <td class="py-3 px-4 text-center">
                                            <span class="text-xs px-2 py-1 rounded-full ${getAccessTypeBadgeClass(post.accessType)}">
                                                ${getAccessTypeText(post.accessType)}
                                            </span>
                                        </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">📋</div>
                        <h3 class="text-lg font-semibold text-gray-600 mb-2">등록된 게시글이 없습니다</h3>
                        <p class="text-gray-500 mb-4">첫 게시글을 작성해보세요.</p>
                        <button onclick="openBoardWriteModalEnhanced()"
                                class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                            글쓰기
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * 게시글 상세보기
 */
function viewBoardPostEnhanced(postId) {
    const post = BoardService.getPost(postId, currentUserId, currentUserType);
    if (!post) {
        alert('게시글을 불러올 수 없습니다.');
        return;
    }

    const isMyPost = post.authorId === currentUserId;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'boardPostModal';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 900px;">
            <div class="modal-header">
                <h2>${post.title}</h2>
                <button class="btn-close" onclick="closeBoardModalEnhanced()">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div class="modal-body">
                <!-- 게시글 정보 -->
                <div class="flex justify-between items-center mb-4 pb-4 border-b">
                    <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-600">
                            <strong>${post.authorName}</strong> (${post.authorType === 'professor' ? '교수' : '학생'})
                        </span>
                        <span class="text-sm text-gray-500">${BoardService.formatDate(post.createdAt)}</span>
                        <span class="text-sm text-gray-500">조회 ${post.viewCount}</span>
                    </div>
                    ${isMyPost ? `
                        <div class="flex gap-2">
                            <button onclick="openBoardEditModalEnhanced(${post.id})"
                                    class="text-blue-600 hover:text-blue-800 text-sm">
                                수정
                            </button>
                            <button onclick="deleteBoardPostEnhanced(${post.id})"
                                    class="text-red-600 hover:text-red-800 text-sm">
                                삭제
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- 본문 -->
                <div class="prose max-w-none mb-6 min-h-[200px]">
                    ${post.content}
                </div>

                <!-- 첨부파일 -->
                ${post.attachmentList.length > 0 ? `
                    <div class="border-t border-gray-200 pt-4 mb-6">
                        <p class="text-sm font-semibold text-gray-700 mb-3">첨부파일 (${post.attachmentList.length})</p>
                        <div class="space-y-2">
                            ${post.attachmentList.map(file => `
                                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                    <div class="flex items-center gap-3">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                        </svg>
                                        <div>
                                            <p class="text-sm font-medium text-gray-800">${file.fileName}</p>
                                            <p class="text-xs text-gray-500">${BoardService.formatFileSize(file.fileSize)}</p>
                                        </div>
                                    </div>
                                    <button onclick="downloadFile('${file.fileUrl}', '${file.fileName}')"
                                            class="text-blue-600 hover:text-blue-800 text-sm">
                                        다운로드
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- 댓글 섹션 -->
                <div class="border-t border-gray-200 pt-6">
                    <p class="text-sm font-semibold text-gray-700 mb-4">댓글 (${post.commentList.length})</p>

                    <!-- 댓글 목록 -->
                    <div class="space-y-3 mb-4" id="commentList">
                        ${renderCommentsEnhanced(post.commentList)}
                    </div>

                    <!-- 댓글 작성 -->
                    <div class="flex gap-2">
                        <input type="text"
                               id="commentInput"
                               placeholder="댓글을 입력하세요"
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                               onkeypress="if(event.key==='Enter') addCommentEnhanced(${post.id})">
                        <button onclick="addCommentEnhanced(${post.id})"
                                class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                            등록
                        </button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button onclick="closeBoardModalEnhanced()"
                        class="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                    닫기
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * 댓글 목록 렌더링
 */
function renderCommentsEnhanced(comments) {
    if (comments.length === 0) {
        return '<p class="text-sm text-gray-500 text-center py-4">첫 댓글을 작성해보세요.</p>';
    }

    return comments.map(comment => {
        const isMyComment = comment.authorId === currentUserId;
        return `
            <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-800">${comment.authorName}</span>
                        <span class="text-xs text-gray-500">${BoardService.formatDate(comment.createdAt)}</span>
                    </div>
                    ${isMyComment ? `
                        <button onclick="deleteCommentEnhanced(${comment.id}, ${comment.boardId})"
                                class="text-red-600 hover:text-red-800 text-xs">
                            삭제
                        </button>
                    ` : ''}
                </div>
                <p class="text-sm text-gray-700">${comment.content}</p>
            </div>
        `;
    }).join('');
}

/**
 * 댓글 추가
 */
function addCommentEnhanced(boardId) {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    const comment = BoardService.createComment({
        boardId: boardId,
        authorId: currentUserId,
        authorName: currentUserName,
        authorType: currentUserType,
        content: content
    });

    if (comment) {
        input.value = '';

        // 댓글 목록 갱신
        const post = BoardService.getPost(boardId, currentUserId, currentUserType);
        const commentList = document.getElementById('commentList');
        if (commentList && post) {
            commentList.innerHTML = renderCommentsEnhanced(post.commentList);
        }
    }
}

/**
 * 댓글 삭제
 */
function deleteCommentEnhanced(commentId, boardId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
        return;
    }

    const success = BoardService.deleteComment(commentId, currentUserId);
    if (success) {
        // 댓글 목록 갱신
        const post = BoardService.getPost(boardId, currentUserId, currentUserType);
        const commentList = document.getElementById('commentList');
        if (commentList && post) {
            commentList.innerHTML = renderCommentsEnhanced(post.commentList);
        }
    }
}

/**
 * 게시글 작성 모달
 */
function openBoardWriteModalEnhanced() {
    editingPostId = null;
    selectedFiles = [];
    openBoardFormModalEnhanced();
}

/**
 * 게시글 수정 모달
 */
function openBoardEditModalEnhanced(postId) {
    const post = BoardService.getPost(postId, currentUserId, currentUserType);
    if (!post || post.authorId !== currentUserId) {
        alert('수정 권한이 없습니다.');
        return;
    }

    editingPostId = postId;
    selectedFiles = [];
    openBoardFormModalEnhanced(post);
}

/**
 * 게시글 작성/수정 폼 모달
 */
function openBoardFormModalEnhanced(post = null) {
    const isEdit = post !== null;
    const myStudents = BoardService.getMyStudents(currentUserId);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'boardWriteModal';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 900px;">
            <div class="modal-header">
                <h2>${isEdit ? '게시글 수정' : '게시글 작성'}</h2>
                <button class="btn-close" onclick="closeBoardModalEnhanced()">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div class="modal-body">
                <div class="space-y-4">
                    <!-- 제목 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            제목 <span class="text-red-500">*</span>
                        </label>
                        <input type="text"
                               id="boardTitle"
                               value="${isEdit ? post.title : ''}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                               placeholder="제목을 입력하세요">
                    </div>

                    <!-- 내용 (Quill Editor) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            내용 <span class="text-red-500">*</span>
                        </label>
                        <div id="boardEditor" style="height: 300px; background: white;"></div>
                    </div>

                    <!-- 읽기 제한 -->
                    ${currentUserType === 'professor' ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                열람 권한 <span class="text-red-500">*</span>
                            </label>
                            <select id="boardAccessType"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    onchange="toggleStudentSelector()">
                                <option value="all" ${isEdit && post.accessType === 'all' ? 'selected' : ''}>전체 학생</option>
                                <option value="master" ${isEdit && post.accessType === 'master' ? 'selected' : ''}>석사 과정만</option>
                                <option value="phd" ${isEdit && post.accessType === 'phd' ? 'selected' : ''}>박사 과정만</option>
                                <option value="selected" ${isEdit && post.accessType === 'selected' ? 'selected' : ''}>개별 학생 선택</option>
                            </select>
                        </div>

                        <!-- 개별 학생 선택 -->
                        <div id="studentSelectorArea" style="display: ${isEdit && post.accessType === 'selected' ? 'block' : 'none'};">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                열람 가능한 학생 선택
                            </label>
                            <div class="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto">
                                ${myStudents.map(student => `
                                    <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                        <input type="checkbox"
                                               class="student-selector-checkbox"
                                               value="${student.studentId}"
                                               ${isEdit && post.allowedViewers.includes(student.studentId) ? 'checked' : ''}>
                                        <span class="text-sm">${student.studentName} (${student.degree === 'master' ? '석사' : '박사'})</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- 파일 첨부 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            파일 첨부
                        </label>
                        <input type="file"
                               id="boardFiles"
                               multiple
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                               onchange="handleFileSelection(event)">
                        <p class="text-xs text-gray-500 mt-1">최대 10MB, 최대 5개 파일</p>
                        <div id="filePreview" class="mt-2"></div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button onclick="closeBoardModalEnhanced()"
                        class="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                    취소
                </button>
                <button onclick="submitBoardPostEnhanced()"
                        class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    ${isEdit ? '수정' : '등록'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Quill Editor 초기화
    initQuillEditor(isEdit ? post.content : '');
}

/**
 * Quill Editor 초기화
 */
function initQuillEditor(initialContent = '') {
    // Quill이 로드되어 있는지 확인
    if (typeof Quill === 'undefined') {
        console.error('Quill is not loaded. Please include Quill library.');
        // Fallback to textarea
        document.getElementById('boardEditor').innerHTML = `
            <textarea id="fallbackEditor" class="w-full h-full px-3 py-2 border border-gray-300 rounded-lg">${initialContent}</textarea>
        `;
        return;
    }

    currentEditor = new Quill('#boardEditor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: '내용을 입력하세요...'
    });

    if (initialContent) {
        currentEditor.root.innerHTML = initialContent;
    }
}

/**
 * 개별 학생 선택 영역 토글
 */
function toggleStudentSelector() {
    const accessType = document.getElementById('boardAccessType').value;
    const selectorArea = document.getElementById('studentSelectorArea');

    if (selectorArea) {
        selectorArea.style.display = accessType === 'selected' ? 'block' : 'none';
    }
}

/**
 * 파일 선택 처리
 */
function handleFileSelection(event) {
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    // 파일 크기 및 개수 검증
    if (files.length > maxFiles) {
        alert(`최대 ${maxFiles}개 파일만 첨부 가능합니다.`);
        event.target.value = '';
        return;
    }

    for (const file of files) {
        if (file.size > maxSize) {
            alert(`${file.name}의 크기가 10MB를 초과합니다.`);
            event.target.value = '';
            return;
        }
    }

    selectedFiles = files;
    displayFilePreview(files);
}

/**
 * 파일 미리보기
 */
function displayFilePreview(files) {
    const preview = document.getElementById('filePreview');
    if (!preview) return;

    if (files.length === 0) {
        preview.innerHTML = '';
        return;
    }

    preview.innerHTML = `
        <div class="space-y-2">
            ${files.map((file, idx) => `
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                        <span class="text-sm text-gray-700">${file.name}</span>
                        <span class="text-xs text-gray-500">(${BoardService.formatFileSize(file.size)})</span>
                    </div>
                    <button onclick="removeFile(${idx})" class="text-red-600 hover:text-red-800 text-xs">
                        삭제
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * 파일 제거
 */
function removeFile(index) {
    selectedFiles = selectedFiles.filter((_, idx) => idx !== index);
    displayFilePreview(selectedFiles);

    // 파일 input 초기화
    const fileInput = document.getElementById('boardFiles');
    if (fileInput) {
        fileInput.value = '';
    }
}

/**
 * 게시글 등록/수정
 */
function submitBoardPostEnhanced() {
    const title = document.getElementById('boardTitle').value.trim();

    // 에디터 내용 가져오기
    let content = '';
    if (currentEditor) {
        content = currentEditor.root.innerHTML;
    } else {
        const fallbackEditor = document.getElementById('fallbackEditor');
        if (fallbackEditor) {
            content = fallbackEditor.value;
        }
    }

    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!content || content === '<p><br></p>') {
        alert('내용을 입력해주세요.');
        return;
    }

    const postData = {
        title: title,
        content: content,
        authorId: currentUserId,
        authorName: currentUserName,
        authorType: currentUserType
    };

    // 교수인 경우 접근 제어 설정
    if (currentUserType === 'professor') {
        const accessType = document.getElementById('boardAccessType').value;
        postData.accessType = accessType;

        if (accessType === 'selected') {
            const checkboxes = document.querySelectorAll('.student-selector-checkbox:checked');
            postData.allowedViewers = Array.from(checkboxes).map(cb => cb.value);

            if (postData.allowedViewers.length === 0) {
                alert('열람 가능한 학생을 선택해주세요.');
                return;
            }
        }
    }

    let result;
    if (editingPostId) {
        // 수정
        result = BoardService.updatePost(editingPostId, postData, currentUserId);
    } else {
        // 신규 등록
        result = BoardService.createPost(postData);
    }

    if (result) {
        // TODO: 파일 업로드 처리 (실제 구현 시 서버로 전송)
        if (selectedFiles.length > 0) {
            console.log('파일 업로드 예정:', selectedFiles);
            // 실제 구현: uploadFiles(result.id, selectedFiles);
        }

        closeBoardModalEnhanced();
        renderBoardListEnhanced();
        alert(editingPostId ? '게시글이 수정되었습니다.' : '게시글이 등록되었습니다.');
    }
}

/**
 * 게시글 삭제
 */
function deleteBoardPostEnhanced(postId) {
    if (!confirm('게시글을 삭제하시겠습니까?')) {
        return;
    }

    const success = BoardService.deletePost(postId, currentUserId);
    if (success) {
        closeBoardModalEnhanced();
        renderBoardListEnhanced();
        alert('게시글이 삭제되었습니다.');
    } else {
        alert('삭제 권한이 없습니다.');
    }
}

/**
 * 모달 닫기
 */
function closeBoardModalEnhanced() {
    const modals = document.querySelectorAll('#boardPostModal, #boardWriteModal');
    modals.forEach(modal => modal.remove());

    currentEditor = null;
    editingPostId = null;
    selectedFiles = [];
}

/**
 * 파일 다운로드
 */
function downloadFile(fileUrl, fileName) {
    // 실제 구현: 파일 다운로드
    console.log('파일 다운로드:', fileUrl, fileName);
    alert(`${fileName} 다운로드 (개발 모드)`);
}

/**
 * Helper 함수들
 */
function getAccessTypeText(accessType) {
    const map = {
        'all': '전체',
        'master': '석사',
        'phd': '박사',
        'selected': '선택'
    };
    return map[accessType] || accessType;
}

function getAccessTypeBadgeClass(accessType) {
    const map = {
        'all': 'bg-blue-100 text-blue-700',
        'master': 'bg-green-100 text-green-700',
        'phd': 'bg-purple-100 text-purple-700',
        'selected': 'bg-yellow-100 text-yellow-700'
    };
    return map[accessType] || 'bg-gray-100 text-gray-700';
}

// 전역 함수 export
window.initBoardEnhanced = initBoardEnhanced;
window.renderBoardListEnhanced = renderBoardListEnhanced;
window.viewBoardPostEnhanced = viewBoardPostEnhanced;
window.openBoardWriteModalEnhanced = openBoardWriteModalEnhanced;
window.openBoardEditModalEnhanced = openBoardEditModalEnhanced;
window.addCommentEnhanced = addCommentEnhanced;
window.deleteCommentEnhanced = deleteCommentEnhanced;
window.submitBoardPostEnhanced = submitBoardPostEnhanced;
window.deleteBoardPostEnhanced = deleteBoardPostEnhanced;
window.closeBoardModalEnhanced = closeBoardModalEnhanced;
window.toggleStudentSelector = toggleStudentSelector;
window.handleFileSelection = handleFileSelection;
window.removeFile = removeFile;
window.downloadFile = downloadFile;

console.log('✅ Enhanced Board Module Loaded');
