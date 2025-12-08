# 권한 관리 시스템 구현 방안

## 1. 현황 분석

### 1.1 현재 시스템 구조

**3개의 독립된 역할 기반 인터페이스**:
- **학생 (Student)**: `student/student-dashboard.html`
- **교수 (Professor)**: `professor/professor-dashboard.html`
- **관리자 (Admin)**: `admin/admin-dashboard.html`

**현재 인증 방식**:
- Mock 데이터 기반 프로토타입
- 역할 선택 페이지 (`index.html`)에서 수동 선택
- 실제 인증/인가 시스템 미구현

**메뉴 구조**:
- 각 역할별로 고정된 사이드바 메뉴
- HTML에 하드코딩된 메뉴 항목
- 역할별 접근 제어 없음

### 1.2 요구사항

#### 기본 요구사항
1. **역할 기반 접근 제어 (RBAC)**: 학생, 교수, 관리자 역할 구분
2. **메뉴 권한 관리**: 역할에 따른 메뉴 표시/숨김
3. **기능 권한 관리**: 특정 기능(생성/수정/삭제/조회)에 대한 권한 제어
4. **동적 권한 부여**: 관리자가 권한을 동적으로 조정 가능
5. **권한 검증**: 프론트엔드 및 백엔드(향후) 권한 검증

#### 확장 요구사항
1. **세밀한 권한 제어**: 데이터 레벨 권한 (예: 자신의 논문만 조회)
2. **권한 상속**: 역할 계층 구조 (예: 관리자는 모든 권한 보유)
3. **권한 로그**: 권한 변경 이력 추적
4. **권한 그룹**: 여러 권한을 묶어서 관리

## 2. 설계 방안

### 2.1 권한 관리 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                   권한 관리 시스템                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────┐  │
│  │  역할 (Role)   │  │  권한 (Perm)   │  │  사용자   │  │
│  ├────────────────┤  ├────────────────┤  ├──────────┤  │
│  │ - 관리자       │  │ - 메뉴 접근    │  │ - ID     │  │
│  │ - 교수         │  │ - 기능 실행    │  │ - 역할   │  │
│  │ - 학생         │  │ - 데이터 조회  │  │ - 권한   │  │
│  │ - (사용자정의) │  │ - 데이터 수정  │  └──────────┘  │
│  └────────────────┘  └────────────────┘                 │
│           │                   │                          │
│           └───────┬───────────┘                          │
│                   ▼                                      │
│         ┌───────────────────┐                           │
│         │ 역할-권한 매핑     │                           │
│         │  (Role-Permission) │                           │
│         └───────────────────┘                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2.2 데이터 구조

#### 2.2.1 역할 (Role)

```javascript
const mockRoles = [
    {
        id: 'ROLE_ADMIN',
        name: '관리자',
        code: 'admin',
        description: '시스템 전체 관리 권한',
        level: 1,  // 높을수록 상위 권한
        isSystem: true  // 시스템 역할 (삭제 불가)
    },
    {
        id: 'ROLE_PROFESSOR',
        name: '교수',
        code: 'professor',
        description: '논문지도 및 심사 권한',
        level: 2,
        isSystem: true
    },
    {
        id: 'ROLE_STUDENT',
        name: '학생',
        code: 'student',
        description: '논문 제출 및 조회 권한',
        level: 3,
        isSystem: true
    },
    {
        id: 'ROLE_STAFF',
        name: '행정직원',
        code: 'staff',
        description: '행정 업무 처리 권한',
        level: 2,
        isSystem: false  // 사용자 정의 역할
    }
];
```

#### 2.2.2 권한 (Permission)

```javascript
const mockPermissions = [
    // 메뉴 접근 권한
    {
        id: 'PERM_MENU_DASHBOARD',
        name: '대시보드 접근',
        code: 'menu.dashboard',
        category: 'menu',
        description: '대시보드 메뉴 접근 권한'
    },
    {
        id: 'PERM_MENU_RESEARCH_PROPOSAL',
        name: '연구계획서 메뉴 접근',
        code: 'menu.research_proposal',
        category: 'menu',
        description: '연구계획서 관리 메뉴 접근'
    },

    // 기능 실행 권한 (CRUD)
    {
        id: 'PERM_RESEARCH_PROPOSAL_VIEW',
        name: '연구계획서 조회',
        code: 'research_proposal.view',
        category: 'feature',
        description: '연구계획서 조회 권한'
    },
    {
        id: 'PERM_RESEARCH_PROPOSAL_CREATE',
        name: '연구계획서 생성',
        code: 'research_proposal.create',
        category: 'feature',
        description: '연구계획서 생성 권한'
    },
    {
        id: 'PERM_RESEARCH_PROPOSAL_UPDATE',
        name: '연구계획서 수정',
        code: 'research_proposal.update',
        category: 'feature',
        description: '연구계획서 수정 권한'
    },
    {
        id: 'PERM_RESEARCH_PROPOSAL_DELETE',
        name: '연구계획서 삭제',
        code: 'research_proposal.delete',
        category: 'feature',
        description: '연구계획서 삭제 권한'
    },

    // 데이터 레벨 권한
    {
        id: 'PERM_RESEARCH_PROPOSAL_VIEW_ALL',
        name: '모든 연구계획서 조회',
        code: 'research_proposal.view_all',
        category: 'data',
        description: '모든 학생의 연구계획서 조회 권한'
    },
    {
        id: 'PERM_RESEARCH_PROPOSAL_VIEW_OWN',
        name: '본인 연구계획서 조회',
        code: 'research_proposal.view_own',
        category: 'data',
        description: '본인의 연구계획서만 조회 권한'
    },
    {
        id: 'PERM_RESEARCH_PROPOSAL_VIEW_ASSIGNED',
        name: '담당 학생 연구계획서 조회',
        code: 'research_proposal.view_assigned',
        category: 'data',
        description: '지도학생의 연구계획서 조회 권한'
    },

    // 관리자 전용 권한
    {
        id: 'PERM_ADMIN_ROLE_MANAGE',
        name: '역할 관리',
        code: 'admin.role.manage',
        category: 'admin',
        description: '역할 생성/수정/삭제 권한'
    },
    {
        id: 'PERM_ADMIN_PERMISSION_MANAGE',
        name: '권한 관리',
        code: 'admin.permission.manage',
        category: 'admin',
        description: '권한 부여/회수 권한'
    },
    {
        id: 'PERM_ADMIN_USER_MANAGE',
        name: '사용자 관리',
        code: 'admin.user.manage',
        category: 'admin',
        description: '사용자 생성/수정/삭제 권한'
    }
];
```

#### 2.2.3 역할-권한 매핑

```javascript
const mockRolePermissions = [
    // 관리자 - 모든 권한
    {
        roleId: 'ROLE_ADMIN',
        permissionIds: [
            // 모든 권한 포함 (또는 wildcard: '*')
            'PERM_MENU_DASHBOARD',
            'PERM_MENU_RESEARCH_PROPOSAL',
            'PERM_RESEARCH_PROPOSAL_VIEW',
            'PERM_RESEARCH_PROPOSAL_CREATE',
            'PERM_RESEARCH_PROPOSAL_UPDATE',
            'PERM_RESEARCH_PROPOSAL_DELETE',
            'PERM_RESEARCH_PROPOSAL_VIEW_ALL',
            'PERM_ADMIN_ROLE_MANAGE',
            'PERM_ADMIN_PERMISSION_MANAGE',
            'PERM_ADMIN_USER_MANAGE'
        ]
    },

    // 교수 - 지도학생 관련 권한
    {
        roleId: 'ROLE_PROFESSOR',
        permissionIds: [
            'PERM_MENU_DASHBOARD',
            'PERM_MENU_RESEARCH_PROPOSAL',
            'PERM_RESEARCH_PROPOSAL_VIEW',
            'PERM_RESEARCH_PROPOSAL_VIEW_ASSIGNED',  // 지도학생만
            'PERM_RESEARCH_PROPOSAL_UPDATE'  // 피드백 작성
        ]
    },

    // 학생 - 본인 데이터만
    {
        roleId: 'ROLE_STUDENT',
        permissionIds: [
            'PERM_MENU_DASHBOARD',
            'PERM_MENU_RESEARCH_PROPOSAL',
            'PERM_RESEARCH_PROPOSAL_VIEW',
            'PERM_RESEARCH_PROPOSAL_VIEW_OWN',  // 본인 것만
            'PERM_RESEARCH_PROPOSAL_CREATE',
            'PERM_RESEARCH_PROPOSAL_UPDATE'  // 본인 것만
        ]
    }
];
```

#### 2.2.4 사용자 (User)

```javascript
const mockUsers = [
    {
        id: 'USER_ADMIN_001',
        username: 'admin',
        name: '시스템 관리자',
        roleId: 'ROLE_ADMIN',
        email: 'admin@hycu.ac.kr',
        department: null,
        employeeNumber: null,
        studentNumber: null,
        status: 'active'
    },
    {
        id: 'USER_PROF_001',
        username: 'prof001',
        name: '김교수',
        roleId: 'ROLE_PROFESSOR',
        email: 'kim@hycu.ac.kr',
        department: '컴퓨터공학과',
        employeeNumber: 'P2020001',
        studentNumber: null,
        status: 'active'
    },
    {
        id: 'USER_STU_001',
        username: 'stu001',
        name: '김학생',
        roleId: 'ROLE_STUDENT',
        email: 'stu001@hycu.ac.kr',
        department: '컴퓨터공학과',
        employeeNumber: null,
        studentNumber: '2024001',
        status: 'active'
    }
];
```

### 2.3 메뉴 권한 매핑

```javascript
const mockMenus = [
    // 관리자 메뉴
    {
        id: 'MENU_ADMIN_DASHBOARD',
        name: '대시보드',
        path: 'dashboard',
        icon: 'home',
        requiredPermissions: ['PERM_MENU_DASHBOARD'],
        roles: ['ROLE_ADMIN'],
        order: 1
    },
    {
        id: 'MENU_ADMIN_RESEARCH_PROPOSAL',
        name: '연구계획서 제출 현황',
        path: 'researchProposal',
        icon: 'document',
        requiredPermissions: ['PERM_MENU_RESEARCH_PROPOSAL'],
        roles: ['ROLE_ADMIN'],
        order: 2
    },
    {
        id: 'MENU_ADMIN_STAGE_MGMT',
        name: '논문지도 단계 관리',
        path: 'stageManagement',
        icon: 'settings',
        requiredPermissions: ['PERM_MENU_STAGE_MANAGEMENT'],
        roles: ['ROLE_ADMIN'],
        order: 10
    },

    // 교수 메뉴
    {
        id: 'MENU_PROF_DASHBOARD',
        name: '대시보드',
        path: 'dashboard',
        icon: 'home',
        requiredPermissions: ['PERM_MENU_DASHBOARD'],
        roles: ['ROLE_PROFESSOR'],
        order: 1
    },
    {
        id: 'MENU_PROF_STUDENTS',
        name: '지도학생 관리',
        path: 'students',
        icon: 'users',
        requiredPermissions: ['PERM_MENU_STUDENTS'],
        roles: ['ROLE_PROFESSOR'],
        order: 2
    },

    // 학생 메뉴
    {
        id: 'MENU_STU_DASHBOARD',
        name: '대시보드',
        path: 'dashboard',
        icon: 'home',
        requiredPermissions: ['PERM_MENU_DASHBOARD'],
        roles: ['ROLE_STUDENT'],
        order: 1
    },
    {
        id: 'MENU_STU_MY_THESIS',
        name: '나의 논문',
        path: 'myThesis',
        icon: 'document',
        requiredPermissions: ['PERM_MENU_MY_THESIS'],
        roles: ['ROLE_STUDENT'],
        order: 2
    }
];
```

## 3. 구현 방안

### 3.1 Phase 1: 기본 권한 시스템 구축

#### 3.1.1 Mock 데이터 추가

**파일**: `admin/assets/js/mockData.js`

```javascript
// 역할, 권한, 역할-권한 매핑, 사용자, 메뉴 데이터 추가
// (위 2.2절의 데이터 구조 참고)
```

#### 3.1.2 권한 검증 유틸리티

**파일**: `common-permission.js` (새로 생성)

```javascript
// 권한 검증 유틸리티 클래스
class PermissionManager {
    constructor() {
        this.currentUser = null;
        this.userPermissions = [];
    }

    // 사용자 설정
    setCurrentUser(user) {
        this.currentUser = user;
        this.loadUserPermissions();
    }

    // 사용자 권한 로드
    loadUserPermissions() {
        if (!this.currentUser) return;

        const role = mockRoles.find(r => r.id === this.currentUser.roleId);
        if (!role) return;

        const rolePermission = mockRolePermissions.find(rp => rp.roleId === role.id);
        if (!rolePermission) return;

        this.userPermissions = rolePermission.permissionIds;
    }

    // 권한 체크
    hasPermission(permissionCode) {
        const permission = mockPermissions.find(p => p.code === permissionCode);
        if (!permission) return false;

        return this.userPermissions.includes(permission.id);
    }

    // 여러 권한 중 하나라도 있는지 체크 (OR)
    hasAnyPermission(permissionCodes) {
        return permissionCodes.some(code => this.hasPermission(code));
    }

    // 모든 권한이 있는지 체크 (AND)
    hasAllPermissions(permissionCodes) {
        return permissionCodes.every(code => this.hasPermission(code));
    }

    // 역할 체크
    hasRole(roleCode) {
        if (!this.currentUser) return false;
        const role = mockRoles.find(r => r.id === this.currentUser.roleId);
        return role && role.code === roleCode;
    }

    // 메뉴 접근 가능 여부
    canAccessMenu(menuId) {
        const menu = mockMenus.find(m => m.id === menuId);
        if (!menu) return false;

        // 역할 체크
        const role = mockRoles.find(r => r.id === this.currentUser.roleId);
        if (!menu.roles.includes(role.id)) return false;

        // 권한 체크
        return this.hasAllPermissions(menu.requiredPermissions.map(p => {
            const perm = mockPermissions.find(perm => perm.id === p);
            return perm ? perm.code : '';
        }));
    }

    // 사용자 메뉴 목록 가져오기
    getUserMenus() {
        if (!this.currentUser) return [];

        const role = mockRoles.find(r => r.id === this.currentUser.roleId);
        if (!role) return [];

        return mockMenus
            .filter(menu => menu.roles.includes(role.id))
            .filter(menu => this.canAccessMenu(menu.id))
            .sort((a, b) => a.order - b.order);
    }
}

// 전역 인스턴스
const permissionManager = new PermissionManager();
```

#### 3.1.3 동적 메뉴 렌더링

**파일**: 각 대시보드 HTML 파일 수정

```javascript
// 사이드바 메뉴를 동적으로 생성
function renderSidebar() {
    const menus = permissionManager.getUserMenus();
    const sidebarNav = document.getElementById('sidebar-nav');

    sidebarNav.innerHTML = menus.map(menu => `
        <a href="#" data-view="${menu.path}" class="sidebar-link">
            <svg class="w-6 h-6"><!-- 아이콘 --></svg>
            <span class="ml-4">${menu.name}</span>
        </a>
    `).join('');
}
```

#### 3.1.4 기능 권한 검증

**예시**: 버튼 표시/숨김

```javascript
// 삭제 버튼은 삭제 권한이 있을 때만 표시
function renderActionButtons(item) {
    let html = `
        <button onclick="viewDetail('${item.id}')">조회</button>
    `;

    if (permissionManager.hasPermission('research_proposal.update')) {
        html += `<button onclick="editItem('${item.id}')">수정</button>`;
    }

    if (permissionManager.hasPermission('research_proposal.delete')) {
        html += `<button onclick="deleteItem('${item.id}')">삭제</button>`;
    }

    return html;
}
```

### 3.2 Phase 2: 관리자 권한 관리 화면

#### 3.2.1 역할 관리 화면

**파일**: `admin/admin_views.js` 추가

```javascript
roleManagement: () => {
    const roles = mockRoles;
    return `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold">역할 관리</h3>
                    <button onclick="openRoleModal()" class="btn-primary">
                        + 역할 추가
                    </button>
                </div>
            </div>
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th>역할명</th>
                        <th>코드</th>
                        <th>설명</th>
                        <th>레벨</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    ${roles.map(role => `
                        <tr>
                            <td>${role.name}</td>
                            <td>${role.code}</td>
                            <td>${role.description}</td>
                            <td>${role.level}</td>
                            <td>
                                <button onclick="editRole('${role.id}')">수정</button>
                                ${!role.isSystem ? `<button onclick="deleteRole('${role.id}')">삭제</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}
```

#### 3.2.2 권한 관리 화면

**파일**: `admin/admin_views.js` 추가

```javascript
permissionManagement: () => {
    const permissions = mockPermissions;
    const categories = [...new Set(permissions.map(p => p.category))];

    return `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <h3 class="text-lg font-bold">권한 관리</h3>
            </div>
            ${categories.map(category => `
                <div class="p-6 border-b">
                    <h4 class="font-bold mb-4">${getCategoryName(category)}</h4>
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th>권한명</th>
                                <th>코드</th>
                                <th>설명</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${permissions
                                .filter(p => p.category === category)
                                .map(perm => `
                                    <tr>
                                        <td>${perm.name}</td>
                                        <td><code>${perm.code}</code></td>
                                        <td>${perm.description}</td>
                                    </tr>
                                `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}
        </div>
    `;
}
```

#### 3.2.3 역할-권한 매핑 화면

**파일**: `admin/admin_views.js` 추가

```javascript
rolePermissionMapping: () => {
    const roles = mockRoles;
    const permissions = mockPermissions;

    return `
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
                <h3 class="text-lg font-bold">역할별 권한 설정</h3>
            </div>
            <div class="p-6">
                <label>역할 선택:</label>
                <select id="role-select" onchange="loadRolePermissions(this.value)">
                    ${roles.map(role => `
                        <option value="${role.id}">${role.name}</option>
                    `).join('')}
                </select>

                <div id="permission-checkboxes" class="mt-6">
                    <!-- 동적으로 로드됨 -->
                </div>

                <button onclick="saveRolePermissions()" class="btn-primary mt-4">
                    저장
                </button>
            </div>
        </div>
    `;
}
```

**권한 체크박스 동적 로드**:

```javascript
function loadRolePermissions(roleId) {
    const rolePermission = mockRolePermissions.find(rp => rp.roleId === roleId);
    const selectedPermissions = rolePermission ? rolePermission.permissionIds : [];

    const categories = [...new Set(mockPermissions.map(p => p.category))];
    const container = document.getElementById('permission-checkboxes');

    container.innerHTML = categories.map(category => `
        <div class="mb-6">
            <h4 class="font-bold mb-3">${getCategoryName(category)}</h4>
            <div class="grid grid-cols-2 gap-3">
                ${mockPermissions
                    .filter(p => p.category === category)
                    .map(perm => `
                        <label class="flex items-center">
                            <input type="checkbox"
                                   value="${perm.id}"
                                   ${selectedPermissions.includes(perm.id) ? 'checked' : ''}
                                   class="mr-2">
                            <span>${perm.name}</span>
                        </label>
                    `).join('')}
            </div>
        </div>
    `).join('');
}

function saveRolePermissions() {
    const roleId = document.getElementById('role-select').value;
    const checkboxes = document.querySelectorAll('#permission-checkboxes input[type="checkbox"]:checked');
    const permissionIds = Array.from(checkboxes).map(cb => cb.value);

    // mockRolePermissions 업데이트
    const index = mockRolePermissions.findIndex(rp => rp.roleId === roleId);
    if (index >= 0) {
        mockRolePermissions[index].permissionIds = permissionIds;
    } else {
        mockRolePermissions.push({ roleId, permissionIds });
    }

    showToast('권한이 저장되었습니다.', 'success');
}
```

### 3.3 Phase 3: 데이터 레벨 권한 검증

#### 3.3.1 필터링 함수

```javascript
// 사용자가 볼 수 있는 연구계획서만 필터링
function getFilteredResearchProposals() {
    let proposals = mockResearchProposals;

    if (permissionManager.hasPermission('research_proposal.view_all')) {
        // 관리자: 모든 데이터
        return proposals;
    } else if (permissionManager.hasPermission('research_proposal.view_assigned')) {
        // 교수: 지도학생 것만
        const advisorAssignments = mockAdvisorAssignments.filter(
            aa => aa.mainAdvisorId === permissionManager.currentUser.id
        );
        const studentIds = advisorAssignments.map(aa => aa.studentId);
        return proposals.filter(p => studentIds.includes(p.studentId));
    } else if (permissionManager.hasPermission('research_proposal.view_own')) {
        // 학생: 본인 것만
        return proposals.filter(p => p.studentId === permissionManager.currentUser.id);
    }

    return [];
}
```

#### 3.3.2 수정/삭제 권한 검증

```javascript
function canEditResearchProposal(proposalId) {
    const proposal = mockResearchProposals.find(p => p.id === proposalId);
    if (!proposal) return false;

    // 수정 권한 체크
    if (!permissionManager.hasPermission('research_proposal.update')) {
        return false;
    }

    // 데이터 레벨 체크
    if (permissionManager.hasPermission('research_proposal.view_all')) {
        // 관리자: 모든 것 수정 가능
        return true;
    } else if (permissionManager.hasPermission('research_proposal.view_own')) {
        // 학생: 본인 것만 수정 가능
        return proposal.studentId === permissionManager.currentUser.id;
    }

    return false;
}
```

### 3.4 Phase 4: 통합 및 테스트

#### 3.4.1 로그인 시뮬레이션

**파일**: `index.html` 수정

```javascript
function loginAs(roleCode) {
    // Mock 사용자 선택
    let user;
    if (roleCode === 'admin') {
        user = mockUsers.find(u => u.roleId === 'ROLE_ADMIN');
    } else if (roleCode === 'professor') {
        user = mockUsers.find(u => u.roleId === 'ROLE_PROFESSOR');
    } else if (roleCode === 'student') {
        user = mockUsers.find(u => u.roleId === 'ROLE_STUDENT');
    }

    // 세션에 저장
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    // 대시보드로 이동
    window.location.href = `${roleCode}/${roleCode}-dashboard.html`;
}
```

#### 3.4.2 대시보드 초기화

**파일**: 각 대시보드 HTML의 초기화 코드

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // 세션에서 사용자 로드
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) {
        // 로그인 페이지로 리다이렉트
        window.location.href = '../index.html';
        return;
    }

    const user = JSON.parse(userJson);
    permissionManager.setCurrentUser(user);

    // 권한에 따라 메뉴 렌더링
    renderSidebar();

    // 기본 뷰 표시
    switchView('dashboard');
});
```

## 4. 메뉴 권한 매핑표

### 4.1 관리자 메뉴

| 메뉴명 | 권한 코드 | 설명 |
|--------|-----------|------|
| 대시보드 | `menu.dashboard` | 관리자 대시보드 |
| 연구계획서 제출 현황 | `menu.research_proposal` | 전체 연구계획서 관리 |
| 논문작성계획서 제출 현황 | `menu.thesis_plan` | 전체 논문작성계획서 관리 |
| 중간논문 제출 현황 | `menu.mid_thesis` | 전체 중간논문 관리 |
| 최종논문 제출 현황 | `menu.final_thesis` | 전체 최종논문 관리 |
| 학술지 심사 신청 현황 | `menu.journal_submission` | 학술지 심사 관리 |
| 논문지도 진행 현황 | `menu.guidance_progress` | 전체 지도 현황 |
| 논문지도 일정 관리 | `menu.schedule_management` | 일정 관리 |
| 논문 제출 요건 관리 | `menu.requirement_management` | 제출 요건 설정 |
| 논문지도 단계 관리 | `menu.stage_management` | 워크플로우 관리 |
| 지도 단계 유형 관리 | `menu.type_management` | 단계 유형 관리 |
| 심사위원 배정 | `menu.committee_assignment` | 심사위원 배정 |
| 평가 기준 관리 | `menu.evaluation_criteria` | 평가표 관리 |
| 지도교수 배정 | `menu.advisor_assignment` | 지도교수 배정 |
| **역할 관리** | `menu.role_management` | 역할 관리 |
| **권한 관리** | `menu.permission_management` | 권한 관리 |
| **역할-권한 매핑** | `menu.role_permission_mapping` | 역할별 권한 설정 |

### 4.2 교수 메뉴

| 메뉴명 | 권한 코드 | 설명 |
|--------|-----------|------|
| 대시보드 | `menu.dashboard` | 교수 대시보드 |
| 지도학생 관리 | `menu.students` | 지도학생 목록 |
| 주차별 논문지도 | `menu.weekly_guidance` | 주차별 지도 기록 |
| 온라인 피드백 | `menu.feedback` | 학생 피드백 작성 |
| 논문심사 관리 | `menu.thesis_review` | 심사 진행 |
| 학술지 심사 관리 | `menu.journal_review` | 학술지 심사 |

### 4.3 학생 메뉴

| 메뉴명 | 권한 코드 | 설명 |
|--------|-----------|------|
| 대시보드 | `menu.dashboard` | 학생 대시보드 |
| 나의 논문지도 계획 | `menu.my_guidance_plan` | 논문 일정 조회 |
| 제출 관리 | `menu.submission` | 논문 제출 |
| 미팅 관리 | `menu.meeting` | 미팅 일정 |
| 피드백 확인 | `menu.feedback_view` | 교수 피드백 확인 |

## 5. 구현 순서

### 5.1 1단계: 데이터 구조 및 유틸리티 (1-2일)
1. `mockData.js`에 역할, 권한, 매핑 데이터 추가
2. `common-permission.js` 권한 검증 유틸리티 작성
3. 단위 테스트

### 5.2 2단계: 동적 메뉴 렌더링 (2-3일)
1. 각 대시보드 HTML에서 하드코딩된 메뉴 제거
2. `renderSidebar()` 함수로 동적 생성
3. 권한에 따른 메뉴 표시/숨김 테스트

### 5.3 3단계: 기능 권한 적용 (3-4일)
1. 버튼/링크에 권한 체크 추가
2. 모달, 폼에 권한 체크 추가
3. 데이터 레벨 필터링 적용

### 5.4 4단계: 관리자 화면 구현 (3-4일)
1. 역할 관리 화면
2. 권한 관리 화면
3. 역할-권한 매핑 화면
4. CRUD 기능 구현

### 5.5 5단계: 통합 테스트 (2-3일)
1. 역할별 시나리오 테스트
2. 권한 변경 후 반영 확인
3. 버그 수정 및 리팩토링

**총 예상 기간**: 11-16일

## 6. 향후 확장 방안

### 6.1 백엔드 연동
- JWT 토큰 기반 인증
- 서버 사이드 권한 검증
- API 엔드포인트별 권한 체크

### 6.2 고급 기능
- 권한 상속 (역할 계층 구조)
- 권한 그룹 (여러 권한을 묶어서 관리)
- 조건부 권한 (시간, 상태에 따른 동적 권한)
- 권한 변경 이력 및 감사 로그
- 2단계 인증 (2FA)

### 6.3 UI/UX 개선
- 권한 부족 시 친절한 안내 메시지
- 권한 요청 워크플로우
- 권한 시각화 (매트릭스 형태)

## 7. 보안 고려사항

1. **프론트엔드 권한 체크는 보안 목적이 아님**: UI 개선 목적
2. **백엔드 권한 검증 필수**: 모든 API 요청에 대해 서버에서 권한 체크
3. **민감한 데이터 암호화**: 역할/권한 정보는 암호화 저장
4. **권한 변경 로그**: 누가 언제 권한을 변경했는지 기록
5. **최소 권한 원칙**: 필요한 최소한의 권한만 부여

## 8. 체크리스트

### Phase 1
- [ ] mockData.js에 역할/권한 데이터 추가
- [ ] common-permission.js 작성
- [ ] PermissionManager 클래스 구현
- [ ] 단위 테스트 작성

### Phase 2
- [ ] 동적 메뉴 렌더링 구현
- [ ] 역할별 메뉴 테스트
- [ ] 권한별 버튼 표시/숨김

### Phase 3
- [ ] 역할 관리 화면
- [ ] 권한 관리 화면
- [ ] 역할-권한 매핑 화면

### Phase 4
- [ ] 데이터 레벨 필터링
- [ ] 수정/삭제 권한 검증
- [ ] 통합 테스트

## 9. 참고 자료

- RBAC (Role-Based Access Control) 표준
- OWASP 권한 관리 베스트 프랙티스
- JWT 기반 인증/인가 가이드

---

**작성일**: 2025-12-09
**버전**: 1.0
**작성자**: Claude AI Assistant
