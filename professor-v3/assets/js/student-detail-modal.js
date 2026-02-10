// ===================================
// 학생 상세정보 모달 팝업 (공통)
// 교수/관리자 화면에서 공유
// ===================================

/**
 * 학생 상세정보 모달 팝업 표시
 * @param {Object} studentInfo - 통합 학생 정보
 * @param {string} studentInfo.stdNo - 학번
 * @param {string} studentInfo.name - 성명
 * @param {string} studentInfo.dept - 학과
 * @param {string} studentInfo.degree - 학위과정
 * @param {string} [studentInfo.semester] - 학기
 * @param {string} [studentInfo.stage] - 현재단계 (한글)
 * @param {string} [studentInfo.status] - 학적상태
 * @param {string} [studentInfo.advisor] - 지도교수명
 * @param {string} [studentInfo.collegeType] - 대학구분
 * @param {string} [studentInfo.email] - 이메일
 * @param {string} [studentInfo.phone] - 전화번호
 */
function showStudentDetailModal(studentInfo) {
    const s = {
        stdNo: studentInfo.stdNo || '-',
        name: studentInfo.name || '-',
        dept: studentInfo.dept || '-',
        degree: studentInfo.degree || '-',
        semester: studentInfo.semester || '-',
        stage: studentInfo.stage || '-',
        status: _convertStatus(studentInfo.status) || '-',
        advisor: studentInfo.advisor || '-',
        collegeType: studentInfo.collegeType || '-',
        email: studentInfo.email || '-',
        phone: studentInfo.phone || '-'
    };

    // 지도단계 진행현황 조회 (전역 Mock 데이터)
    const stageProgress = _findStageProgress(s.stdNo);

    // 기본 단계 (데이터 없을 때)
    const defaultStages = [
        { name: '연구계획서', status: 'completed' },
        { name: '프로포절', status: _inferStageStatus(s.stage, '프로포절') },
        { name: '예비심사', status: _inferStageStatus(s.stage, '예비심사') },
        { name: '본심사', status: _inferStageStatus(s.stage, '본심사') },
        { name: '졸업', status: 'upcoming' }
    ];

    const stages = stageProgress ? stageProgress.stages : defaultStages;

    // 지도단계 수직 여정 아코디언
    const journeyStages = _buildJourneyStages(stages, s.stdNo);
    const stageJourneyHtml = _renderVerticalJourney(journeyStages);

    // 학위논문청구요건 HTML (학위과정별 다른 항목)
    const requirements = _getRequirements(s.stdNo, s.degree);
    const requirementsHtml = _renderRequirements(requirements);

    // 활동 이력 HTML
    const activities = _buildActivityHistory(s.stdNo);
    const activityHtml = _renderActivityHistory(activities);

    // 모달 HTML
    const modalHtml = `
        <div id="student-detail-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; border-radius: 12px; width: 90%; max-width: 800px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
                <!-- 헤더 -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #E5E7EB; background: #F9FAFB; flex-shrink: 0; border-radius: 12px 12px 0 0;">
                    <h2 style="font-size: 18px; font-weight: 700; color: #1A1A1A; margin: 0;">학생 상세정보</h2>
                    <button onclick="closeStudentDetailModal()" style="background: none; border: none; cursor: pointer; padding: 4px;">
                        <svg width="24" height="24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                <!-- 본문 (스크롤) -->
                <div style="padding: 24px; overflow-y: auto; overflow-x: hidden; flex: 1; min-height: 0;">
                    <!-- 기본 정보 -->
                    <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">기본 정보</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                            <div><span style="color: #6B7280; font-size: 12px;">학번</span><p style="color: #1A1A1A; font-weight: 500; margin: 4px 0 0;">${s.stdNo}</p></div>
                            <div><span style="color: #6B7280; font-size: 12px;">성명</span><p style="color: #1A1A1A; font-weight: 500; margin: 4px 0 0;">${s.name}</p></div>
                            <div><span style="color: #6B7280; font-size: 12px;">학과</span><p style="color: #1A1A1A; font-weight: 500; margin: 4px 0 0;">${s.dept}</p></div>
                            <div><span style="color: #6B7280; font-size: 12px;">학위과정</span><p style="color: #1A1A1A; font-weight: 500; margin: 4px 0 0;">${s.degree}</p></div>
                            <div><span style="color: #6B7280; font-size: 12px;">학적상태</span><p style="color: #1A1A1A; font-weight: 500; margin: 4px 0 0;">${s.status}</p></div>
                            <div><span style="color: #6B7280; font-size: 12px;">현재 단계</span><p style="color: #6A0028; font-weight: 600; margin: 4px 0 0;">${s.stage}</p></div>
                            ${s.advisor !== '-' ? `<div><span style="color: #6B7280; font-size: 12px;">지도교수</span><p style="color: #1A1A1A; font-weight: 500; margin: 4px 0 0;">${s.advisor}</p></div>` : ''}
                            ${s.semester !== '-' ? `<div><span style="color: #6B7280; font-size: 12px;">학기</span><p style="color: #1A1A1A; font-weight: 500; margin: 4px 0 0;">${s.semester}</p></div>` : ''}
                        </div>
                    </div>

                    <!-- 학위논문청구요건 -->
                    <div style="margin-bottom: 24px;">
                        ${requirementsHtml}
                    </div>

                    <!-- 지도단계 -->
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px;">지도단계</h3>
                        <div id="modal-vertical-journey" style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px;">
                            ${stageJourneyHtml}
                        </div>
                    </div>

                    <!-- 활동 이력 -->
                    <div style="width: 100%; max-width: 100%; overflow: hidden;">
                        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">활동 이력</h3>
                        <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; overflow: hidden; width: 100%;">
                            ${activityHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 기존 모달 제거 후 새 모달 추가
    const existingModal = document.getElementById('student-detail-modal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // ESC 키로 닫기
    document.addEventListener('keydown', _handleStudentModalEsc);
}

// 모달 닫기
function closeStudentDetailModal() {
    const modal = document.getElementById('student-detail-modal');
    if (modal) modal.remove();
    document.removeEventListener('keydown', _handleStudentModalEsc);
}

function _handleStudentModalEsc(e) {
    if (e.key === 'Escape') closeStudentDetailModal();
}

// ==================== 내부 헬퍼 함수 ====================

// 학번으로 지도단계 진행현황 조회
function _findStageProgress(stdNo) {
    const data = window.mockStudentStageProgress || [];
    return data.find(sp =>
        sp.studentId === stdNo ||
        sp.studentId === 'STU' + String(stdNo).padStart(3, '0') ||
        sp.studentNumber === stdNo
    );
}

// 학번 매칭 헬퍼
function _matchStudentId(dataId, stdNo) {
    return dataId === stdNo ||
           dataId === 'STU' + String(stdNo).padStart(3, '0') ||
           String(dataId) === String(stdNo);
}

// 학생 활동 이력 수집 (제출/승인, 지도활동, 실시간지도예약)
function _buildActivityHistory(stdNo) {
    var activities = [];

    // 1. mockStageSubmissions → 논문 제출 / 승인·반려 이력
    var subs = window.mockStageSubmissions || [];
    subs.forEach(function(s) {
        if (!(_matchStudentId(s.studentId, stdNo) || _matchStudentId(s.studentNumber, stdNo))) return;
        // 제출 이력
        activities.push({
            date: s.submittedDate || '',
            type: 'submission',
            label: '논문제출',
            content: '[' + (s.subStageName || s.stageName || '-') + '] 논문 제출',
            fileUrl: s.fileUrl || null
        });
        // 승인/반려 이력
        if (s.reviewResult) {
            var isApproved = s.reviewResult === 'approved' || s.reviewResult === 'pass';
            activities.push({
                date: s.reviewedDate || s.submittedDate || '',
                type: isApproved ? 'approved' : 'rejected',
                label: isApproved ? '승인' : '반려',
                content: '[' + (s.subStageName || s.stageName || '-') + '] ' + (isApproved ? '승인' : '반려'),
                fileUrl: null
            });
        }
    });

    // 2. FEEDBACK_REQUESTS → 지도활동 (문서 업로드/피드백)
    var frs = window.FEEDBACK_REQUESTS || [];
    frs.forEach(function(f) {
        if (f.studentNumber !== stdNo) return;
        var titleShort = (f.thesisTitle || '').length > 20
            ? (f.thesisTitle || '').substring(0, 20) + '...'
            : (f.thesisTitle || '-');
        activities.push({
            date: f.uploadDate || '',
            type: 'guidance',
            label: '지도활동',
            content: '[' + titleShort + '] ' + (f.file || '문서') + ' 제출',
            fileUrl: f.fileUrl || null
        });
    });

    // 3. MEETING_REQUESTS_V3 → 실시간지도예약
    var mtgs = window.MEETING_REQUESTS_V3 || [];
    var statusMap = { pending: '대기', approved: '승인', completed: '완료', rejected: '반려', cancelled: '취소' };
    mtgs.forEach(function(m) {
        if (m.studentNumber !== stdNo) return;
        var profName = m.professorName || m.advisorName || '교수';
        var statusText = statusMap[m.status] || m.status || '';
        activities.push({
            date: m.requestDate || m.selectedDate || '',
            type: 'meeting',
            label: '실시간지도',
            content: '[' + profName + '] 실시간지도예약 (' + statusText + ')',
            fileUrl: null
        });
    });

    // 날짜 내림차순 정렬
    activities.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    return activities;
}

// 학위논문청구요건 데이터 (학위과정별 다른 항목 - requirement-management.js REQUIREMENT_COLUMNS 기준)
function _getRequirements(stdNo, degree) {
    // 학위과정별 요건 항목 정의
    var reqByDegree = {
        '석사': [
            { name: '학점수료', completed: true },
            { name: '석사논문1', completed: false },
            { name: '연구윤리', completed: true },
            { name: '연구방법론', completed: true },
            { name: '외국어시험', completed: false },
            { name: '종합시험', completed: false },
            { name: '학술지게재', completed: false }
        ],
        '박사': [
            { name: '학점수료', completed: true },
            { name: '박사논문1', completed: false },
            { name: '박사논문2', completed: false },
            { name: '연구윤리', completed: true },
            { name: '연구방법론', completed: true },
            { name: '외국어시험', completed: false },
            { name: '종합시험', completed: false },
            { name: '학술지게재', completed: false }
        ],
        '통합과정': [
            { name: '학점수료', completed: true },
            { name: '석사논문1', completed: false },
            { name: '박사논문1', completed: false },
            { name: '박사논문2', completed: false },
            { name: '연구윤리', completed: true },
            { name: '연구방법론', completed: true },
            { name: '외국어시험', completed: false },
            { name: '종합시험', completed: false },
            { name: '학술지게재', completed: false }
        ]
    };

    // degree에서 학위과정 매칭 (석사/박사/통합과정)
    var deg = degree || '';
    var key = '박사'; // 기본값
    if (deg.indexOf('석사') >= 0) key = '석사';
    else if (deg.indexOf('통합') >= 0) key = '통합과정';
    else if (deg.indexOf('박사') >= 0) key = '박사';

    return reqByDegree[key] || reqByDegree['박사'];
}

// 학위논문청구요건 충족현황 칩 UI 렌더링
function _renderRequirements(requirements) {
    if (!requirements || requirements.length === 0) return '';

    var completedCount = requirements.filter(function(r) { return r.completed; }).length;
    var totalCount = requirements.length;

    var html = '<div style="background: #F9FAFB; border-radius: 8px; padding: 16px;">';
    // 제목 행
    html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">';
    html += '<h3 style="font-size: 14px; font-weight: 600; color: #374151; margin: 0;">학위논문청구요건 충족현황</h3>';
    html += '<span style="font-size: 13px; color: #6b7280;">충족 <span style="color: #6A0028; font-weight: 700;">' + completedCount + '</span>/' + totalCount + '</span>';
    html += '</div>';
    // 칩 목록
    html += '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
    requirements.forEach(function(req) {
        var bg = req.completed ? '#E8F5E9' : '#f8fafc';
        var border = req.completed ? '#A5D6A7' : '#e5e7eb';
        var textColor = req.completed ? '#2E7D32' : '#9ca3af';
        var fontWeight = req.completed ? '600' : '400';
        var icon = req.completed
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>'
            : '<div style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid #9ca3af;"></div>';
        html += '<div style="display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: ' + bg + '; border: 1px solid ' + border + '; border-radius: 4px; font-size: 13px;">';
        html += icon;
        html += '<span style="color: ' + textColor + '; font-weight: ' + fontWeight + ';">' + req.name + '</span>';
        html += '</div>';
    });
    html += '</div>';
    html += '</div>';
    return html;
}

// 학적상태 한글 변환
function _convertStatus(status) {
    if (!status) return '';
    const map = { 'active': '재학', 'leave': '휴학', 'graduated': '졸업', 'expelled': '제적' };
    return map[status] || status;
}

// 단계 상태 추정 (현재 단계 기반)
function _inferStageStatus(currentStage, targetStage) {
    const stageOrder = ['연구계획서', '프로포절', '예비심사', '본심사', '졸업'];
    const currentIdx = stageOrder.indexOf(currentStage);
    const targetIdx = stageOrder.indexOf(targetStage);
    if (currentIdx < 0) return 'upcoming';
    if (targetIdx < currentIdx) return 'completed';
    if (targetIdx === currentIdx) return 'current';
    return 'upcoming';
}

// 기본 세부단계 (외부 데이터 없을 때 사용)
var _defaultHierarchicalStages = [
    { basicStageName: '연구계획서', order: 1, subStages: [
        { name: '계획서 초안 작성', order: 1, submissionSchedule: { startDate: '2025-03-01', endDate: '2025-03-15' }, reviewSchedule: { startDate: '2025-03-16', endDate: '2025-03-20' } },
        { name: '지도교수 승인', order: 2, submissionSchedule: { startDate: '2025-03-21', endDate: '2025-03-25' }, reviewSchedule: { startDate: '2025-03-26', endDate: '2025-03-31' } }
    ]},
    { basicStageName: '프로포절', order: 2, subStages: [
        { name: '프로포절 제출', order: 1, submissionSchedule: { startDate: '2025-04-01', endDate: '2025-04-15' }, reviewSchedule: { startDate: '2025-04-16', endDate: '2025-04-25' } }
    ]},
    { basicStageName: '예비심사', order: 3, subStages: [
        { name: '예비심사 신청', order: 1 },
        { name: '예비심사 진행', order: 2 }
    ]},
    { basicStageName: '본심사', order: 4, subStages: [
        { name: '본심사 신청', order: 1 },
        { name: '본심사 진행', order: 2 }
    ]},
    { basicStageName: '졸업', order: 5, subStages: [
        { name: '최종논문 제출', order: 1 },
        { name: '졸업심사 완료', order: 2 }
    ]}
];

// flat stages를 hierarchicalStages와 매칭하여 수직 여정 데이터 구성
function _buildJourneyStages(flatStages, stdNo) {
    // hierarchicalStages 소스 탐색: 외부 데이터 + 내장 기본값 병합
    var externalHier = null;
    if (window.mockThesisStages && window.mockThesisStages.length > 0) {
        externalHier = window.mockThesisStages[0].hierarchicalStages || null;
    }
    // 외부 데이터와 내장 기본값을 결합 (외부 우선)
    var hierStages = (externalHier || []).concat(_defaultHierarchicalStages);

    // flat stages를 기본단계 + 세부단계 구조로 변환
    const result = [];

    flatStages.forEach(function(stage, stageIdx) {
        // hierarchicalStages에서 매칭되는 기본단계 찾기
        // 1차: 이름 매칭, 2차: 순서 매칭 (order 기반)
        let matchedHier = null;
        if (hierStages) {
            matchedHier = hierStages.find(function(h) {
                return h.basicStageName === stage.name ||
                       stage.name.indexOf(h.basicStageName) >= 0 ||
                       h.basicStageName.indexOf(stage.name) >= 0;
            });
            // 이름 매칭 실패 시 순서(order) 기반 매칭
            if (!matchedHier) {
                matchedHier = hierStages.find(function(h) {
                    return h.order === (stageIdx + 1);
                });
            }
        }

        // 기본단계 상태 변환 (current → in-progress for consistency)
        var basicStatus = stage.status;
        if (basicStatus === 'current') basicStatus = 'in-progress';

        var entry = {
            basicStageName: stage.name,
            status: basicStatus,
            completedDate: stage.completedDate || null,
            subStages: []
        };

        if (matchedHier && matchedHier.subStages && matchedHier.subStages.length > 0) {
            // 세부단계가 있으면 상태 추정
            matchedHier.subStages.forEach(function(sub, subIdx) {
                var subStatus = 'upcoming';
                if (basicStatus === 'completed') {
                    subStatus = 'completed';
                } else if (basicStatus === 'in-progress') {
                    // 첫 번째 세부단계는 current, 나머지는 upcoming
                    subStatus = subIdx === 0 ? 'current' : 'upcoming';
                }

                var subEntry = {
                    name: sub.name,
                    status: subStatus
                };

                // 일정 정보 추가
                if (sub.submissionSchedule) {
                    var ss = sub.submissionSchedule;
                    subEntry.submissionPeriod = _formatDateRange(ss.startDate, ss.endDate);
                }
                if (sub.reviewSchedule) {
                    var rs = sub.reviewSchedule;
                    subEntry.reviewPeriod = _formatDateRange(rs.startDate, rs.endDate);
                }

                entry.subStages.push(subEntry);
            });
        }

        result.push(entry);
    });

    return result;
}

// 날짜 범위 포맷
function _formatDateRange(startStr, endStr) {
    if (!startStr || !endStr) return '';
    var s = startStr.substring(0, 10);
    var e = endStr.substring(0, 10);
    return s + ' ~ ' + e;
}

// 수직 여정 아코디언 렌더링 (학생 대시보드 renderVerticalJourney 기반)
function _renderVerticalJourney(journeyStages) {
    if (!journeyStages || journeyStages.length === 0) {
        return '<p style="color: #9CA3AF; text-align: center; padding: 16px;">지도단계 정보가 없습니다.</p>';
    }

    var html = '';
    var lastIdx = journeyStages.length - 1;

    journeyStages.forEach(function(stage, stageIdx) {
        var isCompleted = stage.status === 'completed';
        var isCurrent = stage.status === 'in-progress' || stage.status === 'current';
        var isUpcoming = stage.status === 'upcoming';
        var isLast = stageIdx === lastIdx;
        // 진행 중인 단계만 펼침, 나머지는 접힘
        var defaultCollapsed = !isCurrent;
        var hasSubStages = stage.subStages && stage.subStages.length > 0;

        // 기본단계 아이콘 (28px 사각형)
        var basicIcon = isCompleted
            ? '<div style="width: 28px; height: 28px; border-radius: 6px; background: #2E7D32; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>'
            : isCurrent
                ? '<div style="width: 28px; height: 28px; border-radius: 6px; background: #0288D1; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><div style="width: 10px; height: 10px; border-radius: 50%; background: white;"></div></div>'
                : '<div style="width: 28px; height: 28px; border-radius: 6px; background: #F5F5F5; border: 1px solid #E0E0E0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><div style="width: 10px; height: 10px; border-radius: 50%; background: #BDBDBD;"></div></div>';

        // 기본단계 상태 배지
        var basicBadge = isCompleted
            ? '<span style="padding: 3px 12px; background: #E8F5E9; color: #2E7D32; border-radius: 4px; font-size: 12px; font-weight: 600;">완료</span>'
            : isCurrent
                ? '<span style="padding: 3px 12px; background: #E3F2FD; color: #0288D1; border-radius: 4px; font-size: 12px; font-weight: 600;">진행 중</span>'
                : '<span style="padding: 3px 12px; background: #F5F5F5; color: #9E9E9E; border-radius: 4px; font-size: 12px; font-weight: 600;">예정</span>';

        // 완료일 표시
        var dateHtml = '';
        if (isCompleted && stage.completedDate) {
            dateHtml = '<span style="margin-left: auto; font-size: 12px; color: #9E9E9E;">' + stage.completedDate + '</span>';
        }

        // 토글 아이콘 (세부단계가 있는 경우만)
        var toggleIcon = '';
        if (hasSubStages) {
            var toggleRotate = defaultCollapsed ? '' : 'transform: rotate(180deg);';
            var toggleTitle = defaultCollapsed ? '펼치기' : '접기';
            toggleIcon = '<span class="modal-journey-toggle" data-stage="' + stageIdx + '" style="cursor: pointer; margin-left: 6px; display: inline-flex; align-items: center; color: #9ca3af; transition: transform 0.2s; ' + toggleRotate + '" title="' + toggleTitle + '"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>';
        }

        html += '<div style="margin-bottom: ' + (!isLast ? '4px' : '0') + ';">';
        // 기본단계 헤더
        html += '<div ' + (hasSubStages ? 'onclick="_toggleModalJourneyStage(' + stageIdx + ')"' : '') + ' style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: ' + (isCurrent ? '#F0F7FF' : '#F8F8F8') + '; border-radius: 8px; ' + (isCurrent ? 'border: 2px solid #90CAF9;' : 'border: 1px solid #EEEEEE;') + (hasSubStages ? ' cursor: pointer;' : '') + '">';
        html += basicIcon;
        html += '<span style="font-size: 15px; font-weight: 700; color: ' + (isUpcoming ? '#9E9E9E' : '#1a1a1a') + ';">' + stage.basicStageName + '</span>';
        html += basicBadge;
        html += toggleIcon;
        html += dateHtml;
        html += '</div>';

        // 세부단계 목록
        if (hasSubStages) {
            var borderColor = isCompleted ? '#A5D6A7' : isCurrent ? '#90CAF9' : '#E0E0E0';
            html += '<div id="modal-journey-sub-' + stageIdx + '" style="margin-left: 30px; ' + (!isLast ? 'border-left: 2px solid ' + borderColor + ';' : '') + ' padding-left: 28px; padding-top: 4px; padding-bottom: 4px; ' + (defaultCollapsed ? 'display: none;' : '') + '">';

            stage.subStages.forEach(function(sub, subIdx) {
                var subCompleted = sub.status === 'completed';
                var subCurrent = sub.status === 'current';
                var subUpcoming = sub.status === 'upcoming';

                // 세부단계 아이콘 (16px 원)
                var subIcon = subCompleted
                    ? '<div style="width: 16px; height: 16px; border-radius: 50%; background: #2E7D32; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>'
                    : subCurrent
                        ? '<div style="width: 16px; height: 16px; border-radius: 50%; background: #0288D1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"><div style="width: 6px; height: 6px; border-radius: 50%; background: white;"></div></div>'
                        : '<div style="width: 16px; height: 16px; border-radius: 50%; background: white; border: 2px solid #E0E0E0; flex-shrink: 0; margin-left: -38px; margin-right: 22px;"></div>';

                // 세부단계 배지
                var subBadge = subCompleted
                    ? '<span style="padding: 2px 10px; background: #E8F5E9; color: #2E7D32; border-radius: 4px; font-size: 11px; font-weight: 600;">완료</span>'
                    : subCurrent
                        ? '<span style="padding: 2px 10px; background: #E3F2FD; color: #0288D1; border-radius: 4px; font-size: 11px; font-weight: 600;">진행 중</span>'
                        : '<span style="padding: 2px 10px; background: #F5F5F5; color: #9E9E9E; border-radius: 4px; font-size: 11px; font-weight: 600;">예정</span>';

                // 세부단계 날짜
                var subPeriodHtml = '';
                if (!subCompleted) {
                    var subPeriods = [];
                    if (sub.submissionPeriod) subPeriods.push('<span style="color: #6A0028; font-weight: 500; font-size: 11px;">제출</span> ' + sub.submissionPeriod);
                    if (sub.reviewPeriod) subPeriods.push('<span style="color: #1565C0; font-weight: 500; font-size: 11px;">심사</span> ' + sub.reviewPeriod);
                    if (subPeriods.length > 0) {
                        subPeriodHtml = '<div style="margin-left: auto; font-size: 11px; color: #9E9E9E; display: flex; gap: 8px;">' + subPeriods.join(' <span style="color: #D1D5DB;">|</span> ') + '</div>';
                    }
                }

                html += '<div style="padding: 8px 0; ' + (subIdx < stage.subStages.length - 1 ? 'border-bottom: 1px solid #F3F4F6;' : '') + '">';
                html += '<div style="display: flex; align-items: center;">';
                html += subIcon;
                html += '<span style="font-size: 14px; color: ' + (subUpcoming ? '#9E9E9E' : '#374151') + '; ' + (subCurrent ? 'font-weight: 600;' : '') + '">' + sub.name + '</span>';
                html += '<span style="margin-left: 8px;">' + subBadge + '</span>';
                html += subPeriodHtml;
                html += '</div>';
                html += '</div>';
            });

            html += '</div>';
        }

        html += '</div>';
    });

    return html;
}

// 모달 내 기본단계 접기/펼치기 토글
function _toggleModalJourneyStage(stageIdx) {
    var subDiv = document.getElementById('modal-journey-sub-' + stageIdx);
    var toggle = document.querySelector('.modal-journey-toggle[data-stage="' + stageIdx + '"]');
    if (!subDiv) return;

    var isHidden = subDiv.style.display === 'none';
    subDiv.style.display = isHidden ? '' : 'none';
    if (toggle) {
        toggle.style.transform = isHidden ? 'rotate(180deg)' : '';
        toggle.title = isHidden ? '접기' : '펼치기';
    }
}

// 활동 이력 테이블 렌더링 (컬럼: 구분 | 활동내용 | 날짜)
function _renderActivityHistory(activities) {
    if (!activities || activities.length === 0) {
        return '<p style="color: #9CA3AF; text-align: center; padding: 16px;">활동 이력이 없습니다.</p>';
    }

    // 유형별 배지 스타일
    var badgeStyles = {
        submission: 'background: #F3E8FF; color: #7C3AED;',
        approved:   'background: #E8F5E9; color: #2E7D32;',
        rejected:   'background: #FEE2E2; color: #C81E1E;',
        guidance:   'background: #E3F2FD; color: #0288D1;',
        meeting:    'background: #FFF3E0; color: #E65100;'
    };

    var html = '<div style="font-size: 13px;">';
    // 헤더
    html += '<div style="display: grid; grid-template-columns: 80px 1fr 90px; background: #F9FAFB; border-bottom: 2px solid #E5E7EB; font-weight: 600; color: #374151;">';
    html += '<div style="padding: 8px 6px; text-align: center;">구분</div>';
    html += '<div style="padding: 8px 6px;">활동내용</div>';
    html += '<div style="padding: 8px 6px; text-align: center;">날짜</div>';
    html += '</div>';

    activities.forEach(function(a, idx) {
        var badge = badgeStyles[a.type] || 'background: #F5F5F5; color: #9E9E9E;';
        var fileLink = a.fileUrl
            ? '<a href="' + a.fileUrl + '" target="_blank" style="display: inline-block; margin-left: 6px; padding: 1px 6px; background: #6A0028; color: white; border-radius: 3px; font-size: 10px; text-decoration: none; vertical-align: middle;">파일</a>'
            : '';

        html += '<div style="display: grid; grid-template-columns: 80px 1fr 90px; border-bottom: 1px solid #E5E7EB;' + (idx % 2 === 1 ? ' background: #FAFAFA;' : '') + '">';
        // 구분 배지
        html += '<div style="padding: 8px 6px; text-align: center;"><span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; ' + badge + '">' + a.label + '</span></div>';
        // 활동내용 + 파일링크
        html += '<div style="padding: 8px 6px; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + a.content + fileLink + '</div>';
        // 날짜
        html += '<div style="padding: 8px 6px; text-align: center; color: #6B7280; font-size: 12px;">' + (a.date || '-') + '</div>';
        html += '</div>';
    });

    html += '</div>';
    return html;
}

// 전역 등록
window.showStudentDetailModal = showStudentDetailModal;
window.closeStudentDetailModal = closeStudentDetailModal;
window._toggleModalJourneyStage = _toggleModalJourneyStage;
