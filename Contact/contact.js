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

// Validación simple + estado de envío simulado
(function(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  const btn  = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');

  const setError = (name, msg)=>{
    const hint = form.querySelector(`[data-error="${name}"]`);
    if(hint) hint.textContent = msg || '';
  };
  const clearErrors = ()=>{
    ['name','email','topic','message'].forEach(n=>setError(n,''));
    if(status) status.textContent = '';
  };
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    clearErrors();

    const fd = new FormData(form);
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    const topic = (fd.get('topic')||'').toString().trim();
    const message = (fd.get('message')||'').toString().trim();

    let ok = true;
    if(!name){ setError('name','Escribe tu nombre.'); ok = false; }
    if(!email || !isEmail(email)){ setError('email','Ingresa un email válido.'); ok = false; }
    if(!topic){ setError('topic','Escribe el asunto.'); ok = false; }
    if(!message){ setError('message','Escribe tu mensaje.'); ok = false; }
    if(!ok) return;

    btn.classList.add('loading'); btn.disabled = true;
    if(status) status.textContent = 'Enviando...';

    // Simulación de envío (reemplaza con fetch real si quieres)
    await new Promise(r=>setTimeout(r, 1200));

    btn.classList.remove('loading'); btn.disabled = false;
    form.reset();
    if(status) status.textContent = '¡Gracias! Tu mensaje ha sido enviado.';
  });
})();
