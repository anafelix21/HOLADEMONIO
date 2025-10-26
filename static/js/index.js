// ==========================
// index.js - Lógica principal de productos y carrito
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("carritoModal");
  const cerrar = document.getElementById("cerrarCarrito");
  const itemsEl = document.getElementById("carritoItems");
  const totalEl = document.getElementById("carritoTotal");
  const vaciar = document.getElementById("vaciarCarrito");
  const finalizar = document.getElementById("finalizarCompra");

  // ==================== FUNCIONES DE CARRITO ====================
  function renderModalCart() {
    const items = JSON.parse(localStorage.getItem("carrito")) || [];

    if (items.length === 0) {
      itemsEl.innerHTML = '<p class="text-gray-500 text-center">Tu carrito está vacío.</p>';
      totalEl.textContent = "S/ 0.00";
      return;
    }

    let html = "";
    let total = 0;

    items.forEach((p) => {
      const subtotal = (p.precio || 0) * (p.cantidad || 0);
      total += subtotal;

      html += `
        <div class="flex justify-between items-center border-b py-2">
          <div class="flex items-center">
            <img src="${p.imagen}" class="w-12 h-12 object-cover rounded mr-2">
            <div>
              <span class="font-medium">${p.nombre}</span>
              <span class="text-sm text-gray-500 ml-2">(x${p.cantidad})</span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-red-600 font-semibold">S/ ${subtotal.toFixed(2)}</span>
            <button class="remove-item ml-3 text-red-500 hover:text-red-700" data-id="${p.id}">✕</button>
          </div>
        </div>`;
    });

    itemsEl.innerHTML = html;
    totalEl.textContent = `S/ ${total.toFixed(2)}`;

    // Botón para eliminar productos
    itemsEl.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito = carrito.filter((it) => it.id != id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderModalCart();
      });
    });
  }

  // ==================== EVENTOS ====================
  // Abrir modal al agregar producto
  document.querySelectorAll(".agregar-carrito").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const nombre = btn.dataset.nombre;
      const precio = parseFloat(btn.dataset.precio);
      const imagen = btn.dataset.imagen;
      const cantidadInput = btn.closest("div").querySelector(".producto-cantidad");
      const cantidad = parseInt(cantidadInput.value) || 1;

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const productoExistente = carrito.find((p) => p.id === id);

      if (productoExistente) {
        productoExistente.cantidad += cantidad;
      } else {
        carrito.push({ id, nombre, precio, imagen, cantidad });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderModalCart();
      modal.classList.remove("hidden");
    });
  });

  // Cerrar modal
  if (cerrar) cerrar.addEventListener("click", () => modal.classList.add("hidden"));

  // Vaciar carrito
  if (vaciar) {
    vaciar.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      renderModalCart();
    });
  }

  // Finalizar compra (envía datos a tu CRUD o API)
  if (finalizar) {
    finalizar.addEventListener("click", async () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
      }

      try {
        const resp = await fetch("/api/compras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: carrito }),
        });

        if (resp.ok) {
          alert("✅ Compra registrada correctamente");
          localStorage.removeItem("carrito");
          window.location.href = "/carrito";
        } else {
          alert("❌ Error al registrar la compra");
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ No se pudo conectar con el servidor.");
      }
    });
  }

  // Render inicial
  renderModalCart();
});
