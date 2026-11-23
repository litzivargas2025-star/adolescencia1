-- =========================================================================
-- PROYECTO: Mente Adolescente: Explora y Juega
-- Dos Bases de Datos para importar directamente en phpMyAdmin (XAMPP/WAMP)
-- =========================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- -------------------------------------------------------------------------
-- BASE DE DATOS 1: db_registro_adolescente
-- -------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `db_registro_adolescente`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_registro_adolescente`;

CREATE TABLE IF NOT EXISTS `usuarios_adolescentes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_completo` VARCHAR(120) NOT NULL,
  `apodo` VARCHAR(60) NOT NULL,
  `edad` TINYINT UNSIGNED NOT NULL CHECK (`edad` BETWEEN 13 AND 18),
  `correo` VARCHAR(140) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `emocion_frecuente` ENUM('Miedo', 'Tristeza', 'Ansiedad', 'Enojo', 'Inseguridad') NOT NULL DEFAULT 'Miedo',
  `situacion_actual` TEXT NOT NULL,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuario de prueba (clave: 123456)
INSERT INTO `usuarios_adolescentes`
(`nombre_completo`, `apodo`, `edad`, `correo`, `password_hash`, `emocion_frecuente`, `situacion_actual`)
VALUES
('Sofía Valentina Morales', 'Sofi', 16, 'sofia@mente.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Miedo', 'Siento nervios intensos antes de exponer frente al salón y me preocupa qué piensen de mí.')
ON DUPLICATE KEY UPDATE `apodo` = VALUES(`apodo`);

-- -------------------------------------------------------------------------
-- BASE DE DATOS 2: db_seguimiento_emocional
-- -------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `db_seguimiento_emocional`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_seguimiento_emocional`;

CREATE TABLE IF NOT EXISTS `sesiones_login` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `correo` VARCHAR(140) NOT NULL,
  `frase_asignada` VARCHAR(255) NOT NULL,
  `fecha_ingreso` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `resultados_emocionales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `actividad` VARCHAR(80) NOT NULL,
  `puntos_empatia` INT NOT NULL DEFAULT 20,
  `emocion_trabajada` VARCHAR(60) NOT NULL,
  `detalle_resultado` TEXT NOT NULL,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `plan_bienestar` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL UNIQUE,
  `emocion_a_trabajar` VARCHAR(60) NOT NULL,
  `situacion_resolver` TEXT NOT NULL,
  `estrategia_1` VARCHAR(255) NOT NULL,
  `estrategia_2` VARCHAR(255) NOT NULL,
  `estrategia_3` VARCHAR(255) NOT NULL,
  `como_ser_feliz` TEXT NOT NULL,
  `frase_motivacional` VARCHAR(255) NOT NULL,
  `codigo_certificado` VARCHAR(40) NOT NULL,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `resultados_emocionales`
(`usuario_id`, `actividad`, `puntos_empatia`, `emocion_trabajada`, `detalle_resultado`)
VALUES
(1, 'Sopa de Letras', 25, 'Miedo', 'Completó las palabras clave de regulación emocional en 100%.'),
(1, 'Mapa Corporal de las Emociones', 25, 'Tristeza', 'Identificó opresión en el pecho y practicó respiración profunda.');

INSERT INTO `plan_bienestar`
(`usuario_id`, `emocion_a_trabajar`, `situacion_resolver`, `estrategia_1`, `estrategia_2`, `estrategia_3`, `como_ser_feliz`, `frase_motivacional`, `codigo_certificado`)
VALUES
(1, 'Miedo', 'Superar el temor al juicio social cuando expresas tus ideas en clase o con amigos.', 'Respiración 4-4-6 antes de hablar para calmar el sistema nervioso.', 'Divide el reto en pasos pequeños: primero habla con un amigo cercano.', 'Cambia el "qué dirán" por "qué quiero aportar hoy".', 'La felicidad en la adolescencia nace cuando te permites equivocarte sin castigarte, te rodeas de personas que respetan tus límites y celebras cada paso valiente.', 'Sé tú, sin pedir permiso. Tu voz importa incluso cuando tiembla.', 'MA-2026-0001')
ON DUPLICATE KEY UPDATE `emocion_a_trabajar` = VALUES(`emocion_a_trabajar`);

COMMIT;
