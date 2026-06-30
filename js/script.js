// Galerie : Premier Tonnerre du 28 mai 2026
// Format : [filename, height/width] — ratio pré-calculé pour le masonry "shortest column first"
const GALERIE_PHOTOS = [
    ['_A7R3747.jpg', 1.499], ['_A7R3750.jpg', 1.500], ['_A7R3751.jpg', 0.667],
    ['_A7R3758.jpg', 0.667], ['_A7R3760.jpg', 1.500], ['_A7R3764.jpg', 0.667],
    ['_A7R3765.jpg', 0.667], ['_A7R3768.jpg', 1.499], ['_A7R3774.jpg', 1.499],
    ['_A7R3778.jpg', 0.667], ['_A7R3782.jpg', 1.499], ['_A7R3783.jpg', 0.667],
    ['_A7R3785.jpg', 1.499], ['_A7R3795.jpg', 1.499], ['_A7R3798.jpg', 0.667],
    ['_A7R3809.jpg', 0.667], ['_A7R3811.jpg', 1.500], ['_A7R3815.jpg', 0.667],
    ['_A7R3819.jpg', 0.667], ['_A7R3820.jpg', 0.667], ['_A7R3826.jpg', 0.667],
    ['_A7R3833.jpg', 0.666], ['_A7R3834.jpg', 0.667], ['_A7R3839.jpg', 0.667],
    ['_A7R3843.jpg', 1.499], ['_A7R3850.jpg', 1.499], ['_A7R3853.jpg', 0.667],
    ['_A7R3857.jpg', 1.500], ['_A7R3859.jpg', 0.666], ['_A7R3861.jpg', 1.499],
    ['_A7R3863.jpg', 0.666], ['_A7R3867.jpg', 1.499], ['_A7R3869.jpg', 1.499],
    ['_A7R3872.jpg', 0.667], ['_A7R3875.jpg', 0.666], ['_A7R3876.jpg', 0.666],
    ['_A7R3879.jpg', 0.667], ['_A7R3882.jpg', 0.667], ['_A7R3886.jpg', 0.666],
    ['_A7R3888.jpg', 1.500], ['_A7R3891.jpg', 0.666], ['_A7R3893.jpg', 0.667],
    ['_A7R3897.jpg', 0.667]
];
const GALERIE_DIR = 'assets/img/galerie/';

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('galerie-grid');
    const lightbox = document.getElementById('galerie-lightbox');
    if (!grid || !lightbox) return;

    const imgEl = document.getElementById('galerie-lightbox-img');
    const counter = document.getElementById('galerie-lightbox-counter');
    const btnClose = lightbox.querySelector('.galerie-lightbox-close');
    const btnPrev = lightbox.querySelector('.galerie-lightbox-prev');
    const btnNext = lightbox.querySelector('.galerie-lightbox-next');

    let currentIndex = 0;

    // Compat : extrait juste le filename quand on n'a pas besoin du ratio
    const photoFile = (p) => Array.isArray(p) ? p[0] : p;
    const photoRatio = (p) => Array.isArray(p) ? p[1] : 1.5;

    // Sélection des photos affichées :
    // - data-photo-count="N" sur #galerie-grid → N photos réparties uniformément (teaser home)
    // - Pas d'attribut → toutes les photos (page galerie dédiée)
    const limitAttr = parseInt(grid.dataset.photoCount, 10);
    let photos;
    if (limitAttr > 0 && limitAttr < GALERIE_PHOTOS.length) {
        const step = GALERIE_PHOTOS.length / limitAttr;
        photos = [];
        for (let i = 0; i < limitAttr; i++) {
            photos.push(GALERIE_PHOTOS[Math.floor(i * step)]);
        }
    } else {
        photos = GALERIE_PHOTOS;
    }

    // Détermine le nombre de colonnes selon viewport
    function getColCount() {
        const w = window.innerWidth;
        if (w <= 420) return 1;
        if (w <= 767) return 2;
        if (w <= 1199) return 3;
        return 4;
    }

    const includeVideo = grid.dataset.includeVideo === 'true';

    function createVideoItem() {
        const wrap = document.createElement('div');
        wrap.className = 'galerie-item galerie-video-item';
        wrap.setAttribute('aria-label', 'After movie Premier Tonnerre');
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.poster = 'assets/video/teaser-poster.jpg';
        const source = document.createElement('source');
        source.src = 'assets/video/teaser.mp4';
        source.type = 'video/mp4';
        video.appendChild(source);
        wrap.appendChild(video);
        const badge = document.createElement('span');
        badge.className = 'galerie-video-badge';
        badge.textContent = 'After movie';
        wrap.appendChild(badge);
        return wrap;
    }

    // Rendu masonry : sort par ratio desc, puis place chaque photo dans la colonne
    // la plus courte. Donne un équilibrage quasi-parfait des hauteurs de colonnes.
    function renderGrid() {
        grid.innerHTML = '';
        const cols = getColCount();
        const columns = [];
        const heights = new Array(cols).fill(0);
        for (let c = 0; c < cols; c++) {
            const col = document.createElement('div');
            col.className = 'galerie-col';
            columns.push(col);
            grid.appendChild(col);
        }
        // Indexes triés par ratio décroissant (portraits avant landscapes)
        const sortedIdx = photos.map((_, i) => i)
            .sort((a, b) => photoRatio(photos[b]) - photoRatio(photos[a]));
        sortedIdx.forEach((origIdx) => {
            const entry = photos[origIdx];
            const file = photoFile(entry);
            const ratio = photoRatio(entry);
            let shortest = 0;
            for (let c = 1; c < cols; c++) {
                if (heights[c] < heights[shortest]) shortest = c;
            }
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'galerie-item';
            btn.setAttribute('aria-label', `Photo ${origIdx + 1} sur ${photos.length}`);
            btn.dataset.index = origIdx;
            const img = document.createElement('img');
            img.src = GALERIE_DIR + file;
            img.alt = `Premier Tonnerre — 28 mai 2026 — photo ${origIdx + 1}`;
            img.loading = 'lazy';
            img.decoding = 'async';
            btn.appendChild(img);
            columns[shortest].appendChild(btn);
            heights[shortest] += ratio;
        });

        // Vidéo after movie : insérée en position 2 de la 2e colonne (visible en 2e ligne)
        if (includeVideo) {
            const videoItem = createVideoItem();
            const targetCol = columns[Math.min(1, cols - 1)];
            const insertAt = Math.min(1, targetCol.children.length);
            if (targetCol.children[insertAt]) {
                targetCol.insertBefore(videoItem, targetCol.children[insertAt]);
            } else {
                targetCol.appendChild(videoItem);
            }
        }
    }
    renderGrid();

    // Re-rendre si on change de breakpoint (rotation tablette / resize fenêtre)
    let lastCols = getColCount();
    window.addEventListener('resize', function() {
        const cols = getColCount();
        if (cols !== lastCols) {
            lastCols = cols;
            renderGrid();
        }
    });

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.hidden = false;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.hidden = true;
        document.body.style.overflow = '';
        imgEl.src = '';
    }

    function updateLightbox() {
        const file = photoFile(photos[currentIndex]);
        imgEl.src = GALERIE_DIR + file;
        imgEl.alt = `Premier Tonnerre — 28 mai 2026 — photo ${currentIndex + 1}`;
        counter.textContent = `${currentIndex + 1} / ${photos.length}`;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        updateLightbox();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % photos.length;
        updateLightbox();
    }

    grid.addEventListener('click', function(e) {
        const item = e.target.closest('.galerie-item');
        if (!item || item.classList.contains('galerie-video-item')) return;
        openLightbox(parseInt(item.dataset.index, 10));
    });

    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', showPrev);
    btnNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showPrev();
        else if (e.key === 'ArrowRight') showNext();
    });
});

// Modale HelloAsso (bouton flottant "Faire un don")
document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('openHaOverlay');
    const modal = document.getElementById('haWidgetModal');
    const closeBtn = document.getElementById('closeHaWidgetBtn');
    if (!openBtn || !modal || !closeBtn) return;

    const body = document.body;

    function openModal() {
        modal.hidden = false;
        modal.classList.add('is-open');
        body.style.overflow = 'hidden';
        body.style.overscrollBehaviorY = 'none';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.hidden = true;
        body.style.overflow = '';
        body.style.overscrollBehaviorY = '';
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Fermer en cliquant sur le backdrop (hors contenu)
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
});

// Scroll fluide : ancres (liens #) et boutons avec data-scroll-to
function smoothScrollTo(targetId) {
    var target = document.querySelector(targetId);
    if (!target) return;
    var start = window.pageYOffset;
    var targetTop = target.getBoundingClientRect().top + start;
    var targetHeight = target.offsetHeight;
    var viewportHeight = window.innerHeight;
    var end = targetTop - (viewportHeight / 2) + (targetHeight / 2);
    var maxScroll = document.documentElement.scrollHeight - viewportHeight;
    end = Math.max(0, Math.min(end, maxScroll));
    var duration = 700;
    var startTime = performance.now();
    function step(timestamp) {
        var progress = timestamp - startTime;
        var ease = progress >= duration ? 1 : 1 - Math.pow(1 - progress / duration, 3);
        window.scrollTo(0, start + (end - start) * ease);
        if (progress < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            smoothScrollTo(targetId);
        });
    });
    document.querySelectorAll('.button-wrapper[data-scroll-to]').forEach(function(wrapper) {
        wrapper.addEventListener('click', function(e) {
            var targetId = this.getAttribute('data-scroll-to');
            if (!targetId) return;
            e.preventDefault();
            smoothScrollTo(targetId);
        });
    });
});

// Animation des cards de valeurs au scroll
document.addEventListener('DOMContentLoaded', function() {
    const valeurSection = document.getElementById('valeur');
    const card1 = document.querySelector('.valeur-card-1');
    const card3 = document.querySelector('.valeur-card-3');

    if (!valeurSection || !card1 || !card3) return;

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajouter un petit délai pour l'effet de cascade
                setTimeout(() => {
                    card1.classList.add('animate');
                }, 400);
                
                setTimeout(() => {
                    card3.classList.add('animate');
                }, 400);
                
                // Ne plus observer après l'animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(valeurSection);
});

// Effet de parallaxe pour les éléments SVG de la section partenaires
document.addEventListener('DOMContentLoaded', function() {
    const partenairesSection = document.getElementById('partenaires');
    const decorativeSvgs = document.querySelectorAll('.decorative-svg');

    if (!partenairesSection || decorativeSvgs.length === 0) return;

    function updateParallax() {
        const rect = partenairesSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Vérifier si la section est visible
        if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            
            decorativeSvgs.forEach((svg, index) => {
                const speed = parseFloat(svg.getAttribute('data-speed')) || 0.5;
                const parallaxOffset = scrollProgress * 100 * speed;
                
                // Animation de flottement combinée avec parallaxe (plus léger)
                const time = Date.now() * 0.001;
                const floatOffset = Math.sin(time + index) * 8;
                const rotation = Math.sin(time * 0.5 + index) * 2;
                
                svg.style.transform = `translateY(${parallaxOffset + floatOffset}px) rotate(${rotation}deg)`;
            });
        }
    }
    
    // Animation continue de flottement
    function animateFloat() {
        updateParallax();
        requestAnimationFrame(animateFloat);
    }
    
    animateFloat();

    // Mettre à jour au scroll
    window.addEventListener('scroll', updateParallax);
    updateParallax(); // Initialisation
});

// ─────────────────────────────────────────────────────────────
// Configuration EmailJS
// 1. Créer un compte sur https://www.emailjs.com/ (connexion Google)
// 2. Ajouter un service "Gmail" relié à petittonnerreproduction@gmail.com → copier le Service ID
// 3. Créer un template avec les variables {{prenom}} {{nom}} {{email}} {{message}} → copier le Template ID
// 4. Récupérer la Public Key dans Account > General → la coller ci-dessous
// ─────────────────────────────────────────────────────────────
const EMAILJS_CONFIG = {
    publicKey: 'dGpc3mcK6MyBNAXvS',
    serviceId: 'service_ad80gv7',
    templateId: 'template_69udq4j'
};

// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    // Init EmailJS si SDK chargé et clé renseignée
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }

    // Gestion des labels flottants
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');

    inputs.forEach(input => {
        if (input.value) {
            input.classList.add('has-value');
        }
        input.addEventListener('focus', function() {
            this.classList.add('has-value');
        });
        input.addEventListener('blur', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const messageDiv = document.getElementById('form-message');

        function showMessage(text, type = 'error') {
            if (!messageDiv) return;
            messageDiv.textContent = text;
            messageDiv.className = `form-message ${type} show`;
            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, type === 'success' ? 5000 : 6000);
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = {
                prenom: (formData.get('prenom') || '').trim(),
                nom: (formData.get('nom') || '').trim(),
                email: (formData.get('email') || '').trim(),
                message: (formData.get('message') || '').trim()
            };

            if (!data.prenom || !data.nom || !data.email || !data.message) {
                showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            if (typeof emailjs === 'undefined') {
                showMessage('Service d\'envoi indisponible. Veuillez réessayer plus tard.', 'error');
                return;
            }

            if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY'
                || EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID'
                || EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID') {
                showMessage('Formulaire pas encore configuré. Contactez-nous via Instagram en attendant.', 'error');
                console.warn('[EmailJS] Configuration incomplète — remplir EMAILJS_CONFIG dans js/script.js');
                return;
            }

            const originalBtnLabel = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi…';
            }

            emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
                prenom: data.prenom,
                nom: data.nom,
                from_name: `${data.prenom} ${data.nom}`,
                email: data.email,
                reply_to: data.email,
                message: data.message
            })
            .then(() => {
                showMessage('Message envoyé. Nous vous répondrons rapidement.', 'success');
                contactForm.reset();
                inputs.forEach(input => input.classList.remove('has-value'));
            })
            .catch((error) => {
                console.error('[EmailJS] échec envoi :', error);
                showMessage('Une erreur est survenue. Veuillez réessayer dans un instant.', 'error');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnLabel;
                }
            });
        });
    }
});