// ========== 뷰 렌더링 함수들 ==========

const views = {
    // ========== 대시보드 (업무 모니터링) ==========
    dashboard: () => `
        <style>
            .dash-top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .dash-bottom-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .dash-bottom-grid > div { min-width: 0; overflow: hidden; }
            .dash-card-table { overflow-x: auto; }
            .dash-card-table table { table-layout: auto; min-width: 600px; width: 100%; }
            @media (max-width: 1200px) {
                .dash-top-grid { grid-template-columns: 1fr; }
                .dash-bottom-grid { grid-template-columns: 1fr; }
            }
        </style>
        <!-- 상단: 공지사항 + 알림 -->
        <div class="dash-top-grid">
            <!-- 카드1: 행정 공지사항 -->
            <div style="background: white; border-radius: 8px; border: 1px solid #E5E7EB; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <h3 style="display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6A0028" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        행정 공지사항
                    </h3>
                    <a onclick="switchView('noticeManagement')" style="font-size: 13px; color: #6A0028; cursor: pointer; text-decoration: none; font-weight: 500;">더보기 &rarr;</a>
                </div>
                <div id="admin-dash-notices"><!-- 동적 생성 --></div>
            </div>

            <!-- 알림 카드 -->
            <div style="background: white; border-radius: 8px; border: 1px solid #E5E7EB; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <h3 style="display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6A0028" stroke-width="2">
                            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"></path>
                        </svg>
                        알림
                    </h3>
                </div>
                <div id="admin-dash-alerts"><!-- 동적 생성 --></div>
            </div>
        </div>

        <!-- 하단 2x2 그리드 -->
        <div class="dash-bottom-grid">
            <!-- 카드2: 제출 일정 지연 위험 -->
            <div style="background: white; border-radius: 8px; border: 1px solid #E5E7EB; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <h3 style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 0;">제출 일정 지연 위험</h3>
                </div>
                <div id="admin-dash-submission-delay" class="dash-card-table" style="max-height: 380px; overflow-y: auto;"><!-- 동적 생성 --></div>
            </div>

            <!-- 카드3: 피드백 지연 -->
            <div style="background: white; border-radius: 8px; border: 1px solid #E5E7EB; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3 style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 0;">피드백 지연</h3>
                </div>
                <div id="admin-dash-feedback-delay" class="dash-card-table" style="max-height: 380px; overflow-y: auto;"><!-- 동적 생성 --></div>
            </div>

            <!-- 카드4: 심사위원 등록 대기 -->
            <div style="background: white; border-radius: 8px; border: 1px solid #E5E7EB; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                    </svg>
                    <h3 style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 0;">심사위원 등록 대기</h3>
                </div>
                <div id="admin-dash-committee-pending" class="dash-card-table" style="max-height: 380px; overflow-y: auto;"><!-- 동적 생성 --></div>
            </div>

            <!-- 카드5: 심사일정 확정 대기 -->
            <div style="background: white; border-radius: 8px; border: 1px solid #E5E7EB; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <h3 style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 0;">심사일정 확정 대기</h3>
                </div>
                <div id="admin-dash-schedule-pending" class="dash-card-table" style="max-height: 380px; overflow-y: auto;"><!-- 동적 생성 --></div>
            </div>
        </div>
    `,

    // ========== 연구계획서 관리 ==========
    researchProposal: () => {
        // 필터링된 데이터 또는 원본 데이터 사용
        const data = appData.submissions.researchProposal;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">연구계획서 관리</h3>
                        <button onclick="openResearchProposalRegisterModal()"
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                            <i class="fas fa-plus mr-2"></i>연구계획서 등록
                        </button>
                    </div>

                    <!-- 검색 메뉴 (표준화) -->
                    <div class="search-container">
                        <div class="search-grid">
                            <!-- 1. 학년도 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학년도
                                </label>
                                <select id="search-year" class="search-select">
                                    <option value="">전체</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>

                            <!-- 2. 학기 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학기
                                </label>
                                <select id="search-semester" class="search-select">
                                    <option value="">전체</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>

                            <!-- 3. 학번 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학번
                                </label>
                                <input type="text" id="search-student-id" placeholder="학번 입력"
                                       class="search-input">
                            </div>

                            <!-- 4. 성명 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    성명
                                </label>
                                <input type="text" id="search-student-name" placeholder="성명 입력"
                                       class="search-input">
                            </div>

                            <!-- 5. 학과/전공 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학과/전공
                                </label>
                                <select id="search-major" class="search-select">
                                    <option value="">전체</option>
                                    <option value="교육공학">교육공학</option>
                                    <option value="경영학">경영학</option>
                                    <option value="컴퓨터공학">컴퓨터공학</option>
                                    <option value="심리학">심리학</option>
                                </select>
                            </div>

                            <!-- 6. 학위과정 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학위과정
                                </label>
                                <select id="search-degree" class="search-select">
                                    <option value="">전체</option>
                                    <option value="석사">석사</option>
                                    <option value="박사">박사</option>
                                </select>
                            </div>
                        </div>

                        <!-- 검색/초기화 버튼 -->
                        <div class="search-buttons">
                            <button onclick="searchSubmissions('researchProposal')"
                                    class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i>검색
                            </button>

                            <button onclick="resetSearch('researchProposal')"
                                    class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i>초기화
                            </button>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이름</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">연구계획서 제목</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">등록일</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.length > 0 ? data.map((item, idx) => `
                                <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewResearchProposalDetail(${item.id})">
                                    <td class="py-3 px-4 text-sm text-gray-800">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.year || '2025'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.semester || '1'}학기</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-800 td-truncate-long" title="${item.thesisTitle || '-'}">
                                        ${item.thesisTitle || '-'}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.submitDate || '-'}</td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="10" class="py-8 text-center text-gray-500">
                                        등록된 연구계획서가 없습니다.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 학위논문 심사 관리 (통합) ==========
    // ID 6: 논문작성계획서, 중간논문, 최종논문 통합
    thesisReview: () => {
        // 통합된 데이터: 논문작성계획서, 중간논문, 최종논문을 하나의 배열로 합침
        const combinedData = [
            ...appData.submissions.thesisPlan.map(item => ({...item, submissionType: 'plan', submissionTypeName: '논문작성계획서 심사'})),
            ...appData.submissions.midThesis.map(item => ({...item, submissionType: 'mid', submissionTypeName: '중간논문 심사'})),
            ...appData.submissions.finalThesis.map(item => ({...item, submissionType: 'final', submissionTypeName: '최종논문 심사'}))
        ];

        // 필터링된 데이터 사용 (검색 기능용)
        const data = window.filteredThesisData || combinedData;

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">학위논문 심사 관리</h3>

                    <!-- 검색 메뉴 (통합 - ID 11 기준) -->
                    <div class="search-container">
                        <div class="search-grid">
                            <!-- 1. 학년도 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학년도
                                </label>
                                <select id="thesis-search-year" class="search-select">
                                    <option value="">전체</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>

                            <!-- 2. 학기 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학기
                                </label>
                                <select id="thesis-search-semester" class="search-select">
                                    <option value="">전체</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>

                            <!-- 3. 학기차 (입력란) -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학기차
                                </label>
                                <input type="text" id="thesis-search-semester-count" placeholder="학기차 입력"
                                       class="search-input">
                            </div>

                            <!-- 4. 심사구분 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    심사구분
                                </label>
                                <select id="thesis-search-type" class="search-select">
                                    <option value="">전체</option>
                                    <option value="plan">논문작성계획서</option>
                                    <option value="mid">중간논문</option>
                                    <option value="final">최종논문</option>
                                </select>
                            </div>

                            <!-- 5. 학번 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학번
                                </label>
                                <input type="text" id="thesis-search-student-id" placeholder="학번 입력"
                                       class="search-input">
                            </div>

                            <!-- 6. 성명 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    성명
                                </label>
                                <input type="text" id="thesis-search-student-name" placeholder="성명 입력"
                                       class="search-input">
                            </div>
                        </div>

                        <!-- 검색/초기화 버튼 -->
                        <div class="search-buttons">
                            <button onclick="searchThesisReview()" class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i>검색
                            </button>
                            <button onclick="resetThesisSearch()" class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i>초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 테이블 (ID 11: 통합 테이블) -->
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                                    <input type="checkbox" onclick="toggleAllCheckboxes(this)">
                                </th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이름</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기차</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학적상태</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">휴대전화</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이메일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사구분</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">신청일시</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사상태</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4"><input type="checkbox" value="${item.id}"></td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.year || '2025'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.semester || '1'}학기</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.semesterCount || '-'}학기</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.studentStatus || '재학'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.advisor}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.phone || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.email || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">
                                        <span class="text-xs px-2 py-1 rounded ${
                                            item.submissionType === 'plan' ? 'bg-blue-100 text-blue-700' :
                                            item.submissionType === 'mid' ? 'bg-green-100 text-green-700' :
                                            'bg-purple-100 text-purple-700'
                                        }">
                                            ${item.submissionTypeName}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-800 td-truncate-long" title="${item.thesisTitle || '미정'}">${item.thesisTitle || '미정'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.submitDate || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.evalDate || '-'}</td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-${item.result || '대기'}">
                                            ${item.result || '대기'}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <div class="flex gap-2 justify-center">
                                            <button onclick="viewThesisReviewDetail('${item.id}', 'member', '${item.submissionType}')"
                                                    class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded">
                                                심사
                                            </button>
                                            <button onclick="viewThesisReviewDetail('${item.id}', 'chair', '${item.submissionType}')"
                                                    class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded">
                                                승인
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 기존 함수들 (하위 호환성 유지) ==========
    thesisPlan: () => {
        const data = appData.submissions.thesisPlan;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">논문작성계획서 제출 현황</h3>
                    
                    <!-- 검색 메뉴 -->
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <select id="search-year" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학년도</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <select id="search-semester" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학기</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                            </select>
                            <select id="search-advisor" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">논문지도교수</option>
                                <option value="홍길동">홍길동</option>
                                <option value="박교수">박교수</option>
                            </select>
                            <select id="search-semester-count" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학기차</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                                <option value="3">3학기</option>
                                <option value="4">4학기</option>
                            </select>
                            <select id="search-major" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학과/전공</option>
                                <option value="교육공학">교육공학</option>
                                <option value="경영학">경영학</option>
                                <option value="컴퓨터공학">컴퓨터공학</option>
                            </select>
                            <select id="search-degree" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학위과정</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                            </select>
                            <input type="text" id="search-keyword" placeholder="학번/성명" 
                                   class="border border-gray-300 rounded px-2 py-1.5 text-sm col-span-2">
                            <button onclick="searchSubmissions('thesisPlan')" 
                                    class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
                                검색
                            </button>
                            <button onclick="resetSearch('thesisPlan')" 
                                    class="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-300">
                                초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 알림 발송 버튼 -->
                <div class="flex justify-end mb-4 px-6">
                    <button onclick="sendNotificationToSelectedStudents('thesisPlan')"
                            class="bg-[#009DE8] hover:bg-[#0087c9] text-white px-4 py-2 rounded text-sm font-medium">
                        선택 학생에게 알림 발송
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">
                                    <input type="checkbox" id="select-all-thesis-plan"
                                           onchange="toggleSelectAllAdmin('thesisPlan', this.checked)"
                                           class="rounded border-gray-300">
                                </th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학생명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">제출일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">상태</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">액션</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-center">
                                        <input type="checkbox" class="admin-student-checkbox thesis-plan-checkbox"
                                               data-student-id="${item.studentId}"
                                               data-student-name="${item.studentName}"
                                               value="${item.id}"
                                               class="rounded border-gray-300">
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.submitDate}</td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-reviewing">${item.status}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewSubmissionDetail(${item.id}, 'thesisPlan')" class="text-[#009DE8] hover:underline text-sm">상세보기</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 중간논문 제출 현황 ==========
    midThesis: () => {
        const data = appData.submissions.midThesis;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">중간논문 제출 현황</h3>
                    
                    <!-- 검색 메뉴 -->
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <select id="search-year" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학년도</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <select id="search-semester" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학기</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                            </select>
                            <select id="search-advisor" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">논문지도교수</option>
                                <option value="홍길동">홍길동</option>
                                <option value="박교수">박교수</option>
                            </select>
                            <select id="search-semester-count" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학기차</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                                <option value="3">3학기</option>
                                <option value="4">4학기</option>
                            </select>
                            <select id="search-major" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학과/전공</option>
                                <option value="교육공학">교육공학</option>
                                <option value="경영학">경영학</option>
                                <option value="컴퓨터공학">컴퓨터공학</option>
                            </select>
                            <select id="search-degree" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학위과정</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                            </select>
                            <select id="search-status" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">심사상태</option>
                                <option value="심사대기">심사대기</option>
                                <option value="심사중">심사중</option>
                                <option value="합격">합격</option>
                                <option value="불합격">불합격</option>
                            </select>
                            <input type="text" id="search-keyword" placeholder="학번/성명" 
                                   class="border border-gray-300 rounded px-2 py-1.5 text-sm col-span-2">
                            <button onclick="searchSubmissions('midThesis')" 
                                    class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
                                검색
                            </button>
                            <button onclick="resetSearch('midThesis')" 
                                    class="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-300">
                                초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 알림 발송 버튼 -->
                <div class="flex justify-end mb-4 px-6">
                    <button onclick="sendNotificationToSelectedStudents('midThesis')"
                            class="bg-[#009DE8] hover:bg-[#0087c9] text-white px-4 py-2 rounded text-sm font-medium">
                        선택 학생에게 알림 발송
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">
                                    <input type="checkbox" id="select-all-mid-thesis"
                                           onchange="toggleSelectAllAdmin('midThesis', this.checked)"
                                           class="rounded border-gray-300">
                                </th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학생명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">제출일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">상태</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">액션</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-center">
                                        <input type="checkbox" class="admin-student-checkbox mid-thesis-checkbox"
                                               data-student-id="${item.studentId}"
                                               data-student-name="${item.studentName}"
                                               value="${item.id}"
                                               class="rounded border-gray-300">
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.submitDate}</td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-reviewing">${item.status}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewSubmissionDetail(${item.id}, 'midThesis')" class="text-[#009DE8] hover:underline text-sm">상세보기</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 최종논문 제출 현황 ==========
    finalThesis: () => {
        const data = appData.submissions.finalThesis;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">최종논문 제출 현황</h3>
                    
                    <!-- 검색 메뉴 -->
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <select id="search-year" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학년도</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <select id="search-semester" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학기</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                            </select>
                            <select id="search-advisor" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">논문지도교수</option>
                                <option value="홍길동">홍길동</option>
                                <option value="박교수">박교수</option>
                            </select>
                            <select id="search-semester-count" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학기차</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                                <option value="3">3학기</option>
                                <option value="4">4학기</option>
                            </select>
                            <select id="search-major" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학과/전공</option>
                                <option value="교육공학">교육공학</option>
                                <option value="경영학">경영학</option>
                                <option value="컴퓨터공학">컴퓨터공학</option>
                            </select>
                            <select id="search-degree" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학위과정</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                            </select>
                            <select id="search-result" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">합격여부</option>
                                <option value="합격">합격</option>
                                <option value="불합격">불합격</option>
                                <option value="조건부합격">조건부합격</option>
                                <option value="심사중">심사중</option>
                            </select>
                            <input type="text" id="search-keyword" placeholder="학번/성명" 
                                   class="border border-gray-300 rounded px-2 py-1.5 text-sm col-span-2">
                            <button onclick="searchSubmissions('finalThesis')" 
                                    class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
                                검색
                            </button>
                            <button onclick="resetSearch('finalThesis')" 
                                    class="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-300">
                                초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 알림 발송 버튼 -->
                <div class="flex justify-end mb-4 px-6">
                    <button onclick="sendNotificationToSelectedStudents('finalThesis')"
                            class="bg-[#009DE8] hover:bg-[#0087c9] text-white px-4 py-2 rounded text-sm font-medium">
                        선택 학생에게 알림 발송
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">
                                    <input type="checkbox" id="select-all-final-thesis"
                                           onchange="toggleSelectAllAdmin('finalThesis', this.checked)"
                                           class="rounded border-gray-300">
                                </th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학생명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">제출일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사결과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">액션</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-center">
                                        <input type="checkbox" class="admin-student-checkbox final-thesis-checkbox"
                                               data-student-id="${item.studentId}"
                                               data-student-name="${item.studentName}"
                                               value="${item.id}"
                                               class="rounded border-gray-300">
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.submitDate}</td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-completed">${item.result}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewSubmissionDetail(${item.id}, 'finalThesis')" class="text-[#009DE8] hover:underline text-sm">상세보기</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 학술지 심사 신청 현황 ==========
    // ========== 학술지 심사 관리 ==========
    // ID 13-15: 학술지 대체심사 관리 (교수용 데이터 공유)
    journalReview: () => {
        // professor/mock-data.js의 journalReviews 데이터 사용
        const data = typeof getJournalReviews === 'function' ? getJournalReviews() : [];
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">학술지 심사 관리</h3>
                    <div class="text-sm text-gray-600 mb-4">
                        <span class="font-semibold text-blue-600">총 ${data.length}건</span>
                    </div>

                    <!-- 검색 메뉴 (표준화) -->
                    <div class="search-container">
                        <div class="search-grid">
                            <!-- 1. 학년도 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학년도
                                </label>
                                <select id="journal-search-year" class="search-select">
                                    <option value="">전체</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>

                            <!-- 2. 학기 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학기
                                </label>
                                <select id="journal-search-semester" class="search-select">
                                    <option value="">전체</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>

                            <!-- 3. 심사상태 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    심사상태
                                </label>
                                <select id="journal-search-status" class="search-select">
                                    <option value="">전체</option>
                                    <option value="심사대기">심사대기</option>
                                    <option value="심사중">심사중</option>
                                    <option value="심사완료">심사완료</option>
                                </select>
                            </div>

                            <!-- 4. 키워드 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    키워드
                                </label>
                                <input type="text" id="journal-search-keyword" placeholder="학번/성명/논문제목 검색"
                                       class="search-input" onkeypress="if(event.key==='Enter') searchJournalReview()">
                            </div>
                        </div>

                        <!-- 검색/초기화 버튼 -->
                        <div class="search-buttons">
                            <button onclick="searchJournalReview()" class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i>검색
                            </button>
                            <button onclick="resetJournalSearch()" class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i>초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 학술지 심사 목록 -->
                <div id="admin-journal-review-list" class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이름</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문제목</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학술지명</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">제출일</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">심사진행상태</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.length > 0 ? data.map((journal, idx) => {
                                const statusClass = getAdminJournalStatusClass(journal.status);
                                return `
                                    <tr class="hover:bg-gray-50">
                                        <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">일반대학원</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${journal.major || '-'}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${journal.degree || '석사'}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${journal.studentId}</td>
                                        <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                            ${addStudentInfoIcon(journal.studentName, journal.studentId)}
                                        </td>
                                        <td class="py-3 px-4 text-sm text-gray-600 td-truncate-extra-long" title="${journal.paperTitle}">
                                            ${journal.paperTitle}
                                        </td>
                                        <td class="py-3 px-4 text-sm text-gray-600 td-truncate" title="${journal.journalName}">
                                            ${journal.journalName}
                                        </td>
                                        <td class="py-3 px-4 text-center text-sm text-gray-600">${journal.submissionDate || '-'}</td>
                                        <td class="py-3 px-4 text-center">
                                            <span class="text-xs font-semibold px-2 py-1 rounded-full ${statusClass}">
                                                ${journal.status}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 text-center">
                                            <div class="flex gap-2 justify-center">
                                                <button onclick="viewAdminJournalDetail(${journal.id})"
                                                        class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded hover:bg-blue-50">
                                                    심사
                                                </button>
                                                <button onclick="viewAdminJournalDetail(${journal.id})"
                                                        class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded hover:bg-green-50">
                                                    승인
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('') : `
                                <tr>
                                    <td colspan="11" class="py-8 text-center text-gray-500">
                                        학술지 심사 내역이 없습니다.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 학술지 심사 신청 현황 (기존 함수, 하위 호환성 유지) ==========
    journalSubmission: () => {
        const data = appData.submissions.journalSubmission;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">학술지 심사 신청 현황</h3>
                    
                    <!-- 검색 메뉴 -->
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <select id="search-year" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학년도</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <select id="search-semester" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학기</option>
                                <option value="1">1학기</option>
                                <option value="2">2학기</option>
                            </select>
                            <select id="search-major" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학과/전공</option>
                                <option value="교육공학">교육공학</option>
                                <option value="경영학">경영학</option>
                                <option value="컴퓨터공학">컴퓨터공학</option>
                            </select>
                            <select id="search-degree" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학위과정</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                            </select>
                            <select id="search-journal-type" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">학술지 등급</option>
                                <option value="KCI">KCI</option>
                                <option value="SCOPUS">SCOPUS</option>
                                <option value="SCI">SCI(E)</option>
                            </select>
                            <select id="search-author-type" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                                <option value="">저자구분</option>
                                <option value="제1저자">제1저자</option>
                                <option value="공동저자">공동저자</option>
                            </select>
                            <input type="text" id="search-keyword" placeholder="학번/성명" 
                                   class="border border-gray-300 rounded px-2 py-1.5 text-sm col-span-2">
                            <button onclick="searchSubmissions('journalSubmission')" 
                                    class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
                                검색
                            </button>
                            <button onclick="resetSearch('journalSubmission')" 
                                    class="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-300">
                                초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 알림 발송 버튼 -->
                <div class="flex justify-end mb-4 px-6">
                    <button onclick="sendNotificationToSelectedStudents('journalSubmission')"
                            class="bg-[#009DE8] hover:bg-[#0087c9] text-white px-4 py-2 rounded text-sm font-medium">
                        선택 학생에게 알림 발송
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">
                                    <input type="checkbox" id="select-all-journal-submission"
                                           onchange="toggleSelectAllAdmin('journalSubmission', this.checked)"
                                           class="rounded border-gray-300">
                                </th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학생명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학술지명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">게재연월</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">제1저자</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">등급</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">상태</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">액션</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-center">
                                        <input type="checkbox" class="admin-student-checkbox journal-submission-checkbox"
                                               data-student-id="${item.studentId}"
                                               data-student-name="${item.studentName}"
                                               value="${item.id}"
                                               class="rounded border-gray-300">
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.journalName}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.publishDate}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.isFirstAuthor ? 'O' : 'X'}</td>
                                    <td class="py-3 px-4">
                                        ${item.kci ? '<span class="status-badge bg-blue-100 text-blue-700">KCI</span>' : ''}
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-reviewing">${item.status}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewJournalDetail(${item.id})" class="text-[#009DE8] hover:underline text-sm">상세보기</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 학기별 지도 계획 ==========
    weeklyGuidance: () => {
        const data = appData.weeklyGuidanceStudents;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">학기별 지도 계획</h3>

                    <!-- 검색 영역 (Task 1-4: ID 18 기준 간소화) -->
                    <div class="search-container">
                        <div class="search-grid">
                            <!-- 1. 학년도 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학년도
                                </label>
                                <select id="weekly-search-year" class="search-select">
                                    <option value="">전체</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>

                            <!-- 2. 학기 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학기
                                </label>
                                <select id="weekly-search-semester" class="search-select">
                                    <option value="">전체</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>

                            <!-- 3. 지도교수 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    지도교수
                                </label>
                                <select id="weekly-search-advisor" class="search-select">
                                    <option value="">전체</option>
                                    <option value="홍길동">홍길동</option>
                                    <option value="박교수">박교수</option>
                                    <option value="최교수">최교수</option>
                                    <option value="김교수">김교수</option>
                                </select>
                            </div>

                            <!-- 4. 학번 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학번
                                </label>
                                <input type="text"
                                       id="weekly-search-student-id"
                                       placeholder="학번 입력"
                                       class="search-input">
                            </div>

                            <!-- 5. 성명 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    성명
                                </label>
                                <input type="text"
                                       id="weekly-search-student-name"
                                       placeholder="성명 입력"
                                       class="search-input">
                            </div>
                        </div>

                        <div class="search-buttons">
                            <button onclick="searchWeeklyGuidance()"
                                    class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i>검색
                            </button>
                            <button onclick="resetWeeklyGuidanceSearch()"
                                    class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i>초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 테이블 (Task 1-4: ID 18 기준) -->
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문지도교수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이름</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기차</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">지도계획 수립여부</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">지도실적 입력여부</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => {
                                const hasPlan = item.guidanceCount > 0 || (item.planEstablished === true);
                                const hasRecord = item.guidanceCount > 0;

                                return `
                                <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewWeeklyGuidanceDetail('${item.studentId}')">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.year || '2025'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.semester || '1'}학기</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisors ? item.advisors.join(', ') : (item.advisor || '-')}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.semesterCount || '-'}학기</td>
                                    <td class="py-3 px-4 text-center">
                                        ${hasPlan ?
                                            '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">수립</span>' :
                                            '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">미수립</span>'
                                        }
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        ${hasRecord ?
                                            '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">입력완료 (' + item.guidanceCount + '회)</span>' :
                                            '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">미입력</span>'
                                        }
                                    </td>
                                </tr>
                            `;}).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 논문 지도 활동 (PDF 피드백 조회) ==========
    guidanceProgress: () => {
        const data = appData.guidanceProgress;
        return `
            <!-- 검색 영역 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div class="grid grid-cols-5 gap-3">
                        <!-- 1행: 5개 필드 -->
                        <!-- 1. 학년도/학기 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
                            <div class="flex gap-2 flex-1">
                                <select id="progress-search-year" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                </select>
                                <select id="progress-search-semester" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>
                        </div>
                        <!-- 2. 대학구분 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                            <select id="progress-search-graduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="일반대학원">일반대학원</option>
                                <option value="디자인대학원">디자인대학원</option>
                            </select>
                        </div>
                        <!-- 3. 계열/대학원 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                            <select id="progress-search-college" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="공학계열">공학계열</option>
                                <option value="인문사회계열">인문사회계열</option>
                            </select>
                        </div>
                        <!-- 4. 학부(과)전공 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                            <select id="progress-search-undergraduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="컴퓨터공학">컴퓨터공학</option>
                                <option value="경영학">경영학</option>
                            </select>
                        </div>
                        <!-- 5. 학과/전공 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                            <select id="progress-search-major" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="컴퓨터공학과">컴퓨터공학과</option>
                                <option value="경영학과">경영학과</option>
                            </select>
                        </div>

                        <!-- 2행: 5개 필드 -->
                        <!-- 6. 학위과정 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                            <select id="progress-search-degree" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                                <option value="석박통합">석박통합</option>
                            </select>
                        </div>
                        <!-- 7. 학적상태 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                            <select id="progress-search-academic-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="재학">재학</option>
                                <option value="휴학">휴학</option>
                                <option value="수료">수료</option>
                                <option value="졸업">졸업</option>
                            </select>
                        </div>
                        <!-- 8. 학번 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                            <input type="text" id="progress-search-student-id" placeholder="학번"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                   onkeypress="if(event.key==='Enter') searchGuidanceProgress()">
                        </div>
                        <!-- 9. 성명 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                            <input type="text" id="progress-search-student-name" placeholder="성명"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                   onkeypress="if(event.key==='Enter') searchGuidanceProgress()">
                        </div>
                        <!-- 10. 지도교수명 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                            <input type="text" id="progress-search-advisor" placeholder="지도교수명"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                   onkeypress="if(event.key==='Enter') searchGuidanceProgress()">
                        </div>

                        <!-- 3행: 피드백 상태 + 조회 버튼 -->
                        <!-- 11. 피드백 상태 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">피드백 상태</label>
                            <select id="progress-search-feedback-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="대기">대기</option>
                                <option value="진행중">진행중</option>
                                <option value="완료">완료</option>
                            </select>
                        </div>
                        <!-- 빈 공간 -->
                        <div class="col-span-3"></div>
                        <!-- 조회 버튼 -->
                        <div class="flex items-center justify-end">
                            <button onclick="searchGuidanceProgress()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                                <i class="fas fa-search mr-1"></i>조회
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 테이블 영역 -->
            <div class="bg-white rounded-lg shadow-md">
                <!-- 테이블 타이틀 -->
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-base font-semibold text-gray-800">논문 지도 활동 목록</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 50px;">
                                    <input type="checkbox" id="select-all-feedbacks" onchange="toggleAllFeedbacks(this)" class="rounded">
                                </th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 60px;">순번</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학년도</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 60px;">학기</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">대학구분</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">계열/대학원</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">학부(과)전공</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 150px;">학과/전공</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학위과정</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">학적상태</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 90px;">학번</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 80px;">성명</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="min-width: 250px;">논문명</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">지도교수명</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">제출일시</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">피드백 희망일자</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">지도단계</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">피드백상태</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.length > 0 ? data.map((item, idx) => {
                                const feedbackStatus = item.feedbackStatus || '대기';
                                return `
                                <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewPdfFeedback(${item.id}, true)">
                                    <td class="py-3 px-4 text-center" onclick="event.stopPropagation()">
                                        <input type="checkbox" class="feedback-checkbox rounded" data-feedback-id="${item.id}">
                                    </td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">2025</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">1학기</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.graduate || '공학계열'}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">재학</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-center text-sm font-medium text-gray-800">${item.studentName}</td>
                                    <td class="py-3 px-4 text-left text-sm text-gray-600" style="padding-left: 12px;">
                                        <div class="cell-truncate" title="${item.documentTitle || item.fileName}">${item.documentTitle || item.fileName}</div>
                                    </td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.submitDate || '-'}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.desiredDate || '-'}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.stage || '연구계획서'}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${feedbackStatus}</td>
                                </tr>
                            `}).join('') : `
                                <tr>
                                    <td colspan="18" class="py-8 text-center text-gray-500">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 심사 일정 관리 (admin-v3 확장 버전) ==========
    scheduleManagement: () => {
        // Mock 데이터 로드 확인
        if (typeof mockCommitteeAssignments === 'undefined' || typeof mockExamSchedules === 'undefined') {
            return `
                <div class="bg-white rounded-lg shadow-md p-8">
                    <div class="text-center text-red-500">
                        <p class="text-lg">Mock 데이터가 로드되지 않았습니다.</p>
                        <p class="text-sm mt-2">assets/js/exam-schedule-data.js 파일을 확인하세요.</p>
                    </div>
                </div>
            `;
        }

        // 초기 렌더링은 HTML 반환 후 호출
        const html = `
            <!-- List View -->
            <div id="exam-schedule-list-view">
                <div class="bg-white rounded-lg shadow-md">
                    <!-- 검색 영역 -->
                    <div class="p-6 border-b">
                        <div class="grid grid-cols-5 gap-3">
                            <!-- 1행: 5개 필드 -->
                            <!-- 1. 학년도 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도</label>
                                <select id="filter-year" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="2025" selected>2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>

                            <!-- 2. 학기 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학기</label>
                                <select id="filter-semester" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="1" selected>1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>

                            <!-- 3. 대학구분 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                                <select id="filter-graduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="일반대학원">일반대학원</option>
                                    <option value="디자인대학원">디자인대학원</option>
                                </select>
                            </div>

                            <!-- 4. 계열/대학원 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                                <select id="filter-college" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="공학계열">공학계열</option>
                                    <option value="인문사회계열">인문사회계열</option>
                                </select>
                            </div>

                            <!-- 5. 학부(과)전공 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                                <select id="filter-undergraduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="컴퓨터공학">컴퓨터공학</option>
                                    <option value="경영학">경영학</option>
                                </select>
                            </div>

                            <!-- 2행: 5개 필드 -->
                            <!-- 6. 학과/전공 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                                <select id="filter-department" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="경영학과">경영학과</option>
                                    <option value="컴퓨터공학과">컴퓨터공학과</option>
                                    <option value="교육학과">교육학과</option>
                                </select>
                            </div>

                            <!-- 7. 학위과정 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                                <select id="filter-degree" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="석사">석사</option>
                                    <option value="박사">박사</option>
                                    <option value="석박통합">석박통합</option>
                                </select>
                            </div>

                            <!-- 8. 학적상태 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                                <select id="filter-academic-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="재학">재학</option>
                                    <option value="휴학">휴학</option>
                                    <option value="수료">수료</option>
                                    <option value="졸업">졸업</option>
                                </select>
                            </div>

                            <!-- 9. 학번 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                                <input type="text" id="filter-student-number" placeholder="학번"
                                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                       style="height: 34px;"
                                       onkeypress="if(event.key==='Enter') filterExamSchedule()">
                            </div>

                            <!-- 10. 성명 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                                <input type="text" id="filter-student-name" placeholder="성명"
                                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                       style="height: 34px;"
                                       onkeypress="if(event.key==='Enter') filterExamSchedule()">
                            </div>

                            <!-- 3행: 3개 필드 + 조회 버튼 -->
                            <!-- 11. 지도교수명 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                                <input type="text" id="filter-advisor-name" placeholder="지도교수명"
                                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                       style="height: 34px;"
                                       onkeypress="if(event.key==='Enter') filterExamSchedule()">
                            </div>

                            <!-- 12. 기본단계 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">기본단계</label>
                                <select id="filter-stage" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <!-- 동적 로드 -->
                                </select>
                            </div>

                            <!-- 13. 등록상태 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">등록상태</label>
                                <select id="filter-schedule-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;" onchange="filterExamSchedule()">
                                    <option value="">전체</option>
                                    <option value="scheduled">등록 완료</option>
                                    <option value="unscheduled">미등록</option>
                                </select>
                            </div>

                            <!-- 빈 공간 -->
                            <div></div>

                            <!-- 조회 버튼 -->
                            <div class="flex justify-end">
                                <button onclick="filterExamSchedule()" class="px-4 py-2 bg-[#6A0028] text-white rounded text-xs hover:bg-[#8A0034]">
                                    <i class="fas fa-search"></i> 조회
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 테이블 헤더 -->
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">심사 일정 목록</h3>
                            <span class="table-count">(총 <span id="exam-schedule-count">0</span>건)</span>
                        </div>
                    </div>

                    <!-- 테이블 영역 (14개 컬럼) -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full table-fixed">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학구분</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">계열/대학원</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학부(과)전공</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과/전공</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학적상태</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수명</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">기본단계</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">세부단계</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">등록상태</th>
                                </tr>
                            </thead>
                            <tbody id="exam-schedule-table-body" class="bg-white divide-y divide-gray-200">
                                <!-- JavaScript로 동적 렌더링 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Detail View (hidden initially) -->
            <div id="exam-schedule-detail-view" style="display: none;">
                <!-- JavaScript로 동적 렌더링 -->
            </div>
        `;

        // HTML 반환 후 초기 렌더링 호출 (스크립트 로드 후)
        setTimeout(() => {
            if (typeof window.renderExamScheduleList === 'function') {
                console.log('✅ renderExamScheduleList 함수 호출 시작');
                window.renderExamScheduleList();
            } else {
                console.error('❌ renderExamScheduleList 함수를 찾을 수 없습니다', typeof window.renderExamScheduleList);
                // 재시도
                setTimeout(() => {
                    if (typeof window.renderExamScheduleList === 'function') {
                        console.log('✅ renderExamScheduleList 함수 호출 (재시도)');
                        window.renderExamScheduleList();
                    }
                }, 200);
            }
        }, 100);

        return html;
    },

    // ========== 일정 등록 (신규/수정) ==========
    scheduleCreate: (id = null) => {
        const isEdit = id !== null;
        const item = isEdit ? appData.schedules.find(s => s.id === id) : {};
        const categories = getCategoryList();

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <button onclick="switchView('scheduleManagement')"
                            class="text-gray-600 hover:text-gray-800 flex items-center">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        목록으로 돌아가기
                    </button>
                </div>
                <div class="p-6">
                    <form id="schedule-form" class="space-y-6">
                        <!-- 일정 제목 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                일정 제목 <span class="text-red-600">*</span>
                            </label>
                            <input type="text" id="schedule-title" value="${item.title || ''}"
                                   placeholder="예: 2025학년도 1학기 연구계획서 심사"
                                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                            <p class="mt-1 text-xs text-gray-500">대시보드에 표시될 일정 제목을 입력하세요</p>
                        </div>

                        <!-- 지도 단계 유형 선택 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                지도 단계 유형 <span class="text-red-600">*</span>
                            </label>
                            <select id="schedule-category"
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                                <option value="">선택하세요</option>
                                ${categories.map(cat => `
                                    <option value="${cat}" ${item.category === cat ? 'selected' : ''}>
                                        ${cat}
                                    </option>
                                `).join('')}
                            </select>
                            <p class="mt-1 text-xs text-gray-500">
                                <i class="fas fa-info-circle"></i>
                                이 지도 단계 유형은 모든 학위/전공의 동일 단계에 적용됩니다.
                            </p>
                        </div>

                        <!-- 학기 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">학기</label>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs text-gray-600 mb-1">학년도</label>
                                    <input type="number" id="schedule-year" value="${item.year || ''}"
                                           placeholder="예: 2025"
                                           min="2020"
                                           max="2099"
                                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600 mb-1">학기</label>
                                    <select id="schedule-term"
                                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                                        <option value="">선택</option>
                                        <option value="1" ${item.term === '1' ? 'selected' : ''}>1학기</option>
                                        <option value="2" ${item.term === '2' ? 'selected' : ''}>2학기</option>
                                        <option value="여름" ${item.term === '여름' ? 'selected' : ''}>여름학기</option>
                                        <option value="겨울" ${item.term === '겨울' ? 'selected' : ''}>겨울학기</option>
                                    </select>
                                </div>
                            </div>
                            <p class="mt-1 text-xs text-gray-500">학기 구분이 필요한 경우 입력하세요 (선택사항)</p>
                        </div>

                        <!-- 설명 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
                            <textarea id="schedule-desc" rows="3"
                                      placeholder="일정에 대한 추가 설명을 입력하세요"
                                      class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">${item.description || ''}</textarea>
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex ${isEdit ? 'justify-between' : 'justify-end'} pt-4 border-t">
                            ${isEdit ? `
                            <button type="button" onclick="deleteSchedule(${id})"
                                    class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                                삭제
                            </button>
                            ` : ''}
                            <div class="flex space-x-3">
                                <button type="button" onclick="switchView('scheduleManagement')"
                                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    취소
                                </button>
                                <button type="button" onclick="saveScheduleFromPage(${isEdit ? id : null})"
                                        class="px-4 py-2 bg-[#009DE8] text-white rounded-md text-sm font-medium hover:bg-opacity-90">
                                    ${isEdit ? '수정' : '등록'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // ========== 논문 제출 요건 관리 ==========
    requirementManagement: () => {
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-bold text-gray-800">논문 제출 요건 관리</h3>
                        <button onclick="RequirementManagement.showAddDepartmentModal()"
                                class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            <i class="fas fa-plus mr-1"></i> 학과/전공 추가
                        </button>
                    </div>
                </div>

                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">논문 제출 요건 목록</h3>
                        <span class="table-count" id="requirement-count-display">(총 0건)</span>
                    </div>
                </div>

                <div class="table-scroll" style="overflow-x: auto;">
                    <table id="requirement-table" class="min-w-full table-auto">
                        <thead class="bg-gray-50">
                            <!-- 헤더는 RequirementManagement.renderTable()에서 동적 생성 -->
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <!-- 바디는 RequirementManagement.renderTable()에서 동적 생성 -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 학과/전공 추가 모달 -->
            <div id="add-department-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                    <!-- 모달 헤더 -->
                    <div class="flex items-center justify-between p-6 border-b">
                        <h3 class="text-lg font-bold text-gray-800">학과/전공 추가</h3>
                        <button onclick="RequirementManagement.closeAddDepartmentModal()"
                                class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <!-- 모달 바디 -->
                    <div class="p-6">
                        <form id="add-department-form" onsubmit="RequirementManagement.submitAddDepartment(event)">
                            <!-- 학과/전공 선택 -->
                            <div class="mb-6">
                                <label for="select-department" class="block text-sm font-medium text-gray-700 mb-2">
                                    학과/전공 <span class="text-red-600">*</span>
                                </label>
                                <select id="select-department"
                                        required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028]">
                                    <option value="">선택하세요</option>
                                </select>
                            </div>

                            <!-- 학위과정 선택 -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    학위과정 <span class="text-red-600">*</span>
                                </label>
                                <div class="flex gap-4">
                                    <div class="flex items-center">
                                        <input type="radio"
                                               id="degree-master"
                                               name="degreeProgram"
                                               value="석사"
                                               checked
                                               class="w-4 h-4 text-[#6A0028] focus:ring-[#6A0028]">
                                        <label for="degree-master" class="ml-2 text-sm text-gray-700">석사</label>
                                    </div>
                                    <div class="flex items-center">
                                        <input type="radio"
                                               id="degree-doctor"
                                               name="degreeProgram"
                                               value="박사"
                                               class="w-4 h-4 text-[#6A0028] focus:ring-[#6A0028]">
                                        <label for="degree-doctor" class="ml-2 text-sm text-gray-700">박사</label>
                                    </div>
                                    <div class="flex items-center">
                                        <input type="radio"
                                               id="degree-integrated"
                                               name="degreeProgram"
                                               value="통합과정"
                                               class="w-4 h-4 text-[#6A0028] focus:ring-[#6A0028]">
                                        <label for="degree-integrated" class="ml-2 text-sm text-gray-700">통합과정</label>
                                    </div>
                                </div>
                            </div>

                            <!-- 버튼 영역 -->
                            <div class="flex justify-end gap-2">
                                <button type="button"
                                        onclick="RequirementManagement.closeAddDepartmentModal()"
                                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                    취소
                                </button>
                                <button type="submit"
                                        class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020]">
                                    <i class="fas fa-plus mr-1"></i> 추가하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <script>
                // DOM이 준비된 후 초기화
                setTimeout(() => {
                    if (typeof RequirementManagement !== 'undefined') {
                        console.log('🎯 RequirementManagement 초기화 시작');
                        RequirementManagement.init();
                    } else {
                        console.error('❌ RequirementManagement가 로드되지 않았습니다');
                    }
                }, 100);
            </script>
        `;
    },

    // ========== 논문지도 워크플로우 관리 ==========
    stageManagement: () => {
        const data = mockThesisStages;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="table-container">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">지도 단계 목록</h3>
                            <span class="table-count">(총 ${data.length}건)</span>
                        </div>
                        <div class="table-header-right">
                            <button onclick="switchView('workflowCreateUnified')" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                                등록
                            </button>
                        </div>
                    </div>
                    <div class="table-scroll">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도 단계명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계 구성</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => {
                                const degreeLabel = item.degreeType === 'master' ? '석사' : '박사';
                                const evaluationCount = item.stages.filter(s => s.evaluationRequired).length;

                                return `
                                <tr class="hover:bg-blue-50 cursor-pointer" onclick="switchView('workflowCreateUnified', '${item.id}')">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-700">${degreeLabel}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">
                                        <div class="flex items-center gap-1 flex-wrap">
                                            ${item.stages.map((stage, stepIdx) => {
                                                const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
                                                const bgColor = stage.type === 'submission' ? 'bg-gray-100 text-gray-700' :
                                                               (stage.evaluationRequired ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700');

                                                return `
                                                    <span class="px-2 py-1 rounded text-xs ${bgColor}" title="${stepType ? stepType.description : ''}">
                                                        ${stage.order}. ${stage.name}
                                                    </span>
                                                    ${stepIdx < item.stages.length - 1 ? '<span class="text-gray-400">→</span>' : ''}
                                                `;
                                            }).join('')}
                                        </div>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 워크플로우 등록/수정 페이지 ==========
    workflowCreate: (id = null) => {
        const isEdit = id !== null;
        const item = isEdit ? mockThesisStages.find(s => s.id === id) : {};

        return `
            <div class="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
                <!-- 헤더 -->
                <div class="flex items-center mb-8">
                    <button onclick="switchView('stageManagement')"
                            class="text-gray-600 hover:text-gray-800 mr-4 flex items-center">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        목록으로 돌아가기
                    </button>
                    <h2 class="text-2xl font-bold text-gray-800">
                        ${isEdit ? '워크플로우 수정' : '워크플로우 등록'}
                    </h2>
                </div>

                <!-- 폼 -->
                <form id="workflow-form" class="space-y-6">
                    <!-- 워크플로우명 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            워크플로우명 <span class="text-red-600">*</span>
                        </label>
                        <input type="text" id="workflow-name"
                               value="${item.name || ''}"
                               placeholder="예: 논문작성1, 석사 표준 과정, 2025년 1학기 과정"
                               class="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                        <p class="mt-1 text-xs text-gray-500">구분하기 쉬운 이름을 입력하세요</p>
                    </div>

                    <!-- 학위 유형 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            학위 유형 <span class="text-red-600">*</span>
                        </label>
                        <div class="flex gap-6">
                            <label class="flex items-center cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 ${!item.degreeType || item.degreeType === 'master' ? 'border-[#009DE8] bg-blue-50' : 'border-gray-300'}">
                                <input type="radio" name="degree-type" value="master"
                                       ${!item.degreeType || item.degreeType === 'master' ? 'checked' : ''}
                                       class="h-4 w-4 text-[#009DE8]">
                                <span class="ml-3 font-medium text-gray-800">석사</span>
                            </label>
                            <label class="flex items-center cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 ${item.degreeType === 'phd' ? 'border-[#009DE8] bg-blue-50' : 'border-gray-300'}">
                                <input type="radio" name="degree-type" value="phd"
                                       ${item.degreeType === 'phd' ? 'checked' : ''}
                                       class="h-4 w-4 text-[#009DE8]">
                                <span class="ml-3 font-medium text-gray-800">박사</span>
                            </label>
                            <label class="flex items-center cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 ${item.degreeType === 'common' ? 'border-[#009DE8] bg-blue-50' : 'border-gray-300'}">
                                <input type="radio" name="degree-type" value="common"
                                       ${item.degreeType === 'common' ? 'checked' : ''}
                                       class="h-4 w-4 text-[#009DE8]">
                                <span class="ml-3 font-medium text-gray-800">공통</span>
                            </label>
                        </div>
                    </div>

                    <!-- 설명 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            설명 (선택)
                        </label>
                        <textarea id="workflow-description" rows="4"
                                  placeholder="워크플로우에 대한 설명을 입력하세요 (예: 2025년 1학기 논문 작성 과정)"
                                  class="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent"
                        >${item.description || ''}</textarea>
                    </div>

                    <!-- 버튼 -->
                    <div class="flex gap-4 pt-6 border-t">
                        <button type="button" onclick="saveWorkflowAndCompose('${id || ''}')"
                                class="flex-1 bg-[#009DE8] text-white px-6 py-3 rounded-md hover:bg-opacity-90 font-medium flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            저장
                        </button>
                        <button type="button" onclick="switchView('stageManagement')"
                                class="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium">
                            취소
                        </button>
                    </div>
                </form>

                ${isEdit && item.stages && item.stages.length > 0 ? `
                    <div class="mt-8 p-4 bg-gray-50 rounded-lg border">
                        <p class="text-sm font-medium text-gray-700 mb-2">현재 구성된 단계 (${item.stages.length}개)</p>
                        <div class="flex flex-wrap gap-2">
                            ${item.stages.map(s => `
                                <span class="px-3 py-1 bg-white border rounded-full text-xs text-gray-700">
                                    ${s.order}. ${s.name}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // ========== 워크플로우 단계 구성 페이지 ==========
    workflowStageCompose: (workflowId) => {
        const workflow = mockThesisStages.find(w => w.id === workflowId);
        if (!workflow) {
            return `
                <div class="bg-white rounded-lg shadow-md p-8 text-center">
                    <p class="text-red-600">워크플로우를 찾을 수 없습니다.</p>
                    <button onclick="switchView('stageManagement')" class="mt-4 text-blue-600 hover:underline">
                        목록으로 돌아가기
                    </button>
                </div>
            `;
        }

        const degreeLabel = workflow.degreeType === 'master' ? '석사' :
                           workflow.degreeType === 'phd' ? '박사' : '공통';

        // 임시 저장용 전역 변수 초기화
        window.currentWorkflow = workflow;
        window.composedStages = workflow.stages ? JSON.parse(JSON.stringify(workflow.stages)) : [];

        return `
            <div class="h-full flex flex-col">
                <!-- 헤더 -->
                <div class="bg-white border-b px-6 py-4 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <button onclick="switchView('stageManagement')"
                                    class="text-gray-600 hover:text-gray-800 mr-4 flex items-center">
                                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                목록으로
                            </button>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">워크플로우 단계 구성</h2>
                                <p class="text-sm text-gray-600 mt-1">
                                    워크플로우: <strong>${workflow.name}</strong>
                                    <span class="px-2 py-1 rounded text-xs ml-2 ${
                                        workflow.degreeType === 'master' ? 'bg-blue-100 text-blue-800' :
                                        workflow.degreeType === 'phd' ? 'bg-purple-100 text-purple-800' :
                                        'bg-gray-100 text-gray-800'
                                    }">${degreeLabel}</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="saveWorkflowStages('${workflowId}')"
                                    class="bg-[#009DE8] text-white px-6 py-2 rounded-md hover:bg-opacity-90 font-medium flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                저장
                            </button>
                            <button onclick="switchView('stageManagement')"
                                    class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 font-medium">
                                취소
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 2단 레이아웃 -->
                <div class="flex-1 flex overflow-hidden">
                    <!-- 좌측: 단계 유형 목록 -->
                    <div class="w-1/3 bg-gray-50 border-r overflow-y-auto">
                        <div class="p-4">
                            <h3 class="font-bold text-gray-800 mb-3 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                                단계 유형 목록
                            </h3>

                            <!-- 검색 -->
                            <input type="text" id="step-type-search"
                                   placeholder="단계 검색..."
                                   onkeyup="filterStepTypes()"
                                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4 focus:ring-2 focus:ring-[#009DE8]">

                            <!-- 제출 유형 -->
                            <div class="mb-4">
                                <p class="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    제출
                                </p>
                                <div class="space-y-2">
                                    ${mockStepTypes.filter(st => st.type === 'submission').map(st => `
                                        <div class="step-type-item bg-white border border-gray-200 rounded-md p-3 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
                                             data-step-name="${st.name.toLowerCase()}"
                                             onclick="addStageToComposition('${st.id}')">
                                            <p class="font-medium text-sm text-gray-800">${st.name}</p>
                                            ${st.description ? `<p class="text-xs text-gray-500 mt-1">${st.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- 심사 유형 -->
                            <div>
                                <p class="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    심사
                                </p>
                                <div class="space-y-2">
                                    ${mockStepTypes.filter(st => st.type === 'review').map(st => `
                                        <div class="step-type-item bg-white border border-gray-200 rounded-md p-3 hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-all"
                                             data-step-name="${st.name.toLowerCase()}"
                                             onclick="addStageToComposition('${st.id}')">
                                            <p class="font-medium text-sm text-gray-800">${st.name}</p>
                                            ${st.description ? `<p class="text-xs text-gray-500 mt-1">${st.description}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 우측: 구성된 단계 -->
                    <div class="flex-1 overflow-y-auto">
                        <div class="p-6">
                            <h3 class="font-bold text-gray-800 mb-4 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                구성된 단계
                                <span class="ml-2 text-sm font-normal text-gray-500" id="stage-count">
                                    (${window.composedStages.length}개)
                                </span>
                            </h3>

                            <div id="composed-stages-list" class="space-y-3">
                                ${renderComposedStages()}
                            </div>

                            ${window.composedStages.length === 0 ? `
                                <div class="text-center py-16 text-gray-400">
                                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                    <p class="text-lg font-medium mb-1">단계를 추가하세요</p>
                                    <p class="text-sm">좌측에서 단계 유형을 클릭하면 여기에 추가됩니다</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 지도 단계 유형 관리 (UNUSED - 카드 레이아웃) ==========
    // 주석: 아래의 typeManagement는 사용되지 않습니다.
    // Line 2970의 두 번째 typeManagement가 이것을 덮어씁니다.
    // 필요시 typeManagementCards로 이름을 변경하여 사용할 수 있습니다.
    /*
    typeManagement: () => {
        const data = mockStepTypes;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800">지도 단계 유형 관리 (레고 블록)</h3>
                    <button onclick="openStepTypeModal()" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                        등록
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    ${data.map(item => {
                        const typeLabel = item.type === 'submission' ? '제출' : '심사';
                        const typeBgColor = item.type === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
                        const evalTemplate = item.evaluationTemplateId ? mockEvaluationTemplates.find(t => t.id === item.evaluationTemplateId) : null;

                        return `
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <h4 class="font-bold text-gray-800 mb-2">${item.name}</h4>
                                    <span class="inline-block px-2 py-1 rounded text-xs font-medium ${typeBgColor}">${typeLabel}</span>
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="editStepType('${item.id}')" class="text-blue-600 hover:underline text-xs">수정</button>
                                    <button onclick="deleteStepType('${item.id}')" class="text-red-600 hover:underline text-xs">삭제</button>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center text-sm">
                                    <svg class="w-4 h-4 mr-2 ${item.requiresPresentation ? 'text-green-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.requiresPresentation ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"></path>
                                    </svg>
                                    <span class="text-gray-600">발표 필요</span>
                                </div>
                                <div class="flex items-center text-sm">
                                    <svg class="w-4 h-4 mr-2 ${item.requiresDocument ? 'text-green-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.requiresDocument ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"></path>
                                    </svg>
                                    <span class="text-gray-600">문서 제출 필요</span>
                                </div>
                                ${evalTemplate ? `
                                <div class="flex items-center text-sm">
                                    <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <span class="text-gray-600">${evalTemplate.name}</span>
                                </div>
                                ` : ''}
                            </div>
                            ${item.description ? `
                                <p class="mt-3 text-xs text-gray-500 border-t pt-2">${item.description}</p>
                            ` : ''}
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;
    },
    */

    // ========== 평가 기준 관리 (독립적 평가표) ==========
    evaluationCriteria: () => {
        const data = appData.evaluationCriteria;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="table-container">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">심사 기준 목록</h3>
                            <span class="table-count">(총 ${data.length}건)</span>
                        </div>
                        <div class="table-header-right">
                            <button onclick="switchView('evaluationCriteriaEdit')" class="btn btn-primary btn-sm">
                                <span class="icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 5v14M5 12h14"></path>
                                    </svg>
                                </span>
                                등록
                            </button>
                        </div>
                    </div>
                    <div class="table-scroll">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th style="width: 80px;">순번</th>
                                    <th style="width: auto;">심사기준(평가표)명</th>
                                    <th style="width: 150px;">유형</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.map((item, idx) => {
                                    // 유형 표시 로직 개선 (evaluationType 사용)
                                    let typeClass, typeName;
                                    const evalType = item.evaluationType || 'score';
                                    if (evalType === 'passfail') {
                                        typeClass = 'bg-gray-100 text-gray-800';
                                        typeName = 'Pass/Fail형';
                                    } else if (evalType === 'grade') {
                                        typeClass = 'bg-purple-100 text-purple-800';
                                        typeName = '등급형';
                                    } else {
                                        typeClass = 'bg-blue-100 text-blue-800';
                                        typeName = '점수형';
                                    }

                                    return `
                                        <tr class="cursor-pointer" onclick="switchView('evaluationCriteriaEdit', '${item.id}')">
                                            <td>${idx + 1}</td>
                                            <td class="text-left font-medium">${item.name}</td>
                                            <td>
                                                <span class="px-2 py-1 text-xs rounded-full ${typeClass}">
                                                    ${typeName}
                                                </span>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 심사 기준 등록 - 상세/편집 (통합) ==========
    evaluationCriteriaEdit: (param) => {
        const criteriaId = param ? parseInt(param) : null;
        const isEdit = criteriaId !== null;
        const criteria = isEdit ? appData.evaluationCriteria.find(c => c.id === criteriaId) : null;

        // 디버깅
        if (isEdit && criteria) {
            console.log('Edit mode - criteria:', criteria);
            console.log('Items:', criteria.items);
            console.log('PassCriteria:', criteria.passCriteria);
        }

        // 초기값 설정
        const name = isEdit && criteria ? criteria.name : '';
        const description = isEdit && criteria ? criteria.description : '';
        const evaluationType = isEdit && criteria ? criteria.evaluationType : 'score';
        const applicableDepartment = isEdit && criteria ? criteria.applicableDepartment || '전체학과' : '전체학과';
        const items = isEdit && criteria && Array.isArray(criteria.items) ? criteria.items : [];

        // 학과명 목록
        const departments = window.mockDepartmentNames || [
            '컴퓨터공학과', '전자공학과', '기계공학과', '경영학과', '행정학과', '교육공학과', '인공지능학과'
        ];

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6">
                    <div class="mb-6">
                        <button onclick="switchView('evaluationCriteria')" class="back-to-list-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                            목록으로 돌아가기
                        </button>
                    </div>
                    <!-- 평가표 기본 정보 -->
                    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 class="text-md font-semibold text-gray-800 mb-4">평가표 기본 정보</h4>
                        <div class="grid grid-cols-2 gap-4 items-start">
                            <div>
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        평가표명 <span class="text-red-600">*</span>
                                    </label>
                                    <input type="text" id="edit-criteria-name" value="${name}"
                                           placeholder="예: 일반 연구계획서 평가표"
                                           class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        적용 학과 <span class="text-red-600">*</span>
                                    </label>
                                    <select id="edit-criteria-department" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                                        <option value="전체학과" ${applicableDepartment === '전체학과' ? 'selected' : ''}>전체학과 공통</option>
                                        ${departments.map(dept => `<option value="${dept}" ${applicableDepartment === dept ? 'selected' : ''}>${dept}</option>`).join('')}
                                    </select>
                                </div>
                                <p class="text-xs text-gray-500 mt-1">전체학과 선택 시 모든 학과에서 사용 가능합니다.</p>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        평가표 유형 <span class="text-red-600">*</span>
                                    </label>
                                    <select id="edit-criteria-type" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" ${isEdit ? 'disabled' : ''} onchange="handleEvaluationTypeChange()">
                                        <option value="score" ${evaluationType === 'score' ? 'selected' : ''}>점수형 - 점수로 평가 (예: 100점 만점)</option>
                                        <option value="passfail" ${evaluationType === 'passfail' ? 'selected' : ''}>Pass/Fail형 - 합격/불합격으로 평가</option>
                                        <option value="rubric" ${evaluationType === 'rubric' ? 'selected' : ''}>척도형 - 5점 척도로 평가 (매우 아니다~매우 그렇다)</option>
                                        <option value="descriptive" ${evaluationType === 'descriptive' ? 'selected' : ''}>서술형 - 서술식 의견으로 평가 (항목설명 필수)</option>
                                    </select>
                                </div>
                                ${isEdit ? '<p class="text-xs text-gray-500 mt-1">평가표 유형은 수정할 수 없습니다.</p>' : '<p class="text-xs text-gray-500 mt-1">선택한 유형에 따라 평가 항목의 입력 방식이 달라집니다.</p>'}
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        설명 <span class="text-red-600">*</span>
                                    </label>
                                    <input type="text" id="edit-criteria-description" value="${description}"
                                           placeholder="이 평가표의 용도와 특징을 설명해주세요"
                                           class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 척도형 안내 (척도형일 때만 표시) -->
                    ${evaluationType === 'rubric' ? `
                        <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div class="flex items-start gap-2">
                                <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                </svg>
                                <div class="text-sm text-blue-800">
                                    <strong>5점 척도 고정:</strong> 매우 아니다, 아니다, 보통, 그렇다, 매우 그렇다
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- 평가 항목 -->
                    <div class="mb-6">
                        <div class="mb-4">
                            <h4 class="text-md font-semibold text-gray-800">평가 항목</h4>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full border border-gray-300">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-700 border-r border-gray-300 w-16">순번</th>
                                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-700 border-r border-gray-300">항목명 <span class="text-red-600">*</span></th>
                                        ${evaluationType === 'score' ? `
                                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-700 border-r border-gray-300 w-24">배점 <span class="text-red-600">*</span></th>
                                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-700 border-r border-gray-300 w-24">과락점수</th>
                                        ` : ''}
                                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-700 border-r border-gray-300">항목설명</th>
                                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-700 w-20">관리</th>
                                    </tr>
                                </thead>
                                <tbody id="evaluation-items-container" class="divide-y divide-gray-200">
                                    ${(items.length > 0 ? items : [{}]).map((item, idx) => {
                                        if (evaluationType === 'score') {
                                            return `
                                                <tr class="evaluation-item hover:bg-gray-50" data-item-id="${item.id || ''}">
                                                    <td class="py-3 px-4 text-center text-sm text-gray-600 border-r border-gray-300">${idx + 1}</td>
                                                    <td class="py-3 px-4 border-r border-gray-300">
                                                        <input type="text" class="item-name w-full border border-gray-300 rounded px-3 py-2 text-sm" value="${(item.name || '').replace(/"/g, '&quot;')}" placeholder="예: 연구 목적의 명확성" required>
                                                    </td>
                                                    <td class="py-3 px-4 border-r border-gray-300">
                                                        <input type="number" class="item-score w-full border border-gray-300 rounded px-3 py-2 text-sm text-center" value="${item.score || ''}" min="0" required onchange="updateTotalScore()">
                                                    </td>
                                                    <td class="py-3 px-4 border-r border-gray-300">
                                                        <input type="number" class="item-fail-score w-full border border-gray-300 rounded px-3 py-2 text-sm text-center" value="${item.failScore !== undefined && item.failScore !== null ? item.failScore : ''}" min="0" onchange="validateFailScore(this)">
                                                    </td>
                                                    <td class="py-3 px-4 border-r border-gray-300">
                                                        <input type="text" class="item-description w-full border border-gray-300 rounded px-3 py-2 text-sm" value="${(item.description || '').replace(/"/g, '&quot;')}" placeholder="예: 연구 목적의 타당성과 명확성을 평가">
                                                    </td>
                                                    <td class="py-3 px-4 text-center">
                                                        <span onclick="removeEvaluationItem(this)" class="text-red-600 hover:text-red-800 text-sm cursor-pointer">
                                                            삭제
                                                        </span>
                                                    </td>
                                                </tr>
                                            `;
                                        } else {
                                            return `
                                                <tr class="evaluation-item hover:bg-gray-50" data-item-id="${item.id || ''}">
                                                    <td class="py-3 px-4 text-center text-sm text-gray-600 border-r border-gray-300">${idx + 1}</td>
                                                    <td class="py-3 px-4 border-r border-gray-300">
                                                        <input type="text" class="item-name w-full border border-gray-300 rounded px-3 py-2 text-sm" value="${(item.name || '').replace(/"/g, '&quot;')}" placeholder="예: 연구 목적의 명확성" required>
                                                    </td>
                                                    <td class="py-3 px-4 border-r border-gray-300">
                                                        <input type="text" class="item-description w-full border border-gray-300 rounded px-3 py-2 text-sm" value="${(item.description || '').replace(/"/g, '&quot;')}" placeholder="예: 연구 목적의 타당성과 명확성을 평가">
                                                    </td>
                                                    <td class="py-3 px-4 text-center">
                                                        <span onclick="removeEvaluationItem(this)" class="text-red-600 hover:text-red-800 text-sm cursor-pointer">
                                                            삭제
                                                        </span>
                                                    </td>
                                                </tr>
                                            `;
                                        }
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>

                        ${evaluationType === 'score' ? `
                            <div class="mt-3 flex justify-between items-center px-4 py-3 bg-gray-50 border border-gray-300 rounded">
                                <span class="text-sm font-semibold text-gray-700">총 배점</span>
                                <span class="text-sm font-bold text-gray-900" id="total-score-display">0점</span>
                            </div>
                        ` : ''}

                        <div class="mt-4 flex justify-end">
                            <button onclick="addEvaluationItem()" class="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 text-sm font-medium">
                                항목 추가
                            </button>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 pt-4 border-t">
                        ${isEdit && criteria ? `
                            <button onclick="deleteEvaluationCriteriaConfirm(${criteriaId})" class="bg-red-600 text-white px-6 py-2.5 rounded hover:bg-red-700 text-sm font-medium">
                                평가표 삭제
                            </button>
                        ` : `
                            <button onclick="cancelEvaluationCriteria()" class="bg-gray-600 text-white px-6 py-2.5 rounded hover:bg-gray-700 text-sm font-medium">
                                취소
                            </button>
                        `}
                        <button onclick="saveEvaluationCriteria()" class="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 text-sm font-medium">
                            평가표 저장
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 논문 제목 등록 현황 ==========
    titleChangeRequests: () => {
        const data = appData.titleChangeRequests;
        return `
            <!-- 목록 화면 -->
            <div id="title-change-list-view">
                <!-- 검색 옵션 카드 (표준 디자인) -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div class="grid grid-cols-5 gap-3">
                        <!-- 1행: 5개 필드 -->

                        <!-- 1. 학년도/학기 (복합 필드) -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학년도/학기
                            </label>
                            <div class="flex gap-2 flex-1">
                                <select id="title-search-year"
                                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                        style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="2025" selected>2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                                <select id="title-search-semester"
                                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                        style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="1" selected>1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>
                        </div>

                        <!-- 2. 대학구분 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                대학구분
                            </label>
                            <select id="title-search-college-type"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="대학원">대학원</option>
                                <option value="학부">학부</option>
                            </select>
                        </div>

                        <!-- 3. 계열/대학원 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                계열/대학원
                            </label>
                            <select id="title-search-college"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="일반대학원">일반대학원</option>
                                <option value="디자인대학원">디자인대학원</option>
                                <option value="부동산대학원">부동산대학원</option>
                            </select>
                        </div>

                        <!-- 4. 학부(과)전공 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학부(과)전공
                            </label>
                            <select id="title-search-faculty"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="공학부">공학부</option>
                                <option value="인문사회학부">인문사회학부</option>
                                <option value="디자인학부">디자인학부</option>
                            </select>
                        </div>

                        <!-- 5. 학과/전공 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학과/전공
                            </label>
                            <select id="title-search-major"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="컴퓨터공학">컴퓨터공학</option>
                                <option value="전기전자공학">전기전자공학</option>
                                <option value="경영학">경영학</option>
                            </select>
                        </div>

                        <!-- 2행: 5개 필드 -->

                        <!-- 6. 학위과정 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학위과정
                            </label>
                            <select id="title-search-degree"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                                <option value="석박통합">석박통합</option>
                            </select>
                        </div>

                        <!-- 7. 학적상태 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학적상태
                            </label>
                            <select id="title-search-status"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="재학">재학</option>
                                <option value="휴학">휴학</option>
                                <option value="졸업">졸업</option>
                            </select>
                        </div>

                        <!-- 8. 학번 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학번
                            </label>
                            <input type="text"
                                   id="title-search-student-id"
                                   placeholder="학번"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                   style="height: 34px;">
                        </div>

                        <!-- 9. 성명 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                성명
                            </label>
                            <input type="text"
                                   id="title-search-student-name"
                                   placeholder="성명"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                   style="height: 34px;">
                        </div>

                        <!-- 10. 지도교수명 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                지도교수명
                            </label>
                            <input type="text"
                                   id="title-search-advisor"
                                   placeholder="지도교수명"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                   style="height: 34px;">
                        </div>

                        <!-- 3행: 버튼 (오른쪽 정렬) -->
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>

                        <!-- 버튼 영역 (마지막 열) -->
                        <div class="flex items-center justify-end">
                            <button onclick="searchTitleChangeRequests()"
                                    class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                                조회
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 테이블 -->
                <div class="bg-white rounded-lg shadow-md">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">최종 논문 제목 등록 목록</h3>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full table-fixed">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학구분</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">계열/대학원</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학부(과)전공</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과/전공</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학적상태</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수명</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${data.length > 0 ? data.map((item, idx) => `
                                    <tr class="hover:bg-gray-50 cursor-pointer" onclick="showTitleChangeDetail(${item.id})">
                                        <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.year || '2025'}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.semester || '1'}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.collegeType || '대학원'}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.graduate || '일반대학원'}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.faculty || '-'}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.status || '재학'}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                        <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${item.advisorName || item.professor || '-'}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="12" class="py-8 text-center text-gray-500">
                                            논문 제목 등록 내역이 없습니다.
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 상세 화면 -->
            <div id="title-change-detail-view" style="display: none;">
                <!-- JavaScript로 동적 렌더링 -->
            </div>
        `;
    },

    // ========== 주차별 지도 관리 ==========
    weeklyGuidance: () => {
        // 초기화는 admin_weekly_guidance.js에서 처리
        setTimeout(() => {
            if (typeof initWeeklyGuidance === 'function') {
                initWeeklyGuidance();
            }
        }, 100);

        return `
            <div id="weekly-guidance-content">
                <!-- 목록/상세 화면이 여기에 렌더링됩니다 -->
            </div>
        `;
    },

    // ========== 권한 관리 (V1 삭제됨 - V2가 아래에서 재정의) ==========

    // ========== 대리로그인 ==========
    proxyLogin: () => {
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h2 class="text-2xl font-bold text-gray-800">대리로그인</h2>
                    <p class="text-sm text-gray-600 mt-2">시스템을 이용하는 교수 또는 학생의 계정으로 대리 로그인하여 화면을 확인할 수 있습니다.</p>
                </div>

                <div class="p-6">
                    <!-- 검색 및 필터 -->
                    <div class="mb-4 flex gap-4">
                        <select id="proxy-login-filter" class="border border-gray-300 rounded px-3 py-2 text-sm"
                                onchange="filterProxyLoginUsers()">
                            <option value="all">전체</option>
                            <option value="교수">교수</option>
                            <option value="학생">학생</option>
                        </select>
                        <input type="text" id="proxy-login-search" placeholder="이름 또는 학번/교번으로 검색"
                               class="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
                               oninput="filterProxyLoginUsers()">
                    </div>

                    <!-- 사용자 목록 테이블 -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full table-fixed">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">구분</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번/교번</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이름</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                    <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이메일</th>
                                    <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">액션</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${(appData.systemUsers || []).map(user => `
                                    <tr class="hover:bg-gray-50 proxy-login-row"
                                        data-type="${user.type}"
                                        data-search="${user.name} ${user.type === '교수' ? user.employeeId : user.studentId}">
                                        <td class="py-3 px-4 text-sm">
                                            <span class="px-2 py-1 rounded-full text-xs font-medium ${user.type === '교수' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                                                ${user.type}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                            ${user.type === '교수' ? user.employeeId : user.studentId}
                                        </td>
                                        <td class="py-3 px-4 text-sm text-gray-800">
                                            ${addStudentInfoIcon(user.name, user.type === '교수' ? user.employeeId : user.studentId)}
                                        </td>
                                        <td class="py-3 px-4 text-sm text-gray-800">${user.graduate}</td>
                                        <td class="py-3 px-4 text-sm text-gray-800">
                                            ${user.type === '교수' ? user.department : `${user.major}${user.degree ? ` (${user.degree})` : ''}`}
                                        </td>
                                        <td class="py-3 px-4 text-sm text-gray-600">${user.email}</td>
                                        <td class="py-3 px-4">
                                            <button onclick="proxyLogin('${user.id}', '${user.type}', '${user.name}', '${user.loginUrl}')"
                                                    class="bg-[#009DE8] text-white px-4 py-2 rounded text-sm hover:bg-[#0087c9] w-full whitespace-nowrap">
                                                <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                                                </svg>
                                                대리로그인
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    ${(appData.systemUsers || []).length === 0 ? `
                        <div class="text-center py-8 text-gray-500">
                            등록된 시스템 사용자가 없습니다.
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // 지도교수 배정 화면 (P1-1)
    advisorAssignment: () => {
        // Mock 데이터 로드
        if (typeof mockResearchProposals === 'undefined' || typeof mockAdvisorAssignments === 'undefined') {
            return `
                <div class="bg-white rounded-lg shadow-md p-8">
                    <div class="text-center text-red-500">
                        <p class="text-lg">Mock 데이터가 로드되지 않았습니다.</p>
                        <p class="text-sm mt-2">admin/assets/js/mockData.js 파일을 확인하세요.</p>
                    </div>
                </div>
            `;
        }

        // 연구계획서와 배정 상태 통합
        const proposalsWithAssignment = mockResearchProposals.map(proposal => {
            const assignment = mockAdvisorAssignments.find(a => a.studentId === proposal.studentId);
            const student = mockStudents.find(s => s.id === proposal.studentId);
            return {
                ...proposal,
                academicYear: student?.academicYear || '-',
                semesterCount: student?.semesterCount || 0,
                assignment: assignment || null
            };
        });

        // 필터링된 데이터 사용 (검색 기능용)
        const data = window.filteredAdvisorData || proposalsWithAssignment;

        return `
            <div class="bg-white rounded-lg shadow-md">
                <!-- 검색 영역 -->
                <div class="p-6 border-b">
                    <div class="grid grid-cols-5 gap-3">
                        <!-- 1행: 5개 필드 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
                            <div class="flex gap-2 flex-1">
                                <select id="advisor-search-year" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                                <select id="advisor-search-semester" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                            <select id="advisor-search-college-type" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="일반대학원">일반대학원</option>
                                <option value="특수대학원">특수대학원</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                            <select id="advisor-search-graduate" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="일반대학원">일반대학원</option>
                                <option value="교육대학원">교육대학원</option>
                                <option value="산업정보대학원">산업정보대학원</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                            <select id="advisor-search-major-category" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="공과대학">공과대학</option>
                                <option value="사범대학">사범대학</option>
                                <option value="인문대학">인문대학</option>
                                <option value="사회과학대학">사회과학대학</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                            <select id="advisor-search-department" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                ${mockDepartmentNames.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                            </select>
                        </div>

                        <!-- 2행: 5개 필드 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                            <select id="advisor-search-degree" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                                <option value="석박통합">석박통합</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                            <select id="advisor-search-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="재학">재학</option>
                                <option value="휴학">휴학</option>
                                <option value="수료">수료</option>
                                <option value="졸업">졸업</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">배정상태</label>
                            <select id="advisor-search-assignment-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                <option value="">전체</option>
                                <option value="배정완료">배정완료</option>
                                <option value="미배정">미배정</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                            <input type="text" id="advisor-search-student-id" placeholder="학번"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                            <input type="text" id="advisor-search-student-name" placeholder="성명"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        </div>

                        <!-- 3행: 1개 필드 + 버튼 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                            <input type="text" id="advisor-search-advisor-name" placeholder="지도교수명"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                        </div>
                        <div class="col-span-3"></div>
                        <div class="flex items-center justify-end">
                            <button onclick="searchAdvisorAssignment()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                                <i class="fas fa-search mr-1"></i>조회
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 테이블 컨테이너 -->
                <div class="table-container">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">지도교수 배정 목록</h3>
                            <span class="table-count">(총 ${data.length}명)</span>
                        </div>
                    </div>
                    <div class="table-scroll">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th style="width: 60px;">순번</th>
                                    <th style="width: 80px;">학년도</th>
                                    <th style="width: 70px;">학기</th>
                                    <th style="width: 100px;">대학구분</th>
                                    <th style="width: 120px;">계열/대학원</th>
                                    <th style="width: 120px;">학부(과)전공</th>
                                    <th style="width: 120px;">학과/전공</th>
                                    <th style="width: 90px;">학위과정</th>
                                    <th style="width: 90px;">학적상태</th>
                                    <th style="width: 90px;">배정상태</th>
                                    <th style="width: 100px;">학번</th>
                                    <th style="width: 100px;">성명</th>
                                    <th style="width: 120px;">지도교수</th>
                                    <th style="width: 150px;">공동지도교수</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.map((item, index) => {
                                    // 학기: semesterCount를 학기로 변환 (1학기, 2학기 등)
                                    const semester = item.semesterCount ? `${item.semesterCount}학기` : '-';
                                    // 학적상태: student.status 기반 ('active' → '재학', 'inactive' → '휴학')
                                    const enrollmentStatus = item.studentStatus === 'active' ? '재학' : '휴학';
                                    // 배정상태: mainAdvisor 존재 여부
                                    const assignmentStatus = item.assignment?.mainAdvisor ? '배정완료' : '미배정';

                                    return `
                                    <tr onclick="viewProposalDetail('${item.id}')">
                                        <td>${index + 1}</td>
                                        <td>${item.academicYear}</td>
                                        <td>${semester}</td>
                                        <td>대학원</td>
                                        <td>일반대학원</td>
                                        <td>-</td>
                                        <td>${item.department}</td>
                                        <td>${item.degreeType}</td>
                                        <td>${enrollmentStatus}</td>
                                        <td>${assignmentStatus}</td>
                                        <td>${item.studentNumber}</td>
                                        <td class="font-medium">
                                            ${item.studentName}
                                            <button onclick="event.stopPropagation(); showStudentInfo('${item.studentId}')"
                                                    class="ml-1 text-gray-400 hover:text-[#6A0028]"
                                                    title="학생 상세정보">
                                                <svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </td>
                                        <td>
                                            ${item.assignment && item.assignment.mainAdvisor
                                                ? item.assignment.mainAdvisor.name
                                                : '-'}
                                        </td>
                                        <td>
                                            ${item.assignment && item.assignment.coAdvisors.length > 0
                                                ? item.assignment.coAdvisors.map(c => c.name).join(', ')
                                                : '-'}
                                        </td>
                                    </tr>
                                `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                ${data.length === 0 ? `
                    <div class="text-center py-8 text-gray-500">
                        ${window.filteredAdvisorData ? '검색 결과가 없습니다.' : '제출된 연구계획서가 없습니다.'}
                    </div>
                ` : ''}

            </div>
        `;
    },

    // 논문 지도 단계 관리 화면
    stageManagement: () => {
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800">학생별 지도 단계 관리</h2>
                    <p class="text-sm text-gray-600 mt-1">학생들의 논문 지도 단계를 관리하고 일괄 이관을 수행합니다.</p>
                </div>

                <!-- 단계 관리 컨텐츠 영역 -->
                <div id="stage-management-content"></div>

            </div>
        `;
    },

    // 워크플로우 관리 (심사 단계 등록)
    typeManagement: () => {
        const data = mockThesisStages;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="table-container">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">지도 단계 목록</h3>
                            <span class="table-count">(총 ${data.length}건)</span>
                        </div>
                        <div class="table-header-right">
                            <button onclick="switchView('workflowCreateUnified')" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                                등록
                            </button>
                        </div>
                    </div>
                    <div class="table-scroll">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도 단계명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계 구성</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">유효 지도단계</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">일정관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => {
                                const degreeLabel = item.degreeType === 'master' ? '석사' : '박사';
                                const departmentLabel = item.departmentName || '-';
                                const isValidLabel = item.isValidStage === 'Y' ? 'Y' : 'N';

                                return `
                                <tr class="hover:bg-blue-50">
                                    <td class="py-3 px-4 text-sm text-gray-600" onclick="switchView('workflowCreateUnified', '${item.id}')">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800 cursor-pointer" onclick="switchView('workflowCreateUnified', '${item.id}')">${item.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-700" onclick="switchView('workflowCreateUnified', '${item.id}')">${departmentLabel}</td>
                                    <td class="py-3 px-4 text-sm text-gray-700" onclick="switchView('workflowCreateUnified', '${item.id}')">${degreeLabel}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600" onclick="switchView('workflowCreateUnified', '${item.id}')">
                                        <div class="flex items-center gap-1 flex-wrap">
                                            ${item.stages.map((stage, stepIdx) => {
                                                const stepType = mockStepTypes.find(st => st.id === stage.stepTypeId);
                                                const bgColor = stage.type === 'submission' ? 'bg-gray-100 text-gray-700' :
                                                               (stage.evaluationRequired ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700');

                                                return `
                                                    <span class="px-2 py-1 rounded text-xs ${bgColor}" title="${stepType ? stepType.description : ''}">
                                                        ${stage.order}. ${stage.name}
                                                    </span>
                                                    ${stepIdx < item.stages.length - 1 ? '<span class="text-gray-400">→</span>' : ''}
                                                `;
                                            }).join('')}
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600 text-center" onclick="switchView('workflowCreateUnified', '${item.id}')">${isValidLabel}</td>
                                    <td class="py-3 px-4 text-sm text-center">
                                        <button onclick="event.stopPropagation(); openScheduleModal('${item.id}')"
                                                class="text-blue-600 hover:text-blue-800 hover:underline">
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        `;
    },

    // 심사위원 배정 화면 (P1-5)
    committeeAssignment: () => {
        // 초기화: 다음 틱에 렌더링 함수 호출
        setTimeout(() => {
            if (typeof showCommitteeAssignment === 'function') {
                showCommitteeAssignment();
            }
        }, 100);

        return `<div id="committee-assignment-content"></div>`;
    },

    // ========== 워크플로우 등록 (신규 단일 패널 방식) ==========
    workflowCreateUnified: (id = null) => {
        const isEdit = id !== null;
        const item = isEdit ? mockThesisStages.find(s => s.id === id) : null;

        // Initialize global variable: 신규 등록 시 빈 카드 1개 기본 표시
        window.composedStages = isEdit ? JSON.parse(JSON.stringify(item.stages)) : [{
            id: 'STAGE_NEW_' + Date.now(),
            order: 1,
            stageTypeId: '',  // 신규: 단계 유형 ID
            stepTypeId: '',   // 하위 호환
            categoryId: '',   // 하위 호환 (deprecated)
            examTypeId: '',   // 신규: 심사 유형 ID
            name: '',
            // requiresDocument, requiresPresentation는 stageType에서 자동 상속되므로 제거
            evaluationTemplateId: '',
            description: '',
            scheduleTypes: []  // 일정 관리 구분
        }];
        window.currentWorkflowId = id;

        const handleSave = () => {
            const name = document.getElementById('workflow-name').value;
            const department = document.getElementById('workflow-department').value;
            const degreeCheckboxes = document.querySelectorAll('input[name="workflow-degree"]:checked');
            const isValidCheckbox = document.querySelector('input[name="workflow-is-valid"]:checked');

            if (!name.trim()) {
                alert('워크플로우 이름을 입력해주세요.');
                return;
            }

            if (!department) {
                alert('학과명을 선택해주세요.');
                return;
            }

            if (degreeCheckboxes.length === 0) {
                alert('학위 과정을 최소 1개 이상 선택해주세요.');
                return;
            }

            if (!isValidCheckbox) {
                alert('유효 지도단계 여부를 선택해주세요.');
                return;
            }

            // 단계 유효성 검사
            for (let i = 0; i < window.composedStages.length; i++) {
                const stage = window.composedStages[i];
                if (!stage.stageTypeId && !stage.stepTypeId && !stage.categoryId) {
                    alert(`단계 ${i + 1}: 단계 유형을 선택해주세요.`);
                    return;
                }
                if (!stage.name.trim()) {
                    alert(`단계 ${i + 1}: 단계 이름을 입력해주세요.`);
                    return;
                }
            }

            saveUnifiedWorkflow();
        };

        // Setup button handlers after render
        setTimeout(() => {
            const saveBtn = document.getElementById('unified-save-btn');
            if (saveBtn) {
                saveBtn.onclick = handleSave;
            }
        }, 0);

        return `
            <div class="bg-white rounded-lg shadow-md">
                <!-- Header -->
                <div class="p-6 border-b">
                    <button onclick="switchView('typeManagement')"
                            class="text-gray-600 hover:text-gray-800 flex items-center">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        목록으로 돌아가기
                    </button>
                </div>

                <!-- Workflow Basic Info -->
                <div class="p-6 border-b bg-gray-50">
                    <!-- 첫 번째 행: 지도 단계명, 학과명 -->
                    <div class="flex items-center gap-6 mb-4">
                        <!-- 좌측: 지도 단계명 -->
                        <div class="flex items-center gap-4 flex-1">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[110px]">
                                지도 단계명 *
                            </label>
                            <input type="text"
                                   id="workflow-name"
                                   value="${isEdit ? item.name : ''}"
                                   placeholder="예: 석사 표준 과정"
                                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- 우측: 학과명 -->
                        <div class="flex items-center gap-4 flex-1">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[90px]">
                                학과명 *
                            </label>
                            <select id="workflow-department"
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">학과 선택</option>
                                ${mockDepartmentNames.map(dept => `
                                    <option value="${dept}" ${isEdit && item.departmentName === dept ? 'selected' : ''}>${dept}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <!-- 두 번째 행: 학위 과정, 논문 유형, 유효 지도단계 여부 -->
                    <div class="flex items-center gap-6">
                        <!-- 학위 과정 -->
                        <div class="flex items-center gap-4 flex-1">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[90px]">
                                학위 과정 *
                            </label>
                            <div class="flex items-center gap-6">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="workflow-degree" value="master"
                                           ${isEdit && item.degreeType === 'master' ? 'checked' : ''}
                                           class="mr-2 w-4 h-4 cursor-pointer">
                                    <span class="text-sm text-gray-700">석사</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="workflow-degree" value="phd"
                                           ${isEdit && item.degreeType === 'phd' ? 'checked' : ''}
                                           class="mr-2 w-4 h-4 cursor-pointer">
                                    <span class="text-sm text-gray-700">박사</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="workflow-degree" value="integrated"
                                           ${isEdit && item.degreeType === 'integrated' ? 'checked' : ''}
                                           class="mr-2 w-4 h-4 cursor-pointer">
                                    <span class="text-sm text-gray-700">통합과정</span>
                                </label>
                            </div>
                        </div>

                        <!-- 논문 유형 -->
                        <div class="flex items-center gap-4 flex-1">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[90px]">
                                논문 유형 *
                            </label>
                            <div class="flex items-center gap-6">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="workflow-thesis-type" value="degree"
                                           ${isEdit && item.thesisType === 'degree' ? 'checked' : (!isEdit ? 'checked' : '')}
                                           class="mr-2 w-4 h-4 cursor-pointer">
                                    <span class="text-sm text-gray-700">학위 논문</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="workflow-thesis-type" value="journal"
                                           ${isEdit && item.thesisType === 'journal' ? 'checked' : ''}
                                           class="mr-2 w-4 h-4 cursor-pointer">
                                    <span class="text-sm text-gray-700">학술지 논문</span>
                                </label>
                            </div>
                        </div>

                        <!-- 유효 지도단계 여부 -->
                        <div class="flex items-center gap-4 flex-1">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[90px]">
                                유효 지도단계 *
                            </label>
                            <div class="flex items-center gap-6">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="workflow-is-valid" value="Y"
                                           ${isEdit && item.isValidStage === 'Y' ? 'checked' : (!isEdit ? 'checked' : '')}
                                           class="mr-2 w-4 h-4 cursor-pointer">
                                    <span class="text-sm text-gray-700">Y</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="workflow-is-valid" value="N"
                                           ${isEdit && item.isValidStage === 'N' ? 'checked' : ''}
                                           class="mr-2 w-4 h-4 cursor-pointer">
                                    <span class="text-sm text-gray-700">N</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content: Single Panel with Stage Cards -->
                <div class="p-6">
                    <div id="stage-cards-container" class="space-y-4">
                        ${renderStageCards()}
                    </div>

                    <div class="flex justify-end">
                        <button onclick="addNewStageCard()"
                                class="mt-4 px-7 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2 text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                            단계 추가
                        </button>
                    </div>
                </div>

                <!-- Footer: Buttons -->
                <div class="p-6 border-t bg-gray-50 flex justify-between">
                    <div>
                        ${isEdit ? `
                            <button onclick="deleteWorkflow('${id}')"
                                    class="px-7 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm">
                                삭제
                            </button>
                        ` : ''}
                    </div>
                    <div class="flex gap-3">
                        <button onclick="switchView('typeManagement')"
                                class="px-7 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                            취소
                        </button>
                        <button id="unified-save-btn"
                                class="px-7 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                            ${isEdit ? '수정' : '저장'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 지도단계 등록(신규) - 목록 화면 ==========
    typeManagementNew: () => {
        const data = mockThesisStages;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="table-container">
                    <div class="table-header">
                        <div class="table-header-left">
                            <h3 class="table-title">지도 단계 목록 (신규)</h3>
                            <span class="table-count">(총 ${data.length}건)</span>
                        </div>
                        <div class="table-header-right">
                            <button onclick="switchView('typeManagementCreate')" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                                등록
                            </button>
                            <button onclick="openHeadquartersScheduleModal()" class="bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-[#8A0034] text-sm ml-2">
                                본부일정관리
                            </button>
                        </div>
                    </div>
                    <div class="table-scroll">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도 단계명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계 구성</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">유효 지도단계</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">단계별업무관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => {
                                const degreeLabel = item.degreeType === 'master' ? '석사' : '박사';
                                const departmentLabel = item.departmentName || '-';
                                const isValidLabel = item.isValidStage === 'Y' ? 'Y' : 'N';

                                return `
                                <tr class="hover:bg-blue-50 cursor-pointer" onclick="switchView('typeManagementCreate', '${item.id}')">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-700">${departmentLabel}</td>
                                    <td class="py-3 px-4 text-sm text-gray-700">${degreeLabel}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">
                                        <div class="flex items-center gap-1 flex-wrap">
                                            ${item.stages.map((stage, stepIdx) => {
                                                const bgColor = stage.type === 'submission' ? 'bg-gray-100 text-gray-700' :
                                                               (stage.evaluationRequired ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700');

                                                return `
                                                    <span class="px-2 py-1 rounded text-xs ${bgColor}">
                                                        ${stage.order}. ${stage.name}
                                                    </span>
                                                    ${stepIdx < item.stages.length - 1 ? '<span class="text-gray-400">→</span>' : ''}
                                                `;
                                            }).join('')}
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600 text-center">${isValidLabel}</td>
                                    <td class="py-3 px-4 text-center">
                                        <button onclick="event.stopPropagation(); openStageTaskManagementModal('${item.id}')"
                                                class="bg-[#0D8B63] text-white px-3 py-1.5 rounded hover:bg-[#0A6D4E] text-xs">
                                            관리
                                        </button>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 지도단계 등록 - 계층적 구조 ==========
    typeManagementCreate: () => {
        console.log('🎯 typeManagementCreate view rendering');

        // 초기 데이터 구조: window.hierarchicalStages
        // { basicStage: '논문 작성 계획서', subStages: [...] }
        // 화면 진입 시마다 1개의 기본단계와 1개의 세부단계를 가진 상태로 초기화
        window.hierarchicalStages = [
            {
                id: 'BASIC_' + Date.now(),
                basicStageName: '',
                subStages: [
                    {
                        id: 'SUB_' + Date.now(),
                        order: 1,
                        name: '',
                        isFinalEvaluationReflected: ''
                    }
                ]
            }
        ];

        // 학과명 목록 (mockDepartmentNames가 없을 경우 대비)
        const departments = window.mockDepartmentNames || [
            '컴퓨터공학과', '전자공학과', '기계공학과', '경영학과', '행정학과'
        ];

        console.log('🎯 Departments:', departments);

        return `
            <div class="bg-white rounded-lg shadow-md">
                <!-- 헤더 -->
                <div class="p-6 border-b flex items-center justify-between">
                    <button onclick="switchView('typeManagementNew')"
                            class="text-gray-600 hover:text-gray-800 flex items-center">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        목록으로 돌아가기
                    </button>
                </div>

                <!-- 기본 정보 -->
                <div class="p-6 border-b bg-gray-50">
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Row 1 -->
                        <div class="flex items-center gap-4">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[110px]">
                                지도 단계명 <span class="text-red-600">*</span>
                            </label>
                            <input type="text"
                                   id="new-workflow-name"
                                   placeholder="예: 석사 표준 과정"
                                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div class="flex items-center gap-4">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[90px]">
                                학과명 <span class="text-red-600">*</span>
                            </label>
                            <select id="new-workflow-department"
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">학과 선택</option>
                                ${departments.map(dept => `
                                    <option value="${dept}">${dept}</option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- Row 2 -->
                        <div class="flex items-center gap-4">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[110px]">
                                학위 과정 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="degreeType" value="master" checked class="mr-2">
                                    <span class="text-sm text-gray-700">석사</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="degreeType" value="phd" class="mr-2">
                                    <span class="text-sm text-gray-700">박사</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="degreeType" value="integrated" class="mr-2">
                                    <span class="text-sm text-gray-700">통합과정</span>
                                </label>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[90px]">
                                논문 유형 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="thesisType" value="degree" checked class="mr-2">
                                    <span class="text-sm text-gray-700">학위 논문</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="thesisType" value="journal" class="mr-2">
                                    <span class="text-sm text-gray-700">학술지 논문</span>
                                </label>
                            </div>
                        </div>

                        <!-- Row 3 -->
                        <div class="flex items-center gap-4">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[110px]">
                                유효 지도단계 <span class="text-red-600">*</span>
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="isValidStage" value="Y" checked class="mr-2">
                                    <span class="text-sm text-gray-700">Y</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="isValidStage" value="N" class="mr-2">
                                    <span class="text-sm text-gray-700">N</span>
                                </label>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <!-- Empty cell for layout -->
                        </div>
                    </div>
                </div>

                <!-- 계층적 단계 구성 -->
                <div class="p-6">
                    <div class="mb-4">
                        <h4 class="text-md font-semibold text-gray-800 mb-2">단계 구성</h4>
                        <p class="text-sm text-gray-600 mb-4">
                            기본단계를 선택한 후, 각 기본단계마다 세부단계를 최소 1개 이상 추가해주세요.
                        </p>
                    </div>

                    <!-- 기본단계 목록 -->
                    <div id="hierarchical-stages-container" class="space-y-6">
                        <!-- JavaScript로 동적 렌더링 -->
                    </div>

                    <!-- 기본단계 추가 버튼 -->
                    <div class="flex justify-end mt-4">
                        <button onclick="addBasicStage()"
                                class="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2 text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                            기본단계 추가
                        </button>
                    </div>
                </div>

                <!-- 푸터 버튼 -->
                <div class="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button onclick="saveHierarchicalWorkflow()"
                            class="px-7 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                        저장
                    </button>
                </div>
            </div>
        `;
    },

    // ========== 사용자 관리 ==========
    userManagement: () => {
        const users = mockUsers;
        const departments = mockDepartments;
        const positions = mockPositions;
        const userMappings = mockUserMapping;
        const userStatuses = mockUserStatus;

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">사용자 관리</h3>
                            <p class="text-sm text-gray-600 mt-1">ERP 동기화된 사용자 정보를 조회합니다.</p>
                        </div>
                        <div class="flex space-x-2">
                            <span class="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                                <i class="fas fa-sync-alt mr-1"></i> ERP 동기화: 2025-01-15 09:00
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Search & Filter -->
                <div class="p-6 border-b bg-gray-50">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text" placeholder="이름/사번 검색" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <select class="px-3 py-2 border border-gray-300 rounded-md text-sm">
                            <option value="">부서 전체</option>
                            ${departments.map(dept => `<option value="${dept.id}">${dept.name}</option>`).join('')}
                        </select>
                        <select class="px-3 py-2 border border-gray-300 rounded-md text-sm">
                            <option value="">신분 전체</option>
                            ${positions.map(pos => `<option value="${pos.id}">${pos.name}</option>`).join('')}
                        </select>
                        <button class="px-4 py-2 bg-[#009DE8] text-white rounded-md text-sm hover:bg-opacity-90">
                            검색
                        </button>
                    </div>
                </div>

                <!-- User Table -->
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이름</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">사번/학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">소속 부서</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">신분</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">역할</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">상태</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${users.map(user => {
                                const userMapping = userMappings.find(um => um.userId === user.username);
                                const department = departments.find(d => d.id === userMapping?.departmentId);
                                const position = positions.find(p => p.id === userMapping?.positionId);
                                const userStatus = userStatuses.find(us => us.userId === user.username);
                                const role = mockRoles.find(r => r.id === user.roleId);

                                const statusBadgeClass = userStatus?.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        userStatus?.status === 'leave' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800';

                                return `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${user.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${user.username}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${department ? department.name : user.department}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${position ? position.name : '-'}</td>
                                    <td class="py-3 px-4 text-sm">
                                        <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                            ${role ? role.name : '-'}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <span class="px-2 py-1 text-xs rounded ${statusBadgeClass}">
                                            ${userStatus ? userStatus.statusName : '재직'}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <button onclick="openUserSimulatorModal(); document.getElementById('user-simulator-search').value='${user.username}';"
                                                class="text-[#009DE8] hover:underline text-sm">
                                            권한 조회
                                        </button>
                                    </td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Info Box -->
                <div class="p-6 bg-gray-50 border-t">
                    <div class="flex items-start space-x-2 text-sm text-gray-600">
                        <svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        <div>
                            <p class="font-medium">ERP 연동 정보</p>
                            <p class="mt-1">사용자 정보는 ERP 시스템에서 자동으로 동기화됩니다. 사용자 생성/수정/삭제는 ERP 시스템에서 수행해야 합니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 역할 관리 ==========
    roleManagement: () => {
        const roles = mockRoles;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">역할 관리</h3>
                            <p class="text-sm text-gray-600 mt-1">시스템 역할을 관리하고 권한을 부여합니다.</p>
                        </div>
                        <button onclick="openRoleModal()" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            등록
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${roles.map(role => {
                            const permCount = mockRolePermissions.find(rp => rp.roleId === role.id)?.permissionIds.length || 0;
                            const levelColor = role.level === 1 ? 'bg-red-100 text-red-800' :
                                             role.level === 2 ? 'bg-blue-100 text-blue-800' :
                                             'bg-green-100 text-green-800';
                            return `
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex-1">
                                        <div class="flex items-center mb-2">
                                            <h4 class="font-bold text-gray-800">${role.name}</h4>
                                            ${role.isSystem ? '<span class="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-600">시스템</span>' : ''}
                                        </div>
                                        <p class="text-xs text-gray-600 mb-2">${role.description}</p>
                                        <span class="inline-block px-2 py-1 rounded text-xs font-medium ${levelColor}">
                                            Level ${role.level}
                                        </span>
                                    </div>
                                </div>
                                <div class="border-t pt-3 mt-3">
                                    <div class="text-sm text-gray-600 mb-2">
                                        <i class="fas fa-key mr-1"></i> ${permCount}개 권한
                                    </div>
                                    <div class="flex space-x-2">
                                        <button onclick="viewRolePermissions('${role.id}')"
                                                class="flex-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs">
                                            권한 보기
                                        </button>
                                        ${!role.isSystem ? `
                                            <button onclick="editRole('${role.id}')"
                                                    class="flex-1 text-purple-600 hover:bg-purple-50 px-2 py-1 rounded text-xs">
                                                수정
                                            </button>
                                            <button onclick="deleteRole('${role.id}')"
                                                    class="flex-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs">
                                                삭제
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 권한 관리 (단일 화면 통합형: 소속 > 신분 > 상태 → 권한 부여) ==========
    permissionManagement: () => {
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800">권한 관리</h3>
                    <p class="text-sm text-gray-600 mt-1">소속/신분/상태 조합, 역할그룹, 개인별로 관리자 메뉴 접근 권한을 설정합니다.</p>
                </div>
                <div id="perm-page-content">
                    ${renderPermissionPage()}
                </div>
            </div>
        `;
    },

    // ========== 역할-권한 매핑 ==========
    rolePermissionMapping: () => {
        const roles = mockRoles;
        const selectedRoleId = window.selectedRoleForMapping || roles[0]?.id;

        // 초기 로드를 위한 스크립트 추가
        setTimeout(() => {
            if (typeof loadRolePermissions === 'function') {
                loadRolePermissions(selectedRoleId);
            }
        }, 0);

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800">역할별 권한 설정</h3>
                    <p class="text-sm text-gray-600 mt-1">역할에 권한을 부여하거나 회수합니다.</p>
                </div>
                <div class="p-6">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">역할 선택</label>
                        <select id="role-select"
                                onchange="loadRolePermissions(this.value)"
                                class="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009DE8]">
                            ${roles.map(role => `
                                <option value="${role.id}" ${role.id === selectedRoleId ? 'selected' : ''}>
                                    ${role.name} - ${role.description}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div id="permission-checkboxes" class="space-y-6">
                        <!-- 동적으로 로드됨 -->
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button onclick="switchView('roleManagement')"
                                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                            취소
                        </button>
                        <button onclick="saveRolePermissions()"
                                class="px-4 py-2 bg-[#009DE8] text-white rounded-md hover:bg-opacity-90">
                            저장
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== 공지사항 관리 ==========
    noticeManagement: () => {
        const notices = mockNotices || [];
        const searchKeyword = '';

        return `
            <div class="bg-white rounded-lg shadow-md">
                <!-- Header -->
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">공지사항 관리</h3>
                            <p class="text-sm text-gray-600 mt-1">공지사항을 등록하고 관리합니다.</p>
                        </div>
                        <button onclick="switchView('noticeEdit')" class="px-4 py-2 bg-[#009DE8] text-white rounded-md hover:bg-opacity-90">
                            등록
                        </button>
                    </div>
                </div>

                <!-- Search -->
                <div class="p-6 border-b bg-gray-50">
                    <div class="flex gap-4">
                        <input type="text" id="notice-search" placeholder="제목 또는 내용 검색..."
                               class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009DE8]">
                        <button onclick="searchNotices()" class="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800">
                            검색
                        </button>
                    </div>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">제목</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">작성자</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">작성일</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${notices.length === 0 ? `
                                <tr>
                                    <td colspan="4" class="py-8 text-center text-gray-500">
                                        등록된 공지사항이 없습니다.
                                    </td>
                                </tr>
                            ` : notices.map((notice, idx) => `
                                <tr class="hover:bg-blue-50 cursor-pointer" onclick="switchView('noticeDetail', '${notice.id}')">
                                    <td class="py-3 px-4 text-sm text-gray-600">${notices.length - idx}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${notice.title}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${notice.authorName}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${notice.createdAt.split(' ')[0]}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 공지사항 상세 ==========
    noticeDetail: (id) => {
        const notice = mockNotices.find(n => n.id === id);

        if (!notice) {
            return `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="text-center text-gray-500">
                        공지사항을 찾을 수 없습니다.
                    </div>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <button onclick="switchView('noticeManagement')"
                            class="text-gray-600 hover:text-gray-800 flex items-center">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        목록으로 돌아가기
                    </button>
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">${notice.title}</h3>
                            <div class="flex items-center text-sm text-gray-600 space-x-4">
                                <span>작성자: ${notice.authorName}</span>
                                <span>작성일: ${notice.createdAt}</span>
                                ${notice.updatedAt !== notice.createdAt ? `<span>수정일: ${notice.updatedAt}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex space-x-2 ml-4">
                            <button
                                onclick="switchView('noticeEdit', '${notice.id}')"
                                class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                                수정
                            </button>
                            <button
                                onclick="deleteNotice('${notice.id}')"
                                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="prose max-w-none">
                        ${notice.content}
                    </div>
                    ${notice.attachments && notice.attachments.length > 0 ? `
                        <div class="mt-6 pt-6 border-t">
                            <h4 class="font-semibold text-gray-700 mb-3">첨부파일</h4>
                            <ul class="space-y-2">
                                ${notice.attachments.map(file => `
                                    <li>
                                        <a href="${file.url}" class="text-primary hover:underline flex items-center">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                            </svg>
                                            ${file.name}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div class="p-6 border-t bg-gray-50">
                    <button
                        onclick="switchView('noticeManagement')"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                        목록으로
                    </button>
                </div>
            </div>
        `;
    },

    // ========== 공지사항 작성/수정 ==========
    noticeEdit: (id = null) => {
        const isEdit = id !== null;
        const notice = isEdit ? mockNotices.find(n => n.id === id) : {};

        // HTML 태그 제거하여 순수 텍스트만 추출 (초기 로드용)
        const stripHtml = (html) => {
            const tmp = document.createElement('div');
            tmp.innerHTML = html || '';
            return tmp.textContent || tmp.innerText || '';
        };

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <button onclick="switchView(${isEdit ? `'noticeDetail', '${id}'` : `'noticeManagement'`})"
                            class="text-gray-600 hover:text-gray-800 flex items-center">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        ${isEdit ? '상세로 돌아가기' : '목록으로 돌아가기'}
                    </button>
                </div>
                <div class="p-6">
                    <form id="notice-edit-form" class="space-y-6">
                        <!-- 제목 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                제목 <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="notice-title"
                                value="${isEdit ? notice.title : ''}"
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="공지사항 제목을 입력하세요"
                                required>
                        </div>

                        <!-- 에디터 툴바 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                내용 <span class="text-red-600">*</span>
                            </label>
                            <div class="border rounded-lg">
                                <!-- 툴바 -->
                                <div class="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
                                    <!-- 폰트 크기 -->
                                    <select onchange="applyFormat('fontSize', this.value)" class="px-2 py-1 border rounded text-sm">
                                        <option value="">크기</option>
                                        <option value="1">작게</option>
                                        <option value="3" selected>보통</option>
                                        <option value="5">크게</option>
                                        <option value="7">아주 크게</option>
                                    </select>

                                    <!-- 텍스트 스타일 -->
                                    <button type="button" onclick="applyFormat('bold')" class="px-3 py-1 border rounded hover:bg-gray-200" title="굵게">
                                        <strong>B</strong>
                                    </button>
                                    <button type="button" onclick="applyFormat('italic')" class="px-3 py-1 border rounded hover:bg-gray-200" title="기울임">
                                        <em>I</em>
                                    </button>
                                    <button type="button" onclick="applyFormat('underline')" class="px-3 py-1 border rounded hover:bg-gray-200" title="밑줄">
                                        <u>U</u>
                                    </button>
                                    <button type="button" onclick="applyFormat('strikeThrough')" class="px-3 py-1 border rounded hover:bg-gray-200" title="취소선">
                                        <s>S</s>
                                    </button>

                                    <div class="border-l mx-1"></div>

                                    <!-- 정렬 -->
                                    <button type="button" onclick="applyFormat('justifyLeft')" class="px-3 py-1 border rounded hover:bg-gray-200" title="왼쪽 정렬">
                                        ≡
                                    </button>
                                    <button type="button" onclick="applyFormat('justifyCenter')" class="px-3 py-1 border rounded hover:bg-gray-200" title="가운데 정렬">
                                        ≡
                                    </button>
                                    <button type="button" onclick="applyFormat('justifyRight')" class="px-3 py-1 border rounded hover:bg-gray-200" title="오른쪽 정렬">
                                        ≡
                                    </button>

                                    <div class="border-l mx-1"></div>

                                    <!-- 목록 -->
                                    <button type="button" onclick="applyFormat('insertUnorderedList')" class="px-3 py-1 border rounded hover:bg-gray-200" title="글머리 기호">
                                        • 목록
                                    </button>
                                    <button type="button" onclick="applyFormat('insertOrderedList')" class="px-3 py-1 border rounded hover:bg-gray-200" title="번호 매기기">
                                        1. 목록
                                    </button>

                                    <div class="border-l mx-1"></div>

                                    <!-- 링크 -->
                                    <button type="button" onclick="insertLink()" class="px-3 py-1 border rounded hover:bg-gray-200" title="링크">
                                        🔗
                                    </button>

                                    <div class="border-l mx-1"></div>

                                    <!-- 제목 스타일 -->
                                    <select onchange="applyFormat('formatBlock', this.value); this.value='';" class="px-2 py-1 border rounded text-sm">
                                        <option value="">스타일</option>
                                        <option value="h1">제목 1</option>
                                        <option value="h2">제목 2</option>
                                        <option value="h3">제목 3</option>
                                        <option value="h4">제목 4</option>
                                        <option value="p">본문</option>
                                    </select>

                                    <div class="border-l mx-1"></div>

                                    <!-- 색상 -->
                                    <input type="color" onchange="applyFormat('foreColor', this.value)" class="w-8 h-8 border rounded cursor-pointer" title="글자색">
                                    <input type="color" onchange="applyFormat('backColor', this.value)" class="w-8 h-8 border rounded cursor-pointer" title="배경색">
                                </div>

                                <!-- 에디터 영역 -->
                                <div
                                    id="notice-content-editor"
                                    contenteditable="true"
                                    class="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-primary"
                                    style="max-height: 600px; overflow-y: auto;">
                                    ${isEdit ? notice.content : '<p>공지사항 내용을 입력하세요.</p>'}
                                </div>
                            </div>
                            <p class="mt-1 text-sm text-gray-500">* 기본 에디터 기능을 제공합니다. 향후 네이버 스마트에디터로 교체 예정</p>
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onclick="switchView('${isEdit ? 'noticeDetail' : 'noticeManagement'}', '${isEdit ? id : ''}')"
                                class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                취소
                            </button>
                            <button
                                type="button"
                                onclick="saveNoticeFromPage('${isEdit ? id : ''}')"
                                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                ${isEdit ? '수정 완료' : '등록'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // ========== 연구윤리 안내 (관리자용 - 조회 + 편집) ==========
    ethicsGuide: () => {
        return renderGuideContent('ethics', true); // true = 관리자 권한
    },

    // ========== 논문일정 안내 (관리자용 - 조회 + 편집) ==========
    scheduleGuide: () => {
        return renderGuideContent('schedule', true); // true = 관리자 권한
    },

    // ========== 논문지도절차 안내 (관리자용 - 조회 + 편집) ==========
    processGuide: () => {
        return renderGuideContent('procedure', true); // true = 관리자 권한
    },

    // ========== 안내문 편집 페이지 ==========
    guideEdit: (type) => {
        const guide = mockGuides.find(g => g.type === type && g.isPublished);

        const titleMap = {
            'ethics': '연구윤리',
            'schedule': '논문일정',
            'procedure': '논문지도절차'
        };

        const viewMap = {
            'ethics': 'ethicsGuide',
            'schedule': 'scheduleGuide',
            'procedure': 'processGuide'
        };

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <button onclick="switchView('${viewMap[type]}')"
                            class="text-gray-600 hover:text-gray-800 flex items-center">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        상세로 돌아가기
                    </button>
                </div>
                <div class="p-6">
                    <form id="guide-edit-form" class="space-y-4">
                        <!-- 에디터 영역 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                내용 <span class="text-red-600">*</span>
                            </label>

                            <!-- 에디터 툴바 -->
                            <div class="border border-gray-300 rounded-t-md bg-gray-50 px-2 py-2 flex items-center gap-2 flex-wrap">
                                <!-- 폰트 크기 -->
                                <select id="fontSize" onchange="applyFormat('fontSize', this.value)"
                                        class="text-sm border border-gray-300 rounded px-2 py-1">
                                    <option value="">폰트 크기</option>
                                    <option value="1">매우 작게</option>
                                    <option value="2">작게</option>
                                    <option value="3">보통</option>
                                    <option value="4">크게</option>
                                    <option value="5">매우 크게</option>
                                    <option value="6">아주 크게</option>
                                    <option value="7">최대</option>
                                </select>

                                <div class="border-l border-gray-300 h-6 mx-1"></div>

                                <!-- 텍스트 스타일 -->
                                <button type="button" onclick="applyFormat('bold')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm font-bold"
                                        title="굵게">
                                    B
                                </button>
                                <button type="button" onclick="applyFormat('italic')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm italic"
                                        title="기울임">
                                    I
                                </button>
                                <button type="button" onclick="applyFormat('underline')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm underline"
                                        title="밑줄">
                                    U
                                </button>
                                <button type="button" onclick="applyFormat('strikeThrough')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm line-through"
                                        title="취소선">
                                    S
                                </button>

                                <div class="border-l border-gray-300 h-6 mx-1"></div>

                                <!-- 정렬 -->
                                <button type="button" onclick="applyFormat('justifyLeft')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                                        title="왼쪽 정렬">
                                    ◧
                                </button>
                                <button type="button" onclick="applyFormat('justifyCenter')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                                        title="가운데 정렬">
                                    ▥
                                </button>
                                <button type="button" onclick="applyFormat('justifyRight')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                                        title="오른쪽 정렬">
                                    ◨
                                </button>

                                <div class="border-l border-gray-300 h-6 mx-1"></div>

                                <!-- 목록 -->
                                <button type="button" onclick="applyFormat('insertUnorderedList')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                                        title="글머리 기호">
                                    • 목록
                                </button>
                                <button type="button" onclick="applyFormat('insertOrderedList')"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                                        title="번호 매기기">
                                    1. 목록
                                </button>

                                <div class="border-l border-gray-300 h-6 mx-1"></div>

                                <!-- 링크 -->
                                <button type="button" onclick="insertLink()"
                                        class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                                        title="링크 삽입">
                                    링크
                                </button>

                                <div class="border-l border-gray-300 h-6 mx-1"></div>

                                <!-- 제목 -->
                                <select id="formatBlock" onchange="applyFormat('formatBlock', this.value)"
                                        class="text-sm border border-gray-300 rounded px-2 py-1">
                                    <option value="">제목 스타일</option>
                                    <option value="h1">제목 1</option>
                                    <option value="h2">제목 2</option>
                                    <option value="h3">제목 3</option>
                                    <option value="h4">제목 4</option>
                                    <option value="p">본문</option>
                                </select>

                                <div class="border-l border-gray-300 h-6 mx-1"></div>

                                <!-- 색상 -->
                                <label class="flex items-center gap-1 cursor-pointer">
                                    <span class="text-xs">글자색</span>
                                    <input type="color" id="textColor" onchange="applyFormat('foreColor', this.value)"
                                           class="w-8 h-8 border border-gray-300 rounded cursor-pointer">
                                </label>
                                <label class="flex items-center gap-1 cursor-pointer">
                                    <span class="text-xs">배경색</span>
                                    <input type="color" id="bgColor" onchange="applyFormat('backColor', this.value)"
                                           class="w-8 h-8 border border-gray-300 rounded cursor-pointer">
                                </label>
                            </div>

                            <!-- 에디터 본문 -->
                            <div id="guide-content-editor"
                                 contenteditable="true"
                                 class="border border-t-0 border-gray-300 rounded-b-md px-4 py-3 min-h-[500px] bg-white focus:outline-none focus:ring-2 focus:ring-[#009DE8]"
                                 style="max-height: 600px; overflow-y: auto;">${guide?.content || ''}</div>

                            <p class="mt-2 text-xs text-gray-500">
                                * 기본 에디터 기능을 제공합니다. (향후 네이버 스마트에디터로 교체 예정)
                            </p>
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end space-x-3 pt-4 border-t">
                            <button type="button" onclick="switchView('${viewMap[type]}')"
                                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                취소
                            </button>
                            <button type="button" onclick="saveGuideContent('${type}')"
                                    class="px-4 py-2 bg-[#009DE8] text-white rounded-md text-sm font-medium hover:bg-opacity-90">
                                저장
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // ========== 심사 일정 관리 ==========
    examSchedule: () => {
        // Mock 데이터 로드 확인
        if (typeof mockCommitteeAssignments === 'undefined' || typeof mockExamSchedules === 'undefined') {
            return `
                <div class="bg-white rounded-lg shadow-md p-8">
                    <div class="text-center text-red-500">
                        <p class="text-lg">Mock 데이터가 로드되지 않았습니다.</p>
                        <p class="text-sm mt-2">admin/assets/js/exam-schedule-data.js 파일을 확인하세요.</p>
                    </div>
                </div>
            `;
        }

        // JavaScript 파일 동적 로드
        const existingScript = document.querySelector('script[src="assets/js/exam-schedule.js"]');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'assets/js/exam-schedule.js';
            script.onload = () => {
                if (typeof renderExamScheduleList === 'function') {
                    renderExamScheduleList();
                }
            };
            document.body.appendChild(script);
        } else {
            setTimeout(() => {
                if (typeof renderExamScheduleList === 'function') {
                    renderExamScheduleList();
                }
            }, 0);
        }

        return `
            <!-- List View -->
            <div id="exam-schedule-list-view">
                <div class="bg-white rounded-lg shadow-md">
                    <div class="p-6 border-b">
                        <h3 class="text-lg font-bold text-gray-800">심사 일정 관리</h3>
                        <p class="text-sm text-gray-600 mt-1">심사위원 배정이 완료된 심사 일정을 등록하고 관리합니다.</p>
                    </div>

                    <!-- 검색 메뉴 (표준화) -->
                    <div class="p-6 border-b bg-gray-50">
                        <div class="search-container">
                            <div class="search-grid">
                                <!-- 1. 학년도 -->
                                <div class="search-field">
                                    <label class="search-label">학년도</label>
                                    <select id="filter-year" class="search-input" onchange="filterExamSchedule()">
                                        <option value="">전체</option>
                                        <option value="2025" selected>2025</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>

                                <!-- 2. 학기 -->
                                <div class="search-field">
                                    <label class="search-label">학기</label>
                                    <select id="filter-semester" class="search-input" onchange="filterExamSchedule()">
                                        <option value="">전체</option>
                                        <option value="1" selected>1학기</option>
                                        <option value="2">2학기</option>
                                    </select>
                                </div>

                                <!-- 3. 학과 -->
                                <div class="search-field">
                                    <label class="search-label">학과</label>
                                    <select id="filter-department" class="search-input" onchange="filterExamSchedule()">
                                        <option value="">전체</option>
                                        <option value="경영학과">경영학과</option>
                                        <option value="컴퓨터공학과">컴퓨터공학과</option>
                                        <option value="교육학과">교육학과</option>
                                    </select>
                                </div>

                                <!-- 3. 심사 단계 -->
                                <div class="search-field">
                                    <label class="search-label">심사 단계</label>
                                    <select id="filter-stage" class="search-input" onchange="filterExamSchedule()">
                                        <option value="">전체</option>
                                        <!-- 동적 로드 -->
                                    </select>
                                </div>

                                <!-- 4. 일정 상태 -->
                                <div class="search-field">
                                    <label class="search-label">일정 상태</label>
                                    <select id="filter-schedule-status" class="search-input" onchange="filterExamSchedule()">
                                        <option value="">전체</option>
                                        <option value="scheduled">등록 완료</option>
                                        <option value="unscheduled">미등록</option>
                                    </select>
                                </div>

                                <!-- 5. 검색어 -->
                                <div class="search-field search-field-wide">
                                    <label class="search-label">검색어</label>
                                    <div class="flex gap-2">
                                        <select id="filter-search-type" class="search-input" style="flex: 0 0 120px;">
                                            <option value="studentName">학생명</option>
                                            <option value="studentNumber">학번</option>
                                        </select>
                                        <input type="text"
                                               id="filter-search-keyword"
                                               class="search-input"
                                               placeholder="검색어를 입력하세요"
                                               onkeypress="if(event.key==='Enter') filterExamSchedule()">
                                    </div>
                                </div>

                                <!-- 6. 검색 버튼 -->
                                <div class="search-field">
                                    <label class="search-label">&nbsp;</label>
                                    <button onclick="filterExamSchedule()" class="btn btn-primary w-full">
                                        <i class="fas fa-search mr-1"></i> 검색
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 테이블 -->
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학생명</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학과</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학위</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">심사 단계</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">심사위원장</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">심사 일정</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">진행 방식</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                </tr>
                            </thead>
                            <tbody id="exam-schedule-table-body" class="bg-white divide-y divide-gray-200">
                                <!-- JavaScript로 동적 렌더링 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Detail View (hidden initially) -->
            <div id="exam-schedule-detail-view" style="display: none;">
                <!-- JavaScript로 동적 렌더링 -->
            </div>
        `;
    },
};

// ========================================
// 공통 렌더링 함수 (관리자/교수/학생 공유)
// ========================================

/**
 * 안내문 렌더링 공통 함수
 * @param {string} type - 'ethics', 'schedule', 'procedure'
 * @param {boolean} isAdmin - 관리자 권한 여부
 * @returns {string} HTML
 */
function renderGuideContent(type, isAdmin = false) {
    const guide = mockGuides.find(g => g.type === type && g.isPublished);

    const titleMap = {
        'ethics': '연구윤리',
        'schedule': '논문일정',
        'procedure': '논문지도절차'
    };

    return `
        <div class="bg-white rounded-lg shadow-md">
            <!-- Header -->
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">${titleMap[type]}</h2>
                        <p class="text-sm text-gray-500 mt-1">최종 수정: ${guide?.lastUpdatedAt || '-'} (${guide?.lastUpdatedByName || '-'})</p>
                    </div>
                    ${isAdmin ? `
                        <button onclick="switchView('guideEdit', '${type}')" class="px-4 py-2 bg-[#009DE8] text-white rounded-md hover:bg-opacity-90">
                            편집
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- Content -->
            <div class="p-8">
                ${guide?.content || '<p class="text-gray-500 text-center py-8">콘텐츠가 등록되지 않았습니다.</p>'}
            </div>
        </div>
    `;
}

// 전역으로 노출 (교수/학생 화면에서도 사용)
if (typeof window !== 'undefined') {
    window.renderGuideContent = renderGuideContent;
}

// ========================================
// 논문 지도 단계 유형 관리 (신규)
// ========================================

/**
 * 단계 유형 목록 화면
 */
views.stageTypeManagement = () => {
    const data = mockStepTypes;
    return `
        <div class="bg-white rounded-lg shadow-md">
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">지도 단계 유형 목록</h3>
                        <span class="table-count">(총 ${data.length}건)</span>
                    </div>
                    <div class="table-header-right">
                        <button onclick="switchView('stageTypeCreate')"
                                class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            등록
                        </button>
                    </div>
                </div>
                <div class="table-scroll">
                <table class="min-w-full table-fixed">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600" style="width: 80px;">순번</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도 단계 유형명</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 110px;">일정 관리<br>구분</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">문서 제출</th>
                            <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 100px;">발표</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600" style="width: 140px;">심사유형</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">설명</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${data.map((item, idx) => {
                            const examType = mockExamTypes.find(et => et.id === item.examTypeId);
                            const examTypeName = examType ? examType.name : '-';

                            // 일정 관리 구분 텍스트 생성 (배지 제거)
                            let processPhaseText = '';
                            switch(item.processPhase) {
                                case 'application':
                                    processPhaseText = '신청';
                                    break;
                                case 'submission':
                                    processPhaseText = '제출';
                                    break;
                                case 'review':
                                    processPhaseText = '심사';
                                    break;
                                case 'none':
                                    processPhaseText = '해당없음';
                                    break;
                                default:
                                    processPhaseText = '-';
                            }

                            return `
                            <tr class="hover:bg-blue-50 cursor-pointer" onclick="switchView('stageTypeEdit', '${item.id}')">
                                <td class="py-3 px-4 text-sm text-gray-600 text-center">${idx + 1}</td>
                                <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                <td class="py-3 px-4 text-center text-sm text-gray-700">
                                    ${processPhaseText}
                                </td>
                                <td class="py-3 px-4 text-center text-sm text-gray-700">
                                    ${item.requiresDocument ? '필요' : '불필요'}
                                </td>
                                <td class="py-3 px-4 text-center text-sm text-gray-700">
                                    ${item.requiresPresentation ? '필요' : '불필요'}
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-600">${examTypeName}</td>
                                <td class="py-3 px-4 text-sm text-gray-600">${item.description || '-'}</td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    `;
};

/**
 * 단계 유형 등록/수정 화면
 */
views.stageTypeCreate = (id = null) => {
    const isEdit = id !== null;
    const item = isEdit ? mockStepTypes.find(t => t.id === id) : {
        name: '',
        requiresDocument: false,
        requiresPresentation: false,
        description: ''
    };

    const pageTitle = isEdit ? '지도 단계 유형 수정' : '지도 단계 유형 등록';

    return `
        <!-- 페이지 컨테이너 -->
        <div class="bg-white rounded-lg shadow-md">
            <!-- 페이지 헤더 -->
            <div class="p-6 border-b">
                <!-- [목록으로 돌아가기] 버튼 -->
                <button onclick="switchView('stageTypeManagement')"
                        class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    목록으로 돌아가기
                </button>
                <h3 class="text-xl font-bold text-gray-900">${pageTitle}</h3>
            </div>

            <!-- 페이지 바디 -->
            <div class="p-6">
                <form id="stage-type-form" onsubmit="saveStageType(event, ${isEdit ? `'${id}'` : 'null'})" class="space-y-6">
                <!-- 유형명 + 설명 -->
                <div class="flex items-center gap-8">
                    <!-- 좌측: 유형명 -->
                    <div class="flex items-center gap-4 flex-[0.4]">
                        <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                            유형명 <span class="text-red-600">*</span>
                        </label>
                        <input type="text"
                               id="stage-type-name"
                               value="${item.name}"
                               placeholder="예: 연구계획서 제출"
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               required>
                    </div>

                    <!-- 우측: 설명 -->
                    <div class="flex items-center gap-4 flex-[0.6]">
                        <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                            설명
                        </label>
                        <input type="text"
                               id="stage-type-description"
                               value="${item.description || ''}"
                               placeholder="단계 유형 설명"
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <!-- 구분선 -->
                <div class="border-t-2 border-gray-300 my-6"></div>

                <!-- ========== 영역 1: 제출 요건 ========== -->
                <div class="border-2 border-gray-300 rounded-lg p-4">
                    <h4 class="text-base font-bold text-gray-900 mb-3">제출 요건</h4>
                    <p class="text-xs text-gray-600 mb-3">학생의 활동 요건과 평가 방식을 설정하세요</p>
                    <div class="space-y-4">
                        <div style="display: flex; align-items: center; gap: 24px;">
                            <label class="flex items-center cursor-pointer">
                                <input type="checkbox"
                                       id="requires-document"
                                       ${item.requiresDocument ? 'checked' : ''}
                                       class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                <span class="ml-2 text-sm font-medium text-gray-900">문서 제출 필요</span>
                            </label>

                            <div style="width: 1px; height: 24px; background-color: #D1D5DB;"></div>

                            <label class="flex items-center cursor-pointer">
                                <input type="checkbox"
                                       id="requires-presentation"
                                       ${item.requiresPresentation ? 'checked' : ''}
                                       class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                <span class="ml-2 text-sm font-medium text-gray-900">발표 필요</span>
                            </label>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">심사 유형</label>
                            <select id="exam-type-id"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                ${mockExamTypes.sort((a, b) => {
                                    const order = { 'EXAM_TYPE_NONE': 0, 'EXAM_TYPE_001': 1, 'EXAM_TYPE_002': 2, 'EXAM_TYPE_003': 3 };
                                    return (order[a.id] || 99) - (order[b.id] || 99);
                                }).map(type => `
                                    <option value="${type.id}" ${item.examTypeId === type.id ? 'selected' : ''}>
                                        ${type.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                </div>
                    </form>
                </div>

            <!-- 페이지 푸터 (버튼) -->
            <div class="flex justify-between items-center p-6 border-t bg-gray-50">
                <div>
                    ${isEdit ? `
                        <button type="button"
                                onclick="deleteStageType('${id}')"
                                class="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm">
                            삭제
                        </button>
                    ` : ''}
                </div>
                <div class="flex gap-3">
                    <button type="button"
                            onclick="switchView('stageTypeManagement')"
                            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold text-sm">
                        취소
                    </button>
                    <button type="submit"
                            form="stage-type-form"
                            class="px-6 py-2.5 bg-[#6A0028] text-white rounded-md hover:bg-[#8A0034] font-semibold text-sm">
                        ${isEdit ? '수정' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    `;
};

// 별칭 추가
views.stageTypeEdit = (id) => views.stageTypeCreate(id);

// ==================== 논문 안내 화면들 (정적 콘텐츠) ====================

// ========== 공지사항 ==========
views.notice = () => `
    <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">공지사항</h3>
        </div>
        <div class="p-8">
            <div class="prose prose-sm max-w-none">
                <div style="line-height: 1.8; font-size: 14px; color: #333;">
                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">2025학년도 1학기 논문 지도 일정 안내</h3>
                    <p style="margin-bottom: 15px;">2025학년도 1학기 논문 지도 일정을 다음과 같이 안내드립니다.</p>
                    <ul style="margin-left: 20px; margin-bottom: 20px;">
                        <li style="margin-bottom: 8px;">연구계획서 제출: 2025년 3월 1일 ~ 3월 15일</li>
                        <li style="margin-bottom: 8px;">중간논문 제출: 2025년 5월 1일 ~ 5월 31일</li>
                        <li style="margin-bottom: 8px;">최종논문 제출: 2025년 6월 1일 ~ 6월 30일</li>
                        <li style="margin-bottom: 8px;">학술지 심사 신청: 상시 접수</li>
                    </ul>
                    <p style="margin-bottom: 30px; color: #d32f2f;">※ 각 단계별 제출 기한을 반드시 준수하시기 바랍니다.</p>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">논문 심사위원 배정 안내</h3>
                    <p style="margin-bottom: 15px;">논문 심사위원 배정 절차가 변경되었습니다.</p>
                    <ul style="margin-left: 20px; margin-bottom: 30px;">
                        <li style="margin-bottom: 8px;">심사위원 배정은 관리자가 일괄 배정합니다</li>
                        <li style="margin-bottom: 8px;">배정 후 학생에게 자동으로 통보됩니다</li>
                        <li style="margin-bottom: 8px;">심사위원 변경 요청은 학과 사무실로 문의하시기 바랍니다</li>
                    </ul>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">논문 제출 시 유의사항</h3>
                    <p style="margin-bottom: 15px;">논문 제출 시 다음 사항을 반드시 확인하시기 바랍니다.</p>
                    <ul style="margin-left: 20px;">
                        <li style="margin-bottom: 8px;">논문 파일은 PDF 형식으로 제출</li>
                        <li style="margin-bottom: 8px;">파일명: 학번_성명_논문종류.pdf (예: 2024001_홍길동_연구계획서.pdf)</li>
                        <li style="margin-bottom: 8px;">논문 표지에 학교 로고 및 학과명 필수 기재</li>
                        <li style="margin-bottom: 8px;">표절 검사 결과 제출 필수 (최종논문만 해당)</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
`;

// ========== 연구윤리 (DEPRECATED - ethicsList로 통합) ==========
/*
views.ethics = () => `
    <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">연구윤리 지침</h3>
        </div>
        <div class="p-8">
            <div class="prose prose-sm max-w-none">
                <div style="line-height: 1.8; font-size: 14px; color: #333;">
                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">1. 표절 금지</h3>
                    <p style="margin-bottom: 15px;">타인의 연구 결과나 아이디어를 적절한 인용 없이 사용하는 행위를 금지합니다.</p>
                    <ul style="margin-left: 20px; margin-bottom: 30px;">
                        <li style="margin-bottom: 8px;">타인의 저작물을 인용할 때는 반드시 출처를 명시해야 합니다</li>
                        <li style="margin-bottom: 8px;">인용 표기는 본교의 논문 작성 지침을 따라야 합니다</li>
                        <li style="margin-bottom: 8px;">자기표절(이전에 제출했던 자신의 논문 재사용)도 금지됩니다</li>
                        <li style="margin-bottom: 8px;">최종논문 제출 시 표절 검사 결과를 함께 제출해야 합니다</li>
                    </ul>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">2. 연구 데이터 조작 금지</h3>
                    <p style="margin-bottom: 15px;">연구 데이터를 조작, 변조, 위조하는 행위를 엄격히 금지합니다.</p>
                    <ul style="margin-left: 20px; margin-bottom: 30px;">
                        <li style="margin-bottom: 8px;">실험 데이터는 사실대로 기록하고 보관해야 합니다</li>
                        <li style="margin-bottom: 8px;">연구 결과를 왜곡하거나 임의로 변경할 수 없습니다</li>
                        <li style="margin-bottom: 8px;">통계 분석은 적절한 방법을 사용해야 합니다</li>
                    </ul>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">3. 중복 게재 금지</h3>
                    <p style="margin-bottom: 15px;">동일한 연구 결과를 여러 곳에 중복으로 게재하는 행위를 금지합니다.</p>
                    <ul style="margin-left: 20px; margin-bottom: 30px;">
                        <li style="margin-bottom: 8px;">이미 발표된 논문을 다른 학술지에 투고할 수 없습니다</li>
                        <li style="margin-bottom: 8px;">학위논문과 학술지 논문은 별도로 간주됩니다</li>
                    </ul>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">4. 저자 표시 원칙</h3>
                    <p style="margin-bottom: 15px;">연구에 실질적으로 기여한 사람만 저자로 표시해야 합니다.</p>
                    <ul style="margin-left: 20px; margin-bottom: 30px;">
                        <li style="margin-bottom: 8px;">명예 저자, 유령 저자 표기를 금지합니다</li>
                        <li style="margin-bottom: 8px;">지도교수의 기여도에 따라 공동 저자로 표기할 수 있습니다</li>
                        <li style="margin-bottom: 8px;">저자 순서는 기여도에 따라 결정합니다</li>
                    </ul>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">5. 연구윤리 위반 시 조치</h3>
                    <p style="margin-bottom: 15px;">연구윤리 위반이 확인될 경우 다음과 같은 조치가 취해집니다.</p>
                    <ul style="margin-left: 20px; color: #d32f2f;">
                        <li style="margin-bottom: 8px;">논문 제출 불가 및 학위 취소</li>
                        <li style="margin-bottom: 8px;">학칙에 따른 징계 처분</li>
                        <li style="margin-bottom: 8px;">연구비 지원 중단</li>
                        <li style="margin-bottom: 8px;">학교 홈페이지에 위반 사실 공지</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
`;
*/

// ========== 논문일정 (DEPRECATED - scheduleList로 통합) ==========
/*
views.schedule = () => `
    <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">논문 제출 일정</h3>
        </div>
        <div class="p-8">
            <div class="prose prose-sm max-w-none">
                <div style="line-height: 1.8; font-size: 14px; color: #333;">
                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">1학기 일정 (2025년 봄학기)</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb;">
                        <thead style="background-color: #f9fafb;">
                            <tr>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">구분</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">제출 기간</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">심사 기간</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 12px;">연구계획서</td>
                                <td style="padding: 12px; color: #666;">2025.03.01 ~ 03.15</td>
                                <td style="padding: 12px; color: #666;">2025.03.16 ~ 03.31</td>
                                <td style="padding: 12px; color: #666;">심사위원 배정 후 2주</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 12px;">중간논문</td>
                                <td style="padding: 12px; color: #666;">2025.05.01 ~ 05.31</td>
                                <td style="padding: 12px; color: #666;">2025.06.01 ~ 06.15</td>
                                <td style="padding: 12px; color: #666;">연구계획서 승인 후</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">최종논문</td>
                                <td style="padding: 12px; color: #666;">2025.06.01 ~ 06.30</td>
                                <td style="padding: 12px; color: #666;">2025.07.01 ~ 07.31</td>
                                <td style="padding: 12px; color: #666;">중간논문 승인 후</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">2학기 일정 (2025년 가을학기)</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb;">
                        <thead style="background-color: #f9fafb;">
                            <tr>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">구분</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">제출 기간</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">심사 기간</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 12px;">연구계획서</td>
                                <td style="padding: 12px; color: #666;">2025.09.01 ~ 09.15</td>
                                <td style="padding: 12px; color: #666;">2025.09.16 ~ 09.30</td>
                                <td style="padding: 12px; color: #666;">심사위원 배정 후 2주</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 12px;">중간논문</td>
                                <td style="padding: 12px; color: #666;">2025.11.01 ~ 11.30</td>
                                <td style="padding: 12px; color: #666;">2025.12.01 ~ 12.15</td>
                                <td style="padding: 12px; color: #666;">연구계획서 승인 후</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px;">최종논문</td>
                                <td style="padding: 12px; color: #666;">2025.12.01 ~ 12.31</td>
                                <td style="padding: 12px; color: #666;">2026.01.01 ~ 01.31</td>
                                <td style="padding: 12px; color: #666;">중간논문 승인 후</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">제출 시 유의사항</h3>
                    <ul style="margin-left: 20px;">
                        <li style="margin-bottom: 8px;">제출 기한은 마감일 23:59까지입니다</li>
                        <li style="margin-bottom: 8px;">시스템 오류를 대비하여 마감일 전에 미리 제출하시기 바랍니다</li>
                        <li style="margin-bottom: 8px;">기한 내 미제출 시 다음 학기로 연기됩니다</li>
                        <li style="margin-bottom: 8px;">심사 일정은 심사위원 배정 상황에 따라 변경될 수 있습니다</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
`;
*/

// ========== 논문 지도 절차 (DEPRECATED - procedureList로 통합) ==========
/*
views.procedure = () => `
    <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">논문 지도 절차</h3>
        </div>
        <div class="p-8">
            <div class="prose prose-sm max-w-none">
                <div style="line-height: 1.8; font-size: 14px; color: #333;">
                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">STEP 1. 연구계획서 제출 및 심사</h3>
                    <p style="margin-bottom: 15px; font-weight: 600;">목적: 연구 주제 및 방법론 확정</p>
                    <ol style="margin-left: 20px; margin-bottom: 15px;">
                        <li style="margin-bottom: 8px;">지도교수와 연구 주제 상의</li>
                        <li style="margin-bottom: 8px;">연구계획서 작성 (연구 배경, 목적, 방법론 등)</li>
                        <li style="margin-bottom: 8px;">시스템을 통한 연구계획서 제출</li>
                        <li style="margin-bottom: 8px;">심사위원 배정 (관리자)</li>
                        <li style="margin-bottom: 8px;">심사위원 검토 및 피드백</li>
                        <li style="margin-bottom: 8px;">수정 및 재제출 (필요시)</li>
                        <li style="margin-bottom: 8px;">최종 승인</li>
                    </ol>
                    <p style="margin-bottom: 30px; color: #1976d2;">※ 승인 후 연구 진행 가능</p>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">STEP 2. 중간논문 제출 및 심사</h3>
                    <p style="margin-bottom: 15px; font-weight: 600;">목적: 연구 진행 상황 점검 및 방향 조정</p>
                    <ol style="margin-left: 20px; margin-bottom: 15px;">
                        <li style="margin-bottom: 8px;">연구 수행 및 데이터 수집</li>
                        <li style="margin-bottom: 8px;">중간 결과 작성</li>
                        <li style="margin-bottom: 8px;">중간논문 제출</li>
                        <li style="margin-bottom: 8px;">심사위원 검토 및 피드백</li>
                        <li style="margin-bottom: 8px;">연구 방향 조정 (필요시)</li>
                        <li style="margin-bottom: 8px;">수정 및 재제출 (필요시)</li>
                        <li style="margin-bottom: 8px;">최종 승인</li>
                    </ol>
                    <p style="margin-bottom: 30px; color: #1976d2;">※ 석사과정은 중간논문 생략 가능 (학과 규정에 따름)</p>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">STEP 3. 최종논문 제출 및 심사</h3>
                    <p style="margin-bottom: 15px; font-weight: 600;">목적: 연구 결과 종합 및 학위 취득</p>
                    <ol style="margin-left: 20px; margin-bottom: 15px;">
                        <li style="margin-bottom: 8px;">연구 완료 및 논문 작성</li>
                        <li style="margin-bottom: 8px;">표절 검사 실시 (필수)</li>
                        <li style="margin-bottom: 8px;">최종논문 제출</li>
                        <li style="margin-bottom: 8px;">심사위원 정밀 검토</li>
                        <li style="margin-bottom: 8px;">논문 발표 (구두 심사)</li>
                        <li style="margin-bottom: 8px;">질의응답 및 최종 피드백</li>
                        <li style="margin-bottom: 8px;">수정 및 최종 제출</li>
                        <li style="margin-bottom: 8px;">심사 완료 및 학위 취득</li>
                    </ol>
                    <p style="margin-bottom: 30px; color: #d32f2f;">※ 표절 검사 결과 15% 이상 시 재작성 필요</p>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">STEP 4. 학술지 심사 (박사과정 필수)</h3>
                    <p style="margin-bottom: 15px; font-weight: 600;">목적: 연구 성과 대외 발표</p>
                    <ol style="margin-left: 20px; margin-bottom: 15px;">
                        <li style="margin-bottom: 8px;">학술지 논문 작성 (학위논문 기반)</li>
                        <li style="margin-bottom: 8px;">학술지 선정 및 투고</li>
                        <li style="margin-bottom: 8px;">시스템에 학술지 심사 신청</li>
                        <li style="margin-bottom: 8px;">게재 승인 확인서 제출</li>
                        <li style="margin-bottom: 8px;">심사 완료</li>
                    </ol>
                    <p style="margin-bottom: 8px; color: #1976d2;">※ 박사과정: 학술지 게재 필수 (학과별 상이)</p>
                    <p style="margin-bottom: 30px; color: #1976d2;">※ 석사과정: 학술지 게재 권장</p>

                    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">전체 소요 기간 (평균)</h3>
                    <ul style="margin-left: 20px; margin-bottom: 15px;">
                        <li style="margin-bottom: 8px;">석사과정: 2~3학기 (1년 ~ 1.5년)</li>
                        <li style="margin-bottom: 8px;">박사과정: 5~6학기 (2.5년 ~ 3년)</li>
                        <li style="margin-bottom: 8px;">석박통합: 7~8학기 (3.5년 ~ 4년)</li>
                    </ul>
                    <p style="color: #666;">※ 개인 연구 진행 상황에 따라 차이가 있을 수 있습니다</p>
                </div>
            </div>
        </div>
    </div>
`;
*/

// ========== Alias for routing (DEPRECATED) ==========
// 'process' 라우팅을 위한 alias
// views.process = views.procedure;

// ========== 콘텐츠 관리 화면 (DEPRECATED - ContentManagement.showEditForm으로 통합) ==========

// 연구윤리 관리
/*
views.ethicsContentMgmt = () => {
    console.log('✅ views.ethicsContentMgmt 호출됨');
    return `
    <div class="bg-white rounded-lg shadow-md p-6">
        <!-- 에디터 툴바 -->
        <div id="ethics-toolbar" class="mb-3 p-3 bg-gray-50 border border-gray-300 rounded-t-lg flex flex-wrap gap-1">
            <button type="button" onclick="formatEthicsText('bold')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="굵게">
                <i class="fas fa-bold"></i>
            </button>
            <button type="button" onclick="formatEthicsText('italic')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="기울임">
                <i class="fas fa-italic"></i>
            </button>
            <button type="button" onclick="formatEthicsText('underline')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="밑줄">
                <i class="fas fa-underline"></i>
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatEthicsText('h1')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 1">H1</button>
            <button type="button" onclick="formatEthicsText('h2')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 2">H2</button>
            <button type="button" onclick="formatEthicsText('h3')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 3">H3</button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatEthicsText('ul')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="글머리 기호">
                <i class="fas fa-list-ul"></i>
            </button>
            <button type="button" onclick="formatEthicsText('ol')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="번호 매기기">
                <i class="fas fa-list-ol"></i>
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatEthicsText('link')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="링크">
                <i class="fas fa-link"></i>
            </button>
        </div>

        <!-- 에디터 영역 -->
        <div class="mb-4">
            <div id="ethics-editor" contenteditable="true"
                 class="w-full min-h-[500px] p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028] overflow-y-auto"
                 style="line-height: 1.8; font-size: 14px;">
            </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="flex justify-between items-center pt-4 border-t">
            <div class="text-sm text-gray-600">
                <span id="ethics-last-modified"></span>
            </div>
            <div class="flex gap-2">
                <button onclick="resetEthicsContent()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    <i class="fas fa-undo mr-2"></i>초기화
                </button>
                <button onclick="saveEthicsContent()" class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020] transition-colors">
                    <i class="fas fa-save mr-2"></i>저장
                </button>
            </div>
        </div>
    </div>
`;
};
*/

// 논문일정 관리
/*
views.scheduleContentMgmt = () => {
    console.log('✅ views.scheduleContentMgmt 호출됨');
    return `
    <div class="bg-white rounded-lg shadow-md p-6">
        <!-- 에디터 툴바 -->
        <div id="schedule-toolbar" class="mb-3 p-3 bg-gray-50 border border-gray-300 rounded-t-lg flex flex-wrap gap-1">
            <button type="button" onclick="formatScheduleText('bold')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="굵게">
                <i class="fas fa-bold"></i>
            </button>
            <button type="button" onclick="formatScheduleText('italic')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="기울임">
                <i class="fas fa-italic"></i>
            </button>
            <button type="button" onclick="formatScheduleText('underline')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="밑줄">
                <i class="fas fa-underline"></i>
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatScheduleText('h1')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 1">H1</button>
            <button type="button" onclick="formatScheduleText('h2')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 2">H2</button>
            <button type="button" onclick="formatScheduleText('h3')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 3">H3</button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatScheduleText('ul')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="글머리 기호">
                <i class="fas fa-list-ul"></i>
            </button>
            <button type="button" onclick="formatScheduleText('ol')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="번호 매기기">
                <i class="fas fa-list-ol"></i>
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatScheduleText('link')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="링크">
                <i class="fas fa-link"></i>
            </button>
            <button type="button" onclick="formatScheduleText('table')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="표">
                <i class="fas fa-table"></i>
            </button>
        </div>

        <!-- 에디터 영역 -->
        <div class="mb-4">
            <div id="schedule-editor" contenteditable="true"
                 class="w-full min-h-[500px] p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028] overflow-y-auto"
                 style="line-height: 1.8; font-size: 14px;">
            </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="flex justify-between items-center pt-4 border-t">
            <div class="text-sm text-gray-600">
                <span id="schedule-last-modified"></span>
            </div>
            <div class="flex gap-2">
                <button onclick="resetScheduleContent()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    <i class="fas fa-undo mr-2"></i>초기화
                </button>
                <button onclick="saveScheduleContent()" class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020] transition-colors">
                    <i class="fas fa-save mr-2"></i>저장
                </button>
            </div>
        </div>
    </div>
`;
};
*/

// 논문지도절차 관리
/*
views.procedureContentMgmt = () => {
    console.log('✅ views.procedureContentMgmt 호출됨');
    return `
    <div class="bg-white rounded-lg shadow-md p-6">
        <!-- 에디터 툴바 -->
        <div id="procedure-toolbar" class="mb-3 p-3 bg-gray-50 border border-gray-300 rounded-t-lg flex flex-wrap gap-1">
            <button type="button" onclick="formatProcedureText('bold')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="굵게">
                <i class="fas fa-bold"></i>
            </button>
            <button type="button" onclick="formatProcedureText('italic')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="기울임">
                <i class="fas fa-italic"></i>
            </button>
            <button type="button" onclick="formatProcedureText('underline')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="밑줄">
                <i class="fas fa-underline"></i>
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatProcedureText('h1')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 1">H1</button>
            <button type="button" onclick="formatProcedureText('h2')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 2">H2</button>
            <button type="button" onclick="formatProcedureText('h3')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="제목 3">H3</button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatProcedureText('ul')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="글머리 기호">
                <i class="fas fa-list-ul"></i>
            </button>
            <button type="button" onclick="formatProcedureText('ol')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="번호 매기기">
                <i class="fas fa-list-ol"></i>
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button type="button" onclick="formatProcedureText('link')" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" title="링크">
                <i class="fas fa-link"></i>
            </button>
        </div>

        <!-- 에디터 영역 -->
        <div class="mb-4">
            <div id="procedure-editor" contenteditable="true"
                 class="w-full min-h-[500px] p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#6A0028] overflow-y-auto"
                 style="line-height: 1.8; font-size: 14px;">
            </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="flex justify-between items-center pt-4 border-t">
            <div class="text-sm text-gray-600">
                <span id="procedure-last-modified"></span>
            </div>
            <div class="flex gap-2">
                <button onclick="resetProcedureContent()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    <i class="fas fa-undo mr-2"></i>초기화
                </button>
                <button onclick="saveProcedureContent()" class="px-4 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#550020] transition-colors">
                    <i class="fas fa-save mr-2"></i>저장
                </button>
            </div>
        </div>
    </div>
`;
};
*/

// ========== 콘텐츠 목록 관리 (학과별) ==========

// 연구윤리 목록
views.ethicsList = () => {
    // ContentListManagement.init() 호출은 index.html의 renderAdminView() 후처리에서 처리됨
    return `
    <!-- 검색 영역 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-4">
        <div class="flex items-center gap-3">
            <!-- 학과/전공 -->
            <div class="flex items-center gap-2 flex-1">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                <select id="filter-content-department"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="all">전체</option>
                    ${DepartmentUtils.getAllDepartments().map(dept =>
                        `<option value="${dept}">${dept}</option>`
                    ).join('')}
                </select>
            </div>
            <!-- 제목 -->
            <div class="flex items-center gap-2 flex-1">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">제목</label>
                <input type="text" id="filter-content-title" placeholder="제목"
                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                       onkeypress="if(event.key === 'Enter') ContentListManagement.filterContentList()">
            </div>
            <!-- 조회 버튼 -->
            <button onclick="ContentListManagement.filterContentList()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                <i class="fas fa-search mr-1"></i>조회
            </button>
        </div>
    </div>

    <div class="table-container">
        <div class="table-header">
            <div class="table-header-left">
                <h3 class="table-title">연구윤리 목록</h3>
                <span class="table-count" id="content-count-display">(총 0건)</span>
            </div>
            <div class="table-header-right">
                <button onclick="ContentListManagement.showCreateForm()" class="btn-primary">
                    <i class="fas fa-plus mr-1"></i>신규 등록
                </button>
            </div>
        </div>
        <div class="table-scroll">
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th style="width: 60px;">순번</th>
                        <th>제목</th>
                        <th style="width: 150px;">대상학과</th>
                        <th style="width: 150px;">최근 수정일</th>
                        <th style="width: 120px;">작성자</th>
                    </tr>
                </thead>
                <tbody id="content-table-body">
                    <!-- 동적으로 생성됨 -->
                </tbody>
            </table>
        </div>
    </div>
    `;
};

// 논문일정 목록
views.scheduleList = () => {
    // ContentListManagement.init() 호출은 index.html의 renderAdminView() 후처리에서 처리됨
    return `
    <!-- 검색 영역 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-4">
        <div class="flex items-center gap-3">
            <!-- 학과/전공 -->
            <div class="flex items-center gap-2 flex-1">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                <select id="filter-content-department"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="all">전체</option>
                    ${DepartmentUtils.getAllDepartments().map(dept =>
                        `<option value="${dept}">${dept}</option>`
                    ).join('')}
                </select>
            </div>
            <!-- 제목 -->
            <div class="flex items-center gap-2 flex-1">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">제목</label>
                <input type="text" id="filter-content-title" placeholder="제목"
                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                       onkeypress="if(event.key === 'Enter') ContentListManagement.filterContentList()">
            </div>
            <!-- 조회 버튼 -->
            <button onclick="ContentListManagement.filterContentList()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                <i class="fas fa-search mr-1"></i>조회
            </button>
        </div>
    </div>

    <div class="table-container">
        <div class="table-header">
            <div class="table-header-left">
                <h3 class="table-title">논문일정 목록</h3>
                <span class="table-count" id="content-count-display">(총 0건)</span>
            </div>
            <div class="table-header-right">
                <button onclick="ContentListManagement.showCreateForm()" class="btn-primary">
                    <i class="fas fa-plus mr-1"></i>신규 등록
                </button>
            </div>
        </div>
        <div class="table-scroll">
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th style="width: 60px;">순번</th>
                        <th>제목</th>
                        <th style="width: 150px;">대상학과</th>
                        <th style="width: 150px;">최근 수정일</th>
                        <th style="width: 120px;">작성자</th>
                    </tr>
                </thead>
                <tbody id="content-table-body">
                    <!-- 동적으로 생성됨 -->
                </tbody>
            </table>
        </div>
    </div>
    `;
};

// 논문지도절차 목록
views.procedureList = () => {
    // ContentListManagement.init() 호출은 index.html의 renderAdminView() 후처리에서 처리됨
    return `
    <!-- 검색 영역 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-4">
        <div class="flex items-center gap-3">
            <!-- 학과/전공 -->
            <div class="flex items-center gap-2 flex-1">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                <select id="filter-content-department"
                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                        style="height: 34px;">
                    <option value="all">전체</option>
                    ${DepartmentUtils.getAllDepartments().map(dept =>
                        `<option value="${dept}">${dept}</option>`
                    ).join('')}
                </select>
            </div>
            <!-- 제목 -->
            <div class="flex items-center gap-2 flex-1">
                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">제목</label>
                <input type="text" id="filter-content-title" placeholder="제목"
                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                       onkeypress="if(event.key === 'Enter') ContentListManagement.filterContentList()">
            </div>
            <!-- 조회 버튼 -->
            <button onclick="ContentListManagement.filterContentList()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                <i class="fas fa-search mr-1"></i>조회
            </button>
        </div>
    </div>

    <div class="table-container">
        <div class="table-header">
            <div class="table-header-left">
                <h3 class="table-title">논문지도절차 목록</h3>
                <span class="table-count" id="content-count-display">(총 0건)</span>
            </div>
            <div class="table-header-right">
                <button onclick="ContentListManagement.showCreateForm()" class="btn-primary">
                    <i class="fas fa-plus mr-1"></i>신규 등록
                </button>
            </div>
        </div>
        <div class="table-scroll">
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th style="width: 60px;">순번</th>
                        <th>제목</th>
                        <th style="width: 150px;">대상학과</th>
                        <th style="width: 150px;">최근 수정일</th>
                        <th style="width: 120px;">작성자</th>
                    </tr>
                </thead>
                <tbody id="content-table-body">
                    <!-- 동적으로 생성됨 -->
                </tbody>
            </table>
        </div>
    </div>
    `;
};

// ========== 업무일정등록 ==========
views.workScheduleManagement = () => {
    // work-schedule-management.js의 initWorkScheduleManagement()를 호출하여 렌더링
    setTimeout(() => {
        if (typeof window.initWorkScheduleManagement === 'function') {
            window.initWorkScheduleManagement();
        } else {
            console.error('❌ initWorkScheduleManagement 함수를 찾을 수 없습니다.');
        }
    }, 0);

    return `<div id="work-schedule-management-content"></div>`;
};

// 전역 함수: ContentListManagement로 라우팅
window.navigateToContentList = function(contentType) {
    const viewMap = {
        ethics: 'ethicsList',
        schedule: 'scheduleList',
        procedure: 'procedureList'
    };
    const viewName = viewMap[contentType];
    if (viewName && typeof window.navigateToView === 'function') {
        window.navigateToView(viewName);
    }
};

// ========== 공지사항 관리 ==========
views.noticeManagement = () => `
    <div id="notice-list-view">
        <!-- 검색 영역 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
            <div class="flex items-center gap-3">
                <!-- 학과/전공 -->
                <div class="flex items-center gap-2 flex-1">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                    <select id="filter-notice-department"
                            class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                            style="height: 34px;">
                        <option value="all">전체</option>
                        ${DepartmentUtils.getAllDepartments().map(dept =>
                            `<option value="${dept}">${dept}</option>`
                        ).join('')}
                    </select>
                </div>
                <!-- 제목 -->
                <div class="flex items-center gap-2 flex-1">
                    <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">제목</label>
                    <input type="text" id="filter-notice-title" placeholder="제목"
                           class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                           onkeypress="if(event.key === 'Enter') filterNoticeList()">
                </div>
                <!-- 조회 버튼 -->
                <button onclick="filterNoticeList()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                    <i class="fas fa-search mr-1"></i>조회
                </button>
            </div>
        </div>

        <!-- 테이블 컨테이너 -->
        <div class="table-container">
            <!-- 테이블 헤더 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">공지사항 목록</h3>
                    <span class="table-count" id="notice-count-display">(총 0건)</span>
                </div>
                <div class="table-header-right">
                    <button onclick="showNoticeCreateForm()" class="btn-primary">
                        <i class="fas fa-plus mr-1"></i>신규 등록
                    </button>
                </div>
            </div>
            <div class="table-scroll">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th style="width: 60px;">순번</th>
                            <th>제목</th>
                            <th style="width: 100px;">첨부파일</th>
                            <th style="width: 150px;">최근 수정일</th>
                            <th style="width: 120px;">작성자</th>
                        </tr>
                    </thead>
                    <tbody id="notice-table-body">
                        <!-- 동적으로 생성됨 -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- 상세/작성/수정 영역 (초기에는 숨김) -->
    <div id="notice-detail-view" style="display: none;">
        <!-- 동적으로 생성됨 -->
    </div>
`;

// ========== 메뉴 관리 ==========
views.menuManagement = () => {
    const menus = (typeof mockMenus !== 'undefined') ? mockMenus : [];
    const depth1Count = menus.filter(m => m.depth === 1).length;
    const depth2Count = menus.filter(m => m.depth === 2).length;

    return `
        <!-- Section 1: 최상위 메뉴 관리 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="p-6 border-b">
                <h2 class="text-2xl font-bold text-gray-800">최상위 메뉴 관리</h2>
                <p class="text-sm text-gray-600 mt-2">최상위 메뉴의 이름, 경로, 사용여부를 관리합니다.</p>
            </div>
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">최상위 메뉴 목록</h3>
                        <span class="table-count" id="top-menu-count">(${depth1Count}건)</span>
                    </div>
                    <div class="table-header-right">
                        <button onclick="addNewTopMenu()" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            최상위 메뉴 추가
                        </button>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 50px;">순번</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 140px;">메뉴명(한글)</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 140px;">메뉴명(영어명)</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 140px;">메뉴명(중국어명)</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 60px;">순서</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 140px;">경로</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 55px;">관리자</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 55px;">교수</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 55px;">학생</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">관리</th>
                            </tr>
                        </thead>
                        <tbody id="topMenuTableBody" class="bg-white divide-y divide-gray-200">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Section 2: 메뉴 관리 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="p-6 border-b">
                <h2 class="text-2xl font-bold text-gray-800">메뉴 관리</h2>
                <p class="text-sm text-gray-600 mt-2">하위 메뉴의 이름, 상위메뉴, 경로 등을 관리합니다.</p>
            </div>
            <div class="table-container">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3 class="table-title">메뉴 목록</h3>
                        <span class="table-count" id="sub-menu-count">(${depth2Count}건)</span>
                    </div>
                    <div class="table-header-right">
                        <button onclick="addNewSubMenu()" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            메뉴 추가
                        </button>
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 50px;">순번</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 130px;">메뉴명(한글)</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 130px;">메뉴명(영어명)</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 130px;">메뉴명(중국어명)</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 120px;">상위메뉴</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 55px;">순서</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 130px;">경로</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 55px;">관리자</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 55px;">교수</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 55px;">학생</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600" style="width: 110px;">관리</th>
                            </tr>
                        </thead>
                        <tbody id="subMenuTableBody" class="bg-white divide-y divide-gray-200">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 하단 저장 버튼 -->
        <div class="flex justify-end mt-2 mb-4">
            <button onclick="saveAllMenuChanges()" class="bg-[#6A0028] text-white px-8 py-3 rounded-md text-base font-semibold hover:bg-opacity-90">
                저장
            </button>
        </div>
    `;
};

// ========== 사용자 관리 ==========
views.userManagement = () => {
    const users = appData.users || [];

    // 필터링을 위한 고유 값 추출
    const userTypes = ['전체', ...new Set(users.map(u => u.userType))];

    return `
        <div class="bg-white rounded-lg shadow-md">
            <!-- 조회 영역 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                <div class="grid grid-cols-5 gap-3">
                    <!-- 1행: 3개 필드 -->
                    <!-- 1. 사용자 구분 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">사용자 구분</label>
                        <select id="filter-userType" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            ${userTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                        </select>
                    </div>
                    <!-- 2. 학번/사번 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번/사번</label>
                        <input type="text" id="filter-idNumber" placeholder="학번/사번"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>
                    <!-- 3. 이름 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">이름</label>
                        <input type="text" id="filter-userName" placeholder="이름"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                    </div>
                    <!-- 4-5. 빈 칸 -->
                    <div></div>
                    <div></div>

                    <!-- 2행: 조회 버튼만 -->
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <!-- 조회 버튼 (2행 5번째) -->
                    <div class="flex items-center justify-end">
                        <button onclick="applyUserFilters()" class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-6 py-2 rounded text-sm font-medium">
                            <i class="fas fa-search mr-1"></i>조회
                        </button>
                    </div>
                </div>
            </div>

            <!-- 테이블 타이틀 -->
            <div class="px-6 py-3 border-b bg-gray-50">
                <h4 class="text-sm font-bold text-gray-800">사용자목록</h4>
            </div>

            <!-- 테이블 -->
            <div class="overflow-x-auto">
                <table class="w-full table-auto">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 40px;">
                                <input type="checkbox"
                                       id="selectAll-users"
                                       onchange="toggleAllUsers(this.checked)"
                                       class="rounded border-gray-300">
                            </th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 60px;">순번</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">사용자 구분</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 150px;">학과/부서</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 120px;">학번/사번</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">이름</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 80px;">학기차</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 100px;">학적상태</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 200px;">관리</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody" class="bg-white divide-y divide-gray-200">
                        <!-- 데이터는 JavaScript로 동적 렌더링 -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

// 디버깅: 콘텐츠 관리 뷰가 제대로 등록되었는지 확인
console.log('✅ admin_views.js 로드 완료');
console.log('✅ views.ethicsContentMgmt:', typeof views.ethicsContentMgmt);
console.log('✅ views.scheduleContentMgmt:', typeof views.scheduleContentMgmt);
console.log('✅ views.procedureContentMgmt:', typeof views.procedureContentMgmt);
console.log('✅ views.noticeManagement:', typeof views.noticeManagement);
console.log('✅ views.userManagement:', typeof views.userManagement);

// ========== 논문신청 관리 ==========
views.thesisApplication = () => {
        return `
            <!-- 목록 화면 -->
            <div id="thesis-application-list-view">
                <!-- 검색 필터 -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div class="grid grid-cols-5 gap-3">
                        <!-- 1행: 5개 필드 -->
                        <!-- 1. 학년도/학기 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학년도/학기
                            </label>
                            <div class="flex gap-2 flex-1">
                                <select id="filter-year"
                                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                        style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="2025" selected>2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                                <select id="filter-semester"
                                        class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                        style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="1" selected>1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>
                        </div>

                        <!-- 2. 대학구분 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                대학구분
                            </label>
                            <select id="filter-college-type"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="대학원">대학원</option>
                                <option value="특수대학원">특수대학원</option>
                            </select>
                        </div>

                        <!-- 3. 계열/대학원 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                계열/대학원
                            </label>
                            <select id="filter-graduate"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="일반대학원">일반대학원</option>
                                <option value="경영대학원">경영대학원</option>
                                <option value="특수대학원">특수대학원</option>
                            </select>
                        </div>

                        <!-- 4. 학부(과)전공 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학부(과)전공
                            </label>
                            <select id="filter-college"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="공학대학">공학대학</option>
                                <option value="경영대학">경영대학</option>
                                <option value="인문사회대학">인문사회대학</option>
                            </select>
                        </div>

                        <!-- 5. 학과/전공 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학과/전공
                            </label>
                            <input type="text" id="filter-department"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs"
                                   style="height: 34px;"
                                   placeholder="학과 입력">
                        </div>

                        <!-- 2행: 5개 필드 -->
                        <!-- 6. 학위과정 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학위과정
                            </label>
                            <select id="filter-degree"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                                <option value="석박통합">석박통합</option>
                            </select>
                        </div>

                        <!-- 7. 학적상태 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                학적상태
                            </label>
                            <select id="filter-status"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="재학">재학</option>
                                <option value="휴학">휴학</option>
                                <option value="수료">수료</option>
                                <option value="졸업">졸업</option>
                            </select>
                        </div>

                        <!-- 8. 지도교수명 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                지도교수명
                            </label>
                            <input type="text" id="filter-advisor"
                                   class="flex-1 px-2 border border-gray-300 rounded text-xs"
                                   style="height: 34px;"
                                   placeholder="지도교수명 입력">
                        </div>

                        <!-- 9. 지도단계 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                지도단계
                            </label>
                            <select id="filter-step-type"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="연구계획서">연구계획서</option>
                                <option value="IRB 승인">IRB 승인</option>
                                <option value="중간논문">중간논문</option>
                                <option value="예비심사">예비심사</option>
                                <option value="최종논문">최종논문</option>
                            </select>
                        </div>

                        <!-- 10. 신청상태 -->
                        <div class="flex items-center gap-2">
                            <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">
                                신청상태
                            </label>
                            <select id="filter-application-status"
                                    class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    style="height: 34px;">
                                <option value="">전체</option>
                                <option value="신청완료">신청완료</option>
                                <option value="미신청">미신청</option>
                            </select>
                        </div>

                        <!-- 3행: 버튼 행 -->
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>

                        <!-- 12. 조회/초기화 버튼 -->
                        <div class="flex items-center justify-end gap-2">
                            <button onclick="resetAdminThesisApplicationFilters()"
                                    class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium">
                                <i class="fas fa-redo mr-1"></i>초기화
                            </button>
                            <button onclick="applyAdminThesisApplicationFilters()"
                                    class="bg-[#6A0028] hover:bg-[#8A0034] text-white px-4 py-2 rounded text-sm font-medium">
                                <i class="fas fa-search mr-1"></i>조회
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 목록 -->
                <div id="thesis-application-list"></div>
            </div>

            <!-- 상세 화면 -->
            <div id="thesis-application-detail-view" style="display: none;"></div>
        `;
};
