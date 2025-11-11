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
        'meeting': '미팅관리',
        'feedback': '온라인 피드백',
        'review': '심사 신청',
        'title-change': '논문제목 변경',
        'board': '자료실'
    };
    
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = titles[screenName] || screenName;
    }
    
    // 해당 화면 렌더링 함수 호출
    const renderFunctions = {
        'dashboard': renderDashboard,
        'meeting': renderMeeting,
        'feedback': renderFeedback,
        'review': renderReview,
        'title-change': renderTitleChange,
        'board': () => initBoard('student')
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

// 사용자 메뉴 드롭다운 토글
function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu-dropdown');
    const dropdown = document.getElementById('notification-dropdown');
    
    if (userMenu) {
        const isHidden = userMenu.classList.contains('hidden');
        userMenu.classList.toggle('hidden');
        
        // 알림은 닫기
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
        
        // 외부 클릭 시 닫기
        if (isHidden) {
            setTimeout(() => {
                document.addEventListener('click', closeUserMenuOnOutsideClick);
            }, 100);
        }
    }
}

// 외부 클릭 시 알림 닫기
function closeNotificationsOnOutsideClick(event) {
    const dropdown = document.getElementById('notification-dropdown');
    const button = event.target.closest('.notification-btn, #notification-dropdown');
    
    if (!button && dropdown && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
        document.removeEventListener('click', closeNotificationsOnOutsideClick);
    }
}

// 외부 클릭 시 사용자 메뉴 닫기
function closeUserMenuOnOutsideClick(event) {
    const userMenu = document.getElementById('user-menu-dropdown');
    const button = event.target.closest('.user-profile, #user-menu-dropdown');
    
    if (!button && userMenu && !userMenu.classList.contains('hidden')) {
        userMenu.classList.add('hidden');
        document.removeEventListener('click', closeUserMenuOnOutsideClick);
    }
}

// 로그아웃
function logout() {
    if (confirm('로그아웃하시겠습니까?')) {
        alert('로그아웃되었습니다.');
        // 실제로는 로그인 페이지로 이동
        // window.location.href = '/login';
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('학생용 논문 지도 시스템 초기화');
    showScreen('dashboard');
});
