/*
 * Archivo: assets/js/scriptLanding.js
 * Propósito: Scripts generales de la landing (carruseles, navegación, utilidades y AOS ligero).
 * Autor: Equipo ProyectoGeneration
 * Fecha: 2025-11-13
 * Descripción: Contiene la implementación de animaciones al hacer scroll, control
 *              de carruseles en el inicio, utilidades para footer y manejo de elementos
 *              interactivos de la landing page. Solo se añade un comentario de cabecera;
 *              no se modifica la lógica existente.
 */
// ===== ANIMACIONES AL HACER SCROLL (AOS) =====
/**
 * AOS ligero: detecta elementos con `data-aos` y aplica la clase `aos-animate`.
 * Métodos principales:
 * - constructor(): crea la instancia y llama a `init()`.
 * - init(): registra listeners y realiza el primer chequeo.
 * - checkElements(): verifica visibilidad y aplica/remueve clases según atributos.
 */
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

        // Comprobación inicial
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
