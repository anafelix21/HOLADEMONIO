// === Script para Carne de Cerdo ===
// Animación y efecto de interacción para los productos de cerdo

document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".product-card button");

    botones.forEach((btn) => {
        btn.addEventListener("click", () => {
            btn.textContent = "Agregado 🛒";
            btn.classList.add("bg-green-600");
            setTimeout(() => {
                btn.textContent = "Agregar";
                btn.classList.remove("bg-green-600");
            }, 2000);
        });
    });

    // Animación de entrada
    const productos = document.querySelectorAll(".product-card");
    productos.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        setTimeout(() => {
            card.style.transition = "all 0.6s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 200 * index);
    });
});
