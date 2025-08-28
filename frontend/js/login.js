document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('errorAlert');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };

        // Validaciones básicas
        if (!formData.email || !formData.password) {
            showError('Email y contraseña son obligatorios');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar token y datos de usuario
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirigir al dashboard
                window.location.href = 'dashboard.html';
            } else {
                showError(data.error || 'Error en el login');
            }

        } catch (error) {
            console.error('Error:', error);
            showError('Error de conexión. Intenta nuevamente.');
        }
    });

    function showError(message) {
        errorAlert.textContent = message;
        errorAlert.classList.remove('d-none');
    }
});