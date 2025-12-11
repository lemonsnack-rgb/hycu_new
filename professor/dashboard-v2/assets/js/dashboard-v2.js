// ===================================
// 대시보드 V2 - 메인 로직
// ===================================

let currentDegreeFilter = 'all'; // 전체, master, doctor, integrated

// ===================================
// 초기화
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    console.log('대시보드 V2 초기화');

    // Zone A: 프로세스 맵
    renderDegreeFilter();
    renderProcessMap();

    // Zone B: 심사 및 피드백
    renderReviewActions();
    renderFeedbackActions();

    // Zone C: 일정 및 미팅
    renderAcademicSchedule();
    renderMeetingSchedule();
}

// ===================================
// 사이드바 토글
// ===================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// ===================================
// Zone A: 학위 과정 필터
// ===================================
function renderDegreeFilter() {
    const filters = [
        { id: 'all', label: '전체' },
        { id: 'master', label: '석사' },
        { id: 'doctor', label: '박사' },
        { id: 'integrated', label: '통합' }
    ];

    const html = filters.map(f => `
        <button
            class="filter-tab ${f.id === currentDegreeFilter ? 'active' : ''}"
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
// Zone A: 프로세스 맵
// ===================================
function renderProcessMap() {
    const stages = DataService.getStudentsByStage(currentDegreeFilter);

    const stageConfig = [
        { id: 'proposal', label: '논문작성계획서' },
        { id: 'preliminary', label: '예비심사' },
        { id: 'final', label: '본심사' },
        { id: 'complete', label: '최종제출' }
    ];

    const html = stageConfig.map((stage, index) => {
        const count = stages[stage.id]?.length || 0;
        return `
            <div class="process-stage"
                 onmouseenter="showQuickView('${stage.id}')"
                 onmouseleave="hideQuickView()"
                 onclick="showQuickView('${stage.id}')">
                <div class="stage-label">${stage.label}</div>
                <div class="stage-count">${count}</div>
            </div>
            ${index < stageConfig.length - 1 ? '<div class="stage-arrow">›</div>' : ''}
        `;
    }).join('');

    document.getElementById('process-map').innerHTML = html;
}

// ===================================
// Zone A: 퀵 뷰 패널
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
        <div class="quick-view-header">${stageLabels[stageId]} 단계 학생 명단 (${students.length}명)</div>
        ${students.map(s => `
            <div class="quick-view-item">
                <div class="student-info">
                    <span class="badge">[${getDegreeLabel(s.degree)}]</span>
                    <span class="student-name">${s.name}</span>
                    <span class="student-semester">(${s.semester}학기)</span>
                    <span class="status-badge ${s.statusColor}">${s.statusText}</span>
                </div>
                <button onclick="navigateToStudent('${s.studentId}')" class="btn-detail">
                    상세보기
                </button>
            </div>
        `).join('')}
    `;

    const panel = document.getElementById('quick-view-panel');
    panel.innerHTML = html;
    panel.classList.remove('hidden');
}

function hideQuickView() {
    const panel = document.getElementById('quick-view-panel');
    panel.classList.add('hidden');
}

function getDegreeLabel(degree) {
    const labels = {
        'master': '석사',
        'doctor': '박사',
        'integrated': '통합'
    };
    return labels[degree] || degree;
}

// ===================================
// Zone B: 심사 관리
// ===================================
function renderReviewActions() {
    const reviews = DataService.getAllPendingReviews();

    const items = [
        {
            label: '논문작성계획서',
            count: reviews.proposal || 0,
            target: 'proposal'
        },
        {
            label: '예비심사',
            count: reviews.preliminary || 0,
            target: 'preliminary'
        },
        {
            label: '본심사 (최종)',
            count: reviews.final || 0,
            target: 'final'
        }
    ];

    const html = items.map(item => `
        <div class="action-item" onclick="navigateToReview('${item.target}')">
            <div class="action-label">${item.label}</div>
            <div class="action-count">
                심사 대기: <strong>${item.count}건</strong>
                ${item.count > 0 ?
                    '<div class="action-link">→ 심사하러 가기</div>' :
                    '<span style="color: #10b981;">(완료)</span>'}
            </div>
        </div>
    `).join('');

    document.getElementById('review-actions').innerHTML = html;
}

// ===================================
// Zone B: 피드백 관리
// ===================================
function renderFeedbackActions() {
    const feedback = DataService.getPendingFeedbacks();

    const html = `
        <div class="action-item ${feedback.count > 0 ? 'urgent' : ''}"
             onclick="navigateToFeedback()">
            <div class="action-label">미답변 피드백</div>
            <div class="action-count">
                대기: <strong class="text-danger">${feedback.count}건</strong>
                ${feedback.daysElapsed > 0 ?
                    `<span style="color: #64748b;"> (${feedback.daysElapsed}일 경과)</span>` :
                    ''}
                ${feedback.count > 0 ?
                    '<div class="action-link">→ 답변하러 가기</div>' :
                    ''}
            </div>
        </div>
    `;

    document.getElementById('feedback-actions').innerHTML = html;
}

// ===================================
// Zone C: 학사 일정
// ===================================
function renderAcademicSchedule() {
    const schedule = DataService.getAcademicSchedule();

    if (schedule.length === 0) {
        document.getElementById('academic-schedule').innerHTML = `
            <div class="text-center text-gray-500">등록된 학사 일정이 없습니다</div>
        `;
        return;
    }

    const html = schedule.map(item => `
        <div class="schedule-item ${item.urgent ? 'urgent' : ''}">
            ${item.dDay ? `<span class="d-day">D-${item.dDay}</span>` : ''}
            <strong>${item.title}</strong>
            ${item.endDate ?
                `<div class="schedule-date">${item.startDate} ~ ${item.endDate}</div>` :
                ''}
        </div>
    `).join('');

    document.getElementById('academic-schedule').innerHTML = html;
}

// ===================================
// Zone C: 미팅 일정
// ===================================
function renderMeetingSchedule() {
    const pending = DataService.getPendingMeetings();
    const upcoming = DataService.getUpcomingMeetings();

    let html = '';

    // 승인 대기
    if (pending.length > 0) {
        html += `
            <div class="meeting-section">
                <h4 class="meeting-section-title">승인 대기 (${pending.length}건)</h4>
                ${pending.map(m => `
                    <div class="meeting-item pending">
                        <div class="meeting-info">
                            <span class="badge">[${getDegreeLabel(m.degree)}]</span>
                            <span class="student-name">${m.studentName}</span>
                            <span class="meeting-date">${m.date}</span>
                            <span class="meeting-type ${m.type}">[${m.type === 'online' ? '온라인' : '오프라인'}]</span>
                        </div>
                        <button onclick="approveMeeting('${m.id}')" class="btn-approve">
                            → 승인하러 가기
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 예정된 미팅
    if (upcoming.length > 0) {
        html += `
            <div class="meeting-section">
                <h4 class="meeting-section-title">예정된 미팅 (${upcoming.length}건)</h4>
                ${upcoming.map(m => `
                    <div class="meeting-item">
                        <div class="meeting-info">
                            <span class="meeting-type ${m.type}">[${m.type === 'online' ? '온라인' : '오프라인'}]</span>
                            <span class="meeting-date">${m.dateLabel} ${m.time}</span>
                            <span class="student-name">${m.studentName}</span>
                            <span style="color: #64748b; font-size: 12px;">${m.type === 'online' ? '(Zoom)' : '(연구실)'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (!html) {
        html = '<div class="text-center text-gray-500">예정된 미팅이 없습니다</div>';
    }

    document.getElementById('meeting-schedule').innerHTML = html;
}

// ===================================
// 네비게이션 함수
// ===================================
function navigateToStudent(studentId) {
    alert(`학생 상세 화면으로 이동: ${studentId}\n(실제 시스템에서는 해당 화면으로 이동합니다)`);
}

function navigateToReview(tab) {
    alert(`심사관리 화면으로 이동: ${tab}\n(실제 시스템에서는 해당 탭으로 이동합니다)`);
}

function navigateToFeedback() {
    alert(`온라인피드백 화면으로 이동\n(실제 시스템에서는 해당 화면으로 이동합니다)`);
}

function approveMeeting(meetingId) {
    alert(`미팅 승인 화면으로 이동: ${meetingId}\n(실제 시스템에서는 승인 모달 또는 화면으로 이동합니다)`);
}
