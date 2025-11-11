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

console.log('✅ 학술지 심사 모듈 로드 완료');
