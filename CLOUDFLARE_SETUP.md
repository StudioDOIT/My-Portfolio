# Cloudflare Pages 배포

기존 GitHub Pages와 Pages CMS를 유지하면서 동일 저장소를 Cloudflare Pages에도 배포할 수 있습니다. 서버·데이터베이스·프레임워크를 추가하지 않습니다.

## 처음 한 번 연결

Cloudflare 대시보드의 Workers & Pages에서 **Pages 프로젝트**를 생성하고 GitHub 저장소에 연결합니다. Workers 배포 대신 Pages의 Git 연결을 선택합니다. UI에 따라 Create application → Pages → Connect to Git 또는 Import an existing Git repository로 표시될 수 있습니다.

Cloudflare GitHub App에 `StudioDOIT/My-Portfolio` 접근을 허용한 뒤 다음 값으로 설정합니다.

| 설정 | 값 |
| --- | --- |
| 저장소 | `StudioDOIT/My-Portfolio` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `node scripts/build-cloudflare.mjs` |
| Build output directory | `dist` |
| Root directory | 저장소 최상위, 기본값 유지 |
| Node.js | `.node-version`에 지정한 `22` |

Save and Deploy를 누르면 첫 배포가 시작됩니다. 프로젝트 이름과 실제 `*.pages.dev` 주소는 Cloudflare에서 확정됩니다. 별도 API 토큰을 GitHub Secrets나 코드에 넣을 필요가 없습니다. 초기 GitHub 앱 연결과 Cloudflare 계정 승인은 계정 소유자가 완료해야 합니다.

## 자동 반영

`Pages CMS 저장 → main 커밋 → Cloudflare Git 자동 빌드 → dist/data/works.json 생성 → Pages 배포 → 기존 WORKS 렌더링`

기존 GitHub Pages 자동 배포도 계속 작동합니다. CMS는 `_data/works/<id>.json`을 공동 원본으로 사용하므로 작품을 이중 등록하지 않습니다. 작품 추가·수정·삭제, 공개 여부, 메인 노출, 노출 순서, 이미지와 링크 변경은 다음 배포에 반영됩니다.

## 빌드 내용

- `scripts/build-cloudflare.mjs`: 기존 HTML, CSS, JS, 이미지와 공개 폴더를 `dist/`로 복사합니다. 루트 HTML과 `css`, `js`, `images`, `videos`, `details`, `assets`, `fonts`, `data` 폴더를 지원합니다.
- 작품별 JSON을 검증한 뒤 공개 및 메인 노출 작품만 `dist/data/works.json`에 통합합니다. Cloudflare에서는 Jekyll/Liquid가 필요하지 않습니다.
- CMS 업로드 이미지의 `/My-Portfolio/images/...` 경로를 생성 결과에서 `./images/...`로 바꿉니다. 상세 이미지·로컬 영상·상세 링크에도 같은 변환을 적용합니다. 외부 URL과 원본 JSON은 변경하지 않습니다.
- 생성한 JSON에 `Cache-Control: no-cache`를 적용합니다.
- CMS 원본, 운영 문서, 검사 스크립트는 배포 폴더에 포함하지 않습니다.
- `dist/`는 생성 결과이므로 Git에 커밋하지 않습니다. 기존 GitHub Pages 빌드에서도 제외합니다.
- Cloudflare Pages의 개별 파일 25 MiB 제한을 검사합니다. 현재 이미지들은 검사를 통과했습니다.

## 확인 방법

1. 배포 로그에 `Cloudflare Pages build: dist/ (15 published works)`가 표시되는지 확인합니다. 15는 현재 초기 등록 작품 수이며 이후 공개 작품 수에 따라 달라집니다.
2. Cloudflare가 발급한 사이트 주소에서 `/data/works.json`을 열면 실제 JSON 배열이 나와야 합니다. Liquid 코드나 HTML이면 빌드 명령/출력 폴더를 확인합니다.
3. 사이트의 Visual/Web/Branding/Video 탭, 상세 모달과 대표 이미지를 확인합니다.
4. Pages CMS에서 저장한 후 Cloudflare의 최신 배포 성공을 확인하고 새로고침합니다.
5. 기존에 알려진 `videos/생명을 이어가는 하루.mp4` 누락은 호스팅 변경으로 해결되지 않습니다. 실제 파일 또는 영상 URL이 필요합니다.

검증 명령: `node --test scripts/test-cloudflare.mjs`. GitHub의 Validate CMS Works 검사에도 포함되어 있습니다. 테스트는 실제 빌드, 기존 HTML/CSS/JS 보존, 공개 작품 데이터, 모든 로컬 이미지 존재, CMS 업로드 경로 변환, 비공개 작품 제외를 확인합니다.

## 적용 범위

저장소에는 빌드 및 검사 구성이 적용됩니다. Cloudflare 계정에서 Git 저장소 연결과 첫 배포가 완료되기 전에는 실제 Cloudflare 배포 URL이나 성공을 확정하지 않습니다. GitHub Pages는 기존 주소에서 계속 사용할 수 있습니다.

공식 문서:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
- https://developers.cloudflare.com/pages/platform/limits/
