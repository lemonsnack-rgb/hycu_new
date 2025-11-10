// ==================== 학술지 심사 ====================

function renderJournalReview() {
    const content = document.getElementById('main-content');
    if (!content) return;
    
    const reviews = [
        {
            id: 1,
            journal: '교육공학연구',
            title: 'AI 기반 학습분석 시스템의 교육적 효과성 연구',
            author: '홍길동',
            affiliation: 'OO대학교',
            submissionDate: '2025-10-15',
            deadline: '2025-12-15',
            status: '심사 대기',
            priority: 'high'
        },
        {
            id: 2,
            journal: '한국교육학연구',
            title: '메타버스 기반 교육환경이 학습몰입도에 미치는 영향',
            author: '김철수',
            affiliation: 'XX대학교',
            submissionDate: '2025-10-20',
            deadline: '2025-12-20',
            status: '심사중',
            priority: 'medium'
        },
        {
            id: 3,
            journal: '교육방법연구',
            title: '플립러닝 수업설계 모형 개발 연구',
            author: '이영희',
            affiliation: '△△대학교',
            submissionDate: '2025-09-25',
            deadline: '2025-11-25',
            status: '심사 완료',
            priority: 'low'
        }
    ];
    
    content.innerHTML = `
        <div class="container mx-auto p-6">
            <!-- 헤더 -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-6 border-b">
                    <h2 class="text-2xl font-bold text-gray-800">학술지 심사</h2>
                    <p class="text-sm text-gray-600 mt-2">
                        학술지로부터 의뢰받은 논문 심사를 진행합니다
                    </p>
                </div>
                
                <!-- 통계 -->
                <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-red-50 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold text-red-600">1</div>
                        <div class="text-sm text-gray-600 mt-1">심사 대기</div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold text-blue-600">1</div>
                        <div class="text-sm text-gray-600 mt-1">심사중</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold text-green-600">1</div>
                        <div class="text-sm text-gray-600 mt-1">심사 완료</div>
                    </div>
                </div>
            </div>
            
            <!-- 심사 목록 -->
            <div class="bg-white rounded-lg shadow-md">
                <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">심사 요청 목록</h3>
                    
                    <div class="space-y-4">
                        ${reviews.map(review => `
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                 onclick="viewJournalReviewDetail(${review.id})">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="text-xs px-2 py-1 rounded ${
                                                review.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                review.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }">
                                                ${review.priority === 'high' ? '긴급' : review.priority === 'medium' ? '보통' : '낮음'}
                                            </span>
                                            <span class="text-xs px-2 py-1 rounded ${
                                                review.status === '심사 대기' ? 'bg-red-100 text-red-700' :
                                                review.status === '심사중' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }">
                                                ${review.status}
                                            </span>
                                        </div>
                                        <h4 class="font-semibold text-gray-800 mb-2">${review.title}</h4>
                                        <div class="flex items-center gap-4 text-sm text-gray-600">
                                            <span><i class="fas fa-book"></i> ${review.journal}</span>
                                            <span><i class="fas fa-user"></i> ${review.author} (${review.affiliation})</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <div class="text-gray-600">
                                        <span>접수일: ${review.submissionDate}</span>
                                    </div>
                                    <div class="text-red-600 font-semibold">
                                        <i class="fas fa-clock"></i> 마감: ${review.deadline}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 학술지 심사 상세
function viewJournalReviewDetail(reviewId) {
    const reviews = [
        {
            id: 1,
            journal: '교육공학연구',
            title: 'AI 기반 학습분석 시스템의 교육적 효과성 연구',
            author: '홍길동',
            affiliation: 'OO대학교',
            submissionDate: '2025-10-15',
            deadline: '2025-12-15',
            status: '심사 대기',
            abstract: '본 연구는 인공지능 기반 학습분석 시스템이 학습자의 학습 성과에 미치는 영향을 실증적으로 분석하고자 하였다. 대학생 120명을 대상으로 12주간 실험을 진행한 결과, AI 기반 시스템을 활용한 집단이 전통적 방식의 집단에 비해 학습성취도가 유의미하게 높게 나타났다.',
            keywords: ['인공지능', '학습분석', '교육공학', '학습성과'],
            pages: 25
        }
    ];
    
    const review = reviews.find(r => r.id === reviewId) || reviews[0];
    
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3>학술지 심사 상세</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 기본 정보 -->
                    <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">기본 정보</h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                            <div>
                                <div style="font-size: 0.75rem; color: #6B7280;">학술지</div>
                                <div style="font-weight: 600; color: #1F2937;">${review.journal}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; color: #6B7280;">저자</div>
                                <div style="font-weight: 600; color: #1F2937;">${review.author} (${review.affiliation})</div>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; color: #6B7280;">접수일</div>
                                <div style="font-weight: 600; color: #1F2937;">${review.submissionDate}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; color: #6B7280;">심사 마감일</div>
                                <div style="font-weight: 600; color: #EF4444;">${review.deadline}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 논문 정보 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">논문 제목</h4>
                        <div style="font-size: 1.125rem; font-weight: 600; color: #1F2937; padding: 1rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">
                            ${review.title}
                        </div>
                    </div>
                    
                    <!-- 초록 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">초록</h4>
                        <div style="padding: 1rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">
                            <p style="font-size: 0.875rem; color: #4B5563; line-height: 1.6;">
                                ${review.abstract}
                            </p>
                        </div>
                    </div>
                    
                    <!-- 키워드 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">키워드</h4>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${review.keywords.map(keyword => `
                                <span style="padding: 0.5rem 1rem; background: #DBEAFE; color: #1E40AF; border-radius: 9999px; font-size: 0.875rem;">
                                    ${keyword}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 파일 정보 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">첨부 파일</h4>
                        <div style="padding: 1rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <i class="fas fa-file-pdf" style="color: #EF4444; margin-right: 0.5rem;"></i>
                                    <span style="font-weight: 500;">${review.title}.pdf</span>
                                    <span style="font-size: 0.875rem; color: #6B7280; margin-left: 0.5rem;">(${review.pages} 페이지)</span>
                                </div>
                                <button onclick="alert('논문 다운로드')" class="btn btn-sm btn-secondary">
                                    <i class="fas fa-download"></i> 다운로드
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="startJournalReview(${review.id})" class="btn btn-primary">
                        <i class="fas fa-edit"></i> 심사 시작
                    </button>
                    <button onclick="closeModal()" class="btn btn-secondary">닫기</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

// 심사 시작
function startJournalReview(reviewId) {
    alert('학술지 심사 작성 화면으로 이동 (추후 구현)');
    closeModal();
}

// 모달 닫기
function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// Export
window.renderJournalReview = renderJournalReview;
window.viewJournalReviewDetail = viewJournalReviewDetail;
window.startJournalReview = startJournalReview;

// ==================== 학술지 대체 심사 관리 (ID 54, 55) ====================

// 샘플 데이터
const JOURNAL_REPLACEMENT_DATA = [
    {
        id: 'JR001',
        year: '2024',
        semester: '2',
        graduateSchool: '일반대학원',
        major: '컴퓨터공학과',
        degree: '석사',
        studentNumber: '2024001',
        studentName: '홍길동',
        semesterOrder: '3',
        studentStatus: '재학',
        journalTitle: 'Artificial Intelligence in Healthcare: A Systematic Review',
        journalName: 'International Journal of Medical Informatics',
        submissionDate: '2024-11-01',
        passStatus: '합격',
        evaluationDate: '2024-11-08'
    },
    {
        id: 'JR002',
        year: '2024',
        semester: '2',
        graduateSchool: '일반대학원',
        major: '경영학과',
        degree: '석사',
        studentNumber: '2024002',
        studentName: '김영희',
        semesterOrder: '4',
        studentStatus: '재학',
        journalTitle: 'Consumer Behavior Analysis in E-commerce: A Big Data Approach',
        journalName: 'Journal of Business Research',
        submissionDate: '2024-10-28',
        passStatus: '심사중',
        evaluationDate: null
    },
    {
        id: 'JR003',
        year: '2024',
        semester: '1',
        graduateSchool: '일반대학원',
        major: '인공지능학과',
        degree: '박사',
        studentNumber: '2023015',
        studentName: '박민수',
        semesterOrder: '4',
        studentStatus: '수료',
        journalTitle: 'Deep Learning for Natural Language Processing: Recent Advances',
        journalName: 'IEEE Transactions on Neural Networks',
        submissionDate: '2024-05-15',
        passStatus: '합격',
        evaluationDate: '2024-06-20'
    }
];

// 목록 렌더링
function renderJournalReplacementList() {
    const listContainer = document.getElementById('journal-review-list');
    const countEl = document.getElementById('journal-count');

    if (!listContainer) return;

    // 필터링
    const filters = getJournalFilters();
    const filteredData = filterJournalData(JOURNAL_REPLACEMENT_DATA, filters);

    // 카운트 업데이트
    if (countEl) {
        countEl.textContent = `총 ${filteredData.length}건`;
    }

    if (filteredData.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
                <p class="text-gray-500">다른 조건으로 검색해보세요.</p>
            </div>
        `;
        return;
    }

    const html = `
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">
                            <input type="checkbox" id="selectAll" onchange="toggleSelectAll(this)">
                        </th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">순번</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학년도</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학기</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">대학원</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">전공</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학위과정</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">학번</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">성명</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학기차</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">학적상태</th>
                        <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600">논문제목</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">제출일자</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">합격여부</th>
                        <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600">평가일자</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${filteredData.map((item, index) => `
                        <tr class="hover:bg-gray-50 cursor-pointer" onclick="showJournalDetail('${item.id}')">
                            <td class="py-3 px-4 text-center" onclick="event.stopPropagation()">
                                <input type="checkbox" class="journal-checkbox" value="${item.id}">
                            </td>
                            <td class="py-3 px-4 text-sm text-gray-600">${index + 1}</td>
                            <td class="py-3 px-4 text-sm text-gray-600 text-center">${item.year}</td>
                            <td class="py-3 px-4 text-sm text-gray-600 text-center">${item.semester}학기</td>
                            <td class="py-3 px-4 text-sm text-gray-600">${item.graduateSchool}</td>
                            <td class="py-3 px-4 text-sm text-gray-600">${item.major}</td>
                            <td class="py-3 px-4 text-sm text-gray-600 text-center">${item.degree}</td>
                            <td class="py-3 px-4 text-sm text-gray-600">${item.studentNumber}</td>
                            <td class="py-3 px-4 text-sm font-medium text-gray-800">${item.studentName}</td>
                            <td class="py-3 px-4 text-sm text-gray-600 text-center">${item.semesterOrder}학기차</td>
                            <td class="py-3 px-4 text-center">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStudentStatusClass(item.studentStatus)}">
                                    ${item.studentStatus}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-sm text-gray-600" style="max-width: 400px;">
                                <div class="truncate" title="${item.journalTitle}">
                                    ${item.journalTitle}
                                </div>
                            </td>
                            <td class="py-3 px-4 text-sm text-gray-600 text-center">${item.submissionDate}</td>
                            <td class="py-3 px-4 text-center">
                                ${getPassStatusBadge(item.passStatus)}
                            </td>
                            <td class="py-3 px-4 text-sm text-gray-600 text-center">${item.evaluationDate || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    listContainer.innerHTML = html;
}

// 필터 가져오기
function getJournalFilters() {
    return {
        year: document.getElementById('journal-filter-year')?.value || '',
        semester: document.getElementById('journal-filter-semester')?.value || '',
        degree: document.getElementById('journal-filter-degree')?.value || '',
        keyword: document.getElementById('journal-filter-keyword')?.value || ''
    };
}

// 데이터 필터링
function filterJournalData(data, filters) {
    return data.filter(item => {
        if (filters.year && item.year !== filters.year) return false;
        if (filters.semester && item.semester !== filters.semester) return false;
        if (filters.degree && item.degree !== filters.degree) return false;

        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            const matchStudent = item.studentName.toLowerCase().includes(keyword);
            const matchNumber = item.studentNumber.includes(keyword);
            if (!matchStudent && !matchNumber) return false;
        }

        return true;
    });
}

// 합격여부 배지
function getPassStatusBadge(status) {
    const statusMap = {
        '합격': 'bg-green-100 text-green-800',
        '불합격': 'bg-red-100 text-red-800',
        '심사중': 'bg-yellow-100 text-yellow-800',
        '보류': 'bg-orange-100 text-orange-800'
    };

    const badgeClass = statusMap[status] || 'bg-gray-100 text-gray-800';

    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">${status}</span>`;
}

// 학적상태 색상 (기존 함수와 동일하지만 재정의)
function getStudentStatusClass(status) {
    const statusMap = {
        '재학': 'bg-green-100 text-green-800',
        '휴학': 'bg-orange-100 text-orange-800',
        '수료': 'bg-blue-100 text-blue-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
}

// 전체 선택/해제
function toggleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.journal-checkbox');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

// 검색
function searchJournalReviews() {
    renderJournalReplacementList();
}

// 상세 보기
function showJournalDetail(journalId) {
    console.log('학술지 대체 심사 상세 보기:', journalId);
    // TODO: P3-T20에서 상세 모달 구현
    alert('학술지 대체 심사 상세 화면은 다음 작업에서 구현될 예정입니다.');
}

// 초기화
function initJournalReplacementReview() {
    renderJournalReplacementList();
}

// Export
window.renderJournalReplacementList = renderJournalReplacementList;
window.searchJournalReviews = searchJournalReviews;
window.showJournalDetail = showJournalDetail;
window.initJournalReplacementReview = initJournalReplacementReview;
window.toggleSelectAll = toggleSelectAll;

console.log('✅ 학술지 심사 모듈 로드 완료');
