let todosLosEventos = [];
let eventoSeleccionado = null;

document.addEventListener('DOMContentLoaded', () => {
    try {
        const token = localStorage.getItem('token');
        const userRaw = localStorage.getItem('usuario');
        
        // Verificamos si hay un token y si el usuario guardado es un formato válido
        if (token && userRaw && userRaw !== "undefined") {
            const user = JSON.parse(userRaw);
            mostrarSeccionEventos(user);
            fetchEventos();
        } else {
            // Si faltan datos o son de una versión vieja, limpiamos la memoria y mostramos el login
            localStorage.clear();
            renderLoginForm();
        }
    } catch (error) {
        // Si hay un error leyendo la memoria, limpiamos todo por seguridad
        console.error("Limpiando caché vieja del navegador...");
        localStorage.clear();
        renderLoginForm();
    }
});

// VISTAS
function mostrarSeccionAuth() {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('eventos-container').style.display = 'none';
}

function mostrarSeccionEventos(user) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('navbar').style.display = 'flex';
    document.getElementById('eventos-container').style.display = 'block';
    
    // Poner el nombre en la barra de navegación
    document.getElementById('userNameDisplay').innerText = `👤 ${user.nombre} ${user.apellido}`;
    
    // Pre-cargar datos en el menú de configuración
    document.getElementById('confEmail').value = user.email;
    document.getElementById('confTelefono').value = user.telefono;

    // Acá agarro el token JWT, lo desarmo para ver qué rol tiene el usuario.
    // Si dice 'administrador', le prendo el botón de crear evento, sino se lo dejo apagado.
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.rol === 'administrador') {
                document.getElementById('btnCrearEvento').style.display = 'inline-block';
            } else {
                document.getElementById('btnCrearEvento').style.display = 'none';
            }
        } catch(e) {}
    }
}

// LOGIN Y REGISTRO
function renderLoginForm() {
    mostrarSeccionAuth();
    const authContainer = document.getElementById('auth-container');
    authContainer.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <form id="loginForm">
            <input type="email" id="loginEmail" placeholder="Email" required>
            <input type="password" id="loginPass" placeholder="Contraseña" required>
            <button type="submit">Entrar</button>
        </form>
        <p style="text-align:center;">¿No tienes cuenta? <a href="#" onclick="renderRegisterForm()">Regístrate gratis</a></p>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPass').value })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                mostrarSeccionEventos(data.usuario);
                fetchEventos();
            } else alert(data.error);
        } catch (err) { alert('Error de conexión'); }
    });
}

function renderRegisterForm() {
    const authContainer = document.getElementById('auth-container');
    authContainer.innerHTML = `
        <h2>Registro Completo</h2>
        <form id="registerForm">
            <div class="form-row">
                <input type="text" id="regNombre" placeholder="Nombre" required>
                <input type="text" id="regApellido" placeholder="Apellido" required>
            </div>
            <div class="form-row">
                <input type="text" id="regDni" placeholder="DNI" required>
                <input type="tel" id="regTelefono" value="+54 " required>
            </div>
            <div class="form-row">
                <input type="text" id="regCiudad" placeholder="Ciudad" required>
                <input type="text" id="regLocalidad" placeholder="Localidad" required>
            </div>
            <input type="text" id="regCalle" placeholder="Calle y Número" required>
            <input type="email" id="regEmail" placeholder="Email (Usa admin123@gmail.com para ser admin)" required>
            <input type="password" id="regPass" placeholder="Contraseña" required>
            <button type="submit">Crear Cuenta</button>
        </form>
        <p style="text-align:center;"><a href="#" onclick="renderLoginForm()">Volver al Login</a></p>
    `;

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            nombre: document.getElementById('regNombre').value,
            apellido: document.getElementById('regApellido').value,
            dni: document.getElementById('regDni').value,
            telefono: document.getElementById('regTelefono').value,
            ciudad: document.getElementById('regCiudad').value,
            localidad: document.getElementById('regLocalidad').value,
            calle: document.getElementById('regCalle').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPass').value
        };

        const res = await fetch('/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        if (res.ok) {
            alert('¡Registro exitoso! Ya puedes iniciar sesión.');
            renderLoginForm();
        } else alert('Error al registrar');
    });
}

// EVENTOS Y RENDERIZADO
async function fetchEventos() {
    const res = await fetch('/api/eventos', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
    if (res.ok) {
        todosLosEventos = await res.json();
        renderizarEventos(todosLosEventos);
    } else logout();
}

function filtrarEventos(idCategoria) {
    if (!idCategoria) return renderizarEventos(todosLosEventos);
    const filtrados = todosLosEventos.filter(e => e.id_categoria === idCategoria);
    renderizarEventos(filtrados);
}

function renderizarEventos(eventos) {
    const lista = document.getElementById('listaEventos');
    lista.innerHTML = '';
    
    eventos.forEach(evento => {
        const bg = `background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url('${evento.logo_url || "https://loremflickr.com/800/600/music"}');`;
        lista.innerHTML += `
            <div class="card" style="${bg}">
                <div class="card-content">
                    <h3>${evento.nombre}</h3>
                    <p class="desc">${evento.descripcion}</p>
                    <div class="card-info">
                        <span>📍 ${evento.lugar}</span>
                        <span>🔞 Edad: +${evento.limite_edad}</span>
                    </div>
                    <div class="card-info">
                        <span>🕒 ${evento.hora_inicio.slice(0,5)} a ${evento.hora_fin.slice(0,5)}</span>
                        <span>💲 ${evento.precio}</span>
                    </div>
                    <div class="card-info" style="background: rgba(233, 69, 96, 0.8);">
                        <span>🎟️ Entradas Restantes: ${evento.capacidad_maxima}</span>
                    </div>
                    <button class="btn-reservar" onclick='abrirModal(${JSON.stringify(evento)})'>Inscribirse / Asistir</button>
                </div>
            </div>
        `;
    });
}

// LÓGICA DE INTERFAZ Y MODALES
function toggleUserMenu() {
    const menu = document.getElementById('userDropdown');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function toggleSoporte() {
    const widget = document.getElementById('supportWidget');
    widget.style.display = widget.style.display === 'none' ? 'block' : 'none';
}

function abrirConfiguracion() {
    document.getElementById('userDropdown').style.display = 'none';
    document.getElementById('modalConfig').style.display = 'flex';
}

function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
}

// LOGICA DE COMPRA
function abrirModal(evento) {
    eventoSeleccionado = evento;
    document.getElementById('modalTitulo').innerText = evento.nombre;
    document.getElementById('modalLugar').innerText = evento.lugar;
    document.getElementById('modalFecha').innerText = new Date(evento.fecha).toLocaleDateString() + ' a las ' + evento.hora_inicio.slice(0,5);
    document.getElementById('cantEntradas').value = 1;
    calcularTotal();
    document.getElementById('modalCompra').style.display = 'flex';
}

function calcularTotal() {
    const cant = document.getElementById('cantEntradas').value;
    document.getElementById('modalTotal').innerText = (cant * eventoSeleccionado.precio).toLocaleString();
}

async function confirmarCompra() {
    const cant = document.getElementById('cantEntradas').value;
    const metodoPago = document.getElementById('metodoPago').value;
    const total = cant * eventoSeleccionado.precio;
    const codigo = 'VIP-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
        const res = await fetch('/api/eventos/reservar', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Token obligatorio
            },
            body: JSON.stringify({
                id_evento: eventoSeleccionado.id,
                cantidad: cant,
                metodo_pago: metodoPago,
                monto_total: total,
                codigo_acceso: codigo
            })
        });

        const data = await res.json();

        if (res.ok) {
            // Llenamos los datos en el nuevo Ticket HTML
            document.getElementById('ticketMonto').innerText = total.toLocaleString();
            document.getElementById('ticketCodigo').innerText = codigo;

            // Cerramos la ventana de pago y abrimos la del Ticket
            cerrarModal('modalCompra');
            document.getElementById('modalExito').style.display = 'flex';
            
            // Refrescamos los eventos para que se actualice la capacidad restada visualmente
            fetchEventos(); 
        } else {
            alert("Error al reservar: " + data.error);
        }
    } catch (error) {
        alert("Ocurrió un error de red al procesar tu reserva.");
    }
}

// --- CREAR EVENTOS ---
function abrirModalCrear() {
    document.getElementById('modalCrearEvento').style.display = 'flex';
}

document.getElementById('crearEventoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Armo un objeto con todo lo que el admin puso en el formulario
    const nuevoEvento = {
        nombre: document.getElementById('nuevoNombre').value,
        descripcion: document.getElementById('nuevoDesc').value,
        id_categoria: 1, // Por defecto lo pongo en música para que sea más fácil
        fecha: document.getElementById('nuevoFecha').value,
        hora_inicio: document.getElementById('nuevoHora').value,
        hora_fin: "23:59:00", 
        lugar: document.getElementById('nuevoLugar').value,
        precio: document.getElementById('nuevoPrecio').value,
        capacidad_maxima: document.getElementById('nuevoCapacidad').value
    };

    try {
        const res = await fetch('/api/eventos', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') 
            },
            body: JSON.stringify(nuevoEvento)
        });

        if (res.ok) {
            alert("¡Evento creado con éxito!");
            cerrarModal('modalCrearEvento');
            document.getElementById('crearEventoForm').reset();
            fetchEventos(); // Cargo de nuevo las tarjetas así aparece el evento nuevo al instante
        } else {
            const data = await res.json();
            alert("Error: " + data.error);
        }
    } catch (error) {
        alert("Error de conexión al crear el evento.");
    }
});

// CONFIGURAR CUENTA (GUARDAR CAMBIOS)
document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('usuario'));
    const body = {
        id: user.id,
        email: document.getElementById('confEmail').value,
        telefono: document.getElementById('confTelefono').value,
        password: document.getElementById('confPass').value
    };

    try {
        const res = await fetch('/api/auth/update', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        if (res.ok) {
            alert('¡Cuenta actualizada! Por favor, inicia sesión nuevamente.');
            logout();
        } else {
            alert('Error al actualizar cuenta');
        }
    } catch(err) { alert('Error de red'); }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    location.reload();
}