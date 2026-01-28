// ==================== 미팅 관리 V3 유틸리티 함수 ====================

const MeetingUtils = {
    formatDateTime(date, time) {
        if (!date) return '-';
        const dateObj = new Date(date);
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[dateObj.getDay()];
        const formattedTime = time || '';
        return `${date} (${dayName}) ${formattedTime}`.trim();
    },

    formatDate(date) {
        if (!date) return '-';
        const dateObj = new Date(date);
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[dateObj.getDay()];
        return `${date} (${dayName})`;
    },

    formatDuration(minutes) {
        if (!minutes) return '-';
        if (minutes < 60) return `${minutes}분`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (mins === 0) return `${hours}시간`;
        return `${hours}시간 ${mins}분`;
    },

    getDayName(dayOfWeek) {
        const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        return dayNames[dayOfWeek] || '-';
    },

    extractDate(isoString) {
        if (!isoString) return '-';
        return isoString.split('T')[0];
    },

    extractTime(isoString) {
        if (!isoString) return '-';
        const time = isoString.split('T')[1];
        if (!time) return '-';
        return time.substring(0, 5);
    }
};

const MeetingStatusUtils = {
    getStatusBadge(status) {
        const badges = {
            'pending': '<span class="badge badge-warning">대기</span>',
            'approved': '<span class="badge badge-success">확정</span>',
            'confirmed': '<span class="badge badge-success">확정</span>',
            'completed': '<span class="badge badge-secondary">완료</span>',
            'rejected': '<span class="badge badge-danger">거절</span>',
            'cancelled': '<span class="badge badge-danger">취소</span>'
        };
        return badges[status] || `<span class="badge badge-secondary">${status}</span>`;
    },

    getStatusText(status) {
        const texts = {
            'pending': '대기',
            'approved': '확정',
            'confirmed': '확정',
            'completed': '완료',
            'rejected': '거절',
            'cancelled': '취소'
        };
        return texts[status] || status;
    },

    getStatusColor(status) {
        const colors = {
            'pending': 'text-yellow-600',
            'approved': 'text-green-600',
            'confirmed': 'text-green-600',
            'completed': 'text-gray-600',
            'rejected': 'text-red-600',
            'cancelled': 'text-red-600'
        };
        return colors[status] || 'text-gray-600';
    }
};

const MeetingTypeUtils = {
    getMeetingMethodText(meetingType) {
        const texts = {
            'online': '온라인',
            'offline': '오프라인',
            'both': '온/오프'
        };
        return texts[meetingType] || meetingType;
    },

    getMeetingTypeText(meeting) {
        if (meeting.displayType) {
            return meeting.displayType;
        }

        if (meeting.type === 'individual') {
            return '1:1 (신청)';
        }

        if (meeting.type === 'direct_individual') {
            return '1:1 (직접)';
        }

        if (meeting.type === 'group') {
            return `그룹 (${meeting.participantCount || meeting.participants?.length || 0}명)`;
        }

        return '-';
    },

    getMeetingMethodIcon(meetingType) {
        const icons = {
            'online': '<i class="fas fa-video"></i>',
            'offline': '<i class="fas fa-users"></i>',
            'both': '<i class="fas fa-comment"></i>'
        };
        return icons[meetingType] || '';
    }
};

const ZoomUtils = {
    copyZoomLink(url) {
        if (!url) {
            alert('Zoom 링크가 없습니다.');
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    alert('Zoom 링크가 클립보드에 복사되었습니다.');
                })
                .catch(err => {
                    console.error('클립보드 복사 실패:', err);
                    this.fallbackCopy(url);
                });
        } else {
            this.fallbackCopy(url);
        }
    },

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            alert('Zoom 링크가 클립보드에 복사되었습니다.');
        } catch (err) {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다. 수동으로 복사해주세요.');
        }

        document.body.removeChild(textarea);
    },

    renderZoomInfoCard(meeting, showActions = true) {
        if (!meeting.zoomMeetingId || meeting.meetingType !== 'online') {
            return '<p class="text-gray-500">온라인 미팅이 아니거나 Zoom 정보가 없습니다.</p>';
        }

        return `
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                    <i class="fas fa-video text-blue-600"></i>
                    <h4 class="text-lg font-semibold text-gray-900">Zoom 미팅 정보</h4>
                </div>

                <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-600">미팅 ID:</span>
                            <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                                ${meeting.zoomMeetingId}
                            </div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">비밀번호:</span>
                            <div class="mt-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                                ${meeting.zoomPassword || '-'}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-sm text-gray-600">참여 링크:</span>
                            ${showActions ? `
                                <button onclick="ZoomUtils.copyZoomLink('${meeting.zoomJoinUrl}')"
                                        class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                                    복사
                                </button>
                            ` : ''}
                        </div>
                        <input type="text" value="${meeting.zoomJoinUrl}" readonly
                               class="w-full px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                    </div>
                </div>
            </div>
        `;
    }
};

const StudentInfoUtils = {
    getStudentSummary(student) {
        if (!student) return '-';
        return `${student.studentName || student.name || '-'} (${student.studentNumber || '-'})`;
    },

    getFullStudentInfo(student) {
        if (!student) return '-';
        return [
            `학번: ${student.studentNumber || '-'}`,
            `성명: ${student.studentName || student.name || '-'}`,
            `학과: ${student.department || '-'}`,
            `학위: ${student.degreeType || '-'}`,
            `상태: ${student.enrollmentStatus === '재학' ? '재학' : '휴학'}`
        ].join(' | ');
    }
};

const ValidationUtils = {
    validateRequired(fields) {
        for (const [name, value] of Object.entries(fields)) {
            if (!value || value.trim() === '') {
                return {
                    isValid: false,
                    message: `${name}을(를) 입력해주세요.`
                };
            }
        }
        return { isValid: true, message: '' };
    },

    validateFutureDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return {
                isValid: false,
                message: '과거 날짜는 선택할 수 없습니다.'
            };
        }
        return { isValid: true, message: '' };
    }
};

// 전역 export
window.MeetingUtils = MeetingUtils;
window.MeetingStatusUtils = MeetingStatusUtils;
window.MeetingTypeUtils = MeetingTypeUtils;
window.ZoomUtils = ZoomUtils;
window.StudentInfoUtils = StudentInfoUtils;
window.ValidationUtils = ValidationUtils;

console.log('meeting-v3-utils.js loaded');
