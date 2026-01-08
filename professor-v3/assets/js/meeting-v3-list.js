// ==================== 미팅 관리 V3 목록 화면 ====================

/**
 * 미팅 목록 관리
 */
const MeetingList = {
    currentPage: 1,
    itemsPerPage: 20,
    allMeetings: [],

    /**
     * 목록 화면 렌더링
     */
    render() {
        return `
            <!-- 목록 화면 -->
            <div id="meeting-list-view">
                <!-- 검색 영역 -->
                <div class="bg-white rounded-lg shadow-md mb-6">
                    <div class="p-4 bg-gray-50">
                        <div class="grid grid-cols-5 gap-4">
                            <!-- 1행 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학년도/학기</label>
                                <select id="meeting-filter-year" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="2025" selected>2025</option>
                                    <option value="2024">2024</option>
                                </select>
                                <select id="meeting-filter-semester" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="1" selected>1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">대학구분</label>
                                <select id="meeting-filter-college-type" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="일반대학원">일반대학원</option>
                                    <option value="특수대학원">특수대학원</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">계열/대학원</label>
                                <select id="meeting-filter-division" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="일반대학원">일반대학원</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학부(과)전공</label>
                                <input type="text" id="meeting-filter-undergrad" placeholder="-"
                                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                       onkeypress="if(event.key==='Enter') MeetingList.applyFilters()">
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학과/전공</label>
                                <select id="meeting-filter-department" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="컴퓨터공학">컴퓨터공학</option>
                                    <option value="소프트웨어공학">소프트웨어공학</option>
                                    <option value="정보보안학">정보보안학</option>
                                    <option value="데이터사이언스">데이터사이언스</option>
                                </select>
                            </div>

                            <!-- 2행 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학위과정</label>
                                <select id="meeting-filter-degree" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="석사">석사</option>
                                    <option value="박사">박사</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학적상태</label>
                                <select id="meeting-filter-status" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="재학">재학</option>
                                    <option value="휴학">휴학</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">학번</label>
                                <input type="text" id="meeting-filter-student-number" placeholder="학번"
                                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                       onkeypress="if(event.key==='Enter') MeetingList.applyFilters()">
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">성명</label>
                                <input type="text" id="meeting-filter-student-name" placeholder="성명"
                                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                       onkeypress="if(event.key==='Enter') MeetingList.applyFilters()">
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도교수명</label>
                                <input type="text" id="meeting-filter-advisor" placeholder="지도교수명"
                                       class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;"
                                       onkeypress="if(event.key==='Enter') MeetingList.applyFilters()">
                            </div>

                            <!-- 3행 -->
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">지도방식</label>
                                <select id="meeting-filter-method" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="online">온라인</option>
                                    <option value="offline">오프라인</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs font-medium text-gray-700 whitespace-nowrap" style="width: 85px;">상태</label>
                                <select id="meeting-filter-confirm" class="flex-1 px-2 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary" style="height: 34px;">
                                    <option value="">전체</option>
                                    <option value="pending">대기</option>
                                    <option value="approved,confirmed">확정</option>
                                    <option value="completed">완료</option>
                                    <option value="cancelled">취소</option>
                                </select>
                            </div>
                            <div class="col-span-2"></div>
                            <div class="flex items-center justify-end gap-2">
                                <button onclick="MeetingList.applyFilters()" class="px-3 bg-[#6A0028] text-white rounded hover:bg-[#4A001C] text-xs font-medium" style="height: 34px;">
                                    <i class="fas fa-search mr-1"></i>조회
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 테이블 영역 -->
                <div class="bg-white rounded-lg shadow-md">
                    <div class="table-container">
                        <div class="table-header">
                            <div class="table-header-left">
                                <h3 class="table-title">미팅 목록</h3>
                                <span class="table-count" id="meeting-count">(총 0건)</span>
                            </div>
                            <div class="table-header-right">
                                <button onclick="DirectMeetingModal.open()" class="btn-primary text-xs">
                                    <i class="fas fa-plus mr-1"></i>직접 등록
                                </button>
                                <button onclick="AvailableSlotModal.open()" class="btn-secondary text-xs">
                                    <i class="fas fa-clock mr-1"></i>지도가능 시간등록
                                </button>
                                <button onclick="ManageSlotsModal.open()" class="btn-secondary text-xs">
                                    <i class="fas fa-list mr-1"></i>지도가능 시간관리
                                </button>
                            </div>
                        </div>
                        <div class="table-scroll">
                            <table class="min-w-full">
                                <thead>
                                    <tr>
                                        <th>순번</th>
                                        <th>학년도</th>
                                        <th>학기</th>
                                        <th>대학구분</th>
                                        <th>계열/대학원</th>
                                        <th>학부(과)전공</th>
                                        <th>학과/전공</th>
                                        <th>학위과정</th>
                                        <th>학적상태</th>
                                        <th>학번</th>
                                        <th>성명</th>
                                        <th>지도교수명</th>
                                        <th>미팅일시</th>
                                        <th>지도방식</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody id="meeting-table-body">
                                    <!-- JavaScript로 동적 렌더링 -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 상세 화면 (초기 숨김) -->
            <div id="meeting-detail-view" style="display: none;">
                <!-- JavaScript로 동적 렌더링 -->
            </div>

            <!-- 모달들 -->
            ${AvailableSlotModal.render()}
            ${DirectMeetingModal.render()}
            ${ManageSlotsModal.render()}
        `;
    },

    /**
     * 필터 적용 및 테이블 렌더링
     */
    applyFilters() {
        const filters = {
            academicYear: document.getElementById('meeting-filter-year').value,
            semester: document.getElementById('meeting-filter-semester').value,
            collegeType: document.getElementById('meeting-filter-college-type').value,
            division: document.getElementById('meeting-filter-division').value,
            undergradMajor: document.getElementById('meeting-filter-undergrad').value,
            department: document.getElementById('meeting-filter-department').value,
            degreeType: document.getElementById('meeting-filter-degree').value,
            enrollmentStatus: document.getElementById('meeting-filter-status').value,
            studentNumber: document.getElementById('meeting-filter-student-number').value,
            studentName: document.getElementById('meeting-filter-student-name').value,
            advisorName: document.getElementById('meeting-filter-advisor').value,
            meetingType: document.getElementById('meeting-filter-method').value,
            status: []
        };

        // 확정여부 필터 처리
        const confirmFilter = document.getElementById('meeting-filter-confirm').value;
        if (confirmFilter) {
            filters.status = confirmFilter.split(',');
        }

        // 데이터 가져오기
        this.allMeetings = DataServiceV3.getAllMeetings(filters);

        // 테이블 렌더링
        this.renderTable();
    },

    /**
     * 필터 초기화
     */
    resetFilters() {
        document.getElementById('meeting-filter-year').value = '2025';
        document.getElementById('meeting-filter-semester').value = '1';
        document.getElementById('meeting-filter-college-type').value = '';
        document.getElementById('meeting-filter-division').value = '';
        document.getElementById('meeting-filter-undergrad').value = '';
        document.getElementById('meeting-filter-department').value = '';
        document.getElementById('meeting-filter-degree').value = '';
        document.getElementById('meeting-filter-status').value = '';
        document.getElementById('meeting-filter-student-number').value = '';
        document.getElementById('meeting-filter-student-name').value = '';
        document.getElementById('meeting-filter-advisor').value = '';
        document.getElementById('meeting-filter-method').value = '';
        document.getElementById('meeting-filter-confirm').value = '';

        this.applyFilters();
    },

    /**
     * 테이블 렌더링
     */
    renderTable() {
        const tbody = document.getElementById('meeting-table-body');
        const countSpan = document.getElementById('meeting-count');

        if (!tbody) return;

        countSpan.textContent = `(총 ${this.allMeetings.length}건)`;

        if (this.allMeetings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="15" class="text-center text-gray-500 py-8">
                        검색 결과가 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.allMeetings.map((meeting, index) => {
            const statusText = MeetingStatusUtils.getStatusText(meeting.status);
            const meetingTypeText = MeetingTypeUtils.getMeetingTypeText(meeting);
            const meetingMethodText = MeetingTypeUtils.getMeetingMethodText(meeting.meetingType);
            const dateTimeText = MeetingUtils.formatDateTime(meeting.selectedDate || meeting.date, meeting.selectedTime || meeting.startTime);

            return `
                <tr onclick="MeetingList.showDetail('${meeting.id}')" style="cursor: pointer;">
                    <td>${index + 1}</td>
                    <td>${meeting.academicYear || '-'}</td>
                    <td>${meeting.semester || '-'}학기</td>
                    <td>${meeting.collegeType || '-'}</td>
                    <td>${meeting.division || '-'}</td>
                    <td>${meeting.undergradMajor || '-'}</td>
                    <td>${meeting.department || '-'}</td>
                    <td>${meeting.degreeType || '-'}</td>
                    <td>${meeting.enrollmentStatus || '-'}</td>
                    <td>${meeting.studentNumber || '-'}</td>
                    <td>${meeting.studentName || '-'}</td>
                    <td>${meeting.advisorName || '-'}</td>
                    <td>${dateTimeText}</td>
                    <td>${meetingMethodText}</td>
                    <td>${statusText}</td>
                </tr>
            `;
        }).join('');
    },

    /**
     * 상세 화면으로 이동
     */
    showDetail(meetingId) {
        if (typeof MeetingMain !== 'undefined' && typeof MeetingMain.showDetail === 'function') {
            MeetingMain.showDetail(meetingId);
        }
    },

    /**
     * 목록 새로고침
     */
    refresh() {
        this.applyFilters();
    }
};

// 전역 export
window.MeetingList = MeetingList;

console.log('meeting-v3-list.js loaded');
