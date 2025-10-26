// Dropdown funcional con click y hover
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.group');

    dropdowns.forEach(drop => {
        const btn = drop.querySelector('button');
        btn.addEventListener('click', () => {
            const menu = drop.querySelector('div.absolute');
            menu.classList.toggle('invisible');
            menu.classList.toggle('opacity-100');
            menu.classList.toggle('scale-100');
        });
    });

    console.log("Menu JS cargado correctamente.");
});
