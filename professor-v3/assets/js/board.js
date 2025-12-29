/**
 * ================================================================
 * 자료실 게시판 (Enhanced Version)
 * ================================================================
 * ID 32: 교수용 게시판
 * ID 57: 학생용 게시판
 *
 * 기능:
 * - 지도교수별 게시판 분리
 * - 리치 텍스트 에디터
 * - 파일 첨부 및 다운로드
 * - 열람자 지정 (전체/석사/박사/개별학생)
 * - 게시글 수정/삭제
 * - 댓글 기능
 * - 권한별 접근 제어
 */

// 현재 사용자 정보 (실제로는 세션에서 가져옴)
let currentUser = {
    role: 'professor', // 'professor' or 'student'
    id: 'P001',
    name: '김교수'
};

// 게시판 초기화
function initBoard(userRole, userId = null) {
    console.log('게시판 초기화:', userRole);

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

    renderBoardList();
}

// 게시판 목록 렌더링
function renderBoardList() {
    console.log('📋 게시판 목록 렌더링 시작');
    const container = document.getElementById('boardContainer');
    if (!container) {
        console.error('❌ boardContainer 요소를 찾을 수 없음');
        return;
    }

    const posts = DataService.getResourceBoards(currentUser.role, currentUser.id);
    console.log('조회된 게시글 수:', posts.length);

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 테이블 컨테이너 -->
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">자료실 목록</h3>
                        <span class="table-count">(총 ${posts.length}건)</span>
                    </div>
                    <div class="table-header-right">
                        <button onclick="openBoardWriteModal()" class="btn btn-primary btn-sm">
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
                                        게시글이 없습니다.
                                    </td>
                                </tr>
                            ` : posts.map((post, idx) => `
                                <tr class="cursor-pointer" onclick="viewBoardPost(${post.id})">
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
function viewBoardPost(postId) {
    const post = DataService.getResourceBoard(postId);
    if (!post) return;

    // 조회수 증가
    DataService.incrementResourceBoardViews(postId);

    const isAuthor = post.authorId === currentUser.id;
    const canEdit = isAuthor;
    const canDelete = isAuthor;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'boardPostModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 80rem; width: 95%;">
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
                        ${canEdit ? `<button onclick="openBoardEditModal(${post.id})" class="text-sm text-[#6A0028] hover:text-[#6A0028]">수정</button>` : ''}
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
                                            ${isCommentAuthor ? `<button onclick="deleteComment(${post.id}, '${comment.id}')" class="text-xs text-red-600 hover:text-red-800">삭제</button>` : ''}
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
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                               onkeypress="if(event.key==='Enter') addComment(${post.id})">
                        <button onclick="addComment(${post.id})" class="btn-primary">등록</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
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
    closeBoardModal();
    viewBoardPost(postId);
}

// 댓글 삭제
function deleteComment(postId, commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    DataService.deleteResourceBoardComment(postId, commentId);
    closeBoardModal();
    viewBoardPost(postId);
}

// 게시글 작성 모달
function openBoardWriteModal() {
    console.log('📝 글쓰기 모달 열기 시작');
    console.log('현재 사용자:', currentUser);

    const students = DataService.getStudents();
    console.log('학생 목록:', students);

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'boardWriteModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 80rem; width: 95%;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800">글쓰기</h3>
                    <button onclick="closeBoardModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
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

                    <!-- 열람자 지정 -->
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
                        <button onclick="closeBoardModal()" class="btn-cancel">취소</button>
                        <button onclick="submitBoardPost()" class="btn-primary">등록</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    console.log('모달 DOM 생성 완료, body에 추가 시작');
    document.body.appendChild(modal);
    console.log('✅ 모달이 body에 추가됨');

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
    const post = DataService.getResourceBoard(postId);
    if (!post) return;

    const students = DataService.getStudents();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'boardEditModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 80rem; width: 95%;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800">글 수정</h3>
                    <button onclick="closeBoardModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
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

                    <!-- 열람자 지정 -->
                    ${post.authorRole === 'professor' ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-800 mb-2">열람자 지정 *</label>
                            <select id="postViewerType" class="w-full px-3 py-2 border border-gray-300 rounded-lg" onchange="toggleStudentSelection()">
                                <option value="all" ${post.viewerType === 'all' ? 'selected' : ''}>전체 학생</option>
                                <option value="masters" ${post.viewerType === 'masters' ? 'selected' : ''}>석사과정만</option>
                                <option value="phd" ${post.viewerType === 'phd' ? 'selected' : ''}>박사과정만</option>
                                <option value="specific" ${post.viewerType === 'specific' ? 'selected' : ''}>개별 학생 선택</option>
                            </select>
                        </div>

                        <!-- 개별 학생 선택 -->
                        <div id="studentSelectionDiv" style="display: ${post.viewerType === 'specific' ? 'block' : 'none'};">
                            <label class="block text-sm font-medium text-gray-800 mb-2">학생 선택</label>
                            <div class="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                                ${students.map(student => `
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox"
                                               name="selectedStudents"
                                               value="${student.id}"
                                               ${post.viewers.includes(student.id) ? 'checked' : ''}
                                               class="rounded">
                                        <span class="text-sm">${student.name} (${student.studentId}) - ${student.degree === 'master' ? '석사' : '박사'}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    ` : `
                        <input type="hidden" id="postViewerType" value="specific">
                    `}

                    <!-- 기존 파일 -->
                    ${post.files.length > 0 ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-800 mb-2">첨부된 파일</label>
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
                        <label class="block text-sm font-medium text-gray-800 mb-2">파일 추가</label>
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

// 학생 선택 토글
function toggleStudentSelection() {
    const viewerType = document.getElementById('postViewerType').value;
    const studentSelectionDiv = document.getElementById('studentSelectionDiv');

    if (studentSelectionDiv) {
        studentSelectionDiv.style.display = viewerType === 'specific' ? 'block' : 'none';
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
    const viewerType = document.getElementById('postViewerType').value;
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
    let viewers = [];
    if (currentUser.role === 'professor') {
        if (viewerType === 'specific') {
            const checkboxes = document.querySelectorAll('input[name="selectedStudents"]:checked');
            if (checkboxes.length === 0) {
                alert('열람할 학생을 선택해주세요.');
                return;
            }
            viewers = Array.from(checkboxes).map(cb => cb.value);
        }
    } else {
        // 학생이 작성하는 경우, 모든 지도교수에게 공개 (n:m 관계 지원)
        const student = DataService.getStudent(currentUser.id);
        if (student) {
            viewers = student.advisors || [student.advisor];
        }
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
        viewerType: viewerType,
        viewers: viewers
    };

    const createdPost = DataService.createResourceBoard(postData);
    console.log('✅ 게시글 저장 완료:', createdPost);

    closeBoardModal();
    renderBoardList();
    alert('게시글이 등록되었습니다.');
}

// 게시글 수정
function updateBoardPost(postId) {
    const title = document.getElementById('postTitle').value.trim();
    const contentDiv = document.getElementById('postContent');
    const content = contentDiv.innerHTML.trim();
    const viewerType = document.getElementById('postViewerType').value;
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

    // 열람자 설정
    let viewers = post.viewers;
    if (currentUser.role === 'professor' && viewerType === 'specific') {
        const checkboxes = document.querySelectorAll('input[name="selectedStudents"]:checked');
        if (checkboxes.length === 0) {
            alert('열람할 학생을 선택해주세요.');
            return;
        }
        viewers = Array.from(checkboxes).map(cb => cb.value);
    }

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
        viewerType: viewerType,
        viewers: viewers,
        files: [...remainingFiles, ...newFiles]
    };

    DataService.updateResourceBoard(postId, postData);

    closeBoardModal();
    renderBoardList();
    alert('게시글이 수정되었습니다.');
}

// 게시글 삭제
function deleteBoardPost(postId) {
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

// 전역으로 export
window.initBoard = initBoard;
window.renderBoardList = renderBoardList;
window.openBoardWriteModal = openBoardWriteModal;
window.openBoardEditModal = openBoardEditModal;
window.viewBoardPost = viewBoardPost;
window.submitBoardPost = submitBoardPost;
window.updateBoardPost = updateBoardPost;
window.deleteBoardPost = deleteBoardPost;
window.closeBoardModal = closeBoardModal;
window.formatText = formatText;
window.toggleStudentSelection = toggleStudentSelection;
window.addComment = addComment;
window.deleteComment = deleteComment;
window.removeExistingFile = removeExistingFile;

console.log('✅ 자료실 게시판 모듈 로드 완료 (Enhanced Version)');
