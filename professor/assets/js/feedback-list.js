// Phase 4: 온라인피드백 관리 - 제출물 목록

// ==================== 제출물 목록 초기화 ====================
function initFeedbackList() {
    console.log('온라인피드백 관리 초기화');
    renderFeedbackList();
}

// ==================== 제출물 목록 렌더링 ====================
function renderFeedbackList() {
    const requests = FeedbackDataService.getFeedbackRequests();
    const contentArea = document.getElementById('online-feedback-content');
    
    if (!contentArea) return;
    
    // 필터링 적용
    const filters = getCurrentFeedbackFilters();
    const filteredRequests = filterFeedbackRequests(requests, filters);
    
    // ID 38: 테이블 컬럼 순서 변경 (제출일 추가)
    contentArea.innerHTML = `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b flex justify-end">
                <button onclick="sendNotificationToSelected()"
                        class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-[#0087c9] text-sm font-semibold flex items-center gap-2">
                    <i class="fas fa-bell"></i>
                    선택한 학생에게 알림 발송
                </button>
            </div>

            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">지도 대상 논문 목록</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50 border-b">
                            <tr>
                                <th class="py-3 px-4 text-center text-sm font-semibold text-gray-800">
                                    <input type="checkbox"
                                           id="select-all-feedbacks"
                                           onchange="toggleAllFeedbacks(this)"
                                           class="rounded">
                                </th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">번호</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">대학원</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">학과</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">학위과정</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">학번</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">이름</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">학기차</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">논문명</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">논문 지도 단계</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">피드백상태</th>
                                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-800">제출일</th>
                            </tr>
                        </thead>
                        <tbody id="feedback-list-body">
                            ${filteredRequests.length > 0
                                ? filteredRequests.map((req, idx) => renderFeedbackRow(req, idx + 1)).join('')
                                : '<tr><td colspan="12" class="py-12 text-center text-gray-500">검색 결과가 없습니다</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// ==================== 제출물 행 렌더링 (ID 38, 48) ====================
function renderFeedbackRow(request, idx) {
    // ID 48: 피드백 상태 로직
    // 대기: 코멘트 0건
    // 진행중: 코멘트 1건 이상, 완료 버튼 누르지 않음
    // 완료: 명시적으로 완료 버튼 클릭
    const commentCount = request.commentCount || 0;
    let feedbackStatus, statusClass;

    if (request.isCompleted) {
        feedbackStatus = '완료';
        statusClass = 'bg-green-100 text-green-700';
    } else if (commentCount > 0) {
        feedbackStatus = '진행중';
        statusClass = 'bg-blue-100 text-blue-700';
    } else {
        feedbackStatus = '대기';
        statusClass = 'bg-gray-100 text-gray-800';
    }

    return `
        <tr class="feedback-row border-b hover:bg-gray-50 transition-colors cursor-pointer"
            data-feedback-id="${request.id}"
            onclick="openFeedbackViewer('${request.id}')">
            <td class="py-3 px-4 text-center" onclick="event.stopPropagation()">
                <input type="checkbox"
                       class="feedback-checkbox rounded"
                       data-feedback-id="${request.id}"
                       data-student-name="${request.studentName}"
                       data-student-number="${request.studentNumber}">
            </td>
            <td class="py-3 px-4 text-gray-800">${idx}</td>
            <td class="py-3 px-4 text-gray-600 text-sm">${request.graduate || '일반대학원'}</td>
            <td class="py-3 px-4 text-gray-600 text-sm">${request.major}</td>
            <td class="py-3 px-4 text-gray-600 text-sm">${request.program}</td>
            <td class="py-3 px-4 text-gray-600 text-sm">${request.studentNumber}</td>
            <td class="py-3 px-4 font-medium text-gray-800">
                ${addStudentInfoIcon(request.studentName, request.studentNumber)}
            </td>
            <td class="py-3 px-4 text-gray-600 text-sm">${request.semester || '-'}학기</td>
            <td class="py-3 px-4 text-gray-800 text-sm td-truncate-long" title="${request.thesisTitle || request.file}">${request.thesisTitle || request.file}</td>
            <td class="py-3 px-4 text-gray-600 text-sm">${request.guidanceStage || '연구계획서'}</td>
            <td class="py-3 px-4">
                <span class="text-xs font-semibold px-2 py-1 rounded-full ${statusClass}">
                    ${feedbackStatus}
                </span>
            </td>
            <td class="py-3 px-4 text-gray-600 text-sm">${request.uploadDate || '-'}</td>
        </tr>
    `;
}

// ==================== 표절률 렌더링 ====================
function renderPlagiarismScore(copyScore, gptScore) {
    const copyNum = parseInt(copyScore);
    const gptNum = parseInt(gptScore);
    
    const copyColor = getCopyScoreColor(copyNum);
    const gptColor = getGptScoreColor(gptNum);
    
    return `
        <div class="text-xs">
            <div>
                <span class="${copyColor} font-semibold">CopyKiller: ${copyScore}</span>
                <span class="text-gray-400 mx-1">/</span>
                <span class="${gptColor} font-semibold">GPT Killer: ${gptScore}</span>
            </div>
            <a href="#" onclick="showPlagiarismReport('통합', event)" class="text-blue-600 hover:underline text-xs">
                결과보고서 보기 <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
}

function getCopyScoreColor(score) {
    if (score >= 15) return 'text-red-600';
    if (score >= 10) return 'text-yellow-600';
    return 'text-gray-800';
}

function getGptScoreColor(score) {
    if (score >= 10) return 'text-red-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-gray-800';
}

// ==================== 표절 리포트 보기 ====================
function showPlagiarismReport(type, event) {
    event.preventDefault();
    const reportType = type === 'copykiller' ? 'CopyKiller' : 'GPT Killer';
    alert(`${reportType} 리포트 보기 기능 (구현 예정)\n\n실제 구현 시:\n- 새 창으로 리포트 페이지 열기\n- 또는 모달로 리포트 표시`);
}

// Export
window.initFeedbackList = initFeedbackList;
window.renderFeedbackList = renderFeedbackList;
window.showPlagiarismReport = showPlagiarismReport;

// ==================== ID 38: 학생 정보 아이콘 추가 ====================
function addStudentInfoIcon(studentName, studentNumber) {
    return `
        ${studentName}
        <button onclick="showStudentInfo('${studentNumber}'); event.stopPropagation();" 
                class="ml-1 text-blue-600 hover:text-blue-800" 
                title="학생 정보 보기">
            <i class="fas fa-info-circle text-xs"></i>
        </button>
    `;
}

function showStudentInfo(studentNumber) {
    alert(`학생 정보\n학번: ${studentNumber}\n(실제 구현 시 상세 모달 표시)`);
}

window.addStudentInfoIcon = addStudentInfoIcon;
window.showStudentInfo = showStudentInfo;

// ==================== 검색 기능 ====================
function getCurrentFeedbackFilters() {
    return {
        graduate: document.getElementById('feedback-filter-graduate')?.value || '',
        program: document.getElementById('feedback-filter-program')?.value || '',
        status: document.getElementById('feedback-filter-status')?.value || '',
        keyword: document.getElementById('feedback-filter-keyword')?.value || ''
    };
}

function filterFeedbackRequests(requests, filters) {
    return requests.filter(req => {
        // 대학원 필터
        if (filters.graduate && req.graduate !== filters.graduate) {
            return false;
        }
        
        // 학위과정 필터
        if (filters.program && req.program !== filters.program) {
            return false;
        }
        
        // 상태 필터
        if (filters.status) {
            const commentCount = req.commentCount || 0;
            let currentStatus;
            if (req.isCompleted) {
                currentStatus = '완료';
            } else if (commentCount > 0) {
                currentStatus = '진행중';
            } else {
                currentStatus = '대기';
            }
            
            if (currentStatus !== filters.status) {
                return false;
            }
        }
        
        // 키워드 검색
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            const searchText = [
                req.studentNumber,
                req.studentName,
                req.thesisTitle || '',
                req.file
            ].join(' ').toLowerCase();
            
            if (!searchText.includes(keyword)) {
                return false;
            }
        }
        
        return true;
    });
}

function searchFeedback() {
    renderFeedbackList();
}

function resetFeedbackSearch() {
    document.getElementById('feedback-filter-graduate').value = '';
    document.getElementById('feedback-filter-program').value = '';
    document.getElementById('feedback-filter-status').value = '';
    document.getElementById('feedback-filter-keyword').value = '';
    renderFeedbackList();
}

// Export
window.searchFeedback = searchFeedback;
window.resetFeedbackSearch = resetFeedbackSearch;

// ==================== 체크박스 전체 선택/해제 ====================
function toggleAllFeedbacks(checkbox) {
    const checkboxes = document.querySelectorAll('.feedback-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
}

// ==================== 선택한 학생에게 알림 발송 ====================
function sendNotificationToSelected() {
    const checkboxes = document.querySelectorAll('.feedback-checkbox:checked');

    if (checkboxes.length === 0) {
        alert('알림을 받을 학생을 선택해주세요.');
        return;
    }

    // 선택된 학생 정보 수집
    const selectedStudents = Array.from(checkboxes).map(cb => ({
        id: cb.dataset.feedbackId,
        name: cb.dataset.studentName,
        studentNumber: cb.dataset.studentNumber
    }));

    // 알림 발송 모달 열기
    openNotificationModal(selectedStudents, () => {
        // 발송 완료 후 체크박스 초기화
        checkboxes.forEach(cb => cb.checked = false);
        const selectAll = document.getElementById('select-all-feedbacks');
        if (selectAll) selectAll.checked = false;
    });
}

// ==================== 알림 발송 모달 (공통) ====================
function openNotificationModal(students, onSuccess) {
    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'notification-modal';

    const studentList = students.map(s => `${s.name} (${s.studentNumber})`).join(', ');

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; width: 90%;">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800">알림 발송</h3>
                    <button onclick="closeNotificationModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
            </div>

            <div class="p-6">
                <!-- 발송 대상 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-800 mb-2">
                        발송 대상 (${students.length}명)
                    </label>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                        <p class="text-sm text-gray-800">${studentList}</p>
                    </div>
                </div>

                <!-- 발송 방법 선택 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-800 mb-2">
                        발송 방법 *
                    </label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="notification-type" value="kakao" checked class="rounded-full">
                            <span class="text-sm text-gray-800">카카오톡</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="notification-type" value="sms" class="rounded-full">
                            <span class="text-sm text-gray-800">SMS</span>
                        </label>
                    </div>
                </div>

                <!-- 메시지 내용 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-800 mb-2">
                        메시지 내용 *
                    </label>
                    <textarea id="notification-message"
                              rows="6"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                              placeholder="발송할 메시지 내용을 입력하세요.&#10;&#10;예시:&#10;온라인 피드백이 완료되었습니다.&#10;확인 후 수정하여 재제출 바랍니다."></textarea>
                    <p class="text-xs text-gray-500 mt-1">
                        <span id="message-length">0</span> / 1000자
                    </p>
                </div>

                <!-- 버튼 -->
                <div class="flex gap-2 justify-end pt-4">
                    <button onclick="closeNotificationModal()" class="btn-cancel">취소</button>
                    <button onclick="submitNotification()" class="btn-primary">발송</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 글자 수 카운터
    const messageInput = document.getElementById('notification-message');
    const lengthDisplay = document.getElementById('message-length');

    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        lengthDisplay.textContent = length;

        if (length > 1000) {
            lengthDisplay.classList.add('text-red-600');
        } else {
            lengthDisplay.classList.remove('text-red-600');
        }
    });

    // 전역 변수에 콜백 저장
    window._notificationCallback = { students, onSuccess };
}

function closeNotificationModal() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
        modal.remove();
    }
    window._notificationCallback = null;
}

function submitNotification() {
    const message = document.getElementById('notification-message').value.trim();
    const notificationType = document.querySelector('input[name="notification-type"]:checked').value;

    if (!message) {
        alert('메시지 내용을 입력해주세요.');
        return;
    }

    if (message.length > 1000) {
        alert('메시지는 1000자를 초과할 수 없습니다.');
        return;
    }

    const { students, onSuccess } = window._notificationCallback;

    // 발송 확인
    const typeText = notificationType === 'kakao' ? '카카오톡' : 'SMS';
    if (!confirm(`${students.length}명의 학생에게 ${typeText}으로 알림을 발송하시겠습니까?`)) {
        return;
    }

    // 기관계로 전달할 데이터 구성
    const notificationData = {
        type: notificationType,
        message: message,
        recipients: students.map(s => ({
            studentId: s.id,
            studentNumber: s.studentNumber,
            studentName: s.name
        })),
        timestamp: new Date().toISOString(),
        sender: 'P001' // 실제로는 현재 로그인한 교수 ID
    };

    // 실제 구현 시에는 기관계 API로 전송
    // fetch('/api/notifications/send', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(notificationData)
    // })

    console.log('기관계로 전송할 알림 데이터:', notificationData);

    alert(`${students.length}명의 학생에게 ${typeText} 알림을 발송했습니다.`);

    closeNotificationModal();

    // 성공 콜백 실행
    if (onSuccess) {
        onSuccess();
    }
}

// Export
window.toggleAllFeedbacks = toggleAllFeedbacks;
window.sendNotificationToSelected = sendNotificationToSelected;
window.openNotificationModal = openNotificationModal;
window.closeNotificationModal = closeNotificationModal;
window.submitNotification = submitNotification;
