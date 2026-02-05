// ===================================
// 대시보드 화면 로직
// ===================================

// 대시보드 초기화 (ID 30: 간소화 - 카드와 처리대기만)
function initDashboard() {
    renderSummaryCards();
    renderTodoList();
    // ID 30: 최근활동, 학생단계별 현황 삭제
    // renderActivityTimeline();
    // renderStageChart();
}

// 요약 카드 렌더링 (ID 30: 3개만 표시, ID 31: 긴급 레이블 삭제)
function renderSummaryCards() {
    const stats = DataService.getDashboardStats();
    const students = DataService.getStudents();
    const notifications = DataService.getNotifications();
    const pendingCount = notifications.filter(n => !n.isRead).length;
    
    const cards = [
        {
            icon: '👥',
            title: '총 지도학생',
            value: students.length,
            color: 'primary'
        },
        {
            icon: '📝',
            title: '진행 중',
            value: stats.activeStudents,
            color: 'success'
        },
        {
            icon: '⏰',
            title: '처리 대기',
            value: pendingCount,
            color: 'warning'
        }
    ];
    
    const html = cards.map(card => `
        <div class="summary-card">
            <div class="summary-card-header">
                <div>
                    <div class="summary-card-title">${card.title}</div>
                </div>
                <div class="summary-card-icon">${card.icon}</div>
            </div>
            <div class="summary-card-value">${card.value}</div>
        </div>
    `).join('');
    
    const container = document.getElementById('summary-cards');
    if (container) container.innerHTML = html;
}

// To-Do 목록 렌더링
function renderTodoList() {
    const notifications = DataService.getNotifications();
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    // 우선순위별 정렬 (urgent > high > normal > low)
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const sortedNotifications = [...unreadNotifications].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    const todoList = document.getElementById('todo-list');
    const todoCount = document.getElementById('todo-count');

    if (!todoList) return;

    if (sortedNotifications.length === 0) {
        todoList.innerHTML = `
            <div class="text-center text-gray-500" style="padding: 2rem;">
                <div style="font-size: 48px; margin-bottom: 1rem;">✓</div>
                <p>처리할 사항이 없습니다</p>
            </div>
        `;
        if (todoCount) todoCount.textContent = '0';
        return;
    }

    const html = sortedNotifications.map(notif => `
        <div class="todo-item" onclick="handleNotificationClick('${notif.id}', '${notif.actionUrl}')">
            <div class="todo-priority">${notif.icon}</div>
            <div class="todo-content">
                <div class="todo-title">${notif.message}</div>
                <div class="todo-meta">
                    <span class="badge ${getPriorityBadgeClass(notif.priority)}">${getPriorityText(notif.priority)}</span>
                    <span style="margin-left: 8px;">${getRelativeTime(notif.timestamp)}</span>
                </div>
            </div>
        </div>
    `).join('');

    todoList.innerHTML = html;
    if (todoCount) todoCount.textContent = sortedNotifications.length;
}

// 우선순위 텍스트
function getPriorityText(priority) {
    const texts = {
        urgent: '긴급',
        high: '높음',
        normal: '보통',
        low: '낮음'
    };
    return texts[priority] || priority;
}

// 최근 활동 타임라인 렌더링
function renderActivityTimeline() {
    // 다양한 활동 생성 (Mock)
    const activities = [
        {
            icon: '📝',
            title: '김철수 학생 주차별 계획 승인',
            time: '2025-11-03 14:30',
            type: 'plan'
        },
        {
            icon: '💬',
            title: '이영희 학생 논문 피드백 전송',
            time: '2025-11-03 10:15',
            type: 'feedback'
        },
        {
            icon: '✅',
            title: '박민수 학생 중간논문 심사 완료',
            time: '2025-11-02 16:20',
            type: 'review'
        },
        {
            icon: '📅',
            title: '정수진 학생 미팅 완료',
            time: '2025-11-02 14:00',
            type: 'meeting'
        },
        {
            icon: '📄',
            title: '최민지 학생 논문 제출 확인',
            time: '2025-11-01 09:30',
            type: 'document'
        }
    ];
    
    const html = activities.map((activity, index) => `
        <div style="display: flex; gap: 12px; margin-bottom: ${index < activities.length - 1 ? '1rem' : '0'};">
            <div style="font-size: 24px; flex-shrink: 0;">${activity.icon}</div>
            <div style="flex: 1;">
                <div style="font-weight: 500; color: var(--gray-900); margin-bottom: 4px;">
                    ${activity.title}
                </div>
                <div style="font-size: 12px; color: var(--gray-500);">
                    ${getRelativeTime(activity.time)}
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('activity-timeline').innerHTML = html;
}

// 단계별 현황 차트 렌더링 (간단한 바 차트)
function renderStageChart() {
    const stats = DataService.getDashboardStats();
    const distribution = stats.stageDistribution;
    
    const stages = [
        { key: 'plan', label: '연구계획서', value: distribution.plan, color: '#3b82f6' },
        { key: 'mid', label: '중간논문', value: distribution.mid, color: '#10b981' },
        { key: 'final', label: '최종논문', value: distribution.final, color: '#f59e0b' }
    ];
    
    const total = stages.reduce((sum, stage) => sum + stage.value, 0);
    const maxValue = Math.max(...stages.map(s => s.value));
    
    const html = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${stages.map(stage => {
                const percentage = total > 0 ? (stage.value / maxValue * 100) : 0;
                return `
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: 500; color: var(--gray-700);">${stage.label}</span>
                            <span style="font-weight: 600; color: var(--gray-900);">${stage.value}명</span>
                        </div>
                        <div style="background: var(--gray-200); height: 32px; border-radius: 8px; overflow: hidden; position: relative;">
                            <div style="
                                background: ${stage.color};
                                height: 100%;
                                width: ${percentage}%;
                                border-radius: 8px;
                                transition: width 0.5s ease;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: 600;
                                font-size: 14px;
                            ">
                                ${stage.value > 0 ? Math.round(stage.value / total * 100) + '%' : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: var(--gray-900);">전체</span>
                <span style="font-weight: 700; font-size: 20px; color: var(--primary);">${total}명</span>
            </div>
        </div>
    `;
    
    document.getElementById('stage-chart').innerHTML = html;
}

// 새로고침 함수
function refreshDashboard() {
    showLoading();
    
    simulateApiCall(() => {
        hideLoading();
        initDashboard();
        showToast('대시보드가 새로고침되었습니다', 'success');
    }, 800);
}

// 아웃링크 데이터 (URL은 추후 지정)
const outlinks = [
    { id: 1, title: '아웃링크 1', description: '관련 사이트 설명', url: '#outlink1' },
    { id: 2, title: '아웃링크 2', description: '관련 사이트 설명', url: '#outlink2' },
    { id: 3, title: '아웃링크 3', description: '관련 사이트 설명', url: '#outlink3' },
];

/**
 * 아웃링크 카드 렌더링
 */
function renderOutlinkCards() {
    const container = document.getElementById('outlink-cards');
    if (!container) return;

    container.innerHTML = outlinks.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer"
           style="display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 6px; padding: 12px 16px; text-decoration: none; transition: all 0.2s;"
           onmouseover="this.style.background='#F1F5F9'; this.style.borderColor='#6A0028';"
           onmouseout="this.style.background='#F8FAFC'; this.style.borderColor='#E5E7EB';">
            <div>
                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a;">${link.title}</div>
                <div style="font-size: 12px; color: #6b7280;">${link.description}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A0028" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        </a>
    `).join('');
}

// DOMContentLoaded에서 아웃링크 렌더링
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('outlink-cards')) {
        renderOutlinkCards();
    }
});

// 전역으로 export
window.initDashboard = initDashboard;
window.refreshDashboard = refreshDashboard;
window.renderSummaryCards = renderSummaryCards;
window.renderTodoList = renderTodoList;
window.renderActivityTimeline = renderActivityTimeline;
window.renderStageChart = renderStageChart;
window.renderOutlinkCards = renderOutlinkCards;
