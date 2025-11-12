/**
 * ================================================================
 * 자료실 게시판 - 학생용 (Enhanced Version)
 * ================================================================
 * ID 57: 학생용 게시판
 *
 * 기능:
 * - 지도교수별 게시판 분리
 * - 리치 텍스트 에디터
 * - 파일 첨부 및 다운로드
 * - 게시글 수정/삭제 (본인 글만)
 * - 댓글 기능
 * - 권한별 접근 제어 (지도교수와 같은 학생들만)
 */

// 현재 학생 정보 (실제로는 세션에서 가져옴)
let currentUser = {
    role: 'student',
    id: 'S001',
    name: '김철수'
};

// 게시판 초기화
function initBoard(userRole = 'student', userId = 'S001') {
    console.log('게시판 초기화 (학생용):', userRole, userId);

    // 학생 정보 설정 (실제로는 StudentData 또는 세션에서 가져옴)
    if (typeof StudentData !== 'undefined' && StudentData.student) {
        currentUser = {
            role: 'student',
            id: userId,
            name: StudentData.student.name
        };
    } else {
        // DataService가 있으면 사용
        if (typeof DataService !== 'undefined') {
            const student = DataService.getStudent(userId);
            if (student) {
                currentUser = {
                    role: 'student',
                    id: student.id,
                    name: student.name
                };
            }
        }
    }

    renderBoardList();
}

// 게시판 목록 렌더링
function renderBoardList() {
    const container = document.getElementById('boardContainer');
    if (!container) return;

    // DataService를 통해 게시글 가져오기
    let posts = [];
    if (typeof DataService !== 'undefined') {
        posts = DataService.getResourceBoards(currentUser.role, currentUser.id);
    }

    const html = `
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800">자료실</h2>
                <button onclick="openBoardWriteModal()" class="btn-primary">
                    + 글쓰기
                </button>
            </div>

            <!-- 게시글 목록 -->
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">제목</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">작성자</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">작성일</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">첨부</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">조회</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${posts.length === 0 ? `
                            <tr>
                                <td colspan="6" class="py-8 text-center text-gray-500">
                                    게시글이 없습니다.
                                </td>
                            </tr>
                        ` : posts.map((post, idx) => `
                            <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewBoardPost(${post.id})">
                                <td class="py-3 px-4 text-sm text-gray-800">${posts.length - idx}</td>
                                <td class="py-3 px-4 text-sm text-gray-800">
                                    ${post.title}
                                    ${post.comments.length > 0 ? `<span class="text-blue-600 ml-2">[${post.comments.length}]</span>` : ''}
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-800">
                                    ${post.authorName}
                                    ${post.authorRole === 'professor' ? '<span class="text-xs text-blue-600 ml-1">[교수]</span>' : '<span class="text-xs text-green-600 ml-1">[학생]</span>'}
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-600">${formatDateTime(post.createdAt)}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">
                                    ${post.files.length > 0 ? `📎 ${post.files.length}` : ''}
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-600">${post.views}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// 게시글 상세 보기
function viewBoardPost(postId) {
    if (typeof DataService === 'undefined') return;

    const post = DataService.getResourceBoard(postId);
    if (!post) return;

    // 조회수 증가
    DataService.incrementResourceBoardViews(postId);

    const isAuthor = post.authorId === currentUser.id;
    const canEdit = isAuthor;
    const canDelete = isAuthor;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'boardPostModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 56rem;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">${post.title}</h3>
                        <div class="flex items-center gap-4 text-sm text-gray-600">
                            <span>${post.authorName} ${post.authorRole === 'professor' ? '[교수]' : '[학생]'}</span>
                            <span>|</span>
                            <span>${formatDateTime(post.createdAt)}</span>
                            ${post.updatedAt !== post.createdAt ? `<span class="text-xs text-gray-500">(수정됨: ${formatDateTime(post.updatedAt)})</span>` : ''}
                            <span>|</span>
                            <span>조회 ${post.views}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        ${canEdit ? `<button onclick="openBoardEditModal(${post.id})" class="text-sm text-blue-600 hover:text-blue-800">수정</button>` : ''}
                        ${canDelete ? `<button onclick="deleteBoardPost(${post.id})" class="text-sm text-red-600 hover:text-red-800">삭제</button>` : ''}
                        <button onclick="closeBoardModal()" class="text-gray-400 hover:text-gray-600 text-2xl ml-2">&times;</button>
                    </div>
                </div>
            </div>

            <div class="p-6">
                <!-- 본문 -->
                <div class="prose max-w-none mb-6">
                    ${post.content}
                </div>

                <!-- 첨부파일 -->
                ${post.files.length > 0 ? `
                    <div class="border-t border-gray-200 pt-4 mb-6">
                        <p class="text-sm font-semibold text-gray-700 mb-2">첨부파일 (${post.files.length})</p>
                        <div class="space-y-2">
                            ${post.files.map(file => `
                                <div class="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer p-2 rounded hover:bg-gray-50">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                    </svg>
                                    <span class="flex-1">${file.name}</span>
                                    <span class="text-xs text-gray-500">${formatFileSize(file.size)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- 댓글 -->
                <div class="border-t border-gray-200 pt-4">
                    <p class="text-sm font-semibold text-gray-700 mb-4">댓글 (${post.comments.length})</p>

                    <!-- 댓글 목록 -->
                    <div class="space-y-3 mb-4">
                        ${post.comments.map(comment => {
                            const isCommentAuthor = comment.authorId === currentUser.id;
                            return `
                                <div class="bg-gray-50 p-3 rounded-lg">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <span class="text-sm font-medium text-gray-800">${comment.authorName}</span>
                                            <span class="text-xs text-gray-500 ml-2">${comment.authorRole === 'professor' ? '[교수]' : '[학생]'}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs text-gray-500">${formatDateTime(comment.createdAt)}</span>
                                            ${isCommentAuthor ? `<button onclick="deleteComment(${post.id}, '${comment.id}')" class="text-xs text-red-600 hover:text-red-800">삭제</button>` : ''}
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-700">${comment.content}</p>
                                    ${comment.files && comment.files.length > 0 ? `
                                        <div class="mt-2 space-y-1">
                                            ${comment.files.map(file => `
                                                <div class="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 cursor-pointer">
                                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                                    </svg>
                                                    <span>${file.name}</span>
                                                    <span class="text-gray-500">(${formatFileSize(file.size)})</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- 댓글 작성 -->
                    <div class="space-y-2">
                        <div class="flex gap-2">
                            <input type="text"
                                   id="commentInput"
                                   placeholder="댓글을 입력하세요"
                                   class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   onkeypress="if(event.key==='Enter' && !event.shiftKey) addComment(${post.id})">
                            <button onclick="addComment(${post.id})" class="btn-primary">등록</button>
                        </div>
                        <div>
                            <input type="file"
                                   id="commentFiles"
                                   multiple
                                   class="text-xs text-gray-600"
                                   onchange="updateCommentFilePreview()">
                            <div id="commentFilePreview" class="mt-1 space-y-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// 댓글 추가
function addComment(postId) {
    if (typeof DataService === 'undefined') return;

    const input = document.getElementById('commentInput');
    const content = input.value.trim();
    const filesInput = document.getElementById('commentFiles');

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    // 파일 처리
    const files = [];
    if (filesInput && filesInput.files.length > 0) {
        for (let i = 0; i < filesInput.files.length; i++) {
            const file = filesInput.files[i];
            files.push({
                id: `CF${Date.now()}_${i}`,
                name: file.name,
                size: file.size,
                url: '#' // 실제로는 업로드된 파일의 URL
            });
        }
    }

    DataService.addResourceBoardComment(postId, {
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: content,
        files: files
    });

    input.value = '';
    if (filesInput) filesInput.value = '';
    closeBoardModal();
    viewBoardPost(postId);
}

// 댓글 파일 미리보기 업데이트
function updateCommentFilePreview() {
    const filesInput = document.getElementById('commentFiles');
    const preview = document.getElementById('commentFilePreview');

    if (!filesInput || !preview) return;

    if (filesInput.files.length === 0) {
        preview.innerHTML = '';
        return;
    }

    const fileList = Array.from(filesInput.files).map(file => `
        <div class="flex items-center gap-2 text-xs text-gray-600">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
            <span>${file.name}</span>
            <span class="text-gray-500">(${formatFileSize(file.size)})</span>
        </div>
    `).join('');

    preview.innerHTML = fileList;
}

// 댓글 삭제
function deleteComment(postId, commentId) {
    if (typeof DataService === 'undefined') return;

    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    DataService.deleteResourceBoardComment(postId, commentId);
    closeBoardModal();
    viewBoardPost(postId);
}

// 게시글 작성 모달 (학생용 - 지도교수에게만 공개)
function openBoardWriteModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'boardWriteModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 56rem;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">글쓰기</h3>
                    <button onclick="closeBoardModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
            </div>

            <div class="p-6">
                <div class="space-y-4">
                    <!-- 제목 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
                        <input type="text" id="postTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="제목을 입력하세요">
                    </div>

                    <!-- 내용 (리치 텍스트 에디터) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">내용 *</label>
                        <div class="border border-gray-300 rounded-lg overflow-hidden">
                            <!-- 에디터 툴바 -->
                            <div class="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
                                <button type="button" onclick="formatText('bold')" class="px-2 py-1 hover:bg-gray-200 rounded" title="굵게">
                                    <strong>B</strong>
                                </button>
                                <button type="button" onclick="formatText('italic')" class="px-2 py-1 hover:bg-gray-200 rounded" title="기울임">
                                    <em>I</em>
                                </button>
                                <button type="button" onclick="formatText('underline')" class="px-2 py-1 hover:bg-gray-200 rounded" title="밑줄">
                                    <u>U</u>
                                </button>
                                <div class="border-l border-gray-300 mx-1"></div>
                                <button type="button" onclick="formatText('insertUnorderedList')" class="px-2 py-1 hover:bg-gray-200 rounded" title="목록">
                                    • 목록
                                </button>
                                <button type="button" onclick="formatText('insertOrderedList')" class="px-2 py-1 hover:bg-gray-200 rounded" title="번호 목록">
                                    1. 목록
                                </button>
                            </div>
                            <!-- 에디터 영역 -->
                            <div id="postContent"
                                 contenteditable="true"
                                 class="min-h-[300px] p-3 focus:outline-none"
                                 placeholder="내용을 입력하세요..."
                                 style="max-height: 400px; overflow-y: auto;">
                            </div>
                        </div>
                    </div>

                    <!-- 공개 범위 안내 -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-blue-800">
                            <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                            </svg>
                            이 글은 지도교수님께만 공개됩니다.
                        </p>
                    </div>

                    <!-- 파일 첨부 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">파일 첨부</label>
                        <input type="file" id="postFiles" multiple class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <p class="text-xs text-gray-500 mt-1">최대 10개 파일, 각 50MB 이하</p>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-2 justify-end pt-4">
                        <button onclick="closeBoardModal()" class="btn-cancel">취소</button>
                        <button onclick="submitBoardPost()" class="btn-primary">등록</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // contenteditable placeholder 처리
    const editor = document.getElementById('postContent');
    editor.addEventListener('focus', function() {
        if (this.textContent.trim() === '') {
            this.textContent = '';
        }
    });
    editor.addEventListener('blur', function() {
        if (this.textContent.trim() === '') {
            this.innerHTML = '';
        }
    });
}

// 게시글 수정 모달
function openBoardEditModal(postId) {
    if (typeof DataService === 'undefined') return;

    const post = DataService.getResourceBoard(postId);
    if (!post) return;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'boardEditModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 56rem;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">글 수정</h3>
                    <button onclick="closeBoardModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
            </div>

            <div class="p-6">
                <div class="space-y-4">
                    <!-- 제목 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
                        <input type="text" id="postTitle" value="${post.title}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>

                    <!-- 내용 (리치 텍스트 에디터) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">내용 *</label>
                        <div class="border border-gray-300 rounded-lg overflow-hidden">
                            <!-- 에디터 툴바 -->
                            <div class="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
                                <button type="button" onclick="formatText('bold')" class="px-2 py-1 hover:bg-gray-200 rounded" title="굵게">
                                    <strong>B</strong>
                                </button>
                                <button type="button" onclick="formatText('italic')" class="px-2 py-1 hover:bg-gray-200 rounded" title="기울임">
                                    <em>I</em>
                                </button>
                                <button type="button" onclick="formatText('underline')" class="px-2 py-1 hover:bg-gray-200 rounded" title="밑줄">
                                    <u>U</u>
                                </button>
                                <div class="border-l border-gray-300 mx-1"></div>
                                <button type="button" onclick="formatText('insertUnorderedList')" class="px-2 py-1 hover:bg-gray-200 rounded" title="목록">
                                    • 목록
                                </button>
                                <button type="button" onclick="formatText('insertOrderedList')" class="px-2 py-1 hover:bg-gray-200 rounded" title="번호 목록">
                                    1. 목록
                                </button>
                            </div>
                            <!-- 에디터 영역 -->
                            <div id="postContent"
                                 contenteditable="true"
                                 class="min-h-[300px] p-3 focus:outline-none"
                                 style="max-height: 400px; overflow-y: auto;">${post.content}</div>
                        </div>
                    </div>

                    <!-- 기존 파일 -->
                    ${post.files.length > 0 ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">첨부된 파일</label>
                            <div class="space-y-2" id="existingFiles">
                                ${post.files.map(file => `
                                    <div class="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                        </svg>
                                        <span class="flex-1">${file.name}</span>
                                        <span class="text-xs text-gray-500">${formatFileSize(file.size)}</span>
                                        <button onclick="removeExistingFile('${file.id}')" class="text-red-600 hover:text-red-800 text-xs">삭제</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- 새 파일 첨부 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">파일 추가</label>
                        <input type="file" id="postFiles" multiple class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <p class="text-xs text-gray-500 mt-1">최대 10개 파일, 각 50MB 이하</p>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-2 justify-end pt-4">
                        <button onclick="closeBoardModal()" class="btn-cancel">취소</button>
                        <button onclick="updateBoardPost(${postId})" class="btn-primary">수정</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// 리치 텍스트 포맷팅
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('postContent').focus();
}

// 기존 파일 삭제 (UI에서만, 실제 저장은 updateBoardPost에서)
function removeExistingFile(fileId) {
    const fileElement = event.target.closest('div');
    if (fileElement) {
        fileElement.remove();
    }
}

// 게시글 등록
function submitBoardPost() {
    if (typeof DataService === 'undefined') return;

    const title = document.getElementById('postTitle').value.trim();
    const contentDiv = document.getElementById('postContent');
    const content = contentDiv.innerHTML.trim();
    const filesInput = document.getElementById('postFiles');

    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!content || content === '<br>' || contentDiv.textContent.trim() === '') {
        alert('내용을 입력해주세요.');
        return;
    }

    // 학생이 작성하는 경우, 지도교수에게만 공개
    const student = DataService.getStudent(currentUser.id);
    let viewers = [];
    if (student) {
        viewers = [student.advisor];
    }

    // 파일 처리 (실제로는 서버 업로드 필요, 여기서는 시뮬레이션)
    const files = [];
    if (filesInput.files.length > 0) {
        for (let i = 0; i < filesInput.files.length; i++) {
            const file = filesInput.files[i];
            files.push({
                id: `F${Date.now()}_${i}`,
                name: file.name,
                size: file.size,
                url: '#' // 실제로는 업로드된 파일의 URL
            });
        }
    }

    // 게시글 생성
    const postData = {
        title: title,
        content: content,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        files: files,
        viewerType: 'specific',
        viewers: viewers
    };

    DataService.createResourceBoard(postData);

    closeBoardModal();
    renderBoardList();
    alert('게시글이 등록되었습니다.');
}

// 게시글 수정
function updateBoardPost(postId) {
    if (typeof DataService === 'undefined') return;

    const title = document.getElementById('postTitle').value.trim();
    const contentDiv = document.getElementById('postContent');
    const content = contentDiv.innerHTML.trim();
    const filesInput = document.getElementById('postFiles');

    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!content || content === '<br>' || contentDiv.textContent.trim() === '') {
        alert('내용을 입력해주세요.');
        return;
    }

    const post = DataService.getResourceBoard(postId);
    if (!post) return;

    // 기존 파일 체크 (삭제된 것 제외)
    const existingFilesDiv = document.getElementById('existingFiles');
    const remainingFiles = existingFilesDiv ?
        Array.from(existingFilesDiv.querySelectorAll('div')).map(div => {
            const fileId = div.querySelector('button').getAttribute('onclick').match(/'([^']+)'/)[1];
            return post.files.find(f => f.id === fileId);
        }).filter(f => f) : post.files;

    // 새 파일 추가
    const newFiles = [];
    if (filesInput.files.length > 0) {
        for (let i = 0; i < filesInput.files.length; i++) {
            const file = filesInput.files[i];
            newFiles.push({
                id: `F${Date.now()}_${i}`,
                name: file.name,
                size: file.size,
                url: '#'
            });
        }
    }

    // 게시글 업데이트
    const postData = {
        title: title,
        content: content,
        files: [...remainingFiles, ...newFiles]
    };

    DataService.updateResourceBoard(postId, postData);

    closeBoardModal();
    renderBoardList();
    alert('게시글이 수정되었습니다.');
}

// 게시글 삭제
function deleteBoardPost(postId) {
    if (typeof DataService === 'undefined') return;

    if (!confirm('게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.')) {
        return;
    }

    DataService.deleteResourceBoard(postId);

    closeBoardModal();
    renderBoardList();
    alert('게시글이 삭제되었습니다.');
}

// 모달 닫기
function closeBoardModal() {
    const modals = document.querySelectorAll('#boardPostModal, #boardWriteModal, #boardEditModal');
    modals.forEach(modal => modal.remove());
}

// 유틸리티 함수
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

console.log('✅ 자료실 게시판 모듈 로드 완료 (학생용 Enhanced Version)');
