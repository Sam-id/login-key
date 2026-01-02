/**
 * CYBER-OS ENGINE
 * Sutradara Utama: Mengatur UI, Jendela, dan Alur Aplikasi
 */
let topZIndex = 2000;

// 1. FUNGSI PEMBERSIH (Agar tidak bertumpuk)
function closeAllOthers() {
    document.querySelectorAll('.window').forEach(win => {
        win.style.display = 'none';
    });
    const grid = document.querySelector('.app-grid');
    if(grid) grid.style.display = 'none';
}

// 2. FUNGSI BUKA JENDELA (VERSI BERSIH & FIX)
// 2. FUNGSI BUKA JENDELA (VERSI BERSIH)
function openWin(id) {
    console.log("Membuka jendela: " + id);
    
    let win = document.getElementById(id);
    if (!win) win = document.getElementById('win-' + id);

    if (win) {
        closeAllOthers(); 
        win.style.display = 'flex';
        win.style.zIndex = topZIndex + 1;
        
        // Logika Render Otomatis
        if (id.includes('inventory')) {
            if (typeof renderInventory === 'function') renderInventory();
        } 
        else if (id.includes('mining')) {
            if (typeof renderMiner === 'function') renderMiner();
        } 
        else if (id.includes('market')) {
            if (typeof renderMarket === 'function') renderMarket();
        } else if (id.includes('social')) {
            try {
                if (typeof renderCyberGram === 'function') {
                    renderCyberGram();
                } else {
                    console.log("Fungsi render belum siap");
                }
            } catch (e) {
                alert("Error CyberGram: " + e.message); // Muncul notif di HP kalau ada error
            }
        }

        else if (id.includes('browser')) {
            // Jika browser dibuka, kita tampilkan halaman utama atau halaman yang sedang diakses
            if (typeof renderBrowser === 'function') {
                renderBrowser(); 
            } else if (typeof showSearchHome === 'function') {
                showSearchHome();
            }
        }

        if (id.includes('terminal')) {
            setTimeout(() => {
                const input = document.getElementById('cmd-input');
                if(input) input.focus();
            }, 100);
        }
    } else {
        console.error("Jendela TIDAK DITEMUKAN untuk ID: " + id);
    }
}


// 3. FUNGSI TUTUP JENDELA
function closeWin(id) {
    let win = document.getElementById(id);
    if (!win) win = document.getElementById('win-' + id);
    
    if (win) {
        win.style.display = 'none';
        const grid = document.querySelector('.app-grid');
        if(grid) grid.style.display = 'grid'; 
    }
}

// 4. SISTEM ALERT (Custom)
window.showAlert = function(title, message, isError = false) {
    const modal = document.getElementById('custom-alert');
    if (modal) {
        document.getElementById('alert-title').innerText = `[${title}]`;
        document.getElementById('alert-msg').innerText = message;
        modal.style.display = 'flex';
        modal.style.zIndex = 99999;
    }
};

window.closeAlert = () => {
    document.getElementById('custom-alert').style.display = 'none';
};

// 5. PENYUSUNAN IKON (GRID)
function initIcons() {
    const icons = document.querySelectorAll('.app-icon');
    icons.forEach(el => {
        el.style.left = "auto";
        el.style.top = "auto";
        el.style.position = "relative";
        el.style.cursor = "pointer";
        el.style.pointerEvents = "auto";

        el.onclick = function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            openWin(target);
        };
    });
}

// 6. BOOTSTRAP
window.onload = () => {
    if(window.CyberGame && window.CyberGame.syncUI) {
        window.CyberGame.syncUI();
    }
    initIcons();
};

// --- GLOBAL EXPORT (Agar tombol HTML bisa mengenali fungsi) ---
window.openWin = openWin;
window.closeWin = closeWin;

// Cek apakah fungsi browser ada sebelum di-export
if (typeof searchEngine === 'function') window.searchEngine = searchEngine;
if (typeof openSite === 'function') window.openSite = openSite;
function renderMarket() {
    const content = document.querySelector('#win-market .win-content');
    // Cek apakah elemen dan data ada sebelum render
    if (!content || !window.CyberGame || !window.CyberGame.databases) return;

    const items = window.CyberGame.databases.shop;
    let html = `<div style="padding:10px;">
        <div style="background:#111; padding:15px; border:1px solid var(--neon); margin-bottom:15px; text-align:center;">
            <span style="color:gold; font-size:18px;">${window.CyberGame.state.btc.toFixed(4)} BTC</span>
        </div>`;

    items.forEach(item => {
        html += `
            <div style="border:1px solid #333; padding:12px; margin-bottom:10px; background:#050505;">
                <b style="color:var(--neon); font-size:14px;">${item.name}</b>
                <div style="font-size:12px; color:#aaa;">${item.desc}</div>
                <button onclick="buyItem('${item.id}', ${item.price})" class="buy-btn" style="width:100%; margin-top:5px; font-size:13px;">BELI (${item.price})</button>
            </div>`;
    });
    content.innerHTML = html + '</div>';
}
window.renderMarket = renderMarket;
function renderMiner() {
    const display = document.getElementById('miner-display');
    if (!display) return;

    const gameData = window.CyberGame.state;
    
    // AMBIL DATA LANGSUNG DARI SUMBERNYA
    const isMining = gameData.hardware.isMining;
    const btcValue = Number(gameData.btc) || 0;
    const tempValue = Number(gameData.hardware.temp) || 30;
    
    // INI DIA: Ambil hashrate langsung dari hardware
    const hashValue = Number(gameData.hardware.hashrate) || 0;

    display.innerHTML = `
        <div style="text-align:center;">
            <div style="margin-bottom: 20px; display: flex; justify-content: center;">
                <svg width="80" height="80" viewBox="0 0 24 24" class="${isMining ? 'mining-spin' : ''}" style="transition: 0.5s;">
                    <path fill="${isMining ? '#00ff41' : '#333'}" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.97 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.97 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                </svg>
            </div>

            <div style="border:1px solid #333; padding:15px; background:rgba(0,0,0,0.5); border-radius:8px;">
                <h2 style="margin:0; color:${isMining ? '#00ff41' : 'gray'}; font-size:16px;">
                    ${isMining ? 'SYSTEM_ONLINE' : 'SYSTEM_OFFLINE'}
                </h2>
                <hr style="border-color:#222; margin:10px 0;">
                <p style="font-size:14px;">Temp: <span style="color:${tempValue > 75 ? 'red' : '#00ff41'}">${tempValue.toFixed(1)}</span>°C</p>
                
                <p style="font-size:14px;">Hash: <span style="color:#00ff41">${isMining ? hashValue.toFixed(1) : '0.0'}</span> MH/s</p>
                
                <div style="font-size:18px; color:gold; font-weight:bold; margin-top:10px;">${btcValue.toFixed(6)} BTC</div>
            </div>

            <button class="buy-btn" onclick="toggleMining()" 
                    style="width:100%; margin-top:15px; height:50px; background:${isMining ? '#ff3131' : '#00ff41'}; color:#000; font-weight:bold;">
                ${isMining ? 'STOP_MINING' : 'START_MINING'}
            </button>
        </div>
    `;
}


// Fungsi Nyalakan/Matikan Mining
function toggleMining() {
    const hw = window.CyberGame.state.hardware;
    hw.isMining = !hw.isMining;
    window.CyberGame.save();
    renderMiner();
    
    if(hw.isMining) {
        showAlert("SYSTEM", "Mining Started...");
    }
}

// --- MESIN OTOMATIS (TARUH DI ENGINE.JS PALING BAWAH) ---
setInterval(() => {
    if (!window.CyberGame || !window.CyberGame.state) return;

    const state = window.CyberGame.state;

    if (state.hardware.isMining) {
        // PERBAIKAN NaN: Pastikan hashrate ada nilainya
        const hashrate = state.hardware.hashrate || 1.5;
        const pendapatan = hashrate / 1000000;
        
        state.btc = (Number(state.btc) || 0) + pendapatan;

        // Simpan Data
        window.CyberGame.save();

        // PERBAIKAN STYLE ERROR: Gunakan Optional Chaining (?.) 
        // Agar jika jendela 'win-mining' tidak ada, dia tidak bikin macet.
        const minerWin = document.getElementById('win-mining');
        if (minerWin && minerWin.style.display === 'flex') {
            if (typeof renderMiner === 'function') renderMiner();
        }

        console.log("Mining... + " + pendapatan.toFixed(8));
    }
}, 1000);

// --- MESIN OTOMATIS PENAMBAH BTC (VERSI ANTI-NAN) ---
setInterval(() => {
    if (!window.CyberGame || !window.CyberGame.state) return;

    const state = window.CyberGame.state;

    if (state.hardware.isMining) {
        // 1. Pastikan Hashrate adalah angka, kalau error kasih default 1.5
        const currentHashrate = Number(state.hardware.hashrate) || 1.5;
        
        // 2. Hitung pendapatan
        const pendapatan = currentHashrate / 1000000;

        // 3. Paksa state.btc jadi angka sebelum dijumlahkan (Mencegah NaN)
        const btcLama = Number(state.btc) || 0;
        state.btc = btcLama + pendapatan;

        // 4. Update Suhu (Pastikan angka juga)
        const tempLama = Number(state.hardware.temp) || 30;
        state.hardware.temp = Math.min(95, tempLama + 0.1);

        // 5. Simpan & Sync UI
        window.CyberGame.save();
        
        // Update Bar Atas
        if (typeof window.CyberGame.syncUI === 'function') {
            window.CyberGame.syncUI();
        }
        
        // 6. Update Jendela Miner (Gunakan pengecekan ID yang aman)
        const minerWin = document.getElementById('win-mining');
        if (minerWin && minerWin.style.display === 'flex') {
            if (typeof renderMiner === 'function') {
                renderMiner();
            }
        }
        
        console.log("Mining Running... BTC: " + state.btc.toFixed(8));
    } else {
        // Proses pendinginan saat OFF
        const tempLama = Number(state.hardware.temp) || 30;
        state.hardware.temp = Math.max(30, tempLama - 0.2);
        
        // Tetap simpan suhu yang turun
        window.CyberGame.save();
    }
}, 1000);

function renderInventory() {
    const display = document.getElementById('inventory-display');
    if (!display) return;

    const game = window.CyberGame.state;
    const inventory = game.inventory || [];
    const graphics = window.CyberGame.itemGraphics || {}; // Ambil dari tempat kamu menyimpannya

    if (inventory.length === 0) {
        display.innerHTML = '<div style="text-align:center; color:gray; padding:20px;">Inventory Kosong</div>';
        return;
    }

    let html = '<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; padding:10px;">';
    
    inventory.forEach((itemId, index) => {
        // Cari gambar berdasarkan ID, jika tidak ada pakai gambar default
        const imgUrl = graphics[itemId] || 'https://cdn-icons-png.flaticon.com/512/860/860824.png';
        
        html += `
            <div style="border:1px solid #333; padding:5px; text-align:center; background:#111; cursor:pointer;" onclick="useItem('${itemId}')">
                <img src="${imgUrl}" style="width:100%; max-width:40px; margin-bottom:5px;">
                <div style="font-size:9px; color:var(--neon); text-transform:uppercase;">${itemId.replace('_', ' ')}</div>
            </div>`;
    });
    
    html += '</div>';
    display.innerHTML = html;
}


// Fungsi untuk menampilkan detail item saat diklik
function showItemDetail(itemId, quantity) {
    const detailPanel = document.getElementById('inventory-detail-panel');
    if (!detailPanel) return;

    const shopItems = window.CyberGame.databases.shop;
    const itemInfo = shopItems.find(s => s.id === itemId) || { name: itemId, desc: 'Tidak dikenal', price: 0 };
    const sellPrice = (itemInfo.price * 0.7).toFixed(4); // Harga jual 70%

    detailPanel.innerHTML = `
        <div style="text-align: center; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;">
            <h3 style="color: var(--neon); margin-top: 0;">${itemInfo.name}</h3>
            <p style="font-size: 12px; color: white;">${itemInfo.desc}</p>
            <p style="font-size: 12px; color: gray;">Jumlah: ${quantity}</p>
            <div style="margin-top: 10px;">
                ${itemId === 'cleaner' ? `<button class="btn-inventory-action" onclick="useItem('${itemId}')">Gunakan</button>` : ''}
                
                <button class="btn-inventory-action" onclick="sellItem('${itemId}', ${sellPrice})">Jual (${sellPrice} BTC)</button>
            </div>
        </div>
    `;
}

function setTheme(themeName) {
    const root = document.documentElement;
    
    if (themeName === 'matrix') {
        root.setAttribute('data-theme', 'matrix');
    } else {
        root.removeAttribute('data-theme'); // Kembali ke Classic Neon
    }

    // Simpan ke database game agar permanen
    // Cek tema yang tersimpan di save data
if (window.CyberGame.state.activeTheme === 'matrix') {
    document.documentElement.setAttribute('data-theme', 'matrix');
}

    window.CyberGame.state.activeTheme = themeName;
    window.CyberGame.save();
    
    console.log("Theme switched to: " + themeName);
}

// Pastikan fungsi ini bisa dipanggil dari HTML
window.setTheme = setTheme;


function devAddMoney() {
    window.CyberGame.state.btc += 1.0;
    window.CyberGame.save();
    showAlert("DEV_MODE", "Added 1.0 BTC. Saldo sekarang: " + window.CyberGame.state.btc.toFixed(4));
}
window.devAddMoney = devAddMoney;

// Daftarkan ulang semua agar global
window.renderInventory = renderInventory;
window.showItemDetail = showItemDetail;
window.renderMiner = renderMiner;
window.toggleMining = toggleMining;
window.openWin = openWin;
window.closeWin = closeWin;
initIcons(); // Jalankan paksa saat script dimuat

