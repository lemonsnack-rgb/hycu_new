# 논문 지도 시스템 - 한양사이버대학교

## 📋 프로젝트 개요

한양사이버대학교 대학원 논문지도 관리 시스템입니다. 학생, 교수, 관리자를 위한 통합 플랫폼을 제공합니다.

## 🌐 배포

### Vercel 배포 방법
자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

```bash
# Vercel CLI로 배포
npm install -g vercel
vercel --prod
```

또는 GitHub 저장소를 Vercel에 연결하여 자동 배포 설정 가능합니다.

## 📁 파일 구조

```
hycu_new/
├── index.html                              # 루트: 역할 선택 페이지
├── vercel.json                             # Vercel 배포 설정
├── DEPLOYMENT.md                           # 배포 가이드
│
├── common-style.css                        # 공통 스타일
├── common-search.css                       # 검색 공통 스타일
├── common-utils.js                         # 공통 유틸리티
│
├── student/                                # 학생 영역
│   ├── index.html                          # 리다이렉트 페이지
│   ├── student-dashboard.html              # ⭐ 학생 메인 대시보드
│   └── assets/
│       ├── css/
│       └── js/
│
├── professor/                              # 교수 영역
│   ├── index.html                          # 리다이렉트 페이지
│   ├── professor-dashboard.html            # ⭐ 교수 메인 대시보드
│   └── assets/
│       ├── css/
│       └── js/
│
└── admin/                                  # 관리자 영역
    ├── index.html                          # 리다이렉트 페이지
    ├── admin-dashboard.html                # ⭐ 관리자 메인 대시보드
    ├── admin_data.js
    ├── admin_main.js
    ├── admin_modals.js
    └── admin_views.js
```

## 🎯 파일명 규칙

### 메인 대시보드 파일
- **학생**: `student/student-dashboard.html`
- **교수**: `professor/professor-dashboard.html`
- **관리자**: `admin/admin-dashboard.html`

### 리다이렉트 파일
각 디렉토리의 `index.html`은 자동으로 해당 대시보드로 리다이렉트합니다.

## 🚀 접근 URL

### 로컬 개발
```
http://localhost/                                    # 역할 선택 페이지
http://localhost/student/student-dashboard.html      # 학생 대시보드
http://localhost/professor/professor-dashboard.html  # 교수 대시보드
http://localhost/admin/admin-dashboard.html          # 관리자 대시보드
```

### 배포 후 (Vercel)
```
https://your-project.vercel.app/                     # 역할 선택 페이지
https://your-project.vercel.app/student/             # 학생 영역
https://your-project.vercel.app/professor/           # 교수 영역
https://your-project.vercel.app/admin/               # 관리자 영역
```

## 🎨 주요 기능

### 공통 기능
- ✅ 영문버전 전환 기능
- ✅ 로그아웃 기능
- ✅ 학생 정보조회 (i) 아이콘
- ✅ 유틸리티 메뉴 일관성
- ✅ 브랜드 색상 통일 (#6A0028)
- ✅ 카카오톡/SMS 알림 발송

### 학생 화면
- 논문지도 계획 조회
- 제출 관리
- 미팅관리
- 피드백 확인

### 교수 화면
- 지도학생 관리
- 주차별 논문지도
- 온라인 피드백
- 논문심사 관리
- 학술지 심사 관리
- 알림 발송 (카카오톡/SMS 선택)

### 관리자 화면
- 전체 제출 현황 관리
- 논문작성계획서 관리
- 중간/최종논문 관리
- 학술지 심사 관리
- 학생 알림 발송 (체크박스 선택)

## 📝 최근 업데이트

### v3.0 (2025-11-12)
- 📂 **파일명 명확화**: 학생/교수/관리자 구분 명확
- 🌐 **Vercel 배포 지원**: vercel.json 및 배포 가이드 추가
- 🎯 **역할 선택 페이지**: 루트에 통합 진입점 추가
- 📧 **알림 발송 기능**: 관리자 페이지 전체 테이블에 체크박스 및 알림 발송 추가
- 📱 **카카오톡/SMS 선택**: 알림 발송 시 방법 선택 가능

### v2.5 (2025-11-12)
- ✅ 알림 발송 기능에 카카오톡/SMS 선택 추가
- ✅ 버튼 색상 통일 (브랜드 색상 #6A0028)
- ✅ 유틸리티 메뉴에 언어 전환 버튼 추가

### v2.0 (2025-11-06)
- ✅ 공통 스타일 통일
- ✅ 메뉴 구조 개편
- ✅ 기능 추가 및 개선

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **스타일링**: Tailwind CSS (CDN)
- **아이콘**: Heroicons
- **배포**: Vercel (Static Site)
- **버전관리**: Git

## 📦 배포 전 체크리스트

- [ ] 모든 HTML 파일의 경로 확인
- [ ] CSS/JS 파일 링크 확인
- [ ] 이미지 및 리소스 파일 확인
- [ ] vercel.json 설정 검토
- [ ] 브라우저 테스트 (Chrome, Firefox, Safari)
- [ ] 모바일 반응형 테스트

## 🔒 보안 고려사항

- 현재는 프로토타입으로 Mock 데이터 사용
- 실제 운영 시 다음 구현 필요:
  - 사용자 인증/인가 시스템
  - 백엔드 API 연동
  - 데이터베이스 통합
  - HTTPS 적용 (Vercel 자동 제공)
  - 입력 데이터 검증

## 🐛 알려진 이슈

- Mock 데이터 사용으로 실제 서버 연동 필요
- 일부 기능은 백엔드 API 구현 후 활성화

## 📞 문의 및 지원

추가 수정이 필요하거나 문의사항이 있으면 이슈를 등록해주세요.

## 📜 라이선스

© 2025 한양사이버대학교. All rights reserved.

---

**최종 업데이트**: 2025-11-12
**버전**: 3.0
**개발자**: Claude AI Assistant
