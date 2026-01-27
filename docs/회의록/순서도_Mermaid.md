# 논문지도시스템 순서도 (Mermaid)

**작성일:** 2026.01.26
**목적:** Mermaid를 사용한 시스템 순서도 작성

---

## 사용 방법

1. **GitHub/GitLab**: `.md` 파일에 코드 블록으로 삽입하면 자동 렌더링
2. **VS Code**: Mermaid Preview 확장 설치 후 미리보기
3. **Notion**: Mermaid 블록으로 삽입
4. **온라인 에디터**: https://mermaid.live 에서 편집

---

# 1. 전체 시스템 개요

```mermaid
flowchart TD
    Start([시스템 시작]) --> Setup[시스템 초기 설정]
    Setup --> Advisor[지도교수-학생 배정]
    Advisor --> Plan[학기별 지도계획 작성]
    Plan --> Main{논문 지도단계 수행}

    Main --> Submit[학생: 논문 제출]
    Submit --> Review[교수: 심사/승인]

    Review --> Pass{평가 결과}
    Pass -->|합격| Next[다음 단계 이동]
    Pass -->|조건부합격| Reexam[재심 프로세스]
    Pass -->|불합격| Fail{단계 구분}

    Fail -->|중간 단계| Option{교수 판단}
    Option -->|다음 단계 이동| Next
    Option -->|단계 종결| End1([종료])

    Fail -->|최종 단계| Reapp[재신청 프로세스]

    Reexam --> ReexamResult{재심 결과}
    ReexamResult -->|합격| Next
    ReexamResult -->|불합격| Reapp

    Next --> Graduate{졸업 여부}
    Graduate -->|졸업| End2([졸업])
    Graduate -->|미졸업| Main

    Reapp --> NextSem[다음 학기 전환]
    NextSem --> Main

    style Pass fill:#ffeb3b
    style Fail fill:#ff5722
    style Reexam fill:#2196f3
    style Graduate fill:#4caf50
```

---

# 2. 시스템 초기 설정 프로세스

```mermaid
flowchart TD
    Start([관리자 시작]) --> Step1[단계지도유형 관리 등록]
    Step1 --> Type1[논문작성계획서]
    Step1 --> Type2[예비심사]
    Step1 --> Type3[본심사]

    Type1 & Type2 & Type3 --> Step2[심사평가기준 등록]

    Step2 --> EvalType{평가표 유형}
    EvalType -->|서술형| Desc[서술형 평가 설정]
    EvalType -->|척도형| Scale[척도형 평가 설정]

    Desc & Scale --> Step3[지도단계 등록]

    Step3 --> Dept[학과 정보 선택]
    Dept --> SetEval{평가 방식 선택}

    SetEval -->|advisor_approval| Mid[중간 단계 설정]
    SetEval -->|committee_evaluation| Final[최종 단계 설정]

    Mid --> MidDetail[심사위원 배정 불필요<br/>평가표 불필요<br/>승인 방식]
    Final --> FinalDetail[심사위원 배정 필수<br/>평가표 필수<br/>평가 방식]

    MidDetail & FinalDetail --> Step4[지도단계별 일정 등록]
    Step4 --> Step5[심사위원 배정<br/>최종 단계만]

    Step5 --> End([설정 완료])

    style SetEval fill:#ffeb3b
    style Mid fill:#4caf50
    style Final fill:#2196f3
```

---

# 3. 논문 지도단계 수행 - 핵심 프로세스

```mermaid
flowchart TD
    Start([학생 시작]) --> Dashboard[대시보드에서<br/>현재 단계 확인]
    Dashboard --> Menu[학위 논문 제출<br/>메뉴 접속]

    Menu --> SelectStage[단계 유형 선택<br/>논문작성계획서<br/>예비심사<br/>본심사]

    SelectStage --> FileType{제출 유형}
    FileType -->|초기 제출| Initial[논문 파일 업로드<br/>부속서류 선택]
    FileType -->|N차/재심| Revision[수정 논문 업로드<br/>수정전후대비표 필수]

    Initial & Revision --> Submit[제출 완료]
    Submit --> Notify1[교수/심사위원<br/>알림 발송]

    Notify1 --> Prof{교수 확인}
    Prof --> ViewMenu{메뉴 선택}
    ViewMenu -->|제출 내역 조회| ViewAll[모든 제출물 확인]
    ViewMenu -->|심사 평가| ViewEval[평가 필요 단계만]

    ViewAll & ViewEval --> Download[논문 + 부속서류<br/>다운로드]

    Download --> EvalType{평가 방식}

    EvalType -->|advisor_approval<br/>중간 단계| Approval[승인 처리]
    EvalType -->|committee_evaluation<br/>최종 단계| Committee[심사위원회 평가]

    Approval --> ApprovalUI[합격/불합격 선택<br/>코멘트 작성]
    Committee --> CommitteeUI[평가표 작성<br/>서술형/척도형]

    ApprovalUI & CommitteeUI --> Result{평가 결과}

    Result -->|합격| PassProc[다음 단계 이동<br/>학생 알림]
    Result -->|조건부합격| ConditionalProc[재심 프로세스]
    Result -->|불합격| FailProc{단계 구분}

    FailProc -->|중간 단계| MidFail{교수 판단}
    FailProc -->|최종 단계| FinalFail[재신청 프로세스]

    MidFail -->|다음 단계 이동| PassProc
    MidFail -->|단계 종결| Terminate[불합격 기록<br/>학생 알림]

    PassProc --> End([완료])
    ConditionalProc --> End
    FinalFail --> End
    Terminate --> End

    style EvalType fill:#ffeb3b
    style Result fill:#ff9800
    style ConditionalProc fill:#2196f3
    style FinalFail fill:#f44336
```

---

# 4. 조건부합격 및 재심 프로세스 (상세)

```mermaid
flowchart TD
    Start([조건부합격 선택]) --> Modal[재심 정보 설정 모달]

    Modal --> Method{재심 방식 선택}

    Method -->|재심 대면| InPerson[대면 심사]
    Method -->|재심 서면| Written[서면 심사]

    InPerson --> InPersonDetail[대면 일정 선택<br/>심사 장소 입력<br/>보완 요구사항 입력]
    InPersonDetail --> EvalType1[evaluationType = full<br/>전체 심사위원 평가]

    Written --> Evaluator{평가자 선택}
    Evaluator -->|심사위원장만| Chair[evaluationType = chair_only]
    Evaluator -->|지도교수 위임| Advisor[evaluationType = advisor_delegated]

    Chair & Advisor --> WrittenDetail[제출 기한 선택<br/>보완 요구사항 입력]

    EvalType1 & WrittenDetail --> SaveHistory[ExaminationHistory 저장<br/>examRound = 1<br/>result = conditional_pass<br/>reexamInfo 설정]

    SaveHistory --> NotifyStudent[학생에게 재심 안내 알림<br/>재심 방식/기한/요구사항]

    NotifyStudent --> StudentView[학생 대시보드<br/>재심 진행 중 배지 표시]

    StudentView --> StudentSubmit[학생: 수정논문 제출<br/>수정전후대비표 제출<br/>부속서류 제출]

    StudentSubmit --> UpdateStatus[reexamInfo.status<br/>= submitted]

    UpdateStatus --> NotifyProf[심사위원에게<br/>재심 평가 요청 알림]

    NotifyProf --> AuthCheck{평가 권한 확인}
    AuthCheck -->|full| AllMembers[모든 심사위원<br/>평가 가능]
    AuthCheck -->|chair_only| ChairOnly[심사위원장만<br/>평가 가능]
    AuthCheck -->|advisor_delegated| AdvisorOnly[지도교수만<br/>평가 가능]

    AllMembers & ChairOnly & AdvisorOnly --> Evaluate[재심 평가 진행]

    Evaluate --> ReexamResult{재심 평가 결과}

    ReexamResult -->|합격| RePass[ExaminationHistory 생성<br/>examRound = 2<br/>examType = reexam<br/>result = pass]
    ReexamResult -->|조건부합격<br/>재재심| ReConditional[examRound = 2<br/>result = conditional_pass<br/>재심 정보 재설정]
    ReexamResult -->|불합격| ReFail[examRound = 2<br/>result = fail<br/>재신청 필요]

    RePass --> NextStage[다음 단계 이동<br/>학생 알림]
    ReConditional --> CheckLimit{재심 횟수 확인}
    CheckLimit -->|허용| Modal
    CheckLimit -->|초과| ReFail

    ReFail --> Reapplication[재신청 프로세스]

    NextStage --> End([완료])
    Reapplication --> End

    style Method fill:#ffeb3b
    style ReexamResult fill:#ff9800
    style CheckLimit fill:#f44336
```

---

# 5. 재신청 프로세스

```mermaid
flowchart TD
    Start([최종 불합격]) --> UpdateStudent[StudentThesisStage 업데이트<br/>needsReapplication = true<br/>canProceed = false]

    UpdateStudent --> NotifyFail[학생에게 불합격 알림<br/>불합격 사유<br/>재신청 안내<br/>재신청 가능 학기]

    NotifyFail --> Dashboard[학생 대시보드<br/>불합격 안내 영역 표시<br/>재신청 버튼 표시]

    Dashboard --> WaitSemester[다음 학기 전환 대기]

    WaitSemester --> Batch[학기 전환 배치 작업<br/>semester 업데이트<br/>isExtended = true]

    Batch --> ClickButton[학생: 재신청 버튼 클릭]

    ClickButton --> ValidateAuth{재신청 자격 검증}
    ValidateAuth -->|자격 없음| Reject[재신청 불가 안내]
    ValidateAuth -->|자격 있음| ApplicationForm[재신청 신청서 화면]

    ApplicationForm --> FillForm[신청서 작성<br/>논문 제목<br/>논문 초록<br/>키워드<br/>이전 신청 정보 표시]

    FillForm --> SubmitApp[제출]

    SubmitApp --> CreateApp[ThesisApplication 생성<br/>isReapplication = true<br/>previousApplications<br/>status = application_submitted]

    CreateApp --> RestoreStudent[StudentThesisStage 복구<br/>canProceed = true<br/>needsReapplication = false]

    RestoreStudent --> NotifyAdmin[관리자에게<br/>재신청 접수 알림]

    NotifyAdmin --> ShowProgress[학생: 재신청 진행 상황<br/>5단계 프로그레스바<br/>1.신청✅ 2.위원구성 3.논문제출<br/>4.심사 5.결과]

    ShowProgress --> AdminList[관리자: 재신청 건 목록]

    AdminList --> SelectApp[재신청 건 선택]

    SelectApp --> ViewDetail[재신청 건 상세 확인<br/>학생 정보<br/>논문 정보<br/>이전 신청 정보<br/>이전 불합격 사유]

    ViewDetail --> AssignCommittee[심사위원 구성]

    AssignCommittee --> ReuseOption{기존 구성 재사용?}
    ReuseOption -->|예| LoadPrevious[이전 구성 불러오기<br/>일부 변경 가능]
    ReuseOption -->|아니오| NewCommittee[신규 구성<br/>심사위원장 필수<br/>심사위원 선택]

    LoadPrevious & NewCommittee --> SaveCommittee[ThesisApplication 업데이트<br/>committeeChair<br/>committeeMembers<br/>status = committee_assigned]

    SaveCommittee --> NotifyStudent[학생에게<br/>심사위원 구성 완료 알림<br/>논문 제출 안내]

    NotifyStudent --> UpdateProgress[학생: 진행 상황 업데이트<br/>2.심사위원 구성✅]

    UpdateProgress --> ReturnNormal[정상 심사 프로세스로 복귀<br/>논문 제출부터 진행]

    ReturnNormal --> End([완료])
    Reject --> End

    style ValidateAuth fill:#ffeb3b
    style ReuseOption fill:#2196f3
```

---

# 6. 석사 vs 박사 재심 프로세스 비교

```mermaid
flowchart TD
    Start([본심사 평가]) --> Degree{학위 구분}

    Degree -->|석사| Master[석사 본심사<br/>1회 심사]
    Degree -->|박사| Doctor[박사 본심사<br/>2회 심사]

    Master --> MasterResult{평가 결과}
    MasterResult -->|합격| MasterPass[최종합격]
    MasterResult -->|조건부합격| MasterCond[재심 프로세스]
    MasterResult -->|불합격| MasterFail[최종 불합격<br/>다음학기 재신청]

    MasterCond --> MasterReexam{재심 방식}
    MasterReexam -->|대면| MasterInPerson[대면 심사 진행]
    MasterReexam -->|서면| MasterWritten[서면 심사 진행]

    MasterInPerson & MasterWritten --> MasterReexamResult{재심 결과}
    MasterReexamResult -->|합격| MasterPass
    MasterReexamResult -->|불합격| MasterFail

    Doctor --> Doctor1[박사 본심사 1차]
    Doctor1 --> Doctor1Result{1차 평가 결과}

    Doctor1Result -->|합격| Doctor2[본심사 2차 진행]
    Doctor1Result -->|조건부합격| Doctor2Cond[본심사 2차 진행<br/>2차에서 보완 재심사]
    Doctor1Result -->|불합격| Doctor1Fail[본심사 2차 불가<br/>다음학기 재신청]

    Doctor2 & Doctor2Cond --> Doctor2Eval[박사 본심사 2차<br/>최종]

    Doctor2Eval --> Doctor2Result{2차 평가 결과}

    Doctor2Result -->|합격| DoctorPass[최종합격]
    Doctor2Result -->|조건부합격| DoctorCond[재심 서면만]
    Doctor2Result -->|불합격| DoctorFail[다음학기 재신청]

    DoctorCond --> DoctorWritten[심사위원장이<br/>재심사 논문제출<br/>기간 설정]

    DoctorWritten --> DoctorReexamResult{재심 결과}
    DoctorReexamResult -->|합격| DoctorPass
    DoctorReexamResult -->|불합격| DoctorFail

    MasterPass & DoctorPass --> End1([졸업])
    MasterFail & Doctor1Fail & DoctorFail --> End2([재신청])

    style Degree fill:#ffeb3b
    style MasterResult fill:#4caf50
    style Doctor1Result fill:#2196f3
    style Doctor2Result fill:#ff9800
```

---

# 7. 평가 방식 분기 (evaluationType)

```mermaid
flowchart TD
    Start([지도단계 등록]) --> SelectType{평가 방식 선택}

    SelectType -->|advisor_approval| Mid[중간 단계 설정]
    SelectType -->|committee_evaluation| Final[최종 단계 설정]

    Mid --> MidFeatures[특징]
    MidFeatures --> MidF1[심사위원 배정: 불필요]
    MidFeatures --> MidF2[평가표: 불필요]
    MidFeatures --> MidF3[승인 방식: 합격/불합격 + 코멘트]
    MidFeatures --> MidF4[담당: 지도교수 단독]

    MidF1 & MidF2 & MidF3 & MidF4 --> MidExample[예시<br/>논문작성계획서<br/>석사 예비심사 등]

    Final --> FinalFeatures[특징]
    FinalFeatures --> FinalF1[심사위원 배정: 필수]
    FinalFeatures --> FinalF2[평가표: 필수<br/>서술형/척도형]
    FinalFeatures --> FinalF3[평가 방식: 심사위원회 평가]
    FinalFeatures --> FinalF4[담당: 심사위원 + 심사위원장]

    FinalF1 & FinalF2 & FinalF3 & FinalF4 --> FinalExample[예시<br/>박사 예비심사<br/>석사/박사 본심사 최종]

    MidExample --> Student[학생 논문 제출]
    FinalExample --> Student

    Student --> ProfView{교수 화면 분기}

    ProfView -->|advisor_approval| ApprovalUI[승인 처리 UI<br/>합격/불합격 라디오 버튼<br/>코멘트 입력<br/>다음 단계 이동 체크박스]

    ProfView -->|committee_evaluation| EvalUI[평가표 작성 UI<br/>서술형 의견 입력<br/>척도형 점수 입력<br/>심사위원장 종합평정]

    ApprovalUI --> ApprovalResult{승인 결과}
    ApprovalResult -->|합격| NextStage[다음 단계 이동]
    ApprovalResult -->|불합격 + 이동| NextStageWithComment[불합격 기록 + 다음 단계]
    ApprovalResult -->|불합격 + 종결| Terminate[단계 종결]
    ApprovalResult -->|조건부합격| Reexam[재심 프로세스]

    EvalUI --> EvalResult{심사위원회 결과}
    EvalResult -->|합격| NextStage
    EvalResult -->|조건부합격| Reexam
    EvalResult -->|불합격| Reapplication[재신청 프로세스]

    NextStage --> End([완료])
    NextStageWithComment --> End
    Terminate --> End
    Reexam --> End
    Reapplication --> End

    style SelectType fill:#ffeb3b
    style ApprovalResult fill:#4caf50
    style EvalResult fill:#2196f3
```

---

# 8. 학기 전환 및 대상자 관리

```mermaid
flowchart TD
    Start([학기 전환 시점]) --> Batch[학기 전환<br/>배치 작업 실행]

    Batch --> QueryGrad[졸업 완료 학생 조회<br/>최종 단계 합격]

    QueryGrad --> ProcessGrad[졸업 처리]
    ProcessGrad --> GradStatus[StudentThesisStage<br/>상태 = 졸업]
    GradStatus --> EndAdvisor[지도교수 배정 종료]

    Batch --> QueryNonGrad[졸업하지 못한<br/>학생 조회]

    QueryNonGrad --> UpdateSemester[StudentThesisStage 업데이트<br/>semester 업데이트<br/>예: 2026-1 → 2026-2]

    UpdateSemester --> SetExtended[isExtended = true]
    SetExtended --> KeepAdvisor[지도교수 배정 유지<br/>자동 연장]
    KeepAdvisor --> KeepStage[currentStageOrder 유지]

    QueryNonGrad --> CheckReapp{needsReapplication?}
    CheckReapp -->|true| ReappStatus[재신청 가능 상태 유지<br/>재신청 버튼 활성화]
    CheckReapp -->|false| NormalStatus[정상 진행]

    EndAdvisor --> AdminView[관리자: 대상자 조회]
    ReappStatus --> AdminView
    NormalStatus --> AdminView

    AdminView --> SetFilter[조회 조건 설정<br/>학기 선택<br/>단계 선택<br/>학과 선택<br/>추가 필터]

    SetFilter --> FilterExample[예시<br/>3학기 차 이상<br/>논문작성계획서 통과]

    FilterExample --> ShowList[대상자 목록 표시<br/>학생 정보<br/>현재 단계<br/>학기 차수<br/>지도교수<br/>진행 상태]

    ShowList --> End([완료])

    style CheckReapp fill:#ffeb3b
```

---

# 9. 파일 버전 관리 (Phase 1 vs Phase 3)

```mermaid
flowchart TD
    Start([학생: 파일 업로드]) --> CheckPhase{구현 단계}

    CheckPhase -->|Phase 1<br/>단순 버전 추적| Simple[방안 2 구현<br/>2일 공수]
    CheckPhase -->|Phase 3<br/>상세 버전 관리| Advanced[방안 1 구현<br/>5일 공수]

    Simple --> SimpleData[GuidanceSubmission<br/>version: 번호만<br/>previousSubmissionId: 참조<br/>stageAtSubmission: 단계]

    SimpleData --> SimpleFeature1[기능]
    SimpleFeature1 --> SF1[버전 번호 자동 증가]
    SimpleFeature1 --> SF2[이전 제출물 링크]
    SimpleFeature1 --> SF3[제출 당시 단계 저장]

    SF1 & SF2 & SF3 --> SimpleBenefit[효과<br/>기본적인 버전 추적<br/>이전 파일 조회 가능<br/>단계별 히스토리 유지]

    Advanced --> AdvancedData[GuidanceSubmission<br/>versions: 배열<br/>각 버전별 피드백<br/>학생 반영 내용]

    AdvancedData --> AdvancedFeature1[기능]
    AdvancedFeature1 --> AF1[버전별 피드백 매핑]
    AdvancedFeature1 --> AF2[피드백 반영 추적]
    AdvancedFeature1 --> AF3[페이지 번호 매핑]

    AF1 & AF2 & AF3 --> AdvancedBenefit[효과<br/>교수: 이전 피드백 확인 용이<br/>학생: 반영 내용 증명 가능<br/>버전 간 연결 명확]

    SimpleBenefit --> Problem[현재 문제점]
    AdvancedBenefit --> Solution[해결 방안]

    Problem --> P1[v1 파일의 3페이지 피드백이<br/>v2 파일의 어느 페이지인지<br/>알 수 없음]

    Solution --> S1[originalFeedback:<br/>연구 목적을 더 구체화하세요<br/>reflectedPage: 4<br/>comment: 연구 목적에<br/>구체적인 가설 3개 추가]

    P1 --> Decision{사용자 결정}
    S1 --> Decision

    Decision -->|Phase 1 포함| Implement1[Phase 1: 방안 2<br/>Phase 3: 방안 1로 업그레이드]
    Decision -->|Phase 3로 미룸| Implement2[Phase 1: 구현 안 함<br/>Phase 3: 방안 1 구현]

    Implement1 --> End([완료])
    Implement2 --> End

    style CheckPhase fill:#ffeb3b
    style Decision fill:#ff9800
```

---

# 10. 시스템 통합 순서도 (간략)

```mermaid
flowchart LR
    subgraph "1. 초기 설정"
        A1[단계유형 등록] --> A2[평가기준 등록]
        A2 --> A3[지도단계 등록]
        A3 --> A4[심사위원 배정]
    end

    subgraph "2. 학기 운영"
        B1[지도교수-학생<br/>배정] --> B2[학기별<br/>지도계획]
        B2 --> B3[논문지도활동<br/>피드백]
    end

    subgraph "3. 논문 심사"
        C1[학생: 논문 제출] --> C2{평가 방식}
        C2 -->|중간 단계| C3[승인]
        C2 -->|최종 단계| C4[심사]
        C3 & C4 --> C5{결과}
        C5 -->|합격| C6[다음 단계]
        C5 -->|조건부| C7[재심]
        C5 -->|불합격| C8[재신청]
    end

    subgraph "4. 재심/재신청"
        D1[재심 정보 설정] --> D2[학생: 수정논문]
        D2 --> D3[재심 평가]
        D3 --> D4{재심 결과}

        E1[재신청 신청] --> E2[심사위원 구성]
        E2 --> E3[정상 프로세스<br/>복귀]
    end

    subgraph "5. 학기 전환"
        F1[졸업 학생 처리]
        F2[미졸업 학생<br/>연장]
        F3[대상자 조회]
    end

    A4 --> B1
    B3 --> C1
    C7 --> D1
    C8 --> E1
    D4 -->|합격| C6
    D4 -->|불합격| E1
    C6 -->|학기 종료| F1
    C6 -->|미졸업| F2
    E3 --> C1
    F2 --> B2

    style C5 fill:#ffeb3b
    style D4 fill:#2196f3
```

---

# 사용 팁

## 1. 색상 변경
```mermaid
style 노드ID fill:#색상코드
```

## 2. 노드 모양
- `[]`: 사각형
- `()`: 둥근 사각형
- `([])`: 스타디움 (시작/종료)
- `{}`: 마름모 (분기)
- `[()]`: 실린더
- `[[]]`: 서브루틴

## 3. 화살표
- `-->`: 실선
- `-.->`: 점선
- `==>`: 굵은 선
- `-->|텍스트|`: 화살표에 텍스트

## 4. 서브그래프
```mermaid
subgraph "제목"
    노드들...
end
```

## 5. 방향
- `flowchart TD`: 위에서 아래 (Top Down)
- `flowchart LR`: 왼쪽에서 오른쪽 (Left Right)
- `flowchart RL`: 오른쪽에서 왼쪽
- `flowchart BT`: 아래에서 위

---

# 추가 작업 필요 시

위의 9개 순서도를 조합하여:
1. **전체 시스템 통합 순서도** (대형)
2. **역할별 순서도** (학생/교수/관리자)
3. **기능별 상세 순서도** (각 메뉴별)

를 작성할 수 있습니다.
