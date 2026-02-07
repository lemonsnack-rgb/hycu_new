/* ==================== Dashboard Data & Rendering (Redesigned) ==================== */
/* 이미지 기반 레이아웃 적용 */

const DashboardData = {
    // 학생 정보
    student: {
        name: '홍길동',
        studentId: '2024123456',
        degree: '석사',
        semesterCount: '3학기차',
        major: '컴퓨터공학과',
        currentStage: '논문 작성',
        currentStageId: 3
    },

    // 전체 논문 지도 단계 (관리자 화면 등록)
    allGuidanceStages: [
        { id: 1, name: '연구 주제 선정', order: 1, isCompleted: true },
        { id: 2, name: '연구 계획서 작성', order: 2, isCompleted: true },
        { id: 3, name: '논문 작성', order: 3, isCompleted: false },
        { id: 4, name: '예비심사', order: 4, isCompleted: false },
        { id: 5, name: '본심사', order: 5, isCompleted: false },
        { id: 6, name: '최종 논문 제출', order: 6, isCompleted: false }
    ],

    // 활동 현황 (알림)
    activities: [
        {
            id: 1,
            type: 'feedback',
            title: '담당 교수님이 [2024-2학기] 학기별 지도 계획을 승인했습니다.',
            time: '2시간 전',
            isRead: false
        },
        {
            id: 2,
            type: 'schedule',
            title: '담당 교수님이 실시간 지도 일정을 등록했습니다.',
            time: '5시간 전',
            isRead: false
        },
        {
            id: 3,
            type: 'submission',
            title: '학위논문 제출 신청서가 접수되었습니다.',
            time: '1일 전',
            isRead: false
        },
        {
            id: 4,
            type: 'notice',
            title: '[공지사항] 2024학년도 2학기 논문 제출 일정 안내',
            time: '2일 전',
            isRead: true
        },
        {
            id: 5,
            type: 'reminder',
            title: '중간발표 준비 마감이 7일 남았습니다.',
            time: '3일 전',
            isRead: true
        }
    ],

    // 주요 일정 (대학원 학사 일정)
    mainSchedules: [
        {
            id: 1,
            title: '논문 제출 마감',
            date: '2024-12-20 17:00',
            location: ''
        },
        {
            id: 2,
            title: '학위논문 심사 일정',
            date: '2024-12-25 14:00',
            location: ''
        }
    ],

    // 실시간 지도 예약 현황
    meetingSchedules: [
        {
            id: 1,
            title: '김철수 교수',
            date: '2024-11-28 10:00',
            location: ''
        },
        {
            id: 2,
            title: '이영희 교수',
            date: '2024-12-01 15:00',
            location: ''
        },
        {
            id: 3,
            title: '박지성 교수',
            date: '2024-12-05 09:00',
            location: ''
        }
    ],

    // 논문 지도 현황
    feedbackSchedules: [
        {
            id: 1,
            title: '연구계획서',
            date: '피드백 등록: 2024-11-25 09:30',
            location: ''
        },
        {
            id: 2,
            title: '중간논문',
            date: '피드백 등록: 2024-11-20 14:15',
            location: ''
        },
        {
            id: 3,
            title: '최종논문',
            date: '피드백 등록: 2024-11-15 16:45',
            location: ''
        }
    ],

    // 공지사항 (최근 5개)
    notices: [
        {
            id: 1,
            title: '2024학년도 2학기 논문 제출 일정 안내',
            author: '대학원',
            date: '2024-12-15',
            isNew: true
        },
        {
            id: 2,
            title: '논문 작성 워크샵 개최 안내',
            author: '대학원',
            date: '2024-12-10',
            isNew: true
        },
        {
            id: 3,
            title: '학위 논문 제출 요건 변경 안내',
            author: '대학원',
            date: '2024-12-05',
            isNew: false
        },
        {
            id: 4,
            title: '연구윤리교육 이수 안내',
            author: '대학원',
            date: '2024-11-28',
            isNew: false
        },
        {
            id: 5,
            title: '논문 지도 시스템 업데이트 안내',
            author: '대학원',
            date: '2024-11-20',
            isNew: false
        }
    ],

    // 학위논문 청구 요건 (4개)
    requirements: [
        {
            id: 1,
            name: '논문지도 이수',
            status: 'completed',
            icon: 'check-circle'
        },
        {
            id: 2,
            name: '연구윤리교육',
            status: 'completed',
            icon: 'book'
        },
        {
            id: 3,
            name: '학술지 논문 제출',
            status: 'completed',
            icon: 'file-text'
        },
        {
            id: 4,
            name: '논문심사 통과',
            status: 'incomplete',
            icon: 'clipboard-check'
        }
    ]
};

/* ==================== Rendering Functions ==================== */

/**
 * 지도학생 현황 테이블 렌더링
 */
function renderStudentStatusTable() {
    const container = document.getElementById('student-status-table');
    if (!container) return;

    const student = DashboardData.student;

    container.innerHTML = `
        <table class="student-status-table">
            <thead>
                <tr>
                    <th>학생명</th>
                    <th>전공/학과</th>
                    <th>과정</th>
                    <th>학기차</th>
                    <th>현재 진행 단계</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${student.name}</td>
                    <td>${student.major}</td>
                    <td>${student.degree}</td>
                    <td>${student.semesterCount}</td>
                    <td>
                        <span class="current-stage-link" onclick="showAllGuidanceStages()">
                            ${student.currentStage}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

/**
 * 전체 논문 지도 단계 모달 표시
 */
function showAllGuidanceStages() {
    const stages = DashboardData.allGuidanceStages;
    const currentStageId = DashboardData.student.currentStageId;

    let stagesHTML = stages.map(stage => {
        const isCurrentClass = stage.id === currentStageId ? 'current-stage' : '';
        const statusIcon = stage.isCompleted ? '✓' : '';
        const statusClass = stage.isCompleted ? 'completed' : stage.id === currentStageId ? 'in-progress' : 'pending';

        return `
            <div class="guidance-stage-item ${statusClass} ${isCurrentClass}">
                <div class="stage-number">${stage.order}</div>
                <div class="stage-info">
                    <div class="stage-name">${stage.name}</div>
                    ${stage.id === currentStageId ? '<div class="stage-badge">진행중</div>' : ''}
                    ${stage.isCompleted ? '<div class="stage-badge completed">완료</div>' : ''}
                </div>
                ${statusIcon ? `<div class="stage-icon">${statusIcon}</div>` : ''}
            </div>
        `;
    }).join('');

    const modalHTML = `
        <div class="guidance-stages-modal-overlay" onclick="closeAllGuidanceStagesModal()">
            <div class="guidance-stages-modal" onclick="event.stopPropagation()">
                <div class="guidance-stages-modal-header">
                    <h3>전체 논문 지도 단계</h3>
                    <button onclick="closeAllGuidanceStagesModal()" class="modal-close-btn">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="guidance-stages-modal-body">
                    ${stagesHTML}
                </div>
            </div>
        </div>
    `;

    // 모달 추가
    const existingModal = document.getElementById('guidance-stages-modal-container');
    if (existingModal) {
        existingModal.remove();
    }

    const modalContainer = document.createElement('div');
    modalContainer.id = 'guidance-stages-modal-container';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // 모달 스타일 추가 (한 번만)
    if (!document.getElementById('guidance-stages-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'guidance-stages-modal-styles';
        styles.textContent = `
            .guidance-stages-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .guidance-stages-modal {
                background: white;
                border-radius: 8px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
            }
            .guidance-stages-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .guidance-stages-modal-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: #1a1a1a;
            }
            .modal-close-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.25rem;
                color: #6b7280;
                transition: color 0.2s;
            }
            .modal-close-btn:hover {
                color: #1a1a1a;
            }
            .guidance-stages-modal-body {
                padding: 1.5rem;
                overflow-y: auto;
            }
            .guidance-stage-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.25rem;
                border: 2px solid #e5e7eb;
                border-radius: 4px;
                margin-bottom: 1rem;
                transition: all 0.2s;
            }
            .guidance-stage-item:last-child {
                margin-bottom: 0;
            }
            .guidance-stage-item.completed {
                background: #f9fafb;
                border-color: #6A0028;
            }
            .guidance-stage-item.in-progress {
                background: #FCE4EC;
                border-color: #6A0028;
                border-width: 3px;
            }
            .stage-number {
                width: 40px;
                height: 40px;
                background: #e5e7eb;
                color: #6b7280;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 1.125rem;
                flex-shrink: 0;
            }
            .guidance-stage-item.completed .stage-number {
                background: #6A0028;
                color: white;
            }
            .guidance-stage-item.in-progress .stage-number {
                background: #6A0028;
                color: white;
            }
            .stage-info {
                flex: 1;
            }
            .stage-name {
                font-size: 1rem;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 0.25rem;
            }
            .stage-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                background: #6A0028;
                color: white;
                font-size: 0.75rem;
                font-weight: 600;
                border-radius: 4px;
                margin-top: 0.25rem;
            }
            .stage-badge.completed {
                background: #10b981;
            }
            .stage-icon {
                font-size: 1.5rem;
                color: #6A0028;
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * 전체 논문 지도 단계 모달 닫기
 */
function closeAllGuidanceStagesModal() {
    const modalContainer = document.getElementById('guidance-stages-modal-container');
    if (modalContainer) {
        modalContainer.remove();
    }
}

/**
 * 학위논문 청구 요건 렌더링 (진행률 제거)
 */
function renderRequirements() {
    const requirementsList = document.getElementById('requirements-list');
    if (!requirementsList) return;

    // 아이콘 매핑
    const iconMap = {
        'check-circle': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        'book': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>`,
        'file-text': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>`,
        'clipboard-check': `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>`
    };

    // 요건 목록 렌더링
    requirementsList.innerHTML = DashboardData.requirements.map(requirement => `
        <div class="requirement-item">
            <div class="requirement-info">
                <div class="requirement-icon">${iconMap[requirement.icon]}</div>
                <span class="requirement-name">${requirement.name}</span>
            </div>
            <span class="requirement-status ${requirement.status}">
                ${requirement.status === 'completed' ? '완료' : '미완료'}
            </span>
        </div>
    `).join('');
}

/**
 * 공지사항 렌더링
 */
function renderNoticeList() {
    const noticeContainer = document.getElementById('notice-list');
    if (!noticeContainer) return;

    noticeContainer.innerHTML = DashboardData.notices.map(notice => `
        <div class="notice-item" onclick="showScreen('notice')">
            <div class="notice-content">
                <div class="notice-title">${notice.title}</div>
                <div class="notice-meta">
                    <span>${notice.date}</span>
                    <span>|</span>
                    <span>${notice.author}</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * 활동 현황 렌더링
 */
function renderActivityList() {
    const container = document.getElementById('activity-list');
    if (!container) return;

    const iconMap = {
        feedback: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
        </svg>`,
        schedule: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>`,
        submission: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>`,
        notice: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>`,
        reminder: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`
    };

    container.innerHTML = DashboardData.activities.map(activity => `
        <div class="activity-item ${activity.isRead ? '' : 'unread'}">
            <div class="activity-icon">${iconMap[activity.type]}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

/**
 * 일정 섹션 렌더링 (공통 함수)
 */
function renderScheduleSection(containerId, schedules, showLocation = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (schedules.length === 0) {
        container.innerHTML = '<div class="schedule-empty">일정이 없습니다.</div>';
        return;
    }

    container.innerHTML = schedules.map(schedule => `
        <div class="schedule-item">
            <div class="schedule-item-header">
                <div>
                    <div class="schedule-item-title">${schedule.title}</div>
                </div>
            </div>
            <div class="schedule-item-info">
                <div class="schedule-item-row">
                    <svg class="schedule-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="schedule-item-text">${schedule.date}</span>
                </div>
                ${showLocation && schedule.location ? `
                <div class="schedule-item-row">
                    <svg class="schedule-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="schedule-item-text">${schedule.location}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * 모든 일정 렌더링
 */
function renderSchedules() {
    renderScheduleSection('main-schedule-list', DashboardData.mainSchedules, false);
    renderScheduleSection('meeting-schedule-list', DashboardData.meetingSchedules, false);
    renderScheduleSection('feedback-schedule-list', DashboardData.feedbackSchedules, false);
}

/**
 * 대시보드 초기화
 */
function initDashboard() {
    renderStudentStatusTable();
    renderRequirements();
    renderNoticeList();
    renderActivityList();
    renderSchedules();
}

// DOM 로드 완료 시 대시보드 초기화
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

// 전역 export
window.DashboardData = DashboardData;
window.initDashboard = initDashboard;
window.showAllGuidanceStages = showAllGuidanceStages;
window.closeAllGuidanceStagesModal = closeAllGuidanceStagesModal;

console.log('dashboard.js loaded (redesigned with updates)');

/* ==================== 새 대시보드 (PPT 레이아웃 기반 개편) ==================== */

// 학위논문청구요건
const newRequirements = [
    { id: 1, name: '학점 이수', completed: true },
    { id: 2, name: '연구윤리', completed: true },
    { id: 3, name: '연구방법론', completed: true },
    { id: 4, name: '외국어시험', completed: false },
    { id: 5, name: '종합시험', completed: false },
    { id: 6, name: '학위 자격심사', completed: true },
    { id: 7, name: '박사논문1', completed: false },
    { id: 8, name: '박사논문2', completed: false },
];

// 학생별 논문지도단계 진행 현황 (세로형 여정용 Mock 데이터)
// 기본단계: applicationPeriod(신청기간), withdrawalPeriod(철회기간)
// 세부단계: submissionPeriod(제출기간), reviewPeriod(심사기간) 각각 분리
const studentStageProgress = [
    {
        stageId: 'HS001',
        basicStageName: '논문작성계획서',
        applicationPeriod: '2025-03-01 ~ 2025-03-15',
        withdrawalPeriod: '2025-03-01 ~ 2025-03-10',
        status: 'completed',
        subStages: [
            { id: 'SS001', name: '논문작성계획서 초안', status: 'completed',
              submissionPeriod: '2025-03-01 ~ 2025-03-15', reviewPeriod: '2025-03-16 ~ 2025-03-20' },
            { id: 'SS002', name: '논문작성계획서 최종본', status: 'completed',
              submissionPeriod: '2025-03-21 ~ 2025-03-25', reviewPeriod: '2025-03-26 ~ 2025-03-31' }
        ]
    },
    {
        stageId: 'HS002',
        basicStageName: '프로포절',
        applicationPeriod: '2025-04-01 ~ 2025-04-15',
        withdrawalPeriod: '2025-04-01 ~ 2025-04-10',
        status: 'completed',
        subStages: [
            { id: 'SS003', name: '프로포절 초안', status: 'completed',
              submissionPeriod: '2025-04-01 ~ 2025-04-15', reviewPeriod: '2025-04-16 ~ 2025-04-25' },
            { id: 'SS004', name: '프로포절 발표', status: 'completed',
              submissionPeriod: '2025-04-20 ~ 2025-05-05', reviewPeriod: '2025-05-06 ~ 2025-05-10' }
        ]
    },
    {
        stageId: 'HS003',
        basicStageName: '예비심사',
        applicationPeriod: '2025-05-10 ~ 2025-06-10',
        withdrawalPeriod: '2025-05-10 ~ 2025-05-20',
        status: 'in-progress',
        subStages: [
            { id: 'SS005', name: '1차 예비심사', status: 'completed',
              submissionPeriod: '2025-05-10 ~ 2025-05-25', reviewPeriod: '2025-05-26 ~ 2025-05-31' },
            { id: 'SS006', name: '2차 예비심사', status: 'current',
              submissionPeriod: '2025-06-01 ~ 2025-06-15', reviewPeriod: '2025-06-16 ~ 2025-06-25' }
        ]
    },
    {
        stageId: 'HS004',
        basicStageName: '본심사',
        applicationPeriod: '2025-08-20 ~ 2025-09-05',
        withdrawalPeriod: '2025-08-20 ~ 2025-08-30',
        status: 'upcoming',
        subStages: [
            { id: 'SS007', name: '1차 본심사', status: 'upcoming',
              submissionPeriod: '2025-09-01 ~ 2025-09-15', reviewPeriod: '2025-09-20 ~ 2025-10-05' },
            { id: 'SS008', name: '2차 본심사', status: 'upcoming',
              submissionPeriod: '2025-10-10 ~ 2025-10-20', reviewPeriod: '2025-10-25 ~ 2025-11-05' }
        ]
    }
];

/**
 * 카드1: 행정 공지사항 렌더링 (최근 3건)
 */
function renderAdminNoticeCard() {
    const container = document.getElementById('admin-notice-list');
    if (!container) return;

    // noticeDataStore (admin-v3/assets/js/notice-data.js)에서 최근 3건 가져오기
    let notices = [];
    if (typeof noticeDataStore !== 'undefined') {
        notices = noticeDataStore
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, 3);
    }

    if (notices.length === 0) {
        container.innerHTML = '<div style="font-size: 13px; color: #9ca3af; padding: 8px 0;">등록된 공지사항이 없습니다.</div>';
        return;
    }

    container.innerHTML = notices.map((n, i) => `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; ${i < notices.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''} cursor: pointer;"
             onmouseover="this.style.background='#f9fafb';" onmouseout="this.style.background='transparent';"
             onclick="showScreen('notice')">
            <span style="font-size: 13px; color: #1a1a1a; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px;">${n.title}</span>
            <span style="font-size: 12px; color: #9ca3af; flex-shrink: 0;">${n.createdAt.split(' ')[0]}</span>
        </div>
    `).join('');
}

/**
 * 카드2: 논문지도공지 및 자료 렌더링 (최근 3건)
 */
function renderBoardNoticeCard() {
    const container = document.getElementById('board-notice-list');
    if (!container) return;

    // DataService.getResourceBoards (professor-v3/assets/js/mock-data.js)에서 최근 3건
    let boards = [];
    if (typeof DataService !== 'undefined' && typeof DataService.getResourceBoards === 'function') {
        boards = DataService.getResourceBoards('student', 'S001')
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, 3);
    }

    if (boards.length === 0) {
        container.innerHTML = '<div style="font-size: 13px; color: #9ca3af; padding: 8px 0;">등록된 자료가 없습니다.</div>';
        return;
    }

    container.innerHTML = boards.map((b, i) => `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; ${i < boards.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''} cursor: pointer;"
             onmouseover="this.style.background='#f9fafb';" onmouseout="this.style.background='transparent';"
             onclick="showScreen('resources')">
            <span style="font-size: 13px; color: #1a1a1a; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px;">${b.title}</span>
            <span style="font-size: 12px; color: #9ca3af; flex-shrink: 0;">${b.createdAt.split('T')[0]}</span>
        </div>
    `).join('');
}

/**
 * 카드3: 알림 렌더링 (최근 3건)
 */
function renderAlertCard() {
    const container = document.getElementById('alert-list');
    if (!container) return;

    // DashboardData.activities에서 최근 3건
    const alerts = (DashboardData.activities || []).slice(0, 3);

    if (alerts.length === 0) {
        container.innerHTML = '<div style="font-size: 13px; color: #9ca3af; padding: 8px 0;">새로운 알림이 없습니다.</div>';
        return;
    }

    container.innerHTML = alerts.map((a, i) => `
        <div style="display: flex; align-items: flex-start; gap: 8px; padding: 8px 0; ${i < alerts.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''}">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: ${a.isRead ? '#d1d5db' : '#6A0028'}; margin-top: 6px; flex-shrink: 0;"></div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 13px; color: #1a1a1a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a.title}</div>
                <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">${a.time}</div>
            </div>
        </div>
    `).join('');
}

/**
 * 카드4: 요건 충족 현황 렌더링 (칩 형태, 기존 유지)
 */
function renderRequirementsChips() {
    const container = document.getElementById('requirements-chips');
    const countSpan = document.getElementById('req-completed-count');
    if (!container) return;

    const completedCount = newRequirements.filter(r => r.completed).length;
    if (countSpan) countSpan.textContent = completedCount;

    container.innerHTML = newRequirements.map(req => `
        <div style="display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: ${req.completed ? '#E8F5E9' : '#f8fafc'}; border: 1px solid ${req.completed ? '#A5D6A7' : '#e5e7eb'}; border-radius: 4px; font-size: 13px;">
            ${req.completed
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                : '<div style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid #9ca3af;"></div>'
            }
            <span style="color: ${req.completed ? '#2E7D32' : '#9ca3af'}; font-weight: ${req.completed ? '600' : '400'};">${req.name}</span>
        </div>
    `).join('');
}

/**
 * 카드5: 세로형 논문지도단계 렌더링
 * - 모든 기본단계에 아코디언 (완료만 디폴트 접힘)
 * - 날짜 위치 통일 (right: 0 고정)
 * - 세부단계 폰트 14px
 */
function renderVerticalJourney() {
    const container = document.getElementById('vertical-journey');
    if (!container) return;

    let html = '';
    const lastIdx = studentStageProgress.length - 1;

    studentStageProgress.forEach((stage, stageIdx) => {
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
                <div id="journey-sub-${stageIdx}" style="margin-left: 30px; ${!isLast ? 'border-left: 2px solid ' + (isCompleted ? '#A5D6A7' : isCurrent ? '#90CAF9' : '#E0E0E0') + ';' : ''} padding-left: 28px; padding-top: 4px; padding-bottom: 4px; ${defaultCollapsed ? 'display: none;' : ''}">
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
 * 기본단계 접기/펼치기 토글 (모든 단계)
 */
function toggleJourneyStage(stageIdx) {
    const subDiv = document.getElementById(`journey-sub-${stageIdx}`);
    const toggle = document.querySelector(`.journey-toggle[data-stage="${stageIdx}"]`);
    if (!subDiv) return;

    const isHidden = subDiv.style.display === 'none';
    subDiv.style.display = isHidden ? '' : 'none';
    if (toggle) {
        toggle.style.transform = isHidden ? 'rotate(180deg)' : '';
        toggle.title = isHidden ? '접기' : '펼치기';
    }
}

/**
 * 카드6: 최근 피드백 내역 렌더링 (최근 3건)
 */
function renderRecentFeedback() {
    const container = document.getElementById('recent-feedback-list');
    if (!container) return;

    // StudentGuidanceDataService (guidance-status-data.js)에서 피드백 완료된 것 중 최근 3건
    let feedbacks = [];
    if (typeof STUDENT_GUIDANCE_SUBMISSIONS !== 'undefined') {
        feedbacks = STUDENT_GUIDANCE_SUBMISSIONS
            .filter(s => s.feedbackDate)
            .sort((a, b) => b.feedbackDate.localeCompare(a.feedbackDate))
            .slice(0, 3);
    }

    if (feedbacks.length === 0) {
        container.innerHTML = '<div style="font-size: 13px; color: #9ca3af; padding: 8px 0;">피드백 내역이 없습니다.</div>';
        return;
    }

    container.innerHTML = feedbacks.map((f, i) => `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; ${i < feedbacks.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''} cursor: pointer;"
             onmouseover="this.style.background='#f9fafb';" onmouseout="this.style.background='transparent';"
             onclick="showScreen('guidance-status')">
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 13px; color: #1a1a1a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${f.basicStageName || f.guidanceStage || '-'} - ${f.subStageName || ''}</div>
                <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">${f.professorName || ''}</div>
            </div>
            <span style="font-size: 12px; color: #9ca3af; flex-shrink: 0; margin-left: 8px;">${f.feedbackDate.split(' ')[0]}</span>
        </div>
    `).join('');
}

/**
 * 카드7: 지도예약현황 렌더링 (확정된 예약 최대 3건)
 */
function renderReservationStatus() {
    const container = document.getElementById('reservation-status-list');
    if (!container) return;

    // MEETING_REQUESTS_V3에서 대기/승인/확정 상태 중 다가오는 예약
    let reservations = [];
    if (typeof MEETING_REQUESTS_V3 !== 'undefined') {
        reservations = MEETING_REQUESTS_V3
            .filter(m => m.status === 'confirmed' || m.status === 'approved' || m.status === 'pending')
            .sort((a, b) => {
                const dateA = a.selectedDate || a.date || '';
                const dateB = b.selectedDate || b.date || '';
                return dateA.localeCompare(dateB);
            })
            .slice(0, 3);
    }

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
                    <span style="font-size: 13px; font-weight: 600; color: #1a1a1a;">${r.advisorName || ''}</span>
                    <span style="padding: 2px 8px; background: ${st.bg}; color: ${st.color}; border-radius: 4px; font-size: 11px; font-weight: 600;">${st.label}</span>
                </div>
                <div style="font-size: 13px; color: #1a1a1a; margin-bottom: 4px;">${r.selectedDate || ''}  ${r.selectedTime || ''}${durationText}</div>
                <div style="font-size: 12px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.topic || ''}</div>
            </div>
        `;
    }).join('');
}

/**
 * 새 대시보드 초기화 (PPT 레이아웃)
 */
function initNewDashboard() {
    renderAdminNoticeCard();
    renderBoardNoticeCard();
    renderAlertCard();
    renderRequirementsChips();
    renderVerticalJourney();
    renderRecentFeedback();
    renderReservationStatus();

    console.log('New dashboard initialized (PPT layout)');
}

// DOM 로드 완료 시 새 대시보드 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 새 대시보드 요소가 있으면 새 대시보드 초기화
    if (document.getElementById('vertical-journey')) {
        initNewDashboard();
    } else {
        // 기존 대시보드 요소가 있으면 기존 초기화
        initDashboard();
    }
});

// 전역 export (새 함수들)
window.initNewDashboard = initNewDashboard;
window.renderAdminNoticeCard = renderAdminNoticeCard;
window.renderBoardNoticeCard = renderBoardNoticeCard;
window.renderAlertCard = renderAlertCard;
window.renderRequirementsChips = renderRequirementsChips;
window.renderVerticalJourney = renderVerticalJourney;
window.renderRecentFeedback = renderRecentFeedback;
window.renderReservationStatus = renderReservationStatus;
window.toggleJourneyStage = toggleJourneyStage;
