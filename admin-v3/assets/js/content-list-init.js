// ==================== 콘텐츠 목록 화면 초기화 ====================

/**
 * renderAdminView 함수를 래핑하여 콘텐츠 목록 화면 post-processing 추가
 */
(function() {
    console.log('🔧 content-list-init.js 로드됨');

    // 원본 renderAdminView 함수 저장
    const originalRenderAdminView = window.renderAdminView;

    if (typeof originalRenderAdminView !== 'function') {
        console.error('❌ renderAdminView 함수를 찾을 수 없습니다');
        return;
    }

    // renderAdminView 함수 재정의
    window.renderAdminView = function(viewName) {
        console.log('🔧 래핑된 renderAdminView 호출:', viewName);

        // 원본 함수 실행
        originalRenderAdminView(viewName);

        // 콘텐츠 목록 관리 화면 후처리
        if (viewName === 'ethicsList' || viewName === 'scheduleList' || viewName === 'procedureList') {
            console.log('🔍 콘텐츠 목록 화면 post-processing 시작:', viewName);

            const contentTypeMap = {
                'ethicsList': 'ethics',
                'scheduleList': 'schedule',
                'procedureList': 'procedure'
            };
            const contentType = contentTypeMap[viewName];

            // innerHTML이 완료된 후 다음 이벤트 루프에서 실행
            setTimeout(() => {
                console.log('⏰ setTimeout 실행: ContentListManagement 타입 =', typeof ContentListManagement);
                const tbody = document.getElementById('content-table-body');
                console.log('⏰ setTimeout 실행: content-table-body 존재 =', !!tbody);

                if (typeof ContentListManagement !== 'undefined' && tbody) {
                    console.log('✅ ContentListManagement.init 실행');
                    ContentListManagement.init(contentType);
                } else {
                    console.error('❌ ContentListManagement 또는 content-table-body를 찾을 수 없습니다');
                    console.error('  - ContentListManagement:', typeof ContentListManagement);
                    console.error('  - tbody:', tbody);
                }
            }, 0);
        }
    };

    console.log('✅ renderAdminView 래핑 완료');
})();
