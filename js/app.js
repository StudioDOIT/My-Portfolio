document.addEventListener('DOMContentLoaded', async function () {
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

    /* Works content is edited in Pages CMS (_data/works/*.json).
       GitHub Pages builds data/works.json during its existing Jekyll deployment. */
    const workData = { visual: [], web: [], branding: [], motion: [] };
    let worksLoadFailed = false;
    try {
        const response = await fetch(new URL('./data/works.json', document.baseURI), {
            cache: 'no-cache'
        });
        if (!response.ok) throw new Error('Works HTTP ' + response.status);
        const works = await response.json();
        if (!Array.isArray(works)) throw new Error('Invalid Works collection');
        works.filter(function (work) {
            return work.published === true && work.featured === true &&
                Object.prototype.hasOwnProperty.call(workData, work.workGroup);
        }).sort(function (a, b) {
            return a.order - b.order || a.id.localeCompare(b.id);
        }).forEach(function (work) {
            workData[work.workGroup].push(work);
        });
    } catch (error) {
        worksLoadFailed = true;
        console.error('작품 목록을 불러오지 못했습니다.', error);
    }

    // CMS text is rendered as text, including quotes and markup characters.
    function escapeWorkHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (character) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
        });
    }

    // 상세 페이지도 Pages CMS에서 관리하는 같은 데이터를 사용합니다.
    if (document.body.dataset.page === 'branding-detail') {
        document.dispatchEvent(new CustomEvent('branding:ready', {
            detail: workData.branding
        }));
        return;
    }

    // 유튜브 영상은 모달 대신 새 탭에서 재생합니다.
    function youtubeWatchUrl(project) {
        const id = project && project.youtubeId;
        return /^[A-Za-z0-9_-]{11}$/.test(id || '')
            ? 'https://www.youtube.com/watch?v=' + id : '';
    }


    /* =========================================================
       04. Work 요소
       ========================================================= */

    const workTabs = document.querySelectorAll('.work-tabs button');

    const workPanels = {
        visual: document.getElementById('panel-visual'),
        web: document.getElementById('panel-web'),
        branding: document.getElementById('panel-branding'),
        motion: document.getElementById('panel-motion')
    };

    const modal = document.getElementById('project-modal');
    let currentSwiper = null;

    /* =========================================================
       05. Work 카드 생성 / 데이터 순서 유지
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

        if (!projects.length) {
            panel.replaceChildren();
            const empty = document.createElement('p');
            empty.className = 'work-empty';
            empty.textContent = worksLoadFailed
                ? '작품 목록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.'
                : '등록된 작업이 없습니다.';
            panel.appendChild(empty);
            return;
        }

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

        // CMS 노출 순서로 정렬된 데이터를 그대로 표시합니다.

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
                    aria-label="${escapeWorkHtml(project.title)} 프로젝트 보기"
                >
                    <div class="work-card-image">
                        <img
                            src="${escapeWorkHtml(project.image)}"
                            alt="${escapeWorkHtml(project.title)}"
                            loading="lazy"
                        >
                    </div>
                    <div class="work-card-info">
                        <span class="work-card-category">
                            ${escapeWorkHtml(project.category)}
                        </span>
                        <h3>${escapeWorkHtml(project.title)}</h3>
                        <p>${escapeWorkHtml(project.description)}</p>
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

        // 빈 카테고리는 Swiper를 만들지 않습니다.
        if (!(workData[category] || []).length) return;

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

            button.addEventListener('click', function (event) {
                const swiper = workSwipers[card.dataset.category];

                if (swiper && !swiper.allowClick) {
                    event.preventDefault();
                    return;
                }

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

        if (!project) return;
        if (!modal || modalClosing) return;

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
        modal.classList.toggle('modal--branding', category === 'branding');
        modal.classList.toggle('modal--visual', category === 'visual');
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
            const video = document.createElement(hasVideo && youtubeId ? 'div' : 'video');
            video.id = 'modal-video';
            video.controls = true;
            video.playsInline = true;
            video.preload = 'metadata';
            previousVideo.replaceWith(video);
            const errorNote = document.getElementById('modal-video-error');
            if (errorNote) errorNote.hidden = true;
            if (hasVideo && youtubeId) {
                // 영상 소개는 모달에서 확인하고, 재생은 유튜브 새 탭에서 합니다.
                video.style.cssText = 'display:block;width:100%;';
                const url = youtubeWatchUrl(project);
                const thumbnailLink = document.createElement('a');
                thumbnailLink.href = url;
                thumbnailLink.target = '_blank';
                thumbnailLink.rel = 'noopener noreferrer';
                thumbnailLink.setAttribute('aria-label', project.title + ' — 유튜브에서 영상 보기 (새 탭)');
                thumbnailLink.style.cssText = 'position:relative;display:block;width:100%;overflow:hidden;border-radius:12px;background:#111;text-decoration:none;';
                const thumbnail = document.createElement('img');
                thumbnail.src = project.image;
                thumbnail.alt = project.title + ' 영상 썸네일';
                thumbnail.style.cssText = 'display:block;width:100%;height:auto;';
                const playIcon = document.createElement('span');
                playIcon.textContent = '▶';
                playIcon.setAttribute('aria-hidden', 'true');
                playIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:grid;place-items:center;width:68px;height:68px;padding-left:4px;box-sizing:border-box;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;font-size:26px;pointer-events:none;';
                thumbnailLink.append(thumbnail, playIcon);
                video.append(thumbnailLink);
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

            img.addEventListener('load', function () {
                img.classList.toggle('visual-landscape',
                    category === 'visual' && img.naturalWidth > img.naturalHeight);
                if (currentSwiper && !currentSwiper.destroyed) {
                    currentSwiper.updateAutoHeight(0);
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
            autoHeight: true, // 현재 이미지 높이에 맞춰 영역 조절
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

        const totalProjects = Object.values(workData).reduce(function (total, projects) {
            return total + projects.length;
        }, 0);
        document.querySelectorAll('[data-work-total]').forEach(function (count) {
            count.textContent = String(totalProjects).padStart(2, '0');
        });

        Object.keys(workPanels).forEach(function (category) {
            renderProjects(category);
        });

        const requestedCategory = new URLSearchParams(window.location.search).get('category');
        switchCategory(Object.prototype.hasOwnProperty.call(workPanels, requestedCategory)
            ? requestedCategory : 'visual');

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
                '#work .work-heading, ' +
                '#about .about-heading, #contact .contact-title'
            ).forEach(function (el) { reveal(el, [el]); });

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
