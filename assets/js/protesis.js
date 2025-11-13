/*
    protesis.js

    Archivo principal para la gestión del catálogo y carrito de compras.

    Variables exportadas / globales:
    - todosLosProductos: Array — catálogo cargado desde `assets/data/protesis.json`.
    - productosFiltrados: Array — lista actual filtrada para renderizado.
    - carrito: Array — estado del carrito (persistido en localStorage `carritoPatitas`).

    Funciones públicas (expuestas en `window` al final del archivo):
    - agregarAlCarrito(idProducto): Añade un producto al carrito (usado por botones de añadir y por `pg-catalog.js`).
    - cambiarCantidad(idProducto, cambio): Incrementa/decrementa cantidad en el modal del carrito.
    - eliminarDelCarrito(idProducto): Elimina un artículo del carrito.
    - vaciarCarrito(): Vacía el carrito (UI: botón vaciar).
    - finalizarCompra(): Construye URL de WhatsApp y abre ventana para finalizar compra.
    - verCarrito(): Muestra el modal del carrito.
    - mostrarModalCarrito(), cerrarCarrito(): Control del modal.

    Nota: Este archivo contiene comentarios y documentación en español para facilitar mantenimiento.
*/
// ===== CATÁLOGO DE PRÓTESIS PAWSSIBLE =====
// Variables globales (comentarios en español)
let todosLosProductos = [];
let productosFiltrados = [];
// El carrito se persiste en localStorage bajo la clave 'carritoPatitas'
let carrito = JSON.parse(localStorage.getItem('carritoPatitas')) || [];
// Normalizar items cargados (asegurar propiedad `cantidad` numérica)
if (Array.isArray(carrito)) {
    carrito = carrito.map(it => ({
        ...it,
        cantidad: Number(it.cantidad) || 1
    }));
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosDesdeJSON();
    actualizarContadorCarrito();
    inicializarEventos();
});

// ===== CARGAR PRODUCTOS DESDE JSON =====
/**
 * cargarProductosDesdeJSON()
 * - Lee `assets/data/protesis.json` y adapta cada entrada al formato interno esperado.
 * - Actualiza las variables globales: `todosLosProductos` y `productosFiltrados`.
 * - Llama a `renderizarProtesis` y `actualizarContadorProductos`.
 * No recibe parámetros.
 */
async function cargarProductosDesdeJSON() {
    try {
        const response = await fetch('assets/data/protesis.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const productosJSON = await response.json();
        
        // Adaptar formato del JSON al formato esperado
        todosLosProductos = productosJSON.map(p => ({
            id: p.id,
            nombreProtesis: p.nombre,
            sku: p.sku,
            descripcion: p.descripcion,
            precio: p.precio,
            stock: p.stock,
            tipo: p.tipo,
            miembro: p.miembro,
            segmento: p.segmento,
            size: determinarTalla(p),
            imagenes: p.imagenes || []
        }));
        
        productosFiltrados = [...todosLosProductos];
        
        renderizarProtesis(productosFiltrados);
        actualizarContadorProductos(productosFiltrados.length);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarErrorCarga();
    }
}

// Determinar talla basado en el tipo de prótesis (función auxiliar)
/**
 * determinarTalla(producto)
 * @param {Object} producto - Objeto con propiedades que determinan la talla (miembro,tipo,segmento,configuracion).
 * @returns {String} - Clave de talla: 'small'|'medium'|'large'|'xlarge'|'all'.
 */
function determinarTalla(producto) {
    if (producto.miembro === 'cuatro-extremidades') return 'xlarge';
    if (producto.tipo === 'servicio') return 'all';
    if (producto.segmento === 'completa') return 'large';
    if (producto.configuracion === 'bilateral') return 'medium';
    return 'medium'; // Por defecto
}

// ===== MOSTRAR ERROR DE CARGA =====
/**
 * mostrarErrorCarga()
 * - Inserta en el DOM un mensaje visual cuando no se puede cargar el catálogo.
 */
function mostrarErrorCarga() {
    const grid = document.getElementById('protesisGrid');
    if (grid) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                <h2 style="color: #e74c3c; margin-bottom: 1rem; font-size: 2rem;">⚠️ Error al cargar productos</h2>
                <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">
                    No pudimos cargar el catálogo. Por favor, verifica la conexión e intenta de nuevo.
                </p>
                <button onclick="location.reload()" class="btn-add-cart" style="max-width: 300px; margin: 0 auto;">
                    🔄 Reintentar
                </button>
            </div>
        `;
    }
    
    const contador = document.getElementById('productsCount');
    if (contador) {
        contador.textContent = 'Error al cargar productos';
    }
}

// ===== RENDERIZAR PRÓTESIS =====
/**
 * renderizarProtesis(protesis)
 * @param {Array} protesis - Lista de objetos producto a renderizar en `#protesisGrid`.
 */
function renderizarProtesis(protesis) {
    const grid = document.getElementById('protesisGrid');
    
    if (!grid) return;
    
    if (protesis.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                <h2 style="color: #666; margin-bottom: 1rem; font-size: 2rem;">🔍 No se encontraron productos</h2>
                <p style="color: #999; font-size: 1.1rem;">
                    Intenta ajustar los filtros o la búsqueda
                </p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = protesis.map(p => crearCardProtesis(p)).join('');
}

// ===== CREAR CARD DE PRÓTESIS =====
/**
 * crearCardProtesis(protesis)
 * @param {Object} protesis - Producto con propiedades necesarias para crear la tarjeta.
 * @returns {String} HTML de la tarjeta.
 */
function crearCardProtesis(protesis) {
    const stockBadge = obtenerBadgeStock(protesis.stock);
    const imagen = protesis.imagenes && protesis.imagenes[0] 
        ? protesis.imagenes[0] 
        : 'assets/images/placeholder.png';
    
    const precioFormateado = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(protesis.precio);
    
    const deshabilitado = protesis.stock === 0 || protesis.stock === null;
    const tallaTexto = traducirSize(protesis.size);
    
    return `
    <article class="protesis-card" data-id="${protesis.id}">
        <div class="protesis-image-container">
            <img 
                src="${imagen}" 
                alt="${protesis.nombreProtesis}" 
                class="protesis-image"
                onerror="this.src='assets/images/placeholder.png'"
            >
            ${stockBadge}
        </div>
        
        <div class="protesis-info">
            <h3 class="protesis-name">${protesis.nombreProtesis}</h3>
            <p class="protesis-description">${protesis.descripcion}</p>
            
            <div class="protesis-details">
                <span class="protesis-price">
                    <i data-lucide="tag"></i> ${precioFormateado}
                </span>
                <span class="protesis-sku">
                    <i data-lucide="ruler"></i> Talla: ${tallaTexto}
                </span>
            </div>
            
            ${protesis.sku ? `
                <p class="protesis-sku">
                    <i data-lucide="barcode"></i> SKU: ${protesis.sku}
                </p>` : ''
            }
            
            <button 
                class="btn-add-cart" 
                onclick="agregarAlCarrito(${protesis.id})"
                ${deshabilitado ? 'disabled' : ''}
            >
                ${
                    deshabilitado 
                    ? `<i data-lucide="x-circle"></i> Sin Stock` 
                    : `<i data-lucide="shopping-cart"></i> Agregar al Carrito`
                }
            </button>
        </div>
    </article>
`;

}

// ===== OBTENER BADGE DE STOCK =====
/**
 * obtenerBadgeStock(stock)
 * @param {Number|null} stock - Cantidad disponible o null para servicios.
 * @returns {String} HTML con la etiqueta de stock.
 */
function obtenerBadgeStock(stock) {
    if (stock === null || stock === undefined) {
        return '<span class="badge-stock">Servicio</span>';
    } else if (stock === 0) {
        return '<span class="badge-stock no-stock">Agotado</span>';
    } else if (stock <= 5) {
        return `<span class="badge-stock low-stock">¡Últimos ${stock}!</span>`;
    } else {
        return `<span class="badge-stock">${stock} disponibles</span>`;
    }
}

// ===== TRADUCIR TALLAS =====
/**
 * traducirSize(size)
 * @param {String} size - Clave de talla (en inglés).
 * @returns {String} Texto traducido al español.
 */
function traducirSize(size) {
    const traducciones = {
        'small': 'Pequeña',
        'medium': 'Mediana',
        'large': 'Grande',
        'xlarge': 'Extra Grande',
        'all': 'Universal'
    };
    return traducciones[size] || 'Estándar';
}

// ===== GESTIÓN DEL CARRITO =====
/**
 * obtenerCarrito()
 * @returns {Array} - Referencia al array `carrito` en memoria.
 */
function obtenerCarrito() {
    return carrito;
}

/**
 * guardarCarrito()
 * - Persiste el array `carrito` en localStorage bajo la clave `carritoPatitas`.
 * - Llama a `actualizarContadorCarrito` para sincronizar UI.
 */
function guardarCarrito() {
    // Guardar en localStorage y actualizar contador (asegurar valores numéricos)
    localStorage.setItem('carritoPatitas', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

/**
 * actualizarContadorCarrito()
 * - Recalcula la suma de cantidades del carrito y actualiza el badge y el enlace del navbar.
 */
function actualizarContadorCarrito() {
    // Sumar cantidades robustamente (por si item.cantidad no está definido)
    const totalItems = carrito.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
    
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
    
    // Actualizar contador del navbar (si existe)
    const carritoLink = document.querySelector('.carrito-link');
if (carritoLink) {
    carritoLink.innerHTML = `<i data-lucide="shopping-cart"></i> Carrito (${totalItems})`;
    lucide.createIcons(); 
}

}

/**
 * agregarAlCarrito(idProducto)
 * @param {String|Number} idProducto - Identificador del producto a añadir.
 * - Si el producto no existe en `todosLosProductos`, intenta buscarlo en `pgGetCatalog`.
 * - Maneja verificación de stock y normaliza el objeto antes de añadirlo al carrito.
 */
function agregarAlCarrito(idProducto) {
    let producto = todosLosProductos.find(p => String(p.id) === String(idProducto));
    
    // Si no está en el catálogo original, busca en PG Catalog
    if (!producto && window.pgGetCatalog) {
        const pgList = window.pgGetCatalog();
        const pgProd = pgList.find(p => String(p.id) === String(idProducto));
        
        if (pgProd) {
            // Mapear formato PG a formato de carrito y catálogo original
            producto = {
                id: pgProd.id,
                nombreProtesis: pgProd.name || pgProd.nombreProtesis || '(Sin nombre)',
                precio: Number(pgProd.price || pgProd.precio || 0),
                cantidad: 1,
                imagen: pgProd.image || pgProd.imagen || 'assets/images/placeholder.png',
                imagenes: [pgProd.image || pgProd.imagen || 'assets/images/placeholder.png'],
                sku: pgProd.sku || '',
                descripcion: pgProd.description || pgProd.descripcion || '',
                stock: typeof pgProd.stock === 'number' ? pgProd.stock : (parseInt(pgProd.stock) || 0),
                size: pgProd.size || 'medium',
                tipo: pgProd.tipo || '',
                miembro: pgProd.miembro || '',
                segmento: pgProd.segmento || ''
            };
        }
    }
    if (!producto) {
        console.error('❌ Producto no encontrado con ID:', idProducto);
        mostrarMensaje('❌ Producto no encontrado', 'error');
        return;
    }
    
    if (producto.stock === 0 || producto.stock === null) {
        console.warn('⚠️ Producto sin stock');
        mostrarMensaje('❌ Producto no disponible', 'error');
        return;
    }
    // Verificar si ya existe en el carrito
    const itemExistente = carrito.find(item => String(item.id) === String(idProducto));
    if (itemExistente) {
        // Verificar stock antes de incrementar (usar stock del item o del producto)
        const stockDisponible = (typeof itemExistente.stock === 'number') ? itemExistente.stock : (producto ? producto.stock : 99);
        if ((Number(itemExistente.cantidad) || 0) < (stockDisponible || 99)) {
            itemExistente.cantidad = (Number(itemExistente.cantidad) || 0) + 1;
            mostrarMensaje(`✅ Cantidad actualizada: ${producto.nombreProtesis}`, 'success');
        } else {
            console.warn('⚠️ Stock máximo alcanzado');
            mostrarMensaje(`⚠️ Stock máximo alcanzado (${stockDisponible} unidades)`, 'warning');
            return;
        }
    } else {
        // Mapear un objeto seguro para el carrito, asegurando la propiedad `cantidad` y `imagen`
        const itemParaCarrito = {
            id: producto.id,
            nombreProtesis: producto.nombreProtesis || producto.nombre || '(Sin nombre)',
            precio: Number(producto.precio) || 0,
            cantidad: 1,
            imagen: producto.imagen || (producto.imagenes && producto.imagenes[0]) || 'assets/images/placeholder.png',
            imagenes: producto.imagenes || [producto.imagen || 'assets/images/placeholder.png'],
            sku: producto.sku || '',
            descripcion: producto.descripcion || '',
            stock: typeof producto.stock === 'number' ? producto.stock : (producto.stock ? Number(producto.stock) : undefined),
            size: producto.size || 'medium',
            tipo: producto.tipo || '',
            miembro: producto.miembro || '',
            segmento: producto.segmento || ''
        };

        carrito.push(itemParaCarrito);
        mostrarMensaje(`Agregado al carrito: ${itemParaCarrito.nombreProtesis}`, 'success');
    }
    guardarCarrito();
}

// ===== MODAL DEL CARRITO =====
function verCarrito() {
    mostrarModalCarrito();
}

/**
 * mostrarModalCarrito()
 * - Muestra el modal del carrito y renderiza los items con `crearItemCarrito`.
 */
function mostrarModalCarrito() {
    const modal = document.getElementById('modalCarrito');
    const carritoItems = document.getElementById('carritoItems');
    
    if (!modal || !carritoItems) return;
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: #999;">
                <p style="font-size: 3rem; margin-bottom: 1rem;"><i data-lucide="shopping-cart"></i></p>
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

/**
 * crearItemCarrito(item)
 * @param {Object} item - Item del carrito. Propiedades usadas: id, nombreProtesis, precio, cantidad, imagen, imagenes.
 * @returns {String} - HTML de cada fila del carrito dentro del modal.
 */
function crearItemCarrito(item) {
    // Calcular subtotales y formateos
    const cantidadItem = Number(item.cantidad) || 1;
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
    // Asegurar que mostramos alguna imagen aunque el objeto venga con diferente propiedad
    const imagenMostrada = item.imagen || (item.imagenes && item.imagenes[0]) || 'assets/images/placeholder.png';

        // Pasar el id como string escapado para que el atributo onclick no se rompa por comillas
    const idSeguro = String(item.id).replace(/'/g, "\\'");

    return `
        <div class="carrito-item">
            <img src="${imagenMostrada}" alt="${item.nombreProtesis}" class="carrito-item-image" onerror="this.src='assets/images/placeholder.png'">
            <div class="carrito-item-info">
                <h4 class="carrito-item-name">${item.nombreProtesis}</h4>
                <p style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">${precioUnitario} c/u</p>
                <p class="carrito-item-price">${subtotal}</p>
                <div class="carrito-item-quantity">
                    <button class="btn-quantity" onclick="cambiarCantidad('${idSeguro}', -1)">-</button>
                    <span style="font-weight: 700; min-width: 40px; text-align: center;">${cantidadItem}</span>
                    <button class="btn-quantity" onclick="cambiarCantidad('${idSeguro}', 1)">+</button>
                    <button class="btn-remove-item" onclick="eliminarDelCarrito('${idSeguro}')">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * cambiarCantidad(idProducto, cambio)
 * @param {String|Number} idProducto - Id del artículo en el carrito.
 * @param {Number} cambio - +1 o -1 para incrementar o decrementar la cantidad.
 */
function cambiarCantidad(idProducto, cambio) {
    // Buscar item en carrito (coerción a string para evitar problemas de tipo)
    const item = carrito.find(i => String(i.id) === String(idProducto));
    // Intentar encontrar el producto en el catálogo principal (puede no existir si vino de otro origen)
    const producto = todosLosProductos.find(p => String(p.id) === String(idProducto));

    if (!item) return; // Si no existe el item en el carrito, nada que hacer

    const nuevaCantidad = (Number(item.cantidad) || 0) + Number(cambio);

    if (nuevaCantidad <= 0) {
        // Si la nueva cantidad es 0 o menor, eliminar del carrito
        eliminarDelCarrito(idProducto);
        return;
    }

    // Determinar stock disponible: preferir stock del propio item, luego del catálogo, si no existe asumir ilimitado
    const stockDisponible = (typeof item.stock === 'number') ? item.stock : (producto ? producto.stock : Infinity);

    if (Number.isFinite(stockDisponible) && nuevaCantidad > stockDisponible) {
        mostrarMensaje(`⚠️ Stock máximo: ${stockDisponible} unidades`, 'warning');
        return;
    }

    item.cantidad = nuevaCantidad;
    guardarCarrito();
    mostrarModalCarrito();
}

/**
 * eliminarDelCarrito(idProducto)
 * @param {String|Number} idProducto - Id del artículo a eliminar del carrito.
 * - Actualiza almacenamiento y UI al finalizar.
 */
function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => String(item.id) !== String(idProducto));
    guardarCarrito();
    mostrarModalCarrito();
    mostrarMensaje('Producto eliminado del carrito', 'info');
}

/**
 * vaciarCarrito()
 * - Muestra una notificación de confirmación (Toastify). Si el usuario confirma, vacía el carrito.
 */
function vaciarCarrito() {
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
        fontWeight: "500",
      }
    }).showToast();
    return;
  }

  Toastify({
    text: "Haz clic aquí para confirmar que deseas vaciar el carrito",
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


/**
 * cerrarCarrito()
 * - Oculta el modal del carrito y restaura el scroll del body.
 */
function cerrarCarrito() {
    const modal = document.getElementById('modalCarrito');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * actualizarTotalCarrito()
 * - Recalcula y actualiza el total mostrado en el pie del modal.
 */
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

// ===== FINALIZAR COMPRA POR WHATSAPP =====
/**
 * finalizarCompra()
 * - Construye el mensaje para WhatsApp con el resumen del carrito y abre la URL.
 */
function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje('<i data-lucide="shopping-cart"></i> El carrito está vacío', 'warning');
        lucide.createIcons(); // Renderiza el ícono SVG
        return;
    }

    const mensaje = construirMensajeWhatsApp();
    const numeroWhatsApp = '525512345678'; // Cambia este número
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(urlWhatsApp, '_blank');
}

/**
 * construirMensajeWhatsApp()
 * - Recorre `carrito` y construye el texto formateado para enviar por WhatsApp.
 * @returns {String} - Mensaje con resumen y total.
 */
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

// ===== FILTROS Y BÚSQUEDA =====
/**
 * filtrarProductos()
 * - Lee los controles de búsqueda/filtro/orden y actualiza `productosFiltrados`.
 */
function filtrarProductos() {
    const searchTerm = document.getElementById('searchBox')?.value.toLowerCase() || '';
    const sizeFilter = document.getElementById('filterSize')?.value || 'all';
    const sortBy = document.getElementById('sortBy')?.value || 'name';
    
    // Filtrar por búsqueda
    productosFiltrados = todosLosProductos.filter(producto => {
        const coincideBusqueda = 
            producto.nombreProtesis.toLowerCase().includes(searchTerm) ||
            producto.descripcion.toLowerCase().includes(searchTerm) ||
            (producto.sku && producto.sku.toLowerCase().includes(searchTerm));
        
        const coincideTalla = sizeFilter === 'all' || producto.size === sizeFilter;
        
        return coincideBusqueda && coincideTalla;
    });
    
    // Ordenar
    switch(sortBy) {
        case 'price-asc':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'price-desc':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        case 'stock':
            productosFiltrados.sort((a, b) => (b.stock || 0) - (a.stock || 0));
            break;
        case 'name':
        default:
            productosFiltrados.sort((a, b) => a.nombreProtesis.localeCompare(b.nombreProtesis));
            break;
    }
    
    renderizarProtesis(productosFiltrados);
    actualizarContadorProductos(productosFiltrados.length);
}

/**
 * actualizarContadorProductos(cantidad)
 * @param {Number} cantidad - Número de productos mostrados.
 * - Actualiza el texto del contador `#productsCount`.
 */
function actualizarContadorProductos(cantidad) {
    const contador = document.getElementById('productsCount');
    if (contador) {
        contador.textContent = `Mostrando ${cantidad} producto${cantidad !== 1 ? 's' : ''}`;
    }
}
/**
 * inicializarEventos()
 * - Añade los listeners para los controles globales de la página (carrito flotante, cierre de modal, búsqueda, filtros, etc.).
 */
function inicializarEventos() {
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
    
    // Búsqueda
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', filtrarProductos);
    }
    
    // Filtros
    const filterSize = document.getElementById('filterSize');
    const sortBy = document.getElementById('sortBy');
    
    if (filterSize) {
        filterSize.addEventListener('change', filtrarProductos);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filtrarProductos);
    }
    
    // ========================================
    // TOGGLE DE FILTROS - SIN ROTACIONES
    // ========================================
    const filtersToggleBtn = document.getElementById('filtersToggleBtn');
    const filtersDropdown = document.getElementById('filtersDropdown');
    
    if (filtersToggleBtn && filtersDropdown) {
        filtersToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Solo toggle del dropdown, SIN modificar la flecha
            const estaActivo = filtersDropdown.classList.contains('active');
            
            if (estaActivo) {
                filtersDropdown.classList.remove('active');
                // NO modificar filtersArrow
            } else {
                filtersDropdown.classList.add('active');
                // NO modificar filtersArrow
            }
        });
    } else {
        console.error('❌ Error: No se encontraron los elementos del toggle de filtros');
        if (!filtersToggleBtn) console.error('   - Falta: #filtersToggleBtn');
        if (!filtersDropdown) console.error('   - Falta: #filtersDropdown');
    }
}


// ===== MOSTRAR MENSAJES =====
function mostrarMensaje(mensaje, tipo = 'success') {
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
        font-family: var(--font-sans);
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

// ===== EXPORTAR FUNCIONES GLOBALES =====
window.agregarAlCarrito = agregarAlCarrito;
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.finalizarCompra = finalizarCompra;
window.verCarrito = verCarrito;
window.mostrarModalCarrito = mostrarModalCarrito;
window.cerrarCarrito = cerrarCarrito;
window.filtrarProductos = filtrarProductos;
