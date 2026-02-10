// ========== 뷰 전환 함수 ==========

function switchView(viewName, param = null) {
    // 전역 변수 클린업
    if (window.composedStages) {
        window.composedStages = null;
    }
    if (window.currentWorkflow) {
        window.currentWorkflow = null;
    }

    // 사이드바 active 상태 변경
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[data-view="${viewName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // 제목 변경
    const viewTitles = {
        dashboard: '대시보드',
        researchProposal: '연구계획서 제출 현황',
        thesisPlan: '논문작성계획서 제출 현황',
        midThesis: '중간논문 제출 현황',
        finalThesis: '최종논문 제출 현황',
        journalSubmission: '학술지 심사 신청 현황',
        guidanceProgress: '논문 지도 활동',
        scheduleManagement: '일정 관리',
        scheduleCreate: param ? '일정 수정' : '일정 등록',
        requirementManagement: '논문 제출 요건 등록',
        titleChangeRequests: '최종 논문 제목 등록',
        stageManagement: '학생별 지도 단계 관리',
        typeManagement: '지도 단계 목록',
        typeManagementNew: '지도 단계 목록 (신규)',
        typeManagementCreate: '지도 단계 등록',
        stageTypeManagement: '지도 단계 유형 관리',
        committeeAssignment: '심사위원 배정',
        evaluationCriteria: '심사 기준 등록',
        evaluationCriteriaEdit: '심사 기준 등록',
        advisorAssignment: '지도교수 배정',
        weeklyGuidance: '학기별 지도 계획',
        examSchedule: '심사 일정 관리',
        workflowCreate: '지도 단계 등록',
        workflowStageCompose: '지도 단계 구성',
        workflowCreateUnified: '지도 단계 등록',
        userManagement: '사용자 관리',
        roleManagement: '역할 관리',
        permissionManagement: '권한 관리',
        rolePermissionMapping: '역할별 권한 설정',
        noticeManagement: '공지사항',
        noticeDetail: '공지사항 상세',
        noticeEdit: param ? '공지사항 수정' : '공지사항 작성',
        thesisReview: '학위 논문 심사',
        journalReview: '학술지 논문 심사',
        ethicsGuide: '연구윤리',
        scheduleGuide: '논문일정',
        processGuide: '논문지도절차',
        guideEdit: param === 'ethics' ? '연구윤리 편집' :
                   param === 'schedule' ? '논문일정 편집' :
                   param === 'procedure' ? '논문지도절차 편집' : '안내문 편집'
    };

    document.getElementById('view-title').textContent = viewTitles[viewName] || '대시보드';

    // 컨텐츠 렌더링 (파라미터 지원)
    if (param !== null && views[viewName]) {
        document.getElementById('content-area').innerHTML = views[viewName](param);
    } else {
        document.getElementById('content-area').innerHTML = views[viewName]();
    }

    // 뷰별 후처리 (렌더링 후 추가 작업)
    if (viewName === 'dashboard') {
        // 대시보드 화면 렌더링 후 컨텐츠 초기화
        setTimeout(() => {
            initAdminDashboard();
        }, 0);
    }

    if (viewName === 'stageManagement') {
        // 단계 관리 화면이 렌더링된 후 컨텐츠 로드
        setTimeout(() => {
            renderStageManagementContent();
        }, 0);
    }

    if (viewName === 'evaluationCriteriaEdit') {
        // 평가표 편집 화면 렌더링 후 이벤트 리스너 초기화 및 총점 계산
        if (typeof initEvaluationTypeChangeListener === 'function') {
            initEvaluationTypeChangeListener();
        }
        if (typeof updateTotalScore === 'function') {
            setTimeout(() => {
                updateTotalScore();
            }, 0);
        }
    }

    if (viewName === 'typeManagementNew') {
        // 지도단계 목록(신규) 화면 - 아무것도 안함
    }

    // Note: typeManagementCreate auto-rendering is handled in index.html's renderAdminView()
    // This switchView() function is not used for admin screens
}

// ========== 이벤트 리스너 초기화 ==========

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ 논문 지도 관리 시스템 초기화 완료');
    
    // 사이드바 링크 클릭 이벤트
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            if (view) {
                switchView(view);
            }
        });
    });

    // 사이드바 서브링크 클릭 이벤트
    document.querySelectorAll('.sidebar-sublink').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            if (view) {
                switchView(view);
            }
        });
    });

    // 모달 닫기 버튼들 (존재하는 경우에만 이벤트 리스너 추가)
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const confirmCancel = document.getElementById('confirm-cancel');
    const alertOk = document.getElementById('alert-ok');
    const modalBackdrop = document.getElementById('modal-backdrop');

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    if (confirmCancel) {
        confirmCancel.addEventListener('click', closeConfirm);
    }
    if (alertOk) {
        alertOk.addEventListener('click', closeAlert);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => {
            closeModal();
            closeConfirm();
            closeAlert();
        });
    }

    // 모바일 메뉴 토글 (있는 경우)
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // 초기 화면 렌더링
    switchView('dashboard');
    
    console.log('📊 샘플 데이터 로드 완료:', {
        연구계획서: appData.submissions.researchProposal.length,
        중간논문: appData.submissions.midThesis.length,
        최종논문: appData.submissions.finalThesis.length,
        학술지: appData.submissions.journalSubmission.length,
        진행현황: appData.guidanceProgress.length
    });
});

// ========== 전역 함수 (디버깅용) ==========

window.debugInfo = () => {
    console.log('=== 시스템 상태 ===');
    console.log('현재 화면:', document.getElementById('view-title').textContent);
    console.log('전체 데이터:', appData);
    console.log('사용 가능한 화면:', Object.keys(views));
};

// ========== API 연결 가이드 (주석) ==========

/*
API 연결 시 수정 방법:

1. admin_data.js 파일 수정
   - appData 객체를 API 호출로 대체
   
   예시:
   async function loadData() {
       const response = await fetch('/api/admin/data');
       const data = await response.json();
       Object.assign(appData, data);
   }

2. admin_modals.js 파일 수정
   - CRUD 함수에서 API 호출 추가
   
   예시 (일정 추가):
   openModal(isEdit ? '일정 수정' : '일정 추가', content, '저장', async () => {
       const newItem = { ... };
       
       // API 호출
       const response = await fetch('/api/schedules', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(newItem)
       });
       
       if (response.ok) {
           const savedItem = await response.json();
           appData.schedules.push(savedItem);
           closeModal();
           showAlert('일정이 저장되었습니다.');
           switchView('scheduleManagement');
       }
   });

3. admin_views.js 파일
   - 화면 렌더링 로직은 그대로 유지
   - 필요시 실시간 업데이트 추가

4. admin_main.js 파일
   - DOMContentLoaded에서 초기 데이터 로드
   
   예시:
   document.addEventListener('DOMContentLoaded', async () => {
       await loadData();  // 데이터 로드
       switchView('dashboard');  // 초기 화면
   });
*/

// ========== 검색 기능 ==========

// 검색 실행
function searchSubmissions(type) {
    const filters = {
        year: document.getElementById('search-year')?.value || '',
        semester: document.getElementById('search-semester')?.value || '',
        advisor: document.getElementById('search-advisor')?.value || '',
        semesterCount: document.getElementById('search-semester-count')?.value || '',
        status: document.getElementById('search-status')?.value || '',
        major: document.getElementById('search-major')?.value || '',
        degree: document.getElementById('search-degree')?.value || '',
        result: document.getElementById('search-result')?.value || '',
        approval: document.getElementById('search-approval')?.value || '',
        journalType: document.getElementById('search-journal-type')?.value || '',
        authorType: document.getElementById('search-author-type')?.value || '',
        keyword: document.getElementById('search-keyword')?.value || ''
    };
    
    // 원본 데이터 백업 (첫 검색 시)
    if (!appData.originalSubmissions) {
        appData.originalSubmissions = {};
    }
    if (!appData.originalSubmissions[type]) {
        appData.originalSubmissions[type] = [...appData.submissions[type]];
    }
    
    // 필터링
    let filtered = [...appData.originalSubmissions[type]];
    
    // 학년도
    if (filters.year) {
        filtered = filtered.filter(item => {
            const submitYear = item.submitDate?.substring(0, 4);
            return submitYear === filters.year;
        });
    }
    
    // 학기
    if (filters.semester) {
        filtered = filtered.filter(item => {
            const submitMonth = parseInt(item.submitDate?.substring(5, 7));
            if (filters.semester === '1') {
                return submitMonth >= 3 && submitMonth <= 8; // 1학기: 3-8월
            } else {
                return submitMonth >= 9 || submitMonth <= 2; // 2학기: 9-2월
            }
        });
    }
    
    // 논문지도교수
    if (filters.advisor) {
        filtered = filtered.filter(item => item.advisor === filters.advisor);
    }
    
    // 학과/전공
    if (filters.major) {
        filtered = filtered.filter(item => item.major === filters.major);
    }
    
    // 학위과정
    if (filters.degree) {
        filtered = filtered.filter(item => item.degree === filters.degree);
    }
    
    // 상태/합격여부
    if (filters.status) {
        filtered = filtered.filter(item => item.status === filters.status);
    }
    if (filters.result) {
        filtered = filtered.filter(item => item.result === filters.result);
    }
    if (filters.approval) {
        filtered = filtered.filter(item => item.status === filters.approval);
    }
    
    // 학술지 유형
    if (filters.journalType) {
        filtered = filtered.filter(item => {
            if (filters.journalType === 'KCI') return item.kci;
            if (filters.journalType === 'SCOPUS') return item.scopus;
            if (filters.journalType === 'SCI') return item.sci;
            return true;
        });
    }
    
    // 저자 구분
    if (filters.authorType) {
        filtered = filtered.filter(item => {
            if (filters.authorType === '제1저자') return item.isFirstAuthor;
            if (filters.authorType === '공동저자') return !item.isFirstAuthor;
            return true;
        });
    }
    
    // 학번/성명 키워드
    if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filtered = filtered.filter(item => {
            return item.studentName?.toLowerCase().includes(keyword) ||
                   item.studentId?.toLowerCase().includes(keyword);
        });
    }
    
    // 필터링된 데이터로 교체
    appData.submissions[type] = filtered;
    
    // 현재 뷰 새로고침 (화면 전환 없이 테이블만 업데이트)
    const contentDiv = document.getElementById('content');
    if (contentDiv && adminViews[type]) {
        contentDiv.innerHTML = adminViews[type]();
    }
    
    // 결과 알림
    showAlert(`검색 결과: ${filtered.length}건`);
}

// 검색 초기화
function resetSearch(type) {
    // 원본 데이터 복원
    if (appData.originalSubmissions && appData.originalSubmissions[type]) {
        appData.submissions[type] = [...appData.originalSubmissions[type]];
    }
    
    // 검색 필드 초기화
    const searchFields = [
        'search-year', 'search-semester', 'search-advisor', 
        'search-semester-count', 'search-status', 'search-major',
        'search-degree', 'search-result', 'search-approval',
        'search-journal-type', 'search-author-type', 'search-keyword'
    ];
    
    searchFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.value = '';
        }
    });
    
    // 현재 뷰 새로고침 (화면 전환 없이 테이블만 업데이트)
    const contentDiv = document.getElementById('content');
    if (contentDiv && adminViews[type]) {
        contentDiv.innerHTML = adminViews[type]();
    }
    
    showAlert('검색 조건이 초기화되었습니다.');
}

// ========== 연구계획서 승인 기능 ==========

function approveResearchProposal(id) {
    // 해당 연구계획서 찾기
    const item = appData.submissions.researchProposal.find(r => r.id === id);
    if (!item) {
        showAlert('연구계획서를 찾을 수 없습니다.');
        return;
    }
    
    // 상태 변경
    item.status = '승인완료';
    
    // 승인 정보 추가
    const today = new Date();
    item.approvalDate = today.toISOString().split('T')[0];
    item.reviewComment = '연구계획서 검토 완료. 승인합니다.';
    
    // 원본 데이터도 업데이트
    if (appData.originalSubmissions && appData.originalSubmissions.researchProposal) {
        const originalItem = appData.originalSubmissions.researchProposal.find(r => r.id === id);
        if (originalItem) {
            originalItem.status = '승인완료';
            originalItem.approvalDate = item.approvalDate;
            originalItem.reviewComment = item.reviewComment;
        }
    }
    
    // 모달 닫기
    closeModal();
    
    // 성공 메시지
    showAlert('연구계획서가 승인되었습니다.');
    
    // 화면 새로고침
    switchView('researchProposal');
}

// 연구계획서 반려
function rejectResearchProposal(id, reason) {
    const item = appData.submissions.researchProposal.find(r => r.id === id);
    if (!item) {
        showAlert('연구계획서를 찾을 수 없습니다.');
        return;
    }
    
    // 상태 변경
    item.status = '반려';
    
    // 반려 정보 추가
    const today = new Date();
    item.rejectDate = today.toISOString().split('T')[0];
    item.rejectReason = reason;
    
    // 원본 데이터도 업데이트
    if (appData.originalSubmissions && appData.originalSubmissions.researchProposal) {
        const originalItem = appData.originalSubmissions.researchProposal.find(r => r.id === id);
        if (originalItem) {
            originalItem.status = '반려';
            originalItem.rejectDate = item.rejectDate;
            originalItem.rejectReason = item.rejectReason;
        }
    }
    
    // 모달 닫기
    closeModal();
    
    // 성공 메시지
    showAlert('연구계획서가 반려되었습니다.');
    
    // 화면 새로고침
    switchView('researchProposal');
}

// 승인 취소
function cancelApprovalResearchProposal(id) {
    const item = appData.submissions.researchProposal.find(r => r.id === id);
    if (!item) {
        showAlert('연구계획서를 찾을 수 없습니다.');
        return;
    }
    
    // 상태 변경
    item.status = '승인대기';
    
    // 승인 정보 삭제
    delete item.approvalDate;
    delete item.reviewComment;
    
    // 원본 데이터도 업데이트
    if (appData.originalSubmissions && appData.originalSubmissions.researchProposal) {
        const originalItem = appData.originalSubmissions.researchProposal.find(r => r.id === id);
        if (originalItem) {
            originalItem.status = '승인대기';
            delete originalItem.approvalDate;
            delete originalItem.reviewComment;
        }
    }
    
    // 모달 닫기
    closeModal();
    
    // 성공 메시지
    showAlert('승인이 취소되었습니다.');
    
    // 화면 새로고침
    switchView('researchProposal');
}

// ========== 주차별 논문지도 검색 ==========

function searchWeeklyGuidance() {
    // Task 1-4: 간소화된 검색 필드 (학년도, 학기, 지도교수, 학번, 성명)
    const filters = {
        year: document.getElementById('weekly-search-year')?.value || '',
        semester: document.getElementById('weekly-search-semester')?.value || '',
        advisor: document.getElementById('weekly-search-advisor')?.value || '',
        studentId: document.getElementById('weekly-search-student-id')?.value.toLowerCase().trim() || '',
        studentName: document.getElementById('weekly-search-student-name')?.value.toLowerCase().trim() || ''
    };

    // 원본 데이터 백업
    if (!appData.originalWeeklyGuidanceStudents) {
        appData.originalWeeklyGuidanceStudents = [...appData.weeklyGuidanceStudents];
    }

    // 필터링
    let filtered = [...appData.originalWeeklyGuidanceStudents];

    // 학년도
    if (filters.year) {
        filtered = filtered.filter(item => (item.year || '2025') === filters.year);
    }

    // 학기
    if (filters.semester) {
        filtered = filtered.filter(item => (item.semester || '1') === filters.semester);
    }

    // 지도교수 (복수 지도교수 고려)
    if (filters.advisor) {
        filtered = filtered.filter(item => {
            if (item.advisors && Array.isArray(item.advisors)) {
                return item.advisors.includes(filters.advisor);
            }
            return item.advisor === filters.advisor;
        });
    }

    // 학번
    if (filters.studentId) {
        filtered = filtered.filter(item => item.studentId.toLowerCase().includes(filters.studentId));
    }

    // 성명
    if (filters.studentName) {
        filtered = filtered.filter(item => item.studentName.toLowerCase().includes(filters.studentName));
    }

    appData.weeklyGuidanceStudents = filtered;

    // 화면 새로고침
    switchView('weeklyGuidance');

    showAlert(`검색 결과: ${filtered.length}건`);
}

function resetWeeklyGuidanceSearch() {
    // 원본 데이터 복원
    if (appData.originalWeeklyGuidanceStudents) {
        appData.weeklyGuidanceStudents = [...appData.originalWeeklyGuidanceStudents];
    }

    // 검색 필드 초기화 (Task 1-4: 간소화된 필드만)
    const searchFields = [
        'weekly-search-year',
        'weekly-search-semester',
        'weekly-search-advisor',
        'weekly-search-student-id',
        'weekly-search-student-name'
    ];

    searchFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.value = '';
        }
    });
    
    // 화면 새로고침
    switchView('weeklyGuidance');
    
    showAlert('검색 조건이 초기화되었습니다.');
}

// 이전 함수들 (하위 호환성)
function searchGuidanceStudents() {
    searchWeeklyGuidance();
}

function resetGuidanceSearch() {
    resetWeeklyGuidanceSearch();
}

// ========== 논문지도 진행 현황 검색 ==========

// Task 1-5: 온라인 피드백 현황 검색 (대학원, 전공, 학위과정, 지도교수, 학기차, 피드백상태, 학번, 성명)
function searchGuidanceProgress() {
    const filters = {
        graduate: document.getElementById('progress-search-graduate')?.value || '',
        major: document.getElementById('progress-search-major')?.value || '',
        degree: document.getElementById('progress-search-degree')?.value || '',
        advisor: document.getElementById('progress-search-advisor')?.value || '',
        semesterCount: document.getElementById('progress-search-semester-count')?.value || '',
        status: document.getElementById('progress-search-status')?.value || '',
        studentId: document.getElementById('progress-search-student-id')?.value.toLowerCase().trim() || '',
        studentName: document.getElementById('progress-search-student-name')?.value.toLowerCase().trim() || '',
        feedbackStatus: document.getElementById('progress-search-feedback-status')?.value || ''
    };

    // 원본 데이터 백업
    if (!appData.originalGuidanceProgress) {
        appData.originalGuidanceProgress = [...appData.guidanceProgress];
    }

    // 필터링
    let filtered = [...appData.originalGuidanceProgress];

    // 대학원
    if (filters.graduate) {
        filtered = filtered.filter(item => (item.graduate || '일반대학원') === filters.graduate);
    }

    // 전공
    if (filters.major) {
        filtered = filtered.filter(item => item.major === filters.major);
    }

    // 학위과정
    if (filters.degree) {
        filtered = filtered.filter(item => item.degree === filters.degree);
    }

    // 지도교수
    if (filters.advisor) {
        filtered = filtered.filter(item => item.advisor === filters.advisor);
    }

    // 학기차
    if (filters.semesterCount) {
        filtered = filtered.filter(item => String(item.semesterCount) === filters.semesterCount);
    }

    // 학적상태 필터 (이 부분이 맞는 위치)
    if (filters.status) {
        filtered = filtered.filter(item => {
            // 학적상태 필터링 로직 필요 시 추가
            return true; // 현재는 모든 항목 통과
        });
    }

    // 피드백상태 (답변 대기중 → 대기, 피드백 완료 → 완료 변환 고려)
    if (filters.feedbackStatus) {
        filtered = filtered.filter(item => {
            let itemStatus = item.feedbackStatus || '대기';
            if (itemStatus === '답변 대기중') itemStatus = '대기';
            if (itemStatus === '피드백 완료') itemStatus = '완료';
            return itemStatus === filters.feedbackStatus;
        });
    }

    // 학번
    if (filters.studentId) {
        filtered = filtered.filter(item => item.studentId.toLowerCase().includes(filters.studentId));
    }

    // 성명
    if (filters.studentName) {
        filtered = filtered.filter(item => item.studentName.toLowerCase().includes(filters.studentName));
    }

    appData.guidanceProgress = filtered;

    // 화면 새로고침
    switchView('guidanceProgress');

    showAlert(`검색 결과: ${filtered.length}건`);
}

function resetGuidanceProgressSearch() {
    // 원본 데이터 복원
    if (appData.originalGuidanceProgress) {
        appData.guidanceProgress = [...appData.originalGuidanceProgress];
    }

    // Task 1-5: 검색 필드 초기화 (대학원, 전공, 학위과정, 지도교수, 학기차, 피드백상태, 학번, 성명)
    const searchFields = [
        'progress-search-graduate',
        'progress-search-major',
        'progress-search-degree',
        'progress-search-advisor',
        'progress-search-semester-count',
        'progress-search-status',
        'progress-search-student-id',
        'progress-search-student-name'
    ];

    searchFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.value = '';
        }
    });

    // 화면 새로고침
    switchView('guidanceProgress');

    showAlert('검색 조건이 초기화되었습니다.');
}

// ========== 논문지도 일정 관리 검색 ==========
function searchGuidanceSchedule() {
    const filters = {
        year: document.getElementById('schedule-search-year')?.value || '',
        semester: document.getElementById('schedule-search-semester')?.value || '',
        collegeType: document.getElementById('schedule-search-college-type')?.value || '',
        college: document.getElementById('schedule-search-college')?.value || '',
        faculty: document.getElementById('schedule-search-faculty')?.value || '',
        major: document.getElementById('schedule-search-major')?.value || '',
        degree: document.getElementById('schedule-search-degree')?.value || '',
        status: document.getElementById('schedule-search-status')?.value || '',
        studentId: document.getElementById('schedule-search-student-id')?.value.toLowerCase().trim() || '',
        studentName: document.getElementById('schedule-search-student-name')?.value.toLowerCase().trim() || '',
        professor: document.getElementById('schedule-search-professor')?.value.toLowerCase().trim() || '',
        stage: document.getElementById('schedule-search-stage')?.value || '',
        registration: document.getElementById('schedule-search-registration')?.value || ''
    };

    // 원본 데이터 백업
    if (!appData.originalGuidanceScheduleStatus) {
        appData.originalGuidanceScheduleStatus = [...appData.guidanceScheduleStatus];
    }

    // 필터링
    let filtered = [...appData.originalGuidanceScheduleStatus];

    // 학년도
    if (filters.year) {
        filtered = filtered.filter(item => item.year === filters.year);
    }

    // 학기
    if (filters.semester) {
        filtered = filtered.filter(item => item.semester === filters.semester);
    }

    // 대학구분
    if (filters.collegeType) {
        filtered = filtered.filter(item => item.collegeType === filters.collegeType);
    }

    // 계열/대학원
    if (filters.college) {
        filtered = filtered.filter(item => item.college === filters.college);
    }

    // 학부(과)전공
    if (filters.faculty) {
        filtered = filtered.filter(item => item.faculty === filters.faculty);
    }

    // 학과/전공
    if (filters.major) {
        filtered = filtered.filter(item => item.major === filters.major);
    }

    // 학위과정
    if (filters.degree) {
        filtered = filtered.filter(item => item.degree === filters.degree);
    }

    // 학적상태
    if (filters.status) {
        filtered = filtered.filter(item => item.status === filters.status);
    }

    // 학번
    if (filters.studentId) {
        filtered = filtered.filter(item => item.studentId.toLowerCase().includes(filters.studentId));
    }

    // 성명
    if (filters.studentName) {
        filtered = filtered.filter(item => item.studentName.toLowerCase().includes(filters.studentName));
    }

    // 지도교수명
    if (filters.professor) {
        filtered = filtered.filter(item => item.professor.toLowerCase().includes(filters.professor));
    }

    // 기본단계
    if (filters.stage) {
        filtered = filtered.filter(item => item.stage === filters.stage);
    }

    // 등록상태
    if (filters.registration) {
        filtered = filtered.filter(item => item.registrationStatus === filters.registration);
    }

    appData.guidanceScheduleStatus = filtered;

    // 화면 새로고침
    switchView('scheduleManagement');

    showAlert(`검색 결과: ${filtered.length}건`);
}

function resetGuidanceScheduleSearch() {
    // 원본 데이터 복원
    if (appData.originalGuidanceScheduleStatus) {
        appData.guidanceScheduleStatus = [...appData.originalGuidanceScheduleStatus];
    }

    // 검색 필드 초기화
    const searchFields = [
        'schedule-search-year',
        'schedule-search-semester',
        'schedule-search-college-type',
        'schedule-search-college',
        'schedule-search-faculty',
        'schedule-search-major',
        'schedule-search-degree',
        'schedule-search-status',
        'schedule-search-student-id',
        'schedule-search-student-name',
        'schedule-search-professor',
        'schedule-search-stage',
        'schedule-search-registration'
    ];

    searchFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.value = '';
        }
    });

    // 화면 새로고침
    switchView('scheduleManagement');

    showAlert('검색 조건이 초기화되었습니다.');
}

// ========== 학위논문 심사 관리 탭 전환 (ID 6) ==========
function switchThesisTab(tab) {
    window.currentThesisTab = tab;
    switchView('thesisReview');
}

function searchThesisReview() {
    // 검색 조건 수집
    const year = document.getElementById('thesis-search-year')?.value || '';
    const semester = document.getElementById('thesis-search-semester')?.value || '';
    const semesterCount = document.getElementById('thesis-search-semester-count')?.value || '';
    const type = document.getElementById('thesis-search-type')?.value || '';
    const studentId = document.getElementById('thesis-search-student-id')?.value || '';
    const studentName = document.getElementById('thesis-search-student-name')?.value || '';

    // 통합된 원본 데이터
    const combinedData = [
        ...appData.submissions.thesisPlan.map(item => ({...item, submissionType: 'plan', submissionTypeName: '논문작성계획서 심사'})),
        ...appData.submissions.midThesis.map(item => ({...item, submissionType: 'mid', submissionTypeName: '중간논문 심사'})),
        ...appData.submissions.finalThesis.map(item => ({...item, submissionType: 'final', submissionTypeName: '최종논문 심사'}))
    ];

    // 필터링
    window.filteredThesisData = combinedData.filter(item => {
        if (year && (item.year || '2025') !== year) return false;
        if (semester && (item.semester || '1') !== semester) return false;
        if (semesterCount && (item.semesterCount || '') !== semesterCount) return false;
        if (type && item.submissionType !== type) return false;
        if (studentId && !item.studentId.includes(studentId)) return false;
        if (studentName && !item.studentName.includes(studentName)) return false;
        return true;
    });

    // 뷰 재렌더링
    switchView('thesisReview');
    showAlert(`검색 결과: ${window.filteredThesisData.length}건`);
}

function resetThesisSearch() {
    // 검색 필드 초기화
    document.querySelectorAll('input[id^="thesis-search"], select[id^="thesis-search"]').forEach(field => {
        if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
        } else if (field.type !== 'checkbox') {
            field.value = '';
        }
    });

    // 필터링된 데이터 초기화
    window.filteredThesisData = null;

    // 뷰 재렌더링
    switchView('thesisReview');
    showAlert('검색 조건이 초기화되었습니다.');
}

// ========== 학술지 심사 검색/초기화 ==========
function searchJournalReview() {
    // 검색 조건 수집
    const year = document.getElementById('journal-search-year')?.value || '';
    const semester = document.getElementById('journal-search-semester')?.value || '';
    const semesterCount = document.getElementById('journal-search-semester-count')?.value || '';
    const studentId = document.getElementById('journal-search-student-id')?.value || '';
    const studentName = document.getElementById('journal-search-student-name')?.value || '';

    const data = appData.submissions.journalSubmission || [];

    // 필터링
    window.filteredJournalData = data.filter(item => {
        if (year && (item.year || '2025') !== year) return false;
        if (semester && (item.semester || '1') !== semester) return false;
        if (semesterCount && (item.semesterCount || '') !== semesterCount) return false;
        if (studentId && !item.studentId.includes(studentId)) return false;
        if (studentName && !item.studentName.includes(studentName)) return false;
        return true;
    });

    // 뷰 재렌더링
    switchView('journalReview');
    showAlert(`검색 결과: ${window.filteredJournalData.length}건`);
}

function resetJournalSearch() {
    // 검색 필드 초기화
    document.querySelectorAll('input[id^="journal-search"], select[id^="journal-search"]').forEach(field => {
        if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
        } else if (field.type !== 'checkbox') {
            field.value = '';
        }
    });

    // 필터링된 데이터 초기화
    window.filteredJournalData = null;

    // 뷰 재렌더링
    switchView('journalReview');
    showAlert('검색 조건이 초기화되었습니다.');
}

// ========== 체크박스 전체 선택 (ID 9) ==========
function toggleAllCheckboxes(source) {
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
}

// ========== 학술지 상세보기 (학위논문과 동일한 프로세스) ==========
function viewJournalDetail(itemId, viewType) {
    console.log('viewJournalDetail called:', { itemId, viewType });

    const dataSource = appData.submissions.journalSubmission || [];
    const item = dataSource.find(d => String(d.id) === String(itemId));

    if (!item) {
        console.error('Item not found for id:', itemId);
        alert('심사 정보를 찾을 수 없습니다.');
        return;
    }

    const isChair = viewType === 'chair';
    const modalTitle = (item.thesisTitle || '논문제목 미정') + ' - ' + (isChair ? '심사위원장' : '심사위원') + ' 평가 (읽기 전용)';

    // 학술지 심사는 학위논문 심사와 동일한 프로세스이므로 viewThesisReviewDetail 호출
    // 실제로는 journalSubmission 타입으로 처리하지만, 평가 UI는 동일
    const reviewers = item.reviewers || [
        { name: item.advisor || '홍길동', role: '주심', status: '완료', score: 88, comment: '연구 설계가 잘 되어 있습니다.' },
        { name: '이교수', role: '부심', status: '완료', score: 85, comment: '이론적 배경이 충실합니다.' },
        { name: '박교수', role: '부심', status: '대기', score: null, comment: null }
    ];

    let content = '<div class="space-y-6">';

    // 논문 정보
    content += '<div class="bg-gray-50 rounded-lg p-4">';
    content += '<h4 class="font-bold text-gray-800 mb-3">📄 논문 정보</h4>';
    content += '<div class="space-y-2 text-sm">';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">대학원</div><div class="flex-1">' + (item.graduate || '일반대학원') + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">전공/학과</div><div class="flex-1">' + item.major + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">학위과정</div><div class="flex-1">' + item.degree + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">학번</div><div class="flex-1">' + item.studentId + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">학생명</div><div class="flex-1 font-medium">' + item.studentName + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">논문제목</div><div class="flex-1 font-medium">' + (item.thesisTitle || '미정') + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">학술지명</div><div class="flex-1">' + (item.journalName || '-') + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">지도교수</div><div class="flex-1">' + item.advisor + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">제출일</div><div class="flex-1">' + (item.submitDate || '-') + '</div></div>';
    content += '</div></div>';

    // 평가 내용 (학위논문과 동일)
    if (!isChair) {
        // 위원 뷰
        const template = {
            name: '학술지 심사 평가표',
            passingScore: 75,
            categories: [
                { id: 'cat1', name: '연구의 독창성', description: '연구 주제의 참신성과 기여도', weight: 25, maxScore: 10 },
                { id: 'cat2', name: '연구방법의 타당성', description: '연구 방법론의 적절성과 신뢰성', weight: 25, maxScore: 10 },
                { id: 'cat3', name: '결과의 명확성', description: '연구 결과의 명확성과 논리성', weight: 20, maxScore: 10 },
                { id: 'cat4', name: '논리적 구성', description: '논문의 전체적인 논리적 구성', weight: 15, maxScore: 10 },
                { id: 'cat5', name: '학술적 기여도', description: '학문 분야에 대한 기여 정도', weight: 15, maxScore: 10 }
            ]
        };

        const evaluation = {
            evaluationType: 'score',
            submittedAt: item.submitDate || new Date().toISOString(),
            totalScore: reviewers[0]?.score || 88,
            scores: [
                { categoryId: 'cat1', score: 9, comment: '연구 주제가 참신하고 학술적 가치가 높습니다.' },
                { categoryId: 'cat2', score: 8.5, comment: '연구 방법론이 체계적이고 적절합니다.' },
                { categoryId: 'cat3', score: 9, comment: '연구 결과가 명확하게 제시되었습니다.' },
                { categoryId: 'cat4', score: 8.5, comment: '논문의 구성이 논리적입니다.' },
                { categoryId: 'cat5', score: 9, comment: '학문 분야에 유의미한 기여를 합니다.' }
            ],
            overallComment: { combined: reviewers[0]?.comment || '전반적으로 우수한 연구이며, 학술지 게재 기준을 충족합니다.' }
        };

        content += '<div class="bg-white rounded-lg shadow-md p-6 mb-6">';
        content += '<div class="flex items-center justify-between mb-4">';
        content += '<h3 class="text-lg font-bold text-gray-800">' + template.name + '</h3>';
        content += '<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">';
        content += '제출 완료 (' + formatDateTime(evaluation.submittedAt) + ')';
        content += '</span></div>';

        content += '<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">';
        content += '<p class="text-sm text-blue-800">';
        content += '<strong>안내:</strong> 각 항목별로 0-10점 사이의 점수를 입력해주세요. ';
        content += '가중치가 적용되어 최종 점수가 계산됩니다.';
        content += '</p></div>';

        content += '<div id="evaluation-categories" class="space-y-4">';
        template.categories.forEach((category, index) => {
            const scoreData = evaluation.scores.find(s => s.categoryId === category.id);
            const currentScore = scoreData?.score || 0;
            const currentComment = scoreData?.comment || '';

            content += '<div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">';
            content += '<div class="grid grid-cols-[1fr_80px] gap-4 mb-4">';
            content += '<div>';
            content += '<h4 class="font-bold text-gray-800 mb-1">' + (index + 1) + '. ' + category.name + '</h4>';
            content += '<p class="text-sm text-gray-600">' + category.description + '</p>';
            content += '</div>';
            content += '<div class="text-right">';
            content += '<div class="text-xs text-gray-500">가중치</div>';
            content += '<div class="text-lg font-bold text-blue-600">' + category.weight + '%</div>';
            content += '</div></div>';

            content += '<div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">';
            content += '<label class="text-sm font-medium text-gray-700">점수:</label>';
            content += '<input type="number" class="score-input w-full bg-gray-50" min="0" max="' + category.maxScore + '" step="0.5" value="' + currentScore + '" disabled>';
            content += '<span class="text-sm text-gray-600">/ ' + category.maxScore + '점</span>';
            content += '<span></span>';
            content += '</div>';

            content += '<div class="grid grid-cols-[60px_1fr] gap-3 items-center mb-4">';
            content += '<span></span>';
            content += '<div class="text-sm text-gray-500">';
            content += '→ 가중 점수: ';
            content += '<span class="weighted-score text-base font-bold text-blue-600">';
            content += calculateWeightedScore(currentScore, category.maxScore, category.weight).toFixed(1) + '점';
            content += '</span>';
            content += '<span class="text-xs text-gray-400">(' + category.weight + '% 적용)</span>';
            content += '</div></div>';

            content += '<div>';
            content += '<label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>';
            content += '<textarea class="score-comment w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" rows="2" disabled>' + currentComment + '</textarea>';
            content += '</div>';

            content += '</div>';
        });
        content += '</div>';

        content += '<div class="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">';
        content += '<div class="flex items-center justify-between">';
        content += '<h4 class="text-lg font-bold text-gray-800">총점</h4>';
        content += '<div class="text-3xl font-bold text-blue-600">' + evaluation.totalScore + '점</div>';
        content += '</div>';
        content += '<div class="text-sm text-gray-600 mt-1 text-right">100점 만점 (합격 기준: ' + template.passingScore + '점)</div>';
        content += '</div>';

        content += '<div class="mt-6">';
        content += '<h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>';
        content += '<textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50" rows="4" disabled>' + (evaluation.overallComment.combined || evaluation.overallComment.conclusion || '') + '</textarea>';
        content += '</div>';
        content += '</div>';
    }

    if (isChair) {
        // 위원장 뷰 (간략화)
        const template = {
            name: '학술지 심사 평가표',
            passingScore: 75
        };

        content += '<div class="bg-white rounded-lg shadow-md p-6 mb-6">';
        content += '<h3 class="text-lg font-bold text-gray-800 mb-4">심사위원장 종합 평가</h3>';

        const completedReviewers = reviewers.filter(r => r.score);
        const avgScore = completedReviewers.length > 0 ? completedReviewers.reduce((sum, r) => sum + r.score, 0) / completedReviewers.length : 0;
        const threshold = 75;
        const systemDecision = avgScore >= threshold ? '합격' : '불합격';

        content += '<div class="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mb-6">';
        content += '<div class="grid grid-cols-3 gap-6 text-center">';
        content += '<div>';
        content += '<div class="text-sm text-gray-600 mb-1">평균 점수</div>';
        content += '<div class="text-3xl font-bold text-blue-600">' + avgScore.toFixed(1) + '점</div>';
        content += '</div>';
        content += '<div>';
        content += '<div class="text-sm text-gray-600 mb-1">합격 기준</div>';
        content += '<div class="text-3xl font-bold text-gray-800">' + threshold + '점</div>';
        content += '</div>';
        content += '<div>';
        content += '<div class="text-sm text-gray-600 mb-1">시스템 판정</div>';
        content += '<div class="text-2xl font-bold ' + (systemDecision === '합격' ? 'text-green-600' : 'text-red-600') + '">' + systemDecision + '</div>';
        content += '</div>';
        content += '</div></div>';

        content += '<div class="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">';
        content += '<h4 class="font-bold text-gray-800 mb-3">최종 결정 (읽기 전용)</h4>';
        content += '<div class="space-y-3">';
        content += '<div class="flex items-center gap-3">';

        const currentDecision = item.result || '승인';
        const decisions = ['승인', '보류', '반려'];
        decisions.forEach(decision => {
            const isSelected = decision === currentDecision;
            const borderColor = decision === '승인' ? 'border-green-400' : decision === '보류' ? 'border-yellow-400' : 'border-red-400';
            content += '<label class="flex items-center gap-2 p-3 bg-white rounded-lg flex-1 border-2 ' + (isSelected ? borderColor : 'border-gray-300') + '">';
            content += '<input type="radio" name="chairDecision" value="' + decision + '" ' + (isSelected ? 'checked' : '') + ' disabled class="w-4 h-4">';
            content += '<span class="font-medium">' + decision + '</span>';
            content += '</label>';
        });

        content += '</div>';
        content += '<div>';
        content += '<label class="text-sm font-medium text-gray-700 mb-1 block">결정 사유:</label>';
        content += '<textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50" rows="4" disabled>전반적으로 연구의 질이 우수하며 학술지 게재 요건을 충족합니다. 승인합니다.</textarea>';
        content += '</div>';
        content += '</div></div>';

        content += '</div>';
    }

    content += '<div class="bg-yellow-50 border border-yellow-200 rounded p-3"><div class="flex items-start">';
    content += '<svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>';
    content += '<div class="flex-1"><p class="text-sm font-medium text-yellow-800">읽기 전용 모드</p>';
    content += '<p class="text-xs text-yellow-700 mt-1">이 화면은 교수의 평가 내용을 조회하기 위한 읽기 전용 화면입니다.</p></div></div></div></div>';

    openModal(modalTitle, content, '닫기', () => { closeModal(); }, true);
}

// ========== 연구계획서 상세보기 ==========
function viewResearchProposalDetail(id) {
    showAlert(`연구계획서 상세 (ID: ${id})`);
    // TODO: 모달 열기
}

console.log('🚀 모든 JavaScript 모듈 로드 완료!');
console.log('💡 window.debugInfo()를 실행하여 시스템 상태를 확인하세요.');

// ==================== 주차별 논문지도 기능 ====================
// 주차별 논문지도 기능은 admin_weekly_guidance.js 및 admin_modals.js에서 구현됨
console.log('ℹ️  주차별 논문지도 기능: admin_weekly_guidance.js, admin_modals.js 참조');

// ==================== ID 22-25: 온라인 피드백 현황 세부 기능 ====================

// ID 22: 온라인 피드백 상세보기
function viewGuidanceProgressDetail(studentId) {
    const records = appData.guidanceProgress.filter(r => r.studentId === studentId);
    
    if (records.length === 0) {
        showNotification('피드백 내역을 찾을 수 없습니다.', 'error');
        return;
    }
    
    const student = records[0]; // 첫 번째 레코드에서 학생 정보 가져오기
    
    // ID 23: 피드백 내역 리스트 표시
    const recordsHtml = records.map((record, index) => `
        <div class="border-b border-gray-200 py-4 hover:bg-gray-50 cursor-pointer"
             onclick="viewFeedbackRecordDetail('${record.id}')">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                    <span class="font-semibold text-gray-800">${record.documentTitle}</span>
                    <span class="px-2 py-1 text-xs rounded-full ${getStageBadgeClass(record.stage)}">
                        ${record.stage}
                    </span>
                </div>
                <span class="px-2 py-1 text-xs rounded-full ${getFeedbackStatusBadgeClass(record.feedbackStatus)}">
                    ${record.feedbackStatus}
                </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600">
                <span>${record.submitDate}</span>
                <span>피드백 ${record.feedbackCount}회</span>
                <span>CopyKiller ${record.copyKiller}%</span>
                <span>GPT Killer ${record.gptKiller}%</span>
            </div>
            <div class="text-sm text-gray-500 mt-1">${record.fileName}</div>
        </div>
    `).join('');
    
    // ID 25: 통계 요약
    const stats = calculateFeedbackStats(records);
    
    const modalHtml = `
        <div id="feedback-progress-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             onclick="if(event.target.id==='feedback-progress-detail-modal') closeFeedbackProgressDetailModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <!-- 헤더 -->
                <div class="bg-[#009DE8] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">온라인 피드백 상세</h3>
                    <button onclick="closeFeedbackProgressDetailModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>
                
                <div class="overflow-y-auto" style="max-height: calc(90vh - 80px);">
                    <!-- 학생 정보 -->
                    <div class="p-6 border-b bg-gray-50">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">학번</div>
                                <div class="font-semibold text-gray-800">${student.studentId}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">성명</div>
                                <div class="font-semibold text-gray-800">${student.studentName}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">전공</div>
                                <div class="font-semibold text-gray-800">${student.major}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">학위과정</div>
                                <div class="font-semibold text-gray-800">${student.degree}</div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="text-xs text-gray-500 mb-1">지도교수</div>
                            <div class="font-semibold text-gray-800">${student.advisor}</div>
                        </div>
                    </div>
                    
                    <!-- ID 25: 통계 요약 -->
                    <div class="p-6 border-b bg-blue-50">
                        <h4 class="text-sm font-bold text-gray-800 mb-4">피드백 통계</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-blue-600">${stats.totalSubmissions}</div>
                                <div class="text-xs text-gray-600 mt-1">총 제출 건수</div>
                            </div>
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-green-600">${stats.completedFeedbacks}</div>
                                <div class="text-xs text-gray-600 mt-1">피드백 완료</div>
                            </div>
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-orange-600">${stats.pendingFeedbacks}</div>
                                <div class="text-xs text-gray-600 mt-1">답변 대기중</div>
                            </div>
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-purple-600">${stats.totalFeedbackCount}</div>
                                <div class="text-xs text-gray-600 mt-1">총 피드백 횟수</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-lg font-bold text-red-600">${stats.avgCopyKiller.toFixed(1)}%</div>
                                <div class="text-xs text-gray-600 mt-1">평균 CopyKiller</div>
                            </div>
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-lg font-bold text-red-600">${stats.avgGptKiller.toFixed(1)}%</div>
                                <div class="text-xs text-gray-600 mt-1">평균 GPT Killer</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ID 23: 피드백 내역 리스트 -->
                    <div class="p-6">
                        <h4 class="text-sm font-bold text-gray-800 mb-4">제출 내역 (최신순)</h4>
                        <div class="space-y-0">
                            ${recordsHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// ID 24: 피드백 상세 보기
function viewFeedbackRecordDetail(recordId) {
    const record = appData.guidanceProgress.find(r => r.id == recordId);
    
    if (!record) {
        showNotification('피드백 내역을 찾을 수 없습니다.', 'error');
        return;
    }
    
    const detailHtml = `
        <div id="feedback-record-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
             onclick="if(event.target.id==='feedback-record-detail-modal') closeFeedbackRecordDetailModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <!-- 헤더 -->
                <div class="bg-[#009DE8] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-lg font-bold">피드백 내역 상세</h3>
                    <button onclick="closeFeedbackRecordDetailModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>
                
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px);">
                    <!-- 제출 정보 -->
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <div class="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <span class="text-xs text-gray-500">학생</span>
                                <div class="font-semibold text-gray-800">${record.studentName} (${record.studentId})</div>
                            </div>
                            <div>
                                <span class="text-xs text-gray-500">지도교수</span>
                                <div class="font-semibold text-gray-800">${record.advisor}</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <span class="text-xs text-gray-500">전공</span>
                                <div class="font-semibold text-gray-800">${record.major}</div>
                            </div>
                            <div>
                                <span class="text-xs text-gray-500">학위과정</span>
                                <div class="font-semibold text-gray-800">${record.degree}</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="text-xs text-gray-500">제출일자</span>
                                <div class="font-semibold text-gray-800">${record.submitDate}</div>
                            </div>
                            <div>
                                <span class="text-xs text-gray-500">단계</span>
                                <div>
                                    <span class="inline-block mt-1 px-3 py-1 text-sm rounded-full ${getStageBadgeClass(record.stage)}">
                                        ${record.stage}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 제출 문서 -->
                    <div class="mb-6">
                        <h5 class="text-sm font-bold text-gray-800 mb-2">제출 문서</h5>
                        <div class="bg-blue-50 rounded-lg p-4">
                            <div class="font-semibold text-gray-800 mb-2">${record.documentTitle}</div>
                            <div class="text-sm text-gray-600 mb-3">${record.fileName}</div>
                            <button onclick="alert('파일 다운로드: ${record.fileName}')" 
                                    class="px-4 py-2 bg-[#009DE8] text-white rounded text-sm hover:bg-[#500020]">
                                <i class="fas fa-download"></i> 파일 다운로드
                            </button>
                        </div>
                    </div>
                    
                    <!-- 검증 결과 -->
                    <div class="mb-6">
                        <h5 class="text-sm font-bold text-gray-800 mb-2">표절 검증 결과</h5>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                                <div class="text-xs text-gray-600 mb-1">CopyKiller</div>
                                <div class="text-2xl font-bold ${record.copyKiller > 10 ? 'text-red-600' : 'text-green-600'}">
                                    ${record.copyKiller}%
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    ${record.copyKiller > 10 ? '기준 초과' : '정상 범위'}
                                </div>
                            </div>
                            <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                                <div class="text-xs text-gray-600 mb-1">GPT Killer</div>
                                <div class="text-2xl font-bold ${record.gptKiller > 5 ? 'text-red-600' : 'text-green-600'}">
                                    ${record.gptKiller}%
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    ${record.gptKiller > 5 ? '기준 초과' : '정상 범위'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 피드백 현황 -->
                    <div class="mb-6">
                        <h5 class="text-sm font-bold text-gray-800 mb-2">피드백 현황</h5>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-700">피드백 상태</span>
                                <span class="px-3 py-1 text-sm rounded-full ${getFeedbackStatusBadgeClass(record.feedbackStatus)}">
                                    ${record.feedbackStatus}
                                </span>
                            </div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-700">피드백 횟수</span>
                                <span class="font-semibold text-gray-800">${record.feedbackCount}회</span>
                            </div>
                            ${record.lastFeedbackDate ? `
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-700">최근 피드백 일자</span>
                                    <span class="font-semibold text-gray-800">${record.lastFeedbackDate}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <button onclick="closeFeedbackRecordDetailModal()" 
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', detailHtml);
}

// 모달 닫기
function closeFeedbackProgressDetailModal() {
    const modal = document.getElementById('feedback-progress-detail-modal');
    if (modal) modal.remove();
}

function closeFeedbackRecordDetailModal() {
    const modal = document.getElementById('feedback-record-detail-modal');
    if (modal) modal.remove();
}

// ID 25: 피드백 통계 계산
function calculateFeedbackStats(records) {
    const totalCopyKiller = records.reduce((sum, r) => sum + r.copyKiller, 0);
    const totalGptKiller = records.reduce((sum, r) => sum + r.gptKiller, 0);
    
    return {
        totalSubmissions: records.length,
        completedFeedbacks: records.filter(r => r.feedbackStatus === '피드백 완료').length,
        pendingFeedbacks: records.filter(r => r.feedbackStatus === '답변 대기중').length,
        totalFeedbackCount: records.reduce((sum, r) => sum + r.feedbackCount, 0),
        avgCopyKiller: records.length > 0 ? totalCopyKiller / records.length : 0,
        avgGptKiller: records.length > 0 ? totalGptKiller / records.length : 0
    };
}

// 단계 배지 클래스
function getStageBadgeClass(stage) {
    const classes = {
        '연구계획서': 'bg-blue-100 text-blue-700',
        '중간논문': 'bg-purple-100 text-purple-700',
        '최종본': 'bg-green-100 text-green-700'
    };
    return classes[stage] || 'bg-gray-100 text-gray-700';
}

// 피드백 상태 배지 클래스
function getFeedbackStatusBadgeClass(status) {
    const classes = {
        '답변 대기중': 'bg-orange-100 text-orange-700',
        '피드백 완료': 'bg-green-100 text-green-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
}

// Export
window.viewGuidanceProgressDetail = viewGuidanceProgressDetail;
window.viewFeedbackRecordDetail = viewFeedbackRecordDetail;
window.closeFeedbackProgressDetailModal = closeFeedbackProgressDetailModal;
window.closeFeedbackRecordDetailModal = closeFeedbackRecordDetailModal;

console.log('✅ ID 22-25: 온라인 피드백 현황 상세 기능 로드 완료');

// ==================== ID 26-29: 지도 단계 관리 상세 기능 ====================

// ID 26: 지도 단계 상세보기
function viewStageDetail(stageId) {
    const stage = appData.stages.find(s => s.id === stageId);
    
    if (!stage) {
        showNotification('지도 단계 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    // ID 27: 단계별 진행 현황 표시 (시각화)
    const stepsHtml = stage.steps.map((step, index) => `
        <div class="relative flex-1">
            <!-- 단계 카드 -->
            <div class="bg-white border-2 ${step.hasEvaluation ? 'border-green-500' : 'border-gray-300'} rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-xs text-gray-500">Step ${step.order}</div>
                    ${step.hasEvaluation ? '<span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">평가 단계</span>' : ''}
                </div>
                <div class="font-bold text-gray-800 mb-2">${step.name}</div>
                ${step.hasEvaluation ? `
                    <div class="mt-3 pt-3 border-t border-gray-200">
                        <div class="text-xs text-gray-600 mb-1">평가표</div>
                        <div class="text-sm font-medium text-blue-600">${step.evaluationCriteriaName}</div>
                    </div>
                ` : '<div class="text-xs text-gray-500 mt-2">평가 없음</div>'}
            </div>
            
            <!-- 화살표 -->
            ${index < stage.steps.length - 1 ? `
                <div class="absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-400 text-2xl z-10">
                    →
                </div>
            ` : ''}
        </div>
    `).join('');
    
    const modalHtml = `
        <div id="stage-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             onclick="if(event.target.id==='stage-detail-modal') closeStageDetailModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <!-- 헤더 -->
                <div class="bg-[#009DE8] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">지도 단계 상세</h3>
                    <button onclick="closeStageDetailModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>
                
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px);">
                    <!-- 기본 정보 -->
                    <div class="bg-gray-50 rounded-lg p-6 mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">기본 정보</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">지도 단계명</div>
                                <div class="font-semibold text-gray-800">${stage.name}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">학과</div>
                                <div class="font-semibold text-gray-800">${stage.major}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">학위과정</div>
                                <div class="font-semibold text-gray-800">${stage.degree}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">버전</div>
                                <div class="font-semibold text-gray-800">${stage.version}</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">총 단계 수</div>
                                <div class="text-2xl font-bold text-blue-600">${stage.stageCount}단계</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">평가 단계</div>
                                <div class="text-2xl font-bold text-green-600">${stage.evaluationCount}개</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ID 27, 29: 단계별 진행 현황 시각화 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">지도 단계 구성</h4>
                        <div class="relative flex items-center gap-8 overflow-x-auto pb-4">
                            ${stepsHtml}
                        </div>
                    </div>
                    
                    <!-- ID 28: 단계별 평가 기준 표시 -->
                    <div>
                        <h4 class="text-lg font-bold text-gray-800 mb-4">평가 단계 상세</h4>
                        <div class="space-y-4">
                            ${stage.steps.filter(s => s.hasEvaluation).map(step => `
                                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <span class="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                                                Step ${step.order}
                                            </span>
                                            <h5 class="font-bold text-gray-800">${step.name}</h5>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <div class="text-xs text-gray-600 mb-1">평가표 ID</div>
                                            <div class="font-medium text-gray-800">${step.evaluationCriteriaId}</div>
                                        </div>
                                        <div>
                                            <div class="text-xs text-gray-600 mb-1">평가표명</div>
                                            <div class="font-medium text-gray-800">${step.evaluationCriteriaName}</div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            ${stage.steps.filter(s => s.hasEvaluation).length === 0 ? `
                                <div class="text-center py-8 text-gray-500">
                                    평가 단계가 없습니다.
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <button onclick="editStage(${stageId})" 
                            class="px-4 py-2 bg-[#009DE8] text-white rounded hover:bg-[#0087c9]">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button onclick="closeStageDetailModal()" 
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 평가표 상세보기 (추후 구현)
function viewEvaluationCriteria(criteriaId) {
    showNotification(`평가표 ID ${criteriaId} 상세보기 (추후 구현)`, 'info');
}

// 모달 닫기
function closeStageDetailModal() {
    const modal = document.getElementById('stage-detail-modal');
    if (modal) modal.remove();
}

// Export
window.viewStageDetail = viewStageDetail;
window.viewEvaluationCriteria = viewEvaluationCriteria;
window.closeStageDetailModal = closeStageDetailModal;

console.log('✅ ID 26-29: 지도 단계 관리 상세 기능 로드 완료');

// ==================== 학사일정 관리 검색 기능 ====================

function searchSchedule() {
    const keyword = document.getElementById('schedule-search-keyword')?.value.toLowerCase() || '';
    const target = document.getElementById('schedule-search-target')?.value || '';
    
    const filtered = appData.schedules.filter(item => {
        const matchKeyword = !keyword || 
            item.name.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword);
        const matchTarget = !target || item.target === target || item.target === '전체';
        
        return matchKeyword && matchTarget;
    });
    
    renderScheduleResults(filtered);
}

function renderScheduleResults(data) {
    const tbody = document.querySelector('#schedule-table tbody');
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">검색 결과가 없습니다</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(item => `
        <tr class="hover:bg-gray-50">
            <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.target}</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.startDate}</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.endDate}</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.description}</td>
            <td class="py-3 px-4 space-x-2">
                <button onclick="editSchedule(${item.id})" class="text-blue-600 hover:underline text-sm">수정</button>
                <button onclick="deleteSchedule(${item.id})" class="text-red-600 hover:underline text-sm">삭제</button>
            </td>
        </tr>
    `).join('');
}

function resetScheduleSearch() {
    document.getElementById('schedule-search-keyword').value = '';
    document.getElementById('schedule-search-target').value = '';
    renderScheduleResults(appData.schedules);
}

// ==================== 졸업요건 관리 검색 기능 ====================

function searchRequirement() {
    const major = document.getElementById('requirement-search-major')?.value || '';
    const degree = document.getElementById('requirement-search-degree')?.value || '';
    
    const filtered = appData.requirements.filter(item => {
        const matchMajor = !major || item.major === major;
        const matchDegree = !degree || item.degree === degree;
        
        return matchMajor && matchDegree;
    });
    
    renderRequirementResults(filtered);
}

function renderRequirementResults(data) {
    const tbody = document.querySelector('#requirement-table tbody');
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500">검색 결과가 없습니다</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(item => `
        <tr class="hover:bg-gray-50">
            <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.major}</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.minCredits}학점</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.thesisRequired ? 'O' : 'X'}</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.journalPapers}편</td>
            <td class="py-3 px-4 text-sm text-gray-600">${item.conferencePapers}편</td>
            <td class="py-3 px-4 space-x-2">
                <button onclick="viewRequirementDetail(${item.id})" class="text-blue-600 hover:underline text-sm">상세</button>
                <button onclick="editRequirement(${item.id})" class="text-green-600 hover:underline text-sm">수정</button>
                <button onclick="deleteRequirement(${item.id})" class="text-red-600 hover:underline text-sm">삭제</button>
            </td>
        </tr>
    `).join('');
}

function resetRequirementSearch() {
    document.getElementById('requirement-search-major').value = '';
    document.getElementById('requirement-search-degree').value = '';
    renderRequirementResults(appData.requirements);
}

// ==================== 졸업요건 상세보기 ====================

function viewRequirementDetail(requirementId) {
    const requirement = appData.requirements.find(r => r.id === requirementId);
    
    if (!requirement) {
        showNotification('졸업요건 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    const modalHtml = `
        <div id="requirement-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             onclick="if(event.target.id==='requirement-detail-modal') closeRequirementDetailModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <!-- 헤더 -->
                <div class="bg-[#009DE8] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">졸업요건 상세</h3>
                    <button onclick="closeRequirementDetailModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>
                
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px);">
                    <!-- 기본 정보 -->
                    <div class="bg-gray-50 rounded-lg p-6 mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">기본 정보</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">전공</div>
                                <div class="font-semibold text-gray-800">${requirement.major}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">학위과정</div>
                                <div class="font-semibold text-gray-800">${requirement.degree}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 학점 요건 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">학점 요건</h4>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-blue-600 mb-2">${requirement.minCredits}학점</div>
                                <div class="text-sm text-gray-600">최소 이수 학점</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 논문 요건 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">논문 요건</h4>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between p-4 border rounded-lg ${requirement.thesisRequired ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}">
                                <span class="text-sm font-medium text-gray-700">학위논문 제출</span>
                                <span class="text-lg font-bold ${requirement.thesisRequired ? 'text-green-600' : 'text-gray-500'}">
                                    ${requirement.thesisRequired ? '필수' : '선택'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 학술활동 요건 -->
                    <div>
                        <h4 class="text-lg font-bold text-gray-800 mb-4">학술활동 요건</h4>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-purple-50">
                                <div>
                                    <div class="font-medium text-gray-800">학술지 논문</div>
                                    <div class="text-xs text-gray-600 mt-1">KCI 등재지 이상</div>
                                </div>
                                <span class="text-2xl font-bold text-purple-600">${requirement.journalPapers}편</span>
                            </div>
                            <div class="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                                <div>
                                    <div class="font-medium text-gray-800">학술대회 논문</div>
                                    <div class="text-xs text-gray-600 mt-1">국내외 학술대회 발표</div>
                                </div>
                                <span class="text-2xl font-bold text-orange-600">${requirement.conferencePapers}편</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <button onclick="editRequirement(${requirement.id}); closeRequirementDetailModal();" 
                            class="px-4 py-2 bg-[#009DE8] text-white rounded hover:bg-[#0087c9]">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button onclick="closeRequirementDetailModal()" 
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeRequirementDetailModal() {
    const modal = document.getElementById('requirement-detail-modal');
    if (modal) modal.remove();
}

// Export
window.searchSchedule = searchSchedule;
window.resetScheduleSearch = resetScheduleSearch;
window.searchRequirement = searchRequirement;
window.resetRequirementSearch = resetRequirementSearch;
window.viewRequirementDetail = viewRequirementDetail;
window.closeRequirementDetailModal = closeRequirementDetailModal;

console.log('✅ 학사일정/졸업요건 관리 기능 로드 완료');

// ==================== 학생 상세 정보 개선 ====================

// 학생 학적 이력 상세
function viewStudentAcademicHistory(studentId) {
    const modalContent = `
        <div id="student-history-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             onclick="if(event.target.id==='student-history-modal') closeStudentHistoryModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <div class="bg-[#009DE8] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">학생 학적 이력</h3>
                    <button onclick="closeStudentHistoryModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">×</button>
                </div>
                
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px);">
                    <!-- 학생 기본 정보 -->
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <div class="grid grid-cols-4 gap-4">
                            <div>
                                <div class="text-xs text-gray-500">학번</div>
                                <div class="font-semibold">${studentId}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500">성명</div>
                                <div class="font-semibold">김철수</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500">전공</div>
                                <div class="font-semibold">교육공학</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500">학위</div>
                                <div class="font-semibold">석사</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 학적 변동 이력 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold mb-4">학적 변동 이력</h4>
                        <div class="space-y-3">
                            <div class="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-semibold text-green-700">입학</div>
                                        <div class="text-sm text-gray-600 mt-1">2024학년도 1학기 신입생</div>
                                    </div>
                                    <div class="text-sm text-gray-500">2024-03-02</div>
                                </div>
                            </div>
                            <div class="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-semibold text-blue-700">재학</div>
                                        <div class="text-sm text-gray-600 mt-1">정상 재학 중</div>
                                    </div>
                                    <div class="text-sm text-gray-500">현재</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 학기별 성적 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold mb-4">학기별 성적</h4>
                        <table class="min-w-full text-sm border table-fixed">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-2 px-4 border">학기</th>
                                    <th class="py-2 px-4 border">이수학점</th>
                                    <th class="py-2 px-4 border">평점</th>
                                    <th class="py-2 px-4 border">상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="py-2 px-4 border">2024-1</td>
                                    <td class="py-2 px-4 border">9</td>
                                    <td class="py-2 px-4 border">4.2</td>
                                    <td class="py-2 px-4 border">이수완료</td>
                                </tr>
                                <tr>
                                    <td class="py-2 px-4 border">2024-2</td>
                                    <td class="py-2 px-4 border">9</td>
                                    <td class="py-2 px-4 border">4.0</td>
                                    <td class="py-2 px-4 border">이수완료</td>
                                </tr>
                                <tr>
                                    <td class="py-2 px-4 border">2025-1</td>
                                    <td class="py-2 px-4 border">6</td>
                                    <td class="py-2 px-4 border">진행중</td>
                                    <td class="py-2 px-4 border">재학중</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- 논문 진행 이력 -->
                    <div>
                        <h4 class="text-lg font-bold mb-4">논문 진행 이력</h4>
                        <div class="space-y-2">
                            <div class="flex items-center gap-3 p-3 bg-green-50 rounded">
                                <span class="text-green-600">✓</span>
                                <span class="flex-1">연구계획서 승인</span>
                                <span class="text-sm text-gray-500">2024-09-28</span>
                            </div>
                            <div class="flex items-center gap-3 p-3 bg-blue-50 rounded">
                                <span class="text-blue-600">●</span>
                                <span class="flex-1">중간논문 진행중</span>
                                <span class="text-sm text-gray-500">진행중</span>
                            </div>
                            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded">
                                <span class="text-gray-400">○</span>
                                <span class="flex-1 text-gray-500">최종논문 대기</span>
                                <span class="text-sm text-gray-400">-</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end">
                    <button onclick="closeStudentHistoryModal()" 
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function closeStudentHistoryModal() {
    const modal = document.getElementById('student-history-modal');
    if (modal) modal.remove();
}

window.viewStudentAcademicHistory = viewStudentAcademicHistory;
window.closeStudentHistoryModal = closeStudentHistoryModal;

console.log('✅ 학생 상세 정보 개선 로드 완료');

// ==================== 통계 대시보드 개선 ====================

// 통계 차트 표시
function showStatisticsChart(type) {
    const modalContent = `
        <div id="stats-chart-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             onclick="if(event.target.id==='stats-chart-modal') closeStatsChartModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <div class="bg-[#009DE8] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">통계 분석</h3>
                    <button onclick="closeStatsChartModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">×</button>
                </div>
                
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px);">
                    <!-- 학과별 학생 분포 -->
                    <div class="mb-8">
                        <h4 class="text-lg font-bold mb-4">학과별 학생 분포</h4>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm">교육공학</span>
                                    <span class="text-sm font-semibold">45명 (30%)</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-4">
                                    <div class="bg-[#009DE8] h-4 rounded-full" style="width: 30%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm">경영학</span>
                                    <span class="text-sm font-semibold">60명 (40%)</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-4">
                                    <div class="bg-green-600 h-4 rounded-full" style="width: 40%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm">컴퓨터공학</span>
                                    <span class="text-sm font-semibold">45명 (30%)</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-4">
                                    <div class="bg-purple-600 h-4 rounded-full" style="width: 30%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 학위과정별 분포 -->
                    <div class="mb-8">
                        <h4 class="text-lg font-bold mb-4">학위과정별 분포</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-blue-50 rounded-lg p-6 text-center">
                                <div class="text-4xl font-bold text-blue-600 mb-2">90명</div>
                                <div class="text-sm text-gray-600">석사과정 (60%)</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-6 text-center">
                                <div class="text-4xl font-bold text-green-600 mb-2">60명</div>
                                <div class="text-sm text-gray-600">박사과정 (40%)</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 논문 진행 단계 -->
                    <div class="mb-8">
                        <h4 class="text-lg font-bold mb-4">논문 진행 단계별 현황</h4>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-yellow-50 rounded-lg p-4 text-center border-l-4 border-yellow-500">
                                <div class="text-2xl font-bold text-yellow-600">45</div>
                                <div class="text-sm text-gray-600">연구계획서</div>
                            </div>
                            <div class="bg-blue-50 rounded-lg p-4 text-center border-l-4 border-blue-500">
                                <div class="text-2xl font-bold text-blue-600">60</div>
                                <div class="text-sm text-gray-600">중간논문</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-4 text-center border-l-4 border-green-500">
                                <div class="text-2xl font-bold text-green-600">45</div>
                                <div class="text-sm text-gray-600">최종논문</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 월별 논문지도 현황 -->
                    <div>
                        <h4 class="text-lg font-bold mb-4">최근 6개월 논문지도 추이</h4>
                        <div class="flex items-end justify-between h-64 border-b border-l border-gray-300 p-4">
                            ${[120, 145, 130, 150, 165, 180].map((value, idx) => `
                                <div class="flex flex-col items-center flex-1">
                                    <div class="bg-blue-500 w-12 rounded-t transition-all hover:bg-[#009DE8]" 
                                         style="height: ${value/2}px"
                                         title="${value}건"></div>
                                    <div class="text-xs text-gray-600 mt-2">${idx+6}월</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end">
                    <button onclick="closeStatsChartModal()" 
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function closeStatsChartModal() {
    const modal = document.getElementById('stats-chart-modal');
    if (modal) modal.remove();
}

window.showStatisticsChart = showStatisticsChart;
window.closeStatsChartModal = closeStatsChartModal;

console.log('✅ 통계 대시보드 개선 로드 완료');

// ==================== 관리자 - 학생 상세 정보 ====================

// 학생 상세 정보 모달
function viewStudentDetail(studentId) {
    // 학생 기본 정보
    const students = [
        { id: '2024001', name: '김철수', major: '교육공학', degree: '석사', advisor: '홍길동', 
          admissionYear: '2024', semester: 2, credits: 24, requiredCredits: 36, 
          currentStage: '중간논문 작성', submissionCount: 5 },
        { id: '2024002', name: '이영희', major: '경영학', degree: '박사', advisor: '최교수',
          admissionYear: '2024', semester: 1, credits: 30, requiredCredits: 36,
          currentStage: '최종논문 작성', submissionCount: 8 },
        { id: '2024003', name: '홍길동', major: '컴퓨터공학', degree: '석사', advisor: '박교수',
          admissionYear: '2024', semester: 1, credits: 18, requiredCredits: 36,
          currentStage: '연구계획서 작성', submissionCount: 2 }
    ];
    
    const student = students.find(s => s.id === studentId) || students[0];
    
    // 학점 진행률
    const creditProgress = (student.credits / student.requiredCredits * 100).toFixed(0);
    
    // 심사 이력 (샘플)
    const reviewHistory = [
        { type: '연구계획서', date: '2024-09-15', result: '합격', score: 85 },
        { type: '중간논문', date: '2024-11-10', result: '진행중', score: null }
    ];
    
    // 온라인 피드백 통계
    const feedbackStats = {
        total: student.submissionCount,
        pending: 2,
        completed: student.submissionCount - 2,
        avgCopyKiller: 8.5,
        avgGptKiller: 1.8
    };
    
    const modalHtml = `
        <div id="student-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             onclick="if(event.target.id==='student-detail-modal') closeStudentDetailModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <!-- 헤더 -->
                <div class="bg-[#009DE8] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">학생 상세 정보: ${student.name}</h3>
                    <button onclick="closeStudentDetailModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>
                
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px);">
                    <!-- 기본 정보 -->
                    <div class="bg-gray-50 rounded-lg p-6 mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">기본 정보</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">학번</div>
                                <div class="font-semibold text-gray-800">${student.id}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">성명</div>
                                <div class="font-semibold text-gray-800">${student.name}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">전공</div>
                                <div class="font-semibold text-gray-800">${student.major}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">학위과정</div>
                                <div class="font-semibold text-gray-800">${student.degree}</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">지도교수</div>
                                <div class="font-semibold text-gray-800">${student.advisor}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">입학년도</div>
                                <div class="font-semibold text-gray-800">${student.admissionYear}학년도</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">현재 학기</div>
                                <div class="font-semibold text-gray-800">${student.semester}학기</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 학업 현황 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">학업 현황</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- 학점 이수 -->
                            <div class="bg-blue-50 rounded-lg p-4">
                                <div class="text-sm text-gray-600 mb-2">이수 학점</div>
                                <div class="text-3xl font-bold text-blue-600 mb-2">
                                    ${student.credits} / ${student.requiredCredits}
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
                                    <div class="bg-[#009DE8] h-3 rounded-full" style="width: ${creditProgress}%"></div>
                                </div>
                                <div class="text-sm text-gray-600">${creditProgress}% 완료</div>
                            </div>
                            
                            <!-- 논문 진행 -->
                            <div class="bg-green-50 rounded-lg p-4">
                                <div class="text-sm text-gray-600 mb-2">논문 진행 상황</div>
                                <div class="text-xl font-bold text-green-600 mb-2">
                                    ${student.currentStage}
                                </div>
                                <div class="text-sm text-gray-600 mt-3">
                                    총 제출 횟수: ${student.submissionCount}회
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 심사 이력 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">심사 이력</h4>
                        <div class="space-y-3">
                            ${reviewHistory.map(review => `
                                <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <div class="font-semibold text-gray-800">${review.type}</div>
                                        <div class="text-sm text-gray-600 mt-1">${review.date}</div>
                                    </div>
                                    <div class="text-right">
                                        <span class="px-3 py-1 rounded-full text-sm font-semibold ${
                                            review.result === '합격' ? 'bg-green-100 text-green-700' :
                                            review.result === '진행중' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }">
                                            ${review.result}
                                        </span>
                                        ${review.score ? `
                                            <div class="text-lg font-bold text-gray-800 mt-1">${review.score}점</div>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 온라인 피드백 통계 -->
                    <div>
                        <h4 class="text-lg font-bold text-gray-800 mb-4">온라인 피드백 통계</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="bg-white border rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-blue-600">${feedbackStats.total}</div>
                                <div class="text-xs text-gray-600 mt-1">총 제출</div>
                            </div>
                            <div class="bg-white border rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-green-600">${feedbackStats.completed}</div>
                                <div class="text-xs text-gray-600 mt-1">피드백 완료</div>
                            </div>
                            <div class="bg-white border rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-orange-600">${feedbackStats.pending}</div>
                                <div class="text-xs text-gray-600 mt-1">답변 대기</div>
                            </div>
                            <div class="bg-white border rounded-lg p-4 text-center">
                                <div class="text-lg font-bold text-red-600">${feedbackStats.avgCopyKiller}%</div>
                                <div class="text-xs text-gray-600 mt-1">평균 CopyKiller</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <button onclick="editStudent('${student.id}')" 
                            class="px-4 py-2 bg-[#009DE8] text-white rounded hover:bg-[#0087c9]">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button onclick="manageCredits('${student.id}')" 
                            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        <i class="fas fa-book"></i> 학점관리
                    </button>
                    <button onclick="closeStudentDetailModal()" 
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 학생 정보 수정 (추후 구현)
function editStudent(studentId) {
    showNotification(`학생 ID ${studentId} 정보 수정 (추후 구현)`, 'info');
}

// 학점 관리 (추후 구현)
function manageCredits(studentId) {
    showNotification(`학생 ID ${studentId} 학점 관리 (추후 구현)`, 'info');
}

// 모달 닫기
function closeStudentDetailModal() {
    const modal = document.getElementById('student-detail-modal');
    if (modal) modal.remove();
}

// Export
window.viewStudentDetail = viewStudentDetail;
window.editStudent = editStudent;
window.manageCredits = manageCredits;
window.closeStudentDetailModal = closeStudentDetailModal;

console.log('✅ 관리자 - 학생 상세 정보 기능 로드 완료');

// ==================== 관리자 - 통계 대시보드 ====================

// 통계 대시보드 모달
function showStatisticsDashboard() {
    // 통계 데이터
    const stats = {
        students: {
            total: 120,
            master: 80,
            phd: 40,
            byMajor: [
                { major: '교육공학', count: 35 },
                { major: '경영학', count: 45 },
                { major: '컴퓨터공학', count: 40 }
            ]
        },
        thesis: {
            proposal: 30,
            interim: 50,
            final: 40
        },
        review: {
            inProgress: 15,
            completed: 85,
            passRate: 92
        },
        feedback: {
            pending: 8,
            completed: 120,
            avgResponseTime: 2.3
        }
    };
    
    const modalHtml = `
        <div id="statistics-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             onclick="if(event.target.id==='statistics-modal') closeStatisticsModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <!-- 헤더 -->
                <div class="bg-[#009DE8] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">통계 대시보드</h3>
                    <button onclick="closeStatisticsModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>
                
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px);">
                    <!-- 학생 현황 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">학생 현황</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div class="bg-blue-50 rounded-lg p-6 text-center">
                                <div class="text-4xl font-bold text-blue-600 mb-2">${stats.students.total}</div>
                                <div class="text-sm text-gray-600">총 학생 수</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-6 text-center">
                                <div class="text-4xl font-bold text-green-600 mb-2">${stats.students.master}</div>
                                <div class="text-sm text-gray-600">석사과정</div>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-6 text-center">
                                <div class="text-4xl font-bold text-purple-600 mb-2">${stats.students.phd}</div>
                                <div class="text-sm text-gray-600">박사과정</div>
                            </div>
                        </div>
                        
                        <!-- 학과별 분포 -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h5 class="font-semibold text-gray-800 mb-3">학과별 분포</h5>
                            <div class="space-y-3">
                                ${stats.students.byMajor.map(item => {
                                    const percentage = (item.count / stats.students.total * 100).toFixed(0);
                                    return `
                                        <div>
                                            <div class="flex justify-between text-sm mb-1">
                                                <span class="text-gray-700">${item.major}</span>
                                                <span class="text-gray-600 font-semibold">${item.count}명 (${percentage}%)</span>
                                            </div>
                                            <div class="w-full bg-gray-200 rounded-full h-2">
                                                <div class="bg-[#009DE8] h-2 rounded-full" style="width: ${percentage}%"></div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 논문 진행 단계 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">논문 진행 단계별 분포</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-white border-2 border-blue-200 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-blue-600 mb-2">${stats.thesis.proposal}</div>
                                <div class="text-sm text-gray-600">연구계획서 단계</div>
                                <div class="text-xs text-gray-500 mt-1">${(stats.thesis.proposal / stats.students.total * 100).toFixed(0)}%</div>
                            </div>
                            <div class="bg-white border-2 border-purple-200 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-purple-600 mb-2">${stats.thesis.interim}</div>
                                <div class="text-sm text-gray-600">중간논문 단계</div>
                                <div class="text-xs text-gray-500 mt-1">${(stats.thesis.interim / stats.students.total * 100).toFixed(0)}%</div>
                            </div>
                            <div class="bg-white border-2 border-green-200 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-green-600 mb-2">${stats.thesis.final}</div>
                                <div class="text-sm text-gray-600">최종논문 단계</div>
                                <div class="text-xs text-gray-500 mt-1">${(stats.thesis.final / stats.students.total * 100).toFixed(0)}%</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 심사 현황 -->
                    <div class="mb-6">
                        <h4 class="text-lg font-bold text-gray-800 mb-4">심사 현황</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-orange-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-orange-600 mb-2">${stats.review.inProgress}</div>
                                <div class="text-sm text-gray-600">심사 진행중</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-green-600 mb-2">${stats.review.completed}</div>
                                <div class="text-sm text-gray-600">심사 완료</div>
                            </div>
                            <div class="bg-blue-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-blue-600 mb-2">${stats.review.passRate}%</div>
                                <div class="text-sm text-gray-600">합격률</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 온라인 피드백 -->
                    <div>
                        <h4 class="text-lg font-bold text-gray-800 mb-4">온라인 피드백 통계</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-red-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-red-600 mb-2">${stats.feedback.pending}</div>
                                <div class="text-sm text-gray-600">답변 대기중</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-green-600 mb-2">${stats.feedback.completed}</div>
                                <div class="text-sm text-gray-600">피드백 완료</div>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-purple-600 mb-2">${stats.feedback.avgResponseTime}</div>
                                <div class="text-sm text-gray-600">평균 응답 시간 (일)</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <button onclick="exportStatistics()" 
                            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        <i class="fas fa-download"></i> 통계 내보내기
                    </button>
                    <button onclick="closeStatisticsModal()" 
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 통계 내보내기 (추후 구현)
function exportStatistics() {
    showNotification('통계 데이터를 Excel 파일로 내보냅니다 (추후 구현)', 'info');
}

// 모달 닫기
function closeStatisticsModal() {
    const modal = document.getElementById('statistics-modal');
    if (modal) modal.remove();
}

// Export
window.showStatisticsDashboard = showStatisticsDashboard;
window.exportStatistics = exportStatistics;
window.closeStatisticsModal = closeStatisticsModal;

console.log('✅ 관리자 - 통계 대시보드 기능 로드 완료');

// ========== 학위논문 심사 상세 보기 (위원/위원장 뷰) ==========

// Helper functions for evaluation display
function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR');
}

function calculateWeightedScore(score, maxScore, weight) {
    return (score / maxScore) * weight;
}

function viewThesisReviewDetail(itemId, viewType, thesisType) {
    console.log('viewThesisReviewDetail called:', { itemId, viewType, thesisType });
    console.log('itemId type:', typeof itemId, 'value:', itemId);

    const dataSource = thesisType === 'plan' ? appData.submissions.thesisPlan :
                       thesisType === 'mid' ? appData.submissions.midThesis :
                       appData.submissions.finalThesis;

    console.log('dataSource length:', dataSource ? dataSource.length : 'null');

    if (dataSource && dataSource.length > 0) {
        console.log('First item in dataSource:', dataSource[0]);
        console.log('First item id type:', typeof dataSource[0].id, 'value:', dataSource[0].id);
        console.log('All IDs in dataSource:', dataSource.map(d => ({ id: d.id, type: typeof d.id })));
    }

    // ID 비교 시 타입을 동일하게 맞춤 (문자열로 통일)
    const item = dataSource.find(d => String(d.id) === String(itemId));

    console.log('item found:', item ? 'yes' : 'no');

    if (!item) {
        console.error('Item not found for id:', itemId);
        console.error('Available items:', dataSource.map(d => ({ id: d.id, studentName: d.studentName, thesisTitle: d.thesisTitle })));
        alert('심사 정보를 찾을 수 없습니다.\n\n사용 가능한 ID: ' + dataSource.map(d => d.id).join(', '));
        return;
    }

    const isChair = viewType === 'chair';
    const modalTitle = (item.thesisTitle || '논문제목 미정') + ' - ' + (isChair ? '심사위원장' : '심사위원') + ' 평가 (읽기 전용)';

    const reviewers = item.reviewers || [
        { name: item.advisor || '홍길동', role: '주심', status: '완료', score: 88, comment: '연구 설계가 잘 되어 있습니다.' },
        { name: '이교수', role: '부심', status: '완료', score: 85, comment: '이론적 배경이 충실합니다.' },
        { name: '박교수', role: '부심', status: '대기', score: null, comment: null }
    ];

    let content = '<div class="space-y-6">';

    // 논문 정보 (professor 화면과 동일한 구조)
    content += '<div class="bg-gray-50 rounded-lg p-4">';
    content += '<h4 class="font-bold text-gray-800 mb-3">📄 논문 정보</h4>';
    content += '<div class="space-y-2 text-sm">';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">대학원</div><div class="flex-1">' + (item.graduate || '일반대학원') + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">전공/학과</div><div class="flex-1">' + item.major + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">학위과정</div><div class="flex-1">' + item.degree + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">학번</div><div class="flex-1">' + item.studentId + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">학생명</div><div class="flex-1 font-medium">' + item.studentName + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">논문제목</div><div class="flex-1 font-medium">' + (item.thesisTitle || '미정') + '</div></div>';
    if (item.copyKiller || item.gptKiller) {
        const copyKiller = item.copyKiller || 0;
        const gptKiller = item.gptKiller || 0;
        content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">표절/AI 검사</div><div class="flex-1">CopyKiller: ' + copyKiller + '% / GPT Killer: ' + gptKiller + '%</div></div>';
    }
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">지도교수</div><div class="flex-1">' + item.advisor + '</div></div>';
    content += '<div class="flex border-b border-gray-200 pb-2"><div class="w-32 text-gray-600 font-semibold">제출일</div><div class="flex-1">' + (item.submitDate || '-') + '</div></div>';
    content += '</div></div>';

    if (!isChair) {
        // 심사위원 평가 - 교수 화면과 동일한 UI (점수형 평가)
        const template = {
            name: '학위논문 심사 평가표',
            submissionType: item.submissionType || '최종논문',
            passingScore: 75,
            categories: [
                { id: 'cat1', name: '연구의 독창성', description: '연구 주제의 참신성과 기여도', weight: 25, maxScore: 10 },
                { id: 'cat2', name: '연구방법의 타당성', description: '연구 방법론의 적절성과 신뢰성', weight: 25, maxScore: 10 },
                { id: 'cat3', name: '결과의 명확성', description: '연구 결과의 명확성과 논리성', weight: 20, maxScore: 10 },
                { id: 'cat4', name: '논리적 구성', description: '논문의 전체적인 논리적 구성', weight: 15, maxScore: 10 },
                { id: 'cat5', name: '학술적 기여도', description: '학문 분야에 대한 기여 정도', weight: 15, maxScore: 10 }
            ]
        };

        const evaluation = {
            evaluationType: 'score',
            submittedAt: item.submitDate || new Date().toISOString(),
            totalScore: reviewers[0]?.score || 88,
            scores: [
                { categoryId: 'cat1', score: 9, comment: '연구 주제가 참신하고 학술적 가치가 높습니다.' },
                { categoryId: 'cat2', score: 8.5, comment: '연구 방법론이 체계적이고 적절합니다.' },
                { categoryId: 'cat3', score: 9, comment: '연구 결과가 명확하게 제시되었습니다.' },
                { categoryId: 'cat4', score: 8.5, comment: '논문의 구성이 논리적입니다.' },
                { categoryId: 'cat5', score: 9, comment: '학문 분야에 유의미한 기여를 합니다.' }
            ],
            overallComment: { combined: reviewers[0]?.comment || '전반적으로 우수한 연구이며, 학위논문으로서의 요건을 충족합니다.' }
        };

        // 교수 UI와 동일한 구조로 렌더링
        content += '<div class="bg-white rounded-lg shadow-md p-6 mb-6">';
        content += '<div class="flex items-center justify-between mb-4">';
        content += '<h3 class="text-lg font-bold text-gray-800">' + template.name + '</h3>';
        content += '<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">';
        content += '제출 완료 (' + formatDateTime(evaluation.submittedAt) + ')';
        content += '</span></div>';

        content += '<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">';
        content += '<p class="text-sm text-blue-800">';
        content += '<strong>안내:</strong> 각 항목별로 0-10점 사이의 점수를 입력해주세요. ';
        content += '가중치가 적용되어 최종 점수가 계산됩니다.';
        content += '</p></div>';

        content += '<div id="evaluation-categories" class="space-y-4">';
        template.categories.forEach((category, index) => {
            const scoreData = evaluation.scores.find(s => s.categoryId === category.id);
            const currentScore = scoreData?.score || 0;
            const currentComment = scoreData?.comment || '';

            content += '<div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">';

            // Grid: 제목 영역 | 가중치
            content += '<div class="grid grid-cols-[1fr_80px] gap-4 mb-4">';
            content += '<div>';
            content += '<h4 class="font-bold text-gray-800 mb-1">' + (index + 1) + '. ' + category.name + '</h4>';
            content += '<p class="text-sm text-gray-600">' + category.description + '</p>';
            content += '</div>';
            content += '<div class="text-right">';
            content += '<div class="text-xs text-gray-500">가중치</div>';
            content += '<div class="text-lg font-bold text-blue-600">' + category.weight + '%</div>';
            content += '</div></div>';

            // Grid: 점수 입력 (읽기 모드)
            content += '<div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">';
            content += '<label class="text-sm font-medium text-gray-700">점수:</label>';
            content += '<input type="number" class="score-input w-full bg-gray-50" min="0" max="' + category.maxScore + '" step="0.5" value="' + currentScore + '" disabled>';
            content += '<span class="text-sm text-gray-600">/ ' + category.maxScore + '점</span>';
            content += '<span></span>';
            content += '</div>';

            // Grid: 가중 점수 표시
            content += '<div class="grid grid-cols-[60px_1fr] gap-3 items-center mb-4">';
            content += '<span></span>';
            content += '<div class="text-sm text-gray-500">';
            content += '→ 가중 점수: ';
            content += '<span class="weighted-score text-base font-bold text-blue-600">';
            content += calculateWeightedScore(currentScore, category.maxScore, category.weight).toFixed(1) + '점';
            content += '</span>';
            content += '<span class="text-xs text-gray-400">(' + category.weight + '% 적용)</span>';
            content += '</div></div>';

            // 평가 의견 (읽기 모드)
            content += '<div>';
            content += '<label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>';
            content += '<textarea class="score-comment w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" rows="2" disabled>' + currentComment + '</textarea>';
            content += '</div>';

            content += '</div>';
        });
        content += '</div>';

        // 총점
        content += '<div class="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">';
        content += '<div class="flex items-center justify-between">';
        content += '<h4 class="text-lg font-bold text-gray-800">총점</h4>';
        content += '<div class="text-3xl font-bold text-blue-600">' + evaluation.totalScore + '점</div>';
        content += '</div>';
        content += '<div class="text-sm text-gray-600 mt-1 text-right">100점 만점 (합격 기준: ' + template.passingScore + '점)</div>';
        content += '</div>';

        // 종합 의견 (읽기 모드)
        content += '<div class="mt-6">';
        content += '<h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>';
        content += '<textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50" rows="4" disabled>' + (evaluation.overallComment.combined || evaluation.overallComment.conclusion || '') + '</textarea>';
        content += '</div>';
        content += '</div>';
    }

    if (isChair) {
        // 심사위원장 평가 - 교수 화면과 동일한 UI (각 심사위원의 평가 + 종합 평가)
        const template = {
            name: '학위논문 심사 평가표',
            submissionType: item.submissionType || '최종논문',
            passingScore: 75,
            categories: [
                { id: 'cat1', name: '연구의 독창성', description: '연구 주제의 참신성과 기여도', weight: 25, maxScore: 10 },
                { id: 'cat2', name: '연구방법의 타당성', description: '연구 방법론의 적절성과 신뢰성', weight: 25, maxScore: 10 },
                { id: 'cat3', name: '결과의 명확성', description: '연구 결과의 명확성과 논리성', weight: 20, maxScore: 10 },
                { id: 'cat4', name: '논리적 구성', description: '논문의 전체적인 논리적 구성', weight: 15, maxScore: 10 },
                { id: 'cat5', name: '학술적 기여도', description: '학문 분야에 대한 기여 정도', weight: 15, maxScore: 10 }
            ]
        };

        // 각 심사위원의 평가 표시
        reviewers.forEach((reviewer, memberIndex) => {
            if (reviewer.status !== '완료') return;

            const evaluation = {
                professorName: reviewer.name,
                role: reviewer.role === '주심' ? 'chair' : 'member',
                evaluationType: 'score',
                submittedAt: item.submitDate || new Date().toISOString(),
                totalScore: reviewer.score || 88,
                scores: [
                    { categoryId: 'cat1', score: 9, comment: '연구 주제가 참신하고 학술적 가치가 높습니다.' },
                    { categoryId: 'cat2', score: 8.5, comment: '연구 방법론이 체계적이고 적절합니다.' },
                    { categoryId: 'cat3', score: 9, comment: '연구 결과가 명확하게 제시되었습니다.' },
                    { categoryId: 'cat4', score: 8.5, comment: '논문의 구성이 논리적입니다.' },
                    { categoryId: 'cat5', score: 9, comment: '학문 분야에 유의미한 기여를 합니다.' }
                ],
                overallComment: reviewer.comment || '전반적으로 우수한 연구이며, 학위논문으로서의 요건을 충족합니다.'
            };

            // 교수 UI의 renderCommitteeMemberEvaluation과 동일한 구조
            content += '<div class="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">';
            content += '<div class="flex items-center justify-between mb-4">';
            content += '<div>';
            content += '<h3 class="text-lg font-bold text-gray-800">' + evaluation.professorName + ' (' + (evaluation.role === 'chair' ? '심사위원장' : '심사위원') + ')</h3>';
            content += '<p class="text-sm text-gray-600">' + template.name + '</p>';
            content += '</div>';
            content += '<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">';
            content += '제출 완료 (' + formatDateTime(evaluation.submittedAt) + ')';
            content += '</span></div>';

            content += '<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">';
            content += '<p class="text-sm text-blue-800">';
            content += '<strong>안내:</strong> 각 항목별로 0-10점 사이의 점수를 입력해주세요. ';
            content += '가중치가 적용되어 최종 점수가 계산됩니다.';
            content += '</p></div>';

            content += '<div class="space-y-4">';
            template.categories.forEach((category, index) => {
                const scoreData = evaluation.scores.find(s => s.categoryId === category.id);
                const currentScore = scoreData?.score || 0;
                const currentComment = scoreData?.comment || '';

                content += '<div class="evaluation-item bg-white border border-gray-300 rounded-lg p-4">';
                content += '<div class="grid grid-cols-[1fr_80px] gap-4 mb-4">';
                content += '<div>';
                content += '<h4 class="font-bold text-gray-800 mb-1">' + (index + 1) + '. ' + category.name + '</h4>';
                content += '<p class="text-sm text-gray-600">' + category.description + '</p>';
                content += '</div>';
                content += '<div class="text-right">';
                content += '<div class="text-xs text-gray-500">가중치</div>';
                content += '<div class="text-lg font-bold text-blue-600">' + category.weight + '%</div>';
                content += '</div></div>';

                content += '<div class="grid grid-cols-[60px_100px_80px_1fr] gap-3 items-center mb-2">';
                content += '<label class="text-sm font-medium text-gray-700">점수:</label>';
                content += '<input type="number" class="w-full bg-gray-50" min="0" max="' + category.maxScore + '" step="0.5" value="' + currentScore + '" disabled>';
                content += '<span class="text-sm text-gray-600">/ ' + category.maxScore + '점</span>';
                content += '<span></span>';
                content += '</div>';

                content += '<div class="grid grid-cols-[60px_1fr] gap-3 items-center mb-4">';
                content += '<span></span>';
                content += '<div class="text-sm text-gray-500">';
                content += '→ 가중 점수: ';
                content += '<span class="text-base font-bold text-blue-600">' + calculateWeightedScore(currentScore, category.maxScore, category.weight).toFixed(1) + '점</span>';
                content += '<span class="text-xs text-gray-400">(' + category.weight + '% 적용)</span>';
                content += '</div></div>';

                content += '<div>';
                content += '<label class="text-sm font-medium text-gray-700 mb-1 block">평가 의견:</label>';
                content += '<textarea class="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" rows="2" disabled>' + currentComment + '</textarea>';
                content += '</div>';

                content += '</div>';
            });
            content += '</div>';

            content += '<div class="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">';
            content += '<div class="flex items-center justify-between">';
            content += '<h4 class="text-lg font-bold text-gray-800">총점</h4>';
            content += '<div class="text-3xl font-bold text-blue-600">' + evaluation.totalScore + '점</div>';
            content += '</div>';
            content += '<div class="text-sm text-gray-600 mt-1 text-right">100점 만점 (합격 기준: ' + template.passingScore + '점)</div>';
            content += '</div>';

            content += '<div class="mt-6">';
            content += '<h4 class="text-sm font-bold text-gray-800 mb-3">종합 의견</h4>';
            content += '<textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50" rows="3" disabled>' + evaluation.overallComment + '</textarea>';
            content += '</div>';

            content += '</div>';
        });

        // 종합 평가 섹션 (교수 UI의 renderChairSummary와 동일)
        const completedReviewers = reviewers.filter(r => r.score);
        const avgScore = completedReviewers.length > 0 ? completedReviewers.reduce((sum, r) => sum + r.score, 0) / completedReviewers.length : 0;
        const threshold = (item.submissionType || template.submissionType) === '최종논문' ? 80 : 75;
        const systemDecision = avgScore >= threshold ? '합격' : '불합격';

        content += '<div class="bg-white rounded-lg shadow-md p-6 mb-6">';
        content += '<h3 class="text-lg font-bold text-gray-800 mb-4">심사위원장 종합 평가</h3>';

        content += '<div class="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mb-6">';
        content += '<div class="grid grid-cols-3 gap-6 text-center">';
        content += '<div>';
        content += '<div class="text-sm text-gray-600 mb-1">평균 점수</div>';
        content += '<div class="text-3xl font-bold text-blue-600">' + avgScore.toFixed(1) + '점</div>';
        content += '</div>';
        content += '<div>';
        content += '<div class="text-sm text-gray-600 mb-1">합격 기준</div>';
        content += '<div class="text-3xl font-bold text-gray-800">' + threshold + '점</div>';
        content += '</div>';
        content += '<div>';
        content += '<div class="text-sm text-gray-600 mb-1">시스템 판정</div>';
        content += '<div class="text-2xl font-bold ' + (systemDecision === '합격' ? 'text-green-600' : 'text-red-600') + '">' + systemDecision + '</div>';
        content += '</div>';
        content += '</div></div>';

        content += '<div class="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">';
        content += '<h4 class="font-bold text-gray-800 mb-3">최종 결정 (읽기 전용)</h4>';
        content += '<div class="space-y-3">';
        content += '<div class="flex items-center gap-3">';

        const currentDecision = item.result || '승인';
        const decisions = ['승인', '보류', '반려'];
        decisions.forEach(decision => {
            const isSelected = decision === currentDecision;
            const borderColor = decision === '승인' ? 'border-green-400' : decision === '보류' ? 'border-yellow-400' : 'border-red-400';
            content += '<label class="flex items-center gap-2 p-3 bg-white rounded-lg flex-1 border-2 ' + (isSelected ? borderColor : 'border-gray-300') + '">';
            content += '<input type="radio" name="chairDecision" value="' + decision + '" ' + (isSelected ? 'checked' : '') + ' disabled class="w-4 h-4">';
            content += '<span class="font-medium">' + decision + '</span>';
            content += '</label>';
        });

        content += '</div>';
        content += '<div>';
        content += '<label class="text-sm font-medium text-gray-700 mb-1 block">결정 사유:</label>';
        content += '<textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50" rows="4" disabled>전반적으로 연구의 질이 우수하며 학위 논문으로서의 요건을 충족합니다. 승인합니다.</textarea>';
        content += '</div>';
        content += '</div></div>';

        content += '</div>';
    }

    content += '<div class="bg-yellow-50 border border-yellow-200 rounded p-3"><div class="flex items-start">';
    content += '<svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>';
    content += '<div class="flex-1"><p class="text-sm font-medium text-yellow-800">읽기 전용 모드</p>';
    content += '<p class="text-xs text-yellow-700 mt-1">이 화면은 교수의 평가 내용을 조회하기 위한 읽기 전용 화면입니다. 수정이 필요한 경우 교수 계정으로 로그인하여 진행해주세요.</p></div></div></div></div>';

    console.log('About to call openModal with title:', modalTitle);
    console.log('openModal function exists:', typeof openModal);
    console.log('closeModal function exists:', typeof closeModal);

    openModal(modalTitle, content, '닫기', () => { closeModal(); }, true);

    console.log('openModal called successfully');
}

window.viewThesisReviewDetail = viewThesisReviewDetail;
console.log('✅ 학위논문 심사 상세 보기 기능 로드 완료');

// ==================== 알림 시스템 ====================

/**
 * 화면에 알림 메시지를 표시하는 함수
 * @param {string} message - 표시할 메시지
 * @param {string} type - 알림 타입 ('success', 'error', 'info', 'warning')
 */
function showNotification(message, type = 'info') {
    // 기존 알림이 있으면 제거
    const existingNotification = document.getElementById('notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 타입별 색상 설정
    const typeColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const typeIcons = {
        success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
        error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
        info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
    };

    const bgColor = typeColors[type] || typeColors.info;
    const icon = typeIcons[type] || typeIcons.info;

    // 알림 HTML 생성
    const notificationHtml = `
        <div id="notification-toast"
             class="fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in"
             style="min-width: 300px; max-width: 500px; z-index: 9999; animation: slideIn 0.3s ease-out;">
            <div class="flex-shrink-0">
                ${icon}
            </div>
            <div class="flex-1 text-sm font-medium">
                ${message}
            </div>
            <button onclick="document.getElementById('notification-toast').remove()"
                    class="flex-shrink-0 ml-2 hover:opacity-75">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <style>
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        </style>
    `;

    // 알림을 body에 추가
    document.body.insertAdjacentHTML('beforeend', notificationHtml);

    // 3초 후 자동으로 제거
    setTimeout(() => {
        const notification = document.getElementById('notification-toast');
        if (notification) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Export
window.showNotification = showNotification;

console.log('✅ 알림 시스템 로드 완료');

// ========== 체크박스 전체 선택/해제 함수 ==========
function toggleSelectAllAdmin(viewType, checked) {
    const classMap = {
        'thesisPlan': '.thesis-plan-checkbox',
        'midThesis': '.mid-thesis-checkbox',
        'finalThesis': '.final-thesis-checkbox',
        'journalSubmission': '.journal-submission-checkbox'
    };

    const selector = classMap[viewType];
    if (!selector) return;

    const checkboxes = document.querySelectorAll(selector);
    checkboxes.forEach(cb => cb.checked = checked);
}

// ========== 선택한 학생에게 알림 발송 ==========
function sendNotificationToSelectedStudents(viewType) {
    const classMap = {
        'thesisPlan': '.thesis-plan-checkbox',
        'midThesis': '.mid-thesis-checkbox',
        'finalThesis': '.final-thesis-checkbox',
        'journalSubmission': '.journal-submission-checkbox'
    };

    const selector = classMap[viewType];
    if (!selector) return;

    const checkboxes = document.querySelectorAll(selector + ':checked');

    if (checkboxes.length === 0) {
        showNotification('학생을 선택해주세요', 'warning');
        return;
    }

    const selectedStudents = Array.from(checkboxes).map(cb => ({
        id: cb.value,
        studentId: cb.dataset.studentId,
        name: cb.dataset.studentName
    }));

    openAdminNotificationModal(selectedStudents, viewType);
}

// ========== 알림 발송 모달 열기 ==========
function openAdminNotificationModal(students, viewType) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'admin-notification-modal';

    const studentList = students.map(s => `${s.name} (${s.studentId})`).join(', ');

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; width: 90%;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">알림 발송</h3>
                    <button onclick="closeAdminNotificationModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
            </div>

            <div class="p-6">
                <!-- 발송 대상 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        발송 대상 (${students.length}명)
                    </label>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                        <p class="text-sm text-gray-700">${studentList}</p>
                    </div>
                </div>

                <!-- 발송 방법 선택 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        발송 방법 *
                    </label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="admin-notification-type" value="kakao" checked class="rounded-full">
                            <span class="text-sm text-gray-700">카카오톡</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="admin-notification-type" value="sms" class="rounded-full">
                            <span class="text-sm text-gray-700">SMS</span>
                        </label>
                    </div>
                </div>

                <!-- 알림 제목 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        알림 제목 *
                    </label>
                    <input type="text" id="admin-notification-title"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                           placeholder="예: 논문 제출 안내">
                </div>

                <!-- 메시지 내용 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        메시지 내용 *
                    </label>
                    <textarea id="admin-notification-message"
                              rows="6"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                              placeholder="발송할 메시지 내용을 입력하세요."></textarea>
                    <p class="text-xs text-gray-500 mt-1">
                        <span id="admin-message-length">0</span> / 1000자
                    </p>
                </div>

                <!-- 버튼 -->
                <div class="flex gap-2 justify-end pt-4">
                    <button onclick="closeAdminNotificationModal()" class="btn-cancel">취소</button>
                    <button onclick="submitAdminNotification()" class="btn-primary">발송</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 글자 수 카운터
    const messageInput = document.getElementById('admin-notification-message');
    const lengthDisplay = document.getElementById('admin-message-length');

    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        lengthDisplay.textContent = length;

        if (length > 1000) {
            lengthDisplay.classList.add('text-red-600');
        } else {
            lengthDisplay.classList.remove('text-red-600');
        }
    });

    // 전역 변수에 콜백 저장
    window._adminNotificationCallback = { students, viewType };
}

// ========== 알림 발송 모달 닫기 ==========
function closeAdminNotificationModal() {
    const modal = document.getElementById('admin-notification-modal');
    if (modal) {
        modal.remove();
    }
    window._adminNotificationCallback = null;
}

// ========== 알림 발송 실행 ==========
function submitAdminNotification() {
    const title = document.getElementById('admin-notification-title').value.trim();
    const message = document.getElementById('admin-notification-message').value.trim();
    const notificationType = document.querySelector('input[name="admin-notification-type"]:checked').value;

    if (!title) {
        showNotification('알림 제목을 입력해주세요', 'warning');
        return;
    }

    if (!message) {
        showNotification('메시지 내용을 입력해주세요', 'warning');
        return;
    }

    if (message.length > 1000) {
        showNotification('메시지는 1000자 이내로 입력해주세요', 'warning');
        return;
    }

    const { students, viewType } = window._adminNotificationCallback;
    const notifTypeText = notificationType === 'kakao' ? '카카오톡' : 'SMS';

    // 실제로는 서버에 알림 전송 요청
    console.log('관리자 알림 발송:', {
        viewType,
        students,
        title,
        message,
        type: notificationType
    });

    showNotification(`${students.length}명의 학생에게 ${notifTypeText} 알림이 발송되었습니다`, 'success');

    // 체크박스 초기화
    const classMap = {
        'thesisPlan': '.thesis-plan-checkbox',
        'midThesis': '.mid-thesis-checkbox',
        'finalThesis': '.final-thesis-checkbox',
        'journalSubmission': '.journal-submission-checkbox'
    };

    const selector = classMap[viewType];
    if (selector) {
        const checkboxes = document.querySelectorAll(selector);
        checkboxes.forEach(cb => cb.checked = false);

        const selectAllIds = {
            'thesisPlan': 'select-all-thesis-plan',
            'midThesis': 'select-all-mid-thesis',
            'finalThesis': 'select-all-final-thesis',
            'journalSubmission': 'select-all-journal-submission'
        };

        const selectAll = document.getElementById(selectAllIds[viewType]);
        if (selectAll) selectAll.checked = false;
    }

    closeAdminNotificationModal();
}

// Export
window.toggleSelectAllAdmin = toggleSelectAllAdmin;
window.sendNotificationToSelectedStudents = sendNotificationToSelectedStudents;
window.openAdminNotificationModal = openAdminNotificationModal;

// ========== 권한 관리 ==========

// 직원 검색
function searchEmployee() {
    const employeeId = document.getElementById('search-employee-id').value.trim();
    const employeeName = document.getElementById('search-employee-name').value.trim();
    const resultDiv = document.getElementById('search-result');

    if (!employeeId && !employeeName) {
        resultDiv.innerHTML = '<p class="text-sm text-red-600">교번 또는 이름을 입력해주세요.</p>';
        return;
    }

    // 직원 디렉토리에서 검색
    const results = appData.employeeDirectory.filter(emp => {
        const matchId = !employeeId || emp.employeeId.toLowerCase().includes(employeeId.toLowerCase());
        const matchName = !employeeName || emp.name.includes(employeeName);
        return matchId && matchName && !emp.isAdmin; // 이미 관리자인 경우 제외
    });

    if (results.length === 0) {
        resultDiv.innerHTML = '<p class="text-sm text-gray-600">검색 결과가 없습니다.</p>';
        return;
    }

    resultDiv.innerHTML = `
        <div class="bg-white border border-gray-300 rounded-lg p-4 mt-2">
            <h4 class="font-semibold text-gray-800 mb-2">검색 결과 (${results.length}건)</h4>
            <div class="space-y-2">
                ${results.map(emp => `
                    <div class="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100">
                        <div>
                            <p class="font-medium text-gray-800">${emp.name}</p>
                            <p class="text-sm text-gray-600">교번: ${emp.employeeId} | 소속: ${emp.department}</p>
                        </div>
                        <button onclick="addAdmin('${emp.employeeId}', '${emp.name}', '${emp.department}')"
                                class="bg-[#009DE8] text-white px-3 py-1 rounded text-sm hover:bg-[#0087c9]">
                            관리자 추가
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 관리자 추가
function addAdmin(employeeId, name, department) {
    // 이미 관리자인지 확인
    const exists = appData.administrators.find(a => a.employeeId === employeeId);
    if (exists) {
        showNotification('이미 관리자로 등록되어 있습니다.', 'warning');
        return;
    }

    // 새 관리자 ID 생성
    const newId = Math.max(...appData.administrators.map(a => a.id), 0) + 1;

    // 관리자 추가
    const newAdmin = {
        id: newId,
        employeeId: employeeId,
        name: name,
        department: department,
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
    };

    appData.administrators.push(newAdmin);

    // 모든 화면에 대해 기본 권한 설정 (모두 false)
    appData.screenList.forEach(screen => {
        appData.permissions.push({
            adminId: newId,
            screenId: screen.id,
            hasAccess: false
        });
    });

    // 직원 디렉토리에서 관리자로 표시
    const emp = appData.employeeDirectory.find(e => e.employeeId === employeeId);
    if (emp) {
        emp.isAdmin = true;
    }

    showNotification(`${name}님이 관리자로 추가되었습니다.`, 'success');

    // 검색 결과 초기화
    document.getElementById('search-employee-id').value = '';
    document.getElementById('search-employee-name').value = '';
    document.getElementById('search-result').innerHTML = '';

    // 화면 새로고침
    switchView('permissionManagement');
}

// 권한 업데이트
function updatePermission(adminId, screenId, hasAccess) {
    const permission = appData.permissions.find(p => p.adminId == adminId && p.screenId === screenId);
    if (permission) {
        permission.hasAccess = hasAccess;
    }
}

// 관리자 권한 저장
function saveAdminPermissions(adminId) {
    const admin = appData.administrators.find(a => a.id == adminId);
    if (!admin) {
        console.error('관리자를 찾을 수 없습니다:', adminId);
        return;
    }

    // 실제로는 서버에 저장 요청
    console.log('권한 저장:', {
        adminId: adminId,
        permissions: appData.permissions.filter(p => p.adminId == adminId)
    });

    showNotification(`${admin.name}님의 권한이 저장되었습니다.`, 'success');
}

// 관리자 삭제
function removeAdmin(adminId) {
    const admin = appData.administrators.find(a => a.id == adminId);
    if (!admin) {
        console.error('관리자를 찾을 수 없습니다:', adminId);
        return;
    }

    if (!confirm(`${admin.name}님을 관리자에서 완전히 삭제하시겠습니까?\n\n⚠️ 삭제 후 재등록이 필요합니다.\n권한만 중지하려면 "권한 중지" 버튼을 사용하세요.`)) {
        return;
    }

    // 관리자 삭제
    appData.administrators = appData.administrators.filter(a => a.id != adminId);

    // 권한 삭제
    appData.permissions = appData.permissions.filter(p => p.adminId != adminId);

    // 직원 디렉토리에서 관리자 표시 제거
    const emp = appData.employeeDirectory.find(e => e.employeeId === admin.employeeId);
    if (emp) {
        emp.isAdmin = false;
    }

    showNotification(`${admin.name}님이 관리자에서 완전히 삭제되었습니다.`, 'success');

    // 화면 새로고침
    switchView('permissionManagement');
}

// 관리자 권한 중지
function suspendAdmin(adminId) {
    const admin = appData.administrators.find(a => a.id == adminId);
    if (!admin) {
        console.error('관리자를 찾을 수 없습니다:', adminId);
        return;
    }

    if (!confirm(`${admin.name}님의 모든 권한을 중지하시겠습니까?\n\n권한 중지 후 언제든 다시 활성화할 수 있습니다.`)) {
        return;
    }

    // 상태를 suspended로 변경
    admin.status = 'suspended';

    // 모든 권한 비활성화
    const permissions = appData.permissions.filter(p => p.adminId == adminId);
    permissions.forEach(p => {
        p.hasAccess = false;
    });

    showNotification(`${admin.name}님의 권한이 중지되었습니다.`, 'success');

    // 화면 새로고침
    switchView('permissionManagement');
}

// 관리자 권한 활성화
function activateAdmin(adminId) {
    const admin = appData.administrators.find(a => a.id == adminId);
    if (!admin) {
        console.error('관리자를 찾을 수 없습니다:', adminId);
        return;
    }

    if (!confirm(`${admin.name}님의 권한을 다시 활성화하시겠습니까?\n\n활성화 후 개별 화면 권한을 설정해야 합니다.`)) {
        return;
    }

    // 상태를 active로 변경
    admin.status = 'active';

    showNotification(`${admin.name}님의 권한이 활성화되었습니다. 개별 화면 권한을 설정해주세요.`, 'success');

    // 화면 새로고침
    switchView('permissionManagement');
}

// Export
window.searchEmployee = searchEmployee;
window.addAdmin = addAdmin;
window.updatePermission = updatePermission;
window.saveAdminPermissions = saveAdminPermissions;
window.removeAdmin = removeAdmin;
window.suspendAdmin = suspendAdmin;
window.activateAdmin = activateAdmin;
window.closeAdminNotificationModal = closeAdminNotificationModal;
window.submitAdminNotification = submitAdminNotification;

console.log('✅ 관리자 알림 발송 기능 로드 완료');

// ========== 대리로그인 ==========

// 대리로그인 사용자 필터링
function filterProxyLoginUsers() {
    const filterType = document.getElementById('proxy-login-filter')?.value || 'all';
    const searchTerm = document.getElementById('proxy-login-search')?.value.toLowerCase() || '';
    const rows = document.querySelectorAll('.proxy-login-row');

    rows.forEach(row => {
        const type = row.dataset.type;
        const searchText = row.dataset.search.toLowerCase();

        const matchType = filterType === 'all' || type === filterType;
        const matchSearch = searchText.includes(searchTerm);

        if (matchType && matchSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 대리로그인 실행
function proxyLogin(userId, userType, userName, loginUrl) {
    if (!confirm(`${userName}(${userType})님의 계정으로 대리 로그인하시겠습니까?\n\n새 창에서 해당 사용자의 화면이 열립니다.`)) {
        return;
    }

    // 대리로그인 정보를 세션 스토리지에 저장
    const proxyLoginData = {
        userId: userId,
        userType: userType,
        userName: userName,
        loginTime: new Date().toISOString(),
        isProxyLogin: true
    };

    // 새 창으로 열기 전에 데이터 저장
    try {
        localStorage.setItem('proxyLoginData', JSON.stringify(proxyLoginData));

        // 새 창으로 해당 사용자의 화면 열기
        const newWindow = window.open(loginUrl, `_blank_${userId}`, 'width=1200,height=800,scrollbars=yes,resizable=yes');

        if (!newWindow) {
            showNotification('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.', 'warning');
        } else {
            showNotification(`${userName}(${userType})님으로 대리 로그인되었습니다.`, 'success');
        }
    } catch (error) {
        console.error('대리로그인 오류:', error);
        showNotification('대리로그인 중 오류가 발생했습니다.', 'error');
    }
}

// Export
window.filterProxyLoginUsers = filterProxyLoginUsers;
window.proxyLogin = proxyLogin;

console.log('✅ 대리로그인 기능 로드 완료');

// ========== 지도 학생 관리 기능 ==========

// 지도교수 배정 검색 함수
function searchAdvisorAssignment() {
    // 검색 조건 수집
    const year = document.getElementById('advisor-search-year')?.value || '';
    const semester = document.getElementById('advisor-search-semester')?.value || '';
    const collegeType = document.getElementById('advisor-search-college-type')?.value || '';
    const graduate = document.getElementById('advisor-search-graduate')?.value || '';
    const majorCategory = document.getElementById('advisor-search-major-category')?.value || '';
    const department = document.getElementById('advisor-search-department')?.value || '';
    const degree = document.getElementById('advisor-search-degree')?.value || '';
    const status = document.getElementById('advisor-search-status')?.value || '';
    const assignmentStatus = document.getElementById('advisor-search-assignment-status')?.value || '';
    const studentId = document.getElementById('advisor-search-student-id')?.value.trim() || '';
    const studentName = document.getElementById('advisor-search-student-name')?.value.trim() || '';
    const advisorName = document.getElementById('advisor-search-advisor-name')?.value.trim() || '';

    // Mock 데이터가 없으면 종료
    if (typeof mockResearchProposals === 'undefined' || typeof mockAdvisorAssignments === 'undefined') {
        showAlert('Mock 데이터가 로드되지 않았습니다.');
        return;
    }

    // 연구계획서와 배정 상태 통합
    const proposalsWithAssignment = mockResearchProposals.map(proposal => {
        const assignment = mockAdvisorAssignments.find(a => a.studentId === proposal.studentId);
        const student = mockStudents.find(s => s.id === proposal.studentId);
        return {
            ...proposal,
            academicYear: student?.academicYear || '-',
            semesterCount: student?.semesterCount || 0,
            studentStatus: student?.status || 'active',
            assignment: assignment || null
        };
    });

    // 필터링
    window.filteredAdvisorData = proposalsWithAssignment.filter(item => {
        // 학년도
        if (year && item.academicYear !== year) return false;

        // 학기 (현재 Mock 데이터에 semester 필드 없음 - 추후 추가 필요)
        // if (semester && item.semester !== semester) return false;

        // 대학구분 (현재 Mock 데이터에 없음 - 추후 추가 필요)
        // if (collegeType && item.collegeType !== collegeType) return false;

        // 계열/대학원 (현재 Mock 데이터에 없음 - 추후 추가 필요)
        // if (graduate && item.graduate !== graduate) return false;

        // 학부(과)전공 (현재 Mock 데이터에 없음 - 추후 추가 필요)
        // if (majorCategory && item.majorCategory !== majorCategory) return false;

        // 학과/전공
        if (department && item.department !== department) return false;

        // 학위과정
        if (degree && item.degreeType !== degree) return false;

        // 학적상태
        if (status) {
            const statusKorean = item.studentStatus === 'active' ? '재학' : '휴학';
            if (status !== statusKorean) return false;
        }

        // 배정상태
        if (assignmentStatus) {
            const hasMainAdvisor = item.assignment && item.assignment.mainAdvisor;
            if (assignmentStatus === '배정완료' && !hasMainAdvisor) return false;
            if (assignmentStatus === '미배정' && hasMainAdvisor) return false;
        }

        // 학번
        if (studentId && !item.studentNumber.includes(studentId)) return false;

        // 성명
        if (studentName && !item.studentName.includes(studentName)) return false;

        // 지도교수명
        if (advisorName) {
            const mainAdvisorName = item.assignment?.mainAdvisor?.name || '';
            if (!mainAdvisorName.includes(advisorName)) return false;
        }

        return true;
    });

    // 뷰 재렌더링
    switchView('advisorAssignment');
    showNotification(`검색 결과: ${window.filteredAdvisorData.length}건`, 'success');
}

// 지도교수 배정 검색 초기화
function resetAdvisorSearch() {
    // 검색 필드 초기화
    document.querySelectorAll('input[id^="advisor-search"], select[id^="advisor-search"]').forEach(field => {
        if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
        } else if (field.type !== 'checkbox') {
            field.value = '';
        }
    });

    // 필터링된 데이터 초기화
    window.filteredAdvisorData = null;

    // 뷰 재렌더링
    switchView('advisorAssignment');
    showAlert('검색 조건이 초기화되었습니다.');
}

// 학생 상세정보 모달 표시 (지도단계 + 제출 문서 포함)
function showStudentInfo(studentId) {
    console.log('학생 상세정보 조회:', studentId);

    // Mock 데이터에서 학생 정보 찾기
    const student = mockStudents.find(s => s.id === studentId);

    if (!student) {
        showNotification('학생 정보를 찾을 수 없습니다.', 'error');
        return;
    }

    // 학생별 지도단계 진행 현황 조회
    const stageProgress = (window.mockStudentStageProgress || []).find(sp => sp.studentId === studentId);

    // 학생별 제출 문서 조회
    const submissions = (window.mockStageSubmissions || [])
        .filter(s => s.studentId === studentId)
        .sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));

    // 지도단계 기본값 (데이터가 없는 경우)
    const defaultStages = student.degreeType === '박사'
        ? [
            { name: '연구계획서', status: 'completed' },
            { name: '프로포절', status: 'completed' },
            { name: '예비심사1차', status: 'current' },
            { name: '예비심사2차', status: 'upcoming' },
            { name: '발표논문게재', status: 'upcoming' },
            { name: '본심사1차', status: 'upcoming' },
            { name: '본심사2차', status: 'upcoming' }
        ]
        : [
            { name: '연구계획서', status: 'completed' },
            { name: '프로포절', status: 'current' },
            { name: '예비심사', status: 'upcoming' },
            { name: '본심사', status: 'upcoming' },
            { name: '졸업', status: 'upcoming' }
        ];

    const stages = stageProgress ? stageProgress.stages : defaultStages;

    // 심사결과 텍스트/배지
    const getReviewResultText = (result) => ({ approved: '승인', rejected: '반려', pending: '대기', reviewing: '심사중' }[result] || result);
    const getReviewResultBadgeClass = (result) => ({
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        reviewing: 'bg-blue-100 text-blue-800'
    }[result] || 'bg-gray-100 text-gray-800');

    // 지도단계 SVG 생성
    const stageWidth = 90;
    const totalWidth = stages.length * stageWidth;
    const stageSvgHtml = `
        <div style="overflow-x: auto; padding: 10px 0;">
            <svg width="${totalWidth}" height="80" viewBox="0 0 ${totalWidth} 80" style="display: block; margin: 0 auto; min-width: ${totalWidth}px;">
                ${stages.map((stage, i) => {
                    const x = i * stageWidth + 45;
                    const color = stage.status === 'completed' ? '#2E7D32' : stage.status === 'current' ? '#0288D1' : '#E5E7EB';
                    const fill = stage.status === 'upcoming' ? 'white' : color;
                    const stroke = color;
                    return `
                        ${i < stages.length - 1 ? `<line x1="${x + 12}" y1="25" x2="${x + stageWidth - 12}" y2="25" stroke="${stages[i+1].status === 'upcoming' ? '#E5E7EB' : '#2E7D32'}" stroke-width="2"/>` : ''}
                        <circle cx="${x}" cy="25" r="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
                        ${stage.status === 'completed' ? `<path d="M${x-4} 25 L${x-1} 28 L${x+5} 21" stroke="white" stroke-width="2" fill="none"/>` : ''}
                        <text x="${x}" y="50" text-anchor="middle" font-size="10" fill="#374151">${stage.name}</text>
                        <text x="${x}" y="65" text-anchor="middle" font-size="8" fill="${stage.status === 'completed' ? '#2E7D32' : stage.status === 'current' ? '#0288D1' : '#9CA3AF'}">
                            ${stage.status === 'completed' ? '완료' : stage.status === 'current' ? '진행중' : '예정'}
                        </text>
                    `;
                }).join('')}
            </svg>
        </div>
        <div style="display: flex; justify-content: center; gap: 20px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
            <span style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #6B7280;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #2E7D32;"></span> 완료
            </span>
            <span style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #6B7280;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #0288D1;"></span> 진행중
            </span>
            <span style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #6B7280;">
                <span style="width: 10px; height: 10px; border-radius: 50%; border: 2px solid #E5E7EB; background: white;"></span> 예정
            </span>
        </div>
    `;

    // 제출 문서 HTML
    const submissionsHtml = submissions.length > 0
        ? submissions.map(s => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #F8FAFC; border-radius: 6px; margin-bottom: 6px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 3px; font-size: 12px;">
                        📄 ${s.subStageName}
                    </div>
                    <div style="font-size: 11px; color: #4B5563;">
                        ${s.title} | ${s.submittedDate} |
                        <span class="px-2 py-0.5 rounded text-xs font-medium ${getReviewResultBadgeClass(s.reviewResult)}">${getReviewResultText(s.reviewResult)}</span>
                    </div>
                </div>
                ${s.fileUrl ? `
                    <a href="${s.fileUrl}" target="_blank"
                       style="padding: 5px 10px; background: #6A0028; color: white; border-radius: 4px; font-size: 11px; text-decoration: none;">
                        📥
                    </a>
                ` : ''}
            </div>
        `).join('')
        : '<p style="color: #9CA3AF; text-align: center; padding: 12px; font-size: 13px;">제출된 문서가 없습니다.</p>';

    // 모달 내용 렌더링
    const content = `
        <div class="info-section">
            <div class="info-row">
                <div class="info-label">학번</div>
                <div class="info-value">${student.studentNumber}</div>
            </div>
            <div class="info-row">
                <div class="info-label">성명</div>
                <div class="info-value">${student.name}</div>
            </div>
            <div class="info-row">
                <div class="info-label">학과/전공</div>
                <div class="info-value">${student.department}</div>
            </div>
            <div class="info-row">
                <div class="info-label">학위과정</div>
                <div class="info-value">
                    <span class="px-2 py-1 rounded text-xs font-medium ${student.degreeType === '석사' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">
                        ${student.degreeType}
                    </span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">학년</div>
                <div class="info-value">${student.grade}</div>
            </div>
            <div class="info-row">
                <div class="info-label">입학일</div>
                <div class="info-value">${student.admissionDate}</div>
            </div>
            <div class="info-row">
                <div class="info-label">이메일</div>
                <div class="info-value">${student.email}</div>
            </div>
            <div class="info-row">
                <div class="info-label">전화번호</div>
                <div class="info-value">${student.phone}</div>
            </div>
            <div class="info-row">
                <div class="info-label">상태</div>
                <div class="info-value">
                    <span class="px-2 py-1 rounded text-xs font-medium ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${student.status === 'active' ? '재학' : '휴학'}
                    </span>
                </div>
            </div>
        </div>

        <!-- 지도단계 섹션 -->
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
            <h4 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">지도단계</h4>
            <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px;">
                ${stageSvgHtml}
            </div>
        </div>

        <!-- 제출 문서 섹션 -->
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
            <h4 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">제출 문서</h4>
            <div style="max-height: 200px; overflow-y: auto;">
                ${submissionsHtml}
            </div>
        </div>
    `;

    document.getElementById('student-info-content').innerHTML = content;
    document.getElementById('student-info-modal').classList.add('active');
}

// 학생 상세정보 모달 닫기
function closeStudentInfoModal() {
    document.getElementById('student-info-modal').classList.remove('active');
}

// 연구계획서 상세 페이지 조회 (모달 팝업)
function viewProposalDetail(proposalId) {
    console.log('연구계획서 상세 조회:', proposalId);

    // Mock 데이터에서 연구계획서 찾기
    const proposal = mockResearchProposals.find(p => p.id === proposalId);

    if (!proposal) {
        showNotification('연구계획서를 찾을 수 없습니다.', 'error');
        return;
    }

    // 학생 정보 찾기
    const student = mockStudents.find(s => s.id === proposal.studentId);

    // 배정 정보 찾기
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
                        <span>${proposal.degreeType || '-'}</span>
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
                                <span class="text-gray-900 font-medium">일반대학원</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                                <span class="text-gray-900 font-medium">-</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                                <span class="text-gray-900 font-medium">${student?.department || '-'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                                <span class="text-gray-900 font-medium">${proposal.degreeType}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                                <span class="text-gray-900 font-medium">${student?.status === 'active' ? '재학' : '휴학'}</span>
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
                                <span class="text-gray-900 font-medium">
                                    ${assignment && assignment.mainAdvisor ? `${assignment.mainAdvisor.name} (주)` : '-'}${assignment && assignment.coAdvisors.length > 0 ? `, ${assignment.coAdvisors.map(c => `${c.name} (부)`).join(', ')}` : ''}
                                </span>
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

// ==============================================
// 논문 지도 단계 관리 함수
// ==============================================

// 단계 관리 컨텐츠 렌더링
function renderStageManagementContent() {
    const container = document.getElementById('stage-management-content');
    if (!container) return;

    // Mock 데이터 확인
    if (typeof mockStudentStageAssignments === 'undefined' || typeof mockThesisStages === 'undefined') {
        container.innerHTML = `
            <div class="p-6">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p class="text-red-600">Mock 데이터가 로드되지 않았습니다.</p>
                    <p class="text-sm text-red-500 mt-2">admin/assets/js/mockData.js 파일을 확인하세요.</p>
                </div>
            </div>
        `;
        return;
    }

    // 필터링된 데이터 사용 (전체 학생 대상)
    let data = window.filteredStageData || mockStudentStageAssignments;

    // 지도 단계별로 그룹핑하여 테이블 행 생성
    const tableRows = renderStudentTableRows(data);

    container.innerHTML = `
        <!-- 검색 영역 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
            <div class="grid grid-cols-5 gap-3">
                <!-- 1행: 5개 필드 -->
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
                    <div class="flex gap-2 flex-1">
                        <select id="stage-search-year" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                        <select id="stage-search-semester" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="1">1학기</option>
                            <option value="2">2학기</option>
                        </select>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                    <select id="stage-search-college-type" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        <option value="">전체</option>
                        <option value="일반대학원">일반대학원</option>
                        <option value="특수대학원">특수대학원</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                    <select id="stage-search-graduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        <option value="">전체</option>
                        <option value="일반대학원">일반대학원</option>
                        <option value="교육대학원">교육대학원</option>
                        <option value="산업정보대학원">산업정보대학원</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                    <select id="stage-search-major-category" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        <option value="">전체</option>
                        <option value="공과대학">공과대학</option>
                        <option value="사범대학">사범대학</option>
                        <option value="인문대학">인문대학</option>
                        <option value="사회과학대학">사회과학대학</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                    <select id="stage-search-department" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        <option value="">전체</option>
                        ${mockDepartmentNames.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                    </select>
                </div>

                <!-- 2행: 5개 필드 -->
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                    <select id="stage-search-degree" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        <option value="">전체</option>
                        <option value="석사">석사</option>
                        <option value="박사">박사</option>
                        <option value="석박통합">석박통합</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                    <select id="stage-search-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        <option value="">전체</option>
                        <option value="재학">재학</option>
                        <option value="휴학">휴학</option>
                        <option value="수료">수료</option>
                        <option value="졸업">졸업</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                    <input type="text" id="stage-search-student-id" placeholder="학번"
                           class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                    <input type="text" id="stage-search-student-name" placeholder="성명"
                           class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                    <input type="text" id="stage-search-advisor" placeholder="지도교수명"
                           class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                </div>

                <!-- 3행: 버튼만 -->
                <div class="col-span-4"></div>
                <div class="flex items-center justify-end">
                    <button onclick="searchStageManagement()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                        <i class="fas fa-search mr-1"></i>조회
                    </button>
                </div>
            </div>
        </div>

        <!-- 테이블 컨테이너 -->
        <div class="table-container">
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">논문 지도 학생 현황 목록</h3>
                    <span class="table-count">(총 ${data.length}명)</span>
                    <span id="selected-count" class="ml-2"></span>
                </div>
                <div class="table-header-right">
                    <!-- 통합: 지도 단계 설정 (미배정/배정 학생 모두 처리) -->
                    <button onclick="setThesisStage()"
                            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-4 py-2 rounded text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            id="set-thesis-stage-btn"
                            disabled>
                        지도 단계 설정
                    </button>

                    <!-- 기존: 단계 이동 -->
                    <button onclick="bulkChangeStage()"
                            class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-4 py-2 rounded text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            id="bulk-change-stage-btn"
                            disabled>
                        단계 이동
                    </button>
                </div>
            </div>

            <!-- 학생 목록 테이블 -->
            <div class="table-scroll">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th class="text-center" style="width: 50px;">
                                <input type="checkbox"
                                       onchange="toggleAllStageSelection(this.checked)"
                                       class="rounded border-gray-300 text-primary focus:ring-primary">
                            </th>
                            <th style="width: 50px;">순번</th>
                            <th style="width: 70px;">학년도</th>
                            <th style="width: 60px;">학기</th>
                            <th style="width: 100px;">대학구분</th>
                            <th style="width: 110px;">계열/대학원</th>
                            <th style="width: 120px;">학부(과)전공</th>
                            <th style="width: 120px;">학과/전공</th>
                            <th style="width: 80px;">학위과정</th>
                            <th style="width: 80px;">학적상태</th>
                            <th style="width: 90px;">학번</th>
                            <th style="width: 70px;">성명</th>
                            <th style="width: 90px;">지도교수명</th>
                            <th style="width: 130px;">지도단계</th>
                            <th style="width: 160px;">현재단계</th>
                            <th style="width: 160px;">다음단계</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>

                ${data.length === 0 ? `
                    <div class="text-center py-8 text-gray-500">
                        ${window.filteredStageData ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 테이블 행 렌더링 (단순 버전)
function renderStudentTableRows(data) {
    let rows = '';

    data.forEach((item, index) => {
        const student = mockStudents.find(s => s.id === item.studentId);
        const workflow = mockThesisStages.find(w => w.id === item.thesisStageId);

        // 지도교수 정보 (mockAdvisors에서 가져오기, 없으면 기본값)
        const advisor = student?.advisorId ? mockAdvisors?.find(a => a.id === student.advisorId) : null;
        const advisorName = advisor?.name || '-';

        // 학기 정보 (1학기/2학기)
        const semester = student?.currentSemester || '-';
        const semesterText = semester !== '-' ? `${semester}학기` : '-';

        // 학적상태 (mockStudents에 있으면 사용, 없으면 '재학')
        const studentStatus = student?.status || '재학';

        rows += `
            <tr class="hover:bg-gray-50 transition-colors"
                data-student-id="${item.studentId}"
                data-workflow-id="${item.thesisStageId}">
                <!-- 선택 체크박스 -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                    <input type="checkbox"
                           class="stage-checkbox rounded border-gray-300 text-primary focus:ring-primary"
                           value="${item.studentId}"
                           onchange="updateBulkStageChangeButton()">
                </td>

                <!-- 순번 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    ${index + 1}
                </td>

                <!-- 학년도 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${student?.academicYear || '-'}
                </td>

                <!-- 학기 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${semesterText}
                </td>

                <!-- 대학구분 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${student?.collegeType || '-'}
                </td>

                <!-- 계열/대학원 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${student?.division || '-'}
                </td>

                <!-- 학부(과)전공 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${student?.faculty || '-'}
                </td>

                <!-- 학과/전공 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.department}
                </td>

                <!-- 학위과정 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.degreeType}
                </td>

                <!-- 학적상태 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${studentStatus}
                </td>

                <!-- 학번 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.studentNumber}
                </td>

                <!-- 성명 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <a href="#" onclick="event.stopPropagation(); showStudentDetailModal({stdNo:'${item.studentNumber}', name:'${item.studentName}', dept:'${item.department}', degree:'${item.degreeType}', stage:'${(item.currentStageName || "-").replace(/'/g, "\\'")}', status:'${studentStatus}', advisor:'${advisorName}'}); return false;" class="text-primary hover:underline cursor-pointer">${item.studentName}</a>
                </td>

                <!-- 지도교수명 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${advisorName}
                </td>

                <!-- 지도단계 (기존 "적용단계") -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${workflow?.name || '-'}
                </td>

                <!-- 현재단계 -->
                <td class="px-6 py-4 text-sm text-gray-900">
                    ${item.currentStageName
                        ? item.currentStageName
                        : item.thesisStageId
                            ? '-'
                            : '<span class="font-medium text-red-600">미배정</span>'
                    }
                </td>

                <!-- 다음단계 (신규 추가) -->
                <td class="px-6 py-4 text-sm text-gray-900">
                    ${(() => {
                        // Case 1: 지도단계가 배정되지 않은 경우
                        if (!item.thesisStageId || !workflow) {
                            return '<span class="font-medium text-red-600">미배정</span>';
                        }

                        // Case 2: 현재단계가 없는 경우 (아직 시작 안함)
                        if (!item.currentStageOrder || !item.currentStageName) {
                            return '-';
                        }

                        // Case 3: 다음단계 찾기
                        const nextStageOrder = item.currentStageOrder + 1;
                        const nextStage = workflow.stages.find(s => s.order === nextStageOrder);

                        // Case 4: 다음단계가 있으면 표시, 없으면 "완료"
                        if (nextStage) {
                            return nextStage.name;
                        } else {
                            // 마지막 단계인 경우
                            return '<span class="text-blue-600">완료</span>';
                        }
                    })()}
                </td>
            </tr>
        `;
    });

    return rows;
}

// 고유한 단계 이름 목록 가져오기
function getUniqueStageNames() {
    if (typeof mockThesisStages === 'undefined') return [];

    const stages = new Set();
    mockThesisStages.forEach(template => {
        template.stages.forEach(stage => {
            stages.add(stage.name);
        });
    });
    return Array.from(stages);
}

// 특정 지도 단계 ID의 단계 이름 목록 가져오기
function getStageNamesByStageId(stageId) {
    if (typeof mockThesisStages === 'undefined') return [];

    const template = mockThesisStages.find(t => t.id === stageId);
    if (!template) return [];

    return template.stages.map(s => s.name);
}

// ==============================================
// 단계 관리 검색 기능
// ==============================================

// 단계 관리 검색
function searchStageManagement() {
    const year = document.getElementById('stage-search-year').value;
    const semester = document.getElementById('stage-search-semester').value;
    const collegeType = document.getElementById('stage-search-college-type').value;
    const graduate = document.getElementById('stage-search-graduate').value;
    const majorCategory = document.getElementById('stage-search-major-category').value;
    const department = document.getElementById('stage-search-department').value;
    const degree = document.getElementById('stage-search-degree').value;
    const status = document.getElementById('stage-search-status').value;
    const studentId = document.getElementById('stage-search-student-id').value.trim();
    const studentName = document.getElementById('stage-search-student-name').value.trim();
    const advisor = document.getElementById('stage-search-advisor').value.trim();

    // 모든 학생 대상으로 검색 (논문 심사 단계 제약 없음)
    let filtered = mockStudentStageAssignments.filter(item => {
        const student = mockStudents.find(s => s.id === item.studentId);

        // 학년도 필터
        if (year && student?.academicYear !== year) return false;

        // 학기 필터
        if (semester && student?.currentSemester !== parseInt(semester)) return false;

        // 대학구분 필터 (추후 데이터 구조에 따라 구현)
        // if (collegeType && ...) return false;

        // 계열/대학원 필터 (추후 데이터 구조에 따라 구현)
        // if (graduate && ...) return false;

        // 학부(과)전공 필터 (추후 데이터 구조에 따라 구현)
        // if (majorCategory && ...) return false;

        // 학과/전공 필터
        if (department && item.department !== department) return false;

        // 학위과정 필터
        if (degree && item.degreeType !== degree) return false;

        // 학적상태 필터
        if (status && student?.status !== status) return false;

        // 학번 검색
        if (studentId && !item.studentNumber.includes(studentId)) return false;

        // 성명 검색
        if (studentName && !item.studentName.includes(studentName)) return false;

        // 지도교수명 필터
        if (advisor) {
            const advisorInfo = student?.advisorId ? mockAdvisors?.find(a => a.id === student.advisorId) : null;
            const advisorName = advisorInfo?.name || '';
            if (!advisorName.includes(advisor)) return false;
        }

        return true;
    });

    window.filteredStageData = filtered;
    renderStageManagementContent();

    showNotification(`${filtered.length}명의 학생을 찾았습니다.`, 'success');
}

// ==============================================
// 단계 관리 선택 및 버튼 제어
// ==============================================

// 전체 선택/해제
function toggleAllStageSelection(checked) {
    if (!checked) {
        // 전체 해제
        const checkboxes = document.querySelectorAll('.stage-checkbox');
        checkboxes.forEach(cb => cb.checked = false);
        updateBulkStageChangeButton();
        return;
    }

    // 전체 선택 - 활성화된 체크박스만 선택
    const checkboxes = document.querySelectorAll('.stage-checkbox:not(:disabled)');
    checkboxes.forEach(cb => cb.checked = true);
    updateBulkStageChangeButton();
}

// 선택 상태에 따라 일괄 처리 버튼 활성화/비활성화
function updateBulkStageChangeButton() {
    const checkedBoxes = document.querySelectorAll('.stage-checkbox:checked');
    const count = checkedBoxes.length;

    const setThesisStageBtn = document.getElementById('set-thesis-stage-btn');
    const changeStageBtn = document.getElementById('bulk-change-stage-btn');
    const selectedCount = document.getElementById('selected-count');

    // 선택 없음 - 모든 버튼 비활성화
    if (count === 0) {
        if (setThesisStageBtn) setThesisStageBtn.disabled = true;
        if (changeStageBtn) changeStageBtn.disabled = true;
        if (selectedCount) selectedCount.textContent = '';
        return;
    }

    // 선택된 학생들 분류
    const selectedIds = Array.from(checkedBoxes).map(cb => cb.value);
    const selectedStudents = selectedIds.map(id =>
        mockStudentStageAssignments.find(s => s.studentId === id)
    );

    const unassigned = selectedStudents.filter(s => s.thesisStageId === null);
    const assigned = selectedStudents.filter(s => s.thesisStageId !== null);

    const unassignedCount = unassigned.length;
    const assignedCount = assigned.length;

    // 시나리오 1: 미배정 학생만 선택
    if (unassignedCount > 0 && assignedCount === 0) {
        if (setThesisStageBtn) setThesisStageBtn.disabled = false;
        if (changeStageBtn) changeStageBtn.disabled = true;
        if (selectedCount) {
            selectedCount.textContent = `(${count}명 선택됨 - 미배정)`;
            selectedCount.className = 'ml-2 font-semibold text-gray-600';
        }
        return;
    }

    // 시나리오 2: 배정된 학생만 선택
    if (unassignedCount === 0 && assignedCount > 0) {
        if (setThesisStageBtn) setThesisStageBtn.disabled = false;

        // 같은 지도 단계인지 확인
        const thesisStageIds = [...new Set(assigned.map(s => s.thesisStageId))];

        if (thesisStageIds.length > 1) {
            // 다른 지도 단계 혼합
            if (changeStageBtn) changeStageBtn.disabled = true;
            if (selectedCount) {
                selectedCount.textContent = `(${count}명 선택됨 - 다른 지도 단계)`;
                selectedCount.className = 'ml-2 font-semibold text-gray-600';
            }
        } else {
            // 같은 지도 단계
            const thesisStage = mockThesisStages.find(w => w.id === thesisStageIds[0]);
            if (changeStageBtn) changeStageBtn.disabled = false;
            if (selectedCount) {
                selectedCount.textContent = `(${count}명 선택됨 - ${thesisStage?.name || ''})`;
                selectedCount.className = 'ml-2 font-semibold text-primary';
            }
        }
        return;
    }

    // 시나리오 3: 혼합 선택 - 모든 버튼 비활성화
    if (setThesisStageBtn) setThesisStageBtn.disabled = true;
    if (changeStageBtn) changeStageBtn.disabled = true;
    if (selectedCount) {
        selectedCount.textContent = `(${count}명 선택됨 - 혼합 선택 불가)`;
        selectedCount.className = 'ml-2 font-semibold text-red-600';
    }
}

// ==============================================
// 단계 변경 및 이관 기능
// ==============================================

// 개별 학생 단계 변경
function changeStudentStage(studentId) {
    const student = mockStudents.find(s => s.id === studentId);
    const stageAssignment = mockStudentStageAssignments.find(s => s.studentId === studentId);

    if (!student || !stageAssignment) {
        showNotification('학생 정보를 찾을 수 없습니다.', 'error');
        return;
    }

    // 해당 학생의 학위과정에 맞는 단계 템플릿 가져오기
    const template = mockThesisStages.find(t => t.id === stageAssignment.thesisStageId);

    if (!template) {
        showNotification('단계 템플릿을 찾을 수 없습니다.', 'error');
        return;
    }

    // 단계 선택 모달 표시
    const stageOptions = template.stages.map(stage => `
        <option value="${stage.order}" ${stage.order === stageAssignment.currentStageOrder ? 'selected' : ''}>
            ${stage.order}단계 - ${stage.name}
        </option>
    `).join('');

    const modalHTML = `
        <div class="modal-overlay show" id="stage-change-modal" onclick="if(event.target === this) closeStageChangeModal()">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>단계 변경</h3>
                    <button class="modal-close" onclick="closeStageChangeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- 학생 정보 -->
                    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h3>
                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span class="text-gray-500">학년도:</span>
                                <span class="ml-2 font-medium">${student.academicYear}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">학기차:</span>
                                <span class="ml-2 font-medium">${student.semesterCount}학기</span>
                            </div>
                            <div>
                                <span class="text-gray-500">학과:</span>
                                <span class="ml-2 font-medium">${stageAssignment.department}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">학번:</span>
                                <span class="ml-2 font-medium">${student.studentNumber}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">성명:</span>
                                <span class="ml-2 font-medium">${student.name}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">학위과정:</span>
                                <span class="ml-2 font-medium">${stageAssignment.degreeType}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 현재 단계 -->
                    <div class="mb-4">
                        <p class="text-sm text-gray-600 mb-2">
                            적용 논문 심사 단계: <span class="font-semibold">${stageAssignment.thesisStageName}</span>
                        </p>
                        <p class="text-sm text-gray-500">
                            현재 단계: <span class="font-semibold text-primary">${stageAssignment.currentStageOrder}단계 - ${stageAssignment.currentStageName}</span>
                        </p>
                    </div>

                    <!-- 단계 선택 -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">변경할 단계</label>
                        <select id="new-stage-select" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                            ${stageOptions}
                        </select>
                    </div>

                    <div class="modal-footer">
                        <button onclick="closeStageChangeModal()"
                                class="btn btn-outline">
                            취소
                        </button>
                        <button onclick="confirmStageChange('${studentId}')"
                                class="btn btn-primary">
                            변경
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 단계 변경 모달 닫기
function closeStageChangeModal() {
    const modal = document.getElementById('stage-change-modal');
    if (modal) {
        modal.remove();
    }
}

// 단계 변경 확인
function confirmStageChange(studentId) {
    const newStageOrder = parseInt(document.getElementById('new-stage-select').value);
    const stageAssignment = mockStudentStageAssignments.find(s => s.studentId === studentId);

    if (!stageAssignment) {
        showNotification('학생 정보를 찾을 수 없습니다.', 'error');
        return;
    }

    const template = mockThesisStages.find(t => t.id === stageAssignment.thesisStageId);
    const newStage = template.stages.find(s => s.order === newStageOrder);

    // Mock 데이터 업데이트
    stageAssignment.currentStageOrder = newStageOrder;
    stageAssignment.currentStageName = newStage.name;
    stageAssignment.currentStageType = newStage.type;
    stageAssignment.lastUpdated = new Date().toISOString().split('T')[0];

    closeStageChangeModal();
    renderStageManagementContent();

    showNotification(`${stageAssignment.studentName} 학생의 단계가 ${newStageOrder}단계로 변경되었습니다.`, 'success');
}

// 일괄 단계 변경
function bulkChangeStage() {
    const checkboxes = document.querySelectorAll('.stage-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);

    if (selectedIds.length === 0) {
        showNotification('단계를 이동할 학생을 선택해주세요.', 'warning');
        return;
    }

    // 첫 번째 학생의 지도 단계 확인 (체크박스 제어 로직으로 이미 같은 지도 단계만 선택됨)
    const firstId = selectedIds[0];
    const firstStudent = mockStudentStageAssignments.find(s => s.studentId === firstId);
    const workflow = mockThesisStages.find(w => w.id === firstStudent.thesisStageId);

    if (!workflow) {
        showNotification('지도 단계 정보를 찾을 수 없습니다.', 'error');
        return;
    }

    // 일괄 변경 모달 표시
    showBulkStageChangeModal(selectedIds, workflow);
}

// 일괄 단계 이동 모달 표시
function showBulkStageChangeModal(selectedIds, workflow) {
    const stageOptions = workflow.stages.map(stage => `
        <option value="${stage.order}">
            ${stage.order}단계 - ${stage.name}
        </option>
    `).join('');

    const modalHTML = `
        <div class="modal-overlay show" id="bulk-stage-change-modal" onclick="if(event.target === this) closeBulkStageChangeModal()">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>일괄 단계 이동</h3>
                    <button class="modal-close" onclick="closeBulkStageChangeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- 선택 정보 -->
                    <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 class="text-sm font-semibold text-gray-700 mb-2">선택 정보</h3>
                        <div class="text-sm space-y-1">
                            <p><span class="text-gray-600">대상 학생:</span> <span class="font-semibold text-primary">${selectedIds.length}명</span></p>
                            <p><span class="text-gray-600">논문 지도 단계:</span> <span class="font-semibold">${workflow.name}</span></p>
                        </div>
                    </div>

                    <!-- 단계 선택 -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            이동할 단계 <span class="text-red-600">*</span>
                        </label>
                        <select id="bulk-new-stage-select"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                            <option value="">-- 단계 선택 --</option>
                            ${stageOptions}
                        </select>
                    </div>

                    <!-- 안내 메시지 -->
                    <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                        <div class="flex">
                            <svg class="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                            </svg>
                            <div>
                                <p class="text-amber-800 font-medium">이동 안내</p>
                                <p class="text-amber-700 mt-1">
                                    선택한 모든 학생이 지정한 단계로 일괄 이동됩니다.<br>
                                    이동 후에는 되돌릴 수 없으니 신중히 선택해주세요.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button onclick="closeBulkStageChangeModal()"
                                class="btn btn-outline">
                            취소
                        </button>
                        <button onclick="confirmBulkStageChange()"
                                class="btn btn-primary">
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 일괄 단계 이동 모달 닫기
function closeBulkStageChangeModal() {
    const modal = document.getElementById('bulk-stage-change-modal');
    if (modal) {
        modal.remove();
    }
}

// 일괄 단계 변경 확인
function confirmBulkStageChange() {
    const checkboxes = document.querySelectorAll('.stage-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    const newStageOrder = document.getElementById('bulk-new-stage-select').value;

    if (!newStageOrder) {
        showNotification('변경할 단계를 선택해주세요.', 'warning');
        return;
    }

    // 각 학생의 단계 업데이트
    let successCount = 0;
    selectedIds.forEach(studentId => {
        const assignment = mockStudentStageAssignments.find(s => s.studentId === studentId);
        if (assignment) {
            const workflow = mockThesisStages.find(w => w.id === assignment.thesisStageId);
            const newStage = workflow.stages.find(s => s.order === parseInt(newStageOrder));

            if (newStage) {
                assignment.currentStageOrder = newStage.order;
                assignment.currentStageName = newStage.name;
                assignment.canProceed = false; // 변경 후에는 진행 중으로 설정
                assignment.lastUpdated = new Date().toISOString().split('T')[0];
                successCount++;
            }
        }
    });

    closeBulkStageChangeModal();
    renderStageManagementContent();

    showNotification(`${successCount}명의 학생 단계가 변경되었습니다.`, 'success');
}

// ==============================================
// 지도 단계 설정 관련 함수 (통합)
// ==============================================

/**
 * 1. 지도 단계 일괄 설정 모달 열기 (미배정/배정 모두 처리)
 */
function setThesisStage() {
    const checkboxes = document.querySelectorAll('.stage-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);

    if (selectedIds.length === 0) {
        showNotification('지도 단계를 설정할 학생을 선택해주세요.', 'warning');
        return;
    }

    // 선택된 학생들 정보 가져오기
    const selectedStudents = mockStudentStageAssignments.filter(s =>
        selectedIds.includes(s.studentId)
    );

    // 학위과정 확인 (모두 동일해야 함)
    const degreeTypes = [...new Set(selectedStudents.map(s => s.degreeType))];
    if (degreeTypes.length > 1) {
        showNotification('같은 학위과정의 학생만 선택해주세요. (석사/박사 혼합 불가)', 'warning');
        return;
    }

    showThesisStageSetModal(selectedStudents, degreeTypes[0]);
}

/**
 * 2. 지도 단계 설정 모달 표시
 */
function showThesisStageSetModal(selectedStudents, degreeType) {
    const degreeTypeEng = degreeType === '석사' ? 'master' : 'phd';
    const thesisStages = mockThesisStages.filter(w => w.degreeType === degreeTypeEng);

    // 미배정 학생이 있는지 확인
    const hasUnassigned = selectedStudents.some(s => s.thesisStageId === null);

    const modalHTML = `
        <div class="modal-overlay show" id="thesis-stage-set-modal" onclick="if(event.target === this) closeThesisStageSetModal()">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>지도 단계 설정</h3>
                    <button class="modal-close" onclick="closeThesisStageSetModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- 경고 메시지 -->
                    <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <div class="flex">
                            <svg class="h-5 w-5 text-orange-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                            <div>
                                <p class="text-orange-800 font-medium">설정 주의사항</p>
                                <ul class="text-orange-700 mt-2 text-sm list-disc list-inside space-y-1">
                                    <li>지도 단계 설정 시 <strong>1단계로 초기화</strong>됩니다.</li>
                                    <li>이미 배정된 학생은 기존 단계가 초기화됩니다.</li>
                                    <li>이 작업은 되돌릴 수 없으니 신중히 선택해주세요.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- 선택된 학생 정보 -->
                    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="text-sm font-semibold text-gray-700 mb-3">선택된 학생 (${selectedStudents.length}명)</h3>
                        <div class="text-sm space-y-2 max-h-40 overflow-y-auto">
                            ${selectedStudents.map(s => `
                                <div class="flex justify-between items-center py-1">
                                    <span class="text-gray-900">${s.studentName} (${s.studentNumber})</span>
                                    <span class="text-gray-600">현재: ${s.thesisStageName || '미배정'}${s.thesisStageName ? ` - ${s.currentStageOrder}단계` : ''}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 지도 단계 선택 (드롭다운) -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            설정할 지도 단계 <span class="text-red-600">*</span>
                        </label>
                        <select id="thesis-stage-set-select"
                                onchange="handleThesisStageSetSelection(this.value)"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                            <option value="">지도 단계를 선택하세요</option>
                            ${thesisStages.map(stage => `
                                <option value="${stage.id}">
                                    ${stage.name} (${stage.degreeType === 'master' ? '석사' : '박사'} 과정, ${stage.stageCount}개 단계)
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- 확인 체크박스 -->
                    <div class="mb-6">
                        <label class="flex items-start gap-2">
                            <input type="checkbox"
                                   id="confirm-thesis-stage-set-checkbox"
                                   onchange="updateThesisStageSetButton()"
                                   class="mt-1 rounded border-gray-300 text-primary focus:ring-primary">
                            <span class="text-sm text-gray-700">
                                위 주의사항을 확인했으며, 지도 단계 설정 시 <strong>1단계로 ${hasUnassigned ? '시작' : '초기화'}</strong>됨을 이해했습니다.
                            </span>
                        </label>
                    </div>

                    <!-- 하단 버튼 -->
                    <div class="modal-footer">
                        <button onclick="closeThesisStageSetModal()"
                                class="btn btn-outline">
                            취소
                        </button>
                        <button onclick="confirmThesisStageSet()"
                                class="btn btn-primary"
                                id="confirm-thesis-stage-set-btn"
                                disabled>
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    window.selectedThesisStageForSet = null;
}

/**
 * 3. 지도 단계 설정 모달 닫기
 */
function closeThesisStageSetModal() {
    const modal = document.getElementById('thesis-stage-set-modal');
    if (modal) {
        modal.remove();
    }
    window.selectedThesisStageForSet = null;
}

/**
 * 4. 지도 단계 설정 드롭다운 선택 처리
 */
function handleThesisStageSetSelection(stageId) {
    window.selectedThesisStageForSet = stageId;
    updateThesisStageSetButton();
}

/**
 * 5. 지도 단계 설정 버튼 활성화/비활성화
 */
function updateThesisStageSetButton() {
    const checkbox = document.getElementById('confirm-thesis-stage-set-checkbox');
    const btn = document.getElementById('confirm-thesis-stage-set-btn');

    if (btn && checkbox) {
        btn.disabled = !(checkbox.checked && window.selectedThesisStageForSet);
    }
}

/**
 * 6. 지도 단계 설정 확인 및 실행
 */
function confirmThesisStageSet() {
    if (!window.selectedThesisStageForSet) {
        showNotification('설정할 지도 단계를 선택해주세요.', 'warning');
        return;
    }

    const checkboxes = document.querySelectorAll('.stage-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    const newThesisStage = mockThesisStages.find(w => w.id === window.selectedThesisStageForSet);
    const firstStage = newThesisStage.stages.find(s => s.order === 1);

    if (!confirm(`선택한 학생들의 지도 단계를 "${newThesisStage.name}"로 설정하시겠습니까?\n\n1단계로 시작/초기화됩니다.`)) {
        return;
    }

    // 설정 처리
    let successCount = 0;
    selectedIds.forEach(studentId => {
        const assignment = mockStudentStageAssignments.find(s => s.studentId === studentId);
        if (assignment) {
            // 지도 단계 설정 및 1단계로 초기화
            assignment.thesisStageId = newThesisStage.id;
            assignment.thesisStageName = newThesisStage.name;
            assignment.currentStageOrder = 1;
            assignment.currentStageName = firstStage.name;
            assignment.currentStageType = firstStage.type;
            assignment.canProceed = false;
            assignment.lastUpdated = new Date().toISOString().split('T')[0];
            assignment.workflowLastChangedDate = new Date().toISOString().split('T')[0];
            assignment.isWorkflowChanged = true;

            successCount++;
        }
    });

    closeThesisStageSetModal();
    renderStageManagementContent();

    showNotification(
        `${successCount}명의 학생 지도 단계가 "${newThesisStage.name}"로 설정되었습니다. (1단계로 시작)`,
        'success'
    );
}

// ==============================================
// 지도교수 배정 관련 함수
// ==============================================

// 전역 변수로 선택된 교수들 저장
let selectedMainAdvisor = null;
let selectedCoAdvisors = [];
let currentAssignmentContext = null;

// 지도교수 배정 모달 표시
function assignAdvisor(studentId, proposalId, type = 'main') {
    console.log('지도교수 배정:', { studentId, proposalId, type });

    const student = mockStudents.find(s => s.id === studentId);
    const assignment = mockAdvisorAssignments.find(a => a.studentId === studentId);

    if (!student) {
        showNotification('학생 정보를 찾을 수 없습니다.', 'error');
        return;
    }

    // 현재 배정 컨텍스트 저장
    currentAssignmentContext = { studentId, proposalId, type };

    // 기존 배정 정보 로드 (both 타입이면 주/부 모두 로드)
    if (type === 'both' || type === 'main') {
        selectedMainAdvisor = assignment?.mainAdvisor ? { ...assignment.mainAdvisor } : null;
    } else {
        selectedMainAdvisor = null;
    }

    if (type === 'both' || type === 'co') {
        selectedCoAdvisors = assignment?.coAdvisors ? [...assignment.coAdvisors] : [];
    } else {
        selectedCoAdvisors = [];
    }

    // 모달 내용 렌더링
    renderAdvisorAssignmentModal(student, type);

    // 모달 열기
    document.getElementById('advisor-assignment-modal').classList.add('active');
}

// 지도교수 배정 모달 닫기
function closeAdvisorAssignmentModal() {
    document.getElementById('advisor-assignment-modal').classList.remove('active');
    selectedMainAdvisor = null;
    selectedCoAdvisors = [];
    currentAssignmentContext = null;
}

// 지도교수 배정 모달 내용 렌더링
function renderAdvisorAssignmentModal(student, type) {
    const isBoth = type === 'both';
    const isMain = type === 'main';

    let content = '';

    if (isBoth) {
        // 좌우 2분할 레이아웃 (주지도교수 + 공동지도교수 동시 배정)
        content = `
            <div class="mb-4">
                <h3 class="font-semibold text-gray-900 mb-2">${student.name} 학생의 지도교수 배정</h3>
                <p class="text-sm text-gray-600">주지도교수는 1명, 공동지도교수는 여러 명 선택할 수 있습니다.</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; height: 500px; margin-bottom: 20px;">
                <!-- 왼쪽: 주지도교수 -->
                <div style="border-right: 1px solid #e5e7eb; padding-right: 24px; display: flex; flex-direction: column;">
                    <h4 class="font-semibold text-gray-900 mb-3" style="font-size: 15px;">주지도교수</h4>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">학과</label>
                            <select id="main-advisor-dept-filter" onchange="filterAdvisors('main')"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                <option value="">전체</option>
                                ${[...new Set(mockProfessors.map(p => p.department))].map(dept =>
                                    `<option value="${dept}">${dept}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">교수명</label>
                            <input type="text" id="main-advisor-name-filter" placeholder="교수명 검색" onkeyup="filterAdvisors('main')"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                        </div>
                    </div>

                    <!-- 컬럼 헤더 -->
                    <div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600; color: #6b7280;">
                        <div></div>
                        <div>교번</div>
                        <div>이름</div>
                        <div>학과</div>
                    </div>

                    <div style="flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;" id="main-advisor-list">
                        ${mockProfessors.map(prof => renderAdvisorItem(prof, true, 'main')).join('')}
                    </div>
                </div>

                <!-- 오른쪽: 공동지도교수 -->
                <div style="padding-left: 24px; display: flex; flex-direction: column;">
                    <h4 class="font-semibold text-gray-900 mb-3" style="font-size: 15px;">공동지도교수 (복수 선택 가능)</h4>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">학과</label>
                            <select id="co-advisor-dept-filter" onchange="filterAdvisors('co')"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                <option value="">전체</option>
                                ${[...new Set(mockProfessors.map(p => p.department))].map(dept =>
                                    `<option value="${dept}">${dept}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">교수명</label>
                            <input type="text" id="co-advisor-name-filter" placeholder="교수명 검색" onkeyup="filterAdvisors('co')"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                        </div>
                    </div>

                    <!-- 컬럼 헤더 -->
                    <div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600; color: #6b7280;">
                        <div></div>
                        <div>교번</div>
                        <div>이름</div>
                        <div>학과</div>
                    </div>

                    <div style="flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;" id="co-advisor-list">
                        ${mockProfessors.map(prof => renderAdvisorItem(prof, false, 'co')).join('')}
                    </div>
                </div>
            </div>

            <div style="padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px;">
                <button onclick="closeAdvisorAssignmentModal()" class="btn-secondary">
                    취소
                </button>
                <button onclick="saveAdvisorAssignment()" class="btn-primary" id="save-advisor-btn">
                    저장
                </button>
            </div>
        `;
    } else {
        // 기존 단일 컬럼 레이아웃 (주 또는 부 단독 배정)
        const advisorType = isMain ? '지도교수' : '공동지도교수';

        content = `
            <div class="mb-4">
                <h3 class="font-semibold text-gray-900 mb-2">
                    ${student.name} 학생의 ${advisorType} ${isMain ? '배정' : '선택'}
                </h3>
                <p class="text-sm text-gray-600">
                    ${isMain ? '지도교수는 1명만 선택할 수 있습니다.' : '공동지도교수는 여러 명 선택할 수 있습니다.'}
                </p>
            </div>

            <div class="search-grid" style="margin-bottom: 16px;">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">학과</label>
                    <select id="advisor-dept-filter" onchange="filterAdvisors()"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                        <option value="">전체</option>
                        ${[...new Set(mockProfessors.map(p => p.department))].map(dept =>
                            `<option value="${dept}">${dept}</option>`
                        ).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">교수명</label>
                    <input type="text" id="advisor-name-filter" placeholder="교수명 검색" onkeyup="filterAdvisors()"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                </div>
            </div>

            <!-- 컬럼 헤더 -->
            <div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600; color: #6b7280;">
                <div></div>
                <div>교번</div>
                <div>이름</div>
                <div>학과</div>
            </div>

            <div style="max-height: 400px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; margin-bottom: 20px;" id="advisor-list">
                ${mockProfessors.map(prof => renderAdvisorItem(prof, isMain)).join('')}
            </div>

            <div style="padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px;">
                <button onclick="closeAdvisorAssignmentModal()" class="btn-secondary">
                    취소
                </button>
                <button onclick="saveAdvisorAssignment()" class="btn-primary" id="save-advisor-btn">
                    저장
                </button>
            </div>
        `;
    }

    document.getElementById('advisor-assignment-content').innerHTML = content;
    updateSaveButtonState();
}

// 교수 항목 렌더링
function renderAdvisorItem(prof, isMain, side = null) {
    const isSelected = isMain
        ? selectedMainAdvisor?.id === prof.id
        : selectedCoAdvisors.some(a => a.id === prof.id);

    // side가 있으면 data-side 속성 추가 (좌우 분할 레이아웃용)
    const dataAttrs = side
        ? `data-dept="${prof.department}" data-name="${prof.name}" data-side="${side}"`
        : `data-dept="${prof.department}" data-name="${prof.name}"`;

    return `
        <div class="advisor-item" ${dataAttrs} style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; align-items: center; padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <input type="${isMain ? 'radio' : 'checkbox'}"
                   name="${side ? side + '-advisor-select' : 'advisor-select'}"
                   value="${prof.id}"
                   ${isSelected ? 'checked' : ''}
                   onchange="handleAdvisorSelection('${prof.id}', ${isMain})"
                   style="margin: 0;">
            <div class="text-sm text-gray-900">${prof.employeeNumber || '-'}</div>
            <div class="text-sm font-medium text-gray-900">${prof.name}</div>
            <div class="text-sm text-gray-600">${prof.department}</div>
        </div>
    `;
}

// 교수 선택 처리
function handleAdvisorSelection(profId, isMain) {
    const prof = mockProfessors.find(p => p.id === profId);

    if (!prof) return;

    if (isMain) {
        selectedMainAdvisor = { ...prof };
    } else {
        const index = selectedCoAdvisors.findIndex(a => a.id === profId);
        if (index >= 0) {
            selectedCoAdvisors.splice(index, 1);
        } else {
            selectedCoAdvisors.push({ ...prof });
        }
    }

    updateSaveButtonState();
}

// 교수 필터링
function filterAdvisors(side = null) {
    if (side) {
        // 좌우 분할 레이아웃: 특정 side만 필터링
        const deptFilter = document.getElementById(`${side}-advisor-dept-filter`)?.value.toLowerCase() || '';
        const nameFilter = document.getElementById(`${side}-advisor-name-filter`)?.value.toLowerCase() || '';

        document.querySelectorAll(`.advisor-item[data-side="${side}"]`).forEach(item => {
            const dept = item.dataset.dept.toLowerCase();
            const name = item.dataset.name.toLowerCase();

            const matchDept = !deptFilter || dept === deptFilter;
            const matchName = !nameFilter || name.includes(nameFilter);

            item.style.display = (matchDept && matchName) ? '' : 'none';
        });
    } else {
        // 단일 컬럼 레이아웃: 전체 필터링
        const deptFilter = document.getElementById('advisor-dept-filter')?.value.toLowerCase() || '';
        const nameFilter = document.getElementById('advisor-name-filter')?.value.toLowerCase() || '';

        document.querySelectorAll('.advisor-item').forEach(item => {
            const dept = item.dataset.dept.toLowerCase();
            const name = item.dataset.name.toLowerCase();

            const matchDept = !deptFilter || dept === deptFilter;
            const matchName = !nameFilter || name.includes(nameFilter);

            item.style.display = (matchDept && matchName) ? '' : 'none';
        });
    }
}

// 필터 초기화
function clearAdvisorFilters() {
    document.getElementById('advisor-dept-filter').value = '';
    document.getElementById('advisor-name-filter').value = '';
    filterAdvisors();
}

// 저장 버튼 상태 업데이트
function updateSaveButtonState() {
    const saveBtn = document.getElementById('save-advisor-btn');
    if (!saveBtn) return;

    let hasSelection = false;

    if (currentAssignmentContext?.type === 'both') {
        // 'both' 타입: 주지도교수만 필수 (공동지도교수는 선택사항)
        hasSelection = selectedMainAdvisor !== null;
    } else if (currentAssignmentContext?.type === 'main') {
        hasSelection = selectedMainAdvisor !== null;
    } else {
        hasSelection = selectedCoAdvisors.length > 0;
    }

    saveBtn.disabled = !hasSelection;
}

// 지도교수 배정 저장
function saveAdvisorAssignment() {
    if (!currentAssignmentContext) return;

    const { studentId, proposalId, type } = currentAssignmentContext;
    const student = mockStudents.find(s => s.id === studentId);

    // Mock 데이터 업데이트 (실제로는 서버 API 호출)
    let assignment = mockAdvisorAssignments.find(a => a.studentId === studentId);

    if (!assignment) {
        assignment = {
            id: `ASSIGN${mockAdvisorAssignments.length + 1}`.padEnd(10, '0'),
            studentId: studentId,
            mainAdvisor: null,
            coAdvisors: []
        };
        mockAdvisorAssignments.push(assignment);
    }

    if (type === 'both') {
        // 주지도교수 + 공동지도교수 동시 배정
        assignment.mainAdvisor = selectedMainAdvisor;
        assignment.coAdvisors = [...selectedCoAdvisors];

        let message = `${student.name} 학생의 지도교수를 ${selectedMainAdvisor.name} 교수로 배정했습니다.`;
        if (selectedCoAdvisors.length > 0) {
            message += ` (공동지도교수 ${selectedCoAdvisors.length}명)`;
        }
        showNotification(message, 'success');
    } else if (type === 'main') {
        assignment.mainAdvisor = selectedMainAdvisor;
        showNotification(`${student.name} 학생의 지도교수를 ${selectedMainAdvisor.name} 교수로 배정했습니다.`, 'success');
    } else {
        assignment.coAdvisors = [...selectedCoAdvisors];
        showNotification(`${student.name} 학생의 공동지도교수 ${selectedCoAdvisors.length}명을 선택했습니다.`, 'success');
    }

    // 모달 닫기
    closeAdvisorAssignmentModal();

    // 현재 뷰 새로고침
    const currentView = document.getElementById('view-title').textContent;
    if (currentView === '연구계획서 상세') {
        viewProposalDetail(proposalId);
    } else {
        switchView('advisorAssignment');
    }
}

// 연구계획서 제출 모달 표시 (학생용)
function openProposalSubmitModal(degreeType) {
    console.log('연구계획서 제출 모달:', degreeType);

    // TODO: 제출 모달 구현 필요
    showNotification(`${degreeType} 연구계획서 제출 모달 구현 예정`, 'info');
}

// 연구계획서 폼 불러오기 (새 창)
function loadProposalForm(proposalId) {
    console.log('연구계획서 폼 불러오기:', proposalId);

    // Mock 데이터에서 연구계획서 찾기
    const proposal = mockResearchProposals.find(p => p.id === proposalId);

    if (!proposal) {
        showNotification('연구계획서를 찾을 수 없습니다.', 'error');
        return;
    }

    // formUrl이 있으면 새 창으로 열기
    if (proposal.formUrl) {
        const formWindow = window.open(proposal.formUrl, '_blank', 'width=1024,height=768');
        if (!formWindow) {
            showNotification('팝업 차단이 활성화되어 있습니다. 팝업 차단을 해제해주세요.', 'warning');
        }
    } else {
        // formUrl이 없으면 안내 메시지
        showNotification('학교 시스템에 등록된 연구계획서 폼이 없습니다.', 'info');
    }
}

// Export
window.showStudentInfo = showStudentInfo;
window.closeStudentInfoModal = closeStudentInfoModal;
window.viewProposalDetail = viewProposalDetail;
window.loadProposalForm = loadProposalForm;
window.assignAdvisor = assignAdvisor;
window.closeAdvisorAssignmentModal = closeAdvisorAssignmentModal;
window.renderAdvisorAssignmentModal = renderAdvisorAssignmentModal;
window.renderAdvisorItem = renderAdvisorItem;
window.handleAdvisorSelection = handleAdvisorSelection;
window.filterAdvisors = filterAdvisors;
window.clearAdvisorFilters = clearAdvisorFilters;
window.updateSaveButtonState = updateSaveButtonState;
window.saveAdvisorAssignment = saveAdvisorAssignment;
window.openProposalSubmitModal = openProposalSubmitModal;

console.log('✅ 지도 학생 관리 기능 로드 완료');

// ========================================
// 신규 단계 카드 관리 함수
// ========================================

// 단계 카드 렌더링 함수
function renderStageCards() {
    if (!window.composedStages || window.composedStages.length === 0) {
        return '<p class="text-gray-500 text-center py-8">단계가 없습니다.</p>';
    }

    return window.composedStages.map((stage, index) => renderStageCard(stage, index)).join('');
}

// 개별 단계 카드 렌더링
function renderStageCard(stage, index) {
    // stageTypeId로 지도 단계 유형 찾기 (하위 호환성: stepTypeId, categoryId도 지원)
    const stageTypeId = stage.stageTypeId || stage.stepTypeId || stage.categoryId;
    const stageType = mockStepTypes.find(t => t.id === stageTypeId);

    // 심사 유형
    const examTypeId = stage.examTypeId || '';
    const examType = mockExamTypes.find(t => t.id === examTypeId);

    const isFirst = index === 0;
    const isLast = index === window.composedStages.length - 1;

    // 비활성화 조건 (심사 유형은 유형관리에서 설정하므로 더 이상 사용 안 함)
    const isExamTypeNone = examTypeId === 'EXAM_TYPE_NONE';
    const evaluationDisabled = isExamTypeNone;  // 평가없음 선택 시 평가표 비활성화
    const reviewDisabled = !stage.evaluationTemplateId || isExamTypeNone;  // 평가표 미선택 또는 평가없음 시 심사기간 비활성화

    return `
        <div class="border border-gray-300 rounded-lg p-3 bg-white shadow-sm" data-stage-index="${index}">
            <style>
                .stage-field-row-triple {
                    display: grid;
                    grid-template-columns: 90px 1fr 100px 1fr 70px 1fr;
                    gap: 10px;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .stage-field-row-dates {
                    display: grid;
                    grid-template-columns: 90px 1fr 90px 1fr;
                    gap: 10px;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .stage-field-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: #374151;
                    white-space: nowrap;
                    text-align: right;
                    padding-right: 6px;
                }
                .stage-input {
                    height: 32px;
                    padding: 0 10px;
                    font-size: 13px;
                    border: 1px solid #D1D5DB;
                    border-radius: 4px;
                }
                .stage-input:focus {
                    outline: none;
                    border-color: #3B82F6;
                    box-shadow: 0 0 0 1px #3B82F6;
                }
                .stage-input:disabled {
                    background-color: #F3F4F6;
                    color: #9CA3AF;
                    cursor: not-allowed;
                }
                .date-range-compact {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                    width: 100%;
                }
                .date-range-compact input[type="date"] {
                    flex: 1;
                    min-width: 0;
                }
                .stage-field-row {
                    display: grid;
                    grid-template-columns: 90px 1fr;
                    gap: 10px;
                    align-items: start;
                    margin-bottom: 10px;
                }
            </style>
            <!-- 카드 헤더 -->
            <div class="flex items-center justify-between mb-3 pb-2 border-b">
                <span class="font-bold text-base text-gray-800">단계 ${index + 1}</span>
                <div class="flex items-center gap-1">
                    <button onclick="deleteStageCard(${index})"
                            class="text-red-600 hover:text-red-800 text-xs px-2 py-1">
                        삭제
                    </button>
                    <button onclick="moveStageUp(${index})"
                            ${isFirst ? 'disabled' : ''}
                            class="text-gray-600 hover:text-gray-800 text-xs px-1 ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}">
                        ↑
                    </button>
                    <button onclick="moveStageDown(${index})"
                            ${isLast ? 'disabled' : ''}
                            class="text-gray-600 hover:text-gray-800 text-xs px-1 ${isLast ? 'opacity-30 cursor-not-allowed' : ''}">
                        ↓
                    </button>
                </div>
            </div>

            <!-- (1) 단계 이름 + 지도단계유형 + 평가표 -->
            <div class="stage-field-row-triple">
                <label class="stage-field-label">단계이름 <span class="text-red-500">*</span></label>
                <input type="text"
                       value="${stage.name || ''}"
                       onchange="updateStageField(${index}, 'name', this.value)"
                       placeholder="예: 1차 예비심사"
                       class="stage-input">

                <label class="stage-field-label">지도단계유형 <span class="text-red-500">*</span></label>
                <select onchange="updateStageType(${index}, this.value)" class="stage-input">
                    <option value="">선택</option>
                    ${mockStepTypes.map(type => `
                        <option value="${type.id}" ${stageTypeId === type.id ? 'selected' : ''}>
                            ${type.name}
                        </option>
                    `).join('')}
                </select>

                <label class="stage-field-label">평가표</label>
                <select onchange="updateStageEvaluationTemplate(${index}, this.value)"
                        class="stage-input"
                        ${evaluationDisabled ? 'disabled' : ''}>
                    <option value="">평가 없음</option>
                    ${mockEvaluationTemplates.map(template => `
                        <option value="${template.id}" ${stage.evaluationTemplateId === template.id ? 'selected' : ''}>
                            ${template.name}
                        </option>
                    `).join('')}
                </select>
            </div>

            <!-- 일정 관리 구분 -->
            <div class="my-3">
                <div class="stage-field-row">
                    <label class="stage-field-label" style="margin-top: 6px;">일정관리구분</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox"
                                   ${stage.scheduleTypes?.includes('general') ? 'checked' : ''}
                                   onchange="updateStageScheduleType(${index}, 'general', this.checked)"
                                   class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-700">일반 일정</span>
                        </label>

                        <div style="width: 1px; height: 20px; background-color: #D1D5DB;"></div>

                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox"
                                   ${stage.scheduleTypes?.includes('application') ? 'checked' : ''}
                                   onchange="updateStageScheduleType(${index}, 'application', this.checked)"
                                   class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-700">신청</span>
                        </label>

                        <div style="width: 1px; height: 20px; background-color: #D1D5DB;"></div>

                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox"
                                   ${stage.scheduleTypes?.includes('withdrawal') ? 'checked' : ''}
                                   onchange="updateStageScheduleType(${index}, 'withdrawal', this.checked)"
                                   class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-700">신청 철회</span>
                        </label>

                        <div style="width: 1px; height: 20px; background-color: #D1D5DB;"></div>

                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox"
                                   ${stage.scheduleTypes?.includes('submission') ? 'checked' : ''}
                                   onchange="updateStageScheduleType(${index}, 'submission', this.checked)"
                                   class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-700">제출</span>
                        </label>

                        <div style="width: 1px; height: 20px; background-color: #D1D5DB;"></div>

                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox"
                                   ${stage.scheduleTypes?.includes('review') ? 'checked' : ''}
                                   onchange="updateStageScheduleType(${index}, 'review', this.checked)"
                                   class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-700">심사</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- (6) 설명 -->
            <div class="my-3">
                <div class="stage-field-row" style="align-items: start;">
                    <label class="stage-field-label" style="margin-top: 6px;">설명</label>
                    <textarea onchange="updateStageField(${index}, 'description', this.value)"
                              placeholder="단계에 대한 추가 설명 (선택)"
                              class="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              rows="2"
                              style="font-size: 13px; resize: vertical;">${stage.description || ''}</textarea>
                </div>
            </div>
        </div>
    `;
}

// 단계 추가
function addNewStageCard() {
    const newOrder = window.composedStages.length + 1;
    window.composedStages.push({
        id: 'STAGE_NEW_' + Date.now(),
        order: newOrder,
        stageTypeId: '',        // 새로운 필드
        stepTypeId: '',         // 하위 호환성
        categoryId: '',         // 하위 호환성 (deprecated)
        examTypeId: '',         // 신규: 심사 유형
        name: '',
        requiresDocument: false,  // 유형 선택 시 자동 설정됨
        requiresPresentation: false,  // 유형 선택 시 자동 설정됨
        evaluationTemplateId: '',
        description: '',
        scheduleTypes: []       // 일정 관리 구분
    });
    refreshStageCards();
}

// 단계 삭제
function deleteStageCard(index) {
    if (window.composedStages.length === 1) {
        alert('최소 1개 이상의 단계가 필요합니다.');
        return;
    }

    if (confirm(`단계 ${index + 1}을(를) 삭제하시겠습니까?`)) {
        window.composedStages.splice(index, 1);
        // order 재정렬
        window.composedStages.forEach((stage, idx) => {
            stage.order = idx + 1;
        });
        refreshStageCards();
    }
}

// 단계 위로 이동
function moveStageUp(index) {
    if (index === 0) return;

    const temp = window.composedStages[index];
    window.composedStages[index] = window.composedStages[index - 1];
    window.composedStages[index - 1] = temp;

    // order 재정렬
    window.composedStages.forEach((stage, idx) => {
        stage.order = idx + 1;
    });

    refreshStageCards();
}

// 단계 아래로 이동
function moveStageDown(index) {
    if (index === window.composedStages.length - 1) return;

    const temp = window.composedStages[index];
    window.composedStages[index] = window.composedStages[index + 1];
    window.composedStages[index + 1] = temp;

    // order 재정렬
    window.composedStages.forEach((stage, idx) => {
        stage.order = idx + 1;
    });

    refreshStageCards();
}

// 단계 필드 업데이트
function updateStageField(index, field, value) {
    if (window.composedStages[index]) {
        window.composedStages[index][field] = value;
    }
}

// 평가표 업데이트
function updateStageEvaluationTemplate(index, templateId) {
    if (window.composedStages[index]) {
        window.composedStages[index].evaluationTemplateId = templateId;
        refreshStageCards();
    }
}

// 단계 카드 새로고침
function refreshStageCards() {
    const container = document.getElementById('stage-cards-container');
    if (container) {
        container.innerHTML = renderStageCards();
    }

    // 저장 버튼 텍스트 업데이트
    const saveBtn = document.getElementById('unified-save-btn');
    if (saveBtn) {
        saveBtn.textContent = '저장';
    }
}

// 지도 단계 유형 선택 시 처리 (심사 유형 자동 설정)
function updateStageType(index, typeId) {
    if (!window.composedStages || !window.composedStages[index]) return;

    const stage = window.composedStages[index];

    const stageType = mockStepTypes.find(t => t.id === typeId);
    if (stageType) {
        // 유형 ID 저장 (하위 호환성 위해 모두 저장)
        stage.stageTypeId = typeId;
        stage.stepTypeId = typeId;
        stage.categoryId = typeId;

        // 제출 요건 자동 설정
        stage.requiresDocument = stageType.requiresDocument;
        stage.requiresPresentation = stageType.requiresPresentation;

        // 심사 유형 자동 설정 (유형관리에서 설정한 값 복사)
        stage.examTypeId = stageType.examTypeId || '';

        console.log(`✅ 단계 ${index + 1}: 유형 "${stageType.name}" 선택, 심사유형 "${stage.examTypeId}" 자동 설정`);
    } else {
        // 선택 해제
        stage.stageTypeId = '';
        stage.stepTypeId = '';
        stage.categoryId = '';
        stage.examTypeId = '';  // 심사 유형도 초기화
        stage.requiresDocument = false;
        stage.requiresPresentation = false;
    }

    refreshStageCards();
}

// 심사 유형 선택 시 처리 (DEPRECATED - 더 이상 사용 안 함, 유형관리에서 설정)
// function updateStageExamType(index, examTypeId) {
//     if (!window.composedStages || !window.composedStages[index]) return;
//
//     const stage = window.composedStages[index];
//     stage.examTypeId = examTypeId;
//
//     // "평가 없음" 선택 시 평가표 및 심사기간 초기화
//     if (examTypeId === 'EXAM_TYPE_NONE') {
//         stage.evaluationTemplateId = '';
//         stage.reviewStartDate = '';
//         stage.reviewEndDate = '';
//         console.log(`⚠️  단계 ${index + 1}: 평가 없음 선택 - 평가표 및 심사기간 초기화`);
//     }
//
//     refreshStageCards();
// }

// 평가표 업데이트 확장 (심사 유형에 따른 제약 추가)
function updateStageEvaluationTemplate(index, templateId) {
    if (!window.composedStages || !window.composedStages[index]) return;

    const stage = window.composedStages[index];

    // 평가 없음 선택 시 평가표 선택 불가 (추가 안전장치)
    if (stage.examTypeId === 'EXAM_TYPE_NONE' && templateId) {
        console.warn('⚠️  평가 없음 선택 시 평가표를 선택할 수 없습니다.');
        return;
    }

    stage.evaluationTemplateId = templateId;

    // 평가표가 없으면 심사 기간 초기화
    if (!templateId) {
        stage.reviewStartDate = '';
        stage.reviewEndDate = '';
    }

    refreshStageCards();
}

// 전역 함수로 export
window.renderStageCards = renderStageCards;
// 단계 일정 관리 구분 업데이트
function updateStageScheduleType(index, type, checked) {
    if (!window.composedStages[index].scheduleTypes) {
        window.composedStages[index].scheduleTypes = [];
    }

    if (checked) {
        if (!window.composedStages[index].scheduleTypes.includes(type)) {
            window.composedStages[index].scheduleTypes.push(type);
        }
    } else {
        window.composedStages[index].scheduleTypes =
            window.composedStages[index].scheduleTypes.filter(t => t !== type);
    }
}

window.renderStageCard = renderStageCard;
window.addNewStageCard = addNewStageCard;
window.deleteStageCard = deleteStageCard;
window.moveStageUp = moveStageUp;
window.moveStageDown = moveStageDown;
window.updateStageField = updateStageField;
window.updateStageType = updateStageType;
// window.updateStageExamType = updateStageExamType;  // DEPRECATED - 제거됨
window.updateStageEvaluationTemplate = updateStageEvaluationTemplate;
window.updateStageScheduleType = updateStageScheduleType;
window.refreshStageCards = refreshStageCards;

console.log('✅ 신규 단계 카드 관리 함수 로드 완료');

// ====================================================================
// 인라인 카테고리 추가 함수 (DEPRECATED - 더 이상 사용 안 함)
// ====================================================================

function saveNewCategory(stageIndex) {
    // 이 기능은 더 이상 사용하지 않습니다.
    // 지도 단계 유형은 별도 화면에서 관리합니다.
    alert('지도 단계 유형은 "지도 단계 유형 관리" 메뉴에서 추가해주세요.');
    return;

    // 중복 확인
    const duplicate = mockStageCategories.find(c => c.name === name);
    if (duplicate) {
        alert('이미 존재하는 카테고리입니다.');
        input.focus();
        return;
    }

    // 새 카테고리 추가
    const newId = 'CAT_' + String(mockStageCategories.length + 1).padStart(3, '0');
    mockStageCategories.push({
        id: newId,
        name: name
    });

    // 현재 단계에 새 카테고리 적용
    window.composedStages[stageIndex].categoryId = newId;

    // UI 숨기기
    document.getElementById(`new-category-input-${stageIndex}`).style.display = 'none';
    input.value = '';

    // 카드 새로고침
    refreshStageCards();
    showToast('새 카테고리가 추가되었습니다.', 'success');
}

function cancelNewCategory(stageIndex) {
    const inputDiv = document.getElementById(`new-category-input-${stageIndex}`);
    const input = document.getElementById(`new-category-name-${stageIndex}`);

    inputDiv.style.display = 'none';
    input.value = '';
}

// 전역으로 노출
window.saveNewCategory = saveNewCategory;
window.cancelNewCategory = cancelNewCategory;

console.log('✅ 인라인 카테고리 추가 함수 로드 완료');

// ========================================
// 논문 지도 단계 유형 관리 함수 (신규)
// ========================================

/**
 * 단계 유형 저장 (등록/수정)
 */
window.saveStageType = (event, id) => {
    event.preventDefault();

    const name = document.getElementById('stage-type-name').value.trim();
    const requiresDocument = document.getElementById('requires-document').checked;
    const requiresPresentation = document.getElementById('requires-presentation').checked;
    const examTypeId = document.getElementById('exam-type-id').value;
    const description = document.getElementById('stage-type-description').value.trim();

    // 유효성 검사
    if (!name) {
        alert('유형명을 입력해주세요.');
        return;
    }

    if (!requiresDocument && !requiresPresentation) {
        alert('문서 제출 또는 발표 중 최소 1개는 필요합니다.');
        return;
    }

    if (id) {
        // 수정
        const stageType = mockStepTypes.find(t => t.id === id);
        if (stageType) {
            stageType.name = name;
            stageType.requiresDocument = requiresDocument;
            stageType.requiresPresentation = requiresPresentation;
            stageType.examTypeId = examTypeId;  // 심사 유형 저장
            stageType.description = description;
        }
        alert('단계 유형이 수정되었습니다.');
    } else {
        // 신규 등록
        const newId = 'ST' + String(mockStepTypes.length + 1).padStart(3, '0');
        mockStepTypes.push({
            id: newId,
            name: name,
            type: requiresPresentation ? 'review' : 'submission', // 발표가 필요하면 심사, 아니면 제출
            requiresDocument: requiresDocument,
            requiresPresentation: requiresPresentation,
            examTypeId: examTypeId,  // 심사 유형 저장
            evaluationTemplateId: requiresPresentation ? null : null, // 추후 설정 가능
            description: description,
            createdDate: new Date().toISOString().split('T')[0]
        });
        alert('단계 유형이 등록되었습니다.');
    }

    closeStageTypeModal();
    renderAdminView('stageTypeManagement');
};

/**
 * 단계 유형 모달 닫기
 */
window.closeStageTypeModal = (event) => {
    // 오버레이 클릭 시에만 event가 전달됨
    if (event && event.target.id !== 'stage-type-modal') {
        return;
    }

    switchView('stageTypeManagement');
};

/**
 * 단계 유형 삭제
 */
window.deleteStageType = (id) => {
    // 사용 중인지 확인
    const isUsed = mockThesisStages.some(ts =>
        ts.stages.some(s => s.stageTypeId === id || s.stepTypeId === id)
    );

    if (isUsed) {
        alert('이 단계 유형은 현재 사용 중이므로 삭제할 수 없습니다.');
        return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }

    const index = mockStepTypes.findIndex(t => t.id === id);
    if (index > -1) {
        mockStepTypes.splice(index, 1);
        alert('단계 유형이 삭제되었습니다.');
        closeStageTypeModal();
        renderAdminView('stageTypeManagement');
    }
};

console.log('✅ 단계 유형 관리 함수 로드 완료');

// ========== 최종 논문 제목 등록 관련 함수 ==========

/**
 * 최종 논문 제목 등록 검색 함수
 * 11개 검색 필드를 사용하여 제목 변경 요청 목록을 필터링
 */
function searchTitleChangeRequests() {
    // 검색 필드 값 수집
    const year = document.getElementById('title-search-year')?.value || '';
    const semester = document.getElementById('title-search-semester')?.value || '';
    const collegeType = document.getElementById('title-search-college-type')?.value || '';
    const college = document.getElementById('title-search-college')?.value || '';
    const faculty = document.getElementById('title-search-faculty')?.value || '';
    const major = document.getElementById('title-search-major')?.value || '';
    const degree = document.getElementById('title-search-degree')?.value || '';
    const status = document.getElementById('title-search-status')?.value || '';
    const studentId = document.getElementById('title-search-student-id')?.value.trim() || '';
    const studentName = document.getElementById('title-search-student-name')?.value.trim() || '';
    const advisorName = document.getElementById('title-search-advisor')?.value.trim() || '';

    // 데이터 필터링
    let filtered = appData.titleChangeRequests || [];

    if (year) {
        filtered = filtered.filter(item => (item.year || '2025') === year);
    }
    if (semester) {
        filtered = filtered.filter(item => (item.semester || '1') === semester);
    }
    if (collegeType) {
        filtered = filtered.filter(item => (item.collegeType || '대학원') === collegeType);
    }
    if (college) {
        filtered = filtered.filter(item => (item.graduate || item.college || '') === college);
    }
    if (faculty) {
        filtered = filtered.filter(item => (item.faculty || '') === faculty);
    }
    if (major) {
        filtered = filtered.filter(item => (item.major || '').includes(major));
    }
    if (degree) {
        filtered = filtered.filter(item => (item.degree || '').includes(degree));
    }
    if (status) {
        filtered = filtered.filter(item => (item.status || '재학') === status);
    }
    if (studentId) {
        filtered = filtered.filter(item => (item.studentId || '').includes(studentId));
    }
    if (studentName) {
        filtered = filtered.filter(item => (item.studentName || '').includes(studentName));
    }
    if (advisorName) {
        filtered = filtered.filter(item => {
            const advisor = item.advisorName || item.professor || '';
            return advisor.includes(advisorName);
        });
    }

    // 결과 표시
    if (filtered.length === 0) {
        showNotification('검색 결과가 없습니다.', 'warning');
    } else {
        showNotification(`${filtered.length}건의 데이터를 조회했습니다.`, 'success');
    }

    // 뷰 새로고침 (필터링된 데이터로)
    const originalData = appData.titleChangeRequests;
    appData.titleChangeRequests = filtered;
    switchView('titleChangeRequests');
    appData.titleChangeRequests = originalData; // 원본 데이터 복원
}

/**
 * 제목 등록 상세 화면 표시 (학위 논문 심사와 동일한 구조)
 */
function showTitleChangeDetail(id) {
    // 데이터 찾기
    const data = appData.titleChangeRequests.find(item => item.id === id);

    if (!data) {
        showNotification('해당 데이터를 찾을 수 없습니다.', 'error');
        return;
    }

    // 목록 화면 숨기기
    const listView = document.getElementById('title-change-list-view');
    if (listView) {
        listView.style.display = 'none';
    }

    // 상세 화면 생성
    const detailScreen = document.createElement('div');
    detailScreen.id = 'title-change-detail-screen';
    detailScreen.className = 'fixed inset-0 bg-white z-50 overflow-auto';

    detailScreen.innerHTML = `
        <div class="min-h-screen">
            <!-- 헤더 (목록으로 돌아가기 버튼) -->
            <div class="bg-white border-b" style="padding: 12px 24px;">
                <button onclick="closeTitleChangeDetail()" class="back-to-list-btn flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
            </div>

            <!-- 상세 내용 -->
            <div class="max-w-6xl mx-auto p-6">
                <!-- 학생 정보 카드 -->
                <div class="bg-white rounded-lg shadow-md mb-6">
                    <div class="px-6 py-4 border-b bg-gray-50">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
                        <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                                <span class="text-gray-900 font-medium">${data.collegeType || '일반대학원'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                                <span class="text-gray-900 font-medium">${data.graduate || '일반대학원'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                                <span class="text-gray-900 font-medium">${data.faculty || '-'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                                <span class="text-gray-900 font-medium">${data.major}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                                <span class="text-gray-900 font-medium">${data.degree}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                                <span class="text-gray-900 font-medium">${data.status || '재학'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학번:</span>
                                <span class="text-gray-900 font-medium">${data.studentId}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">성명:</span>
                                <span class="text-gray-900 font-medium">${data.studentName}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                                <span class="text-gray-900 font-medium">${data.advisorName || data.professor || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 논문 정보 카드 -->
                <div class="bg-white rounded-lg shadow-md mb-6">
                    <div class="px-6 py-4 bg-white">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">논문 정보</h4>
                        <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                            <div class="col-span-3 flex gap-2 items-center">
                                <span class="text-gray-600 min-w-[80px]">논문 제목:</span>
                                <span class="text-gray-900 font-medium flex-1">${data.currentTitle}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학년도/학기:</span>
                                <span class="text-gray-900 font-medium">${data.year || '2025'}학년도 ${data.semester || '1'}학기</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">제출일:</span>
                                <span class="text-gray-900 font-medium">${data.submitDate || data.requestDate}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">상태:</span>
                                <span class="px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(data.requestStatus || data.status)}">
                                    ${data.requestStatus || data.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                ${data.changeHistory && data.changeHistory.length > 0 ? `
                    <!-- 제목 변경 이력 카드 -->
                    <div class="bg-white rounded-lg shadow-md">
                        <div class="px-6 py-4 bg-white">
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">제목 변경 이력</h4>
                            <div class="space-y-3">
                                ${data.changeHistory.map((history, index) => `
                                    <div class="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                                        <div class="text-xs text-gray-500 mb-1">[${index + 1}차] ${history.date}</div>
                                        <div class="text-sm text-gray-700 mb-1">
                                            <span class="font-medium">이전 제목:</span> ${history.previousTitle}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">변경 사유:</span> ${history.reason}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(detailScreen);
}

/**
 * 제목 등록 상세 화면 닫기
 */
function closeTitleChangeDetail() {
    const detailScreen = document.getElementById('title-change-detail-screen');
    if (detailScreen) {
        detailScreen.remove();
    }

    // 목록 화면 다시 표시
    const listView = document.getElementById('title-change-list-view');
    if (listView) {
        listView.style.display = 'block';
    }
}

window.showTitleChangeDetail = showTitleChangeDetail;
window.closeTitleChangeDetail = closeTitleChangeDetail;


/**
 * 상태 배지 클래스 반환
 */
function getStatusBadgeClass(status) {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch(status) {
        case '승인':
            return 'bg-green-100 text-green-800';
        case '반려':
            return 'bg-red-100 text-red-800';
        case '피드백 대기':
        case '대기':
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
}

console.log('✅ 최종 논문 제목 등록 함수 로드 완료');

// 지도교수 배정 관련 함수 전역 export
window.viewProposalDetail = viewProposalDetail;
window.loadProposalForm = loadProposalForm;

// ==================== 심사위원 배정 ====================

/**
 * 심사위원 배정 메인 렌더링 함수
 */
function showCommitteeAssignment() {
    const data = window.filteredCommitteeData || appData.committeeAssignmentData;

    if (!data) {
        console.error('[showCommitteeAssignment] Mock 데이터가 없습니다.');
        return;
    }

    const html = `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 검색 영역 -->
            <div class="p-6 border-b">
                <div class="grid grid-cols-5 gap-3">
                    <!-- 1행: 5개 필드 -->

                    <!-- 1. 학년도/학기 (복합 필드) -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            학년도/학기
                        </label>
                        <div class="flex gap-2 flex-1">
                            <select id="yearFilter"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="2025" selected>2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <select id="semesterFilter"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="1" selected>1학기</option>
                                <option value="2">2학기</option>
                            </select>
                        </div>
                    </div>

                    <!-- 2. 대학구분 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            대학구분
                        </label>
                        <select id="collegeTypeFilter"
                                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                style="height: 34px;">
                            <option value="">전체</option>
                            <option value="대학원">대학원</option>
                        </select>
                    </div>

                    <!-- 3. 계열/대학원 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            계열/대학원
                        </label>
                        <select id="graduateFilter"
                                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                style="height: 34px;">
                            <option value="">전체</option>
                            <option value="일반대학원">일반대학원</option>
                            <option value="경영대학원">경영대학원</option>
                            <option value="정보대학원">정보대학원</option>
                            <option value="디자인대학원">디자인대학원</option>
                        </select>
                    </div>

                    <!-- 4. 학부(과)전공 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            학부(과)전공
                        </label>
                        <input type="text"
                               id="undergraduateMajorFilter"
                               placeholder="학부(과)전공"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                               style="height: 34px;">
                    </div>

                    <!-- 5. 학과/전공 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            학과/전공
                        </label>
                        <input type="text"
                               id="majorFilter"
                               placeholder="학과/전공"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                               style="height: 34px;">
                    </div>

                    <!-- 2행: 5개 필드 -->

                    <!-- 6. 학위과정 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            학위과정
                        </label>
                        <select id="degreeFilter"
                                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                style="height: 34px;">
                            <option value="">전체</option>
                            <option value="석사">석사</option>
                            <option value="박사">박사</option>
                            <option value="석박통합">석박통합</option>
                        </select>
                    </div>

                    <!-- 7. 학적상태 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            학적상태
                        </label>
                        <select id="statusFilter"
                                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                style="height: 34px;">
                            <option value="">전체</option>
                            <option value="재학">재학</option>
                            <option value="휴학">휴학</option>
                            <option value="졸업">졸업</option>
                            <option value="수료">수료</option>
                        </select>
                    </div>

                    <!-- 8. 학번 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            학번
                        </label>
                        <input type="text"
                               id="studentIdFilter"
                               placeholder="학번"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                               style="height: 34px;">
                    </div>

                    <!-- 9. 성명 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            성명
                        </label>
                        <input type="text"
                               id="studentNameFilter"
                               placeholder="성명"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                               style="height: 34px;">
                    </div>

                    <!-- 10. 지도교수명 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            지도교수명
                        </label>
                        <input type="text"
                               id="advisorNameFilter"
                               placeholder="지도교수명"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                               style="height: 34px;">
                    </div>

                    <!-- 3행: 3개 필드 + 버튼 -->

                    <!-- 11. 기본단계 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            기본단계
                        </label>
                        <select id="reviewStageFilter"
                                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                style="height: 34px;">
                            <option value="">전체</option>
                            <option value="연구계획서">연구계획서</option>
                            <option value="1차 보고서">1차 보고서</option>
                            <option value="최종논문">최종논문</option>
                        </select>
                    </div>

                    <!-- 12. 배정상태 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                            배정상태
                        </label>
                        <select id="assignmentStatusFilter"
                                class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                style="height: 34px;">
                            <option value="">전체</option>
                            <option value="배정 대기">배정 대기</option>
                            <option value="배정 완료">배정 완료</option>
                        </select>
                    </div>

                    <!-- 빈 공간 2칸 -->
                    <div></div>
                    <div></div>

                    <!-- 버튼 영역 (마지막 열) -->
                    <div class="flex items-center justify-end">
                        <button onclick="searchCommitteeAssignment()"
                                class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                            <i class="fas fa-search mr-1"></i>조회
                        </button>
                    </div>
                </div>
            </div>

            <!-- 테이블 영역 -->
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">심사위원 배정 목록</h3>
                        <span class="table-count">(총 ${data.length}건)</span>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순번</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학년도</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학기</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대학구분</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">계열/대학원</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학부(과)전공</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학과/전공</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학위과정</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학적상태</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성명</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지도교수명</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기본단계</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">세부단계</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">배정상태</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${data.length === 0 ? `
                            <tr>
                                <td colspan="16" class="px-6 py-8 text-center text-gray-500">
                                    심사위원 배정 대기 중인 학생이 없습니다.
                                </td>
                            </tr>
                        ` : data.map((item, index) => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${index + 1}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.academicYear}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.semester}학기</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.collegeType}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.graduate}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.undergraduateMajor}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.major}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.degreeType}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.academicStatus}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.studentNumber}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.studentName}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.advisorName}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.basicStageName || item.reviewStage || '-'}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.subStageName || '-'}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.assignmentStatus}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button onclick="openCommitteeAssignmentModal('${item.id}')"
                                            class="text-xs px-3 py-1 border border-[#6A0028] text-[#6A0028] rounded hover:bg-[#6A0028] hover:text-white">
                                        배정
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    const contentArea = document.getElementById('committee-assignment-content');
    if (contentArea) {
        contentArea.innerHTML = html;
    }
}

/**
 * 심사위원 배정 검색 함수
 */
function searchCommitteeAssignment() {
    // 13개 필드 값 수집
    const year = document.getElementById('yearFilter')?.value || '';
    const semester = document.getElementById('semesterFilter')?.value || '';
    const collegeType = document.getElementById('collegeTypeFilter')?.value || '';
    const graduate = document.getElementById('graduateFilter')?.value || '';
    const undergraduateMajor = document.getElementById('undergraduateMajorFilter')?.value.trim() || '';
    const major = document.getElementById('majorFilter')?.value.trim() || '';
    const degree = document.getElementById('degreeFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const studentId = document.getElementById('studentIdFilter')?.value.trim() || '';
    const studentName = document.getElementById('studentNameFilter')?.value.trim() || '';
    const advisorName = document.getElementById('advisorNameFilter')?.value.trim() || '';
    const reviewStage = document.getElementById('reviewStageFilter')?.value || '';
    const assignmentStatus = document.getElementById('assignmentStatusFilter')?.value || '';

    // 필터링
    let filtered = appData.committeeAssignmentData.filter(item => {
        if (year && item.academicYear !== year) return false;
        if (semester && item.semester !== semester) return false;
        if (collegeType && item.collegeType !== collegeType) return false;
        if (graduate && item.graduate !== graduate) return false;
        if (undergraduateMajor && !item.undergraduateMajor.includes(undergraduateMajor)) return false;
        if (major && !item.major.includes(major)) return false;
        if (degree && item.degreeType !== degree) return false;
        if (status && item.academicStatus !== status) return false;
        if (studentId && !item.studentNumber.includes(studentId)) return false;
        if (studentName && !item.studentName.includes(studentName)) return false;
        if (advisorName && !item.advisorName.includes(advisorName)) return false;
        if (reviewStage && item.reviewStage !== reviewStage) return false;
        if (assignmentStatus && item.assignmentStatus !== assignmentStatus) return false;
        return true;
    });

    window.filteredCommitteeData = filtered;
    showCommitteeAssignment();

    if (typeof showNotification === 'function') {
        showNotification(`검색 결과: ${filtered.length}건`, 'success');
    }
}

// 전역 export
window.showCommitteeAssignment = showCommitteeAssignment;
window.searchCommitteeAssignment = searchCommitteeAssignment;

// =============================================================================
// 심사위원 배정 모달
// =============================================================================

function openCommitteeAssignmentModal(committeeId) {
    const reviewTarget = appData.committeeAssignmentData.find(rt => rt.id === committeeId);
    if (!reviewTarget) {
        showNotification('심사 대상 정보를 찾을 수 없습니다.', 'error');
        return;
    }

    window.selectedReviewTarget = reviewTarget;
    window.selectedChair = null;
    window.selectedMembers = [];

    // 지도교수를 심사위원에 자동 추가
    const advisor = appData.professors.find(p => p.name === reviewTarget.advisorName);
    if (advisor) {
        window.selectedMembers = [{ ...advisor }];
    }

    const minMembers = reviewTarget.degreeType === '석사' ? 2 : 4;
    const maxMembers = reviewTarget.degreeType === '석사' ? 3 : 5; // 심사위원장 포함 최대 인원
    const totalMin = reviewTarget.degreeType === '석사' ? 3 : 5;

    // 최대 심사위원 수 저장 (심사위원장 제외)
    window.maxCommitteeMembers = maxMembers - 1;

    const modalHTML = `
        <div class="admin-modal active" id="committee-assignment-modal" style="display: flex; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
            <div class="admin-modal-content" style="width: 1200px; max-width: 90vw; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-height: 90vh; display: flex; flex-direction: column;">
                <div class="admin-modal-header" style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0;">심사위원 배정</h2>
                    <button class="admin-modal-close" onclick="closeCommitteeAssignmentModal()" style="background: none; border: none; font-size: 28px; line-height: 1; color: #6b7280; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">&times;</button>
                </div>
                <div class="admin-modal-body" style="padding: 24px; overflow-y: auto; flex: 1;">
                    <!-- 학생 정보 -->
                    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h3 class="text-sm font-semibold text-gray-700 mb-3">심사 대상 학생 정보</h3>
                        <div class="grid grid-cols-4 gap-3 text-sm">
                            <div>
                                <span class="text-gray-500">학번:</span>
                                <span class="ml-2 font-medium">${reviewTarget.studentNumber}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">성명:</span>
                                <span class="ml-2 font-medium">${reviewTarget.studentName}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">학과:</span>
                                <span class="ml-2 font-medium">${reviewTarget.major}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">학위과정:</span>
                                <span class="ml-2 font-medium">${reviewTarget.degreeType}</span>
                            </div>
                        </div>
                        <div class="mt-2 text-sm">
                            <span class="text-gray-500">논문 제목:</span>
                            <span class="ml-2 font-medium">${reviewTarget.thesisTitle}</span>
                        </div>
                    </div>

                    <!-- 좌우 2분할 레이아웃 -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; height: 500px; margin-bottom: 20px;">
                        <!-- 왼쪽: 심사위원장 -->
                        <div style="border-right: 1px solid #e5e7eb; padding-right: 24px; display: flex; flex-direction: column;">
                            <h4 class="font-semibold text-gray-900 mb-3" style="font-size: 15px;">
                                심사위원장 <span class="text-red-500 text-sm">*</span>
                            </h4>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">학과</label>
                                    <select id="chair-dept-filter" onchange="filterCommitteeMembers('chair')"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                        <option value="">전체</option>
                                        ${[...new Set(appData.professors.map(p => p.department))].map(dept =>
                                            `<option value="${dept}">${dept}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">교수명</label>
                                    <input type="text" id="chair-name-filter" placeholder="교수명 검색" onkeyup="filterCommitteeMembers('chair')"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                </div>
                            </div>

                            <!-- 컬럼 헤더 -->
                            <div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600; color: #6b7280;">
                                <div></div>
                                <div>교번</div>
                                <div>이름</div>
                                <div>학과</div>
                            </div>

                            <div style="flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;" id="chair-list">
                                ${appData.professors.map(prof => renderCommitteeMemberItem(prof, true, 'chair')).join('')}
                            </div>
                        </div>

                        <!-- 오른쪽: 심사위원 -->
                        <div style="padding-left: 24px; display: flex; flex-direction: column;">
                            <h4 class="font-semibold text-gray-900 mb-3" style="font-size: 15px;">
                                심사위원 (복수 선택 가능)
                            </h4>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">학과</label>
                                    <select id="member-dept-filter" onchange="filterCommitteeMembers('member')"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                        <option value="">전체</option>
                                        ${[...new Set(appData.professors.map(p => p.department))].map(dept =>
                                            `<option value="${dept}">${dept}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">교수명</label>
                                    <input type="text" id="member-name-filter" placeholder="교수명 검색" onkeyup="filterCommitteeMembers('member')"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                </div>
                            </div>

                            <!-- 컬럼 헤더 -->
                            <div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-bottom: none; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: 600; color: #6b7280;">
                                <div></div>
                                <div>교번</div>
                                <div>이름</div>
                                <div>학과</div>
                            </div>

                            <div style="flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;" id="member-list">
                                ${appData.professors.map(prof => renderCommitteeMemberItem(prof, false, 'member')).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="admin-modal-footer" style="padding: 20px 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px; background: white; border-radius: 0 0 8px 8px; flex-shrink: 0;">
                    <button onclick="closeCommitteeAssignmentModal()" class="btn-secondary">
                        취소
                    </button>
                    <button onclick="confirmCommitteeAssignment()" class="btn-primary" id="save-committee-btn">
                        <i class="fas fa-check mr-1"></i>배정 완료
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateSaveCommitteeButtonState();
}

function closeCommitteeAssignmentModal() {
    const modal = document.getElementById('committee-assignment-modal');
    if (modal) {
        modal.remove();
    }
    window.selectedReviewTarget = null;
    window.selectedChair = null;
    window.selectedMembers = [];
}

// =============================================================================
// 심사위원 항목 렌더링
// =============================================================================

function renderCommitteeMemberItem(prof, isChair, side) {
    const isSelected = isChair
        ? (window.selectedChair?.id === prof.id)
        : window.selectedMembers.some(m => m.id === prof.id);

    const dataAttrs = `data-dept="${prof.department}" data-name="${prof.name}" data-side="${side}"`;

    return `
        <div class="committee-member-item" ${dataAttrs} style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 12px; align-items: center; padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <input type="${isChair ? 'radio' : 'checkbox'}"
                   name="${side}-committee-select"
                   value="${prof.id}"
                   ${isSelected ? 'checked' : ''}
                   onchange="handleCommitteeSelection('${prof.id}', ${isChair})"
                   style="margin: 0;">
            <div class="text-sm text-gray-900">${prof.employeeNumber || '-'}</div>
            <div class="text-sm font-medium text-gray-900">${prof.name}</div>
            <div class="text-sm text-gray-600">${prof.department}</div>
        </div>
    `;
}

// =============================================================================
// 심사위원 선택 처리
// =============================================================================

function handleCommitteeSelection(profId, isChair) {
    const prof = appData.professors.find(p => p.id === profId);
    if (!prof) return;

    if (isChair) {
        // 심사위원장 선택
        window.selectedChair = { ...prof };
        // 심사위원장이 심사위원 목록에 있으면 제거
        window.selectedMembers = window.selectedMembers.filter(m => m.id !== profId);
        // 심사위원 목록에서 해당 체크박스 해제
        const memberCheckbox = document.querySelector(`#member-list input[value="${profId}"]`);
        if (memberCheckbox) memberCheckbox.checked = false;
    } else {
        // 심사위원 선택
        // 심사위원장으로 선택된 교수는 심사위원으로 선택 불가
        if (window.selectedChair && window.selectedChair.id === profId) {
            showNotification('심사위원장은 심사위원으로 중복 선택할 수 없습니다.', 'warning');
            const checkbox = document.querySelector(`#member-list input[value="${profId}"]`);
            if (checkbox) checkbox.checked = false;
            return;
        }

        const index = window.selectedMembers.findIndex(m => m.id === profId);
        if (index >= 0) {
            // 체크박스 해제 - 선택 취소
            window.selectedMembers.splice(index, 1);
        } else {
            // 체크박스 선택 - 추가
            window.selectedMembers.push({ ...prof });
        }
    }

    updateSaveCommitteeButtonState();
}

// =============================================================================
// 심사위원 필터링
// =============================================================================

function filterCommitteeMembers(side) {
    const deptFilter = document.getElementById(`${side}-dept-filter`)?.value.toLowerCase() || '';
    const nameFilter = document.getElementById(`${side}-name-filter`)?.value.toLowerCase() || '';

    document.querySelectorAll(`.committee-member-item[data-side="${side}"]`).forEach(item => {
        const dept = item.dataset.dept.toLowerCase();
        const name = item.dataset.name.toLowerCase();

        // 체크박스가 선택되어 있는지 확인
        const checkbox = item.querySelector('input[type="checkbox"], input[type="radio"]');
        const isChecked = checkbox && checkbox.checked;

        const matchDept = !deptFilter || dept === deptFilter;
        const matchName = !nameFilter || name.includes(nameFilter);

        // 선택된 항목은 필터와 관계없이 항상 표시
        if (isChecked) {
            item.style.display = '';
        } else {
            item.style.display = (matchDept && matchName) ? '' : 'none';
        }
    });
}

// =============================================================================
// 저장 버튼 상태 업데이트
// =============================================================================

function updateSaveCommitteeButtonState() {
    const saveBtn = document.getElementById('save-committee-btn');
    if (!saveBtn) return;

    const reviewTarget = window.selectedReviewTarget;
    const chair = window.selectedChair;
    const members = window.selectedMembers;

    if (!reviewTarget) {
        saveBtn.disabled = true;
        return;
    }

    const isValid = !!chair;

    saveBtn.disabled = !isValid;
}

// =============================================================================
// 심사위원 배정 확인
// =============================================================================

function confirmCommitteeAssignment() {
    const reviewTarget = window.selectedReviewTarget;
    const chair = window.selectedChair;
    const members = window.selectedMembers;

    // 유효성 검사
    if (!chair) {
        showNotification('심사위원장을 선택해주세요.', 'warning');
        return;
    }

    // 심사위원 배정 상태 업데이트
    const targetIndex = appData.committeeAssignmentData.findIndex(rt => rt.id === reviewTarget.id);
    if (targetIndex > -1) {
        appData.committeeAssignmentData[targetIndex].assignmentStatus = '배정 완료';
    }

    closeCommitteeAssignmentModal();
    showCommitteeAssignment();

    showNotification(
        `${reviewTarget.studentName} 학생의 심사위원 배정이 완료되었습니다. (심사위원장: ${chair.name}, 심사위원: ${members.length}명)`,
        'success'
    );
}

console.log('✅ 심사위원 배정 함수 로드 완료');

// ==================== 심사 일정 관리 ====================

/**
 * 일정 상세 화면 표시
 */
function showScheduleDetail(scheduleId) {
    alert('일정 상세 화면 (ID: ' + scheduleId + ')\n\n상세 화면은 추후 구현 예정입니다.');
}

// ========== 사용자 관리 ==========

// 전역 변수
let filteredUsers = [];

/**
 * 사용자 관리 초기화
 */
function initUserManagement() {
    filteredUsers = [...appData.users];
    renderUserTable();
}

/**
 * 사용자 테이블 렌더링
 */
function renderUserTable() {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;

    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                    조회 결과가 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredUsers.map((user, index) => {
        const globalIndex = index + 1;
        const gradeDisplay = user.userType === '학생' ? (user.grade || '-') : '-';

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-center">
                    <input type="checkbox"
                           class="user-checkbox rounded border-gray-300"
                           value="${user.id}">
                </td>
                <td class="px-4 py-3 text-center text-sm text-gray-900">${globalIndex}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-900">${user.userType}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-900">${user.department}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-900">${user.idNumber}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-900">${user.name}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-900">${gradeDisplay}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-900">${user.academicStatus}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="loginAsUser('${user.id}')"
                            class="px-4 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                        로그인
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * 조회 필터 적용
 */
function applyUserFilters() {
    const userType = document.getElementById('filter-userType')?.value || '전체';
    const idNumber = document.getElementById('filter-idNumber')?.value.trim() || '';
    const userName = document.getElementById('filter-userName')?.value.trim() || '';

    filteredUsers = appData.users.filter(user => {
        if (userType !== '전체' && user.userType !== userType) return false;
        if (idNumber && !user.idNumber.includes(idNumber)) return false;
        if (userName && !user.name.includes(userName)) return false;
        return true;
    });

    renderUserTable();
    showAlert(`조회 결과: ${filteredUsers.length}건`);
}

/**
 * 조회 필터 초기화
 */
function resetUserFilters() {
    document.getElementById('filter-userType').value = '전체';
    document.getElementById('filter-idNumber').value = '';
    document.getElementById('filter-userName').value = '';

    filteredUsers = [...appData.users];
    renderUserTable();
    showAlert('조회 조건이 초기화되었습니다.');
}

/**
 * 전체 선택/해제
 */
function toggleAllUsers(checked) {
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.checked = checked;
    });
}

/**
 * 사용자로 로그인
 */
function loginAsUser(userId) {
    const user = appData.users.find(u => u.id === userId);
    if (!user) {
        showAlert('사용자를 찾을 수 없습니다.', 'error');
        return;
    }

    const confirmMsg = `${user.name}(${user.idNumber})님으로 로그인하시겠습니까?\n로그인 후 해당 사용자의 화면으로 이동됩니다.`;

    if (!confirm(confirmMsg)) {
        return;
    }

    showAlert(`${user.name}님으로 로그인합니다...`);

    // 사용자 유형별 화면으로 리다이렉트
    setTimeout(() => {
        window.location.href = user.loginUrl;
    }, 500);
}

// Export functions
window.initUserManagement = initUserManagement;
window.renderUserTable = renderUserTable;
window.applyUserFilters = applyUserFilters;
window.resetUserFilters = resetUserFilters;
window.toggleAllUsers = toggleAllUsers;
window.loginAsUser = loginAsUser;

console.log('✅ 사용자 관리 함수 로드 완료');

// ========== 관리자 대시보드 렌더링 함수 ==========

// 관리자 대시보드 데이터
const adminNotices = [
    { id: 1, title: '2025-1학기 본심사 일정 안내', date: '2024.11.15' },
    { id: 2, title: '예비심사 결과 입력 안내', date: '2024.11.10' },
    { id: 3, title: '논문지도 일정 변경 공지', date: '2024.11.08' },
];

const adminQuickMenus = [
    { id: 1, name: '논문지도학생현황', view: 'stageManagement' },
    { id: 2, name: '논문지도단계등록', view: 'typeManagement' },
    { id: 3, name: '심사위원등록', view: 'committeeAssignment' },
];

const adminOutlinks = [
    { id: 1, title: '아웃링크 1', description: '관련 사이트 설명', url: '#outlink1' },
    { id: 2, title: '아웃링크 2', description: '관련 사이트 설명', url: '#outlink2' },
    { id: 3, title: '아웃링크 3', description: '관련 사이트 설명', url: '#outlink3' },
];

// 공지사항 렌더링
function renderAdminNotices() {
    const container = document.getElementById('admin-notice-list');
    if (!container) return;

    container.innerHTML = adminNotices.map((n, i) => `
        <div style="display: flex; justify-content: space-between; padding: 12px 0; ${i < adminNotices.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''} cursor: pointer;"
             onmouseover="this.style.background='#f9fafb';" onmouseout="this.style.background='transparent';"
             onclick="switchView('noticeManagement')">
            <span style="font-size: 14px; color: #1a1a1a;">${n.title}</span>
            <span style="font-size: 13px; color: #9ca3af;">${n.date}</span>
        </div>
    `).join('');
}

// 자주 찾는 메뉴 렌더링
function renderAdminQuickMenus() {
    const container = document.getElementById('admin-quick-menu-list');
    if (!container) return;

    container.innerHTML = adminQuickMenus.map((m, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; ${i < adminQuickMenus.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''} cursor: pointer;"
             onclick="switchView('${m.view}')"
             onmouseover="this.style.background='#f9fafb';" onmouseout="this.style.background='transparent';">
            <span style="font-size: 14px; color: #1a1a1a;">${m.name}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
    `).join('');
}

// 아웃링크 렌더링
function renderAdminOutlinks() {
    const container = document.getElementById('admin-outlink-cards');
    if (!container) return;

    container.innerHTML = adminOutlinks.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer"
           style="display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 6px; padding: 12px 16px; text-decoration: none; transition: all 0.2s;"
           onmouseover="this.style.background='#F1F5F9'; this.style.borderColor='#6A0028';"
           onmouseout="this.style.background='#F8FAFC'; this.style.borderColor='#E5E7EB';">
            <div>
                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a;">${link.title}</div>
                <div style="font-size: 12px; color: #6b7280;">${link.description}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A0028" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        </a>
    `).join('');
}

// 관리자 대시보드 초기화
function initAdminDashboard() {
    renderAdminNotices();
    renderAdminQuickMenus();
    renderAdminOutlinks();
}

// Export admin dashboard functions
window.initAdminDashboard = initAdminDashboard;
window.renderAdminNotices = renderAdminNotices;
window.renderAdminQuickMenus = renderAdminQuickMenus;
window.renderAdminOutlinks = renderAdminOutlinks;

console.log('✅ 관리자 대시보드 함수 로드 완료');
