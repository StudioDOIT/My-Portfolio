document.addEventListener('DOMContentLoaded', function () {
    /* =========================================================
       01. Selected Gallery
       ========================================================= */

    const gallery = document.querySelector('.hero-gallery');
    const galleryElement =
        gallery && gallery.querySelector('.hero-swiper');

    if (galleryElement && typeof Swiper !== 'undefined') {
        const slideCount = gallery.querySelector('.slide-count');
        const totalSlides =
            galleryElement.querySelectorAll('.swiper-slide').length;

        function updateGalleryCount(swiper) {
            if (!slideCount) return;

            const current = String(swiper.realIndex + 1).padStart(2, '0');
            const total = String(totalSlides).padStart(2, '0');

            slideCount.textContent = current + ' / ' + total;
        }

        new Swiper(galleryElement, {
            slidesPerView: 1,
            spaceBetween: 24,
            speed: 600,
            rewind: true,
            navigation: {
                prevEl: gallery.querySelector('.slide-prev'),
                nextEl: gallery.querySelector('.slide-next')
            },
            on: {
                init: updateGalleryCount,
                slideChange: updateGalleryCount
            }
        });
    }

    /* =========================================================
       02. 질문 버튼 → Work 탭 바로 이동
       ========================================================= */

    function selectQuestion(button) {
        const category = button.dataset.question;
        if (!workPanels[category]) return;

        switchCategory(category);
        setActiveNav('#work');

        const tab = document.getElementById('tab-' + category);

        if (tab) {
            tab.focus({ preventScroll: true });
        }

        const work = document.getElementById('work');

        if (work) {
            work.scrollIntoView({
                behavior: reducedMotion.matches ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    }

    /* =========================================================
       03. Work 데이터

       portrait: 세로 작업
       wide: 가로 작업

       description: 목록에 표시할 짧은 설명
       detailDescription: 모달에 표시할 긴 설명 (백틱 안에 작성)
       빈 상태이면 기존 description을 표시합니다.
       문단 사이에는 빈 줄을 넣으세요.
       글 안에 백틱을 사용할 때는 \`로, ${를 쓸 때는 \${로 적으세요.

       image: 목록 썸네일
       detailImages: 모달 상세 이미지
       ========================================================= */

    const workData = {
        visual: [
            {
                title: '청년창업지원사업 안내포스터',
                category: 'Poster',
                description: '청년의 시작을 그리다.',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 이 작업의 모달에 표시할 내용을 입력하세요.
                format: 'A3',          // 예: A3 포스터 / 3단 리플렛 / SNS 카드뉴스
                role: '기획 · 디자인 / 개인 작업 100%',            // 담당 역할 · 기여도
                tools: 'Illustrator',           // 사용 프로그램
                designIntent: `가장 먼저 확인해야 하는 정보를
                중심으로 콘텐츠를 구성하고,
                한눈에 핵심 내용을 파악할 수 있도록
                명확한 정보 위계를 적용했습니다.

`,    // 작업의 목적 · 대상 · 전달할 메시지
                designApproach: `청년층을 대상으로 하는 홍보물인 만큼
                공공기관 특유의 신뢰감은 유지하면서도
                밝고 역동적인 그래픽 요소와 컬러를 활용해
                친근하고 적극적인 분위기를 표현했습니다.`,  // 컬러 · 서체 · 이미지 · 레이아웃의 표현 의도
                layout: 'portrait',
                image: 'images/청년창업지원포스터1.jpg',
                detailImages: [
                    'images/visual-05.jpg'
                ]
            },
            {
                title: '공기업 취업특강 안내포스터',
                category: 'Poster',
                description: '이제는 취업하세요!',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 이 작업의 모달에 표시할 내용을 입력하세요.
                format: 'A3',          // 예: A3 포스터 / 3단 리플렛 / SNS 카드뉴스
                role: '디자인 / 개인 작업 100%',            // 담당 역할 · 기여도
                tools: 'Illustrator',           // 사용 프로그램
                designIntent: `가독성 높은 레이아웃으로 배치하여 
                핵심 정보를 빠르게 확인할 수 있도록
                설계하였습니다.

`,    // 작업의 목적 · 대상 · 전달할 메시지
                designApproach: `공공기관 관련 콘텐츠에 어울리는
                신뢰감 있고 정돈된 인상을 유지하는 데
                중점을 두었습니다.`,  // 컬러 · 서체 · 이미지 · 레이아웃의 표현 의도
                layout: 'portrait',
                image: 'images/공기업취업특강포스터1.jpg',
                detailImages: [
                    'images/romaine-poster.jpg'
                ]
            },
            {
                title: '연세대 2단 리플렛',
                category: 'leaflet',
                description: '힘내라 우리 후배들!',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 이 작업의 모달에 표시할 내용을 입력하세요.
                format: 'A4',          // 예: A3 포스터 / 3단 리플렛 / SNS 카드뉴스
                role: '디자인 / 개인 작업 100%',            // 담당 역할 · 기여도
                tools: 'Illustrator · ChatGPT',           // 사용 프로그램
                designIntent: `연세 후배사랑 장학기금 모금 캠페인의 목적과 신뢰감을
                효과적으로 전달할 수 있도록 학교의 아이덴티티 컬러인
                블루를 중심으로 전체적인 톤앤매너를 구성했습니다.

                캠페인의 메시지와 일러스트를 활용해 후배를
                응원하는 따뜻한 의미를 강조하고, 내지까지 자연스럽게
                이어질 수 있도록 통일된 그래픽 요소와 레이아웃을 적용했습니다.

`,    // 작업의 목적 · 대상 · 전달할 메시지
                designApproach: `

                내지에서는 장학금 유형과 기념품 안내, 약정서 등 많은 정보를
                쉽게 확인할 수 있도록 내용별 영역을 명확하게 구분하고 시각적
                위계를 정리했습니다.

                특히 설명 영역과 작성 영역의 성격을 구분해
                가독성을 높이고, 사용자가 필요한 정보를 빠르게 찾고 자연스럽게
                약정서 작성까지 이어갈 수 있도록 설계했습니다.`,  // 컬러 · 서체 · 이미지 · 레이아웃의 표현 의도
                layout: 'wide',
                image: 'images/연세대2단리플렛1.png',
                detailImages: [
                    'images/연세대2단리플렛1.png',
                    'images/연세대2단리플렛2.png',
                    'images/연세대2단리플렛3.jpg',
                    'images/연세대2단리플렛4.jpg',
                ]
            },
            {
                title: '스타벅스 3단 리플렛',
                category: 'leaflet',
                description: '스타벅스와 함께 특별한 순간을.',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 이 작업의 모달에 표시할 내용을 입력하세요.
                format: 'A4',          // 예: A3 포스터 / 3단 리플렛 / SNS 카드뉴스
                role: '디자인 / 개인 작업 100%',            // 담당 역할 · 기여도
                tools: 'Illustrator · ChatGPT',           // 사용 프로그램
                designIntent: `딜리버스 서비스에 대한 내용을 쉽게 전달하기 위해
                접지형 인쇄물의 특성을 고려해 표지, 브랜드 소개,
                주요 메뉴 및 프로모션 정보가 자연스럽게 이어지도록
                콘텐츠 흐름을 구성했으며, 펼쳤을 때 각 면이 하나의
                통일된 레이아웃으로 연결되도록 디자인했습니다.

`,    // 작업의 목적 · 대상 · 전달할 메시지
                designApproach: `특히 3단 접지 구조에서 사용자가 정보를 확인하는
                순서를 고려해 표지에서 관심을 유도하고, 내부에서는
                핵심 내용을 빠르게 파악할 수 있도록 시각적 위계와
                가독성을 중점적으로 설계했습니다.`,  // 컬러 · 서체 · 이미지 · 레이아웃의 표현 의도
                layout: 'wide',
                image: 'images/스타벅스3단리플렛1.png',
                detailImages: [
                    'images/스타벅스3단리플렛1.png',
                    'images/스타벅스3단리플렛2.png',
                    'images/스타벅스3단리플렛3.jpg',
                    'images/스타벅스3단리플렛4.jpg',
                ]
            },
            {
                title: '민생회복소비쿠폰 카드뉴스',
                category: 'Card news',
                description: '일상에 닿는 정책의 언어.',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 이 작업의 모달에 표시할 내용을 입력하세요.
                format: '1080 * 1080 px',          // 예: A3 포스터 / 3단 리플렛 / SNS 카드뉴스
                role: '디자인 / 개인 작업 100%',            // 담당 역할 · 기여도
                tools: 'Illustrator',           // 사용 프로그램
                designIntent: `지원 대상, 신청 방법, 지급 방식 등 핵심 정보를
                중심으로 내용을 단계별로 정리하고, 복잡한 정책
                정보를 한눈에 파악할 수 있도록 직관적인 정보 구조를
                구성했습니다.

                특히 이용자가 실제로 궁금해할 정보를 중심으로
                배치해 정보 전달성과 가독성을 함께 높였습니다.
`,    // 작업의 목적 · 대상 · 전달할 메시지
                designApproach: `공공정보 콘텐츠의 신뢰감을 유지하면서도
                딱딱한 인상을 줄이기 위해 명확한 타이포그래피와
                간결한 그래픽 요소를 활용했으며, 중요한 내용은
                컬러와 크기 대비를 통해 자연스럽게 강조했습니다.`,  // 컬러 · 서체 · 이미지 · 레이아웃의 표현 의도
                layout: 'portrait',
                image: 'images/민생회복1.jpg',
                detailImages: [
                    'images/민생회복1.jpg',
                    'images/민생회복2.jpg',
                    'images/민생회복3.jpg',
                    'images/민생회복4.jpg',
                    'images/민생회복5.jpg',
                    'images/민생회복6.jpg'

                ]
            },
            {
                title: '기업 명함 디자인',
                category: 'Business card',
                description: '작은 면적에 담긴 서로 다른 아이덴티티.',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 이 작업의 모달에 표시할 내용을 입력하세요.
                format: '?????',          // 예: A3 포스터 / 3단 리플렛 / SNS 카드뉴스
                role: '기획 · 디자인 / 개인 작업 100%',            // 담당 역할 · 기여도
                tools: 'Illustrator',           // 사용 프로그램
                designIntent: `각 브랜드의 로고, 컬러, 타이포그래피,
                이미지 톤 등 시각적 특징을 참고해 서로 다른
                분위기의 명함 디자인을 구성하였습니다.

`,    // 작업의 목적 · 대상 · 전달할 메시지
                designApproach: `특히 앞·뒷면의 시각적 연결성과 실제 인쇄물을
                고려한 구성에 중점을 두어, 단순한 정보 전달물을
                넘어 브랜드 이미지를 보여주는 하나의 비주얼
                아이덴티티 매체로 완성했습니다.`,  // 컬러 · 서체 · 이미지 · 레이아웃의 표현 의도
                layout: 'wide',
                image: 'images/기업명함제작1.png',
                detailImages: [
                    'images/기업명함제작1.png',
                    'images/기업명함제작2.png',
                ]
            },


        ],

        branding: [
            {
                title: 'BURGERCLUB',
                category: 'Branding',
                description: '편하게 맛있는 버거를 마음껏 먹고 싶은 사람들을 위한 수제버거 브랜드',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 이 브랜드의 모달에 표시할 내용을 입력하세요.
                scope: '네이밍 · 로고 · 패키지 · 응용 디자인',           // 예: 네이밍 · 로고 · 패키지 · 응용 디자인
                role: '기획 · 디자인 / 개인 작업 100%',            // 담당 역할 · 기여도
                tools: 'Illustrator · ChatGPT',           // 사용 프로그램
                brandConcept: ``,    // 브랜드가 지향하는 가치 · 타깃 · 핵심 콘셉트
                identityNotes: ``,   // 로고 · 컬러 · 서체 · 응용 디자인의 전개
                layout: 'wide',
                image: 'images/버거클럽썸네일.png',
                detailImages: [
                    'images/버거클럽썸네일.png'
                ]
            },
            {
                title: 'fold',
                category: 'Branding',
                description: '겹겹이 쌓이는 일상의 따뜻함과 소중함을 담은 베이커리 브랜드',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 이 브랜드의 모달에 표시할 내용을 입력하세요.
                scope: '네이밍 · 로고 · 패키지 · 응용 디자인',           // 예: 네이밍 · 로고 · 패키지 · 응용 디자인
                role: '기획 · 디자인 / 개인 작업 100%',            // 담당 역할 · 기여도
                tools: 'Illustrator · ChatGPT',           // 사용 프로그램
                brandConcept: ``,    // 브랜드가 지향하는 가치 · 타깃 · 핵심 콘셉트
                identityNotes: ``,   // 로고 · 컬러 · 서체 · 응용 디자인의 전개
                layout: 'wide',
                image: 'images/폴드썸네일.png',
                detailImages: [
                    'images/폴드썸네일.png'
                ]
            },
        ],

        motion: [
            {
                title: 'G-MARKET 2D 30s 모션그래픽',
                category: 'Motion',
                description: '검색부터 선택까지, 쇼핑의 흐름을 담은 2D 모션그래픽',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 영상 모달 설명: 따옴표/백틱 안에 작업별 내용을 입력하세요.
                duration: '00:30',                  // 예: '00:30'
                role: '기획 · 디자인 · 편집 / 개인 작업 100%',                      // 예: '기획 · 디자인 · 편집 / 개인 작업 100%'
                tools: 'After Effects · Illustrator · ChatGPT',                     // 예: 'After Effects · Premiere Pro'
                productionNotes: `온라인 쇼핑 플랫폼 G마켓을 주제로, 검색부터 상품을 발견하고 선택해 장바구니에 담는 과정을
                하나의 흐름으로 구성한 30초 모션그래픽 광고 영상을 제작했습니다.

                전체 영상은 SEARCH → FIND → CHOOSE → ADD의 쇼핑 경험을 중심으로 전개했으며,
                검색창에 키워드를 직접 입력하고 삭제하는 타이핑 모션, 상품 카드의 이동과 회전, 아이콘 및
                타이포그래피 전환 등 다양한 2D 모션을 활용해 짧은 러닝타임 안에서도 화면의 리듬이 끊기지
                않도록 구성했습니다.
                
                특히 ‘사람과 상품을 잇는, 취향과 브랜드를 잇는’이라는 메시지를 중심으로 ‘잇는’이라는 키워드가
                자연스럽게 연결되도록 연출하고, 검색과 선택이라는 익숙한 쇼핑 행동을 직관적인 그래픽으로
                시각화했습니다.
                
                G마켓의 브랜드 컬러와 쇼핑 UI에서 연상되는 그래픽 요소를 적극적으로 활용하되,
                실제 웹 화면을 그대로 재현하기보다는 광고 영상에 적합한 타이포그래피와 카드형 레이아웃으로
                재구성했습니다.

                빠르고 경쾌한 온라인 쇼핑 경험을 표현하는 데 중점을 두었습니다.`,           // 기획 의도와 제작 과정을 여러 문단으로 입력
                projectUrl: '',                // 상세 페이지가 있으면 주소 입력

                layout: 'wide',
                image: 'images/지마켓썸네일.png',

                // YouTube 공유 주소의 영상 ID
                youtubeId: 'F6jmoRrXnYE',

                detailImages: [
                    'images/지마켓썸네일.png'
                ]
            },
            {
                title: '한국수목원정원관리원 공모전 생성형 AI 활용 (숏폼 부문)',
                category: 'Video',
                description: '한국수목원정원관리원의 역할을 캐릭터로 풀어낸 생성형 AI 숏폼',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 영상 모달 설명: 따옴표/백틱 안에 작업별 내용을 입력하세요.
                duration: '00:15',                  // 예: '00:30'
                role: '기획 · 디자인 · 편집 / 개인 작업 100%',                      // 예: '기획 · 디자인 · 편집 / 개인 작업 100%'
                tools: 'ChatGPT · Google Flow',                     // 예: 'After Effects · Premiere Pro'
                productionNotes: `한국수목원정원관리원의 핵심 업무를 친근하게 전달하기 위해
                산림생태계 관리, 식물 증식 및 복원, 곤충 관리, 희귀·자생식물 보전, 시설물 관리를
                각각 하나의 캐릭터로 의인화하여 세계관을 구성했습니다.

                자연을 소재로 한 캐릭터의 형태와 색감, 의상, 표정 등을 통일해
                각기 다른 역할을 지니면서도 하나의 시리즈처럼 보이도록 디자인했습니다.

                AI 이미지 생성 과정에서는 캐릭터의 외형과 배경 스타일이 장면마다 달라지지 않도록
                프롬프트를 반복적으로 수정하며 일관성을 높였습니다.

                또한 영상으로 확장했을 때 장면이 자연스럽게 연결될 수 있도록
                카메라 구도와 빛의 방향, 시간대와 장면 전환까지 함께 고려해
                수목원의 다양한 역할과 자연 보전의 이야기가 하나의 흐름으로 이어지도록 구성했습니다.`,           // 기획 의도와 제작 과정을 여러 문단으로 입력
                projectUrl: '',                // 상세 페이지가 있으면 주소 입력

                layout: 'wide',
                image: 'images/한수정썸네일1.png',

                // ★ 여기 수정: 실제 영상 파일 경로로 변경
                videoSrc: 'videos/생명을 이어가는 하루.mp4',

                detailImages: [
                    'images/한수정썸네일1.png',
                    'images/한수정썸네일2.png',
                    'images/한수정썸네일3.png',
                    'images/한수정썸네일4.png',
                    'images/한수정썸네일5.png',
                    'images/한수정썸네일6.png'
                ]
            },
            {
                title: 'CORTIS (코르티스) - REDRED 교차편집 (STAGE MIX)',
                category: 'Video',
                description: '서로 다른 무대를 안무와 리듬에 맞춰 연결한 ‘REDRED’ 교차편집 영상',
                // 아래 백틱 사이에 이 작업의 긴 설명을 적어주세요.
                detailDescription: ``,
                // 영상 모달 설명: 따옴표/백틱 안에 작업별 내용을 입력하세요.
                duration: '02:41',                  // 예: '00:30'
                role: '기획 · 편집 / 개인 작업 100%',                      // 예: '기획 · 디자인 · 편집 / 개인 작업 100%'
                tools: 'Premiere Pro',                     // 예: 'After Effects · Premiere Pro'
                productionNotes: `서로 다른 무대가 하나의 퍼포먼스처럼 이어지도록 구성한 교차편집 작업입니다.
                무대마다 달라지는 의상과 조명, 배경을 활용하면서도 안무와 곡의 흐름이 자연스럽게 이어지는 데 중점을 두었습니다.

                장면을 연결할 때는 인물의 위치와 움직임, 카메라 구도를 기준으로 전환 지점을 잡았습니다.
                멤버의 표정이 드러나는 클로즈업과 안무를 보여주는 단체 장면을 함께 배치해 화면에 변화를 주고,
                곡의 전개에 따라 퍼포먼스의 에너지가 전달되도록 편집했습니다.
                

                ⚠️ 저작권 안내 (Copyright Notice)
                원본 영상 및 음원의 저작권은 각 방송사와 소속사에 있습니다.
                요청 시 삭제될 수 있습니다.
                (For portfolio purposes only. All rights belong to the original owners.)`,           // 기획 의도와 제작 과정을 여러 문단으로 입력
                projectUrl: '',                // 상세 페이지가 있으면 주소 입력

                layout: 'wide',
                image: 'images/코르티스레드레드썸네일.jpg',

                // YouTube 공유 주소의 영상 ID
                youtubeId: 'xcibSXSd048',

                detailImages: [
                    'images/코르티스레드레드썸네일.jpg'
                ]
            }
        ]

    };

    /* =========================================================
       04. Work 요소
       ========================================================= */

    const workTabs = document.querySelectorAll('.work-tabs button');

    const workPanels = {
        visual: document.getElementById('panel-visual'),
        branding: document.getElementById('panel-branding'),
        motion: document.getElementById('panel-motion')
    };

    const modal = document.getElementById('project-modal');
    let currentSwiper = null;

    /* =========================================================
       05. Work 카드 생성 / 형태별 정렬
       ========================================================= */

    const workSwipers = {};

    function renderProjects(category) {
        const panel = workPanels[category];
        if (!panel) return;

        if (workSwipers[category]) {
            workSwipers[category].destroy(true, true);
            delete workSwipers[category];
        }

        const projects = workData[category] || [];

        panel.classList.remove('work-grid--mixed');
        panel.classList.add('work-grid--carousel');

        panel.innerHTML = `
            <div class="swiper work-swiper" aria-label="${category} 작업물 갤러리">
                <div class="swiper-wrapper"></div>
            </div>
            <div class="work-carousel-controls">
                <span class="work-carousel-hint">
                    드래그하거나 화살표로 넘겨보세요
                </span>
                <div class="work-carousel-navigation">
                    <span
                        class="work-carousel-count"
                        aria-live="polite"
                        aria-atomic="true"
                    ></span>
                    <button
                        type="button"
                        class="work-carousel-prev"
                        aria-label="이전 작업물"
                    >←</button>
                    <button
                        type="button"
                        class="work-carousel-next"
                        aria-label="다음 작업물"
                    >→</button>
                </div>
            </div>
        `;

        const wrapper = panel.querySelector('.swiper-wrapper');

        const entries = projects.map(function (project, index) {
            return {
                project: project,
                index: index
            };
        });

        if (category === 'visual') {
            entries.sort(function (a, b) {
                function rank(entry) {
                    if (entry.project.layout === 'portrait') return 0;
                    return entry.index === 0 ? 1 : 2;
                }

                return rank(a) - rank(b) || a.index - b.index;
            });
        }

        entries.forEach(function (entry) {
            const project = entry.project;
            const layout =
                project.layout === 'wide' ? 'wide' : 'portrait';

            const card = document.createElement('article');

            card.className =
                'swiper-slide work-card work-card--' + layout;

            card.dataset.category = category;
            card.dataset.index = entry.index;

            card.innerHTML = `
                <button
                    type="button"
                    class="work-card-button"
                    aria-label="${project.title} 프로젝트 보기"
                >
                    <div class="work-card-image">
                        <img
                            src="${project.image}"
                            alt="${project.title}"
                            loading="lazy"
                        >
                    </div>
                    <div class="work-card-info">
                        <span class="work-card-category">
                            ${project.category}
                        </span>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                </button>
            `;

            wrapper.appendChild(card);
        });

        bindProjectCards(panel);

        panel.querySelector('.work-carousel-count').textContent =
            (projects.length ? '01' : '00') + ' / ' +
            String(projects.length).padStart(2, '0');
    }

    function activateWorkSwiper(category) {
        const panel = workPanels[category];

        if (
            !panel ||
            panel.hidden ||
            typeof Swiper === 'undefined'
        ) {
            return;
        }

        Object.values(workSwipers).forEach(function (swiper) {
            if (swiper.keyboard) swiper.keyboard.disable();
        });

        if (!workSwipers[category]) {
            workSwipers[category] = new Swiper(
                panel.querySelector('.work-swiper'),
                {
                    slidesPerView: 'auto',
                    spaceBetween: 24,
                    speed: reducedMotion.matches ? 0 : 500,
                    rewind: true,
                    grabCursor: true,
                    watchOverflow: true,
                    preventClicks: true,
                    preventClicksPropagation: true,
                    navigation: {
                        prevEl: panel.querySelector('.work-carousel-prev'),
                        nextEl: panel.querySelector('.work-carousel-next')
                    },
                    keyboard: {
                        enabled: true,
                        onlyInViewport: true
                    },
                    a11y: {
                        enabled: true,
                        prevSlideMessage: '이전 작업물',
                        nextSlideMessage: '다음 작업물'
                    },
                    on: {
                        init: updateCount,
                        slideChange: updateCount,
                        resize: updateCount
                    }
                }
            );
        }

        workSwipers[category].update();

        if (workSwipers[category].keyboard) {
            workSwipers[category].keyboard.enable();
        }

        function updateCount(swiper) {
            panel.querySelector('.work-carousel-count').textContent =
                String(swiper.realIndex + 1).padStart(2, '0') + ' / ' +
                String(workData[category].length).padStart(2, '0');
        }

        updateCount(workSwipers[category]);

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    /* =========================================================
       06. 프로젝트 카드 클릭
       ========================================================= */

    function bindProjectCards(panel) {
        panel.querySelectorAll('.work-card').forEach(function (card) {
            const button = card.querySelector('.work-card-button');
            if (!button) return;

            button.addEventListener('click', function () {
                const swiper = workSwipers[card.dataset.category];

                if (swiper && !swiper.allowClick) return;

                openProjectModal(
                    card.dataset.category,
                    Number(card.dataset.index)
                );
            });
        });
    }

    /* =========================================================
       07. 카테고리 전환
       ========================================================= */

    function switchCategory(category) {
        const targetPanel = workPanels[category];
        if (!targetPanel) return;

        const currentPanel =
            document.querySelector('.work-grid.is-active');

        workTabs.forEach(function (button) {
            const isActive = button.dataset.category === category;

            button.setAttribute('aria-selected', String(isActive));
            button.classList.toggle('is-active', isActive);
            button.tabIndex = isActive ? 0 : -1;
        });

        Object.values(workPanels).forEach(function (panel) {
            if (!panel) return;

            if (typeof gsap !== 'undefined') {
                gsap.killTweensOf(panel);
            }

            const isActive = panel === targetPanel;

            panel.hidden = !isActive;
            panel.classList.toggle('is-active', isActive);
        });

        activateWorkSwiper(category);

        if (typeof gsap !== 'undefined') {
            if (currentPanel === targetPanel) {
                gsap.set(targetPanel, {
                    opacity: 1,
                    y: 0
                });
            } else {
                gsap.fromTo(
                    targetPanel,
                    {
                        opacity: 0,
                        y: 20
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.45,
                        ease: 'power3.out'
                    }
                );
            }
        }
    }

    /* =========================================================
       08. 프로젝트 모달 열기
       ========================================================= */

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    let modalClosing = false;
    let returnFocus = null;
    let originalOverflow = '';
    let backgroundState = [];

    function openProjectModal(category, index) {
        const project =
            workData[category] &&
            workData[category][index];

        if (!project || !modal || modalClosing) return;

        const overlay = modal.querySelector('.modal-overlay');
        const container = modal.querySelector('.modal-container');

        if (!overlay || !container) return;

        if (!modal.classList.contains('is-open')) {
            returnFocus = document.activeElement;
            originalOverflow = document.body.style.overflow;

            backgroundState = Array.from(document.body.children)
                .filter(function (el) {
                    return (
                        el !== modal &&
                        !['SCRIPT', 'STYLE'].includes(el.tagName)
                    );
                })
                .map(function (el) {
                    const state = [el, el.inert];
                    el.inert = true;
                    return state;
                });
        }

        if (currentSwiper) {
            currentSwiper.destroy(true, true);
            currentSwiper = null;
        }

        const fields = {
            'modal-title': project.title,
            'modal-category': project.category,
            'modal-description':
                typeof project.detailDescription === 'string' &&
                    project.detailDescription.trim()
                    ? project.detailDescription.trim()
                    : project.description,
            'modal-type': project.category,
            'modal-type-2': project.category
        };

        Object.keys(fields).forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.textContent = fields[id];
        });

        const isMotion = category === 'motion';
        modal.classList.toggle('modal--motion', isMotion);
        modal.classList.add('modal--details');
        // 각 작업의 데이터로 정보 영역을 새로 구성합니다.
        const facts = modal.querySelector('.modal-facts');
        const factItems = [
            ['PROJECT TYPE', project.category],
            isMotion
                ? ['RUNNING TIME', project.duration || '러닝타임을 입력해 주세요.']
                : category === 'branding'
                    ? ['SCOPE', project.scope || '브랜드 작업 범위를 입력해 주세요.']
                    : ['FORMAT', project.format || '작업 규격과 매체를 입력해 주세요.'],
            ['ROLE · CONTRIBUTION', project.role || '담당 역할과 기여도를 입력해 주세요.'],
            ['TOOLS', project.tools || '사용 프로그램을 입력해 주세요.']
        ];
        if (facts) {
            facts.replaceChildren();
            factItems.forEach(function (entry) {
                const item = document.createElement('div');
                const label = document.createElement('dt');
                const value = document.createElement('dd');
                label.textContent = entry[0];
                value.textContent = entry[1];
                item.append(label, value);
                facts.appendChild(item);
            });
        }
        const processHeading = modal.querySelector('.process-heading');
        if (processHeading) processHeading.hidden = true;
        const process = document.getElementById('project-process');
        const sections = isMotion ? [
            ['기획 의도 · 제작 과정', project.productionNotes,
                '기획 의도, 표현 방식, 제작 과정에서 고민한 내용을 적어 주세요.']
        ] : category === 'branding' ? [
            ['브랜드 콘셉트', project.brandConcept,
                project.title + '의 브랜드 가치, 타깃과 핵심 콘셉트를 적어 주세요.'],
            ['아이덴티티 전개', project.identityNotes,
                '로고의 의미, 컬러와 서체 선정 이유, 패키지와 응용 디자인으로 이어지는 방식을 적어 주세요.']
        ] : [
            ['디자인 의도', project.designIntent,
                project.title + '의 제작 목적, 대상과 전달할 메시지를 적어 주세요.'],
            ['표현 방식 · 제작 과정', project.designApproach,
                '이 작업의 컬러, 서체, 이미지와 레이아웃을 선택한 이유와 제작 과정을 적어 주세요.']
        ];
        if (process) {
            process.replaceChildren();
            sections.forEach(function (section) {
                const item = document.createElement('div');
                const heading = document.createElement('dt');
                const body = document.createElement('dd');
                heading.textContent = section[0];
                body.textContent = (section[1] || '').trim() || section[2];
                item.append(heading, body);
                process.appendChild(item);
            });
        }
        const sampleNote = modal.querySelector('.sample-note');
        if (sampleNote) sampleNote.hidden = true;
        const detailLink = document.getElementById('motion-detail-link');
        if (detailLink) {
            detailLink.hidden = true;
            detailLink.removeAttribute('href');
            if (project.projectUrl) {
                try {
                    const url = new URL(project.projectUrl, window.location.href);
                    if (['http:', 'https:'].includes(url.protocol)) {
                        detailLink.href = url.href;
                        detailLink.hidden = false;
                    }
                } catch (error) { /* 주소를 입력할 때까지 버튼 숨김 */ }
            }
        }
        const player = document.getElementById('motion-player');
        const previousVideo = document.getElementById('modal-video');
        const youtubeId = /^[A-Za-z0-9_-]{11}$/.test(project.youtubeId || '')
            ? project.youtubeId : '';
        const hasVideo = isMotion && Boolean(youtubeId || project.videoSrc);
        if (player) player.hidden = !hasVideo;
        if (previousVideo) {
            stopModalVideo(previousVideo);
            // 매번 새 플레이어를 사용해 이전 영상의 로딩/오류 이벤트가 섞이지 않게 합니다.
            const video = document.createElement(hasVideo && youtubeId ? 'iframe' : 'video');
            video.id = 'modal-video';
            video.controls = true;
            video.playsInline = true;
            video.preload = 'metadata';
            previousVideo.replaceWith(video);
            const errorNote = document.getElementById('modal-video-error');
            if (errorNote) errorNote.hidden = true;
            if (hasVideo && youtubeId) {
                video.title = project.title + ' — YouTube 영상';
                video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                video.allowFullscreen = true;
                video.referrerPolicy = 'strict-origin-when-cross-origin';
                video.style.cssText = 'display:block;width:100%;height:auto;aspect-ratio:16/9;min-height:200px;border:0;background:#000;';
                video.src = 'https://www.youtube.com/embed/' + youtubeId + '?playsinline=1&rel=0';
            } else if (hasVideo) {
                video.poster = project.image;
                video.addEventListener('loadedmetadata', function () {
                    if (errorNote) errorNote.hidden = true;
                });
                video.addEventListener('error', function () {
                    if (!video.error || !errorNote || !video.isConnected) return;
                    const reasons = {
                        1: '영상 로딩이 중단됐습니다.',
                        2: '영상 파일을 읽지 못했습니다.',
                        3: '영상 데이터를 재생하지 못했습니다.',
                        4: '영상 파일을 찾지 못했거나 지원되지 않는 형식입니다.'
                    };
                    errorNote.textContent = (reasons[video.error.code] ||
                        '영상을 불러오지 못했습니다.') + ' 파일: ' + project.videoSrc;
                    errorNote.hidden = false;
                });
                // index.html을 기준으로 해석되는 기존 프로젝트 경로를 그대로 사용합니다.
                video.src = project.videoSrc;
                video.load();
            }
        }
        const gallery = document.getElementById('project-detail-swiper');
        if (gallery) gallery.hidden = hasVideo;
        const galleryMeta = modal.querySelector('.modal-swiper-meta');
        if (galleryMeta) galleryMeta.hidden = hasVideo;
        const description = modal.querySelector('.modal-description');
        if (description) description.hidden = false;

        const wrapper = document.getElementById('modal-slides');
        if (!wrapper) return;

        wrapper.replaceChildren();

        const images =
            project.detailImages && project.detailImages.length
                ? project.detailImages
                : [project.image];

        images.forEach(function (src, i) {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';

            const img = document.createElement('img');

            img.alt =
                project.title + ' 상세 이미지 ' + (i + 1);

            img.style.cssText =
                'display:block;max-width:100%;max-height:100%;' +
                'width:auto;height:auto;object-fit:contain';

            let fallbackUsed = false;

            img.addEventListener('error', function () {
                if (!fallbackUsed && src !== project.image) {
                    fallbackUsed = true;
                    img.src = project.image;
                } else {
                    img.hidden = true;
                    img.style.display = 'none';

                    const note = document.createElement('p');
                    note.textContent =
                        '상세 이미지를 불러오지 못했습니다.';

                    slide.appendChild(note);
                }
            });

            img.src = src;

            slide.appendChild(img);
            wrapper.appendChild(slide);
        });

        Object.values(workSwipers).forEach(function (swiper) {
            if (swiper.keyboard) swiper.keyboard.disable();
        });

        modal.hidden = false;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');

        document.body.style.overflow = 'hidden';
        container.scrollTop = 0;

        if (
            typeof gsap !== 'undefined' &&
            !reducedMotion.matches
        ) {
            gsap.killTweensOf([overlay, container]);

            gsap.fromTo(
                overlay,
                { opacity: 0 },
                { opacity: 1, duration: 0.25 }
            );

            gsap.fromTo(
                container,
                {
                    opacity: 0,
                    y: 24,
                    scale: 0.98
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.35,
                    ease: 'power2.out'
                }
            );
        } else {
            overlay.style.opacity = '1';
            container.style.opacity = '1';
            container.style.transform = 'none';
        }

        if (!hasVideo) initSwiper();

        const close = modal.querySelector('.modal-close');

        if (close) {
            close.focus({ preventScroll: true });
        }
    }

    /* =========================================================
       09. 상세 이미지 Swiper
       ========================================================= */

    function initSwiper() {
        const el = document.getElementById('project-detail-swiper');

        if (!modal || !el) return;

        const total = el.querySelectorAll('.swiper-slide').length;
        const counter = document.getElementById('modal-slide-count');

        function update(swiper) {
            if (!counter) return;

            const current = String(
                swiper ? swiper.realIndex + 1 : 1
            ).padStart(2, '0');

            counter.textContent =
                current + ' / ' + String(total).padStart(2, '0');
        }

        update();

        if (typeof Swiper === 'undefined') return;

        currentSwiper = new Swiper(el, {
            slidesPerView: 1,
            spaceBetween: 20,
            speed: reducedMotion.matches ? 0 : 450,
            rewind: true,
            navigation: {
                nextEl: modal.querySelector('.swiper-button-next'),
                prevEl: modal.querySelector('.swiper-button-prev')
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true
            },
            observer: true,
            observeParents: true,
            on: {
                init: update,
                slideChange: update
            }
        });
    }

    /* =========================================================
       10. 모달 닫기 / 키보드 처리
       ========================================================= */

    // iframe을 비우면 모달을 닫는 즉시 YouTube 재생도 종료됩니다.
    function stopModalVideo(video) {
        if (!video) return;
        if (video.tagName === 'IFRAME') {
            video.src = 'about:blank';
        } else if (typeof video.pause === 'function') {
            video.pause();
        }
    }

    function closeProjectModal() {
        if (
            !modal ||
            !modal.classList.contains('is-open') ||
            modalClosing
        ) {
            return;
        }

        modalClosing = true;
        const video = document.getElementById('modal-video');
        stopModalVideo(video);

        const overlay = modal.querySelector('.modal-overlay');
        const container = modal.querySelector('.modal-container');

        function finishClose() {
            if (currentSwiper) {
                currentSwiper.destroy(true, true);
                currentSwiper = null;
            }

            modal.classList.remove('is-open');
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');

            document.body.style.overflow = originalOverflow;

            backgroundState.forEach(function (state) {
                state[0].inert = state[1];
            });

            backgroundState = [];

            if (typeof gsap !== 'undefined') {
                gsap.set([overlay, container], {
                    clearProps: 'opacity,transform'
                });
            }

            modalClosing = false;

            Object.keys(workSwipers).forEach(function (key) {
                if (
                    !workPanels[key].hidden &&
                    workSwipers[key].keyboard
                ) {
                    workSwipers[key].keyboard.enable();
                }
            });

            if (returnFocus && returnFocus.isConnected) {
                returnFocus.focus({ preventScroll: true });
            }
        }

        if (
            typeof gsap !== 'undefined' &&
            !reducedMotion.matches
        ) {
            gsap.killTweensOf([overlay, container]);

            gsap.to(container, {
                opacity: 0,
                y: 16,
                duration: 0.2
            });

            gsap.to(overlay, {
                opacity: 0,
                duration: 0.2,
                onComplete: finishClose
            });
        } else {
            finishClose();
        }
    }

    document.addEventListener('keydown', function (event) {
        if (!modal || !modal.classList.contains('is-open')) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closeProjectModal();
        } else if (event.key === 'Tab') {
            const items = Array.from(
                modal.querySelectorAll(
                    'button, a[href], input, select, textarea, [tabindex]'
                )
            ).filter(function (el) {
                return (
                    !el.disabled &&
                    el.tabIndex >= 0 &&
                    el.getClientRects().length
                );
            });

            const first = items[0];
            const last = items[items.length - 1];

            if (!first) {
                event.preventDefault();
                return;
            }

            if (
                event.shiftKey &&
                (
                    document.activeElement === first ||
                    !items.includes(document.activeElement)
                )
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                (
                    document.activeElement === last ||
                    !items.includes(document.activeElement)
                )
            ) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    /* =========================================================
       11. Work 초기화
       ========================================================= */

    function initWork() {
        if (!workTabs.length) return;

        Object.keys(workPanels).forEach(function (category) {
            renderProjects(category);
        });

        switchCategory('visual');

        workTabs.forEach(function (button) {
            const category = button.dataset.category;
            const count = button.querySelector('sup');

            if (count && workData[category]) {
                count.textContent = String(
                    workData[category].length
                ).padStart(2, '0');
            }

            button.addEventListener('click', function () {
                switchCategory(category);
            });
        });

        if (!modal) return;

        const closeButtons = modal.querySelectorAll(
            '[data-modal-close], .modal-close'
        );

        closeButtons.forEach(function (button) {
            button.addEventListener('click', function (event) {
                if (
                    button.classList.contains('modal-overlay') &&
                    event.target !== button
                ) {
                    return;
                }

                event.preventDefault();
                closeProjectModal();
            });
        });

        const overlay = modal.querySelector('.modal-overlay');

        if (
            overlay &&
            !overlay.matches('[data-modal-close], .modal-close')
        ) {
            overlay.addEventListener('click', function (event) {
                if (event.target === overlay) {
                    closeProjectModal();
                }
            });
        }
    }

    /* =========================================================
       12. 질문 버튼 연결
       ========================================================= */

    document
        .querySelectorAll('.question-options button')
        .forEach(function (button) {
            button.addEventListener('click', function () {
                selectQuestion(button);
            });
        });

    /* =========================================================
       13. Work 기능 시작
       ========================================================= */

    initWork();

    /* =========================================================
       14. 상단 갤러리 → 모달 연결
       ========================================================= */

    const galleryButtons = document.querySelectorAll(
        '.hero-gallery [data-project]'
    );

    const galleryProjects = {
        v1: ['visual', 0],
        v2: ['visual', 1],
        b1: ['branding', 0],
        b2: ['branding', 1],
        b3: ['branding', 2]
    };

    galleryButtons.forEach(function (button) {
        const target = galleryProjects[button.dataset.project];

        if (!target) return;

        button.addEventListener('click', function () {
            openProjectModal(target[0], target[1]);
        });
    });

    /* =========================================================
       15. GSAP 스크롤 등장 효과
       ========================================================= */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
            const distance = window.innerWidth <= 800 ? 24 : 42;

            function reveal(trigger, targets, stagger) {
                if (!trigger || !targets.length) return;
                gsap.fromTo(targets, { y: distance, opacity: 0 }, {
                    y: 0,
                    opacity: 1,
                    duration: 1.05,
                    stagger: stagger || 0,
                    ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: trigger,
                        start: 'top 86%',
                        end: 'bottom top',
                        toggleActions: 'restart none restart none'
                    }
                });
            }

            document.querySelectorAll(
                '#process .process-heading, #work .work-heading, ' +
                '#about .about-heading, #contact .contact-title'
            ).forEach(function (el) { reveal(el, [el]); });

            const process = document.querySelector('#process .approach-grid');
            if (process) {
                if (window.innerWidth > 800) {
                    reveal(process, Array.from(process.children), 0.12);
                } else {
                    Array.from(process.children).forEach(function (el) { reveal(el, [el]); });
                }
            }

            document.querySelectorAll(
                '#about .about-profile, #about .about-fact, ' +
                '#contact .contact-conversation, #contact .social-links, ' +
                '#main .conversation, #main .hero-bottom, #work .work-tabs'
            ).forEach(function (el) { reveal(el, [el]); });

            // Animate the visible carousel contents without moving Swiper tracks.
            const work = document.querySelector('#work');
            function floatWorkCards() {
                const cards = work.querySelectorAll('.work-grid:not([hidden]) .work-card-button');
                gsap.killTweensOf(cards);
                gsap.fromTo(cards, { y: distance, opacity: 0 }, {
                    y: 0, opacity: 1, duration: 1.05,
                    stagger: 0.08, ease: 'power3.out', overwrite: 'auto'
                });
            }
            if (work) {
                ScrollTrigger.create({
                    trigger: work,
                    start: 'top 65%',
                    end: 'bottom top',
                    onEnter: floatWorkCards,
                    onEnterBack: floatWorkCards
                });
            }
        });
        window.addEventListener('load', function () { ScrollTrigger.refresh(); }, { once: true });
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
        }
    }

    /* =========================================================
       16. 히어로 제목 반복 등장
       ========================================================= */

    if (
        typeof gsap !== 'undefined' &&
        typeof ScrollTrigger !== 'undefined'
    ) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.matchMedia().add(
            '(prefers-reduced-motion: no-preference)',
            function () {
                const title = document.querySelector('#main h1');
                if (!title) return;

                gsap.fromTo(
                    title,
                    {
                        y: 16,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        ease: 'power2.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: title,
                            start: 'top 90%',
                            end: 'bottom top',
                            toggleActions: 'restart none restart none'
                        }
                    }
                );
            }
        );
    }

    /* =========================================================
       17. GNB 선택 메뉴 밑줄
       ========================================================= */

    const navLinks = document.querySelectorAll(
        'header nav a[href^="#"]'
    );

    function setActiveNav(target) {
        navLinks.forEach(function (link) {
            const active = link.getAttribute('href') === target;

            link.classList.toggle('active', active);

            if (active) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            setActiveNav(link.getAttribute('href'));
        });
    });

    function syncNavWithHash() {
        const target = window.location.hash || '#main';

        if (
            Array.from(navLinks).some(function (link) {
                return link.getAttribute('href') === target;
            })
        ) {
            setActiveNav(target);
        }
    }

    syncNavWithHash();
    window.addEventListener('hashchange', syncNavWithHash);

    /* =========================================================
       18. 학력 / 자격증 더보기
       ========================================================= */

    document
        .querySelectorAll('[data-about-disclosure]')
        .forEach(function (list) {
            const items = Array.from(list.children).filter(function (item) {
                return item.tagName === 'LI';
            });

            if (items.length <= 1) return;

            const label = list.dataset.aboutDisclosure;

            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'about-more-toggle';
            toggle.setAttribute('aria-controls', list.id);

            toggle.innerHTML =
                '<span class="about-more-label"></span>' +
                '<svg viewBox="0 0 24 24" width="18" height="18" ' +
                'aria-hidden="true" focusable="false">' +
                '<path d="m6 9 6 6 6-6" fill="none" ' +
                'stroke="currentColor" stroke-width="1.5" ' +
                'stroke-linecap="round" stroke-linejoin="round"/>' +
                '</svg>';

            list.insertAdjacentElement('afterend', toggle);

            function setExpanded(expanded) {
                items.slice(1).forEach(function (item) {
                    item.hidden = !expanded;
                });

                toggle.setAttribute(
                    'aria-expanded',
                    String(expanded)
                );

                toggle.setAttribute(
                    'aria-label',
                    label + (expanded ? ' 접기' : ' 더보기')
                );

                toggle.querySelector('.about-more-label').textContent =
                    expanded ? '접기' : '더보기';
            }

            setExpanded(false);

            toggle.addEventListener('click', function () {
                setExpanded(
                    toggle.getAttribute('aria-expanded') !== 'true'
                );

                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            });
        });

    /* =========================================================
       19. Hero 질문 Typed.js
       타이핑 → 삭제 → 무한 반복
       ========================================================= */

    const prompt = document.getElementById('prompt-text');

    if (
        prompt &&
        typeof Typed !== 'undefined' &&
        !reducedMotion.matches
    ) {
        const promptText = prompt.textContent.trim();

        const typingTarget = document.createElement('span');
        typingTarget.setAttribute('aria-hidden', 'true');

        prompt.setAttribute('aria-label', promptText);
        prompt.replaceChildren(typingTarget);

        try {
            new Typed(typingTarget, {
                strings: [promptText],

                typeSpeed: 40,      // 글씨 써지는 속도
                backSpeed: 25,      // 글씨 지워지는 속도

                startDelay: 500,    // 처음 시작 전 대기
                backDelay: 1800,    // 다 써진 뒤 지우기 전 대기

                showCursor: true,
                cursorChar: '|',

                loop: true,         // 계속 반복

                contentType: 'null'
            });
        } catch (error) {
            prompt.textContent = promptText;
        }
    }

});
