// ===================================
// 대시보드 V4 - 첨부 파일 스타일 반영
// ===================================

let currentDegreeFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    console.log('대시보드 V4 초기화');

    // 공지사항
    renderNoticeList();

    // 지도학생 현황
    renderProcessFilter();
    renderProcessStages();
    renderStudentTable();

    // 심사 관리
    renderExamList();

    // 일정 관리
    renderUniversitySchedule();
    renderApprovalSummary();
    renderMeetings();

    // 필터 이벤트
    initFilterEvents();
}

// ===================================
// 사이드바 토글
// ===================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// ===================================
// 공지사항
// ===================================
function renderNoticeList() {
    const notices = [
        { title: '2025-1학기 본심사 일정 안내', date: '2024.11.15' },
        { title: '예비심사 결과 입력 안내', date: '2024.11.10' },
        { title: '논문지도 일정 변경 공지', date: '2024.11.08' }
    ];

    const html = notices.map(notice => `
        <div class="notice-item">
            <div class="notice-content">
                <div class="notice-title">${notice.title}</div>
                <div class="notice-date">${notice.date}</div>
            </div>
        </div>
    `).join('');

    document.getElementById('noticeList').innerHTML = html;
}

// ===================================
// 과정 필터
// ===================================
function renderProcessFilter() {
    const filters = [
        { id: 'all', label: '전체 15명' },
        { id: 'master', label: '석사 8명' },
        { id: 'doctor', label: '박사 5명' },
        { id: 'integrated', label: '통합 2명' }
    ];

    const html = filters.map(f => `
        <button class="filter-chip ${f.id === currentDegreeFilter ? 'active' : ''}" data-filter="${f.id}">
            ${f.label}
        </button>
    `).join('');

    document.getElementById('processFilter').innerHTML = html;
}

function initFilterEvents() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            currentDegreeFilter = this.dataset.filter;
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            renderProcessStages();
            renderStudentTable();
        });
    });
}

// ===================================
// 프로세스 단계
// ===================================
function renderProcessStages() {
    const stages = DataService.getStudentsByStage(currentDegreeFilter);

    const stageData = [
        { id: 'proposal', label: '논문작성계획서', count: stages.proposal.length, hasUrgent: false },
        { id: 'preliminary', label: '예비심사', count: stages.preliminary.length, hasUrgent: false },
        { id: 'final', label: '본심사', count: stages.final.length, hasUrgent: true },
        { id: 'complete', label: '최종제출', count: stages.complete.length, hasUrgent: false }
    ];

    const html = stageData.map((stage, index) => {
        const arrow = index < stageData.length - 1 ? '<div class="stage-arrow"></div>' : '';
        return `
            <div class="process-stage">
                <div class="stage-circle ${stage.hasUrgent ? 'has-urgent' : ''}">${stage.count}</div>
                <div class="stage-name">${stage.label}</div>
                <div class="stage-count">진행중 ${stage.count}명</div>
                ${arrow}
            </div>
        `;
    }).join('');

    document.getElementById('processStages').innerHTML = html;
}

// ===================================
// 학생 테이블
// ===================================
function renderStudentTable() {
    const students = [
        { name: '김철수', degree: '통합', semester: 7, stage: '본심사', status: 'urgent', statusText: '보완요청', date: '2024.11.18' },
        { name: '이영희', degree: '석사', semester: 3, stage: '논문계획서', status: 'warning', statusText: '심사중', date: '2024.11.20' },
        { name: '박민수', degree: '박사', semester: 5, stage: '예비심사', status: 'success', statusText: '통과', date: '2024.11.15' },
        { name: '최민지', degree: '통합', semester: '완료', stage: '본심사', status: 'warning', statusText: '진행중', date: '2024.11.19' },
        { name: '정수진', degree: '석사', semester: 6, stage: '본심사', status: 'warning', statusText: '진행중', date: '2024.11.17' },
        { name: '강지훈', degree: '석사', semester: '졸업', stage: '최종제출', status: 'success', statusText: '완료', date: '2024.11.10' }
    ];

    const html = students.map(student => `
        <tr>
            <td class="student-name">${student.name}</td>
            <td>${student.degree}</td>
            <td>${student.semester}학기</td>
            <td>${student.stage}</td>
            <td><span class="status-badge ${student.status}">${student.statusText}</span></td>
            <td>${student.date}</td>
        </tr>
    `).join('');

    document.getElementById('studentTableBody').innerHTML = html;
}

// ===================================
// 심사 관리
// ===================================
function renderExamList() {
    const exams = [
        { title: '논문작성계획서 심사', pending: 2, hasUrgent: false, showSecondary: false },
        { title: '예비심사', pending: 0, hasUrgent: false, showSecondary: true },
        { title: '본심사', pending: 1, supplement: 1, hasUrgent: true, showSecondary: false },
        { title: '최종제출 확인', completed: 4, hasUrgent: false, showSecondary: true }
    ];

    const html = exams.map(exam => `
        <div class="exam-item ${exam.hasUrgent ? 'has-urgent' : ''}">
            <div class="exam-item-header">
                <div class="exam-title">
                    ${exam.hasUrgent ? '<span class="urgent-dot"></span>' : ''}
                    ${exam.title}
                </div>
            </div>
            <div class="exam-details">
                ${exam.pending !== undefined ? `
                    <div class="exam-detail-item">
                        <span>심사 대기</span>
                        <span class="exam-detail-value">${exam.pending}건</span>
                    </div>
                ` : ''}
                ${exam.supplement ? `
                    <div class="exam-detail-item">
                        <span>보완 확인</span>
                        <span class="exam-detail-value">${exam.supplement}건</span>
                    </div>
                ` : ''}
                ${exam.completed !== undefined ? `
                    <div class="exam-detail-item">
                        <span>제출 완료</span>
                        <span class="exam-detail-value">${exam.completed}건</span>
                    </div>
                ` : ''}
            </div>
            ${exam.showSecondary
                ? '<button class="exam-action-btn secondary">' + (exam.completed ? '확인하기' : '심사 없음') + '</button>'
                : '<button class="exam-action-btn">심사하기</button>'}
        </div>
    `).join('');

    document.getElementById('examList').innerHTML = html;
}

// ===================================
// 대학원 전체 일정
// ===================================
function renderUniversitySchedule() {
    const schedules = [
        { title: '예비심사 결과 입력 마감', date: '2024.11.22 (금) 23:59', dday: 3, urgent: true },
        { title: '본심사 신청 마감', date: '2024.12.01 (일) 23:59', dday: 12, urgent: false },
        { title: '본심사 기간', date: '2024.11.25 ~ 11.29', dday: null, urgent: false },
        { title: '최종논문 제출기간', date: '2024.12.01 ~ 12.07', dday: null, urgent: false }
    ];

    const html = schedules.map(schedule => `
        <div class="schedule-item ${schedule.urgent ? 'urgent' : ''}">
            ${schedule.dday !== null ? `
                <div class="dday-badge ${schedule.urgent ? '' : 'normal'}">D-${schedule.dday}</div>
            ` : ''}
            <div class="schedule-content">
                <div class="schedule-title">${schedule.title}</div>
                <div class="schedule-date">${schedule.date}</div>
            </div>
        </div>
    `).join('');

    document.getElementById('universitySchedule').innerHTML = html;
}

// ===================================
// 승인 대기 + 미팅
// ===================================
function renderApprovalSummary() {
    const html = `
        <div class="approval-text">승인 대기 미팅 1건</div>
        <a href="#" class="view-all-link" style="margin: 0;">
            승인 목록 보기
            <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
        </a>
    `;

    document.getElementById('approvalSummary').innerHTML = html;
}

function renderMeetings() {
    const todayMeetings = [
        {
            type: 'online',
            student: '[석사] 박민수',
            time: '14:00 ~ 15:00',
            isToday: true,
            hasZoom: true
        },
        {
            type: 'offline',
            student: '[통합] 김철수',
            time: '16:00 ~ 17:00 · 연구실',
            isToday: true,
            hasZoom: false
        }
    ];

    const tomorrowMeetings = [
        {
            type: 'offline',
            student: '[석사] 이영희',
            time: '10:00 ~ 11:00 · 연구실 302호',
            isToday: false,
            hasZoom: false
        }
    ];

    // 오늘 미팅
    document.getElementById('todayMeetingTitle').textContent = `오늘 예정 미팅 (${todayMeetings.length}건)`;
    const todayHtml = todayMeetings.map(meeting => `
        <div class="meeting-item">
            <div class="meeting-header">
                <span class="meeting-type-badge ${meeting.type}">${meeting.type === 'online' ? '온라인' : '오프라인'}</span>
                <span class="meeting-student">${meeting.student}</span>
                <span class="time-badge">오늘</span>
            </div>
            <div class="meeting-info">${meeting.time}</div>
            ${meeting.hasZoom ? `
                <a href="#" class="meeting-zoom-btn">
                    <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                    Zoom 입장하기
                </a>
            ` : ''}
        </div>
    `).join('');
    document.getElementById('todayMeetings').innerHTML = todayHtml;

    // 내일 미팅
    document.getElementById('tomorrowMeetingTitle').textContent = `내일 예정 미팅 (${tomorrowMeetings.length}건)`;
    const tomorrowHtml = tomorrowMeetings.map(meeting => `
        <div class="meeting-item">
            <div class="meeting-header">
                <span class="meeting-type-badge ${meeting.type}">${meeting.type === 'online' ? '온라인' : '오프라인'}</span>
                <span class="meeting-student">${meeting.student}</span>
            </div>
            <div class="meeting-info">${meeting.time}</div>
        </div>
    `).join('');
    document.getElementById('tomorrowMeetings').innerHTML = tomorrowHtml;
}

// ===================================
// 모바일 반응형
// ===================================
if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.add('collapsed');
}

window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.add('collapsed');
    }
});
