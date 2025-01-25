/**
 * Gestion principale du site
 * =======================
 * Ce fichier contient toutes les fonctionnalités JavaScript du site, 
 * organisées par sections fonctionnelles.
 */

document.addEventListener('DOMContentLoaded', function () {
    try {
        /**
         * Initialisation des animations
         * ---------------------------
         * Configuration et démarrage de la bibliothèque AOS
         */
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                disable: 'mobile'
            });
        } else {
            console.error('AOS not loaded');
        }

        /**
         * Gestion du curseur personnalisé
         * -----------------------------
         * Création et animation du curseur orange personnalisé
         */
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        // Animation fluide du curseur
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Gestion des interactions avec les éléments
        const interactiveElements = document.querySelectorAll(
            'button, a, input, textarea, .service-card, .team-card'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });

        // Vérification des éléments critiques
        const criticalElements = {
            hero: document.querySelector('.hero'),
            nav: document.querySelector('nav'),
            serviceCards: document.querySelectorAll('.service-card'),
            teamCards: document.querySelectorAll('.team-card'),
            form: document.getElementById('contact-form')
        };

        // Log des éléments manquants
        Object.entries(criticalElements).forEach(([key, element]) => {
            if (!element || (element instanceof NodeList && element.length === 0)) {
                console.error(`Critical element missing: ${key}`);
            }
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Form handling
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                // Le formulaire sera géré par FormSubmit
                // On ajoute juste une animation de chargement
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Envoi en cours...';

                // Rétablir le texte original après soumission
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }

        // Gestion améliorée du formulaire de contact
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Envoi en cours...';

                try {
                    const formData = new FormData(this);
                    const response = await fetch(this.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Réinitialiser le formulaire
                        this.reset();

                        // Afficher la notification de succès
                        showNotification('Message envoyé avec succès ! Nous vous répondrons rapidement.');

                        // Réinitialiser le texte du bouton
                        submitBtn.textContent = originalBtnText;
                    } else {
                        throw new Error('Erreur lors de l\'envoi');
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
                    submitBtn.textContent = originalBtnText;
                }
            });
        }

        // Navbar animation
        window.addEventListener('scroll', function () {
            const nav = document.querySelector('nav');
            if (window.scrollY > 100) {
                nav.style.backgroundColor = 'rgba(255,255,255,0.95)';
                nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                nav.style.backgroundColor = 'white';
                nav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }
        });

        // Service cards animation
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Ajout d'effet parallaxe sur le hero
        window.addEventListener('scroll', function () {
            const hero = document.querySelector('.hero');
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });

        // Animation des cartes au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card').forEach(card => {
            card.style.opacity = "0";
            card.style.transform = "translateY(50px)";
            card.style.transition = "all 0.6s ease-out";
            observer.observe(card);
        });

        // Effet de particules sur le hero
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = Math.random() * 3 + 2 + 's';
            document.querySelector('.hero').appendChild(particle);

            setTimeout(() => particle.remove(), 5000);
        };

        setInterval(createParticle, 300);

        // Theme switcher
        const themeSwitch = document.querySelector('.theme-switch');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        // Check for saved user preference
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
            themeSwitch.textContent = currentTheme === 'dark' ? '☀️ Mode Clair' : '🌙 Mode Sombre';
        }

        themeSwitch.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeSwitch.textContent = newTheme === 'dark' ? '☀️ Mode Clair' : '🌙 Mode Sombre';
        });

        // FAQ Accordion
        document.querySelectorAll('.faq-item').forEach(item => {
            item.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        });

        // Modal handling
        function openModal(plan) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Réserver votre programme ${plan}</h2>
                    <form id="booking-form">
                        <input type="text" placeholder="Nom complet" required>
                        <input type="email" placeholder="Email" required>
                        <input type="tel" placeholder="Téléphone" required>
                        <select required>
                            <option value="">Choisir un créneau</option>
                            <option>Lundi - Matin</option>
                            <option>Mardi - Après-midi</option>
                            <option>Mercredi - Soirée</option>
                            <option>Jeudi - Matin</option>
                            <option>Vendredi - Après-midi</option>
                        </select>
                        <button type="submit" class="cta-btn">Confirmer la réservation</button>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            const close = modal.querySelector('.close');
            close.onclick = () => modal.remove();

            window.onclick = (e) => {
                if (e.target === modal) modal.remove();
            }

            const form = modal.querySelector('form');
            form.onsubmit = (e) => {
                e.preventDefault();
                // Simulation d'envoi
                const btn = form.querySelector('button');
                btn.textContent = 'Envoi en cours...';
                setTimeout(() => {
                    modal.remove();
                    showNotification('Réservation confirmée ! Nous vous contacterons rapidement.');
                }, 1500);
            };
        }

        // Notification system
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;

            // Supprimer les anciennes notifications
            document.querySelectorAll('.notification').forEach(notif => notif.remove());

            document.body.appendChild(notification);

            // Afficher avec animation
            setTimeout(() => notification.classList.add('show'), 100);

            // Cacher et supprimer après 5 secondes
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }

        // Dynamic calendar
        const calendar = {
            currentMonth: new Date(),
            init() {
                // ... Implémentation du calendrier ...
            }
        };

        // Stats counter
        function startCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                element.textContent = Math.round(current);
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                }
            }, 16);
        }

        // Team cards animation
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Smooth animation for LinkedIn buttons
        document.querySelectorAll('.linkedin-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        // Supprimer toutes ces anciennes fonctions de curseur
        /*
        function createSimpleTrail() {
            let lastX = 0;
            let lastY = 0;
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            // ...reste du code de la fonction
        }
        */

        /*
        function createCursorTrail() {
            const numDots = 12;
            const dots = [];
            // ...reste du code de la fonction
        }
        */

        /*
        function createCursorEffect() {
            const trails = [];
            const numTrails = 10;
            // ...reste du code de la fonction
        }
        */

        /*
        function createMouseTrail() {
            const trails = [];
            const numTrails = 20;
            // ...reste du code de la fonction
        }
        */

    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Ajout du gestionnaire de menu mobile
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.menu');

    if (mobileMenuToggle && menu) {
        mobileMenuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Fermer le menu au clic sur un lien
        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
});

// Fonction de récupération sécurisée des éléments
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.error(`Element not found: ${selector}`);
        return null;
    }
    return element;
}

document.addEventListener('DOMContentLoaded', function () {
    // Debounce function pour optimiser les événements de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimisation des event listeners de scroll
    const scrollHandler = debounce(() => {
        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 100) {
                nav.style.backgroundColor = 'rgba(255,255,255,0.95)';
                nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                nav.style.backgroundColor = 'white';
                nav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }
        }
    }, 16); // 60fps

    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Optimisation des animations avec requestAnimationFrame
    const animateElements = () => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.service-card, .team-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        });
    };

    // Intersection Observer pour lazy loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Appliquer le lazy loading aux images
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));

    // Gestion optimisée du menu mobile
    const mobileMenu = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.menu');

    if (mobileMenu && menu) {
        mobileMenu.addEventListener('click', () => {
            requestAnimationFrame(() => {
                menu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        });
    }

    // Cache DOM queries
    const criticalElements = {
        nav: document.querySelector('nav'),
        hero: document.querySelector('.hero'),
        serviceCards: document.querySelectorAll('.service-card'),
        form: document.getElementById('contact-form')
    };

    // Gestion des erreurs
    window.addEventListener('error', function (e) {
        console.error('Page error:', e.message);
        return false;
    }, { passive: true });

    // Cleanup function
    return () => {
        window.removeEventListener('scroll', scrollHandler);
        observer.disconnect();
    };
});

// Menu mobile
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const menu = document.querySelector('.menu');

if (mobileMenuToggle && menu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Gestion du scroll sur mobile
document.addEventListener('scroll', debounce(() => {
    if (menu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}, 100));

// Désactiver le défilement quand le menu est ouvert
document.body.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('menu-open')) {
        e.preventDefault();
    }
}, { passive: false });

