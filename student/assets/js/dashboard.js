// ==================== 대시보드 ====================

function renderDashboard() {
    const requirements = DataService.getGraduationRequirements();

    const content = document.getElementById('dashboard-screen');
    if (!content) return;

    content.innerHTML = `
        <!-- 논문 작성 진행 단계 -->
        <div class="card mb-6">
            <div class="card-header">
                <h3 style="font-size: 1.125rem; font-weight: 600; color: #1F2937;">
                    🎯 논문 작성 진행 단계
                </h3>
                <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">
                    현재 진행 중인 논문 작성 단계를 확인하세요
                </p>
            </div>
            <div class="card-body" style="padding: 1.5rem;">
                ${renderWorkflowSteps(requirements)}
            </div>
        </div>
    `;
}

// 졸업 요건 상세보기 모달
function showRequirementsModal() {
    const requirements = DataService.getGraduationRequirements();
    const student = DataService.getStudent();
    
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>졸업 요건 상세</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 0.5rem;">
                            ${student.major} ${student.program} 졸업 요건
                        </h4>
                        <p style="font-size: 0.875rem; color: #6B7280;">
                            학생: ${student.name} (${student.id})
                        </p>
                    </div>
                    
                    ${requirements.map((req, index) => `
                        <div style="padding: 1.5rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                                <span style="font-size: 1.5rem; margin-right: 0.75rem;">${req.icon}</span>
                                <div style="flex: 1;">
                                    <h5 style="font-weight: 600; color: #1F2937;">${index + 1}. ${req.name}</h5>
                                    <span class="badge ${req.completed ? 'badge-success' : req.status === '진행중' ? 'badge-info' : 'badge-gray'}">
                                        ${req.status}
                                    </span>
                                </div>
                            </div>
                            
                            ${req.type === 'credits' ? `
                                <div style="font-size: 0.875rem; color: #6B7280;">
                                    <p>• 필수: ${req.required}학점 이상</p>
                                    <p>• 현재: ${req.current}학점 (${Math.round(req.current/req.required*100)}%)</p>
                                    <p>• 남은 학점: ${req.required - req.current}학점</p>
                                    <p>• 이수 예정: 2025-2학기</p>
                                </div>
                            ` : req.type === 'review' ? `
                                <div style="font-size: 0.875rem; color: #6B7280;">
                                    ${req.completed ? `
                                        <p>• 신청일: ${req.applicationDate || '-'}</p>
                                        <p>• 심사일: ${req.approvalDate || '-'}</p>
                                        <p>• 결과: 승인 (${req.score}점)</p>
                                    ` : req.status === '심사중' ? `
                                        <p>• 상태: 심사 진행중</p>
                                        <p>• 진행률: ${req.progress}%</p>
                                        <p>• 예상 완료일: 2025-11-15</p>
                                    ` : `
                                        <p>• 필수: 통과 필요</p>
                                        <p>• 예정일: 2026-02-15</p>
                                    `}
                                </div>
                            ` : req.type === 'activity' ? `
                                <div style="font-size: 0.875rem; color: #6B7280;">
                                    <p>• 필수: ${req.required}건 이상</p>
                                    <p>• 완료: ${req.current}건</p>
                                    <p>• 필요: ${req.required - req.current}건 추가</p>
                                    ${req.current > 0 ? `<p>• 완료 항목: 국내학술대회 발표 (2025-09-20)</p>` : ''}
                                </div>
                            ` : `
                                <div style="font-size: 0.875rem; color: #6B7280;">
                                    <p>• 권장: KCI 등재지 이상</p>
                                    <p>• 상태: ${req.status}</p>
                                </div>
                            `}
                        </div>
                    `).join('')}
                    
                    <div style="background: #EFF6FF; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3B82F6;">
                        <p style="font-weight: 600; color: #1E40AF; margin-bottom: 0.5rem;">
                            📌 전체 완료율: 약 ${DataService.calculateProgress()}%
                        </p>
                        <p style="font-size: 0.875rem; color: #1E40AF;">
                            현재 ${requirements.filter(r => r.completed).length}/${requirements.length}개 항목 완료
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-secondary">확인</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

// Zoom 미팅 참여
function joinMeeting(zoomLink) {
    window.open(zoomLink, '_blank');
}

// 날짜/시간 포맷 함수
function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day} (${weekday}) ${hours}:${minutes}`;
}

function formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

// ID 59: 워크플로우 진행단계 렌더링
function renderWorkflowSteps(requirements) {
    const steps = [
        {
            name: '연구계획서',
            requirement: requirements.find(r => r.name === '연구계획서 심사'),
            icon: '📄'
        },
        {
            name: '중간논문',
            requirement: requirements.find(r => r.name === '중간논문 심사'),
            icon: '📝'
        },
        {
            name: '최종논문',
            requirement: requirements.find(r => r.name === '최종논문 심사'),
            icon: '📘'
        }
    ];
    
    return `
        <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
            ${steps.map((step, index) => {
                const req = step.requirement;
                const isCompleted = req?.completed;
                const isInProgress = req?.status === '심사중' || req?.status === '진행중';
                const isWaiting = !isCompleted && !isInProgress;
                
                let statusColor, statusBg, statusText, statusBorder;
                if (isCompleted) {
                    statusColor = '#059669';
                    statusBg = '#D1FAE5';
                    statusText = '완료';
                    statusBorder = '#10B981';
                } else if (isInProgress) {
                    statusColor = '#2563EB';
                    statusBg = '#DBEAFE';
                    statusText = '진행중';
                    statusBorder = '#3B82F6';
                } else {
                    statusColor = '#6B7280';
                    statusBg = '#F3F4F6';
                    statusText = '대기';
                    statusBorder = '#D1D5DB';
                }
                
                return `
                    <!-- 단계 ${index + 1} -->
                    <div style="flex: 1; text-align: center; position: relative; z-index: 1;">
                        <div style="display: inline-flex; flex-direction: column; align-items: center;">
                            <!-- 아이콘 원 -->
                            <div style="
                                width: 80px; 
                                height: 80px; 
                                border-radius: 50%; 
                                background: ${statusBg}; 
                                border: 3px solid ${statusBorder}; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: 2rem;
                                margin-bottom: 0.75rem;
                                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                            ">
                                ${step.icon}
                            </div>
                            
                            <!-- 단계명 -->
                            <div style="font-weight: 700; color: #1F2937; margin-bottom: 0.25rem; font-size: 1rem;">
                                ${step.name}
                            </div>
                            
                            <!-- 상태 -->
                            <div style="
                                display: inline-block;
                                padding: 0.25rem 0.75rem;
                                border-radius: 9999px;
                                background: ${statusBg};
                                color: ${statusColor};
                                font-size: 0.75rem;
                                font-weight: 600;
                                margin-bottom: 0.5rem;
                            ">
                                ${statusText}
                            </div>
                            
                            <!-- 상세 정보 -->
                            ${req?.details ? `
                                <div style="font-size: 0.75rem; color: #6B7280;">
                                    ${req.details}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- 연결선 -->
                    ${index < steps.length - 1 ? `
                        <div style="flex: 0 0 60px; height: 3px; background: ${isCompleted ? '#10B981' : '#E5E7EB'}; margin: 0 -10px; align-self: center; margin-top: -80px;"></div>
                    ` : ''}
                `;
            }).join('')}
        </div>
    `;
}

window.renderWorkflowSteps = renderWorkflowSteps;

// ID 59: 워크플로우 전체 화면 렌더링
function renderWorkflow() {
    const requirements = DataService.getGraduationRequirements();
    const content = document.getElementById('workflow-screen');
    if (!content) return;

    content.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 style="font-size: 1.5rem; font-weight: 700; color: #1F2937;">
                    🎯 논문 작성 진행 단계
                </h3>
                <p style="font-size: 1rem; color: #6B7280; margin-top: 0.5rem;">
                    논문 작성의 전체 과정을 한눈에 확인하고, 각 단계별 진행 상황을 추적하세요
                </p>
            </div>
            <div class="card-body" style="padding: 2.5rem;">
                ${renderWorkflowSteps(requirements)}

                <!-- 단계별 상세 정보 -->
                <div style="margin-top: 3rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
                    ${['연구계획서 심사', '중간논문 심사', '최종논문 심사'].map((reqName, index) => {
                        const req = requirements.find(r => r.name === reqName);
                        const icons = ['📄', '📝', '📘'];
                        const titles = ['연구계획서', '중간논문', '최종논문'];

                        return `
                            <div style="border: 2px solid ${req?.completed ? '#10B981' : req?.status === '심사중' || req?.status === '진행중' ? '#3B82F6' : '#E5E7EB'}; border-radius: 0.75rem; padding: 1.5rem; background: white;">
                                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                                    <span style="font-size: 2rem; margin-right: 0.75rem;">${icons[index]}</span>
                                    <div>
                                        <h4 style="font-weight: 600; font-size: 1.125rem; color: #1F2937; margin: 0;">
                                            ${titles[index]}
                                        </h4>
                                        <span style="
                                            display: inline-block;
                                            margin-top: 0.25rem;
                                            padding: 0.25rem 0.75rem;
                                            border-radius: 9999px;
                                            font-size: 0.75rem;
                                            font-weight: 600;
                                            ${req?.completed ? 'background: #D1FAE5; color: #065F46;' :
                                              req?.status === '심사중' || req?.status === '진행중' ? 'background: #DBEAFE; color: #1E40AF;' :
                                              'background: #F3F4F6; color: #6B7280;'}
                                        ">
                                            ${req?.completed ? '완료' : req?.status === '심사중' || req?.status === '진행중' ? '진행중' : '대기'}
                                        </span>
                                    </div>
                                </div>

                                <div style="font-size: 0.875rem; color: #6B7280; line-height: 1.6;">
                                    ${req?.completed ? `
                                        <div style="margin-bottom: 0.5rem;">
                                            <strong style="color: #1F2937;">✓ 승인 완료</strong>
                                        </div>
                                        <div>신청일: ${req.applicationDate || '-'}</div>
                                        <div>승인일: ${req.approvalDate || '-'}</div>
                                        ${req.score ? `<div>점수: ${req.score}점</div>` : ''}
                                    ` : req?.status === '심사중' || req?.status === '진행중' ? `
                                        <div style="margin-bottom: 0.5rem;">
                                            <strong style="color: #1F2937;">⚡ 심사 진행 중</strong>
                                        </div>
                                        <div>진행률: ${req.progress || 0}%</div>
                                        <div>예상 완료: ${req.expectedDate || '-'}</div>
                                    ` : `
                                        <div style="margin-bottom: 0.5rem;">
                                            <strong style="color: #1F2937;">⏳ 대기 중</strong>
                                        </div>
                                        <div>이전 단계 완료 후 진행 가능</div>
                                        <div>예정일: ${req?.expectedDate || '미정'}</div>
                                    `}
                                </div>

                                ${req?.completed || req?.status === '심사중' || req?.status === '진행중' ? `
                                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #E5E7EB;">
                                        <button onclick="showScreen('review')" class="btn btn-sm btn-outline" style="width: 100%; padding: 0.5rem; font-size: 0.875rem;">
                                            ${req?.completed ? '📋 심사 결과 보기' : '📝 심사 진행 확인'}
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- 전체 진행 현황 -->
                <div style="margin-top: 2.5rem; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0.75rem; color: white; text-align: center;">
                    <div style="font-size: 0.875rem; margin-bottom: 0.5rem; opacity: 0.9;">전체 진행률</div>
                    <div style="font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem;">
                        ${Math.round((requirements.filter(r => ['연구계획서 심사', '중간논문 심사', '최종논문 심사'].includes(r.name) && r.completed).length / 3) * 100)}%
                    </div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">
                        ${requirements.filter(r => ['연구계획서 심사', '중간논문 심사', '최종논문 심사'].includes(r.name) && r.completed).length} / 3 단계 완료
                    </div>
                    <div style="margin-top: 1.5rem; background: rgba(255,255,255,0.2); height: 8px; border-radius: 9999px; overflow: hidden;">
                        <div style="background: white; height: 100%; width: ${Math.round((requirements.filter(r => ['연구계획서 심사', '중간논문 심사', '최종논문 심사'].includes(r.name) && r.completed).length / 3) * 100)}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>

                <!-- 도움말 -->
                <div style="margin-top: 2rem; padding: 1.5rem; background: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 0.5rem;">
                    <h4 style="font-weight: 600; color: #1E40AF; margin: 0 0 0.75rem 0; font-size: 1rem;">
                        💡 논문 진행 가이드
                    </h4>
                    <ul style="margin: 0; padding-left: 1.5rem; color: #1E40AF; font-size: 0.875rem; line-height: 1.8;">
                        <li>각 단계는 순차적으로 진행되며, 이전 단계 승인 후 다음 단계를 시작할 수 있습니다</li>
                        <li>심사 신청은 '심사 신청' 메뉴에서 진행할 수 있습니다</li>
                        <li>각 단계별 피드백은 '온라인 피드백' 메뉴에서 확인할 수 있습니다</li>
                        <li>문의사항이 있으시면 지도교수님께 미팅을 요청하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

window.renderWorkflow = renderWorkflow;

// ========== 학적 변동 이력 ==========

function showAcademicHistory() {
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>학적 변동 이력</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 기본 정보 -->
                    <div style="background: #F9FAFB; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
                            <div>
                                <div style="font-size: 0.75rem; color: #6B7280;">학번</div>
                                <div style="font-weight: 600;">2024001</div>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; color: #6B7280;">성명</div>
                                <div style="font-weight: 600;">홍길동</div>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; color: #6B7280;">전공</div>
                                <div style="font-weight: 600;">교육공학</div>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; color: #6B7280;">학위</div>
                                <div style="font-weight: 600;">석사</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 학적 이력 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; margin-bottom: 1rem;">학적 변동 내역</h4>
                        <div style="border-left: 3px solid #6A0028; padding-left: 1rem;">
                            <div style="margin-bottom: 1.5rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span style="font-weight: 600; color: #6A0028;">입학</span>
                                    <span style="font-size: 0.875rem; color: #6B7280;">2024-03-02</span>
                                </div>
                                <div style="font-size: 0.875rem; color: #6B7280;">
                                    2024학년도 1학기 신입생 입학
                                </div>
                            </div>
                            <div style="margin-bottom: 1.5rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span style="font-weight: 600; color: #3B82F6;">재학</span>
                                    <span style="font-size: 0.875rem; color: #6B7280;">현재</span>
                                </div>
                                <div style="font-size: 0.875rem; color: #6B7280;">
                                    정상 재학 중
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 학기별 등록 -->
                    <div>
                        <h4 style="font-weight: 600; margin-bottom: 1rem;">학기별 등록 현황</h4>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>학기</th>
                                    <th>상태</th>
                                    <th>이수학점</th>
                                    <th>평점</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2024-1</td>
                                    <td><span class="badge badge-success">이수완료</span></td>
                                    <td>9학점</td>
                                    <td>4.2</td>
                                </tr>
                                <tr>
                                    <td>2024-2</td>
                                    <td><span class="badge badge-success">이수완료</span></td>
                                    <td>9학점</td>
                                    <td>4.0</td>
                                </tr>
                                <tr>
                                    <td>2025-1</td>
                                    <td><span class="badge badge-info">재학중</span></td>
                                    <td>6학점</td>
                                    <td>진행중</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

window.showAcademicHistory = showAcademicHistory;

console.log('✅ 학적 변동 이력 기능 로드 완료');

// ========== 졸업 요건 상세 분석 ==========

function showDetailedGraduationRequirements() {
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3>졸업 요건 상세 분석</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 전체 진행률 -->
                    <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0.5rem; color: white; margin-bottom: 2rem;">
                        <div style="font-size: 0.875rem; margin-bottom: 0.5rem; opacity: 0.9;">전체 졸업 요건 달성률</div>
                        <div style="font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem;">75%</div>
                        <div style="font-size: 0.875rem; opacity: 0.9;">4개 중 3개 항목 완료</div>
                    </div>
                    
                    <!-- 세부 요건 -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                        <!-- 학점 이수 -->
                        <div style="border: 2px solid #10B981; border-radius: 0.5rem; padding: 1rem;">
                            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">학점 이수</div>
                                    <div style="font-size: 0.75rem; color: #6B7280;">최소 24학점 이수</div>
                                </div>
                                <span style="font-size: 2rem; color: #10B981;">✓</span>
                            </div>
                            <div style="background: #D1FAE5; padding: 0.75rem; border-radius: 0.375rem;">
                                <div style="font-size: 1.25rem; font-weight: 700; color: #065F46;">24 / 24 학점</div>
                                <div class="progress-bar" style="margin-top: 0.5rem;">
                                    <div class="progress-fill" style="width: 100%; background: #10B981;"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 평점 -->
                        <div style="border: 2px solid #10B981; border-radius: 0.5rem; padding: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">평점 유지</div>
                                    <div style="font-size: 0.75rem; color: #6B7280;">3.0 이상</div>
                                </div>
                                <span style="font-size: 2rem; color: #10B981;">✓</span>
                            </div>
                            <div style="background: #D1FAE5; padding: 0.75rem; border-radius: 0.375rem;">
                                <div style="font-size: 1.25rem; font-weight: 700; color: #065F46;">4.1 / 4.5</div>
                                <div class="progress-bar" style="margin-top: 0.5rem;">
                                    <div class="progress-fill" style="width: 91%; background: #10B981;"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 논문 -->
                        <div style="border: 2px solid #10B981; border-radius: 0.5rem; padding: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">논문 심사</div>
                                    <div style="font-size: 0.75rem; color: #6B7280;">계획서 + 중간 + 최종</div>
                                </div>
                                <span style="font-size: 2rem; color: #10B981;">✓</span>
                            </div>
                            <div style="background: #D1FAE5; padding: 0.75rem; border-radius: 0.375rem;">
                                <div style="font-size: 0.875rem; color: #065F46; margin-bottom: 0.5rem;">
                                    ✓ 연구계획서 승인<br>
                                    ✓ 중간논문 심사중<br>
                                    ○ 최종논문 대기
                                </div>
                            </div>
                        </div>
                        
                        <!-- 학술활동 -->
                        <div style="border: 2px solid #F59E0B; border-radius: 0.5rem; padding: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">학술활동</div>
                                    <div style="font-size: 0.75rem; color: #6B7280;">최소 2건</div>
                                </div>
                                <span style="font-size: 2rem; color: #F59E0B;">!</span>
                            </div>
                            <div style="background: #FEF3C7; padding: 0.75rem; border-radius: 0.375rem;">
                                <div style="font-size: 1.25rem; font-weight: 700; color: #92400E;">1 / 2 건</div>
                                <div class="progress-bar" style="margin-top: 0.5rem;">
                                    <div class="progress-fill" style="width: 50%; background: #F59E0B;"></div>
                                </div>
                                <div style="font-size: 0.75rem; color: #92400E; margin-top: 0.5rem;">
                                    1건 추가 필요
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 이수 과목 상세 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; margin-bottom: 1rem;">이수 과목 상세</h4>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>학기</th>
                                    <th>과목명</th>
                                    <th>학점</th>
                                    <th>성적</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2024-1</td>
                                    <td>교육공학 연구방법론</td>
                                    <td>3</td>
                                    <td>A+</td>
                                </tr>
                                <tr>
                                    <td>2024-1</td>
                                    <td>학습이론</td>
                                    <td>3</td>
                                    <td>A+</td>
                                </tr>
                                <tr>
                                    <td>2024-1</td>
                                    <td>교육통계</td>
                                    <td>3</td>
                                    <td>A0</td>
                                </tr>
                                <tr>
                                    <td>2024-2</td>
                                    <td>교육프로그램 개발</td>
                                    <td>3</td>
                                    <td>A+</td>
                                </tr>
                                <tr>
                                    <td>2024-2</td>
                                    <td>교수설계이론</td>
                                    <td>3</td>
                                    <td>A0</td>
                                </tr>
                                <tr>
                                    <td>2024-2</td>
                                    <td>교육평가</td>
                                    <td>3</td>
                                    <td>A0</td>
                                </tr>
                                <tr>
                                    <td>2025-1</td>
                                    <td>논문작성법</td>
                                    <td>3</td>
                                    <td>진행중</td>
                                </tr>
                                <tr>
                                    <td>2025-1</td>
                                    <td>질적연구방법론</td>
                                    <td>3</td>
                                    <td>진행중</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- 졸업 예정 -->
                    <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 1rem; border-radius: 0.375rem;">
                        <div style="font-weight: 600; color: #1E40AF; margin-bottom: 0.5rem;">졸업 예정 시기</div>
                        <div style="font-size: 0.875rem; color: #1E3A8A;">
                            학술활동 1건을 추가로 완료하면 <strong>2026년 2월</strong> 졸업이 가능합니다.
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

window.showDetailedGraduationRequirements = showDetailedGraduationRequirements;

console.log('✅ 졸업 요건 상세 분석 기능 로드 완료');

// ==================== 학업 진행 상황 시각화 ====================

// 학업 진행 상황 상세 모달
function showProgressDetail() {
    const student = DataService.getStudentInfo();
    
    // 전체 진행률 계산
    const totalProgress = 67; // 샘플
    
    // 학점 진행률
    const creditProgress = (24 / 36 * 100).toFixed(0);
    
    // 논문 단계
    const stages = [
        { name: '연구계획서', status: 'completed', date: '2024-09-15' },
        { name: '중간논문', status: 'in-progress', date: null },
        { name: '최종논문', status: 'pending', date: null }
    ];
    
    // 예상 졸업 시기
    const expectedGraduation = '2026년 2월';
    const monthsRemaining = 6;
    
    const modalContent = `
        <div class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>나의 학업 진행 현황</h3>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9CA3AF;">×</button>
                </div>
                <div class="modal-body">
                    <!-- 전체 진행도 -->
                    <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem; text-align: center;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">전체 진행도</h4>
                        <div style="font-size: 3rem; font-weight: 700; color: #6A0028; margin-bottom: 1rem;">
                            ${totalProgress}%
                        </div>
                        <div class="progress-bar" style="width: 100%; max-width: 500px; margin: 0 auto;">
                            <div class="progress-fill" style="width: ${totalProgress}%;"></div>
                        </div>
                    </div>
                    
                    <!-- 학점 이수 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">학점 이수</h4>
                        <div style="background: #EFF6FF; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #3B82F6;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <span style="font-size: 0.875rem; color: #1E40AF;">이수 학점</span>
                                <span style="font-size: 1.25rem; font-weight: 700; color: #1E40AF;">24 / 36 학점</span>
                            </div>
                            <div class="progress-bar" style="width: 100%; height: 24px;">
                                <div class="progress-fill" style="width: ${creditProgress}%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">
                                    ${creditProgress}%
                                </div>
                            </div>
                            <div style="font-size: 0.75rem; color: #6B7280; margin-top: 0.5rem;">
                                졸업까지 12학점이 더 필요합니다
                            </div>
                        </div>
                    </div>
                    
                    <!-- 논문 단계 -->
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 600; color: #1F2937; margin-bottom: 1rem;">논문 진행 단계</h4>
                        <div style="position: relative; padding-left: 2rem;">
                            ${stages.map((stage, index) => `
                                <div style="display: flex; align-items: center; margin-bottom: ${index < stages.length - 1 ? '1.5rem' : '0'}; position: relative;">
                                    <!-- 타임라인 -->
                                    <div style="position: absolute; left: -2rem; top: 0;">
                                        <div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; ${
                                            stage.status === 'completed' ? 'background: #10B981; color: white;' :
                                            stage.status === 'in-progress' ? 'background: #3B82F6; color: white;' :
                                            'background: #E5E7EB; color: #9CA3AF;'
                                        }">
                                            ${stage.status === 'completed' ? '✓' : stage.status === 'in-progress' ? '●' : '○'}
                                        </div>
                                        ${index < stages.length - 1 ? `
                                            <div style="width: 2px; height: 40px; background: ${stage.status === 'completed' ? '#10B981' : '#E5E7EB'}; margin: 0 auto;"></div>
                                        ` : ''}
                                    </div>
                                    
                                    <!-- 내용 -->
                                    <div style="flex: 1; padding: 0.75rem 1rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <div>
                                                <div style="font-weight: 600; color: #1F2937;">${stage.name}</div>
                                                ${stage.date ? `
                                                    <div style="font-size: 0.75rem; color: #6B7280; margin-top: 0.25rem;">${stage.date}</div>
                                                ` : ''}
                                            </div>
                                            <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; ${
                                                stage.status === 'completed' ? 'background: #D1FAE5; color: #065F46;' :
                                                stage.status === 'in-progress' ? 'background: #DBEAFE; color: #1E40AF;' :
                                                'background: #F3F4F6; color: #6B7280;'
                                            }">
                                                ${stage.status === 'completed' ? '완료' : stage.status === 'in-progress' ? '진행중' : '예정'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 예상 졸업 -->
                    <div style="background: #FEF3C7; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #F59E0B;">
                        <h4 style="font-weight: 600; color: #92400E; margin-bottom: 0.5rem;">예상 졸업 시기</h4>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #92400E; margin-bottom: 0.5rem;">
                            ${expectedGraduation}
                        </div>
                        <div style="font-size: 0.875rem; color: #92400E;">
                            졸업까지 약 ${monthsRemaining}개월 남았습니다
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeModal()" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').innerHTML = modalContent;
}

// Export
window.showProgressDetail = showProgressDetail;

console.log('✅ 학업 진행 상황 시각화 기능 로드 완료');
