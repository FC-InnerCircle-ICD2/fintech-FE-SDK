# PAY200 - Payment SDK

Payment SDK 프로젝트는 결제 SDK를 제공합니다. 이 프로젝트는 다음과 같은 [기술 스택](#기술-스택)을 활용하여 개발되었으며, 높은 코드 품질과 협업 효율성을 위해 명확한 [커밋](#커밋-컨벤션) 및 [브랜치 규칙](#브랜치-컨벤션)을 따릅니다.

## 목차

- [PAY200 - Payment SDK](#pay200---payment-sdk)
  - [목차](#목차)
  - [기술 스택](#기술-스택)
  - [설치 및 실행](#설치-및-실행)
    - [설치](#설치)
    - [실행](#실행)
    - [커밋 컨벤션](#커밋-컨벤션)
  - [브랜치 컨벤션](#브랜치-컨벤션)

## 기술 스택

- 프레임워크: Vite
- 언어: TypeScript, JavaScript
- 빌드: Yarn
- 테스트: Vitest

## 설치 및 실행

### 설치

```bash
# 레포지토리 클론
git clone https://github.com/FC-InnerCircle-ICD2/fintech-FE-SDK.git

# 프로젝트 폴더로 이동
cd your-repo-name

# 의존성 설치
yarn install
```

### 실행

```bash
# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 빌드 결과 확인
yarn preview
```

### 커밋 컨벤션

| 유형       | 설명                          | 예시                        |
| ---------- | ----------------------------- | --------------------------- |
| `feat`     | 새로운 기능 추가              | feat: 사용자 인증 기능 추가 |
| `fix`      | 버그 수정                     | fix: 로그인 오류 수정       |
| `chore`    | 코드 변경 없이 설정 작업      | chore: eslint 설정 추가     |
| `docs`     | 문서 수정                     | docs: README 수정           |
| `style`    | 코드 포매팅 등 스타일 변경    | style: 코드 간격 수정       |
| `refactor` | 기능 변경 없이 코드 구조 개선 | refactor: 컴포넌트 분리     |
| `test`     | 테스트 코드 추가 또는 수정    | test: 유닛 테스트 추가      |
| `perf`     | 성능 개선                     | perf: 렌더링 최적화         |

## 브랜치 컨벤션

| 브랜치     | 설명                                      | 예시                      |
| ---------- | ----------------------------------------- | ------------------------- |
| `main`     | 배포 가능한 상태의 코드가 위치하는 브랜치 | main                      |
| `develop`  | 개발 중인 브랜치                          | develop                   |
| `feature`  | 새로운 기능 추가 브랜치                   | feature/user-auth         |
| `release`  | 릴리즈 준비를 위한 브랜치                 | release/1.0.0             |
| `bugfix`   | 버그 수정 브랜치                          | bugfix/login-error        |
| `hotfix`   | 긴급하게 수정이 필요한 브랜치             | hotfix/crash-on-startup   |
| `refactor` | 코드 리팩토링 브랜치                      | refactor/component-split  |
| `test`     | 테스트 코드 작성/수정 브랜치              | test/unit-tests           |
| `docs`     | 문서 작업 브랜치                          | docs/update-readme        |
| `chore`    | 설정 변경 및 기타 작업 브랜치             | chore/update-dependencies |
