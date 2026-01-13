/**
 * 학술지 대체심사 목록 관리
 */

function initJournalReview() {
    renderJournalReviewList();
}

function renderJournalReviewList() {
    const journals = getJournalReviews();

    const contentHtml = `
        <!-- 검색 영역 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="p-4 bg-gray-50">
                <div class="grid grid-cols-5 gap-4">
                    <!-- 1행 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
                        <select id="journal-filter-year" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="2025" selected>2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                        <select id="journal-filter-semester" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="1" selected>1학기</option>
                            <option value="2">2학기</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                        <select id="journal-filter-college-type" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="일반대학원">일반대학원</option>
                            <option value="특수대학원">특수대학원</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                        <select id="journal-filter-graduate-school" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="일반대학원">일반대학원</option>
                            <option value="디자인대학원">디자인대학원</option>
                            <option value="경영대학원">경영대학원</option>
                            <option value="부동산대학원">부동산대학원</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                        <select id="journal-filter-undergraduate-major" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="컴퓨터공학과">컴퓨터공학과</option>
                            <option value="전자공학과">전자공학과</option>
                            <option value="경영학과">경영학과</option>
                            <option value="디자인학부">디자인학부</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                        <select id="journal-filter-major" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="컴퓨터공학">컴퓨터공학</option>
                            <option value="전자공학">전자공학</option>
                            <option value="경영학">경영학</option>
                            <option value="시각디자인">시각디자인</option>
                        </select>
                    </div>

                    <!-- 2행 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                        <select id="journal-filter-degree" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="석사">석사</option>
                            <option value="박사">박사</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                        <select id="journal-filter-status-type" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="재학">재학</option>
                            <option value="휴학">휴학</option>
                            <option value="수료">수료</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                        <input type="text" id="journal-filter-student-number" placeholder="학번"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                               onkeypress="if(event.key==='Enter') searchJournalReviews()">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                        <input type="text" id="journal-filter-student-name" placeholder="성명"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                               onkeypress="if(event.key==='Enter') searchJournalReviews()">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                        <input type="text" id="journal-filter-advisor-name" placeholder="지도교수명"
                               class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                               onkeypress="if(event.key==='Enter') searchJournalReviews()">
                    </div>

                    <!-- 3행 -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">처리결과</label>
                        <select id="journal-filter-result" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                            <option value="">전체</option>
                            <option value="심사대기">심사대기</option>
                            <option value="심사중">심사중</option>
                            <option value="심사완료">심사완료</option>
                            <option value="합격">합격</option>
                            <option value="조건부합격">조건부합격</option>
                            <option value="불합격">불합격</option>
                        </select>
                    </div>
                    <div class="col-span-3"></div>
                    <div class="flex items-center justify-end">
                        <button onclick="searchJournalReviews()" class="px-3 bg-[#6A0028] text-white rounded hover:bg-[#4A001C] text-xs font-medium" style="height: 34px;">
                            <i class="fas fa-search mr-1"></i>조회
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 테이블 영역 -->
        <div class="bg-white rounded-lg shadow-md">
            <div id="journal-review-list">
                ${renderJournalReviewRows(journals)}
            </div>
        </div>
    `;

    const container = document.getElementById('journal-review-content');
    if (container) {
        container.innerHTML = contentHtml;
    }
}

function renderJournalReviewRows(journals) {
    if (journals.length === 0) {
        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">배정된 학술지 심사가 없습니다</h3>
                <p class="text-gray-500">학술지 심사가 배정되면 이곳에 표시됩니다.</p>
            </div>
        `;
    }

    return `
        <div class="table-container">
            <!-- 테이블 헤더: 타이틀(건수) + 액션버튼 -->
            <div class="table-header">
                <div class="table-header-left">
                    <h3 class="table-title">학술지 심사 목록</h3>
                    <span class="table-count">(총 ${journals.length}건)</span>
                </div>
                <div class="table-header-right">
                    <button onclick="sendNotificationToSelectedJournals()"
                            class="btn btn-primary btn-sm">
                        <span class="icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </span>
                        선택 학생에게 알림 발송
                    </button>
                </div>
            </div>
            <div class="table-scroll">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th style="width: 50px;">
                                <input type="checkbox" id="select-all-journals"
                                       onchange="toggleSelectAllJournals(this.checked)"
                                       class="rounded border-gray-300">
                            </th>
                            <th style="width: 60px;">순번</th>
                            <th style="width: 80px;">학년도</th>
                            <th style="width: 60px;">학기</th>
                            <th style="width: 100px;">대학구분</th>
                            <th style="width: 100px;">계열/대학원</th>
                            <th style="width: 120px;">학부(과)전공</th>
                            <th style="width: 150px;">학과/전공</th>
                            <th style="width: 80px;">학위과정</th>
                            <th style="width: 80px;">학적상태</th>
                            <th style="width: 90px;">학번</th>
                            <th style="width: 80px;">성명</th>
                            <th style="width: 100px;">지도교수명</th>
                            <th style="width: 100px;">처리결과</th>
                            <th style="width: 100px;">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${journals.map((journal, index) => {
                            return `
                                <tr>
                                    <td>
                                        <input type="checkbox" class="journal-checkbox rounded border-gray-300"
                                               value="${journal.id}"
                                               data-name="${journal.studentName}"
                                               data-student-id="${journal.studentId}">
                                    </td>
                                    <td>${index + 1}</td>
                                    <td>${journal.year || '2025'}</td>
                                    <td>${journal.semester || '1'}</td>
                                    <td>${journal.collegeType || '일반대학원'}</td>
                                    <td>${journal.graduateSchool || '일반대학원'}</td>
                                    <td>${journal.undergraduate || '-'}</td>
                                    <td>${journal.major || '-'}</td>
                                    <td>${journal.degree || '석사'}</td>
                                    <td>${journal.academicStatus || '재학'}</td>
                                    <td>${journal.studentId}</td>
                                    <td>${journal.studentName}</td>
                                    <td>${journal.advisorName || '-'}</td>
                                    <td>${journal.status}</td>
                                    <td>
                                        <div class="flex gap-2 justify-center">
                                            <button onclick="viewJournalReviewDetail(${journal.id}, 'member')"
                                                    class="text-[#6A0028] hover:text-[#6A0028] text-xs font-medium px-2 py-1 border border-[#F8BBD9] rounded hover:bg-[#FCE4EC]">
                                                심사
                                            </button>
                                            ${journal.myRole === 'chair' ? `
                                                <button onclick="viewJournalReviewDetail(${journal.id}, 'chair')"
                                                        class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded hover:bg-green-50">
                                                    승인
                                                </button>
                                            ` : ''}
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
}

function getJournalStatusBadgeClass(status) {
    const classes = {
        '심사대기': 'bg-yellow-100 text-yellow-800',
        '심사중': 'bg-[#FCE4EC] text-[#6A0028]',
        '심사완료': 'bg-green-100 text-green-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

function searchJournalReviews() {
    const status = document.getElementById('journalStatusFilter').value;
    const searchText = document.getElementById('journalSearchInput').value.toLowerCase();

    let journals = getJournalReviews();

    if (status) {
        journals = journals.filter(j => j.status === status);
    }

    if (searchText) {
        journals = journals.filter(j =>
            j.studentName.toLowerCase().includes(searchText) ||
            j.paperTitle.toLowerCase().includes(searchText) ||
            j.journalName.toLowerCase().includes(searchText)
        );
    }

    const listContainer = document.getElementById('journal-review-list');
    if (listContainer) {
        listContainer.innerHTML = renderJournalReviewRows(journals);
    }

    // 카운트 업데이트
    const countEl = document.getElementById('journal-review-count');
    if (countEl) {
        countEl.textContent = `${journals.length}건 (전체 ${getJournalReviews().length}건)`;
    }
}

function resetJournalSearch() {
    document.getElementById('journal-filter-year').value = '';
    document.getElementById('journal-filter-semester').value = '';
    document.getElementById('journal-filter-semester-count').value = '';
    document.getElementById('journal-filter-status').value = '';
    document.getElementById('journal-filter-keyword').value = '';
    renderJournalReviewList();
}

function downloadJournalPdf(journalId) {
    const journal = getJournalReviews().find(j => j.id === journalId);
    if (journal) {
        alert(`논문 다운로드: ${journal.paperTitle}\n파일: ${journal.pdfUrl}`);
    }
}

// ==================== 체크박스 관련 기능 ====================
function toggleSelectAllJournals(checked) {
    const checkboxes = document.querySelectorAll('.journal-checkbox');
    checkboxes.forEach(cb => cb.checked = checked);
}

function sendNotificationToSelectedJournals() {
    const checkboxes = document.querySelectorAll('.journal-checkbox:checked');

    if (checkboxes.length === 0) {
        showToast('학생을 선택해주세요', 'warning');
        return;
    }

    const selectedStudents = Array.from(checkboxes).map(cb => ({
        id: cb.dataset.studentId,
        name: cb.dataset.name
    }));

    const modalContent = `
        <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-gray-800 mb-2">선택된 학생 (${selectedStudents.length}명)</p>
                <div class="flex flex-wrap gap-2">
                    ${selectedStudents.map(s => `
                        <span class="inline-block bg-[#FCE4EC] text-[#6A0028] px-2 py-1 rounded text-xs">
                            ${s.name}
                        </span>
                    `).join('')}
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-800 mb-2">발송 방법 *</label>
                <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="journal-notif-type" value="kakao" checked class="rounded-full">
                        <span class="text-sm text-gray-800">카카오톡</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="journal-notif-type" value="sms" class="rounded-full">
                        <span class="text-sm text-gray-800">SMS</span>
                    </label>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-800 mb-1">알림 제목 *</label>
                <input type="text" id="journal-notif-title" placeholder="예: 학술지 심사 결과 확인 요청"
                       class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-800 mb-1">알림 내용 *</label>
                <textarea id="journal-notif-message" rows="4" placeholder="학생들에게 전달할 메시지를 입력하세요"
                          class="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
        </div>
    `;

    createModal('알림 발송', modalContent, [
        {
            text: '취소',
            className: 'btn-secondary',
            onclick: 'return;'
        },
        {
            text: '발송',
            className: 'btn-primary',
            onclick: 'confirmSendJournalNotification(' + JSON.stringify(selectedStudents) + ')'
        }
    ]);
}

function confirmSendJournalNotification(students) {
    const title = document.getElementById('journal-notif-title')?.value.trim();
    const message = document.getElementById('journal-notif-message')?.value.trim();
    const notifType = document.querySelector('input[name="journal-notif-type"]:checked')?.value;

    if (!title) {
        showToast('알림 제목을 입력해주세요', 'warning');
        return;
    }

    if (!message) {
        showToast('알림 내용을 입력해주세요', 'warning');
        return;
    }

    const notifTypeText = notifType === 'kakao' ? '카카오톡' : 'SMS';
    console.log('학술지 알림 발송:', { students, title, message, type: notifType });
    showToast(`${students.length}명의 학생에게 ${notifTypeText} 알림이 발송되었습니다`, 'success');

    // 체크박스 초기화
    const checkboxes = document.querySelectorAll('.journal-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    const selectAll = document.getElementById('select-all-journals');
    if (selectAll) selectAll.checked = false;
}

// 전역 export
window.initJournalReview = initJournalReview;
window.searchJournalReviews = searchJournalReviews;
window.resetJournalSearch = resetJournalSearch;
window.downloadJournalPdf = downloadJournalPdf;
window.toggleSelectAllJournals = toggleSelectAllJournals;
window.sendNotificationToSelectedJournals = sendNotificationToSelectedJournals;
window.confirmSendJournalNotification = confirmSendJournalNotification;

console.log('✅ 학술지 심사 목록 모듈 로드 완료');
