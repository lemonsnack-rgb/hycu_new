// ==================== 미팅 관리 V3 모달 다이얼로그 ====================

/**
 * 모달 기본 구조
 */
const ModalBase = {
    /**
     * 모달 열기
     */
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    },

    /**
     * 모달 닫기
     */
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    },

    /**
     * 모달 컨테이너 렌더링
     */
    renderContainer(modalId, content) {
        return `
            <div id="${modalId}" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    ${content}
                </div>
            </div>
        `;
    }
};

/**
 * 1. 미팅 가능시간 설정 모달
 */
const AvailableSlotModal = {
    /**
     * 모달 렌더링
     */
    render() {
        return ModalBase.renderContainer('available-slot-modal', `
            <!-- 헤더 -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-900">지도가능 시간 등록</h3>
                <button onclick="AvailableSlotModal.close()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- 본문 -->
            <div class="px-6 py-4">
                <p class="text-sm text-gray-600 mb-6">학생들이 선택할 수 있는 가능한 시간대를 설정합니다.</p>

                <!-- 일정 유형 선택 -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">일정 유형</label>
                    <div class="flex gap-4">
                        <label class="flex items-center cursor-pointer">
                            <input type="radio" name="slot-type" value="oneTime" checked
                                   onchange="AvailableSlotModal.toggleType()"
                                   class="mr-2">
                            <span class="text-sm">특정 날짜 1회</span>
                        </label>
                        <label class="flex items-center cursor-pointer">
                            <input type="radio" name="slot-type" value="repeat"
                                   onchange="AvailableSlotModal.toggleType()"
                                   class="mr-2">
                            <span class="text-sm">반복 일정 (매주)</span>
                        </label>
                    </div>
                </div>

                <!-- 특정 날짜 필드 -->
                <div id="oneTime-fields">
                    <div class="space-y-3 mb-4">
                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">
                                날짜 <span class="text-red-600">*</span>
                            </label>
                            <input type="date" id="slot-date" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                        </div>

                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">
                                시간 <span class="text-red-600">*</span>
                            </label>
                            <input type="time" id="slot-time-oneTime" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                        </div>
                    </div>
                </div>

                <!-- 반복 일정 필드 -->
                <div id="repeat-fields" class="hidden">
                    <div class="space-y-3 mb-4">
                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">
                                요일 <span class="text-red-600">*</span>
                            </label>
                            <select id="slot-dayOfWeek" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                                <option value="">선택하세요</option>
                                <option value="1">월요일</option>
                                <option value="2">화요일</option>
                                <option value="3">수요일</option>
                                <option value="4">목요일</option>
                                <option value="5">금요일</option>
                                <option value="6">토요일</option>
                                <option value="0">일요일</option>
                            </select>
                        </div>

                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">
                                시간 <span class="text-red-600">*</span>
                            </label>
                            <input type="time" id="slot-time" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                        </div>

                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">시작일</label>
                            <input type="date" id="slot-startDate" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                        </div>

                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">종료일</label>
                            <input type="date" id="slot-endDate" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                        </div>
                    </div>
                </div>

                <!-- 공통 필드 -->
                <div class="space-y-3 mb-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">
                            소요 시간 <span class="text-red-600">*</span>
                        </label>
                        <select id="slot-duration" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                            <option value="30">30분</option>
                            <option value="60" selected>60분</option>
                            <option value="90">90분</option>
                            <option value="120">120분</option>
                        </select>
                    </div>

                    <div class="flex items-center gap-2">
                        <label class="text-sm font-medium text-gray-700 whitespace-nowrap" style="width: 100px;">
                            미팅 방식 <span class="text-red-600">*</span>
                        </label>
                        <select id="slot-meetingType" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                            <option value="online">온라인</option>
                            <option value="offline">오프라인</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- 푸터 -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button onclick="AvailableSlotModal.close()"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    취소
                </button>
                <button onclick="AvailableSlotModal.save()"
                        class="px-6 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034]">
                    저장
                </button>
            </div>
        `);
    },

    /**
     * 모달 열기
     */
    open() {
        ModalBase.open('available-slot-modal');

        // 오늘 날짜 기본값 설정 (특정 날짜용)
        const today = new Date().toISOString().split('T')[0];
        const slotDateInput = document.getElementById('slot-date');
        if (slotDateInput) {
            slotDateInput.value = today;
        }

        // 반복 일정용 날짜 기본값
        const slotStartDateInput = document.getElementById('slot-startDate');
        if (slotStartDateInput) {
            slotStartDateInput.value = today;
        }

        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);
        const slotEndDateInput = document.getElementById('slot-endDate');
        if (slotEndDateInput) {
            slotEndDateInput.value = endDate.toISOString().split('T')[0];
        }
    },

    /**
     * 모달 닫기
     */
    close() {
        ModalBase.close('available-slot-modal');
    },

    /**
     * 일정 유형 토글
     */
    toggleType() {
        const type = document.querySelector('input[name="slot-type"]:checked').value;

        if (type === 'oneTime') {
            document.getElementById('oneTime-fields').classList.remove('hidden');
            document.getElementById('repeat-fields').classList.add('hidden');
        } else {
            document.getElementById('oneTime-fields').classList.add('hidden');
            document.getElementById('repeat-fields').classList.remove('hidden');
        }
    },

    /**
     * 저장
     */
    save() {
        const type = document.querySelector('input[name="slot-type"]:checked').value;
        const duration = parseInt(document.getElementById('slot-duration').value);
        const meetingType = document.getElementById('slot-meetingType').value;

        if (type === 'repeat') {
            const dayOfWeek = document.getElementById('slot-dayOfWeek').value;
            const time = document.getElementById('slot-time').value;
            const startDate = document.getElementById('slot-startDate').value;
            const endDate = document.getElementById('slot-endDate').value;

            // 검증
            const validation = ValidationUtils.validateRequired({
                '요일': dayOfWeek,
                '시간': time,
                '시작일': startDate,
                '종료일': endDate
            });

            if (!validation.isValid) {
                alert(validation.message);
                return;
            }

            // 반복 일정 전개: 시작일부터 종료일까지 해당 요일의 모든 날짜 계산
            const dates = this.calculateRepeatDates(startDate, endDate, parseInt(dayOfWeek));

            if (dates.length === 0) {
                alert('선택한 기간에 해당하는 요일이 없습니다.');
                return;
            }

            // 각 날짜마다 개별 일정 생성
            dates.forEach(date => {
                const slotData = {
                    type: 'oneTime',
                    dayOfWeek: null,
                    date: date,
                    time: time,
                    duration: duration,
                    meetingType: meetingType,
                    startDate: date,
                    endDate: date
                };
                DataServiceV3.addAvailableSlot(slotData);
            });

            alert(`${dates.length}개의 가능시간이 등록되었습니다.`);
        } else {
            const date = document.getElementById('slot-date').value;
            const time = document.getElementById('slot-time-oneTime').value;

            // 검증
            const validation = ValidationUtils.validateRequired({
                '날짜': date,
                '시간': time
            });

            if (!validation.isValid) {
                alert(validation.message);
                return;
            }

            const dateValidation = ValidationUtils.validateFutureDate(date);
            if (!dateValidation.isValid) {
                alert(dateValidation.message);
                return;
            }

            const slotData = {
                type: 'oneTime',
                dayOfWeek: null,
                date: date,
                time: time,
                duration: duration,
                meetingType: meetingType,
                startDate: date,
                endDate: date
            };

            DataServiceV3.addAvailableSlot(slotData);

            alert('가능시간이 등록되었습니다.');
        }

        this.close();

        // 목록 새로고침 (필요시)
        if (typeof MeetingList !== 'undefined' && typeof MeetingList.refresh === 'function') {
            MeetingList.refresh();
        }
    },

    /**
     * 반복 일정 날짜 계산
     * @param {string} startDate - 시작일 (YYYY-MM-DD)
     * @param {string} endDate - 종료일 (YYYY-MM-DD)
     * @param {number} targetDayOfWeek - 목표 요일 (0=일, 1=월, ..., 6=토)
     * @returns {string[]} - 해당 요일의 모든 날짜 배열
     */
    calculateRepeatDates(startDate, endDate, targetDayOfWeek) {
        const dates = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        // 시작일부터 종료일까지 순회
        let current = new Date(start);
        while (current <= end) {
            // 현재 날짜의 요일이 목표 요일과 일치하면 추가
            if (current.getDay() === targetDayOfWeek) {
                const dateStr = current.toISOString().split('T')[0];
                dates.push(dateStr);
            }
            // 다음 날로 이동
            current.setDate(current.getDate() + 1);
        }

        return dates;
    }
};

/**
 * 2. 미팅 직접 생성 모달
 */
const DirectMeetingModal = {
    /**
     * 모달 렌더링
     */
    render() {
        const students = DataServiceV3.getAllStudents();

        return ModalBase.renderContainer('direct-meeting-modal', `
            <!-- 헤더 -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-900">미팅 직접 생성</h3>
                <button onclick="DirectMeetingModal.close()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- 본문 -->
            <div class="px-6 py-4">
                <p class="text-sm text-gray-600 mb-6">
                    학생을 선택하여 미팅을 직접 생성합니다. (1명 = 1:1 미팅, 2명 이상 = 그룹 미팅)
                </p>

                <!-- 학생 선택 -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        참여 학생 선택 <span class="text-red-600">*</span>
                    </label>
                    <div class="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                        ${students.map(s => `
                            <label class="flex items-center py-2 hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" name="direct-meeting-students" value="${s.id}" class="mr-3">
                                <div>
                                    <span class="font-medium">${s.name}</span>
                                    <span class="text-sm text-gray-600 ml-2">(${s.studentNumber})</span>
                                    <span class="text-sm text-gray-500 ml-2">${s.department} ${s.degreeType}</span>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                    <p class="text-xs text-gray-500 mt-2">선택된 학생: <span id="selected-count">0</span>명</p>
                </div>

                <!-- 미팅 정보 -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            날짜 <span class="text-red-600">*</span>
                        </label>
                        <input type="date" id="direct-meeting-date"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            시간 <span class="text-red-600">*</span>
                        </label>
                        <input type="time" id="direct-meeting-time"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            소요 시간 <span class="text-red-600">*</span>
                        </label>
                        <select id="direct-meeting-duration"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                            <option value="30">30분</option>
                            <option value="60" selected>60분</option>
                            <option value="90">90분</option>
                            <option value="120">120분</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            미팅 방식 <span class="text-red-600">*</span>
                        </label>
                        <select id="direct-meeting-type"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                            <option value="online">온라인</option>
                            <option value="offline">오프라인</option>
                        </select>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        미팅 주제 <span class="text-red-600">*</span>
                    </label>
                    <input type="text" id="direct-meeting-topic"
                           placeholder="예: 연구방법론 집단 지도"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                </div>
            </div>

            <!-- 푸터 -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button onclick="DirectMeetingModal.close()"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    취소
                </button>
                <button onclick="DirectMeetingModal.create()"
                        class="px-6 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034]">
                    생성
                </button>
            </div>
        `);
    },

    /**
     * 모달 열기
     */
    open() {
        // 오늘 날짜 기본값
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('direct-meeting-date').value = today;

        ModalBase.open('direct-meeting-modal');

        // 선택 카운트 업데이트
        const checkboxes = document.querySelectorAll('input[name="direct-meeting-students"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const count = document.querySelectorAll('input[name="direct-meeting-students"]:checked').length;
                document.getElementById('selected-count').textContent = count;
            });
        });
    },

    /**
     * 모달 닫기
     */
    close() {
        ModalBase.close('direct-meeting-modal');
    },

    /**
     * 미팅 생성
     */
    create() {
        const selectedStudents = Array.from(document.querySelectorAll('input[name="direct-meeting-students"]:checked'))
            .map(cb => cb.value);

        const date = document.getElementById('direct-meeting-date').value;
        const time = document.getElementById('direct-meeting-time').value;
        const duration = parseInt(document.getElementById('direct-meeting-duration').value);
        const meetingType = document.getElementById('direct-meeting-type').value;
        const topic = document.getElementById('direct-meeting-topic').value;

        // 검증
        if (selectedStudents.length === 0) {
            alert('참여 학생을 1명 이상 선택해주세요.');
            return;
        }

        const validation = ValidationUtils.validateRequired({
            '날짜': date,
            '시간': time,
            '미팅 주제': topic
        });

        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        const dateValidation = ValidationUtils.validateFutureDate(date);
        if (!dateValidation.isValid) {
            alert(dateValidation.message);
            return;
        }

        // 미팅 생성
        const meetingData = {
            participantIds: selectedStudents,
            date: date,
            startTime: time,
            duration: duration,
            meetingType: meetingType,
            topic: topic
        };

        const newMeeting = DataServiceV3.createDirectMeeting(meetingData);

        const meetingTypeText = selectedStudents.length === 1 ? '1:1 미팅' : `그룹 미팅 (${selectedStudents.length}명)`;
        alert(`${meetingTypeText}이 생성되었습니다.`);

        this.close();

        // 목록 새로고침
        if (typeof MeetingList !== 'undefined' && typeof MeetingList.refresh === 'function') {
            MeetingList.refresh();
        }
    }
};

/**
 * 3. 가능시간 관리 모달
 */
const ManageSlotsModal = {
    /**
     * 모달 렌더링
     */
    render() {
        const slots = DataServiceV3.getAvailableSlots();

        return ModalBase.renderContainer('manage-slots-modal', `
            <!-- 헤더 -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-900">가능시간 관리</h3>
                <button onclick="ManageSlotsModal.close()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- 본문 -->
            <div class="px-6 py-4">
                <p class="text-sm text-gray-600 mb-4">등록된 가능시간 목록입니다. 삭제할 일정을 선택하세요.</p>

                ${slots.length === 0 ? `
                    <div class="text-center py-12 text-gray-500">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p>등록된 가능시간이 없습니다.</p>
                    </div>
                ` : `
                    <div class="space-y-3 max-h-96 overflow-y-auto">
                        ${slots.map(slot => `
                            <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                                                ${MeetingTypeUtils.getMeetingMethodText(slot.meetingType)}
                                            </span>
                                        </div>

                                        <div class="text-sm text-gray-900">
                                            ${slot.date} ${slot.time}
                                        </div>

                                        <div class="text-xs text-gray-500 mt-1">
                                            소요시간: ${MeetingUtils.formatDuration(slot.duration)}
                                        </div>
                                    </div>

                                    <button onclick="ManageSlotsModal.deleteSlot('${slot.id}')"
                                            class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                                        삭제
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>

            <!-- 푸터 -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button onclick="ManageSlotsModal.close()"
                        class="px-6 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034]">
                    닫기
                </button>
            </div>
        `);
    },

    /**
     * 모달 열기
     */
    open() {
        // 최신 데이터로 다시 렌더링
        const modalHtml = this.render();
        const existingModal = document.getElementById('manage-slots-modal');
        if (existingModal) {
            existingModal.outerHTML = modalHtml;
        } else {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        ModalBase.open('manage-slots-modal');
    },

    /**
     * 모달 닫기
     */
    close() {
        ModalBase.close('manage-slots-modal');
    },

    /**
     * 가능시간 삭제
     */
    deleteSlot(slotId) {
        if (!confirm('이 가능시간을 삭제하시겠습니까?')) {
            return;
        }

        DataServiceV3.deleteAvailableSlot(slotId);
        alert('가능시간이 삭제되었습니다.');

        // 모달 다시 열기 (새로고침)
        this.open();
    }
};

/**
 * 4. 미팅 승인 모달
 */
const ApproveMeetingModal = {
    currentMeetingId: null,

    /**
     * 모달 렌더링
     */
    render(meeting) {
        return ModalBase.renderContainer('approve-meeting-modal', `
            <!-- 헤더 -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-900">지도 예약 승인</h3>
                <button onclick="ApproveMeetingModal.close()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- 본문 -->
            <div class="px-6 py-4">
                <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <h4 class="font-medium text-gray-900 mb-2">미팅 정보</h4>
                    <div class="text-sm text-gray-700 space-y-1">
                        <p><strong>학생:</strong> ${meeting.studentName} (${meeting.studentNumber})</p>
                        <p><strong>일시:</strong> ${MeetingUtils.formatDateTime(meeting.selectedDate, meeting.selectedTime)}</p>
                        <p><strong>방식:</strong> ${MeetingTypeUtils.getMeetingMethodText(meeting.meetingType)}</p>
                        <p><strong>주제:</strong> ${meeting.topic}</p>
                    </div>
                </div>

                ${meeting.meetingType === 'online' ? `
                    <p class="text-sm text-gray-600">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        승인 시 Zoom 미팅 링크가 자동으로 생성됩니다.
                    </p>
                ` : ''}
            </div>

            <!-- 푸터 -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button onclick="ApproveMeetingModal.close()"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    취소
                </button>
                <button onclick="ApproveMeetingModal.confirm()"
                        class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    승인
                </button>
            </div>
        `);
    },

    /**
     * 모달 열기
     */
    open(meetingId) {
        this.currentMeetingId = meetingId;
        const meeting = DataServiceV3.getMeetingById(meetingId);

        if (!meeting) {
            alert('미팅 정보를 찾을 수 없습니다.');
            return;
        }

        const modalHtml = this.render(meeting);
        const existingModal = document.getElementById('approve-meeting-modal');
        if (existingModal) {
            existingModal.outerHTML = modalHtml;
        } else {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        ModalBase.open('approve-meeting-modal');
    },

    /**
     * 모달 닫기
     */
    close() {
        ModalBase.close('approve-meeting-modal');
        this.currentMeetingId = null;
    },

    /**
     * 승인 확인
     */
    confirm() {
        DataServiceV3.approveMeeting(this.currentMeetingId, '');

        alert('미팅이 승인되었습니다.');
        this.close();

        // 목록 새로고침
        if (typeof MeetingList !== 'undefined' && typeof MeetingList.refresh === 'function') {
            MeetingList.refresh();
        }

        // 상세화면에서 호출된 경우 상세화면 새로고침
        if (typeof MeetingDetail !== 'undefined' && typeof MeetingDetail.show === 'function') {
            MeetingDetail.show(this.currentMeetingId);
        }
    }
};

/**
 * 5. 미팅 거절 모달
 */
const RejectMeetingModal = {
    currentMeetingId: null,

    /**
     * 모달 렌더링
     */
    render(meeting) {
        return ModalBase.renderContainer('reject-meeting-modal', `
            <!-- 헤더 -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-900">미팅 거절</h3>
                <button onclick="RejectMeetingModal.close()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- 본문 -->
            <div class="px-6 py-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 class="font-medium text-gray-900 mb-2">미팅 정보</h4>
                    <div class="text-sm text-gray-700 space-y-1">
                        <p><strong>학생:</strong> ${meeting.studentName} (${meeting.studentNumber})</p>
                        <p><strong>일시:</strong> ${MeetingUtils.formatDateTime(meeting.selectedDate, meeting.selectedTime)}</p>
                        <p><strong>주제:</strong> ${meeting.topic}</p>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        거절 사유 <span class="text-red-600">*</span>
                    </label>
                    <textarea id="reject-reason"
                              rows="4"
                              placeholder="거절 사유를 입력하세요."
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]"></textarea>
                </div>
            </div>

            <!-- 푸터 -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button onclick="RejectMeetingModal.close()"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    취소
                </button>
                <button onclick="RejectMeetingModal.confirm()"
                        class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    거절
                </button>
            </div>
        `);
    },

    /**
     * 모달 열기
     */
    open(meetingId) {
        this.currentMeetingId = meetingId;
        const meeting = DataServiceV3.getMeetingById(meetingId);

        if (!meeting) {
            alert('미팅 정보를 찾을 수 없습니다.');
            return;
        }

        const modalHtml = this.render(meeting);
        const existingModal = document.getElementById('reject-meeting-modal');
        if (existingModal) {
            existingModal.outerHTML = modalHtml;
        } else {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        ModalBase.open('reject-meeting-modal');
    },

    /**
     * 모달 닫기
     */
    close() {
        ModalBase.close('reject-meeting-modal');
        this.currentMeetingId = null;
    },

    /**
     * 거절 확인
     */
    confirm() {
        const reason = document.getElementById('reject-reason').value.trim();

        if (!reason) {
            alert('거절 사유를 입력해주세요.');
            return;
        }

        DataServiceV3.rejectMeeting(this.currentMeetingId, reason);

        alert('미팅이 거절되었습니다.');
        this.close();

        // 목록 새로고침
        if (typeof MeetingList !== 'undefined' && typeof MeetingList.refresh === 'function') {
            MeetingList.refresh();
        }

        // 상세화면에서 호출된 경우 목록으로 돌아가기
        if (typeof MeetingMain !== 'undefined' && typeof MeetingMain.showList === 'function') {
            MeetingMain.showList();
        }
    }
};

/**
 * 6. 미팅 완료 모달
 */
const CompleteMeetingModal = {
    currentMeetingId: null,

    /**
     * 모달 렌더링
     */
    render(meeting) {
        return ModalBase.renderContainer('complete-meeting-modal', `
            <!-- 헤더 -->
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-900">미팅 완료 처리</h3>
                <button onclick="CompleteMeetingModal.close()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- 본문 -->
            <div class="px-6 py-4">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        완료 날짜 <span class="text-red-600">*</span>
                    </label>
                    <input type="date" id="complete-date"
                           value="${new Date().toISOString().split('T')[0]}"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0028]">
                </div>
            </div>

            <!-- 푸터 -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button onclick="CompleteMeetingModal.close()"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    취소
                </button>
                <button onclick="CompleteMeetingModal.confirm()"
                        class="px-6 py-2 bg-[#6A0028] text-white rounded-lg hover:bg-[#8A0034]">
                    완료 처리
                </button>
            </div>
        `);
    },

    /**
     * 모달 열기
     */
    open(meetingId) {
        this.currentMeetingId = meetingId;
        const meeting = DataServiceV3.getMeetingById(meetingId);

        if (!meeting) {
            alert('미팅 정보를 찾을 수 없습니다.');
            return;
        }

        const modalHtml = this.render(meeting);
        const existingModal = document.getElementById('complete-meeting-modal');
        if (existingModal) {
            existingModal.outerHTML = modalHtml;
        } else {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        ModalBase.open('complete-meeting-modal');
    },

    /**
     * 모달 닫기
     */
    close() {
        ModalBase.close('complete-meeting-modal');
        this.currentMeetingId = null;
    },

    /**
     * 완료 확인
     */
    confirm() {
        const completedDate = document.getElementById('complete-date').value;

        // 검증 (완료 날짜만 필수)
        const validation = ValidationUtils.validateRequired({
            '완료 날짜': completedDate
        });

        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        // 미팅 정보 가져오기
        const meeting = DataServiceV3.getMeetingById(this.currentMeetingId);

        // 비밀번호 자동 생성 (온라인 미팅만)
        let videoPassword = null;
        if (meeting.meetingType === 'online') {
            const generatePassword = () => {
                const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const lower = 'abcdefghijklmnopqrstuvwxyz';
                const numbers = '0123456789';
                const special = '!@#$%';
                const allChars = upper + lower + numbers + special;

                let password = '';
                password += upper[Math.floor(Math.random() * upper.length)];
                password += lower[Math.floor(Math.random() * lower.length)];
                password += numbers[Math.floor(Math.random() * numbers.length)];
                password += special[Math.floor(Math.random() * special.length)];

                for (let i = 0; i < 4; i++) {
                    password += allChars[Math.floor(Math.random() * allChars.length)];
                }

                return password.split('').sort(() => Math.random() - 0.5).join('');
            };

            videoPassword = generatePassword();
        }

        const data = {
            completedDate,
            videoPassword
        };

        DataServiceV3.completeMeeting(this.currentMeetingId, data);

        alert('미팅이 완료 처리되었습니다.');
        this.close();

        // 목록 새로고침
        if (typeof MeetingList !== 'undefined' && typeof MeetingList.refresh === 'function') {
            MeetingList.refresh();
        }

        // 상세화면에서 호출된 경우 상세화면 새로고침
        if (typeof MeetingDetail !== 'undefined' && typeof MeetingDetail.show === 'function') {
            MeetingDetail.show(this.currentMeetingId);
        }
    }
};

// 전역 export
window.ModalBase = ModalBase;
window.AvailableSlotModal = AvailableSlotModal;
window.DirectMeetingModal = DirectMeetingModal;
window.ManageSlotsModal = ManageSlotsModal;
window.ApproveMeetingModal = ApproveMeetingModal;
window.RejectMeetingModal = RejectMeetingModal;
window.CompleteMeetingModal = CompleteMeetingModal;

console.log('meeting-v3-modals.js loaded');
