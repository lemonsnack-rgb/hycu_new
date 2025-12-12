// ==================== Zoom API 시뮬레이터 ====================
// 실제 Zoom API 연동 전 시뮬레이션용 모듈

/**
 * Zoom 미팅 ID 생성 (10자리 숫자)
 */
function generateMeetingId() {
    let id = '';
    for (let i = 0; i < 10; i++) {
        id += Math.floor(Math.random() * 10);
    }
    return id;
}

/**
 * Zoom 미팅 비밀번호 생성 (6자리 영숫자)
 */
function generateMeetingPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

/**
 * Zoom 미팅 생성 시뮬레이션
 * @param {Object} meetingData - 미팅 정보
 * @param {string} meetingData.topic - 미팅 제목
 * @param {string} meetingData.startTime - 시작 시간 (ISO 8601)
 * @param {number} meetingData.duration - 소요 시간 (분)
 * @param {string} meetingData.timezone - 타임존
 * @returns {Promise<Object>} - 미팅 생성 결과
 */
async function createZoomMeetingSimulation(meetingData) {
    return new Promise((resolve, reject) => {
        // 1.5초 후 응답 (API 호출 시뮬레이션)
        setTimeout(() => {
            // 10% 확률로 실패 시뮬레이션
            if (Math.random() < 0.1) {
                reject({
                    success: false,
                    error: {
                        code: 'api_error',
                        message: 'Zoom API 연결에 실패했습니다. 잠시 후 다시 시도해주세요.'
                    }
                });
                return;
            }

            const meetingId = generateMeetingId();
            const password = generateMeetingPassword();

            resolve({
                success: true,
                data: {
                    meetingId: meetingId,
                    meetingUrl: `https://zoom.us/j/${meetingId}?pwd=${password}`,
                    password: password,
                    hostUrl: `https://zoom.us/s/${meetingId}?zak=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`,
                    topic: meetingData.topic,
                    startTime: meetingData.startTime,
                    duration: meetingData.duration,
                    timezone: meetingData.timezone || 'Asia/Seoul',
                    status: 'waiting'
                }
            });
        }, 1500);
    });
}

/**
 * Zoom 미팅 삭제 시뮬레이션
 * @param {string} meetingId - 미팅 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
async function deleteZoomMeetingSimulation(meetingId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 5% 확률로 실패 시뮬레이션
            if (Math.random() < 0.05) {
                reject({
                    success: false,
                    error: {
                        code: 'not_found',
                        message: '존재하지 않는 미팅입니다.'
                    }
                });
                return;
            }

            resolve({
                success: true,
                message: 'Zoom 미팅이 삭제되었습니다.'
            });
        }, 800);
    });
}

/**
 * Zoom 미팅 정보 조회 시뮬레이션
 * @param {string} meetingId - 미팅 ID
 * @returns {Promise<Object>} - 미팅 정보
 */
async function getZoomMeetingSimulation(meetingId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.05) {
                reject({
                    success: false,
                    error: {
                        code: 'not_found',
                        message: '존재하지 않는 미팅입니다.'
                    }
                });
                return;
            }

            resolve({
                success: true,
                data: {
                    meetingId: meetingId,
                    status: 'waiting',
                    topic: '논문 심사',
                    startTime: new Date().toISOString(),
                    duration: 60
                }
            });
        }, 500);
    });
}

/**
 * 실제 API 연동 함수 (서버 통신)
 * 현재는 시뮬레이션 함수 호출
 */
async function createZoomMeeting(meetingData) {
    // TODO: 실제 서버 API 호출로 변경
    // return await fetch('/api/zoom/meeting', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(meetingData)
    // });

    return await createZoomMeetingSimulation(meetingData);
}

/**
 * Zoom 미팅 삭제
 */
async function deleteZoomMeeting(meetingId) {
    // TODO: 실제 서버 API 호출로 변경
    // return await fetch(`/api/zoom/meeting/${meetingId}`, {
    //     method: 'DELETE'
    // });

    return await deleteZoomMeetingSimulation(meetingId);
}

/**
 * Zoom 미팅 정보 조회
 */
async function getZoomMeeting(meetingId) {
    // TODO: 실제 서버 API 호출로 변경
    return await getZoomMeetingSimulation(meetingId);
}

// window 객체에 노출
if (typeof window !== 'undefined') {
    window.createZoomMeeting = createZoomMeeting;
    window.deleteZoomMeeting = deleteZoomMeeting;
    window.getZoomMeeting = getZoomMeeting;
}

console.log('✅ zoom-api-simulator.js 로드 완료');
