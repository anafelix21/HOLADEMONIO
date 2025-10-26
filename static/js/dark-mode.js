// Función para cambiar el tema
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Función para establecer el tema inicial
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Inicializar tema al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    
    // Agregar botón de cambio de tema si no existe
    if (!document.getElementById('theme-toggle')) {
        const nav = document.querySelector('nav div.flex.space-x-4');
        if (nav) {
            const themeButton = document.createElement('button');
            themeButton.id = 'theme-toggle';
            themeButton.className = 'nav-link flex items-center';
            themeButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            `;
            themeButton.onclick = toggleTheme;
            nav.appendChild(themeButton);
        }
    }
});