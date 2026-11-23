<?php
/**
 * conexion.php
 * Conexión segura y auto-inicializable a las dos bases de datos en XAMPP/WAMP (MySQL).
 * Nunca detiene la carga visual de index.php si MySQL está apagado o aún no se importa base_de_datos.sql.
 */
mysqli_report(MYSQLI_REPORT_OFF);

if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
    @session_start();
}

$host = "localhost";
$user = "root";
$pass = "";

$conn_registro = null;
$conn_seguimiento = null;
$db_disponible = false;
$db_error_msg = "";

function inicializarEsquemaSiFalta(mysqli $srv): void {
    @$srv->query("CREATE DATABASE IF NOT EXISTS `db_registro_adolescente` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    @$srv->query("CREATE DATABASE IF NOT EXISTS `db_seguimiento_emocional` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    @$srv->select_db("db_registro_adolescente");
    @$srv->query("CREATE TABLE IF NOT EXISTS `usuarios_adolescentes` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `nombre_completo` VARCHAR(120) NOT NULL,
        `apodo` VARCHAR(60) NOT NULL,
        `edad` TINYINT UNSIGNED NOT NULL,
        `correo` VARCHAR(140) NOT NULL UNIQUE,
        `password_hash` VARCHAR(255) NOT NULL,
        `emocion_frecuente` ENUM('Miedo', 'Tristeza', 'Ansiedad', 'Enojo', 'Inseguridad') NOT NULL DEFAULT 'Miedo',
        `situacion_actual` TEXT NOT NULL,
        `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $demoPassHash = password_hash("123456", PASSWORD_DEFAULT);
    $stmtDemo = @$srv->prepare("INSERT IGNORE INTO `usuarios_adolescentes` (`id`, `nombre_completo`, `apodo`, `edad`, `correo`, `password_hash`, `emocion_frecuente`, `situacion_actual`) VALUES (1, 'Sofía Valentina Morales', 'Sofi', 16, 'sofia@mente.edu', ?, 'Miedo', 'Siento nervios intensos antes de exponer frente al salón y me preocupa qué piensen de mí.')");
    if ($stmtDemo) {
        $stmtDemo->bind_param("s", $demoPassHash);
        @$stmtDemo->execute();
        $stmtDemo->close();
    }

    @$srv->select_db("db_seguimiento_emocional");
    @$srv->query("CREATE TABLE IF NOT EXISTS `sesiones_login` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `usuario_id` INT NOT NULL,
        `correo` VARCHAR(140) NOT NULL,
        `frase_asignada` VARCHAR(255) NOT NULL,
        `fecha_ingreso` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    @$srv->query("CREATE TABLE IF NOT EXISTS `resultados_emocionales` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `usuario_id` INT NOT NULL,
        `actividad` VARCHAR(80) NOT NULL,
        `puntos_empatia` INT NOT NULL DEFAULT 20,
        `emocion_trabajada` VARCHAR(60) NOT NULL,
        `detalle_resultado` TEXT NOT NULL,
        `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    @$srv->query("CREATE TABLE IF NOT EXISTS `plan_bienestar` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    @$srv->query("INSERT IGNORE INTO `plan_bienestar` (`usuario_id`, `emocion_a_trabajar`, `situacion_resolver`, `estrategia_1`, `estrategia_2`, `estrategia_3`, `como_ser_feliz`, `frase_motivacional`, `codigo_certificado`) VALUES (1, 'Miedo', 'Superar el temor al juicio social cuando expresas tus ideas en clase o con amigos.', 'Respiración 4-4-6 antes de hablar para calmar el sistema nervioso.', 'Divide el reto en pasos pequeños: primero habla con un amigo cercano.', 'Cambia el qué dirán por qué quiero aportar hoy.', 'La felicidad en la adolescencia nace cuando te permites equivocarte sin castigarte, te rodeas de personas que respetan tus límites y celebras cada paso valiente.', 'Sé tú, sin pedir permiso. Tu voz importa incluso cuando tiembla.', 'MA-2026-0001')");
}

try {
    $srv = @new mysqli($host, $user, $pass);
    if ($srv && !$srv->connect_error) {
        $srv->set_charset("utf8mb4");
        inicializarEsquemaSiFalta($srv);
        $srv->close();

        $c1 = @new mysqli($host, $user, $pass, "db_registro_adolescente");
        $c2 = @new mysqli($host, $user, $pass, "db_seguimiento_emocional");
        if ($c1 && !$c1->connect_error && $c2 && !$c2->connect_error) {
            $c1->set_charset("utf8mb4");
            $c2->set_charset("utf8mb4");
            $conn_registro = $c1;
            $conn_seguimiento = $c2;
            $db_disponible = true;
        } else {
            $db_error_msg = "No se pudieron abrir ambas bases de datos en MySQL.";
        }
    } else {
        $db_error_msg = "MySQL no está iniciado en XAMPP. Enciende el módulo MySQL e importa base_de_datos.sql si deseas guardar datos.";
    }
} catch (\Throwable $e) {
    $db_disponible = false;
    $db_error_msg = "Modo sin base de datos activa: " . $e->getMessage();
}

function obtenerPlanesPorEmocion(string $emocion): array {
    $planes = [
        "Miedo" => [
            "situacion" => "Afrontar la inseguridad y el miedo al error o al rechazo en la escuela y grupo social.",
            "e1" => "Practica la respiración 4-4-6 (inhala 4s, sostén 4s, exhala 6s) para bajar el ritmo cardíaco.",
            "e2" => "Aplica la técnica de anclaje 5-4-3-2-1 para volver al presente cuando la mente anticipe catástrofes.",
            "e3" => "Da un paso pequeño progresivo en lugar de evitar por completo lo que te asusta.",
            "felicidad" => "Puedes ser feliz entendiendo que la valentía no es ausencia de miedo, sino caminar con él a tu ritmo, celebrando tu autenticidad y pidiendo apoyo cuando lo necesites.",
            "frase" => "Sé tú, sin pedir permiso. El miedo te protege, pero tú decides hasta dónde avanzar."
        ],
        "Tristeza" => [
            "situacion" => "Transitar momentos de desánimo, duelos afectivos o sensación de soledad sin aislarte.",
            "e1" => "Permítete llorar o escribir en un diario emocional durante 15 minutos sin juzgarte.",
            "e2" => "Comparte lo que sientes con una persona de confianza (amistad, familiar o orientador).",
            "e3" => "Realiza una micro-acción de autocuidado: caminata breve, música suave o hidratación.",
            "felicidad" => "Puedes ser feliz abrazando tus días grises con compasión, recordando que ninguna emoción es permanente y que pedir ayuda es un acto de fortaleza.",
            "frase" => "Eres suficiente tal como eres; hasta las nubes cargadas dejan crecer flores nuevas."
        ],
        "Ansiedad" => [
            "situacion" => "Calmar la sobrecarga mental por exámenes, redes sociales y expectativas del futuro.",
            "e1" => "Limita la revisión de notificaciones y date pausas de 20 minutos lejos de las pantallas.",
            "e2" => "Escribe tus preocupaciones y sepáralas en 'lo que puedo controlar hoy' y 'lo que no'.",
            "e3" => "Libera tensión muscular estirando hombros, cuello y mandíbula suavemente.",
            "felicidad" => "Puedes ser feliz viviendo un día a la vez, desconectando tu valor personal de las calificaciones o los likes.",
            "frase" => "Tu valor no es un número. Respira profundo y confía en tu propio ritmo."
        ],
        "Enojo" => [
            "situacion" => "Transformar la frustración o injusticia en límites claros sin herirte ni herir a otros.",
            "e1" => "Toma una pausa de 90 segundos antes de responder cuando sientas calor o tensión.",
            "e2" => "Usa mensajes en primera persona: 'Me siento frustrado cuando...' en vez de acusar.",
            "e3" => "Canaliza la energía física con deporte, dibujo o caminata rápida.",
            "felicidad" => "Puedes ser feliz usando tu fuerza emocional para defender tus valores con respeto, calma y firmeza.",
            "frase" => "Habla bonito de ti y defiende tu paz con respeto y claridad."
        ],
        "Inseguridad" => [
            "situacion" => "Fortalecer la autoestima frente a comparaciones constantes en redes y grupos.",
            "e1" => "Reemplaza el diálogo interno crítico por cómo le hablarías a tu mejor amigo.",
            "e2" => "Anota cada noche 3 cosas reales que hiciste bien o que te gustan de tu forma de ser.",
            "e3" => "Deja de seguir cuentas que te generan comparación y prioriza vínculos reales.",
            "felicidad" => "Puedes ser feliz reconociendo que tu historia, tu cuerpo y tu mente son únicos e irrepetibles.",
            "frase" => "No encajes, destaca. Tu autenticidad es tu mayor superpoder."
        ]
    ];
    return $planes[$emocion] ?? $planes["Miedo"];
}
?>
