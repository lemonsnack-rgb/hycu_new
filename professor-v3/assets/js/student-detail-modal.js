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
    const submissions = _findSubmissions(s.stdNo);

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

    // 제출 문서 HTML
    const submissionsHtml = _renderSubmissionsHtml(submissions);

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

                    <!-- 지도단계 -->
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px;">지도단계</h3>
                        <div id="modal-vertical-journey" style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px;">
                            ${stageJourneyHtml}
                        </div>
                    </div>

                    <!-- 제출 문서 -->
                    <div style="width: 100%; max-width: 100%; overflow: hidden;">
                        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">제출 문서</h3>
                        <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; overflow: hidden; width: 100%;">
                            ${submissionsHtml}
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

// 학번으로 제출문서 조회
function _findSubmissions(stdNo) {
    const data = window.mockStageSubmissions || [];
    return data.filter(s =>
        s.studentId === stdNo ||
        s.studentId === 'STU' + String(stdNo).padStart(3, '0') ||
        s.studentNumber === stdNo
    ).sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));
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

// 제출 문서 HTML 렌더링
function _renderSubmissionsHtml(submissions) {
    if (!submissions || submissions.length === 0) {
        return '<p style="color: #9CA3AF; text-align: center; padding: 16px;">제출된 문서가 없습니다.</p>';
    }

    const getResultText = (result) => {
        if (result === 'pass' || result === 'approved') return '합격';
        if (result === 'fail' || result === 'rejected') return '불합격';
        return '-';
    };
    const getResultStyle = (result) => {
        if (result === 'pass' || result === 'approved') return 'color: #046C4E; font-weight: 600;';
        if (result === 'fail' || result === 'rejected') return 'color: #C81E1E; font-weight: 600;';
        return 'color: #6B7280;';
    };

    let html = '<div style="font-size: 13px;">';
    html += '<div style="display: grid; grid-template-columns: 1fr 90px 65px 70px; background: #F9FAFB; border-bottom: 2px solid #E5E7EB; font-weight: 600; color: #374151;">';
    html += '<div style="padding: 8px 6px;">지도단계</div>';
    html += '<div style="padding: 8px 6px; text-align: center;">제출일자</div>';
    html += '<div style="padding: 8px 6px; text-align: center;">심사결과</div>';
    html += '<div style="padding: 8px 6px; text-align: center;">첨부파일</div>';
    html += '</div>';

    submissions.forEach((s, idx) => {
        html += '<div style="display: grid; grid-template-columns: 1fr 90px 65px 70px; border-bottom: 1px solid #E5E7EB;' + (idx % 2 === 1 ? ' background: #FAFAFA;' : '') + '">';
        html += '<div style="padding: 8px 6px; color: #374151; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + (s.subStageName || s.stageName || '-') + '</div>';
        html += '<div style="padding: 8px 6px; text-align: center; color: #6B7280;">' + (s.submittedDate || '-') + '</div>';
        html += '<div style="padding: 8px 6px; text-align: center; ' + getResultStyle(s.reviewResult) + '">' + getResultText(s.reviewResult) + '</div>';
        html += '<div style="padding: 8px 6px; text-align: center;">' + (s.fileUrl ? '<a href="' + s.fileUrl + '" target="_blank" style="display: inline-block; padding: 2px 8px; background: #6A0028; color: white; border-radius: 3px; font-size: 11px; text-decoration: none;">다운로드</a>' : '-') + '</div>';
        html += '</div>';
    });

    html += '</div>';
    return html;
}

// 전역 등록
window.showStudentDetailModal = showStudentDetailModal;
window.closeStudentDetailModal = closeStudentDetailModal;
window._toggleModalJourneyStage = _toggleModalJourneyStage;
