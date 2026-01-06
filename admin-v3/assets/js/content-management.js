// ========== 콘텐츠 관리 로직 ==========
// 연구윤리, 논문일정, 논문지도절차 콘텐츠 CRUD

// ========== 에디터 툴바 포맷 함수 ==========

// 연구윤리 텍스트 포맷
function formatEthicsText(command) {
    const editor = document.getElementById('ethics-editor');
    editor.focus();

    if (command === 'h1' || command === 'h2' || command === 'h3') {
        document.execCommand('formatBlock', false, command);
    } else if (command === 'link') {
        const url = prompt('URL을 입력하세요:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    } else if (command === 'ul' || command === 'ol') {
        const listCommand = command === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
        document.execCommand(listCommand, false, null);
    } else {
        document.execCommand(command, false, null);
    }
}

// 논문일정 텍스트 포맷
function formatScheduleText(command) {
    const editor = document.getElementById('schedule-editor');
    editor.focus();

    if (command === 'h1' || command === 'h2' || command === 'h3') {
        document.execCommand('formatBlock', false, command);
    } else if (command === 'link') {
        const url = prompt('URL을 입력하세요:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    } else if (command === 'table') {
        const rows = prompt('행 수를 입력하세요:', '3');
        const cols = prompt('열 수를 입력하세요:', '3');
        if (rows && cols) {
            let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;"><tbody>';
            for (let i = 0; i < parseInt(rows); i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < parseInt(cols); j++) {
                    tableHTML += '<td style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">&nbsp;</td>';
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</tbody></table>';
            document.execCommand('insertHTML', false, tableHTML);
        }
    } else if (command === 'ul' || command === 'ol') {
        const listCommand = command === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
        document.execCommand(listCommand, false, null);
    } else {
        document.execCommand(command, false, null);
    }
}

// 논문지도절차 텍스트 포맷
function formatProcedureText(command) {
    const editor = document.getElementById('procedure-editor');
    editor.focus();

    if (command === 'h1' || command === 'h2' || command === 'h3') {
        document.execCommand('formatBlock', false, command);
    } else if (command === 'link') {
        const url = prompt('URL을 입력하세요:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    } else if (command === 'ul' || command === 'ol') {
        const listCommand = command === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
        document.execCommand(listCommand, false, null);
    } else {
        document.execCommand(command, false, null);
    }
}

// ========== 연구윤리 관리 ==========

// 연구윤리 콘텐츠 초기화
function initEthicsContentManagement() {
    const content = getContent('ethics');
    const editor = document.getElementById('ethics-editor');
    const lastModified = document.getElementById('ethics-last-modified');

    if (editor && content) {
        editor.innerHTML = content.content;
    }

    if (lastModified && content) {
        lastModified.textContent = `최종 수정일: ${content.lastModified} (${content.modifiedBy})`;
    }
}

// 연구윤리 콘텐츠 저장
function saveEthicsContent() {
    const editor = document.getElementById('ethics-editor');

    if (!editor) {
        alert('에디터를 찾을 수 없습니다.');
        return;
    }

    if (!editor.innerHTML.trim()) {
        alert('콘텐츠를 입력해주세요.');
        return;
    }

    const content = getContent('ethics');
    content.content = editor.innerHTML;
    content.modifiedBy = 'admin';

    const success = saveContent('ethics', content);

    if (success) {
        alert('연구윤리 콘텐츠가 저장되었습니다.');
        initEthicsContentManagement();

        // 실제 뷰 페이지도 업데이트
        updateEthicsView();
    } else {
        alert('저장에 실패했습니다.');
    }
}

// 연구윤리 콘텐츠 초기화
function resetEthicsContent() {
    if (!confirm('초기 콘텐츠로 되돌리시겠습니까? 저장하지 않은 변경사항은 사라집니다.')) {
        return;
    }

    // localStorage에서 삭제하여 기본값으로 리셋
    localStorage.removeItem('contentData_ethics');
    initContentData();
    initEthicsContentManagement();

    alert('초기 콘텐츠로 되돌렸습니다.');
}

// 연구윤리 실제 뷰 업데이트
function updateEthicsView() {
    // admin_views.js의 views.ethics를 동적으로 업데이트
    const content = getContent('ethics');
    views.ethics = () => `
    <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">연구윤리</h3>
        </div>
        <div class="p-8">
            <div class="prose prose-sm max-w-none">
                ${content.content}
            </div>
        </div>
    </div>
`;
}

// ========== 논문일정 관리 ==========

// 논문일정 콘텐츠 초기화
function initScheduleContentManagement() {
    const content = getContent('schedule');
    const editor = document.getElementById('schedule-editor');
    const lastModified = document.getElementById('schedule-last-modified');

    if (editor && content) {
        editor.innerHTML = content.content;
    }

    if (lastModified && content) {
        lastModified.textContent = `최종 수정일: ${content.lastModified} (${content.modifiedBy})`;
    }
}

// 논문일정 콘텐츠 저장
function saveScheduleContent() {
    const editor = document.getElementById('schedule-editor');

    if (!editor) {
        alert('에디터를 찾을 수 없습니다.');
        return;
    }

    if (!editor.innerHTML.trim()) {
        alert('콘텐츠를 입력해주세요.');
        return;
    }

    const content = getContent('schedule');
    content.content = editor.innerHTML;
    content.modifiedBy = 'admin';

    const success = saveContent('schedule', content);

    if (success) {
        alert('논문일정 콘텐츠가 저장되었습니다.');
        initScheduleContentManagement();

        // 실제 뷰 페이지도 업데이트
        updateScheduleView();
    } else {
        alert('저장에 실패했습니다.');
    }
}

// 논문일정 콘텐츠 초기화
function resetScheduleContent() {
    if (!confirm('초기 콘텐츠로 되돌리시겠습니까? 저장하지 않은 변경사항은 사라집니다.')) {
        return;
    }

    // localStorage에서 삭제하여 기본값으로 리셋
    localStorage.removeItem('contentData_schedule');
    initContentData();
    initScheduleContentManagement();

    alert('초기 콘텐츠로 되돌렸습니다.');
}

// 논문일정 실제 뷰 업데이트
function updateScheduleView() {
    // admin_views.js의 views.schedule을 동적으로 업데이트
    const content = getContent('schedule');
    views.schedule = () => `
    <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">논문일정</h3>
        </div>
        <div class="p-8">
            <div class="prose prose-sm max-w-none">
                ${content.content}
            </div>
        </div>
    </div>
`;
}

// ========== 논문지도절차 관리 ==========

// 논문지도절차 콘텐츠 초기화
function initProcedureContentManagement() {
    const content = getContent('procedure');
    const editor = document.getElementById('procedure-editor');
    const lastModified = document.getElementById('procedure-last-modified');

    if (editor && content) {
        editor.innerHTML = content.content;
    }

    if (lastModified && content) {
        lastModified.textContent = `최종 수정일: ${content.lastModified} (${content.modifiedBy})`;
    }
}

// 논문지도절차 콘텐츠 저장
function saveProcedureContent() {
    const editor = document.getElementById('procedure-editor');

    if (!editor) {
        alert('에디터를 찾을 수 없습니다.');
        return;
    }

    if (!editor.innerHTML.trim()) {
        alert('콘텐츠를 입력해주세요.');
        return;
    }

    const content = getContent('procedure');
    content.content = editor.innerHTML;
    content.modifiedBy = 'admin';

    const success = saveContent('procedure', content);

    if (success) {
        alert('논문지도절차 콘텐츠가 저장되었습니다.');
        initProcedureContentManagement();

        // 실제 뷰 페이지도 업데이트
        updateProcedureView();
    } else {
        alert('저장에 실패했습니다.');
    }
}

// 논문지도절차 콘텐츠 초기화
function resetProcedureContent() {
    if (!confirm('초기 콘텐츠로 되돌리시겠습니까? 저장하지 않은 변경사항은 사라집니다.')) {
        return;
    }

    // localStorage에서 삭제하여 기본값으로 리셋
    localStorage.removeItem('contentData_procedure');
    initContentData();
    initProcedureContentManagement();

    alert('초기 콘텐츠로 되돌렸습니다.');
}

// 논문지도절차 실제 뷰 업데이트
function updateProcedureView() {
    // admin_views.js의 views.procedure를 동적으로 업데이트
    const content = getContent('procedure');
    views.procedure = () => `
    <div class="bg-white rounded-lg shadow-md">
        <div class="p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">논문 지도 절차</h3>
        </div>
        <div class="p-8">
            <div class="prose prose-sm max-w-none">
                ${content.content}
            </div>
        </div>
    </div>
`;
    // process alias도 업데이트
    views.process = views.procedure;
}

// ========== 화면 전환 시 초기화 ==========

// renderView 함수에 후처리 추가를 위한 리스너
// showScreen 함수가 호출될 때 자동으로 초기화되도록 설정

// 전역 이벤트 리스너 등록 (페이지 로드 시)
if (typeof window !== 'undefined') {
    // MutationObserver를 사용하여 화면 전환 감지
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;

                // 화면이 활성화되었을 때
                if (target.classList.contains('active')) {
                    const screenId = target.id;

                    // 각 관리 화면에 대한 초기화 함수 호출
                    if (screenId === 'ethicsContentMgmt-screen') {
                        setTimeout(() => initEthicsContentManagement(), 0);
                    } else if (screenId === 'scheduleContentMgmt-screen') {
                        setTimeout(() => initScheduleContentManagement(), 0);
                    } else if (screenId === 'procedureContentMgmt-screen') {
                        setTimeout(() => initProcedureContentManagement(), 0);
                    }
                }
            }
        });
    });

    // DOM 로드 후 observer 등록
    window.addEventListener('DOMContentLoaded', function() {
        // 모든 content-screen 요소를 감시
        const screens = document.querySelectorAll('.content-screen');
        screens.forEach(screen => {
            observer.observe(screen, {
                attributes: true,
                attributeFilter: ['class']
            });
        });

        // 페이지 로드 시 실제 뷰도 업데이트
        updateEthicsView();
        updateScheduleView();
        updateProcedureView();
    });
}
