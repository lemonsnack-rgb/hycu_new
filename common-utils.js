/**
 * ================================================================
 * 공통 유틸리티 함수
 * ================================================================
 * ID 1-5: 공통 수정사항 적용
 */

// ==================== ID 1: 영문버전 전환 ====================
function switchLanguage() {
    const currentLang = localStorage.getItem('language') || 'ko';
    const newLang = currentLang === 'ko' ? 'en' : 'ko';
    
    if (confirm(`${newLang === 'en' ? 'Switch to English version?' : '한국어 버전으로 전환하시겠습니까?'}`)) {
        localStorage.setItem('language', newLang);
        alert('영문 버전은 준비 중입니다.\nEnglish version is coming soon.');
        // location.reload();
    }
}

// ==================== ID 2: 로그아웃 ====================
function logout() {
    if (confirm('로그아웃하시겠습니까?')) {
        // SSO 로그아웃 처리
        localStorage.clear();
        sessionStorage.clear();
        alert('로그아웃되었습니다.');
        window.location.href = '/login';
    }
}

// ==================== ID 3: 학생 정보조회 (개선) ====================

/**
 * 🔧 개선: 학생 정보 모달 표시
 * - data 속성에서 정보 우선 조회
 * - 없으면 API 호출로 fallback
 *
 * @param {string} studentId - 학생 ID
 * @param {string} studentName - 학생 이름 (선택)
 * @param {object} studentInfo - 학생 정보 객체 {phone, email, major, degree} (선택)
 */
function showStudentInfo(studentId, studentName, studentInfo) {
    console.log('🔵 [showStudentInfo] 시작:', { studentId, studentName, studentInfo });

    // 🔧 수정: 기존 모달이 있으면 먼저 제거
    const existingModal = document.getElementById('student-info-modal');
    if (existingModal) {
        console.log('⚠️ [showStudentInfo] 기존 모달 제거');
        existingModal.remove();
    }

    // 🔧 개선: studentInfo가 없으면 DOM에서 data 속성 찾기
    if (!studentInfo) {
        const icon = document.querySelector(`[data-student-id="${studentId}"]`);
        if (icon) {
            studentInfo = {
                phone: icon.getAttribute('data-phone') || '',
                email: icon.getAttribute('data-email') || '',
                major: icon.getAttribute('data-major') || '',
                degree: icon.getAttribute('data-degree') || ''
            };
            if (!studentName) {
                const nameWrapper = icon.closest('.student-name-wrapper');
                if (nameWrapper) {
                    const nameElement = nameWrapper.querySelector('.student-name');
                    studentName = nameElement ? nameElement.textContent : studentId;
                }
            }
            console.log('📂 [showStudentInfo] DOM에서 정보 추출:', studentInfo);
        }
    }

    // 기본값 설정
    studentName = studentName || studentId;
    const hasInfo = studentInfo && (studentInfo.phone || studentInfo.email);

    console.log('🔵 [showStudentInfo] hasInfo:', hasInfo, 'studentInfo:', studentInfo);

    // 🔧 수정: 모달 생성 (크기를 내용에 맞춰 조절)
    const modal = document.createElement('div');
    modal.id = 'student-info-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90vw; width: 28rem; padding: 0; max-height: 90vh; overflow-y: auto;">
            <div style="padding: 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; z-index: 10;">
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #1F2937;">학생 정보</h3>
                <button onclick="closeStudentInfoModal()" class="modal-close" style="color: #9CA3AF; cursor: pointer; background: none; border: none; font-size: 1.5rem; line-height: 1;">&times;</button>
            </div>
            <div style="padding: 1.5rem;">
                <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 4rem; height: 4rem; background-color: #E5E7EB; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg style="width: 2.5rem; height: 2.5rem; color: #6B7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div style="min-width: 0; flex: 1;">
                            <p style="font-size: 1.125rem; font-weight: 700; color: #1F2937; word-break: break-word;">${studentName}</p>
                            <p style="font-size: 0.875rem; color: #6B7280;">${studentId}</p>
                        </div>
                    </div>
                </div>

                ${hasInfo ? `
                    <div id="student-info-content">
                        ${renderStudentInfoContent(studentInfo)}
                    </div>
                ` : `
                    <div id="student-info-loading" style="text-align: center; padding: 2rem; color: #6B7280;">
                        정보를 불러오는 중...
                    </div>
                    <div id="student-info-content" class="hidden">
                        <!-- 여기에 학생 정보가 로드됨 -->
                    </div>
                `}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    console.log('✅ [showStudentInfo] 모달 DOM에 추가됨');

    // 🔧 개선: 정보가 없을 때만 API 호출
    if (!hasInfo) {
        console.log('🔵 [showStudentInfo] API 호출 시작');
        loadStudentInfo(studentId);
    } else {
        console.log('✅ [showStudentInfo] data 속성에서 정보 표시 완료');
    }
}

/**
 * 🆕 신규: 학생 정보 HTML 렌더링
 * @param {object} studentInfo - 학생 정보 객체
 * @returns {string} HTML 문자열
 */
function renderStudentInfoContent(studentInfo) {
    console.log('🔵 [renderStudentInfoContent] 렌더링:', studentInfo);

    // 🔧 수정: 정보가 없는 경우 처리
    const hasAnyInfo = studentInfo && (studentInfo.phone || studentInfo.email || studentInfo.major || studentInfo.degree);

    if (!hasAnyInfo) {
        return `
            <div style="text-align: center; padding: 2rem; color: #9CA3AF;">
                <p>등록된 정보가 없습니다.</p>
            </div>
        `;
    }

    return `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${studentInfo.phone ? `
                <div class="info-row">
                    <span class="info-label">
                        <svg style="width: 1.25rem; height: 1.25rem; display: inline-block; vertical-align: middle; margin-right: 0.5rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        전화번호
                    </span>
                    <span class="info-value" style="word-break: break-all;">${studentInfo.phone}</span>
                </div>
            ` : ''}

            ${studentInfo.email ? `
                <div class="info-row">
                    <span class="info-label">
                        <svg style="width: 1.25rem; height: 1.25rem; display: inline-block; vertical-align: middle; margin-right: 0.5rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        이메일
                    </span>
                    <span class="info-value" style="word-break: break-all;">${studentInfo.email}</span>
                </div>
            ` : ''}

            ${studentInfo.major || studentInfo.degree ? `
                <div class="info-row">
                    <span class="info-label">
                        <svg style="width: 1.25rem; height: 1.25rem; display: inline-block; vertical-align: middle; margin-right: 0.5rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        전공 / 과정
                    </span>
                    <span class="info-value" style="word-break: break-word;">
                        ${studentInfo.major || ''} ${studentInfo.degree ? '/ ' + studentInfo.degree : ''}
                    </span>
                </div>
            ` : ''}
        </div>

        ${studentInfo.phone || studentInfo.email ? `
            <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
                ${studentInfo.phone ? `
                    <a href="tel:${studentInfo.phone}"
                       class="btn-primary"
                       style="flex: 1; min-width: 120px; text-align: center; text-decoration: none; padding: 0.625rem 1.25rem; border-radius: 0.375rem; font-weight: 600; display: inline-block;">
                        전화하기
                    </a>
                ` : ''}
                ${studentInfo.email ? `
                    <a href="mailto:${studentInfo.email}"
                       class="btn-secondary"
                       style="flex: 1; min-width: 120px; text-align: center; text-decoration: none; padding: 0.625rem 1.25rem; border-radius: 0.375rem; font-weight: 600; display: inline-block;">
                        이메일
                    </a>
                ` : ''}
            </div>
        ` : ''}
    `;
}

/**
 * 🔧 개선: 학생 정보 로드 (API 호출)
 * - renderStudentInfoContent() 재사용
 *
 * @param {string} studentId - 학생 ID
 */
function loadStudentInfo(studentId) {
    console.log('🔵 [loadStudentInfo] API 호출 시작:', studentId);

    // TODO: 실제 API 호출
    // 임시 데이터로 시뮬레이션
    setTimeout(() => {
        const studentInfo = {
            phone: '010-1234-5678',
            email: 'student@hycu.ac.kr',
            major: '컴퓨터공학',
            degree: '박사과정'
        };

        const content = document.getElementById('student-info-content');
        const loading = document.getElementById('student-info-loading');

        if (content && loading) {
            loading.classList.add('hidden');
            content.classList.remove('hidden');

            // 🔧 개선: renderStudentInfoContent() 재사용
            content.innerHTML = renderStudentInfoContent(studentInfo);

            console.log('✅ [loadStudentInfo] API 호출 완료');
        }
    }, 500);
}

// 🔧 수정: 학생정보 모달 닫기 (통합 closeModal 사용)
function closeStudentInfoModal() {
    closeModal('student-info-modal');
}

// ==================== ID 4: 레이블 규칙 통일 ====================
const COMMON_LABELS = {
    // 상태 레이블
    status: {
        pending: '대기',
        progress: '진행중',
        completed: '완료',
        approvalPending: '승인대기',
        approvalCompleted: '승인완료',
        approved: '승인',
        hold: '보류',
        rejected: '반려'
    },
    
    // 메뉴명
    menu: {
        dashboard: '대시보드',
        meeting: '미팅관리',  // ID 33, 60
        feedback: '온라인피드백',
        review: '심사관리',
        board: '자료실'  // ID 32, 57
    },
    
    // 용어
    terms: {
        comment: '첨삭',  // ID 43
        evaluation: '전체 평가',  // ID 43
        reply: '댓글',  // ID 43
        stage: '심사단계',
        action: '관리'  // 기존 '액션', '상세보기' 통일
    }
};

// ==================== ID 5: 통합 모달 관리 시스템 (개선) ====================

/**
 * 🔧 수정: 통합 모달 닫기 함수
 * - 모달 ID로 특정 모달 닫기
 * - hidden 클래스 추가 또는 remove() 실행
 * - 배경 스크롤 복원
 *
 * @param {string} modalId - 닫을 모달의 ID
 * @param {boolean} removeElement - true이면 모달 제거, false면 숨김 (기본: false)
 */
function closeModal(modalId, removeElement = false) {
    console.log('🔵 [closeModal] 모달 닫기:', modalId);

    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn('⚠️ [closeModal] 모달을 찾을 수 없음:', modalId);
        return false;
    }

    // 🔧 수정: 모달 숨김 또는 제거
    if (removeElement) {
        modal.remove();
        console.log('✅ [closeModal] 모달 제거됨:', modalId);
    } else {
        modal.style.display = 'none';
        modal.classList.add('hidden');
        console.log('✅ [closeModal] 모달 숨김:', modalId);
    }

    // 🔧 수정: 배경 스크롤 복원
    // 다른 열린 모달이 없으면 스크롤 복원
    const openModals = document.querySelectorAll('.modal-backdrop:not(.hidden), [role="dialog"]:not(.hidden)');
    const visibleModals = Array.from(openModals).filter(m => {
        const style = window.getComputedStyle(m);
        return style.display !== 'none';
    });

    if (visibleModals.length === 0) {
        document.body.style.overflow = 'auto';
        console.log('✅ [closeModal] 배경 스크롤 복원');
    }

    return true;
}

/**
 * 🔧 수정: 취소 버튼 핸들러
 * - 이전: 전체 플로우 종료
 * - 수정: 모달만 닫기, 이전 화면 유지
 */
function handleCancel(modalId) {
    return closeModal(modalId, false);
}

/**
 * 🔧 수정: 닫기 버튼 핸들러 (X 버튼)
 * - 학생정보 모달 등은 remove, 일반 모달은 숨김
 */
function handleClose(modalId, shouldRemove = false) {
    return closeModal(modalId, shouldRemove);
}

// 🔧 수정: 모달 외부 클릭 시 닫기 (모든 모달 지원)
document.addEventListener('click', function(e) {
    // 모달 배경(backdrop)을 클릭한 경우
    if (e.target.classList.contains('modal-backdrop') || e.target.id?.includes('modal')) {
        const modalId = e.target.id;
        if (modalId) {
            console.log('🔵 [모달 외부 클릭] 모달 닫기:', modalId);

            // student-info-modal은 제거, 나머지는 숨김
            const shouldRemove = modalId === 'student-info-modal';
            closeModal(modalId, shouldRemove);
        }
    }
});

// 🔧 수정: ESC 키로 모든 열린 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        console.log('🔵 [ESC 키] 열린 모달 찾기...');

        // 모든 모달 중 표시 중인 것 찾기
        const allModals = document.querySelectorAll('.modal-backdrop, [role="dialog"], [id*="modal"]');

        let closedAny = false;
        allModals.forEach(modal => {
            const style = window.getComputedStyle(modal);
            const isVisible = style.display !== 'none' && !modal.classList.contains('hidden');

            if (isVisible && modal.id) {
                console.log('🔵 [ESC 키] 모달 닫기:', modal.id);

                // student-info-modal은 제거, 나머지는 숨김
                const shouldRemove = modal.id === 'student-info-modal';
                closeModal(modal.id, shouldRemove);
                closedAny = true;
            }
        });

        if (closedAny) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
});

// 🔧 수정: 모달창 취소/닫기 버튼에 이벤트 자동 연결
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔵 [DOMContentLoaded] 모달 버튼 이벤트 리스너 등록');

    // 모든 취소/닫기 버튼에 이벤트 리스너 추가
    document.querySelectorAll('[data-action="cancel"], [data-action="close"], .modal-cancel, .modal-close').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('🔵 [취소/닫기 버튼] 클릭됨');

            // 가장 가까운 모달 찾기
            const modal = this.closest('.modal-backdrop') || this.closest('[role="dialog"]') || this.closest('[id*="modal"]');

            if (modal && modal.id) {
                console.log('🔵 [취소/닫기 버튼] 모달 닫기:', modal.id);

                // X 버튼(.modal-close)이거나 student-info-modal이면 제거
                const isCloseBtn = this.classList.contains('modal-close') || this.dataset.action === 'close';
                const shouldRemove = isCloseBtn && modal.id === 'student-info-modal';

                closeModal(modal.id, shouldRemove);
            } else {
                console.warn('⚠️ [취소/닫기 버튼] 모달을 찾을 수 없음');
            }
        });
    });
});

// 🔧 수정: 동적 모달에도 이벤트 적용 (MutationObserver)
// 페이지 로드 후 생성되는 모달에도 자동으로 이벤트 연결
const modalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element 노드만
                // 새로 추가된 노드가 모달이거나, 모달을 포함하는 경우
                const modals = node.matches?.('[id*="modal"]') ? [node] : node.querySelectorAll?.('[id*="modal"]') || [];

                modals.forEach(modal => {
                    // 모달 내부의 취소/닫기 버튼 찾기
                    const buttons = modal.querySelectorAll('[data-action="cancel"], [data-action="close"], .modal-cancel, .modal-close');

                    buttons.forEach(btn => {
                        // 이미 이벤트가 등록되어 있는지 확인
                        if (!btn.dataset.eventAttached) {
                            btn.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();

                                const modal = this.closest('.modal-backdrop') || this.closest('[role="dialog"]') || this.closest('[id*="modal"]');

                                if (modal && modal.id) {
                                    const isCloseBtn = this.classList.contains('modal-close') || this.dataset.action === 'close';
                                    const shouldRemove = isCloseBtn && modal.id === 'student-info-modal';
                                    closeModal(modal.id, shouldRemove);
                                }
                            });

                            btn.dataset.eventAttached = 'true';
                        }
                    });
                });
            }
        });
    });
});

// body의 자식 변경 감지 시작
modalObserver.observe(document.body, { childList: true, subtree: true });

// ==================== 헤더 유틸리티 HTML 생성 ====================
function createHeaderUtils(userName, userRole) {
    const roleText = {
        'admin': '관리자',
        'professor': '교수',
        'student': '학생'
    };
    
    return `
        <div class="header-utils">
            <!-- ID 1: 영문버전 -->
            <button onclick="switchLanguage()" title="Switch to English" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; color: #6B7280; border-radius: 0.5rem;">
                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
                <span style="font-size: 0.875rem; font-weight: 500;">EN</span>
            </button>
            
            <!-- 사용자 정보 -->
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background-color: #F9FAFB; border-radius: 0.5rem;">
                <div style="text-align: right;">
                    <p style="font-size: 0.875rem; font-weight: 600; color: #1F2937;">${userName}</p>
                    <p style="font-size: 0.75rem; color: #6B7280;">${roleText[userRole]}</p>
                </div>
                
                <!-- ID 2: 로그아웃 -->
                <button onclick="logout()" title="로그아웃" style="padding: 0.5rem; background: none; border: none; cursor: pointer; color: #6B7280; border-radius: 0.375rem;">
                    <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// ==================== 학생명에 정보 아이콘 추가 (개선) ====================

/**
 * 🆕 신규: 학생 이름에 정보 아이콘을 추가하는 함수 (data 속성 포함)
 * - data 속성에 학생 정보 저장
 * - Font Awesome / SVG 아이콘 선택 가능
 *
 * @param {string} studentName - 학생 이름
 * @param {string} studentId - 학생 ID
 * @param {object} studentInfo - 학생 정보 객체 {phone, email, major, degree}
 * @param {string} iconType - 아이콘 타입: 'fontawesome' | 'svg' (기본: 'svg')
 * @returns {string} HTML 문자열
 *
 * @example
 * // 기본 사용 (SVG 아이콘)
 * createStudentNameWithInfo('김철수', '2024001', {phone: '010-1234-5678', email: 'kim@hycu.ac.kr'})
 *
 * // Font Awesome 사용
 * createStudentNameWithInfo('김철수', '2024001', {phone: '010-1234-5678', email: 'kim@hycu.ac.kr'}, 'fontawesome')
 */
function createStudentNameWithInfo(studentName, studentId, studentInfo = {}, iconType = 'svg') {
    const { phone = '', email = '', major = '', degree = '' } = studentInfo;

    // Font Awesome 아이콘
    const faIcon = '<i class="fas fa-info-circle"></i>';

    // SVG 아이콘
    const svgIcon = `
        <svg style="width: 1rem; height: 1rem; display: inline-block; vertical-align: middle;" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
    `;

    const icon = iconType === 'fontawesome' ? faIcon : svgIcon;

    return `
        <span class="student-name-wrapper">
            <span class="student-name">${studentName}</span>
            <span class="student-info-icon"
                  onclick="showStudentInfo('${studentId}')"
                  data-student-id="${studentId}"
                  data-phone="${phone}"
                  data-email="${email}"
                  data-major="${major}"
                  data-degree="${degree}"
                  title="학생 정보 보기">
                ${icon}
            </span>
        </span>
    `;
}

/**
 * 🔧 개선: 학생 이름에 정보 아이콘 추가 (기존 함수, 하위 호환성 유지)
 * - 기존 코드와 호환성을 위해 유지
 * - 새로운 코드는 createStudentNameWithInfo() 사용 권장
 *
 * @param {string} studentName - 학생 이름
 * @param {string} studentId - 학생 ID
 * @returns {string} HTML 문자열
 */
function addStudentInfoIcon(studentName, studentId) {
    return `
        <span>${studentName}</span>
        <span class="student-info-icon" onclick="showStudentInfo('${studentId}', '${studentName}')" title="학생 정보 조회">
            <svg style="width: 1rem; height: 1rem; display: inline-block; vertical-align: middle;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
        </span>
    `;
}

// ==================== 🔧 Critical Fix #2: localStorage 기반 데이터 저장/동기화 (시연용 프로토타입) ====================
/**
 * 시연용 프로토타입을 위한 간단한 localStorage 헬퍼
 * - 교수/학생/관리자 화면 간 데이터 동기화
 * - 브라우저 새로고침 시 데이터 유지
 */
const ProtoStorage = {
    // 데이터 저장
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`💾 [ProtoStorage] 저장: ${key}`);
            return true;
        } catch (e) {
            console.error(`❌ [ProtoStorage] 저장 실패: ${key}`, e);
            return false;
        }
    },

    // 데이터 로드
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            if (data === null) return defaultValue;
            const parsed = JSON.parse(data);
            console.log(`📂 [ProtoStorage] 로드: ${key}`);
            return parsed;
        } catch (e) {
            console.error(`❌ [ProtoStorage] 로드 실패: ${key}`, e);
            return defaultValue;
        }
    },

    // 데이터 삭제
    remove(key) {
        try {
            localStorage.removeItem(key);
            console.log(`🗑️ [ProtoStorage] 삭제: ${key}`);
            return true;
        } catch (e) {
            console.error(`❌ [ProtoStorage] 삭제 실패: ${key}`, e);
            return false;
        }
    },

    // 전체 삭제 (시연 초기화용)
    clear() {
        try {
            localStorage.clear();
            console.log(`🗑️ [ProtoStorage] 전체 삭제`);
            return true;
        } catch (e) {
            console.error(`❌ [ProtoStorage] 전체 삭제 실패`, e);
            return false;
        }
    },

    // 키 목록 조회
    keys() {
        return Object.keys(localStorage);
    }
};

// ==================== 전역 함수 Export ====================
// ProtoStorage
window.ProtoStorage = ProtoStorage;

// 모달 관리 함수
window.closeModal = closeModal;
window.handleCancel = handleCancel;
window.handleClose = handleClose;
window.closeStudentInfoModal = closeStudentInfoModal;

// 학생 정보 조회 함수
window.showStudentInfo = showStudentInfo;
window.renderStudentInfoContent = renderStudentInfoContent;
window.loadStudentInfo = loadStudentInfo;
window.createStudentNameWithInfo = createStudentNameWithInfo;
window.addStudentInfoIcon = addStudentInfoIcon;

console.log('✅ 공통 유틸리티 로드 완료 (localStorage 헬퍼 + 통합 모달 관리 시스템 + 학생 정보 조회)');
