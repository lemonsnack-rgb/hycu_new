/**
 * 학생용 논문 지도 활동 - 목록 화면
 * Version: 20260107001
 */

// ==================== 목록 초기화 ====================
function initStudentGuidanceStatusList() {
    console.log('학생용 논문 지도 활동 초기화');
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

    // 학생은 본인 것만 보고, hidden이 아닌 것만 표시
    const filteredRequests = requests.filter(r => !r.hidden);

    contentArea.innerHTML = `
        <div class="table-container">
            <!-- 테이블 헤더: 타이틀(건수) + 논문 지도 요청 버튼 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">논문 지도 활동</h3>
                    <span class="table-count">(총 ${filteredRequests.length}건)</span>
                </div>
                <div class="table-header-right">
                    <button onclick="showStudentGuidanceRequestModal()"
                            class="btn-primary"
                            style="background: #6A0028; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-plus"></i>
                        <span>논문 지도 요청</span>
                    </button>
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
                            <th style="width: 90px; text-align: center;">학번</th>
                            <th style="width: 80px; text-align: center;">성명</th>
                            <th style="min-width: 250px; text-align: center;">논문명</th>
                            <th style="width: 100px; text-align: center;">지도교수명</th>
                            <th style="width: 120px; text-align: center;">제출일시</th>
                            <th style="width: 120px; text-align: center;">피드백 희망일자</th>
                            <th style="width: 100px; text-align: center;">기본단계</th>
                            <th style="width: 120px; text-align: center;">세부단계</th>
                            <th style="width: 100px; text-align: center;">피드백상태</th>
                        </tr>
                    </thead>
                    <tbody id="student-guidance-status-list-body">
                        ${filteredRequests.length > 0
                            ? filteredRequests.map((req, idx) => renderStudentGuidanceRow(req, idx + 1)).join('')
                            : '<tr><td colspan="17" style="text-align: center; padding: 24px 12px;">검색 결과가 없습니다</td></tr>'
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
            <td style="text-align: center;">${request.studentNumber}</td>
            <td style="text-align: center;">${request.studentName}</td>
            <td style="text-align: left; padding-left: 12px;">
                <div class="cell-truncate" title="${request.thesisTitle || request.file}">
                    ${request.thesisTitle || request.file}
                </div>
            </td>
            <td style="text-align: center;">${request.professorName || '-'}</td>
            <td style="text-align: center;">${request.uploadDate || '-'}</td>
            <td style="text-align: center;">${request.desiredDate || '-'}</td>
            <td style="text-align: center;">${request.basicStageName || request.guidanceStage || '-'}</td>
            <td style="text-align: center;">${request.subStageName || '-'}</td>
            <td style="text-align: center;">${feedbackStatus}</td>
        </tr>
    `;
}

// ==================== 검색 필터 (학생용은 불필요 - 제거됨) ====================
// 학생은 본인의 제출물만 보므로 검색/필터 기능 불필요

// ==================== 논문 지도 요청 모달 ====================
function showStudentGuidanceRequestModal() {
    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById("student-guidance-request-modal");
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement("div");
    modal.className = "student-guidance-modal-backdrop";
    modal.id = "student-guidance-request-modal";

    modal.innerHTML = `
        <div class="student-guidance-modal-content">
            <div class="student-guidance-modal-inner">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #E5E7EB;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; color: #1F2937;">논문 지도 요청</h3>
                    <button onclick="closeStudentGuidanceRequestModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF; line-height: 1;">×</button>
                </div>
                <div class="modal-body" style="padding: 1.5rem;">
                    <form id="student-guidance-request-form" onsubmit="submitStudentGuidanceRequest(event)">
                        <!-- 논문 제목 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                논문 제목 <span style="color: #EF4444;">*</span>
                            </label>
                            <input type="text" id="student-guidance-title" required
                                   style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;"
                                   placeholder="논문 제목을 입력하세요">
                        </div>

                        <!-- 논문 진행 단계 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                논문 진행 단계 <span style="color: #EF4444;">*</span>
                            </label>
                            <select id="student-guidance-stage" required
                                    style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                                <option value="">선택하세요</option>
                                <option value="연구계획서">연구계획서</option>
                                <option value="중간논문">중간논문</option>
                                <option value="최종논문">최종논문</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        <!-- 첨부파일 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                첨부파일 <span style="color: #EF4444;">*</span>
                            </label>
                            <input type="file" id="student-guidance-file" required accept=".pdf"
                                   style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                                PDF 파일만 업로드 가능 (최대 30MB)
                            </p>
                        </div>

                        <!-- 메모 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                메모
                            </label>
                            <textarea id="student-guidance-memo" rows="4"
                                      style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; resize: vertical;"
                                      placeholder="논문 지도와 관련된 메모나 특이사항을 입력하세요"></textarea>
                            <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                                선택 사항입니다
                            </p>
                        </div>

                        <!-- 피드백 희망일자 -->
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                피드백 희망일자 <span style="color: #EF4444;">*</span>
                            </label>
                            <input type="date" id="student-guidance-desired-date" required
                                   style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem;">
                            <p style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">
                                피드백을 받고 싶은 희망 날짜를 선택하세요
                            </p>
                        </div>

                        <!-- 주의사항 -->
                        <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
                            <p style="font-weight: 600; color: #1E40AF; margin-bottom: 0.5rem; font-size: 0.875rem;">안내사항</p>
                            <ul style="font-size: 0.75rem; color: #1E40AF; margin-left: 1rem; padding-left: 0.5rem;">
                                <li>한 번에 하나의 파일만 업로드 가능합니다</li>
                                <li>PDF 파일만 업로드 가능하며, 최대 용량은 30MB입니다</li>
                            </ul>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.5rem; border-top: 1px solid #E5E7EB; background: #F9FAFB;">
                    <button onclick="closeStudentGuidanceRequestModal()"
                            class="btn btn-secondary"
                            style="padding: 0.5rem 1rem; border: 1px solid #D1D5DB; background: white; color: #374151; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem;">
                        취소
                    </button>
                    <button onclick="document.getElementById('student-guidance-request-form').requestSubmit()"
                            class="btn btn-primary"
                            style="padding: 0.5rem 1rem; background: #6A0028; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
                        요청하기
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 배경 클릭 시 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeStudentGuidanceRequestModal();
        }
    });

    // ESC 키로 모달 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeStudentGuidanceRequestModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function submitStudentGuidanceRequest(event) {
    event.preventDefault();

    const title = document.getElementById('student-guidance-title').value;
    const stage = document.getElementById('student-guidance-stage').value;
    const file = document.getElementById('student-guidance-file').files[0];
    const desiredDate = document.getElementById('student-guidance-desired-date').value;
    const memo = document.getElementById('student-guidance-memo').value;

    if (!file) {
        alert('파일을 선택해주세요');
        return;
    }

    if (!desiredDate) {
        alert('피드백 희망일자를 선택해주세요');
        return;
    }

    // 파일 크기 검증 (30MB = 30 * 1024 * 1024 bytes)
    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('파일 크기는 30MB를 초과할 수 없습니다');
        return;
    }

    // 파일 형식 검증
    if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다');
        return;
    }

    // 실제로는 서버로 전송
    console.log('논문 지도 요청:', { title, stage, file: file.name, desiredDate, memo });

    alert('논문 지도 요청이 완료되었습니다');
    closeStudentGuidanceRequestModal();
    renderStudentGuidanceStatusList();
}

function closeStudentGuidanceRequestModal() {
    const modal = document.getElementById('student-guidance-request-modal');
    if (modal) {
        modal.remove();
    }
}

// Export
window.initStudentGuidanceStatusList = initStudentGuidanceStatusList;
window.renderStudentGuidanceStatusList = renderStudentGuidanceStatusList;
window.showStudentGuidanceRequestModal = showStudentGuidanceRequestModal;
window.submitStudentGuidanceRequest = submitStudentGuidanceRequest;
window.closeStudentGuidanceRequestModal = closeStudentGuidanceRequestModal;

console.log('✅ 학생용 논문 지도 현황 목록 화면 로드 완료');
