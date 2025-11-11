# 📚 논문 지도 관리 시스템 (Thesis Management System)

한양사이버대학교 대학원 논문 지도 관리 시스템 - 관리자용

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

---

## 📋 목차
- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [최근 업데이트](#-최근-업데이트)
- [시작하기](#-시작하기)
- [파일 구조](#-파일-구조)
- [기술 스택](#️-기술-스택)

---

## 🎯 프로젝트 소개

한양사이버대학교 대학원의 논문 지도 프로세스를 체계적으로 관리하기 위한 웹 기반 관리 시스템입니다.

### **주요 특징**
- 🎨 **모던 UI/UX**: Tailwind CSS 기반의 깔끔하고 직관적인 인터페이스
- 📱 **반응형 디자인**: 데스크톱, 태블릿, 모바일 모두 지원
- 🔍 **표절 검사**: CopyKiller/GPT킬러 통합 검사 결과 관리
- 📊 **실시간 대시보드**: 제출 현황 및 진행 상태 모니터링
- ⚡ **즉시 실행**: 서버 설치 없이 브라우저에서 바로 사용 가능

---

## ✨ 주요 기능

### **제출 현황 관리**
- 📝 연구계획서 제출
- 📄 논문작성계획서 제출
- 📖 중간논문 제출
- 🎓 최종논문 제출
- 📚 학술지 심사 신청

### **진행 모니터링**
- 📅 주차별 논문지도 현황
- 📈 논문지도 진행 현황
- 🎯 학생별 진행 상태 추적

### **프로세스 설정**
- ⏰ 논문지도 일정 관리
- ✅ 논문 제출 요건 관리
- 🔄 워크플로우 관리
- 📊 지도 단계 유형 관리
- 🎯 평가 기준 관리

---

## 🆕 최근 업데이트 (2025년 10월 31일)

### **v1.0.1 - 표절 검사 UI 개선**

#### ✅ **목록 화면**
- CopyKiller/GPT Killer 컬럼 삭제
- 테이블 레이아웃 간소화

#### ✅ **상세보기 화면**
- 2개 분리 영역 → 1개 통합 영역
- 표시: `CopyKiller 8% / GPT킬러 12%`
- 설명 텍스트 제거
- 보고서 버튼 1개로 통합

#### ✅ **표시 단위**
- "점" → "%" 변경

---

## 🚀 시작하기

### **방법 1: 브라우저에서 바로 실행**

```bash
# 1. 파일 다운로드
git clone https://github.com/YOUR_USERNAME/thesis-management-system.git

# 2. admin_complete.html 파일을 브라우저에서 열기
# (더블클릭 또는 드래그앤드롭)
```

### **방법 2: GitHub Pages**

```
🌐 https://YOUR_USERNAME.github.io/thesis-management-system/admin_complete.html
```

---

## 📁 파일 구조

```
thesis-management-system/
├── admin_complete.html      # 메인 HTML
├── admin_data.js            # 데이터
├── admin_main.js            # 메인 로직
├── admin_modals.js          # 모달 로직
└── admin_views.js           # 뷰 로직
```

---

## 🛠️ 기술 스택

- **HTML5**
- **JavaScript (ES6+)**
- **Tailwind CSS v3.0**
- **Noto Sans KR 폰트**

---

## 📖 사용 방법

1. **대시보드 접속**: `admin_complete.html` 열기
2. **메뉴 탐색**: 좌측 사이드바 메뉴 클릭
3. **상세보기**: 목록에서 [상세보기] 클릭
4. **검사 결과 확인**:
   - 🟢 녹색 (0-10%): 안전
   - 🟡 노란색 (11-20%): 주의
   - 🔴 빨간색 (21%+): 위험

---

## 📄 라이센스

MIT License

---

**Made with ❤️ by HYCU Graduate School**

**Last Updated**: 2025년 10월 31일
