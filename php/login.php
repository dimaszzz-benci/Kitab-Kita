<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require "config.php";

// Ambil data yang dikirim dari form login
$data  = json_decode(file_get_contents("php://input"), true);
$email = trim($data["email"] ?? "");
$pass  = trim($data["password"] ?? "");

// Cek semua field diisi
if (!$email || !$pass) {
    echo json_encode(["status" => "error", "pesan" => "Email dan password wajib diisi"]);
    exit;
}

// Cari user berdasarkan email
$sql = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$sql->execute([$email]);
$user = $sql->fetch(PDO::FETCH_ASSOC);

// Cek password cocok atau tidak
if (!$user || !password_verify($pass, $user["password"])) {
    echo json_encode(["status" => "error", "pesan" => "Email atau password salah"]);
    exit;
}

// Login berhasil → kirim data user (tanpa password)
echo json_encode([
    "status" => "ok",
    "pesan"  => "Login berhasil",
    "user"   => [
        "id"    => $user["id"],
        "nama"  => $user["nama"],
        "email" => $user["email"]
    ]
]);
?>
