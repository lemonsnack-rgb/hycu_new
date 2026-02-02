/**
 * ================================================================
 * 자료실 게시판 (교수용)
 * ================================================================
 * ID 32: 교수용 게시판
 *
 * 기능:
 * - 게시글 작성/수정/삭제
 * - 리치 텍스트 에디터
 * - 파일 첨부 및 다운로드
 * - 열람자 지정 (전체/석사/박사/개별학생)
 * - 댓글 기능
 * - 권한별 접근 제어
 */

// 현재 사용자 정보
let currentUser = {
    role: 'professor',
    id: 'P001',
    name: '김교수'
};

// 화면 상태 관리
let boardCurrentView = 'list';  // 'list' | 'write' | 'edit' | 'detail'
let boardCurrentPostId = null;
let boardEventListenerAttached = false;  // 이벤트 리스너 중복 방지

// 게시판 초기화
function initBoard(userRole, userId = null) {
    // 사용자 정보 설정
    if (userRole === 'professor') {
        const professor = DataService.getProfessor();
        currentUser = {
            role: 'professor',
            id: professor.id,
            name: professor.name
        };
    } else if (userRole === 'student' && userId) {
        const student = DataService.getStudent(userId);
        if (student) {
            currentUser = {
                role: 'student',
                id: student.id,
                name: student.name
            };
        }
    }

    // 이벤트 위임 설정 (한 번만)
    if (!boardEventListenerAttached) {
        setupBoardEventDelegation();
        boardEventListenerAttached = true;
    }

    // 초기 화면 렌더링
    renderBoardScreen();
}

// 이벤트 위임 설정
function setupBoardEventDelegation() {
    const container = document.getElementById('boardContainer');
    if (!container) {
        return;
    }

    container.addEventListener('click', (e) => {
        // 버튼 클릭 처리
        const button = e.target.closest('button');
        if (button) {
            const action = button.getAttribute('data-action');
            const id = button.getAttribute('data-id');
            const commentId = button.getAttribute('data-comment-id');

            if (action === 'write') {
                e.preventDefault();
                switchBoardView('write');
                return;
            } else if (action === 'back-to-list') {
                e.preventDefault();
                switchBoardView('list');
                return;
            } else if (action === 'edit') {
                e.preventDefault();
                switchBoardView('edit', id);
                return;
            } else if (action === 'delete') {
                e.preventDefault();
                deleteBoardPost(id);
                return;
            } else if (action === 'submit-post') {
                e.preventDefault();
                submitBoardPost();
                return;
            } else if (action === 'update-post') {
                e.preventDefault();
                updateBoardPost(boardCurrentPostId);
                return;
            } else if (action === 'add-comment') {
                e.preventDefault();
                addComment(boardCurrentPostId);
                return;
            } else if (action === 'delete-comment') {
                e.preventDefault();
                deleteComment(boardCurrentPostId, commentId);
                return;
            } else if (action === 'format-text') {
                e.preventDefault();
                const command = button.getAttribute('data-command');
                document.execCommand(command, false, null);
                document.getElementById('postContent')?.focus();
                return;
            }
            // 버튼이지만 위의 action들이 아닌 경우, 행 클릭 처리로 진행
        }

        // 테이블 행 클릭 처리
        // closest()를 사용하여 TR 요소 찾기
        let element = e.target;
        let row = null;

        // 최대 5단계까지 부모 요소 탐색
        for (let i = 0; i < 5 && element; i++) {
            if (element.tagName === 'TR' && element.getAttribute('data-action') === 'view') {
                row = element;
                break;
            }
            element = element.parentElement;
        }

        if (row) {
            const id = row.getAttribute('data-id');
            if (id) {
                e.preventDefault();
                e.stopPropagation();
                // Convert string ID to number
                switchBoardView('detail', parseInt(id, 10));
            }
        }
    });
}

// 화면 전환
function switchBoardView(viewName, postId = null) {
    boardCurrentView = viewName;
    boardCurrentPostId = postId;
    renderBoardScreen();
}

// 화면 렌더링
function renderBoardScreen() {
    const container = document.getElementById('boardContainer');
    if (!container) return;

    if (boardCurrentView === 'list') {
        renderBoardList();
    } else if (boardCurrentView === 'write') {
        renderBoardWriteForm();
    } else if (boardCurrentView === 'edit') {
        renderBoardEditForm(boardCurrentPostId);
    } else if (boardCurrentView === 'detail') {
        renderBoardDetail(boardCurrentPostId);
    }
}

// 게시판 목록 렌더링
function renderBoardList() {
    const container = document.getElementById('boardContainer');
    if (!container) {
        return;
    }

    const posts = DataService.getResourceBoards(currentUser.role, currentUser.id);

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 테이블 컨테이너 -->
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">논문지도 자료실</h3>
                        <span class="table-count">(총 ${posts.length}건)</span>
                    </div>
                    <div class="table-header-right">
                        <button data-action="write" class="btn btn-primary btn-sm">
                            + 글쓰기
                        </button>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th style="width: 80px;">번호</th>
                                <th style="min-width: 300px;">제목</th>
                                <th style="width: 120px;">작성자</th>
                                <th style="width: 120px;">작성일</th>
                                <th style="width: 80px;">첨부</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${posts.length === 0 ? `
                                <tr>
                                    <td colspan="5" style="text-align: center; padding: 24px 12px;">
                                        등록된 자료가 없습니다.
                                    </td>
                                </tr>
                            ` : posts.map((post, idx) => `
                                <tr class="cursor-pointer" data-action="view" data-id="${post.id}">
                                    <td>${posts.length - idx}</td>
                                    <td>
                                        ${post.title}
                                        ${post.comments.length > 0 ? `<span class="text-[#6A0028] ml-2">[${post.comments.length}]</span>` : ''}
                                    </td>
                                    <td>
                                        ${post.authorName}
                                        ${post.authorRole === 'professor' ? '<span class="text-xs text-[#6A0028] ml-1">[교수]</span>' : '<span class="text-xs text-green-600 ml-1">[학생]</span>'}
                                    </td>
                                    <td>${formatDateTime(post.createdAt)}</td>
                                    <td>
                                        ${post.files.length > 0 ? `📎 ${post.files.length}` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// 게시글 상세 보기
function renderBoardDetail(postId) {
    const container = document.getElementById('boardContainer');
    if (!container) return;

    const post = DataService.getResourceBoard(postId);
    if (!post) {
        switchBoardView('list');
        return;
    }

    // 조회수 증가
    DataService.incrementResourceBoardViews(postId);

    const isAuthor = post.authorId === currentUser.id;
    const canEdit = isAuthor;
    const canDelete = isAuthor;

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="px-6 py-3 border-b flex items-center justify-between">
                <button data-action="back-to-list" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
                <div class="flex items-center gap-2">
                    ${canEdit ? `<button data-action="edit" data-id="${post.id}" class="text-sm text-[#6A0028] hover:text-[#6A0028]">수정</button>` : ''}
                    ${canDelete ? `<button data-action="delete" data-id="${post.id}" class="text-sm text-red-600 hover:text-red-800">삭제</button>` : ''}
                </div>
            </div>

            <div class="px-6 py-4 border-b bg-gray-50">
                <h3 class="text-lg font-bold text-gray-800 mb-2">${post.title}</h3>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                    <span>${post.authorName}</span>
                    <span>|</span>
                    <span>${formatDateTime(post.createdAt)}</span>
                    ${post.updatedAt !== post.createdAt ? `<span class="text-xs text-gray-500">(수정됨: ${formatDateTime(post.updatedAt)})</span>` : ''}
                    <span>|</span>
                    <span>조회 ${post.views}</span>
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
                        <p class="text-sm font-semibold text-gray-800 mb-2">첨부파일 (${post.files.length})</p>
                        <div class="space-y-2">
                            ${post.files.map(file => `
                                <div class="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6A0028] cursor-pointer p-2 rounded hover:bg-gray-50">
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
                    <p class="text-sm font-semibold text-gray-800 mb-4">댓글 (${post.comments.length})</p>

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
                                            ${isCommentAuthor ? `<button data-action="delete-comment" data-comment-id="${comment.id}" class="text-xs text-red-600 hover:text-red-800">삭제</button>` : ''}
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-800">${comment.content}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- 댓글 작성 -->
                    <div class="flex gap-2">
                        <input type="text"
                               id="commentInput"
                               placeholder="댓글을 입력하세요"
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <button data-action="add-comment" class="btn-primary">등록</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Enter key listener for comment input
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addComment(boardCurrentPostId);
            }
        });
    }
}

// 댓글 추가
function addComment(postId) {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    DataService.addResourceBoardComment(postId, {
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: content
    });

    input.value = '';
    renderBoardDetail(boardCurrentPostId);
}

// 댓글 삭제
function deleteComment(postId, commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    DataService.deleteResourceBoardComment(postId, commentId);
    renderBoardDetail(boardCurrentPostId);
}

// 게시글 작성 폼
function renderBoardWriteForm() {
    const container = document.getElementById('boardContainer');
    if (!container) return;

    // 학생 목록 가져오기 (교수가 열람자 지정할 때 사용)
    const students = DataService.getStudents();

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="px-6 py-3 border-b flex items-center justify-between">
                <button data-action="back-to-list" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
                <h3 class="text-lg font-bold text-gray-800">글쓰기</h3>
                <div style="width: 120px;"></div>
            </div>

            <div class="p-6">
                <div class="space-y-4">
                    <!-- 제목 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2">제목 *</label>
                        <input type="text" id="postTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="제목을 입력하세요">
                    </div>

                    <!-- 내용 (리치 텍스트 에디터) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2">내용 *</label>
                        <div class="border border-gray-300 rounded-lg overflow-hidden">
                            <!-- 에디터 툴바 -->
                            <div class="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
                                <button type="button" data-action="format-text" data-command="bold" class="px-2 py-1 hover:bg-gray-200 rounded" title="굵게">
                                    <strong>B</strong>
                                </button>
                                <button type="button" data-action="format-text" data-command="italic" class="px-2 py-1 hover:bg-gray-200 rounded" title="기울임">
                                    <em>I</em>
                                </button>
                                <button type="button" data-action="format-text" data-command="underline" class="px-2 py-1 hover:bg-gray-200 rounded" title="밑줄">
                                    <u>U</u>
                                </button>
                                <div class="border-l border-gray-300 mx-1"></div>
                                <button type="button" data-action="format-text" data-command="insertUnorderedList" class="px-2 py-1 hover:bg-gray-200 rounded" title="목록">
                                    • 목록
                                </button>
                                <button type="button" data-action="format-text" data-command="insertOrderedList" class="px-2 py-1 hover:bg-gray-200 rounded" title="번호 목록">
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

                    <!-- 열람자 지정 (교수) / 공개 범위 안내 (학생) -->
                    ${currentUser.role === 'professor' ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-800 mb-2">열람자 지정 *</label>
                            <select id="postViewerType" class="w-full px-3 py-2 border border-gray-300 rounded-lg" onchange="toggleStudentSelection()">
                                <option value="all">전체 학생</option>
                                <option value="masters">석사과정만</option>
                                <option value="phd">박사과정만</option>
                                <option value="specific">개별 학생 선택</option>
                            </select>
                        </div>

                        <!-- 개별 학생 선택 -->
                        <div id="studentSelectionDiv" style="display: none;">
                            <label class="block text-sm font-medium text-gray-800 mb-2">학생 선택</label>
                            <div class="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                                ${students.map(student => `
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="selectedStudents" value="${student.id}" class="rounded">
                                        <span class="text-sm">${student.name} (${student.studentId}) - ${student.degree === 'master' ? '석사' : '박사'}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    ` : `
                        <input type="hidden" id="postViewerType" value="specific">
                        <div>
                            <label class="block text-sm font-medium text-gray-800 mb-2">공개 범위</label>
                            <p class="text-sm text-gray-600">이 글은 지도교수에게만 공개됩니다.</p>
                        </div>
                    `}

                    <!-- 파일 첨부 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2">파일 첨부</label>
                        <input type="file" id="postFiles" multiple class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <p class="text-xs text-gray-500 mt-1">최대 10개 파일, 각 50MB 이하</p>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-2 justify-end pt-4">
                        <button data-action="back-to-list" class="btn-cancel">취소</button>
                        <button data-action="submit-post" class="btn-primary">등록</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    setupFormEventListeners();
}

// 게시글 수정 폼
function renderBoardEditForm(postId) {
    const container = document.getElementById('boardContainer');
    if (!container) return;

    const post = DataService.getResourceBoard(postId);
    if (!post) {
        switchBoardView('list');
        return;
    }

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="px-6 py-3 border-b flex items-center justify-between">
                <button data-action="back-to-list" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
                <h3 class="text-lg font-bold text-gray-800">글 수정</h3>
                <div style="width: 120px;"></div>
            </div>

            <div class="p-6">
                <div class="space-y-4">
                    <!-- 제목 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2">제목 *</label>
                        <input type="text" id="postTitle" value="${post.title}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>

                    <!-- 내용 (리치 텍스트 에디터) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2">내용 *</label>
                        <div class="border border-gray-300 rounded-lg overflow-hidden">
                            <!-- 에디터 툴바 -->
                            <div class="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
                                <button type="button" data-action="format-text" data-command="bold" class="px-2 py-1 hover:bg-gray-200 rounded" title="굵게">
                                    <strong>B</strong>
                                </button>
                                <button type="button" data-action="format-text" data-command="italic" class="px-2 py-1 hover:bg-gray-200 rounded" title="기울임">
                                    <em>I</em>
                                </button>
                                <button type="button" data-action="format-text" data-command="underline" class="px-2 py-1 hover:bg-gray-200 rounded" title="밑줄">
                                    <u>U</u>
                                </button>
                                <div class="border-l border-gray-300 mx-1"></div>
                                <button type="button" data-action="format-text" data-command="insertUnorderedList" class="px-2 py-1 hover:bg-gray-200 rounded" title="목록">
                                    • 목록
                                </button>
                                <button type="button" data-action="format-text" data-command="insertOrderedList" class="px-2 py-1 hover:bg-gray-200 rounded" title="번호 목록">
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
                            <label class="block text-sm font-medium text-gray-800 mb-2">첨부된 파일</label>
                            <div class="space-y-2" id="existingFiles">
                                ${post.files.map(file => `
                                    <div class="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded" data-file-id="${file.id}">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                        </svg>
                                        <span class="flex-1">${file.name}</span>
                                        <span class="text-xs text-gray-500">${formatFileSize(file.size)}</span>
                                        <button type="button" class="text-red-600 hover:text-red-800 text-xs" onclick="removeExistingFile('${file.id}')">삭제</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- 새 파일 첨부 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-800 mb-2">파일 추가</label>
                        <input type="file" id="postFiles" multiple class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <p class="text-xs text-gray-500 mt-1">최대 10개 파일, 각 50MB 이하</p>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-2 justify-end pt-4">
                        <button data-action="back-to-list" class="btn-cancel">취소</button>
                        <button data-action="update-post" class="btn-primary">수정</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    setupFormEventListeners();
}

// 폼 이벤트 리스너 설정
function setupFormEventListeners() {
    // contenteditable placeholder 처리
    const editor = document.getElementById('postContent');
    if (editor) {
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

    // 열람자 설정
    let viewerType = 'specific';
    let viewers = [];

    if (currentUser.role === 'professor') {
        const viewerTypeSelect = document.getElementById('postViewerType');
        viewerType = viewerTypeSelect ? viewerTypeSelect.value : 'all';

        if (viewerType === 'specific') {
            const checkboxes = document.querySelectorAll('input[name="selectedStudents"]:checked');
            if (checkboxes.length === 0) {
                alert('열람할 학생을 선택해주세요.');
                return;
            }
            viewers = Array.from(checkboxes).map(cb => cb.value);
        } else if (viewerType === 'all') {
            // 전체 학생: viewers 빈 배열
            viewers = [];
        } else if (viewerType === 'masters' || viewerType === 'phd') {
            // 학위과정별: DataService에서 필터링하여 가져오기
            const allStudents = DataService.getStudents();
            const degreeKey = viewerType === 'masters' ? 'master' : 'phd';
            viewers = allStudents
                .filter(s => s.degree === degreeKey && s.advisor === currentUser.id)
                .map(s => s.id);
        }
    } else {
        // 학생 작성: 기존 로직 유지
        const student = DataService.getStudent(currentUser.id);
        viewerType = 'specific';
        viewers = student ? (student.advisors || [student.advisor]) : [];
    }

    // 파일 처리
    const files = [];
    if (filesInput.files.length > 0) {
        for (let i = 0; i < filesInput.files.length; i++) {
            const file = filesInput.files[i];
            files.push({
                id: `F${Date.now()}_${i}`,
                name: file.name,
                size: file.size,
                url: '#'
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
        viewerType: viewerType,
        viewers: viewers
    };

    const createdPost = DataService.createResourceBoard(postData);
    // 게시글 저장 완료

    switchBoardView('list');
    alert('게시글이 등록되었습니다.');
}

// 게시글 수정
function updateBoardPost(postId) {
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
        Array.from(existingFilesDiv.querySelectorAll('div[data-file-id]')).map(div => {
            const fileId = div.getAttribute('data-file-id');
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
        viewerType: post.viewerType,
        viewers: post.viewers,
        files: [...remainingFiles, ...newFiles]
    };

    DataService.updateResourceBoard(postId, postData);

    switchBoardView('detail', postId);
    alert('게시글이 수정되었습니다.');
}

// 게시글 삭제
function deleteBoardPost(postId) {
    if (!confirm('게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.')) {
        return;
    }

    DataService.deleteResourceBoard(postId);

    switchBoardView('list');
    alert('게시글이 삭제되었습니다.');
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

// 학생 선택 토글 (열람자 지정 드롭다운 변경 시)
function toggleStudentSelection() {
    const viewerType = document.getElementById('postViewerType');
    const studentSelectionDiv = document.getElementById('studentSelectionDiv');

    if (viewerType && studentSelectionDiv) {
        studentSelectionDiv.style.display = viewerType.value === 'specific' ? 'block' : 'none';
    }
}

// 전역으로 export
window.initBoard = initBoard;
window.renderBoardScreen = renderBoardScreen;
window.switchBoardView = switchBoardView;
window.renderBoardList = renderBoardList;
window.renderBoardDetail = renderBoardDetail;
window.renderBoardWriteForm = renderBoardWriteForm;
window.renderBoardEditForm = renderBoardEditForm;
window.setupFormEventListeners = setupFormEventListeners;
window.submitBoardPost = submitBoardPost;
window.updateBoardPost = updateBoardPost;
window.deleteBoardPost = deleteBoardPost;
window.formatText = formatText;
window.addComment = addComment;
window.deleteComment = deleteComment;
window.removeExistingFile = removeExistingFile;
window.toggleStudentSelection = toggleStudentSelection;

// 자료실 게시판 모듈 로드 완료
