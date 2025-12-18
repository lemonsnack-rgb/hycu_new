// ===================================
// 애플리케이션 메인 로직
// ⚠️ 주의: SSO(Single Sign-On) 인증은 외부 시스템에서 처리됨
//         이 시스템은 인증 완료 후 접근 가능
// ===================================

// 현재 활성화된 화면
let currentScreen = 'dashboard';

// 화면별 브레드크럼 매핑
const breadcrumbMap = {
    'dashboard': [{ label: '홈', url: '#' }, { label: '대시보드' }],
    'notice': [{ label: '홈', url: '#' }, { label: '안내정보' }, { label: '공지사항' }],
    'board': [{ label: '홈', url: '#' }, { label: '안내정보' }, { label: '게시판' }],
    'ethics': [{ label: '홈', url: '#' }, { label: '안내정보' }, { label: '연구윤리' }],
    'schedule': [{ label: '홈', url: '#' }, { label: '안내정보' }, { label: '학사일정' }],
    'process': [{ label: '홈', url: '#' }, { label: '안내정보' }, { label: '학위수여절차' }],
    'advisor-assignment': [{ label: '홈', url: '#' }, { label: '논문 지도' }, { label: '지도교수 배정' }],
    'guidance': [{ label: '홈', url: '#' }, { label: '논문 지도' }, { label: '논문 지도 현황' }],
    'exam-schedule': [{ label: '홈', url: '#' }, { label: '논문 지도' }, { label: '심사 일정 관리' }],
    'meeting': [{ label: '홈', url: '#' }, { label: '논문 지도' }, { label: '랩미팅관리' }],
    'feedback': [{ label: '홈', url: '#' }, { label: '논문 지도' }, { label: '온라인피드백' }],
    'thesis-submission': [{ label: '홈', url: '#' }, { label: '논문 관리' }, { label: '논문 제출 현황' }],
    'thesis-format': [{ label: '홈', url: '#' }, { label: '논문 관리' }, { label: '논문 형식 검사' }],
    'journal-review': [{ label: '홈', url: '#' }, { label: '논문 관리' }, { label: '학술지 심사' }],
    'review': [{ label: '홈', url: '#' }, { label: '심사 관리' }, { label: '학위 논문 심사' }],
    'committee-assignment': [{ label: '홈', url: '#' }, { label: '심사 관리' }, { label: '심사위원 배정' }]
};

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

        // 브레드크럼 업데이트
        if (breadcrumbMap[screenId] && typeof updateBreadcrumb === 'function') {
            updateBreadcrumb(breadcrumbMap[screenId]);
        }

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
            if (typeof initJournalReview === 'function') {
                initJournalReview();
            }
        } else if (screenId === 'advisor-assignment') {
            // 지도교수 배정 초기화
            if (typeof initAdvisorAssignment === 'function') {
                initAdvisorAssignment();
            }
        } else if (screenId === 'exam-schedule') {
            // 심사 일정 관리 초기화 (읽기 전용)
            console.log('📋 exam-schedule 화면 전환 시도');
            console.log('renderExamScheduleScreen 타입:', typeof renderExamScheduleScreen);
            if (typeof renderExamScheduleScreen === 'function') {
                console.log('✅ renderExamScheduleScreen 함수 호출');
                renderExamScheduleScreen();
            } else {
                console.error('❌ renderExamScheduleScreen 함수를 찾을 수 없습니다');
            }
        } else if (screenId === 'ethics' || screenId === 'schedule' || screenId === 'process') {
            // 안내문 화면 렌더링 (공통 함수 사용)
            renderGuideScreen(screenId);
        } else if (screenId === 'notice') {
            // 공지사항 화면 렌더링
            renderNoticeScreen();
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

// 지도교수 배정 초기화
function initAdvisorAssignment() {
    // 현재 로그인한 교수 ID (Mock - 실제로는 세션에서 가져와야 함)
    const currentProfessorId = 'PROF001'; // 김교수

    // Mock 데이터 로드 확인
    if (typeof mockStudents === 'undefined' || typeof mockAdvisorAssignments === 'undefined' || typeof mockResearchProposals === 'undefined' || typeof mockProfessors === 'undefined' || typeof mockDepartments === 'undefined') {
        document.getElementById('professor-no-students').style.display = 'block';
        return;
    }

    // 학과 옵션 채우기
    const deptSelect = document.getElementById('prof-advisor-search-department');
    if (deptSelect && mockDepartments) {
        deptSelect.innerHTML = '<option value="">전체</option>' +
            mockDepartments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
    }

    // 데이터 렌더링
    renderProfessorAdvisorAssignmentTable();
}

// 교수용 지도교수 배정 테이블 렌더링
function renderProfessorAdvisorAssignmentTable(filteredData = null) {
    const currentProfessorId = 'PROF001';

    // 현재 교수가 지도하는 학생의 연구계획서 찾기
    const myAssignments = mockAdvisorAssignments.filter(a =>
        a.mainAdvisor?.id === currentProfessorId ||
        a.coAdvisors.some(co => co.id === currentProfessorId)
    );

    // 연구계획서와 학생 정보 결합
    let data = mockResearchProposals.map(proposal => {
        const assignment = myAssignments.find(a => a.studentId === proposal.studentId);
        if (!assignment) return null;

        const student = mockStudents.find(s => s.id === proposal.studentId);
        if (!student) return null;

        return {
            ...proposal,
            academicYear: student.academicYear,
            semesterCount: student.semesterCount,
            assignment: assignment
        };
    }).filter(item => item !== null);

    // 필터링된 데이터가 있으면 사용
    if (filteredData !== null) {
        data = filteredData;
    }

    const tableBody = document.getElementById('professor-student-list');
    const noStudentsDiv = document.getElementById('professor-no-students');

    // Null check: 요소가 없으면 함수 종료
    if (!tableBody || !noStudentsDiv) {
        console.warn('필요한 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    if (data.length === 0) {
        tableBody.innerHTML = '';
        noStudentsDiv.style.display = 'block';
        return;
    }

    noStudentsDiv.style.display = 'none';

    // 학생 목록 렌더링 (관리자와 동일한 구조, 행 클릭 시 상세 화면, 읽기 전용)
    tableBody.innerHTML = data.map(item => `
        <tr class="hover:bg-gray-50 cursor-pointer"
            onclick="viewProfessorProposalDetail('${item.id}')">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.academicYear}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.semesterCount}학기</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.studentNumber}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.department}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.studentName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-2 py-1 text-xs rounded ${item.degreeType === '석사' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">
                    ${item.degreeType}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${item.assignment && item.assignment.mainAdvisor
                    ? item.assignment.mainAdvisor.name
                    : '-'}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${item.assignment && item.assignment.coAdvisors.length > 0
                    ? item.assignment.coAdvisors.map(c => c.name).join(', ')
                    : '-'}
            </td>
        </tr>
    `).join('');
}

// 교수용 검색 기능
function searchProfessorAdvisorAssignment() {
    const currentProfessorId = 'PROF001';

    const year = document.getElementById('prof-advisor-search-year')?.value || '';
    const semester = document.getElementById('prof-advisor-search-semester')?.value || '';
    const semesterCount = document.getElementById('prof-advisor-search-semester-count')?.value || '';
    const department = document.getElementById('prof-advisor-search-department')?.value || '';
    const studentId = document.getElementById('prof-advisor-search-student-id')?.value || '';
    const studentName = document.getElementById('prof-advisor-search-student-name')?.value || '';

    // 현재 교수가 지도하는 학생의 연구계획서
    const myAssignments = mockAdvisorAssignments.filter(a =>
        a.mainAdvisor?.id === currentProfessorId ||
        a.coAdvisors.some(co => co.id === currentProfessorId)
    );

    const proposalsWithAssignment = mockResearchProposals.map(proposal => {
        const assignment = myAssignments.find(a => a.studentId === proposal.studentId);
        if (!assignment) return null;

        const student = mockStudents.find(s => s.id === proposal.studentId);
        if (!student) return null;

        return {
            ...proposal,
            academicYear: student.academicYear,
            semesterCount: student.semesterCount,
            assignment: assignment
        };
    }).filter(item => item !== null);

    const filteredData = proposalsWithAssignment.filter(item => {
        if (year && item.academicYear !== year) return false;
        if (semesterCount && item.semesterCount.toString() !== semesterCount) return false;
        if (department && item.department !== department) return false;
        if (studentId && !item.studentNumber.includes(studentId)) return false;
        if (studentName && !item.studentName.includes(studentName)) return false;
        return true;
    });

    renderProfessorAdvisorAssignmentTable(filteredData);
    alert(`검색 결과: ${filteredData.length}건`);
}

// 교수용 검색 초기화
function resetProfessorAdvisorSearch() {
    document.querySelectorAll('input[id^="prof-advisor-search"], select[id^="prof-advisor-search"]').forEach(field => {
        if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
        } else {
            field.value = '';
        }
    });
    renderProfessorAdvisorAssignmentTable();
    alert('검색 조건이 초기화되었습니다.');
}

// 목록으로 돌아가기 (HTML 구조 복원)
function returnToAdvisorAssignmentList() {
    const screen = document.getElementById('advisor-assignment-screen');
    if (!screen) return;

    // 원래 HTML 구조 복원
    screen.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="p-6 border-b">
                <h2 class="text-lg font-bold text-gray-800">지도교수 배정</h2>
                <p class="text-sm text-gray-600 mt-1">나의 지도 학생 목록을 조회합니다.</p>
            </div>

            <!-- 검색 옵션 (관리자 화면과 동일) -->
            <div class="p-6 border-b">
                <div class="search-container">
                    <div class="search-grid">
                        <!-- 1. 학년도 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학년도
                            </label>
                            <select id="prof-advisor-search-year" class="search-select">
                                <option value="">전체</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                        </div>

                        <!-- 2. 학기 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학기
                            </label>
                            <select id="prof-advisor-search-semester" class="search-select">
                                <option value="">전체</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                            </select>
                        </div>

                        <!-- 3. 학기차 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학기차
                            </label>
                            <input type="text" id="prof-advisor-search-semester-count" placeholder="학기차 입력"
                                   class="search-input">
                        </div>

                        <!-- 4. 학과 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학과
                            </label>
                            <select id="prof-advisor-search-department" class="search-select">
                                <option value="">전체</option>
                            </select>
                        </div>

                        <!-- 5. 학번 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학번
                            </label>
                            <input type="text" id="prof-advisor-search-student-id" placeholder="학번 입력"
                                   class="search-input">
                        </div>

                        <!-- 6. 이름 -->
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                이름
                            </label>
                            <input type="text" id="prof-advisor-search-student-name" placeholder="이름 입력"
                                   class="search-input">
                        </div>
                    </div>

                    <!-- 검색/초기화 버튼 -->
                    <div class="search-buttons">
                        <button onclick="searchProfessorAdvisorAssignment()" class="search-btn search-btn-primary">
                            <i class="fas fa-search"></i>검색
                        </button>
                        <button onclick="resetProfessorAdvisorSearch()" class="search-btn search-btn-secondary">
                            <i class="fas fa-redo"></i>초기화
                        </button>
                    </div>
                </div>
            </div>

            <!-- 학생 목록 테이블 -->
            <div class="p-6">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학년도</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학기차</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학과</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학위과정</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지도교수</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부지도교수</th>
                            </tr>
                        </thead>
                        <tbody id="professor-student-list" class="bg-white divide-y divide-gray-200">
                            <!-- JavaScript로 동적 생성 -->
                        </tbody>
                    </table>
                </div>

                <div id="professor-no-students" class="text-center py-8 text-gray-500" style="display: none;">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <p>지도 학생이 없습니다.</p>
                </div>
            </div>
        </div>
    `;

    // 초기화 호출하여 데이터 다시 로드
    initAdvisorAssignment();
}

// 교수용 연구계획서 상세 보기 (읽기 전용 - 페이지 전환)
function viewProfessorProposalDetail(proposalId) {
    console.log('연구계획서 상세 조회:', proposalId);

    const proposal = mockResearchProposals.find(p => p.id === proposalId);
    if (!proposal) {
        alert('연구계획서를 찾을 수 없습니다.');
        return;
    }

    const student = mockStudents.find(s => s.id === proposal.studentId);
    const assignment = mockAdvisorAssignments.find(a => a.studentId === proposal.studentId);

    // 상세 뷰 렌더링 (관리자 화면과 동일, 읽기 전용)
    const detailView = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 헤더 -->
            <div class="px-8 py-6 border-b border-gray-200">
                <div class="flex items-center justify-between mb-4">
                    <button onclick="returnToAdvisorAssignmentList(); return false;"
                            class="flex items-center text-gray-600 hover:text-gray-900">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        목록으로
                    </button>
                    <span class="px-3 py-1 rounded text-sm font-medium ${proposal.degreeType === '석사' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">
                        ${proposal.degreeType}
                    </span>
                </div>
                <h1 class="text-2xl font-bold text-gray-900">${proposal.title}</h1>
            </div>

            <!-- 학생 정보 -->
            <div class="px-8 py-6 border-b border-gray-200 bg-gray-50">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">학생 정보</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학번:</span>
                        <span class="text-gray-900">${student?.studentNumber}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">성명:</span>
                        <span class="text-gray-900">${student?.name}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학과:</span>
                        <span class="text-gray-900">${student?.department}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-gray-600 font-medium">학년:</span>
                        <span class="text-gray-900">${student?.grade}</span>
                    </div>
                </div>
            </div>

            <!-- 연구계획서 내용 -->
            <div class="px-8 py-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">연구계획서</h2>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 목적
                        </label>
                        <div class="px-4 py-3 bg-white border border-gray-300 rounded-b-lg">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.purpose}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 필요성
                        </label>
                        <div class="px-4 py-3 bg-white border border-gray-300 rounded-b-lg">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.necessity}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                            연구 문제 및 연구 방법
                        </label>
                        <div class="px-4 py-3 bg-white border border-gray-300 rounded-b-lg">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.method}</p>
                        </div>
                    </div>

                    ${proposal.desiredAdvisor ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-300 border-b-0">
                                희망 지도교수 (참고용)
                            </label>
                            <div class="px-4 py-3 bg-white border border-gray-300 rounded-b-lg">
                                <p class="text-gray-900">${proposal.desiredAdvisor.name} (${proposal.desiredAdvisor.department || '소속 정보 없음'})</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- 지도교수 배정 현황 (읽기 전용) -->
            <div class="px-8 py-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-900">지도교수 배정 현황</h2>
                </div>

                ${assignment ? `
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <span class="text-gray-600 font-medium" style="min-width: 100px;">지도교수:</span>
                            <span class="text-gray-900">
                                ${assignment.mainAdvisor
                                    ? `${assignment.mainAdvisor.name} ${assignment.mainAdvisor.department}`
                                    : `<span class="text-gray-500">미배정</span>`
                                }
                            </span>
                        </div>

                        <div class="flex items-center">
                            <span class="text-gray-600 font-medium" style="min-width: 100px;">부지도교수:</span>
                            <span class="text-gray-900">
                                ${assignment.coAdvisors && assignment.coAdvisors.length > 0
                                    ? assignment.coAdvisors.map(c => `${c.name} ${c.department}`).join(', ')
                                    : `<span class="text-gray-500">미배정</span>`
                                }
                            </span>
                        </div>
                    </div>
                ` : `
                    <p class="text-gray-500 text-center py-8">지도교수가 배정되지 않았습니다.</p>
                `}

                <!-- 읽기 전용 안내 -->
                <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-yellow-800">읽기 전용 모드</p>
                            <p class="text-xs text-yellow-700 mt-1">이 화면은 학생의 연구계획서를 조회하기 위한 읽기 전용 화면입니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // advisor-assignment-screen 영역 업데이트 (페이지 전환)
    const screen = document.getElementById('advisor-assignment-screen');
    if (screen) {
        screen.innerHTML = detailView;
    }
}

// 안내문 콘텐츠 렌더링 함수 (로컬 버전)
function renderGuideContentLocal(type) {
    // mockGuides에서 해당 타입의 가이드 찾기
    const guide = window.mockGuides ? window.mockGuides.find(g => g.type === type && g.isPublished) : null;

    const titleMap = {
        'ethics': '연구윤리',
        'schedule': '논문일정',
        'procedure': '논문지도절차'
    };

    return `
        <div class="bg-white rounded-lg shadow-md">
            <!-- Content -->
            <div class="p-8">
                ${guide?.content || '<p class="text-gray-500 text-center py-8">콘텐츠가 등록되지 않았습니다.</p>'}
            </div>
        </div>
    `;
}

// 안내문 화면 렌더링 (연구윤리, 논문일정, 논문지도절차)
function renderGuideScreen(screenId) {
    const typeMap = {
        'ethics': 'ethics',
        'schedule': 'schedule',
        'process': 'procedure'
    };

    const type = typeMap[screenId];
    if (!type) {
        console.error('renderGuideScreen: Invalid screenId', screenId);
        return;
    }

    const targetScreen = document.getElementById(screenId + '-screen');
    if (!targetScreen) {
        console.error('renderGuideScreen: Target screen not found', screenId + '-screen');
        return;
    }

    // mockGuides 확인
    if (!window.mockGuides) {
        console.error('mockGuides not found');
        targetScreen.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-8">
                <div class="text-center text-gray-500">
                    <p class="text-lg">콘텐츠 데이터를 불러올 수 없습니다.</p>
                </div>
            </div>
        `;
        return;
    }

    // 로컬 렌더링 함수 사용
    targetScreen.innerHTML = renderGuideContentLocal(type);
}

// 공지사항 화면 렌더링 (공통 함수 사용)
function renderNoticeScreen() {
    const targetScreen = document.getElementById('notice-screen');
    if (!targetScreen) return;

    // common-utils.js의 공통 함수 사용
    if (typeof renderNoticeList === 'function') {
        targetScreen.innerHTML = renderNoticeList('professor');
    } else {
        console.error('renderNoticeList 함수를 찾을 수 없습니다.');
    }
}

// 공지사항 상세 보기 (교수용) - 공통 함수 호출
function viewNoticeDetailProfessor(noticeId) {
    if (typeof viewNoticeDetailCommon === 'function') {
        viewNoticeDetailCommon(noticeId);
    } else {
        console.error('viewNoticeDetailCommon 함수를 찾을 수 없습니다.');
    }
}

// 공지사항 검색 (교수용)
function searchNoticesProfessor() {
    alert('검색 기능은 추후 구현 예정입니다.');
}

// 전역으로 export
window.showScreen = showScreen;
window.handleLogout = handleLogout;
window.initAdvisorAssignment = initAdvisorAssignment;
window.searchProfessorAdvisorAssignment = searchProfessorAdvisorAssignment;
window.resetProfessorAdvisorSearch = resetProfessorAdvisorSearch;
window.viewProfessorProposalDetail = viewProfessorProposalDetail;
window.returnToAdvisorAssignmentList = returnToAdvisorAssignmentList;
window.renderGuideScreen = renderGuideScreen;
window.renderNoticeScreen = renderNoticeScreen;
window.viewNoticeDetailProfessor = viewNoticeDetailProfessor;
window.searchNoticesProfessor = searchNoticesProfessor;
window.switchTab = switchTab;
window.setupSearchInput = setupSearchInput;
window.currentScreen = currentScreen;
window.toggleMobileMenu = toggleMobileMenu;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
