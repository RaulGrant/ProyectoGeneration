  //  ANIMATE ON SCROLL
        class AOS {
            constructor() {
                this.animatedElements = [];
                this.throttleTimeout;
                this.init();
            }

            init() {
                this.refresh();
                window.addEventListener('scroll', () => this.throttleScrollHandler());
                window.addEventListener('resize', () => this.throttleScrollHandler());
                // Trigger initial check after a small delay
                setTimeout(() => this.handleScroll(), 100);
            }

            throttleScrollHandler() {
                if (this.throttleTimeout) {
                    clearTimeout(this.throttleTimeout);
                }
                this.throttleTimeout = setTimeout(() => this.handleScroll(), 60);
            }

            refresh() {
                // Modificado para que solo considere elementos con data-aos si no están dentro de herolanding
                this.animatedElements = Array.from(document.querySelectorAll('section:not(.herolanding) [data-aos], .herolanding [data-aos]')).map(element => ({
                    element: element,
                    offset: this.getOffset(element),
                    delay: parseInt(element.getAttribute('data-aos-delay')) || 0,
                    once: element.getAttribute('data-aos-once') !== 'false'
                }));
            }

            getOffset(element) {
                const rect = element.getBoundingClientRect();
                return {
                    top: rect.top + window.pageYOffset,
                    bottom: rect.bottom + window.pageYOffset
                };
            }

            handleScroll() {
                const windowTop = window.pageYOffset;
                const windowBottom = windowTop + window.innerHeight;
                
                this.animatedElements.forEach(item => {
                    const { element, offset, delay, once } = item;
                    
                    // Calculate trigger point (when 80% of element is visible)
                    const triggerPoint = offset.top + (element.offsetHeight * 0.2);
                    
                    if (triggerPoint <= windowBottom && !element.classList.contains('aos-animate')) {
                        // Apply delay if specified
                        if (delay > 0) {
                            setTimeout(() => {
                                if (!element.classList.contains('aos-animate')) {
                                    element.classList.add('aos-animate');
                                }
                            }, delay);
                        } else {
                            element.classList.add('aos-animate');
                        }
                    } else if (!once && offset.bottom < windowTop) {
                        // Reset animation if element is above viewport (unless once is true)
                        element.classList.remove('aos-animate');
                    }
                });
            }
        }

        // Initialize AOS
        document.addEventListener('DOMContentLoaded', function() {
            new AOS();
        });

        // Smooth scroll para navegación
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbarlanding'); // Corregido a .navbarlanding
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Animaciones adicionales para elementos interactivos
        document.addEventListener('DOMContentLoaded', function() {
            // Efecto hover mejorado para tarjetas
            const cards = document.querySelectorAll('.feature-card, .product-card, .testimonial-card'); // Ajustado para las tarjetas existentes
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transition = 'transform 0.3s ease-out'; // Añadido para smooth hover
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

      
        });