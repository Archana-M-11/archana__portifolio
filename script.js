// ── Theme toggle ──
// (initial theme is already applied by the inline script in <head> to avoid a flash)
(function () {
  const root = document.documentElement;

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggleBtn');
    const icon = document.getElementById('themeToggleIcon');
    const syncIcon = () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      if (btn) btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    syncIcon();
    btn?.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncIcon();
    });
  });
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#') && href.length > 1) {
      const t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.offsetTop - 72, behavior: 'smooth' });
      }
    }
  });
});

// About read more
document.getElementById('readMoreBtn')?.addEventListener('click', function () {
  const c = document.getElementById('aboutFullContent');
  c.classList.toggle('revealed');
});

// Gmail + Copy
document.getElementById('openGmailBtn')?.addEventListener('click', () => {
  window.open('https://mail.google.com/mail/?view=cm&fs=1&to=archanamnair096@gmail.com&su=Hello%20Archana!&body=Hi%20Archana,%0A%0AI%20found%20you%20via%20your%20portfolio.%0A%0ARegards,', '_blank');
});
document.getElementById('copyEmailBtn')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('archanamnair096@gmail.com');
    const f = document.getElementById('contactFeedback');
    f.style.display = 'block';
    setTimeout(() => f.style.display = 'none', 2000);
  } catch {
    alert('Copy manually: archanamnair096@gmail.com');
  }
});

// Easter egg – Konami code
let k = [];
document.addEventListener('keydown', e => {
  k.push(e.key); k = k.slice(-10);
  if (k.join(',') === 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a')
    document.getElementById('easterEgg')?.classList.add('active');
});
let clicks = 0, clickTimer;
document.querySelector('.navbar-brand')?.addEventListener('click', e => {
  e.preventDefault(); clicks++;
  clearTimeout(clickTimer);
  if (clicks === 3) { document.getElementById('easterEgg')?.classList.add('active'); clicks = 0; }
  clickTimer = setTimeout(() => clicks = 0, 1000);
});

// Generic reveal-on-scroll for cards, timeline items, badges, etc.
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shown');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// Section-title / slide-meta fade-in
const fadeSecObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeSecObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-section').forEach(i => fadeSecObserver.observe(i));

// ── Projects 3D coverflow carousel ──
(function () {
  const track = document.getElementById('cfTrack');
  if (!track) return;
  const container = track.parentElement;
  const cards = Array.from(track.querySelectorAll('.cf-card'));
  const prevBtn = document.getElementById('cfPrev');
  const nextBtn = document.getElementById('cfNext');
  const dotsWrap = document.getElementById('cfDots');

  let currentIndex = 0;

  // Build dot indicators
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cf-dot';
    dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
    dot.addEventListener('click', () => { currentIndex = i; update(); });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

 function metrics() {
  const w = container.clientWidth;
  const step = Math.max(w * 0.42, 130);
  const extra = step * 0.15;
  return { step, extra };
}

  function update() {
    const { step, extra } = metrics();
    cards.forEach((card, index) => {
      const offset = index - currentIndex;
      card.classList.toggle('is-active', offset === 0);

      if (offset === 0) {
        card.style.transform = 'translateX(0) scale(1.12) rotateY(0deg)';
        card.style.zIndex = 10;
        card.style.opacity = 1;
      } else if (offset === 1) {
        card.style.transform = `translateX(${step}px) scale(.85) rotateY(-25deg)`;
        card.style.zIndex = 5;
        card.style.opacity = .8;
      } else if (offset === -1) {
        card.style.transform = `translateX(${-step}px) scale(.85) rotateY(25deg)`;
        card.style.zIndex = 5;
        card.style.opacity = .8;
      } else if (offset > 1) {
        card.style.transform = `translateX(${step + extra * offset}px) scale(.7) rotateY(-35deg)`;
        card.style.zIndex = 1;
        card.style.opacity = .35;
      } else {
        card.style.transform = `translateX(${-step + extra * offset}px) scale(.7) rotateY(35deg)`;
        card.style.zIndex = 1;
        card.style.opacity = .35;
      }
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === cards.length - 1;
  }

  nextBtn.addEventListener('click', () => { if (currentIndex < cards.length - 1) { currentIndex++; update(); } });
  prevBtn.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; update(); } });
  cards.forEach((card, index) => card.addEventListener('click', () => { currentIndex = index; update(); }));

  //

  document.querySelectorAll('.matrix-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const paneId = tab.getAttribute('data-pane');
    document.querySelectorAll('.matrix-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(paneId)?.classList.add('active');
  });
});

  // Swipe support for touch devices
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && currentIndex < cards.length - 1) { currentIndex++; update(); }
    else if (dx > 0 && currentIndex > 0) { currentIndex--; update(); }
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 120);
  });

  update();
})();

// ── Education simple carousel ──
(function () {
  const track = document.getElementById('education-track');
  if (!track) return;
  const container = track.parentElement;
  const cards = Array.from(track.children);
  const prevBtn = document.getElementById('eduPrev');
  const nextBtn = document.getElementById('eduNext');
  let pos = 0;

  function step() { return cards[0].offsetWidth + 20; }
  function maxVisible() { return Math.max(1, Math.floor(container.clientWidth / step())); }
  function maxPos() { return -(Math.max(0, cards.length - maxVisible())) * step(); }

  function update() {
    if (pos > 0) pos = 0;
    if (pos < maxPos()) pos = maxPos();
    track.style.transform = `translateX(${pos}px)`;
    prevBtn.disabled = pos >= 0;
    nextBtn.disabled = pos <= maxPos();
  }

  nextBtn.addEventListener('click', () => { pos -= step(); update(); });
  prevBtn.addEventListener('click', () => { pos += step(); update(); });

  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(update, 120); });

  update();
})();

// ── Roasting Corner flip card ──
(function () {
  const cardEnv = document.getElementById('flipEnv');
  if (!cardEnv) return;
  const btnBefore = document.getElementById('btnBefore');
  const btnAfter = document.getElementById('btnAfter');
  const slider = document.getElementById('flipSlider');

  function adjustSlider(activeButton) {
    slider.style.width = `${activeButton.offsetWidth}px`;
    slider.style.transform = `translateX(${activeButton.offsetLeft - 4}px)`;
  }

  btnBefore.addEventListener('click', () => {
    btnAfter.classList.remove('active');
    btnBefore.classList.add('active');
    cardEnv.classList.remove('flipped');
    adjustSlider(btnBefore);
  });

  btnAfter.addEventListener('click', () => {
    btnBefore.classList.remove('active');
    btnAfter.classList.add('active');
    cardEnv.classList.add('flipped');
    adjustSlider(btnAfter);
  });

  window.addEventListener('load', () => adjustSlider(btnBefore));
})();