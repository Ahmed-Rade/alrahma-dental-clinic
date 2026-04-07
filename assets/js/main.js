/* ===================================================
   Alrahma Dental Clinic – main.js
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const mobileClose= document.getElementById('mobileClose');

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
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');
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
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
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
      card.style.setProperty('--my', `${((e.clientY - rect.top)  / rect.height* 100).toFixed(1)}%`);
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

  // ── BOOKING FORM ─────────────────────────────────────
  const form = document.getElementById('bookingForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.btn-submit');
    const orig = btn.textContent;
    btn.textContent = '✓ تم الإرسال بنجاح';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      form.reset();
    }, 3000);
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

});
