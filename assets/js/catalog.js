// catalog.js
// Sistema de catálogo con carrito funcional integrado

// Variables globales
let catalogoProductos = [];
let carrito = JSON.parse(localStorage.getItem('carritoPatitas')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('product-list');
  if (!listEl) return;

  // Inicializar eventos
  inicializarEventosCarrito();
  actualizarContadorCarrito();

  /**
   * Renderiza las tarjetas de productos en el DOM.
   * @param {Array} items Lista de objetos producto.
   */
  function render(items) {
    catalogoProductos = items;
    listEl.innerHTML = '';
    
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';
      
      // Imagen
      const media = document.createElement('img');
      media.src = item.imagenes && item.imagenes[0] ? item.imagenes[0] : 'assets/images/placeholder.png';
      media.alt = item.nombre || '';
      media.className = 'product-image';
      media.onerror = function() { this.src = 'assets/images/placeholder.png'; };
      card.appendChild(media);
      
      // Contenedor de info
      const info = document.createElement('div');
      info.className = 'product-info';
      
      const title = document.createElement('h3');
      title.textContent = item.nombre || '';
      info.appendChild(title);
      
      const desc = document.createElement('p');
      desc.textContent = item.descripcion || '';
      info.appendChild(desc);
      
      if (item.precio !== null && item.precio !== undefined) {
        const price = document.createElement('div');
        price.className = 'product-price';
        price.textContent = `$${Number(item.precio).toFixed(2)}`;
        info.appendChild(price);
      } else {
        const price = document.createElement('div');
        price.className = 'product-price';
        price.textContent = 'Servicio bajo cita';
        info.appendChild(price);
      }
      
      const btn = document.createElement('button');
      lucide.createIcons();
      btn.className = 'product-btn';
      btn.innerHTML = '<i data-lucide="shopping-cart" style="stroke: white"></i> Agregar al Carrito';
      btn.addEventListener('click', () => {
        agregarAlCarritoIndex(item);
      });
      info.appendChild(btn);
      card.appendChild(info);
      listEl.appendChild(card);
    });

    // Agregar botón "Ver todos los productos" después de las cards
    agregarBotonVerTodos(listEl);
  }

  /**
   * Agrega el botón "Ver todos los productos" al final del grid
   */
  function agregarBotonVerTodos(container) {
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
      grid-column: 1 / -1;
      display: flex;
      justify-content: center;
      margin-top: 3rem;
      margin-bottom: 2rem;
    `;
    
    const btn = document.createElement('a');
    btn.href = 'nuestras-protesis.html';
    btn.className = 'btn-ver-todos';
    btn.innerHTML = `
      <span class="btn-ver-todos-icon"><i data-lucide="paw-print" color="#ffffff"></i></span>
      <span class="btn-ver-todos-text">Ver Todos Nuestros Productos</span>
      <span class="btn-ver-todos-arrow">→</span>
    `;
    
    btnContainer.appendChild(btn);
    container.appendChild(btnContainer);
  }

  // Intenta primero cargar el JSON desde el servidor
  fetch('data/protesis.json', { cache: 'no-store' })
    .then(res => res.ok ? res.json() : Promise.reject(new Error('Error HTTP')))
    .then(data => {
      render(data);
    })
    .catch(() => {
      // Si falla, usa el JSON incrustado
      const embed = document.getElementById('catalog-embed');
      if (embed) {
        try {
          const data = JSON.parse(embed.textContent.trim());
          render(data);
        } catch (e) {
          console.error('No se pudo parsear catálogo embebido', e);
          listEl.innerHTML = '<p>No se pudo cargar el catálogo.</p>';
        }
      } else {
        listEl.innerHTML = '<p>No se pudo cargar el catálogo.</p>';
      }
    });
});

// ===== FUNCIONES DE CARRITO =====

function agregarAlCarritoIndex(producto) {
  if (!producto || producto.stock === 0) {
    mostrarNotificacion('❌ Producto no disponible', 'error');
    return;
  }

  // Verificar si ya existe en el carrito
  const itemExistente = carrito.find(item => item.id === producto.id);
  
  if (itemExistente) {
    // Verificar stock antes de incrementar
    if (producto.stock && itemExistente.cantidad < producto.stock) {
      itemExistente.cantidad++;
      mostrarNotificacion(`✅ Cantidad actualizada: ${producto.nombre}`, 'success');
    } else {
      mostrarNotificacion(`⚠️ Stock máximo alcanzado`, 'warning');
      return;
    }
  } else {
    // Agregar nuevo item
    carrito.push({
      id: producto.id,
      nombreProtesis: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: (producto.imagenes && producto.imagenes[0]) || 'assets/images/placeholder.png',
      sku: producto.sku || ''
    });
    mostrarNotificacion(`Agregado al carrito: ${producto.nombre}`, 'success');
  }
  
  guardarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carritoPatitas', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  
  // Actualizar badge del carrito flotante
  const badge = document.getElementById('carritoBadge');
  if (badge) {
    badge.textContent = totalItems;
    
    // Animación del badge
    badge.style.transform = 'scale(1.3)';
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
    }, 300);
  }
}

function inicializarEventosCarrito() {
  // Botón del carrito flotante
  const btnCarritoFloat = document.getElementById('btnCarritoFloat');
  if (btnCarritoFloat) {
    btnCarritoFloat.addEventListener('click', mostrarModalCarrito);
  }
  
  // Botón cerrar carrito
  const btnCerrarCarrito = document.getElementById('btnCerrarCarrito');
  if (btnCerrarCarrito) {
    btnCerrarCarrito.addEventListener('click', cerrarCarrito);
  }
  
  // Cerrar modal al hacer clic fuera
  const modal = document.getElementById('modalCarrito');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarCarrito();
      }
    });
  }
}

function mostrarModalCarrito() {
  const modal = document.getElementById('modalCarrito');
  const carritoItems = document.getElementById('carritoItems');
  
  if (!modal || !carritoItems) return;
  
  if (carrito.length === 0) {
    carritoItems.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: #999;">
        <p style="font-size: 3rem; margin-bottom: 1rem;"></p>
        <p style="font-size: 1.2rem;">Tu carrito está vacío</p>
      </div>
    `;
  } else {
    carritoItems.innerHTML = carrito.map(item => crearItemCarrito(item)).join('');
  }
  
  actualizarTotalCarrito();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function crearItemCarrito(item) {
  const subtotal = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(item.precio * item.cantidad);
  
  const precioUnitario = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(item.precio);
  
  return `
    <div class="carrito-item">
      <img src="${item.imagen}" alt="${item.nombreProtesis}" class="carrito-item-image" onerror="this.src='assets/images/placeholder.png'">
      <div class="carrito-item-info">
        <h4 class="carrito-item-name">${item.nombreProtesis}</h4>
        <p style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">${precioUnitario} c/u</p>
        <p class="carrito-item-price">${subtotal}</p>
        <div class="carrito-item-quantity">
          <button class="btn-quantity" onclick="cambiarCantidadIndex(${item.id}, -1)">-</button>
          <span style="font-weight: 700; min-width: 40px; text-align: center;">${item.cantidad}</span>
          <button class="btn-quantity" onclick="cambiarCantidadIndex(${item.id}, 1)">+</button>
          <button class="btn-remove-item" onclick="eliminarDelCarritoIndex(${item.id})">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `;
}

function cambiarCantidadIndex(idProducto, cambio) {
  const item = carrito.find(i => i.id === idProducto);
  const producto = catalogoProductos.find(p => p.id === idProducto);
  
  if (!item) return;
  
  const nuevaCantidad = item.cantidad + cambio;
  
  if (nuevaCantidad <= 0) {
    eliminarDelCarritoIndex(idProducto);
    return;
  }
  
  if (producto && producto.stock && nuevaCantidad > producto.stock) {
    mostrarNotificacion(`⚠️ Stock máximo: ${producto.stock} unidades`, 'warning');
    return;
  }
  
  item.cantidad = nuevaCantidad;
  guardarCarrito();
  mostrarModalCarrito();
}

function eliminarDelCarritoIndex(idProducto) {
  carrito = carrito.filter(item => item.id !== idProducto);
  guardarCarrito();
  mostrarModalCarrito();
  mostrarNotificacion('🗑️ Producto eliminado del carrito', 'info');
}

function vaciarCarritoIndex() {
  if (carrito.length === 0) {
    Toastify({
      text: "El carrito ya está vacío",
      duration: 2000,
      gravity: "top",
      position: "center",
      style: {
        background: "#2263b4",
        color: "#fff",
        borderRadius: "10px",
      }
    }).showToast();
    return;
  }

  Toastify({
    text: "Click aquí para confirmar que deseas vaciar el carrito",
    duration: 3000,
    gravity: "top",
    position: "center",
    close: true,
    stopOnFocus: true,
    style: {
      background: '#e74c3c',
      color: "#fff",
      borderRadius: "10px",
      fontWeight: "500",
      cursor: "pointer"
    },
    onClick: function() {
      carrito = [];
      guardarCarrito();
      mostrarModalCarrito();

      Toastify({
        text: "Carrito vaciado correctamente",
        duration: 2500,
        gravity: "bottom",
        position: "center",
        style: {
          background: "#25D366",
          color: "#fff",
          borderRadius: "10px",
          fontWeight: "500"
        }
      }).showToast();
    }
  }).showToast();
}



function cerrarCarrito() {
  const modal = document.getElementById('modalCarrito');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function actualizarTotalCarrito() {
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalFormateado = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(total);
  
  const totalElement = document.getElementById('totalCarrito');
  if (totalElement) {
    totalElement.textContent = totalFormateado;
  }
}

function finalizarCompraIndex() {
  if (carrito.length === 0) {
    mostrarNotificacion(
      '<i data-lucide="shopping-cart" style="stroke:#2263b4;width:18px;height:18px;vertical-align:middle;margin-right:6px;"></i> El carrito está vacío',
      'warning'
    );
    lucide.createIcons(); // 🔥 Importante para renderizar el icono SVG
    return;
  }
  
  const mensaje = construirMensajeWhatsApp();
  const numeroWhatsApp = '525512345678'; // Cambia este número
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  
  window.open(urlWhatsApp, '_blank');
}

function construirMensajeWhatsApp() {
  let mensaje = '🐾 *PEDIDO PAWSSIBLE* 🐾\n\n';
  
  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    mensaje += `${index + 1}. *${item.nombreProtesis}*\n`;
    if (item.sku) mensaje += `   SKU: ${item.sku}\n`;
    mensaje += `   Cantidad: ${item.cantidad}\n`;
    mensaje += `   Subtotal: $${subtotal.toFixed(2)}\n\n`;
  });
  
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  mensaje += `💰 *TOTAL: $${total.toFixed(2)} MXN*\n\n`;
  mensaje += '¿Podrían confirmar la disponibilidad y el proceso de compra? ¡Gracias! 🙏';
  
  return mensaje;
}

function mostrarNotificacion(mensaje, tipo = 'success') {
  const estilos = {
    'success': '#25D366',
    'error': '#e74c3c',
    'warning': '#f39c12',
    'info': '#3498db'
  };
  
  const notif = document.createElement('div');
  notif.className = 'notificacion-toast';
  notif.textContent = mensaje;
  notif.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${estilos[tipo] || estilos.success};
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 10000;
    transition: transform 0.3s ease;
    font-family: var(--font-body);
  `;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);
  
  setTimeout(() => {
    notif.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Exportar funciones globales
window.cambiarCantidadIndex = cambiarCantidadIndex;
window.eliminarDelCarritoIndex = eliminarDelCarritoIndex;
window.vaciarCarritoIndex = vaciarCarritoIndex;
window.finalizarCompraIndex = finalizarCompraIndex;