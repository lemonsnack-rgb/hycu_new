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

// ==================== 미팅 관련 헬퍼 함수들 ====================

// 날짜의 요일 구하기
function getDayOfWeek(dateString) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    return days[date.getDay()];
}

// 종료 시간 계산
function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

// 오늘 날짜 (YYYY-MM-DD)
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// 시간 옵션 생성 (09:00 ~ 21:00, 30분 단위)
function generateTimeOptions() {
    const options = [];
    for (let h = 9; h <= 21; h++) {
        for (let m = 0; m < 60; m += 30) {
            const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            options.push(`<option value="${time}">${time}</option>`);
        }
    }
    return options.join('');
}

// 클립보드 복사
function copyToClipboard(text) {
    if (!text) {
        showNotification('복사할 내용이 없습니다', 'error');
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('클립보드에 복사되었습니다', 'success');
        }).catch(err => {
            console.error('복사 실패:', err);
            showNotification('복사 실패', 'error');
        });
    } else {
        // 구형 브라우저 fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showNotification('클립보드에 복사되었습니다', 'success');
        } catch (err) {
            console.error('복사 실패:', err);
            showNotification('복사 실패', 'error');
        }
        document.body.removeChild(textarea);
    }
}

// Zoom 열기
function openZoomMeeting(url) {
    if (!url) {
        showNotification('Zoom 링크가 없습니다', 'error');
        return;
    }
    window.open(url, '_blank');
}

function joinZoom(url) {
    openZoomMeeting(url);
}

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
}

// 로딩 표시
function showLoading(message) {
    // 기존 로딩이 있으면 제거
    hideLoading();

    const html = `
        <div id="loading-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                                          background: rgba(0,0,0,0.5); z-index: 9999;
                                          display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 0.5rem; text-align: center; min-width: 200px;">
                <div style="width: 40px; height: 40px; border: 4px solid #E5E7EB;
                            border-top-color: #3B82F6; border-radius: 50%;
                            animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="color: #374151; font-weight: 500;">${message || '처리 중...'}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) loading.remove();
}

// 알림 표시
function showNotification(message, type) {
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };

    const notifId = 'notif-' + Date.now();
    const html = `
        <div id="${notifId}" style="position: fixed; top: 1rem; right: 1rem;
                    background: ${colors[type] || colors.info};
                    color: white; padding: 1rem 1.5rem; border-radius: 0.5rem;
                    z-index: 10000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    animation: slideIn 0.3s ease-out;">
            ${message}
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    setTimeout(() => {
        const notif = document.getElementById(notifId);
        if (notif) {
            notif.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notif.remove(), 300);
        }
    }, 3000);
}

// 모달 닫기
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => modal.remove(), 200);
    }
}

// 모달 생성 헬퍼
function createModal(title, content, buttons) {
    const modalId = 'modal-' + Date.now();
    const buttonHtml = buttons ? buttons.map(btn => `
        <button onclick="${btn.onclick}" class="${btn.className}"
                style="flex: 1; padding: 0.75rem; border-radius: 0.375rem; font-weight: 600; border: none; cursor: pointer;">
            ${btn.text}
        </button>
    `).join('') : '';

    const html = `
        <div id="${modalId}" class="modal-overlay" onclick="event.target === this && closeModal('${modalId}')">
            <div class="modal-container" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button onclick="closeModal('${modalId}')" class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${buttonHtml ? `
                    <div style="display: flex; gap: 0.75rem; padding: 1.5rem; border-top: 1px solid #E5E7EB;">
                        ${buttonHtml}
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal(modalId);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Toast 메시지 (기존 시스템과 호환)
function showToast(message, type) {
    showNotification(message, type);
}

// ==================== 공지사항 렌더링 공통 함수 ====================
function renderNoticeList(userRole) {
    const notices = window.mockNotices || [];
    const rolePrefix = userRole === 'professor' ? 'prof' : userRole === 'student' ? 'student' : 'admin';
    const viewDetailFunc = `viewNoticeDetail${userRole === 'professor' ? 'Professor' : userRole === 'student' ? 'Student' : 'Admin'}`;
    const searchFunc = `searchNotices${userRole === 'professor' ? 'Professor' : userRole === 'student' ? 'Student' : ''}`;

    return `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 검색 영역 -->
            <div class="p-6 border-b">
                <div class="flex gap-3">
                    ${userRole === 'admin' ? `
                        <select id="notice-category-filter-${rolePrefix}" class="px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="">전체 카테고리</option>
                            <option value="important">중요</option>
                            <option value="general">일반</option>
                        </select>
                    ` : ''}
                    <input type="text" id="notice-search-${rolePrefix}" placeholder="제목 또는 내용 검색"
                           class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
                    <button onclick="${searchFunc}()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        검색
                    </button>
                    ${userRole === 'admin' ? '<button onclick="openNoticeModal()" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">+ 등록</button>' : ''}
                </div>
            </div>

            <!-- 공지사항 목록 -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">번호</th>
                            ${userRole === 'admin' ? '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">카테고리</th>' : ''}
                            ${userRole === 'admin' ? '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">고정</th>' : ''}
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">작성자</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">작성일</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">조회수</th>
                            ${userRole === 'admin' ? '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">관리</th>' : ''}
                        </tr>
                    </thead>
                    <tbody id="notice-list-${rolePrefix}" class="bg-white divide-y divide-gray-200">
                        ${notices.map((notice, index) => `
                            <tr class="hover:bg-gray-50 cursor-pointer" onclick="${viewDetailFunc}('${notice.id}')">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${notices.length - index}</td>
                                ${userRole === 'admin' ? `
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded ${notice.category === 'important' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                                            ${notice.category === 'important' ? '중요' : '일반'}
                                        </span>
                                    </td>
                                ` : ''}
                                ${userRole === 'admin' ? `
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        ${notice.isPinned ? '<span class="text-blue-600">📌</span>' : ''}
                                    </td>
                                ` : ''}
                                <td class="px-6 py-4 text-sm text-gray-900 font-medium td-truncate-long" title="${notice.title}">${notice.title}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${notice.authorName}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${notice.createdAt}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${notice.viewCount}</td>
                                ${userRole === 'admin' ? `
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="event.stopPropagation(); openNoticeModal('${notice.id}')" class="text-blue-600 hover:text-blue-900 mr-3">수정</button>
                                        <button onclick="event.stopPropagation(); deleteNotice('${notice.id}')" class="text-red-600 hover:text-red-900">삭제</button>
                                    </td>
                                ` : ''}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            ${notices.length === 0 ? `
                <div class="text-center py-12 text-gray-500">
                    <p>등록된 공지사항이 없습니다.</p>
                </div>
            ` : ''}
        </div>
    `;
}

// 공지사항 상세 보기 (공통)
function viewNoticeDetailCommon(noticeId) {
    const notice = (window.mockNotices || []).find(n => n.id === noticeId);
    if (!notice) {
        alert('공지사항을 찾을 수 없습니다.');
        return;
    }

    // HTML 태그 제거하여 표시
    const plainContent = notice.content.replace(/<[^>]*>/g, '');
    alert(`[${notice.title}]\n\n${plainContent}`);
}

// 안내문 화면 렌더링 (공통)
function renderGuideScreenCommon(screenId, targetScreenId) {
    const typeMap = {
        'ethics': 'ethics',
        'schedule': 'schedule',
        'process': 'procedure'
    };

    const type = typeMap[screenId];
    if (!type) return;

    const targetScreen = document.getElementById(targetScreenId);
    if (!targetScreen) return;

    // 공통 렌더링 함수 사용 (isAdmin = false)
    if (typeof window.renderGuideContent === 'function') {
        targetScreen.innerHTML = window.renderGuideContent(type, false);
    } else {
        targetScreen.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-8">
                <div class="text-center text-gray-500">
                    <p class="text-lg">콘텐츠를 불러올 수 없습니다.</p>
                </div>
            </div>
        `;
    }
}

console.log('✅ 공통 유틸리티 로드 완료');
