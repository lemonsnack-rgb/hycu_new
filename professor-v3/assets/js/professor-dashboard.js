/**
 * 교수용 대시보드 JavaScript (학생용 코드 기반)
 * 학생용 dashboard.js의 renderVerticalJourney(), renderReservationStatus() 함수 복사
 */

// ========================================
// Mock 데이터
// ========================================

// 세로형 여정 데이터 (학생용 구조 동일)
const profDeptStageProgress = [
    {
        stageId: 'HS001',
        basicStageName: '논문작성계획서',
        applicationPeriod: '2025-03-01 ~ 2025-03-15',
        withdrawalPeriod: '2025-03-01 ~ 2025-03-10',
        status: 'completed',
        subStages: [
            { id: 'SS001', name: '계획서 작성', status: 'completed', submissionPeriod: '2025-02-20 ~ 2025-02-28', reviewPeriod: '2025-03-01 ~ 2025-03-05' },
            { id: 'SS002', name: '계획서 제출', status: 'completed', submissionPeriod: '2025-03-01 ~ 2025-03-15', reviewPeriod: '2025-03-16 ~ 2025-03-20' }
        ]
    },
    {
        stageId: 'HS002',
        basicStageName: '프로포절',
        applicationPeriod: '2025-04-01 ~ 2025-04-15',
        withdrawalPeriod: '2025-04-01 ~ 2025-04-10',
        status: 'in-progress',
        subStages: [
            { id: 'SS003', name: '초안 작성', status: 'current', submissionPeriod: '2025-04-01 ~ 2025-04-15', reviewPeriod: '2025-04-16 ~ 2025-04-25' },
            { id: 'SS004', name: '최종 제출', status: 'upcoming', submissionPeriod: '2025-04-26 ~ 2025-05-05', reviewPeriod: '2025-05-06 ~ 2025-05-15' }
        ]
    },
    {
        stageId: 'HS003',
        basicStageName: '예비심사',
        applicationPeriod: '2025-06-01 ~ 2025-06-15',
        withdrawalPeriod: '2025-06-01 ~ 2025-06-10',
        status: 'upcoming',
        subStages: [
            { id: 'SS005', name: '예비심사 준비', status: 'upcoming', submissionPeriod: '2025-06-01 ~ 2025-06-15', reviewPeriod: '2025-06-16 ~ 2025-06-20' },
            { id: 'SS006', name: '예비심사 진행', status: 'upcoming', submissionPeriod: '2025-06-21 ~ 2025-06-25', reviewPeriod: '2025-06-26 ~ 2025-07-10' }
        ]
    },
    {
        stageId: 'HS004',
        basicStageName: '본심사',
        applicationPeriod: '2025-09-01 ~ 2025-09-15',
        withdrawalPeriod: '2025-09-01 ~ 2025-09-10',
        status: 'upcoming',
        subStages: [
            { id: 'SS007', name: '최종 논문 제출', status: 'upcoming', submissionPeriod: '2025-09-01 ~ 2025-09-15', reviewPeriod: '2025-09-16 ~ 2025-09-20' },
            { id: 'SS008', name: '본심사 진행', status: 'upcoming', submissionPeriod: '2025-09-21 ~ 2025-09-25', reviewPeriod: '2025-09-26 ~ 2025-10-10' }
        ]
    }
];

// 예약 데이터
const profReservations = [
    { studentName: '김철수', meetingType: 'online', status: 'confirmed', selectedDate: '2024-11-28', selectedTime: '10:00', duration: 60, topic: '논문 구조 검토 및 서론 피드백' },
    { studentName: '박영희', meetingType: 'offline', status: 'approved', selectedDate: '2024-11-29', selectedTime: '14:00', duration: 90, topic: '연구방법론 논의' },
    { studentName: '이민수', meetingType: 'online', status: 'pending', selectedDate: '2024-12-02', selectedTime: '15:30', duration: 60, topic: '데이터 분석 결과 검토' }
];

// ========================================
// 1. 행정 공지사항
// ========================================
function renderProfAdminNotice() {
    const container = document.getElementById('prof-admin-notice-list');
    if (!container) return;

    const notices = [
        { title: '2024학년도 2학기 논문심사 일정 안내', createdAt: '2024-08-15' },
        { title: '논문지도비 지급 신청 안내', createdAt: '2024-08-10' },
        { title: '학위논문 심사위원 배정 안내', createdAt: '2024-08-05' }
    ];

    container.innerHTML = notices.map((n, i) => `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; ${i < notices.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''} cursor: pointer;"
             onmouseover="this.style.background='#f9fafb';" onmouseout="this.style.background='transparent';">
            <span style="font-size: 13px; color: #1a1a1a; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px;">${n.title}</span>
            <span style="font-size: 12px; color: #9ca3af; flex-shrink: 0;">${n.createdAt}</span>
        </div>
    `).join('');
}

// ========================================
// 2. 논문지도공지 및 자료
// ========================================
function renderProfBoardNotice() {
    const container = document.getElementById('prof-board-notice-list');
    if (!container) return;

    const boards = [
        { title: '[필독] 2024학년도 학위논문 작성 가이드', createdAt: '2024-08-20' },
        { title: '논문작성계획서 양식 업데이트', createdAt: '2024-08-18' },
        { title: '연구윤리 교육 자료', createdAt: '2024-08-15' }
    ];

    container.innerHTML = boards.map((b, i) => `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; ${i < boards.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''} cursor: pointer;"
             onmouseover="this.style.background='#f9fafb';" onmouseout="this.style.background='transparent';">
            <span style="font-size: 13px; color: #1a1a1a; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px;">${b.title}</span>
            <span style="font-size: 12px; color: #9ca3af; flex-shrink: 0;">${b.createdAt}</span>
        </div>
    `).join('');
}

// ========================================
// 3. 내 지도학생 현황
// ========================================
function renderProfStudentSummary() {
    // 필터 렌더링
    const degreeFilter = document.getElementById('degree-filter');
    const deptFilter = document.getElementById('dept-filter');

    if (degreeFilter) {
        degreeFilter.innerHTML = `
            <button class="filter-chip active">전체</button>
            <button class="filter-chip">석사</button>
            <button class="filter-chip">박사</button>
        `;
    }

    if (deptFilter) {
        deptFilter.innerHTML = `
            <button class="filter-chip active">전체</button>
            <button class="filter-chip">컴퓨터공학과</button>
            <button class="filter-chip">경영학과</button>
        `;
    }

    // 학생 현황 카드 렌더링 (학생용 칩 스타일 사용)
    const container = document.getElementById('student-summary-cards');
    if (!container) return;

    const stages = [
        { name: '논문작성계획서', count: 5, color: '#F9FAFB', textColor: '#1F2937', borderColor: '#E5E7EB' },
        { name: '프로포절', count: 3, color: '#F9FAFB', textColor: '#1F2937', borderColor: '#E5E7EB' },
        { name: '예비심사', count: 2, color: '#F9FAFB', textColor: '#1F2937', borderColor: '#E5E7EB' },
        { name: '본심사', count: 1, color: '#F9FAFB', textColor: '#1F2937', borderColor: '#E5E7EB' }
    ];

    container.innerHTML = stages.map((stage, idx) => `
        <div style="position: relative; display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; text-align: center; padding: 12px 10px;
                        background: ${stage.color};
                        border: 1px solid ${stage.borderColor};
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
                 onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'">
                <div style="font-size: 11px; color: ${stage.textColor}; font-weight: 600; margin-bottom: 6px; opacity: 0.7;">
                    ${stage.name}
                </div>
                <div style="font-size: 20px; font-weight: 700; color: ${stage.textColor};">
                    ${stage.count}<span style="font-size: 13px; font-weight: 600;">명</span>
                </div>
            </div>
            ${idx < stages.length - 1 ? `
                <div style="display: flex; align-items: center; gap: 2px; flex-shrink: 0;">
                    <div style="width: 6px; height: 6px; background: linear-gradient(135deg, #6A0028, #D1D5DB); border-radius: 50%; opacity: 0.4;"></div>
                    <div style="width: 6px; height: 6px; background: linear-gradient(135deg, #6A0028, #D1D5DB); border-radius: 50%; opacity: 0.6;"></div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                        <path d="M5 12h14" stroke="#6A0028" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
                        <path d="M13 6l6 6-6 6" stroke="#6A0028" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
                    </svg>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ========================================
// 4. 우리 학과 논문지도단계 (학생용 renderVerticalJourney 복사)
// ========================================
function renderVerticalJourney() {
    const container = document.getElementById('prof-dept-stages');  // id만 변경
    if (!container) return;

    let html = '';
    const lastIdx = profDeptStageProgress.length - 1;  // 데이터만 변경

    profDeptStageProgress.forEach((stage, stageIdx) => {  // 데이터만 변경
        const isCompleted = stage.status === 'completed';
        const isCurrent = stage.status === 'in-progress';
        const isUpcoming = stage.status === 'upcoming';
        const isLast = stageIdx === lastIdx;
        const defaultCollapsed = isCompleted;

        // 기본단계 아이콘 (28px 사각형)
        const basicIcon = isCompleted
            ? '<div style="width: 28px; height: 28px; border-radius: 6px; background: #2E7D32; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>'
            : isCurrent
                ? '<div style="width: 28px; height: 28px; border-radius: 6px; background: #0288D1; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><div style="width: 10px; height: 10px; border-radius: 50%; background: white;"></div></div>'
                : '<div style="width: 28px; height: 28px; border-radius: 6px; background: #F5F5F5; border: 1px solid #E0E0E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><div style="width: 10px; height: 10px; border-radius: 50%; background: #BDBDBD;"></div></div>';

        // 기본단계 상태 배지
        const basicBadge = isCompleted
            ? '<span style="padding: 3px 12px; background: #E8F5E9; color: #2E7D32; border-radius: 4px; font-size: 12px; font-weight: 600;">완료</span>'
            : isCurrent
                ? '<span style="padding: 3px 12px; background: #E3F2FD; color: #0288D1; border-radius: 4px; font-size: 12px; font-weight: 600;">진행 중</span>'
                : '<span style="padding: 3px 12px; background: #F5F5F5; color: #9E9E9E; border-radius: 4px; font-size: 12px; font-weight: 600;">예정</span>';

        // 기본단계 날짜 (완료면 숨김, 우측 고정 위치)
        let basicPeriodHtml = '';
        if (!isCompleted) {
            const periods = [];
            if (stage.applicationPeriod) periods.push(`<span class="jd-label" style="color: #4B5563; font-weight: 500;">신청</span>${stage.applicationPeriod}`);
            if (stage.withdrawalPeriod) periods.push(`<span class="jd-label" style="color: #4B5563; font-weight: 500;">철회</span>${stage.withdrawalPeriod}`);
            if (periods.length > 0) {
                basicPeriodHtml = `<span class="journey-date-area">${periods.join('<span class="jd-sep">|</span>')}</span>`;
            }
        }

        // 토글 아이콘 (모든 기본단계)
        const toggleRotate = defaultCollapsed ? '' : 'transform: rotate(180deg);';
        const toggleTitle = defaultCollapsed ? '펼치기' : '접기';
        const toggleIcon = `<span class="journey-toggle" data-stage="${stageIdx}" style="cursor: pointer; margin-left: 6px; display: inline-flex; align-items: center; color: #9ca3af; transition: transform 0.2s; ${toggleRotate}" title="${toggleTitle}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>`;

        html += `
            <div style="margin-bottom: ${!isLast ? '4px' : '0'};">
                <!-- 기본단계 헤더 -->
                <div onclick="toggleJourneyStage(${stageIdx})" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: ${isCurrent ? '#F0F7FF' : '#F8F8F8'}; border-radius: 8px; ${isCurrent ? 'border: 2px solid #90CAF9;' : 'border: 1px solid #EEEEEE;'} cursor: pointer;">
                    ${basicIcon}
                    <span style="font-size: 15px; font-weight: 700; color: ${isUpcoming ? '#9E9E9E' : '#1a1a1a'};">${stage.basicStageName}</span>
                    ${basicBadge}
                    ${toggleIcon}
                    ${basicPeriodHtml}
                </div>

                <!-- 세부단계 목록 -->
                <div id="prof-journey-sub-${stageIdx}" style="margin-left: 30px; ${!isLast ? 'border-left: 2px solid ' + (isCompleted ? '#A5D6A7' : isCurrent ? '#90CAF9' : '#E0E0E0') + ';' : ''} padding-left: 28px; padding-top: 4px; padding-bottom: 4px; ${defaultCollapsed ? 'display: none;' : ''}">
        `;

        stage.subStages.forEach((sub, subIdx) => {
            const subCompleted = sub.status === 'completed';
            const subCurrent = sub.status === 'current';
            const subUpcoming = sub.status === 'upcoming';

            // 세부단계 아이콘 (16px 원)
            const subIcon = subCompleted
                ? '<div style="width: 16px; height: 16px; border-radius: 50%; background: #2E7D32; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>'
                : subCurrent
                    ? '<div style="width: 16px; height: 16px; border-radius: 50%; background: #0288D1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"><div style="width: 6px; height: 6px; border-radius: 50%; background: white;"></div></div>'
                    : '<div style="width: 16px; height: 16px; border-radius: 50%; background: white; border: 2px solid #E0E0E0; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"></div>';

            // 세부단계 배지
            const subBadge = subCompleted
                ? '<span style="padding: 2px 10px; background: #E8F5E9; color: #2E7D32; border-radius: 4px; font-size: 11px; font-weight: 600;">완료</span>'
                : subCurrent
                    ? '<span style="padding: 2px 10px; background: #E3F2FD; color: #0288D1; border-radius: 4px; font-size: 11px; font-weight: 600;">진행 중</span>'
                    : '<span style="padding: 2px 10px; background: #F5F5F5; color: #9E9E9E; border-radius: 4px; font-size: 11px; font-weight: 600;">예정</span>';

            // 세부단계 날짜 (완료면 숨김, 우측 고정 위치)
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

/**
 * 기본단계 접기/펼치기 토글 (학생용과 동일)
 */
function toggleJourneyStage(stageIdx) {
    const subDiv = document.getElementById(`prof-journey-sub-${stageIdx}`);  // id prefix만 변경
    const toggle = document.querySelector(`.journey-toggle[data-stage="${stageIdx}"]`);
    if (!subDiv) return;

    const isHidden = subDiv.style.display === 'none';
    subDiv.style.display = isHidden ? '' : 'none';
    if (toggle) {
        toggle.style.transform = isHidden ? 'rotate(180deg)' : '';
        toggle.title = isHidden ? '접기' : '펼치기';
    }
}

// ========================================
// 5. 알림
// ========================================
function renderProfAlert() {
    const container = document.getElementById('prof-alert-list');
    if (!container) return;

    const alerts = [
        { text: '김철수 학생이 프로포절을 제출했습니다.', time: '10분 전' },
        { text: '박영희 학생의 예비심사가 배정되었습니다.', time: '1시간 전' },
        { text: '이민수 학생이 지도예약을 신청했습니다.', time: '2시간 전' }
    ];

    container.innerHTML = alerts.map(alert => `
        <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
            <div style="font-size: 13px; color: #1f2937; margin-bottom: 4px;">
                ${alert.text}
            </div>
            <div style="font-size: 12px; color: #9ca3af;">
                ${alert.time}
            </div>
        </div>
    `).join('');
}

// ========================================
// 6. 내 평가 (4개 버튼)
// ========================================
function renderProfReviewButtons() {
    const container = document.getElementById('prof-review-buttons');
    if (!container) return;

    const buttons = [
        { label: '논문작성계획서 평가', screen: 'review-proposal' },
        { label: '프로포절 평가', screen: 'review-research' },
        { label: '예비심사 평가', screen: 'review-prelim' },
        { label: '본심사 평가', screen: 'review-final' }
    ];

    container.innerHTML = buttons.map(btn => `
        <button onclick="showScreen('${btn.screen}')"
                style="display: block; width: 100%; padding: 12px; margin-bottom: 8px;
                       background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px;
                       text-align: left; cursor: pointer; transition: all 0.2s;
                       font-size: 13px; color: #1F2937;"
                onmouseover="this.style.background='#F9FAFB'; this.style.borderColor='#6A0028'; this.style.color='#6A0028';"
                onmouseout="this.style.background='#FFFFFF'; this.style.borderColor='#E5E7EB'; this.style.color='#1F2937';">
            ${btn.label}
        </button>
    `).join('');
}

// ========================================
// 7. 내 피드백 (피드백 대기 3건)
// ========================================
function renderProfPendingFeedback() {
    const container = document.getElementById('prof-pending-feedback-list');
    if (!container) return;

    const feedbacks = [
        { student: '김철수', stage: '프로포절', date: '2024-08-20' },
        { student: '박영희', stage: '논문작성계획서', date: '2024-08-19' },
        { student: '이민수', stage: '예비심사', date: '2024-08-18' }
    ];

    container.innerHTML = feedbacks.map(fb => `
        <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; cursor: pointer;"
             onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='transparent'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 13px; color: #1f2937; font-weight: 500;">
                    ${fb.student}
                </span>
                <span style="padding: 2px 8px; background: #FEF3C7; color: #D97706;
                             border-radius: 4px; font-size: 11px; font-weight: 600;">
                    피드백 대기
                </span>
            </div>
            <div style="font-size: 12px; color: #6b7280;">
                ${fb.stage} · ${fb.date}
            </div>
        </div>
    `).join('');
}

// ========================================
// 8. 내 지도예약현황 (학생용 renderReservationStatus 복사)
// ========================================
function renderReservationStatus() {
    const container = document.getElementById('prof-reservation-list');  // id만 변경
    if (!container) return;

    // 교수용 데이터 사용
    let reservations = profReservations;

    if (reservations.length === 0) {
        container.innerHTML = '<div style="font-size: 13px; color: #9ca3af; padding: 8px 0;">예정된 지도 예약이 없습니다.</div>';
        return;
    }

    container.innerHTML = reservations.map(r => {
        const statusMap = { confirmed: { label: '확정', color: '#2E7D32', bg: '#E8F5E9' }, approved: { label: '승인', color: '#0288D1', bg: '#E3F2FD' }, pending: { label: '대기', color: '#F57C00', bg: '#FFF3E0' } };
        const st = statusMap[r.status] || statusMap.pending;
        const meetingTypeLabel = r.meetingType === 'online' ? '온라인' : '오프라인';
        const durationText = r.duration ? ` (${r.duration}분)` : '';

        return `
            <div style="background: #FAF6F1; border-radius: 4px; padding: 12px; border: 1px solid #E8E0D8;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                    <span style="padding: 2px 8px; background: #6A0028; color: white; border-radius: 4px; font-size: 11px; font-weight: 600;">${meetingTypeLabel}</span>
                    <span style="font-size: 13px; font-weight: 600; color: #1a1a1a;">${r.studentName || ''}</span>
                    <span style="padding: 2px 8px; background: ${st.bg}; color: ${st.color}; border-radius: 4px; font-size: 11px; font-weight: 600;">${st.label}</span>
                </div>
                <div style="font-size: 13px; color: #1a1a1a; margin-bottom: 4px;">${r.selectedDate || ''}  ${r.selectedTime || ''}${durationText}</div>
                <div style="font-size: 12px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.topic || ''}</div>
            </div>
        `;
    }).join('');
}

// ========================================
// 초기화
// ========================================
function initProfessorDashboard() {
    renderProfAdminNotice();
    renderProfBoardNotice();
    renderProfStudentSummary();
    renderVerticalJourney();  // 세로형 여정
    renderProfAlert();
    renderProfReviewButtons();
    renderProfPendingFeedback();
    renderReservationStatus();  // 예약현황
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const dashboardScreen = document.getElementById('dashboard-screen');
    if (dashboardScreen) {
        initProfessorDashboard();
    }
});
