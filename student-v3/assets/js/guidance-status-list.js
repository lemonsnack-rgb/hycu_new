/**
 * 학생용 논문 지도 현황 - 목록 화면
 * Version: 20260107001
 */

// ==================== 목록 초기화 ====================
function initStudentGuidanceStatusList() {
    console.log('학생용 논문 지도 현황 초기화');
    renderStudentGuidanceStatusList();
}

// ==================== 목록 렌더링 ====================
function renderStudentGuidanceStatusList() {
    const requests = StudentGuidanceDataService.getStudentGuidanceRequests();
    const contentArea = document.getElementById('student-guidance-status-content');

    if (!contentArea) {
        console.error('student-guidance-status-content 요소를 찾을 수 없습니다');
        return;
    }

    // 필터링 적용
    const filters = getCurrentStudentGuidanceFilters();
    const filteredRequests = filterStudentGuidanceRequests(requests, filters);

    contentArea.innerHTML = `
        <div class="table-container">
            <!-- 테이블 헤더: 타이틀(건수) -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">논문 지도 현황</h3>
                    <span class="table-count">(총 ${filteredRequests.length}건)</span>
                </div>
            </div>

            <div class="table-scroll" style="overflow-x: auto;">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th style="width: 60px; text-align: center;">순번</th>
                            <th style="width: 80px; text-align: center;">학년도</th>
                            <th style="width: 60px; text-align: center;">학기</th>
                            <th style="width: 100px; text-align: center;">대학구분</th>
                            <th style="width: 100px; text-align: center;">계열/대학원</th>
                            <th style="width: 120px; text-align: center;">학부(과)전공</th>
                            <th style="width: 150px; text-align: center;">학과/전공</th>
                            <th style="width: 80px; text-align: center;">학위과정</th>
                            <th style="width: 80px; text-align: center;">학적상태</th>
                            <th style="min-width: 250px; text-align: center;">논문명</th>
                            <th style="width: 100px; text-align: center;">지도교수명</th>
                            <th style="width: 120px; text-align: center;">제출일시</th>
                            <th style="width: 120px; text-align: center;">지도단계</th>
                            <th style="width: 100px; text-align: center;">피드백상태</th>
                        </tr>
                    </thead>
                    <tbody id="student-guidance-status-list-body">
                        ${filteredRequests.length > 0
                            ? filteredRequests.map((req, idx) => renderStudentGuidanceRow(req, idx + 1)).join('')
                            : '<tr><td colspan="14" style="text-align: center; padding: 24px 12px;">검색 결과가 없습니다</td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ==================== 제출물 행 렌더링 ====================
function renderStudentGuidanceRow(request, idx) {
    // 피드백 상태 계산
    const commentCount = request.commentCount || 0;
    let feedbackStatus, statusClass;

    if (request.isCompleted) {
        feedbackStatus = '완료';
        statusClass = 'bg-green-100 text-green-700';
    } else if (commentCount > 0) {
        feedbackStatus = '진행중';
        statusClass = 'bg-[#FCE4EC] text-[#6A0028]';
    } else {
        feedbackStatus = '대기';
        statusClass = 'bg-gray-100 text-gray-800';
    }

    // 학적상태 텍스트 변환
    const statusText = request.status === 'active' ? '재학' :
                       request.status === 'leave' ? '휴학' :
                       request.status === 'completed' ? '수료' :
                       request.status === 'graduated' ? '졸업' : '재학';

    return `
        <tr class="guidance-row cursor-pointer hover:bg-gray-50"
            onclick="openStudentGuidanceStatusDetail('${request.id}')">
            <td style="text-align: center;">${idx}</td>
            <td style="text-align: center;">${request.year || '2025'}</td>
            <td style="text-align: center;">${request.semester || '1'}</td>
            <td style="text-align: center;">${request.graduate || '일반대학원'}</td>
            <td style="text-align: center;">${request.college || '공학계열'}</td>
            <td style="text-align: center;">${request.undergraduate || request.major || '-'}</td>
            <td style="text-align: center;">${request.major}</td>
            <td style="text-align: center;">${request.program}</td>
            <td style="text-align: center;">${statusText}</td>
            <td style="text-align: left; padding-left: 12px;">
                <div class="cell-truncate" title="${request.thesisTitle || request.file}">
                    ${request.thesisTitle || request.file}
                </div>
            </td>
            <td style="text-align: center;">${request.professorName || '-'}</td>
            <td style="text-align: center;">${request.uploadDate || '-'}</td>
            <td style="text-align: center;">${request.guidanceStage || '연구계획서'}</td>
            <td style="text-align: center;">
                <span class="${statusClass} px-2 py-1 rounded-full text-xs font-medium">
                    ${feedbackStatus}
                </span>
            </td>
        </tr>
    `;
}

// ==================== 검색 필터 ====================
function getCurrentStudentGuidanceFilters() {
    return {
        year: document.getElementById('student-guidance-filter-year')?.value || '',
        semester: document.getElementById('student-guidance-filter-semester')?.value || '',
        universityType: document.getElementById('student-guidance-filter-university-type')?.value || '',
        college: document.getElementById('student-guidance-filter-college')?.value || '',
        undergraduate: document.getElementById('student-guidance-filter-undergraduate')?.value || '',
        major: document.getElementById('student-guidance-filter-major')?.value || '',
        program: document.getElementById('student-guidance-filter-program')?.value || '',
        academicStatus: document.getElementById('student-guidance-filter-academic-status')?.value || '',
        professor: document.getElementById('student-guidance-filter-professor')?.value || '',
        feedbackStatus: document.getElementById('student-guidance-filter-feedback-status')?.value || ''
    };
}

function filterStudentGuidanceRequests(requests, filters) {
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
        if (filters.program && req.program !== filters.program) {
            return false;
        }

        // 학적상태 필터
        if (filters.academicStatus) {
            const statusText = req.status === 'active' ? '재학' :
                             req.status === 'leave' ? '휴학' :
                             req.status === 'completed' ? '수료' :
                             req.status === 'graduated' ? '졸업' : '재학';

            if (statusText !== filters.academicStatus) {
                return false;
            }
        }

        // 지도교수명 필터
        if (filters.professor) {
            const professorName = req.professorName || '';
            if (!professorName.includes(filters.professor)) {
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

function searchStudentGuidanceStatus() {
    renderStudentGuidanceStatusList();
}

function resetStudentGuidanceStatusSearch() {
    // 모든 검색 필터 초기화
    const filterIds = [
        'student-guidance-filter-year',
        'student-guidance-filter-semester',
        'student-guidance-filter-university-type',
        'student-guidance-filter-college',
        'student-guidance-filter-undergraduate',
        'student-guidance-filter-major',
        'student-guidance-filter-program',
        'student-guidance-filter-academic-status',
        'student-guidance-filter-professor',
        'student-guidance-filter-feedback-status'
    ];

    filterIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });

    renderStudentGuidanceStatusList();
}

// Export
window.initStudentGuidanceStatusList = initStudentGuidanceStatusList;
window.renderStudentGuidanceStatusList = renderStudentGuidanceStatusList;
window.searchStudentGuidanceStatus = searchStudentGuidanceStatus;
window.resetStudentGuidanceStatusSearch = resetStudentGuidanceStatusSearch;

console.log('✅ 학생용 논문 지도 현황 목록 화면 로드 완료');
