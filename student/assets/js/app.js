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

// 학생용 지도교수 배정 조회 초기화
function initStudentAdvisorAssignment() {
    // 현재 로그인한 학생 ID (Mock - 실제로는 세션에서 가져와야 함)
    const currentStudentId = 'STU001'; // 김학생

    // Mock 데이터 로드 확인
    if (typeof mockStudents === 'undefined' || typeof mockAdvisorAssignments === 'undefined' || typeof mockProfessors === 'undefined') {
        document.getElementById('student-no-advisor').style.display = 'block';
        document.getElementById('student-no-advisor').querySelector('p').textContent = 'Mock 데이터가 로드되지 않았습니다.';
        return;
    }

    // 현재 학생의 배정 정보 찾기
    const myAssignment = mockAdvisorAssignments.find(a => a.studentId === currentStudentId);
    const contentDiv = document.getElementById('student-advisor-content');
    const noAdvisorDiv = document.getElementById('student-no-advisor');

    if (!myAssignment || (!myAssignment.mainAdvisor && myAssignment.coAdvisors.length === 0)) {
        contentDiv.innerHTML = '';
        noAdvisorDiv.style.display = 'block';
        return;
    }

    noAdvisorDiv.style.display = 'none';

    // 지도교수 카드 렌더링
    let cardsHTML = '';

    if (myAssignment.mainAdvisor) {
        const prof = mockProfessors.find(p => p.id === myAssignment.mainAdvisor.id);
        if (prof) {
            cardsHTML += `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${prof.name} 교수</h3>
                            <span class="text-sm text-blue-600 font-medium">주지도교수</span>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            ${prof.department}
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            ${prof.email}
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            ${prof.phone}
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                        배정일: ${myAssignment.assignedDate}
                    </div>
                </div>
            `;
        }
    }

    if (myAssignment.coAdvisors && myAssignment.coAdvisors.length > 0) {
        myAssignment.coAdvisors.forEach(coAdvisor => {
            const prof = mockProfessors.find(p => p.id === coAdvisor.id);
            if (prof) {
                cardsHTML += `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800">${prof.name} 교수</h3>
                                <span class="text-sm text-purple-600 font-medium">부지도교수</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                ${prof.department}
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                ${prof.email}
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                ${prof.phone}
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                            배정일: ${myAssignment.assignedDate}
                        </div>
                    </div>
                `;
            }
        });
    }

    contentDiv.innerHTML = cardsHTML;
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('학생용 논문 지도 시스템 초기화');
    showScreen('dashboard');
});
