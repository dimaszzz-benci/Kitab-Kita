// ===== auth.js =====
// Mengurus login, register, sesi user, dan animasi halaman auth

// ===== ANIMASI HALAMAN ===== 
// Fade in saat halaman dibuka
document.addEventListener("DOMContentLoaded", function() {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.4s ease";
  setTimeout(() => document.body.style.opacity = "1", 50);
});

// Animasi pindah halaman (fade out dulu baru pindah)
function pindahHalaman(url) {
  document.body.style.opacity = "0";
  setTimeout(() => window.location.href = url, 400);
}

// ===== AMBIL DATA USER YANG LOGIN =====
function getUserLogin() {
  const data = localStorage.getItem("bibleKita_user");
  return data ? JSON.parse(data) : null;
}

// ===== SIMPAN SESI SETELAH LOGIN =====
function simpanSesi(user) {
  localStorage.setItem("bibleKita_user", JSON.stringify(user));
}

// ===== LOGOUT =====
function logout() {
  // Animasi fade out sebelum logout
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease";
  setTimeout(() => {
    localStorage.removeItem("bibleKita_user");
    window.location.href = "login.html";
  }, 300);
}

// ===== ANIMASI TOMBOL =====
// Efek "tertekan" saat tombol diklik
function animasiTombol(el) {
  el.style.transform = "scale(0.95)";
  el.style.transition = "transform 0.1s ease";
  setTimeout(() => {
    el.style.transform = "scale(1)";
  }, 150);
}

// ===== ANIMASI PESAN ERROR/SUKSES =====
function tampilPesan(elId, teks, tipe) {
  const el = document.getElementById(elId);
  el.textContent = teks;
  el.style.color = tipe === "ok" ? "#2e7d32" : tipe === "error" ? "#c62828" : "gray";
  
  // Animasi shake kalau error
  if (tipe === "error") {
    el.style.animation = "none";
    el.offsetHeight; // trigger reflow
    el.style.animation = "shake 0.4s ease";
  }
}

// ===== PROSES REGISTER =====
async function prosesRegister(e) {
  e.preventDefault();

  const tombol = e.target;
  animasiTombol(tombol);

  const nama  = document.getElementById("inp-nama").value.trim();
  const email = document.getElementById("inp-email").value.trim();
  const pass  = document.getElementById("inp-pass").value.trim();

  // Validasi panjang password
  if (pass.length < 6) {
    tampilPesan("pesan-auth", "❌ Password minimal 6 karakter", "error");
    return;
  }

  tampilPesan("pesan-auth", "⏳ Memproses...", "loading");

  try {
    const res = await fetch("php/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, password: pass })
    });

    const hasil = await res.json();

    if (hasil.status === "ok") {
      tampilPesan("pesan-auth", "✅ Berhasil! Mengarahkan ke login...", "ok");
      setTimeout(() => pindahHalaman("login.html"), 1500);
    } else {
      tampilPesan("pesan-auth", "❌ " + hasil.pesan, "error");
    }
  } catch (err) {
    tampilPesan("pesan-auth", "❌ Gagal terhubung ke server", "error");
  }
}

// ===== PROSES LOGIN =====
async function prosesLogin(e) {
  e.preventDefault();

  const tombol = e.target;
  animasiTombol(tombol);

  const email = document.getElementById("inp-email").value.trim();
  const pass  = document.getElementById("inp-pass").value.trim();

  tampilPesan("pesan-auth", "⏳ Memeriksa...", "loading");

  try {
    const res = await fetch("php/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });

    const hasil = await res.json();

    if (hasil.status === "ok") {
      simpanSesi(hasil.user);
      tampilPesan("pesan-auth", "✅ Login berhasil!", "ok");

      // Animasi kartu naik sebelum pindah halaman
      const kartu = document.querySelector(".kartu-auth");
      kartu.style.transform = "translateY(-20px)";
      kartu.style.opacity   = "0";
      kartu.style.transition = "all 0.4s ease";
      setTimeout(() => pindahHalaman("index.html"), 600);

    } else {
      tampilPesan("pesan-auth", "❌ " + hasil.pesan, "error");

      // Animasi shake pada kartu kalau salah password
      const kartu = document.querySelector(".kartu-auth");
      kartu.style.animation = "none";
      kartu.offsetHeight;
      kartu.style.animation = "shake 0.4s ease";
    }
  } catch (err) {
    tampilPesan("pesan-auth", "❌ Gagal terhubung ke server", "error");
  }
}

// ===== ANIMASI INPUT FOCUS =====
// Efek glow saat user klik input
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", function() {
      this.style.borderColor = "#7b3f00";
      this.style.boxShadow   = "0 0 0 3px rgba(123,63,0,0.15)";
      this.style.transition  = "all 0.2s ease";
      this.style.outline     = "none";
    });
    input.addEventListener("blur", function() {
      this.style.borderColor = "";
      this.style.boxShadow   = "";
    });
  });
});
