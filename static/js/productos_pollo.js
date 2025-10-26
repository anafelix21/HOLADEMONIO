// --- Script para interacción en la página de Carne de Pollo ---

document.addEventListener("DOMContentLoaded", () => {
    const botonesAgregar = document.querySelectorAll(".product-card button");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", () => {
            const nombre = boton.closest(".product-card").querySelector("h3").textContent;
            alert(`Has agregado "${nombre}" a tu carrito 🐔`);
        });
    });
});
