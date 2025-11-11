// ===================================
// 애플리케이션 메인 로직
// ⚠️ 주의: SSO(Single Sign-On) 인증은 외부 시스템에서 처리됨
//         이 시스템은 인증 완료 후 접근 가능
// ===================================

// 현재 활성화된 화면
let currentScreen = 'dashboard';

// 화면 전환 함수
function showScreen(screenId) {
    // 모든 content-screen 숨기기
    document.querySelectorAll('.content-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // 선택한 화면만 표시
    const targetScreen = document.getElementById(screenId + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // 사이드바 메뉴 활성화 표시
        updateActiveMenu(screenId);
        
        // 화면별 초기화 함수 호출
        if (screenId === 'meeting') {
            // 랩미팅관리는 V2 함수 사용
            if (typeof initMeetingV2 === 'function') {
                initMeetingV2();
            }
        } else if (screenId === 'feedback') {
            // 온라인피드백 초기화
            if (typeof initFeedbackList === 'function') {
                initFeedbackList();
            }
        } else if (screenId === 'review') {
            // 심사관리 초기화
            if (typeof initReviewList === 'function') {
                initReviewList();
            }
        } else if (screenId === 'board') {
            // 게시판 초기화 (ID 32)
            if (typeof initBoard === 'function') {
                initBoard('professor');
            }
        } else if (screenId === 'journal-review') {
            // 학술지 심사 초기화 (ID 54-56)
            if (typeof renderJournalReview === 'function') {
                renderJournalReview();
            }
        } else {
            const initFunction = window[`init${capitalize(screenId)}`];
            if (initFunction) {
                initFunction();
            }
        }
        
        // URL 해시 업데이트 (선택사항)
        window.location.hash = screenId;
        
        // 모바일에서 메뉴 자동 닫기
        if (window.innerWidth < 768) {
            closeMobileMenu();
        }
    }
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (sidebar && overlay) {
        const isOpen = sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

// 모바일 메뉴 열기
function openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.add('mobile-open');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// 사이드바 메뉴 활성화 업데이트
function updateActiveMenu(screenId) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`.sidebar-link[data-screen="${screenId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
}

// 로그아웃 처리 (SSO 로그아웃으로 리다이렉트)
function handleLogout() {
    confirm('로그아웃하시겠습니까?', () => {
        // 실제 구현 시: SSO 로그아웃 페이지로 리다이렉트
        // window.location.href = 'https://sso.university.ac.kr/logout';
        
        // 프로토타입에서는 알림만 표시
        showToast('SSO 로그아웃 페이지로 이동합니다', 'info');
        
        // 실제로는 페이지 리로드하지 않고 SSO로 이동
        // location.reload();
    });
}

// 페이지 초기화
function initializePage() {
    console.log('페이지 초기화 시작');
    console.log('⚠️ SSO 인증 완료 가정 (외부 시스템에서 처리됨)');
    
    // 알림 배지 업데이트
    updateNotificationBadge();
    
    // 대시보드 초기화
    if (typeof initDashboard === 'function') {
        initDashboard();
    }
    
    // 사용자 메뉴 클릭 이벤트
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', toggleUserMenu);
    }
    
    // URL 해시로 초기 화면 설정
    if (window.location.hash) {
        const screenId = window.location.hash.substring(1);
        if (document.getElementById(screenId + '-screen')) {
            showScreen(screenId);
        }
    }
    
    console.log('페이지 초기화 완료');
}

// 탭 전환 함수
function switchTab(tabGroupId, tabId) {
    // 모든 탭 비활성화
    document.querySelectorAll(`#${tabGroupId} .tab`).forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll(`#${tabGroupId} ~ .tab-content`).forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택한 탭 활성화
    const selectedTab = document.querySelector(`#${tabGroupId} .tab[data-tab="${tabId}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // 선택한 탭 콘텐츠 표시
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
}

// 검색 입력 디바운스 적용
function setupSearchInput(inputId, searchFunction) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', debounce((e) => {
            searchFunction(e.target.value);
        }, 300));
    }
}

// 전역 에러 핸들러
window.addEventListener('error', (e) => {
    const msg = (e && (e.error && (e.error.stack || e.error.message))) || e.message || 'Unknown';
    console.error('전역 에러:', msg);
    showToast('오류가 발생했습니다. 페이지를 새로고침해주세요.', 'error');
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

// 뒤로가기/앞으로가기 처리
window.addEventListener('hashchange', () => {
    const screenId = window.location.hash.substring(1);
    if (screenId && document.getElementById(screenId + '-screen')) {
        showScreen(screenId);
    }
});

// 페이지 떠나기 전 경고 (필요 시)
window.addEventListener('beforeunload', (e) => {
    // 작성 중인 내용이 있는지 체크
    const hasUnsavedData = false; // 실제로는 상태 체크 로직 필요
    
    if (hasUnsavedData) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// 전역으로 export
window.showScreen = showScreen;
window.handleLogout = handleLogout;
window.switchTab = switchTab;
window.setupSearchInput = setupSearchInput;
window.currentScreen = currentScreen;
window.toggleMobileMenu = toggleMobileMenu;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
