// --- Script para interacción en la página de Carne de Res / Vacuno ---

document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll("button");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const producto = boton.closest("div").querySelector("h3").textContent;
            alert(`🥩 Has agregado "${producto}" a tu carrito.`);
        });
    });
});
