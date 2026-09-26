window.onTurnstileSuccess = function (token) {
  fetch('/api/verify-turnstile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: token })
  })
    .then(res => {
      if (!res.ok) {
        unlockSite();
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        unlockSite();
      } else if (data) {
        alert('Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.');
      }
    })
    .catch(() => {
      unlockSite();
    });
};

function unlockSite() {
  sessionStorage.setItem('turnstile_verified', 'true');
  const overlay = document.getElementById('turnstileOverlay');
  if (overlay) {
    overlay.classList.add('verified');
    overlay.style.pointerEvents = 'none';
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.classList.remove('turnstile-locked');
    }, 300);
  } else {
    document.body.classList.remove('turnstile-locked');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('turnstile_verified') === 'true') {
    unlockSite();
  } else {
    document.body.classList.add('turnstile-locked');
    setTimeout(() => {
      unlockSite();
    }, 1500);
  }

  initDevToolsProtection();
  initNavigation();
  initMtaConnectButtons();
  checkAutoConnect();
});

function openConnectModal(ip = '178.32.203.118:22003') {
  let modal = document.getElementById('mtaConnectModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'mtaConnectModal';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 20px;
      font-family: 'Poppins', sans-serif;
    `;
    modal.innerHTML = `
      <div style="
        width: 100%;
        max-width: 440px;
        background: #140b06;
        border: 1px solid #ff6b00;
        border-radius: 20px;
        padding: 30px 24px;
        text-align: center;
        box-shadow: 0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(255,107,0,0.3);
        position: relative;
        color: #fff;
      ">
        <button id="closeMtaModalBtn" style="
          position: absolute;
          top: 16px;
          right: 18px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 24px;
          cursor: pointer;
          line-height: 1;
        ">&times;</button>
        
        <div style="font-size: 42px; color: #ff6b00; margin-bottom: 12px;">
          <i class="fas fa-rocket"></i>
        </div>
        
        <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 6px; color: #fff; letter-spacing: 0.5px;">
          TÜRKİYEM ADALET GAMİNG
        </h3>
        <p style="font-size: 13.5px; color: rgba(255,255,255,0.7); margin-bottom: 20px;">
          Aşağıdaki butona tıklayarak oyuna direkt giriş yapabilirsiniz.
        </p>

        <div style="
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,107,0,0.35);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
          font-family: monospace;
          font-size: 17px;
          color: #ff962d;
          font-weight: 700;
          letter-spacing: 1px;
        ">
          ${ip}
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a id="directMtaLink" href="mtasa://${ip}" style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(135deg, #ff7b00, #ff4500);
            color: #fff;
            padding: 14px 20px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(255,107,0,0.4);
          ">
            <i class="fas fa-play"></i> Oyuna Doğrudan Bağlan (mtasa://)
          </a>

          <button id="copyMtaIpBtn" style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
          ">
            <i class="fas fa-copy"></i> IP Adresini Kopyala
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#closeMtaModalBtn').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.querySelector('#copyMtaIpBtn').addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ip).catch(() => {});
      }
      this.innerHTML = '<i class="fas fa-check" style="color:#00d282;"></i> IP Kopyalandı!';
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-copy"></i> IP Adresini Kopyala';
      }, 2000);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  } else {
    const directLink = modal.querySelector('#directMtaLink');
    if (directLink) directLink.setAttribute('href', `mtasa://${ip}`);
    modal.style.display = 'flex';
  }
}

function initMtaConnectButtons() {
  const selectors = [
    'a[href^="mtasa:"]',
    '.grp-login-button',
    '.grp-btn-primary',
    '.grp-btn-faction'
  ];

  document.querySelectorAll(selectors.join(', ')).forEach(button => {
    // Modal içindeki butonları tamamen hariç tut ki varsayılan tıklama engellenmesin!
    if (button.closest('#mtaConnectModal')) return;

    const href = button.getAttribute('href') || '';
    if (href.includes('discord') || href.includes('shopier')) return;

    button.style.cursor = 'pointer';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let targetIp = '178.32.203.118:22003';
      if (href.startsWith('mtasa://')) {
        targetIp = href.replace('mtasa://', '');
      }

      openConnectModal(targetIp);
    });
  });
}

function checkAutoConnect() {
  const urlParams = new URLSearchParams(window.location.search);
  const ip = urlParams.get('ip') || '178.32.203.118:22003';
  const auto = urlParams.get('auto');

  if (auto === 'true') {
    setTimeout(() => {
      openConnectModal(ip);
    }, 400);
  }
}

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
      if (href === '#' + currentSectionId || (currentSectionId === 'hero' && href === '/')) {
        link.classList.add('active');
      }
    });
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
