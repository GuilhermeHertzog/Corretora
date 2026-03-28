/* ── SCROLL REVEAL ───────────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── DRAG SCROLL GALLERY ──────────────────────────────────────────────── */
const strip = document.getElementById('galleryStrip');
if (strip) {
  let isDown = false, startX, scrollLeft;
  strip.addEventListener('mousedown', e => {
    isDown = true;
    strip.style.cursor = 'grabbing';
    startX = e.pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
  });
  strip.addEventListener('mouseleave', () => { isDown = false; strip.style.cursor = ''; });
  strip.addEventListener('mouseup',    () => { isDown = false; strip.style.cursor = ''; });
  strip.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - strip.offsetLeft;
    strip.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });
}

/* ── PARALLAX HERO ────────────────────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.28}px) scale(1.05)`;
  }, { passive: true });
}

/* ── NAV HIDE / SHOW ──────────────────────────────────────────────────── */
let lastScrollY = 0;
const nav = document.querySelector('.site-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80 && y > lastScrollY) {
      nav.style.opacity   = '0';
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.opacity   = '1';
      nav.style.transform = 'translateY(0)';
    }
    lastScrollY = y;
  }, { passive: true });
}

/* ── LIGHTBOX ─────────────────────────────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbName   = document.getElementById('lbName');
const lbLoc    = document.getElementById('lbLoc');
const lbCounter= document.getElementById('lbCounter');

let lbItems = [];
let lbIndex  = 0;

function buildLbItems() {
  lbItems = [];
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    const rawSrc = el.dataset.img || (el.tagName === 'IMG' ? el.src : el.querySelector('img')?.src) || '';
    const hqSrc  = rawSrc.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=90');
    const item   = { src: hqSrc, name: el.dataset.name || '', location: el.dataset.location || '' };
    lbItems.push(item);
    el.addEventListener('click', () => {
      lbIndex = lbItems.indexOf(item);
      openLb(lbIndex);
    });
  });
}

function openLb(idx) {
  const item = lbItems[idx];
  if (!item) return;
  lbImg.src = item.src;
  lbName.textContent    = item.name;
  lbLoc.textContent     = item.location;
  lbCounter.textContent = `${idx + 1} / ${lbItems.length}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLb() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 350);
}

function prevImg() { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; openLb(lbIndex); }
function nextImg() { lbIndex = (lbIndex + 1) % lbItems.length; openLb(lbIndex); }

if (lightbox) {
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', prevImg);
  document.getElementById('lbNext').addEventListener('click', nextImg);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  prevImg();
    if (e.key === 'ArrowRight') nextImg();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextImg() : prevImg();
  });

  buildLbItems();
}

/* ── COUNTER ANIMATION ────────────────────────────────────────────────── */
function animCount(el, target, suffix) {
  let start = null;
  const dur  = 1800;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(el => {
        animCount(el, +el.dataset.target, el.dataset.suffix || '');
      });
      statsObs.disconnect();
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsEl);
}
