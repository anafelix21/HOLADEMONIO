class CarritoDetallado {
    constructor() {
        this.carritoBase = window.carrito;
        this.actualizarCarritoDetallado();
    }

    actualizarCarritoDetallado() {
        const carritoDetallado = document.getElementById('carrito-detallado');
        const items = this.carritoBase.items;
        
        if (items.length === 0) {
            carritoDetallado.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <h2 class="text-xl font-semibold text-gray-600 mb-2">Tu carrito está vacío</h2>
                    <p class="text-gray-500 mb-4">¿Por qué no agregas algunos productos?</p>
                    <a href="/productos" 
                       class="inline-block bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
                        Ver productos
                    </a>
                </div>`;
            document.getElementById('btn-proceder-pago').disabled = true;
            this.actualizarResumen(0);
            return;
        }

        let html = '';
        let subtotal = 0;

        items.forEach(item => {
            const itemSubtotal = item.precio * item.cantidad;
            subtotal += itemSubtotal;

            html += `
            <div class="producto-carrito bg-white rounded-lg shadow p-4 flex items-center gap-4">
                <img src="${item.imagen}" 
                     alt="${item.nombre}" 
                     class="w-24 h-24 object-cover rounded-lg">
                
                <div class="flex-grow">
                    <h3 class="text-lg font-semibold">${item.nombre}</h3>
                    <p class="text-gray-600">S/. ${item.precio.toFixed(2)} x unidad</p>
                    <p class="font-semibold text-green-600">Subtotal: S/. ${itemSubtotal.toFixed(2)}</p>
                </div>

                <div class="flex flex-col items-end gap-2">
                    <input type="number" 
                           value="${item.cantidad}" 
                           min="1" 
                           class="w-20 text-center border rounded-lg p-1"
                           onchange="carritoDetallado.actualizarCantidad('${item.id}', this.value)">
                           
                    <button onclick="carritoDetallado.eliminarProducto('${item.id}')"
                            class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>`;
        });

        carritoDetallado.innerHTML = html;
        this.actualizarResumen(subtotal);
        document.getElementById('btn-proceder-pago').disabled = false;
    }

    actualizarCantidad(id, nuevaCantidad) {
        this.carritoBase.actualizarCantidad(id, nuevaCantidad);
        this.actualizarCarritoDetallado();
    }

    eliminarProducto(id) {
        this.carritoBase.eliminarProducto(id);
        this.actualizarCarritoDetallado();
    }

    actualizarResumen(subtotal) {
        const igv = subtotal * 0.18;
        const total = subtotal + igv;

        document.getElementById('subtotal').textContent = `S/. ${subtotal.toFixed(2)}`;
        document.getElementById('igv').textContent = `S/. ${igv.toFixed(2)}`;
        document.getElementById('total').textContent = `S/. ${total.toFixed(2)}`;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.carritoDetallado = new CarritoDetallado();
});