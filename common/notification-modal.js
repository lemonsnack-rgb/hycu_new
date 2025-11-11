/**
 * 학생 알림 발송 모달 컴포넌트
 * 체크박스로 선택된 학생들에게 알림을 발송하는 UI 제공
 */

const NotificationModal = {
    /**
     * 선택된 학생 목록
     */
    selectedStudents: [],

    /**
     * 모달이 열려있는지 여부
     */
    isOpen: false,

    /**
     * 알림 발송 모달 열기
     * @param {Array} students - 선택된 학생 목록
     */
    open(students) {
        if (!students || students.length === 0) {
            alert('알림을 발송할 학생을 선택해주세요.');
            return;
        }

        this.selectedStudents = students;
        this.isOpen = true;
        this.render();
    },

    /**
     * 알림 발송 모달 닫기
     */
    close() {
        this.isOpen = false;
        const modal = document.getElementById('notification-modal');
        if (modal) {
            modal.remove();
        }
    },

    /**
     * 모달 UI 렌더링
     */
    render() {
        // 기존 모달이 있으면 제거
        const existingModal = document.getElementById('notification-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 모달 HTML 생성
        const modalHTML = `
            <div id="notification-modal" class="modal-overlay">
                <div class="modal-container notification-modal-content">
                    <div class="modal-header">
                        <h2>
                            <svg class="inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            알림 발송
                        </h2>
                        <button class="btn-close" onclick="NotificationModal.close()">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body">
                        <!-- 발송 대상 학생 목록 -->
                        <div class="form-section">
                            <label class="form-label">
                                <svg class="inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                                발송 대상 학생 (${this.selectedStudents.length}명)
                            </label>
                            <div class="student-list">
                                ${this.renderStudentList()}
                            </div>
                        </div>

                        <!-- 알림 유형 선택 -->
                        <div class="form-section">
                            <label class="form-label">
                                <svg class="inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                                알림 유형 <span class="text-danger">*</span>
                            </label>
                            <div class="notification-type-options">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="notif-type-kakao" checked>
                                    <span class="checkbox-text">
                                        <span class="kakao-icon">💬</span> 카카오톡
                                    </span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="notif-type-sms">
                                    <span class="checkbox-text">
                                        <span class="sms-icon">📱</span> SMS
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- 메시지 입력 -->
                        <div class="form-section">
                            <label class="form-label" for="notif-message">
                                <svg class="inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                메시지 내용 <span class="text-danger">*</span>
                            </label>
                            <textarea
                                id="notif-message"
                                class="form-textarea"
                                rows="5"
                                placeholder="학생들에게 전달할 메시지를 입력하세요."
                                maxlength="1000"
                            ></textarea>
                            <div class="text-right text-sm text-gray-500 mt-1">
                                <span id="message-counter">0</span> / 1000자
                            </div>
                        </div>

                        <!-- 발송 옵션 -->
                        <div class="form-section">
                            <label class="form-label">발송 옵션</label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="notif-option-urgent">
                                <span class="checkbox-text">긴급 알림으로 발송</span>
                            </label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="NotificationModal.close()">
                            취소
                        </button>
                        <button class="btn btn-primary" onclick="NotificationModal.send()">
                            <svg class="inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                            발송하기
                        </button>
                    </div>
                </div>
            </div>
        `;

        // DOM에 추가
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 이벤트 리스너 등록
        this.attachEventListeners();
    },

    /**
     * 선택된 학생 목록 렌더링
     */
    renderStudentList() {
        return this.selectedStudents.map(student => {
            const name = student.studentName || student.성명 || '-';
            const id = student.studentId || student.학번 || '-';
            const phone = student.phone || student.휴대전화 || '-';
            const major = student.major || student.전공 || '-';

            return `
                <div class="student-item">
                    <div class="student-info">
                        <span class="student-name">${name}</span>
                        <span class="student-id">(${id})</span>
                    </div>
                    <div class="student-details">
                        <span class="student-major">${major}</span>
                        <span class="student-phone">${phone}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * 이벤트 리스너 등록
     */
    attachEventListeners() {
        // 메시지 글자 수 카운터
        const messageTextarea = document.getElementById('notif-message');
        const messageCounter = document.getElementById('message-counter');

        if (messageTextarea && messageCounter) {
            messageTextarea.addEventListener('input', function() {
                messageCounter.textContent = this.value.length;
            });
        }

        // 모달 오버레이 클릭 시 닫기
        const modalOverlay = document.getElementById('notification-modal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    NotificationModal.close();
                }
            });
        }

        // ESC 키로 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && NotificationModal.isOpen) {
                NotificationModal.close();
            }
        });
    },

    /**
     * 알림 발송 실행
     */
    async send() {
        try {
            // 입력값 수집
            const kakaoChecked = document.getElementById('notif-type-kakao').checked;
            const smsChecked = document.getElementById('notif-type-sms').checked;
            const message = document.getElementById('notif-message').value.trim();
            const isUrgent = document.getElementById('notif-option-urgent').checked;

            // 유효성 검사
            if (!kakaoChecked && !smsChecked) {
                alert('알림 유형을 선택해주세요.');
                return;
            }

            if (!message) {
                alert('메시지 내용을 입력해주세요.');
                document.getElementById('notif-message').focus();
                return;
            }

            // 확인 메시지
            const confirmMessage = `${this.selectedStudents.length}명의 학생에게 알림을 발송하시겠습니까?\n\n` +
                `- 발송 유형: ${kakaoChecked ? '카카오톡' : ''} ${smsChecked ? 'SMS' : ''}\n` +
                `- 긴급 알림: ${isUrgent ? '예' : '아니오'}`;

            if (!confirm(confirmMessage)) {
                return;
            }

            // 발송 버튼 비활성화 및 로딩 표시
            const sendButton = event.target;
            const originalText = sendButton.innerHTML;
            sendButton.disabled = true;
            sendButton.innerHTML = '<span class="spinner"></span> 발송 중...';

            // NotificationService를 통해 발송
            const result = await NotificationService.sendNotifications(
                this.selectedStudents,
                {
                    kakao: kakaoChecked,
                    sms: smsChecked,
                    message: message,
                    title: isUrgent ? '[긴급] 한양사이버대학교 알림' : '한양사이버대학교 알림',
                    category: isUrgent ? 'urgent' : 'general',
                    senderType: this.getSenderType()
                }
            );

            // 발송 결과 처리
            if (result.success) {
                alert('✅ ' + result.message);
                this.close();

                // 발송 후 콜백 실행 (있는 경우)
                if (this.onSendSuccess) {
                    this.onSendSuccess(result);
                }
            } else {
                alert('❌ ' + result.message);
                sendButton.disabled = false;
                sendButton.innerHTML = originalText;
            }

        } catch (error) {
            console.error('[NotificationModal] 알림 발송 오류:', error);
            alert('알림 발송 중 오류가 발생했습니다. 다시 시도해주세요.');

            // 버튼 복구
            const sendButton = event.target;
            sendButton.disabled = false;
            sendButton.innerHTML = originalText;
        }
    },

    /**
     * 발송자 유형 결정 (현재 페이지 기준)
     */
    getSenderType() {
        const path = window.location.pathname;
        if (path.includes('/professor/')) {
            return 'professor';
        } else if (path.includes('/admin/')) {
            return 'admin';
        }
        return 'unknown';
    },

    /**
     * 발송 성공 후 콜백 함수 설정
     */
    onSendSuccess: null
};

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationModal;
}
