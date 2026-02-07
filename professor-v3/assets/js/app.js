// ===================================
// 애플리케이션 메인 로직
// ⚠️ 주의: SSO(Single Sign-On) 인증은 외부 시스템에서 처리됨
//         이 시스템은 인증 완료 후 접근 가능
// ===================================

// 현재 활성화된 화면
let currentScreen = 'dashboard';

// 화면별 브레드크럼 매핑 (실제 사이드바 메뉴 구조에 맞춤)
const breadcrumbMap = {
    'dashboard': [{ label: '홈', url: '#' }, { label: '대시보드' }],
    // 논문 안내
    'notice': [{ label: '홈', url: '#' }, { label: '논문 안내' }, { label: '행정공지사항' }],
    'board': [{ label: '홈', url: '#' }, { label: '논문지도' }, { label: '논문지도공지 및 자료' }],
    'ethics': [{ label: '홈', url: '#' }, { label: '논문 안내' }, { label: '연구윤리' }],
    'schedule': [{ label: '홈', url: '#' }, { label: '논문 안내' }, { label: '논문일정' }],
    'process': [{ label: '홈', url: '#' }, { label: '논문 안내' }, { label: '논문지도절차' }],
    // 논문지도
    'advisor-assignment': [{ label: '홈', url: '#' }, { label: '논문지도' }, { label: '지도교수 배정' }],
    'guidance': [{ label: '홈', url: '#' }, { label: '논문지도' }, { label: '주차별 논문지도 현황' }],
    'feedback': [{ label: '홈', url: '#' }, { label: '논문지도' }, { label: '논문 지도 활동' }],
    'meeting': [{ label: '홈', url: '#' }, { label: '논문지도' }, { label: '실시간 지도 예약' }],
    // 논문 심사
    'exam-schedule': [{ label: '홈', url: '#' }, { label: '논문 심사' }, { label: '심사 일정 관리' }],
    'review': [{ label: '홈', url: '#' }, { label: '논문 심사' }, { label: '학위 논문 심사' }],
    'journal-review': [{ label: '홈', url: '#' }, { label: '논문 심사' }, { label: '학술지 논문 심사' }]
};

// 화면 전환 함수
function showScreen(screenId) {
    // 피드백 상세 화면이 열려있으면 닫기
    const feedbackDetailScreen = document.getElementById('feedback-detail-screen');
    if (feedbackDetailScreen && typeof closeFeedbackDetailScreen === 'function') {
        closeFeedbackDetailScreen();
    }

    // 심사 상세 화면이 열려있으면 닫기
    const reviewDetailScreen = document.getElementById('review-detail-screen');
    if (reviewDetailScreen && typeof closeReviewDetailScreen === 'function') {
        closeReviewDetailScreen();
    }

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
            if (typeof renderExamScheduleScreen === 'function') {
                renderExamScheduleScreen();
            } else {
                console.error('renderExamScheduleScreen 함수를 찾을 수 없습니다');
            }
        } else if (screenId === 'guidance') {
            // ✨ 주차별 논문지도 현황 초기화 (새로운 weekly-guidance.js 사용)
            if (typeof initProfessorWeeklyGuidance === 'function') {
                initProfessorWeeklyGuidance();
            } else {
                // initProfessorWeeklyGuidance not found
            }
        } else if (screenId === 'ethics') {
            // 연구윤리 화면 렌더링
            if (typeof initProfessorEthics === 'function') {
                initProfessorEthics();
            } else {
                // initProfessorEthics not found
            }
        } else if (screenId === 'schedule') {
            // 논문일정 화면 렌더링
            if (typeof initProfessorSchedule === 'function') {
                initProfessorSchedule();
            } else {
                // initProfessorSchedule not found
            }
        } else if (screenId === 'process') {
            // 논문지도절차 화면 렌더링
            if (typeof initProfessorProcedure === 'function') {
                initProfessorProcedure();
            } else {
                // initProfessorProcedure not found
            }
        } else if (screenId === 'notice') {
            // 공지사항 화면 렌더링
            if (typeof initProfessorNotice === 'function') {
                initProfessorNotice();
            } else {
                // initProfessorNotice not found
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

    // 총 건수 업데이트
    const countElement = document.getElementById('professor-student-count');
    if (countElement) {
        countElement.textContent = `(총 ${data.length}건)`;
    }

    if (data.length === 0) {
        tableBody.innerHTML = '';
        noStudentsDiv.style.display = 'block';
        return;
    }

    noStudentsDiv.style.display = 'none';

    // 학생 목록 렌더링 (관리자와 동일한 구조, 행 클릭 시 상세 화면, 읽기 전용)
    tableBody.innerHTML = data.map((item, index) => {
        const student = mockStudents.find(s => s.id === item.studentId);
        const studentStatus = student ? student.status : '-';
        const assignmentStatus = (item.assignment && item.assignment.mainAdvisor) ? '배정완료' : '미배정';

        // 대학구분, 계열/대학원, 학부(과)전공은 임시로 '-' 처리 (추후 데이터 모델에 추가 필요)
        const collegeType = item.collegeType || '-';
        const graduate = item.graduate || '-';
        const majorCategory = item.majorCategory || '-';

        return `
        <tr class="hover:bg-gray-50 cursor-pointer"
            onclick="viewProfessorProposalDetail('${item.id}')">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.academicYear}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.semesterCount}학기</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${collegeType}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${graduate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${majorCategory}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.department}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${item.degreeType}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${studentStatus}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${assignmentStatus}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.studentNumber}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.studentName}</td>
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
        `;
    }).join('');
}

// 교수용 검색 기능
function searchProfessorAdvisorAssignment() {
    const currentProfessorId = 'PROF001';

    const year = document.getElementById('prof-advisor-search-year')?.value || '';
    const semester = document.getElementById('prof-advisor-search-semester')?.value || '';
    const collegeType = document.getElementById('prof-advisor-search-college-type')?.value || '';
    const graduate = document.getElementById('prof-advisor-search-graduate')?.value || '';
    const majorCategory = document.getElementById('prof-advisor-search-major-category')?.value || '';
    const department = document.getElementById('prof-advisor-search-department')?.value || '';
    const degree = document.getElementById('prof-advisor-search-degree')?.value || '';
    const status = document.getElementById('prof-advisor-search-status')?.value || '';
    const assignment = document.getElementById('prof-advisor-search-assignment')?.value || '';
    const studentId = document.getElementById('prof-advisor-search-student-id')?.value || '';
    const studentName = document.getElementById('prof-advisor-search-student-name')?.value || '';
    const advisorName = document.getElementById('prof-advisor-search-advisor')?.value || '';

    // 현재 교수가 지도하는 학생의 연구계획서
    const myAssignments = mockAdvisorAssignments.filter(a =>
        a.mainAdvisor?.id === currentProfessorId ||
        a.coAdvisors.some(co => co.id === currentProfessorId)
    );

    const proposalsWithAssignment = mockResearchProposals.map(proposal => {
        const assignmentData = myAssignments.find(a => a.studentId === proposal.studentId);
        if (!assignmentData) return null;

        const student = mockStudents.find(s => s.id === proposal.studentId);
        if (!student) return null;

        return {
            ...proposal,
            academicYear: student.academicYear,
            semesterCount: student.semesterCount,
            assignment: assignmentData,
            student: student
        };
    }).filter(item => item !== null);

    const filteredData = proposalsWithAssignment.filter(item => {
        if (year && item.academicYear !== year) return false;
        if (semester && item.student?.currentSemester !== parseInt(semester)) return false;
        if (department && item.department !== department) return false;
        if (degree && item.degreeType !== degree) return false;
        if (status && item.student?.status !== status) return false;
        if (assignment) {
            const isAssigned = item.assignment?.mainAdvisor ? '배정완료' : '미배정';
            if (assignment !== isAssigned) return false;
        }
        if (studentId && !item.studentNumber.includes(studentId)) return false;
        if (studentName && !item.studentName.includes(studentName)) return false;
        if (advisorName) {
            const mainAdvisorName = item.assignment?.mainAdvisor?.name || '';
            if (!mainAdvisorName.includes(advisorName)) return false;
        }
        return true;
    });

    renderProfessorAdvisorAssignmentTable(filteredData);
    alert(`검색 결과: ${filteredData.length}건`);
}

// 목록으로 돌아가기
function returnToAdvisorAssignmentList() {
    // 목록 뷰 표시, 상세 뷰 숨김
    document.getElementById('advisor-assignment-list-view').style.display = 'block';
    document.getElementById('advisor-assignment-detail-view').style.display = 'none';
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

    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById('advisor-assignment-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 모달 생성
    const modal = document.createElement('div');
    modal.id = 'advisor-assignment-modal';
    modal.className = 'feedback-detail-screen';
    modal.style.zIndex = '9999';

    modal.innerHTML = `
        <div class="feedback-detail-content" style="max-width: 1400px;">
            <!-- 헤더: 연구계획서 정보 -->
            <div class="px-6 py-3 border-b bg-white">
                <div class="flex items-center justify-between">
                    <!-- 좌측: 연구계획서 핵심 정보 -->
                    <div class="text-xs text-gray-700 flex-1 mr-4">
                        <span class="font-semibold">연구 제목:</span>
                        <span title="${proposal.title}">${proposal.title && proposal.title.length > 40 ? proposal.title.substring(0, 40) + '...' : proposal.title || '-'}</span>
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">학위과정:</span>
                        <span>${proposal?.degreeType || '-'}</span>
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">학번:</span>
                        <span>${student?.studentNumber || '-'}</span>
                        <span class="mx-2 text-gray-400">|</span>
                        <span class="font-semibold">성명:</span>
                        <span>${student?.name || '-'}</span>
                    </div>

                    <!-- 우측: 닫기 버튼 -->
                    <button onclick="closeAdvisorAssignmentModal()"
                            class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 학생 정보 -->
            <div class="px-6 py-4 border-b bg-gray-50">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
                <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                        <span class="text-gray-900 font-medium">일반대학원</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                        <span class="text-gray-900 font-medium">${student?.department ? (student.department.includes('공학') ? '공학계열' : student.department.includes('경영') ? '인문사회계열' : '공학계열') : '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                        <span class="text-gray-900 font-medium">${student?.department || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                        <span class="text-gray-900 font-medium">${student?.department || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                        <span class="text-gray-900 font-medium">${proposal?.degreeType || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                        <span class="text-gray-900 font-medium">${student?.status === 'active' ? '재학' : student?.status === 'leave' ? '휴학' : student?.status === 'completed' ? '수료' : student?.status === 'graduated' ? '졸업' : (student?.status || '-')}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">학번:</span>
                        <span class="text-gray-900 font-medium">${student?.studentNumber || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">성명:</span>
                        <span class="text-gray-900 font-medium">${student?.name || '-'}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                        <span class="text-gray-900 font-medium">${assignment?.mainAdvisor ? assignment.mainAdvisor.name : '-'}</span>
                    </div>
                </div>
            </div>

            <!-- 연구계획서 상세 내용 (스크롤 가능) -->
            <div class="p-6" style="max-height: calc(100vh - 200px); overflow-y: auto;">
                <div class="space-y-4">
                    <!-- 연구 제목 (NEW) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연구 제목</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p class="text-gray-900 font-medium">${proposal.title || '정보 없음'}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연구 목적</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[120px]">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.purpose || '정보 없음'}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연구 필요성</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[120px]">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.necessity || '정보 없음'}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연구 문제 및 연구 방법</label>
                        <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[120px]">
                            <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">${proposal.method || '정보 없음'}</p>
                        </div>
                    </div>

                    <!-- 연구계획서 양식 불러오기 버튼 -->
                    <div class="mt-6 flex justify-end">
                        <button onclick="loadProposalForm('${proposal.id}')"
                                class="px-6 py-3 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034] flex items-center gap-2 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            연구계획서 양식 불러오기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 백드롭 클릭으로 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAdvisorAssignmentModal();
        }
    });

    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeAdvisorAssignmentModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// 모달 닫기 함수
function closeAdvisorAssignmentModal() {
    const modal = document.getElementById('advisor-assignment-modal');
    if (modal) {
        modal.remove();
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
