/* ==================== 교수용 대시보드 v3 (PPT 기획안 기반) ==================== */
/* 사용자 최종 요구사항 반영: 좌측 4개 + 우측 4개 = 8개 카드 */

// 현재 사용자 정보 (Mock) - 대시보드 전용
const DASHBOARD_USER = {
    id: 'PROF001',
    name: '김교수',
    department: '컴퓨터공학과',
    email: 'kim@hycu.ac.kr'
};

// 필터 상태 (내 지도학생 현황)
window.currentDegreeFilter = '전체';
window.currentDeptFilter = '전체';

// 필터 상태 (논문지도단계)
window.currentStageDegreeFilter = null;
window.currentStageDeptFilter = null;

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

/* ==================== [4] 논문지도단계 (지도학생 학과 기반) ==================== */

// 학위과정 값 매핑 (professor mock-data: 'master'/'doctor', admin mockThesisStages: 'master'/'phd')
function mapDegreeToThesisStageType(degree) {
    const map = { '석사': 'master', 'master': 'master', '박사': 'phd', 'doctor': 'phd', '통합과정': 'integrated' };
    return map[degree] || degree;
}

function mapDegreeToLabel(degree) {
    const map = { 'master': '석사', 'doctor': '박사', '석사': '석사', '박사': '박사', '통합과정': '통합과정' };
    return map[degree] || degree;
}

function renderStageFilters() {
    const degreeContainer = document.getElementById('stage-degree-filter');
    const deptContainer = document.getElementById('stage-dept-filter');
    if (!degreeContainer || !deptContainer) return;

    const students = (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.students) ? MOCK_DATA.students : [];

    // 지도학생에서 학위과정/학과 동적 추출 (전체 없음)
    const degrees = [...new Set(students.map(s => mapDegreeToLabel(s.degree)).filter(Boolean))];
    const departments = [...new Set(students.map(s => s.department).filter(Boolean))];

    // 기본값 설정 (첫 번째 항목)
    if (!window.currentStageDegreeFilter && degrees.length > 0) {
        window.currentStageDegreeFilter = degrees[0];
    }
    if (!window.currentStageDeptFilter && departments.length > 0) {
        window.currentStageDeptFilter = departments[0];
    }

    degreeContainer.innerHTML = degrees.map(degree =>
        `<button class="filter-chip ${degree === window.currentStageDegreeFilter ? 'active' : ''}" onclick="setStageDegreeFilter('${degree}')">${degree}</button>`
    ).join('');

    deptContainer.innerHTML = departments.map(dept =>
        `<button class="filter-chip ${dept === window.currentStageDeptFilter ? 'active' : ''}" onclick="setStageDeptFilter('${dept}')">${dept}</button>`
    ).join('');
}

function setStageDegreeFilter(degree) {
    window.currentStageDegreeFilter = degree;
    document.querySelectorAll('#stage-degree-filter .filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === degree);
    });
    renderDepartmentGuidanceStages();
}

function setStageDeptFilter(dept) {
    window.currentStageDeptFilter = dept;
    document.querySelectorAll('#stage-dept-filter .filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === dept);
    });
    renderDepartmentGuidanceStages();
}

function renderDepartmentGuidanceStages() {
    const container = document.getElementById('prof-dept-stages');
    if (!container) return;

    const selectedDept = window.currentStageDeptFilter;
    const selectedDegree = window.currentStageDegreeFilter;
    const degreeType = mapDegreeToThesisStageType(selectedDegree);

    // mockThesisStages에서 학과+학위과정 매칭
    let hierarchicalStages = [];
    if (typeof mockThesisStages !== 'undefined') {
        const matched = mockThesisStages.find(ts =>
            ts.departmentName === selectedDept && ts.degreeType === degreeType
        );
        if (matched && matched.hierarchicalStages && matched.hierarchicalStages.length > 0) {
            hierarchicalStages = matched.hierarchicalStages;
        }
    }

    // 매칭 없으면 안내 메시지
    if (hierarchicalStages.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 32px 16px; color: #9CA3AF; font-size: 13px;">등록된 논문지도단계가 없습니다.</div>';
        return;
    }

    // hierarchicalStages → profDeptStageProgress 형식으로 변환
    const stageProgress = hierarchicalStages.map(hs => {
        const subStages = (hs.subStages || []).map(sub => {
            const status = calcSubStageStatus(sub);
            const submitStart = (sub.submissionSchedule && sub.submissionSchedule.startDate) || sub.submitStartDate || '';
            const submitEnd = (sub.submissionSchedule && sub.submissionSchedule.endDate) || sub.submitEndDate || '';
            const reviewStart = (sub.reviewSchedule && sub.reviewSchedule.startDate) || sub.reviewStartDate || '';
            const reviewEnd = (sub.reviewSchedule && sub.reviewSchedule.endDate) || sub.reviewEndDate || '';
            return {
                name: sub.name,
                status: status,
                submissionPeriod: submitStart && submitEnd ? `${fmtDate(submitStart)} ~ ${fmtDate(submitEnd)}` : '',
                reviewPeriod: reviewStart && reviewEnd ? `${fmtDate(reviewStart)} ~ ${fmtDate(reviewEnd)}` : ''
            };
        });
        // 기본단계 상태 결정
        const allCompleted = subStages.length > 0 && subStages.every(s => s.status === 'completed');
        const anyCurrent = subStages.some(s => s.status === 'current');
        const basicStatus = allCompleted ? 'completed' : anyCurrent ? 'in-progress' : 'upcoming';
        // 기본단계 신청/철회 기간 (첫 번째 세부단계 기준)
        const firstSub = hs.subStages && hs.subStages[0];
        const appStart = firstSub && ((firstSub.submissionSchedule && firstSub.submissionSchedule.startDate) || firstSub.submitStartDate || '');
        const appEnd = firstSub && ((firstSub.submissionSchedule && firstSub.submissionSchedule.endDate) || firstSub.submitEndDate || '');
        return {
            basicStageName: hs.basicStageName,
            status: basicStatus,
            applicationPeriod: appStart && appEnd ? `${fmtDate(appStart)} ~ ${fmtDate(appEnd)}` : '',
            withdrawalPeriod: '',
            subStages: subStages
        };
    });

    // 아코디언 스타일 렌더링 (professor-dashboard.js renderVerticalJourney 동일)
    let html = '';
    const lastIdx = stageProgress.length - 1;

    stageProgress.forEach((stage, stageIdx) => {
        const isCompleted = stage.status === 'completed';
        const isCurrent = stage.status === 'in-progress';
        const isUpcoming = stage.status === 'upcoming';
        const isLast = stageIdx === lastIdx;
        const defaultCollapsed = isCompleted;

        const basicIcon = isCompleted
            ? '<div style="width: 28px; height: 28px; border-radius: 6px; background: #2E7D32; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>'
            : isCurrent
                ? '<div style="width: 28px; height: 28px; border-radius: 6px; background: #0288D1; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><div style="width: 10px; height: 10px; border-radius: 50%; background: white;"></div></div>'
                : '<div style="width: 28px; height: 28px; border-radius: 6px; background: #F5F5F5; border: 1px solid #E0E0E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><div style="width: 10px; height: 10px; border-radius: 50%; background: #BDBDBD;"></div></div>';

        const basicBadge = isCompleted
            ? '<span style="padding: 3px 12px; background: #E8F5E9; color: #2E7D32; border-radius: 4px; font-size: 12px; font-weight: 600;">완료</span>'
            : isCurrent
                ? '<span style="padding: 3px 12px; background: #E3F2FD; color: #0288D1; border-radius: 4px; font-size: 12px; font-weight: 600;">진행 중</span>'
                : '<span style="padding: 3px 12px; background: #F5F5F5; color: #9E9E9E; border-radius: 4px; font-size: 12px; font-weight: 600;">예정</span>';

        let basicPeriodHtml = '';
        if (!isCompleted && stage.applicationPeriod) {
            basicPeriodHtml = `<span class="journey-date-area"><span class="jd-label" style="color: #4B5563; font-weight: 500;">신청</span>${stage.applicationPeriod}</span>`;
        }

        const toggleRotate = defaultCollapsed ? '' : 'transform: rotate(180deg);';
        const toggleTitle = defaultCollapsed ? '펼치기' : '접기';
        const toggleIcon = `<span class="journey-toggle" data-stage="f${stageIdx}" style="cursor: pointer; margin-left: 6px; display: inline-flex; align-items: center; color: #9ca3af; transition: transform 0.2s; ${toggleRotate}" title="${toggleTitle}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>`;

        html += `
            <div style="margin-bottom: ${!isLast ? '4px' : '0'};">
                <div onclick="toggleFilteredJourneyStage(${stageIdx})" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: ${isCurrent ? '#F0F7FF' : '#F8F8F8'}; border-radius: 8px; ${isCurrent ? 'border: 2px solid #90CAF9;' : 'border: 1px solid #EEEEEE;'} cursor: pointer;">
                    ${basicIcon}
                    <span style="font-size: 15px; font-weight: 700; color: ${isUpcoming ? '#9E9E9E' : '#1a1a1a'};">${stage.basicStageName}</span>
                    ${basicBadge}
                    ${toggleIcon}
                    ${basicPeriodHtml}
                </div>
                <div id="filtered-journey-sub-${stageIdx}" style="margin-left: 30px; ${!isLast ? 'border-left: 2px solid ' + (isCompleted ? '#A5D6A7' : isCurrent ? '#90CAF9' : '#E0E0E0') + ';' : ''} padding-left: 28px; padding-top: 4px; padding-bottom: 4px; ${defaultCollapsed ? 'display: none;' : ''}">
        `;

        stage.subStages.forEach((sub, subIdx) => {
            const subCompleted = sub.status === 'completed';
            const subCurrent = sub.status === 'current';
            const subUpcoming = sub.status === 'upcoming';

            const subIcon = subCompleted
                ? '<div style="width: 16px; height: 16px; border-radius: 50%; background: #2E7D32; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>'
                : subCurrent
                    ? '<div style="width: 16px; height: 16px; border-radius: 50%; background: #0288D1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"><div style="width: 6px; height: 6px; border-radius: 50%; background: white;"></div></div>'
                    : '<div style="width: 16px; height: 16px; border-radius: 50%; background: white; border: 2px solid #E0E0E0; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"></div>';

            const subBadge = subCompleted
                ? '<span style="padding: 2px 10px; background: #E8F5E9; color: #2E7D32; border-radius: 4px; font-size: 11px; font-weight: 600;">완료</span>'
                : subCurrent
                    ? '<span style="padding: 2px 10px; background: #E3F2FD; color: #0288D1; border-radius: 4px; font-size: 11px; font-weight: 600;">진행 중</span>'
                    : '<span style="padding: 2px 10px; background: #F5F5F5; color: #9E9E9E; border-radius: 4px; font-size: 11px; font-weight: 600;">예정</span>';

            let subPeriodHtml = '';
            if (!subCompleted) {
                const subPeriods = [];
                if (sub.submissionPeriod) subPeriods.push(`<span class="jd-label" style="color: #6A0028; font-weight: 500;">제출</span>${sub.submissionPeriod}`);
                if (sub.reviewPeriod) subPeriods.push(`<span class="jd-label" style="color: #1565C0; font-weight: 500;">심사</span>${sub.reviewPeriod}`);
                if (subPeriods.length > 0) {
                    subPeriodHtml = `<span class="journey-date-area">${subPeriods.join('<span class="jd-sep">|</span>')}</span>`;
                }
            }

            html += `
                    <div style="padding: 8px 0; ${subIdx < stage.subStages.length - 1 ? 'border-bottom: 1px solid #F3F4F6;' : ''}">
                        <div style="display: flex; align-items: center;">
                            ${subIcon}
                            <span style="font-size: 14px; color: ${subUpcoming ? '#9E9E9E' : '#374151'}; ${subCurrent ? 'font-weight: 600;' : ''}">${sub.name}</span>
                            <span style="margin-left: 8px;">${subBadge}</span>
                            ${subPeriodHtml}
                        </div>
                    </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 필터된 여정 토글 (renderDepartmentGuidanceStages 전용)
function toggleFilteredJourneyStage(stageIdx) {
    const subDiv = document.getElementById(`filtered-journey-sub-${stageIdx}`);
    const toggle = document.querySelector(`.journey-toggle[data-stage="f${stageIdx}"]`);
    if (!subDiv) return;
    const isHidden = subDiv.style.display === 'none';
    subDiv.style.display = isHidden ? '' : 'none';
    if (toggle) {
        toggle.style.transform = isHidden ? 'rotate(180deg)' : '';
        toggle.title = isHidden ? '접기' : '펼치기';
    }
}

// 세부단계 상태 계산 (날짜 기반)
function calcSubStageStatus(subStage) {
    const now = new Date();
    const submitStart = (subStage.submissionSchedule && subStage.submissionSchedule.startDate) || subStage.submitStartDate || '';
    const submitEnd = (subStage.submissionSchedule && subStage.submissionSchedule.endDate) || subStage.submitEndDate || '';
    const reviewEnd = (subStage.reviewSchedule && subStage.reviewSchedule.endDate) || subStage.reviewEndDate || '';
    if (!reviewEnd && !submitEnd) return 'upcoming';
    const endDate = new Date(reviewEnd || submitEnd);
    if (now > endDate) return 'completed';
    if (submitStart && now >= new Date(submitStart) && now <= endDate) return 'current';
    return 'upcoming';
}

// 날짜 포맷 (ISO → YYYY-MM-DD)
function fmtDate(d) {
    return d ? d.substring(0, 10) : '';
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
    renderStageFilters();                  // [4] 논문지도단계 필터
    renderDepartmentGuidanceStages();       // [4] 논문지도단계

    // 우측 4개
    renderProfessorAlertCard();             // [5] 알림
    renderThesisReviewLinks();              // [6] 논문 심사
    renderMyFeedbackPending();              // [7] 내 피드백
    renderMyGuidanceReservations();         // [8] 내 지도예약현황

    console.log('Professor Dashboard v3 initialized successfully');
}

// DOMContentLoaded 이벤트
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('prof-dashboard-v3') || document.getElementById('dashboard-screen')) {
        initProfessorDashboardV3();
    }
});
