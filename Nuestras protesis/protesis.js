// Datos iniciales de prótesis con el formato solicitado
const protesisIniciales = [
    {
        id: 1,
        nombreProtesis: "Prótesis delantera",
        descripcion: "Prótesis ligera y ajustable para perros medianos",
        precio: 2500.00,
        stock: 10,
        size: "medium",
        imagenes: [
            "img/protesis_canina1.jpg",
            "img/protesis_canina2.jpg"
        ]
    },
    {
        id: 2,
        nombreProtesis: "Prótesis trasera premium",
        descripcion: "Diseño ergonómico con amortiguación especial para patas traseras",
        precio: 3200.00,
        stock: 8,
        size: "large",
        imagenes: [
            "img/protesis_trasera1.jpg",
            "img/protesis_trasera2.jpg"
        ]
    },
    {
        id: 3,
        nombreProtesis: "Prótesis ligera XS",
        descripcion: "Perfecta para razas pequeñas, ultra ligera y cómoda",
        precio: 1800.00,
        stock: 15,
        size: "small",
        imagenes: [
            "img/protesis_xs1.jpg",
            "img/protesis_xs2.jpg"
        ]
    },
    {
        id: 4,
        nombreProtesis: "Prótesis deportiva pro",
        descripcion: "Diseñada para perros activos, con mayor flexibilidad y resistencia",
        precio: 4500.00,
        stock: 5,
        size: "large",
        imagenes: [
            "img/protesis_deportiva1.jpg",
            "img/protesis_deportiva2.jpg"
        ]
    },
    {
        id: 5,
        nombreProtesis: "Prótesis parcial ajustable",
        descripcion: "Sistema de ajuste personalizado para amputaciones parciales",
        precio: 2800.00,
        stock: 12,
        size: "medium",
        imagenes: [
            "img/protesis_parcial1.jpg",
            "img/protesis_parcial2.jpg"
        ]
    },
    {
        id: 6,
        nombreProtesis: "Prótesis senior confort",
        descripcion: "Diseño especial para perros mayores con acolchado extra",
        precio: 3000.00,
        stock: 7,
        size: "medium",
        imagenes: [
            "img/protesis_senior1.jpg",
            "img/protesis_senior2.jpg"
        ]
    },
    {
        id: 7,
        nombreProtesis: "Prótesis impermeable",
        descripcion: "Resistente al agua, ideal para perros que disfrutan nadar",
        precio: 3800.00,
        stock: 6,
        size: "large",
        imagenes: [
            "img/protesis_impermeable1.jpg",
            "img/protesis_impermeable2.jpg"
        ]
    },
    {
        id: 8,
        nombreProtesis: "Prótesis mini",
        descripcion: "Especialmente diseñada para razas toy y mini",
        precio: 1500.00,
        stock: 20,
        size: "small",
        imagenes: [
            "img/protesis_mini1.jpg",
            "img/protesis_mini2.jpg"
        ]
    },
    {
        id: 9,
        nombreProtesis: "Prótesis gigante XL",
        descripcion: "Para razas gigantes, con refuerzo estructural adicional",
        precio: 5200.00,
        stock: 4,
        size: "xlarge",
        imagenes: [
            "img/protesis_xl1.jpg",
            "img/protesis_xl2.jpg"
        ]
    },
    {
        id: 10,
        nombreProtesis: "Prótesis flexible junior",
        descripcion: "Diseño flexible para cachorros en crecimiento",
        precio: 2200.00,
        stock: 11,
        size: "medium",
        imagenes: [
            "img/protesis_junior1.jpg",
            "img/protesis_junior2.jpg"
        ]
    }
];

// ====== GESTIÓN DE DATOS ======
function inicializarDatos() {
    const datosGuardados = localStorage.getItem('protesis');
    if (!datosGuardados) {
        localStorage.setItem('protesis', JSON.stringify(protesisIniciales));
        return;
    }
    try {
        const protesis = JSON.parse(datosGuardados);
        if (protesis.length > 0) {
            const primerElemento = protesis[0];
            if (!primerElemento.nombreProtesis || !primerElemento.size || primerElemento.stock === undefined) {
                localStorage.setItem('protesis', JSON.stringify(protesisIniciales));
            }
        }
    } catch (error) {
        localStorage.setItem('protesis', JSON.stringify(protesisIniciales));
    }
}

function obtenerProtesis() {
    const data = localStorage.getItem('protesis');
    return data ? JSON.parse(data) : [];
}

// ====== GESTIÓN DEL CARRITO ======
function obtenerCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const carritoLink = document.querySelector('.carrito-link');
    if (carritoLink) {
        carritoLink.textContent = `🛒 Carrito (${totalItems})`;
    }
}

function agregarAlCarrito(id) {
    const protesis = obtenerProtesis();
    const producto = protesis.find(p => p.id === id);
    
    if (!producto || producto.stock === 0) {
        mostrarMensaje('❌ Producto no disponible', 'error');
        return;
    }
    
    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === id);
    
    if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
            itemExistente.cantidad++;
            mostrarMensaje('✅ Cantidad actualizada en el carrito', 'success');
        } else {
            mostrarMensaje('⚠️ No hay más stock disponible', 'warning');
            return;
        }
    } else {
        carrito.push({
            id: producto.id,
            nombreProtesis: producto.nombreProtesis,
            precio: producto.precio,
            cantidad: 1,
            imagen: producto.imagenes[0] || ''
        });
        mostrarMensaje('✅ Producto agregado al carrito', 'success');
    }
    
    guardarCarrito(carrito);
}

function verCarrito() {
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        mostrarMensaje('🛒 Tu carrito está vacío', 'info');
        return;
    }
    
    // Mostrar modal del carrito
    mostrarModalCarrito();
}

function mostrarModalCarrito() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const modal = document.getElementById('modalCarrito');
    const carritoItems = document.getElementById('carritoItems');
    const totalCarrito = document.getElementById('totalCarrito');
    
    carritoItems.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <div class="carrito-item-info">
                <h4>${item.nombreProtesis}</h4>
                <p class="carrito-item-precio">$${item.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            </div>
            <div class="carrito-item-cantidad">
                <button onclick="cambiarCantidad(${item.id}, -1)" class="btn-cantidad">-</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidad(${item.id}, 1)" class="btn-cantidad">+</button>
            </div>
            <button onclick="eliminarDelCarrito(${item.id})" class="btn-eliminar-item">🗑️</button>
        </div>
    `).join('');
    
    totalCarrito.textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    modal.classList.add('active');
}

function cambiarCantidad(id, cambio) {
    const carrito = obtenerCarrito();
    const protesis = obtenerProtesis();
    const item = carrito.find(i => i.id === id);
    const producto = protesis.find(p => p.id === id);
    
    if (!item || !producto) return;
    
    const nuevaCantidad = item.cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }
    
    if (nuevaCantidad > producto.stock) {
        mostrarMensaje('⚠️ No hay suficiente stock disponible', 'warning');
        return;
    }
    
    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    mostrarModalCarrito();
}

function eliminarDelCarrito(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito(carrito);
    
    if (carrito.length === 0) {
        cerrarModalCarrito();
        mostrarMensaje('🛒 Carrito vacío', 'info');
    } else {
        mostrarModalCarrito();
    }
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        actualizarContadorCarrito();
        cerrarModalCarrito();
        mostrarMensaje('🗑️ Carrito vaciado', 'info');
    }
}

function finalizarCompra() {
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        mostrarMensaje('❌ El carrito está vacío', 'error');
        return;
    }
    
    // Crear mensaje para WhatsApp
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    let mensaje = '🐾 *Hola! Quiero realizar una compra:*\n\n';
    
    carrito.forEach(item => {
        mensaje += `• ${item.nombreProtesis}\n`;
        mensaje += `  Cantidad: ${item.cantidad}\n`;
        mensaje += `  Precio: $${(item.precio * item.cantidad).toLocaleString('es-MX')}\n\n`;
    });
    
    mensaje += `*Total: $${total.toLocaleString('es-MX')}*\n\n`;
    mensaje += '¿Podrían ayudarme con mi pedido?';
    
    // Reemplaza este número con el número de WhatsApp de Pawssible
    const numeroWhatsApp = '525512345678'; // Formato: código de país + número sin espacios
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(urlWhatsApp, '_blank');
}

// ====== HELPERS ======
function obtenerIconoPorSize(size) {
    const iconos = {
        'small': '🐕',
        'medium': '🦴',
        'large': '🐾',
        'xlarge': '🦴'
    };
    return iconos[size] || '🦴';
}

function traducirSize(size) {
    const traducciones = {
        'small': 'Pequeña',
        'medium': 'Mediana',
        'large': 'Grande',
        'xlarge': 'Extra Grande'
    };
    return traducciones[size] || size;
}

// ====== RENDERIZADO Y FILTROS ======
let protesisFiltradas = [];

function renderizarProtesis(protesis = null) {
    const grid = document.getElementById('protesisGrid');
    const datos = protesis || obtenerProtesis();
    protesisFiltradas = datos;
    
    // Actualizar contador
    const contador = document.getElementById('productsCount');
    if (contador) {
        contador.textContent = `${datos.length} producto${datos.length !== 1 ? 's' : ''} encontrado${datos.length !== 1 ? 's' : ''}`;
    }
    
    if (datos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 3rem;">🔍</p>
                <p style="color: white; font-size: 1.2rem; margin-top: 1rem;">No se encontraron productos</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = datos.map(p => `
        <div class="protesis-card">
            <div class="protesis-image">
                ${p.imagenes && p.imagenes[0] ? 
                    `<img src="${p.imagenes[0]}" alt="${p.nombreProtesis}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='${obtenerIconoPorSize(p.size)}'">` 
                    : obtenerIconoPorSize(p.size)
                }
                ${p.stock < 5 && p.stock > 0 ? '<span class="badge-stock-bajo">¡Últimas unidades!</span>' : ''}
                ${p.stock === 0 ? '<span class="badge-agotado">Agotado</span>' : ''}
            </div>
            <div class="protesis-content">
                <h3 class="protesis-name">${p.nombreProtesis}</h3>
                <p class="protesis-type">Talla: ${traducirSize(p.size)}</p>
                <p class="protesis-stock">Stock: ${p.stock > 0 ? `${p.stock} unidades` : '<span style="color: #dc3545;">Agotado</span>'}</p>
                <p class="protesis-description">${p.descripcion}</p>
                <p class="protesis-price">$${p.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div class="protesis-actions">
                    <button class="btn-add-cart" onclick="agregarAlCarrito(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
                        ${p.stock === 0 ? '❌ Agotado' : '🛒 Agregar al Carrito'}
                    </button>
                    <button class="btn-whatsapp" onclick="consultarPorWhatsApp(${p.id})">
                        💬 Consultar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function aplicarFiltros() {
    let protesis = obtenerProtesis();
    const filterSize = document.getElementById('filterSize')?.value;
    const sortBy = document.getElementById('sortBy')?.value;
    const searchTerm = document.getElementById('searchBox')?.value.toLowerCase();
    
    // Filtrar por búsqueda
    if (searchTerm) {
        protesis = protesis.filter(p => 
            p.nombreProtesis.toLowerCase().includes(searchTerm) ||
            p.descripcion.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtrar por tamaño
    if (filterSize && filterSize !== 'all') {
        protesis = protesis.filter(p => p.size === filterSize);
    }
    
    // Ordenar
    if (sortBy) {
        switch(sortBy) {
            case 'name':
                protesis.sort((a, b) => a.nombreProtesis.localeCompare(b.nombreProtesis));
                break;
            case 'price-asc':
                protesis.sort((a, b) => a.precio - b.precio);
                break;
            case 'price-desc':
                protesis.sort((a, b) => b.precio - a.precio);
                break;
            case 'stock':
                protesis.sort((a, b) => b.stock - a.stock);
                break;
        }
    }
    
    renderizarProtesis(protesis);
}

function consultarPorWhatsApp(id) {
    const protesis = obtenerProtesis();
    const producto = protesis.find(p => p.id === id);
    
    if (!producto) return;
    
    const mensaje = `🐾 Hola! Me interesa la *${producto.nombreProtesis}*\n\n` +
                   `Precio: $${producto.precio.toLocaleString('es-MX')}\n` +
                   `Talla: ${traducirSize(producto.size)}\n\n` +
                   `¿Podrían darme más información?`;
    
    const numeroWhatsApp = '525512345678'; // Reemplaza con tu número
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(urlWhatsApp, '_blank');
}

// ====== MENSAJES ======
function mostrarMensaje(mensaje, tipo = 'success') {
    const colores = {
        success: 'linear-gradient(135deg, #28a745 0%, #20923c 100%)',
        error: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        warning: 'linear-gradient(135deg, #f29a2e 0%, #e08a1e 100%)',
        info: 'linear-gradient(135deg, #2263b4 0%, #1a4d8f 100%)'
    };
    
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 4px 16px rgba(13, 13, 13, 0.3);
        z-index: 3000;
        font-family: 'Jost', sans-serif;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => mensajeDiv.remove(), 300);
    }, 3000);
}

// ====== MODALES ======
function cerrarModalCarrito() {
    const modal = document.getElementById('modalCarrito');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ====== EVENT LISTENERS ======
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar
    inicializarDatos();
    renderizarProtesis();
    actualizarContadorCarrito();
    
    // Filtros
    const filterSize = document.getElementById('filterSize');
    const sortBy = document.getElementById('sortBy');
    const searchBox = document.getElementById('searchBox');
    
    if (filterSize) filterSize.addEventListener('change', aplicarFiltros);
    if (sortBy) sortBy.addEventListener('change', aplicarFiltros);
    if (searchBox) searchBox.addEventListener('input', aplicarFiltros);
    
    // Carrito
    const carritoLink = document.querySelector('.carrito-link');
    if (carritoLink) {
        carritoLink.addEventListener('click', (e) => {
            e.preventDefault();
            verCarrito();
        });
    }
    
    // Cerrar modal carrito
    const btnCerrarCarrito = document.getElementById('btnCerrarCarrito');
    if (btnCerrarCarrito) {
        btnCerrarCarrito.addEventListener('click', cerrarModalCarrito);
    }
    
    const modalCarrito = document.getElementById('modalCarrito');
    if (modalCarrito) {
        modalCarrito.addEventListener('click', (e) => {
            if (e.target === modalCarrito) cerrarModalCarrito();
        });
    }
});

// Estilos adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);