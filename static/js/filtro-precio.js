document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('sort-precio');
  if (!select) return;

  // Encontrar todos los grids de productos dentro de la sección principal
  const grids = Array.from(document.querySelectorAll('section .grid'))
    .filter(g => g.querySelectorAll('.product-card').length > 0);

  // Guardar el orden original por grid
  const originalOrder = grids.map(g => Array.from(g.children));

  select.addEventListener('change', (e) => {
    const value = e.target.value;

    grids.forEach((grid, idx) => {
      const cards = Array.from(grid.querySelectorAll('.product-card'));

      if (value === 'default') {
        // restaurar orden original
        originalOrder[idx].forEach(node => grid.appendChild(node));
        return;
      }

      // ordenar por data-precio
      const asc = value === 'precio-asc';
      cards.sort((a, b) => {
        const pa = parseFloat(a.dataset.precio) || 0;
        const pb = parseFloat(b.dataset.precio) || 0;
        return asc ? pa - pb : pb - pa;
      });

      // Append ordenado
      cards.forEach(c => grid.appendChild(c));
    });
  });
});
