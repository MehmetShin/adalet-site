document.title = 'Türkiyem Adalet Gaming | Kaliteli Askerî & Polisiye Roleplay';
const SERVER_IP = '178.32.203.118:22003';

const FACTIONS = {
    tsk: {
        code: 'BIRIM // TSK-01',
        title: 'TÜRK SİLAHLI KUVVETLERİ',
        shortSub: 'Özel Kuvvetler, Kara, Hava ve Deniz Kuvvetleri Komutanlığı sınır ve sınır ötesi operasyon gücü.',
        desc: 'Kara, Hava ve Deniz Kuvvetleri Komutanlığı ile Özel Kuvvetler (Bordo Bereliler) unsurlarından oluşan en üst düzey askerî güç. Sınır güvenliği, hava taarruz operasyonları ve ağır zırhlı tugay sevkiyatlarını yönetir.',
        poster: '/tsk.png',
        accent: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.32)',
        readiness: '%100 TAM KADRO AKTİF',
        tags: ['[TSK]', '[TKK]', '[THK]', '[TDK]'],
        stats: [99, 96, 100],
        subunits: [
            { name: 'Kara Kuvvetleri Kom.', tag: '[TKK]', desc: 'Zırhlı Tugay, Komando ve Sınır Birlikleri' },
            { name: 'Hava Kuvvetleri Kom.', tag: '[THK]', desc: 'Hava Taarruz, F-16 & Helikopter Filoları' },
            { name: 'Deniz Kuvvetleri Kom.', tag: '[TDK]', desc: 'SAT / SAS Komandoları ve Sahil Güvenlik' },
            { name: 'Özel Kuvvetler (ÖKK)', tag: '[TSK]', desc: 'Bordo Bereliler Nokta Operasyon Timi' }
        ]
    },
    jgk: {
        code: 'BIRIM // JGK-02',
        title: 'JANDARMA GENEL KOMUTANLIĞI',
        shortSub: 'JÖH, JÖAK, Jandarma Havacılık ve Kırsal/Otoyol Asayiş Komutanlığı.',
        desc: 'Kırsal bölgelerde, dağlık arazilerde ve stratejik otoyol güzergahlarında kanun hâkimiyetini sağlayan, Jandarma Özel Harekat (JÖH) ve Jandarma Havacılık unsurlarıyla yüksek hareket kabiliyetine sahip kolluk kuvveti.',
        poster: '/jgk.png',
        accent: '#06b6d4',
        glow: 'rgba(6, 182, 212, 0.32)',
        readiness: 'OPERASYONA HAZIR',
        tags: ['[JGK]', '[JÖH]', '[JHK]'],
        stats: [96, 94, 99],
        subunits: [
            { name: 'Jandarma Özel Harekat', tag: '[JÖH]', desc: 'Yüksek Riskli Kırsal & Meskun Mahal Timi' },
            { name: 'Jandarma Havacılık', tag: '[JHK]', desc: 'S-70 Blackhawk & ATAK Hava Destek Filosu' },
            { name: 'Jandarma Asayiş & Trafik', tag: '[JGK]', desc: 'Bölge Devriye, Nokta Kontrol ve Güvenlik' },
            { name: 'JÖAK Operasyon', tag: '[JGK]', desc: 'Jandarma Özel Asayiş ve Kurtarma Birimi' }
        ]
    },
    egm: {
        code: 'BIRIM // EGM-03',
        title: 'EMNİYET GENEL MÜDÜRLÜĞÜ',
        shortSub: 'Polis Özel Harekat (PÖH), Cumhurbaşkanlığı Koruma (CAT), Yunus, TEM ve Asayiş.',
        desc: 'Şehir içi güvenliği, yüksek riskli rehine kurtarma ve baskın operasyonlarını, VIP devlet büyükleri eskort görevlerini ve organize suçlarla mücadeleyi yürüten merkezî teşkilat.',
        poster: '/egm.png',
        accent: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.34)',
        readiness: '7/24 ŞEHİR DEVRİYESİ',
        tags: ['[EGM]', '[PÖH]', '[EGM-CAT]'],
        stats: [95, 92, 98],
        subunits: [
            { name: 'Polis Özel Harekat', tag: '[PÖH]', desc: 'Börü & Şahin Timi Ağır Baskın Operasyonları' },
            { name: 'Cumhurbaşkanlığı Koruma', tag: '[EGM-CAT]', desc: 'Counter Attack Team & Makam Eskort Birimi' },
            { name: 'Asayiş & Yunus Timleri', tag: '[EGM]', desc: 'Şehir İçi Hızlı Müdahale ve Motosikletli Tim' },
            { name: 'TEM & Trafik Denetleme', tag: '[EGM]', desc: 'Terörle Mücadele ve Otoyol Denetim Şube' }
        ]
    },
    cetin: {
        code: 'YAPILANMA // CTN-04',
        title: 'ÇETİN AŞİRETİ',
        shortSub: 'Sadakat, konvoy gücü, bölge hakimiyeti ve yeraltı ticaret ağı.',
        desc: 'Geleneksel aşiret hiyerarşisini modern yeraltı operasyonlarıyla birleştiren en büyük sivil/gayrimeşru güç. Özel zırhlı makam konvoyları, malikane savunması ve stratejik bölge savaşlarında söz sahibidir.',
        poster: '/cetin.png',
        accent: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.32)',
        readiness: 'KONVOY & HAKİMİYET AKTİF',
        tags: ['[CTN]', 'AŞİRET MECLİSİ', 'KONVOY'],
        stats: [94, 90, 95],
        subunits: []
    }
};

const STEPS_DATA = {
    1: {
        kicker: 'ADIM 01 // İSTEMCİ KURULUMU',
        title: 'MULTI THEFT AUTO (MTA:SA) KURULUMU',
        desc: 'Bilgisayarında temiz bir <strong>GTA: San Andreas</strong> kurulu olduğundan emin ol, ardından resmi <strong>MTA:SA</strong> istemcisini indirip kur. Sunucumuz tüm güncel Windows sürümleriyle %100 uyumludur.',
        code: 'connect 178.32.203.118:22003',
        actionsHtml: `
            <a href="https://mirror-cdn.multitheftauto.com/mtasa/main/mtasa-1.6.exe" target="_blank" rel="noopener" class="btn btn-glass">
                <i class="fa-solid fa-download"></i>
                <span>MTA:SA İNDİR</span>
            </a>
            <a href="https://download2389.mediafire.com/ujzns4iwy6sgnqGFMVcjn-XXDeW_k0_YW4rzDPxx57KzxD9qjU35Yf_PhefRQxaFDllv2QJeHTDsoFOlihKzlg9CXCVnFZ9qHIBfcv_s6zeaGtUOKGGmphBQG2CrKpSR50Ks4I9_C4dL5k1K0Hs0O4GD1V4McXq9HyJfL_zbCLim/ouc9h9m7c0ej0ix/GTA-TR-Fullprogramlarindir.net-.rar" target="_blank" rel="noopener" class="btn btn-primary">
                <i class="fa-solid fa-download"></i>
                <span>GTA:SA İNDİR</span>
            </a>
        `
    },
    2: {
        kicker: 'ADIM 02 // 7/24 YAPAY ZEKA OTOMASYONU',
        title: 'DISCORD SESLİ KAYIT & OTOMATİK KLAN ALIM',
        desc: 'Discord sunucumuza katıl ve <strong>Sesli Kayıt</strong> odasına bağlan. Yapay zeka kayıt botumuz seninle konuşarak kaydını saniyeler içinde tamamlar. Ardından istediğin birimin (TSK, JGK, EGM, Çetin) <strong>Sesli Klan Alım</strong> odasına girerek alt branşını seç!',
        code: 'https://discord.gg/adaletmta',
        actionsHtml: `
            <a href="https://discord.gg/adaletmta" target="_blank" rel="noopener" class="btn btn-discord">
                <i class="fa-brands fa-discord"></i>
                <span>DISCORD SUNUCUSUNA KATIL</span>
            </a>
            <button class="btn btn-primary" onclick="selectStep(3)">
                <i class="fa-solid fa-arrow-right"></i>
                <span>3. ADIMA GEÇ: OYUNA BAĞLAN</span>
            </button>
        `
    },
    3: {
        kicker: 'ADIM 03 // OPERASYON BAŞLANGICI',
        title: 'DOĞRUDAN SUNUCUYA BAĞLAN VE GÖREVE ÇIK',
        desc: 'Kaydın ve birim rollerin tamamlandı! Şimdi aşağıdaki <strong>Doğrudan Sunucuya Bağlan</strong> butonuna tıklayarak veya MTA:SA F8 konsoluna <code>connect 178.32.203.118:22003</code> yazarak birliğindeki yerini alabilirsin.',
        code: 'mtasa://178.32.203.118:22003',
        actionsHtml: `
            <a href="mtasa://178.32.203.118:22003" class="btn btn-primary">
                <i class="fa-solid fa-bolt"></i>
                <span>DOĞRUDAN SUNUCUYA BAĞLAN</span>
            </a>
        `
    }
};

const PRELOAD_FACTION_ASSETS = ['/tsk.png', '/jgk.png', '/egm.png', '/cetin.png'];
PRELOAD_FACTION_ASSETS.forEach(url => {
    const im = new Image();
    im.src = url;
});

let holoTransitionToken = 0;
function selectHoloFaction(key) {
    const f = FACTIONS[key];
    if (!f) return;

    const holoCard = document.getElementById('hero-holo-card');
    if (holoCard) {
        holoCard.style.setProperty('--faction-glow', f.glow);
        holoCard.style.setProperty('--faction-accent', f.accent);
    }

    const holoTitle = document.getElementById('holo-title');
    const holoSub = document.getElementById('holo-sub');
    if (holoTitle) holoTitle.textContent = f.title;
    if (holoSub) holoSub.textContent = f.shortSub;

    document.querySelectorAll('.holo-switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${key}'`));
    });

    const holoImg = document.getElementById('holo-img');
    if (holoImg) {
        const token = ++holoTransitionToken;
        holoImg.style.transition = 'opacity 0.16s ease, transform 0.2s ease';
        holoImg.style.opacity = '0.3';
        holoImg.style.transform = 'scale(0.98)';

        const temp = new Image();
        const renderHolo = () => {
            if (token !== holoTransitionToken) return;
            holoImg.src = f.poster;
            holoImg.style.opacity = '1';
            holoImg.style.transform = 'scale(1)';
        };
        temp.onload = renderHolo;
        temp.onerror = renderHolo;
        temp.src = f.poster;
        if (temp.complete) {
            renderHolo();
        }
    }
}

let stageTransitionToken = 0;
function selectFaction(key) {
    const f = FACTIONS[key];
    if (!f) return;

    document.documentElement.style.setProperty('--faction-accent', f.accent);
    document.documentElement.style.setProperty('--faction-glow', f.glow);

    document.querySelectorAll('.faction-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.faction === key);
    });

    const stageTitle = document.getElementById('stage-title');
    const stageDesc = document.getElementById('stage-desc');
    const stageSubunits = document.getElementById('stage-subunits');
    const stageSubunitsLabel = document.getElementById('stage-subunits-label');

    if (stageTitle) stageTitle.textContent = f.title;
    if (stageDesc) stageDesc.textContent = f.desc;

    if (stageSubunits) {
        if (f.subunits && f.subunits.length > 0) {
            if (stageSubunitsLabel) stageSubunitsLabel.style.display = 'block';
            stageSubunits.style.display = 'grid';
            stageSubunits.innerHTML = f.subunits.map(s => `
                <div class="subunit-card">
                    <div class="stitle">${s.name} <span>${s.tag}</span></div>
                    <div class="sdesc">${s.desc}</div>
                </div>
            `).join('');
        } else {
            if (stageSubunitsLabel) stageSubunitsLabel.style.display = 'none';
            stageSubunits.style.display = 'none';
            stageSubunits.innerHTML = '';
        }
    }

    const stageImg = document.getElementById('stage-poster-img');
    if (stageImg) {
        const token = ++stageTransitionToken;
        stageImg.style.transition = 'opacity 0.16s ease, transform 0.2s ease';
        stageImg.style.opacity = '0.2';
        stageImg.style.transform = 'scale(0.98)';

        const temp = new Image();
        const renderStage = () => {
            if (token !== stageTransitionToken) return;
            stageImg.src = f.poster;
            stageImg.style.opacity = '1';
            stageImg.style.transform = 'scale(1)';
        };
        temp.onload = renderStage;
        temp.onerror = renderStage;
        temp.src = f.poster;
        if (temp.complete) {
            renderStage();
        }
    }
}

function selectStep(stepNum) {
    const data = STEPS_DATA[stepNum];
    if (!data) return;

    [1, 2, 3].forEach(n => {
        const btn = document.getElementById(`step-btn-${n}`);
        if (btn) btn.classList.toggle('active', n === stepNum);
    });

    document.getElementById('step-panel-kicker').textContent = data.kicker;
    document.getElementById('step-panel-title').textContent = data.title;
    document.getElementById('step-panel-desc').innerHTML = data.desc;
    document.getElementById('step-terminal-code').textContent = data.code;
    document.getElementById('step-panel-actions').innerHTML = data.actionsHtml;
}

function filterStore(category, btnEl) {
    document.querySelectorAll('.store-filter-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    document.querySelectorAll('.store-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function toggleFaq(btnEl) {
    const item = btnEl.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(el => {
        const ans = el.querySelector('.faq-a');
        if (ans && el.classList.contains('open')) {
            ans.style.maxHeight = ans.scrollHeight + 'px';
            void ans.offsetHeight;
            ans.style.maxHeight = '0px';
        }
        el.classList.remove('open');
    });

    if (!isOpen) {
        item.classList.add('open');
        const ans = item.querySelector('.faq-a');
        if (ans) {
            ans.style.maxHeight = (ans.scrollHeight + 18) + 'px';
        }
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function copyServerIP() {
    navigator.clipboard.writeText(SERVER_IP).then(() => {
        showToast(`Sunucu IP kopyalandı: ${SERVER_IP}`);
    }).catch(() => {
        showToast(`Sunucu IP: ${SERVER_IP}`);
    });
}

function openConnectModal(customIp) {
    const ip = customIp || SERVER_IP;
    const modal = document.getElementById('connect-modal');
    const ipText = document.getElementById('modal-ip-text');
    const launchLink = document.getElementById('modal-launch-link');

    if (ipText) ipText.textContent = `mtasa://${ip}`;
    if (launchLink) launchLink.href = `mtasa://${ip}`;
    if (modal) modal.classList.add('active');
}

function closeConnectModal() {
    const modal = document.getElementById('connect-modal');
    if (modal) modal.classList.remove('active');
}

async function refreshServerStatus() {
    try {
        const res = await fetch('/api/server-status', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const liveEl = document.getElementById('live-player-count');
        const pingEl = document.getElementById('live-ping');
        const dotEl = document.getElementById('live-status-dot');

        if (liveEl && typeof data.players === 'number') {
            liveEl.textContent = `${data.players} / ${data.maxPlayers || 250}`;
        }
        if (pingEl && typeof data.ping === 'number') {
            pingEl.textContent = `${data.ping}ms`;
        }
        if (dotEl) {
            dotEl.style.background = data.online !== false ? '#10b981' : '#ef4444';
            dotEl.style.boxShadow = data.online !== false ? '0 0 10px #10b981' : '0 0 10px #ef4444';
        }
    } catch (_) { }
}

function initTacticalCanvas() {
    const canvas = document.getElementById('tactical-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 48 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.55 + 0.15
    }));

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 136, 0, ${p.alpha})`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 135) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 136, 0, ${(1 - dist / 135) * 0.08})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

function initHeroBgSlider() {
    const slides = document.querySelectorAll('#hero-bg-slider .hero-bg-slide');
    if (!slides.length) return;
    let currentIndex = 0;
    setInterval(() => {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }, 4500);
}

function initClientSecurity() {
    if (['file:', 'blob:', 'data:', 'chrome-extension:', 'moz-extension:'].includes(window.location.protocol)) {
        document.documentElement.innerHTML = '';
        return;
    }

    if (window.top !== window.self) {
        try {
            window.top.location = window.self.location;
        } catch (_) {
            document.documentElement.innerHTML = '';
        }
    }

    const blockEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    document.addEventListener('contextmenu', blockEvent, true);
    document.addEventListener('selectstart', blockEvent, true);
    document.addEventListener('dragstart', blockEvent, true);
    document.addEventListener('drop', blockEvent, true);
    document.addEventListener('copy', blockEvent, true);
    document.addEventListener('cut', blockEvent, true);

    window.addEventListener('keydown', (e) => {
        const key = (e.key || '').toUpperCase();
        const ctrlOrCmd = e.ctrlKey || e.metaKey;
        if (
            e.key === 'F12' ||
            (ctrlOrCmd && e.shiftKey && ['I', 'J', 'C', 'K', 'S', 'E', 'M'].includes(key)) ||
            (ctrlOrCmd && e.altKey && ['I', 'J', 'C', 'U'].includes(key)) ||
            (ctrlOrCmd && ['U', 'S', 'P', 'A', 'G', 'H'].includes(key))
        ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
}

initClientSecurity();

document.addEventListener('DOMContentLoaded', () => {
    initClientSecurity();
    selectHoloFaction('tsk');
    selectFaction('tsk');
    initHeroBgSlider();
    document.querySelectorAll('.faq-item.open .faq-a').forEach(ans => {
        ans.style.maxHeight = (ans.scrollHeight + 18) + 'px';
    });
    refreshServerStatus();
    setInterval(refreshServerStatus, 5000);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    const holoCard = document.getElementById('hero-holo-card');
    if (holoCard) {
        holoCard.addEventListener('mousemove', (e) => {
            const rect = holoCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            holoCard.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        holoCard.addEventListener('mouseleave', () => {
            holoCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }

    const modal = document.getElementById('connect-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeConnectModal();
        });
    }

    const params = new URLSearchParams(window.location.search);
    const paramIp = params.get('ip');
    const autoConnect = params.get('auto');
    if (paramIp || autoConnect === 'true') {
        const targetIp = paramIp === SERVER_IP ? paramIp : SERVER_IP;
        openConnectModal(targetIp);
        if (autoConnect === 'true') {
            setTimeout(() => {
                window.location.href = `mtasa://${targetIp}`;
            }, 600);
        }
    }
});

