let currentStoreData = {
    products: []
};

let csrfToken = '';

const DEFAULT_PRODUCTS = [
  {
    "id": "st-1",
    "name": "Yönetici Personel",
    "price": 500,
    "category": "yetkiler",
    "image": "yonetici-personel.png",
    "icon": "fa-user-shield",
    "desc": "Türkiyem Adalet Gaming sunucusunda geçerli Yönetici Personel yetkisi ve özel Yetkili Paneli (P Panel) izinleri.",
    "features": [
      "Birimlere katılımcı alma yetkisi (/tag)",
      "Rütbe Verme Paneli (/tag)",
      "Birim Yönetim Paneli (/dpanel)",
      "Özel Yetkili Panel (P Panel) & Özel Yetkili Tagı",
      "P Panel: Raporları okuma ve silme",
      "P Panel: Mute atma & Oyuncuyu dondurma",
      "P Panel: Oyuncuları izleme & Panelden hasar verme",
      "P Panel: Oyuncuların isimlerini değiştirme & Ekrana yazı atma",
      "P Panel: Can verme & Zırh verme",
      "P Panel: Oyuncuya ışınlanma & Oyuncuyu çekme",
      "P Panel: Oyundaki yetkili sohbete mesaj atabilme & Sohbeti temizleme"
    ],
    "rules": [
      "Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.",
      "Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.",
      "Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.",
      "Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız."
    ]
  },
  {
    "id": "st-2",
    "name": "Yönetim Ekibi",
    "price": 800,
    "category": "yetkiler",
    "icon": "fa-users-gear",
    "image": "yonetim-ekibi.png",
    "desc": "Türkiyem Adalet Gaming sunucusunda geçerli Yönetim Ekibi yetkisi ve özel Yetkili Paneli (P Panel) izinleri.",
    "features": [
      "Birimlere katılımcı alma yetkisi (/tag)",
      "Rütbe Verme Paneli (/tag)",
      "Birim Yönetim Paneli (/dpanel)",
      "Özel Yetkili Panel (P Panel) & Özel Yetkili Tağı",
      "P Panel: Raporları okuma ve silme",
      "P Panel: Kick(Kovma) atma",
      "P Panel: Mute atma",
      "P Panel: Skin verme",
      "P Panel: Silah verme",
      "P Panel: Oyuncuyu dondurma",
      "P Panel: Oyuncuları izleme",
      "P Panel: Oyuncuya panelden hasar verme",
      "P Panel: Oyuncuların isimlerini değiştirme",
      "P Panel: Oyuncunun ekranına yazı atma",
      "P Panel: Can verme & Zırh verme",
      "P Panel: Oyuncuya ışınlanma & Oyuncuyu çekme",
      "P Panel: Oyundaki yetkili sohbete mesaj atabilme & Sohbeti temizleme"
    ],
    "rules": [
      "Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.",
      "Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.",
      "Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.",
      "Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız."
    ]
  },
  {
    "id": "st-3",
    "name": "Üst Kademe Yönetim Ekibi",
    "price": 1000,
    "category": "yetkiler",
    "icon": "fa-user-tie",
    "image": "ust-kademe-yonetim.png",
    "desc": "Türkiyem Adalet Gaming sunucusunda geçerli Üst Kademe Yönetim Ekibi yetkisi ve özel Yetkili Paneli (P Panel) izinleri.",
    "features": [
      "Birimlere katılımcı alma yetkisi (/tag)",
      "Rütbe Verme Paneli (/tag)",
      "Birim Yönetim Paneli (/dpanel)",
      "Özel Yetkili Panel (P Panel) & Özel Yetkili Tağı",
      "P Panel: Raporları okuma ve silme",
      "P Panel: Kick(Kovma) atma",
      "P Panel: Mute atma",
      "P Panel: Skin verme",
      "P Panel: Silah verme",
      "P Panel: Oyuncuyu dondurma",
      "P Panel: Oyuncuları izleme",
      "P Panel: Oyuncuya panelden hasar verme",
      "P Panel: Oyuncuların isimlerini değiştirme",
      "P Panel: Oyuncunun ekranına yazı atma",
      "P Panel: Can verme & Zırh verme",
      "P Panel: Oyuncuya ışınlanma & Oyuncuyu çekme",
      "P Panel: Oyundaki yetkili sohbete mesaj atabilme & Sohbeti temizleme"
    ],
    "rules": [
      "Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.",
      "Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.",
      "Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.",
      "Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız."
    ]
  },
  {
    "id": "st-4",
    "name": "Yönetim Kurulu Üyesi",
    "price": 1500,
    "category": "yetkiler",
    "icon": "fa-award",
    "image": "yonetim-kurulu-uyesi.png",
    "desc": "Türkiyem Adalet Gaming sunucusunda geçerli Yönetim Kurulu Üyesi yetkisi ve özel Yetkili Paneli (P Panel) izinleri.",
    "features": [
      "Birimlere katılımcı alma yetkisi (/tag)",
      "Rütbe verme Paneli (/tag)",
      "Birim yönetim paneli (/dpanel)",
      "Özel Yetkili Panel (P Panel)",
      "Özel Yetkili Tağı",
      "Jail Panel (/jail)",
      "Superman (2X SHIFT)",
      "P Panel: Raporları okuma ve silme",
      "P Panel: Kick(Kovma) atma",
      "P Panel: IP Banlama",
      "P Panel: Serial Banlama",
      "P Panel: IP Ban açma",
      "P Panel: Serial Ban açma",
      "P Panel: Mute atma",
      "P Panel: Skin verme",
      "P Panel: Silah verme",
      "P Panel: Oyuncuyu dondurma",
      "P Panel: Oyuncuları İzleme",
      "P Panel: Oyuncuya panelden hasar verme",
      "P Panel: Oyuncuların İsimlerini değiştirme",
      "P Panel: Oyuncunun ekranına yazı atma",
      "P Panel: Can verme & Zırh Verme",
      "P Panel: Oyuncuya Işınlanma & Oyuncuyu çekme",
      "P Panel: Oyundaki yetkili sohbete mesaj atabilme",
      "P Panel: Sohbet temizleme"
    ],
    "rules": [
      "Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.",
      "Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.",
      "Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.",
      "Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız."
    ]
  },
  {
    "id": "st-5",
    "name": "Üst Kademe Yönetim Kurulu Üyesi",
    "price": 2000,
    "category": "yetkiler",
    "icon": "fa-crown",
    "image": "ust-kademe-yonetim-kurulu.png",
    "desc": "Türkiyem Adalet Gaming sunucusunda geçerli Üst Kademe Yönetim Kurulu Üyesi yetkisi ve özel Yetkili Paneli (P Panel) izinleri.",
    "features": [
      "Birimlere katılımcı alma yetkisi (/tag)",
      "Rütbe verme Paneli (/tag)",
      "Birim yönetim paneli (/dpanel)",
      "Özel Yetkili Panel (P Panel)",
      "Özel Yetkili Tağı",
      "Jail Panel (/jail)",
      "Superman (2X SHIFT)",
      "P Panel: Raporları okuma ve silme",
      "P Panel: Kick(Kovma) atma",
      "P Panel: IP Banlama",
      "P Panel: Serial Banlama",
      "P Panel: IP Ban açma",
      "P Panel: Serial Ban açma",
      "P Panel: Mute atma",
      "P Panel: Skin verme",
      "P Panel: Silah verme",
      "P Panel: Oyuncuyu dondurma",
      "P Panel: Oyuncuları İzleme",
      "P Panel: Oyuncuya panelden hasar verme",
      "P Panel: Oyuncuların İsimlerini değiştirme",
      "P Panel: Oyuncunun ekranına yazı atma",
      "P Panel: Can verme & Zırh Verme",
      "P Panel: Oyuncuya Işınlanma & Oyuncuyu çekme",
      "P Panel: Oyundaki yetkili sohbete mesaj atabilme",
      "P Panel: Sohbet temizleme"
    ],
    "rules": [
      "Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.",
      "Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.",
      "Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.",
      "Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız."
    ]
  },
  {
    "id": "oz-1",
    "name": "Gold Vip",
    "price": 300,
    "category": "ozel-ayricaliklar",
    "icon": "fa-gem",
    "image": "gold-vip.png",
    "desc": "Gold VIP Yetki Paketi",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "Yetki 1 aylık olarak size zimmetlenir. (~)",
      "Klan basesinde doğarsınız",
      "Telefonda SMS ve Arama yapma özelliği",
      "(~) = Troll / Rahatsız edici durumların devamı halinde yetkinizi kaybedersiniz."
    ]
  },
  {
    "id": "oz-2",
    "name": "Silver Vip",
    "price": 200,
    "category": "ozel-ayricaliklar",
    "icon": "fa-shield",
    "image": "silver-vip.png",
    "desc": "Silver VIP Yetki Paketi",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "Yetki 1 aylık olarak size zimmetlenir. (~)",
      "Klan basesinde doğarsınız",
      "(~) = Troll / Rahatsız edici durumların devamı halinde yetkinizi kaybedersiniz."
    ]
  },
  {
    "id": "oz-3",
    "name": "Bronz Vip",
    "price": 100,
    "category": "ozel-ayricaliklar",
    "icon": "fa-medal",
    "image": "bronz-vip.png",
    "desc": "Bronz VIP Yetki Paketi",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "Yetki 1 aylık olarak size zimmetlenir. (~)",
      "Klan basesinde doğarsınız",
      "(~) = Troll / Rahatsız edici durumların devamı halinde yetkinizi kaybedersiniz."
    ]
  },
  {
    "id": "oz-4",
    "name": "Ek Klan Hakkı",
    "price": 200,
    "category": "ozel-ayricaliklar",
    "icon": "fa-flag",
    "image": "ek-klan-hakki.png",
    "desc": "Ek Klan Hakkı Paketi",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Klan hakkınızın bittiği durumda size ekstradan bir klan hakkı sağlar. Bu sayede istediğiniz klana geçiş yapabilirsiniz."
    ]
  },
  {
    "id": "oz-5",
    "name": "Hesap Kurtarma & Şifre Değiştirme",
    "price": 200,
    "category": "ozel-ayricaliklar",
    "icon": "fa-key",
    "image": "hesap-kurtarma.png",
    "desc": "Hesap Kurtarma & Şifre Değiştirme Hizmeti",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Oyunda kullandığınız hesabı unuttuysanız yada şifresini değiştirmek istiyorsanız bu ürünü satın alabilirsiniz."
    ]
  },
  {
    "id": "oz-6",
    "name": "Yetkili Uyarı Sildirme",
    "price": 500,
    "category": "ozel-ayricaliklar",
    "icon": "fa-trash-can",
    "image": "yetkili-uyari-sildirme.png",
    "desc": "Yetkili Uyarı Sildirme Hizmeti",
    "features": [
      "Alan yetkililerin tüm uyarıları silinecektir. Alan yetkili, Discord sunucumuzda üst yönetim talebi açsın."
    ]
  },
  {
    "id": "dn-1",
    "name": "McLaren 720S Spider",
    "price": 250,
    "category": "donate",
    "icon": "fa-car-side",
    "image": "mclaren-720s.jpg",
    "desc": "McLaren 720S Spider Araç",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Araç 1 aylık olarak size zimmetlenir.",
      "Aracın üstü animasyonlu şekilde açılıp kapanabilmektedir. Tuş: N",
      "Araç 100 km/h hızın üzerine çıktığında spoiler otomatik yükselmektedir."
    ]
  },
  {
    "id": "dn-2",
    "name": "Ferrari California",
    "price": 200,
    "category": "donate",
    "icon": "fa-car",
    "image": "ferrari-california.jpg",
    "desc": "Ferrari California Araç",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Araç 1 aylık olarak size zimmetlenir.",
      "Aracın üstü animasyonlu şekilde açılıp kapanabilmektedir. Tuş: N"
    ]
  },
  {
    "id": "dn-3",
    "name": "Buckingham Swift Retro",
    "price": 250,
    "category": "donate",
    "icon": "fa-helicopter",
    "image": "luxury-helikopter.png",
    "desc": "Buckingham Swift Retro Helikopter",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Araç 1 aylık olarak size zimmetlenir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  },
  {
    "id": "dn-4",
    "name": "Ramiz Karaeski",
    "price": 200,
    "category": "donate",
    "icon": "fa-user-ninja",
    "image": "ramiz-karaeski.png",
    "desc": "Ramiz Karaeski Karakter Görünümü",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  },
  {
    "id": "dn-5",
    "name": "Aslan Akbey",
    "price": 200,
    "category": "donate",
    "icon": "fa-user-secret",
    "image": "aslan-akbey.png",
    "desc": "Aslan Akbey Karakter Görünümü",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  },
  {
    "id": "dn-6",
    "name": "Behzat Ç.",
    "price": 200,
    "category": "donate",
    "icon": "fa-user-astronaut",
    "image": "behzat-c.png",
    "desc": "Behzat Ç. Karakter Görünümü",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  },
  {
    "id": "dn-7",
    "name": "Eşref Tek",
    "price": 200,
    "category": "donate",
    "icon": "fa-user-large",
    "image": "esref-tek.png",
    "desc": "Eşref Tek Karakter Görünümü",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  },
  {
    "id": "dn-8",
    "name": "Kuzey Tekinoğlu",
    "price": 200,
    "category": "donate",
    "icon": "fa-person",
    "image": "kuzey-tekinoglu.png",
    "desc": "Kuzey Tekinoğlu Karakter Görünümü",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  },
  {
    "id": "dn-9",
    "name": "Pala",
    "price": 200,
    "category": "donate",
    "icon": "fa-glasses",
    "image": "pala.png",
    "desc": "Pala Karakter Görünümü",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  },
  {
    "id": "dn-10",
    "name": "Polat Alemdar",
    "price": 200,
    "category": "donate",
    "icon": "fa-user-check",
    "image": "polat-alemdar.png",
    "desc": "Polat Alemdar Karakter Görünümü",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  },
  {
    "id": "dn-11",
    "name": "Reis",
    "price": 200,
    "category": "donate",
    "icon": "fa-user-graduate",
    "image": "reis.png",
    "desc": "Reis Karakter Görünümü",
    "features": [
      "Aldıktan sonra discord sunucumuzda destek talebi açınız.",
      "Yetki içeriği görseldedir.",
      "(SUNUCUDA KULLANMAK İÇİNDİR)"
    ]
  }
];

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('adminUserInput').value.trim();
            const p = document.getElementById('adminPassInput').value.trim();
            const errBox = document.getElementById('loginError');
            const errText = document.getElementById('loginErrorText');

            errBox.style.display = 'none';

            try {
                const res = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u, password: p })
                });
                if (!res.ok) {
                    try {
                        const errData = await res.json();
                        errText.textContent = errData.message || ('Hata kodu: ' + res.status);
                    } catch (_) {
                        errText.textContent = 'Sunucu hatası (' + res.status + ')';
                    }
                    errBox.style.display = 'flex';
                    return;
                }

                const data = await res.json();

                if (data.success) {
                    csrfToken = data.csrfToken || '';
                    const badgeEl = document.getElementById('userBadgeText');
                    if (badgeEl && data.username) {
                        badgeEl.textContent = 'Hesap: ' + data.username;
                    }
                    showToast('Giriş Başarılı! Yönlendiriliyorsunuz...', 'success');
                    setTimeout(() => {
                        showDashboardView();
                        loadAdminStoreData();
                        loadAuditLogs();
                    }, 600);
                } else {
                    errText.textContent = data.message || 'Giriş Başarısız!';
                    errBox.style.display = 'flex';
                }
            } catch (err) {
                console.error('Login error:', err);
                errText.textContent = 'Sunucuyla bağlantı kurulamadı!';
                errBox.style.display = 'flex';
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await fetch('/api/admin/logout', {
                method: 'POST',
                headers: { 'X-Admin-CSRF-Token': csrfToken }
            });
            csrfToken = '';
            showLoginView();
            showToast('Oturum sonlandırıldı.');
        });
    }

    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProductFromForm();
        });
    }

    const pImageFileInput = document.getElementById('pImageFile');
    if (pImageFileInput) {
        pImageFileInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                showToast('Lütfen geçerli bir resim dosyası seçin.', 'error');
                return;
            }
            try {
                showToast('Görsel işleniyor...', 'info');
                const compressedBase64 = await resizeImageFile(file, 800, 800, 0.82);
                document.getElementById('pImage').value = compressedBase64;
                const sizeKb = Math.round(compressedBase64.length * 0.75 / 1024);
                updateImagePreview(compressedBase64, file.name, sizeKb + ' KB (Optimize Edildi)');
                showToast('Görsel başarıyla seçildi!');
            } catch(err) {
                showToast('Görsel yüklenirken hata oluştu.', 'error');
            }
        });
    }

    const btnRemoveImg = document.getElementById('btnRemoveImage');
    if (btnRemoveImg) {
        btnRemoveImg.addEventListener('click', () => {
            document.getElementById('pImage').value = '';
            if (pImageFileInput) pImageFileInput.value = '';
            updateImagePreview('', '', '');
        });
    }

    const pImageTextInput = document.getElementById('pImage');
    if (pImageTextInput) {
        pImageTextInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val) {
                updateImagePreview(val, val.startsWith('data:') ? 'Özel Görsel' : val, '');
            } else {
                updateImagePreview('', '', '');
            }
        });
    }
});

async function checkAuthStatus() {
    try {
        const res = await fetch('/api/admin/check-auth');
        const data = await res.json();
        if (data.authenticated) {
            csrfToken = data.csrfToken || '';
            const badgeEl = document.getElementById('userBadgeText');
            if (badgeEl && data.username) {
                badgeEl.textContent = 'Hesap: ' + data.username;
            }
            showDashboardView();
            await loadAdminStoreData();
            await loadAuditLogs();
        } else {
            showLoginView();
        }
    } catch (e) {
        showLoginView();
    }
}

function showLoginView() {
    if (auditPollInterval) {
        clearInterval(auditPollInterval);
        auditPollInterval = null;
    }
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('dashboardSection').style.display = 'none';
}

function showDashboardView() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'flex';
    if (!auditPollInterval) {
        auditPollInterval = setInterval(loadAuditLogs, 3000);
    }
}

async function loadAdminStoreData() {
    try {
        const res = await fetch('/api/store-data');
        const result = await res.json();
        if (result.success && result.data) {
            currentStoreData.products = (result.data.products && result.data.products.length > 0)
                ? result.data.products
                : DEFAULT_PRODUCTS;
        } else {
            currentStoreData.products = DEFAULT_PRODUCTS;
        }
    } catch (e) {
        currentStoreData.products = DEFAULT_PRODUCTS;
    }
    renderAdminProducts();
    updateMetrics();
}

async function loadAuditLogs() {
    const tbody = document.getElementById('auditLogsBody');
    if (!tbody) return;
    try {
        const res = await fetch('/api/admin/audit-logs?t=' + Date.now(), { cache: 'no-store' });
        const result = await res.json();
        if (result.success && result.logs && result.logs.length > 0) {
            tbody.innerHTML = result.logs.map(function(log) {
                const dateStr = new Date(log.timestamp).toLocaleString('tr-TR');
                return '<tr>' +
                    '<td style="white-space:nowrap; color:var(--text-muted); font-size:12px;">' + dateStr + '</td>' +
                    '<td><strong>' + escapeHtml(log.type || '') + '</strong></td>' +
                    '<td><code style="background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">' + escapeHtml(log.ip || '') + '</code></td>' +
                    '<td><span class="status-badge ' + escapeHtml(log.status) + '">' + escapeHtml(log.status) + '</span></td>' +
                    '<td style="color:#d69e2e;">' + escapeHtml(log.details || '') + '</td>' +
                    '</tr>';
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">Henüz kaydedilmiş güvenlik günlüğü yok.</td></tr>';
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--accent-red); padding:20px;">Loglar çekilirken hata oluştu.</td></tr>';
    }
}

let auditPollInterval = null;

function openClearLogsModal() {
    const modal = document.getElementById('clearLogsModal');
    if (modal) modal.style.display = 'flex';
}

function closeClearLogsModal() {
    const modal = document.getElementById('clearLogsModal');
    if (modal) modal.style.display = 'none';
}

async function confirmClearAuditLogs() {
    closeClearLogsModal();
    try {
        const res = await fetch('/api/admin/clear-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-CSRF-Token': csrfToken }
        });
        const data = await res.json();
        if (data.success) {
            showToast('Güvenlik logları temizlendi.');
            loadAuditLogs();
        } else {
            showToast(data.message || 'Loglar temizlenemedi.', 'error');
        }
    } catch (e) {
        showToast('Sunucu hatası!', 'error');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

let activeCategory = 'all';
let searchQuery = '';

function filterCategory(cat, btn) {
    activeCategory = cat;
    document.querySelectorAll('.admin-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    renderAdminProducts();
}

function onSearchInput(val) {
    searchQuery = (val || '').toLowerCase().trim();
    renderAdminProducts();
}

function updateCategoryCounts() {
    const prods = currentStoreData.products || [];
    const ce = document.getElementById('countAll'); if (ce) ce.textContent = prods.length;
    const cy = document.getElementById('countYetkiler'); if (cy) cy.textContent = prods.filter(function(p){ return p.category === 'yetkiler'; }).length;
    const co = document.getElementById('countOzel'); if (co) co.textContent = prods.filter(function(p){ return p.category === 'ozel-ayricaliklar'; }).length;
    const cd = document.getElementById('countDonate'); if (cd) cd.textContent = prods.filter(function(p){ return p.category === 'donate'; }).length;
}

function updateMetrics() {
    const prods = currentStoreData.products || [];
    const totalEl = document.getElementById('totalProductsVal'); if (totalEl) totalEl.textContent = prods.length;
    const discEl = document.getElementById('discountedProductsVal'); if (discEl) discEl.textContent = prods.filter(function(p){ return p.oldPrice && p.oldPrice > p.price; }).length;
    updateCategoryCounts();
}

function renderAdminProducts() {
    const container = document.getElementById('adminProductsContainer');
    if (!container) return;
    let prods = currentStoreData.products || [];
    if (activeCategory !== 'all') {
        prods = prods.filter(function(p){ return p.category === activeCategory; });
    }
    if (searchQuery) {
        prods = prods.filter(function(p){
            return (p.name && p.name.toLowerCase().indexOf(searchQuery) !== -1) ||
                   (p.desc && p.desc.toLowerCase().indexOf(searchQuery) !== -1);
        });
    }
    if (prods.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">Aradığınız kriterde ürün bulunamadı.</div>';
        return;
    }
    container.innerHTML = prods.map(function(p) {
        const pid = escapeHtml(p.id);
        let oldPH = '';
        if (p.oldPrice && p.oldPrice > p.price) {
            const pct = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
            oldPH = '<span class="old-price">₺' + p.oldPrice + '</span>' +
                    '<span class="discount-badge">-%' + pct + '</span>';
        }
        return '<div class="product-admin-card" id="prod-card-' + pid + '">' +
            '<div class="prod-img-box">' +
            '<span class="badge-cat">' + escapeHtml(p.category || 'genel') + '</span>' +
            '<img src="' + escapeHtml(p.image || 'logo.png') + '" alt="' + escapeHtml(p.name) + '" onerror="this.src=\'logo.png\'">' +
            '</div><div class="prod-body">' +
            '<div class="prod-title">' + escapeHtml(p.name) + '</div>' +
            '<div class="prod-desc">' + escapeHtml(p.desc || '') + '</div>' +
            '<div class="price-tag-wrap"><span class="curr-price">₺' + p.price + '</span>' + oldPH + '</div>' +
            '<div class="card-actions">' +
            '<button class="btn-card-edit" onclick="editProduct(\'' + pid + '\')"><i class="fa-solid fa-pen-to-square"></i> Düzenle</button>' +
            '<button class="btn-card-delete" onclick="deleteProduct(\'' + pid + '\')"><i class="fa-solid fa-trash"></i></button>' +
            '</div></div></div>';
    }).join('');
}

function updateImagePreview(src, name, sizeText) {
    const wrap = document.getElementById('imagePreviewWrap');
    const img = document.getElementById('imagePreviewImg');
    const nameEl = document.getElementById('imagePreviewName');
    const sizeEl = document.getElementById('imagePreviewSize');
    if (!wrap || !img) return;
    if (src) {
        img.src = src;
        if (nameEl) nameEl.textContent = name || 'Seçilen Görsel';
        if (sizeEl) sizeEl.textContent = sizeText || '';
        wrap.style.display = 'flex';
    } else {
        wrap.style.display = 'none';
        img.src = '';
    }
}

function resizeImageFile(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let w = img.width;
                let h = img.height;
                if (w > maxWidth || h > maxHeight) {
                    if (w / h > maxWidth / maxHeight) {
                        h = Math.round((h * maxWidth) / w);
                        w = maxWidth;
                    } else {
                        w = Math.round((w * maxHeight) / h);
                        h = maxHeight;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', quality || 0.85);
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function openProductModal() {
    document.getElementById('modalHeaderTitle').textContent = 'Yeni Ürün Ekle';
    document.getElementById('prodEditId').value = '';
    document.getElementById('productForm').reset();
    updateImagePreview('', '', '');
    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() { 
    document.getElementById('productModal').style.display = 'none'; 
}

function editProduct(id) {
    const prod = currentStoreData.products.find(function(p){ return p.id === id; });
    if (!prod) return;
    document.getElementById('modalHeaderTitle').textContent = 'Ürünü Düzenle';
    document.getElementById('prodEditId').value = prod.id;
    document.getElementById('pName').value = prod.name || '';
    document.getElementById('pCategory').value = prod.category || 'yetkiler';
    document.getElementById('pPrice').value = prod.price || '';
    document.getElementById('pOldPrice').value = prod.oldPrice || '';
    document.getElementById('pImage').value = prod.image || '';
    document.getElementById('pDesc').value = prod.desc || '';
    document.getElementById('pFeatures').value = (prod.features || []).join('\n');
    
    if (prod.image) {
        updateImagePreview(prod.image, prod.image.startsWith('data:') ? 'Özel Yüklenmiş Görsel' : prod.image, '');
    } else {
        updateImagePreview('', '', '');
    }
    
    document.getElementById('productModal').style.display = 'flex';
}

async function saveProductFromForm() {
    const editId = document.getElementById('prodEditId').value;
    const name = document.getElementById('pName').value.trim();
    const category = document.getElementById('pCategory').value;
    const price = parseFloat(document.getElementById('pPrice').value) || 0;
    const oldPriceVal = document.getElementById('pOldPrice').value;
    const oldPrice = oldPriceVal ? parseFloat(oldPriceVal) : null;
    const image = document.getElementById('pImage').value.trim();
    const desc = document.getElementById('pDesc').value.trim();
    const featuresRaw = document.getElementById('pFeatures').value;
    const features = featuresRaw.split('\n').map(function(f){ return f.trim(); }).filter(function(f){ return f.length > 0; });

    if (editId) {
        const idx = currentStoreData.products.findIndex(function(p){ return p.id === editId; });
        if (idx !== -1) {
            currentStoreData.products[idx] = Object.assign({}, currentStoreData.products[idx], {
                name: name,
                category: category,
                price: price,
                oldPrice: oldPrice,
                image: image,
                desc: desc,
                features: features
            });
        }
    } else {
        currentStoreData.products.unshift({
            id: 'prod-' + Date.now(),
            name: name,
            category: category,
            price: price,
            oldPrice: oldPrice,
            image: image,
            desc: desc,
            features: features
        });
    }
    await persistDataToServer();
    closeProductModal();
    renderAdminProducts();
    updateMetrics();
    loadAuditLogs();
    showToast(editId ? 'Ürün güncellendi!' : 'Yeni ürün eklendi!');
}

async function deleteProduct(id) {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    currentStoreData.products = currentStoreData.products.filter(function(p){ return p.id !== id; });
    await persistDataToServer();
    renderAdminProducts();
    updateMetrics();
    loadAuditLogs();
    showToast('Ürün silindi.');
}

async function persistDataToServer() {
    try {
        const res = await fetch('/api/admin/save-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-CSRF-Token': csrfToken },
            body: JSON.stringify({
                products: currentStoreData.products
            })
        });
        const data = await res.json();
        if (!data.success) showToast('Değişiklik kaydedilemedi: ' + (data.message || ''), 'error');
    } catch (e) { 
        showToast('Sunucu kaydetme hatası!', 'error'); 
    }
}

function showToast(msg, type) {
    type = type || 'success';
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') toast.style.borderLeftColor = 'var(--accent-red)';
    toast.innerHTML = '<i class="fa-solid ' + (type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check') + '"></i> ' + msg;
    container.appendChild(toast);
    setTimeout(function(){ toast.remove(); }, 3000);
}