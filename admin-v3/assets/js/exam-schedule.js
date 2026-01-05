// ==================== 심사 일정 관리 메인 로직 (admin-v3 확장 버전) ====================

(function() {
    'use strict';

// 전역 변수
let currentFilters = {
    year: '2025',
    semester: '1',
    graduate: '',
    college: '',
    undergraduate: '',
    department: '',
    degree: '',
    academicStatus: '',
    studentNumber: '',
    studentName: '',
    advisorName: '',
    stage: '',
    scheduleStatus: ''
};

let currentAssignmentId = null; // 현재 상세 보기 중인 배정 ID

/**
 * 목록 화면 렌더링
 */
function renderExamScheduleList() {
    console.log('📋 renderExamScheduleList 호출됨');

    // 심사 단계 필터 옵션 로드
    loadStageFilterOptions();

    // 테이블 데이터 렌더링
    filterExamSchedule();
}

/**
 * 심사 단계 필터 옵션 동적 로드
 */
function loadStageFilterOptions() {
    const stageSelect = document.getElementById('filter-stage');
    if (!stageSelect) return;

    const stageNames = getReviewStageNames();

    // 기존 옵션 제거 (전체 제외)
    stageSelect.innerHTML = '<option value="">전체</option>';

    // 동적 옵션 추가
    stageNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        stageSelect.appendChild(option);
    });
}

/**
 * 필터링 및 테이블 렌더링
 */
function filterExamSchedule() {
    console.log('🔍 filterExamSchedule 호출됨');

    // 필터 값 수집 (13개 필드)
    currentFilters.year = document.getElementById('filter-year')?.value || '';
    currentFilters.semester = document.getElementById('filter-semester')?.value || '';
    currentFilters.graduate = document.getElementById('filter-graduate')?.value || '';
    currentFilters.college = document.getElementById('filter-college')?.value || '';
    currentFilters.undergraduate = document.getElementById('filter-undergraduate')?.value || '';
    currentFilters.department = document.getElementById('filter-department')?.value || '';
    currentFilters.degree = document.getElementById('filter-degree')?.value || '';
    currentFilters.academicStatus = document.getElementById('filter-academic-status')?.value || '';
    currentFilters.studentNumber = document.getElementById('filter-student-number')?.value.trim() || '';
    currentFilters.studentName = document.getElementById('filter-student-name')?.value.trim() || '';
    currentFilters.advisorName = document.getElementById('filter-advisor-name')?.value.trim() || '';
    currentFilters.stage = document.getElementById('filter-stage')?.value || '';
    currentFilters.scheduleStatus = document.getElementById('filter-schedule-status')?.value || '';

    console.log('📊 현재 필터:', currentFilters);

    // 데이터 조회
    let data = getExamScheduleListData();
    console.log('📦 전체 데이터 개수:', data.length);

    // 필터 적용
    if (currentFilters.year) {
        data = data.filter(item => item.year === currentFilters.year);
    }

    if (currentFilters.semester) {
        data = data.filter(item => item.semester === currentFilters.semester);
    }

    if (currentFilters.graduate) {
        data = data.filter(item => item.graduate === currentFilters.graduate);
    }

    if (currentFilters.college) {
        data = data.filter(item => item.college === currentFilters.college);
    }

    if (currentFilters.undergraduate) {
        data = data.filter(item => item.undergraduate === currentFilters.undergraduate);
    }

    if (currentFilters.department) {
        data = data.filter(item => item.department === currentFilters.department);
    }

    if (currentFilters.degree) {
        data = data.filter(item => {
            const degreeMap = { 'master': '석사', 'doctor': '박사', 'integrated': '석박통합' };
            return degreeMap[item.degreeType] === currentFilters.degree;
        });
    }

    if (currentFilters.academicStatus) {
        data = data.filter(item => item.academicStatus === currentFilters.academicStatus);
    }

    if (currentFilters.studentNumber) {
        data = data.filter(item => item.studentNumber.includes(currentFilters.studentNumber));
    }

    if (currentFilters.studentName) {
        data = data.filter(item => item.studentName.toLowerCase().includes(currentFilters.studentName.toLowerCase()));
    }

    if (currentFilters.advisorName) {
        data = data.filter(item => item.advisorName && item.advisorName.toLowerCase().includes(currentFilters.advisorName.toLowerCase()));
    }

    if (currentFilters.stage) {
        data = data.filter(item => item.stageName === currentFilters.stage);
    }

    if (currentFilters.scheduleStatus) {
        if (currentFilters.scheduleStatus === 'scheduled') {
            data = data.filter(item => item.hasSchedule);
        } else if (currentFilters.scheduleStatus === 'unscheduled') {
            data = data.filter(item => !item.hasSchedule);
        }
    }

    // 테이블 렌더링
    console.log('✅ 필터링 후 데이터 개수:', data.length);
    renderExamScheduleTable(data);
}

/**
 * 테이블 렌더링 (14개 컬럼)
 */
function renderExamScheduleTable(data) {
    console.log('📋 테이블 렌더링 시작, 데이터:', data.length, '건');

    const tbody = document.getElementById('exam-schedule-table-body');
    const countElement = document.getElementById('exam-schedule-count');

    if (!tbody) {
        console.error('❌ exam-schedule-table-body 요소를 찾을 수 없습니다');
        return;
    }

    // 총 건수 업데이트
    if (countElement) {
        countElement.textContent = data.length;
    }

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="14" style="text-align: center; padding: 2rem; color: #9CA3AF;">
                    조회 결과가 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map((item, index) => {
        const degreeMap = { 'master': '석사', 'doctor': '박사', 'integrated': '석박통합' };
        const degreeText = degreeMap[item.degreeType] || item.degreeType;

        const statusText = item.hasSchedule ? '등록 완료' : '미등록';

        return `
            <tr class="hover:bg-gray-50 cursor-pointer transition-colors"
                onclick="showExamScheduleDetail('${item.assignmentId}')">
                <td class="px-4 py-3 text-sm text-gray-900">${index + 1}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${item.year || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${item.semester ? item.semester + '학기' : '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${item.graduate || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${item.college || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${item.undergraduate || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${item.department}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${degreeText}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${item.academicStatus || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${item.studentNumber}</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">${item.studentName}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${item.advisorName || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${item.stageName}</td>
                <td class="px-4 py-3 text-sm text-gray-800">${statusText}</td>
            </tr>
        `;
    }).join('');
}

/**
 * 상세 화면 표시
 */
function showExamScheduleDetail(assignmentId) {
    currentAssignmentId = assignmentId;

    // 목록 숨기기, 상세 보기
    document.getElementById('exam-schedule-list-view').style.display = 'none';
    document.getElementById('exam-schedule-detail-view').style.display = 'block';

    // 상세 화면 렌더링
    renderExamScheduleDetail(assignmentId);
}

/**
 * 목록으로 돌아가기
 */
function backToExamScheduleList() {
    currentAssignmentId = null;

    document.getElementById('exam-schedule-detail-view').style.display = 'none';
    document.getElementById('exam-schedule-list-view').style.display = 'block';

    // 목록 새로고침
    filterExamSchedule();
}

/**
 * 상세 화면 렌더링 (admin-v3 디자인 적용)
 */
function renderExamScheduleDetail(assignmentId) {
    const assignment = mockCommitteeAssignments.find(a => a.id === assignmentId);
    if (!assignment) {
        alert('배정 정보를 찾을 수 없습니다.');
        backToExamScheduleList();
        return;
    }

    const schedule = getScheduleByAssignmentId(assignmentId);
    const thesisTitle = getThesisTitleByReviewTargetId(assignment.reviewTargetId);

    const isEdit = !!schedule;
    const detailView = document.getElementById('exam-schedule-detail-view');

    const degreeMap = { 'master': '석사', 'doctor': '박사', 'integrated': '석박통합' };
    const degreeText = degreeMap[assignment.degreeType] || assignment.degreeType;

    // 심사위원 목록 HTML 생성 (5열 그리드, 괄호로 역할 표시)
    const membersHTML = assignment.members.map(m => {
        const roleText = m.role === 'chair' ? '위원장' : '위원';
        return `
            <div class="p-3 bg-gray-50 rounded-lg text-center">
                <div class="text-sm font-medium text-gray-900">${m.professorName} (${roleText})</div>
            </div>
        `;
    }).join('');

    detailView.innerHTML = `
        <div class="review-detail-content-wrapper">
            <!-- 헤더 -->
            <div class="review-detail-header" style="padding: 12px 24px;">
                <button onclick="backToExamScheduleList()" class="back-to-list-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    목록으로 돌아가기
                </button>
            </div>

            <!-- 본문 -->
            <div class="review-detail-body">
                <div class="bg-white rounded-lg shadow-md mb-6">
                    <!-- 학생 정보 -->
                    <div class="px-6 py-4 border-b bg-gray-50">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">학생 정보</h4>
                        <div class="grid grid-cols-4 gap-x-6 gap-y-3 text-sm">
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">대학구분:</span>
                                <span class="text-gray-900 font-medium">일반대학원</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">계열/대학원:</span>
                                <span class="text-gray-900 font-medium">${assignment.graduateSchool || '일반대학원'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학부(과)전공:</span>
                                <span class="text-gray-900 font-medium">${assignment.major || assignment.department}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학과/전공:</span>
                                <span class="text-gray-900 font-medium">${assignment.department}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학위과정:</span>
                                <span class="text-gray-900 font-medium">${degreeText}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학적상태:</span>
                                <span class="text-gray-900 font-medium">재학</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">학번:</span>
                                <span class="text-gray-900 font-medium">${assignment.studentNumber}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">성명:</span>
                                <span class="text-gray-900 font-medium">${assignment.studentName}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">지도교수명:</span>
                                <span class="text-gray-900 font-medium">${assignment.advisorName || '-'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 논문 정보 -->
                    <div class="px-6 py-4 bg-white border-b">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">논문 정보</h4>
                        <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                            <div class="col-span-3 flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">논문 제목:</span>
                                <span class="text-gray-900 font-medium flex-1">${thesisTitle}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">제출일:</span>
                                <span class="text-gray-900 font-medium">${assignment.submissionDate || '-'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">심사 희망일:</span>
                                <span class="text-gray-900 font-medium">${assignment.dueDate || '-'}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-gray-600 min-w-[80px]">심사 단계:</span>
                                <span class="text-gray-900 font-medium">${assignment.stageName}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 심사위원 정보 -->
                    <div class="px-6 py-4 bg-white border-b">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">심사위원 정보</h4>
                        <div class="grid grid-cols-5 gap-3">
                            ${membersHTML}
                        </div>
                    </div>
                </div>

                <!-- 일정 등록 폼 -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <form id="exam-schedule-form" onsubmit="saveExamSchedule(event)">

                    <!-- 일정 정보 -->
                    <div class="mb-6">
                        <h4 class="font-bold text-gray-800 mb-3">일정 정보</h4>

                        <div class="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    심사 날짜 <span class="text-red-600">*</span>
                                </label>
                                <input type="date"
                                       id="exam-date"
                                       value="${schedule?.examDate || ''}"
                                       min="${getTodayString()}"
                                       required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A0028] focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    심사 시간 <span class="text-red-600">*</span>
                                </label>
                                <input type="time"
                                       id="exam-time"
                                       value="${schedule?.examTime || ''}"
                                       required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A0028] focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    소요 시간 (분) <span class="text-red-600">*</span>
                                </label>
                                <select id="exam-duration"
                                        required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A0028] focus:border-transparent">
                                    <option value="30" ${schedule?.duration === 30 ? 'selected' : ''}>30분</option>
                                    <option value="60" ${schedule?.duration === 60 ? 'selected' : ''}>60분</option>
                                    <option value="90" ${schedule?.duration === 90 ? 'selected' : ''}>90분</option>
                                    <option value="120" ${schedule?.duration === 120 ? 'selected' : ''}>120분</option>
                                </select>
                            </div>
                        </div>

                        <!-- 충돌 경고 영역 -->
                        <div id="conflict-warning" class="mb-4"></div>
                    </div>

                    <!-- 진행 방식 -->
                    <div class="mb-6">
                        <h4 class="font-bold text-gray-800 mb-3">진행 방식</h4>

                        <div class="flex gap-4 mb-4">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio"
                                       name="exam-method"
                                       value="online"
                                       ${!schedule || schedule.method === 'online' ? 'checked' : ''}
                                       onchange="toggleMethodFields()"
                                       class="mr-2">
                                <span class="text-sm font-medium text-gray-700">온라인 (Zoom)</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio"
                                       name="exam-method"
                                       value="offline"
                                       ${schedule?.method === 'offline' ? 'checked' : ''}
                                       onchange="toggleMethodFields()"
                                       class="mr-2">
                                <span class="text-sm font-medium text-gray-700">오프라인</span>
                            </label>
                        </div>

                        <!-- 온라인 정보 -->
                        <div id="online-fields" style="display: ${!schedule || schedule.method === 'online' ? 'block' : 'none'};">
                            <!-- 링크 생성 버튼 -->
                            <div class="mb-3">
                                <button type="button"
                                        id="create-zoom-link-btn"
                                        onclick="createZoomMeetingUI()"
                                        ${!schedule && 'disabled'}
                                        class="px-4 py-2 bg-[#6A0028] text-white rounded hover:bg-[#8A0034] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                                    <i class="fas fa-video mr-1"></i> ${schedule?.onlineInfo ? '재생성' : '링크 생성'}
                                </button>
                                <p class="text-xs text-gray-500 mt-1">※ 심사 날짜와 시간을 먼저 입력하세요</p>
                            </div>

                            <!-- 생성된 링크 정보 -->
                            <div id="zoom-link-info" style="display: ${schedule?.onlineInfo ? 'block' : 'none'};" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h5 class="font-medium text-gray-800 mb-3">생성된 Zoom 회의 정보</h5>
                                <div class="space-y-2 text-sm">
                                    <div class="flex items-start">
                                        <span class="text-gray-600 w-28 flex-shrink-0">미팅 ID:</span>
                                        <span id="display-meeting-id" class="font-medium break-all">${schedule?.onlineInfo?.meetingId || ''}</span>
                                    </div>
                                    <div class="flex items-start">
                                        <span class="text-gray-600 w-28 flex-shrink-0">비밀번호:</span>
                                        <span id="display-meeting-password" class="font-medium">${schedule?.onlineInfo?.password || ''}</span>
                                    </div>
                                    <div class="flex items-start">
                                        <span class="text-gray-600 w-28 flex-shrink-0">참가 링크:</span>
                                        <a id="display-meeting-url"
                                           href="${schedule?.onlineInfo?.meetingUrl || '#'}"
                                           target="_blank"
                                           class="text-blue-600 hover:underline break-all flex-1">${schedule?.onlineInfo?.meetingUrl || ''}</a>
                                    </div>
                                    <div class="flex items-start">
                                        <span class="text-gray-600 w-28 flex-shrink-0">호스트 링크:</span>
                                        <a id="display-host-url"
                                           href="${schedule?.onlineInfo?.hostUrl || '#'}"
                                           target="_blank"
                                           class="text-blue-600 hover:underline break-all flex-1">${schedule?.onlineInfo?.hostUrl || ''}</a>
                                    </div>
                                </div>
                                <p class="text-xs text-gray-500 mt-3 pt-3 border-t border-blue-300">
                                    <i class="fas fa-info-circle mr-1"></i> 생성된 링크 정보는 수정할 수 없습니다
                                </p>
                            </div>

                            <!-- 숨겨진 필드 (저장용) -->
                            <input type="hidden" id="meeting-id" value="${schedule?.onlineInfo?.meetingId || ''}">
                            <input type="hidden" id="meeting-password" value="${schedule?.onlineInfo?.password || ''}">
                            <input type="hidden" id="meeting-url" value="${schedule?.onlineInfo?.meetingUrl || ''}">
                            <input type="hidden" id="host-url" value="${schedule?.onlineInfo?.hostUrl || ''}">
                        </div>

                        <!-- 오프라인 정보 -->
                        <div id="offline-fields" style="display: ${schedule?.method === 'offline' ? 'block' : 'none'};">
                            <div class="flex items-center gap-4">
                                <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                                    장소 <span class="text-red-600">*</span>
                                </label>
                                <input type="text"
                                       id="offline-location"
                                       value="${schedule?.offlineInfo?.location || ''}"
                                       placeholder="예: 제1공학관 301호"
                                       class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A0028] focus:border-transparent">
                            </div>
                        </div>
                    </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end pt-4 border-t">
                            <div class="flex gap-2">
                                <button type="button"
                                        onclick="backToExamScheduleList()"
                                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                    취소
                                </button>
                                <button type="submit"
                                        class="px-4 py-2 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034]">
                                    <i class="fas fa-save mr-1"></i> 저장
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // 날짜/시간 변경 시 충돌 체크 및 링크 생성 버튼 활성화
    const examDateInput = document.getElementById('exam-date');
    const examTimeInput = document.getElementById('exam-time');
    const examDurationInput = document.getElementById('exam-duration');

    [examDateInput, examTimeInput, examDurationInput].forEach(input => {
        if (input) {
            input.addEventListener('change', () => {
                checkConflictOnChange();
                updateZoomLinkButtonState();
            });
        }
    });

    // 진행 방식 변경 시에도 버튼 상태 업데이트
    document.querySelectorAll('input[name="exam-method"]').forEach(radio => {
        radio.addEventListener('change', updateZoomLinkButtonState);
    });

    // 초기 버튼 상태 설정
    updateZoomLinkButtonState();
}

/**
 * 날짜/시간 변경 시 충돌 체크
 */
function checkConflictOnChange() {
    const examDate = document.getElementById('exam-date').value;
    const examTime = document.getElementById('exam-time').value;
    const duration = parseInt(document.getElementById('exam-duration').value);

    if (!examDate || !examTime || !duration) {
        return;
    }

    const assignment = mockCommitteeAssignments.find(a => a.id === currentAssignmentId);
    if (!assignment) return;

    const schedule = getScheduleByAssignmentId(currentAssignmentId);
    const excludeScheduleId = schedule?.scheduleId || null;

    const conflictResult = checkScheduleConflict(
        examDate,
        examTime,
        duration,
        assignment.members,
        excludeScheduleId
    );

    const conflictWarning = document.getElementById('conflict-warning');
    if (conflictResult.hasConflict) {
        conflictWarning.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="flex-1">
                        <h5 class="font-medium text-yellow-900 mb-2">심사위원 일정 충돌</h5>
                        ${generateConflictWarningHTML(conflictResult.conflicts)}
                    </div>
                </div>
            </div>
        `;
    } else {
        conflictWarning.innerHTML = '';
    }
}

/**
 * 링크 생성 버튼 활성화 상태 업데이트
 */
function updateZoomLinkButtonState() {
    const examDate = document.getElementById('exam-date')?.value;
    const examTime = document.getElementById('exam-time')?.value;
    const method = document.querySelector('input[name="exam-method"]:checked')?.value;
    const createBtn = document.getElementById('create-zoom-link-btn');

    if (createBtn && method === 'online') {
        createBtn.disabled = !(examDate && examTime);
    }
}

/**
 * 진행 방식 필드 토글
 */
function toggleMethodFields() {
    const method = document.querySelector('input[name="exam-method"]:checked').value;

    const onlineFields = document.getElementById('online-fields');
    const offlineFields = document.getElementById('offline-fields');

    if (method === 'online') {
        onlineFields.style.display = 'block';
        offlineFields.style.display = 'none';
    } else {
        onlineFields.style.display = 'none';
        offlineFields.style.display = 'block';
    }
}

/**
 * Zoom 미팅 자동 생성
 */
async function createZoomMeetingUI() {
    const examDate = document.getElementById('exam-date').value;
    const examTime = document.getElementById('exam-time').value;
    const duration = parseInt(document.getElementById('exam-duration').value);

    if (!examDate || !examTime) {
        alert('심사 날짜와 시간을 먼저 입력해주세요.');
        return;
    }

    const assignment = mockCommitteeAssignments.find(a => a.id === currentAssignmentId);
    if (!assignment) return;

    const confirmMsg = 'Zoom 미팅을 생성하시겠습니까?\n\n' +
        '기존 미팅 정보가 있다면 삭제되고 새로운 미팅이 생성됩니다.';

    if (!confirm(confirmMsg)) return;

    try {
        // 로딩 표시
        showCustomAlert('Zoom 미팅을 생성하는 중입니다...', 'info');

        // Zoom API 호출 (시뮬레이션)
        const startTime = new Date(`${examDate}T${examTime}:00`).toISOString();
        const result = await createZoomMeeting({
            topic: `${assignment.studentName} - ${assignment.stageName}`,
            startTime: startTime,
            duration: duration,
            timezone: 'Asia/Seoul'
        });

        if (result.success) {
            // 숨겨진 필드에 값 저장
            document.getElementById('meeting-id').value = result.data.meetingId;
            document.getElementById('meeting-password').value = result.data.password;
            document.getElementById('meeting-url').value = result.data.meetingUrl;
            document.getElementById('host-url').value = result.data.hostUrl;

            // 표시 영역에 값 출력
            document.getElementById('display-meeting-id').textContent = result.data.meetingId;
            document.getElementById('display-meeting-password').textContent = result.data.password;

            const meetingUrlLink = document.getElementById('display-meeting-url');
            meetingUrlLink.textContent = result.data.meetingUrl;
            meetingUrlLink.href = result.data.meetingUrl;

            const hostUrlLink = document.getElementById('display-host-url');
            hostUrlLink.textContent = result.data.hostUrl;
            hostUrlLink.href = result.data.hostUrl;

            // 링크 정보 영역 표시
            document.getElementById('zoom-link-info').style.display = 'block';

            // 버튼 텍스트 변경
            const createBtn = document.getElementById('create-zoom-link-btn');
            createBtn.innerHTML = '<i class="fas fa-redo mr-1"></i> 재생성';

            showCustomAlert('Zoom 미팅이 생성되었습니다.', 'success');
        } else {
            throw new Error(result.error?.message || '미팅 생성 실패');
        }
    } catch (error) {
        console.error('Zoom 미팅 생성 오류:', error);
        showCustomAlert(error.message || 'Zoom 미팅 생성에 실패했습니다.', 'error');
    }
}

/**
 * 일정 저장
 */
function saveExamSchedule(event) {
    event.preventDefault();

    const examDate = document.getElementById('exam-date').value;
    const examTime = document.getElementById('exam-time').value;
    const duration = parseInt(document.getElementById('exam-duration').value);
    const method = document.querySelector('input[name="exam-method"]:checked').value;

    // 유효성 검사
    if (!examDate || !examTime || !duration) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    if (!isValidFutureDate(examDate)) {
        alert('심사 날짜는 오늘 이후로 선택해주세요.');
        return;
    }

    // 진행 방식별 추가 검증
    let onlineInfo = null;
    let offlineInfo = null;

    if (method === 'online') {
        const meetingId = document.getElementById('meeting-id').value.trim();
        const meetingPassword = document.getElementById('meeting-password').value.trim();
        const meetingUrl = document.getElementById('meeting-url').value.trim();
        const hostUrl = document.getElementById('host-url').value.trim();

        if (!meetingId || !meetingUrl) {
            alert('링크 생성 버튼을 클릭하여 Zoom 회의를 먼저 생성해주세요.');
            return;
        }

        onlineInfo = {
            platform: 'zoom',
            meetingId: meetingId,
            password: meetingPassword,
            meetingUrl: meetingUrl,
            hostUrl: hostUrl
        };
    } else {
        const location = document.getElementById('offline-location').value.trim();

        if (!location) {
            alert('오프라인 장소를 입력해주세요.');
            return;
        }

        offlineInfo = {
            location: location
        };
    }

    const assignment = mockCommitteeAssignments.find(a => a.id === currentAssignmentId);
    if (!assignment) return;

    const thesisTitle = getThesisTitleByReviewTargetId(assignment.reviewTargetId);

    // 기존 일정 찾기
    const existingSchedule = getScheduleByAssignmentId(currentAssignmentId);

    if (existingSchedule) {
        // 수정
        existingSchedule.examDate = examDate;
        existingSchedule.examTime = examTime;
        existingSchedule.duration = duration;
        existingSchedule.method = method;
        existingSchedule.onlineInfo = onlineInfo;
        existingSchedule.offlineInfo = offlineInfo;
        existingSchedule.updatedAt = new Date().toISOString();

        showCustomAlert('심사 일정이 수정되었습니다.', 'success');
    } else {
        // 신규 등록
        const newSchedule = {
            scheduleId: 'SCH' + String(mockExamSchedules.length + 1).padStart(3, '0'),
            assignmentId: currentAssignmentId,

            studentId: assignment.studentId,
            studentName: assignment.studentName,
            studentNumber: assignment.studentNumber,
            department: assignment.department,
            degreeType: assignment.degreeType,

            stageId: assignment.stageId,
            stageName: assignment.stageName,

            thesisTitle: thesisTitle,

            examDate: examDate,
            examTime: examTime,
            duration: duration,

            method: method,
            onlineInfo: onlineInfo,
            offlineInfo: offlineInfo,

            status: 'scheduled',
            cancelReason: null,

            createdBy: 'ADM001',
            createdAt: new Date().toISOString(),
            updatedBy: 'ADM001',
            updatedAt: new Date().toISOString()
        };

        mockExamSchedules.push(newSchedule);

        showCustomAlert('심사 일정이 등록되었습니다.', 'success');
    }

    // 목록으로 돌아가기
    setTimeout(() => {
        backToExamScheduleList();
    }, 500);
}

/**
 * 일정 삭제
 */
function deleteExamSchedule() {
    if (!confirm('심사 일정을 삭제하시겠습니까?\n\n온라인 미팅 정보도 함께 삭제됩니다.')) {
        return;
    }

    const schedule = getScheduleByAssignmentId(currentAssignmentId);
    if (!schedule) {
        alert('일정 정보를 찾을 수 없습니다.');
        return;
    }

    // 온라인 미팅이면 Zoom 삭제 (시뮬레이션)
    if (schedule.method === 'online' && schedule.onlineInfo?.meetingId) {
        deleteZoomMeeting(schedule.onlineInfo.meetingId)
            .then(() => {
                console.log('Zoom 미팅 삭제 완료');
            })
            .catch(err => {
                console.error('Zoom 미팅 삭제 실패:', err);
            });
    }

    // 일정 삭제 (상태 변경)
    schedule.status = 'cancelled';
    schedule.cancelReason = '관리자 삭제';
    schedule.updatedAt = new Date().toISOString();

    showCustomAlert('심사 일정이 삭제되었습니다.', 'success');

    setTimeout(() => {
        backToExamScheduleList();
    }, 500);
}

// window 객체에 즉시 노출
window.renderExamScheduleList = renderExamScheduleList;
window.filterExamSchedule = filterExamSchedule;
window.showExamScheduleDetail = showExamScheduleDetail;
window.backToExamScheduleList = backToExamScheduleList;
window.toggleMethodFields = toggleMethodFields;
window.createZoomMeetingUI = createZoomMeetingUI;
window.saveExamSchedule = saveExamSchedule;
window.deleteExamSchedule = deleteExamSchedule;

console.log('✅ exam-schedule.js (admin-v3 확장 버전) 로드 완료');
console.log('✅ window.renderExamScheduleList:', typeof window.renderExamScheduleList);

})(); // IIFE 종료
