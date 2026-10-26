# homeWork01_Web_service_architecture
웹서비스 설계 CRUD 및 로그인 구현 과제

# JWT 인증 게시판

- 작성자: 202413094 장환희
- 소개: 누구나 글을 읽고, 로그인한 사용자는 자신의 글을 작성·수정·삭제하는 게시판
- 기술: Vue, Express, SQLite
- 환경: Windows 11 26H2, Node.js v24.15.0, npm
- [보고서 및 테스트 증거][202413094_장환희_웹서비스설계과제_01.pdf](https://github.com/user-attachments/files/33963929/202413094_._._01.pdf)


## 구조
- frontend-vue/: 화면과 API 요청
- backend-express/: 인증·게시글 API·DB 저장
- docs/report.pdf: 구현 설명, 테스트 결과, AI 활용 기록

## 설치·실행
Windows PowerShell 기준이다. 아래 두 터미널은 저장소 최상위 폴더에서 시작한다.

### 저장소 복제
```powershell
git clone [저장소 URL]
cd [저장소 폴더명]
```

### 터미널 1: 백엔드
```powershell
cd backend-express
npm ci
Copy-Item .env.example .env
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

출력된 키를 `.env`의 `JWT_SECRET`에 입력하고 나머지는 다음과 같이 설정한다.

```text
JWT_ISSUER=webservice-class
JWT_AUDIENCE=board-api
TOKEN_TTL=90
DB_FILE=data/board.sqlite
PORT=8000
```

```powershell
npm start
```

상태 확인: http://127.0.0.1:8000/api/health

### 터미널 2: 프론트
```powershell
cd frontend-vue
npm ci
npm run build
npm run preview
```

접속: http://127.0.0.1:4173  
프론트의 `/api` 요청은 8000번 백엔드로 전달된다.
두 서버를 모두 켜 두고, 종료할 때는 각 터미널에서 Ctrl+C를 누른다.
프론트 수정 후에는 재빌드하고, 백엔드·환경설정 수정 후에는 서버를 재시작한다.

## 테스트 계정
- Alice: alice@class.test
- Bob: bob@class.test
- 공통 비밀번호: Classroom!2026

## DB와 설정
DB는 `backend-express/data/board.sqlite`에 자동 생성된다.
초기화하려면 서버 종료 후 해당 파일만 삭제하고 재실행한다.
기존 게시글은 모두 삭제된다.
만료 테스트는 TOKEN_TTL을 3으로 변경하고 서버를 재시작한다.
테스트 후에는 90으로 복구한다.
실제 `.env`, DB, node_modules, dist는 제출하지 않는다.

## 구현·검증 상태
- 구현한 기능: JWT 발급·검증, 작성자 권한 검사, 토큰 저장·전송, 로그아웃
- 최종 완료 여부 및 남은 문제: [실제 상태 작성]
- 새 폴더 clone 후 실행 확인: [완료 또는 미확인]
- 테스트 결과와 증거: 보고서 참고

## AI 활용
AI를 문법 학습, 구현 힌트·코드 예시, 오류 해결, 테스트 및 문장 정리에 활용했다.
사용 도구·반영 위치·검증 내용은 보고서에 기록했다.
수업 제공 코드와 과제 안내·API 명세·테스트 시나리오를 참고했다.
