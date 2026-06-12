/* ============================================
   main.js — Mahreen Indonesia Landing Page
   Lightweight vanilla JS, no dependencies
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     1. NAVBAR — scroll-based styling & toggle
  ------------------------------------------ */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  // Scroll-based class
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu on nav-link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------
     2. AOS — lightweight scroll animations
  ------------------------------------------ */
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.aosDelay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, delay);
          aosObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  aosElements.forEach(el => aosObserver.observe(el));

  /* ------------------------------------------
     3. COUNTDOWN TIMER
  ------------------------------------------ */
  const deadline = new Date('2025-08-31T23:59:59+07:00').getTime();

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  const updateCountdown = () => {
    const now  = Date.now();
    const diff = deadline - now;

    if (diff <= 0) {
      [cdDays, cdHours, cdMins, cdSecs].forEach(el => { el.textContent = '00'; });
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days  = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins  = Math.floor((totalSecs % 3600) / 60);
    const secs  = totalSecs % 60;

    cdDays.textContent  = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent  = pad(mins);
    cdSecs.textContent  = pad(secs);
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ------------------------------------------
     4. ANIMATED COUNTER (stat numbers)
  ------------------------------------------ */
  const stats = [
    { el: document.getElementById('stat1'), target: 10000, suffix: 'K+', divisor: 1000 },
    { el: document.getElementById('stat2'), target: 34,    suffix: '',   divisor: 1    },
    { el: document.getElementById('stat3'), target: 500,   suffix: '+',  divisor: 1    },
  ];

  const formatStat = (val, divisor, suffix) => {
    if (divisor > 1) return Math.round(val / divisor) + suffix;
    return Math.round(val) + suffix;
  };

  const animateStat = (stat) => {
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.el.textContent = formatStat(stat.target * eased, stat.divisor, stat.suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statsSection = document.querySelector('.hero-stats');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        stats.forEach(s => animateStat(s));
        statsObserver.disconnect();
      }
    },
    { threshold: 0.5 }
  );
  if (statsSection) statsObserver.observe(statsSection);

  /* ------------------------------------------
     5. BUTTON — ripple effect on CTA
  ------------------------------------------ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.2);
        border-radius:50%;
        transform:scale(0);
        animation:rippleAnim 0.6s linear;
        pointer-events:none;
      `;
      // inject keyframes once
      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = '@keyframes rippleAnim{to{transform:scale(1);opacity:0}}';
        document.head.appendChild(style);
      }
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ------------------------------------------
     6. Smooth scrolling for anchor links
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

})();
