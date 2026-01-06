// ========== 콘텐츠 관리 데이터 저장소 ==========
// localStorage를 사용하여 데이터 영속성 제공

const contentData = {
    // 연구윤리 콘텐츠 (단일)
    ethics: {
        id: 'ethics',
        title: '연구윤리',
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
</div>`,
        lastModified: '2025-01-06',
        modifiedBy: 'admin'
    },

    // 논문일정 콘텐츠 (단일)
    schedule: {
        id: 'schedule',
        title: '논문일정',
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
</div>`,
        lastModified: '2025-01-06',
        modifiedBy: 'admin'
    },

    // 논문지도절차 콘텐츠 (단일)
    procedure: {
        id: 'procedure',
        title: '논문 지도 절차',
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
</div>`,
        lastModified: '2025-01-06',
        modifiedBy: 'admin'
    }
};

// ========== localStorage 관리 함수 ==========

// 초기 데이터 로드
function initContentData() {
    const storedEthics = localStorage.getItem('contentData_ethics');
    const storedSchedule = localStorage.getItem('contentData_schedule');
    const storedProcedure = localStorage.getItem('contentData_procedure');

    if (!storedEthics) {
        localStorage.setItem('contentData_ethics', JSON.stringify(contentData.ethics));
    } else {
        contentData.ethics = JSON.parse(storedEthics);
    }

    if (!storedSchedule) {
        localStorage.setItem('contentData_schedule', JSON.stringify(contentData.schedule));
    } else {
        contentData.schedule = JSON.parse(storedSchedule);
    }

    if (!storedProcedure) {
        localStorage.setItem('contentData_procedure', JSON.stringify(contentData.procedure));
    } else {
        contentData.procedure = JSON.parse(storedProcedure);
    }
}

// 콘텐츠 가져오기
function getContent(type) {
    const stored = localStorage.getItem(`contentData_${type}`);
    if (stored) {
        return JSON.parse(stored);
    }
    return contentData[type];
}

// 콘텐츠 저장하기
function saveContent(type, data) {
    data.lastModified = new Date().toISOString().split('T')[0];
    contentData[type] = data;
    localStorage.setItem(`contentData_${type}`, JSON.stringify(data));
    return true;
}

// 페이지 로드 시 초기화
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        initContentData();
    });
}
