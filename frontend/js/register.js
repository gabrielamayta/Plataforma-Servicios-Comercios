document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            role: document.getElementById('userType').value
        };

        // Validaciones del frontend
        if (!formData.role) {
            showError('Por favor selecciona un tipo de usuario');
            return;
        }

        if (!formData.name) {
            showError('El nombre es obligatorio');
            return;
        }

        if (!formData.email) {
            showError('El email es obligatorio');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showError('El formato del email no es válido');
            return;
        }

        if (!formData.password) {
            showError('La contraseña es obligatoria');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }

        if (!isValidPassword(formData.password)) {
            showError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos');
            return;
        }

        // Enviar datos al servidor
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('¡Registro exitoso! Redirigiendo al login...');
                // Guardar token si es necesario
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showError(data.error || 'Error en el registro');
            }

        } catch (error) {
            console.error('Error:', error);
            showError('Error de conexión. Intenta nuevamente.');
        }
    });

    function showError(message) {
        errorAlert.textContent = message;
        errorAlert.classList.remove('d-none');
        successAlert.classList.add('d-none');
    }

    function showSuccess(message) {
        successAlert.textContent = message;
        successAlert.classList.remove('d-none');
        errorAlert.classList.add('d-none');
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
});