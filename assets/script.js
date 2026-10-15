/* ============================================================
   ============================================================ */

/* ---- DONNÉES PROJETS ------------------------------------- */
const PROJECTS = [
       {
        title: 'LuxeCars',
        tag: 'Web - Frontend',
        img: './assets/image/projet/projet1.png',
        desc: 'Luxecars, une vitrine digitale spécialisée dans la commercialisation de voitures de luxe.',
        link: 'https://mjoel-neel.github.io/luxecars/',
        hasLink: true
    },
    {
        title: 'Life Of The Wild',
        tag: 'E-commerce · Design',
        img: './assets/image/projet/projet2.png',
        desc: 'Une page de type vitrine ou boutique de livres en ligne, avec une mise en page moderne présentant des ouvrages fictifs sur la nature et la vie sauvage.',
        link: 'https://mjoel-neel.github.io/cvbs/',
        hasLink: true
    },
    {
        title: 'CVIA',
        tag: 'IA · Pédagogie',
        img: './assets/image/projet/projet3.png',
        desc: 'Une page pédagogique qui explique simplement l\'intelligence artificielle : ses bases, ses applications et ses enjeux éthiques. Conçue pour être accessible à tous, sans prérequis technique.',
        link: 'https://mjoel-neel.github.io/cvia/',
        hasLink: true
    },
    {
        title: 'My Portfolio',
        tag: 'Web - Frontend',
        img: './assets/image/projet/projet4.png',
        desc: 'Portfolio – Version 1',
        link: '#',
        hasLink: false
    },
     {
        title: 'Le Jardin d\'Or',
        tag: 'Web - Frontend',
        img: './assets/image/projet/projet5.png',
        desc: `Le site Le Jardin d'Or est une application web responsive
         développée en HTML, CSS  et JavaScript, offrant
          une expérience utilisateur immersive pour un restaurant gastronomique.
           Il intègre un menu interactif, un formulaire de contact ,
            ainsi qu’une optimisation SEO et des performances
             adaptées à tous les supports.`,
        link: 'https://mjoel-neel.github.io/lejardindor/',
        hasLink: true
    },
         {
        title: 'MJ Portfolio',
        tag: 'Web - Frontend',
        img: './assets/image/projet/projet6.png',
        desc: 'Portfolio – Version 2',
        link: '#',
        hasLink: false
    },
    {
        title: 'todo-priority-app',
        tag: 'Web - Frontend',
        img: './assets/image/projet/projet7.png',
        desc: 'Todo App avec gestion de priorités.',
        link: 'https://todo-priority-app.vercel.app/',
        hasLink: true
    },
    {
        title: 'Bookroom',
        tag: 'Fullstack',
        img: './assets/image/projet/projet8.png',
        desc: `Développement d’une application e-commerce en architecture MVC
         avec catalogue dynamique, panier en session et authentification sécurisée. Création d’un back-office d’administration et mise en place de bonnes pratiques de sécurité (XSS, SQL, PRG).
          Tech : PHP 8, MySQL, JavaScript, HTML/CSS`,
        link: '#',
        hasLink: false
    },
    {
        title: 'Luxecars V2',
        tag: 'Web - Frontend',
        img: './assets/image/projet/projet9.png',
        desc: `Luxecars V2 est une vitrine digitale haut de gamme dédiée
         à la mise en valeur et à la commercialisation de voitures de luxe,
         offrant une expérience immersive et élégante pour les passionnés 
         comme pour les acheteurs exigeants.`,
        link: 'https://mjoel-neel.github.io/luxecarsV2/',
        hasLink: true
    }
];

/* ---- THEME TOGGLE ---------------------------------------- */
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

// Récupère le thème sauvegardé ou détecte la préférence système
const savedTheme = localStorage.getItem('mj-theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

root.dataset.theme = savedTheme;

themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('mj-theme', next);
});

/* ---- NAVIGATION MOBILE ----------------------------------- */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
const mobLinks   = document.querySelectorAll('.mob-link');

burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Ferme le menu au clic sur un lien
mobLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

/* ---- ACTIVE NAV LINK sur scroll -------------------------- */
const sections  = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function setActiveNav() {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY + 120 >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current ||
            (current === '' && link.getAttribute('href') === '#')) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

/* ---- SCROLL REVEAL --------------------------------------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Légère cascade pour les éléments groupés
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

// Ajoute un délai en cascade aux cartes groupées
document.querySelectorAll('.skills-grid .skill-card, .projects-grid .project-card, .veille-grid .veille-card').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    el.classList.add('reveal');
});

revealEls.forEach(el => revealObserver.observe(el));
// Re-observe les nouveaux éléments ajoutés dynamiquement
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- MODAL PROJETS --------------------------------------- */
const modalOverlay = document.getElementById('modal-overlay');
const modalImg     = document.getElementById('modal-img');
const modalTitle   = document.getElementById('modal-title');
const modalTag     = document.getElementById('modal-tag');
const modalDesc    = document.getElementById('modal-desc');
const modalLink    = document.getElementById('modal-link');
const modalClose   = document.querySelector('.modal-close');

function openModal(index) {
    const p = PROJECTS[index];
    if (!p) return;

    modalImg.src   = p.img;
    modalImg.alt   = p.title;
    modalTitle.textContent = p.title;
    modalTag.textContent   = p.tag;
    modalDesc.textContent  = p.desc;
    modalLink.href = p.link;
    modalLink.style.display = p.hasLink ? 'flex' : 'none';

    modalOverlay.setAttribute('aria-hidden', 'false');
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus trap basique
    modalClose.focus();
}

function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.project);
        openModal(idx);
    });
    // Accessibilité clavier
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(parseInt(card.dataset.project));
        }
    });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

/* ---- FORMULAIRE CONTACT ---------------------------------- */
const form        = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');
const feedback    = document.getElementById('form-feedback');

/** Valide un champ et retourne un message d'erreur ou '' */
function validateField(field) {
    const val = field.value.trim();
    const id  = field.id;

    if (field.required && !val) return 'Ce champ est requis.';

    if (id === 'mail' && val) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(val)) return 'Adresse email invalide.';
    }
    if (field.minLength && val.length < field.minLength) {
        return `Minimum ${field.minLength} caractères.`;
    }
    if (field.maxLength && val.length > field.maxLength) {
        return `Maximum ${field.maxLength} caractères.`;
    }
    return '';
}

/** Affiche ou efface l'erreur d'un champ */
function showFieldError(field, message) {
    const errEl = document.getElementById('err-' + field.id);
    if (errEl) errEl.textContent = message;
    if (message) {
        field.classList.add('error');
    } else {
        field.classList.remove('error');
    }
}

/** Valide l'ensemble du formulaire */
function validateForm() {
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;
    fields.forEach(field => {
        const msg = validateField(field);
        showFieldError(field, msg);
        if (msg) valid = false;
    });
    return valid;
}

// Validation en temps réel champ par champ
form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
        const msg = validateField(field);
        showFieldError(field, msg);
    });
    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            const msg = validateField(field);
            showFieldError(field, msg);
        }
    });
});

/** Envoi AJAX via fetch */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Vérification honeypot anti-spam
    const honeypot = document.getElementById('honeypot');
    if (honeypot && honeypot.value) {
        // Bot détecté — on simule le succès silencieusement
        showFeedback('success', '✓ Votre message a bien été envoyé !');
        return;
    }

    if (!validateForm()) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    try {
        const data = new FormData(form);

        const response = await fetch('send.php', {
            method: 'POST',
            body: data
        });

        const text = await response.text();

        if (response.ok && text.includes('success')) {
            showFeedback('success', '✓ Votre message a bien été envoyé ! Je vous répondrai sous 24h.');
            form.reset();
        } else {
            showFeedback('error-msg', '✗ Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.');
        }
    } catch (err) {
        showFeedback('error-msg', '✗ Impossible de joindre le serveur. Vérifiez votre connexion ou contactez-moi par email.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function showFeedback(type, message) {
    feedback.textContent = message;
    feedback.className   = 'form-feedback ' + type;
    feedback.style.display = 'block';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---- FOOTER : ANNÉE DYNAMIQUE ---------------------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
