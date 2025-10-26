document.addEventListener('DOMContentLoaded', () => {
  console.log("Pagos cargado");

  const opciones = document.querySelectorAll('.payment-option');
  opciones.forEach(op => op.classList.add('fade-in'));

  const cancelYapeButton = document.getElementById('cancel-yape');
  const confirmYapeButton = document.getElementById('confirm-yape');

  // Evento para el botón "Volver"
  cancelYapeButton.addEventListener('click', () => {
    // Si deseas desplazarte a la parte superior de la misma página de pagos
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplaza a la parte superior de la página de pagos

    // Si deseas redirigir a la página principal de métodos de pago (ajusta la URL según tu caso)
    // window.location.href = '/pagos';  // Descomenta esta línea si prefieres redirigir a otra página
  });

  // Evento para el botón "He pagado"
  confirmYapeButton.addEventListener('click', () => {
    // Deshabilitar el botón para evitar múltiples clics
    confirmYapeButton.disabled = true;
    confirmYapeButton.textContent = 'Procesando...';

    // Simulación del pago
    setTimeout(() => {
      // Mostrar mensaje de confirmación
      alert('Pago procesado exitosamente. ¡Gracias por tu compra!');
      
      // Rehabilitar el botón y cambiar su texto
      confirmYapeButton.disabled = false;
      confirmYapeButton.textContent = 'He pagado';
    }, 2000); // Simulación del pago (2 segundos)
  });
});