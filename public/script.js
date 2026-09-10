
const PRODUCTS = [

  {
    id: 'st-1',
    name: 'Yönetici Personel',
    price: 500,
    category: 'yetkiler',
    image: 'yonetici-personel.png',
    icon: 'fa-user-shield',
    desc: 'Türkiyem Adalet Gaming sunucusunda geçerli Yönetici Personel yetkisi ve özel Yetkili Paneli (P Panel) izinleri.',
    features: [
      'Birimlere katılımcı alma yetkisi (/tag)',
      'Rütbe Verme Paneli (/tag)',
      'Birim Yönetim Paneli (/dpanel)',
      'Özel Yetkili Panel (P Panel) & Özel Yetkili Tagı',
      'P Panel: Raporları okuma ve silme',
      'P Panel: Mute atma & Oyuncuyu dondurma',
      'P Panel: Oyuncuları izleme & Panelden hasar verme',
      'P Panel: Oyuncuların isimlerini değiştirme & Ekrana yazı atma',
      'P Panel: Can verme & Zırh verme',
      'P Panel: Oyuncuya ışınlanma & Oyuncuyu çekme',
      'P Panel: Oyundaki yetkili sohbete mesaj atabilme & Sohbeti temizleme'
    ],
    rules: [
      'Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.',
      'Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.',
      'Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.',
      'Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız.'
    ]
  },
  {
    id: 'st-2', name: 'Yönetim Ekibi', price: 800, category: 'yetkiler', icon: 'fa-users-gear',
    image: 'yonetim-ekibi.png',
    desc: 'Türkiyem Adalet Gaming sunucusunda geçerli Yönetim Ekibi yetkisi ve özel Yetkili Paneli (P Panel) izinleri.',
    features: [
      'Birimlere katılımcı alma yetkisi (/tag)',
      'Rütbe Verme Paneli (/tag)',
      'Birim Yönetim Paneli (/dpanel)',
      'Özel Yetkili Panel (P Panel) & Özel Yetkili Tağı',
      'P Panel: Raporları okuma ve silme',
      'P Panel: Kick(Kovma) atma',
      'P Panel: Mute atma',
      'P Panel: Skin verme',
      'P Panel: Silah verme',
      'P Panel: Oyuncuyu dondurma',
      'P Panel: Oyuncuları izleme',
      'P Panel: Oyuncuya panelden hasar verme',
      'P Panel: Oyuncuların isimlerini değiştirme',
      'P Panel: Oyuncunun ekranına yazı atma',
      'P Panel: Can verme & Zırh verme',
      'P Panel: Oyuncuya ışınlanma & Oyuncuyu çekme',
      'P Panel: Oyundaki yetkili sohbete mesaj atabilme & Sohbeti temizleme'
    ],
    rules: [
      'Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.',
      'Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.',
      'Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.',
      'Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız.'
    ]
  },
  {
    id: 'st-3', name: 'Üst Kademe Yönetim Ekibi', price: 1000, category: 'yetkiler', icon: 'fa-user-tie',
    image: 'ust-kademe-yonetim.png',
    desc: 'Türkiyem Adalet Gaming sunucusunda geçerli Üst Kademe Yönetim Ekibi yetkisi ve özel Yetkili Paneli (P Panel) izinleri.',
    features: [
      'Birimlere katılımcı alma yetkisi (/tag)',
      'Rütbe Verme Paneli (/tag)',
      'Birim Yönetim Paneli (/dpanel)',
      'Özel Yetkili Panel (P Panel) & Özel Yetkili Tağı',
      'P Panel: Raporları okuma ve silme',
      'P Panel: Kick(Kovma) atma',
      'P Panel: Mute atma',
      'P Panel: Skin verme',
      'P Panel: Silah verme',
      'P Panel: Oyuncuyu dondurma',
      'P Panel: Oyuncuları izleme',
      'P Panel: Oyuncuya panelden hasar verme',
      'P Panel: Oyuncuların isimlerini değiştirme',
      'P Panel: Oyuncunun ekranına yazı atma',
      'P Panel: Can verme & Zırh verme',
      'P Panel: Oyuncuya ışınlanma & Oyuncuyu çekme',
      'P Panel: Oyundaki yetkili sohbete mesaj atabilme & Sohbeti temizleme'
    ],
    rules: [
      'Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.',
      'Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.',
      'Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.',
      'Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız.'
    ]
  },
  {
    id: 'st-4', name: 'Yönetim Kurulu Üyesi', price: 1500, category: 'yetkiler', icon: 'fa-award',
    image: 'yonetim-kurulu-uyesi.png',
    desc: 'Türkiyem Adalet Gaming sunucusunda geçerli Yönetim Kurulu Üyesi yetkisi ve özel Yetkili Paneli (P Panel) izinleri.',
    features: [
      'Birimlere katılımcı alma yetkisi (/tag)',
      'Rütbe verme Paneli (/tag)',
      'Birim yönetim paneli (/dpanel)',
      'Özel Yetkili Panel (P Panel)',
      'Özel Yetkili Tağı',
      'Jail Panel (/jail)',
      'Superman (2X SHIFT)',
      'P Panel: Raporları okuma ve silme',
      'P Panel: Kick(Kovma) atma',
      'P Panel: IP Banlama',
      'P Panel: Serial Banlama',
      'P Panel: IP Ban açma',
      'P Panel: Serial Ban açma',
      'P Panel: Mute atma',
      'P Panel: Skin verme',
      'P Panel: Silah verme',
      'P Panel: Oyuncuyu dondurma',
      'P Panel: Oyuncuları İzleme',
      'P Panel: Oyuncuya panelden hasar verme',
      'P Panel: Oyuncuların İsimlerini değiştirme',
      'P Panel: Oyuncunun ekranına yazı atma',
      'P Panel: Can verme & Zırh Verme',
      'P Panel: Oyuncuya Işınlanma & Oyuncuyu çekme',
      'P Panel: Oyundaki yetkili sohbete mesaj atabilme',
      'P Panel: Sohbet temizleme'
    ],
    rules: [
      'Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.',
      'Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.',
      'Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.',
      'Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız.'
    ]
  },
  {
    id: 'st-5', name: 'Üst Kademe Yönetim Kurulu Üyesi', price: 2000, category: 'yetkiler', icon: 'fa-crown',
    image: 'ust-kademe-yonetim-kurulu.png',
    desc: 'Türkiyem Adalet Gaming sunucusunda geçerli Üst Kademe Yönetim Kurulu Üyesi yetkisi ve özel Yetkili Paneli (P Panel) izinleri.',
    features: [
      'Birimlere katılımcı alma yetkisi (/tag)',
      'Rütbe verme Paneli (/tag)',
      'Birim yönetim paneli (/dpanel)',
      'Özel Yetkili Panel (P Panel)',
      'Özel Yetkili Tağı',
      'Jail Panel (/jail)',
      'Superman (2X SHIFT)',
      'P Panel: Raporları okuma ve silme',
      'P Panel: Kick(Kovma) atma',
      'P Panel: IP Banlama',
      'P Panel: Serial Banlama',
      'P Panel: IP Ban açma',
      'P Panel: Serial Ban açma',
      'P Panel: Mute atma',
      'P Panel: Skin verme',
      'P Panel: Silah verme',
      'P Panel: Oyuncuyu dondurma',
      'P Panel: Oyuncuları İzleme',
      'P Panel: Oyuncuya panelden hasar verme',
      'P Panel: Oyuncuların İsimlerini değiştirme',
      'P Panel: Oyuncunun ekranına yazı atma',
      'P Panel: Can verme & Zırh Verme',
      'P Panel: Oyuncuya Işınlanma & Oyuncuyu çekme',
      'P Panel: Oyundaki yetkili sohbete mesaj atabilme',
      'P Panel: Sohbet temizleme'
    ],
    rules: [
      'Sunucudan çıkmanız veya banlanmanız durumunda yetkiniz geri VERİLMEZ.',
      'Satın almış olduğunuz ürünlerde hiçbir şekilde iade YAPILMAMAKTADIR.',
      'Sunucuda ilgilenmediğiniz takdirde yetkiniz süresiz olarak ÇEKİLİR.',
      'Yetkiyi satın aldığınız zaman discord sunucumuzda destek açınız.'
    ]
  },

  {
    id: 'oz-1', name: 'Gold Vip', price: 300, category: 'ozel-ayricaliklar', icon: 'fa-gem',
    image: 'gold-vip.png',
    desc: 'Gold VIP Yetki Paketi',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      'Yetki 1 aylık olarak size zimmetlenir. (~)',
      'Klan basesinde doğarsınız',
      'Telefonda SMS ve Arama yapma özelliği',
      '(~) = Troll / Rahatsız edici durumların devamı halinde yetkinizi kaybedersiniz.'
    ]
  },
  {
    id: 'oz-2', name: 'Silver Vip', price: 200, category: 'ozel-ayricaliklar', icon: 'fa-shield',
    image: 'silver-vip.png',
    desc: 'Silver VIP Yetki Paketi',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      'Yetki 1 aylık olarak size zimmetlenir. (~)',
      'Klan basesinde doğarsınız',
      '(~) = Troll / Rahatsız edici durumların devamı halinde yetkinizi kaybedersiniz.'
    ]
  },
  {
    id: 'oz-3', name: 'Bronz Vip', price: 100, category: 'ozel-ayricaliklar', icon: 'fa-medal',
    image: 'bronz-vip.png',
    desc: 'Bronz VIP Yetki Paketi',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      'Yetki 1 aylık olarak size zimmetlenir. (~)',
      'Klan basesinde doğarsınız',
      '(~) = Troll / Rahatsız edici durumların devamı halinde yetkinizi kaybedersiniz.'
    ]
  },
  {
    id: 'oz-4', name: 'Ek Klan Hakkı', price: 200, category: 'ozel-ayricaliklar', icon: 'fa-flag',
    image: 'ek-klan-hakki.png',
    desc: 'Ek Klan Hakkı Paketi',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Klan hakkınızın bittiği durumda size ekstradan bir klan hakkı sağlar. Bu sayede istediğiniz klana geçiş yapabilirsiniz.'
    ]
  },
  {
    id: 'oz-5', name: 'Hesap Kurtarma & Şifre Değiştirme', price: 200, category: 'ozel-ayricaliklar', icon: 'fa-key',
    image: 'hesap-kurtarma.png',
    desc: 'Hesap Kurtarma & Şifre Değiştirme Hizmeti',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Oyunda kullandığınız hesabı unuttuysanız yada şifresini değiştirmek istiyorsanız bu ürünü satın alabilirsiniz.'
    ]
  },
  {
    id: 'oz-6', name: 'Yetkili Uyarı Sildirme', price: 500, category: 'ozel-ayricaliklar', icon: 'fa-trash-can',
    image: 'yetkili-uyari-sildirme.png',
    desc: 'Yetkili Uyarı Sildirme Hizmeti',
    features: [
      'Alan yetkililerin tüm uyarıları silinecektir. Alan yetkili, Discord sunucumuzda üst yönetim talebi açsın.'
    ]
  },

  {
    id: 'dn-1', name: 'McLaren 720S Spider', price: 250, category: 'donate', icon: 'fa-car-side',
    image: 'mclaren-720s.jpg',
    desc: 'McLaren 720S Spider Araç',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Araç 1 aylık olarak size zimmetlenir.',
      'Aracın üstü animasyonlu şekilde açılıp kapanabilmektedir. Tuş: N',
      'Araç 100 km/h hızın üzerine çıktığında spoiler otomatik yükselmektedir.'
    ]
  },
  {
    id: 'dn-2', name: 'Ferrari California', price: 200, category: 'donate', icon: 'fa-car',
    image: 'ferrari-california.jpg',
    desc: 'Ferrari California Araç',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Araç 1 aylık olarak size zimmetlenir.',
      'Aracın üstü animasyonlu şekilde açılıp kapanabilmektedir. Tuş: N'
    ]
  },
  {
    id: 'dn-3', name: 'Buckingham Swift Retro', price: 250, category: 'donate', icon: 'fa-helicopter',
    image: 'luxury-helikopter.png',
    desc: 'Buckingham Swift Retro Helikopter',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Araç 1 aylık olarak size zimmetlenir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  },
  {
    id: 'dn-4', name: 'Ramiz Karaeski', price: 200, category: 'donate', icon: 'fa-user-ninja',
    image: 'ramiz-karaeski.png',
    desc: 'Ramiz Karaeski Karakter Görünümü',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  },
  {
    id: 'dn-5', name: 'Aslan Akbey', price: 200, category: 'donate', icon: 'fa-user-secret',
    image: 'aslan-akbey.png',
    desc: 'Aslan Akbey Karakter Görünümü',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  },
  {
    id: 'dn-6', name: 'Behzat Ç.', price: 200, category: 'donate', icon: 'fa-user-astronaut',
    image: 'behzat-c.png',
    desc: 'Behzat Ç. Karakter Görünümü',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  },
  {
    id: 'dn-7', name: 'Eşref Tek', price: 200, category: 'donate', icon: 'fa-user-large',
    image: 'esref-tek.png',
    desc: 'Eşref Tek Karakter Görünümü',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  },
  {
    id: 'dn-8', name: 'Kuzey Tekinoğlu', price: 200, category: 'donate', icon: 'fa-person',
    image: 'kuzey-tekinoglu.png',
    desc: 'Kuzey Tekinoğlu Karakter Görünümü',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  },
  {
    id: 'dn-9', name: 'Pala', price: 200, category: 'donate', icon: 'fa-glasses',
    image: 'pala.png',
    desc: 'Pala Karakter Görünümü',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  },
  {
    id: 'dn-10', name: 'Polat Alemdar', price: 200, category: 'donate', icon: 'fa-user-check',
    image: 'polat-alemdar.png',
    desc: 'Polat Alemdar Karakter Görünümü',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  },
  {
    id: 'dn-11', name: 'Reis', price: 200, category: 'donate', icon: 'fa-user-graduate',
    image: 'reis.png',
    desc: 'Reis Karakter Görünümü',
    features: [
      'Aldıktan sonra discord sunucumuzda destek talebi açınız.',
      'Yetki içeriği görseldedir.',
      '(SUNUCUDA KULLANMAK İÇİNDİR)'
    ]
  }
];

function getStoredCart() {
  try {
    const data = localStorage.getItem('tag_cart');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredCart(cartData) {
  try {
    localStorage.setItem('tag_cart', JSON.stringify(cartData));
  } catch (e) { }
}

let cart = getStoredCart();

document.addEventListener('DOMContentLoaded', async () => {

  try {
    const res = await fetch('/api/store-data?t=' + Date.now(), { cache: 'no-store' });
    const result = await res.json();
    if (result.success && result.data && result.data.products && result.data.products.length > 0) {
      PRODUCTS.length = 0;
      PRODUCTS.push(...result.data.products);
    }
  } catch (e) { }

  initDevToolsProtection();
  initNavigation();
  updateCartBadge();

  if (document.getElementById('productsGrid')) {
    initShopPage();
  }
  if (document.getElementById('productDetailContent')) {
    initDetailPage();
  }
  if (document.getElementById('cartPageTableWrap')) {
    initCartPage();
  }

  initCheckoutModal();
});

function initNavigation() {
  const toggleBtn = document.getElementById('grpMobileToggle');
  const navMenu = document.getElementById('grpHeaderNav');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').replace('#', '');
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
        if (history.replaceState) {
          history.replaceState(null, null, window.location.pathname + window.location.search);
        }
      }
    });
  });

  const header = document.querySelector('header.grp-header');
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.grp-nav a');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.pageYOffset > 30) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }

    if (!sections.length) return;

    let currentSectionId = 'hero';
    const scrollPos = window.pageYOffset + 150;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      link.classList.remove('active');

      if (currentSectionId === 'hero' || window.pageYOffset < 200) {
        if (href === '#' || href === 'index.html' || href === '/') {
          link.classList.add('active');
        }
      } else {
        if (href.endsWith('#' + currentSectionId)) {
          link.classList.add('active');
        }
      }
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const customIp = urlParams.get('ip') || '51.91.91.80:22003';
  document.querySelectorAll('a[href^="mtasa://"]').forEach(btn => {
    btn.href = 'mtasa://' + customIp;
  });
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) badge.innerText = totalQty;
}

const CATEGORY_NAMES = {
  'donate': 'DONATE ÜRÜNLERİ',
  'yetkiler': 'YETKİ PAKETLERİ',
  'ozel-ayricaliklar': 'ÖZEL AYRICALIKLAR'
};

function initShopPage() {
  const showcase = document.getElementById('categoryShowcase');
  const productsWrap = document.getElementById('categoryProductsWrap');
  const backBtn = document.getElementById('btnBackToCategories');
  const tabBtns = document.querySelectorAll('.grp-tab-btn');
  const catCards = document.querySelectorAll('.grp-cat-card');
  const catBtns = document.querySelectorAll('.grp-cat-btn');

  const countDonate = PRODUCTS.filter(p => p.category === 'donate').length;
  const countYetkiler = PRODUCTS.filter(p => p.category === 'yetkiler').length;
  const countOzel = PRODUCTS.filter(p => p.category === 'ozel-ayricaliklar').length;

  const bDonate = document.getElementById('catBadgeDonate');
  const bYetkiler = document.getElementById('catBadgeYetkiler');
  const bOzel = document.getElementById('catBadgeOzel');

  if (bDonate) bDonate.innerText = `${countDonate} Ürün Mevcut`;
  if (bYetkiler) bYetkiler.innerText = `${countYetkiler} Ürün Mevcut`;
  if (bOzel) bOzel.innerText = `${countOzel} Ürün Mevcut`;

  function openCategory(cat) {
    if (!cat) return;
    if (showcase) showcase.style.display = 'none';
    if (productsWrap) productsWrap.style.display = 'block';

    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const heading = document.getElementById('currentCategoryHeading');
    const countEl = document.getElementById('currentCategoryCount');
    if (heading) heading.innerText = CATEGORY_NAMES[cat] || cat.toUpperCase();

    const filtered = PRODUCTS.filter(p => p.category === cat);
    if (countEl) countEl.innerText = `${filtered.length} Ürün Listeleniyor`;

    renderProducts(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showAllCategories() {
    if (showcase) showcase.style.display = 'grid';
    if (productsWrap) productsWrap.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  catCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const cat = card.getAttribute('data-category');
      openCategory(cat);
    });
  });

  catBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.getAttribute('data-category');
      openCategory(cat);
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showAllCategories();
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      openCategory(cat);
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const requestedCat = urlParams.get('cat');
  if (requestedCat && ['donate', 'yetkiler', 'ozel-ayricaliklar'].includes(requestedCat)) {
    openCategory(requestedCat);
  }
}

function renderProducts(category) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = PRODUCTS.filter(p => p.category === category);

  grid.innerHTML = filtered.map(p => {
    const imgHtml = p.image
      ? `<img src="${p.image}" alt="${p.name}" class="grp-product-card-img">`
      : `<i class="fas ${p.icon}"></i>`;

    let priceHtml = `<div class="grp-product-price">${p.price} TL</div>`;
    if (p.oldPrice && p.oldPrice > p.price) {
      const pct = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
      priceHtml = `
        <div class="grp-product-price-wrap">
          <span class="grp-product-price">${p.price} TL</span>
          <span class="grp-product-old-price">${p.oldPrice} TL</span>
          <span class="grp-product-discount-badge">-%${pct}</span>
        </div>
      `;
    }

    return `
      <div class="grp-product-card" data-category="${p.category}">
        <div class="grp-product-icon-wrap">
          ${imgHtml}
        </div>
        <h3 class="grp-product-title">${p.name}</h3>
        ${priceHtml}
        <div class="grp-product-divider"></div>
        <div class="grp-product-footer">
          <a href="/urun-detay?id=${p.id}" class="grp-btn-card-action btn-filled">
            <i class="fas fa-eye"></i> İncele
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function initDetailPage() {
  detailQty = 1;
  const container = document.getElementById('productDetailContent');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'st-1';
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

  const breadcrumbTitle = document.getElementById('breadcrumbTitle');
  if (breadcrumbTitle) breadcrumbTitle.innerText = product.name;

  const imgHtml = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="grp-detail-img">`
    : `<i class="fas ${product.icon}"></i>`;

  const rulesHtml = product.rules ? `
    <div class="grp-product-rules-box">
      <h4><i class="fas fa-triangle-exclamation"></i> Teslimat & Satın Alım Şartları</h4>
      <ul>
        ${product.rules.map(r => `<li><i class="fas fa-exclamation-circle"></i> ${r}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  let detailPriceHtml = `<div class="grp-detail-price">${product.price} TL</div>`;
  if (product.oldPrice && product.oldPrice > product.price) {
    const pct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    detailPriceHtml = `
      <div class="grp-detail-price-wrap">
        <span class="grp-detail-price">${product.price} TL</span>
        <span class="grp-detail-old-price">${product.oldPrice} TL</span>
        <span class="grp-detail-discount-badge">-%${pct} İNDİRİM</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="grp-detail-left-column">
      <div class="grp-detail-image-box">
        ${imgHtml}
      </div>
      <div class="grp-detail-trust-card">
        <div class="grp-detail-actions">
          <div class="grp-detail-qty-wrap">
            <button type="button" id="btnQtyMinus">-</button>
            <span id="detailQtyVal">1</span>
            <button type="button" id="btnQtyPlus">+</button>
          </div>
          <button type="button" class="grp-btn-primary" id="btnAddToCartDetail">
            <i class="fas fa-cart-plus"></i> Sepete Ekle
          </button>
        </div>

        <div class="grp-trust-divider" style="height: 1px; background: rgba(255, 255, 255, 0.08); margin: 4px 0;"></div>

        <div class="grp-trust-item">
          <i class="fas fa-shield-halved"></i>
          <div>
            <strong>256-Bit SSL Güvenli Ödeme</strong>
            <span>Ödeme işlemleriniz Shopier 3D Secure güvencesiyle yapılır.</span>
          </div>
        </div>
        <div class="grp-trust-item">
          <i class="fab fa-discord"></i>
          <div>
            <strong>7/24 Discord Destek</strong>
            <span>Satın alım öncesi ve sonrası canlı destek sunucumuzda.</span>
          </div>
        </div>
      </div>
    </div>
    <div class="grp-detail-info-box">
      <h1 class="grp-detail-title">${product.name}</h1>
      ${detailPriceHtml}
      <p class="grp-detail-desc">${product.desc}</p>

      <h4 style="color:#fff; font-weight:800; margin-bottom:10px;"><i class="fas fa-list-check" style="color:var(--grp-primary);"></i> Paket İzinleri & Özellikleri:</h4>
      <ul class="grp-detail-features">
        ${(product.features || []).map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
      </ul>

      ${rulesHtml}
    </div>
  `;

  const btnMinus = document.getElementById('btnQtyMinus');
  const btnPlus = document.getElementById('btnQtyPlus');
  const btnAdd = document.getElementById('btnAddToCartDetail');

  if (btnMinus) btnMinus.addEventListener('click', () => window.changeDetailQty(-1));
  if (btnPlus) btnPlus.addEventListener('click', () => window.changeDetailQty(1));
  if (btnAdd) btnAdd.addEventListener('click', () => window.addDetailToCart(product.id));
}

const MAX_QTY = 5;

let detailQty = 1;
window.changeDetailQty = function (delta) {
  detailQty = Math.min(MAX_QTY, Math.max(1, detailQty + delta));
  const qtyElem = document.getElementById('detailQtyVal');
  if (qtyElem) qtyElem.innerText = detailQty;
};

window.addDetailToCart = function (productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    if (existing.qty >= MAX_QTY) {
      showToast(`Bir üründen en fazla ${MAX_QTY} adet ekleyebilirsiniz!`);
      return;
    }
    existing.qty = Math.min(MAX_QTY, existing.qty + detailQty);
  } else {
    cart.push({ ...product, qty: Math.min(MAX_QTY, detailQty) });
  }

  saveStoredCart(cart);
  updateCartBadge();
  showToast(`"${product.name}" (${detailQty} Adet) Sepete Eklendi!`, true);
};

window.buyDetailNow = function (productId) {
  window.addDetailToCart(productId);
  window.location.href = '/sepet';
};

window.addToCart = function (productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    if (existing.qty >= MAX_QTY) {
      showToast(`Bir üründen en fazla ${MAX_QTY} adet ekleyebilirsiniz!`);
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveStoredCart(cart);
  updateCartBadge();
  showToast(`"${product.name}" Sepete Eklendi!`, true);
};

function initCartPage() {
  renderCartPage();
}

function renderCartPage() {
  const tableWrap = document.getElementById('cartPageTableWrap');
  const subtotalElem = document.getElementById('cartPageSubtotal');
  const totalElem = document.getElementById('cartPageTotal');
  const checkoutBtn = document.getElementById('cartPageCheckoutBtn');

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (subtotalElem) subtotalElem.innerText = `${totalPrice.toLocaleString('tr-TR')} TL`;
  if (totalElem) totalElem.innerText = `${totalPrice.toLocaleString('tr-TR')} TL`;
  const termsCheckbox = document.getElementById('cartTermsCheckbox');
  const updateCheckoutState = () => {
    if (checkoutBtn) {
      const isChecked = termsCheckbox ? termsCheckbox.checked : true;
      checkoutBtn.disabled = cart.length === 0 || !isChecked;
    }
  };

  if (termsCheckbox) {
    termsCheckbox.onchange = updateCheckoutState;
  }

  updateCheckoutState();

  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      if (termsCheckbox && !termsCheckbox.checked) {
        showToast('Devam etmek için Hizmet Sözleşmesini kabul etmelisiniz!');
        return;
      }
      const modal = document.getElementById('checkoutModal');
      const checkoutTotal = document.getElementById('checkoutTotalPrice');
      if (checkoutTotal) checkoutTotal.innerText = `${totalPrice.toLocaleString('tr-TR')} TL`;
      if (modal) modal.classList.add('open');
    };
  }

  if (!tableWrap) return;

  if (cart.length === 0) {
    tableWrap.innerHTML = `
      <div class="grp-cart-empty">
        <i class="fas fa-cart-arrow-down"></i>
        <p>Sepetinizde henüz ürün bulunmuyor.<br>Mağazayı ziyaret edip ürün ekleyebilirsiniz.</p>
      </div>
    `;
    return;
  }

  tableWrap.innerHTML = cart.map(item => {
    const imgOrIcon = item.image
      ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;">`
      : `<i class="fas ${item.icon}"></i>`;

    return `
      <div class="grp-cart-page-item" data-id="${item.id}">
        <div class="grp-cart-item-icon">
          ${imgOrIcon}
        </div>
        <div class="grp-cart-item-details">
          <h3>${item.name}</h3>
          <span>Birim Fiyat: ${item.price} TL</span>
        </div>
        <div class="grp-cart-item-controls">
          <button type="button" class="grp-btn-qty grp-btn-minus" data-id="${item.id}">-</button>
          <span class="grp-cart-item-qty">${item.qty}</span>
          <button type="button" class="grp-btn-qty grp-btn-plus" data-id="${item.id}">+</button>
        </div>
        <div class="grp-cart-item-total">
          ${item.price * item.qty} TL
        </div>
        <button type="button" class="grp-btn-remove grp-btn-del" data-id="${item.id}" title="Sil">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  }).join('');

  tableWrap.querySelectorAll('.grp-btn-minus').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const id = this.getAttribute('data-id');
      updateCartQty(id, -1);
    });
  });
  tableWrap.querySelectorAll('.grp-btn-plus').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const id = this.getAttribute('data-id');
      updateCartQty(id, 1);
    });
  });
  tableWrap.querySelectorAll('.grp-btn-del').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const id = this.getAttribute('data-id');
      removeCartItem(id);
    });
  });
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (delta > 0 && item.qty >= MAX_QTY) {
    showToast(`Bir üründen en fazla ${MAX_QTY} adet ekleyebilirsiniz!`);
    return;
  }

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveStoredCart(cart);
  updateCartBadge();
  renderCartPage();
}

function removeCartItem(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveStoredCart(cart);
  updateCartBadge();
  renderCartPage();
  showToast('Ürün sepetten çıkarıldı.');
}

window.updateCartPageQty = updateCartQty;
window.removeCartPageItem = removeCartItem;

let currentOrderCode = '';

function initCheckoutModal() {
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');

  const payFailBtn = document.getElementById('payFailBtn');
  const successModal = document.getElementById('successModal');
  const failureModal = document.getElementById('failureModal');

  const openModal = (modal) => modal?.classList.add('open');
  const closeModal = (modal) => modal?.classList.remove('open');

  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => closeModal(checkoutModal));

  if (checkoutForm) {
    function setError(id, msg) {
      const el = document.getElementById(id);
      if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
      const input = document.getElementById(id.replace('err', 'buyer').toLowerCase()) ||
        document.getElementById({ errName: 'buyerName', errEmail: 'buyerEmail', errPhone: 'buyerPhone' }[id]);
      if (input) input.classList.toggle('grp-input-error', !!msg);
    }
    function clearErrors() {
      ['errName', 'errEmail', 'errPhone'].forEach(id => setError(id, ''));
    }

    function validateName(val) {
      const trimmed = val.trim();
      if (!trimmed) return 'Ad Soyad boş bırakılamaz.';
      if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(trimmed)) return 'Ad Soyad yalnızca harf içerebilir.';
      const words = trimmed.split(/\s+/).filter(w => w.length > 0);
      if (words.length < 2) return 'Lütfen hem adınızı hem soyadınızı girin.';
      if (words.some(w => w.length < 2)) return 'Her kelime en az 2 harf olmalıdır.';
      if (/(.)\1{3,}/.test(trimmed)) return 'Geçersiz isim formatı.';
      return '';
    }

    function validateEmail(val) {
      const trimmed = val.trim().toLowerCase();
      if (!trimmed) return 'E-posta adresi boş bırakılamaz.';
      if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(trimmed)) return 'Geçerli bir e-posta adresi girin.';
      const [local, domain] = trimmed.split('@');
      if (local.length < 2) return 'E-posta adresi çok kısa.';
      if (/(.)\1{4,}/.test(local)) return 'Geçersiz e-posta (spam algılandı).';
      const fakeDomains = ['mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
        'throwam.com', 'fakeinbox.com', 'yopmail.com', 'maildrop.cc', 'sharklasers.com', 'spam4.me', 'trashmail.com'];
      if (fakeDomains.some(d => domain.endsWith(d))) return 'Geçici e-posta adresleri kabul edilmemektedir.';
      if (!domain.includes('.')) return 'Geçerli bir e-posta adresi girin.';
      return '';
    }

    function validatePhone(val) {
      const trimmed = val.trim().replace(/\s|-/g, '');
      if (!trimmed) return 'Telefon numarası boş bırakılamaz.';
      if (trimmed.startsWith('0')) return 'Telefon numarasını başında 0 olmadan giriniz (Örn: 5551112233).';
      if (!/^\d+$/.test(trimmed)) return 'Telefon numarası yalnızca rakam içermelidir.';
      if (trimmed.length !== 10) return 'Telefon numarası başında 0 olmadan tam 10 hane olmalıdır (Örn: 5551112233).';
      if (!trimmed.startsWith('5')) return 'Türk cep numarası 5 ile başlamalıdır (Örn: 5551112233).';
      if (/^(.)\1+$/.test(trimmed)) return 'Geçersiz telefon numarası.';
      return '';
    }

    [
      ['buyerName', 'errName', validateName],
      ['buyerEmail', 'errEmail', validateEmail],
      ['buyerPhone', 'errPhone', validatePhone]
    ].forEach(([inputId, errId, validator]) => {
      const inp = document.getElementById(inputId);
      if (inp) {
        inp.addEventListener('input', () => {
          if (!inp.value.trim()) {
            setError(errId, '');
          } else {
            setError(errId, validator(inp.value));
          }
        });
        inp.addEventListener('blur', () => {
          setError(errId, validator(inp.value));
        });
      }
    });

    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const name = document.getElementById('buyerName')?.value || '';
      const email = document.getElementById('buyerEmail')?.value || '';
      const phone = document.getElementById('buyerPhone')?.value || '';

      const errName = validateName(name);
      const errEmail = validateEmail(email);
      const errPhone = validatePhone(phone);

      setError('errName', errName);
      setError('errEmail', errEmail);
      setError('errPhone', errPhone);

      if (errName || errEmail || errPhone) return;

      const btn = document.getElementById('paySuccessBtn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shopier Sayfasına Yönlendiriliyorsunuz...';
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const res = await fetch('/api/shopier/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            items: cart,
            buyerName: name,
            buyerEmail: email,
            buyerPhone: phone
          })
        });
        clearTimeout(timeoutId);
        const data = await res.json();
        showToast(data.success ? 'Form alindi, yonlendiriliyor...' : ('HATA: ' + (data.message || 'Bilinmeyen hata')));
        if (data.success && data.formHtml) {
          closeModal(checkoutModal);
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = data.formHtml;
          const form = tempDiv.querySelector('form');
          if (form) {
            form.style.display = 'none';
            document.body.appendChild(form);
            setTimeout(() => { HTMLFormElement.prototype.submit.call(form); }, 500);
          } else {
            showToast('Ödeme formu bulunamadı.', 'error');
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = '<i class="fas fa-lock"></i> Shopier ile Güvenli Öde';
            }
          }
        } else {
          showToast(data.message || 'Ödeme başlatılamadı.', 'error');
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-lock"></i> Shopier ile Güvenli Öde';
          }
        }
      } catch (err) {
        showToast('Sunucuyla bağlantı kurulamadı!', 'error');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-lock"></i> Shopier ile Güvenli Öde';
        }
      }
    });
  }

  if (payFailBtn) {
    payFailBtn.addEventListener('click', () => {
      closeModal(checkoutModal);
      openModal(failureModal);
    });
  }

  const copyBtn = document.getElementById('copyOrderCodeBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(currentOrderCode)
          .then(() => showToast(`Sipariş Kodu Kopyalandı! (${currentOrderCode})`))
          .catch(() => fallbackCopy(currentOrderCode));
      } else {
        fallbackCopy(currentOrderCode);
      }
    });
  }

  document.getElementById('closeSuccessBtn')?.addEventListener('click', () => closeModal(successModal));
  document.getElementById('closeFailureBtn')?.addEventListener('click', () => closeModal(failureModal));
  document.getElementById('retryPaymentBtn')?.addEventListener('click', () => {
    closeModal(failureModal);
    openModal(checkoutModal);
  });
}

function initDevToolsProtection() {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());
  document.addEventListener('selectstart', (e) => {
    if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      e.keyCode === 123 ||
      (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c', 'K', 'k', 'E', 'e'].includes(e.key)) ||
      (e.ctrlKey && ['u', 'U', 's', 'S', 'p', 'P'].includes(e.key))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  setInterval(() => {
    if (window.console) {
      console.log = function () { };
      console.warn = function () { };
      console.error = function () { };
      console.info = function () { };
      console.dir = function () { };
      console.table = function () { };
    }
  }, 300);
}

let toastTimeout;
function showToast(message, showCartBtn = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const cartBtn = document.getElementById('toastCartBtn');
  if (!toast) return;

  if (toastMsg) toastMsg.innerText = message;

  if (cartBtn) {
    cartBtn.style.display = showCartBtn ? 'inline-flex' : 'none';
  }

  clearTimeout(toastTimeout);

  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function fallbackCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(`Kopyalandı! (${text})`);
  } catch (err) {
    showToast('Kopyalama Başarısız!');
  }
  document.body.removeChild(tempInput);
}
