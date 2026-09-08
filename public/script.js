document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('grpMobileToggle');
  const navMenu = document.getElementById('grpHeaderNav');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.grp-nav a');

  const header = document.querySelector('header.grp-header');
  const onScroll = () => {
    const scrollY = window.pageYOffset;
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
  const urlParams = new URLSearchParams(window.location.search);
  const customIp = urlParams.get('ip') || '51.91.91.80:22003';
  const ipElement = document.getElementById('serverIp');
  if (ipElement && urlParams.get('ip')) {
    ipElement.innerText = customIp;
  }

  const playButtons = document.querySelectorAll('a[href^="mtasa://"]');
  playButtons.forEach(btn => {
    btn.href = 'mtasa://' + customIp;
  });

  if (urlParams.get('auto') === 'true') {
    const targetUrl = 'mtasa://' + customIp;
    window.location.assign(targetUrl);
  }
});
function copyIpAddress() {
  const ipElement = document.getElementById('serverIp');
  if (!ipElement) return;

  const ipText = ipElement.innerText.trim();

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(ipText)
      .then(() => showToast(`IP Adresi Kopyalandı! (${ipText})`))
      .catch(() => fallbackCopy(ipText));
  } else {
    fallbackCopy(ipText);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(`IP Adresi Kopyalandı! (${text})`);
  } catch (err) {
    showToast('Kopyalama Başarısız!');
  }
  document.body.removeChild(tempInput);
}
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;

  if (toastMsg) toastMsg.innerText = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('dragstart', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
    (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))
  ) {
    e.preventDefault();
  }
});

console.log('%cDUR!', 'color: red; font-size: 40px; font-weight: bold; -webkit-text-stroke: 1px black;');
console.log('%cBu alan sadece geliştiriciler içindir. İzinsiz işlem yapılması yasaktır!', 'color: #ff6b00; font-size: 16px; font-weight: bold;');