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

       image: 목록 썸네일
       detailImages: 모달 상세 이미지
       ========================================================= */

    const workData = {
        visual: [
            {
                title: '청년창업지원사업 안내포스터',
                category: 'Poster',
                description: '청년의 시작을 그리다.',
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
                layout: 'portrait',
                image: 'images/공기업취업특강포스터1.jpg',
                detailImages: [
                    'images/romaine-poster.jpg'
                ]
            },
            {
                title: '연세대 3단 리플렛',
                category: 'leaflet',
                description: '힘내라 우리 후배들!',
                layout: 'wide',
                image: 'images/연세대2단리플렛1.jpg',
                detailImages: [
                    'images/visual-06.jpg'
                ]
            },
            {
                title: '스타벅스 3단 리플렛',
                category: 'leaflet',
                description: '스타벅스와 함께 특별한 순간을.',
                layout: 'wide',
                image: 'images/스타벅스3단리플렛1.jpg',
                detailImages: [
                    'images/visual-06.jpg'
                ]
            },
            {
                title: '민생회복소비쿠폰 카드뉴스',
                category: 'Card news',
                description: '일상에 닿는 정책의 언어.',
                layout: 'portrait',
                image: 'images/민생회복소비쿠폰1.jpg',
                detailImages: [
                    'images/visual-04.jpg'
                ]
            },
            {
                title: '기업 명함 디자인',
                category: 'Business card',
                description: '작은 면적에 담긴 서로 다른 아이덴티티.',
                layout: 'wide',
                image: 'images/기업명함제작1.png',
                detailImages: [
                    'images/americano-poster.jpg'
                ]
            },
            {
                title: 'CHERIE 히어로 배너',
                category: 'Online banner',
                description: 'Color that speaks.',
                layout: 'wide',
                image: 'images/CHERIE 가상브랜드히어로배너1.jpg',
                detailImages: [
                    'images/cherie-banner.jpg'
                ]
            },

        ],

    branding: [
            {
                title: '버거클럽',
                category: 'Branding',
                description: 'MZ세대를 위한 버거 브랜드',
                layout: 'wide',
                image: 'images/버거클럽썸네일.png',
                detailImages: [
                    'images/burgerclub-cover.jpg'
                ]
            },
            {
                title: 'fold',
                category: 'Branding',
                description: '겹겹이 쌓이는 일상의 따뜻함과 소중함을 담은 베이커리 브랜드',
                layout: 'wide',
                image: 'images/폴드썸네일.png',
                detailImages: [
                    'images/ddamyoemyo-cover.jpg'
                ]
            },
        ],

        motion: [
            {
                title: 'G-MARKET 2D 30s 모션그래픽',
                category: 'Motion',
                description: '타이포그래피 기반 모션그래픽',
                layout: 'wide',
                image: 'images/지마켓썸네일.png',
                detailImages: [
                    'images/motion-01.jpg'
                ]
            },
            {
                title: '한국수목원정원관리원 공모전 생성형 AI 활용 (숏폼 부문)',
                category: 'Video',
                description: '움직임을 활용한 영상 콘텐츠',
                layout: 'wide',
                image: 'images/한수정썸네일.png',
                detailImages: [
                    'images/motion-02.jpg'
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
            'modal-description': project.description,
            'modal-type': project.category,
            'modal-type-2': project.category
        };

        Object.keys(fields).forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.textContent = fields[id];
        });

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

        initSwiper();

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

    function closeProjectModal() {
        if (
            !modal ||
            !modal.classList.contains('is-open') ||
            modalClosing
        ) {
            return;
        }

        modalClosing = true;

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