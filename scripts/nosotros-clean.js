// ===== FUNCIONALIDADES DE LA PÁGINA SOBRE NOSOTROS =====
// Script limpio sin AOS personalizado - Usa AOS estándar desde CDN

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SMOOTH SCROLL PARA ANCLAS INTERNAS =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const tgt = document.querySelector(a.getAttribute('href'));
            if (tgt) {
                tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== EFECTO NAVBAR AL HACER SCROLL =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== MENÚ HAMBURGUESA =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    
    function toggleMenu() {
        const open = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active', open);
        overlay.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // ===== EFECTOS HOVER PARA TARJETAS =====
    document.querySelectorAll('.para-quien-card, .team-card, .mision-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===== EFECTO PARALLAX SUTIL EN HERO =====
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.2;
        const parallaxOffset = scrolled * parallaxSpeed;
        
        document.querySelectorAll('.hero-title, .hero-description').forEach(el => {
            el.style.transform = `translateY(${parallaxOffset}px)`;
        });
    });

    // ===== LAZY LOADING PARA IMÁGENES =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== SCROLL TO TOP BUTTON =====
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: var(--color-primary, #2263b4);
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== CONTADOR ANIMADO (si hay números) =====
    function animateCounters() {
        const counters = document.querySelectorAll('.counter-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
    
    // Activar contadores cuando entren en vista
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            counterObserver.observe(statsSection);
        }
    }

    console.log('✅ Página Sobre Nosotros - Funcionalidades cargadas correctamente');
    console.log('🎭 AOS estándar inicializado desde CDN');
    console.log('📱 Responsive y mobile-friendly');
});

// ===== FUNCIONES UTILITARIAS =====
window.pawssibleUtils = {
    // Función para refrescar AOS después de cambios dinámicos
    refreshAnimations: function() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    },
    
    // Función para desactivar/activar animaciones
    toggleAnimations: function(enable = true) {
        if (typeof AOS !== 'undefined') {
            if (enable) {
                AOS.init();
            } else {
                document.querySelectorAll('[data-aos]').forEach(el => {
                    el.classList.remove('aos-animate');
                });
            }
        }
    }
};