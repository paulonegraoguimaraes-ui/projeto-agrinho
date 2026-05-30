/* ══════════════════════════════════════════
   AGRO PARANÁ — script.js
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     NAVBAR: scroll shadow + active link
  ───────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navAs    = Array.from(document.querySelectorAll('.nav-links a'));

  function updateNav() {
    // Scroll shadow
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });
    navAs.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run once on load

  /* ─────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────── */
  const toggle  = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when any link is clicked
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ─────────────────────────────────────────
     COUNTER ANIMATION
  ───────────────────────────────────────── */
  function animateCounter(el) {
    if (el.dataset.done) return; // prevent double-firing
    el.dataset.done = '1';

    const target   = parseInt(el.dataset.target, 10);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const DURATION = 1800; // ms
    let   startTs  = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(ts) {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / DURATION, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + target + suffix; // ensure exact final value
      }
    }

    requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────────────
     INTERSECTION OBSERVER — scroll reveal
  ───────────────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;

        // Add visible class → triggers CSS fade-up + progress bars
        target.classList.add('visible');

        // Animate any counters found inside this element
        target.querySelectorAll('[data-target]').forEach(animateCounter);

        // Stop observing — animation only plays once
        observer.unobserve(target);
      });
    },
    {
      threshold:  0.18,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  // Observe every element that should animate on scroll
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

})();
                          
