// scripts/catalog.js
// Este archivo carga el catálogo de productos desde data/protesis.json
// y genera tarjetas dentro del contenedor con id "product-list".

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('product-list');
  if (!listEl) return;

  /**
   * Renderiza las tarjetas de productos en el DOM.
   * @param {Array} items Lista de objetos producto.
   */
  function render(items) {
    listEl.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';
      // Imagen
      const media = document.createElement('img');
      media.src = item.imagenes && item.imagenes[0] ? item.imagenes[0] : '';
      media.alt = item.nombre || '';
      media.className = 'product-image';
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
      btn.className = 'product-btn';
      btn.textContent = 'Agregar al Carrito';
      btn.addEventListener('click', () => {
        alert(`Has añadido “${item.nombre}” al carrito.`);
      });
      info.appendChild(btn);
      card.appendChild(info);
      listEl.appendChild(card);
    });
  }

  // Intenta primero cargar el JSON desde el servidor
  fetch('data/protesis.json', { cache: 'no-store' })
    .then(res => res.ok ? res.json() : Promise.reject(new Error('Error HTTP')))
    .then(data => {
      render(data);
    })
    .catch(() => {
      // Si falla (por ejemplo, al abrir con file://), usa el JSON incrustado
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