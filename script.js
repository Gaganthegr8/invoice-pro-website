// ═══════════════ OS DETECTION ═══════════════
function detectOS() {
  const ua = navigator.userAgent || navigator.vendor || '';
  if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(ua)) return 'mac';
  if (/Win32|Win64|Windows|WinCE/.test(ua)) return 'windows';
  return 'unknown';
}

// Installers are hosted on GitHub Releases (not in this repo) because
// GitHub blocks files over 100MB in regular commits. Update these two
// URLs whenever you publish a new release with new installer files.
const MAC_DMG = 'https://github.com/Gaganthegr8/invoice-pro-website/releases/download/v1.1.0/Invoice-Pro-1.1.0.dmg';
const WIN_EXE = 'https://github.com/Gaganthegr8/invoice-pro-website/releases/download/v1.1.0/Invoice-Pro-Setup-1.1.0.exe';

const appleIcon = `<path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-2.01 1.59-3.013 1.59-.12 0-.23-.02-.3-.03-.014-.1-.04-.34-.04-.6 0-1.14.572-2.27 1.207-2.98.766-.86 2.103-1.51 3.07-1.55.027.13.053.33.053.49zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.235-1.01 3.902-1.01.633 0 2.91.06 4.41 2.19-.116.075-2.336 1.36-2.336 4.05 0 3.1 2.694 4.2 2.78 4.23-.02.054-.43 1.46-1.42 2.91"/>`;
const winIcon   = `<path d="M3 5.5l7.5-1v7.4H3V5.5zm8.5-1.13L21 3v8.9H11.5V4.37zM3 12.9h7.5v7.4l-7.5-1.06v-6.34zM11.5 13h9.5v8.9l-9.5-1.34V13z"/>`;

function setupDownloadButtons() {
  const os = detectOS();
  const primaryBtn   = document.getElementById('primary-download');
  const primaryIcon  = document.getElementById('primary-os-icon');
  const primaryLabel = document.getElementById('primary-download-label');
  const primarySub   = document.getElementById('primary-download-sub');
  const secondaryBtn = document.getElementById('secondary-download');
  const secondaryLabel = document.getElementById('secondary-download-label');

  if (os === 'windows') {
    primaryLabel.textContent = 'Download for Windows';
    primarySub.textContent = 'Windows 10 & 11 · v1.1.0';
    primaryIcon.innerHTML = winIcon;
    primaryBtn.onclick = () => window.location.href = WIN_EXE;

    secondaryLabel.textContent = 'Download for Mac';
    secondaryBtn.href = MAC_DMG;
  } else {
    // default to Mac (mac or unknown)
    primaryLabel.textContent = 'Download for Mac';
    primarySub.textContent = 'Apple Silicon & Intel · v1.1.0';
    primaryIcon.innerHTML = appleIcon;
    primaryBtn.onclick = () => window.location.href = MAC_DMG;

    secondaryLabel.textContent = 'Download for Windows';
    secondaryBtn.href = WIN_EXE;
  }
}

// ═══════════════ HERO INVOICE FILL ANIMATION ═══════════════
function animateInvoiceCard() {
  const card = document.getElementById('hero-invoice');
  if (!card) return;
  const lineAmounts = card.querySelectorAll('.ic-amt');
  const totalAmount = card.querySelector('.ic-total-amt');
  const stamp = document.getElementById('ic-stamp');
  let played = false;

  function play() {
    if (played) return;
    played = true;
    lineAmounts.forEach((el, i) => {
      setTimeout(() => {
        el.textContent = el.dataset.final;
        el.style.opacity = '1';
      }, 250 + i * 220);
    });
    const totalDelay = 250 + lineAmounts.length * 220;
    setTimeout(() => {
      if (totalAmount) totalAmount.textContent = totalAmount.dataset.final;
    }, totalDelay);
    setTimeout(() => {
      stamp.classList.add('show');
    }, totalDelay + 350);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        play();
        observer.disconnect();
      }
    });
  }, { threshold: 0.15 });

  observer.observe(card);

  // Fallback: if card is already in view on load (common on short mobile viewports
  // where hero content exceeds the fold), play immediately without waiting for scroll.
  const rect = card.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    play();
    observer.disconnect();
  }
}

// ═══════════════ SMOOTH ANCHOR OFFSET (sticky nav) ═══════════════
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDownloadButtons();
  animateInvoiceCard();
  setupSmoothScroll();
});
