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
        'guidance': initGuidance,
        'meeting': renderMeeting,
        'feedback': renderFeedback,
        'review': renderReview,
        'title-change': renderTitleChange,
        'board': () => initBoard('student'),
        'journal-submission': initJournalSubmission
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('학생용 논문 지도 시스템 초기화');
    showScreen('dashboard');
});
