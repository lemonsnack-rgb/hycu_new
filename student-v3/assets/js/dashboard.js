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
            dday: 'D-15',
            date: '2024-12-20 17:00',
            location: ''
        },
        {
            id: 2,
            title: '학위논문 심사 일정',
            dday: 'D-20',
            date: '2024-12-25 14:00',
            location: ''
        },
        {
            id: 3,
            title: '겨울방학 시작',
            dday: 'D-27',
            date: '2025-01-02 00:00',
            location: ''
        }
    ],

    // 실시간 지도 예약 현황
    meetingSchedules: [
        {
            id: 1,
            title: '김철수 교수',
            dday: 'D-3',
            date: '2024-11-28 10:00',
            location: ''
        },
        {
            id: 2,
            title: '이영희 교수',
            dday: 'D-6',
            date: '2024-12-01 15:00',
            location: ''
        },
        {
            id: 3,
            title: '박지성 교수',
            dday: 'D-10',
            date: '2024-12-05 09:00',
            location: ''
        }
    ],

    // 논문 지도 현황
    feedbackSchedules: [
        {
            id: 1,
            title: '연구계획서',
            dday: '',
            date: '피드백 등록: 2024-11-25 09:30',
            location: ''
        },
        {
            id: 2,
            title: '중간논문',
            dday: '',
            date: '피드백 등록: 2024-11-20 14:15',
            location: ''
        },
        {
            id: 3,
            title: '최종논문',
            dday: '',
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
                ${schedule.dday ? `<div class="schedule-item-dday">${schedule.dday}</div>` : ''}
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
