window.onTurnstileSuccess = function (token) {
  fetch('/api/verify-turnstile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: token })
  })
    .then(res => {
      if (!res.ok) {
        // API henüz hazır değilse veya static yayınlanıyorsa yine de geçişe izin ver
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
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.classList.remove('turnstile-locked');
    }, 500);
  } else {
    document.body.classList.remove('turnstile-locked');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('turnstile_verified') === 'true') {
    const overlay = document.getElementById('turnstileOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.classList.remove('turnstile-locked');
  } else {
    document.body.classList.add('turnstile-locked');
  }

  initDevToolsProtection();
  initNavigation();
  checkAutoConnect();
});

function checkAutoConnect() {
  const urlParams = new URLSearchParams(window.location.search);
  const ip = urlParams.get('ip') || '178.32.203.118:22003';
  const auto = urlParams.get('auto');

  if (auto === 'true') {
    setTimeout(() => {
      window.location.href = `mtasa://${ip}`;
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
