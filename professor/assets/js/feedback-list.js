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
            <div class="p-6 border-b">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">제출물 목록</h2>
                        <p class="text-sm text-gray-600 mt-1">학생들이 제출한 문서를 확인하고 피드백을 작성하세요</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <button onclick="sendNotificationToSelected()"
                                class="bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-[#500020] text-sm font-semibold flex items-center gap-2">
                            <i class="fas fa-bell"></i>
                            선택한 학생에게 알림 발송
                        </button>
                        <div class="text-sm text-gray-600">
                            <span class="font-semibold text-blue-600">${filteredRequests.length}</span>건
                            ${filteredRequests.length !== requests.length ? `(전체 ${requests.length}건)` : ''}
                        </div>
                    </div>
                </div>

                <!-- 검색 영역 (표준화) -->
                <div class="search-container">
                    <div class="search-grid">
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                대학원
                            </label>
                            <select id="feedback-filter-graduate" class="search-select" onchange="searchFeedback()">
                                <option value="">전체</option>
                                <option value="일반대학원">일반대학원</option>
                                <option value="교육대학원">교육대학원</option>
                                <option value="산업대학원">산업대학원</option>
                            </select>
                        </div>
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                학위과정
                            </label>
                            <select id="feedback-filter-program" class="search-select" onchange="searchFeedback()">
                                <option value="">전체</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                            </select>
                        </div>
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                상태
                            </label>
                            <select id="feedback-filter-status" class="search-select" onchange="searchFeedback()">
                                <option value="">전체</option>
                                <option value="대기">대기</option>
                                <option value="진행중">진행중</option>
                                <option value="완료">완료</option>
                            </select>
                        </div>
                        <div class="search-field">
                            <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                키워드
                            </label>
                            <input type="text"
                                   id="feedback-filter-keyword"
                                   placeholder="학번/성명/논문명 검색"
                                   class="search-input"
                                   onkeypress="if(event.key==='Enter') searchFeedback()">
                        </div>
                    </div>
                    <div class="search-buttons">
                        <button onclick="searchFeedback()" class="search-btn search-btn-primary">
                            <i class="fas fa-search"></i>검색
                        </button>
                        <button onclick="resetFeedbackSearch()" class="search-btn search-btn-secondary">
                            <i class="fas fa-redo"></i>초기화
                        </button>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                                <input type="checkbox"
                                       id="select-all-feedbacks"
                                       onchange="toggleAllFeedbacks(this)"
                                       class="rounded">
                            </th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">순번</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">대학원</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">전공</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">학위과정</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">학번</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">성명</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">학기차</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">논문명</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">피드백상태</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">제출일</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">관리</th>
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
    `;
    
    // ID 38: 행 클릭 이벤트 제거 (상세보기 버튼만 사용)
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
        statusClass = 'bg-gray-100 text-gray-700';
    }

    return `
        <tr class="feedback-row border-b hover:bg-gray-50 transition-colors"
            data-feedback-id="${request.id}">
            <td class="py-3 px-4 text-center">
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
            <td class="py-3 px-4 text-gray-700 text-sm">${request.thesisTitle || request.file}</td>
            <td class="py-3 px-4">
                <span class="text-xs font-semibold px-2 py-1 rounded-full ${statusClass}">
                    ${feedbackStatus}
                </span>
            </td>
            <td class="py-3 px-4 text-gray-600 text-sm">${request.uploadDate || '-'}</td>
            <td class="py-3 px-4">
                <button onclick="openFeedbackViewer('${request.id}'); event.stopPropagation();"
                        class="text-[#6A0028] hover:underline text-sm">
                    상세보기
                </button>
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
            <a href="#" onclick="showPlagiarismReport('통합', event)" class="text-blue-600 hover:underline text-xs">
                결과보고서 보기 <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
}

function getCopyScoreColor(score) {
    if (score >= 15) return 'text-red-600';
    if (score >= 10) return 'text-yellow-600';
    return 'text-gray-700';
}

function getGptScoreColor(score) {
    if (score >= 10) return 'text-red-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-gray-700';
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

    // 알림 발송 확인
    const studentList = selectedStudents.map(s => `${s.name} (${s.studentNumber})`).join('\n');
    if (!confirm(`다음 학생들에게 알림을 발송하시겠습니까?\n\n${studentList}\n\n총 ${selectedStudents.length}명`)) {
        return;
    }

    // 실제 구현 시에는 서버로 알림 발송 요청
    // 여기서는 시뮬레이션
    console.log('알림 발송 대상:', selectedStudents);
    alert(`${selectedStudents.length}명의 학생에게 알림을 발송했습니다.`);

    // 체크박스 초기화
    checkboxes.forEach(cb => cb.checked = false);
    const selectAll = document.getElementById('select-all-feedbacks');
    if (selectAll) selectAll.checked = false;
}

// Export
window.toggleAllFeedbacks = toggleAllFeedbacks;
window.sendNotificationToSelected = sendNotificationToSelected;
