/*
  navbar.js

  Componente que inyecta el navbar en todas las páginas de forma dinámica.
  - Carga automáticamente `assets/css/navbar.css` si no está presente.
  - Inserta el HTML del navbar al inicio del `body` y habilita el menú hamburguesa.
  Funciones principales:
  - loadCSS(): carga la hoja de estilos si falta.
  - render(): crea e inserta el HTML del navbar.
  - initHamburger(): configura los listeners del menú móvil y overlay.
  - setActivePage(): marca el enlace activo según el nombre del archivo.
*/
// ===== NAVBAR COMPONENT CON CSS AUTO-CARGADO Y LOGIN PERSONALIZADO =====
class NavbarComponent {
  constructor() {
    this.loadCSS();
    this.init();
  }

  /**
   * loadCSS()
   * - Comprueba si `navbar.css` ya se ha cargado y, si no, la inserta en el <head>.
   */
  loadCSS() {
    if (document.querySelector('link[href*="navbar.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/navbar.css';
    document.head.appendChild(link);
  }

  init() {
    this.render();
    this.initHamburger();
    this.setActivePage();
  }

  /**
   * render()
   * - Construye el HTML del navbar y lo inserta en el DOM.
   * - Detecta si hay una sesión de usuario en sessionStorage/localStorage
   *   y muestra el nombre en el enlace de login si aplica.
   */
  render() {
    // Obtener usuario logueado de sessionStorage o localStorage
    const session = JSON.parse(sessionStorage.getItem('session') || 'null');
    const persistent = JSON.parse(localStorage.getItem('session') || 'null');
    const user = session || persistent;
    const usernameDisplay = user ? `Hola, ${user.name}` : 'Login';

    // Crear el HTML del navbar
    const navbarHTML = `
      <nav class="navbarlanding">
        <div class="container">
          <div class="nav-content">
            <a href="index.html" class="logo">
              <img src="assets/images/logo.webp" alt="Logo Pawssible" class="logo-img">
              <span class="logo-text">PAWSSIBLE</span>
            </a>

            <button class="hamburger" aria-label="Menú">
              <span></span>
              <span></span>
              <span></span>
            </button>

            <ul class="nav-links">
              <li><a href="index.html" class="nav-link" data-page="index">Inicio</a></li>
              <li><a href="sobre-nosotros.html" class="nav-link" data-page="sobre-nosotros">Sobre Nosotros</a></li>
              <li><a href="nuestras-protesis.html" class="nav-link" data-page="nuestras-protesis">Catálogo</a></li>
              <li><a href="contact.html" class="nav-link" data-page="contact">Contacto</a></li>
              <li><a href="login.html" class="nav-link" data-page="login" id="loginLink">${usernameDisplay}</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="menu-overlay"></div>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  }

  initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    const links = document.querySelectorAll('.nav-link');

    if (!hamburger || !navLinks || !overlay) return;

    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
    };

    const closeMenu = () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  setActivePage() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const page = link.getAttribute('data-page');
      if (page === currentPage) link.classList.add('active');
    });
  }
}

// Inicializar navbar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NavbarComponent());
} else {
  new NavbarComponent();
}
