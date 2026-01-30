// admin_main.js 파일을 읽어서 코드 검증
const fs = require('fs');

console.log('='.repeat(70));
console.log('관리자 화면 - 논문지도학생현황 컬럼 수정 코드 검증');
console.log('='.repeat(70));
console.log();

const filePath = 'admin-v3/assets/js/admin_main.js';
const content = fs.readFileSync(filePath, 'utf8');

let passCount = 0;
let failCount = 0;

// TEST 1: "적용단계" → "지도단계" 변경 확인
console.log('TEST 1: 테이블 헤더 - "적용단계" → "지도단계" 변경');
console.log('-'.repeat(70));

if (content.includes('<th style="width: 130px;">지도단계</th>')) {
    console.log('✓ PASS: "지도단계" 헤더 존재');
    passCount++;
} else {
    console.log('✗ FAIL: "지도단계" 헤더 없음');
    failCount++;
}

if (!content.includes('<th style="width: 130px;">적용단계</th>')) {
    console.log('✓ PASS: "적용단계" 헤더 제거됨');
    passCount++;
} else {
    console.log('✗ FAIL: "적용단계" 헤더 여전히 존재');
    failCount++;
}

console.log();

// TEST 2: "다음단계" 컬럼 헤더 추가 확인
console.log('TEST 2: 테이블 헤더 - "다음단계" 컬럼 추가');
console.log('-'.repeat(70));

if (content.includes('<th style="width: 160px;">다음단계</th>')) {
    console.log('✓ PASS: "다음단계" 헤더 추가됨');
    passCount++;
} else {
    console.log('✗ FAIL: "다음단계" 헤더 없음');
    failCount++;
}

console.log();

// TEST 3: 주석 변경 확인
console.log('TEST 3: 주석 - "적용단계" → "지도단계" 변경');
console.log('-'.repeat(70));

if (content.includes('<!-- 지도단계 (기존 "적용단계") -->')) {
    console.log('✓ PASS: "지도단계 (기존 \\"적용단계\\")" 주석 존재');
    passCount++;
} else {
    console.log('✗ FAIL: 주석 변경 안됨');
    failCount++;
}

if (!content.includes('<!-- 적용단계 -->')) {
    console.log('✓ PASS: "적용단계" 주석 제거됨');
    passCount++;
} else {
    console.log('✗ FAIL: "적용단계" 주석 여전히 존재');
    failCount++;
}

console.log();

// TEST 4: 다음단계 셀 추가 확인
console.log('TEST 4: 테이블 행 - "다음단계" 셀 추가');
console.log('-'.repeat(70));

if (content.includes('<!-- 다음단계 (신규 추가) -->')) {
    console.log('✓ PASS: "다음단계 (신규 추가)" 주석 존재');
    passCount++;
} else {
    console.log('✗ FAIL: "다음단계" 셀 주석 없음');
    failCount++;
}

console.log();

// TEST 5: IIFE 패턴 확인
console.log('TEST 5: 다음단계 계산 로직 - IIFE 패턴');
console.log('-'.repeat(70));

if (content.includes('${(() => {')) {
    console.log('✓ PASS: IIFE 패턴 사용됨');
    passCount++;
} else {
    console.log('✗ FAIL: IIFE 패턴 없음');
    failCount++;
}

console.log();

// TEST 6: Case 주석 확인
console.log('TEST 6: 다음단계 계산 로직 - Case 주석');
console.log('-'.repeat(70));

const cases = ['Case 1', 'Case 2', 'Case 3', 'Case 4'];
let foundCases = 0;

cases.forEach((caseComment, idx) => {
    const caseNum = idx + 1;
    if (content.includes(`// ${caseComment}`)) {
        console.log(`✓ PASS: "${caseComment}" 주석 존재`);
        foundCases++;
        passCount++;
    } else {
        console.log(`✗ FAIL: "${caseComment}" 주석 없음`);
        failCount++;
    }
});

console.log();

// TEST 7: 핵심 로직 키워드 확인
console.log('TEST 7: 다음단계 계산 로직 - 핵심 키워드');
console.log('-'.repeat(70));

const keywords = [
    'if (!item.thesisStageId || !workflow)',
    'if (!item.currentStageOrder || !item.currentStageName)',
    'const nextStageOrder = item.currentStageOrder + 1',
    'const nextStage = workflow.stages.find',
    '미배정',
    '완료'
];

keywords.forEach(keyword => {
    if (content.includes(keyword)) {
        console.log(`✓ PASS: 키워드 "${keyword.substring(0, 40)}..." 존재`);
        passCount++;
    } else {
        console.log(`✗ FAIL: 키워드 "${keyword}" 없음`);
        failCount++;
    }
});

console.log();

// TEST 8: 색상 클래스 확인
console.log('TEST 8: 다음단계 스타일 - 색상 클래스');
console.log('-'.repeat(70));

if (content.includes('text-red-600')) {
    console.log('✓ PASS: "text-red-600" (미배정용 빨간색) 클래스 존재');
    passCount++;
} else {
    console.log('✗ FAIL: "text-red-600" 클래스 없음');
    failCount++;
}

if (content.includes('text-blue-600')) {
    console.log('✓ PASS: "text-blue-600" (완료용 파란색) 클래스 존재');
    passCount++;
} else {
    console.log('✗ FAIL: "text-blue-600" 클래스 없음');
    failCount++;
}

console.log();

// 최종 요약
console.log('='.repeat(70));
console.log('최종 요약');
console.log('='.repeat(70));
console.log(`✓ PASS: ${passCount}개`);
console.log(`✗ FAIL: ${failCount}개`);
console.log();

if (failCount === 0) {
    console.log('✅ 모든 코드 검증 통과!');
    console.log('다음단계 컬럼이 정상적으로 구현되었습니다.');
    process.exit(0);
} else {
    console.log(`❌ ${failCount}개의 검증 실패`);
    console.log('위의 FAIL 항목을 확인하세요.');
    process.exit(1);
}
