// 앱 초기화 및 화면 전환

let currentScreen = 'dashboard';

// 화면 전환
function showScreen(screenName) {
    currentScreen = screenName;
    
    // 모든 화면 숨기기
    document.querySelectorAll('.content-screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    // 선택된 화면 표시
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.style.display = 'block';
    }
    
    // 사이드바 활성화 업데이트
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.screen === screenName) {
            link.classList.add('active');
        }
    });
    
    // 페이지 타이틀 업데이트
    const titles = {
        'dashboard': '대시보드',
        'advisor-assignment': '지도교수 배정 조회',
        'guidance': '주차별 논문지도 현황',
        'meeting': '미팅관리',
        'feedback': '온라인 피드백',
        'review': '심사 신청',
        'title-change': '논문제목 변경',
        'board': '자료실',
        'journal-submission': '학술지 대체 심사 신청'
    };

    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = titles[screenName] || screenName;
    }

    // 해당 화면 렌더링 함수 호출
    const renderFunctions = {
        'dashboard': renderDashboard,
        'advisor-assignment': initStudentAdvisorAssignment,
        'guidance': initGuidance,
        'meeting': renderMeeting,
        'feedback': renderFeedback,
        'review': renderReview,
        'title-change': renderTitleChange,
        'board': () => initBoard('student'),
        'journal-submission': initJournalSubmission,
        'ethics': () => renderGuideScreenStudent('ethics'),
        'schedule': () => renderGuideScreenStudent('schedule'),
        'process': () => renderGuideScreenStudent('process'),
        'notice': renderNoticeScreenStudent
    };

    if (renderFunctions[screenName]) {
        renderFunctions[screenName]();
    }
}

// 알림 드롭다운 토글
function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    const userMenu = document.getElementById('user-menu-dropdown');
    
    if (dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        dropdown.classList.toggle('hidden');
        
        // 사용자 메뉴는 닫기
        if (userMenu) {
            userMenu.classList.add('hidden');
        }
        
        // 외부 클릭 시 닫기
        if (isHidden) {
            setTimeout(() => {
                document.addEventListener('click', closeNotificationsOnOutsideClick);
            }, 100);
        }
    }
}

// 로그아웃
function logout() {
    if (confirm('로그아웃하시겠습니까?')) {
        alert('로그아웃되었습니다.');
        window.location.href = '../index.html';
    }
}

// 언어 전환
function switchLanguage() {
    // TODO: 다국어 지원 기능 구현 예정
    alert('다국어 지원 기능은 추후 제공될 예정입니다.');
}

// 안내문 화면 렌더링 (연구윤리, 논문일정, 논문지도절차)
function renderGuideScreenStudent(screenId) {
    const typeMap = {
        'ethics': 'ethics',
        'schedule': 'schedule',
        'process': 'procedure'
    };

    const type = typeMap[screenId];
    if (!type) return;

    const targetScreen = document.getElementById(screenId + '-screen');
    if (!targetScreen) return;

    // 공통 렌더링 함수 사용 (isAdmin = false, 학생은 편집 권한 없음)
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

// 공지사항 화면 렌더링
function renderNoticeScreenStudent() {
    const targetScreen = document.getElementById('notice-screen');
    if (!targetScreen) return;

    const notices = window.mockNotices || [];

    targetScreen.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="p-6 border-b">
                <h2 class="text-xl font-semibold text-gray-800">공지사항</h2>
                <p class="text-sm text-gray-600 mt-1">관리자가 등록한 공지사항을 조회합니다.</p>
            </div>

            <!-- 검색 영역 -->
            <div class="p-6 border-b">
                <div class="flex gap-3">
                    <select id="notice-category-filter-student" class="px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">전체 카테고리</option>
                        <option value="important">중요</option>
                        <option value="general">일반</option>
                    </select>
                    <input type="text" id="notice-search-student" placeholder="제목 또는 내용 검색"
                           class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
                    <button onclick="searchNoticesStudent()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        검색
                    </button>
                </div>
            </div>

            <!-- 공지사항 목록 -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">번호</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">카테고리</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">고정</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">작성자</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">작성일</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">조회수</th>
                        </tr>
                    </thead>
                    <tbody id="notice-list-student" class="bg-white divide-y divide-gray-200">
                        ${notices.map((notice, index) => `
                            <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewNoticeDetailStudent('${notice.id}')">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${notices.length - index}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs rounded ${notice.category === 'important' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                                        ${notice.category === 'important' ? '중요' : '일반'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    ${notice.isPinned ? '<span class="text-blue-600">📌</span>' : ''}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-900 font-medium">${notice.title}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${notice.authorName}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${notice.createdAt}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${notice.viewCount}</td>
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

// 공지사항 상세 보기 (학생용)
function viewNoticeDetailStudent(noticeId) {
    const notice = (window.mockNotices || []).find(n => n.id === noticeId);
    if (!notice) {
        alert('공지사항을 찾을 수 없습니다.');
        return;
    }

    // HTML 태그 제거하여 표시
    const plainContent = notice.content.replace(/<[^>]*>/g, '');
    alert(`[${notice.title}]\n\n${plainContent}`);
}

// 공지사항 검색 (학생용)
function searchNoticesStudent() {
    alert('검색 기능은 추후 구현 예정입니다.');
}

// 전역으로 노출
window.renderGuideScreenStudent = renderGuideScreenStudent;
window.renderNoticeScreenStudent = renderNoticeScreenStudent;
window.viewNoticeDetailStudent = viewNoticeDetailStudent;
window.searchNoticesStudent = searchNoticesStudent;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('학생용 논문 지도 시스템 초기화');
    showScreen('dashboard');
});
