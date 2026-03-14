# 게임포인트 시뮬레이터

게임포인트 적립 설정에 따라 통화별 최저가 상품 결제 시 적립되는 포인트를 미리 계산하는 내부 도구입니다.

## 기능

### 입력
- **적립률**: 모든 통화에 공통으로 적용되는 포인트 적립률 (%)
- **통화별 최소 상품 금액**: 각 통화별로 가장 낮은 가격의 상품 금액
- **통화별 최소 사용 단위**: 각 통화별로 포인트 사용 가능한 최소 단위

### 지원 통화
- 🇰🇷 한화 (KRW)
- 🇺🇸 달러 (USD)
- 🇪🇺 유로 (EUR)
- 🇯🇵 엔화 (JPY)
- 🇹🇼 대만달러 (TWD)
- 🇹🇭 태국바트 (THB)

### 계산 결과
1. **계산값**: 적립률을 적용한 원본 값
2. **시스템 적립값**: 소수점 넷째자리 버림 (셋째자리까지 저장)
3. **유저 출력값**: 소수점 셋째자리 버림 (둘째자리까지 표시)
4. **손해율**: (시스템 적립값 - 유저 출력값) / 시스템 적립값 × 100

## 개발

### 기술 스택
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React

### 로컬 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어서 NEXT_PUBLIC_APP_PASSWORD 설정

# 개발 서버 실행
npm run dev
```

서버: http://localhost:3000

**로그인:**
- `.env.local` 파일에 설정한 비밀번호로 로그인
- 인증 정보는 localStorage에 저장됨

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 배포

Vercel에 자동 배포됩니다.

### 1. GitHub 연동
```bash
git init
git add .
git commit -m "Initial commit: Game Point Simulator"
git remote add origin [YOUR_GITHUB_REPO_URL]
git push -u origin main
```

### 2. Vercel 배포
1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 리포지토리 연결
4. **Environment Variables 설정:**
   - `NEXT_PUBLIC_APP_PASSWORD` = 원하는 비밀번호
5. Deploy 클릭!

**⚠️ 중요:** 배포 후 Environment Variables에 비밀번호를 반드시 설정하세요!

## 프로젝트 구조

```
game-point-simulator/
├── app/
│   ├── page.tsx          # 메인 시뮬레이터 페이지
│   ├── layout.tsx        # 레이아웃
│   └── globals.css       # 글로벌 스타일
├── lib/
│   └── calculator.ts     # 계산 로직
├── types/
│   └── index.ts          # TypeScript 타입 정의
└── README.md
```

## 라이선스

Internal use only
