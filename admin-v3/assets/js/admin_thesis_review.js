// 관리자용 학위논문 심사 화면
// professor-v3의 화면을 재사용하여 읽기 전용으로 표시

// ==================== 심사 목록 렌더링 (관리자용) ====================
function renderAdminThesisReviewList() {
    // 모든 심사 배정 가져오기 (관리자는 모든 심사 조회 가능)
    const assignments = ReviewService.getAllReviewAssignments();

    const listContainer = document.getElementById('admin-thesis-review-list');
    const countEl = document.getElementById('admin-thesis-review-count');

    if (!listContainer) return;

    // 카운트 업데이트
    if (countEl) {
        countEl.textContent = `총 ${assignments.length}건`;
    }

    if (assignments.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">등록된 심사가 없습니다</h3>
                <p class="text-gray-500">심사가 배정되면 이곳에 표시됩니다.</p>
            </div>
        `;
        return;
    }

    // 필터링
    const filters = getCurrentAdminReviewFilters();
    const filteredAssignments = filterAdminAssignments(assignments, filters);

    // 필터링된 카운트 업데이트
    if (countEl && filteredAssignments.length !== assignments.length) {
        countEl.textContent = `${filteredAssignments.length}건 (전체 ${assignments.length}건)`;
    }

    if (filteredAssignments.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
                <p class="text-gray-500">다른 조건으로 검색해보세요.</p>
            </div>
        `;
        return;
    }

    // 테이블 렌더링 (교수용과 동일하되, 관리 버튼만 '상세보기'로 변경)
    const html = `
        <!-- 테이블 컨테이너 -->
        <div class="table-container">
            <!-- 테이블 헤더 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">심사 대상 논문 목록</h3>
                    <span class="table-count">(총 ${filteredAssignments.length}건)</span>
                </div>
            </div>
            <div class="table-scroll">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th style="width: 60px;">순번</th>
                            <th style="width: 80px;">학년도</th>
                            <th style="width: 60px;">학기</th>
                            <th style="width: 100px;">대학구분</th>
                            <th style="width: 100px;">계열/대학원</th>
                            <th style="width: 120px;">학부(과)전공</th>
                            <th style="width: 150px;">학과/전공</th>
                            <th style="width: 80px;">학위과정</th>
                            <th style="width: 80px;">학적상태</th>
                            <th style="width: 90px;">학번</th>
                            <th style="width: 80px;">성명</th>
                            <th style="width: 100px;">지도교수명</th>
                            <th style="width: 100px;">심사단계</th>
                            <th style="width: 100px;">심사결과</th>
                            <th style="width: 100px;">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredAssignments.map((assignment, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${assignment.year || '2025'}</td>
                                <td>${assignment.semester || '1'}</td>
                                <td>${assignment.graduate || '일반대학원'}</td>
                                <td>${assignment.college || '일반대학원'}</td>
                                <td>${assignment.undergraduate || '-'}</td>
                                <td>${assignment.major || '-'}</td>
                                <td>${assignment.degree || '석사'}</td>
                                <td>${assignment.academicStatus || '재학'}</td>
                                <td>${assignment.studentNumber}</td>
                                <td>${assignment.studentName}</td>
                                <td>${assignment.advisorName || '-'}</td>
                                <td>${assignment.reviewType || '예비심사'}</td>
                                <td>
                                    ${getProgressStatusText(assignment.evaluationProgress)}
                                </td>
                                <td onclick="event.stopPropagation()">
                                    <div class="flex gap-2 justify-center">
                                        <button onclick="openAdminReviewDetail('${assignment.id}')"
                                                class="text-[#6A0028] hover:text-[#6A0028] text-xs font-medium px-2 py-1 border border-[#F8BBD9] rounded hover:bg-[#FCE4EC]">
                                            상세보기
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    listContainer.innerHTML = html;
}

// ==================== 심사유형 필터 전역 변수 ====================
let currentAdminReviewTypeFilter = 'all';

// 심사유형 필터 토글
function toggleAdminReviewType(type) {
    currentAdminReviewTypeFilter = type;

    // 버튼 활성화 상태 변경
    document.querySelectorAll('[id^="admin-review-type-"]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`admin-review-type-${type}`).classList.add('active');

    // 목록 재렌더링
    renderAdminThesisReviewList();
}

// ==================== 필터링 ====================
function getCurrentAdminReviewFilters() {
    return {
        reviewType: currentAdminReviewTypeFilter,
        year: document.getElementById('admin-filter-year')?.value || '',
        semester: document.getElementById('admin-filter-semester')?.value || '',
        graduate: document.getElementById('admin-filter-graduate')?.value || '',
        college: document.getElementById('admin-filter-college')?.value || '',
        undergraduate: document.getElementById('admin-filter-undergraduate')?.value || '',
        major: document.getElementById('admin-filter-major')?.value || '',
        degree: document.getElementById('admin-filter-degree')?.value || '',
        academicStatus: document.getElementById('admin-filter-academic-status')?.value || '',
        studentId: document.getElementById('admin-filter-student-id')?.value || '',
        name: document.getElementById('admin-filter-name')?.value || '',
        advisorName: document.getElementById('admin-filter-advisor')?.value || '',
        reviewResult: document.getElementById('admin-filter-review-result')?.value || ''
    };
}

function filterAdminAssignments(assignments, filters) {
    return assignments.filter(assignment => {
        // 심사유형 필터
        if (filters.reviewType && filters.reviewType !== 'all') {
            const reviewType = assignment.reviewType || '예비심사';
            if (filters.reviewType === 'preliminary' && reviewType !== '예비심사') {
                return false;
            }
            if (filters.reviewType === 'main' && reviewType !== '본심사') {
                return false;
            }
        }

        // 학년도 필터
        if (filters.year && (assignment.year || '2025') !== filters.year) {
            return false;
        }

        // 학기 필터
        if (filters.semester && String(assignment.semester) !== filters.semester) {
            return false;
        }

        // 대학구분 필터
        if (filters.graduate && assignment.graduate !== filters.graduate) {
            return false;
        }

        // 계열/대학원 필터
        if (filters.college && assignment.college !== filters.college) {
            return false;
        }

        // 학부(과)전공 필터
        if (filters.undergraduate && assignment.undergraduate !== filters.undergraduate) {
            return false;
        }

        // 학과/전공 필터
        if (filters.major && assignment.major !== filters.major) {
            return false;
        }

        // 학위과정 필터
        if (filters.degree && assignment.degree !== filters.degree) {
            return false;
        }

        // 학적상태 필터
        if (filters.academicStatus && assignment.academicStatus !== filters.academicStatus) {
            return false;
        }

        // 학번 검색
        if (filters.studentId) {
            if (!assignment.studentNumber.includes(filters.studentId)) {
                return false;
            }
        }

        // 성명 검색
        if (filters.name) {
            if (!assignment.studentName.toLowerCase().includes(filters.name.toLowerCase())) {
                return false;
            }
        }

        // 지도교수명 검색
        if (filters.advisorName) {
            if (!assignment.advisorName || !assignment.advisorName.toLowerCase().includes(filters.advisorName.toLowerCase())) {
                return false;
            }
        }

        // 처리결과 필터
        if (filters.reviewResult) {
            const progressText = getProgressStatusText(assignment.evaluationProgress);
            if (progressText !== filters.reviewResult) {
                return false;
            }
        }

        return true;
    });
}

function searchAdminReviews() {
    renderAdminThesisReviewList();
}

// ==================== 심사 상세 열기 (관리자용 - 읽기 전용) ====================
function openAdminReviewDetail(assignmentId) {
    // 목록 화면 숨기기
    const mainContent = document.getElementById('admin-main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }

    // 상세 화면 생성
    const detailScreen = document.createElement('div');
    detailScreen.id = 'admin-review-detail-screen';
    detailScreen.className = 'review-detail-screen';
    detailScreen.dataset.assignmentId = assignmentId;

    detailScreen.innerHTML = `
        <div class="review-detail-content-wrapper">
            <!-- 헤더 -->
            <div class="review-detail-header" style="padding: 12px 24px;">
                <button onclick="closeAdminReviewDetailScreen()" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
            </div>

            <!-- 상세 내용 (교수용 renderReviewDetail이 'review-detail-content'를 찾음) -->
            <div id="review-detail-content" class="review-detail-body"></div>
        </div>
    `;

    document.body.appendChild(detailScreen);

    // 상세 정보 렌더링 (관리자 모드로 교수용 함수 호출)
    setTimeout(() => {
        if (typeof window.renderReviewDetail !== 'function') {
            console.error('❌ renderReviewDetail 함수를 찾을 수 없습니다.');
            alert('심사 상세 렌더링 함수를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }

        // 교수용 renderReviewDetail 함수 호출 (chair view, admin mode)
        // 세 번째 파라미터 isAdminMode=true로 관리자 권한 부여
        window.renderReviewDetail(assignmentId, 'chair', true);

        // 읽기 전용 모드 적용
        setTimeout(() => {
            makeAllInputsReadonly();
            showAdminNotice();
        }, 100);
    }, 50);
}

function closeAdminReviewDetailScreen() {
    const detailScreen = document.getElementById('admin-review-detail-screen');
    if (detailScreen) {
        detailScreen.remove();
    }

    // 목록 화면 다시 표시
    const mainContent = document.getElementById('admin-main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }

    // 목록 재렌더링
    if (typeof renderAdminThesisReviewList === 'function') {
        renderAdminThesisReviewList();
    }
}

// ==================== 읽기 전용 모드 적용 ====================
function makeAllInputsReadonly() {
    // review-detail-content 내부의 모든 입력 요소 비활성화
    // IMPORTANT: 학술지 심사(journal-review-content)에는 적용하지 않음
    const container = document.getElementById('review-detail-content');
    if (!container) {
        // journal-review-content일 수 있으므로 에러 출력 안 함
        return;
    }

    // 모든 input, textarea, select 비활성화
    container.querySelectorAll('input, textarea, select').forEach(el => {
        el.disabled = true;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.readOnly = true;
        }
    });

    // 제출/저장 버튼은 숨기되, 결정 선택 버튼은 이미 disabled 속성이 있으므로 그대로 유지
    container.querySelectorAll('button[type="submit"], #save-draft-btn, #submit-evaluation-btn, button[onclick*="submitChairDecision"], button[onclick*="submitJournalChairDecision"]').forEach(btn => {
        btn.style.display = 'none';
    });

    // 결정 선택 버튼들의 onclick 이벤트 제거 (이미 disabled지만 추가 안전장치)
    container.querySelectorAll('button[onclick*="selectDecision"], button[onclick*="selectJournalDecision"]').forEach(btn => {
        btn.onclick = null;
        btn.style.pointerEvents = 'none';
    });

    // 파일 업로드 버튼 숨기기 (file input과 label 제거 - 다운로드 버튼과 충돌)
    container.querySelectorAll('button[onclick*="upload"], input[type="file"]').forEach(el => {
        el.style.display = 'none';
        // label도 함께 숨기기 (input의 부모가 label인 경우)
        if (el.tagName === 'INPUT' && el.type === 'file' && el.parentElement.tagName === 'LABEL') {
            el.parentElement.style.display = 'none';
        }
    });

    console.log('✅ Read-only mode applied');
}

// ==================== 관리자 안내 배너 표시 ====================
function showAdminNotice() {
    // 관리자 안내 배너는 표시하지 않음 (사용자 요청)
    console.log('✅ Admin notice banner skipped (not needed)');
}

// ==================== 초기화 ====================
function initAdminThesisReview() {
    console.log('🎯 Initializing Admin Thesis Review');

    // 컨테이너 확인
    const listContainer = document.getElementById('admin-thesis-review-list');
    console.log('🎯 List container found:', !!listContainer);

    if (!listContainer) {
        console.error('❌ admin-thesis-review-list container not found!');
        return;
    }

    // 초기 렌더링
    console.log('🎯 Calling renderAdminThesisReviewList...');
    renderAdminThesisReviewList();
    console.log('✅ Initial render completed');
}

// Export
window.initAdminThesisReview = initAdminThesisReview;
window.renderAdminThesisReviewList = renderAdminThesisReviewList;
window.searchAdminReviews = searchAdminReviews;
window.toggleAdminReviewType = toggleAdminReviewType;
window.openAdminReviewDetail = openAdminReviewDetail;
window.closeAdminReviewDetailScreen = closeAdminReviewDetailScreen;
window.makeAllInputsReadonly = makeAllInputsReadonly;
window.showAdminNotice = showAdminNotice;
