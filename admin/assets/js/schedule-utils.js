// ==================== 심사 일정 유틸리티 ====================

/**
 * 날짜/시간 문자열을 Date 객체로 변환
 * @param {string} dateStr - 날짜 (YYYY-MM-DD)
 * @param {string} timeStr - 시간 (HH:mm)
 * @returns {Date}
 */
function parseDateTime(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}:00`);
}

/**
 * 시간 범위 겹침 여부 확인
 * @param {Date} start1 - 범위1 시작
 * @param {Date} end1 - 범위1 종료
 * @param {Date} start2 - 범위2 시작
 * @param {Date} end2 - 범위2 종료
 * @returns {boolean}
 */
function isTimeRangeOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
}

/**
 * 심사 일정 충돌 체크
 * @param {string} examDate - 심사 날짜 (YYYY-MM-DD)
 * @param {string} examTime - 심사 시간 (HH:mm)
 * @param {number} duration - 소요 시간 (분)
 * @param {Array} committeeMembers - 심사위원 목록
 * @param {string} excludeScheduleId - 제외할 일정 ID (수정 시)
 * @returns {Object} - { hasConflict: boolean, conflicts: Array }
 */
function checkScheduleConflict(examDate, examTime, duration, committeeMembers, excludeScheduleId = null) {
    if (typeof mockExamSchedules === 'undefined') {
        return { hasConflict: false, conflicts: [] };
    }

    const newStart = parseDateTime(examDate, examTime);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    const conflicts = [];

    // 모든 등록된 일정 확인
    mockExamSchedules.forEach(schedule => {
        // 자기 자신은 제외
        if (schedule.scheduleId === excludeScheduleId) {
            return;
        }

        // 취소된 일정은 제외
        if (schedule.status === 'cancelled') {
            return;
        }

        const scheduleStart = parseDateTime(schedule.examDate, schedule.examTime);
        const scheduleEnd = new Date(scheduleStart.getTime() + schedule.duration * 60000);

        // 시간 범위 겹침 체크
        if (!isTimeRangeOverlap(newStart, newEnd, scheduleStart, scheduleEnd)) {
            return;
        }

        // 겹치는 경우, 심사위원 중복 체크
        const assignment = mockCommitteeAssignments.find(a => a.id === schedule.assignmentId);
        if (!assignment) {
            return;
        }

        // 중복되는 심사위원 찾기
        const conflictingMembers = [];
        committeeMembers.forEach(member => {
            const found = assignment.members.find(m => m.professorId === member.professorId);
            if (found) {
                conflictingMembers.push({
                    professorId: member.professorId,
                    professorName: member.professorName,
                    role: member.role,
                    department: member.department
                });
            }
        });

        if (conflictingMembers.length > 0) {
            conflicts.push({
                scheduleId: schedule.scheduleId,
                studentName: schedule.studentName,
                studentNumber: schedule.studentNumber,
                stageName: schedule.stageName,
                examDate: schedule.examDate,
                examTime: schedule.examTime,
                duration: schedule.duration,
                conflictingMembers: conflictingMembers
            });
        }
    });

    return {
        hasConflict: conflicts.length > 0,
        conflicts: conflicts
    };
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD → YYYY년 MM월 DD일)
 * @param {string} dateStr - 날짜 문자열
 * @returns {string}
 */
function formatDateKorean(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

/**
 * 시간 포맷팅 (HH:mm → HH시 mm분)
 * @param {string} timeStr - 시간 문자열
 * @returns {string}
 */
function formatTimeKorean(timeStr) {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    return `${hour}시 ${minute}분`;
}

/**
 * 날짜/시간 범위 포맷팅
 * @param {string} dateStr - 날짜
 * @param {string} timeStr - 시작 시간
 * @param {number} duration - 소요 시간 (분)
 * @returns {string}
 */
function formatDateTimeRange(dateStr, timeStr, duration) {
    const start = parseDateTime(dateStr, timeStr);
    const end = new Date(start.getTime() + duration * 60000);

    const dateFormatted = formatDateKorean(dateStr);
    const startTime = timeStr;
    const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

    return `${dateFormatted} ${startTime} ~ ${endTime}`;
}

/**
 * 충돌 경고 HTML 생성
 * @param {Array} conflicts - 충돌 목록
 * @returns {string}
 */
function generateConflictWarningHTML(conflicts) {
    if (conflicts.length === 0) {
        return '';
    }

    let html = '<div class="space-y-3">';

    conflicts.forEach(conflict => {
        html += `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div class="text-sm font-medium text-gray-800 mb-2">
                    ${conflict.studentName} (${conflict.studentNumber}) - ${conflict.stageName}
                </div>
                <div class="text-xs text-gray-600 mb-2">
                    일정: ${conflict.examDate} ${conflict.examTime} (${conflict.duration}분)
                </div>
                <div class="text-xs text-red-600">
                    중복 심사위원:
                    ${conflict.conflictingMembers.map(m =>
                        `${m.professorName} ${m.role === 'chair' ? '(위원장)' : '(위원)'}`
                    ).join(', ')}
                </div>
            </div>
        `;
    });

    html += '</div>';

    return html;
}

/**
 * 오늘 날짜 문자열 반환 (YYYY-MM-DD)
 * @returns {string}
 */
function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 날짜 유효성 검증 (오늘 이후만 가능)
 * @param {string} dateStr - 날짜 문자열
 * @returns {boolean}
 */
function isValidFutureDate(dateStr) {
    const today = new Date(getTodayString());
    const selected = new Date(dateStr);
    return selected >= today;
}

// window 객체에 노출
if (typeof window !== 'undefined') {
    window.checkScheduleConflict = checkScheduleConflict;
    window.formatDateKorean = formatDateKorean;
    window.formatTimeKorean = formatTimeKorean;
    window.formatDateTimeRange = formatDateTimeRange;
    window.generateConflictWarningHTML = generateConflictWarningHTML;
    window.getTodayString = getTodayString;
    window.isValidFutureDate = isValidFutureDate;
}

console.log('✅ schedule-utils.js 로드 완료');
