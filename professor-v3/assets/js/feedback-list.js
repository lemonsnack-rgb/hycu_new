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
        <div class="table-container">
            <!-- 테이블 헤더: 타이틀(건수) + 액션버튼 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">논문 지도 활동</h3>
                    <span class="table-count">(총 ${filteredRequests.length}건)</span>
                </div>
                <div class="table-header-right">
                    <button onclick="sendNotificationToSelected()"
                            class="btn btn-primary btn-sm">
                        <span class="icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </span>
                        선택한 학생에게 알림 발송
                    </button>
                </div>
            </div>
            <div class="table-scroll" style="overflow-x: auto;">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th style="width: 50px; text-align: center;">
                                    <input type="checkbox"
                                           id="select-all-feedbacks"
                                           onchange="toggleAllFeedbacks(this)"
                                           class="rounded">
                                </th>
                                <th style="width: 60px; text-align: center;">순번</th>
                                <th style="width: 80px; text-align: center;">학년도</th>
                                <th style="width: 60px; text-align: center;">학기</th>
                                <th style="width: 100px; text-align: center;">대학구분</th>
                                <th style="width: 100px; text-align: center;">계열/대학원</th>
                                <th style="width: 120px; text-align: center;">학부(과)전공</th>
                                <th style="width: 150px; text-align: center;">학과/전공</th>
                                <th style="width: 80px; text-align: center;">학위과정</th>
                                <th style="width: 80px; text-align: center;">학적상태</th>
                                <th style="width: 90px; text-align: center;">학번</th>
                                <th style="width: 80px; text-align: center;">성명</th>
                                <th style="min-width: 250px; text-align: center;">논문명</th>
                                <th style="width: 120px; text-align: center;">제출일시</th>
                                <th style="width: 120px; text-align: center;">피드백 희망일자</th>
                                <th style="width: 100px; text-align: center;">기본단계</th>
                                <th style="width: 120px; text-align: center;">세부단계</th>
                                <th style="width: 100px; text-align: center;">피드백상태</th>
                            </tr>
                        </thead>
                        <tbody id="feedback-list-body">
                            ${filteredRequests.length > 0
                                ? filteredRequests.map((req, idx) => renderFeedbackRow(req, idx + 1)).join('')
                                : '<tr><td colspan="17" style="text-align: center; padding: 24px 12px;">검색 결과가 없습니다</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
            </div>
    `;
}

// ==================== 제출물 행 렌더링 (ID 38, 48) ====================
function renderFeedbackRow(request, idx) {
    // ID 48: 피드백 상태 로직
    // 대기: 코멘트 0건
    // 진행: 코멘트 1건 이상, 완료 버튼 누르지 않음
    // 완료: 명시적으로 완료 버튼 클릭
    const commentCount = request.commentCount || 0;
    let feedbackStatus;

    if (request.isCompleted) {
        feedbackStatus = '완료';
    } else if (commentCount > 0) {
        feedbackStatus = '진행';
    } else {
        feedbackStatus = '대기';
    }

    // 학적상태 텍스트 변환
    const statusText = request.status === 'active' ? '재학' :
                       request.status === 'leave' ? '휴학' :
                       request.status === 'completed' ? '수료' :
                       request.status === 'graduated' ? '졸업' : '재학';

    return `
        <tr class="feedback-row cursor-pointer"
            data-feedback-id="${request.id}"
            onclick="openFeedbackDetailScreen('${request.id}')">
            <td onclick="event.stopPropagation()" style="text-align: center;">
                <input type="checkbox"
                       class="feedback-checkbox rounded"
                       data-feedback-id="${request.id}"
                       data-student-name="${request.studentName}"
                       data-student-number="${request.studentNumber}">
            </td>
            <td style="text-align: center;">${idx}</td>
            <td style="text-align: center;">${request.year || '2025'}</td>
            <td style="text-align: center;">${request.semester || '1'}</td>
            <td style="text-align: center;">${request.graduate || '일반대학원'}</td>
            <td style="text-align: center;">${request.college || '공학계열'}</td>
            <td style="text-align: center;">${request.undergraduate || request.major || '-'}</td>
            <td style="text-align: center;">${request.major}</td>
            <td style="text-align: center;">${request.program}</td>
            <td style="text-align: center;">${statusText}</td>
            <td style="text-align: center;">${request.studentNumber}</td>
            <td style="text-align: center;">
                ${addStudentInfoIcon(request.studentName, request.studentNumber)}
            </td>
            <td style="text-align: left; padding-left: 12px;">
                <div class="cell-truncate" title="${request.thesisTitle || request.file}">
                    ${request.thesisTitle || request.file}
                </div>
            </td>
            <td style="text-align: center;">${request.uploadDate || '-'}</td>
            <td style="text-align: center;">${request.desiredDate || '-'}</td>
            <td style="text-align: center;">${request.basicStageName || request.guidanceStage || '-'}</td>
            <td style="text-align: center;">${request.subStageName || '-'}</td>
            <td style="text-align: center;">
                ${feedbackStatus}
            </td>
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
            <a href="#" onclick="showPlagiarismReport('통합', event)" class="text-[#6A0028] hover:underline text-xs">
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
                class="icon-btn-info"
                title="학생 정보 보기">
            <i class="fas fa-info-circle"></i>
        </button>
    `;
}

function showStudentInfo(studentNumber) {
    // API 호출 예시
    console.log('API 호출: /api/student/info/' + studentNumber);

    // 임시 얼럿 처리
    alert(`학생 정보 조회\n\n학번: ${studentNumber}\n\n※ 실제 구현 시 API 연동 및 상세 정보 표시`);
}

window.addStudentInfoIcon = addStudentInfoIcon;
window.showStudentInfo = showStudentInfo;

// ==================== 검색 기능 ====================
function getCurrentFeedbackFilters() {
    return {
        year: document.getElementById('feedback-filter-year')?.value || '',
        semester: document.getElementById('feedback-filter-semester')?.value || '',
        universityType: document.getElementById('feedback-filter-university-type')?.value || '',
        college: document.getElementById('feedback-filter-college')?.value || '',
        undergraduate: document.getElementById('feedback-filter-undergraduate')?.value || '',
        major: document.getElementById('feedback-filter-major')?.value || '',
        degree: document.getElementById('feedback-filter-degree')?.value || '',
        status: document.getElementById('feedback-filter-status')?.value || '',
        studentId: document.getElementById('feedback-filter-student-id')?.value || '',
        studentName: document.getElementById('feedback-filter-student-name')?.value || '',
        feedbackStatus: document.getElementById('feedback-filter-feedback-status')?.value || ''
    };
}

function filterFeedbackRequests(requests, filters) {
    return requests.filter(req => {
        // 학년도 필터
        if (filters.year && req.year !== filters.year) {
            return false;
        }

        // 학기 필터
        if (filters.semester && req.semester !== filters.semester) {
            return false;
        }

        // 대학구분 필터
        if (filters.universityType && req.graduate !== filters.universityType) {
            return false;
        }

        // 계열/대학원 필터
        if (filters.college && req.college !== filters.college) {
            return false;
        }

        // 학부(과)전공 필터
        if (filters.undergraduate && req.undergraduate !== filters.undergraduate) {
            return false;
        }

        // 학과/전공 필터
        if (filters.major && req.major !== filters.major) {
            return false;
        }

        // 학위과정 필터
        if (filters.degree && req.program !== filters.degree) {
            return false;
        }

        // 학적상태 필터
        if (filters.status) {
            const statusText = req.status === 'active' ? '재학' :
                             req.status === 'leave' ? '휴학' :
                             req.status === 'completed' ? '수료' :
                             req.status === 'graduated' ? '졸업' : '재학';

            if (statusText !== filters.status) {
                return false;
            }
        }

        // 학번 필터 (분리)
        if (filters.studentId) {
            const studentNumber = req.studentNumber || '';
            if (!studentNumber.includes(filters.studentId)) {
                return false;
            }
        }

        // 성명 필터 (분리)
        if (filters.studentName) {
            const studentName = req.studentName || '';
            if (!studentName.includes(filters.studentName)) {
                return false;
            }
        }

        // 피드백상태 필터
        if (filters.feedbackStatus) {
            const commentCount = req.commentCount || 0;
            let currentStatus;
            if (req.isCompleted) {
                currentStatus = '완료';
            } else if (commentCount > 0) {
                currentStatus = '진행중';
            } else {
                currentStatus = '대기';
            }

            if (currentStatus !== filters.feedbackStatus) {
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
    // 모든 검색 필터 초기화
    const filterIds = [
        'feedback-filter-year',
        'feedback-filter-semester',
        'feedback-filter-university-type',
        'feedback-filter-college',
        'feedback-filter-undergraduate',
        'feedback-filter-major',
        'feedback-filter-degree',
        'feedback-filter-status',
        'feedback-filter-student-id',
        'feedback-filter-student-name',
        'feedback-filter-feedback-status'
    ];

    filterIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });

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
