// Menú hamburguesa + overlay (igual a la plantilla)
(function(){
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  const overlay   = document.querySelector('.menu-overlay');

  if(!hamburger || !navLinks || !overlay) return;

  const toggle = ()=>{
    const active = !hamburger.classList.contains('active');
    hamburger.classList.toggle('active', active);
    navLinks.classList.toggle('active', active);
    overlay.classList.toggle('active', active);
    document.body.style.overflow = active ? 'hidden' : '';
  };
  const close = ()=>{
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggle);
  overlay.addEventListener('click', close);
  document.querySelectorAll('.nav-link, .nav-cta').forEach(a => a.addEventListener('click', close));
  window.addEventListener('resize', ()=>{ if(window.innerWidth>820) close(); });
})();

// Reveal on scroll (AOS-lite)
(function(){
  const items = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    items.forEach(el=>io.observe(el));
  }else{
    items.forEach(el=>el.classList.add('is-visible'));
  }
})();

// Inicializar EmailJS
(function(){
  // Inicializar EmailJS con tu Public Key
  emailjs.init("Z3Q_Tub1bAMljQLWd"); // Reemplaza con tu Public Key real
})();

// Validación de formulario + envío con EmailJS
(function(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  
  const clearErrors = ()=>{
    document.getElementById('nombreError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('asuntoError').textContent = '';
    document.getElementById('mensajeError').textContent = '';
  };
  
  const setError = (elementId, message)=>{
    const errorElement = document.getElementById(elementId);
    if(errorElement) errorElement.textContent = message;
  };
  
  const isEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    clearErrors();

    const formData = new FormData(form);
    const nombre = formData.get('nombre')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const telefono = formData.get('telefono')?.toString().trim() || '';
    const asunto = formData.get('asunto')?.toString().trim() || '';
    const mensaje = formData.get('mensaje')?.toString().trim() || '';

    let isValid = true;

    // Validaciones
    if (!nombre) {
      setError('nombreError', 'El nombre es obligatorio');
      isValid = false;
    }

    if (!email) {
      setError('emailError', 'El email es obligatorio');
      isValid = false;
    } else if (!isEmail(email)) {
      setError('emailError', 'Ingresa un email válido');
      isValid = false;
    }

    if (!asunto) {
      setError('asuntoError', 'Selecciona un asunto');
      isValid = false;
    }

    if (!mensaje) {
      setError('mensajeError', 'El mensaje es obligatorio');
      isValid = false;
    }

    if (!isValid) return;

    // Cambiar estado del botón
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');
    
    btn.disabled = true;
    btn.classList.add('loading');
    btnText.textContent = 'Enviando...';

    try {
      // Configurar parámetros para EmailJS
      const templateParams = {
        from_name: nombre,
        from_email: email,
        phone: telefono || 'No proporcionado',
        subject: asunto,
        message: mensaje,
        to_email: 'vqrgashernandezrauldejesus@gmail.com',
         current_date: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };


        // 1. Enviar auto-respuesta al cliente
      const autoReplyResponse = await emailjs.send(
        'service_9z269i2',     // Tu Service ID
        'template_g9e4cmp',    // Template de auto-respuesta
        templateParams
      );

      // 2. Enviar notificación interna a ti
      const internalResponse = await emailjs.send(
        'service_9z269i2',     // El mismo Service ID
        'template_b28pyxi',      // Reemplaza con el ID de tu template interno
        templateParams
      );


      console.log('Auto-respuesta enviada:', autoReplyResponse);
      console.log('Notificación interna enviada:', internalResponse);
      
      // Éxito
      form.reset();
      btnText.textContent = '¡Enviado!';
      
      // Mostrar mensaje de éxito
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML = `
        <div style="background: #4CAF50; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin: 0 0 10px 0;">¡Mensaje enviado correctamente!</h3>
          <p style="margin: 0;">Gracias por contactarnos. Te responderemos pronto.</p>
        </div>
      `;
      form.parentNode.insertBefore(successMessage, form);
      
      // Remover mensaje después de 5 segundos
      setTimeout(() => {
        successMessage.remove();
        btnText.textContent = 'Enviar mensaje';
      }, 5000);

    } catch (error) {
      console.error('Error al enviar email:', error);
      
      // Error
      btnText.textContent = 'Error al enviar';
      
      // Mostrar mensaje de error
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.innerHTML = `
        <div style="background: #f44336; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin: 0 0 10px 0;">Error al enviar el mensaje</h3>
          <p style="margin: 0;">Por favor, inténtalo de nuevo o contáctanos directamente.</p>
        </div>
      `;
      form.parentNode.insertBefore(errorMessage, form);
      
      // Remover mensaje después de 5 segundos
      setTimeout(() => {
        errorMessage.remove();
        btnText.textContent = 'Enviar mensaje';
      }, 5000);
    } finally {
      // Restaurar estado del botón
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  });
})();