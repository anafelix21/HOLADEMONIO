// buscador.js - Buscador tipo "mega" para cortes y asados
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('global-search');
  const clearBtn = document.getElementById('search-clear');
  const chips = document.getElementById('search-chips');
  const mega = document.getElementById('mega-results');
  const resultsEl = document.getElementById('search-products');
  const mostEl = document.getElementById('most-searched');

  // pequeñas listas de ejemplo como "más buscados"
  const mostSearched = ['Costillas','Lomo','Aguja','Parrilla'];

  // renderizar "más buscados"
  function renderMost() {
    mostEl.innerHTML = '';
    mostSearched.forEach(name => {
      const d = document.createElement('div');
      d.className = 'chip';
      d.textContent = name;
      d.dataset.q = name;
      mostEl.appendChild(d);
    });
  }

  // renderizar resultados (mini tarjetas)
  function renderResults(list) {
    resultsEl.innerHTML = '';
    if (!list.length) {
      resultsEl.innerHTML = '<div class="text-sm text-gray-500">No se encontraron resultados.</div>';
      return;
    }

    list.slice(0,8).forEach(p => {
      const item = document.createElement('div');
      item.className = 'mini-product';
      item.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <div class="meta">
          <div class="name">${p.nombre}</div>
          <div class="price">S/ ${p.precio.toFixed(2)}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        // Lógica: intentar localizar elemento en el grid principal y hacer scroll
        const grid = document.getElementById('products-grid');
        if (grid) {
          const el = Array.from(grid.querySelectorAll('.product-card')).find(c => c.querySelector('h3').textContent.trim().toLowerCase() === p.nombre.toLowerCase());
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // resaltar temporalmente
            el.classList.add('ring-4', 'ring-red-200');
            setTimeout(()=> el.classList.remove('ring-4','ring-red-200'), 2000);
          }
        }
      });
      resultsEl.appendChild(item);
    });
  }

  // búsqueda (case-insensitive) por nombre y tipo
  function doSearch(q) {
    const term = (q || '').trim().toLowerCase();
    if (!term) {
      renderResults([]);
      return;
    }
    const res = SITE_PRODUCTS.filter(p => {
      return p.nombre.toLowerCase().includes(term) || (p.tipo && p.tipo.toLowerCase().includes(term));
    });
    renderResults(res);
  }

  // Debounce
  let timer;
  input.addEventListener('input', (e) => {
    const q = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => {
      doSearch(q);
      mega.classList.add('show');
    }, 200);
  });

  input.addEventListener('focus', () => {
    renderMost();
    mega.classList.add('show');
  });

  // click fuera para cerrar
  document.addEventListener('click', (ev) => {
    const within = ev.target.closest('.mega-search-wrap');
    if (!within) mega.classList.remove('show');
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    mega.classList.remove('show');
    renderResults([]);
  });

  // delegación: chips clickeables
  chips.addEventListener('click', (ev) => {
    const c = ev.target.closest('.chip');
    if (!c) return;
    const q = c.dataset.q || c.dataset.cat;
    if (!q) return;
    input.value = q;
    doSearch(q);
    mega.classList.add('show');
  });

  // también manejar clicks en most-searched y categories dentro mega
  document.getElementById('most-searched').addEventListener('click', (ev) => {
    const c = ev.target.closest('.chip');
    if (!c) return;
    const q = c.dataset.q;
    input.value = q;
    doSearch(q);
  });

  document.getElementById('search-categories').addEventListener('click', (ev) => {
    const c = ev.target.closest('.chip');
    if (!c) return;
    const cat = c.dataset.cat;
    input.value = cat;
    const res = SITE_PRODUCTS.filter(p => p.tipo === cat);
    renderResults(res);
    mega.classList.add('show');
  });

  // init
  renderMost();
});
