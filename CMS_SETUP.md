# Pages CMS Works 운영 안내

대상: `StudioDOIT/My-Portfolio`, 기본 브랜치 `main`.

## Pages CMS 연결과 Works 목록 확인

1. https://app.pagescms.org/ 에서 GitHub로 로그인합니다.
2. Pages CMS의 GitHub App에 `StudioDOIT/My-Portfolio` 접근을 허용합니다. ChatGPT의 GitHub 연결과 Pages CMS의 GitHub App 연결은 별개입니다.
3. 저장소 `StudioDOIT/My-Portfolio`, 브랜치 `main`을 선택합니다.
4. **Works**를 엽니다. 최초 마이그레이션 기준 아래의 기존 작품 **15개**가 개별 항목으로 표시되어야 합니다.
5. 목록에는 작품명, 카테고리, 제작 연도, 공개 여부, 노출 순서가 표시됩니다. 검색 및 정렬 메뉴를 사용할 수 있습니다. 기본 정렬은 노출 순서 오름차순입니다.
6. 비어 있으면 다른 브랜치가 아닌지, 저장소 접근 권한이 있는지 확인하고 저장소/목록을 새로고침합니다. `.pages.yml`의 Works 경로는 `_data/works`이며 파일마다 작품 한 개가 있습니다.

설정은 이미 저장소에 작성되어 있습니다. YAML 작성이나 복사·붙여넣기는 필요하지 않습니다. 별도의 Detail Pages 메뉴는 만들지 않았습니다.

## 작품 추가·수정·삭제

- **추가:** Works에서 새 항목을 만들고 고유한 작품 ID, 작품명, WORKS 탭, 카테고리, 대표 이미지, 노출 순서를 입력하고 저장합니다. ID는 `visual-07` 같은 영문 소문자·숫자·하이픈 형태로 지정합니다. 파일명은 ID에 따라 자동 생성됩니다. 기존 ID를 재사용하지 마세요.
- **수정:** 기존 항목을 열고 내용을 수정한 뒤 저장합니다. ID와 기존 파일명은 유지하세요. 제목을 변경해도 ID를 바꿀 필요가 없습니다.
- **삭제:** 해당 항목의 삭제 기능을 사용합니다. 다음 배포에서 카드가 제거됩니다. Git 이력으로 복구할 수 있습니다.
- **공개 여부 / 메인 WORKS 노출:** 두 스위치가 모두 켜져야 사이트에 표시됩니다. 하나라도 끄면 Collection에는 남고 공개 JSON과 카드에서는 제외됩니다. 별도 추천 영역은 추가하지 않았습니다.
- **노출 순서:** 작은 숫자가 먼저 표시됩니다. 각 탭 안에서 정렬하며 동률은 ID 순서입니다. 초기 값 1~15는 기존 탭별 작품 순서를 그대로 보존합니다.
- **카테고리와 WORKS 탭:** `category`는 카드에 보이는 Poster, Branding 등의 분류이며 `workGroup`은 기존 Visual/Web/Branding/Video 탭을 결정합니다. 둘은 구분해서 선택합니다.
- **검색과 정렬:** 실제 JSON에 존재하는 필드로만 구성되어 있습니다. 제목·카테고리·연도·설명·ID를 검색하고 제목·카테고리·연도·공개·순서로 정렬할 수 있습니다.

## 이미지 업로드·선택

대표 이미지와 상세 이미지 필드에서 기존 이미지를 선택하거나 새 이미지를 업로드합니다. 기존 이미지 폴더 `images/`를 그대로 사용합니다. 새 이미지 URL은 `/My-Portfolio/images/...`로 저장되어 GitHub Pages 저장소 하위 경로에서 작동합니다. 기존 `images/...` 상대 경로도 보존하며 정상 작동합니다.

상세 이미지에는 여러 이미지를 등록할 수 있습니다. 기존 상세 Swiper를 그대로 사용합니다. 저장소에서 이미 사용 중인 이미지 파일을 삭제하거나 다른 작품의 이미지에 덮어쓰지 마세요. 업로드 커밋과 작품 저장 커밋이 나뉘면 마지막 작품 저장 후 배포 완료를 기다립니다.

## 상세페이지와 영상 연결

- `상세페이지 주소`는 외부 `https://...` 주소 또는 `./details/example.html` 같은 저장소 상대 경로로 입력합니다. 기존 HTML이 있으면 그대로 연결할 수 있습니다. 해당 파일이 실제 존재해야 합니다.
- 값이 없으면 기존 카드 클릭 → 상세 모달 동작이 유지됩니다. 값을 입력하면 모달의 ‘프로젝트 자세히 보기’ 링크에 반영됩니다. 자동으로 새로운 상세 HTML을 생성하지 않습니다.
- 조사 시 저장소의 HTML은 `index.html` 한 개였고, 기존 작품의 별도 상세페이지 주소는 없었습니다. 이미지와 YouTube를 상세 HTML로 오인해 연결하지 않았습니다.
- 영상 작품은 `YouTube 영상 ID` 또는 `영상 파일 경로`를 편집합니다. 기존 새 탭 재생/영상 플레이어와 모달 동작을 유지합니다.
- `규격·매체`, `역할·기여도`, `사용 프로그램`, 디자인 의도, 브랜드 콘셉트, 영상 제작 과정 등 기존 부가 필드도 편집할 수 있습니다. 작품 유형에 해당하는 항목을 작성합니다.

## 저장 위치와 자동 연결 구조

`Pages CMS → _data/works/<id>.json → GitHub Pages Jekyll 배포 → data/works.json → js/app.js → 기존 WORKS 카드/Swiper/상세 모달`

- `.pages.yml`: **Collection 방식** Works와 이미지 미디어 설정. 하나의 배열 파일을 CMS 편집 대상으로 사용하지 않습니다.
- `_data/works/*.json`: 작품 한 개당 JSON 한 개. 유일한 작품 원본입니다.
- `data/works.json`: Jekyll/Liquid 자동 통합 템플릿입니다. 배포 시 공개 및 메인 노출 작품만 담은 실제 JSON 배열이 됩니다. 원본 템플릿을 직접 JSON 편집하지 마세요.
- `js/app.js`: 배포된 JSON을 읽고 CMS 순서로 정렬해 기존 렌더러와 인터랙션에 전달합니다. 카운트도 자동 갱신합니다. CMS 문구는 HTML로 실행되지 않도록 이스케이프합니다.
- `_config.yml`: 기존 main/root GitHub Pages Jekyll 빌드를 사용하며 운영 문서와 검사 스크립트는 배포에서 제외합니다.
- `scripts/build-works.mjs`: Collection 검증과 정적 JSON 통합 스크립트. 로컬에서는 `node scripts/build-works.mjs --out /tmp/works.json`으로 실행합니다. 원본 Jekyll 템플릿 덮어쓰기를 방지합니다.
- `scripts/check-cms.py`: CMS 설정/실제 폴더/개별 JSON 키/목록 필드를 별도로 검증합니다.
- `scripts/test-works.mjs`: 추가·수정·삭제·공개·메인 노출·순서·이미지·링크 및 잘못된 데이터 처리 테스트.
- `.github/workflows/validate-works.yml`: 커밋/PR마다 CMS 정합성, 데이터 생성, 기능 테스트, 실제 Jekyll JSON 결과 일치를 검사합니다. 커밋을 생성하지 않아 반복 실행 루프가 없습니다.

## GitHub Pages 배포 확인

기존 GitHub Pages의 main/root 기본 배포는 유지합니다. CMS 저장 → GitHub 커밋 → 기존 **pages build and deployment** 실행 → Jekyll 통합 → 사이트 반영 순서입니다. 새로운 서버, 데이터베이스, Cloudflare 설정, 프레임워크는 추가하지 않았습니다. CSS·이미지·기존 HTML·방명록 관련 기능은 수정하지 않았습니다.

1. 저장소 Actions 탭 https://github.com/StudioDOIT/My-Portfolio/actions 에서 **pages build and deployment**와 **Validate CMS Works**가 성공했는지 확인합니다.
2. https://studiodoit.github.io/My-Portfolio/data/works.json 에서 배포된 작품 JSON을 확인합니다. 이 주소의 응답이 `---` 또는 Liquid 코드가 아니라 `[`로 시작하는 JSON이어야 합니다.
3. https://studiodoit.github.io/My-Portfolio/ 에서 탭별 카드와 작품 수를 확인합니다. 배포 완료 후 캐시가 남으면 강력 새로고침합니다.
4. 공개/메인 노출을 끈 작품은 공개 JSON과 카드에서 제외되어야 합니다. 마지막 작품까지 삭제하면 각 탭에 빈 상태 안내가 표시됩니다.
5. `Validate CMS Works`는 검사 전용이며 기존 Pages 배포를 대체하지 않습니다. 배포 설정을 GitHub Actions 모드나 `.nojekyll` 방식으로 임의 변경하면 Jekyll 통합이 중단될 수 있습니다.

## 마이그레이션 분석 및 초기 등록 내역

이전 작품 원본: `js/app.js` 내부 `workData` 배열. HTML에 중복 작품 카드나 별도 Collection은 없었습니다. 등록 전 `.pages.yml`은 빈 파일이었습니다.

기존 15개 → 개별 JSON 15개. Visual 6 / Web 3 / Branding 2 / Video 4. 원본의 모든 데이터 키와 값(긴 설명·상세 이미지·영상 ID 포함)을 보존했으며, CMS 관리 필드만 추가했습니다. ID는 브랜딩의 기존 slug를 재사용하고 나머지는 탭과 기존 순번으로 부여했습니다.

Swiper, GSAP/ScrollTrigger, 키보드 조작, 상세 모달, YouTube 새 탭 재생을 유지했습니다. Fancybox 사용은 발견되지 않았습니다.

| 순서 | 작품명 | 탭 | 카테고리 | 대표 이미지 | Collection 파일 |
| --- | --- | --- | --- | --- | --- |
| 1 | 공기업 취업특강 안내포스터 리디자인 | visual | Poster | `images/공기업취업특강포스터3.png` | `_data/works/visual-01.json` |
| 2 | 청년창업지원사업 안내포스터 | visual | Poster | `images/청년창업지원포스터3.png` | `_data/works/visual-02.json` |
| 3 | 민생회복소비쿠폰 카드뉴스 | visual | Card news | `images/민생회복7.png` | `_data/works/visual-03.json` |
| 4 | 연세대 2단 리플렛 | visual | leaflet | `images/연세대2단리플렛1.png` | `_data/works/visual-04.json` |
| 5 | 스타벅스 3단 리플렛 | visual | leaflet | `images/스타벅스3단리플렛1.png` | `_data/works/visual-05.json` |
| 6 | 기업 명함 디자인 | visual | Business card | `images/기업명함제작1.png` | `_data/works/visual-06.json` |
| 7 | 가상브랜드 CHERIE 웹사이트 메인배너 디자인 프로젝트 | web | Banner | `images/CHERIE 가상브랜드히어로배너1.png` | `_data/works/web-01.json` |
| 8 | 아이오페 맨즈 웹사이트 디자인 프로젝트 | web | Web Design | `images/아이오페맨즈웹사이트1.png` | `_data/works/web-02.json` |
| 9 | 올리브베러 웹사이트 리디자인 프로젝트 | web | Web Design | `images/올리브베러웹사이트1.png` | `_data/works/web-03.json` |
| 10 | fold | branding | Branding | `images/fold-thumb.png` | `_data/works/fold.json` |
| 11 | BURGERCLUB | branding | Branding | `images/burgerclub-thumb.png` | `_data/works/burgerclub.json` |
| 12 | 한국수목원정원관리원 공모전 생성형 AI 활용 (숏폼 부문) | motion | Video | `images/한수정썸네일1.png` | `_data/works/motion-01.json` |
| 13 | G-MARKET 2D 30s 모션그래픽 | motion | Motion | `images/지마켓썸네일1.png` | `_data/works/motion-02.json` |
| 14 | 넷플릭스 인트로 활용 식전영상 | motion | Video | `images/넷플릭스1.png` | `_data/works/motion-03.json` |
| 15 | CORTIS (코르티스) - REDRED 교차편집 (STAGE MIX) | motion | Video | `images/코르티스레드레드썸네일.jpg` | `_data/works/motion-04.json` |

## 원본에서 누락되거나 미완성인 정보

- 전 작품의 제작 연도와 태그는 원본에 없었습니다. `year: ""`, `tags: []`로 두었고 추정값을 넣지 않았습니다.
- 별도 상세 HTML/상세페이지 주소가 없으므로 `projectUrl`은 빈 값입니다. 기존 모달과 상세 이미지는 보존했습니다.
- 전 작품의 `detailDescription`은 빈 값이었습니다. 기존 짧은 설명 및 각 유형의 디자인/제작 과정 필드를 그대로 유지했습니다.
- `fold`, `BURGERCLUB`의 `brandConcept`, `identityNotes`는 빈 값입니다. 기존 안내 문구 동작은 유지됩니다.
- ‘기업 명함 디자인’의 `format` 원본 값은 `?????`입니다. 임의로 규격을 정하지 않았습니다.
- 한국수목원정원관리원 작품의 `videos/생명을 이어가는 하루.mp4`는 원본 JS에만 경로가 있고 저장소 파일은 없습니다. 경로를 그대로 보존하며 검사에서 경고합니다. 이 파일을 업로드하거나 CMS에서 실제 영상 URL/YouTube ID를 입력해야 영상 재생을 확인할 수 있습니다.

## 검증 범위

파일 기반 검사: Collection 경로, 개별 파일 형식, CMS 입력 필드와 데이터 키, 목록/검색/정렬 필드, 이미지 파일 존재, 기존 원본 15개와 등록 JSON의 모든 기존 키/값 및 순서 일치.

실행 검사: Node 정적 JSON 생성, 추가·수정·삭제·공개·메인 노출·노출 순서·이미지·상세 링크 전파 테스트. Actions는 실제 Jekyll 출력과 정적 생성 결과도 비교합니다.

Pages CMS의 실제 Works 목록, 폼 저장, 이미지 업로드 및 검색/정렬 UI는 Pages CMS 로그인이 필요합니다. 파일 검증만으로 CMS 화면 확인까지 완료했다고 간주하지 않습니다. 사이트 및 Actions의 실제 배포 확인 결과는 적용 커밋 이후 결과 보고에서 구분합니다.

## 공식 설정 근거

- https://pagescms.org/docs/configuration/content/
- https://pagescms.org/docs/configuration/content/view/
- https://pagescms.org/docs/configuration/content/filename/
- https://pagescms.org/docs/configuration/media/
- https://pagescms.org/docs/configuration/fields/image/
- https://jekyllrb.com/docs/datafiles/
- https://jekyllrb.com/docs/front-matter/
