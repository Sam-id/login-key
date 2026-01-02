// --- 1. INITIAL DATABASE (Agar tidak error saat di-loop) ---
if (!window.cyberNews) window.cyberNews = [];
if (!window.communityQuests) {
    window.communityQuests = [
        {
            id: "q01",
            target: "Gov_Archive",
            ip: "10.0.8.5",
            desc: "Bocorkan data dokumen di server pemerintah (10.0.8.5).",
            reward: 0.15
        },
        {
            id: "q02",
            target: "Dark_Vault",
            ip: "6.6.6.1",
            desc: "Ambil database dari Shadow Market untuk kita dekripsi.",
            reward: 0.35
        }
    ];
}

// --- 2. FUNGSI UTAMA RENDER CYBERGRAM ---
function renderCyberGram() {
    const content = document.querySelector('#win-social .win-content');
    if (!content) return;

    const state = window.CyberGame.state;

    // FIX BUG: Jika userProfile belum ada di Save Data lama
    if (!state.userProfile) {
        state.userProfile = {
            username: state.user || "ANON",
            bio: "Digital Ghost | System Breaker",
            badges: ["Seed_Member"]
        };
        window.CyberGame.save();
    }

    const p = state.userProfile;
    
    // Tampilan Header Profil
    let html = `
        <div style="background:#111; padding:15px; border-bottom:1px solid var(--neon); margin-bottom:15px;">
            <div style="display:flex; gap:15px; align-items:center;">
                <div style="width:50px; height:50px; background:#222; border:1px solid var(--neon); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px;">👤</div>
                <div>
                    <h3 style="margin:0; color:var(--neon);">${p.username}</h3>
                    <div style="font-size:10px; color:gold;">LVL ${state.level || 1} • ${(p.badges || []).map(b => `[${b}]`).join(' ')}</div>
                </div>
            </div>
            <p style="font-size:11px; color:gray; margin-top:10px;">${p.bio}</p>
        </div>
    `;

    // --- BAGIAN BERITA (NEWS FEED) ---
    html += '<h3 style="color:cyan; font-size:12px; padding:0 10px;">[ NEWS_FEED ]</h3>';
    if (window.cyberNews.length === 0) {
        html += '<p style="padding:10px; font-size:11px; color:gray; text-align:center;">Belum ada berita viral saat ini.</p>';
    } else {
        window.cyberNews.forEach(news => {
            html += `
                <div style="padding:10px; border-bottom:1px solid #222; font-size:11px;">
                    <b style="color:var(--neon);">@${news.author}:</b> ${news.content}
                </div>`;
        });
    }

    // --- BAGIAN PESAN MASUK (QUESTS) ---
    html += '<h3 style="color:var(--neon); font-size:12px; margin-top:20px; padding:0 10px;">[ DIRECT_MESSAGES ]</h3>';
    (window.communityQuests || []).forEach(m => {
        html += `
            <div style="background:#0a0a0a; border:1px solid #333; padding:10px; margin:10px; position:relative; border-left: 3px solid var(--neon);">
                <div style="font-size:11px; font-weight:bold; color:var(--neon);">FROM: Anonymous_Shadow</div>
                <div style="font-size:12px; margin:5px 0; color:#eee;"><b>Target:</b> ${m.target}<br>${m.desc}</div>
                <button onclick="acceptQuest('${m.id}')" style="width:100%; background:var(--neon); color:black; border:none; padding:8px; cursor:pointer; font-weight:bold; font-family:inherit; margin-top:5px;">ACCEPT MISSION</button>
            </div>`;
    });

    content.innerHTML = html;
}

// --- 3. LOGIKA MISI & NEWS ---
window.acceptQuest = function(id) {
    const quest = window.communityQuests.find(q => q.id === id);
    const state = window.CyberGame.state;

    if (state.activeMissions.some(m => m.id === id)) {
        return showAlert("INFO", "Misi sudah aktif di terminal.");
    }

    state.activeMissions.push(quest);
    window.CyberGame.save();
    showAlert("CYBER_GRAM", "Misi Diterima! Cek terminal.");
};

function triggerViralNews(author, content) {
    window.cyberNews.unshift({ author, content });
    if (window.cyberNews.length > 5) window.cyberNews.pop(); // Batasi 5 berita saja
    renderCyberGram();
}


function addExperience(amount) {
    let profile = window.CyberGame.state.userProfile;
    profile.exp += amount;

    // Logika naik level (setiap 100 EXP)
    if (profile.exp >= profile.level * 100) {
        profile.level++;
        showAlert("LEVEL UP", `Sekarang kamu Level ${profile.level}!`);
        
        // Cek Badge Otomatis
        if (profile.level === 5) profile.badges.push("Script_Kiddie");
        if (profile.level === 10) profile.badges.push("Cyber_Phantom");
    }
    window.Cyber
      Game.save();
}
