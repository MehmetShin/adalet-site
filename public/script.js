function copyIpAddress() {
  const ipText = document.getElementById('serverIp').innerText;
  navigator.clipboard.writeText(ipText).then(() => {
    showToast('IP Adresi Kopyalandı! (' + ipText + ')');
  }).catch(() => {
    const tempInput = document.createElement('input');
    tempInput.value = ipText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('IP Adresi Kopyalandı!');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ipParam = urlParams.get('ip');

  if (ipParam) {
    const ipElement = document.getElementById('serverIp');
    if (ipElement) ipElement.innerText = ipParam;

    const playButtons = document.querySelectorAll('a[href^="mtasa://"]');
    playButtons.forEach(btn => {
      btn.href = 'mtasa://' + ipParam;
    });

    if (urlParams.get('auto') === 'true') {
      setTimeout(() => {
        window.location.href = 'mtasa://' + ipParam;
      }, 500);
    }
  }
});
