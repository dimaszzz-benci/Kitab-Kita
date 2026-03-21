// ===== romo.js =====
// AI Romo — chatbot Alkitab pakai Claude AI
// Daftar API key di: console.anthropic.com

const ROMO_API_KEY = "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"; // ← ganti ini!

// Riwayat percakapan supaya Romo ingat konteks
let riwayatRomo = [];

// Kepribadian Romo
const SYSTEM_ROMO = `Kamu adalah Romo, asisten Alkitab yang ramah, bijaksana, dan berpengetahuan luas.
Kamu membantu pengguna memahami ayat-ayat Alkitab, memberikan penjelasan teologis yang sederhana,
dan menjawab pertanyaan seputar iman Kristen.
Gunakan bahasa Indonesia yang hangat, santai, dan mudah dipahami.
Sesekali gunakan emoji yang relevan supaya terasa lebih hidup.
Jika ditanya di luar topik Alkitab atau iman Kristen, tolak dengan sopan dan arahkan kembali.`;

// ===== BUKA PANEL ROMO =====
function bukaRomo() {
  const panel = document.getElementById("panel-romo");
  panel.classList.add("tampil");

  // Animasi panel naik dari bawah
  panel.style.transform  = "translateY(100%)";
  panel.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
  setTimeout(() => panel.style.transform = "translateY(0)", 10);

  // Salam pertama kalau baru dibuka
  if (riwayatRomo.length === 0) {
    setTimeout(() => {
      tampilPesanBot("Halo! Saya Romo 🙏");
    }, 300);
    setTimeout(() => {
      tampilPesanBot("Tanya apa saja tentang Alkitab, saya siap membantu! ✝️");
    }, 900);
  }

  // Fokus ke input otomatis
  setTimeout(() => document.getElementById("romo-input").focus(), 500);
}

// ===== TUTUP PANEL ROMO =====
function tutupRomo() {
  const panel = document.getElementById("panel-romo");

  // Animasi turun sebelum disembunyikan
  panel.style.transform = "translateY(100%)";
  setTimeout(() => panel.classList.remove("tampil"), 400);
}

// ===== TAMPIL PESAN BOT =====
function tampilPesanBot(teks, animate = true) {
  const chat = document.getElementById("romo-chat");
  const div  = document.createElement("div");
  div.className = "pesan-bot";

  if (animate) {
    // Animasi muncul dari kiri
    div.style.opacity   = "0";
    div.style.transform = "translateX(-15px)";
    div.style.transition = "all 0.3s ease";
  }

  div.textContent = teks;
  chat.appendChild(div);

  if (animate) {
    setTimeout(() => {
      div.style.opacity   = "1";
      div.style.transform = "translateX(0)";
    }, 50);
  }

  // Scroll ke bawah otomatis
  setTimeout(() => chat.scrollTop = chat.scrollHeight, 100);
  return div; // kembalikan elemen supaya bisa diupdate (untuk typing effect)
}

// ===== TAMPIL PESAN USER =====
function tampilPesanUser(teks) {
  const chat = document.getElementById("romo-chat");
  const div  = document.createElement("div");
  div.className = "pesan-user";

  // Animasi muncul dari kanan
  div.style.opacity    = "0";
  div.style.transform  = "translateX(15px)";
  div.style.transition = "all 0.3s ease";
  div.textContent      = teks;

  chat.appendChild(div);

  setTimeout(() => {
    div.style.opacity   = "1";
    div.style.transform = "translateX(0)";
  }, 50);

  setTimeout(() => chat.scrollTop = chat.scrollHeight, 100);
}

// ===== ANIMASI TYPING (titik-titik bergerak) =====
function tampilTyping() {
  const chat = document.getElementById("romo-chat");
  const div  = document.createElement("div");
  div.className  = "pesan-bot typing-indicator";
  div.id         = "typing-indicator";
  div.innerHTML  = `
    <span style="display:inline-flex;gap:4px;align-items:center">
      <span class="titik" style="width:7px;height:7px;background:var(--aksen);border-radius:50%;animation:titikNaik 0.8s infinite 0s"></span>
      <span class="titik" style="width:7px;height:7px;background:var(--aksen);border-radius:50%;animation:titikNaik 0.8s infinite 0.2s"></span>
      <span class="titik" style="width:7px;height:7px;background:var(--aksen);border-radius:50%;animation:titikNaik 0.8s infinite 0.4s"></span>
    </span>
  `;

  // Tambahkan animasi titik ke halaman kalau belum ada
  if (!document.getElementById("style-typing")) {
    const style = document.createElement("style");
    style.id = "style-typing";
    style.textContent = `
      @keyframes titikNaik {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50%       { transform: translateY(-5px); opacity: 1; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-8px); }
        40%       { transform: translateX(8px); }
        60%       { transform: translateX(-5px); }
        80%       { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Hapus animasi typing
function hapusTyping() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

// ===== KIRIM PERTANYAAN KE ROMO =====
async function kirimKeRomo() {
  const input      = document.getElementById("romo-input");
  const btnKirim   = document.querySelector(".romo-input-area button");
  const pertanyaan = input.value.trim();
  if (!pertanyaan) return;

  input.value = "";
  input.disabled    = true;  // nonaktifkan input saat loading
  btnKirim.disabled = true;
  btnKirim.textContent = "...";

  tampilPesanUser(pertanyaan);

  // Tambah ke riwayat
  riwayatRomo.push({ role: "user", content: pertanyaan });

  // Tampilkan animasi typing
  setTimeout(() => tampilTyping(), 300);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ROMO_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model      : "claude-sonnet-4-20250514",
        max_tokens : 600,
        system     : SYSTEM_ROMO,
        messages   : riwayatRomo
      })
    });

    const data    = await res.json();
    const balasan = data.content?.[0]?.text || "Maaf, saya tidak bisa menjawab saat ini. 🙏";

    // Hapus typing → tampilkan jawaban
    hapusTyping();
    tampilPesanBot(balasan);

    // Simpan balasan ke riwayat
    riwayatRomo.push({ role: "assistant", content: balasan });

  } catch (err) {
    hapusTyping();
    tampilPesanBot("❌ Maaf, terjadi kesalahan. Periksa koneksi internet kamu.");
  }

  // Aktifkan kembali input
  input.disabled    = false;
  btnKirim.disabled = false;
  btnKirim.textContent = "Kirim";
  input.focus();
}

// ===== TEKAN ENTER UNTUK KIRIM =====
document.addEventListener("DOMContentLoaded", function() {
  const input = document.getElementById("romo-input");
  if (input) {
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        kirimKeRomo();
      }
    });
  }
});
