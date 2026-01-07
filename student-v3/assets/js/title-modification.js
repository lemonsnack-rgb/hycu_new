/**
 * 최종 논문 제목 수정 관리
 * Version: 20260107001
 */

// Mock 데이터
let titleModificationData = {
    title: '',
    lastModified: null
};

// 화면 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeTitleModification();
});

function initializeTitleModification() {
    const form = document.getElementById('title-modification-form');
    const cancelBtn = document.getElementById('title-modification-cancel-btn');

    if (form) {
        form.addEventListener('submit', handleTitleModificationSubmit);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleTitleModificationCancel);
    }

    // 기존 데이터 로드
    loadTitleModificationData();
}

function loadTitleModificationData() {
    const input = document.getElementById('title-modification-input');
    if (input && titleModificationData.title) {
        input.value = titleModificationData.title;
    }
}

function handleTitleModificationSubmit(event) {
    event.preventDefault();

    const titleInput = document.getElementById('title-modification-input');
    const title = titleInput.value.trim();

    if (!title) {
        alert('논문 제목을 입력해주세요.');
        titleInput.focus();
        return;
    }

    // 데이터 저장
    titleModificationData.title = title;
    titleModificationData.lastModified = new Date().toISOString();

    alert('논문 제목이 저장되었습니다.');

    console.log('Title saved:', titleModificationData);
}

function handleTitleModificationCancel() {
    const input = document.getElementById('title-modification-input');
    if (input) {
        // 이전 값으로 복원
        input.value = titleModificationData.title || '';
    }
}

console.log('✅ title-modification.js 로드 완료');
