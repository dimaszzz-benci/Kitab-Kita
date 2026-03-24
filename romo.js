// ===== romo.js =====
// AI Romo — pakai Google Gemini 2.0 Flash
// Daftar API key GRATIS di: aistudio.google.com

const GEMINI_API_KEY = "AIzaSyDZC2eghCV9roYwzhbDsGR9SFFQGk6F5wM"; // ← ganti ini!

// Riwayat percakapan
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

  panel.style.transform  = "translateY(100%)";
  panel.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
  setTimeout(() => panel.style.transform = "translateY(0)", 10);

  // Salam pertama
  if (riwayatRomo.length === 0) {
    setTimeout(() => tampilPesanBot("Halo! Saya Romo 🙏"), 300);
    setTimeout(() => tampilPesanBot("Tanya apa saja tentang Alkitab, saya siap membantu! ✝️"), 900);
  }

  setTimeout(() => {
    const input = document.getElementById("romo-input");
    if (input) input.focus();
  }, 500);
}

// ===== TUTUP PANEL ROMO =====
function tutupRomo() {
  const panel = document.getElementById("panel-romo");
  panel.style.transform = "translateY(100%)";
  setTimeout(() => panel.classList.remove("tampil"), 400);
}

// ===== TAMPIL PESAN BOT =====
function tampilPesanBot(teks) {
  const chat = document.getElementById("romo-chat");
  const div  = document.createElement("div");
  div.className        = "pesan-bot";
  div.style.opacity    = "0";
  div.style.transform  = "translateX(-15px)";
  div.style.transition = "all 0.3s ease";
  div.textContent      = teks;
  chat.appendChild(div);

  setTimeout(() => {
    div.style.opacity   = "1";
    div.style.transform = "translateX(0)";
  }, 50);

  setTimeout(() => chat.scrollTop = chat.scrollHeight, 100);
  return div;
}

// ===== TAMPIL PESAN USER =====
function tampilPesanUser(teks) {
  const chat = document.getElementById("romo-chat");
  const div  = document.createElement("div");
  div.className        = "pesan-user";
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

// ===== ANIMASI TYPING =====
function tampilTyping() {
  // Inject style animasi titik kalau belum ada
  if (!document.getElementById("style-typing")) {
    const style    = document.createElement("style");
    style.id       = "style-typing";
    style.textContent = `
      @keyframes titikNaik {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50%       { transform: translateY(-5px); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  const chat       = document.getElementById("romo-chat");
  const div        = document.createElement("div");
  div.className    = "pesan-bot typing-indicator";
  div.id           = "typing-indicator";
  div.innerHTML    = `
    <span style="display:inline-flex;gap:4px;align-items:center;padding:4px 0">
      <span style="width:7px;height:7px;background:var(--aksen);border-radius:50%;
        animation:titikNaik 0.8s infinite 0s;display:inline-block"></span>
      <span style="width:7px;height:7px;background:var(--aksen);border-radius:50%;
        animation:titikNaik 0.8s infinite 0.2s;display:inline-block"></span>
      <span style="width:7px;height:7px;background:var(--aksen);border-radius:50%;
        animation:titikNaik 0.8s infinite 0.4s;display:inline-block"></span>
    </span>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function hapusTyping() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

// ===== KIRIM KE GEMINI =====
async function kirimKeRomo() {
  const input    = document.getElementById("romo-input");
  const btnKirim = document.querySelector(".romo-input-area button");
  const pertanyaan = input.value.trim();
  if (!pertanyaan) return;

  input.value           = "";
  input.disabled        = true;
  btnKirim.disabled     = true;
  btnKirim.textContent  = "...";

  tampilPesanUser(pertanyaan);

  // Tambah ke riwayat
  riwayatRomo.push({
    role: "user",
    parts: [{ text: pertanyaan }]
  });

  setTimeout(() => tampilTyping(), 300);

  try {
    // URL Gemini 2.0 Flash API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // System instruction = kepribadian Romo
        system_instruction: {
          parts: [{ text: SYSTEM_ROMO }]
        },
        // Kirim seluruh riwayat supaya Romo ingat konteks
        contents: riwayatRomo
      })
    });

    const data = await res.json();

    hapusTyping();

    // Ambil teks balasan dari Gemini
    const balasan = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "Maaf, saya tidak bisa menjawab saat ini. 🙏";

    tampilPesanBot(balasan);

    // Simpan balasan ke riwayat
    riwayatRomo.push({
      role: "model",
      parts: [{ text: balasan }]
    });

  } catch (err) {
    hapusTyping();
    tampilPesanBot("❌ Maaf, terjadi kesalahan. Periksa koneksi internet kamu.");
    console.error(err);
  }

  // Aktifkan kembali input
  input.disabled       = false;
  btnKirim.disabled    = false;
  btnKirim.textContent = "Kirim";
  input.focus();
}

// ===== ENTER UNTUK KIRIM =====
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
