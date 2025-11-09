// ========== 뷰 전환 함수 ==========

function switchView(viewName) {
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
        guidanceProgress: '논문지도 진행 현황',
        scheduleManagement: '논문지도 일정 관리',
        requirementManagement: '논문 제출 요건 관리',
        stageManagement: '논문지도 단계 관리',
        typeManagement: '지도 단계 유형 관리',
        evaluationCriteria: '평가 기준 관리'
    };
    
    document.getElementById('view-title').textContent = viewTitles[viewName] || '대시보드';
    
    // 컨텐츠 렌더링
    document.getElementById('content-area').innerHTML = views[viewName]();
}

// ========== 이벤트 리스너 초기화 ==========

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ 논문 지도 관리 시스템 초기화 완료');
    
    // 사이드바 링크 클릭 이벤트
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            switchView(view);
        });
    });

    // 모달 닫기 버튼들
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('confirm-cancel').addEventListener('click', closeConfirm);
    document.getElementById('alert-ok').addEventListener('click', closeAlert);

    // 모달 백드롭 클릭
    document.getElementById('modal-backdrop').addEventListener('click', () => {
        closeModal();
        closeConfirm();
        closeAlert();
    });

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
    const filters = {
        year: document.getElementById('weekly-search-year')?.value || '',
        semester: document.getElementById('weekly-search-semester')?.value || '',
        major: document.getElementById('weekly-search-major')?.value || '',
        degree: document.getElementById('weekly-search-degree')?.value || '',
        advisor: document.getElementById('weekly-search-advisor')?.value || '',
        count: document.getElementById('weekly-search-count')?.value || '',
        keyword: document.getElementById('weekly-search-keyword')?.value.toLowerCase().trim() || ''
    };
    
    // 원본 데이터 백업
    if (!appData.originalWeeklyGuidanceStudents) {
        appData.originalWeeklyGuidanceStudents = [...appData.weeklyGuidanceStudents];
    }
    
    // 필터링
    let filtered = [...appData.originalWeeklyGuidanceStudents];
    
    // 학과
    if (filters.major) {
        filtered = filtered.filter(item => item.major === filters.major);
    }
    
    // 학위과정
    if (filters.degree) {
        filtered = filtered.filter(item => item.degree === filters.degree);
    }
    
    // 지도교수 (복수 지도교수 고려)
    if (filters.advisor) {
        filtered = filtered.filter(item => item.advisors.includes(filters.advisor));
    }
    
    // 지도횟수
    if (filters.count) {
        const count = parseInt(filters.count);
        if (count === 0) {
            // 지도계획 없음
            filtered = filtered.filter(item => item.guidanceCount === 0);
        } else {
            // N회 이상
            filtered = filtered.filter(item => item.guidanceCount >= count);
        }
    }
    
    // 학번/성명 키워드
    if (filters.keyword) {
        filtered = filtered.filter(item => {
            return item.studentName.toLowerCase().includes(filters.keyword) ||
                   item.studentId.toLowerCase().includes(filters.keyword);
        });
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
    
    // 검색 필드 초기화
    const searchFields = [
        'weekly-search-year',
        'weekly-search-semester',
        'weekly-search-major',
        'weekly-search-degree',
        'weekly-search-advisor',
        'weekly-search-count',
        'weekly-search-keyword'
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

function searchGuidanceProgress() {
    const filters = {
        year: document.getElementById('progress-search-year')?.value || '',
        semester: document.getElementById('progress-search-semester')?.value || '',
        major: document.getElementById('progress-search-major')?.value || '',
        degree: document.getElementById('progress-search-degree')?.value || '',
        stage: document.getElementById('progress-search-stage')?.value || '',
        status: document.getElementById('progress-search-status')?.value || '',
        keyword: document.getElementById('progress-search-keyword')?.value.toLowerCase().trim() || ''
    };
    
    // 원본 데이터 백업
    if (!appData.originalGuidanceProgress) {
        appData.originalGuidanceProgress = [...appData.guidanceProgress];
    }
    
    // 필터링
    let filtered = [...appData.originalGuidanceProgress];
    
    // 학과
    if (filters.major) {
        filtered = filtered.filter(item => item.major === filters.major);
    }
    
    // 학위과정
    if (filters.degree) {
        filtered = filtered.filter(item => item.degree === filters.degree);
    }
    
    // 단계
    if (filters.stage) {
        filtered = filtered.filter(item => item.stage === filters.stage);
    }
    
    // 피드백 상태
    if (filters.status) {
        filtered = filtered.filter(item => item.feedbackStatus === filters.status);
    }
    
    // 학번/성명 키워드
    if (filters.keyword) {
        filtered = filtered.filter(item => {
            return item.studentName.toLowerCase().includes(filters.keyword) ||
                   item.studentId.toLowerCase().includes(filters.keyword);
        });
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
    
    // 검색 필드 초기화
    const searchFields = [
        'progress-search-year',
        'progress-search-semester',
        'progress-search-major',
        'progress-search-degree',
        'progress-search-stage',
        'progress-search-status',
        'progress-search-keyword'
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

// ========== 학위논문 심사 관리 탭 전환 (ID 6) ==========
function switchThesisTab(tab) {
    window.currentThesisTab = tab;
    switchView('thesisReview');
}

function searchThesisReview() {
    // TODO: 실제 검색 로직
    showAlert('검색 기능은 백엔드 연동 후 동작합니다.');
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
    showAlert('검색 조건이 초기화되었습니다.');
}

// ========== 체크박스 전체 선택 (ID 9) ==========
function toggleAllCheckboxes(source) {
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
}

// ========== 학술지 상세보기 ==========
function viewJournalDetail(id) {
    showAlert(`학술지 심사 상세 (ID: ${id})`);
    // TODO: 모달 열기
}

// ========== 연구계획서 상세보기 ==========
function viewResearchProposalDetail(id) {
    showAlert(`연구계획서 상세 (ID: ${id})`);
    // TODO: 모달 열기
}

console.log('🚀 모든 JavaScript 모듈 로드 완료!');
console.log('💡 window.debugInfo()를 실행하여 시스템 상태를 확인하세요.');

// ==================== ID 17-20: 주차별 논문지도 상세 기능 ====================

// ID 17: 주차별 논문지도 상세보기
function viewWeeklyGuidanceDetail(studentId) {
    const student = appData.weeklyGuidanceStudents.find(s => s.studentId === studentId);
    const records = appData.guidanceRecords.filter(r => r.studentId === studentId);
    
    if (!student) {
        showNotification('학생 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    // ID 18: 지도내역 리스트 표시
    const recordsHtml = records.length > 0 ? records.map((record, index) => `
        <div class="border-b border-gray-200 py-4 hover:bg-gray-50 cursor-pointer"
             onclick="viewGuidanceRecordDetail('${record.id}')">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                    <span class="font-semibold text-gray-800">Week ${record.week}</span>
                    <span class="text-sm text-gray-600">${record.date}</span>
                    <span class="px-2 py-1 text-xs rounded-full ${getMethodBadgeClass(record.method)}">
                        ${record.method}
                    </span>
                </div>
                <span class="text-sm text-gray-600">${record.advisor}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 mb-1">${record.topic}</div>
            <div class="text-sm text-gray-600 line-clamp-2">${record.content}</div>
        </div>
    `).join('') : '<div class="text-center py-8 text-gray-500">지도 내역이 없습니다.</div>';
    
    // ID 20: 통계 요약
    const stats = calculateGuidanceStats(records);
    
    const modalHtml = `
        <div id="guidance-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             onclick="if(event.target.id==='guidance-detail-modal') closeGuidanceDetailModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <!-- 헤더 -->
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">주차별 논문지도 상세</h3>
                    <button onclick="closeGuidanceDetailModal()" 
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
                            <div class="font-semibold text-gray-800">${student.advisors.join(', ')}</div>
                        </div>
                    </div>
                    
                    <!-- ID 20: 통계 요약 -->
                    <div class="p-6 border-b bg-blue-50">
                        <h4 class="text-sm font-bold text-gray-800 mb-4">지도 통계</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-blue-600">${stats.totalCount}</div>
                                <div class="text-xs text-gray-600 mt-1">총 지도 횟수</div>
                            </div>
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-green-600">${stats.faceToFace}</div>
                                <div class="text-xs text-gray-600 mt-1">대면 지도</div>
                            </div>
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-purple-600">${stats.online}</div>
                                <div class="text-xs text-gray-600 mt-1">비대면 지도</div>
                            </div>
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-orange-600">${stats.email}</div>
                                <div class="text-xs text-gray-600 mt-1">이메일 지도</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ID 18: 지도내역 리스트 -->
                    <div class="p-6">
                        <h4 class="text-sm font-bold text-gray-800 mb-4">지도 내역 (최신순)</h4>
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

// ID 19: 지도일지 상세 보기
function viewGuidanceRecordDetail(recordId) {
    const record = appData.guidanceRecords.find(r => r.id == recordId);
    
    if (!record) {
        showNotification('지도 내역을 찾을 수 없습니다.', 'error');
        return;
    }
    
    const student = appData.weeklyGuidanceStudents.find(s => s.studentId === record.studentId);
    
    const detailHtml = `
        <div id="guidance-record-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
             onclick="if(event.target.id==='guidance-record-detail-modal') closeGuidanceRecordDetailModal()">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
                 onclick="event.stopPropagation()">
                
                <!-- 헤더 -->
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-lg font-bold">지도일지 상세</h3>
                    <button onclick="closeGuidanceRecordDetailModal()" 
                            class="text-white hover:text-gray-200 text-2xl leading-none">
                        ×
                    </button>
                </div>
                
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 80px);">
                    <!-- 기본 정보 -->
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <div class="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <span class="text-xs text-gray-500">Week</span>
                                <div class="font-semibold text-lg text-gray-800">Week ${record.week}</div>
                            </div>
                            <div>
                                <span class="text-xs text-gray-500">지도일자</span>
                                <div class="font-semibold text-gray-800">${record.date}</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="text-xs text-gray-500">학생</span>
                                <div class="font-semibold text-gray-800">${student ? student.studentName : '-'} (${record.studentId})</div>
                            </div>
                            <div>
                                <span class="text-xs text-gray-500">지도교수</span>
                                <div class="font-semibold text-gray-800">${record.advisor}</div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <span class="text-xs text-gray-500">지도방법</span>
                            <div>
                                <span class="inline-block mt-1 px-3 py-1 text-sm rounded-full ${getMethodBadgeClass(record.method)}">
                                    ${record.method}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 지도 내용 -->
                    <div class="mb-6">
                        <h5 class="text-sm font-bold text-gray-800 mb-2">지도 주제</h5>
                        <div class="bg-blue-50 rounded-lg p-4">
                            <div class="text-gray-800 font-medium">${record.topic}</div>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <h5 class="text-sm font-bold text-gray-800 mb-2">지도 내용</h5>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="text-gray-700 whitespace-pre-wrap">${record.content}</div>
                        </div>
                    </div>
                    
                    <div>
                        <h5 class="text-sm font-bold text-gray-800 mb-2">교수 의견</h5>
                        <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                            <div class="text-gray-700">${record.professorComment}</div>
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <button onclick="closeGuidanceRecordDetailModal()" 
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
function closeGuidanceDetailModal() {
    const modal = document.getElementById('guidance-detail-modal');
    if (modal) modal.remove();
}

function closeGuidanceRecordDetailModal() {
    const modal = document.getElementById('guidance-record-detail-modal');
    if (modal) modal.remove();
}

// ID 20: 통계 계산
function calculateGuidanceStats(records) {
    return {
        totalCount: records.length,
        faceToFace: records.filter(r => r.method === '대면').length,
        online: records.filter(r => r.method === '비대면').length,
        email: records.filter(r => r.method === '이메일').length
    };
}

// 지도방법 배지 클래스
function getMethodBadgeClass(method) {
    const classes = {
        '대면': 'bg-green-100 text-green-700',
        '비대면': 'bg-purple-100 text-purple-700',
        '이메일': 'bg-orange-100 text-orange-700'
    };
    return classes[method] || 'bg-gray-100 text-gray-700';
}

// Export
window.viewWeeklyGuidanceDetail = viewWeeklyGuidanceDetail;
window.viewGuidanceRecordDetail = viewGuidanceRecordDetail;
window.closeGuidanceDetailModal = closeGuidanceDetailModal;
window.closeGuidanceRecordDetailModal = closeGuidanceRecordDetailModal;

console.log('✅ ID 17-20: 주차별 논문지도 상세 기능 로드 완료');

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
                <span>카피킬러 ${record.copyKiller}%</span>
                <span>GPT킬러 ${record.gptKiller}%</span>
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
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
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
                                <div class="text-xs text-gray-600 mt-1">평균 카피킬러</div>
                            </div>
                            <div class="bg-white rounded-lg p-4 text-center">
                                <div class="text-lg font-bold text-red-600">${stats.avgGptKiller.toFixed(1)}%</div>
                                <div class="text-xs text-gray-600 mt-1">평균 GPT킬러</div>
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
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
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
                                    class="px-4 py-2 bg-[#6A0028] text-white rounded text-sm hover:bg-[#500020]">
                                <i class="fas fa-download"></i> 파일 다운로드
                            </button>
                        </div>
                    </div>
                    
                    <!-- 검증 결과 -->
                    <div class="mb-6">
                        <h5 class="text-sm font-bold text-gray-800 mb-2">표절 검증 결과</h5>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                                <div class="text-xs text-gray-600 mb-1">카피킬러</div>
                                <div class="text-2xl font-bold ${record.copyKiller > 10 ? 'text-red-600' : 'text-green-600'}">
                                    ${record.copyKiller}%
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    ${record.copyKiller > 10 ? '기준 초과' : '정상 범위'}
                                </div>
                            </div>
                            <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                                <div class="text-xs text-gray-600 mb-1">GPT킬러</div>
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

// ==================== ID 26-29: 워크플로우 관리 상세 기능 ====================

// ID 26: 워크플로우 상세보기
function viewStageDetail(stageId) {
    const stage = appData.stages.find(s => s.id === stageId);
    
    if (!stage) {
        showNotification('워크플로우 정보를 찾을 수 없습니다.', 'error');
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
                        <button onclick="viewEvaluationCriteria(${step.evaluationCriteriaId})" 
                                class="mt-2 text-xs text-blue-600 hover:underline">
                            <i class="fas fa-eye"></i> 평가표 상세보기
                        </button>
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
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold">워크플로우 상세</h3>
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
                                <div class="text-xs text-gray-500 mb-1">워크플로우명</div>
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
                        <h4 class="text-lg font-bold text-gray-800 mb-4">워크플로우 단계</h4>
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
                                    <button onclick="viewEvaluationCriteria(${step.evaluationCriteriaId})" 
                                            class="mt-3 px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                        <i class="fas fa-clipboard-list"></i> 평가표 보기
                                    </button>
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
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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

// 워크플로우 수정 (추후 구현)
function editStage(stageId) {
    showNotification(`워크플로우 ID ${stageId} 수정 (추후 구현)`, 'info');
}

// 모달 닫기
function closeStageDetailModal() {
    const modal = document.getElementById('stage-detail-modal');
    if (modal) modal.remove();
}

// Export
window.viewStageDetail = viewStageDetail;
window.viewEvaluationCriteria = viewEvaluationCriteria;
window.editStage = editStage;
window.closeStageDetailModal = closeStageDetailModal;

console.log('✅ ID 26-29: 워크플로우 관리 상세 기능 로드 완료');

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
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
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
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
                
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
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
                        <table class="min-w-full text-sm border">
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
                
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
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
                                    <div class="bg-blue-600 h-4 rounded-full" style="width: 30%"></div>
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
                                    <div class="bg-blue-500 w-12 rounded-t transition-all hover:bg-blue-600" 
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
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
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
                                    <div class="bg-blue-600 h-3 rounded-full" style="width: ${creditProgress}%"></div>
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
                                <div class="text-xs text-gray-600 mt-1">평균 카피킬러</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <button onclick="editStudent('${student.id}')" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
                <div class="bg-[#6A0028] text-white px-6 py-4 flex items-center justify-between">
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
                                                <div class="bg-blue-600 h-2 rounded-full" style="width: ${percentage}%"></div>
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
