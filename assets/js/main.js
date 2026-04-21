/* ===================================================
   Alrahma Dental Clinic – main.js  (v2 — fixed + enhanced)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── THEME TOGGLE ────────────────────────────────────
  const html = document.documentElement;
  const themeToggle       = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const savedTheme = localStorage.getItem('alrahma-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  const applyTheme = (btn) => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('alrahma-theme', next);
    if (btn) { btn.style.transform = 'scale(0.92)'; setTimeout(() => btn.style.transform = '', 150); }
  };
  themeToggle?.addEventListener('click',       () => applyTheme(themeToggle));
  themeToggleMobile?.addEventListener('click', () => applyTheme(themeToggleMobile));

  // ── LOADER ──────────────────────────────────────────
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('hidden'), 1800);
  });

  // ── PROGRESS BAR ────────────────────────────────────
  // Thin accent line at very top of viewport tracking scroll depth
  const progressBar = document.createElement('div');
  progressBar.id = 'scrollProgress';
  progressBar.style.cssText = [
    'position:fixed', 'top:0', 'right:0', 'height:3px',
    'background:linear-gradient(to left,#67e8f9,#38bdf8)',
    'z-index:10001', 'width:0%',
    'transition:width 0.1s linear',
    'border-radius:0 0 3px 3px',
    'box-shadow:0 0 10px rgba(56,189,248,0.6)',
    'pointer-events:none'
  ].join(';');
  document.body.prepend(progressBar);

  // ── NAVBAR ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  let   lastScroll = 0;

  // updateActiveLink — defined before onScroll so it can be called safely
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const updateActiveLink = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  };

  const onScroll = () => {
    const sy = window.scrollY;

    // Progress bar
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docH > 0 ? `${(sy / docH) * 100}%` : '0%';

    // Navbar scroll state
    navbar?.classList.toggle('scrolled', sy > 50);

    // Hide on scroll down, show on scroll up (only after passing navbar height)
    if (navbar && sy > 80) {
      if (sy > lastScroll + 4) {
        navbar.classList.add('nav-hidden');
      } else if (sy < lastScroll - 4) {
        navbar.classList.remove('nav-hidden');
      }
    } else if (navbar) {
      navbar.classList.remove('nav-hidden');
    }
    lastScroll = sy;

    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── MOBILE MENU ─────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const mobileClose= document.getElementById('mobileClose');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  const closeMobile = () => {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('show');
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  // FIX: wire mobileClose button (was missing)
  mobileClose?.addEventListener('click', closeMobile);
  mobileNav?.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMobile));
  mobileNav?.addEventListener('click', e => { if (e.target === mobileNav) closeMobile(); });

  // ── REVEAL ON SCROLL ────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 8) * 0.07}s`;
    io.observe(el);
  });

  // ── DOCTOR CARD 3D TILT ─────────────────────────────
  document.querySelectorAll('.doctor-card-v2').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.innerWidth <= 768) return;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width * 10;
      const dy = (e.clientY - cy) / rect.height * 10;
      card.style.transform = `translateY(-6px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all .4s cubic-bezier(0.16,1,0.3,1)';
    });
  });

  // ── SERVICES ACCORDION (mobile) ─────────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const wasOpen = card.classList.contains('svc-open');
      document.querySelectorAll('.service-card.svc-open').forEach(c => c.classList.remove('svc-open'));
      if (!wasOpen) card.classList.add('svc-open');
    });
    // Mouse parallax glow (desktop only)
    card.addEventListener('mousemove', e => {
      if (window.innerWidth <= 768) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top)  / rect.height * 100).toFixed(1)}%`);
    });
  });

  // ── MAGNETIC BUTTONS ────────────────────────────────
  // Subtle magnet pull on CTA buttons (desktop only)
  document.querySelectorAll('.btn-primary, .nav-cta, .doc-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (window.innerWidth <= 768) return;
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.18;
      const dy     = (e.clientY - cy) * 0.18;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── STATS COUNTER ANIMATION ─────────────────────────
  // FIX: removed ar-SA locale — caused prefix/suffix to break on some numbers
  const counters = document.querySelectorAll('[data-count]');
  const countIO  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el      = e.target;
      const target  = parseInt(el.dataset.count, 10);
      const suffix  = el.dataset.suffix || '';
      const prefix  = el.dataset.prefix || '';
      let   start   = 0;
      let   startTs = null;
      const duration = 1400; // ms — eased

      const tick = (ts) => {
        if (!startTs) startTs = ts;
        const elapsed  = ts - startTs;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        start = Math.round(eased * target);
        el.textContent = prefix + start.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countIO.observe(c));

  // ── GALLERY LIGHTBOX ────────────────────────────────
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCap   = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let   currentGalleryIdx = 0;

  const openLightbox = (idx) => {
    const wrap = galleryItems[idx].querySelector('.gallery-img-wrap');
    const img  = wrap?.querySelector('img');
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
  // FIX: was swapped — prev went +1, next went -1
  const navigateLightbox = (dir) => {
    let next = currentGalleryIdx + dir;
    if (next < 0) next = galleryItems.length - 1;
    if (next >= galleryItems.length) next = 0;
    openLightbox(next);
  };

  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click',  () => navigateLightbox(-1)); // FIX: was +1
  lightboxNext?.addEventListener('click',  () => navigateLightbox(+1)); // FIX: was -1
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Lightbox touch swipe support
  let lbTouchStartX = 0;
  lightbox?.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox?.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(dx) > 50) navigateLightbox(dx > 0 ? -1 : +1);
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(-1);
    if (e.key === 'ArrowLeft')  navigateLightbox(+1);
  });

  // ── TESTIMONIALS — expandable + swipe dots ──────────
  const testiCards = Array.from(document.querySelectorAll('.testi-card:not([aria-hidden])'));

  // FIX: testi-read-more-text was empty — now shows dynamic label
  testiCards.forEach(card => {
    const readMore = document.createElement('span');
    readMore.className = 'testi-read-more';
    const label = document.createElement('span');
    label.className = 'testi-read-more-text';
    label.textContent = 'اقرأ المزيد ›';
    readMore.appendChild(label);
    card.appendChild(readMore);

    const toggle = () => {
      card.classList.toggle('testi-expanded');
      label.textContent = card.classList.contains('testi-expanded') ? 'إخفاء ‹' : 'اقرأ المزيد ›';
    };
    readMore.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    card.addEventListener('click', toggle);
  });

  // Scroll indicator dots (mobile)
  const trackWrap = document.querySelector('.testi-track-wrap');

  if (testiCards.length > 0) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testi-dots';
    testiCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `المراجعة ${i + 1}`);
      dot.addEventListener('click', () => {
        testiCards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
      dotsContainer.appendChild(dot);
    });
    trackWrap?.parentElement?.appendChild(dotsContainer);

    trackWrap?.addEventListener('scroll', () => {
      const scrollLeft = trackWrap.scrollLeft;
      const cardWidth  = (testiCards[0]?.offsetWidth || 0) + 16;
      if (cardWidth === 0) return;
      const activeIdx  = Math.round(scrollLeft / cardWidth);
      dotsContainer.querySelectorAll('.testi-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIdx);
      });
    }, { passive: true });
  }

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
  const day       = new Date().getDay();
  const isClosed  = day === 5; // Friday
  const openBadge = document.querySelector('.hours-open-badge');
  if (openBadge) {
    if (isClosed) {
      openBadge.textContent = 'مغلق اليوم';
      openBadge.style.cssText = 'background:rgba(248,113,113,0.12);color:#f87171;border:1px solid rgba(248,113,113,0.25);font-size:.65rem;font-weight:700;padding:.18rem .55rem;border-radius:36px;letter-spacing:.05em';
    } else {
      openBadge.textContent = 'مفتوح الآن';
      openBadge.style.cssText = 'background:rgba(52,211,153,0.12);color:#34d399;border:1px solid rgba(52,211,153,0.25);font-size:.65rem;font-weight:700;padding:.18rem .55rem;border-radius:36px;letter-spacing:.05em';
    }
  }

  // ── CONTACT MAP → Google Maps ────────────────────────
  document.querySelector('.contact-map')?.addEventListener('click', () => {
    window.open('https://maps.google.com/?q=24.7136,46.6753', '_blank', 'noopener');
  });
  document.querySelector('.contact-map')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      window.open('https://maps.google.com/?q=24.7136,46.6753', '_blank', 'noopener');
    }
  });

  // ── FOOTER ACCORDION (mobile) ────────────────────────
  document.querySelectorAll('.footer-col').forEach(col => {
    const h5 = col.querySelector('h5');
    h5?.addEventListener('click', () => {
      const wasOpen = col.classList.contains('fc-open');
      document.querySelectorAll('.footer-col.fc-open').forEach(c => c.classList.remove('fc-open'));
      if (!wasOpen) col.classList.add('fc-open');
    });
  });

});
