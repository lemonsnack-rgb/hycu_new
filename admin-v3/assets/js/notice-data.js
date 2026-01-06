// ==================== 공지사항 데이터 관리 ====================

// 공지사항 Mock Data
const noticeDataStore = [
    {
        id: 'notice_001',
        title: '2025학년도 1학기 논문 지도 일정 안내',
        content: `
            <p>2025학년도 1학기 논문 지도 일정을 다음과 같이 안내드립니다.</p>
            <ul>
                <li>연구계획서 제출: 2025년 3월 1일 ~ 3월 15일</li>
                <li>중간논문 제출: 2025년 5월 1일 ~ 5월 31일</li>
                <li>최종논문 제출: 2025년 6월 1일 ~ 6월 30일</li>
                <li>학술지 심사 신청: 상시 접수</li>
            </ul>
            <p style="color: #d32f2f;">※ 각 단계별 제출 기한을 반드시 준수하시기 바랍니다.</p>
        `,
        author: '관리자',
        authorId: 'admin',
        createdAt: '2025-01-06 09:00',
        updatedAt: '2025-01-06 09:00',
        attachments: [
            { id: 'file_001', name: '2025-1학기_논문지도일정.pdf', size: 524288, url: '#' }
        ],
        hasAttachment: true,
        viewCount: 125
    },
    {
        id: 'notice_002',
        title: '논문 심사위원 배정 안내',
        content: `
            <p>논문 심사위원 배정 절차가 변경되었습니다.</p>
            <ul>
                <li>심사위원 배정은 관리자가 일괄 배정합니다</li>
                <li>배정 후 학생에게 자동으로 통보됩니다</li>
                <li>심사위원 변경 요청은 학과 사무실로 문의하시기 바랍니다</li>
            </ul>
        `,
        author: '학사운영팀',
        authorId: 'admin_002',
        createdAt: '2025-01-05 14:30',
        updatedAt: '2025-01-05 14:30',
        attachments: [],
        hasAttachment: false,
        viewCount: 87
    },
    {
        id: 'notice_003',
        title: '논문 제출 시 유의사항',
        content: `
            <p>논문 제출 시 다음 사항을 반드시 확인하시기 바랍니다.</p>
            <ul>
                <li>논문 파일은 PDF 형식으로 제출</li>
                <li>파일명: 학번_성명_논문종류.pdf (예: 2024001_홍길동_연구계획서.pdf)</li>
                <li>논문 표지에 학교 로고 및 학과명 필수 기재</li>
                <li>표절 검사 결과 제출 필수 (최종논문만 해당)</li>
            </ul>
        `,
        author: '관리자',
        authorId: 'admin',
        createdAt: '2025-01-04 10:15',
        updatedAt: '2025-01-04 10:15',
        attachments: [
            { id: 'file_002', name: '논문제출_체크리스트.xlsx', size: 102400, url: '#' },
            { id: 'file_003', name: '논문표지_양식.docx', size: 204800, url: '#' }
        ],
        hasAttachment: true,
        viewCount: 215
    },
    {
        id: 'notice_004',
        title: '2024학년도 2학기 학위 수여식 일정 공지',
        content: `
            <p>2024학년도 2학기 학위 수여식 일정을 안내합니다.</p>
            <h4>학위수여식 정보</h4>
            <ul>
                <li>일시: 2025년 2월 20일 (목) 14:00</li>
                <li>장소: 대강당</li>
                <li>복장: 학사복 착용 필수</li>
                <li>학사복 대여: 2월 10일 ~ 2월 19일</li>
            </ul>
            <p>자세한 사항은 첨부파일을 참고하시기 바랍니다.</p>
        `,
        author: '학사운영팀',
        authorId: 'admin_002',
        createdAt: '2025-01-03 16:45',
        updatedAt: '2025-01-03 16:45',
        attachments: [
            { id: 'file_004', name: '학위수여식_안내문.pdf', size: 819200, url: '#' }
        ],
        hasAttachment: true,
        viewCount: 342
    },
    {
        id: 'notice_005',
        title: '연구윤리 교육 이수 안내',
        content: `
            <p>모든 대학원생은 학위 취득 전 연구윤리 교육을 필수로 이수해야 합니다.</p>
            <h4>교육 일정</h4>
            <ul>
                <li>온라인 교육: LMS 시스템을 통해 상시 수강 가능</li>
                <li>집합 교육: 매월 첫째 주 수요일 14:00</li>
                <li>교육 시간: 약 2시간</li>
                <li>이수 확인: 교육 완료 후 자동으로 학사 시스템에 반영</li>
            </ul>
            <p>미이수 시 학위 취득이 불가하오니 반드시 이수하시기 바랍니다.</p>
        `,
        author: '연구윤리위원회',
        authorId: 'admin_003',
        createdAt: '2025-01-02 11:20',
        updatedAt: '2025-01-02 11:20',
        attachments: [],
        hasAttachment: false,
        viewCount: 178
    },
    {
        id: 'notice_006',
        title: '학술지 논문 심사 절차 변경 안내',
        content: `
            <p>2025학년도부터 학술지 논문 심사 절차가 다음과 같이 변경됩니다.</p>
            <h4>주요 변경사항</h4>
            <ul>
                <li>심사 신청: 온라인 시스템을 통한 전자 신청</li>
                <li>심사 기간: 신청 후 4주 이내</li>
                <li>심사 결과: 이메일 및 시스템을 통해 통보</li>
                <li>재심사: 1회에 한해 무료 재심사 가능</li>
            </ul>
        `,
        author: '관리자',
        authorId: 'admin',
        createdAt: '2024-12-28 13:50',
        updatedAt: '2024-12-28 13:50',
        attachments: [
            { id: 'file_005', name: '학술지논문심사_절차안내.pdf', size: 614400, url: '#' }
        ],
        hasAttachment: true,
        viewCount: 93
    },
    {
        id: 'notice_007',
        title: '겨울방학 중 행정실 운영 안내',
        content: `
            <p>겨울방학 기간 동안 행정실 운영 시간이 변경됩니다.</p>
            <h4>운영 시간</h4>
            <ul>
                <li>기간: 2024년 12월 23일 ~ 2025년 2월 28일</li>
                <li>평일: 09:00 ~ 17:00 (점심시간 12:00~13:00)</li>
                <li>토/일/공휴일: 휴무</li>
            </ul>
            <p>긴급 문의사항은 이메일로 연락 주시기 바랍니다.</p>
        `,
        author: '행정지원팀',
        authorId: 'admin_004',
        createdAt: '2024-12-20 15:30',
        updatedAt: '2024-12-20 15:30',
        attachments: [],
        hasAttachment: false,
        viewCount: 156
    },
    {
        id: 'notice_008',
        title: '대학원생 장학금 신청 안내',
        content: `
            <p>2025학년도 1학기 대학원생 장학금 신청을 다음과 같이 접수합니다.</p>
            <h4>신청 안내</h4>
            <ul>
                <li>신청 기간: 2025년 1월 15일 ~ 2월 15일</li>
                <li>신청 방법: 학사 시스템 온라인 신청</li>
                <li>제출 서류: 성적증명서, 재학증명서, 소득증명서</li>
                <li>결과 발표: 2025년 3월 1일</li>
            </ul>
            <p>자세한 내용은 첨부파일을 참고하시기 바랍니다.</p>
        `,
        author: '학생지원팀',
        authorId: 'admin_005',
        createdAt: '2024-12-15 10:00',
        updatedAt: '2024-12-15 10:00',
        attachments: [
            { id: 'file_006', name: '장학금신청_안내문.pdf', size: 716800, url: '#' },
            { id: 'file_007', name: '신청서_양식.docx', size: 153600, url: '#' }
        ],
        hasAttachment: true,
        viewCount: 284
    },
    {
        id: 'notice_009',
        title: '논문 작성 워크샵 개최 안내',
        content: `
            <p>대학원생을 위한 논문 작성 워크샵을 다음과 같이 개최합니다.</p>
            <h4>워크샵 정보</h4>
            <ul>
                <li>일시: 2025년 2월 5일 (수) 13:00 ~ 17:00</li>
                <li>장소: 대학원 세미나실 (온라인 동시 진행)</li>
                <li>주제: 학위논문 작성법 및 연구방법론</li>
                <li>강사: 김교수 (연구방법론 전공)</li>
                <li>참가 신청: 이메일 접수 (선착순 50명)</li>
            </ul>
        `,
        author: '대학원지원팀',
        authorId: 'admin_006',
        createdAt: '2024-12-10 14:25',
        updatedAt: '2024-12-10 14:25',
        attachments: [],
        hasAttachment: false,
        viewCount: 167
    },
    {
        id: 'notice_010',
        title: '학위논문 제본 업체 안내',
        content: `
            <p>학위논문 제본을 위한 협력 업체를 안내합니다.</p>
            <h4>제본 업체 정보</h4>
            <ul>
                <li>업체명: OO제본소</li>
                <li>위치: 학교 정문 앞</li>
                <li>연락처: 02-1234-5678</li>
                <li>제본 비용: 하드커버 기준 약 15,000원</li>
                <li>소요 시간: 1~2일</li>
            </ul>
            <p>제본 시 학교 양식을 준수해야 하며, 자세한 사항은 첨부파일을 참고하시기 바랍니다.</p>
        `,
        author: '관리자',
        authorId: 'admin',
        createdAt: '2024-12-05 09:40',
        updatedAt: '2024-12-05 09:40',
        attachments: [
            { id: 'file_008', name: '논문제본_양식기준.pdf', size: 409600, url: '#' }
        ],
        hasAttachment: true,
        viewCount: 201
    }
];

// localStorage key
const NOTICE_STORAGE_KEY = 'noticeManagementData';

// ==================== 초기화 함수 ====================
function initNoticeData() {
    console.log('🔧 initNoticeData 호출됨');
    console.log('🔧 NOTICE_STORAGE_KEY:', NOTICE_STORAGE_KEY);
    console.log('🔧 noticeDataStore 개수:', noticeDataStore.length);

    const existingData = localStorage.getItem(NOTICE_STORAGE_KEY);
    console.log('🔧 기존 데이터 존재 여부:', !!existingData);

    if (!existingData) {
        localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(noticeDataStore));
        console.log('✅ 공지사항 초기 데이터 생성 완료 (' + noticeDataStore.length + '건)');

        // 검증
        const saved = localStorage.getItem(NOTICE_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        console.log('✅ 저장 검증:', parsed.length, '건');
    } else {
        const parsed = JSON.parse(existingData);
        console.log('✅ 기존 공지사항 데이터 로드 (' + parsed.length + '건)');
    }
}

// ==================== CRUD 함수 ====================

// 전체 공지사항 조회
function getAllNotices() {
    console.log('📥 getAllNotices 호출됨');
    const data = localStorage.getItem(NOTICE_STORAGE_KEY);
    console.log('📥 localStorage에서 가져온 데이터:', data ? 'O' : 'X');
    const result = data ? JSON.parse(data) : [];
    console.log('📥 반환할 데이터 개수:', result.length);
    return result;
}

// 공지사항 ID로 조회
function getNoticeById(id) {
    const notices = getAllNotices();
    return notices.find(notice => notice.id === id);
}

// 공지사항 저장 (신규/수정)
function saveNotice(noticeData) {
    try {
        const notices = getAllNotices();
        const existingIndex = notices.findIndex(n => n.id === noticeData.id);

        if (existingIndex !== -1) {
            // 수정
            notices[existingIndex] = {
                ...notices[existingIndex],
                ...noticeData,
                updatedAt: getCurrentDateTime()
            };
        } else {
            // 신규
            const newNotice = {
                ...noticeData,
                id: generateNoticeId(),
                createdAt: getCurrentDateTime(),
                updatedAt: getCurrentDateTime(),
                viewCount: 0
            };
            notices.unshift(newNotice); // 최신 순으로 추가
        }

        localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(notices));
        return true;
    } catch (error) {
        console.error('❌ 공지사항 저장 실패:', error);
        return false;
    }
}

// 공지사항 삭제
function deleteNotice(id) {
    try {
        const notices = getAllNotices();
        const filteredNotices = notices.filter(notice => notice.id !== id);
        localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(filteredNotices));
        return true;
    } catch (error) {
        console.error('❌ 공지사항 삭제 실패:', error);
        return false;
    }
}

// 조회수 증가
function incrementViewCount(id) {
    try {
        const notices = getAllNotices();
        const notice = notices.find(n => n.id === id);
        if (notice) {
            notice.viewCount = (notice.viewCount || 0) + 1;
            localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(notices));
        }
    } catch (error) {
        console.error('❌ 조회수 증가 실패:', error);
    }
}

// ==================== 유틸리티 함수 ====================

// 공지사항 ID 생성
function generateNoticeId() {
    const notices = getAllNotices();
    const maxId = notices.reduce((max, notice) => {
        const num = parseInt(notice.id.replace('notice_', ''));
        return num > max ? num : max;
    }, 0);
    return `notice_${String(maxId + 1).padStart(3, '0')}`;
}

// 현재 날짜/시간 반환 (YYYY-MM-DD HH:MM 형식)
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 파일 크기를 읽기 쉬운 형식으로 변환
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 즉시 초기화 실행
initNoticeData();

// window 객체에 함수 노출 (다른 파일에서 접근 가능하도록)
window.getAllNotices = getAllNotices;
window.getNoticeById = getNoticeById;
window.saveNotice = saveNotice;
window.deleteNotice = deleteNotice;
window.incrementViewCount = incrementViewCount;
window.formatFileSize = formatFileSize;

console.log('✅ notice-data.js 로드 완료');
console.log('✅ window.getAllNotices:', typeof window.getAllNotices);
