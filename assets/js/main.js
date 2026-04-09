/* ===================================================
   Alrahma Dental Clinic – main.js
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── THEME TOGGLE ────────────────────────────────────
  // Persists user preference in localStorage
  // Default = dark. Reads from: document.documentElement[data-theme]
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('alrahma-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('alrahma-theme', next);
    // Ripple feedback
    themeToggle.style.transform = 'scale(0.92)';
    setTimeout(() => themeToggle.style.transform = '', 150);
  });

  // ── LOADER ──────────────────────────────────────────
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('hidden'), 1800);
  });

  // ── NAVBAR SCROLL ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── MOBILE MENU ─────────────────────────────────────
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('show');
    document.body.style.overflow = mobileNav?.classList.contains('show') ? 'hidden' : '';
  });
  const closeMobile = () => {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('show');
    document.body.style.overflow = '';
  };
  mobileClose?.addEventListener('click', closeMobile);
  mobileNav?.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMobile));

  // ── ACTIVE NAV LINK ─────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const updateActiveLink = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  };

  // ── REVEAL ON SCROLL ────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    io.observe(el);
  });

  // ── SERVICE CARD MOUSE PARALLAX ─────────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top)  / rect.height * 100).toFixed(1)}%`);
    });
  });

  // ── STATS COUNTER ANIMATION ─────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const countIO  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      let   start  = 0;
      const step   = target / 60;
      const tick   = () => {
        start = Math.min(start + step, target);
        el.textContent = prefix + Math.floor(start).toLocaleString('ar-SA') + suffix;
        if (start < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countIO.observe(c));

  // ── GALLERY LIGHTBOX ────────────────────────────────
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCap  = document.getElementById('lightboxCaption');
  const lightboxClose= document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let   currentGalleryIdx = 0;

  const openLightbox = (idx) => {
    const wrap = galleryItems[idx].querySelector('.gallery-img-wrap');
    const img  = wrap.querySelector('img');
    const cap  = galleryItems[idx].querySelector('.gallery-overlay span');
    if (!img || wrap.classList.contains('placeholder')) return;
    currentGalleryIdx  = idx;
    lightboxImg.src    = img.src;
    lightboxImg.alt    = img.alt;
    lightboxCap.textContent = cap?.textContent || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const navigateLightbox = (dir) => {
    let next = currentGalleryIdx + dir;
    if (next < 0) next = galleryItems.length - 1;
    if (next >= galleryItems.length) next = 0;
    openLightbox(next);
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click',  () => navigateLightbox(1));
  lightboxNext?.addEventListener('click',  () => navigateLightbox(-1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
  });

  // ── SMOOTH SCROLL ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── HERO CTA → CONTACT ───────────────────────────────
  document.querySelectorAll('.hero-cta-booking, .nav-cta').forEach(b => {
    b.addEventListener('click', () => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── HOURS: HIGHLIGHT TODAY ───────────────────────────
  // Highlights today's row in the hours card
  // Days: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const day = new Date().getDay();
  const openDays  = [0, 1, 2, 3, 6]; // Sun=0 (mapped: Sat-Wed for Arabic week)
  // Arabic week: Sat(6)–Wed(3) = open, Thu(4)=early close, Fri(5)=closed
  // Adjust "today" badge + open/closed state
  const isOpen    = openDays.includes(day) || day === 4; // Thu early close still open
  const isClosed  = day === 5; // Friday

  const openBadge = document.querySelector('.hours-open-badge');
  if (openBadge) {
    if (isClosed) {
      openBadge.textContent = 'مغلق اليوم';
      openBadge.style.cssText = 'background:rgba(248,113,113,0.12);color:#f87171;border:1px solid rgba(248,113,113,0.25)';
    } else {
      openBadge.textContent = 'مفتوح الآن';
      openBadge.style.cssText = 'background:rgba(52,211,153,0.12);color:#34d399;border:1px solid rgba(52,211,153,0.25)';
    }
  }

  // ── CONTACT MAP → Google Maps ────────────────────────
  // Clicking the map placeholder opens Google Maps
  document.querySelector('.contact-map')?.addEventListener('click', () => {
    window.open('https://maps.google.com/?q=24.7136,46.6753', '_blank', 'noopener');
  });

  // ── BACK TO TOP ON LOGO CLICK ────────────────────────
  document.querySelector('.logo-wrap')?.addEventListener('click', e => {
    if (e.currentTarget.tagName !== 'A') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

});
