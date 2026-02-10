/* ==================== 교수용 대시보드 v3 (PPT 기획안 기반) ==================== */
/* 사용자 최종 요구사항 반영: 좌측 4개 + 우측 4개 = 8개 카드 */

// 현재 사용자 정보 (Mock) - 대시보드 전용
const DASHBOARD_USER = {
    id: 'PROF001',
    name: '김교수',
    department: '컴퓨터공학과',
    email: 'kim@hycu.ac.kr'
};

// 필터 상태
window.currentDegreeFilter = '전체';
window.currentDeptFilter = '전체';

/* ==================== [1] 행정 공지사항 ==================== */
function renderProfessorAdminNoticeCard() {
    const container = document.getElementById('admin-notice-list');
    if (!container) return;

    // Mock 데이터 (최근 3건)
    const notices = [
        { title: '2024학년도 2학기 논문 제출 일정 안내', date: '2024-12-15' },
        { title: '논문 작성 워크샵 개최 안내', date: '2024-12-10' },
        { title: '학위 논문 제출 요건 변경 안내', date: '2024-12-05' }
    ];

    if (notices.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 13px;">등록된 공지사항이 없습니다.</div>';
        return;
    }

    container.innerHTML = notices.map(notice => `
        <div style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; cursor: pointer;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='transparent'">
            <div style="font-size: 13px; color: #1F2937; margin-bottom: 4px;">${notice.title}</div>
            <div style="font-size: 11px; color: #9CA3AF;">${notice.date}</div>
        </div>
    `).join('');
}

/* ==================== [2] 논문지도공지 및 자료 ==================== */
function renderProfessorBoardNoticeCard() {
    const container = document.getElementById('board-notice-list');
    if (!container) return;

    // Mock 데이터 (최근 3건)
    const boards = [
        { title: '논문 지도 일정 변경 안내', date: '2024-12-14' },
        { title: '논문 작성 가이드라인 업데이트', date: '2024-12-12' },
        { title: '중간발표 자료 양식 배포', date: '2024-12-08' }
    ];

    if (boards.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 13px;">등록된 자료가 없습니다.</div>';
        return;
    }

    container.innerHTML = boards.map(board => `
        <div style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; cursor: pointer;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='transparent'">
            <div style="font-size: 13px; color: #1F2937; margin-bottom: 4px;">${board.title}</div>
            <div style="font-size: 11px; color: #9CA3AF;">${board.date}</div>
        </div>
    `).join('');
}

/* ==================== [3] 내 지도학생 현황 ==================== */
function renderStudentFilters() {
    // 학위과정 필터
    const degreeContainer = document.getElementById('degree-filter');
    if (!degreeContainer) return;

    const degrees = ['전체', '석사', '박사', '통합과정'];
    degreeContainer.innerHTML = degrees.map(degree =>
        `<button class="filter-chip ${degree === '전체' ? 'active' : ''}" onclick="setDegreeFilter('${degree}')">${degree}</button>`
    ).join('');

    // 학과 필터 (동적 생성)
    const deptContainer = document.getElementById('dept-filter');
    if (!deptContainer) return;

    let students = typeof MOCK_DATA !== 'undefined' && MOCK_DATA.students ? MOCK_DATA.students : [];
    const departments = ['전체', ...new Set(students.map(s => s.department).filter(Boolean))];

    deptContainer.innerHTML = departments.map(dept =>
        `<button class="filter-chip ${dept === '전체' ? 'active' : ''}" onclick="setDeptFilter('${dept}')">${dept}</button>`
    ).join('');
}

function renderStudentSummaryCards() {
    const container = document.getElementById('student-summary-cards');
    if (!container) return;

    // 전체 학생 목록
    let students = typeof MOCK_DATA !== 'undefined' && MOCK_DATA.students ? MOCK_DATA.students : [];

    // 필터 적용
    const selectedDegree = window.currentDegreeFilter || '전체';
    const selectedDept = window.currentDeptFilter || '전체';

    let filteredStudents = students.filter(student => {
        const degreeMatch = selectedDegree === '전체' || student.degree === selectedDegree ||
                           (selectedDegree === '석사' && student.degree === 'master') ||
                           (selectedDegree === '박사' && student.degree === 'doctor');
        const deptMatch = selectedDept === '전체' || student.department === selectedDept;
        return degreeMatch && deptMatch;
    });

    // 4개 기본단계별 학생 수 집계
    const stages = [
        { name: '논문작성계획서', count: 0, color: '#3B82F6' },
        { name: '프로포절', count: 0, color: '#8B5CF6' },
        { name: '예비논문', count: 0, color: '#EC4899' },
        { name: '본논문', count: 0, color: '#6A0028' }
    ];

    filteredStudents.forEach(student => {
        const currentStage = student.basicStageName || student.stage || '';
        const stageIndex = stages.findIndex(s => currentStage.includes(s.name));
        if (stageIndex >= 0) {
            stages[stageIndex].count++;
        }
    });

    // 4개 카드 렌더링 (단계명 + 학생 수만, 백분율/프로그레스 바 제거)
    container.innerHTML = stages.map((stage, index) => {
        const arrow = index < stages.length - 1 ? `<span class="stage-arrow">→</span>` : '';

        return `
            <div class="student-stage-card" style="border-color: ${stage.color};">
                <div style="font-size: 13px; font-weight: 600; color: ${stage.color}; margin-bottom: 8px;">${stage.name}</div>
                <div style="font-size: 28px; font-weight: 700; color: #1F2937; margin: 8px 0;">${stage.count}명</div>
                ${arrow}
            </div>
        `;
    }).join('');
}

function setDegreeFilter(degree) {
    window.currentDegreeFilter = degree;
    document.querySelectorAll('#degree-filter .filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === degree);
    });
    renderStudentSummaryCards();
}

function setDeptFilter(dept) {
    window.currentDeptFilter = dept;
    document.querySelectorAll('#dept-filter .filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === dept);
    });
    renderStudentSummaryCards();
}

/* ==================== [4] 우리 학과 논문지도단계 ==================== */
function renderDepartmentGuidanceStages() {
    const container = document.getElementById('dept-guidance-stages-list');
    if (!container) return;

    // Mock 데이터 (hierarchicalStages가 없으면 임시 데이터 사용)
    let stages = [];
    if (typeof hierarchicalStages !== 'undefined') {
        stages = hierarchicalStages.filter(stage => stage.department === DASHBOARD_USER.department);
    } else {
        // 임시 Mock 데이터
        stages = [
            {
                basicStageName: '논문작성계획서',
                subStages: [
                    { name: '계획서 초안 작성', submitStartDate: '2024-11-01', submitEndDate: '2024-11-15', reviewStartDate: '2024-11-16', reviewEndDate: '2024-11-30' },
                    { name: '지도교수 승인', submitStartDate: '2024-12-01', submitEndDate: '2024-12-15', reviewStartDate: '2024-12-16', reviewEndDate: '2024-12-31' }
                ]
            },
            {
                basicStageName: '프로포절',
                subStages: [
                    { name: '프로포절 제출', submitStartDate: '2025-01-01', submitEndDate: '2025-01-15', reviewStartDate: '2025-01-16', reviewEndDate: '2025-01-31' },
                    { name: '프로포절 발표', submitStartDate: '2025-02-01', submitEndDate: '2025-02-15', reviewStartDate: '2025-02-16', reviewEndDate: '2025-02-28' }
                ]
            }
        ];
    }

    if (stages.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 13px;">등록된 논문지도단계가 없습니다.</div>';
        return;
    }

    // 세로형 여정 렌더링 (학생용과 동일)
    let html = '<div class="vertical-journey" style="position: relative; padding-left: 24px;">';

    // 수직선
    html += '<div style="position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: #E5E7EB;"></div>';

    stages.forEach((basicStage, idx) => {
        html += `<div class="journey-stage ${idx === 0 ? 'active' : ''}" style="position: relative; margin-bottom: 24px;">`;
        html += `<div class="stage-header" style="font-size: 14px; font-weight: ${idx === 0 ? '700' : '600'}; color: ${idx === 0 ? '#6A0028' : '#1F2937'}; margin-bottom: 8px;">${basicStage.basicStageName}</div>`;
        html += '<div class="substages" style="padding-left: 16px;">';

        basicStage.subStages.forEach(subStage => {
            const status = getStageStatus(subStage);
            const badge = getBadgeHtml(status);
            const dateHtml = status === '완료' ? '' : getDateRangeHtml(subStage);

            html += `
                <div class="substage" style="display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 13px;">
                    <span style="color: #6B7280;">${subStage.name}</span>
                    ${dateHtml}
                    ${badge}
                </div>
            `;
        });

        html += '</div></div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

function getStageStatus(subStage) {
    const now = new Date();
    const submitEnd = new Date(subStage.submitEndDate || subStage.reviewEndDate);
    const reviewEnd = new Date(subStage.reviewEndDate);

    if (now > reviewEnd) return '완료';
    if (now >= new Date(subStage.submitStartDate) && now <= reviewEnd) return '진행 중';
    return '예정';
}

function getBadgeHtml(status) {
    const badges = {
        '완료': '<span class="badge badge-completed" style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #D1FAE5; color: #065F46;">완료</span>',
        '진행 중': '<span class="badge badge-ongoing" style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #DBEAFE; color: #1E40AF;">진행 중</span>',
        '예정': '<span class="badge badge-upcoming" style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #F3F4F6; color: #6B7280;">예정</span>'
    };
    return badges[status] || '';
}

function getDateRangeHtml(subStage) {
    if (!subStage.submitStartDate || !subStage.submitEndDate) return '';

    return `<span style="font-size: 11px; color: #9CA3AF;">${subStage.submitStartDate} ~ ${subStage.submitEndDate}</span>`;
}

/* ==================== [5] 알림 ==================== */
function renderProfessorAlertCard() {
    const container = document.getElementById('alert-list');
    if (!container) return;

    let notifications = typeof MOCK_DATA !== 'undefined' && MOCK_DATA.notifications ? MOCK_DATA.notifications.slice(0, 3) : [];

    if (notifications.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 13px;">새로운 알림이 없습니다.</div>';
        return;
    }

    container.innerHTML = notifications.map(notif => `
        <div style="padding: 8px 0; border-bottom: 1px solid #F3F4F6;">
            <div style="display: flex; align-items: start; gap: 8px;">
                <span style="font-size: 16px;">${notif.icon || '🔔'}</span>
                <div style="flex: 1;">
                    <div style="font-size: 12px; color: #1F2937; margin-bottom: 2px;">${notif.message}</div>
                    <div style="font-size: 11px; color: #9CA3AF;">${notif.timestamp}</div>
                </div>
            </div>
        </div>
    `).join('');
}

/* ==================== [6] 논문 심사 ==================== */
function renderThesisReviewLinks() {
    const container = document.getElementById('thesis-review-links');
    if (!container) return;

    const reviews = [
        { name: '논문작성계획서 평가', tab: 'proposal' },
        { name: '프로포절 평가', tab: 'research' },
        { name: '예비심사 평가', tab: 'prelim' },
        { name: '본심사 평가', tab: 'final' }
    ];

    container.innerHTML = reviews.map(review => `
        <button class="review-link-btn" onclick="alert('${review.name} 화면으로 이동')">
            ${review.name}
        </button>
    `).join('');
}

/* ==================== [7] 내 피드백 ==================== */
function renderMyFeedbackPending() {
    const container = document.getElementById('feedback-list');
    if (!container) return;

    // Mock 데이터 (피드백 대기 중, 최대 3건)
    const feedbacks = [
        { student: '김철수', task: '연구계획서', date: '2024-12-10' },
        { student: '이영희', task: '중간논문', date: '2024-12-08' },
        { student: '박민수', task: '최종논문', date: '2024-12-05' }
    ];

    if (feedbacks.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 13px;">피드백 대기 항목이 없습니다.</div>';
        return;
    }

    container.innerHTML = feedbacks.map(fb => `
        <div style="padding: 8px 0; border-bottom: 1px solid #F3F4F6; cursor: pointer;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='transparent'">
            <div style="font-size: 13px; color: #1F2937; margin-bottom: 4px;">${fb.student} - ${fb.task}</div>
            <div style="font-size: 11px; color: #9CA3AF;">제출일: ${fb.date}</div>
        </div>
    `).join('');
}

/* ==================== [8] 내 지도예약현황 ==================== */
function renderMyGuidanceReservations() {
    const container = document.getElementById('reservation-list');
    if (!container) return;

    // Mock 데이터 (학생명 표시)
    const reservations = [
        { student: '김철수', date: '2024-12-20 10:00', status: '확정' },
        { student: '이영희', date: '2024-12-22 14:00', status: '대기' },
        { student: '박민수', date: '2024-12-25 09:00', status: '확정' }
    ];

    if (reservations.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 13px;">예약된 일정이 없습니다.</div>';
        return;
    }

    container.innerHTML = reservations.map(res => `
        <div style="padding: 8px 0; border-bottom: 1px solid #F3F4F6;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 13px; color: #1F2937; margin-bottom: 2px;">${res.student}</div>
                    <div style="font-size: 11px; color: #9CA3AF;">${res.date}</div>
                </div>
                <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; background: ${res.status === '확정' ? '#D1FAE5' : '#FEF3C7'}; color: ${res.status === '확정' ? '#065F46' : '#92400E'};">${res.status}</span>
            </div>
        </div>
    `).join('');
}

/* ==================== 초기화 함수 ==================== */
function initProfessorDashboardV3() {
    console.log('Professor Dashboard v3 (사용자 피드백 반영) initializing...');

    // 좌측 4개
    renderProfessorAdminNoticeCard();       // [1] 행정 공지사항
    renderProfessorBoardNoticeCard();       // [2] 논문지도공지 및 자료
    renderStudentFilters();                 // [3] 학생 현황 필터
    renderStudentSummaryCards();            // [3] 학생 현황 카드
    renderDepartmentGuidanceStages();       // [4] 우리 학과 논문지도단계

    // 우측 4개
    renderProfessorAlertCard();             // [5] 알림
    renderThesisReviewLinks();              // [6] 논문 심사
    renderMyFeedbackPending();              // [7] 내 피드백
    renderMyGuidanceReservations();         // [8] 내 지도예약현황

    console.log('Professor Dashboard v3 initialized successfully');
}

// DOMContentLoaded 이벤트
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('prof-dashboard-v3')) {
        initProfessorDashboardV3();
    }
});
