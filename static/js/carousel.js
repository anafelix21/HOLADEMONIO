document.addEventListener('DOMContentLoaded', () => {
  // 🔹 Carrusel principal
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const carousel = document.getElementById('carousel');
  let currentIndex = 0;
  let autoSlide;
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicatorsContainer = document.getElementById('carousel-indicators');

  // 🔸 Crear indicadores dinámicos
  slides.forEach((_, idx) => {
    const btn = document.createElement('button');
    btn.className = 'w-3 h-3 rounded-full bg-white/60 hover:bg-white transition';
    btn.dataset.index = idx;
    btn.setAttribute('aria-label', `Slide ${idx + 1}`);
    btn.addEventListener('click', () => {
      moveToSlide(idx);
      currentIndex = idx;
      resetAutoSlide();
      updateIndicators();
    });
    indicatorsContainer.appendChild(btn);
  });

  function updateIndicators() {
    Array.from(indicatorsContainer.children).forEach((b, i) => {
      b.classList.toggle('bg-white', i === currentIndex);
    });
  }

  function moveToSlide(index) {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    moveToSlide(currentIndex);
    updateIndicators();
  }

  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 3500);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);

  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    moveToSlide(currentIndex);
    updateIndicators();
    resetAutoSlide();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  updateIndicators();
  startAutoSlide();

  // 🔹 Ordenar y filtrar productos
  const sortHome = document.getElementById('sort-home');
  const applyBtn = document.getElementById('apply-filters');
  const resetBtn = document.getElementById('reset-filters');

  if (sortHome) {
    sortHome.addEventListener('change', (e) => {
      const val = e.target.value;
      const grid = document.getElementById('products-grid');
      if (!grid) return;
      const cards = Array.from(grid.querySelectorAll('.product-card'));
      if (val === 'default') {
        cards.forEach(c => grid.appendChild(c));
        return;
      }
      const asc = val === 'precio-asc';
      cards.sort((a, b) => {
        const pa = parseFloat(a.dataset.precio) || 0;
        const pb = parseFloat(b.dataset.precio) || 0;
        return asc ? pa - pb : pb - pa;
      });
      cards.forEach(c => grid.appendChild(c));
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const min = parseFloat(document.getElementById('price-min').value) || 0;
      const max = parseFloat(document.getElementById('price-max').value) || Number.MAX_SAFE_INTEGER;
      const checked = Array.from(document.querySelectorAll('.type-filter:checked')).map(i => i.value);
      const grid = document.getElementById('products-grid');
      const cards = Array.from(grid.querySelectorAll('.product-card'));
      cards.forEach(card => {
        const precio = parseFloat(card.dataset.precio) || 0;
        const tipo = card.dataset.tipo;
        let show = precio >= min && precio <= max;
        if (checked.length > 0) show = show && checked.includes(tipo);
        card.style.display = show ? '' : 'none';
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('price-min').value = '';
      document.getElementById('price-max').value = '';
      document.querySelectorAll('.type-filter').forEach(i => i.checked = false);
      document.querySelectorAll('#products-grid .product-card').forEach(c => c.style.display = '');
    });
  }
});
