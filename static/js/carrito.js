class Carrito {
    constructor() {
        // Recuperar items del localStorage o iniciar vacío
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
        this.actualizarContador();
        this.actualizarCarritoLateral();
        this.inicializarEventos();
        
        // Asegurarse de que el carrito lateral esté oculto inicialmente
        const sidebar = document.getElementById("sidebar-carrito");
        if (sidebar) {
            sidebar.classList.add("translate-x-full");
        }
    }

    // Escucha clicks en botones con la clase .agregar-carrito y toma los datos desde data-attributes
    inicializarEventos() {
        document.addEventListener('click', (e) => {
            const boton = e.target.closest('.agregar-carrito');
            if (!boton) return;
            e.preventDefault();
            console.debug('[carrito] boton agregar clic:', boton.dataset);
            // Normalizar y limpiar valores por si el HTML tiene comillas extra o espacios
            const rawId = boton.dataset.id || '';
            const rawNombre = boton.dataset.nombre || '';
            const rawPrecio = boton.dataset.precio || '';
            const rawImagen = boton.dataset.imagen || '';

            // quitar comillas extras y caracteres raros
            const id = String(rawId).replace(/"+/g, '').trim();
            const nombre = String(rawNombre).replace(/"+/g, '').trim();
            const precio = parseFloat(String(rawPrecio).replace(/[^0-9,.-]/g, '').replace(',', '.'));
            const imagen = String(rawImagen).trim();
            // cantidad puede venir por data-cantidad o por un input .producto-cantidad dentro del mismo card
            let cantidad = 1;
            if (boton.dataset.cantidad) {
                cantidad = parseInt(boton.dataset.cantidad);
            } else {
                const card = boton.closest('[class*="bg-"]') || boton.closest('div');
                if (card) {
                    const inputQty = card.querySelector('.producto-cantidad');
                    if (inputQty) cantidad = parseInt(inputQty.value) || 1;
                }
            }
            if (!id || !nombre || isNaN(precio) || isNaN(cantidad)) {
                console.warn('[carrito] datos inválidos al intentar agregar:', {id, nombre, precio, cantidad, imagen, dataset: boton.dataset});
                return;
            }

            console.info('[carrito] agregando producto:', {id, nombre, precio, cantidad});
            this.agregarProducto(id, nombre, precio, imagen, cantidad);
        });
    }

    toggleCarrito() {
        const sidebar = document.getElementById("sidebar-carrito");
        if (sidebar) {
            sidebar.classList.toggle("translate-x-full");
            this.actualizarCarritoLateral();
        }
    }

    agregarProducto(id, nombre, precio, imagen, cantidad = 1) {
        const producto = {
            id: id,
            nombre: nombre,
            precio: parseFloat(precio),
            imagen: imagen,
            cantidad: parseInt(cantidad) || 1
        };

        const existente = this.items.find(item => item.id === id);
        
        if (existente) {
            existente.cantidad += producto.cantidad;
        } else {
            this.items.push(producto);
        }

    this.guardarCarrito();
    this.actualizarCarritoLateral();
        this.mostrarMensaje(`¡${nombre} agregado al carrito!`);
        console.debug('[carrito] items ahora:', this.items);
        // Abrir sidebar automáticamente si está cerrado para que el usuario vea el cambio
        try {
            const sidebar = document.getElementById('sidebar-carrito');
            if (sidebar && sidebar.classList.contains('translate-x-full')) {
                this.toggleCarrito();
            }
        } catch (err) {
            console.warn('[carrito] no se pudo abrir sidebar automáticamente:', err);
        }
    }

    actualizarCantidad(id, nuevaCantidad) {
        const producto = this.items.find(item => (item.id === id) || (item.nombre === id));
        if (producto) {
            producto.cantidad = parseInt(nuevaCantidad);
            if (producto.cantidad <= 0) {
                this.eliminarProducto(id);
            } else {
                this.guardarCarrito();
                this.actualizarCarritoLateral();
            }
        }
    }

    eliminarProducto(id) {
        // Acepta tanto id (identificador) como nombre para compatibilidad con items anteriores
        this.items = this.items.filter(item => { 
            if (!item) return false;
            const itemId = item.id || '';
            const itemNombre = item.nombre || '';
            return (itemId !== id) && (itemNombre !== id);
        });
    this.guardarCarrito();
    this.actualizarCarritoLateral();
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
        this.actualizarContador();
    }

    actualizarContador() {
        const contador = document.getElementById('contador-carrito');
        if (contador) {
            const total = this.items.reduce((sum, item) => sum + item.cantidad, 0);
            contador.textContent = total.toString();
        }
    }

    actualizarCarritoLateral() {
        const lista = document.getElementById("carrito-lista");
        if (!lista) return;

        if (!this.items || this.items.length === 0) {
            lista.innerHTML = '<p class="text-gray-500 p-4">El carrito está vacío.</p>';
            return;
        }

        let html = '';
        let total = 0;

        this.items.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            html += `
            <div class="flex items-center gap-4 py-3 border-b">
                <img src="${item.imagen}" alt="${item.nombre}" class="w-16 h-16 object-cover rounded">
                <div class="flex-grow">
                    <h3 class="font-medium">${item.nombre}</h3>
                    <div class="flex items-center gap-2">
                        <input type="number" 
                               value="${item.cantidad}" 
                               min="1" 
                               class="w-16 text-center border rounded"
                               onchange="carrito.actualizarCantidad('${item.id}', this.value)">
                        <span class="text-gray-600">x S/. ${item.precio.toFixed(2)}</span>
                    </div>
                    <p class="font-semibold">S/. ${subtotal.toFixed(2)}</p>
                </div>
                <button onclick="carrito.eliminarProducto('${item.id}')"
                        class="text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>`;
        });

        html += `
        <div class="mt-4 border-t pt-4">
            <div class="flex justify-between font-bold">
                <span>Total:</span>
                <span>S/. ${total.toFixed(2)}</span>
            </div>
        </div>`;

        lista.innerHTML = html;
    }

    mostrarMensaje(mensaje) {
        const div = document.createElement('div');
        div.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500';
        div.textContent = mensaje;
        document.body.appendChild(div);
        
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
        }, 2000);
    }
}

// Inicializar carrito y exponerlo en window para que otros scripts puedan acceder
window.carrito = new Carrito();

// Función para toggle del sidebar (debe estar fuera de la clase para ser accesible globalmente)
function toggleCarrito() {
    if (window.carrito) window.carrito.toggleCarrito();
}
