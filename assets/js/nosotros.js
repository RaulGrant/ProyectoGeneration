
<<<<<<< HEAD:scripts/nosotros.js
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
=======
    init() {
      this.refresh();
      window.addEventListener('scroll', () => this.throttleScrollHandler());
      window.addEventListener('resize', () => this.refresh());
      // Trigger initial check
      setTimeout(() => this.handleScroll(), 100);
    }

    throttleScrollHandler() {
      if (this.throttleTimeout) {
        clearTimeout(this.throttleTimeout);
      }
      this.throttleTimeout = setTimeout(() => this.handleScroll(), 16);
    }

    refresh() {
      // (Re)detectar todos los elementos con data-aos
      this.animatedElements = Array.from(document.querySelectorAll('[data-aos]')).map(el => ({
        element: el,
        offset: this.getOffset(el),
        delay: parseInt(el.getAttribute('data-aos-delay'), 10) || 0,
        duration: parseInt(el.getAttribute('data-aos-duration'), 10) || 600,
        once: el.getAttribute('data-aos-once') === 'true',
        mirror: el.getAttribute('data-aos-mirror') !== 'false',
        easing: el.getAttribute('data-aos-easing') || 'ease-out',
        animationType: el.getAttribute('data-aos') || 'fade-up',
        isAnimated: false
      }));
    }

    getOffset(el) {
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        bottom: rect.bottom + window.pageYOffset,
        height: rect.height
      };
    }

    updateScrollDirection() {
      const currentY = window.pageYOffset;
      this.scrollSpeed = Math.abs(currentY - this.lastScrollY);
      this.scrollDirection = currentY > this.lastScrollY ? 'down' : 'up';
      this.lastScrollY = currentY;
    }

    animateElement(el, action, delay = 0) {
      const id = el.dataset.aosId || Math.random().toString(36).substr(2, 9);
      el.dataset.aosId = id;
      if (this.animationQueue.has(id)) {
        clearTimeout(this.animationQueue.get(id));
      }
      const run = () => {
        if (action === 'enter') {
          el.classList.remove('aos-exit');
          el.classList.add('aos-animate');
        } else {
          el.classList.remove('aos-animate');
          el.classList.add('aos-exit');
          setTimeout(() => el.classList.remove('aos-exit'), 600);
        }
      };
      if (delay > 0) {
        const tid = setTimeout(run, delay);
        this.animationQueue.set(id, tid);
      } else {
        run();
      }
    }

    handleScroll() {
      this.updateScrollDirection();
      const wTop = window.pageYOffset;
      const wBottom = wTop + window.innerHeight;

      this.animatedElements.forEach(item => {
        // actualizar dinámicamente el offset
        item.offset = this.getOffset(item.element);
        const { top, bottom, height } = item.offset;
        const enterThreshold = 0.15 * height;
        const exitThreshold = 0.15 * height;
        const isInView = (top + enterThreshold) <= wBottom && (bottom - exitThreshold) >= wTop;
        const isAnimated = item.element.classList.contains('aos-animate');

        if (isInView && !isAnimated) {
          this.animateElement(item.element, 'enter', item.delay);
          item.isAnimated = true;
        } else if (!isInView && isAnimated && !item.once && item.mirror) {
          this.animateElement(item.element, 'exit', 0);
          item.isAnimated = false;
        }

        // adaptar velocidad de transición según scrollSpeed
        const dur = this.scrollSpeed > 20 ? 300 : item.duration;
        item.element.style.transitionDuration = dur + 'ms';
        item.element.style.transitionTimingFunction = item.easing;
      });
    }

    refreshAnimations() {
      this.animatedElements.forEach(i => {
        i.element.classList.remove('aos-animate', 'aos-exit');
        i.isAnimated = false;
      });
      this.handleScroll();
    }

    disable() {
      this.animatedElements.forEach(i => {
        i.element.classList.add('aos-animate');
        i.element.classList.remove('aos-exit');
      });
    }

    enable() {
      this.refreshAnimations();
    }
  }

  function initializeAOS() {
    const aos = new AOS();

    if ('IntersectionObserver' in window) {
      const obsOptions = {
        rootMargin: '50px 0px -50px 0px',
        threshold: [0, 0.1, 0.5, 1]
      };
      const perfObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const el = entry.target;
          if (entry.intersectionRatio === 0) {
            el.style.willChange = 'auto';
          } else {
            el.style.willChange = 'transform, opacity';
          }
        });
      }, obsOptions);
      document.querySelectorAll('[data-aos]').forEach(el => perfObs.observe(el));
    }

    // reenlazar orientación
    window.addEventListener('orientationchange', () => {
      setTimeout(() => aos.refresh(), 500);
    });
  }

  
document.addEventListener('DOMContentLoaded', () => {
  initializeAOS();

  // Desplazamiento suave para anclas internas
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const tgt = document.querySelector(a.getAttribute('href'));
      if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
>>>>>>> 96716e1e6bca13e9146b852f7d4132bdefc8c763:assets/js/nosotros.js
    });
  });

<<<<<<< HEAD:scripts/nosotros.js
    // ===== EFECTO NAVBAR AL HACER SCROLL =====
    const navbar = document.querySelector('.navbar');
=======
  // Efecto de la barra de navegación al hacer scroll (solo clase; NO toca el menú)
  const navbar = document.querySelector('.navbarlanding');
  if (navbar) {
>>>>>>> 96716e1e6bca13e9146b852f7d4132bdefc8c763:assets/js/nosotros.js
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
  }

<<<<<<< HEAD:scripts/nosotros.js
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
    scrollToTopBtn.innerHTML = '⬆️';
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
=======
  // Efecto hover en tarjetas
  document.querySelectorAll('.para-quien-card, .team-member, .mision-card').forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-10px) scale(1.02)'; });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // Parallax sutil en el hero
  window.addEventListener('scroll', () => {
    const sc = window.pageYOffset * 0.2;
    document.querySelectorAll('.hero-title, .hero-description').forEach(el => {
      el.style.transform = `translateY(${sc}px)`;
    });
  });
});
>>>>>>> 96716e1e6bca13e9146b852f7d4132bdefc8c763:assets/js/nosotros.js
