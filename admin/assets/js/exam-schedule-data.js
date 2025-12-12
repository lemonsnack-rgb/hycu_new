// ==================== 심사 일정 관리 Mock 데이터 ====================

/**
 * 심사 일정 데이터
 * - assignmentId: mockCommitteeAssignments의 id와 연결
 * - status: 'scheduled' | 'cancelled'
 */
const mockExamSchedules = [
    {
        scheduleId: "SCH001",
        assignmentId: "CA001",

        // 학생 정보 (조인용)
        studentId: "STU004",
        studentName: "최학생",
        studentNumber: "2024004",
        department: "경영학과",
        degreeType: "석사",

        // 심사 단계 정보
        stageId: "STAGE_TS001_005",
        stageName: "본심사",

        // 논문 제목
        thesisTitle: "ESG 경영이 기업 가치에 미치는 영향",

        // 일정 정보
        examDate: "2025-03-15",
        examTime: "14:00",
        duration: 60,  // 분

        // 진행 방식: "online" | "offline"
        method: "online",

        // 온라인 정보
        onlineInfo: {
            platform: "zoom",
            meetingUrl: "https://zoom.us/j/1234567890",
            meetingId: "123 456 7890",
            password: "abc123",
            hostUrl: "https://zoom.us/s/1234567890?zak=eyJ0..."
        },

        // 오프라인 정보
        offlineInfo: null,

        // 상태
        status: "scheduled",
        cancelReason: null,

        // 메타
        createdBy: "ADM001",
        createdAt: "2025-02-25T10:00:00",
        updatedBy: "ADM001",
        updatedAt: "2025-02-25T10:00:00"
    },
    {
        scheduleId: "SCH002",
        assignmentId: "CA002",

        studentId: "STU006",
        studentName: "강학생",
        studentNumber: "2024006",
        department: "교육학과",
        degreeType: "석사",

        stageId: "STAGE_TS001_005",
        stageName: "본심사",

        thesisTitle: "메타버스를 활용한 교육 프로그램 개발",

        examDate: "2025-03-20",
        examTime: "15:00",
        duration: 60,

        method: "offline",

        onlineInfo: null,

        offlineInfo: {
            location: "제1공학관 301호"
        },

        status: "scheduled",
        cancelReason: null,

        createdBy: "ADM001",
        createdAt: "2025-02-26T09:00:00",
        updatedBy: "ADM001",
        updatedAt: "2025-02-26T09:00:00"
    }
    // CA003 (윤학생 - 예비심사)은 일정 미등록 상태
];

/**
 * 논문 제목 조회 헬퍼 함수
 */
function getThesisTitleByReviewTargetId(reviewTargetId) {
    const target = mockReviewTargets ? mockReviewTargets.find(t => t.id === reviewTargetId) : null;
    return target ? target.title : '';
}

/**
 * 심사위원 배정 완료 건 조회
 */
function getCompletedAssignments() {
    if (typeof mockCommitteeAssignments === 'undefined') {
        console.error('mockCommitteeAssignments is not defined');
        return [];
    }
    return mockCommitteeAssignments.filter(assignment =>
        assignment.status === 'completed'
    );
}

/**
 * 특정 배정에 대한 일정 조회
 */
function getScheduleByAssignmentId(assignmentId) {
    return mockExamSchedules.find(schedule =>
        schedule.assignmentId === assignmentId &&
        schedule.status === 'scheduled'
    );
}

/**
 * 일정 등록 여부 체크
 */
function hasSchedule(assignmentId) {
    return !!getScheduleByAssignmentId(assignmentId);
}

/**
 * 심사 일정 목록 데이터 생성 (조인)
 */
function getExamScheduleListData() {
    const completedAssignments = getCompletedAssignments();

    return completedAssignments.map(assignment => {
        const schedule = getScheduleByAssignmentId(assignment.id);
        const thesisTitle = getThesisTitleByReviewTargetId(assignment.reviewTargetId);

        return {
            // 기본 정보
            assignmentId: assignment.id,
            studentId: assignment.studentId,
            studentName: assignment.studentName,
            studentNumber: assignment.studentNumber,
            department: assignment.department,
            degreeType: assignment.degreeType,

            // 심사 단계
            stageName: assignment.stageName,
            stageOrder: assignment.stageOrder,

            // 논문 정보
            thesisTitle: thesisTitle,

            // 심사위원
            chairName: assignment.chairName,
            members: assignment.members,

            // 일정 정보
            scheduleId: schedule?.scheduleId || null,
            hasSchedule: !!schedule,
            examDate: schedule?.examDate || null,
            examTime: schedule?.examTime || null,
            duration: schedule?.duration || null,
            method: schedule?.method || null,

            // 상태
            scheduleStatus: schedule ? 'scheduled' : 'unscheduled'
        };
    });
}

/**
 * type='review'인 단계 목록 조회 (필터용)
 */
function getReviewStageNames() {
    if (typeof mockThesisStages === 'undefined') {
        return [];
    }

    const stageNames = new Set();

    mockThesisStages.forEach(workflow => {
        workflow.stages
            .filter(stage => stage.type === 'review')
            .forEach(stage => {
                stageNames.add(stage.name);
            });
    });

    return Array.from(stageNames).sort();
}

// window 객체에 노출
if (typeof window !== 'undefined') {
    window.mockExamSchedules = mockExamSchedules;
    window.getCompletedAssignments = getCompletedAssignments;
    window.getScheduleByAssignmentId = getScheduleByAssignmentId;
    window.hasSchedule = hasSchedule;
    window.getExamScheduleListData = getExamScheduleListData;
    window.getReviewStageNames = getReviewStageNames;
    window.getThesisTitleByReviewTargetId = getThesisTitleByReviewTargetId;
}

console.log('✅ exam-schedule-data.js 로드 완료');
