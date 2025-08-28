document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Verificar si el usuario está logueado
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre de usuario
    document.getElementById('userWelcome').textContent = `Hola, ${user.name}`;

    // Cargar servicios
    loadServices();

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // Formulario de servicio
    document.getElementById('serviceForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const serviceData = {
            name: document.getElementById('serviceName').value,
            description: document.getElementById('serviceDescription').value,
            contact: document.getElementById('serviceContact').value,
            imageUrl: document.getElementById('serviceImageUrl').value || null
        };

        try {
            const response = await fetch('http://localhost:3001/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(serviceData)
            });

            if (response.ok) {
                alert('Servicio agregado exitosamente!');
                document.getElementById('serviceForm').reset();
                loadServices(); // Recargar servicios
            } else {
                const error = await response.json();
                alert(error.error || 'Error al agregar servicio');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    });

    async function loadServices() {
        try {
            const response = await fetch('http://localhost:3001/api/services');
            const services = await response.json();
            
            const servicesList = document.getElementById('servicesList');
            servicesList.innerHTML = '';

            if (services.length === 0) {
                servicesList.innerHTML = `
                    <div class="col-12 text-center">
                        <p>No hay servicios disponibles. ¡Sé el primero en agregar uno!</p>
                    </div>
                `;
                return;
            }

            services.forEach(service => {
                const serviceCard = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card service-card">
                            <img src="${service.imageUrl || 'https://placehold.co/300x200/E2E8F0/64748B?text=Sin+Imagen'}" 
                                 class="service-image" alt="${service.name}"
                                 onerror="this.src='https://placehold.co/300x200/E2E8F0/64748B?text=Imagen+No+Disponible'">
                            <div class="card-body">
                                <h5 class="card-title">${service.name}</h5>
                                <p class="card-text">${service.description}</p>
                                <p class="text-muted"><small>Contacto: ${service.contact}</small></p>
                                <p class="text-muted"><small>Publicado por: ${service.user.name}</small></p>
                            </div>
                        </div>
                    </div>
                `;
                servicesList.innerHTML += serviceCard;
            });

        } catch (error) {
            console.error('Error cargando servicios:', error);
        }
    }
});