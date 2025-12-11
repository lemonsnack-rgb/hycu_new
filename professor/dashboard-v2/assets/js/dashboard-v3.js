// ===================================
// 대시보드 V3 - ERP 스타일 로직
// ===================================

let currentDegreeFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    console.log('대시보드 V3 초기화 (ERP 스타일)');

    renderDegreeFilter();
    renderProcessMap();
    renderReviewTable();
    renderFeedbackTable();
    renderScheduleTable();
    renderMeetingTable();
}

// ===================================
// 사이드바 토글
// ===================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// ===================================
// 학위 과정 필터
// ===================================
function renderDegreeFilter() {
    const filters = [
        { id: 'all', label: '전체' },
        { id: 'master', label: '석사' },
        { id: 'doctor', label: '박사' },
        { id: 'integrated', label: '통합' }
    ];

    const html = filters.map(f => `
        <button class="filter-tab ${f.id === currentDegreeFilter ? 'active' : ''}"
                onclick="changeDegreeFilter('${f.id}')">
            ${f.label}
        </button>
    `).join('');

    document.getElementById('degree-filter').innerHTML = html;
}

function changeDegreeFilter(filterId) {
    currentDegreeFilter = filterId;
    renderDegreeFilter();
    renderProcessMap();
    hideQuickView();
}

// ===================================
// 프로세스 맵
// ===================================
function renderProcessMap() {
    const stages = DataService.getStudentsByStage(currentDegreeFilter);

    const stageConfig = [
        { id: 'proposal', label: '논문작성계획서' },
        { id: 'preliminary', label: '예비심사' },
        { id: 'final', label: '본심사' },
        { id: 'complete', label: '최종제출' }
    ];

    const html = stageConfig.map(stage => {
        const count = stages[stage.id]?.length || 0;
        return `
            <div class="process-stage"
                 onmouseenter="showQuickView('${stage.id}')"
                 onmouseleave="hideQuickView()"
                 onclick="showQuickView('${stage.id}')">
                <div class="stage-label">${stage.label}</div>
                <div class="stage-count">${count}<span class="stage-unit">명</span></div>
            </div>
        `;
    }).join('');

    document.getElementById('process-map').innerHTML = html;
}

// ===================================
// 퀵 뷰 패널 (테이블 형식)
// ===================================
function showQuickView(stageId) {
    const stages = DataService.getStudentsByStage(currentDegreeFilter);
    const students = stages[stageId] || [];

    if (students.length === 0) {
        hideQuickView();
        return;
    }

    const stageLabels = {
        'proposal': '논문작성계획서',
        'preliminary': '예비심사',
        'final': '본심사',
        'complete': '최종제출'
    };

    const html = `
        <div class="quick-view-header">${stageLabels[stageId]} 단계 (${students.length}명)</div>
        <table class="quick-view-table">
            <thead>
                <tr>
                    <th>과정</th>
                    <th>학생명</th>
                    <th>학기</th>
                    <th>상태</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(s => `
                    <tr>
                        <td><span class="badge">${getDegreeLabel(s.degree)}</span></td>
                        <td>${s.name}</td>
                        <td>${s.semester}학기</td>
                        <td><span class="status-badge ${s.statusColor}">${s.statusText}</span></td>
                        <td><a href="#" onclick="navigateToStudent('${s.studentId}'); return false;" class="action-link">상세보기</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const panel = document.getElementById('quick-view-panel');
    panel.innerHTML = html;
    panel.classList.remove('hidden');
}

function hideQuickView() {
    document.getElementById('quick-view-panel').classList.add('hidden');
}

function getDegreeLabel(degree) {
    const labels = { 'master': '석사', 'doctor': '박사', 'integrated': '통합' };
    return labels[degree] || degree;
}

// ===================================
// 심사 관리 테이블
// ===================================
function renderReviewTable() {
    const reviews = DataService.getAllPendingReviews();

    const items = [
        { label: '논문작성계획서', count: reviews.proposal || 0, target: 'proposal' },
        { label: '예비심사', count: reviews.preliminary || 0, target: 'preliminary' },
        { label: '본심사', count: reviews.final || 0, target: 'final' }
    ];

    const html = `
        <table class="review-table">
            <thead>
                <tr>
                    <th>심사 단계</th>
                    <th>대기 건수</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td>${item.label}</td>
                        <td>
                            ${item.count > 0 ?
                                `<span class="count-badge ${item.count > 0 ? 'urgent' : 'complete'}">${item.count}건</span>` :
                                '<span class="count-badge complete">완료</span>'}
                        </td>
                        <td>
                            ${item.count > 0 ?
                                `<a href="#" onclick="navigateToReview('${item.target}'); return false;" class="action-link">심사하기</a>` :
                                '<span class="text-muted">-</span>'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('review-table').innerHTML = html;
}

// ===================================
// 피드백 테이블
// ===================================
function renderFeedbackTable() {
    const feedback = DataService.getPendingFeedbacks();

    const html = `
        <table class="review-table">
            <thead>
                <tr>
                    <th>구분</th>
                    <th>대기 건수</th>
                    <th>경과 일수</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody>
                <tr ${feedback.count > 0 ? 'style="background: #fff8e1;"' : ''}>
                    <td>미답변 피드백</td>
                    <td>
                        ${feedback.count > 0 ?
                            `<span class="count-badge urgent">${feedback.count}건</span>` :
                            '<span class="count-badge complete">0건</span>'}
                    </td>
                    <td>${feedback.daysElapsed > 0 ? `${feedback.daysElapsed}일` : '-'}</td>
                    <td>
                        ${feedback.count > 0 ?
                            '<a href="#" onclick="navigateToFeedback(); return false;" class="action-link">답변하기</a>' :
                            '<span class="text-muted">-</span>'}
                    </td>
                </tr>
            </tbody>
        </table>
    `;

    document.getElementById('feedback-table').innerHTML = html;
}

// ===================================
// 학사 일정 테이블
// ===================================
function renderScheduleTable() {
    const schedule = DataService.getAcademicSchedule();

    if (schedule.length === 0) {
        document.getElementById('schedule-table').innerHTML = `
            <p class="text-center text-muted">등록된 학사 일정이 없습니다</p>
        `;
        return;
    }

    const html = `
        <table class="schedule-table">
            <thead>
                <tr>
                    <th>일정명</th>
                    <th>기간</th>
                    <th>마감</th>
                </tr>
            </thead>
            <tbody>
                ${schedule.map(item => `
                    <tr ${item.urgent ? 'class="urgent"' : ''}>
                        <td>${item.title}</td>
                        <td>${item.endDate ? `${item.startDate} ~ ${item.endDate}` : '-'}</td>
                        <td>
                            ${item.dDay ? `<span class="d-day">D-${item.dDay}</span>` : '-'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('schedule-table').innerHTML = html;
}

// ===================================
// 미팅 테이블
// ===================================
function renderMeetingTable() {
    const pending = DataService.getPendingMeetings();
    const upcoming = DataService.getUpcomingMeetings();

    let html = '';

    // 승인 대기
    if (pending.length > 0) {
        html += `
            <div class="meeting-section">
                <div class="meeting-section-title">승인 대기 (${pending.length}건)</div>
                <table class="meeting-table">
                    <thead>
                        <tr>
                            <th>과정</th>
                            <th>학생명</th>
                            <th>일시</th>
                            <th>유형</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pending.map(m => `
                            <tr class="pending">
                                <td><span class="badge">${getDegreeLabel(m.degree)}</span></td>
                                <td>${m.studentName}</td>
                                <td>${m.date}</td>
                                <td><span class="meeting-type ${m.type}">${m.type === 'online' ? '온라인' : '오프라인'}</span></td>
                                <td><button onclick="approveMeeting('${m.id}')" class="btn-sm">승인</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // 예정된 미팅
    if (upcoming.length > 0) {
        html += `
            <div class="meeting-section">
                <div class="meeting-section-title">예정된 미팅 (${upcoming.length}건)</div>
                <table class="meeting-table">
                    <thead>
                        <tr>
                            <th>유형</th>
                            <th>일시</th>
                            <th>학생명</th>
                            <th>장소</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${upcoming.map(m => `
                            <tr>
                                <td><span class="meeting-type ${m.type}">${m.type === 'online' ? '온라인' : '오프라인'}</span></td>
                                <td>${m.dateLabel} ${m.time}</td>
                                <td>${m.studentName}</td>
                                <td>${m.type === 'online' ? 'Zoom' : '연구실'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    if (!html) {
        html = '<p class="text-center text-muted">예정된 미팅이 없습니다</p>';
    }

    document.getElementById('meeting-table').innerHTML = html;
}

// ===================================
// 네비게이션
// ===================================
function navigateToStudent(studentId) {
    alert(`학생 상세: ${studentId}`);
}

function navigateToReview(tab) {
    alert(`심사관리 - ${tab} 탭으로 이동`);
}

function navigateToFeedback() {
    alert(`온라인피드백 화면으로 이동`);
}

function approveMeeting(meetingId) {
    alert(`미팅 승인: ${meetingId}`);
}
