// ===== NAVBAR COMPONENT CON CSS AUTO-CARGADO =====

class NavbarComponent {
  constructor() {
    this.loadCSS();
    this.init();
  }

  // Cargar el CSS del navbar automáticamente
  loadCSS() {
    // Verificar si el CSS ya está cargado
    if (document.querySelector('link[href*="navbar.css"]')) {
      return; // Ya existe, no duplicar
    }

    // Crear el elemento link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/navbar.css';
    
    // Insertarlo en el <head>
    document.head.appendChild(link);
  }

  init() {
    // Renderizar el navbar automáticamente al cargar la página
    this.render();
    // Inicializar funcionalidad del menú hamburguesa
    this.initHamburger();
    // Marcar página activa
    this.setActivePage();
  }

  render() {
    // Crear el HTML del navbar
    const navbarHTML = `
      <nav class="navbarlanding">
        <div class="container">
          <div class="nav-content">
            <!-- Logo -->
            <a href="index.html" class="logo">
              <img src="assets/images/logo.webp" alt="Logo Pawssible" class="logo-img">
              <span class="logo-text">PAWSSIBLE</span>
            </a>
            
            <!-- Menú hamburguesa (móvil) -->
            <button class="hamburger" aria-label="Menú">
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            <!-- Enlaces de navegación -->
            <ul class="nav-links">
              <li><a href="index.html" class="nav-link" data-page="index">Inicio</a></li>
              <li><a href="sobre-nosotros.html" class="nav-link" data-page="sobre-nosotros">Sobre Nosotros</a></li>
              <li><a href="nuestras-protesis.html" class="nav-link" data-page="nuestras-protesis">Catálogo</a></li>
              <li><a href="contact.html" class="nav-link" data-page="contact">Contacto</a></li>
            </ul>
          </div>
        </div>
      </nav>
      
      <!-- Overlay para menú móvil -->
      <div class="menu-overlay"></div>
    `;

    // Insertar el navbar al inicio del body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  }

  initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    const links = document.querySelectorAll('.nav-link');

    if (!hamburger || !navLinks || !overlay) return;

    // Toggle del menú
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
    };

    // Cerrar menú
    const closeMenu = () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Event listeners
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Cerrar al hacer clic en un enlace
    links.forEach(link => link.addEventListener('click', closeMenu));

    // Cerrar al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  setActivePage() {
    // Obtener el nombre de la página actual
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    
    // Marcar como activo el enlace correspondiente
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const page = link.getAttribute('data-page');
      if (page === currentPage) {
        link.classList.add('active');
      }
    });
  }
}

// Inicializar navbar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NavbarComponent());
} else {
  new NavbarComponent();
}
