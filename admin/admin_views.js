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

    // ========== 연구계획서 제출 현황 ==========
    researchProposal: () => {
        // 필터링된 데이터 또는 원본 데이터 사용
        const data = appData.submissions.researchProposal;
        return `
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">연구계획서 제출 현황</h3>
                    
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

                            <!-- 3. 승인여부 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    승인여부
                                </label>
                                <select id="search-approval" class="search-select">
                                    <option value="">전체</option>
                                    <option value="승인대기">승인대기</option>
                                    <option value="승인완료">승인완료</option>
                                </select>
                            </div>

                            <!-- 4. 학번 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    학번
                                </label>
                                <input type="text" id="search-student-id" placeholder="학번 입력"
                                       class="search-input">
                            </div>

                            <!-- 5. 성명 -->
                            <div class="search-field">
                                <label class="search-label" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">
                                    성명
                                </label>
                                <input type="text" id="search-student-name" placeholder="성명 입력"
                                       class="search-input">
                            </div>

                            <!-- 6. 학과/전공 -->
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

                            <!-- 7. 학위과정 -->
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                                    <input type="checkbox" onclick="toggleAllCheckboxes(this)">
                                </th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학위과정</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학기차</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">휴대전화</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">이메일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학적상태</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">상태</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">관리</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4">
                                        <input type="checkbox" value="${item.id}">
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.graduate || '일반대학원'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.major}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.degree}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.studentId}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">
                                        ${addStudentInfoIcon(item.studentName, item.studentId)}
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.semesterCount || '-'}학기</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.phone || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.email || '-'}</td>
                                    <td class="py-3 px-4 text-sm text-gray-800">${item.studentStatus || '재학'}</td>
                                    <td class="py-3 px-4">
                                        <span class="status-badge status-${item.status}">
                                            ${item.status}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <button onclick="viewSubmissionDetail(${item.id}, 'researchProposal')" class="text-[#6A0028] hover:underline text-sm">상세보기</button>
                                    </td>
                                </tr>
                            `).join('')}
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
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
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
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
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
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
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
                                            <button onclick="viewAdminJournalDetail(${journal.id})"
                                                    class="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 border border-blue-300 rounded hover:bg-blue-50">
                                                조회
                                            </button>
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
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">액션</th>
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">액션</th>
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">액션</th>
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
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">설명</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">평가항목 수</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">총점</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">생성일</th>
                                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">액션</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map((item, idx) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-3 px-4 text-sm text-gray-600">${idx + 1}</td>
                                    <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.name}</td>
                                    <td class="py-3 px-4 text-sm text-gray-600">
                                        <div class="max-w-md">${item.description}</div>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-center">
                                        <span class="font-semibold text-blue-600">${item.itemCount}개</span>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-center">
                                        <span class="font-semibold text-green-600">${item.totalScore}점</span>
                                    </td>
                                    <td class="py-3 px-4 text-sm text-gray-600">${item.createdDate}</td>
                                    <td class="py-3 px-4">
                                        <div class="flex gap-2">
                                            <button onclick="viewEvaluationDetail(${item.id})" 
                                                    class="text-blue-600 hover:underline text-sm">
                                                상세보기
                                            </button>
                                            <button onclick="copyEvaluationCriteria(${item.id})" 
                                                    class="text-green-600 hover:underline text-sm">
                                                복사
                                            </button>
                                            <button onclick="deleteEvaluationCriteria(${item.id})" 
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

    // ========== 주차별 지도 관리 ==========
    weeklyGuidance: () => {
        const data = appData.weeklyGuidance;
        return `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold mb-6">주차별 지도 관리</h2>

                <!-- 필터 -->
                <div class="search-container">
                    <div class="search-grid">
                        <div>
                            <label class="block text-sm font-medium mb-2">학기</label>
                            <select id="semesterFilter" onchange="filterGuidancePairs()"
                                    class="search-select">
                                <option value="">전체</option>
                                <option value="2024-2학기">2024-2학기</option>
                                <option value="2024-1학기">2024-1학기</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">상태</label>
                            <select id="statusFilter" onchange="filterGuidancePairs()"
                                    class="search-select">
                                <option value="">전체</option>
                                <option value="active">진행중</option>
                                <option value="completed">완료</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">교수명</label>
                            <input type="text" id="professorSearch"
                                   class="search-input"
                                   placeholder="교수명 입력">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">학생명</label>
                            <input type="text" id="studentSearch"
                                   class="search-input"
                                   placeholder="학생명 입력">
                        </div>
                    </div>
                    <div class="search-buttons">
                        <button onclick="filterGuidancePairs()" class="search-btn search-btn-primary">
                            <i class="fas fa-search"></i> 검색
                        </button>
                        <button onclick="resetGuidancePairsFilter()" class="search-btn search-btn-secondary">
                            <i class="fas fa-redo"></i> 초기화
                        </button>
                    </div>
                </div>

                <!-- 목록 테이블 -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="py-3 px-4 text-left">교수명</th>
                                <th class="py-3 px-4 text-left">학생명</th>
                                <th class="py-3 px-4 text-left">학번</th>
                                <th class="py-3 px-4 text-left">학기</th>
                                <th class="py-3 px-4 text-left">진행률</th>
                                <th class="py-3 px-4 text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody id="guidancePairsTableBody">
                            ${data.guidancePairs.map(pair => `
                                <tr class="border-t hover:bg-gray-50">
                                    <td class="py-3 px-4">
                                        <div>
                                            <p class="font-medium">${pair.professor.name}</p>
                                            <p class="text-xs text-gray-500">${pair.professor.department}</p>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">
                                        <div>
                                            <p class="font-medium">${pair.student.name}</p>
                                            <p class="text-xs text-gray-500">${pair.student.major}</p>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">${pair.student.studentId}</td>
                                    <td class="py-3 px-4">${pair.semester}</td>
                                    <td class="py-3 px-4">
                                        <div class="flex items-center">
                                            <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                                <div class="bg-blue-600 h-2 rounded-full"
                                                     style="width: ${(pair.completedWeeks/pair.totalWeeks*100)}%"></div>
                                            </div>
                                            <span class="text-sm">${pair.completedWeeks}/${pair.totalWeeks}주차</span>
                                        </div>
                                        <p class="text-xs text-gray-500 mt-1">최종 업데이트: ${pair.lastUpdateDate}</p>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <button onclick="viewWeeklyGuidanceDetail(${pair.id})"
                                                class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
};
