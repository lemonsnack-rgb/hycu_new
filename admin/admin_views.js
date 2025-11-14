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
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">연구계획서 제목</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">등록일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.length > 0 ? data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
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
                                    <td class="py-3 px-4 text-sm text-gray-800 max-w-xs truncate" title="${item.thesisTitle || '-'}">
                                        ${item.thesisTitle || '-'}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.submitDate || '-'}</td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewResearchProposalDetail(${item.id})"
                                                class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded">
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="11" class="py-8 text-center text-gray-500">
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
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                                    <input type="checkbox" onclick="toggleAllCheckboxes(this)">
                                </th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정구분</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
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
                                    <td class="py-3 px-4 text-sm text-gray-800 max-w-xs truncate" title="${item.thesisTitle || '미정'}">${item.thesisTitle || '미정'}</td>
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
                                                위원
                                            </button>
                                            <button onclick="viewThesisReviewDetail('${item.id}', 'chair', '${item.submissionType}')"
                                                    class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded">
                                                위원장
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
                            class="bg-[#6A0028] hover:bg-[#5A0020] text-white px-4 py-2 rounded text-sm font-medium">
                        선택 학생에게 알림 발송
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full">
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
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
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.submitDate}</td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-reviewing">${item.status}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewSubmissionDetail(${item.id}, 'thesisPlan')" class="text-[#6A0028] hover:underline text-sm">상세보기</button>
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
                            class="bg-[#6A0028] hover:bg-[#5A0020] text-white px-4 py-2 rounded text-sm font-medium">
                        선택 학생에게 알림 발송
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full">
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
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
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.submitDate}</td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-reviewing">${item.status}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewSubmissionDetail(${item.id}, 'midThesis')" class="text-[#6A0028] hover:underline text-sm">상세보기</button>
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
                            class="bg-[#6A0028] hover:bg-[#5A0020] text-white px-4 py-2 rounded text-sm font-medium">
                        선택 학생에게 알림 발송
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full">
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
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
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.submitDate}</td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-completed">${item.result}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewSubmissionDetail(${item.id}, 'finalThesis')" class="text-[#6A0028] hover:underline text-sm">상세보기</button>
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
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학부/대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과/전공</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정구분</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
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
                                        <td class="py-3 px-4 text-sm font-medium text-gray-800">${journal.studentName}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600" style="max-width: 350px;">
                                            <div class="truncate" title="${journal.paperTitle}">
                                                ${journal.paperTitle}
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-sm text-gray-600" style="max-width: 200px;">
                                            <div class="truncate" title="${journal.journalName}">
                                                ${journal.journalName}
                                            </div>
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
                                                    위원
                                                </button>
                                                <button onclick="viewAdminJournalDetail(${journal.id})"
                                                        class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded hover:bg-green-50">
                                                    위원장
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
                            class="bg-[#6A0028] hover:bg-[#5A0020] text-white px-4 py-2 rounded text-sm font-medium">
                        선택 학생에게 알림 발송
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full">
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
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
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
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
                                        <button onclick="viewJournalDetail(${item.id})" class="text-[#6A0028] hover:underline text-sm">상세보기</button>
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
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학년도</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문지도교수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
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
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
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
                    <table class="min-w-full text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">지도교수</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학기차</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문명</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">제출일시</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">상태</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
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
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.advisor}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.semesterCount || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-700">
                                        <div class="max-w-xs truncate font-medium" title="${item.documentTitle}">
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
                                    <td class="py-3 px-4 text-center">
                                        <button onclick="viewPdfFeedback(${item.id}, true)"
                                                class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded">
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            `}).join('') : `
                                <tr>
                                    <td colspan="12" class="py-8 text-center text-gray-500">
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
                        <button onclick="openScheduleModal()" class="bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            + 일정 추가
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
                    <table id="schedule-table" class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">일정명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">적용대상</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">시작일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">종료일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">설명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map(item => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.target}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.startDate}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.endDate}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.description}</td>
                                    <td class="py-3 px-4 space-x-2">
                                        <button onclick="editSchedule(${item.id})" class="text-blue-600 hover:underline text-sm">수정</button>
                                        <button onclick="deleteSchedule(${item.id})" class="text-red-600 hover:underline text-sm">삭제</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
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
                        <button onclick="openRequirementModal()" class="bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            + 요건 추가
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
                                <option value="">학위 전체</option>
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
                    <table id="requirement-table" class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
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
        const data = appData.stages;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">논문지도 워크플로우 관리</h3>
                        <button onclick="openStageModal()" class="bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            + 워크플로우 추가
                        </button>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-blue-800">
                            <i class="fas fa-info-circle mr-2"></i>
                            학과/학위별 논문 작성 워크플로우를 구성하고 각 단계에 평가표를 연결합니다.
                        </p>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">워크플로우명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학과</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">버전</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계 수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">평가 단계</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">단계 구성</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.version}</td>
                                    <td class="py-3 px-4 text-sm text-center">
                                        <span class="font-semibold text-blue-600">${item.stageCount}단계</span>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-center">
                                        <span class="font-semibold text-green-600">${item.evaluationCount}개 평가</span>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">
                                        <div class="flex items-center gap-1 flex-wrap">
                                            ${item.steps.map((step, stepIdx) => `
                                                <span class="px-2 py-1 rounded text-xs ${
                                                    step.hasEvaluation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }">
                                                    ${step.name}
                                                </span>
                                                ${stepIdx < item.steps.length - 1 ? '<span class="text-gray-400">→</span>' : ''}
                                            `).join('')}
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">
                                        <div class="flex gap-2">
                                            <button onclick="viewStageDetail(${item.id})"
                                                    class="text-blue-600 hover:underline text-sm">
                                                상세보기
                                            </button>
                                            <button onclick="editStage(${item.id})"
                                                    class="text-purple-600 hover:underline text-sm">
                                                수정
                                            </button>
                                            <button onclick="copyStage(${item.id})"
                                                    class="text-green-600 hover:underline text-sm">
                                                복사
                                            </button>
                                            <button onclick="deleteStage(${item.id})"
                                                    class="text-red-600 hover:underline text-sm">
                                                삭제
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

    // ========== 지도 단계 유형 관리 ==========
    typeManagement: () => {
        const data = appData.types;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800">지도 단계 유형 관리 (레고 블록)</h3>
                    <button onclick="openTypeModal()" class="bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                        + 유형 추가
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    ${data.map(item => `
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start mb-3">
                                <h4 class="font-bold text-gray-800">${item.name}</h4>
                                <div class="flex space-x-2">
                                    <button onclick="editType(${item.id})" class="text-blue-600 hover:underline text-xs">수정</button>
                                    <button onclick="deleteType(${item.id})" class="text-red-600 hover:underline text-xs">삭제</button>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center text-sm">
                                    <svg class="w-4 h-4 mr-2 ${item.presentation ? 'text-green-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.presentation ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"></path>
                                    </svg>
                                    <span class="text-gray-600">발표 필요</span>
                                </div>
                                <div class="flex items-center text-sm">
                                    <svg class="w-4 h-4 mr-2 ${item.document ? 'text-green-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.document ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"></path>
                                    </svg>
                                    <span class="text-gray-600">문서 제출 필요</span>
                                </div>
                            </div>
                            ${item.description ? `
                                <p class="mt-3 text-xs text-gray-500 border-t pt-2">${item.description}</p>
                            ` : ''}
                        </div>
                    `).join('')}
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
                        <h3 class="text-lg font-bold text-gray-800">평가 기준 관리</h3>
                        <button onclick="addEvaluationCriteria()" class="bg-[#6A0028] text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-sm">
                            + 평가표 추가
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
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">번호</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">평가표명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">유형</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">평가항목 수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => {
                                const itemCount = Array.isArray(item.items) ? item.items.length : 0;

                                // 유형 표시 로직 개선
                                let typeClass, typeName;
                                if (item.type === 'passfail') {
                                    typeClass = 'bg-green-100 text-green-800';
                                    typeName = 'Pass/Fail형';
                                } else if (item.type === 'grade') {
                                    typeClass = 'bg-purple-100 text-purple-800';
                                    typeName = '등급형';
                                } else {
                                    typeClass = 'bg-blue-100 text-blue-800';
                                    typeName = '점수형';
                                }

                                return `
                                    <tr class="hover:bg-gray-50">
                                        <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                        <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                        <td class="py-3 px-4 text-sm text-gray-600">
                                            <span class="px-2 py-1 text-xs rounded-full ${typeClass}">
                                                ${typeName}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 text-sm text-center">
                                            <span class="font-semibold text-blue-600">${itemCount}개</span>
                                        </td>
                                        <td class="py-3 px-4">
                                            <div class="flex gap-2">
                                                <button onclick="viewEvaluationDetail(${item.id})"
                                                        class="text-blue-600 hover:underline text-sm">
                                                    관리
                                                </button>
                                                <button onclick="deleteEvaluationCriteria(${item.id})"
                                                        class="text-red-600 hover:underline text-sm">
                                                    삭제
                                                </button>
                                            </div>
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

    // ========== 논문 제목 변경 신청 관리 ==========
    titleChangeRequests: () => {
        const data = appData.titleChangeRequests;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">논문 제목 변경 신청 관리</h3>

                    <!-- 검색 메뉴 (학위논문 심사관리와 동일하되 심사구분, 심사일, 심사상태 제거) -->
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

                            <!-- 5. 상태 -->
                            <div class="search-field">
                                <label class="search-label">상태</label>
                                <select id="title-search-status" class="search-select">
                                    <option value="">전체</option>
                                    <option value="대기">대기</option>
                                    <option value="승인">승인</option>
                                </select>
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
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정구분</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">현재 논문 제목</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">변경 논문 제목</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">신청일</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">상태</th>
                                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.length > 0 ? data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600 max-w-xs">
                                        <div class="truncate" title="${item.currentTitle}">
                                            ${item.currentTitle}
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600 max-w-xs">
                                        <div class="truncate" title="${item.newTitle}">
                                            ${item.newTitle}
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-center text-sm text-gray-600">${item.requestDate || '-'}</td>
                                    <td class="py-3 px-4 text-center">
                                        <span class="text-xs px-3 py-1.5 rounded-full ${
                                            item.status === '승인' ? 'bg-green-100 text-green-700' :
                                            item.status === '대기' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }">
                                            ${item.status}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <button onclick="viewTitleChangeDetail(${item.id})"
                                                class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded hover:bg-blue-50">
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="11" class="py-8 text-center text-gray-500">
                                        논문 제목 변경 신청 내역이 없습니다.
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
                        <svg class="w-6 h-6 text-[#6A0028] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                               class="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
                        <input type="text" id="search-employee-name" placeholder="예: 김직원"
                               class="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#6A0028]">
                        <button onclick="searchEmployee()"
                                class="bg-[#6A0028] text-white px-4 py-2 rounded text-sm hover:bg-[#5A0020] flex items-center justify-center gap-2">
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
                        <svg class="w-6 h-6 text-[#6A0028] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <!-- 대리로그인 섹션 -->
                <div class="p-6 mt-6 border-t-4 border-[#6A0028]">
                    <div class="flex items-center mb-4">
                        <svg class="w-6 h-6 text-[#6A0028] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                        </svg>
                        <h3 class="text-lg font-bold text-gray-800">대리로그인</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">
                        시스템을 이용하는 교수 또는 학생의 계정으로 대리 로그인하여 화면을 확인할 수 있습니다.
                    </p>

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
                        <table class="w-full border-collapse bg-white">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">구분</th>
                                    <th class="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">학번/교번</th>
                                    <th class="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">이름</th>
                                    <th class="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">대학원</th>
                                    <th class="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">학과/전공</th>
                                    <th class="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">이메일</th>
                                    <th class="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 w-32">액션</th>
                                </tr>
                            </thead>
                            <tbody id="proxy-login-table-body">
                                ${(appData.systemUsers || []).map(user => `
                                    <tr class="hover:bg-gray-50 proxy-login-row"
                                        data-type="${user.type}"
                                        data-search="${user.name} ${user.type === '교수' ? user.employeeId : user.studentId}">
                                        <td class="border border-gray-200 px-4 py-3 text-sm">
                                            <span class="px-2 py-1 rounded-full text-xs font-medium ${user.type === '교수' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                                                ${user.type}
                                            </span>
                                        </td>
                                        <td class="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                                            ${user.type === '교수' ? user.employeeId : user.studentId}
                                        </td>
                                        <td class="border border-gray-200 px-4 py-3 text-sm text-gray-900">${user.name}</td>
                                        <td class="border border-gray-200 px-4 py-3 text-sm text-gray-700">${user.graduate}</td>
                                        <td class="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                            ${user.type === '교수' ? user.department : `${user.major}${user.degree ? ` (${user.degree})` : ''}`}
                                        </td>
                                        <td class="border border-gray-200 px-4 py-3 text-sm text-gray-600">${user.email}</td>
                                        <td class="border border-gray-200 px-4 py-3 text-center">
                                            <button onclick="proxyLogin('${user.id}', '${user.type}', '${user.name}', '${user.loginUrl}')"
                                                    class="bg-[#6A0028] text-white px-4 py-1.5 rounded text-xs hover:bg-[#5A0020] flex items-center gap-1 mx-auto">
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
};
