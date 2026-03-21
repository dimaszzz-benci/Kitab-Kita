<?php
// Mengizinkan akses dari halaman manapun
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Hubungkan ke database
require "config.php";

// Ambil data yang dikirim dari form
$data = json_decode(file_get_contents("php://input"), true);

$nama  = trim($data["nama"] ?? "");
$email = trim($data["email"] ?? "");
$pass  = trim($data["password"] ?? "");

// Cek semua field harus diisi
if (!$nama || !$email || !$pass) {
    echo json_encode(["status" => "error", "pesan" => "Semua field wajib diisi"]);
    exit;
}

// Cek format email valid
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "pesan" => "Format email salah"]);
    exit;
}

// Cek email sudah terdaftar atau belum
$cek = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$cek->execute([$email]);
if ($cek->fetch()) {
    echo json_encode(["status" => "error", "pesan" => "Email sudah digunakan"]);
    exit;
}

// Enkripsi password supaya aman
$hash = password_hash($pass, PASSWORD_DEFAULT);

// Simpan user baru ke database
$sql = $pdo->prepare("INSERT INTO users (nama, email, password) VALUES (?, ?, ?)");
$sql->execute([$nama, $email, $hash]);

echo json_encode(["status" => "ok", "pesan" => "Registrasi berhasil!"]);
?>
