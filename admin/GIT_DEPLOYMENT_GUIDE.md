# 🚀 Git 배포 완전 가이드

**작성일**: 2025년 10월 31일

---

## 📋 목차
1. [사전 준비](#사전-준비)
2. [방법 1: GitHub Desktop 사용 (추천)](#방법-1-github-desktop-사용)
3. [방법 2: Git 명령어 사용](#방법-2-git-명령어-사용)
4. [방법 3: GitHub 웹사이트 직접 업로드](#방법-3-github-웹사이트-직접-업로드)
5. [GitHub Pages로 웹사이트 배포](#github-pages로-웹사이트-배포)
6. [문제 해결](#문제-해결)

---

## 🔧 사전 준비

### **필수 준비물**
- [ ] GitHub 계정 (없으면 https://github.com 에서 가입)
- [ ] 수정된 5개 파일
  - admin_complete.html
  - admin_data.js
  - admin_main.js
  - admin_modals.js
  - admin_views.js

---

## 🎯 방법 1: GitHub Desktop 사용 (초보자 추천) ⭐

### **1단계: GitHub Desktop 설치**

```
📥 다운로드: https://desktop.github.com/
```

**설치 과정:**
1. 다운로드 후 실행
2. GitHub 계정으로 로그인
3. 설치 완료!

---

### **2단계: 새 저장소 만들기**

**GitHub Desktop에서:**
```
File → New Repository

📝 입력 내용:
- Name: thesis-management-system
- Description: 논문 지도 관리 시스템
- Local Path: C:\Users\YOUR_NAME\Documents\GitHub
- Initialize with README: ✅ 체크
- Git Ignore: None
- License: MIT (선택사항)

[Create Repository] 클릭
```

---

### **3단계: 파일 복사**

**파일 탐색기에서:**
```
1. GitHub Desktop에서 "Show in Explorer" 클릭
2. 다운로드한 5개 파일을 해당 폴더에 복사
3. GitHub Desktop으로 돌아오기
```

**확인:**
- 좌측에 5개 파일이 "Changes" 탭에 표시됨 ✅

---

### **4단계: 커밋하기**

**GitHub Desktop에서:**
```
📝 Summary (required):
카피킬러/GPT킬러 UI 수정 완료

📄 Description (optional):
- 목록 화면에서 CopyKiller/GPT Killer 컬럼 삭제
- 상세보기 화면 단일 영역으로 통합
- 표시 단위 변경: 점 → %

[Commit to main] 클릭
```

---

### **5단계: GitHub에 업로드**

**GitHub Desktop에서:**
```
1. [Publish repository] 버튼 클릭
2. Name: thesis-management-system (자동 입력됨)
3. Description: 논문 지도 관리 시스템
4. Keep this code private: ☐ (공개) 또는 ☑ (비공개)
5. [Publish repository] 클릭

✅ 완료! GitHub.com에서 확인 가능
```

---

## 💻 방법 2: Git 명령어 사용 (개발자용)

### **1단계: Git 설치 확인**

```bash
# Git 설치 여부 확인
git --version

# 미설치 시: https://git-scm.com/downloads 에서 설치
```

---

### **2단계: 프로젝트 폴더 생성**

```bash
# 1. 폴더 생성
mkdir thesis-management-system
cd thesis-management-system

# 2. 다운로드한 파일 5개를 이 폴더로 복사

# 3. 확인
ls
# admin_complete.html
# admin_data.js
# admin_main.js
# admin_modals.js
# admin_views.js
```

---

### **3단계: Git 초기화**

```bash
# Git 저장소 초기화
git init

# 사용자 정보 설정 (최초 1회)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### **4단계: 파일 추가 및 커밋**

```bash
# 모든 파일 추가
git add .

# 또는 개별 파일 추가
git add admin_complete.html
git add admin_data.js
git add admin_main.js
git add admin_modals.js
git add admin_views.js

# 커밋
git commit -m "카피킬러/GPT킬러 UI 수정 완료

- 목록 화면에서 CopyKiller/GPT Killer 컬럼 삭제
- 상세보기 화면 단일 영역으로 통합
- 표시 단위 변경: 점 → %"
```

---

### **5단계: GitHub 저장소 만들기**

**GitHub 웹사이트에서:**
```
1. https://github.com 접속
2. 우측 상단 "+" → "New repository"
3. Repository name: thesis-management-system
4. Description: 논문 지도 관리 시스템
5. Public 또는 Private 선택
6. ⚠️ "Add a README file" 체크 해제 (이미 로컬에 있으므로)
7. [Create repository] 클릭
```

---

### **6단계: 원격 저장소 연결 및 푸시**

```bash
# 원격 저장소 연결 (GitHub에서 복사한 URL 사용)
git remote add origin https://github.com/YOUR_USERNAME/thesis-management-system.git

# 기본 브랜치 이름 설정
git branch -M main

# 푸시
git push -u origin main

# 계정 정보 입력 (최초 1회)
# Username: YOUR_GITHUB_USERNAME
# Password: YOUR_PERSONAL_ACCESS_TOKEN
```

**✅ 완료! GitHub에서 확인하세요:**
```
https://github.com/YOUR_USERNAME/thesis-management-system
```

---

## 🌐 방법 3: GitHub 웹사이트 직접 업로드 (가장 쉬움)

### **1단계: 새 저장소 만들기**

```
1. https://github.com 접속 후 로그인
2. 우측 상단 "+" → "New repository"
3. Repository name: thesis-management-system
4. Description: 논문 지도 관리 시스템
5. Public 선택
6. "Add a README file" 체크
7. [Create repository] 클릭
```

---

### **2단계: 파일 업로드**

```
1. 생성된 저장소 페이지에서 "Add file" → "Upload files" 클릭
2. 5개 파일을 드래그 앤 드롭
   - admin_complete.html
   - admin_data.js
   - admin_main.js
   - admin_modals.js
   - admin_views.js
3. Commit message 입력:
   "카피킬러/GPT킬러 UI 수정 완료"
4. [Commit changes] 클릭
```

**✅ 완료! 파일이 업로드되었습니다!**

---

## 🚀 GitHub Pages로 웹사이트 배포

파일을 업로드한 후, 실제 웹사이트로 배포하려면:

### **1단계: GitHub Pages 활성화**

```
1. 저장소 페이지에서 "Settings" 탭 클릭
2. 좌측 메뉴에서 "Pages" 클릭
3. Source 섹션에서:
   - Branch: main 선택
   - Folder: / (root) 선택
4. [Save] 클릭
```

---

### **2단계: 배포 완료 확인**

```
⏱️ 약 1-2분 후:

✅ 상단에 초록색 박스 표시:
"Your site is live at https://YOUR_USERNAME.github.io/thesis-management-system/"

🌐 웹사이트 접속:
https://YOUR_USERNAME.github.io/thesis-management-system/admin_complete.html
```

---

## 📁 저장소 구조 예시

```
thesis-management-system/
├── README.md
├── admin_complete.html      ← 메인 HTML
├── admin_data.js            ← 데이터
├── admin_main.js            ← 메인 로직
├── admin_modals.js          ← 모달 로직
└── admin_views.js           ← 뷰 로직
```

---

## 🔒 Personal Access Token 생성 (명령어 사용 시)

Git 명령어로 푸시할 때 비밀번호 대신 사용:

### **생성 방법:**

```
1. GitHub → Settings (우측 상단 프로필 아이콘)
2. 좌측 맨 아래 "Developer settings"
3. "Personal access tokens" → "Tokens (classic)"
4. "Generate new token (classic)"
5. Note: "Thesis Management System"
6. Expiration: 30 days
7. Select scopes:
   ✅ repo (전체 체크)
8. [Generate token] 클릭
9. ⚠️ 토큰 복사 (다시 볼 수 없음!)
```

**사용:**
```bash
git push -u origin main
Username: YOUR_USERNAME
Password: ghp_xxxxxxxxxxxxxxxxxxxx  ← 복사한 토큰 붙여넣기
```

---

## 🔄 업데이트 방법 (파일 수정 후)

### **GitHub Desktop 사용 시:**
```
1. 파일 수정 후 저장
2. GitHub Desktop에서 자동으로 변경사항 감지
3. Summary 입력
4. [Commit to main] 클릭
5. [Push origin] 클릭
```

### **Git 명령어 사용 시:**
```bash
# 파일 수정 후
git add .
git commit -m "수정 내용 설명"
git push
```

---

## ❓ 문제 해결

### **Q1: "git: command not found"**
```
A: Git이 설치되지 않았습니다.
   → https://git-scm.com/downloads 에서 설치
```

### **Q2: "Permission denied (publickey)"**
```
A: SSH 키 설정 필요 또는 HTTPS 사용
   → git remote set-url origin https://github.com/USERNAME/REPO.git
```

### **Q3: "fatal: remote origin already exists"**
```
A: 원격 저장소가 이미 연결되어 있음
   → git remote remove origin
   → git remote add origin NEW_URL
```

### **Q4: 푸시 시 "rejected" 에러**
```
A: 원격 저장소와 로컬이 동기화되지 않음
   → git pull origin main
   → git push origin main
```

### **Q5: GitHub Pages가 작동하지 않음**
```
A: 확인 사항:
   1. 파일명이 정확한지 확인 (admin_complete.html)
   2. Settings → Pages에서 Branch가 main으로 설정되었는지 확인
   3. 1-2분 기다린 후 새로고침
```

---

## 📚 추가 리소스

### **학습 자료:**
- Git 공식 가이드: https://git-scm.com/book/ko/v2
- GitHub 가이드: https://guides.github.com/
- GitHub Desktop 가이드: https://docs.github.com/en/desktop

### **추천 순서:**
```
1단계 (초보자): 방법 3 - 웹사이트 직접 업로드
2단계 (익숙해지면): 방법 1 - GitHub Desktop
3단계 (개발자): 방법 2 - Git 명령어
```

---

## ✅ 체크리스트

배포 전 확인:
- [ ] GitHub 계정 생성
- [ ] 5개 파일 다운로드 완료
- [ ] 파일 정상 작동 확인 (브라우저에서 admin_complete.html 열어보기)

배포 후 확인:
- [ ] GitHub 저장소에 파일 업로드 확인
- [ ] README.md 작성 (프로젝트 설명)
- [ ] GitHub Pages 활성화 (웹사이트 배포)
- [ ] 웹사이트 정상 작동 확인

---

## 🎉 축하합니다!

GitHub에 성공적으로 배포하셨습니다! 🚀

**다음 단계:**
1. README.md 파일 작성 (프로젝트 설명)
2. 프로젝트에 스크린샷 추가
3. 팀원과 공유
4. 지속적인 업데이트

---

**작성일**: 2025년 10월 31일  
**버전**: 1.0
