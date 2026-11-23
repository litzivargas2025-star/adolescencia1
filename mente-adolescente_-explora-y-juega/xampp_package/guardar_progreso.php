<?php
require_once "conexion.php";
header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["usuario_id"])) {
    echo json_encode(["ok" => false, "mensaje" => "Sesión local (no iniciada en MySQL)."]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data)) {
    echo json_encode(["ok" => false, "mensaje" => "Datos inválidos."]);
    exit;
}

if (!$db_disponible || !$conn_seguimiento) {
    echo json_encode(["ok" => false, "mensaje" => "Modo local sin conexión MySQL activa."]);
    exit;
}

$uid = intval($_SESSION["usuario_id"]);
$actividad = trim($data["actividad"] ?? "Dinámica");
$puntos = intval($data["puntos"] ?? 20);
$emocion = trim($data["emocion"] ?? "General");
$detalle = trim($data["detalle"] ?? "Actividad completada");

$stmt = $conn_seguimiento->prepare("INSERT INTO resultados_emocionales (usuario_id, actividad, puntos_empatia, emocion_trabajada, detalle_resultado) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("isiss", $uid, $actividad, $puntos, $emocion, $detalle);
$ok = $stmt->execute();
$stmt->close();

echo json_encode(["ok" => $ok]);
?>
