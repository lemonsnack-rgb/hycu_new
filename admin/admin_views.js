// ========== 뷰 렌더링 함수들 ==========

const views = {
    // ========== 대시보드 ==========
    dashboard: () => `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-2">연구계획서 제출</p>
                        <p class="text-3xl font-bold text-gray-800">${appData.submissions.researchProposal.length}</p>
                    </div>
                    <div class="bg-blue-100 text-blue-600 p-3 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-2">중간논문 제출</p>
                        <p class="text-3xl font-bold text-gray-800">${appData.submissions.midThesis.length}</p>
                    </div>
                    <div class="bg-green-100 text-green-600 p-3 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-2">최종논문 제출</p>
                        <p class="text-3xl font-bold text-gray-800">${appData.submissions.finalThesis.length}</p>
                    </div>
                    <div class="bg-purple-100 text-purple-600 p-3 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 mb-2">학술지 심사</p>
                        <p class="text-3xl font-bold text-gray-800">${appData.submissions.journalSubmission.length}</p>
                    </div>
                    <div class="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">최근 활동</h3>
            <div class="space-y-4">
                <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-800"><strong>김철수</strong> 학생이 연구계획서를 제출했습니다.</p>
                        <p class="text-xs text-gray-500 mt-1">2025-03-10 14:30</p>
                    </div>
                </div>
                <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-800"><strong>이영희</strong> 학생의 연구계획서가 승인되었습니다.</p>
                        <p class="text-xs text-gray-500 mt-1">2025-03-12 10:15</p>
                    </div>
                </div>
                <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-800"><strong>정태훈</strong> 학생의 최종논문 심사가 완료되었습니다.</p>
                        <p class="text-xs text-gray-500 mt-1">2025-06-10 16:45</p>
                    </div>
                </div>
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

    // ========== 주차별 논문지도 현황 ==========
    weeklyGuidance: () => {
        const data = appData.weeklyGuidanceStudents;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">주차별 논문지도 현황</h3>

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

    // ========== 논문지도 진행 현황 (PDF 피드백 조회) ==========
    // Task 1-5: 온라인 피드백 현황 (Excel ID 22-24)
    guidanceProgress: () => {
        const data = appData.guidanceProgress;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">온라인 피드백 현황</h3>

                    <!-- 검색 영역: 대학원, 전공, 학위과정, 지도교수, 학기차, 피드백상태, 학번, 성명 -->
                    <div class="search-container">
                        <div class="search-grid">
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    대학원
                                </label>
                                <select id="progress-search-graduate" class="search-select">
                                    <option value="">전체</option>
                                    <option value="일반대학원">일반대학원</option>
                                    <option value="특수대학원">특수대학원</option>
                                    <option value="전문대학원">전문대학원</option>
                                </select>
                            </div>
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    전공
                                </label>
                                <select id="progress-search-major" class="search-select">
                                    <option value="">전체</option>
                                    <option value="교육공학">교육공학</option>
                                    <option value="경영학">경영학</option>
                                    <option value="컴퓨터공학">컴퓨터공학</option>
                                </select>
                            </div>
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학위과정
                                </label>
                                <select id="progress-search-degree" class="search-select">
                                    <option value="">전체</option>
                                    <option value="석사">석사</option>
                                    <option value="박사">박사</option>
                                    <option value="석박통합">석박통합</option>
                                </select>
                            </div>
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    지도교수
                                </label>
                                <select id="progress-search-advisor" class="search-select">
                                    <option value="">전체</option>
                                    <option value="홍길동">홍길동</option>
                                    <option value="박교수">박교수</option>
                                    <option value="김교수">김교수</option>
                                    <option value="이지도">이지도</option>
                                </select>
                            </div>
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학기차
                                </label>
                                <select id="progress-search-semester-count" class="search-select">
                                    <option value="">전체</option>
                                    <option value="1">1학기차</option>
                                    <option value="2">2학기차</option>
                                    <option value="3">3학기차</option>
                                    <option value="4">4학기차</option>
                                    <option value="5">5학기차</option>
                                    <option value="6">6학기차</option>
                                </select>
                            </div>
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    피드백상태
                                </label>
                                <select id="progress-search-status" class="search-select">
                                    <option value="">전체</option>
                                    <option value="대기">대기</option>
                                    <option value="진행 중">진행 중</option>
                                    <option value="완료">완료</option>
                                </select>
                            </div>
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학번
                                </label>
                                <input type="text"
                                       id="progress-search-student-id"
                                       placeholder="학번 입력"
                                       class="search-input"
                                       onkeypress="if(event.key==='Enter') searchGuidanceProgress()">
                            </div>
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    성명
                                </label>
                                <input type="text"
                                       id="progress-search-student-name"
                                       placeholder="성명 입력"
                                       class="search-input"
                                       onkeypress="if(event.key==='Enter') searchGuidanceProgress()">
                            </div>
                        </div>
                        <div class="search-buttons">
                            <button onclick="searchGuidanceProgress()"
                                    class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i>검색
                            </button>
                            <button onclick="resetGuidanceProgressSearch()"
                                    class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i>초기화
                            </button>
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이름</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학기차</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문명</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">제출일시</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">상태</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.length > 0 ? data.map((item, idx) => {
                                // 피드백 상태값 변환: 답변 대기중 → 대기, 피드백 완료 → 완료
                                let statusText = item.feedbackStatus || '대기';
                                if (statusText === '답변 대기중') statusText = '대기';
                                if (statusText === '피드백 완료') statusText = '완료';

                                const statusClass =
                                    statusText === '대기' ? 'bg-yellow-100 text-yellow-700' :
                                    statusText === '진행 중' ? 'bg-blue-100 text-blue-700' :
                                    'bg-green-100 text-green-700';

                                return `
                                <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewPdfFeedback(${item.id}, true)">
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.semesterCount || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-700">
                                        <div class="td-truncate font-medium" title="${item.documentTitle}">
                                            ${item.documentTitle}
                                        </div>
                                        <div class="text-xs text-gray-500 mt-1">${item.fileName}</div>
                                    </td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.submitDate}</td>
                                    <td class="py-3 px-4 text-center">
                                        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusClass}">
                                            ${statusText}
                                        </span>
                                    </td>
                                </tr>
                            `}).join('') : `
                                <tr>
                                    <td colspan="11" class="py-8 text-center text-gray-500">
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

    // ========== 논문지도 일정 관리 ==========
    scheduleManagement: () => {
        const data = appData.schedules;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">논문지도 일정 관리</h3>
                        <button onclick="switchView('scheduleCreate')" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            등록
                        </button>
                    </div>
                    
                    <!-- 검색 영역 -->
                    <div class="search-container">
                        <div class="search-grid">
                            <select id="schedule-search-target" class="search-select" onchange="searchSchedule()">
                                <option value="">적용대상 전체</option>
                                <option value="전체">전체</option>
                                <option value="교육공학-석사">교육공학-석사</option>
                                <option value="경영학-박사">경영학-박사</option>
                            </select>
                            <input type="text" 
                                   id="schedule-search-keyword" 
                                   placeholder="일정명/설명 검색"
                                   class="search-input"
                                   onkeypress="if(event.key==='Enter') searchSchedule()">
                        </div>
                        <div class="search-buttons">
                            <button onclick="searchSchedule()" class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i> 검색
                            </button>
                            <button onclick="resetScheduleSearch()" class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i> 초기화
                            </button>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">일정명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">카테고리</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">제출 기간</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사 기간</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map(item => `
                                <tr class="hover:bg-blue-50 cursor-pointer" onclick="switchView('scheduleCreate', ${item.id})">
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.category || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.semester || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">
                                        <div>${item.submissionStartDate || item.startDate}</div>
                                        <div class="text-xs text-gray-500">~ ${item.submissionEndDate || item.endDate}</div>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">
                                        <div>${item.reviewStartDate || item.startDate}</div>
                                        <div class="text-xs text-gray-500">~ ${item.reviewEndDate || item.endDate}</div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 일정 등록 (신규/수정) ==========
    scheduleCreate: (id = null) => {
        const isEdit = id !== null;
        const item = isEdit ? appData.schedules.find(s => s.id === id) : {};
        const categories = getCategoryList();

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800">${isEdit ? '일정 수정' : '일정 등록'}</h3>
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

                        <!-- 카테고리 선택 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                카테고리 (심사 단계) <span class="text-red-600">*</span>
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
                                이 카테고리는 모든 학위/전공의 동일 단계에 적용됩니다.
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

                        <!-- 제출 기간 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                제출 기간 <span class="text-red-600">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs text-gray-600 mb-1">제출 시작일</label>
                                    <input type="date" id="schedule-submission-start"
                                           value="${item.submissionStartDate || item.startDate || ''}"
                                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600 mb-1">제출 마감일</label>
                                    <input type="date" id="schedule-submission-end"
                                           value="${item.submissionEndDate || item.endDate || ''}"
                                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                                </div>
                            </div>
                        </div>

                        <!-- 심사 기간 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                심사 기간 <span class="text-red-600">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs text-gray-600 mb-1">심사 시작일</label>
                                    <input type="date" id="schedule-review-start"
                                           value="${item.reviewStartDate || ''}"
                                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600 mb-1">심사 종료일</label>
                                    <input type="date" id="schedule-review-end"
                                           value="${item.reviewEndDate || ''}"
                                           class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8] focus:border-transparent">
                                </div>
                            </div>
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
        const data = appData.requirements;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">논문 제출 요건 관리</h3>
                        <button onclick="openRequirementModal()" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            등록
                        </button>
                    </div>
                    
                    <!-- 검색 영역 -->
                    <div class="search-container">
                        <div class="search-grid">
                            <select id="requirement-search-major" class="search-select" onchange="searchRequirement()">
                                <option value="">전공 전체</option>
                                <option value="교육공학">교육공학</option>
                                <option value="경영학">경영학</option>
                                <option value="컴퓨터공학">컴퓨터공학</option>
                            </select>
                            <select id="requirement-search-degree" class="search-select" onchange="searchRequirement()">
                                <option value="">학위과정 전체</option>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                            </select>
                        </div>
                        <div class="search-buttons">
                            <button onclick="searchRequirement()" class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i> 검색
                            </button>
                            <button onclick="resetRequirementSearch()" class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i> 초기화
                            </button>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table id="requirement-table" class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">최소학점</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문필수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학술지논문</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학술대회논문</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map(item => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.minCredits}학점</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.thesisRequired ? 'O' : 'X'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.journalPapers}편</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.conferencePapers}편</td>
                                    <td class="py-3 px-4 space-x-2">
                                        <button onclick="viewRequirementDetail(${item.id})" class="text-blue-600 hover:underline text-sm">상세</button>
                                        <button onclick="editRequirement(${item.id})" class="text-green-600 hover:underline text-sm">수정</button>
                                        <button onclick="deleteRequirement(${item.id})" class="text-red-600 hover:underline text-sm">삭제</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // ========== 논문지도 워크플로우 관리 ==========
    stageManagement: () => {
        const data = mockThesisStages;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">심사 단계 관리</h3>
                        <button onclick="switchView('workflowCreateUnified')" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            등록
                        </button>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-blue-800">
                            <i class="fas fa-info-circle mr-2"></i>
                            학위별 논문 심사 단계를 구성하고 관리합니다.
                        </p>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사 단계명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계 수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계 구성</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => {
                                const degreeLabel = item.degreeType === 'master' ? '석사' : '박사';
                                const evaluationCount = item.stages.filter(s => s.evaluationRequired).length;

                                return `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                    <td class="py-3 px-4 text-sm">
                                        <span class="px-2 py-1 rounded text-xs font-medium ${
                                            item.degreeType === 'master' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }">${degreeLabel}</span>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-center">
                                        <span class="font-semibold text-blue-600">${item.stageCount}단계</span>
                                        ${evaluationCount > 0 ? `<span class="text-xs text-green-600 ml-2">(${evaluationCount}개 심사)</span>` : ''}
                                    </td>
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
                                    <td class="py-3 px-4">
                                        <div class="flex gap-2">
                                            <button onclick="switchView('workflowCreateUnified', '${item.id}')"
                                                    class="text-blue-600 hover:underline text-sm">
                                                수정
                                            </button>
                                            <button onclick="deleteWorkflow('${item.id}')"
                                                    class="text-red-600 hover:underline text-sm">
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
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
                        뒤로가기
                    </button>
                    <h2 class="text-2xl font-bold text-gray-800">
                        ${isEdit ? '워크플로우 수정' : '워크플로우 등록'}
                    </h2>
                </div>

                <!-- 안내 메시지 -->
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <div class="flex">
                        <svg class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        <div class="text-sm text-blue-700">
                            <p class="font-medium">워크플로우를 먼저 생성하세요</p>
                            <p class="mt-1">워크플로우명과 학위 유형을 입력하고 저장하면 단계 구성 페이지로 이동합니다.</p>
                        </div>
                    </div>
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
                            ${isEdit ? '저장 후 단계 구성' : '저장 후 단계 구성하기'}
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

    // ========== 지도 단계 유형 관리 ==========
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

    // ========== 평가 기준 관리 (독립적 평가표) ==========
    evaluationCriteria: () => {
        const data = appData.evaluationCriteria;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">심사 기준 등록</h3>
                        <button onclick="switchView('evaluationCriteriaEdit')" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            등록
                        </button>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p class="text-sm text-blue-800">
                            <i class="fas fa-info-circle mr-2"></i>
                            평가표는 학과/전공과 무관하게 독립적으로 관리됩니다. 논문지도 단계 구성 시 필요한 평가표를 선택할 수 있습니다.
                        </p>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">평가표명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">유형</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
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
                                    <tr class="hover:bg-blue-50 cursor-pointer" onclick="switchView('evaluationCriteriaEdit', '${item.id}')">
                                        <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                        <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">
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
        const items = isEdit && criteria && Array.isArray(criteria.items) ? criteria.items : [];

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">${isEdit ? '심사 기준 수정' : '심사 기준 등록'}</h3>
                        <div class="flex gap-2">
                            <button onclick="switchView('evaluationCriteria')" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                                취소
                            </button>
                            <button onclick="saveEvaluationCriteria(${criteriaId})" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                                저장
                            </button>
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <!-- 평가표 기본 정보 -->
                    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 class="text-md font-semibold text-gray-800 mb-4">평가표 기본 정보</h4>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    평가표명 <span class="text-red-600">*</span>
                                </label>
                                <input type="text" id="edit-criteria-name" value="${name}"
                                       placeholder="예: 일반 연구계획서 평가표"
                                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    평가표 유형 <span class="text-red-600">*</span>
                                </label>
                                <select id="edit-criteria-type" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" ${isEdit ? 'disabled' : ''}>
                                    <option value="score" ${evaluationType === 'score' ? 'selected' : ''}>점수형 - 점수로 평가 (예: 100점 만점)</option>
                                    <option value="passfail" ${evaluationType === 'passfail' ? 'selected' : ''}>Pass/Fail형 - 합격/불합격으로 평가</option>
                                </select>
                                ${isEdit ? '<p class="text-xs text-gray-500 mt-1">평가표 유형은 수정할 수 없습니다.</p>' : '<p class="text-xs text-gray-500 mt-1">선택한 유형에 따라 평가 항목의 입력 방식이 달라집니다.</p>'}
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    설명 <span class="text-red-600">*</span>
                                </label>
                                <textarea id="edit-criteria-description" rows="3"
                                          placeholder="이 평가표의 용도와 특징을 설명해주세요"
                                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm">${description}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- 통과 기준 (점수형만) -->
                    ${evaluationType === 'score' ? `
                        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 class="text-md font-semibold text-gray-800 mb-4">통과 기준</h4>
                            <div class="grid grid-cols-1 gap-4">
                                <div class="grid grid-cols-3 gap-3 items-end">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            총 심사위원 수 <span class="text-red-600">*</span>
                                        </label>
                                        <input type="number" id="pass-total-committee"
                                               value="${isEdit && criteria?.passCriteria?.totalCommittee !== undefined ? criteria.passCriteria.totalCommittee : 3}"
                                               class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                               min="1" placeholder="예: 3">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            통과 필요 인원 <span class="text-red-600">*</span>
                                        </label>
                                        <input type="number" id="pass-required-committee"
                                               value="${isEdit && criteria?.passCriteria?.requiredCommittee !== undefined ? criteria.passCriteria.requiredCommittee : 2}"
                                               class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                               min="1" placeholder="예: 2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            최소 점수 <span class="text-red-600">*</span>
                                        </label>
                                        <input type="number" id="pass-min-score"
                                               value="${isEdit && criteria?.passCriteria?.passScore !== undefined ? criteria.passCriteria.passScore : 70}"
                                               class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                               min="0" max="100" placeholder="예: 70">
                                    </div>
                                </div>
                                <div class="bg-blue-50 border border-blue-200 rounded p-3">
                                    <p class="text-sm text-blue-800">
                                        <i class="fas fa-info-circle mr-2"></i>
                                        예시: 총 심사위원 3명 중 2명 이상이 70점 이상을 줘야 통과
                                    </p>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- 총점 표시 (점수형만) -->
                    ${evaluationType === 'score' ? `
                        <div class="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="fas fa-calculator text-blue-600 mr-3 text-xl"></i>
                                    <span class="text-sm font-medium text-gray-700">총점:</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span id="total-score-display" class="text-2xl font-bold text-blue-600">
                                        ${items.reduce((sum, item) => sum + (item.score || 0), 0)}
                                    </span>
                                    <span class="text-sm text-gray-600">점</span>
                                </div>
                            </div>
                            <p class="text-xs text-gray-600 mt-2">
                                <i class="fas fa-info-circle mr-1"></i>
                                총점은 반드시 100점이어야 합니다.
                            </p>
                        </div>
                    ` : ''}

                    <!-- 평가 항목 -->
                    <div class="mb-6">
                        <div class="mb-4">
                            <h4 class="text-md font-semibold text-gray-800">평가 항목</h4>
                        </div>
                        <div id="evaluation-items-container">
                            ${items.length > 0 ? items.map((item, idx) => {
                                if (evaluationType === 'score') {
                                    return `
                                        <div class="evaluation-item mb-3 p-4 bg-white border border-gray-200 rounded-lg" data-item-id="${item.id}">
                                            <div class="flex justify-between items-start mb-3">
                                                <h5 class="text-sm font-semibold text-gray-700">항목 ${idx + 1}</h5>
                                                <button onclick="removeEvaluationItem(this)" class="text-red-600 hover:text-red-800 text-sm">
                                                    <i class="fas fa-trash"></i> 삭제
                                                </button>
                                            </div>
                                            <div class="grid grid-cols-1 gap-3">
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-700 mb-1">항목명 <span class="text-red-600">*</span></label>
                                                    <input type="text" class="item-name w-full border border-gray-300 rounded px-2 py-1 text-sm" value="${(item.name || '').replace(/"/g, '&quot;')}" placeholder="평가 항목명" required>
                                                </div>
                                                <div class="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label class="block text-xs font-medium text-gray-700 mb-1">배점 <span class="text-red-600">*</span></label>
                                                        <input type="number" class="item-score w-full border border-gray-300 rounded px-2 py-1 text-sm" value="${item.score || 0}" placeholder="점수" min="0" required onchange="updateTotalScore()">
                                                    </div>
                                                    <div>
                                                        <div class="flex items-center mb-1">
                                                            <input type="checkbox" class="item-fail-enabled mr-2" ${item.failScore !== undefined && item.failScore !== null ? 'checked' : ''} onchange="toggleFailScore(this)">
                                                            <label class="text-xs font-medium text-gray-700">과락기준 설정</label>
                                                        </div>
                                                        <input type="number" class="item-fail-score w-full border border-gray-300 rounded px-2 py-1 text-sm ${item.failScore !== undefined && item.failScore !== null ? '' : 'bg-gray-100'}" value="${item.failScore !== undefined && item.failScore !== null ? item.failScore : ''}" placeholder="최소 점수" min="0" ${item.failScore !== undefined && item.failScore !== null ? '' : 'disabled'}>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-700 mb-1">설명 <span class="text-red-600">*</span></label>
                                                    <textarea class="item-description w-full border border-gray-300 rounded px-2 py-1 text-sm" rows="2" placeholder="항목 설명" required>${(item.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                } else {
                                    return `
                                        <div class="evaluation-item mb-3 p-4 bg-white border border-gray-200 rounded-lg" data-item-id="${item.id}">
                                            <div class="flex justify-between items-start mb-3">
                                                <h5 class="text-sm font-semibold text-gray-700">항목 ${idx + 1}</h5>
                                                <button onclick="removeEvaluationItem(this)" class="text-red-600 hover:text-red-800 text-sm">
                                                    <i class="fas fa-trash"></i> 삭제
                                                </button>
                                            </div>
                                            <div class="grid grid-cols-1 gap-3">
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-700 mb-1">항목명 <span class="text-red-600">*</span></label>
                                                    <input type="text" class="item-name w-full border border-gray-300 rounded px-2 py-1 text-sm" value="${(item.name || '').replace(/"/g, '&quot;')}" placeholder="평가 항목명" required>
                                                </div>
                                                <div>
                                                    <label class="block text-xs font-medium text-gray-700 mb-1">설명 <span class="text-red-600">*</span></label>
                                                    <textarea class="item-description w-full border border-gray-300 rounded px-2 py-1 text-sm" rows="2" placeholder="항목 설명" required>${(item.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }
                            }).join('') : '<p class="text-sm text-gray-500 text-center py-4">평가 항목을 추가해주세요.</p>'}
                        </div>
                        <div class="mt-4 text-center">
                            <button onclick="addEvaluationItem()" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                                <i class="fas fa-plus mr-2"></i>항목 추가
                            </button>
                        </div>
                    </div>

                    ${isEdit && criteria ? `
                        <div class="flex justify-end gap-2 pt-4 border-t">
                            <button onclick="deleteEvaluationCriteriaConfirm(${criteriaId})" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                                <i class="fas fa-trash mr-1"></i> 평가표 삭제
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // ========== 논문 제목 등록 현황 ==========
    titleChangeRequests: () => {
        const data = appData.titleChangeRequests;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">논문 제목 등록 현황</h3>

                    <!-- 검색 메뉴 -->
                    <div class="search-container">
                        <div class="search-grid">
                            <!-- 1. 학년도 -->
                            <div class="search-field">
                                <label class="search-label">학년도</label>
                                <select id="title-search-year" class="search-select">
                                    <option value="">전체</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>

                            <!-- 2. 학기 -->
                            <div class="search-field">
                                <label class="search-label">학기</label>
                                <select id="title-search-semester" class="search-select">
                                    <option value="">전체</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>

                            <!-- 3. 학번 -->
                            <div class="search-field">
                                <label class="search-label">학번</label>
                                <input type="text" id="title-search-student-id" placeholder="학번 입력"
                                       class="search-input">
                            </div>

                            <!-- 4. 성명 -->
                            <div class="search-field">
                                <label class="search-label">성명</label>
                                <input type="text" id="title-search-student-name" placeholder="성명 입력"
                                       class="search-input">
                            </div>
                        </div>

                        <!-- 검색/초기화 버튼 -->
                        <div class="search-buttons">
                            <button onclick="searchTitleChangeRequests()" class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i>검색
                            </button>
                            <button onclick="resetTitleChangeSearch()" class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i>초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 테이블 -->
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이름</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문 제목</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">등록일(수정일)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.length > 0 ? data.map((item, idx) => `
                                <tr class="hover:bg-gray-50 cursor-pointer" onclick="viewTitleChangeDetail(${item.id})">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${addStudentInfoIcon(item.studentName, item.studentId)}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600 td-truncate-extra-long" title="${item.titleKo || item.currentTitle || '-'}">
                                        ${item.titleKo || item.currentTitle || '-'}
                                    </td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.registeredDate || item.requestDate || '-'}</td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="9" class="py-8 text-center text-gray-500">
                                        논문 제목 등록 내역이 없습니다.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
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

    // ========== 권한 관리 ==========
    permissionManagement: () => {
        const administrators = appData.administrators || [];
        const screenList = appData.screenList || [];

        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h2 class="text-2xl font-bold text-gray-800">권한 관리</h2>
                    <p class="text-sm text-gray-600 mt-2">관리자별 화면 접근 권한을 관리합니다.</p>
                </div>

                <!-- 관리자 검색 및 추가 섹션 -->
                <div class="p-6 border-b" style="background: linear-gradient(to bottom, #FFFBF5, #FFF9F0);">
                    <div class="flex items-center mb-4">
                        <svg class="w-6 h-6 text-[#009DE8] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                        <h3 class="text-lg font-bold text-gray-800">새 관리자 검색 및 추가</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">
                        교번 또는 이름으로 검색하여 새로운 관리자를 추가할 수 있습니다.
                    </p>
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-blue-700">
                                    <strong>예시:</strong> 교번 "A2024004" 또는 이름 "김직원"으로 검색하면 교무처 소속 김직원님을 관리자로 추가할 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text" id="search-employee-id" placeholder="예: A2024004"
                               class="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                        <input type="text" id="search-employee-name" placeholder="예: 김직원"
                               class="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#009DE8]">
                        <button onclick="searchEmployee()"
                                class="bg-[#009DE8] text-white px-4 py-2 rounded text-sm hover:bg-[#0087c9] flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            검색
                        </button>
                        <div id="search-result" class="col-span-full"></div>
                    </div>
                </div>

                <!-- 등록된 관리자 목록 및 권한 설정 섹션 -->
                <div class="p-6" style="background-color: #FAFAFA;">
                    <div class="flex items-center mb-4">
                        <svg class="w-6 h-6 text-[#009DE8] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <h3 class="text-lg font-bold text-gray-800">등록된 관리자 목록 및 권한 설정</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">
                        각 관리자의 화면별 접근 권한을 설정하고, 권한을 중지하거나 관리자를 삭제할 수 있습니다.
                    </p>

                    ${administrators.length > 0 ? administrators.map((admin, index) => {
                        const permissions = appData.permissions.filter(p => p.adminId === admin.id);
                        const permissionMap = {};
                        permissions.forEach(p => {
                            permissionMap[p.screenId] = p.hasAccess;
                        });

                        // 화면을 카테고리별로 그룹화
                        const categories = {};
                        screenList.forEach(screen => {
                            if (!categories[screen.category]) {
                                categories[screen.category] = [];
                            }
                            categories[screen.category].push(screen);
                        });

                        return `
                            <div class="mb-6 border border-gray-200 rounded-lg overflow-hidden ${admin.status === 'suspended' ? 'opacity-60' : ''}" style="${admin.status === 'suspended' ? 'filter: grayscale(40%); background-color: #F5F5F5;' : ''}">
                                <!-- 관리자 정보 헤더 -->
                                <div class="p-4 flex justify-between items-center ${admin.status === 'suspended' ? 'bg-gray-200' : 'bg-gray-100'}">
                                    <div class="flex items-center gap-4">
                                        <div>
                                            <h4 class="font-bold text-gray-800">${admin.name}</h4>
                                            <p class="text-sm text-gray-600">교번: ${admin.employeeId} | 소속: ${admin.department}</p>
                                        </div>
                                        <span class="px-3 py-1 text-xs rounded-full ${admin.status === 'active' ? 'bg-green-100 text-green-800' : admin.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                                            ${admin.status === 'active' ? '활성' : admin.status === 'suspended' ? '권한 중지' : '비활성'}
                                        </span>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="saveAdminPermissions(${admin.id})"
                                                ${admin.status === 'suspended' ? 'disabled' : ''}
                                                class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1 ${admin.status === 'suspended' ? 'opacity-50 cursor-not-allowed' : ''}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                                            </svg>
                                            권한 저장
                                        </button>
                                        ${admin.status === 'active' ? `
                                        <button onclick="suspendAdmin(${admin.id})"
                                                class="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 flex items-center gap-1"
                                                title="모든 권한을 비활성화합니다. 재등록 없이 다시 활성화할 수 있습니다.">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            권한 중지
                                        </button>
                                        ` : admin.status === 'suspended' ? `
                                        <button onclick="activateAdmin(${admin.id})"
                                                class="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                                                title="중지된 권한을 다시 활성화합니다.">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            권한 활성화
                                        </button>
                                        ` : ''}
                                        <button onclick="removeAdmin(${admin.id})"
                                                class="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                                                title="관리자를 완전히 삭제합니다. 재등록이 필요합니다.">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                            완전 삭제
                                        </button>
                                    </div>
                                </div>

                                <!-- 권한 설정 테이블 -->
                                <div class="p-4 ${admin.status === 'suspended' ? 'bg-gray-100' : ''}">
                                    ${admin.status === 'suspended' ? `
                                        <div class="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p class="text-sm text-yellow-800">
                                                <strong>⚠️ 권한 중지됨:</strong> 모든 권한이 비활성화되어 있습니다. "권한 활성화" 버튼을 눌러 다시 활성화하세요.
                                            </p>
                                        </div>
                                    ` : ''}
                                    ${Object.entries(categories).map(([category, screens]) => `
                                        <div class="mb-4">
                                            <h5 class="font-semibold text-gray-700 mb-2 border-b pb-2">${category}</h5>
                                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                ${screens.map(screen => `
                                                    <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded ${admin.status === 'suspended' ? 'cursor-not-allowed' : 'cursor-pointer'}">
                                                        <input type="checkbox"
                                                               data-admin-id="${admin.id}"
                                                               data-screen-id="${screen.id}"
                                                               ${permissionMap[screen.id] ? 'checked' : ''}
                                                               ${admin.status === 'suspended' ? 'disabled' : ''}
                                                               onchange="updatePermission(${admin.id}, '${screen.id}', this.checked)"
                                                               class="rounded border-gray-300">
                                                        <span class="text-sm ${admin.status === 'suspended' ? 'text-gray-500' : 'text-gray-700'}">${screen.name}</span>
                                                    </label>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('') : `
                        <div class="text-center py-8 text-gray-500">
                            등록된 관리자가 없습니다.
                        </div>
                    `}
                </div>
            </div>
        `;
    },

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
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800">지도교수 배정</h2>
                    <p class="text-sm text-gray-600 mt-1">학생의 지도교수 배정 현황을 조회합니다.</p>
                </div>

                <!-- 검색 옵션 (학위논문 심사와 동일한 디자인) -->
                <div class="p-6 border-b">
                    <div class="search-container">
                        <div class="search-grid">
                            <!-- 1. 학년도 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학년도
                                </label>
                                <select id="advisor-search-year" class="search-select">
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
                                <select id="advisor-search-semester" class="search-select">
                                    <option value="">전체</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>

                            <!-- 3. 학기차 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학기차
                                </label>
                                <input type="text" id="advisor-search-semester-count" placeholder="학기차 입력"
                                       class="search-input">
                            </div>

                            <!-- 4. 학과/전공 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학과/전공
                                </label>
                                <select id="advisor-search-department" class="search-select">
                                    <option value="">전체</option>
                                    ${mockDepartmentNames.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                                </select>
                            </div>

                            <!-- 5. 학번 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학번
                                </label>
                                <input type="text" id="advisor-search-student-id" placeholder="학번 입력"
                                       class="search-input">
                            </div>

                            <!-- 6. 이름 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    이름
                                </label>
                                <input type="text" id="advisor-search-student-name" placeholder="이름 입력"
                                       class="search-input">
                            </div>
                        </div>

                        <!-- 검색/초기화 버튼 -->
                        <div class="search-buttons">
                            <button onclick="searchAdvisorAssignment()" class="search-btn search-btn-primary">
                                <i class="fas fa-search"></i>검색
                            </button>
                            <button onclick="resetAdvisorSearch()" class="search-btn search-btn-secondary">
                                <i class="fas fa-redo"></i>초기화
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 학생 목록 테이블 -->
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학년도</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학기차</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학과</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학위과정</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지도교수</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부지도교수</th>
                                </tr>
                            </thead>
                            <tbody id="advisor-assignment-table" class="bg-white divide-y divide-gray-200">
                                ${data.map(item => `
                                    <tr class="hover:bg-gray-50 cursor-pointer"
                                        data-student-id="${item.studentId}"
                                        data-department="${item.department}"
                                        data-status="${item.status}"
                                        onclick="viewProposalDetail('${item.id}')">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.academicYear}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.semesterCount}학기</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.studentNumber}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.department}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${item.studentName}
                                            <button onclick="event.stopPropagation(); showStudentInfo('${item.studentId}')"
                                                    class="ml-1 text-gray-400 hover:text-primary"
                                                    title="학생 상세정보">
                                                <svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span class="px-2 py-1 text-xs rounded ${item.degreeType === '석사' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">
                                                ${item.degreeType}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-900">
                                            ${item.assignment && item.assignment.mainAdvisor
                                                ? item.assignment.mainAdvisor.name
                                                : '-'}
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-900">
                                            ${item.assignment && item.assignment.coAdvisors.length > 0
                                                ? item.assignment.coAdvisors.map(c => c.name).join(', ')
                                                : '-'}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                    ${data.length === 0 ? `
                        <div class="text-center py-8 text-gray-500">
                            ${window.filteredAdvisorData ? '검색 결과가 없습니다.' : '제출된 연구계획서가 없습니다.'}
                        </div>
                    ` : ''}
                </div>

            </div>
        `;
    },

    // 논문 지도 단계 관리 화면
    stageManagement: () => {
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800">논문 지도 단계 관리</h2>
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
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">심사 단계 관리</h3>
                        <button onclick="switchView('workflowCreateUnified')" class="bg-[#009DE8] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            등록
                        </button>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-blue-800">
                            <i class="fas fa-info-circle mr-2"></i>
                            학위별 논문 심사 단계를 구성하고 관리합니다. 행을 클릭하여 상세 내용을 확인하세요.
                        </p>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">심사 단계명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계 구성</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => {
                                const degreeLabel = item.degreeType === 'master' ? '석사' : '박사';

                                return `
                                <tr class="hover:bg-blue-50 cursor-pointer" onclick="switchView('workflowCreateUnified', '${item.id}')">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                    <td class="py-3 px-4 text-sm">
                                        <span class="px-2 py-1 rounded text-xs font-medium ${
                                            item.degreeType === 'master' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }">${degreeLabel}</span>
                                    </td>
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
        `;
    },

    // 심사위원 배정 화면 (P1-5)
    committeeAssignment: () => {
        // Mock 데이터 로드
        if (typeof mockReviewTargets === 'undefined' || typeof mockCommitteeAssignments === 'undefined') {
            return `
                <div class="bg-white rounded-lg shadow-md p-8">
                    <div class="text-center text-red-500">
                        <p class="text-lg">Mock 데이터가 로드되지 않았습니다.</p>
                        <p class="text-sm mt-2">admin/assets/js/mockData.js 파일을 확인하세요.</p>
                    </div>
                </div>
            `;
        }

        // JavaScript 파일 동적 로드
        const existingScript = document.querySelector('script[src="assets/js/admin-committee-assignment.js"]');

        if (!existingScript) {
            // 스크립트가 없으면 새로 로드
            const script = document.createElement('script');
            script.src = 'assets/js/admin-committee-assignment.js';
            script.onload = () => {
                if (typeof renderCommitteeAssignmentContent === 'function') {
                    renderCommitteeAssignmentContent();
                }
            };
            document.body.appendChild(script);
        } else {
            // 이미 로드된 경우 다음 틱에서 렌더링 함수 호출
            setTimeout(() => {
                if (typeof renderCommitteeAssignmentContent === 'function') {
                    renderCommitteeAssignmentContent();
                }
            }, 0);
        }

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
            categoryId: '',
            name: '',
            requiresDocument: false,
            requiresPresentation: false,
            submissionStartDate: '',
            submissionEndDate: '',
            evaluationTemplateId: '',
            reviewStartDate: '',
            reviewEndDate: '',
            description: ''
        }];
        window.currentWorkflowId = id;

        const handleSave = () => {
            const name = document.getElementById('workflow-name').value;
            const degreeCheckboxes = document.querySelectorAll('input[name="workflow-degree"]:checked');

            if (!name.trim()) {
                alert('워크플로우 이름을 입력해주세요.');
                return;
            }

            if (degreeCheckboxes.length === 0) {
                alert('학위 과정을 최소 1개 이상 선택해주세요.');
                return;
            }

            // 단계 유효성 검사
            for (let i = 0; i < window.composedStages.length; i++) {
                const stage = window.composedStages[i];
                if (!stage.categoryId) {
                    alert(`단계 ${i + 1}: 카테고리를 선택해주세요.`);
                    return;
                }
                if (!stage.name.trim()) {
                    alert(`단계 ${i + 1}: 단계 이름을 입력해주세요.`);
                    return;
                }
                if (!stage.submissionStartDate || !stage.submissionEndDate) {
                    alert(`단계 ${i + 1}: 제출 기간을 입력해주세요.`);
                    return;
                }
                if (stage.evaluationTemplateId && (!stage.reviewStartDate || !stage.reviewEndDate)) {
                    alert(`단계 ${i + 1}: 평가표를 선택한 경우 심사 기간을 입력해주세요.`);
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
                    <h3 class="text-lg font-bold text-gray-800">${isEdit ? '심사 단계 수정' : '심사 단계 등록'}</h3>
                    <p class="text-sm text-gray-600 mt-1">단계를 직접 입력하여 논문 심사 단계를 구성합니다.</p>
                </div>

                <!-- Workflow Basic Info -->
                <div class="p-6 border-b bg-gray-50">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">심사 단계 이름 *</label>
                            <input type="text"
                                   id="workflow-name"
                                   value="${isEdit ? item.name : ''}"
                                   placeholder="예: 석사 표준 과정"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">학위 과정 *</label>
                            <div class="flex items-center gap-4 mt-2">
                                <label class="flex items-center">
                                    <input type="checkbox" name="workflow-degree" value="master"
                                           ${isEdit && item.degreeType === 'master' ? 'checked' : ''}
                                           class="mr-2 w-4 h-4">
                                    석사
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" name="workflow-degree" value="phd"
                                           ${isEdit && item.degreeType === 'phd' ? 'checked' : ''}
                                           class="mr-2 w-4 h-4">
                                    박사
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content: Single Panel with Stage Cards -->
                <div class="p-6">
                    <div class="mb-4">
                        <h4 class="font-bold text-gray-800 mb-2">단계 구성 (${window.composedStages.length}개)</h4>
                        <p class="text-xs text-gray-500">각 단계의 정보를 직접 입력하세요. 제출/심사 일정은 안내용 메타데이터입니다.</p>
                    </div>

                    <div id="stage-cards-container" class="space-y-4">
                        ${renderStageCards()}
                    </div>

                    <button onclick="addNewStageCard()"
                            class="mt-4 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        + 단계 추가
                    </button>
                </div>

                <!-- Footer: Save Button -->
                <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    <button onclick="switchView('typeManagement')"
                            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                        취소
                    </button>
                    <button id="unified-save-btn"
                            class="px-4 py-2 rounded-md bg-[#009DE8] text-white hover:bg-opacity-90">
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

    // ========== 권한 관리 (ERP 연동 기반) ==========
    permissionManagement: () => {
        // 초기화: 선택된 탭과 대상
        const currentTab = window.currentPermissionTab || 'department';
        const currentTargetId = window.currentPermissionTargetId || (currentTab === 'department' ? 'DEPT_001' : null);

        // 탭별 데이터
        const tabData = {
            department: mockDepartments,
            position: mockPositions,
            roleGroup: mockRoleGroups,
            individual: mockUsers
        };

        const currentData = tabData[currentTab];
        const selectedTarget = currentData?.find(item => item.id === currentTargetId) || currentData?.[0];

        // 현재 대상의 권한 가져오기
        let currentPermissions = [];
        if (currentTab === 'department') {
            currentPermissions = mockDepartmentPermissions.find(dp => dp.departmentId === selectedTarget?.id)?.permissions || [];
        } else if (currentTab === 'position') {
            currentPermissions = mockPositionPermissions.find(pp => pp.positionId === selectedTarget?.id)?.permissions || [];
        } else if (currentTab === 'roleGroup') {
            currentPermissions = mockRoleGroupPermissions.find(rp => rp.roleGroupId === selectedTarget?.id)?.permissions || [];
        } else if (currentTab === 'individual') {
            currentPermissions = mockIndividualPermissions.find(ip => ip.userId === selectedTarget?.id)?.permissions || [];
        }

        // 권한 매트릭스 생성
        const menuTree = mockMenus.filter(m => m.depth === 1);

        return `
            <div class="bg-white rounded-lg shadow-md">
                <!-- Header -->
                <div class="p-6 border-b">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">권한 관리</h3>
                        <p class="text-sm text-gray-600 mt-1">부서, 신분, 역할그룹, 개인별 권한을 관리합니다.</p>
                    </div>
                </div>

                <!-- 2-Column Layout -->
                <div class="grid grid-cols-12 gap-4">
                    <!-- Left Panel: Target Selection (30%) -->
                    <div class="col-span-4 border-r" style="min-height: 600px;">
                        <!-- Tabs -->
                        <div class="border-b flex">
                            <button class="flex-1 py-3 px-4 text-sm font-medium ${currentTab === 'department' ? 'text-[#009DE8] border-b-2 border-[#009DE8] bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}"
                                    onclick="switchPermissionTab('department')">
                                부서별
                            </button>
                            <button class="flex-1 py-3 px-4 text-sm font-medium ${currentTab === 'position' ? 'text-[#009DE8] border-b-2 border-[#009DE8] bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}"
                                    onclick="switchPermissionTab('position')">
                                신분별
                            </button>
                            <button class="flex-1 py-3 px-4 text-sm font-medium ${currentTab === 'roleGroup' ? 'text-[#009DE8] border-b-2 border-[#009DE8] bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}"
                                    onclick="switchPermissionTab('roleGroup')">
                                역할그룹별
                            </button>
                            <button class="flex-1 py-3 px-4 text-sm font-medium ${currentTab === 'individual' ? 'text-[#009DE8] border-b-2 border-[#009DE8] bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}"
                                    onclick="switchPermissionTab('individual')">
                                개인별
                            </button>
                        </div>

                        <!-- Search -->
                        <div class="p-4 border-b bg-gray-50">
                            <input type="text"
                                   id="target-search"
                                   placeholder="검색..."
                                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009DE8]">
                        </div>

                        <!-- Target List -->
                        <div style="max-height: 500px; overflow-y: auto;">
                            ${currentData?.map(item => {
                                const isSelected = item.id === selectedTarget?.id;
                                let displayName = '';
                                let displayInfo = '';

                                if (currentTab === 'department') {
                                    displayName = item.name;
                                    displayInfo = `코드: ${item.code}`;
                                } else if (currentTab === 'position') {
                                    displayName = item.name;
                                    displayInfo = `코드: ${item.code}`;
                                } else if (currentTab === 'roleGroup') {
                                    displayName = item.name;
                                    displayInfo = `코드: ${item.id}`;
                                } else if (currentTab === 'individual') {
                                    displayName = item.name;
                                    displayInfo = `${item.employeeNumber || item.studentNumber || item.username}`;
                                }

                                return `
                                <div class="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-l-4 border-l-[#009DE8]' : ''}"
                                     onclick="selectPermissionTarget('${currentTab}', '${item.id}')">
                                    <div class="font-medium text-gray-800 text-sm">${displayName}</div>
                                    <div class="text-xs text-gray-500 mt-1">${displayInfo}</div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Right Panel: CRUD Permission Matrix (70%) -->
                    <div class="col-span-8">
                        <div class="p-6 border-b bg-gray-50">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="font-bold text-gray-800">${selectedTarget?.name || '선택된 대상 없음'}</h4>
                                    <p class="text-xs text-gray-500 mt-1">메뉴별 CRUD 권한을 설정합니다.</p>
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="resetPermissionMatrix()"
                                            class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                                        초기화
                                    </button>
                                    <button onclick="savePermissionMatrix()"
                                            class="px-4 py-2 text-sm bg-[#009DE8] text-white rounded-md hover:bg-opacity-90">
                                        저장
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Permission Matrix Table -->
                        <div style="max-height: 520px; overflow-y: auto;">
                            <table class="w-full table-fixed">
                                <thead class="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700" style="width: 35%;">메뉴명</th>
                                        <th class="text-center py-3 px-2 text-xs font-semibold text-gray-700" style="width: 13%;">조회<br/>(R)</th>
                                        <th class="text-center py-3 px-2 text-xs font-semibold text-gray-700" style="width: 13%;">등록<br/>(C)</th>
                                        <th class="text-center py-3 px-2 text-xs font-semibold text-gray-700" style="width: 13%;">수정<br/>(U)</th>
                                        <th class="text-center py-3 px-2 text-xs font-semibold text-gray-700" style="width: 13%;">삭제<br/>(D)</th>
                                        <th class="text-left py-3 px-4 text-xs font-semibold text-gray-700" style="width: 13%;">비고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${menuTree.map(menu1 => {
                                        const perm1 = currentPermissions.find(p => p.menuId === menu1.id) || {};
                                        const children = mockMenus.filter(m => m.parentId === menu1.id);

                                        return `
                                        <!-- 1depth Menu -->
                                        <tr class="bg-blue-50 border-b">
                                            <td class="py-3 px-4 font-semibold text-sm">${menu1.name}</td>
                                            <td class="text-center py-2">
                                                <input type="checkbox"
                                                       ${perm1.canRead ? 'checked' : ''}
                                                       class="w-4 h-4 text-[#009DE8] border-gray-300 rounded focus:ring-[#009DE8]"
                                                       data-menu="${menu1.id}" data-crud="R">
                                            </td>
                                            <td class="text-center py-2">
                                                <input type="checkbox"
                                                       ${perm1.canCreate ? 'checked' : ''}
                                                       class="w-4 h-4 text-[#009DE8] border-gray-300 rounded focus:ring-[#009DE8]"
                                                       data-menu="${menu1.id}" data-crud="C">
                                            </td>
                                            <td class="text-center py-2">
                                                <input type="checkbox"
                                                       ${perm1.canUpdate ? 'checked' : ''}
                                                       class="w-4 h-4 text-[#009DE8] border-gray-300 rounded focus:ring-[#009DE8]"
                                                       data-menu="${menu1.id}" data-crud="U">
                                            </td>
                                            <td class="text-center py-2">
                                                <input type="checkbox"
                                                       ${perm1.canDelete ? 'checked' : ''}
                                                       class="w-4 h-4 text-[#009DE8] border-gray-300 rounded focus:ring-[#009DE8]"
                                                       data-menu="${menu1.id}" data-crud="D">
                                            </td>
                                            <td class="py-3 px-4 text-xs text-gray-500">-</td>
                                        </tr>
                                        ${children.map(menu2 => {
                                            const perm2 = currentPermissions.find(p => p.menuId === menu2.id) || {};
                                            return `
                                            <!-- 2depth Menu -->
                                            <tr class="border-b hover:bg-gray-50">
                                                <td class="py-3 px-4 text-sm pl-8">└ ${menu2.name}</td>
                                                <td class="text-center py-2">
                                                    <input type="checkbox"
                                                           ${perm2.canRead ? 'checked' : ''}
                                                           class="w-4 h-4 text-[#009DE8] border-gray-300 rounded focus:ring-[#009DE8]"
                                                           data-menu="${menu2.id}" data-crud="R">
                                                </td>
                                                <td class="text-center py-2">
                                                    <input type="checkbox"
                                                           ${perm2.canCreate ? 'checked' : ''}
                                                           class="w-4 h-4 text-[#009DE8] border-gray-300 rounded focus:ring-[#009DE8]"
                                                           data-menu="${menu2.id}" data-crud="C">
                                                </td>
                                                <td class="text-center py-2">
                                                    <input type="checkbox"
                                                           ${perm2.canUpdate ? 'checked' : ''}
                                                           class="w-4 h-4 text-[#009DE8] border-gray-300 rounded focus:ring-[#009DE8]"
                                                           data-menu="${menu2.id}" data-crud="U">
                                                </td>
                                                <td class="text-center py-2">
                                                    <input type="checkbox"
                                                           ${perm2.canDelete ? 'checked' : ''}
                                                           class="w-4 h-4 text-[#009DE8] border-gray-300 rounded focus:ring-[#009DE8]"
                                                           data-menu="${menu2.id}" data-crud="D">
                                                </td>
                                                <td class="py-3 px-4 text-xs text-gray-500">-</td>
                                            </tr>
                                            `;
                                        }).join('')}
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                    <h3 class="text-lg font-bold text-gray-800">${isEdit ? '공지사항 수정' : '공지사항 작성'}</h3>
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
                    <h3 class="text-lg font-bold text-gray-800">${titleMap[type]} 편집</h3>
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
