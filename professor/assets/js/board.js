/**
 * ================================================================
 * 자료실 게시판
 * ================================================================
 * ID 32: 교수용 게시판
 * ID 57: 학생용 게시판
 * 
 * 기능:
 * - 지도교수별 게시판 분리
 * - 댓글 기능
 * - 파일 첨부
 * - 읽기 제한 설정 (전체/석사/박사/개별학생)
 */

// 게시판 데이터 (더미)
const boardData = {
    posts: [
        {
            id: 1,
            title: '이번 주 미팅 일정 안내',
            content: '11월 8일 (금) 오후 2시에 줌 미팅을 진행합니다.\n\n미팅 안건:\n1. 연구 진행상황 공유\n2. 논문 작성 가이드라인 설명\n3. Q&A 시간\n\n참석 필수입니다.',
            author: '김교수',
            authorRole: 'professor',
            date: '2024-11-05',
            files: [
                { name: '미팅자료.pdf', size: '1.2MB' }
            ],
            readRestriction: '전체',
            views: 15,
            comments: [
                { author: '홍길동', content: '확인했습니다!', date: '2024-11-05' }
            ]
        },
        {
            id: 2,
            title: '논문 작성 가이드라인',
            content: '첨부 파일을 참고하여 논문을 작성해주세요.\n\n주요 체크리스트:\n- 논문 형식 준수\n- 참고문헌 APA 스타일\n- 표절 검사 통과\n- 지도교수 검토 완료',
            author: '김교수',
            authorRole: 'professor',
            date: '2024-11-03',
            files: [
                { name: '논문작성가이드.docx', size: '856KB' },
                { name: '참고논문.pdf', size: '3.4MB' }
            ],
            readRestriction: '석사과정만',
            views: 28,
            comments: [
                { author: '홍길동', content: '감사합니다!', date: '2024-11-04' },
                { author: '김영희', content: '잘 읽었습니다.', date: '2024-11-04' }
            ]
        },
        {
            id: 3,
            title: '학술대회 참가 안내',
            content: '2024년 12월 15일 개최되는 한국교육공학회 학술대회에 참가하실 분은 11월 30일까지 신청해주세요.\n\n장소: 코엑스 3층\n참가비: 학생 5만원\n발표자 혜택: 참가비 면제',
            author: '김교수',
            authorRole: 'professor',
            date: '2024-11-01',
            files: [
                { name: '학술대회_안내문.pdf', size: '2.1MB' }
            ],
            readRestriction: '전체',
            views: 42,
            comments: []
        },
        {
            id: 4,
            title: '11월 세미나 발표자 모집',
            content: '매월 마지막 주 진행되는 랩 세미나의 11월 발표자를 모집합니다.\n\n발표 주제: 최근 연구 트렌드 또는 논문 리뷰\n발표 시간: 30분 (발표 20분 + Q&A 10분)\n신청: 댓글로 신청',
            author: '김교수',
            authorRole: 'professor',
            date: '2024-10-28',
            files: [],
            readRestriction: '전체',
            views: 35,
            comments: [
                { author: '박민수', content: '발표 신청합니다!', date: '2024-10-29' }
            ]
        },
        {
            id: 5,
            title: '연구실 청소 당번표',
            content: '이번 달 연구실 청소 당번표입니다.\n\n1주: 홍길동, 김영희\n2주: 박민수, 최서연\n3주: 이철수, 정다은\n4주: 강태형, 윤서영\n\n매주 금요일 오후 5시 청소 부탁드립니다.',
            author: '김교수',
            authorRole: 'professor',
            date: '2024-10-25',
            files: [],
            readRestriction: '전체',
            views: 51,
            comments: []
        }
    ]
};

// 게시판 초기화
function initBoard(userRole) {
    console.log('게시판 초기화:', userRole);
    renderBoardList(userRole);
}

// 게시판 목록 렌더링
function renderBoardList(userRole) {
    const container = document.getElementById('boardContainer');
    if (!container) return;
    
    const html = `
        <div class="bg-white rounded-lg shadow p-6">
            ${userRole === 'professor' ? `
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-gray-800">자료실</h2>
                    <button onclick="openBoardWriteModal()" class="btn-primary">
                        + 글쓰기
                    </button>
                </div>
            ` : `
                <h2 class="text-xl font-bold text-gray-800 mb-6">자료실</h2>
            `}
            
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
                            ${userRole === 'professor' ? '<th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">읽기제한</th>' : ''}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${boardData.posts.map((post, idx) => `
                            <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewBoardPost(${post.id})">
                                <td class="py-3 px-4 text-sm text-gray-800">${boardData.posts.length - idx}</td>
                                <td class="py-3 px-4 text-sm text-gray-800">
                                    ${post.title}
                                    ${post.comments.length > 0 ? `<span class="text-blue-600 ml-2">[${post.comments.length}]</span>` : ''}
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-800">${post.author}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${post.date}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">
                                    ${post.files.length > 0 ? `📎 ${post.files.length}` : ''}
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-600">${post.views}</td>
                                ${userRole === 'professor' ? `<td class="py-3 px-4 text-xs text-gray-600">${post.readRestriction}</td>` : ''}
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
    const post = boardData.posts.find(p => p.id === postId);
    if (!post) return;

    // 조회수 증가
    post.views++;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'boardPostModal';
    modal.style.cssText = 'position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 99999; display: flex; align-items: center; justify-content: center;';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 48rem; background: white; border-radius: 0.75rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); max-height: 90vh; overflow-y: auto;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-gray-800">${post.title}</h3>
                        <p class="text-sm text-gray-600 mt-2">
                            ${post.author} | ${post.date} | 조회 ${post.views}
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        ${post.authorRole === 'professor' ? `
                            <button onclick="openBoardEditModal(${post.id})" class="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded">수정</button>
                            <button onclick="deleteBoardPost(${post.id})" class="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded">삭제</button>
                        ` : ''}
                        <button onclick="closeBoardModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>
                </div>
            </div>

            <div class="p-6">
                <!-- 본문 -->
                <div class="prose max-w-none mb-6" style="white-space: pre-wrap; word-wrap: break-word;">
                    ${post.content.replace(/\n/g, '<br>')}
                </div>
                
                <!-- 첨부파일 -->
                ${post.files.length > 0 ? `
                    <div class="border-t border-gray-200 pt-4 mb-6">
                        <p class="text-sm font-semibold text-gray-700 mb-2">첨부파일</p>
                        <div class="space-y-2">
                            ${post.files.map(file => `
                                <div class="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                    </svg>
                                    <span>${file.name} (${file.size})</span>
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
                        ${post.comments.map(comment => `
                            <div class="bg-gray-50 p-3 rounded-lg">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-sm font-medium text-gray-800">${comment.author}</span>
                                    <span class="text-xs text-gray-500">${comment.date}</span>
                                </div>
                                <p class="text-sm text-gray-700">${comment.content}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 댓글 작성 -->
                    <div class="flex gap-2">
                        <input type="text" 
                               id="commentInput" 
                               placeholder="댓글을 입력하세요" 
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
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
    
    const post = boardData.posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            author: '현재사용자',
            content: content,
            date: new Date().toISOString().split('T')[0]
        });
        
        input.value = '';
        closeBoardModal();
        viewBoardPost(postId);
    }
}

// 게시글 작성 모달 (교수 전용)
function openBoardWriteModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'boardWriteModal';
    modal.style.cssText = 'position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 99999; display: flex; align-items: center; justify-content: center;';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 48rem; background: white; border-radius: 0.75rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); max-height: 90vh; overflow-y: auto;">
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
                        <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
                        <input type="text" id="postTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    
                    <!-- 내용 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
                        <textarea id="postContent" rows="8" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
                    </div>
                    
                    <!-- 읽기 제한 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">읽기 제한</label>
                        <select id="postRestriction" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="전체">전체</option>
                            <option value="석사과정만">석사과정만</option>
                            <option value="박사과정만">박사과정만</option>
                            <option value="개별학생">개별 학생 선택</option>
                        </select>
                    </div>
                    
                    <!-- 파일 첨부 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">파일 첨부</label>
                        <input type="file" multiple class="w-full px-3 py-2 border border-gray-300 rounded-lg">
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
}

// 게시글 등록
function submitBoardPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const restriction = document.getElementById('postRestriction').value;
    
    if (!title || !content) {
        alert('제목과 내용을 입력해주세요.');
        return;
    }
    
    boardData.posts.unshift({
        id: boardData.posts.length + 1,
        title: title,
        content: content,
        author: '김교수',
        authorRole: 'professor',
        date: new Date().toISOString().split('T')[0],
        files: [],
        readRestriction: restriction,
        views: 0,
        comments: []
    });
    
    closeBoardModal();
    renderBoardList('professor');
    alert('게시글이 등록되었습니다.');
}

// 게시글 수정 모달
function openBoardEditModal(postId) {
    const post = boardData.posts.find(p => p.id === postId);
    if (!post) return;

    closeBoardModal(); // 기존 모달 닫기

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'boardEditModal';
    modal.style.cssText = 'position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 99999; display: flex; align-items: center; justify-content: center;';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 48rem; background: white; border-radius: 0.75rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); max-height: 90vh; overflow-y: auto;">
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
                        <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
                        <input type="text" id="editPostTitle" value="${post.title}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>

                    <!-- 내용 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
                        <textarea id="editPostContent" rows="8" class="w-full px-3 py-2 border border-gray-300 rounded-lg">${post.content}</textarea>
                    </div>

                    <!-- 읽기 제한 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">읽기 제한</label>
                        <select id="editPostRestriction" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="전체" ${post.readRestriction === '전체' ? 'selected' : ''}>전체</option>
                            <option value="석사과정만" ${post.readRestriction === '석사과정만' ? 'selected' : ''}>석사과정만</option>
                            <option value="박사과정만" ${post.readRestriction === '박사과정만' ? 'selected' : ''}>박사과정만</option>
                            <option value="개별학생" ${post.readRestriction === '개별학생' ? 'selected' : ''}>개별 학생 선택</option>
                        </select>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-2 justify-end pt-4">
                        <button onclick="closeBoardModal()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">취소</button>
                        <button onclick="updateBoardPost(${post.id})" class="btn-primary">수정 완료</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// 게시글 수정 저장
function updateBoardPost(postId) {
    const title = document.getElementById('editPostTitle').value.trim();
    const content = document.getElementById('editPostContent').value.trim();
    const restriction = document.getElementById('editPostRestriction').value;

    if (!title || !content) {
        alert('제목과 내용을 입력해주세요.');
        return;
    }

    const post = boardData.posts.find(p => p.id === postId);
    if (post) {
        post.title = title;
        post.content = content;
        post.readRestriction = restriction;

        closeBoardModal();
        renderBoardList('professor');
        alert('게시글이 수정되었습니다.');
    }
}

// 게시글 삭제
function deleteBoardPost(postId) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }

    const index = boardData.posts.findIndex(p => p.id === postId);
    if (index > -1) {
        boardData.posts.splice(index, 1);
        closeBoardModal();
        renderBoardList('professor');
        alert('게시글이 삭제되었습니다.');
    }
}

// 모달 닫기
function closeBoardModal() {
    const modals = document.querySelectorAll('#boardPostModal, #boardWriteModal, #boardEditModal');
    modals.forEach(modal => modal.remove());
}

// Export functions
window.initBoard = initBoard;
window.renderBoardList = renderBoardList;
window.viewBoardPost = viewBoardPost;
window.addComment = addComment;
window.openBoardWriteModal = openBoardWriteModal;
window.submitBoardPost = submitBoardPost;
window.openBoardEditModal = openBoardEditModal;
window.updateBoardPost = updateBoardPost;
window.deleteBoardPost = deleteBoardPost;
window.closeBoardModal = closeBoardModal;

console.log('✅ 게시판 모듈 로드 완료');
