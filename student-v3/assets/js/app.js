/**
 * 학생용 애플리케이션 메인 스크립트
 * Version: 20260107001
 */

// 현재 로그인한 학생 정보 (Mock)
const currentStudent = {
    id: 'S2024001',
    name: '홍길동',
    email: 'hong@example.com',
    major: '컴퓨터공학과',
    degree: '석사',
    advisorName: '김교수',
    year: 2024,
    semester: 1
};

// 화면 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('학생용 시스템 초기화');

    // 사용자 정보 표시
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentStudent.name;
    }

    // 알림 초기화
    initNotifications();
});

// 알림 초기화
function initNotifications() {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;

    const notifications = [
        {
            type: 'info',
            title: '논문 피드백이 도착했습니다',
            message: '김교수님께서 연구계획서에 피드백을 남기셨습니다.',
            time: '1시간 전'
        },
        {
            type: 'success',
            title: '주간 지도 기록이 작성되었습니다',
            message: '이번 주 지도 내용이 등록되었습니다.',
            time: '3시간 전'
        },
        {
            type: 'warning',
            title: '제출 기한 알림',
            message: '중간논문 제출 기한이 3일 남았습니다.',
            time: '6시간 전'
        }
    ];

    notificationList.innerHTML = notifications.map(notif => `
        <div class="border-b hover:bg-[#F8FAFC] p-4 cursor-pointer">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-2 h-2 bg-${notif.type === 'info' ? 'blue' : notif.type === 'success' ? 'green' : 'red'}-500 rounded-full mt-2"></div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-[#1A1A1A]">${notif.title}</p>
                    <p class="text-xs text-[#6B7280] mt-1">${notif.message}</p>
                    <p class="text-xs text-[#9CA3AF] mt-1">${notif.time}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// 외부 클릭 시 알림 드롭다운 닫기
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const button = event.target.closest('.layout-v3-utility-icon-btn');

    if (!button && dropdown && !dropdown.classList.contains('hidden')) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    }
});

// 유틸리티 함수들
window.currentStudent = currentStudent;
