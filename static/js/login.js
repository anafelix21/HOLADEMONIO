document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistro');
    
    // Función para mostrar un mensaje de error para un campo específico
    const showError = (fieldId, message) => {
        const input = document.getElementById(fieldId);
        const errorElement = document.querySelector(`.error-text[data-for="${fieldId}"]`);
        if (input) input.classList.add('input-invalid');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    };

    // Función para limpiar el mensaje de error de un campo específico
    const clearError = (fieldId) => {
        const input = document.getElementById(fieldId);
        const errorElement = document.querySelector(`.error-text[data-for="${fieldId}"]`);
        if (input) input.classList.remove('input-invalid');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    };

    // Limpiar todos los errores al inicio
    const clearAllErrors = () => {
        document.querySelectorAll('.error-text').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('input-invalid');
        });
    };

    // Función principal de validación del formulario
    const validateForm = () => {
        let isValid = true;
        clearAllErrors(); 

        const fields = [
            { id: 'nombre', regex: /^[a-zA-ZáéíóúÁÉÍÓÚÑñ\s]{2,50}$/, msg: 'Nombre inválido. Solo letras, min. 2 caracteres.' },
            { id: 'apellido', regex: /^[a-zA-ZáéíóúÁÉÍÓÚÑñ\s]{2,50}$/, msg: 'Apellido inválido. Solo letras, min. 2 caracteres.' },
            { id: 'email', regex: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, msg: 'Correo electrónico inválido.' },
            { id: 'password', minLength: 6, msg: 'Contraseña debe tener al menos 6 caracteres.' },
            { id: 'dni', regex: /^\d{8}$/, msg: 'DNI inválido. Debe tener 8 dígitos.' },
            { id: 'direccion', minLength: 5, msg: 'Dirección inválida. Mínimo 5 caracteres.' }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input) return;

            const value = input.value.trim();
            let fieldValid = true;

            if (field.regex && !field.regex.test(value)) {
                showError(field.id, field.msg);
                fieldValid = false;
            } else if (field.minLength && value.length < field.minLength) {
                showError(field.id, field.msg);
                fieldValid = false;
            } else if (input.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
                 showError(field.id, field.msg);
                 fieldValid = false;
            }


            // Validación específica para fecha de nacimiento (mayor de 18)
            if (field.id === 'fecha_nacimiento') {
                if (!value) {
                    showError(field.id, 'La fecha de nacimiento es obligatoria.');
                    fieldValid = false;
                } else {
                    const dob = new Date(value);
                    const today = new Date();
                    let age = today.getFullYear() - dob.getFullYear();
                    const m = today.getMonth() - dob.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                        age--;
                    }
                    if (age < 18) {
                        showError(field.id, 'Debes ser mayor de 18 años.');
                        fieldValid = false;
                    }
                }
            }

            if (!fieldValid) isValid = false;
        });

        return isValid;
    };

    // Event Listener para el envío del formulario
    form.addEventListener('submit', (event) => {
        if (!validateForm()) {
            event.preventDefault();
            const firstErrorInput = document.querySelector('.input-invalid');
            if (firstErrorInput) {
                firstErrorInput.focus();
            }
        } else {
            console.log("Validación exitosa, enviando datos al servidor...");
        }
    });

    // Event Listeners para validación en tiempo real al salir de los campos
    document.querySelectorAll('#formRegistro input:not([type="submit"])').forEach(input => {
        input.addEventListener('blur', () => {
            validateForm(); 
        });
        input.addEventListener('input', () => {
            clearError(input.id);
        });
    });
});