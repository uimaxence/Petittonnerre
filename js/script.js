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

// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    // Gestion des labels flottants
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    
    inputs.forEach(input => {
        // Vérifier si le champ a déjà du contenu au chargement
        if (input.value) {
            input.classList.add('has-value');
        }
        
        // Ajouter/retirer la classe au focus/blur
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
        
        // Ajouter/retirer la classe pendant la saisie
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                prenom: formData.get('prenom'),
                nom: formData.get('nom'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            const messageDiv = document.getElementById('form-message');
            
            // Fonction pour afficher un message
            function showMessage(text, type = 'error') {
                if (messageDiv) {
                    messageDiv.textContent = text;
                    messageDiv.className = `form-message ${type} show`;
                    
                    // Masquer après 5 secondes pour les erreurs, 4 secondes pour le succès
                    setTimeout(() => {
                        messageDiv.classList.remove('show');
                    }, type === 'success' ? 4000 : 5000);
                }
            }
            
            // Validation
            if (!data.prenom || !data.nom || !data.email || !data.message) {
                showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Envoi par mailto vers petittonnerreproduction@gmail.com
            const subject = encodeURIComponent('Contact Petit Tonnerre Production');
            const body = encodeURIComponent(
                'Prénom : ' + data.prenom + '\n' +
                'Nom : ' + data.nom + '\n' +
                'Email : ' + data.email + '\n\n' +
                'Message :\n' + data.message
            );
            const mailtoLink = 'mailto:petittonnerreproduction@gmail.com?subject=' + subject + '&body=' + body;
            window.location.href = mailtoLink;
            
            showMessage('Votre client mail va s\'ouvrir. Envoyez le message pour nous contacter.', 'success');
            this.reset();
            
            // Retirer la classe has-value après reset
            inputs.forEach(input => {
                input.classList.remove('has-value');
            });
        });
    }
});