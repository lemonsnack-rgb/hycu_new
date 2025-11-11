/**
 * ================================================================
 * 공통 유틸리티 함수
 * ================================================================
 * ID 1-5: 공통 수정사항 적용
 */

// ==================== ID 1: 영문버전 전환 ====================
function switchLanguage() {
    const currentLang = localStorage.getItem('language') || 'ko';
    const newLang = currentLang === 'ko' ? 'en' : 'ko';
    
    if (confirm(`${newLang === 'en' ? 'Switch to English version?' : '한국어 버전으로 전환하시겠습니까?'}`)) {
        localStorage.setItem('language', newLang);
        alert('영문 버전은 준비 중입니다.\nEnglish version is coming soon.');
        // location.reload();
    }
}

// ==================== ID 2: 로그아웃 ====================
function logout() {
    if (confirm('로그아웃하시겠습니까?')) {
        // SSO 로그아웃 처리
        localStorage.clear();
        sessionStorage.clear();
        alert('로그아웃되었습니다.');
        window.location.href = '/login';
    }
}

// ==================== ID 3: 학생 정보조회 ====================
function showStudentInfo(studentId, studentName) {
    // 모달 생성
    const modal = document.createElement('div');
    modal.id = 'student-info-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 32rem; padding: 0;">
            <div style="padding: 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #1F2937;">학생 정보</h3>
                <button onclick="closeStudentInfoModal()" style="color: #9CA3AF; cursor: pointer; background: none; border: none; font-size: 1.5rem;">&times;</button>
            </div>
            <div style="padding: 1.5rem;">
                <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 4rem; height: 4rem; background-color: #E5E7EB; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <svg style="width: 2.5rem; height: 2.5rem; color: #6B7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <p style="font-size: 1.125rem; font-weight: 700; color: #1F2937;">${studentName}</p>
                            <p style="font-size: 0.875rem; color: #6B7280;">${studentId}</p>
                        </div>
                    </div>
                </div>
                
                <div id="student-info-loading" style="text-align: center; padding: 2rem; color: #6B7280;">
                    정보를 불러오는 중...
                </div>
                
                <div id="student-info-content" class="hidden">
                    <!-- 여기에 학생 정보가 로드됨 -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 학생 정보 로드 (실제 API 호출)
    loadStudentInfo(studentId);
}

function loadStudentInfo(studentId) {
    // TODO: 실제 API 호출
    // 임시 데이터
    setTimeout(() => {
        const studentInfo = {
            phone: '010-1234-5678',
            email: 'student@hycu.ac.kr',
            major: '컴퓨터공학',
            degree: '박사과정'
        };
        
        const content = document.getElementById('student-info-content');
        const loading = document.getElementById('student-info-loading');
        
        if (content && loading) {
            loading.classList.add('hidden');
            content.classList.remove('hidden');
            content.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <svg style="width: 1.25rem; height: 1.25rem; color: #6B7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <div>
                            <p style="font-size: 0.75rem; color: #6B7280;">전화번호</p>
                            <p style="font-size: 0.875rem; font-weight: 500; color: #1F2937;">${studentInfo.phone}</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <svg style="width: 1.25rem; height: 1.25rem; color: #6B7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <div>
                            <p style="font-size: 0.75rem; color: #6B7280;">이메일</p>
                            <p style="font-size: 0.875rem; font-weight: 500; color: #1F2937;">${studentInfo.email}</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <svg style="width: 1.25rem; height: 1.25rem; color: #6B7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <div>
                            <p style="font-size: 0.75rem; color: #6B7280;">전공 / 과정</p>
                            <p style="font-size: 0.875rem; font-weight: 500; color: #1F2937;">${studentInfo.major} / ${studentInfo.degree}</p>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
                    <a href="tel:${studentInfo.phone}" class="btn-primary" style="flex: 1; text-align: center; text-decoration: none;">전화하기</a>
                    <a href="mailto:${studentInfo.email}" class="btn-secondary" style="flex: 1; text-align: center; text-decoration: none;">이메일</a>
                </div>
            `;
        }
    }, 500);
}

function closeStudentInfoModal() {
    const modal = document.getElementById('student-info-modal');
    if (modal) {
        modal.remove();
    }
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    if (e.target.id === 'student-info-modal') {
        closeStudentInfoModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeStudentInfoModal();
    }
});

// ==================== ID 4: 레이블 규칙 통일 ====================
const COMMON_LABELS = {
    // 상태 레이블
    status: {
        pending: '대기',
        progress: '진행중',
        completed: '완료',
        approvalPending: '승인대기',
        approvalCompleted: '승인완료',
        approved: '승인',
        hold: '보류',
        rejected: '반려'
    },
    
    // 메뉴명
    menu: {
        dashboard: '대시보드',
        meeting: '미팅관리',  // ID 33, 60
        feedback: '온라인피드백',
        review: '심사관리',
        board: '자료실'  // ID 32, 57
    },
    
    // 용어
    terms: {
        comment: '첨삭',  // ID 43
        evaluation: '전체 평가',  // ID 43
        reply: '댓글',  // ID 43
        stage: '심사단계',
        action: '관리'  // 기존 '액션', '상세보기' 통일
    }
};

// ==================== ID 5: 취소/닫기 버튼 핸들러 ====================
function handleCancel(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        // 또는 modal.remove();
    }
    return false; // 기본 동작 방지
}

function handleClose(modalId) {
    return handleCancel(modalId);
}

// 모달창 취소 버튼에 적용
document.addEventListener('DOMContentLoaded', function() {
    // 모든 취소/닫기 버튼에 이벤트 리스너 추가
    document.querySelectorAll('[data-action="cancel"], [data-action="close"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 가장 가까운 모달 찾기
            const modal = this.closest('.modal-backdrop') || this.closest('[role="dialog"]');
            if (modal) {
                modal.classList.add('hidden');
                // 또는 modal.remove();
            }
        });
    });
});

// ==================== 헤더 유틸리티 HTML 생성 ====================
function createHeaderUtils(userName, userRole) {
    const roleText = {
        'admin': '관리자',
        'professor': '교수',
        'student': '학생'
    };
    
    return `
        <div class="header-utils">
            <!-- ID 1: 영문버전 -->
            <button onclick="switchLanguage()" title="Switch to English" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; color: #6B7280; border-radius: 0.5rem;">
                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
                <span style="font-size: 0.875rem; font-weight: 500;">EN</span>
            </button>
            
            <!-- 사용자 정보 -->
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background-color: #F9FAFB; border-radius: 0.5rem;">
                <div style="text-align: right;">
                    <p style="font-size: 0.875rem; font-weight: 600; color: #1F2937;">${userName}</p>
                    <p style="font-size: 0.75rem; color: #6B7280;">${roleText[userRole]}</p>
                </div>
                
                <!-- ID 2: 로그아웃 -->
                <button onclick="logout()" title="로그아웃" style="padding: 0.5rem; background: none; border: none; cursor: pointer; color: #6B7280; border-radius: 0.375rem;">
                    <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// ==================== 학생명에 정보 아이콘 추가 ====================
function addStudentInfoIcon(studentName, studentId) {
    return `
        <span>${studentName}</span>
        <span class="student-info-icon" onclick="showStudentInfo('${studentId}', '${studentName}')" title="학생 정보 조회">
            <svg style="width: 1rem; height: 1rem; display: inline-block; vertical-align: middle;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
        </span>
    `;
}

console.log('✅ 공통 유틸리티 로드 완료');
