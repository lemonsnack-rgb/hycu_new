// 관리자용 학술지 대체심사 화면
// professor-v3의 화면을 재사용하여 읽기 전용으로 표시

// ==================== 학술지 심사 목록 렌더링 (관리자용) ====================
function renderAdminJournalReviewList() {
    // 모든 학술지 심사 가져오기 (관리자는 모든 심사 조회 가능)
    const journals = getJournalReviews();

    const listContainer = document.getElementById('admin-journal-review-list');
    const countEl = document.getElementById('admin-journal-review-count');

    if (!listContainer) return;

    // 카운트 업데이트
    if (countEl) {
        countEl.textContent = `총 ${journals.length}건`;
    }

    if (journals.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">등록된 학술지 심사가 없습니다</h3>
                <p class="text-gray-500">학술지 심사가 배정되면 이곳에 표시됩니다.</p>
            </div>
        `;
        return;
    }

    // 필터링
    const filters = getCurrentAdminJournalFilters();
    const filteredJournals = filterAdminJournals(journals, filters);

    // 필터링된 카운트 업데이트
    if (countEl && filteredJournals.length !== journals.length) {
        countEl.textContent = `${filteredJournals.length}건 (전체 ${journals.length}건)`;
    }

    if (filteredJournals.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
                <p class="text-gray-500">다른 조건으로 검색해보세요.</p>
            </div>
        `;
        return;
    }

    // 테이블 렌더링 (교수용 화면과 동일한 컬럼 구조)
    const html = `
        <!-- 테이블 컨테이너 -->
        <div class="table-container">
            <!-- 테이블 헤더 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">학술지 대체심사 목록</h3>
                    <span class="table-count">(총 ${filteredJournals.length}건)</span>
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
                            <th style="width: 100px;">처리결과</th>
                            <th style="width: 100px;">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredJournals.map((journal, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${journal.year || '2025'}</td>
                                <td>${journal.semester || '1'}</td>
                                <td>${journal.collegeType || '일반대학원'}</td>
                                <td>${journal.graduateSchool || '일반대학원'}</td>
                                <td>${journal.undergraduate || '-'}</td>
                                <td>${journal.major || '-'}</td>
                                <td>${journal.degree || '석사'}</td>
                                <td>${journal.academicStatus || '재학'}</td>
                                <td>${journal.studentId}</td>
                                <td>${journal.studentName}</td>
                                <td>${journal.advisorName || '-'}</td>
                                <td>${journal.status}</td>
                                <td onclick="event.stopPropagation()">
                                    <div class="flex gap-2 justify-center">
                                        <button onclick="openAdminJournalReviewDetail(${journal.id})"
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

// 진행상태 배지 생성
function getJournalStatusBadge(journal) {
    const statusMap = {
        '심사대기': '<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">심사대기</span>',
        '심사중': '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">심사중</span>',
        '심사완료': '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">심사완료</span>'
    };
    return statusMap[journal.status] || '<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">-</span>';
}

// 심사결과 배지 생성
function getJournalDecisionBadge(journal) {
    if (!journal.chairDecision || !journal.chairDecision.decision) {
        return '<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">-</span>';
    }

    const decision = journal.chairDecision.decision;
    const decisionMap = {
        '승인': '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✓ 승인</span>',
        '보류': '<span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">⊙ 보류</span>',
        '반려': '<span class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">✗ 반려</span>'
    };
    return decisionMap[decision] || '<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">-</span>';
}

// ==================== 필터링 ====================
function getCurrentAdminJournalFilters() {
    return {
        year: document.getElementById('admin-journal-filter-year')?.value || '',
        semester: document.getElementById('admin-journal-filter-semester')?.value || '',
        major: document.getElementById('admin-journal-filter-major')?.value || '',
        degree: document.getElementById('admin-journal-filter-degree')?.value || '',
        studentId: document.getElementById('admin-journal-filter-student-id')?.value || '',
        name: document.getElementById('admin-journal-filter-name')?.value || '',
        journalName: document.getElementById('admin-journal-filter-journal-name')?.value || '',
        status: document.getElementById('admin-journal-filter-status')?.value || '',
        decision: document.getElementById('admin-journal-filter-decision')?.value || ''
    };
}

function filterAdminJournals(journals, filters) {
    return journals.filter(journal => {
        // 학년도 필터 (submissionDate에서 추출)
        if (filters.year) {
            const journalYear = journal.submissionDate.split('-')[0];
            if (journalYear !== filters.year) {
                return false;
            }
        }

        // 학기 필터 (submissionDate에서 추출)
        if (filters.semester) {
            const month = parseInt(journal.submissionDate.split('-')[1]);
            const journalSemester = month <= 6 ? '1' : '2';
            if (journalSemester !== filters.semester) {
                return false;
            }
        }

        // 학과/전공 필터
        if (filters.major && journal.major !== filters.major) {
            return false;
        }

        // 학위과정 필터
        if (filters.degree && journal.degree !== filters.degree) {
            return false;
        }

        // 학번 검색
        if (filters.studentId) {
            if (!journal.studentId.includes(filters.studentId)) {
                return false;
            }
        }

        // 성명 검색
        if (filters.name) {
            if (!journal.studentName.toLowerCase().includes(filters.name.toLowerCase())) {
                return false;
            }
        }

        // 학술지명 검색
        if (filters.journalName) {
            if (!journal.journalName.toLowerCase().includes(filters.journalName.toLowerCase())) {
                return false;
            }
        }

        // 진행상태 필터
        if (filters.status && journal.status !== filters.status) {
            return false;
        }

        // 심사결과 필터
        if (filters.decision) {
            const journalDecision = journal.chairDecision?.decision || '';
            if (journalDecision !== filters.decision) {
                return false;
            }
        }

        return true;
    });
}

function searchAdminJournalReviews() {
    renderAdminJournalReviewList();
}

// ==================== 학술지 심사 상세 열기 (관리자용 - 읽기 전용) ====================
function openAdminJournalReviewDetail(journalId) {
    // 목록 화면 숨기기
    const mainContent = document.getElementById('admin-journal-main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }

    // 상세 화면 생성
    const detailScreen = document.createElement('div');
    detailScreen.id = 'admin-journal-review-detail-screen';
    detailScreen.className = 'review-detail-screen';
    detailScreen.dataset.journalId = journalId;

    // 동적 타이틀 생성 (관리자는 항상 읽기 전용이므로 타이틀만 표시)
    const modalTitle = '학술지 논문 심사 조회';

    detailScreen.innerHTML = `
        <div class="review-detail-content-wrapper">
            <!-- 헤더 -->
            <div class="review-detail-header">
                <h3 class="modal-title">${modalTitle}</h3>
                <button onclick="closeAdminJournalReviewDetailScreen()" class="modal-close-btn" aria-label="닫기">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- 상세 내용 (교수용 viewJournalReviewDetail이 'journal-review-content'를 찾음) -->
            <div id="journal-review-content" class="review-detail-body"></div>
        </div>
    `;

    document.body.appendChild(detailScreen);

    // 상세 정보 렌더링 (관리자 모드로 교수용 함수 호출)
    setTimeout(() => {
        if (typeof window.viewJournalReviewDetail !== 'function') {
            console.error('❌ viewJournalReviewDetail 함수를 찾을 수 없습니다.');
            alert('학술지 심사 상세 렌더링 함수를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }

        // 교수용 viewJournalReviewDetail 함수 호출 (chair view, admin mode)
        window.viewJournalReviewDetail(journalId, 'chair', true);

        // 읽기 전용 모드 적용
        setTimeout(() => {
            makeAllInputsReadonlyForJournal();

            // 다운로드 버튼이 다시 숨겨지는 것을 방지하기 위해 추가 확인 (텍스트 기반 검색)
            setTimeout(() => {
                const container = document.getElementById('journal-review-content');
                if (container) {
                    container.querySelectorAll('button').forEach(btn => {
                        const text = btn.textContent.trim();
                        if (text.includes('다운로드')) {
                            btn.style.display = 'inline-block';
                            btn.style.visibility = 'visible';
                            console.log('🔄 Re-showing download button:', text);
                        }
                    });
                }
            }, 50);
        }, 100);
    }, 50);
}

function closeAdminJournalReviewDetailScreen() {
    const detailScreen = document.getElementById('admin-journal-review-detail-screen');
    if (detailScreen) {
        detailScreen.remove();
    }

    // 목록 화면 다시 표시
    const mainContent = document.getElementById('admin-journal-main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }

    // 목록 재렌더링
    if (typeof renderAdminJournalReviewList === 'function') {
        renderAdminJournalReviewList();
    }
}

// ==================== 읽기 전용 모드 적용 ====================
function makeAllInputsReadonlyForJournal() {
    // journal-review-content 내부의 모든 입력 요소 비활성화
    const container = document.getElementById('journal-review-content');
    if (!container) {
        console.error('❌ journal-review-content not found');
        return;
    }

    // 모든 input, textarea, select 비활성화
    container.querySelectorAll('input, textarea, select').forEach(el => {
        el.disabled = true;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.readOnly = true;
        }
    });

    // 제출/저장 버튼 숨기기
    container.querySelectorAll('button[type="submit"], #save-draft-btn, #submit-evaluation-btn, button[onclick*="submitJournalChairDecision"]').forEach(btn => {
        btn.style.display = 'none';
    });

    // 결정 선택 버튼들의 onclick 이벤트 제거
    container.querySelectorAll('button[onclick*="selectJournalDecision"]').forEach(btn => {
        btn.onclick = null;
        btn.style.pointerEvents = 'none';
    });

    // 파일 업로드 버튼 숨기기 (다운로드 버튼은 유지)
    container.querySelectorAll('button[onclick*="upload"], input[type="file"]').forEach(el => {
        el.style.display = 'none';
    });

    // 모든 버튼을 순회하며 다운로드 버튼은 표시 (텍스트 기반 검색)
    container.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('다운로드')) {
            btn.style.display = 'inline-block';
            btn.style.visibility = 'visible';
            console.log('✅ Download button shown:', text);
        }
    });

    console.log('✅ Journal review read-only mode applied');
}

// ==================== 초기화 ====================
function initAdminJournalReview() {
    console.log('🎯 Initializing Admin Journal Review');

    // 컨테이너 확인
    const listContainer = document.getElementById('admin-journal-review-list');
    console.log('🎯 List container found:', !!listContainer);

    if (!listContainer) {
        console.error('❌ admin-journal-review-list container not found!');
        return;
    }

    // 초기 렌더링
    console.log('🎯 Calling renderAdminJournalReviewList...');
    renderAdminJournalReviewList();
    console.log('✅ Initial render completed');
}

// Export
window.initAdminJournalReview = initAdminJournalReview;
window.renderAdminJournalReviewList = renderAdminJournalReviewList;
window.searchAdminJournalReviews = searchAdminJournalReviews;
window.openAdminJournalReviewDetail = openAdminJournalReviewDetail;
window.closeAdminJournalReviewDetailScreen = closeAdminJournalReviewDetailScreen;
window.makeAllInputsReadonlyForJournal = makeAllInputsReadonlyForJournal;
