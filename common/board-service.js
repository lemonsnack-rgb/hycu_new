/**
 * 자료실 게시판 서비스
 * 교수-학생 관계 기반 접근 제어 제공
 */

const BoardService = {
    /**
     * 게시판 데이터 저장소
     */
    boards: [],
    comments: [],
    attachments: [],
    accessControl: [],

    /**
     * 초기 데이터 로드
     */
    init() {
        // Mock 데이터로 초기화 (실제로는 API에서 로드)
        this.loadMockData();
    },

    /**
     * Mock 데이터 로드
     */
    loadMockData() {
        this.boards = [
            {
                id: 1,
                title: '이번 주 미팅 일정 안내',
                content: '<p>11월 8일 (금) 오후 2시에 줌 미팅을 진행합니다.</p><p>미팅 전 첨부된 자료를 확인해주세요.</p>',
                authorId: 'P001',
                authorName: '김교수',
                authorType: 'professor',
                createdAt: '2025-11-05T10:00:00',
                updatedAt: '2025-11-05T10:00:00',
                viewCount: 15,
                accessType: 'all', // all, master, phd, selected
                allowedViewers: [], // 선택된 학생 ID 배열
                attachments: [1],
                isDeleted: false
            },
            {
                id: 2,
                title: '논문 작성 가이드라인',
                content: '<p>첨부 파일을 참고하여 논문을 작성해주세요.</p><ul><li>제목 페이지</li><li>초록</li><li>본문 구성</li></ul>',
                authorId: 'P001',
                authorName: '김교수',
                authorType: 'professor',
                createdAt: '2025-11-03T14:30:00',
                updatedAt: '2025-11-03T14:30:00',
                viewCount: 28,
                accessType: 'master',
                allowedViewers: [],
                attachments: [2, 3],
                isDeleted: false
            }
        ];

        this.comments = [
            {
                id: 1,
                boardId: 2,
                authorId: 'S001',
                authorName: '홍길동',
                authorType: 'student',
                content: '감사합니다! 잘 읽어보겠습니다.',
                createdAt: '2025-11-04T09:20:00',
                isDeleted: false
            }
        ];

        this.attachments = [
            {
                id: 1,
                boardId: 1,
                fileName: '미팅자료.pdf',
                fileSize: 1258291, // bytes
                fileUrl: '/uploads/meeting_material.pdf',
                uploadedAt: '2025-11-05T10:00:00'
            },
            {
                id: 2,
                boardId: 2,
                fileName: '논문작성가이드.docx',
                fileSize: 876544,
                fileUrl: '/uploads/thesis_guide.docx',
                uploadedAt: '2025-11-03T14:30:00'
            },
            {
                id: 3,
                boardId: 2,
                fileName: '참고논문.pdf',
                fileSize: 3565568,
                fileUrl: '/uploads/reference_paper.pdf',
                uploadedAt: '2025-11-03T14:30:00'
            }
        ];

        // 접근 제어 매핑 (교수-학생 관계)
        this.accessControl = [
            { professorId: 'P001', studentId: 'S001', studentName: '홍길동', degree: 'master' },
            { professorId: 'P001', studentId: 'S002', studentName: '김철수', degree: 'master' },
            { professorId: 'P001', studentId: 'S003', studentName: '이영희', degree: 'phd' },
            { professorId: 'P001', studentId: 'S004', studentName: '박민수', degree: 'phd' }
        ];
    },

    /**
     * 게시글 목록 조회 (접근 제어 적용)
     * @param {string} userId - 사용자 ID
     * @param {string} userType - 'professor' | 'student'
     * @param {Object} filters - 필터 옵션
     * @returns {Array} 게시글 목록
     */
    getPosts(userId, userType, filters = {}) {
        let posts = this.boards.filter(board => !board.isDeleted);

        // 접근 제어 필터링
        if (userType === 'professor') {
            // 교수: 본인이 작성한 글만 보임
            posts = posts.filter(board => board.authorId === userId);
        } else if (userType === 'student') {
            // 학생: 자신의 지도교수가 작성한 글 중 권한이 있는 글만
            const myProfessors = this.accessControl
                .filter(ac => ac.studentId === userId)
                .map(ac => ac.professorId);

            posts = posts.filter(board => {
                // 내 지도교수가 작성한 글인지 확인
                if (!myProfessors.includes(board.authorId)) {
                    return false;
                }

                // 접근 권한 확인
                return this.canAccess(board, userId, userType);
            });
        }

        // 정렬: 최신순
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // 첨부파일 정보 추가
        posts = posts.map(post => ({
            ...post,
            attachmentList: this.getAttachments(post.id),
            commentCount: this.getComments(post.id).length
        }));

        return posts;
    },

    /**
     * 게시글 접근 권한 확인
     */
    canAccess(board, userId, userType) {
        if (userType === 'professor') {
            return board.authorId === userId;
        }

        // 학생의 경우
        const studentInfo = this.accessControl.find(ac => ac.studentId === userId && ac.professorId === board.authorId);
        if (!studentInfo) return false;

        switch (board.accessType) {
            case 'all':
                return true;
            case 'master':
                return studentInfo.degree === 'master';
            case 'phd':
                return studentInfo.degree === 'phd';
            case 'selected':
                return board.allowedViewers.includes(userId);
            default:
                return false;
        }
    },

    /**
     * 게시글 상세 조회
     */
    getPost(postId, userId, userType) {
        const post = this.boards.find(b => b.id === postId && !b.isDeleted);
        if (!post) return null;

        // 접근 권한 확인
        if (!this.canAccess(post, userId, userType)) {
            return null;
        }

        // 조회수 증가
        post.viewCount++;

        return {
            ...post,
            attachmentList: this.getAttachments(postId),
            commentList: this.getComments(postId)
        };
    },

    /**
     * 게시글 생성
     */
    createPost(postData) {
        const newId = Math.max(...this.boards.map(b => b.id), 0) + 1;
        const now = new Date().toISOString();

        const newPost = {
            id: newId,
            title: postData.title,
            content: postData.content,
            authorId: postData.authorId,
            authorName: postData.authorName,
            authorType: postData.authorType,
            createdAt: now,
            updatedAt: now,
            viewCount: 0,
            accessType: postData.accessType || 'all',
            allowedViewers: postData.allowedViewers || [],
            attachments: [],
            isDeleted: false
        };

        this.boards.push(newPost);
        return newPost;
    },

    /**
     * 게시글 수정
     */
    updatePost(postId, updateData, userId) {
        const post = this.boards.find(b => b.id === postId && !b.isDeleted);
        if (!post || post.authorId !== userId) {
            return null;
        }

        Object.assign(post, {
            ...updateData,
            updatedAt: new Date().toISOString()
        });

        return post;
    },

    /**
     * 게시글 삭제 (소프트 삭제)
     */
    deletePost(postId, userId) {
        const post = this.boards.find(b => b.id === postId);
        if (!post || post.authorId !== userId) {
            return false;
        }

        post.isDeleted = true;
        return true;
    },

    /**
     * 댓글 목록 조회
     */
    getComments(boardId) {
        return this.comments
            .filter(c => c.boardId === boardId && !c.isDeleted)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },

    /**
     * 댓글 생성
     */
    createComment(commentData) {
        const newId = Math.max(...this.comments.map(c => c.id), 0) + 1;

        const newComment = {
            id: newId,
            boardId: commentData.boardId,
            authorId: commentData.authorId,
            authorName: commentData.authorName,
            authorType: commentData.authorType,
            content: commentData.content,
            createdAt: new Date().toISOString(),
            isDeleted: false
        };

        this.comments.push(newComment);
        return newComment;
    },

    /**
     * 댓글 삭제
     */
    deleteComment(commentId, userId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (!comment || comment.authorId !== userId) {
            return false;
        }

        comment.isDeleted = true;
        return true;
    },

    /**
     * 첨부파일 목록 조회
     */
    getAttachments(boardId) {
        return this.attachments.filter(a => a.boardId === boardId);
    },

    /**
     * 첨부파일 추가
     */
    addAttachment(attachmentData) {
        const newId = Math.max(...this.attachments.map(a => a.id), 0) + 1;

        const newAttachment = {
            id: newId,
            boardId: attachmentData.boardId,
            fileName: attachmentData.fileName,
            fileSize: attachmentData.fileSize,
            fileUrl: attachmentData.fileUrl,
            uploadedAt: new Date().toISOString()
        };

        this.attachments.push(newAttachment);
        return newAttachment;
    },

    /**
     * 교수의 지도학생 목록 조회
     */
    getMyStudents(professorId) {
        return this.accessControl
            .filter(ac => ac.professorId === professorId)
            .map(ac => ({
                studentId: ac.studentId,
                studentName: ac.studentName,
                degree: ac.degree
            }));
    },

    /**
     * 파일 크기 포맷
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * 날짜 포맷
     */
    formatDate(isoString) {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
};

// 초기화
BoardService.init();

// 전역으로 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoardService;
}
