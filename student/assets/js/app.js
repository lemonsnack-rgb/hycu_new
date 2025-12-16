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
        'advisor-assignment': '지도교수 배정',
        'guidance': '주차별 논문지도 현황',
        'meeting': '실시간 지도 예약',
        'feedback': '논문 지도 현황',
        'review': '학위 논문 제출',
        'exam-schedule': '심사 일정 관리',
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
        'exam-schedule': renderExamSchedule,
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

// 공지사항 화면 렌더링 (공통 함수 사용)
function renderNoticeScreenStudent() {
    const targetScreen = document.getElementById('notice-screen');
    if (!targetScreen) return;

    // common-utils.js의 공통 함수 사용
    if (typeof renderNoticeList === 'function') {
        targetScreen.innerHTML = renderNoticeList('student');
    } else {
        console.error('renderNoticeList 함수를 찾을 수 없습니다.');
    }
}

// 공지사항 상세 보기 (학생용) - 공통 함수 호출
function viewNoticeDetailStudent(noticeId) {
    if (typeof viewNoticeDetailCommon === 'function') {
        viewNoticeDetailCommon(noticeId);
    } else {
        console.error('viewNoticeDetailCommon 함수를 찾을 수 없습니다.');
    }
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
