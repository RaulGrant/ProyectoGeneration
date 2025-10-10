// ===== ANIMATE ON SCROLL (AOS) =====
class AOS {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.elements = Array.from(document.querySelectorAll('[data-aos]'));

        // Escucha scroll, resize y carga
        ['scroll', 'resize', 'load', 'DOMContentLoaded'].forEach(evt => {
            window.addEventListener(evt, () => this.checkElements());
        });

        // Trigger inicial
        this.checkElements();
    }

    checkElements() {
        const viewportBottom = window.scrollY + window.innerHeight;

        this.elements.forEach(el => {
            const elTop = el.getBoundingClientRect().top + window.scrollY;
            const elBottom = el.getBoundingClientRect().bottom + window.scrollY;
            const delay = parseInt(el.getAttribute('data-aos-delay')) || 0;
            const once = el.getAttribute('data-aos-once') !== 'false';

            const isVisible = elTop < viewportBottom && elBottom > window.scrollY;

            if (isVisible && !el.classList.contains('aos-animate')) {
                if (delay > 0) {
                    setTimeout(() => el.classList.add('aos-animate'), delay);
                } else {
                    el.classList.add('aos-animate');
                }
            } else if (!once && !isVisible) {
                el.classList.remove('aos-animate');
            }
        });
    }
}

// Inicializar
new AOS();
