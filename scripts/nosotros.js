// ===== FUNCIONALIDAD AOS AVANZADA (ANIMATE ON SCROLL) =====
  class AOS {
    constructor() {
      this.animatedElements = [];
      this.throttleTimeout = null;
      this.lastScrollY = window.pageYOffset;
      this.scrollDirection = 'down';
      this.scrollSpeed = 0;
      this.animationQueue = new Map();
      this.init();
    }

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

    // Smooth scroll para anclas internas
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const tgt = document.querySelector(a.getAttribute('href'));
        if (tgt) {
          tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Efecto navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });

    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');
    const overlay   = document.querySelector('.menu-overlay');
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
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });

    // Hover cards
    document.querySelectorAll('.para-quien-card, .team-member, .mision-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Efecto parallax sutil en hero
    window.addEventListener('scroll', () => {
      const sc = window.pageYOffset * 0.2;
      document.querySelectorAll('.hero-title, .hero-description').forEach(el => {
        el.style.transform = `translateY(${sc}px)`;
      });
    });
  });