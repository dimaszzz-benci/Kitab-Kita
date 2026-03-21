<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require "config.php";

// Ambil data yang dikirim
$data = json_decode(file_get_contents("php://input"), true);
$tipe = $data["tipe"] ?? ""; // "bookmark" atau "catatan"

if ($tipe === "bookmark") {
    // Simpan bookmark
    $sql = $pdo->prepare("INSERT INTO bookmarks (user_id, kitab, pasal, ayat, versi) VALUES (?,?,?,?,?)");
    $sql->execute([
        $data["user_id"],
        $data["kitab"],
        $data["pasal"],
        $data["ayat"],
        $data["versi"]
    ]);
    echo json_encode(["status" => "ok", "pesan" => "Bookmark disimpan"]);

} elseif ($tipe === "catatan") {
    // Cek apakah catatan sudah ada untuk ayat ini
    $cek = $pdo->prepare("SELECT id FROM catatan WHERE user_id=? AND kitab=? AND pasal=? AND ayat=?");
    $cek->execute([$data["user_id"], $data["kitab"], $data["pasal"], $data["ayat"]]);

    if ($cek->fetch()) {
        // Sudah ada → update catatan lama
        $sql = $pdo->prepare("UPDATE catatan SET isi_catatan=? WHERE user_id=? AND kitab=? AND pasal=? AND ayat=?");
        $sql->execute([$data["isi"], $data["user_id"], $data["kitab"], $data["pasal"], $data["ayat"]]);
    } else {
        // Belum ada → tambah catatan baru
        $sql = $pdo->prepare("INSERT INTO catatan (user_id, kitab, pasal, ayat, isi_catatan) VALUES (?,?,?,?,?)");
        $sql->execute([$data["user_id"], $data["kitab"], $data["pasal"], $data["ayat"], $data["isi"]]);
    }
    echo json_encode(["status" => "ok", "pesan" => "Catatan disimpan"]);

} else {
    echo json_encode(["status" => "error", "pesan" => "Tipe tidak dikenal"]);
}
?>
