// ===== ANIMASI HALAMAN =====
// Inject semua keyframe animasi ke halaman
(function() {
  const style = document.createElement("style");
  style.textContent = `
    /* Ayat muncul satu per satu dari bawah */
    @keyframes ayatMuncul {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    /* Header masuk dari atas */
    @keyframes headerMasuk {
      from { opacity: 0; transform: translateY(-30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    /* Fade in biasa */
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    /* Pulse untuk bookmark */
    @keyframes pulse {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    /* Ripple saat klik ayat */
    @keyframes ripple {
      from { transform: scale(0); opacity: 0.4; }
      to   { transform: scale(3); opacity: 0; }
    }
    /* Highlight muncul */
    @keyframes highlightMuncul {
      from { opacity: 0; transform: scaleX(0); }
      to   { opacity: 1; transform: scaleX(1); }
    }
    /* Shake untuk error */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%  { transform: translateX(-8px); }
      40%  { transform: translateX(8px); }
      60%  { transform: translateX(-5px); }
      80%  { transform: translateX(5px); }
    }
    /* Loading spinner */
    @keyframes putar {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    /* Notifikasi toast masuk */
    @keyframes toastMasuk {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Efek ripple di ayat */
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(123,63,0,0.2);
      width: 40px; height: 40px;
      margin-left: -20px; margin-top: -20px;
      animation: ripple 0.5s ease-out forwards;
      pointer-events: none;
    }

    /* Toast notifikasi */
    .toast {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 0.88rem;
      z-index: 9999;
      animation: toastMasuk 0.3s ease;
      white-space: nowrap;
    }

    /* Loading spinner */
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid var(--border);
      border-top-color: var(--aksen);
      border-radius: 50%;
      animation: putar 0.7s linear infinite;
      margin: 30px auto;
    }

    /* Ayat aktif audio glow */
    .ayat-item.aktif-audio {
      box-shadow: 0 0 0 2px var(--aksen2);
    }

    /* Tombol navigasi hover */
    .btn-primer {
      transition: transform 0.15s ease, background 0.2s ease;
    }
    .btn-primer:active {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);
})();

// ===== 66 KITAB ALKITAB LENGKAP =====
const DAFTAR_KITAB = [
  // Perjanjian Lama (39 kitab)
  { kode:"GEN", nama:"Kejadian",          pasal:50 },
  { kode:"EXO", nama:"Keluaran",          pasal:40 },
  { kode:"LEV", nama:"Imamat",            pasal:27 },
  { kode:"NUM", nama:"Bilangan",          pasal:36 },
  { kode:"DEU", nama:"Ulangan",           pasal:34 },
  { kode:"JOS", nama:"Yosua",             pasal:24 },
  { kode:"JDG", nama:"Hakim-hakim",       pasal:21 },
  { kode:"RUT", nama:"Rut",               pasal:4  },
  { kode:"1SA", nama:"1 Samuel",          pasal:31 },
  { kode:"2SA", nama:"2 Samuel",          pasal:24 },
  { kode:"1KI", nama:"1 Raja-raja",       pasal:22 },
  { kode:"2KI", nama:"2 Raja-raja",       pasal:25 },
  { kode:"1CH", nama:"1 Tawarikh",        pasal:29 },
  { kode:"2CH", nama:"2 Tawarikh",        pasal:36 },
  { kode:"EZR", nama:"Ezra",              pasal:10 },
  { kode:"NEH", nama:"Nehemia",           pasal:13 },
  { kode:"EST", nama:"Ester",             pasal:10 },
  { kode:"JOB", nama:"Ayub",              pasal:42 },
  { kode:"PSA", nama:"Mazmur",            pasal:150 },
  { kode:"PRO", nama:"Amsal",             pasal:31 },
  { kode:"ECC", nama:"Pengkhotbah",       pasal:12 },
  { kode:"SNG", nama:"Kidung Agung",      pasal:8  },
  { kode:"ISA", nama:"Yesaya",            pasal:66 },
  { kode:"JER", nama:"Yeremia",           pasal:52 },
  { kode:"LAM", nama:"Ratapan",           pasal:5  },
  { kode:"EZK", nama:"Yehezkiel",         pasal:48 },
  { kode:"DAN", nama:"Daniel",            pasal:12 },
  { kode:"HOS", nama:"Hosea",             pasal:14 },
  { kode:"JOL", nama:"Yoel",              pasal:3  },
  { kode:"AMO", nama:"Amos",              pasal:9  },
  { kode:"OBA", nama:"Obaja",             pasal:1  },
  { kode:"JON", nama:"Yunus",             pasal:4  },
  { kode:"MIC", nama:"Mikha",             pasal:7  },
  { kode:"NAM", nama:"Nahum",             pasal:3  },
  { kode:"HAB", nama:"Habakuk",           pasal:3  },
  { kode:"ZEP", nama:"Zefanya",           pasal:3  },
  { kode:"HAG", nama:"Hagai",             pasal:2  },
  { kode:"ZEC", nama:"Zakharia",          pasal:14 },
  { kode:"MAL", nama:"Maleakhi",          pasal:4  },
  // Perjanjian Baru (27 kitab)
  { kode:"MAT", nama:"Matius",            pasal:28 },
  { kode:"MRK", nama:"Markus",            pasal:16 },
  { kode:"LUK", nama:"Lukas",             pasal:24 },
  { kode:"JHN", nama:"Yohanes",           pasal:21 },
  { kode:"ACT", nama:"Kisah Para Rasul",  pasal:28 },
  { kode:"ROM", nama:"Roma",              pasal:16 },
  { kode:"1CO", nama:"1 Korintus",        pasal:16 },
  { kode:"2CO", nama:"2 Korintus",        pasal:13 },
  { kode:"GAL", nama:"Galatia",           pasal:6  },
  { kode:"EPH", nama:"Efesus",            pasal:6  },
  { kode:"PHP", nama:"Filipi",            pasal:4  },
  { kode:"COL", nama:"Kolose",            pasal:4  },
  { kode:"1TH", nama:"1 Tesalonika",      pasal:5  },
  { kode:"2TH", nama:"2 Tesalonika",      pasal:3  },
  { kode:"1TI", nama:"1 Timotius",        pasal:6  },
  { kode:"2TI", nama:"2 Timotius",        pasal:4  },
  { kode:"TIT", nama:"Titus",             pasal:3  },
  { kode:"PHM", nama:"Filemon",           pasal:1  },
  { kode:"HEB", nama:"Ibrani",            pasal:13 },
  { kode:"JAS", nama:"Yakobus",           pasal:5  },
  { kode:"1PE", nama:"1 Petrus",          pasal:5  },
  { kode:"2PE", nama:"2 Petrus",          pasal:3  },
  { kode:"1JN", nama:"1 Yohanes",         pasal:5  },
  { kode:"2JN", nama:"2 Yohanes",         pasal:1  },
  { kode:"3JN", nama:"3 Yohanes",         pasal:1  },
  { kode:"JUD", nama:"Yudas",             pasal:1  },
  { kode:"REV", nama:"Wahyu",             pasal:22 }
];

// ===== STATE (data aktif saat ini) =====
let state = {
  kitabKode : "JHN",   // default: Yohanes
  pasal     : 1,
  versi     : "id1",
  ayatAktif : null,
  audioObj  : null,
};

// Data lokal (tersimpan di browser)
let dataLokal = {
  bookmarks  : JSON.parse(localStorage.getItem("bk_bookmarks")  || "{}"),
  highlights : JSON.parse(localStorage.getItem("bk_highlights") || "{}"),
  catatan    : JSON.parse(localStorage.getItem("bk_catatan")    || "{}")
};

// ===== INIT =====
window.addEventListener("DOMContentLoaded", function() {
  // Animasi header masuk
  const header = document.querySelector("header");
  if (header) {
    header.style.animation = "headerMasuk 0.5s ease forwards";
  }

  isiDropdownKitab();
  isiDropdownVersi();
  muatAyat();
  cekModeTersimpan();
  tampilInfoUser();
});

// ===== TAMPIL INFO USER DI HEADER =====
function tampilInfoUser() {
  const user    = getUserLogin();
  const infoEl  = document.getElementById("info-user");
  const logoutEl = document.getElementById("btn-logout");

  if (user && infoEl) {
    infoEl.textContent = "👤 " + user.nama;
    if (logoutEl) logoutEl.style.display = "inline";
  }
}

// ===== ISI DROPDOWN KITAB =====
function isiDropdownKitab() {
  const sel = document.getElementById("pilih-kitab");
  if (!sel) return;

  DAFTAR_KITAB.forEach(k => {
    const opt = document.createElement("option");
    opt.value       = k.kode;
    opt.textContent = k.nama;
    if (k.kode === state.kitabKode) opt.selected = true;
    sel.appendChild(opt);
  });

  isiDropdownPasal();
}

// ===== ISI DROPDOWN PASAL =====
function isiDropdownPasal() {
  const kitab = DAFTAR_KITAB.find(k => k.kode === state.kitabKode);
  const sel   = document.getElementById("pilih-pasal");
  if (!sel) return;

  sel.innerHTML = "";
  for (let i = 1; i <= kitab.pasal; i++) {
    const opt = document.createElement("option");
    opt.value       = i;
    opt.textContent = "Pasal " + i;
    if (i === state.pasal) opt.selected = true;
    sel.appendChild(opt);
  }
}

// ===== ISI DROPDOWN VERSI =====
function isiDropdownVersi() {
  const versi = [
    { kode:"id1", nama:"TB — Terjemahan Baru" },
    { kode:"id2", nama:"BIS — Bahasa Indonesia Sehari-hari" },
    { kode:"kjv", nama:"KJV — King James Version" },
    { kode:"web", nama:"WEB — World English Bible" },
  ];

  const sel = document.getElementById("pilih-versi");
  if (!sel) return;

  versi.forEach(v => {
    const opt = document.createElement("option");
    opt.value       = v.kode;
    opt.textContent = v.nama;
    if (v.kode === state.versi) opt.selected = true;
    sel.appendChild(opt);
  });
}

// ===== MUAT AYAT DARI API =====
async function muatAyat() {
  const kontainer = document.getElementById("konten-ayat");
  if (!kontainer) return;

  // Tampilkan loading spinner
  kontainer.innerHTML = `
    <div style="text-align:center;padding:40px">
      <div class="spinner"></div>
      <p style="color:var(--aksen);margin-top:10px">Memuat Alkitab... 🙏</p>
    </div>
  `;

  const kitab = DAFTAR_KITAB.find(k => k.kode === state.kitabKode);
  document.getElementById("judul-pasal").textContent = kitab.nama + " " + state.pasal;

  try {
    const url  = `https://bible-api.com/${state.kitabKode}+${state.pasal}?translation=${state.versi}`;
    const res  = await fetch(url);
    const data = await res.json();

    if (!data.verses || data.verses.length === 0) {
      kontainer.innerHTML = "<p style='text-align:center;padding:30px;color:gray'>Data tidak tersedia untuk versi ini.</p>";
      return;
    }

    kontainer.innerHTML = "";

    // Render ayat satu per satu dengan animasi bertahap
    data.verses.forEach((ayat, index) => {
      const div = document.createElement("div");
      div.className    = "ayat-item";
      div.id           = "ayat-" + ayat.verse;
      div.dataset.ayat = ayat.verse;
      div.style.position = "relative"; // untuk efek ripple

      // Animasi muncul bertahap (delay per ayat)
      div.style.opacity   = "0";
      div.style.animation = `ayatMuncul 0.4s ease forwards`;
      div.style.animationDelay = (index * 30) + "ms"; // jeda 30ms per ayat

      // Pasang highlight kalau ada
      const kunci  = `${state.kitabKode}_${state.pasal}_${ayat.verse}`;
      const warnaHL = dataLokal.highlights[kunci];
      if (warnaHL) div.classList.add("highlight-" + warnaHL);

      // Pasang bookmark kalau ada
      if (dataLokal.bookmarks[kunci]) div.classList.add("dibookmark");

      div.innerHTML = `<span class="nomor-ayat">${ayat.verse}</span>${ayat.text}`;

      // Klik ayat → efek ripple + tampil menu
      div.addEventListener("click", function(e) {
        buatRipple(e, div);
        tampilMenuAyat(e, ayat.verse);
      });

      kontainer.appendChild(div);
    });

  } catch (err) {
    kontainer.innerHTML = `
      <div style="text-align:center;padding:30px">
        <p style="font-size:2rem">😢</p>
        <p style="color:gray;margin-top:8px">Gagal memuat. Cek koneksi internet.</p>
        <button class="btn btn-primer" style="margin-top:14px" onclick="muatAyat()">Coba Lagi</button>
      </div>
    `;
  }
}

// ===== EFEK RIPPLE SAAT KLIK AYAT =====
function buatRipple(e, el) {
  const ripple  = document.createElement("span");
  ripple.className = "ripple-effect";
  ripple.style.left = e.offsetX + "px";
  ripple.style.top  = e.offsetY + "px";
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

// ===== TOAST NOTIFIKASI =====
function tampilToast(pesan) {
  // Hapus toast lama kalau ada
  const toastLama = document.querySelector(".toast");
  if (toastLama) toastLama.remove();

  const toast = document.createElement("div");
  toast.className   = "toast";
  toast.textContent = pesan;
  document.body.appendChild(toast);

  // Hilang otomatis setelah 2 detik
  setTimeout(() => {
    toast.style.opacity    = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ===== MENU KLIK AYAT =====
function tampilMenuAyat(e, nomorAyat) {
  e.stopPropagation();
  state.ayatAktif = nomorAyat;

  const menu = document.getElementById("menu-ayat");
  menu.classList.add("tampil");

  // Animasi menu muncul
  menu.style.opacity   = "0";
  menu.style.transform = "scale(0.92)";
  menu.style.transition = "all 0.2s cubic-bezier(0.4,0,0.2,1)";

  // Posisi menu dekat klik
  const x = Math.min(e.clientX, window.innerWidth  - 230);
  const y = Math.min(e.clientY, window.innerHeight - 240);
  menu.style.left = x + "px";
  menu.style.top  = y + "px";

  setTimeout(() => {
    menu.style.opacity   = "1";
    menu.style.transform = "scale(1)";
  }, 10);
}

// Tutup menu saat klik di luar
document.addEventListener("click", function() {
  const menu = document.getElementById("menu-ayat");
  if (menu) {
    menu.style.opacity   = "0";
    menu.style.transform = "scale(0.92)";
    setTimeout(() => menu.classList.remove("tampil"), 150);
  }
});

// ===== BOOKMARK =====
function toggleBookmark() {
  const kunci = `${state.kitabKode}_${state.pasal}_${state.ayatAktif}`;
  const el    = document.getElementById("ayat-" + state.ayatAktif);

  if (dataLokal.bookmarks[kunci]) {
    delete dataLokal.bookmarks[kunci];
    el.classList.remove("dibookmark");
    tampilToast("🔖 Bookmark dihapus");
  } else {
    dataLokal.bookmarks[kunci] = true;
    el.classList.add("dibookmark");

    // Animasi pulse saat bookmark
    el.style.animation = "pulse 0.4s ease";
    setTimeout(() => el.style.animation = "", 400);

    tampilToast("🔖 Ayat di-bookmark!");

    // Simpan ke server kalau login
    const user = getUserLogin();
    if (user) {
      fetch("php/save_data.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipe: "bookmark", user_id: user.id,
          kitab: state.kitabKode, pasal: state.pasal,
          ayat: state.ayatAktif, versi: state.versi
        })
      });
    }
  }

  localStorage.setItem("bk_bookmarks", JSON.stringify(dataLokal.bookmarks));
  document.getElementById("menu-ayat").classList.remove("tampil");
}

// ===== HIGHLIGHT =====
function highlightAyat(warna) {
  const kunci = `${state.kitabKode}_${state.pasal}_${state.ayatAktif}`;
  const el    = document.getElementById("ayat-" + state.ayatAktif);

  el.classList.remove("highlight-kuning","highlight-hijau","highlight-biru","highlight-merah");

  if (dataLokal.highlights[kunci] === warna) {
    delete dataLokal.highlights[kunci];
    tampilToast("🎨 Highlight dihapus");
  } else {
    dataLokal.highlights[kunci] = warna;
    el.classList.add("highlight-" + warna);
    tampilToast("🎨 Ayat di-highlight!");
  }

  localStorage.setItem("bk_highlights", JSON.stringify(dataLokal.highlights));
  document.getElementById("menu-ayat").classList.remove("tampil");
}

// ===== PANEL CATATAN =====
function bukaPanel(tipe) {
  document.getElementById("menu-ayat").classList.remove("tampil");

  if (tipe === "catatan") {
    const panel    = document.getElementById("panel-catatan");
    const kunci    = `${state.kitabKode}_${state.pasal}_${state.ayatAktif}`;
    const textarea = document.getElementById("catatan-input");

    textarea.value = dataLokal.catatan[kunci] || "";
    document.getElementById("catatan-judul").textContent = `📝 Catatan Ayat ${state.ayatAktif}`;

    panel.classList.add("tampil");

    // Animasi panel naik dari bawah
    panel.style.transform  = "translateY(100%)";
    panel.style.transition = "transform 0.35s cubic-bezier(0.4,0,0.2,1)";
    setTimeout(() => {
      panel.style.transform = "translateY(0)";
      textarea.focus();
    }, 10);
  }
}

function tutupCatatan() {
  const panel = document.getElementById("panel-catatan");
  panel.style.transform = "translateY(100%)";
  setTimeout(() => panel.classList.remove("tampil"), 350);
}

function simpanCatatan() {
  const kunci    = `${state.kitabKode}_${state.pasal}_${state.ayatAktif}`;
  const isiNote  = document.getElementById("catatan-input").value.trim();

  dataLokal.catatan[kunci] = isiNote;
  localStorage.setItem("bk_catatan", JSON.stringify(dataLokal.catatan));

  const user = getUserLogin();
  if (user && isiNote) {
    fetch("php/save_data.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipe: "catatan", user_id: user.id,
        kitab: state.kitabKode, pasal: state.pasal,
        ayat: state.ayatAktif, isi: isiNote
      })
    });
  }

  tutupCatatan();
  tampilToast("✅ Catatan disimpan!");
}

// ===== SHARE AYAT =====
function shareAyat() {
  const el     = document.getElementById("ayat-" + state.ayatAktif);
  const kitab  = DAFTAR_KITAB.find(k => k.kode === state.kitabKode);
  const teksAyat = el.innerText;
  const teks   = `📖 ${kitab.nama} ${state.pasal}:${state.ayatAktif}\n\n"${teksAyat}"\n\n— Bible Kita`;

  if (navigator.share) {
    navigator.share({ text: teks });
  } else {
    navigator.clipboard.writeText(teks);
    tampilToast("📋 Ayat disalin ke clipboard!");
  }
  document.getElementById("menu-ayat").classList.remove("tampil");
}

// ===== AUDIO =====
function mainkanAudio() {
  const btn = document.getElementById("btn-play");

  if (state.audioObj && !state.audioObj.paused) {
    state.audioObj.pause();
    btn.textContent = "▶ Play";
    return;
  }

  if (state.audioObj && state.audioObj.paused) {
    state.audioObj.play();
    btn.textContent = "⏸ Pause";
    return;
  }

  // Ganti URL ini dengan sumber audio Alkitab yang valid
  // Rekomendasi: coba faithcomesbyhearing.com atau audio.bible
  const audioUrl = `https://audio.bible/audio/${state.kitabKode}/${state.pasal}.mp3`;

  state.audioObj = new Audio(audioUrl);

  state.audioObj.addEventListener("timeupdate", function() {
    const persen = (this.currentTime / this.duration) * 100;
    const fill   = document.getElementById("audio-progress-fill");
    if (fill) fill.style.width = persen + "%";
    highlightAyatAudio();
  });

  state.audioObj.addEventListener("ended", function() {
    btn.textContent = "▶ Play";
    document.getElementById("audio-progress-fill").style.width = "0%";
    document.querySelectorAll(".aktif-audio").forEach(el => el.classList.remove("aktif-audio"));
    tampilToast("✅ Audio selesai");
  });

  state.audioObj.play().catch(() => {
    tampilToast("❌ Audio tidak tersedia untuk pasal ini");
  });

  btn.textContent = "⏸ Pause";
}

function stopAudio() {
  if (state.audioObj) {
    state.audioObj.pause();
    state.audioObj.currentTime = 0;
    state.audioObj = null;
    document.getElementById("btn-play").textContent = "▶ Play";
    const fill = document.getElementById("audio-progress-fill");
    if (fill) fill.style.width = "0%";
    document.querySelectorAll(".aktif-audio").forEach(el => el.classList.remove("aktif-audio"));
  }
}

function ubahKecepatan(val) {
  if (state.audioObj) state.audioObj.playbackRate = parseFloat(val);
  document.getElementById("label-speed").textContent = val + "x";
}

function highlightAyatAudio() {
  if (!state.audioObj) return;
  const progres  = state.audioObj.currentTime / state.audioObj.duration;
  const ayatList = document.querySelectorAll(".ayat-item");
  const idx      = Math.floor(progres * ayatList.length);

  ayatList.forEach(el => el.classList.remove("aktif-audio"));

  if (ayatList[idx]) {
    ayatList[idx].classList.add("a
