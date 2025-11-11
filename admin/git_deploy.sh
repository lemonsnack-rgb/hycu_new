#!/bin/bash
# Git 배포 자동화 스크립트

echo "📦 Git 배포를 시작합니다..."

# 1단계: Git 초기화 (최초 1회만)
echo "1️⃣ Git 저장소 초기화..."
git init

# 2단계: 파일 추가
echo "2️⃣ 파일 추가 중..."
git add admin_complete.html
git add admin_data.js
git add admin_main.js
git add admin_modals.js
git add admin_views.js

# 3단계: 커밋
echo "3️⃣ 커밋 생성 중..."
git commit -m "카피킬러/GPT킬러 UI 수정 완료

- 목록 화면에서 CopyKiller/GPT Killer 컬럼 삭제
- 상세보기 화면 단일 영역으로 통합 (CopyKiller X% / GPT킬러 Y%)
- 설명 텍스트 제거
- 보고서 다운로드 버튼 1개로 통합
- 표시 단위 변경: 점 → %"

# 4단계: 원격 저장소 연결 (GitHub 저장소 URL로 변경 필요)
echo "4️⃣ 원격 저장소 연결..."
echo "⚠️  아래 명령어에서 YOUR_USERNAME과 YOUR_REPO를 실제 값으로 변경하세요!"
echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"

# 5단계: 푸시
echo "5️⃣ GitHub에 업로드..."
echo "git branch -M main"
echo "git push -u origin main"

echo "✅ 배포 준비 완료!"
