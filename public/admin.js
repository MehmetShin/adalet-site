
let currentStoreData = {
    shopierEarnings: 145800,
    products: []
};

let csrfToken = '';

const DEFAULT_PRODUCTS = [
    {
        id: 'st-1', name: 'Yönetici Personel', price: 500, category: 'yetkiler', image: 'yonetici-personel.png',
        desc: 'Türkiyem Adalet Gaming sunucusunda geçerli Yönetici Personel yetkisi.',
        features: ['Birimlere katılımcı alma yetkisi (/tag)', 'Rütbe Verme Paneli (/tag)', 'Özel Yetkili Panel (P Panel)']
    },
    {
        id: 'st-2', name: 'Yönetim Ekibi', price: 800, category: 'yetkiler', image: 'yonetim-ekibi.png',
        desc: 'Türkiyem Adalet Gaming sunucusunda geçerli Yönetim Ekibi yetkisi.',
        features: ['Birim Yönetim Paneli (/dpanel)', 'Özel Yetkili Panel (P Panel)', 'P Panel: Kick & Mute atma']
    },
    {
        id: 'oz-1', name: 'Gold Vip', price: 300, category: 'ozel-ayricaliklar', image: 'gold-vip.png',
        desc: 'Gold VIP Yetki Paketi', features: ['Klan basesinde doğma', 'Telefonda SMS ve Arama yapma']
    },
    {
        id: 'dn-1', name: 'McLaren 720S Spider', price: 250, category: 'donate', image: 'mclaren-720s.jpg',
        desc: 'McLaren 720S Spider Araç', features: ['Animasyonlı açılır tavan (N)', 'Otomatik spoiler']
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
                const data = await res.json();

                if (data.success) {
                    csrfToken = data.csrfToken || '';
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

    const earningsForm = document.getElementById('earningsForm');
    if (earningsForm) {
        earningsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newVal = parseFloat(document.getElementById('newEarningsInput').value) || 0;
            currentStoreData.shopierEarnings = newVal;
            await persistDataToServer();
            closeEarningsModal();
            updateMetrics();
            showToast('Shopier kazancı güncellendi.');
        });
    }
});

async function checkAuthStatus() {
    try {
        const res = await fetch('/api/admin/check-auth');
        const data = await res.json();
        if (data.authenticated) {
            csrfToken = data.csrfToken || '';
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
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('dashboardSection').style.display = 'none';
}

function showDashboardView() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'flex';
}

async function loadAdminStoreData() {
    try {
        const res = await fetch('/api/store-data');
        const result = await res.json();
        if (result.success && result.data) {
            currentStoreData.shopierEarnings = result.data.shopierEarnings || 145800;
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
        const res = await fetch('/api/admin/audit-logs');
        const result = await res.json();
        if (result.success && result.logs && result.logs.length > 0) {
            tbody.innerHTML = result.logs.map(log => {
                const dateStr = new Date(log.timestamp).toLocaleString('tr-TR');
                const safeDetails = escapeHtml(log.details || '');
                const safeType = escapeHtml(log.type || '');
                const safeIp = escapeHtml(log.ip || '');

                return `
          <tr>
            <td style="white-space:nowrap; color:var(--text-muted); font-size:12px;">${dateStr}</td>
            <td><strong>${safeType}</strong></td>
            <td><code style="background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">${safeIp}</code></td>
            <td><span class="status-badge ${log.status}">${log.status}</span></td>
            <td style="color:#d69e2e;">${safeDetails}</td>
          </tr>
        `;
            }).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">Henüz kaydedilmiş güvenlik günlüğü yok.</td></tr>`;
        }
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--accent-red); padding:20px;">Loglar çekilirken hata oluştu.</td></tr>`;
    }
}

async function clearAuditLogs() {
    if (!confirm('Güvenlik denetim günlüklerini temizlemek istediğinize emin misiniz?')) return;
    try {
        const res = await fetch('/api/admin/clear-logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-CSRF-Token': csrfToken
            }
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
    return str.replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

function updateMetrics() {
    const earningsEl = document.getElementById('shopierEarningsVal');
    if (earningsEl) {
        earningsEl.textContent = '₺' + currentStoreData.shopierEarnings.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    }

    const prods = currentStoreData.products || [];
    document.getElementById('totalProductsVal').textContent = prods.length;

    const discounted = prods.filter(p => p.oldPrice && p.oldPrice > p.price).length;
    document.getElementById('discountedProductsVal').textContent = discounted;
}

function renderAdminProducts() {
    const container = document.getElementById('adminProductsContainer');
    if (!container) return;

    const prods = currentStoreData.products || [];

    if (prods.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">Henüz ürün eklenmemiş.</div>`;
        return;
    }

    container.innerHTML = prods.map(p => `
    <div class="product-admin-card" id="prod-card-${p.id}">
      <div class="prod-img-box">
        <span class="badge-cat">${escapeHtml(p.category || 'genel')}</span>
        <img src="${escapeHtml(p.image || 'logo.png')}" alt="${escapeHtml(p.name)}" onerror="this.src='logo.png'">
      </div>

      <div class="prod-body">
        <div class="prod-title">${escapeHtml(p.name)}</div>
        <div class="prod-desc">${escapeHtml(p.desc || '')}</div>

        <div class="price-tag-wrap">
          <span class="curr-price">₺${p.price}</span>
          ${p.oldPrice ? `<span class="old-price">₺${p.oldPrice}</span>` : ''}
        </div>

        <div class="card-actions">
          <button class="btn-card-edit" onclick="editProduct('${p.id}')">
            <i class="fa-solid fa-pen-to-square"></i> Düzenle
          </button>
          <button class="btn-card-delete" onclick="deleteProduct('${p.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function openProductModal() {
    document.getElementById('modalHeaderTitle').textContent = 'Yeni Ürün Ekle';
    document.getElementById('prodEditId').value = '';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function editProduct(id) {
    const prod = currentStoreData.products.find(p => p.id === id);
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
    const features = featuresRaw.split('\n').map(f => f.trim()).filter(f => f.length > 0);

    if (editId) {

        const idx = currentStoreData.products.findIndex(p => p.id === editId);
        if (idx !== -1) {
            currentStoreData.products[idx] = {
                ...currentStoreData.products[idx],
                name, category, price, oldPrice, image, desc, features
            };
        }
    } else {

        const newProd = {
            id: 'prod-' + Date.now(),
            name, category, price, oldPrice, image, desc, features
        };
        currentStoreData.products.unshift(newProd);
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
    currentStoreData.products = currentStoreData.products.filter(p => p.id !== id);
    await persistDataToServer();
    renderAdminProducts();
    updateMetrics();
    loadAuditLogs();
    showToast('Ürün silindi.');
}

function openEarningsModal() {
    document.getElementById('newEarningsInput').value = currentStoreData.shopierEarnings;
    document.getElementById('earningsModal').style.display = 'flex';
}

function closeEarningsModal() {
    document.getElementById('earningsModal').style.display = 'none';
}

async function persistDataToServer() {
    try {
        const res = await fetch('/api/admin/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-CSRF-Token': csrfToken
            },
            body: JSON.stringify({
                shopierEarnings: currentStoreData.shopierEarnings,
                products: currentStoreData.products
            })
        });
        const data = await res.json();
        if (!data.success) {
            showToast('Değişiklik kaydedilemedi: ' + data.message, 'error');
        }
    } catch (e) {
        showToast('Sunucu kaydetme hatası!', 'error');
    }
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') toast.style.borderLeftColor = 'var(--accent-red)';
    toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}"></i> ${msg}`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
