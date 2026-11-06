// ==========================================
// SOLATTIME - RENDERER 
// ==========================================

const { ipcRenderer } = require('electron');

// Get DOM Elements
var searchBtn = document.getElementById('searchBtn');
var stateInput = document.getElementById('stateInput');
var cityInput = document.getElementById('cityInput');
var locationTitleText = document.getElementById('locationTitleText');
var zoneCodeEl = document.getElementById('zoneCodeEl');
var zoneHintEl = document.getElementById('zoneHintEl');
var prayerCardsGrid = document.getElementById('prayerCardsGrid');
var mainReminderList = document.getElementById('mainReminderList');

var openLocationModalBtn = document.getElementById('openLocationModalBtn');
var locationModal = document.getElementById('locationModal');
var closeModalBtn = document.getElementById('closeModalBtn');
var modalSearchInput = document.getElementById('modalSearchInput');
var modalZonesBody = document.getElementById('modalZonesBody');

var monthlyTableHeading = document.getElementById('monthlyTableHeading');
var monthlyTableBody = document.getElementById('monthlyTableBody');
var monthPillEl = document.getElementById('monthPillEl');
var apiStatusEl = document.getElementById('apiStatusEl');
var apiStatusText = document.getElementById('apiStatusText');
var clockTimeEl = document.getElementById('clockTimeEl');
var clockDateEl = document.getElementById('clockDateEl');
var hijriEl = document.getElementById('hijriEl');
var gregEl = document.getElementById('gregEl');
var syurukMiniEl = document.getElementById('syurukMiniEl');
var nextNameEl = document.getElementById('nextNameEl');
var nextTimeEl = document.getElementById('nextTimeEl');
var nextIconEl = document.getElementById('nextIconEl');
var heroCountdownEl = document.getElementById('heroCountdownEl');
var calcLabelEl = document.getElementById('calcLabelEl');
var calcNameEl = document.getElementById('calcNameEl');
var calcTimerEl = document.getElementById('calcTimerEl');
var calcBarEl = document.getElementById('calcBarEl');
var calcFromEl = document.getElementById('calcFromEl');
var calcToEl = document.getElementById('calcToEl');
var todayLineEl = document.getElementById('todayLineEl');
var todayPillEl = document.getElementById('todayPillEl');
var toastEl = document.getElementById('toastEl');

// Delete modal elements
var deleteModal = document.getElementById('deleteModal');
var confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
var cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
var pendingDeleteId = null;

// Application State Variables
var currentSelectedZone = 'SGR01';
var currentStateName = 'Selangor';
var currentDaerahName = 'Shah Alam';
var monthData = null;
var todayPrayer = null;
var countdownTimer = null;
const MY_TZ = "Asia/Kuala_Lumpur";

// Prayer definitions array
var PRAYERS = [
  { key: "fajr", name: "Fajr", ar: "الفجر", icon: "🌄" },
  { key: "dhuhr", name: "Dhuhr", ar: "الظهر", icon: "☀️" },
  { key: "asr", name: "Asr", ar: "العصر", icon: "🌤️" },
  { key: "maghrib", name: "Maghrib", ar: "المغرب", icon: "🌇" },
  { key: "isha", name: "Isha", ar: "العشاء", icon: "🌙" }
];

// Malaysia Zones Mapping Dictionary
var malaysiaZones = {
  'pulau aur': 'JHR01', 'pulau pemanggil': 'JHR01',
  'johor bahru': 'JHR02', 'kota tinggi': 'JHR02', 
  'mersing': 'JHR02', 'kulai': 'JHR02',
  'kluang': 'JHR03', 'pontian': 'JHR03',
  'batu pahat': 'JHR04', 'muar': 'JHR04', 
  'segamat': 'JHR04', 'gemas': 'JHR04', 'tangkak': 'JHR04',
  'kota setar': 'KDH01', 'alor setar': 'KDH01', 
  'kubang pasu': 'KDH01', 'pokok sena': 'KDH01',
  'kuala muda': 'KDH02', 'sungai petani': 'KDH02', 
  'yan': 'KDH02', 'pendang': 'KDH02',
  'padang terap': 'KDH03', 'sik': 'KDH03',
  'baling': 'KDH04',
  'bandar baharu': 'KDH05', 'kulim': 'KDH05',
  'langkawi': 'KDH06', 'gunung jerai': 'KDH07',
  'bachok': 'KTN01', 'kota bharu': 'KTN01', 
  'machang': 'KTN01', 'pasir mas': 'KTN01',
  'pasir puteh': 'KTN01', 'tanah merah': 'KTN01', 
  'tumpat': 'KTN01', 'kuala krai': 'KTN01', 'chiku': 'KTN01',
  'gua musang': 'KTN02', 'jeli': 'KTN02', 'lojing': 'KTN02',
  'melaka': 'MLK01', 'malacca': 'MLK01', 
  'ayer keroh': 'MLK01', 'alor gajah': 'MLK01', 'jasin': 'MLK01',
  'tampin': 'NGS01', 'jempol': 'NGS01', 'bahau': 'NGS01',
  'jelebu': 'NGS02', 'kuala pilah': 'NGS02', 'rembau': 'NGS02',
  'port dickson': 'NGS03', 'seremban': 'NGS03', 'nilai': 'NGS03',
  'pulau tioman': 'PHG01', 'tioman': 'PHG01',
  'kuantan': 'PHG02', 'pekan': 'PHG02', 'muadzam shah': 'PHG02',
  'jerantut': 'PHG03', 'temerloh': 'PHG03', 
  'maran': 'PHG03', 'bera': 'PHG03', 'chenor': 'PHG03', 'jengka': 'PHG03',
  'bentong': 'PHG04', 'lipis': 'PHG04', 'raub': 'PHG04',
  'genting sempah': 'PHG05', 'janda baik': 'PHG05', 'bukit tinggi': 'PHG05',
  'cameron highlands': 'PHG06', 'genting highlands': 'PHG06', 'bukit fraser': 'PHG06',
  'rompin': 'PHG07', 'endau': 'PHG07',
  'tapah': 'PRK01', 'slim river': 'PRK01', 'tanjung malim': 'PRK01',
  'kuala kangsar': 'PRK02', 'sungai siput': 'PRK02', 
  'sg siput': 'PRK02', 'ipoh': 'PRK02', 'batu gajah': 'PRK02', 'kampar': 'PRK02',
  'lenggong': 'PRK03', 'pengkalan hulu': 'PRK03', 
  'gerik': 'PRK03', 'grik': 'PRK03',
  'temengor': 'PRK04', 'belum': 'PRK04',
  'kampung gajah': 'PRK05', 'kg gajah': 'PRK05', 
  'teluk intan': 'PRK05', 'bagan datuk': 'PRK05', 'seri iskandar': 'PRK05', 
  'beruas': 'PRK05', 'parit': 'PRK05', 'lumut': 'PRK05', 
  'sitiawan': 'PRK05', 'pulau pangkor': 'PRK05',
  'selama': 'PRK06', 'taiping': 'PRK06', 
  'bagan serai': 'PRK06', 'parit buntar': 'PRK06',
  'bukit larut': 'PRK07',
  'perlis': 'PLS01', 'kangar': 'PLS01', 
  'arau': 'PLS01', 'padang besar': 'PLS01',
  'pulau pinang': 'PNG01', 'penang': 'PNG01', 
  'george town': 'PNG01', 'georgetown': 'PNG01', 
  'butterworth': 'PNG01', 'bukit mertajam': 'PNG01',
  'sandakan': 'SBH01', 'beluran': 'SBH02', 'lahad datu': 'SBH03', 
  'tawau': 'SBH04', 'kudat': 'SBH05', 'gunung kinabalu': 'SBH06', 
  'kota kinabalu': 'SBH07', 'keningau': 'SBH08', 'beaufort': 'SBH09',
  'limbang': 'SWK01', 'miri': 'SWK02', 'bintulu': 'SWK03', 
  'sibu': 'SWK04', 'sarikei': 'SWK05', 'sri aman': 'SWK06', 
  'serian': 'SWK07', 'kuching': 'SWK08',
  'gombak': 'SGR01', 'petaling': 'SGR01', 'shah alam': 'SGR01', 
  'petaling jaya': 'SGR01', 'subang jaya': 'SGR01', 'puchong': 'SGR01', 
  'kajang': 'SGR01', 'bangi': 'SGR01', 'semenyih': 'SGR01', 
  'ampang': 'SGR01', 'rawang': 'SGR01', 'cyberjaya': 'SGR01', 'sepang': 'SGR01', 
  'kuala selangor': 'SGR02', 'sabak bernam': 'SGR02', 
  'klang': 'SGR03', 'banting': 'SGR03',
  'kuala terengganu': 'TRG01', 'besut': 'TRG02', 
  'hulu terengganu': 'TRG03', 'dungun': 'TRG04', 'kemaman': 'TRG04',
  'kuala lumpur': 'WLY01', 'putrajaya': 'WLY01', 'labuan': 'WLY02'
};

// State Zones Directory Data
var stateZonesData = {
  "JOHOR": [
    { name: "Pulau Aur, Pulau Pemanggil", code: "JHR01" },
    { name: "Johor Bahru, Kota Tinggi, Mersing, Kulai", code: "JHR02" },
    { name: "Kluang, Pontian", code: "JHR03" },
    { name: "Batu Pahat, Muar, Segamat, Gemas, Tangkak", code: "JHR04" }
  ],
  "KEDAH": [
    { name: "Kota Setar, Alor Setar, Kubang Pasu, Pokok Sena", code: "KDH01" },
    { name: "Kuala Muda, Sungai Petani, Yan, Pendang", code: "KDH02" },
    { name: "Padang Terap, Sik", code: "KDH03" },
    { name: "Baling", code: "KDH04" },
    { name: "Bandar Baharu, Kulim", code: "KDH05" },
    { name: "Langkawi", code: "KDH06" },
    { name: "Gunung Jerai", code: "KDH07" }
  ],
  "KELANTAN": [
    { name: "Kota Bharu, Bachok, Pasir Puteh, Tumpat, Pasir Mas, Tanah Merah, Machang, Kuala Krai, Chiku", code: "KTN01" },
    { name: "Gua Musang, Jeli, Lojing", code: "KTN02" }
  ],
  "MELAKA": [
    { name: "Melaka, Alor Gajah, Jasin, Ayer Keroh", code: "MLK01" }
  ],
  "NEGERI SEMBILAN": [
    { name: "Tampin, Jempol, Bahau", code: "NGS01" },
    { name: "Jelebu, Kuala Pilah, Rembau", code: "NGS02" },
    { name: "Port Dickson, Seremban, Nilai", code: "NGS03" }
  ],
  "PAHANG": [
    { name: "Pulau Tioman, Tioman", code: "PHG01" },
    { name: "Kuantan, Pekan, Muadzam Shah", code: "PHG02" },
    { name: "Jerantut, Temerloh, Maran, Bera, Chenor, Jengka", code: "PHG03" },
    { name: "Bentong, Lipis, Raub", code: "PHG04" },
    { name: "Genting Sempah, Janda Baik, Bukit Tinggi", code: "PHG05" },
    { name: "Cameron Highlands, Genting Highlands, Bukit Fraser", code: "PHG06" },
    { name: "Rompin, Endau", code: "PHG07" }
  ],
  "PERAK": [
    { name: "Tapah, Slim River, Tanjung Malim", code: "PRK01" },
    { name: "Kuala Kangsar, Sungai Siput, Ipoh, Batu Gajah, Kampar", code: "PRK02" },
    { name: "Lenggong, Pengkalan Hulu, Gerik", code: "PRK03" },
    { name: "Temengor, Belum", code: "PRK04" },
    { name: "Kampung Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor", code: "PRK05" },
    { name: "Selama, Taiping, Bagan Serai, Parit Buntar", code: "PRK06" },
    { name: "Bukit Larut", code: "PRK07" }
  ],
  "PERLIS": [
    { name: "Perlis, Kangar, Arau, Padang Besar", code: "PLS01" }
  ],
  "PULAU PINANG": [
    { name: "Pulau Pinang, George Town, Butterworth, Bukit Mertajam", code: "PNG01" }
  ],
  "SABAH": [
    { name: "Sandakan, Bukit Garam, Semawang, Temanggong, Tambisan, Sukau", code: "SBH01" },
    { name: "Beluran, Telupid, Pinangah, Terusan, Kuamut", code: "SBH02" },
    { name: "Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku", code: "SBH03" },
    { name: "Tawau, Balong, Merotai, Kalabakan", code: "SBH04" },
    { name: "Kudat, Kota Marudu, Pitas, Pulau Banggi", code: "SBH05" },
    { name: "Gunung Kinabalu", code: "SBH06" },
    { name: "Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan", code: "SBH07" },
    { name: "Pensiangan, Keningau, Tambunan, Nabawan", code: "SBH08" },
    { name: "Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pasia, Membakut, Weston", code: "SBH09" }
  ],
  "SARAWAK": [
    { name: "Limbang, Lawas, Sundar, Trusan", code: "SWK01" },
    { name: "Miri, Niah, Bekenu, Sibuti, Marudi", code: "SWK02" },
    { name: "Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu", code: "SWK03" },
    { name: "Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit", code: "SWK04" },
    { name: "Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai", code: "SWK05" },
    { name: "Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkilili, Betong, Spaoh, Pusa, Saratok", code: "SWK06" },
    { name: "Serian, Simunjan, Samarahan, Sebuyau, Meludam", code: "SWK07" },
    { name: "Kuching, Bau, Lundu, Sematan", code: "SWK08" },
    { name: "Kampung Patarikan", code: "SWK09" }
  ],
  "SELANGOR": [
    { name: "Gombak, Petaling, Shah Alam, Puchong, Kajang, Bangi, Semenyih, Ampang, Rawang, Cyberjaya, Sepang, Hulu Langat, Hulu Selangor", code: "SGR01" },
    { name: "Kuala Selangor, Sabak Bernam", code: "SGR02" },
    { name: "Klang, Banting, Kuala Langat", code: "SGR03" }
  ],
  "TERENGGANU": [
    { name: "Kuala Terengganu, Marang, Kuala Nerus", code: "TRG01" },
    { name: "Besut, Setiu", code: "TRG02" },
    { name: "Hulu Terengganu", code: "TRG03" },
    { name: "Dungun, Kemaman", code: "TRG04" }
  ],
  "WILAYAH PERSEKUTUAN": [
    { name: "Kuala Lumpur, Putrajaya", code: "WLY01" },
    { name: "Labuan", code: "WLY02" }
  ]
};

// Toast Notification Function
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(function() {
    toastEl.classList.remove("show");
  }, 2600);
}

// Get Current Date Parts in Malaysia Timezone
function myNowParts() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: MY_TZ, year: "numeric", month: "numeric", day: "numeric"
  });
  const p = fmt.formatToParts(new Date());
  const o = {};
  p.forEach(function(x) {
    o[x.type] = x.value;
  });
  return { y: parseInt(o.year, 10), m: parseInt(o.month, 10), d: parseInt(o.day, 10) };
}

// Format Unix Timestamp to 12-hour Time String
function fmtTime(unix) {
  try {
    return new Intl.DateTimeFormat("en-MY", {
      timeZone: MY_TZ, hour: "2-digit", minute: "2-digit", hour12: true
    }).format(new Date(unix * 1000));
  } catch (e) {
    return new Date(unix * 1000).toLocaleTimeString();
  }
}

// Format Unix Timestamp to 24-hour Short Time String
function fmtShort(unix) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: MY_TZ, hour: "2-digit", minute: "2-digit", hour12: false
    }).format(new Date(unix * 1000));
  } catch (e) {
    return "--:--";
  }
}

// Update API Connection Status Indicator
function setStatus(ok, msg) {
  apiStatusEl.classList.toggle("off", !ok);
  apiStatusText.textContent = msg;
}

// Live Clock Tick Function
function tickClock() {
  try {
    const t = new Intl.DateTimeFormat("en-GB", {
      timeZone: MY_TZ, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).format(new Date());
    const d = new Intl.DateTimeFormat("en-MY", {
      timeZone: MY_TZ, weekday: "short", day: "numeric", month: "short"
    }).format(new Date());
    clockTimeEl.textContent = t;
    clockDateEl.textContent = d + " · MYT";
  } catch (e) {}
}
setInterval(tickClock, 1000);
tickClock();

// ==========================================
// REMINDERS LOCAL STORAGE HANDLING
// ==========================================
function getRems() {
  try {
    const v = JSON.parse(localStorage.getItem("solatTimeRemindersV1") || localStorage.getItem("solattime_reminders") || "null");
    if (Array.isArray(v)) return v;
  } catch (e) {}
  return null;
}

function saveRems(r) {
  try {
    localStorage.setItem("solatTimeRemindersV1", JSON.stringify(r));
    localStorage.setItem("solatTime_reminders", JSON.stringify(r));
  } catch (e) {}
}

function seedRems() {
  return [
    { id: "r1", title: "Wudhu + prepare for Dhuhr Prayer", time: "12:30", repeat: ["Friday"], enabled: true },
    { id: "r2", title: "Read Al-Mulk after Isha", time: "20:45", repeat: ["Sunday"], enabled: true }
  ];
}

function ensureRems() {
  let r = getRems();
  if (!r) {
    r = seedRems();
    saveRems(r);
  }
  return r;
}

function renderRems() {
  const rems = ensureRems().slice().sort(function(a, b) {
    return a.time.localeCompare(b.time);
  });
  mainReminderList.innerHTML = "";
  if (!rems.length) {
    mainReminderList.innerHTML = '<div class="rem-empty" style="text-align:center; padding:20px; color:#6b6f6a;">No reminders yet. Click Manage to add one ✨</div>';
    return;
  }
  rems.forEach(function(r, idx) {
    const div = document.createElement("div");
    div.className = "rem";
    div.style.cssText = "display:flex; gap:12px; align-items:center; border-bottom:1px solid #ece4cf; padding:12px 4px;";
    
    const daysArr = r.repeat || r.days || "Friday";
    const daysString = Array.isArray(daysArr) ? daysArr.join(', ') : daysArr;

    div.innerHTML = '<div class="rem-time" style="flex:0 0 74px; text-align:center; padding:8px 6px; background:#f4f4f2; border:1px solid #dcdcd6; font-family:\'IBM Plex Mono\',monospace;"><b>' + escapeHtml(r.time) + '</b><span style="font-size:10px; text-transform:uppercase; color:#6b6f6a;">' + escapeHtml(daysString) + '</span></div>' +
      '<div class="rem-body" style="flex:1; min-width:0;"><b>' + escapeHtml(r.title) + '</b><span style="font-size:12px; color:#6b6f6a;">Repeat: ' + escapeHtml(daysString) + ' · ' + (r.enabled !== false ? "On" : "Off") + '</span></div>';

    const tg = document.createElement("button");
    tg.className = "rem-toggle" + ((r.enabled !== false) ? " on" : "");
    tg.title = "Toggle";
    tg.style.cssText = "width:42px; height:24px; border-radius:999px; border:1px solid #d8cba4; background:#e7e0cc; position:relative; cursor:pointer;";
    
    tg.addEventListener("click", function() {
      r.enabled = !(r.enabled !== false);
      const all = ensureRems();
      const f = all.find(function(x) {
        return (x.id === r.id || x === r);
      });
      if (f) f.enabled = r.enabled;
      saveRems(all);
      renderRems();
    });

    const del = document.createElement("button");
    del.className = "rem-del";
    del.textContent = "✕";
    del.title = "Delete";
    del.style.cssText = "background:#fff; border:1px solid #d8cba4; color:#6b6f6a; width:32px; height:32px; cursor:pointer;";

    (function(reminderId) {
      del.addEventListener("click", function() {
        pendingDeleteId = reminderId;
        deleteModal.style.display = 'flex';
      });
    })(r.id || idx);

    div.appendChild(tg);
    div.appendChild(del);
    mainReminderList.appendChild(div);
  });
}

confirmDeleteBtn.onclick = function() {
  if (pendingDeleteId !== null) {
    let all = ensureRems();
    all = all.filter(function(x, idx) {
      return (x.id !== pendingDeleteId && idx !== pendingDeleteId);
    });
    saveRems(all);
    renderRems();
    toast("Reminder removed");
  }
  deleteModal.style.display = 'none';
  pendingDeleteId = null;
};

cancelDeleteBtn.onclick = function() {
  deleteModal.style.display = 'none';
  pendingDeleteId = null;
};

window.addEventListener('click', function(e) {
  if (e.target === deleteModal) {
    deleteModal.style.display = 'none';
    pendingDeleteId = null;
  }
});

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
    return {
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c];
  });
}

// ==========================================
// ZONE MODAL & SEARCH FUNCTIONS
// ==========================================
function renderZoneModal(filter) {
  const q = (filter || "").trim().toLowerCase();
  modalZonesBody.innerHTML = "";
  let hasResults = false;

  Object.keys(stateZonesData).forEach(function(stateName) {
    const zonesList = stateZonesData[stateName].filter(function(z) {
      if (!q) return true;
      return (z.name.toLowerCase().includes(q) || z.code.toLowerCase().includes(q) || stateName.toLowerCase().includes(q));
    });

    if (zonesList.length > 0) {
      hasResults = true;
      const gd = document.createElement("div");
      gd.className = "state-group";
      gd.style.marginBottom = "14px";
      gd.innerHTML = "<h4>" + escapeHtml(stateName) + "</h4>";
      
      const gr = document.createElement("div");
      gr.className = "zone-grid";
      zonesList.forEach(function(z) {
        const b = document.createElement("button");
        b.className = "zone-btn" + (z.code === currentSelectedZone ? " active" : "");
        b.innerHTML = "<b>" + escapeHtml(z.name.split(',')[0]) + "</b><span>" + escapeHtml(z.name) + "</span><code>" + escapeHtml(z.code) + "</code>";
        b.addEventListener("click", function() {
          selectZone(z.code, z.name.split(',')[0], stateName);
          locationModal.classList.remove("open");
        });
        gr.appendChild(b);
      });
      gd.appendChild(gr);
      modalZonesBody.appendChild(gd);
    }
  });

  if (!hasResults) {
    modalZonesBody.innerHTML = '<div class="skeleton">No zones match “' + escapeHtml(filter) + '”.</div>';
  }
}

function findZoneBySearch(stateQ, cityQ) {
  const sq = (stateQ || "").trim().toLowerCase();
  const cq = (cityQ || "").trim().toLowerCase();
  const codeQ = (cq || sq).toUpperCase().replace(/\s/g, "");

  for (let state in stateZonesData) {
    for (let z of statlocationTitleeZonesData[state]) {
      if (z.code.toUpperCase() === codeQ) {
        return { zone: z, state: state, city: z.name.split(',')[0] };
      }
    }
  }

  if (cq && malaysiaZones[cq]) {
    const code = malaysiaZones[cq];
    for (let state in stateZonesData) {
      for (let z of stateZonesData[state]) {
        if (z.code === code) {
          return { zone: z, state: state, city: cq.toUpperCase() };
        }
      }
    }
  }

  for (let key in malaysiaZones) {
    if ((cq && key.includes(cq)) || (sq && key.includes(sq))) {
      const code = malaysiaZones[key];
      for (let state in stateZonesData) {
        for (let z of stateZonesData[state]) {
          if (z.code === code) {
            return { zone: z, state: state, city: key.toUpperCase() };
          }
        }
      }
    }
  }
  return null;
}

async function selectZone(code, cityName, stateName) {
  currentSelectedZone = code;
  currentStateName = stateName;
  currentDaerahName = cityName;

  stateInput.value = currentStateName;
  cityInput.value = currentDaerahName;

  try {
    localStorage.setItem("solatTimeZoneV1", JSON.stringify({ code: currentSelectedZone, city: cityName, state: stateName }));
  } catch (e) {}

  updateHeader(cityName);
  await loadPrayerMonth();
}

function updateHeader(cityName) {
  const dispCity = String(cityName || "").toUpperCase();
  const dispState = String(currentStateName || "").toUpperCase();
  Text.innerHTML = escapeHtml(dispCity) + ', <span class="gold">' + escapeHtml(dispState) + '</span>';
  zoneCodeEl.textContent = currentSelectedZone || "—";
  zoneHintEl.innerHTML = '💡 Current: <b>' + escapeHtml(currentSelectedZone) + '</b> — ' + escapeHtml(currentDaerahName) + '.';
  
  try {
    const hij = new Intl.DateTimeFormat("en-MY-u-ca-islamic", {
      timeZone: MY_TZ, day: "numeric", month: "long", year: "numeric"
    }).format(new Date());
    hijriEl.textContent = hij;
  } catch (e) {
    hijriEl.textContent = "—";
  }

  try {
    gregEl.textContent = new Intl.DateTimeFormat("en-MY", {
      timeZone: MY_TZ, weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(new Date());
  } catch (e) {}
}

// ==========================================
// FETCH PRAYER TIMES FROM API
// ==========================================
async function loadPrayerMonth() {
  if (!currentSelectedZone) return;
  const { y, m } = myNowParts();
  setStatus(true, "Live API Connected");
  apiStatusText.textContent = "Syncing…";
  prayerCardsGrid.innerHTML = '<div class="skeleton" style="grid-column:1/-1">✨ Syncing live times for ' + escapeHtml(currentSelectedZone) + '…</div>';

  try {
    const url = "https://api.waktusolat.app/v2/solat/" + encodeURIComponent(currentSelectedZone);
    const res = await fetch(url);
    if (!res.ok) throw new Error("solat " + res.status);
    const j = await res.json();
    if (!j || !Array.isArray(j.prayers) || !j.prayers.length) throw new Error("empty prayers");
    
    monthData = { year: j.year || y, month: j.month_number || m, monthName: j.month || "", prayers: j.prayers };
    setStatus(true, "Live API Connected");
    renderAll();
  } catch (e) {
    setStatus(false, "Offline — showing estimate");
    monthData = buildFallbackMonth(y, m);
    renderAll();
    toast("Offline — showing estimated times");
  }
}

function buildFallbackMonth(y, m) {
  const days = new Date(y, m, 0).getDate();
  const base = { imsak: "05:40", fajr: "05:50", syuruk: "07:00", dhuhr: "13:10", asr: "16:30", maghrib: "19:20", isha: "20:30" };
  const toUnix = function(day, hm) {
    const parts = hm.split(":").map(Number);
    const H = parts[0];
    const M = parts[1];
    return Math.floor(Date.UTC(y, m - 1, day, H - 8, M, 0) / 1000);
  };
  const prayers = [];
  for (let d = 1; d <= days; d++) {
    prayers.push({
      day: d, hijri: "—",
      imsak: toUnix(d, base.imsak), fajr: toUnix(d, base.fajr),
      syuruk: toUnix(d, base.syuruk), dhuha: toUnix(d, "07:25"),
      dhuhr: toUnix(d, base.dhuhr), asr: toUnix(d, base.asr),
      maghrib: toUnix(d, base.maghrib), isha: toUnix(d, base.isha)
    });
  }
  return { year: y, month: m, monthName: "", prayers };
}

// ==========================================
// RENDER UI & DATA
// ==========================================
function renderAll() {
  if (!monthData) return;
  const { d } = myNowParts();
  const todayObj = monthData.prayers.find(function(p) {
    return p.day === d;
  }) || monthData.prayers[0];
  
  const order = PRAYERS.map(function(p) {
    return { def: p, unix: todayObj[p.key] };
  });
  const nowSec = Math.floor(Date.now() / 1000);
  
  let nextIdx = order.findIndex(function(o) {
    return o.unix > nowSec;
  });
  let isTomorrow = false, tomorrowFajr = null;
  
  if (nextIdx === -1) {
    const tom = monthData.prayers.find(function(p) {
      return p.day === d + 1;
    });
    if (tom) { tomorrowFajr = tom.fajr; }
    nextIdx = 0;
    isTomorrow = true;
  }
  todayPrayer = { order, todayObj, nextIdx, isTomorrow, tomorrowFajr };

  try { syurukMiniEl.textContent = fmtTime(todayObj.syuruk); } catch (e) {}
  
  const niceDay = new Intl.DateTimeFormat("en-MY", {
    timeZone: MY_TZ, weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());
  
  todayLineEl.textContent = niceDay + " · " + currentDaerahName;
  todayPillEl.textContent = "Today · Day " + todayObj.day;
  
  const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthPillEl.textContent = (monthNames[monthData.month] || ("Month " + monthData.month)) + " " + monthData.year;
  monthlyTableHeading.textContent = "Monthly Prayer Timetable — " + (monthNames[monthData.month] || "") + " " + monthData.year;

  renderCards(nowSec);
  renderTable(d);
  startCountdown();
  
  const nxt = order[nextIdx];
  nextNameEl.textContent = nxt.def.name;
  nextIconEl.textContent = nxt.def.icon;
  nextTimeEl.textContent = isTomorrow && tomorrowFajr ? fmtTime(tomorrowFajr) + " (tmr)" : fmtTime(nxt.unix);
}

function renderCards(nowSec) {
  prayerCardsGrid.innerHTML = "";
  const { order, nextIdx, isTomorrow } = todayPrayer;
  
  order.forEach(function(o, idx) {
    const isNext = idx === nextIdx;
    const isDone = !isTomorrow && o.unix <= nowSec;
    const card = document.createElement("div");
    card.className = "prayer-card" + (isNext ? " active-next" : "");
    
    let state = "Upcoming";
    if (isNext) state = isTomorrow ? "Tomorrow" : "Next";
    else if (isDone) state = "Done ✓";

    card.innerHTML = '<div class="pc-top" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">' +
      '<div class="pc-icon" style="font-size:22px;">' + o.def.icon + '</div>' +
      '<div class="pc-state" style="' + (isNext ? 'display:block; font-size:10px; font-weight:800; letter-spacing:1.2px; text-transform:uppercase; padding:4px 8px; background:#10b981; color:#fff;' : 'display:none;') + '">' + state + '</div>' +
    '</div>' +
    '<h4 style="margin:0 0 8px 0; font-size:13px; color:#64748b; text-transform:uppercase; font-weight:800;">' + o.def.name + '</h4>' +
    '<div class="time-display" style="margin:0; font-size:28px; font-weight:800; color:#1b4332;">' + escapeHtml(fmtShort(o.unix)) + '</div>';
    
    prayerCardsGrid.appendChild(card);
  });
}

function renderTable(todayDay) {
  monthlyTableBody.innerHTML = "";
  monthData.prayers.forEach(function(p) {
    const tr = document.createElement("tr");
    if (p.day === todayDay) tr.className = "today-row";
    
    tr.innerHTML = '<td><strong>' + p.day + '</strong> ' + (p.day === todayDay ? '(Today)' : '') + '</td>' +
      '<td>' + escapeHtml(fmtShort(p.imsak)) + '</td>' +
      '<td>' + escapeHtml(fmtShort(p.fajr)) + '</td>' +
      '<td>' + escapeHtml(fmtShort(p.syuruk)) + '</td>' +
      '<td>' + escapeHtml(fmtShort(p.dhuhr)) + '</td>' +
      '<td>' + escapeHtml(fmtShort(p.asr)) + '</td>' +
      '<td>' + escapeHtml(fmtShort(p.maghrib)) + '</td>' +
      '<td>' + escapeHtml(fmtShort(p.isha)) + '</td>';
    monthlyTableBody.appendChild(tr);
  });
}

// ==========================================
// COUNTDOWN TIMER LOGIC
// ==========================================
function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);
  const tick = function() {
    if (!todayPrayer) return;
    const nowSec = Math.floor(Date.now() / 1000);
    const { order, nextIdx, isTomorrow, tomorrowFajr, todayObj } = todayPrayer;
    
    let prevUnix, nextUnix, nextDef;
    if (!isTomorrow) {
      nextDef = order[nextIdx].def;
      nextUnix = order[nextIdx].unix;
      prevUnix = nextIdx > 0 ? order[nextIdx - 1].unix : (todayObj.fajr - 6 * 3600);
    } 
    else {
      nextDef = order[0].def;
      nextUnix = tomorrowFajr || (order[order.length - 1].unix + 8 * 3600);
      prevUnix = order[order.length - 1].unix;
    }
    
    if (!isTomorrow && nextUnix <= nowSec) { renderAll(); return; }
    if (isTomorrow && tomorrowFajr && tomorrowFajr <= nowSec) { loadPrayerMonth(); return; }
    
    const remain = Math.max(0, nextUnix - nowSec);
    const total = Math.max(1, nextUnix - prevUnix);
    const elapsed = Math.min(total, Math.max(0, nowSec - prevUnix));
    const pct = Math.round(elapsed / total * 100);

    const h = String(Math.floor(remain / 3600)).padStart(2, "0");
    const m = String(Math.floor(remain % 3600 / 60)).padStart(2, "0");
    const s = String(remain % 60).padStart(2, "0");

    calcLabelEl.textContent = isTomorrow ? "Next prayer · tomorrow" : "Next prayer · today";
    calcNameEl.textContent = nextDef.name + " " + nextDef.icon;
    calcTimerEl.innerHTML = h + " <span>:</span> " + m + " <span>:</span> " + s;
    heroCountdownEl.textContent = h + ":" + m + ":" + s;
    calcBarEl.style.width = pct + "%";
    calcFromEl.textContent = "Now";
    calcToEl.textContent = nextDef.name + " at " + fmtTime(nextUnix);
  };
  tick();
  countdownTimer = setInterval(tick, 1000);
}

// Event Listeners for Modal & Search
openLocationModalBtn.onclick = function() {
  locationModal.classList.add("open");
  renderZoneModal(modalSearchInput.value);
};

closeModalBtn.onclick = function() {
  locationModal.classList.remove("open");
};

window.onclick = function(e) {
  if (e.target === locationModal) {
    locationModal.classList.remove("open");
  }
};

let searchDeb = null;
modalSearchInput.addEventListener("input", function() {
  clearTimeout(searchDeb);
  searchDeb = setTimeout(function() {
    renderZoneModal(modalSearchInput.value);
  }, 160);
});

searchBtn.onclick = doSearch;
[stateInput, cityInput].forEach(function(inp) {
  inp.addEventListener("keydown", function(e) {
    if (e.key === "Enter") doSearch();
  });
});

function doSearch() {
  const res = findZoneBySearch(stateInput.value, cityInput.value);
  if (!res) {
    toast("No zone found — try a zone code like JHR02 or city like Shah Alam");
    return;
  }
  selectZone(res.zone.code, res.city, res.state);
  toast("📍 Switched to " + res.zone.code + " — " + res.city);
}

window.addEventListener('focus', renderRems);

// Initialization Function
async function init() {
  renderRems();
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem("solatTimeZoneV1") || "null");
  } catch (e) {}

  if (saved && saved.code) {
    currentSelectedZone = saved.code;
    currentStateName = saved.state || "Selangor";
    currentDaerahName = saved.city || "Shah Alam";
    stateInput.value = currentStateName;
    cityInput.value = currentDaerahName;
    updateHeader(currentDaerahName);
    await loadPrayerMonth();
  } 
  else {
    selectZone("SGR01", "Shah Alam", "SELANGOR");
  }
  renderZoneModal("");
}
init();