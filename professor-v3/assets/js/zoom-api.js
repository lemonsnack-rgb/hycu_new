/**
 * ================================================================
 * Zoom API 시뮬레이션
 * ================================================================
 * 실제 Zoom API 연동 전까지 시뮬레이션으로 작동
 *
 * 실제 연동 시에는 백엔드 API를 통해 Zoom API를 호출해야 함
 * - POST /api/zoom/meetings (미팅 생성)
 * - DELETE /api/zoom/meetings/:meetingId (미팅 삭제)
 * - GET /api/zoom/meetings/:meetingId (미팅 정보 조회)
 */

/**
 * Zoom 미팅 생성 (시뮬레이션)
 * @param {Object} options - 미팅 옵션
 * @param {string} options.topic - 미팅 제목
 * @param {string} options.start_time - 시작 시간 (ISO 8601 format)
 * @param {number} options.duration - 소요 시간 (분)
 * @returns {Promise<Object>} - Zoom 미팅 정보
 */
async function createZoomMeeting(options) {
    console.log('🎥 Zoom 미팅 생성 요청:', options);

    // 2초 대기 (실제 API 호출하는 것처럼)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 랜덤 ID 생성
    const meetingId = Math.floor(Math.random() * 900000000) + 100000000;
    const password = Math.random().toString(36).substring(2, 8);
    const token = Math.random().toString(36).substring(2, 15);

    const zoomInfo = {
        id: meetingId.toString(),
        join_url: `https://zoom.us/j/${meetingId}?pwd=${password}`,
        password: password,
        start_url: `https://zoom.us/s/${meetingId}?zak=${token}`,
        topic: options.topic,
        start_time: options.start_time,
        duration: options.duration,
        host_id: 'professor_host_id',
        created_at: new Date().toISOString()
    };

    console.log('✅ Zoom 미팅 생성 완료:', zoomInfo);
    return zoomInfo;
}

/**
 * Zoom 미팅 삭제 (시뮬레이션)
 * @param {string} meetingId - 삭제할 미팅 ID
 * @returns {Promise<Object>} - 결과
 */
async function deleteZoomMeeting(meetingId) {
    console.log('🗑️ Zoom 미팅 삭제 요청:', meetingId);

    // 1초 대기
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✅ Zoom 미팅 삭제 완료:', meetingId);
    return { success: true, meetingId: meetingId };
}

/**
 * Zoom 미팅 정보 조회 (시뮬레이션)
 * @param {string} meetingId - 조회할 미팅 ID
 * @returns {Promise<Object>} - 미팅 정보
 */
async function getZoomMeeting(meetingId) {
    console.log('🔍 Zoom 미팅 조회 요청:', meetingId);

    // 1초 대기
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 시뮬레이션 데이터 반환
    const meetingInfo = {
        id: meetingId,
        topic: '논문지도 미팅',
        status: 'waiting',
        start_time: new Date().toISOString(),
        duration: 60,
        join_url: `https://zoom.us/j/${meetingId}`,
        created_at: new Date().toISOString()
    };

    console.log('✅ Zoom 미팅 조회 완료:', meetingInfo);
    return meetingInfo;
}

/**
 * Zoom 미팅 업데이트 (시뮬레이션)
 * @param {string} meetingId - 업데이트할 미팅 ID
 * @param {Object} updates - 업데이트할 내용
 * @returns {Promise<Object>} - 업데이트된 미팅 정보
 */
async function updateZoomMeeting(meetingId, updates) {
    console.log('📝 Zoom 미팅 업데이트 요청:', meetingId, updates);

    // 1초 대기
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✅ Zoom 미팅 업데이트 완료:', meetingId);
    return { success: true, meetingId: meetingId, updates: updates };
}

// 전역 export
window.createZoomMeeting = createZoomMeeting;
window.deleteZoomMeeting = deleteZoomMeeting;
window.getZoomMeeting = getZoomMeeting;
window.updateZoomMeeting = updateZoomMeeting;

console.log('✅ Zoom API 시뮬레이션 로드 완료');
