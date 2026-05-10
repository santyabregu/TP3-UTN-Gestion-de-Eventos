-- CREACIÓN DE LA BASE DE DATOS
DROP DATABASE IF EXISTS gestion_eventos;
CREATE DATABASE gestion_eventos;
USE gestion_eventos;

-- TABLA DE USUARIOS
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(30) DEFAULT '+54 ',
    email VARCHAR(150) UNIQUE NOT NULL,
    calle VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    localidad VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'administrador') DEFAULT 'usuario'
);

-- TABLA DE CATEGORÍAS
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Insertamos las categorías básicas
INSERT INTO categorias (nombre) VALUES ('Música'), ('Películas'), ('Anime'), ('Videojuegos'), ('Arte'), ('Terror');

-- TABLA DE EVENTOS
CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    id_categoria INT,
    fecha DATETIME NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    capacidad_maxima INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    limite_edad INT DEFAULT 0,
    logo_url VARCHAR(255),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

-- TABLA DE RESERVAS
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_evento INT,
    cantidad_entradas INT NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    codigo_acceso VARCHAR(20) UNIQUE NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_evento) REFERENCES eventos(id)
);

-- TABLA DE LOGS (Auditoría)
CREATE TABLE log_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensaje VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROCEDIMIENTO ALMACENADO Y TRIGGER JUNTOS
DELIMITER //

DROP PROCEDURE IF EXISTS registrar_reserva //

CREATE PROCEDURE registrar_reserva(
    IN p_id_usuario INT,
    IN p_id_evento INT,
    IN p_cantidad INT,
    IN p_metodo_pago VARCHAR(50),
    IN p_monto_total DECIMAL(10,2),
    IN p_codigo_acceso VARCHAR(20)
)
BEGIN
    DECLARE v_capacidad_actual INT;

    -- Iniciamos transacción y bloqueamos fila
    START TRANSACTION;
    SELECT capacidad_maxima INTO v_capacidad_actual 
    FROM eventos WHERE id = p_id_evento FOR UPDATE;

    IF v_capacidad_actual >= p_cantidad THEN
        INSERT INTO reservas (id_usuario, id_evento, cantidad_entradas, metodo_pago, monto_total, codigo_acceso)
        VALUES (p_id_usuario, p_id_evento, p_cantidad, p_metodo_pago, p_monto_total, p_codigo_acceso);
        
        UPDATE eventos 
        SET capacidad_maxima = capacidad_maxima - p_cantidad
        WHERE id = p_id_evento;
        
        COMMIT;
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Capacidad insuficiente para este evento';
    END IF;
END //

DROP TRIGGER IF EXISTS despues_de_nuevo_usuario //

CREATE TRIGGER despues_de_nuevo_usuario
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO log_usuarios (mensaje) 
    VALUES (CONCAT('Nuevo usuario registrado: ', NEW.email));
END //

DELIMITER ;

-- DATOS DE PRUEBA (Todos los eventos en un solo bloque)
INSERT INTO eventos (nombre, descripcion, id_categoria, fecha, hora_inicio, hora_fin, lugar, capacidad_maxima, precio, limite_edad, logo_url) VALUES 
('Rock en Tucumán', 'Bandas locales en vivo', 1, '2026-06-15', '21:00', '02:00', 'Club Floresta', 500, 15000, 18, 'https://loremflickr.com/800/600/concert,rock'),
('Jazz Night', 'Noche de jazz y blues', 1, '2026-06-20', '20:00', '23:30', 'Teatro San Martín', 200, 12000, 13, 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800'),
('Maratón El Señor de los Anillos', 'Trilogía versión extendida', 2, '2026-06-18', '14:00', '01:00', 'Cine Atlas', 300, 8000, 13, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800'),
('Convención TucuTaku', 'Cosplay y shows', 3, '2026-08-10', '10:00', '20:00', 'Hotel Catalinas', 1500, 5000, 0, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800'),
('Torneo Major CS2', 'Competencia presencial 5v5', 4, '2026-09-05', '09:00', '22:00', 'Arena E-Sports', 800, 10000, 16, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800'),
('Festival Indie del Norte', 'Las mejores bandas indie emergentes de la provincia al aire libre.', 1, '2026-11-15', '17:00', '23:59', 'Parque de la Joven Argentina', 1000, 5000, 16, 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800'),
('Tributo a Queen', 'La banda tributo número uno de Argentina llega al teatro.', 1, '2026-12-05', '22:00', '01:00', 'Teatro Mercedes Sosa', 800, 15000, 0, 'https://loremflickr.com/800/600/band,music'),
('Especial Tarantino', 'Proyección doble en alta calidad: Pulp Fiction y Kill Bill Vol. 1.', 2, '2026-08-22', '19:00', '00:00', 'Cine Atlas', 250, 6000, 18, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800'),
('Festival Studio Ghibli', 'Tarde mágica con proyecciones y feria de emprendedores anime.', 3, '2026-09-12', '14:00', '21:00', 'Teatro Alberdi', 400, 4500, 0, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800'),
('Expo Retro Gaming', 'Consolas clásicas, arcades y torneos relámpago de Street Fighter II.', 4, '2026-07-05', '12:00', '20:00', 'Centro de Convenciones', 600, 4000, 0, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800'),
('Torneo Valorant 5v5', 'Clasificatorias presenciales con setup profesional para los jugadores.', 4, '2026-10-12', '10:00', '20:00', 'Arena E-Sports', 300, 5000, 13, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800'),
('Muestra Fotográfica: Paisajes', 'Exposición de fotógrafos locales retratando la naturaleza.', 5, '2026-09-01', '10:00', '18:00', 'Casa de la Cultura', 200, 1000, 0, 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=800'),
('Taller de Escultura en Arcilla', 'Crea tu propia obra. Incluye todos los materiales.', 5, '2026-08-15', '16:00', '19:00', 'Taller Municipal', 30, 8000, 12, 'https://loremflickr.com/800/600/sculpture,clay'),
('Muestra de Arte Local', 'Exposición de pinturas y esculturas de artistas tucumanos', 5, '2026-07-15', '18:00', '22:00', 'Teatro de la Estación, Concepción', 150, 2000, 0, 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800'),
('Cine de Terror en el Bosque', 'Proyección de "El Conjuro" en medio de la naturaleza a medianoche.', 6, '2026-11-10', '23:00', '02:00', 'Reserva Horco Molle', 100, 5000, 16, 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800'),
('Experiencia Survival Horror', 'Laberinto inmersivo con temática de infección zombie y supervivencia', 6, '2026-10-31', '22:00', '04:00', 'Ex Ingenio, Tucumán', 300, 8000, 16, 'https://loremflickr.com/800/600/horror,dark'),
('Noche de Entidades', 'Juegos de escape en vivo basados en persecuciones y cacerías asimétricas', 6, '2026-11-02', '20:00', '02:00', 'Club Floresta', 150, 6000, 18, 'https://loremflickr.com/800/600/scary,creepy');