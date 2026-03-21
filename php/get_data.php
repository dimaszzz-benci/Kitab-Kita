<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require "config.php";

// Ambil parameter dari URL
// Contoh: get_data.php?tipe=bookmark&user_id=1
$tipe    = $_GET["tipe"] ?? "";
$user_id = $_GET["user_id"] ?? 0;

if ($tipe === "bookmark") {
    // Ambil semua bookmark milik user
    $sql = $pdo->prepare("SELECT * FROM bookmarks WHERE user_id = ? ORDER BY dibuat DESC");
    $sql->execute([$user_id]);
    echo json_encode([
        "status" => "ok",
        "data"   => $sql->fetchAll(PDO::FETCH_ASSOC)
    ]);

} elseif ($tipe === "catatan") {
    // Ambil semua catatan milik user
    $sql = $pdo->prepare("SELECT * FROM catatan WHERE user_id = ? ORDER BY dibuat DESC");
    $sql->execute([$user_id]);
    echo json_encode([
        "status" => "ok",
        "data"   => $sql->fetchAll(PDO::FETCH_ASSOC)
    ]);

} else {
    echo json_encode(["status" => "error", "pesan" => "Tipe tidak dikenal"]);
}
?>
