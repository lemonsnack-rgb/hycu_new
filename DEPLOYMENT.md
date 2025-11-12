# 배포 가이드

## 파일 구조

```
hycu_new/
├── index.html                              # 루트: 역할 선택 페이지
├── student/
│   ├── index.html                          # 리다이렉트 페이지
│   └── student-dashboard.html              # 학생 대시보드 (메인)
├── professor/
│   ├── index.html                          # 리다이렉트 페이지
│   └── professor-dashboard.html            # 교수 대시보드 (메인)
└── admin/
    ├── index.html                          # 리다이렉트 페이지
    └── admin-dashboard.html                # 관리자 대시보드 (메인)
```

## Vercel 배포 방법

### 1. Vercel CLI를 사용한 배포

```bash
# Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# 프로젝트 루트에서 배포
cd /path/to/hycu_new
vercel

# 프로덕션 배포
vercel --prod
```

### 2. GitHub 연동 자동 배포

1. **Vercel 계정 생성 및 로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - Dashboard에서 "Add New..." → "Project" 클릭
   - GitHub 저장소 연결
   - `lemonsnack-rgb/hycu_new` 저장소 선택

3. **프로젝트 설정**
   - **Framework Preset**: Other (정적 사이트)
   - **Root Directory**: `./` (루트)
   - **Build Command**: 비워두기 (정적 HTML)
   - **Output Directory**: `./` (루트)
   - **Install Command**: 비워두기

4. **배포**
   - "Deploy" 버튼 클릭
   - 배포 완료 후 URL 확인

5. **자동 배포 설정**
   - 이후 `claude/fix-utility-menu-consistency-011CV3YLjEooGhuupMoqahEK` 브랜치에 push하면 자동으로 Preview 배포
   - main 브랜치에 merge하면 프로덕션 자동 배포

### 3. 브랜치 배포 설정

**Vercel Dashboard에서:**
1. Project Settings → Git
2. Production Branch: `main` 또는 원하는 브랜치명
3. Deploy Hooks 설정 가능

**현재 작업 브랜치 배포:**
```bash
# 현재 브랜치를 그대로 배포
vercel --prod
```

## 접근 URL

배포 완료 후 다음 URL로 접근 가능:

- **루트 (역할 선택)**: `https://your-project.vercel.app/`
- **학생 페이지**: `https://your-project.vercel.app/student/`
- **교수 페이지**: `https://your-project.vercel.app/professor/`
- **관리자 페이지**: `https://your-project.vercel.app/admin/`

직접 대시보드 접근:
- `https://your-project.vercel.app/student/student-dashboard.html`
- `https://your-project.vercel.app/professor/professor-dashboard.html`
- `https://your-project.vercel.app/admin/admin-dashboard.html`

## 환경 변수 설정 (필요시)

Vercel Dashboard → Project Settings → Environment Variables에서 설정

```
API_URL=https://api.example.com
NODE_ENV=production
```

## 도메인 연결 (선택사항)

1. Vercel Dashboard → Project Settings → Domains
2. 커스텀 도메인 추가
3. DNS 설정 (A 레코드 또는 CNAME)

## 주의사항

- 이 프로젝트는 정적 HTML/CSS/JS로 구성되어 있습니다
- 백엔드 API는 별도로 구축해야 합니다
- 현재는 Mock 데이터를 사용합니다
- 실제 운영 시 인증/인가 시스템 구현 필요

## 트러블슈팅

### 404 에러 발생 시
- vercel.json의 routes 설정 확인
- 파일 경로 대소문자 확인

### CSS/JS 파일 로드 실패 시
- 상대 경로 확인
- vercel.json의 builds 설정 확인

### 자동 배포 안 될 때
- GitHub 저장소 연결 확인
- Vercel의 Git Integration 설정 확인
- Deploy Hooks 재설정

## 성능 최적화

Vercel은 자동으로 다음을 제공합니다:
- CDN을 통한 전 세계 배포
- HTTPS 자동 적용
- Gzip/Brotli 압축
- 이미지 최적화 (Next.js Image 사용 시)

## 모니터링

Vercel Dashboard에서 확인 가능:
- 배포 로그
- 방문자 통계 (Analytics - 유료)
- 성능 메트릭
- 에러 추적
