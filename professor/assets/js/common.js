// ===================================
// 공통 함수 및 유틸리티
// ===================================

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 상대 시간 표시
function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return formatDate(dateString);
}

// 파일 크기 포맷팅
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 문자열 첫 글자 대문자화
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Toast 알림 표시
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// 모달 관련 함수
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function createModal(title, content, buttons) {
    const modalId = 'modal-' + Date.now();
    const modalHtml = `
        <div id="${modalId}" class="modal-backdrop">
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="hideModal('${modalId}')">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttons.map(btn => `
                        <button class="btn ${btn.className || 'btn-secondary'}" 
                                onclick="${btn.onclick}; hideModal('${modalId}')">
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('modal-container');
    container.innerHTML = modalHtml;
    showModal(modalId);
    
    // 모달 외부 클릭 시 닫기
    document.getElementById(modalId).addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            hideModal(modalId);
        }
    });
}

function confirm(message, onConfirm) {
    createModal('확인', `<p>${message}</p>`, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '확인',
            className: 'btn-primary',
            onclick: typeof onConfirm === 'string' ? onConfirm : ''
        }
    ]);
    
    if (typeof onConfirm === 'function') {
        document.querySelector('.modal-footer .btn-primary').onclick = () => {
            onConfirm();
            hideModal('modal-' + Date.now());
        };
    }
}

// 알림 드롭다운 토글
function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown) {
        createNotificationDropdown();
    } else {
        dropdown.classList.toggle('active');
    }
}

function createNotificationDropdown() {
    const notifications = DataService.getNotifications();
    const unreadCount = DataService.getUnreadNotificationCount();
    
    const dropdownHtml = `
        <div id="notification-dropdown" class="notification-dropdown active">
            <div class="notification-header">
                <h3>알림 <span class="badge badge-danger">${unreadCount}</span></h3>
                <button class="btn-sm btn-secondary" onclick="markAllAsRead()">모두 읽음</button>
            </div>
            <div class="notification-list">
                ${notifications.map(notif => `
                    <div class="notification-item ${notif.isRead ? '' : 'unread'}" 
                         onclick="handleNotificationClick('${notif.id}', '${notif.actionUrl}')">
                        <div class="notification-item-header">
                            <span class="notification-priority">${notif.icon}</span>
                            <span class="notification-time">${getRelativeTime(notif.timestamp)}</span>
                        </div>
                        <div class="notification-message">${notif.message}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 기존 드롭다운 제거
    const existingDropdown = document.getElementById('notification-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }
    
    // 새 드롭다운 추가
    document.body.insertAdjacentHTML('beforeend', dropdownHtml);
    
    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-bell') && !e.target.closest('#notification-dropdown')) {
            const dropdown = document.getElementById('notification-dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });
}

function handleNotificationClick(notificationId, actionUrl) {
    // 알림을 읽음으로 표시
    DataService.markNotificationAsRead(notificationId);
    
    // 배지 업데이트
    updateNotificationBadge();
    
    // 해당 화면으로 이동
    showScreen(actionUrl);
    
    // 드롭다운 닫기
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

function markAllAsRead() {
    const notifications = DataService.getNotifications();
    notifications.forEach(notif => {
        notif.isRead = true;
    });
    
    updateNotificationBadge();
    
    // 드롭다운 닫기
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
    
    showToast('모든 알림을 읽음으로 표시했습니다', 'success');
}

function updateNotificationBadge() {
    const unreadCount = DataService.getUnreadNotificationCount();
    const badge = document.querySelector('.notification-bell .badge');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// API 호출 시뮬레이션
function simulateApiCall(callback, delay = 500) {
    setTimeout(callback, delay);
}

// 로딩 상태 표시
function showLoading() {
    const loadingHtml = `
        <div id="loading-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        ">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 0.5rem;
                text-align: center;
            ">
                <div style="
                    border: 4px solid #f3f4f6;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p>처리 중입니다...</p>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHtml);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// 학위 과정 한글 변환
function getDegreeText(degree) {
    const degrees = {
        'master': '석사',
        'doctor': '박사'
    };
    return degrees[degree] || degree;
}

// 논문 단계 한글 변환
function getStageText(stage) {
    const stages = {
        'plan': '연구계획서',
        'mid': '중간논문',
        'final': '최종논문'
    };
    return stages[stage] || stage;
}

// 상태 배지 클래스 반환
function getStatusBadgeClass(status) {
    const classes = {
        'pending': 'badge-pending',
        'in_progress': 'badge-in-progress',
        'in-progress': 'badge-in-progress',
        'completed': 'badge-completed'
    };
    return classes[status] || 'badge-pending';
}

// 상태 한글 변환
function getStatusText(status) {
    const statuses = {
        'pending': '대기',
        'in_progress': '진행중',
        'in-progress': '진행중',
        'completed': '완료',
        'scheduled': '예정',
        'accepted': '수락됨',
        'rejected': '반려됨'
    };
    return statuses[status] || status;
}

// 우선순위 배지 클래스
function getPriorityBadgeClass(priority) {
    const classes = {
        'urgent': 'badge-urgent',
        'high': 'badge-high',
        'normal': 'badge-normal',
        'low': 'badge-low'
    };
    return classes[priority] || 'badge-normal';
}

// 미팅 방식 한글 변환
function getMethodText(method) {
    const methods = {
        'meeting': '대면',
        'online': '온라인',
        'offline': '대면',
        'zoom': 'Zoom',
        'email': '이메일',
        'phone': '전화'
    };
    return methods[method] || method;
}

// 로컬 스토리지 헬퍼 (실제로는 메모리에만 저장)
const Storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    }
};

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 사용자 메뉴 토글
function toggleUserMenu() {
    const menu = document.getElementById('user-menu-dropdown');
    if (menu) {
        menu.classList.toggle('active');
    } else {
        createUserMenuDropdown();
    }
}

function createUserMenuDropdown() {
    const professor = DataService.getProfessor();
    const menuHtml = `
        <div id="user-menu-dropdown" class="notification-dropdown active" style="width: 250px; right: 20px;">
            <div class="notification-header" style="border-bottom: none;">
                <div>
                    <div style="font-weight: 600;">${professor.name}</div>
                    <div style="font-size: 12px; color: var(--gray-500);">${professor.email}</div>
                </div>
            </div>
            <div class="notification-list">
                <div class="notification-item" onclick="alert('프로필 수정 기능은 구현 예정입니다')">
                    👤 프로필 설정
                </div>
                <div class="notification-item" onclick="alert('비밀번호 변경 기능은 구현 예정입니다')">
                    🔒 비밀번호 변경
                </div>
                <div class="notification-item" onclick="handleLogout()">
                    🚪 로그아웃
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', menuHtml);
    
    // 외부 클릭 시 닫기
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu') && !e.target.closest('#user-menu-dropdown')) {
                const menu = document.getElementById('user-menu-dropdown');
                if (menu) {
                    menu.remove();
                }
            }
        });
    }, 100);
}

// 전역으로 export
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatTime = formatTime;
window.getRelativeTime = getRelativeTime;
window.formatFileSize = formatFileSize;
window.capitalize = capitalize;
window.showToast = showToast;
window.showModal = showModal;
window.hideModal = hideModal;
window.createModal = createModal;
window.confirm = confirm;
window.toggleNotifications = toggleNotifications;
window.handleNotificationClick = handleNotificationClick;
window.markAllAsRead = markAllAsRead;
window.updateNotificationBadge = updateNotificationBadge;
window.simulateApiCall = simulateApiCall;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.getDegreeText = getDegreeText;
window.getStageText = getStageText;
window.getStatusBadgeClass = getStatusBadgeClass;
window.getStatusText = getStatusText;
window.getPriorityBadgeClass = getPriorityBadgeClass;
window.getMethodText = getMethodText;
window.createPagination = createPagination;
window.renderTable = renderTable;
window.validateForm = validateForm;
window.filterArray = filterArray;
window.sortArray = sortArray;
window.Storage = Storage;
window.debounce = debounce;
window.toggleUserMenu = toggleUserMenu;
