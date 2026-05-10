# Sistema de Gestión de Eventos - EventosPRO

Este es mi proyecto para el TP3 de Programación III. Es una aplicación web completa (Full-Stack) que permite gestionar eventos, registrar usuarios y realizar reservas dinámicas con control de capacidad directamente en la base de datos.

## 🚀 Cómo hacerlo funcionar
1. **Instalar dependencias:** Ejecutar `npm install` en la terminal para descargar Express, JWT, Bcrypt y los drivers de MySQL.
2. **Base de datos:** Ejecutar el script `database.sql` en tu gestor de MySQL para crear las tablas, el procedimiento, el trigger y los datos de prueba.
3. **Variables de entorno:** Crear un archivo `.env` en la raíz (usando como guía el `.env.example`) con tus credenciales de base de datos y el puerto.
4. **Arrancar:** Usar el comando `npm start` y abrir en el navegador `http://localhost:3000`.

---

## 🧠 Preguntas Conceptuales

**1. Con tus palabras, explica qué es un servidor web y cómo funciona el ciclo request-response.**
Para mí, un servidor es como una computadora que siempre está prendida esperando que alguien le pida algo. El ciclo funciona así: el navegador (cliente) manda un "request" (ej: "quiero ver los eventos"), el servidor lo recibe, procesa la lógica y le devuelve un "response" con los datos o un mensaje de error.

**2. ¿Qué es Express y por qué lo usamos en lugar de usar solo Node.js?**
Express es un framework que nos facilita mucho el trabajo con Node.js. Lo usamos porque escribir todas las rutas y manejar los pedidos HTTP a mano con Node puro es muy complejo y largo; Express hace que el código sea más ordenado, legible y rápido de programar.

**3. ¿Qué es un JWT y como se diferencia de guardar la sesión en el servidor?**
El JWT es un token (un código encriptado) que el servidor te da cuando te logueas correctamente. La diferencia es que con las sesiones el servidor tiene que guardar tu estado en su memoria, pero con JWT el usuario lleva su propia "identidad" en el token, lo que hace al sistema más escalable.

**4. ¿Qué ventaja tiene usar un procedimiento almacenado en lugar de escribir ese SQL desde Node.js?**
La ventaja principal es que la lógica pesada corre directo en la base de datos, lo que es más rápido y seguro. Además, ayuda a centralizar procesos complejos (como una reserva con descuento de stock) en un solo lugar, evitando errores de comunicación desde el código de Node.

**5. ¿Por qué es importante usar transacciones? Pone un ejemplo de cuando un ROLLBACK salva la integridad de los datos.**
Son fundamentales para que la base de datos no quede con información a medias si algo falla. Por ejemplo, si registro una venta pero el sistema se cae justo antes de descontar el stock, el **ROLLBACK** cancela la venta para que no haya inconsistencias en los datos.

**6. ¿Qué es un trigger? Describe el trigger que implementaste y en qué momento se dispara.**
Un trigger es un "disparador" que la base de datos ejecuta sola cuando pasa algo. Yo implementé uno que, cada vez que se inserta un usuario nuevo en la tabla `usuarios`, guarda automáticamente un aviso en una tabla de auditoría llamada `log_usuarios`.

---

## 🛠️ Detalles del Desarrollo
* **Procedimiento Almacenado:** Implementé `registrar_reserva` para manejar la inserción de la reserva y la actualización de la capacidad del evento de forma atómica.
* **Triggers:** Utilicé un trigger de tipo `AFTER INSERT` para llevar un control de auditoría de los nuevos registros.
* **Seguridad:** Las rutas críticas están protegidas por un middleware que verifica el JWT, y las contraseñas se hashean antes de guardarse.