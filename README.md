# ✅ TP3 – Sistema de Gestión de Eventos

🎟️ **Gestión de Eventos — Plataforma de Cartelera y Reserva de Entradas**

Aplicación web full-stack para la exploración de eventos culturales y de entretenimiento, permitiendo a los usuarios registrarse, explorar la cartelera y asegurar sus lugares mediante un sistema de reservas seguro y en tiempo real.

## 📋 Descripción
El Sistema de Gestión de Eventos centraliza la oferta de entretenimiento (recitales, cine, e-sports, arte). Los usuarios pueden consultar detalles, precios y cupos disponibles. El backend garantiza la integridad de los datos evitando la sobreventa de entradas mediante transacciones y bloqueos de filas en MySQL.

## 🧩 Funcionalidades

👤 **Rol: Usuario**
* Explorar el catálogo completo de eventos activos.
* Visualizar detalles: fecha, hora, lugar, precio y capacidad disponible.
* Registrarse e iniciar sesión de forma segura.
* Reservar múltiples entradas para un evento (descontando el cupo en tiempo real).
* Obtener un código de acceso único por cada reserva generada.

🛡️ **Seguridad y Concurrencia**
* Las rutas de reserva están protegidas por autenticación **JWT**.
* Las contraseñas de los usuarios se encriptan utilizando **Bcrypt**.
* Prevención de concurrencia: si dos usuarios intentan comprar la última entrada al mismo tiempo, el sistema gestiona la fila mediante bloqueos `FOR UPDATE` en la base de datos.

## 🗂️ Estructura del Proyecto

```text
TP3-UTN-Gestion-de-Eventos/
├── public/
│   ├── index.html          ← Frontend principal (SPA)
│   ├── app.js              ← Lógica del cliente y peticiones fetch
│   └── style.css           ← Estilos modernos y responsive
├── routes/
│   ├── auth.js             ← Endpoints de registro y login
│   └── eventos.js          ← Endpoints de lectura de eventos y reservas
├── controllers/
│   ├── authController.js   ← Lógica de autenticación
│   └── eventosController.js← Lógica de negocio de cartelera
├── middleware/
│   └── auth.js             ← Verificación de tokens JWT
├── db/
│   ├── index.js            ← Pool de conexión a MySQL
│   └── database.sql        ← Esquema, SPs, Triggers y datos de prueba
├── server.js               ← Entry point de Express
├── .env.example            ← Plantilla de entorno
├── .gitignore              ← Archivos ignorados por Git
└── package.json            ← Dependencias del proyecto

```

## 🛠️ Tecnologías

| Capa | Tecnología |
| --- | --- |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Node.js + Express |
| **Base de datos** | MySQL |
| **Autenticación** | JWT (JSON Web Tokens) + Bcrypt |
| **Estilos** | CSS Custom (Tarjetas interactivas y degradados dinámicos) |

## ⚙️ Instalación y uso

**1. Clonar el repositorio**

```bash
git clone <url-del-repo>
cd TP3-UTN-Gestion-de-Eventos

```

**2. Instalar dependencias**

```bash
npm install

```

**3. Configurar variables de entorno**
Copiar `.env.example` a `.env` y completar:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gestion_eventos
JWT_SECRET=tu_clave_secreta_aqui
PORT=3000

```

**4. Importar la base de datos**

* Abrir MySQL Workbench o phpMyAdmin.
* Ejecutar el script completo ubicado en `db/database.sql`.
* *Esto creará la BD, las tablas, el procedimiento de reserva, el trigger de auditoría y cargará eventos de prueba.*

**5. Iniciar el servidor**

```bash
npm start

```

**6. Abrir en el navegador**

* `http://localhost:3000`

## 🔗 API Endpoints

### Autenticación

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/auth/registro` | Registra un nuevo usuario y encripta su clave. |
| POST | `/api/auth/login` | Valida credenciales y devuelve el token JWT. |

### Eventos y Reservas

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/eventos` | Lista todos los eventos disponibles con sus categorías. |
| POST | `/api/eventos/:id/reservar` | Genera una reserva de entradas *(Requiere JWT)*. |

## 🗄️ Base de datos — Tablas principales

* **usuarios**: `id`, `nombre`, `dni`, `email`, `password_hash`, `rol`
* **categorias**: `id`, `nombre`
* **eventos**: `id`, `nombre`, `id_categoria`, `fecha`, `lugar`, `capacidad_maxima`, `precio`
* **reservas**: `id`, `id_usuario`, `id_evento`, `cantidad_entradas`, `codigo_acceso`
* **log_usuarios**: `id`, `mensaje`, `fecha` (Tabla de auditoría para Triggers).

## 🔄 Flujo de uso típico

1. El usuario ingresa a la plataforma y visualiza los eventos activos.
2. Para interactuar, crea una cuenta y se loguea (recibiendo un JWT).
3. Selecciona un evento y la cantidad de entradas deseadas.
4. El backend procesa la petición, verifica el cupo y confirma la transacción.
5. El cupo del evento disminuye automáticamente.

## 👑 Usuario Administrador (Para pruebas del ABM)
El sistema cuenta con una función de **Auto-Seed** en el servidor Node.js. Al ejecutar `npm start`, el servidor verifica si existe un administrador en la base de datos; si no existe, lo crea y encripta su contraseña automáticamente.

Para probar la creación de eventos (ABM), iniciá sesión con:
* **Email:** `admin123@gmail.com`
* **Contraseña:** `admin123`

*(Al ingresar con esta cuenta, se habilitará el botón "➕ Crear Evento" en la barra de navegación).*

## 👤 Autor

**TP3 — Programación 3**

* Veliz Santiago

---

## 📝 Preguntas Conceptuales

**1. ¿Qué es un servidor web y cómo funciona el ciclo request-response?**
Un servidor web es un software que escucha peticiones en un puerto específico y devuelve una respuesta. En el ciclo request-response, el cliente (navegador) envía una solicitud HTTP (Request) a una ruta específica. El servidor recibe esta petición, la procesa a través del enrutador y los controladores (por ejemplo, consultando la base de datos de eventos), y devuelve una respuesta (Response), habitualmente en formato JSON junto con un código de estado (200 OK, 400 Bad Request, etc.).

**2. ¿Qué es Express y por qué usarlo en vez de Node.js puro?**
Express es un framework minimalista para Node.js. Si usáramos Node puro con su módulo `http`, tendríamos que escribir mucha lógica repetitiva para interpretar las URLs, extraer el body de las peticiones o manejar los encabezados. Express simplifica esto proporcionando un sistema de enrutamiento limpio, soporte nativo para middlewares (como nuestro chequeo de tokens) y funciones simplificadas para enviar respuestas, haciendo el código mucho más escalable.

**3. ¿Qué es un JWT y cómo se diferencia de las sesiones en servidor?**
JWT (JSON Web Token) es un estándar para transmitir información de forma segura entre cliente y servidor. A diferencia de las sesiones tradicionales (donde el servidor debe guardar en su memoria o en una tabla qué usuario está conectado), JWT es *stateless* (sin estado). El servidor firma el token y se lo entrega al cliente. En peticiones futuras, el cliente envía este token y el servidor simplemente verifica su firma matemática para saber quién es, ahorrando recursos y facilitando la escalabilidad.

**4. ¿Qué ventaja tiene un procedimiento almacenado sobre escribir el SQL desde Node?**
Un Procedimiento Almacenado (SP) encapsula la lógica directamente en el motor de base de datos. En este proyecto, el procedimiento `registrar_reserva` se encarga de chequear el cupo y generar la reserva. La gran ventaja es que reduce el tráfico de red y centraliza operaciones críticas. Al estar ejecutado en la base de datos, combinándolo con bloqueos, previene condiciones de carrera (race conditions) mucho mejor que si hiciéramos un `SELECT` desde Node y luego un `INSERT` en pasos separados.

**5. ¿Por qué son importantes las transacciones? Ejemplo de ROLLBACK.**
Las transacciones garantizan la propiedad de atomicidad: o se ejecutan todas las operaciones, o no se ejecuta ninguna. En nuestro sistema de eventos, usamos `START TRANSACTION` al reservar. Si un usuario pide 5 entradas, pero el sistema detecta que el cupo es insuficiente, ejecuta un `ROLLBACK`. Esto cancela toda la operación y deja la base de datos exactamente como estaba, impidiendo que se guarden reservas a medias o se vendan lugares que no existen.

**6. ¿Qué es un trigger? Describe el trigger implementado.**
Un trigger (disparador) es un bloque de código SQL que se ejecuta automáticamente en respuesta a un evento en una tabla (`INSERT`, `UPDATE`, `DELETE`). En este proyecto, implementamos el trigger `despues_de_nuevo_usuario`. Funciona con un `AFTER INSERT ON usuarios`, de manera que cada vez que alguien se registra con éxito en la plataforma, el sistema automáticamente guarda un registro de auditoría en la tabla `log_usuarios` con el email de la nueva cuenta, sin necesidad de que Node.js envíe una consulta extra.
