// ========== 콘텐츠 관리 데이터 저장소 (학과별 버전) ==========
// localStorage를 사용하여 데이터 영속성 제공
// 각 콘텐츠 타입은 학과별 배열로 관리

const contentData = {
    // 연구윤리 콘텐츠 (공지사항 방식 - 목록)
    ethics: [
        {
            id: 'ethics_001',
            title: '연구윤리',
            author: 'admin',
            visibility: 'all',
            targetDepartments: ['all'],
            createdAt: '2025-01-06',
            content: `<div style="line-height: 1.8; font-size: 14px; color: #333;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">연구윤리 준수 안내</h3>

    <p style="margin-bottom: 30px;">
        학위논문 작성 시 연구윤리를 준수하는 것은 학문적 성실성과 신뢰성을 확보하기 위한 필수 요건입니다.
        모든 학생은 아래의 연구윤리 지침을 반드시 숙지하고 준수해야 합니다.
    </p>

    <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333;">연구윤리 위반 유형</h4>

    <p style="margin-bottom: 15px;"><strong>1. 표절 (Plagiarism)</strong></p>
    <p style="margin-bottom: 30px;">
        타인의 아이디어나 연구 결과를 적절한 인용 없이 자신의 것처럼 사용하는 행위입니다.
        직접 인용, 간접 인용 모두 반드시 출처를 명시해야 합니다.
    </p>

    <p style="margin-bottom: 15px;"><strong>2. 위조 및 변조 (Fabrication & Falsification)</strong></p>
    <p style="margin-bottom: 30px;">
        존재하지 않는 데이터나 연구 결과를 만들어내거나(위조), 연구 자료를 임의로 변경하거나 누락시켜
        연구 내용 또는 결과를 왜곡하는 행위(변조)입니다.
    </p>

    <p style="margin-bottom: 15px;"><strong>3. 부당한 저자 표시 (Improper Authorship)</strong></p>
    <p style="margin-bottom: 30px;">
        연구에 실질적인 기여를 하지 않은 사람을 저자로 표시하거나, 실질적인 기여를 한 사람을 저자에서 제외하는 행위입니다.
    </p>

    <p style="margin-bottom: 15px;"><strong>4. 중복 게재 (Duplicate Publication)</strong></p>
    <p style="margin-bottom: 30px;">
        이미 출판된 자신의 연구 결과를 새로운 연구 결과인 것처럼 다시 출판하는 행위입니다.
    </p>

    <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; margin-top: 40px; color: #333;">연구윤리 위반 시 제재</h4>

    <p style="margin-bottom: 15px;">
        연구윤리 위반이 확인될 경우 다음과 같은 제재가 가해질 수 있습니다:
    </p>

    <ul style="margin-bottom: 30px; padding-left: 20px;">
        <li style="margin-bottom: 10px;">논문 제출 불가 또는 심사 보류</li>
        <li style="margin-bottom: 10px;">학위 취소 또는 논문 게재 철회</li>
        <li style="margin-bottom: 10px;">일정 기간 논문 제출 금지</li>
        <li style="margin-bottom: 10px;">학칙에 따른 징계 (경고, 유급, 제적 등)</li>
    </ul>

    <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; margin-top: 40px; color: #333;">연구윤리 교육</h4>

    <p style="margin-bottom: 15px;">
        본교는 모든 대학원생을 대상으로 연구윤리 교육을 실시하고 있습니다.
    </p>

    <ul style="margin-bottom: 30px; padding-left: 20px;">
        <li style="margin-bottom: 10px;">온라인 연구윤리 교육 이수 의무화</li>
        <li style="margin-bottom: 10px;">교육 미이수 시 논문 제출 불가</li>
        <li style="margin-bottom: 10px;">연구윤리 서약서 제출 필수</li>
    </ul>

    <p style="margin-top: 40px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #d32f2f; color: #d32f2f;">
        <strong>※ 연구윤리 위반은 학문적 신뢰를 훼손하는 중대한 행위입니다.</strong><br>
        논문 작성 시 반드시 연구윤리를 준수하시기 바랍니다.
    </p>
</div>`
        }
    ],

    // 논문일정 콘텐츠 (공지사항 방식 - 목록)
    schedule: [
        {
            id: 'schedule_001',
            title: '논문일정',
            author: 'admin',
            visibility: 'all',
            targetDepartments: ['all'],
            createdAt: '2025-01-06',
            content: `<div style="line-height: 1.8; font-size: 14px; color: #333;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">2025학년도 학위논문 일정 안내</h3>

    <p style="margin-bottom: 30px;">
        2025학년도 학위논문 제출 및 심사 일정을 안내드립니다.
        각 단계별 일정을 확인하시고 기한 내에 필요한 절차를 진행하시기 바랍니다.
    </p>

    <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333;">1학기 일정</h4>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
            <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: bold;">구분</th>
                <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: bold;">제출 기간</th>
                <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: bold;">심사 기간</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">연구계획서</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.03.01 ~ 03.15</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.03.16 ~ 03.30</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">중간논문</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.05.01 ~ 05.15</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.05.16 ~ 05.31</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">예비심사</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.07.01 ~ 07.15</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.07.16 ~ 07.31</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">본심사</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.08.01 ~ 08.15</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.08.16 ~ 08.30</td>
            </tr>
        </tbody>
    </table>

    <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333;">2학기 일정</h4>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
            <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: bold;">구분</th>
                <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: bold;">제출 기간</th>
                <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: bold;">심사 기간</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">연구계획서</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.09.01 ~ 09.15</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.09.16 ~ 09.30</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">중간논문</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.11.01 ~ 11.15</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2025.11.16 ~ 11.30</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">예비심사</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2026.01.01 ~ 01.15</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2026.01.16 ~ 01.31</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">본심사</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2026.02.01 ~ 02.15</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">2026.02.16 ~ 02.28</td>
            </tr>
        </tbody>
    </table>

    <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; margin-top: 40px; color: #333;">유의사항</h4>

    <ul style="margin-bottom: 30px; padding-left: 20px;">
        <li style="margin-bottom: 10px;">제출 기한을 엄수해 주시기 바랍니다. 기한 경과 시 다음 학기로 자동 이월됩니다.</li>
        <li style="margin-bottom: 10px;">심사 일정은 심사위원의 사정에 따라 변경될 수 있습니다.</li>
        <li style="margin-bottom: 10px;">논문 제출 전 지도교수의 확인을 받으시기 바랍니다.</li>
        <li style="margin-bottom: 10px;">학위 수여는 학기 종료 후 익월에 이루어집니다.</li>
    </ul>

    <p style="margin-top: 40px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #1976d2; color: #1976d2;">
        <strong>※ 자세한 사항은 대학원 홈페이지 또는 행정실로 문의하시기 바랍니다.</strong>
    </p>
</div>`
        }
    ],

    // 논문지도절차 콘텐츠 (공지사항 방식 - 목록)
    procedure: [
        {
            id: 'procedure_001',
            title: '논문 지도 절차',
            author: 'admin',
            visibility: 'all',
            targetDepartments: ['all'],
            createdAt: '2025-01-06',
            content: `<div style="line-height: 1.8; font-size: 14px; color: #333;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">논문 지도 절차 안내</h3>

    <p style="margin-bottom: 30px;">
        학위논문 작성을 위한 전체 지도 절차를 안내드립니다.
        각 단계별 요건을 충족하고 체계적으로 논문을 준비하시기 바랍니다.
    </p>

    <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333;">지도 절차</h4>

    <ol style="margin-bottom: 30px; padding-left: 20px;">
        <li style="margin-bottom: 20px;">
            <strong>지도교수 배정</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">입학 후 첫 학기 중 지도교수 배정</li>
                <li style="margin-bottom: 8px;">전공 분야 및 연구 주제를 고려하여 배정</li>
                <li style="margin-bottom: 8px;">배정 후 지도교수와 연구 방향 상담</li>
            </ul>
        </li>

        <li style="margin-bottom: 20px;">
            <strong>연구계획서 작성 및 제출</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">연구 주제, 목적, 방법론 등을 포함한 계획서 작성</li>
                <li style="margin-bottom: 8px;">지도교수의 승인 후 제출</li>
                <li style="margin-bottom: 8px;">연구윤리 교육 이수 필수</li>
            </ul>
        </li>

        <li style="margin-bottom: 20px;">
            <strong>중간논문 작성 및 심사</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">연구계획서 승인 후 중간 연구 결과물 작성</li>
                <li style="margin-bottom: 8px;">지도교수의 지도 하에 연구 진행</li>
                <li style="margin-bottom: 8px;">중간 심사를 통한 연구 방향 점검</li>
            </ul>
        </li>

        <li style="margin-bottom: 20px;">
            <strong>예비심사</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">논문 초고 작성 완료 후 예비심사 신청</li>
                <li style="margin-bottom: 8px;">심사위원 3인 이상으로 심사위원회 구성</li>
                <li style="margin-bottom: 8px;">논문의 형식과 내용에 대한 전반적 검토</li>
            </ul>
        </li>

        <li style="margin-bottom: 20px;">
            <strong>본심사</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">예비심사 통과 및 수정 완료 후 본심사 신청</li>
                <li style="margin-bottom: 8px;">최종 논문에 대한 심사 진행</li>
                <li style="margin-bottom: 8px;">심사 통과 시 학위 수여 자격 획득</li>
            </ul>
        </li>

        <li style="margin-bottom: 20px;">
            <strong>최종 논문 제출 및 학위 수여</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">심사 통과 후 최종 수정본 제출</li>
                <li style="margin-bottom: 8px;">논문 제출 요건 확인 (표지, 초록, 인쇄 부수 등)</li>
                <li style="margin-bottom: 8px;">학위수여식에서 학위 취득</li>
            </ul>
        </li>
    </ol>

    <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; margin-top: 40px; color: #333;">논문 지도 시간</h4>

    <p style="margin-bottom: 15px;">
        각 학기별로 최소 지도 시간을 충족해야 합니다:
    </p>

    <ul style="margin-bottom: 30px; padding-left: 20px;">
        <li style="margin-bottom: 10px;">학기당 최소 8시간 이상 지도 필수</li>
        <li style="margin-bottom: 10px;">온라인/오프라인 지도 모두 인정</li>
        <li style="margin-bottom: 10px;">지도 내용을 시스템에 기록</li>
    </ul>

    <p style="margin-top: 40px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #d32f2f; color: #d32f2f;">
        <strong>※ 각 단계별 심사를 통과하지 못한 경우 다음 학기에 재심사를 받아야 합니다.</strong>
    </p>

    <p style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #1976d2; color: #1976d2;">
        <strong>※ 논문 작성 및 심사와 관련된 자세한 사항은 학위논문 작성 지침을 참고하시기 바랍니다.</strong>
    </p>
</div>`
        }
    ]
};

// ========== localStorage 관리 함수 ==========

/**
 * 기존 단일 객체 데이터를 배열로 마이그레이션
 */
function migrateOldDataToArray(type) {
    const oldKey = `contentData_${type}`;
    const newKey = `contentData_${type}_list`;

    // 이미 마이그레이션 되었는지 확인
    const newData = localStorage.getItem(newKey);
    if (newData) {
        return JSON.parse(newData);
    }

    // 기존 데이터 확인
    const oldData = localStorage.getItem(oldKey);
    if (oldData) {
        try {
            const parsed = JSON.parse(oldData);
            // 단일 객체인 경우 배열로 변환 (department: 'all'로 설정)
            if (!Array.isArray(parsed)) {
                const migrated = [{
                    ...parsed,
                    department: 'all',
                    id: `${type}_all`
                }];
                localStorage.setItem(newKey, JSON.stringify(migrated));
                console.log(`✅ Migrated ${type} data to array format`);
                return migrated;
            }
        } catch (e) {
            console.error(`Migration error for ${type}:`, e);
        }
    }

    return null;
}

/**
 * 초기 데이터 로드
 */
function initContentData() {
    const types = ['ethics', 'schedule', 'procedure'];

    types.forEach(type => {
        // 마이그레이션 시도
        const migrated = migrateOldDataToArray(type);

        const storedKey = `contentData_${type}_list`;
        const stored = localStorage.getItem(storedKey);

        if (!stored && !migrated) {
            // 신규 데이터 저장
            localStorage.setItem(storedKey, JSON.stringify(contentData[type]));
        } else if (stored) {
            // 기존 배열 데이터 로드
            contentData[type] = JSON.parse(stored);
        } else if (migrated) {
            // 마이그레이션된 데이터 사용
            contentData[type] = migrated;
        }
    });
}

/**
 * 콘텐츠 목록 가져오기
 */
function getContentList(type) {
    const stored = localStorage.getItem(`contentData_${type}_list`);
    if (stored) {
        return JSON.parse(stored);
    }
    return contentData[type] || [];
}

/**
 * 학과별 콘텐츠 가져오기 (우선순위: 학과 전용 > 전체 공개)
 */
function getContentByDepartment(type, department) {
    const list = getContentList(type);

    // 1. 해당 학과 전용 콘텐츠 찾기
    let content = list.find(item => item.department === department);

    // 2. 없으면 전체 공개 콘텐츠 찾기
    if (!content) {
        content = list.find(item => item.department === 'all');
    }

    return content || null;
}

/**
 * 콘텐츠 저장하기 (공지사항 방식)
 */
function saveContentItem(type, contentItem) {
    // ID 생성 (없는 경우)
    if (!contentItem.id) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        contentItem.id = `${type}_${timestamp}_${random}`;
    }

    // 날짜 필드 업데이트
    const now = new Date().toISOString().split('T')[0];
    if (!contentItem.createdAt) {
        contentItem.createdAt = now;
    }
    contentItem.lastModified = now;

    const list = getContentList(type);
    const existingIndex = list.findIndex(item => item.id === contentItem.id);

    if (existingIndex >= 0) {
        // 기존 항목 업데이트 (createdAt 유지)
        contentItem.createdAt = list[existingIndex].createdAt || contentItem.createdAt;
        list[existingIndex] = contentItem;
    } else {
        // 신규 항목 추가
        list.push(contentItem);
    }

    // 저장
    localStorage.setItem(`contentData_${type}_list`, JSON.stringify(list));
    contentData[type] = list;

    return true;
}

/**
 * 콘텐츠 삭제하기
 */
function deleteContentItem(type, contentId) {
    const list = getContentList(type);
    const filtered = list.filter(item => item.id !== contentId);

    localStorage.setItem(`contentData_${type}_list`, JSON.stringify(filtered));
    contentData[type] = filtered;

    return true;
}

/**
 * 중복 체크 (제거됨 - 목록 방식에서는 중복 허용)
 * @deprecated 더 이상 사용되지 않음
 */
function checkDuplicateContent(type, department, excludeId = null) {
    // 목록 방식에서는 중복을 허용하므로 항상 false 반환
    return false;
}

/**
 * ID로 콘텐츠 가져오기
 */
function getContentById(type, contentId) {
    const list = getContentList(type);
    return list.find(item => item.id === contentId) || null;
}

// ========== 하위 호환성 함수 (기존 코드 지원) ==========

/**
 * 기존 getContent() 함수 - 'all' 콘텐츠 반환
 */
function getContent(type) {
    return getContentByDepartment(type, 'all');
}

/**
 * 기존 saveContent() 함수 - 'all' 콘텐츠로 저장
 */
function saveContent(type, data) {
    if (!data.department) {
        data.department = 'all';
    }
    return saveContentItem(type, data);
}

// 페이지 로드 시 초기화
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        initContentData();
        console.log('content-data.js loaded (department-based version)');
    });
}
