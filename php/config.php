<?php
// Koneksi ke database InfinityFree
// GANTI 4 baris di bawah ini sesuai data akun InfinityFree kamu

$host     = "sql.infinityfree.com";   // host database
$dbname   = "if0_41442185";     // nama database
$username = "if0_41442185";       // username database
$password = "dea030804";       // password database

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "pesan" => "Koneksi gagal: " . $e->getMessage()]);
    exit;
}
?>
